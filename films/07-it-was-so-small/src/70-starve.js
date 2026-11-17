// ---- 67.3-93.3 he starves it ----
const clock = txt => hw(txt, W - 90, 142, 36, 'say', { align: 'right', rot: 0, weight: 400 });
const deflate = (L, a, x, y, r = 300) => { if (L < a || L > a + .5) return; const k = seg(L, a, a + .5); ctx.lineWidth = 10 * (1 - k); ctx.strokeStyle = rgba(D.red, .8 * (1 - k)); ctx.beginPath(); ctx.arc(x, y, r * (1 - k * .8), 0, TAU); ctx.stroke(); };
shot('day1', 'run', 'DAY: 1', (L, u, t, c) => {
  const jo = c('justOne'), up = c('up1'), stood = L >= up - .15, upK = eio(seg(L, up - .15, up + .3)), offer = eo(seg(L, jo - .5, jo));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [620, 560, 620, [255, 214, 180], .1] });
    // the door, dawn behind it, and the giant filling it
    outlined(() => { ctx.beginPath(); ctx.rect(1190, 150, 520, 750); }, rgba([58, 44, 52]), 7); ctx.fillStyle = lg(0, 150, 0, 900, [[0, [90, 110, 170], .5], [.7, [255, 170, 130], .55], [1, [255, 200, 150], .6]]); ctx.fillRect(1206, 166, 488, 734);
    cone(1450, 880, 250, 760, 190, [255, 190, 150], .12, -420);
    const g = figure({ kind: 'devil', x: 1470, y: 1270, h: 1020, stage: 4, expr: devEx(stood ? 'grin' : 'charm', L, [1.6]), look: [-.9, .5], lean: -.12, tilt: -.14 + Math.sin(L * 1.4) * .02, noLegs: true, noArms: true, noTail: true, heat: .7, t });
    const gx = lerp(1250, 1010, offer), gy = lerp(760, 650, offer);
    devArm([[g.shL[0] - 10, g.shL[1] + 60], [lerp(1240, 1150, offer), 600], [gx + 44, gy - 20]], [120, 100, 70], 44); glassD(gx, gy + 40, 96, .62);
    // he ties his shoe with shaking hands
    outlined(() => { ctx.beginPath(); ctx.rect(430, 770, 330, 26); }, rgba(D.wood), 5); for (const x of [450, 720]) outlined(() => { ctx.beginPath(); ctx.rect(x, 796, 22, 104); }, rgba(mix(D.wood, D.stage, .3)), 4);
    const tr = Math.sin(t * 41) * 4 * (1 - upK);
    if (!stood) { const f = figure({ kind: 'sam', x: 600, y: 770, h: 450, sit: 1, drop: .25, lean: .5, tilt: .2, expr: 'strain', look: [.4, .9], armL: [700 + tr, 868], armR: [760 - tr, 872], bendL: -.3, bendR: .3, stretch: true, glowOn: [D.red, .16], glowSide: 1, t }); }
    else figure({ kind: 'sam', x: lerp(640, 700, upK), y: 900, h: 450, expr: samEx('resolve', L, [up + .25]), look: [.9, -.5], turn: .4, drop: lerp(.2, 0, upK), glowOn: [D.red, .16], glowSide: 1, t });
    outlined(() => blobPath([[690, 900], [692, 866], [730, 862], [790, 880], [800, 900]], .4, true), rgba([210, 214, 224]), 3.5); curve([[726, 866], [716, 850 + tr], [736, 846], [740, 866], [760, 848 - tr], [752, 868]], 3.5, rgba(D.line), .5);
  });
  clock('6:00 AM'); red('just one. for the shakes.', 760, 300, 72, L, jo, 1.1);
});
shot('run', 'day14', 'DAY: 1', (L, u, t, c) => {
  camD(push(u, .03), 960, 560, () => {
    stageD(900, {}); ctx.fillStyle = lg(0, 520, 0, 900, [[0, [255, 170, 120], 0], [1, [255, 170, 120], .3]]); ctx.fillRect(0, 520, W, 380);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 898); ctx.clip(); disc(1540, 900, 150, rgba([255, 214, 150])); glow([255, 190, 130], 1540, 880, 520, .5); ctx.restore();
    for (let i = 0; i < 5; i++) { const x = ((i * 520 - L * 760) % 2600 + 2600) % 2600 - 300; stroke([[x, 900], [x, 560]], 7, rgba(D.prop)); curve([[x - 90, 560], [x - 60, 470], [x, 440], [x + 70, 480], [x + 90, 560], [x, 580]], 6, rgba(D.prop), .5); }
    const ph = L * TAU * 2.6, st = Math.sin(ph), gx = lerp(700, 250, eio(seg(L, 0, 2.6))), gph = L * TAU * 1.3;
    const g = figure({ kind: 'devil', x: gx, y: 900, h: 760, stage: 3.7, expr: { ...DX.rage, m: 'frown' }, look: [.9, 0], lean: .1, stride: Math.sin(gph), drop: Math.abs(Math.cos(gph)) * .02, armR: [gx + 250, 520], armL: [gx + 200, 560], bendR: -.3, bendL: -.3, tail: [-.3, -.1 + .05 * Math.sin(gph)], heat: .6, t, stretch: true });
    const x = 1130 + Math.sin(L * 1.5) * 20;
    figure({ kind: 'sam', x, y: 900 - Math.abs(Math.cos(ph)) * 16, h: 450, lean: .16, stride: st, lift: st > 0 ? 1 : -1, expr: 'strain', look: [.8, 0], turn: .4, armL: [x - 40 - st * 70, 700 + st * 30], armR: [x + 50 + st * 70, 700 - st * 30], bendL: -.6, bendR: -.6, t });
    for (let i = 0; i < 6; i++) { const k = (L * 2.5 + i / 6) % 1; stroke([[x - 150 - k * 260, 560 + i * 52], [x - 230 - k * 300, 560 + i * 52]], 4, rgba(D.white, .5 * (1 - k))); }
  });
  clock('6:00 AM');
});
shot('day14', 'day40', 'DAY: 14', (L, u, t, c) => {
  const reps = [c('rep1'), c('rep2'), c('rep3')], sl = c('slide'), bp = c('bump'), nf = c('noFun');
  const upK = Math.max(...reps.map((r, i) => eio(seg(L, r - .42, r)) * (i < 2 ? 1 - eio(seg(L, r + .15, r + .62)) : 1)));
  const rot = Math.PI / 2 - lerp(.03, .34, upK), px = 520, py = 842, h = 450, dir = [Math.sin(rot), -Math.cos(rot)];
  const toL = (wx, wy) => { const dx = wx - px, dy = wy - py, cs = Math.cos(-rot), sn = Math.sin(-rot); return [dx * cs - dy * sn, dx * sn + dy * cs]; };
  const slide = eio(seg(L, sl, bp)), landed = L >= bp, shr = landed ? eo(seg(L, bp, bp + .3)) : 0;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [900, 560, 760, [255, 214, 180], .14] });
    outlined(() => { ctx.beginPath(); ctx.rect(180, 200, 250, 290); }, rgba([120, 100, 110]), 5); ctx.fillStyle = lg(0, 200, 0, 490, [[0, [150, 170, 220], .7], [1, [255, 190, 150], .8]]); ctx.fillRect(194, 214, 222, 262); stroke([[305, 200], [305, 490]], 5, rgba(D.line)); cone(305, 490, 120, 430, 400, [255, 200, 160], .1, 300);
    const hx = px + dir[0] * h * .64;
    at(px, py, 1, rot, () => figure({ kind: 'sam', x: 0, y: 0, h, expr: upK > .15 && upK < .97 ? 'strain' : landed ? samEx('resolve', L, []) : 'strain', tilt: -rot * .82, look: [.2, .3], armL: toL(hx - 30, 894), armR: toL(hx + 20, 896), bendL: -.1, bendR: -.1, stretch: true, t }));
    const seatX = px + dir[0] * h * .34, seatY = py + dir[1] * h * .34 - 56;
    const dx = lerp(seatX, 250, slide), dy = lerp(seatY, 872, slide * slide), dh = lerp(430, 360, shr);
    const f = figure({ kind: 'devil', x: dx, y: dy, h: dh, stage: lerp(3, 2.6, shr), sit: 1, flat: slide > .5, drop: .2, expr: landed ? 'sulk' : L > sl ? { ...DX.plead, m: 'open' } : devEx('sly', L, [.3]), look: landed ? [.8, .2] : [.3, .6], lean: landed ? -.1 : slide * -.5, tilt: Math.sin(L * 1.8) * .04 - slide * .3 * (1 - shr),
      armL: landed ? undefined : [dx - 40, dy - 110], armR: landed ? undefined : [dx + 50, dy - 100], bendL: .6, bendR: -.6, tail: landed ? [-.3, .04] : [-.4, -.1 + .05 * Math.sin(t * 3)], heat: .7 - .3 * shr, t });
    tieD(f, D.ember);
    if (landed) { deflate(L, bp, dx, dy - 160, 330); for (let i = 0; i < 6; i++) { const a = -Math.PI * (i + .5) / 6, k = seg(L, bp, bp + .3); stroke([[dx + Math.cos(a) * (120 + k * 60), 880 + Math.sin(a) * (40 + k * 30)], [dx + Math.cos(a) * (150 + k * 110), 880 + Math.sin(a) * (56 + k * 50)]], 5, rgba(D.white, 1 - k)); } }
  });
  clock('6:30 AM'); red('you’re no fun.', 1330, 330, 72, L, nf, .7);
});
shot('day40', 'day60', 'DAY: 40', (L, u, t, c) => {
  const pulls = [c('pull1'), c('pull2'), c('pull2') + 1.15], pk = Math.max(...pulls.map(r => eio(seg(L, r - .45, r)) * (1 - eio(seg(L, r + .12, r + .6))))), dr = c('dropOff'), fell = L >= dr, fall = eo(seg(L, dr, dr + .28)), shr = fell ? eo(seg(L, dr + .28, dr + .55)) : 0, sm = L >= c('smile40');
  camD(push(u, .04), 960, 560, () => {
    const G = 940; stageD(G, { pool: [960, 500, 800, [255, 226, 180], .15] }); glow([255, 220, 150], 300, 160, 300, .5); disc(300, 160, 60, rgba([255, 232, 170]));
    stroke([[1700, G], [1700, 620]], 12, rgba(D.prop)); curve([[1590, 620], [1600, 470], [1700, 400], [1810, 470], [1820, 620], [1700, 660]], 7, rgba(D.prop), .5);
    for (const x of [770, 1090]) { stroke([[x, G], [x, 176]], 18, rgba(D.line)); stroke([[x, G], [x, 176]], 10, rgba(D.prop)); } stroke([[750, 180], [1110, 180]], 20, rgba(D.line)); stroke([[750, 180], [1110, 180]], 12, rgba(D.propL));
    // Lily on the bench
    outlined(() => { ctx.beginPath(); ctx.rect(1300, 800, 330, 22); }, rgba(D.wood), 5); for (const x of [1320, 1590]) outlined(() => { ctx.beginPath(); ctx.rect(x, 822, 20, G - 822); }, rgba(mix(D.wood, D.stage, .3)), 4);
    figure({ kind: 'lily', x: 1470, y: 800, h: 290, sit: -1, drop: .2, expr: sm ? samEx('smile', L, []) : 'calm', look: [-.9, -.6 - pk * .3], turn: -.4, tilt: sm ? -.08 : 0, t });
    const fy = lerp(690, 560, pk), x = 930;
    const f = figure({ kind: 'sam', x, y: fy, h: 420, expr: pk > .1 && pk < .95 ? 'strain' : samEx('resolve', L, []), look: [0, -.4], armL: [x - 150, 184], armR: [x + 150, 184], bendL: .5 * pk, bendR: -.5 * pk, stretch: true, t });
    const dy = fell ? lerp(fy + 262, G - 4, fall) : fy + 262, dh = lerp(250, 196, shr);
    const d = figure({ kind: 'devil', x: x + 26 + (fell ? fall * 60 : 0), y: fell && fall >= 1 ? G - 6 : dy, h: dh, stage: lerp(2, 1.5, shr), sit: fell && fall >= 1 ? 1 : 0, flat: true, drop: fell && fall >= 1 ? .2 : 0, expr: fell ? 'sulk' : devEx('sulk', L, [1.2]), look: fell ? [.6, -.4] : [0, -.8],
      armL: fell ? undefined : [x + 4, fy - 6], armR: fell ? undefined : [x + 36, fy - 6], bendL: .1, bendR: -.1, tail: fell ? [-.36, .03] : [.12 + .05 * Math.sin(t * 4), .2], heat: .6 - .2 * shr, t, stretch: true });
    if (fell) deflate(L, dr + .28, d.hip[0], d.hip[1] - 80, 240);
  });
  clock('7:15 AM');
});
// DAY 60: the bar's door
function barDoorD(t) { outlined(() => { ctx.beginPath(); ctx.rect(1290, 300, 330, 590); }, rgba([70, 44, 34]), 7); ctx.fillStyle = lg(0, 300, 0, 890, [[0, [255, 190, 90], .75], [1, [255, 150, 60], .6]]); ctx.fillRect(1306, 316, 298, 574);
  glow([255, 170, 80], 1455, 600, 520, .32); cone(1455, 870, 160, 700, 150, [255, 170, 80], .2, -380);
  outlined(() => { ctx.beginPath(); ctx.rect(1240, 880, 430, 24); }, rgba(D.prop), 5);
  ctx.save(); ctx.shadowColor = rgba([255, 120, 60], .9); ctx.shadowBlur = 22; const nx = 1455, ny = 210; ctx.lineWidth = 7; ctx.strokeStyle = rgba([255, 170, 110], .7 + .3 * Math.sin(t * 9) * (Math.sin(t * 2.3) > .6 ? 1 : 0)); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(nx - 44, ny - 44); ctx.lineTo(nx + 44, ny - 44); ctx.lineTo(nx + 6, ny + 4); ctx.lineTo(nx + 6, ny + 44); ctx.lineTo(nx + 30, ny + 50); ctx.moveTo(nx - 44, ny - 44); ctx.lineTo(nx - 6, ny + 4); ctx.lineTo(nx - 6, ny + 44); ctx.lineTo(nx - 30, ny + 50); ctx.stroke(); ctx.restore(); }
function stepDevil(L, t, o = {}) { const k = o.droop || 0, h = lerp(176, 132, o.shr || 0);
  const d = figure({ kind: 'devil', x: 1205, y: 880, h, stage: lerp(1, .6, o.shr || 0), sit: -1, expr: o.expr, look: o.look || [-.9, -.5], tilt: .06 + k * .3, lean: k * .12, armL: k ? undefined : [1150, 824], armR: k ? undefined : [1172, 828], bendL: .4, bendR: .4, tail: [lerp(.5, .46, k), lerp(-.3, .1, k)], heat: .7 - .3 * k, t });
  ctx.save(); ctx.globalAlpha = .95; if (!k) glassD(1150, 836, 44, .7); else at(1120, 880, 1, -1.45, () => glassD(0, 0, 44, .1)); ctx.restore(); return d; }
shot('day60', 'tempt', 'DAY: 60', (L, u, t, c) => {
  const sp = c('stop60'), wk = seg(L, 0, sp), x = lerp(300, 780, eo(wk)), walking = L < sp - .1;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [700, 560, 700, [150, 130, 210], .1] }); barDoorD(t);
    stepDevil(L, t, { expr: devEx('plead', L, [1.7]) });
    figure({ kind: 'sam', x, y: 900, h: 450, expr: walking ? samEx('calm', L, []) : samEx('tempted', L, [sp + .6]), look: walking ? [.6, 0] : [.9, .6], turn: .4, stride: walking ? Math.sin(L * 11) : 0, drop: walking ? Math.abs(Math.cos(L * 11)) * .014 : 0, glowOn: [[255, 170, 80], walking ? .1 + .2 * wk : .3], glowSide: 1, t });
  });
  clock('7:40 PM'); red('just a sip. i’m so small.', 860, 290, 72, L, c('sip60'), 1.05);
});
shot('tempt', 'handShot', 'DAY: 60', (L, u, t, c) => {
  camD(push(u, .08), 960, 540, () => {
    stageD(0, { pool: [900, 500, 800, [150, 130, 210], .1] }); glow([255, 170, 80], 1900, 560, 900, .3);
    const gulp = Math.sin(seg(L, .7, 1.1) * Math.PI);
    const f = figure({ kind: 'sam', x: 900, y: 2060 + gulp * 22, h: 1900, expr: { ...FX.tempted, lid: .3 + .12 * Math.sin(t * 23) * seg(L, .3, 1), sweat: true }, look: L < .6 ? [.8, .7] : L < 1.2 ? [.95, 0] : [.8, .7], turn: .35, tilt: .03, noLegs: true, noArms: true, glowOn: [[255, 150, 60], .42 + .06 * Math.sin(t * 15)], glowSide: 1, t });
  });
  clock('7:40 PM');
});
shot('handShot', 'day90', 'DAY: 60', (L, u, t, c) => {
  const hd = c('hand'), wo = c('walkOn'), inK = eo(seg(L, 0, hd)), go = seg(L, wo, wo + 1.5), gx = go * go * 760 + go * 120, walking = go > 0, ph = L * 9;
  const z = lerp(1.32, 1.0, eio(seg(L, wo - .2, wo + .7)));
  camD(z, lerp(800, 960, eio(seg(L, wo - .2, wo + .7))), lerp(640, 560, eio(seg(L, wo - .2, wo + .7))), () => {
    stageD(900, { pool: [700, 560, 700, [150, 130, 210], .1] }); barDoorD(t);
    stepDevil(L, t, { expr: walking ? 'sulk' : devEx('plead', L, []), look: walking ? [-.9, .2] : [-.9, -.5], droop: eo(seg(L, wo, wo + .6)), shr: eo(seg(L, wo + .3, wo + .9)) });
    if (L > wo + .3) deflate(L, wo + .3, 1205, 800, 200);
    const sx = 780 - gx, lx = lerp(430, 660, inK) - gx, hx = (sx + lx) / 2 + 14, hy = 756;
    const took = L >= hd;
    figure({ kind: 'lily', x: lx, y: 900, h: 290, expr: took ? 'smile' : 'calm', look: walking ? [-.7, -.2] : [.8, -.8], turn: walking ? -.4 : .4, armR: took ? [hx, hy] : [lx + 40, 800], bendR: -.2, stride: walking ? Math.sin(ph * 1.25) * .8 : inK < 1 ? Math.sin(L * 16) * .6 : 0, glowOn: [[255, 170, 80], .2], glowSide: 1, t, stretch: true });
    figure({ kind: 'sam', x: sx, y: 900, h: 450, expr: took ? (walking ? samEx('smile', L, []) : { ...FX.smile, bi: -.16 }) : 'tempted', look: took ? (walking ? [-.7, .1] : [-.8, .8]) : [.9, .6], turn: took ? -.4 : .4, armL: took ? [hx, hy] : undefined, bendL: .2, stride: walking ? Math.sin(ph) * .9 : 0, drop: walking ? Math.abs(Math.cos(ph)) * .014 : 0, glowOn: [[255, 170, 80], .3], glowSide: 1, t, stretch: true });
    if (took) { const k = seg(L, hd, hd + .7); glow(D.yellow, hx, hy, 60 + 170 * k, .7 * (1 - k)); }
  });
  clock('7:40 PM');
});
// DAY 90: thumb-sized again
function counterTopD() { outlined(() => { ctx.beginPath(); ctx.rect(-200, 820, W + 400, 40); }, rgba(D.wood), 6); rectf(-200, 860, W + 400, 400, rgba([30, 30, 40])); additive(() => { ctx.save(); ctx.translate(900, 824); ctx.scale(1, .06); glow([255, 220, 170], 0, 0, 800, .4); ctx.restore(); }); }
const bigSam = (L, t, o = {}) => figure({ kind: 'sam', x: 1540, y: 2010, h: 1800, noLegs: true, noArms: true, expr: samEx('smile', L, o.blinks || []), look: o.look || [-.9, .6], turn: -.4, tilt: -.04, dim: .16, t });
const tinyRage = (x, y, L, t, o = {}) => figure({ kind: 'devil', x, y, h: 300, stage: 0, expr: o.expr || { ...DX.rage, h: .8 }, look: o.look || [.5, -.6], tilt: Math.sin(t * 17) * .08, armL: o.armL || [x - 120, y - 250 + Math.sin(t * 21) * 30], armR: o.armR || [x + 120, y - 250 - Math.sin(t * 21) * 30], bendL: .4, bendR: -.4, tail: [-.46 + .08 * Math.sin(t * 14), -.3], heat: .5, stretch: true, t, ...o.more });
const BOT = { alpha: .18, col: [120, 170, 150] };
shot('day90', 'lower', 'DAY: 90', (L, u, t, c) => {
  const grab = eo(seg(L, 1.3, 1.85));
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [1000, 480, 900, [255, 222, 176], .16] }); bigSam(L, t, { blinks: [.9] }); counterTopD();
    bottleD(520, 820, 600, BOT);
    const jump = Math.abs(Math.sin(L * 8.5)) * 34 * (1 - grab), x = 940;
    const f = tinyRage(x, 820 - jump, L, t);
    for (let i = 0; i < 3; i++) { const k = (L * 2.4 + i / 3) % 1, a = -1.1 - i * .5; stroke([[f.head[0] + Math.cos(a) * (130 + k * 40), f.head[1] + Math.sin(a) * (130 + k * 40)], [f.head[0] + Math.cos(a) * (165 + k * 70), f.head[1] + Math.sin(a) * (165 + k * 70)]], 6, rgba(D.red, 1 - k)); }
    if (jump < 4 && L < 1.3) for (const sd of [-1, 1]) stroke([[x + sd * 70, 812], [x + sd * 110, 800]], 5, rgba(D.white, .6));
    const tip = [lerp(1300, x - 150, grab), lerp(-200, 640, grab)];
    taper([[tip[0] + 150, tip[1] - 800], [tip[0] + 90, tip[1] - 300], tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([[tip[0] + 150, tip[1] - 800], [tip[0] + 90, tip[1] - 300], tip], [150, 132, 104], lg(0, tip[1] - 200, 0, tip[1] + 100, [[0, D.cream], [1, D.creamS]]));
  });
  clock('7:00 AM');
});
shot('lower', 'shelf', 'DAY: 90', (L, u, t, c) => {
  const bd = c('bottleDown'), ck = c('cork90'), lift = eio(seg(L, 0, .22)), over = eio(seg(L, .08, bd - .16)), fall = seg(L, bd - .16, bd), isIn = L >= bd, bx = 520, top = 220;
  const hx = lerp(790, bx + 150, over), hy = lerp(640, 150, lift);                      // the tip of his arm, holding it by the tail
  const dx = isIn ? bx : fall > 0 ? bx : hx - 150, dyFeet = isIn ? 812 : fall > 0 ? lerp(top - 10, 812, fall * fall) : hy + 330;
  const sh = isIn ? Math.sin((L - bd) * 50) * 8 * (1 - seg(L, bd, bd + .3)) : 0;
  camD(lerp(1.05, 1.1, u), 900, 540 + sh, () => {
    stageD(0, { pool: [900, 480, 900, [255, 222, 176], .16] }); bigSam(L, t, { blinks: [1.2], look: [-.9, .5] }); counterTopD();
    const pound = L > ck + .08 ? Math.sin(L * 28) : 0;
    const dev = () => fall > 0 || isIn ? tinyRage(dx, dyFeet, L, t, { armL: isIn ? [dx - 96, dyFeet - 180 + (pound > 0 ? -22 : 10)] : undefined, armR: isIn ? [dx + 96, dyFeet - 180 + (pound < 0 ? -22 : 10)] : undefined, look: [.7, -.5] })
      : (ctx.save(), ctx.translate(dx, hy + 30), ctx.rotate(Math.PI + Math.sin(t * 9) * .25), tinyRage(0, 150, L, t, { more: { noTail: true }, look: [0, .8] }), ctx.restore());
    if (isIn || fall > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, top + 400); ctx.clip(); dev(); ctx.restore(); bottleD(bx, 820, 600, { ...BOT, cork: L >= ck, inside: dev }); }
    else { bottleD(bx, 820, 600, BOT); dev(); devArm([[dx + 10, hy + 40], [dx + 70, hy + 20], [hx - 20, hy + 4]], [20, 16, 12], 16); }
    // his arm; after the drop it comes back with the cork
    const ret = eo(seg(L, bd + .1, ck)), away = eio(seg(L, ck + .12, ck + .6));
    const tip = !isIn ? [hx, hy] : [lerp(bx + 150, bx + 40, ret) + away * 500, lerp(150, top - 70, ret) - away * 260];
    if (isIn && L < ck) outlined(() => { ctx.beginPath(); ctx.rect(tip[0] - 80, tip[1] + 22, 66, 54); }, rgba([186, 140, 96]), 4);
    taper([[tip[0] + 170, tip[1] - 800], [tip[0] + 100, tip[1] - 300], tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([[tip[0] + 170, tip[1] - 800], [tip[0] + 100, tip[1] - 300], tip], [150, 132, 104], lg(0, tip[1] - 200, 0, tip[1] + 100, [[0, D.cream], [1, D.creamS]]));
  });
  clock('7:00 AM');
});
shot('shelf', 'newDraw', 'DAY: 90', (L, u, t, c) => {
  const sd = c('setDown'), up = eio(seg(L, .05, sd)), done = eio(seg(L, sd + .1, sd + .5));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [1000, 520, 800, [255, 222, 176], .17] });
    outlined(() => { ctx.beginPath(); ctx.rect(180, 240, 260, 300); }, rgba([150, 170, 210]), 5); ctx.fillStyle = lg(0, 240, 0, 540, [[0, [170, 200, 240], .8], [1, [255, 226, 170], .8]]); ctx.fillRect(194, 254, 232, 272); stroke([[310, 240], [310, 540]], 5, rgba(D.line)); cone(310, 540, 130, 460, 360, [255, 220, 170], .12, 300);
    outlined(() => { ctx.beginPath(); ctx.rect(1180, 300, 420, 22); }, rgba(D.wood), 5); for (const x of [1220, 1540]) stroke([[x, 322], [x - 30, 380]], 6, rgba(D.line));
    kitchenD(t);
    const bx = lerp(1370, 1400, up), by = lerp(600, 300, up);
    bottleD(bx, by, 150, { ...BOT, alpha: .25, cork: true, inside: () => { glow(D.red, bx, by - 30, 40, .7); disc(bx, by - 26, 9, rgba(D.ink)); for (const s of [-1, 1]) disc(bx + s * 4, by - 28, 2, rgba(D.hot)); } });
    figure({ kind: 'sam', x: 1290, y: 900 - 12 * up * (1 - done), h: 450, expr: done > .5 ? samEx('smile', L, []) : 'resolve', look: done > .5 ? [-.5, 0] : [.5, -.9], turn: done > .5 ? -.2 : .3, armR: done > .3 ? undefined : [bx - 20, by - 10], bendR: -.2, stretch: true, t });
  });
  clock('7:00 AM');
});
