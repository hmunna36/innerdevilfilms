// ===== RAGE, part A: the palette, his poses and Sam's, the shadow, the LED clocks =====
// (film.js is built from parts/*.js by parts/build.sh; edit the parts)

let GT = 0;                                   // the film time of the frame being drawn
{ const base = renderFilm; renderFilm = t => { GT = t; return base(t); }; }   // eslint-disable-line no-global-assign

// ---------- the palette: ember orange; every snap the light turns redder and darker ----------
// HEAT: 0 the warm kitchen at 7 PM … 1 the hallway at 9:17 PM, deep ember red; after the turn the evening light is calm
const HEAT = [[0, 0], [11.75, 0], [11.95, .3], [20.7, .3], [20.9, .55], [29.6, .55], [29.8, .78], [35.1, .78], [35.3, 1], [63.4, 1]];
const heatAt = t => t >= 63.4 ? 0 : keys(HEAT, t);
const EMBER = {
  wallHi: [196, 112, 58], wallLo: [92, 40, 22],      // the wall under the lamp … in its corners
  hotHi: [168, 52, 30], hotLo: [52, 12, 10],         // the same at full heat
  calmHi: [214, 170, 120], calmLo: [110, 78, 52],    // the kitchen after the turn: calm, warm cream
  lamp: [255, 196, 120], lampHot: [255, 96, 50], night: [40, 58, 104]
};
const roomCol = (k, hi, calm) => calm ? (hi ? EMBER.calmHi : EMBER.calmLo) : mix(hi ? EMBER.wallHi : EMBER.wallLo, hi ? EMBER.hotHi : EMBER.hotLo, k);
const shade = (c, k) => mix([6, 4, 4], c, clamp(k));
SPR.ember = sprite([255, 120, 50]); SPR.hot = sprite([255, 70, 40]); SPR.lamp = sprite([255, 200, 130]); SPR.dawn = sprite([255, 214, 160]);
SPR.night = sprite([90, 130, 220]); SPR.star = sprite([255, 236, 170]); SPR.steel = sprite([170, 200, 235]);

// ---------- figures: him (s 1.1) and Sam (about half his height), in profile ----------
// f: +1 facing right, -1 facing left. fy: the floor under the feet. o.hands [[x, y], [x, y]] (back hand, front hand) in
// world px, o.lean (radians forward), o.knee (0 standing … 1 crouched), o.head (extra head tilt), o.step (feet apart)
function figPose(x, fy, s, f, o = {}, kid = false) {
  const K = kid ? { leg: 150, torso: 124, neck: 64, R: 50, up: 64, fore: 60, wT: 50, wL: 30, wA: 18 }
    : { leg: 188, torso: 186, neck: 66, R: 40, up: 80, fore: 76, wT: 58, wL: 38, wA: 23 };
  const kn = o.knee || 0, lean = o.lean || 0, step = (o.step ?? 1) * (kid ? 16 : 22) * s;
  const hip = [x + (o.hipdx || 0) * s, fy - K.leg * s * (1 - .42 * kn)];
  const sh = [hip[0] + Math.sin(lean) * K.torso * s * f, hip[1] - Math.cos(lean) * K.torso * s];
  const ha = lean * 1.15 + (o.head || 0);
  const hd = [sh[0] + Math.sin(ha) * K.neck * s * f + 6 * s * f, sh[1] - Math.cos(ha) * K.neck * s];
  const legTo = (foot, sd) => {
    const [knee, end] = ik(hip, foot, K.leg * .52 * s, K.leg * .5 * s, j => j[0] * f);
    return [[hip, knee, end], K.wL * s * (sd < 0 ? .94 : 1)];
  };
  const feet = o.feet || [[x - step * f, fy], [x + step * f, fy]];
  const arm = (target, sd) => {
    const a = [sh[0] - sd * 4 * s * f, sh[1] + 12 * s];
    const want = target || [a[0] + (6 + sd * 6) * s * f, a[1] + (K.up + K.fore) * s * .96];
    const [el, wr] = ik(a, want, K.up * s, K.fore * s, j => (o.elbowUp ? -j[1] : j[1]) - j[0] * f * .6);
    return [[a, el, wr], K.wA * s];
  };
  const H = o.hands || [null, null];
  const backArm = arm(H[0], -1), frontArm = arm(H[1], 1);
  const parts = [backArm, legTo(feet[0], -1), [[hip, [lerp(hip[0], sh[0], .5) + 4 * s * f, lerp(hip[1], sh[1], .5)], sh], K.wT * s], legTo(feet[1], 1), frontArm];
  const fistR = (kid ? 11 : 15) * s;
  if (!o.open) for (const A of [backArm, frontArm]) parts.push([[A[0][2], A[0][2]], fistR * 2]);   // fists
  return { head: [hd[0], hd[1], K.R * s], hand: frontArm[0][2], hands: [backArm[0][2], frontArm[0][2]], parts, f, sh, hip, kid };
}
// Sam sitting at the table (seat height sy), hands forward on the table top (ty)
function kidSit(x, sy, s, f, o = {}) {
  const hip = [x, sy], sh = [x + Math.sin(o.lean || .08) * 124 * s * f, sy - Math.cos(o.lean || .08) * 124 * s];
  const hd = [sh[0] + 8 * s * f, sh[1] - 62 * s];
  const knee = [x + 70 * s * f, sy + 4 * s], foot = [x + 76 * s * f, sy + 82 * s];
  const H = o.hands || [[x + 96 * s * f, sy - 50 * s], [x + 108 * s * f, sy - 46 * s]];
  const arm = (h, sd) => { const a = [sh[0], sh[1] + 10 * s]; const [el, wr] = ik(a, h, 62 * s, 58 * s, j => j[1] - j[0] * f * .5); return [[a, el, wr], 18 * s]; };
  const A0 = arm(H[0], -1), A1 = arm(H[1], 1);
  return { head: [hd[0], hd[1], 50 * s], hand: A1[0][2], hands: [A0[0][2], A1[0][2]], f, kid: true,
    parts: [A0, [[hip, knee, foot], 30 * s], [[hip, sh], 50 * s], A1] };
}
// Sam crouched in a corner, knees up, arms over his head (k: 0 hands over his ears … 1 hands over his head)
function kidCrouch(x, fy, s, f, k = 1, look = 0) {
  const hip = [x, fy - 34 * s], sh = [x + 30 * s * f, fy - 140 * s + 10 * look * s];
  const hd = [sh[0] + (20 - 14 * look) * s * f, sh[1] - (40 + 18 * look) * s];
  const knee = [x + 70 * s * f, fy - 96 * s], foot = [x + 92 * s * f, fy];
  const ear = [hd[0] - 10 * s * f, hd[1] + 6 * s], top = [hd[0] - 6 * s * f, hd[1] - 46 * s];
  const tgt = look > .5 ? [knee[0] + 10 * s * f, knee[1] + 20 * s] : lerp2(ear, top, k);
  const arm = (dx) => { const a = [sh[0], sh[1] + 10 * s]; const [el, wr] = ik(a, [tgt[0] + dx * s, tgt[1]], 62 * s, 58 * s, j => -j[1] + j[0] * f); return [[a, el, wr], 18 * s]; };
  return { head: [hd[0], hd[1], 50 * s], hand: tgt, hands: [tgt, tgt], f, kid: true,
    parts: [arm(-14), [[hip, [knee[0] - 16 * s * f, knee[1] + 6 * s], [foot[0] - 20 * s * f, foot[1]]], 28 * s], [[hip, sh], 50 * s], [[hip, knee, foot], 30 * s], arm(10)] };
}
// him kneeling (k: 0 standing … 1 down on one knee), his hands held out open, palms up
function manKneel(x, fy, s, f, k, open = 1, floor = false) {
  const hipY = lerp(fy - 188 * s, fy - 112 * s, k), hip = [x, hipY];
  const sh = [x + 14 * s * f, hipY - 182 * s], hd = [sh[0] + 14 * s * f, sh[1] - 64 * s];
  const kneeF = [x + lerp(26, 92, k) * s * f, lerp(fy - 96 * s, fy - 92 * s, k)], footF = [kneeF[0] + 4 * s * f, fy];
  const kneeB = [x - lerp(10, 40, k) * s * f, lerp(fy - 96 * s, fy - 6 * s, k)], footB = [kneeB[0] - 92 * s * f * k, fy - 4 * s];
  const hand = sd => floor ? [sh[0] + (150 + sd * 30) * s * f, fy - 8 * s] : [sh[0] + (lerp(30, 130, open) + sd * 14) * s * f, sh[1] + lerp(150, 118, open) * s + sd * 6 * s];
  const arm = sd => { const a = [sh[0], sh[1] + 12 * s]; const [el, wr] = ik(a, hand(sd), 80 * s, 76 * s, j => j[1]); return [[a, el, wr], 23 * s]; };
  const A0 = arm(-1), A1 = arm(1), P = { head: [hd[0], hd[1], 40 * s], f, sh, hip, hands: [A0[0][2], A1[0][2]],
    parts: [A0, [[hip, kneeB, footB], 36 * s], [[hip, sh], 58 * s], [[hip, kneeF, footF], 38 * s], A1] };
  P.hand = A1[0][2];
  return P;
}
// a pose mirrored about x = cx (for a figure facing the other way when a pose function only faces right)
function mirrorPose(P, cx) {
  const m = p => [2 * cx - p[0], p[1]];
  return Object.assign({}, P, { head: [2 * cx - P.head[0], P.head[1], P.head[2]], hand: m(P.hand), hands: P.hands && P.hands.map(m),
    parts: P.parts.map(([pts, w]) => [pts.map(m), w]), f: -(P.f || 1) });
}
// his face or Sam's on a figure: turned toward where he faces; Sam's has a tuft of hair
function figFace(P, ex, light, la = .3, lc = [.5, -.3], featA = .92) {
  const [x, y, r] = P.head, f = P.f || 1;
  ctx.save();
  if (f < 0) { ctx.translate(2 * x, 0); ctx.scale(-1, 1); }
  face(x, y, r, ex, { turn: .9, light, la, lc: [lc[0] * f, lc[1]], featA });
  ctx.restore();
}
function samTuft(P, col) {                     // Sam: a little tuft of hair on top, so he reads as a child
  const [x, y, r] = P.head, f = P.f || 1;
  ctx.fillStyle = rgba(col);
  for (const [dx, h, w] of [[-.18, .32, .16], [.06, .4, .18], [.3, .3, .15]]) {
    ctx.beginPath(); ctx.moveTo(x + (dx - w) * r * f, y - r * .86); ctx.quadraticCurveTo(x + (dx + .08) * r * f, y - r * (1 + h) - 4, x + (dx + w + .1) * r * f, y - r * .8); ctx.fill();
  }
}
// draw a figure: him (dark, ember rim) or Sam (a little lighter, with his tuft); ex: an expression
function drawFig(P, ex, rim, rimA, light, o = {}) {
  const f = P.f || 1, fillC = P.kid ? [16, 15, 24] : [8, 7, 9];
  drawPerson(P, fillC, rim, rimA, o.lx ?? -f * .3, o.ly ?? -1, o.back ?? true);
  if (P.kid) samTuft(P, fillC);
  figFace(P, ex, light, o.la ?? .32, o.lc || [.5, -.3], o.featA ?? .92);
}
// his shadow on the wall: the same pose, flat and dark, thrown up and away from the lamp
function wallShadow(P, lampX, a, k = 1.12, dy = -30, col = [20, 6, 4]) {
  if (a <= .01) return;
  const b = poseBox(P, 0), fx = (b[0] + b[2]) / 2, fy = b[3];
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(fx + (fx - lampX) * .22, fy + dy); ctx.scale(k, k); ctx.translate(-fx, -fy);
  ctx.strokeStyle = ctx.fillStyle = rgba(col); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [pts, w] of P.parts) limb(pts, w);
  ctx.beginPath(); ctx.arc(P.head[0], P.head[1], P.head[2], 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- the clocks: seven-segment digits (the oven's amber, the gym's red timer) ----------
const SEG7 = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
function segDigit(ch, x, y, w, h, col, a, off = .07) {
  const th = w * .2, on = SEG7[ch] || '', segs = {
    a: [x + th * .6, y, w - th * 1.2, th, 0], d: [x + th * .6, y + h - th, w - th * 1.2, th, 0], g: [x + th * .6, y + h / 2 - th / 2, w - th * 1.2, th, 0],
    f: [x, y + th * .6, th, h / 2 - th * .9, 1], b: [x + w - th, y + th * .6, th, h / 2 - th * .9, 1],
    e: [x, y + h / 2 + th * .3, th, h / 2 - th * .9, 1], c: [x + w - th, y + h / 2 + th * .3, th, h / 2 - th * .9, 1]
  };
  for (const k in segs) {
    const [sx, sy, sw, sh2] = segs[k], lit = on.includes(k);
    ctx.fillStyle = rgba(col, lit ? a : a * off);
    ctx.beginPath();
    if (sw > sh2) { ctx.moveTo(sx, sy + sh2 / 2); ctx.lineTo(sx + sh2 / 2, sy); ctx.lineTo(sx + sw - sh2 / 2, sy); ctx.lineTo(sx + sw, sy + sh2 / 2); ctx.lineTo(sx + sw - sh2 / 2, sy + sh2); ctx.lineTo(sx + sh2 / 2, sy + sh2); }
    else { ctx.moveTo(sx + sw / 2, sy); ctx.lineTo(sx + sw, sy + sw / 2); ctx.lineTo(sx + sw, sy + sh2 - sw / 2); ctx.lineTo(sx + sw / 2, sy + sh2); ctx.lineTo(sx, sy + sh2 - sw / 2); ctx.lineTo(sx, sy + sw / 2); }
    ctx.closePath(); ctx.fill();
  }
}
// '7:02' centred at (cx, cy), digit height h; returns the width
function segTime(txt, cx, cy, h, col, a, glowA = 1) {
  const w = h * .52, gap = h * .14, colon = h * .2, chars = [...txt];
  const total = chars.reduce((s, c) => s + (c === ':' ? colon : w) + gap, -gap);
  let x = cx - total / 2;
  ctx.save(); ctx.shadowColor = rgba(col, .9 * a * glowA); ctx.shadowBlur = h * .25 * VP.k;
  for (const c of chars) {
    if (c === ':') { ctx.fillStyle = rgba(col, a); for (const dy of [.3, .7]) { ctx.beginPath(); ctx.arc(x + colon / 2, cy - h / 2 + h * dy, h * .06, 0, Math.PI * 2); ctx.fill(); } x += colon + gap; }
    else { segDigit(c, x, cy - h / 2, w, h, col, a); x += w + gap; }
  }
  ctx.restore();
  return total;
}
