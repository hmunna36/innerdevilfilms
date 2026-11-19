// ---- 36.5-49 THE COST: Max's card under the door; Max's first show: the right one cheers, the left one walks out ----
// a door at the outer side of a half (left-half coordinates: x0..x1 the door, the floor at y), the card sliding in under it
function doorHalf(t, k, L) { stageD(860, { pool: [M(420), 640, 520, GREEN, .05] });
  const x0 = 60, x1 = 330; outlined(() => { ctx.beginPath(); ctx.rect(Math.min(M(x0), M(x1)), 160, Math.abs(M(x1) - M(x0)), 690); }, rgba([96, 70, 58]), 5); rectf(Math.min(M(x0), M(x1)), 850, Math.abs(M(x1) - M(x0)), 10, rgba([255, 214, 160], .35));
  disc(M(x1 - 40), 520, 12, rgba(GOLD)); additive(() => glow(LAMP, M(195), 856, 160, .3));
  const cx = lerp(150, 560, eo(k)); at(M(cx), 846, 1, SIDE * -.04 * (1 - k), () => { ctx.save(); ctx.scale(1, .32); inviteD(0, 0, 300, 0, false); ctx.restore(); }); }
shot('card', 'showR', null, (L, u, t, c) => {
  const ci = c('cardIn'), part2 = L >= ci + .75, k = seg(L, ci - .1, ci + .5);
  if (!part2) { rectf(0, 0, W, H, rgba([26, 20, 18])); for (let i = 0; i < 7; i++) stroke([[0, 120 + i * 150], [W, 120 + i * 150 + 6]], 4, rgba([40, 30, 26]));
    rectf(0, 0, W, 70, rgba([10, 8, 8])); additive(() => glow(LAMP, 960, 70, 700, .35)); rectf(0, 66, W, 6, rgba([255, 214, 160], .5));
    const cy = lerp(-120, 520, eo(k)); at(960 + Math.sin(k * 3) * 20 * (1 - k), cy, 1, .06 * (1 - k) - .04, () => inviteD(0, 0, 760, 0, true)); return; }
  const P = L - (ci + .75), gR = c('grinR') - ci - .75, rR = c('runR') - ci - .75, dR = c('devRead') - ci - .75, run = eio(seg(P, rR, rR + .9));
  SPLIT(side => { const left = side > 0;
    if (left) deskHalf(t, { lamp: 0, pinned: 0, green: true, glowK: .7, pencil: false,
        boy: { expr: P < .4 ? 'calm' : samEx('sad', P, [1.4]), look: [.2, .6], armL: [430, 600], armR: [530, 600], glowOn: [GREEN, .3], glowSide: -1 },
        before: f => { const d = devBehind(t, { x: lerp(260, 330, eo(seg(P, dR - .4, dR))), y: 900, h: 600, expr: P > dR ? devEx('charm', P, [dR + .9]) : devEx('sly', P, []), look: [.8, .8], lean: .25, tilt: .15, cap: true, medal: true, armL: [200, 640], armR: [380, 560] }); },
        after: f => { inviteD(480, 650, 220, -.06); windowDown(M(250), .7); } });
    else deskHalf(t, { lamp: 1, pinned: 12, q: .8, letter: true, pile: 120,
        boy: (() => { const bx = lerp(480, 120, run), up = eo(seg(P, rR - .1, rR + .3)), sw = Math.sin(P * 16) * 60 * (run > 0 && run < 1 ? 1 : 0); return { x: bx, y: lerp(880, 800, up), expr: P > gR ? 'laugh' : 'smile', look: P > gR ? [-.5, -.2] : [.1, .7], armL: P < rR ? [430, 600] : [bx - 60 + sw, 640], armR: P < rR ? [530, 600] : [bx + 60 - sw, 640], tilt: P > gR ? Math.sin(P * 12) * .05 : 0, lean: -.15 * run }; })(),
        after: f => { if (P < rR) inviteD(480, 650, 220, .06); else if (P < rR + .9) inviteD(f.armEndL[0], f.armEndL[1] - 30, 140, .3); windowDown(M(250), .7); } }); }, { focus: P > rR - .2 ? 'R' : null, dim: .4 });
  counterL('PAGES: 0'); counterR('PAGES: 120');
});
// the gallery and its little crowd (full frame); n people, Max in it at mx
function showD(t, L, o) { stageD(900, { pool: [o.mx ?? 1100, 520, 820, [255, 230, 190], .2] }); galleryD(o.x0 ?? 420, o.x1 ?? 1820, t, { n: o.n ?? 5, y: 290, s: 160 });
  for (let i = 0; i < (o.crowd ?? 5); i++) { const x = (o.cx0 ?? 700) + i * (o.cdx ?? 230); if (Math.abs(x - (o.mx ?? 1100)) < 120) continue; figure({ kind: 'sam', x, y: 900, h: 360 + rnd(i * 2.3) * 40, expr: rnd(i) > .5 ? 'smile' : 'laugh', look: [((o.mx ?? 1100) - x) / 600, -.2], dim: .45, seed: 40 + i, t, armR: i === 2 && o.clap ? [x + 30, 640 + Math.abs(Math.sin(t * 9)) * 30] : undefined, armL: i === 2 && o.clap ? [x - 30, 640 + Math.abs(Math.sin(t * 9 + 1)) * 30] : undefined }); } }
shot('showR', 'showL', null, (L, u, t, c) => {
  const ch = c('cheer'), hg = c('hugR'), hug = eio(seg(L, hg - .2, hg + .3));
  SPLIT(side => { if (side > 0) { deskHalf(t, { lamp: 0, pinned: 0, green: true, glowK: .6, pencil: false, boy: { expr: 'sad', look: [.2, .7], armL: [430, 600], armR: [530, 600], glowOn: [GREEN, .26], glowSide: -1 },
      before: f => devBehind(t, { x: 300, y: 900, h: 600, expr: devEx('charm', L, []), look: [.8, .6], lean: .2, tilt: .1, cap: true, medal: true, armL: [200, 640], armR: [380, 600] }), after: f => inviteD(480, 650, 220, -.06) }); return; }
    // the right half: the gallery, Max, the right boy at the front
    stageD(900, { pool: [M(480), 520, 560, [255, 230, 190], .22] }); galleryD(M(820), M(140), t, { n: 3, y: 260, s: 140 });
    for (let i = 0; i < 3; i++) fig({ kind: 'sam', x: 120 + i * 110, y: 900, h: 320, expr: 'laugh', look: [.4, -.2], dim: .5, seed: 50 + i, t });
    const mx = lerp(620, 540, hug), bx = lerp(330, 430, hug), cheer = L > ch && L < hg - .2;
    const m = fig({ kind: 'sam', x: mx, y: 900, h: 400, expr: 'laugh', look: [-.6, -.1], armL: hug > .2 ? [bx + 40, 620] : [mx - 60, 650], armR: hug > .2 ? [bx + 10, 640] : undefined, stretch: true, t, seed: 5 }); capOn(m, -SIDE);
    const b = fig({ kind: 'sam', x: bx, y: 900, h: 400, expr: 'laugh', look: [.7, -.2], armL: cheer ? [bx - 70, 500 - Math.abs(Math.sin(t * 9)) * 40] : hug > .2 ? [bx + 120, 640] : undefined, armR: cheer ? [bx + 60, 480 - Math.abs(Math.sin(t * 9 + 1)) * 40] : hug > .2 ? [bx + 150, 620] : undefined, tilt: cheer ? Math.sin(t * 9) * .05 : 0, stretch: true, t }); earPencil(b, SIDE);
  }, { focus: 'R', dim: .5 });
  counterL('PAGES: 0'); counterR('PAGES: 120');
});
shot('showL', 'worst', null, (L, u, t, c) => {
  const se = c('see'), wv = c('wave'), fr = c('friends'), ta = c('turnAway'), ou = c('out'), fa = c('fall');
  const wave = L > wv && L < fa ? 1 : 0, turn = eio(seg(L, ta, ta + .35)), walk = eio(seg(L, ou, ou + 1.4)), lean = eo(seg(L, fr - .5, fr));
  camD(push(u, .05), 960, 560, () => {
    showD(t, L, { mx: 1240, crowd: 6, cx0: 760, cdx: 200, clap: true });
    // the doorway he leaves by
    outlined(() => { ctx.beginPath(); ctx.rect(30, 300, 190, 600); }, rgba([24, 22, 26]), 5); additive(() => glow([150, 170, 220], 125, 600, 160, .12));
    const m = figure({ kind: 'sam', x: 1240, y: 900, h: 420, expr: L < se ? 'laugh' : L < fa ? (wave ? 'laugh' : 'smile') : { ...FX.sad, lid: .1 }, look: L < se ? [.3, -.2] : [-.95, -.05], turn: L > se ? -.25 : 0,
      armL: wave ? [1150, 470 + Math.sin(t * 14) * 30] : undefined, stretch: true, t, seed: 5 }); capOn(m, -1);
    const bx = lerp(lerp(400, 400, turn), 120, walk);
    const d = devBehind(t, { x: lerp(300, 260, walk) + lean * 60, y: 920, h: 600, expr: L > fr - .3 && L < ta ? devEx('sweet', L, []) : L > ta ? devEx('grin', L, []) : devEx('charm', L, [se + .4]), look: [.9, .1], lean: .15 + lean * .2, tilt: .1 + lean * .1,
      armR: L > fr - .4 && L < ta + .2 ? [lerp(560, 900, lean), lerp(600, 520, lean)] : [460, 640], armL: [200, 660], cap: true, medal: true, heat: .8 });
    const b = figure({ kind: 'sam', x: bx, y: 900 - Math.abs(Math.sin(walk * 9)) * 8 * (walk > 0 && walk < 1 ? 1 : 0), h: 400, expr: L < se ? { ...FX.sad, lid: .2 } : L < fr ? 'tempted' : L < ta ? { ...FX.sad, lid: .1 } : { ...FX.sad, lid: .4 }, look: L < ta ? [.95, -.05] : [-.9, .2], turn: turn > .5 ? -.4 : .25,
      stride: walk > 0 && walk < 1 ? Math.sin(walk * 18) * .8 : 0, t });
  });
  if (L < ta + .5) red('look at all his new friends.', 960, 1000, 72, L, fr, 1.0);
});
