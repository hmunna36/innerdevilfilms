function FILM(t) {
  rectf(0, 0, W, H, rgba(D.stage));
  glow(D.red, 960, 560, 820, .34); glow(D.ember, 960, 640, 420, .16);
  figure({ kind: 'devil', x: 960, y: 600 - 266 + 1400, h: 1400, stage: 3, expr: 'grin', look: [0, .15], t: 0, noTail: true, noBelly: true, noArms: true });
  ctx.fillStyle = rg(960, 540, 380, 800, [[0, [0, 0, 0], 0], [1, [0, 0, 0], .75]]); ctx.fillRect(0, 0, W, H);
}
