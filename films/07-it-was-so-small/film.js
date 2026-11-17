// BUILT by stage/build.sh from src/*.js - edit the parts, not this file
'use strict';
// THE BOTTLE | It Was So Small: this film's own props (the shared kit is stage/kit.js).
function veilD(f) { const [hx, hy] = f.head, r = f.hr; ctx.save(); ctx.globalAlpha = .5; blob([[hx - r * .9, hy - r * .8], [hx + r * .2, hy - r * 1.12], [hx + r * 1.15, hy - r * .3], [hx + r * 1.5, hy + r * 1.6], [hx + r * 1.2, hy + r * 3.0], [hx + r * .7, hy + r * 1.2], [hx + r * .9, hy - r * .1]], rgba(D.white), .5); ctx.restore(); }
function babyD(x, y, s, o = {}) { at(x, y, s, o.rot || 0, () => { outlined(() => blobPath([[-1, -.1], [-.4, -.55], [.6, -.5], [1.05, 0], [.6, .5], [-.5, .5]], .5, true), rgba(D.yellow), .07); disc(-.62, -.08, .37, rgba(D.line)); disc(-.62, -.08, .31, rgba(D.cream));
  if (o.awake) { disc(-.72, -.1, .04, rgba(D.line)); disc(-.52, -.1, .04, rgba(D.line)); } else { stroke([[-.78, -.08], [-.68, -.05]], .035, rgba(D.line)); stroke([[-.57, -.05], [-.47, -.08]], .035, rgba(D.line)); } stroke([[-.2, -.5], [.1, .48]], .05, rgba(darken(D.yellow, .25))); }); }
// a sheet of paper with a child's crayon drawing. horns: Daddy in red with horns; else Daddy in blue, holding her hand, a sun
function drawingD(x, y, s, rot, horns, o = {}) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-1, -.72, 2, 1.44); }, rgba([238, 234, 222]), .02);
  const cr = (pts, col, w = .035) => curve(jit(pts, .012, 3), w, rgba(col), .5), stick = (px, hgt, col, extra) => { const top = .42 - hgt; ctx.lineWidth = .035; ctx.strokeStyle = rgba(col); ctx.beginPath(); ctx.arc(px, top + .1, .1, 0, TAU); ctx.stroke(); cr([[px, top + .2], [px + .01, .22]], col); cr([[px - .13, top + .34], [px, top + .28], [px + .13, top + .34]], col); cr([[px - .1, .42], [px, .22], [px + .1, .42]], col); if (extra) extra(px, top); };
  ctx.save(); ctx.font = '700 0.17px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = rgba([70, 90, 160]); ctx.fillText('MY FAMILY', 0, -.47); ctx.restore();
  const green = [60, 150, 90], yel = [235, 180, 20], redc = [225, 40, 30], blue = [50, 110, 210];
  if (horns) { stick(-.62, .62, green, (px, top) => cr([[px - .12, top + .2], [px, top + .5], [px + .12, top + .2]], green, .03)); stick(-.3, .4, yel, (px, top) => { cr([[px - .1, top - .02], [px, top + .03], [px + .1, top - .02]], yel, .05); });
    stick(.45, .78, redc, (px, top) => { cr([[px - .08, top + .02], [px - .13, top - .1]], redc, .05); cr([[px + .08, top + .02], [px + .13, top - .1]], redc, .05); cr([[px - .05, top + .13], [px + .05, top + .13]], redc, .03); for (let i = 0; i < 9; i++) cr([[px - .2 + i * .05, top + .2 + (i % 2) * .5], [px - .17 + i * .05, top + .7 - (i % 2) * .5]], redc, .02); });
  } else { stick(-.62, .62, green, (px, top) => cr([[px - .12, top + .2], [px, top + .5], [px + .12, top + .2]], green, .03)); stick(.42, .74, blue, (px, top) => cr([[px - .05, top + .1], [px, top + .14], [px + .05, top + .1]], blue, .025)); stick(.08, .4, yel, (px, top) => { cr([[px - .1, top - .02], [px, top + .03], [px + .1, top - .02]], yel, .05); cr([[px - .04, top + .1], [px, top + .14], [px + .04, top + .1]], yel, .025); });
    cr([[.2, .14], [.3, .1]], blue, .035); ctx.lineWidth = .04; ctx.strokeStyle = rgba(yel); ctx.beginPath(); ctx.arc(-.7, -.42, .12, 0, TAU); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; cr([[-.7 + Math.cos(a) * .17, -.42 + Math.sin(a) * .17], [-.7 + Math.cos(a) * .25, -.42 + Math.sin(a) * .25]], yel, .03); } cr([[.72, -.3], [.78, -.36], [.84, -.3], [.9, -.36]], redc, .03); }
  if (o.shade) rectf(-1, -.72, 2, 1.44, rgba(D.stage, o.shade)); }); }
function flowerArch(cx, cy, r, floorY) { curve([[cx - r, floorY], [cx - r, cy], [cx - r * .7, cy - r * .7], [cx, cy - r], [cx + r * .7, cy - r * .7], [cx + r, cy], [cx + r, floorY]], 6, rgba(D.prop), .5);
  for (let i = 0; i < 17; i++) { const a = Math.PI + i / 16 * Math.PI, x = cx + Math.cos(a) * r * (i % 2 ? .97 : 1.03), y = cy + Math.sin(a) * r * (i % 2 ? .97 : 1.03) * (Math.abs(Math.cos(a)) > .9 ? 1 : 1), c = [[226, 222, 212], [190, 90, 120], [70, 150, 170]][i % 3]; disc(x, y, 21, rgba(D.line)); disc(x, y, 16, rgba(c)); disc(x, y, 5, rgba(D.yellow, .8)); } }
// ---- 0.0-4.4 the cold open ----
shot('open', 'a21', null, (L, u, t, c) => {
  const gx = 1010, rimY = 650, rise = eo(seg(L, c('hiss'), 1.9)), foam = [[gx - 250, rimY + 6, 44, 0], [gx - 170, rimY - 14, 56, 1.3], [gx - 76, rimY + 2, 50, 2.1], [gx + 20, rimY - 10, 58, .6], [gx + 120, rimY + 6, 48, 2.8], [gx + 210, rimY - 8, 54, 1.9], [gx + 284, rimY + 10, 38, 3.4]];
  camD(1.18 + .08 * u, gx, rimY - 20, () => {
    glow([255, 206, 150], gx, 560, 700, .1 * rise + .03);
    ctx.save(); ctx.globalAlpha = .35 + .65 * rise; macroGlass(t, gx, rimY);
    foamD(foam.map(([x, y, r, ph]) => [x, y + (1 - rise) * (150 + ph * 30), r * (.4 + .6 * rise), ph]), t); ctx.restore();
    for (let i = 0; i < 14; i++) { const k = (L * (.5 + rnd(i) * .5) + rnd(i * 3)) % 1; disc(gx - 270 + rnd(i * 7) * 540, rimY + 400 - k * 380, 3 + rnd(i * 2) * 4, rgba(D.white, .5 * (1 - k) * rise)); }   // bubbles
    const e = c('eyes0'); if (L > e) { const k = eo(seg(L, e, e + .2)); additive(() => glow(D.red, gx, rimY - 16, 120 * k, .8)); for (const sd of [-1, 1]) oval(gx + sd * 26, rimY - 22, 13 * k, 19 * k * (1 - blinkAt(L, [e + .62], .09)), rgba(D.hot)); }
  });
  say('Nobody feeds a monster.', 960, 210, 78, L, c('line1'), 1.0); say('You feed something small.', 960, 318, 78, L, c('line2'), 1.0);
});
// ---- 4.4-17.9 AGE 21 (the moving test the owner approved, unchanged) ----
function AGE21(t) {
  const T = [0, 2.6, 5.6, 7.4, 10.4, 13.5], si = T.findIndex((a, i) => t >= a && t < T[i + 1]), L = t - T[Math.max(0, si)], u = L / (T[si + 1] - T[si]);
  const push = 1 + .06 * u;
  if (si === 0) {                                                                    // ---- the party, wide ----
    camD(push, 960, 560, () => {
      stageD(860, { pool: [960, 470, 800, [255, 214, 160], .2] }); lightsD(t, 110);
      const up = eo(seg(L, .35, 1.0)), laugh = L > 1.25, bob = k => laugh ? Math.abs(Math.sin((L - 1.25) * 9 + k)) * 12 : 0;
      for (const [x, h, k, sd] of [[520, 400, 1, 1], [1330, 430, 2.2, -1]]) { const b = bob(k), gxx = x + sd * 90, gyy = lerp(660, 520, up) - b;
        figure({ kind: 'sam', x, y: 860 - b * .3, h, expr: laugh ? 'laugh' : 'smile', look: [sd * .6, 0], dim: .55, seed: 9 + k, t, armR: sd > 0 ? [gxx, gyy + 30] : undefined, armL: sd < 0 ? [gxx, gyy + 30] : undefined, bendR: .4, bendL: -.4, tilt: laugh ? Math.sin(L * 9 + k) * .05 : 0 });
        ctx.save(); ctx.globalAlpha = .6; glassD(gxx, gyy + 36, 84, .7, .1, [90, 96, 110]); ctx.restore(); }
      const b = bob(0), gx = 1052, gy = lerp(700, 512, up) - b;
      const sam = figure({ kind: 'sam', x: 930, y: 860 - b * .3, h: 450, expr: laugh ? 'laugh' : samEx('smile', L, [.8]), look: [.5, -.2 * up], armR: [gx - 6, gy + 34], bendR: .5, tilt: laugh ? Math.sin(L * 9) * .05 : 0, t });
      glassD(gx, gy + 44, 104, .72, .12);
      if (L > 1.9) { const k = eo(seg(L, 1.9, 2.1)); additive(() => glow(D.red, gx, gy - 62, 60 * k, .9)); for (const sd of [-1, 1]) oval(gx + sd * 9, gy - 62, 4.5 * k, 6 * k * (1 - blinkAt(L, [2.35], .1)), rgba(D.hot)); }
    });
     hw('his first one.', 960, 250, 70, 'say', { reveal: seg(L, .5, 1.3) });
  } else if (si === 1 || si === 4) {                                                 // ---- the rim of his glass, close ----
    const gx = 1010, rimY = 650, foam = [[gx - 250, rimY + 6, 44, 0], [gx - 170, rimY - 14, 56, 1.3], [gx - 76, rimY + 2, 50, 2.1], [gx + 20, rimY - 10, 58, .6], [gx + 120, rimY + 6, 48, 2.8], [gx + 210, rimY - 8, 54, 1.9], [gx + 284, rimY + 10, 38, 3.4]];
    let shake = 0;
    const back = si === 4 ? eio(seg(L, 2.2, 2.65)) : 0;
    rectf(0, 0, W, H, rgba(D.stage));
    camD(si === 1 ? push * 1.5 : lerp(push * 1.36, 1.02, back), si === 1 ? gx : gx - 150, rimY - (si === 1 ? 120 : lerp(110, 250, back)), () => {
      rectf(-400, -600, W + 800, H + 1200, rgba(D.stage)); glow([255, 206, 150], gx, 520, 760, .16); lightsD(t, si === 4 ? 60 - 190 * back : 60, .6);
      if (si === 1) {
        const rise = eback(seg(L, .95, 1.45)), shakeE = Math.sin(seg(L, 1.75, 2.45) * Math.PI), sn = seg(L, 2.45, 2.7), snap = seg(L, 2.7, 2.82);
        macroGlass(t, gx, rimY);
        const tilt = Math.sin((L - 1.75) * 42) * .3 * shakeE + (L > 2.45 ? lerp(lerp(0, -.3, eo(sn)), .16, eo(snap)) * (1 - seg(L, 2.9, 3.0) * .6) : 0);
        const ex = L < 1.7 ? devEx('sweet', L, [1.55]) : L < 2.45 ? { ...DX.sulk, m: 'cat' } : L < 2.7 ? { ...DX.plead, h: .3, m: 'pout' } : devEx('happy', L, []);
        if (L > .9) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, rimY + 30); ctx.clip();
          const y = lerp(rimY + 330, rimY + 18, rise), armUp = seg(L, 1.25, 1.6) * (1 - seg(L, 1.75, 1.9));
          const f = figure({ kind: 'devil', x: gx + Math.sin((L - 1.75) * 42) * 14 * shakeE, y, h: 300, stage: 0, expr: ex, look: [-.5, .1], tilt, armL: armUp ? [gx - 150, y - 300 * (.3 + .4 * armUp)] : undefined, armR: armUp ? [gx + 150, y - 300 * (.3 + .4 * armUp)] : undefined, bendL: .3, bendR: -.3, tail: [.44 + .05 * Math.sin(t * 6), -.34 + .05 * Math.cos(t * 5)], heat: 1, t });
          if (L < 1.8) { const fy = lerp(0, 1, seg(L, 1.72, 1.8)); disc(f.head[0] + 50, f.head[1] - f.hr * .98 - fy * 60, 30, rgba(D.white, 1 - fy)); disc(f.head[0] + 84, f.head[1] - f.hr * .86 - fy * 80, 18, rgba(D.white, 1 - fy)); }
          ctx.restore();
          // it shakes itself dry
          for (let i = 0; i < 22; i++) { const t0 = 1.76 + rnd(i * 3.1) * .55, a = L - t0; if (a < 0 || a > .7) continue; const ang = -Math.PI * rnd(i * 5.3), v = 420 + rnd(i * 7.7) * 380;
            const x = f.head[0] + Math.cos(ang) * (60 + v * a), yy = f.head[1] + Math.sin(ang) * (60 + v * a) + 900 * a * a; disc(x, yy, 7 - a * 6, rgba(i % 3 ? D.white : D.amber, 1 - a / .7)); }
          // and sneezes a spark
          if (L > 2.7) { const a = L - 2.7, px = f.head[0] - 130 - a * 520, py = f.head[1] + 60 + a * 60, k = 1 - seg(a, 0, .6);
            additive(() => glow(D.ember, px, py, 110 * k + 20, .9 * k)); blob([[px + 40 * k, py], [px, py - 26 * k], [px - 60 * k, py], [px, py + 26 * k]], rgba(D.hot, k), .5);
            for (let i = 0; i < 9; i++) { const ax = px + (rnd(i * 2.3) - .3) * 220 * a + 30, ay = py + (rnd(i * 4.1) - .5) * 200 * a - 120 * a; disc(ax, ay, 5 * k, rgba(D.ember, k)); } }
        }
        foamD(foam, t);
        if (L > .3 && L < 1.0) { const k = eo(seg(L, .3, .5)) * (1 - seg(L, .92, 1.0)); additive(() => glow(D.red, gx, rimY - 16, 120 * k, .8)); for (const sd of [-1, 1]) oval(gx + sd * 26, rimY - 22, 13 * k, 19 * k * (1 - blinkAt(L, [.68], .09)), rgba(D.hot)); }
      } else {
        const tipK = eo(seg(L, .1, .85)) * (1 - eio(seg(L, 1.55, 2.05))), tip = [lerp(-260, gx - 196, tipK), lerp(1060, rimY - 150, tipK)], leanK = eio(seg(L, .75, 1.15)) * (1 - eio(seg(L, 1.4, 1.75)));
        const flare = Math.sin(seg(L, 1.45, 2.2) * Math.PI), pop = eback(seg(L, 2.2, 2.6)), popped = L >= 2.2, st = popped ? lerp(0, 1, eo(seg(L, 2.2, 2.45))) : 0;
        shake = popped ? Math.sin((L - 2.2) * 46) * 16 * (1 - seg(L, 2.2, 2.9)) : 0;
        macroGlass(t, gx, rimY, shake);
        const h = 300 * (1 + .06 * flare) * (popped ? lerp(1, 1.85, pop) : 1);
        const ex = L < .75 ? devEx('sweet', L, [.4]) : L < 1.45 ? DX.happy : L < 1.95 ? { ...DX.sweet, h: 1.4, pup: .7 } : L < 2.2 ? { ...DX.happy, h: .35 } : devEx('charm', L, [2.95]);
        const f = figure({ kind: 'devil', x: gx + 40 + shake, y: rimY + 6, h, stage: st, expr: ex, look: popped ? [-.7, .2] : [-.9, .1], lean: -.2 * leanK, tilt: -.16 * leanK + (popped ? Math.sin((L - 2.2) * 5) * .05 : 0), sit: -1, armL: leanK > .1 ? [tip[0] + 70, tip[1] + 30] : undefined, bendL: .3, tail: [.44 + .07 * Math.sin(t * (popped ? 9 : 6)), -.34 + .05 * Math.cos(t * 5)], heat: 1 + 2 * flare, t });
        if (L > 1.95 && L < 2.45) { const a = L - 1.95, px = f.head[0] - 60, py = f.head[1] - 150 - a * 320, k = 1 - seg(a, 0, .5); additive(() => glow(D.ember, px, py, 90 * k + 20, .9 * k)); blob([[px, py + 40 * k], [px + 30 * k, py], [px, py - 70 * k], [px - 30 * k, py]], rgba(D.hot, k), .5); }
        if (popped) { const a = seg(L, 2.2, 2.75); ctx.lineWidth = 14 * (1 - a); ctx.strokeStyle = rgba(D.red, 1 - a); ctx.beginPath(); ctx.arc(f.hip[0], f.hip[1] - h * .4, 120 + a * 520, 0, TAU); ctx.stroke(); }
        foamD(foam.map(([x, y, r, ph]) => [x + shake, y - (popped ? Math.sin(seg(L, 2.2, 2.8) * Math.PI) * 26 * (1 + ph * .3) : 0), r, ph]), t);
        // his fingertip with a drop on it
        const base = [tip[0] - 520, tip[1] + 380], mid = [tip[0] - 220, tip[1] + 120];
        taper([base, mid, tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([base, mid, tip], [150, 132, 104], lg(0, tip[1] - 60, 0, tip[1] + 200, [[0, D.cream], [1, D.creamS]]));
        if (L < 1.2) { const dx = tip[0] + 44, dy = tip[1] - 30, k = 1 - seg(L, 1.05, 1.2); blob([[dx, dy - 34 * k], [dx + 20 * k, dy + 4], [dx, dy + 24 * k], [dx - 20 * k, dy + 4]], rgba(D.amber), .5); disc(dx - 6, dy, 5 * k, 'rgba(255,255,255,.8)'); }
      }
    });
    
    if (si === 4 && L > 2.5) hw('it was so small.', 440, 470, 76, 'say', { reveal: seg(L, 2.5, 2.95) });
    if (si === 4 && L >= 2.2 && L < 2.3) rectf(0, 0, W, H, rgba(D.red, .28 * (1 - seg(L, 2.2, 2.3))));
  } else if (si === 2) {                                                             // ---- his face ----
    camD(push, 960, 540, () => {
      stageD(0, { pool: [900, 500, 800, [255, 206, 150], .18] }); lightsD(t, 50, .7);
      const laugh = L > .62, k = laugh ? (L - .62) : 0, bob = laugh ? Math.abs(Math.sin(k * 9.5)) * 26 : 0, flick = .32 + .1 * Math.sin(t * 17) + .06 * Math.sin(t * 31);
      figure({ kind: 'sam', x: 900, y: 2060 - bob, h: 1900, expr: laugh ? 'laugh' : { eh: 1.2, lid: 0, bi: -.2, bo: .04, m: 'gasp', small: true }, look: [.8, .3], turn: .35, tilt: laugh ? .05 + Math.sin(k * 9.5) * .04 : -.03, noLegs: true, noArms: true, glowOn: [D.ember, flick], glowSide: 1, t });
    });
    
  } else {                                                                           // ---- the two of them ----
    camD(push, 1000, 560, () => {
      stageD(0, { pool: [760, 420, 820, [255, 206, 150], .2] }); lightsD(t, 70);
      figure({ kind: 'sam', x: 300, y: 1000, h: 520, expr: 'laugh', dim: .72, look: [.5, 0], t, seed: 9 });
      const gx = 1330, gy = 900, gs = 380, rimY = gy - gs, nod = Math.sin(L * 2.4) * .02;
      figure({ kind: 'sam', x: 760, y: 1700, h: 1500, expr: samEx('smile', L, [1.2, 2.5]), look: [.9, .1], turn: .5, tilt: .06 + nod, armR: [gx - 150, gy - 150], bendR: .5, armL: [560, 1300], noLegs: true, glowOn: [D.ember, .28 + .05 * Math.sin(t * 13)], glowSide: 1, t, stretch: true });
      glassD(gx, gy, gs, .72, .1);
      taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 20, gy - 160]], [116, 112, 100], rgba(D.line)); taper([[gx - 210, gy - 190], [gx - 110, gy - 150], [gx - 22, gy - 160]], [104, 100, 88], rgba(D.cream));
      const foam = [[gx - 116, rimY + 8, 30, 0], [gx - 60, rimY - 8, 38, 1.4], [gx + 126, rimY + 4, 30, 2.2], [gx + 86, rimY + 26, 24, 3]];
      figure({ kind: 'devil', x: gx + 16, y: rimY + 6 + Math.sin(t * 5) * 3, h: 250, stage: 0, expr: L > 2.35 ? devEx('happy', L, []) : devEx('sweet', L, [.9, 2.0]), look: [-.9, -.2], tilt: -.1 + Math.sin(L * 2.6) * .13, sit: -1, tail: [.46 + .06 * Math.sin(t * 6), -.36 + .05 * Math.cos(t * 5)], heat: 1, t });
      foamD(foam, t);
    });
     hw('you’re funnier with me.', 1010, 1000, 76, 'devil', { reveal: seg(L, .55, 1.75) });
  }

}
shot('a21', 'a26', 'AGE: 15', (L, u, t) => AGE21(L));
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
  say('it was growing.', 1300, 170, 66, L, c('capGrow'), .6);
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
// ---- 25.7-33.5 AGE 31: the nursery ----
function nurseryD(t) {
  outlined(() => { ctx.beginPath(); ctx.rect(200, 190, 270, 310); }, rgba([36, 48, 84]), 5); stroke([[335, 190], [335, 500]], 5, rgba(D.line)); stroke([[200, 345], [470, 345]], 5, rgba(D.line));
  disc(410, 262, 32, rgba([230, 236, 252])); glow([170, 190, 255], 410, 262, 160, .5); cone(335, 500, 135, 430, 370, [150, 170, 255], .13, 250);
  const cx = 1460, cy = 860, col = rgba(D.prop);
  for (let i = 0; i < 9; i++) outlined(() => { ctx.beginPath(); ctx.rect(cx - 176 + i * 43, cy - 240, 9, 190); }, col, 3.5);
  for (const y of [cy - 262, cy - 62]) outlined(() => { ctx.beginPath(); ctx.rect(cx - 196, y, 392, 24); }, col, 4);
  for (const sd of [-1, 1]) outlined(() => { ctx.beginPath(); ctx.rect(cx + sd * 184 - 9, cy - 300, 18, 300); }, col, 4);
  stroke([[cx, 0], [cx, 250]], 2.5, rgba(D.floor)); stroke([[cx - 110, 250], [cx + 110, 250]], 3, rgba(D.floor));
  for (const [dx, len, cc, ph] of [[-110, 70, D.yellow, 0], [-36, 110, [150, 190, 230], 1.3], [40, 80, [226, 222, 212], 2.2], [110, 104, [190, 90, 120], 3.1]]) { const sw = Math.sin(t * 1.4 + ph) * 8; stroke([[cx + dx, 250], [cx + dx + sw, 250 + len]], 2, rgba(D.floor));
    at(cx + dx + sw, 250 + len + 14, 15, t * .4 + ph, () => { poly(Array.from({ length: 10 }, (_, i) => { const a = i / 10 * TAU, r = i % 2 ? .45 : 1.1; return [Math.cos(a) * r, Math.sin(a) * r]; }), rgba(cc)); }); }
}
function stoolD(x, y, rot = 0) { at(x, y, 1, rot, () => { outlined(() => { ctx.beginPath(); ctx.rect(-58, -160, 116, 18); }, rgba(D.wood), 4); for (const sd of [-1, 1]) outlined(() => poly([[sd * 40 - 7, -142], [sd * 40 + 7, -142], [sd * 54 + 7, 0], [sd * 54 - 7, 0]]), rgba(mix(D.wood, D.stage, .3)), 4); }); }
shot('a31', 'flask', 'AGE: 31', (L, u, t, c) => {
  say('it never left.', 900, 190, 66, L, c('capNever'), .6);
  camD(push(u), 960, 560, () => {
    stageD(860, { pool: [860, 520, 760, [170, 190, 255], .12] }); nurseryD(t);
    const rock = Math.sin(L * 2.1) * .035;
    stoolD(1090, 860);
    figure({ kind: 'devil', x: 1090, y: 700, h: 272, stage: 2, expr: devEx('sweet', L, [1.5]), look: [-.8, .5], lean: -.2, tilt: -.14 + Math.sin(L * 1.3) * .03, armL: [1010, 640], bendL: .3, tail: [.4 + .05 * Math.sin(t * 2.4), -.28 + .04 * Math.cos(t * 2)], heat: .8, t });
    const sam = figure({ kind: 'sam', x: 880, y: 860, h: 450, expr: { ...samEx('smile', L, [.8]), bags: true }, look: [-.2, .9], lean: rock, tilt: .1 + rock, armL: [828, 742], armR: [946, 738], bendL: -.6, bendR: .6, glowOn: [[170, 190, 255], .14], glowSide: -1, t });
    babyD(sam.sx - 6, sam.shY + 132, 66, { rot: -.16 + rock });
  });
});
shot('flask', 'drink31', 'AGE: 31', (L, u, t, c) => {
  const tk = c('take31'), take = eio(seg(L, tk, tk + .55)), offer = eo(seg(L, 0, .55));
  camD(push(u), 960, 560, () => {
    stageD(0, { pool: [700, 450, 800, [170, 190, 255], .12] }); glow([170, 190, 255], 150, 200, 500, .18);
    const dv = figure({ kind: 'devil', x: 1570, y: 1400, h: 940, stage: 2, expr: devEx(L < tk ? 'sweet' : 'charm', L, [1.1, 2.5]), look: [-.9, L < tk ? .1 : .4], tilt: -.08 + Math.sin(L * 1.7) * .03, noLegs: true, noArms: true, noTail: true, t });
    const ph = L < .9 ? 0 : L < 1.95 ? 1 : 2;
    const look = ph === 1 ? [-.25, .95] : [.9, .25], ex = ph === 0 ? samEx('tired', L, [.45]) : ph === 1 ? { ...FX.sad, bags: true } : samEx('tempted', L, [2.75]);
    const f0 = [lerp(1420, 1220, offer), lerp(760, 640, offer)], fp = [lerp(f0[0], 1090, take), lerp(f0[1], 700, take)];
    const sam = figure({ kind: 'sam', x: 660, y: 1700, h: 1500, expr: ex, look, turn: ph === 1 ? -.1 : .4, tilt: ph === 1 ? .1 : .02, noLegs: true, armL: [470, 1180], armR: take > 0 ? [fp[0] - 30, fp[1] + 60] : [850, 1180], bendL: -.5, bendR: .5, stretch: true, glowOn: [D.red, .2], glowSide: 1, t });
    babyD(640, 1004, 250, { rot: -.12 + Math.sin(L * 2) * .02 });
    const ret = eio(seg(L, tk + .3, tk + .9));
    devArm([[dv.shL[0] - 10, dv.shL[1] + 60], [lerp(1400, 1500, ret), lerp(900, 980, ret)], [lerp(f0[0] + 70, 1470, ret), lerp(f0[1] + 50, 900, ret)]], [84, 78, 68]);
    flaskD(fp[0], fp[1], 150, lerp(.25, -.1, take));
    if (take > .5) { taper([[fp[0] - 150, fp[1] + 150], [fp[0] - 70, fp[1] + 80], [fp[0] - 6, fp[1] + 50]], [116, 110, 98], rgba(D.line)); taper([[fp[0] - 150, fp[1] + 150], [fp[0] - 70, fp[1] + 80], [fp[0] - 8, fp[1] + 50]], [104, 98, 86], rgba(D.cream)); }
  });
  red('you earned it.', 1390, 190, 76, L, c('earned'), .9);
});
shot('drink31', 'a34', 'AGE: 31', (L, u, t, c) => {
  const fl = c('flare31'), pp = c('pop31'), popped = L >= pp, pop = eback(seg(L, pp, pp + .4)), flare = flareK(L, fl - .2, pp + .25), shake = popped ? Math.sin((L - pp) * 46) * 14 * (1 - seg(L, pp, pp + .6)) : 0;
  const dk = eo(seg(L, .05, .4)) * (1 - eio(seg(L, pp + .15, pp + .6)));
  camD(1.1 * push(u, .04), 1000 + shake, 540, () => {
    stageD(860, { pool: [860, 520, 760, [170, 190, 255], .12] }); nurseryD(t);
    stoolD(popped ? 1250 : 1090, 860, popped ? eo(seg(L, pp, pp + .35)) * 1.45 : 0);
    const h = popped ? lerp(272, 474, pop) : 272 * (1 + .06 * flare), st = popped ? lerp(2, 3, eo(seg(L, pp, pp + .25))) : 2;
    const dv = figure({ kind: 'devil', x: 1090, y: popped ? 860 : 700, h, stage: st, expr: popped ? devEx('charm', L, []) : L > fl ? { ...DX.happy, h: 1.35 } : devEx('sweet', L, [.5]), look: [-.8, .3], lean: popped ? -.06 : -.2, tilt: -.1, noArms: popped, tail: [.4 + .06 * Math.sin(t * (popped ? 7 : 2.4)), -.26], heat: .8 + 2.4 * flare, t });
    const sam = figure({ kind: 'sam', x: 880, y: 860, h: 450, expr: dk > .3 ? { ...FX.tired, lid: .92 } : 'tired', look: [.2, .6], tilt: -.34 * dk, headDx: -.25 * dk, armL: [828, 742], armR: dk > .05 ? [lerp(946, 968, dk), lerp(738, 560, dk)] : [946, 738], bendL: -.6, bendR: .6, glowOn: [D.red, .12 + .3 * flare], glowSide: 1, t });
    babyD(sam.sx - 24, sam.shY + 136, 66, { rot: -.16, awake: popped && L > pp + .2 });
    flaskD(lerp(960, 942, dk), lerp(700, 512, dk), 56, lerp(0, -2.2, dk));
    if (popped) { devArm([[dv.shL[0], dv.shL[1] + 10], [lerp(dv.shL[0], 990, pop), dv.shL[1] + 30 - 40 * pop], [sam.shR[0] + 14, sam.shR[1] + 6]], [34, 32, 36], 22); devArm([[dv.shR[0], dv.shR[1] + 10], [dv.shR[0] + 30, dv.shR[1] + 90], [dv.shR[0] + 24, dv.shR[1] + 160]], [34, 32, 30], 22); }
    burp(L, pp - .25, dv.head[0] - 20, dv.head[1] - dv.hr * 1.6, .8); popRing(L, pp, dv.hip[0], dv.hip[1] - h * .4, 80, 520);
  });
  popFlash(L, pp);
});
// ---- 33.5-44.3 AGE 34: it is his size, in his tie ----
const TIE = [86, 120, 138];
shot('a34', 'bar34', 'AGE: 34', (L, u, t, c) => {
  say('it wore his tie.', 1200, 300, 66, L, c('capTie'), .6);
  camD(push(u, .04), 960, 560, () => {
    stageD(860, { pool: [900, 520, 760, [255, 216, 170], .13] });
    stroke([[250, 860], [250, 300]], 9, rgba(D.prop)); curve([[250, 300], [258, 236], [340, 226]], 9, rgba(D.prop)); outlined(() => poly([[320, 216], [400, 216], [420, 250], [300, 250]]), rgba(D.prop), 4); cone(360, 250, 50, 330, 610, [255, 222, 166], .17); glow([255, 226, 170], 360, 256, 90, .6);
    const ph = L * TAU * 1.75, st = Math.sin(ph), bob = Math.abs(Math.cos(ph)) * .014, x = 800 + L * 125;
    for (const [dx, kind] of [[-215, 'devil'], [0, 'sam']]) { const X = x + dx, dev = kind === 'devil';
      const f = figure({ kind, x: X, y: 860, h: dev ? 468 : 450, stage: 3, stride: st, drop: bob, lean: .05, expr: dev ? devEx('charm', L, [1.2]) : samEx('tired', L, [.7]), look: dev ? [.8, 0] : [.5, .4], armL: [X - 57 + st * 55, dev ? 730 : 736], armR: [X + 57 - st * 55, dev ? 730 : 736], tail: [-.36, -.2 + .05 * Math.sin(ph)], heat: .8, t });
      tieD(f, dev ? D.ember : TIE); }
  });
});
shot('bar34', 'dinner', 'AGE: 34', (L, u, t, c) => {
  const p0 = c('pour34'), pour = seg(L, p0, p0 + 1.5), pouring = L > p0 && L < p0 + 1.5, tipK = eo(seg(L, p0 - .3, p0)) * (1 - eio(seg(L, p0 + 1.5, p0 + 1.9)));
  camD(push(u), 960, 560, () => {
    stageD(0, {});
    for (let r = 0; r < 2; r++) { stroke([[240, 300 + r * 190], [1680, 300 + r * 190]], 4, rgba(D.floor, .8));
      for (let i = 0; i < 12; i++) { const x = 300 + i * 118 + r * 40, hh = 110 + rnd(i * 3 + r) * 40; bottleD(x, 298 + r * 190, hh, { col: [[70, 130, 110], [150, 100, 50], [90, 100, 140]][(i + r) % 3], alpha: .22, fill: .3 + rnd(i) * .5, lineCol: [90, 100, 110] }); } }
    lampD(900, 150, 900);
    const cy = 860;
    const dv = figure({ kind: 'devil', x: 1150, y: 1290, h: 1080, stage: 3, expr: devEx('charm', L, [1.35]), look: [-.9, .2], lean: -.12, tilt: -.12 + Math.sin(L * 1.6) * .02, noLegs: true, noArms: true, noTail: true, noBelly: true, t });
    tieD(dv, D.ember, .16);
    const sam = figure({ kind: 'sam', x: 700, y: 1260, h: 1020, expr: samEx('tempted', L, [.95]), look: [.5, .9], turn: .3, tilt: .04 + pour * .03, noLegs: true, noArms: true, glowOn: [D.red, .3], glowSide: 1, t });
    tieD(sam, TIE, .16);
    devArm([[dv.shL[0] + 30, dv.shL[1] + 20], [sam.sx + 40, sam.shY - 10], [sam.shL[0] - 30, sam.shL[1] + 90]], [84, 82, 76]);
    if (pouring) stroke([[944, 672], [916 + Math.sin(t * 30) * 2, 720], [900, cy - 20]], 8, rgba(D.amber));
    at(1210, 606, 1, lerp(-1.3, -1.826, tipK), () => bottleD(0, 0, 280, { fill: lerp(.6, .3, pour), col: [40, 110, 84], alpha: .85 }));
    devArm([[dv.shR[0] + 10, dv.shR[1] + 40], [1420, 760], [1196, 640]], [84, 82, 76]);
    rectf(0, cy, W, H - cy, rgba([16, 13, 14])); stroke([[0, cy], [W, cy]], 5, rgba(D.wood)); additive(() => { ctx.save(); ctx.translate(900, cy + 8); ctx.scale(1, .08); glow([255, 210, 150], 0, 0, 760, .3); ctx.restore(); });
    glassD(890, cy - 2, 170, lerp(.06, .62, pour));
  });
  red('one more.', 1480, 985, 76, L, p0 + .5, .6);
});
// dinner: it sits between him and his family. o: paper (0..1 held up), chin (0..1), samTurn, samLook, samEx, devH, devStage, devEx, devLook, heat, wifeEx, lilyEx, lilyLook, jolt, talk
function dinnerD(t, o) {
  stageD(0, {}); lampD(600, 130, 760);
  const TY = 690, jolt = o.jolt || 0;
  const wife = figure({ kind: 'sam', x: 430, y: 850, h: 430, expr: o.wifeEx, look: o.wifeLook || [.9, 0], turn: .3, bun: 1, lash: true, noLegs: true, seed: 5, t });
  const up = o.paper || 0, py = lerp(720, 548, up);
  const lily = figure({ kind: 'lily', x: 650, y: 772, h: 250, expr: o.lilyEx, look: o.lilyLook || [.9, -.3], turn: .4, noLegs: true, armL: up > .02 ? [748, py + 56] : undefined, armR: up > .02 ? [806, py + 56] : undefined, bendL: .3, bendR: .3, stretch: true, t });
  if (up > .02) at(782, py, 64, .08, () => { outlined(() => { ctx.beginPath(); ctx.rect(-1, -.72, 2, 1.44); }, rgba([238, 234, 222]), .04); ctx.lineWidth = .1; ctx.strokeStyle = rgba(D.yellow); ctx.beginPath(); ctx.arc(-.4, -.2, .22, 0, TAU); ctx.stroke(); curve([[-.1, .4], [.2, 0], [.5, .4]], .1, rgba([225, 40, 30]), .5); curve([[.1, .4], [.3, .12], [.6, .4]], .1, rgba([60, 150, 90]), .5); });
  const dh = o.devH || 500, dv = figure({ kind: 'devil', x: 1010 + (o.shake || 0), y: 862 + jolt, h: dh, stage: o.devStage ?? 3, expr: o.devEx, look: o.devLook || [-.8, .1], tilt: o.devTilt ?? -.06, noLegs: true, noTail: true, armL: o.talk ? [880, 560 + Math.sin(t * 7) * 30] : undefined, bendL: .5, heat: o.heat ?? .8, noArms: !!o.noDevArms, t });
  tieD(dv, D.ember);
  const sam = figure({ kind: 'sam', x: 1390, y: 862, h: 450, expr: o.samEx, look: o.samLook, turn: o.samTurn, tilt: .1, lean: .08, noLegs: true, glowOn: [D.red, .22 + .3 * ((o.heat ?? .8) - .8) / 2.4], glowSide: -1, t });
  tieD(sam, TIE);
  if (o.chin > 0) { const k = o.chin, tx = lerp(dv.shR[0] + 60, sam.head[0] - sam.hr * .5, k), ty = lerp(dv.shR[1] + 120, sam.head[1] + sam.hr * .86, k); devArm([[dv.shR[0], dv.shR[1] + 10], [lerp(dv.shR[0] + 40, 1210, k), dv.shR[1] + 90], [tx, ty]], [36, 34, 30], 22); }
  // the table, its cloth, the things on it
  outlined(() => { ctx.beginPath(); ctx.rect(250, TY, 1420, 250); }, rgba([44, 46, 60]), 5); outlined(() => { ctx.beginPath(); ctx.rect(230, TY - 14, 1460, 28); }, rgba(D.wood), 5);
  additive(() => { ctx.save(); ctx.translate(600, TY - 8); ctx.scale(1, .06); glow([255, 214, 160], 0, 0, 520, .5); ctx.restore(); });
  for (const x of [440, 650, 1010]) outlined(() => { ctx.beginPath(); ctx.ellipse(x, TY - 20 - (x === 1010 ? jolt * 1.5 : 0), 62, 10, 0, 0, TAU); }, rgba([210, 206, 196]), 3.5);
  glassD(1290, TY - 16 - Math.abs(jolt) * 2.5, 96, .55);
  return { dv, sam, lily, wife, TY };
}
shot('dinner', 'swell34', 'AGE: 34', (L, u, t, c) => {
  const up = eo(seg(L, c('drawUp') - .1, c('drawUp') + .35)) * (1 - eio(seg(L, c('drawDown'), c('drawDown') + .5))), ch = c('chin'), chin = eo(seg(L, ch - .25, ch)) * (1 - eio(seg(L, ch + .9, ch + 1.3)));
  const turned = L > c('drawUp') + .35 && L < ch, after = L >= ch, talk = L > c('illTalk');
  camD(push(u, .04), 960, 560, () => dinnerD(t, { paper: up, chin, samTurn: turned ? -.5 : after ? .25 : .1, samLook: turned ? [-.9, -.1] : [-.3, .9], samEx: turned ? samEx('smile', L, []) : samEx('tired', L, [.3, 3.4]),
    devEx: talk && Math.sin(L * 15) > 0 ? { ...DX.charm, m: 'open' } : devEx('charm', L, [1.0]), devLook: after ? [-.8, .1] : [.5, .2], devTilt: after ? -.1 : .04, talk,
    wifeEx: after ? 'sad' : 'calm', wifeLook: [.9, .1], lilyEx: L < ch + .3 ? 'smile' : 'sad', lilyLook: L < ch + .3 ? [.9, -.3] : [.3, .8] }));
  red('i’ll talk. you rest.', 1290, 160, 76, L, c('illTalk'), 1.0);
});
shot('swell34', 'a38', 'AGE: 34', (L, u, t, c) => {
  const fl = c('flare34'), pp = c('pop34'), ck = c('creak'), popped = L >= pp, pop = eback(seg(L, pp, pp + .45)), flare = flareK(L, fl - .25, pp + .25), drop = L >= ck ? eo(seg(L, ck, ck + .12)) : 0;
  const shake = (popped ? Math.sin((L - pp) * 46) * 16 * (1 - seg(L, pp, pp + .6)) : 0) + (L >= ck ? Math.sin((L - ck) * 50) * 12 * (1 - seg(L, ck, ck + .4)) : 0);
  camD(lerp(1.22, 1.0, eio(seg(L, pp - .15, pp + .5))), 1040, lerp(540, 560, eio(seg(L, pp - .15, pp + .5))) + shake * .5, () => {
    const d = dinnerD(t, { paper: 0, chin: 0, samTurn: popped ? -.45 : .2, samLook: popped ? [-.8, -.8] : [-.3, .9], samEx: popped ? { ...FX.fear, bags: true } : 'tired',
      devH: (popped ? lerp(500, 800, pop) : 500 * (1 + .05 * flare)), devStage: popped ? lerp(3, 3.6, eo(seg(L, pp, pp + .3))) : 3, devEx: !popped ? (L > fl ? { ...DX.happy, h: 1.35 } : devEx('charm', L, [])) : devEx('grin', L, []), devLook: popped ? [.7, .5] : [0, .3], devTilt: popped ? .08 : 0,
      heat: .8 + 2.4 * flare, wifeEx: popped ? 'fear' : 'sad', wifeLook: popped ? [.9, -.6] : [.9, .1], lilyEx: popped ? 'fear' : 'sad', lilyLook: popped ? [.9, -.8] : [.3, .8], jolt: drop * 30, shake });
    burp(L, pp - .28, d.dv.head[0], d.dv.head[1] - d.dv.hr * 1.7, 1.2); popRing(L, pp, 1010, 600, 140, 700);
    if (L >= ck) { sparks(L, ck, 880, 690, 9, 420, D.wood); sparks(L, ck, 1140, 690, 9, 420, D.wood); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) stroke([[1010 + sd * (150 + i * 16), 690 - 40 - i * 26], [1010 + sd * (190 + i * 30), 690 - 70 - i * 44]], 5, rgba(D.white, 1 - seg(L, ck, ck + .45))); }
  });
  popFlash(L, pp, .3);
});
// ---- 44.3-58.5 AGE 38: Lily's 6th birthday ----
function partyD(t) {
  for (let i = 0; i < 13; i++) { const x = 90 + i * 104, y = 84 + Math.sin(i / 12 * Math.PI) * 50; outlined(() => poly([[x, y], [x + 70, y + 4], [x + 35, y + 80]]), rgba([[70, 150, 170], [190, 90, 120], [220, 216, 206], [110, 100, 180]][i % 4]), 3.5); }
  curve([[70, 80], [720, 142], [1450, 86]], 3, rgba(D.floor), .5);
  for (const [x, y, cc, ph] of [[96, 500, [70, 150, 170], 0], [400, 430, [190, 90, 120], 1.7]]) { const sw = Math.sin(t * .9 + ph) * 8; stroke([[x + sw, y + 62], [x + 8, 900]], 2.5, rgba(D.floor)); outlined(() => { ctx.beginPath(); ctx.ellipse(x + sw, y, 50, 62, 0, 0, TAU); }, rgba(cc), 3.5); oval(x + sw - 16, y - 22, 10, 16, 'rgba(255,255,255,.35)'); }
}
function ptableD(ty, redK = 1) { outlined(() => { ctx.beginPath(); ctx.rect(440, ty, 1560, 36); }, rgba(D.wood), 5); outlined(() => { ctx.beginPath(); ctx.rect(490, ty + 36, 34, 100); }, rgba(mix(D.wood, D.stage, .3)), 5);
  if (redK) additive(() => { ctx.save(); ctx.translate(1120, ty + 6); ctx.scale(1, .07); glow(D.red, 0, 0, 700, .5 * redK); ctx.restore(); }); }
function cakeD(cx, ty, t, lean = 0, lit = 1) { outlined(() => { ctx.beginPath(); ctx.rect(cx - 140, ty - 92, 280, 92); }, rgba(D.white), 5);
  for (let i = 0; i < 8; i++) blob([[cx - 140 + i * 36, ty - 92], [cx - 122 + i * 36, ty - 62 - (i % 3) * 7], [cx - 104 + i * 36, ty - 92]], rgba([226, 120, 150]), .5);
  for (let i = 0; i < 6; i++) { const x = cx - 100 + i * 40, y = ty - 96; outlined(() => { ctx.beginPath(); ctx.rect(x - 5, y - 44, 10, 44); }, rgba([[90, 170, 190], [230, 226, 216]][i % 2]), 2.5);
    if (lit > 0) { const fl = 1 + .18 * Math.sin(t * 19 + i * 2.1), lx = lean * 26 + Math.sin(t * 11 + i) * 2.5; glow([255, 200, 120], x, y - 60, 46 * lit, .8 * lit); blob([[x, y - 46], [x + 9 * lit, y - 58], [x - 3 + lx, y - 58 - 26 * fl * lit], [x - 9 * lit, y - 58]], rgba(D.hot), .5); } } }
const GIANT = { kind: 'devil', x: 1480, y: 1240, h: 1230, stage: 4, noLegs: true, noArms: true, noTail: true, hat: [.86, -1.9, .9, .5] };
function tinySam(x, y, o) { const f = figure({ kind: 'sam', x, y, h: 165, lw: .02, ...o }); tieD(f, TIE); return f; }
shot('a38', 'claws', 'AGE: 38', (L, u, t, c) => {
  say('it took his chair.', 760, 330, 66, L, c('capChair'), .6);
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14] }); partyD(t);
    const ty = 770, sway = Math.sin(L * 1.3) * .025;
    const g = figure({ ...GIANT, expr: devEx('grin', L, [1.5]), look: [-.9, .8], lean: -.3 + sway, tilt: -.3 + sway, headDx: -.1, headDy: .74, t });
    ptableD(ty);
    devArm([[g.shL[0] - 30, g.shL[1] + 60], [900, 570], [940, ty - 46]], [150, 130, 104], 50); devArm([[g.shR[0] + 20, g.shR[1] + 80], [1800, 640], [1560, ty - 44]], [150, 130, 104], 50);
    cakeD(1130, ty, t);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150] });
    tinySam(760 + Math.sin(t * 43) * 1.5, ty - 4, { expr: 'fear', look: [.9, -.8], t });
    figure({ kind: 'lily', x: 250, y: 900, h: 300, expr: 'fear', look: [.9, -.8], turn: .5, tilt: -.1, armL: [232, 742], armR: [270, 740], bendL: .5, bendR: -.5, glowOn: [D.red, .35], glowSide: 1, t });
  });
});
shot('claws', 'lean38', 'AGE: 38', (L, u, t, c) => {
  const pin = c('pinch'), inb = c('inBottle'), ck = c('cork38'), ty = 770, bx = 560, top = ty - 290;
  const reach = eo(seg(L, 0, pin)), lift = eio(seg(L, pin + .05, pin + .45)), over = eio(seg(L, pin + .4, pin + .8)), down = eio(seg(L, pin + .8, inb)), held = L > pin && L < inb, rel = eo(seg(L, inb, inb + .4));
  const sx = lerp(760, bx, over), sy = lerp(lerp(ty - 4, 462, lift), ty - 8, down), isIn = L >= inb;
  camD(lerp(1.4, 1.5, u), 790, 500, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14] }); partyD(t);
    figure({ ...GIANT, expr: devEx('grin', L, []), look: [-.9, .8], lean: -.3, tilt: -.3, headDx: -.1, headDy: .62, t });
    ptableD(ty); cakeD(1130, ty, t);
    const pound = isIn && L > ck + .1 ? Math.sin(L * 26) : 0;
    const sam = inBottle => tinySam(sx + (held ? Math.sin(t * 30) * 3 : 0), sy, { expr: L < pin ? 'fear' : 'horror', look: isIn ? [.6, -.6] : [.9, -.8], t,
      armL: held ? [sx - 60, sy - 150 + Math.sin(t * 22) * 22] : isIn ? [sx - 42, sy - 118 + (pound > 0 ? -10 : 8)] : undefined, armR: held ? [sx + 60, sy - 150 - Math.sin(t * 22) * 22] : isIn ? [sx + 42, sy - 118 + (pound < 0 ? -10 : 8)] : undefined, bendL: .4, bendR: -.4, stride: held ? Math.sin(t * 20) * .7 : 0 });
    if (sy <= top) { bottleD(bx, ty, 290, { alpha: .2, col: [120, 170, 150] }); sam(); }
    else { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, top); ctx.clip(); sam(); ctx.restore(); bottleD(bx, ty, 290, { alpha: .2, col: [120, 170, 150], cork: L >= ck, inside: () => sam() }); }
    // two claws pinch him by the shoulders
    const cx = held ? sx : lerp(lerp(1150, 760, reach), 1100, rel), cy = held ? sy - 120 : lerp(lerp(230, ty - 124, reach), 150, rel);
    for (const sd of [-1, 1]) devArm([[1560 + sd * 70, 120], [cx + 230 + sd * 60, cy - 190], [cx + sd * (held ? 30 : lerp(70, 34, reach)), cy]], [64, 46, 22], 24);
    // and a thumb pushes the cork home
    if (L > inb + .1) { const k = eo(seg(L, inb + .15, ck)), up = eio(seg(L, ck + .1, ck + .5)), cyk = lerp(180, top - 21, k);
      if (L < ck) outlined(() => { ctx.beginPath(); ctx.rect(bx - 16, cyk - 13, 32, 26); }, rgba([186, 140, 96]), 2.5);
      devArm([[1500, 60], [bx + 260, lerp(cyk - 260, 40, up)], [bx + 6, lerp(cyk - 24, 120, up)]], [64, 50, 34], 24); }
  });
});
const LEAN38 = (L, u, t, c) => {
  const sl = c('cantSee'), k = eio(seg(L, 0, .75)), shake = L >= sl ? Math.sin((L - sl) * 50) * 16 * (1 - seg(L, sl, sl + .5)) : 0, ty = 770;
  camD(push(u, .06), 900 + shake, 560 + shake * .5, () => {
    stageD(900, { pool: [760, 520, 760, [255, 214, 160], .14 * (1 - .5 * k)] }); partyD(t);
    const g = figure({ ...GIANT, expr: L >= sl ? 'rage' : devEx('grin', L, []), look: [-.95, .7], lean: lerp(-.3, -.5, k), tilt: lerp(-.3, -.46, k), headDx: lerp(-.1, -.75, k), headDy: lerp(.62, 1.0, k), heat: 1 + k, t });
    ptableD(ty, 1 + k);
    devArm([[g.shL[0] - 30, g.shL[1] + 60], [lerp(900, 800, k), 570], [lerp(940, 820, k), ty - 46]], [150, 130, 104], 50); devArm([[g.shR[0] + 20, g.shR[1] + 80], [1800, 640], [1560, ty - 44]], [150, 130, 104], 50);
    cakeD(1130, ty, t, -1.6 * k, 1 - .45 * k);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150], cork: true, inside: () => tinySam(560, ty - 8, { expr: 'horror', look: [-.7, -.2], armL: [518, ty - 126 + (Math.sin(L * 26) > 0 ? -10 : 8)], armR: [602, ty - 126 + (Math.sin(L * 26) < 0 ? -10 : 8)], bendL: .4, bendR: -.4, t }) });
    figure({ kind: 'lily', x: 250 - 14 * k, y: 900, h: 300, expr: 'fear', look: [.9, -.8], turn: .5, tilt: -.1 - .06 * k, lean: -.08 * k, armL: [232, 742], armR: [270, 740], bendL: .5, bendR: -.5, glowOn: [D.red, .35 + .25 * k], glowSide: 1, t });
  });
  if (!HOOK) slam('THEY CAN’T SEE ME.', 800, 992, 96, L, sl);
  popFlash(L, sl, .22);
};
shot('lean38', 'truth', 'AGE: 38', LEAN38);
// the same picture, as his family sees it
shot('truth', 'fridge', 'AGE: 38', (L, u, t, c) => {
  const lv = c('leave'), go = eio(seg(L, lv, lv + 1.9)), wIn = eo(seg(L, .15, 1.0)), ty = 770;
  camD(push(u, .04), 900, 560, () => {
    stageD(900, { pool: [900, 520, 800, [196, 208, 232], .1] }); partyD(t);
    chairD(1500, 900, 300, 1);
    const dad = figure({ kind: 'sam', x: 1450, y: 792, h: 520, sit: -1, drop: .25, expr: { ...FX.tired, lid: L > 2.6 ? .8 : .6, m: 'down' }, look: [-.6, .8], lean: -.16, tilt: -.26 + Math.sin(L * 1.1) * .02, armL: [1262, 700], bendL: -.3, stretch: true, t });
    tieD(dad, TIE); for (const sd of [-1, 1]) oval(dad.head[0] + sd * dad.hr * .36 - dad.hr * .16, dad.head[1] + dad.hr * .16, dad.hr * .2, dad.hr * .09, rgba([226, 110, 110], .5), -.26);
    hatD(dad.head[0] + dad.hr * .34, dad.head[1] - dad.hr * .84, dad.hr * 1.15, .42);
    ptableD(ty, 0);
    bottleD(560, ty, 290, { alpha: .2, col: [120, 170, 150] });
    bottleD(1250, ty, 250, { fill: .12, col: [40, 110, 84], alpha: .85 }); taper([[1200, 690], [1250, 672], [1296, 690]], [50, 52, 46], rgba(D.line)); taper([[1204, 690], [1250, 674], [1292, 690]], [38, 40, 34], rgba(D.cream));
    // the cake, knocked over
    blob([[820, ty], [900, ty - 30], [1010, ty - 16], [1100, ty - 34], [1180, ty]], rgba([226, 120, 150]), .5);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ty); ctx.clip(); at(1010, ty + 34, 1, -.42, () => { outlined(() => { ctx.beginPath(); ctx.rect(-140, -92, 280, 92); }, rgba(D.white), 5); for (let i = 0; i < 8; i++) blob([[-140 + i * 36, -92], [-122 + i * 36, -62 - (i % 3) * 7], [-104 + i * 36, -92]], rgba([226, 120, 150]), .5); }); ctx.restore();
    for (const [x, r] of [[790, .3], [860, 1.4], [1160, -.5], [730, 1.7]]) at(x, ty - 6, 1, r, () => outlined(() => { ctx.beginPath(); ctx.rect(-5, -44, 10, 44); }, rgba([90, 170, 190]), 2.5));
    const wx = lerp(-140, 150, wIn) - go * 560, lx = 290 - go * 560;
    figure({ kind: 'sam', x: wx, y: 900, h: 430, expr: 'sad', look: [.9, 0], turn: go > .05 ? -.4 : .4, bun: 1, lash: true, armR: wIn > .85 ? [lx - 40, 760] : undefined, bendR: -.3, stride: go > 0 && go < 1 ? Math.sin(L * 9) * .7 : 0, seed: 5, stretch: true, t });
    figure({ kind: 'lily', x: lx, y: 900, h: 300, expr: go > .1 ? 'sad' : 'fear', look: [.9, -.4], turn: .5, tilt: -.06, stride: go > 0 && go < 1 ? Math.sin(L * 11) * .7 : 0, t });
  });
  red('THEY ONLY SEE YOU.', 800, 992, 92, L, c('onlyYou'), 1.1);
});
// her drawing on the fridge
shot('fridge', 'inside', 'AGE: 38', (L, u, t, c) => {
  camD(lerp(1, 1.24, eio(u)), 960, 560, () => {
    outlined(() => { ctx.beginPath(); ctx.rect(330, -60, 1260, 1260); }, rgba([50, 56, 72]), 6); stroke([[330, 150], [1590, 150]], 6, rgba(D.line)); outlined(() => { ctx.beginPath(); ctx.roundRect(400, 260, 30, 440, 12); }, rgba([120, 130, 152]), 4);
    glow([200, 212, 236], 960, 560, 760, .13);
    drawingD(980, 580, 330, -.045, true); disc(980, 366, 26, rgba(D.line)); disc(980, 366, 20, rgba([200, 60, 60])); disc(974, 360, 6, 'rgba(255,255,255,.5)');
    at(1390, 300, 1, .1, () => outlined(() => { ctx.beginPath(); ctx.rect(-70, -50, 140, 100); }, rgba([210, 200, 150]), 4));
  });
});
// ---- 58.5-67.3 the turn ----
// from inside the bottle: the glass, its green, the room beyond; fn draws him
function insideGlassD(t, crack = 0, drawK = .4) {
  rectf(-400, -400, W + 800, H + 800, rgba([10, 16, 15])); additive(() => { glow(D.red, 1760, 300, 700, .22); glow([200, 212, 236], 1500, 420, 520, .12); });
  ctx.save(); ctx.globalAlpha = drawK; drawingD(1450, 400, 270, .06, true); ctx.restore();
}
function glassFrontD(t, cracks, seedX = 900, seedY = 620) {
  rectf(-400, -400, W + 800, H + 800, rgba([70, 150, 120], .1));
  for (const [x, w, a] of [[250, 70, .16], [360, 22, .1], [1640, 46, .12]]) { ctx.fillStyle = lg(x, 0, x + w, 0, [[0, D.white, 0], [.5, D.white, a], [1, D.white, 0]]); ctx.fillRect(x, -400, w, H + 800); }
  for (const sd of [-1, 1]) curve([[960 + sd * 900, -300], [960 + sd * 930, 540], [960 + sd * 900, 1400]], 16, rgba([150, 210, 190], .5), .5);
  if (cracks > 0) for (let i = 0; i < 11; i++) { const a = rnd(i * 3.7) * TAU, len = (120 + rnd(i * 5.1) * 520) * cracks, mid = [seedX + Math.cos(a) * len * .5 + (rnd(i) - .5) * 60 * cracks, seedY + Math.sin(a) * len * .5 + (rnd(i * 2) - .5) * 60 * cracks];
    stroke([[seedX, seedY], mid, [seedX + Math.cos(a) * len, seedY + Math.sin(a) * len]], 5, rgba(D.white, .85)); if (i % 3 === 0) stroke([mid, [mid[0] + Math.cos(a + 1) * len * .3, mid[1] + Math.sin(a + 1) * len * .3]], 3.5, rgba(D.white, .7)); }
}
function palmD(x, y, s = 1) { oval(x, y, 78 * s, 92 * s, rgba(D.line)); oval(x, y, 66 * s, 80 * s, rgba(D.cream)); oval(x, y, 44 * s, 56 * s, rgba(lighten(D.cream, .5), .7)); }
shot('inside', 'pound', 'AGE: 38', (L, u, t, c) => {
  camD(push(u, .07), 960, 540, () => {
    insideGlassD(t, 0, .75);
    const ex = L < .8 ? samEx('horror', L, []) : L < 1.5 ? { ...FX.sad, lid: .1 } : 'resolve';
    const f = figure({ kind: 'sam', x: 860, y: 1900, h: 1700, expr: ex, look: [.85, -.25], turn: .3, tilt: .03, noLegs: true, noArms: true, t }); tieD(f, TIE, .14);
    if (L > .7 && L < 1.7) { const k = seg(L, .7, 1.2); for (const sd of [-1, 1]) { const x = f.head[0] + sd * f.hr * .36 + f.hr * .1, y = f.head[1] + f.hr * .2; blob([[x, y], [x + 16 * k, y + 30 * k], [x, y + 54 * k], [x - 16 * k, y + 30 * k]], rgba([150, 200, 240], .9), .5); } }
    palmD(430, 800); palmD(1300, 840);
    glassFrontD(t, 0);
  });
});
shot('pound', 'floor', 'AGE: 38', (L, u, t, c) => {
  const P = [c('pound1'), c('pound2'), c('pound3')], hit = blinkAt(L, P, .1), n = P.filter(p => L >= p).length, tp = c('tip'), sm = c('smash'), roll = eio(seg(L, tp, sm)) * .5;
  const sh = P.reduce((a, p) => a + (L >= p ? Math.sin((L - p) * 60) * 22 * (1 - seg(L, p, p + .25)) : 0), 0);
  if (L >= sm) { const k = seg(L, sm, sm + .2); rectf(0, 0, W, H, rgba(D.white, 1 - k * .9));
    for (let i = 0; i < 26; i++) { const a = rnd(i * 2.3) * TAU, d = 120 + k * (500 + rnd(i * 4.1) * 900), x = 960 + Math.cos(a) * d, y = 540 + Math.sin(a) * d, s = 30 + rnd(i * 6.7) * 70; at(x, y, s, a + k * 4, () => poly([[-1, -.4], [.9, -.7], [.2, 1]], rgba([150, 210, 190], .9 - k * .5))); }
    return; }
  ctx.save(); ctx.translate(960, 540); ctx.rotate(roll); ctx.translate(-960, -540);
  camD(1.07 + .05 * hit + roll * .5, 960 + sh, 540 + sh * .4, () => {
    insideGlassD(t, 0, .75);
    const pr = n % 2;   // which fist
    const f = figure({ kind: 'sam', x: 860, y: 1900, h: 1700, expr: L > tp ? 'strain' : hit > .2 ? 'strain' : 'resolve', look: [.6, -.1], turn: .3, tilt: .03 - hit * .05, noLegs: true, noArms: true, t }); tieD(f, TIE, .14);
    palmD(430, 800 - (pr === 1 ? hit * 40 : 0), 1 + (pr === 1 ? hit * .18 : 0)); palmD(1300, 840 - (pr === 0 ? hit * 40 : 0), 1 + (pr === 0 ? hit * .18 : 0));
    glassFrontD(t, n === 0 ? 0 : n === 1 ? .12 : n === 2 ? .3 : lerp(.6, 1, seg(L, P[2], sm)), 1180, 700);
  });
  ctx.restore();
});
// the kitchen: a counter with a sink on the left
function kitchenD(t) { outlined(() => { ctx.beginPath(); ctx.rect(120, 640, 560, 260); }, rgba([44, 46, 60]), 5); outlined(() => { ctx.beginPath(); ctx.rect(100, 622, 600, 26); }, rgba(D.wood), 5);
  outlined(() => { ctx.beginPath(); ctx.rect(330, 600, 250, 24); }, rgba([128, 138, 160]), 4); curve([[560, 600], [560, 500], [500, 470], [460, 500]], 16, rgba(D.line), .5); curve([[560, 600], [560, 500], [500, 470], [460, 500]], 9, rgba([128, 138, 160]), .5); }
const giantUp = (L, t, o) => figure({ kind: 'devil', x: 1430, y: 1330, h: 1180, stage: 4, noLegs: true, noArms: true, noTail: true, hat: [.86, -1.9, .9, .5], t, ...o });
shot('floor', 'sink', 'AGE: 38', (L, u, t, c) => {
  const st = c('stand'), up = eio(seg(L, st - .3, st + .25));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [760, 560, 700, [200, 212, 236], .1] }); kitchenD(t);
    bottleD(250, 622, 230, { fill: .5, col: [40, 110, 84], alpha: .85 });
    const g = giantUp(L, t, { expr: devEx('grin', L, [.9]), look: [-.9, .9], lean: -.14, tilt: -.16 + Math.sin(L * 1.2) * .02 });
    devArm([[g.shL[0] - 20, g.shL[1] + 60], [1100, 640], [1140, 860]], [150, 130, 104], 50);
    for (let i = 0; i < 16; i++) { const x = 600 + rnd(i * 3.3) * 620, s = 10 + rnd(i * 5.1) * 22; at(x, 896, s, rnd(i) * 3, () => poly([[-1, 0], [.8, -.5], [.3, .2]], rgba([150, 210, 190], .8))); }
    const f = up < .5 ? figure({ kind: 'sam', x: 860, y: 900, h: 450, kneel: 1, lean: .5, expr: 'strain', look: [0, .9], armL: [880, 892], armR: [960, 892], bendL: -.2, bendR: .2, stretch: true, drop: .2, glowOn: [D.red, .25], glowSide: 1, t })
      : figure({ kind: 'sam', x: 860, y: 900, h: 450, expr: 'resolve', look: L > st + .45 ? [-.9, 0] : [.8, -.9], turn: L > st + .45 ? -.4 : .3, drop: lerp(.2, 0, seg(up, .5, 1)), glowOn: [D.red, .25], glowSide: 1, t });
    tieD(f, TIE);
  });
});
shot('sink', 'day1', 'AGE: 38', (L, u, t, c) => {
  say('he stopped feeding it.', 560, 170, 66, L, c('capStop'), .7);
  const g0 = c('glug'), g1 = c('glugEnd'), fz = c('flinch'), af = c('afraid'), pour = seg(L, g0, g1), pouring = L > g0 && L < g1, tipK = eo(seg(L, g0 - .35, g0));
  const shr = eo(seg(L, fz, fz + .25)) * .06 + eo(seg(L, fz + .5, fz + .75)) * .05 + eo(seg(L, af - .2, af + .1)) * .05, rec = eo(seg(L, fz, fz + .2)), scared = L >= af - .1;
  const sh = L >= fz ? Math.sin((L - fz) * 44) * 10 * (1 - seg(L, fz, fz + .5)) : 0;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [600, 560, 700, [200, 212, 236], .12] }); kitchenD(t);
    const g = giantUp(L, t, { h: 1180 * (1 - shr), x: 1430 + sh + rec * 50, expr: L < fz ? devEx('grin', L, []) : scared ? { ...DX.plead, pup: .6 } : { ...DX.rage, m: 'frown' }, look: scared ? [-.3, .6] : [-.9, .6], lean: -.14 + rec * .22, tilt: -.16 + rec * .2, heat: 1 - shr * 6 });
    if (scared) { const k = eo(seg(L, af - .1, af + .3)), tr = Math.sin(t * 38) * 5; devArm([[g.shL[0] - 20, g.shL[1] + 60], [1080, 760], [lerp(1140, 1180 + tr, k), lerp(860, 560, k)]], [130, 110, 84], 44); }
    else devArm([[g.shL[0] - 20, g.shL[1] + 60], [1100 + rec * 60, 640], [1140 + rec * 80, 860 - rec * 120]], [150, 130, 104], 50);
    const bx = lerp(250, 520, tipK), by = lerp(622, 440, tipK), rot = lerp(0, 2.6, tipK);
    const f = figure({ kind: 'sam', x: 760, y: 900, h: 450, expr: samEx('resolve', L, [1.9]), look: [-.8, .3], turn: -.4, armL: [bx + 60, by + 40], bendL: .5, stretch: true, glowOn: [D.red, .2 * (1 - shr * 5)], glowSide: 1, t }); tieD(f, TIE);
    if (pouring) { stroke([[bx - 130, by + 150], [bx - 140 + Math.sin(t * 30) * 3, 540], [bx - 136, 600]], 18, rgba(D.amber)); for (let i = 0; i < 5; i++) { const k = (L * 3 + i * .2) % 1; disc(bx - 136 + (rnd(i) - .5) * 80, 600 - k * 40, 5 * (1 - k), rgba(D.amber, 1 - k)); } }
    at(bx, by, 1, rot, () => bottleD(0, 0, 230, { fill: .5 * (1 - pour), col: [40, 110, 84], alpha: .85 }));
    if (L >= fz) { popRing(L, fz, 1430, 640, 500, -360); }
  });
});
// ---- 67.3-93.3 he starves it ----
const clock = txt => hw(txt, W - 90, 142, 36, 'say', { align: 'right', rot: 0, weight: 400 });
const deflate = (L, a, x, y, r = 300) => { if (L < a || L > a + .5) return; const k = seg(L, a, a + .5); ctx.lineWidth = 10 * (1 - k); ctx.strokeStyle = rgba(D.red, .8 * (1 - k)); ctx.beginPath(); ctx.arc(x, y, r * (1 - k * .8), 0, TAU); ctx.stroke(); };
shot('day1', 'run', 'DAY: 1', (L, u, t, c) => {
  const jo = c('justOne'), up = c('up1'), stood = L >= up - .15, upK = eio(seg(L, up - .15, up + .3)), offer = eo(seg(L, jo - .5, jo));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [620, 560, 620, [255, 214, 180], .1] });
    // the door, dawn behind it, and the giant filling it
    outlined(() => { ctx.beginPath(); ctx.rect(1190, 150, 520, 750); }, rgba([58, 44, 52]), 7); ctx.fillStyle = lg(0, 150, 0, 900, [[0, [90, 110, 170], .5], [.7, [255, 170, 130], .55], [1, [255, 200, 150], .6]]); ctx.fillRect(1206, 166, 488, 734);
    cone(1450, 880, 250, 760, 190, [255, 190, 150], .12, -420);
    const g = figure({ kind: 'devil', x: 1470, y: 1270, h: 1020, stage: 4, expr: devEx(stood ? 'grin' : 'charm', L, [1.6]), look: [-.9, .5], lean: -.12, tilt: -.14 + Math.sin(L * 1.4) * .02, noLegs: true, noArms: true, noTail: true, heat: .7, t });
    const gx = lerp(1250, 1010, offer), gy = lerp(760, 650, offer);
    devArm([[g.shL[0] - 10, g.shL[1] + 60], [lerp(1240, 1150, offer), 600], [gx + 44, gy - 20]], [120, 100, 70], 44); glassD(gx, gy + 40, 96, .62);
    // he ties his shoe with shaking hands
    outlined(() => { ctx.beginPath(); ctx.rect(430, 770, 330, 26); }, rgba(D.wood), 5); for (const x of [450, 720]) outlined(() => { ctx.beginPath(); ctx.rect(x, 796, 22, 104); }, rgba(mix(D.wood, D.stage, .3)), 4);
    const tr = Math.sin(t * 41) * 4 * (1 - upK);
    if (!stood) { const f = figure({ kind: 'sam', x: 600, y: 770, h: 450, sit: 1, drop: .25, lean: .5, tilt: .2, expr: 'strain', look: [.4, .9], armL: [700 + tr, 868], armR: [760 - tr, 872], bendL: -.3, bendR: .3, stretch: true, glowOn: [D.red, .16], glowSide: 1, t }); }
    else figure({ kind: 'sam', x: lerp(640, 700, upK), y: 900, h: 450, expr: samEx('resolve', L, [up + .25]), look: [.9, -.5], turn: .4, drop: lerp(.2, 0, upK), glowOn: [D.red, .16], glowSide: 1, t });
    outlined(() => blobPath([[690, 900], [692, 866], [730, 862], [790, 880], [800, 900]], .4, true), rgba([210, 214, 224]), 3.5); curve([[726, 866], [716, 850 + tr], [736, 846], [740, 866], [760, 848 - tr], [752, 868]], 3.5, rgba(D.line), .5);
  });
  clock('6:00 AM'); red('just one. for the shakes.', 760, 300, 72, L, jo, 1.1);
});
shot('run', 'day14', 'DAY: 1', (L, u, t, c) => {
  say('so it chased him.', 1330, 250, 66, L, c('capChase'), .6);
  camD(push(u, .03), 960, 560, () => {
    stageD(900, {}); ctx.fillStyle = lg(0, 520, 0, 900, [[0, [255, 170, 120], 0], [1, [255, 170, 120], .3]]); ctx.fillRect(0, 520, W, 380);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 898); ctx.clip(); disc(1540, 900, 150, rgba([255, 214, 150])); glow([255, 190, 130], 1540, 880, 520, .5); ctx.restore();
    for (let i = 0; i < 5; i++) { const x = ((i * 520 - L * 760) % 2600 + 2600) % 2600 - 300; stroke([[x, 900], [x, 560]], 7, rgba(D.prop)); curve([[x - 90, 560], [x - 60, 470], [x, 440], [x + 70, 480], [x + 90, 560], [x, 580]], 6, rgba(D.prop), .5); }
    const ph = L * TAU * 2.6, st = Math.sin(ph), gx = lerp(700, 250, eio(seg(L, 0, 2.6))), gph = L * TAU * 1.3;
    const g = figure({ kind: 'devil', x: gx, y: 900, h: 760, stage: 3.7, expr: { ...DX.rage, m: 'frown' }, look: [.9, 0], lean: .1, stride: Math.sin(gph), drop: Math.abs(Math.cos(gph)) * .02, armR: [gx + 250, 520], armL: [gx + 200, 560], bendR: -.3, bendL: -.3, tail: [-.3, -.1 + .05 * Math.sin(gph)], heat: .6, t, stretch: true });
    const x = 1130 + Math.sin(L * 1.5) * 20;
    figure({ kind: 'sam', x, y: 900 - Math.abs(Math.cos(ph)) * 16, h: 450, lean: .16, stride: st, lift: st > 0 ? 1 : -1, expr: 'strain', look: [.8, 0], turn: .4, armL: [x - 40 - st * 70, 700 + st * 30], armR: [x + 50 + st * 70, 700 - st * 30], bendL: -.6, bendR: -.6, t });
    for (let i = 0; i < 6; i++) { const k = (L * 2.5 + i / 6) % 1; stroke([[x - 150 - k * 260, 560 + i * 52], [x - 230 - k * 300, 560 + i * 52]], 4, rgba(D.white, .5 * (1 - k))); }
  });
  clock('6:00 AM');
});
shot('day14', 'day40', 'DAY: 14', (L, u, t, c) => {
  const reps = [c('rep1'), c('rep2'), c('rep3')], sl = c('slide'), bp = c('bump'), nf = c('noFun');
  const upK = Math.max(...reps.map((r, i) => eio(seg(L, r - .42, r)) * (i < 2 ? 1 - eio(seg(L, r + .15, r + .62)) : 1)));
  const rot = Math.PI / 2 - lerp(.03, .34, upK), px = 520, py = 842, h = 450, dir = [Math.sin(rot), -Math.cos(rot)];
  const toL = (wx, wy) => { const dx = wx - px, dy = wy - py, cs = Math.cos(-rot), sn = Math.sin(-rot); return [dx * cs - dy * sn, dx * sn + dy * cs]; };
  const slide = eio(seg(L, sl, bp)), landed = L >= bp, shr = landed ? eo(seg(L, bp, bp + .3)) : 0;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [900, 560, 760, [255, 214, 180], .14] });
    outlined(() => { ctx.beginPath(); ctx.rect(180, 200, 250, 290); }, rgba([120, 100, 110]), 5); ctx.fillStyle = lg(0, 200, 0, 490, [[0, [150, 170, 220], .7], [1, [255, 190, 150], .8]]); ctx.fillRect(194, 214, 222, 262); stroke([[305, 200], [305, 490]], 5, rgba(D.line)); cone(305, 490, 120, 430, 400, [255, 200, 160], .1, 300);
    const hx = px + dir[0] * h * .64;
    at(px, py, 1, rot, () => figure({ kind: 'sam', x: 0, y: 0, h, expr: upK > .15 && upK < .97 ? 'strain' : landed ? samEx('resolve', L, []) : 'strain', tilt: -rot * .82, look: [.2, .3], armL: toL(hx - 30, 894), armR: toL(hx + 20, 896), bendL: -.1, bendR: -.1, stretch: true, t }));
    const seatX = px + dir[0] * h * .34, seatY = py + dir[1] * h * .34 - 56;
    const dx = lerp(seatX, 250, slide), dy = lerp(seatY, 872, slide * slide), dh = lerp(430, 360, shr);
    const f = figure({ kind: 'devil', x: dx, y: dy, h: dh, stage: lerp(3, 2.6, shr), sit: 1, flat: slide > .5, drop: .2, expr: landed ? 'sulk' : L > sl ? { ...DX.plead, m: 'open' } : devEx('sly', L, [.3]), look: landed ? [.8, .2] : [.3, .6], lean: landed ? -.1 : slide * -.5, tilt: Math.sin(L * 1.8) * .04 - slide * .3 * (1 - shr),
      armL: landed ? undefined : [dx - 40, dy - 110], armR: landed ? undefined : [dx + 50, dy - 100], bendL: .6, bendR: -.6, tail: landed ? [-.3, .04] : [-.4, -.1 + .05 * Math.sin(t * 3)], heat: .7 - .3 * shr, t });
    tieD(f, D.ember);
    if (landed) { deflate(L, bp, dx, dy - 160, 330); for (let i = 0; i < 6; i++) { const a = -Math.PI * (i + .5) / 6, k = seg(L, bp, bp + .3); stroke([[dx + Math.cos(a) * (120 + k * 60), 880 + Math.sin(a) * (40 + k * 30)], [dx + Math.cos(a) * (150 + k * 110), 880 + Math.sin(a) * (56 + k * 50)]], 5, rgba(D.white, 1 - k)); } }
  });
  clock('6:30 AM'); red('you’re no fun.', 1330, 330, 72, L, nf, .7);
});
shot('day40', 'day60', 'DAY: 40', (L, u, t, c) => {
  say('lighter every day.', 440, 560, 66, L, c('capLight'), .6);
  const pulls = [c('pull1'), c('pull2'), c('pull2') + 1.15], pk = Math.max(...pulls.map(r => eio(seg(L, r - .45, r)) * (1 - eio(seg(L, r + .12, r + .6))))), dr = c('dropOff'), fell = L >= dr, fall = eo(seg(L, dr, dr + .28)), shr = fell ? eo(seg(L, dr + .28, dr + .55)) : 0, sm = L >= c('smile40');
  camD(push(u, .04), 960, 560, () => {
    const G = 940; stageD(G, { pool: [960, 500, 800, [255, 226, 180], .15] }); glow([255, 220, 150], 300, 160, 300, .5); disc(300, 160, 60, rgba([255, 232, 170]));
    stroke([[1700, G], [1700, 620]], 12, rgba(D.prop)); curve([[1590, 620], [1600, 470], [1700, 400], [1810, 470], [1820, 620], [1700, 660]], 7, rgba(D.prop), .5);
    for (const x of [770, 1090]) { stroke([[x, G], [x, 176]], 18, rgba(D.line)); stroke([[x, G], [x, 176]], 10, rgba(D.prop)); } stroke([[750, 180], [1110, 180]], 20, rgba(D.line)); stroke([[750, 180], [1110, 180]], 12, rgba(D.propL));
    // Lily on the bench
    outlined(() => { ctx.beginPath(); ctx.rect(1300, 800, 330, 22); }, rgba(D.wood), 5); for (const x of [1320, 1590]) outlined(() => { ctx.beginPath(); ctx.rect(x, 822, 20, G - 822); }, rgba(mix(D.wood, D.stage, .3)), 4);
    figure({ kind: 'lily', x: 1470, y: 800, h: 290, sit: -1, drop: .2, expr: sm ? samEx('smile', L, []) : 'calm', look: [-.9, -.6 - pk * .3], turn: -.4, tilt: sm ? -.08 : 0, t });
    const fy = lerp(690, 560, pk), x = 930;
    const f = figure({ kind: 'sam', x, y: fy, h: 420, expr: pk > .1 && pk < .95 ? 'strain' : samEx('resolve', L, []), look: [0, -.4], armL: [x - 150, 184], armR: [x + 150, 184], bendL: .5 * pk, bendR: -.5 * pk, stretch: true, t });
    const dy = fell ? lerp(fy + 262, G - 4, fall) : fy + 262, dh = lerp(250, 196, shr);
    const d = figure({ kind: 'devil', x: x + 26 + (fell ? fall * 60 : 0), y: fell && fall >= 1 ? G - 6 : dy, h: dh, stage: lerp(2, 1.5, shr), sit: fell && fall >= 1 ? 1 : 0, flat: true, drop: fell && fall >= 1 ? .2 : 0, expr: fell ? 'sulk' : devEx('sulk', L, [1.2]), look: fell ? [.6, -.4] : [0, -.8],
      armL: fell ? undefined : [x + 4, fy - 6], armR: fell ? undefined : [x + 36, fy - 6], bendL: .1, bendR: -.1, tail: fell ? [-.36, .03] : [.12 + .05 * Math.sin(t * 4), .2], heat: .6 - .2 * shr, t, stretch: true });
    if (fell) deflate(L, dr + .28, d.hip[0], d.hip[1] - 80, 240);
  });
  clock('7:15 AM');
});
// DAY 60: the bar's door
function barDoorD(t) { outlined(() => { ctx.beginPath(); ctx.rect(1290, 300, 330, 590); }, rgba([70, 44, 34]), 7); ctx.fillStyle = lg(0, 300, 0, 890, [[0, [255, 190, 90], .75], [1, [255, 150, 60], .6]]); ctx.fillRect(1306, 316, 298, 574);
  glow([255, 170, 80], 1455, 600, 520, .32); cone(1455, 870, 160, 700, 150, [255, 170, 80], .2, -380);
  outlined(() => { ctx.beginPath(); ctx.rect(1240, 880, 430, 24); }, rgba(D.prop), 5);
  ctx.save(); ctx.shadowColor = rgba([255, 120, 60], .9); ctx.shadowBlur = 22; const nx = 1455, ny = 210; ctx.lineWidth = 7; ctx.strokeStyle = rgba([255, 170, 110], .7 + .3 * Math.sin(t * 9) * (Math.sin(t * 2.3) > .6 ? 1 : 0)); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(nx - 44, ny - 44); ctx.lineTo(nx + 44, ny - 44); ctx.lineTo(nx + 6, ny + 4); ctx.lineTo(nx + 6, ny + 44); ctx.lineTo(nx + 30, ny + 50); ctx.moveTo(nx - 44, ny - 44); ctx.lineTo(nx - 6, ny + 4); ctx.lineTo(nx - 6, ny + 44); ctx.lineTo(nx - 30, ny + 50); ctx.stroke(); ctx.restore(); }
function stepDevil(L, t, o = {}) { const k = o.droop || 0, h = lerp(176, 132, o.shr || 0);
  const d = figure({ kind: 'devil', x: 1205, y: 880, h, stage: lerp(1, .6, o.shr || 0), sit: -1, expr: o.expr, look: o.look || [-.9, -.5], tilt: .06 + k * .3, lean: k * .12, armL: k ? undefined : [1150, 824], armR: k ? undefined : [1172, 828], bendL: .4, bendR: .4, tail: [lerp(.5, .46, k), lerp(-.3, .1, k)], heat: .7 - .3 * k, t });
  ctx.save(); ctx.globalAlpha = .95; if (!k) glassD(1150, 836, 44, .7); else at(1120, 880, 1, -1.45, () => glassD(0, 0, 44, .1)); ctx.restore(); return d; }
shot('day60', 'tempt', 'DAY: 60', (L, u, t, c) => {
  const sp = c('stop60'), wk = seg(L, 0, sp), x = lerp(300, 780, eo(wk)), walking = L < sp - .1;
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [700, 560, 700, [150, 130, 210], .1] }); barDoorD(t);
    stepDevil(L, t, { expr: devEx('plead', L, [1.7]) });
    figure({ kind: 'sam', x, y: 900, h: 450, expr: walking ? samEx('calm', L, []) : samEx('tempted', L, [sp + .6]), look: walking ? [.6, 0] : [.9, .6], turn: .4, stride: walking ? Math.sin(L * 11) : 0, drop: walking ? Math.abs(Math.cos(L * 11)) * .014 : 0, glowOn: [[255, 170, 80], walking ? .1 + .2 * wk : .3], glowSide: 1, t });
  });
  clock('7:40 PM'); red('just a sip. i’m so small.', 860, 290, 72, L, c('sip60'), 1.05);
});
shot('tempt', 'handShot', 'DAY: 60', (L, u, t, c) => {
  camD(push(u, .08), 960, 540, () => {
    stageD(0, { pool: [900, 500, 800, [150, 130, 210], .1] }); glow([255, 170, 80], 1900, 560, 900, .3);
    const gulp = Math.sin(seg(L, .7, 1.1) * Math.PI);
    const f = figure({ kind: 'sam', x: 900, y: 2060 + gulp * 22, h: 1900, expr: { ...FX.tempted, lid: .3 + .12 * Math.sin(t * 23) * seg(L, .3, 1), sweat: true }, look: L < .6 ? [.8, .7] : L < 1.2 ? [.95, 0] : [.8, .7], turn: .35, tilt: .03, noLegs: true, noArms: true, glowOn: [[255, 150, 60], .42 + .06 * Math.sin(t * 15)], glowSide: 1, t });
  });
  clock('7:40 PM');
});
shot('handShot', 'day90', 'DAY: 60', (L, u, t, c) => {
  const hd = c('hand'), wo = c('walkOn'), inK = eo(seg(L, 0, hd)), go = seg(L, wo, wo + 1.5), gx = go * go * 760 + go * 120, walking = go > 0, ph = L * 9;
  const z = lerp(1.32, 1.0, eio(seg(L, wo - .2, wo + .7)));
  camD(z, lerp(800, 960, eio(seg(L, wo - .2, wo + .7))), lerp(640, 560, eio(seg(L, wo - .2, wo + .7))), () => {
    stageD(900, { pool: [700, 560, 700, [150, 130, 210], .1] }); barDoorD(t);
    stepDevil(L, t, { expr: walking ? 'sulk' : devEx('plead', L, []), look: walking ? [-.9, .2] : [-.9, -.5], droop: eo(seg(L, wo, wo + .6)), shr: eo(seg(L, wo + .3, wo + .9)) });
    if (L > wo + .3) deflate(L, wo + .3, 1205, 800, 200);
    const sx = 780 - gx, lx = lerp(430, 660, inK) - gx, hx = (sx + lx) / 2 + 14, hy = 756;
    const took = L >= hd;
    figure({ kind: 'lily', x: lx, y: 900, h: 290, expr: took ? 'smile' : 'calm', look: walking ? [-.7, -.2] : [.8, -.8], turn: walking ? -.4 : .4, armR: took ? [hx, hy] : [lx + 40, 800], bendR: -.2, stride: walking ? Math.sin(ph * 1.25) * .8 : inK < 1 ? Math.sin(L * 16) * .6 : 0, glowOn: [[255, 170, 80], .2], glowSide: 1, t, stretch: true });
    figure({ kind: 'sam', x: sx, y: 900, h: 450, expr: took ? (walking ? samEx('smile', L, []) : { ...FX.smile, bi: -.16 }) : 'tempted', look: took ? (walking ? [-.7, .1] : [-.8, .8]) : [.9, .6], turn: took ? -.4 : .4, armL: took ? [hx, hy] : undefined, bendL: .2, stride: walking ? Math.sin(ph) * .9 : 0, drop: walking ? Math.abs(Math.cos(ph)) * .014 : 0, glowOn: [[255, 170, 80], .3], glowSide: 1, t, stretch: true });
    if (took) { const k = seg(L, hd, hd + .7); glow(D.yellow, hx, hy, 60 + 170 * k, .7 * (1 - k)); }
  });
  clock('7:40 PM');
});
// DAY 90: thumb-sized again
function counterTopD() { outlined(() => { ctx.beginPath(); ctx.rect(-200, 820, W + 400, 40); }, rgba(D.wood), 6); rectf(-200, 860, W + 400, 400, rgba([30, 30, 40])); additive(() => { ctx.save(); ctx.translate(900, 824); ctx.scale(1, .06); glow([255, 220, 170], 0, 0, 800, .4); ctx.restore(); }); }
const bigSam = (L, t, o = {}) => figure({ kind: 'sam', x: 1540, y: 2010, h: 1800, noLegs: true, noArms: true, expr: samEx('smile', L, o.blinks || []), look: o.look || [-.9, .6], turn: -.4, tilt: -.04, dim: .16, t });
const tinyRage = (x, y, L, t, o = {}) => figure({ kind: 'devil', x, y, h: 300, stage: 0, expr: o.expr || { ...DX.rage, h: .8 }, look: o.look || [.5, -.6], tilt: Math.sin(t * 17) * .08, armL: o.armL || [x - 120, y - 250 + Math.sin(t * 21) * 30], armR: o.armR || [x + 120, y - 250 - Math.sin(t * 21) * 30], bendL: .4, bendR: -.4, tail: [-.46 + .08 * Math.sin(t * 14), -.3], heat: .5, stretch: true, t, ...o.more });
const BOT = { alpha: .18, col: [120, 170, 150] };
shot('day90', 'lower', 'DAY: 90', (L, u, t, c) => {
  say('small again.', 800, 200, 66, L, c('capSmall'), .5);
  const grab = eo(seg(L, 1.3, 1.85));
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [1000, 480, 900, [255, 222, 176], .16] }); bigSam(L, t, { blinks: [.9] }); counterTopD();
    bottleD(520, 820, 600, BOT);
    const jump = Math.abs(Math.sin(L * 8.5)) * 34 * (1 - grab), x = 940;
    const f = tinyRage(x, 820 - jump, L, t);
    for (let i = 0; i < 3; i++) { const k = (L * 2.4 + i / 3) % 1, a = -1.1 - i * .5; stroke([[f.head[0] + Math.cos(a) * (130 + k * 40), f.head[1] + Math.sin(a) * (130 + k * 40)], [f.head[0] + Math.cos(a) * (165 + k * 70), f.head[1] + Math.sin(a) * (165 + k * 70)]], 6, rgba(D.red, 1 - k)); }
    if (jump < 4 && L < 1.3) for (const sd of [-1, 1]) stroke([[x + sd * 70, 812], [x + sd * 110, 800]], 5, rgba(D.white, .6));
    const tip = [lerp(1300, x - 150, grab), lerp(-200, 640, grab)];
    taper([[tip[0] + 150, tip[1] - 800], [tip[0] + 90, tip[1] - 300], tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([[tip[0] + 150, tip[1] - 800], [tip[0] + 90, tip[1] - 300], tip], [150, 132, 104], lg(0, tip[1] - 200, 0, tip[1] + 100, [[0, D.cream], [1, D.creamS]]));
  });
  clock('7:00 AM');
});
shot('lower', 'shelf', 'DAY: 90', (L, u, t, c) => {
  const bd = c('bottleDown'), ck = c('cork90'), lift = eio(seg(L, 0, .22)), over = eio(seg(L, .08, bd - .16)), fall = seg(L, bd - .16, bd), isIn = L >= bd, bx = 520, top = 220;
  const hx = lerp(790, bx + 150, over), hy = lerp(640, 150, lift);                      // the tip of his arm, holding it by the tail
  const dx = isIn ? bx : fall > 0 ? bx : hx - 150, dyFeet = isIn ? 812 : fall > 0 ? lerp(top - 10, 812, fall * fall) : hy + 330;
  const sh = isIn ? Math.sin((L - bd) * 50) * 8 * (1 - seg(L, bd, bd + .3)) : 0;
  camD(lerp(1.05, 1.1, u), 900, 540 + sh, () => {
    stageD(0, { pool: [900, 480, 900, [255, 222, 176], .16] }); bigSam(L, t, { blinks: [1.2], look: [-.9, .5] }); counterTopD();
    const pound = L > ck + .08 ? Math.sin(L * 28) : 0;
    const dev = () => fall > 0 || isIn ? tinyRage(dx, dyFeet, L, t, { armL: isIn ? [dx - 96, dyFeet - 180 + (pound > 0 ? -22 : 10)] : undefined, armR: isIn ? [dx + 96, dyFeet - 180 + (pound < 0 ? -22 : 10)] : undefined, look: [.7, -.5] })
      : (ctx.save(), ctx.translate(dx, hy + 30), ctx.rotate(Math.PI + Math.sin(t * 9) * .25), tinyRage(0, 150, L, t, { more: { noTail: true }, look: [0, .8] }), ctx.restore());
    if (isIn || fall > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, top + 400); ctx.clip(); dev(); ctx.restore(); bottleD(bx, 820, 600, { ...BOT, cork: L >= ck, inside: dev }); }
    else { bottleD(bx, 820, 600, BOT); dev(); devArm([[dx + 10, hy + 40], [dx + 70, hy + 20], [hx - 20, hy + 4]], [20, 16, 12], 16); }
    // his arm; after the drop it comes back with the cork
    const ret = eo(seg(L, bd + .1, ck)), away = eio(seg(L, ck + .12, ck + .6));
    const tip = !isIn ? [hx, hy] : [lerp(bx + 150, bx + 40, ret) + away * 500, lerp(150, top - 70, ret) - away * 260];
    if (isIn && L < ck) outlined(() => { ctx.beginPath(); ctx.rect(tip[0] - 80, tip[1] + 22, 66, 54); }, rgba([186, 140, 96]), 4);
    taper([[tip[0] + 170, tip[1] - 800], [tip[0] + 100, tip[1] - 300], tip], [150, 132, 104].map(v => v + 16), rgba(D.line)); taper([[tip[0] + 170, tip[1] - 800], [tip[0] + 100, tip[1] - 300], tip], [150, 132, 104], lg(0, tip[1] - 200, 0, tip[1] + 100, [[0, D.cream], [1, D.creamS]]));
  });
  clock('7:00 AM');
});
shot('shelf', 'newDraw', 'DAY: 90', (L, u, t, c) => {
  const sd = c('setDown'), up = eio(seg(L, .05, sd)), done = eio(seg(L, sd + .1, sd + .5));
  camD(push(u, .04), 960, 560, () => {
    stageD(900, { pool: [1000, 520, 800, [255, 222, 176], .17] });
    outlined(() => { ctx.beginPath(); ctx.rect(180, 240, 260, 300); }, rgba([150, 170, 210]), 5); ctx.fillStyle = lg(0, 240, 0, 540, [[0, [170, 200, 240], .8], [1, [255, 226, 170], .8]]); ctx.fillRect(194, 254, 232, 272); stroke([[310, 240], [310, 540]], 5, rgba(D.line)); cone(310, 540, 130, 460, 360, [255, 220, 170], .12, 300);
    outlined(() => { ctx.beginPath(); ctx.rect(1180, 300, 420, 22); }, rgba(D.wood), 5); for (const x of [1220, 1540]) stroke([[x, 322], [x - 30, 380]], 6, rgba(D.line));
    kitchenD(t);
    const bx = lerp(1370, 1400, up), by = lerp(600, 300, up);
    bottleD(bx, by, 150, { ...BOT, alpha: .25, cork: true, inside: () => { glow(D.red, bx, by - 30, 40, .7); disc(bx, by - 26, 9, rgba(D.ink)); for (const s of [-1, 1]) disc(bx + s * 4, by - 28, 2, rgba(D.hot)); } });
    figure({ kind: 'sam', x: 1290, y: 900 - 12 * up * (1 - done), h: 450, expr: done > .5 ? samEx('smile', L, []) : 'resolve', look: done > .5 ? [-.5, 0] : [.5, -.9], turn: done > .5 ? -.2 : .3, armR: done > .3 ? undefined : [bx - 20, by - 10], bendR: -.2, stretch: true, t });
  });
  clock('7:00 AM');
});
// ---- 93.3-102.1 the new drawing ----
shot('newDraw', 'samFace', 'DAY: 90', (L, u, t, c) => {
  const inK = eback(seg(L, 0, .45));
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [960, 520, 900, [255, 226, 180], .2] });
    const py = lerp(900, 0, inK);
    figure({ kind: 'lily', x: 960, y: 760 + py, h: 720, expr: samEx('smile', L, [1.3, 2.3]), look: [.2, -.5], noLegs: true, noArms: true, t });
    drawingD(960, 600 + py, 440, .025 + Math.sin(L * 1.6) * .012, false);
    for (const sd of [-1, 1]) { const x = 960 + sd * 440, y = 780 + py; taper([[x + sd * 30, y + 320], [x + sd * 10, y + 120], [x - sd * 16, y]], [120, 112, 104], rgba(D.line)); taper([[x + sd * 30, y + 320], [x + sd * 10, y + 120], [x - sd * 16, y + 2]], [104, 96, 88], rgba(D.cream)); }
  });
});
shot('samFace', 'kneel', 'DAY: 90', (L, u, t, c) => {
  camD(push(u, .07), 960, 540, () => {
    stageD(0, { pool: [900, 500, 800, [255, 226, 180], .2] });
    const ex = L < .55 ? { eh: 1.15, lid: 0, bi: -.16, bo: .02, m: 'part' } : L < 1.2 ? { ...FX.sad, lid: .1, m: 'wob' } : { ...FX.smile, bi: -.2, bo: .06, lid: .12 };
    const f = figure({ kind: 'sam', x: 900, y: 2060, h: 1900, expr: ex, look: [-.3, .5], tilt: L > 1.2 ? .05 : 0, noLegs: true, noArms: true, glowOn: [[255, 220, 170], .12], glowSide: -1, t });
    if (L > .6) { const k = seg(L, .6, 1.3), run = seg(L, 1.2, 2.2); for (const sd of [-1, 1]) { const x = f.head[0] + sd * f.hr * .36 - sd * 6, y = f.head[1] + f.hr * .18 + run * f.hr * .5 * (sd > 0 ? 1 : .6); blob([[x, y], [x + 22 * k, y + 40 * k], [x, y + 70 * k], [x - 22 * k, y + 40 * k]], rgba([150, 200, 240], .92), .5); disc(x - 5, y + 44 * k, 5 * k, 'rgba(255,255,255,.8)'); } }
  });
});
shot('kneel', 'night', null, (L, u, t, c) => {
  const ri = c('runIn'), hg = c('hug'), kn = eio(seg(L, 0, .35)), run = eio(seg(L, ri - .1, hg)), hugged = L >= hg, hk = eo(seg(L, hg, hg + .35)), warm = eo(seg(L, hg, hg + 1.6));
  camD(lerp(1, 1.14, eio(u)), 960, 600, () => {
    stageD(900, { pool: [960, 560, 760 + 240 * warm, [255, 224, 170], .16 + .16 * warm] });
    at(520, 898, 80, -.2, () => { outlined(() => { ctx.beginPath(); ctx.rect(-1, -.1, 2, .2); }, rgba([238, 234, 222]), .03); });
    const lx = lerp(430, 962, run), sx = 1090;
    const sam = () => figure({ kind: 'sam', x: sx, y: 900, h: 450, kneel: kn > .5 ? -1 : 0, drop: kn > .5 ? undefined : kn * .2, lean: hugged ? -.14 * hk : 0, tilt: hugged ? -.16 * hk : 0, expr: hugged ? { ...FX.laugh, m: 'smile' } : { ...FX.smile, bi: -.2, lid: .1 }, look: [-.9, .2], turn: -.4,
      armL: hugged ? [lerp(sx - 120, lx - 70, hk), 760] : [sx - 150, 700 - 30 * kn], armR: hugged ? [lerp(sx + 40, lx + 20, hk), 800] : [sx + 110, 720], bendL: .5, bendR: .6, stretch: true, t });
    const lily = () => figure({ kind: 'lily', x: lx, y: 900 - (run > 0 && run < 1 ? Math.abs(Math.sin(L * 15)) * 14 : 0), h: 290, lean: hugged ? .1 * hk : run > 0 && run < 1 ? .14 : 0, tilt: hugged ? .16 * hk : 0, expr: hugged ? { ...FX.laugh, m: 'smile' } : run > 0 ? 'laugh' : 'smile', look: [.9, -.3], turn: .4,
      armL: run > 0 ? [lx + (hugged ? 70 : 56), hugged ? 730 : 736] : undefined, armR: run > 0 ? [lx + 96, hugged ? 720 : 716] : undefined, bendL: -.3, bendR: -.3, stride: run > 0 && run < 1 ? Math.sin(L * 15) : 0, stretch: true, t });
    if (hugged) { lily(); sam(); } else { sam(); lily(); }
    if (hugged) for (let i = 0; i < 7; i++) { const k = (seg(L, hg, hg + 2.4) * 1.3 + i * .13) % 1, a = -Math.PI * (i + .5) / 7; disc(1030 + Math.cos(a) * (150 + k * 260), 640 + Math.sin(a) * (150 + k * 220), 7 * (1 - k), rgba(D.yellow, .8 * (1 - k))); }
  });
});
// ---- 102.1-110.5 the last picture ----
shot('night', 'black', null, (L, u, t, c) => {
  const eo_ = c('eyesOpen'), fg = c('fog'), ds = c('drawSmile'), taps = [c('tap1'), c('tap2')], wake = eo(seg(L, eo_ - .1, eo_ + .5)), fog = eo(seg(L, fg, fg + .7)), sm = seg(L, ds, ds + .8), tap = blinkAt(L, taps, .07);
  const sh = taps.reduce((a, p) => a + (L >= p ? Math.sin((L - p) * 60) * 5 * (1 - seg(L, p, p + .18)) : 0), 0);
  camD(lerp(1.2, 1.4, eio(u)), 960, 560, () => {
    rectf(-400, -400, W + 800, H + 800, rgba([7, 8, 14])); glow([120, 140, 220], 200, 120, 900, .16);
    outlined(() => { ctx.beginPath(); ctx.rect(-200, 800, W + 400, 34); }, rgba(mix(D.wood, [20, 24, 50], .5)), 6);
    const bx = 960 + sh, by = 800, s = 600;
    const dv = () => { ctx.save(); ctx.globalAlpha = .25 + .75 * wake; const y = by - 8;
      figure({ kind: 'devil', x: bx, y, h: 300, stage: 0, expr: L < eo_ ? { ...DX.sweet, h: .04 } : sm > 0 && sm < 1 ? { ...devEx('sweet', L, []), m: 'cat' } : devEx(L > ds + .8 ? 'charm' : 'sweet', L, [eo_ + .9, fg + .1]), look: sm > 0 && sm < 1 ? [.6, -.3] : [0, .1], tilt: Math.sin(L * 1.3) * .04,
        armR: sm > 0 && sm < 1 ? [bx + 60 + sm * 60, y - 250 + Math.sin(sm * Math.PI) * 36] : tap > .05 ? [bx + 92, y - 170] : undefined, bendR: -.3, tail: [-.4 + .04 * Math.sin(t * 2), -.3], heat: .35 + .5 * wake, noBelly: wake < .3, stretch: true, t }); ctx.restore(); };
    bottleD(bx, by, s, { alpha: .14, col: [120, 150, 190], cork: true, lineCol: [130, 170, 210], inside: dv });
    // its breath on the glass, and the smile it draws there
    if (fog > 0) { const fx = bx + 46, fy = by - 262; ctx.save(); ctx.beginPath(); const w = s * .17; ctx.rect(bx - w, by - s * .6, w * 2, s * .6); ctx.clip();
      blurred(14, () => oval(fx, fy, 86 * fog, 74 * fog, rgba([210, 220, 240], .5)));
      if (sm > 0) { const pts = Array.from({ length: 12 }, (_, i) => { const k = i / 11 * sm; return [fx - 44 + k * 88, fy + 4 + Math.sin(k * Math.PI) * 30]; }); curve(pts, 11, rgba([14, 16, 26], .95), .5); if (sm > .98) for (const sd of [-1, 1]) disc(fx + sd * 24, fy - 26, 7, rgba([14, 16, 26], .95)); } ctx.restore(); }
    for (const p of taps) { const k = L - p; if (k > 0 && k < .3) { ctx.lineWidth = 5 * (1 - k / .3); ctx.strokeStyle = rgba(D.white, 1 - k / .3); ctx.beginPath(); ctx.arc(bx + 100, by - 180, 16 + k * 150, -.9, .9); ctx.stroke(); } }
  });
  red('i can wait.', 960, 1004, 64, L, c('wait'), .7);
});
shot('black', 'END', null, (L, u, t, c) => {
  say('So starve it.', 960, 440, 104, L, c('starve'), .55);
  if (L >= c('everyDay')) hw('Every day.', 960, 580, 104, 'say', L > c('everyDay') + .45 ? { under: true } : { reveal: seg(L, c('everyDay'), c('everyDay') + .45) });
  if (L >= c('title')) over(() => { ctx.save(); ctx.globalAlpha = eo(seg(L, c('title'), c('title') + .5)); _hw('THE BOTTLE', 960, 800, 46, 'say', { rot: 0 }); _hw('it was so small', 960, 856, 34, 'devil', { rot: 0, weight: 400 }); ctx.restore(); });
});
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
// ---- THE EDIT (second cut, 17 Nov 2026: a hook first, a cut about every 1.3 s) ----
// The shots above are the source, timed by cues.js. The edit plays pieces of them (stage/kit.js): cut(shot, { a, b: the
// piece in the shot's own seconds, sp: speed, cam: [zoom, x, y] a punch-in on a point of the frame }). blink() is a beat of black.
cut('hk1'); cut('hk2'); cut('hk3');
cut('a21', { a: 0, b: 2.6, sp: 1.37 }); cut('a21', { a: 2.6, b: 5.6, sp: 1.3 }); cut('a21', { a: 5.6, b: 7.4, sp: 1.6 }); cut('a21', { a: 7.4, b: 10.4, sp: 1.43 }); cut('a21', { a: 10.4, b: 13.5, sp: 1.19 });
blink();
cut('a26', { a: 0, b: .4, sp: 1.3 }); cut('a26', { a: .4, b: 1.75, sp: 1.35, cam: [2.2, 830, 570] }); cut('a26', { a: 1.75, sp: 1.25 });
cut('sip26', { sp: 1.3 }); cut('wall26', { sp: 1.4 });
blink();
cut('a31', { sp: 1.5 });
cut('flask', { a: 0, b: .9, sp: 1.3 }); cut('flask', { a: .9, b: 1.95, sp: 1.3, cam: [1.4, 640, 790] }); cut('flask', { a: 1.95, sp: 1.25 });
cut('drink31', { sp: 1.2 });
blink();
cut('a34', { sp: 1.5 }); cut('bar34', { sp: 1.37 });
cut('dinner', { a: 0, b: .75, sp: 1.3 }); cut('dinner', { a: .75, b: 1.4, sp: 1.3, cam: [2.2, 730, 600] }); cut('dinner', { a: 1.4, b: 2.3, sp: 1.3, cam: [2.0, 1290, 560] }); cut('dinner', { a: 2.3, sp: 1.4 });
cut('swell34', { sp: 1.2 });
blink();
cut('a38', { sp: 1.6 }); cut('claws', { sp: 1.28 });
cut('lean38', { a: 0, b: .55, sp: 1.2, cam: [2.3, 330, 740] }); cut('lean38', { a: .55, sp: 1.2 });
cut('truth', { a: 0, b: 1.2, sp: 1.3 }); cut('truth', { a: 1.2, b: 2.0, sp: 1.25, cam: [2.2, 1400, 560] }); cut('truth', { a: 2.0, sp: 1.3 });
cut('fridge', { sp: 1.33 });
cut('inside', { sp: 1.33 }); cut('pound', { sp: 1.2 }); cut('floor', { sp: 1.4 });
cut('sink', { a: 0, b: 1.1, sp: 1.25 }); cut('sink', { a: 1.1, b: 2.1, sp: 1.25, cam: [1.55, 1380, 500] }); cut('sink', { a: 2.1, sp: 1.2 });
blink();
cut('day1', { a: 0, b: .7, sp: 1.3, cam: [2.2, 700, 760] }); cut('day1', { a: .7, sp: 1.4 });
cut('run', { sp: 1.5 });
cut('day14', { a: 0, b: 1.2, sp: 1.3 }); cut('day14', { a: 1.2, b: 1.9, sp: 1.3, cam: [2.2, 860, 760] }); cut('day14', { a: 1.9, sp: 1.3 });
cut('day40', { a: 0, b: 2.1, sp: 1.4 }); cut('day40', { a: 2.1, b: 2.9, sp: 1.3, cam: [2.4, 1470, 650] }); cut('day40', { a: 2.9, sp: 1.35 });
cut('day60', { sp: 1.15 }); cut('tempt', { sp: 1.4 }); cut('handShot', { sp: 1.15 });
cut('day90', { sp: 1.3 }); cut('lower', { sp: 1.2 }); cut('shelf', { sp: 1.25 });
cut('newDraw', { sp: 1.3 }); cut('samFace', { sp: 1.35 });
cut('kneel', { a: 0, b: 1.5, sp: 1.2 }); cut('kneel', { a: 1.5, b: 2.5, sp: 1.2, cam: [1.9, 1030, 660] }); cut('kneel', { a: 2.5, sp: 1.15 });
cut('night', { a: 0, b: 2.2, sp: 1.3 }); cut('night', { a: 2.2, b: 3.3, sp: 1.2, cam: [1.8, 990, 520] }); cut('night', { a: 3.3, sp: 1.2 });
cut('black', { sp: 1.15 });
