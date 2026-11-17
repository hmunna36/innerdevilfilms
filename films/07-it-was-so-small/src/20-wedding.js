// ---- 17.9-25.7 AGE 26: his wedding ----
shot('a26', 'sip26', 'AGE: 26', (L, u, t, c) => {
  const tings = [c('ting1'), c('ting2'), c('ting3')], hit = blinkAt(L, tings, .09), toast = eo(seg(L, c('toUs') - .1, c('toUs') + .45)), laugh = L > c('toUs') + .5;
  camD(push(u), 960, 560, () => {
    stageD(860, { pool: [1000, 470, 820, [255, 222, 186], .2] }); flowerArch(1080, 560, 330, 860);
    for (const [x, h, k, bun] of [[250, 400, 1, 0], [440, 380, 2.2, 1], [1640, 410, 3.1, 0], [1800, 380, 4, -1]]) figure({ kind: 'sam', x, y: 860, h, expr: laugh ? 'laugh' : 'smile', look: [x < 960 ? .7 : -.7, 0], dim: .68, seed: 9 + k, bun, lash: !!bun, t });
    // it hangs on his back, cheek to cheek, with a glass of its own
    const dx = 835, dy = 662, gx = 742, gy = 522 - toast * 30, sway = Math.sin(t * 3) * .03;
    const dv = figure({ kind: 'devil', x: dx, y: dy, h: 172, stage: 1, expr: devEx(L < tings[2] + .15 ? 'happy' : 'charm', L, [2.3]), look: L < tings[2] + .2 ? [-.6, -.2] : [.8, 0], tilt: -.1 + sway, armL: [gx + 14, gy + 30], bendL: .4, armR: [dx + 80, dy - 60], bendR: -.4,
      tail: [lerp(-.56, -.47, hit), lerp(-.28, -.66, hit)], heat: 1, t, stretch: true });
    bowD(dv.sx, dv.shY - 2, 13, D.ember, D.red);
    ctx.save(); ctx.globalAlpha = .9; glassD(gx, gy + 34, 50, .7, 0); ctx.restore();
    for (const tg of tings) { const k = L - tg; if (k > 0 && k < .28) { const a = 1 - k / .28; for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + .3; stroke([[gx + Math.cos(an) * (34 + k * 90), gy + 4 + Math.sin(an) * (34 + k * 90)], [gx + Math.cos(an) * (48 + k * 130), gy + 4 + Math.sin(an) * (48 + k * 130)]], 4, rgba(D.white, a)); } } }
    // the two of them
    const bob = laugh ? Math.abs(Math.sin((L - c('toUs')) * 9)) * 10 : 0, g1 = [1088, lerp(700, 522, toast)], g2 = [1126, lerp(700, 528, toast)];
    const sam = figure({ kind: 'sam', x: 985, y: 860 - bob * .3, h: 450, expr: laugh ? 'laugh' : samEx('smile', L, [.4]), look: toast > .2 ? [.8, 0] : [-.8, -.1], turn: toast > .2 ? .3 : -.3, tilt: -.03, armR: [g1[0] - 4, g1[1] + 34], bendR: .5, t });
    bowD(sam.sx, sam.shY - 3, 17);
    const br = figure({ kind: 'sam', x: 1215, y: 860 - bob * .3, h: 420, expr: laugh ? 'laugh' : 'smile', look: [-.8, 0], turn: -.3, tilt: .04 + (laugh ? Math.sin(L * 9) * .04 : 0), bun: -1, lash: true, armL: [g2[0] + 6, g2[1] + 34], bendL: -.5, armR: [1262, 716], seed: 5, t });
    veilD(br);
    for (const [ox, oy, cc] of [[0, 0, [190, 90, 120]], [-13, 9, [226, 222, 212]], [13, 10, [226, 222, 212]], [0, 17, [70, 150, 170]]]) { disc(br.armEndR[0] + ox, br.armEndR[1] + oy, 14, rgba(D.line)); disc(br.armEndR[0] + ox, br.armEndR[1] + oy, 10.5, rgba(cc)); }
    glassD(g1[0], g1[1] + 44, 96, .7, 0); glassD(g2[0], g2[1] + 44, 96, .7, 0);
    const ck = L - (c('toUs') + .4); if (ck > 0 && ck < .25) for (let i = 0; i < 5; i++) { const an = -Math.PI * (i + .5) / 5; stroke([[1107 + Math.cos(an) * (20 + ck * 120), 470 + Math.sin(an) * (20 + ck * 120)], [1107 + Math.cos(an) * (34 + ck * 170), 470 + Math.sin(an) * (34 + ck * 170)]], 4, rgba(D.white, 1 - ck / .25)); }
  });
  red('to us.', 520, 380, 76, L, c('toUs'), .5);
});
// it drinks from his glass behind his back
shot('sip26', 'wall26', 'AGE: 26', (L, u, t, c) => {
  const g1 = c('gulp26a'), g2 = c('gulp26b'), fl = c('flare26'), pp = c('pop26'), popped = L >= pp, pop = eback(seg(L, pp, pp + .4)), flare = flareK(L, fl - .15, pp + .25);
  const sag = popped ? eo(seg(L, pp, pp + .3)) * 80 : 0, shake = popped ? Math.sin((L - pp) * 46) * 14 * (1 - seg(L, pp, pp + .6)) : 0, gp = blinkAt(L, [g1, g2], .17);
  camD(push(u), 1000, 560 + shake * .4, () => {
    stageD(0, { pool: [760, 420, 820, [255, 216, 176], .2] });
    for (let i = 0; i < 9; i++) { const c3 = [[226, 222, 212], [190, 90, 120], [70, 150, 170]][i % 3]; glow(c3, 80 + i * 230, 60 + (i % 2) * 40, 60, .35); }
    const gx = 1440, gy = 900 + sag, gs = 380, rimY = gy - gs, fill = lerp(.72, .14, eo(seg(L, g1 - .2, fl)));
    const bobk = Math.abs(Math.sin(L * 7)) * 14;
    const sam = figure({ kind: 'sam', x: 740, y: 1700 - bobk, h: 1500, expr: 'laugh', look: [-.9, 0], turn: -.5, tilt: -.05 + Math.sin(L * 7) * .03, armR: [gx - 150, gy - 150], bendR: .5, armL: [540, 1300], noLegs: true, t, stretch: true });
    bowD(sam.sx - 20, sam.shY - 4, 58);
    glassD(gx, gy, gs, fill, 0);
    taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 20, gy - 160]], [116, 112, 100], rgba(D.line)); taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 22, gy - 160]], [104, 100, 88], rgba(D.cream));
    const h = 430 * (1 + .06 * flare) * (popped ? lerp(1, 1.5, pop) : 1), st = popped ? lerp(1, 2, eo(seg(L, pp, pp + .25))) : 1, drinking = L > g1 - .25 && L < fl;
    const ex = L < g1 - .25 ? devEx('sly', L, []) : drinking ? { ...DX.sweet, h: .28, m: 'pout' } : !popped ? { ...DX.happy, h: 1.3 } : devEx('charm', L, []);
    const f = figure({ kind: 'devil', x: 1200 + shake, y: 772 + sag, h, stage: st, sit: 1, expr: ex, look: L < g1 - .25 ? [-.9, 0] : popped ? [-.8, .2] : [.7, .5], lean: drinking ? .2 : .06, tilt: (drinking ? .16 - gp * .1 : 0) + (popped ? Math.sin((L - pp) * 5) * .05 : 0),
      armR: drinking ? [gx - 150, rimY - 60] : undefined, bendR: -.3, tail: [-.44 + .06 * Math.sin(t * (popped ? 9 : 6)), -.34 + .05 * Math.cos(t * 5)], heat: 1 + 2.2 * flare, t });
    bowD(f.sx, f.shY - 2, h * .075, D.ember, D.red);
    if (drinking) { const m = [f.head[0] + f.hr * .25, f.head[1] + f.hr * .56]; const sp = [m, [m[0] + 70, m[1] - 10], [gx - 130, rimY - 40], [gx - 90, rimY + 60], [gx - 60, gy - 60]]; curve(sp, 20, rgba(D.line), .4); curve(sp, 12, rgba(D.white), .4); }
    burp(L, pp - .28, f.head[0] + 40, f.head[1] - 120, 1.3); popRing(L, pp, f.hip[0], f.hip[1] - h * .4);
  });
  popFlash(L, pp);
});
// wide: its shadow is already as tall as he is
shot('wall26', 'a31', 'AGE: 26', (L, u, t, c) => {
  const sk = eio(seg(L, c('shadow26') - .1, c('shadow26') + 1.3)), sway = Math.sin(L * 2.3) * 16;
  camD(push(u, .04), 960, 540, () => {
    stageD(900, {});
    ctx.fillStyle = rg(960, 470, 160, 800, [[0, [255, 216, 170], .26], [1, [255, 216, 170], 0]]); ctx.fillRect(0, 0, W, 900);
    flowerArch(700, 620, 300, 900);
    shadowFig(1130 + sway * 1.4, 900, 610, false, .55); shadowFig(930 + sway * 1.4, 900, 570, false, .5); shadowFig(1420 + sway * 1.4, 900, lerp(300, 640, sk), true, lerp(.55, .86, sk), lerp(9, 5, sk));
    const br = figure({ kind: 'sam', x: 640 + sway, y: 900, h: 400, expr: 'smile', look: [.8, -.1], turn: .3, tilt: .05 + sway * .003, bun: 1, lash: true, armR: [735 + sway, 668], bendR: -.4, seed: 5, t }); veilD({ head: [br.head[0] - br.hr * 2.2, br.head[1]], hr: br.hr * 0 });
    const dv = figure({ kind: 'devil', x: 950 + sway, y: 900, h: 262, stage: 2, expr: devEx('charm', L, [1.2]), look: [-.5, -.7], tilt: -.08, armL: [868 + sway, 760], bendL: .4, tail: [.4 + .05 * Math.sin(t * 5), -.26], t, stretch: true });
    bowD(dv.sx, dv.shY - 2, 18, D.ember, D.red);
    const sam = figure({ kind: 'sam', x: 800 + sway, y: 900, h: 430, expr: samEx('smile', L, [.9]), look: [-.8, 0], turn: -.3, tilt: -.04 + sway * .003, armL: [705 + sway, 664], bendL: .4, t }); bowD(sam.sx, sam.shY - 3, 16);
  });
});
