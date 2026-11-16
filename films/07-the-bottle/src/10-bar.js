// ---------- THE BAR: the set and the wide shots ----------
// World px, about 1920 x 1080: the back wall with the lit shelf, the counter top at y = BAR.top, the devil behind it,
// him on a stool seen from behind. p.round 1-3 says how far the evening has gone.
const BAR = { top: 706, sx0: 610, sx1: 1470, shelves: [268, 414, 560], his: [[900, 414], [1040, 414], [1180, 414]], clock: [330, 260, 66] };

// what is inside his three bottles: k = how far in (0 not there … 1 there), t for their own motion
function inWatch(t, k = 1) {
  if (k <= 0) return;
  const y = -70 + (1 - k) * -220;
  ctx.save(); ctx.translate(0, y); ctx.rotate(.12);
  rectf(-11, -64, 22, 128, rgba([60, 40, 30])); rectf(-11, -64, 22, 128, lg(-11, 0, 11, 0, [[0, [0, 0, 0], .35], [.5, [255, 255, 255], .12], [1, [0, 0, 0], .35]]));
  disc(0, 0, 30, rgba(PAL.brass)); disc(0, 0, 25, rgba([250, 236, 205]));
  ctx.strokeStyle = rgba([40, 26, 16]); ctx.lineCap = 'round';
  ctx.lineWidth = 4; line(0, 0, Math.sin(t * 9) * 12, -Math.cos(t * 9) * 12); ctx.lineWidth = 3; line(0, 0, Math.sin(t * 23) * 19, -Math.cos(t * 23) * 19);
  ctx.restore();
}
function inPhone(t, k = 1, ring = 1) {
  if (k <= 0) return;
  const y = -62 + (1 - k) * -220, sh = ring ? Math.sin(t * 70) * 1.6 : 0;
  ctx.save(); ctx.translate(sh, y); ctx.rotate(-.1 + sh * .01);
  ctx.fillStyle = '#0b0b10'; rrect(-25, -50, 50, 100, 9); ctx.fill();
  ctx.fillStyle = lg(0, -46, 0, 46, [[0, [36, 110, 70]], [1, [10, 36, 26]]]); rrect(-21, -46, 42, 92, 6); ctx.fill();
  if (ring) { ctx.strokeStyle = rgba([150, 255, 190], .5 * (.5 + .5 * Math.sin(t * 9))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -16, 9 + ((t * 14) % 10), 0, TAU); ctx.stroke(); }
  disc(0, -16, 8, rgba([200, 255, 220], .9));
  font(8.5, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([235, 255, 240]); ctx.fillText('SCHOOL', 0, 8);
  disc(-10, 30, 5.5, rgba([230, 70, 60])); disc(10, 30, 5.5, rgba([80, 220, 120]));
  ctx.restore();
}
function inPhoto(t, k = 1, o = {}) {
  if (k <= 0) return;
  lilyPhoto(0, -62 + (1 - k) * -220, 58, 70, Object.assign({ rot: -.08 + (1 - k) * .6, border: 5 }, o));
}

// the back wall: panelling, the lit shelf and its bottles, the clock. st: { watch, phone, photo (0-1), clock: 'ok' | 'loose' | 'none', red (0-1) }
function barWall(t, st = {}) {
  const red = st.red || 0, wallA = mix(PAL.tealD, [40, 6, 10], red), wallB = mix(PAL.teal, [90, 14, 18], red);
  ctx.fillStyle = lg(0, -300, 0, BAR.top, [[0, wallA], [1, wallB]]); ctx.fillRect(-1400, -900, 4800, 900 + BAR.top);
  ctx.fillStyle = rgba([0, 0, 0], .16); for (let x = -1300; x < 3400; x += 190) ctx.fillRect(x, -900, 5, 900 + BAR.top);   // panel seams
  // the shelf: a glowing back panel, three boards
  const { sx0, sx1, shelves } = BAR, glowC = mix(PAL.tealG, [255, 90, 70], red);
  ctx.fillStyle = lg(0, 120, 0, 600, [[0, mix([40, 132, 136], [170, 40, 34], red)], [1, mix([22, 84, 92], [100, 18, 18], red)]]); rrect(sx0 - 40, 106, sx1 - sx0 + 80, 492, 10); ctx.fill();
  additive(() => { lite(glowC, (sx0 + sx1) / 2, 350, 1300, .2); });
  for (const y of shelves) { rectf(sx0 - 40, y, sx1 - sx0 + 80, 13, rgba(mix(PAL.wood, [30, 6, 8], red))); rectf(sx0 - 40, y, sx1 - sx0 + 80, 3, rgba(mix(PAL.brass, [255, 110, 80], red), .7)); }
  // rows of plain bottles (no labels, no brands): dark glass against the glow
  shelves.forEach((y, r) => {
    for (let i = 0; i < 11; i++) {
      const x = sx0 + 8 + i * (sx1 - sx0 - 16) / 10;
      if (r === 1 && x > 820 && x < 1260) continue;                       // his three stand here
      const s = .36 + rnd(i * 3 + r * 17) * .1, hue = rnd(i * 7 + r * 5);
      bottle(x, y, s, { glass: hue < .4 ? [150, 235, 220] : hue < .7 ? [220, 240, 200] : [130, 200, 235], level: rnd(i + r * 31) * .8, liquid: mix(PAL.whisky, [90, 40, 10], rnd(i * 2 + r)), cork: 1 });
    }
  });
  // his three: empty until he pays
  const [b1, b2, b3] = BAR.his;
  bottle(b1[0], b1[1], .5, { glass: [190, 250, 240], cork: st.watch >= 1 ? 1 : -1, inner: () => inWatch(t, st.watch || 0), glowC: PAL.amber, glowA: (st.watch || 0) * .9 });
  bottle(b2[0], b2[1], .5, { glass: [190, 250, 240], cork: st.phone >= 1 ? 1 : -1, inner: () => inPhone(t, st.phone || 0), glowC: [110, 255, 170], glowA: (st.phone || 0) * .9 });
  bottle(b3[0], b3[1], .5, { glass: [190, 250, 240], cork: st.photo >= 1 ? 1 : -1, inner: () => inPhoto(t, st.photo || 0), glowC: PAL.yellow, glowA: (st.photo || 0) * 1 });
  // the clock on the wall
  const [cx, cy, cr] = BAR.clock;
  additive(() => lite(PAL.amber, cx, cy, 190, .16));
  wallClock(cx, cy, cr, st.hour ?? 5.083, { loose: st.clock === 'loose' ? 1 : 0, none: st.clock === 'none', spin: st.spin || 0 }, t);
  // a door and a window to the street on the far right (dusk, later night)
  const dusk = st.dusk ?? 1, sky = mix([10, 14, 40], [88, 96, 170], dusk);
  rectf(1660, 250, 200, 456, rgba([10, 12, 16])); rectf(1674, 264, 172, 250, rgba(sky)); additive(() => lite(sky, 1760, 390, 300, .25));
  ctx.strokeStyle = rgba([10, 12, 16]); ctx.lineWidth = 8; line(1760, 264, 1760, 514);
}
// the pendant lamps and their light
function barLamps(t, o = {}) {
  const dim = o.dim ?? 1, col = o.col || PAL.amber;
  for (const [x, y] of [[300, 150], [960, 110], [1620, 150]]) {
    const fl = 1 - .06 * Math.abs(Math.sin(t * 13 + x)) * (o.flicker || 0) * 6;
    ctx.strokeStyle = rgba([8, 10, 12]); ctx.lineWidth = 5; line(x, -900, x, y - 40);
    cone(x, y, 46, 330, BAR.top - y + 10, col, .26 * dim * fl);
    poly([[x - 30, y - 44], [x + 30, y - 44], [x + 64, y + 6], [x - 64, y + 6]], rgba([10, 12, 14]));
    ctx.strokeStyle = rgba(PAL.brass, .8); ctx.lineWidth = 3; line(x - 64, y + 6, x + 64, y + 6);
    additive(() => { lite(col, x, y + 16, 150, .95 * dim * fl); lite([255, 240, 210], x, y + 12, 44, 1 * dim * fl); });
    pool(x, BAR.top + 14, 330, 46, col, .4 * dim * fl);
  }
}
// the counter: a thick slab of dark wood with a glossy top that mirrors the shelf
function barCounter(t, o = {}) {
  const top = BAR.top, red = o.red || 0;
  ctx.fillStyle = lg(0, top, 0, top + 54, [[0, mix(PAL.woodL, [140, 40, 30], red)], [1, mix(PAL.wood, [50, 10, 10], red)]]); ctx.fillRect(-1400, top, 4800, 54);
  ctx.save(); ctx.beginPath(); ctx.rect(-1400, top, 4800, 54); ctx.clip();
  additive(() => { ctx.save(); ctx.translate(1040, top + 20); ctx.scale(1, .1); lite(mix(PAL.tealG, [255, 80, 60], red), 0, 0, 900, .55); ctx.restore(); });
  ctx.restore();
  rectf(-1400, top, 4800, 3, rgba([255, 226, 170], .5));
  ctx.fillStyle = lg(0, top + 54, 0, 1500, [[0, mix([30, 18, 14], [44, 8, 8], red)], [.5, mix([14, 10, 10], [20, 4, 4], red)], [1, [6, 6, 8]]]); ctx.fillRect(-1400, top + 54, 4800, 900);
  rectf(-1400, top + 54, 4800, 8, rgba([0, 0, 0], .5));
  ctx.fillStyle = rgba([255, 200, 140], .05); for (let x = -1300; x < 3400; x += 260) ctx.fillRect(x, top + 90, 200, 520);   // panels on the front
  rectf(-1400, top + 300, 4800, 10, rgba(PAL.brass, .35));                              // the foot rail
}
// empties on the counter by his hand: n glasses, the full one last
function barGlasses(t, n, full = 0, x0 = 760) {
  for (let i = 0; i < n; i++) tumbler(x0 + i * 62 + (i % 2) * 8, BAR.top + 2, .5, i === n - 1 ? full : 0, { glowA: 1 });
}
// him on his stool, from behind (x, the middle of his back; s scale). o: slump 0-1, sip 0-1 (right arm up), turn (head)
function manBack(x, s, o = {}) {
  const hipY = 884, sl = o.slump || 0, sh = hipY - (184 - 22 * sl) * s, lx = sl * 14 * s;
  const sip = o.sip || 0, elL = [x - 92 * s, BAR.top - 6], elR = [x + lerp(94, 104, sip) * s, lerp(BAR.top - 6, sh + 40 * s, sip)];
  const handR = [x + lerp(64, 58, sip) * s, lerp(BAR.top - 30, sh - 70 * s, sip)], handL = [x - 56 * s, BAR.top - 26];
  return { head: [x + lx + (o.turn || 0) * 14 * s, sh - (62 - 10 * sl) * s, 40 * s],
    parts: [
      [[[x - 26 * s, hipY + 6 * s], [x - 34 * s, hipY + 150 * s]], 32 * s], [[[x + 26 * s, hipY + 6 * s], [x + 34 * s, hipY + 150 * s]], 32 * s],
      [[[x, hipY], [x + lx * .5, sh + 12 * s]], 76 * s],
      [[[x - 42 * s + lx, sh + 10 * s], [x + 42 * s + lx, sh + 10 * s]], 36 * s],
      [[[x - 48 * s + lx, sh + 14 * s], elL, handL], 24 * s], [[[x + 48 * s + lx, sh + 14 * s], elR, handR], 24 * s]
    ], handR, handL, sh };
}
function stool(x, s) {
  rectf(x - 6 * s, 930, 12 * s, 260 * s, rgba([14, 12, 12]));
  ctx.strokeStyle = rgba(PAL.brass, .5); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.ellipse(x, 1040, 44 * s, 9 * s, 0, 0, TAU); ctx.stroke();
}
// the towel over its arm: it is the bartender
function stoolSeat(x, s) { oval(x, 934, 70 * s, 15 * s, rgba([30, 20, 16])); oval(x, 929, 70 * s, 12 * s, rgba(PAL.woodL, .75)); }
function towel(t, o) {
  const P = twinPose(t, o), A = P.arms[0], s = DEVIL.s, m = v2.lerp(A.el, A.wr, .45);
  ctx.save(); ctx.translate(m[0], m[1]); ctx.rotate(.08 + Math.sin(t * 1.4) * .02);
  ctx.fillStyle = lg(-22 * s, 0, 22 * s, 0, [[0, [236, 228, 214]], [1, [180, 172, 164]]]); rrect(-22 * s, -6 * s, 44 * s, 96 * s, 5 * s); ctx.fill();
  rectf(-22 * s, 74 * s, 44 * s, 5 * s, rgba([200, 60, 50], .8));
  ctx.restore();
}

// ---------- BAR WIDE: from behind him. p: round 1-3, st (shelf state), o(t, L) devil overrides, cam keys, glasses, full
const BAR_SPOT = { 1: [1050, 1030, .8], 2: [990, 1118, .97], 3: [760, 1262, 1.18] };
function barWide(t, p, L, len) {
  const round = p.round || 1, st = Object.assign({ dusk: 1.1 - round * .32, clock: round === 1 ? 'ok' : round === 2 ? 'loose' : 'none' }, p.st || {});
  const fr = kcam(L, len, p.cam || (round === 1 ? [[0, 1.2, 830, 560], [1, 1.34, 880, 536]] : [[0, 1.62, 800, 470], [1, 1.86, 850, 440]]), { hand: .5, t });
  fill(PAL.tealD, [4, 10, 12]); cam(...fr);
  barWall(t, st);
  haze(t, -200, 2100, 380, 260, PAL.tealL, .05, 3);
  // the devil behind the bar (rounds 1, 2), or on the stool beside him (round 3)
  placeDevil(p.spot || BAR_SPOT[round]);
  const base = round === 1 ? { a: 1, eyes: .85, grin: .25, lean: 0 } : round === 2 ? { a: 1, eyes: 1, grin: .55, lean: .75 } : { a: 1, eyes: 0, grin: 0, lean: .1 };
  const o = devilO(Object.assign(base, p.o ? p.o(t, L) : {}));
  if (round < 3) { drawDevil(t, fr, o); towel(t, o); devilEyes(t, o); devilGrin(t, o); }
  barLamps(t, { dim: 1 - .12 * (round - 1), flicker: round === 3 ? 1 : 0 });
  barCounter(t);
  barGlasses(t, p.glasses ?? round * 2 - 1, p.full ?? 1, 700);
  motes(t, [200, 160, 1700, 700], 26, PAL.amber, .22, 5);
  // him, big in front, a dark back against the lit bar
  const mx = 560, ms = 1.46, M = manBack(mx, ms, { slump: p.slump ?? (round - 1) * .4, sip: p.sip ? p.sip(L) : 0, turn: p.turn || 0 });
  stool(mx, ms);
  if (round === 3) {                                                       // it sits beside him, its arm round his shoulders
    o.reach = 1; o.targets = [[mx - 70, M.sh + 26], [mx + 88, M.sh + 30]];
    drawDevil(t, fr, o);
  }
  drawMan(M, 'tired', { face: false, rim: PAL.amber, a: .62, lx: 1, ly: -.25 });
  stoolSeat(mx, ms);
  if (round === 3) devilArms(t, o);
  additive(() => lite(PAL.amber, mx, 520, 420, .1));
  blurred(7, () => { bottle(1790, 1130, 1.9, { glass: [150, 235, 220], level: .5, cork: 1, a: .9 }); });   // a bottle near the lens
}
shot('barwide', barWide, { bloom: .42, grain: .55 }, [380, 200, 1320, 900]);
