'use strict';
// THE CAST AND THE LOOK (locked 17 Nov 2026: the owner approved it and said every film and Short follows it; never
// redraw the people or the devil, only pose them). LOOK D: the genre look the owner pointed at (17 Nov 2026): a near-black stage, one pool of light, a thin floor line,
// simple cream people drawn like marker cartoons, a black devil with a red glowing edge, handwritten words.
// Our own construction and faces: a round head on a bean body, four soft tubes; no hands, feet, hair or clothes.
// The devil is the same construction in black ("it is him"), with horns, a tail and a face made of fire.
const D = {
  stage: [9, 9, 11], floor: [70, 68, 72], cream: [240, 230, 208], creamS: [200, 186, 164], line: [26, 22, 22],
  yellow: [255, 206, 44], red: [255, 56, 40], ember: [255, 130, 50], hot: [255, 214, 130], ink: [12, 9, 11],
  white: [244, 240, 230], prop: [86, 92, 110], propL: [130, 138, 160], wood: [104, 78, 62], amber: [240, 160, 50]
};
// The handwriting: the bundled open font (stage/fonts, loaded by page.html as "IDF Hand"), the same on every machine.
// page.html?font=mac sets STAGE_FONT to the Mac's Chalkboard SE, which film 07 was delivered in (17 Nov 2026).
const FONT = (typeof STAGE_FONT === 'string' && STAGE_FONT) || '"IDF Hand", "Chalkboard SE", "Comic Sans MS", sans-serif';
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
    if (o.lash && !e.arc) for (const k of [0, 1, 2]) stroke([[x + sd * erx * (.5 + k * .3), y - ery * (.85 - k * .22)], [x + sd * erx * (.9 + k * .42), y - ery * (1.25 - k * .2)]], lw * .6, rgba(D.line));
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
  const lean = o.lean || 0, hipY = o.sit ? o.y : o.kneel ? o.y - legL * .55 : o.y - legL, top = o.y - h + (o.drop ?? (o.kneel ? .11 : 0)) * h, headC = [o.x + Math.sin(lean) * (hipY - top - hr) + (o.headDx || 0) * hr, top + hr + (o.headDy || 0) * hr];
  const neck = [lerp(headC[0], o.x, .22), headC[1] + hr * .86], bw = h * (kid ? .13 : .135) * (dev && st > 3 ? 1.9 : 1), sw = bw * (dev && st > 3 ? 1.15 : .82);
  const shY = neck[1] + h * .035, sx = neck[0], shL = [sx - sw * .82, shY + h * .02], shR = [sx + sw * .82, shY + h * .02];
  const body = jit([[sx - sw * .7, shY - h * .02], [sx + sw * .7, shY - h * .02], [sx + sw * 1.02, shY + (hipY - shY) * .25], [lerp(sx, o.x, .7) + bw, lerp(shY, hipY, .68)], [o.x + bw * .8, hipY + h * .02], [o.x - bw * .8, hipY + h * .02], [lerp(sx, o.x, .7) - bw, lerp(shY, hipY, .68)], [sx - sw * 1.02, shY + (hipY - shY) * .25]], lw * .28, s);
  const head = jit(Array.from({ length: 10 }, (_, i) => { const a = i / 10 * TAU; return [headC[0] + Math.cos(a) * hr * (dev ? lerp(1.06, 1, age) : 1.03), headC[1] + Math.sin(a) * hr * (dev ? lerp(.94, 1.04, age) : .97)]; }), lw * .3, s + 3);
  const tube = (a, b, w, bend = 0) => { const m = [(a[0] + b[0]) / 2 + bend * (b[1] - a[1]) * .2, (a[1] + b[1]) / 2 - bend * (b[0] - a[0]) * .2]; return { pts: [a, m, b], w: [w, w * .96, w * .9] }; };
  const defL = [shL[0] - h * .035, shL[1] + armLen], defR = [shR[0] + h * .035, shR[1] + armLen];
  const reach = (sh, to) => { const d = Math.hypot(to[0] - sh[0], to[1] - sh[1]), k = o.stretch ? 1 : Math.min(1, armLen / d); return [sh[0] + (to[0] - sh[0]) * k, sh[1] + (to[1] - sh[1]) * k]; };
  const aL = tube(shL, reach(shL, o.armL || defL), armW, o.bendL ?? -.5), aR = tube(shR, reach(shR, o.armR || defR), armW, o.bendR ?? .5);
  const stride = o.stride || 0, legs = [-1, 1].map(sd => { const hip = [o.x + sd * bw * .42, hipY - h * .01];
    if (o.sit) { const kx = hip[0] + o.sit * legL * .9; return [tube(hip, [kx, hip[1] + legL * .08], legW), tube([kx, hip[1] + legL * .08], o.flat ? [kx + o.sit * legL * .85, hip[1] + legL * .12] : [kx + o.sit * legL * .05, hip[1] + legL * .95], legW)]; }
    if (o.kneel) { const k = [hip[0] + o.kneel * legL * .14, o.y - legW * .45]; return [tube(hip, k, legW), tube(k, [k[0] - o.kneel * legL * .66, o.y - legW * .45], legW)]; }
    return [tube(hip, [o.x + sd * bw * .5 + sd * stride * h * .13, o.y - legW * .45 - (o.lift && sd === o.lift ? h * .05 : 0)], legW, sd * stride * .6)]; }).flat();
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
    if (!o.noLegs) legs.forEach(T); if (!o.noArms && !o.armLFront) T(aL); B(body); horns.forEach(T); if (o.bun) { ctx.beginPath(); ctx.arc(headC[0] - o.bun * hr * .5, headC[1] - hr * .98, hr * .36 + g, 0, TAU); ctx.fill(); } B(head);
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
    ctx.save(); ctx.translate(headC[0], headC[1]); ctx.rotate((o.tilt || 0) + lean * .5); if (!o.noFace) faceD(hr, o.expr, { look: o.look, turn: o.turn, kid, seed: s, skin: cream, lash: o.lash }); ctx.restore();
  }
  return { head: headC, hr, shL, shR, hip: [o.x, hipY], hipY, shY, sx, bw, h, armEndL: aL.pts[2], armEndR: aR.pts[2], belly: [lerp(sx, o.x, .7), lerp(shY, hipY, .6)] };
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

// ---- motion helpers ----
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
