#!/usr/bin/env node
// Design boards: node render.mjs <dir> [still …] [--t=1.5] [--frames=N --fps=30 --from=0]   ->  out/<dir>_<still>.jpg
// <dir>.js defines  const STILLS = { name: t => { …draw on the global ctx, 1920 x 1080… } }.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('='))), pos = args.filter(a => !a.startsWith('--'));
const [dir, ...want] = pos; if (!dir) { console.error('usage: render.mjs <dir> [still …]'); process.exit(1); }
const pwPath = [process.env.PLAYWRIGHT_MODULE, path.join(HERE, '../../engine/node_modules/playwright-core'), path.join(os.homedir(), '.cache/cp/node/node_modules/playwright-core')].filter(Boolean).find(p => fs.existsSync(p));
const pw = createRequire(import.meta.url)(pwPath);
const a = ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--allow-file-access-from-files', '--hide-scrollbars', '--mute-audio'];
const exe = process.env.IDF_CHROME || process.env.CHROME_PATH;
const browser = await pw.chromium.launch({ headless: true, ...(exe ? { executablePath: exe, args: a } : { channel: 'chrome', args: a }) });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
let bad = 0; page.on('pageerror', e => { bad++; console.error('[page error]', e.message); });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
await page.goto(`file://${path.join(HERE, 'page.html')}?dir=${dir}`);
await page.waitForFunction(() => window.READY === true || window.LOAD_ERROR, null, { timeout: 60000 });
const err = await page.evaluate(() => window.LOAD_ERROR || null); if (err) { console.error(err); await browser.close(); process.exit(1); }
const names = want.length ? want : await page.evaluate(() => Object.keys(STILLS));
const out = path.join(HERE, 'out'); fs.mkdirSync(out, { recursive: true });
const shoot = async (name, t, file) => { await page.evaluate(([n, tt]) => window.DRAW(n, tt), [name, t]); const b64 = await page.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.92).split(',')[1]); fs.writeFileSync(file, Buffer.from(b64, 'base64')); };
for (const n of names) {
  if (flags.frames) { const fd = path.join(out, `${dir}_${n}_frames`); fs.mkdirSync(fd, { recursive: true }); const fps = +(flags.fps || 30), from = +(flags.from || 0);
    for (let i = 0; i < +flags.frames; i++) await shoot(n, from + i / fps, path.join(fd, String(i).padStart(5, '0') + '.jpg')); console.log(fd); }
  else { const f = path.join(out, `${dir}_${n}.jpg`); await shoot(n, +(flags.t || 0), f); console.log(f); }
}
await browser.close(); process.exit(bad ? 2 : 0);
