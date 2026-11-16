// ---------- THE LAST PICTURE and its words: the cold line called back, and its answer in her colour ----------
defShot('walkaway', (t, p, L) => {
  if (SHOT.walkawaypic) SHOT.walkawaypic.draw(t, Object.assign({ cam: [[0, 1.5, 960, 800], [1, 1.66, 960, 790]] }, p), L); else fill([255, 190, 120], [240, 140, 90]);
  const a1 = seg(L, .35, .5), hitL = p.hit ?? 2.06;
  if (!OUT.vertical) {
    screen();
    ctx.fillStyle = rg(960, 170, 0, 700, [[0, [40, 14, 6], .34 * a1], [1, [40, 14, 6], 0]]); ctx.fillRect(0, 0, W, H);       // a soft dark bed so the words hold on the bright sky
    macType('GUESS WHO REMEMBERS.', 960, 92, 72, seg(L, .4, 1.3, E.lin), 1, t, [255, 246, 232]);
    if (L >= hitL) { ctx.save(); ctx.shadowColor = 'rgba(30,10,0,.9)'; ctx.shadowBlur = 30; slam('SHE DOES.', 960, 228, 150, PAL.yellow, 1, hitL, L, 14, '800', .5); ctx.restore(); }
  } else {
    ui(); typeBlock([['GUESS WHO REMEMBERS.', seg(L, .4, 1.3, E.lin)]], 620, 62, [255, 246, 232], 1, t, OUT.w / 2, 840);
    if (L >= hitL) slam('SHE DOES.', OUT.w / 2, 800, fitSize('SHE DOES.', 150, 760, 12), PAL.yellow, 1, hitL, L, 12, '800', .5);
  }
}, () => [560, 300, 1360, 1000]);

// ---------- its words, big enough for a phone (the film's own drawing; a Short keeps the engine's) ----------
const engineWords = devilWords;
devilWords = function (t) {
  if (OUT.vertical) return engineWords(t);
  const c = FILM.words.find(v => t >= v.t && t < v.t + v.d + .5);
  if (!c || c.show === false) return;
  const real = !!c.real, a = win(t, c.t, c.t + c.d + .5, .1, .3), L = t - c.t, text = real ? c.text.toUpperCase() : c.text;
  ctx.setTransform(1, 0, 0, 1, SHX, SHY); ctx.textBaseline = 'middle';
  const x = W / 2, y = real ? 930 : 940, size = real ? 108 : 80;
  ctx.fillStyle = rg(x, y, 0, 760, [[0, [4, 0, 2], .62 * a], [1, [4, 0, 2], 0]]);                 // a soft dark bed
  ctx.save(); ctx.translate(x, y); ctx.scale(1, .22); ctx.beginPath(); ctx.arc(0, 0, 760, 0, TAU); ctx.restore(); ctx.fill();
  if (real) {
    font(size, SANS, '800'); ctx.textAlign = 'center';
    const sc = 1 + .25 * (1 - E.out(clamp(L / .15))), jit = L < .35 ? 1 : .18, f = Math.floor(t * 30), j = k => (rnd(f * 5 + k) - .5) * 14 * jit;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = `rgba(0,255,255,${.3 * a})`; ctx.fillText(text, j(1) - 5, j(2));
    ctx.fillStyle = `rgba(255,0,60,${.45 * a})`; ctx.fillText(text, j(3) + 5, j(4));
    ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = `rgba(10,0,2,${.9 * a})`; ctx.strokeText(text, 0, 0);
    ctx.shadowColor = 'rgba(0,0,0,.95)'; ctx.shadowBlur = 24; ctx.fillStyle = rgba([255, 52, 56], a); ctx.fillText(text, 0, 0);
    ctx.restore();
  } else {
    font(size, SERIF, '400', 'italic'); ctx.textAlign = 'left';
    const n = text.length * clamp(L / .5), whole = Math.floor(n), lx = x - ctx.measureText(text).width / 2;
    ctx.save(); ctx.shadowColor = rgba(C.red, .85 * a); ctx.shadowBlur = 26;
    ctx.fillStyle = rgba([255, 222, 228], .97 * a); ctx.fillText(text.slice(0, whole), lx, y);
    if (whole < text.length && n > whole) { ctx.fillStyle = rgba([255, 222, 228], .97 * a * (n - whole)); ctx.fillText(text[whole], lx + ctx.measureText(text.slice(0, whole)).width, y); }
    ctx.restore();
  }
};

// ---------- the code-drawn thumbnail (a stand-in until the ChatGPT one): the bottle, her inside, its grin behind the glass ----------
defShot('thumb', (t, p) => {
  macBg(t, { red: .85, gx: 1380, lx: 1380 });
  const fr = [1, 960, 540]; PUSH = 1; cam(...fr);
  ctx.fillStyle = lg(0, 0, 1100, 0, [[0, [4, 16, 22], .96], [.7, [6, 20, 26], .7], [1, [6, 20, 26], 0]]); ctx.fillRect(0, 0, 1920, 1080);
  placeDevil([1560, 2960, 3.2]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .2 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  bottle(1400, 1120, 4.3, { cork: 1, glass: [215, 255, 248], glowC: PAL.yellow, glowA: .5, hot: .4,
    inner: () => {
      lilyBust(0, -112, 31, 'hurt', { a: 1, turn: 0, glow: .6 });
      for (const sd of [-1, 1]) { stroke([[sd * 22, -62], [sd * 34, -92]], 11, rgba(PAL.yellow)); disc(sd * 35, -98, 8, rgba([9, 10, 14])); for (let f = 0; f < 4; f++) disc(sd * 35 + (f - 1.5) * 4.4, -106, 2.8, rgba([9, 10, 14]));
        ctx.strokeStyle = rgba([255, 255, 255], .7); ctx.lineWidth = 1.4; for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(sd * 35, -98, 8 + i * 6, 0, TAU); ctx.stroke(); } }
    } });
  claw([2060, 930], Math.PI + .5, 2.6, { curl: .3, spread: 1.1, arm: 600, side: -1 });
  screen(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  const word = (txt, x, y, size, fillc, edge, lw) => { font(size, SANS, '900'); ctx.save(); ctx.shadowColor = 'rgba(255,30,30,.9)'; ctx.shadowBlur = 40; ctx.lineWidth = lw; ctx.strokeStyle = rgba(edge); ctx.strokeText(txt, x, y); ctx.restore(); ctx.fillStyle = rgba(fillc); ctx.fillText(txt, x, y); };
  word('THE', 70, 330, 140, [255, 255, 255], [220, 20, 30], 22);
  word('BOTTLE', 60, 600, 236, [255, 255, 255], [220, 20, 30], 30);
  word('IT KEEPS HER', 74, 760, 100, [255, 222, 60], [20, 4, 4], 18);
  finish(t, { bloom: .4, grain: .3 });
});
