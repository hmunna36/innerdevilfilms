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

