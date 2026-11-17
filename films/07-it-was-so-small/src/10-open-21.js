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
