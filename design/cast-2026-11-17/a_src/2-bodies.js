
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
