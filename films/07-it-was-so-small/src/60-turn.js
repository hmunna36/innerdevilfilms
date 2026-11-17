// ---- 58.5-67.3 the turn ----
// from inside the bottle: the glass, its green, the room beyond; fn draws him
function insideGlassD(t, crack = 0, drawK = .4) {
  rectf(-400, -400, W + 800, H + 800, rgba([10, 16, 15])); additive(() => { glow(D.red, 1760, 300, 700, .22); glow([200, 212, 236], 1500, 420, 520, .12); });
  ctx.save(); ctx.globalAlpha = drawK; drawingD(1450, 400, 270, .06, true); ctx.restore();
}
function glassFrontD(t, cracks, seedX = 900, seedY = 620) {
  rectf(-400, -400, W + 800, H + 800, rgba([70, 150, 120], .1));
  for (const [x, w, a] of [[250, 70, .16], [360, 22, .1], [1640, 46, .12]]) { ctx.fillStyle = lg(x, 0, x + w, 0, [[0, D.white, 0], [.5, D.white, a], [1, D.white, 0]]); ctx.fillRect(x, -400, w, H + 800); }
  for (const sd of [-1, 1]) curve([[960 + sd * 900, -300], [960 + sd * 930, 540], [960 + sd * 900, 1400]], 16, rgba([150, 210, 190], .5), .5);
  if (cracks > 0) for (let i = 0; i < 11; i++) { const a = rnd(i * 3.7) * TAU, len = (120 + rnd(i * 5.1) * 520) * cracks, mid = [seedX + Math.cos(a) * len * .5 + (rnd(i) - .5) * 60 * cracks, seedY + Math.sin(a) * len * .5 + (rnd(i * 2) - .5) * 60 * cracks];
    stroke([[seedX, seedY], mid, [seedX + Math.cos(a) * len, seedY + Math.sin(a) * len]], 5, rgba(D.white, .85)); if (i % 3 === 0) stroke([mid, [mid[0] + Math.cos(a + 1) * len * .3, mid[1] + Math.sin(a + 1) * len * .3]], 3.5, rgba(D.white, .7)); }
}
function palmD(x, y, s = 1) { oval(x, y, 78 * s, 92 * s, rgba(D.line)); oval(x, y, 66 * s, 80 * s, rgba(D.cream)); oval(x, y, 44 * s, 56 * s, rgba(lighten(D.cream, .5), .7)); }
shot('inside', 'pound', 'AGE: 38', (L, u, t, c) => {
  camD(push(u, .07), 960, 540, () => {
    insideGlassD(t, 0, .75);
    const ex = L < .8 ? samEx('horror', L, []) : L < 1.5 ? { ...FX.sad, lid: .1 } : 'resolve';
    const f = figure({ kind: 'sam', x: 860, y: 1900, h: 1700, expr: ex, look: [.85, -.25], turn: .3, tilt: .03, noLegs: true, noArms: true, t }); tieD(f, TIE, .14);
    if (L > .7 && L < 1.7) { const k = seg(L, .7, 1.2); for (const sd of [-1, 1]) { const x = f.head[0] + sd * f.hr * .36 + f.hr * .1, y = f.head[1] + f.hr * .2; blob([[x, y], [x + 16 * k, y + 30 * k], [x, y + 54 * k], [x - 16 * k, y + 30 * k]], rgba([150, 200, 240], .9), .5); } }
    palmD(430, 800); palmD(1300, 840);
    glassFrontD(t, 0);
  });
});
shot('pound', 'floor', 'AGE: 38', (L, u, t, c) => {
  const P = [c('pound1'), c('pound2'), c('pound3')], hit = blinkAt(L, P, .1), n = P.filter(p => L >= p).length, tp = c('tip'), sm = c('smash'), roll = eio(seg(L, tp, sm)) * .5;
  const sh = P.reduce((a, p) => a + (L >= p ? Math.sin((L - p) * 60) * 22 * (1 - seg(L, p, p + .25)) : 0), 0);
  if (L >= sm) { const k = seg(L, sm, sm + .2); rectf(0, 0, W, H, rgba(D.white, 1 - k * .9));
    for (let i = 0; i < 26; i++) { const a = rnd(i * 2.3) * TAU, d = 120 + k * (500 + rnd(i * 4.1) * 900), x = 960 + Math.cos(a) * d, y = 540 + Math.sin(a) * d, s = 30 + rnd(i * 6.7) * 70; at(x, y, s, a + k * 4, () => poly([[-1, -.4], [.9, -.7], [.2, 1]], rgba([150, 210, 190], .9 - k * .5))); }
    return; }
  ctx.save(); ctx.translate(960, 540); ctx.rotate(roll); ctx.translate(-960, -540);
  camD(1.07 + .05 * hit + roll * .5, 960 + sh, 540 + sh * .4, () => {
    insideGlassD(t, 0, .75);
    const pr = n % 2;   // which fist
    const f = figure({ kind: 'sam', x: 860, y: 1900, h: 1700, expr: L > tp ? 'strain' : hit > .2 ? 'strain' : 'resolve', look: [.6, -.1], turn: .3, tilt: .03 - hit * .05, noLegs: true, noArms: true, t }); tieD(f, TIE, .14);
    palmD(430, 800 - (pr === 1 ? hit * 40 : 0), 1 + (pr === 1 ? hit * .18 : 0)); palmD(1300, 840 - (pr === 0 ? hit * 40 : 0), 1 + (pr === 0 ? hit * .18 : 0));
    glassFrontD(t, n === 0 ? 0 : n === 1 ? .12 : n === 2 ? .3 : lerp(.6, 1, seg(L, P[2], sm)), 1180, 700);
  });
  ctx.restore();
});
// the kitchen: a counter with a sink on the left
function kitchenD(t) { outlined(() => { ctx.beginPath(); ctx.rect(120, 640, 560, 260); }, rgba([44, 46, 60]), 5); outlined(() => { ctx.beginPath(); ctx.rect(100, 622, 600, 26); }, rgba(D.wood), 5);
  outlined(() => { ctx.beginPath(); ctx.rect(330, 600, 250, 24); }, rgba([128, 138, 160]), 4); curve([[560, 600], [560, 500], [500, 470], [460, 500]], 16, rgba(D.line), .5); curve([[560, 600], [560, 500], [500, 470], [460, 500]], 9, rgba([128, 138, 160]), .5); }
const giantUp = (L, t, o) => figure({ kind: 'devil', x: 1430, y: 1330, h: 1180, stage: 4, noLegs: true, noArms: true, noTail: true, hat: [.86, -1.9, .9, .5], t, ...o });
shot('floor', 'sink', 'AGE: 38', (L, u, t, c) => {
  const st = c('stand'), up = eio(seg(L, st - .3, st + .25));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [760, 560, 700, [200, 212, 236], .1] }); kitchenD(t);
    bottleD(250, 622, 230, { fill: .5, col: [40, 110, 84], alpha: .85 });
    const g = giantUp(L, t, { expr: devEx('grin', L, [.9]), look: [-.9, .9], lean: -.14, tilt: -.16 + Math.sin(L * 1.2) * .02 });
    devArm([[g.shL[0] - 20, g.shL[1] + 60], [1100, 640], [1140, 860]], [150, 130, 104], 50);
    for (let i = 0; i < 16; i++) { const x = 600 + rnd(i * 3.3) * 620, s = 10 + rnd(i * 5.1) * 22; at(x, 896, s, rnd(i) * 3, () => poly([[-1, 0], [.8, -.5], [.3, .2]], rgba([150, 210, 190], .8))); }
    const f = up < .5 ? figure({ kind: 'sam', x: 860, y: 900, h: 450, kneel: 1, lean: .5, expr: 'strain', look: [0, .9], armL: [880, 892], armR: [960, 892], bendL: -.2, bendR: .2, stretch: true, drop: .2, glowOn: [D.red, .25], glowSide: 1, t })
      : figure({ kind: 'sam', x: 860, y: 900, h: 450, expr: 'resolve', look: L > st + .45 ? [-.9, 0] : [.8, -.9], turn: L > st + .45 ? -.4 : .3, drop: lerp(.2, 0, seg(up, .5, 1)), glowOn: [D.red, .25], glowSide: 1, t });
    tieD(f, TIE);
  });
});
shot('sink', 'day1', 'AGE: 38', (L, u, t, c) => {
  say('he stopped feeding it.', 560, 170, 66, L, c('capStop'), .7);
  const g0 = c('glug'), g1 = c('glugEnd'), fz = c('flinch'), af = c('afraid'), pour = seg(L, g0, g1), pouring = L > g0 && L < g1, tipK = eo(seg(L, g0 - .35, g0));
  const shr = eo(seg(L, fz, fz + .25)) * .06 + eo(seg(L, fz + .5, fz + .75)) * .05 + eo(seg(L, af - .2, af + .1)) * .05, rec = eo(seg(L, fz, fz + .2)), scared = L >= af - .1;
  const sh = L >= fz ? Math.sin((L - fz) * 44) * 10 * (1 - seg(L, fz, fz + .5)) : 0;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [600, 560, 700, [200, 212, 236], .12] }); kitchenD(t);
    const g = giantUp(L, t, { h: 1180 * (1 - shr), x: 1430 + sh + rec * 50, expr: L < fz ? devEx('grin', L, []) : scared ? { ...DX.plead, pup: .6 } : { ...DX.rage, m: 'frown' }, look: scared ? [-.3, .6] : [-.9, .6], lean: -.14 + rec * .22, tilt: -.16 + rec * .2, heat: 1 - shr * 6 });
    if (scared) { const k = eo(seg(L, af - .1, af + .3)), tr = Math.sin(t * 38) * 5; devArm([[g.shL[0] - 20, g.shL[1] + 60], [1080, 760], [lerp(1140, 1180 + tr, k), lerp(860, 560, k)]], [130, 110, 84], 44); }
    else devArm([[g.shL[0] - 20, g.shL[1] + 60], [1100 + rec * 60, 640], [1140 + rec * 80, 860 - rec * 120]], [150, 130, 104], 50);
    const bx = lerp(250, 520, tipK), by = lerp(622, 440, tipK), rot = lerp(0, 2.6, tipK);
    const f = figure({ kind: 'sam', x: 760, y: 900, h: 450, expr: samEx('resolve', L, [1.9]), look: [-.8, .3], turn: -.4, armL: [bx + 60, by + 40], bendL: .5, stretch: true, glowOn: [D.red, .2 * (1 - shr * 5)], glowSide: 1, t }); tieD(f, TIE);
    if (pouring) { stroke([[bx - 130, by + 150], [bx - 140 + Math.sin(t * 30) * 3, 540], [bx - 136, 600]], 18, rgba(D.amber)); for (let i = 0; i < 5; i++) { const k = (L * 3 + i * .2) % 1; disc(bx - 136 + (rnd(i) - .5) * 80, 600 - k * 40, 5 * (1 - k), rgba(D.amber, 1 - k)); } }
    at(bx, by, 1, rot, () => bottleD(0, 0, 230, { fill: .5 * (1 - pour), col: [40, 110, 84], alpha: .85 }));
    if (L >= fz) { popRing(L, fz, 1430, 640, 500, -360); }
  });
});
