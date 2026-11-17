// ---- 44.3-58.5 AGE 38: Lily's 6th birthday ----
function partyD(t) {
  for (let i = 0; i < 13; i++) { const x = 90 + i * 104, y = 84 + Math.sin(i / 12 * Math.PI) * 50; outlined(() => poly([[x, y], [x + 70, y + 4], [x + 35, y + 80]]), rgba([[70, 150, 170], [190, 90, 120], [220, 216, 206], [110, 100, 180]][i % 4]), 3.5); }
  curve([[70, 80], [720, 142], [1450, 86]], 3, rgba(D.floor), .5);
  for (const [x, y, cc, ph] of [[96, 500, [70, 150, 170], 0], [400, 430, [190, 90, 120], 1.7]]) { const sw = Math.sin(t * .9 + ph) * 8; stroke([[x + sw, y + 62], [x + 8, 900]], 2.5, rgba(D.floor)); outlined(() => { ctx.beginPath(); ctx.ellipse(x + sw, y, 50, 62, 0, 0, TAU); }, rgba(cc), 3.5); oval(x + sw - 16, y - 22, 10, 16, 'rgba(255,255,255,.35)'); }
}
function ptableD(ty, redK = 1) { outlined(() => { ctx.beginPath(); ctx.rect(440, ty, 1560, 36); }, rgba(D.wood), 5); outlined(() => { ctx.beginPath(); ctx.rect(490, ty + 36, 34, 100); }, rgba(mix(D.wood, D.stage, .3)), 5);
  if (redK) additive(() => { ctx.save(); ctx.translate(1120, ty + 6); ctx.scale(1, .07); glow(D.red, 0, 0, 700, .5 * redK); ctx.restore(); }); }
function cakeD(cx, ty, t, lean = 0, lit = 1) { outlined(() => { ctx.beginPath(); ctx.rect(cx - 140, ty - 92, 280, 92); }, rgba(D.white), 5);
  for (let i = 0; i < 8; i++) blob([[cx - 140 + i * 36, ty - 92], [cx - 122 + i * 36, ty - 62 - (i % 3) * 7], [cx - 104 + i * 36, ty - 92]], rgba([226, 120, 150]), .5);
  for (let i = 0; i < 6; i++) { const x = cx - 100 + i * 40, y = ty - 96; outlined(() => { ctx.beginPath(); ctx.rect(x - 5, y - 44, 10, 44); }, rgba([[90, 170, 190], [230, 226, 216]][i % 2]), 2.5);
    if (lit > 0) { const fl = 1 + .18 * Math.sin(t * 19 + i * 2.1), lx = lean * 26 + Math.sin(t * 11 + i) * 2.5; glow([255, 200, 120], x, y - 60, 46 * lit, .8 * lit); blob([[x, y - 46], [x + 9 * lit, y - 58], [x - 3 + lx, y - 58 - 26 * fl * lit], [x - 9 * lit, y - 58]], rgba(D.hot), .5); } } }
const GIANT = { kind: 'devil', x: 1480, y: 1240, h: 1230, stage: 4, noLegs: true, noArms: true, noTail: true, hat: [.86, -1.9, .9, .5] };
function tinySam(x, y, o) { const f = figure({ kind: 'sam', x, y, h: 165, lw: .02, ...o }); tieD(f, TIE); return f; }
shot('a38', 'claws', 'AGE: 38', (L, u, t, c) => {
  say('it took his chair.', 760, 330, 66, L, c('capChair'), .6);
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14] }); partyD(t);
    const ty = 770, sway = Math.sin(L * 1.3) * .025;
    const g = figure({ ...GIANT, expr: devEx('grin', L, [1.5]), look: [-.9, .8], lean: -.3 + sway, tilt: -.3 + sway, headDx: -.1, headDy: .74, t });
    ptableD(ty);
    devArm([[g.shL[0] - 30, g.shL[1] + 60], [900, 570], [940, ty - 46]], [150, 130, 104], 50); devArm([[g.shR[0] + 20, g.shR[1] + 80], [1800, 640], [1560, ty - 44]], [150, 130, 104], 50);
    cakeD(1130, ty, t);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150] });
    tinySam(760 + Math.sin(t * 43) * 1.5, ty - 4, { expr: 'fear', look: [.9, -.8], t });
    figure({ kind: 'lily', x: 250, y: 900, h: 300, expr: 'fear', look: [.9, -.8], turn: .5, tilt: -.1, armL: [232, 742], armR: [270, 740], bendL: .5, bendR: -.5, glowOn: [D.red, .35], glowSide: 1, t });
  });
});
shot('claws', 'lean38', 'AGE: 38', (L, u, t, c) => {
  const pin = c('pinch'), inb = c('inBottle'), ck = c('cork38'), ty = 770, bx = 560, top = ty - 290;
  const reach = eo(seg(L, 0, pin)), lift = eio(seg(L, pin + .05, pin + .45)), over = eio(seg(L, pin + .4, pin + .8)), down = eio(seg(L, pin + .8, inb)), held = L > pin && L < inb, rel = eo(seg(L, inb, inb + .4));
  const sx = lerp(760, bx, over), sy = lerp(lerp(ty - 4, 462, lift), ty - 8, down), isIn = L >= inb;
  camD(lerp(1.4, 1.5, u), 790, 500, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14] }); partyD(t);
    figure({ ...GIANT, expr: devEx('grin', L, []), look: [-.9, .8], lean: -.3, tilt: -.3, headDx: -.1, headDy: .62, t });
    ptableD(ty); cakeD(1130, ty, t);
    const pound = isIn && L > ck + .1 ? Math.sin(L * 26) : 0;
    const sam = inBottle => tinySam(sx + (held ? Math.sin(t * 30) * 3 : 0), sy, { expr: L < pin ? 'fear' : 'horror', look: isIn ? [.6, -.6] : [.9, -.8], t,
      armL: held ? [sx - 60, sy - 150 + Math.sin(t * 22) * 22] : isIn ? [sx - 42, sy - 118 + (pound > 0 ? -10 : 8)] : undefined, armR: held ? [sx + 60, sy - 150 - Math.sin(t * 22) * 22] : isIn ? [sx + 42, sy - 118 + (pound < 0 ? -10 : 8)] : undefined, bendL: .4, bendR: -.4, stride: held ? Math.sin(t * 20) * .7 : 0 });
    if (sy <= top) { bottleD(bx, ty, 290, { alpha: .2, col: [120, 170, 150] }); sam(); }
    else { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, top); ctx.clip(); sam(); ctx.restore(); bottleD(bx, ty, 290, { alpha: .2, col: [120, 170, 150], cork: L >= ck, inside: () => sam() }); }
    // two claws pinch him by the shoulders
    const cx = held ? sx : lerp(lerp(1150, 760, reach), 1100, rel), cy = held ? sy - 120 : lerp(lerp(230, ty - 124, reach), 150, rel);
    for (const sd of [-1, 1]) devArm([[1560 + sd * 70, 120], [cx + 230 + sd * 60, cy - 190], [cx + sd * (held ? 30 : lerp(70, 34, reach)), cy]], [64, 46, 22], 24);
    // and a thumb pushes the cork home
    if (L > inb + .1) { const k = eo(seg(L, inb + .15, ck)), up = eio(seg(L, ck + .1, ck + .5)), cyk = lerp(180, top - 21, k);
      if (L < ck) outlined(() => { ctx.beginPath(); ctx.rect(bx - 16, cyk - 13, 32, 26); }, rgba([186, 140, 96]), 2.5);
      devArm([[1500, 60], [bx + 260, lerp(cyk - 260, 40, up)], [bx + 6, lerp(cyk - 24, 120, up)]], [64, 50, 34], 24); }
  });
});
const LEAN38 = (L, u, t, c) => {
  const sl = c('cantSee'), k = eio(seg(L, 0, .75)), shake = L >= sl ? Math.sin((L - sl) * 50) * 16 * (1 - seg(L, sl, sl + .5)) : 0, ty = 770;
  camD(push(u, .06), 900 + shake, 560 + shake * .5, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14 * (1 - .5 * k)] }); partyD(t);
    const g = figure({ ...GIANT, expr: L >= sl ? 'rage' : devEx('grin', L, []), look: [-.95, .7], lean: lerp(-.3, -.5, k), tilt: lerp(-.3, -.46, k), headDx: lerp(-.1, -.75, k), headDy: lerp(.62, 1.0, k), heat: 1 + k, t });
    ptableD(ty, 1 + k);
    devArm([[g.shL[0] - 30, g.shL[1] + 60], [lerp(900, 800, k), 570], [lerp(940, 820, k), ty - 46]], [150, 130, 104], 50); devArm([[g.shR[0] + 20, g.shR[1] + 80], [1800, 640], [1560, ty - 44]], [150, 130, 104], 50);
    cakeD(1130, ty, t, -1.6 * k, 1 - .45 * k);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150], cork: true, inside: () => tinySam(560, ty - 8, { expr: 'horror', look: [-.7, -.2], armL: [518, ty - 126 + (Math.sin(L * 26) > 0 ? -10 : 8)], armR: [602, ty - 126 + (Math.sin(L * 26) < 0 ? -10 : 8)], bendL: .4, bendR: -.4, t }) });
    figure({ kind: 'lily', x: 250 - 14 * k, y: 900, h: 300, expr: 'fear', look: [.9, -.8], turn: .5, tilt: -.1 - .06 * k, lean: -.08 * k, armL: [232, 742], armR: [270, 740], bendL: .5, bendR: -.5, glowOn: [D.red, .35 + .25 * k], glowSide: 1, t });
  });
  if (!HOOK) slam('THEY CAN’T SEE ME.', 800, 992, 96, L, sl);
  popFlash(L, sl, .22);
};
shot('lean38', 'truth', 'AGE: 38', LEAN38);
// the same picture, as his family sees it
shot('truth', 'fridge', 'AGE: 38', (L, u, t, c) => {
  const lv = c('leave'), go = eio(seg(L, lv, lv + 1.9)), wIn = eo(seg(L, .15, 1.0)), ty = 770;
  camD(push(u, .04), 900, 560, () => {
    stageD(900, { pool: [900, 520, 800, [196, 208, 232], .1] }); partyD(t);
    chairD(1500, 900, 300, 1);
    const dad = figure({ kind: 'sam', x: 1450, y: 792, h: 520, sit: -1, drop: .25, expr: { ...FX.tired, lid: L > 2.6 ? .8 : .6, m: 'down' }, look: [-.6, .8], lean: -.16, tilt: -.26 + Math.sin(L * 1.1) * .02, armL: [1262, 700], bendL: -.3, stretch: true, t });
    tieD(dad, TIE); for (const sd of [-1, 1]) oval(dad.head[0] + sd * dad.hr * .36 - dad.hr * .16, dad.head[1] + dad.hr * .16, dad.hr * .2, dad.hr * .09, rgba([226, 110, 110], .5), -.26);
    hatD(dad.head[0] + dad.hr * .34, dad.head[1] - dad.hr * .84, dad.hr * 1.15, .42);
    ptableD(ty, 0);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150] });
    bottleD(1250, ty, 250, { fill: .12, col: [40, 110, 84], alpha: .85 }); taper([[1200, 690], [1250, 672], [1296, 690]], [50, 52, 46], rgba(D.line)); taper([[1204, 690], [1250, 674], [1292, 690]], [38, 40, 34], rgba(D.cream));
    // the cake, knocked over
    blob([[820, ty], [900, ty - 30], [1010, ty - 16], [1100, ty - 34], [1180, ty]], rgba([226, 120, 150]), .5);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ty); ctx.clip(); at(1010, ty + 34, 1, -.42, () => { outlined(() => { ctx.beginPath(); ctx.rect(-140, -92, 280, 92); }, rgba(D.white), 5); for (let i = 0; i < 8; i++) blob([[-140 + i * 36, -92], [-122 + i * 36, -62 - (i % 3) * 7], [-104 + i * 36, -92]], rgba([226, 120, 150]), .5); }); ctx.restore();
    for (const [x, r] of [[790, .3], [860, 1.4], [1160, -.5], [730, 1.7]]) at(x, ty - 6, 1, r, () => outlined(() => { ctx.beginPath(); ctx.rect(-5, -44, 10, 44); }, rgba([90, 170, 190]), 2.5));
    const wx = lerp(-140, 150, wIn) - go * 560, lx = 290 - go * 560;
    figure({ kind: 'sam', x: wx, y: 900, h: 430, expr: 'sad', look: [.9, 0], turn: go > .05 ? -.4 : .4, bun: 1, lash: true, armR: wIn > .85 ? [lx - 40, 760] : undefined, bendR: -.3, stride: go > 0 && go < 1 ? Math.sin(L * 9) * .7 : 0, seed: 5, stretch: true, t });
    figure({ kind: 'lily', x: lx, y: 900, h: 300, expr: go > .1 ? 'sad' : 'fear', look: [.9, -.4], turn: .5, tilt: -.06, stride: go > 0 && go < 1 ? Math.sin(L * 11) * .7 : 0, t });
  });
  red('THEY ONLY SEE YOU.', 800, 992, 92, L, c('onlyYou'), 1.1);
});
// her drawing on the fridge
shot('fridge', 'inside', 'AGE: 38', (L, u, t, c) => {
  camD(lerp(1, 1.24, eio(u)), 960, 560, () => {
    outlined(() => { ctx.beginPath(); ctx.rect(330, -60, 1260, 1260); }, rgba([50, 56, 72]), 6); stroke([[330, 150], [1590, 150]], 6, rgba(D.line)); outlined(() => { ctx.beginPath(); ctx.roundRect(400, 260, 30, 440, 12); }, rgba([120, 130, 152]), 4);
    glow([200, 212, 236], 960, 560, 760, .13);
    drawingD(980, 580, 330, -.045, true); disc(980, 366, 26, rgba(D.line)); disc(980, 366, 20, rgba([200, 60, 60])); disc(974, 360, 6, 'rgba(255,255,255,.5)');
    at(1390, 300, 1, .1, () => outlined(() => { ctx.beginPath(); ctx.rect(-70, -50, 140, 100); }, rgba([210, 200, 150]), 4));
  });
});
