#!/usr/bin/env node
// The stage's renderer (the look of film 07; films and Shorts). <folder> is a film (films/NN-slug: cues.js, film.js)
// or a Short (shorts/NN-slug: short.js, whose first line is `// film: films/NN-slug`). Output goes to <folder>/out/.
//   node stage/render.mjs <folder> still <t> [name]                      -> out/still_<name|t>.jpg
//   node stage/render.mjs <folder> sheet <a> <b> [n=12] [name] [--cols=4 --tw=640] [--safe]
//                                                                         -> out/sheet_<name>.jpg (n frames from a to b; --safe
//                                                                            draws a Short's safe area on every frame)
//   node stage/render.mjs <folder> frames <a> <b>                        -> out/frames/NNNNN.jpg (frame = round(t * 30)); b exclusive
//   node stage/render.mjs <folder> cues                                  -> <folder>/cues_edit.json (the times the sound is built from)
//   node stage/render.mjs <film> thumb <t> "<WORD>" "<HOOK>" [--cam=z,x,y] [--pos=top|bottom|left]
//                                                                         -> <film>/thumb_code.jpg (1280 x 720: the frame at t without its
//                                                                            words, the word huge, the hook small; the cloud's stand-in thumbnail)
//   node stage/render.mjs <folder> info                                  -> prints { dur, font_ok }
// --font=mac renders in the Mac's Chalkboard SE (film 07 as delivered); the default is the bundled font, same everywhere.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? '1']; })), [FOLDER, mode, A, B, N, NAME] = args.filter(a => !a.startsWith('--'));
if (!FOLDER || !mode) { console.error('usage: render.mjs <folder> still|sheet|frames|cues|info …'); process.exit(1); }
const dir = path.resolve(FOLDER), isShort = fs.existsSync(path.join(dir, 'short.js'));
let filmDir = dir;
if (isShort) { const m = /^\/\/\s*film:\s*(\S+)/m.exec(fs.readFileSync(path.join(dir, 'short.js'), 'utf8')); if (!m) { console.error('short.js must start with  // film: films/NN-slug'); process.exit(1); } filmDir = path.resolve(HERE, '..', m[1]); }
if (!fs.existsSync(path.join(filmDir, 'film.js'))) { console.error(`no film.js in ${filmDir}: run stage/build.sh ${path.relative(process.cwd(), filmDir)}`); process.exit(1); }
const pwPath = [process.env.PLAYWRIGHT_MODULE, path.join(HERE, '../engine/node_modules/playwright-core'), path.join(os.homedir(), '.cache/cp/node/node_modules/playwright-core')].filter(Boolean).find(p => fs.existsSync(p));
const pw = createRequire(import.meta.url)(pwPath);
const a = ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--allow-file-access-from-files', '--hide-scrollbars', '--mute-audio'];
const saved = path.join(process.env.IDF_HOME || path.join(os.homedir(), '.cache/idf'), 'chrome-path');   // the cloud's browser (bin/cloud-setup.sh)
const exe = process.env.IDF_CHROME || process.env.CHROME_PATH || (fs.existsSync(saved) ? fs.readFileSync(saved, 'utf8').trim() : '');
const browser = await pw.chromium.launch({ headless: true, ...(exe ? { executablePath: exe, args: a } : { channel: 'chrome', args: a }) });
const page = await browser.newPage({ viewport: isShort ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
let bad = 0; page.on('pageerror', e => { bad++; if (bad < 6) console.error('[page error]', e.message); });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
const rel = p => path.relative(HERE, p).split(path.sep).join('/');
const q = new URLSearchParams({ film: rel(filmDir), ...(isShort ? { short: rel(dir) } : {}), ...(flags.font ? { font: flags.font } : {}) });
await page.goto(`file://${path.join(HERE, 'page.html')}?${q}`);
await page.waitForFunction(() => window.READY === true || window.LOAD_ERROR, null, { timeout: 60000 });
const err = await page.evaluate(() => window.LOAD_ERROR || null); if (err) { console.error(err); await browser.close(); process.exit(1); }
if (!(await page.evaluate(() => window.FONT_OK))) { console.error('the handwriting font did not load (stage/fonts)'); await browser.close(); process.exit(1); }
const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
const opt = flags.safe ? { safe: true } : null;
const grab = async t => { await page.evaluate(([tt, o]) => window.DRAW(tt, o), [t, opt]); return Buffer.from(await page.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]), 'base64'); };
if (mode === 'still') { const f = path.join(out, `still_${B || A}.jpg`); fs.writeFileSync(f, await grab(+A)); console.log(f); }
else if (mode === 'sheet') { const n = +(N || 12), times = Array.from({ length: n }, (_, i) => +A + (+B - +A) * (i + .5) / n);
  const b64 = await page.evaluate(([ts, c, w, o]) => window.SHEET(ts, c, w, o), [times, +(flags.cols || (isShort ? 8 : 4)), +(flags.tw || (isShort ? 300 : 640)), opt]); const f = path.join(out, `sheet_${NAME || A}.jpg`); fs.writeFileSync(f, Buffer.from(b64, 'base64')); console.log(f); }
else if (mode === 'frames') { const fd = path.join(out, 'frames'); fs.mkdirSync(fd, { recursive: true }); const f0 = Math.round(+A * 30), f1 = Math.round(+B * 30);
  for (let i = f0; i < f1; i++) fs.writeFileSync(path.join(fd, String(i).padStart(5, '0') + '.jpg'), await grab(i / 30)); console.log(`frames ${f0}..${f1 - 1}`); }
else if (mode === 'cues') { const j = await page.evaluate(s => s ? SHORTCUES() : EDITCUES(), isShort); fs.writeFileSync(path.join(dir, 'cues_edit.json'), JSON.stringify(j, null, 1)); console.log('END', j.END, 'cuts', j.cuts.length, 'cues', Object.keys(j.cues).length); }
else if (mode === 'thumb') { const cam = flags.cam ? flags.cam.split(',').map(Number) : null; const b64 = await page.evaluate(([t, w, h, c, p]) => window.THUMBJPG(t, w, h, c, p), [+A, B || '', N || '', cam, flags.pos || 'top']); const f = path.join(dir, 'thumb_code.jpg'); fs.writeFileSync(f, Buffer.from(b64, 'base64')); console.log(f); }
else if (mode === 'info') console.log(JSON.stringify({ dur: await page.evaluate(() => window.DUR), font_ok: true, short: isShort }));
else console.error('usage: render.mjs <folder> still|sheet|frames|cues|info …');
await browser.close(); process.exit(bad ? 2 : 0);
