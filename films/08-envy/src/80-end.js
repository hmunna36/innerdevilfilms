// ---- 96-106 THE LAST PICTURE: one boy, one desk; the devil, plain, with a window the size of a stamp ----
shot('last', 'title', 'PAGES: 300', (L, u, t, c) => {
  const st = c('stamp'), ah = c('ahead'), sm = c('smile'), gd = c('good'), tp = c('tap'), dk = c('dark2');
  const show = eo(seg(L, st - .2, st + .3)), tap = eio(seg(L, tp - .45, tp)), shut = L >= tp, dark = seg(L, dk, dk + 1.6);
  camD(lerp(1.1, 1.22, eio(u)), 860, 560, () => {
    deskHalf(t, { X: 960, lamp: 1 - dark * .9, pinned: 0, back: () => { SIDE = 1; ctx.save(); ctx.translate(480, 0); boardAgain(12); ctx.restore(); }, pile: 300, pencil: L < tp - .6 || L > tp + .4,
      boy: { expr: L < sm ? { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' } : L < tp - .5 ? samEx('smile', L, [gd + .9]) : 'smile', look: L < ah ? [.1, .9] : L < tp - .5 ? [-.7, .1] : [-.7, .4], turn: L > ah ? -.2 : 0,
        armL: L > tp - .6 && L < tp + .4 ? [lerp(900, 690, tap), lerp(676, 600, tap)] : [900, 676], armR: [1010, 668] },
      after: f => {
        // the devil, plain: no cap, no medal, leaning on the desk with its chin on its arms
        const d = figure({ kind: 'devil', x: 600, y: 940, h: 560, stage: 3, noLegs: true, expr: L < ah ? devEx('sulk', L, [1.0]) : L < tp ? devEx('sweet', L, [ah + 1.4]) : { ...DX.sulk, h: .35 }, look: [.8, -.1], lean: .25, tilt: .18, armL: [560, 680], armR: [690, 640], heat: .45, t });
        const wx = 700, wy = 600; if (!shut) windowD(wx, wy, 70 * show, 52 * show, 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t), { glow: .8 }); else { windowD(wx, wy + 18, 70, 6, 1, null, { back: true, glow: .2 * (1 - seg(L, tp, tp + .4)) }); }
        if (L > tp - .6 && L < tp + .4) pencilD(lerp(900, 712, tap), lerp(660, 585, tap), 80, lerp(-.6, -2.2, tap));
        if (L > tp && L < tp + .3) { const k = seg(L, tp, tp + .3); ctx.lineWidth = 5 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.arc(wx, wy, 20 + k * 90, 0, TAU); ctx.stroke(); }
        deskPage(1000); } });
  });
  red('they’re still ahead.', 520, 260, 62, L, ah, .9);
  say('good for them.', 1560, 470, 78, L, gd, .6);
});
shot('title', 'END', null, (L, u, t, c) => {
  const ti = c('titleIn'), k = eo(seg(L, ti, ti + .5));
  if (L >= ti) over(() => { ctx.save(); ctx.globalAlpha = k; _hw('ENVY', 960, 470, 150, 'say', { rot: 0 }); _hw('it showed him everyone else', 960, 590, 46, 'devil', { rot: 0, weight: 400 }); ctx.restore(); });
});
