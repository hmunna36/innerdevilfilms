'use strict';
// Shared drawing helpers for the design boards (plain canvas 2D, 1920 x 1080, +y down). Colours are [r, g, b].
// Every picture is a pure function of t (seconds): no Math.random, no Date.
const W = 1920, H = 1080, TAU = Math.PI * 2;
let ctx;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const smooth = k => k * k * (3 - 2 * k);
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, k) => [0, 1, 2].map(i => lerp(a[i], b[i], k));
const lighten = (c, k) => mix(c, [255, 255, 255], k), darken = (c, k) => mix(c, [0, 0, 0], k);
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const noise1 = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(rnd(i + seed * 57.3), rnd(i + 1 + seed * 57.3), u) * 2 - 1; };

// ---------- paint ----------
function lg(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [p, c, a = 1] of stops) g.addColorStop(p, rgba(c, a)); return g; }
function rg(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); for (const [p, c, a = 1] of stops) g.addColorStop(p, rgba(c, a)); return g; }
function rectf(x, y, w, h, style) { ctx.fillStyle = style; ctx.fillRect(x, y, w, h); }
function disc(x, y, r, style) { ctx.fillStyle = style; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); }
function oval(x, y, rx, ry, style, rot = 0) { ctx.fillStyle = style; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); ctx.fill(); }
function poly(pts, style, close = true) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); if (close) ctx.closePath(); if (style) { ctx.fillStyle = style; ctx.fill(); } }
function stroke(pts, w, style, cap = 'round') { ctx.lineWidth = w; ctx.strokeStyle = style; ctx.lineCap = cap; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
// a smooth closed (or open) curve through points: the main tool for organic shapes. Builds the path; fills if style.
function blobPath(pts, tension = .5, close = true) {
  const n = pts.length, P = i => close ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), k = tension / 3 * 2;
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k / 2, p1[1] + (p2[1] - p0[1]) * k / 2, p2[0] - (p3[0] - p1[0]) * k / 2, p2[1] - (p3[1] - p1[1]) * k / 2, p2[0], p2[1]);
  }
  if (close) ctx.closePath();
}
function blob(pts, style, tension = .5) { blobPath(pts, tension, true); if (style) { ctx.fillStyle = style; ctx.fill(); } }
function curve(pts, w, style, tension = .5) { blobPath(pts, tension, false); ctx.lineWidth = w; ctx.strokeStyle = style; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
// a stroke that tapers along a smooth open curve: widths [w at each point] (horns, tails, limbs, hair locks)
function taper(pts, widths, style, tension = .5) {
  const S = [], n = pts.length;
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < 12; j++) {
    const u = j / 12, p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const h = (a, b, cc, d) => { const t2 = u * u, t3 = t2 * u; return .5 * ((2 * b) + (-a + cc) * u + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3); };
    S.push([h(p0[0], p1[0], p2[0], p3[0]), h(p0[1], p1[1], p2[1], p3[1]), lerp(widths[i], widths[i + 1], u)]);
  }
  S.push([pts[n - 1][0], pts[n - 1][1], widths[n - 1]]);
  const L = [], R = [];
  for (let i = 0; i < S.length; i++) {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = S[i][2] / 2;
    L.push([S[i][0] + nx * w, S[i][1] + ny * w]); R.push([S[i][0] - nx * w, S[i][1] - ny * w]);
  }
  ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (const p of L) ctx.lineTo(p[0], p[1]);
  for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
  ctx.closePath();
  if (style) { ctx.fillStyle = style; ctx.fill(); const e = S[S.length - 1], s0 = S[0]; ctx.beginPath(); ctx.arc(e[0], e[1], e[2] / 2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s0[0], s0[1], s0[2] / 2, 0, TAU); ctx.fill(); }
}
// two-bone IK: the middle joint for a limb from a to c with bone lengths l1, l2; bend = +1 or -1 picks the side
function ik(a, c, l1, l2, bend = 1) {
  const dx = c[0] - a[0], dy = c[1] - a[1], d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + .001, l1 + l2 - .001);
  const ang = Math.atan2(dy, dx), al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  return [a[0] + Math.cos(ang + al * bend) * l1, a[1] + Math.sin(ang + al * bend) * l1];
}
// clip to whatever fn(path) builds, draw inside it, restore (shading inside a shape: shadow side, rim, pattern)
function inside(pathFn, drawFn) { ctx.save(); pathFn(); ctx.clip(); drawFn(); ctx.restore(); }
function blurred(r, fn) { const f = ctx.filter; ctx.filter = `blur(${Math.max(.01, r).toFixed(2)}px)`; fn(); ctx.filter = f || 'none'; }
function additive(fn) { const o = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'lighter'; fn(); ctx.globalCompositeOperation = o; }
function multiply(fn) { const o = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'multiply'; fn(); ctx.globalCompositeOperation = o; }
function alpha(a, fn) { const o = ctx.globalAlpha; ctx.globalAlpha = o * a; fn(); ctx.globalAlpha = o; }
function at(x, y, s, rot, fn) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (s !== 1) ctx.scale(s, s); fn(); ctx.restore(); }
// a soft light (additive): colour, centre, radius, strength
function glow(c, x, y, r, a) { if (a <= .003) return; additive(() => { ctx.fillStyle = rg(x, y, 0, r, [[0, c, a], [.35, c, a * .45], [1, c, 0]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); }); }
function cone(x, y, w0, w1, h, col, a, skew = 0) { additive(() => { ctx.fillStyle = lg(0, y, 0, y + h, [[0, col, a], [.55, col, a * .35], [1, col, 0]]); poly([[x - w0, y], [x + w0, y], [x + w1 + skew, y + h], [x - w1 + skew, y + h]]); ctx.fill(); }); }
function bokeh(seed, n, box, cols, r0, r1, a, t = 0) {
  additive(() => { for (let i = 0; i < n; i++) {
    const x = lerp(box[0], box[2], rnd(seed + i * 3.1)), y = lerp(box[1], box[3], rnd(seed + i * 5.7 + 1)), r = lerp(r0, r1, rnd(seed + i * 7.3 + 2));
    const c = cols[Math.floor(rnd(seed + i * 9.1 + 3) * cols.length) % cols.length], tw = .7 + .3 * Math.sin(t * (1 + rnd(seed + i) * 2) + i);
    ctx.fillStyle = rg(x, y, 0, r, [[0, c, a * tw * .55], [.72, c, a * tw * .5], [.9, c, a * tw * .22], [1, c, 0]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  } });
}
// the finishing pass over the whole frame: bloom (bright parts glow), a vignette, film grain
function finish(o = {}) {
  const c = ctx.canvas, bloom = o.bloom ?? .35, vig = o.vignette ?? .45, grain = o.grain ?? .05;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (bloom > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = bloom; ctx.filter = `blur(${o.bloomR || 22}px) brightness(0.9) contrast(1.6)`; ctx.drawImage(c, 0, 0); ctx.restore(); }
  if (vig > 0) { ctx.fillStyle = rg(W / 2, H / 2, H * .45, H * 1.08, [[0, [0, 0, 0], 0], [1, o.vigCol || [0, 0, 0], vig]]); ctx.fillRect(0, 0, W, H); }
  if (grain > 0) { const t = o.t || 0; ctx.save(); for (let i = 0; i < 2600; i++) { const x = rnd(i * 1.7 + Math.floor(t * 24) * 13.1) * W, y = rnd(i * 2.9 + Math.floor(t * 24) * 7.7) * H, l = rnd(i * 5.3) > .5; ctx.fillStyle = l ? `rgba(255,255,255,${grain})` : `rgba(0,0,0,${grain * 1.4})`; ctx.fillRect(x, y, 2, 2); } ctx.restore(); }
}
// the devil's words, the channel's way: kind = pink italic whisper; real = red slammed capitals
function words(kind, text, y = 960, size) {
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (kind === 'kind') { ctx.font = `italic 600 ${size || 72}px "IDF Serif"`; ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; ctx.fillStyle = 'rgb(255,196,214)'; ctx.fillText(text, W / 2, y); }
  else { ctx.font = `900 ${size || 104}px "IDF Sans"`; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(10,0,2,.9)'; ctx.strokeText(text, W / 2, y); ctx.shadowColor = 'rgba(255,30,40,.6)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgb(255,52,60)'; ctx.fillText(text, W / 2, y); }
  ctx.restore();
}
// a small caption in a corner (AGE 21, DAY 90…)
function stamp(big, small, x = 110, y = 120) {
  ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 14;
  ctx.font = '300 96px "IDF Sans"'; ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillText(big, x, y + 40);
  if (small) { ctx.font = '500 36px "IDF Sans"'; ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillText(small, x + 4, y + 92); }
  ctx.restore();
}
function label(text, x, y, size = 34, col = 'rgba(255,255,255,.8)', align = 'center') { ctx.save(); ctx.font = `500 ${size}px "IDF Sans"`; ctx.textAlign = align; ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore(); }
