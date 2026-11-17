#!/usr/bin/env node
// node render.mjs still <t> [name]            -> out/still_<name|t>.jpg
// node render.mjs sheet <a> <b> [n=12] [name] [--cols=4 --tw=640]  -> out/sheet_<name>.jpg   (n frames from a to b)
// node render.mjs frames <a> <b>              -> out/frames/NNNNN.jpg (frame number = round(t * 30)); b exclusive
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('='))), [mode, A, B, N, NAME] = args.filter(a => !a.startsWith('--'));
const pwPath = [process.env.PLAYWRIGHT_MODULE, path.join(HERE, '../../engine/node_modules/playwright-core'), path.join(os.homedir(), '.cache/cp/node/node_modules/playwright-core')].filter(Boolean).find(p => fs.existsSync(p));
const pw = createRequire(import.meta.url)(pwPath);
const a = ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--allow-file-access-from-files', '--hide-scrollbars', '--mute-audio'];
const exe = process.env.IDF_CHROME || process.env.CHROME_PATH;
const browser = await pw.chromium.launch({ headless: true, ...(exe ? { executablePath: exe, args: a } : { channel: 'chrome', args: a }) });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
let bad = 0; page.on('pageerror', e => { bad++; if (bad < 6) console.error('[page error]', e.message); });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
await page.goto(`file://${path.join(HERE, 'page.html')}`);
await page.waitForFunction(() => window.READY === true || window.LOAD_ERROR, null, { timeout: 60000 });
const err = await page.evaluate(() => window.LOAD_ERROR || null); if (err) { console.error(err); await browser.close(); process.exit(1); }
const out = path.join(HERE, 'out'); fs.mkdirSync(out, { recursive: true });
const grab = async t => { await page.evaluate(tt => window.DRAW(tt), t); return Buffer.from(await page.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]), 'base64'); };
if (mode === 'still') { const f = path.join(out, `still_${B || A}.jpg`); fs.writeFileSync(f, await grab(+A)); console.log(f); }
else if (mode === 'sheet') { const n = +(N || 12), times = Array.from({ length: n }, (_, i) => +A + (+B - +A) * (i + .5) / n);
  const b64 = await page.evaluate(([ts, c, w]) => window.SHEET(ts, c, w), [times, +(flags.cols || 4), +(flags.tw || 640)]); const f = path.join(out, `sheet_${NAME || A}.jpg`); fs.writeFileSync(f, Buffer.from(b64, 'base64')); console.log(f); }
else if (mode === 'frames') { const fd = path.join(out, 'frames'); fs.mkdirSync(fd, { recursive: true }); const f0 = Math.round(+A * 30), f1 = Math.round(+B * 30);
  for (let i = f0; i < f1; i++) fs.writeFileSync(path.join(fd, String(i).padStart(5, '0') + '.jpg'), await grab(i / 30)); console.log(`frames ${f0}..${f1 - 1}`); }
else if (mode === 'cues') { const j = await page.evaluate(() => EDITCUES()); fs.writeFileSync(path.join(HERE, 'cues_edit.json'), JSON.stringify(j, null, 1)); console.log('END', j.END, 'cuts', j.cuts.length, 'cues', Object.keys(j.cues).length); }
else console.error('usage: render.mjs still|sheet|frames|cues …');
await browser.close(); process.exit(bad ? 2 : 0);
