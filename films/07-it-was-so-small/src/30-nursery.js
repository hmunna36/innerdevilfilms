// ---- 25.7-33.5 AGE 31: the nursery ----
function nurseryD(t) {
  outlined(() => { ctx.beginPath(); ctx.rect(200, 190, 270, 310); }, rgba([36, 48, 84]), 5); stroke([[335, 190], [335, 500]], 5, rgba(D.line)); stroke([[200, 345], [470, 345]], 5, rgba(D.line));
  disc(410, 262, 32, rgba([230, 236, 252])); glow([170, 190, 255], 410, 262, 160, .5); cone(335, 500, 135, 430, 370, [150, 170, 255], .13, 250);
  const cx = 1460, cy = 860, col = rgba(D.prop);
  for (let i = 0; i < 9; i++) outlined(() => { ctx.beginPath(); ctx.rect(cx - 176 + i * 43, cy - 240, 9, 190); }, col, 3.5);
  for (const y of [cy - 262, cy - 62]) outlined(() => { ctx.beginPath(); ctx.rect(cx - 196, y, 392, 24); }, col, 4);
  for (const sd of [-1, 1]) outlined(() => { ctx.beginPath(); ctx.rect(cx + sd * 184 - 9, cy - 300, 18, 300); }, col, 4);
  stroke([[cx, 0], [cx, 250]], 2.5, rgba(D.floor)); stroke([[cx - 110, 250], [cx + 110, 250]], 3, rgba(D.floor));
  for (const [dx, len, cc, ph] of [[-110, 70, D.yellow, 0], [-36, 110, [150, 190, 230], 1.3], [40, 80, [226, 222, 212], 2.2], [110, 104, [190, 90, 120], 3.1]]) { const sw = Math.sin(t * 1.4 + ph) * 8; stroke([[cx + dx, 250], [cx + dx + sw, 250 + len]], 2, rgba(D.floor));
    at(cx + dx + sw, 250 + len + 14, 15, t * .4 + ph, () => { poly(Array.from({ length: 10 }, (_, i) => { const a = i / 10 * TAU, r = i % 2 ? .45 : 1.1; return [Math.cos(a) * r, Math.sin(a) * r]; }), rgba(cc)); }); }
}
function stoolD(x, y, rot = 0) { at(x, y, 1, rot, () => { outlined(() => { ctx.beginPath(); ctx.rect(-58, -160, 116, 18); }, rgba(D.wood), 4); for (const sd of [-1, 1]) outlined(() => poly([[sd * 40 - 7, -142], [sd * 40 + 7, -142], [sd * 54 + 7, 0], [sd * 54 - 7, 0]]), rgba(mix(D.wood, D.stage, .3)), 4); }); }
shot('a31', 'flask', 'AGE: 31', (L, u, t, c) => {
  say('it never left.', 900, 190, 66, L, c('capNever'), .6);
  camD(push(u), 960, 560, () => {
    stageD(860, { pool: [860, 520, 760, [170, 190, 255], .12] }); nurseryD(t);
    const rock = Math.sin(L * 2.1) * .035;
    stoolD(1090, 860);
    figure({ kind: 'devil', x: 1090, y: 700, h: 272, stage: 2, expr: devEx('sweet', L, [1.5]), look: [-.8, .5], lean: -.2, tilt: -.14 + Math.sin(L * 1.3) * .03, armL: [1010, 640], bendL: .3, tail: [.4 + .05 * Math.sin(t * 2.4), -.28 + .04 * Math.cos(t * 2)], heat: .8, t });
    const sam = figure({ kind: 'sam', x: 880, y: 860, h: 450, expr: { ...samEx('smile', L, [.8]), bags: true }, look: [-.2, .9], lean: rock, tilt: .1 + rock, armL: [828, 742], armR: [946, 738], bendL: -.6, bendR: .6, glowOn: [[170, 190, 255], .14], glowSide: -1, t });
    babyD(sam.sx - 6, sam.shY + 132, 66, { rot: -.16 + rock });
  });
});
shot('flask', 'drink31', 'AGE: 31', (L, u, t, c) => {
  const tk = c('take31'), take = eio(seg(L, tk, tk + .55)), offer = eo(seg(L, 0, .55));
  camD(push(u), 960, 560, () => {
    stageD(0, { pool: [700, 450, 800, [170, 190, 255], .12] }); glow([170, 190, 255], 150, 200, 500, .18);
    const dv = figure({ kind: 'devil', x: 1570, y: 1400, h: 940, stage: 2, expr: devEx(L < tk ? 'sweet' : 'charm', L, [1.1, 2.5]), look: [-.9, L < tk ? .1 : .4], tilt: -.08 + Math.sin(L * 1.7) * .03, noLegs: true, noArms: true, noTail: true, t });
    const ph = L < .9 ? 0 : L < 1.95 ? 1 : 2;
    const look = ph === 1 ? [-.25, .95] : [.9, .25], ex = ph === 0 ? samEx('tired', L, [.45]) : ph === 1 ? { ...FX.sad, bags: true } : samEx('tempted', L, [2.75]);
    const f0 = [lerp(1420, 1220, offer), lerp(760, 640, offer)], fp = [lerp(f0[0], 1090, take), lerp(f0[1], 700, take)];
    const sam = figure({ kind: 'sam', x: 660, y: 1700, h: 1500, expr: ex, look, turn: ph === 1 ? -.1 : .4, tilt: ph === 1 ? .1 : .02, noLegs: true, armL: [470, 1180], armR: take > 0 ? [fp[0] - 30, fp[1] + 60] : [850, 1180], bendL: -.5, bendR: .5, stretch: true, glowOn: [D.red, .2], glowSide: 1, t });
    babyD(640, 1004, 250, { rot: -.12 + Math.sin(L * 2) * .02 });
    const ret = eio(seg(L, tk + .3, tk + .9));
    devArm([[dv.shL[0] - 10, dv.shL[1] + 60], [lerp(1400, 1500, ret), lerp(900, 980, ret)], [lerp(f0[0] + 70, 1470, ret), lerp(f0[1] + 50, 900, ret)]], [84, 78, 68]);
    flaskD(fp[0], fp[1], 150, lerp(.25, -.1, take));
    if (take > .5) { taper([[fp[0] - 150, fp[1] + 150], [fp[0] - 70, fp[1] + 80], [fp[0] - 6, fp[1] + 50]], [116, 110, 98], rgba(D.line)); taper([[fp[0] - 150, fp[1] + 150], [fp[0] - 70, fp[1] + 80], [fp[0] - 8, fp[1] + 50]], [104, 98, 86], rgba(D.cream)); }
  });
  red('you earned it.', 1390, 190, 76, L, c('earned'), .9);
});
shot('drink31', 'a34', 'AGE: 31', (L, u, t, c) => {
  const fl = c('flare31'), pp = c('pop31'), popped = L >= pp, pop = eback(seg(L, pp, pp + .4)), flare = flareK(L, fl - .2, pp + .25), shake = popped ? Math.sin((L - pp) * 46) * 14 * (1 - seg(L, pp, pp + .6)) : 0;
  const dk = eo(seg(L, .05, .4)) * (1 - eio(seg(L, pp + .15, pp + .6)));
  camD(1.1 * push(u, .04), 1000 + shake, 540, () => {
    stageD(860, { pool: [860, 520, 760, [170, 190, 255], .12] }); nurseryD(t);
    stoolD(popped ? 1250 : 1090, 860, popped ? eo(seg(L, pp, pp + .35)) * 1.45 : 0);
    const h = popped ? lerp(272, 474, pop) : 272 * (1 + .06 * flare), st = popped ? lerp(2, 3, eo(seg(L, pp, pp + .25))) : 2;
    const dv = figure({ kind: 'devil', x: 1090, y: popped ? 860 : 700, h, stage: st, expr: popped ? devEx('charm', L, []) : L > fl ? { ...DX.happy, h: 1.35 } : devEx('sweet', L, [.5]), look: [-.8, .3], lean: popped ? -.06 : -.2, tilt: -.1, noArms: popped, tail: [.4 + .06 * Math.sin(t * (popped ? 7 : 2.4)), -.26], heat: .8 + 2.4 * flare, t });
    const sam = figure({ kind: 'sam', x: 880, y: 860, h: 450, expr: dk > .3 ? { ...FX.tired, lid: .92 } : 'tired', look: [.2, .6], tilt: -.34 * dk, headDx: -.25 * dk, armL: [828, 742], armR: dk > .05 ? [lerp(946, 968, dk), lerp(738, 560, dk)] : [946, 738], bendL: -.6, bendR: .6, glowOn: [D.red, .12 + .3 * flare], glowSide: 1, t });
    babyD(sam.sx - 24, sam.shY + 136, 66, { rot: -.16, awake: popped && L > pp + .2 });
    flaskD(lerp(960, 942, dk), lerp(700, 512, dk), 56, lerp(0, -2.2, dk));
    if (popped) { devArm([[dv.shL[0], dv.shL[1] + 10], [lerp(dv.shL[0], 990, pop), dv.shL[1] + 30 - 40 * pop], [sam.shR[0] + 14, sam.shR[1] + 6]], [34, 32, 36], 22); devArm([[dv.shR[0], dv.shR[1] + 10], [dv.shR[0] + 30, dv.shR[1] + 90], [dv.shR[0] + 24, dv.shR[1] + 160]], [34, 32, 30], 22); }
    burp(L, pp - .25, dv.head[0] - 20, dv.head[1] - dv.hr * 1.6, .8); popRing(L, pp, dv.hip[0], dv.hip[1] - h * .4, 80, 520);
  });
  popFlash(L, pp);
});
