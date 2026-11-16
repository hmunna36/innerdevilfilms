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
