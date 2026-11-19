// ---- 19-36.5 THE SPLIT and ROUND 2: one boy tears into two; the left one feeds it, the right one turns the window face down ----
const BOOK = [120, 70, 60];
// the window standing on the desk in front of him, its back to us (light on his face); k: how lit
function winBack(x, w, k = 1, fold = 0) { const h = w * .75 * (1 - fold * .96); if (fold >= 1) return; windowD(x, DESK_Y - 4 - h / 2, w, h, 1, null, { back: true, glow: k * (1 - fold * .5) }); }
// one boy at the desk with the window lit in front of him (the picture the tear rips through: both halves at the middle)
function SPLITONE(half) { for (const side of [1, -1]) { ctx.save(); ctx.beginPath(); ctx.rect(side > 0 ? 0 : 960, 0, 960, H); ctx.clip(); ctx.translate(side * HALF, 0); SIDE = side; half(side); SIDE = 1; ctx.restore(); } }
shot('split', 'medal', null, (L, u, t, c) => {
  const pr = c('prop'), dk = c('dark'), te = c('tear'), tEnd = c('tearEnd'), sl = c('slide'), sEnd = c('slideEnd'), ln = c('lean'), gr = c('grinL'), dn = c('down'), cl = c('clack');
  const propK = eio(seg(L, 0, pr)), gone = eio(seg(L, pr + .1, dk)), tear = seg(L, te, tEnd), slide = eio(seg(L, sl, sEnd)), lean = eio(seg(L, ln, ln + .5)), grin = eo(seg(L, gr - .1, gr + .5)), down = eio(seg(L, dn, cl));
  const half = side => { const left = side > 0, lk = left ? lean : 0, dk_ = left ? 0 : down;
    deskHalf(t, { lamp: .45, pinned: 2, q: .5, green: true, glowK: 1 - .7 * dk_,
      boy: { y: 860, expr: left ? (lk > .3 ? 'tempted' : samEx('tempted', L, [.8])) : dk_ > .5 ? { ...FX.resolve, lid: .1 } : samEx('tempted', L, [.8]), look: [0, .5 - .3 * lk], lean: .1 * lk, headDy: .1 * lk, glowOn: [GREEN, .4 * (1 - .75 * dk_)], glowSide: 0,
        armR: !left && L > dn - .25 ? [lerp(560, 520, dk_), lerp(560, 650, dk_)] : undefined, armL: !left && L > dn - .25 ? [lerp(420, 440, dk_), lerp(560, 650, dk_)] : undefined },
      before: f => { if (left && (L < dk || grin > 0)) { const a = L < dk ? 1 - gone : grin; alpha(a, () => devBehind(t, { x: L < dk ? 300 : 300, y: 940, h: 560, expr: L < dk ? devEx('charm', L, [.6]) : devEx('grin', L, []), look: [.8, .3], lean: .1, heat: .9 * a,
          armR: L < dk ? [lerp(470, 380, gone), lerp(560, 640, gone)] : [360, 640], armL: [250, 660], cap: true })); }
        if (left && L >= dk && grin <= 0) for (const sd of [-1, 1]) oval(M(300 + sd * 26), 420, 9, 13 * (1 - blinkAt(L, [dk + .6], .1)), rgba(D.hot, .8 * seg(L, dk, dk + .3))); },
      after: f => { if (L < cl || left) winBack(M(480), 190, 1, left ? 0 : dk_); else windowDown(M(480), 1); } });
  };
  if (L < te) { camD(push(u, .03), 960, 540, () => SPLITONE(half)); return; }
  SPLIT(side => half(side), { tear, slide, one: () => SPLITONE(half), focus: L > ln - .1 && L < dn - .2 ? 'L' : L >= dn - .2 ? 'R' : null, dim: .45 });
  if (L > sEnd) { counterL('PAGES: 29'); counterR('PAGES: 29'); }
});
// ---- ROUND 2: the left half (its window a poster now; the sketchbook torn, the pencil eaten, the medal taken) ----
function round2L(L, t, c, o = {}) {
  const w2 = c('win2'), rp = c('rip'), m2 = c('munch2'), pl = c('pluck'), cr = c('crunch'), mt = c('medalTake'), mo = c('medalOn'), lo = c('lampOff');
  const rip = eo(seg(L, rp - .15, rp + .25)), up = eio(seg(L, rp - 1, rp - .2)), eat = seg(L, m2 - .1, m2 + .5), pluck = eio(seg(L, pl - .3, pl)), toMouth = eio(seg(L, pl + .05, cr)), take = eio(seg(L, mt - .3, mt)), put = eio(seg(L, mt, mo)), lamp = 1 - eo(seg(L, lo, lo + .15));
  const ww = 260, wh = 196, wx = 250, wy = 590;
  deskHalf(t, { lamp: .45 * lamp, pinned: L > rp ? 0 : 2, green: true, glowK: 1.2, pencil: L < pl - .05, pile: 0,
    boy: { expr: L < w2 + .4 ? { ...FX.sad, lid: .1 } : L < rp - .2 ? 'tempted' : L < rp + .5 ? { ...FX.strain, sweat: false } : L < pl - .3 ? 'sad' : L < cr + .3 ? 'fear' : { ...FX.sad, lid: .35, bags: true },
      look: L < rp - 1 ? [-.8, -.2] : L < rp + .5 ? [0, .3] : L < pl ? [-.6, -.1] : [-.3, .3], turn: L < rp - 1 ? -.25 : 0,
      armL: up > 0 && L < m2 ? [lerp(430, 380 - rip * 60, up), lerp(680, 560, up)] : undefined, armR: up > 0 && L < m2 ? [lerp(530, 580 + rip * 60, up), lerp(680, 560, up)] : undefined, glowOn: [GREEN, .42], glowSide: -1 },
    before: f => { D_ = devBehind(t, { x: 210, y: 900, h: 600, expr: L < w2 + .2 ? devEx('charm', L, []) : L < rp ? devEx('sweet', L, [w2 + 1.4]) : L < m2 + .6 ? { ...DX.happy, m: 'open', h: .6 } : L < mt - .3 ? devEx('grin', L, []) : devEx('charm', L, [mo + .4]),
        look: L < rp ? [.6, -.2] : [.8, .3], lean: .18, tilt: .08,
        armR: L > pl - .5 && L < cr + .1 ? [lerp(lerp(450, f.head[0] + f.hr * .7, pluck), 300, toMouth), lerp(lerp(500, f.head[1] - f.hr * .5, pluck), 400, toMouth)] : L > m2 - .5 && L < m2 + .5 ? [lerp(560, 330, eat), lerp(520, 420, eat)] : L > mt - .5 && L < mo + .2 ? [lerp(lerp(380, wx + 40, take), 260, put), lerp(lerp(520, wy, take), 520, put)] : [450, 560],
        armL: [170, 640], cap: true, medal: L >= mo, heat: .9 + (L > m2 && L < m2 + .6 ? 1 : 0) + (L > cr && L < cr + .5 ? 1 : 0) }); },
    after: f => {
      windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.medal(x0, y0, w, h, L, t), { glow: 1.2 });
      if (L > w2 - .3 && L < w2 + .2) { const k = seg(L, w2 - .3, w2 + .2); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); }
      // the sketchbook: lifted, torn in two, eaten
      if (up > 0 && L < m2 + .2) { const bx = 480, by = lerp(DESK_Y, 662, up); bookD(bx, by, 150, { tear: rip, col: BOOK, label: 1 }); }
      else if (L < rp - 1) bookD(480, DESK_Y, 150, { col: BOOK, label: 1 });
      if (L >= m2 + .2 && L < m2 + .9) { const k = seg(L, m2 + .2, m2 + .9); for (let i = 0; i < 8; i++) { const a = rnd(i * 3.1) * TAU; disc(D_.head[0] + Math.cos(a) * (60 + k * 90), D_.head[1] + D_.hr * .4 + Math.sin(a) * (40 + k * 50), 8 * (1 - k), rgba(PAPER, 1 - k)); } }
      // the pencil plucked from behind his ear and crunched
      if (L > pl - .05 && L < cr) { const px = lerp(f.head[0] + f.hr * .78, D_.head[0], toMouth), py = lerp(f.head[1] - f.hr * .5, D_.head[1] + D_.hr * .4, toMouth); pencilD(px, py, f.hr * 1.5, lerp(.4, 1.4, toMouth)); }
      if (L >= cr && L < cr + .5) { const k = seg(L, cr, cr + .5); for (let i = 0; i < 7; i++) { const a = rnd(i * 5.1) * TAU; rectf(D_.head[0] + Math.cos(a) * (50 + k * 100), D_.head[1] + D_.hr * .4 + Math.sin(a) * (40 + k * 60), 10 * (1 - k), 6 * (1 - k), rgba(i % 2 ? PENCIL : [228, 196, 150], 1 - k)); } }
      // the medal taken out of the window
      if (L > mt - .05 && L < mo) medalD(lerp(wx + 40, D_.sx, put), lerp(wy, D_.shY + D_.h * .2, put), lerp(14, D_.h * .05, put));
      if (L > lo - .1 && L < lo + .2) { const k = seg(L, lo - .1, lo + .2); disc(M(120), DESK_Y - 200, 26 * (1 - k), rgba([255, 240, 200], 1 - k)); }
    } });
}
// ---- ROUND 2: the right half (he draws, rubs it out, draws; the letter on the board; a glance at the leak) ----
function round2R(L, t, c, o = {}) {
  const rb = c('rub'), d2 = c('draw2'), pn = c('pin'), gl = c('glance'), bk = c('back');
  const pin = eio(seg(L, pn - .5, pn)), glance = L > gl && L < bk, drawing = L < pn - .6 || L > bk;
  const wob = drawing ? Math.sin(t * 16) * 22 : 0, rub = L > rb && L < d2 ? Math.sin(t * 30) * 28 : 0;
  deskHalf(t, { lamp: 1, pinned: o.pinned ?? 9, q: .75, letter: L > pn, green: false, pile: o.pile ?? 60,
    boy: { expr: glance ? { ...FX.tempted, lid: .2 } : L > bk ? { ...FX.resolve, lid: .25 } : { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: glance ? [-.4, .8] : L > pn - .6 && L < pn + .2 ? [-.6, -.8] : [.1, .9],
      armR: L > pn - .6 && L < pn + .3 ? [lerp(560, 640, pin), lerp(660, 300, pin)] : [500 + wob + rub, 668], armL: [430, 676], glowOn: [LAMP, .2], glowSide: 1 },
    before: f => { if (L > pn - .6 && L < pn) { const k = pin; at(lerp(560, 640, k), lerp(640, 300, k), 1, 0, () => pageD(0, 0, 90, .08, { kind: 'scrawl', col: [244, 244, 236] })); } },
    after: f => { deskPage(480); if (!(L > pn - .6 && L < pn + .3)) pencilD(500 + wob + rub, 660, 70, rub ? -2.4 : -.6);
      windowDown(M(250), .8 + .2 * Math.sin(t * 2)); if (rub) for (let i = 0; i < 4; i++) disc(500 + rub + rnd(i + Math.floor(t * 12)) * 40 - 20, DESK_Y - 14 - rnd(i * 2) * 10, 3, rgba([236, 130, 140], .8)); } });
}
shot('medal', 'work', null, (L, u, t, c) => { const Dw = CUE.card - CUE.work;
  SPLIT(side => side > 0 ? round2L(L, t, c) : round2R(L * Dw / (CUE.work - CUE.medal), t, n => CUE[n] - CUE.work), { focus: 'L', dim: .55 });
  counterL(L >= c('rip') ? 'PAGES: 0' : 'PAGES: 29'); counterR('PAGES: ' + Math.round(lerp(29, 80, u)));
  red('and he’s only fourteen.', 470, 960, 70, L, c('fourteen'), 1.0);
});
shot('work', 'card', null, (L, u, t, c) => { const Dm = CUE.work - CUE.medal;
  SPLIT(side => side > 0 ? round2L(L * Dm / (CUE.card - CUE.work), t, n => CUE[n] - CUE.medal) : round2R(L, t, c), { focus: 'R', dim: .55 });
  counterL(L * Dm / (CUE.card - CUE.work) >= CUE.rip - CUE.medal ? 'PAGES: 0' : 'PAGES: 29'); counterR('PAGES: ' + Math.round(lerp(80, 120, eo(u))));
});
