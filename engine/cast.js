'use strict';
// The cast: the man (a dark silhouette of round-capped strokes with a cream face that acts, lit by the light he is
// in) and the devil, the Shadow Twin (a much taller, horned, grinning copy of him in black inside a hot red edge; the
// owner's pick of 31 Oct 2026). Don't redesign them: every film and Short uses these two. Coordinates are world px of
// the set being drawn (cam() frames them).

// ---------- the man ----------
function limb(pts, w) {
  ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}
const SPR_OF = {};
const sprOf = c => { const k = c.map(v => v | 0).join(','); return SPR_OF[k] || (SPR_OF[k] = sprite(c)); };
// He is lit, not a hole in the picture (the owner, 31 Oct 2026: "black figure on black background is a bad idea"): the
// light he is lit by also falls on the wall behind him (back), his rim is the same shape a little larger, nudged toward
// the light and glowing, and each limb carries a lighter band on the lit side, the head a sheen.
function drawPerson(P, fill, rim, rimA, lx = 0, ly = -1, back = true) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.hypot(lx, ly) || 1, ux = lx / n, uy = ly / n, hi = mix(fill, rim, .3), ha = Math.min(1, rimA * 1.3);
  if (back && rimA > .003) {
    const b = poseBox(P, 0), R = Math.max(b[2] - b[0], b[3] - b[1]);
    additive(() => glow(sprOf(rim), (b[0] + b[2]) / 2 + ux * R * .12, (b[1] + b[3]) / 2 + uy * R * .12, R * 1.2, .22 * rimA));
  }
  if (rimA > .003) {
    ctx.save(); ctx.shadowColor = rgba(rim, Math.min(1, rimA)); ctx.shadowBlur = 16 * pxPerUnit(ctx);
    ctx.strokeStyle = ctx.fillStyle = rgba(rim, Math.min(1, rimA * 1.35));
    for (const [pts, w] of P.parts) limb(pts.map(p => [p[0] + ux * 5, p[1] + uy * 5]), w + 5);
    ctx.beginPath(); ctx.arc(P.head[0] + ux * 5, P.head[1] + uy * 5, P.head[2] + 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  for (const [pts, w] of P.parts) {
    ctx.strokeStyle = rgba(fill); limb(pts, w);
    if (rimA > .003) { ctx.strokeStyle = rgba(hi, .5 * ha); limb(pts.map(p => [p[0] + ux * w * .22, p[1] + uy * w * .22]), w * .26); }
  }
  const [hx, hy, r] = P.head;
  ctx.fillStyle = rgba(fill); ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  if (rimA > .003) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.clip();
    const gx = hx + ux * r * .5, gy = hy + uy * r * .5 - r * .2, g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 1.25);
    g.addColorStop(0, rgba(hi, .75 * ha)); g.addColorStop(1, rgba(hi, 0));
    ctx.fillStyle = g; ctx.fillRect(hx - r, hy - r, 2 * r, 2 * r);
    ctx.restore();
    specular(ctx, hx - r * .35 + ux * r * .3, hy - r * .55, r * .3, r * .12, -.5, .16 * ha);
  }
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
  const eyeList = [[x + r * lerp(-.37, .25, turn), .28 * r, 1], [x + r * lerp(.37, .71, turn), .28 * r * lerp(1, .7, turn), -1]];
  for (const [cx, ew, side] of eyeList) {
    const eh = .17 * r * open, px = cx + ex.gx * ew * .22, py = ey + ex.gy * eh * .35;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, ey, ew / 2, eh / 2 + .002 * r, 0, 0, Math.PI * 2);
    ctx.fillStyle = rgba(col, fa * .95); ctx.fill(); ctx.clip();
    ctx.fillStyle = rgba([14, 11, 13], Math.min(1, fa * 1.1));
    ctx.beginPath(); ctx.arc(px, py, .078 * r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([255, 255, 255], fa * .9);
    ctx.beginPath(); ctx.arc(px + .03 * r, py - .03 * r, .022 * r, 0, Math.PI * 2); ctx.fill();
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
  night: { bg: [[22, 24, 42], [46, 34, 64]], fill: [6, 5, 8], light: [255, 176, 196], la: .3, lc: [.45, .75], glow: 'red', gl: [1220, 1080], ga: .55, rim: [190, 160, 255], turn: .9 },
  grey: { bg: [[42, 44, 52], [70, 72, 80]], fill: [9, 9, 11], light: [196, 200, 210], la: .16, lc: [-.6, -.3], glow: 'grey', gl: [260, 260], ga: .25, rim: [196, 200, 210], turn: .75, featA: .72 },
  red: { bg: [[34, 5, 9], [96, 10, 18]], fill: [8, 4, 6], light: [255, 96, 96], la: .32, lc: [.3, .8], glow: 'red', gl: [960, 1180], ga: .55, rim: [255, 110, 110], turn: .9 },
  sun: { bg: [[226, 142, 112], [255, 214, 160]], fill: [24, 14, 20], light: [255, 214, 150], la: .42, lc: [.8, -.1], glow: 'gold', gl: [1760, 460], ga: .65, rim: [255, 226, 170], turn: .85 },
  shower: { bg: [[40, 54, 70], [86, 104, 126]], fill: [10, 12, 16], light: [210, 230, 255], la: .3, lc: [0, -.8], glow: 'blue', gl: [960, -100], ga: .5, rim: [200, 225, 255], turn: .8 },
  lamp: { bg: [[54, 36, 22], [98, 64, 38]], fill: [16, 10, 8], light: [255, 200, 140], la: .4, lc: [.7, -.2], glow: 'amber', gl: [1600, 500], ga: .45, rim: [255, 200, 140], turn: .85 },
  dawn: { bg: [[60, 70, 90], [140, 130, 120]], fill: [12, 12, 16], light: [255, 220, 180], la: .38, lc: [-.6, -.4], glow: 'amber', gl: [300, 200], ga: .45, rim: [255, 220, 180], turn: .85 },
  gym: { bg: [[42, 38, 40], [78, 64, 54]], fill: [12, 10, 10], light: [255, 200, 140], la: .4, lc: [.2, -.9], glow: 'amber', gl: [960, -60], ga: .55, rim: [255, 210, 150], turn: .85 }
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
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();      // the gloss of his head, from the light
  const gx = x + L.lc[0] * r * .55, gy = y + L.lc[1] * r * .4 - r * .25, gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 1.3);
  gg.addColorStop(0, rgba(mix(L.fill, L.rim, .32), .8)); gg.addColorStop(1, rgba(mix(L.fill, L.rim, .32), 0));
  ctx.fillStyle = gg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  specular(ctx, x - r * .38, y - r * .58, r * .32, r * .12, -.5, .14);
  face(x, y, r, ex || exprAt(t), { turn: L.turn, light: L.light, la: L.la, lc: L.lc, featA: L.featA });
}
const faceBox = t => { const [x, y, r] = FACE_XY(t); return [x - r * 1.25, y - r * 1.2, x + r * 1.25, y + r * 1.75]; };

// ---------- drawing helpers (the man's sheen and the devil's horns use them) ----------
const pxPerUnit = g => Math.hypot(g.getTransform().a, g.getTransform().b);
function specular(g, x, y, rx, ry, rot, a) {   // a soft white highlight on a glossy head
  if (a <= .01) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
  const sg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  sg.addColorStop(0, `rgba(255,248,250,${a})`); sg.addColorStop(1, 'rgba(255,248,250,0)');
  g.fillStyle = sg; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
}
// a tapered strip along a polyline: pts [[x, y], …], half-widths ws (one per point); returns its outline points
function stripPts(pts, ws) {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
    L.push([pts[i][0] - dy * ws[i], pts[i][1] + dx * ws[i]]); R.push([pts[i][0] + dy * ws[i], pts[i][1] - dx * ws[i]]);
  }
  return [...L, ...R.reverse()];
}
const bez3 = (P, u) => { const v = 1 - u; return [0, 1].map(j => v * v * v * P[0][j] + 3 * v * v * u * P[1][j] + 3 * v * u * u * P[2][j] + u * u * u * P[3][j]); };
const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// ---------- the devil: the Shadow Twin ----------
// Chosen by the owner on 31 Oct 2026 from ten designs (design/devils-2026-10-31/, number 1), after "devil is also not
// looking good": a dark, much taller copy of him. His own round head and stick body, stretched thin and tall, two short
// sharp horns, burning slanted eyes and a grin far too wide, full of white teeth. The devil he feeds is himself. Pure
// black inside a hot red edge, and it throws red light on the wall behind it, so it reads against any set (the owner:
// "black figure on black background is a bad idea"). Every film and Short uses it, through the names below.
const DEVIL = { x: 790, y: 1080, s: 1 };           // its base: its feet stand at y - 200·s
// where it stands in the bedroom, night by night: [x, y, scale]. At the window it stands by the glass; with its feet
// above the floor line it is outside, seen only through the glass; standing over the bed, the bed hides its legs.
const SPOTS = { window: [430, 980, .6], foot: [1390, 1060, .8], beside: [1120, 1050, .9], behind: [790, 1080, 1], chase: [150, 1180, .75] };
function placeDevil(spot) { [DEVIL.x, DEVIL.y, DEVIL.s] = Array.isArray(spot) ? spot : SPOTS[spot]; }
// o: a (presence), eyes, grin, reach (its hands on his shoulders), lean (over him), scream, stride (radians: it runs),
// targets (where the hands go), smoke (embers, 0-1)
const devilO = o => Object.assign({ a: 0, eyes: 0, grin: 0, reach: 0, lean: 0, scream: 0 }, o);
const sway = t => Math.sin(t * 1.7) * 6 * DEVIL.s;
function devilHead(t, o) {
  const { x, y, s } = DEVIL;
  return [x + (40 + 60 * o.lean) * s + sway(t), y - 830 * s + o.lean * 40 * s];
}
const TWIN = { R: 64, shoulders: -712, hips: -500, knees: -350, feet: -200, torso: 52, neck: 32, arm: 22, leg: 26, finger: 7 };
const TWIN_COL = { rim: [255, 58, 40], edge: [100, 10, 12], body: [9, 4, 6] };
const DEVIL_FACE_ZOOM = 2.3;      // its head is his size, not the old devil's: close-ups go this much closer
const headTilt = o => -.16 - .18 * o.lean;
// the box its head, horns and grin fill, with its shoulders, in world px (a Short frames the devil by it)
const devilBox = (t, o) => { const [hx, hy] = devilHead(t, o), s = DEVIL.s; return [hx - 170 * s, hy - 150 * s, hx + 170 * s, hy + 200 * s]; };
// a point of its head (head units: R = 64, x right, y down, before the tilt) in world px
function headPt(t, o, u, v) {
  const [hx, hy] = devilHead(t, o), a = headTilt(o), s = DEVIL.s;
  return [hx + (u * Math.cos(a) - v * Math.sin(a)) * s, hy + (u * Math.sin(a) + v * Math.cos(a)) * s];
}
const devilMouth = (t, o) => headPt(t, o, 0, 30);
function inHead(g, t, o, fn) {        // draw fn in the head's own frame (head units)
  const [hx, hy] = devilHead(t, o);
  g.save(); g.translate(hx, hy); g.rotate(headTilt(o)); g.scale(DEVIL.s, DEVIL.s); fn(); g.restore();
}
const ARM_TARGETS = [[905, 612], [1004, 690]];
const reachFront = o => inv(.2, .45, o.reach);       // reaching hands come in front of him, resting ones stay behind
// its joints now, in world px: the head from devilHead, the body hunched toward it, arms hanging or reaching
function twinPose(t, o) {
  const { x, y, s } = DEVIL, tw = sway(t), [hx, hy] = devilHead(t, o), R = TWIN.R * s, br = Math.sin(t * 1.6) * 3 * s;
  const sc = [x + (14 + 34 * o.lean) * s + tw * .8, y + (TWIN.shoulders + 34 * o.lean) * s + br];   // between the shoulders
  const hc = [x + tw * .3, y + TWIN.hips * s];                                                     // between the hips
  const chin = headPt(t, o, -4, 52);
  const legs = [-1, 1].map(sd => {
    const run = o.stride != null, ph = run ? o.stride + (sd > 0 ? Math.PI : 0) : 0;
    const sw = run ? Math.sin(ph) : 0, lift = run ? Math.max(0, Math.cos(ph)) : 0;
    const hip = [hc[0] + sd * 14 * s, hc[1]];
    const knee = [hip[0] + sd * 10 * s + sw * 64 * s + (run ? 26 * s * lift : 0), y + TWIN.knees * s - lift * 34 * s];
    const foot = [hip[0] + sd * 16 * s + sw * 118 * s, y + TWIN.feet * s - lift * 54 * s];
    return { hip, knee, foot, toe: [foot[0] + (run ? 30 : sd * 22) * s, foot[1] + 3 * s] };
  });
  const targets = o.targets || ARM_TARGETS;
  const arms = [-1, 1].map((sd, i) => {
    const sh = [sc[0] + sd * 34 * s, sc[1] + 10 * s], rest = [sh[0] + sd * 30 * s, y - 420 * s];
    const run = o.stride != null ? Math.sin(o.stride + (sd > 0 ? 0 : Math.PI)) * 60 * s : 0;
    const wr = [lerp(rest[0] + run, targets[i][0], o.reach), lerp(rest[1], targets[i][1] - 20, o.reach)];
    const el = [(sh[0] + wr[0]) / 2 + sd * (40 + 50 * o.reach) * s, (sh[1] + wr[1]) / 2 - 110 * s * o.reach];
    // four long fingers, bent at the knuckle, each ending in a hooked claw; hanging, they point down and a little out
    const fa = Math.atan2(wr[1] - el[1], wr[0] - el[0]), fingers = [];
    for (let f = 0; f < 4; f++) {
      const ang = lerp(fa, Math.PI / 2 + sd * .12, .45 * (1 - o.reach)) + (f - 1.5) * .26 + Math.sin(t * 3 + f + i) * .04;
      const L = (66 + (f % 2) * 12) * s, curl = -sd * (.42 + .25 * o.reach);
      const k1 = [wr[0] + Math.cos(ang) * L * .56, wr[1] + Math.sin(ang) * L * .56];
      const k2 = [k1[0] + Math.cos(ang + curl) * L * .44, k1[1] + Math.sin(ang + curl) * L * .44];
      fingers.push({ k1, k2, ca: ang + curl * 1.7 });
    }
    return { sd, sh, el, wr, fingers };
  });
  return { hx, hy, R, sc, hc, chin, legs, arms };
}
// every part of it as a painter: part(g, grow) paints the part grown by grow px on every side
function twinParts(t, o, P, which = 'all') {
  const s = DEVIL.s, parts = [];
  const line = (pts, w) => parts.push((g, k) => {
    g.lineWidth = w + 2 * k; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.stroke();
  });
  const shape = pts => parts.push((g, k) => {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) g.lineTo(q[0], q[1]); g.closePath();
    if (k > 0) { g.lineWidth = 2 * k; g.stroke(); } g.fill();
  });
  const disc = (c, r) => parts.push((g, k) => { g.beginPath(); g.arc(c[0], c[1], r + k, 0, Math.PI * 2); g.fill(); });
  if (which !== 'arms') {
    for (const L of P.legs) { line([L.hip, L.knee, L.foot], TWIN.leg * s); line([L.foot, L.toe], TWIN.leg * .8 * s); }
    const mid = [lerp(P.hc[0], P.sc[0], .55) + (8 + 14 * o.lean) * s, lerp(P.hc[1], P.sc[1], .55)];
    line([P.hc, mid, P.sc], TWIN.torso * s);
    line([[P.sc[0] - 34 * s, P.sc[1] + 10 * s], P.sc, [P.sc[0] + 34 * s, P.sc[1] + 10 * s]], TWIN.arm * 1.15 * s);   // shoulders
    line([P.sc, lerp2(P.sc, P.chin, .5), P.chin], TWIN.neck * s);
  }
  for (const A of P.arms) {
    line([A.sh, A.el], TWIN.arm * s); line([A.el, A.wr], TWIN.arm * .82 * s);
    disc(A.wr, 11 * s);
    for (const F of A.fingers) {
      line([A.wr, F.k1, F.k2], TWIN.finger * s);
      const c = [Math.cos(F.ca), Math.sin(F.ca)], n = [-c[1], c[0]], w = 3.6 * s, L = 17 * s;   // the claw
      shape([[F.k2[0] + n[0] * w, F.k2[1] + n[1] * w], [F.k2[0] + c[0] * L * .6 + n[0] * w * .5, F.k2[1] + c[1] * L * .6 + n[1] * w * .5],
        [F.k2[0] + c[0] * L, F.k2[1] + c[1] * L], [F.k2[0] - n[0] * w, F.k2[1] - n[1] * w]]);
    }
  }
  if (which !== 'arms') {
    disc([P.hx, P.hy], P.R);
    for (const sd of [-1, 1]) {        // two short horns: up from the crown, leaning out, the tips turning up
      const C = [[sd * 28, -54], [sd * 46, -72], [sd * 68, -92], [sd * 62, -126]], pts = [], ws = [];
      for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push(bez3(C, u)); ws.push(11.5 * Math.pow(1 - u, .8) + .6); }
      shape(stripPts(pts, ws).map(([u, v]) => headPt(t, o, u, v)));
    }
  }
  return parts;
}
// paint parts as one silhouette: a hot red edge, a dark red line inside it, then black
function silhouette(g, parts) {
  const s = DEVIL.s;
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [col, k] of [[TWIN_COL.rim, 3.6 * s], [TWIN_COL.edge, 1.3 * s], [TWIN_COL.body, 0]]) {
    g.strokeStyle = g.fillStyle = rgba(col);
    for (const p of parts) p(g, k);
  }
}
// its arms alone, for the hands that come in front of him (devilArms), on their own layer
const DEVA = document.createElement('canvas'); DEVA.width = W; DEVA.height = H;
const actx = DEVA.getContext('2d');
let ROOM_FRAME = -1, FRAME_NO = 0;      // drawRoom marks the frames that show the bedroom
function devilBody(g, t, o) {          // the whole figure, into its own layer (g has the world transform)
  const P = twinPose(t, o), s = DEVIL.s;
  silhouette(g, twinParts(t, o, P));
  if (ROOM_FRAME === FRAME_NO) {
    const feetY = DEVIL.y + TWIN.feet * s, fx = DEVIL.x;
    g.save();
    if (feetY < 840) { g.globalCompositeOperation = 'destination-in'; g.fillStyle = '#000'; g.fillRect(300, 220, 260, 290); }   // outside: only through the glass
    else if (fx > BED.x0 - 40 && fx < BED.x1 + 20) {       // behind the bed: the bed hides its legs, feet and all
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
      const cut = bedSilhouette(); cut.rect(BED.x0 - 30, BED.y + 20, BED.x1 - BED.x0 + 50, 900); g.fill(cut);
    }
    g.restore();
  }
  return P;
}
// the hands in front of him: its arms, drawn again over him once they reach (the arm layer from drawDevil)
function devilArms(t, o) {
  const f = reachFront(o);
  if (f <= .01 || o.a <= .01) return;
  ctx.save(); px(); ctx.globalAlpha = Math.min(1, o.a * f);
  ctx.shadowColor = 'rgba(255,40,30,.9)'; ctx.shadowBlur = 30 * VP.k; ctx.drawImage(DEVA, 0, 0);
  ctx.restore();
}
function eyeShape(g, sd, e) {          // a burning slit: a straight top edge falling to the inner corner, a curved lower lid
  const p = new Path2D();
  p.moveTo(sd * 5, 3); p.lineTo(sd * 38, -6 - 8 * e); p.quadraticCurveTo(sd * 31, 5 + 9 * e, sd * 5, 3); p.closePath();
  const gr = g.createRadialGradient(sd * 22, -2, 0, sd * 22, -2, 24);
  gr.addColorStop(0, `rgba(255,250,232,${e})`); gr.addColorStop(.4, `rgba(255,190,110,${e})`); gr.addColorStop(1, `rgba(255,48,30,${e})`);
  g.fillStyle = gr; g.fill(p);
}
function devilEyes(t, o) {
  const e = o.eyes, s = DEVIL.s, fl = .86 + .14 * Math.sin(t * 23) * Math.sin(t * 7);
  if (e <= .01) return;
  additive(() => { for (const sd of [-1, 1]) {
    const [ex, ey] = headPt(t, o, sd * 22, -4);
    glow(SPR.red, ex, ey, 56 * s, .95 * e * fl); glow(SPR.amber, ex, ey, 18 * s, .9 * e * fl);
  } });
  inHead(ctx, t, o, () => { for (const sd of [-1, 1]) eyeShape(ctx, sd, e * fl); });
}
function devilGrin(t, o) {             // far too wide, full of white teeth; o.scream opens it
  const sc = o.scream || 0, gr = Math.max(o.grin, sc);
  if (gr <= .02) return;
  const w = 50 * (.72 + .28 * gr) * (1 - .18 * sc), y0 = 12 - 6 * gr, d = 24 * o.grin + 70 * sc, s = DEVIL.s;
  const top = u => y0 + 22 * (1 - Math.pow(u / w, 2)), bot = u => y0 + (22 + d) * (1 - Math.pow(u / w, 2));
  inHead(ctx, t, o, () => {
    const m = new Path2D(); m.moveTo(-w, y0); m.quadraticCurveTo(0, y0 + 44, w, y0); m.quadraticCurveTo(0, y0 + 44 + 2 * d, -w, y0); m.closePath();
    ctx.save();
    const g = ctx.createLinearGradient(0, y0, 0, y0 + 22 + d);
    g.addColorStop(0, rgba([255, 120, 50], o.a || 1)); g.addColorStop(1, rgba([90, 0, 8], o.a || 1));
    ctx.fillStyle = g; ctx.fill(m); ctx.clip(m);
    const n = 15, al = Math.max(o.a, gr);
    for (let i = 0; i < n; i++) {        // ivory teeth from both lips, interlocking
      const u = -w + (i + .5) * 2 * w / n, hw = w / n * 1.04, edge = 1 - Math.pow(u / w, 2);
      const tgr = ctx.createLinearGradient(0, top(u) - 4, 0, bot(u));
      tgr.addColorStop(0, rgba([255, 250, 240], al)); tgr.addColorStop(1, rgba([226, 200, 186], al));
      ctx.fillStyle = tgr;
      ctx.beginPath(); ctx.moveTo(u - hw, top(u) - 6); ctx.lineTo(u + hw, top(u) - 6); ctx.lineTo(u + (rnd(i + 50) - .5) * 2, top(u) + (8 + 6 * rnd(i + 51)) * (.6 + .4 * edge) * (1 + .6 * sc)); ctx.fill();
      ctx.beginPath(); ctx.moveTo(u - hw, bot(u) + 6); ctx.lineTo(u + hw, bot(u) + 6); ctx.lineTo(u + (rnd(i + 70) - .5) * 2, bot(u) - (7 + 6 * rnd(i + 71)) * (.6 + .4 * edge) * (1 + .6 * sc)); ctx.fill();
    }
    ctx.restore();
  });
  const [mx, my] = devilMouth(t, o);
  additive(() => glow(SPR.red, mx, my, 70 * s, .5 * gr));
}
// embers rising round it
function devilSmoke(t, a) {
  if (a <= .01) return;
  const { x, y, s } = DEVIL;
  additive(() => { for (let i = 0; i < 26; i++) {
    const life = 2 + rnd(i + 3100) * 2, age = (t + rnd(i + 3101) * life) % life, k = age / life;
    glow(i % 3 ? SPR.red : SPR.amber, x + (rnd(i + 3102) - .5) * 520 * s + Math.sin(t * 2 + i) * 16 * s, y - 220 * s - k * 760 * s, (5 + rnd(i) * 7) * s, a * Math.sin(Math.PI * k));
  } });
}
// the whole devil in the current framing [z, cx, cy]
function drawDevil(t, fr, o) {
  const [z, cx, cy] = fr, s = DEVIL.s, zz = z * PUSH, k = VP.k;
  const T = [zz * k, 0, 0, zz * k, (PC[0] * (1 - PUSH) + PUSH * W / 2 - cx * zz + SHX) * k + VP.x, (PC[1] * (1 - PUSH) + PUSH * H / 2 - cy * zz + SHY) * k + VP.y];
  for (const g of [dctx, actx]) {
    if (g.canvas.width !== OUT.w || g.canvas.height !== OUT.h) { g.canvas.width = OUT.w; g.canvas.height = OUT.h; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, OUT.w, OUT.h); g.setTransform(...T);
  }
  const P = devilBody(dctx, t, o);
  if (reachFront(o) > .01) silhouette(actx, twinParts(t, o, P, 'arms'));
  cam(z, cx, cy);
  const pulse = .85 + .15 * Math.sin(t * 6), mid = lerp2(P.sc, P.hc, .3);
  additive(() => {                     // its own red light on whatever is behind it
    glow(SPR.red, mid[0], mid[1], 900 * s, .42 * o.a * pulse);
    glow(SPR.red, P.hx, P.hy + 40 * s, 360 * s, .42 * o.a * pulse);
    if (DEVIL.y + TWIN.feet * s >= 840 && !(ROOM_FRAME === FRAME_NO && DEVIL.x > BED.x0 - 40 && DEVIL.x < BED.x1 + 20)) {
      const fy = DEVIL.y + TWIN.feet * s; ctx.save(); ctx.translate(DEVIL.x, fy); ctx.scale(1, .22);
      glow(SPR.red, 0, 0, 420 * s, .5 * o.a); ctx.restore();          // a pool of red on the floor round its feet
    }
  });
  devilSmoke(t, o.a * (o.smoke ?? 1));
  ctx.save(); px(); ctx.globalAlpha = o.a;
  ctx.shadowColor = 'rgba(255,40,30,.95)'; ctx.shadowBlur = 44 * Math.min(z, 1.6) * k; ctx.drawImage(DEV, 0, 0);   // the outer glow
  ctx.restore();
  cam(z, cx, cy);
}
function redEyes(x, y, sz, a) {        // its eyes alone, burning in the dark; sz: half the gap between them
  if (a <= .01) return;
  const k = sz / 16;
  additive(() => { for (const sd of [-1, 1]) { glow(SPR.red, x + sd * sz * 1.5, y, sz * 3.6, .9 * a); glow(SPR.amber, x + sd * sz * 1.5, y, sz * 1.1, .8 * a); } });
  ctx.save(); ctx.translate(x, y); ctx.scale(k * 1.1, k * 1.1); ctx.translate(0, 4);
  for (const sd of [-1, 1]) eyeShape(ctx, sd, a);
  ctx.restore();
}
// smoke running out of his back into it: it lives in him, it feeds on him
const SMOKE = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 160;
  const g = c.getContext('2d');
  for (let i = 0; i < 9; i++) {
    const x = 80 + (rnd(i + 7000) - .5) * 60, y = 80 + (rnd(i + 7001) - .5) * 50, r = 30 + rnd(i + 7002) * 34;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, 'rgba(14,4,6,.5)'); rg.addColorStop(1, 'rgba(14,4,6,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 160, 160);
  }
  return c;
})();
function tether(t, from, to, a) {
  if (a <= .02) return;
  for (let i = 0; i < 24; i++) {
    const k = (i / 24 + t * .35) % 1, x = lerp(from[0], to[0], k) + Math.sin(k * 9 + t * 3) * 18, y = lerp(from[1], to[1], k) + Math.cos(k * 7 + t * 2) * 14;
    const r = 30 + 22 * Math.sin(Math.PI * k);
    ctx.globalAlpha = .8 * a * Math.sin(Math.PI * k); ctx.drawImage(SMOKE, x - r, y - r, 2 * r, 2 * r);
  }
  ctx.globalAlpha = 1;
  additive(() => { for (let i = 0; i < 18; i++) { const k = (i / 18 + t * .5) % 1; glow(SPR.red, lerp(from[0], to[0], k), lerp(from[1], to[1], k), 34, .26 * a * Math.sin(Math.PI * k)); } });
}
