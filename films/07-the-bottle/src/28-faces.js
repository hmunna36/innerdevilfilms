// ---------- FACES: his, close; the devil's, close; the two of them; the reveal ----------

EXPR.tempted = { lid: .16, brow: .7, browH: .08, smile: -.35, open: .12, grit: 0, gx: -.9, gy: .35, tear: 0, sweat: .5 };
// a dark bed along the bottom of the red shots, so its red words hold against the red room
function redBed() { screen(); ctx.fillStyle = lg(0, 700, 0, 1010, [[0, [6, 0, 2], 0], [1, [6, 0, 2], .86]]); ctx.fillRect(-W, 700, 3 * W, H); }
// what is behind his face, by look
const FACE_LOOK = {
  bar: { rim: PAL.amber, lc: [.7, -.5], fill: [9, 12, 15], bg: (t, L) => macBg(t, { gx: 1300 }) },
  red: { rim: [255, 96, 70], lc: [.8, -.2], fill: [12, 6, 8], bg: (t, L) => macBg(t, { red: 1, gx: 1400 }) },
  dawn: { rim: [255, 206, 150], lc: [.85, -.3], fill: [22, 14, 18], bg: (t, L) => { fill([250, 170, 130], [226, 120, 110]); additive(() => lite([255, 226, 170], 1750, 260, 900, .45)); bokeh(71, 12, [0, 0, 1920, 1080], [[255, 236, 200], [255, 190, 150]], 30, 90, .18, t); } },
  street: { rim: [255, 140, 70], lc: [-.8, -.2], fill: [8, 10, 18], bg: (t, L) => { fill([10, 14, 40], [28, 36, 84]); additive(() => { lite([255, 96, 50], -100, 560, 1000, .55); lite(PAL.rainB, 1700, 300, 900, .25); });
    bokeh(83, 14, [300, 0, 1920, 900], [PAL.lamp, PAL.rainB, [255, 150, 80]], 24, 80, .22, t); } }
};
// p: look, from / to (expressions), at (u where it changes, default .3), jerk (he recoils at the start), rain, dir, sweat
function faceHis(t, p, L, len) {
  const K = FACE_LOOK[p.look || 'bar'], u = L / len, k = seg(u, p.at ?? .3, (p.at ?? .3) + .28);
  const ex = Object.assign({}, exMix(p.from || 'tired', p.to || p.from || 'tired', k));
  const ph = (t % 3.1); if (ex.open < .4 && ph < .12 && !p.noblink) ex.lid = Math.max(ex.lid, 1 - Math.abs(ph - .06) / .06);
  K.bg(t, L);
  const jerk = p.jerk ? Math.exp(-L * 7) : 0, tr = p.tremble ? Math.sin(t * 46) * 3 * (1 - k) : 0;
  const fr = kcam(L, len, p.cam || [[0, 1.0, 960, 540], [1, 1.13, 960, 520]], { hand: .4, t });
  const x = 900 + tr + (p.dx || 0), y = 500 - jerk * 26 + Math.sin(t * 1.4) * 4, r = 262 * (1 + jerk * .05);
  manBust(x, y, r, ex, { rim: K.rim, lc: K.lc, fill: K.fill, turn: p.turn ?? .8, dir: p.dir || 1, wet: 0, t, tilt: (p.tilt || 0) + Math.sin(t * 1.1) * .012, la: .4 });
  if (p.sweat) { ctx.fillStyle = rgba([255, 244, 230], .8); for (let i = 0; i < 4; i++) { const q = (t * (.5 + rnd(i) * .3) + rnd(i * 3)) % 1; ctx.beginPath(); ctx.ellipse(x - 150 + i * 96, y - 150 + q * 200, 7, 12, 0, 0, TAU); ctx.fill(); } }
  if (p.rain) rain(t, { n: 110, a: .36, len: 120 });
  if (p.look === 'street') blurred(12, () => { screen(); ctx.fillStyle = rgba([255, 70, 40], .16 + .08 * Math.sin(t * 9)); ctx.fillRect(-W, 0, W + 420, H); });
}
shot('hisface', faceHis, { bloom: .45, grain: .6 }, [560, 180, 1260, 900]);

// ---------- DRINK: his head goes back, the glass empties ----------
function faceDrink(t, p, L, len) {
  const k = seg(L, .1, .75, E.io), dn = seg(L, .95, len, E.io);
  macBg(t, { gx: 1500 });
  blurred(16, () => { additive(() => { for (const sd of [-1, 1]) lite([255, 60, 40], 1620 + sd * 46, 330, 60, .9); lite([255, 60, 40], 1620, 400, 420, .4); }); });   // it watches, soft, from behind the bar
  const fr = kcam(L, len, [[0, 1.05, 940, 540], [1, 1.2, 900, 500]], { hand: .4, t });
  const tilt = -.5 * k + .5 * dn * .6, x = 820, y = 520, r = 250;
  manBust(x, y, r, exMix('tired', 'sleep', k), { rim: PAL.amber, lc: [.8, -.4], turn: 1, tilt, la: .45, light: [255, 190, 110] });
  const ca = Math.cos(tilt), sa = Math.sin(tilt), mo = [x + (r * .52) * ca - (r * .47) * sa, y + (r * .52) * sa + (r * .47) * ca];   // his mouth
  const ga = lerp(-.25, -1.5, k) + dn * .9, gs = 1.9, cg = Math.cos(ga), sg = Math.sin(ga);
  const C = [mo[0] + 50 * gs * cg - 52 * gs * sg, mo[1] + 50 * gs * sg + 52 * gs * cg];                                               // the middle of the glass
  additive(() => lite(PAL.amber, C[0], C[1], 300, .45 * (1 - k)));
  ctx.save(); ctx.translate(mo[0], mo[1]); ctx.rotate(ga); tumbler(50 * gs, 104 * gs, gs, .72 * (1 - k), { slosh: -2.4 * k, glowA: 1.2 }); ctx.restore();
  manHand([C[0] + 150, C[1] + 150], -2.36 - .1 * k, { s: 1.4, curl: .8, arm: 900, rim: PAL.amber, side: 1 });
}
shot('drink', faceDrink, { bloom: .5, grain: .6 }, [480, 120, 1300, 960]);

// ---------- TWO-SHOT: its face at his ear, its arm round his shoulders ----------
function faceTwo(t, p, L, len) {
  macBg(t, { gx: 300, red: .35, lamp: .7 });
  const fr = kcam(L, len, [[0, 1.02, 960, 540], [1, 1.14, 1010, 520]], { hand: .4, t });
  placeDevil([1050 + Math.sin(L * .9) * 8, 2470, 2.55]);
  const o = devilO({ a: 1, eyes: 1, grin: lerp(.5, .95, seg(L, .3, 1.2)), lean: .32 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  const sl = Math.sin(t * 1.2) * 3;
  manBust(690, 560 + sl, 250, exMix('glazed', 'empty', seg(L, .2, 1.2)), { rim: [255, 110, 80], lc: [.9, -.1], turn: .55, tilt: .1, la: .45, light: [255, 120, 90], fill: [9, 10, 14] });
  claw([180, 1160], -1.02, 2.5, { curl: .5, spread: 1.15, arm: 500, side: 1 });           // its hand on his far shoulder
  blurred(10, () => tumbler(1700, 1120, 3.2, .4, { a: .9 }));
}
shot('twoshot', faceTwo, { bloom: .5, grain: .6 }, [380, 120, 1500, 860]);

// ---------- HER PHOTO, in his hand ----------
function facePhoto(t, p, L, len) {
  macBg(t, { gx: 500, red: .3 });
  const fr = kcam(L, len, [[0, 1.05, 960, 540], [1, 1.2, 960, 520]], { hand: .5, t }), th = seg(L, .35, 1.1, E.io);
  additive(() => lite([255, 60, 40], 1900, 500, 800, .35 + .15 * Math.sin(t * 5)));
  const rot = -.08 + Math.sin(t * 1.3) * .012, px0 = 960, py0 = 500;
  lilyPhoto(px0, py0 - 20, 470, 540, { rot, border: 26, wave: 1, ex: 'happy', dim: th * .2 });
  // his thumb comes up across her face
  const tb = [px0 - 400, py0 + 640], tt = [lerp(px0 - 250, px0 - 40, th), lerp(py0 + 330, py0 + 40, th)];
  ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = rgba(PAL.amber, .7); ctx.shadowBlur = 16 * VP.k; stroke([tb, tt], 178, rgba(PAL.amber, .6)); ctx.shadowBlur = 0;
  stroke([tb, tt], 168, rgba(PAL.ink)); stroke([[tb[0] - 30, tb[1] - 30], [tt[0] - 34, tt[1] - 16]], 30, rgba(mix(PAL.ink, PAL.amber, .3), .45)); ctx.restore();
  blurred(5, () => { ctx.lineCap = 'round'; for (let f = 0; f < 3; f++) stroke([[px0 + 250 + f * 8, py0 + 130 + f * 100], [px0 + 330, py0 + 150 + f * 100]], 84, rgba(PAL.ink)); });   // his fingers behind its edge
}
shot('photohand', facePhoto, { bloom: .5, grain: .6 }, [600, 140, 1320, 900]);

// ---------- ITS FACE, close: the bar gone red ----------
function faceDevil(t, p, L, len) {
  fill([70, 8, 12], [20, 2, 4]);
  placeDevil([960 + (p.dx || 0), 1640, 1.5]);
  const o = devilO({ a: 1, eyes: 1, grin: p.grin ?? lerp(.6, 1, seg(L, 0, .5)), lean: p.lean ?? .1, scream: p.scream || 0 }), [hx, hy] = devilHead(t, o);
  const tw = (L > .7 && L < .76) || (L > 1.25 && L < 1.3) ? 12 : 0;
  const fr = kcam(L, len, [[0, 2.15, hx + tw, hy + 30], [1, 2.5, hx + tw, hy + 36]], { t });
  barWall(t, { red: 1, clock: 'none' });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  screen(); ctx.fillStyle = rgba(PAL.red, .1 + .06 * Math.sin(t * 6)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (!p.nobed) redBed();
}
shot('devface', faceDevil, { bloom: .55, grain: .65 }, [620, 120, 1300, 820]);

// ---------- IT TOWERS behind the bar (under "YOU HANDED HER OVER.") ----------
function faceTower(t, p, L, len) {
  fill([60, 6, 10], [14, 2, 4]);
  const fr = kcam(L, len, [[0, 1.0, 900, 470], [1, 1.12, 900, 430]], { jolt: Math.exp(-L * 6) * .6, t });
  barWall(t, { red: 1, clock: 'none', watch: 1, phone: 1, photo: 1 });
  placeDevil([930, 1640, 1.95]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .6, reach: .0 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  barLamps(t, { dim: .5, col: [255, 90, 60], flicker: 1 });
  barCounter(t, { red: 1 });
  const M = manBack(560, 1.46, { slump: .1 }); stool(560, 1.46); drawMan(M, 'fear', { face: false, rim: [255, 90, 60], a: .7, lx: 1, ly: -.3 }); stoolSeat(560, 1.46);
  screen(); ctx.fillStyle = rgba(PAL.red, .1); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  redBed();
}
// ---------- REPLAYS: three red flashes of his own hand, then it towering ----------
function faceReplays(t, p, L, len) {
  const step = .5, i = Math.min(3, Math.floor(L / step)), sub = L - i * step;
  if (i < 3) { topTrade(t, { what: ['watch', 'phone', 'photo'][i], u0: .5, u1: .97, red: 1, tint: .2 }, sub, step); redBed(); screen(); ctx.fillStyle = rgba([255, 255, 255], .6 * Math.exp(-sub * 22)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  else { faceTower(t, p, sub, len - 3 * step); screen(); ctx.fillStyle = rgba([255, 40, 30], .5 * Math.exp(-sub * 14)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('replays', faceReplays, { bloom: .55, grain: .65 }, [420, 160, 1500, 900]);

// ---------- THE LAST BOTTLE: it holds a big empty bottle out to him, mouth first, like a throat ----------
function faceBigBottle(t, p, L, len) {
  fill([56, 6, 10], [12, 2, 4]);
  const k = seg(L, 0, len, E.in), sc = lerp(.62, 1.6, k), cx = 960, cy = 640;
  const fr = kcam(L, len, [[0, 1, 960, 540], [1, 1.04, 960, 540]], { hand: .5, t });
  placeDevil([920, 2270, 2.5]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .1 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  // the bottle held out to him mouth first: the body flares away behind the lip, up toward its hands
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  const B = [0, -210, 400], N = [0, 0, 205];
  ctx.fillStyle = lg(-420, 0, 420, 0, [[0, [190, 250, 240], .34], [.5, [150, 230, 220], .12], [1, [255, 150, 130], .3]]);
  ctx.beginPath(); ctx.arc(B[0], B[1], B[2], Math.PI, TAU); ctx.lineTo(N[2], 0); ctx.arc(0, 0, N[2], 0, Math.PI); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba([225, 255, 250], .7); ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(B[0], B[1], B[2], Math.PI * .98, Math.PI * 2.02); ctx.stroke();
  line(-B[2], B[1], -N[2], 0); line(B[2], B[1], N[2], 0);
  ctx.fillStyle = rgba([255, 255, 255], .22); rrect(-330, -330, 26, 250, 13); ctx.fill();
  ctx.fillStyle = rg(0, 0, 30, 220, [[0, [0, 0, 0], .97], [.7, [26, 2, 4], .97], [1, [100, 12, 14], .92]]); ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); ctx.fill();   // the dark inside
  for (let i = 0; i < 5; i++) { const q = (i / 5 + t * .4) % 1; ctx.strokeStyle = rgba([255, 80, 60], .4 * (1 - q)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -q * 60, 200 * (1 - q * .85), 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = lg(-220, -220, 220, 220, [[0, [240, 255, 250], .97], [.5, [150, 220, 210], .8], [1, [255, 120, 100], .95]]); ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, 0, 208, 0, TAU); ctx.stroke();        // the lip
  ctx.strokeStyle = rgba([255, 255, 255], .75); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 214, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  ctx.restore();
  claw([cx + 900 * sc, cy - 60 * sc], Math.PI + .12, 2.2 * sc, { curl: .34, spread: 1.2, arm: 600, side: -1 });
  claw([cx - 900 * sc, cy - 60 * sc], -.12, 2.2 * sc, { curl: .34, spread: 1.2, arm: 600, side: 1 });
  screen(); ctx.fillStyle = rgba(PAL.red, .08 + .06 * Math.sin(t * 7)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  redBed();
}
shot('bigbottle', faceBigBottle, { bloom: .55, grain: .65 }, [460, 60, 1460, 900]);

// ---------- ITS SCREAM: the shelf bursts, it shrinks behind the bar ----------
function faceScream(t, p, L, len) {
  const u = L / len, red = lerp(1, .15, seg(u, .2, 1));
  fill(mix(PAL.tealD, [60, 6, 10], red), [8, 4, 6]);
  const fr = kcam(L, len, [[0, 1.12, 1060, 470], [1, 1.02, 1000, 520]], { jolt: Math.exp(-L * 3) * 1.2, t });
  barWall(t, { red, clock: 'none' });
  for (let i = 0; i < 9; i++) { const x = 660 + i * 95, y = [268, 414, 560][i % 3], d = L - i * .05; if (d > 0) { macShards(d * .8, x, y - 60, 5, [200, 250, 240], i * 31); additive(() => lite([255, 255, 255], x, y - 60, 120, Math.exp(-d * 10))); } }
  const sh = seg(u, .25, 1, E.in);
  placeDevil([1050, lerp(1030, 1330, sh), lerp(.86, .5, sh)]);
  const o = devilO({ a: 1 - sh * .5, eyes: 1, grin: 0, scream: 1 - sh * .4, lean: -.25 * (1 - sh), reach: .9, targets: [[880, lerp(330, 600, sh)], [1240, lerp(330, 600, sh)]] });
  drawDevil(t, fr, o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
  cam(...fr);
  barLamps(t, { dim: .8, flicker: 1, col: mix(PAL.amber, [255, 90, 60], red) });
  barCounter(t, { red });
  const M = manBack(560, 1.46, { slump: 0 }); M.parts.forEach(q => q[0].forEach(pt => { pt[1] -= 60; })); M.head[1] -= 60;
  drawMan(M, 'resolve', { face: false, rim: mix(PAL.amber, [255, 90, 60], red), a: .75, lx: 1, ly: -.3 });
  screen(); ctx.fillStyle = rgba([255, 255, 255], .5 * Math.exp(-L * 12)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
shot('scream', faceScream, { bloom: .6, grain: .65 }, [520, 100, 1500, 900]);

// ---------- MONTAGE: seven cuts of .4 s ----------
function macSlam(t, sub, flip) {
  macBg(t, { gx: flip ? 500 : 1400 });
  cam(1.5, 940, 600);
  macBar(t);
  const hit = Math.exp(-sub * 9), gx = 940;
  for (let i = 0; i < (flip ? 5 : 3); i++) tumbler((flip ? 1700 : 180) + (flip ? -1 : 1) * i * 130, MAC.y, 1.7, 0, { a: .7, glowA: 0 });
  tumbler(gx, MAC.y - hit * 4, 2.0, .04, { tilt: (flip ? -1 : 1) * hit * .05, glowA: 0 });
  ctx.strokeStyle = rgba([255, 236, 190], .8 * hit); ctx.lineWidth = 5; for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(gx, MAC.y + 4, 110 + (1 - hit) * 240 * i, 12 + (1 - hit) * 20 * i, 0, Math.PI, TAU); ctx.stroke(); }
  macGloss(t);
  manHand([gx + (flip ? 210 : -210), MAC.y - 150 + hit * 10], flip ? Math.PI - .55 : .55, { s: 1.6, curl: .7, arm: 900, side: flip ? 1 : -1 });
}
function faceClock(t, sub) {
  fill(PAL.tealD, PAL.teal); cam(1.1, 960, 540);
  additive(() => lite(PAL.amber, 960, 540, 900, .4));
  wallClock(960, 540, 330, 5, { spin: 34 }, sub + .2);
}
function faceMontage(t, p, L, len) {
  const N = 10, step = len / N, i = Math.min(N - 1, Math.floor(L / step)), sub = L - i * step;
  const punch = 1 + .09 * Math.exp(-sub * 12), P0 = PUSH; PUSH = P0 * punch;
  if (i === 0) macSlam(t, sub, 0);
  else if (i === 1) macBottleIn(t, { n: 1 }, .93 + sub * .1, 1);
  else if (i === 2) macSlam(t, sub, 1);
  else if (i === 3) macBottleIn(t, { n: 2 }, .93 + sub * .1, 1);
  else if (i === 4) faceHis(t, { look: 'bar', from: 'empty', to: 'empty', noblink: 1 }, sub, step);
  else if (i === 5) faceClock(t, sub);
  else if (i === 6) macSlam(t, sub, 0);
  else if (i === 7) { if (SHOT.lilyface) SHOT.lilyface.draw(t, { ex: 'worry' }, sub + .5); else macBottleIn(t, { n: 3 }, .93, 1); }
  else if (i === 8) faceClock(t, sub + .4);
  else faceDevil(t, { grin: 1, nobed: 1 }, sub + .3, 2);
  PUSH = P0; screen();
  ctx.fillStyle = rgba(i === N - 1 ? [255, 60, 40] : [255, 255, 255], .5 * Math.exp(-sub * 24)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
shot('montage', faceMontage, { bloom: .5, grain: .65 }, [460, 140, 1460, 900]);
