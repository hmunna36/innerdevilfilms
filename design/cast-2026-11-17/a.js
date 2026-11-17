'use strict';
// LOOK A: "EMBER". Solid, rounded, storybook people with big acting faces; the devil is a small red creature with a
// furnace in its belly that grows every time it is fed. Light comes from one side (o.light: -1 left, +1 right) and
// the scene's rim colour edges the other side.

// ---------- colours ----------
const A = {
  skin: [226, 160, 118], skinL: [247, 196, 152], skinS: [156, 92, 78], blush: [236, 110, 96],
  hair: [38, 28, 34], hairL: [92, 66, 70],
  shirt: [238, 234, 226], shirtS: [158, 160, 186], tie: [34, 70, 96], tieL: [70, 128, 150],
  trouser: [50, 54, 74], trouserS: [28, 30, 46], shoe: [30, 24, 28],
  yellow: [255, 206, 46], yellowS: [226, 140, 20], yellowL: [255, 238, 150],
  dev: [196, 34, 38], devL: [244, 84, 58], devS: [92, 10, 34], devD: [52, 6, 26],
  hot: [255, 150, 60], hotL: [255, 226, 140], eye: [255, 214, 84], eyeL: [255, 246, 190],
  tooth: [255, 246, 232], mouth: [70, 6, 22], tongue: [226, 74, 92]
};
const U = (pts, ox = 0, oy = 0, sx = 1, sy = 1) => pts.map(p => [ox + p[0] * sx, oy + p[1] * sy]);
const mirror = pts => pts.concat(pts.slice().reverse().filter(p => Math.abs(p[0]) > 1e-6).map(p => [-p[0], p[1]]));
const mixPts = (a, b, k) => a.map((p, i) => [lerp(p[0], b[i][0], k), lerp(p[1], b[i][1], k)]);

// =====================================================================================================
// THE DEVIL'S HEAD. Unit space: the skull is about 1 wide each side of the centre. o: age 0 (newborn) .. 1 (the
// giant), expr, look [x, y] -1..1, light, rim colour, fed 0..1 (how hot the horns and eyes burn), hat
// =====================================================================================================
const DEV_EX = {
  //        lidT  lidIn  lidOut low  pupil  browIn browOut  mouth
  sweet:  { top: 0, tin: 0, tout: 0, low: .05, pup: 1.25, bin: -.06, bout: 0, mouth: 'cat' },
  happy:  { top: .1, tin: 0, tout: 0, low: .5, pup: 1.1, bin: -.08, bout: 0, mouth: 'open' },
  charm:  { top: .34, tin: 0, tout: .1, low: .22, pup: 1, bin: -.02, bout: -.03, mouth: 'smile' },
  sly:    { top: .5, tin: .12, tout: 0, low: .3, pup: .8, bin: .1, bout: -.1, mouth: 'smirk' },
  plead:  { top: .1, tin: -.3, tout: .34, low: 0, pup: 1.35, bin: -.3, bout: .16, mouth: 'pout' },
  rage:   { top: .3, tin: .62, tout: -.12, low: .28, pup: .45, bin: .34, bout: -.2, mouth: 'roar' },
  grin:   { top: .3, tin: .34, tout: -.06, low: .34, pup: .6, bin: .2, bout: -.12, mouth: 'grin' },
  sulk:   { top: .46, tin: .3, tout: 0, low: .1, pup: .8, bin: .2, bout: 0, mouth: 'frown' }
};
function devilHead(cx, cy, r, o = {}) {
  const age = clamp(o.age ?? 0), ex = typeof o.expr === 'object' ? o.expr : DEV_EX[o.expr || 'charm'], li = o.light ?? -1, fed = o.fed ?? age;
  const rim = o.rim || A.hot, look = o.look || [0, 0];
  const cute = [[0, -1.02], [.62, -.9], [1.04, -.3], [1.06, .28], [.66, .82], [0, .98]];
  const mean = [[0, -1.0], [.6, -.9], [.92, -.36], [.98, .2], [.62, .92], [0, 1.3]];
  const skull = mirror(mixPts(cute, mean, age));
  const hornL = lerp(.34, 1.7, Math.pow(age, .8)), hornW = lerp(.3, .44, age);
  const earS = lerp(1, .62, age);
  at(cx, cy, r, o.tilt || 0, () => {
    // its own light behind the head
    if (o.aura !== false) glow(mix(A.dev, A.hot, .4), 0, -.1, 2.6 + age, .16 + .22 * fed);
    // horns (behind the skull): dark at the root, white-hot at the tip
    for (const s of [-1, 1]) {
      const b = [s * lerp(.5, .56, age), lerp(-.78, -.74, age)], L = hornL * (s === (o.hornBig ?? 0) ? 1.08 : 1);
      const pts = [b, [b[0] + s * .3 * L, b[1] - .28 * L], [b[0] + s * .46 * L, b[1] - .72 * L], [b[0] + s * lerp(.3, .16, age) * L, b[1] - 1.1 * L]];
      const tip = pts[3];
      taper(pts, [hornW * 1.15, hornW * .92, hornW * .55, .02], lg(b[0], b[1], tip[0], tip[1], [[0, A.devD], [.38, mix(A.devS, A.dev, .5)], [.74, mix(A.dev, A.hot, .35 + .5 * fed)], [1, mix(A.hot, A.hotL, fed)]]));
      // a lit edge on the light side and ridges
      taper(pts.map(p => [p[0] + li * .05 * hornW * 2, p[1] - .02]), [hornW * .22, hornW * .18, hornW * .1, .01], rgba(A.hotL, .22 + .2 * fed));
      if (age > .35) for (let i = 1; i <= 4; i++) { const k = i / 6, p = [lerp(pts[0][0], pts[1][0], k * 2 > 1 ? 1 : k * 2), lerp(pts[0][1], pts[1][1], k * 2 > 1 ? 1 : k * 2)]; stroke([[p[0] - hornW * .5, p[1] + .03], [p[0] + hornW * .5, p[1] - .03]], .035, rgba(A.devD, .5 * age)); }
      additive(() => glow(A.hot, tip[0], tip[1] + .06, .16 + .2 * fed, .45 * fed));
    }
    // ears
    for (const s of [-1, 1]) {
      const e = [[s * .94, -.2], [s * (1.0 + .62 * earS), -.62 * earS - .12], [s * (1.02 + .2 * earS), .02], [s * .96, .22]];
      blob(e, lg(s * .9, 0, s * 1.6, -.5, [[0, A.dev], [1, mix(A.dev, A.devL, s === li ? .7 : 0)]]), .35);
      blob(U(e, s * .1, .02, .78, .7), rgba(A.devS, .75), .35);
    }
    // the skull
    const skullPath = () => blobPath(skull, .52, true);
    skullPath(); ctx.fillStyle = rg(li * .42, -.42, .05, 1.9, [[0, A.devL], [.42, A.dev], [1, A.devS]]); ctx.fill();
    inside(skullPath, () => {
      // the shadow side, a designed shape
      rectf(-2, -2, 4, 4, lg(-li * .05, 0, -li * 1.15, .2, [[0, A.devD, 0], [.55, A.devD, .34], [1, A.devD, .72]]));
      rectf(-2, -2, 4, 4, lg(0, -1.1, 0, -.45, [[0, A.devD, .5], [1, A.devD, 0]]));                       // a darker crown between the horns
      if (age > .3) for (const s of [-1, 1]) curve([[s * .86, .0], [s * .7, .34], [s * .46, .6]], .05, rgba(A.devD, .35 * age));   // cheekbones
      // under the brow and under the mouth
      oval(0, lerp(.98, 1.25, age), .7, .3, rgba(A.devD, .45));
      // cheeks light up
      additive(() => { glow(A.hot, -.55, .36, .42, .16 + .1 * (1 - age)); glow(A.hot, .55, .36, .42, .16 + .1 * (1 - age)); glow(A.devL, li * .45, -.62, .6, .32); });
      // the rim of the scene's light on the shadow side
      ctx.save(); ctx.lineWidth = .12; ctx.strokeStyle = lg(-li * .1, 0, -li * .85, 0, [[0, rim, 0], [1, rim, .95]]); ctx.translate(li * .045, 0); skullPath(); ctx.stroke(); ctx.restore();
      additive(() => glow(rim, -li * 1.05, .1, .6, .4));
    });
    // ---- eyes ----
    const ey = lerp(-.02, -.16, age), ex0 = lerp(.44, .42, age), erx = lerp(.31, .3, age), ery = lerp(.36, .2, age);
    for (const s of [-1, 1]) {
      const x = s * ex0, tin = ex.tin, tout = ex.tout, top = ex.top, low = ex.low;
      const slant = lerp(0, .1, age);                                   // the grown devil's eyes slant up at the outer corner
      // the opening: inner corner, top, outer corner, bottom
      const inC = [x - s * erx, ey + slant * .6 + ery * tin * .5], outC = [x + s * erx, ey - slant + ery * tout * .5];
      const topI = [x - s * erx * .5, ey - ery * (1 - top) + ery * tin * 1.1], topM = [x, ey - ery * (1 - top * .8) + ery * (tin + tout) * .35], topO = [x + s * erx * .55, ey - ery * (1 - top) - slant * .6 + ery * tout * 1.1];
      const botO = [x + s * erx * .55, ey + ery * (1 - low) - slant * .3], botM = [x, ey + ery * (1 - low * .8)], botI = [x - s * erx * .5, ey + ery * (1 - low)];
      const open = [inC, topI, topM, topO, outC, botO, botM, botI];
      const eyePath = () => blobPath(open, .5, true);
      // socket shadow
      blob(open.map(p => [x + (p[0] - x) * 1.1, ey - .02 + (p[1] - ey) * 1.12]), rgba(A.devD, .42), .5);
      eyePath(); ctx.fillStyle = rg(x, ey + .04, .02, erx * 1.2, [[0, A.eyeL], [.55, A.eye], [1, mix(A.eye, A.hot, .8)]]); ctx.fill();
      inside(eyePath, () => {
        const px = x + look[0] * erx * .42, py = ey + look[1] * ery * .4 + (top - low) * ery * .2, pw = lerp(.085, .05, age) * ex.pup, ph = lerp(.22, .17, age) * (.8 + .2 * ex.pup);
        oval(px, py, pw * 1.9, ph * 1.25, rgba(A.hot, .55));               // a ring of hotter colour round the pupil
        oval(px, py, pw, ph, rgba([36, 4, 12]));                           // the slit
        disc(px - .09, py - ph * .52, lerp(.07, .035, age), 'rgba(255,255,255,.95)');
        disc(px + .07, py + ph * .4, lerp(.035, .018, age), 'rgba(255,255,255,.7)');
        rectf(x - 1, ey - ery - .2, 2, ery * .5 + top * ery * .5, rgba(A.devD, .28));  // the lid's shadow on the eye
      });
      // lid line and the brow ridge
      curve([inC, topI, topM, topO, outC], .05, rgba(A.devD, .9), .5);
      const by = ey - ery * lerp(1.3, 1.25, age);
      taper([[x - s * erx * 1.0, by + ex.bin * 1.0 + .1], [x - s * erx * .2, by + ex.bin * .35], [x + s * erx * 1.05, by + ex.bout - slant * .8 + .06]], [lerp(.07, .15, age), lerp(.1, .2, age), .03], rgba(mix(A.devS, A.devD, .5), .92));
      additive(() => glow(A.eye, x, ey, erx * 2.2, .22 + .3 * fed));
    }
    // nose: two small slits
    for (const s of [-1, 1]) curve([[s * .07, lerp(.36, .3, age)], [s * .1, lerp(.42, .4, age)]], .035, rgba(A.devD, .8));
    // ---- mouth ----
    const my = lerp(.56, .62, age), mw = lerp(.42, .62, age), m = ex.mouth;
    const fang = (x, y, w, h, dir = 1) => blob([[x - w, y], [x + w, y], [x + w * .25, y + h * dir * .7], [x, y + h * dir], [x - w * .25, y + h * dir * .7]], rgba(A.tooth), .3);
    if (m === 'cat') {                                                  // a small "w" with one milk fang
      curve([[-.2, my - .04], [-.1, my + .06], [0, my - .02], [.1, my + .06], [.2, my - .04]], .05, rgba(A.devD, .95), .6);
      fang(.1, my + .05, .04, .09);
    } else if (m === 'smile' || m === 'smirk') {
      const l = m === 'smirk' ? [-mw * .8, my + .1] : [-mw, my - .08], rr = m === 'smirk' ? [mw * 1.05, my - .2] : [mw, my - .08];
      const pts = [l, [l[0] * .5, my + .1], [0, my + .14], [rr[0] * .55, my + .08], rr];
      curve(pts, .06, rgba(A.devD, .95), .55);
      curve([[rr[0] - .03, rr[1] - .06], [rr[0] + .05, rr[1] - .02], [rr[0] + .03, rr[1] + .07]], .04, rgba(A.devD, .8));   // the cheek crease
      if (m === 'smile') curve([[l[0] + .03, l[1] - .06], [l[0] - .05, l[1] - .02], [l[0] - .03, l[1] + .07]], .04, rgba(A.devD, .8));
      fang(rr[0] * .52, my + .09, .05, .13); if (age > .4) fang(-mw * .5, my + .1, .045, .1);
    } else if (m === 'pout' || m === 'frown') {
      curve([[-.22, my + .1], [-.1, my + .02], [0, my], [.1, my + .02], [.22, my + .1]], .055, rgba(A.devD, .95), .6);
      if (m === 'pout') oval(0, my + .1, .12, .05, rgba(A.devL, .5)); else fang(.12, my + .03, .04, .08);
    } else {                                                            // open mouths: 'open' (delighted), 'grin', 'roar'
      const d = m === 'roar' ? .62 : m === 'grin' ? .3 : .26, w = m === 'open' ? mw * .62 : mw * 1.12, up = m === 'roar' ? .04 : -.12;
      const mp = [[-w, my + up], [-w * .5, my + (m === 'roar' ? -.12 : .02)], [0, my + (m === 'roar' ? -.16 : .04)], [w * .5, my + (m === 'roar' ? -.12 : .02)], [w, my + up], [w * .62, my + d * .78], [0, my + d], [-w * .62, my + d * .78]];
      const mPath = () => blobPath(mp, .5, true);
      mPath(); ctx.fillStyle = rgba(A.mouth); ctx.fill();
      inside(mPath, () => {
        oval(0, my + d * .98, w * .55, d * .42, rgba(A.tongue));
        additive(() => glow(A.hot, 0, my + d * .7, w * .8, .25 * fed));   // the furnace shows in its throat
        if (m === 'open') { rectf(-w, my - .2, w * 2, .27, rgba(A.tooth)); fang(w * .42, my + .05, .05, .12); fang(-w * .42, my + .05, .05, .12); }
        else { const n = m === 'roar' ? 7 : 9;
          for (let i = 0; i < n; i++) { const k = (i + .5) / n, x = lerp(-w * .92, w * .92, k), arc = Math.sin(k * Math.PI), big = (i === 1 || i === n - 2) ? 1.5 : 1;
            fang(x, my + (m === 'roar' ? -.16 : -.03) - .04 + (1 - arc) * (m === 'roar' ? .2 : .0), w / n * .78, (m === 'roar' ? .2 : .15) * big * (.7 + .3 * arc), 1);
            if (m === 'roar' || i % 1 === 0) fang(x + w / n * .5, my + d * (.62 + .3 * arc) + .05, w / n * .7, (m === 'roar' ? .17 : .1) * (.6 + .4 * arc), -1); } }
      });
      curve(mp.slice(0, 5), .05, rgba(A.devD, .95), .5);
      for (const s of [-1, 1]) curve([[s * w - s * .02, my + up - .08], [s * w + s * .06, my + up], [s * w + s * .02, my + up + .1]], .045, rgba(A.devD, .85));
    }
    if (o.hat) at(o.hat[0], o.hat[1], o.hat[2] || 1, o.hat[3] || 0, () => partyHat());
  });
}
function partyHat() {                                                   // unit: base 0.5 wide, 0.8 tall, the tip up
  poly([[-.26, 0], [.26, 0], [0, -.8]], lg(-.26, 0, .26, 0, [[0, [70, 190, 210]], [1, [30, 110, 150]]]));
  inside(() => poly([[-.26, 0], [.26, 0], [0, -.8]]), () => { for (let i = 0; i < 6; i++) stroke([[-.4, -.1 - i * .16], [.4, -.26 - i * .16]], .05, 'rgba(255,255,255,.75)', 'butt'); });
  disc(0, -.82, .08, 'rgb(255,255,255)'); oval(0, 0, .27, .05, 'rgba(255,255,255,.9)');
}

// =====================================================================================================
// PEOPLE'S HEADS. Unit space: the head is 1 wide each side of the centre. who: 'dad' | 'lily'; o: expr, look, turn
// (-1..1: the face turned to its right or left), light, rim, age (dad: 21 or 38)
// =====================================================================================================
const HUM_EX = {
  laugh:   { lid: .34, sq: .7, bin: -.14, bout: -.02, mouth: 'laugh', pup: 1 },
  smile:   { lid: .12, sq: .4, bin: -.08, bout: 0, mouth: 'smile', pup: 1 },
  soft:    { lid: .2, sq: .3, bin: -.12, bout: .04, mouth: 'smile', pup: 1.05 },
  neutral: { lid: .14, sq: .05, bin: 0, bout: 0, mouth: 'flat', pup: 1 },
  tired:   { lid: .46, sq: .1, bin: -.1, bout: .1, mouth: 'flat', pup: .95 },
  tempted: { lid: .4, sq: .12, bin: -.2, bout: .12, mouth: 'part', pup: 1.1 },
  horror:  { lid: -.18, sq: 0, bin: -.34, bout: .1, mouth: 'gasp', pup: .62 },
  fear:    { lid: -.12, sq: 0, bin: -.3, bout: .14, mouth: 'small', pup: .8 },
  sad:     { lid: .3, sq: .05, bin: -.26, bout: .16, mouth: 'down', pup: 1.05 },
  resolve: { lid: .26, sq: .3, bin: .2, bout: -.06, mouth: 'firm', pup: .9 },
  strain:  { lid: .6, sq: .8, bin: .22, bout: -.04, mouth: 'grit', pup: .9 }
};
function humanHead(cx, cy, r, who, o = {}) {
  const ex = typeof o.expr === 'object' ? o.expr : HUM_EX[o.expr || 'neutral'], li = o.light ?? -1, rim = o.rim || [255, 200, 150], turn = o.turn || 0, look = o.look || [0, 0];
  const kid = who === 'lily', old = !kid && (o.age ?? 38) >= 30;
  const skin = o.skin || A.skin, skinL = o.skinL || A.skinL, skinS = o.skinS || A.skinS;
  const shape = mirror(kid ? [[0, -1.1], [.74, -.96], [1.03, -.3], [1.06, .3], [.72, .86], [0, 1.04]] : [[0, -1.14], [.72, -1.02], [.96, -.38], [.93, .36], [.7, 1.02], [.34, 1.33], [0, 1.38]]);
  const fx = turn * .2;
  at(cx, cy, r, o.tilt || 0, () => {
    // hair behind the head
    if (kid) {                                                           // two bunches
      for (const s of [-1, 1]) { blob([[s * .96, -.5], [s * 1.5, -.8], [s * 1.72, -.3], [s * 1.56, .26], [s * 1.2, .1], [s * 1.02, -.2]], lg(s * 1, -.8, s * 1.7, .2, [[0, A.hair], [1, mix(A.hair, A.hairL, s === li ? .6 : .1)]]), .5);
        oval(s * 1.04, -.5, .1, .16, rgba(A.yellow)); }
      blob([[-1.08, .1], [-1.1, -.7], [-.6, -1.3], [0, -1.38], [.6, -1.3], [1.1, -.7], [1.08, .1], [.9, -.3], [-.9, -.3]], rgba(A.hair), .5);
    } else blob([[-1.04, .05], [-1.1, -.62], [-.74, -1.3], [0, -1.5], [.74, -1.32], [1.1, -.62], [1.04, .05], [.9, -.4], [-.9, -.4]], rgba(A.hair), .5);
    // ears
    for (const s of [-1, 1]) { const k = 1 - Math.max(0, -s * turn) * .5; oval(s * (1.0 - fx * s * .3), .1, .17 * k, .27, rgba(mix(skin, skinS, s === li ? 0 : .45))); oval(s * (1.0 - fx * s * .3), .12, .08 * k, .15, rgba(skinS, .7)); }
    // the head
    const headPath = () => blobPath(shape, .5, true);
    headPath(); ctx.fillStyle = rg(li * .4 + fx, -.3, .05, 2.0, [[0, skinL], [.5, skin], [1, mix(skin, skinS, .7)]]); ctx.fill();
    inside(headPath, () => {
      rectf(-2, -2, 4, 4, lg(-li * .1 + fx, 0, -li * 1.1, .15, [[0, skinS, 0], [.6, skinS, .4], [1, skinS, .8]]));   // shadow side
      rectf(-2, .7, 4, 2, lg(0, .8, 0, 1.4, [[0, skinS, 0], [1, skinS, .5]]));
      if (old) { oval(fx, 1.12, .84, .6, rgba([70, 60, 84], .24)); oval(fx, .8, .5, .24, rgba([70, 60, 84], .12)); }          // stubble
      additive(() => { glow(A.blush, -.56 + fx, .36, .34, kid ? .26 : .12); glow(A.blush, .56 + fx, .36, .34, kid ? .26 : .12); });
      ctx.save(); ctx.lineWidth = .08; ctx.strokeStyle = lg(-li * .3, 0, -li * .95, 0, [[0, rim, 0], [1, rim, .8]]); ctx.translate(li * .02, 0); headPath(); ctx.stroke(); ctx.restore();   // rim
      additive(() => glow(rim, -li * 1.0, .1, .5, .3));
    });
    // ---- eyes ----
    const ey = kid ? .1 : .0, ex0 = kid ? .46 : .43, erx = kid ? .25 : .2, ery = kid ? .3 : .22;
    for (const s of [-1, 1]) {
      const x = s * ex0 + fx, near = 1 - Math.max(0, -s * turn) * .22, rx = erx * near;
      const lid = clamp(ex.lid, -.3, 1), sq = ex.sq;
      const eyePath = () => { ctx.beginPath(); ctx.ellipse(x, ey, rx, ery * (1 + Math.max(0, -lid) * .5), 0, 0, TAU); };
      if (old) curve([[x - rx * .9, ey + ery * 1.25], [x, ey + ery * 1.55], [x + rx * .9, ey + ery * 1.3]], .06, rgba(skinS, .55));   // tired bags
      eyePath(); ctx.fillStyle = rgba([252, 247, 240]); ctx.fill();
      inside(eyePath, () => {
        const ir = ery * (kid ? .74 : .7), px = x + look[0] * rx * .42, py = ey + look[1] * ery * .36 + .02;
        disc(px, py, ir, rgba([74, 44, 30])); disc(px, py + ir * .2, ir * .7, rgba([122, 76, 44], .7)); disc(px, py, ir * .5 * ex.pup, rgba([18, 12, 14]));
        disc(px - ir * .36, py - ir * .4, ir * .26, 'rgba(255,255,255,.96)'); disc(px + ir * .34, py + ir * .36, ir * .12, 'rgba(255,255,255,.7)');
        // lids: the skin comes down from above and up from below
        if (lid > 0) { ctx.fillStyle = rgba(mix(skin, skinS, .25)); ctx.beginPath(); ctx.ellipse(x, ey - ery * 2 + ery * 2 * lid * .95, rx * 1.5, ery * 1.25, 0, 0, TAU); ctx.fill(); }
        if (sq > 0) { ctx.fillStyle = rgba(mix(skin, skinL, .3)); ctx.beginPath(); ctx.ellipse(x, ey + ery * 2.2 - ery * sq * .9, rx * 1.5, ery * 1.25, 0, 0, TAU); ctx.fill(); }
        rectf(x - 1, ey - ery * 1.5, 2, ery * .75, rgba([60, 30, 40], .18));
      });
      // lash line: follows the upper lid
      const ly = ey - ery + ery * 2 * Math.max(0, lid) * .5 - (lid < 0 ? ery * -lid * .5 : 0);
      curve([[x - rx * 1.02, ey - ery * .1 + Math.max(0, lid) * ery * .3], [x - rx * .5, ly + ery * .14], [x + rx * .5, ly + ery * .14], [x + rx * 1.06, ey - ery * .14 + Math.max(0, lid) * ery * .3]], kid ? .075 : .06, rgba(A.hair, .95), .5);
      if (kid) for (const k of [.7, 1]) stroke([[x + s * rx * k, ey - ery * .5 * (2 - k)], [x + s * rx * (k + .22), ey - ery * (.9 - .3 * k)]], .04, rgba(A.hair, .9));
      // brow
      const by = ey - ery * (kid ? 1.75 : 1.8) - Math.max(0, -lid) * .2;
      taper([[x - s * rx * 1.1, by + ex.bin * .9 + .04], [x - s * rx * .1, by - .05 + ex.bin * .3], [x + s * rx * 1.25, by + .03 + ex.bout]], kid ? [.07, .08, .03] : [.13, .13, .04], rgba(A.hair, kid ? .85 : .95));
    }
    // ---- nose ----
    const nx = fx * 1.5, ny = kid ? .42 : .44;
    if (kid) { oval(nx, ny, .07, .05, rgba(skinS, .55)); disc(nx - li * .0 + li * .03, ny - .04, .03, rgba(skinL, .7)); }
    else { blob([[nx - li * .02, ny - .42], [nx - li * .2, ny + .02], [nx - li * .12, ny + .14], [nx + li * .04, ny + .12], [nx + li * .02, ny - .1]], rgba(skinS, .5), .5);
      curve([[nx - .13, ny + .1], [nx, ny + .17], [nx + .13, ny + .1]], .045, rgba(skinS, .9)); disc(nx + li * .05, ny - .0, .05, rgba(skinL, .6)); }
    // ---- mouth ----
    const mx = fx * 1.3, my = kid ? .7 : .86, m = ex.mouth, lip = rgba(mix(skinS, [120, 40, 50], .5), .95);
    if (m === 'laugh' || m === 'gasp' || m === 'grit') {
      const w = m === 'laugh' ? .4 : m === 'grit' ? .34 : .17, d = m === 'laugh' ? .36 : m === 'grit' ? .16 : .34, up = m === 'laugh' ? -.08 : 0;
      const mp = m === 'gasp' ? [[mx - w, my + .12], [mx, my - .02], [mx + w, my + .12], [mx + w * .8, my + d], [mx, my + d + .08], [mx - w * .8, my + d]]
        : [[mx - w, my + up], [mx - w * .4, my + .04], [mx + w * .4, my + .04], [mx + w, my + up], [mx + w * .6, my + d * .8], [mx, my + d], [mx - w * .6, my + d * .8]];
      const mPath = () => blobPath(mp, .5, true);
      mPath(); ctx.fillStyle = rgba([86, 26, 34]); ctx.fill();
      inside(mPath, () => { if (m !== 'gasp') rectf(mx - w, my - .1, w * 2, m === 'grit' ? .2 : .2, rgba([255, 250, 242])); else rectf(mx - w, my - .1, w * 2, .2, rgba([255, 250, 242], .9));
        if (m === 'grit') { rectf(mx - w, my + .1, w * 2, .2, rgba([240, 232, 224])); stroke([[mx - w, my + .1], [mx + w, my + .1]], .02, rgba([120, 80, 80])); } else oval(mx, my + d + .04, w * .6, d * .4, rgba([222, 110, 110])); });
      curve(mp.slice(0, m === 'gasp' ? 3 : 4), .045, lip, .5);
    } else {
      const sh = { smile: [-.06, .1, -.06, .3], flat: [.02, .02, .03, .24], down: [.08, -.02, .08, .22], firm: [0, .01, 0, .26], part: [.02, .03, .02, .2], small: [.04, -.01, .04, .12] }[m];
      if (m === 'part') oval(mx, my + .06, .14, .06, rgba([86, 26, 34]));
      curve([[mx - sh[3], my + sh[0]], [mx, my + sh[1]], [mx + sh[3], my + sh[2]]], .055, lip, .6);
      if (m === 'smile') for (const s of [-1, 1]) curve([[mx + s * (sh[3] + .02), my - .12], [mx + s * (sh[3] + .08), my - .04]], .035, rgba(skinS, .7));
      curve([[mx - .12, my + .2], [mx + .12, my + .2]], .04, rgba(skinS, .35));
    }
    // ---- hair in front ----
    if (kid) {
      blob([[-1.06, -.2], [-1.0, -.8], [-.5, -1.22], [0, -1.28], [.5, -1.22], [1.0, -.8], [1.06, -.2], [.86, -.46], [.52, -.3], [.2, -.5], [-.16, -.32], [-.5, -.5], [-.84, -.34]], lg(-1, -1.2, 1, -.2, [[0, mix(A.hair, A.hairL, li < 0 ? .5 : 0)], [1, mix(A.hair, A.hairL, li > 0 ? .5 : 0)]]), .42);
      curve([[-.5, -1.0], [-.1, -1.1], [.3, -1.02]], .06, rgba(A.hairL, .5));
    } else {
      const mess = old ? .08 : 0;
      const hg = lg(-1, -1.4, 1, -.3, [[0, mix(A.hair, A.hairL, li < 0 ? .6 : .05)], [1, mix(A.hair, A.hairL, li > 0 ? .6 : .05)]]);
      blob([[-1.04, -.02], [-1.1, -.7], [-.8, -1.36], [-.1, -1.62], [.62, -1.5], [1.1, -.86], [1.05, -.02], [.92, -.44], [.84, -.8 + mess], [.5, -.98], [.0, -.9 + mess], [-.44, -.7], [-.66, -.42 + mess], [-.9, -.5]], hg, .45);
      blob([[-.7, -.5], [-.5, -1.0], [.1, -1.3], [.7, -1.2], [.96, -.8], [.5, -1.02], [0, -.94], [-.42, -.72]], rgba(A.hairL, .28), .5);   // the swoop catches the light
      curve([[-.74, -1.1], [-.2, -1.44], [.5, -1.36]], .06, rgba(A.hairL, .5));
      if (old) for (const s of [-1, 1]) oval(s * .98, -.3, .07, .2, rgba([150, 150, 160], .35));                                 // grey at the temples
    }
  });
}


// =====================================================================================================
// BODIES. Figures stand with their feet at (x, y) and are h tall (to the top of the skull). All joints are
// computed from a pose, so the same figure works at any size and in any picture.
// =====================================================================================================
// a tapered limb through three joints, with a soft shadow along the side away from the light
function limb3(a, b, c, w, col, colS, li = -1) {
  taper([a, b, c], w, rgba(col), .5);
  ctx.save(); ctx.translate(li * w[1] * .2, -w[1] * .06); taper([a, b, c], w.map(v => v * .34), rgba(lighten(col, .5), .1), .5); ctx.restore();
}
// a limb with some muscle on it: m 0 (a soft tube) .. 1 (a bulge between the joints)
function limbM(a, b, c, w, col, colS, li = -1, m = 0) {
  const p1 = [lerp(a[0], b[0], .5), lerp(a[1], b[1], .5)], p2 = [lerp(b[0], c[0], .42), lerp(b[1], c[1], .42)];
  const pts = [a, p1, b, p2, c], ws = [w[0], Math.max(w[0], w[1]) * (1 + .22 * m), w[1] * (1 - .08 * m), lerp(w[1], w[2], .4) * (1 + .3 * m), w[2] * (1 - .1 * m)];
  taper(pts, ws, lg(a[0], a[1], c[0], c[1], [[0, col], [1, mix(col, colS, .45)]]), .5);
  ctx.save(); ctx.translate(li * w[1] * .22, -w[1] * .08); taper(pts, ws.map(v => v * .3), rgba(lighten(col, .5), .13), .5); ctx.restore();
}
// a hand. (x, y) the wrist, ang the direction the fingers point (0 = right), s the palm size. pose: open | fist | grip
function hand(x, y, ang, s, o = {}) {
  const col = o.col || A.skin, colS = o.colS || A.skinS, claw = o.claw || 0, n = o.fingers || 4, pose = o.pose || 'open', flip = o.flip ? -1 : 1;
  at(x, y, s, ang, () => {
    ctx.scale(1, flip);
    const curl = pose === 'fist' ? .9 : pose === 'grip' ? .55 : pose === 'flat' ? .05 : .32, len = (pose === 'fist' ? .55 : 1) * (o.len || 1);
    // thumb
    taper([[.18, -.3], [.5, -.62 - (pose === 'open' ? .1 : 0)], [.86 - curl * .3, -.6 + curl * .3]], [.34, .3, .22], rgba(mix(col, colS, .2)));
    if (claw) taper([[.86 - curl * .3, -.6 + curl * .3], [1.1 - curl * .4, -.5 + curl * .45]], [.16, .01], rgba(o.clawCol || A.devD));
    // palm
    blob([[-.1, -.42], [.6, -.46], [.98, -.1], [.9, .4], [.3, .5], [-.1, .4]], lg(0, -.5, 0, .5, [[0, col], [1, mix(col, colS, .6)]]), .5);
    // fingers
    for (let i = 0; i < n; i++) {
      const k = n === 1 ? .5 : i / (n - 1), y0 = lerp(-.34, .36, k), l = len * (1 - Math.abs(k - .4) * .35) * 1.0, c = curl * (1 + k * .2);
      const p1 = [.9 + l * .5 * Math.cos(c * .9), y0 + l * .5 * Math.sin(c * .9) * .9], p2 = [p1[0] + l * .5 * Math.cos(c * 2.2), p1[1] + l * .5 * Math.sin(c * 2.2)];
      taper([[.82, y0], p1, p2], [.27, .25, .2 - claw * .06], rgba(mix(col, colS, k * .45)));
      if (claw) taper([p2, [p2[0] + .34 * claw * Math.cos(c * 2.6), p2[1] + .34 * claw * Math.sin(c * 2.6)]], [.17, .01], rgba(o.clawCol || A.devD));
    }
  });
}

// ---------- PEOPLE ----------
// person(o): who 'dad' | 'lily'; x, y, h; face: expr, look, turn, tilt; age (dad); light, rim;
// lean (radians, the body's tilt), handL / handR: [x, y] targets in picture coordinates (default: hanging), handPoseL/R,
// tie: 'neat' | 'loose' | 'none', sleeves: 'long' | 'rolled', stride: -1..1 (legs apart), sit: true (legs forward)
function person(o) {
  const kid = o.who === 'lily', h = o.h, li = o.light ?? -1, rim = o.rim || [255, 200, 150];
  const r = h * (kid ? .148 : .1), headH = r * (kid ? 2.14 : 2.52);
  const top = o.y - h, lean = o.lean || 0;
  const hipY = o.y - h * (kid ? .3 : .44), shY = top + headH + h * (kid ? .035 : .035), hx = o.x, sx = o.x + Math.sin(lean) * (hipY - shY);
  const sw = h * (kid ? .12 : .165), hw = h * (kid ? .1 : .105);
  const headC = [sx + Math.sin(lean) * headH * .6 + (o.headDx || 0) * r, top + r * (kid ? 1.1 : 1.14) + (o.headDy || 0) * r];
  const shirt = kid ? A.yellow : (o.shirt || A.shirt), shirtS = kid ? A.yellowS : (o.shirtS || A.shirtS);
  const shL = [sx - sw * .84, shY + h * .03], shR = [sx + sw * .84, shY + h * .03];
  const armU = h * (kid ? .15 : .185), armF = h * (kid ? .14 : .175), aw = h * (kid ? .05 : .058);
  const defL = [shL[0] - h * .03, shL[1] + armU + armF - h * .01], defR = [shR[0] + h * .03, shR[1] + armU + armF - h * .01];
  const hL = o.handL || defL, hR = o.handR || defR;
  const arm = (sh, hd, side, pose, far) => {
    const el = ik(sh, hd, armU, armF, o.elbow?.[side < 0 ? 0 : 1] ?? (side < 0 ? -1 : 1) * (hd[1] < sh[1] + armU * .6 ? -1 : 1));
    const d = Math.hypot(hd[0] - sh[0], hd[1] - sh[1]), k = Math.min(1, (armU + armF - .5) / d), wrist = [sh[0] + (hd[0] - sh[0]) * k, sh[1] + (hd[1] - sh[1]) * k];
    const sleeve = far ? mix(shirt, shirtS, .55) : shirt, skin = far ? mix(A.skin, A.skinS, .4) : A.skin;
    if (!kid && o.sleeves === 'rolled') {
      limb3(sh, el, wrist, [aw * 1.25, aw * .95, aw * .72], skin, A.skinS, li);
      taper([sh, [lerp(sh[0], el[0], .5), lerp(sh[1], el[1], .5)], [lerp(el[0], wrist[0], .12), lerp(el[1], wrist[1], .12)]], [aw * 1.3, aw * 1.34, aw * 1.3], rgba(sleeve));
      taper([[lerp(el[0], wrist[0], .05), lerp(el[1], wrist[1], .05)], [lerp(el[0], wrist[0], .2), lerp(el[1], wrist[1], .2)]], [aw * 1.42, aw * 1.42], rgba(mix(sleeve, shirtS, .5)));
    } else {
      limb3(sh, el, wrist, [aw * 1.3, aw * 1.2, aw * 1.0], sleeve, shirtS, li);
      if (!kid) taper([[lerp(el[0], wrist[0], .86), lerp(el[1], wrist[1], .86)], wrist], [aw * 1.15, aw * 1.15], rgba(mix(sleeve, shirtS, .35)));
    }
    const ang = o['handAng' + (side < 0 ? 'L' : 'R')] ?? Math.atan2(wrist[1] - el[1], wrist[0] - el[0]);
    hand(wrist[0], wrist[1], ang, aw * (kid ? 1.0 : 1.12), { col: skin, pose, flip: side > 0, len: .8 });
  };
  // the far arm goes behind the body
  const farSide = (o.turn || 0) >= 0 ? -1 : 1;
  if (!o.noArms) arm(farSide < 0 ? shL : shR, farSide < 0 ? hL : hR, farSide, farSide < 0 ? o.handPoseL : o.handPoseR, true);
  // legs
  const lw = h * (kid ? .058 : .075), st = o.stride || 0;
  const leg = (side, far) => {
    const hip = [hx + side * hw * .55, hipY], col = kid ? A.skin : (far ? mix(A.trouser, A.trouserS, .6) : A.trouser);
    let foot = [hx + side * hw * .7 + side * st * h * .12, o.y - h * .02], knee;
    if (o.sit) { knee = [hip[0] + (o.sit === true ? 1 : o.sit) * h * .2, hip[1] + h * .02]; foot = [knee[0] + h * .02, o.y - h * .02]; }
    else knee = [lerp(hip[0], foot[0], .5) + side * st * h * .03, lerp(hip[1], foot[1], .5)];
    if (kid) { limb3(hip, knee, foot, [lw, lw * .9, lw * .78], col, A.skinS, li); taper([[foot[0], foot[1] - h * .06], [foot[0], foot[1] - h * .01]], [lw * .95, lw * .95], 'rgb(255,255,255)'); }
    else limb3(hip, knee, foot, [lw * 1.5, lw * 1.25, lw * 1.05], col, A.trouserS, li);
    blob([[foot[0] - lw * .8, foot[1] - lw * .5], [foot[0] + lw * 1.5, foot[1] - lw * .4], [foot[0] + lw * 1.7, foot[1] + lw * .5], [foot[0] - lw * .8, foot[1] + lw * .5]], rgba(kid ? [200, 60, 60] : A.shoe), .4);
  };
  if (!o.noLegs) { leg(farSide, true); leg(-farSide, false); }
  // torso
  const waistY = hipY - h * .02, torso = kid
    ? [[sx - sw * .86, shY], [sx + sw * .86, shY], [sx + sw * 1.05, shY + h * .12], [hx + hw * 2.0, hipY + h * .14], [hx, hipY + h * .165], [hx - hw * 2.0, hipY + h * .14], [sx - sw * 1.05, shY + h * .12]]
    : [[sx - sw * .5, shY - h * .012], [sx + sw * .5, shY - h * .012], [sx + sw * 1.04, shY + h * .028], [sx + sw * 1.0, shY + h * .12], [hx + hw * 1.1, waistY], [hx + hw * 1.12, hipY + h * .05], [hx - hw * 1.12, hipY + h * .05], [hx - hw * 1.1, waistY], [sx - sw * 1.0, shY + h * .12], [sx - sw * 1.04, shY + h * .028]];
  const tPath = () => blobPath(torso, kid ? .35 : .3, true);
  tPath(); ctx.fillStyle = lg(sx - li * -sw, 0, sx + li * -sw * 1.2, 0, [[0, shirt], [.55, shirt], [1, mix(shirt, shirtS, .9)]]); ctx.fill();
  inside(tPath, () => {
    rectf(sx - sw * 3, shY - h * .05, sw * 6, h * .09, lg(0, shY - h * .02, 0, shY + h * .06, [[0, shirtS, .55], [1, shirtS, 0]]));   // the head's shadow on the shoulders
    if (!kid) { rectf(hx - sw * 2, waistY - h * .0, sw * 4, h * .2, rgba(A.trouser)); rectf(hx - sw * 2, waistY, sw * 4, h * .016, rgba(A.shoe)); rectf(hx - h * .012, waistY - h * .002, h * .024, h * .02, rgba([214, 170, 90])); }
    else { for (let i = -2; i <= 2; i++) curve([[sx + i * sw * .34, shY + h * .1], [hx + i * hw * .8, hipY + h * .17]], h * .006, rgba(A.yellowS, .35)); curve([[sx - sw, shY + h * .11], [sx, shY + h * .125], [sx + sw, shY + h * .11]], h * .012, rgba(A.yellowS, .5)); }
    ctx.save(); ctx.lineWidth = h * .014; ctx.strokeStyle = lg(sx - li * sw * .2, 0, sx - li * sw * 1.1, 0, [[0, rim, 0], [1, rim, .9]]); tPath(); ctx.stroke(); ctx.restore();
  });
  // neck, collar, tie
  const nk = [sx + (headC[0] - sx) * .5, shY - h * .005];
  taper([[headC[0], headC[1] + r * .7], nk], [r * .86, r * .96], rgba(mix(A.skin, A.skinS, .45)));
  if (!kid) {
    const cw = sw * .46, cy = shY - h * .012, tie = o.tie ?? 'neat', drop = tie === 'loose' ? h * .03 : h * .004, tx = sx + (tie === 'loose' ? h * .008 : 0);
    poly([[sx - cw * .7, cy], [sx + cw * .7, cy], [sx, cy + h * .06 + drop]], rgba(mix(A.skin, A.skinS, .5)));                 // the open collar shows the throat
    if (tie !== 'none') {
      const tc = o.tieCol || A.tie, tl = h * (kid ? 0 : .2);
      poly([[tx - h * .017, cy + h * .028 + drop], [tx + h * .017, cy + h * .028 + drop], [tx + h * .012, cy + h * .055 + drop], [tx - h * .012, cy + h * .055 + drop]], rgba(tc));
      poly([[tx - h * .012, cy + h * .055 + drop], [tx + h * .012, cy + h * .055 + drop], [tx + h * .03 + (tie === 'loose' ? h * .012 : 0), cy + tl], [tx + (tie === 'loose' ? h * .012 : 0), cy + tl + h * .03], [tx - h * .026 + (tie === 'loose' ? h * .012 : 0), cy + tl]], lg(tx - h * .03, 0, tx + h * .03, 0, [[0, li < 0 ? (o.tieL || A.tieL) : tc], [1, li < 0 ? tc : (o.tieL || A.tieL)]]));
    }
    for (const s of [-1, 1]) poly([[sx + s * cw * .86, cy - h * .014], [sx + s * cw * .1, cy + h * .012 + drop * .4], [sx + s * cw * .62, cy + h * .062 + drop * .5]], rgba(mix(shirt, shirtS, s === li ? 0 : .35)));
  } else { for (const s of [-1, 1]) blob([[sx + s * sw * .1, shY - h * .01], [sx + s * sw * .7, shY - h * .008], [sx + s * sw * .56, shY + h * .04], [sx + s * sw * .12, shY + h * .03]], 'rgb(255,255,255)', .4); }
  // head
  humanHead(headC[0], headC[1], r, o.who, { expr: o.expr, look: o.look, turn: o.turn, tilt: (o.tilt || 0) + lean * .5, light: li, rim, age: o.age });
  // the near arm in front
  if (!o.noArms) arm(farSide < 0 ? shR : shL, farSide < 0 ? hR : hL, -farSide, farSide < 0 ? o.handPoseR : o.handPoseL, false);
  return { head: headC, r, shL, shR, hip: [hx, hipY], shY };
}

// ---------- THE DEVIL ----------
// devil(o): x, y (its feet), h (to the top of its skull), stage 0..4 (thumb, cat, child, man, giant; fractions are
// in-between sizes), expr, look, tilt, light, rim, fed 0..1; handL / handR [x, y] targets; handPoseL/R; lean;
// sit (true: on a seat at y); cloth: 'shirt' (Dad's white shirt and tie); tail: [dx, dy] where the tip goes, in h; hat
const DEV_ST = { hf: [.56, .47, .38, .26, .2], sw: [.15, .15, .16, .2, .27], hw: [.13, .12, .105, .105, .14], arm: [.26, .32, .4, .45, .58], leg: [.12, .18, .27, .36, .3], thick: [.07, .066, .064, .078, .1] };
const stg = (k, s) => { const a = DEV_ST[k], i = Math.min(3, Math.floor(s)), f = s - i; return lerp(a[i], a[i + 1], f); };
function devil(o) {
  const s = clamp(o.stage ?? 3, 0, 4), age = s / 4, h = o.h, li = o.light ?? -1, rim = o.rim || A.hot, fed = o.fed ?? .3 + .7 * age;
  const hf = stg('hf', s), r = hf * h / lerp(2.0, 2.3, age), top = o.y - h, lean = o.lean || 0;
  const legL = stg('leg', s) * h, hipY = o.sit ? o.y - h * .02 : o.y - legL, shY = top + hf * h + h * lerp(.0, .03, age);
  const hx = o.x, sx = o.x + Math.sin(lean) * (hipY - shY) * 1.0, sw = stg('sw', s) * h, hw = stg('hw', s) * h, th = stg('thick', s) * h;
  const headC = [sx + Math.sin(lean) * hf * h * .7 + (o.headDx || 0) * r, top + r * lerp(1.02, 1.0, age) + (o.headDy || 0) * r + Math.abs(Math.sin(lean)) * h * .03];
  const skinG = (x0, x1) => lg(x0, 0, x1, 0, li < 0 ? [[0, A.devL], [.45, A.dev], [1, A.devS]] : [[0, A.devS], [.55, A.dev], [1, A.devL]]);
  const cloth = o.cloth === 'shirt', SH = o.shirt || A.shirt, SHS = o.shirtS || A.shirtS;
  // its light on whatever is behind it
  glow(mix(A.dev, A.hot, .5), sx, lerp(shY, hipY, .5), h * (.5 + .25 * age), .1 + .14 * fed);
  // ---- tail ----
  if (!o.noTail) {
  const tt = o.tail || [li * -.34, -.3], tb = [hx - Math.sign(tt[0] || 1) * hw * .3, hipY - h * .02], tip = [hx + tt[0] * h, hipY + tt[1] * h];
  const tm1 = [lerp(tb[0], tip[0], .35) + Math.sign(tt[0]) * h * .1, tb[1] + h * .1], tm2 = [lerp(tb[0], tip[0], .9) + Math.sign(tt[0]) * h * .08, lerp(tb[1], tip[1], .45)];
  taper([tb, tm1, tm2, tip], [th * .8, th * .55, th * .34, th * .2], lg(tb[0], tb[1], tip[0], tip[1], [[0, A.devS], [.7, A.dev], [1, A.hot]]));
  at(tip[0], tip[1], th * 1.7, Math.atan2(tip[1] - tm2[1], tip[0] - tm2[0]) + Math.PI / 2, () => {                             // the tip: a small flame
    additive(() => glow(A.hot, 0, -.3, 2.2, .5 * (.4 + fed)));
    blob([[0, .3], [.42, -.05], [.3, -.6], [0, -1.15], [-.18, -.62], [-.42, -.1]], lg(0, .3, 0, -1.1, [[0, A.dev], [.4, A.hot], [1, A.hotL]]), .5);
    blob([[0, .12], [.18, -.1], [.08, -.5], [-.14, -.16]], rgba(A.hotL, .9), .5);
  });
  }
  // ---- arms ----
  const armLen = stg('arm', s) * h, aU = armLen * .5, aF = armLen * .5, aw = th * lerp(.8, 1.0, age) * (s > 3 ? lerp(1, 1.5, s - 3) : 1);
  const shL = [sx - sw * .86, shY + h * .035], shR = [sx + sw * .86, shY + h * .035];
  const defL = [shL[0] - h * .04, shL[1] + armLen * .92], defR = [shR[0] + h * .04, shR[1] + armLen * .92];
  const arm = (sh, hd, side, pose, far) => {
    const el = ik(sh, hd, aU, aF, o.elbow?.[side < 0 ? 0 : 1] ?? (side < 0 ? -1 : 1) * (hd[1] < sh[1] + aU * .5 ? -1 : 1));
    const d = Math.hypot(hd[0] - sh[0], hd[1] - sh[1]), k = Math.min(1, (armLen - .5) / d), wr = [sh[0] + (hd[0] - sh[0]) * k, sh[1] + (hd[1] - sh[1]) * k];
    const col = far ? mix(A.dev, A.devS, .6) : A.dev;
    limbM(sh, el, wr, [aw * lerp(1.15, 1.7, age * age), aw * lerp(1.0, 1.2, age), aw * .85], col, A.devD, li, age);
    if (cloth) { const sl = far ? mix(SH, SHS, .55) : SH; taper([sh, el, [lerp(el[0], wr[0], .8), lerp(el[1], wr[1], .8)]], [aw * 2.1, aw * 1.5, aw * 1.25], rgba(sl));
      taper([[lerp(el[0], wr[0], .72), lerp(el[1], wr[1], .72)], [lerp(el[0], wr[0], .84), lerp(el[1], wr[1], .84)]], [aw * 1.34, aw * 1.34], rgba(mix(sl, SHS, .4))); }
    const ang = o['handAng' + (side < 0 ? 'L' : 'R')] ?? Math.atan2(wr[1] - el[1], wr[0] - el[0]);
    hand(wr[0], wr[1], ang, aw * lerp(1.2, 1.5, age), { col, colS: A.devD, claw: lerp(.25, 1.1, age), fingers: 3, pose, flip: side > 0, len: lerp(.7, 1.2, age) });
  };
  const farSide = (o.turn || 0) >= 0 ? -1 : 1;
  if (!o.noArms) arm(farSide < 0 ? shL : shR, farSide < 0 ? (o.handL || defL) : (o.handR || defR), farSide, farSide < 0 ? o.handPoseL : o.handPoseR, true);
  // ---- legs: thigh, a shin that slopes back, a hoof ----
  const leg = (side, far) => {
    const hip = [hx + side * hw * .55, hipY], col = far ? mix(A.dev, A.devS, .6) : A.dev, lw = th * lerp(1, 1.25, age);
    const foot = o.sit ? [hip[0] + side * hw * .2 + (o.sitDir || 1) * legL * .5, hipY + legL * .62] : [hx + side * hw * .75, o.y - th * .25];
    const knee = o.sit ? [hip[0] + (o.sitDir || 1) * legL * .55, hip[1] + legL * .02] : ik(hip, foot, legL * .52, legL * .52, side * .0 + 1 * (side < 0 ? -1 : -1) * -1);
    limbM(hip, knee, foot, [lw * 1.9, lw * 1.3, lw * .8], col, A.devD, li, age);
    blob([[foot[0] - lw * .7, foot[1] - lw * .5], [foot[0] + lw * .9, foot[1] - lw * .45], [foot[0] + lw * 1.1, foot[1] + lw * .45], [foot[0] - lw * .8, foot[1] + lw * .45]], rgba(A.devD), .35);
  };
  if (!o.noLegs) { leg(farSide, true); leg(-farSide, false); }
  // ---- torso: a pear when it is small, a wedge when it is his size, a boulder when it is the giant ----
  const belly = lerp(1.25, .86, clamp(s / 3)) * (s > 3 ? lerp(1, 1.2, s - 3) : 1), chest = s > 3 ? lerp(1, 1.3, s - 3) : 1;
  const midY = lerp(shY, hipY, .58);
  const torso = [[sx - sw * .55 * chest, shY - h * .01], [sx + sw * .55 * chest, shY - h * .01], [sx + sw * 1.12 * chest, shY + (hipY - shY) * .16], [lerp(sx, hx, .6) + hw * 1.25 * belly, midY], [hx + hw * 1.05, hipY + h * .02], [hx - hw * 1.05, hipY + h * .02], [lerp(sx, hx, .6) - hw * 1.25 * belly, midY], [sx - sw * 1.12 * chest, shY + (hipY - shY) * .16]];
  const tPath = () => blobPath(torso, .42, true);
  tPath(); ctx.fillStyle = cloth ? lg(sx - sw, 0, sx + sw, 0, li < 0 ? [[0, SH], [.5, SH], [1, mix(SH, SHS, .9)]] : [[0, mix(SH, SHS, .9)], [.5, SH], [1, SH]]) : skinG(sx - sw * 1.2, sx + sw * 1.2); ctx.fill();
  inside(tPath, () => {
    rectf(sx - sw * 3, shY - h * .05, sw * 6, h * .1, lg(0, shY - h * .02, 0, shY + h * .07, [[0, cloth ? SHS : A.devD, .6], [1, cloth ? SHS : A.devD, 0]]));
    if (!cloth && age > .5) { const y1 = shY + (hipY - shY) * .26;                                                              // chest
      curve([[sx - sw * .92, y1 - sw * .05], [sx - sw * .46, y1 + sw * .2], [sx, y1 + sw * .04], [sx + sw * .46, y1 + sw * .2], [sx + sw * .92, y1 - sw * .05]], h * .008, rgba(A.devD, .4));
      additive(() => { glow(A.devL, sx - li * -sw * .5, y1 - sw * .1, sw * .6, .25); }); }
    // the furnace: a crack of fire down its belly (through the shirt it shows as a glow between the buttons)
    const fy = lerp(shY, hipY, .56), fr = hw * 1.0 * belly;
    if (!cloth) {
      additive(() => glow(A.hot, lerp(sx, hx, .6), fy, fr * 1.6, .35 + .5 * fed));
      blob([[lerp(sx, hx, .6), fy - fr * .9], [lerp(sx, hx, .6) + fr * .46, fy - fr * .1], [lerp(sx, hx, .6) + fr * .2, fy + fr * .7], [lerp(sx, hx, .6), fy + fr * .95], [lerp(sx, hx, .6) - fr * .24, fy + fr * .6], [lerp(sx, hx, .6) - fr * .44, fy - fr * .14]], rg(lerp(sx, hx, .6), fy + fr * .1, 0, fr, [[0, A.hotL], [.5, A.hot], [1, mix(A.hot, A.dev, .6)]]), .5);
      for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const cxm = lerp(sx, hx, .6), y0 = fy - fr * .42 + i * fr * .42; taper([[cxm + sd * fr * .4, y0], [cxm + sd * fr * .8, y0 - fr * .1], [cxm + sd * fr * 1.15, y0 - fr * .02]], [h * .012, h * .008, .5], rgba(A.hot, .8)); }
    } else {
      additive(() => glow(A.hot, sx, fy, fr * 1.5, .3 * fed));
      rectf(hx - sw * 2, hipY - h * .03, sw * 4, h * .2, rgba(A.trouser));
    }
    ctx.save(); ctx.lineWidth = h * .014; ctx.strokeStyle = lg(sx - li * sw * .2, 0, sx - li * sw * 1.15, 0, [[0, rim, 0], [1, rim, .9]]); tPath(); ctx.stroke(); ctx.restore();
  });
  if (s > 3.2) for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {                                                           // the giant: spines on its shoulders
    const bx = sx + sd * sw * (1.05 - i * .26) * chest, by = shY + h * (.012 + i * -.012); taper([[bx, by + h * .02], [bx + sd * h * .012, by - h * (.05 - i * .01)]], [th * .7, .5], rgba(mix(A.devS, A.devD, .5)));
  }
  // neck, collar and tie over the shirt
  taper([[headC[0], headC[1] + r * .6], [sx + (headC[0] - sx) * .4, shY]], [r * lerp(.5, .8, age), r * lerp(.56, 1.0, age)], rgba(mix(A.dev, A.devS, .6)));
  if (cloth) {
    const cw = sw * .5, cy = shY - h * .012, drop = h * .03, tx = sx + h * .008;
    poly([[sx - cw * .7, cy], [sx + cw * .7, cy], [sx, cy + h * .06 + drop]], rgba(mix(A.dev, A.devS, .5)));
    poly([[tx - h * .017, cy + h * .028 + drop], [tx + h * .017, cy + h * .028 + drop], [tx + h * .012, cy + h * .055 + drop], [tx - h * .012, cy + h * .055 + drop]], rgba(o.tieCol || A.tie));
    poly([[tx - h * .012, cy + h * .055 + drop], [tx + h * .012, cy + h * .055 + drop], [tx + h * .042, cy + h * .2], [tx + h * .012, cy + h * .23], [tx - h * .014, cy + h * .2]], lg(tx - h * .03, 0, tx + h * .03, 0, [[0, li < 0 ? A.tieL : A.tie], [1, li < 0 ? A.tie : A.tieL]]));
    for (const sd of [-1, 1]) poly([[sx + sd * cw * .86, cy - h * .014], [sx + sd * cw * .1, cy + h * .012 + drop * .4], [sx + sd * cw * .62, cy + h * .062 + drop * .5]], rgba(mix(SH, SHS, sd === li ? 0 : .35)));
  }
  devilHead(headC[0], headC[1], r, { age, expr: o.expr, look: o.look, tilt: (o.tilt || 0) + lean * .6, light: li, rim, fed, hat: o.hat, aura: false });
  if (!o.noArms) arm(farSide < 0 ? shR : shL, farSide < 0 ? (o.handR || defR) : (o.handL || defL), -farSide, farSide < 0 ? o.handPoseR : o.handPoseL, false);
  return { head: headC, r, shL, shR, hip: [hx, hipY], shY };
}

// ---------- props ----------
function bottleA(x, y, s, o = {}) {                                     // (x, y) the centre of its base; s = height
  const w = s * .17, glassC = o.col || [120, 200, 190], fill = o.fill ?? .5;
  const path = () => { ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - w, y - s * .58); ctx.bezierCurveTo(x - w, y - s * .72, x - w * .34, y - s * .72, x - w * .34, y - s * .84); ctx.lineTo(x - w * .34, y - s);
    ctx.lineTo(x + w * .34, y - s); ctx.lineTo(x + w * .34, y - s * .84); ctx.bezierCurveTo(x + w * .34, y - s * .72, x + w, y - s * .72, x + w, y - s * .58); ctx.lineTo(x + w, y); ctx.closePath(); };
  path(); ctx.fillStyle = rgba(glassC, o.alpha ?? .22); ctx.fill();
  inside(path, () => {
    if (fill > 0) rectf(x - w, y - s * .6 * fill, w * 2, s * .6 * fill, lg(0, y - s * .6 * fill, 0, y, [[0, [240, 150, 40], .85], [1, [150, 70, 14], .92]]));
    if (o.inside) o.inside();
    rectf(x - w * .8, y - s, w * .28, s, 'rgba(255,255,255,.3)'); rectf(x + w * .5, y - s, w * .14, s, 'rgba(255,255,255,.16)');
  });
  path(); ctx.lineWidth = s * .012; ctx.strokeStyle = rgba(lighten(glassC, .5), .8); ctx.stroke();
  if (o.cork) rectf(x - w * .3, y - s * 1.06, w * .6, s * .09, rgba([190, 140, 90]));
}
function glassA(x, y, s, fill = .6, foam = 0) {                         // a tumbler: (x, y) the centre of its base, s = height
  const w0 = s * .34, w1 = s * .42;
  const path = () => poly([[x - w0, y], [x + w0, y], [x + w1, y - s], [x - w1, y - s]]);
  path(); ctx.fillStyle = 'rgba(190,220,230,.2)'; ctx.fill();
  inside(path, () => { rectf(x - w1, y - s * fill, w1 * 2, s * fill, lg(0, y - s * fill, 0, y, [[0, [250, 176, 50], .92], [1, [176, 84, 16], .95]]));
    if (foam) rectf(x - w1, y - s * fill - s * foam, w1 * 2, s * foam + 2, 'rgba(255,248,230,.96)');
    rectf(x - w1 * .8, y - s, w1 * .24, s, 'rgba(255,255,255,.35)'); rectf(x + w1 * .5, y - s, w1 * .1, s, 'rgba(255,255,255,.2)'); });
  path(); ctx.lineWidth = s * .02; ctx.strokeStyle = 'rgba(235,245,250,.75)'; ctx.stroke();
  oval(x, y - s, w1, s * .045, 'rgba(255,255,255,.28)');
}

// =====================================================================================================
// THE PICTURES
// =====================================================================================================
function backdropA(top, bot, floorY, floorCol) {
  rectf(0, 0, W, H, lg(0, 0, 0, H, [[0, top], [1, bot]]));
  if (floorY) { rectf(0, floorY, W, H - floorY, lg(0, floorY, 0, H, [[0, floorCol], [1, darken(floorCol, .5)]])); }
}
const shadowOn = (x, y, rx, a = .4) => oval(x, y, rx, rx * .16, `rgba(8,6,16,${a})`);
const STILLS = {
  cast: t => {
    backdropA([62, 74, 104], [36, 38, 62], 800, [72, 62, 80]);
    glow([255, 196, 140], 520, 250, 900, .3); glow([120, 150, 255], 1700, 300, 700, .14);
    const G = 800, L = { light: -1, rim: [150, 190, 255] };
    // the giant: only its head and one shoulder fit in the picture
    const gb = [[1470, 900], [1500, 520], [1640, 400], [1960, 380], [1960, 900]];
    blob(gb, rg(1640, 470, 40, 620, [[0, [206, 40, 40]], [.5, [140, 20, 34]], [1, [56, 6, 26]]]), .45);
    for (const [x, y, a2] of [[1528, 470, -.5], [1590, 420, -.3]]) at(x, y, 1, a2, () => taper([[0, 16], [0, -46]], [40, 2], rgba(mix(A.devS, A.devD, .5))));
    devilHead(1740, 330, 150, { age: 1, expr: 'grin', look: [-.8, .6], tilt: -.16, ...L, fed: 1 });
    [[330, 520], [560, 250]].forEach(([x, hh]) => shadowOn(x, G, hh * .26));
    person({ who: 'dad', x: 330, y: G, h: 520, expr: 'tired', age: 38, tie: 'loose', sleeves: 'rolled', look: [.3, 0], ...L });
    person({ who: 'lily', x: 560, y: G, h: 250, expr: 'smile', look: [-.3, -.3], ...L });
    shadowOn(840, G, 150); devil({ x: 850, y: G, h: 560, stage: 3, expr: 'charm', look: [-.5, .1], handL: [742, 556], elbow: [1, 1], handR: [985, 470], handPoseR: 'flat', handAngR: -.5, tail: [.34, -.2], ...L });
    shadowOn(1075, G, 70); devil({ x: 1075, y: G, h: 270, stage: 2, expr: 'sly', look: [-.4, 0], tail: [.36, -.3], ...L });
    shadowOn(1225, G, 44); devil({ x: 1225, y: G, h: 130, stage: 1, expr: 'happy', tail: [.4, -.4], ...L });
    devil({ x: 1322, y: G, h: 34, stage: 0, expr: 'sweet', tail: [.4, -.5], ...L });
    // the thumb-sized one, enlarged
    ctx.save(); ctx.beginPath(); ctx.arc(1330, 560, 150, 0, TAU); ctx.fillStyle = rg(1300, 520, 10, 160, [[0, [96, 104, 140]], [1, [44, 48, 78]]]); ctx.fill(); ctx.clip();
    devil({ x: 1330, y: 680, h: 230, stage: 0, expr: 'sweet', look: [-.3, -.2], tail: [.42, -.44], handL: [1262, 560], ...L }); ctx.restore();
    ctx.beginPath(); ctx.arc(1330, 560, 150, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke(); stroke([[1324, 762], [1326, 712]], 3, 'rgba(255,255,255,.5)');
    label('DAD, 38', 330, 850, 30); label('LILY, 6', 560, 850, 30); label('AGE 34', 840, 850, 30); label('31', 1075, 850, 30); label('26', 1225, 850, 30); label('AGE 21', 1340, 850, 30); label('AGE 38', 1740, 560, 30);
    rectf(0, 870, W, 210, lg(0, 870, 0, 900, [[0, [20, 20, 36], 0], [1, [20, 20, 36], .82]]));
    // faces
    ['charm', 'sly', 'plead', 'rage'].forEach((e, i) => { devilHead(1010 + i * 232, 968, 62, { age: [.75, .75, .5, 1][i], expr: e, ...L }); });
    ['laugh', 'tempted', 'horror'].forEach((e, i) => { humanHead(150 + i * 215, 962, 58, 'dad', { expr: e, age: i ? 38 : 21, ...L }); });
    humanHead(790, 968, 56, 'lily', { expr: 'fear', ...L });
    finish({ bloom: .22, grain: .03, vignette: .35 });
  },
  // AGE 21, the first one
  m1: t => {
    backdropA([120, 62, 44], [46, 22, 34]);
    // a party out of focus: a window, string lights, friends
    blurred(26, () => { rectf(1180, 60, 560, 520, rgba([40, 60, 110])); rectf(1440, 60, 14, 520, rgba([90, 50, 40])); rectf(1180, 300, 560, 12, rgba([90, 50, 40]));
      for (const [x, hh, c] of [[190, 620, [70, 36, 46]], [1560, 560, [80, 40, 44]], [1790, 640, [60, 30, 44]]]) { oval(x, 1080 - hh, 96, 112, rgba(c)); blob([[x - 190, 1100], [x - 150, 1080 - hh + 150], [x, 1080 - hh + 96], [x + 150, 1080 - hh + 150], [x + 190, 1100]], rgba(c), .4); } });
    bokeh(3, 26, [0, 30, W, 420], [[255, 190, 110], [255, 140, 90], [255, 220, 170], [120, 210, 200]], 24, 64, .5, t);
    glow([255, 170, 90], 420, 260, 900, .34);
    const L = { light: -1, rim: A.hot };
    const gx = 1392, gy = 842, gs = 372, rimY = gy - gs;
    // Dad, 21, delighted
    const d = person({ who: 'dad', x: 700, y: 2520, h: 2300, age: 21, expr: 'laugh', turn: .3, look: [.95, .1], tilt: .07, tie: 'none', shirt: [58, 150, 142], shirtS: [26, 62, 92], handR: [gx - 60, gy - 96], handPoseR: 'fist', handAngR: -1.2, noLegs: true, elbow: [1, 1], ...L });
    additive(() => { glow(A.hot, d.head[0] + 190, d.head[1] + 40, 300, .32); });            // its light on his face
    // the glass, his fingers round it
    glassA(gx, gy, gs, .74, .1);
    for (let i = 0; i < 4; i++) { const y = gy - 66 - i * 47; taper([[gx - 172, y + 8], [gx - 70, y - 6], [gx + 10 - i * 8, y + 2]], [46, 44, 34], lg(0, y - 22, 0, y + 24, [[0, mix(A.skinL, A.skin, .5)], [1, mix(A.skin, A.skinS, .45)]])); oval(gx + 6 - i * 8, y + 1, 13, 11, rgba(A.skinL, .55)); }
    // foam it climbed out of, and the newborn on the rim
    for (const [x, y, r] of [[gx - 110, rimY + 8, 34], [gx - 50, rimY - 6, 40], [gx + 130, rimY + 6, 30], [gx + 96, rimY + 30, 26]]) disc(x, y, r, 'rgba(255,250,236,.97)');
    const dv = devil({ x: gx + 10, y: rimY + 4, h: 300, stage: 0, expr: 'happy', look: [-.9, -.05], tilt: -.12, sit: true, sitDir: -1, handL: [gx - 150, rimY - 170], handR: [gx + 150, rimY - 150], handPoseL: 'flat', handPoseR: 'flat', tail: [.42, -.42], turn: -1, fed: .5, ...L, rim: [255, 220, 170] });
    disc(dv.head[0] + 44, dv.head[1] - 150, 22, 'rgba(255,250,236,.97)'); disc(dv.head[0] + 70, dv.head[1] - 138, 14, 'rgba(255,250,236,.97)');   // foam on its head
    additive(() => glow(A.hot, gx, rimY - 120, 420, .2));
    stamp('AGE 21', 'his first'); words('kind', 'You\u2019re funnier with me.', 990);
    finish({ bloom: .26, grain: .035, t });
  },
  // AGE 34, the best friend
  m2: t => {
    backdropA([78, 48, 32], [26, 18, 26]);
    blurred(20, () => { for (let r = 0; r < 2; r++) { rectf(0, 250 + r * 250, W, 16, rgba([60, 34, 22]));
      for (let i = 0; i < 16; i++) { const x = 40 + i * 124 + r * 50, hh = 150 + rnd(i * 3 + r) * 50; rectf(x, 250 + r * 250 - hh, 46, hh, rgba([[214, 130, 40], [60, 130, 120], [150, 70, 30], [220, 170, 90]][(i + r) % 4], .8)); rectf(x + 14, 250 + r * 250 - hh - 44, 18, 46, rgba([180, 120, 60], .7)); } } });
    bokeh(9, 18, [0, 40, W, 520], [[255, 180, 90], [255, 214, 140], [110, 200, 190]], 20, 56, .3, t);
    cone(640, -40, 120, 640, 1000, [255, 196, 120], .24); glow([255, 180, 100], 640, 120, 700, .28);
    const L = { light: -1, rim: [255, 150, 70] }, SH = { shirt: [240, 222, 198], shirtS: [150, 108, 112] }, DSH = { shirt: [232, 200, 184], shirtS: [140, 84, 96] };
    // the devil, his size, in his shirt and tie, leaning in to his ear
    const dv = devil({ x: 1170, y: 1672, h: 1460, stage: 3, cloth: 'shirt', expr: 'charm', look: [-.95, .25], lean: -.085, tilt: -.12, noLegs: true, noArms: true, noTail: true, fed: .7, ...DSH, ...L });
    // its sleeve behind his neck
    taper([[dv.shL[0] + 30, dv.shL[1] + 20], [700, 640], [470, 668]], [150, 120, 104], rgba(mix(DSH.shirt, DSH.shirtS, .5)));
    // Dad
    const d = person({ who: 'dad', x: 640, y: 1716, h: 1500, age: 38, expr: 'tempted', turn: .3, look: [.5, .9], tilt: .05, tie: 'loose', sleeves: 'rolled', noLegs: true, noArms: true, ...SH, ...L });
    additive(() => glow(A.hot, d.head[0] + 170, d.head[1] + 20, 260, .26));
    // its hand hangs over his far shoulder
    taper([[d.shL[0] + 6, d.shL[1] - 34], [d.shL[0] - 26, d.shL[1] + 8]], [104, 104], rgba(mix(DSH.shirt, DSH.shirtS, .3)));
    hand(d.shL[0] - 30, d.shL[1] + 20, 1.75, 72, { col: A.dev, colS: A.devD, claw: 1, fingers: 3, pose: 'open', len: 1.15 });
    // its other arm comes round from the right and tips the bottle over his glass
    taper([[1600, 960], [1380, 760], [1190, 672]], [150, 124, 100], lg(1190, 0, 1600, 0, [[0, DSH.shirt], [1, mix(DSH.shirt, DSH.shirtS, .6)]]));
    taper([[1250, 700], [1190, 672]], [106, 104], rgba(mix(DSH.shirt, DSH.shirtS, .45)));
    stroke([[934, 742], [900, 790], [880, 880]], 9, rgba([250, 176, 50], .92));
    at(1212, 628, 1, -1.99, () => bottleA(0, 0, 330, { fill: .62, col: [30, 96, 70], alpha: .78 }));
    hand(1196, 664, -2.8, 76, { col: A.dev, colS: A.devD, claw: 1, fingers: 3, pose: 'grip', len: 1.1 });
    rectf(0, 930, W, 150, lg(0, 930, 0, 1080, [[0, [96, 54, 30]], [.1, [62, 34, 22]], [1, [26, 14, 14]]])); rectf(0, 930, W, 6, rgba([255, 200, 130], .5));
    additive(() => { ctx.save(); ctx.translate(900, 942); ctx.scale(1, .1); glow([255, 190, 110], 0, 0, 800, .3); ctx.restore(); });
    glassA(872, 934, 176, .4);
    stamp('AGE 34'); words('kind', 'One more. You earned it.', 1012, 66);
    finish({ bloom: .16, grain: .035, t });
  },
  // AGE 38, his chair
  m3: t => {
    backdropA([74, 94, 100], [44, 48, 66], 800, [74, 54, 52]);
    for (let i = 0; i < 14; i++) { const x = 60 + i * 100, y = 70 + Math.sin(i / 13 * Math.PI) * 54; poly([[x, y], [x + 72, y + 4], [x + 36, y + 86]], rgba([[70, 190, 200], [236, 110, 150], [240, 240, 236], [120, 110, 220]][i % 4])); }
    curve([[40, 66], [700, 130], [1440, 70]], 4, 'rgba(240,240,240,.7)');
    for (const [x, y, c] of [[96, 470, [70, 190, 200]], [200, 400, [236, 110, 150]], [330, 450, [120, 110, 220]]]) { stroke([[x, y + 70], [x + 10, 800]], 2.5, 'rgba(240,240,240,.5)'); oval(x, y, 56, 70, rgba(c)); oval(x - 18, y - 24, 12, 20, 'rgba(255,255,255,.4)'); }
    const L = { light: -1, rim: [255, 190, 120] };
    glow(A.dev, 1300, 420, 1200, .4);
    // ---- the giant, bent under the ceiling, in his chair ----
    const body = [[800, 520], [900, 250], [1130, 90], [1440, 20], [1760, 110], [1930, 380], [1960, 860], [760, 860]];
    const bPath = () => blobPath(body, .45, true);
    taper([[1800, 700], [1980, 520], [1900, 200], [1700, 250]], [70, 56, 36, 18], lg(1800, 700, 1700, 250, [[0, A.devS], [.7, A.dev], [1, A.hot]]));     // its tail curls behind
    bPath(); ctx.fillStyle = rg(1040, 260, 60, 1100, [[0, [206, 40, 40]], [.45, [140, 20, 34]], [1, [56, 6, 26]]]); ctx.fill();
    inside(bPath, () => {
      additive(() => glow(A.hot, 1290, 700, 420, .9));                                                                                 // the furnace
      blob([[1290, 470], [1400, 640], [1340, 800], [1290, 860], [1236, 800], [1180, 640]], rg(1290, 690, 0, 230, [[0, A.hotL], [.5, A.hot], [1, mix(A.hot, A.dev, .6)]]), .5);
      for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) taper([[1290 + sd * 110, 560 + i * 86], [1290 + sd * 230, 536 + i * 86], [1290 + sd * 330, 556 + i * 86]], [22, 14, 1], rgba(A.hot, .8));
      oval(1520, 330, 330, 210, rgba([60, 6, 26], .34)); oval(1010, 520, 150, 190, rgba([60, 6, 26], .3));                                    // the hollows under its shoulders
      ctx.save(); ctx.lineWidth = 26; ctx.strokeStyle = lg(1100, 0, 800, 0, [[0, [255, 190, 120], 0], [1, [255, 190, 120], .8]]); bPath(); ctx.stroke(); ctx.restore();
    });
    for (const [x, y, a2] of [[905, 250, -.5], [985, 172, -.36], [1075, 112, -.24], [1700, 82, .3], [1790, 140, .46]]) at(x, y, 1, a2, () => taper([[0, 22], [0, -62]], [50, 2], rgba(mix(A.devS, A.devD, .5))));   // spines
    // its arms come down onto the table
    const armG = (sh, el, wr, far) => { taper([sh, el, wr], [230, 170, 120], lg(sh[0], sh[1] - 100, wr[0], wr[1] + 60, [[0, far ? [150, 22, 34] : [214, 44, 40]], [1, far ? [80, 10, 28] : [128, 16, 32]]]));
      ctx.save(); ctx.translate(-14, -22); taper([sh, el, wr], [50, 40, 26], rgba([255, 150, 110], .22)); ctx.restore(); };
    armG([1760, 330], [1840, 640], [1500, 760], true);
    hand(1486, 760, Math.PI - .06, 104, { col: mix(A.dev, A.devS, .4), colS: A.devD, claw: 1.1, fingers: 3, pose: 'flat', len: 1.2, flip: true });
    const hd = devilHead(1170, 372, 196, { age: 1, expr: 'grin', look: [-.9, .75], tilt: -.34, light: -1, rim: [255, 190, 120], fed: 1, aura: false, hat: [.98, -1.28, .95, .5] });
    armG([900, 420], [640, 590], [790, 752], false);
    // ---- the table, the cake, the bottle with Dad in it ----
    rectf(300, 786, 1700, 40, lg(0, 786, 0, 826, [[0, [232, 220, 210]], [1, [164, 144, 144]]])); rectf(300, 826, 1700, 300, lg(0, 826, 0, 1080, [[0, [200, 184, 180]], [1, [112, 98, 112]]]));
    additive(() => { ctx.save(); ctx.translate(1100, 794); ctx.scale(1, .07); glow(A.hot, 0, 0, 800, .5); ctx.restore(); });
    hand(800, 772, Math.PI + .1, 110, { col: A.dev, colS: A.devD, claw: 1.1, fingers: 3, pose: 'flat', len: 1.2 });       // its hand round the bottle
    const cx = 1110, cy = 786;
    rectf(cx - 150, cy - 96, 300, 96, lg(cx - 150, 0, cx + 150, 0, [[0, [252, 242, 238]], [1, [196, 176, 196]]])); oval(cx, cy - 96, 150, 22, rgba([255, 250, 246]));
    for (let i = 0; i < 9; i++) blob([[cx - 150 + i * 36, cy - 92], [cx - 132 + i * 36, cy - 60 - (i % 3) * 8], [cx - 114 + i * 36, cy - 92]], rgba([236, 110, 150]), .5);
    for (let i = 0; i < 6; i++) { const x = cx - 100 + i * 40, y = cy - 104 - (i % 2) * 5; rectf(x - 5, y - 46, 10, 46, rgba([[70, 190, 200], [240, 240, 236]][i % 2])); additive(() => glow([255, 200, 120], x, y - 62, 44, .8));
      blob([[x, y - 46], [x + 9, y - 58], [x - 5, y - 84 - 6 * Math.sin(t * 9 + i)], [x - 9, y - 58]], rgba([255, 236, 170]), .5); }
    bottleA(560, 786, 300, { fill: .1, cork: true, col: [150, 214, 190], inside: () => person({ who: 'dad', x: 560, y: 778, h: 168, age: 38, expr: 'horror', tie: 'loose', handL: [524, 668], handR: [596, 668], handPoseL: 'flat', handPoseR: 'flat', look: [-.7, .3], light: 1, rim: A.hot }) });
    // ---- Lily ----
    shadowOn(210, 1050, 110, .35);
    person({ who: 'lily', x: 210, y: 1050, h: 440, expr: 'fear', look: [.9, -.8], turn: .6, tilt: -.12, handL: [196, 846], handR: [236, 842], handPoseL: 'fist', handPoseR: 'fist', elbow: [-1, 1], light: 1, rim: [255, 120, 80] });
    stamp('AGE 38', 'her 6th birthday', 470, 210); words('real', 'THEY ONLY SEE YOU.', 986, 96);
    finish({ bloom: .16, grain: .035, t });
  }
};
