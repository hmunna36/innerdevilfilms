let D_ = null;
// ---- 4.6-19 THE WINDOW: one boy at his desk; it opens a little green window and shows him his best friend's best day ----
// what the windows show (each fn(x0, y0, w, h, L, t) draws in the window's box)
const SHOW = {
  max: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); const f = winPerson(t, x0 + w * .38, y0 + h * .97, h * .78, { expr: 'laugh', armR: [x0 + w * .64, y0 + h * .2], seed: 5 }); capOn(f, 1);
    pageD(x0 + w * .66, y0 + h * .26, h * .34, .12, { kind: 'hero', q: 1 }); heartsD(x0 + w * .84, y0 + h * .85, w * .32, L, 7, Math.max(6, w * .045)); },
  medal: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); for (let i = 0; i < 3; i++) glow([255, 236, 170], x0 + w * (.2 + i * .3), y0 + h * .1, w * .2, .3);
    const f = winPerson(t, x0 + w * .5, y0 + h * .97, h * .62, { expr: 'laugh', armL: [x0 + w * .3, y0 + h * .18], armR: [x0 + w * .7, y0 + h * .18], seed: 8 }); medalD(f.sx, f.shY + h * .1, h * .06, [f.sx, f.shY - h * .02]);
    heartsD(x0 + w * .85, y0 + h * .85, w * .3, L, 8, Math.max(6, w * .04)); heartsD(x0 + w * .15, y0 + h * .85, w * .3, L + 3, 6, Math.max(6, w * .035)); },
  crowd: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); for (let i = 0; i < 6; i++) { if (i === 2 || i === 3) continue; figure({ kind: 'sam', x: x0 + w * (.1 + i * .16), y: y0 + h * 1.04, h: h * .55, expr: 'smile', look: [(2.5 - i) * .3, -.2], dim: .35, t, seed: i + 20, lw: .02 }); }
    const f = winPerson(t, x0 + w * .5, y0 + h * .99, h * .66, { expr: 'laugh', armL: [x0 + w * .36, y0 + h * .3], armR: [x0 + w * .64, y0 + h * .28], seed: 5 }); capOn(f, 1);
    heartsD(x0 + w * .5, y0 + h * .7, w * .8, L, 12, Math.max(6, w * .035)); },
  // his own best day: a young man holding up a printed comic with HIS monster on the cover (the pencil behind his ear)
  him: (x0, y0, w, h, L, t, o = {}) => { winStage(x0, y0, w, h); for (let i = 0; i < 7; i++) { if (i === 3) continue; figure({ kind: 'sam', x: x0 + w * (.06 + i * .148), y: y0 + h * 1.06, h: h * .5, expr: 'laugh', look: [(3 - i) * .3, -.3], dim: .4, t, seed: i + 30, lw: .02 }); }
    const f = winPerson(t, x0 + w * .5, y0 + h * 1.04, h * .7, { expr: 'laugh', armL: [x0 + w * .44, y0 + h * .66], armR: [x0 + w * .56, y0 + h * .66], pencil: 1, seed: 2 });
    bookCover(x0 + w * .5, y0 + h * .68, h * .27); heartsD(x0 + w * .5, y0 + h * .75, w * .9, L, 16, Math.max(7, w * .03)); }
};
// a printed comic book seen from the front: its cover is his monster (x, y the middle, s its height)
function bookCover(x, y, s, o = {}) { outlined(() => { ctx.beginPath(); ctx.rect(x - s * .38, y - s * .5, s * .76, s); }, rgba([230, 200, 60]), Math.max(2, s * .02));
  rectf(x - s * .38, y - s * .5, s * .76, s * .16, rgba([200, 50, 40])); monsterD(x, y + s * .12, s * .5); }
// the devil his size behind the boy's chair (one-boy desk, or a half): pose options
function devBehind(t, o) { const d = fig({ kind: 'devil', x: o.x, y: o.y ?? 940, h: o.h ?? 500, stage: 3, expr: o.expr || 'charm', look: o.look || [.6, .1], lean: o.lean || 0, tilt: o.tilt || 0, turn: o.turn, headDx: o.headDx, headDy: o.headDy,
    noLegs: true, armL: o.armL, armR: o.armR, bendL: o.bendL ?? .4, bendR: o.bendR ?? -.4, stretch: true, tail: o.tail || [-.34, -.1 + .04 * Math.sin(t * 3)], heat: o.heat ?? .8, t });
  if (o.cap) devCap(d, SIDE * (o.capBrim ?? 1)); if (o.medal) medalD(d.sx + SIDE * 6, d.shY + d.h * .2, d.h * .05, [d.sx + SIDE * 6, d.shY + d.h * .04]); return d; }
shot('night', 'crumple', 'PAGES: 30', (L, u, t, c) => {
  const gl = c('glowOn'), wi = c('winIn'), wt = c('winTurn'), dl = c('devLean'), sg = c('smileGone');
  const inK = eo(seg(L, wi, wi + .6)), flip = eio(seg(L, wt - .2, wt + .25)), lean = eio(seg(L, dl, dl + .7)), glowK = seg(L, gl, gl + .6);
  camD(push(u, .06) * 1.1, 760, 520, () => {
    deskHalf(t, { X: 960, green: false, lamp: 1, pinned: 3, q: .5, glowK,
      boy: { expr: L < sg ? (L > wt + .3 ? samEx('smile', L, [wt + 1.1]) : samEx('calm', L, [1.0, 2.6])) : { ...FX.sad, lid: .15 }, look: L < gl ? [0, .9] : [-.8, -.05], turn: L > gl ? -.2 : 0, armL: L < gl ? [900, 676] : undefined, armR: L < gl ? [1010, 680] : undefined,
        glowOn: glowK > 0 ? [GREEN, .32 * glowK] : [LAMP, .18], glowSide: -1 },
      back: () => { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); },
      before: f => { if (L < gl) { pencilD(1000, 668, 64, -.5); }
        if (lean > 0) devBehind(t, { x: lerp(480, 650, lean), y: 960, h: 560, expr: L > c('amazing') ? devEx('sweet', L, [c('amazing') + 1.2]) : devEx('happy', L, []), look: [.9, .4], lean: lerp(.0, .2, lean), tilt: .12 * lean,
            armL: [480, 470], armR: [760, 600], heat: .9 }); },
      after: f => {
        const wx = lerp(-160, 380, inK), wy = lerp(520, 440, inK);
        if (L > wi - .1) { if (lean <= 0) devArm([[-60, 560], [wx - 240, wy + 90], [wx - 60, wy + 60]], [44, 38, 30], 26);
          at(wx, wy, 1, 0, () => { ctx.scale(lerp(-1, 1, flip) || .001, 1); windowD(0, 0, 240, 180, 1, flip > .5 ? (x0, y0, w, h) => SHOW.max(x0, y0, w, h, L - wt, t) : null, { back: flip < .5 }); }); }
        if (L > gl && L < wi + .3) { const k = seg(L, gl, wi) * (1 - seg(L, wi, wi + .3)); glow(GREEN, 200, 470, 220, .5 * k); }
      } });
  });
  red('look. isn’t he amazing?', 760, 1000, 76, L, c('amazing'), 1.0);
});
shot('crumple', 'split', 'PAGES: 30', (L, u, t, c) => {
  const ew = c('eyeWin'), ep = c('eyePage'), cr = c('crush'), to = c('toss'), ca = c('catch'), mu = c('munch'), gu = c('gulp'), gr = c('grow1'), rc = c('reach1'), cp = c('cap1'), co = c('capOn');
  const take = eio(seg(L, ep + .2, cr)), crushK = eo(seg(L, cr, cr + .45)), toss = seg(L, to, ca), grow = eback(seg(L, gr, gr + .45)), reach = eio(seg(L, rc, cp)), pull = eio(seg(L, cp, co)), put = eio(seg(L, co - .1, co + .25));
  const W0 = 240, H0 = 180, ww = lerp(W0, 360, grow), wh = lerp(H0, 270, grow), wx = 380 - (ww - W0) * .45, wy = 440 - (wh - H0) * .25;
  const counted = L >= c('count29');
  over(() => counter(counted ? 'PAGES: 29' : 'PAGES: 30'));
  camD(push(u, .05) * 1.1, 760, 520, () => {
    deskHalf(t, { X: 960, lamp: .8, pinned: 3, q: .5, glowK: 1 + grow * .3,
      boy: { expr: L < ep ? { ...FX.sad, lid: .1 } : L < cr ? 'tempted' : L < to + .3 ? { ...FX.resolve, m: 'grit', lid: .1 } : 'sad', look: L < ep ? [-.8, -.05] : L < cr ? [.6, -.6] : L < to ? [0, .4] : [-.8, .0], turn: L < ep ? -.2 : L < cr ? .2 : -.1,
        armR: L > ep + .1 && L < to + .2 ? [lerp(1060, 1000, crushK), lerp(lerp(500, 300, take), 600, crushK)] : undefined, armL: L > cr && L < to + .2 ? [lerp(900, 950, crushK), 600 - 40 * crushK] : undefined,
        glowOn: [GREEN, .32 + .12 * grow], glowSide: -1 },
      back: () => { if (L < ep + .2) { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); } else if (L < cr) comicD(lerp(1130, 1060, take), lerp(260, 300, take), 210 * (1 - take * .2), 1, .05 + take * .3); },
      before: f => { D_ = devBehind(t, { x: 650, y: 960, h: 560, expr: L < ca ? devEx('happy', L, []) : L < gu + .2 ? { ...DX.happy, m: 'open', h: .5 } : L < rc ? devEx('sweet', L, []) : devEx('charm', L, [co + .6]), look: L < to ? [.9, .3] : L < gu ? [.9, .2] : L < co ? [-.7, -.1] : [.6, .1], lean: .2, tilt: .1,
          armR: L > to - .1 && L < gu + .1 ? [lerp(780, 720, toss), lerp(560, 400, toss)] : [760, 600], armL: L > rc - .1 && L < co + .3 ? [lerp(lerp(480, wx + 40, reach), 600, pull), lerp(lerp(470, wy, reach), 330, pull)] : [wx + ww * .4, wy + 20], heat: .9 + (L > mu && L < gr ? 1.2 : 0), cap: L >= co }); },
      after: f => { const d = D_;
        // the ball of paper: crushed in his hands, tossed, caught, eaten
        if (L > cr && L < to) ballD(lerp(1000, 975, crushK), 590, lerp(60, 34, crushK), crushK * 2);
        if (L >= to && L < mu) { const bx = lerp(980, d.head[0] + 30, toss), by = lerp(580, d.head[1] + d.hr * .3, toss) - Math.sin(toss * Math.PI) * 140; ballD(bx, by, 32, L * 8); }
        if (L >= mu && L < gu) { const k = seg(L, mu, gu); ballD(d.head[0] + d.hr * .1, d.head[1] + d.hr * .45, 32 * (1 - k), k * 3); }
        if (L >= gu - .1 && L < gu + .5) { const k = seg(L, gu - .1, gu + .5); for (let i = 0; i < 6; i++) { const a = rnd(i * 3.3) * TAU; disc(d.head[0] + Math.cos(a) * (50 + k * 90), d.head[1] + d.hr * .4 + Math.sin(a) * (30 + k * 60), 7 * (1 - k), rgba(PAPER, 1 - k)); } }
        // the window, and the cap it pulls out of it
        windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.max(x0, y0, w, h, L + 6, t));
        if (L >= gr && L < gr + .4) { const k = seg(L, gr, gr + .4); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); }
        if (L > cp && L < co) { capAt(lerp(wx, d.head[0], pull), lerp(wy - 10, d.head[1] - d.hr * .82, pull), 60 * lerp(.6, 1, pull), 0); }
      } });
  });
  popFlash(L, gr, .12);
});
