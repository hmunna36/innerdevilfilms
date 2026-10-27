// Renders ../lust.html to an MP4: each frame is drawn by renderAt(t) in headless Chrome, read back as JPEG
// and piped into ffmpeg together with ../audio/mix.wav.   usage: node render.mjs [out.mp4] [fromSec toSec]
import { createRequire } from 'node:module'; import { spawn } from 'node:child_process'; import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.cache/cp/node/node_modules/playwright-core');
const FPS = 30, here = path.dirname(new URL(import.meta.url).pathname);
const out = process.argv[2] || path.join(here, '..', 'LUST - It Watches Back.mp4');
const from = +(process.argv[3] || 0), to = process.argv[4] ? +process.argv[4] : null;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(here, '..', 'lust.html'));
const dur = to ?? await page.evaluate('DUR'), n = Math.round((dur - from) * FPS);
const ff = spawn(process.env.HOME + '/.cache/cp/bin/ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  ...(from === 0 && !to ? ['-i', path.join(here, '..', 'audio', 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k'] : []),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-shortest', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < n; f++) {
  const b64 = await page.evaluate(t => { renderAt(t); return cv.toDataURL('image/jpeg', .95).slice(23); }, from + f / FPS);
  if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`frame ${f}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`done: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s → ${out}`);
