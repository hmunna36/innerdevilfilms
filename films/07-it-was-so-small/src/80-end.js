// ---- 93.3-102.1 the new drawing ----
shot('newDraw', 'samFace', 'DAY: 90', (L, u, t, c) => {
  const inK = eback(seg(L, 0, .45));
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [960, 520, 900, [255, 226, 180], .2] });
    const py = lerp(900, 0, inK);
    figure({ kind: 'lily', x: 960, y: 760 + py, h: 720, expr: samEx('smile', L, [1.3, 2.3]), look: [.2, -.5], noLegs: true, noArms: true, t });
    drawingD(960, 600 + py, 440, .025 + Math.sin(L * 1.6) * .012, false);
    for (const sd of [-1, 1]) { const x = 960 + sd * 440, y = 780 + py; taper([[x + sd * 30, y + 320], [x + sd * 10, y + 120], [x - sd * 16, y]], [120, 112, 104], rgba(D.line)); taper([[x + sd * 30, y + 320], [x + sd * 10, y + 120], [x - sd * 16, y + 2]], [104, 96, 88], rgba(D.cream)); }
  });
});
shot('samFace', 'kneel', 'DAY: 90', (L, u, t, c) => {
  camD(push(u, .07), 960, 540, () => {
    stageD(0, { pool: [900, 500, 800, [255, 226, 180], .2] });
    const ex = L < .55 ? { eh: 1.15, lid: 0, bi: -.16, bo: .02, m: 'part' } : L < 1.2 ? { ...FX.sad, lid: .1, m: 'wob' } : { ...FX.smile, bi: -.2, bo: .06, lid: .12 };
    const f = figure({ kind: 'sam', x: 900, y: 2060, h: 1900, expr: ex, look: [-.3, .5], tilt: L > 1.2 ? .05 : 0, noLegs: true, noArms: true, glowOn: [[255, 220, 170], .12], glowSide: -1, t });
    if (L > .6) { const k = seg(L, .6, 1.3), run = seg(L, 1.2, 2.2); for (const sd of [-1, 1]) { const x = f.head[0] + sd * f.hr * .36 - sd * 6, y = f.head[1] + f.hr * .18 + run * f.hr * .5 * (sd > 0 ? 1 : .6); blob([[x, y], [x + 22 * k, y + 40 * k], [x, y + 70 * k], [x - 22 * k, y + 40 * k]], rgba([150, 200, 240], .92), .5); disc(x - 5, y + 44 * k, 5 * k, 'rgba(255,255,255,.8)'); } }
  });
});
shot('kneel', 'night', null, (L, u, t, c) => {
  const ri = c('runIn'), hg = c('hug'), kn = eio(seg(L, 0, .35)), run = eio(seg(L, ri - .1, hg)), hugged = L >= hg, hk = eo(seg(L, hg, hg + .35)), warm = eo(seg(L, hg, hg + 1.6));
  camD(lerp(1, 1.14, eio(u)), 960, 600, () => {
    stageD(900, { pool: [960, 560, 760 + 240 * warm, [255, 224, 170], .16 + .16 * warm] });
    at(520, 898, 80, -.2, () => { outlined(() => { ctx.beginPath(); ctx.rect(-1, -.1, 2, .2); }, rgba([238, 234, 222]), .03); });
    const lx = lerp(430, 962, run), sx = 1090;
    const sam = () => figure({ kind: 'sam', x: sx, y: 900, h: 450, kneel: kn > .5 ? -1 : 0, drop: kn > .5 ? undefined : kn * .2, lean: hugged ? -.14 * hk : 0, tilt: hugged ? -.16 * hk : 0, expr: hugged ? { ...FX.laugh, m: 'smile' } : { ...FX.smile, bi: -.2, lid: .1 }, look: [-.9, .2], turn: -.4,
      armL: hugged ? [lerp(sx - 120, lx - 70, hk), 760] : [sx - 150, 700 - 30 * kn], armR: hugged ? [lerp(sx + 40, lx + 20, hk), 800] : [sx + 110, 720], bendL: .5, bendR: .6, stretch: true, t });
    const lily = () => figure({ kind: 'lily', x: lx, y: 900 - (run > 0 && run < 1 ? Math.abs(Math.sin(L * 15)) * 14 : 0), h: 290, lean: hugged ? .1 * hk : run > 0 && run < 1 ? .14 : 0, tilt: hugged ? .16 * hk : 0, expr: hugged ? { ...FX.laugh, m: 'smile' } : run > 0 ? 'laugh' : 'smile', look: [.9, -.3], turn: .4,
      armL: run > 0 ? [lx + (hugged ? 70 : 56), hugged ? 730 : 736] : undefined, armR: run > 0 ? [lx + 96, hugged ? 720 : 716] : undefined, bendL: -.3, bendR: -.3, stride: run > 0 && run < 1 ? Math.sin(L * 15) : 0, stretch: true, t });
    if (hugged) { lily(); sam(); } else { sam(); lily(); }
    if (hugged) for (let i = 0; i < 7; i++) { const k = (seg(L, hg, hg + 2.4) * 1.3 + i * .13) % 1, a = -Math.PI * (i + .5) / 7; disc(1030 + Math.cos(a) * (150 + k * 260), 640 + Math.sin(a) * (150 + k * 220), 7 * (1 - k), rgba(D.yellow, .8 * (1 - k))); }
  });
});
// ---- 102.1-110.5 the last picture ----
shot('night', 'black', null, (L, u, t, c) => {
  const eo_ = c('eyesOpen'), fg = c('fog'), ds = c('drawSmile'), taps = [c('tap1'), c('tap2')], wake = eo(seg(L, eo_ - .1, eo_ + .5)), fog = eo(seg(L, fg, fg + .7)), sm = seg(L, ds, ds + .8), tap = blinkAt(L, taps, .07);
  const sh = taps.reduce((a, p) => a + (L >= p ? Math.sin((L - p) * 60) * 5 * (1 - seg(L, p, p + .18)) : 0), 0);
  camD(lerp(1.2, 1.4, eio(u)), 960, 560, () => {
    rectf(-400, -400, W + 800, H + 800, rgba([7, 8, 14])); glow([120, 140, 220], 200, 120, 900, .16);
    outlined(() => { ctx.beginPath(); ctx.rect(-200, 800, W + 400, 34); }, rgba(mix(D.wood, [20, 24, 50], .5)), 6);
    const bx = 960 + sh, by = 800, s = 600;
    const dv = () => { ctx.save(); ctx.globalAlpha = .25 + .75 * wake; const y = by - 8;
      figure({ kind: 'devil', x: bx, y, h: 300, stage: 0, expr: L < eo_ ? { ...DX.sweet, h: .04 } : sm > 0 && sm < 1 ? { ...devEx('sweet', L, []), m: 'cat' } : devEx(L > ds + .8 ? 'charm' : 'sweet', L, [eo_ + .9, fg + .1]), look: sm > 0 && sm < 1 ? [.6, -.3] : [0, .1], tilt: Math.sin(L * 1.3) * .04,
        armR: sm > 0 && sm < 1 ? [bx + 60 + sm * 60, y - 250 + Math.sin(sm * Math.PI) * 36] : tap > .05 ? [bx + 92, y - 170] : undefined, bendR: -.3, tail: [-.4 + .04 * Math.sin(t * 2), -.3], heat: .35 + .5 * wake, noBelly: wake < .3, stretch: true, t }); ctx.restore(); };
    bottleD(bx, by, s, { alpha: .14, col: [120, 150, 190], cork: true, lineCol: [130, 170, 210], inside: dv });
    // its breath on the glass, and the smile it draws there
    if (fog > 0) { const fx = bx + 46, fy = by - 262; ctx.save(); ctx.beginPath(); const w = s * .17; ctx.rect(bx - w, by - s * .6, w * 2, s * .6); ctx.clip();
      blurred(14, () => oval(fx, fy, 86 * fog, 74 * fog, rgba([210, 220, 240], .5)));
      if (sm > 0) { const pts = Array.from({ length: 12 }, (_, i) => { const k = i / 11 * sm; return [fx - 44 + k * 88, fy + 4 + Math.sin(k * Math.PI) * 30]; }); curve(pts, 11, rgba([14, 16, 26], .95), .5); if (sm > .98) for (const sd of [-1, 1]) disc(fx + sd * 24, fy - 26, 7, rgba([14, 16, 26], .95)); } ctx.restore(); }
    for (const p of taps) { const k = L - p; if (k > 0 && k < .3) { ctx.lineWidth = 5 * (1 - k / .3); ctx.strokeStyle = rgba(D.white, 1 - k / .3); ctx.beginPath(); ctx.arc(bx + 100, by - 180, 16 + k * 150, -.9, .9); ctx.stroke(); } }
  });
  red('i can wait.', 960, 1004, 64, L, c('wait'), .7);
});
shot('black', 'END', null, (L, u, t, c) => {
  say('So starve it.', 960, 440, 104, L, c('starve'), .55);
  if (L >= c('everyDay')) hw('Every day.', 960, 580, 104, 'say', L > c('everyDay') + .45 ? { under: true } : { reveal: seg(L, c('everyDay'), c('everyDay') + .45) });
  if (L >= c('title')) over(() => { ctx.save(); ctx.globalAlpha = eo(seg(L, c('title'), c('title') + .5)); _hw('THE BOTTLE', 960, 800, 46, 'say', { rot: 0 }); _hw('it was so small', 960, 856, 34, 'devil', { rot: 0, weight: 400 }); ctx.restore(); });
});
