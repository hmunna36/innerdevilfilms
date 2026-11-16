// ---------- THE BAR, CLOSE: the bottle, the glass, the hands (side-on, at bar height) ----------
// MAC.y is the line where things stand on the counter; below it the bar's dark front (the devil's lines sit there).

const MAC = { y: 720 };
// the back bar out of focus: a teal glow, the soft shapes of bottles, lamp bokeh. red 0-1 turns it to the devil's light
function macBg(t, o = {}) {
  const red = o.red || 0, a = mix(PAL.tealD, [36, 4, 8], red), b = mix([20, 78, 86], [120, 16, 20], red);
  fill(a, b);
  additive(() => { lite(mix(PAL.tealG, [255, 70, 50], red), o.gx ?? 960, 330, 900, .34); lite(mix(PAL.amber, [255, 60, 40], red), o.lx ?? 960, -80, 700, .5 * (o.lamp ?? 1)); });
  blurred(14, () => {
    for (let i = 0; i < 9; i++) {
      const x = -100 + i * 270 + rnd(i + 3) * 60, h = 300 + rnd(i * 5) * 160, c = mix(rnd(i) < .5 ? [70, 190, 180] : [230, 150, 60], [255, 70, 50], red);
      ctx.fillStyle = rgba(c, .34); rrect(x, 620 - h, 96, h, 20); ctx.fill(); rrect(x + 32, 620 - h - 90, 32, 100, 8); ctx.fill();
    }
  });
  bokeh(41, 16, [-100, 40, 2020, 560], red > .5 ? [[255, 80, 50], [255, 150, 90]] : [PAL.amber, PAL.tealG, [255, 226, 170]], 18, 62, .22, t);
}
// the counter seen side-on: the glossy top edge at MAC.y and the dark front below it
function macBar(t, o = {}) {
  const y = o.y ?? MAC.y, red = o.red || 0;
  ctx.fillStyle = lg(0, y, 0, y + 70, [[0, mix([150, 92, 50], [170, 50, 36], red)], [1, mix([52, 30, 20], [60, 12, 10], red)]]); ctx.fillRect(-2000, y, 6000, 70);
  rectf(-2000, y, 6000, 4, rgba([255, 232, 180], .7));
  ctx.fillStyle = lg(0, y + 70, 0, y + 500, [[0, mix([26, 16, 13], [40, 8, 8], red)], [1, mix([10, 8, 8], [16, 4, 4], red)]]); ctx.fillRect(-2000, y + 70, 6000, 900);
  rectf(-2000, y + 70, 6000, 10, rgba([0, 0, 0], .5));
}
// what stands on the counter is mirrored in its polish
const macGloss = (t, a = .28) => wet(MAC.y + 4, 62, a, t, 1.5);

// his hand, close: a dark hand with a lit edge. wrist [x, y], ang the way the forearm points (radians, 0 = right);
// o: curl 0 open … 1 fist, s, rim, ra, arm (forearm length drawn), side (1: thumb on the upper side), pinch (thumb meets the fingers)
function manHand(wrist, ang, o = {}) {
  const s = o.s || 1, curl = o.curl ?? .2, side = o.side ?? 1, rim = o.rim || PAL.amber, ra = o.ra ?? .7, arm = (o.arm ?? 1200) * s;
  const dir = k => [Math.cos(k), Math.sin(k)], P = [];
  const back = v2.sub(wrist, v2.mul(dir(ang), arm)), palm = v2.add(wrist, v2.mul(dir(ang), 58 * s));
  P.push([[back, wrist], 66 * s]); P.push([[wrist, palm], 78 * s]);
  for (let f = 0; f < 4; f++) {
    const off = (f - 1.5) * 21 * s, base = v2.add(palm, v2.mul(dir(ang + Math.PI / 2), off)), a1 = ang - side * curl * .9 + (f - 1.5) * .05 * (1 - curl);
    const k1 = v2.add(base, v2.mul(dir(a1), 44 * s)), k2 = v2.add(k1, v2.mul(dir(a1 - side * (.2 + curl * 1.3)), 36 * s));
    P.push([[base, k1, k2], 19 * s]);
  }
  const tb = v2.add(wrist, v2.mul(dir(ang - side * 1.2), 36 * s)), ta = ang - side * lerp(.75, .1, o.pinch ?? curl * .6);
  P.push([[v2.add(wrist, v2.mul(dir(ang), 10 * s)), tb, v2.add(tb, v2.mul(dir(ta), 46 * s))], 22 * s]);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(rim, ra); ctx.shadowBlur = 18 * VP.k; ctx.strokeStyle = rgba(rim, ra);
  for (const [pts, w] of P) limb(pts.map(p => [p[0] + (o.lx ?? 0) * 4, p[1] + (o.ly ?? -1) * 4]), w + 6 * s);
  ctx.shadowBlur = 0; ctx.strokeStyle = rgba(PAL.ink);
  for (const [pts, w] of P) limb(pts, w);
  ctx.strokeStyle = rgba(mix(PAL.ink, rim, .3), .5); limb([back, wrist].map(p => [p[0], p[1] - 14 * s]), 14 * s);
  ctx.restore();
  return { palm, tip: v2.add(palm, v2.mul(dir(ang), 70 * s)) };
}

// Lily inside a bottle (bottle units: feet at (x, -8)); mode 'pound' | 'look' | 'back'
const LILY_FEAR = { lid: 0, brow: .95, browH: .18, smile: -.5, open: .4, grit: 0, gx: .6, gy: -.5, tear: 0, sweat: 0 };
function inGirl(t, o = {}) {
  const s = o.s || .62, back = o.back || 0, x = lerp(8, -16, back), beat = Math.floor(t * 5), ph = (t * 5) % 1, hit = Math.exp(-ph * 9);
  const up = beat % 2, fist = k => [x + (30 + 7 * k) * 1, -74 - 18 * (1 - k)];
  const arms = back > .5 ? [[x + 12, -70], [x + 8, -72]] : [fist(up ? hit : .2), fist(up ? .2 : hit)];
  const P = lily({ at: [x, -8], s, dir: 1, pose: 'stand', arms, lean: lerp(.16, -.14, back), look: lerp(2, -2, back), nod: -back * 3 });
  drawLily(P, back > .4 ? LILY_FEAR : LILY_EX.worry, { a: 1, glow: .9, turn: lerp(.85, .5, back) });
  return { hit: back > .5 ? 0 : hit, at: [x + 44, -80] };
}

// cold capitals typed one by one, heavy enough to read on a phone, with a dark edge so they hold on any picture
function macType(txt, cx, y, size, k, a, t, col = [226, 236, 246]) {
  font(size, SANS, '600'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const track = size * .13, chars = [...txt], ws = chars.map(c => ctx.measureText(c).width);
  let x = cx - (ws.reduce((p, w) => p + w, 0) + track * (chars.length - 1)) / 2;
  const n = chars.length * k, f = Math.floor(t * 20);
  ctx.save(); ctx.shadowColor = `rgba(0,0,0,${.9 * a})`; ctx.shadowBlur = 16 * VP.k;
  chars.forEach((c, i) => { const al = clamp(n - i); if (al > 0) { ctx.fillStyle = rgba(col, a * al); ctx.fillText(c, x + (rnd(i + f * 31) - .5) * 1.4, y + (rnd(i + f * 17) - .5) * 1.1); } x += ws[i] + track; });
  ctx.restore();
}
// ---------- COLD: the bottle, the girl inside, the hand that takes it ----------
function macCold(t, p, L, len) {
  const red = seg(L, 1.3, 2.6), lift = seg(L, 2.5, 3.6, E.in), bx = 1250, by = 936 - lift * 150, tilt = lift * -.1 + (L < 1.7 ? Math.sin(L * 31) * .004 : 0);
  macBg(t, { red: red * .8, gx: 1250, lx: 1250, lamp: 1 - red * .5 });
  const fr = kcam(L, len, [[0, 1.0, 960, 560], [.45, 1.05, 990, 552], [1, 1.16, 1060, 530]], { hand: .5, t });
  // it, behind the glass
  placeDevil([1392, 2790, 3]);
  const o = devilO({ a: seg(L, 1.25, 1.9), eyes: seg(L, 1.2, 1.7), grin: seg(L, 1.9, 2.7), lean: .2 });
  if (o.a > 0) { drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o); }
  cam(...fr);
  macBar(t, { y: 936, red: red * .7 });
  cone(bx, -200, 60, 420, 1200, mix(PAL.amber, [255, 80, 60], red), .2);
  pool(bx, 950, 420, 34, mix(PAL.amber, [255, 80, 60], red), .5);
  let hitA = 0;
  bottle(bx, by, 3.6, { tilt, cork: 1, glass: mix([200, 252, 244], [255, 170, 150], red * .6), glowC: PAL.yellow, glowA: .26, hot: red * .5,
    inner: () => { const g = inGirl(t, { back: seg(L, 1.75, 2.15) }); hitA = g.hit; } });
  if (hitA > .05) { ctx.save(); ctx.translate(bx + 172, by - 290); ctx.strokeStyle = rgba(PAL.yellowL, .8 * hitA); ctx.lineWidth = 5;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, i * 26 * (1.2 - hitA * .4), -.9, .9); ctx.stroke(); } ctx.restore(); }
  wet(940, 110, .3, t, 2);
  // its hand closes round the bottle like the bars of a cage
  const k = seg(L, 1.55, 2.1, E.out);
  if (k > 0) claw([lerp(2600, 1760, k), by - 300 + (1 - k) * 60], Math.PI + .04, 3.1, { curl: lerp(.02, .2, seg(L, 2.0, 2.4)), spread: 1.25, arm: 600, side: -1 });
  blurred(9, () => tumbler(250, 1080, 3.4, .35, { a: .85 }));
  screen();
  ctx.fillStyle = rgba(PAL.red, .1 * red); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (!OUT.vertical) {
    macType('YOU DRINK TO FORGET…', 525, 415, 60, seg(L, .12, .7, E.lin), 1 - lift, t);
    macType('GUESS WHO REMEMBERS.', 525, 525, 60, seg(L, .9, 1.5, E.lin), 1 - lift, t);
  } else { ui(); typeBlock([['YOU DRINK TO FORGET…', seg(L, .15, .8, E.lin)], ['GUESS WHO REMEMBERS.', seg(L, .95, 1.55, E.lin)]], 620, 60, COLD_COL, 1 - lift, t, OUT.w / 2, 840); }
}
shot('cold', macCold, { bloom: .36, grain: .6 }, [900, 120, 1620, 1000]);

// ---------- POUR: its claw tips a bottle, the glass fills ----------
function macPour(t, p, L, len) {
  macBg(t, { gx: 700 });
  const fr = kcam(L, len, [[0, 1.25, 900, 560], [1, 1.45, 880, 600]], { hand: .4, t });
  macBar(t);
  const k = seg(L, .1, .95, E.sine), lvl = .75 * k, gx = 860, pour = pulse(L, .08, .95, .08, .12);
  cone(gx, -200, 50, 300, 940, PAL.amber, .2); pool(gx, MAC.y + 14, 340, 30, PAL.amber, .6);
  // the stream
  const mouth = [gx + 46, 318];
  if (pour > 0) { ctx.strokeStyle = lg(0, mouth[1], 0, MAC.y - 30, [[0, [255, 214, 130], .95 * pour], [1, [214, 120, 30], .95 * pour]]); ctx.lineWidth = 15 + Math.sin(t * 40) * 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mouth[0], mouth[1]); ctx.quadraticCurveTo(gx + 14, 420, gx + 4 + Math.sin(t * 30) * 3, MAC.y - 30 - lvl * 150); ctx.stroke();
    additive(() => lite(PAL.amber, gx, MAC.y - 60 - lvl * 120, 120, .7 * pour)); }
  tumbler(gx, MAC.y, 2.3, lvl, { slosh: Math.sin(t * 22) * .5 * pour, glowA: 1.4 });
  for (let i = 0; i < 7; i++) { const a = ((L * 2.4 + rnd(i * 3)) % 1), ang = -1.57 + (rnd(i * 7) - .5) * 1.6; if (pour > .3) disc(gx + Math.cos(ang) * a * 110, MAC.y - 150 - lvl * 80 + Math.sin(ang) * a * 130 + a * a * 150, 5 * (1 - a), rgba([255, 200, 110], .9 * (1 - a))); }
  macGloss(t);
  // the bottle, tipped, in its claw
  const tip = lerp(-1.9, -2.2, k);
  ctx.save(); ctx.translate(mouth[0] + 2, mouth[1] + 4); ctx.rotate(tip); ctx.translate(0, 304 * 2.1);
  bottle(0, 0, 2.1, { glass: [120, 210, 190], dense: .9, level: .7 - .3 * k, cork: -1, hot: .3 }); ctx.restore();
  claw([1610, 20], Math.PI - .42, 2.1, { curl: .5, spread: 1.1, arm: 700, side: -1 });
}
shot('pour', macPour, { bloom: .55, grain: .55 }, [560, 200, 1280, 900]);

// ---------- SLIDE: the glass comes down the bar into his hand ----------
function macSlide(t, p, L, len) {
  macBg(t, { gx: 1400 });
  const k = seg(L, .05, .78, E.out), gx = lerp(1700, 760, k);
  const fr = kcam(L, len, [[0, 1.55, 1560, 610], [.8, 1.65, 880, 610], [1, 1.75, 840, 610]], { ease: E.out, t });
  macBar(t);
  pool(gx, MAC.y + 12, 300, 26, PAL.amber, .5);
  for (let i = 1; i < 7; i++) tumbler(gx + i * 34 * (1 - k) * 2.2, MAC.y, 1.7, .72, { a: .1 * (1 - k), glowA: 0 });   // the streak behind it
  tumbler(gx, MAC.y, 1.7, .72, { slosh: (1 - k) * 1.6 * Math.sin(L * 30) - (k > .95 ? Math.sin(L * 40) * .3 : 0), glowA: 1.3 });
  macGloss(t);
  claw([lerp(1960, 2300, seg(L, 0, .4)), 600], Math.PI + .1, 1.9, { curl: .1, arm: 600, side: -1 });
  manHand([lerp(380, 560, seg(L, .3, .8, E.out)), MAC.y - 78], .05, { s: 1.5, curl: lerp(.1, .55, seg(L, .7, .95)), arm: 900, side: -1 });
}
shot('slide', macSlide, { bloom: .5, grain: .55 }, [500, 300, 1300, 900]);

// ---------- EMPTY: he taps his empty glass for more. It does not pour ----------
function macEmpty(t, p, L, len) {
  macBg(t, { gx: 1300, lamp: .8 });
  const fr = kcam(L, len, [[0, 1.5, 900, 600], [1, 1.62, 960, 600]], { hand: .3, t });
  macBar(t);
  const tap = Math.max(Math.exp(-Math.max(0, L - .3) * 14) * (L > .3), Math.exp(-Math.max(0, L - .75) * 14) * (L > .75)), gx = 800;
  pool(gx, MAC.y + 12, 300, 26, PAL.amber, .4);
  tumbler(gx, MAC.y - tap * 16, 1.9, .02, { tilt: tap * .1, glowA: 0 });
  for (let i = 0; i < 4; i++) tumbler(260 - i * 120, MAC.y, 1.7, 0, { a: .75, glowA: 0 });
  bottle(1380, MAC.y, 2.2, { glass: [150, 230, 215], level: .02, cork: -1 });
  macGloss(t);
  manHand([560, MAC.y - 150 - tap * 14], .32, { s: 1.5, curl: .6, arm: 900, side: -1 });
  claw([1900, MAC.y - 60], Math.PI + .02, 2.1, { curl: .12, arm: 600, side: -1, spread: 1 });
}
shot('empty', macEmpty, { bloom: .4, grain: .6 }, [500, 300, 1500, 900]);

// ---------- BOTTLE IN: one of his three bottles takes what he paid. p.n 1 watch | 2 phone | 3 photo ----------
function macBottleIn(t, p, L, len) {
  const n = p.n || 1, u = L / len, col = [PAL.amber, [110, 255, 170], PAL.yellow][n - 1];
  macBg(t, { gx: 960 });
  const fr = kcam(L, len, [[0, 1.05, 960, 520], [1, 1.2, 960, 540]], { hand: .4, t });
  // the shelf board it stands on
  rectf(-2000, 860, 6000, 30, rgba(PAL.wood)); rectf(-2000, 860, 6000, 5, rgba(PAL.brass, .8));
  const drop = seg(u, .04, .42, E.in), land = seg(u, .42, .55, E.out), cork = lerp(-1, 1, seg(u, .55, .78, E.out)), flash = pulse(u, .4, .6, .04, .16);
  for (const [dx, dn] of [[-520, 0], [520, 1]]) blurred(6, () => bottle(960 + dx, 860, 2.5, { glass: [170, 240, 230], cork: n > dn + 1 || (dn === 0 && n > 1) ? 1 : -1, glowC: [PAL.amber, [110, 255, 170]][dn], glowA: (dn === 0 ? n > 1 : n > 2) ? .7 : 0, a: .9 }));
  bottle(960, 860, 2.8, { glass: [200, 252, 244], cork, glowC: col, glowA: land * 1.1 + flash,
    inner: () => { ctx.translate(0, -(1 - drop) * 250 + Math.sin(land * Math.PI) * -10); ctx.scale(1.25, 1.25);
      if (n === 1) inWatch(t, 1); else if (n === 2) inPhone(t, 1, 1); else inPhoto(t, 1); } });
  additive(() => lite(col, 960, 600, 520, .5 * flash));
  // the claw's finger pushes the cork home
  const push = seg(u, .5, .72, E.out), away = seg(u, .8, 1);
  claw([960 + 420 + away * 500, lerp(-420, -150, push) - away * 300], Math.PI * .68, 2.6, { point: 1, arm: 700, side: -1 });
  blurred(10, () => bottle(120, 1160, 3.2, { glass: [150, 230, 215], cork: 1, a: .8, level: .4 }));
}
shot('bottlein', macBottleIn, { bloom: .6, grain: .55 }, [620, 60, 1300, 1000]);

// ---------- THE TWIST: it sets the third bottle in front of him. In the photo she turns, looks at him, and knocks ----------
function macTwist(t, p, L, len) {
  const inK = seg(L, 0, .5, E.out), alive = seg(L, .85, 1.35), bx = lerp(1700, 1010, inK), knocks = [1.5, 1.86, 2.22];
  let kn = 0; for (const k of knocks) if (L > k) kn = Math.max(kn, Math.exp(-(L - k) * 10));
  macBg(t, { gx: 1010, lamp: .7, red: .12 });
  const fr = kcam(L, len, [[0, 1.0, 960, 560], [.3, 1.05, 990, 540], [1, 1.75, 1010, 470]], { hand: .25, t });
  macBar(t);
  pool(bx, MAC.y + 12, 380, 30, PAL.yellow, .35 + .3 * kn);
  bottle(bx, MAC.y, 3.0, { glass: [205, 252, 246], cork: 1, glowC: PAL.yellow, glowA: .55 + .5 * kn + .3 * alive, tilt: (1 - inK) * .05,
    inner: () => {
      lilyPhoto(0, -92, 76, 96, { rot: -.03, border: 3, ex: mixExpr(LILY_EX.happy, LILY_EX.hurt, alive), alive, wave: 1 - alive });
      if (alive > .5) {                                                      // her small fist on the glass, from inside
        const up = 1 - kn, hx = 20, hy = -66 + up * 4;
        stroke([[6, -44], [hx - 3, hy + 12]], 11, rgba(PAL.yellow)); stroke([[hx - 3, hy + 12], [hx - 3, hy + 10]], 13, rgba(PAL.yellowL));
        disc(hx, hy, 8.5 + kn * 2, rgba([9, 10, 14])); for (let f = 0; f < 4; f++) disc(hx - 6 + f * 4, hy - 6 - kn, 2.6, rgba([9, 10, 14]));
        ctx.strokeStyle = rgba([255, 255, 255], .9 * kn); ctx.lineWidth = 1.8; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(hx, hy, 6 + i * 8 * (1.3 - kn * .6), 0, TAU); ctx.stroke(); }
      }
    } });
  macGloss(t, .3);
  claw([bx + 560 + seg(L, .5, .9) * 700, MAC.y - 330], Math.PI + .05, 2.6, { curl: .16, spread: 1.2, arm: 600, side: -1, a: 1 - seg(L, .6, 1.0) });
  blurred(12, () => { disc(214, 884, 338, rgba(PAL.amber, .3)); disc(200, 890, 330, rgba([9, 10, 14])); });     // the back of his head, soft, at the edge of frame
}
shot('twist', macTwist, { bloom: .55, grain: .6 }, [700, 100, 1320, 960]);

// ---------- SMASH: his arm sweeps the three bottles off the bar ----------
function macShards(L, x0, y0, n, col, seed) {
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI * (.08 + rnd(seed + i * 3) * .62), v = 700 + rnd(seed + i * 5) * 1500, x = x0 + Math.cos(ang) * v * L, y = y0 + Math.sin(ang) * v * L + 1500 * L * L, r = 14 + rnd(seed + i * 7) * 46;
    ctx.save(); ctx.translate(x, y); ctx.rotate(L * (4 + rnd(seed + i) * 10) * (i % 2 ? 1 : -1));
    ctx.fillStyle = rgba(mix([200, 250, 240], col, .35), .5); ctx.strokeStyle = rgba([240, 255, 250], .9); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-r, -r * .4); ctx.lineTo(r * .8, -r * .7); ctx.lineTo(r * .3, r * .8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
}
function macSmash(t, p, L, len) {
  const hitT = .22, d = L - hitT, sw = seg(L, .08, .5, E.out), cols = [PAL.amber, [110, 255, 170], PAL.yellow];
  macBg(t, { red: lerp(.8, .2, seg(L, .3, 1.1)), gx: 960 });
  const fr = kcam(L, len, [[0, 1.1, 940, 540], [.2, 1.02, 1000, 540], [1, 1.1, 1080, 520]], { jolt: d > 0 ? Math.exp(-d * 7) : 0, t });
  macBar(t, { red: lerp(.6, .1, seg(L, .3, 1.1)) });
  [660, 960, 1260].forEach((x, i) => {
    const hit = L - (hitT + i * .07);
    if (hit < 0) bottle(x, MAC.y, 2.3, { glass: [205, 252, 246], cork: 1, glowC: cols[i], glowA: .8, inner: () => { ctx.scale(1.2, 1.2); if (i === 0) inWatch(t, 1); else if (i === 1) inPhone(t, 1, 1); else inPhoto(t, 1); } });
    else {
      macShards(hit, x, MAC.y - 260, 22, cols[i], i * 100);
      additive(() => { lite(cols[i], x, MAC.y - 280, 500 + hit * 600, Math.exp(-hit * 5) * 1.1); lite([255, 255, 255], x, MAC.y - 280, 220, Math.exp(-hit * 12)); });
      const ox = x + 380 * hit, oy = MAC.y - 300 - 500 * hit + 1300 * hit * hit;        // what was inside flies free
      ctx.save(); ctx.translate(ox, Math.min(oy, MAC.y - 40)); ctx.rotate(hit * (3 - i)); ctx.scale(2.6, 2.6); ctx.translate(0, 64);
      if (i === 0) inWatch(t, 1); else if (i === 1) inPhone(t, 1, 1); else inPhoto(t, 1); ctx.restore();
    }
  });
  macGloss(t, .22);
  for (let g = 3; g >= 0; g--) { const q = clamp(sw - g * .05); ctx.save(); ctx.globalAlpha = g ? .16 : 1; manHand([lerp(-300, 2500, q), MAC.y - 250 - Math.sin(q * Math.PI) * 70], -.06, { s: 1.7, curl: .95, arm: 1500, rim: PAL.amber, side: -1 }); ctx.restore(); }
  screen(); if (d > 0) { ctx.fillStyle = rgba([255, 255, 255], .7 * Math.exp(-d * 16)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('smash', macSmash, { bloom: .7, grain: .6 }, [300, 100, 1620, 980]);
