'use strict';
// THE STAGE KIT (shared by every film and Short in the look of film 07, 17 Nov 2026). Loaded after lib.js, rig.js and
// the film's cues.js, before the film's own film.js.
//   shot(startCue, endCue, counterText, (L, u, t, c) => draw)   a source shot, timed by cues.js: L = seconds into the
//       shot, u = 0..1 through it, t = source time, c(name) = that cue's time inside this shot
//   cut(shot, { a, b, sp, cam: [zoom, x, y] })   THE EDIT: plays a piece of a source shot (a..b in the shot's own
//       seconds) at speed sp, with an optional punch-in on a point of the frame; blink(d) is a beat of black
//   FILM(t)        draws the edit at t (or the source shots back to back, if the film has no edit list yet)
//   EDITCUES()     the edit's own times for the sound: END, every cue that is on screen, every cut and its kind
const SHOTS = [];
const shot = (a, b, count, fn) => SHOTS.push({ a: CUE[a], b: CUE[b], count, fn, name: a });
const EDIT = []; let _et = 0;
function cut(src, o = {}) { const s = SHOTS.find(x => x.name === src); if (!s) throw new Error('no shot ' + src); const a = o.a ?? 0, b = o.b ?? (s.b - s.a), sp = o.sp ?? 1, d = (b - a) / sp; EDIT.push({ s, a, b, sp, cam: o.cam, t0: _et, t1: _et + d }); _et += d; }
function blink(d = .12) { EDIT.push({ black: true, t0: _et, t1: _et + d }); _et += d; }
const FINISH = { bloom: .07, grain: .03, vignette: .5 };
// the picture of the edit at t, without the words: returns the words it queued (q), the counter text and the cut
function playEdit(t) {
  t = clamp(t, 0, _et - 1e-4); const e = EDIT.find(e => t >= e.t0 && t < e.t1); let q = [], count = null;
  rectf(0, 0, W, H, rgba(D.stage));
  if (e && !e.black) { const s = e.s, L = e.a + (t - e.t0) * e.sp; OVER = [];
    ctx.save(); if (e.cam) { const [z, cx, cy] = e.cam; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
    s.fn(L, L / (s.b - s.a), s.a + L, n => CUE[n] - s.a); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    q = OVER; OVER = null; count = s.count; }
  else if (e && e.black) rectf(0, 0, W, H, 'rgb(3,3,4)');
  return { q, count, e };
}
function FILM(t) {
  if (!EDIT.length) return RAWFILM(t);
  t = clamp(t, 0, _et - 1e-4); const r = playEdit(t);
  if (r.count) counter(r.count); for (const f of r.q) f.fn();
  finish({ ...FINISH, t });
  const out = seg(t, _et - .5, _et - .05); if (out > 0) rectf(0, 0, W, H, `rgba(0,0,0,${out})`);
}
// the source shots back to back, by cues.js (before a film has its edit list)
function RAWFILM(t) {
  t = clamp(t, 0, CUE.END - 1e-4);
  const s = SHOTS.find(s => t >= s.a && t < s.b);
  rectf(0, 0, W, H, rgba(D.stage));
  if (s) { const L = t - s.a; ctx.save(); s.fn(L, L / (s.b - s.a), t, n => CUE[n] - s.a); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; if (s.count) counter(s.count); }
  finish({ bloom: .07, grain: .03, vignette: .5, t });
  const out = seg(t, CUE.END - .6, CUE.END - .05); if (out > 0) rectf(0, 0, W, H, `rgba(0,0,0,${out})`);
}
function EDITCUES() { const cues = {}; for (const [n, v] of Object.entries(CUE)) { if (typeof v !== 'number') continue; const e = EDIT.find(e => !e.black && v >= e.s.a + e.a - 1e-6 && v < e.s.a + e.b - 1e-6); if (e) cues[n] = +(e.t0 + (v - e.s.a - e.a) / e.sp).toFixed(3); }
  return { END: +_et.toFixed(3), cues, cuts: EDIT.map((e, i) => ({ t: +e.t0.toFixed(3), kind: e.black ? 'black' : e.cam ? 'punch' : i && EDIT[i - 1].s === e.s && EDIT[i - 1].cam ? 'back' : 'cut', shot: e.black ? null : e.s.name })) }; }
// words are drawn after the picture, on top and never zoomed by a punch-in: hw() queues itself while a shot draws.
// Each queued entry is { fn: draws it on the 16:9 frame, w: the words as data (a Short lays them out again) }
let OVER = null, HOOK = false; const _hw = hw; hw = function (...a) { if (OVER) OVER.push({ fn: () => _hw(...a), w: { text: a[0], x: a[1], y: a[2], size: a[3], kind: a[4] || 'say', o: a[5] || {} } }); else _hw(...a); };
const over = fn => { if (OVER) OVER.push({ fn }); else fn(); };
const push = (u, k = .05) => 1 + k * u;
const say = (text, x, y, size, L, a, d = .9, o = {}) => { if (L >= a) hw(text, x, y, size, 'say', { reveal: seg(L, a, a + d), ...o }); };
const red = (text, x, y, size, L, a, d = 1.1, o = {}) => { if (L >= a) hw(text, x, y, size, 'devil', { reveal: seg(L, a, a + d), ...o }); };
// the red capitals: slammed, shaking for a moment
function slam(text, x, y, size, L, a, kind = 'devil') { if (L < a) return; const k = seg(L, a, a + .12), sh = (1 - seg(L, a, a + .5)) * 14; const fn = () => { ctx.save(); ctx.translate(x + Math.sin(L * 90) * sh, y + Math.cos(L * 70) * sh * .6); ctx.scale(lerp(1.5, 1, eo(k)), lerp(1.5, 1, eo(k))); _hw(text, 0, 0, size, kind, { rot: -.02, weight: 700 }); ctx.restore(); }; if (OVER) OVER.push({ fn, w: { text, x, y, size, kind, o: { rot: -.02, weight: 700 }, slam: { k, sh, L } } }); else fn(); }
// the fire in its belly when it is fed, and the pop when it grows: flare 0..1..0, pop 0..1 (eased with overshoot)
const flareK = (L, a, b) => Math.sin(seg(L, a, b) * Math.PI);
const popRing = (L, a, x, y, r0 = 120, r1 = 620) => { if (L < a || L > a + .6) return; const k = seg(L, a, a + .55); ctx.lineWidth = 14 * (1 - k); ctx.strokeStyle = rgba(D.red, 1 - k); ctx.beginPath(); ctx.arc(x, y, r0 + k * r1, 0, TAU); ctx.stroke(); };
const popFlash = (L, a, amt = .28) => { if (L >= a && L < a + .1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba(D.red, amt * (1 - seg(L, a, a + .1)))); ctx.restore(); } };
const burp = (L, a, x, y, s = 1) => { if (L < a || L > a + .5) return; const k = 1 - seg(L - a, 0, .5), py = y - (L - a) * 320 * s; additive(() => glow(D.ember, x, py, (90 * k + 20) * s, .9 * k)); blob([[x, py + 40 * k * s], [x + 30 * k * s, py], [x, py - 70 * k * s], [x - 30 * k * s, py]], rgba(D.hot, k), .5); };
// small things people wear and hold
function tieD(f, col = [86, 120, 138], len = .2) { const x = f.sx, y = f.shY - f.h * .012, w = f.h * .028, L = f.h * len; outlined(() => poly([[x - w, y], [x + w, y], [x + w * .6, y + w * 1.3], [x + w * 1.2, y + L], [x, y + L + w * 1.6], [x - w * 1.2, y + L], [x - w * .6, y + w * 1.3]]), rgba(col), Math.max(2, f.h * .006)); }
function bowD(x, y, s, col = [40, 36, 40], line = D.line) { for (const sd of [-1, 1]) outlined(() => poly([[x, y], [x + sd * s, y - s * .62], [x + sd * s, y + s * .62]]), rgba(col), Math.max(1.5, s * .12)); disc(x, y, s * .3, rgba(line)); disc(x, y, s * .2, rgba(col)); }
function hatD(x, y, s, rot = 0, col = [70, 170, 200]) { at(x, y, s, rot, () => { outlined(() => poly([[-.34, 0], [.34, 0], [0, -1]]), rgba(col), .05); stroke([[-.22, -.3], [.22, -.36]], .07, 'rgba(255,255,255,.8)'); stroke([[-.13, -.58], [.13, -.62]], .07, 'rgba(255,255,255,.8)'); disc(0, -1.02, .11, 'rgb(255,255,255)'); }); }
// a table seen from the side, a chair, a door
function tableD(x0, x1, y, legH = 150, col = D.wood) { outlined(() => { ctx.beginPath(); ctx.rect(x0, y, x1 - x0, 30); }, rgba(col), 5); for (const x of [x0 + 40, x1 - 70]) outlined(() => { ctx.beginPath(); ctx.rect(x, y + 30, 30, legH); }, rgba(mix(col, D.stage, .3)), 5); }
function chairD(x, y, s, dir = 1, col = D.prop) { const c = rgba(col); outlined(() => { ctx.beginPath(); ctx.rect(x - s * .3, y - s * .5, s * .6, s * .07); }, c, 4); outlined(() => { ctx.beginPath(); ctx.rect(x - dir * s * .3 - s * .035, y - s * 1.25, s * .07, s * 1.25); }, c, 4); outlined(() => { ctx.beginPath(); ctx.rect(x + dir * s * .3 - s * .035, y - s * .5, s * .07, s * .5); }, c, 4); }
function sparks(L, a, x, y, n = 10, sp = 300, col = D.ember) { const k = L - a; if (k < 0 || k > .6) return; for (let i = 0; i < n; i++) { const ang = rnd(i * 3.3) * TAU, v = sp * (.4 + rnd(i * 5.1)); disc(x + Math.cos(ang) * v * k, y + Math.sin(ang) * v * k + 500 * k * k, 5 * (1 - k / .6), rgba(col, 1 - k / .6)); } }
// a soft shadow of a figure on a lit wall
function shadowFig(x, y, h, horns, a = .7, blur = 9) { blurred(blur, () => { const c = rgba(D.stage, a), hr = h * .2, hy = y - h + hr; disc(x, hy, hr, c);
  blob([[x - h * .1, hy + hr * .8], [x + h * .1, hy + hr * .8], [x + h * .14, y - h * .32], [x + h * .1, y - h * .2], [x - h * .1, y - h * .2], [x - h * .14, y - h * .32]], c, .45);
  for (const sd of [-1, 1]) { taper([[x + sd * h * .05, y - h * .24], [x + sd * h * .06, y]], [h * .085, h * .08], c); taper([[x + sd * h * .1, hy + hr * 1.1], [x + sd * h * .16, y - h * .3]], [h * .07, h * .06], c);
    if (horns) taper([[x + sd * hr * .56, hy - hr * .7], [x + sd * hr * .95, hy - hr * 1.15], [x + sd * hr * .85, hy - hr * 1.75]], [hr * .32, hr * .22, hr * .03], c); } }); }
function flaskD(x, y, s, rot = 0) { at(x, y, s, rot, () => { outlined(() => { ctx.beginPath(); ctx.roundRect(-.3, -.5, .6, 1, .12); }, rgba([128, 138, 160]), .035); outlined(() => { ctx.beginPath(); ctx.rect(-.11, -.66, .22, .16); }, rgba([90, 98, 118]), .03); rectf(-.2, -.4, .08, .8, 'rgba(255,255,255,.3)'); }); }
// A code-drawn thumbnail (the stand-in the cloud uploads until ChatGPT's is swapped in on the Mac): the edit's frame at t
// (cam: [zoom, x, y] to frame it), without its words, the topic word huge in fat white letters with a red edge, the hook
// small under it. pos: 'top' | 'bottom' | 'left' (left: the word's words stacked). node stage/render.mjs <film> thumb …
function THUMB(t, word, hook, cam, pos = 'top') {
  ctx.save(); if (cam) { const [z, cx, cy] = cam; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
  playEdit(t); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; finish({ ...FINISH, grain: 0, bloom: .12 });
  const left = pos === 'left', lines = left ? word.split(' ') : [word], maxW = left ? 860 : 1700; let size = left ? 300 : 330;
  ctx.save(); ctx.textBaseline = 'middle'; ctx.textAlign = left ? 'left' : 'center'; ctx.lineJoin = 'round';
  const fit = () => { ctx.font = `700 ${size}px ${FONT}`; return Math.max(...lines.map(l => ctx.measureText(l).width)); };
  while (fit() > maxW && size > 120) size -= 8;
  const lh = size * .92, th = lh * lines.length + (hook ? size * .42 : 0), x = left ? 90 : W / 2, y0 = pos === 'bottom' ? H - 70 - th + lh / 2 : left ? (H - th) / 2 + lh / 2 : 70 + lh / 2;
  ctx.fillStyle = left ? lg(0, 0, 1100, 0, [[0, D.stage, .85], [1, D.stage, 0]]) : pos === 'bottom' ? lg(0, H - th - 260, 0, H, [[0, D.stage, 0], [1, D.stage, .9]]) : lg(0, 0, 0, th + 260, [[0, D.stage, .9], [1, D.stage, 0]]);
  ctx.fillRect(0, 0, W, H);
  lines.forEach((l, i) => { const y = y0 + i * lh; ctx.font = `700 ${size}px ${FONT}`; ctx.shadowColor = rgba([255, 30, 20], .9); ctx.shadowBlur = size * .22; ctx.lineWidth = size * .12; ctx.strokeStyle = rgba(D.red); ctx.strokeText(l, x, y);
    ctx.shadowBlur = 0; ctx.lineWidth = size * .05; ctx.strokeStyle = rgba([120, 10, 6]); ctx.strokeText(l, x, y); ctx.fillStyle = 'rgb(255,255,255)'; ctx.fillText(l, x, y); });
  if (hook) { const hs = size * .3, y = y0 + (lines.length - 1) * lh + lh * .5 + hs * .7; ctx.font = `700 ${hs}px ${FONT}`; ctx.lineWidth = hs * .28; ctx.strokeStyle = rgba(D.stage); ctx.strokeText(hook, x, y); ctx.fillStyle = 'rgb(255,255,255)'; ctx.fillText(hook, x, y); }
  ctx.restore();
}
