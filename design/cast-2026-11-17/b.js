'use strict';
/* b.js  INK AND BONE: the Gentleman.
   Graphic noir: every form is two or three flat tones with hard edges plus a crisp rim of the scene's light.
   Figures are rigs: dad(o), lily(o), devil(o) take position, scale, pose, expression (and the devil's size stage).
   Heads can be drawn alone: dadHead(o), lilyHead(o), devilHead(o). Light is set per figure with setLight(). */

// ---------- palette (RGB) ----------
const INK = [14, 11, 18], BONE = [240, 232, 216], BLOOD = [178, 24, 32], EMBER = [255, 82, 36];
const SUIT = [24, 20, 32], SATIN = [84, 74, 108], HORN = [46, 16, 24];
const SKIN = [228, 178, 144], HAIR = [38, 28, 30], SHIRT = [238, 234, 226], TIE = [40, 44, 72], TROU = [44, 46, 66];
const YEL = [248, 198, 36], LSKIN = [238, 194, 164], LHAIR = [46, 30, 28];

// ---------- light: one key direction, one shadow colour, one rim colour per figure ----------
const LT0 = { dir: 1, key: [1, 1, 1], sh: [46, 38, 70], shK: .6, rim: [255, 244, 226], rimW: 1 };
let LT = Object.assign({}, LT0);
function setLight(o) { LT = Object.assign({}, LT0, o); }
const lit = c => [Math.min(255, c[0] * LT.key[0]), Math.min(255, c[1] * LT.key[1]), Math.min(255, c[2] * LT.key[2])];
const shd = (c, k) => mix(lit(c), LT.sh, k ?? LT.shK);

// ---------- Path2D builders ----------
// smooth path through points; a point [x, y, 1] is a sharp corner
function P(pts, tension = .5, close = true) {
  const p = new Path2D(), n = pts.length, G = i => close ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)], k = tension / 3;
  p.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = G(i - 1), p1 = G(i), p2 = G(i + 1), p3 = G(i + 2), k1 = p1[2] ? 0 : k, k2 = p2[2] ? 0 : k;
    p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k1, p1[1] + (p2[1] - p0[1]) * k1, p2[0] - (p3[0] - p1[0]) * k2, p2[1] - (p3[1] - p1[1]) * k2, p2[0], p2[1]);
  }
  if (close) p.closePath(); return p;
}
function PL(pts) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; }
// a tapering limb along a smooth curve, as one outline with round caps
function TP(pts, widths, cap = true) {
  const S = [], n = pts.length;
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < 10; j++) {
    const u = j / 10, p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const h = (a, b, c, d) => { const t2 = u * u, t3 = t2 * u; return .5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); };
    S.push([h(p0[0], p1[0], p2[0], p3[0]), h(p0[1], p1[1], p2[1], p3[1]), lerp(widths[i], widths[i + 1], u) / 2]);
  }
  S.push([pts[n - 1][0], pts[n - 1][1], widths[n - 1] / 2]);
  const L = [], R = [], N = [];
  for (let i = 0; i < S.length; i++) {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = S[i][2];
    L.push([S[i][0] + nx * w, S[i][1] + ny * w]); R.push([S[i][0] - nx * w, S[i][1] - ny * w]); N.push([nx, ny]);
  }
  const p = new Path2D(), m = S.length - 1; p.moveTo(L[0][0], L[0][1]);
  for (const q of L) p.lineTo(q[0], q[1]);
  if (cap) for (let a = 1; a < 8; a++) { const t = a / 8 * Math.PI, e = S[m], nn = N[m], w = e[2]; p.lineTo(e[0] + w * (Math.cos(t) * nn[0] + Math.sin(t) * nn[1]), e[1] + w * (Math.cos(t) * nn[1] - Math.sin(t) * nn[0])); }
  for (let i = m; i >= 0; i--) p.lineTo(R[i][0], R[i][1]);
  if (cap) for (let a = 1; a < 8; a++) { const t = a / 8 * Math.PI, e = S[0], nn = N[0], w = e[2]; p.lineTo(e[0] - w * (Math.cos(t) * nn[0] + Math.sin(t) * nn[1]), e[1] - w * (Math.cos(t) * nn[1] - Math.sin(t) * nn[0])); }
  p.closePath(); return p;
}
function Q(a, c, b) { const p = new Path2D(); p.moveTo(a[0], a[1]); p.quadraticCurveTo(c[0], c[1], b[0], b[1]); return p; }
const qpt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
function lens(a, b, cT, cB) { const p = new Path2D(); p.moveTo(a[0], a[1]); p.quadraticCurveTo(cT[0], cT[1], b[0], b[1]); p.quadraticCurveTo(cB[0], cB[1], a[0], a[1]); p.closePath(); return p; }
const col = c => Array.isArray(c) ? rgba(c) : c;
function fillP(p, c, a = 1) { ctx.fillStyle = Array.isArray(c) ? rgba(c, a) : c; ctx.fill(p); }
function strokeP(p, w, c, a = 1) { ctx.lineWidth = w; ctx.strokeStyle = rgba(c, a); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(p); }
function clipP(p, fn) { ctx.save(); ctx.clip(p); fn(); ctx.restore(); }
// the part of a shape NOT covered by the same shape shifted (dx, dy): a hard crescent. Shift is given in screen
// direction and local length, so the light stays put when a limb or a hand rotates.
function crescent(p, dx, dy, c, a = 1) {
  const m = ctx.getTransform(), det = m.a * m.d - m.b * m.c, k = Math.sqrt(Math.abs(det)) / det;
  const lx = (m.d * dx - m.c * dy) * k, ly = (-m.b * dx + m.a * dy) * k;
  ctx.save(); ctx.clip(p); const q = new Path2D(); q.rect(-9000, -9000, 18000, 18000); q.addPath(p, new DOMMatrix([1, 0, 0, 1, lx, ly]));
  ctx.fillStyle = rgba(c, a); ctx.fill(q, 'evenodd'); ctx.restore();
}
// flat tone + shadow crescent (away from the key) or light crescent (toward it, for dark cloth) + rim on the far edge
function tone(p, base, o = {}) {
  fillP(p, base); const d = LT.dir;
  if (o.sh) crescent(p, d * o.sh, -o.sh * .35, o.shCol || mix(base, LT.sh, LT.shK));
  if (o.hi) crescent(p, -d * o.hi, o.hi * .35, o.hiCol);
  if (o.rim && LT.rimW) crescent(p, d * o.rim * LT.rimW, o.rim * .25 * LT.rimW, o.rimCol || LT.rim);
}
function teeth(a, b, cT, cB, n, hT, hB, c) {
  clipP(lens(a, b, cT, cB), () => {
    for (let i = 0; i < n; i++) {
      const g = .07 / n * 2, u0 = i / n + g, u1 = (i + 1) / n - g, k = .5 + .5 * Math.sin(Math.PI * (i + .5) / n);
      if (hT) { const p0 = qpt(a, cT, b, u0), p1 = qpt(a, cT, b, u1), h = hT * k; fillP(P([[p0[0], p0[1] - 3], [p1[0], p1[1] - 3], [p1[0] - .4, p1[1] + h * .8], [(p0[0] + p1[0]) / 2, Math.max(p0[1], p1[1]) + h], [p0[0] + .4, p0[1] + h * .8]], .5), c); }
      if (hB) { const p0 = qpt(a, cB, b, u0), p1 = qpt(a, cB, b, u1), h = hB * k; fillP(P([[p0[0], p0[1] + 3], [p1[0], p1[1] + 3], [p1[0] - .4, p1[1] - h * .8], [(p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - h], [p0[0] + .4, p0[1] - h * .8]], .5), c); }
    }
  });
}

// =====================================================================================================
// THE GENTLEMAN: head. Local units: crown -100, chin +118, face centre (0, 0).
// cute 0..1 (1 = thumb size: round, big eyes, horn nubs), horn = horn length factor.
// =====================================================================================================
const DEV_EX = {
  charm: { bi: 0, bo: 0, arch: 3, lidU: .32, lidL: .06, lidA: .1, look: [0, 0], mouth: 'smile', w: 1, liftL: 1, liftR: 1 },
  sly: { bi: 4, bo: -2, browR: -10, lidU: .5, lidL: .2, lidA: .2, look: [.75, .1], mouth: 'smile', w: .92, liftL: .1, liftR: 1.7 },
  plead: { bi: -14, bo: 8, arch: -2, lidU: 0, lidL: 0, lidA: -.32, eye: 1.32, look: [0, -.3], mouth: 'pout', wet: 1 },
  rage: { bi: 17, bo: -13, arch: 0, lidU: .3, lidL: .08, lidA: .5, fire: 1, look: [0, 0], mouth: 'roar' },
  grin: { bi: 5, bo: -5, lidU: .24, lidL: .1, lidA: .22, look: [0, 0], mouth: 'grin' },
  adore: { bi: -6, bo: 1, arch: 4, lidU: 0, lidL: 0, lidA: 0, eye: 1.08, look: [0, 0], mouth: 'smile', w: .8, liftL: 1.4, liftR: 1.4 },
  wait: { bi: 2, bo: 0, lidU: .45, lidL: .1, lidA: .1, look: [0, 0], mouth: 'smile', w: .7, liftL: .6, liftR: .6 },
};
function devilHead(o = {}) {
  const { x = 0, y = 0, s = 1, rot = 0, turn = 0, expr = 'charm', cute = 0, horn = 1, hat = 0 } = o;
  const E = Object.assign({ bi: 0, bo: 0, arch: 0, lidU: .3, lidL: .05, lidA: 0, eye: 1, look: [0, 0], w: 1, liftL: 1, liftR: 1, browL: 0, browR: 0 }, DEV_EX[expr] || {}, o.ex || {});
  if (o.look) E.look = o.look;
  at(x, y, s, rot, () => {
    const d = LT.dir, sd = -d, q = cute, c = turn * 13, wR = 1 - turn * .13, wL = 1 + turn * .13;
    const bone = lit(BONE), boneS = shd(BONE), sock = mix(INK, LT.sh, .32), hairC = mix(INK, LT.sh, .12);
    const half = [[0, -100], [40, -93], [58, -56], [62, -14], [56, 26], [42, 66], [25, 98], [0, 118]];
    const halfC = [[0, -92], [48, -84], [72, -46], [78, -4], [71, 38], [48, 74], [20, 93], [0, 98]];
    const hp = half.map((p, i) => [lerp(p[0], halfC[i][0], q), lerp(p[1], halfC[i][1], q)]), chinY = hp[7][1];
    const cs = y0 => c * .75 * inv(40, chinY, y0);   // the jaw swings with the turn
    const face = P(hp.map(p => [p[0] * wR + cs(p[1]), p[1]]).concat(hp.slice(1, -1).reverse().map(p => [-p[0] * wL + cs(p[1]), p[1]])), .5);
    // ears (pointed), behind the face
    for (const sg of [-1, 1]) {
      if (sg * turn > .45) continue;
      const w = sg > 0 ? wR : wL, ex = sg * (59 + q * 13) * w, ey = -6 + q * 10, tip = 20 - q * 2;
      const ear = P([[ex - sg * 6, ey + 16], [ex + sg * 4, ey - 8], [ex + sg * tip, ey - 28 + q * 6, 1], [ex + sg * 15, ey + 2], [ex + sg * 5, ey + 20]], .5);
      tone(ear, sg === sd ? boneS : bone, { sh: 4, rim: sg === sd ? 2.5 : 0 }); fillP(P([[ex + sg * 4, ey + 8], [ex + sg * 8, ey - 8], [ex + sg * (tip - 7), ey - 19], [ex + sg * 11, ey + 2]], .5), sock, .8);
    }
    // face: bone, one designed shadow plane (temple, under the cheekbone, down the jaw), a rim on the far edge
    fillP(face, bone);
    clipP(face, () => {
      fillP(P([[c + sd * 30, -120, 1], [c + sd * 43, -44], [c + sd * 50, -6, 1], [c + sd * (34 + q * 14), 20], [c + sd * (22 + q * 24), 52], [c + sd * (30 + q * 14), 84], [c * 1.5 + sd * 9, chinY + 6, 1], [sd * 130, 130, 1], [sd * 130, -120, 1]], .45), boneS);
      if (q < .6) fillP(P([[c - sd * 64, 0, 1], [c - sd * 44, 22], [c - sd * 31, 50, 1], [c - sd * 46, 58], [c - sd * 62, 36]], .4), mix(bone, boneS, .42 * (1 - q)));
      if (q > 0) for (const sg of [-1, 1]) oval(c + sg * 46 * (sg > 0 ? wR : wL), 30, 13, 8, rgba([232, 96, 104], .3 * q));
    });
    crescent(face, d * 3.2, .5, LT.rim);
    // eyes: deep slanted sockets, a small round eye in each, an ember pin
    const eyeY = -12 + q * 16, eyeDX = 27 + q * 8, pins = [];
    for (const sg of [-1, 1]) {
      const w = sg > 0 ? wR : wL, ex = c + sg * eyeDX * w, ey = eyeY, sw = (23 + q * 3) * w, shh = 14 + q * 12, dim = sg === sd;
      const bL = sg > 0 ? E.browR : E.browL, ang = E.lidA, sl = 1 - q * .8;
      fillP(P([[ex - sg * sw * .95, ey + (6 + ang * 9) * sl], [ex - sg * sw * .15, ey - shh + Math.max(0, E.bi) * .5 + Math.min(0, E.bi) * .2], [ex + sg * sw * 1.06, ey - (9 + ang * 7) * sl], [ex + sg * sw * .4, ey + shh * .94]], .62), sock);
      const er = (7.6 + q * 10.5) * E.eye * Math.min(1, w + .1), cx = ex + sg * 2, cy = ey + 1, px = cx + E.look[0] * er * .5, py = cy + E.look[1] * er * .5;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(sg * ang * .7); ctx.beginPath(); ctx.rect(-er * 2, -er + 2 * er * E.lidU, er * 4, 2 * er * (1 - E.lidU - E.lidL)); ctx.clip(); ctx.rotate(-sg * ang * .7); ctx.translate(-cx, -cy);
      disc(cx, cy, er, rgba(E.fire ? [255, 96, 40] : dim ? mix(bone, LT.sh, .28) : bone));
      if (E.fire) { disc(cx, cy, er * .62, rgba([255, 214, 120])); oval(px, py, er * .16, er * .5, rgba(INK)); }
      else { disc(px, py, er * (.5 + q * .12), rgba(INK)); disc(px, py, er * (.22 - q * .04), rgba(EMBER)); disc(px - er * .26, py - er * .3, er * (.14 + q * .12), 'rgba(255,255,255,.95)'); if (q > .4 || E.wet) disc(px + er * .26, py + er * .26, er * .1, 'rgba(255,255,255,.85)'); }
      ctx.restore();
      if (E.wet) fillP(P([[cx - er * .9, cy + er * .55], [cx, cy + er * 1.05], [cx + er * .9, cy + er * .55], [cx, cy + er * .8]], .6), [200, 226, 255], .55);
      pins.push([px, py, er]);
      // brow: thin, high, drawn on: the gentleman's vanity
      const by = ey - shh - 12 - q * 3;
      fillP(TP([[ex - sg * sw * .72, by + 8 + E.bi + bL * .3], [ex + sg * sw * .45, by - 4 + (E.bi + E.bo) * .5 - E.arch + bL], [ex + sg * sw * 1.2, by + 5 + E.bo + bL * .8]], [4.6, 4, 1]), hairC);
    }
    // nose: a faint ridge, a small wedge under the tip, two slits
    const nx = c * 1.25, ny = 31 + q * 5;
    if (q < .7) { fillP(TP([[nx * .7 + sd * 2, -14], [nx + sd * 4, 10], [nx + sd * 2, ny - 5]], [.8, 2.6, 1.2]), boneS, .75 * (1 - q)); fillP(P([[nx - 7, ny + 3], [nx, ny - 1], [nx + 7, ny + 3], [nx, ny + 7]], .5), boneS, .6 * (1 - q)); }
    for (const sg of [-1, 1]) oval(nx + sg * (4.6 - q), ny, 1.5, 3.8 - q * 1.6, rgba(sock), sg * .45);
    // mouth
    const mx = c * 1.2, my = 64 - q * 11, mw = 1 - q * .36;
    const dark = [54, 8, 18];
    if (E.mouth === 'smile') {
      const W = 43 * mw * E.w, yl = my - 8 * E.liftL, yr = my - 8 * E.liftR;
      fillP(TP([[mx - W - 9, yl - 12 * E.liftL], [mx - W, yl], [mx - W * .5, my + 3 - (E.liftL - 1) * 2], [mx, my + 6], [mx + W * .5, my + 3 - (E.liftR - 1) * 2], [mx + W, yr], [mx + W + 9, yr - 12 * E.liftR]], [1, 3.6, 4.6, 5, 4.6, 3.6, 1]), dark);
      if (q < .5) { strokeP(Q([mx - W - 9, yl - 12 * E.liftL], [mx - W * 1.2 - 8, yl - 28], [-57 * wL + c * .3, 16]), 1.2, dark, .32); strokeP(Q([mx + W + 9, yr - 12 * E.liftR], [mx + W * 1.2 + 8, yr - 28], [57 * wR + c * .3, 16]), 1.2, dark, .32); }
      fillP(TP([[mx - 12 * mw, my + 15], [mx, my + 17], [mx + 12 * mw, my + 15]], [1, 2.6, 1]), boneS, .7);
    } else if (E.mouth === 'pout') {
      fillP(TP([[mx - 15 * mw, my + 9], [mx - 6, my + 2], [mx + 6, my + 2], [mx + 15 * mw, my + 9]], [1, 3.6, 3.6, 1]), dark);
      fillP(TP([[mx - 8, my + 16], [mx, my + 18], [mx + 8, my + 16]], [1, 3, 1]), boneS, .8);
      if (q < .5) { strokeP(Q([mx - 16, my + 8], [mx - 44, my + 4], [-57 * wL + c * .3, 16]), 1.2, dark, .3); strokeP(Q([mx + 16, my + 8], [mx + 44, my + 4], [57 * wR + c * .3, 16]), 1.2, dark, .3); }
    } else {  // the seam opens: grin (courteous) or roar (the real voice)
      const roar = E.mouth === 'roar', a = [-58 * wL * mw + c * .5, 26 + q * 6], b = [58 * wR * mw + c * .5, 26 + q * 6];
      const cT = [mx, roar ? 74 : 96], cB = [mx, roar ? 198 : 148];
      fillP(lens(a, b, cT, cB), dark); clipP(lens(a, b, cT, cB), () => { oval(mx, roar ? 110 : 96, 30, 16, rgba([150, 20, 30])); });
      teeth(a, b, cT, cB, 15, 11, roar ? 11 : 9, lit([250, 246, 236]));
      strokeP(lens(a, b, cT, cB), 2.2, dark);
    }
    // hair: slicked back from a soft peak
    const hair = P([[-60 * wL, -2, 1], [-66 * wL, -50], [-52 * wL, -97], [0, -114], [52 * wR, -97], [66 * wR, -50], [60 * wR, -2, 1], [56 * wR, -38], [44 * wR + c * .4, -66], [20 + c * .6, -76], [c * .9, -62 - q * 4], [-20 + c * .6, -76], [-44 * wL + c * .4, -66], [-56 * wL, -38]], .5);
    tone(hair, hairC, { rim: 3 });
    clipP(hair, () => { for (const [k, w] of [[d * 20, 7], [d * 40, 3.4]]) fillP(TP([[c * .9 + k * .5, -70], [k * 1.1, -92], [k * 1.3, -112]], [1.5, w, 1]), mix(hairC, LT.rim, .4)); });
    // horns: slim, a crescent moon that leans back as the head turns; the left one a little longer
    const hornTips = [];
    for (const sg of [-1, 1]) {
      const w = sg > 0 ? wR : wL, bx = c * .5 + sg * 36 * w, by = -97 + q * 7, Hh = (sg < 0 ? 172 : 152) * horn, ow = .3 + .7 * Math.min(1, horn);
      const prof = sg < 0 ? [[0, 0], [22, .2], [38, .44], [42, .68], [32, .88], [14, 1]] : [[0, 0], [20, .2], [35, .45], [39, .7], [31, .9], [19, 1]];
      const pts = prof.map(([ox, f]) => [bx + sg * ox * ow - turn * 46 * Math.pow(f, 1.5) * horn, by - Hh * f]);
      const hw = [21, 18, 14, 9.5, 5, 1.2].map(v => v * (.6 + .4 * Math.min(1, horn)));
      const hp2 = TP(pts, hw); tone(hp2, mix(HORN, LT.sh, .15), { hi: hw[0] * .2, hiCol: mix(lit([150, 36, 44]), HORN, .2), rim: 2 });
      clipP(hp2, () => { for (let i = 1; i <= 3; i++) { const f = i * .07, px = lerp(pts[0][0], pts[1][0], f / .2), py = lerp(pts[0][1], pts[1][1], f / .2); strokeP(Q([px - 14, py + 3], [px, py - 3], [px + 14, py + 3]), 1.4, lit([170, 60, 64]), .45); } });
      hornTips.push(pts);
    }
    if (hat) partyHat(hornTips[hat > 0 ? 1 : 0], hat);
    for (const [px, py, er] of pins) glow(EMBER, px, py, er * (E.fire ? 5 : 1.5), E.fire ? .5 : .5);
  });
}
function partyHat(pts, sg) {  // a paper cone hung on a horn tip
  const a = pts[3], b = pts[5], ang = Math.atan2(b[0] - a[0], -(b[1] - a[1])) + sg * .25;
  at(lerp(a[0], b[0], .25), lerp(a[1], b[1], .25), 1, ang, () => {
    const cone = PL([[-34, 14], [34, 14], [0, -92]]); tone(cone, lit([232, 226, 214]), { sh: 16, rim: 2.5 });
    clipP(cone, () => { for (let i = 0; i < 4; i++) fillP(PL([[-40, 4 - i * 26], [40, -10 - i * 26], [40, -20 - i * 26], [-40, -6 - i * 26]]), lit(BLOOD)); crescent(cone, LT.dir * 16, -5, LT.sh, .35); });
    fillP(TP([[-36, 14], [0, 19], [36, 14]], [7, 8, 7]), lit(BLOOD)); disc(0, -94, 10, rgba(lit(BLOOD))); disc(-LT.dir * -3, -97, 4, rgba(lit([240, 120, 120])));
  });
}

// =====================================================================================================
// people: eyes with whites, iris, pupil, highlight, lids
// =====================================================================================================
function humanEye(ex, ey, sg, E, G) {  // G: hw, hu, hl, ir, irisC, skinS, lash, dim
  const hw = G.hw, top = G.hu * E.open, low = G.hl * (1 - (E.squint || 0) * 1.7);
  const a = [ex - sg * hw, ey + 2], b = [ex + sg * hw * 1.02, ey - 1.5], cT = [ex + sg * 1, ey - top * 2], cB = [ex + sg * 1, ey + low * 2];
  const eye = lens(a, b, cT, cB), white = G.dim ? mix([244, 240, 232], LT.sh, .34) : lit([246, 242, 234]);
  // lid plane above the eye
  if (G.heavy) fillP(lens(a, b, [cT[0], cT[1] - 9 - G.heavy * 5], cT), G.skinS, .55 + .3 * G.heavy);
  fillP(eye, white);
  clipP(eye, () => {
    const r = G.ir * (E.iris || 1), ix = ex + E.look[0] * hw * .46, iy = ey - (top - low) * .32 + E.look[1] * G.hu * .34 + 1;
    disc(ix, iy, r, rgba(G.irisC)); disc(ix, iy + r * .3, r * .62, rgba(lighten(G.irisC, .22))); disc(ix, iy, r * .46, rgba(INK));
    disc(ix - r * .36, iy - r * .4, r * .27, 'rgba(255,255,255,.96)'); disc(ix + r * .34, iy + r * .34, r * .11, 'rgba(255,255,255,.6)');
    fillP(lens(a, b, cT, [cT[0], ey - top * .9]), LT.sh, .34);
  });
  strokeP(Q(a, cT, b), G.lash, G.lashC || [40, 24, 26]);
  strokeP(Q(a, cB, b), 1.1, G.skinS, .9);
  if (G.bag) strokeP(Q([ex - sg * hw * .85, ey + G.hl + 5], [ex, ey + G.hl + 12], [ex + sg * hw * .95, ey + G.hl + 3]), 2.2, G.skinS, .85 * G.bag);
}

// DAD (Sam). Local units: crown -100, chin +105. age 38: long, gaunt, stubble, heavy lids; age 21: fuller, open.
const DAD_EX = {
  tired: { bi: 1, bo: 4, open: .52, heavy: 1, look: [0, .25], mouth: 'flat' },
  tempted: { bi: 5, bo: 3, open: .55, heavy: .9, look: [.9, .6], mouth: 'part' },
  laugh: { bi: -4, bo: -5, open: .36, squint: 1, look: [0, 0], mouth: 'laugh' },
  delight: { bi: -10, bo: -7, open: .98, squint: .3, look: [.9, -.05], mouth: 'grin' },
  horror: { bi: -16, bo: -3, open: 1.32, iris: .76, look: [0, 0], mouth: 'gasp' },
  warm: { bi: -2, bo: 0, open: .7, look: [0, 0], mouth: 'smile' },
};
function dadHead(o = {}) {
  const { x = 0, y = 0, s = 1, rot = 0, turn = 0, expr = 'tired', age = 38 } = o;
  const E = Object.assign({ bi: 0, bo: 0, open: .7, heavy: 0, squint: 0, iris: 1, look: [0, 0] }, DAD_EX[expr] || {}, o.ex || {});
  if (o.look) E.look = o.look;
  const yg = age < 30 ? 1 : 0;
  at(x, y, s, rot, () => {
    const d = LT.dir, sd = -d, c = turn * 15, wR = 1 - turn * .12, wL = 1 + turn * .12;
    const skin = lit(SKIN), skinS = shd(SKIN), hair = mix(lit(HAIR), LT.sh, .2), hairHi = mix(hair, LT.rim, .32);
    const half = yg ? [[0, -100], [38, -96], [62, -66], [68, -22], [67, 24], [60, 60], [44, 87], [21, 100], [0, 103]]
      : [[0, -100], [38, -96], [61, -66], [66, -22], [62, 22], [54, 58], [38, 86], [17, 101], [0, 105]];
    const cs = y0 => c * .7 * inv(30, 105, y0);
    const face = P(half.map(p => [p[0] * wR + cs(p[1]), p[1]]).concat(half.slice(1, -1).reverse().map(p => [-p[0] * wL + cs(p[1]), p[1]])), .5);
    for (const sg of [-1, 1]) {  // ears
      if (sg * turn > .4) continue;
      const w = sg > 0 ? wR : wL, ex = sg * 64 * w, ey = -4;
      const ear = P([[ex - sg * 4, ey - 12], [ex + sg * 10, ey - 20], [ex + sg * 17, ey - 6], [ex + sg * 13, ey + 12], [ex + sg * 3, ey + 22], [ex - sg * 4, ey + 14]], .5);
      tone(ear, sg === sd ? skinS : skin, { sh: 4, rim: sg === sd ? 2.5 : 0 }); fillP(P([[ex + sg * 4, ey - 10], [ex + sg * 11, ey - 8], [ex + sg * 9, ey + 8], [ex + sg * 4, ey + 6]], .5), skinS, .9);
    }
    fillP(face, skin);
    const mx = c * 1.15, my = 60;
    clipP(face, () => {
      // the noir half: the shadow follows the ridge of the nose, wraps under it, under the lip, down the chin
      fillP(P([[c + sd * 4, -130, 1], [c + sd * 13, -66], [c + sd * 10, -34], [c + sd * 3, -20], [c * 1.3 - sd * 2, 8], [c * 1.35 - sd * 5, 23, 1], [c * 1.3 - sd * 15, 29], [c * 1.3 - sd * 11, 36, 1], [c * 1.2 + sd * 1, 38], [mx + sd * 5, 50], [mx + sd * 3, 66], [mx - sd * 15, 73], [mx - sd * 10, 80, 1], [mx + sd * 7, 84], [mx + sd * 9, 112, 1], [sd * 140, 120, 1], [sd * 140, -130, 1]], .4), skinS);
      // the lit triangle on the shadow cheek
      fillP(P([[c + sd * 21, 4, 1], [c + sd * 45, 2], [c + sd * 43, 26], [c + sd * 28, 40, 1]], .5), mix(skin, skinS, .25));
      // lit side: the cheekbone's own shadow (38 only), the socket under the brow
      if (!yg) fillP(P([[c - sd * 64, 8], [c - sd * 40, 26, 1], [c - sd * 36, 50], [c - sd * 50, 74], [c - sd * 62, 52]], .5), skinS, .62);
      // stubble
      if (!yg) { ctx.save(); ctx.globalAlpha = .26; fillP(P([[-80, 26], [-44, 40], [mx - 22, 40], [mx - 12, 44], [mx + 12, 44], [mx + 22, 40], [44, 40], [80, 26], [80, 130], [-80, 130]], .4), mix([60, 56, 80], LT.sh, .5)); ctx.restore(); fillP(P([[mx - 24, 54], [mx, 50], [mx + 24, 54], [mx + 20, 78], [mx, 82], [mx - 20, 78]], .5), skin, .0); }
      if (yg) for (const sg of [-1, 1]) oval(c + sg * 40 * (sg > 0 ? wR : wL), 30, 15, 9, rgba([236, 110, 96], .2));
    });
    crescent(face, d * 3.4, .6, LT.rim);
    // eyes and brows
    for (const sg of [-1, 1]) {
      const w = sg > 0 ? wR : wL, ex = c + sg * 28 * w, ey = -14, dim = sg === sd;
      humanEye(ex, ey, sg, E, { hw: 15.5 * w, hu: 12, hl: 5.5, ir: 8.2, irisC: [70, 44, 34], skinS: dim ? mix(skinS, LT.sh, .45) : skinS, lash: 3.2, dim, heavy: yg ? .15 : E.heavy, bag: yg ? 0 : 1 });
      const bw = yg ? .82 : 1;
      fillP(TP([[ex - sg * 18 * w, ey - 21 + E.bi], [ex + sg * 1, ey - 27 + (E.bi + E.bo) * .5 - 1], [ex + sg * 21 * w, ey - 20 + E.bo]], [8.5 * bw, 8 * bw, 2.6]), hair);
    }
    // nose: the nostril and wing on the lit side
    const nx = c * 1.32;
    fillP(TP([[nx - sd * 15, 20], [nx - sd * 17, 28], [nx - sd * 11, 33]], [1, 2.6, 1.6]), skinS);
    oval(nx - sd * 8, 30.5, 4.4, 2.3, rgba(mix(skinS, INK, .45)), sd * .3);
    // mouth
    const lip = mix(shd(SKIN, .5), [150, 60, 60], .45), dark = [70, 20, 26];
    if (E.mouth === 'flat') { fillP(TP([[mx - 22, my + 3], [mx - 8, my], [mx + 8, my + .5], [mx + 22, my + 4]], [1.4, 3.4, 3.4, 1.4]), mix(dark, skinS, .2)); fillP(TP([[mx - 12, my + 10], [mx, my + 11.5], [mx + 12, my + 10]], [1, 3, 1]), skinS, .7); }
    else if (E.mouth === 'part') { const a = [mx - 20, my + 2], b = [mx + 20, my], m = lens(a, b, [mx, my - 3], [mx, my + 13]); fillP(m, dark); clipP(m, () => rectf(mx - 22, my - 6, 44, 6.5, rgba(lit([240, 234, 222])))); strokeP(Q(a, [mx, my - 3], b), 2.4, mix(dark, skinS, .2)); fillP(TP([[mx - 12, my + 12], [mx, my + 14], [mx + 12, my + 11]], [1, 3, 1]), skinS, .7); }
    else if (E.mouth === 'smile') { fillP(TP([[mx - 25, my - 3], [mx - 12, my + 3], [mx, my + 4.5], [mx + 12, my + 3], [mx + 25, my - 3]], [1.2, 3, 3.4, 3, 1.2]), mix(dark, skinS, .2)); }
    else if (E.mouth === 'laugh' || E.mouth === 'grin') {
      const big = E.mouth === 'laugh' ? 1 : .82, a = [mx - 31, my - 7], b = [mx + 31, my - 7], cT = [mx, my + 4], cB = [mx, my + 60 * big], m = lens(a, b, cT, cB);
      fillP(m, dark); clipP(m, () => { oval(mx, my + 27 * big, 17, 9, rgba([204, 100, 96])); fillP(lens(a, b, cT, [mx, my + 21]), lit([248, 244, 234])); });
      strokeP(m, 2, mix(dark, skinS, .25));
      for (const sg of [-1, 1]) strokeP(Q([nx + sg * 19, 26], [mx + sg * 40, my - 16], [mx + sg * 38, my + 6]), 2.4, skinS, .85);
    } else if (E.mouth === 'gasp') {
      const m = P([[mx - 15, my - 2], [mx, my - 7], [mx + 15, my - 2], [mx + 16, my + 20], [mx, my + 30], [mx - 16, my + 20]], .6);
      fillP(m, dark); clipP(m, () => { rectf(mx - 20, my - 10, 40, 8.5, rgba(lit([240, 234, 222]))); rectf(mx - 20, my + 23, 40, 9, rgba(mix(lit([240, 234, 222]), LT.sh, .25))); });
      strokeP(m, 2, mix(dark, skinS, .25));
    }
    // hair: dark, swept back and across, a part on one side
    const top = yg ? -138 : -126;
    const hp = P([[-63 * wL, -4, 1], [-71 * wL, -46], [-66 * wL, -90], [-34, top + 10], [8, top], [48, top + 16], [70 * wR, -70], [69 * wR, -24], [63 * wR, -4, 1], [59 * wR, -32], [55 * wR + c * .3, -60], [38 + c * .5, -78], [8 + c * .6, -72], [-24 + c * .6, -80, 1], [-48 * wL + c * .4, -64], [-58 * wL, -34]], .5);
    tone(hp, hair, { rim: 3.2 });
    clipP(hp, () => { fillP(TP([[-26 + c * .6, -84], [6, top + 14], [44, top + 26], [62, -74]], [2, 9, 6, 1]), hairHi); fillP(TP([[-30 + c * .6, -78], [-52, -96], [-62, -62]], [1, 5, 1]), hairHi, .7); if (!yg) fillP(TP([[58 * wR, -44], [62 * wR, -24]], [5, 2]), mix(hair, [200, 200, 210], .35)); });
    if (yg) { fillP(P([[-20, top + 6], [-6, top - 14, 1], [6, top + 4], [20, top - 12, 1], [30, top + 10], [0, top + 22]], .5), hair); }
    fillP(P([[-22 + c * .6, -82], [-4 + c * .7, -64], [10 + c * .8, yg ? -50 : -42, 1], [2 + c * .7, -70], [-4 + c * .6, -84]], .5), hair);  // the lock that has come loose
  });
}

// LILY (6). Local units: crown -100, chin +88. Round face, big dark eyes, a bob with a fringe.
const LILY_EX = {
  happy: { bi: -2, bo: 0, open: 1, look: [0, 0], mouth: 'smile' },
  afraid: { bi: -12, bo: 4, open: 1.22, iris: .84, look: [0, -.3], mouth: 'o' },
  calm: { bi: 0, bo: 0, open: .9, look: [0, 0], mouth: 'line' },
};
function lilyHead(o = {}) {
  const { x = 0, y = 0, s = 1, rot = 0, turn = 0, expr = 'happy' } = o;
  const E = Object.assign({ bi: 0, bo: 0, open: 1, iris: 1, look: [0, 0] }, LILY_EX[expr] || {}, o.ex || {});
  if (o.look) E.look = o.look;
  at(x, y, s, rot, () => {
    const d = LT.dir, sd = -d, c = turn * 17, wR = 1 - turn * .1, wL = 1 + turn * .1;
    const skin = lit(LSKIN), skinS = shd(LSKIN), hair = mix(lit(LHAIR), LT.sh, .15), hairHi = mix(hair, LT.rim, .34);
    // back of the bob
    const back = P([[-88 * wL, 62, 1], [-100 * wL, 6], [-90 * wL, -58], [-50, -100], [0, -108], [50, -100], [90 * wR, -58], [100 * wR, 6], [88 * wR, 62, 1], [60, 50], [-60, 50]], .5);
    tone(back, mix(hair, LT.sh, .35), { rim: 3 });
    const half = [[0, -90], [50, -80], [80, -38], [84, 8], [70, 50], [42, 78], [0, 88]];
    const cs = y0 => c * .6 * inv(20, 88, y0);
    const face = P(half.map(p => [p[0] * wR + cs(p[1]), p[1]]).concat(half.slice(1, -1).reverse().map(p => [-p[0] * wL + cs(p[1]), p[1]])), .5);
    fillP(face, skin);
    clipP(face, () => {
      fillP(P([[c + sd * 30, -120], [c + sd * 44, -30], [c + sd * 52, 10], [c + sd * 46, 44], [c + sd * 24, 76], [c * 1.4, 96], [sd * 140, 110], [sd * 140, -120]], .5), skinS, .9);
      for (const sg of [-1, 1]) oval(c + sg * 52 * (sg > 0 ? wR : wL), 38, 15, 9, rgba([238, 112, 104], .3));
    });
    crescent(face, d * 3.2, .6, LT.rim);
    for (const sg of [-1, 1]) {
      const w = sg > 0 ? wR : wL, ex = c + sg * 34 * w, ey = 4, dim = sg === sd;
      humanEye(ex, ey, sg, E, { hw: 19 * w, hu: 17, hl: 9, ir: 13.5, irisC: [52, 32, 28], skinS: dim ? mix(skinS, LT.sh, .4) : skinS, lash: 3.6, dim, heavy: 0, bag: 0 });
      fillP(TP([[ex - sg * 16 * w, ey - 31 + E.bi], [ex + sg * 2, ey - 35 + (E.bi + E.bo) * .5], [ex + sg * 19 * w, ey - 30 + E.bo]], [4.5, 4.5, 1.6]), hair);
    }
    const nx = c * 1.3; fillP(TP([[nx - sd * 5, 36], [nx + sd * 1, 39], [nx + sd * 6, 35]], [1, 3, 1]), skinS);
    const mx = c * 1.15, my = 58, dark = [110, 36, 44];
    if (E.mouth === 'smile') fillP(TP([[mx - 15, my - 3], [mx, my + 4], [mx + 15, my - 3]], [1.2, 3.4, 1.2]), dark);
    else if (E.mouth === 'line') fillP(TP([[mx - 10, my], [mx, my + 1], [mx + 10, my]], [1.2, 3, 1.2]), dark);
    else { const m = P([[mx - 8, my + 1], [mx, my - 4], [mx + 8, my + 1], [mx + 6, my + 10], [mx - 6, my + 10]], .6); fillP(m, dark); clipP(m, () => rectf(mx - 10, my - 6, 20, 5, 'rgba(250,246,238,.9)')); }
    // the fringe and the sides of the bob, in front
    const fr = P([[-86 * wL, 44, 1], [-94 * wL, -6], [-86 * wL, -60], [-48, -98], [0, -106], [48, -98], [86 * wR, -60], [94 * wR, -6], [86 * wR, 44, 1], [76 * wR, 10], [74 * wR + c * .3, -26, 1], [46 + c * .5, -34], [22 + c * .5, -29, 1], [c * .5, -36], [-22 + c * .5, -30, 1], [-46 + c * .5, -35], [-74 * wL + c * .3, -26, 1], [-76 * wL, 10]], .5);
    tone(fr, hair, { rim: 3 });
    clipP(fr, () => { fillP(TP([[-70, -58], [-30, -76], [20, -78], [66, -60]], [2, 10, 10, 2]), hairHi, .9); });
  });
}

// ---------- test ----------
function backdrop(c0, c1) { rectf(0, 0, W, H, lg(0, 0, 0, H, [[0, c0], [1, c1]])); }
const STILLS = {
  heads: t => {
    backdrop([92, 104, 122], [58, 64, 84]); glow([200, 210, 230], 520, 420, 520, .35); glow([200, 210, 230], 1400, 420, 520, .35);
    setLight({ dir: -1 }); devilHead({ x: 470, y: 500, s: 2.3, expr: 'charm', turn: .3 });
    setLight({ dir: -1 }); dadHead({ x: 1380, y: 470, s: 2.6, expr: 'tired', turn: -.3 });
    finish({ bloom: .12 });
  },
  faces: t => {
    backdrop([92, 104, 122], [58, 64, 84]);
    setLight({ dir: -1 });
    ['charm', 'sly', 'plead', 'rage', 'grin'].forEach((e, i) => devilHead({ x: 220 + i * 370, y: 300, s: 1.05, expr: e, turn: i === 1 ? .4 : 0 }));
    ['laugh', 'tempted', 'horror'].forEach((e, i) => dadHead({ x: 200 + i * 300, y: 800, s: 1.15, expr: e, turn: i === 1 ? .5 : 0 }));
    dadHead({ x: 1100, y: 800, s: 1.15, expr: 'delight', age: 21, turn: .7 });
    lilyHead({ x: 1420, y: 800, s: 1.1, expr: 'happy' }); lilyHead({ x: 1700, y: 800, s: 1.1, expr: 'afraid', turn: -.7 });
    devilHead({ x: 1780, y: 380, s: .9, expr: 'adore', cute: 1, horn: .16 });
    finish({ bloom: .12 });
  },
};
