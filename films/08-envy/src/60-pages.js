// ---- 71-96 ONE PAGE A DAY: the left one climbs (1, 40, 120, 300); the slip at 40; Max's door; the tear stitches shut ----
// his board as it fills again: page 1 (wobbly, top left) and the ones after it, better each time (n pinned)
function boardAgain(n, o = {}) { const x = 260, y = 140, w = 440, h = 280; outlined(() => { ctx.beginPath(); ctx.rect(M(x) - (SIDE < 0 ? w : 0), y, w, h); }, rgba([120, 92, 66]), 5);
  const cols = 4, rows = 3, cw = w / cols, chh = h / rows;
  for (let i = 0; i < Math.min(n, 12); i++) { const cx = M(x + cw * (i % cols + .5) + (rnd(i * 2.1) - .5) * cw * .2), cy = y + chh * (Math.floor(i / cols) + .5) + (rnd(i * 3.3) - .5) * chh * .15;
    at(cx, cy, chh * .62, (rnd(i * 5.7) - .5) * .25, () => { outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.66, 1, 1.32); }, rgba(PAPER), .015); monsterD(0, .02, .6 + .2 * (i / 11), { rot: i === 0 ? .25 : 0, col: i === 0 ? [90, 90, 100] : [40, 40, 48] }); if (i === 0) for (let k = 0; k < 3; k++) curve([[-.3 + k * .05, -.4], [.2, -.1 + k * .1], [-.2, .3]], .02, rgba([60, 60, 70], .6)); });
    disc(cx, cy - chh * .38, 5, rgba([220, 60, 50])); } }
// the left desk after the turn: his lamp back on, his pencil, the devil (its cap still on) beside him with a small window
function leftAgain(t, L, o = {}) { const wob = o.drawing ? Math.sin(t * 16) * 22 : 0;
  return deskHalf(t, { lamp: o.lamp ?? 1, pinned: 0, green: false, glowK: 0, pencil: !o.drawing,
    back: () => boardAgain(o.n ?? 1),
    boy: { expr: o.expr || { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: o.look || [.1, .9], armL: o.armL || [430, 676], armR: o.armR || [500 + wob, 668], glowOn: o.green ? [GREEN, o.green] : [LAMP, .2], glowSide: o.green ? -1 : 1, ...(o.boy || {}) },
    before: f => { if (o.dev) o.dev(f); },
    after: f => { deskPage(480); if (o.drawing) pencilD(500 + wob, 660, 70, -.6); if (o.after) o.after(f); } }); }
shot('page1', 'page40', null, (L, u, t, c) => {
  const w3 = c('win3'), dn = c('down2'), lampOn = eo(seg(L, 0, .3)), open = eo(seg(L, w3 - .2, w3 + .3)), down = eio(seg(L, dn - .2, dn + .1));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 1, lamp: lampOn, drawing: L < w3 - .3 || L > dn + .3, look: L > w3 && L < dn ? [-.7, -.2] : [.1, .9], expr: L > w3 && L < dn ? { ...FX.sad, lid: .05 } : L > dn ? { ...FX.resolve, lid: .2 } : undefined, green: L > w3 && L < dn + .1 ? .3 : 0,
      armR: L > dn - .5 && L < dn + .3 ? [lerp(500, 400, eio(seg(L, dn - .5, dn - .2))), lerp(668, 540 + 120 * down, eio(seg(L, dn - .5, dn - .2)))] : undefined,
      dev: f => devBehind(t, { x: 150, y: 920, h: 600, expr: L < w3 ? devEx('sly', L, [.6]) : L < dn ? devEx('sweet', L, [w3 + 1.2]) : { ...DX.sulk }, look: [.8, .3], lean: .12, cap: true, armR: [lerp(260, 300, open), lerp(640, 520, open)], armL: [110, 650] }),
      after: f => { if (L > w3 - .25 && L < dn + .1) windowD(345, lerp(600, 500, open) + down * 170, 150 * (1 - down * .2), 112 * (1 - down * .95), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t)); else if (L >= dn + .1) windowDown(330, .7); } });
  }, { focus: 'L', dim: .5 });
  counterL('PAGES: 1'); counterR('PAGES: 300');
  if (L < c('win3')) say('one page a day.', 960, 990, 72, L, c('onePage'), .6);
  red('they’re years ahead.', 960, 990, 70, L, c('years'), .9);
});
// PAGE 40, the slip: the window jumps back to a poster, its arms go round him, his counter sticks at 40
shot('page40', 'board40', null, (L, u, t, c) => {
  const ol = c('oneLook'), lk = c('looks'), jp = c('jump'), ar = c('arms'), look = eio(seg(L, lk - .2, lk + .2)), jump = eback(seg(L, jp, jp + .35)), arms = eio(seg(L, ar - .2, ar + .4)), stuck = L > c('stuck');
  const ww = lerp(160, 330, jump), wh = ww * .75, wx = lerp(300, 220, jump), wy = lerp(470, 480, jump);
  function open40(L) { return eio(seg(L, ol - .6, ol)) * (1 - jump); }
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: L > jp ? { ...FX.sad, lid: .1 } : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 6, lamp: lerp(1, .35, jump), drawing: L < lk - .3, look: L > lk - .3 ? [-.8, -.2] : [.1, .9], expr: L < lk ? undefined : stuck ? { ...FX.tempted, lid: .5, bags: true } : 'tempted', green: L > ol ? .3 + .2 * jump : 0,
      dev: f => devBehind(t, { x: lerp(800, 740, arms), y: 920, h: 600, expr: L < jp ? devEx('sweet', L, [ol + 1.2]) : devEx('grin', L, [ar + 1.0]), look: [-.8, .3], lean: -.06 - .06 * arms, tilt: -.06 * arms, cap: true, capBrim: -1,
        armL: arms > 0 ? [lerp(640, f.shL[0] - 10, arms), lerp(560, f.shL[1] + 40, arms)] : [lerp(640, 330, open40(L)), lerp(560, 480, open40(L))], armR: arms > 0 ? [lerp(860, f.shR[0] + 10, arms), lerp(650, f.shY + 60, arms)] : [860, 650], heat: .8 + .6 * jump }),
      after: f => { windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t), { glow: 1 + jump }); if (L > jp && L < jp + .4) { const k = seg(L, jp, jp + .4); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); } } });
  }, { focus: 'L', dim: .5 });
  counterL('PAGES: 40'); counterR('PAGES: 300');
  if (L < jp + .3) red('just one look.', 960, 990, 72, L, ol, .8);
});
// his own board, close: page 1 next to page 40
shot('board40', 'down40', null, (L, u, t, c) => {
  camD(lerp(1.0, 1.12, eio(u)), 960, 540, () => {
    rectf(-200, -200, W + 400, H + 400, rgba([120, 92, 66])); for (let i = 0; i < 40; i++) disc(rnd(i * 3.1) * W, rnd(i * 5.7) * H, 3, rgba([90, 68, 50]));
    additive(() => glow(GREEN, -100, 540, 700, .25 + .06 * Math.sin(t * 7)));
    const pg = (x, rot, n, wobbly) => at(x, 560, 300, rot, () => { outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.66, 1, 1.32); }, rgba(PAPER), .012); monsterD(0, .05, wobbly ? .62 : .72, { rot: wobbly ? .3 : 0, col: wobbly ? [100, 100, 110] : [40, 40, 48] });
      if (wobbly) for (let k = 0; k < 4; k++) curve([[-.34 + k * .04, -.42], [.24, -.12 + k * .08], [-.24, .32]], .012, rgba([60, 60, 70], .55)); ink(String(n), .36, -.52, .14, [60, 60, 70]); });
    pg(640, -.06, 1, true); pg(1280, .05, 40, false); for (const x of [640, 1280]) { disc(x, 360, 12, rgba([220, 60, 50])); disc(x - 3, 357, 4, 'rgba(255,255,255,.6)'); }
  });
});
shot('down40', 'door', null, (L, u, t, c) => {
  const d3 = c('down3'), down = eio(seg(L, d3 - .3, d3 + .05)), off = eo(seg(L, d3, d3 + .5));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: L > d3 ? { ...FX.smile } : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 6, lamp: lerp(.35, 1, off), drawing: L > d3 + .4, look: L < d3 - .3 ? [-.7, -.2] : [.1, .9], expr: L < d3 ? { ...FX.resolve, lid: .1 } : { ...FX.resolve, lid: .25 }, green: .4 * (1 - off),
      armL: L > d3 - .5 && L < d3 + .4 ? [lerp(430, 300, eio(seg(L, d3 - .5, d3 - .25))), lerp(676, 470 + 200 * down, eio(seg(L, d3 - .5, d3 - .25)))] : undefined,
      dev: f => devBehind(t, { x: lerp(740, 800, off), y: 920, h: 600, expr: L < d3 ? devEx('grin', L, []) : { ...DX.sulk }, look: [-.8, .3], lean: -.12 + .06 * off, cap: true, capBrim: -1,
        armL: [lerp(f.shL[0] - 10, 660, off), lerp(f.shL[1] + 40, 640, off)], armR: [lerp(f.shR[0] + 10, 880, off), lerp(f.shY + 60, 650, off)], heat: .8 }),
      after: f => { if (L < d3) windowD(220, 480 + down * 200, 330, 248 * (1 - down * .95), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L + 5, t), { glow: 2 - down }); else windowDown(230, .6); } });
  }, { focus: 'L', dim: .5 });
  counterL(L >= c('count41') ? 'PAGES: 41' : 'PAGES: 40'); counterR('PAGES: 300');
});
// PAGE 120: Max's front door. He holds out a comic of the two of them; Max reads it, laughs, hugs him; the cap falls off the devil
shot('door', 'stitch', null, (L, u, t, c) => {
  counterL('PAGES: 120');
  const kn = c('knock'), op = c('open'), ho = c('hold'), rd = c('read'), la = c('laughM'), hg = c('hug2'), cf = c('capFall');
  const open = eio(seg(L, op, op + .5)), hold = eio(seg(L, ho - .3, ho + .2)), hug = eio(seg(L, hg - .3, hg + .2)), capK = seg(L, cf, cf + .6);
  camD(push(u, .05), 1000, 560, () => {
    stageD(900, { pool: [1150, 380, 640, LAMP, .2] });
    doorD(1250, 900, open, 1);
    const mx = lerp(1250, lerp(1180, 1090, hug), open), tx = lerp(860, 960, hug);
    if (open > .3) { const m = figure({ kind: 'sam', x: mx, y: 900, h: 420, expr: L < rd ? 'calm' : L < la ? { ...FX.calm, lid: .2 } : 'laugh', look: L < rd ? [-.9, 0] : L < hg ? [-.3, .8] : [-.6, -.1], turn: -.2,
        armL: hug > .1 ? [tx + 40, 650] : L > rd ? [mx - 90, 650] : undefined, armR: hug > .1 ? [tx + 10, 600] : L > rd ? [mx - 40, 660] : undefined, stretch: true, t, seed: 5 }); capOn(m, -1); }
    const th = figure({ kind: 'sam', x: tx, y: 900, h: 420, expr: L < op + .3 ? { ...FX.calm, lid: .2 } : L < la ? { ...FX.tempted, lid: .05, m: 'flat' } : 'laugh', look: [.9, -.1], turn: .25,
      armR: L < kn + .3 ? [1080, 560 + Math.abs(Math.sin((L - kn) * 20)) * 30 * (L > kn ? 1 : 0)] : hold > 0 && L < rd ? [lerp(960, 1080, hold), lerp(700, 640, hold)] : hug > .1 ? [mx + 30, 640] : undefined, armL: hug > .1 ? [mx + 60, 600] : undefined, stretch: true, t });
    earPencil(th, 1);
    // the comic he drew of the two of them: in his hand, then in Max's
    const cx = L < rd ? lerp(920, 1090, hold) : lerp(1120, 1100, hug), cy = L < rd ? lerp(720, 640, hold) : lerp(640, 760, hug);
    if (hug < .9) comicD(cx, cy, 200, 1, 0);
    // the devil on the step, sulking; the cap falls off it
    const dv = figure({ kind: 'devil', x: 470, y: 900, h: 560, stage: 3, expr: L < hg ? devEx('sulk', L, [1.2]) : { ...DX.plead, m: 'pout' }, look: [.9, -.2], tilt: -.08, lean: -.06, armL: [430, 700], armR: [520, 700], tail: [-.34, .05], heat: .5, t });
    if (L < cf) devCap(dv, 1); else { const k = capK, x0 = dv.head[0], y0 = dv.head[1] - dv.hr * 1.15; capAt(lerp(x0, x0 + 280, k), lerp(y0, 880, k * k) - 90 * Math.sin(k * Math.PI), dv.hr * 1.02, k * 2.4, CAP, 1); }
  });
});
// PAGE 300: the counters meet and the tear stitches shut; the two of him slide together into one
shot('stitch', 'last', null, (L, u, t, c) => {
  const cs = c('count300'), cd = c('countDone'), sw = c('sew'), se = c('sewEnd'), on = c('one');
  const n = Math.round(lerp(120, 300, eio(seg(L, cs, cd)))), sew = seg(L, sw, se), merge = eio(seg(L, se, on));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: L < se, look: L < cd ? [.8, .4] : [.1, .7], expr: L > cd ? 'smile' : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 12, lamp: 1, drawing: L < cd, look: L < cd ? [.1, .9] : [.1, .7], expr: L > cd ? 'smile' : undefined });
  }, { stitch: sew, slide: 1 - merge, gap: 12 });
  if (merge > .6) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); additive(() => glow([255, 240, 210], 960, 540, 900, .5 * Math.sin(seg(merge, .6, 1) * Math.PI))); ctx.restore(); }
  if (merge < .2) { counterL('PAGES: ' + n); counterR('PAGES: 300'); }
});
