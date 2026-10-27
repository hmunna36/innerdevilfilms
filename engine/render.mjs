#!/usr/bin/env node
// Renders the engine's films and Shorts (engine/player.html) in headless Chrome: each frame is renderAt(t) on the canvas,
// read back as a JPEG and piped into ffmpeg. Several browsers render chunks of the film at once, and the chunks are
// joined without re-encoding. Paths are folders from the repo root.
//
//   node engine/render.mjs film films/03-lust [--out x.mp4] [--from s --to s] [--jobs n] [--no-audio] [--audio a.wav]
//   node engine/render.mjs short shorts/15-lust-hook [--out x.mp4] [--jobs n] [--no-audio]
//   node engine/render.mjs stills film|short <folder> --at 1,2.5,40 [--out dir]           one JPEG per time
//   node engine/render.mjs sheet film|short <folder> [--every 1 | --at …] [--cols 6] [--width 270] [--safe] [--out x.jpg]
//   node engine/render.mjs info film|short <folder>                                        duration, cuts, a Short's sound plan
//   node engine/render.mjs thumb films/NN-slug [--out x.jpg]                              the code-drawn thumbnail (FILM.thumb)
//
// Defaults: a film renders to <folder>/filmNN.mp4 with <folder>/audio/mix.wav (made by its mix.py); a Short to
// <folder>/shortNN.mp4 with <folder>/mix.wav (made by engine/audio/short_mix.py from `info`). Both names are git-ignored.
// Writes to <out>.rendering.mp4 and renames it when done, so a cut-off render never leaves a broken file behind.
// Toolchain: playwright-core (engine/node_modules, `npm ci` in engine/), a Chrome or Chromium (IDF_CHROME, else
// ~/.cache/idf/chrome-path from bin/cloud-setup.sh, else the Mac's Google Chrome), ffmpeg (FFMPEG, PATH or ~/.cache/cp/bin).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const HERE = path.dirname(new URL(import.meta.url).pathname), REPO = path.resolve(HERE, '..'), FPS = 30;
const argv = process.argv.slice(2), flags = {}, pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { const k = argv[i].slice(2); flags[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
  else pos.push(argv[i]);
}
const die = m => { console.error('render: ' + m); process.exit(1); };
const [cmd, a1, a2] = pos;
if (!cmd) die('usage: render.mjs film|short|stills|sheet|info …');

function playwright() {
  const tries = [process.env.PLAYWRIGHT_MODULE, path.join(HERE, 'node_modules/playwright-core'), path.join(os.homedir(), '.cache/cp/node/node_modules/playwright-core')].filter(Boolean);
  for (const t of tries) if (fs.existsSync(t)) return createRequire(import.meta.url)(t);
  die('playwright-core is missing: run `npm ci` in engine/ (bin/cloud-setup.sh does it)');
}
function browserOpts() {
  const args = ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--allow-file-access-from-files', '--hide-scrollbars', '--mute-audio'];
  const saved = path.join(os.homedir(), '.cache/idf/chrome-path');
  const exe = process.env.IDF_CHROME || process.env.CHROME_PATH || (fs.existsSync(saved) && fs.readFileSync(saved, 'utf8').trim());
  if (exe) return { executablePath: exe, args };
  if (process.platform === 'darwin') return { channel: 'chrome', args };
  die('no browser: set IDF_CHROME, or run bin/cloud-setup.sh (it writes ~/.cache/idf/chrome-path)');
}
function ffmpegBin() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return 'ffmpeg'; } catch { /* not on PATH */ }
  const mac = path.join(os.homedir(), '.cache/cp/bin/ffmpeg');
  if (fs.existsSync(mac)) return mac;
  die('ffmpeg is missing');
}
const pageURL = (kind, folder) => `file://${path.join(HERE, 'player.html')}?${kind}=${encodeURIComponent(folder)}&render=1`;
async function openPage(pw, kind, folder) {
  const browser = await pw.chromium.launch({ headless: true, ...browserOpts() });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('[page error]', e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('[page]', m.text()); });
  await page.goto(pageURL(kind, folder));
  await page.waitForFunction(() => window.READY === true || window.LOAD_ERROR, null, { timeout: 120000 });
  const err = await page.evaluate(() => window.LOAD_ERROR || null);
  if (err) { await browser.close(); die(`${folder}: ${err}`); }
  return { browser, page };
}
const numOf = folder => (path.basename(folder).match(/^(\d+)/) || [, 'x'])[1];

async function info(kind, folder) {
  const pw = playwright(), { browser, page } = await openPage(pw, kind, folder);
  const i = await page.evaluate(() => window.info());
  await browser.close();
  return i;
}

async function renderVideo(kind, folder) {
  const pw = playwright(), ff = ffmpegBin();
  const meta = await info(kind, folder);
  const from = +(flags.from || 0), to = flags.to ? +flags.to : meta.dur, n = Math.round((to - from) * FPS);
  const out = path.resolve(flags.out || path.join(REPO, folder, `${kind}${numOf(folder)}.mp4`));
  let audio = flags['no-audio'] ? null : flags.audio ? path.resolve(flags.audio) : path.join(REPO, folder, kind === 'film' ? 'audio/mix.wav' : 'mix.wav');
  if (audio && !fs.existsSync(audio)) die(`no sound at ${path.relative(REPO, audio)}: build it first (reference/engine.md, "Sound"), or pass --no-audio`);
  const jobs = Math.max(1, Math.min(+(flags.jobs || process.env.RENDER_JOBS || Math.max(1, Math.min(6, os.cpus().length, os.totalmem() / 2 ** 30 / 1.6) | 0)), Math.ceil(n / 60)));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'idf-render-'));
  console.log(`${kind} ${folder}: ${n} frames (${from}-${to} s), ${meta.w}x${meta.h}, ${jobs} browsers -> ${path.relative(REPO, out)}`);
  const t0 = Date.now(), per = Math.ceil(n / jobs);
  let done = 0, lastLog = 0;
  await Promise.all([...Array(jobs).keys()].map(async j => {
    const a = j * per, b = Math.min(n, a + per);
    if (a >= b) return;
    const { browser, page } = await openPage(pw, kind, folder);
    const enc = spawn(ff, ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
      '-profile:v', 'high', '-threads', '2', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      path.join(tmp, `c${String(j).padStart(2, '0')}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise(r => enc.on('close', r));
    for (let f = a; f < b; f++) {
      const b64 = await page.evaluate(t => window.frame(t, .95), from + f / FPS);
      if (!enc.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => enc.stdin.once('drain', r));
      if (++done - lastLog >= 150) { lastLog = done; const s = (Date.now() - t0) / 1000; console.log(`  ${done}/${n} frames, ${s.toFixed(0)} s, about ${((n - done) * s / done / 60).toFixed(1)} min left`); }
    }
    enc.stdin.end(); await closed; await browser.close();
    if (enc.exitCode) die(`ffmpeg failed on chunk ${j}`);
  }));
  const list = path.join(tmp, 'list.txt');
  fs.writeFileSync(list, fs.readdirSync(tmp).filter(f => f.endsWith('.mp4')).sort().map(f => `file '${path.join(tmp, f)}'`).join('\n'));
  const part = out.replace(/\.mp4$/, '') + '.rendering.mp4', dur = (n / FPS).toFixed(3);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const join = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list];
  if (audio) join.push('-ss', String(from), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000');
  join.push('-c:v', 'copy', '-t', dur, '-movflags', '+faststart', part);
  execFileSync(ff, join, { stdio: 'inherit' });
  fs.renameSync(part, out);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`done: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s (${((Date.now() - t0) / n).toFixed(0)} ms a frame overall) -> ${path.relative(REPO, out)}, ${(fs.statSync(out).size / 1e6).toFixed(1)} MB`);
}

async function stills(kind, folder) {
  const pw = playwright(), { browser, page } = await openPage(pw, kind, folder);
  const dur = await page.evaluate(() => window.DUR), outDir = path.resolve(flags.out || path.join(os.tmpdir(), 'idf-stills'));
  fs.mkdirSync(outDir, { recursive: true });
  const at = String(flags.at || '0').split(',').map(Number);
  for (const t of at) {
    const b64 = await page.evaluate(t => window.frame(t, .92), Math.min(t, dur - 1 / FPS));
    const f = path.join(outDir, `${kind}_${t.toFixed(2)}.jpg`);
    fs.writeFileSync(f, Buffer.from(b64, 'base64')); console.log(f);
  }
  await browser.close();
}

async function thumb(folder) {
  const pw = playwright(), { browser, page } = await openPage(pw, 'film', folder);
  const out = path.resolve(flags.out || path.join(REPO, folder, 'thumb_code.jpg'));
  fs.writeFileSync(out, Buffer.from(await page.evaluate(() => window.thumb(.9)), 'base64'));
  await browser.close();
  console.log(`${out} (${(fs.statSync(out).size / 1e3).toFixed(0)} KB)`);
}

async function sheet(kind, folder) {
  const pw = playwright(), { browser, page } = await openPage(pw, kind, folder);
  const dur = await page.evaluate(() => window.DUR);
  const times = flags.at ? String(flags.at).split(',').map(Number)
    : [...Array(Math.floor(dur / +(flags.every || 1)) + 1).keys()].map(i => Math.min(dur - 1 / FPS, i * +(flags.every || 1) + +(flags.offset || 0)));
  const b64 = await page.evaluate(([times, o]) => window.sheet(times, o), [times, { cols: +(flags.cols || 6), cellW: flags.width ? +flags.width : undefined, safe: !!flags.safe }]);
  const out = path.resolve(flags.out || path.join(os.tmpdir(), `idf-sheet-${kind}.jpg`));
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  await browser.close();
  console.log(out);
}

const kind = cmd === 'film' || cmd === 'short' ? cmd : cmd === 'thumb' ? 'film' : a1, folder = cmd === 'film' || cmd === 'short' || cmd === 'thumb' ? a1 : a2;
if (!['film', 'short'].includes(kind) || !folder) die('which film or Short? e.g. `render.mjs film films/03-lust`');
if (!fs.existsSync(path.join(REPO, folder, kind === 'film' ? 'film.js' : 'short.js'))) die(`no ${kind}.js in ${folder}`);
if (cmd === 'film' || cmd === 'short') await renderVideo(kind, folder);
else if (cmd === 'stills') await stills(kind, folder);
else if (cmd === 'sheet') await sheet(kind, folder);
else if (cmd === 'info') console.log(JSON.stringify(await info(kind, folder), null, 1));
else if (cmd === 'thumb') await thumb(folder);
else die('unknown command ' + cmd);
