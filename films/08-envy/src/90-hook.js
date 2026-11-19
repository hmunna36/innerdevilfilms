// ---- the hook (source 200-204.6): SAME BOY. SAME DESK. / "why not me?" / "look." ----
// 1. the split at its widest, a mirror image, dimmed so the eye lands on the two huge counters first
shot('hk1', 'hk2', null, (L, u, t, c) => {
  const lift = eo(seg(L, .15, 1.2));
  camD(lerp(1.06, 1.0, eio(u)), 960, 540, () => SPLIT(side => { if (side < 0) { rightDesk(t, L + 30, { rub: false, look: [.1, .9] }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .2] }); litterD(); wallWin(L + 40, t);
    const f = figure({ kind: 'sam', x: 520, y: 880, h: 470, noLegs: true, expr: { ...FX.sad, lid: .3, bags: true }, look: [-.4, -.95], tilt: -.12, glowOn: [GREEN, .5], glowSide: -1, armL: [440, 680], armR: [600, 684], t });
    devBehind(t, { x: 230, y: 940, h: 640, expr: devEx('grin', L, []), look: [.7, .3], lean: .2, tilt: .1, cap: true, medal: true, heat: 1.2, armR: [f.head[0] - f.hr * .9, f.head[1] + f.hr * .1], armL: [f.head[0] + f.hr * .2, f.head[1] + f.hr * .55], bendR: -.2, bendL: .6 });
    deskD(80, 880, DESK_Y); }, {}));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba([0, 0, 0], lerp(.62, .22, lift))); ctx.restore();
  counterL('PAGES: 0', 110); counterR('PAGES: 300', 110);
  slam('SAME BOY. SAME DESK.', 960, 1030, 90, L, c('hkSame'), 'say');
});
// 2. close on the left one's face, lit green from below; the devil's grin behind him
shot('hk2', 'hk3', null, (L, u, t, c) => {
  camD(lerp(1.0, 1.08, eio(u)), 960, 540, () => {
    stageD(0, { pool: [960, 1000, 900, GREEN, .3] });
    const d = figure({ kind: 'devil', x: 560, y: 2260, h: 1900, stage: 3, noLegs: true, noArms: true, noTail: true, expr: devEx('grin', L, [1.0]), look: [.8, .4], tilt: .14, lean: .1, heat: 1.1, t }); devCap(d, 1);
    const f = figure({ kind: 'sam', x: 1220, y: 2380, h: 1900, noLegs: true, noArms: true, expr: { ...FX.tempted, lid: .35, bags: true }, look: [-.3, .7], tilt: -.04, glowOn: [GREEN, .6], glowSide: 0, t });
    additive(() => glow(GREEN, 1180, 1100, 700, .35));
  });
  say('why not me?', 1460, 170, 100, L, c('hkWhy'), .5);
});
// 3. the devil turns to the camera and holds its window out to us
shot('hk3', 'hk4', null, (L, u, t, c) => {
  const turn = eio(seg(L, 0, .35)), out = eback(seg(L, .1, .5));
  camD(lerp(1.0, 1.06, eio(u)), 960, 540, () => {
    stageD(0, { pool: [960, 560, 800, GREEN, .22] });
    const d = figure({ kind: 'devil', x: 960, y: 1700, h: 1500, stage: 3, noLegs: true, noTail: true, expr: L < .35 ? devEx('sly', L, []) : devEx('charm', L, [1.1]), look: [lerp(-.8, 0, turn), lerp(.2, .1, turn)], turn: lerp(-.4, 0, turn), heat: 1, t, armL: [700, 760], armR: [1220, 760] });
    devCap(d, 1); medalD(d.sx, d.shY + d.h * .2, d.h * .05, [d.sx, d.shY + d.h * .04]);
    windowD(960, lerp(1060, 870, out), lerp(280, 540, out), lerp(210, 405, out), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L + 2, t), { glow: 1.4 });
  });
  red('look.', 1660, 520, 130, L, c('hkLook'), .3);
});
