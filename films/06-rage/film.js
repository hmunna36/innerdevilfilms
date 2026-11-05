'use strict';
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
// ===== RAGE, part B: the sets. The kitchen (the main set), the hallway, Sam's room =====
// Filled and lit like the engine's bedroom (SKILL.md rule 15): mid-tone ember walls under a lamp, solid furniture with
// lit edges, a cool window; his dark figure and the devil always stand against something lighter.

const FY = 880, CY = 66;                       // the kitchen's floor and ceiling lines (world px)
const LAMP = [1150, 300];                      // the pendant lamp's bulb, over the table
const HOLE = [1492, 500];                      // where his fist goes through the wall
// the night's moments (film time): the pot, the juice, the shout, the punch, the drawing drops, the blows on Sam's door,
// the frame splits and the mirror cracks; after the turn: the juice again, the wall patched, the drawing taped back
const T_POT = 11.8, T_SPILL = 19.7, T_SHOUT = 20.8, T_PUNCH = 29.7, T_DROP = 29.85, T_BLOW = 38.9, T_CRACK = 39.0, BLOWS = [T_BLOW];
const TURN = 63.4, T_SPILL2 = 88.9, T_PATCH = 96.3, T_TAPE = 99.7;
const HALL_HOLE = [1196, 520];                    // the one blow: the wall between Sam's door and the hall mirror

// the lamp's swing after the shout (radians)
const lampSwing = t => (t > T_SHOUT && t < TURN) ? .2 * Math.sin((t - T_SHOUT) * 5.2) * Math.exp(-(t - T_SHOUT) * .45) : t > T_PUNCH && t < 40 ? .1 * Math.sin((t - T_PUNCH) * 5.6) * Math.exp(-(t - T_PUNCH) * .6) : 0;
function lampPos(t) { const a = lampSwing(t), L = LAMP[1] - CY; return [LAMP[0] + Math.sin(a) * L, CY + Math.cos(a) * L]; }

// q: { heat, calm (the evening after the turn), dark (0 … 1 more black), flick }
function kitchenSet(t, q) {
  const k = q.heat, calm = !!q.calm, fl = q.flick ? .78 + .22 * Math.abs(Math.sin(t * 29) * Math.sin(t * 6.1)) : 1;
  const [lx, ly] = lampPos(t), hi = roomCol(k, 1, calm), lo = roomCol(k, 0, calm), lampC = calm ? [255, 214, 160] : mix(EMBER.lamp, EMBER.lampHot, k);
  const L = (1 - .35 * (q.dark || 0)) * fl;
  // the wall, lit from the lamp
  const g = ctx.createRadialGradient(lx, ly + 120, 60, lx, ly + 120, 1500);
  g.addColorStop(0, rgba(shade(hi, L))); g.addColorStop(.55, rgba(shade(mix(hi, lo, .55), L))); g.addColorStop(1, rgba(shade(lo, L * .8)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  // the ceiling and its cornice
  ctx.fillStyle = rgba(shade(lo, .55 * L)); ctx.fillRect(-W, -H, 3 * W, H + CY);
  ctx.fillStyle = rgba(shade(hi, .8 * L)); ctx.fillRect(-W, CY, 3 * W, 6);
  // the floor: big tiles, lit under the lamp
  const fg = ctx.createLinearGradient(0, FY, 0, FY + 300);
  fg.addColorStop(0, rgba(shade(mix(lo, hi, .35), .75 * L))); fg.addColorStop(1, rgba(shade(lo, .35 * L)));
  ctx.fillStyle = fg; ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.strokeStyle = rgba(shade(lo, .25 * L), .8); ctx.lineWidth = 3;
  for (let i = -12; i < 30; i++) line(i * 120 - 400, FY, i * 180 - 1300, FY + 700);
  for (const yy of [FY + 46, FY + 120, FY + 230]) line(-W, yy, 2 * W, yy);
  additive(() => { ctx.save(); ctx.translate(lx, FY + 60); ctx.scale(1, .2); glow(sprOf(lampC), 0, 0, 760, .3 * L); ctx.restore(); });
  ctx.fillStyle = rgba(shade(hi, .7 * L)); ctx.fillRect(-W, FY - 14, 3 * W, 14);                 // the skirting board
  // the window: night outside, cool blue, a few lit windows across the street
  const wx = 620, wy = 200, ww = 280, wh = 290;
  const sky = ctx.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, rgba(calm ? [70, 70, 120] : [22, 30, 66])); sky.addColorStop(1, rgba(calm ? [190, 120, 110] : [52, 70, 124]));
  ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = rgba([12, 14, 30]); ctx.beginPath(); ctx.moveTo(wx, wy + wh);
  for (const [u, v] of [[0, .62], [.2, .62], [.2, .48], [.42, .48], [.42, .7], [.6, .7], [.6, .4], [.78, .4], [.78, .58], [1, .58]]) ctx.lineTo(wx + u * ww, wy + v * wh);
  ctx.lineTo(wx + ww, wy + wh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba([255, 206, 120], .85);
  for (const [u, v] of [[.08, .7], [.28, .56], [.33, .66], [.66, .5], [.7, .62], [.86, .66]]) ctx.fillRect(wx + u * ww, wy + v * wh, 10, 12);
  additive(() => glow(SPR.night, wx + ww / 2, wy + wh / 2, 420, .14 * L));
  ctx.strokeStyle = rgba(shade(hi, .95 * L)); ctx.lineWidth = 16; ctx.strokeRect(wx - 6, wy - 6, ww + 12, wh + 12);
  ctx.lineWidth = 8; line(wx + ww / 2, wy, wx + ww / 2, wy + wh);
  ctx.strokeStyle = rgba([170, 190, 240], .4); ctx.lineWidth = 2; ctx.strokeRect(wx + 4, wy + 4, ww - 8, wh - 8);
  // upper cabinets over the stove
  for (let i = 0; i < 3; i++) {
    const cx0 = 236 + i * 128;
    ctx.fillStyle = rgba(shade(mix(lo, hi, .62), .8 * L)); rrect(cx0, 110, 120, 220, 6); ctx.fill();
    ctx.strokeStyle = rgba(shade(hi, 1.05 * L), .6); ctx.lineWidth = 3; ctx.strokeRect(cx0 + 12, 124, 96, 192);
    ctx.fillStyle = rgba(shade(hi, 1.3 * L)); ctx.fillRect(cx0 + (i % 2 ? 16 : 96), 260, 8, 40);
  }
  ctx.fillStyle = rgba(shade(lo, .5 * L)); ctx.fillRect(226, 330, 400, 10);
  // the counter and its cabinets
  ctx.fillStyle = rgba(shade(mix(lo, hi, .5), .78 * L)); ctx.fillRect(-W, 618, W + 860, FY - 618);
  ctx.strokeStyle = rgba(shade(hi, .9 * L), .5); ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) { const cx0 = -60 + i * 132; if (cx0 > 200 && cx0 < 520) continue; ctx.strokeRect(cx0 + 10, 640, 112, 210); ctx.fillStyle = rgba(shade(hi, 1.3 * L)); ctx.fillRect(cx0 + 56, 656, 22, 7); }
  ctx.fillStyle = rgba(shade(hi, 1.15 * L)); ctx.fillRect(-W, 596, W + 872, 24);              // the counter top
  ctx.fillStyle = rgba(shade(hi, 1.6 * L), .7); ctx.fillRect(-W, 596, W + 872, 4);
  // the sink under the window, and its tap
  ctx.fillStyle = rgba(shade(lo, .35 * L)); rrect(650, 598, 230, 18, 8); ctx.fill();
  ctx.strokeStyle = rgba(shade([200, 200, 210], .9 * L)); ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(845, 596); ctx.lineTo(845, 520); ctx.quadraticCurveTo(845, 488, 810, 490); ctx.lineTo(798, 506); ctx.stroke();
  // the stove: its back panel with the clock, the burners, the oven door
  ctx.fillStyle = rgba([24, 18, 18]); rrect(250, 540, 270, 58, 8); ctx.fill();
  ctx.fillStyle = rgba(shade(hi, .5 * L)); ctx.fillRect(250, 596, 270, 24);
  ovenClockSmall(t, 385, 568, 26);
  ctx.fillStyle = rgba([30, 24, 24]); rrect(258, 640, 254, 222, 10); ctx.fill();
  ctx.fillStyle = rgba([12, 9, 10]); rrect(290, 690, 190, 120, 8); ctx.fill();
  ctx.strokeStyle = rgba(shade(hi, 1.2 * L), .55); ctx.lineWidth = 3; rrect(290, 690, 190, 120, 8); ctx.stroke();
  ctx.fillStyle = rgba(shade([210, 210, 214], .9 * L)); ctx.fillRect(310, 662, 150, 9);
  // the table, its chairs, what is on it
  tableSet(t, q, lo, hi, L);
  // the fridge, with Sam's drawing held by a magnet
  const fx0 = 1560, fy0 = 250;
  ctx.fillStyle = rgba(shade(mix(hi, [235, 220, 200], .35), .95 * L)); rrect(fx0, fy0, 250, FY - fy0, 20); ctx.fill();
  ctx.fillStyle = rgba(shade(mix(lo, hi, .3), .6 * L)); ctx.fillRect(fx0, 500, 250, 8);
  ctx.fillStyle = rgba(shade(hi, .45 * L)); rrect(fx0 + 20, 300, 14, 150, 7); ctx.fill(); rrect(fx0 + 20, 540, 14, 180, 7); ctx.fill();
  ctx.fillStyle = rgba([255, 255, 255], .25 * L); ctx.fillRect(fx0 + 236, fy0 + 20, 6, FY - fy0 - 40);
  if (!(t > T_DROP && t < T_TAPE)) drawingOnFridge(t, fx0 + 70, 330, 1, L, t >= T_TAPE);
  else if (q.newOnly) crayonDrawing(fx0 + 162, 452, .95, L, true);
  else if (t >= T_DROP && t < T_DROP + .5) drawingFalling(t - T_DROP, fx0 + 70, 330, L);
  // the hole his fist leaves
  if (t >= T_PUNCH && !q.noHole) wallHole(t, HOLE[0], HOLE[1], L, hi);
  // the doorway to the hallway at the right edge
  ctx.fillStyle = rgba(shade(lo, .3 * L)); ctx.fillRect(1840, 230, 220, FY - 230);
  ctx.fillStyle = rgba(shade(hi, .9 * L)); ctx.fillRect(1826, 216, 16, FY - 216); ctx.fillRect(1826, 216, 260, 16);
  // the lamp: cord, shade, bulb
  ctx.strokeStyle = rgba([20, 14, 12]); ctx.lineWidth = 4; line(LAMP[0], CY, lx, ly - 40);
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(-lampSwing(t));
  ctx.fillStyle = rgba([26, 20, 18]); ctx.beginPath(); ctx.moveTo(-26, -46); ctx.lineTo(26, -46); ctx.lineTo(90, 14); ctx.lineTo(-90, 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(mix(lampC, [255, 236, 200], .4), .95); ctx.beginPath(); ctx.ellipse(0, 14, 90, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  additive(() => { glow(sprOf(mix(lampC, [255, 110, 40], .45)), lx, ly + 20, 520, .3 * L); glow(sprOf(mix(lampC, [255, 150, 70], .3)), lx, ly + 10, 120, .5 * L); });
}
function ovenClockSmall(t, cx, cy, h) {
  const lab = ovenTime(t);
  segTime(lab, cx, cy, h, [255, 150, 40], .95, .8);
}
// what the oven clock says, by film time
const OVEN = [[0, '7:02'], [18.1, '7:48'], [26.3, '8:31'], [34.0, '9:17'], [TURN, '7:30'], [85.2, '7:40'], [90, '7:41']];
const ovenTime = t => { let s = OVEN[0][1]; for (const x of OVEN) if (t >= x[0]) s = x[1]; return s; };
function tableSet(t, q, lo, hi, L) {
  const ty = 700, x0 = 960, x1 = 1420;
  // the chairs behind the table
  for (const cx of [1000, 1330]) {
    ctx.fillStyle = rgba(shade(mix(lo, hi, .3), .6 * L)); ctx.fillRect(cx - 8, 560, 16, 320); ctx.fillRect(cx - 50, 760, 100, 14);
  }
  ctx.fillStyle = rgba(shade(mix(lo, hi, .45), .8 * L)); ctx.fillRect(x0 + 20, ty + 14, 18, FY - ty - 14); ctx.fillRect(x1 - 38, ty + 14, 18, FY - ty - 14);
  ctx.fillStyle = rgba(shade(hi, 1.05 * L)); ctx.fillRect(x0, ty, x1 - x0, 16);
  ctx.fillStyle = rgba(shade(hi, 1.6 * L), .6); ctx.fillRect(x0, ty, x1 - x0, 3);
  // his phone (lit), Sam's paper and crayons, the juice
  const spilled = (t >= T_SPILL && t < TURN) || t >= T_SPILL2 && t < 94.8;
  phoneOnTable(t, 1110, ty, spilled);
  ctx.fillStyle = rgba([240, 236, 226], .9 * L); ctx.save(); ctx.translate(1290, ty - 2); ctx.rotate(-.05); ctx.fillRect(-46, -5, 92, 5); ctx.restore();
  for (const [dx, c] of [[-70, [230, 60, 50]], [-60, [60, 120, 230]], [-52, [250, 200, 40]]]) { ctx.fillStyle = rgba(c, L); ctx.fillRect(1290 + dx, ty - 5, 7, 5); }
  juice(t, 1200, ty, spilled, L);
}
function phoneOnTable(t, x, y, wet) {
  ctx.fillStyle = rgba([12, 12, 16]); ctx.fillRect(x - 38, y - 6, 76, 6);
  additive(() => glow(SPR.blue, x, y - 6, 60, wet ? .15 + .15 * (Math.sin(t * 40) > 0) : .25));
}
function juice(t, x, y, spilled, L) {
  const tipT = t >= T_SPILL2 ? T_SPILL2 : T_SPILL, u = clamp((t - tipT + .35) / .35);
  const ang = spilled || (t > tipT - .35 && t < tipT + 2) ? E.io(u) * 1.45 : 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-ang);
  ctx.fillStyle = rgba([255, 255, 255], .35); rrect(-16, -54, 32, 54, 5); ctx.fill();
  if (!spilled || u < 1) { ctx.fillStyle = rgba([255, 150, 30], .9 * L); rrect(-13, -40 * (1 - u * .8), 26, 38 * (1 - u * .8), 4); ctx.fill(); }
  ctx.restore();
  if (spilled) {                               // the puddle runs to his phone and over the edge
    const k = clamp((t - tipT) / .5);
    ctx.fillStyle = rgba([255, 150, 30], .85 * L);
    ctx.beginPath(); ctx.ellipse(x - 70 * k, y - 1, 110 * k + 10, 5, 0, 0, Math.PI * 2); ctx.fill();
    if (k > .6) for (let i = 0; i < 4; i++) { const dx = x - 160 + i * 24, d = ((t - tipT) * 300 + i * 90) % 180; ctx.beginPath(); ctx.arc(dx, y + 16 + d, 4, 0, Math.PI * 2); ctx.fill(); }
  }
}
// Sam's crayon drawing: two figures holding hands, a sun, "ME + MY BROTHER" (fresh: the new one, in boxing gloves)
function crayonDrawing(cx, cy, sc, a, openHands = false) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  ctx.fillStyle = rgba([246, 242, 232], a); ctx.fillRect(-60, -46, 120, 92);
  ctx.strokeStyle = rgba([180, 170, 150], .5 * a); ctx.lineWidth = 1; ctx.strokeRect(-60, -46, 120, 92);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = rgba([255, 200, 40], a); ctx.beginPath(); ctx.arc(40, -28, 9, 0, Math.PI * 2); ctx.fill();
  const fig = (x, h, col) => {
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, 20 - h, h * .22, 0, Math.PI * 2); ctx.stroke();
    line(x, 20 - h * .78, x, 20 - h * .3); line(x, 20 - h * .3, x - 6, 22); line(x, 20 - h * .3, x + 6, 22);
    ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(x - 3, 20 - h - 1, 1.6, 0, 7); ctx.arc(x + 3, 20 - h - 1, 1.6, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x, 20 - h + 2, h * .1, .2, Math.PI - .2); ctx.stroke();
  };
  fig(-22, 50, [40, 80, 200]); fig(14, 34, [220, 50, 40]);
  ctx.strokeStyle = rgba([40, 40, 40], a); ctx.lineWidth = 3;
  if (openHands) {                              // the new one: both of them with their hands open, palms out
    ctx.lineWidth = 2;
    for (const [x, y] of [[-36, -14], [-8, -14], [2, -2], [26, -2]]) for (let f = -2; f <= 2; f++) line(x, y, x + f * 2.4, y - 7);
    ctx.lineWidth = 3; line(-22, -14 + 4, -34, -10); line(-22, -10, -10, -10); line(14, 0, 4, 2); line(14, 0, 24, 2);
  } else line(-14, -6, 6, 2);                     // holding hands
  ctx.fillStyle = rgba([200, 40, 40], a); font(11, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ME + MY BROTHER', 0, 36);
  ctx.restore();
}
function drawingOnFridge(t, x, y, sc, L, both = false) {
  if (both) { crayonDrawing(x + 4, y + 2, .95 * sc, L); crayonDrawing(x + 92, y + 120, .95 * sc, L, true); }
  else crayonDrawing(x + 50, y + 40, sc, L);
  ctx.fillStyle = rgba([230, 60, 60], L); ctx.beginPath(); ctx.arc(both ? x + 4 : x + 50, both ? y - 42 : y - 4, 8, 0, 7); ctx.fill();
}
function drawingFalling(u, x, y, L) {          // it slides off the fridge and flutters down
  const k = E.io(clamp(u / .5));
  ctx.save(); ctx.translate(x + 50 - 40 * k, lerp(y + 40, FY - 6, k)); ctx.rotate(k * 1.4); ctx.scale(1, 1 - .7 * k); crayonDrawing(0, 0, 1, L); ctx.restore();
}
// the hole in the plaster: a dark ragged hole, cracks, dust falling for a while
function wallHole(t, x, y, L, hi) {
  const d = t - T_PUNCH, k = E.out(clamp(d / .12));
  if (t >= T_PATCH) {                            // patched: a pale square of fresh plaster, smoothed
    const u = E.out(inv(T_PATCH, T_PATCH + .8, t));
    ctx.fillStyle = rgba(shade(mix(hi, [250, 240, 225], .12), 1.0 * L)); ctx.beginPath(); ctx.ellipse(x, y, 66, 58, 0, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(10,6,6,${1 - u})`; ctx.beginPath(); ctx.ellipse(x, y, 36 * (1 - u), 30 * (1 - u), 0, 0, 7); ctx.fill();
    return;
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = rgba(shade(hi, 1.2 * L)); ctx.beginPath();
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 54 + 14 * rnd(i + 300); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba([10, 6, 6]); ctx.beginPath();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 34 + 12 * rnd(i + 310); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .85); }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba([20, 10, 8], .8); ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) { const a = rnd(i + 320) * Math.PI * 2, r1 = 50, r2 = 90 + 70 * rnd(i + 321); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a + .15) * (r1 + r2) / 2, Math.sin(a + .15) * (r1 + r2) / 2); ctx.lineTo(Math.cos(a - .05) * r2, Math.sin(a - .05) * r2); ctx.stroke(); }
  ctx.restore();
  if (d < 3) {                                   // plaster dust
    ctx.fillStyle = rgba([240, 220, 200], .6 * (1 - d / 3));
    for (let i = 0; i < 40; i++) { const vx = (rnd(i + 330) - .5) * 300, vy = -rnd(i + 331) * 200, dd = Math.min(d, 2.5); ctx.beginPath(); ctx.arc(x + vx * dd * .6, y + vy * dd + 260 * dd * dd, 2 + 3 * rnd(i + 332), 0, 7); ctx.fill(); }
  }
}

// ---------- the hallway: Sam's door with his sign, the hall mirror, a sconce, picture frames ----------
const HALL = { door: [900, 300, 230, 580], mirror: [1250, 330, 230, 330], sconce: [700, 330] };
function hallSet(t, q) {
  const k = q.heat, calm = !!q.calm, L = (q.flick ? .75 + .25 * Math.abs(Math.sin(t * 27) * Math.sin(t * 5.3)) : 1) * (q.light ?? 1);
  const hi = roomCol(k, 1, calm), lo = roomCol(k, 0, calm), lampC = calm ? [255, 214, 160] : mix(EMBER.lamp, EMBER.lampHot, k);
  const [sx, sy] = HALL.sconce;
  const g = ctx.createRadialGradient(sx, sy, 40, sx, sy, 1400);
  g.addColorStop(0, rgba(shade(hi, 1.05 * L))); g.addColorStop(.5, rgba(shade(mix(hi, lo, .6), L))); g.addColorStop(1, rgba(shade(lo, .7 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  ctx.fillStyle = rgba(shade(lo, .5 * L)); ctx.fillRect(-W, -H, 3 * W, H + CY); ctx.fillStyle = rgba(shade(hi, .8 * L)); ctx.fillRect(-W, CY, 3 * W, 6);
  // the wainscot: a darker lower panel with a rail
  ctx.fillStyle = rgba(shade(mix(lo, hi, .4), .75 * L)); ctx.fillRect(-W, 640, 3 * W, FY - 640);
  ctx.fillStyle = rgba(shade(hi, 1.1 * L)); ctx.fillRect(-W, 632, 3 * W, 10);
  const fg = ctx.createLinearGradient(0, FY, 0, FY + 300); fg.addColorStop(0, rgba(shade(mix(lo, hi, .3), .7 * L))); fg.addColorStop(1, rgba(shade(lo, .3 * L)));
  ctx.fillStyle = fg; ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.fillStyle = rgba(shade([120, 30, 24], .8 * L)); ctx.fillRect(-W, FY + 30, 3 * W, 70);          // the runner rug
  ctx.fillStyle = rgba(shade(hi, .7 * L)); ctx.fillRect(-W, FY - 14, 3 * W, 14);
  // picture frames (a family: shapes only)
  for (const [x, y, w, h] of [[250, 330, 150, 110], [430, 300, 110, 150]]) {
    ctx.fillStyle = rgba(shade([60, 36, 24], L)); ctx.fillRect(x - 8, y - 8, w + 16, h + 16);
    ctx.fillStyle = rgba(shade(mix(hi, [200, 190, 170], .5), .8 * L)); ctx.fillRect(x, y, w, h);
    ctx.fillStyle = rgba(shade([40, 30, 30], L)); for (const [u, r] of [[.3, .17], [.55, .2], [.78, .12]]) { ctx.beginPath(); ctx.arc(x + u * w, y + h * .5, r * h * .6, 0, 7); ctx.fill(); ctx.fillRect(x + u * w - r * h * .5, y + h * .5, r * h, h * .5); }
  }
  // the sconce
  ctx.fillStyle = rgba([30, 22, 18]); rrect(sx - 22, sy - 10, 44, 40, 8); ctx.fill();
  ctx.fillStyle = rgba(lampC, .9); ctx.beginPath(); ctx.moveTo(sx - 34, sy - 10); ctx.lineTo(sx + 34, sy - 10); ctx.lineTo(sx + 22, sy - 60); ctx.lineTo(sx - 22, sy - 60); ctx.closePath(); ctx.fill();
  additive(() => { glow(sprOf(lampC), sx, sy - 30, 600, .45 * L); glow(SPR.lamp, sx, sy - 34, 110, .6 * L); });
  // Sam's door (or the empty frame and his room beyond it)
  const [dx, dy, dw, dh] = HALL.door;
  ctx.fillStyle = rgba(shade(hi, 1.0 * L)); ctx.fillRect(dx - 22, dy - 22, dw + 44, dh + 22);
  ctx.fillStyle = rgba([14, 16, 30]); ctx.fillRect(dx, dy, dw, dh);
  additive(() => glow(SPR.star, dx + dw * .3, dy + dh * .8, 200, .35));      // his night-light, inside
  hallDoor(t, q, dx, dy, dw, dh, hi, lo, L);
  // the mirror (whole, or cracked), and the dent his fist leaves in the wall beside it
  hallMirror(t, q, L, hi);
  if (t >= T_BLOW && t < TURN) {
    const d = t - T_BLOW, k = E.out(clamp(d / .1)), [x, y] = HALL_HOLE;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(14,6,6,.95)'; ctx.beginPath(); for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2, r = 26 + 10 * rnd(i + 340); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(20,8,6,.85)'; ctx.lineWidth = 3; for (let i = 0; i < 7; i++) { const a = rnd(i + 350) * Math.PI * 2, r2 = 60 + 60 * rnd(i + 351); line(Math.cos(a) * 28, Math.sin(a) * 28, Math.cos(a + .2) * r2, Math.sin(a + .2) * r2); }
    ctx.restore();
    if (d < 2) { ctx.fillStyle = `rgba(240,220,200,${.6 * (1 - d / 2)})`; for (let i = 0; i < 30; i++) { const vx = (rnd(i + 360) - .5) * 260, vy = -rnd(i + 361) * 180, dd = Math.min(d, 1.6); ctx.beginPath(); ctx.arc(x + vx * dd * .6, y + vy * dd + 300 * dd * dd, 2 + 3 * rnd(i + 362), 0, 7); ctx.fill(); } }
  }
}
function samSign(x, y, sc, a = 1) {            // his paper sign: SAM in crayon, a star
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.04); ctx.scale(sc, sc);
  ctx.fillStyle = rgba([248, 244, 232], a); ctx.fillRect(-56, -34, 112, 68);
  font(30, SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [['S', [230, 60, 50]], ['A', [60, 120, 230]], ['M', [40, 170, 80]]].forEach(([c, col], i) => { ctx.fillStyle = rgba(col, a); ctx.fillText(c, -26 + i * 24, -2); });
  ctx.fillStyle = rgba([250, 200, 40], a); starPath(40, -18, 9); ctx.fill();
  ctx.restore();
}
function starPath(x, y, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); }
// the door: shut, shaking with each blow; at the last blow its frame splits (the door holds); q.ajar: Sam opens it a crack
function hallDoor(t, q, dx, dy, dw, dh, hi, lo, L) {
  const shake = 0;
  const aj = q.ajar || 0, gap = 46 * aj;
  if (gap > 0) {                                 // the crack of the door: his room's night-light, and Sam's eye in it
    ctx.fillStyle = rgba([24, 26, 46]); ctx.fillRect(dx, dy, gap + 4, dh);
    additive(() => glow(SPR.star, dx + gap / 2, dy + dh * .62, 120, .35 * aj));
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, gap, dh); ctx.clip();
    const sx = dx + 30, sy = dy + dh - 248;
    ctx.fillStyle = rgba([16, 15, 24]); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, 7); ctx.fill();
    ctx.fillStyle = rgba([238, 230, 214], .95); ctx.beginPath(); ctx.ellipse(sx - 14, sy - 4, 9, 7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba([14, 11, 13]); ctx.beginPath(); ctx.arc(sx - 16, sy - 3, 4, 0, 7); ctx.fill();
    ctx.restore();
  }
  ctx.save(); ctx.translate(shake + gap, 0); ctx.beginPath(); ctx.rect(dx - 10, dy - 10, dw + 20, dh + 20); ctx.clip();
  ctx.translate(dx + dw, 0); ctx.scale(1 - gap / dw, 1); ctx.translate(-(dx + dw), 0);
  ctx.fillStyle = rgba(shade(mix(lo, hi, .75), .95 * L)); ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = rgba(shade(hi, 1.3 * L), .6); ctx.lineWidth = 4; ctx.strokeRect(dx + 26, dy + 30, dw - 52, dh * .4); ctx.strokeRect(dx + 26, dy + dh * .5, dw - 52, dh * .42);
  ctx.fillStyle = rgba([230, 200, 140], L); ctx.beginPath(); ctx.arc(dx + 30, dy + dh * .52, 10, 0, 7); ctx.fill();
  samSign(dx + dw / 2, dy + 110, 1, L);
  ctx.restore();
}
// the hall mirror: whole (him in it, small) or cracked from where the door hit it
const CRACK0 = [1262, 500];
function hallMirror(t, q, L, hi) {
  const [mx, my, mw, mh] = HALL.mirror;
  ctx.fillStyle = rgba(shade([70, 44, 30], L)); rrect(mx - 14, my - 14, mw + 28, mh + 28, 10); ctx.fill();
  const g = ctx.createLinearGradient(mx, my, mx + mw, my + mh); g.addColorStop(0, rgba(shade(mix(hi, [170, 170, 180], .5), .7 * L))); g.addColorStop(1, rgba(shade(mix(hi, [80, 80, 96], .5), .5 * L)));
  ctx.fillStyle = g; ctx.fillRect(mx, my, mw, mh);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(mx + 30, my); ctx.lineTo(mx + 90, my); ctx.lineTo(mx + 20, my + mh); ctx.lineTo(mx - 40 + 30, my + mh); ctx.closePath(); ctx.fill();
  if (t >= (q.crackAt ?? 1e9)) crackLines(CRACK0[0], CRACK0[1], [mx, my, mw, mh], clamp((t - q.crackAt) / .12), 1);
}
// cracks radiating from (cx, cy) inside box b
function crackLines(cx, cy, b, k, a, sc = 1) {
  ctx.save(); ctx.beginPath(); ctx.rect(b[0], b[1], b[2], b[3]); ctx.clip();
  ctx.strokeStyle = `rgba(255,255,255,${.75 * a})`; ctx.lineWidth = 2.2 * sc; ctx.lineCap = 'round';
  for (let i = 0; i < 11; i++) {
    const a0 = i / 11 * Math.PI * 2 + rnd(i + 500) * .4; let x = cx, y = cy;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let j = 1; j <= 5; j++) { const r = j * 70 * sc * k * (.8 + .4 * rnd(i * 7 + j)); const aa = a0 + (rnd(i * 13 + j) - .5) * .35; x = cx + Math.cos(aa) * r; y = cy + Math.sin(aa) * r; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(255,255,255,${.5 * a})`; ctx.lineWidth = 1.6 * sc;
  for (const r of [26, 64, 120]) { ctx.beginPath(); for (let i = 0; i <= 11; i++) { const aa = i / 11 * Math.PI * 2 + rnd(i + 500) * .4, rr = r * sc * k * (.85 + .3 * rnd(i + r)); ctx.lineTo(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr); } ctx.stroke(); }
  ctx.restore();
}

// ---------- Sam's room: a small corner, cool moonlight, his star night-light, toys ----------
const ROOM_S = { corner: 1840, nl: [880, 860] };
function samRoomSet(t, q) {
  const L = q.light ?? 1, door = q.doorLight ?? 1, heat = q.heat ?? 1;
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, rgba(shade([60, 70, 112], .85 * L))); g.addColorStop(1, rgba(shade([44, 52, 90], .7 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  ctx.fillStyle = rgba(shade([34, 40, 72], .9 * L)); ctx.fillRect(ROOM_S.corner, -H, 2 * W, H + FY);          // the side wall, darker
  ctx.strokeStyle = rgba([120, 140, 200], .35); ctx.lineWidth = 3; line(ROOM_S.corner, -H, ROOM_S.corner, FY);
  ctx.fillStyle = rgba(shade([40, 46, 78], .8 * L)); ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.fillStyle = rgba(shade([90, 100, 150], .8 * L)); ctx.fillRect(-W, FY - 12, 3 * W, 12);
  ctx.fillStyle = rgba([255, 240, 170], .6 * L); for (let i = 0; i < 9; i++) { starPath(150 + rnd(i + 600) * 980, 120 + rnd(i + 601) * 380, 9 + 6 * rnd(i + 602)); ctx.fill(); }   // glow stars
  // the door on the left: shut (ember light at its edges, shaking with each blow) or open, the hall's light falling in
  if (q.shut) {
    const shake = 0;
    const hc = mix([255, 150, 70], [255, 80, 40], heat), aj = q.ajar || 0;
    ctx.fillStyle = rgba(hc, .9); ctx.fillRect(-60 + shake, FY - 6, 260, 6); ctx.fillRect(184 + shake, 220, 6 + 30 * aj, FY - 220);
    additive(() => glow(sprOf(hc), 180, FY - 10, 160, .4));
    ctx.fillStyle = rgba(shade([60, 68, 110], .9 * L)); ctx.fillRect(-60 + shake, 220, 244, FY - 226);
    ctx.strokeStyle = rgba([150, 160, 220], .35); ctx.lineWidth = 3; ctx.strokeRect(-36 + shake, 250, 196, 260); ctx.strokeRect(-36 + shake, 540, 196, 300);
    ctx.fillStyle = rgba([220, 200, 150]); ctx.beginPath(); ctx.arc(160 + shake, 560, 9, 0, 7); ctx.fill();
  } else if (door > 0) {
    const hc = mix([255, 150, 70], [255, 80, 40], heat);
    ctx.fillStyle = rgba(hc, .5 * door); ctx.fillRect(-40, 220, 230, FY - 220);
    ctx.fillStyle = rgba(hc, .14 * door); ctx.beginPath(); ctx.moveTo(190, FY); ctx.lineTo(-40, FY); ctx.lineTo(300, FY + 220); ctx.lineTo(900, FY + 220); ctx.closePath(); ctx.fill();
    additive(() => glow(sprOf(hc), 80, 560, 600, .35 * door));
  }
  // his bed along the back wall, a dinosaur on the pillow
  ctx.fillStyle = rgba(shade([70, 80, 130], .9 * L)); ctx.fillRect(1160, 620, 30, FY - 620); ctx.fillRect(1700, 560, 40, FY - 560);
  ctx.fillStyle = rgba(shade([110, 120, 180], .9 * L)); ctx.fillRect(1160, 700, 580, 70);
  ctx.fillStyle = rgba(shade([150, 120, 190], .85 * L)); ctx.fillRect(1190, 690, 470, 30);
  ctx.fillStyle = rgba(shade([210, 210, 240], .8 * L)); rrect(1560, 650, 120, 44, 18); ctx.fill();
  ctx.fillStyle = rgba(shade([90, 170, 110], .9 * L)); rrect(1590, 616, 60, 36, 14); ctx.fill(); ctx.beginPath(); ctx.arc(1648, 612, 16, 0, 7); ctx.fill();
  ctx.fillStyle = rgba(shade([60, 66, 110], .9 * L)); ctx.fillRect(1160, 770, 580, FY - 770);
  // a toy box and a ball
  ctx.fillStyle = rgba(shade([110, 60, 50], .9 * L)); ctx.fillRect(340, 760, 200, 120);
  ctx.fillStyle = rgba(shade([200, 120, 90], .9 * L)); ctx.fillRect(340, 752, 200, 12);
  ctx.fillStyle = rgba(shade([220, 70, 60], L)); ctx.beginPath(); ctx.arc(560, 720, 34, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba([255, 230, 200], .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(560, 720, 34, -2, -.4); ctx.stroke();
  // the star night-light on the floor
  const [nx, ny] = ROOM_S.nl;
  ctx.fillStyle = rgba([255, 236, 170]); starPath(nx, ny - 26, 24); ctx.fill();
  ctx.fillStyle = rgba([60, 60, 80]); ctx.fillRect(nx - 14, ny - 6, 28, 8);
  additive(() => { glow(SPR.star, nx, ny - 26, 380, .7); glow(SPR.star, nx, ny - 26, 70, .9); });
}
// ===== RAGE, part C: the film's own shots =====

// ---------- the clocks: the oven's amber LED (the night), the boxing gym's red timer (the mornings) ----------
// p: '7:02 PM' or { label, gym: true }
defShot('led', (t, p, L) => {
  const label = typeof p === 'string' ? p : p.label, gym = typeof p === 'object' && p.gym, [hm, ap] = label.split(' ');
  const col = gym ? [255, 48, 40] : t >= TURN ? [255, 176, 70] : mix([255, 150, 40], [255, 70, 30], heatAt(t));
  fill(gym ? [12, 14, 20] : [10, 6, 5], gym ? [30, 36, 48] : [30, 14, 8]);
  screen();
  if (!gym) {                                   // the oven's black glass panel, a pot's steam drifting over it
    const g = ctx.createLinearGradient(0, 300, 0, 780); g.addColorStop(0, '#120c0b'); g.addColorStop(1, '#070505');
    ctx.fillStyle = g; rrect(160, 300, 1600, 480, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,170,110,.18)'; ctx.lineWidth = 4; rrect(160, 300, 1600, 480, 40); ctx.stroke();
    for (const x of [330, 1590]) { ctx.fillStyle = '#1d1716'; ctx.beginPath(); ctx.arc(x, 540, 70, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,190,140,.25)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(255,200,150,.4)'; ctx.fillRect(x - 4, 476, 8, 40); }
  } else {                                      // the gym's timer box on a brick wall
    ctx.fillStyle = '#2a2f3a'; for (let r = 0; r < 18; r++) for (let c = -1; c < 14; c++) { ctx.fillStyle = (r + c) % 3 ? '#262b35' : '#2c323e'; ctx.fillRect(c * 150 + (r % 2) * 75, r * 64, 144, 58); }
    ctx.fillStyle = '#0b0b0e'; rrect(300, 290, 1320, 500, 30); ctx.fill();
    ctx.strokeStyle = 'rgba(200,210,230,.25)'; ctx.lineWidth = 5; rrect(300, 290, 1320, 500, 30); ctx.stroke();
    font(34, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,60,50,.8)';
    ctx.fillText('R O U N D  1', W / 2, 345);
  }
  additive(() => glow(sprOf(col), W / 2, 545, 760, .22));
  const day = typeof p === 'object' && p.day;
  if (day) spaced(day, W / 2, gym ? 210 : 220, 60, gym ? [230, 236, 246] : [255, 220, 180], inv(0, .25, L), 18, '300');
  const pop = 1 + .06 * (1 - E.out(clamp(L / .2)));
  ctx.save(); ctx.translate(W / 2, 545); ctx.scale(pop, pop); ctx.translate(-W / 2, -545);
  const w = segTime(hm, W / 2 - 70, 545, 300, col, 1);
  font(54, SANS, '800'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(col, .95);
  ctx.shadowColor = rgba(col, .8); ctx.shadowBlur = 20; ctx.fillText(ap || '', W / 2 - 70 + w / 2 + 40, 640); ctx.shadowBlur = 0;
  ctx.restore();
  if (!gym) {                                   // steam drifting across the glass
    additive(() => { for (let i = 0; i < 9; i++) { const k = ((t * .25 + rnd(i + 700)) % 1); glow(SPR.grey, 300 + rnd(i + 701) * 1300 + Math.sin(t + i) * 40, 820 - k * 700, 160, .08 * Math.sin(Math.PI * k)); } });
  }
}, () => [520, 170, 1440, 760]);

// ---------- the devil in this film's sets ----------
// d: { at: [x, feetY, s] (its feet on the floor at feetY), o: {...} }; it stands behind him, its red light on the wall
function devilAt(d) { const [x, fy, s] = d.at; placeDevil([x, fy + 200 * s, s]); return devilO(Object.assign({ a: 1, eyes: 1 }, d.o)); }
function drawDevilBehind(t, fr, d) { const o = devilAt(d); if (o.a > 0) drawDevil(t, fr, o); return o; }
function devilFront(t, o) { if (o.a > 0) devilArms(t, o); if (o.eyes > 0) devilEyes(t, o); if (o.a > 0) devilGrin(t, o); }
const redWash = (a) => { screen(); ctx.fillStyle = rgba(C.red, a); ctx.fillRect(-W, -H, 3 * W, 3 * H); };

// ---------- the kitchen ----------
// p: fr, man(t, L) -> pose, ex (his expression, default exprAt), sam(t, L) -> pose, samEx, dev(t, L) -> { at, o },
// shadow (his flat shadow on the wall, before it steps off), flick, dark, shock [t0] (the red ring of his shout)
defShot('kitchen', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t), calm = t >= TURN;
  fill([20, 10, 8]);
  cam(...fr);
  kitchenSet(t, { heat, calm, flick: p.flick, dark: p.dark });
  const rim = calm ? [255, 214, 160] : mix([255, 196, 120], [255, 90, 50], heat), lamp = lampPos(t);
  const S = p.sam ? p.sam(t, L) : null, M = p.man ? p.man(t, L) : null;
  if (M && p.shadow) wallShadow(M, lamp[0], typeof p.shadow === 'function' ? p.shadow(t, L) : p.shadow);
  if (p.chair) {                                 // the stool Sam stands on
    const cx = p.chairX ?? (S ? S.hip[0] : 500);
    ctx.fillStyle = rgba(shade(mix(roomCol(heat, 0, calm), roomCol(heat, 1, calm), .5), .9)); ctx.fillRect(cx - 60, 760, 120, 16);
    ctx.fillRect(cx - 50, 776, 14, FY - 776); ctx.fillRect(cx + 36, 776, 14, FY - 776);
    ctx.fillStyle = 'rgba(255,230,190,.5)'; ctx.fillRect(cx - 60, 760, 120, 3);
  }
  if (S) { wallShadow(S, lamp[0], .55); drawFig(S, typeof p.samEx === 'function' ? p.samEx(t, L) : EXPR[p.samEx || 'smile'], rim, .5, rim, { lx: (lamp[0] - S.head[0]) / 400 }); }
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), rim, .55, rim, { lx: (lamp[0] - M.head[0]) / 400 });
  if (p.pot) potInHands(t, M, p.pot);
  if (p.bag !== undefined) {                     // his work bag: in his hand, then dropped on the counter
    const k = E.io(inv(p.bag - .3, p.bag, t)), bx = lerp(M.hand[0], 700, k), by = lerp(M.hand[1] + 40, 572, k);
    ctx.fillStyle = '#1c1a20'; rrect(bx - 50, by - 34, 100, 66, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,150,.5)'; ctx.lineWidth = 3; rrect(bx - 50, by - 34, 100, 66, 10); ctx.stroke();
    ctx.strokeStyle = '#1c1a20'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(bx - 26, by - 34); ctx.quadraticCurveTo(bx, by - 64, bx + 26, by - 34); ctx.stroke();
  }
  if (p.towel !== undefined) {                   // he throws Sam a towel: it flies in an arc and lands on the spill
    const k = clamp((t - p.towel) / .55), x = lerp(M ? M.hand[0] : 990, 1190, k), y = lerp(M ? M.hand[1] : 560, 690, k) - Math.sin(Math.PI * k) * 160;
    if (t >= p.towel - .4) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 3) * .6); const fl = 1 - .6 * k; ctx.fillStyle = 'rgb(240,240,248)'; ctx.beginPath(); ctx.moveTo(-60, -34 * fl); ctx.quadraticCurveTo(0, -50 * fl, 60, -30 * fl); ctx.lineTo(56, 30 * fl + 6); ctx.quadraticCurveTo(0, 44 * fl + 6, -58, 28 * fl + 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(70,110,220,.85)'; ctx.fillRect(-58, -6, 116, 9); ctx.fillRect(-58, 10, 116, 4); ctx.restore(); }
  }
  if (o) devilFront(t, o);
  if (p.shock !== undefined && M) shockRing(t, p.shock, M.head);
  screen();
  if (o && o.a > .3) { ctx.fillStyle = rgba(C.red, .08 * o.a * (.6 + .4 * Math.sin(t * 5))); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540], M = p.man ? p.man(t, L) : null, S = p.sam ? p.sam(t, L) : null;
  let b = M ? poseBox(M, 40) : [600, 300, 1300, 900];
  if (S) b = unionBox(b, poseBox(S, 30));
  return toScreenBox(fr, b);
});
// the pot: in his hands, then slammed into the sink. how: { at (the slam), from [x, y] }
function potInHands(t, M, how) {
  const k = clamp((t - how.at + .25) / .25), sinkP = [765, 600];
  let x, y, r;
  if (t < how.at) { [x, y] = M.hand; r = -.2 * k; } else { const d = t - how.at; x = sinkP[0]; y = sinkP[1] + Math.min(d, .05) * 120; r = -.35; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(r);
  ctx.fillStyle = '#2a2a30'; rrect(-60, -10, 120, 66, 10); ctx.fill();
  ctx.fillStyle = '#4a4a54'; ctx.fillRect(-66, -14, 132, 10);
  ctx.strokeStyle = 'rgba(255,200,150,.5)'; ctx.lineWidth = 3; rrect(-60, -10, 120, 66, 10); ctx.stroke();
  ctx.fillStyle = '#1a1a1e'; ctx.fillRect(56, -6, 70, 12);
  ctx.restore();
  if (t >= how.at && t < how.at + 1.6) {        // the crash: water and steam burst out of the sink
    const d = t - how.at;
    additive(() => { for (let i = 0; i < 14; i++) glow(SPR.grey, sinkP[0] + (rnd(i + 800) - .5) * 260 * (d + .2), sinkP[1] - 40 - d * 220 * rnd(i + 801), 70 + 60 * d, .28 * (1 - d / 1.6)); });
    ctx.fillStyle = `rgba(200,220,255,${.8 * (1 - d / .6)})`;
    for (let i = 0; i < 18; i++) { const vx = (rnd(i + 810) - .5) * 700, vy = -300 - rnd(i + 811) * 500, dd = Math.min(d, .6); ctx.beginPath(); ctx.arc(sinkP[0] + vx * dd, sinkP[1] - 10 + vy * dd + 1400 * dd * dd, 4 + 3 * rnd(i), 0, 7); ctx.fill(); }
  }
}
// the red ring of a shout, out of his mouth
function shockRing(t, t0, head) {
  const d = t - t0;
  if (d < 0 || d > .9) return;
  const [x, y, r] = head;
  for (let i = 0; i < 3; i++) {
    const dd = d - i * .12; if (dd < 0) continue;
    ctx.strokeStyle = rgba([255, 70, 40], .75 * (1 - dd / .75)); ctx.lineWidth = 10 * (1 - dd / .75) + 2;
    ctx.beginPath(); ctx.arc(x + 40, y + 12, r * .6 + dd * 900, -.9, .9); ctx.stroke();
  }
}
// ===== RAGE, part D: close-ups (his fist, Sam's face, its face), the hallway, Sam's room, the cracked mirror =====

// ---------- new looks and expressions ----------
LOOKS.ember = { bg: [[86, 36, 18], [150, 72, 34]], fill: [10, 6, 6], light: [255, 180, 110], la: .38, lc: [.55, -.3], glow: 'ember', gl: [1500, 200], ga: .55, rim: [255, 170, 100], turn: .85 };
LOOKS.hot = { bg: [[70, 12, 8], [140, 30, 16]], fill: [10, 4, 4], light: [255, 110, 70], la: .4, lc: [.5, -.2], glow: 'hot', gl: [1500, 260], ga: .6, rim: [255, 100, 60], turn: .85 };
LOOKS.gymdawn = { bg: [[48, 58, 78], [120, 110, 100]], fill: [12, 12, 16], light: [255, 214, 160], la: .4, lc: [.7, -.5], glow: 'dawn', gl: [1700, 120], ga: .6, rim: [255, 214, 160], turn: .85 };
LOOKS.warm = { bg: [[120, 86, 56], [190, 150, 104]], fill: [16, 12, 10], light: [255, 220, 170], la: .42, lc: [.5, -.4], glow: 'lamp', gl: [1500, 160], ga: .5, rim: [255, 214, 160], turn: .85 };
LOOKS.moon = { bg: [[30, 36, 70], [60, 70, 116]], fill: [10, 10, 16], light: [255, 236, 170], la: .34, lc: [.6, .6], glow: 'star', gl: [1500, 1000], ga: .45, rim: [190, 200, 255], turn: .85 };
EXPR.flinch = { lid: 1, brow: .95, browH: .1, smile: -.7, open: .18, grit: .6, gx: 0, gy: 0, tear: .7, sweat: 0 };
EXPR.startle = { lid: 0, brow: .8, browH: .22, smile: -.2, open: .4, grit: 0, gx: -.5, gy: 0, tear: 0, sweat: 0 };
EXPR.look = { lid: .1, brow: .7, browH: .12, smile: -.25, open: .05, grit: 0, gx: -.6, gy: -.4, tear: .5, sweat: 0 };
EXPR.laugh = { lid: .55, brow: .3, browH: .08, smile: 1, open: .45, grit: 0, gx: .3, gy: 0, tear: 0, sweat: 0 };
EXPR.frozen = { lid: 0, brow: .85, browH: .2, smile: -.45, open: .2, grit: 0, gx: -.5, gy: .1, tear: .8, sweat: 0 };
EXPR.shout = { lid: .15, brow: -1, browH: -.12, smile: -.75, open: 1, grit: .9, gx: .3, gy: 0, tear: 0, sweat: .5 };

// ---------- his fist, close: p { claws (0 … 1 its fingers closed round it), open (0 fist … 1 open hand), shake, cold (the
// cold open: its shadow on the wall, the eyes opening), eyesAt, clawsIn [a, b], pry [a, b] (its claws pushed off), look }
function clawFinger(pts, w, a) {             // one of its long fingers, ending in a hooked claw, in the silhouette's three coats
  const outl = stripPts(pts, pts.map((_, i) => w * (1 - .45 * i / (pts.length - 1))));
  const last = pts[pts.length - 1], prev = pts[pts.length - 2], ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]) + .6;
  const claw = [[last[0] - Math.sin(ang) * w * .5, last[1] + Math.cos(ang) * w * .5], [last[0] + Math.cos(ang) * w * 2.6, last[1] + Math.sin(ang) * w * 2.6], [last[0] + Math.sin(ang) * w * .5, last[1] - Math.cos(ang) * w * .5]];
  ctx.save(); ctx.globalAlpha = a; ctx.lineJoin = 'round';
  for (const [col, k] of [[[255, 58, 40], 9], [[100, 10, 12], 3.5], [[9, 4, 6], 0]]) {
    ctx.fillStyle = ctx.strokeStyle = rgba(col);
    for (const poly of [outl, claw]) { ctx.beginPath(); poly.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); if (k) { ctx.lineWidth = 2 * k; ctx.stroke(); } ctx.fill(); }
  }
  ctx.restore();
}
function bigFist(t, x, y, sc, open, rim, la) {  // his hand, big: a fist or (open) the fingers spread
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const dark = [10, 7, 7], lit = mix(dark, rim, .45);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(rim, .8 * la); ctx.lineWidth = 168; line(-900, 330, -40, 60);            // the forearm's rim
  ctx.strokeStyle = rgba(dark); ctx.lineWidth = 150; line(-900, 330, -40, 60);
  ctx.save(); ctx.shadowColor = rgba(rim, .9 * la); ctx.shadowBlur = 40 * VP.k;
  ctx.fillStyle = rgba(dark); rrect(-130, -110, 250, 230, 70); ctx.fill(); ctx.restore();          // the palm
  ctx.strokeStyle = rgba(rim, .55 * la); ctx.lineWidth = 6; rrect(-130, -110, 250, 230, 70); ctx.stroke();
  for (let i = 0; i < 4; i++) {                 // the fingers: curled knuckles … straight
    const bx = -95 + i * 58, by = -100, len = lerp(22, 190 - Math.abs(i - 1.3) * 26, open), ang = -Math.PI / 2 + lerp(.05, (i - 1.5) * .2, open);
    const tx = bx + Math.cos(ang) * len, ty = by + Math.sin(ang) * len;
    ctx.strokeStyle = rgba(rim, .7 * la); ctx.lineWidth = 62; line(bx, by, tx, ty);
    ctx.strokeStyle = rgba(dark); ctx.lineWidth = 54; line(bx, by, tx, ty);
    ctx.strokeStyle = rgba(lit, .8 * la); ctx.lineWidth = 6; line(bx - 18, by + 8, tx - 18, ty + 8);
  }
  const ta = lerp(.9, -.2, open), tl = lerp(150, 170, open);   // the thumb: across the front … out to the side
  ctx.strokeStyle = rgba(rim, .7 * la); ctx.lineWidth = 64; line(-120, 40, -120 + Math.cos(ta) * tl, 40 - Math.sin(ta) * tl * .5 - 60 * open);
  ctx.strokeStyle = rgba(dark); ctx.lineWidth = 56; line(-120, 40, -120 + Math.cos(ta) * tl, 40 - Math.sin(ta) * tl * .5 - 60 * open);
  if (open < .3) { ctx.strokeStyle = rgba(lit, .7 * la); ctx.lineWidth = 5; for (let i = 0; i < 3; i++) line(-60 + i * 58, -70, -60 + i * 58, -20); }
  ctx.restore();
}
defShot('fist', (t, p, L) => {
  const lk = LOOKS[p.look || 'ember'], heat = heatAt(t);
  screen();
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, rgba(lk.bg[1])); g.addColorStop(1, rgba(lk.bg[0]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], lk.gl[0], lk.gl[1], 1100, lk.ga));
  const shake = p.shake ? (Math.sin(t * 61) * 5 + Math.sin(t * 37) * 4) * p.shake : 0;
  const open = typeof p.open === 'function' ? p.open(t, L) : p.open || 0;
  const fx = 820 + shake, fy = 600 + shake * .6;
  if (p.cold) {                                 // its shadow on the wall: the fist's shadow, and above it, eyes opening
    ctx.save(); ctx.globalAlpha = .55; ctx.translate(340, -120); ctx.scale(1.35, 1.35); ctx.translate(-340, 120);
    ctx.fillStyle = 'rgba(20,6,4,1)'; ctx.strokeStyle = 'rgba(20,6,4,1)'; ctx.lineCap = 'round'; ctx.lineWidth = 150;
    line(-500 + shake, 900, 760 + shake, 500); rrect(650 + shake, 380, 270, 240, 70); ctx.fill();
    ctx.restore();
    redEyes(640, 210, 40, win(t, p.eyesAt, 99, .25, 0));
  }
  bigFist(t, fx, fy, 1, open, lk.rim, 1);
  if (p.lines) {                                   // the cold line, typed over the fist (the cold open)
    const a = 1 - inv(p.out[0], p.out[1], t);
    screen(); ctx.fillStyle = `rgba(0,0,0,${.45 * a})`; ctx.fillRect(-W, 0, 3 * W, 300);
    if (!OUT.vertical) p.lines.forEach(([txt, a0, a1], i) => typeLine(txt, 120 + i * 84, 48, inv(a0, a1, t), [236, 226, 214], a, t));
    else { ui(); typeBlock(p.lines.map(([txt, a0, a1]) => [txt, inv(a0, a1, t)]), 560, 64, [236, 226, 214], a, t, OUT.w / 2, 860); }
  }
  // its long fingers close over his knuckles … or are pried off
  const clawK = p.clawsIn ? E.out(inv(p.clawsIn[0], p.clawsIn[1], t)) : (p.claws ?? 0);
  const pry = p.pry ? E.io(inv(p.pry[0], p.pry[1], t)) : 0;
  if (clawK > .01) {
    const ox = pry * 260 + (1 - clawK) * 120, oy = -pry * 420 - (1 - clawK) * 160, a = Math.min(1, clawK * 1.6) * (1 - .8 * pry);
    const P = [fx + 330 + ox, fy - 290 + oy];                       // the back of its hand, its arm going off to the right
    ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
    for (const [col, k] of [[[255, 58, 40], 16], [[100, 10, 12], 7], [[9, 4, 6], 0]]) {
      ctx.strokeStyle = ctx.fillStyle = rgba(col);
      ctx.lineWidth = 120 + 2 * k; line(P[0] + 60, P[1] - 20, P[0] + 900, P[1] - 120);
      ctx.beginPath(); ctx.ellipse(P[0], P[1], 120 + k, 84 + k, -.7, 0, 7); ctx.fill();
    }
    ctx.restore();
    for (let i = 0; i < 4; i++) {
      const kx = fx - 95 + i * 58, ky = fy - 100, root = [P[0] - 110 + i * 34, P[1] + 30 + i * 22];
      const tip = [kx - 26, ky + 30 + clawK * 100];
      const pts = [root, [lerp(root[0], kx, .5) + 26, lerp(root[1], ky, .5) - 50], [kx + 6, ky - 36], tip];
      clawFinger(pts, 24 - i * 1.5, a);
    }
    additive(() => glow(SPR.red, P[0], P[1], 520, .35 * a));
  }
  if (p.cold || clawK > .01) redWash(.06 + .05 * heat);
}, () => [380, 160, 1300, 900]);

// ---------- Sam's face, close: p { look, ex, hands (0 … 1: his hands come up in front of his face) } ----------
const SAM_XY = t => [W / 2 + 40 + Math.sin(t * .9) * 5, H * .47, 230];
defShot('samface', (t, p, L) => {
  const lk = LOOKS[p.look || 'ember'], [x, y, r] = SAM_XY(t), ex = EXPR[p.ex || 'startle'];
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba(lk.bg[0])); g.addColorStop(1, rgba(lk.bg[1]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], lk.gl[0], lk.gl[1], 900, lk.ga));
  const jolt = p.jolt ? Math.max(0, 1 - (L - p.jolt) / .3) * (L > p.jolt ? 1 : 0) : 0;
  const yy = y - 26 * jolt;
  const fillC = [16, 15, 24];
  ctx.fillStyle = rgba(lk.rim, .5); ctx.beginPath(); ctx.arc(x + lk.lc[0] * 8, yy + lk.lc[1] * 8, r + 6, 0, 7); ctx.fill();
  ctx.fillStyle = rgba(fillC);
  ctx.beginPath(); ctx.ellipse(x - 10, yy + r * 1.95, r * 1.2, r * .85, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - r * .26, yy + r * .6, r * .46, r * .7);
  ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill();
  samTuft({ head: [x, yy, r], f: 1 }, fillC);
  face(x, yy, r, ex, { turn: .55, light: lk.light, la: lk.la, lc: lk.lc });
  if (p.crayon !== undefined) {                 // his small hand in front of him, a red crayon in it; it snaps in two
    const sn = t >= p.crayon, k = E.out(inv(p.crayon, p.crayon + .15, t)), hx = x + 70, hy = yy + r * 1.62 - 24 * k;
    ctx.save(); ctx.translate(hx, hy); ctx.scale(1.5, 1.5);
    for (const [sd, dx] of [[-1, -1], [1, 1]]) {
      ctx.save(); ctx.translate(sn ? dx * 22 * k : 0, sn ? -14 * k : 0); ctx.rotate(sn ? dx * .5 * k : 0);
      ctx.fillStyle = 'rgb(220,40,36)'; ctx.fillRect(sd < 0 ? -70 : 0, -11, 70, 22);
      if (sd < 0) { ctx.fillStyle = 'rgb(240,80,70)'; ctx.beginPath(); ctx.moveTo(-70, -11); ctx.lineTo(-92, 0); ctx.lineTo(-70, 11); ctx.fill(); }
      ctx.restore();
    }
    ctx.fillStyle = rgba(lk.rim, .55); ctx.beginPath(); ctx.arc(-6, 6, 44, 0, 7); ctx.fill();
    ctx.fillStyle = rgba(fillC); ctx.beginPath(); ctx.arc(-6, 6, 39, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 50; ctx.lineCap = 'round'; line(-6, 30, 60, 260);
    if (sn && t < p.crayon + .5) { ctx.fillStyle = `rgba(255,120,90,${1 - (t - p.crayon) / .5})`; for (let i = 0; i < 8; i++) { const a = rnd(i + 990) * 6.28, d = (t - p.crayon) * 300; ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d - 10, 5, 5); } }
    ctx.restore();
  }
  const hk = typeof p.hands === 'function' ? p.hands(t, L) : p.hands || 0;
  if (hk > .01) {                               // his small hands come up in front of his face
    for (const sd of [-1, 1]) {
      const hx = x + sd * r * 1.02, hy = lerp(yy + r * 2.4, yy + r * .05, E.out(hk));
      ctx.strokeStyle = rgba(lk.rim, .55); ctx.lineWidth = 66; ctx.lineCap = 'round'; line(hx + sd * 40, hy + 260, hx, hy + 40);
      ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 56; line(hx + sd * 40, hy + 260, hx, hy + 40);
      ctx.fillStyle = rgba(lk.rim, .55); rrect(hx - 44, hy - 56, 88, 120, 36); ctx.fill();
      ctx.fillStyle = rgba(fillC); rrect(hx - 39, hy - 51, 78, 110, 32); ctx.fill();
      ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 17;   // fingers spread
      for (let f = -1.5; f <= 1.5; f++) line(hx + f * 17, hy - 40, hx + f * 24, hy - 92);
      ctx.strokeStyle = rgba(lk.rim, .4); ctx.lineWidth = 3; for (let f = -1.5; f <= 1.5; f++) line(hx + f * 17 + 8, hy - 40, hx + f * 24 + 8, hy - 90);
    }
  }
}, t => { const [x, y, r] = SAM_XY(t); return [x - r * 1.4, y - r * 1.4, x + r * 1.4, y + r * 1.9]; });

// ---------- its face, close, in this film's light: p { at [x, feetY, s], o(t), look, scare, fade [a, b] } ----------
function dfaceFrame(t, p, L) {
  const d = { at: p.at || [700, FY, 1], o: p.o ? p.o(t, L) : { grin: 1 } }, o = devilAt(d), [hx, hy] = devilHead(t, o), s = DEVIL.s;
  return { o, fr: [(p.scare ? 2.15 : 1.5 + .12 * clamp(L / 3)) * DEVIL_FACE_ZOOM / s, hx, hy + (p.scare ? 4 : 16) * s] };
}
defShot('dface', (t, p, L) => {
  const lk = LOOKS[p.look || 'hot'];
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba(lk.bg[0])); g.addColorStop(1, rgba(lk.bg[1]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], 400, 160, 900, lk.ga * .8));
  const { o, fr } = dfaceFrame(t, p, L);
  if (p.fade) o.a = 1 - .75 * inv(p.fade[0], p.fade[1], t), o.eyes = Math.max(.3, o.eyes * (1 - .5 * inv(p.fade[0], p.fade[1], t)));
  cam(...fr);
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  redWash(.07 + .05 * Math.sin(t * 5) + (p.scare ? .55 * (1 - inv(0, .2, L)) : 0));
}, (t, p, L) => { const { o, fr } = dfaceFrame(t, p, L), b = devilBox(t, o); return toScreenBox(fr, [b[0], b[1] + 80 * DEVIL.s, b[2], b[3]]); });

// ---------- the stove: the pot boils over; his hand grabs the handle ----------
defShot('stove', (t, p, L) => {
  const heat = heatAt(t);
  fill([30, 14, 8]); cam(2.4, 400, 560);
  kitchenSet(t, { heat });
  const boil = .5 + .5 * Math.sin(t * 14);
  ctx.save(); ctx.translate(385, 600);
  ctx.fillStyle = '#2a2a30'; rrect(-80, -90, 160, 92, 12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,150,.6)'; ctx.lineWidth = 3; rrect(-80, -90, 160, 92, 12); ctx.stroke();
  ctx.fillStyle = '#4a4a54'; ctx.fillRect(-88, -96, 176, 12);
  ctx.fillStyle = '#1a1a1e'; ctx.fillRect(78, -80, 90, 14);
  ctx.fillStyle = rgba([250, 246, 236], .95);   // the foam boils over the rim and down the side
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-76 + i * 19, -98 - 8 * Math.abs(Math.sin(t * 9 + i)), 14 + 4 * boil, 0, 7); ctx.fill(); }
  const run = clamp(L / .9);
  for (const dx of [-70, 40]) { rrect(dx, -92, 22, 70 * run + 10, 10); ctx.fill(); }
  additive(() => { glow(SPR.hot, 0, 4, 140, .6); for (let i = 0; i < 8; i++) { const k = (t * .8 + rnd(i + 900)) % 1; glow(SPR.grey, (rnd(i + 901) - .5) * 160, -110 - k * 320, 70 + 50 * k, .3 * Math.sin(Math.PI * k)); } });
  ctx.restore();
  if (p.grab) {                                 // his hand comes in and grips the handle
    const k = E.out(inv(p.grab, p.grab + .25, t)), hx = lerp(700, 515, k), hy = 520;
    ctx.strokeStyle = 'rgba(255,170,100,.6)'; ctx.lineWidth = 50; ctx.lineCap = 'round'; line(hx + 400, hy + 200, hx, hy);
    ctx.strokeStyle = '#0a0707'; ctx.lineWidth = 42; line(hx + 400, hy + 200, hx, hy);
    ctx.fillStyle = '#0a0707'; ctx.beginPath(); ctx.arc(hx, hy, 30, 0, 7); ctx.fill();
  }
}, () => toScreenBox([2.4, 400, 560], [250, 380, 620, 640]));

// ---------- the table, close: the juice tips over his phone ----------
defShot('table', (t, p, L) => {
  const calm = t >= TURN;
  fill([30, 14, 8]); cam(2.3, 1150, 640);
  kitchenSet(t, { heat: heatAt(t), calm });
  if (p.hand) {                                 // Sam's small arm reaches for the glass, or his elbow knocks it
    const tip = t >= TURN ? T_SPILL2 : T_SPILL, k = E.io(inv(tip - .6, tip - .05, t)), back = E.io(inv(tip + .1, tip + .5, t)), hx = lerp(1330, 1222, k) + 70 * back, hy = 668 - 6 * Math.sin(Math.PI * k);
    const ex = 1420, ey = 676;                    // his forearm along the table top, from the right edge; a small hand
    ctx.strokeStyle = 'rgba(255,190,130,.5)'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1640, 664); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = '#100f18'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(1640, 664); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = '#100f18'; ctx.beginPath(); ctx.ellipse(hx - 4, hy, 15, 11, 0, 0, 7); ctx.fill();
  }
  if (p.leap !== undefined && t > p.leap - .05) {   // DAY 12: small now, it leaps up from under the table at him
    const k = E.out(inv(p.leap, p.leap + .45, t)), s2 = lerp(.18, .42, k);
    placeDevil([lerp(1180, 1110, k), lerp(980, 820, k) + 200 * s2, s2]);
    const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .4, reach: .6, targets: [[1060, 600 - 200 * k], [1200, 580 - 200 * k]] });
    drawDevil(t, [2.3, 1150, 640], o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
  }
}, () => toScreenBox([2.3, 1150, 640], [1000, 560, 1300, 720]));

// ---------- Sam's empty chair: the snapped crayon on his paper, the lamp's light still swinging over it ----------
defShot('chair', (t, p, L) => {
  const fr = [2.2, 1310, 640];
  fill([30, 14, 8]); cam(...fr);
  kitchenSet(t, { heat: heatAt(t) });
  for (const [dx, a] of [[-18, -.5], [16, .35]]) { ctx.save(); ctx.translate(1290 + dx, 696); ctx.rotate(a); ctx.fillStyle = 'rgb(220,40,36)'; ctx.fillRect(-14, -3, 28, 6); ctx.restore(); }
  const sw = Math.sin((t - T_SHOUT) * 5.2) * .5;                                     // the light sweeps back and forth
  additive(() => glow(SPR.lamp, 1310 + sw * 260, 690, 300, .35));
  screen(); const g = ctx.createLinearGradient(0, 0, W, 0); const c = clamp(.5 + sw * .5);
  g.addColorStop(0, `rgba(0,0,0,${.35 * c})`); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.35 * (1 - c)})`); ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
}, () => toScreenBox([2.2, 1310, 640], [1180, 520, 1440, 780]));
// ---------- the hole in the wall: dust still falling; in its dark, one of its eyes opens ----------
defShot('hole', (t, p, L) => {
  const fr = [3.6, HOLE[0], HOLE[1] + 10];
  fill([30, 14, 8]); cam(...fr);
  kitchenSet(t, { heat: heatAt(t) });
  const e = E.out(inv(p.eye, p.eye + .3, t)), fl = .85 + .15 * Math.sin(t * 23);
  if (e > .01) {
    additive(() => { glow(SPR.red, HOLE[0] + 6, HOLE[1] + 2, 60, .9 * e * fl); glow(SPR.amber, HOLE[0] + 6, HOLE[1] + 2, 16, .9 * e); });
    ctx.save(); ctx.translate(HOLE[0] - 12, HOLE[1] + 4); ctx.scale(.62, .62 * (.2 + .8 * e)); eyeShape(ctx, 1, e * fl); ctx.restore();
  }
}, () => toScreenBox([3.6, HOLE[0], HOLE[1] + 10], [HOLE[0] - 120, HOLE[1] - 110, HOLE[0] + 120, HOLE[1] + 110]));

// ---------- Sam's drawing on the floor in the dust ----------
defShot('drawing', (t, p, L) => {
  fill([40, 16, 10]); screen();
  const g = ctx.createRadialGradient(960, 500, 100, 960, 540, 1100); g.addColorStop(0, rgba(shade(roomCol(heatAt(t), 1), .8))); g.addColorStop(1, rgba(shade(roomCol(heatAt(t), 0), .5)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 4; for (let i = -6; i < 12; i++) line(i * 260, 0, i * 260 - 300, H);
  ctx.save(); ctx.translate(960, 560); ctx.rotate(-.12); crayonDrawing(0, 0, 6.4, 1); ctx.restore();
  ctx.fillStyle = 'rgba(235,215,195,.5)';          // plaster dust settling on it
  for (let i = 0; i < 70; i++) { const y = ((rnd(i + 950) * 1300 + L * (60 + 80 * rnd(i + 951))) % 1300) - 120; ctx.beginPath(); ctx.arc(rnd(i + 952) * W, y, 2 + 5 * rnd(i + 953), 0, 7); ctx.fill(); }
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(230,210,190,${.35 + .3 * rnd(i + 960)})`; ctx.beginPath(); ctx.arc(560 + rnd(i + 961) * 800, 260 + rnd(i + 962) * 560, 4 + 10 * rnd(i + 963), 0, 7); ctx.fill(); }
}, () => [560, 260, 1360, 860]);

// ---------- the hallway ----------
// p: fr, man(t, L), dev(t, L), blows [t…], ripAt, crackAt, door ('off'), calm, light
defShot('hall', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t), calm = t >= TURN;
  fill([20, 10, 8]); cam(...fr);
  hallSet(t, { heat, calm, flick: p.flick, crackAt: p.crackAt ?? (t >= T_CRACK && t < TURN ? T_CRACK : undefined), ajar: p.ajar ? p.ajar(t, L) : 0, light: p.light });
  const rim = calm ? [255, 214, 160] : mix([255, 196, 120], [255, 90, 50], heat);
  const M = p.man ? p.man(t, L) : null, S = p.sam ? p.sam(t, L) : null;
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  if (S) drawFig(S, EXPR[p.samEx || 'smile'], rim, .5, rim);
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), rim, .55, rim, { lx: -1, ly: -.6 });
  if (p.fix && M) heldDoor(t, M, p.fix);
  if (o) devilFront(t, o);
  if (o && p.through) {                            // its head has gone up through the ceiling: broken plaster over its horns
    const [hx, hy] = devilHead(t, o), s2 = DEVIL.s, cy = CY + 18 * s2, heat = heatAt(t), lo = roomCol(heat, 0, false), hi2 = roomCol(heat, 1, false);
    ctx.fillStyle = rgba(shade(lo, .55)); ctx.beginPath(); ctx.moveTo(-W, -H); ctx.lineTo(3 * W, -H); ctx.lineTo(3 * W, CY);
    ctx.lineTo(hx + 210 * s2, CY); for (let i = 0; i <= 16; i++) { const u = i / 16, x = hx + (1.6 - 3.2 * u) * 130 * s2, y = lerp(CY, cy, Math.sin(Math.PI * u) ** .5) + (rnd(i + 600) - .5) * 26; ctx.lineTo(x, y); }
    ctx.lineTo(-W, CY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(shade(hi2, .85)); ctx.fillRect(-W, CY, hx + 200 * s2 - 220 * s2 + W - 40 * s2, 6); ctx.fillRect(hx + 210 * s2, CY, 3 * W, 6);
    ctx.strokeStyle = 'rgba(250,224,200,.7)'; ctx.lineWidth = 4;
    for (let i = 0; i < 14; i++) { const sd = i % 2 ? 1 : -1, x0 = hx + sd * (110 + 70 * rnd(i + 610)) * s2, r = 60 + 90 * rnd(i + 620); line(x0, CY + 2, x0 + sd * r, CY - 30 - 40 * rnd(i + 630)); }
    ctx.fillStyle = 'rgba(230,200,180,.6)'; for (let i = 0; i < 20; i++) { const d = (t * .6 + rnd(i + 640)) % 1; ctx.fillRect(hx + (rnd(i + 650) - .5) * 360 * s2, CY + d * 700, 5, 5); }
  }
  if (o && p.gouge) for (const sd of [-1, 1]) {   // where its horns dig into the ceiling: cracked plaster
    const [hx, hy] = headPt(t, o, sd * 62, -126);
    if (hy < CY + 60) { const cy = CY + 4; ctx.fillStyle = 'rgba(20,6,4,.95)'; ctx.beginPath(); ctx.ellipse(hx, cy, 26, 10, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(250,220,200,.75)'; ctx.lineWidth = 4; for (let i = 0; i < 7; i++) { const a = Math.PI * (.05 + .9 * rnd(i + 470 + sd)), r = 40 + 60 * rnd(i + 480 + sd); line(hx, cy, hx + Math.cos(a) * r * sd, cy - Math.sin(a) * r * .6); }
      ctx.fillStyle = 'rgba(230,200,180,.5)'; for (let i = 0; i < 6; i++) { const d = (t * .7 + rnd(i + 490 + sd)) % 1; ctx.fillRect(hx + (rnd(i + 495) - .5) * 40, cy + d * 300, 4, 4); } }
  }
  if (o && o.a > .3) redWash(.08 * o.a);
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540], M = p.man ? p.man(t, L) : null;
  return toScreenBox(fr, M ? unionBox(poseBox(M, 40), [880, 300, 1150, 880]) : [700, 260, 1500, 900]);
});
// fixing the door: he holds it up in the frame while Sam (beside him) holds the screws
function heldDoor(t, M, fix) {
  const [dx, dy, dw, dh] = HALL.door, k = E.io(inv(fix[0], fix[1], t));
  ctx.save(); ctx.translate(dx + dw, dy + dh); ctx.rotate(.18 * (1 - k)); ctx.translate(-(dx + dw), -(dy + dh) - 20 * (1 - k));
  ctx.fillStyle = rgba([196, 150, 110]); ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = 'rgba(255,230,190,.6)'; ctx.lineWidth = 4; ctx.strokeRect(dx + 26, dy + 30, dw - 52, dh * .4); ctx.strokeRect(dx + 26, dy + dh * .5, dw - 52, dh * .42);
  samSign(dx + dw / 2, dy + 110, 1, 1);
  ctx.restore();
}

// ---------- Sam's room ----------
// p: fr, sam(t, L) pose, samEx, man(t, L), manShadow (his long shadow across the floor from the door), dev(t, L),
// horns [a, b] (horns grow on Sam's shadow), crumble [a, b], doorLight
const SAM_AT = [1060, FY, 1.05];
function samShadow(t, P, p, a = .62) {          // Sam's shadow, thrown up the wall by the night-light at his feet
  const [nx, ny] = ROOM_S.nl, b = poseBox(P, 0), cx = (b[0] + b[2]) / 2, k = 1.6;
  const tx = cx + 120, ty = b[3] - 20;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(tx, ty); ctx.scale(k, k * 1.05); ctx.translate(-cx, -b[3]);
  ctx.strokeStyle = ctx.fillStyle = 'rgb(14,14,30)'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [pts, w] of P.parts) limb(pts, w);
  ctx.beginPath(); ctx.arc(P.head[0], P.head[1], P.head[2], 0, 7); ctx.fill();
  const hk = p.horns ? E.out(inv(p.horns[0], p.horns[1], t)) * (1 - (p.crumble ? inv(p.crumble[0], p.crumble[1], t) : 0)) : 0;
  const [hx, hy, r] = P.head;
  if (hk > .01) for (const sd of [-1, 1]) {      // two little horns grow out of the shadow's head
    const bx = hx + sd * r * .45, by = hy - r * .75, cr = p.crumble ? inv(p.crumble[0], p.crumble[1], t) : 0;
    ctx.beginPath(); ctx.moveTo(bx - 9, by + 6); ctx.quadraticCurveTo(bx + sd * 8, by - 30 * hk, bx + sd * 16, by - 44 * hk + cr * 30); ctx.lineTo(bx + 10, by + 4); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const e = p.horns ? inv(p.horns[0] + .25, p.horns[1] + .25, t) * (1 - (p.crumble ? inv(p.crumble[0], p.crumble[0] + .4, t) : 0)) : 0;
  const ex = tx + (hx - cx) * k, ey = ty + (hy - b[3]) * k * 1.05;
  if (e > .01) {
    redEyes(ex + 6, ey + 8, 15, e);
    if (p.grin && t > p.grin) {                   // and a small grin, starting
      const gk = E.out(inv(p.grin, p.grin + .8, t)) * e;
      ctx.save(); ctx.translate(ex + 8, ey + 44); ctx.fillStyle = rgba([255, 110, 60], gk);
      ctx.beginPath(); ctx.moveTo(-26 * gk, 0); ctx.quadraticCurveTo(0, 22 * gk, 26 * gk, 0); ctx.quadraticCurveTo(0, 8 * gk, -26 * gk, 0); ctx.fill();
      ctx.fillStyle = rgba([255, 250, 240], gk); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 9 - 4, 3); ctx.lineTo(i * 9 + 4, 3); ctx.lineTo(i * 9, 11 * gk); ctx.fill(); }
      ctx.restore();
    }
    additive(() => glow(SPR.red, ex, ey + 10, 120, .4 * e));
  }
  return [ex, ey];
}
function kidInBed(x, s, look = 0) {             // Sam sitting up in his bed (the mattress at y 700), facing the door at the left
  const hip = [x, 704], sh = [x - 6 * s, 704 - 120 * s], hd = [sh[0] - 8 * s - 10 * look * s, sh[1] - 62 * s];
  return { head: [hd[0], hd[1], 50 * s], hand: [sh[0] - 40 * s, sh[1] + 60 * s], hands: [[sh[0] - 30 * s, sh[1] + 50 * s], [sh[0] - 50 * s, sh[1] + 56 * s]], f: -1, kid: true, sh, hip,
    parts: [[[hip, sh], 50 * s], [[[sh[0], sh[1] + 10 * s], [sh[0] - 36 * s, sh[1] + 40 * s], [sh[0] - 40 * s, sh[1] + 60 * s]], 18 * s]] };
}
function bedBlanket(P, lower, s) {               // the quilt over his knees, pulled up to his eyes (or down to his chest)
  const [hx, hy, r] = P.head, top = lerp(hy + r * .1, P.sh[1] + 30 * s, lower);
  ctx.fillStyle = 'rgb(150,120,190)'; ctx.strokeStyle = 'rgba(230,220,255,.6)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(hx - r * 1.5, 706); ctx.quadraticCurveTo(hx - r * 1.45, top - 6, hx - r * .2, top);
  ctx.quadraticCurveTo(hx + r * 1.4, top - 4, hx + r * 1.6, top + 50); ctx.quadraticCurveTo(hx + r * 2.6, 640, hx + r * 6, 690); ctx.lineTo(hx + r * 6, 712); ctx.lineTo(hx - r * 1.5, 712); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(90,70,140,.6)'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) line(hx - r * 1.2 + i * r * 1.6, top + 20, hx - r * 1.3 + i * r * 1.7, 706);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 5; i++) { starPath(hx - r + i * r * 1.3, top + 40 + (i % 2) * 30, 7); ctx.fill(); }
}
defShot('samroom', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t);
  fill([10, 10, 20]); cam(...fr);
  samRoomSet(t, { doorLight: p.doorLight ?? 1, heat, light: p.light, shut: p.shut !== false, ajar: p.ajar ? p.ajar(t, L) : 0 });
  const bed = p.bed !== false, look = p.look ? p.look(t, L) : 0;
  const S = p.sam ? p.sam(t, L) : bed ? kidInBed(1290, 1.05, look) : kidCrouch(SAM_AT[0], SAM_AT[1], SAM_AT[2], -1, p.hands ?? 0, look);
  samShadow(t, S, p);
  if (p.manShadow) {                            // his long shadow across the floor, from the doorway to Sam
    const k = typeof p.manShadow === 'function' ? p.manShadow(t, L) : p.manShadow;
    ctx.fillStyle = `rgba(8,4,6,${.75 * k})`; ctx.beginPath(); ctx.moveTo(60, FY); ctx.lineTo(160, FY); ctx.lineTo(1040, FY + 60); ctx.lineTo(1100, FY + 20); ctx.lineTo(1000, FY - 10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(1000, FY + 30, 60, 26, 0, 0, 7); ctx.fill();
  }
  const M = p.man ? p.man(t, L) : null;
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  const rimS = [190, 200, 255];
  drawFig(S, typeof p.samEx === 'function' ? p.samEx(t, L) : EXPR[p.samEx || (bed ? 'frozen' : 'flinch')], [255, 230, 160], .55, [255, 236, 170], { lx: -.5, ly: .4, lc: [-.4, .6] });
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), mix([255, 150, 80], rimS, .5), .6, [255, 214, 170], { lx: -1, ly: -.2, open: true });
  if (bed) bedBlanket(S, p.lower ? p.lower(t, L) : 0, 1.05);
  else if (p.blanket !== false) blanketOn(S);
  if (M && p.palms) palmsUp(M, p.palms);
  if (o) devilFront(t, o);
  if (o && o.a > .3) redWash(.07 * o.a);
}, (t, p, L) => toScreenBox(p.fr || [1, 960, 540], p.man ? unionBox(poseBox(p.man(t, L), 40), [1000, 600, 1300, 900]) : [700, 300, 1500, 900]));
// Sam's blanket round his shoulders, down to the floor
function blanketOn(P) {
  const [hx, hy, r] = P.head, f = P.f || 1, bx = hx - f * r * .2, fy = FY;
  ctx.fillStyle = 'rgb(92,84,150)'; ctx.strokeStyle = 'rgba(200,190,255,.55)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(bx - f * r * .9, hy - r * .55);
  ctx.quadraticCurveTo(bx - f * r * 1.9, hy + r * .8, bx - f * r * 2.2, fy);
  ctx.lineTo(bx + f * r * 1.7, fy); ctx.quadraticCurveTo(bx + f * r * 1.5, hy + r * 1.6, bx + f * r * .6, hy + r * .9);
  ctx.quadraticCurveTo(bx, hy + r * .3, bx - f * r * .9, hy - r * .55); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,36,80,.6)'; ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(bx - f * r * (.6 + i * .4), hy + r * (.6 + i * .3)); ctx.quadraticCurveTo(bx - f * r * (1 + i * .3), hy + r * 1.8, bx - f * r * (1.1 + i * .3), fy - 10); ctx.stroke(); }
}
// open hands, palms up: a small cream-lit flat on each hand
function palmsUp(M, a) {
  for (const h of M.hands) { ctx.fillStyle = rgba([255, 214, 170], .5 * a); ctx.beginPath(); ctx.ellipse(h[0] + 12, h[1] - 6, 26, 10, -.1, 0, 7); ctx.fill(); ctx.fillStyle = '#0b0809'; ctx.beginPath(); ctx.ellipse(h[0] + 12, h[1], 24, 9, -.1, 0, 7); ctx.fill(); }
}

// ---------- the cracked hall mirror: his reflection, then IT in every shard ----------
// p: { appear (when it is IT), z }
const MIR = [260, 40, 1400, 1000], CR = [1330, 760];
function mirrorShards() {
  const pts = [], n = 11;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + rnd(i + 500) * .4;
    pts.push([CR[0] + Math.cos(a) * 2600, CR[1] + Math.sin(a) * 2600]);
  }
  return pts.map((q, i) => [CR, q, pts[(i + 1) % n]]);
}
// the shards: each piece of glass shows the picture a little out of place; then the frame and the cracks
function shardsAndFrame(z, red) {
  px();
  const sh = mirrorShards(), k = VP.k, map = q => [((q[0] - W / 2) * z * PUSH + W / 2 + SHX) * k + VP.x, ((q[1] - H / 2) * z * PUSH + H / 2 + SHY) * k + VP.y];
  sh.forEach((tri, i) => {
    const dx = (rnd(i + 520) - .5) * 26 * k, dy = (rnd(i + 521) - .5) * 18 * k;
    ctx.save(); ctx.beginPath(); tri.map(map).forEach((q, j) => j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
    ctx.globalAlpha = .9; ctx.drawImage(cv, dx, dy); ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(255,255,255,${.03 + .05 * rnd(i + 522)})`; ctx.fillRect(0, 0, OUT.w, OUT.h);
    ctx.restore();
  });
  screen(); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.fillStyle = '#2e1a12'; ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(255,170,110,.35)'; ctx.lineWidth = 6; ctx.strokeRect(MIR[0] - 3, MIR[1] - 3, MIR[2] + 6, MIR[3] + 6);
  crackLines(CR[0], CR[1], MIR, 1, 1, 2.6);
  ctx.restore();
  if (red) redWash(red);
}
// p: { seq: [[shot, p, at]…], step } the night flashing past in the glass; or { appear (when it is IT), lower [a, b]
// (his fist comes down; its claw comes down in step), z }
defShot('cracked', (t, p, L) => {
  const z = p.z || 1;
  if (p.seq) {                                   // the montage: the night, a cut every step, inside the broken glass
    const st = p.step || .33, k = Math.floor(L / st), sub = L - k * st, [name, q, at] = p.seq[Math.min(k, p.seq.length - 1)];
    if (name === 'black') fill([2, 2, 3]); else SHOT[name].draw(at + sub, q, .4 + sub);
    PUSH = 1 + .07 * clamp(L / 3);
    shardsAndFrame(z, .06 + .1 * (k % 2));
    return;
  }
  fill([16, 8, 6]); screen();
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.beginPath(); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.clip();
  const g = ctx.createLinearGradient(0, MIR[1], 0, MIR[1] + MIR[3]); g.addColorStop(0, '#5a2414'); g.addColorStop(.7, '#2a120b'); g.addColorStop(1, '#0d0605');
  ctx.fillStyle = g; ctx.fillRect(MIR[0], MIR[1], MIR[2], MIR[3]);
  additive(() => glow(SPR.hot, 1500, 260, 700, .55));
  ctx.fillStyle = 'rgba(255,170,110,.12)'; ctx.fillRect(1380, 120, 120, 300);       // the sconce, reflected
  ctx.restore();
  const low = p.lower ? E.io(inv(p.lower[0], p.lower[1], t)) : 1, fist = [1250, lerp(380, 820, low)];
  const it = p.appear !== undefined && t >= p.appear, flick = p.appear !== undefined && t > p.appear - .45 && t < p.appear && Math.sin(t * 70) > 0;
  ctx.save(); screen(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.beginPath(); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.clip();
  if (it || flick) {
    const s = 2.7; placeDevil([960 - 40 * s, 470 + 830 * s, s]);
    const [hx, hy] = devilHead(t, devilO({}));
    const o = devilO({ a: 1, eyes: 1, grin: it ? E.out(inv(p.appear, p.appear + .5, t)) : .3, reach: 1, targets: [[hx - 330, hy + 900], fist] });
    ctx.restore();
    const fr = [z, W / 2 - (W / 2) * 0, H / 2];
    drawDevil(t, [z, W / 2, H / 2], o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
    screen(); ctx.save();
    ctx.fillStyle = '#2e1a12'; ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.fill('evenodd');
  } else {                                       // him, facing the glass, his fist up by his face, coming down
    const x = 960, y = 470, r = 170;
    ctx.fillStyle = 'rgba(255,120,70,.55)'; ctx.beginPath(); ctx.arc(x + 6, y - 6, r + 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#0c0808'; ctx.beginPath(); ctx.ellipse(x, y + r * 2.1, r * 1.8, r * 1.2, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - r * .33, y + r * .5, r * .62, r * .9);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    face(x, y, r, exprAt(t), { turn: 0, light: [255, 140, 90], la: .35, lc: [.3, -.5] });
    ctx.strokeStyle = 'rgba(255,120,70,.6)'; ctx.lineCap = 'round'; ctx.lineWidth = 98; line(1190, 980, fist[0], fist[1] + 40);
    ctx.strokeStyle = '#0c0808'; ctx.lineWidth = 86; line(1190, 980, fist[0], fist[1] + 40);
    ctx.fillStyle = '#0c0808'; rrect(fist[0] - 70, fist[1] - 60, 140, 120, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,140,90,.6)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) line(fist[0] - 40 + i * 40, fist[1] - 50, fist[0] - 40 + i * 40, fist[1] - 20);
  }
  ctx.restore();
  shardsAndFrame(z, it ? .05 : 0);
  screen(); const dg = ctx.createLinearGradient(0, 760, 0, 1080); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, 'rgba(0,0,0,.7)'); ctx.fillStyle = dg; ctx.fillRect(-W, 760, 3 * W, 2 * H);
}, () => [460, 100, 1460, 1000]);

// ---------- a montage of flashes back: p { step, word, seq: [[shot, p, at]…] } (at: the film time to draw it at) ----------
function montageItem(p, L) { const st = p.step || .375, k = Math.floor(L / st); return { k, sub: L - k * st, it: p.seq[Math.min(k, p.seq.length - 1)] }; }
defShot('flash', (t, p, L) => {
  const { k, sub, it } = montageItem(p, L), [name, q, at] = it;
  if (name === 'black') fill([2, 2, 3]);
  else SHOT[name].draw(at !== undefined ? at + sub : t, q, (at !== undefined ? .4 : 0) + sub);
  if (!p.word) return;
  font(OUT.vertical ? 60 : 46, SERIF, '400', 'italic'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = rgba(C.red, .8); ctx.shadowBlur = 16; ctx.fillStyle = rgba([255, 120, 110], .9);
  if (!OUT.vertical) { screen(); ctx.fillText(p.word, 300 + rnd(k + 40) * 1300, 200 + rnd(k + 41) * 640); }
  else { ui(); ctx.fillText(p.word, 260 + rnd(k + 40) * 470, 470 + rnd(k + 41) * 1050); }
  ctx.shadowBlur = 0;
}, (t, p, L) => { const { sub, it } = montageItem(p, L), [name, q, at] = it; const S = SHOT[name]; return S && S.subject ? S.subject(at !== undefined ? at + sub : t, q, sub) : null; });

// ---------- his phone's lock screen (the film's 'vice' screen: here it is the photo of Sam on his shoulders) ----------
function lockScreen(x, y, w, h, s, t, a, dy = 0) {
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba([250, 170, 100], a)); g.addColorStop(.6, rgba([220, 100, 90], a)); g.addColorStop(1, rgba([70, 40, 70], a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.translate(0, dy * s);
  ctx.fillStyle = rgba([255, 236, 190], .9 * a); ctx.beginPath(); ctx.arc(x + w * .7, y + h * .58, 60 * s, 0, 7); ctx.fill();   // the sun
  ctx.fillStyle = rgba([40, 26, 40], a); ctx.fillRect(x, y + h * .78, w, h * .3);                                               // a hill
  const by = y + h * .78, k = s * .9;                                                                           // Mom, him, Sam
  ctx.strokeStyle = ctx.fillStyle = rgba([30, 18, 28], a); ctx.lineCap = 'round';
  const fig = (bx, sc, bun) => {
    ctx.lineWidth = 30 * k * sc; line(bx, by, bx, by - 150 * k * sc);
    ctx.lineWidth = 16 * k * sc; line(bx - 8 * k * sc, by - 136 * k * sc, bx - 30 * k * sc, by - 60 * k * sc); line(bx + 8 * k * sc, by - 136 * k * sc, bx + 30 * k * sc, by - 60 * k * sc);
    ctx.beginPath(); ctx.arc(bx, by - 188 * k * sc, 30 * k * sc, 0, 7); ctx.fill();
    if (bun) { ctx.beginPath(); ctx.arc(bx - 20 * k * sc, by - 214 * k * sc, 15 * k * sc, 0, 7); ctx.fill(); }
  };
  fig(x + w * .27, .92, true); fig(x + w * .5, 1.05, false); fig(x + w * .7, .6, false);
  ctx.translate(0, -dy * s);
  font(96 * s, SANS, '300'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([255, 255, 255], .92 * a);
  ctx.fillText(statusAt(t), x + w / 2, y + 150 * s);
  const n = CUR.p && CUR.p.lock;                 // a notification on the lock screen, under the clock (it hides nothing)
  if (n && t >= n.at) {
    const k = E.out(inv(n.at, n.at + .3, t)), out = n.swipe ? E.io(inv(n.swipe, n.swipe + .35, t)) : 0;
    const bx = x + 22 * s + out * w, by = y + (236 + 20 * (1 - k)) * s, bw = w - 44 * s, bh = 168 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(28,24,30,.9)'; rrect(bx, by, bw, bh, 26 * s); ctx.fill();
    ctx.fillStyle = rgba(n.col || [76, 200, 120]); rrect(bx + 18 * s, by + 20 * s, 54 * s, 54 * s, 13 * s); ctx.fill();
    icon(n.icon || 'heart', bx + 45 * s, by + 49 * s, 54 * s);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    font(28 * s, SANS, '700'); ctx.fillStyle = rgba(C.cream); ctx.fillText(n.title, bx + 88 * s, by + 46 * s);
    font(29 * s, SANS, '500'); const rows = wrapText(n.text.replace(' ♥', ''), bw - 60 * s);
    rows.forEach((r, i) => { const last = i === rows.length - 1 && n.text.endsWith('♥'); textHeart(r + (last ? ' ♥' : ''), bx + 24 * s, by + (102 + i * 38) * s, 29 * s, C.cream, .95); });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
// this film's chat: the engine's bubbles at about twice the size, long lines wrapped
chatScreen = function (f, L, c) {                // eslint-disable-line no-global-assign
  const { s, w, h, x, y } = f;
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = '#0c0d12'; ctx.fillRect(x, y, w, h);
  font(34 * s, SANS, '700'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream); ctx.fillText(c.name, x + w / 2, y + 74 * s);
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x, y + 112 * s, w, 2 * s);
  for (const it of c.items) {
    if (it.until !== undefined && L >= it.until) continue;
    if (it.text === '•••' && L < it.at) continue;
    const fd = it.fade ?? .2, a = it.at < 0 ? (it.dim ? .55 : 1) : fd <= 0 ? (L >= it.at ? 1 : 0) : inv(it.at, it.at + fd, L);
    if (a <= .01) continue;
    font(29 * s, SANS, '500');
    const heart = it.text.endsWith('♥'), body = heart ? it.text.slice(0, -1).trimEnd() : it.text;
    const rows = wrapText(body, w * .66), tw = Math.max(...rows.map(r => ctx.measureText(r).width)) + (heart ? 40 * s : 0), bw = tw + 40 * s, bh = (22 + rows.length * 38) * s;
    const bx = it.me ? x + w - 22 * s - bw : x + 22 * s, by = y + it.y * s;
    ctx.fillStyle = rgba(it.col || (it.me ? [40, 110, 230] : [58, 58, 66]), a); rrect(bx, by, bw, bh, 26 * s); ctx.fill();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    rows.forEach((r, i) => { ctx.fillStyle = rgba(C.cream, a); ctx.fillText(r, bx + 20 * s, by + (30 + i * 38) * s); });
    if (heart) icon('heart', bx + 20 * s + ctx.measureText(rows[rows.length - 1]).width + 22 * s, by + (30 + (rows.length - 1) * 38) * s + 2 * s, 30 * s, [255, 90, 120], a);
  }
  ctx.restore();
};
const STATUS = [[0, '7:03'], [18.1, '7:49'], [26.3, '8:32'], [61.0, '9:41'], [TURN, '8:15']];
const statusAt = t => { let s = STATUS[0][1]; for (const q of STATUS) if (t >= q[0]) s = q[1]; return s; };
// ===== RAGE, part E: the comeback. The boxing gym (steel-blue brick, morning light), the bridge at sunrise =====

const GF = 880;                                   // the gym floor
const STEEL = { hi: [150, 170, 196], lo: [52, 60, 78], gold: [255, 206, 140] };
// the boxing gym: brick walls lit by tall windows, a ring's corner, hanging bags, a pull-up bar, a rack, the timer box
// q: { shutter (0 shut … 1 open: the roll-up door at the left), light (0 … 1), door (its dark doorway at the right) }
function gymSet(t, q = {}) {
  const L = q.light ?? 1;
  const g = ctx.createLinearGradient(0, 0, 0, GF); g.addColorStop(0, rgba(shade(STEEL.lo, .9 * L))); g.addColorStop(1, rgba(shade(STEEL.hi, .62 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + GF);
  for (let r = 0; r < 15; r++) for (let c = -8; c < 22; c++) {      // the brick
    const bx = c * 128 + (r % 2) * 64, by = 40 + r * 56;
    if (by > GF - 20) continue;
    ctx.fillStyle = rgba(shade(mix(STEEL.lo, STEEL.hi, .45 + .2 * rnd(r * 31 + c)), .72 * L), .55); ctx.fillRect(bx, by, 122, 50);
  }
  for (const wx of [380, 980]) {                  // two tall windows, morning gold pouring in
    ctx.fillStyle = rgba(mix([255, 226, 180], [255, 200, 140], .5), .95 * L); ctx.fillRect(wx, 120, 240, 300);
    ctx.strokeStyle = rgba([40, 46, 60]); ctx.lineWidth = 10; ctx.strokeRect(wx, 120, 240, 300); line(wx + 120, 120, wx + 120, 420); line(wx, 270, wx + 240, 270);
    ctx.fillStyle = rgba(STEEL.gold, .13 * L); ctx.beginPath(); ctx.moveTo(wx, 420); ctx.lineTo(wx + 240, 420); ctx.lineTo(wx + 520, GF + 40); ctx.lineTo(wx + 140, GF + 40); ctx.closePath(); ctx.fill();
    additive(() => glow(SPR.dawn, wx + 120, 270, 520, .4 * L));
  }
  // the floor: dark rubber, a pool of gold
  ctx.fillStyle = rgba(shade([60, 62, 70], .9 * L)); ctx.fillRect(-W, GF, 3 * W, 2 * H);
  ctx.fillStyle = rgba(STEEL.hi, .5 * L); ctx.fillRect(-W, GF, 3 * W, 4);
  additive(() => { ctx.save(); ctx.translate(960, GF + 50); ctx.scale(1, .18); glow(SPR.dawn, 0, 0, 900, .4 * L); ctx.restore(); });
  // the ring's corner at the right: a post and three red ropes
  ctx.fillStyle = rgba(shade([40, 40, 48], L)); ctx.fillRect(1660, 470, 26, GF - 470);
  ctx.fillStyle = rgba(shade([90, 96, 110], L)); ctx.fillRect(1650, 460, 46, 22);
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = rgba([210, 40, 40], .95 * L); ctx.lineWidth = 9; line(1686, 520 + i * 90, 2400, 500 + i * 90); ctx.strokeStyle = rgba([255, 160, 150], .5 * L); ctx.lineWidth = 2; line(1686, 516 + i * 90, 2400, 496 + i * 90); }
  ctx.fillStyle = rgba(shade([110, 26, 26], .85 * L)); ctx.fillRect(1640, GF - 70, 900, 70);
  // two heavy bags hanging on chains (in the background)
  for (const [bx, ph] of [[1300, 0], [1490, 1.3]]) {
    const sw = Math.sin(t * 1.1 + ph) * .03;
    ctx.save(); ctx.translate(bx, 60); ctx.rotate(sw);
    ctx.strokeStyle = rgba([150, 156, 170], .9 * L); ctx.lineWidth = 5; line(0, 0, 0, 230);
    ctx.fillStyle = rgba(shade([120, 30, 28], .95 * L)); rrect(-58, 230, 116, 360, 40); ctx.fill();
    ctx.fillStyle = rgba([255, 220, 190], .25 * L); rrect(-48, 240, 22, 330, 10); ctx.fill();
    ctx.fillStyle = rgba(shade([40, 20, 20], L)); ctx.fillRect(-58, 300, 116, 14); ctx.fillRect(-58, 500, 116, 14);
    ctx.restore();
  }
  // the roll-up shutter at the left edge
  if (q.shutter !== undefined) {
    const up = q.shutter, sx = -300, sw = 520, top = 140, h = (GF - top) * (1 - up);
    ctx.fillStyle = rgba([255, 226, 180], .95); ctx.fillRect(sx, top, sw, GF - top);
    additive(() => glow(SPR.dawn, sx + sw / 2, GF - 100, 900, .7 * up));
    ctx.fillStyle = rgba([84, 92, 108]); ctx.fillRect(sx, top, sw, h);
    ctx.strokeStyle = rgba([40, 46, 60]); ctx.lineWidth = 4; for (let y = top + 20; y < top + h; y += 26) line(sx, y, sx + sw, y);
    ctx.fillStyle = rgba([30, 34, 44]); ctx.fillRect(sx - 10, top - 30, sw + 20, 34);
  }
  if (q.door) {                                    // its dark doorway, at the right (the ending)
    ctx.fillStyle = rgba([6, 6, 10]); ctx.fillRect(1520, 360, 210, GF - 360);
    ctx.fillStyle = rgba(shade(STEEL.hi, .8 * L)); ctx.fillRect(1506, 346, 14, GF - 346); ctx.fillRect(1506, 346, 238, 14); ctx.fillRect(1730, 346, 14, GF - 346);
  }
}
// a figure in the gym: lit gold from the windows
const GRIM = [255, 214, 160];
function gymFig(P, t, ex) { drawFig(P, ex || exprAt(t), GRIM, .62, GRIM, { lx: .6, ly: -1, la: .36, lc: [.6, -.5] }); }

// the jump rope: a hop and the rope's arc round him
function poseRope(x, fy, s, t) {
  const ph = (t * 2.6) % 1, hop = Math.abs(Math.sin(ph * Math.PI)) * 18 * s;
  const P = figPose(x, fy - hop, s, 1, { hands: [[x - 54 * s, fy - hop - 250 * s], [x + 60 * s, fy - hop - 250 * s]], step: .4 });
  P.rope = { ph, hop };
  return P;
}
function drawRope(P, s) {
  const [a, b] = P.hands, ph = P.rope.ph, ang = ph * Math.PI * 2, rx = (b[0] - a[0]) / 2 + 30 * s, cx = (a[0] + b[0]) / 2;
  ctx.strokeStyle = rgba([240, 230, 220], .9); ctx.lineWidth = 4 * s;
  ctx.beginPath(); ctx.ellipse(cx, a[1] + Math.cos(ang) * 120 * s, rx + 40 * s, 140 * s + Math.cos(ang) * 120 * s, 0, 0, Math.PI); ctx.stroke();
}
// boxing pads (him) and gloves (Sam): pads at his hands, gloves at Sam's
function pad(x, y, s, col = [230, 60, 50]) { ctx.fillStyle = rgba(col); rrect(x - 26 * s, y - 34 * s, 52 * s, 68 * s, 18 * s); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x, y, 9 * s, 0, 7); ctx.fill(); }
function glove(x, y, s) { ctx.fillStyle = rgba([220, 30, 36]); ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,200,200,.5)'; ctx.beginPath(); ctx.arc(x - 6 * s, y - 8 * s, 7 * s, 0, 7); ctx.fill(); }

// p: { move: 'shutter' | 'rope' | 'pushup' | 'pullup' | 'squat' | 'curl' | 'breathe' | 'pads' | 'door', fr, eyes [a, b] }
function gymScene(t, p, L) {
  const s = 1.1, m = p.move;
  if (m === 'shutter') { const k = E.io(inv(.05, 1.1, L)); return { shutter: k, P: figPose(lerp(-60, 360, inv(.5, 1.4, L)), GF, s, 1, { lean: .08 }), walk: true }; }
  if (m === 'rope') return { P: poseRope(880, GF, s, t) };
  if (m === 'pushup') return { P: posePushup(760, GF, 1.25, rep(L, 1.4)) };
  if (m === 'pullup') return { P: posePullup(950, 300, 1.1, rep(L, 1.1)), bar: true };
  if (m === 'pullfail') {                         // DAY 1: he hangs and strains, can't get his chin over the bar, and drops
    if (L < 1.0) return { P: posePullup(950, 300, 1.1, .32 * (1 - Math.cos(Math.min(L, .9) * Math.PI * 1.1)) / 2 + .04 * Math.sin(L * 40) * (L > .4 ? 1 : 0)), bar: true };
    const k = E.out(inv(1.0, 1.15, L)); return { P: figPose(950, GF, 1.1, 1, { hands: [[1000 - 20 * k, GF - 300 + 80 * k], [1010 - 20 * k, GF - 290 + 80 * k]], lean: .2 * (1 - k), knee: .25 * (1 - inv(1.15, 1.3, L)) }), bar: true };
  }
  if (m === 'together') {                         // both of them, palms open, breathing; Sam copies him a beat behind
    const brM = .5 - .5 * Math.cos(L * Math.PI * 1.25), brS = .5 - .5 * Math.cos(Math.max(0, L - .35) * Math.PI * 1.25);
    const M = figPose(1080, GF, s, -1, { hands: [[1036, GF - 296 - 18 * brM], [1016, GF - 288 - 18 * brM]], open: true, lean: -.04 * brM });
    const S = figPose(800, GF, .74, 1, { hands: [[866, GF - 170 - 16 * brS], [884, GF - 164 - 16 * brS]], open: true }, true);
    return { P: M, S, breath: brM, breathS: brS, calmK: 1, together: true };
  }
  if (m === 'squat') return { P: poseSquat(900, GF, 1.15, rep(L, 1)) };
  if (m === 'curl') return { P: poseCurl(940, GF, 1.1, rep(L, 1.3)) };
  if (m === 'breathe') { const br = .5 - .5 * Math.cos(Math.max(0, L - .1) * Math.PI * 1.25); return { P: poseSit(860, 760, s, .15 - .1 * br), bench: true, breath: br }; }
  if (m === 'pads') {
    const bell = p.bell ?? 1.2, after = L > bell, hit = after ? 0 : rep(L, 1.6), calmK = inv(bell + .1, bell + .6, L), br = after ? .5 - .5 * Math.cos((L - bell - .5) * Math.PI * 1.2) : 0;
    const M = figPose(1100, GF, s, -1, { hands: after ? [[1040, GF - 250 - 20 * br], [1020, GF - 240 - 20 * br]] : [[1040, GF - 330 - 20 * hit], [1030, GF - 280]], open: after, lean: -.05 * br });
    const S = figPose(800, GF, .74, 1, { hands: after ? [[846, GF - 170 - 14 * br], [860, GF - 164 - 14 * br]] : [[860 + 150 * hit, GF - 245], [850 + 150 * (1 - hit), GF - 230]], open: after }, true);
    return { P: M, S, pads: !after, breath: br, bell, calmK };
  }
  return { P: figPose(900, GF, s, 1, {}) };
}
defShot('gym', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], q = gymScene(t, p, L);
  fill([30, 34, 44]); cam(...fr);
  gymSet(t, { shutter: q.shutter, door: p.move === 'door' });
  if (q.bar) { ctx.strokeStyle = '#2c3038'; ctx.lineWidth = 16; ctx.lineCap = 'round'; line(760, GF, 760, 300); line(1160, GF, 1160, 300); ctx.strokeStyle = rgba([220, 226, 236], .9); ctx.lineWidth = 10; line(740, 300, 1180, 300); }
  if (q.bench) { ctx.fillStyle = '#23262e'; ctx.fillRect(700, 760, 380, 26); ctx.fillRect(730, 786, 18, GF - 786); ctx.fillRect(1040, 786, 18, GF - 786); ctx.fillStyle = 'rgba(255,214,160,.4)'; ctx.fillRect(700, 760, 380, 4); }
  if (p.eyes) { placeDevil([1500, 1040, .55]); devilEyes(t, devilO({ eyes: .8 * win(t, p.eyes[0], p.eyes[1], .25, .5) })); }
  if (p.dev) {                                      // it stands in a corner of the gym, a little smaller each day, fading as he works
    const [x, fy, s2] = p.dev.at, k = inv(p.dev.fade[0], p.dev.fade[1], t);
    placeDevil([x, fy + 200 * s2, s2]);
    const o = devilO({ a: .85 - .45 * k, eyes: 1 - .4 * k, grin: .5, lean: .3 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  }
  if (p.move === 'door') {                        // starved: knee-high and thin in the doorway, its eyes opening
    const k = inv(p.open || 0, (p.open || 0) + .5, t);
    placeDevil([1624, GF + 200 * .2, .2]);
    const o = devilO({ a: .9, eyes: k, grin: .5 * inv((p.open || 0) + .6, (p.open || 0) + 1.2, t), lean: .3 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
    return;
  }
  const P = q.P;
  if (P.bar) { plate(P.bar[0] - 6, P.bar[1], 58); }
  const eyesShut = q.together ? Object.assign({}, EXPR.calm, { lid: .92 }) : null;
  if (q.S) { gymFig(q.S, t, eyesShut || (q.calmK > .5 ? EXPR.calm : EXPR.laugh)); if (!q.pads) palmsUp(q.S, .8 * q.calmK); else { glove(q.S.hands[0][0], q.S.hands[0][1], .74); glove(q.S.hands[1][0], q.S.hands[1][1], .74); } }
  gymFig(P, t, q.S ? (eyesShut || (q.calmK > .5 ? EXPR.calm : EXPR.laugh)) : undefined);
  if (q.pads) { pad(P.hands[0][0], P.hands[0][1], 1.1); pad(P.hands[1][0], P.hands[1][1], 1.1); }
  if (q.S && !q.pads) additive(() => { glow(SPR.dawn, P.head[0] - 50, P.head[1] + 40, 90 + 110 * q.breath, .22 * q.calmK); glow(SPR.dawn, q.S.head[0] + 40, q.S.head[1] + 30, 60 + 80 * (q.breathS ?? q.breath), .22 * q.calmK); });
  else if (q.S) palmsUp(P, .8 * q.calmK);
  if (P.rope) drawRope(P, 1.1);
  if (P.bar) { ctx.fillStyle = '#d8d8de'; rrect(P.bar[0] - 8, P.bar[1] - 8, 16, 16, 4); ctx.fill(); }
  if (P.db) { ctx.strokeStyle = '#cfcfd6'; ctx.lineWidth = 8; line(P.db[0] - 26, P.db[1], P.db[0] + 26, P.db[1]); plate(P.db[0] - 26, P.db[1], 20); plate(P.db[0] + 26, P.db[1], 20); }
  if (q.bench && q.breath !== undefined) {         // his breath: a soft ring that swells and settles
    additive(() => glow(SPR.dawn, P.head[0] + 60, P.head[1] + 40, 120 + 140 * q.breath, .18));
    palmsUp({ hands: [[P.hand[0] - 10, P.hand[1] + 10], [P.hand[0] + 20, P.hand[1] + 14]] }, .9);
  }
  if (p.bellAt !== undefined && L > p.bellAt && L < p.bellAt + .5) {   // the bell: a bright ring on the wall
    additive(() => glow(SPR.gold, 1600, 300, 160 * (1 + (L - p.bellAt) * 3), .7 * (1 - (L - p.bellAt) / .5)));
  }
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540];
  if (p.move === 'door') return toScreenBox(fr, [1460, 640, 1780, 900]);
  const q = gymScene(t, p, L); let b = poseBox(q.P, 60);
  if (q.S) b = unionBox(b, poseBox(q.S, 40));
  if (p.move === 'pullup') b[1] = Math.min(b[1], 270);
  return toScreenBox(fr, b);
});

// ---------- the run: over a city bridge into the sunrise; it chases and falls behind ----------
// p { fr, run: [from, to] (film time of the whole run) }
defShot('bridge', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], u = t - p.run[0], ph = u * 2.4 * Math.PI * 2, d = u * 2.4 * 250, fade = inv(p.run[0], p.run[1], t);
  fill([90, 70, 120], [250, 170, 120]);
  cam(...fr);
  const sky = ctx.createLinearGradient(0, -200, 0, 760); sky.addColorStop(0, rgba([70, 80, 140])); sky.addColorStop(.6, rgba([240, 150, 120])); sky.addColorStop(1, rgba([255, 214, 150]));
  ctx.fillStyle = sky; ctx.fillRect(-800, -600, W + 1600, 1400);
  additive(() => { glow(SPR.dawn, 1500, 640, 900, .8); glow(SPR.gold, 1500, 640, 220, .9); });
  ctx.fillStyle = rgba([255, 236, 200]); ctx.beginPath(); ctx.arc(1500, 640, 70, 0, 7); ctx.fill();
  // the city across the river, far, then near
  for (const [par, base, col, lit] of [[.05, 640, [120, 90, 130], .5], [.12, 700, [70, 56, 92], .8]]) {
    ctx.fillStyle = rgba(col);
    for (let i = -4; i < 30; i++) {
      const bw = 80 + 70 * rnd(i * 3 + par * 100), bh = 80 + 220 * rnd(i * 7 + par * 50), x = ((i * 130 - d * par) % 3600 + 3600) % 3600 - 800;
      ctx.fillRect(x, base - bh, bw, bh + 200);
      ctx.fillStyle = rgba([255, 214, 140], lit * (.3 + .4 * rnd(i)));
      for (let j = 0; j < 4; j++) ctx.fillRect(x + 12 + (j % 2) * 30, base - bh + 20 + Math.floor(j / 2) * 40, 10, 14);
      ctx.fillStyle = rgba(col);
    }
  }
  ctx.fillStyle = rgba([200, 130, 120]); ctx.fillRect(-800, 720, W + 1600, 140);         // the river, catching the sun
  ctx.fillStyle = rgba([255, 220, 170], .55); for (let i = 0; i < 26; i++) ctx.fillRect(1500 - 300 + rnd(i + 30) * 600 + Math.sin(t * 2 + i) * 10, 730 + rnd(i + 31) * 120, 40 + 60 * rnd(i), 3);
  // the bridge deck and its railing (the posts slide past)
  ctx.fillStyle = rgba([52, 44, 62]); ctx.fillRect(-800, 820, W + 1600, 400);
  ctx.fillStyle = rgba([255, 200, 150], .7); ctx.fillRect(-800, 820, W + 1600, 5);
  ctx.strokeStyle = rgba([38, 32, 48]); ctx.lineWidth = 10; line(-800, 610, W + 800, 610);
  for (let i = -2; i < 26; i++) { const x = ((i * 110 - d) % 2860 + 2860) % 2860 - 400; ctx.lineWidth = 8; line(x, 610, x, 820); }
  ctx.strokeStyle = rgba([255, 200, 150], .5); ctx.lineWidth = 3; line(-800, 606, W + 800, 606);
  embers(t, d, .7);
  const ds = p.devS || .75;
  placeDevil([150 - 260 * fade, 820 + 200 * ds, ds]);
  const o = devilO({ a: .75 - .4 * fade, eyes: .95 - .5 * fade, grin: .3, lean: .4, stride: ph * .75 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  const PW = poseWalk(760, 820, 1.05, ph, 1);
  drawPerson(PW, [8, 7, 10], C.gold, .7, 1, -.3);
  face(PW.head[0], PW.head[1], PW.head[2], exprAt(t), { turn: 1, light: C.gold, la: .45, lc: [.8, -.1] });
}, (t, p) => { const u = t - p.run[0]; return toScreenBox(p.fr || [1, 960, 540], poseBox(poseWalk(760, 820, 1.05, u * 2.4 * Math.PI * 2, 1), 60)); });

// ---------- the fridge, close: the drawing; Sam's small hand tapes it back, and a new one ----------
// p: { tape (when his hand presses the tape on) }
defShot('fridge', (t, p, L) => {
  const calm = t >= TURN;
  fill([30, 14, 8]); cam(3.3, 1676, 410);
  kitchenSet(t, { heat: heatAt(t), calm, noHole: true, newOnly: p.tape !== undefined });
  if (p.tape !== undefined) {
    const k = E.out(inv(p.tape - .55, p.tape, t)), out = E.io(inv(p.tape + .25, p.tape + .7, t)), hx = lerp(1810, 1640, k) + 160 * out, hy = lerp(560, 372, k) + 120 * out;
    if (t < p.tape) { ctx.save(); ctx.translate(hx - 30, hy - 30); ctx.rotate(-.2 * (1 - k)); crayonDrawing(0, 0, .95, 1); ctx.restore(); }
    else { ctx.fillStyle = 'rgba(255,255,255,.65)'; for (const [x, y, a] of [[1600, 290, -.5], [1700, 370, -.5]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillRect(-16, -5, 32, 10); ctx.restore(); } }
    ctx.strokeStyle = 'rgba(255,220,180,.6)'; ctx.lineWidth = 15; ctx.lineCap = 'round'; line(hx + 140, hy + 110, hx, hy);
    ctx.strokeStyle = '#100f18'; ctx.lineWidth = 11; line(hx + 140, hy + 110, hx, hy);
    ctx.fillStyle = '#100f18'; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 7); ctx.fill();
  }
}, () => toScreenBox([3.3, 1676, 410], [1600, 300, 1760, 520]));

// ---------- the code-drawn thumbnail (the cloud uploads it; the ChatGPT one replaces it from the Mac) ----------
// Its own composition: the ember kitchen at full heat, the devil bent double under the ceiling with its claws round his
// fists, and on the wall his little brother's small shadow growing two tiny horns. RAGE huge top left, IT GROWS under it.
defShot('thumb', (t, p) => {
  const fr = [1.32, 1230, 500];
  fill([30, 8, 6]); cam(...fr);
  kitchenSet(29.5, { heat: 1 });
  const S = kidInBed(1530, 1.05);                                    // Sam's small shadow on the wall, horns and all
  const b = poseBox(S, 0);
  ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = ctx.strokeStyle = 'rgb(30,8,10)'; ctx.lineCap = 'round';
  ctx.translate(1640, 700); ctx.scale(1.15, 1.15); ctx.translate(-(b[0] + b[2]) / 2, -b[3]);
  for (const [pts, w] of S.parts) limb(pts, w);
  ctx.beginPath(); ctx.arc(S.head[0], S.head[1], S.head[2], 0, 7); ctx.fill();
  for (const sd of [-1, 1]) { const bx = S.head[0] + sd * S.head[2] * .45, by = S.head[1] - S.head[2] * .75; ctx.beginPath(); ctx.moveTo(bx - 9, by + 6); ctx.quadraticCurveTo(bx + sd * 8, by - 30, bx + sd * 16, by - 44); ctx.lineTo(bx + 10, by + 4); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  redEyes(1638, 700 - (b[3] - S.head[1]) * 1.15 + 6, 11, 1);
  const M = figPose(1300, FY, 1.1, 1, { lean: .16, hands: [[1350, 640], [1390, 610]] });
  const d = { at: [1060, FY, 1.45], o: { grin: 1, reach: .95, lean: 3, targets: M.hands } }, o = drawDevilBehind(t, fr, d);
  drawFig(M, EXPR.rage, [255, 110, 60], .7, [255, 120, 70]);
  devilFront(t, o);
  redWash(.08);
  px(); drawVignetteFlat(.5); screen();
  const big = (txt, x0, y0, size, track) => {                         // fat white capitals with a red edge
    font(size, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if ('letterSpacing' in ctx) ctx.letterSpacing = track + 'px';
    ctx.shadowColor = 'rgba(255,20,30,.95)'; ctx.shadowBlur = size * .22;
    ctx.lineWidth = size * .16; ctx.strokeStyle = 'rgb(200,10,24)'; ctx.strokeText(txt, x0, y0);
    ctx.shadowBlur = 0; ctx.lineWidth = size * .07; ctx.strokeStyle = '#000'; ctx.strokeText(txt, x0, y0);
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x0, y0);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  };
  big('RAGE', 70, 190, 300, 6);
  big('IT GROWS', 84, 410, 112, 3);
});
// ===== RAGE, the cut =====
const COLD = 'EVERY TIME YOU LOSE IT…', COLD2 = '…IT GROWS.';
const RUN = [72.1, 76.7];
const SAM_TABLE = (o = {}) => kidSit(1300, 760, .8, -1, o);
const SAM_WAVE = (t) => SAM_TABLE({ hands: [[1220, 690], [1236 + Math.sin(t * 12) * 18, 540]] });
const SAM_JUMP = (t) => { const k = E.out(inv(T_POT, T_POT + .15, t)) * (1 - inv(T_POT + .5, T_POT + 1.2, t)); return SAM_TABLE({ lean: .08 - .2 * k, hands: [[1226, 690 - 40 * k], [1240, 690 - 50 * k]] }); };
const SAM_FREEZE = (t, t0) => { const k = E.out(inv(t0, t0 + .12, t)); return SAM_TABLE({ lean: .08 - .16 * k, hands: [[1226 + 14 * k, 690], [1240 + 14 * k, 692]] }); };
// SNAP 1: the pot, slammed into the sink
const MAN_POT = (t) => { const k = E.io(inv(T_POT - .3, T_POT, t)); return figPose(560, FY, 1.1, 1, { lean: .1 + .15 * k, hands: [[lerp(600, 720, k), lerp(500, 600, k)], [lerp(640, 760, k), lerp(490, 590, k)]] }); };
const SNAP1 = { man: MAN_POT, pot: { at: T_POT }, sam: SAM_JUMP, samEx: (t) => t > T_POT ? EXPR.startle : EXPR.smile, shadow: .5 };
// SNAP 2: the shout
const MAN_SHOUT = (t) => figPose(900, FY, 1.1, 1, { lean: .1 + .18 * E.out(inv(T_SHOUT - .1, T_SHOUT + .1, t)), head: .1 });
const SNAP2 = { man: MAN_SHOUT, dev: () => ({ at: [730, FY, 1.1], o: { grin: .7, reach: .9, lean: .5 } }), shock: T_SHOUT,
  sam: (t) => SAM_FREEZE(t, T_SHOUT + .05), samEx: (t) => t > T_SHOUT + .05 ? EXPR.startle : EXPR.smile };
// SNAP 3: the fist through the kitchen wall
const MAN_PUNCH = (t) => { const k = E.io(inv(T_PUNCH - .45, T_PUNCH - .1, t)), h = t < T_PUNCH - .1 ? lerp2([1340, 600], [1250, 560], k) : lerp2([1250, 560], [1470, 500], E.out(inv(T_PUNCH - .1, T_PUNCH, t))); return figPose(1330, FY, 1.1, 1, { lean: .12, hands: [null, h] }); };
const SNAP3 = { man: MAN_PUNCH, dev: () => ({ at: [1090, FY, 1.45], o: { grin: 1, reach: .95, lean: 3 } }), fr: [1.15, 1180, 500] };
// SNAP 4: in the hallway he draws his fist back, slowly; one blow, into the wall beside the mirror. It is bigger than
// ever: its head has gone up through the ceiling
const MAN_WALL = (t) => { const back = E.io(inv(35.4, 37.0, t)), hit = E.out(inv(38.72, 38.9, t)) * (1 - inv(39.1, 39.6, t)); return figPose(1040, FY, 1.1, 1, { lean: .1 - .06 * back + .16 * hit, hands: [null, lerp2(lerp2([1100, 600], [960, 420], back), [1190, 520], hit)] }); };
const DEV4 = () => ({ at: [190, FY + 260, 2.4], o: { grin: 1, reach: .9, lean: 5.6 } });
// the reveal's end: he kneels at Sam's door, palms open on the floor; it shrinks back into his shadow
const KNEEL = (t) => manKneel(780, FY, 1.1, 1, E.io(inv(55.1, 55.7, t)), 1, true);
const DEV_SHRINK = (t) => { const k = E.io(inv(55.3, 56.9, t)); return { at: [lerp(470, 640, k), FY, lerp(1.6, .35, k)], o: { a: 1 - .85 * k, scream: 1 - .6 * k, grin: 0, reach: .3 * (1 - k), lean: lerp(3.6, .5, k), eyes: 1 - .6 * k } }; };
const CHAT1 = [{ at: -1, text: 'Sam texted me. Is everything ok??', y: 150 }];

defineFilm({
  title: 'RAGE', subtitle: 'IT HOLDS HIS FISTS', dur: 116,
  app: { name: 'Mom', label: 'M', icon: 'heart', color: [76, 200, 120] },
  viceScreen: lockScreen,
  handScreen: t => { ctx.fillStyle = 'rgb(240,160,100)'; ctx.fillRect(-13, -23, 26, 44); },
  thumb: { word: 'RAGE', hook: 'IT GROWS', expr: 'fear' },
  phases: [
    { name: 'Cold open', a: 0, b: 3.2 }, { name: '7:02 PM', a: 3.2, b: 18.1 }, { name: '7:48 PM', a: 18.1, b: 26.3 }, { name: '8:31 PM', a: 26.3, b: 34.0 },
    { name: '9:17 PM', a: 34.0, b: 44.0 }, { name: 'It shows itself', a: 44.0, b: 63.4 }, { name: 'He fights back', a: 63.4, b: 100.5 }, { name: 'Weeks later', a: 100.5, b: 116 }
  ],
  words: [
    { id: 'W01', t: .1, d: 2.2, text: 'Every time you lose it… it grows.', show: false },
    { id: 'W02', t: 15.8, d: 2.1, text: 'Long day. You’re allowed.' },
    { id: 'W03', t: 23.5, d: 1.9, text: 'He has to learn.' },
    { id: 'W04', t: 30.0, d: 1.9, text: 'You couldn’t help it.' },
    { id: 'W05', t: 35.3, d: 1.9, text: 'You just want to talk.' },
    { id: 'R01', t: 44.8, d: 1.9, text: 'You never lost control.', real: true },
    { id: 'R02', t: 46.85, d: 1.65, text: 'You handed it to me.', real: true },
    { id: 'R03', t: 50.15, d: 2.0, text: 'Look. He’s learning.', real: true },
    { id: 'S01', t: 55.3, d: 1.6, text: '(it screams)' },
    { id: 'W06', t: 67.6, d: 1.9, text: 'You’ll snap again.' },
    { id: 'W07', t: 72.5, d: 1.9, text: 'You can’t outrun me.' },
    { id: 'W08', t: 90.4, d: 1.8, text: 'Go on. Teach him.' },
    { id: 'S02', t: 93.1, d: 1.1, text: '(it shrieks)' },
    { id: 'R04', t: 105.6, d: 2.0, text: 'Lose it once. That’s all I need.', real: true }
  ],
  slams: [2.6, 11.8, 20.8, 29.7, 38.9, 49.15, 54.05, 63.4, 90.4, 109.6, 111.5],
  glitch: [[.85, 1.15, .7], [2.6, 3.1, 1], [13.35, 13.7, .8], [40.9, 41.1, .8], [44.2, 44.55, 1], [49.15, 49.55, .7], [54.05, 54.45, .9], [90.4, 90.7, .8], [93.1, 93.4, .7], [105.4, 105.8, .9]],
  flash: { led: [255, 214, 170], dface: [255, 60, 60], sting: [255, 60, 60] },
  vignette: [[0, .75], [63.4, .75], [64.1, .5], [85.2, .55], [100.5, .7]],
  heartbeat: [[44.0, 49.0], [52.5, 53.7], [59.5, 61.0]],
  expr: [[0, 'tired'], [11.7, 'rage'], [17.4, 'tired'], [20.75, 'shout'], [21.9, 'rage'], [23.4, 'ashamed'], [28.5, 'rage'], [29.6, 'shout'], [30.2, 'rage'],
    [40.5, 'empty'], [44.45, 'shock'], [53.3, 'resolve'], [59.9, 'look'], [63.4, 'resolve'], [66.3, 'strain'], [72.1, 'focus'], [78.3, 'strain'], [82.0, 'calm'],
    [87.2, 'smile'], [88.95, 'strain'], [92.5, 'calm'], [94.1, 'laugh'], [95.6, 'calm'], [102.1, 'laugh'], [103.4, 'calm']],
  shots: [
    [0, 'fist', { cold: true, lines: [[COLD, .1, .5], [COLD2, .55, .85]], out: [2.25, 2.5], eyesAt: .85, clawsIn: [1.6, 1.95], shake: 1, look: 'ember' }],
    [2.6, 'sting'],
    // 7:02 PM: home
    [3.2, 'led', '7:02 PM'],
    [4.4, 'kitchen', { man: (t, L) => { const k = E.io(inv(4.5, 4.85, t)); return figPose(540, FY, 1.1, 1, { hands: [null, [lerp(600, 680, k), lerp(640, 580, k)]] }); }, bag: 4.85, shadow: .5, sam: SAM_WAVE, samEx: 'smile', ex: 'tired' }],
    [6.2, 'fridge', {}],
    [7.8, 'phone', { screen: 'vice', z: 1.12, lock: { at: 7.95, title: 'Mom', text: 'Night shift. Watch your brother ♥', swipe: 10.15 } }],
    [10.4, 'stove', { grab: 10.9 }],
    [11.6, 'kitchen', Object.assign({ fr: [1.2, 820, 560] }, SNAP1)],
    [13.0, 'kitchen', { fr: [1.45, 640, 480], man: (t) => figPose(560, FY, 1.1, 1, { lean: .12 }), ex: 'rage', shadow: (t) => 1 - inv(13.45, 13.8, t),
      dev: (t) => ({ at: [396, FY, .85], o: { a: E.out(inv(13.45, 13.8, t)), eyes: inv(13.15, 13.35, t), grin: .35 * inv(13.8, 14.2, t), reach: .9 * E.io(inv(13.8, 14.1, t)) } }) }],
    [14.7, 'samface', { look: 'ember', ex: 'startle', jolt: .05 }],
    [15.7, 'dface', { at: [700, FY, .85], o: () => ({ grin: .45 }), look: 'ember' }],
    [17.0, 'face', 'ember'],
    // 7:48 PM: the juice, the shout
    [18.1, 'led', '7:48 PM'],
    [19.2, 'table', { hand: true }],
    [20.6, 'kitchen', SNAP2],
    [22.4, 'samface', { look: 'ember', ex: 'frozen', crayon: 22.6 }],
    [23.4, 'kitchen', { man: (t) => figPose(900, FY, 1.1, 1, { lean: .08 }), dev: () => ({ at: [730, FY, 1.1], o: { grin: .8, reach: .9, lean: .6 } }),
      sam: (t, L) => figPose(lerp(1290, 1900, E.io(clamp((L - .2) / 1.6))), FY, .74, 1, { step: Math.sin(L * 9) }, true), samEx: 'flinch' }],
    [25.3, 'chair', {}],
    // 8:31 PM: the wall
    [26.3, 'phone', { screen: 'vice', z: 1.12, lock: { at: 26.45, title: 'Mom', text: 'Sam texted me. Is everything ok??', col: [255, 96, 150] } }],
    [28.5, 'face', 'hot'],
    [29.4, 'kitchen', SNAP3],
    [31.3, 'drawing', {}],
    [32.9, 'hole', { eye: 33.2 }],
    // 9:17 PM: Sam's door
    [34.0, 'led', '9:17 PM'],
    [35.2, 'hall', { man: MAN_WALL, dev: DEV4, fr: [1.05, 900, 470], through: true }],
    [37.2, 'samroom', { fr: [1.25, 1180, 560] }],
    [38.6, 'hall', { man: MAN_WALL, dev: DEV4, fr: [1.2, 1000, 470], through: true }],
    [40.0, 'face', 'hot'],
    // the evening flashes past in the broken glass
    [41.0, 'cracked', { step: .333, seq: [['kitchen', SNAP1, 11.8], ['samface', { look: 'ember', ex: 'startle' }, 14.75], ['table', { hand: true }, 19.65], ['kitchen', SNAP2, 20.85],
      ['samface', { look: 'ember', ex: 'frozen', crayon: 22.6 }, 22.7], ['kitchen', SNAP3, 29.65], ['hole', { eye: 33.2 }, 33.4], ['led', '9:18 PM', 43.0], ['led', '9:19 PM', 44.1]] }],
    // it shows itself
    [44.0, 'cracked', { lower: [44.15, 45.9], appear: 44.45 }],
    [46.2, 'cracked', { z: 1.32, appear: 0, lower: [0, .1] }],
    [49.0, 'samroom', { horns: [49.15, 49.55], fr: [1.2, 1240, 520] }],
    [50.0, 'samroom', { horns: [49.15, 49.55], grin: 51.2, fr: [2.2, 1480, 420] }],
    [52.5, 'face', 'hot'],
    [53.7, 'fist', { claws: 1, open: (t) => E.out(inv(53.9, 54.4, t)), pry: [54.05, 54.6], look: 'hot' }],
    [55.1, 'hall', { man: KNEEL, dev: DEV_SHRINK, fr: [1, 900, 520] }],
    [57.3, 'dface', { at: [560, FY, 1], o: () => ({ scream: 1, grin: 0 }), fade: [57.3, 58.3] }],
    [58.3, 'samroom', { horns: [49.15, 49.55], crumble: [58.3, 58.9], lower: (t) => E.io(inv(58.5, 59.2, t)), look: (t) => E.io(inv(58.8, 59.3, t)), samEx: (t) => t < 58.8 ? EXPR.frozen : EXPR.look, fr: [1.2, 1180, 560] }],
    [59.5, 'hall', { man: (t) => manKneel(780, FY, 1.1, 1, 1, 1, true), ajar: (t) => E.io(inv(59.9, 60.5, t)), fr: [1.7, 900, 640] }],
    [61.0, 'phone', { screen: 'chat', z: 1.12, chat: { name: 'Mom', items: [...CHAT1, { at: .1, text: 'No. I scared him. I’m getting help.', me: true, y: 290 }] } }],
    // he fights back (days); it is smaller every day
    [63.4, 'led', { label: '7:30 AM', gym: true, day: 'DAY 1' }],
    [65.0, 'gym', { move: 'shutter', fr: [1, 760, 540] }],
    [66.3, 'gym', { move: 'rope', fr: [1.3, 880, 600] }],
    [67.5, 'gym', { move: 'pushup', fr: [1.15, 1000, 640], dev: { at: [1560, GF, .7], fade: [67.5, 68.8] } }],
    [68.8, 'gym', { move: 'pullfail', fr: [1.15, 960, 520] }],
    [70.1, 'led', { label: '7:15 AM', gym: true, day: 'DAY 4' }],
    [72.1, 'bridge', { fr: [1, 960, 540], run: RUN, devS: .5 }], [73.25, 'bridge', { fr: [2.2, 780, 640], run: RUN, devS: .5 }],
    [74.4, 'bridge', { fr: [1.8, 800, 500], run: RUN, devS: .5 }], [75.55, 'bridge', { fr: [1, 960, 540], run: RUN, devS: .5 }],
    [76.7, 'led', { label: '6:45 AM', gym: true, day: 'DAY 9' }],
    [78.3, 'gym', { move: 'squat', fr: [1.2, 1000, 620], dev: { at: [1560, GF, .38], fade: [78.3, 79.5] } }],
    [79.5, 'gym', { move: 'curl', fr: [1.7, 960, 650] }],
    [80.7, 'gym', { move: 'pullup', fr: [1.15, 960, 520] }],
    [82.0, 'gym', { move: 'breathe', fr: [1.6, 900, 620] }],
    [83.6, 'gym', { move: 'breathe', fr: [2.5, 960, 600] }],
    // DAY 12: dinner
    [85.2, 'led', { label: '7:40 PM', day: 'DAY 12' }],
    [87.2, 'kitchen', { fr: [1.3, 460, 560], man: (t) => figPose(230, FY, 1.1, 1, { hands: [null, [380, 560 + Math.sin(t * 6) * 8]] }), ex: 'smile',
      sam: (t) => figPose(520, 760, .74, -1, { hands: [null, [420 + Math.sin(t * 6) * 16, 560]] }, true), samEx: 'laugh', chair: true }],
    [88.6, 'table', { hand: true, leap: 89.15 }],
    [89.6, 'fist', { clawsIn: [89.75, 90.25], shake: 1, look: 'ember' }],
    [90.4, 'dface', { at: [700, FY, 1], o: () => ({ grin: 1, lean: .6 }), scare: true }],
    [91.2, 'face', 'hot'],
    [92.0, 'fist', { claws: 1, open: (t) => E.io(inv(92.2, 92.9, t)), pry: [92.3, 92.95], look: 'warm' }],
    [93.1, 'dface', { at: [700, FY, 1], o: () => ({ scream: 1, grin: 0 }), fade: [93.1, 94.1], look: 'warm' }],
    [94.1, 'kitchen', { man: (t, L) => figPose(900, FY, 1.1, 1, { hands: [null, L < .5 ? [990, 600 - 120 * E.out(L / .5)] : [960, 640]] }), ex: 'laugh', towel: 94.5,
      sam: (t) => SAM_TABLE({ hands: [[1220, 690], [1180, 600]] }), samEx: 'laugh' }],
    [95.6, 'kitchen', { fr: [1.6, 1380, 560], man: (t) => figPose(1290, FY, 1.1, 1, { hands: [null, [1452 + 18 * Math.sin(t * 7), 520]] }), ex: 'calm',
      sam: (t) => figPose(1420, 760, .74, 1, { hands: [null, [1500, 560 + 14 * Math.sin(t * 8)]] }, true), samEx: 'smile', chair: true, chairX: 1420 }],
    [97.1, 'phone', { screen: 'chat', z: 1.12, chat: { name: 'Mom', items: [{ at: -1, dim: true, text: 'Sam texted me. Is everything ok??', y: 150 }, { at: -1, dim: true, text: 'No. I scared him. I’m getting help.', me: true, y: 290 },
      { at: .1, text: 'Sam says you made dinner ♥', fade: .15, y: 430 }] } }],
    [99.0, 'fridge', { tape: 99.7 }],
    // weeks later
    [100.5, 'card', 'WEEKS LATER'],
    [102.1, 'gym', { move: 'pads', bell: 1.0, bellAt: 1.0, fr: [1.6, 950, 680] }],
    [103.4, 'gym', { move: 'together', fr: [1.75, 940, 600] }],
    [105.2, 'gym', { move: 'door', open: 105.4, fr: [2.2, 1610, 760] }],
    [107.8, 'black'],
    [108.3, 'end', { line: 'EVERY TIME YOU DON’T…', typeAt: 108.4, slam: 'IT STARVES.', slamAt: 109.6 }],
    [111.3, 'title', { at: 111.5 }]
  ]
});
