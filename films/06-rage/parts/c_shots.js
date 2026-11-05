// ===== RAGE, part C: the film's own shots =====

// ---------- the clocks: the oven's amber LED (the night), the boxing gym's red timer (the mornings) ----------
// p: '7:02 PM' or { label, gym: true }
defShot('led', (t, p, L) => {
  const label = typeof p === 'string' ? p : p.label, gym = typeof p === 'object' && p.gym, [hm, ap] = label.split(' ');
  const col = gym ? [255, 48, 40] : t >= TURN ? [255, 176, 70] : mix([255, 150, 40], [255, 70, 30], heatAt(t));
  fill(gym ? [12, 14, 20] : [10, 6, 5], gym ? [30, 36, 48] : [30, 14, 8]);
  screen();
  if (!gym) {                                   // the oven's black glass panel, a pot's steam drifting over it
    const g = ctx.createLinearGradient(0, 300, 0, 780); g.addColorStop(0, '#120c0b'); g.addColorStop(1, '#070505');
    ctx.fillStyle = g; rrect(160, 300, 1600, 480, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,170,110,.18)'; ctx.lineWidth = 4; rrect(160, 300, 1600, 480, 40); ctx.stroke();
    for (const x of [330, 1590]) { ctx.fillStyle = '#1d1716'; ctx.beginPath(); ctx.arc(x, 540, 70, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,190,140,.25)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(255,200,150,.4)'; ctx.fillRect(x - 4, 476, 8, 40); }
  } else {                                      // the gym's timer box on a brick wall
    ctx.fillStyle = '#2a2f3a'; for (let r = 0; r < 18; r++) for (let c = -1; c < 14; c++) { ctx.fillStyle = (r + c) % 3 ? '#262b35' : '#2c323e'; ctx.fillRect(c * 150 + (r % 2) * 75, r * 64, 144, 58); }
    ctx.fillStyle = '#0b0b0e'; rrect(300, 290, 1320, 500, 30); ctx.fill();
    ctx.strokeStyle = 'rgba(200,210,230,.25)'; ctx.lineWidth = 5; rrect(300, 290, 1320, 500, 30); ctx.stroke();
    font(34, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,60,50,.8)';
    ctx.fillText('R O U N D  1', W / 2, 345);
  }
  additive(() => glow(sprOf(col), W / 2, 545, 760, .22));
  const day = typeof p === 'object' && p.day;
  if (day) spaced(day, W / 2, gym ? 210 : 220, 60, gym ? [230, 236, 246] : [255, 220, 180], inv(0, .25, L), 18, '300');
  const pop = 1 + .06 * (1 - E.out(clamp(L / .2)));
  ctx.save(); ctx.translate(W / 2, 545); ctx.scale(pop, pop); ctx.translate(-W / 2, -545);
  const w = segTime(hm, W / 2 - 70, 545, 300, col, 1);
  font(54, SANS, '800'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(col, .95);
  ctx.shadowColor = rgba(col, .8); ctx.shadowBlur = 20; ctx.fillText(ap || '', W / 2 - 70 + w / 2 + 40, 640); ctx.shadowBlur = 0;
  ctx.restore();
  if (!gym) {                                   // steam drifting across the glass
    additive(() => { for (let i = 0; i < 9; i++) { const k = ((t * .25 + rnd(i + 700)) % 1); glow(SPR.grey, 300 + rnd(i + 701) * 1300 + Math.sin(t + i) * 40, 820 - k * 700, 160, .08 * Math.sin(Math.PI * k)); } });
  }
}, () => [520, 170, 1440, 760]);

// ---------- the devil in this film's sets ----------
// d: { at: [x, feetY, s] (its feet on the floor at feetY), o: {...} }; it stands behind him, its red light on the wall
function devilAt(d) { const [x, fy, s] = d.at; placeDevil([x, fy + 200 * s, s]); return devilO(Object.assign({ a: 1, eyes: 1 }, d.o)); }
function drawDevilBehind(t, fr, d) { const o = devilAt(d); if (o.a > 0) drawDevil(t, fr, o); return o; }
function devilFront(t, o) { if (o.a > 0) devilArms(t, o); if (o.eyes > 0) devilEyes(t, o); if (o.a > 0) devilGrin(t, o); }
const redWash = (a) => { screen(); ctx.fillStyle = rgba(C.red, a); ctx.fillRect(-W, -H, 3 * W, 3 * H); };

// ---------- the kitchen ----------
// p: fr, man(t, L) -> pose, ex (his expression, default exprAt), sam(t, L) -> pose, samEx, dev(t, L) -> { at, o },
// shadow (his flat shadow on the wall, before it steps off), flick, dark, shock [t0] (the red ring of his shout)
defShot('kitchen', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t), calm = t >= TURN;
  fill([20, 10, 8]);
  cam(...fr);
  kitchenSet(t, { heat, calm, flick: p.flick, dark: p.dark });
  const rim = calm ? [255, 214, 160] : mix([255, 196, 120], [255, 90, 50], heat), lamp = lampPos(t);
  const S = p.sam ? p.sam(t, L) : null, M = p.man ? p.man(t, L) : null;
  if (M && p.shadow) wallShadow(M, lamp[0], typeof p.shadow === 'function' ? p.shadow(t, L) : p.shadow);
  if (p.chair) {                                 // the stool Sam stands on
    const cx = p.chairX ?? (S ? S.hip[0] : 500);
    ctx.fillStyle = rgba(shade(mix(roomCol(heat, 0, calm), roomCol(heat, 1, calm), .5), .9)); ctx.fillRect(cx - 60, 760, 120, 16);
    ctx.fillRect(cx - 50, 776, 14, FY - 776); ctx.fillRect(cx + 36, 776, 14, FY - 776);
    ctx.fillStyle = 'rgba(255,230,190,.5)'; ctx.fillRect(cx - 60, 760, 120, 3);
  }
  if (S) { wallShadow(S, lamp[0], .55); drawFig(S, typeof p.samEx === 'function' ? p.samEx(t, L) : EXPR[p.samEx || 'smile'], rim, .5, rim, { lx: (lamp[0] - S.head[0]) / 400 }); }
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), rim, .55, rim, { lx: (lamp[0] - M.head[0]) / 400 });
  if (p.pot) potInHands(t, M, p.pot);
  if (p.bag !== undefined) {                     // his work bag: in his hand, then dropped on the counter
    const k = E.io(inv(p.bag - .3, p.bag, t)), bx = lerp(M.hand[0], 700, k), by = lerp(M.hand[1] + 40, 572, k);
    ctx.fillStyle = '#1c1a20'; rrect(bx - 50, by - 34, 100, 66, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,150,.5)'; ctx.lineWidth = 3; rrect(bx - 50, by - 34, 100, 66, 10); ctx.stroke();
    ctx.strokeStyle = '#1c1a20'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(bx - 26, by - 34); ctx.quadraticCurveTo(bx, by - 64, bx + 26, by - 34); ctx.stroke();
  }
  if (p.towel !== undefined) {                   // he throws Sam a towel: it flies in an arc and lands on the spill
    const k = clamp((t - p.towel) / .55), x = lerp(M ? M.hand[0] : 990, 1190, k), y = lerp(M ? M.hand[1] : 560, 690, k) - Math.sin(Math.PI * k) * 160;
    if (t >= p.towel - .4) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 3) * .6); const fl = 1 - .6 * k; ctx.fillStyle = 'rgb(240,240,248)'; ctx.beginPath(); ctx.moveTo(-60, -34 * fl); ctx.quadraticCurveTo(0, -50 * fl, 60, -30 * fl); ctx.lineTo(56, 30 * fl + 6); ctx.quadraticCurveTo(0, 44 * fl + 6, -58, 28 * fl + 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(70,110,220,.85)'; ctx.fillRect(-58, -6, 116, 9); ctx.fillRect(-58, 10, 116, 4); ctx.restore(); }
  }
  if (o) devilFront(t, o);
  if (p.shock !== undefined && M) shockRing(t, p.shock, M.head);
  screen();
  if (o && o.a > .3) { ctx.fillStyle = rgba(C.red, .08 * o.a * (.6 + .4 * Math.sin(t * 5))); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540], M = p.man ? p.man(t, L) : null, S = p.sam ? p.sam(t, L) : null;
  let b = M ? poseBox(M, 40) : [600, 300, 1300, 900];
  if (S) b = unionBox(b, poseBox(S, 30));
  return toScreenBox(fr, b);
});
// the pot: in his hands, then slammed into the sink. how: { at (the slam), from [x, y] }
function potInHands(t, M, how) {
  const k = clamp((t - how.at + .25) / .25), sinkP = [765, 600];
  let x, y, r;
  if (t < how.at) { [x, y] = M.hand; r = -.2 * k; } else { const d = t - how.at; x = sinkP[0]; y = sinkP[1] + Math.min(d, .05) * 120; r = -.35; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(r);
  ctx.fillStyle = '#2a2a30'; rrect(-60, -10, 120, 66, 10); ctx.fill();
  ctx.fillStyle = '#4a4a54'; ctx.fillRect(-66, -14, 132, 10);
  ctx.strokeStyle = 'rgba(255,200,150,.5)'; ctx.lineWidth = 3; rrect(-60, -10, 120, 66, 10); ctx.stroke();
  ctx.fillStyle = '#1a1a1e'; ctx.fillRect(56, -6, 70, 12);
  ctx.restore();
  if (t >= how.at && t < how.at + 1.6) {        // the crash: water and steam burst out of the sink
    const d = t - how.at;
    additive(() => { for (let i = 0; i < 14; i++) glow(SPR.grey, sinkP[0] + (rnd(i + 800) - .5) * 260 * (d + .2), sinkP[1] - 40 - d * 220 * rnd(i + 801), 70 + 60 * d, .28 * (1 - d / 1.6)); });
    ctx.fillStyle = `rgba(200,220,255,${.8 * (1 - d / .6)})`;
    for (let i = 0; i < 18; i++) { const vx = (rnd(i + 810) - .5) * 700, vy = -300 - rnd(i + 811) * 500, dd = Math.min(d, .6); ctx.beginPath(); ctx.arc(sinkP[0] + vx * dd, sinkP[1] - 10 + vy * dd + 1400 * dd * dd, 4 + 3 * rnd(i), 0, 7); ctx.fill(); }
  }
}
// the red ring of a shout, out of his mouth
function shockRing(t, t0, head) {
  const d = t - t0;
  if (d < 0 || d > .9) return;
  const [x, y, r] = head;
  for (let i = 0; i < 3; i++) {
    const dd = d - i * .12; if (dd < 0) continue;
    ctx.strokeStyle = rgba([255, 70, 40], .75 * (1 - dd / .75)); ctx.lineWidth = 10 * (1 - dd / .75) + 2;
    ctx.beginPath(); ctx.arc(x + 40, y + 12, r * .6 + dd * 900, -.9, .9); ctx.stroke();
  }
}
