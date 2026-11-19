// ---- 0-4.6 TOGETHER: two boys on the floor drawing one comic (Max a hero, Theo the monster), a high five ----
// the comic they draw together: two panels on one big sheet (x, y its middle, s its width), done 0..1 (how much is drawn)
function comicD(x, y, s, done = 1, rot = 0) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.34, 1, .68); }, rgba(PAPER), .006);
  ctx.lineWidth = .006; ctx.strokeStyle = rgba(D.line, .6); ctx.strokeRect(-.46, -.3, .44, .6); ctx.strokeRect(.02, -.3, .44, .6);
  const ink = rgba([60, 60, 70]), a = clamp(done * 2), b = clamp(done * 2 - 1);
  if (a > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-.46, -.3, .44 * a, .6); ctx.clip();            // panel 1: Max's hero, a red cape
    ctx.lineWidth = .014; ctx.strokeStyle = ink; ctx.beginPath(); ctx.arc(-.24, -.12, .06, 0, TAU); ctx.stroke(); curve([[-.24, -.06], [-.24, .1]], .014, ink); curve([[-.32, -.02], [-.24, -.04], [-.14, -.16]], .014, ink); curve([[-.3, .22], [-.24, .1], [-.18, .22]], .014, ink);
    blob([[-.25, -.04], [-.36, .06], [-.4, .18], [-.27, .06]], rgba([210, 70, 60], .85), .4); ctx.restore(); }
  if (b > 0) { ctx.save(); ctx.beginPath(); ctx.rect(.02, -.3, .44 * b, .6); ctx.clip();              // panel 2: Theo's monster, round and black, smiling
    blob([[.1, .2], [.08, -.02], [.16, -.16], [.3, -.18], [.4, -.04], [.38, .2]], rgba([40, 40, 48]), .5); for (const sd of [-1, 1]) { disc(.24 + sd * .05, -.04, .022, rgba(PAPER)); } curve([[.18, .06], [.24, .1], [.3, .06]], .012, rgba(PAPER)); ctx.restore(); } }); }
// the monster he draws (big, on its own page), used on the comic's cover in the window and on his boards
function monsterD(x, y, s, o = {}) { at(x, y, s, o.rot || 0, () => { blob([[-.5, .5], [-.55, -.05], [-.3, -.45], [.15, -.5], [.5, -.15], [.48, .5]], rgba(o.col || [40, 40, 48]), .5);
  for (const sd of [-1, 1]) disc(sd * .16, -.08, .07, rgba(PAPER)); curve([[-.2, .16], [0, .26], [.2, .16]], .05, rgba(PAPER)); }); }
shot('floor', 'night', null, (L, u, t, c) => {
  const lk = c('look'), lg_ = c('laugh'), fv = c('five'), up = eo(seg(L, fv - .35, fv)), hit = blinkAt(L, [fv], .1), draw = seg(L, c('drawM'), lk - .1);
  say('they drew everything together.', 960, 120, 66, L, c('capTogether'), .7);
  camD(push(u, .05), 960, 600, () => {
    stageD(860, { pool: [960, 560, 760, LAMP, .2] });
    comicD(960, 850, 420, draw);
    const laugh = L > lg_, bob = laugh ? Math.abs(Math.sin((L - lg_) * 9)) * 8 : 0, wob = Math.sin(L * 22) * 8 * (L < lk ? 1 : 0);
    const mx = 650, tx = 1270, hy = lerp(620, 330, up);
    const m = figure({ kind: 'sam', x: mx, y: 842 - bob, h: 400, sit: 1, flat: true, lean: .14 * (1 - up), expr: laugh ? 'laugh' : L > lk ? 'smile' : { ...FX.calm, lid: .25 }, look: L > lk ? [.9, 0] : [.6, .9], tilt: laugh ? Math.sin(L * 9) * .05 : 0,
      armR: up > .02 ? [lerp(870, 952, up), hy] : [880 + wob, 838], armL: [mx - 70, 760], bendR: .3, stretch: true, t, seed: 4 });
    capOn(m, 1);
    const th = figure({ kind: 'sam', x: tx, y: 842 - bob, h: 400, sit: -1, flat: true, lean: -.14 * (1 - up), expr: laugh ? 'laugh' : L > lk ? 'smile' : { ...FX.calm, lid: .25 }, look: L > lk ? [-.9, 0] : [-.6, .9], tilt: laugh ? -Math.sin(L * 9) * .05 : 0,
      armL: up > .02 ? [lerp(1050, 968, up), hy] : [1060 - wob, 840], armR: [tx + 70, 760], bendL: -.3, stretch: true, t });
    earPencil(th, 1);
    if (up < .02) { pencilD(880 + wob, 832, 70, 2.3); pencilD(1060 - wob, 834, 70, .85); }
    if (L > fv) { const k = seg(L, fv, fv + .35); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42; stroke([[960 + Math.cos(a) * (40 + k * 60), hy - 10 + Math.sin(a) * (40 + k * 60)], [960 + Math.cos(a) * (70 + k * 110), hy - 10 + Math.sin(a) * (70 + k * 110)]], 6, rgba(D.white, 1 - k)); } }
  });
});
