'use strict';
// SHORTS ON THE STAGE (1080 x 1920). A Short is its own edit of ONE film: pieces of the film's finished edit, each seen
// through a tall window, the film's words laid out again inside the Shorts safe area, its own words on top, an end card.
// shorts/NN-slug/short.js (first line:  // film: films/NN-slug ) calls, in order:
//
//   piece(a, b, { win, to, sp, words, count, band })   the film's edit from a to b. a and b are seconds in the FILM'S EDIT
//        (what you read on the film's contact sheets), or a cue name ('pop21'), or [cue, offset] (['a38', .4]).
//        win: [z, cx, cy] the window: z = 1 shows the stage's full height (607 px of its width), z = 2 half of that,
//             z < 1 shows more width with the black stage above and below (z = .5625 is the whole 16:9 frame);
//             (cx, cy) is the point of the 1920 x 1080 frame that sits in the middle of the tall screen.
//        to:  [z, cx, cy] where the window has moved to by the end of the piece (default: a slow 4 % push-in)
//        sp:  speed (default 1; at another speed the film's sound under the piece slows or speeds up with it, like tape)
//        words: false hides the film's own words here (write the Short's with cap()); count: false hides the counter,
//        a string replaces it; band: 'top' | 'low' forces where the film's words go (default: white top, red low)
//        returns the Short time the piece starts at
//   gap(d = .1)                                         a beat of black
//   cap(kind, text, at, d, { slam, band, size, write }) the Short's own words: kind 'say' (white) or 'devil' (red), from
//        Short time `at` for d seconds; written on in `write` seconds (default .45), or slam: true (slammed capitals)
//   endCard({ dur, title, line, cta, stage, expr })     the last picture: the little devil, the film's title, the way to
//        the full film (the Related video link sits under the arrow)
//   now()                                               the Short time so far (for cap times)
//   FTS(cue, off)                                       the Short time at which that moment of the film plays
//
// Where things go on the tall screen (measured on the owner's iPhone, 30 Sep 2026): the top 375 px and everything under
// 1680 are covered, and the right column (x >= 880) from y 1050. So: the subject between y 700 and 1450, white words in
// the top band (from y 470), red words in the low band (ending by y 1610, x 110-860), the counter top right at y 446.
const VW = 1080, VH = 1920, VS = VH / H;
const SAFE = { x0: 100, x1: 980, y0: 400, y1: 1640, colX: 870, colY: 1050 };
const SHORT = { pieces: [], caps: [], dur: 0, endAt: 0 };
let _st = 0, _EC = null;
const EC = () => _EC || (_EC = EDITCUES());
const FT = v => Array.isArray(v) ? FT(v[0]) + v[1] : typeof v === 'number' ? v : (() => { const t = EC().cues[v]; if (t == null) throw new Error('no cue in the film\'s edit: ' + v); return t; })();
const now = () => _st;
// the Short time at which a moment of the film plays (in the last piece that holds it): FTS('pop21'), FTS('pop21', .2)
const FTS = (v, off = 0) => { const ft = FT(v); for (let i = SHORT.pieces.length - 1; i >= 0; i--) { const p = SHORT.pieces[i]; if (p.kind === 'film' && ft >= p.a - 1e-6 && ft <= p.b + 1e-6) return p.t0 + (ft - p.a) / p.sp + off; } throw new Error('that moment of the film is not in the Short: ' + v); };
function piece(a, b, o = {}) { a = FT(a); b = FT(b); if (!(b > a)) throw new Error(`piece: ${a} .. ${b}`); const sp = o.sp || 1, d = (b - a) / sp;
  SHORT.pieces.push({ kind: 'film', a, b, sp, win: o.win || [1, 960, 540], to: o.to, push: o.push, words: o.words, count: o.count, band: o.band, t0: _st, t1: _st + d }); _st += d; SHORT.dur = SHORT.endAt = _st; return _st - d; }
function gap(d = .1) { SHORT.pieces.push({ kind: 'black', t0: _st, t1: _st + d }); _st += d; SHORT.dur = SHORT.endAt = _st; }
function cap(kind, text, at, d, o = {}) { SHORT.caps.push({ kind, text, at, d, ...o }); }
function endCard(o = {}) { const d = o.dur || 2.8; SHORT.endAt = _st; SHORT.pieces.push({ kind: 'end', t0: _st, t1: _st + d, ...o }); _st += d; SHORT.dur = _st; }

// ---- the window: every drawing call of the stage goes through a base transform, so the picture stays sharp at any zoom
// (not an enlarged 16:9 frame). setTransform(identity) inside the stage code means "the window", and the glows (shadowBlur,
// blur filters), which canvas does not scale by itself, are scaled with it ----
const BASE = { m: new DOMMatrix(), s: 1 }; let _patched = null;
function patchCtx(c) {
  if (_patched === c) return; _patched = c;
  const P = CanvasRenderingContext2D.prototype, d = n => Object.getOwnPropertyDescriptor(P, n), st = P.setTransform, gt = P.getTransform;
  c.setTransform = function (a, b, cc, dd, e, f) { const m = a && typeof a === 'object' ? DOMMatrix.fromMatrix(a) : new DOMMatrix(a === undefined ? [1, 0, 0, 1, 0, 0] : [a, b, cc, dd, e, f]); st.call(this, BASE.m.multiply(m)); };
  c.resetTransform = function () { st.call(this, BASE.m); };
  c.getTransform = function () { return BASE.m.inverse().multiply(gt.call(this)); };
  for (const n of ['shadowBlur', 'shadowOffsetX', 'shadowOffsetY']) { const p = d(n); Object.defineProperty(c, n, { configurable: true, get() { return p.get.call(this) / BASE.s; }, set(v) { p.set.call(this, v * BASE.s); } }); }
  const pf = d('filter'), re = /blur\(([\d.]+)px\)/g;
  Object.defineProperty(c, 'filter', { configurable: true, get() { return pf.get.call(this).replace(re, (m, v) => `blur(${+(v / BASE.s).toFixed(3)}px)`); }, set(v) { pf.set.call(this, String(v).replace(re, (m, x) => `blur(${(x * BASE.s).toFixed(2)}px)`)); } });
}
function setBase(z, cx, cy) { patchCtx(ctx); const s = VS * z; BASE.m = new DOMMatrix([s, 0, 0, s, VW / 2 - cx * s, VH / 2 - cy * s]); BASE.s = s; ctx.setTransform(1, 0, 0, 1, 0, 0); }
function unbase() { BASE.m = new DOMMatrix(); BASE.s = 1; if (_patched) _patched.setTransform(1, 0, 0, 1, 0, 0); }
// keep the window on the stage: sideways always; up and down when it is zoomed in (z < 1 leaves the black stage round it)
function fitWin([z, cx, cy]) { z = Math.max(z, VW / (W * VS)); const hw_ = VW / (2 * VS * z), hh = H / (2 * z);
  return [z, clamp(cx, hw_, W - hw_), z >= 1 ? clamp(cy, hh, H - hh) : cy]; }

// ---- the words, laid out for the tall screen ----
function vlay(text, size, maxW, weight) {
  let sz = clamp(size * 1.08, 60, 118), lines;
  for (;;) { ctx.save(); ctx.font = `${weight} ${sz}px ${FONT}`; lines = []; let cur = '';
    for (const w of text.split(' ')) { const tr = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(tr).width > maxW) { lines.push(cur); cur = w; } else cur = tr; }
    lines.push(cur); lines = lines.map(s => ({ s, w: ctx.measureText(s).width })); ctx.restore();
    if ((lines.length <= 3 && lines.every(l => l.w <= maxW)) || sz <= 46) break; sz *= .93; }
  return { sz, lines, lh: sz * 1.16, h: sz * 1.16 * lines.length };
}
function vitem(wd, cx, y0, L) {                      // y0: the middle of its first line
  const { text, kind, o = {} } = wd, weight = o.weight || 700, n = o.reveal != null ? Math.round(clamp(o.reveal) * text.length) : 1e9, mw = Math.max(...L.lines.map(l => l.w));
  if (n > 0) blurred(44, () => oval(cx, y0 + (L.h - L.lh) / 2, mw * .56 + 40, L.h * .5 + L.sz * .3, rgba(D.stage, .62)));     // a soft dark cloud behind the words
  ctx.save();
  if (wd.slam) { const { k, sh, L: sl } = wd.slam, yc = y0 + (L.h - L.lh) / 2, sc = lerp(1.5, 1, eo(k)); ctx.translate(cx + Math.sin(sl * 90) * sh, yc + Math.cos(sl * 70) * sh * .6); ctx.scale(sc, sc); ctx.translate(-cx, -yc); }
  let off = 0;
  L.lines.forEach((ln, i) => { const y = y0 + i * L.lh, shown = ln.s.slice(0, Math.max(0, n - off)); off += ln.s.length + 1; if (!shown) return;
    if (o.reveal != null) _hw(shown, cx - ln.w / 2, y, L.sz, kind, { align: 'left', rot: o.rot ?? -.012, weight });
    else _hw(ln.s, cx, y, L.sz, kind, { rot: o.rot ?? -.012, weight, under: o.under && i === L.lines.length - 1 }); });
  ctx.restore();
}
function vwords(list, hasCount) {
  const top = [], low = [];
  for (const w of list) (((w.band || (w.kind === 'devil' ? 'low' : 'top')) === 'low') ? low : top).push(w);
  let y = hasCount ? 560 : 520;
  for (const w of top) { const L = vlay(w.text, w.size, 840, (w.o && w.o.weight) || 700); vitem(w, 540, y + L.sz * .1, L); y += L.h + 16; }
  const Ls = low.map(w => vlay(w.text, w.size, 740, (w.o && w.o.weight) || 700)); let yb = 1600 - Ls.reduce((a, L) => a + L.h + 16, -16);
  low.forEach((w, i) => { vitem(w, 485, yb + Ls[i].lh / 2, Ls[i]); yb += Ls[i].h + 16; });
}
function vcounter(text) { ctx.save(); ctx.font = `700 50px ${FONT}`; const w = ctx.measureText(text).width; ctx.restore(); blurred(22, () => rectf(960 - w - 24, 412, w + 48, 68, rgba(D.stage, .6))); _hw(text, 960, 446, 50, 'say', { align: 'right', rot: 0 }); }
function vfinish(t) {
  const c = ctx.canvas; ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = FINISH.bloom; ctx.filter = 'blur(34px) brightness(0.9) contrast(1.6)'; ctx.drawImage(c, 0, 0); ctx.restore();
  ctx.fillStyle = rg(VW / 2, VH / 2, VH * .34, VH * .7, [[0, [0, 0, 0], 0], [1, [0, 0, 0], FINISH.vignette]]); ctx.fillRect(0, 0, VW, VH);
  ctx.save(); const g = FINISH.grain; for (let i = 0; i < 2600; i++) { const x = rnd(i * 1.7 + Math.floor(t * 24) * 13.1) * VW, y = rnd(i * 2.9 + Math.floor(t * 24) * 7.7) * VH, l = rnd(i * 5.3) > .5; ctx.fillStyle = l ? `rgba(255,255,255,${g})` : `rgba(0,0,0,${g * 1.4})`; ctx.fillRect(x, y, 2, 2); } ctx.restore();
}
// the end card: the little devil on its floor line, the film's title, the way to the full film
function endCardD(u, p) {
  rectf(0, 0, VW, VH, 'rgb(5,5,7)'); const fy = 1190;
  glow([255, 60, 40], 540, 1040, 620, .16 + .03 * Math.sin(u * 5));
  curve(jit([[150, fy], [400, fy], [680, fy], [930, fy]], 1.5, 4), 4, rgba(D.floor), .5);
  figure({ kind: 'devil', x: 540, y: fy - 4, h: p.h || 400, stage: p.stage ?? 0, expr: devEx(p.expr || 'sweet', u, [1.1, 2.3]), look: [0, u > 1 ? .5 : -.1], tilt: Math.sin(u * 2.2) * .05, tail: [-.4 + .05 * Math.sin(u * 3), -.3], armR: u > 1.0 ? [540 + 96, fy - 150 + Math.sin(u * 9) * 14] : undefined, bendR: -.3, stretch: true, t: u });
  const T = vlay(p.title || '', 112, 840, 700); vitem({ text: p.title || '', kind: 'say', o: { reveal: seg(u, .05, .5), rot: -.012 } }, 540, 560, T);
  if (p.line) { const Lr = vlay(p.line, 60, 800, 400); vitem({ text: p.line, kind: 'devil', o: { reveal: seg(u, .45, .95), weight: 400 } }, 540, 560 + T.h + 24, Lr); }
  if (u > 1.0) { const a = eo(seg(u, 1.0, 1.3)), b = Math.sin(u * 7) * 10; ctx.save(); ctx.globalAlpha = a; const cta = p.cta || 'watch the full film'; const Lc = vlay(cta, 54, 720, 700); vitem({ text: cta, kind: 'say', o: {} }, 485, 1400, Lc);
    stroke([[485, 1470 + b], [485, 1580 + b]], 9, rgba(D.white)); stroke([[443, 1538 + b], [485, 1580 + b], [527, 1538 + b]], 9, rgba(D.white)); ctx.restore(); }
}
function safeD() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,0,60,.13)';
  ctx.fillRect(0, 0, VW, SAFE.y0); ctx.fillRect(0, SAFE.y1, VW, VH - SAFE.y1); ctx.fillRect(0, SAFE.y0, SAFE.x0, SAFE.y1 - SAFE.y0); ctx.fillRect(SAFE.x1, SAFE.y0, VW - SAFE.x1, SAFE.y1 - SAFE.y0); ctx.fillRect(SAFE.colX, SAFE.colY, SAFE.x1 - SAFE.colX, SAFE.y1 - SAFE.colY);
  ctx.strokeStyle = 'rgba(0,255,160,.9)'; ctx.lineWidth = 4; ctx.strokeRect(SAFE.x0, SAFE.y0, SAFE.x1 - SAFE.x0, SAFE.y1 - SAFE.y0); ctx.restore(); }

// ---- the Short at t ----
function VFILM(t, o) {
  t = clamp(t, 0, SHORT.dur - 1e-4); const p = SHORT.pieces.find(p => t >= p.t0 && t < p.t1); let words = [], count = null;
  rectf(0, 0, VW, VH, rgba(D.stage));
  if (p && p.kind === 'film') {
    const u = (t - p.t0) / (p.t1 - p.t0), te = p.a + (t - p.t0) * p.sp, w0 = fitWin(p.win), w1 = fitWin(p.to || [p.win[0] * (1 + (p.push ?? .04)), p.win[1], p.win[2]]), k = p.to ? eio(u) : u;
    const z = lerp(w0[0], w1[0], k), cx = lerp(w0[1], w1[1], k), cy = lerp(w0[2], w1[2], k), s = VS * z;
    ctx.save(); setBase(z, cx, cy); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); const r = playEdit(te);
    for (const f of r.q) { if (f.w) { if (p.words !== false) words.push(p.band ? { ...f.w, band: p.band } : f.w); } else if (p.words !== false) f.fn(); }
    unbase(); ctx.restore(); unbase();
    if (z < 1) { const y0 = VH / 2 - cy * s, y1 = VH / 2 + (H - cy) * s, e = 70;       // the stage's top and bottom edges melt into the black
      ctx.fillStyle = lg(0, y0, 0, y0 + e, [[0, D.stage, 1], [1, D.stage, 0]]); ctx.fillRect(0, y0 - 1, VW, e + 1); ctx.fillStyle = lg(0, y1 - e, 0, y1, [[0, D.stage, 0], [1, D.stage, 1]]); ctx.fillRect(0, y1 - e, VW, e + 1); }
    count = p.count === undefined ? r.count : p.count;
  } else if (p && p.kind === 'black') rectf(0, 0, VW, VH, 'rgb(3,3,4)');
  else if (p && p.kind === 'end') endCardD(t - p.t0, p);
  for (const c of SHORT.caps) if (t >= c.at && t < c.at + c.d) { const L = t - c.at;
    words.push(c.slam ? { text: c.text, kind: c.kind, size: c.size || 100, band: c.band, o: { rot: -.02, weight: 700 }, slam: { k: seg(L, 0, .12), sh: (1 - seg(L, 0, .5)) * 14, L } }
      : { text: c.text, kind: c.kind, size: c.size || 88, band: c.band, o: { reveal: seg(L, 0, c.write ?? .45) } }); }
  if (count) vcounter(count);
  vwords(words, !!count);
  vfinish(t);
  const out = seg(t, SHORT.dur - .4, SHORT.dur - .04); if (out > 0) rectf(0, 0, VW, VH, `rgba(0,0,0,${out})`);
  if (o && o.safe) safeD();
}
// the Short's own times for its sound (stage/audio/short_mix.py): the pieces of the film's mix, every cut and its kind
// ('cut' a jump in the film, 'punch' / 'back' the window moves in or out on the same moment, 'black', 'end'), the Short's
// own words, and the film's cues that are on screen (in Short time)
function SHORTCUES() {
  const P = SHORT.pieces, cues = {}, ec = EC();
  for (const [n, v] of Object.entries(ec.cues)) { const p = P.find(p => p.kind === 'film' && v >= p.a - 1e-6 && v < p.b - 1e-6); if (p) cues[n] = +(p.t0 + (v - p.a) / p.sp).toFixed(3); }
  const cuts = P.map((p, i) => { const q = P[i - 1], cont = q && q.kind === 'film' && p.kind === 'film' && Math.abs(q.b - p.a) < .02;
    return { t: +p.t0.toFixed(3), kind: p.kind === 'black' ? 'black' : p.kind === 'end' ? 'end' : cont ? (p.win[0] >= q.win[0] ? 'punch' : 'back') : 'cut' }; });
  const inner = [];                                   // the film's own cuts that play inside a piece (they bring their own sound)
  for (const c of ec.cuts) { const p = P.find(p => p.kind === 'film' && c.t > p.a + .02 && c.t < p.b - .02); if (p) inner.push({ t: +(p.t0 + (c.t - p.a) / p.sp).toFixed(3), kind: c.kind }); }
  return { END: +SHORT.dur.toFixed(3), endAt: +SHORT.endAt.toFixed(3), cues, cuts, filmCuts: inner,
    pieces: P.filter(p => p.kind === 'film').map(p => ({ t0: +p.t0.toFixed(3), t1: +p.t1.toFixed(3), a: +p.a.toFixed(3), b: +p.b.toFixed(3), sp: p.sp })),
    caps: SHORT.caps.map(c => ({ t: c.at, d: c.d, kind: c.kind, slam: !!c.slam, write: c.write ?? .45, text: c.text })) };
}
