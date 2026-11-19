// ---- 49-71 THE WORST and THE TURN: the window is the whole wall; his own monster on the prize; the two of him look at each other ----
// the wall-size window behind his desk (left-half coordinates), what it shows: his own best day. fold 0..1: it falls forward onto the desk
const WALL = { x: 470, y: 330, w: 840, h: 470 };
function wallWin(L, t, o = {}) { const fold = o.fold || 0, sway = o.sway || 0;
  if (fold <= 0) { at(M(WALL.x), WALL.y, 1, sway, () => windowD(0, 0, WALL.w, WALL.h, 1, (x0, y0, w, h) => SHOW.him(x0, y0, w, h, L, t), { glow: 1.6 })); return; }
  // falling forward: the bottom edge stays on the desk, the top comes down toward us (it gets shorter, then flat)
  const h = WALL.h * Math.cos(fold * Math.PI / 2) * (1 - fold * .1), bottom = DESK_Y + 10 - (1 - fold) * 140, w = WALL.w * (1 + .12 * fold);
  if (fold < 1) windowD(M(WALL.x), bottom - Math.max(h, 8) / 2, w, Math.max(h, 8), 1, (x0, y0, ww, hh) => SHOW.him(x0, y0, ww, hh, L, t), { back: fold > .5, glow: 1.6 * (1 - fold) });
}
// the torn pages and balls on his floor (left half)
function litterD(n = 9) { for (let i = 0; i < n; i++) { const x = 60 + rnd(i * 4.3) * 860, y = 905 + rnd(i * 2.1) * 30; if (i % 3) ballD(M(x), y, 18 + rnd(i) * 10, i); else at(M(x), y, 1, (rnd(i * 7) - .5) * 1.4, () => pageD(0, 0, 60, 0, { kind: 'monster', q: .5 })); } }
// the right one at his desk late at night: 300 pages, rubbing out a page, the leak beside him. o: noPencil, look, expr, hold (his pile in his arms)
function rightDesk(t, L, o = {}) { const rub = o.rub ? Math.sin(t * 30) * 26 : 0;
  return deskHalf(t, { lamp: 1, pinned: 12, q: .85, letter: true, pile: o.hold ? 0 : 300, pencil: !o.noPencil,
    boy: { expr: o.expr || { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: o.look || [.1, .9], armL: o.hold ? [400, 600] : [430, 676], armR: o.hold ? [560, 600] : [500 + rub, 668], glowOn: [LAMP, .2], glowSide: 1, ...(o.boy || {}) },
    after: f => { if (o.hold) { const k = pileD(480, 660, 140, 300); } else { deskPage(480); if (!o.noPencil && !o.pencilGone) pencilD(500 + rub, 660, 70, rub ? -2.4 : -.6); } windowDown(M(250), .8 + .2 * Math.sin(t * 2)); } }); }
shot('worst', 'cover', null, (L, u, t, c) => {
  const cl = c('claws'), ww = c('winWall'), am = c('amazing2'), slide = eio(seg(L, 0, .8)), grab = eo(seg(L, cl - .3, cl + .2));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: true }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .22] }); litterD();
    wallWin(L + 20, t);
    const H0 = { x: 520, y: 880 - 470 + 94 }, d = devBehind(t, { x: 330, y: 940, h: 640, expr: L < am ? devEx('grin', L, [1.0]) : { ...DX.grin, h: .8 }, look: [.7, .3], lean: .1, tilt: .1, cap: true, medal: true, heat: 1.2,
      armR: [lerp(420, H0.x + 70, grab), lerp(600, H0.y + 10, grab)], armL: [lerp(240, H0.x - 80, grab), lerp(640, H0.y + 20, grab)], bendR: -.5, bendL: .4 });
    const f = figure({ kind: 'sam', x: 520, y: 880, h: 470, noLegs: true, expr: L < am + .3 ? 'tempted' : { ...FX.sad, lid: .25, bags: true }, look: [-.4, -.95], tilt: -.12 * grab, headDy: -.05, glowOn: [GREEN, .5], glowSide: -1, armL: [440, 680], armR: [600, 684], t });
    if (grab > .5) for (const sd of [-1, 1]) { const cx = f.head[0] + sd * f.hr * .98, cy = f.head[1] + f.hr * .15; devArm([[cx + sd * 30, cy - 20], [cx + sd * 6, cy + 4], [cx - sd * 14, cy + 22]], [30, 26, 20], 16); }
    deskD(80, 880, DESK_Y);
  }, { lineX: lerp(960, 1500, slide), focus: 'L', dim: .55 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  slam('LOOK. ISN’T HE AMAZING?', 760, 1038, 76, L, am);
});
// close on what the window shows: the young man everyone loves holds up a printed comic; the cover is his monster
shot('cover', 'wide', null, (L, u, t, c) => {
  const k = eio(seg(L, c('coverIn') - .1, c('coverIn') + 1.1));
  camD(lerp(1.0, 2.0, k), 960, lerp(540, 640, k), () => { rectf(-400, -400, W + 800, H + 800, rgba(D.stage)); windowD(960, 560, 1700, 950, 1, (x0, y0, w, h) => SHOW.him(x0, y0, w, h, L + 24, t), { glow: 1 }); });
});
// close on his face: he sees it is his monster; the claws on his cheeks
shot('wide', 'wrench', null, (L, u, t, c) => {
  const ew = c('eyesWide');
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [700, 300, 900, GREEN, .25] });
    const f = figure({ kind: 'sam', x: 980, y: 2080, h: 1900, noLegs: true, noArms: true, expr: L < ew ? { ...FX.tempted, lid: .3 } : { ...FX.horror, bags: true }, look: [-.6, -.7], tilt: -.08, glowOn: [GREEN, .55], glowSide: -1, t });
    for (const sd of [-1, 1]) devArm([[sd < 0 ? -100 : 2020, sd < 0 ? 700 : 300], [f.head[0] + sd * f.hr * 1.5, f.head[1] - f.hr * .2], [f.head[0] + sd * f.hr * .92, f.head[1] + f.hr * .3]], [150, 120, 90], 40);
  });
});
// he wrenches free: the claws slip, the window sways, he falls back off his chair
shot('wrench', 'eyes', null, (L, u, t, c) => {
  const p1 = c('pull1'), p2 = c('pull2'), sl = c('slip'), fb = c('fallBack'), th = c('thud');
  const jerk = (L > p1 ? Math.sin((L - p1) * 30) * (1 - seg(L, p1, p1 + .4)) : 0) + (L > p2 ? -Math.sin((L - p2) * 30) * (1 - seg(L, p2, p2 + .4)) : 0), free = eo(seg(L, sl - .1, sl + .3)), fall = eio(seg(L, fb - .15, th));
  const shake = L > th ? Math.sin((L - th) * 50) * 14 * (1 - seg(L, th, th + .4)) : 0;
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: true }); return; }
    ctx.save(); ctx.translate(shake, 0); (() => {
      stageD(900, { pool: [480, 420, 700, GREEN, .2] }); litterD();
      wallWin(L + 24, t, { sway: Math.sin(L * 9) * .03 * free * (1 - seg(L, sl, sl + 1.5)) });
      const hx = 520 + jerk * 40, bx = hx + fall * 60, by = 880 + fall * 260;
      const d = devBehind(t, { x: 330, y: 940, h: 640, expr: L < sl ? { ...DX.rage, m: 'grin' } : devEx('rage', L, []), look: [.8, .3], lean: .2 - .1 * free, tilt: .1, cap: true, medal: true, heat: 1.4,
        armR: [lerp(hx + 70, 420, free), lerp(514, 300, free)], armL: [lerp(hx - 80, 260, free), lerp(524, 360, free)], bendR: -.5, bendL: .4 });
      const f = figure({ kind: 'sam', x: bx, y: by, h: 470, noLegs: true, expr: L < sl ? { ...FX.resolve, lid: .15 } : L < th ? 'fear' : { ...FX.horror }, look: L < sl ? [jerk, -.5] : [.3, -.3], tilt: jerk * .25 + fall * .5, lean: fall * .5, glowOn: [GREEN, .45], glowSide: -1,
        armL: L < sl ? [bx - 120, by - 400] : [bx - 150, by - 430], armR: L < sl ? [bx + 110, by - 410] : [bx + 150, by - 440], t });
      // the chair tipping back
      if (L > fb - .2) { const k = fall; at(hx + 150, 900, 1, k * .9, () => chairD(0, 0, 260, -1)); }
      deskD(80, 880, DESK_Y);
      if (L > th && L < th + .4) { const k = seg(L, th, th + .4); for (let i = 0; i < 7; i++) stroke([[hx + 100 + (i - 3) * 50, 900 - k * 30], [hx + 100 + (i - 3) * 70, 880 - k * 70]], 5, rgba(D.white, 1 - k)); }
    })(); ctx.restore();
  }, { lineX: 1500, focus: 'L', dim: .55 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
});
// on the floor he turns his head to the tear, and for the first time the two of him look at each other
shot('eyes', 'hand', null, (L, u, t, c) => {
  const th = c('turnHead'), lu = c('lookUp'), me = c('meet'), turn = eio(seg(L, th, th + .45)), up = eio(seg(L, lu, lu + .35)), back = eio(seg(L, me, me + .9));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: L < lu, look: up > .5 ? [.85, .55] : [.1, .9], expr: up > .5 ? { ...FX.sad, lid: .05, bags: false } : undefined }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .16] }); litterD(7);
    wallWin(L + 28, t);
    devBehind(t, { x: 230, y: 940, h: 640, expr: devEx('sly', L, [1.4]), look: [.9, .5], lean: .1, cap: true, medal: true, heat: .9, armL: [180, 660], armR: [330, 640] });
    deskD(80, 880, DESK_Y);
    at(420, 900, 1, 1.3, () => chairD(0, 0, 240, -1));
    const f = figure({ kind: 'sam', x: 770, y: 905, h: 440, kneel: 1, expr: turn < .5 ? { ...FX.fear, small: false } : L > me ? { ...FX.sad, lid: .05, bi: -.25 } : 'fear', look: [lerp(-.6, .95, turn), lerp(-.5, -.25, turn)], turn: lerp(-.2, .4, turn), tilt: .05, armL: [700, 880], armR: [850, 880], t });
  }, { lineX: lerp(1500, 960, back), focus: L > me ? null : 'L', dim: .45 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  say('it never showed the 300 pages.', 960, 1035, 66, L, c('never'), .8);
});
// his hand across the tear; the right one puts the yellow pencil in it (an insert: the two arms over the tear)
shot('hand', 'slam', null, (L, u, t, c) => {
  const rc = c('reach'), gv = c('give'), tk = c('take'), reach = eo(seg(L, rc - .1, rc + .8)), give = eio(seg(L, gv - .5, gv)), take = eio(seg(L, tk, tk + .5));
  camD(push(u, .04), 960, 560, () => {
    SPLIT(side => { if (side > 0) { stageD(0, { pool: [300, 300, 900, GREEN, .22] }); litterD(5); } else { stageD(0, { pool: [M(300), 300, 900, LAMP, .22] }); for (let i = 0; i < 6; i++) at(M(120 + i * 70), 980 - i * 4, 1, (rnd(i) - .5) * .3, () => pageD(0, 0, 150, 0, { kind: ['monster', 'hero', 'two'][i % 3], q: .9 })); } }, {});
    const lt = [lerp(560, 1000, reach) - take * 30, lerp(900, 600, reach) + take * 10], rt = [lerp(1420, 1080, give), lerp(360, 560, give)];
    const arm = (a, m, b, w) => { taper([a, m, b], w.map(v => v + 14), rgba(D.line)); taper([a, m, b], w, lg(0, b[1] - 80, 0, b[1] + 160, [[0, D.cream], [1, D.creamS]])); };
    arm([-80, 1200], [lerp(300, 560, reach), lerp(1000, 760, reach)], lt, [150, 140, 128]);
    arm([2040, 200], [lerp(1700, 1300, give), lerp(260, 440, give)], rt, [150, 140, 128]);
    additive(() => glow(GREEN, lt[0], lt[1], 160, .2));
    const pt = L < tk ? rt : lt; pencilD(pt[0] + (L < tk ? -70 : 70), pt[1] - 10, 300, L < tk ? 3.0 : .1 - take * .15);
    if (L > tk && L < tk + .3) { const k = seg(L, tk, tk + .3); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(LAMP, 1 - k); ctx.beginPath(); ctx.arc(lt[0], lt[1], 80 + k * 160, 0, TAU); ctx.stroke(); }
  });
});
// he gets up and slams the window face down: the green dies, the devil shrieks, the medal falls off it
shot('slam', 'page1', null, (L, u, t, c) => {
  const ri = c('rise'), sd = c('slamDown'), sh = c('shriek'), mf = c('medalFall'), mc = c('medalClink');
  const rise = eio(seg(L, ri, ri + .5)), fold = clamp(Math.pow(seg(L, sd - .35, sd), 2)), dead = L > sd, fall = seg(L, mf, mc), shake = dead ? Math.sin((L - sd) * 50) * 22 * (1 - seg(L, sd, sd + .5)) : 0;
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .3], expr: { ...FX.smile, lid: .1 } }); return; }
    ctx.save(); ctx.translate(shake, shake * .4); (() => {
      stageD(900, { pool: [480, 420, 700, GREEN, dead ? .03 : .2] }); litterD(7);
      wallWin(L + 34, t, { fold });
      const d = devBehind(t, { x: 230, y: 940, h: 640, expr: L < sh ? devEx('charm', L, []) : { ...DX.rage, h: .9 }, look: [.8, .2], lean: L > sh ? -.15 : .1, tilt: L > sh ? -.15 : .05, cap: true, medal: L < mf, heat: L > sh ? 1.6 : .9,
        armL: L > sh ? [120, 300] : [180, 660], armR: L > sh ? [380, 280] : [330, 640] });
      if (L >= mf) { const mx = lerp(d.sx + 6, 300, fall), my = lerp(d.shY + d.h * .2, 895, fall * fall); medalD(mx, my, d.h * .05, [mx, my - d.h * .1]); if (L > mc) for (let i = 0; i < 3; i++) stroke([[300 + (i - 1) * 30, 870], [300 + (i - 1) * 50, 840]], 4, rgba(GOLD, 1 - seg(L, mc, mc + .3))); }
      // his arms bring the window down
      const f = figure({ kind: 'sam', x: lerp(770, 560, rise), y: lerp(905, 880, rise), h: lerp(440, 470, rise), kneel: rise < .5 ? 1 : 0, noLegs: rise > .5, expr: L < sd ? { ...FX.resolve, lid: .1, bi: .3 } : 'resolve', look: [-.3, -.5], tilt: -.05,
        armL: L < sd + .1 ? [lerp(330, 380, fold), lerp(260, 640, fold)] : [440, 670], armR: L < sd + .1 ? [lerp(790, 740, fold), lerp(250, 640, fold)] : [600, 670], stretch: true, t });
      earPencil(f, 1);
      deskD(80, 880, DESK_Y);
      if (dead) { windowDown(480, .25); for (let i = 0; i < 10; i++) { const k = seg(L, sd, sd + .5), a = rnd(i * 3.3) * Math.PI; disc(480 + Math.cos(a) * (200 + k * 300), DESK_Y - Math.sin(a) * (20 + k * 120), 6 * (1 - k), rgba(GREEN_L, 1 - k)); } }
    })(); ctx.restore(); }, { focus: null });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  if (L >= sd && L < sd + .1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba(D.white, .5 * (1 - seg(L, sd, sd + .1)))); ctx.restore(); }
});
