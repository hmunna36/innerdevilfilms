// Draws the channel's banner and profile picture with the LUST film engine, plus previews of how they crop.
// usage: [LUST_HTML=<the LUST film page>] node brand.mjs [logoZoom logoY]   writes banner.png, logo.png and preview_*.png
// next to this file. The defaults (1.7, 500) made the published picture; the film page defaults to ../lust.html.
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.cache/cp/node/node_modules/playwright-core');
const here = path.dirname(new URL(import.meta.url).pathname);
const [z, y] = [+(process.argv[2] || 1.7), +(process.argv[3] || 500)];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + (process.env.LUST_HTML || path.join(here, '..', 'lust.html')));
await page.addScriptTag({ path: path.join(here, 'brand.js') });
const save = (name, url) => fs.writeFileSync(path.join(here, name), Buffer.from(url.split(',')[1], 'base64'));
const { png, box } = await page.evaluate(() => brandBanner());
save('banner.png', png);
save('logo.png', await page.evaluate(([z, y]) => brandLogo(z, y), [z, y]));
// how they show: phones (the 1546 x 423 middle), desktops (the 2560 x 423 band), the profile picture in a circle
const previews = await page.evaluate(async ([banner, logo]) => {
  const img = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const [b, l] = await Promise.all([img(banner), img(logo)]);
  const cut = (sx, sy, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(b, sx, sy, w, h, 0, 0, w, h); return c.toDataURL('image/png'); };
  const c = document.createElement('canvas'); c.width = 520; c.height = 200; const g = c.getContext('2d');
  g.fillStyle = '#0f0f0f'; g.fillRect(0, 0, 520, 200);
  let x = 20;
  for (const d of [176, 98, 48, 24]) {
    g.save(); g.beginPath(); g.arc(x + d / 2, 100, d / 2, 0, Math.PI * 2); g.clip(); g.imageSmoothingQuality = 'high'; g.drawImage(l, x, 100 - d / 2, d, d); g.restore();
    x += d + 30;
  }
  return { phone: cut(507, 508, 1546, 423), desktop: cut(0, 508, 2560, 423), logo: c.toDataURL('image/png') };
}, [png, await page.evaluate(([z, y]) => brandLogo(z, y), [z, y])]);
for (const [k, v] of Object.entries(previews)) save(`preview_${k}.png`, v);
await browser.close();
console.log(`banner.png 2560x1440, words ${box.size}px from y ${Math.round(box.top)} to ${Math.round(box.bottom)} (safe 508-931); logo.png 800x800 (zoom ${z}, head at y ${y})`);
