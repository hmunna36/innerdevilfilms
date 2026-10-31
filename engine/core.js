'use strict';
// Inner Devil Films: the film engine. Films and Shorts are drawn by code on one canvas, and every frame is a pure
// function of time t (seconds), so scrubbing is exact and frames render one by one (renderAt). Built from the film
// LUST | It Watches Back (27 Oct 2026), whose look and rules are the channel's house style.
//
// Two spaces:
//   the SCREEN, 1920 x 1080 (W x H): every picture is drawn here, through cam() (a framing of the world) or screen();
//   the OUTPUT canvas: 1920 x 1080 for a film (the screen as it is) or 1080 x 1920 for a Short. In a Short, VP maps a
//   9:16 window of the screen onto the output, fitted around the shot's subject (frameShot), and text is laid out in
//   output pixels inside the phone's safe area (ui(), U).
// A film is data plus a few drawings of its own: defineFilm({...}) in films/NN-slug/film.js (reference/engine.md).

const W = 1920, H = 1080;
const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const DEV = document.createElement('canvas'); DEV.width = W; DEV.height = H;   // the devil is drawn here first (cast.js)
const dctx = DEV.getContext('2d');
let OUT = { w: W, h: H, vertical: false };
let VP = { k: 1, x: 0, y: 0 };            // screen -> output: out = screen * k + (x, y)
let PC = [W / 2, H / 2];                  // the push-in's centre, in screen px
// where text goes in a Short (output px): the key zone measured on the owner's iPhone, 30 Sep 2026, is
// x 100-980 above y 1000 and x 100-870 below it, y 400-1640 (the app covers the rest)
const SAFE = { x0: 100, x1: 980, x1low: 870, y0: 400, y1: 1640, ymid: 1000 };
const U = { top: 560, low: 1470, lowX: 485, lowW: 740, topW: 840, s: 1.35 };
function setFormat(vertical) {
  OUT = vertical ? { w: 1080, h: 1920, vertical: true } : { w: W, h: H, vertical: false };
  cv.width = DEV.width = OUT.w; cv.height = DEV.height = OUT.h;
  VP = { k: 1, x: 0, y: 0 }; PC = [W / 2, H / 2];
}

// ---------- maths ----------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const E = {
  io: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  out: k => 1 - Math.pow(1 - k, 3),
  sine: k => -(Math.cos(Math.PI * k) - 1) / 2,
  lin: k => k
};
// 1 inside [a, b] with eased fades of fi / fo seconds, 0 outside
const win = (t, a, b, fi = .6, fo = .6) => t < a || t > b ? 0 :
  Math.min(fi > 0 ? E.sine(inv(a, a + fi, t)) : 1, fo > 0 ? E.sine(inv(b, b - fo, t)) : 1);
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (c1, c2, k) => [lerp(c1[0], c2[0], k), lerp(c1[1], c2[1], k), lerp(c1[2], c2[2], k)];
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${clamp(a)})`;
// eased lookup over [[t, v1, v2…], …]; values may be numbers or colours
function keys(list, t, f = E.sine, j = 1) {
  if (t <= list[0][0]) return list[0][j];
  for (let i = 1; i < list.length; i++) {
    if (t <= list[i][0]) {
      const k = f(inv(list[i - 1][0], list[i][0], t)), a = list[i - 1][j], b = list[i][j];
      return Array.isArray(a) ? mix(a, b, k) : lerp(a, b, k);
    }
  }
  return list[list.length - 1][j];
}

// ---------- look ----------
const C = {
  black: [4, 4, 6], night: [8, 9, 14], cream: [238, 230, 214], red: [232, 44, 52], blood: [110, 10, 18],
  blue: [150, 185, 255], amber: [255, 168, 70], gold: [255, 212, 140], grey: [150, 150, 156]
};
// bundled fonts (engine/fonts, SIL OFL): Inter for every capital, Gelasio for the whispers. They are the same on the Mac
// and in the cloud. ?fonts=system uses the Mac's own (how LUST was first rendered), for comparisons only.
const FONTS_SYSTEM = new URLSearchParams(location.search).get('fonts') === 'system';
const SANS = FONTS_SYSTEM ? '"Helvetica Neue", Helvetica, Arial, sans-serif' : '"IDF Sans", "Helvetica Neue", Arial, sans-serif';
const SERIF = FONTS_SYSTEM ? 'Georgia, "Times New Roman", serif' : '"IDF Serif", Georgia, serif';

// ---------- glow sprites, stamped with additive blending ----------
function sprite(c, size = 128) {
  const s = document.createElement('canvas'); s.width = s.height = size;
  const g = s.getContext('2d'), r = size / 2, grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, rgba(c, 1)); grd.addColorStop(.28, rgba(c, .5)); grd.addColorStop(1, rgba(c, 0));
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  return s;
}
const SPR = {};
for (const k of ['red', 'amber', 'gold', 'grey', 'blue', 'cream']) SPR[k] = sprite(C[k]);
function glow(spr, x, y, r, a) {
  if (a <= .003 || r <= 0) return;
  const g0 = ctx.globalAlpha;
  ctx.globalAlpha = g0 * Math.min(1, a);
  ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = g0;
}
function additive(fn) {
  const o = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'lighter'; fn(); ctx.globalCompositeOperation = o;
}

// ---------- camera: framings are hard cuts; slams shake the frame; every shot pushes in ----------
let SHX = 0, SHY = 0;
function setShake(t) {
  let a = 0;
  for (const s of FILM.slams) if (t >= s && t < s + .4) a = Math.max(a, 16 * (1 - inv(s, s + .4, t)));
  SHX = a ? Math.sin(t * 91) * a : 0; SHY = a ? Math.cos(t * 77) * a * .7 : 0;
}
let PUSH = 1;                        // a slow push-in on every shot, set per frame
// every transform goes through VP, so the same drawing serves the film and the Short
function setT(a, b, c, d, e, f) { const k = VP.k; ctx.setTransform(a * k, b * k, c * k, d * k, e * k + VP.x, f * k + VP.y); }
function cam(z = 1, cx = W / 2, cy = H / 2) {   // world point (cx, cy) at the centre of the screen, zoomed z
  const k = z * PUSH;
  setT(k, 0, 0, k, PC[0] * (1 - PUSH) + PUSH * W / 2 - cx * k + SHX, PC[1] * (1 - PUSH) + PUSH * H / 2 - cy * k + SHY);
}
function screen() { setT(PUSH, 0, 0, PUSH, PC[0] * (1 - PUSH) + SHX, PC[1] * (1 - PUSH) + SHY); }
function px() { ctx.setTransform(1, 0, 0, 1, 0, 0); }   // output pixels
// text space: the screen in a film; in a Short, output pixels with the same push-in and shake
function ui() {
  if (!OUT.vertical) return screen();
  ctx.setTransform(PUSH, 0, 0, PUSH, OUT.w / 2 * (1 - PUSH) + SHX * VP.k, OUT.h / 2 * (1 - PUSH) + SHY * VP.k);
}
// the framing in force at time t, from [[start, z, cx, cy], …]
function shotAt(list, t) { let s = list[0]; for (const x of list) if (t >= x[0]) s = x; return s; }
function glitch(t, extra = 0) {     // horizontal tears across the frame
  let amt = extra;
  for (const [a, b, s] of FILM.glitch) if (t >= a && t <= b) amt = Math.max(amt, s * Math.sin(Math.PI * inv(a, b, t)));
  if (amt <= .02) return;
  px();
  const seed = Math.floor(t * 24);
  for (let i = 0; i < 9; i++) {
    const y = rnd(seed * 13 + i) * OUT.h, h = 8 + rnd(seed * 7 + i) * 60, dx = (rnd(seed * 3 + i) - .5) * 160 * amt;
    ctx.drawImage(cv, 0, y, OUT.w, h, dx, y, OUT.w, h);
  }
  ctx.fillStyle = rgba(C.red, .08 * amt); ctx.fillRect(0, 0, OUT.w, OUT.h);
}

// ---------- the Short's window: VP fitted around a shot's subject ----------
// vframe(z, cx, cy): screen point (cx, cy) at the output centre (or at height oy); z 1 = the full screen height,
// a window 607 px of screen wide; under 1 the window is taller than the screen and the background fills the rest.
function vframe(z, cx, cy, oy = OUT.h / 2) { const k = OUT.h / H * z; VP = { k, x: OUT.w / 2 - cx * k, y: oy - cy * k }; }
// fit a box of the screen [x0, y0, x1, y1] into the part of the safe area the words leave free
const ZONES = { low: [120, 430, 960, 1380], top: [120, 660, 960, 1640], mid: [120, 430, 960, 1640], none: [60, 380, 1020, 1700] };
function fitVF(box, slot = 'low', zmin = .5, zmax = 3.2) {
  const [x0, y0, x1, y1] = box, Z = ZONES[slot] || ZONES.low, k0 = OUT.h / H;
  const k = clamp(Math.min((Z[2] - Z[0]) / Math.max(1, x1 - x0), (Z[3] - Z[1]) / Math.max(1, y1 - y0)), k0 * zmin, k0 * zmax);
  VP = { k, x: (Z[0] + Z[2]) / 2 - (x0 + x1) / 2 * k, y: (Z[1] + Z[3]) / 2 - (y0 + y1) / 2 * k };
  const left = -VP.x / k, right = (OUT.w - VP.x) / k;      // keep a narrow window inside the screen sideways
  if (right - left <= W) { if (left < 0) VP.x = 0; else if (right > W) VP.x = OUT.w - W * k; }
}
const vfAt = (list, u) => {                     // keyframed framing [[u, z, cx, cy], …] over a segment's own time
  if (u <= list[0][0]) return list[0].slice(1);
  for (let i = 1; i < list.length; i++) if (u <= list[i][0]) {
    const k = E.io(inv(list[i - 1][0], list[i][0], u));
    return [1, 2, 3].map(j => lerp(list[i - 1][j], list[i][j], k));
  }
  return list[list.length - 1].slice(1);
};
let SEG = null;                                 // the Short's current segment (short.js), null in a film
function frameShot(kind, p, t, L, len) {
  let vf = SEG && SEG.vf;
  const u = SEG ? (t - SEG.from) / (SEG.rate || 1) : 0;   // seconds into the segment
  if (typeof vf === 'function') vf = vf(u, t, L);
  else if (vf && Array.isArray(vf[0])) vf = vfAt(vf, u);
  if (vf) vframe(vf[0], vf[1], vf[2], vf[3]);
  else {
    const S = SHOT[kind], box = S.subject ? S.subject(t, p, L, len) : null;
    if (box) fitVF(box, (SEG && SEG.slot) || slotOf(kind)); else vframe(1, W / 2, H / 2);
  }
  PC = [(OUT.w / 2 - VP.x) / VP.k, (OUT.h / 2 - VP.y) / VP.k];
}
// where the devil's words sit in a Short: above a phone, low in every other shot
const slotOf = kind => (SEG && SEG.slot) || (kind === 'phone' || kind === 'reflection' ? 'top' : 'low');

// ---------- shapes and type ----------
function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function rrect(x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, Math.max(0, h), Math.max(0, Math.min(r, w / 2, Math.abs(h) / 2)));
  else ctx.rect(x, y, w, h);
}
function font(size, fam = SANS, weight = '400', style = 'normal') { ctx.font = `${style} ${weight} ${size}px ${fam}`; }
// tracked capitals centred on x; returns the width
function spaced(txt, x, y, size, col, a, track = 0, weight = '800', glowA = 0, fam = SANS) {
  font(size, fam, weight);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const chars = [...txt], ws = chars.map(ch => ctx.measureText(ch).width);
  const total = ws.reduce((s, w) => s + w, 0) + track * (chars.length - 1);
  if (a <= .003) return total;
  let cx = x - total / 2;
  if (glowA > 0) { ctx.shadowColor = rgba(col, glowA * a); ctx.shadowBlur = size * .35; }
  ctx.fillStyle = rgba(col, a);
  chars.forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + track; });
  ctx.shadowBlur = 0;
  return total;
}
// the size at which tracked text fits maxW (never larger than size)
function fitSize(txt, size, maxW, track = 0, weight = '800', fam = SANS) {
  const w = spaced(txt, 0, 0, size, C.cream, 0, track, weight, 0, fam);
  return w <= maxW ? size : size * maxW / w;
}
// a line of capitals that slams in at t0: oversized, then snaps to size in .15 s
function slam(txt, x, y, size, col, a, t0, t, track = 8, weight = '800', glowA = 0) {
  if (t < t0 || a <= .003) return 0;
  const sc = 1 + .28 * (1 - E.out(inv(t0, t0 + .15, t)));
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const w = spaced(txt, 0, 0, size, col, a * inv(t0, t0 + .06, t), track, weight, glowA);
  ctx.restore();
  return w;
}
// thin, cold capitals typed one by one, a little unsteady; centred on cx
function typeLine(txt, y, size, k, col, a, t, cx = W / 2) {
  font(size, SANS, '300'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const track = size * .18, chars = [...txt], ws = chars.map(c => ctx.measureText(c).width);
  let x = cx - (ws.reduce((p, w) => p + w, 0) + track * (chars.length - 1)) / 2;
  const n = chars.length * k, f = Math.floor(t * 20);
  chars.forEach((c, i) => {
    const al = clamp(n - i);
    if (al > 0) { ctx.fillStyle = rgba(col, a * al); ctx.fillText(c, x + (rnd(i + f * 31) - .5) * 1.6, y + (rnd(i + f * 17) - .5) * 1.2); }
    x += ws[i] + track;
  });
}
// words that fit maxW in the current font
function wrapText(txt, maxW) {
  const lines = []; let cur = '';
  for (const w of txt.split(' ')) {
    const test = cur ? cur + ' ' + w : w;
    if (cur && ctx.measureText(test).width > maxW) { lines.push(cur); cur = w; } else cur = test;
  }
  return cur ? [...lines, cur] : lines;
}
// typed lines for the tall frame: each [text, k] wraps to maxW and types on in order; returns the block's height
function typeBlock(lines, cy, size, col, a, t, cx = OUT.w / 2, maxW = 820) {
  font(size, SANS, '300');
  const track = size * .18, out = [];
  const wid = s => { const ch = [...s]; return ch.reduce((p, c) => p + ctx.measureText(c).width, 0) + track * (ch.length - 1); };
  for (const [txt, k] of lines) {
    const words = txt.split(' '), rows = []; let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (cur && wid(test) > maxW) { rows.push(cur); cur = w; } else cur = test; }
    if (cur) rows.push(cur);
    let done = [...txt].length * k;
    for (const r of rows) { const n = [...r].length; out.push([r, clamp(done / n)]); done -= n + 1; }
  }
  const lh = size * 1.45, y0 = cy - (out.length - 1) * lh / 2;
  out.forEach(([r, k], i) => typeLine(r, y0 + i * lh, size, k, col, a, t, cx));
  return out.length * lh;
}

// ---------- vignette and the end fade ----------
function drawVignette(t) {
  const beat = FILM.heartbeat.some(([a, b]) => t > a && t < b) ? .14 * Math.pow(Math.max(0, Math.sin(t * Math.PI * 2)), 12) : 0;   // slow heartbeat
  const v = keys(FILM.vignette, t) + beat, m = Math.min(OUT.w, OUT.h);
  const g = ctx.createRadialGradient(OUT.w / 2, OUT.h / 2, m * .3, OUT.w / 2, OUT.h / 2, m * 1.02);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${clamp(v)})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, OUT.w, OUT.h);
  const fb = SEG ? 0 : inv(FILM.dur - FILM.fadeOut, FILM.dur, t);
  if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, OUT.w, OUT.h); }
}

// ---------- the devil's words, on screen: there is no narration ----------
// Kind lines are a soft whisper in pink italics; its real lines (real: true) slam in as red, glitching capitals.
// In a film a line keeps the place of the shot it started in (beside the phone, or low in the frame) even when the shot
// cuts; in a Short it sits above the phone or low in the frame, inside the safe area.
const kindAt = t => { let k = FILM.shots[0][1]; for (const s of FILM.shots) if (t >= s[0]) k = s[1]; return k; };
let CUR = { kind: '', p: null };
function devilWords(t) {
  const c = FILM.words.find(v => t >= v.t && t < v.t + v.d + .5);
  if (!c || c.show === false || c.text.startsWith('(')) return;
  const real = !!c.real, kind = kindAt(c.t + .05), side = kind === 'phone' || kind === 'reflection';
  const a = win(t, c.t, c.t + c.d + .5, .1, .3), L = t - c.t, text = real ? c.text.toUpperCase() : c.text;
  let x, yc, size, maxW;
  if (!OUT.vertical) {
    x = side ? 1500 : W / 2; size = real ? (side ? 66 : 84) : (side ? 46 : 54); maxW = side ? 640 : 1500;
    yc = side ? 540 : kind === 'mirror' ? 985 : 945;
    ctx.setTransform(1, 0, 0, 1, SHX, SHY);
  } else {
    const top = slotOf(CUR.kind) === 'top';
    x = top ? OUT.w / 2 : U.lowX; size = real ? 92 : 66; maxW = top ? U.topW : U.lowW; yc = top ? U.top : U.low;
    ctx.setTransform(1, 0, 0, 1, SHX * VP.k, SHY * VP.k);
  }
  ctx.textBaseline = 'middle';
  if (real) font(size, SANS, '800'); else font(size, SERIF, '400', 'italic');
  const lines = wrapText(text, maxW), lh = size * 1.22, y0 = yc - (lines.length - 1) * lh / 2;
  if (real) {
    const sc = 1 + .25 * (1 - E.out(clamp(L / .15))), jit = L < .35 ? 1 : .2, f = Math.floor(t * 30);
    ctx.textAlign = 'center';
    lines.forEach((ln, i) => {
      const j = k => (rnd(f * 5 + i * 13 + k) - .5) * 12 * jit;
      ctx.save(); ctx.translate(x, y0 + i * lh); ctx.scale(sc, sc);
      ctx.fillStyle = `rgba(0,255,255,${.3 * a})`; ctx.fillText(ln, j(1) - 4, j(2));
      ctx.fillStyle = `rgba(255,0,60,${.45 * a})`; ctx.fillText(ln, j(3) + 4, j(4));
      ctx.shadowColor = 'rgba(0,0,0,.95)'; ctx.shadowBlur = 20;
      ctx.fillStyle = rgba(C.red, a); ctx.fillText(ln, 0, 0);
      ctx.restore();
    });
  } else {
    const shown = text.length * clamp(L / .55); let start = 0;
    ctx.textAlign = 'left'; ctx.shadowColor = rgba(C.red, .7 * a); ctx.shadowBlur = 20;
    if (OUT.vertical) {                  // a dark bed under the whisper, so it reads over any picture
      ctx.save(); ctx.shadowColor = `rgba(0,0,0,${.9 * a})`; ctx.shadowBlur = 28;
      lines.forEach((ln, i) => { ctx.fillStyle = `rgba(0,0,0,${.55 * a})`; ctx.fillText(ln, x - ctx.measureText(ln).width / 2, y0 + i * lh); });
      ctx.restore(); ctx.shadowColor = rgba(C.red, .7 * a); ctx.shadowBlur = 20;
    }
    lines.forEach((ln, i) => {
      const n = clamp(shown - start, 0, ln.length), whole = Math.floor(n), lx = x - ctx.measureText(ln).width / 2, y = y0 + i * lh;
      ctx.fillStyle = rgba([255, 214, 220], .95 * a); ctx.fillText(ln.slice(0, whole), lx, y);
      if (whole < ln.length && n > whole) { ctx.fillStyle = rgba([255, 214, 220], .95 * a * (n - whole)); ctx.fillText(ln[whole], lx + ctx.measureText(ln.slice(0, whole)).width, y); }
      start += ln.length + 1;
    });
    ctx.shadowBlur = 0;
  }
}

// ---------- shots and films ----------
// A shot is a drawing of one set-up: draw(t, p, L) with p its settings and L the time since it started; subject(t, p, L)
// returns the box of the screen it is about (for a Short's framing). Shots live in shots.js; a film adds its own.
const SHOT = {};
function defShot(name, draw, subject = null) { SHOT[name] = { draw, subject }; }
let FILM = null;
function defineFilm(f) {
  FILM = Object.assign({ fadeOut: 1.4, slams: [], glitch: [], flash: {}, vignette: [[0, .75]], heartbeat: [], words: [],
    expr: [[0, 'glazed']], phases: [{ name: 'Start', a: 0, b: f.dur }], app: { name: 'XXX', label: 'XXX', color: [200, 16, 46] } }, f);
  for (const s of FILM.shots) if (!SHOT[s[1]]) throw new Error(`film: no shot called "${s[1]}" (at ${s[0]} s)`);
  return FILM;
}
const shotIndex = t => { const S = FILM.shots; let i = 0; while (i + 1 < S.length && t >= S[i + 1][0]) i++; return i; };
// one frame of the film at film time t (a Short sets SEG first)
function renderFilm(t) {
  FRAME_NO++;
  px(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, OUT.w, OUT.h);      // every frame stands alone (frames render out of order)
  setShake(t);
  const i = shotIndex(t), [t0, kind, p] = FILM.shots[i], L = t - t0, len = (FILM.shots[i + 1] ? FILM.shots[i + 1][0] : FILM.dur) - t0;
  CUR = { kind, p };
  PUSH = (1 + .07 * clamp(L / len)) * (p && p.z ? p.z : 1);
  if (OUT.vertical) frameShot(kind, p, t, L, len);
  SHOT[kind].draw(t, p, L);
  PUSH = 1;
  px();
  const fl = FILM.flash[kind];
  if (fl && L < .08) { ctx.fillStyle = rgba(fl, .3 * (1 - L / .08)); ctx.fillRect(0, 0, OUT.w, OUT.h); }
  glitch(t);
  drawVignette(t);
  devilWords(t);
}
