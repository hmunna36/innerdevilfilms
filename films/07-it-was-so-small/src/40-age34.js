// ---- 33.5-44.3 AGE 34: it is his size, in his tie ----
const TIE = [86, 120, 138];
shot('a34', 'bar34', 'AGE: 34', (L, u, t, c) => {
  camD(push(u, .04), 960, 560, () => {
    stageD(860, { pool: [900, 520, 760, [255, 216, 170], .13] });
    stroke([[250, 860], [250, 300]], 9, rgba(D.prop)); curve([[250, 300], [258, 236], [340, 226]], 9, rgba(D.prop)); outlined(() => poly([[320, 216], [400, 216], [420, 250], [300, 250]]), rgba(D.prop), 4); cone(360, 250, 50, 330, 610, [255, 222, 166], .17); glow([255, 226, 170], 360, 256, 90, .6);
    const ph = L * TAU * 1.75, st = Math.sin(ph), bob = Math.abs(Math.cos(ph)) * .014, x = 800 + L * 125;
    for (const [dx, kind] of [[-215, 'devil'], [0, 'sam']]) { const X = x + dx, dev = kind === 'devil';
      const f = figure({ kind, x: X, y: 860, h: dev ? 468 : 450, stage: 3, stride: st, drop: bob, lean: .05, expr: dev ? devEx('charm', L, [1.2]) : samEx('tired', L, [.7]), look: dev ? [.8, 0] : [.5, .4], armL: [X - 57 + st * 55, dev ? 730 : 736], armR: [X + 57 - st * 55, dev ? 730 : 736], tail: [-.36, -.2 + .05 * Math.sin(ph)], heat: .8, t });
      tieD(f, dev ? D.ember : TIE); }
  });
});
shot('bar34', 'dinner', 'AGE: 34', (L, u, t, c) => {
  const p0 = c('pour34'), pour = seg(L, p0, p0 + 1.5), pouring = L > p0 && L < p0 + 1.5, tipK = eo(seg(L, p0 - .3, p0)) * (1 - eio(seg(L, p0 + 1.5, p0 + 1.9)));
  camD(push(u), 960, 560, () => {
    stageD(0, {});
    for (let r = 0; r < 2; r++) { stroke([[240, 300 + r * 190], [1680, 300 + r * 190]], 4, rgba(D.floor, .8));
      for (let i = 0; i < 12; i++) { const x = 300 + i * 118 + r * 40, hh = 110 + rnd(i * 3 + r) * 40; bottleD(x, 298 + r * 190, hh, { col: [[70, 130, 110], [150, 100, 50], [90, 100, 140]][(i + r) % 3], alpha: .22, fill: .3 + rnd(i) * .5, lineCol: [90, 100, 110] }); } }
    lampD(900, 150, 900);
    const cy = 860;
    const dv = figure({ kind: 'devil', x: 1150, y: 1290, h: 1080, stage: 3, expr: devEx('charm', L, [1.35]), look: [-.9, .2], lean: -.12, tilt: -.12 + Math.sin(L * 1.6) * .02, noLegs: true, noArms: true, noTail: true, noBelly: true, t });
    tieD(dv, D.ember, .16);
    const sam = figure({ kind: 'sam', x: 700, y: 1260, h: 1020, expr: samEx('tempted', L, [.95]), look: [.5, .9], turn: .3, tilt: .04 + pour * .03, noLegs: true, noArms: true, glowOn: [D.red, .3], glowSide: 1, t });
    tieD(sam, TIE, .16);
    devArm([[dv.shL[0] + 30, dv.shL[1] + 20], [sam.sx + 40, sam.shY - 10], [sam.shL[0] - 30, sam.shL[1] + 90]], [84, 82, 76]);
    if (pouring) stroke([[944, 672], [916 + Math.sin(t * 30) * 2, 720], [900, cy - 20]], 8, rgba(D.amber));
    at(1210, 606, 1, lerp(-1.3, -1.826, tipK), () => bottleD(0, 0, 280, { fill: lerp(.6, .3, pour), col: [40, 110, 84], alpha: .85 }));
    devArm([[dv.shR[0] + 10, dv.shR[1] + 40], [1420, 760], [1196, 640]], [84, 82, 76]);
    rectf(0, cy, W, H - cy, rgba([16, 13, 14])); stroke([[0, cy], [W, cy]], 5, rgba(D.wood)); additive(() => { ctx.save(); ctx.translate(900, cy + 8); ctx.scale(1, .08); glow([255, 210, 150], 0, 0, 760, .3); ctx.restore(); });
    glassD(890, cy - 2, 170, lerp(.06, .62, pour));
  });
  red('one more.', 1480, 985, 76, L, p0 + .5, .6);
});
// dinner: it sits between him and his family. o: paper (0..1 held up), chin (0..1), samTurn, samLook, samEx, devH, devStage, devEx, devLook, heat, wifeEx, lilyEx, lilyLook, jolt, talk
function dinnerD(t, o) {
  stageD(0, {}); lampD(600, 130, 760);
  const TY = 690, jolt = o.jolt || 0;
  const wife = figure({ kind: 'sam', x: 430, y: 850, h: 430, expr: o.wifeEx, look: o.wifeLook || [.9, 0], turn: .3, bun: 1, lash: true, noLegs: true, seed: 5, t });
  const up = o.paper || 0, py = lerp(720, 548, up);
  const lily = figure({ kind: 'lily', x: 650, y: 772, h: 250, expr: o.lilyEx, look: o.lilyLook || [.9, -.3], turn: .4, noLegs: true, armL: up > .02 ? [748, py + 56] : undefined, armR: up > .02 ? [806, py + 56] : undefined, bendL: .3, bendR: .3, stretch: true, t });
  if (up > .02) at(782, py, 64, .08, () => { outlined(() => { ctx.beginPath(); ctx.rect(-1, -.72, 2, 1.44); }, rgba([238, 234, 222]), .04); ctx.lineWidth = .1; ctx.strokeStyle = rgba(D.yellow); ctx.beginPath(); ctx.arc(-.4, -.2, .22, 0, TAU); ctx.stroke(); curve([[-.1, .4], [.2, 0], [.5, .4]], .1, rgba([225, 40, 30]), .5); curve([[.1, .4], [.3, .12], [.6, .4]], .1, rgba([60, 150, 90]), .5); });
  const dh = o.devH || 500, dv = figure({ kind: 'devil', x: 1010 + (o.shake || 0), y: 862 + jolt, h: dh, stage: o.devStage ?? 3, expr: o.devEx, look: o.devLook || [-.8, .1], tilt: o.devTilt ?? -.06, noLegs: true, noTail: true, armL: o.talk ? [880, 560 + Math.sin(t * 7) * 30] : undefined, bendL: .5, heat: o.heat ?? .8, noArms: !!o.noDevArms, t });
  tieD(dv, D.ember);
  const sam = figure({ kind: 'sam', x: 1390, y: 862, h: 450, expr: o.samEx, look: o.samLook, turn: o.samTurn, tilt: .1, lean: .08, noLegs: true, glowOn: [D.red, .22 + .3 * ((o.heat ?? .8) - .8) / 2.4], glowSide: -1, t });
  tieD(sam, TIE);
  if (o.chin > 0) { const k = o.chin, tx = lerp(dv.shR[0] + 60, sam.head[0] - sam.hr * .5, k), ty = lerp(dv.shR[1] + 120, sam.head[1] + sam.hr * .86, k); devArm([[dv.shR[0], dv.shR[1] + 10], [lerp(dv.shR[0] + 40, 1210, k), dv.shR[1] + 90], [tx, ty]], [36, 34, 30], 22); }
  // the table, its cloth, the things on it
  outlined(() => { ctx.beginPath(); ctx.rect(250, TY, 1420, 250); }, rgba([44, 46, 60]), 5); outlined(() => { ctx.beginPath(); ctx.rect(230, TY - 14, 1460, 28); }, rgba(D.wood), 5);
  additive(() => { ctx.save(); ctx.translate(600, TY - 8); ctx.scale(1, .06); glow([255, 214, 160], 0, 0, 520, .5); ctx.restore(); });
  for (const x of [440, 650, 1010]) outlined(() => { ctx.beginPath(); ctx.ellipse(x, TY - 20 - (x === 1010 ? jolt * 1.5 : 0), 62, 10, 0, 0, TAU); }, rgba([210, 206, 196]), 3.5);
  glassD(1290, TY - 16 - Math.abs(jolt) * 2.5, 96, .55);
  return { dv, sam, lily, wife, TY };
}
shot('dinner', 'swell34', 'AGE: 34', (L, u, t, c) => {
  const up = eo(seg(L, c('drawUp') - .1, c('drawUp') + .35)) * (1 - eio(seg(L, c('drawDown'), c('drawDown') + .5))), ch = c('chin'), chin = eo(seg(L, ch - .25, ch)) * (1 - eio(seg(L, ch + .9, ch + 1.3)));
  const turned = L > c('drawUp') + .35 && L < ch, after = L >= ch, talk = L > c('illTalk');
  camD(push(u, .04), 960, 560, () => dinnerD(t, { paper: up, chin, samTurn: turned ? -.5 : after ? .25 : .1, samLook: turned ? [-.9, -.1] : [-.3, .9], samEx: turned ? samEx('smile', L, []) : samEx('tired', L, [.3, 3.4]),
    devEx: talk && Math.sin(L * 15) > 0 ? { ...DX.charm, m: 'open' } : devEx('charm', L, [1.0]), devLook: after ? [-.8, .1] : [.5, .2], devTilt: after ? -.1 : .04, talk,
    wifeEx: after ? 'sad' : 'calm', wifeLook: [.9, .1], lilyEx: L < ch + .3 ? 'smile' : 'sad', lilyLook: L < ch + .3 ? [.9, -.3] : [.3, .8] }));
  red('i’ll talk. you rest.', 1290, 160, 76, L, c('illTalk'), 1.0);
});
shot('swell34', 'a38', 'AGE: 34', (L, u, t, c) => {
  const fl = c('flare34'), pp = c('pop34'), ck = c('creak'), popped = L >= pp, pop = eback(seg(L, pp, pp + .45)), flare = flareK(L, fl - .25, pp + .25), drop = L >= ck ? eo(seg(L, ck, ck + .12)) : 0;
  const shake = (popped ? Math.sin((L - pp) * 46) * 16 * (1 - seg(L, pp, pp + .6)) : 0) + (L >= ck ? Math.sin((L - ck) * 50) * 12 * (1 - seg(L, ck, ck + .4)) : 0);
  camD(lerp(1.22, 1.0, eio(seg(L, pp - .15, pp + .5))), 1040, lerp(540, 560, eio(seg(L, pp - .15, pp + .5))) + shake * .5, () => {
    const d = dinnerD(t, { paper: 0, chin: 0, samTurn: popped ? -.45 : .2, samLook: popped ? [-.8, -.8] : [-.3, .9], samEx: popped ? { ...FX.fear, bags: true } : 'tired',
      devH: (popped ? lerp(500, 800, pop) : 500 * (1 + .05 * flare)), devStage: popped ? lerp(3, 3.6, eo(seg(L, pp, pp + .3))) : 3, devEx: !popped ? (L > fl ? { ...DX.happy, h: 1.35 } : devEx('charm', L, [])) : devEx('grin', L, []), devLook: popped ? [.7, .5] : [0, .3], devTilt: popped ? .08 : 0,
      heat: .8 + 2.4 * flare, wifeEx: popped ? 'fear' : 'sad', wifeLook: popped ? [.9, -.6] : [.9, .1], lilyEx: popped ? 'fear' : 'sad', lilyLook: popped ? [.9, -.8] : [.3, .8], jolt: drop * 30, shake });
    burp(L, pp - .28, d.dv.head[0], d.dv.head[1] - d.dv.hr * 1.7, 1.2); popRing(L, pp, 1010, 600, 140, 700);
    if (L >= ck) { sparks(L, ck, 880, 690, 9, 420, D.wood); sparks(L, ck, 1140, 690, 9, 420, D.wood); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) stroke([[1010 + sd * (150 + i * 16), 690 - 40 - i * 26], [1010 + sd * (190 + i * 30), 690 - 70 - i * 44]], 5, rgba(D.white, 1 - seg(L, ck, ck + .45))); }
  });
  popFlash(L, pp, .3);
});
