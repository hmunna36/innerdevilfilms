'use strict';
// The cast: the man (a dark silhouette of round-capped strokes with a cream face that acts) and the devil (black,
// horned, red-rimmed, burning eyes, a grin full of teeth, smoke, an aura of heat). Never redesign them: every film
// and Short uses these two. Coordinates are world px of the set being drawn (cam() frames them).

// ---------- the man ----------
function limb(pts, w) {
  ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}
// rim light: the same shape a little larger, nudged toward the light, drawn first in the light's colour
function drawPerson(P, fill, rim, rimA, lx = 0, ly = -1) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pass = (dx, dy, col, extra) => {
    ctx.strokeStyle = col; ctx.fillStyle = col;
    for (const [pts, w] of P.parts) limb(pts.map(p => [p[0] + dx, p[1] + dy]), w + extra);
    ctx.beginPath(); ctx.arc(P.head[0] + dx, P.head[1] + dy, P.head[2] + extra / 2, 0, Math.PI * 2); ctx.fill();
  };
  if (rimA > .003) pass(lx * 5, ly * 5, rgba(rim, rimA), 4);
  pass(0, 0, rgba(fill), 0);
}
// sitting on the bed edge, facing right; h = hunch (0 upright … 1 folded over the phone)
function poseSit(x, y, s, h) {
  const sh = [x + (16 + 46 * h) * s, y - (168 - 44 * h) * s];
  const hd = [sh[0] + (20 + 44 * h) * s, sh[1] - (64 - 38 * h) * s];
  const knee = [x + 108 * s, y - 4 * s], foot = [x + 120 * s, y + 92 * s];
  const elbow = [sh[0] + (34 + 14 * h) * s, sh[1] + (70 - 10 * h) * s];
  const hand = [x + (100 + 8 * h) * s, y - (50 + 12 * (1 - h)) * s];
  return {
    head: [hd[0], hd[1], 40 * s], hand,
    parts: [
      [[[x, y], [x + (4 - 10 * h) * s, y - 90 * s], sh], 58 * s],
      [[[x - 10 * s, y + 4 * s], [knee[0] - 16 * s, knee[1] + 8 * s], [foot[0] - 24 * s, foot[1]]], 36 * s],
      [[[x, y], knee, foot], 40 * s],
      [[sh, elbow, hand], 24 * s]
    ]
  };
}
// standing, seen from behind; y = hip height, feet at y + 188·s; turn moves the head to the right
function poseStand(x, y, s, turn = 0, breathe = 0) {
  const sh = y - 186 * s - breathe * 3 * s;
  return {
    head: [x + turn * 16 * s, sh - 66 * s, 40 * s],
    parts: [
      [[[x, y - 8 * s], [x, sh + 10 * s]], 74 * s],
      [[[x - 40 * s, sh + 8 * s], [x + 40 * s, sh + 8 * s]], 34 * s],
      [[[x - 20 * s, y], [x - 26 * s, y + 188 * s]], 34 * s],
      [[[x + 20 * s, y], [x + 26 * s, y + 188 * s]], 34 * s],
      [[[x - 46 * s, sh + 14 * s], [x - 58 * s, sh + 100 * s], [x - 60 * s, sh + 176 * s]], 22 * s],
      [[[x + 46 * s, sh + 14 * s], [x + 58 * s, sh + 100 * s], [x + 60 * s, sh + 176 * s]], 22 * s]
    ]
  };
}
// walking / running in profile toward the right; ph = stride phase (radians), y = ground line
function poseWalk(x, y, s, ph, run = 0) {
  const amp = .42 + .3 * run, lean = .06 + .2 * run, L = 98 * s;
  const leg = p => {
    const th = Math.sin(p) * amp, bend = .12 + (.55 + .6 * run) * Math.max(0, Math.cos(p));
    const knee = [Math.sin(th) * L, Math.cos(th) * L];
    return [knee, [knee[0] + Math.sin(th - bend) * L, knee[1] + Math.cos(th - bend) * L]];
  };
  const A = leg(ph), B = leg(ph + Math.PI);
  const hip = [x, y - Math.max(A[1][1], B[1][1])];          // the lower foot touches the ground
  const at = p => [hip[0] + p[0], hip[1] + p[1]];
  const sh = [hip[0] + Math.sin(lean) * 168 * s, hip[1] - Math.cos(lean) * 168 * s];
  const hd = [sh[0] + Math.sin(lean * 1.3) * 64 * s, sh[1] - Math.cos(lean * 1.3) * 64 * s];
  const arm = p => {
    const ua = -Math.sin(p) * amp * .9, fb = .35 + .9 * run;
    const el = [sh[0] + Math.sin(ua) * 78 * s, sh[1] + Math.cos(ua) * 78 * s];
    return [sh, el, [el[0] + Math.sin(ua + fb) * 70 * s, el[1] + Math.cos(ua + fb) * 70 * s]];
  };
  return {
    head: [hd[0], hd[1], 36 * s],
    parts: [
      [[hip, at(B[0]), at(B[1])], 32 * s], [arm(ph + Math.PI), 20 * s],
      [[hip, sh], 54 * s],
      [[hip, at(A[0]), at(A[1])], 32 * s], [arm(ph), 20 * s]
    ]
  };
}
function poseLie(x, y, s) {          // asleep on his back, head on the pillow
  return { head: [x, y - 30 * s, 38 * s], parts: [
    [[[x + 40 * s, y - 20 * s], [x + 260 * s, y - 18 * s]], 60 * s],
    [[[x + 260 * s, y - 18 * s], [x + 400 * s, y - 14 * s], [x + 520 * s, y - 10 * s]], 34 * s],
    [[[x + 70 * s, y - 34 * s], [x + 170 * s, y - 44 * s], [x + 230 * s, y - 30 * s]], 20 * s]
  ] };
}
// the training moves (side view, facing right). rep() runs them: 0 at rest … 1 at the hard end of a rep
const rep = (t, perSec) => (1 - Math.cos(2 * Math.PI * t * perSec)) / 2;
// push-up on the floor (y); k: 0 arms straight … 1 chest near the floor
function posePushup(x, y, s, k) {
  const lift = lerp(80, 34, k) * s, sh = [x + 240 * s, y - lift - 8 * s], hip = [x + 118 * s, y - lift * .55 - 10 * s];
  const hand = [sh[0] + 8 * s, y - 4 * s], elbow = [sh[0] - (6 + 30 * k) * s, (sh[1] + hand[1]) / 2 - 6 * k * s];
  return { head: [sh[0] + 42 * s, sh[1] - 16 * s, 31 * s], parts: [[[[x, y - 7 * s], hip, sh], 40 * s], [[sh, elbow, hand], 20 * s]] };
}
// hanging from a bar at yBar; k: 0 hanging … 1 chin over the bar
function posePullup(x, yBar, s, k) {
  const sh = [x, yBar + lerp(150, 44, k) * s], hand = [x + 10 * s, yBar];
  const elbow = [x + lerp(12, 50, k) * s, (sh[1] + hand[1]) / 2 + 12 * k * s];
  const hip = [x - 6 * s, sh[1] + 170 * s], knee = [x + 26 * s, hip[1] + 88 * s], foot = [x - 14 * s, knee[1] + 76 * s];
  return { head: [x + 12 * s, sh[1] - 62 * s, 36 * s], parts: [[[hip, sh], 54 * s], [[sh, elbow, hand], 22 * s], [[hip, knee, foot], 32 * s]] };
}
// a barbell back squat; k: 0 standing … 1 deep; returns the bar's position too
function poseSquat(x, y, s, k) {
  const hip = [x - 44 * k * s, y - lerp(196, 112, k) * s], knee = [x + lerp(8, 62, k) * s, y - lerp(100, 96, k) * s], foot = [x + 12 * s, y];
  const sh = [hip[0] + lerp(6, 46, k) * s, hip[1] - lerp(170, 150, k) * s];
  return { head: [sh[0] + 18 * s, sh[1] - 60 * s, 36 * s], bar: [sh[0] - 6 * s, sh[1] - 4 * s],
    parts: [[[hip, sh], 54 * s], [[hip, knee, foot], 34 * s], [[sh, [sh[0] - 34 * s, sh[1] + 40 * s], [sh[0] - 6 * s, sh[1] - 2 * s]], 20 * s]] };
}
// standing dumbbell curl; k: 0 arm down … 1 curled; returns the dumbbell's position
function poseCurl(x, y, s, k) {
  const hip = [x, y - 196 * s], sh = [x + 6 * s, y - 370 * s], el = [sh[0] + 6 * s, sh[1] + 84 * s], ang = lerp(.15, 2.5, k);
  const hand = [el[0] + Math.sin(ang) * 74 * s, el[1] + Math.cos(ang) * 74 * s];
  return { head: [x + 16 * s, y - 436 * s, 38 * s], db: hand,
    parts: [[[[x - 14 * s, y], [x - 12 * s, y - 100 * s], hip], 34 * s], [[[x + 14 * s, y], [x + 16 * s, y - 100 * s], hip], 34 * s],
      [[hip, sh], 56 * s], [[sh, el, hand], 22 * s]] };
}
// the box a pose fills (for a Short's framing)
function poseBox(P, pad = 30) {
  let x0 = P.head[0] - P.head[2], y0 = P.head[1] - P.head[2], x1 = P.head[0] + P.head[2], y1 = P.head[1] + P.head[2];
  for (const [pts, w] of P.parts) for (const p of pts) { x0 = Math.min(x0, p[0] - w / 2); y0 = Math.min(y0, p[1] - w / 2); x1 = Math.max(x1, p[0] + w / 2); y1 = Math.max(y1, p[1] + w / 2); }
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
}

// ---------- his face: cream features on the dark head ----------
const EXPR = {
  glazed:  { lid: .45, brow: 0, browH: 0, smile: 0, open: 0, grit: 0, gx: .3, gy: .6, tear: 0, sweat: 0 },
  tired:   { lid: .66, brow: .45, browH: -.04, smile: -.3, open: 0, grit: 0, gx: .2, gy: .7, tear: 0, sweat: 0 },
  empty:   { lid: .5, brow: .8, browH: .06, smile: -.55, open: 0, grit: 0, gx: 0, gy: .9, tear: .6, sweat: 0 },
  ashamed: { lid: .55, brow: .85, browH: .06, smile: -.6, open: 0, grit: 0, gx: -.8, gy: .7, tear: 0, sweat: 0 },
  shock:   { lid: 0, brow: .7, browH: .2, smile: -.25, open: .45, grit: 0, gx: 0, gy: 0, tear: 0, sweat: 0 },
  resolve: { lid: .18, brow: -.75, browH: -.04, smile: -.15, open: 0, grit: 0, gx: .5, gy: 0, tear: 0, sweat: 0 },
  strain:  { lid: .8, brow: -1, browH: -.08, smile: -.45, open: .35, grit: 1, gx: 0, gy: 0, tear: 0, sweat: 1 },
  focus:   { lid: .22, brow: -.4, browH: 0, smile: 0, open: 0, grit: 0, gx: .7, gy: 0, tear: 0, sweat: 0 },
  calm:    { lid: .32, brow: .15, browH: .04, smile: .45, open: 0, grit: 0, gx: .6, gy: -.1, tear: 0, sweat: 0 },
  smile:   { lid: .38, brow: .25, browH: .06, smile: .85, open: .12, grit: 0, gx: .5, gy: -.15, tear: 0, sweat: 0 },
  sleep:   { lid: 1, brow: .1, browH: 0, smile: .15, open: 0, grit: 0, gx: 0, gy: 0, tear: 0, sweat: 0 },
  fear:    { lid: 0, brow: .95, browH: .16, smile: -.5, open: .3, grit: 0, gx: -.6, gy: .1, tear: 0, sweat: .6 },
  rage:    { lid: .3, brow: -1, browH: -.1, smile: -.6, open: .4, grit: 1, gx: 0, gy: 0, tear: 0, sweat: .3 },
  hungry:  { lid: .3, brow: -.2, browH: 0, smile: .25, open: .08, grit: 0, gx: .4, gy: .5, tear: 0, sweat: 0 }
};
const mixExpr = (a, b, k) => { const o = {}; for (const f in a) o[f] = lerp(a[f], b[f], k); return o; };
function exprAt(t) {                // blends into each new expression over .35 s, and blinks now and then
  const K = FILM.expr;
  let i = 0;
  while (i + 1 < K.length && t >= K[i + 1][0]) i++;
  const cur = EXPR[K[i][1]], prev = EXPR[K[Math.max(0, i - 1)][1]];
  const k = i ? E.sine(inv(K[i][0], K[i][0] + .35, t)) : 1, out = {};
  for (const f in cur) out[f] = lerp(prev[f], cur[f], k);
  const ph = t % 3.7;
  if (out.open < .4 && ph < .13) out.lid = Math.max(out.lid, 1 - Math.abs(ph - .065) / .065);
  return out;
}
// turn 0 = facing us, 1 = three-quarters to the right; o.light tints the side the light falls on
function face(x, y, r, ex, o = {}) {
  const turn = o.turn ?? .9, fa = o.featA ?? .92, col = C.cream;
  if (o.light) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    const lc = o.lc || [.5, .5], lx = x + lc[0] * r, ly = y + lc[1] * r;
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * 1.4);
    g.addColorStop(0, rgba(o.light, o.la ?? .3)); g.addColorStop(1, rgba(o.light, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.restore();
  }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const ey = y - .05 * r, open = Math.max(.04, 1 - ex.lid);
  const eyeList = [[x + r * lerp(-.36, .27, turn), .22 * r, 1], [x + r * lerp(.36, .7, turn), .22 * r * lerp(1, .7, turn), -1]];
  for (const [cx, ew, side] of eyeList) {
    const eh = .13 * r * open, px = cx + ex.gx * ew * .22, py = ey + ex.gy * eh * .35;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, ey, ew / 2, eh / 2 + .002 * r, 0, 0, Math.PI * 2);
    ctx.fillStyle = rgba(col, fa * .95); ctx.fill(); ctx.clip();
    ctx.fillStyle = rgba([14, 11, 13], Math.min(1, fa * 1.1));
    ctx.beginPath(); ctx.arc(px, py, .06 * r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([255, 255, 255], fa * .9);
    ctx.beginPath(); ctx.arc(px + .025 * r, py - .025 * r, .016 * r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = rgba(col, fa); ctx.lineWidth = .03 * r;            // upper lid
    ctx.beginPath(); ctx.ellipse(cx, ey, ew / 2 + .01 * r, eh / 2 + .01 * r, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    if (ex.lid > .5) {                                                     // tired bags
      ctx.strokeStyle = rgba(col, fa * .3); ctx.lineWidth = .018 * r;
      ctx.beginPath(); ctx.arc(cx, ey + .06 * r, ew * .45, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    }
    // brow: side 1 is the near eye (inner end on its right), -1 the far eye
    const by = ey - .2 * r - ex.browH * r, inner = cx + side * ew * .55, outer = cx - side * ew * .62;
    ctx.strokeStyle = rgba(col, fa); ctx.lineWidth = .04 * r;
    line(outer, by + ex.brow * .03 * r, inner, by - ex.brow * .08 * r);
  }
  const nx = x + r * lerp(0, .58, turn);                                   // nose
  ctx.strokeStyle = rgba(col, fa * .5); ctx.lineWidth = .022 * r;
  ctx.beginPath(); ctx.moveTo(nx, y + .02 * r); ctx.lineTo(nx + .06 * r * turn, y + .2 * r); ctx.lineTo(nx - .02 * r, y + .23 * r); ctx.stroke();
  const mx = x + r * lerp(0, .46, turn), my = y + .45 * r, mw = .32 * r * lerp(1, .8, turn);   // mouth
  const cy = my - ex.smile * .05 * r, dip = my + ex.smile * .1 * r;
  if (ex.open > .05) {
    const lo = ex.open * .16 * r;
    ctx.fillStyle = rgba([14, 9, 11], Math.min(1, fa * 1.1));
    ctx.beginPath(); ctx.moveTo(mx - mw / 2, cy); ctx.quadraticCurveTo(mx, dip - lo * .2, mx + mw / 2, cy);
    ctx.quadraticCurveTo(mx, dip + lo, mx - mw / 2, cy); ctx.fill();
    if (ex.grit > .05) { ctx.fillStyle = rgba(col, fa * .85 * ex.grit); ctx.fillRect(mx - mw * .38, (cy + dip) / 2 - .012 * r, mw * .76, .05 * r); }
  }
  ctx.strokeStyle = rgba(col, fa); ctx.lineWidth = .032 * r;
  ctx.beginPath(); ctx.moveTo(mx - mw / 2, cy); ctx.quadraticCurveTo(mx, dip, mx + mw / 2, cy); ctx.stroke();
  if (ex.tear > .02) {
    ctx.fillStyle = rgba(col, fa * .7 * ex.tear);
    ctx.beginPath(); ctx.arc(eyeList[0][0] + .04 * r, ey + .12 * r + ex.tear * .1 * r, .025 * r, 0, Math.PI * 2); ctx.fill();
  }
  if (ex.sweat > .02) {
    ctx.fillStyle = rgba(col, fa * .6 * ex.sweat);
    for (const [dx, dy] of [[-.25, -.62], [.42, -.55]]) { ctx.beginPath(); ctx.ellipse(x + dx * r, y + dy * r, .02 * r, .035 * r, 0, 0, Math.PI * 2); ctx.fill(); }
  }
}
// big face close-ups, cut in between the wider shots: the light that falls on him says where he is
const LOOKS = {
  night: { bg: [[8, 9, 14], [16, 12, 24]], fill: [6, 5, 8], light: [255, 176, 196], la: .3, lc: [.45, .75], glow: 'red', gl: [1220, 1080], ga: .4, rim: [190, 160, 255], turn: .9 },
  grey: { bg: [[20, 21, 26], [30, 31, 36]], fill: [9, 9, 11], light: [196, 200, 210], la: .16, lc: [-.6, -.3], glow: 'grey', gl: [260, 260], ga: .25, rim: [196, 200, 210], turn: .75, featA: .72 },
  red: { bg: [[34, 5, 9], [96, 10, 18]], fill: [8, 4, 6], light: [255, 96, 96], la: .32, lc: [.3, .8], glow: 'red', gl: [960, 1180], ga: .55, rim: [255, 110, 110], turn: .9 },
  sun: { bg: [[226, 142, 112], [255, 214, 160]], fill: [24, 14, 20], light: [255, 214, 150], la: .42, lc: [.8, -.1], glow: 'gold', gl: [1760, 460], ga: .65, rim: [255, 226, 170], turn: .85 },
  shower: { bg: [[30, 40, 52], [60, 74, 90]], fill: [10, 12, 16], light: [210, 230, 255], la: .3, lc: [0, -.8], glow: 'blue', gl: [960, -100], ga: .5, rim: [200, 225, 255], turn: .8 },
  lamp: { bg: [[34, 22, 14], [60, 38, 22]], fill: [16, 10, 8], light: [255, 200, 140], la: .4, lc: [.7, -.2], glow: 'amber', gl: [1600, 500], ga: .45, rim: [255, 200, 140], turn: .85 },
  dawn: { bg: [[60, 70, 90], [140, 130, 120]], fill: [12, 12, 16], light: [255, 220, 180], la: .38, lc: [-.6, -.4], glow: 'amber', gl: [300, 200], ga: .45, rim: [255, 220, 180], turn: .85 },
  gym: { bg: [[22, 20, 22], [40, 34, 30]], fill: [12, 10, 10], light: [255, 200, 140], la: .4, lc: [.2, -.9], glow: 'amber', gl: [960, -60], ga: .55, rim: [255, 210, 150], turn: .85 }
};
const FACE_XY = t => [W / 2 - 60 + Math.sin(t * .8) * 6, H * .44 + Math.sin(t * 1.3) * 3, 250];
function faceShot(t, look, ex) {
  const L = LOOKS[look];
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgba(L.bg[0])); g.addColorStop(1, rgba(L.bg[1]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);        // past the screen too: a Short's window can be taller
  additive(() => glow(SPR[L.glow], L.gl[0], L.gl[1], 900, L.ga));
  const [x, y, r] = FACE_XY(t);
  ctx.fillStyle = rgba(L.rim, .5);                                         // rim on the lit side
  ctx.beginPath(); ctx.arc(x + L.lc[0] * 8, y + L.lc[1] * 8, r + 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba(L.fill);
  ctx.beginPath(); ctx.ellipse(x - 20, y + r * 2.05, r * 1.7, r * 1.15, 0, Math.PI, 0); ctx.fill();   // shoulders
  ctx.fillRect(x - r * .36, y + r * .55, r * .62, r * .9);                                         // neck
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  face(x, y, r, ex || exprAt(t), { turn: L.turn, light: L.light, la: L.la, lc: L.lc, featA: L.featA });
}
const faceBox = t => { const [x, y, r] = FACE_XY(t); return [x - r * 1.25, y - r * 1.2, x + r * 1.25, y + r * 1.75]; };

// ---------- the devil ----------
const DEVIL = { x: 790, y: 1080, s: 1 };           // the base of the figure, hidden behind the bed
// where it stands in the bedroom, night by night: [x, y, scale]
const SPOTS = { window: [430, 980, .6], foot: [1390, 1060, .8], beside: [1120, 1050, .9], behind: [790, 1080, 1], chase: [150, 1180, .75] };
function placeDevil(spot) { [DEVIL.x, DEVIL.y, DEVIL.s] = Array.isArray(spot) ? spot : SPOTS[spot]; }
const devilO = o => Object.assign({ a: 0, eyes: 0, grin: 0, reach: 0, lean: 0, scream: 0 }, o);
const sway = t => Math.sin(t * 1.7) * 6 * DEVIL.s;
function devilHead(t, o) {
  const { x, y, s } = DEVIL;
  return [x + (40 + 60 * o.lean) * s + sway(t), y - 830 * s + o.lean * 40 * s];
}
// the box its head, horns and grin fill, in world px
const devilBox = (t, o) => { const [hx, hy] = devilHead(t, o), s = DEVIL.s; return [hx - 230 * s, hy - 380 * s, hx + 230 * s, hy + 260 * s]; };
function devilBody(g, t, o) {        // body, neck, head and horns, solid black
  const { x, y, s } = DEVIL, tw = sway(t), [hx, hy] = devilHead(t, o);
  g.fillStyle = g.strokeStyle = '#020102'; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(x - 190 * s + tw, y - 700 * s);
  g.quadraticCurveTo(x - 250 * s, y - 450 * s, x - 90 * s, y - 100 * s);
  g.lineTo(x + 90 * s, y - 100 * s);
  g.quadraticCurveTo(x + 250 * s, y - 450 * s, x + 190 * s + tw, y - 700 * s);
  g.quadraticCurveTo(x + tw, y - 770 * s, x - 190 * s + tw, y - 700 * s);
  g.fill();
  g.lineWidth = 90 * s; g.beginPath(); g.moveTo(x + tw, y - 700 * s); g.lineTo(hx - 10 * s, hy + 60 * s); g.stroke();
  g.save(); g.translate(hx, hy); g.rotate(-.15 - .2 * o.lean);
  g.beginPath(); g.moveTo(0, -150 * s);
  g.bezierCurveTo(130 * s, -150 * s, 125 * s, 10 * s, 70 * s, 95 * s); g.quadraticCurveTo(20 * s, 170 * s, 0, 175 * s);
  g.quadraticCurveTo(-20 * s, 170 * s, -70 * s, 95 * s); g.bezierCurveTo(-125 * s, 10 * s, -130 * s, -150 * s, 0, -150 * s); g.fill();
  g.restore();
  for (const sd of [-1, 1]) {        // long horns curling out and up
    const bx = hx + sd * 60 * s, by = hy - 100 * s;
    g.beginPath(); g.moveTo(bx - 26 * s, by + 10 * s);
    g.quadraticCurveTo(bx + sd * 160 * s, by - 40 * s, bx + sd * 125 * s, by - 260 * s);
    g.quadraticCurveTo(bx + sd * 90 * s, by - 70 * s, bx + 26 * s, by + 6 * s);
    g.fill();
  }
  g.save(); g.globalCompositeOperation = 'destination-out';
  const fg = g.createLinearGradient(0, y - 420 * s, 0, y - 120 * s);
  fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = fg; g.fillRect(x - 420 * s, y - 420 * s, 840 * s, 540 * s); g.restore();
}
// drawn over him: arms with the elbows too high, fingers like knives, reaching for targets (his shoulders by default)
function devilArms(t, o, targets = [[905, 612], [1004, 690]]) {
  if (o.reach <= .01) return;
  const { x, y, s } = DEVIL, tw = sway(t);
  ctx.save();
  ctx.strokeStyle = '#020102'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(C.red, .9 * o.a); ctx.shadowBlur = 26 * VP.k;
  [-1, 1].forEach((sd, i) => {
    const sh = [x + sd * 185 * s + tw, y - 690 * s], rest = [x + sd * 230 * s, y - 380 * s];
    const tg = [lerp(rest[0], targets[i][0], o.reach), lerp(rest[1], targets[i][1] - 20, o.reach)];
    const el = [(sh[0] + tg[0]) / 2 + (sd < 0 ? -90 : 70) * s, (sh[1] + tg[1]) / 2 - 130 * s * o.reach];
    limb([sh, el, tg], 40 * s);
    for (let f = 0; f < 4; f++) {
      const ang = Math.PI * .5 + (f - 1.5) * .28 + (i ? -.35 : .25) + Math.sin(t * 3 + f) * .05;
      const L = (110 + (f % 2) * 22) * s * (.6 + .4 * o.reach);
      const k1 = [tg[0] + Math.cos(ang) * L * .55, tg[1] + Math.sin(ang) * L * .55];
      const tip = [k1[0] + Math.cos(ang + .55) * L * .5, k1[1] + Math.sin(ang + .55) * L * .5];
      ctx.lineWidth = 12 * s; ctx.beginPath(); ctx.moveTo(tg[0], tg[1]); ctx.lineTo(k1[0], k1[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
    }
  });
  ctx.restore();
}
function devilEyes(t, o) {
  const [hx, hy] = devilHead(t, o), s = DEVIL.s, fl = .85 + .15 * Math.sin(t * 23) * Math.sin(t * 7);
  additive(() => { for (const sd of [-1, 1]) {
    glow(SPR.red, hx + sd * 40 * s, hy - 8 * s, 95 * s, .95 * o.eyes * fl);
    glow(SPR.amber, hx + sd * 40 * s, hy - 8 * s, 32 * s, o.eyes * fl);
  } });
  ctx.fillStyle = rgba([255, 244, 230], o.eyes);
  for (const sd of [-1, 1]) {        // slanted slits, outer ends up
    ctx.save(); ctx.translate(hx + sd * 40 * s, hy - 8 * s); ctx.rotate(-sd * .38);
    ctx.beginPath(); ctx.ellipse(0, 0, 27 * s, Math.max(.5, 7 * s * o.eyes), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([40, 0, 0], .95 * o.eyes); ctx.beginPath(); ctx.ellipse(0, 0, 3 * s, Math.max(.4, 6.5 * s * o.eyes), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([255, 244, 230], o.eyes); ctx.restore();
  }
  if (o.a <= .02) return;
  additive(() => {                   // cracks of fire in its skull
    ctx.strokeStyle = rgba([255, 70, 40], .75 * o.a); ctx.lineWidth = 2.5 * s; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(hx + sd * 62 * s, hy - 2 * s);
      ctx.lineTo(hx + sd * 78 * s, hy + 30 * s); ctx.lineTo(hx + sd * 70 * s, hy + 52 * s); ctx.lineTo(hx + sd * 88 * s, hy + 84 * s); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(hx + 4 * s, hy - 34 * s); ctx.lineTo(hx - 8 * s, hy - 70 * s); ctx.lineTo(hx + 6 * s, hy - 96 * s); ctx.lineTo(hx - 4 * s, hy - 128 * s); ctx.stroke();
  });
}
function devilGrin(t, o) {           // too wide, glowing, full of teeth; o.scream opens it
  const sc = o.scream || 0;
  if (o.grin <= .02 && sc <= .02) return;
  const [hx, hy] = devilHead(t, o), s = DEVIL.s, w = 180 * s * (.6 + .4 * Math.max(o.grin, sc)) * (1 - .25 * sc), d = s * (62 * o.grin + 120 * sc);
  const up = u => -6 * s + (d * .25 + 3 * s) * (1 - Math.pow(2 * u / w, 2));
  const lo = u => -6 * s + (d * .8 + 3 * s) * (1 - Math.pow(2 * u / w, 2));
  ctx.save(); ctx.translate(hx + 8 * s, hy + 62 * s); ctx.rotate(-.12);
  ctx.beginPath(); ctx.moveTo(-w / 2, -6 * s); ctx.quadraticCurveTo(0, d * .5, w / 2, -6 * s); ctx.quadraticCurveTo(0, d * 1.6, -w / 2, -6 * s);
  const g = ctx.createLinearGradient(0, -6 * s, 0, d * 1.2);
  g.addColorStop(0, rgba([255, 90, 40], .95 * o.a)); g.addColorStop(1, rgba([80, 0, 6], .95 * o.a));
  ctx.fillStyle = g; ctx.fill(); ctx.clip();
  ctx.fillStyle = rgba([240, 226, 200], o.a);
  for (let i = 0; i < 13; i++) {
    const u = -w / 2 + (i + .5) * w / 13, hw = w / 30;
    ctx.beginPath(); ctx.moveTo(u - hw, up(u) - 3 * s); ctx.lineTo(u + hw, up(u) - 3 * s); ctx.lineTo(u + (rnd(i + 50) - .5) * 4 * s, up(u) + 20 * s * o.grin * (.55 + .9 * rnd(i + 51))); ctx.fill();
    ctx.beginPath(); ctx.moveTo(u - hw, lo(u) + 3 * s); ctx.lineTo(u + hw, lo(u) + 3 * s); ctx.lineTo(u + (rnd(i + 70) - .5) * 4 * s, lo(u) - 17 * s * o.grin * (.55 + .9 * rnd(i + 71))); ctx.fill();
  }
  ctx.restore();
  additive(() => glow(SPR.red, hx, hy + 62 * s + d * .6, 150 * s, .5 * o.a * o.grin));
}
function devilSmoke(t, a) {          // black smoke eating the room, and embers rising through it
  const { x, y, s } = DEVIL;
  for (let i = 0; i < 70; i++) {
    const life = 3 + rnd(i + 3000) * 3, age = (t + rnd(i + 3001) * life) % life, k = age / life, ang = rnd(i + 3002) * Math.PI * 2;
    ctx.fillStyle = `rgba(0,0,0,${.34 * a * Math.sin(Math.PI * k)})`;
    ctx.beginPath(); ctx.arc(x + Math.cos(ang) * (230 + 170 * k) * s, y - 520 * s + Math.sin(ang) * (480 + 120 * k) * s - k * 120 * s,
      (60 + rnd(i + 3003) * 90) * s * (.6 + k), 0, Math.PI * 2); ctx.fill();
  }
  additive(() => { for (let i = 0; i < 46; i++) {
    const life = 2 + rnd(i + 3100) * 2, age = (t + rnd(i + 3101) * life) % life, k = age / life;
    glow(i % 3 ? SPR.red : SPR.amber, x + (rnd(i + 3102) - .5) * 760 * s + Math.sin(t * 2 + i) * 20, y - 200 * s - k * 820 * s, 6 + rnd(i) * 9, a * Math.sin(Math.PI * k));
  } });
}
// the whole devil in the current framing [z, cx, cy]; o: a (presence), eyes, grin, reach, lean, scream, smoke (0-1)
function drawDevil(t, fr, o) {
  const [z, cx, cy] = fr;
  dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, OUT.w, OUT.h);
  const zz = z * PUSH, k = VP.k;
  dctx.setTransform(zz * k, 0, 0, zz * k, (PC[0] * (1 - PUSH) + PUSH * W / 2 - cx * zz + SHX) * k + VP.x, (PC[1] * (1 - PUSH) + PUSH * H / 2 - cy * zz + SHY) * k + VP.y);
  devilBody(dctx, t, o);
  cam(z, cx, cy);
  additive(() => glow(SPR.red, DEVIL.x, DEVIL.y - 560 * DEVIL.s, 1100 * DEVIL.s, .35 * o.a * (.8 + .2 * Math.sin(t * 6))));   // the aura's heat
  devilSmoke(t, o.a * (o.smoke ?? 1));
  px();
  ctx.save(); ctx.globalAlpha = o.a;
  ctx.shadowColor = 'rgba(255,24,32,.95)'; ctx.shadowBlur = 70 * Math.min(z, 1.6) * k; ctx.drawImage(DEV, 0, 0);   // red rim
  ctx.shadowBlur = 0;
  const sh = 40 * k;
  for (let i = 0; i * sh < OUT.h; i++) {     // heat shimmer: the body wavers in strips
    const sy = i * sh, dx = Math.sin(t * 7 + i * .9) * 5 * o.a * k;
    ctx.drawImage(DEV, 0, sy, OUT.w, sh, dx, sy, OUT.w, sh);
  }
  ctx.restore();
  cam(z, cx, cy);
}
function redEyes(x, y, sz, a) {      // two burning slits, for when only its eyes show
  if (a <= .01) return;
  additive(() => { for (const sd of [-1, 1]) glow(SPR.red, x + sd * sz * 1.5, y, sz * 3.4, .9 * a); });
  ctx.fillStyle = rgba([255, 240, 225], a);
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.translate(x + sd * sz * 1.5, y); ctx.rotate(-sd * .38);
    ctx.beginPath(); ctx.ellipse(0, 0, sz, sz * .26, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}
function tether(t, from, to, a) {   // smoke running out of his back into it: it lives in him, it feeds on him
  if (a <= .02) return;
  for (let i = 0; i < 28; i++) {
    const k = (i / 28 + t * .35) % 1, x = lerp(from[0], to[0], k) + Math.sin(k * 9 + t * 3) * 18, y = lerp(from[1], to[1], k) + Math.cos(k * 7 + t * 2) * 14;
    ctx.fillStyle = `rgba(0,0,0,${.5 * a * Math.sin(Math.PI * k)})`; ctx.beginPath(); ctx.arc(x, y, 24 + 16 * Math.sin(Math.PI * k), 0, Math.PI * 2); ctx.fill();
  }
  additive(() => { for (let i = 0; i < 14; i++) { const k = (i / 14 + t * .5) % 1; glow(SPR.red, lerp(from[0], to[0], k), lerp(from[1], to[1], k), 46, .3 * a * Math.sin(Math.PI * k)); } });
}
