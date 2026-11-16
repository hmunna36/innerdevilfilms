// BUILT by build.sh from src/*.js - edit the parts, not this file
'use strict';
// THE BOTTLE (film 07): the film's own drawing kit, on top of the engine (core.js, cast.js).
// Everything a shot needs that the engine does not have: a camera with keyframes, light (cones, pools, bokeh, haze),
// rain and wet reflections, a finishing pass (bloom, grain), a jointed figure for the man in any pose, Lily, the
// bottle, the glass, the devil's hand seen close, clocks and the small time stamp.
// Conventions: world px, +y down; every picture is a pure function of t. Colours are [r, g, b].
// Names here start with a capital K-word or are listed in src/README.md so parts written apart do not collide.

// ---------- palette ----------
const PAL = {
  ink: [6, 8, 12],                                   // the people: a dark silhouette
  tealD: [6, 22, 28], teal: [16, 62, 70], tealL: [58, 150, 152], tealG: [120, 230, 215],
  amber: [255, 176, 72], amberD: [164, 92, 24], whisky: [226, 132, 30],
  wood: [46, 27, 20], woodL: [112, 66, 38], brass: [214, 164, 84],
  yellow: [255, 204, 44], yellowD: [224, 150, 18], yellowL: [255, 236, 150],
  indigo: [12, 16, 40], night: [22, 30, 66], rainB: [120, 150, 215], lamp: [255, 214, 150],
  dawnA: [255, 170, 130], dawnB: [255, 220, 170], sky: [120, 170, 220],
  paper: [238, 230, 214], red: [232, 44, 52]
};

// ---------- small helpers ----------
const TAU = Math.PI * 2;
const ease = { io: E.io, out: E.out, sine: E.sine, lin: E.lin, in: k => k * k * k, back: k => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2) };
const seg = (t, a, b, f = E.sine) => f(inv(a, b, t));                    // eased 0..1 over [a, b]
const pulse = (t, a, b, fi = .15, fo = .15) => win(t, a, b, fi, fo);       // 1 inside [a, b]
const noise1 = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(rnd(i + seed * 57.3), rnd(i + 1 + seed * 57.3), u) * 2 - 1; };
const v2 = { add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]], mul: (a, k) => [a[0] * k, a[1] * k], len: a => Math.hypot(a[0], a[1]),
  lerp: (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], pol: (ang, r) => [Math.sin(ang) * r, -Math.cos(ang) * r] };   // pol: angle from straight up, clockwise
function lg(x0, y0, x1, y1, stops) {                                       // linear gradient: stops [[pos, col, alpha]]
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [p, c, a = 1] of stops) g.addColorStop(p, rgba(c, a));
  return g;
}
function rg(x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  for (const [p, c, a = 1] of stops) g.addColorStop(p, rgba(c, a));
  return g;
}
function poly(pts, style, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
  if (style) { ctx.fillStyle = style; ctx.fill(); }
}
function rectf(x, y, w, h, style) { ctx.fillStyle = style; ctx.fillRect(x, y, w, h); }
function disc(x, y, r, style) { ctx.fillStyle = style; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); }
function oval(x, y, rx, ry, style, rot = 0) { ctx.fillStyle = style; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); ctx.fill(); }
function stroke(pts, w, style, cap = 'round') {
  ctx.lineWidth = w; ctx.strokeStyle = style; ctx.lineCap = cap; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}
// blur what is drawn inside fn (lens blur for things near the camera or far behind); r in screen px
function blurred(r, fn) { const f = ctx.filter; ctx.filter = `blur(${Math.max(.01, r * VP.k).toFixed(2)}px)`; fn(); ctx.filter = f || 'none'; }
const SPRC = {};                                                           // a glow sprite of any colour
const spr = c => { const k = c.map(v => v | 0).join(','); return SPRC[k] || (SPRC[k] = sprite(c, 160)); };
const lite = (c, x, y, r, a) => glow(spr(c), x, y, r, a);                 // call inside additive()
const outPt = (x, y) => { const m = ctx.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };   // world -> output px, under the current transform

// ---------- the camera ----------
// kcam(L, len, keys): keys [[u, z, cx, cy], …] with u in 0..1 over the shot; returns [z, cx, cy] and calls cam().
// One key = a locked framing (the engine still pushes in 7 % over every shot). hand: a little hand-held drift.
function kcam(L, len, ks, o = {}) {
  const u = clamp(L / Math.max(.001, len)), f = o.ease || E.io;
  let fr = ks[0].slice(1);
  for (let i = 1; i < ks.length; i++) if (u >= ks[i - 1][0]) { const k = f(inv(ks[i - 1][0], ks[i][0], u)); fr = [1, 2, 3].map(j => lerp(ks[i - 1][j], ks[i][j], k)); }
  if (o.hand) { const h = o.hand, tt = o.t || L; fr[1] += noise1(tt * 1.3, 11) * 9 * h / fr[0]; fr[2] += noise1(tt * 1.1, 23) * 7 * h / fr[0]; }
  if (o.jolt) { const j = o.jolt; fr[1] += Math.sin(L * 50) * 14 * j / fr[0]; fr[2] += Math.cos(L * 43) * 10 * j / fr[0]; }
  cam(fr[0], fr[1], fr[2]);
  return fr;
}

// ---------- light ----------
// a cone of light from a lamp at (x, y): half-width w0 at the lamp, w1 at depth h; additive
function cone(x, y, w0, w1, h, col, a, skew = 0) {
  if (a <= .003) return;
  additive(() => {
    ctx.fillStyle = lg(0, y, 0, y + h, [[0, col, a], [.55, col, a * .35], [1, col, 0]]);
    poly([[x - w0, y], [x + w0, y], [x + w1 + skew, y + h], [x - w1 + skew, y + h]]);
    ctx.fill();
  });
}
// a pool of light on a floor or a table top (an ellipse)
function pool(x, y, rx, ry, col, a) {
  if (a <= .003) return;
  additive(() => { ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); glow(spr(col), 0, 0, rx, a); ctx.restore(); });
}
// out-of-focus lights: n discs in box [x0, y0, x1, y1], twinkling
function bokeh(seed, n, box, cols, r0, r1, a, t = 0) {
  additive(() => {
    for (let i = 0; i < n; i++) {
      const x = lerp(box[0], box[2], rnd(seed + i * 3.1)), y = lerp(box[1], box[3], rnd(seed + i * 5.7 + 1)), r = lerp(r0, r1, rnd(seed + i * 7.3 + 2));
      const c = cols[Math.floor(rnd(seed + i * 9.1 + 3) * cols.length) % cols.length], tw = .7 + .3 * Math.sin(t * (1 + rnd(seed + i) * 2) + i);
      ctx.fillStyle = rg(x, y, 0, r, [[0, c, a * tw * .55], [.72, c, a * tw * .5], [.9, c, a * tw * .22], [1, c, 0]]);
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
  });
}
// drifting haze: soft blobs across a band
function haze(t, x0, x1, y, h, col, a, seed = 0, n = 9) {
  additive(() => {
    for (let i = 0; i < n; i++) {
      const sp = 8 + rnd(seed + i * 2.3) * 14, span = x1 - x0 + 800;
      const x = x0 - 400 + ((rnd(seed + i * 4.1) * span + t * sp) % span), yy = y + (rnd(seed + i * 6.7) - .5) * h;
      ctx.save(); ctx.translate(x, yy); ctx.scale(1, .34); glow(spr(col), 0, 0, 380 + rnd(seed + i) * 260, a * (.6 + .4 * Math.sin(t * .5 + i))); ctx.restore();
    }
  });
}
// dust in a beam
function motes(t, box, n, col, a, seed = 0) {
  additive(() => { for (let i = 0; i < n; i++) {
    const x = lerp(box[0], box[2], (rnd(seed + i * 1.7) + t * .008 * (rnd(seed + i) - .5)) % 1), y = lerp(box[1], box[3], (rnd(seed + i * 3.3) + t * .012 * (.3 + rnd(seed + i * 2))) % 1);
    lite(col, x, y, 3 + rnd(seed + i * 5) * 5, a * (.4 + .6 * Math.abs(Math.sin(t * 1.3 + i))));
  } });
}

// ---------- rain ----------
// streaks across the whole frame, in screen space (call after the scene). o: n, len, speed, slant, a, col, seed, w
function rain(t, o = {}) {
  const n = o.n || 160, len = o.len || 90, sp = o.speed || 2100, sl = o.slant ?? .18, col = o.col || PAL.rainB, a = o.a ?? .32;
  screen(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const d = .45 + rnd(i * 3.7 + (o.seed || 0)) * .9, x0 = rnd(i * 1.3 + (o.seed || 0)) * (W + 500) - 250, ph = (rnd(i * 7.1) + t * sp * d / (H + 400)) % 1;
    const y = -200 + ph * (H + 400), x = x0 + sl * (y - 540) * 1;
    ctx.strokeStyle = rgba(col, a * d * (.5 + .5 * rnd(i * 11))); ctx.lineWidth = (o.w || 2.2) * d;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - sl * len * d, y - len * d); ctx.stroke();
  }
}
// rings where drops land on a wet ground band (world px): call inside the camera
function ripples(t, x0, x1, y0, y1, n, col, a, seed = 0) {
  ctx.lineWidth = 2;
  for (let i = 0; i < n; i++) {
    const life = .5 + rnd(seed + i * 2.9) * .5, age = ((t + rnd(seed + i * 4.3) * 5) % life) / life;
    const x = lerp(x0, x1, rnd(seed + i * 1.9 + Math.floor((t + rnd(seed + i * 4.3) * 5) / life) * 13.7)), y = lerp(y0, y1, rnd(seed + i * 6.1 + Math.floor((t + rnd(seed + i * 4.3) * 5) / life) * 7.9));
    const r = 4 + age * 26 * (.5 + (y - y0) / Math.max(1, y1 - y0));
    ctx.strokeStyle = rgba(col, a * (1 - age)); ctx.beginPath(); ctx.ellipse(x, y, r, r * .28, 0, 0, TAU); ctx.stroke();
  }
}
// the wet ground mirrors what is above the line worldY (drawn so far), rippling; call inside the camera, before anything
// that stands in front of the reflection. depth: how far down it reaches (world px)
function wet(worldY, depth, a = .4, t = 0, wob = 5) {
  const m = ctx.getTransform(), y = m.d * worldY + m.f, d = depth * m.d, strip = Math.max(3, 5 * VP.k);
  if (y <= 2 || y >= OUT.h) return;
  ctx.save(); px();
  for (let s = 0; s < d && y + s < OUT.h; s += strip) {
    const src = y - s - strip; if (src < 0) break;
    const k = s / d, dx = Math.sin(s * .09 + t * 2.6) * wob * (.3 + k) * VP.k;
    ctx.globalAlpha = a * (1 - k * .75);
    ctx.save(); ctx.translate(dx, y + s + strip); ctx.scale(1, -1); ctx.drawImage(cv, 0, src, OUT.w, strip, 0, 0, OUT.w, strip); ctx.restore();
  }
  ctx.restore();
}

// ---------- the finishing pass: bloom, a colour wash, grain ----------
const KFX = (() => { const a = document.createElement('canvas'), b = document.createElement('canvas'); return { a, b, ga: a.getContext('2d'), gb: b.getContext('2d') }; })();
const KGRAIN = (() => {
  const tiles = [];
  for (let k = 0; k < 4; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), im = g.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = 128 + (rnd(i * 1.37 + k * 9973.1) - .5) * 150; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0); tiles.push(c);
  }
  return tiles;
})();
// o: bloom (0-1), grain (0-1), wash [col, alpha] (a colour laid over everything, 'soft-light'), dark (0-1 edges)
function finish(t, o = {}) {
  const bl = o.bloom ?? .55, gr = o.grain ?? .5;
  px();
  if (bl > .01) {
    const w = Math.round(OUT.w / 4), h = Math.round(OUT.h / 4), { a, b, ga, gb } = KFX;
    if (a.width !== w || a.height !== h) { a.width = b.width = w; a.height = b.height = h; }
    ga.globalCompositeOperation = 'source-over'; ga.filter = 'none'; ga.drawImage(cv, 0, 0, w, h);
    ga.globalCompositeOperation = 'multiply'; ga.drawImage(a, 0, 0);                    // squares it: only the bright parts stay
    gb.globalCompositeOperation = 'source-over'; gb.clearRect(0, 0, w, h); gb.filter = `blur(${(OUT.w / 1920 * 7).toFixed(1)}px)`; gb.drawImage(a, 0, 0); gb.filter = 'none';
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = bl; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(b, 0, 0, OUT.w, OUT.h); ctx.restore();
  }
  if (o.wash) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(o.wash[0], o.wash[1]); ctx.fillRect(0, 0, OUT.w, OUT.h); ctx.restore(); }
  if (gr > .01) {
    const f = Math.floor(t * 30), tile = KGRAIN[f % 4], ox = Math.floor(rnd(f * 3.1) * 256), oy = Math.floor(rnd(f * 5.3) * 256);
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .1 * gr;
    for (let y = -oy; y < OUT.h; y += 256) for (let x = -ox; x < OUT.w; x += 256) ctx.drawImage(tile, x, y);
    ctx.restore();
  }
}
// a film-local shot: draw(t, p, L, len) then the finishing pass; box: what a Short frames (screen px) or a function
const KFIN = {};
function shot(name, draw, fin = {}, box = null) {
  KFIN[name] = fin;
  defShot(name, (t, p, L) => {
    const i = shotIndex(t), len = SEG ? Math.max(.4, (FILM.shots[i + 1] ? FILM.shots[i + 1][0] : FILM.dur) - FILM.shots[i][0]) : (FILM.shots[i + 1] ? FILM.shots[i + 1][0] : FILM.dur) - FILM.shots[i][0];
    draw(t, p || {}, L, len);
    finish(t, typeof fin === 'function' ? fin(t, p || {}, L, len) : fin);
  }, box ? (typeof box === 'function' ? box : () => box) : null);
}

// ---------- the small time stamp (top left): the film has no clock cards ----------
function stamp(L, big, small = '', a = 1, col = [226, 232, 240]) {
  const k = inv(0, .25, L) * a; if (k <= .01) return;
  ui(); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const x = OUT.vertical ? 110 : 96, y = OUT.vertical ? 470 : 104, s = OUT.vertical ? .9 : 1;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 18;
  font(100 * s, SANS, '300'); ctx.fillStyle = rgba(col, k); ctx.fillText(big, x, y);
  if (small) { font(38 * s, SANS, '700'); ctx.fillStyle = rgba(col, .92 * k); const chars = [...small]; let cx = x + 4; for (const ch of chars) { ctx.fillText(ch, cx, y + 84 * s); cx += ctx.measureText(ch).width + 8 * s; } }
  ctx.restore();
}

// ---------- the jointed figure (the man, any adult): a pose for drawPerson ----------
// man(o) -> P { head, parts, j }: side view. o.hip [x, y]; o.s scale; o.dir 1 faces right, -1 left;
// o.lean (radians, + = forward), o.neck (extra tilt of the head, + = forward), o.torso (length, default 172);
// o.hands [near, far] targets in world px (null = hangs, or o.swing radians), o.elbow [near, far] 1 = elbow back/down, -1 = up/forward;
// o.feet [near, far] targets in world px (default: standing under the hip), o.knee 1 = knees forward.
// j: the joints { hip, sh, head, handN, handF, footN, footF, elN, elF, kneeN, kneeF } for props.
function man(o) {
  const s = o.s || 1, d = o.dir || 1, hip = o.hip, lean = (o.lean || 0) * d, T = (o.torso || 172) * s;
  const sh = [hip[0] + Math.sin(lean) * T, hip[1] - Math.cos(lean) * T];
  const na = lean + (o.neck || 0) * d, hd = [sh[0] + Math.sin(na) * 64 * s, sh[1] - Math.cos(na) * 64 * s];
  const UA = 80 * s, FA = 74 * s, TH = 100 * s, SN = 100 * s, kd = o.knee ?? 1;
  const feet = o.feet || [[hip[0] + 6 * s * d, hip[1] + 196 * s], [hip[0] - 14 * s * d, hip[1] + 196 * s]];
  const legs = feet.map((f, i) => { const kk = Array.isArray(kd) ? kd[i] : kd; const [k, e] = ik(hip, f, TH, SN, j => kk * d * j[0] - .2 * j[1]); return [hip, k, e]; });
  const hands = o.hands || [null, null], el = o.elbow || [1, 1];
  const arms = hands.map((h, i) => {
    if (!h) { const sw = (o.swing || 0) * (i ? -1 : 1) * d, e = [sh[0] + Math.sin(sw) * UA, sh[1] + Math.cos(sw) * UA]; return [sh, e, [e[0] + Math.sin(sw + .25 * d) * FA, e[1] + Math.cos(sw + .25 * d) * FA]]; }
    const [e, w] = ik(sh, h, UA, FA, j => -el[i] * d * j[0] + el[i] * .35 * j[1]); return [sh, e, w];
  });
  const w = o.thick || 1;
  return {
    head: [hd[0], hd[1], (o.headR || 38) * s],
    parts: [[legs[1], 31 * s * w], [arms[1], 20 * s * w], [[hip, sh], 56 * s * w], [legs[0], 34 * s * w], [arms[0], 22 * s * w]],
    j: { hip, sh, head: hd, handN: arms[0][2], handF: arms[1][2], elN: arms[0][1], elF: arms[1][1], footN: legs[0][2], footF: legs[1][2], kneeN: legs[0][1], kneeF: legs[1][1] }, s, d
  };
}
// stride feet for a walk or run toward dir on ground y: ph radians, len stride half-length, lift
function stride(x, y, ph, len, lift, d = 1) {
  const f = p => [x + Math.sin(p) * len * d, y - Math.max(0, Math.cos(p)) * lift];
  return [f(ph), f(ph + Math.PI)];
}
// the man drawn: dark, rim-lit from (lx, ly) in colour rim, his face with expression ex ('tired' or an EXPR object)
// L: { rim, a, lx, ly, back, fill, face: false to hide (seen from behind), turn, light, la }
function drawMan(P, ex, L = {}) {
  drawPerson(P, L.fill || PAL.ink, L.rim || PAL.amber, L.a ?? .6, L.lx ?? 0, L.ly ?? -1, L.back ?? false);
  if (L.face === false) return;
  const e = typeof ex === 'string' ? EXPR[ex] : ex, [x, y, r] = P.head;
  ctx.save();
  if (P.d < 0) { ctx.translate(2 * x, 0); ctx.scale(-1, 1); }
  face(x, y, r, e, { turn: L.turn ?? .9, light: L.light || L.rim || PAL.amber, la: L.la ?? .3, lc: L.lc || [.5, -.4], featA: L.featA });
  ctx.restore();
}
// his face blended between two expressions
const exMix = (a, b, k) => mixExpr(EXPR[a], EXPR[b], clamp(k));

// ---------- Lily: six, a yellow raincoat with a hood. Her yellow is the only yellow in the film ----------
// lily(o) -> pose: o.at [x, y] her feet (standing) or seat (sitting); o.s; o.dir; o.pose: 'stand' | 'sit' | 'hug' (knees
// hugged) | 'walk' | 'run' | 'hang' | 'cross' (cross-legged); o.ph stride phase; o.arms [near, far] hand targets;
// o.look head turn offset in px; o.lean
function lily(o) {
  const s = o.s || 1, d = o.dir || 1, pose = o.pose || 'stand', [x, y] = o.at, lean = (o.lean || 0) * d;
  const LEG = 30 * s, TOR = 62 * s, AU = 30 * s, AF = 28 * s;
  let hip, feet, kneeDir = 1;
  if (pose === 'sit') { hip = [x, y - 6 * s]; feet = [[x + 34 * s * d, y + 52 * s], [x + 22 * s * d, y + 52 * s]]; }
  else if (pose === 'hug') { hip = [x, y - 6 * s]; feet = [[x + 40 * s * d, y - 2 * s], [x + 34 * s * d, y - 2 * s]]; }
  else if (pose === 'cross') { hip = [x, y - 6 * s]; feet = [[x + 26 * s * d, y - 2 * s], [x - 20 * s * d, y - 2 * s]]; }
  else if (pose === 'hang') { hip = [x, y]; const k = Math.sin((o.ph || 0)) * 14 * s; feet = [[x + k + 6 * s, y + 56 * s], [x - k - 6 * s, y + 54 * s]]; }
  else {
    const run = pose === 'run', ph = o.ph || 0, len = pose === 'stand' ? 0 : (run ? 26 : 16) * s, lift = pose === 'stand' ? 0 : (run ? 22 : 10) * s;
    const f = p => [x + Math.sin(p) * len * d + (pose === 'stand' ? (p ? -7 : 7) * s : 0), y - Math.max(0, Math.cos(p)) * lift];
    feet = [f(ph), f(ph + Math.PI)]; hip = [x, y - 2 * LEG * .96 + (pose === 'stand' ? 0 : Math.abs(Math.sin(ph)) * 3 * s)];
  }
  const sh = [hip[0] + Math.sin(lean) * TOR, hip[1] - Math.cos(lean) * TOR];
  const hd = [sh[0] + Math.sin(lean) * 34 * s + (o.look || 0) * s, sh[1] - Math.cos(lean) * 34 * s + (o.nod || 0) * s];
  const legs = feet.map(f => { const [k, e] = ik(hip, f, LEG, LEG, j => kneeDir * d * j[0] - .2 * j[1]); return [hip, k, e]; });
  const hands = o.arms || [null, null];
  const arms = hands.map((h, i) => {
    if (!h) { const sw = (o.swing || 0) * (i ? -1 : 1) * d + .08 * (i ? -1 : 1), e = [sh[0] + Math.sin(sw) * AU, sh[1] + 6 * s + Math.cos(sw) * AU]; return [[sh[0], sh[1] + 6 * s], e, [e[0] + Math.sin(sw + .2 * d) * AF, e[1] + Math.cos(sw + .2 * d) * AF]]; }
    const a0 = [sh[0], sh[1] + 6 * s], [e, w] = ik(a0, h, AU, AF, j => -d * j[0] + .4 * j[1]); return [a0, e, w];
  });
  return { s, d, pose, hip, sh, head: [hd[0], hd[1], 31 * s], legs, arms, lean };
}
const LILY_EX = {
  happy: { lid: .12, brow: .2, browH: .1, smile: .9, open: .25, grit: 0, gx: .2, gy: -.1, tear: 0, sweat: 0 },
  hope: { lid: .05, brow: .35, browH: .14, smile: .25, open: 0, grit: 0, gx: .7, gy: 0, tear: 0, sweat: 0 },
  worry: { lid: .1, brow: .8, browH: .12, smile: -.4, open: 0, grit: 0, gx: .8, gy: .1, tear: 0, sweat: 0 },
  blank: { lid: .45, brow: .7, browH: .04, smile: -.55, open: 0, grit: 0, gx: 0, gy: .9, tear: 0, sweat: 0 },
  hurt: { lid: .2, brow: .95, browH: .1, smile: -.7, open: 0, grit: 0, gx: 0, gy: .1, tear: .8, sweat: 0 },
  shut: { lid: 1, brow: .3, browH: .06, smile: .6, open: 0, grit: 0, gx: 0, gy: 0, tear: 0, sweat: 0 },
  count: { lid: .1, brow: .1, browH: .12, smile: .6, open: .35, grit: 0, gx: .3, gy: -.3, tear: 0, sweat: 0 },
  wary: { lid: .25, brow: .5, browH: .02, smile: -.25, open: 0, grit: 0, gx: .6, gy: .2, tear: 0, sweat: 0 }
};
// L: { a (how lit, 0-1), rim colour, hoodUp (default true), face: false (seen from behind), wet (rain sheen 0-1), glow (her own light 0-1), ex, turn }
function drawLily(P, ex = 'hope', L = {}) {
  const { s, d } = P, lit = L.a ?? 1, Y = mix([70, 54, 10], PAL.yellow, clamp(.35 + .65 * lit)), YD = mix([44, 32, 6], PAL.yellowD, clamp(.35 + .65 * lit)), YL = mix(Y, PAL.yellowL, .6);
  const ink = PAL.ink, [hx, hy, r] = P.head;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (L.glow) additive(() => lite(PAL.yellow, P.sh[0], P.sh[1] + 20 * s, 190 * s, .5 * L.glow));
  // far leg, far arm
  stroke(P.legs[1], 13 * s, rgba(ink)); stroke([P.legs[1][2], [P.legs[1][2][0] + 9 * s * d, P.legs[1][2][1]]], 14 * s, rgba(YD));
  stroke(P.arms[1], 14 * s, rgba(YD));
  // the coat: a bell from the shoulders to above the knee
  const hem = P.pose === 'hug' || P.pose === 'cross' || P.pose === 'sit' ? 30 : 44, c = Math.cos(P.lean), sn = Math.sin(P.lean);
  const along = (u, v) => [P.sh[0] + (P.hip[0] - P.sh[0]) * u - c * v * s * 1, P.sh[1] + (P.hip[1] - P.sh[1]) * u + sn * v * s];   // u along the spine, v across
  const coat = [along(-.06, -22), along(-.06, 22), along(.55, 30), along(1.0 + hem / 100, 38), along(1.0 + hem / 100, -38), along(.55, -30)];
  ctx.fillStyle = lg(P.sh[0] - 40 * s, 0, P.sh[0] + 40 * s, 0, d > 0 ? [[0, YD], [.45, Y], [1, YL]] : [[0, YL], [.55, Y], [1, YD]]);
  ctx.beginPath(); ctx.moveTo(coat[0][0], coat[0][1]); ctx.lineTo(coat[1][0], coat[1][1]); ctx.quadraticCurveTo(coat[2][0], coat[2][1], coat[3][0], coat[3][1]);
  ctx.quadraticCurveTo((coat[3][0] + coat[4][0]) / 2, (coat[3][1] + coat[4][1]) / 2 + 9 * s, coat[4][0], coat[4][1]); ctx.quadraticCurveTo(coat[5][0], coat[5][1], coat[0][0], coat[0][1]); ctx.fill();
  // near leg, boots
  stroke(P.legs[0], 14 * s, rgba(ink)); stroke([P.legs[0][2], [P.legs[0][2][0] + 10 * s * d, P.legs[0][2][1]]], 15 * s, rgba(Y));
  // the hood behind the head, the head, the hood's rim round the face
  if (L.hoodUp !== false) { ctx.fillStyle = rgba(Y); ctx.beginPath(); ctx.ellipse(hx - 5 * s * d, hy - 3 * s, r * 1.2, r * 1.26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - r * 1.1, hy + r * .5); ctx.lineTo(hx + r * 1.0, hy + r * .5); ctx.lineTo(P.sh[0] + 26 * s, P.sh[1] + 8 * s); ctx.lineTo(P.sh[0] - 26 * s, P.sh[1] + 8 * s); ctx.fill(); }
  disc(hx, hy, r, rgba(ink));
  if (L.face !== false) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.clip();
    if (d < 0) { ctx.translate(2 * hx, 0); ctx.scale(-1, 1); }
    face(hx - 1 * s, hy + r * .16, r * 1.22, typeof ex === 'string' ? LILY_EX[ex] : ex, { turn: L.turn ?? .75, light: L.rim || PAL.lamp, la: .28 * lit, lc: [.4, -.5], featA: L.featA ?? .95 });
    ctx.restore();
  }
  if (L.hoodUp !== false) {                                                // the hood's front edge and a highlight
    ctx.strokeStyle = rgba(YL, .9); ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.06, Math.PI * (d > 0 ? .98 : 1.3), Math.PI * (d > 0 ? 1.7 : 2.02)); ctx.stroke();
    ctx.strokeStyle = rgba(Y); ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.08, Math.PI * .12, Math.PI * .88); ctx.stroke();
  }
  // near arm (a yellow sleeve), a small dark hand
  stroke(P.arms[0], 15 * s, rgba(Y)); disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(ink)); disc(P.arms[1][2][0], P.arms[1][2][1], 6 * s, rgba(ink));
  if (L.wet) { ctx.strokeStyle = rgba([255, 255, 255], .5 * L.wet); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(hx - 4 * s * d, hy - 4 * s, r * 1.18, Math.PI * 1.15, Math.PI * 1.55); ctx.stroke(); }
}
const lilyBox = (P, pad = 30) => [P.head[0] - P.head[2] * 1.5 - pad, P.head[1] - P.head[2] * 1.5 - pad, P.head[0] + P.head[2] * 1.5 + pad, Math.max(P.legs[0][2][1], P.legs[1][2][1]) + pad];

// ---------- glass ----------
// bottle(x, y, s, o): standing on (x, y) (the middle of its base), about 300·s tall. o: tilt (radians), cork (0 out … 1 in),
// level (0-1 whisky), glass colour, inner(fn) draws what is inside in bottle units (origin at the base centre, y up
// negative, the inside is about ±44 wide and 170 tall), glowC / glowA (light from inside), label(fn), a (alpha), hot (red edge 0-1)
const BOT = { w: 104, body: 190, sh: 36, neck: 66, nw: 30 };
function bottlePath(g = ctx) {
  const { w, body, sh, neck, nw } = BOT, h = w / 2, n = nw / 2;
  g.beginPath(); g.moveTo(-h + 10, 0); g.lineTo(h - 10, 0); g.quadraticCurveTo(h, 0, h, -10); g.lineTo(h, -body);
  g.bezierCurveTo(h, -body - sh * .7, n, -body - sh * .5, n, -body - sh); g.lineTo(n, -body - sh - neck); g.lineTo(n + 5, -body - sh - neck); g.lineTo(n + 5, -body - sh - neck - 12); g.lineTo(-n - 5, -body - sh - neck - 12);
  g.lineTo(-n - 5, -body - sh - neck); g.lineTo(-n, -body - sh - neck); g.lineTo(-n, -body - sh); g.bezierCurveTo(-n, -body - sh * .5, -h, -body - sh * .7, -h, -body); g.lineTo(-h, -10); g.quadraticCurveTo(-h, 0, -h + 10, 0); g.closePath();
}
function bottle(x, y, s, o = {}) {
  const { w, body, sh, neck, nw } = BOT, gc = o.glass || PAL.tealL, a = o.a ?? 1, top = -(body + sh + neck + 12);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt || 0); ctx.scale(s, s); ctx.globalAlpha *= a;
  if (o.glowA) additive(() => { lite(o.glowC || PAL.amber, 0, -body * .5, 250, .6 * o.glowA); lite(o.glowC || PAL.amber, 0, -body * .45, 110, .5 * o.glowA); });
  const dn = 1 + 4 * (o.dense || 0);
  bottlePath(); ctx.fillStyle = lg(-w / 2, 0, w / 2, 0, [[0, gc, Math.min(1, .3 * dn)], [.2, gc, Math.min(1, .1 * dn)], [.75, gc, Math.min(1, .08 * dn)], [1, gc, Math.min(1, .26 * dn)]]); ctx.fill();
  ctx.save(); bottlePath(); ctx.clip();
  if (o.level > .005) {                                                    // the drink
    const ly = -6 - (body + sh * .2 - 6) * clamp(o.level), wc = o.liquid || PAL.whisky;
    ctx.fillStyle = lg(0, ly, 0, 0, [[0, mix(wc, [255, 220, 150], .35), .92], [1, mix(wc, [70, 24, 4], .5), .96]]); ctx.fillRect(-w, ly, 2 * w, -ly + 4);
    ctx.fillStyle = rgba([255, 236, 190], .55); ctx.fillRect(-w, ly - 1.5, 2 * w, 3);
  }
  if (o.inner) { ctx.save(); o.inner(); ctx.restore(); }
  if (o.label) { ctx.save(); o.label(); ctx.restore(); }
  ctx.fillStyle = lg(-w / 2, 0, w / 2, 0, [[0, [255, 255, 255], .22], [.1, [255, 255, 255], .05], [.5, [255, 255, 255], 0], [.9, [0, 0, 0], .12], [1, [0, 0, 0], .3]]);   // the round of the glass
  ctx.fillRect(-w, top, 2 * w, -top);
  ctx.fillStyle = rgba([255, 255, 255], .3); rrect(-w / 2 + 11, -body + 6, 9, body * .62, 5); ctx.fill();                  // a long highlight
  ctx.fillStyle = rgba([255, 255, 255], .16); rrect(w / 2 - 20, -body * .5, 6, body * .36, 3); ctx.fill();
  ctx.restore();
  ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; bottlePath();
  ctx.strokeStyle = o.hot ? rgba(mix(gc, [255, 70, 50], o.hot), .9) : lg(-w / 2, 0, w / 2, 0, [[0, mix(gc, [255, 255, 255], .5), .95], [.5, gc, .5], [1, mix(gc, [255, 255, 255], .2), .8]]); ctx.stroke();
  if ((o.cork ?? 1) > -.5) {                                               // the cork: cork 1 = pushed in, 0 = resting on the lip, below 0 it floats above
    const c = clamp(o.cork ?? 1, -1, 1), cy = top - 30 + 22 * Math.max(0, c) - 60 * Math.max(0, -c) * 2;
    ctx.fillStyle = lg(-nw / 2, 0, nw / 2, 0, [[0, [150, 104, 62]], [.4, [206, 160, 104]], [1, [120, 78, 44]]]); rrect(-nw / 2 + 2, cy, nw - 4, 34, 5); ctx.fill();
    ctx.fillStyle = rgba([90, 56, 30], .5); for (let i = 0; i < 5; i++) ctx.fillRect(-nw / 2 + 5 + rnd(i + 40) * (nw - 12), cy + 4 + rnd(i + 50) * 22, 3, 2);
  }
  ctx.restore();
}
// a low tumbler standing on (x, y): level 0-1; o: s, glowA, tilt, a
function tumbler(x, y, s, level = 0, o = {}) {
  const w = 96, h = 104;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt || 0); ctx.scale(s, s); ctx.globalAlpha *= o.a ?? 1;
  const path = () => { ctx.beginPath(); ctx.moveTo(-w / 2 + 8, 0); ctx.lineTo(w / 2 - 8, 0); ctx.lineTo(w / 2 + 2, -h); ctx.lineTo(-w / 2 - 2, -h); ctx.closePath(); };
  if (level > .01 && (o.glowA ?? 1) > 0) additive(() => lite(PAL.amber, 0, -h * .35, 150, .45 * level * (o.glowA ?? 1)));
  path(); ctx.fillStyle = rgba([200, 235, 235], .1); ctx.fill();
  ctx.save(); path(); ctx.clip();
  if (level > .01) {
    const ly = -14 - (h - 30) * clamp(level) * .8, sl = (o.slosh || 0) * 10;
    ctx.fillStyle = lg(0, ly, 0, 0, [[0, [250, 180, 70], .95], [1, [150, 62, 10], .98]]);
    poly([[-w, ly - sl], [w, ly + sl], [w, 0], [-w, 0]]); ctx.fill();
    ctx.strokeStyle = rgba([255, 232, 180], .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w, ly - sl); ctx.lineTo(w, ly + sl); ctx.stroke();
  }
  ctx.fillStyle = rgba([220, 245, 245], .2); ctx.fillRect(-w, -14, 2 * w, 14);                 // the thick base
  ctx.fillStyle = rgba([255, 255, 255], .28); rrect(-w / 2 + 10, -h + 10, 7, h - 34, 3); ctx.fill();
  ctx.restore();
  path(); ctx.lineWidth = 3; ctx.strokeStyle = lg(-w / 2, 0, w / 2, 0, [[0, [235, 255, 255], .9], [.5, [200, 240, 240], .35], [1, [235, 255, 255], .7]]); ctx.stroke();
  ctx.strokeStyle = rgba([255, 255, 255], .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -h, w / 2 + 2, 5, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}

// ---------- the devil's hand, seen close (the inserts on the bar): black inside a hot red edge, like the rest of it ----------
// claw(wrist, ang, s, o): the forearm comes in along ang (radians, 0 = pointing right) and ends at wrist; four clawed
// fingers and a thumb. o.curl 0 open … 1 closed round something; o.spread; o.arm length of forearm drawn; o.a; o.point (index out, the rest curled)
function claw(wrist, ang, s, o = {}) {
  const curl = o.curl ?? .3, spread = o.spread ?? 1, a = o.a ?? 1, arm = (o.arm ?? 900) * s, pts = [];
  const dir = k => [Math.cos(k), Math.sin(k)], shapes = [];
  const strip = (p, ws) => shapes.push(stripPts(p, ws.map(w => w * s)));
  const back = [wrist[0] - Math.cos(ang) * arm, wrist[1] - Math.sin(ang) * arm];
  strip([back, v2.lerp(back, wrist, .6), wrist], [34, 26, 19]);
  const palm = [wrist[0] + Math.cos(ang) * 46 * s, wrist[1] + Math.sin(ang) * 46 * s];
  strip([wrist, palm], [22, 27]);
  for (let f = 0; f < 4; f++) {
    const off = (f - 1.5) * .3 * spread, c = o.point && f !== 1 ? 1 : (o.point ? 0 : curl), base = [palm[0] + Math.cos(ang + off * 1.5) * 20 * s, palm[1] + Math.sin(ang + off * 1.5) * 20 * s];
    const L1 = (64 + (f === 1 || f === 2 ? 14 : 0)) * s, a1 = ang + off + c * 1.0 * (o.side ?? 1), k1 = v2.add(base, v2.mul(dir(a1), L1));
    const a2 = a1 + (.25 + c * 1.25) * (o.side ?? 1), k2 = v2.add(k1, v2.mul(dir(a2), L1 * .78));
    const a3 = a2 + (.3 + c * .9) * (o.side ?? 1), tip = v2.add(k2, v2.mul(dir(a3), 46 * s));
    strip([base, k1, k2, tip], [10, 8.5, 6.5, .8]);
  }
  const ta = ang - 1.15 * (o.side ?? 1) + curl * .5 * (o.side ?? 1), tb = v2.add(wrist, v2.mul(dir(ang), 18 * s)), t1 = v2.add(tb, v2.mul(dir(ta), 56 * s)), t2 = v2.add(t1, v2.mul(dir(ta + .7 * (o.side ?? 1)), 52 * s));
  strip([tb, t1, t2], [11, 8, .8]);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255,40,30,.9)'; ctx.shadowBlur = 26 * VP.k * pxPerUnit(ctx) / Math.max(.3, VP.k);
  for (const [col, k] of [[TWIN_COL.rim, 5 * s], [TWIN_COL.edge, 2 * s], [TWIN_COL.body, 0]]) {
    ctx.fillStyle = ctx.strokeStyle = rgba(col);
    for (const p of shapes) { ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (const q of p.slice(1)) ctx.lineTo(q[0], q[1]); ctx.closePath(); if (k > 0) { ctx.lineWidth = 2 * k; ctx.stroke(); } ctx.fill(); }
    ctx.shadowBlur = 0;
  }
  ctx.restore();
  return { palm, wrist };
}

// ---------- clocks ----------
// a round wall clock: hour h (may be fractional), o.loose 0-1 (the hands swing free), o.none (no hands), o.spin (radians a second, both hands), o.face / o.rim colours, o.a
function wallClock(x, y, r, h, o = {}, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= o.a ?? 1;
  disc(0, 0, r * 1.12, rgba(o.rim || [40, 30, 24])); disc(0, 0, r, rgba(o.face || [226, 214, 190]));
  ctx.fillStyle = lg(0, -r, 0, r, [[0, [255, 255, 255], .25], [1, [0, 0, 0], .25]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba([40, 30, 24], .9); ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.lineWidth = r * (i % 3 ? .03 : .07); line(Math.sin(a) * r * .8, -Math.cos(a) * r * .8, Math.sin(a) * r * .9, -Math.cos(a) * r * .9); }
  if (!o.none) {
    const lo = o.loose || 0, sp = (o.spin || 0) * t;
    const ha = lerp(h / 12 * TAU, Math.PI + Math.sin(t * 2.1) * .25, lo) + sp * .3, ma = lerp((h % 1) * TAU, Math.PI + Math.sin(t * 2.6 + 1) * .35, lo) + sp;
    ctx.lineWidth = r * .09; line(0, 0, Math.sin(ha) * r * .5, -Math.cos(ha) * r * .5);
    ctx.lineWidth = r * .06; line(0, 0, Math.sin(ma) * r * .76, -Math.cos(ma) * r * .76);
  }
  disc(0, 0, r * .07, rgba([40, 30, 24]));
  ctx.restore();
}

// ---------- busts for close-ups ----------
// the man's head and shoulders, big (x, y = the centre of his head, r its radius). L: { fill, rim, lc [lx, ly] the
// side the light comes from, light, la, turn (0 facing us … 1 three-quarters right), dir (-1 mirrors him), wet (rain 0-1), tilt (radians) }
function manBust(x, y, r, ex, L = {}) {
  const fillc = L.fill || [9, 10, 14], rim = L.rim || PAL.amber, lc = L.lc || [.6, -.4], e = typeof ex === 'string' ? EXPR[ex] : ex;
  ctx.save(); ctx.translate(x, y); ctx.rotate(L.tilt || 0); if ((L.dir || 1) < 0) ctx.scale(-1, 1); ctx.translate(-x, -y);
  ctx.fillStyle = rgba(rim, L.ra ?? .55);                                                  // the rim on the lit side
  ctx.beginPath(); ctx.arc(x + lc[0] * r * .035, y + lc[1] * r * .035, r + r * .024, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - r * .08 + lc[0] * r * .04, y + r * 2.05 + lc[1] * r * .04, r * 1.72, r * 1.17, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = rgba(fillc);
  ctx.beginPath(); ctx.ellipse(x - r * .08, y + r * 2.05, r * 1.7, r * 1.15, 0, Math.PI, 0); ctx.fill();   // shoulders
  ctx.fillRect(x - r * 1.78, y + r * 2.04, r * 3.4, r * 3);
  ctx.fillRect(x - r * .36, y + r * .55, r * .62, r * .9);                                  // neck
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  const gx = x + lc[0] * r * .55, gy = y + lc[1] * r * .4 - r * .2, hi = mix(fillc, rim, .34);
  ctx.fillStyle = rg(gx, gy, 0, r * 1.3, [[0, hi, .8], [1, hi, 0]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  specular(ctx, x - r * .38, y - r * .58, r * .32, r * .12, -.5, .14);
  face(x, y, r, e, { turn: L.turn ?? .85, light: L.light || rim, la: L.la ?? .34, lc, featA: L.featA });
  if (L.wet) {                                                             // rain on him: a wet sheen along the top of his head, drops running down it
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
    ctx.strokeStyle = rgba([225, 238, 255], .3 * L.wet); ctx.lineCap = 'round'; ctx.lineWidth = r * .035; ctx.beginPath(); ctx.arc(x, y, r * .95, Math.PI * 1.12, Math.PI * 1.62); ctx.stroke();
    ctx.fillStyle = rgba([230, 240, 255], .6 * L.wet);
    for (let i = 0; i < 6; i++) { const q = ((L.t || 0) * (.55 + rnd(i * 3 + 1) * .5) + rnd(i * 7 + 2)) % 1, dx = (rnd(i * 5 + 3) - .5) * 1.5; ctx.beginPath(); ctx.ellipse(x + dx * r, y - r * .95 + q * r * 1.5, r * .016, r * .045, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}
// Lily's head and shoulders, big: the hood, her face, the coat. L: { a (lit 0-1), rim, turn, dir, wet, hoodUp, tilt, glow }
function lilyBust(x, y, r, ex, L = {}) {
  const lit = L.a ?? 1, Y = mix([70, 54, 10], PAL.yellow, clamp(.35 + .65 * lit)), YD = mix([44, 32, 6], PAL.yellowD, clamp(.35 + .65 * lit)), YL = mix(Y, PAL.yellowL, .6);
  ctx.save(); ctx.translate(x, y); ctx.rotate(L.tilt || 0); if ((L.dir || 1) < 0) ctx.scale(-1, 1); ctx.translate(-x, -y);
  if (L.glow) additive(() => lite(PAL.yellow, x, y + r, r * 4, .4 * L.glow));
  ctx.fillStyle = lg(x - r * 1.9, 0, x + r * 1.9, 0, [[0, YD], [.5, Y], [1, YL]]);                 // the coat's shoulders
  ctx.beginPath(); ctx.moveTo(x - r * .7, y + r * .9); ctx.quadraticCurveTo(x - r * 1.9, y + r * 1.2, x - r * 2.1, y + r * 3.4); ctx.lineTo(x + r * 2.1, y + r * 3.4); ctx.quadraticCurveTo(x + r * 1.9, y + r * 1.2, x + r * .7, y + r * .9); ctx.fill();
  if (L.hoodUp !== false) { ctx.fillStyle = rgba(Y); ctx.beginPath(); ctx.ellipse(x, y - r * .06, r * 1.27, r * 1.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lg(0, y - r * 1.4, 0, y + r, [[0, YL, .8], [.5, Y, 0]]); ctx.beginPath(); ctx.ellipse(x, y - r * .06, r * 1.27, r * 1.3, 0, 0, TAU); ctx.fill(); }
  disc(x, y, r, rgba([9, 10, 14]));
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.fillStyle = rg(x + r * .4, y - r * .5, 0, r * 1.3, [[0, mix([9, 10, 14], L.rim || PAL.lamp, .3), .8 * lit], [1, [9, 10, 14], 0]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  face(x, y + r * .14, r * 1.2, typeof ex === 'string' ? LILY_EX[ex] : ex, { turn: L.turn ?? .3, light: L.rim || PAL.lamp, la: .3 * lit, lc: [.4, -.5] });
  ctx.restore();
  if (L.hoodUp !== false) { ctx.strokeStyle = rgba(YL, .95); ctx.lineWidth = r * .1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r * 1.06, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
    ctx.strokeStyle = rgba(Y); ctx.lineWidth = r * .2; ctx.beginPath(); ctx.arc(x, y, r * 1.1, Math.PI * .1, Math.PI * .9); ctx.stroke(); }
  if (L.wet) { ctx.fillStyle = rgba([235, 245, 255], .75 * L.wet);
    for (let i = 0; i < 7; i++) { const a = Math.PI * (1.1 + i * .13), k = ((L.t || 0) * (.5 + rnd(i) * .5) + rnd(i * 3)) % 1; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * (1.2 + k * .1), y + Math.sin(a) * r * 1.2 + k * r * .9, r * .025, r * .06, 0, 0, TAU); ctx.fill(); } }
  ctx.restore();
}
// a snapshot of Lily (the phone's wallpaper, the photo in his wallet, the photo in the bottle): w x h, centred on (x, y).
// o: rot, border (white paper edge, px), ex, wave (0-1 her arm up), a, alive (0-1: she turns to face us), dim
function lilyPhoto(x, y, w, h, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.globalAlpha *= o.a ?? 1;
  const b = o.border || 0;
  if (b) { ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; rectf(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b + b * 1.6, rgba(PAL.paper)); ctx.shadowBlur = 0; }
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
  ctx.fillStyle = lg(0, -h / 2, 0, h / 2, [[0, [150, 205, 235]], [.62, [205, 232, 240]], [.62, [120, 176, 112]], [1, [84, 140, 86]]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  additive(() => lite([255, 244, 200], w * .28, -h * .3, w * .5, .7));
  const r = w * .2, ex = o.ex || 'happy';
  if (o.wave) { const k = o.wave, ax = r * 1.9, ay = -r * .2 - k * r * 1.2; stroke([[r * 1.3, h * .16], [ax, h * .02], [ax + r * .15, ay]], r * .5, rgba(PAL.yellow)); disc(ax + r * .15, ay - r * .2, r * .22, rgba([9, 10, 14])); }
  lilyBust(0, -h * .02, r, ex, { a: 1, turn: lerp(.35, 0, o.alive || 0), rim: [255, 244, 210] });
  if (o.dim) rectf(-w / 2, -h / 2, w, h, rgba([8, 20, 24], o.dim));
  ctx.restore(); ctx.restore();
}
// ---------- THE BAR: the set and the wide shots ----------
// World px, about 1920 x 1080: the back wall with the lit shelf, the counter top at y = BAR.top, the devil behind it,
// him on a stool seen from behind. p.round 1-3 says how far the evening has gone.
const BAR = { top: 706, sx0: 610, sx1: 1470, shelves: [268, 414, 560], his: [[900, 414], [1040, 414], [1180, 414]], clock: [330, 260, 66] };

// what is inside his three bottles: k = how far in (0 not there … 1 there), t for their own motion
function inWatch(t, k = 1) {
  if (k <= 0) return;
  const y = -70 + (1 - k) * -220;
  ctx.save(); ctx.translate(0, y); ctx.rotate(.12);
  rectf(-11, -64, 22, 128, rgba([60, 40, 30])); rectf(-11, -64, 22, 128, lg(-11, 0, 11, 0, [[0, [0, 0, 0], .35], [.5, [255, 255, 255], .12], [1, [0, 0, 0], .35]]));
  disc(0, 0, 30, rgba(PAL.brass)); disc(0, 0, 25, rgba([250, 236, 205]));
  ctx.strokeStyle = rgba([40, 26, 16]); ctx.lineCap = 'round';
  ctx.lineWidth = 4; line(0, 0, Math.sin(t * 9) * 12, -Math.cos(t * 9) * 12); ctx.lineWidth = 3; line(0, 0, Math.sin(t * 23) * 19, -Math.cos(t * 23) * 19);
  ctx.restore();
}
function inPhone(t, k = 1, ring = 1) {
  if (k <= 0) return;
  const y = -62 + (1 - k) * -220, sh = ring ? Math.sin(t * 70) * 1.6 : 0;
  ctx.save(); ctx.translate(sh, y); ctx.rotate(-.1 + sh * .01);
  ctx.fillStyle = '#0b0b10'; rrect(-25, -50, 50, 100, 9); ctx.fill();
  ctx.fillStyle = lg(0, -46, 0, 46, [[0, [36, 110, 70]], [1, [10, 36, 26]]]); rrect(-21, -46, 42, 92, 6); ctx.fill();
  if (ring) { ctx.strokeStyle = rgba([150, 255, 190], .5 * (.5 + .5 * Math.sin(t * 9))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -16, 9 + ((t * 14) % 10), 0, TAU); ctx.stroke(); }
  disc(0, -16, 8, rgba([200, 255, 220], .9));
  font(8.5, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([235, 255, 240]); ctx.fillText('SCHOOL', 0, 8);
  disc(-10, 30, 5.5, rgba([230, 70, 60])); disc(10, 30, 5.5, rgba([80, 220, 120]));
  ctx.restore();
}
function inPhoto(t, k = 1, o = {}) {
  if (k <= 0) return;
  lilyPhoto(0, -62 + (1 - k) * -220, 58, 70, Object.assign({ rot: -.08 + (1 - k) * .6, border: 5 }, o));
}

// the back wall: panelling, the lit shelf and its bottles, the clock. st: { watch, phone, photo (0-1), clock: 'ok' | 'loose' | 'none', red (0-1) }
function barWall(t, st = {}) {
  const red = st.red || 0, wallA = mix(PAL.tealD, [40, 6, 10], red), wallB = mix(PAL.teal, [90, 14, 18], red);
  ctx.fillStyle = lg(0, -300, 0, BAR.top, [[0, wallA], [1, wallB]]); ctx.fillRect(-1400, -900, 4800, 900 + BAR.top);
  ctx.fillStyle = rgba([0, 0, 0], .16); for (let x = -1300; x < 3400; x += 190) ctx.fillRect(x, -900, 5, 900 + BAR.top);   // panel seams
  // the shelf: a glowing back panel, three boards
  const { sx0, sx1, shelves } = BAR, glowC = mix(PAL.tealG, [255, 90, 70], red);
  ctx.fillStyle = lg(0, 120, 0, 600, [[0, mix([40, 132, 136], [170, 40, 34], red)], [1, mix([22, 84, 92], [100, 18, 18], red)]]); rrect(sx0 - 40, 106, sx1 - sx0 + 80, 492, 10); ctx.fill();
  additive(() => { lite(glowC, (sx0 + sx1) / 2, 350, 1300, .2); });
  for (const y of shelves) { rectf(sx0 - 40, y, sx1 - sx0 + 80, 13, rgba(mix(PAL.wood, [30, 6, 8], red))); rectf(sx0 - 40, y, sx1 - sx0 + 80, 3, rgba(mix(PAL.brass, [255, 110, 80], red), .7)); }
  // rows of plain bottles (no labels, no brands): dark glass against the glow
  shelves.forEach((y, r) => {
    for (let i = 0; i < 11; i++) {
      const x = sx0 + 8 + i * (sx1 - sx0 - 16) / 10;
      if (r === 1 && x > 820 && x < 1260) continue;                       // his three stand here
      const s = .36 + rnd(i * 3 + r * 17) * .1, hue = rnd(i * 7 + r * 5);
      bottle(x, y, s, { glass: hue < .4 ? [150, 235, 220] : hue < .7 ? [220, 240, 200] : [130, 200, 235], level: rnd(i + r * 31) * .8, liquid: mix(PAL.whisky, [90, 40, 10], rnd(i * 2 + r)), cork: 1 });
    }
  });
  // his three: empty until he pays
  const [b1, b2, b3] = BAR.his;
  bottle(b1[0], b1[1], .5, { glass: [190, 250, 240], cork: st.watch >= 1 ? 1 : -1, inner: () => inWatch(t, st.watch || 0), glowC: PAL.amber, glowA: (st.watch || 0) * .9 });
  bottle(b2[0], b2[1], .5, { glass: [190, 250, 240], cork: st.phone >= 1 ? 1 : -1, inner: () => inPhone(t, st.phone || 0), glowC: [110, 255, 170], glowA: (st.phone || 0) * .9 });
  bottle(b3[0], b3[1], .5, { glass: [190, 250, 240], cork: st.photo >= 1 ? 1 : -1, inner: () => inPhoto(t, st.photo || 0), glowC: PAL.yellow, glowA: (st.photo || 0) * 1 });
  // the clock on the wall
  const [cx, cy, cr] = BAR.clock;
  additive(() => lite(PAL.amber, cx, cy, 190, .16));
  wallClock(cx, cy, cr, st.hour ?? 5.083, { loose: st.clock === 'loose' ? 1 : 0, none: st.clock === 'none', spin: st.spin || 0 }, t);
  // a door and a window to the street on the far right (dusk, later night)
  const dusk = st.dusk ?? 1, sky = mix([10, 14, 40], [88, 96, 170], dusk);
  rectf(1660, 250, 200, 456, rgba([10, 12, 16])); rectf(1674, 264, 172, 250, rgba(sky)); additive(() => lite(sky, 1760, 390, 300, .25));
  ctx.strokeStyle = rgba([10, 12, 16]); ctx.lineWidth = 8; line(1760, 264, 1760, 514);
}
// the pendant lamps and their light
function barLamps(t, o = {}) {
  const dim = o.dim ?? 1, col = o.col || PAL.amber;
  for (const [x, y] of [[300, 150], [960, 110], [1620, 150]]) {
    const fl = 1 - .06 * Math.abs(Math.sin(t * 13 + x)) * (o.flicker || 0) * 6;
    ctx.strokeStyle = rgba([8, 10, 12]); ctx.lineWidth = 5; line(x, -900, x, y - 40);
    cone(x, y, 46, 330, BAR.top - y + 10, col, .26 * dim * fl);
    poly([[x - 30, y - 44], [x + 30, y - 44], [x + 64, y + 6], [x - 64, y + 6]], rgba([10, 12, 14]));
    ctx.strokeStyle = rgba(PAL.brass, .8); ctx.lineWidth = 3; line(x - 64, y + 6, x + 64, y + 6);
    additive(() => { lite(col, x, y + 16, 150, .95 * dim * fl); lite([255, 240, 210], x, y + 12, 44, 1 * dim * fl); });
    pool(x, BAR.top + 14, 330, 46, col, .4 * dim * fl);
  }
}
// the counter: a thick slab of dark wood with a glossy top that mirrors the shelf
function barCounter(t, o = {}) {
  const top = BAR.top, red = o.red || 0;
  ctx.fillStyle = lg(0, top, 0, top + 54, [[0, mix(PAL.woodL, [140, 40, 30], red)], [1, mix(PAL.wood, [50, 10, 10], red)]]); ctx.fillRect(-1400, top, 4800, 54);
  ctx.save(); ctx.beginPath(); ctx.rect(-1400, top, 4800, 54); ctx.clip();
  additive(() => { ctx.save(); ctx.translate(1040, top + 20); ctx.scale(1, .1); lite(mix(PAL.tealG, [255, 80, 60], red), 0, 0, 900, .55); ctx.restore(); });
  ctx.restore();
  rectf(-1400, top, 4800, 3, rgba([255, 226, 170], .5));
  ctx.fillStyle = lg(0, top + 54, 0, 1500, [[0, mix([30, 18, 14], [44, 8, 8], red)], [.5, mix([14, 10, 10], [20, 4, 4], red)], [1, [6, 6, 8]]]); ctx.fillRect(-1400, top + 54, 4800, 900);
  rectf(-1400, top + 54, 4800, 8, rgba([0, 0, 0], .5));
  ctx.fillStyle = rgba([255, 200, 140], .05); for (let x = -1300; x < 3400; x += 260) ctx.fillRect(x, top + 90, 200, 520);   // panels on the front
  rectf(-1400, top + 300, 4800, 10, rgba(PAL.brass, .35));                              // the foot rail
}
// empties on the counter by his hand: n glasses, the full one last
function barGlasses(t, n, full = 0, x0 = 760) {
  for (let i = 0; i < n; i++) tumbler(x0 + i * 62 + (i % 2) * 8, BAR.top + 2, .5, i === n - 1 ? full : 0, { glowA: 1 });
}
// him on his stool, from behind (x, the middle of his back; s scale). o: slump 0-1, sip 0-1 (right arm up), turn (head)
function manBack(x, s, o = {}) {
  const hipY = 884, sl = o.slump || 0, sh = hipY - (184 - 22 * sl) * s, lx = sl * 14 * s;
  const sip = o.sip || 0, elL = [x - 92 * s, BAR.top - 6], elR = [x + lerp(94, 104, sip) * s, lerp(BAR.top - 6, sh + 40 * s, sip)];
  const handR = [x + lerp(64, 58, sip) * s, lerp(BAR.top - 30, sh - 70 * s, sip)], handL = [x - 56 * s, BAR.top - 26];
  return { head: [x + lx + (o.turn || 0) * 14 * s, sh - (62 - 10 * sl) * s, 40 * s],
    parts: [
      [[[x - 26 * s, hipY + 6 * s], [x - 34 * s, hipY + 150 * s]], 32 * s], [[[x + 26 * s, hipY + 6 * s], [x + 34 * s, hipY + 150 * s]], 32 * s],
      [[[x, hipY], [x + lx * .5, sh + 12 * s]], 76 * s],
      [[[x - 42 * s + lx, sh + 10 * s], [x + 42 * s + lx, sh + 10 * s]], 36 * s],
      [[[x - 48 * s + lx, sh + 14 * s], elL, handL], 24 * s], [[[x + 48 * s + lx, sh + 14 * s], elR, handR], 24 * s]
    ], handR, handL, sh };
}
function stool(x, s) {
  rectf(x - 6 * s, 930, 12 * s, 260 * s, rgba([14, 12, 12]));
  ctx.strokeStyle = rgba(PAL.brass, .5); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.ellipse(x, 1040, 44 * s, 9 * s, 0, 0, TAU); ctx.stroke();
}
// the towel over its arm: it is the bartender
function stoolSeat(x, s) { oval(x, 934, 70 * s, 15 * s, rgba([30, 20, 16])); oval(x, 929, 70 * s, 12 * s, rgba(PAL.woodL, .75)); }
function towel(t, o) {
  const P = twinPose(t, o), A = P.arms[0], s = DEVIL.s, m = v2.lerp(A.el, A.wr, .45);
  ctx.save(); ctx.translate(m[0], m[1]); ctx.rotate(.08 + Math.sin(t * 1.4) * .02);
  ctx.fillStyle = lg(-22 * s, 0, 22 * s, 0, [[0, [236, 228, 214]], [1, [180, 172, 164]]]); rrect(-22 * s, -6 * s, 44 * s, 96 * s, 5 * s); ctx.fill();
  rectf(-22 * s, 74 * s, 44 * s, 5 * s, rgba([200, 60, 50], .8));
  ctx.restore();
}

// ---------- BAR WIDE: from behind him. p: round 1-3, st (shelf state), o(t, L) devil overrides, cam keys, glasses, full
const BAR_SPOT = { 1: [1050, 1030, .8], 2: [990, 1118, .97], 3: [760, 1262, 1.18] };
function barWide(t, p, L, len) {
  const round = p.round || 1, st = Object.assign({ dusk: 1.1 - round * .32, clock: round === 1 ? 'ok' : round === 2 ? 'loose' : 'none' }, p.st || {});
  const fr = kcam(L, len, p.cam || (round === 1 ? [[0, 1.2, 830, 560], [1, 1.34, 880, 536]] : [[0, 1.62, 800, 470], [1, 1.86, 850, 440]]), { hand: .5, t });
  fill(PAL.tealD, [4, 10, 12]); cam(...fr);
  barWall(t, st);
  haze(t, -200, 2100, 380, 260, PAL.tealL, .05, 3);
  // the devil behind the bar (rounds 1, 2), or on the stool beside him (round 3)
  placeDevil(p.spot || BAR_SPOT[round]);
  const base = round === 1 ? { a: 1, eyes: .85, grin: .25, lean: 0 } : round === 2 ? { a: 1, eyes: 1, grin: .55, lean: .75 } : { a: 1, eyes: 0, grin: 0, lean: .1 };
  const o = devilO(Object.assign(base, p.o ? p.o(t, L) : {}));
  if (round < 3) { drawDevil(t, fr, o); towel(t, o); devilEyes(t, o); devilGrin(t, o); }
  barLamps(t, { dim: 1 - .12 * (round - 1), flicker: round === 3 ? 1 : 0 });
  barCounter(t);
  barGlasses(t, p.glasses ?? round * 2 - 1, p.full ?? 1, 700);
  motes(t, [200, 160, 1700, 700], 26, PAL.amber, .22, 5);
  // him, big in front, a dark back against the lit bar
  const mx = 560, ms = 1.46, M = manBack(mx, ms, { slump: p.slump ?? (round - 1) * .4, sip: p.sip ? p.sip(L) : 0, turn: p.turn || 0 });
  stool(mx, ms);
  if (round === 3) {                                                       // it sits beside him, its arm round his shoulders
    o.reach = 1; o.targets = [[mx - 70, M.sh + 26], [mx + 88, M.sh + 30]];
    drawDevil(t, fr, o);
  }
  drawMan(M, 'tired', { face: false, rim: PAL.amber, a: .62, lx: 1, ly: -.25 });
  stoolSeat(mx, ms);
  if (round === 3) devilArms(t, o);
  additive(() => lite(PAL.amber, mx, 520, 420, .1));
  blurred(7, () => { bottle(1790, 1130, 1.9, { glass: [150, 235, 220], level: .5, cork: 1, a: .9 }); });   // a bottle near the lens
}
shot('barwide', barWide, { bloom: .42, grain: .55 }, [380, 200, 1320, 900]);
// ---------- THE BAR, CLOSE: the bottle, the glass, the hands (side-on, at bar height) ----------
// MAC.y is the line where things stand on the counter; below it the bar's dark front (the devil's lines sit there).

const MAC = { y: 720 };
// the back bar out of focus: a teal glow, the soft shapes of bottles, lamp bokeh. red 0-1 turns it to the devil's light
function macBg(t, o = {}) {
  const red = o.red || 0, a = mix(PAL.tealD, [36, 4, 8], red), b = mix([20, 78, 86], [120, 16, 20], red);
  fill(a, b);
  additive(() => { lite(mix(PAL.tealG, [255, 70, 50], red), o.gx ?? 960, 330, 900, .34); lite(mix(PAL.amber, [255, 60, 40], red), o.lx ?? 960, -80, 700, .5 * (o.lamp ?? 1)); });
  blurred(14, () => {
    for (let i = 0; i < 9; i++) {
      const x = -100 + i * 270 + rnd(i + 3) * 60, h = 300 + rnd(i * 5) * 160, c = mix(rnd(i) < .5 ? [70, 190, 180] : [230, 150, 60], [255, 70, 50], red);
      ctx.fillStyle = rgba(c, .34); rrect(x, 620 - h, 96, h, 20); ctx.fill(); rrect(x + 32, 620 - h - 90, 32, 100, 8); ctx.fill();
    }
  });
  bokeh(41, 16, [-100, 40, 2020, 560], red > .5 ? [[255, 80, 50], [255, 150, 90]] : [PAL.amber, PAL.tealG, [255, 226, 170]], 18, 62, .22, t);
}
// the counter seen side-on: the glossy top edge at MAC.y and the dark front below it
function macBar(t, o = {}) {
  const y = o.y ?? MAC.y, red = o.red || 0;
  ctx.fillStyle = lg(0, y, 0, y + 70, [[0, mix([150, 92, 50], [170, 50, 36], red)], [1, mix([52, 30, 20], [60, 12, 10], red)]]); ctx.fillRect(-2000, y, 6000, 70);
  rectf(-2000, y, 6000, 4, rgba([255, 232, 180], .7));
  ctx.fillStyle = lg(0, y + 70, 0, y + 500, [[0, mix([26, 16, 13], [40, 8, 8], red)], [1, mix([10, 8, 8], [16, 4, 4], red)]]); ctx.fillRect(-2000, y + 70, 6000, 900);
  rectf(-2000, y + 70, 6000, 10, rgba([0, 0, 0], .5));
}
// what stands on the counter is mirrored in its polish
const macGloss = (t, a = .28) => wet(MAC.y + 4, 62, a, t, 1.5);

// his hand, close: a dark hand with a lit edge. wrist [x, y], ang the way the forearm points (radians, 0 = right);
// o: curl 0 open … 1 fist, s, rim, ra, arm (forearm length drawn), side (1: thumb on the upper side), pinch (thumb meets the fingers)
function manHand(wrist, ang, o = {}) {
  const s = o.s || 1, curl = o.curl ?? .2, side = o.side ?? 1, rim = o.rim || PAL.amber, ra = o.ra ?? .7, arm = (o.arm ?? 1200) * s;
  const dir = k => [Math.cos(k), Math.sin(k)], P = [];
  const back = v2.sub(wrist, v2.mul(dir(ang), arm)), palm = v2.add(wrist, v2.mul(dir(ang), 58 * s));
  P.push([[back, wrist], 66 * s]); P.push([[wrist, palm], 78 * s]);
  for (let f = 0; f < 4; f++) {
    const off = (f - 1.5) * 21 * s, base = v2.add(palm, v2.mul(dir(ang + Math.PI / 2), off)), a1 = ang - side * curl * .9 + (f - 1.5) * .05 * (1 - curl);
    const k1 = v2.add(base, v2.mul(dir(a1), 44 * s)), k2 = v2.add(k1, v2.mul(dir(a1 - side * (.2 + curl * 1.3)), 36 * s));
    P.push([[base, k1, k2], 19 * s]);
  }
  const tb = v2.add(wrist, v2.mul(dir(ang - side * 1.2), 36 * s)), ta = ang - side * lerp(.75, .1, o.pinch ?? curl * .6);
  P.push([[v2.add(wrist, v2.mul(dir(ang), 10 * s)), tb, v2.add(tb, v2.mul(dir(ta), 46 * s))], 22 * s]);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(rim, ra); ctx.shadowBlur = 18 * VP.k; ctx.strokeStyle = rgba(rim, ra);
  for (const [pts, w] of P) limb(pts.map(p => [p[0] + (o.lx ?? 0) * 4, p[1] + (o.ly ?? -1) * 4]), w + 6 * s);
  ctx.shadowBlur = 0; ctx.strokeStyle = rgba(PAL.ink);
  for (const [pts, w] of P) limb(pts, w);
  ctx.strokeStyle = rgba(mix(PAL.ink, rim, .3), .5); limb([back, wrist].map(p => [p[0], p[1] - 14 * s]), 14 * s);
  ctx.restore();
  return { palm, tip: v2.add(palm, v2.mul(dir(ang), 70 * s)) };
}

// Lily inside a bottle (bottle units: feet at (x, -8)); mode 'pound' | 'look' | 'back'
const LILY_FEAR = { lid: 0, brow: .95, browH: .18, smile: -.5, open: .4, grit: 0, gx: .6, gy: -.5, tear: 0, sweat: 0 };
function inGirl(t, o = {}) {
  const s = o.s || .62, back = o.back || 0, x = lerp(8, -16, back), beat = Math.floor(t * 5), ph = (t * 5) % 1, hit = Math.exp(-ph * 9);
  const up = beat % 2, fist = k => [x + (30 + 7 * k) * 1, -74 - 18 * (1 - k)];
  const arms = back > .5 ? [[x + 12, -70], [x + 8, -72]] : [fist(up ? hit : .2), fist(up ? .2 : hit)];
  const P = lily({ at: [x, -8], s, dir: 1, pose: 'stand', arms, lean: lerp(.16, -.14, back), look: lerp(2, -2, back), nod: -back * 3 });
  drawLily(P, back > .4 ? LILY_FEAR : LILY_EX.worry, { a: 1, glow: .9, turn: lerp(.85, .5, back) });
  return { hit: back > .5 ? 0 : hit, at: [x + 44, -80] };
}

// cold capitals typed one by one, heavy enough to read on a phone, with a dark edge so they hold on any picture
function macType(txt, cx, y, size, k, a, t, col = [226, 236, 246]) {
  font(size, SANS, '600'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const track = size * .13, chars = [...txt], ws = chars.map(c => ctx.measureText(c).width);
  let x = cx - (ws.reduce((p, w) => p + w, 0) + track * (chars.length - 1)) / 2;
  const n = chars.length * k, f = Math.floor(t * 20);
  ctx.save(); ctx.shadowColor = `rgba(0,0,0,${.9 * a})`; ctx.shadowBlur = 16 * VP.k;
  chars.forEach((c, i) => { const al = clamp(n - i); if (al > 0) { ctx.fillStyle = rgba(col, a * al); ctx.fillText(c, x + (rnd(i + f * 31) - .5) * 1.4, y + (rnd(i + f * 17) - .5) * 1.1); } x += ws[i] + track; });
  ctx.restore();
}
// ---------- COLD: the bottle, the girl inside, the hand that takes it ----------
function macCold(t, p, L, len) {
  const red = seg(L, 1.3, 2.6), lift = seg(L, 2.5, 3.6, E.in), bx = 1250, by = 936 - lift * 150, tilt = lift * -.1 + (L < 1.7 ? Math.sin(L * 31) * .004 : 0);
  macBg(t, { red: red * .8, gx: 1250, lx: 1250, lamp: 1 - red * .5 });
  const fr = kcam(L, len, [[0, 1.0, 960, 560], [.45, 1.05, 990, 552], [1, 1.16, 1060, 530]], { hand: .5, t });
  // it, behind the glass
  placeDevil([1392, 2790, 3]);
  const o = devilO({ a: seg(L, 1.25, 1.9), eyes: seg(L, 1.2, 1.7), grin: seg(L, 1.9, 2.7), lean: .2 });
  if (o.a > 0) { drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o); }
  cam(...fr);
  macBar(t, { y: 936, red: red * .7 });
  cone(bx, -200, 60, 420, 1200, mix(PAL.amber, [255, 80, 60], red), .2);
  pool(bx, 950, 420, 34, mix(PAL.amber, [255, 80, 60], red), .5);
  let hitA = 0;
  bottle(bx, by, 3.6, { tilt, cork: 1, glass: mix([200, 252, 244], [255, 170, 150], red * .6), glowC: PAL.yellow, glowA: .26, hot: red * .5,
    inner: () => { const g = inGirl(t, { back: seg(L, 1.75, 2.15) }); hitA = g.hit; } });
  if (hitA > .05) { ctx.save(); ctx.translate(bx + 172, by - 290); ctx.strokeStyle = rgba(PAL.yellowL, .8 * hitA); ctx.lineWidth = 5;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, i * 26 * (1.2 - hitA * .4), -.9, .9); ctx.stroke(); } ctx.restore(); }
  wet(940, 110, .3, t, 2);
  // its hand closes round the bottle like the bars of a cage
  const k = seg(L, 1.55, 2.1, E.out);
  if (k > 0) claw([lerp(2600, 1760, k), by - 300 + (1 - k) * 60], Math.PI + .04, 3.1, { curl: lerp(.02, .2, seg(L, 2.0, 2.4)), spread: 1.25, arm: 600, side: -1 });
  blurred(9, () => tumbler(250, 1080, 3.4, .35, { a: .85 }));
  screen();
  ctx.fillStyle = rgba(PAL.red, .1 * red); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (!OUT.vertical) {
    macType('YOU DRINK TO FORGET…', 525, 415, 60, seg(L, .12, .7, E.lin), 1 - lift, t);
    macType('GUESS WHO REMEMBERS.', 525, 525, 60, seg(L, .9, 1.5, E.lin), 1 - lift, t);
  } else { ui(); typeBlock([['YOU DRINK TO FORGET…', seg(L, .15, .8, E.lin)], ['GUESS WHO REMEMBERS.', seg(L, .95, 1.55, E.lin)]], 620, 60, COLD_COL, 1 - lift, t, OUT.w / 2, 840); }
}
shot('cold', macCold, { bloom: .36, grain: .6 }, [900, 120, 1620, 1000]);

// ---------- POUR: its claw tips a bottle, the glass fills ----------
function macPour(t, p, L, len) {
  macBg(t, { gx: 700 });
  const fr = kcam(L, len, [[0, 1.25, 900, 560], [1, 1.45, 880, 600]], { hand: .4, t });
  macBar(t);
  const k = seg(L, .1, .95, E.sine), lvl = .75 * k, gx = 860, pour = pulse(L, .08, .95, .08, .12);
  cone(gx, -200, 50, 300, 940, PAL.amber, .2); pool(gx, MAC.y + 14, 340, 30, PAL.amber, .6);
  // the stream
  const mouth = [gx + 46, 318];
  if (pour > 0) { ctx.strokeStyle = lg(0, mouth[1], 0, MAC.y - 30, [[0, [255, 214, 130], .95 * pour], [1, [214, 120, 30], .95 * pour]]); ctx.lineWidth = 15 + Math.sin(t * 40) * 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mouth[0], mouth[1]); ctx.quadraticCurveTo(gx + 14, 420, gx + 4 + Math.sin(t * 30) * 3, MAC.y - 30 - lvl * 150); ctx.stroke();
    additive(() => lite(PAL.amber, gx, MAC.y - 60 - lvl * 120, 120, .7 * pour)); }
  tumbler(gx, MAC.y, 2.3, lvl, { slosh: Math.sin(t * 22) * .5 * pour, glowA: 1.4 });
  for (let i = 0; i < 7; i++) { const a = ((L * 2.4 + rnd(i * 3)) % 1), ang = -1.57 + (rnd(i * 7) - .5) * 1.6; if (pour > .3) disc(gx + Math.cos(ang) * a * 110, MAC.y - 150 - lvl * 80 + Math.sin(ang) * a * 130 + a * a * 150, 5 * (1 - a), rgba([255, 200, 110], .9 * (1 - a))); }
  macGloss(t);
  // the bottle, tipped, in its claw
  const tip = lerp(-1.9, -2.2, k);
  ctx.save(); ctx.translate(mouth[0] + 2, mouth[1] + 4); ctx.rotate(tip); ctx.translate(0, 304 * 2.1);
  bottle(0, 0, 2.1, { glass: [120, 210, 190], dense: .9, level: .7 - .3 * k, cork: -1, hot: .3 }); ctx.restore();
  claw([1610, 20], Math.PI - .42, 2.1, { curl: .5, spread: 1.1, arm: 700, side: -1 });
}
shot('pour', macPour, { bloom: .55, grain: .55 }, [560, 200, 1280, 900]);

// ---------- SLIDE: the glass comes down the bar into his hand ----------
function macSlide(t, p, L, len) {
  macBg(t, { gx: 1400 });
  const k = seg(L, .05, .78, E.out), gx = lerp(1700, 760, k);
  const fr = kcam(L, len, [[0, 1.55, 1560, 610], [.8, 1.65, 880, 610], [1, 1.75, 840, 610]], { ease: E.out, t });
  macBar(t);
  pool(gx, MAC.y + 12, 300, 26, PAL.amber, .5);
  for (let i = 1; i < 7; i++) tumbler(gx + i * 34 * (1 - k) * 2.2, MAC.y, 1.7, .72, { a: .1 * (1 - k), glowA: 0 });   // the streak behind it
  tumbler(gx, MAC.y, 1.7, .72, { slosh: (1 - k) * 1.6 * Math.sin(L * 30) - (k > .95 ? Math.sin(L * 40) * .3 : 0), glowA: 1.3 });
  macGloss(t);
  claw([lerp(1960, 2300, seg(L, 0, .4)), 600], Math.PI + .1, 1.9, { curl: .1, arm: 600, side: -1 });
  manHand([lerp(380, 560, seg(L, .3, .8, E.out)), MAC.y - 78], .05, { s: 1.5, curl: lerp(.1, .55, seg(L, .7, .95)), arm: 900, side: -1 });
}
shot('slide', macSlide, { bloom: .5, grain: .55 }, [500, 300, 1300, 900]);

// ---------- EMPTY: he taps his empty glass for more. It does not pour ----------
function macEmpty(t, p, L, len) {
  macBg(t, { gx: 1300, lamp: .8 });
  const fr = kcam(L, len, [[0, 1.5, 900, 600], [1, 1.62, 960, 600]], { hand: .3, t });
  macBar(t);
  const tap = Math.max(Math.exp(-Math.max(0, L - .3) * 14) * (L > .3), Math.exp(-Math.max(0, L - .75) * 14) * (L > .75)), gx = 800;
  pool(gx, MAC.y + 12, 300, 26, PAL.amber, .4);
  tumbler(gx, MAC.y - tap * 16, 1.9, .02, { tilt: tap * .1, glowA: 0 });
  for (let i = 0; i < 4; i++) tumbler(260 - i * 120, MAC.y, 1.7, 0, { a: .75, glowA: 0 });
  bottle(1380, MAC.y, 2.2, { glass: [150, 230, 215], level: .02, cork: -1 });
  macGloss(t);
  manHand([560, MAC.y - 150 - tap * 14], .32, { s: 1.5, curl: .6, arm: 900, side: -1 });
  claw([1900, MAC.y - 60], Math.PI + .02, 2.1, { curl: .12, arm: 600, side: -1, spread: 1 });
}
shot('empty', macEmpty, { bloom: .4, grain: .6 }, [500, 300, 1500, 900]);

// ---------- BOTTLE IN: one of his three bottles takes what he paid. p.n 1 watch | 2 phone | 3 photo ----------
function macBottleIn(t, p, L, len) {
  const n = p.n || 1, u = L / len, col = [PAL.amber, [110, 255, 170], PAL.yellow][n - 1];
  macBg(t, { gx: 960 });
  const fr = kcam(L, len, [[0, 1.05, 960, 520], [1, 1.2, 960, 540]], { hand: .4, t });
  // the shelf board it stands on
  rectf(-2000, 860, 6000, 30, rgba(PAL.wood)); rectf(-2000, 860, 6000, 5, rgba(PAL.brass, .8));
  const drop = seg(u, .04, .42, E.in), land = seg(u, .42, .55, E.out), cork = lerp(-1, 1, seg(u, .55, .78, E.out)), flash = pulse(u, .4, .6, .04, .16);
  for (const [dx, dn] of [[-520, 0], [520, 1]]) blurred(6, () => bottle(960 + dx, 860, 2.5, { glass: [170, 240, 230], cork: n > dn + 1 || (dn === 0 && n > 1) ? 1 : -1, glowC: [PAL.amber, [110, 255, 170]][dn], glowA: (dn === 0 ? n > 1 : n > 2) ? .7 : 0, a: .9 }));
  bottle(960, 860, 2.8, { glass: [200, 252, 244], cork, glowC: col, glowA: land * 1.1 + flash,
    inner: () => { ctx.translate(0, -(1 - drop) * 250 + Math.sin(land * Math.PI) * -10); ctx.scale(1.25, 1.25);
      if (n === 1) inWatch(t, 1); else if (n === 2) inPhone(t, 1, 1); else inPhoto(t, 1); } });
  additive(() => lite(col, 960, 600, 520, .5 * flash));
  // the claw's finger pushes the cork home
  const push = seg(u, .5, .72, E.out), away = seg(u, .8, 1);
  claw([960 + 420 + away * 500, lerp(-420, -150, push) - away * 300], Math.PI * .68, 2.6, { point: 1, arm: 700, side: -1 });
  blurred(10, () => bottle(120, 1160, 3.2, { glass: [150, 230, 215], cork: 1, a: .8, level: .4 }));
}
shot('bottlein', macBottleIn, { bloom: .6, grain: .55 }, [620, 60, 1300, 1000]);

// ---------- THE TWIST: it sets the third bottle in front of him. In the photo she turns, looks at him, and knocks ----------
function macTwist(t, p, L, len) {
  const inK = seg(L, 0, .5, E.out), alive = seg(L, .85, 1.35), bx = lerp(1700, 1010, inK), knocks = [1.5, 1.86, 2.22];
  let kn = 0; for (const k of knocks) if (L > k) kn = Math.max(kn, Math.exp(-(L - k) * 10));
  macBg(t, { gx: 1010, lamp: .7, red: .12 });
  const fr = kcam(L, len, [[0, 1.0, 960, 560], [.3, 1.05, 990, 540], [1, 1.75, 1010, 470]], { hand: .25, t });
  macBar(t);
  pool(bx, MAC.y + 12, 380, 30, PAL.yellow, .35 + .3 * kn);
  bottle(bx, MAC.y, 3.0, { glass: [205, 252, 246], cork: 1, glowC: PAL.yellow, glowA: .55 + .5 * kn + .3 * alive, tilt: (1 - inK) * .05,
    inner: () => {
      lilyPhoto(0, -92, 76, 96, { rot: -.03, border: 3, ex: mixExpr(LILY_EX.happy, LILY_EX.hurt, alive), alive, wave: 1 - alive });
      if (alive > .5) {                                                      // her small fist on the glass, from inside
        const up = 1 - kn, hx = 20, hy = -66 + up * 4;
        stroke([[6, -44], [hx - 3, hy + 12]], 11, rgba(PAL.yellow)); stroke([[hx - 3, hy + 12], [hx - 3, hy + 10]], 13, rgba(PAL.yellowL));
        disc(hx, hy, 8.5 + kn * 2, rgba([9, 10, 14])); for (let f = 0; f < 4; f++) disc(hx - 6 + f * 4, hy - 6 - kn, 2.6, rgba([9, 10, 14]));
        ctx.strokeStyle = rgba([255, 255, 255], .9 * kn); ctx.lineWidth = 1.8; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(hx, hy, 6 + i * 8 * (1.3 - kn * .6), 0, TAU); ctx.stroke(); }
      }
    } });
  macGloss(t, .3);
  claw([bx + 560 + seg(L, .5, .9) * 700, MAC.y - 330], Math.PI + .05, 2.6, { curl: .16, spread: 1.2, arm: 600, side: -1, a: 1 - seg(L, .6, 1.0) });
  blurred(12, () => { disc(214, 884, 338, rgba(PAL.amber, .3)); disc(200, 890, 330, rgba([9, 10, 14])); });     // the back of his head, soft, at the edge of frame
}
shot('twist', macTwist, { bloom: .55, grain: .6 }, [700, 100, 1320, 960]);

// ---------- SMASH: his arm sweeps the three bottles off the bar ----------
function macShards(L, x0, y0, n, col, seed) {
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI * (.08 + rnd(seed + i * 3) * .62), v = 700 + rnd(seed + i * 5) * 1500, x = x0 + Math.cos(ang) * v * L, y = y0 + Math.sin(ang) * v * L + 1500 * L * L, r = 14 + rnd(seed + i * 7) * 46;
    ctx.save(); ctx.translate(x, y); ctx.rotate(L * (4 + rnd(seed + i) * 10) * (i % 2 ? 1 : -1));
    ctx.fillStyle = rgba(mix([200, 250, 240], col, .35), .5); ctx.strokeStyle = rgba([240, 255, 250], .9); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-r, -r * .4); ctx.lineTo(r * .8, -r * .7); ctx.lineTo(r * .3, r * .8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
}
function macSmash(t, p, L, len) {
  const hitT = .22, d = L - hitT, sw = seg(L, .08, .5, E.out), cols = [PAL.amber, [110, 255, 170], PAL.yellow];
  macBg(t, { red: lerp(.8, .2, seg(L, .3, 1.1)), gx: 960 });
  const fr = kcam(L, len, [[0, 1.1, 940, 540], [.2, 1.02, 1000, 540], [1, 1.1, 1080, 520]], { jolt: d > 0 ? Math.exp(-d * 7) : 0, t });
  macBar(t, { red: lerp(.6, .1, seg(L, .3, 1.1)) });
  [660, 960, 1260].forEach((x, i) => {
    const hit = L - (hitT + i * .07);
    if (hit < 0) bottle(x, MAC.y, 2.3, { glass: [205, 252, 246], cork: 1, glowC: cols[i], glowA: .8, inner: () => { ctx.scale(1.2, 1.2); if (i === 0) inWatch(t, 1); else if (i === 1) inPhone(t, 1, 1); else inPhoto(t, 1); } });
    else {
      macShards(hit, x, MAC.y - 260, 22, cols[i], i * 100);
      additive(() => { lite(cols[i], x, MAC.y - 280, 500 + hit * 600, Math.exp(-hit * 5) * 1.1); lite([255, 255, 255], x, MAC.y - 280, 220, Math.exp(-hit * 12)); });
      const ox = x + 380 * hit, oy = MAC.y - 300 - 500 * hit + 1300 * hit * hit;        // what was inside flies free
      ctx.save(); ctx.translate(ox, Math.min(oy, MAC.y - 40)); ctx.rotate(hit * (3 - i)); ctx.scale(2.6, 2.6); ctx.translate(0, 64);
      if (i === 0) inWatch(t, 1); else if (i === 1) inPhone(t, 1, 1); else inPhoto(t, 1); ctx.restore();
    }
  });
  macGloss(t, .22);
  for (let g = 3; g >= 0; g--) { const q = clamp(sw - g * .05); ctx.save(); ctx.globalAlpha = g ? .16 : 1; manHand([lerp(-300, 2500, q), MAC.y - 250 - Math.sin(q * Math.PI) * 70], -.06, { s: 1.7, curl: .95, arm: 1500, rim: PAL.amber, side: -1 }); ctx.restore(); }
  screen(); if (d > 0) { ctx.fillStyle = rgba([255, 255, 255], .7 * Math.exp(-d * 16)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('smash', macSmash, { bloom: .7, grain: .6 }, [300, 100, 1620, 980]);
// ---------- THE BAR FROM ABOVE: what he slides across. His side is the left, its side the right ----------
function topWood(t, o = {}) {
  const red = o.red ?? .25;
  fill([70, 40, 24], [44, 24, 16]);
  screen();
  ctx.fillStyle = lg(0, 0, W, 0, [[0, [96, 56, 30]], [.55, [72, 40, 24]], [1, mix([60, 30, 20], [110, 24, 20], red)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
function topGrain(t, o = {}) {                       // in the camera: grain, rings left by glasses, the lamp's pool, its red light
  const red = o.red ?? .25;
  for (let i = 0; i < 46; i++) {
    const x = -400 + i * 62 + rnd(i * 3) * 40, a = .05 + rnd(i * 7) * .09;
    ctx.strokeStyle = rgba(rnd(i) < .5 ? [30, 14, 8] : [150, 96, 56], a); ctx.lineWidth = 2 + rnd(i * 5) * 5;
    ctx.beginPath(); ctx.moveTo(x, -400); ctx.bezierCurveTo(x + 30 * (rnd(i * 2) - .5), 200, x + 40 * (rnd(i * 9) - .5), 700, x + 10, 1500); ctx.stroke();
  }
  ctx.lineWidth = 5; for (const [x, y, r] of [[420, 250, 62], [520, 820, 62], [300, 610, 62], [1120, 180, 62]]) { ctx.strokeStyle = rgba([24, 10, 6], .22); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
  additive(() => { lite(PAL.amber, o.lx ?? 760, o.ly ?? 480, 820, .42 * (o.lamp ?? 1)); lite([255, 60, 44], 2150, 540, 1000, .5 * red + .1); });
}
function topGlass(x, y, r, level = 0) {
  ctx.fillStyle = rgba([0, 0, 0], .28); ctx.beginPath(); ctx.ellipse(x + 16, y + 20, r * 1.02, r * 1.02, 0, 0, TAU); ctx.fill();
  if (level > .02) { disc(x, y, r * .9, rg(x - r * .2, y - r * .2, 0, r, [[0, [255, 190, 90], .95], [1, [176, 84, 16], .95]])); additive(() => lite(PAL.amber, x, y, r * 2.2, .35)); }
  else disc(x, y, r * .9, rgba([190, 230, 225], .12));
  ctx.strokeStyle = rgba([235, 255, 250], .85); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba([255, 255, 255], .7); ctx.lineWidth = r * .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r * .74, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
}
function topWatch(x, y, rot, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = rgba([0, 0, 0], .3); rrect(-190 + 10, -30 + 14, 380, 60, 14); ctx.fill();
  ctx.fillStyle = lg(0, -30, 0, 30, [[0, [86, 56, 38]], [1, [50, 30, 20]]]); rrect(-190, -30, 380, 60, 14); ctx.fill();
  ctx.fillStyle = rgba([24, 12, 8], .6); for (let i = 0; i < 5; i++) disc(-170 + i * 22, 0, 4);
  disc(0, 0, 76, rgba(PAL.brass)); disc(0, 0, 64, rgba([250, 240, 214]));
  ctx.strokeStyle = rgba([40, 26, 16]); ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.lineWidth = i % 3 ? 2 : 5; line(Math.sin(a) * 50, -Math.cos(a) * 50, Math.sin(a) * 58, -Math.cos(a) * 58); }
  const h = 5.1 / 12 * TAU, m = .1 * TAU + t * .02;
  ctx.lineWidth = 7; line(0, 0, Math.sin(h) * 30, -Math.cos(h) * 30); ctx.lineWidth = 5; line(0, 0, Math.sin(m) * 46, -Math.cos(m) * 46);
  specular(ctx, -20, -26, 40, 16, -.5, .5);
  ctx.restore();
}
// his phone lying on the bar, ringing: o.ring 0-1, o.dead (screen off)
function topPhone(x, y, rot, s, t = 0, o = {}) {
  const ring = o.ring ?? 1, jx = ring ? Math.sin(t * 75) * 3 * ring : 0;
  ctx.save(); ctx.translate(x + jx, y); ctx.rotate(rot + jx * .003); ctx.scale(s, s);
  ctx.fillStyle = rgba([0, 0, 0], .35); rrect(-100 + 12, -205 + 16, 200, 410, 30); ctx.fill();
  ctx.fillStyle = '#0b0b10'; rrect(-100, -205, 200, 410, 30); ctx.fill();
  if (!o.dead) {
    ctx.save(); rrect(-90, -195, 180, 390, 22); ctx.clip();
    ctx.fillStyle = lg(0, -195, 0, 195, [[0, [34, 112, 72]], [1, [8, 34, 24]]]); ctx.fillRect(-90, -195, 180, 390);
    for (let k = 0; k < 3; k++) { const q = ((t * 1.3 + k / 3) % 1); ctx.strokeStyle = rgba([170, 255, 200], .5 * (1 - q) * ring); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -84, 36 + q * 60, 0, TAU); ctx.stroke(); }
    disc(0, -84, 36, rgba([210, 255, 225]));
    ctx.fillStyle = rgba([40, 110, 76]); rectf(-17, -92, 34, 24, rgba([40, 110, 76])); poly([[-22, -92], [0, -108], [22, -92]], rgba([40, 110, 76]));     // a small school house
    font(34, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([240, 255, 244]); ctx.fillText('SCHOOL', 0, 8);
    font(17, SANS, '500'); ctx.fillStyle = rgba([200, 240, 214], .8); ctx.fillText('calling…', 0, 44);
    disc(-44, 132, 27, rgba([232, 72, 62])); disc(44, 132, 27, rgba([70, 214, 116]));
    ctx.restore();
    additive(() => lite([110, 255, 170], 0, 0, 380, .3));
  }
  ctx.restore();
}
const topItem = (what, x, y, rot, t, o = {}) => what === 'watch' ? topWatch(x, y, rot, 1.25, t) : what === 'phone' ? topPhone(x, y, rot, 1.05, t, o) : lilyPhoto(x, y, 230, 270, { rot, border: 14, wave: 1 });

// ---------- TRADE: he slides it across; its claw takes it. p.what 'watch' | 'phone' | 'photo'; p.u0 / p.u1 play a part of it (the replays) ----------
function topTrade(t, p, L, len) {
  const what = p.what || 'watch', u = lerp(p.u0 ?? 0, p.u1 ?? 1, clamp(L / len)), red = p.red ?? { watch: .2, phone: .35, photo: .55 }[what];
  topWood(t, { red });
  const sl = what === 'photo' ? seg(u, .08, .7, E.io) : seg(u, .34, .86, E.io), ox = lerp(700, 1330, sl), oy = 520 + Math.sin(sl * Math.PI) * -14;
  const fr = kcam(L, len, [[0, 1.12, 900, 540], [1, 1.2, 1080, 540]], { hand: .3, t });
  topGrain(t, { red });
  topGlass(330, 250, 92, what === 'watch' ? .1 : .5); if (what !== 'watch') topGlass(180, 420, 92, 0); if (what === 'photo') { topGlass(260, 760, 92, 0); topGlass(450, 880, 92, 0); }
  const take = seg(u, .86, 1, E.in), grabbed = take * 520;
  topItem(what, ox + grabbed, oy, { watch: .25, phone: -.12, photo: .1 }[what] + sl * .2, t, { ring: 1 });
  // its claw: waiting open, then closing on it and drawing it away
  const tapK = what === 'watch' ? Math.max(pulse(u, .06, .14, .03, .03), pulse(u, .19, .27, .03, .03)) : 0;
  if (what === 'watch' && u < .34) claw([lerp(1500, 1230, seg(u, 0, .08)) + grabbed, 420 + tapK * 50], Math.PI - .35, 1.7, { point: 1, arm: 900, side: 1 });
  else claw([lerp(2300, 1760, seg(u, .3, .6, E.out)) + grabbed, 540], Math.PI, 1.9, { curl: lerp(.05, .5, seg(u, .84, .95)), spread: 1.3, arm: 900, side: 1 });
  // his hand: the watch is still on his wrist at first; then his fingers push it away from him
  if (what === 'watch' && u < .34) manHand([lerp(560, 300, seg(u, .26, .34)), 560], .0, { s: 1.5, curl: .35, arm: 1200 });
  else { const hx = Math.min(ox - 250, lerp(300, 1100, sl)) - seg(u, .88, 1) * 300; manHand([hx, oy + 60], -.08, { s: 1.5, curl: .12, arm: 1200, pinch: .1 }); }
  if (p.tint) { screen(); ctx.fillStyle = rgba([255, 30, 30], p.tint); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('trade', topTrade, { bloom: .45, grain: .6 }, [420, 180, 1500, 900]);

// ---------- PHONE ON THE BAR: it lights and rings. SCHOOL ----------
function topPhoneBar(t, p, L, len) {
  topWood(t, { red: .3 });
  const fr = kcam(L, len, [[0, 1.0, 900, 540], [1, 1.5, 800, 520]], { hand: .3, t }), on = seg(L, .1, .2);
  topGrain(t, { red: .3, lx: 520 });
  topGlass(330, 250, 92, .55); topGlass(180, 420, 92, 0);
  topPhone(790 + L * 10, 520, -.12, 1.05, t, { ring: on, dead: on < .5 });
  manHand([lerp(340, 300, seg(L, .5, 1.2)), 820], -.5, { s: 1.5, curl: lerp(.3, .6, seg(L, .5, 1.1)), arm: 1200 });
  blurred(10, () => claw([2150, 420], Math.PI + .2, 2.4, { curl: .2, arm: 600, side: 1 }));
}
shot('phonebar', topPhoneBar, { bloom: .5, grain: .6 }, [500, 100, 1100, 960]);

// ---------- GRAB: among the broken glass, his phone still ringing, and her photo. He takes both ----------
function topGrab(t, p, L, len) {
  topWood(t, { red: .15 });
  const fr = kcam(L, len, [[0, 1.15, 960, 540], [1, 1.3, 900, 540]], { hand: .5, t }), g = seg(L, .3, .62, E.out), out = seg(L, .66, 1.05, E.in);
  topGrain(t, { red: .15 });
  for (let i = 0; i < 26; i++) {                                           // glass everywhere
    const x = 200 + rnd(i * 3 + 1) * 1500, y = 80 + rnd(i * 5 + 2) * 920, r = 14 + rnd(i * 7) * 40;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rnd(i) * 6); ctx.fillStyle = rgba([200, 250, 240], .28); ctx.strokeStyle = rgba([240, 255, 250], .8); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r, -r * .4); ctx.lineTo(r * .8, -r * .7); ctx.lineTo(r * .3, r * .8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  const dx = -out * 1700;
  lilyPhoto(1010 + dx * (g > .9 ? 1 : 0), 640, 230, 270, { rot: .16 - out * .3, border: 14, wave: 1 });
  topPhone(760 + dx * (g > .9 ? 1 : 0), 440, -.2 + out * .2, 1.05, t, { ring: 1 });
  manHand([lerp(-200, 640, g) + dx, 560], -.02, { s: 1.7, curl: lerp(.1, .7, seg(L, .5, .66)), arm: 1400, pinch: .8, rim: PAL.amber });
}
shot('grab', topGrab, { bloom: .5, grain: .6 }, [500, 200, 1300, 900]);
// ---------- FACES: his, close; the devil's, close; the two of them; the reveal ----------

EXPR.tempted = { lid: .16, brow: .7, browH: .08, smile: -.35, open: .12, grit: 0, gx: -.9, gy: .35, tear: 0, sweat: .5 };
// a dark bed along the bottom of the red shots, so its red words hold against the red room
function redBed() { screen(); ctx.fillStyle = lg(0, 700, 0, 1010, [[0, [6, 0, 2], 0], [1, [6, 0, 2], .86]]); ctx.fillRect(-W, 700, 3 * W, H); }
// what is behind his face, by look
const FACE_LOOK = {
  bar: { rim: PAL.amber, lc: [.7, -.5], fill: [9, 12, 15], bg: (t, L) => macBg(t, { gx: 1300 }) },
  red: { rim: [255, 96, 70], lc: [.8, -.2], fill: [12, 6, 8], bg: (t, L) => macBg(t, { red: 1, gx: 1400 }) },
  dawn: { rim: [255, 206, 150], lc: [.85, -.3], fill: [22, 14, 18], bg: (t, L) => { fill([250, 170, 130], [226, 120, 110]); additive(() => lite([255, 226, 170], 1750, 260, 900, .45)); bokeh(71, 12, [0, 0, 1920, 1080], [[255, 236, 200], [255, 190, 150]], 30, 90, .18, t); } },
  street: { rim: [255, 140, 70], lc: [-.8, -.2], fill: [8, 10, 18], bg: (t, L) => { fill([10, 14, 40], [28, 36, 84]); additive(() => { lite([255, 96, 50], -100, 560, 1000, .55); lite(PAL.rainB, 1700, 300, 900, .25); });
    bokeh(83, 14, [300, 0, 1920, 900], [PAL.lamp, PAL.rainB, [255, 150, 80]], 24, 80, .22, t); } }
};
// p: look, from / to (expressions), at (u where it changes, default .3), jerk (he recoils at the start), rain, dir, sweat
function faceHis(t, p, L, len) {
  const K = FACE_LOOK[p.look || 'bar'], u = L / len, k = seg(u, p.at ?? .3, (p.at ?? .3) + .28);
  const ex = Object.assign({}, exMix(p.from || 'tired', p.to || p.from || 'tired', k));
  const ph = (t % 3.1); if (ex.open < .4 && ph < .12 && !p.noblink) ex.lid = Math.max(ex.lid, 1 - Math.abs(ph - .06) / .06);
  K.bg(t, L);
  const jerk = p.jerk ? Math.exp(-L * 7) : 0, tr = p.tremble ? Math.sin(t * 46) * 3 * (1 - k) : 0;
  const fr = kcam(L, len, p.cam || [[0, 1.0, 960, 540], [1, 1.13, 960, 520]], { hand: .4, t });
  const x = 900 + tr + (p.dx || 0), y = 500 - jerk * 26 + Math.sin(t * 1.4) * 4, r = 262 * (1 + jerk * .05);
  manBust(x, y, r, ex, { rim: K.rim, lc: K.lc, fill: K.fill, turn: p.turn ?? .8, dir: p.dir || 1, wet: 0, t, tilt: (p.tilt || 0) + Math.sin(t * 1.1) * .012, la: .4 });
  if (p.sweat) { ctx.fillStyle = rgba([255, 244, 230], .8); for (let i = 0; i < 4; i++) { const q = (t * (.5 + rnd(i) * .3) + rnd(i * 3)) % 1; ctx.beginPath(); ctx.ellipse(x - 150 + i * 96, y - 150 + q * 200, 7, 12, 0, 0, TAU); ctx.fill(); } }
  if (p.rain) rain(t, { n: 110, a: .36, len: 120 });
  if (p.look === 'street') blurred(12, () => { screen(); ctx.fillStyle = rgba([255, 70, 40], .16 + .08 * Math.sin(t * 9)); ctx.fillRect(-W, 0, W + 420, H); });
}
shot('hisface', faceHis, { bloom: .45, grain: .6 }, [560, 180, 1260, 900]);

// ---------- DRINK: his head goes back, the glass empties ----------
function faceDrink(t, p, L, len) {
  const k = seg(L, .1, .75, E.io), dn = seg(L, .95, len, E.io);
  macBg(t, { gx: 1500 });
  blurred(16, () => { additive(() => { for (const sd of [-1, 1]) lite([255, 60, 40], 1620 + sd * 46, 330, 60, .9); lite([255, 60, 40], 1620, 400, 420, .4); }); });   // it watches, soft, from behind the bar
  const fr = kcam(L, len, [[0, 1.05, 940, 540], [1, 1.2, 900, 500]], { hand: .4, t });
  const tilt = -.5 * k + .5 * dn * .6, x = 820, y = 520, r = 250;
  manBust(x, y, r, exMix('tired', 'sleep', k), { rim: PAL.amber, lc: [.8, -.4], turn: 1, tilt, la: .45, light: [255, 190, 110] });
  const ca = Math.cos(tilt), sa = Math.sin(tilt), mo = [x + (r * .52) * ca - (r * .47) * sa, y + (r * .52) * sa + (r * .47) * ca];   // his mouth
  const ga = lerp(-.25, -1.5, k) + dn * .9, gs = 1.9, cg = Math.cos(ga), sg = Math.sin(ga);
  const C = [mo[0] + 50 * gs * cg - 52 * gs * sg, mo[1] + 50 * gs * sg + 52 * gs * cg];                                               // the middle of the glass
  additive(() => lite(PAL.amber, C[0], C[1], 300, .45 * (1 - k)));
  ctx.save(); ctx.translate(mo[0], mo[1]); ctx.rotate(ga); tumbler(50 * gs, 104 * gs, gs, .72 * (1 - k), { slosh: -2.4 * k, glowA: 1.2 }); ctx.restore();
  manHand([C[0] + 150, C[1] + 150], -2.36 - .1 * k, { s: 1.4, curl: .8, arm: 900, rim: PAL.amber, side: 1 });
}
shot('drink', faceDrink, { bloom: .5, grain: .6 }, [480, 120, 1300, 960]);

// ---------- TWO-SHOT: its face at his ear, its arm round his shoulders ----------
function faceTwo(t, p, L, len) {
  macBg(t, { gx: 300, red: .35, lamp: .7 });
  const fr = kcam(L, len, [[0, 1.02, 960, 540], [1, 1.14, 1010, 520]], { hand: .4, t });
  placeDevil([1050 + Math.sin(L * .9) * 8, 2470, 2.55]);
  const o = devilO({ a: 1, eyes: 1, grin: lerp(.5, .95, seg(L, .3, 1.2)), lean: .32 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  const sl = Math.sin(t * 1.2) * 3;
  manBust(690, 560 + sl, 250, exMix('glazed', 'empty', seg(L, .2, 1.2)), { rim: [255, 110, 80], lc: [.9, -.1], turn: .55, tilt: .1, la: .45, light: [255, 120, 90], fill: [9, 10, 14] });
  claw([180, 1160], -1.02, 2.5, { curl: .5, spread: 1.15, arm: 500, side: 1 });           // its hand on his far shoulder
  blurred(10, () => tumbler(1700, 1120, 3.2, .4, { a: .9 }));
}
shot('twoshot', faceTwo, { bloom: .5, grain: .6 }, [380, 120, 1500, 860]);

// ---------- HER PHOTO, in his hand ----------
function facePhoto(t, p, L, len) {
  macBg(t, { gx: 500, red: .3 });
  const fr = kcam(L, len, [[0, 1.05, 960, 540], [1, 1.2, 960, 520]], { hand: .5, t }), th = seg(L, .35, 1.1, E.io);
  additive(() => lite([255, 60, 40], 1900, 500, 800, .35 + .15 * Math.sin(t * 5)));
  const rot = -.08 + Math.sin(t * 1.3) * .012, px0 = 960, py0 = 500;
  lilyPhoto(px0, py0 - 20, 470, 540, { rot, border: 26, wave: 1, ex: 'happy', dim: th * .2 });
  // his thumb comes up across her face
  const tb = [px0 - 400, py0 + 640], tt = [lerp(px0 - 250, px0 - 40, th), lerp(py0 + 330, py0 + 40, th)];
  ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = rgba(PAL.amber, .7); ctx.shadowBlur = 16 * VP.k; stroke([tb, tt], 178, rgba(PAL.amber, .6)); ctx.shadowBlur = 0;
  stroke([tb, tt], 168, rgba(PAL.ink)); stroke([[tb[0] - 30, tb[1] - 30], [tt[0] - 34, tt[1] - 16]], 30, rgba(mix(PAL.ink, PAL.amber, .3), .45)); ctx.restore();
  blurred(5, () => { ctx.lineCap = 'round'; for (let f = 0; f < 3; f++) stroke([[px0 + 250 + f * 8, py0 + 130 + f * 100], [px0 + 330, py0 + 150 + f * 100]], 84, rgba(PAL.ink)); });   // his fingers behind its edge
}
shot('photohand', facePhoto, { bloom: .5, grain: .6 }, [600, 140, 1320, 900]);

// ---------- ITS FACE, close: the bar gone red ----------
function faceDevil(t, p, L, len) {
  fill([70, 8, 12], [20, 2, 4]);
  placeDevil([960 + (p.dx || 0), 1640, 1.5]);
  const o = devilO({ a: 1, eyes: 1, grin: p.grin ?? lerp(.6, 1, seg(L, 0, .5)), lean: p.lean ?? .1, scream: p.scream || 0 }), [hx, hy] = devilHead(t, o);
  const tw = (L > .7 && L < .76) || (L > 1.25 && L < 1.3) ? 12 : 0;
  const fr = kcam(L, len, [[0, 2.15, hx + tw, hy + 30], [1, 2.5, hx + tw, hy + 36]], { t });
  barWall(t, { red: 1, clock: 'none' });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  screen(); ctx.fillStyle = rgba(PAL.red, .1 + .06 * Math.sin(t * 6)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (!p.nobed) redBed();
}
shot('devface', faceDevil, { bloom: .55, grain: .65 }, [620, 120, 1300, 820]);

// ---------- IT TOWERS behind the bar (under "YOU HANDED HER OVER.") ----------
function faceTower(t, p, L, len) {
  fill([60, 6, 10], [14, 2, 4]);
  const fr = kcam(L, len, [[0, 1.0, 900, 470], [1, 1.12, 900, 430]], { jolt: Math.exp(-L * 6) * .6, t });
  barWall(t, { red: 1, clock: 'none', watch: 1, phone: 1, photo: 1 });
  placeDevil([930, 1640, 1.95]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .6, reach: .0 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  barLamps(t, { dim: .5, col: [255, 90, 60], flicker: 1 });
  barCounter(t, { red: 1 });
  const M = manBack(560, 1.46, { slump: .1 }); stool(560, 1.46); drawMan(M, 'fear', { face: false, rim: [255, 90, 60], a: .7, lx: 1, ly: -.3 }); stoolSeat(560, 1.46);
  screen(); ctx.fillStyle = rgba(PAL.red, .1); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  redBed();
}
// ---------- REPLAYS: three red flashes of his own hand, then it towering ----------
function faceReplays(t, p, L, len) {
  const step = .5, i = Math.min(3, Math.floor(L / step)), sub = L - i * step;
  if (i < 3) { topTrade(t, { what: ['watch', 'phone', 'photo'][i], u0: .5, u1: .97, red: 1, tint: .2 }, sub, step); redBed(); screen(); ctx.fillStyle = rgba([255, 255, 255], .6 * Math.exp(-sub * 22)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  else { faceTower(t, p, sub, len - 3 * step); screen(); ctx.fillStyle = rgba([255, 40, 30], .5 * Math.exp(-sub * 14)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('replays', faceReplays, { bloom: .55, grain: .65 }, [420, 160, 1500, 900]);

// ---------- THE LAST BOTTLE: it holds a big empty bottle out to him, mouth first, like a throat ----------
function faceBigBottle(t, p, L, len) {
  fill([56, 6, 10], [12, 2, 4]);
  const k = seg(L, 0, len, E.in), sc = lerp(.62, 1.6, k), cx = 960, cy = 640;
  const fr = kcam(L, len, [[0, 1, 960, 540], [1, 1.04, 960, 540]], { hand: .5, t });
  placeDevil([920, 2270, 2.5]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .1 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  // the bottle held out to him mouth first: the body flares away behind the lip, up toward its hands
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  const B = [0, -210, 400], N = [0, 0, 205];
  ctx.fillStyle = lg(-420, 0, 420, 0, [[0, [190, 250, 240], .34], [.5, [150, 230, 220], .12], [1, [255, 150, 130], .3]]);
  ctx.beginPath(); ctx.arc(B[0], B[1], B[2], Math.PI, TAU); ctx.lineTo(N[2], 0); ctx.arc(0, 0, N[2], 0, Math.PI); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba([225, 255, 250], .7); ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(B[0], B[1], B[2], Math.PI * .98, Math.PI * 2.02); ctx.stroke();
  line(-B[2], B[1], -N[2], 0); line(B[2], B[1], N[2], 0);
  ctx.fillStyle = rgba([255, 255, 255], .22); rrect(-330, -330, 26, 250, 13); ctx.fill();
  ctx.fillStyle = rg(0, 0, 30, 220, [[0, [0, 0, 0], .97], [.7, [26, 2, 4], .97], [1, [100, 12, 14], .92]]); ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); ctx.fill();   // the dark inside
  for (let i = 0; i < 5; i++) { const q = (i / 5 + t * .4) % 1; ctx.strokeStyle = rgba([255, 80, 60], .4 * (1 - q)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -q * 60, 200 * (1 - q * .85), 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = lg(-220, -220, 220, 220, [[0, [240, 255, 250], .97], [.5, [150, 220, 210], .8], [1, [255, 120, 100], .95]]); ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, 0, 208, 0, TAU); ctx.stroke();        // the lip
  ctx.strokeStyle = rgba([255, 255, 255], .75); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 214, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  ctx.restore();
  claw([cx + 900 * sc, cy - 60 * sc], Math.PI + .12, 2.2 * sc, { curl: .34, spread: 1.2, arm: 600, side: -1 });
  claw([cx - 900 * sc, cy - 60 * sc], -.12, 2.2 * sc, { curl: .34, spread: 1.2, arm: 600, side: 1 });
  screen(); ctx.fillStyle = rgba(PAL.red, .08 + .06 * Math.sin(t * 7)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  redBed();
}
shot('bigbottle', faceBigBottle, { bloom: .55, grain: .65 }, [460, 60, 1460, 900]);

// ---------- ITS SCREAM: the shelf bursts, it shrinks behind the bar ----------
function faceScream(t, p, L, len) {
  const u = L / len, red = lerp(1, .15, seg(u, .2, 1));
  fill(mix(PAL.tealD, [60, 6, 10], red), [8, 4, 6]);
  const fr = kcam(L, len, [[0, 1.12, 1060, 470], [1, 1.02, 1000, 520]], { jolt: Math.exp(-L * 3) * 1.2, t });
  barWall(t, { red, clock: 'none' });
  for (let i = 0; i < 9; i++) { const x = 660 + i * 95, y = [268, 414, 560][i % 3], d = L - i * .05; if (d > 0) { macShards(d * .8, x, y - 60, 5, [200, 250, 240], i * 31); additive(() => lite([255, 255, 255], x, y - 60, 120, Math.exp(-d * 10))); } }
  const sh = seg(u, .25, 1, E.in);
  placeDevil([1050, lerp(1030, 1330, sh), lerp(.86, .5, sh)]);
  const o = devilO({ a: 1 - sh * .5, eyes: 1, grin: 0, scream: 1 - sh * .4, lean: -.25 * (1 - sh), reach: .9, targets: [[880, lerp(330, 600, sh)], [1240, lerp(330, 600, sh)]] });
  drawDevil(t, fr, o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  barLamps(t, { dim: .8, flicker: 1, col: mix(PAL.amber, [255, 90, 60], red) });
  barCounter(t, { red });
  const M = manBack(560, 1.46, { slump: 0 }); M.parts.forEach(q => q[0].forEach(pt => { pt[1] -= 60; })); M.head[1] -= 60;
  drawMan(M, 'resolve', { face: false, rim: mix(PAL.amber, [255, 90, 60], red), a: .75, lx: 1, ly: -.3 });
  screen(); ctx.fillStyle = rgba([255, 255, 255], .5 * Math.exp(-L * 12)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
shot('scream', faceScream, { bloom: .6, grain: .65 }, [520, 100, 1500, 900]);

// ---------- MONTAGE: seven cuts of .4 s ----------
function macSlam(t, sub, flip) {
  macBg(t, { gx: flip ? 500 : 1400 });
  cam(1.5, 940, 600);
  macBar(t);
  const hit = Math.exp(-sub * 9), gx = 940;
  for (let i = 0; i < (flip ? 5 : 3); i++) tumbler((flip ? 1700 : 180) + (flip ? -1 : 1) * i * 130, MAC.y, 1.7, 0, { a: .7, glowA: 0 });
  tumbler(gx, MAC.y - hit * 4, 2.0, .04, { tilt: (flip ? -1 : 1) * hit * .05, glowA: 0 });
  ctx.strokeStyle = rgba([255, 236, 190], .8 * hit); ctx.lineWidth = 5; for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(gx, MAC.y + 4, 110 + (1 - hit) * 240 * i, 12 + (1 - hit) * 20 * i, 0, Math.PI, TAU); ctx.stroke(); }
  macGloss(t);
  manHand([gx + (flip ? 210 : -210), MAC.y - 150 + hit * 10], flip ? Math.PI - .55 : .55, { s: 1.6, curl: .7, arm: 900, side: flip ? 1 : -1 });
}
function faceClock(t, sub) {
  fill(PAL.tealD, PAL.teal); cam(1.1, 960, 540);
  additive(() => lite(PAL.amber, 960, 540, 900, .4));
  wallClock(960, 540, 330, 5, { spin: 34 }, sub + .2);
}
function faceMontage(t, p, L, len) {
  const N = 10, step = len / N, i = Math.min(N - 1, Math.floor(L / step)), sub = L - i * step;
  const punch = 1 + .09 * Math.exp(-sub * 12), P0 = PUSH; PUSH = P0 * punch;
  if (i === 0) macSlam(t, sub, 0);
  else if (i === 1) macBottleIn(t, { n: 1 }, .93 + sub * .1, 1);
  else if (i === 2) macSlam(t, sub, 1);
  else if (i === 3) macBottleIn(t, { n: 2 }, .93 + sub * .1, 1);
  else if (i === 4) faceHis(t, { look: 'bar', from: 'empty', to: 'empty', noblink: 1 }, sub, step);
  else if (i === 5) faceClock(t, sub);
  else if (i === 6) macSlam(t, sub, 0);
  else if (i === 7) { if (SHOT.lilyface) SHOT.lilyface.draw(t, { ex: 'worry' }, sub + .5); else macBottleIn(t, { n: 3 }, .93, 1); }
  else if (i === 8) faceClock(t, sub + .4);
  else faceDevil(t, { grin: 1, nobed: 1 }, sub + .3, 2);
  PUSH = P0; screen();
  ctx.fillStyle = rgba(i === N - 1 ? [255, 60, 40] : [255, 255, 255], .5 * Math.exp(-sub * 24)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
shot('montage', faceMontage, { bloom: .5, grain: .65 }, [460, 140, 1460, 900]);
// ---------- THE SCHOOL STEPS (part 30): the set, its people and every shot there ----------
// World px. The school is seen straight on: the double door between x 750 and 1170, the landing (the top step) at
// y 534-594, six stone steps down to the pavement at y 1000, the kerb at 1170, the road below; the street lamp stands at
// the foot of the steps on the right (post x 1506, lantern at 1330, -62). The man is man() at s = 1 (470 px tall), Lily
// is lily() at s = 1.55 (her head level with his when he kneels at the foot and she stands on the first step).
// Feet stand on schY(k): k 0 the pavement at the foot, 1-5 the treads, 6 the landing.
const schG = { gy: 1000, R: 46, D: 26, lx0: 520, lx1: 1400, flare: 16, land: 534, edge: 594, base: 810, kerb: 1170, fx0: 60, fx1: 1860, roof: -450,
  door: [750, 1170, 20, 534], lamp: [1330, -62], post: 1506, ls: 1.55,
  win: [[210, 40, 150, 340], [500, 40, 150, 340], [1420, 40, 150, 340], [1710, 40, 150, 340], [210, -340, 150, 228], [500, -340, 150, 228], [1420, -340, 150, 228], [1710, -340, 150, 228], [960, -392, 190, 196]] };
const schTop = i => schG.gy - i * schG.R - (i - 1) * schG.D;                     // the top edge of riser i (1 = the lowest)
const schY = k => k <= 0 ? schG.gy + 46 : k >= 6 ? 574 : schTop(k) - 13;
const schYf = k => { const a = Math.floor(clamp(k, 0, 6)), f = clamp(k, 0, 6) - a; return lerp(schY(a), schY(a + 1), f); };

// ---------- the time of day ----------
const schTODS = {
  dusk: { skyT: [62, 54, 132], skyM: [178, 100, 172], skyB: [255, 166, 150], brick: [160, 82, 90], brickD: [104, 52, 78], stone: [200, 160, 172], stoneD: [128, 98, 132],
    pave: [118, 96, 138], paveD: [84, 68, 114], road: [60, 48, 94], tree: [46, 38, 82], treeL: [112, 70, 120], glass: [150, 112, 172], paint: [52, 96, 112], far: [98, 72, 134],
    roof: [58, 48, 96], rail: [30, 26, 60], amb: [255, 150, 172], cloud: [255, 170, 190], cloudA: .16, lightC: [255, 176, 190], lx: -.3, ly: -1, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: .45 },
  eve: { skyT: [18, 20, 62], skyM: [56, 46, 116], skyB: [130, 80, 140], brick: [100, 56, 94], brickD: [62, 36, 74], stone: [126, 106, 154], stoneD: [78, 66, 116],
    pave: [72, 66, 122], paveD: [46, 44, 94], road: [32, 32, 76], tree: [22, 22, 58], treeL: [50, 42, 92], glass: [62, 58, 120], paint: [36, 62, 88], far: [42, 40, 94],
    roof: [30, 28, 70], rail: [14, 14, 40], amb: [150, 130, 224], cloud: [120, 96, 180], cloudA: .1, lightC: [176, 186, 255], lx: 1, ly: -.8, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: .2 },
  night: { skyT: [8, 10, 36], skyM: [18, 22, 66], skyB: [36, 40, 98], brick: [60, 42, 90], brickD: [36, 26, 64], stone: [86, 84, 142], stoneD: [50, 50, 102],
    pave: [46, 52, 108], paveD: [28, 32, 78], road: [18, 22, 60], tree: [12, 14, 42], treeL: [30, 32, 74], glass: [28, 34, 80], paint: [26, 42, 74], far: [22, 26, 66],
    roof: [16, 18, 50], rail: [8, 10, 30], amb: [120, 140, 232], cloud: [56, 66, 140], cloudA: .08, lightC: [196, 214, 255], lx: 1, ly: -.8, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: 0 },
  morning: { skyT: [92, 164, 236], skyM: [162, 208, 246], skyB: [230, 242, 250], brick: [198, 104, 80], brickD: [158, 78, 66], stone: [226, 214, 200], stoneD: [184, 170, 164],
    pave: [196, 188, 184], paveD: [168, 162, 162], road: [124, 128, 142], tree: [64, 128, 86], treeL: [150, 196, 120], glass: [150, 204, 240], paint: [56, 120, 132], far: [150, 176, 206],
    roof: [96, 100, 124], rail: [40, 46, 60], amb: [255, 250, 236], cloud: [255, 255, 255], cloudA: .3, lightC: [255, 244, 222], lx: 1, ly: -.7, sunA: .4, sunX: 2700, sunY: -900, sunC: [255, 240, 210], day: 1 },
  gold: { skyT: [120, 140, 206], skyM: [246, 170, 140], skyB: [255, 196, 150], brick: [204, 102, 74], brickD: [146, 66, 66], stone: [236, 186, 150], stoneD: [176, 122, 116],
    pave: [212, 158, 130], paveD: [170, 120, 112], road: [124, 92, 104], tree: [92, 90, 60], treeL: [214, 136, 76], glass: [240, 170, 140], paint: [58, 110, 116], far: [196, 136, 126],
    roof: [112, 86, 104], rail: [56, 40, 54], amb: [255, 180, 120], cloud: [255, 196, 160], cloudA: .26, lightC: [255, 190, 110], lx: -1, ly: -.35, sunA: .9, sunX: -1200, sunY: 260, sunC: [255, 160, 90], day: .8 }
};
function schTod(x) {                                                       // 'dusk' or a blend ['eve', 'night', .4]
  if (typeof x === 'string') return schTODS[x];
  const a = schTODS[x[0]], b = schTODS[x[1]], o = {};
  for (const f in a) o[f] = Array.isArray(a[f]) ? mix(a[f], b[f], x[2]) : lerp(a[f], b[f], x[2]);
  return o;
}
const schLitFn = v => typeof v === 'function' ? v : Array.isArray(v) ? (i => v.includes(i) ? 1 : 0) : v === 'all' ? (i => .8 + .2 * rnd(i * 3.7)) : v === 'one' ? (i => i === 1 ? 1 : 0) : (() => 0);
// blur everything drawn so far (the set behind a close shot): one pass over the whole frame
function schSoft(r) { if (r <= .1) return; ctx.save(); px(); ctx.filter = `blur(${(r * VP.k).toFixed(1)}px)`; ctx.drawImage(cv, 0, 0); ctx.restore(); }

// ---------- the set, piece by piece ----------
function schSky(t, T) {
  ctx.fillStyle = lg(0, -1100, 0, 820, [[0, T.skyT], [.55, T.skyM], [1, T.skyB]]); ctx.fillRect(-3400, -3400, 8800, 4220);
  for (let i = 0; i < 8; i++) pool(-1500 + rnd(i * 3.3 + 2) * 5000 + t * (3 + i), -760 + rnd(i * 5.1) * 1150, 420 + rnd(i) * 380, 40 + rnd(i * 2) * 40, T.cloud, T.cloudA);
  if (T.sunA > .01) additive(() => { lite(T.sunC, T.sunX, T.sunY, 2300, .5 * T.sunA); lite([255, 240, 214], T.sunX, T.sunY, 700, .7 * T.sunA); });
}
function schTree(x, r, T, seed, t, yb = 810) {
  const y = yb - r * 1.9;
  poly([[x - 22, yb], [x - 12, y + r * .4], [x + 12, y + r * .4], [x + 24, yb]], rgba(mix(T.tree, [0, 0, 10], .4)));
  ctx.beginPath(); ctx.moveTo(x + r * .62, y); ctx.arc(x, y, r * .62, 0, TAU);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (.42 + rnd(seed + i) * .24), cx = x + Math.cos(a) * r * .58 + Math.sin(t * .7 + seed + i) * 4, cy = y + Math.sin(a) * r * .44; ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, TAU); }
  ctx.fillStyle = rgba(T.tree); ctx.fill();
  ctx.beginPath();                                                         // clumps of leaves on the light's side
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, rr = r * (.16 + rnd(seed + i * 3) * .12), cx = x + Math.cos(a) * r * .5 + T.lx * r * .3 + Math.sin(t * .7 + seed + i) * 4, cy = y + Math.sin(a) * r * .36 + T.ly * r * .22; ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, TAU); }
  ctx.fillStyle = rgba(T.treeL, .5); ctx.fill();
}
function schSides(t, T) {
  const G = schG;
  for (const sd of [-1, 1]) for (let i = 0; i < 6; i++) {                  // houses down the street, a few windows lit
    const w = 300 + rnd(i * 3 + sd) * 140, x = sd < 0 ? G.fx0 - 150 - i * 360 - w : G.fx1 + 150 + i * 360, h = 250 + rnd(i * 5 + sd * 2) * 170, c = mix(T.far, T.skyB, .1 + .1 * rnd(i));
    poly([[x, 810], [x, 810 - h], [x + w / 2, 810 - h - 100], [x + w, 810 - h], [x + w, 810]], rgba(c));
    if (T.day < .7) for (let j = 0; j < 3; j++) if (rnd(i * 9 + j + sd * 4) < .62) {
      const wx = x + 44 + j * 84, wy = 810 - h + 56; rectf(wx, wy, 38, 54, rgba([255, 206, 150], .85 - T.day * .5)); additive(() => lite([255, 190, 130], wx + 19, wy + 27, 90, .3));
    }
  }
  ctx.beginPath();                                                         // a hedge behind the railings
  for (const [a, b] of [[-3200, G.fx0 - 6], [G.fx1 + 6, 5200]]) for (let x = a; x < b; x += 70) { const r = 60 + rnd(x) * 30; ctx.moveTo(x + r, 720); ctx.arc(x, 720, r, 0, TAU); ctx.rect(x - 40, 720, 80, 90); }
  ctx.fillStyle = rgba(mix(T.tree, T.treeL, .25)); ctx.fill();
  schTree(-250, 330, T, 3, t); schTree(-760, 290, T, 9, t); schTree(-1300, 340, T, 31, t);
  schTree(2190, 340, T, 14, t); schTree(2700, 300, T, 22, t); schTree(3260, 330, T, 41, t);
  ctx.beginPath();                                                         // iron railings on a low wall
  for (const [a, b] of [[-3200, G.fx0 - 16], [G.fx1 + 16, 5200]]) {
    for (let x = a + 8; x < b - 8; x += 38) { ctx.rect(x, 640, 7, 150); ctx.moveTo(x - 4, 642); ctx.lineTo(x + 3.5, 618); ctx.lineTo(x + 11, 642); }
    ctx.rect(a, 662, b - a, 8); ctx.rect(a, 760, b - a, 8);
  }
  ctx.fillStyle = rgba(T.rail); ctx.fill();
  for (const [a, b] of [[-3200, G.fx0 - 16], [G.fx1 + 16, 5200]]) { rectf(a, 786, b - a, 24, rgba(T.stoneD)); rectf(a, 786, b - a, 4, rgba(T.stone, .8)); }
}
function schWindow(id, T, lit, t) {
  const [cx, top, w, h] = schG.win[id], x = cx - w / 2, arch = id === 8;
  const shape = (g = 0) => { ctx.beginPath(); if (arch) { ctx.moveTo(x - g, top + h + g); ctx.lineTo(x - g, top + w / 2); ctx.arc(cx, top + w / 2, w / 2 + g, Math.PI, 0); ctx.lineTo(x + w + g, top + h + g); ctx.closePath(); } else ctx.rect(x - g, top - g, w + 2 * g, h + 2 * g); };
  shape(16); ctx.fillStyle = rgba(T.stone); ctx.fill();
  rectf(x - 28, top + h + 14, w + 56, 16, rgba(T.stone)); rectf(x - 28, top + h + 30, w + 56, 6, rgba(T.stoneD));   // the sill
  shape(); ctx.fillStyle = lg(0, top, 0, top + h, [[0, mix(T.glass, T.skyM, .3)], [1, mix(T.glass, [8, 10, 30], .45)]]); ctx.fill();
  ctx.save(); shape(); ctx.clip();
  if (lit > .01) {
    ctx.fillStyle = lg(0, top, 0, top + h, [[0, [246, 168, 122], .97 * lit], [1, [230, 118, 88], .97 * lit]]); ctx.fillRect(x, top, w, h);
    rectf(x, top + h - 30, w, 30, rgba([126, 72, 54], .5 * lit));           // the room's wall under the glass
    for (let i = 0; i < 3; i++) {                                          // paper shapes the children stuck on the glass
      const qx = x + 26 + rnd(id * 7 + i * 3) * (w - 52), qy = top + h * (.42 + rnd(id * 3 + i * 5) * .34), q = 13 + rnd(id + i) * 6;
      ctx.save(); ctx.translate(qx, qy); ctx.rotate(rnd(id * 5 + i) * 3); ctx.fillStyle = rgba([[70, 140, 144], [140, 104, 170], [226, 132, 150]][i], .6 * lit);
      if (i === 1) { ctx.beginPath(); ctx.arc(0, 0, q, 0, TAU); ctx.fill(); } else ctx.fillRect(-q, -q, 2 * q, 2 * q);
      ctx.restore();
    }
  } else { ctx.fillStyle = rgba(T.skyM, .2); poly([[x + w * .1, top + h], [x + w * .5, top], [x + w * .78, top], [x + w * .38, top + h]]); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = rgba(lit > .3 ? mix(T.stone, [84, 44, 34], .75) : mix(T.stone, [255, 255, 255], .15), .92); ctx.lineWidth = 6;   // the glazing bars
  line(cx, top, cx, top + h); for (const k of arch ? [.42, .72] : [.34, .67]) line(x, top + h * k, x + w, top + h * k);
  shape(); ctx.strokeStyle = rgba(T.stoneD, .95); ctx.lineWidth = 4; ctx.stroke();
  if (lit > .01) additive(() => lite([255, 140, 96], cx, top + h / 2, w * 1.9, .2 * lit));
}
function schDoor(t, T, open, hall) {
  const [x0, x1, top, bot] = schG.door, cx = (x0 + x1) / 2, lw = (x1 - x0) / 2;
  rectf(x0 - 36, top - 78, x1 - x0 + 72, bot - top + 78, rgba(T.stone)); rectf(x0 - 36, top - 78, x1 - x0 + 72, 8, rgba(mix(T.stone, [255, 255, 255], .3)));
  rectf(x0 - 36, top - 78, 8, bot - top + 78, rgba(T.stoneD, .5)); rectf(x1 + 28, top - 78, 8, bot - top + 78, rgba(T.stoneD, .5));
  // the hall inside
  const hc = mix([34, 24, 48], [255, 204, 156], .1 + .5 * hall), hd = mix([18, 14, 34], [150, 86, 78], hall * .7);
  ctx.fillStyle = lg(0, top - 58, 0, bot, [[0, hc], [.68, hd], [1, mix(hd, [255, 196, 140], .25 * hall)]]); ctx.fillRect(x0, top - 58, x1 - x0, bot - top + 58);
  rectf(cx - 70, top + 150, 140, 96, rgba(mix(hd, [214, 170, 150], .12 + .3 * hall)));                 // a noticeboard on the far wall
  for (let i = 0; i < 5; i++) rectf(cx - 58 + (i % 3) * 42, top + 162 + Math.floor(i / 3) * 40, 30, 28, rgba([[90, 150, 150], [150, 120, 176], [236, 226, 210]][i % 3], .3 + .4 * hall));
  poly([[x0, bot], [cx - 100, top + 330], [cx + 100, top + 330], [x1, bot]], rgba(mix(hd, [255, 200, 150], .2 * hall)));   // the floor running in
  if (hall > .02) additive(() => { lite([255, 212, 160], cx, top + 60, 260, .7 * hall); lite([255, 240, 216], cx, top + 34, 60, .9 * hall); });
  // the fanlight over the doors
  rectf(x0, top - 58, x1 - x0, 52, rgba(mix(mix(T.glass, [8, 10, 30], .3), [240, 156, 118], .85 * hall)));
  ctx.strokeStyle = rgba(T.paint); ctx.lineWidth = 6; for (let i = 1; i < 4; i++) line(x0 + i * (x1 - x0) / 4, top - 58, x0 + i * (x1 - x0) / 4, top - 6);
  rectf(x0, top - 8, x1 - x0, 10, rgba(T.paint));
  // the two leaves swing in on their hinges
  const vis = lw * (1 - .8 * clamp(open));
  for (const sd of [-1, 1]) {
    const hx = sd < 0 ? x0 : x1, ex = hx - sd * vis, xa = Math.min(hx, ex), dc = mix(T.paint, [4, 6, 20], .3 * open);
    ctx.fillStyle = lg(hx, 0, ex, 0, [[0, mix(dc, [0, 0, 10], .3)], [1, dc]]); ctx.fillRect(xa, top, vis, bot - top);
    const gw = vis * .34;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const gx = xa + vis * (.11 + c * .44), gy = top + 34 + r * 128;
      rectf(gx, gy, gw, 112, rgba(mix(mix(T.glass, [8, 10, 30], .35), [238, 150, 114], .8 * hall)));
      ctx.fillStyle = rgba([255, 255, 255], .1); poly([[gx, gy + 112], [gx + gw * .5, gy], [gx + gw * .8, gy], [gx + gw * .3, gy + 112]]); ctx.fill();
    }
    ctx.strokeStyle = rgba(mix(dc, [255, 255, 255], .14)); ctx.lineWidth = 4; ctx.strokeRect(xa + vis * .11, top + 306, vis * .78, 176);
    disc(ex + sd * vis * .09, top + 294, 7, rgba(PAL.brass, .95));
    rectf(ex - 2, top, 4, bot - top, rgba([0, 0, 10], .5));
  }
  if (open * hall > .02) pool(cx, schG.land + 36, 320 * (.35 + .65 * open), 40, [255, 200, 140], .5 * open * hall);
}
function schCanopy(T) {
  const y = -76;
  ctx.fillStyle = lg(0, y + 24, 0, y + 96, [[0, [0, 0, 24], .4], [1, [0, 0, 24], 0]]); ctx.fillRect(700, y + 24, 520, 72);
  rectf(682, y, 556, 24, rgba(T.stone)); rectf(682, y, 556, 6, rgba(mix(T.stone, [255, 255, 255], .35))); rectf(682, y + 24, 556, 6, rgba(T.stoneD));
  for (const x of [704, 1216]) poly([[x - 12, y + 30], [x + 12, y + 30], [x + 12, y + 46], [x, y + 86], [x - 12, y + 86]], rgba(T.stoneD));
  font(76, SANS, '800'); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';                // the plain word
  const chars = [...'SCHOOL'], ws = chars.map(c => ctx.measureText(c).width), tr = 16, tot = ws.reduce((a, b) => a + b, 0) + tr * 5;
  let x = 960 - tot / 2;
  chars.forEach((c, i) => { ctx.fillStyle = rgba([0, 0, 20], .45); ctx.fillText(c, x + 4, y - 14); ctx.fillStyle = rgba(mix(T.stone, [255, 255, 255], .25)); ctx.fillText(c, x, y - 18); x += ws[i] + tr; });
}
function schBuilding(t, T, o) {
  const { fx0, fx1, roof, base } = schG;
  poly([[fx0 - 36, roof], [fx0 + 80, roof - 130], [fx1 - 80, roof - 130], [fx1 + 36, roof]], rgba(T.roof));
  rectf(330, roof - 200, 74, 120, rgba(T.brickD)); rectf(322, roof - 208, 90, 14, rgba(T.stoneD)); rectf(1516, roof - 200, 74, 120, rgba(T.brickD)); rectf(1508, roof - 208, 90, 14, rgba(T.stoneD));
  poly([[676, roof], [960, roof - 200], [1244, roof]], rgba(T.stone)); poly([[700, roof], [960, roof - 182], [1220, roof]], rgba(T.brick));   // the gable over the door
  disc(960, roof - 66, 36, rgba(T.stone)); disc(960, roof - 66, 25, rgba(mix(T.glass, [8, 10, 30], .4)));
  ctx.fillStyle = lg(0, roof, 0, base, [[0, mix(T.brick, T.amb, .16)], [.5, T.brick], [1, T.brickD]]); ctx.fillRect(fx0, roof, fx1 - fx0, base - roof);
  ctx.beginPath();                                                         // the brick courses
  for (let y = roof + 26, r = 0; y < 606; y += 26, r++) { ctx.moveTo(fx0, y); ctx.lineTo(fx1, y); for (let x = fx0 + (r % 2 ? 26 : 52); x < fx1; x += 52) { ctx.moveTo(x, y - 26); ctx.lineTo(x, y); } }
  ctx.strokeStyle = rgba(T.brickD, .5); ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < 120; i++) { const r = Math.floor(rnd(i * 3.1) * 40), c = Math.floor(rnd(i * 7.7) * 34); rectf(fx0 + c * 52 + (r % 2 ? 26 : 0) + 1, roof + r * 26 + 1, 50, 24, rgba(rnd(i) < .5 ? [255, 214, 196] : [20, 0, 34], .1)); }
  ctx.fillStyle = lg(0, 600, 0, base, [[0, T.stone], [1, T.stoneD]]); ctx.fillRect(fx0 - 10, 600, fx1 - fx0 + 20, base - 600);       // the plinth
  rectf(fx0 - 10, 600, fx1 - fx0 + 20, 8, rgba(mix(T.stone, [255, 255, 255], .3)));
  for (let x = fx0 + 150; x < fx1; x += 300) rectf(x, 608, 2, base - 608, rgba(T.stoneD, .5));
  for (const x of [210, 500, 1420, 1710]) { rectf(x - 52, 688, 104, 46, rgba(mix(T.glass, [4, 6, 24], .6))); ctx.strokeStyle = rgba(T.stoneD); ctx.lineWidth = 4; ctx.strokeRect(x - 52, 688, 104, 46); }
  rectf(fx0 - 8, -92, fx1 - fx0 + 16, 20, rgba(T.stone)); rectf(fx0 - 8, -72, fx1 - fx0 + 16, 5, rgba(T.stoneD));                   // the band between the floors
  rectf(fx0 - 26, roof - 8, fx1 - fx0 + 52, 30, rgba(T.stone)); rectf(fx0 - 26, roof + 22, fx1 - fx0 + 52, 6, rgba(T.stoneD));       // the cornice
  for (const sd of [0, 1]) for (let y = roof + 28, i = 0; y < 596; y += 52, i++) { const w = i % 2 ? 44 : 66; rectf(sd ? fx1 - w : fx0, y, w, 50, rgba(T.stone, .92)); }
  for (let i = 0; i < 9; i++) schWindow(i, T, o.lit(i), t);
  schDoor(t, T, o.door, o.hall); schCanopy(T);
}
function schGround(t, T, rk) {
  const G = schG;
  ctx.fillStyle = lg(0, G.base, 0, G.kerb, [[0, T.paveD], [1, T.pave]]); ctx.fillRect(-3400, G.base, 8800, G.kerb - G.base);
  ctx.fillStyle = lg(0, G.base, 0, G.base + 40, [[0, [0, 0, 24], .35], [1, [0, 0, 24], 0]]); ctx.fillRect(-3400, G.base, 8800, 40);    // the wall's foot
  ctx.strokeStyle = rgba(T.paveD, .7); ctx.lineWidth = 2; ctx.beginPath();                        // paving joints
  for (const y of [868, 950, 1056]) { ctx.moveTo(-3400, y); ctx.lineTo(5400, y); }
  for (let x = -3300; x < 5400; x += 190) { ctx.moveTo(960 + (x - 960) * .86, G.base); ctx.lineTo(x, G.kerb); }
  ctx.stroke();
  rectf(-3400, G.kerb, 8800, 26, rgba(mix(T.stone, T.pave, .5))); rectf(-3400, G.kerb, 8800, 4, rgba(mix(T.stone, [255, 255, 255], .2), .8)); rectf(-3400, G.kerb + 26, 8800, 10, rgba([0, 0, 20], .4));
  ctx.fillStyle = lg(0, G.kerb + 26, 0, G.kerb + 700, [[0, T.road], [1, mix(T.road, [0, 0, 16], .45)]]); ctx.fillRect(-3400, G.kerb + 26, 8800, 1400);
  if (rk > .02) for (let i = 0; i < 9; i++) {                             // puddles hold the sky
    const x = -900 + rnd(i * 4.7) * 3700, y = (i % 3 ? G.kerb + 90 + rnd(i * 2.1) * 260 : 1030 + rnd(i * 8.3) * 110), rx = 110 + rnd(i * 6.3) * 150;
    oval(x, y, rx, rx * .12, rgba(mix(T.skyM, T.amb, .3), .22 + .2 * rk));
  }
}
function schSteps(T) {
  const G = schG;
  for (const sd of [-1, 1]) {                                              // the cheek walls: sloping stone at each side
    const xb = sd < 0 ? G.lx0 : G.lx1, xf = xb + sd * 5 * G.flare;
    poly([[xb, 498], [xb + sd * 72, 498], [xf + sd * 86, 930], [xf, 930]], lg(0, 498, 0, 930, [[0, mix(T.stone, T.stoneD, .3)], [1, T.stone]]));
    poly([[xf, 930], [xf + sd * 86, 930], [xf + sd * 86, G.gy + 8], [xf, G.gy + 8]], rgba(T.stoneD));
    rectf(Math.min(xf - sd * 4, xf + sd * 92), 918, 96, 14, rgba(mix(T.stone, [255, 255, 255], .2)));
    ctx.strokeStyle = rgba(mix(T.stone, [255, 255, 255], .35), .8); ctx.lineWidth = 3; line(xb + sd * 72, 498, xf + sd * 86, 930);
    ctx.fillStyle = rgba([0, 0, 24], .22); poly([[xf + sd * 86, G.gy + 8], [xf + sd * 86, 940], [xf + sd * 150, G.gy + 8]]); ctx.fill();
  }
  rectf(G.lx0, G.land, G.lx1 - G.lx0, G.edge - G.land, lg(0, G.land, 0, G.edge, [[0, mix(T.stone, T.stoneD, .5)], [1, T.stone]]));
  for (let i = 6; i >= 1; i--) {
    const x0 = G.lx0 - (6 - i) * G.flare, w = G.lx1 - G.lx0 + 2 * (6 - i) * G.flare, top = schTop(i);
    if (i < 6) rectf(x0, top - G.D, w, G.D, lg(0, top - G.D, 0, top, [[0, mix(T.stone, T.stoneD, .4)], [1, T.stone]]));
    rectf(x0, top, w, G.R, lg(0, top, 0, top + G.R, [[0, mix(T.stoneD, T.stone, .3)], [1, mix(T.stoneD, [0, 0, 24], .28)]]));
    rectf(x0, top, w, 3, rgba(mix(T.stone, [255, 255, 255], .4), .9));
    ctx.fillStyle = rgba([0, 0, 24], .14); for (let x = x0 + 90 + (i % 2) * 110; x < x0 + w - 40; x += 220) ctx.fillRect(x, top + 3, 2, G.R - 3);
  }
  rectf(G.lx0 - 5 * G.flare, G.gy, G.lx1 - G.lx0 + 10 * G.flare, 12, lg(0, G.gy, 0, G.gy + 12, [[0, [0, 0, 24], .35], [1, [0, 0, 24], 0]]));
}
function schLampPost(T) {
  const x = schG.post, [hx, hy] = schG.lamp, c = mix([12, 16, 32], T.amb, .1 + .25 * T.day);
  poly([[x - 22, 1054], [x - 16, 968], [x - 9, 940], [x + 9, 940], [x + 16, 968], [x + 22, 1054]], rgba(c));
  rectf(x - 7, 24, 14, 922, rgba(c)); rectf(x - 7, 24, 4, 922, rgba(T.lightC, .32)); rectf(x - 12, 420, 24, 12, rgba(c)); rectf(x - 12, 60, 24, 10, rgba(c));
  ctx.strokeStyle = rgba(c); ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, 30); ctx.bezierCurveTo(x, -150, hx + 110, -150, hx, -128); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, -20); ctx.quadraticCurveTo(x - 60, -40, x - 86, -120); ctx.stroke();      // a scroll under the arm
  rectf(hx - 4, -128, 8, hy - 40 + 128, rgba(c));
  poly([[hx - 14, hy - 44], [hx + 14, hy - 44], [hx + 50, hy - 4], [hx - 50, hy - 4]], rgba(c)); disc(hx, hy - 48, 8, rgba(c));
}
function schLampLight(t, a) {                                              // the lantern's glass and what it throws (after the people)
  const [hx, hy] = schG.lamp;
  poly([[hx - 36, hy - 4], [hx + 36, hy - 4], [hx + 24, hy + 24], [hx - 24, hy + 24]], rgba(mix([40, 46, 70], [255, 240, 214], clamp(a))));
  if (a <= .01) return;
  cone(hx, hy + 12, 34, 470, 1130, PAL.lamp, .19 * a, -110);
  additive(() => { lite(PAL.lamp, hx, hy + 10, 560, .2 * a); lite(PAL.lamp, hx, hy + 12, 130, .5 * a); lite([255, 244, 224], hx, hy + 12, 30, .8 * a); });
}
// something soft near the lens: 'branchL' / 'branchR' leaves in a top corner, 'rail' railing spears along the bottom, 'post' a trunk at the right edge
function schFg(kind, t, T) {
  if (!kind) return;
  screen();
  const col = mix(T.tree, [0, 0, 12], .62);
  blurred(10, () => {
    if (kind.includes('branch')) {
      ctx.save(); if (kind.includes('branchR')) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.beginPath();
      for (let i = 0; i < 34; i++) { const k = rnd(i * 2.3 + 4), x = -80 + k * 680 + Math.sin(t * .9 + i) * 7, y = -50 + rnd(i * 5.9) * (290 - k * 230) + Math.sin(t * 1.1 + i * 2) * 6; ctx.moveTo(x + 60, y); ctx.ellipse(x, y, 60, 24, rnd(i * 4.1) * 3, 0, TAU); }
      ctx.fillStyle = rgba(col, .97); ctx.fill();
      ctx.beginPath(); for (let i = 0; i < 9; i++) { const k = rnd(i * 2.9 + 7), x = -40 + k * 560 + Math.sin(t * .9 + i) * 7, y = 40 + rnd(i * 3.7) * (190 - k * 170); ctx.moveTo(x + 46, y); ctx.ellipse(x, y, 46, 17, rnd(i * 6.1) * 3, 0, TAU); }
      ctx.fillStyle = rgba(mix(col, T.treeL, .3), .7); ctx.fill();
      ctx.restore();
    }
    if (kind.includes('rail')) {
      ctx.beginPath(); for (let x = -40; x < W + 80; x += 150) { ctx.rect(x, 930, 34, 200); ctx.moveTo(x - 16, 934); ctx.lineTo(x + 17, 850); ctx.lineTo(x + 50, 934); } ctx.rect(-40, 1010, W + 80, 30);
      ctx.fillStyle = rgba(mix(T.rail, [0, 0, 10], .3), .96); ctx.fill();
    }
    if (kind.includes('post')) { ctx.fillStyle = rgba(col, .97); ctx.fillRect(W - 150, -40, 260, H + 80); }
  });
}
// THE SET. o: tod ('dusk' | 'eve' | 'night' | 'morning' | 'gold', or a blend [a, b, k]), rain 0-1, lit (which windows:
// 'all' | 'one' | 'none' | [ids] | a function of the id; 0-3 the tall ones by the door, 4-7 upstairs, 8 over the door),
// lamp 0-1 (flicker it from the shot), door 0-1 (open), hall 0-1 (the light inside), soft (blur the set behind a close
// shot), fg (schFg), mist 0-1. mid(T): the people, drawn between the set and its light, rain and foreground.
function schSet(t, o = {}, mid = null) {
  const T = schTod(o.tod || 'dusk'), rk = o.rain || 0, la = o.lamp || 0, G = schG, [hx, hy] = G.lamp;
  schSky(t, T);
  schBuilding(t, T, { lit: schLitFn(o.lit ?? 'none'), door: o.door || 0, hall: o.hall ?? 0 });
  schSides(t, T);
  schGround(t, T, rk);
  schSteps(T);
  // the light that lies on the set
  if (T.sunA > .01) {
    const dir = T.sunX < 960 ? 1 : -1;
    additive(() => { ctx.fillStyle = lg(dir > 0 ? -600 : 2500, 0, dir > 0 ? 2500 : -600, 0, [[0, T.sunC, .17 * T.sunA], [1, T.sunC, 0]]); ctx.fillRect(-3400, G.roof - 300, 8800, 2400); });
    if (T.sunA > .7) {                                                     // the low sun: long shadows to the right, the leaves' shade on the wall
      blurred(14, () => { ctx.beginPath(); for (let i = 0; i < 18; i++) { const x = 70 + rnd(i * 3.3) * 640 + Math.sin(t * .6 + i) * 8, y = -380 + rnd(i * 7.1) * 900, rx = 70 + rnd(i) * 70; ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, 34 + rnd(i * 2) * 30, -.5, 0, TAU); } ctx.fillStyle = rgba([110, 40, 70], .2); ctx.fill(); });
      ctx.fillStyle = rgba([110, 50, 90], .24);
      poly([[G.post - 16, 1056], [G.post + 16, 1050], [3400, 826], [3400, 806]]); ctx.fill();
      poly([[-3400, 1040], [-200, 992], [640, 1004], [-3400, 1170]]); ctx.fill();
      for (const sd of [-1, 1]) { const xf = (sd < 0 ? G.lx0 : G.lx1) + sd * 5 * G.flare + (sd > 0 ? 86 : 0); poly([[xf, G.gy + 8], [xf, 930], [xf + 190, 986], [xf + 190, G.gy + 8]]); ctx.fill(); }
    }
  }
  if (la > .01) { pool(1240, 588, 400, 56, PAL.lamp, .26 * la); pool(1200, 1040, 560, 100, PAL.lamp, .3 * la); additive(() => lite(PAL.lamp, hx, 190, 760, .2 * la)); }
  schLampPost(T);
  if (rk > .02) wet(G.gy + 4, 160, .16 + .14 * rk, t, 4);
  if (o.soft) schSoft(o.soft);
  if (mid) mid(T);
  schLampLight(t, la);
  if (rk > .02) {
    wet(G.kerb + 26, 520, .28 + .2 * rk, t, 6);
    ripples(t, -700, 2700, 1012, 1160, Math.round(60 * rk), PAL.rainB, .5, 3); ripples(t, -700, 2700, G.kerb + 50, G.kerb + 420, Math.round(70 * rk), PAL.rainB, .45, 9);
    for (let i = 1; i <= 5; i++) ripples(t, 470, 1450, schTop(i) - G.D + 6, schTop(i) - 4, Math.round(9 * rk), PAL.rainB, .5, 20 + i);
    ripples(t, 540, 1380, G.land + 16, G.edge - 6, Math.round(12 * rk), PAL.rainB, .5, 31);
    if (la > .05) {                                                        // rain inside the lamp's cone catches its light
      ctx.save(); poly([[hx - 34, hy + 10], [hx + 34, hy + 10], [hx + 360, hy + 1140], [hx - 540, hy + 1140]]); ctx.clip();
      rain(t, { n: Math.round(160 + 240 * rk), len: 80, a: .5 * la, col: [255, 232, 196], seed: 7, w: 2.6, slant: .16 }); ctx.restore();
    }
  }
  if (o.mist) haze(t, -400, 2400, 760, 420, mix(T.amb, T.skyM, .5), .05 * o.mist, 5);
  schFg(o.fg, t, T);
  if (rk > .01) rain(t, { n: Math.round(60 + 280 * rk), len: 70 + 60 * rk, a: .14 + .2 * rk, slant: .16, w: 2.1 });
}

// ---------- the people ----------
// poses are plain numbers so that they blend: schMix(a, b, k) between two, schKeys(u, [[u0, pose], [u1, pose, ease], …])
function schMix(a, b, k) {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, k);
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => schMix(v, b[i], k));
  if (a && b && typeof a === 'object' && typeof b === 'object') { const o = {}; for (const f in a) o[f] = f in b ? schMix(a[f], b[f], k) : a[f]; for (const f in b) if (!(f in o)) o[f] = b[f]; return o; }
  return k < .5 ? a : b;
}
function schKeys(u, ks, f = E.io) {
  if (u <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (u <= ks[i][0]) return schMix(ks[i - 1][1], ks[i][1], (ks[i][2] || f)(inv(ks[i - 1][0], ks[i][0], u)));
  return ks[ks.length - 1][1];
}
// the man: man() from blendable numbers. o: hip, lean, neck, feet [near, far], hr [near, far] (his hands, relative to his
// shoulder, in px at s = 1, x along the way he faces), dir, s, elbow, knee
function schMan(o) {
  const s = o.s || 1, d = o.dir || 1, lean = (o.lean || 0) * d, sh = [o.hip[0] + Math.sin(lean) * 172 * s, o.hip[1] - Math.cos(lean) * 172 * s], hr = o.hr || [[10, 150], [-6, 150]];
  return man(Object.assign({}, o, { hands: hr.map(h => h && [sh[0] + h[0] * d * s, sh[1] + h[1] * s]) }));
}
const schMStand = (x, g, d = 1, o = {}) => Object.assign({ hip: [x, g - 196], feet: [[x + 6 * d, g], [x - 14 * d, g]], lean: 0, neck: 0, dir: d, hr: [[10, 150], [-6, 150]] }, o);
// Lily in any pose, for drawLily. o: hip, feet [near, far], lean, neck, look, nod, hr [near, far] (hands relative to her
// shoulder, px at s = 1, x along the way she faces), dir, s, pose (only for the coat's hem: 'stand' or 'sit'), knee
function schLily(o) {
  const s = o.s || schG.ls, d = o.dir || 1, lean = (o.lean || 0) * d, LEG = 30 * s, TOR = 62 * s, hip = o.hip, kd = o.knee ?? 1;
  const sh = [hip[0] + Math.sin(lean) * TOR, hip[1] - Math.cos(lean) * TOR], hl = lean + (o.neck || 0) * d;
  const hd = [sh[0] + Math.sin(hl) * 34 * s + (o.look || 0) * s, sh[1] - Math.cos(hl) * 34 * s + (o.nod || 0) * s];
  const legs = o.feet.map(f => { const [k, e] = ik(hip, f, LEG, LEG, j => kd * d * j[0] - .2 * j[1]); return [hip, k, e]; });
  const a0 = [sh[0], sh[1] + 6 * s], hr = o.hr || [[5, 62], [4, 61]];
  const arms = hr.map(h => { const [e, w] = ik(a0, [sh[0] + h[0] * d * s, sh[1] + h[1] * s], 30 * s, 28 * s, j => -(o.el ?? 1) * d * j[0] + .4 * j[1]); return [a0, e, w]; });
  return { s, d, pose: o.pose || 'stand', hip, sh, head: [hd[0], hd[1], 31 * s], legs, arms, lean };
}
const schLStand = (x, y, d = 1, o = {}) => { const s = o.s || schG.ls; return Object.assign({ hip: [x, y - 57.6 * s], feet: [[x + 7 * s, y], [x - 7 * s, y]], lean: 0, neck: 0, look: 0, nod: 0, dir: d, s, hr: [[5, 62], [4, 61]], pose: 'stand' }, o); };
const schLSit = (x, y, d = 1, o = {}) => { const s = o.s || schG.ls; return Object.assign({ hip: [x, y - 6 * s], feet: [[x + 30 * s * d, y + 44 * s], [x + 20 * s * d, y + 44 * s]], lean: .06, neck: 0, look: 0, nod: 0, dir: d, s, hr: [[13, 60], [9, 58]], pose: 'sit' }, o); };
const schEx = (a, b, k, over) => Object.assign(mixExpr(typeof a === 'string' ? EXPR[a] : a, typeof b === 'string' ? EXPR[b] : b, clamp(k)), over || {});
const schLex = (a, b, k, over) => Object.assign(mixExpr(typeof a === 'string' ? LILY_EX[a] : a, typeof b === 'string' ? LILY_EX[b] : b, clamp(k)), over || {});
const schBlink = (ex, x, at, d = .16) => { const k = 1 - Math.abs(x - at) / (d / 2); return k > 0 ? Object.assign({}, ex, { lid: Math.max(ex.lid, Math.min(1, k * 1.5)) }) : ex; };

// Lily drawn (drawLily), with two things the close shots need: her near leg starts at the coat's hem instead of
// crossing the coat, and her near sleeve has an edge so that the arm reads against the coat
function schDrawLily(P, ex, L = {}) {
  const s = P.s, hem = ((P.pose === 'sit' ? 30 : 44) / 100 * 62 + 6) * s, [h, k, f] = P.legs[0], d = Math.hypot(k[0] - h[0], k[1] - h[1]) || 1;
  const Q = Object.assign({}, P, { legs: [[v2.lerp(h, k, Math.min(1, hem / d)), k, f], P.legs[1]] });
  drawLily(Q, ex, L);
  const lit = L.a ?? 1, Y = mix([70, 54, 10], PAL.yellow, clamp(.35 + .65 * lit)), YD = mix([44, 32, 6], PAL.yellowD, clamp(.35 + .65 * lit));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke(P.arms[0], 17 * s, rgba(YD, .9)); stroke(P.arms[0], 12.5 * s, rgba(Y)); disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(PAL.ink));
}
// a child in a muted coat (never yellow): P from lily() or schLily(). o: coat, hat (a colour; else a hood), bag (a colour), rim, ra, lx
function schKid(P, o = {}) {
  const { s, d } = P, coat = o.coat || [44, 92, 100], cd = mix(coat, [8, 10, 24], .55), rim = o.rim || PAL.lamp, ra = o.ra ?? .5, cl = mix(coat, rim, .22 * ra + .08), ink = o.ink || [12, 13, 24], [hx, hy, r] = P.head, lx = o.lx ?? d;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke(P.legs[1], 13 * s, rgba(ink)); stroke([P.legs[1][2], [P.legs[1][2][0] + 9 * s * d, P.legs[1][2][1]]], 14 * s, rgba(cd));
  stroke(P.arms[1], 14 * s, rgba(cd));
  if (o.bag) { ctx.fillStyle = rgba(o.bag); rrect(P.sh[0] - d * 30 * s - 20 * s, P.sh[1] + 2 * s, 40 * s, 52 * s, 10 * s); ctx.fill(); }
  const hem = P.pose === 'sit' ? 30 : 44, c = Math.cos(P.lean), sn = Math.sin(P.lean);
  const along = (u, v) => [P.sh[0] + (P.hip[0] - P.sh[0]) * u - c * v * s, P.sh[1] + (P.hip[1] - P.sh[1]) * u + sn * v * s];
  const q = [along(-.06, -22), along(-.06, 22), along(.55, 30), along(1 + hem / 100, 38), along(1 + hem / 100, -38), along(.55, -30)];
  ctx.fillStyle = lg(P.sh[0] - 40 * s, 0, P.sh[0] + 40 * s, 0, lx > 0 ? [[0, cd], [.6, coat], [1, cl]] : [[0, cl], [.4, coat], [1, cd]]);
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.quadraticCurveTo(q[2][0], q[2][1], q[3][0], q[3][1]);
  ctx.quadraticCurveTo((q[3][0] + q[4][0]) / 2, (q[3][1] + q[4][1]) / 2 + 9 * s, q[4][0], q[4][1]); ctx.quadraticCurveTo(q[5][0], q[5][1], q[0][0], q[0][1]); ctx.fill();
  stroke(P.legs[0], 14 * s, rgba(ink)); stroke([P.legs[0][2], [P.legs[0][2][0] + 10 * s * d, P.legs[0][2][1]]], 15 * s, rgba(cd));
  if (!o.hat) { ctx.fillStyle = rgba(coat); ctx.beginPath(); ctx.ellipse(hx - 5 * s * d, hy - 3 * s, r * 1.2, r * 1.26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - r * 1.1, hy + r * .5); ctx.lineTo(hx + r, hy + r * .5); ctx.lineTo(P.sh[0] + 26 * s, P.sh[1] + 8 * s); ctx.lineTo(P.sh[0] - 26 * s, P.sh[1] + 8 * s); ctx.fill(); }
  disc(hx, hy, r, rgba(ink));
  if (o.hat) { ctx.fillStyle = rgba(o.hat); ctx.beginPath(); ctx.arc(hx, hy - r * .1, r * 1.07, Math.PI * 1.0, Math.PI * 2.0); ctx.closePath(); ctx.fill(); rectf(hx - r * 1.1, hy - r * .22, r * 2.2, r * .26, rgba(mix(o.hat, [8, 10, 24], .3))); disc(hx - d * r * .1, hy - r * 1.14, r * .27, rgba(mix(o.hat, rim, .3))); }
  else { ctx.strokeStyle = rgba(coat); ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.08, Math.PI * .12, Math.PI * .88); ctx.stroke(); }
  if (ra > .01) { ctx.strokeStyle = rgba(mix(coat, rim, .7), .9 * ra); ctx.lineWidth = 4.5 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.07, lx > 0 ? -Math.PI * .5 : Math.PI * 1.02, lx > 0 ? -Math.PI * .02 : Math.PI * 1.5); ctx.stroke(); }
  stroke(P.arms[0], 15 * s, rgba(mix(coat, cd, .25))); disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(ink)); disc(P.arms[1][2][0], P.arms[1][2][1], 6 * s, rgba(ink));
}
// a grown-up in a long muted coat: M from man() / schMan(). o: coat, bun (hair in a bun), hat, rim, ra, lx, ly, hem
function schAdult(M, o = {}) {
  const s = M.s, d = M.d, coat = o.coat || [50, 74, 108], cd = mix(coat, [6, 8, 22], .5), ink = o.ink || [12, 13, 24], rim = o.rim || PAL.lamp, ra = o.ra ?? .5;
  const lx = o.lx ?? 1, ly = o.ly ?? -.6, n = Math.hypot(lx, ly) || 1, ux = lx / n * 5 * s, uy = ly / n * 5 * s;
  const [legF, armF, , legN, armN] = M.parts.map(q => q[0]), { hip, sh } = M.j, [hx, hy, hr] = M.head;
  const ax = [hip[0] - sh[0], hip[1] - sh[1]], Ln = Math.hypot(ax[0], ax[1]), a = [ax[0] / Ln, ax[1] / Ln], nn = [-a[1], a[0]], hemK = o.hem ?? 1.62;
  const C = (k, w) => [sh[0] + a[0] * k * Ln + nn[0] * w * s, sh[1] + a[1] * k * Ln + nn[1] * w * s];
  const coatPath = (dx, dy, g) => { const q = [C(-.1, -34 - g), C(-.1, 34 + g), C(.62, 19 + g), C(hemK, 60 + g), C(hemK, -60 - g), C(.62, -19 - g)];
    ctx.beginPath(); ctx.moveTo(q[0][0] + dx, q[0][1] + dy); ctx.lineTo(q[1][0] + dx, q[1][1] + dy); ctx.quadraticCurveTo(q[2][0] + dx, q[2][1] + dy, q[3][0] + dx, q[3][1] + dy); ctx.lineTo(q[4][0] + dx, q[4][1] + dy); ctx.quadraticCurveTo(q[5][0] + dx, q[5][1] + dy, q[0][0] + dx, q[0][1] + dy); ctx.closePath(); };
  const off = pts => pts.map(q => [q[0] + ux, q[1] + uy]), bun = [hx - d * hr * .98, hy - hr * .32];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ra > .01) {                                                          // the rim: the same shapes a little larger, nudged toward the light
    const rc = rgba(rim, Math.min(1, ra * 1.3));
    ctx.save(); ctx.shadowColor = rgba(rim, Math.min(1, ra)); ctx.shadowBlur = 14 * pxPerUnit(ctx);
    stroke(off(legF), 20 * s + 5, rc); stroke(off(legN), 22 * s + 5, rc); stroke(off(armF), 20 * s + 5, rc); stroke(off(armN), 22 * s + 5, rc);
    coatPath(ux, uy, 2.5); ctx.fillStyle = rc; ctx.fill(); disc(hx + ux, hy + uy, hr + 2.5, rc); if (o.bun) disc(bun[0] + ux, bun[1] + uy, hr * .46 + 2.5, rc);
    ctx.restore();
  }
  stroke(legF, 20 * s, rgba(ink)); stroke(legN, 22 * s, rgba(ink));
  for (const f of [legF[2], legN[2]]) stroke([[f[0] - d * 4 * s, f[1] + 3 * s], [f[0] + d * 20 * s, f[1] + 3 * s]], 13 * s, rgba(ink));       // shoes
  stroke(armF, 20 * s, rgba(cd)); disc(armF[2][0], armF[2][1], 10 * s, rgba(ink));
  coatPath(0, 0, 0); ctx.fillStyle = lg(sh[0] - 50 * s, 0, sh[0] + 50 * s, 0, lx > 0 ? [[0, cd], [.62, coat], [1, mix(coat, rim, .16 * ra)]] : [[0, mix(coat, rim, .16 * ra)], [.38, coat], [1, cd]]); ctx.fill();
  const b0 = C(.66, -27), b1 = C(.66, 27); stroke([b0, b1], 8 * s, rgba(cd));                              // a belt
  stroke(armN, 22 * s, rgba(mix(coat, cd, .25)));
  if (o.scarf) { stroke([[sh[0] - d * 16 * s, sh[1] - 2 * s], [sh[0] + d * 20 * s, sh[1] + 6 * s]], 17 * s, rgba(o.scarf)); stroke([[sh[0] + d * 10 * s, sh[1] + 8 * s], [sh[0] + d * 14 * s, sh[1] + 52 * s]], 13 * s, rgba(mix(o.scarf, [8, 10, 24], .25))); } disc(armN[2][0], armN[2][1], 10 * s, rgba(ink));
  disc(hx, hy, hr, rgba(ink));
  if (o.bun) { disc(bun[0], bun[1], hr * .46, rgba(ink)); disc(hx - d * hr * .3, hy - hr * .2, hr * .98, rgba(ink)); }
  if (o.hat) { ctx.fillStyle = rgba(o.hat); ctx.beginPath(); ctx.arc(hx, hy - hr * .12, hr * 1.05, Math.PI * 1.03, Math.PI * 1.97); ctx.closePath(); ctx.fill(); }
  poly([[hx + d * hr * .9, hy - hr * .05], [hx + d * hr * 1.14, hy + hr * .2], [hx + d * hr * .86, hy + hr * .3]], rgba(ink));       // a nose: which way the head looks
  if (ra > .01) { ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.clip(); const gx = hx + ux / (5 * s) * hr * .6, gy = hy + uy / (5 * s) * hr * .6; ctx.fillStyle = rg(gx, gy, 0, hr * 1.2, [[0, mix(ink, rim, .34), .8 * Math.min(1, ra * 1.3)], [1, ink, 0]]); ctx.fillRect(hx - hr, hy - hr, 2 * hr, 2 * hr); ctx.restore(); }
}
// an open umbrella held at (hx, hy): the shaft leans by tilt (radians from straight up). o: R, len, col, rim, ra, rain 0-1, t, n
function schBrolly(hx, hy, o = {}) {
  const R = o.R || 150, len = o.len || 188, col = o.col || [70, 92, 128], cd = mix(col, [6, 8, 22], .45), rim = o.rim || PAL.lamp, ra = o.ra ?? .5, n = o.n || 6, top = -len - R * .5, ey = -len + 8, t = o.t || 0;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke([[0, 10], [0, top - 4]], 5, rgba([16, 18, 30]));
  ctx.strokeStyle = rgba([16, 18, 30]); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-9, 12, 9, 0, Math.PI); ctx.stroke();
  const dome = () => { ctx.beginPath(); ctx.moveTo(-R, ey); ctx.bezierCurveTo(-R * .98, top + R * .12, -R * .5, top, 0, top); ctx.bezierCurveTo(R * .5, top, R * .98, top + R * .12, R, ey);
    for (let i = n; i > 0; i--) { const x1 = -R + (i - 1) * 2 * R / n; ctx.quadraticCurveTo(x1 + R / n, ey - R * .17, x1, ey); } ctx.closePath(); };
  if (ra > .01) { ctx.save(); ctx.translate(0, -4); dome(); ctx.strokeStyle = rgba(rim, Math.min(1, ra * 1.2)); ctx.lineWidth = 5; ctx.shadowColor = rgba(rim, ra); ctx.shadowBlur = 14 * pxPerUnit(ctx); ctx.stroke(); ctx.restore(); }
  dome(); ctx.fillStyle = lg(0, top, 0, ey, [[0, mix(col, rim, .3 * ra)], [.5, col], [1, cd]]); ctx.fill();
  ctx.strokeStyle = rgba(cd, .8); ctx.lineWidth = 2.5;                      // the ribs
  for (let i = 1; i < n; i++) { const x1 = -R + i * 2 * R / n; ctx.beginPath(); ctx.moveTo(0, top); ctx.quadraticCurveTo(x1 * .7, top + R * .1, x1, ey); ctx.stroke(); }
  stroke([[0, top], [0, top - 16]], 4, rgba([16, 18, 30]));
  if (o.rain > .02) {                                                      // rain breaking on it, and running off its points
    additive(() => { for (let i = 0; i < 26; i++) { const life = .16 + rnd(i * 3.1) * .14, ph = ((t + rnd(i * 7.7) * 3) % life) / life, k = rnd(i * 5.3 + Math.floor((t + rnd(i * 7.7) * 3) / life) * 3.7) * 2 - 1, x = k * R * .94, y = top + (1 - Math.sqrt(Math.max(0, 1 - k * k))) * (ey - top) * .9; lite(mix(rim, [255, 255, 255], .4), x, y - ph * 14, 5 + ph * 12, .8 * o.rain * (1 - ph)); } });
    ctx.strokeStyle = rgba(mix(PAL.rainB, rim, .4), .7 * o.rain); ctx.lineWidth = 2.4;
    for (let i = 0; i <= n; i++) { const x1 = -R + i * 2 * R / n, ph = (t * 1.7 + rnd(i * 4.3)) % 1; ctx.beginPath(); ctx.moveTo(x1, ey + ph * ph * 230); ctx.lineTo(x1, ey + ph * ph * 230 + 16 + ph * 30); ctx.stroke(); }
  }
  ctx.restore();
}
// a grown-up walking on ground g, phase ph: returns the pose. o: s, hold (near hand up, holding an umbrella), lean
function schWalker(x, g, ph, d, o = {}) {
  const s = o.s || 1, hy = g - 190 * s - Math.abs(Math.sin(ph)) * 5 * s;
  return schMan({ hip: [x, hy], s, dir: d, lean: o.lean ?? .05, neck: o.neck || 0, feet: stride(x, g, ph, 46 * s, 20 * s, d),
    hr: [o.hold ? [34, 60] : [10 - Math.sin(ph) * 36, 148], o.hr1 || [-6 + Math.sin(ph) * 36, 148]] });
}

// water thrown up where something lands: a ring and a crown of drops (age in seconds)
function schSplash(x, y, age, k = 1, col = [226, 236, 255]) {
  if (age < 0 || age > .45) return;
  const q = age / .45;
  ctx.strokeStyle = rgba(col, .85 * (1 - q)); ctx.lineWidth = 3 * k * (1 - q) + 1;
  ctx.beginPath(); ctx.ellipse(x, y, (14 + 120 * E.out(q)) * k, (4 + 30 * E.out(q)) * k, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = rgba(col, .95 * (1 - q));
  for (let i = 0; i < 10; i++) { const a = -Math.PI * (.1 + .8 * (i + .5) / 10), v = (150 + rnd(i * 3.7) * 190) * k; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * v * age * 1.2, y + Math.sin(a) * v * age * 1.7 + 950 * k * age * age, 3.2 * k, 5.2 * k, 0, 0, TAU); ctx.fill(); }
}
// a long shadow thrown to the right by the low sun: any pose with parts and a head, standing on ground g
function schShadow(P, g, k = 1.3, a = .26, col = [110, 50, 90]) {
  ctx.save(); ctx.transform(1, 0, -k, .34, k * g, .66 * g); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [pts, w] of P.parts) stroke(pts, w, rgba(col)); disc(P.head[0], P.head[1], P.head[2], rgba(col)); ctx.restore();
}
const schLilyParts = P => ({ parts: [[P.legs[0], 14 * P.s], [P.legs[1], 13 * P.s], [[P.hip, P.sh], 66 * P.s]], head: [P.head[0], P.head[1], P.head[2] * 1.2] });
// a closed yellow umbrella (his, for her) from the handle a to the tip b
function schBrollyShut(a, b, lit = 1) {
  const d = v2.sub(b, a), Ln = v2.len(d) || 1, u = [d[0] / Ln, d[1] / Ln], n = [-u[1], u[0]], P = k => [a[0] + u[0] * Ln * k, a[1] + u[1] * Ln * k];
  const Y = mix([110, 80, 12], PAL.yellow, lit), YD = mix([70, 46, 8], PAL.yellowD, lit), wood = [58, 36, 26];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke([P(-.1), P(.2)], 7, rgba(wood));
  const h = P(-.1), ang = Math.atan2(n[1], n[0]); ctx.strokeStyle = rgba(wood); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(h[0] + n[0] * 11, h[1] + n[1] * 11, 11, ang + Math.PI, ang + Math.PI * 2.1, u[0] * n[1] - u[1] * n[0] > 0); ctx.stroke();
  poly(stripPts([P(.1), P(.26), P(.7), P(.94)], [6, 16, 12, 3]), rgba(Y));
  poly(stripPts([P(.12), P(.3), P(.7), P(.93)].map(q => [q[0] + n[0] * 6, q[1] + n[1] * 6]), [2, 6, 5, 1]), rgba(YD, .75));
  stroke([P(.16), P(.92)].map(q => [q[0] - n[0] * 5, q[1] - n[1] * 5]), 2.5, rgba(PAL.yellowL, .8 * lit));
  stroke([v2.add(P(.5), v2.mul(n, 13)), v2.add(P(.5), v2.mul(n, -13))], 6, rgba(YD));
  stroke([P(.94), P(1)], 4, rgba(wood));
}
// the teacher: a grown woman, hair in a bun, a long muted coat. o: schMan numbers; L: phone 0-1 (in her near hand, lit)
function schTeacher(o, T, L = {}) {
  const M = schMan(Object.assign({ s: .97 }, o));
  schAdult(M, { coat: [36, 82, 96], bun: 1, scarf: [96, 78, 146], rim: L.rim || T.lightC, ra: L.ra ?? .5, lx: L.lx ?? 1, ly: L.ly ?? -.7, hem: 1.64 });
  if (L.phone > .01) { const [x, y] = M.j.handN, d = M.d;
    ctx.save(); ctx.translate(x - d * 5, y - 12); ctx.rotate(-.32 * d); ctx.fillStyle = rgba([14, 16, 28]); rrect(-8, -24, 16, 46, 4); ctx.fill(); ctx.fillStyle = rgba([196, 224, 255], .95 * L.phone); rrect(d > 0 ? -8 : 4, -21, 4, 40, 2); ctx.fill(); ctx.restore();
    additive(() => { lite([160, 200, 255], x - d * 12, y - 14, 34, .45 * L.phone); lite([226, 240, 255], x - d * 11, y - 14, 9, .8 * L.phone); }); }
  return M;
}
const schCoats = { teal: [38, 84, 92], violet: [78, 60, 118], blue: [58, 78, 118], tealB: [48, 104, 112], violetB: [96, 76, 144], blueB: [70, 92, 136] };

// ---------- LILYOUT: the doors open, the children run out, Lily comes out last and looks for him ----------
shot('lilyout', (t, p, L, len) => {
  const u = L / len;
  fill([40, 30, 80], [20, 16, 50]);
  kcam(L, len, [[0, 1.12, 960, 322], [1, 1.36, 974, 366]], { hand: .35, t });
  schSet(t, { tod: 'dusk', door: .5 + .5 * seg(u, 0, .14, E.out), hall: 1, lit: 'all', fg: 'branchR' }, T => {
    const C = schCoats, kids = [[-1, -.2, 1.34, C.teal, C.violetB], [1, -.06, 1.46, C.violet, null], [-1, .14, 1.28, C.blue, null], [1, .27, 1.38, C.teal, C.blueB]];
    for (const [sd, u0, s, coat, hat] of kids) {                           // out of the door, down the steps, away
      const k = (u - u0) / .7; if (k < 0 || k > 1.3) continue;
      const x = 960 + sd * (26 + 760 * k * (.75 + .25 * k)), y = schYf(6 - 6.4 * inv(.14, .78, k));
      const P = lily({ at: [x, y], s, dir: sd, pose: 'run', ph: k * 26 + sd, lean: .22, swing: Math.sin(k * 26 + sd) * .9 });
      schKid(P, { coat, hat, bag: mix(coat, [10, 10, 30], .45), rim: T.lightC, ra: .7, lx: -sd });
    }
    // Lily, last: she stops on the top step, looks left, then right with a hand over her eyes
    const wk = seg(u, .3, .6, E.out), lookL = seg(u, .64, .75), lookR = seg(u, .82, .93), hd = lerp(lerp(.45, -1, lookL), 1, lookR), d = hd < 0 ? -1 : 1;
    const x = lerp(946, 990, wk), y = lerp(552, 580, wk), ph = wk * 11, mv = 1 - seg(u, .54, .62), toe = Math.max(lookL, lookR) * 6;
    if (u > .26) {
      const o = schLStand(x, y, d, { s: schG.ls * lerp(.95, 1, wk), look: hd * 6, lean: .05 * Math.abs(hd) * seg(u, .6, .7) });
      o.feet = [[x + 11 + Math.sin(ph) * 16 * mv, y - Math.max(0, Math.cos(ph)) * 9 * mv], [x - 11 - Math.sin(ph) * 16 * mv, y - Math.max(0, -Math.cos(ph)) * 9 * mv]];
      o.hip[1] -= toe + Math.abs(Math.sin(ph)) * 3 * mv; o.hr = [[lerp(5, 20, lookR), lerp(62, 46, lookR)], [4, 61]];
      ctx.save(); ctx.globalAlpha = seg(u, .26, .34);
      schDrawLily(schLily(o), schLex('hope', 'worry', .3 * lookR, { gx: .8, gy: -.05, brow: .45 + .3 * lookR }), { a: 1, turn: Math.abs(hd) * .78, rim: T.lightC, glow: .4 });
      ctx.restore();
    }
  });
  stamp(L, '5:30 PM');
}, { bloom: .4, grain: .5 }, [560, 120, 1380, 980]);

// ---------- LILYA: dusk. The others go home under umbrellas; she waves a friend goodbye and sits down to wait ----------
shot('lilyA', (t, p, L, len) => {
  const u = L / len, rk = p.rain ?? .1, C = schCoats;
  fill([40, 30, 80], [20, 16, 50]);
  kcam(L, len, [[0, .8, 960, 392], [1, .95, 1050, 430]], { hand: .3, t });
  schSet(t, { tod: 'dusk', door: 0, hall: 1, lit: 'all', rain: rk, fg: 'branchL' }, T => {
    const sit = seg(u, .5, .8), wave = pulse(u, 0, .46, .01, .1), wv = Math.sin(L * 15) * 10;
    const A = schLStand(1180, 580, -1, { hr: [[lerp(5, 34, wave) + wv * wave, lerp(62, -54, wave)], [4, 61]], look: -3, lean: .05 * wave });
    const B = schLSit(1180, 590, -1, { look: -6, nod: 1 });
    const o = schMix(A, B, sit); o.pose = sit > .5 ? 'sit' : 'stand'; o.hip[1] += Math.sin(L * 2.4) * 1.2;
    schDrawLily(schLily(o), schLex('happy', 'hope', seg(u, .36, .6), { gx: .8 }), { a: 1, turn: .8, rim: T.lightC, glow: .45 });
    // her friend and a parent going off to the left; the friend waves back
    const g = 1052, xa = lerp(560, 150, u), ph = L * 6.2;
    const M1 = schWalker(xa, g, ph, -1, { hold: 1 }); schAdult(M1, { coat: C.violet, rim: T.lightC, ra: .6, lx: 1, hat: [50, 40, 84] });
    const kid = lily({ at: [xa + 104, g + 6], s: 1.5, dir: -1, pose: 'walk', ph: ph * 1.5, look: 7, arms: u < .52 ? [[xa + 104 + 34 + Math.sin(L * 15) * 9, g - 258], null] : [null, null] });
    schKid(kid, { coat: C.blue, hat: C.violetB, bag: [40, 50, 90], rim: T.lightC, ra: .7, lx: 1 });
    schBrolly(M1.j.handN[0], M1.j.handN[1], { R: 176, col: C.violetB, rim: T.lightC, ra: .6, tilt: -.06, rain: rk, t });
    // more of them leaving on the right
    const xb = lerp(1560, 1960, u);
    schKid(lily({ at: [xb - 96, g + 16], s: 1.42, dir: 1, pose: 'walk', ph: ph * 1.5 + 1 }), { coat: C.teal, bag: [40, 60, 90], rim: T.lightC, ra: .7, lx: -1 });
    const M2 = schWalker(xb, g + 12, ph + 2, 1, { hold: 1 }); schAdult(M2, { coat: C.teal, rim: T.lightC, ra: .6, lx: -1, bun: 1 });
    schBrolly(M2.j.handN[0], M2.j.handN[1], { R: 176, col: C.tealB, rim: T.lightC, ra: .6, tilt: .06, rain: rk, t });
    const xc = lerp(2060, 2480, u), M3 = schWalker(xc, g - 30, ph + 4, 1, { hold: 1 }); schAdult(M3, { coat: C.blue, rim: T.lightC, ra: .5, lx: -1 });
    schBrolly(M3.j.handN[0], M3.j.handN[1], { R: 166, col: C.blueB, rim: T.lightC, ra: .6, tilt: .04, rain: rk, t });
  });
  stamp(L, '5:45 PM');
}, { bloom: .4, grain: .5 }, [860, 300, 1560, 900]);

// ---------- LILYB: the first rain. The teacher comes out, looks at her watch, at Lily, and calls; the street lamp comes on ----------
shot('lilyB', (t, p, L, len) => {
  const u = L / len;
  fill([14, 14, 46], [8, 8, 30]);
  kcam(L, len, [[0, .96, 1130, 336], [1, 1.05, 1150, 340]], { hand: .3, t });
  const lamp = u < .44 ? 0 : u < .68 ? (noise1(t * 30, 3) > -.1 ? .3 + .6 * inv(.44, .68, u) : .05) : 1 - .05 * Math.abs(Math.sin(t * 37)) * inv(.9, .68, u);
  const rk = lerp(.3, .55, u);
  schSet(t, { tod: ['dusk', 'eve', .78], door: .42 * (1 - seg(u, .05, .4)), hall: .8, lit: [0, 1, 6], lamp, rain: rk, fg: 'branchR', mist: .6 }, T => {
    // the teacher: out of the door to stand behind Lily
    const wk = seg(u, 0, .26, E.out), x = lerp(1004, 1088, wk), g = 562, ph = wk * 7;
    const walk = { hip: [x, g - 188 - Math.abs(Math.sin(ph)) * 5], feet: stride(x, g, ph, 40, 16, 1), lean: .06, neck: 0, dir: 1, hr: [[10 - Math.sin(ph) * 30, 148], [-6 + Math.sin(ph) * 30, 148]] };
    const stand = schMStand(1088, g, 1, { hip: [1088, g - 190] });
    const watch = schMix(stand, { hr: [[10, 150], [64, 62]], neck: .42, lean: .04 }, 1), down = schMix(stand, { hr: [[10, 150], [30, 138]], neck: .62, lean: .09 }, 1);
    const call = schMix(stand, { hr: [[40, -34], [-6, 150]], neck: .3, lean: .05 }, 1);
    const o = u < .26 ? walk : schKeys(u, [[.26, stand], [.4, watch], [.5, watch], [.62, down], [.7, down], [.86, call], [1, call]]);
    o.hip = [o.hip[0], o.hip[1] + Math.sin(L * 2) * 1.2];
    const M = schTeacher(o, T, { phone: seg(u, .74, .84), rim: mix(T.lightC, PAL.lamp, lamp), ra: .45 + .3 * lamp, lx: 1, ly: -.8 });
    if (u > .3 && u < .6) { const [wx, wy] = M.j.handF; disc(wx - 6, wy - 3, 6, rgba(PAL.brass)); additive(() => lite([255, 240, 220], wx - 6, wy - 4, 16, .7 * pulse(u, .36, .5, .04, .06))); }   // her watch
    // Lily, still looking down the road
    const B = schLSit(1180, 590, -1, { look: -6 - seg(u, .3, .6) * 2, nod: 1 + seg(u, .2, .5) * 2, lean: .06 + .1 * seg(u, .15, .5) });
    B.hip[1] += Math.sin(L * 2.2 + 1) * 1.2;
    schDrawLily(schLily(B), schBlink(schLex('hope', 'worry', .35 + .5 * u, { gx: .85 }), u, .56, .1), { a: .86 + .14 * lamp, turn: .82, rim: mix(T.lightC, PAL.lamp, lamp), glow: .35 + .25 * lamp, wet: rk });
  });
  stamp(L, '6:20 PM');
}, { bloom: .42, grain: .5 }, [760, 150, 1480, 940]);

// ---------- LILYC: full night, hard rain. One window, the lamp, the teacher's umbrella; Lily hugs her knees ----------
shot('lilyC', (t, p, L, len) => {
  const u = L / len, s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .94, 1150, 330], [1, 1.12, 1150, 352]], { hand: .25, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', door: 0, hall: .12, lit: 'one', lamp, rain: .95, fg: 'branchL', mist: 1 }, T => {
    const o = schMStand(1076, 562, 1, { hip: [1076, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [[40, -34], [74, 60]], neck: .3 + .1 * Math.sin(L * 1.3), lean: .04 });
    const M = schTeacher(o, T, { phone: 1, rim: PAL.lamp, ra: .7, lx: 1, ly: -.9 });
    // Lily: knees hugged, her chin on them; a shiver, and one look down the road
    const lookUp = pulse(u, .4, .74, .12, .14), sh = Math.sin(L * 33) * .7 * pulse(u, .08, .3, .05, .1);
    const B = { hip: [1190 + sh, 588 - 6 * s], feet: [[1190 - 31 * s, 586], [1190 - 25 * s, 586]], lean: .3 - .08 * lookUp, neck: .75 - .6 * lookUp, look: -2 * lookUp, nod: 12 - 10 * lookUp, dir: -1, s, hr: [[31, 46], [26, 44]], pose: 'sit' };
    ctx.save(); ctx.beginPath(); ctx.rect(600, 0, 1200, 596); ctx.clip();
    schDrawLily(schLily(B), schLex('blank', 'worry', lookUp, { gx: .7 * lookUp, gy: .7 - .6 * lookUp }), { a: 1, turn: .8, rim: PAL.lamp, glow: .8, wet: 1 });
    ctx.restore();
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.05 + Math.sin(L * 1.1) * .012, rain: 1, t, n: 8 });
  });
  stamp(L, '7:30 PM');
}, { bloom: .42, grain: .55 }, [700, 120, 1500, 960]);

// ---------- LILYFACE: her face in the hood, the rain, the lamp out of focus behind. p.ex 'worry' (default) | 'hurt' ----------
shot('lilyface', (t, p, L, len) => {
  const u = L / len, hurt = (p.ex || 'worry') === 'hurt';
  fill([18, 20, 66], [8, 10, 36]);
  kcam(L, len, hurt ? [[0, 1, 960, 540], [1, 1.13, 1000, 520]] : [[0, 1.03, 960, 540], [1, 1.08, 930, 536]], { hand: .3, t });
  // the night behind her, far out of focus: the lamp and its cone, a lit window, the wet steps
  ctx.fillStyle = lg(0, 700, 0, 1300, [[0, [30, 34, 96], 0], [1, [44, 46, 120], .9]]); ctx.fillRect(-600, 700, 3200, 700);
  const lx = hurt ? 420 : 1540, ly = 150;
  blurred(26, () => { rectf(hurt ? 1480 : 150, 260, 210, 420, rgba([255, 160, 110], .5)); });
  cone(lx, ly, 60, 760, 1300, PAL.lamp, .16, hurt ? 260 : -260);
  additive(() => { lite(PAL.lamp, lx, ly, 760, .5); lite(PAL.lamp, lx, ly, 260, .8); });
  bokeh(hurt ? 21 : 5, 9, [-100, 120, 2020, 900], [PAL.lamp, [150, 170, 255], [255, 170, 130]], 46, 110, .3, t);
  rain(t, { n: 90, len: 150, a: .2, w: 3, seed: 3, slant: .16 });
  kcam(L, len, hurt ? [[0, 1, 960, 540], [1, 1.13, 1000, 520]] : [[0, 1.03, 960, 540], [1, 1.08, 930, 536]], { hand: .3, t });
  const x = hurt ? 1000 : 930, y = 560 + Math.sin(L * 2.1) * 4, r = hurt ? 258 : 246, tr = hurt ? .3 : .56;
  let ex;
  if (hurt) ex = schBlink(schLex('worry', 'hurt', .55 + .45 * seg(u, 0, .5), { gx: .55, gy: .55, smile: -.62 - .1 * Math.sin(L * 16) * seg(u, .3, .8), tear: seg(u, .2, .9), lid: .16 }), u, .5, .12);
  else ex = schBlink(schLex('hope', 'worry', .5 + .5 * seg(u, 0, .6), { gx: .95, gy: .12, smile: -.48 }), u, .58, .16);
  additive(() => lite(PAL.lamp, x + (hurt ? -r : r) * 1.0, y - r * .9, r * 1.5, .3));
  lilyBust(x, y, r, ex, { a: 1, rim: PAL.lamp, turn: tr, dir: -1, wet: 1, t, glow: .5, tilt: hurt ? .03 : -.02 + Math.sin(L * 1.3) * .01 });
  // the lamp on the edge of her hood, rain running off it
  ctx.strokeStyle = rgba([255, 240, 214], .75); ctx.lineWidth = r * .035; ctx.lineCap = 'round';
  ctx.beginPath(); if (hurt) ctx.arc(x, y - r * .06, r * 1.29, Math.PI * 1.08, Math.PI * 1.42); else ctx.arc(x, y - r * .06, r * 1.29, Math.PI * 1.58, Math.PI * 1.92); ctx.stroke();
  ctx.fillStyle = rgba([226, 238, 255], .8);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * .1), k = (t * (.9 + rnd(i * 2.1) * .7) + rnd(i * 3.3)) % 1, hx = x + Math.cos(a) * r * 1.3, hy = y - r * .06 + Math.sin(a) * r * 1.3; ctx.beginPath(); ctx.ellipse(hx + Math.cos(a) * 6, hy + k * k * r * 1.5, r * .016, r * (.03 + .05 * k), 0, 0, TAU); ctx.fill(); }
  if (hurt) {                                                              // her eyes shine
    const R = r * 1.2, fy = y + r * .14 - .05 * R, sp = .6 + .4 * Math.sin(L * 7);
    for (const ex0 of [x - R * lerp(-.37, .25, tr), x - R * lerp(.37, .71, tr)]) {
      additive(() => { lite([255, 244, 226], ex0 - R * .03, fy + R * .035, R * .1, .55 * seg(u, .1, .5)); lite([255, 255, 255], ex0 - R * .045, fy - R * .02, R * .03, .9 * sp * seg(u, .1, .5)); });
      ctx.strokeStyle = rgba([255, 250, 240], .55 * seg(u, .15, .6)); ctx.lineWidth = R * .014; ctx.beginPath(); ctx.arc(ex0, fy - R * .02, R * .13, Math.PI * .22, Math.PI * .78); ctx.stroke();
    }
  }
  blurred(5, () => rain(t, { n: 26, len: 260, a: .3, w: 6, seed: 12, slant: .16, speed: 2600 }));
}, { bloom: .45, grain: .5 }, (t, p) => (p && p.ex === 'hurt') ? [640, 180, 1360, 960] : [570, 180, 1290, 960]);

// ---------- KNUCKLES: her small hand taps the wet stone, three times (.1, .35, .6 s) ----------
shot('knuckles', (t, p, L, len) => {
  const taps = [.1, .35, .6], jolt = Math.max(0, ...taps.map(a => L >= a ? 1 - (L - a) / .1 : 0));
  fill([12, 14, 46], [6, 8, 26]);
  kcam(L, len, [[0, 1.04, 960, 552], [1, 1.1, 946, 566]], { hand: .4, t, jolt: jolt * .35 });
  // the step, close: the riser behind, the wet tread, its edge, the dark below
  ctx.fillStyle = lg(0, -300, 0, 330, [[0, [22, 24, 66]], [1, [46, 46, 104]]]); ctx.fillRect(-600, -400, 3200, 730);
  ctx.fillStyle = lg(0, 330, 0, 850, [[0, [62, 62, 128]], [1, [104, 100, 170]]]); ctx.fillRect(-600, 330, 3200, 520);
  rectf(-600, 330, 3200, 14, lg(0, 330, 0, 344, [[0, [0, 0, 20], .5], [1, [0, 0, 20], 0]]));
  ctx.fillStyle = rgba([0, 0, 24], .2); poly([[330, 344], [350, 344], [250, 850], [222, 850]]); ctx.fill();
  rectf(-600, 850, 3200, 7, rgba([190, 190, 240], .8)); ctx.fillStyle = lg(0, 857, 0, 1300, [[0, [40, 40, 96]], [1, [14, 16, 48]]]); ctx.fillRect(-600, 857, 3200, 500);
  pool(1240, 560, 980, 250, PAL.lamp, .42); pool(1320, 600, 520, 60, PAL.lamp, .28);
  additive(() => lite(PAL.lamp, 1500, -60, 900, .35));
  ripples(t, -200, 2100, 380, 820, 16, [200, 214, 255], .55, 4);
  const hgt = L < .1 ? 64 * (1 - Math.pow(L / .1, 2)) : L < .6 ? 66 * Math.pow(Math.abs(Math.sin(Math.PI * (L - .1) / .25)), .8) : 44 * E.out(inv(.6, .8, L));
  const cx = 930 + hgt * .25, cy = 512 - hgt, sq = Math.max(0, 1 - hgt / 10) * 5;
  oval(930, 640, 190 - hgt, 26 - hgt * .12, rgba([8, 8, 30], .42));                                  // its shadow and reflection on the wet stone
  additive(() => { ctx.save(); ctx.translate(1380, 700); ctx.scale(1, .3); lite(PAL.yellow, 0, 0, 520, .16); ctx.restore(); });
  for (const a of taps) { schSplash(930, 640, L - a, 2.1, [255, 240, 220]); if (L >= a && L - a < .3) { ctx.strokeStyle = rgba([255, 244, 226], .5 * (1 - (L - a) / .3)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(930, 640, 60 + (L - a) * 1200, 14 + (L - a) * 250, 0, 0, TAU); ctx.stroke(); } }
  // the sleeve and the fist
  const el = [1900, -240], w = [cx + 150, cy - 128], ang = Math.atan2(w[1] - el[1], w[0] - el[0]), n = [-Math.sin(ang), Math.cos(ang)];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const fist = (dx, dy, g, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy + sq * .5, 132 + g, 108 + g - sq, -.35, 0, TAU); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(cx - 96 + i * 56 + dx, cy + 82 - i * 9 + dy + sq * .3, 38 + g, 42 + g - sq * .6, 0, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(cx - 118 + dx, cy + 6 + dy, 44 + g, 66 + g, .5, 0, TAU); ctx.fill();                                // the thumb
    ctx.lineWidth = 150 + 2 * g; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(cx + 40 + dx, cy - 40 + dy); ctx.lineTo(w[0] + dx, w[1] + dy); ctx.stroke(); };
  fist(7, -7, 4, rgba(PAL.lamp, .85)); fist(0, 0, 0, rgba([10, 11, 16]));
  ctx.strokeStyle = rgba([40, 40, 60], .9); ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - 68 + i * 56, cy + 52 - i * 9); ctx.lineTo(cx - 70 + i * 56, cy + 112 - i * 9); ctx.stroke(); }
  const sl = k => [lerp(w[0], el[0], k), lerp(w[1], el[1], k)];
  ctx.strokeStyle = rgba(mix(PAL.yellow, PAL.yellowL, .5)); ctx.lineWidth = 262; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(...v2.add(sl(.05), [5, -6])); ctx.lineTo(...v2.add(sl(1), [5, -6])); ctx.stroke();
  ctx.strokeStyle = lg(w[0] + n[0] * 130, w[1] + n[1] * 130, w[0] - n[0] * 130, w[1] - n[1] * 130, [[0, PAL.yellowD], [.45, PAL.yellow], [1, mix(PAL.yellow, PAL.yellowL, .25)]]); ctx.lineWidth = 256;
  ctx.beginPath(); ctx.moveTo(...sl(.05)); ctx.lineTo(...sl(1)); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.yellowD); ctx.lineWidth = 276; ctx.beginPath(); ctx.moveTo(...sl(.02)); ctx.lineTo(...sl(.085)); ctx.stroke();      // the cuff
  ctx.strokeStyle = rgba(mix(PAL.yellowD, [60, 40, 0], .3), .7); ctx.lineWidth = 8; ctx.lineCap = 'round';
  for (const k of [.3, .52]) { const a = v2.add(sl(k), v2.mul(n, 90)), b = v2.add(sl(k + .05), v2.mul(n, -30)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(sl(k + .08)[0], sl(k + .08)[1], b[0], b[1]); ctx.stroke(); }
  ctx.fillStyle = rgba([240, 246, 255], .8); for (let i = 0; i < 7; i++) { const k = .1 + rnd(i * 3.1) * .7, q = v2.add(sl(k), v2.mul(n, (rnd(i * 5.7) - .5) * 200)); ctx.beginPath(); ctx.ellipse(q[0], q[1] + ((t * 60 + i * 37) % 40), 4, 7, 0, 0, TAU); ctx.fill(); }   // rain on the sleeve
  cone(1500, -260, 80, 900, 1500, PAL.lamp, .1, -420);
  blurred(16, () => { ctx.fillStyle = rgba(PAL.yellow, .95); ctx.beginPath(); ctx.ellipse(2010, 900, 330, 520, .2, 0, TAU); ctx.fill(); });     // her coat, near the lens
  rain(t, { n: 110, len: 170, a: .3, w: 3.4, slant: .16, speed: 2500 });
}, { bloom: .45, grain: .55 }, [560, 160, 1420, 940]);

// ---------- the man at the steps, in the rain ----------
const schRimN = [200, 220, 255];                                          // the rain shots: a cool blue-white rim
// the run in from the left (x, phase), the stumble, bent with his hands on his knees
const schRunO = (x, g, ph) => ({ hip: [x, g - 176 - Math.abs(Math.cos(ph)) * 10], feet: stride(x - 10, g, ph, 84, 70, 1), lean: .36, neck: .08, dir: 1,
  hr: [[26 - Math.sin(ph) * 80, 96 - Math.max(0, -Math.sin(ph)) * 44], [26 + Math.sin(ph) * 80, 96 - Math.max(0, Math.sin(ph)) * 44]] });
function schBentO(x, g, lean = 1.1, hipY = 165, back = .1) {            // bent over, hands on his knees (found from the knees themselves)
  const o = { hip: [x, g - hipY], feet: [[x + 84, g], [x + 40, g]], lean, neck: .3, dir: 1 }, M = man(o), sh = M.j.sh;
  o.hr = [M.j.kneeN, M.j.kneeF].map(k => { const q = v2.lerp(k, o.hip, back); return [q[0] - sh[0], q[1] - sh[1] - 8]; });
  return o;
}
const schKneelO = (x, g, o = {}) => Object.assign({ hip: [x, g - 102], feet: [[x - 96, g - 10], [x - 114, g - 10]], lean: .1, neck: 0, dir: 1, hr: [[12, 148], [-4, 148]] }, o);

// ---------- ARRIVE: he runs in, stumbles to a stop at the foot of the steps; at the top, under the umbrella, she looks down at him ----------
shot('arrive', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .9, 760, 590], [.5, .88, 900, 560], [1, .94, 930, 548]], { hand: .5, t });
  const rk = lerp(.62, .4, u), lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: rk, mist: .8, fg: 'branchL' }, T => {
    // at the top: the teacher lowers the phone; Lily, beside her, looks down at him
    const see = seg(u, .36, .56);
    const o = schMStand(1272, 562, -1, { hip: [1272, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [schMix([40, -34], [10, 148], seg(u, .5, .72)), [70, 60]], neck: .2 + .25 * see, lean: .03 });
    const M = schTeacher(o, T, { phone: 1 - seg(u, .5, .62), rim: PAL.lamp, ra: .65, lx: 1, ly: -.9 });
    const B = schLStand(1150, 578, -1, { look: -5 - 2 * see, nod: 1 + 4 * see, lean: .05 * see, hr: [[lerp(5, 12, see), lerp(62, 34, see)], [4, 61]] });
    B.hip[1] += Math.sin(L * 2.2) * 1 - 3 * pulse(u, .36, .5, .04, .1);
    schDrawLily(schLily(B), schLex('worry', 'hurt', .2 + .6 * see, { gx: .6, gy: .7 * see }), { a: 1, turn: .8, rim: PAL.lamp, glow: .7, wet: .5 });
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.03 + Math.sin(L * 1.1) * .012, rain: rk, t, n: 8 });
    // him
    const k = inv(0, .44, u), x = -360 + 1070 * (1 - Math.pow(1 - k, 1.7)), ph = x / 80, hv = Math.sin(L * TAU * 2.3) * (1 - .5 * seg(u, .6, 1));
    const run = schRunO(x, g, ph), trip = { hip: [716, g - 150], feet: [[812, g], [640, g]], lean: .84, neck: -.05, dir: 1, hr: [[84, 50], [56, 100]] };
    const bent = schBentO(730, g, 1.1 + hv * .05, 165 - hv * 5), up = schBentO(730, g, .98 + hv * .04, 168 - hv * 4, .3); up.neck = -.8;
    const O = u < .44 ? run : schKeys(u, [[.44, run], [.53, trip, E.out], [.66, bent], [.78, bent], [.92, up], [1, up]]);
    const ex = schEx(schEx('strain', 'tired', seg(u, .5, .7)), 'fear', seg(u, .8, .95) * .7, { gx: .8, gy: lerp(.4, -.8, seg(u, .78, .92)), open: .22 + .16 * Math.abs(hv) });
    const P = schMan(O); drawMan(P, ex, { rim: schRimN, a: .8, lx: 1, ly: -.7, back: true, light: PAL.lamp, la: .3 });
    schSplash(700, g + 6, (u - .47) * len, 1.3); schSplash(812, g + 6, (u - .53) * len, 1.6); schSplash(770, g + 8, (u - .62) * len, 1);
    ctx.fillStyle = rgba([220, 232, 255], .8);                             // he is soaked: it runs off him
    for (let i = 0; i < 7; i++) { const q = i % 2 ? P.j.elN : i % 3 ? P.head : P.j.handF, kk = (t * 1.6 + rnd(i * 2.7)) % 1; ctx.beginPath(); ctx.ellipse(q[0] + (rnd(i * 4.1) - .5) * 50, q[1] + 20 + kk * kk * 150, 2.6, 5, 0, 0, TAU); ctx.fill(); }
  });
  stamp(L, '7:45 PM');
}, { bloom: .42, grain: .55 }, (t, p, L, len) => { const u = L / len; return [lerp(200, 520, clamp(u * 2)), 120, lerp(1100, 1400, clamp(u * 2)), 1000]; });

// Lily coming down one step at a time: c from the tread she starts on down to the one she stops on (each unit one step)
function schLilyDown(x0, k0, c, dx, o = {}) {
  const s = schG.ls, n = Math.floor(c), q = c - n, ka = k0 - n, kb = ka - 1, xa = x0 + dx * n, xb = xa + dx, ya = schY(ka), yb = schY(kb);
  const lead = E.io(inv(0, .45, q)), trail = E.io(inv(.5, .95, q)), body = E.io(inv(.12, .7, q));
  const f0 = [lerp(xa, xb, lead) - 7 * s, lerp(ya, yb, lead) - Math.sin(Math.PI * lead) * 12], f1 = [lerp(xa, xb, trail) + 7 * s, lerp(ya, yb, trail) - Math.sin(Math.PI * trail) * 12];
  return Object.assign({ hip: [lerp(xa, xb, body), lerp(ya, yb, body) - 57.6 * s + Math.sin(Math.PI * body) * 5], feet: [f0, f1], lean: .03, neck: 0, look: 0, nod: 0, dir: -1, s, hr: [[5, 62], [4, 61]], pose: 'stand' }, o);
}
// ---------- KNEEL: he sinks to his knees and opens his arms; she comes down alone and stops one step short ----------
shot('kneel', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .96, 1010, 640], [1, 1.1, 975, 770]], { hand: .3, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41)), rk = .4;
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: rk, mist: .8, fg: 'branchR' }, T => {
    pool(1000, 1010, 330, 60, PAL.lamp, .3);
    const o = schMStand(1272, 562, -1, { hip: [1272, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [[10, 148], [70, 60]], neck: .42, lean: .04 });
    const M = schTeacher(o, T, { rim: PAL.lamp, ra: .65, lx: 1, ly: -.9 });
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.02, rain: rk, t, n: 8 });
    // him: down on his knees, his arms open to her
    const st = schMStand(764, g, 1, { hip: [764, g - 180], feet: [[790, g], [744, g]], lean: .34, neck: -.56, hr: [[-6, 146], [-22, 140]] }), kn = schKneelO(790, g, { neck: -.12, lean: .1 });
    const open = schMix(kn, { hr: [[108, 66], [126, 22]], lean: .16 }, 1), sag = schMix(kn, { hr: [[100, 82], [112, 46]], lean: .13, neck: -.04 }, 1);
    const O = schKeys(u, [[0, st], [.22, kn, E.io], [.44, open, E.out], [.76, open], [1, sag]]);
    O.hip = [O.hip[0], O.hip[1] + Math.sin(L * 2.6) * 1.6]; O.hr = O.hr.map((h, i) => [h[0], h[1] + Math.sin(L * 9 + i) * 1.5 * seg(u, .44, .6)]);
    const ex = schEx('ashamed', 'fear', .25, { gx: .85, gy: -.1, brow: .95, browH: .12, lid: .2, smile: -.35 + .3 * pulse(u, .3, .7, .1, .15), open: .1 });
    drawMan(schMan(O), schBlink(ex, u, .6, .05), { rim: schRimN, a: .8, lx: 1, ly: -.7, back: true, light: PAL.lamp, la: .34 });
    schSplash(800, g + 6, (u - .2) * len, 1.2);
    // Lily: three steps down, slowly, and she stops out of reach
    const c = clamp((u - .05) / .7, 0, 1) * 3, stop = seg(u, .76, .9);
    const B = schLilyDown(1174, 4, Math.min(c, 2.999), -30, { look: -4, nod: 2 + 5 * stop, lean: .03 - .05 * stop });
    B.hip[1] += Math.sin(L * 2.3) * 1;
    schDrawLily(schLily(B), schLex('hurt', 'blank', .5 * stop, { gx: .5 * (1 - stop), gy: .3 + .6 * stop }), { a: 1, turn: .8, rim: PAL.lamp, glow: .75, wet: 1 });
  });
}, { bloom: .42, grain: .55 }, [480, 130, 1300, 1000]);

// his open hand at the end of his arm (close shots): wrist w, the way the forearm points (radians), open 0-1
function schHand(w, ang, open = 1, rim = null, s = 1) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pt = (a, r) => [w[0] + Math.cos(ang + a) * r * s, w[1] + Math.sin(ang + a) * r * s];
  const draw = (dx, dy, g, col) => { for (let i = 0; i < 4; i++) { const a = (i - 1.4) * .2 * (.4 + .6 * open) + .05; stroke([[w[0] + dx, w[1] + dy], [pt(a, 30)[0] + dx, pt(a, 30)[1] + dy]], 7.5 * s + g, col); }
    stroke([[w[0] + dx, w[1] + dy], [pt(-.95 - .2 * open, 19)[0] + dx, pt(-.95 - .2 * open, 19)[1] + dy]], 8 * s + g, col); };
  if (rim) draw(2.5, -2.5, 3, rgba(rim, .8));
  draw(0, 0, 0, rgba(PAL.ink));
}
// ---------- REACH: close. His hand rises toward her; she takes half a step back; his hand stops in the air and sinks ----------
shot('reach', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, 1.86, 944, 806], [1, 2.08, 950, 790]], { hand: .25, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: .34, mist: .5, soft: 6 }, T => {
    rectf(-400, 300, 2800, 1100, lg(0, 500, 0, 1100, [[0, [6, 8, 40], .62], [.6, [6, 8, 40], .3], [1, [6, 8, 40], .5]]));          // the night closes in round them
    pool(1010, 1010, 420, 76, PAL.lamp, .5); additive(() => { lite(PAL.lamp, 1040, 760, 430, .2); });
    cone(1150, 300, 60, 330, 760, PAL.lamp, .16, -150);
    const kn = schKneelO(790, g, { neck: -.1, lean: .12, hr: [[100, 82], [112, 46]] });
    const rise = schMix(kn, { hr: [[146, 50], [70, 120]], lean: .24, neck: -.14 }, 1), hang = schMix(kn, { hr: [[140, 58], [40, 138]], lean: .19, neck: -.06 }, 1);
    const drop = schMix(kn, { hr: [[34, 142], [-2, 148]], lean: .06, neck: .5, hip: [786, g - 98] }, 1);
    const O = schKeys(u, [[0, kn], [.3, rise, E.out], [.46, hang], [.66, hang], [1, drop]]);
    const tr = pulse(u, .4, .7, .06, .1); O.hr = [[O.hr[0][0] + noise1(t * 14, 2) * 3 * tr, O.hr[0][1] + noise1(t * 12, 5) * 3 * tr], O.hr[1]];
    O.hip = [O.hip[0], O.hip[1] + Math.sin(L * 2.6) * 1.4];
    const hope = { lid: .14, brow: .7, browH: .15, smile: .22, open: .1, grit: 0, gx: .85, gy: -.05, tear: 0, sweat: 0 };
    const ex = schBlink(schEx(hope, 'ashamed', seg(u, .4, .78), { tear: seg(u, .7, 1) * .8 }), u, .52, .05);
    const M = schMan(O); drawMan(M, ex, { rim: schRimN, a: .55, lx: 1, ly: -.7, back: false, light: PAL.lamp, la: .4 });
    const fa = Math.atan2(M.j.handN[1] - M.j.elN[1], M.j.handN[0] - M.j.elN[0]);
    schHand(M.j.handN, fa, 1 - .7 * seg(u, .66, 1), schRimN); schHand(M.j.handF, Math.atan2(M.j.handF[1] - M.j.elF[1], M.j.handF[0] - M.j.elF[0]), .3, null);
    // Lily: half a step back
    const bk = seg(u, .3, .5), X = 1084, bx = X + 36 * bk, y1 = schY(1);
    const B = schLStand(bx, y1, -1, { look: -4 + 5 * bk, nod: 3 + 5 * seg(u, .4, .7), lean: -.07 * bk + .03, hr: [[lerp(5, -8, bk), lerp(62, 56, bk)], [4, 61]] });
    B.feet = [[X - 7 * s + 36 * seg(u, .38, .52), y1 - Math.sin(Math.PI * seg(u, .38, .52)) * 7], [X + 7 * s + 40 * seg(u, .28, .42), y1 - Math.sin(Math.PI * seg(u, .28, .42)) * 8]];
    B.hip[1] += Math.sin(L * 2.3) * 1;
    schDrawLily(schLily(B), schBlink(schLex('hurt', 'blank', .3 * seg(u, .5, .9), { gx: .5 * (1 - bk), gy: .25 + .65 * seg(u, .3, .6) }), u, .34, .06), { a: 1, turn: .8, rim: PAL.lamp, glow: .8, wet: 1 });
  });
  blurred(5, () => rain(t, { n: 18, len: 240, a: .26, w: 6, seed: 12, slant: .16, speed: 2600 }));
}, { bloom: .42, grain: .55 }, [420, 100, 1500, 1000]);

// ---------- the sunlit shots ----------
const schRimG = [255, 196, 112];                                          // golden hour: a warm gold rim
// climbing, seen from behind: c in treads (each unit one step up); the body rises over the foot that stands
function schClimb(c, x, hipH, half) {
  const n = Math.floor(c), f = c - n, e = E.io(f), par = ((n % 2) + 2) % 2;
  const foot = pr => pr === par ? [x + (pr ? half : -half), schY(n)] : [x + (pr ? half : -half), lerp(schY(n - 1), schY(n + 1), e) - Math.sin(Math.PI * f) * 14];
  return { hipY: lerp(schY(n - 1), schY(n), e) - hipH, feet: [foot(0), foot(1)], par, f };
}
// him from behind, walking up. o: turn (his head, toward her), lift (his hand on her side, 0-1)
function schManBack(x, c, o = {}) {
  const K = schClimb(c, x, 192, 22), hip = [x + (K.par ? 1 : -1) * Math.cos(Math.PI * K.f) * 5, K.hipY], shY = hip[1] - 182, LL = 196, sw = Math.sin(c * Math.PI);
  const leg = (F, sd) => { const H = [hip[0] + sd * 20, hip[1]], d = Math.hypot(F[0] - H[0], F[1] - H[1]) || 1, k = Math.min(1, LL / d), ft = [H[0] + (F[0] - H[0]) * k, H[1] + (F[1] - H[1]) * k], bend = Math.sqrt(Math.max(0, LL * LL - Math.pow(Math.min(d, LL), 2))) * .05;
    return [H, [(H[0] + ft[0]) / 2 + sd * bend, (H[1] + ft[1]) / 2 - bend * .4], ft]; };
  const arm = (sd, lift) => [[hip[0] + sd * 46, shY + 14], [hip[0] + sd * (58 + lift * 12), shY + 98 - lift * 6], [hip[0] + sd * (60 + lift * 30), shY + 172 - Math.max(0, sd * sw) * 14 - lift * 24]];
  return { head: [hip[0] + (o.turn || 0) * 15, shY - 66, 40], hip, shY, handR: arm(1, o.lift || 0)[2],
    parts: [[leg(K.feet[0], -1), 34], [leg(K.feet[1], 1), 34], [[[hip[0], hip[1] - 8], [hip[0], shY + 10]], 74], [[[hip[0] - 40, shY + 8], [hip[0] + 40, shY + 8]], 34], [arm(-1, 0), 22], [arm(1, o.lift || 0), 22]] };
}
// Lily from behind, walking up, her school bag on her back. o: turn (her hood, -1 toward him on her left), bag (colour)
function schLilyBack(x, c, o = {}) {
  const s = schG.ls, K = schClimb(c, x, 54 * s, 9 * s), Y = PAL.yellow, YD = PAL.yellowD, YL = mix(Y, PAL.yellowL, .6), ink = PAL.ink;
  const hipY = Math.min(K.hipY, Math.min(K.feet[0][1], K.feet[1][1]) - 32 * s), shY = hipY - 62 * s, r = 31 * s, hx = x + (o.turn || 0) * 8 * s, hy = shY - 33 * s, bg = o.bag || [58, 122, 132];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  K.feet.forEach((F, i) => { const H = [x + (i ? 9 : -9) * s, hipY]; stroke([H, [(H[0] + F[0]) / 2 + (i ? 3 : -3) * s, (H[1] + F[1]) / 2], F], 13 * s, rgba(ink)); stroke([[F[0], F[1] - 1 * s], [F[0], F[1] - 8 * s]], 16 * s, rgba(i ? Y : YD)); });
  stroke([[x - 25 * s, shY + 8 * s], [x - 35 * s, shY + 54 * s]], 14 * s, rgba(YD)); disc(x - 36 * s, shY + 61 * s, 6.5 * s, rgba(ink));
  stroke([[x + 25 * s, shY + 8 * s], [x + 35 * s, shY + 54 * s]], 14 * s, rgba(mix(Y, YD, .4))); disc(x + 36 * s, shY + 61 * s, 6.5 * s, rgba(ink));
  ctx.fillStyle = lg(x - 40 * s, 0, x + 40 * s, 0, [[0, YD], [.45, Y], [1, YL]]);
  ctx.beginPath(); ctx.moveTo(x - 22 * s, shY - 4 * s); ctx.lineTo(x + 22 * s, shY - 4 * s); ctx.quadraticCurveTo(x + 30 * s, shY + 34 * s, x + 40 * s, hipY + 26 * s); ctx.quadraticCurveTo(x, hipY + 37 * s, x - 40 * s, hipY + 26 * s); ctx.quadraticCurveTo(x - 30 * s, shY + 34 * s, x - 22 * s, shY - 4 * s); ctx.fill();
  poly([[hx - r * .95, hy + r * .5], [hx + r * .95, hy + r * .5], [x + 25 * s, shY + 8 * s], [x - 25 * s, shY + 8 * s]], rgba(Y));
  ctx.fillStyle = rgba(bg); rrect(x - 21 * s, shY + 4 * s, 42 * s, 47 * s, 9 * s); ctx.fill();                                  // the school bag
  ctx.fillStyle = rgba(mix(bg, [255, 255, 255], .2)); rrect(x - 21 * s, shY + 4 * s, 42 * s, 18 * s, 8 * s); ctx.fill();
  rectf(x - 4 * s, shY + 18 * s, 8 * s, 8 * s, rgba(mix(bg, [10, 10, 30], .5)));
  ctx.fillStyle = lg(hx - r * 1.2, 0, hx + r * 1.2, 0, [[0, YD], [.4, Y], [1, YL]]); ctx.beginPath(); ctx.ellipse(hx, hy - 2 * s, r * 1.2, r * 1.26, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(YD, .5); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(hx, hy - r * 1.24); ctx.quadraticCurveTo(hx + (o.turn || 0) * 3 * s, hy, hx, hy + r * .9); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.yellowL, .9); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(hx, hy - 2 * s, r * 1.14, -Math.PI * .42, Math.PI * .1); ctx.stroke();
  return { hipY, shY, feetY: Math.max(K.feet[0][1], K.feet[1][1]) };
}

// ---------- SCHOOLAM: a bright morning, weeks later. He walks her up the steps, side by side, not hand in hand ----------
shot('schoolam', (t, p, L, len) => {
  const u = L / len, C = schCoats;
  fill([150, 200, 240], [224, 238, 246]);
  kcam(L, len, [[0, .86, 960, 566], [1, .99, 975, 476]], { hand: .3, t });
  schSet(t, { tod: 'morning', door: 1, hall: .5, lit: 'none', fg: 'branchL' }, T => {
    // other children arrive
    const ka = lerp(590, 760, u), P1 = lily({ at: [ka, 572], s: 1.3, dir: 1, pose: 'walk', ph: L * 11 });
    schKid(P1, { coat: C.violet, bag: [70, 60, 110], hat: C.tealB, rim: T.lightC, ra: .8, lx: 1 });
    const kb = inv(-.1, .95, u), P2 = lily({ at: [lerp(1560, 1210, kb), schYf(6.2 * kb)], s: 1.4, dir: -1, pose: 'run', ph: L * 15, lean: .2, swing: Math.sin(L * 15) * .8 });
    schKid(P2, { coat: C.teal, bag: [40, 60, 90], rim: T.lightC, ra: .8, lx: 1 });
    const P3 = lily({ at: [lerp(120, 330, u), 1052], s: 1.5, dir: 1, pose: 'walk', ph: L * 11 + 2 });
    schKid(P3, { coat: C.blue, bag: [60, 80, 60], hat: C.violetB, rim: T.lightC, ra: .8, lx: 1 });
    const M3 = schMan({ hip: [20, 1056 - 194], feet: [[26, 1056], [6, 1056]], dir: 1, lean: .02, hr: [[40 + Math.sin(L * 12) * 12, -70], [-6, 150]], s: 1 });
    schAdult(M3, { coat: C.blue, rim: T.lightC, ra: .7, lx: 1, bun: 1, scarf: [150, 110, 150] });
    // the two of them, from behind
    const c = lerp(1.15, 4.0, u), xm = 880, xl = 1066, glance = pulse(u, .34, .78, .12, .14), peek = pulse(u, .56, .92, .1, .08);
    const M = schManBack(xm, c, { turn: .9 * glance, lift: .7 * pulse(u, .4, .64, .1, .12) });
    oval(xm - 40, M.hip[1] + 196, 90, 12, rgba([40, 30, 70], .22)); 
    drawMan(M, 'calm', { face: false, rim: T.lightC, a: .75, lx: 1, ly: -.6, back: false });
    const lb = schClimb(c + .5, xl, 54 * schG.ls, 9 * schG.ls); oval(xl - 20, Math.max(lb.feet[0][1], lb.feet[1][1]) + 4, 60, 9, rgba([40, 30, 70], .2));
    schLilyBack(xl, c + .5, { turn: -peek });
  });
  motes(t, [0, 0, 1920, 1080], 16, [255, 250, 230], .3, 5);
  stamp(L, '8:00 AM', 'DAY 45');
}, { bloom: .22, grain: .45 }, [560, 140, 1380, 1000]);

// his closed umbrella tucked under his near arm: from his hand up and back past his armpit
function schTucked(M) {
  const h = M.j.handN, u = [-.985 * M.d, .17];
  return [[h[0] - u[0] * 44, h[1] - u[1] * 44], [h[0] + u[0] * 236, h[1] + u[1] * 236]];
}
// drifting leaves in the low sun (never yellow: rust and olive)
function schLeaves(t, n = 9) {
  for (let i = 0; i < n; i++) { const k = (t * (.05 + rnd(i * 2.1) * .04) + rnd(i * 5.3)) % 1, x = rnd(i * 3.7) * 2200 - 100 + Math.sin(t * .8 + i) * 60 + k * 240, y = -80 + k * 1250;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * (1 + rnd(i)) + i); ctx.scale(1, .5 + .5 * Math.sin(t * 2 + i)); ctx.fillStyle = rgba(i % 2 ? [214, 112, 60] : [150, 132, 70], .9); ctx.beginPath(); ctx.ellipse(0, 0, 13, 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
// ---------- GOLDWAIT: golden hour. He is early: he looks at his watch, then up at the doors, her umbrella under his arm ----------
shot('goldwait', (t, p, L, len) => {
  const u = L / len, g = schY(0);
  fill([255, 204, 156], [240, 170, 130]);
  kcam(L, len, [[0, 1.08, 930, 650], [1, 1.15, 950, 630]], { hand: .25, t });
  schSet(t, { tod: 'gold', door: 0, hall: .3, lit: 'none', fg: 'branchL' }, T => {
    const st = schMStand(742, g, 1, { hr: [[36, 104], [-6, 150]] });
    const watch = schMix(st, { hr: [[36, 104], [62, 66]], neck: .46, lean: .03 }, 1), look = schMix(st, { neck: -.34, lean: -.035, hip: [747, g - 197] }, 1);
    const O = schKeys(u, [[0, watch], [.4, watch], [.58, st], [.8, look], [1, look]]);
    O.hip = [O.hip[0] + Math.sin(L * 1.1) * 2, O.hip[1] + Math.sin(L * 2) * 1.3];
    const M = schMan(O), up = seg(u, .58, .8);
    schShadow(M, g + 6);
    const ex = schBlink(schEx('calm', 'smile', .2 + .4 * seg(u, .78, 1), { gx: lerp(.5, .8, up), gy: lerp(.85, -.7, up) }), u, .5, .07);
    drawMan(M, ex, { rim: schRimG, a: .9, lx: -1, ly: -.35, back: false, light: [255, 214, 160], la: .34 });
    const [a, b] = schTucked(M); schBrollyShut(a, b, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(q => [q[0] - 4, q[1] - 2]), 5, rgba(schRimG, .5));
    const w = M.j.handF; disc(w[0] - 9, w[1] - 4, 7, rgba(PAL.brass)); additive(() => lite([255, 244, 220], w[0] - 9, w[1] - 5, 22, .8 * pulse(u, .08, .4, .06, .1) * (.6 + .4 * Math.sin(L * 9))));      // his watch
  });
  cam(1, 960, 540); schLeaves(t, 8); motes(t, [0, 0, 1920, 1080], 22, [255, 226, 180], .4, 5);
  additive(() => lite([255, 170, 100], -260, 300, 1200, .22));
  stamp(L, '5:25 PM', 'DAY 90');
}, { bloom: .26, grain: .45 }, [500, 120, 1300, 1000]);

// ---------- JUMP: the doors burst open; she runs down and jumps from the second step; he drops the umbrella, catches her and turns ----------
shot('jump', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls, X = 742, C = schCoats;
  fill([255, 204, 156], [240, 170, 130]);
  kcam(L, len, [[0, .98, 970, 596], [.45, 1.03, 930, 640], [1, 1.26, 800, 760]], { hand: .35, t });
  const door = seg(u, .01, .09, E.out) * (1 - .1 * Math.sin(inv(.09, .26, u) * Math.PI));
  schSet(t, { tod: 'gold', door, hall: .5, lit: 'none', fg: 'branchL' }, T => {
    { const k = (u - .5) / .7; if (k > 0) schKid(lily({ at: [990 + 520 * k, schYf(6 - 4 * inv(.3, 1, k))], s: 1.22, dir: 1, pose: 'walk', ph: k * 14 }), { coat: C.teal, hat: C.blueB, bag: mix(C.teal, [10, 10, 30], .45), rim: T.lightC, ra: .8, lx: -1 }); }   // another child comes out behind her
    // him: he sees her, lets the umbrella go, opens his arms, takes her weight, turns half a circle with her
    const wait = schMStand(X, g, 1, { hr: [[36, 104], [-6, 150]], neck: -.34, lean: -.035 });
    const ready = schMix(wait, { hip: [X + 10, g - 174], feet: [[X + 48, g], [X - 30, g]], lean: .16, neck: -.24, hr: [[108, 30], [116, -4]] }, 1);
    const caught = schMix(wait, { hip: [X - 10, g - 152], feet: [[X + 38, g], [X - 58, g]], lean: -.14, neck: -.16, hr: [[84, 86], [92, 60]] }, 1);
    const hold = schMix(wait, { hip: [X, g - 195], feet: [[X + 14, g], [X - 22, g]], lean: -.08, neck: -.12, hr: [[80, 94], [90, 62]] }, 1);
    const O = schKeys(u, [[0, wait], [.24, wait], [.46, ready, E.out], [.64, ready], [.72, caught, E.out], [.88, hold], [1, hold]]);
    const th = Math.PI * E.io(inv(.73, .97, u)), c = Math.cos(th), dm = c >= 0 ? 1 : -1, swing = Math.pow(Math.max(0, Math.sin(th)), .8), held = u >= .66;
    O.hip = [X + (O.hip[0] - X) * c, O.hip[1] + Math.sin(L * 2) * 1.2 - 8 * swing]; O.feet = O.feet.map((f, i) => [X + (f[0] - X) * c, f[1] - (i ? 1 : 0) * 10 * swing]); O.dir = dm;
    const S = [O.hip[0] + Math.sin(O.lean * dm) * 172, O.hip[1] - Math.cos(O.lean) * 172];
    // her: down the steps, a crouch on the second step, the leap, his arms; then she swings round him, her legs flying
    const y2 = schY(2), XT = 1000, H0 = [XT - 8, y2 - 57.6 * s + 12], q = inv(.5, .66, u), phi = .22 * c + .9 * swing;
    const LS = [O.hip[0] + 66 * c, S[1] + 34 - 12 * swing], H1 = [LS[0] + Math.sin(phi) * 62 * s, LS[1] + Math.cos(phi) * 62 * s];
    if (held) O.hr = [[(LS[0] + 30 * c - S[0]) * dm, LS[1] + 62 - S[1]], [(LS[0] + 40 * c - S[0]) * dm, LS[1] + 34 - S[1]]];
    const M = schMan(O);
    schShadow(M, g + 6, 1.3, .26);
    // the umbrella: under his arm, then falling to the pavement behind him
    const [ua, ub] = schTucked(schMan(wait)), fall = inv(.28, .44, u), mid = v2.lerp(ua, ub, .5), a0 = Math.atan2(ub[1] - ua[1], ub[0] - ua[0]);
    const bnc = u > .44 ? Math.abs(Math.sin((u - .44) * 30)) * 20 * Math.exp(-(u - .44) * 16) : 0;
    const uc = [mid[0] - 70 * E.out(fall), lerp(mid[1], g + 18, fall * fall) - bnc], uang = lerp(a0, Math.PI + .06, E.io(fall)), hl = 140;
    const brolly = () => schBrollyShut([uc[0] - Math.cos(uang) * hl, uc[1] - Math.sin(uang) * hl], [uc[0] + Math.cos(uang) * hl, uc[1] + Math.sin(uang) * hl], 1);
    if (fall > 0) { oval(uc[0], g + 26, 150, 9, rgba([110, 50, 90], .2 * fall)); brolly(); }
    let P, ld = -1;
    if (u < .4) { const k = inv(.06, .4, u), kk = 6 - 4 * k; P = lily({ at: [lerp(1010, XT, k), schYf(kk)], s, dir: -1, pose: k < .02 ? 'stand' : 'run', ph: k * 30, lean: .2 * Math.min(1, k * 8), swing: Math.sin(k * 30) * .9 }); }
    else if (u < .5) { const k = E.out(inv(.4, .47, u)), up = seg(u, .47, .5); P = schLily({ hip: [XT - 8 * up, y2 - 57.6 * s + 24 * k - 12 * up], feet: [[XT - 7 * s, y2], [XT + 9 * s, y2]], lean: .2 + .28 * k, neck: -.3 * k, dir: -1, s, hr: [[lerp(5, -26, k), lerp(62, 48, k)], [lerp(4, -32, k), lerp(61, 42, k)]] }); }
    else if (!held) { const hp = [lerp(H0[0], H1[0], q), lerp(H0[1], H1[1], q) - 104 * Math.sin(Math.PI * q) * (1 - .2 * q)], tk = Math.sin(Math.PI * q);
      P = schLily({ hip: hp, feet: [[hp[0] + 36 + 22 * tk, hp[1] + 66 - 34 * tk], [hp[0] + 60, hp[1] + 42 - 18 * tk]], lean: lerp(.6, .22, q), neck: -.3, dir: -1, s, hr: [[46, 10], [42, 2]] }); }
    else { ld = -dm; P = schLily({ hip: H1, feet: [[H1[0] + Math.sin(phi + .22) * 84, H1[1] + Math.cos(phi + .22) * 84], [H1[0] + Math.sin(phi - .16) * 88, H1[1] + Math.cos(phi - .16) * 88]], lean: phi * dm, neck: -phi * dm * .55, dir: ld, s,
      hr: [[(O.hip[0] - 30 * c - LS[0]) * ld / s, (S[1] + 32 - LS[1]) / s], [(O.hip[0] - 8 * c - LS[0]) * ld / s, (S[1] + 22 - LS[1]) / s]], nod: 2 }); }
    const smile = seg(u, .2, .38), fold = seg(u, .68, .9);
    const exM = schEx(schEx('calm', 'smile', smile, { brow: .25 + .4 * smile, browH: .06 + .1 * smile, open: .12 + .2 * smile * (1 - fold) }), { lid: 1, brow: .8, browH: .1, smile: .6, open: 0, grit: 0, gx: 0, gy: 0, tear: 0, sweat: 0 }, fold, held ? {} : { gx: .8, gy: -.6 });
    const exL = held ? schLex('happy', 'shut', seg(u, .66, .8)) : schLex('happy', 'happy', 0, { open: .5, gx: .8, gy: .3 });
    if (u < .5) schShadow(schLilyParts(P), Math.max(P.legs[0][2][1], P.legs[1][2][1]) + 3, 1.3, .2);
    const nar = .74 + .26 * Math.abs(c);                                   // he narrows a little as he comes round
    ctx.save(); ctx.translate(O.hip[0], 0); ctx.scale(nar, 1); ctx.translate(-O.hip[0], 0);
    drawMan(M, exM, { rim: schRimG, a: .9, lx: -1, ly: -.35, back: false, light: [255, 214, 160], la: .34 });
    if (fall <= 0) { brolly(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(v => [v[0] - 4, v[1] - 2]), 5, rgba(schRimG, .5)); }
    ctx.restore();
    const backv = held && Math.abs(c) < .45;
    schDrawLily(P, exL, { a: 1, turn: .8, rim: schRimG, glow: .5, face: !backv });
    if (backv) { const [qx, qy, qr] = P.head; disc(qx, qy, qr * 1.04, rgba(PAL.yellow)); ctx.strokeStyle = rgba(PAL.yellowD, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(qx, qy - qr * 1.2); ctx.lineTo(qx, qy + qr); ctx.stroke(); }   // her hood, from behind, as she comes round
    if (held) { ctx.save(); ctx.translate(O.hip[0], 0); ctx.scale(nar, 1); ctx.translate(-O.hip[0], 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';     // his arm round her
      stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(v => [v[0] - 4, v[1] - 2]), 5, rgba(schRimG, .5)); ctx.restore(); }
  });
  cam(1, 960, 540); schLeaves(t, 8); motes(t, [0, 0, 1920, 1080], 22, [255, 226, 180], .4, 5);
  additive(() => lite([255, 170, 100], -260, 300, 1200, .22));
}, { bloom: .26, grain: .45 }, (t, p, L, len) => { const u = L / len; return [lerp(620, 380, clamp(u * 1.5)), 120, lerp(1300, 1160, clamp(u * 1.5)), 1000]; });

// ---------- HUG: the close-up the film has waited for. Her face over his shoulder, eyes shut; his folds, then smiles; one tear ----------
shot('hug', (t, p, L, len) => {
  const u = L / len;
  fill([250, 170, 120], [214, 120, 96]);
  kcam(L, len, [[0, 1.5, 820, 300], [1, 1.56, 850, 290]], { hand: .2, t });
  schSet(t, { tod: 'gold', door: .7, hall: .5, lit: 'none' });
  schSoft(22);
  const fr = kcam(L, len, [[0, 1, 960, 548], [1, 1.11, 985, 540]], { hand: .22, t });
  screen(); rectf(-2400, -2400, 6800, 6000, lg(0, 0, 1920, 0, [[0, [150, 50, 50], 0], [1, [120, 40, 60], .3]]));
  kcam(L, len, [[0, 1, 960, 548], [1, 1.11, 985, 540]], { hand: .22, t });
  additive(() => { lite([255, 170, 100], -160, 120, 1500, .34); lite([255, 210, 160], 160, 40, 560, .3); });
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-260 + i * 190, -300); ctx.rotate(-.78 - i * .05); cone(0, 0, 30, 120 + i * 30, 2300, [255, 206, 140], .07 + .03 * Math.sin(t * .7 + i * 2)); ctx.restore(); }
  bokeh(8, 9, [900, 60, 1960, 700], [[255, 214, 160], [255, 180, 130], [255, 236, 200]], 40, 100, .22, t);
  const br = Math.sin(L * 1.9) * 5, sq = seg(u, .1, .32), sm = seg(u, .48, .8);
  const hx = 772 + 10 * sq, hy = 470 + br * .6, r = 204, lx = 1180 - 16 * sq, ly = 566 + br, lr = 178, tiltM = .1 + .03 * sq, tiltL = -.17 - .04 * sq + Math.sin(L * 1.2) * .012;
  // his hand behind her hood, then him, then her
  const gold = [255, 198, 120];
  rectf(hx - r * 1.84, hy + r * 2.4, r * 3.44, 2400, rgba([22, 13, 16]));                           // (a Short's taller window sees further down)
  manBust(hx, hy, r, schEx({ lid: .66, brow: .9, browH: .1, smile: -.6, open: 0, grit: 0, gx: .3, gy: .6, tear: 0, sweat: 0 }, schEx({ lid: 1, brow: 1, browH: .13, smile: -.72 + .06 * Math.sin(L * 20), open: 0, grit: 0, gx: 0, gy: .4, tear: 0, sweat: 0 }, { lid: 1, brow: .5, browH: .09, smile: .78, open: 0, grit: 0, gx: 0, gy: .2, tear: 0, sweat: 0 }, sm), seg(u, .06, .3)),
    { fill: [22, 13, 16], rim: gold, ra: .95, lc: [-.8, -.5], light: [255, 206, 150], la: .42, turn: .72, tilt: tiltM });
  // the tear: from his eye down his cheek
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tiltM); ctx.translate(-hx, -hy);
  const tk = seg(u, .34, .86, E.io), ex0 = hx + r * lerp(-.37, .25, .72) + r * .02, ey0 = hy - .05 * r + r * .09, tx = ex0 - r * .05 * Math.sin(tk * 2.2) + r * .02 * tk, ty = ey0 + r * .5 * tk;
  if (u > .3) { const a = seg(u, .3, .4);
    ctx.strokeStyle = rgba([255, 236, 210], .3 * a); ctx.lineWidth = r * .012; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx, ty - r * .09 * Math.min(1, tk * 4)); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = rgba([255, 244, 226], .95 * a); ctx.beginPath(); ctx.ellipse(tx, ty, r * .03, r * .042, 0, 0, TAU); ctx.fill();
    additive(() => { lite([255, 214, 150], tx, ty, r * .12, .7 * a); lite([255, 255, 255], tx - r * .008, ty - r * .012, r * .022, .9 * a); }); }
  ctx.strokeStyle = rgba([255, 214, 150], .95); ctx.lineWidth = r * .04; ctx.lineCap = 'round'; ctx.shadowColor = rgba(gold, .9); ctx.shadowBlur = 26 * VP.k;      // the sun on the edge of his head
  ctx.beginPath(); ctx.arc(hx, hy, r + r * .012, Math.PI * .92, Math.PI * 1.56); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();
  additive(() => lite(gold, hx - r * .95, hy - r * .55, r * .9, .3));
  // her arm round his neck: a yellow sleeve across his chest to his far shoulder
  const Y = PAL.yellow, YD = PAL.yellowD, YL = mix(Y, PAL.yellowL, .55), s0 = [lx - lr * .62, ly + lr * 1.42], s1 = [hx + r * .1, hy + r * 1.32 + br * .3], s2 = [hx - r * .86, hy + r * 1.06];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const arm = (w, col, dy = 0) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(s0[0], s0[1] + dy); ctx.quadraticCurveTo(s1[0], s1[1] + dy, s2[0], s2[1] + dy); ctx.stroke(); };
  arm(lr * .62, rgba(YD)); arm(lr * .54, rgba(Y), -lr * .03); arm(lr * .12, rgba(YL, .8), -lr * .2);
  ctx.fillStyle = rgba([12, 10, 14]); ctx.beginPath(); ctx.ellipse(s2[0] - lr * .2, s2[1] - lr * .02, lr * .24, lr * .19, -.5, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(s2[0] - lr * (.34 + i * .02), s2[1] - lr * .16 + i * lr * .1, lr * .12, lr * .055, -.25 + i * .12, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = rgba(gold, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(s2[0] - lr * .2, s2[1] - lr * .02, lr * .25, Math.PI * 1.0, Math.PI * 1.55); ctx.stroke();
  // her
  additive(() => lite(PAL.yellow, lx, ly + lr, lr * 3.2, .22));
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(tiltL); ctx.translate(-lx, -ly); rectf(lx - lr * 2.1, ly + lr * 3.38, lr * 4.2, 2400, lg(lx - lr * 1.9, 0, lx + lr * 1.9, 0, [[0, mix(PAL.yellow, PAL.yellowL, .6)], [.5, PAL.yellow], [1, PAL.yellowD]])); ctx.restore();
  lilyBust(lx, ly, lr, schLex('shut', 'shut', 0, { smile: .42 + .4 * sm, brow: .42 - .1 * sm, browH: .08 }), { a: 1, rim: [255, 214, 160], turn: .22, dir: -1, tilt: tiltL, glow: .3 });
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(tiltL); ctx.translate(-lx, -ly);                // the sun on the top of her hood
  ctx.strokeStyle = rgba([255, 244, 214], .9); ctx.lineWidth = lr * .05; ctx.beginPath(); ctx.arc(lx, ly - lr * .06, lr * 1.29, Math.PI * 1.12, Math.PI * 1.62); ctx.stroke();
  additive(() => lite(gold, lx - lr * .7, ly - lr * 1.1, lr * 1.1, .45));
  ctx.restore();
  // his hand on her back, his arm round her
  const a0 = [2080, 1240], a1 = [lx + lr * 1.75, ly + lr * 2.5], a2 = [lx + lr * .5, ly + lr * 1.95 + br * .4];
  const fore = (w, col, dx = 0, dy = 0) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a0[0] + dx, a0[1] + dy); ctx.quadraticCurveTo(a1[0] + dx, a1[1] + dy, a2[0] + dx, a2[1] + dy); ctx.stroke(); };
  fore(r * .62, rgba(gold, .95), -4, -7); fore(r * .6, rgba([22, 13, 16]));
  ctx.fillStyle = rgba(gold, .95); ctx.beginPath(); ctx.ellipse(a2[0] - r * .1 - 3, a2[1] - 6, r * .42, r * .3, -.2, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba([22, 13, 16]); ctx.beginPath(); ctx.ellipse(a2[0] - r * .1, a2[1], r * .42, r * .3, -.2, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { const fx = a2[0] - r * (.36 + i * .02), fy = a2[1] - r * .24 + i * r * .15; ctx.fillStyle = rgba(gold, .9); ctx.beginPath(); ctx.ellipse(fx - 2, fy - 4, r * .21, r * .078, -.12 + i * .09, 0, TAU); ctx.fill(); ctx.fillStyle = rgba([22, 13, 16]); ctx.beginPath(); ctx.ellipse(fx, fy, r * .21, r * .078, -.12 + i * .09, 0, TAU); ctx.fill(); }
  // light in the air
  additive(() => { lite([255, 180, 110], 80, 240, 900, .16); });
  motes(t, [0, 0, 1920, 1080], 46, [255, 232, 190], .6, 9);
  blurred(12, () => { ctx.fillStyle = rgba([92, 70, 44], .9); ctx.beginPath(); for (let i = 0; i < 10; i++) { const x = -60 + rnd(i * 2.3) * 520 + Math.sin(t * .8 + i) * 8, y = -50 + rnd(i * 4.1) * 170; ctx.moveTo(x + 70, y); ctx.ellipse(x, y, 70, 28, rnd(i * 3.3) * 3, 0, TAU); } ctx.fill(); });
}, { bloom: .34, grain: .45, wash: [[255, 170, 110], .1] }, [420, 130, 1500, 1000]);
// ---------- THE STREET: his phone in his hand, the bar's door from across the street, the run, the walk into the sun ----------
// World px, about 1920 x 1080. Every top-level name starts with `str`.
// Shots: phonehand · bardoor (p.mode 'beckon' | 'offer' | 'after' | 'eyes') · runside · puddle · runface · walkawaypic
const STR = {
  base: 700, kerb: 884, door: [800, 232, 1120, 700], sign: [960, 128], win: [1262, 326, 1572, 560],
  blue: [120, 165, 255], neon: [255, 132, 52], neonT: [70, 232, 212], glass: [832, 792]
};

// ---------- small things of this part ----------
// limbs alone, lit the way drawPerson lights him: parts [[pts, width], …]; the rim sits on the side the light comes from
function strLimbs(parts, fillc, rim, a, lx, ly, soft = 16) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.hypot(lx, ly) || 1, ux = lx / n, uy = ly / n, hi = mix(fillc, rim, .32);
  if (a > .003) {
    ctx.save(); ctx.shadowColor = rgba(rim, Math.min(1, a)); ctx.shadowBlur = soft * pxPerUnit(ctx);
    for (const [pts, w] of parts) stroke(pts.map(q => [q[0] + ux * 5, q[1] + uy * 5]), w + 3, rgba(rim, Math.min(1, a * 1.3)));
    ctx.restore();
  }
  for (const [pts, w] of parts) {
    stroke(pts, w, rgba(fillc));
    if (a > .003) stroke(pts.map(q => [q[0] + ux * w * .24, q[1] + uy * w * .24]), w * .24, rgba(hi, .5 * Math.min(1, a * 1.3)));
  }
}
// draw fn mirrored in the wet ground line y (a figure's own reflection, where wet() cannot reach)
function strMirror(y, a, fn) { ctx.save(); ctx.translate(0, 2 * y); ctx.scale(1, -1); ctx.globalAlpha *= a; fn(); ctx.restore(); }
// a bump: 0 … 1 … 0 round c, half-width w
const strBump = (x, c, w) => { const k = clamp(1 - Math.abs(x - c) / w); return k * k * (3 - 2 * k); };
// one long clawed finger from base along ang: curl 0 straight … 1 hooked; side -1 hooks anticlockwise
function strFinger(base, ang, len, curl, side, s) {
  const dir = k => [Math.cos(k), Math.sin(k)], a1 = ang + curl * .7 * side, k1 = v2.add(base, v2.mul(dir(a1), len * .4));
  const a2 = a1 + (.12 + curl * 1.35) * side, k2 = v2.add(k1, v2.mul(dir(a2), len * .33)), a3 = a2 + (.2 + curl * 1.0) * side, tip = v2.add(k2, v2.mul(dir(a3), len * .3));
  const q = stripPts([base, k1, k2, tip], [7.5 * s, 6.4 * s, 5 * s, .7 * s]);
  ctx.save(); ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(255,40,30,.9)'; ctx.shadowBlur = 14 * pxPerUnit(ctx);
  for (const [col, k] of [[TWIN_COL.rim, 3.4 * s], [TWIN_COL.edge, 1.3 * s], [TWIN_COL.body, 0]]) {
    ctx.fillStyle = ctx.strokeStyle = rgba(col); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (const r of q.slice(1)) ctx.lineTo(r[0], r[1]); ctx.closePath();
    if (k > 0) { ctx.lineWidth = 2 * k; ctx.stroke(); } ctx.fill(); ctx.shadowBlur = 0;
  }
  for (const c of [k1, k2]) disc(c[0], c[1], 5.6 * s, rgba(TWIN_COL.body));
  ctx.restore();
}
// Lily's legs start at her coat's hem (the kit draws the near leg from the hip, over the coat)
function strHem(P) {
  const hy = P.sh[1] + (P.hip[1] - P.sh[1]) * 1.4;
  P.legs = P.legs.map(([h, k, f]) => {
    if (f[1] <= hy) return [f, f, f];
    const cut = (a, b) => { const q = (hy - a[1]) / Math.max(.001, b[1] - a[1]); return [lerp(a[0], b[0], q), hy]; };
    if (k[1] > hy) return [h[1] >= hy ? h : cut(h, k), k, f];
    const c = cut(k, f); return [c, v2.lerp(c, f, .5), f];
  });
  return P;
}
// the towel over its arm (the bar's own `towel` is not in this part's test build)
function strTowel(t, o) {
  const P = twinPose(t, o), A = P.arms[0], s = DEVIL.s, m = v2.lerp(A.el, A.wr, .5), ang = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]);
  ctx.save(); ctx.translate(m[0], m[1]); ctx.rotate(ang * .25 + Math.sin(t * 1.4) * .025);
  ctx.fillStyle = lg(-24 * s, 0, 24 * s, 0, [[0, [244, 238, 226]], [1, [196, 188, 178]]]); rrect(-24 * s, -10 * s, 48 * s, 118 * s, 5 * s); ctx.fill();
  ctx.fillStyle = rgba([150, 140, 132], .35); ctx.fillRect(-2 * s, -8 * s, 3 * s, 112 * s);
  rectf(-24 * s, 90 * s, 48 * s, 6 * s, rgba([70, 150, 150], .85));
  ctx.restore();
}

// ---------- PHONEHAND: his phone in his hand as he walks; the reminder drops ----------
function strBell(x, y, s, col, rot = 0) {
  ctx.save(); ctx.translate(x, y - s * .2); ctx.rotate(rot); ctx.translate(0, s * .2); ctx.fillStyle = rgba(col);
  ctx.beginPath(); ctx.moveTo(-s * .5, s * .28); ctx.quadraticCurveTo(-s * .34, s * .1, -s * .34, -s * .12); ctx.arc(0, -s * .12, s * .34, Math.PI, 0);
  ctx.quadraticCurveTo(s * .34, s * .1, s * .5, s * .28); ctx.closePath(); ctx.fill();
  disc(0, s * .42, s * .12, rgba(col)); disc(0, -s * .5, s * .07, rgba(col));
  ctx.restore();
}
// the lock screen, in phone units: origin the middle of the screen (sw x sh); the caller clips to the glass
function strLock(L, t, sw, sh) {
  const k = clamp((L - .5) / .42), drop = k <= 0 ? 0 : ease.back(k), top = -sh / 2;
  lilyPhoto(0, 100, sw, sh + 204, { wave: 1, ex: 'happy' });
  rectf(-sw / 2, top, sw, 340, lg(0, top, 0, top + 340, [[0, [8, 16, 46], .62], [1, [8, 16, 46], 0]]));
  // the status bar: signal, battery (shapes, no words)
  for (let i = 0; i < 4; i++) rectf(-sw / 2 + 26 + i * 8, top + 34 - i * 3.5, 5, 6 + i * 3.5, rgba([255, 255, 255], .9));
  ctx.strokeStyle = rgba([255, 255, 255], .9); ctx.lineWidth = 2; rrect(sw / 2 - 62, top + 23, 34, 17, 5); ctx.stroke();
  rectf(sw / 2 - 59, top + 26, 20, 11, rgba([255, 255, 255], .9)); rectf(sw / 2 - 26, top + 28, 3, 7, rgba([255, 255, 255], .9));
  // the time: the banner pushes it down, it never covers her face
  const ty = top + 132 + drop * 112;
  ctx.save(); ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,10,50,.5)'; ctx.shadowBlur = 12 * pxPerUnit(ctx);
  font(84, SANS, '300'); const wT = ctx.measureText('5:02').width; font(27, SANS, '600'); const wP = ctx.measureText('PM').width, tx = -(wT + 9 + wP) / 2;
  ctx.fillStyle = rgba([255, 255, 255], .98); font(84, SANS, '300'); ctx.fillText('5:02', tx, ty); font(27, SANS, '600'); ctx.fillText('PM', tx + wT + 9, ty + 20);
  ctx.restore();
  // the reminder
  if (k > 0) {
    const bw = sw - 18, bh = 150, bx = -bw / 2, by = top + lerp(-170, 50, drop), ring = Math.sin((L - .5) * 34) * .38 * (1 - seg(L, .5, 1.25));
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18 * pxPerUnit(ctx); ctx.shadowOffsetY = 5 * pxPerUnit(ctx);
    ctx.fillStyle = rgba([16, 19, 30], .93); rrect(bx, by, bw, bh, 28); ctx.fill(); ctx.restore();
    ctx.strokeStyle = rgba([255, 255, 255], .14); ctx.lineWidth = 1.5; rrect(bx, by, bw, bh, 28); ctx.stroke();
    ctx.fillStyle = rgba(PAL.tealL); rrect(bx + 16, by + 14, 36, 36, 10); ctx.fill();
    strBell(bx + 34, by + 31, 24, [255, 255, 255], ring);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    font(24, SANS, '600'); ctx.fillStyle = rgba([190, 200, 222]); ctx.fillText('Reminder', bx + 62, by + 33);
    let fs = 36; font(fs, SANS, '700'); const mw = ctx.measureText('Pick up Lily').width; if (mw > bw - 36) { fs = Math.max(31, fs * (bw - 36) / mw); font(fs, SANS, '700'); }
    ctx.fillStyle = rgba([255, 255, 255]); ctx.fillText('Pick up Lily', bx + 18, by + 79);
    font(32, SANS, '600'); ctx.fillStyle = rgba([156, 236, 224]); ctx.fillText('5:30 PM', bx + 18, by + 119);
  }
  // the bar at the bottom
  ctx.fillStyle = rgba([255, 255, 255], .85); rrect(-52, sh / 2 - 17, 104, 5, 3); ctx.fill();
}
shot('phonehand', (t, p, L, len) => {
  const step = L * TAU * 1.8, lift = seg(L, .56, 1.05, E.out), calm = 1 - .55 * seg(L, .6, 1.4), ping = strBump(L, .62, .5);
  fill([40, 36, 104], [12, 12, 40]);
  const fr = kcam(L, len, [[0, 1, 960, 545], [.25, 1.015, 960, 543], [1, 1.1, 964, 522]], { hand: .5, t });
  // the street behind, far out of focus, sliding past as he walks
  const drift = L * 78, bob = Math.sin(step) * 9 * calm;
  ctx.save(); ctx.translate(-drift, -bob * .5);
  blurred(26, () => {
    rectf(-800, -300, 4600, 960, lg(0, -300, 0, 660, [[0, [22, 22, 74]], [.7, [70, 52, 132]], [1, [150, 86, 130]]]));        // the last of the dusk
    for (let i = 0; i < 12; i++) {                                                                              // house fronts and their lit windows
      const x = -620 + i * 330, h = 300 + rnd(i * 3.3) * 260;
      rectf(x, 660 - h, 300, h, rgba([16, 16, 50]));
      const c = [[255, 156, 64], [255, 132, 70], PAL.tealL, [255, 150, 60], [140, 120, 255], [255, 190, 140]][i % 6];
      rectf(x + 40 + rnd(i * 5.1) * 60, 660 - 60 - (150 + rnd(i * 7.7) * 90), 130 + rnd(i * 9) * 60, 150 + rnd(i * 7.7) * 90, rgba(c, .85));
      if (i % 2) rectf(x + 30, 660 - h + 50, 60, 70, rgba(mix(c, [255, 255, 255], .2), .6));
    }
    rectf(-800, 660, 4600, 900, lg(0, 660, 0, 1200, [[0, [34, 30, 86]], [1, [10, 10, 34]]]));                       // the wet pavement
    for (let i = 0; i < 12; i++) { const c = [[255, 156, 64], [255, 132, 70], PAL.tealL, [255, 150, 60], [140, 120, 255], [255, 190, 140]][i % 6]; rectf(-560 + i * 330 + rnd(i * 5.1) * 60, 664, 150, 330, lg(0, 664, 0, 994, [[0, c, .4], [1, c, 0]])); }
  });
  bokeh(41, 20, [-500, 150, 3000, 620], [PAL.amber, PAL.lamp, [255, 150, 70], PAL.tealG, [150, 130, 255], PAL.amber], 34, 92, .5, t);
  bokeh(77, 12, [-500, 680, 3000, 1000], [PAL.amber, PAL.tealL, [150, 130, 255]], 22, 60, .26, t);
  ctx.restore();
  // a lamp post slides by between him and the street
  blurred(20, () => { const x = 520 - L * 520; rectf(x, -200, 54, 1500, rgba([8, 8, 24], .9)); additive(() => lite(PAL.lamp, x + 27, 40, 260, .5)); });
  haze(t, -200, 2100, 620, 240, [120, 90, 170], .05, 7, 6);
  // the hand and the phone: one group that bobs with his step; he lifts it a little to read
  const gx = 972 + Math.sin(step * .5) * 7 * calm, gy = 556 + bob + Math.sin(step * .5 + 1) * 5 * calm - lift * 16, rot = -.065 + Math.sin(step * .5 + .6) * .014 * calm + lift * .012, sc = 1 + lift * .035;
  const PW = 159, PH = 312, ink = [9, 10, 16], scr = mix([190, 215, 255], [255, 255, 255], ping * .5);
  ctx.save(); ctx.translate(gx, gy); ctx.rotate(rot); ctx.scale(sc, sc);
  // behind the phone: his sleeve, the heel of his hand, the ball of his thumb
  strLimbs([[[[400, 900], [176, 486]], 236]], [14, 16, 30], PAL.amber, .5, -.8, -.5);
  strLimbs([[[[84, 338], [24, 196]], 286], [[[176, 400], [214, 250]], 150], [[[-150, 150], [-60, 240]], 120]], ink, PAL.amber, .5, -.6, -.8);
  additive(() => lite(scr, 0, 0, 640, .16 + .14 * ping));
  // the phone
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 34 * pxPerUnit(ctx); ctx.shadowOffsetY = 12 * pxPerUnit(ctx); ctx.fillStyle = '#090a10'; rrect(-PW, -PH, 2 * PW, 2 * PH, 46); ctx.fill(); ctx.restore();
  ctx.lineWidth = 3.5; ctx.strokeStyle = lg(-PW, -PH, PW, PH, [[0, [170, 180, 215], .95], [.45, [50, 54, 76], .7], [1, [255, 190, 130], .7]]); rrect(-PW, -PH, 2 * PW, 2 * PH, 46); ctx.stroke();
  const sw = 2 * PW - 18, sh = 2 * PH - 18;
  ctx.save(); rrect(-sw / 2, -sh / 2, sw, sh, 38); ctx.clip();
  strLock(L, t, sw, sh);
  ctx.fillStyle = lg(-sw / 2, -sh / 2, sw / 2, sh / 2, [[0, [255, 255, 255], .12], [.32, [255, 255, 255], .02], [.33, [255, 255, 255], 0], [1, [255, 255, 255], 0]]); ctx.fillRect(-sw / 2, -sh / 2, sw, sh);   // the glass
  if (ping > .01) rectf(-sw / 2, -sh / 2, sw, sh, rgba([255, 255, 255], .07 * ping));
  ctx.restore();
  // the first drops of rain on the glass
  for (let i = 0; i < 6; i++) {
    const t0 = .22 + i * .31, a = L - t0; if (a < 0) continue;
    const dx = [-118, 122, -92, 110, 126, -126][i], dy = [196, 236, 262, 150, -20, 96][i] + Math.min(a, 1.5) * 4, r = 6 + rnd(i * 3.7) * 4;
    if (a < .22) { ctx.strokeStyle = rgba([255, 255, 255], .7 * (1 - a / .22)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, r + a * 90, 0, TAU); ctx.stroke(); }
    oval(dx, dy, r, r * 1.15, rgba([200, 225, 255], .28)); ctx.strokeStyle = rgba([255, 255, 255], .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(dx, dy, r, r * 1.15, 0, 0, TAU); ctx.stroke();
    disc(dx - r * .3, dy - r * .4, r * .28, rgba([255, 255, 255], .85));
  }
  // in front: four fingertips round the left edge, his thumb resting on the right edge
  const tw = Math.sin(L * 2.3) * 3;
  strLimbs([-66, 2, 70, 136].map((y, i) => [[[-186 + i * 3, y + 14], [-128 + i * 3, y - 2]], 45 - i * 2]), ink, scr, .5 + .3 * ping, 1, -.3, 7);
  strLimbs([[[[204, 372], [236, 236]], 112], [[[236, 236], [172 + tw, 132 - tw * .6]], 62]], ink, scr, .5 + .3 * ping, -1, -.35, 7);
  oval(164 + tw, 122 - tw * .6, 14, 19, rgba(mix(ink, scr, .25), .75), -.6);                                             // his thumbnail catches the screen
  ctx.restore();
  rain(t, { n: 34, a: .3, len: 70, speed: 1500, slant: .1, seed: 5 });
  cam(...fr);
  blurred(16, () => { for (let i = 0; i < 4; i++) { const k = (L * 1.1 + rnd(i * 9.3)) % 1; oval(200 + rnd(i * 4.1) * 1500, -80 + k * 1300, 7, 60, rgba([190, 210, 255], .22)); } });   // drops close to the lens
}, { bloom: .42, grain: .5 }, [770, 190, 1190, 900]);

// ---------- BARDOOR: the bar's front from across the street ----------
const strLooks = {
  beckon: { wall: [[9, 38, 46], [26, 92, 86]], seam: .3, frame: [10, 16, 18], pav: [[40, 48, 84], [18, 22, 52]], road: [[16, 20, 50], [6, 8, 24]], wet: .5, rain: { n: 70, a: .24, len: 62, speed: 1700, slant: .12 } },
  offer: { wall: [[7, 30, 42], [18, 68, 72]], seam: .34, frame: [8, 13, 16], pav: [[34, 44, 80], [14, 18, 46]], road: [[14, 18, 46], [5, 7, 22]], wet: .58, rain: { n: 190, a: .3, len: 96, speed: 2300, slant: .16 } },
  eyes: { wall: [[26, 100, 98], [52, 136, 112]], seam: .22, frame: [20, 34, 34], pav: [[228, 150, 104], [158, 100, 90]], road: [[126, 84, 86], [70, 48, 62]], wet: 0, rain: null }
};
// painted brick
function strBrick(x0, x1, y0, y1, colA, colB, seamA) {
  ctx.fillStyle = lg(0, y0, 0, y1, [[0, colA], [1, colB]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  const bh = 30, bw = 78;
  for (let r = 0, y = y1 - bh; y > y0 - bh; y -= bh, r++) for (let x = x0 - (r % 2) * bw / 2, c = 0; x < x1; x += bw, c++) {
    const v = rnd(r * 37.1 + c * 5.3);
    if (v < .24) rectf(x + 2, y + 2, bw - 4, bh - 4, rgba([255, 255, 255], .03 + v * .16));
    else if (v > .78) rectf(x + 2, y + 2, bw - 4, bh - 4, rgba([0, 0, 0], (v - .78) * .7));
  }
  ctx.lineWidth = 2; ctx.beginPath();
  for (let r = 0, y = y1 - bh; y > y0 - bh; y -= bh, r++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 - (r % 2) * bw / 2; x < x1; x += bw) { ctx.moveTo(x, y); ctx.lineTo(x, y + bh); } }
  ctx.strokeStyle = rgba([0, 0, 0], seamA); ctx.stroke();
  ctx.save(); ctx.translate(0, 2); ctx.strokeStyle = rgba([255, 255, 255], seamA * .16); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
// the neon letters, each a path in a box 1 tall; returns the letter's width
function strGlyph(ch) {
  const q = Math.PI / 2;
  ctx.beginPath();
  if (ch === 'B') { ctx.moveTo(0, 1); ctx.lineTo(0, 0); ctx.lineTo(.3, 0); ctx.arc(.3, .24, .24, -q, q); ctx.lineTo(0, .48); ctx.moveTo(0, .48); ctx.lineTo(.34, .48); ctx.arc(.34, .74, .26, -q, q); ctx.lineTo(0, 1); return .6; }
  if (ch === 'A') { ctx.moveTo(0, 1); ctx.lineTo(.33, 0); ctx.lineTo(.66, 1); ctx.moveTo(.13, .64); ctx.lineTo(.53, .64); return .66; }
  ctx.moveTo(0, 1); ctx.lineTo(0, 0); ctx.lineTo(.3, 0); ctx.arc(.3, .25, .25, -q, q); ctx.lineTo(0, .5); ctx.moveTo(.26, .5); ctx.lineTo(.58, 1); return .58;
}
// the sign: BAR in amber-orange tubes inside a teal outline; k how bright (0 = off, glass tubes in daylight), t for its hum
function strSign(t, k) {
  const [sx, sy] = STR.sign, hgt = 92, hum = .9 + .1 * Math.sin(t * 47) * Math.sin(t * 13), lit = [1, noise1(t * 7, 3) > .62 ? .25 + .5 * rnd(Math.floor(t * 30)) : 1, 1];
  ctx.fillStyle = rgba([6, 14, 18]); rrect(sx - 176, sy - 78, 352, 156, 16); ctx.fill();
  ctx.strokeStyle = rgba([255, 255, 255], .08); ctx.lineWidth = 2; rrect(sx - 176, sy - 78, 352, 156, 16); ctx.stroke();
  rectf(sx - 120, sy + 78, 8, 26, rgba([6, 14, 18])); rectf(sx + 112, sy + 78, 8, 26, rgba([6, 14, 18]));
  if (k > .02) additive(() => { lite(STR.neon, sx, sy, 560, .34 * k * hum); lite(STR.neonT, sx, sy - 20, 380, .2 * k * hum); });
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const kt = k * (.94 + .06 * Math.sin(t * 61));
  if (kt > .02) { ctx.shadowColor = rgba(STR.neonT, kt); ctx.shadowBlur = 22 * pxPerUnit(ctx); }
  ctx.strokeStyle = rgba(mix([40, 84, 84], STR.neonT, kt)); ctx.lineWidth = 7; rrect(sx - 158, sy - 60, 316, 120, 22); ctx.stroke();
  ctx.shadowBlur = 0; if (kt > .02) { ctx.strokeStyle = rgba([225, 255, 250], .8 * kt); ctx.lineWidth = 2.4; rrect(sx - 158, sy - 60, 316, 120, 22); ctx.stroke(); }
  ctx.restore();
  let x = sx - (.6 + .66 + .58 + .44) * hgt / 2;
  'BAR'.split('').forEach((ch, i) => {
    const on = k * hum * lit[i];
    ctx.save(); ctx.translate(x, sy - hgt / 2); ctx.scale(hgt, hgt); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const w = strGlyph(ch);
    if (on > .02) { ctx.shadowColor = rgba(STR.neon, on); ctx.shadowBlur = 30 * pxPerUnit(ctx) / hgt; }
    ctx.lineWidth = .125; ctx.strokeStyle = rgba(mix([92, 62, 54], STR.neon, on)); ctx.stroke();
    if (on > .02) { ctx.shadowBlur = 10 * pxPerUnit(ctx) / hgt; ctx.stroke(); }
    ctx.shadowBlur = 0; ctx.lineWidth = .05; ctx.strokeStyle = on > .02 ? rgba([255, 236, 208], .95 * on) : rgba([255, 255, 255], .22); ctx.stroke();
    ctx.restore();
    x += (w + .22) * hgt;
  });
}
// what the open door shows. warm: the bar inside, lit; dark: nothing; sun: black, with a blade of sunlight on the sill
function strDoorway(t, mode) {
  const [x0, y0, x1, y1] = STR.door, lk = strLooks[mode === 'after' ? 'offer' : mode], w = x1 - x0;
  rectf(x0 - 26, y0 - 26, w + 52, y1 - y0 + 26, rgba(lk.frame));
  ctx.strokeStyle = rgba(mode === 'eyes' ? [255, 214, 160] : PAL.brass, mode === 'beckon' ? .7 : .35); ctx.lineWidth = 3; ctx.strokeRect(x0 - 26, y0 - 26, w + 52, y1 - y0 + 26);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, y1 - y0); ctx.clip();
  if (mode === 'beckon') {
    ctx.fillStyle = lg(0, y0, 0, y1, [[0, [84, 36, 14]], [.4, [206, 104, 36]], [1, [128, 60, 22]]]); ctx.fillRect(x0, y0, w, y1 - y0);
    blurred(7, () => {
      ctx.fillStyle = lg(0, y0 + 120, 0, y0 + 330, [[0, [30, 110, 116]], [1, [16, 66, 76]]]); rrect(x0 + 44, y0 + 120, w - 88, 214, 8); ctx.fill();   // the lit shelf, far inside
      for (let r = 0; r < 2; r++) { rectf(x0 + 44, y0 + 222 + r * 106, w - 88, 8, rgba(PAL.wood)); for (let i = 0; i < 7; i++) bottle(x0 + 66 + i * 32, y0 + 222 + r * 106, .26 + rnd(i + r * 9) * .05, { glass: [190, 245, 235], level: .2 + rnd(i * 3 + r) * .6, cork: 1 }); }
      rectf(x0, y0 + 372, w, 22, rgba(PAL.woodL)); rectf(x0, y0 + 394, w, 90, rgba(PAL.wood));                 // the counter
    });
    cone(x0 + w / 2, y0 + 26, 30, 210, 440, PAL.amber, .2);
    poly([[x0 + w / 2 - 22, y0], [x0 + w / 2 + 22, y0], [x0 + w / 2 + 44, y0 + 30], [x0 + w / 2 - 44, y0 + 30]], rgba([14, 12, 12]));
    additive(() => { lite([255, 150, 60], x0 + w / 2, y0 + 40, 210, .7); lite([255, 226, 190], x0 + w / 2, y0 + 36, 46, .9); });
    ctx.fillStyle = lg(0, y1 - 80, 0, y1, [[0, [120, 64, 26], 0], [1, [255, 170, 90], .4]]); ctx.fillRect(x0, y1 - 80, w, 80);       // the floor at the door
    poly([[x0, y0], [x0 + 46, y0 + 26], [x0 + 46, y1 - 8], [x0, y1]], rgba([20, 26, 26]));                       // the door leaf, swung in
    ctx.strokeStyle = rgba(PAL.amber, .8); ctx.lineWidth = 3; line(x0 + 46, y0 + 26, x0 + 46, y1 - 8); disc(x0 + 34, y0 + 250, 6, rgba(PAL.brass));
  } else if (mode === 'eyes') {
    rectf(x0, y0, w, y1 - y0, rgba([3, 4, 6]));
    poly([[x0 + 120, y1], [x1, y1], [x1, y1 - 30]], rgba([255, 196, 128], .55));
    ctx.fillStyle = lg(x1 - 70, 0, x1, 0, [[0, [255, 190, 120], 0], [1, [255, 190, 120], .1]]); ctx.fillRect(x1 - 70, y0, 70, y1 - y0);
  } else {
    ctx.fillStyle = lg(0, y0, 0, y1, [[0, [2, 5, 8]], [.75, [3, 8, 12]], [1, [8, 20, 26]]]); ctx.fillRect(x0, y0, w, y1 - y0);
  }
  ctx.restore();
}
function strStep(lk, lit) {
  const [x0, , x1, y1] = STR.door;
  rectf(x0 - 34, y1 - 4, x1 - x0 + 68, 18, rgba(mix(lk.pav[0], [255, 255, 255], .12))); rectf(x0 - 34, y1 - 4, x1 - x0 + 68, 3, rgba(lit, .6));
}
// the small window: blurred bottle shapes behind the glass
function strWindow(t, mode) {
  const [x0, y0, x1, y1] = STR.win, w = x1 - x0, h = y1 - y0, lk = strLooks[mode === 'after' ? 'offer' : mode];
  rectf(x0 - 18, y0 - 18, w + 36, h + 46, rgba(lk.frame));
  const glass = mode === 'beckon' ? [[0, [150, 84, 34]], [.55, [236, 150, 64]], [1, [120, 62, 24]]] : mode === 'eyes' ? [[0, [28, 54, 60]], [1, [16, 30, 36]]] : [[0, [8, 34, 42]], [1, [14, 52, 58]]];
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.fillStyle = lg(0, y0, 0, y1, glass); ctx.fillRect(x0, y0, w, h);
  if (mode === 'beckon') additive(() => lite(PAL.amber, x0 + w * .4, y0 + 40, 240, .5));
  blurred(5, () => {
    for (let i = 0; i < 8; i++) { const s = .5 + rnd(i * 3.1) * .14; ctx.save(); ctx.translate(x0 + 24 + i * 38, y1 - 6); ctx.scale(s, s); bottlePath(); ctx.fillStyle = rgba(mode === 'beckon' ? [56, 24, 10] : mode === 'eyes' ? [6, 14, 16] : [3, 14, 18], .9); ctx.fill(); ctx.restore(); }
    rectf(x0, y1 - 8, w, 8, rgba([8, 10, 10]));
  });
  if (mode === 'eyes') { ctx.fillStyle = lg(x0, y0, x1, y1, [[0, [255, 214, 160], .5], [.4, [255, 190, 130], .16], [.41, [255, 190, 130], .03], [1, [255, 190, 130], .1]]); ctx.fillRect(x0, y0, w, h); }
  else { ctx.fillStyle = lg(x0, y0, x1, y1, [[0, [200, 230, 255], .14], [.35, [200, 230, 255], .03], [.36, [200, 230, 255], 0], [1, [200, 230, 255], .05]]); ctx.fillRect(x0, y0, w, h); }
  ctx.restore();
  ctx.strokeStyle = rgba(lk.frame); ctx.lineWidth = 9; line(x0 + w / 2, y0, x0 + w / 2, y1); line(x0, y0 + h * .4, x1, y0 + h * .4);
  rectf(x0 - 30, y1 + 16, w + 60, 14, rgba(mix(lk.frame, [255, 255, 255], .1)));
}
// the wall with everything fixed to it
function strFront(t, mode, neonK) {
  const lk = strLooks[mode === 'after' ? 'offer' : mode], day = mode === 'eyes';
  strBrick(-600, 2520, -520, STR.base, lk.wall[0], lk.wall[1], lk.seam);
  rectf(-600, STR.base - 50, 3120, 50, rgba(mix(lk.wall[0], [0, 0, 0], day ? .25 : .4))); rectf(-600, STR.base - 52, 3120, 3, rgba(mix(lk.wall[1], [255, 255, 255], .3), .5));
  ctx.fillStyle = lg(396, 0, 426, 0, [[0, mix(lk.wall[0], [0, 0, 0], .3)], [.4, mix(lk.wall[1], [255, 255, 255], .12)], [1, mix(lk.wall[0], [0, 0, 0], .5)]]); ctx.fillRect(396, -520, 30, 1220);   // a drainpipe
  for (const y of [40, 360, 640]) rectf(390, y, 42, 12, rgba(mix(lk.wall[0], [0, 0, 0], .45)));
  rectf(560, 596, 120, 62, rgba(mix(lk.wall[0], [0, 0, 0], .5))); for (let i = 0; i < 5; i++) rectf(568, 604 + i * 11, 104, 4, rgba(mix(lk.wall[1], [255, 255, 255], .08)));   // a cellar vent
  if (day) {                                                                // long, low sunlight from the right, and what stands in it
    additive(() => { ctx.fillStyle = lg(-300, 0, 2200, 0, [[0, [255, 130, 60], .04], [.55, [255, 150, 70], .2], [1, [255, 170, 90], .34]]); ctx.fillRect(-600, -520, 3120, 1220); lite([255, 160, 80], 1500, 120, 900, .16); });
    ctx.save(); ctx.beginPath(); ctx.rect(-600, -520, 3120, 1220); ctx.clip();
    blurred(7, () => {
      poly([[-600, 150], [-600, STR.base], [190, STR.base]], rgba([6, 30, 46], .55));                               // the house across the street throws its shadow up the wall
      poly([[1722, -520], [1764, -520], [1346, STR.base], [1304, STR.base]], rgba([6, 30, 46], .5));              // a lamp post's shadow
      poly([[STR.sign[0] - 330, STR.sign[1] - 30], [STR.sign[0] + 60, STR.sign[1] - 30], [STR.sign[0] + 10, STR.sign[1] + 170], [STR.sign[0] - 380, STR.sign[1] + 170]], rgba([6, 30, 46], .42));
      poly([[STR.win[0] - 110, STR.win[1] + 50], [STR.win[0], STR.win[1]], [STR.win[0], STR.win[3] + 30], [STR.win[0] - 110, STR.win[3] + 90]], rgba([6, 30, 46], .4));
      poly([[STR.door[0] - 120, STR.door[1] + 60], [STR.door[0] - 26, STR.door[1] - 20], [STR.door[0] - 26, STR.base], [STR.door[0] - 120, STR.base]], rgba([6, 30, 46], .34));
    });
    blurred(14, () => { for (let i = 0; i < 18; i++) oval(170 + rnd(i * 3.3) * 600 + Math.sin(t * .9 + i) * 10, -90 + rnd(i * 5.1) * 400 + Math.cos(t * .7 + i * 2) * 8, 60 + rnd(i * 7) * 60, 34 + rnd(i * 9) * 30, rgba([6, 34, 46], .42), rnd(i) * 3); });   // leaves' shade
    ctx.restore();
  }
  strWindow(t, mode);
  strSign(t, neonK);
}
// the pavement and the road; the wet ones mirror the wall
function strGround(t, mode) {
  const lk = strLooks[mode === 'after' ? 'offer' : mode], day = mode === 'eyes', B = STR.base, K = STR.kerb;
  ctx.fillStyle = lg(0, B, 0, K, [[0, lk.pav[0]], [1, lk.pav[1]]]); ctx.fillRect(-600, B, 3120, K - B);
  ctx.strokeStyle = rgba([0, 0, 0], day ? .14 : .3); ctx.lineWidth = 2; ctx.beginPath();
  for (const y of [B + 52, B + 116]) { ctx.moveTo(-600, y); ctx.lineTo(2520, y); }
  for (let x = -600; x < 2520; x += 150) { ctx.moveTo(x, B); ctx.lineTo(x - 26, B + 52); ctx.moveTo(x + 70, B + 52); ctx.lineTo(x + 36, B + 116); ctx.moveTo(x, B + 116); ctx.lineTo(x - 44, K); }
  ctx.stroke();
  rectf(-600, K, 3120, 16, rgba(mix(lk.pav[0], [255, 255, 255], day ? .3 : .16))); rectf(-600, K + 16, 3120, 12, rgba([0, 0, 0], .45));
  ctx.fillStyle = lg(0, K + 28, 0, 1500, [[0, lk.road[0]], [1, lk.road[1]]]); ctx.fillRect(-600, K + 28, 3120, 700);
  if (lk.wet) wet(B, 420, lk.wet, t, 6);
  if (day) {
    ctx.save(); ctx.beginPath(); ctx.rect(-600, B, 3120, 800); ctx.clip();
    blurred(7, () => {
      poly([[1346, B], [1304, B], [740, 1300], [840, 1300]], rgba([64, 26, 60], .42));                         // the lamp post's shadow runs on across the street
      poly([[-600, B], [190, B], [-140, 1300], [-600, 1300]], rgba([64, 26, 60], .4));
      poly([[STR.door[0] - 60, B + 16], [STR.door[2] + 40, B + 16], [STR.door[2] - 40, B + 60], [STR.door[0] - 150, B + 60]], rgba([64, 26, 60], .28));
    });
    additive(() => { ctx.fillStyle = lg(0, B, 0, 1100, [[0, [255, 150, 70], .12], [1, [255, 130, 60], 0]]); ctx.fillRect(-600, B, 3120, 500); });
    ctx.restore();
  }
}
// a lamp post close to the lens, on our side of the street
function strNearPost(t, fr, x0 = 150, a = 1) {
  const x = x0 - (fr[1] - 960) * 1.2;
  blurred(13, () => { rectf(x - 38, -400, 76, 1800, rgba([5, 7, 16], .96 * a)); rectf(x - 38, -400, 9, 1800, rgba(STR.blue, .2 * a)); rectf(x - 70, 950, 140, 300, rgba([5, 7, 16], .96 * a)); });
}
// a walker's pose from the distance walked: his stride comes from d (px), so his feet do not slide. o: s, swing, hands, lean, neck, feet
function strWalker(x, gy, d, o = {}) {
  const s = o.s || .95, len = 46 * s, ph = Math.PI / 2 + d / len, feet = o.feet || stride(x, gy, ph, len, 24 * s, 1);
  const hip = [x + (o.hx || 0), gy - (184 + 7 * Math.abs(Math.cos(ph)) * (o.bob ?? 1)) * s];
  return man({ hip, s, dir: 1, lean: o.lean ?? .06, neck: o.neck ?? .04, feet, knee: 1, swing: -Math.sin(ph) * .42 * (o.swing ?? 1), hands: o.hands, elbow: o.elbow });
}

function strBarDoor(t, p, L, len) {
  const mode = p.mode || 'beckon', lk = strLooks[mode === 'after' ? 'offer' : mode], u = clamp(L / len), B = STR.base, [dx0, dy0, dx1, dy1] = STR.door;
  const cams = {
    beckon: [[0, 1, 960, 530], [1, 1.2, 962, 480]], offer: [[0, 1.03, 900, 530], [1, 1.09, 850, 540]],
    after: [[0, 1.05, 1050, 548], [.3, 1.08, 1030, 556], [1, 1.56, 850, 630]], eyes: [[0, 1, 960, 528], [1, 1.3, 960, 466]]
  };
  fill(lk.wall[0], lk.road[1]);
  const fr = kcam(L, len, p.cam || cams[mode], { hand: mode === 'eyes' ? .22 : .4, t });
  const neonK = mode === 'eyes' ? 0 : mode === 'beckon' ? 1 : .92;
  strFront(t, mode, neonK);
  strDoorway(t, mode);

  if (mode === 'beckon') {
    // the door's light on the wall round it; the devil in the doorway, a towel over its arm, one finger calling him in
    additive(() => { lite([255, 150, 60], 960, 470, 640, .16); });
    const s = .6; placeDevil([946, B + 200 * s, s]);
    const bk = L < .25 ? 0 : .5 - .5 * Math.cos((L - .25) * TAU * 1.55), lean = .06 + .12 * seg(L, 0, len);
    const o = devilO({ a: 1, eyes: .9 + .1 * Math.sin(t * 5), grin: .3 + .08 * seg(L, .8, 1.8), lean, reach: 1, smoke: .45,
      targets: [[986, 528], [1088 - bk * 10, 352 + 14 + bk * 8]] });
    drawDevil(t, fr, o); strTowel(t, o);
    const P = twinPose(t, o), A = P.arms[1], fa = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]);
    strFinger(A.wr, fa + .12, 104, .08 + bk * .74, -1, 1);
    devilEyes(t, o); devilGrin(t, o);
    strStep(lk, PAL.amber);
  } else if (mode === 'eyes') {
    strStep(lk, [255, 220, 170]);
  } else strStep(lk, STR.neon);

  strGround(t, mode);

  if (mode === 'beckon') {
    // the warm light spills out of the door across the wet pavement, its long shadow in the middle of it
    blurred(5, () => additive(() => { ctx.fillStyle = lg(0, B, 0, 1140, [[0, [255, 150, 60], .5], [.5, [255, 150, 60], .2], [1, [255, 150, 60], .05]]); poly([[dx0 + 46, B + 14], [dx1, B + 14], [dx1 + 300, 1140], [dx0 - 250, 1140]]); ctx.fill(); }));
    blurred(9, () => poly([[916, B + 14], [1000, B + 14], [1100, 1140], [820, 1140]], rgba([10, 8, 20], .5)));
    pool(960, B + 40, 380, 60, PAL.amber, .3);
    ripples(t, -200, 2100, B + 20, 1080, 30, [200, 220, 255], .3, 3);
  } else if (mode === 'offer' || mode === 'after') {
    // a street lamp out of frame on the left lights the wall and the pavement they walk on
    additive(() => { lite([150, 190, 255], 470, 300, 760, .2); lite([150, 190, 255], 520, 560, 420, .14); });
    pool(520, B + 110, 620, 110, [170, 195, 255], .22); pool(STR.sign[0], B + 60, 300, 44, STR.neon, .18);
    ripples(t, -200, 2100, B + 14, 1080, 60, [200, 220, 255], .34, 3);
    strOffer(t, mode, L, len, fr);
  } else strEyes(t, L, len, fr);

  if (lk.rain) rain(t, lk.rain);
  cam(...fr);
  if (mode !== 'eyes') { strNearPost(t, fr, mode === 'beckon' ? 150 : 1830); haze(t, -300, 2200, 640, 300, mode === 'beckon' ? [90, 80, 160] : [70, 90, 160], .045, 11, 6); }
  if (mode === 'offer') stamp(L, '7:10 PM', 'DAY 60');
}
// 'offer' and 'after': the dark doorway, the arm and the glass, the eyes, the two of them on the pavement
function strOffer(t, mode, L, len, fr) {
  const B = STR.base, [dx0, dy0, dx1, dy1] = STR.door, [gx, gy] = STR.glass, gs = .64, off = mode === 'offer';
  // the glass: it slides out of the dark along the pavement, then stands there
  const sl = off ? seg(L, .32, 1.12, E.out) : 1, G = [lerp(978, gx, sl), lerp(B + 12, gy, sl)];
  const back = off ? seg(L, 1.45, 2.35, E.io) : 1, grip = off ? 1 - back : 0;
  const eyeK = off ? seg(L, .55, .95, E.out) * (.9 + .1 * Math.sin(t * 6)) : lerp(.85, .2, seg(L, .2, len * .85));
  const drawGlass = () => {
    if (!off) {                                                             // the rain tops it up: it runs over
      ctx.fillStyle = lg(0, G[1] - 104 * gs, 0, G[1], [[0, [246, 206, 150], .8], [1, [200, 120, 50], .5]]);
      poly([[G[0] - 46 * gs, G[1] - 100 * gs], [G[0] + 46 * gs, G[1] - 100 * gs], [G[0] + 42 * gs, G[1] - 60 * gs], [G[0] - 42 * gs, G[1] - 60 * gs]]); ctx.fill();
    }
    tumbler(G[0], G[1], gs, off ? .96 : 1, { glowA: .7, slosh: off ? Math.sin(L * 16) * (1 - sl) * 2.2 * (sl > .02 ? 1 : 0) + Math.sin(L * 9) * .5 * strBump(L, 1.2, .4) : 0 });
  };
  strMirror(G[1] + 2, .3, drawGlass);
  if (!off) {                                                               // what runs over makes a small pool round it
    const gr = seg(L, 0, len);
    oval(G[0] + 6, G[1] + 6, 60 + 46 * gr, 9 + 6 * gr, rgba([230, 160, 90], .16)); ctx.strokeStyle = rgba([255, 214, 170], .16); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(G[0] + 6, G[1] + 6, 60 + 46 * gr, 9 + 6 * gr, 0, 0, TAU); ctx.stroke();
  }
  // its arm: long, down out of the dark at a slant, fingertips on the glass; it lets go and draws back in
  if (off && back < .995) {
    const ang = 2.36 + .06 * Math.sin(L * 3), ax = [Math.cos(ang), Math.sin(ang)], wr0 = [G[0] + 30 + 86, G[1] - 34 - 86], wr = [wr0[0] - ax[0] * 330 * back, wr0[1] - ax[1] * 330 * back];
    ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0 + 4); ctx.rect(-600, B + 2, 3120, 900); ctx.clip();
    claw(wr, ang, .52, { arm: 560, curl: .1 + .1 * grip + .3 * back, side: -1, spread: .8, a: 1 - seg(back, .55, .95) });
    ctx.restore();
  }
  drawGlass();
  if (!off) {                                                               // rain in the glass, and over its rim
    for (let i = 0; i < 5; i++) {
      const per = .34 + rnd(i * 2.3) * .2, a = ((t + rnd(i * 7.7)) % per) / per, x = G[0] + (rnd(i * 3.1 + Math.floor((t + rnd(i * 7.7)) / per)) - .5) * 70 * gs, y = G[1] - 100 * gs;
      ctx.strokeStyle = rgba([255, 240, 220], .8 * (1 - a)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x, y, 3 + a * 12, 1.5 + a * 3, 0, 0, TAU); ctx.stroke();
      for (const sd of [-1, 1]) disc(x + sd * a * 12, y - Math.sin(a * Math.PI) * 16, 1.8, rgba([255, 244, 230], .8 * (1 - a)));
    }
    for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) { const k = (t * (.7 + j * .25) + j * .5 + (sd > 0 ? .3 : 0)) % 1, x = G[0] + sd * (49 - k * 5) * gs; stroke([[x, G[1] - (100 - k * 86) * gs], [x - sd * .6, G[1] - (100 - k * 86) * gs + 13]], 2.6, rgba([255, 226, 190], .75 * (1 - k * .5))); }
  }
  // the dark of the doorway closes over its arm; then its eyes, low in the dark
  ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0); ctx.clip();
  ctx.fillStyle = lg(0, dy0, 0, dy1, [[0, [2, 5, 8], 1], [.66, [2, 6, 9], 1], [.9, [3, 8, 12], .45], [1, [3, 8, 12], 0]]); ctx.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
  additive(() => lite(PAL.red, 1020, 412, 240, .34 * eyeK));
  ctx.restore();
  const es = .62; placeDevil([990, 408 + 830 * es, es]);
  const o = devilO({ a: 1, eyes: eyeK, lean: .1 });
  devilEyes(t, o);
  additive(() => lite(PAL.red, G[0], G[1] - 40, 150, .16 * eyeK));

  // the two of them. He is on the street side; she walks a step behind him, away from the door
  const sM = .95, v = 180, gyM = 816, gyL = 792, sLy = 1.45;
  let M, LP, ex, lex, mx, lx, rimC = mix(STR.blue, PAL.lamp, .35);
  if (off) {
    const tS = 1.02, dmax = v * (tS + .15), walk = Lq => Lq < tS ? v * Lq : v * (Math.min(Lq, tS + .3) - Math.pow(Math.min(Lq, tS + .3) - tS, 2) / .6), dd = walk(L) - dmax;   // he slows and stops
    const dl = walk(Math.max(0, L - .14)) + v * .14 - dmax;
    mx = 632 + dd; lx = mx - 132 + (dl - dd);
    const stepB = seg(L, 1.5, 1.95), rest = seg(L, 1.3, 1.7), len0 = 46 * sM;
    const feet = L < 1.3 ? null : [[mx + len0 * lerp(1, .12, stepB), gyM - Math.sin(stepB * Math.PI) * 13], [mx - len0, gyM]];          // half a step back
    const hx = -16 * stepB, base = { s: sM, swing: 1 - rest, feet, hx, lean: lerp(.06, -.04, stepB), neck: lerp(.04, .34, seg(L, 1.15, 1.6)), bob: 1 - rest * .5 };
    const P0 = strWalker(mx, gyM, dd, base), rk = seg(L, 1.6, 2.2, E.out) * .8;                                 // his hand starts toward it, and stops in the air
    M = strWalker(mx, gyM, dd, Object.assign({}, base, { hands: [v2.lerp(P0.j.handN, [mx + 92, P0.j.hip[1] - 26], rk), null], elbow: [1, 1] }));
    ex = mixExpr(exMix('calm', 'shock', strBump(L, 1.35, .45) * .8), EXPR.hungry, seg(L, 1.5, 2.2));
    LP = lily({ at: [lx, gyL], s: sLy, dir: 1, pose: 'walk', ph: Math.PI / 2 + dl / (16 * sLy), swing: Math.sin(dl / (16 * sLy)) * .35 * (1 - rest), look: 5 * seg(L, 1.4, 1.9), nod: -3 * seg(L, 1.4, 1.9) });
    lex = mixExprL(LILY_EX.hope, LILY_EX.wary, seg(L, 1.4, 2.0) * .8);
  } else {
    const d = v * 1.1 * L; mx = 1250 + d; lx = mx - 98;
    const P0 = strWalker(mx, gyM, d, { s: sM });
    const hold = [P0.j.sh[0] - 44 * sM, P0.j.sh[1] + 146 * sM];
    M = strWalker(mx, gyM, d, { s: sM, hands: [null, hold], elbow: [1, 1], neck: -.02, lean: .08 });
    ex = exMix('calm', 'resolve', .5);
    LP = lily({ at: [lx, gyL], s: sLy, dir: 1, pose: 'walk', ph: Math.PI / 2 + d / (16 * sLy), arms: [null, [hold[0] - 4, hold[1] + 4]], swing: -.25, look: 4, nod: -2 });
    lex = 'hope';
  }
  strHem(LP);
  const lampK = clamp(1 - Math.abs(mx - 520) / 700);
  const figs = flip => {
    drawLily(LP, lex, { a: .7 + .3 * lampK, rim: PAL.lamp, wet: flip ? 0 : .7 });
    drawMan(M, ex, { rim: rimC, a: .62 + .3 * lampK, lx: -.5, ly: -1, la: .32, light: PAL.lamp, turn: .9 });
  };
  blurred(2.5, () => { strMirror(gyL + 3, .26, () => drawLily(LP, lex, { a: .7, face: false })); strMirror(gyM + 3, .3, () => drawMan(M, ex, { rim: rimC, a: .5, lx: -.5, ly: -1, face: false })); });
  figs(false);
}
// LILY_EX blended (the kit's mixExpr works on any two expression objects)
const mixExprL = (a, b, k) => mixExpr(a, b, clamp(k));
// 'eyes': golden hour; in the black doorway its eyes open and its grin spreads. It does not come out into the light
function strEyes(t, L, len, fr) {
  const [dx0, dy0, dx1, dy1] = STR.door, s = .74;
  placeDevil([926, 404 + 830 * s, s]);
  const e = seg(L, .25, .7, E.out) * (.92 + .08 * Math.sin(t * 7)), g = seg(L, .75, len - .1, E.io);
  const o = devilO({ a: 1, eyes: e, grin: g * .95, lean: .12 * g, smoke: 0 });
  ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0 - 30); ctx.clip();
  drawDevil(t, fr, Object.assign({}, o, { a: .1 + .22 * g }));
  devilEyes(t, o); devilGrin(t, o);
  ctx.restore();
  // dust in the low sun; a leaf blows along the pavement
  motes(t, [100, 200, 1800, 900], 34, [255, 226, 170], .32, 4);
  for (let i = 0; i < 3; i++) {
    const x = 1700 - ((L * (300 + i * 90) + i * 520) % 2000), y = STR.base + 70 + i * 46 - Math.abs(Math.sin(L * 5 + i * 2)) * (20 + i * 8);
    oval(x, y + 30 + Math.abs(Math.sin(L * 5 + i * 2)) * (20 + i * 8), 12, 3, rgba([60, 30, 60], .25));
    oval(x, y, 13, 6, rgba([[196, 98, 44], [160, 70, 40], [214, 126, 60]][i]), L * 7 + i);
  }
  additive(() => { ctx.fillStyle = lg(0, -200, 1920, 900, [[0, [255, 140, 70], 0], [1, [255, 150, 80], .12]]); ctx.fillRect(-600, -520, 3120, 1900); });
  blurred(12, () => { for (let i = 0; i < 9; i++) oval(1640 + rnd(i * 3.7) * 420 + Math.sin(t * 1.1 + i) * 9, -40 + rnd(i * 5.3) * 250 + Math.cos(t * .9 + i) * 7, 90, 40, rgba([[50, 96, 62], [84, 124, 66], [36, 76, 60]][i % 3], .95), rnd(i * 2) * 3); });   // a branch near the lens
}
shot('bardoor', strBarDoor, (t, p) => ({ bloom: (p.mode === 'eyes') ? .3 : .46, grain: .5 }),
  (t, p) => (p && p.mode === 'offer') ? [430, 280, 1130, 900] : (p && p.mode === 'after') ? [620, 300, 1240, 900] : [700, 60, 1220, 860]);

// ---------- RUNSIDE: night, hard rain; he runs and the street streaks past ----------
// one row of the street at parallax par (1 = his own plane, less = farther, more = nearer the lens): fn(i, x) draws item i
function strRow(camx, z, par, gap, fn, pad = 500) {
  const half = 1040 / z + pad, c = camx * par;
  ctx.save(); ctx.translate(camx * (1 - par), 0);
  for (let i = Math.floor((c - half) / gap); i <= Math.ceil((c + half) / gap); i++) fn(i, i * gap);
  ctx.restore();
}
// a lit thing smeared sideways by speed
function strStreak(x, y, w, h, col, a, sm) {
  const tot = w + 2 * sm, e = sm / tot;
  ctx.fillStyle = lg(x - sm, 0, x + w + sm, 0, [[0, col, 0], [e, col, a], [1 - e, col, a], [1, col, 0]]); ctx.fillRect(x - sm, y, tot, h);
}
// his run: ph the stride (radians), G the road. Both feet leave the ground when the legs are widest
function strRunner(x, G, ph, s = 1) {
  const fl = Math.max(0, Math.abs(Math.sin(ph)) - .5) / .5 * 20 * s, feet = stride(x - 8 * s, G - fl, ph, 124 * s, 108 * s, 1);
  const hip = [x, G - (166 + 20 * Math.abs(Math.cos(ph))) * s - fl], lean = .36, sh = [hip[0] + Math.sin(lean) * 172 * s, hip[1] - Math.cos(lean) * 172 * s], a = -Math.sin(ph);
  const hand = k => v2.lerp([sh[0] - 64 * s, sh[1] + 110 * s], [sh[0] + 98 * s, sh[1] + 22 * s], E.sine((k + 1) / 2));
  return man({ hip, s, dir: 1, lean, neck: -.12, feet, knee: 1, hands: [hand(a), hand(-a)], elbow: [1, 1] });
}
shot('runside', (t, p, L, len) => {
  const u = clamp(L / len), G = 872, v = p.speed || 1020, cad = 1.48, ph0 = 1.1, ph = L * TAU * cad + ph0, mx = 400 + v * L;
  const z = lerp(1.24, 1.31, u), camx = mx + lerp(180, 70, E.sine(u)), camy = 588 + Math.sin(ph * 2 + .6) * 5;
  fill([20, 24, 82], [6, 8, 26]);
  const fr = kcam(L, len, [[0, z, camx, camy]], { hand: .6, t });
  // far roofs against the sky
  blurred(4, () => strRow(camx, z, .14, 300, (i, x) => {
    const h = 250 + rnd(i * 3.7) * 280; rectf(x, 740 - h, 304, h + 200, rgba([24, 28, 92]));
    for (let j = 0; j < 6; j++) if (rnd(i * 7 + j * 3.1) > .5) rectf(x + 34 + (j % 3) * 84, 740 - h + 46 + Math.floor(j / 3) * 96, 38, 52, rgba(j % 2 ? PAL.amber : PAL.tealL, .55));
  }));
  haze(t, camx - 1100, camx + 1100, 520, 300, [70, 70, 170], .07, 5, 7);
  // the shop fronts: their lit windows are streaks
  const SH = [[26, 30, 92], [34, 28, 88], [22, 36, 90], [30, 34, 100]], WC = [[255, 138, 56], PAL.tealL, [255, 116, 70], [255, 168, 108], [150, 130, 255]];
  strRow(camx, z, .56, 580, (i, x) => {
    const c = WC[((i % 5) + 5) % 5], wall = SH[((i % 4) + 4) % 4];
    rectf(x, -300, 584, 1090, rgba(wall)); rectf(x + 572, -300, 12, 1090, rgba([0, 0, 0], .25));
    for (let j = 0; j < 3; j++) { const on = rnd(i * 5.3 + j * 1.7) > .4; strStreak(x + 70 + j * 170, 150, 96, 150, on ? [255, 176, 120] : [50, 56, 130], on ? .5 : .5, 30); }
    strStreak(x + 20, 392, 540, 40, [70, 60, 150], .9, 24);                                                     // an awning
    strStreak(x + 56, 462, 330, 270, c, .72, 56); strStreak(x + 56, 462, 330, 60, [255, 255, 255], .08, 56);
    for (let j = 0; j < 3; j++) strStreak(x + 96 + j * 100, 620, 40, 112, [14, 12, 40], .55, 26);               // things in the window
    strStreak(x + 440, 480, 96, 300, [12, 14, 44], .95, 20); strStreak(x + 446, 486, 84, 60, c, .7, 20);
    additive(() => { ctx.save(); ctx.translate(x + 220, 800); ctx.scale(1, .16); lite(c, 0, 0, 330, .5); ctx.restore(); lite(c, x + 220, 600, 380, .16); });
  });
  // the pavement edge and the road
  rectf(camx - 1300, 786, 2600, 34, rgba([52, 56, 124])); rectf(camx - 1300, 818, 2600, 8, rgba([110, 120, 200], .6));
  ctx.fillStyle = lg(0, 826, 0, 1300, [[0, [28, 32, 96]], [1, [8, 10, 32]]]); ctx.fillRect(camx - 1300, 826, 2600, 600);
  // street lamps along the kerb, each with its cone of warm light
  const LG = 800, LP = .9, lampX = i => i * LG + 240 + camx * (1 - LP);
  let warm = 0, wdir = 0;
  for (let i = Math.floor(camx / LG) - 3; i < Math.floor(camx / LG) + 4; i++) { const k = clamp(1 - Math.abs(mx + 40 - lampX(i)) / 340); if (k > warm) { warm = k; wdir = clamp((lampX(i) - mx - 40) / 300, -1, 1); } }
  warm = warm * warm * (3 - 2 * warm);
  strRow(camx, z, LP, LG, (i, x0) => {
    const x = x0 + 240;
    rectf(x - 7, 222, 14, 600, rgba([10, 12, 34])); rectf(x - 7, 222, 4, 600, rgba(STR.blue, .35)); rectf(x - 13, 760, 26, 62, rgba([10, 12, 34]));
    stroke([[x, 226], [x - 20, 196], [x - 78, 190]], 9, rgba([10, 12, 34])); poly([[x - 112, 186], [x - 60, 186], [x - 52, 204], [x - 120, 204]], rgba([10, 12, 34]));
    cone(x - 86, 204, 26, 270, 660, [255, 196, 140], .2);
    additive(() => { lite(PAL.lamp, x - 86, 212, 120, .75); lite([255, 236, 204], x - 86, 208, 30, .9); });
    pool(x - 86, 850, 330, 46, PAL.lamp, .42);
  });
  // him
  const M = strRunner(mx, G, ph), rim = mix(STR.blue, PAL.lamp, warm), ex = Object.assign({}, exMix('strain', 'fear', .45), { brow: -.25, browH: .1, lid: .12, grit: .6, open: .6 + .2 * Math.sin(ph * 2) });
  drawMan(M, ex, { rim, a: .78 + .2 * warm, lx: lerp(-.5, wdir, warm), ly: -1, light: rim, la: .34 + .2 * warm, turn: .92 });
  { const h = M.j.handN, e = M.j.elN, an = Math.atan2(h[1] - e[1], h[0] - e[0]);                                // his phone, lit, in his fist
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(an + .5); ctx.fillStyle = '#0a0b12'; rrect(-9, -30, 18, 44, 4); ctx.fill(); ctx.fillStyle = rgba([205, 228, 255]); rrect(-6.5, -27, 13, 30, 3); ctx.fill(); ctx.restore();
    additive(() => { lite([180, 210, 255], h[0], h[1] - 8, 90, .6); lite([180, 210, 255], h[0], h[1] - 8, 26, .7); }); disc(h[0], h[1], 11, rgba(PAL.ink)); }
  // the wet road mirrors all of it
  wet(G + 6, 250, .5, t, 8);
  ripples(t, camx - 900, camx + 900, G + 10, 1090, 40, [200, 220, 255], .3, 6);
  strRow(camx, z, 1.25, 520, (i, x) => strStreak(x, 968, 230, 9, [200, 210, 255], .16, 90));                      // the road's markings
  // spray at each footfall, left behind on the road as he runs on
  for (let f = 0; f < 2; f++) for (let n = -1; n < 5; n++) {
    const Ln = (Math.PI / 2 + TAU * n - ph0 - f * Math.PI) / (TAU * cad), a = L - Ln; if (a < 0 || a > .42) continue;
    const fx = 400 + v * Ln + 124, k = a / .42;
    ctx.strokeStyle = rgba([210, 225, 255], .55 * (1 - k)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(fx, G + 8, 30 + 170 * k, 6 + 20 * k, 0, 0, TAU); ctx.stroke();
    additive(() => { for (let i = 0; i < 26; i++) {
      const vx = -300 + rnd(i * 3.1 + n * 7 + f) * 720, vy = 280 + rnd(i * 5.7 + n * 3 + f) * 640, x = fx + vx * a, y = G - (vy * a - 1500 * a * a);
      if (y > G + 4) continue;
      lite([190, 215, 255], x, y, 7 + rnd(i * 9.1) * 10, .85 * (1 - k)); lite(mix([190, 215, 255], PAL.lamp, warm), x, y, 16, .2 * (1 - k));
    } });
    blurred(3, () => poly([[fx - 40, G + 4], [fx + 50, G + 4], [fx + 90 + 120 * k, G - 60 - 90 * Math.sin(k * Math.PI)], [fx - 80 - 60 * k, G - 40 - 70 * Math.sin(k * Math.PI)]], rgba([170, 200, 255], .22 * (1 - k))));
  }
  additive(() => lite(rim, mx + 30, 600, 520, .07 + .1 * warm));
  // lamp posts on our side of the road whip through, close to the lens
  blurred(18, () => strRow(camx, z, 2.3, 3900, (i, x) => { rectf(x + 900, -400, 96, 1900, rgba([4, 5, 16], .96)); rectf(x + 900, -400, 14, 1900, rgba(PAL.lamp, .25)); }, 1500));
  rain(t, { n: 260, len: 150, speed: 2900, slant: -.42, a: .36, w: 2.4, seed: 3 });
  cam(...fr);
  blurred(9, () => { for (let i = 0; i < 9; i++) { const k = (t * 2.6 + rnd(i * 9.3)) % 1, x = camx - 800 + rnd(i * 4.1) * 1900 - k * 500; stroke([[x, 100 + k * 1000], [x + 90, 100 + k * 1000 - 210]], 9, rgba([190, 210, 255], .2)); } });
}, { bloom: .46, grain: .55 }, [600, 170, 1300, 1010]);

// ---------- PUDDLE: road level; his foot comes down, a crown of water ----------
function strShoe(rimC, ra) {                                               // origin: the middle of the sole; heel at -205, toe at +285
  const top = () => { ctx.beginPath(); ctx.moveTo(-206, -8); ctx.quadraticCurveTo(-222, -90, -184, -168); ctx.lineTo(-52, -178); ctx.quadraticCurveTo(50, -150, 150, -96); ctx.quadraticCurveTo(262, -84, 290, -38); ctx.quadraticCurveTo(298, -4, 264, 0); ctx.lineTo(-190, 0); ctx.closePath(); };
  ctx.save(); ctx.lineJoin = 'round'; ctx.shadowColor = rgba(rimC, ra); ctx.shadowBlur = 18 * pxPerUnit(ctx); ctx.strokeStyle = rgba(rimC, ra); ctx.lineWidth = 9; top(); ctx.stroke(); ctx.restore();
  top(); ctx.fillStyle = lg(0, -180, 0, 0, [[0, [22, 26, 44]], [1, [8, 9, 16]]]); ctx.fill();
  ctx.fillStyle = rgba([40, 46, 74]); rrect(-208, -26, 500, 28, 12); ctx.fill(); rectf(-200, -27, 480, 4, rgba(rimC, .5 * ra));
  ctx.strokeStyle = rgba(mix([22, 26, 44], rimC, .5), .7); ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-40, -170); ctx.quadraticCurveTo(54, -146, 146, -98); ctx.stroke();
  for (let i = 0; i < 4; i++) line(-6 + i * 40, -158 + i * 17, 26 + i * 40, -128 + i * 18);                       // laces
}
shot('puddle', (t, p, L, len) => {
  const hit = p.hit ?? .15, a = L - hit, G = 806, cx = 930, on = a >= 0;
  fill([22, 26, 88], [6, 8, 26]);
  const fr = kcam(L, len, [[0, 1.02, 960, 566], [1, 1.1, 985, 588]], { hand: .5, t, jolt: on ? Math.max(0, 1 - a / .2) * .9 : 0 });
  // the street, far and soft: shop light, two lamp posts, the kerb
  blurred(20, () => {
    rectf(-500, -400, 3000, 880, lg(0, -400, 0, 480, [[0, [16, 20, 76]], [1, [52, 46, 140]]]));
    for (let i = 0; i < 8; i++) rectf(-420 + i * 380, 190 + rnd(i * 3.3) * 90, 250, 290 - rnd(i * 3.3) * 90, rgba([[255, 140, 60], PAL.tealL, [255, 120, 70], [255, 160, 100]][i % 4], .7));
    rectf(-500, 452, 3000, 46, rgba([20, 22, 64]));
    for (const x of [410, 1350]) rectf(x - 22, -400, 44, 880, rgba([8, 10, 28]));
  });
  additive(() => { lite([255, 190, 140], 1350, -20, 480, .6); lite([255, 190, 140], 410, -60, 360, .4); });
  bokeh(23, 12, [-200, 120, 2100, 430], [PAL.amber, PAL.lamp, PAL.tealG, [150, 130, 255]], 26, 70, .34, t);
  // the road, wet: the lamps lie on it in long streaks
  ctx.fillStyle = lg(0, 486, 0, 1250, [[0, [36, 40, 116]], [.4, [20, 24, 76]], [1, [8, 10, 30]]]); ctx.fillRect(-500, 486, 3000, 900);
  additive(() => { for (const [x, k] of [[1350, 1], [410, .55]]) { ctx.fillStyle = lg(0, 486, 0, 1150, [[0, PAL.lamp, .34 * k], [1, PAL.lamp, 0]]); poly([[x - 50, 486], [x + 50, 486], [x + 190, 1150], [x - 190, 1150]]); ctx.fill(); } });
  // the puddle: lighter than the road, the sky and the lamp in it
  const pud = () => { ctx.beginPath(); ctx.ellipse(960, G + 24, 930, 214, 0, 0, TAU); };
  blurred(7, () => { pud(); ctx.fillStyle = lg(0, G - 190, 0, G + 238, [[0, [74, 90, 196]], [.5, [42, 52, 140]], [1, [18, 22, 72]]]); ctx.fill(); });
  ctx.save(); pud(); ctx.clip();
  const A = on ? 5 + 84 * Math.exp(-a * 4.4) * clamp(a / .05) : 5, sh = on ? Math.exp(-a * 4.5) : 0;
  blurred(4, () => { for (const [rx, ry, hw, col, al] of [[1350, G + 14, 60, [255, 176, 110], .8], [1350, G + 14, 24, [255, 236, 210], .85], [520, G - 26, 36, PAL.tealG, .4]]) {
    ctx.fillStyle = rgba(col, al * (1 - .35 * sh));
    for (let q = 0; q < 76; q++) {
      const k = q / 75, y = ry - 152 + q * 4, w = hw * Math.pow(Math.sin(Math.PI * k), .55) + 2, dx = Math.sin(q * .2 + t * 9) * A * (.35 + k) + Math.sin(q * .55 - t * 26) * 22 * sh;
      ctx.beginPath(); ctx.ellipse(rx + dx, y, w * (1 + .5 * sh), 3.4, 0, 0, TAU); ctx.fill();
    }
  } });
  ctx.restore();
  ctx.strokeStyle = rgba([180, 198, 255], .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(960, G + 24, 924, 208, 0, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
  ripples(t, 120, 1800, G - 150, G + 190, 26, [210, 225, 255], .4, 9);
  // his shadow on the water before he lands
  if (!on) { const k = clamp(L / hit); oval(cx, G + 14, 330 * k, 30 * k, rgba([4, 6, 22], .5 * k)); }
  // the crown: petals of water round the foot, drops on arcs off their tips, rings running out
  const pet = [];
  if (on) for (let i = 0; i < 18; i++) {
    const phi = (i + .5 + (rnd(i * 3.7) - .5) * .6) / 18 * TAU, T = .5 + rnd(i * 5.1) * .22, x = a / T; if (x >= 1) continue;
    const R = 240 + 430 * Math.pow(a, .7), b = [cx + Math.cos(phi) * R * (.86 + .14 * rnd(i * 2.3)), G + 12 + Math.sin(phi) * R * .2];
    const h = (220 + 280 * rnd(i * 7.9)) * Math.pow(Math.sin(Math.PI * Math.min(1, x * 1.1)), .8) * (.7 + .3 * Math.abs(Math.cos(phi))), out = (40 + 320 * x) * Math.cos(phi) + 30 * Math.sin(phi * 3 + i);
    pet.push({ phi, b, tip: [b[0] + out, b[1] - h], c: [b[0] + out * .2, b[1] - h * .8], x, w: 96 - 50 * x, i });
  }
  const crown = front => {
    const js = pet.filter(j => (Math.sin(j.phi) > 0) === front).sort((p1, p2) => Math.cos(p1.phi) - Math.cos(p2.phi)); if (!js.length) return;
    if (js.length > 1) {                                                    // the thin wall of water between them
      ctx.beginPath(); ctx.moveTo(js[0].b[0], js[0].b[1]); for (const j of js) ctx.lineTo(lerp(j.b[0], j.c[0], .6), lerp(j.b[1], j.c[1], .6)); for (const j of js.slice().reverse()) ctx.lineTo(j.b[0], j.b[1]); ctx.closePath();
      ctx.fillStyle = rgba([150, 180, 255], front ? .26 : .2); ctx.fill();
    }
    for (const j of js) {
      const lit = clamp(Math.cos(j.phi) * .8 + .25), col = mix([190, 214, 255], [255, 206, 160], lit * .7), fade = 1 - j.x * .55;
      ctx.beginPath(); ctx.moveTo(j.b[0] - j.w / 2, j.b[1]); ctx.quadraticCurveTo(j.c[0] - j.w * .32, j.c[1], j.tip[0], j.tip[1]); ctx.quadraticCurveTo(j.c[0] + j.w * .32, j.c[1], j.b[0] + j.w / 2, j.b[1]); ctx.closePath();
      ctx.fillStyle = lg(0, j.tip[1], 0, j.b[1], [[0, mix(col, [255, 255, 255], .5), .9 * fade], [.5, col, .6 * fade], [1, col, .25 * fade]]); ctx.fill();
      ctx.strokeStyle = rgba([245, 249, 255], .7 * fade); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(j.b[0] - j.w / 2, j.b[1]); ctx.quadraticCurveTo(j.c[0] - j.w * .32, j.c[1], j.tip[0], j.tip[1]); ctx.stroke();
      disc(j.tip[0], j.tip[1] - 6, 9 * fade + 2, rgba(mix(col, [255, 255, 255], .6), .95 * fade));
    }
  };
  const drops = front => { if (!on) return; for (let i = 0; i < 40; i++) {
    const phi = rnd(i * 4.3) * TAU; if ((Math.sin(phi) > 0) !== front) continue;
    const vx = Math.cos(phi) * (240 + rnd(i * 6.1) * 820), vy = 900 + rnd(i * 8.7) * 1000, x = cx + Math.cos(phi) * 210 + vx * a, y = G - (vy * a - 1900 * a * a);
    if (y > G + 30 || a < .03) continue;
    const r = 3.5 + rnd(i * 2.9) * 7, an = Math.atan2(-(vy - 3800 * a), vx), col = mix([214, 230, 255], [255, 214, 170], clamp(Math.cos(phi)) * .6);
    ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.fillStyle = rgba(col, .92); ctx.beginPath(); ctx.ellipse(0, 0, r * 1.45, r, 0, 0, TAU); ctx.fill(); ctx.restore();
    disc(x - r * .3, y - r * .3, r * .32, rgba([255, 255, 255], .9));
    additive(() => lite(col, x, y, r * 2.6, .3));
  } };
  if (on) for (let j = 0; j < 3; j++) { const aa = a - j * .06; if (aa <= 0) continue; const k = clamp(aa / .6), r = 200 + 1300 * aa; ctx.strokeStyle = rgba([220, 232, 255], .5 * (1 - k)); ctx.lineWidth = 7 - 4 * k; ctx.beginPath(); ctx.ellipse(cx, G + 14, r, r * .2, 0, 0, TAU); ctx.stroke(); }
  crown(false); drops(false);
  // his shoe and shin: down hard, then rolling off the toe and gone
  const fall = on ? 0 : 1 - clamp(L / hit), roll = seg(a, .24, .5), leave = seg(a, .4, .7, ease.in);
  const sx = cx - 40 - 230 * Math.pow(fall, 1.4) + leave * 520, sy = G + (on ? 10 * (1 - leave) : 0) - 470 * fall - leave * 560, rot = -.24 * fall + .44 * roll, piv = rot >= 0 ? 262 : -190;
  const rimC = mix(STR.blue, PAL.lamp, .45), th = lerp(-.34, .5, seg(a, -.05, .55)) - rot;
  ctx.save(); ctx.translate(sx + piv, sy); ctx.rotate(rot); ctx.translate(-piv, 0);
  strLimbs([[[[-116, -150], [-116 + Math.sin(th) * 1100, -150 - Math.cos(th) * 1100]], 176]], [10, 12, 22], rimC, .8, .7, -.4);
  ctx.save(); ctx.translate(-116, -176); ctx.rotate(th); rectf(-96, -12, 192, 22, rgba([5, 6, 12])); rectf(-96, -12, 192, 3, rgba(rimC, .4)); ctx.restore();
  strShoe(rimC, .85);
  ctx.restore();
  if (on) blurred(8, () => oval(cx, G + 16, 300 + 500 * a, 26 + 30 * a, rgba([225, 235, 255], .34 * (1 - clamp(a / .5)))));   // foam where it broke
  crown(true); drops(true);
  // water flung at the lens
  if (on) blurred(15, () => { for (let i = 0; i < 9; i++) { const an = -Math.PI * (.12 + .76 * rnd(i * 3.9)), sp = 900 + rnd(i * 5.5) * 1500, x = cx + Math.cos(an) * sp * a, y = G + Math.sin(an) * sp * a + 900 * a * a; oval(x, y, 18 + 90 * a, 16 + 70 * a, rgba([180, 205, 255], .34 * (1 - clamp(a / .62)))); } });
  rain(t, { n: 230, len: 130, speed: 2700, slant: -.25, a: .34, seed: 8 });
  cam(...fr);
}, { bloom: .5, grain: .55 }, [560, 250, 1360, 1000]);

// ---------- RUNFACE: his face, running at us; rain, lamps sweeping over him ----------
function strRainLens(t, n, vp, a, k0 = 0, k1 = 1, seed = 0) {            // rain flying at the lens, out from vp; k0..k1 picks the far or near part of each drop's flight
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const an = rnd(i * 2.7 + seed) * TAU, k = lerp(k0, k1, (rnd(i * 7.1 + seed) + t * (1.5 + rnd(i * 3.3) * 1.5)) % 1), dx = Math.cos(an), dy = Math.sin(an) * .8 + .55, dn = Math.hypot(dx, dy);
    const r = 70 + 1500 * k * k, ln = 24 + 380 * k * k;
    ctx.strokeStyle = rgba(mix(PAL.rainB, [235, 242, 255], k), a * Math.min(1, k * 5) * (1 - k * .35)); ctx.lineWidth = 1.4 + 5 * k;
    ctx.beginPath(); ctx.moveTo(vp[0] + dx / dn * r, vp[1] + dy / dn * r); ctx.lineTo(vp[0] + dx / dn * (r + ln), vp[1] + dy / dn * (r + ln)); ctx.stroke();
  }
}
shot('runface', (t, p, L, len) => {
  const u = clamp(L / len), st = L * 2.9 * Math.PI + .7, c1 = len * .27, c2 = len * .78, wd = len * .2, w1 = strBump(L, c1, wd), w2 = strBump(L, c2, wd), warm = Math.max(w1, w2);
  const sw = clamp(((w1 >= w2 ? L - c1 : L - c2) + wd) / (2 * wd));                                              // 0 … 1 through a sweep
  fill([24, 28, 96], [8, 10, 32]);
  const fr = kcam(L, len, [[0, 1, 960, 548], [1, 1.07, 960, 538]], { hand: 1, t, jolt: .1 });
  // the street he has come down runs away behind him: lamps and windows shrink toward its far end
  const VP = [1400, 420], items = [];
  for (let i = 0; i < 9; i++) for (const sd of [-1, 1]) { const zz = ((i * 1.0 + (sd > 0 ? .5 : 0) + L * 2.7) % 9) + .22, k = 1 / (1 + zz); items.push({ k, sd, i, x: VP[0] + sd * 1500 * k, y: VP[1] - 1050 * k, gy: VP[1] + 560 * k }); }
  blurred(9, () => {
    poly([[VP[0] - 30, VP[1]], [VP[0] + 30, VP[1]], [2700, 1300], [-800, 1300]], lg(0, VP[1], 0, 1100, [[0, [60, 60, 160]], [1, [14, 16, 50]]]));
    for (const sd of [-1, 1]) poly([[VP[0] + sd * 40, VP[1] - 30], [VP[0] + sd * 40, VP[1] + 14], [VP[0] + sd * 2400, 1100], [VP[0] + sd * 2400, -700]], rgba([18, 20, 66]));   // the house fronts either side
    for (const q of items) { const c = [PAL.amber, PAL.tealL, [255, 150, 70], [150, 130, 255]][(q.i + (q.sd > 0 ? 1 : 0)) % 4]; rectf(VP[0] + q.sd * 2300 * q.k - 150 * q.k, VP[1] - 420 * q.k, 300 * q.k, 330 * q.k, rgba(c, .75 * clamp(q.k * 6))); }
    for (const q of items) { ctx.strokeStyle = rgba([8, 10, 30]); ctx.lineWidth = 34 * q.k; line(q.x, q.y, q.x, q.gy); }
  });
  additive(() => { for (const q of items) {
    const al = clamp(q.k * 7);
    lite(PAL.lamp, q.x, q.y, 380 * q.k + 14, .6 * al); lite([255, 232, 200], q.x, q.y, 90 * q.k + 4, .6 * al);
    ctx.save(); ctx.translate(q.x, q.gy + 120 * q.k); ctx.scale(.3, 1); lite(PAL.lamp, 0, 0, 520 * q.k, .3 * al); ctx.restore();
  } });
  haze(t, -200, 2100, 470, 260, [80, 80, 190], .08, 2, 7);
  rain(t, { n: 150, len: 100, speed: 2300, slant: .08, a: .22, seed: 4 }); cam(...fr);
  strRainLens(t, 60, VP, .3, 0, .55, 1);
  // light passing over him: warm from a lamp, then the blue night again
  additive(() => lite(PAL.lamp, lerp(1900, 60, sw), 150, 1000, .22 * warm));
  const bx = 944 + Math.sin(st) * 13, by = 486 - Math.abs(Math.sin(st)) * 24 + 10, r = 250, tilt = Math.sin(st + .5) * .04 - .02;
  const blink = strBump(L, len * .52, .09), breath = .5 + .5 * Math.sin(st * 1.0 + 1.2);
  const ex = Object.assign({}, exMix('strain', 'fear', .5), { lid: .04 + .85 * blink, brow: .62, browH: .13, open: .95 + .4 * breath, grit: 0, smile: -.42, gx: .15, gy: -.1, sweat: 1, tear: 0 });
  const rim = mix(STR.blue, PAL.lamp, warm), lc = [lerp(-.75, lerp(.9, -.5, sw), warm), -.45];
  additive(() => { lite(mix(STR.blue, PAL.lamp, warm), bx - 40, by + 60, 760, .2 + .1 * warm); });
  manBust(bx, by, r, ex, { rim, ra: .78 + .2 * warm, lc, light: rim, la: .34 + .24 * warm, turn: .5, wet: .5, t, tilt });
  { const mx = bx + r * lerp(0, .46, .5), my = by + .45 * r, mw = .32 * r * lerp(1, .8, .5), cy = my - ex.smile * .05 * r, dip = my + ex.smile * .1 * r, lo = ex.open * .16 * r;   // his open mouth: its lower lip (the engine draws the upper)
    ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt); ctx.translate(-bx, -by); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mx - mw / 2, cy); ctx.quadraticCurveTo(mx, dip - lo * .2, mx + mw / 2, cy); ctx.quadraticCurveTo(mx, dip + lo * 1.3, mx - mw / 2, cy); ctx.fillStyle = rgba([58, 26, 30]); ctx.fill();
    ctx.strokeStyle = rgba(C.cream, .9); ctx.lineWidth = .03 * r; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
  // rain running off his head, his breath in the cold
  ctx.save(); ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.clip(); ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) { const k = (t * (.5 + rnd(i * 2.1) * .5) + rnd(i * 5.9)) % 1, x = bx + (rnd(i * 3.3) - .5) * r * 1.5, y = by - r + k * r * 1.5; stroke([[x, y], [x + 2, y + 26 + 20 * k]], 4, rgba(mix([200, 220, 255], rim, .5), .4 * (1 - k))); }
  ctx.restore();
  additive(() => { for (let i = 0; i < 14; i++) { const k = (t * 2.2 + rnd(i * 3.7)) % 1, an = -Math.PI * (.08 + .84 * rnd(i * 5.3)), d = r * (1.02 + k * .5); lite(rim, bx + Math.cos(an) * d, by + Math.sin(an) * d + k * k * 90, 7 + 5 * rnd(i), .7 * (1 - k)); } });
  strRainLens(t, 46, [VP[0] - 60, VP[1] - 40], .5, .45, 1, 9);
}, { bloom: .44, grain: .55 }, [640, 190, 1280, 880]);

// ---------- WALKAWAYPIC: the last picture. Golden hour; Lily on his shoulders, they walk into the sun ----------
// The upper middle of the frame (x 500-1420, y 300-640) is kept calm and bright for the film's last words.
const strCamH = 480;                                                       // the camera's height over the road, in road units
const strP = (X, Hh, k) => [960 + X * k, 640 + (strCamH - Hh) * k];       // X across the road from its middle, Hh above the ground, k the depth scale (1 near … 0 the horizon)
const strGlare = [250, 188, 150];
const strFar = (c, k) => mix(strGlare, c, clamp(Math.pow(clamp(k * 1.15), 1.4)));
// the two of them from behind: he walks (ph), she rides his shoulders, her legs down either side of his head, her boots in
// his hands; o.wings 0-1 her arms out (0 = her hands on his head); o.flat one colour (their shadow)
function strRide(x, gy, s, ph, o = {}) {
  const flat = o.flat, ink = flat || PAL.ink, rimC = o.rim || [255, 220, 170], ra = flat ? 0 : (o.ra ?? .9), w = o.wings || 0;
  const lf = Math.max(0, Math.sin(ph)), rf = Math.max(0, -Math.sin(ph)), bx = x + (lf - rf) * 4 * s, bob = (1 - Math.abs(Math.sin(ph))) * 5 * s - (o.hop || 0) * s;
  const hipY = gy - 192 * s + bob, shY = hipY - 172 * s;
  const leg = (sd, lift) => { const hip = [bx + sd * 19 * s, hipY], foot = [x + sd * 24 * s, gy - lift * 15 * s]; return [hip, [lerp(hip[0], foot[0], .5) + sd * (3 + lift * 6) * s, lerp(hip[1], foot[1], .5) - lift * 7 * s], foot]; };
  const arm = sd => [[bx + sd * 47 * s, shY + 14 * s], [bx + sd * 90 * s, shY + 70 * s], [bx + sd * 56 * s, shY - 8 * s]];
  const P = { head: [bx, shY - 58 * s, 38 * s], parts: [[leg(-1, lf), 33 * s], [leg(1, rf), 33 * s], [[[bx, hipY - 6 * s], [bx, shY + 12 * s]], 76 * s], [[[bx - 40 * s, shY + 8 * s], [bx + 40 * s, shY + 8 * s]], 34 * s], [arm(-1), 22 * s], [arm(1), 22 * s]] };
  if (flat) { for (const [pts, wd] of P.parts) stroke(pts, wd, rgba(flat)); disc(P.head[0], P.head[1], P.head[2], rgba(flat)); }
  else drawPerson(P, ink, rimC, ra, 0, -1, false);
  const sL = 1.45 * s, rock = Math.sin(ph - .7) * 3 * s, lx = bx + rock, seat = shY - 72 * s, top = seat - 60 * sL, hd = [lx + rock * .5, top - 31 * sL], hr = 31 * sL;
  const Y = flat || PAL.yellow, YD = flat || PAL.yellowD, YL = flat || PAL.yellowL;
  const legs = [-1, 1].map(sd => [[[lx + sd * 12 * sL, seat], [bx + sd * 47 * s, shY - 38 * s], [bx + sd * 54 * s, shY + 2 * s]], 12.5 * sL]);
  if (flat) for (const [pts, wd] of legs) stroke(pts, wd, rgba(flat)); else strLimbs(legs, ink, rimC, ra * .8, 0, -1, 8);
  for (const sd of [-1, 1]) {                                              // her boots, and his hands round her shins
    stroke([[bx + sd * 54 * s, shY - 2 * s], [bx + sd * 55 * s, shY + 13 * s]], 13.5 * sL, rgba(Y));
    disc(bx + sd * 55 * s, shY - 15 * s, 12.5 * s, rgba(flat || mix(ink, rimC, .3))); disc(bx + sd * 55 * s, shY - 13 * s, 11.5 * s, rgba(ink));
  }
  const coat = () => { ctx.beginPath(); ctx.moveTo(lx - 20 * sL, top); ctx.lineTo(lx + 20 * sL, top); ctx.quadraticCurveTo(lx + 30 * sL, top + 30 * sL, lx + 34 * sL, seat + 8 * sL); ctx.quadraticCurveTo(lx, seat + 18 * sL, lx - 34 * sL, seat + 8 * sL); ctx.quadraticCurveTo(lx - 30 * sL, top + 30 * sL, lx - 20 * sL, top); ctx.closePath(); };
  coat(); ctx.fillStyle = flat ? rgba(flat) : lg(lx - 34 * sL, 0, lx + 34 * sL, 0, [[0, YD], [.3, Y], [.7, Y], [1, YD]]); ctx.fill();
  if (!flat) { ctx.strokeStyle = rgba(YD, .8); ctx.lineWidth = 1.6 * sL; coat(); ctx.stroke(); ctx.strokeStyle = rgba(YD, .55); ctx.lineWidth = 1.4 * sL; line(lx, top + 6 * sL, lx, seat + 10 * sL); }
  const armPts = sd => {                                                    // down: her hands on his head; out: wings
    const down = [[lx + sd * 33 * sL, top + 30 * sL], [bx + sd * 31 * s, shY - 80 * s]], out = [[lx + sd * 47 * sL, top + 6 * sL], [lx + sd * 75 * sL, top + (-2 + Math.sin(ph * 2 + sd) * 3) * sL]];
    return [[lx + sd * 19 * sL, top + 8 * sL], v2.lerp(down[0], out[0], w), v2.lerp(down[1], out[1], w)];
  };
  for (const sd of [-1, 1]) { const a = armPts(sd); if (!flat) stroke(a, 16.5 * sL, rgba(YD, .9)); stroke(a, 13.5 * sL, rgba(flat || mix(Y, YD, .3))); disc(a[2][0], a[2][1], 6.5 * sL, rgba(ink)); }
  disc(hd[0], hd[1], hr * 1.24, rgba(Y));
  if (!flat) {
    ctx.save(); ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.24, 0, TAU); ctx.clip();
    ctx.fillStyle = lg(0, hd[1] - hr * 1.24, 0, hd[1] + hr * 1.24, [[0, YL, .95], [.45, Y, 0], [1, YD, .7]]); ctx.fillRect(hd[0] - hr * 2, hd[1] - hr * 2, hr * 4, hr * 4);
    ctx.strokeStyle = rgba(YD, .6); ctx.lineWidth = 1.4 * sL; line(hd[0], hd[1] - hr * 1.2, hd[0], hd[1] + hr * 1.24); ctx.restore();
    ctx.strokeStyle = rgba(YD, .8); ctx.lineWidth = 1.5 * sL; ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.24, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba([255, 250, 224], .9); ctx.lineWidth = 2.6 * sL; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.2, Math.PI * 1.14, Math.PI * 1.86); ctx.stroke();
  }
}
function strHouseRow(sd, t) {
  const ks = [2.4, 1.36, 1.02, .84, .74], hs = sd < 0 ? [1000, 900, 1060, 880] : [940, 1040, 900, 1000], X = sd * 664;
  const cols = sd < 0 ? [[150, 98, 100], [98, 112, 136], [132, 102, 124], [96, 122, 120]] : [[100, 116, 138], [146, 104, 104], [92, 120, 118], [136, 106, 126]];
  const kAt = (i, f) => 1 / lerp(1 / ks[i], 1 / ks[i + 1], f);
  for (let i = ks.length - 2; i >= 0; i--) {
    const k0 = ks[i], k1 = ks[i + 1], h = hs[i], c = cols[i], km = (k0 + k1) / 2;
    const q = (f, Hh) => strP(X, Hh, kAt(i, f));
    ctx.fillStyle = lg(0, strP(X, h, km)[1], 0, strP(X, 0, km)[1], [[0, strFar(mix(c, [255, 200, 150], .3), km)], [1, strFar(mix(c, [40, 26, 60], .3), km)]]);
    poly([q(0, 0), q(0, h), q(1, h), q(1, 0)]); ctx.fill();
    poly([q(0, h), q(0, h + 70), q(1, h + 70), q(1, h)], rgba(strFar(mix(c, [50, 30, 50], .55), km)));       // the roof's edge
    stroke([q(0, h + 70), q(1, h + 70)], 3, rgba([255, 226, 180], .8));
    for (let r = 0; r < 2; r++) for (let j = 0; j < 3; j++) {                                                    // windows: some hold the sky
      const f0 = .12 + j * .3, f1 = f0 + .17, y0 = 330 + r * 330, y1 = y0 + 190, lit = rnd(i * 7.3 + j * 3.1 + r + (sd > 0 ? 9 : 0)) > .45;
      poly([q(f0, y0), q(f0, y1), q(f1, y1), q(f1, y0)], rgba(strFar(lit ? [255, 196, 164] : mix(c, [30, 30, 60], .6), km), lit ? .9 : .95));
    }
    poly([q(.46, 0), q(.46, 250), q(.58, 250), q(.58, 0)], rgba(strFar(mix(c, [30, 20, 40], .7), km)));     // a door
    stroke([q(1, 0), q(1, h + 70)], 2.5, rgba([40, 26, 50], .35));
  }
}
shot('walkawaypic', (t, p, L, len) => {
  const u = clamp(L / len), ph = L * TAU * .86 + .4;
  fill([116, 150, 214], [120, 80, 84]);
  const fr = kcam(L, len, p.cam || [[0, 1, 960, 542], [1, 1.04, 960, 530]], { hand: .2, t });
  // the sky: blue above, peach, then gold over the far end of the road; a low sun behind the haze
  rectf(-800, -700, 3520, 1342, lg(0, -500, 0, 640, [[0, [100, 138, 212]], [.5, [204, 160, 192]], [.76, [246, 176, 156]], [1, [252, 188, 150]]]));
  ctx.fillStyle = rg(960, 652, 0, 760, [[0, [255, 214, 188], .95], [.16, [255, 202, 170], .8], [.5, [253, 188, 152], .3], [1, [253, 188, 152], 0]]); ctx.fillRect(-800, -700, 3520, 1342);
  blurred(10, () => { for (let i = 0; i < 6; i++) { const x = [-140, 260, 1500, 1880, 620, 1240][i] + L * (5 + i), y = [120, 60, 90, 180, -40, -10][i]; oval(x, y, 190 + rnd(i * 3) * 120, 15 + rnd(i * 5) * 10, rgba([255, 206, 180], .5)); } });   // thin cloud, high and to the sides
  // the ground: gardens, pavements, the road running to the sun
  rectf(-800, 640, 3520, 900, lg(0, 640, 0, 1100, [[0, [248, 186, 148]], [.12, [200, 148, 116]], [1, [84, 82, 76]]]));
  for (const sd of [-1, 1]) { ctx.fillStyle = lg(0, 640, 0, 1100, [[0, [250, 190, 152]], [.2, [218, 158, 132]], [1, [120, 88, 98]]]); poly([strP(sd * 420, 0, .01), strP(sd * 664, 0, .01), strP(sd * 664, 0, 2.4), strP(sd * 420, 0, 2.4)]); ctx.fill(); }
  ctx.fillStyle = lg(0, 640, 0, 1100, [[0, [252, 194, 156]], [.1, [228, 156, 126]], [.34, [166, 106, 104]], [1, [88, 60, 80]]]); poly([strP(-420, 0, .01), strP(420, 0, .01), strP(420, 0, 2.4), strP(-420, 0, 2.4)]); ctx.fill();
  ctx.fillStyle = lg(0, 640, 0, 1080, [[0, [255, 214, 190], .7], [.3, [255, 200, 168], .3], [1, [255, 190, 150], 0]]); poly([strP(-70, 0, .01), strP(70, 0, .01), strP(190, 0, 2.2), strP(-190, 0, 2.2)]); ctx.fill();   // the sun lies on the road
  for (const sd of [-1, 1]) { stroke([strP(sd * 420, 0, .02), strP(sd * 420, 0, 2.4)], 5, rgba([255, 222, 176], .6)); stroke([strP(sd * 434, 0, .02), strP(sd * 434, 0, 2.4)], 4, rgba([60, 36, 60], .28)); }
  for (let n = 0; n < 12; n++) { const Z = .5 + n * .3, k0 = 1 / Z, k1 = 1 / (Z + .12); poly([strP(-7, 0, k0), strP(7, 0, k0), strP(7, 0, k1), strP(-7, 0, k1)], rgba([255, 232, 200], .5 * clamp(k0 * 1.5))); }
  // hedges and garden walls, the houses near us, young trees along the kerb with long shadows toward us
  for (const sd of [-1, 1]) {
    ctx.fillStyle = lg(0, 640, 0, 1000, [[0, strGlare], [.16, [150, 128, 96]], [1, [52, 70, 58]]]); poly([strP(sd * 700, 0, .02), strP(sd * 700, 170, .02), strP(sd * 700, 170, .74), strP(sd * 700, 0, .74)]); ctx.fill();
    strHouseRow(sd, t);
    ctx.fillStyle = lg(0, 640, 0, 1100, [[0, strGlare], [.2, [172, 124, 108]], [1, [96, 66, 80]]]); poly([strP(sd * 664, 0, .02), strP(sd * 664, 96, .02), strP(sd * 664, 96, 2.4), strP(sd * 664, 0, 2.4)]); ctx.fill();
    stroke([strP(sd * 664, 96, .05), strP(sd * 664, 96, 2.4)], 3, rgba([255, 226, 180], .7));
    [.31, .4, .52, .7, .98, 1.5].forEach((k0, n) => {                            // young trees, each a little different
      const k = k0 * (1 + (rnd(n * 3.1 + sd) - .5) * .08), X = sd * (536 + rnd(n * 5.7 + sd) * 40), sway = Math.sin(t * 1.1 + k * 9 + sd) * 5, k2 = 1 / Math.max(.3, 1 / k - 1.15), base = strP(X, 0, k), sz = .82 + rnd(n * 7.3 + sd * 2) * .3, cTop = strP(X, 310 + 40 * sz, k);
      ctx.fillStyle = lg(0, base[1], 0, strP(X, 0, k2)[1], [[0, [70, 38, 80], .44], [1, [70, 38, 80], .12]]); poly([strP(X - 9, 0, k), strP(X + 9, 0, k), strP(X + 130 * sz, 0, k2), strP(X - 130 * sz, 0, k2)]); ctx.fill();
      stroke([base, strP(X, 280, k)], 14 * k, rgba(strFar([52, 32, 44], k)));
      for (const [ox, oy, r] of [[0, 0, 96], [-58, 30, 66], [60, 24, 70], [-6, -52, 64]]) disc(cTop[0] + (ox * sz + sway) * k, cTop[1] + oy * sz * k, r * sz * k, rgba(strFar([46, 78, 72], k)));
      for (const [ox, oy, r] of [[-16, -44, 50], [44, -6, 42], [-52, 8, 38]]) disc(cTop[0] + (ox * sz + sway) * k, cTop[1] + oy * sz * k, r * sz * k, rgba(strFar([92, 124, 96], k), .8));
      ctx.strokeStyle = rgba([255, 206, 170], .8 * clamp(k * 2)); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.arc(cTop[0] + (-6 * sz + sway) * k, cTop[1] - 52 * sz * k, 64 * sz * k, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    });
  }
  // the glare at the end of the road takes the far things
  ctx.fillStyle = rg(960, 646, 0, 520, [[0, [255, 212, 190], .6], [.4, [254, 196, 164], .3], [1, [254, 190, 152], 0]]); ctx.fillRect(-200, 300, 2320, 700);
  motes(t, [330, 660, 1590, 1060], 26, [255, 222, 176], .3, 8);
  // the two of them: away from us, up the middle of the road, into the light
  const k = 1 / lerp(1 / .72, 1 / .64, u), [fx, fy] = strP(14, 0, k), s = .74 * k, hop = strBump(L, len * .47, .2) * 8, wings = (p.wings ?? 1) * seg(L, len * .44, len * .6, ease.back);
  blurred(3.5, () => { ctx.save(); ctx.translate(fx, fy + 2); ctx.scale(1.7, -2.3); ctx.translate(-fx, -fy); strRide(fx, fy, s, ph, { flat: [60, 34, 64], wings, hop: 0 }); ctx.restore(); });                    // their long shadow, toward us
  ctx.fillStyle = rg(fx, fy - 250 * s, 0, 330 * s, [[0, [255, 218, 196], .4], [1, [255, 206, 176], 0]]); ctx.fillRect(fx - 400, fy - 700 * s, 800, 800 * s);
  strRide(fx, fy, s, ph, { wings, hop, rim: [255, 226, 180], ra: .95 });
  // leaves come down across the road; a branch near the lens in each top corner
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1, kk = (t * (.05 + rnd(i * 2.3) * .04) + rnd(i * 5.1)) % 1, x = 960 + side * (570 + rnd(i * 3.7) * 380) + Math.sin(t * 1.3 + i) * 30 - side * kk * 60, y = 200 + kk * 900;
    oval(x, y, 12, 5.5, rgba([[198, 100, 46], [164, 72, 40], [218, 130, 64]][i % 3], .95), t * (1.5 + rnd(i) * 2) + i);
  }
  for (let i = 0; i < 4; i++) { const kk = (t * .07 + rnd(i * 9.1)) % 1; oval(700 + rnd(i * 4.4) * 520 + Math.sin(t + i * 2) * 50, 730 + kk * 370, 9, 4, rgba([204, 108, 50], .9), t * 2.2 + i); }
  blurred(11, () => {
    for (let i = 0; i < 22; i++) { const lf = i < 13, x = lf ? -160 + rnd(i * 3.7) * 600 : 1500 + rnd(i * 3.7) * 560, y = -90 + rnd(i * 5.3) * (lf ? 330 : 250) * (1 - (lf ? rnd(i * 3.7) : 1 - rnd(i * 3.7)) * .55); oval(x + Math.sin(t * 1.2 + i) * 9, y + Math.cos(t + i * 1.7) * 6, 96, 40, rgba([[44, 76, 56], [78, 108, 60], [34, 60, 52]][i % 3], .96), rnd(i * 2.1) * 3); }
    stroke([[-200, 40], [140, 96], [430, 70]], 22, rgba([40, 26, 36])); stroke([[2120, 20], [1800, 80], [1560, 60]], 18, rgba([40, 26, 36]));
  });
}, { bloom: .12, grain: .45 }, [730, 600, 1190, 1070]);
// ---------- THE COMEBACK: the walk home in the rain, and the mornings after ----------
// Shots: walkhome, sink, pushups (p.mode 'watch' | 'count'), bridge, pullups, hand.
// The thread: on the night she would not let him hold her; in each shot she is a little closer to him.
// The night is indigo with warm lamps; the mornings are pink-gold dawn. Lily's yellow is the only yellow.
// Every top-level name here starts with cmb.

const cmbRim = [255, 198, 152];                                            // the dawn sun on a dark figure: gold-pink
const cmbLR = 1.25;                                                        // Lily's scale beside his: she reaches his waist, her head no bigger than his
const cmbU = (L, len) => clamp(L / Math.max(.001, len));
const cmbBump = (v, a, b, c) => v <= a || v >= c ? 0 : v < b ? E.sine(inv(a, b, v)) : E.sine(inv(c, b, v));   // 0 at a, 1 at b, 0 at c
const cmbBlink = (ex, L, at, d = .07) => Math.abs(L - at) < d ? Object.assign({}, ex, { lid: Math.max(ex.lid, 1 - Math.abs(L - at) / d) }) : ex;

// a dark shape of round-capped strokes, lit on the side toward (lx, ly): parts [[pts, w], …].
// o: fill, rim, a, lx, ly, off (how far the lit edge shows), rim2 / a2 / l2 (a second light from another side)
function cmbSil(parts, o = {}) {
  const fillc = o.fill || PAL.ink, rim = o.rim || cmbRim, a = o.a ?? .7, off = o.off ?? 5;
  const n = Math.hypot(o.lx ?? 0, o.ly ?? -1) || 1, ux = (o.lx ?? 0) / n, uy = (o.ly ?? -1) / n;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const edge = (col, al, dx, dy) => {
    if (al <= .003) return;
    ctx.save(); ctx.shadowColor = rgba(col, Math.min(1, al)); ctx.shadowBlur = (o.blur ?? 16) * pxPerUnit(ctx);
    ctx.strokeStyle = rgba(col, Math.min(1, al * 1.35));
    for (const [pts, w] of parts) limb(pts.map(q => [q[0] + dx * off, q[1] + dy * off]), w + off);
    ctx.restore();
  };
  if (o.rim2) { const m = Math.hypot(o.l2[0], o.l2[1]) || 1; edge(o.rim2, o.a2 ?? .5, o.l2[0] / m, o.l2[1] / m); }
  edge(rim, a, ux, uy);
  const hi = mix(fillc, rim, .3);
  for (const [pts, w] of parts) {
    ctx.strokeStyle = rgba(fillc); limb(pts, w);
    if (a > .003) { ctx.strokeStyle = rgba(hi, .5 * Math.min(1, a * 1.3)); limb(pts.map(q => [q[0] + ux * w * .22, q[1] + uy * w * .22]), w * .26); }
  }
}
// the sun, low: a white-gold disc in pink-gold light
function cmbSun(x, y, r, a = 1) {
  additive(() => { lite(PAL.dawnA, x, y, r * 6, .34 * a); lite(PAL.dawnB, x, y, r * 3.2, .5 * a); lite([255, 246, 230], x, y, r * 1.7, .7 * a); });
  disc(x, y, r, rgba([255, 251, 242], a));
}
// his face on a head that is tilted (push-ups, pull-ups): o.tilt radians (+ = chin down), turn, light, la, lc
function cmbManFace(P, ex, o = {}) {
  const [x, y, r] = P.head, e = typeof ex === 'string' ? EXPR[ex] : ex;
  ctx.save(); ctx.translate(x, y); if ((P.d || 1) < 0) ctx.scale(-1, 1); ctx.rotate(o.tilt || 0);
  face(0, 0, r, e, { turn: o.turn ?? .9, light: o.light || cmbRim, la: o.la ?? .32, lc: o.lc || [.5, -.4] });
  ctx.restore();
}
// Lily's face alone, turned: tr 1 = the way she faces … 0 = at us … -1 = back over her shoulder
function cmbLilyFace(P, ex, tr, o = {}) {
  const [hx, hy, r] = P.head, s = P.s, flip = (P.d < 0) !== (tr < 0);
  ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.clip();
  ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); if (flip) ctx.scale(-1, 1);
  face(-1 * s, r * .16, r * 1.22, typeof ex === 'string' ? LILY_EX[ex] : ex, { turn: Math.abs(tr) * .75, light: o.rim || PAL.lamp, la: o.la ?? .28, lc: [.4, -.5], featA: .95 });
  ctx.restore();
}

// =====================================================================================================================
// WALKHOME: night, rain. She walks ahead under the teacher's big umbrella; he follows three steps behind, bare-headed.
// A low camera on the wet road: the kerb is almost level, the lamps run away to the right.
// =====================================================================================================================
const cmbWH = { vx: 3200, yh: 752, x0: 540, c: 24, g: .25, mir: 789 };
// a point of the street: u = how far down it (in lamp spacings from him), v = height above the pavement (px at his distance)
function cmbWP(u, v = 0, c = cmbWH.c) {
  const f = 1 / (1 + cmbWH.g * Math.max(-3.3, u));
  return [cmbWH.vx + (cmbWH.x0 - cmbWH.vx) * f, cmbWH.yh + (c - v) * f, f];
}
const cmbWQ = (u0, u1, v0, v1, c = 4) => [cmbWP(u0, v0, c), cmbWP(u1, v0, c), cmbWP(u1, v1, c), cmbWP(u0, v1, c)];
function cmbStreet(t, sh) {
  const K = cmbWH;
  additive(() => { lite([64, 56, 150], 1960, 560, 1000, .5); lite([130, 96, 200], 2050, 690, 460, .4); });   // the far end of the street glows through the rain
  rectf(-900, K.yh - 6, 4600, 60, rgba([34, 38, 96]));                                 // the pavement: a thin band from down here
  for (let i = 18; i >= -3; i--) {                                                      // the house fronts, far to near
    const u0 = i * .8 - sh, u1 = u0 + .8, id = i + 40;
    const top = 720 + rnd(id * 3.3) * 240, tone = mix([18, 22, 68], [30, 32, 98], rnd(id * 5.1)), trim = mix(tone, [90, 96, 184], .35);
    poly(cmbWQ(u0, u1, 0, top), rgba(tone));
    poly(cmbWQ(u0, u1, 372, 386), rgba(trim));
    poly(cmbWQ(u0, u0 + .014, 0, top), rgba([8, 10, 34], .6));
    poly(cmbWQ(u0 + .08, u0 + .25, 0, 262), rgba([10, 12, 40]));                         // a door and its step
    poly(cmbWQ(u0 + .06, u0 + .27, 0, 14), rgba(trim));
    [[.36, .7, 120, 300], [.1, .34, 440, 620], [.46, .7, 440, 620]].forEach(([a, b, v0, v1], j) => {
      const lit = i > 2 && rnd(id * 7.7 + j * 3.1) < .16, q = cmbWQ(u0 + a, u0 + b, v0, v1);
      poly(q, rgba([12, 16, 52]));
      if (lit) { poly(q, rgba([236, 150, 124], .42)); const c = v2.lerp(q[0], q[2], .5); additive(() => lite([255, 170, 130], c[0], c[1], 150 * q[0][2], .16)); }   // someone is still up, far down the street
      else poly(cmbWQ(u0 + a, u0 + b, v1 - 22, v1), rgba([70, 86, 180], .2));                                 // the sky on dark glass
      poly(cmbWQ(u0 + a - .012, u0 + b + .012, v0 - 12, v0), rgba(trim));
    });
  }
}
// a street lamp at u: the post, the lantern, its cone, its pool, and the rain that shows in its light
function cmbStreetLamp(u, t) {
  if (u < -2.2) return;
  const [x, y, f] = cmbWP(u, 0, 8), top = y - 640 * f, ink = [8, 10, 28];
  stroke([[x, y], [x, top + 26 * f]], 11 * f, rgba(ink)); stroke([[x, y], [x, y - 70 * f]], 20 * f, rgba(ink));
  stroke([[x - 30 * f, top + 96 * f], [x + 30 * f, top + 96 * f]], 6 * f, rgba(ink));
  poly([[x - 22 * f, top + 26 * f], [x + 22 * f, top + 26 * f], [x + 34 * f, top - 30 * f], [x - 34 * f, top - 30 * f]], rgba([255, 232, 190], .92));
  poly([[x - 40 * f, top - 30 * f], [x + 40 * f, top - 30 * f], [x + 14 * f, top - 54 * f], [x - 14 * f, top - 54 * f]], rgba(ink));
  ctx.strokeStyle = rgba(ink); ctx.lineWidth = 3 * f;
  line(x - 22 * f, top + 26 * f, x - 34 * f, top - 30 * f); line(x + 22 * f, top + 26 * f, x + 34 * f, top - 30 * f); line(x, top + 26 * f, x, top - 30 * f);
  const lc = [255, 190, 112];
  additive(() => { lite(lc, x, top, 250 * f, .8); lite([255, 232, 196], x, top, 56 * f, .9); lite(lc, x, y - 230 * f, 460 * f, .3); });
  cone(x, top + 6 * f, 30 * f, 310 * f, 646 * f, lc, .2);
  pool(x, y + 14 * f, 340 * f, 30 * f, lc, .7);
  additive(() => {
    ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const sp = 1.25 + rnd(i * 1.3) * .6, tt = t * sp + rnd(i * 3.1), h = tt % 1;
      const xx = x + (rnd(i * 1.7 + Math.floor(tt) * 5.3) - .5) * 2 * lerp(30, 300, h) * f, yy = top + h * 640 * f;
      ctx.strokeStyle = rgba(PAL.lamp, .5 * (1 - h * .6)); ctx.lineWidth = 2.4 * f; line(xx, yy, xx - 7 * f, yy - 44 * f);
    }
  });
}
// the teacher's umbrella, far too big for her: c = where the shaft meets the canopy, rx its half-width, tilt radians
function cmbUmbrella(c, rx, tilt, t) {
  const ry = rx * .6, rz = rx * .17, n = 4, rim = a => [Math.cos(a) * rx, Math.sin(a) * rz];
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(tilt); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-rx, 0); ctx.bezierCurveTo(-rx, -ry * 1.3, rx, -ry * 1.3, rx, 0);
  for (let i = 0; i < n; i++) { const q = rim(Math.PI * (i + 1) / n), am = Math.PI * (i + .5) / n; ctx.quadraticCurveTo(Math.cos(am) * rx * .93, Math.sin(am) * rz * .45, q[0], q[1]); }
  ctx.closePath();
  ctx.fillStyle = lg(-rx * .3, -ry, rx * .2, rz, [[0, [186, 196, 222]], [.38, [112, 130, 168]], [1, [64, 78, 120]]]); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, rx * .985, rz, 0, 0, TAU); ctx.fillStyle = lg(-rx, 0, rx, 0, [[0, [24, 30, 58]], [1, [42, 52, 90]]]); ctx.fill();   // the underside
  ctx.strokeStyle = rgba([84, 98, 150], .55); ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) { const q = rim(i * TAU / 8 + .2); line(0, 0, q[0], q[1]); }
  ctx.strokeStyle = rgba([44, 54, 96], .55); ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) { const q = rim(Math.PI + Math.PI * i / 4); ctx.beginPath(); ctx.moveTo(0, -ry * .975); ctx.quadraticCurveTo(q[0] * .8, -ry * .74, q[0], q[1]); ctx.stroke(); }
  ctx.strokeStyle = rgba([206, 218, 244], .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 0, rx * .985, rz, 0, Math.PI, TAU); ctx.stroke();   // the near edge
  ctx.strokeStyle = rgba([236, 242, 255], .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-rx * .62, -ry * .58); ctx.quadraticCurveTo(-rx * .3, -ry * .92, rx * .1, -ry * .95); ctx.stroke();   // a wet sheen
  stroke([[0, -ry * .96], [0, -ry * 1.14]], 5, rgba([20, 24, 44]));
  for (let i = 0; i < 9; i++) {                                                         // rain bursting on the cloth
    const tt = t * 5.5 + rnd(i * 4.7), k = tt % 1, uu = (rnd(i * 2.9 + Math.floor(tt) * 7.1) - .5) * 1.7, x = uu * rx, y = -ry * .975 * Math.pow(1 - uu * uu * .96, .62);
    ctx.strokeStyle = rgba([214, 228, 255], .8 * (1 - k)); ctx.lineWidth = 2;
    line(x, y, x - 7 * k - 3, y - 12 * k - 3); line(x, y, x + 7 * k + 3, y - 12 * k - 3);
  }
  for (let i = 0; i <= n; i++) {                                                        // and running off its points
    const q = rim(Math.PI * i / n), k = (t * 1.5 + rnd(i * 3.3)) % 1;
    oval(q[0], q[1] + 6 + k * k * 110, 2.4, 5.5, rgba([200, 216, 250], .75 * (1 - k)));
  }
  ctx.restore();
}
shot('walkhome', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbWH;
  fill([8, 10, 38], [28, 30, 92]);
  const fr = kcam(L, len, p.cam || [[0, 1.05, 925, 572], [1, 1.1, 968, 568]], { hand: .3, t });
  const sh = .12 + .2 * u;                                                               // the street slides by as we track with them
  cmbStreet(t, sh);
  rectf(-900, K.mir, 4600, 900, lg(0, K.mir, 0, K.mir + 330, [[0, [10, 12, 44]], [1, [20, 24, 68]]]));   // the road
  for (let j = 10; j >= -2; j--) cmbStreetLamp(j + .22 - sh, t);

  // Lily, ahead: small quick steps, both hands on the shaft, the canopy tipped back between them
  const ms = .92, [lx, ly] = cmbWP(1, 0), ls = ms * cmbLR, phL = L * TAU * 1.3 + 2;
  const lb = { at: [lx, ly], s: ls, dir: 1, pose: 'walk', ph: phL, lean: .05, nod: 3 };
  const P0 = lily(lb), hnd = [P0.sh[0] + 28 * ls, P0.sh[1] + 12 * ls];
  const tilt = -.2 + .05 * Math.sin(phL) + .03 * noise1(t * 1.5, 4), cc = v2.add(hnd, v2.pol(tilt, 124 * ls));
  cmbUmbrella(cc, 124 * ls, tilt, t);
  const PL = lily(Object.assign(lb, { arms: [hnd, [hnd[0] - 3 * ls, hnd[1] + 9 * ls]] }));
  drawLily(PL, cmbBlink(LILY_EX.blank, L, 1.5), { a: 1, rim: PAL.lamp, wet: .5 });
  stroke([v2.add(hnd, v2.pol(tilt, -18 * ls)), cc], 4.5 * ls, rgba([20, 24, 46]));
  disc(hnd[0], hnd[1], 6.5 * ls, rgba(PAL.ink));

  // him, three steps behind: shoulders down, head bowed, hands empty; one hand starts toward her and falls back
  const fy = K.yh + K.c, ph = L * TAU * .82 + .9, mx = K.x0 + 6 * Math.sin(u * 3);
  const mb = { hip: [mx, fy - (188 - 5 * Math.abs(Math.sin(ph))) * ms], s: ms, dir: 1, lean: .13, neck: .34, feet: stride(mx - 6 * ms, fy, ph, 40 * ms, 13 * ms, 1), swing: -Math.sin(ph) * .1 };
  let M = man(mb);
  const rk = cmbBump(u, .34, .58, .88) * .62;
  if (rk > .01) M = man(Object.assign(mb, { hands: [v2.lerp(M.j.handN, [M.j.sh[0] + 132 * ms, M.j.sh[1] + 112 * ms], rk), null] }));
  const look = seg(u, .58, .9);
  const ex = cmbBlink(Object.assign({}, EXPR.ashamed, { gx: lerp(.75, .1, look), gy: lerp(.25, .85, look) }), L, .5);
  drawMan(M, ex, { rim: PAL.lamp, a: .8, lx: .25, ly: -1, light: PAL.lamp, la: .34, lc: [.2, -.7] });
  additive(() => {                                                                      // the rain on his bare head and shoulders
    const sd = Math.floor(t * 14);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (rnd(sd * 7.3 + i * 3.1) - .5) * 2.4, r = M.head[2] * 1.04; lite([210, 226, 255], M.head[0] + Math.cos(a) * r, M.head[1] + Math.sin(a) * r, 9, .8); }
    for (let i = 0; i < 3; i++) lite([210, 226, 255], M.j.sh[0] + (rnd(sd * 3.7 + i * 5.3) - .5) * 60 * ms, M.j.sh[1] - 24 * ms, 8, .7);
  });

  wet(K.mir, 310, .55, t, 5);                                                           // the road mirrors all of it
  rectf(-900, K.mir - 3, 4600, 6, rgba([84, 92, 164], .55));                            // the kerb's wet edge
  ripples(t, -100, 2000, K.mir + 10, 1110, 46, [160, 180, 240], .32, 3);
  ripples(t, 0, 1900, K.yh + 16, K.mir - 5, 12, [255, 224, 176], .3, 9);
  blurred(11, () => {                                                                   // a post near the lens slides out of the frame
    const x = lerp(300, -260, u);
    rectf(x, -300, 78, 1700, rgba([5, 7, 22], .95)); rectf(x + 70, -300, 9, 1700, rgba([120, 142, 226], .5));
  });
  rain(t, { n: 210, len: 84, speed: 1900, slant: .15, a: .3 });
  rain(t, { n: 16, len: 260, speed: 2700, slant: .15, a: .13, w: 6, seed: 40 });
}, { bloom: .5, grain: .55 }, [400, 250, 1340, 880]);

// =====================================================================================================================
// THE KITCHEN at sunrise: sink (front on, the window over the sink) and pushups (low, on the floor)
// =====================================================================================================================
// a window full of dawn: sky, far roofs, the sun (o.sun [x, y, r]); a dark frame with glazing bars; it glows into the room
function cmbWindow(x0, y0, x1, y1, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  rectf(x0, y0, x1 - x0, y1 - y0, lg(0, y1 - 520, 0, y1, [[0, [184, 158, 214]], [.55, [250, 176, 158]], [1, [255, 212, 170]]]));
  if (o.sun) cmbSun(o.sun[0], o.sun[1], o.sun[2]);
  const base = o.roofs ?? y1 - 40, rc = [228, 150, 152];
  for (let i = 0; i < 18; i++) {
    const x = x0 - 40 + i * (x1 - x0 + 80) / 17, w = 50 + rnd(i * 3.7) * 70, h = 14 + rnd(i * 5.3) * 46;
    rectf(x, base - h, w, h + 4, rgba(rc, .78));
    if (rnd(i * 2.1) > .45) poly([[x - 4, base - h], [x + w / 2, base - h - 20], [x + w + 4, base - h]], rgba(rc, .78));
  }
  rectf(x0, base, x1 - x0, y1 - base + 4, rgba([222, 146, 150], .9));
  if (o.sun) additive(() => { lite(PAL.dawnB, o.sun[0], o.sun[1], o.sun[2] * 3, .3); lite([255, 248, 236], o.sun[0], o.sun[1], o.sun[2] * 1.5, .5); });   // it burns over the roofs
  ctx.restore();
  const fc = o.frame || [96, 62, 74], fw = o.fw || 16, n = o.panes || 3;
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.strokeStyle = rgba(fc); ctx.lineWidth = fw; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.lineWidth = fw * .6; for (let i = 1; i < n; i++) { const x = lerp(x0, x1, i / n); line(x, y0, x, y1); }
  ctx.strokeStyle = rgba([255, 230, 204], .55); ctx.lineWidth = 2; for (let i = 1; i < n; i++) { const x = lerp(x0, x1, i / n) + fw * .3; line(x, y0, x, y1); }
  additive(() => lite(PAL.dawnB, (x0 + x1) / 2, (y0 + y1) / 2 + 40, (x1 - x0) * .9, .13));
}
// a darker body under a bottle that stands against bright glass, so it reads
function cmbGlassBack(x, y, s, tilt = 0, a = .28, col = [52, 84, 98]) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s); bottlePath(); ctx.fillStyle = rgba(col, a); ctx.fill(); ctx.restore();
}
// a wire rack on the counter with n empty bottles upside down in it (x its left end, y the counter)
function cmbRack(x, y, s, n, t) {
  const w = (n * 78 + 30) * s, ink = [88, 62, 86];
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 5 * s;
  line(x - 10 * s, y - 62 * s, x + w, y - 62 * s);
  for (let i = 0; i < n; i++) {
    const bx = x + (40 + i * 78) * s, tl = Math.PI + (rnd(i * 3.7 + 1) - .5) * .16, bs = .7 * s;
    const B = [bx - 304 * bs * Math.sin(tl), y - 8 * s + 304 * bs * Math.cos(tl)];
    cmbGlassBack(B[0], B[1], bs, tl, .26);
    bottle(B[0], B[1], bs, { tilt: tl, cork: -1, level: 0, glass: [214, 244, 236] });
    additive(() => lite(PAL.dawnB, bx, y - 150 * s, 80 * s, .16));
  }
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 5 * s;
  line(x - 10 * s, y, x + w, y);
  for (let i = 0; i <= n; i++) { const xx = x - 10 * s + i * (w + 10 * s) / n; line(xx, y, xx, y - 62 * s); }
  ctx.strokeStyle = rgba([255, 228, 204], .6); ctx.lineWidth = 1.6 * s; line(x - 10 * s, y - 65 * s, x + w, y - 65 * s);
}
// the tap: a tall swan neck. (x, y) its foot on the counter; it reaches left
function cmbTap(x, y, s) {
  const ink = [76, 54, 78];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 13 * s;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 82 * s); ctx.arc(x - 34 * s, y - 82 * s, 34 * s, 0, Math.PI, true); ctx.lineTo(x - 68 * s, y - 58 * s); ctx.stroke();
  ctx.strokeStyle = rgba([255, 224, 200], .75); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.arc(x - 34 * s, y - 82 * s, 38 * s, -.15, -1.5, true); ctx.stroke();
  stroke([[x, y - 36 * s], [x + 30 * s, y - 48 * s]], 8 * s, rgba(ink));
  rectf(x - 13 * s, y - 8 * s, 26 * s, 12 * s, rgba(ink));
}
// the amber stream from m straight down to y1; k its strength
function cmbStream(m, y1, t, k, vx0 = 16) {
  if (y1 <= m[1] + 4 || k <= .01) return;
  const n = 14, pts = [], ws = [];
  for (let i = 0; i <= n; i++) {
    const q = i / n, y = lerp(m[1], y1, q), d = y - m[1];
    pts.push([m[0] + vx0 * (1 - Math.exp(-d / 50)) + Math.sin(d * .05 - t * 26) * 2.2 * q, y]);
    ws.push(lerp(9, 4.8, Math.pow(q, .6)) * k * (1 + .22 * Math.sin(t * 15 - d * .03)));
  }
  additive(() => { for (let i = 0; i <= n; i += 3) lite([255, 120, 30], pts[i][0], pts[i][1], 44, .16 * k); });
  poly(stripPts(pts, ws), lg(0, m[1], 0, y1, [[0, [232, 136, 40]], [.5, [206, 104, 22]], [1, [178, 84, 16]]]));
  stroke(pts.map((q, i) => [q[0] - ws[i] * .45, q[1]]), 2.2, rgba([255, 226, 190], .8 * k));
}
const cmbKS = { top: 700, back: 640, sill: 470 };
shot('sink', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbKS;
  fill([140, 94, 112], [96, 64, 86]);
  const fr = kcam(L, len, p.cam || [[0, 1, 960, 470], [1, 1.62, 902, 486]], { hand: .3, t });
  // the wall, the window with the sun just over the roofs, the tiles under it
  rectf(-1400, -900, 4800, 900 + K.back, lg(0, -200, 0, K.back, [[0, [136, 92, 112]], [1, [172, 116, 122]]]));
  cmbWindow(540, 10, 1500, K.sill, t, { sun: [1240, 398, 44], roofs: 428, panes: 3 });
  rectf(-1400, K.sill + 18, 4800, K.back - K.sill - 18, lg(0, K.sill, 0, K.back, [[0, [126, 90, 112]], [1, [154, 108, 124]]]));
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([255, 226, 210], .13); ctx.lineWidth = 2;
  for (let x = -1380; x < 3400; x += 64) line(x, K.sill + 18, x, K.back);
  for (let y = K.sill + 68; y < K.back; y += 50) line(-1400, y, 3400, y);
  rectf(516, K.sill, 1008, 18, rgba([236, 196, 178])); rectf(516, K.sill, 1008, 3, rgba([255, 244, 226], .9)); rectf(516, K.sill + 18, 1008, 10, rgba([70, 44, 66], .3));
  // wall cupboards either side of the window (the stamp sits on the left one)
  rectf(-1400, -900, 1870, 1200, lg(-300, 0, 470, 0, [[0, [78, 54, 78]], [.93, [108, 74, 96]], [1, [214, 150, 134]]]));
  rectf(1574, -900, 1800, 1200, lg(1574, 0, 2000, 0, [[0, [214, 150, 134]], [.07, [108, 74, 96]], [1, [78, 54, 78]]]));
  ctx.strokeStyle = rgba([40, 24, 44], .5); ctx.lineWidth = 4; line(140, -900, 140, 300); line(1880, -900, 1880, 300);
  rectf(-1400, 300, 1870, 10, rgba([50, 30, 50], .5)); rectf(1574, 300, 1800, 10, rgba([50, 30, 50], .5));
  rectf(380, 200, 12, 70, rgba([226, 180, 170], .8)); rectf(1650, 200, 12, 70, rgba([226, 180, 170], .8));
  // a pot of herbs on the sill
  poly([[1408, K.sill], [1466, K.sill], [1474, K.sill - 46], [1400, K.sill - 46]], rgba([150, 86, 92]));
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .24, r = 52 + rnd(i * 3.1) * 26, sw = Math.sin(t * 1.1 + i) * .03; oval(1437 + Math.cos(a + sw) * r * .7, K.sill - 46 + Math.sin(a + sw) * r, 9, 17, rgba(mix([62, 92, 80], [150, 170, 120], rnd(i * 5.7) * .5)), a + Math.PI / 2); }
  // the light pours in
  additive(() => { for (let i = 0; i < 3; i++) { const xa = 560 + i * 316, xb = xa + 290; ctx.fillStyle = lg(0, 40, 0, 1200, [[0, PAL.dawnB, .15], [.5, PAL.dawnA, .08], [1, PAL.dawnA, 0]]); poly([[xa, 30], [xb, 30], [xb - 520, 1300], [xa - 640, 1300]]); ctx.fill(); } });
  // the counter and its cupboards
  rectf(-1400, K.back, 4800, K.top - K.back, lg(0, K.back, 0, K.top, [[0, [238, 198, 178]], [1, [208, 162, 152]]]));
  pool(1240, K.back + 26, 640, 30, PAL.dawnB, .55);
  rectf(-1400, K.top, 4800, 18, rgba([150, 104, 114])); rectf(-1400, K.top, 4800, 3, rgba([255, 240, 222], .8));
  rectf(-1400, K.top + 18, 4800, 1400, lg(0, K.top, 0, K.top + 520, [[0, [116, 80, 100]], [1, [82, 56, 80]]]));
  rectf(-1400, K.top + 18, 4800, 12, rgba([40, 24, 44], .35));
  ctx.strokeStyle = rgba([40, 24, 44], .4); ctx.lineWidth = 4;
  for (let x = -1300; x < 3400; x += 340) { line(x, K.top + 40, x, K.top + 900); rectf(x + 130, K.top + 74, 80, 9, rgba([226, 180, 170], .8)); }
  // the sink
  const sx0 = 792, sx1 = 1052, sy0 = K.back + 8, sy1 = K.top - 8;
  ctx.fillStyle = lg(0, sy0, 0, sy1, [[0, [240, 212, 200]], [.28, [150, 112, 126]], [1, [84, 60, 84]]]); rrect(sx0, sy0, sx1 - sx0, sy1 - sy0, 16); ctx.fill();
  ctx.strokeStyle = rgba([255, 240, 226], .85); ctx.lineWidth = 3; rrect(sx0, sy0, sx1 - sx0, sy1 - sy0, 16); ctx.stroke();
  // the bottle in his hand tips right over; what is left in it runs out
  const tip = seg(L, -.12, .46, E.io), th = lerp(2.2, 2.92, tip) + .015 * Math.sin(t * 9), sb = .8;
  const G = [852 + 14 * tip, 372 - 12 * tip + Math.sin(t * 1.6) * 2];
  const B = [G[0] - 95 * sb * Math.sin(th), G[1] + 95 * sb * Math.cos(th)], mouth = [B[0] + 304 * sb * Math.sin(th), B[1] - 304 * sb * Math.cos(th)];
  const yEnd = sy1 - 6, tp = Math.max(0, L - .07), pour = seg(L, .06, .2), front = Math.min(yEnd, mouth[1] + 220 * tp + 1500 * tp * tp), hit = pour > 0 && front >= yEnd - 1, sxm = mouth[0] + 15;
  ctx.save(); rrect(sx0 + 3, sy0 + 3, sx1 - sx0 - 6, sy1 - sy0 - 6, 14); ctx.clip();
  if (hit) {
    const fk = seg(L, .3, len);
    oval(sxm + 10, sy1 - 7, 46 + 80 * fk, 8 + 4 * fk, rgba([204, 108, 24], .9));
    additive(() => lite([255, 120, 30], sxm, sy1 - 10, 110, .3));
    ctx.strokeStyle = rgba([255, 214, 170], .6); ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) { const k = (t * 2.4 + i * .5) % 1; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.ellipse(sxm, sy1 - 8, 10 + k * 60, 2 + k * 8, 0, 0, TAU); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  ctx.restore();
  cmbTap(1026, sy0 + 2, 1);
  // one more waits; two are done, upside down in the rack
  cmbGlassBack(1116, K.back + 30, .72, 0, .2);
  bottle(1116, K.back + 30, .72, { glass: [206, 242, 234], level: .84, cork: 1, glowC: PAL.amber, glowA: .55 });
  cmbRack(1192, K.back + 36, 1, 2, t);
  cmbGlassBack(B[0], B[1], sb, th, .46, [40, 70, 86]);
  bottle(B[0], B[1], sb, { tilt: th, cork: -1, level: 0, glass: [206, 242, 234], glowC: PAL.amber, glowA: .5 * (1 - .5 * u), inner: () => {
    const vx = Math.sin(th), vy = Math.cos(th), wx = -vy, wy = vx, h = lerp(64, 226, u), p0 = [vx * h, vy * h], far = [vx * 700, vy * 700];
    poly([[p0[0] - wx * 400, p0[1] - wy * 400], [p0[0] + wx * 400, p0[1] + wy * 400], [p0[0] + wx * 400 + far[0], p0[1] + wy * 400 + far[1]], [p0[0] - wx * 400 + far[0], p0[1] - wy * 400 + far[1]]],
      lg(p0[0], p0[1], p0[0] + vx * 240, p0[1] + vy * 240, [[0, [240, 156, 62], .94], [1, [176, 86, 14], .97]]));
    stroke([[p0[0] - wx * 400, p0[1] - wy * 400], [p0[0] + wx * 400, p0[1] + wy * 400]], 3, rgba([255, 222, 180], .7));
    for (let i = 0; i < 5; i++) { const k = (t * 1.5 + i * .21) % 1, yy = lerp(-280, -h * .2 - 30, k); ctx.strokeStyle = rgba([255, 244, 214], .6 * pour * (1 - k)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc((rnd(i * 3.3) - .5) * 30 * (.4 + k), yy, 4 + 5 * k, 0, TAU); ctx.stroke(); }
  } });
  cmbStream(mouth, front, t, pour);
  if (hit) for (let i = 0; i < 10; i++) {                                                // it spatters in the sink
    const cyc = .32 + rnd(i * 2.3) * .2, tt = (t + rnd(i * 5.1) * 3) % cyc, q = tt / cyc, n = Math.floor((t + rnd(i * 5.1) * 3) / cyc);
    const dx = sxm + (rnd(i * 7.7 + n * 3.1) - .5) * 250 * tt, dy = yEnd - 4 - (150 + rnd(i * 4.1 + n) * 200) * tt + 900 * tt * tt;
    if (dy < yEnd + 2) disc(dx, dy, 3.6 * (1 - q * .5), rgba([232, 142, 52], .9 * (1 - q)));
  }
  // him: in profile at the sink, one hand on the counter, the sun on his face and chest
  const M = man({ hip: [588, 712 + Math.sin(t * 1.6) * 2], s: 1.9, dir: 1, lean: .05 + .02 * tip, neck: .2 + .07 * tip, hands: [G, [694, 684]], elbow: [1, 1] });
  const ex = cmbBlink(Object.assign({}, exMix('tired', 'resolve', seg(L, 0, .55)), { gx: .65, gy: .55 }), L, .95);
  drawMan(M, ex, { rim: cmbRim, a: .95, lx: 1, ly: -.3, light: PAL.dawnB, la: .42, lc: [.75, -.2], back: false });
  const ax = [Math.sin(th), -Math.cos(th)], nx = [Math.cos(th), Math.sin(th)];             // his fingers round the glass
  for (let i = 0; i < 4; i++) { const c = v2.add(G, v2.mul(ax, (i - 1.5) * 17)); stroke([v2.add(c, v2.mul(nx, -26)), v2.add(c, v2.mul(nx, 20 - Math.abs(i - 1.5) * 4))], 14, rgba(PAL.ink)); }
  motes(t, [300, 60, 1500, 700], 30, PAL.dawnB, .34, 7);
  blurred(12, () => {                                                                   // leaves of a plant near the lens
    for (let i = 0; i < 9; i++) { const a = -2.5 + i * .34 + Math.sin(t * .9 + i) * .03, r = 300 + rnd(i * 3.7) * 190, c = [1990, 1130]; oval(c[0] + Math.cos(a) * r * .62, c[1] + Math.sin(a) * r * .62, r * .5, 54 + rnd(i * 5.1) * 26, rgba(mix([48, 40, 62], [70, 78, 76], rnd(i * 7.3)), .95), a); }
  });
  stamp(L, '6:00 AM', 'DAY 1');
}, { bloom: .24, grain: .45 }, [540, 150, 1200, 770]);

// ---------- the kitchen floor, seen low ----------
const cmbKF = { wall: 770, floor: 925, top: 452, sill: 318, wx0: 520, wx1: 1180, dx0: 1404, dx1: 1688 };
// her raincoat on its hook by the door: the yellow stays in the frame
function cmbCoatOnHook(x, y, s) {
  const Y = PAL.yellow, YD = PAL.yellowD, YL = PAL.yellowL;
  stroke([[x - 16 * s, y - 12 * s], [x + 16 * s, y - 12 * s]], 6 * s, rgba([96, 66, 84]));
  stroke([[x - 30 * s, y + 34 * s], [x - 50 * s, y + 124 * s]], 21 * s, rgba(Y)); stroke([[x + 30 * s, y + 34 * s], [x + 48 * s, y + 122 * s]], 21 * s, rgba(YD));
  ctx.fillStyle = lg(x - 52 * s, 0, x + 52 * s, 0, [[0, YL], [.45, Y], [1, YD]]);
  ctx.beginPath(); ctx.moveTo(x - 16 * s, y); ctx.quadraticCurveTo(x - 46 * s, y + 40 * s, x - 52 * s, y + 192 * s); ctx.quadraticCurveTo(x, y + 206 * s, x + 52 * s, y + 192 * s); ctx.quadraticCurveTo(x + 46 * s, y + 40 * s, x + 16 * s, y); ctx.fill();
  oval(x, y + 20 * s, 31 * s, 27 * s, rgba(Y)); oval(x, y + 26 * s, 19 * s, 17 * s, rgba(YD, .8));           // the hood, folded over
  stroke([[x, y + 50 * s], [x, y + 196 * s]], 2 * s, rgba(YD, .8));
  for (let i = 0; i < 3; i++) disc(x + 7 * s, y + (76 + i * 42) * s, 3 * s, rgba(YL));
}
function cmbKitchenLow(t, o = {}) {
  const K = cmbKF, seam = [50, 28, 50];
  rectf(-1400, K.wall, 4800, 1000, lg(0, K.wall, 0, 1150, [[0, [168, 112, 108]], [1, [118, 74, 92]]]));       // the floor
  rectf(-1400, -900, 4800, 900 + K.wall, lg(0, -100, 0, K.wall, [[0, [146, 100, 118]], [1, [182, 126, 128]]]));   // the wall
  cmbWindow(K.wx0, -300, K.wx1, K.sill, t, { sun: [742, 232, 40], roofs: 268, panes: 3 });
  rectf(K.wx0 - 24, K.sill, K.wx1 - K.wx0 + 48, 16, rgba([236, 196, 178])); rectf(K.wx0 - 24, K.sill, K.wx1 - K.wx0 + 48, 3, rgba([255, 244, 226], .9));
  rectf(476, K.sill + 16, 740, K.top - K.sill - 16, lg(0, K.sill, 0, K.top, [[0, [130, 94, 114]], [1, [160, 114, 128]]]));
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([255, 226, 210], .13); ctx.lineWidth = 2;
  for (let x = 500; x < 1216; x += 46) line(x, K.sill + 16, x, K.top);
  for (let y = K.sill + 52; y < K.top; y += 36) line(476, y, 1216, y);
  cmbTap(770, K.top, .8);
  cmbRack(880, K.top - 2, .6, 3, t);                                                    // all of them, empty
  // the tall cupboard on the left
  rectf(-1400, -900, 1876, 900 + K.wall, lg(-200, 0, 476, 0, [[0, [80, 56, 80]], [.94, [112, 78, 98]], [1, [214, 152, 136]]]));
  ctx.strokeStyle = rgba(seam, .5); ctx.lineWidth = 4; line(170, -900, 170, K.wall); line(-1400, 380, 470, 380);
  rectf(400, 210, 12, 80, rgba([226, 180, 170], .8)); rectf(400, 470, 12, 80, rgba([226, 180, 170], .8));
  rectf(-1400, K.wall - 34, 1876, 34, rgba([70, 46, 70]));
  // the counter and the cupboards under it
  rectf(476, K.top, 748, 16, rgba([240, 200, 180])); rectf(476, K.top, 748, 3, rgba([255, 246, 230], .9));
  rectf(476, K.top + 16, 738, K.wall - K.top - 16, lg(0, K.top, 0, K.wall, [[0, [186, 138, 136]], [1, [152, 106, 120]]]));
  rectf(476, K.top + 16, 738, 10, rgba(seam, .25));
  ctx.strokeStyle = rgba(seam, .4); ctx.lineWidth = 4;
  for (let i = 1; i < 4; i++) { const x = 476 + i * 184.5; line(x, K.top + 34, x, K.wall - 38); }
  for (let i = 0; i < 4; i++) rectf(476 + i * 184.5 + 62, K.top + 60, 60, 8, rgba([240, 204, 190], .9));
  rectf(476, K.wall - 38, 738, 38, rgba([106, 72, 94]));
  rectf(1214, K.top + 16, 10, K.wall - K.top - 16, rgba([120, 82, 102]));
  rectf(1224, K.wall - 22, 180, 22, rgba([214, 168, 158]));                             // skirting
  // the hook by the door: her raincoat and her boots, or nothing when she has them on
  stroke([[1262, 318], [1352, 318]], 10, rgba([214, 168, 158]));
  if (o.coat) {
    cmbCoatOnHook(1306, 332, 1.2);
    for (const bx of [1284, 1322]) { stroke([[bx, K.wall - 4], [bx, K.wall - 40]], 21, rgba(PAL.yellow)); stroke([[bx - 4, K.wall - 6], [bx - 18, K.wall - 6]], 17, rgba(PAL.yellowD)); }
  }
  // the door to the hall
  const dx0 = K.dx0, dx1 = K.dx1, dt = 196;
  rectf(dx0, dt, dx1 - dx0, K.wall - dt, lg(0, dt, 0, K.wall, [[0, [84, 64, 100]], [1, [142, 102, 124]]]));
  additive(() => lite(PAL.dawnA, dx0 + 110, 480, 300, .34));
  rectf(dx0 + 164, 340, 84, 106, rgba([230, 190, 176], .45)); rectf(dx0 + 172, 348, 68, 90, rgba([120, 90, 124], .6));     // a picture in the hall
  rectf(dx0, K.wall - 30, dx1 - dx0, 30, rgba([186, 130, 124]));
  if (o.door) o.door();
  for (const x of [dx0 - 26, dx1]) rectf(x, dt - 26, 26, K.wall - dt + 26, lg(x, 0, x + 26, 0, [[0, [244, 206, 188]], [1, [204, 158, 150]]]));
  rectf(dx0 - 26, dt - 26, dx1 - dx0 + 52, 26, rgba([228, 186, 172]));
  // the fridge past the door
  rectf(1790, 130, 800, K.wall - 130, lg(1790, 0, 2100, 0, [[0, [244, 218, 208]], [1, [200, 168, 176]]]));
  rectf(1812, 300, 10, 150, rgba([170, 130, 140])); rectf(1790, 520, 800, 4, rgba([150, 110, 124], .6));
}
// floorboards, and the window's light raking across them
function cmbFloorLight(t) {
  const K = cmbKF;
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([60, 30, 50], .13); ctx.lineWidth = 2.5;
  for (let i = -16; i <= 16; i++) line(960 + i * 78, K.wall, 960 + i * 300, 1500);
  additive(() => {
    for (let i = 0; i < 3; i++) {
      const xa = 566 + i * 214, xb = xa + 200, near = x => 780 + (x - 566) * 1.75;
      ctx.fillStyle = lg(0, K.wall, 0, 1250, [[0, PAL.dawnB, .36], [1, PAL.dawnA, .22]]);
      poly([[xa + 30, K.wall + 5], [xb + 30, K.wall + 5], [near(xb), 1400], [near(xa), 1400]]); ctx.fill();
    }
  });
}
// a push-up in profile: toes at (x, y), facing d; k 0 = arms straight … 1 = chest at the floor. o.sh a shake in px
function cmbPush(x, y, s, k, d, o = {}) {
  const Lb = 372 * s, ankH = 30 * s, shH = lerp(152, 58, k) * s;
  const A = [x + d * 14 * s, y - ankH], S = [A[0] + d * Math.sqrt(Lb * Lb - (shH - ankH) * (shH - ankH)) + (o.sh || 0) * .6, y - shH + (o.sh || 0)];
  const H = [lerp(A[0], S[0], .54), lerp(A[1], S[1], .54) + (o.sag || 0) * s], Kn = v2.lerp(A, H, .5);
  const hand = [A[0] + d * 353 * s, y - 5 * s], handF = [hand[0] + d * 13 * s, y - 9 * s], pick = j => -d * j[0] - .3 * j[1];
  const [el] = ik(S, hand, 80 * s, 74 * s, pick), [elF] = ik(S, handF, 80 * s, 74 * s, pick);
  const ba = Math.atan2(A[1] - S[1], d * (S[0] - A[0])), na = ba + (o.neck ?? .12);
  const hd = [S[0] + d * Math.cos(na) * 66 * s, S[1] - Math.sin(na) * 66 * s];
  const AF = [A[0] - d * 22 * s, A[1] + 2 * s];
  return { head: [hd[0], hd[1], 38 * s], d, s,
    parts: [[[H, v2.lerp(AF, H, .5), AF, [x - d * 20 * s, y - 8 * s]], 31 * s], [[S, elF, handF], 20 * s], [[H, S], 56 * s], [[H, Kn, A, [x, y - 7 * s]], 34 * s], [[S, el, hand], 22 * s]],
    j: { hip: H, sh: S, hand, el, head: hd, ba } };
}
// Lily in her pyjamas (soft blue-white, not yellow), a pony tail, bare feet: the figure lily() gives, drawn for indoors.
// o: tilt (her head, radians), rim, sway (the pony tail)
function cmbLilyPJ(P, ex = 'wary', o = {}) {
  const { s, d } = P, A = PAL.yellow, B = PAL.yellowD, C2 = PAL.yellowL, ink = PAL.ink, [hx, hy, r] = P.head;   // yellow pyjamas: she is always the yellow one
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const foot = q => stroke([q, [q[0] + 9 * s * d, q[1] + 1 * s]], 9 * s, rgba(ink));
  stroke(P.legs[1], 14 * s, rgba(B)); foot(P.legs[1][2]);
  stroke(P.legs[0], 15 * s, rgba(mix(A, B, .3))); foot(P.legs[0][2]);
  stroke(P.arms[1], 13 * s, rgba(B));
  const c = Math.cos(P.lean), sn = Math.sin(P.lean);
  const along = (a, v) => [P.sh[0] + (P.hip[0] - P.sh[0]) * a - c * v * s, P.sh[1] + (P.hip[1] - P.sh[1]) * a + sn * v * s];
  const q = [along(-.06, -20), along(-.06, 20), along(.55, 25), along(1.16, 28), along(1.16, -28), along(.55, -25)];
  ctx.fillStyle = lg(P.sh[0] - 36 * s, 0, P.sh[0] + 36 * s, 0, d > 0 ? [[0, B], [.5, A], [1, C2]] : [[0, C2], [.5, A], [1, B]]);
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.quadraticCurveTo(q[2][0], q[2][1], q[3][0], q[3][1]);
  ctx.quadraticCurveTo((q[3][0] + q[4][0]) / 2, (q[3][1] + q[4][1]) / 2 + 6 * s, q[4][0], q[4][1]); ctx.quadraticCurveTo(q[5][0], q[5][1], q[0][0], q[0][1]); ctx.fill();
  for (let i = 0; i < 7; i++) { const w = along(.16 + rnd(i * 3.3) * .86, (rnd(i * 5.7) - .5) * 34); disc(w[0], w[1], 2.6 * s, rgba(B, .8)); }   // small dots on the cloth
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); ctx.translate(-hx, -hy);
  const sw = o.sway || 0, tail = [[hx - d * r * .7, hy - r * .5], [hx - d * r * 1.32, hy - r * .34 + sw * 4 * s], [hx - d * r * 1.5 + sw * 6 * s, hy + r * .5]];
  poly(stripPts(tail, [8 * s, 9 * s, 2 * s]), rgba(ink));
  disc(hx, hy, r, rgba(ink));
  disc(hx - d * r * .86, hy - r * .46, 5.5 * s, rgba(B));
  ctx.strokeStyle = rgba(o.rim || cmbRim, .7); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.05, d > 0 ? -1.25 : Math.PI + .15, d > 0 ? -.15 : Math.PI + 1.25); ctx.stroke();
  ctx.restore();
  cmbLilyFace(P, ex, 1, { tilt: o.tilt, rim: o.rim || cmbRim });
  stroke(P.arms[0], 15 * s, rgba(B)); stroke(P.arms[0], 11 * s, rgba(A));
  disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(ink)); disc(P.arms[1][2][0], P.arms[1][2][1], 6 * s, rgba(ink));
}
// her toy rabbit: hanging by one ear from (x, y), swung by a radians; or sitting on (x, y) when sit is true
function cmbRabbit(x, y, s, a = 0, sit = false, dim = 0) {
  const A = mix([236, 228, 234], [150, 106, 136], dim), B = mix([198, 180, 198], [124, 86, 118], dim);
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.lineCap = 'round';
  if (sit) {
    stroke([[-4 * s, -84 * s], [-10 * s, -118 * s]], 9 * s, rgba(A)); stroke([[8 * s, -84 * s], [22 * s, -104 * s], [30 * s, -92 * s]], 8 * s, rgba(B));
    oval(0, -28 * s, 20 * s, 27 * s, rgba(A)); disc(2 * s, -68 * s, 17 * s, rgba(A));
    stroke([[-10 * s, -6 * s], [12 * s, -3 * s]], 11 * s, rgba(B)); stroke([[8 * s, -6 * s], [28 * s, -3 * s]], 11 * s, rgba(A)); stroke([[10 * s, -36 * s], [20 * s, -20 * s]], 8 * s, rgba(B));
    disc(9 * s, -71 * s, 2.2 * s, rgba([60, 40, 60]));
  } else {
    stroke([[0, 0], [1 * s, 24 * s]], 8 * s, rgba(A)); stroke([[7 * s, 30 * s], [17 * s, 13 * s], [21 * s, 23 * s]], 7 * s, rgba(B));
    disc(2 * s, 37 * s, 13 * s, rgba(A)); oval(2 * s, 64 * s, 12 * s, 19 * s, rgba(A));
    stroke([[-6 * s, 57 * s], [-13 * s, 72 * s]], 6 * s, rgba(B)); stroke([[10 * s, 57 * s], [16 * s, 72 * s]], 6 * s, rgba(B));
    stroke([[-4 * s, 78 * s], [-7 * s, 95 * s]], 7 * s, rgba(A)); stroke([[8 * s, 78 * s], [10 * s, 96 * s]], 7 * s, rgba(A));
    disc(7 * s, 35 * s, 1.8 * s, rgba([60, 40, 60]));
  }
  ctx.restore();
}
const cmbGrin = { lid: .5, brow: -.25, browH: .02, smile: .95, open: .34, grit: 1, gx: .2, gy: -.5, tear: 0, sweat: 1 };
shot('pushups', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbKF, count = p.mode === 'count', ms = 1.5, tx = 1250;
  fill([146, 100, 118], [118, 74, 92]);
  const fr = kcam(L, len, p.cam || (count ? [[0, 1.2, 950, 632], [1, 1.3, 936, 612]] : [[0, 1.12, 1010, 662], [1, 1.02, 1110, 640]]), { hand: .35, t });
  // two push-ups: down slower than up; in 'count' the second comes up slowly, his arms shaking
  const k = keys(count ? [[0, .3], [.2, 1], [.24, 1], [.4, 0], [.47, 0], [.68, 1], [.73, 1], [.96, 0], [1, 0]]
    : [[0, .1], [.29, 1], [.33, 1], [.47, 0], [.52, 0], [.8, 1], [.84, 1], [.97, 0], [1, 0]], u, E.io);
  const shake = count ? cmbBump(u, .7, .84, .97) * (Math.sin(L * 74) * 3.2 + Math.sin(L * 51) * 2) : 0;
  const P = cmbPush(tx, K.floor, ms, k, -1, { sh: shake, neck: .1 + .08 * k });
  // Lily in the doorway ('watch'): she comes round the frame, stops, tilts her head; the rabbit hangs from her hand
  let PL = null;
  cmbKitchenLow(t, { coat: false, door: count ? null : () => {
    const st = seg(u, .06, .4, E.io), ls = ms * cmbLR * .96, tl = seg(u, .56, .78) * .2;
    const lb = { at: [lerp(1672, 1570, st), 788], s: ls, dir: -1, pose: 'walk', ph: Math.PI / 2 + TAU * (st - 1), lean: .03, look: -4 * seg(u, .56, .78), swing: .06 * Math.sin(st * TAU) };
    const P0 = lily(lb), hnd = [P0.sh[0] - (24 + 5 * Math.sin(st * TAU)) * ls, P0.sh[1] + 54 * ls];
    PL = lily(Object.assign(lb, { arms: [hnd, null] }));
    oval(PL.hip[0] + 30, 792, 70, 9, rgba([70, 44, 70], .35));
    const ex = cmbBlink(mixExpr(LILY_EX.wary, LILY_EX.hope, .3 * seg(u, .7, 1)), L, len * .36);
    cmbLilyPJ(PL, ex, { tilt: -tl, sway: Math.sin(st * TAU * 1.5) * (1 - st) + .2 * Math.sin(t * 2) });
    cmbRabbit(hnd[0], hnd[1] + 2, ls * .56, .34 * Math.sin(st * TAU * 1.5) * (1 - .6 * st) + .26 * Math.exp(-Math.max(0, u - .4) * 5) * Math.sin((u - .4) * 26) + .04 * Math.sin(t * 2.3), false, .12);
    disc(hnd[0], hnd[1], 6.5 * ls, rgba(PAL.ink));
  } });
  wet(K.wall, 170, .15, t, 0);                                                          // a polished floor
  cmbFloorLight(t);
  blurred(9, () => poly([[P.j.hand[0] - 40, K.floor + 4], [tx + 30, K.floor + 4], [tx + 330, K.floor + 92], [P.j.hand[0] + 250, K.floor + 92]], rgba([84, 44, 70], .36)));   // his shadow, long
  // her on his back ('count'): cross-legged, a finger for each one, bouncing as he goes
  const seat = v2.lerp(P.j.hip, P.j.sh, .44), hop = count ? 14 * (cmbBump(u, .34, .42, .56) + cmbBump(u, .9, .97, 1.1)) : 0;
  const eff = clamp(.2 + k * .95), top = clamp(1.5 * (1 - k) - .35);
  let ex = mixExpr(EXPR.focus, EXPR.strain, eff);
  if (count) ex = mixExpr(ex, cmbGrin, top);
  drawMan(P, ex, { rim: cmbRim, a: .9, lx: -.45, ly: -1, face: false, back: false });
  cmbManFace(P, ex, { tilt: .42 - .1 * top, light: PAL.dawnB, la: .36, lc: [.2, -.7] });
  if (count) {
    const ls = ms * cmbLR, sy = seat[1] - 40 - hop, n = 1 + (u > .4) + (u > .93), pop = i => i === 1 ? E.out(inv(.4, .47, u)) : i === 2 ? E.out(inv(.93, .99, u)) : 1;
    const lb = { at: [seat[0] + 4, sy], s: ls, dir: -1, pose: 'cross', lean: .06 + .05 * k, nod: -2 };
    const Q0 = lily(lb), hnd = [Q0.sh[0] - 40 * ls, Q0.sh[1] - (30 + 6 * Math.max(cmbBump(u, .38, .45, .6), cmbBump(u, .9, .97, 1.2))) * ls];
    const Q = lily(Object.assign(lb, { arms: [[seat[0] - 16 * ls, sy - 2 * ls], hnd] }));
    Q.legs = [[Q.hip, [Q.hip[0] - 30 * ls, Q.hip[1] + 5 * ls], [Q.hip[0] - 6 * ls, Q.hip[1] + 11 * ls]], [Q.hip, [Q.hip[0] - 22 * ls, Q.hip[1] + 1 * ls], [Q.hip[0] + 4 * ls, Q.hip[1] + 8 * ls]]];   // cross-legged: knees out, feet tucked
    const say = Math.max(cmbBump(u, .38, .45, .62), cmbBump(u, .9, .97, 1.2));
    drawLily(Q, cmbBlink(Object.assign({}, mixExpr(LILY_EX.count, LILY_EX.happy, .45), { open: .12 + .5 * say, gx: .5, gy: .35 }), L, len * .3), { a: 1, rim: cmbRim });
    for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * .42 - .1; stroke([hnd, v2.add(hnd, v2.pol(a, 17 * ls * pop(i)))], 5.4 * ls, rgba(PAL.ink)); }
  }
  // a drop of sweat falls from his brow
  const dq = count ? inv(.5, .72, u) : inv(.36, .6, u);
  if (dq > 0 && dq < 1) { const hx = P.head[0] - 30, y0 = P.head[1] + 30, y = lerp(y0, K.floor - 4, dq * dq); oval(hx, y, 4, 7 + 8 * dq, rgba([255, 244, 232], .9)); }
  else if (dq >= 1) oval(P.head[0] - 30, K.floor - 2, 12, 3, rgba([255, 244, 232], .5 * (1 - inv(count ? .72 : .6, 1, u))));
  motes(t, [420, 300, 1500, 900], 34, PAL.dawnB, .36, 3);
  additive(() => { ctx.fillStyle = lg(0, 200, 0, 1000, [[0, PAL.dawnB, .13], [1, PAL.dawnA, 0]]); poly([[560, 300], [1150, 300], [1900, 1100], [760, 1100]]); ctx.fill(); });   // the light through the room
  // near the lens: a chair's legs; and in 'count' her rabbit sits and watches
  const left = fr[1] - 960 / fr[0], right = fr[1] + 960 / fr[0];
  blurred(12, () => {
    stroke([[left + 96, 380], [left + 60, 1400]], 44, rgba([54, 32, 58], .95)); stroke([[left - 30, 760], [left + 320, 760]], 40, rgba([54, 32, 58], .95));
    stroke([[left + 112, 400], [left + 86, 1000]], 5, rgba([255, 204, 170], .5));
  });
  if (count) blurred(5, () => cmbRabbit(right - 200, K.floor + 150, 2.3, -.06, true, .45));
  if (count) stamp(L, '6:10 AM', 'DAY 40');
}, { bloom: .24, grain: .45 }, (t, p) => p && p.mode === 'count' ? [520, 200, 1400, 950] : [420, 300, 1700, 960]);

// =====================================================================================================================
// BRIDGE: he runs; she rides just ahead on her small yellow bike; far behind, the devil limps and falls away
// =====================================================================================================================
// a real run: ph the stride phase; the trailing heel kicks up, both feet leave the ground, the arms pump
function cmbRun(x, yg, s, ph, d = 1, o = {}) {
  const len = 104 * s, lift = 86 * s, b = Math.abs(Math.sin(ph)), lean = o.lean ?? .2;
  const foot = q => [x + (Math.sin(q) * len - 14 * s) * d, yg - Math.max(0, Math.cos(q + .6)) * lift - 12 * s * b * b];
  const hip = [x, yg - (176 + 16 * b) * s], sh = [hip[0] + Math.sin(lean * d) * 172 * s, hip[1] - Math.cos(lean) * 172 * s];
  const arm = a => { const el = [sh[0] + Math.sin(a) * 80 * s * d, sh[1] + Math.cos(a) * 80 * s]; return [el[0] + Math.sin(a + 1.45) * 72 * s * d, el[1] + Math.cos(a + 1.45) * 72 * s]; };
  const sw = Math.sin(ph) * .95;
  return man({ hip, s, dir: d, lean, neck: o.neck ?? -.06, feet: [foot(ph), foot(ph + Math.PI)], hands: [arm(-sw - .1), arm(sw - .1)], elbow: [1, 1] });
}
function cmbWheel(x, y, r, a) {
  ctx.lineWidth = r * .2; ctx.strokeStyle = rgba([40, 30, 52]); ctx.beginPath(); ctx.arc(x, y, r * .9, 0, TAU); ctx.stroke();
  ctx.lineWidth = r * .05; ctx.strokeStyle = rgba([240, 220, 220], .9); ctx.beginPath(); ctx.arc(x, y, r * .76, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba([240, 220, 220], .45); ctx.lineWidth = r * .035;
  for (let i = 0; i < 10; i++) { const q = a + i * TAU / 10; line(x, y, x + Math.cos(q) * r * .76, y + Math.sin(q) * r * .76); }
  disc(x, y, r * .13, rgba([240, 220, 220]));
}
// her bike: small, yellow, stabiliser wheels. x the middle, yg the ground, s its scale (1.3 x Lily's); returns its points
function cmbBike(x, yg, s, crank) {
  const r = 24 * s, bb = [x - 1 * s, yg - r - 1 * s], ped = q => [bb[0] + Math.cos(q) * 8 * s, bb[1] + Math.sin(q) * 8 * s];
  return { r, yg, s, ra: [x - 30 * s, yg - r], fa: [x + 32 * s, yg - r], bb, seat: [x - 13 * s, yg - 55 * s], head: [x + 23 * s, yg - 60 * s], grip: [x + 20 * s, yg - 73 * s], pedN: ped(crank), pedF: ped(crank + Math.PI) };
}
function cmbBikeDraw(B, roll, far, t) {
  const s = B.s, Y = PAL.yellow, YD = PAL.yellowD, dk = [40, 30, 52];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const stab = (ox, a) => { const c = [B.ra[0] - 5 * s + ox, B.yg - 6.5 * s]; stroke([B.ra, c], 3.4 * s, rgba(YD, a)); disc(c[0], c[1], 6.5 * s, rgba([244, 232, 236], a)); disc(c[0], c[1], 2.4 * s, rgba(dk, a)); };
  if (far) { stab(6 * s, .75); stroke([B.bb, B.pedF], 3 * s, rgba(dk)); stroke([[B.pedF[0] - 5 * s, B.pedF[1]], [B.pedF[0] + 5 * s, B.pedF[1]]], 3.4 * s, rgba(dk)); return; }
  cmbWheel(B.ra[0], B.ra[1], B.r, roll); cmbWheel(B.fa[0], B.fa[1], B.r, roll + 1);
  const tube = (a, b, w = 4.8) => stroke([a, b], w * s, rgba(Y));
  stroke([B.ra, [B.seat[0] + 1 * s, B.seat[1] + 12 * s]], 3.6 * s, rgba(YD)); stroke([B.ra, B.bb], 3.6 * s, rgba(YD));
  tube(B.bb, [B.seat[0], B.seat[1] + 2 * s]); tube([B.seat[0] + 2 * s, B.seat[1] + 12 * s], [B.head[0], B.head[1] + 4 * s]); tube(B.bb, [B.head[0] - 1 * s, B.head[1] + 12 * s]);
  stroke([[B.head[0] - 1 * s, B.head[1] + 12 * s], B.fa], 4.2 * s, rgba(YD)); tube([B.head[0] - 1 * s, B.head[1] + 12 * s], B.grip, 4.2);
  stroke([[B.head[0] - 3 * s, B.head[1] + 2 * s], [B.head[0] + 2 * s, B.head[1] - 6 * s]], 1.6 * s, rgba(PAL.yellowL, .9));
  oval(B.seat[0], B.seat[1], 10 * s, 3.6 * s, rgba(dk));
  stroke([[B.grip[0] - 7 * s, B.grip[1] - 1 * s], [B.grip[0] + 3 * s, B.grip[1]]], 4.4 * s, rgba(dk));
  for (let i = 0; i < 3; i++) {                                                         // ribbons on the grip, streaming back
    const pts = []; for (let j = 0; j <= 5; j++) pts.push([B.grip[0] - 6 * s - j * 5.5 * s, B.grip[1] + (i - 1) * 1.6 * s * j * .5 + Math.sin(t * 22 + j * 1.2 + i * 2) * 1.6 * s * j / 5 + j * .5 * s]);
    stroke(pts, 1.5 * s, rgba(i === 1 ? [255, 176, 196] : [255, 255, 255], .95));
  }
  stab(0, 1);
  disc(B.bb[0], B.bb[1], 4.6 * s, rgba(dk)); stroke([B.bb, B.pedN], 3 * s, rgba(dk)); stroke([[B.pedN[0] - 5 * s, B.pedN[1]], [B.pedN[0] + 5 * s, B.pedN[1]]], 3.4 * s, rgba(dk));
}
// a hazy skyline on the far bank: row of blocks that scroll by par of the distance run
function cmbSkyline(D, par, base, col, a, h0, h1, sp, seed) {
  const off = D * par, i0 = Math.floor(off / sp);
  for (let i = -8; i < 34; i++) {
    const id = i + i0, x = i * sp - (off % sp) - 300, w = sp * (.55 + rnd(id * 3.7 + seed) * .6), h = lerp(h0, h1, Math.pow(rnd(id * 5.3 + seed), 1.8));
    rectf(x, base - h, w, h + 4, rgba(col, a));
    if (rnd(id * 2.1 + seed) > .72) rectf(x + w * .4, base - h - 26, w * .14, 28, rgba(col, a));
  }
}
shot('bridge', (t, p, L, len) => {
  const u = cmbU(L, len), yg = 900, D = 400 + L * 940, ms = 1.25, sun = [1596, 396];
  fill([190, 156, 198], [255, 216, 172]);
  const fr = kcam(L, len, p.cam || [[0, 1, 985, 566], [1, 1.04, 1010, 560]], { hand: .5, t });
  rectf(-1400, 180, 4800, 340, lg(0, 180, 0, 512, [[0, [252, 170, 164], 0], [1, [255, 204, 166], .9]]));       // the sky warms toward the water
  cmbSun(sun[0], sun[1], 52);
  cmbSkyline(D, .02, 512, [236, 164, 176], .7, 40, 210, 120, 1);
  cmbSkyline(D, .045, 512, [204, 134, 166], .78, 26, 130, 96, 7);
  additive(() => { lite(PAL.dawnB, sun[0], sun[1] + 30, 520, .2); });                    // haze over the roofs
  haze(t, -200, 2100, 500, 90, [255, 214, 196], .1, 5, 7);
  // the river, the sun's glitter on it
  rectf(-1400, 512, 4800, 420, lg(0, 512, 0, 900, [[0, [252, 198, 176]], [.4, [214, 164, 194]], [1, [146, 132, 198]]]));
  rectf(-1400, 508, 4800, 8, rgba([255, 226, 206], .55));
  additive(() => {
    ctx.lineCap = 'round';
    for (let i = 0; i < 90; i++) {
      const yy = 518 + Math.pow(rnd(i * 1.7), 1.3) * 372, k = (yy - 512) / 380, sp = 26 + k * 190;
      const x = sun[0] + (rnd(i * 3.1) - .5) * 2 * sp - D * .012 * k, w = (8 + rnd(i * 4.3) * 26) * (.5 + k), a = (.3 + .7 * rnd(i * 6.1)) * (.5 + .5 * Math.sin(t * (5 + rnd(i * 2.7) * 7) + i * 1.9));
      ctx.strokeStyle = rgba([255, 246, 220], a); ctx.lineWidth = 2.4 + 3.4 * k; line(x - w, yy, x + w, yy);
    }
    for (let i = 0; i < 46; i++) {
      const yy = 520 + rnd(i * 2.9 + 4) * 360, k = (yy - 512) / 380, x = ((rnd(i * 5.7 + 4) * 2400 - D * (.02 + .1 * k)) % 2400 + 2400) % 2400 - 240, a = .5 * (.5 + .5 * Math.sin(t * (3 + rnd(i * 3.3) * 5) + i));
      ctx.strokeStyle = rgba([255, 214, 214], a * .6); ctx.lineWidth = 2 + 2 * k; line(x - 14 - 20 * k, yy, x + 14 + 20 * k, yy);
    }
  });
  // the far railing and its lamp posts slide by behind them
  const rc = [126, 86, 126], off = D * .95;
  for (let i = -1; i < 5; i++) {
    const x = i * 780 - (off % 780) + 200;
    stroke([[x, yg], [x, 372]], 13, rgba(rc)); ctx.strokeStyle = rgba(rc); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, 372); ctx.quadraticCurveTo(x, 330, x + 44, 326); ctx.stroke();
    oval(x + 52, 330, 20, 9, rgba([250, 226, 220])); stroke([[x + 4, yg - 6], [x + 4, 380]], 2.5, rgba([255, 226, 200], .7));
  }
  rectf(-1400, 702, 4800, 12, rgba(rc)); rectf(-1400, 702, 4800, 3, rgba([255, 230, 204], .85)); rectf(-1400, 800, 4800, 6, rgba(rc, .9));
  for (let i = -2; i < 20; i++) { const x = i * 130 - (off % 130); rectf(x, 706, 9, yg - 706, rgba(rc)); rectf(x + 7, 706, 2, yg - 706, rgba([255, 226, 200], .6)); }
  // the deck: sunlit, the railing's shadows flickering across it
  rectf(-1400, yg - 16, 4800, 16, rgba([150, 104, 130]));
  rectf(-1400, yg, 4800, 2400, lg(0, yg, 0, 1090, [[0, [214, 158, 146]], [1, [150, 104, 120]]]));
  rectf(-1400, yg, 4800, 3, rgba([255, 232, 208], .7));
  for (let i = -2; i < 22; i++) { const x = i * 130 - (off % 130); poly([[x - 2, yg + 2], [x + 10, yg + 2], [x - 190, 1100], [x - 250, 1100]], rgba([112, 70, 104], .2)); }
  ctx.strokeStyle = rgba([90, 54, 84], .22); ctx.lineWidth = 3;
  for (let i = -1; i < 7; i++) { const x = i * 420 - (D % 420); line(x, yg + 2, x - 70, 1100); }
  // the devil, far behind at the left edge: small, thin, limping, eyes dim; it falls back out of the frame
  const dk = .4, dph = L * TAU * .9 + .55 * Math.sin(L * TAU * .9);
  placeDevil([lerp(250, -210, Math.pow(u, .8)), yg + 200 * dk + Math.max(0, Math.sin(dph)) * 12 * dk, dk]);
  const o = devilO({ a: lerp(.82, .5, u), eyes: .3, grin: 0, lean: .9, stride: dph, smoke: 0 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  // Lily, pedalling hard just ahead of him; once, she looks back
  const ls = ms * cmbLR, bx = 1230 + 22 * Math.sin(u * 2.6), cr = L * TAU * 2.1, lookB = cmbBump(u, .36, .5, .86) > 0 ? Math.min(1, seg(u, .36, .5) * 1, 1 - seg(u, .7, .86)) : 0;
  const Bk = cmbBike(bx, yg, ls * 1.3, cr), rock = .035 * Math.sin(cr);
  oval(bx - 70, yg + 12, 150, 13, rgba([104, 62, 96], .32)); oval(650 - 80, yg + 14, 170, 15, rgba([104, 62, 96], .32));
  ctx.save(); ctx.translate(bx, yg); ctx.rotate(.018 * Math.sin(cr * .5 + 1)); ctx.translate(-bx, -yg);
  cmbBikeDraw(Bk, D / Bk.r, true, t);
  const PL = lily({ at: [Bk.seat[0], Bk.seat[1] - 2 * ls], s: ls, dir: 1, pose: 'sit', lean: .3 + rock - .08 * lookB, arms: [Bk.grip, [Bk.grip[0] + 4 * ls, Bk.grip[1] + 1 * ls]], look: -5 * lookB, nod: Math.sin(cr * 2) * 1.2 });
  const leg = f => { const [kn, e] = ik(PL.hip, f, 30 * ls, 30 * ls, j => j[0] - .2 * j[1]); return [PL.hip, kn, e]; }, farLeg = leg(Bk.pedF);
  stroke(farLeg, 13 * ls, rgba(PAL.ink)); stroke([farLeg[2], [farLeg[2][0] + 9 * ls, farLeg[2][1]]], 14 * ls, rgba(PAL.yellowD));
  cmbBikeDraw(Bk, D / Bk.r, false, t);
  PL.legs = [leg(Bk.pedN), [PL.hip, PL.hip, PL.hip]];
  drawLily(PL, 'hope', { a: 1, rim: cmbRim, face: false });
  cmbLilyFace(PL, cmbBlink(mixExpr(LILY_EX.hope, LILY_EX.happy, .55 * lookB), L, .5), 1 - 1.85 * lookB, { rim: cmbRim });
  ctx.restore();
  // him: a real run, eyes on her; when she looks back, something in his face lets go
  const ph = L * TAU * 1.38 + 1.2, M = cmbRun(650, yg, ms, ph, 1, { lean: .27, neck: -.1 });
  const ex = mixExpr(Object.assign({}, EXPR.focus, { open: .1 + .16 * (.5 + .5 * Math.sin(ph * 2)), sweat: .6, gx: .8, gy: .15 }), EXPR.calm, .6 * lookB);
  drawMan(M, ex, { rim: cmbRim, a: .95, lx: 1, ly: -.5, light: PAL.dawnB, la: .42, lc: [.8, -.2], back: false });
  // near the lens: the railing on our side, soft, streaking by
  blurred(13, () => {
    const o2 = D * 2.6;
    rectf(-1400, 1000, 4800, 46, rgba([58, 36, 66], .96)); rectf(-1400, 996, 4800, 9, rgba([255, 206, 176], .55));
    for (let i = -1; i < 6; i++) { const x = i * 620 - (o2 % 620); rectf(x, 1040, 150, 2200, rgba([58, 36, 66], .9)); }
  });
  blurred(16, () => { for (let i = 0; i < 2; i++) { const x = 2500 + i * 2300 - (D - 400) * 2.9; rectf(x, -300, 46, 1700, rgba([70, 44, 80], .42)); } });   // a cable of the bridge wipes past
  stamp(L, '6:15 AM', 'DAY 14');
}, { bloom: .24, grain: .45 }, [440, 250, 1480, 930]);

// =====================================================================================================================
// PULLUPS: a playground at sunrise. He pulls up on the high bar; she hangs from the low one beside him, copying him
// =====================================================================================================================
// a pull-up in profile under a bar at yBar: k 0 = hanging … 1 = chin over. o: kick (knees up), sw (swing px), sh (shake px)
function cmbPull(x, yBar, s, k, d, o = {}) {
  const S = [x - d * 62 * s * k + (o.sw || 0) * (1 - k) + (o.sh || 0), yBar + lerp(152, 36, k) * s + (o.sh || 0)];
  const hand = [x + d * 8 * s, yBar], handF = [x + d * 20 * s, yBar], pick = j => d * j[0] + .25 * j[1];
  const [el] = ik(S, hand, 80 * s, 74 * s, pick), [elF] = ik(S, handF, 80 * s, 74 * s, pick);
  const H = [S[0] - d * (6 + 22 * k) * s + (o.sw || 0) * .8, S[1] + 172 * s], kick = o.kick || 0;
  const leg = (a1, bend) => { const kn = [H[0] + d * Math.sin(a1) * 100 * s, H[1] + Math.cos(a1) * 100 * s], a2 = a1 - bend; return [H, kn, [kn[0] + d * Math.sin(a2) * 100 * s, kn[1] + Math.cos(a2) * 100 * s]]; };
  const hd = [S[0] + d * (10 + 6 * k) * s, S[1] - (64 - 2 * k) * s];
  return { head: [hd[0], hd[1], 38 * s], d, s,
    parts: [[leg(.12 + kick * .5, .8 + kick * .35), 31 * s], [[S, elF, handF], 20 * s], [[H, S], 56 * s], [leg(.3 + kick * .7, .7 + kick * .5), 34 * s], [[S, el, hand], 22 * s]],
    j: { hip: H, sh: S, head: hd, hand, handF } };
}
// a soft tree: a trunk and a crown of discs
function cmbTree(x, y, r, col, a, seed) {
  rectf(x - r * .07, y - r * .9, r * .14, r * .9, rgba(mix(col, [60, 40, 70], .4), a));
  for (let i = 0; i < 9; i++) disc(x + (rnd(seed + i * 3.1) - .5) * r * 1.5, y - r * 1.25 + (rnd(seed + i * 5.3) - .5) * r * 1.0, r * (.42 + rnd(seed + i * 7.7) * .3), rgba(col, a));
}
shot('pullups', (t, p, L, len) => {
  const u = cmbU(L, len), yg = 960, hz = 780, sun = [340, 610], posts = [556, 1012, 1424], hi = 250, lo = 590, ms = 1.3;
  fill([208, 166, 198], [255, 208, 166]);
  const fr = kcam(L, len, p.cam || [[0, 1, 992, 584], [1, 1.07, 1004, 566]], { hand: .35, t });
  rectf(-1400, 300, 4800, 500, lg(0, 300, 0, hz, [[0, [255, 176, 160], 0], [1, [255, 202, 160], .95]]));
  cmbSun(sun[0], sun[1], 52, .72);
  // far trees and roofs in haze; the darker trees stand behind her, so her yellow sings
  blurred(4, () => {
    cmbSkyline(0, 0, hz, [226, 160, 172], .6, 30, 110, 150, 21);
    for (let i = 0; i < 9; i++) cmbTree(-200 + i * 300 + rnd(i * 4.1) * 120, hz + 6, (i < 3 ? 56 : 120) + rnd(i * 2.3) * (i < 3 ? 30 : 70), i > 3 ? [176, 116, 140] : [222, 152, 156], .9, i * 17);
    cmbTree(1330, hz + 20, 250, [150, 96, 128], .95, 91); cmbTree(1700, hz + 20, 220, [158, 102, 132], .95, 57); cmbTree(1010, hz + 14, 170, [174, 114, 138], .9, 33);
  });
  additive(() => { lite(PAL.dawnB, sun[0], sun[1], 700, .1); });
  // the ground, long light across it
  rectf(-1400, hz, 4800, 2400, lg(0, hz, 0, 1100, [[0, [240, 180, 150]], [1, [172, 118, 124]]]));
  rectf(-1400, hz - 2, 4800, 8, rgba([255, 232, 206], .5));
  additive(() => { ctx.save(); ctx.translate(sun[0] + 200, hz + 60); ctx.scale(1, .13); lite(PAL.dawnB, 0, 0, 1500, .18); ctx.restore(); });
  // the swings and the slide: soft shapes behind
  blurred(5, () => {
    const sc = [150, 108, 156], a = .85, sx = 1540;
    stroke([[sx - 190, 868], [sx - 130, 430], [sx - 70, 868]], 13, rgba(sc, a)); stroke([[sx + 70, 868], [sx + 130, 430], [sx + 190, 868]], 13, rgba(sc, a)); stroke([[sx - 140, 430], [sx + 140, 430]], 15, rgba(sc, a));
    for (const [ox, ph] of [[-56, 0], [56, 1.7]]) { const an = Math.sin(t * 1.6 + ph) * (ox > 0 ? .16 : .03), e = [sx + ox + Math.sin(an) * 290, 430 + Math.cos(an) * 290]; ctx.strokeStyle = rgba(sc, a); ctx.lineWidth = 4; line(sx + ox - 16, 430, e[0] - 16, e[1]); line(sx + ox + 16, 430, e[0] + 16, e[1]); stroke([[e[0] - 24, e[1]], [e[0] + 24, e[1]]], 10, rgba([110, 76, 124], a)); }
    const lc = [222, 150, 162];
    stroke([[40, 880], [40, 520], [130, 520]], 13, rgba(lc, a)); stroke([[130, 520], [220, 560], [420, 850], [470, 866]], 20, rgba(lc, a)); for (let i = 0; i < 5; i++) stroke([[22, 600 + i * 56], [58, 600 + i * 56]], 7, rgba(lc, a));
  });
  // long shadows of the bars, lying toward us
  const shc = rgba([128, 78, 112], .26);
  for (const x of posts) poly([[x - 10, yg], [x + 12, yg], [x + 560, 1110], [x + 470, 1110]], shc);
  // the reps: two, the second slower; a breath out at the top of it
  const k = keys([[0, .12], [.22, 1], [.28, 1], [.45, .02], [.5, 0], [.84, 1], [.92, 1], [1, .86]], u, E.io);
  const hard = cmbBump(u, .52, .72, .86), out = seg(u, .86, .97);
  const P = cmbPull(784, hi, ms, k, 1, { kick: .7 * hard, sw: Math.sin(L * 3.1) * 7, sh: hard * (Math.sin(L * 70) * 2.6 + Math.sin(L * 47) * 1.6) });
  // Lily on the low bar: she pulls as far as she can, legs kicking, grinning at him
  const ls = ms * cmbLR, kl = .32 * keys([[0, .05], [.3, 1], [.38, .8], [.55, .1], [.62, .1], [.9, 1], [1, .9]], u, E.io), lph = L * TAU * 2.2, lxx = 1218 + Math.sin(L * 5.2) * 9;
  const reach = lerp(92, 76, kl / .32) * ls, hipL = [lxx, lo + 56 * ls + reach], gripL = [[1218 + 24 * ls, lo], [1218 - 22 * ls, lo]];
  const PL = lily({ at: hipL, s: ls, dir: -1, pose: 'hang', ph: lph, lean: .1 * Math.sin(L * 5.2 + 1) + .05, nod: -3 * kl / .32 });
  PL.arms = gripL.map(h => { const a0 = [PL.sh[0], PL.sh[1] + 6 * ls], [el, w] = ik(a0, h, 46 * ls, 46 * ls, j => (h[0] > a0[0] ? 1 : -1) * j[0] + .2 * j[1]); return [a0, el, w]; });   // arms stretched long, the way a child hangs
  PL.legs = [0, 1].map(i => { const q = lph + i * Math.PI, f = [hipL[0] + Math.sin(q) * 30 * ls - 6 * ls, hipL[1] + (55 - 14 * Math.max(0, Math.cos(q))) * ls], [kn, e] = ik(hipL, f, 30 * ls, 30 * ls, j => -j[0] - .2 * j[1]); return [hipL, kn, e]; });
  oval(784 + 330, 1036, 190, 16, rgba([128, 78, 112], .26)); oval(1218 + 300, 1030, 130, 13, rgba([128, 78, 112], .26));
  // the frame: three posts, the high bar and the low bar
  const bc = [74, 72, 122], barf = (x0, x1, y) => { stroke([[x0, y], [x1, y]], 13, rgba(bc)); stroke([[x0, y - 4], [x1, y - 4]], 2.5, rgba([255, 226, 200], .8)); };
  posts.forEach((x, i) => { const topY = i < 2 ? hi - 16 : lo - 16; rectf(x - 11, topY, 22, yg - topY + 6, rgba(bc)); rectf(x - 11, topY, 5, yg - topY + 6, rgba([255, 214, 184], .75)); oval(x, yg + 6, 30, 7, rgba([110, 70, 104], .7)); disc(x, topY, 13, rgba(bc)); });
  barf(posts[0], posts[1], hi); barf(posts[1], posts[2], lo);
  // him
  let ex = mixExpr(EXPR.focus, EXPR.strain, clamp(.25 + Math.max(k * (u < .3 ? 1 : .6), hard * 1.2)));
  ex = mixExpr(ex, { lid: .5, brow: .15, browH: .05, smile: .5, open: .5 * (1 - seg(u, .94, 1) * .5), grit: 0, gx: .8, gy: .3, tear: 0, sweat: 1 }, out);
  drawMan(P, ex, { rim: cmbRim, a: .95, lx: -1, ly: -.35, face: false, back: false });
  cmbManFace(P, ex, { tilt: -.12 * k + .1, light: PAL.dawnB, la: .3, lc: [-.5, -.5] });
  for (const hx of [P.j.handF[0], P.j.hand[0]]) { stroke([[hx, hi - 9], [hx + 3, hi + 9]], 26 * (hx === P.j.hand[0] ? 1 : .85), rgba(PAL.ink)); }
  stroke([[P.j.hand[0] - 13, hi - 12], [P.j.hand[0] - 14, hi - 2]], 4, rgba(cmbRim, .7));
  if (out > 0) additive(() => { for (let i = 0; i < 4; i++) { const q = clamp(out * 1.3 - i * .1); lite([255, 240, 228], P.head[0] + 44 + q * (70 + i * 26), P.head[1] + 16 - q * (18 + i * 9), 16 + q * 40 + i * 5, .34 * q * (1 - q) * 3); } });   // his breath in the cold
  // her
  drawLily(PL, cmbBlink(Object.assign({}, LILY_EX.happy, { lid: .12 + .5 * kl / .32 * cmbBump(u, .2, .3, .45), gx: .7, gy: -.25, open: .3 }), L, len * .6), { a: 1, rim: cmbRim });
  stroke(PL.arms[0], 15 * ls, rgba(PAL.yellowD)); stroke(PL.arms[0], 10.5 * ls, rgba(PAL.yellow));              // her near sleeve, so it reads against the hood
  for (const h of gripL) stroke([[h[0], lo - 5], [h[0], lo + 6]], 15, rgba(PAL.ink));
  // dust in the low light, rays from the sun
  additive(() => { for (let i = 0; i < 5; i++) { const a = -.42 + i * .2 + Math.sin(t * .4 + i) * .02; ctx.fillStyle = lg(sun[0], sun[1], sun[0] + Math.cos(a) * 1500, sun[1] + Math.sin(a) * 1500, [[0, PAL.dawnB, .07], [1, PAL.dawnA, 0]]); poly([sun, [sun[0] + Math.cos(a - .045) * 1700, sun[1] + Math.sin(a - .045) * 1700], [sun[0] + Math.cos(a + .045) * 1700, sun[1] + Math.sin(a + .045) * 1700]]); ctx.fill(); } });
  motes(t, [200, 200, 1800, 980], 46, PAL.dawnB, .4, 11);
  // near the lens: leaves over the top left corner, grass along the bottom
  blurred(8, () => {
    const lc = [72, 48, 86];
    stroke([[-200, 40], [260, 96], [620, 60]], 26, rgba(lc, .95));
    for (let i = 0; i < 26; i++) { const x = -160 + rnd(i * 3.3) * 800, y = -40 + rnd(i * 5.1) * 250 * (1 - x / 1100) + Math.sin(t * 1.3 + i) * 5; oval(x, y, 62, 30, rgba(mix(lc, [120, 80, 110], rnd(i * 7.7) * .5), .93), rnd(i * 2.2) * 3); }
    for (let i = 0; i < 70; i++) { const x = -100 + i * 31 + rnd(i * 3.9) * 26, h = 40 + rnd(i * 6.7) * 80, sw = (rnd(i * 2.3) - .5) * 60 + Math.sin(t * 1.5 + i * .7) * 12; stroke([[x, 1130], [x + sw * .3, 1130 - h * .6], [x + sw, 1130 - h]], 9, rgba(mix([104, 66, 100], [150, 98, 116], rnd(i * 4.7)), .8)); }
  });
  stamp(L, '6:20 AM', 'DAY 30');
}, { bloom: .24, grain: .45 }, [520, 150, 1460, 1000]);

// =====================================================================================================================
// HAND: evening, rain, at the height of his hand. It hangs open, trembling; hers comes up into it; his fingers close
// =====================================================================================================================
// a soft finger: bones (lens) turned to angs (radians from straight down, + curls toward the right), as one smooth
// strip that tapers from w0 wide at the root to w1 at the tip. Returns { pts, ws } (ws are half-widths) for cmbForm
function cmbFinger(base, lens, angs, w0, w1) {
  const n = 16, tot = lens.reduce((a, b) => a + b, 0), mids = [], pts = [base], ws = [w0 / 2];
  let acc = 0; for (const l of lens) { mids.push(acc + l / 2); acc += l; }
  const angAt = v => { if (v <= mids[0]) return angs[0]; for (let i = 1; i < mids.length; i++) if (v <= mids[i]) return lerp(angs[i - 1], angs[i], E.sine(inv(mids[i - 1], mids[i], v))); return angs[angs.length - 1]; };
  let q = base;
  for (let i = 1; i <= n; i++) { const a = angAt(tot * (i - .5) / n), d = tot / n; q = [q[0] + Math.sin(a) * d, q[1] + Math.cos(a) * d]; pts.push(q); ws.push(lerp(w0, w1, i / n) / 2); }
  return { pts, ws };
}
// soft shapes ({ pts, ws, flat: no round root }) painted as one dark form with lit edges. o as cmbSil, and sheen (0-1)
function cmbForm(shapes, o = {}) {
  const off = o.off ?? 6, path = pl => { ctx.beginPath(); ctx.moveTo(pl[0][0], pl[0][1]); for (let i = 1; i < pl.length; i++) ctx.lineTo(pl[i][0], pl[i][1]); ctx.closePath(); ctx.fill(); };
  const draw = grow => { for (const sh of shapes) {
    const a = sh.pts[0], b = sh.pts[sh.pts.length - 1];
    path(stripPts(sh.pts, sh.ws.map(w => w + grow)));
    if (!sh.flat) { ctx.beginPath(); ctx.arc(a[0], a[1], sh.ws[0] + grow, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.arc(b[0], b[1], sh.ws[sh.ws.length - 1] + grow, 0, TAU); ctx.fill();
  } };
  const edge = (col, al, lx, ly) => {
    if (al <= .003) return;
    const m = Math.hypot(lx, ly) || 1;
    ctx.save(); ctx.translate(lx / m * off, ly / m * off); ctx.shadowColor = rgba(col, Math.min(1, al)); ctx.shadowBlur = (o.blur ?? 14) * pxPerUnit(ctx); ctx.fillStyle = rgba(col, Math.min(1, al * 1.35)); draw(off * .4); ctx.restore();
  };
  const lx = o.lx ?? 0, ly = o.ly ?? -1, m = Math.hypot(lx, ly) || 1;
  if (o.rim2) edge(o.rim2, o.a2 ?? .5, o.l2[0], o.l2[1]);
  edge(o.rim || cmbRim, o.a ?? .7, lx, ly);
  ctx.fillStyle = rgba(o.fill || PAL.ink); draw(0);
  if (o.sheen) {
    ctx.fillStyle = rgba(mix(o.fill || PAL.ink, o.rim || cmbRim, .36), o.sheen);
    for (const sh of shapes) path(stripPts(sh.pts.map((q, i) => [q[0] + lx / m * sh.ws[i] * .44, q[1] + ly / m * sh.ws[i] * .44]), sh.ws.map(w => w * .28)));
  }
}
shot('hand', (t, p, L, len) => {
  const T = L * 1.4 / Math.max(.2, len), ink = PAL.ink, Y = PAL.yellow, YD = PAL.yellowD, YL = PAL.yellowL, hs = 1.5, lampC = [255, 196, 120], redC = [255, 84, 50];
  fill([14, 24, 76], [36, 56, 134]);
  const fr = kcam(L, len, p.cam || [[0, 1, 990, 520], [.55, 1.04, 996, 512], [1, 1.14, 1022, 480]], { hand: .35, t });
  // the street behind, far out of focus: the bar's red door at the far left, a warm lamp behind the hands, blue everywhere else
  const fl = .86 + .14 * Math.sin(t * 17) * Math.sin(t * 5.3), warm = .82 + .18 * seg(T, .8, 1.2);
  blurred(26, () => {
    rectf(-900, 850, 4000, 700, rgba([18, 28, 84], .9));
    rectf(-260, 110, 590, 760, rgba([255, 84, 44], .82 * fl)); rectf(-260, 36, 700, 52, rgba([255, 50, 50], .85 * fl));
  });
  additive(() => {
    lite([255, 70, 40], 120, 500, 760, .75 * fl); lite([255, 150, 70], 180, 620, 320, .5 * fl);
    lite(lampC, 1170, 430, 840, .64 * warm); lite([255, 232, 196], 1170, 430, 230, .3 * warm);
  });
  bokeh(3, 18, [540, 40, 1960, 800], [[90, 130, 240], [70, 104, 224], [130, 170, 252]], 34, 100, .55, t);
  bokeh(8, 4, [1400, 80, 1960, 560], [[255, 200, 140]], 40, 86, .4, t);
  blurred(14, () => additive(() => {                                                     // the lights lie long on the wet ground
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, redC, .5 * fl], [1, redC, 0]]); ctx.fillRect(-240, 850, 520, 400);
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, lampC, .5], [1, lampC, 0]]); ctx.fillRect(1010, 850, 320, 400);
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, [100, 140, 240], .3], [1, [100, 140, 240], 0]]); ctx.fillRect(1560, 850, 170, 400);
  }));
  // the moments (for a 1.4 s shot): her hand rises, slips in; his fingers close round hers (lands about .9 s); a small squeeze
  const trem = 1 - seg(T, .56, .8), rise = seg(T, .06, .6, E.out), slip = seg(T, .58, .82, E.io), close = seg(T, .74, .95, E.out);
  const flinch = cmbBump(T, .56, .64, .76) * .08, squeeze = cmbBump(T, .95, 1.05, 1.36) * .06;
  const tw = trem * (noise1(t * 9, 3) * 4 + Math.sin(t * 47) * 1.8), sway = Math.sin(t * 1.3) * 5;
  const W = [900 + sway + tw, 172 + tw * .5 + Math.sin(t * 1.7) * 3];
  const curl = .08 + .14 * trem * (.5 + .5 * Math.sin(t * 3.3)) - flinch + close * .9 + squeeze;
  const redA = lerp(.65, .2, close), R1 = { rim: lampC, a: .85, lx: .75, ly: -.5, off: 7, rim2: redC, a2: redA, l2: [-1, .15] };
  // his coat and legs: a dark wall at the left, the bar's red on its far edge, the lamp on its near one
  const coat = dx => [[388 + dx, -400], [832 + dx, -400], [844 + dx, 820], [612, 848 + Math.abs(dx) * .4], [378 + dx, 820]];
  ctx.lineCap = 'round';
  stroke([[502, 700], [490, 1500]], 204, rgba(redC, redA)); stroke([[512, 700], [500, 1500]], 204, rgba(ink));
  stroke([[738, 700], [748, 1500]], 204, rgba(lampC, .6)); stroke([[730, 700], [740, 1500]], 204, rgba(ink));
  poly(coat(-9), rgba(redC, redA)); poly(coat(9), rgba(lampC, .62)); poly(coat(0), rgba(ink));
  ctx.save(); poly(coat(0)); ctx.clip();
  additive(() => { ctx.fillStyle = lg(378, 0, 650, 0, [[0, redC, .34 * redA / .65], [1, redC, 0]]); ctx.fillRect(300, -400, 400, 1300); ctx.fillStyle = lg(844, 0, 690, 0, [[0, lampC, .2], [1, lampC, 0]]); ctx.fillRect(600, -400, 300, 1300); });
  for (let i = 0; i < 7; i++) { const k = (t * .9 + rnd(i * 3.7)) % 1, x = 410 + rnd(i * 5.9) * 400; stroke([[x, -40 + k * 840], [x - 2, -40 + k * 840 + 50]], 3, rgba([150, 176, 240], .3 * Math.sin(Math.PI * k))); }   // rain running down the cloth
  ctx.restore();
  stroke([[700, 470], [806, 492]], 5, rgba(lampC, .22)); stroke([[700, 470], [696, 560]], 4, rgba(lampC, .12)); stroke([[612, -400], [612, 846]], 3, rgba([70, 80, 120], .25));   // a pocket, a seam
  // his hand, seen from the thumb side, the palm turned back toward her: sleeve, wrist and palm, the three far fingers
  cmbSil([[[[W[0] - 86, -400], [W[0] - 36, W[1] - 176]], 214]], R1);
  const PW = (x, y) => [W[0] + x * hs, W[1] + y * hs], Kn = PW(28, 150), R2 = Object.assign({ sheen: .5 }, R1);
  const palm = { pts: [], ws: [], flat: true };
  for (let i = 0; i <= 12; i++) { const q = i / 12; palm.pts.push(v2.lerp(PW(-22, -150), Kn, q)); palm.ws.push(keys([[0, 30], [.42, 31], [.76, 46], [1, 41]], q) * hs); }
  cmbForm([palm], R2);
  const defs = [                                                                         // [root x, y, bones, open, closed, width at root, at tip], far to near
    [-18, -6, [56, 40, 30], [.34, .9, 1.4], [.7, 1.6, 2.4], 30, 23],
    [-10, 6, [72, 50, 36], [.26, .72, 1.12], [.62, 1.52, 2.25], 34, 26],
    [-2, 10, [80, 54, 38], [.18, .56, .9], [.56, 1.44, 2.12], 36, 27],
    [8, 2, [74, 50, 36], [.1, .4, .68], [.5, 1.34, 2.0], 36, 27]];
  const fingers = defs.map(([dx, dy, lens, a0, a1, w0, w1], i) => cmbFinger([Kn[0] + dx * hs, Kn[1] + dy * hs], lens.map(v => v * hs),
    a0.map((a, j) => lerp(a, a1[j], curl) + trem * .035 * Math.sin(t * (29 + i * 7) + i * 2) * (j + 1)), w0 * hs, w1 * hs));
  for (let i = 0; i < 3; i++) cmbForm([fingers[i]], R2);
  // her yellow sleeve and her small hand, coming up from the lower right into his palm
  const ang = lerp(-.44, -.67, slip), e = v2.pol(ang, 1), e2 = v2.pol(ang - .12 - .1 * (1 - rise), 1), nrm = [-e[1], e[0]];
  const HW = v2.add(v2.lerp(v2.lerp([1660, 1220], [1226, 660], rise), [1152, 556], slip), [(sway + tw) * slip, 0]);
  const elb = v2.sub(HW, v2.mul(e2, 500)), upper = [elb[0] + 700, elb[1] + 260], cuff = v2.sub(HW, v2.mul(e, 2)), cb = v2.sub(cuff, v2.mul(e, 36)), kh = .1 + .5 * seg(T, .88, 1.14);
  const acr = k => lg(cuff[0] + nrm[0] * k, cuff[1] + nrm[1] * k, cuff[0] - nrm[0] * k, cuff[1] - nrm[1] * k, [[0, YL], [.3, Y], [1, YD]]);
  poly(stripPts([upper, v2.lerp(upper, elb, .7), elb, v2.lerp(elb, cb, .3), cb, cuff], [150, 118, 104, 88, 56, 52]), lg(0, cuff[1] - 120, 0, cuff[1] + 760, [[0, YL], [.1, Y], [.55, Y], [1, YD]]));
  poly(stripPts([cb, cuff], [58, 56]), lg(cuff[0] + nrm[0] * 58, cuff[1] + nrm[1] * 58, cuff[0] - nrm[0] * 58, cuff[1] - nrm[1] * 58, [[0, Y], [1, mix(YD, [150, 90, 10], .45)]]));
  stroke([v2.add(cb, v2.mul(nrm, 54)), v2.add(cb, v2.mul(nrm, -54))], 4, rgba(mix(YD, [150, 90, 10], .5), .9));
  stroke([v2.add(v2.lerp(elb, cuff, .1), v2.mul(nrm, 86)), v2.add(v2.sub(cb, v2.mul(e, 30)), v2.mul(nrm, 44))], 6, rgba([255, 252, 226], .6));       // the lamp along the wet sleeve
  stroke([v2.add(v2.lerp(elb, cuff, .5), v2.mul(nrm, -30)), v2.add(v2.lerp(elb, cuff, .72), v2.mul(nrm, -42))], 5, rgba(YD, .75));                   // folds
  stroke([v2.add(v2.lerp(elb, cuff, .3), v2.mul(nrm, 10)), v2.add(v2.lerp(elb, cuff, .46), v2.mul(nrm, -14))], 5, rgba(YD, .55));
  for (let i = 0; i < 5; i++) { const tt = t * 2.2 + rnd(i * 4.1), k = tt % 1, q = v2.add(v2.lerp(cuff, elb, .1 + rnd(i * 2.7 + Math.floor(tt) * 3.3) * .7), v2.mul(nrm, 50 + rnd(i * 6.3) * 30)); ctx.strokeStyle = rgba([255, 255, 240], .8 * (1 - k)); ctx.lineWidth = 2.5; line(q[0], q[1], q[0] - 9 * k - 4, q[1] - 14 * k - 4); line(q[0], q[1], q[0] + 9 * k + 4, q[1] - 14 * k - 4); }   // rain on it
  const s2 = 1.35, hk = v2.add(HW, v2.mul(e, 80 * s2)), hpalm = { pts: [], ws: [], flat: true }, hers = [hpalm];
  for (let i = 0; i <= 8; i++) { const q = i / 8; hpalm.pts.push(v2.lerp(v2.sub(HW, v2.mul(e, 26)), hk, q)); hpalm.ws.push(keys([[0, 25], [.3, 26], [.7, 32], [1, 30]], q) * s2); }
  for (let i = 0; i < 4; i++) {
    const a1 = ang + (i - 1.5) * .05 * (1 - kh) - kh * .4, a2 = a1 - kh * .9;
    hers.push(cmbFinger(v2.sub(v2.add(hk, v2.mul(nrm, (i - 1.5) * 13.2 * s2)), v2.mul(e, 8 * s2)), [(42 - Math.abs(i - 1.3) * 5) * s2, 27 * s2], [Math.PI - a1, Math.PI - a2], 21 * s2, 17 * s2));
  }
  hers.push(cmbFinger(v2.add(v2.add(HW, v2.mul(e, 34 * s2)), v2.mul(nrm, 26 * s2)), [32 * s2, 22 * s2], [Math.PI - (ang + .62 - kh * .4), Math.PI - (ang + .36 - kh * .5)], 22 * s2, 17 * s2));
  cmbForm([hpalm], { fill: [30, 20, 20], rim: lampC, a: .95, lx: .5, ly: -.8, off: 5, sheen: .5 });
  for (let i = 1; i < hers.length; i++) cmbForm([hers[i]], { fill: [30, 20, 20], rim: lampC, a: .95, lx: .5, ly: -.8, off: 4.5, sheen: .5 });
  // his first finger and his thumb close over hers
  cmbForm([fingers[3]], R2);
  const rub = .07 * cmbBump(T, .98, 1.14, 1.4);                                          // his thumb moves once across her fingers
  cmbForm([cmbFinger(PW(32, 70), [60 * hs, 46 * hs], [lerp(.24, .72, curl) + rub, lerp(.4, 1.16, curl) + rub * 2], 37 * hs, 27 * hs)], R2);
  const tipI = fingers[3].pts[fingers[3].pts.length - 1];
  // rain: a drop gathers on his fingertip and falls; streaks lit by the lamp
  const dq = inv(.14, .5, T);
  if (dq < 1) { const y = tipI[1] + 30 + (dq > .45 ? Math.pow((dq - .45) / .55, 2) * 560 : 0); oval(tipI[0] + 6, y, 6 + 2 * dq, 9 + (dq > .45 ? 11 : 5 * dq), rgba([206, 224, 255], .85)); }
  additive(() => { ctx.lineCap = 'round'; ctx.lineWidth = 3; for (let i = 0; i < 26; i++) { const sp = 1.5 + rnd(i * 1.3), tt = t * sp + rnd(i * 3.1), h = tt % 1, x = 760 + rnd(i * 1.7 + Math.floor(tt) * 5.3) * 860, y = -80 + h * 1050; ctx.strokeStyle = rgba(lampC, clamp(.4 * (1 - Math.abs(x - 1170) / 560))); line(x, y, x - 10, y - 74); } });
  rain(t, { n: 110, len: 110, speed: 2000, slant: .14, a: .24 });
  rain(t, { n: 12, len: 300, speed: 3000, slant: .14, a: .1, w: 7, seed: 7 });
}, { bloom: .5, grain: .55 }, [640, 120, 1400, 900]);
// ---------- THE LAST PICTURE and its words: the cold line called back, and its answer in her colour ----------
defShot('walkaway', (t, p, L) => {
  if (SHOT.walkawaypic) SHOT.walkawaypic.draw(t, Object.assign({ cam: [[0, 1.5, 960, 800], [1, 1.66, 960, 790]] }, p), L); else fill([255, 190, 120], [240, 140, 90]);
  const a1 = seg(L, .35, .5), hitL = p.hit ?? 2.06;
  if (!OUT.vertical) {
    screen();
    ctx.fillStyle = rg(960, 170, 0, 700, [[0, [40, 14, 6], .34 * a1], [1, [40, 14, 6], 0]]); ctx.fillRect(0, 0, W, H);       // a soft dark bed so the words hold on the bright sky
    macType('GUESS WHO REMEMBERS.', 960, 92, 72, seg(L, .4, 1.3, E.lin), 1, t, [255, 246, 232]);
    if (L >= hitL) { ctx.save(); ctx.shadowColor = 'rgba(30,10,0,.9)'; ctx.shadowBlur = 30; slam('SHE DOES.', 960, 228, 150, PAL.yellow, 1, hitL, L, 14, '800', .5); ctx.restore(); }
  } else {
    ui(); typeBlock([['GUESS WHO REMEMBERS.', seg(L, .4, 1.3, E.lin)]], 620, 62, [255, 246, 232], 1, t, OUT.w / 2, 840);
    if (L >= hitL) slam('SHE DOES.', OUT.w / 2, 800, fitSize('SHE DOES.', 150, 760, 12), PAL.yellow, 1, hitL, L, 12, '800', .5);
  }
}, () => [560, 300, 1360, 1000]);

// ---------- its words, big enough for a phone (the film's own drawing; a Short keeps the engine's) ----------
const engineWords = devilWords;
devilWords = function (t) {
  if (OUT.vertical) return engineWords(t);
  const c = FILM.words.find(v => t >= v.t && t < v.t + v.d + .5);
  if (!c || c.show === false) return;
  const real = !!c.real, a = win(t, c.t, c.t + c.d + .5, .1, .3), L = t - c.t, text = real ? c.text.toUpperCase() : c.text;
  ctx.setTransform(1, 0, 0, 1, SHX, SHY); ctx.textBaseline = 'middle';
  const x = W / 2, y = real ? 930 : 940, size = real ? 108 : 80;
  ctx.fillStyle = rg(x, y, 0, 760, [[0, [4, 0, 2], .62 * a], [1, [4, 0, 2], 0]]);                 // a soft dark bed
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .22); ctx.beginPath(); ctx.arc(0, 0, 760, 0, TAU); ctx.restore(); ctx.fill();
  if (real) {
    font(size, SANS, '800'); ctx.textAlign = 'center';
    const sc = 1 + .25 * (1 - E.out(clamp(L / .15))), jit = L < .35 ? 1 : .18, f = Math.floor(t * 30), j = k => (rnd(f * 5 + k) - .5) * 14 * jit;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = `rgba(0,255,255,${.3 * a})`; ctx.fillText(text, j(1) - 5, j(2));
    ctx.fillStyle = `rgba(255,0,60,${.45 * a})`; ctx.fillText(text, j(3) + 5, j(4));
    ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = `rgba(10,0,2,${.9 * a})`; ctx.strokeText(text, 0, 0);
    ctx.shadowColor = 'rgba(0,0,0,.95)'; ctx.shadowBlur = 24; ctx.fillStyle = rgba([255, 52, 56], a); ctx.fillText(text, 0, 0);
    ctx.restore();
  } else {
    font(size, SERIF, '400', 'italic'); ctx.textAlign = 'left';
    const n = text.length * clamp(L / .5), whole = Math.floor(n), lx = x - ctx.measureText(text).width / 2;
    ctx.save(); ctx.shadowColor = rgba(C.red, .85 * a); ctx.shadowBlur = 26;
    ctx.fillStyle = rgba([255, 222, 228], .97 * a); ctx.fillText(text.slice(0, whole), lx, y);
    if (whole < text.length && n > whole) { ctx.fillStyle = rgba([255, 222, 228], .97 * a * (n - whole)); ctx.fillText(text[whole], lx + ctx.measureText(text.slice(0, whole)).width, y); }
    ctx.restore();
  }
};

// ---------- the code-drawn thumbnail (a stand-in until the ChatGPT one): the bottle, her inside, its grin behind the glass ----------
defShot('thumb', (t, p) => {
  macBg(t, { red: .85, gx: 1380, lx: 1380 });
  const fr = [1, 960, 540]; PUSH = 1; cam(...fr);
  ctx.fillStyle = lg(0, 0, 1100, 0, [[0, [4, 16, 22], .96], [.7, [6, 20, 26], .7], [1, [6, 20, 26], 0]]); ctx.fillRect(0, 0, 1920, 1080);
  placeDevil([1560, 2960, 3.2]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .2 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  bottle(1400, 1120, 4.3, { cork: 1, glass: [215, 255, 248], glowC: PAL.yellow, glowA: .5, hot: .4,
    inner: () => {
      lilyBust(0, -112, 31, 'hurt', { a: 1, turn: 0, glow: .6 });
      for (const sd of [-1, 1]) { stroke([[sd * 22, -62], [sd * 34, -92]], 11, rgba(PAL.yellow)); disc(sd * 35, -98, 8, rgba([9, 10, 14])); for (let f = 0; f < 4; f++) disc(sd * 35 + (f - 1.5) * 4.4, -106, 2.8, rgba([9, 10, 14]));
        ctx.strokeStyle = rgba([255, 255, 255], .7); ctx.lineWidth = 1.4; for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(sd * 35, -98, 8 + i * 6, 0, TAU); ctx.stroke(); } }
    } });
  claw([2060, 930], Math.PI + .5, 2.6, { curl: .3, spread: 1.1, arm: 600, side: -1 });
  screen(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  const word = (txt, x, y, size, fillc, edge, lw) => { font(size, SANS, '900'); ctx.save(); ctx.shadowColor = 'rgba(255,30,30,.9)'; ctx.shadowBlur = 40; ctx.lineWidth = lw; ctx.strokeStyle = rgba(edge); ctx.strokeText(txt, x, y); ctx.restore(); ctx.fillStyle = rgba(fillc); ctx.fillText(txt, x, y); };
  word('THE', 70, 330, 140, [255, 255, 255], [220, 20, 30], 22);
  word('BOTTLE', 60, 600, 236, [255, 255, 255], [220, 20, 30], 30);
  word('IT KEEPS HER', 74, 760, 100, [255, 222, 60], [20, 4, 4], 18);
  finish(t, { bloom: .4, grain: .3 });
});
// ---------- THE BOTTLE: the cut ----------
// Times follow the music: the bar scenes cut on the score's beats (100 bpm from 4.33 s), the comeback on the anthem's
// (127 bpm from 70.03 s). mix.py uses the same numbers.
const CUT = [
  [0, 'cold'], [3.6, 'sting'],
  [4.33, 'phonehand'], [6.73, 'bardoor', { mode: 'beckon' }], [8.53, 'lilyout'],
  [10.33, 'barwide', { round: 1 }], [12.13, 'pour'], [13.33, 'slide'], [14.53, 'drink'], [15.73, 'trade', { what: 'watch' }], [17.53, 'bottlein', { n: 1 }],
  [18.73, 'lilyA'],
  [20.53, 'barwide', { round: 2, st: { watch: 1 } }], [22.33, 'lilyB'], [24.13, 'phonebar'], [25.33, 'trade', { what: 'phone' }], [27.13, 'bottlein', { n: 2 }],
  [28.33, 'lilyface', { ex: 'worry' }],
  [29.53, 'twoshot'], [31.93, 'photohand'], [33.13, 'trade', { what: 'photo' }], [34.33, 'bottlein', { n: 3 }],
  [35.53, 'lilyC'],
  [37.33, 'montage'],
  [40.33, 'empty'], [41.73, 'twist'], [44.33, 'knuckles'],
  [45.13, 'hisface', { look: 'bar', from: 'empty', to: 'shock', at: 0, jerk: 1 }], [46.13, 'devface'], [47.93, 'replays'], [50.03, 'bigbottle'],
  [51.83, 'hisface', { look: 'red', from: 'fear', to: 'resolve', tremble: 1, at: .25 }], [52.83, 'smash'], [54.03, 'scream'], [55.23, 'grab'],
  [56.43, 'runside'], [58.03, 'puddle'], [58.83, 'runface'],
  [59.93, 'arrive'], [61.93, 'lilyface', { ex: 'hurt' }], [63.43, 'kneel'], [65.83, 'reach'], [67.83, 'walkhome'],
  [70.03, 'sink'], [71.95, 'pushups', { mode: 'watch' }], [73.84, 'hisface', { look: 'dawn', from: 'strain', to: 'strain', sweat: 1, tilt: .12, noblink: 1 }], [74.78, 'bridge'], [77.15, 'pullups'],
  [79.03, 'pushups', { mode: 'count' }], [80.93, 'schoolam'],
  [82.34, 'bardoor', { mode: 'offer' }], [84.74, 'hisface', { look: 'street', from: 'calm', to: 'tempted', at: .1, rain: 1 }], [85.94, 'hand'], [87.34, 'bardoor', { mode: 'after' }],
  [89.14, 'goldwait'], [91.14, 'jump'], [92.94, 'hug'], [95.74, 'bardoor', { mode: 'eyes' }], [97.94, 'walkaway', { hit: 2.06 }],
  [101.54, 'title', { at: 101.6 }]
];
for (const c of CUT) if (!SHOT[c[1]]) {                                     // a part not built yet shows its name (never in a finished film)
  const name = c[1]; defShot(name, (t, p, L) => { fill([24, 26, 34], [12, 12, 18]); screen(); font(90, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([120, 130, 150]); ctx.fillText(name + (p && (p.mode || p.ex) ? ' · ' + (p.mode || p.ex) : ''), W / 2, H / 2); });
  (window.MISSING = window.MISSING || []).push(name);
}
defineFilm({
  title: 'THE BOTTLE', subtitle: 'SHE WAITED TILL DARK', dur: 103.9, fadeOut: 1.3,
  app: { name: 'BAR', label: 'BAR', icon: '!', color: [226, 132, 30] },
  phases: [{ name: 'Cold open', a: 0, b: 4.33 }, { name: 'The deal', a: 4.33, b: 40.33 }, { name: 'The twist', a: 40.33, b: 52.83 }, { name: 'The run', a: 52.83, b: 70.03 }, { name: 'The comeback', a: 70.03, b: 89.14 }, { name: 'Day 90', a: 89.14, b: 103.9 }],
  words: [
    { id: 'C1', t: .1, d: 3.3, text: 'YOU DRINK TO FORGET… GUESS WHO REMEMBERS.', show: false },
    { id: 'W1', t: 6.95, d: 1.3, text: "First one's free." },
    { id: 'W2', t: 15.95, d: 1.3, text: 'Forget the time.' },
    { id: 'W3', t: 25.75, d: 1.2, text: "They'll call back." },
    { id: 'W4', t: 29.8, d: 1.9, text: "She'll wait. She always does." },
    { id: 'R1', t: 46.28, d: 1.3, text: 'I took nothing.', real: true },
    { id: 'R2', t: 48.0, d: 1.7, text: 'You handed her over.', real: true },
    { id: 'R3', t: 50.15, d: 1.4, text: "You're next.", real: true },
    { id: 'W5', t: 83.3, d: 1.2, text: 'Still free…' },
    { id: 'R4', t: 96.2, d: 1.5, text: 'She waited. So can I.', real: true },
    { id: 'C2', t: 98.3, d: 3, text: 'GUESS WHO REMEMBERS. SHE DOES.', show: false }
  ],
  slams: [3.6, 45.13, 46.13, 47.93, 48.43, 48.93, 50.03, 53.05, 54.03, 100.0],
  glitch: [[3.5, 3.9, 1], [45.1, 45.45, 1], [47.9, 48.1, .6], [50.0, 50.25, .7]],
  flash: { sting: [255, 60, 60], devface: [255, 60, 60], twist: [255, 255, 255] },
  vignette: [[0, .5], [40, .55], [45, .7], [53, .6], [60, .5], [69.9, .5], [70.1, .25], [82.2, .25], [82.5, .5], [89, .5], [89.3, .2], [101.4, .2], [101.6, .5]],
  heartbeat: [[84.74, 87.34]],
  expr: [[0, 'tired']],
  shots: CUT
});
