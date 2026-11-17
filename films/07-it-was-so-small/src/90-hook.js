// ---- the hook: the lie, the monster it became, the size it started at (source times 200-204.2) ----
shot('hk1', 'hk2', null, (L, u, t, c) => {
  const gx = 1010, rimY = 760, foam = [[gx - 250, rimY + 6, 44, 0], [gx - 170, rimY - 14, 56, 1.3], [gx - 76, rimY + 2, 50, 2.1], [gx + 20, rimY - 10, 58, .6], [gx + 120, rimY + 6, 48, 2.8], [gx + 210, rimY - 8, 54, 1.9], [gx + 284, rimY + 10, 38, 3.4]], rise = eo(seg(L, 0, .7));
  camD(1.1 + .12 * u, gx, rimY - 150, () => { glow([255, 206, 150], gx, 640, 760, .13); ctx.save(); ctx.globalAlpha = .55 + .45 * rise; macroGlass(t, gx, rimY); foamD(foam.map(([x, y, r, ph]) => [x, y + (1 - rise) * (120 + ph * 30), r * (.5 + .5 * rise), ph]), t * 2); ctx.restore();
    for (let i = 0; i < 16; i++) { const k = (L * (1 + rnd(i)) + rnd(i * 3)) % 1; disc(gx - 270 + rnd(i * 7) * 540, rimY + 380 - k * 360, 3 + rnd(i * 2) * 4, rgba(D.white, .6 * (1 - k))); } });
  say('it was just one drink.', 960, 250, 104, L, c('hkLine'), .5);
});
shot('hk2', 'hk3', 'AGE: 38', (L, u, t, c) => {
  HOOK = true; LEAN38(.6 + L * .55, u, t, n => n === 'cantSee' ? .6 : 0); HOOK = false;
  slam('23 YEARS LATER', 800, 990, 104, L, c('hkLater'), 'say');
});
shot('hk3', 'hk4', 'AGE: 15', (L, u, t, c) => {
  const gx = 1010, rimY = 650, foam = [[gx - 250, rimY + 6, 44, 0], [gx - 170, rimY - 14, 56, 1.3], [gx - 76, rimY + 2, 50, 2.1], [gx + 20, rimY - 10, 58, .6], [gx + 120, rimY + 6, 48, 2.8], [gx + 210, rimY - 8, 54, 1.9], [gx + 284, rimY + 10, 38, 3.4]], e = c('hkEyes');
  camD(1.25 + .25 * eio(u), gx, rimY - 30, () => { glow([255, 206, 150], gx, 560, 700, .13); macroGlass(t, gx, rimY); foamD(foam, t);
    if (L > e) { const k = eo(seg(L, e, e + .16)); additive(() => glow(D.red, gx, rimY - 16, 130 * k, .85)); for (const sd of [-1, 1]) oval(gx + sd * 26, rimY - 22, 13 * k, 19 * k * (1 - blinkAt(L, [e + .55], .08)), rgba(D.hot)); } });
  say('it started this small.', 960, 230, 92, L, c('hkSmall'), .5);
});
