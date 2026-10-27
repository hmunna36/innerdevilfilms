'use strict';
// The channel's banner (2560 x 1440) and profile picture (800 x 800), drawn with the LUST film engine.
// brand.mjs loads this into lust.html after the film's own script, so every helper of the film is in scope.
const BRAND = { name: ['THE DEVIL', 'YOU FEED'], whisper: 'shh… just one more.' };
function brandReset() {
  PUSH = 1; SHX = 0; SHY = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
}
// soft black smoke: blurred blobs, since the film's hard-edged puffs read as discs in a still
function brandSmoke(n, seed, x0, x1, y0, y1, a) {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, rnd(seed + i * 3)), y = lerp(y0, y1, rnd(seed + i * 3 + 1)), r = 140 + rnd(seed + i * 3 + 2) * 280;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
}
// drawDevil for a still: no heat shimmer (its strips leave steps on the edges), the body fading out below the shoulders
function brandDevil(t, fr, o) {
  const [z, cx, cy] = fr, { x, y, s } = DEVIL;
  dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, W, H);
  dctx.setTransform(z, 0, 0, z, W / 2 - cx * z, H / 2 - cy * z);
  devilBody(dctx, t, o);
  dctx.save(); dctx.globalCompositeOperation = 'destination-out';
  const fg = dctx.createLinearGradient(0, y - 640 * s, 0, y - 400 * s);
  fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(0,0,0,1)');
  dctx.fillStyle = fg; dctx.fillRect(x - 700 * s, y - 640 * s, 1400 * s, 760 * s); dctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.shadowColor = 'rgba(255,24,32,.95)'; ctx.shadowBlur = 70 * Math.min(z, 1.6); ctx.drawImage(DEV, 0, 0);   // red rim
  ctx.shadowBlur = 0; ctx.drawImage(DEV, 0, 0); ctx.restore();
  cam(z, cx, cy);
}
// its face, with the head at screen point (sx, sy) and zoom z
function brandFace(t, z, sx, sy, o) {
  placeDevil('behind');
  const oo = devilO(Object.assign({ a: 1, eyes: 1, grin: 1 }, o)), [hx, hy] = devilHead(t, oo);
  const fr = [z, hx - (sx - W / 2) / z, hy - (sy - H / 2) / z];
  cam(...fr);
  additive(() => glow(SPR.red, hx, hy - 40, 560, .5));          // the aura behind its head
  brandDevil(t, fr, oo); devilEyes(t, oo); devilGrin(t, oo);
  screen();
}
function brandEmbers(n, y0, y1) {
  additive(() => { for (let i = 0; i < n; i++)
    glow(i % 3 ? SPR.red : SPR.amber, rnd(i + 900) * W, lerp(y0, y1, rnd(i + 901)), 4 + rnd(i + 902) * 8, .3 + .5 * rnd(i + 903)); });
}
// the art behind the banner's words, in film pixels (1920 x 1080 is the banner at 3/4 scale)
function bannerArt(t) {
  brandReset(); fill([6, 3, 4], [3, 2, 3]);
  additive(() => { glow(SPR.red, 1250, 560, 980, .3); glow(SPR.red, 260, 560, 620, .1); });
  brandSmoke(26, 4000, -100, W + 100, 150, 950, .5);
  brandFace(t, 1.25, 1250, 545, {});
  brandEmbers(80, 240, 900);
  redEyes(160, 545, 8, .45);                                     // another one, far off in the dark (wide screens only)
  ctx.fillStyle = rgba(C.red, .06); ctx.fillRect(0, 0, W, H);
  const v = ctx.createLinearGradient(0, 0, 0, H);                // the band stays lit; above and below fall to black
  v.addColorStop(0, 'rgba(0,0,0,.85)'); v.addColorStop(.3, 'rgba(0,0,0,0)'); v.addColorStop(.7, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.9)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
function logoArt(t, z, y) {
  brandReset(); fill([12, 3, 5], [4, 2, 3]);
  additive(() => glow(SPR.red, 960, 560, 700, .6));
  brandSmoke(10, 5000, 540, 1380, 120, 960, .45);
  brandFace(t, z, 960, y, {});
  ctx.fillStyle = rgba(C.red, .07); ctx.fillRect(0, 0, W, H);
}
// the name in fat white letters with a red edge, like the thumbnails; the whisper in the film's pink italics
function brandWords(g, cx, cy, maxW) {
  let size = 170;
  const fit = () => { g.font = `${size}px "Arial Black"`; return Math.max(...BRAND.name.map(l => g.measureText(l).width)); };
  while (fit() > maxW) size -= 2;
  const lh = size * 1.02, y1 = cy - lh * .62, ys = BRAND.name.map((_, i) => y1 + i * lh);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  BRAND.name.forEach((l, i) => {
    g.save(); g.globalCompositeOperation = 'lighter';
    g.fillStyle = 'rgba(0,255,255,.22)'; g.fillText(l, cx - 6, ys[i]);
    g.fillStyle = 'rgba(255,0,60,.35)'; g.fillText(l, cx + 6, ys[i]); g.restore();
    g.save(); g.shadowColor = 'rgba(255,24,34,1)'; g.shadowBlur = 60; g.strokeStyle = 'rgb(210,18,30)'; g.lineWidth = 12; g.strokeText(l, cx, ys[i]);
    g.shadowBlur = 22; g.strokeText(l, cx, ys[i]);
    const gr = g.createLinearGradient(0, ys[i] - size * .4, 0, ys[i] + size * .4);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#ffdede');
    g.shadowBlur = 0; g.fillStyle = gr; g.fillText(l, cx, ys[i]); g.restore();
  });
  g.font = `italic 400 ${Math.round(size * .36)}px Georgia, "Times New Roman", serif`;
  g.shadowColor = 'rgba(232,44,52,.8)'; g.shadowBlur = 24; g.fillStyle = 'rgba(255,214,220,.96)';
  g.fillText(BRAND.whisper, cx, ys[1] + lh * .78); g.shadowBlur = 0;
  return { size, top: ys[0] - size * .4, bottom: ys[1] + lh * .78 + size * .22 };
}
function brandBanner() {
  bannerArt(3.2);
  const B = document.createElement('canvas'); B.width = 2560; B.height = 1440;
  const g = B.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(cv, 0, 0, 2560, 1440);
  const box = brandWords(g, 955, 712, 780);                       // the safe area for every device is x 507-2053, y 508-931
  return { png: B.toDataURL('image/png'), box };
}
function brandLogo(z = 1.15, y = 600) {
  logoArt(3.2, z, y);
  const L = document.createElement('canvas'); L.width = 800; L.height = 800;
  const g = L.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(cv, 540, 120, 840, 840, 0, 0, 800, 800);
  return L.toDataURL('image/png');
}
