#!/usr/bin/env node
// The mechanical checks on a finished MP4 (the eye checks are in reference/qa.md):
//   node engine/qa.mjs <video.mp4> [--sheet out.png] [--every 1]
// streams (H.264 yuv420p 30 fps, AAC 48 kHz stereo), the size (1920x1080 film, 1080x1920 Short), the length (film
// 1:30-2:30, Short 25-40 s), the delivered loudness (film -18 LUFS, Short -16, each +-1; true peak at most -1 dBTP;
// the owner, 31 Oct 2026: the first films at -14 were "very loud"), every black stretch
// over .25 s (each must be a planned one), and a contact sheet of one frame a second. Exit 1 if a check fails.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync, spawnSync, spawn } from 'node:child_process';

const args = process.argv.slice(2), mp4 = args.find(a => !a.startsWith('--') && a.endsWith('.mp4'));
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
if (!mp4 || !fs.existsSync(mp4)) { console.error('usage: qa.mjs <video.mp4> [--sheet out.png] [--every 1]'); process.exit(2); }
const bin = name => {
  const env = process.env[name.toUpperCase()];
  if (env) return env;
  if (spawnSync(name, ['-version'], { stdio: 'ignore' }).status === 0) return name;
  const mac = path.join(os.homedir(), '.cache/cp/bin', name);
  if (fs.existsSync(mac)) return mac;
  console.error(`qa: ${name} is missing`); process.exit(2);
};
const FF = bin('ffmpeg'), FP = bin('ffprobe');
const probe = JSON.parse(execFileSync(FP, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4]).toString());
const v = probe.streams.find(s => s.codec_type === 'video'), a = probe.streams.find(s => s.codec_type === 'audio');
const dur = +probe.format.duration, short = v && v.height > v.width;
const checks = [];
const check = (ok, what) => checks.push([ok, what]);
check(v && v.codec_name === 'h264' && v.pix_fmt === 'yuv420p' && v.r_frame_rate === '30/1', `video: ${v ? `${v.codec_name} ${v.pix_fmt} ${v.r_frame_rate} fps` : 'none'}`);
check(v && (short ? v.width === 1080 && v.height === 1920 : v.width === 1920 && v.height === 1080), `size: ${v ? `${v.width}x${v.height}` : '?'} (${short ? 'Short' : 'film'})`);
check(a && a.codec_name === 'aac' && +a.sample_rate === 48000 && a.channels === 2, `audio: ${a ? `${a.codec_name} ${a.sample_rate} Hz, ${a.channels} ch` : 'NONE'}`);
check(short ? dur >= 25 && dur <= 40 : dur >= 90 && dur <= 150, `length: ${dur.toFixed(2)} s (${short ? 'Short 25-40 s' : 'film 1:30-2:30'})`);
// loudness as delivered (loudnorm's measurement of the AAC track; it is in every ffmpeg build)
const ln = spawnSync(FF, ['-nostats', '-hide_banner', '-i', mp4, '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const lj = JSON.parse(ln.slice(ln.lastIndexOf('{'), ln.lastIndexOf('}') + 1) || '{}'), I = +lj.input_i, TP = +lj.input_tp, T = short ? -16 : -18;
check(Math.abs(I - T) <= 1, `loudness: ${I} LUFS (target ${T} +-1), range ${lj.input_lra} LU`);
check(TP <= -1, `true peak: ${TP} dBTP (at most -1)`);
// frames as raw pixels at a small size (needs only the scale filter and the rawvideo encoder: the Mac's small ffmpeg has both)
// keep(i) picks which frames to hold (every frame is decoded, so frame i is exactly at i / 30 s)
const raw = (w, fmt, keep = () => true) => new Promise((ok, no) => {
  const h = Math.round(w * v.height / v.width / 2) * 2, size = w * h * (fmt === 'gray' ? 1 : 3), frames = [];
  const p = spawn(FF, ['-v', 'error', '-i', mp4, '-vf', `scale=${w}:${h}`, '-f', 'image2pipe', '-c:v', 'rawvideo', '-pix_fmt', fmt, '-']);
  let pend = Buffer.alloc(0), i = 0;
  p.stdout.on('data', d => {
    pend = Buffer.concat([pend, d]);
    while (pend.length >= size) { if (keep(i)) frames.push(Buffer.from(pend.subarray(0, size))); pend = pend.subarray(size); i++; }
  });
  p.on('close', c => c ? no(new Error('ffmpeg could not decode ' + mp4)) : ok({ w, h, frames }));
});
// black stretches: frames with nothing brighter than 24 of 255 (text on black is not black) for more than .25 s
const g = await raw(120, 'gray'), fps = 30, blacks = [];
let run = null;
g.frames.forEach((f, i) => {
  let m = 0; for (const b of f) if (b > m) m = b;
  const dark = m < 24;
  if (dark && run === null) run = i;
  if ((!dark || i === g.frames.length - 1) && run !== null) { if ((i - run) / fps > .25) blacks.push(`${(run / fps).toFixed(2)}-${(i / fps).toFixed(2)} s`); run = null; }
});
// contact sheet: one frame every N seconds, 8 (Short) or 6 (film) to a row, tiled and written as a PNG here
const every = +(opt('every') || 1), sheet = path.resolve(opt('sheet') || mp4.replace(/\.mp4$/, '') + '_sheet.png');
const cols = short ? 8 : 6, c = await raw(short ? 240 : 320, 'rgb24', i => i % Math.round(30 * every) === 0), rows = Math.ceil(c.frames.length / cols), pad = 4;
const SW = cols * (c.w + pad), SH = rows * (c.h + pad), buf = Buffer.alloc(SW * SH * 3, 0x22);
c.frames.forEach((f, i) => {
  const x0 = (i % cols) * (c.w + pad), y0 = Math.floor(i / cols) * (c.h + pad);
  for (let y = 0; y < c.h; y++) f.copy(buf, ((y0 + y) * SW + x0) * 3, y * c.w * 3, (y + 1) * c.w * 3);
});
const chunk = (type, data) => {
  const t = Buffer.from(type), len = Buffer.alloc(4), crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length); crc.writeUInt32BE(zlib.crc32(Buffer.concat([t, data])) >>> 0);
  return Buffer.concat([len, t, data, crc]);
};
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SW, 0); ihdr.writeUInt32BE(SH, 4); ihdr[8] = 8; ihdr[9] = 2;
const rowsBuf = Buffer.alloc(SH * (SW * 3 + 1));
for (let y = 0; y < SH; y++) buf.copy(rowsBuf, y * (SW * 3 + 1) + 1, y * SW * 3, (y + 1) * SW * 3);
fs.writeFileSync(sheet, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rowsBuf, { level: 6 })), chunk('IEND', Buffer.alloc(0))]));
for (const [ok, what] of checks) console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`);
console.log(`info black stretches over .25 s (each must be planned): ${blacks.length ? blacks.join(', ') : 'none'}`);
console.log(`info contact sheet (one frame every ${every} s, left to right): ${fs.existsSync(sheet) ? sheet : 'not made'}`);
process.exit(checks.every(c => c[0]) ? 0 : 1);
