function FILM(t) {
  ctx.scale(4 / 3, 4 / 3);
  rectf(0, 0, W, H, rgba(D.stage));
  glow(D.red, 1365, 520, 620, .30); glow([255, 214, 160], 330, 600, 330, .13);
  curve(jit([[-20, 694], [480, 694], [960, 694], [1440, 694], [1940, 694]], 1.5, 1), 4, rgba(D.floor), .5);
  // he stands small on the left, looking at it
  figure({ kind: 'sam', x: 300, y: 692, h: 215, expr: 'fear', look: [.8, -.2], t: 0, armL: [262, 600], armR: [338, 600] });
  // it fills the right
  figure({ kind: 'devil', x: 1365, y: 560 - 150 + 790, h: 790, stage: 3, expr: 'grin', look: [-.5, .1], t: 0, noTail: true, noBelly: true, armL: [1145, 1000], armR: [1585, 1000] });
  ctx.fillStyle = lg(0, 700, 0, 1080, [[0, [0, 0, 0], 0], [.4, [0, 0, 0], .75], [1, [0, 0, 0], .9]]); ctx.fillRect(0, 696, W, 400);
  const title = (s, y) => { ctx.save(); ctx.translate(800, y); ctx.rotate(-.012); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 112px ${FONT}`; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(255,40,20,.95)'; ctx.shadowBlur = 44; ctx.strokeStyle = rgba(D.red); ctx.lineWidth = 16; ctx.strokeText(s, 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = rgba(D.white); ctx.fillText(s, 0, 0); ctx.restore(); };
  title('THE DEVIL', 456); title('YOU FEED', 572);
  hw('just one more.', 800, 662, 46, 'devil', { rot: -.012 });
}
