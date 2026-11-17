'use strict';
// LOOK D: the genre look the owner pointed at (17 Nov 2026): a near-black stage, one pool of light, a thin floor line,
// simple cream people drawn like marker cartoons, a black devil with a red glowing edge, handwritten words.
// Our own construction and faces: a round head on a bean body, four soft tubes; no hands, feet, hair or clothes.
// The devil is the same construction in black ("it is him"), with horns, a tail and a face made of fire.
const D = {
  stage: [9, 9, 11], floor: [70, 68, 72], cream: [240, 230, 208], creamS: [200, 186, 164], line: [26, 22, 22],
  yellow: [255, 206, 44], red: [255, 56, 40], ember: [255, 130, 50], hot: [255, 214, 130], ink: [12, 9, 11],
  white: [244, 240, 230], prop: [86, 92, 110], propL: [130, 138, 160], wood: [104, 78, 62], amber: [240, 160, 50]
};
const FONT = '"Chalkboard SE", "Marker Felt", "Comic Sans MS", sans-serif';
const boil = (t, seed = 0) => Math.floor((t || 0) * 8) * 7.13 + seed;                // the line "boils" 8 times a second
const jit = (pts, amp, s) => pts.map((p, i) => [p[0] + noise1(i * 1.71 + s, 3) * amp, p[1] + noise1(i * 2.37 + s, 8) * amp]);
// handwritten words. kind: 'say' (white, the story's voice), 'devil' (red), 'count' (top right)
function hw(text, x, y, size, kind = 'say', o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -.012); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${o.weight || 700} ${size}px ${FONT}`; ctx.lineJoin = 'round';
  const col = kind === 'devil' ? D.red : D.white;
  ctx.shadowColor = rgba(kind === 'devil' ? [255, 40, 20] : [255, 255, 255], kind === 'devil' ? .75 : .28); ctx.shadowBlur = size * (kind === 'devil' ? .5 : .28);
  if (o.reveal != null) { const w = ctx.measureText(text).width, a = ctx.textAlign; ctx.translate(a === 'center' ? -w / 2 : a === 'right' ? -w : 0, 0); ctx.textAlign = 'left'; text = text.slice(0, Math.round(clamp(o.reveal) * text.length)); }
  ctx.fillStyle = rgba(col); ctx.fillText(text, 0, 0); ctx.shadowBlur = 0; ctx.fillText(text, 0, 0);
  if (o.under) { const w = ctx.measureText(text).width; curve([[-w / 2, size * .62], [-w * .1, size * .7], [w * .2, size * .6], [w / 2, size * .68]], size * .09, rgba(D.red), .5); }
  ctx.restore();
}
const counter = (text) => hw(text, W - 90, 84, 46, 'say', { align: 'right', rot: 0 });
// the stage: black, a thin floor line, one pool of light
function stageD(floorY, o = {}) {
  rectf(0, 0, W, H, rgba(D.stage));
  if (o.pool) { const [x, y, r, c, a] = o.pool; glow(c || [255, 214, 160], x, y, r, a ?? .2); }
  if (floorY) { curve(jit([[-20, floorY], [480, floorY], [960, floorY], [1440, floorY], [1940, floorY]], 1.5, o.seed || 1), 4, rgba(D.floor), .5);
    if (o.pool) additive(() => { ctx.save(); ctx.translate(o.pool[0], floorY + 6); ctx.scale(1, .1); glow(o.pool[3] || [255, 214, 160], 0, 0, o.pool[2] * .9, (o.pool[4] ?? .2) * 1.3); ctx.restore(); }); }
}

// ---------------------------------------------------------------------------------------------------------------
// FACES. Unit space: the head is a circle of radius 1.
// ---------------------------------------------------------------------------------------------------------------
const FX = {
  //          eye height, lid (0 open..1 shut), brow inner/outer lift (+ = down), mouth, extra
  calm:    { eh: 1, lid: .0, bi: 0, bo: 0, m: 'flat' },
  smile:   { eh: 1, lid: .0, bi: -.05, bo: 0, m: 'smile' },
  laugh:   { eh: .34, lid: 0, bi: -.1, bo: 0, m: 'laugh', arc: true },
  tired:   { eh: 1, lid: .5, bi: -.06, bo: .08, m: 'flat', bags: true },
  tempted: { eh: 1, lid: .42, bi: -.14, bo: .1, m: 'part', bags: true },
  horror:  { eh: 1.25, lid: 0, bi: -.22, bo: .06, m: 'gasp', small: true, bags: true },
  fear:    { eh: 1.2, lid: 0, bi: -.2, bo: .08, m: 'wob', small: true },
  sad:     { eh: 1, lid: .3, bi: -.2, bo: .12, m: 'down', bags: true },
  resolve: { eh: .9, lid: .22, bi: .2, bo: -.08, m: 'firm' },
  strain:  { eh: .3, lid: 0, bi: .22, bo: -.06, m: 'grit', arc: true, sweat: true }
};
function faceD(r, expr, o = {}) {                                              // drawn at the origin, scaled by r
  const e = typeof expr === 'object' ? expr : FX[expr || 'calm'], look = o.look || [0, 0], kid = o.kid, s = o.seed || 0, lw = .075;
  const ex = kid ? .36 : .34, ey = kid ? .0 : -.06, erx = kid ? .15 : .12, ery = (kid ? .23 : .19) * e.eh, fx = (o.turn || 0) * .3;
  ctx.save(); ctx.scale(r, r);
  for (const sd of [-1, 1]) {
    const x = sd * ex + fx + look[0] * .07, y = ey + look[1] * .06;
    if (e.arc) curve(jit([[x - erx * 1.3, y + .05], [x, y - .1], [x + erx * 1.3, y + .05]], .012, s + sd), lw * 1.05, rgba(D.line), .6);     // a squeezed-shut eye
    else {
      oval(x, y, erx * (e.small ? .8 : 1), ery * (e.small ? .8 : 1), rgba(D.line));
      if (e.small) { ctx.lineWidth = lw * .7; ctx.strokeStyle = rgba(D.line); ctx.beginPath(); ctx.ellipse(x, y, erx * 1.5, ery * 1.25, 0, 0, TAU); ctx.fillStyle = 'rgb(255,255,255)'; ctx.fill(); ctx.stroke(); oval(x + look[0] * .05, y + look[1] * .05, erx * .6, erx * .6, rgba(D.line)); }
      else disc(x - erx * .3, y - ery * .42, erx * .34, 'rgba(255,255,255,.95)');
      if (e.lid > 0) { rectf(x - erx * 1.4, y - ery * 1.2, erx * 2.8, ery * 2.2 * e.lid + ery * .2, rgba(o.skin || D.cream)); stroke([[x - erx * 1.35, y - ery + ery * 2 * e.lid], [x + erx * 1.35, y - ery + ery * 2 * e.lid + .01]], lw, rgba(D.line)); }
    }
    if (e.bags) curve([[x - erx * 1.1, y + ery * 1.25], [x, y + ery * 1.5], [x + erx * 1.1, y + ery * 1.3]], lw * .6, rgba(D.line, .55));
    const by = y - Math.max(ery, .12) - .17;                                                                        // brow
    stroke(jit([[x - sd * erx * 1.5, by + e.bi + .0], [x + sd * erx * 1.5, by + e.bo]], .012, s + sd * 3), lw * 1.25, rgba(D.line));
  }
  const my = kid ? .46 : .44, mx = fx;
  if (e.m === 'laugh' || e.m === 'gasp' || e.m === 'grit') {
    const w = e.m === 'laugh' ? .34 : e.m === 'grit' ? .3 : .13, d = e.m === 'laugh' ? .3 : e.m === 'grit' ? .17 : .26;
    const mp = e.m === 'gasp' ? [[mx - w, my + .04], [mx, my - .06], [mx + w, my + .04], [mx + w * .8, my + d], [mx, my + d + .05], [mx - w * .8, my + d]] : [[mx - w, my - .06], [mx, my - .02], [mx + w, my - .06], [mx + w * .7, my + d * .8], [mx, my + d], [mx - w * .7, my + d * .8]];
    blob(mp, rgba(D.line), .5);
    inside(() => blobPath(mp, .5, true), () => { if (e.m !== 'gasp') rectf(mx - w, my - .1, w * 2, e.m === 'grit' ? .4 : .14, 'rgb(255,255,255)');
      if (e.m === 'grit') { stroke([[mx - w, my + .07], [mx + w, my + .07]], .03, rgba(D.line)); for (let i = -2; i <= 2; i++) stroke([[mx + i * w * .36, my - .1], [mx + i * w * .36, my + .3]], .03, rgba(D.line)); }
      if (e.m === 'laugh') oval(mx, my + d, w * .5, d * .4, rgba([230, 110, 110])); });
  } else {
    const sh = { flat: [0, 0, .16], smile: [-.07, .06, .2], part: [0, .02, .13], down: [.07, -.03, .17], firm: [0, .0, .19], wob: [.03, -.03, .12] }[e.m];
    curve(jit([[mx - sh[2], my + sh[0]], [mx, my + sh[1]], [mx + sh[2], my + sh[0]]], e.m === 'wob' ? .03 : .008, s + 5), lw, rgba(D.line), .6);
  }
  if (e.sweat) for (const [x, y] of [[-.72, -.3], [.7, -.42]]) blob([[x, y - .1], [x + .05, y + .02], [x, y + .08], [x - .05, y + .02]], rgba([150, 200, 240]), .5);
  ctx.restore();
}
// the devil's face: fire showing through holes in the black. age 0 (newborn) .. 1 (giant)
const DX = {
  sweet: { h: 1.25, in: 0, out: 0, pup: 1.2, m: 'cat' }, happy: { h: 1.05, in: 0, out: 0, pup: 1, m: 'open' },
  charm: { h: .62, in: .06, out: -.06, pup: .9, m: 'smile' }, sly: { h: .46, in: .14, out: -.1, pup: .8, m: 'smirk' },
  plead: { h: 1.2, in: -.2, out: .2, pup: 1.3, m: 'pout' }, rage: { h: .7, in: .34, out: -.2, pup: .4, m: 'roar' },
  grin: { h: .6, in: .2, out: -.14, pup: .6, m: 'grin' }, sulk: { h: .5, in: .16, out: .04, pup: .8, m: 'frown' }
};
function faceDevil(r, expr, o = {}) {
  const e = typeof expr === 'object' ? expr : DX[expr || 'charm'], age = o.age ?? .7, look = o.look || [0, 0], fx = (o.turn || 0) * .3, heat = o.heat ?? 1;
  const fire = (y0, y1) => lg(0, y0, 0, y1, [[0, D.hot], [.5, D.ember], [1, D.red]]);
  ctx.save(); ctx.scale(r, r);
  const ex = .36, ey = lerp(.0, -.08, age), erx = lerp(.19, .21, age), ery = lerp(.24, .15, age) * e.h;
  for (const sd of [-1, 1]) {
    const x = sd * ex + fx, sl = lerp(.02, .1, age);
    const pts = [[x - sd * erx, ey + sl * .5 + e.in * .5], [x - sd * erx * .3, ey - ery + e.in], [x + sd * erx * .6, ey - ery - sl + e.out], [x + sd * erx * 1.05, ey - sl + e.out * .5], [x + sd * erx * .4, ey + ery * .8], [x - sd * erx * .4, ey + ery]];
    additive(() => glow(D.red, x, ey, erx * 3, .5 * heat));
    const path = () => blobPath(pts, .45, true);
    path(); ctx.fillStyle = fire(ey - ery, ey + ery); ctx.fill();
    inside(path, () => { const px = x + look[0] * erx * .5, py = ey + look[1] * ery * .4; oval(px, py, lerp(.07, .035, age) * e.pup, Math.max(ery * .8, .06) * (.7 + .3 * e.pup), rgba(D.ink));
      if (age < .5) disc(px - .04, py - ery * .4, .035, 'rgba(255,255,255,.95)'); });
  }
  const my = lerp(.46, .5, age), mw = lerp(.3, .56, age), mx = fx;
  ctx.shadowColor = rgba(D.red, .9); ctx.shadowBlur = r * .18;
  if (e.m === 'cat') curve([[mx - .14, my - .03], [mx - .07, my + .05], [mx, my - .01], [mx + .07, my + .05], [mx + .14, my - .03]], .06, rgba(D.ember), .6);
  else if (e.m === 'smile' || e.m === 'smirk') curve(e.m === 'smirk' ? [[mx - mw * .7, my + .1], [mx, my + .12], [mx + mw, my - .16]] : [[mx - mw, my - .1], [mx - mw * .5, my + .08], [mx, my + .12], [mx + mw * .5, my + .08], [mx + mw, my - .1]], .075, rgba(D.ember), .55);
  else if (e.m === 'pout' || e.m === 'frown') curve([[mx - .15, my + .1], [mx, my + .0], [mx + .15, my + .1]], .065, rgba(D.ember), .6);
  else {
    const d = e.m === 'roar' ? .5 : e.m === 'grin' ? .3 : .22, w = e.m === 'open' ? mw * .6 : mw * 1.15, up = e.m === 'roar' ? 0 : -.14;
    const mp = [[mx - w, my + up], [mx - w * .5, my + (e.m === 'roar' ? -.1 : .0)], [mx, my + (e.m === 'roar' ? -.12 : .03)], [mx + w * .5, my + (e.m === 'roar' ? -.1 : .0)], [mx + w, my + up], [mx + w * .6, my + d * .8], [mx, my + d], [mx - w * .6, my + d * .8]];
    blob(mp, fire(my - .1, my + d), .5); ctx.shadowBlur = 0;
    inside(() => blobPath(mp, .5, true), () => { const n = e.m === 'open' ? 0 : e.m === 'roar' ? 7 : 9;                 // black teeth against the fire
      for (let i = 0; i < n; i++) { const k = (i + .5) / n, x = lerp(mx - w * .92, mx + w * .92, k), a = Math.sin(k * Math.PI), tw = w / n * .8;
        poly([[x - tw, my - .3], [x + tw, my - .3], [x + tw, my + (e.m === 'roar' ? -.1 : -.02) + (1 - a) * .02], [x, my + (e.m === 'roar' ? .08 : .1) + (1 - a) * .0], [x - tw, my + (e.m === 'roar' ? -.1 : -.02)]], rgba(D.ink));
        poly([[x + w / n - tw, my + d + .3], [x + w / n + tw, my + d + .3], [x + w / n + tw, my + d * (.5 + .34 * a) + .1], [x + w / n, my + d * (.5 + .34 * a)], [x + w / n - tw, my + d * (.5 + .34 * a) + .1]], rgba(D.ink)); } });
  }
  ctx.shadowBlur = 0; ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------
// THE FIGURE. One construction for everyone. kind: 'sam' | 'lily' | 'devil'. (x, y) the feet, h the height.
// o: lean, expr, look, turn, armL / armR ([x, y] where the end of the arm goes), stride, sit ([dx] knees forward),
// stage 0..4 (devil), t (for the boil), bow (lily), hat, dim (0..1 fades a far figure)
// ---------------------------------------------------------------------------------------------------------------
function figure(o) {
  const dev = o.kind === 'devil', kid = o.kind === 'lily', h = o.h, st = dev ? clamp(o.stage ?? 3, 0, 4) : 3, age = st / 4, s = boil(o.t, o.seed || (dev ? 40 : kid ? 20 : 0));
  const hr = h * (dev ? lerp(.27, .19, clamp(st / 3)) * (st > 3 ? lerp(1, .82, st - 3) : 1) : kid ? .245 : .2), lw = Math.max(2.2, h * (o.lw || .013));
  const legL = h * (dev ? lerp(.14, .25, clamp(st / 3)) : kid ? .2 : .25), legW = h * (kid ? .09 : .085) * (dev && st > 3 ? 1.5 : 1), armW = h * .072 * (dev && st > 3 ? 1.7 : 1), armLen = h * (dev ? lerp(.26, .34, age) + (st > 3 ? .12 : 0) : kid ? .27 : .31);
  const lean = o.lean || 0, hipY = o.sit ? o.y : o.y - legL, top = o.y - h, headC = [o.x + Math.sin(lean) * (hipY - top - hr) + (o.headDx || 0) * hr, top + hr + (o.headDy || 0) * hr];
  const neck = [lerp(headC[0], o.x, .22), headC[1] + hr * .86], bw = h * (kid ? .13 : .135) * (dev && st > 3 ? 1.9 : 1), sw = bw * (dev && st > 3 ? 1.15 : .82);
  const shY = neck[1] + h * .035, sx = neck[0], shL = [sx - sw * .82, shY + h * .02], shR = [sx + sw * .82, shY + h * .02];
  const body = jit([[sx - sw * .7, shY - h * .02], [sx + sw * .7, shY - h * .02], [sx + sw * 1.02, shY + (hipY - shY) * .25], [lerp(sx, o.x, .7) + bw, lerp(shY, hipY, .68)], [o.x + bw * .8, hipY + h * .02], [o.x - bw * .8, hipY + h * .02], [lerp(sx, o.x, .7) - bw, lerp(shY, hipY, .68)], [sx - sw * 1.02, shY + (hipY - shY) * .25]], lw * .28, s);
  const head = jit(Array.from({ length: 10 }, (_, i) => { const a = i / 10 * TAU; return [headC[0] + Math.cos(a) * hr * (dev ? lerp(1.06, 1, age) : 1.03), headC[1] + Math.sin(a) * hr * (dev ? lerp(.94, 1.04, age) : .97)]; }), lw * .3, s + 3);
  const tube = (a, b, w, bend = 0) => { const m = [(a[0] + b[0]) / 2 + bend * (b[1] - a[1]) * .2, (a[1] + b[1]) / 2 - bend * (b[0] - a[0]) * .2]; return { pts: [a, m, b], w: [w, w * .96, w * .9] }; };
  const defL = [shL[0] - h * .035, shL[1] + armLen], defR = [shR[0] + h * .035, shR[1] + armLen];
  const reach = (sh, to) => { const d = Math.hypot(to[0] - sh[0], to[1] - sh[1]), k = o.stretch ? 1 : Math.min(1, armLen / d); return [sh[0] + (to[0] - sh[0]) * k, sh[1] + (to[1] - sh[1]) * k]; };
  const aL = tube(shL, reach(shL, o.armL || defL), armW, o.bendL ?? -.5), aR = tube(shR, reach(shR, o.armR || defR), armW, o.bendR ?? .5);
  const stride = o.stride || 0, legs = [-1, 1].map(sd => { const hip = [o.x + sd * bw * .42, hipY - h * .01];
    if (o.sit) { const kx = hip[0] + o.sit * legL * .9; return [tube(hip, [kx, hip[1] + legL * .08], legW), tube([kx, hip[1] + legL * .08], [kx + o.sit * legL * .05, hip[1] + legL * .95], legW)]; }
    return [tube(hip, [o.x + sd * bw * .5 + sd * stride * h * .13, o.y - legW * .45], legW, sd * stride * .6)]; }).flat();
  const horns = dev ? [-1, 1].map(sd => { const b = [headC[0] + sd * hr * .56, headC[1] - hr * .72], L = hr * lerp(.34, 1.25, Math.pow(age, .8));
    return { pts: [b, [b[0] + sd * L * .36, b[1] - L * .34], [b[0] + sd * L * .46, b[1] - L * .8], [b[0] + sd * L * .2, b[1] - L * 1.12]], w: [hr * .3, hr * .24, hr * .14, hr * .02] }; }) : [];
  const tt = o.tail || [-.36, -.22], tb = [o.x - Math.sign(tt[0] || 1) * bw * .5, hipY - h * .03], tip = [o.x + tt[0] * h, hipY + tt[1] * h];
  const tail = dev && !o.noTail ? { pts: [tb, [lerp(tb[0], tip[0], .45), tb[1] + h * .09], [lerp(tb[0], tip[0], .95), lerp(tb[1], tip[1], .4)], tip], w: [armW * .5, armW * .36, armW * .26, armW * .2] } : null;
  const parts = () => { const P = []; if (tail) P.push(() => taper(tail.pts, tail.w, null));
    if (!o.noLegs) for (const l of legs) P.push(() => taper(l.pts, l.w, null)); if (!o.noArms && !o.armLFront) P.push(() => taper(aL.pts, aL.w, null));
    P.push(() => blobPath(body, .45, true)); for (const hn of horns) P.push(() => taper(hn.pts, hn.w, null)); P.push(() => blobPath(head, .5, true));
    if (!o.noArms) { if (o.armLFront) P.push(() => taper(aL.pts, aL.w, null)); P.push(() => taper(aR.pts, aR.w, null)); } return P; };
  const paint = (style, grow, glowCol, blur) => { ctx.save(); ctx.fillStyle = style; ctx.strokeStyle = style; ctx.lineWidth = grow * 2; ctx.lineJoin = 'round'; if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = blur; }
    for (const p of parts()) { const r = p(); ctx.fill(); if (grow > 0) ctx.stroke(); }
    if (tail) { const a = Math.atan2(tip[1] - tail.pts[2][1], tip[0] - tail.pts[2][0]); at(tip[0], tip[1], armW * 1.1 + grow, a + Math.PI / 2, () => { blob([[0, .5], [.8, .1], [0, -1.3], [-.8, .1]], style, .3); }); }
    ctx.restore(); };
  // taper() fills only when given a style, so build each path and fill here
  const _t = taper; const tp = (pts, w) => _t(pts, w, ctx.fillStyle);
  const run = (style, grow, glowCol, blur) => { ctx.save(); ctx.fillStyle = style; if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = blur; }
    const g = grow, T = (q) => tp(q.pts, q.w.map(v => v + g * 2)), B = (pts) => { blobPath(pts, .47, true); ctx.fill(); if (g > 0) { ctx.lineWidth = g * 2; ctx.lineJoin = 'round'; ctx.strokeStyle = style; ctx.stroke(); } };
    if (tail) { T(tail); const a = Math.atan2(tip[1] - tail.pts[2][1], tip[0] - tail.pts[2][0]); at(tip[0], tip[1], armW * 1.15 + g, a + Math.PI / 2, () => blob([[0, .5], [.85, .1], [0, -1.4], [-.85, .1]], style, .3)); }
    if (!o.noLegs) legs.forEach(T); if (!o.noArms && !o.armLFront) T(aL); B(body); horns.forEach(T); B(head);
    if (!o.noArms) { if (o.armLFront) T(aL); T(aR); } ctx.restore(); };
  if (dev) {
    const heat = o.heat ?? .6 + .4 * age;
    run(rgba(D.red), lw * 1.1, rgba([255, 40, 20], .95), h * .05 + 14); run(rgba(D.ember, .9), lw * .7);              // the glowing edge
    run(rgba(D.ink), 0);
    // the furnace in its belly shows through
    const by = lerp(shY, hipY, .6), bx = lerp(sx, o.x, .7); if (!o.noBelly) { additive(() => glow(D.red, bx, by, bw * 1.25, .5 * heat));
      blob([[bx, by - bw * .55], [bx + bw * .26, by], [bx, by + bw * .6], [bx - bw * .26, by]], rgba(D.ember, .9 * heat), .5); blob([[bx, by - bw * .3], [bx + bw * .1, by], [bx, by + bw * .34], [bx - bw * .1, by]], rgba(D.hot, heat), .5); }
    ctx.save(); ctx.translate(headC[0], headC[1]); ctx.rotate((o.tilt || 0) + lean * .5); faceDevil(hr, o.expr, { age, look: o.look, turn: o.turn, heat });
    if (o.hat) at(o.hat[0] * hr, o.hat[1] * hr, hr * (o.hat[2] || 1), o.hat[3] || 0, () => { poly([[-.3, 0], [.3, 0], [0, -.9]], rgba([70, 170, 200])); stroke([[-.2, -.3], [.22, -.36]], .07, 'rgba(255,255,255,.8)'); stroke([[-.12, -.56], [.13, -.6]], .07, 'rgba(255,255,255,.8)'); disc(0, -.92, .1, 'rgb(255,255,255)'); });
    ctx.restore();
  } else {
    const dim = o.dim || 0, cream = mix(o.col || D.cream, D.stage, dim), creamS = mix(D.creamS, D.stage, dim);
    run(rgba(mix(D.line, D.stage, dim * .5)), lw); run(rgba(cream), 0);
    inside(() => { blobPath(body, .47, true); }, () => { rectf(o.x - h, shY - h * .05, h * 2, h * .08, lg(0, shY - h * .03, 0, shY + h * .04, [[0, creamS, .9], [1, creamS, 0]])); rectf(o.x - h, top, h * 2, h, lg(sx, 0, sx + bw * 1.2, 0, [[0, creamS, 0], [1, creamS, .8]])); });
    inside(() => { blobPath(head, .5, true); }, () => rectf(headC[0] - hr * 2, headC[1] - hr * 2, hr * 4, hr * 4, lg(headC[0] + hr * .2, 0, headC[0] + hr * 1.1, 0, [[0, creamS, 0], [1, creamS, .85]])));
    if (!o.noArms) for (const a of [aL, aR]) { taper(a.pts, a.w.map(v => v + lw * 2), rgba(mix(D.line, D.stage, dim * .5))); taper(a.pts, a.w, lg(a.pts[0][0], 0, a.pts[0][0] + bw, 0, [[0, cream], [1, mix(cream, creamS, .5)]])); }
    if (o.glowOn) { const [c, a] = o.glowOn; inside(() => { blobPath(head, .5, true); }, () => additive(() => glow(c, headC[0] + hr * (o.glowSide ?? 1), headC[1] + hr * .2, hr * 1.5, a))); inside(() => { blobPath(body, .47, true); }, () => additive(() => glow(c, sx + bw * (o.glowSide ?? 1), shY + h * .1, bw * 2, a))); }
    if (kid) { const bx = headC[0] + hr * .1, by = headC[1] - hr * .98;                                                                 // her yellow bow
      for (const sd of [-1, 1]) { blob(jit([[bx, by], [bx + sd * hr * .5, by - hr * .32], [bx + sd * hr * .56, by + hr * .2]], lw * .2, s), rgba(D.line), .3); blob([[bx + sd * hr * .04, by], [bx + sd * hr * .44, by - hr * .24], [bx + sd * hr * .49, by + hr * .13]], rgba(D.yellow), .3); }
      disc(bx, by, hr * .12, rgba(D.line)); disc(bx, by, hr * .08, rgba(D.yellow)); }
    ctx.save(); ctx.translate(headC[0], headC[1]); ctx.rotate((o.tilt || 0) + lean * .5); if (!o.noFace) faceD(hr, o.expr, { look: o.look, turn: o.turn, kid, seed: s, skin: cream }); ctx.restore();
  }
  return { head: headC, hr, shL, shR, hip: [o.x, hipY], shY, sx, bw, armEndL: aL.pts[2], armEndR: aR.pts[2] };
}
function devArm(pts, w, blur = 40) { ctx.save(); ctx.shadowColor = rgba([255, 40, 20], .95); ctx.shadowBlur = blur; taper(pts, w.map(v => v + 12), rgba(D.red)); ctx.restore(); taper(pts, w.map(v => v + 5), rgba(D.ember, .9)); taper(pts, w, rgba(D.ink)); }
// ---- props, drawn like the people: a dark outline, flat muted colour ----
function outlined(pathFn, fill, lw = 5) { pathFn(); ctx.lineWidth = lw * 2; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(D.line); ctx.stroke(); pathFn(); ctx.fillStyle = fill; ctx.fill(); }
function glassD(x, y, s, fill = .6, foam = 0, lineCol = D.propL) {
  const w0 = s * .32, w1 = s * .4, path = () => poly([[x - w0, y], [x + w0, y], [x + w1, y - s], [x - w1, y - s]]);
  path(); ctx.fillStyle = 'rgba(150,170,190,.16)'; ctx.fill();
  inside(path, () => { rectf(x - w1, y - s * fill, w1 * 2, s * fill, rgba(D.amber)); if (foam) rectf(x - w1, y - s * fill - s * foam, w1 * 2, s * foam + 1, rgba(D.white)); rectf(x - w1 * .75, y - s, w1 * .2, s, 'rgba(255,255,255,.3)'); });
  path(); ctx.lineWidth = Math.max(3, s * .025); ctx.strokeStyle = rgba(lineCol); ctx.lineJoin = 'round'; ctx.stroke();
}
function bottleD(x, y, s, o = {}) {
  const w = s * .17, path = () => { ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - w, y - s * .58); ctx.bezierCurveTo(x - w, y - s * .72, x - w * .36, y - s * .72, x - w * .36, y - s * .84); ctx.lineTo(x - w * .36, y - s); ctx.lineTo(x + w * .36, y - s); ctx.lineTo(x + w * .36, y - s * .84); ctx.bezierCurveTo(x + w * .36, y - s * .72, x + w, y - s * .72, x + w, y - s * .58); ctx.lineTo(x + w, y); ctx.closePath(); };
  path(); ctx.fillStyle = rgba(o.col || [70, 130, 110], o.alpha ?? .3); ctx.fill();
  inside(path, () => { if (o.fill) rectf(x - w, y - s * .6 * o.fill, w * 2, s * .6 * o.fill, rgba(D.amber, .9)); if (o.inside) o.inside(); rectf(x - w * .78, y - s, w * .24, s, 'rgba(255,255,255,.26)'); });
  path(); ctx.lineWidth = Math.max(3, s * .016); ctx.strokeStyle = rgba(o.lineCol || [150, 210, 190]); ctx.lineJoin = 'round'; ctx.stroke();
  if (o.cork) outlined(() => { ctx.beginPath(); ctx.rect(x - w * .32, y - s * 1.07, w * .64, s * .09); }, rgba([186, 140, 96]), 2.5);
}
function lampD(x, y, len) { stroke([[x, 0], [x, y - 40]], 4, rgba(D.floor)); outlined(() => poly([[x - 34, y - 40], [x + 34, y - 40], [x + 70, y], [x - 70, y]]), rgba(D.prop), 4); cone(x, y, 60, len * .62, len, [255, 220, 160], .2); glow([255, 226, 170], x, y + 10, 120, .6); }

const STILLS = {
  cast: t => {
    stageD(760, { pool: [700, 420, 900, [255, 220, 170], .16] });
    const G = 760;
    figure({ kind: 'sam', x: 250, y: G, h: 430, expr: 'tired', look: [.4, 0], t });
    figure({ kind: 'lily', x: 500, y: G, h: 235, expr: 'smile', look: [-.5, -.5], t });
    figure({ kind: 'devil', x: 800, y: G, h: 450, stage: 3, expr: 'charm', look: [-.6, 0], armR: [960, 500], bendR: -.4, tail: [.36, -.2], t });
    figure({ kind: 'devil', x: 1060, y: G, h: 280, stage: 2, expr: 'sly', look: [-.4, 0], tail: [.4, -.26], t });
    figure({ kind: 'devil', x: 1250, y: G, h: 160, stage: 1, expr: 'happy', tail: [.46, -.34], t });
    figure({ kind: 'devil', x: 1372, y: G, h: 44, stage: 0, expr: 'sweet', tail: [.5, -.4], t, lw: .03 });
    ctx.save(); ctx.beginPath(); ctx.arc(1400, 440, 150, 0, TAU); ctx.fillStyle = rgba([24, 22, 28]); ctx.fill(); ctx.clip();
    figure({ kind: 'devil', x: 1400, y: 560, h: 240, stage: 0, expr: 'sweet', look: [-.3, -.2], armL: [1300, 410], bendL: .4, tail: [.44, -.3], t }); ctx.restore();
    ctx.beginPath(); ctx.arc(1400, 440, 150, 0, TAU); ctx.lineWidth = 4; ctx.strokeStyle = rgba(D.white, .7); ctx.stroke(); stroke([[1376, 706], [1392, 592]], 3, rgba(D.white, .6));
    figure({ kind: 'devil', x: 1800, y: G + 150, h: 800, stage: 4, expr: 'grin', look: [-.8, .6], lean: -.1, armL: [1610, 700], tail: [.2, -.2], noLegs: true, t });
    hw('Sam', 250, 812, 40); hw('Lily', 500, 812, 40); hw('34', 800, 812, 40, 'devil'); hw('31', 1060, 812, 40, 'devil'); hw('26', 1250, 812, 40, 'devil'); hw('21', 1372, 812, 40, 'devil'); hw('38', 1800, 812, 40, 'devil');
    const face = (x, kind, expr, extra = {}) => { const r = 62, col = kind === 'devil' ? D.ink : D.cream; ctx.save();
      if (kind === 'devil') { ctx.shadowColor = rgba([255, 40, 20], .95); ctx.shadowBlur = 22; disc(x, 965, r + 4, rgba(D.red)); ctx.shadowBlur = 0; disc(x, 965, r, rgba(D.ink)); ctx.translate(x, 965); faceDevil(r, expr, extra); }
      else { disc(x, 965, r + 4.5, rgba(D.line)); disc(x, 965, r, rgba(col)); ctx.translate(x, 965); faceD(r, expr, extra); } ctx.restore(); };
    ['laugh', 'tired', 'tempted', 'horror', 'resolve'].forEach((e, i) => face(110 + i * 165, 'sam', e));
    ['fear', 'smile'].forEach((e, i) => face(960 + i * 165, 'lily', e, { kid: true }));
    [['charm', .75], ['sly', .75], ['plead', .25], ['rage', 1]].forEach(([e, a], i) => face(1320 + i * 165, 'devil', e, { age: a }));
    finish({ bloom: .07, grain: .03, vignette: .5, t });
  },
  m1: t => {
    stageD(0, { pool: [760, 420, 820, [255, 206, 150], .2] });
    for (let i = 0; i < 16; i++) { const x = 60 + i * 124, y = 70 + Math.sin(i * .9) * 26 + (i % 2) * 14; glow([[255, 200, 120], [255, 150, 110], [150, 210, 220]][i % 3], x, y, 34, .7); }   // party lights
    curve(Array.from({ length: 9 }, (_, i) => [i * 240, 62 + (i % 2) * 22]), 2.5, rgba(D.floor), .5);
    figure({ kind: 'sam', x: 300, y: 1000, h: 520, expr: 'laugh', dim: .72, noFace: false, look: [.5, 0], t, seed: 9 });                                    // a friend, far off
    const gx = 1330, gy = 900, gs = 380, rimY = gy - gs;
    const sam = figure({ kind: 'sam', x: 760, y: 1700, h: 1500, expr: 'laugh', look: [.9, .1], turn: .5, tilt: .06, armR: [gx - 150, gy - 150], bendR: .5, armL: [560, 1300], noLegs: true, glowOn: [D.ember, .28], glowSide: 1, t, stretch: true });
    glassD(gx, gy, gs, .72, .1);
    taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 20, gy - 160]], [116, 112, 100], rgba(D.line)); taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 22, gy - 160]], [104, 100, 88], rgba(D.cream));   // his arm ends round the glass
    for (const [x, y, r] of [[gx - 116, rimY + 8, 30], [gx - 60, rimY - 8, 38], [gx + 126, rimY + 4, 30], [gx + 86, rimY + 26, 24]]) { disc(x, y, r + 4, rgba(D.line)); }
    for (const [x, y, r] of [[gx - 116, rimY + 8, 30], [gx - 60, rimY - 8, 38], [gx + 126, rimY + 4, 30], [gx + 86, rimY + 26, 24]]) { disc(x, y, r, rgba(D.white)); }
    figure({ kind: 'devil', x: gx + 16, y: rimY + 6, h: 250, stage: 0, expr: 'happy', look: [-.9, 0], tilt: -.1, sit: -1, armL: [gx - 120, rimY - 150], armR: [gx + 150, rimY - 140], bendL: .3, bendR: -.3, tail: [.46, -.36], heat: 1, t });
    disc(gx + 60, rimY - 236, 22, rgba(D.white)); disc(gx + 86, rimY - 224, 13, rgba(D.white));                                                           // foam on its head
    counter('AGE: 21'); hw('you’re funnier with me.', 1010, 1000, 76, 'devil');
    finish({ bloom: .07, grain: .03, vignette: .5, t });
  },
  m2: t => {
    stageD(0, {});
    for (let r = 0; r < 2; r++) { stroke([[240, 300 + r * 190], [1680, 300 + r * 190]], 4, rgba(D.floor, .8));                                              // the shelf behind, in faint outline
      for (let i = 0; i < 12; i++) { const x = 300 + i * 118 + r * 40, hh = 110 + rnd(i * 3 + r) * 40; bottleD(x, 298 + r * 190, hh, { col: [[70, 130, 110], [150, 100, 50], [90, 100, 140]][(i + r) % 3], alpha: .22, fill: .3 + rnd(i) * .5, lineCol: [90, 100, 110] }); } }
    lampD(900, 150, 900);
    const cy = 860;
    const dv = figure({ kind: 'devil', x: 1150, y: 1290, h: 1080, stage: 3, expr: 'charm', look: [-.9, .2], lean: -.12, tilt: -.12, noLegs: true, noArms: true, noTail: true, noBelly: true, t });
    const sam = figure({ kind: 'sam', x: 700, y: 1260, h: 1020, expr: 'tempted', look: [.5, .9], turn: .3, tilt: .04, noLegs: true, noArms: true, glowOn: [D.red, .3], glowSide: 1, t });
    // its arm round his shoulders, and the arm that pours
    devArm([[dv.shL[0] + 30, dv.shL[1] + 20], [sam.sx + 40, sam.shY - 10], [sam.shL[0] - 30, sam.shL[1] + 90]], [84, 82, 76]);
    stroke([[944, 672], [916, 720], [900, cy - 20]], 8, rgba(D.amber));
    at(1210, 606, 1, -1.826, () => bottleD(0, 0, 280, { fill: .6, col: [40, 110, 84], alpha: .85 }));
    devArm([[dv.shR[0] + 10, dv.shR[1] + 40], [1420, 760], [1196, 640]], [84, 82, 76]);
    rectf(0, cy, W, H - cy, rgba([16, 13, 14])); stroke([[0, cy], [W, cy]], 5, rgba(D.wood)); additive(() => { ctx.save(); ctx.translate(900, cy + 8); ctx.scale(1, .08); glow([255, 210, 150], 0, 0, 760, .3); ctx.restore(); });
    glassD(890, cy - 2, 170, .4);
    counter('AGE: 34'); hw('one more. you earned it.', 960, 980, 76, 'devil');
    finish({ bloom: .07, grain: .03, vignette: .5, t });
  },
  m3: t => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14] });
    for (let i = 0; i < 13; i++) { const x = 90 + i * 104, y = 84 + Math.sin(i / 12 * Math.PI) * 50; outlined(() => poly([[x, y], [x + 70, y + 4], [x + 35, y + 80]]), rgba([[70, 150, 170], [190, 90, 120], [220, 216, 206], [110, 100, 180]][i % 4]), 3.5); }
    curve([[70, 80], [720, 142], [1450, 86]], 3, rgba(D.floor), .5);
    for (const [x, y, c] of [[110, 520, [70, 150, 170]], [215, 450, [190, 90, 120]]]) { stroke([[x, y + 62], [x + 8, 900]], 2.5, rgba(D.floor)); outlined(() => { ctx.beginPath(); ctx.ellipse(x, y, 50, 62, 0, 0, TAU); }, rgba(c), 3.5); oval(x - 16, y - 22, 10, 16, 'rgba(255,255,255,.35)'); }
    // the giant in his chair, bent under the ceiling
    const ty = 770;
    const g = figure({ kind: 'devil', x: 1480, y: 1240, h: 1230, stage: 4, expr: 'grin', look: [-.9, .8], lean: -.3, tilt: -.3, headDx: -.1, headDy: .62, noLegs: true, noArms: true, noTail: true, hat: [.86, -1.9, .9, .5], t });
    outlined(() => { ctx.beginPath(); ctx.rect(420, ty, 1560, 36); }, rgba(D.wood), 5); outlined(() => { ctx.beginPath(); ctx.rect(470, ty + 36, 34, 100); }, rgba(mix(D.wood, D.stage, .3)), 5);
    additive(() => { ctx.save(); ctx.translate(1120, ty + 6); ctx.scale(1, .07); glow(D.red, 0, 0, 700, .5); ctx.restore(); });
    devArm([[g.shL[0] - 30, g.shL[1] + 60], [760, 560], [800, ty - 46]], [150, 130, 104], 50);                 // one arm comes down beside the bottle
    devArm([[g.shR[0] + 20, g.shR[1] + 80], [1800, 640], [1560, ty - 44]], [150, 130, 104], 50);
    const cx = 1130; outlined(() => { ctx.beginPath(); ctx.rect(cx - 140, ty - 92, 280, 92); }, rgba(D.white), 5);
    for (let i = 0; i < 8; i++) blob([[cx - 140 + i * 36, ty - 92], [cx - 122 + i * 36, ty - 62 - (i % 3) * 7], [cx - 104 + i * 36, ty - 92]], rgba([226, 120, 150]), .5);
    for (let i = 0; i < 6; i++) { const x = cx - 100 + i * 40, y = ty - 96; outlined(() => { ctx.beginPath(); ctx.rect(x - 5, y - 44, 10, 44); }, rgba([[90, 170, 190], [230, 226, 216]][i % 2]), 2.5); glow([255, 200, 120], x, y - 60, 46, .8); blob([[x, y - 46], [x + 9, y - 58], [x - 3, y - 84], [x - 9, y - 58]], rgba(D.hot), .5); }
    bottleD(640, ty, 290, { cork: true, alpha: .2, col: [120, 170, 150], inside: () => figure({ kind: 'sam', x: 640, y: ty - 8, h: 165, expr: 'horror', look: [-.6, .2], armL: [600, ty - 150], armR: [680, ty - 150], bendL: .4, bendR: -.4, t, lw: .02 }) });
    figure({ kind: 'lily', x: 250, y: 900, h: 300, expr: 'fear', look: [.9, -.8], turn: .5, tilt: -.1, armL: [232, 742], armR: [270, 740], bendL: .5, bendR: -.5, glowOn: [D.red, .35], glowSide: 1, t });
    counter('AGE: 38'); hw('THEY ONLY SEE YOU.', 780, 1000, 92, 'devil');
    finish({ bloom: .07, grain: .03, vignette: .5, t });
  }
};

// =====================================================================================================
// THE MOVING TEST: the first scene (AGE 21), 13.5 s. node render.mjs d p1 --frames=405 --fps=30
// =====================================================================================================
const eo = k => 1 - Math.pow(1 - clamp(k), 3), eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eback = k => { k = clamp(k); return 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2); };
const seg = (t, a, b) => clamp((t - a) / (b - a));
function camD(z, cx, cy, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function lightsD(t, y0 = 70, dim = 1) {
  curve(Array.from({ length: 12 }, (_, i) => [-200 + i * 220, y0 - 8 + (i % 2) * 22]), 2.5, rgba(D.floor), .5);
  for (let i = 0; i < 20; i++) { const x = -160 + i * 118, y = y0 + Math.sin(i * .9) * 20 + (i % 2) * 14, tw = .75 + .25 * Math.sin(t * (2 + (i % 3)) + i * 1.7); glow([[255, 200, 120], [255, 150, 110], [150, 210, 220]][i % 3], x, y, 34, .7 * tw * dim); }
}
const blinkAt = (t, times, d = .13) => Math.max(0, ...times.map(b => 1 - Math.abs(t - b) / d));
const devEx = (name, t, times = []) => { const e = DX[name], b = blinkAt(t, times); return { ...e, h: e.h * (1 - .92 * b) }; };
const samEx = (name, t, times = []) => { const e = FX[name], b = blinkAt(t, times); return e.arc ? e : { ...e, lid: Math.max(e.lid, b) }; };
function foamD(pts, t, lift = 0) { for (const pass of [0, 1]) for (const [x, y, r, ph] of pts) disc(x, y + Math.sin(t * 3 + ph) * 3 - lift * ph, pass ? r : r + 4.5, rgba(pass ? D.white : D.line)); }
// the glass seen close: the rim is at rimY
function macroGlass(t, gx, rimY, shake = 0) { const s = 760, gy = rimY + s; glassD(gx + shake, gy, s, .9, .075, D.propL); }
STILLS.p1 = t => {
  const T = [0, 2.6, 5.6, 7.4, 10.4, 13.5], si = T.findIndex((a, i) => t >= a && t < T[i + 1]), L = t - T[Math.max(0, si)], u = L / (T[si + 1] - T[si]);
  const push = 1 + .06 * u;
  if (si === 0) {                                                                    // ---- the party, wide ----
    camD(push, 960, 560, () => {
      stageD(860, { pool: [960, 470, 800, [255, 214, 160], .2] }); lightsD(t, 110);
      const up = eo(seg(L, .35, 1.0)), laugh = L > 1.25, bob = k => laugh ? Math.abs(Math.sin((L - 1.25) * 9 + k)) * 12 : 0;
      for (const [x, h, k, sd] of [[520, 400, 1, 1], [1330, 430, 2.2, -1]]) { const b = bob(k), gxx = x + sd * 90, gyy = lerp(660, 520, up) - b;
        figure({ kind: 'sam', x, y: 860 - b * .3, h, expr: laugh ? 'laugh' : 'smile', look: [sd * .6, 0], dim: .55, seed: 9 + k, t, armR: sd > 0 ? [gxx, gyy + 30] : undefined, armL: sd < 0 ? [gxx, gyy + 30] : undefined, bendR: .4, bendL: -.4, tilt: laugh ? Math.sin(L * 9 + k) * .05 : 0 });
        ctx.save(); ctx.globalAlpha = .6; glassD(gxx, gyy + 36, 84, .7, .1, [90, 96, 110]); ctx.restore(); }
      const b = bob(0), gx = 1052, gy = lerp(700, 512, up) - b;
      const sam = figure({ kind: 'sam', x: 930, y: 860 - b * .3, h: 450, expr: laugh ? 'laugh' : samEx('smile', L, [.8]), look: [.5, -.2 * up], armR: [gx - 6, gy + 34], bendR: .5, tilt: laugh ? Math.sin(L * 9) * .05 : 0, t });
      glassD(gx, gy + 44, 104, .72, .12);
      if (L > 1.9) { const k = eo(seg(L, 1.9, 2.1)); additive(() => glow(D.red, gx, gy - 62, 60 * k, .9)); for (const sd of [-1, 1]) oval(gx + sd * 9, gy - 62, 4.5 * k, 6 * k * (1 - blinkAt(L, [2.35], .1)), rgba(D.hot)); }
    });
    counter('AGE: 21'); hw('his first one.', 960, 250, 70, 'say', { reveal: seg(L, .5, 1.3) });
  } else if (si === 1 || si === 4) {                                                 // ---- the rim of his glass, close ----
    const gx = 1010, rimY = 650, foam = [[gx - 250, rimY + 6, 44, 0], [gx - 170, rimY - 14, 56, 1.3], [gx - 76, rimY + 2, 50, 2.1], [gx + 20, rimY - 10, 58, .6], [gx + 120, rimY + 6, 48, 2.8], [gx + 210, rimY - 8, 54, 1.9], [gx + 284, rimY + 10, 38, 3.4]];
    let shake = 0;
    const back = si === 4 ? eio(seg(L, 2.2, 2.65)) : 0;
    rectf(0, 0, W, H, rgba(D.stage));
    camD(si === 1 ? push * 1.5 : lerp(push * 1.36, 1.02, back), si === 1 ? gx : gx - 150, rimY - (si === 1 ? 120 : lerp(110, 250, back)), () => {
      rectf(-400, -600, W + 800, H + 1200, rgba(D.stage)); glow([255, 206, 150], gx, 520, 760, .16); lightsD(t, si === 4 ? 60 - 190 * back : 60, .6);
      if (si === 1) {
        const rise = eback(seg(L, .95, 1.45)), shakeE = Math.sin(seg(L, 1.75, 2.45) * Math.PI), sn = seg(L, 2.45, 2.7), snap = seg(L, 2.7, 2.82);
        macroGlass(t, gx, rimY);
        const tilt = Math.sin((L - 1.75) * 42) * .3 * shakeE + (L > 2.45 ? lerp(lerp(0, -.3, eo(sn)), .16, eo(snap)) * (1 - seg(L, 2.9, 3.0) * .6) : 0);
        const ex = L < 1.7 ? devEx('sweet', L, [1.55]) : L < 2.45 ? { ...DX.sulk, m: 'cat' } : L < 2.7 ? { ...DX.plead, h: .3, m: 'pout' } : devEx('happy', L, []);
        if (L > .9) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, rimY + 30); ctx.clip();
          const y = lerp(rimY + 330, rimY + 18, rise), armUp = seg(L, 1.25, 1.6) * (1 - seg(L, 1.75, 1.9));
          const f = figure({ kind: 'devil', x: gx + Math.sin((L - 1.75) * 42) * 14 * shakeE, y, h: 300, stage: 0, expr: ex, look: [-.5, .1], tilt, armL: armUp ? [gx - 150, y - 300 * (.3 + .4 * armUp)] : undefined, armR: armUp ? [gx + 150, y - 300 * (.3 + .4 * armUp)] : undefined, bendL: .3, bendR: -.3, tail: [.44 + .05 * Math.sin(t * 6), -.34 + .05 * Math.cos(t * 5)], heat: 1, t });
          if (L < 1.8) { const fy = lerp(0, 1, seg(L, 1.72, 1.8)); disc(f.head[0] + 50, f.head[1] - f.hr * .98 - fy * 60, 30, rgba(D.white, 1 - fy)); disc(f.head[0] + 84, f.head[1] - f.hr * .86 - fy * 80, 18, rgba(D.white, 1 - fy)); }
          ctx.restore();
          // it shakes itself dry
          for (let i = 0; i < 22; i++) { const t0 = 1.76 + rnd(i * 3.1) * .55, a = L - t0; if (a < 0 || a > .7) continue; const ang = -Math.PI * rnd(i * 5.3), v = 420 + rnd(i * 7.7) * 380;
            const x = f.head[0] + Math.cos(ang) * (60 + v * a), yy = f.head[1] + Math.sin(ang) * (60 + v * a) + 900 * a * a; disc(x, yy, 7 - a * 6, rgba(i % 3 ? D.white : D.amber, 1 - a / .7)); }
          // and sneezes a spark
          if (L > 2.7) { const a = L - 2.7, px = f.head[0] - 130 - a * 520, py = f.head[1] + 60 + a * 60, k = 1 - seg(a, 0, .6);
            additive(() => glow(D.ember, px, py, 110 * k + 20, .9 * k)); blob([[px + 40 * k, py], [px, py - 26 * k], [px - 60 * k, py], [px, py + 26 * k]], rgba(D.hot, k), .5);
            for (let i = 0; i < 9; i++) { const ax = px + (rnd(i * 2.3) - .3) * 220 * a + 30, ay = py + (rnd(i * 4.1) - .5) * 200 * a - 120 * a; disc(ax, ay, 5 * k, rgba(D.ember, k)); } }
        }
        foamD(foam, t);
        if (L > .3 && L < 1.0) { const k = eo(seg(L, .3, .5)) * (1 - seg(L, .92, 1.0)); additive(() => glow(D.red, gx, rimY - 16, 120 * k, .8)); for (const sd of [-1, 1]) oval(gx + sd * 26, rimY - 22, 13 * k, 19 * k * (1 - blinkAt(L, [.68], .09)), rgba(D.hot)); }
      } else {
        const tipK = eo(seg(L, .1, .85)) * (1 - eio(seg(L, 1.55, 2.05))), tip = [lerp(-260, gx - 196, tipK), lerp(1060, rimY - 150, tipK)], leanK = eio(seg(L, .75, 1.15)) * (1 - eio(seg(L, 1.4, 1.75)));
        const flare = Math.sin(seg(L, 1.45, 2.2) * Math.PI), pop = eback(seg(L, 2.2, 2.6)), popped = L >= 2.2, st = popped ? lerp(0, 1, eo(seg(L, 2.2, 2.45))) : 0;
        shake = popped ? Math.sin((L - 2.2) * 46) * 16 * (1 - seg(L, 2.2, 2.9)) : 0;
        macroGlass(t, gx, rimY, shake);
        const h = 300 * (1 + .06 * flare) * (popped ? lerp(1, 1.85, pop) : 1);
        const ex = L < .75 ? devEx('sweet', L, [.4]) : L < 1.45 ? DX.happy : L < 1.95 ? { ...DX.sweet, h: 1.4, pup: .7 } : L < 2.2 ? { ...DX.happy, h: .35 } : devEx('charm', L, [2.95]);
        const f = figure({ kind: 'devil', x: gx + 40 + shake, y: rimY + 6, h, stage: st, expr: ex, look: popped ? [-.7, .2] : [-.9, .1], lean: -.2 * leanK, tilt: -.16 * leanK + (popped ? Math.sin((L - 2.2) * 5) * .05 : 0), sit: -1, armL: leanK > .1 ? [tip[0] + 70, tip[1] + 30] : undefined, bendL: .3, tail: [.44 + .07 * Math.sin(t * (popped ? 9 : 6)), -.34 + .05 * Math.cos(t * 5)], heat: 1 + 2 * flare, t });
        if (L > 1.95 && L < 2.45) { const a = L - 1.95, px = f.head[0] - 60, py = f.head[1] - 150 - a * 320, k = 1 - seg(a, 0, .5); additive(() => glow(D.ember, px, py, 90 * k + 20, .9 * k)); blob([[px, py + 40 * k], [px + 30 * k, py], [px, py - 70 * k], [px - 30 * k, py]], rgba(D.hot, k), .5); }
        if (popped) { const a = seg(L, 2.2, 2.75); ctx.lineWidth = 14 * (1 - a); ctx.strokeStyle = rgba(D.red, 1 - a); ctx.beginPath(); ctx.arc(f.hip[0], f.hip[1] - h * .4, 120 + a * 520, 0, TAU); ctx.stroke(); }
        foamD(foam.map(([x, y, r, ph]) => [x + shake, y - (popped ? Math.sin(seg(L, 2.2, 2.8) * Math.PI) * 26 * (1 + ph * .3) : 0), r, ph]), t);
        // his fingertip with a drop on it
        const base = [tip[0] - 520, tip[1] + 380], mid = [tip[0] - 220, tip[1] + 120];
        taper([base, mid, tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([base, mid, tip], [150, 132, 104], lg(0, tip[1] - 60, 0, tip[1] + 200, [[0, D.cream], [1, D.creamS]]));
        if (L < 1.2) { const dx = tip[0] + 44, dy = tip[1] - 30, k = 1 - seg(L, 1.05, 1.2); blob([[dx, dy - 34 * k], [dx + 20 * k, dy + 4], [dx, dy + 24 * k], [dx - 20 * k, dy + 4]], rgba(D.amber), .5); disc(dx - 6, dy, 5 * k, 'rgba(255,255,255,.8)'); }
      }
    });
    counter('AGE: 21');
    if (si === 4 && L > 2.5) hw('it was so small.', 440, 470, 76, 'say', { reveal: seg(L, 2.5, 2.95) });
    if (si === 4 && L >= 2.2 && L < 2.3) rectf(0, 0, W, H, rgba(D.red, .28 * (1 - seg(L, 2.2, 2.3))));
  } else if (si === 2) {                                                             // ---- his face ----
    camD(push, 960, 540, () => {
      stageD(0, { pool: [900, 500, 800, [255, 206, 150], .18] }); lightsD(t, 50, .7);
      const laugh = L > .62, k = laugh ? (L - .62) : 0, bob = laugh ? Math.abs(Math.sin(k * 9.5)) * 26 : 0, flick = .32 + .1 * Math.sin(t * 17) + .06 * Math.sin(t * 31);
      figure({ kind: 'sam', x: 900, y: 2060 - bob, h: 1900, expr: laugh ? 'laugh' : { eh: 1.2, lid: 0, bi: -.2, bo: .04, m: 'gasp', small: true }, look: [.8, .3], turn: .35, tilt: laugh ? .05 + Math.sin(k * 9.5) * .04 : -.03, noLegs: true, noArms: true, glowOn: [D.ember, flick], glowSide: 1, t });
    });
    counter('AGE: 21');
  } else {                                                                           // ---- the two of them ----
    camD(push, 1000, 560, () => {
      stageD(0, { pool: [760, 420, 820, [255, 206, 150], .2] }); lightsD(t, 70);
      figure({ kind: 'sam', x: 300, y: 1000, h: 520, expr: 'laugh', dim: .72, look: [.5, 0], t, seed: 9 });
      const gx = 1330, gy = 900, gs = 380, rimY = gy - gs, nod = Math.sin(L * 2.4) * .02;
      figure({ kind: 'sam', x: 760, y: 1700, h: 1500, expr: samEx('smile', L, [1.2, 2.5]), look: [.9, .1], turn: .5, tilt: .06 + nod, armR: [gx - 150, gy - 150], bendR: .5, armL: [560, 1300], noLegs: true, glowOn: [D.ember, .28 + .05 * Math.sin(t * 13)], glowSide: 1, t, stretch: true });
      glassD(gx, gy, gs, .72, .1);
      taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 20, gy - 160]], [116, 112, 100], rgba(D.line)); taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 22, gy - 160]], [104, 100, 88], rgba(D.cream));
      const foam = [[gx - 116, rimY + 8, 30, 0], [gx - 60, rimY - 8, 38, 1.4], [gx + 126, rimY + 4, 30, 2.2], [gx + 86, rimY + 26, 24, 3]];
      figure({ kind: 'devil', x: gx + 16, y: rimY + 6 + Math.sin(t * 5) * 3, h: 250, stage: 0, expr: L > 2.35 ? devEx('happy', L, []) : devEx('sweet', L, [.9, 2.0]), look: [-.9, -.2], tilt: -.1 + Math.sin(L * 2.6) * .13, sit: -1, tail: [.46 + .06 * Math.sin(t * 6), -.36 + .05 * Math.cos(t * 5)], heat: 1, t });
      foamD(foam, t);
    });
    counter('AGE: 21'); hw('you’re funnier with me.', 1010, 1000, 76, 'devil', { reveal: seg(L, .55, 1.75) });
  }
  finish({ bloom: .07, grain: .03, vignette: .5, t });
};
