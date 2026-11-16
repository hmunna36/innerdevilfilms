// ---------- THE SCHOOL STEPS (part 30): the set, its people and every shot there ----------
// World px. The school is seen straight on: the double door between x 750 and 1170, the landing (the top step) at
// y 534-594, six stone steps down to the pavement at y 1000, the kerb at 1170, the road below; the street lamp stands at
// the foot of the steps on the right (post x 1506, lantern at 1330, -62). The man is man() at s = 1 (470 px tall), Lily
// is lily() at s = 1.55 (her head level with his when he kneels at the foot and she stands on the first step).
// Feet stand on schY(k): k 0 the pavement at the foot, 1-5 the treads, 6 the landing.
const schG = { gy: 1000, R: 46, D: 26, lx0: 520, lx1: 1400, flare: 16, land: 534, edge: 594, base: 810, kerb: 1170, fx0: 60, fx1: 1860, roof: -450,
  door: [750, 1170, 20, 534], lamp: [1330, -62], post: 1506, ls: 1.55,
  win: [[210, 40, 150, 340], [500, 40, 150, 340], [1420, 40, 150, 340], [1710, 40, 150, 340], [210, -340, 150, 228], [500, -340, 150, 228], [1420, -340, 150, 228], [1710, -340, 150, 228], [960, -392, 190, 196]] };
const schTop = i => schG.gy - i * schG.R - (i - 1) * schG.D;                     // the top edge of riser i (1 = the lowest)
const schY = k => k <= 0 ? schG.gy + 46 : k >= 6 ? 574 : schTop(k) - 13;
const schYf = k => { const a = Math.floor(clamp(k, 0, 6)), f = clamp(k, 0, 6) - a; return lerp(schY(a), schY(a + 1), f); };

// ---------- the time of day ----------
const schTODS = {
  dusk: { skyT: [62, 54, 132], skyM: [178, 100, 172], skyB: [255, 166, 150], brick: [160, 82, 90], brickD: [104, 52, 78], stone: [200, 160, 172], stoneD: [128, 98, 132],
    pave: [118, 96, 138], paveD: [84, 68, 114], road: [60, 48, 94], tree: [46, 38, 82], treeL: [112, 70, 120], glass: [150, 112, 172], paint: [52, 96, 112], far: [98, 72, 134],
    roof: [58, 48, 96], rail: [30, 26, 60], amb: [255, 150, 172], cloud: [255, 170, 190], cloudA: .16, lightC: [255, 176, 190], lx: -.3, ly: -1, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: .45 },
  eve: { skyT: [18, 20, 62], skyM: [56, 46, 116], skyB: [130, 80, 140], brick: [100, 56, 94], brickD: [62, 36, 74], stone: [126, 106, 154], stoneD: [78, 66, 116],
    pave: [72, 66, 122], paveD: [46, 44, 94], road: [32, 32, 76], tree: [22, 22, 58], treeL: [50, 42, 92], glass: [62, 58, 120], paint: [36, 62, 88], far: [42, 40, 94],
    roof: [30, 28, 70], rail: [14, 14, 40], amb: [150, 130, 224], cloud: [120, 96, 180], cloudA: .1, lightC: [176, 186, 255], lx: 1, ly: -.8, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: .2 },
  night: { skyT: [8, 10, 36], skyM: [18, 22, 66], skyB: [36, 40, 98], brick: [60, 42, 90], brickD: [36, 26, 64], stone: [86, 84, 142], stoneD: [50, 50, 102],
    pave: [46, 52, 108], paveD: [28, 32, 78], road: [18, 22, 60], tree: [12, 14, 42], treeL: [30, 32, 74], glass: [28, 34, 80], paint: [26, 42, 74], far: [22, 26, 66],
    roof: [16, 18, 50], rail: [8, 10, 30], amb: [120, 140, 232], cloud: [56, 66, 140], cloudA: .08, lightC: [196, 214, 255], lx: 1, ly: -.8, sunA: 0, sunX: 0, sunY: 0, sunC: [255, 200, 160], day: 0 },
  morning: { skyT: [92, 164, 236], skyM: [162, 208, 246], skyB: [230, 242, 250], brick: [198, 104, 80], brickD: [158, 78, 66], stone: [226, 214, 200], stoneD: [184, 170, 164],
    pave: [196, 188, 184], paveD: [168, 162, 162], road: [124, 128, 142], tree: [64, 128, 86], treeL: [150, 196, 120], glass: [150, 204, 240], paint: [56, 120, 132], far: [150, 176, 206],
    roof: [96, 100, 124], rail: [40, 46, 60], amb: [255, 250, 236], cloud: [255, 255, 255], cloudA: .3, lightC: [255, 244, 222], lx: 1, ly: -.7, sunA: .4, sunX: 2700, sunY: -900, sunC: [255, 240, 210], day: 1 },
  gold: { skyT: [120, 140, 206], skyM: [246, 170, 140], skyB: [255, 196, 150], brick: [204, 102, 74], brickD: [146, 66, 66], stone: [236, 186, 150], stoneD: [176, 122, 116],
    pave: [212, 158, 130], paveD: [170, 120, 112], road: [124, 92, 104], tree: [92, 90, 60], treeL: [214, 136, 76], glass: [240, 170, 140], paint: [58, 110, 116], far: [196, 136, 126],
    roof: [112, 86, 104], rail: [56, 40, 54], amb: [255, 180, 120], cloud: [255, 196, 160], cloudA: .26, lightC: [255, 190, 110], lx: -1, ly: -.35, sunA: .9, sunX: -1200, sunY: 260, sunC: [255, 160, 90], day: .8 }
};
function schTod(x) {                                                       // 'dusk' or a blend ['eve', 'night', .4]
  if (typeof x === 'string') return schTODS[x];
  const a = schTODS[x[0]], b = schTODS[x[1]], o = {};
  for (const f in a) o[f] = Array.isArray(a[f]) ? mix(a[f], b[f], x[2]) : lerp(a[f], b[f], x[2]);
  return o;
}
const schLitFn = v => typeof v === 'function' ? v : Array.isArray(v) ? (i => v.includes(i) ? 1 : 0) : v === 'all' ? (i => .8 + .2 * rnd(i * 3.7)) : v === 'one' ? (i => i === 1 ? 1 : 0) : (() => 0);
// blur everything drawn so far (the set behind a close shot): one pass over the whole frame
function schSoft(r) { if (r <= .1) return; ctx.save(); px(); ctx.filter = `blur(${(r * VP.k).toFixed(1)}px)`; ctx.drawImage(cv, 0, 0); ctx.restore(); }

// ---------- the set, piece by piece ----------
function schSky(t, T) {
  ctx.fillStyle = lg(0, -1100, 0, 820, [[0, T.skyT], [.55, T.skyM], [1, T.skyB]]); ctx.fillRect(-3400, -3400, 8800, 4220);
  for (let i = 0; i < 8; i++) pool(-1500 + rnd(i * 3.3 + 2) * 5000 + t * (3 + i), -760 + rnd(i * 5.1) * 1150, 420 + rnd(i) * 380, 40 + rnd(i * 2) * 40, T.cloud, T.cloudA);
  if (T.sunA > .01) additive(() => { lite(T.sunC, T.sunX, T.sunY, 2300, .5 * T.sunA); lite([255, 240, 214], T.sunX, T.sunY, 700, .7 * T.sunA); });
}
function schTree(x, r, T, seed, t, yb = 810) {
  const y = yb - r * 1.9;
  poly([[x - 22, yb], [x - 12, y + r * .4], [x + 12, y + r * .4], [x + 24, yb]], rgba(mix(T.tree, [0, 0, 10], .4)));
  ctx.beginPath(); ctx.moveTo(x + r * .62, y); ctx.arc(x, y, r * .62, 0, TAU);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (.42 + rnd(seed + i) * .24), cx = x + Math.cos(a) * r * .58 + Math.sin(t * .7 + seed + i) * 4, cy = y + Math.sin(a) * r * .44; ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, TAU); }
  ctx.fillStyle = rgba(T.tree); ctx.fill();
  ctx.beginPath();                                                         // clumps of leaves on the light's side
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, rr = r * (.16 + rnd(seed + i * 3) * .12), cx = x + Math.cos(a) * r * .5 + T.lx * r * .3 + Math.sin(t * .7 + seed + i) * 4, cy = y + Math.sin(a) * r * .36 + T.ly * r * .22; ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, TAU); }
  ctx.fillStyle = rgba(T.treeL, .5); ctx.fill();
}
function schSides(t, T) {
  const G = schG;
  for (const sd of [-1, 1]) for (let i = 0; i < 6; i++) {                  // houses down the street, a few windows lit
    const w = 300 + rnd(i * 3 + sd) * 140, x = sd < 0 ? G.fx0 - 150 - i * 360 - w : G.fx1 + 150 + i * 360, h = 250 + rnd(i * 5 + sd * 2) * 170, c = mix(T.far, T.skyB, .1 + .1 * rnd(i));
    poly([[x, 810], [x, 810 - h], [x + w / 2, 810 - h - 100], [x + w, 810 - h], [x + w, 810]], rgba(c));
    if (T.day < .7) for (let j = 0; j < 3; j++) if (rnd(i * 9 + j + sd * 4) < .62) {
      const wx = x + 44 + j * 84, wy = 810 - h + 56; rectf(wx, wy, 38, 54, rgba([255, 206, 150], .85 - T.day * .5)); additive(() => lite([255, 190, 130], wx + 19, wy + 27, 90, .3));
    }
  }
  ctx.beginPath();                                                         // a hedge behind the railings
  for (const [a, b] of [[-3200, G.fx0 - 6], [G.fx1 + 6, 5200]]) for (let x = a; x < b; x += 70) { const r = 60 + rnd(x) * 30; ctx.moveTo(x + r, 720); ctx.arc(x, 720, r, 0, TAU); ctx.rect(x - 40, 720, 80, 90); }
  ctx.fillStyle = rgba(mix(T.tree, T.treeL, .25)); ctx.fill();
  schTree(-250, 330, T, 3, t); schTree(-760, 290, T, 9, t); schTree(-1300, 340, T, 31, t);
  schTree(2190, 340, T, 14, t); schTree(2700, 300, T, 22, t); schTree(3260, 330, T, 41, t);
  ctx.beginPath();                                                         // iron railings on a low wall
  for (const [a, b] of [[-3200, G.fx0 - 16], [G.fx1 + 16, 5200]]) {
    for (let x = a + 8; x < b - 8; x += 38) { ctx.rect(x, 640, 7, 150); ctx.moveTo(x - 4, 642); ctx.lineTo(x + 3.5, 618); ctx.lineTo(x + 11, 642); }
    ctx.rect(a, 662, b - a, 8); ctx.rect(a, 760, b - a, 8);
  }
  ctx.fillStyle = rgba(T.rail); ctx.fill();
  for (const [a, b] of [[-3200, G.fx0 - 16], [G.fx1 + 16, 5200]]) { rectf(a, 786, b - a, 24, rgba(T.stoneD)); rectf(a, 786, b - a, 4, rgba(T.stone, .8)); }
}
function schWindow(id, T, lit, t) {
  const [cx, top, w, h] = schG.win[id], x = cx - w / 2, arch = id === 8;
  const shape = (g = 0) => { ctx.beginPath(); if (arch) { ctx.moveTo(x - g, top + h + g); ctx.lineTo(x - g, top + w / 2); ctx.arc(cx, top + w / 2, w / 2 + g, Math.PI, 0); ctx.lineTo(x + w + g, top + h + g); ctx.closePath(); } else ctx.rect(x - g, top - g, w + 2 * g, h + 2 * g); };
  shape(16); ctx.fillStyle = rgba(T.stone); ctx.fill();
  rectf(x - 28, top + h + 14, w + 56, 16, rgba(T.stone)); rectf(x - 28, top + h + 30, w + 56, 6, rgba(T.stoneD));   // the sill
  shape(); ctx.fillStyle = lg(0, top, 0, top + h, [[0, mix(T.glass, T.skyM, .3)], [1, mix(T.glass, [8, 10, 30], .45)]]); ctx.fill();
  ctx.save(); shape(); ctx.clip();
  if (lit > .01) {
    ctx.fillStyle = lg(0, top, 0, top + h, [[0, [246, 168, 122], .97 * lit], [1, [230, 118, 88], .97 * lit]]); ctx.fillRect(x, top, w, h);
    rectf(x, top + h - 30, w, 30, rgba([126, 72, 54], .5 * lit));           // the room's wall under the glass
    for (let i = 0; i < 3; i++) {                                          // paper shapes the children stuck on the glass
      const qx = x + 26 + rnd(id * 7 + i * 3) * (w - 52), qy = top + h * (.42 + rnd(id * 3 + i * 5) * .34), q = 13 + rnd(id + i) * 6;
      ctx.save(); ctx.translate(qx, qy); ctx.rotate(rnd(id * 5 + i) * 3); ctx.fillStyle = rgba([[70, 140, 144], [140, 104, 170], [226, 132, 150]][i], .6 * lit);
      if (i === 1) { ctx.beginPath(); ctx.arc(0, 0, q, 0, TAU); ctx.fill(); } else ctx.fillRect(-q, -q, 2 * q, 2 * q);
      ctx.restore();
    }
  } else { ctx.fillStyle = rgba(T.skyM, .2); poly([[x + w * .1, top + h], [x + w * .5, top], [x + w * .78, top], [x + w * .38, top + h]]); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = rgba(lit > .3 ? mix(T.stone, [84, 44, 34], .75) : mix(T.stone, [255, 255, 255], .15), .92); ctx.lineWidth = 6;   // the glazing bars
  line(cx, top, cx, top + h); for (const k of arch ? [.42, .72] : [.34, .67]) line(x, top + h * k, x + w, top + h * k);
  shape(); ctx.strokeStyle = rgba(T.stoneD, .95); ctx.lineWidth = 4; ctx.stroke();
  if (lit > .01) additive(() => lite([255, 140, 96], cx, top + h / 2, w * 1.9, .2 * lit));
}
function schDoor(t, T, open, hall) {
  const [x0, x1, top, bot] = schG.door, cx = (x0 + x1) / 2, lw = (x1 - x0) / 2;
  rectf(x0 - 36, top - 78, x1 - x0 + 72, bot - top + 78, rgba(T.stone)); rectf(x0 - 36, top - 78, x1 - x0 + 72, 8, rgba(mix(T.stone, [255, 255, 255], .3)));
  rectf(x0 - 36, top - 78, 8, bot - top + 78, rgba(T.stoneD, .5)); rectf(x1 + 28, top - 78, 8, bot - top + 78, rgba(T.stoneD, .5));
  // the hall inside
  const hc = mix([34, 24, 48], [255, 204, 156], .1 + .5 * hall), hd = mix([18, 14, 34], [150, 86, 78], hall * .7);
  ctx.fillStyle = lg(0, top - 58, 0, bot, [[0, hc], [.68, hd], [1, mix(hd, [255, 196, 140], .25 * hall)]]); ctx.fillRect(x0, top - 58, x1 - x0, bot - top + 58);
  rectf(cx - 70, top + 150, 140, 96, rgba(mix(hd, [214, 170, 150], .12 + .3 * hall)));                 // a noticeboard on the far wall
  for (let i = 0; i < 5; i++) rectf(cx - 58 + (i % 3) * 42, top + 162 + Math.floor(i / 3) * 40, 30, 28, rgba([[90, 150, 150], [150, 120, 176], [236, 226, 210]][i % 3], .3 + .4 * hall));
  poly([[x0, bot], [cx - 100, top + 330], [cx + 100, top + 330], [x1, bot]], rgba(mix(hd, [255, 200, 150], .2 * hall)));   // the floor running in
  if (hall > .02) additive(() => { lite([255, 212, 160], cx, top + 60, 260, .7 * hall); lite([255, 240, 216], cx, top + 34, 60, .9 * hall); });
  // the fanlight over the doors
  rectf(x0, top - 58, x1 - x0, 52, rgba(mix(mix(T.glass, [8, 10, 30], .3), [240, 156, 118], .85 * hall)));
  ctx.strokeStyle = rgba(T.paint); ctx.lineWidth = 6; for (let i = 1; i < 4; i++) line(x0 + i * (x1 - x0) / 4, top - 58, x0 + i * (x1 - x0) / 4, top - 6);
  rectf(x0, top - 8, x1 - x0, 10, rgba(T.paint));
  // the two leaves swing in on their hinges
  const vis = lw * (1 - .8 * clamp(open));
  for (const sd of [-1, 1]) {
    const hx = sd < 0 ? x0 : x1, ex = hx - sd * vis, xa = Math.min(hx, ex), dc = mix(T.paint, [4, 6, 20], .3 * open);
    ctx.fillStyle = lg(hx, 0, ex, 0, [[0, mix(dc, [0, 0, 10], .3)], [1, dc]]); ctx.fillRect(xa, top, vis, bot - top);
    const gw = vis * .34;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const gx = xa + vis * (.11 + c * .44), gy = top + 34 + r * 128;
      rectf(gx, gy, gw, 112, rgba(mix(mix(T.glass, [8, 10, 30], .35), [238, 150, 114], .8 * hall)));
      ctx.fillStyle = rgba([255, 255, 255], .1); poly([[gx, gy + 112], [gx + gw * .5, gy], [gx + gw * .8, gy], [gx + gw * .3, gy + 112]]); ctx.fill();
    }
    ctx.strokeStyle = rgba(mix(dc, [255, 255, 255], .14)); ctx.lineWidth = 4; ctx.strokeRect(xa + vis * .11, top + 306, vis * .78, 176);
    disc(ex + sd * vis * .09, top + 294, 7, rgba(PAL.brass, .95));
    rectf(ex - 2, top, 4, bot - top, rgba([0, 0, 10], .5));
  }
  if (open * hall > .02) pool(cx, schG.land + 36, 320 * (.35 + .65 * open), 40, [255, 200, 140], .5 * open * hall);
}
function schCanopy(T) {
  const y = -76;
  ctx.fillStyle = lg(0, y + 24, 0, y + 96, [[0, [0, 0, 24], .4], [1, [0, 0, 24], 0]]); ctx.fillRect(700, y + 24, 520, 72);
  rectf(682, y, 556, 24, rgba(T.stone)); rectf(682, y, 556, 6, rgba(mix(T.stone, [255, 255, 255], .35))); rectf(682, y + 24, 556, 6, rgba(T.stoneD));
  for (const x of [704, 1216]) poly([[x - 12, y + 30], [x + 12, y + 30], [x + 12, y + 46], [x, y + 86], [x - 12, y + 86]], rgba(T.stoneD));
  font(76, SANS, '800'); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';                // the plain word
  const chars = [...'SCHOOL'], ws = chars.map(c => ctx.measureText(c).width), tr = 16, tot = ws.reduce((a, b) => a + b, 0) + tr * 5;
  let x = 960 - tot / 2;
  chars.forEach((c, i) => { ctx.fillStyle = rgba([0, 0, 20], .45); ctx.fillText(c, x + 4, y - 14); ctx.fillStyle = rgba(mix(T.stone, [255, 255, 255], .25)); ctx.fillText(c, x, y - 18); x += ws[i] + tr; });
}
function schBuilding(t, T, o) {
  const { fx0, fx1, roof, base } = schG;
  poly([[fx0 - 36, roof], [fx0 + 80, roof - 130], [fx1 - 80, roof - 130], [fx1 + 36, roof]], rgba(T.roof));
  rectf(330, roof - 200, 74, 120, rgba(T.brickD)); rectf(322, roof - 208, 90, 14, rgba(T.stoneD)); rectf(1516, roof - 200, 74, 120, rgba(T.brickD)); rectf(1508, roof - 208, 90, 14, rgba(T.stoneD));
  poly([[676, roof], [960, roof - 200], [1244, roof]], rgba(T.stone)); poly([[700, roof], [960, roof - 182], [1220, roof]], rgba(T.brick));   // the gable over the door
  disc(960, roof - 66, 36, rgba(T.stone)); disc(960, roof - 66, 25, rgba(mix(T.glass, [8, 10, 30], .4)));
  ctx.fillStyle = lg(0, roof, 0, base, [[0, mix(T.brick, T.amb, .16)], [.5, T.brick], [1, T.brickD]]); ctx.fillRect(fx0, roof, fx1 - fx0, base - roof);
  ctx.beginPath();                                                         // the brick courses
  for (let y = roof + 26, r = 0; y < 606; y += 26, r++) { ctx.moveTo(fx0, y); ctx.lineTo(fx1, y); for (let x = fx0 + (r % 2 ? 26 : 52); x < fx1; x += 52) { ctx.moveTo(x, y - 26); ctx.lineTo(x, y); } }
  ctx.strokeStyle = rgba(T.brickD, .5); ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < 120; i++) { const r = Math.floor(rnd(i * 3.1) * 40), c = Math.floor(rnd(i * 7.7) * 34); rectf(fx0 + c * 52 + (r % 2 ? 26 : 0) + 1, roof + r * 26 + 1, 50, 24, rgba(rnd(i) < .5 ? [255, 214, 196] : [20, 0, 34], .1)); }
  ctx.fillStyle = lg(0, 600, 0, base, [[0, T.stone], [1, T.stoneD]]); ctx.fillRect(fx0 - 10, 600, fx1 - fx0 + 20, base - 600);       // the plinth
  rectf(fx0 - 10, 600, fx1 - fx0 + 20, 8, rgba(mix(T.stone, [255, 255, 255], .3)));
  for (let x = fx0 + 150; x < fx1; x += 300) rectf(x, 608, 2, base - 608, rgba(T.stoneD, .5));
  for (const x of [210, 500, 1420, 1710]) { rectf(x - 52, 688, 104, 46, rgba(mix(T.glass, [4, 6, 24], .6))); ctx.strokeStyle = rgba(T.stoneD); ctx.lineWidth = 4; ctx.strokeRect(x - 52, 688, 104, 46); }
  rectf(fx0 - 8, -92, fx1 - fx0 + 16, 20, rgba(T.stone)); rectf(fx0 - 8, -72, fx1 - fx0 + 16, 5, rgba(T.stoneD));                   // the band between the floors
  rectf(fx0 - 26, roof - 8, fx1 - fx0 + 52, 30, rgba(T.stone)); rectf(fx0 - 26, roof + 22, fx1 - fx0 + 52, 6, rgba(T.stoneD));       // the cornice
  for (const sd of [0, 1]) for (let y = roof + 28, i = 0; y < 596; y += 52, i++) { const w = i % 2 ? 44 : 66; rectf(sd ? fx1 - w : fx0, y, w, 50, rgba(T.stone, .92)); }
  for (let i = 0; i < 9; i++) schWindow(i, T, o.lit(i), t);
  schDoor(t, T, o.door, o.hall); schCanopy(T);
}
function schGround(t, T, rk) {
  const G = schG;
  ctx.fillStyle = lg(0, G.base, 0, G.kerb, [[0, T.paveD], [1, T.pave]]); ctx.fillRect(-3400, G.base, 8800, G.kerb - G.base);
  ctx.fillStyle = lg(0, G.base, 0, G.base + 40, [[0, [0, 0, 24], .35], [1, [0, 0, 24], 0]]); ctx.fillRect(-3400, G.base, 8800, 40);    // the wall's foot
  ctx.strokeStyle = rgba(T.paveD, .7); ctx.lineWidth = 2; ctx.beginPath();                        // paving joints
  for (const y of [868, 950, 1056]) { ctx.moveTo(-3400, y); ctx.lineTo(5400, y); }
  for (let x = -3300; x < 5400; x += 190) { ctx.moveTo(960 + (x - 960) * .86, G.base); ctx.lineTo(x, G.kerb); }
  ctx.stroke();
  rectf(-3400, G.kerb, 8800, 26, rgba(mix(T.stone, T.pave, .5))); rectf(-3400, G.kerb, 8800, 4, rgba(mix(T.stone, [255, 255, 255], .2), .8)); rectf(-3400, G.kerb + 26, 8800, 10, rgba([0, 0, 20], .4));
  ctx.fillStyle = lg(0, G.kerb + 26, 0, G.kerb + 700, [[0, T.road], [1, mix(T.road, [0, 0, 16], .45)]]); ctx.fillRect(-3400, G.kerb + 26, 8800, 1400);
  if (rk > .02) for (let i = 0; i < 9; i++) {                             // puddles hold the sky
    const x = -900 + rnd(i * 4.7) * 3700, y = (i % 3 ? G.kerb + 90 + rnd(i * 2.1) * 260 : 1030 + rnd(i * 8.3) * 110), rx = 110 + rnd(i * 6.3) * 150;
    oval(x, y, rx, rx * .12, rgba(mix(T.skyM, T.amb, .3), .22 + .2 * rk));
  }
}
function schSteps(T) {
  const G = schG;
  for (const sd of [-1, 1]) {                                              // the cheek walls: sloping stone at each side
    const xb = sd < 0 ? G.lx0 : G.lx1, xf = xb + sd * 5 * G.flare;
    poly([[xb, 498], [xb + sd * 72, 498], [xf + sd * 86, 930], [xf, 930]], lg(0, 498, 0, 930, [[0, mix(T.stone, T.stoneD, .3)], [1, T.stone]]));
    poly([[xf, 930], [xf + sd * 86, 930], [xf + sd * 86, G.gy + 8], [xf, G.gy + 8]], rgba(T.stoneD));
    rectf(Math.min(xf - sd * 4, xf + sd * 92), 918, 96, 14, rgba(mix(T.stone, [255, 255, 255], .2)));
    ctx.strokeStyle = rgba(mix(T.stone, [255, 255, 255], .35), .8); ctx.lineWidth = 3; line(xb + sd * 72, 498, xf + sd * 86, 930);
    ctx.fillStyle = rgba([0, 0, 24], .22); poly([[xf + sd * 86, G.gy + 8], [xf + sd * 86, 940], [xf + sd * 150, G.gy + 8]]); ctx.fill();
  }
  rectf(G.lx0, G.land, G.lx1 - G.lx0, G.edge - G.land, lg(0, G.land, 0, G.edge, [[0, mix(T.stone, T.stoneD, .5)], [1, T.stone]]));
  for (let i = 6; i >= 1; i--) {
    const x0 = G.lx0 - (6 - i) * G.flare, w = G.lx1 - G.lx0 + 2 * (6 - i) * G.flare, top = schTop(i);
    if (i < 6) rectf(x0, top - G.D, w, G.D, lg(0, top - G.D, 0, top, [[0, mix(T.stone, T.stoneD, .4)], [1, T.stone]]));
    rectf(x0, top, w, G.R, lg(0, top, 0, top + G.R, [[0, mix(T.stoneD, T.stone, .3)], [1, mix(T.stoneD, [0, 0, 24], .28)]]));
    rectf(x0, top, w, 3, rgba(mix(T.stone, [255, 255, 255], .4), .9));
    ctx.fillStyle = rgba([0, 0, 24], .14); for (let x = x0 + 90 + (i % 2) * 110; x < x0 + w - 40; x += 220) ctx.fillRect(x, top + 3, 2, G.R - 3);
  }
  rectf(G.lx0 - 5 * G.flare, G.gy, G.lx1 - G.lx0 + 10 * G.flare, 12, lg(0, G.gy, 0, G.gy + 12, [[0, [0, 0, 24], .35], [1, [0, 0, 24], 0]]));
}
function schLampPost(T) {
  const x = schG.post, [hx, hy] = schG.lamp, c = mix([12, 16, 32], T.amb, .1 + .25 * T.day);
  poly([[x - 22, 1054], [x - 16, 968], [x - 9, 940], [x + 9, 940], [x + 16, 968], [x + 22, 1054]], rgba(c));
  rectf(x - 7, 24, 14, 922, rgba(c)); rectf(x - 7, 24, 4, 922, rgba(T.lightC, .32)); rectf(x - 12, 420, 24, 12, rgba(c)); rectf(x - 12, 60, 24, 10, rgba(c));
  ctx.strokeStyle = rgba(c); ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, 30); ctx.bezierCurveTo(x, -150, hx + 110, -150, hx, -128); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, -20); ctx.quadraticCurveTo(x - 60, -40, x - 86, -120); ctx.stroke();      // a scroll under the arm
  rectf(hx - 4, -128, 8, hy - 40 + 128, rgba(c));
  poly([[hx - 14, hy - 44], [hx + 14, hy - 44], [hx + 50, hy - 4], [hx - 50, hy - 4]], rgba(c)); disc(hx, hy - 48, 8, rgba(c));
}
function schLampLight(t, a) {                                              // the lantern's glass and what it throws (after the people)
  const [hx, hy] = schG.lamp;
  poly([[hx - 36, hy - 4], [hx + 36, hy - 4], [hx + 24, hy + 24], [hx - 24, hy + 24]], rgba(mix([40, 46, 70], [255, 240, 214], clamp(a))));
  if (a <= .01) return;
  cone(hx, hy + 12, 34, 470, 1130, PAL.lamp, .19 * a, -110);
  additive(() => { lite(PAL.lamp, hx, hy + 10, 560, .2 * a); lite(PAL.lamp, hx, hy + 12, 130, .5 * a); lite([255, 244, 224], hx, hy + 12, 30, .8 * a); });
}
// something soft near the lens: 'branchL' / 'branchR' leaves in a top corner, 'rail' railing spears along the bottom, 'post' a trunk at the right edge
function schFg(kind, t, T) {
  if (!kind) return;
  screen();
  const col = mix(T.tree, [0, 0, 12], .62);
  blurred(10, () => {
    if (kind.includes('branch')) {
      ctx.save(); if (kind.includes('branchR')) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.beginPath();
      for (let i = 0; i < 34; i++) { const k = rnd(i * 2.3 + 4), x = -80 + k * 680 + Math.sin(t * .9 + i) * 7, y = -50 + rnd(i * 5.9) * (290 - k * 230) + Math.sin(t * 1.1 + i * 2) * 6; ctx.moveTo(x + 60, y); ctx.ellipse(x, y, 60, 24, rnd(i * 4.1) * 3, 0, TAU); }
      ctx.fillStyle = rgba(col, .97); ctx.fill();
      ctx.beginPath(); for (let i = 0; i < 9; i++) { const k = rnd(i * 2.9 + 7), x = -40 + k * 560 + Math.sin(t * .9 + i) * 7, y = 40 + rnd(i * 3.7) * (190 - k * 170); ctx.moveTo(x + 46, y); ctx.ellipse(x, y, 46, 17, rnd(i * 6.1) * 3, 0, TAU); }
      ctx.fillStyle = rgba(mix(col, T.treeL, .3), .7); ctx.fill();
      ctx.restore();
    }
    if (kind.includes('rail')) {
      ctx.beginPath(); for (let x = -40; x < W + 80; x += 150) { ctx.rect(x, 930, 34, 200); ctx.moveTo(x - 16, 934); ctx.lineTo(x + 17, 850); ctx.lineTo(x + 50, 934); } ctx.rect(-40, 1010, W + 80, 30);
      ctx.fillStyle = rgba(mix(T.rail, [0, 0, 10], .3), .96); ctx.fill();
    }
    if (kind.includes('post')) { ctx.fillStyle = rgba(col, .97); ctx.fillRect(W - 150, -40, 260, H + 80); }
  });
}
// THE SET. o: tod ('dusk' | 'eve' | 'night' | 'morning' | 'gold', or a blend [a, b, k]), rain 0-1, lit (which windows:
// 'all' | 'one' | 'none' | [ids] | a function of the id; 0-3 the tall ones by the door, 4-7 upstairs, 8 over the door),
// lamp 0-1 (flicker it from the shot), door 0-1 (open), hall 0-1 (the light inside), soft (blur the set behind a close
// shot), fg (schFg), mist 0-1. mid(T): the people, drawn between the set and its light, rain and foreground.
function schSet(t, o = {}, mid = null) {
  const T = schTod(o.tod || 'dusk'), rk = o.rain || 0, la = o.lamp || 0, G = schG, [hx, hy] = G.lamp;
  schSky(t, T);
  schBuilding(t, T, { lit: schLitFn(o.lit ?? 'none'), door: o.door || 0, hall: o.hall ?? 0 });
  schSides(t, T);
  schGround(t, T, rk);
  schSteps(T);
  // the light that lies on the set
  if (T.sunA > .01) {
    const dir = T.sunX < 960 ? 1 : -1;
    additive(() => { ctx.fillStyle = lg(dir > 0 ? -600 : 2500, 0, dir > 0 ? 2500 : -600, 0, [[0, T.sunC, .17 * T.sunA], [1, T.sunC, 0]]); ctx.fillRect(-3400, G.roof - 300, 8800, 2400); });
    if (T.sunA > .7) {                                                     // the low sun: long shadows to the right, the leaves' shade on the wall
      blurred(14, () => { ctx.beginPath(); for (let i = 0; i < 18; i++) { const x = 70 + rnd(i * 3.3) * 640 + Math.sin(t * .6 + i) * 8, y = -380 + rnd(i * 7.1) * 900, rx = 70 + rnd(i) * 70; ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, 34 + rnd(i * 2) * 30, -.5, 0, TAU); } ctx.fillStyle = rgba([110, 40, 70], .2); ctx.fill(); });
      ctx.fillStyle = rgba([110, 50, 90], .24);
      poly([[G.post - 16, 1056], [G.post + 16, 1050], [3400, 826], [3400, 806]]); ctx.fill();
      poly([[-3400, 1040], [-200, 992], [640, 1004], [-3400, 1170]]); ctx.fill();
      for (const sd of [-1, 1]) { const xf = (sd < 0 ? G.lx0 : G.lx1) + sd * 5 * G.flare + (sd > 0 ? 86 : 0); poly([[xf, G.gy + 8], [xf, 930], [xf + 190, 986], [xf + 190, G.gy + 8]]); ctx.fill(); }
    }
  }
  if (la > .01) { pool(1240, 588, 400, 56, PAL.lamp, .26 * la); pool(1200, 1040, 560, 100, PAL.lamp, .3 * la); additive(() => lite(PAL.lamp, hx, 190, 760, .2 * la)); }
  schLampPost(T);
  if (rk > .02) wet(G.gy + 4, 160, .16 + .14 * rk, t, 4);
  if (o.soft) schSoft(o.soft);
  if (mid) mid(T);
  schLampLight(t, la);
  if (rk > .02) {
    wet(G.kerb + 26, 520, .28 + .2 * rk, t, 6);
    ripples(t, -700, 2700, 1012, 1160, Math.round(60 * rk), PAL.rainB, .5, 3); ripples(t, -700, 2700, G.kerb + 50, G.kerb + 420, Math.round(70 * rk), PAL.rainB, .45, 9);
    for (let i = 1; i <= 5; i++) ripples(t, 470, 1450, schTop(i) - G.D + 6, schTop(i) - 4, Math.round(9 * rk), PAL.rainB, .5, 20 + i);
    ripples(t, 540, 1380, G.land + 16, G.edge - 6, Math.round(12 * rk), PAL.rainB, .5, 31);
    if (la > .05) {                                                        // rain inside the lamp's cone catches its light
      ctx.save(); poly([[hx - 34, hy + 10], [hx + 34, hy + 10], [hx + 360, hy + 1140], [hx - 540, hy + 1140]]); ctx.clip();
      rain(t, { n: Math.round(160 + 240 * rk), len: 80, a: .5 * la, col: [255, 232, 196], seed: 7, w: 2.6, slant: .16 }); ctx.restore();
    }
  }
  if (o.mist) haze(t, -400, 2400, 760, 420, mix(T.amb, T.skyM, .5), .05 * o.mist, 5);
  schFg(o.fg, t, T);
  if (rk > .01) rain(t, { n: Math.round(60 + 280 * rk), len: 70 + 60 * rk, a: .14 + .2 * rk, slant: .16, w: 2.1 });
}

// ---------- the people ----------
// poses are plain numbers so that they blend: schMix(a, b, k) between two, schKeys(u, [[u0, pose], [u1, pose, ease], …])
function schMix(a, b, k) {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, k);
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => schMix(v, b[i], k));
  if (a && b && typeof a === 'object' && typeof b === 'object') { const o = {}; for (const f in a) o[f] = f in b ? schMix(a[f], b[f], k) : a[f]; for (const f in b) if (!(f in o)) o[f] = b[f]; return o; }
  return k < .5 ? a : b;
}
function schKeys(u, ks, f = E.io) {
  if (u <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (u <= ks[i][0]) return schMix(ks[i - 1][1], ks[i][1], (ks[i][2] || f)(inv(ks[i - 1][0], ks[i][0], u)));
  return ks[ks.length - 1][1];
}
// the man: man() from blendable numbers. o: hip, lean, neck, feet [near, far], hr [near, far] (his hands, relative to his
// shoulder, in px at s = 1, x along the way he faces), dir, s, elbow, knee
function schMan(o) {
  const s = o.s || 1, d = o.dir || 1, lean = (o.lean || 0) * d, sh = [o.hip[0] + Math.sin(lean) * 172 * s, o.hip[1] - Math.cos(lean) * 172 * s], hr = o.hr || [[10, 150], [-6, 150]];
  return man(Object.assign({}, o, { hands: hr.map(h => h && [sh[0] + h[0] * d * s, sh[1] + h[1] * s]) }));
}
const schMStand = (x, g, d = 1, o = {}) => Object.assign({ hip: [x, g - 196], feet: [[x + 6 * d, g], [x - 14 * d, g]], lean: 0, neck: 0, dir: d, hr: [[10, 150], [-6, 150]] }, o);
// Lily in any pose, for drawLily. o: hip, feet [near, far], lean, neck, look, nod, hr [near, far] (hands relative to her
// shoulder, px at s = 1, x along the way she faces), dir, s, pose (only for the coat's hem: 'stand' or 'sit'), knee
function schLily(o) {
  const s = o.s || schG.ls, d = o.dir || 1, lean = (o.lean || 0) * d, LEG = 30 * s, TOR = 62 * s, hip = o.hip, kd = o.knee ?? 1;
  const sh = [hip[0] + Math.sin(lean) * TOR, hip[1] - Math.cos(lean) * TOR], hl = lean + (o.neck || 0) * d;
  const hd = [sh[0] + Math.sin(hl) * 34 * s + (o.look || 0) * s, sh[1] - Math.cos(hl) * 34 * s + (o.nod || 0) * s];
  const legs = o.feet.map(f => { const [k, e] = ik(hip, f, LEG, LEG, j => kd * d * j[0] - .2 * j[1]); return [hip, k, e]; });
  const a0 = [sh[0], sh[1] + 6 * s], hr = o.hr || [[5, 62], [4, 61]];
  const arms = hr.map(h => { const [e, w] = ik(a0, [sh[0] + h[0] * d * s, sh[1] + h[1] * s], 30 * s, 28 * s, j => -(o.el ?? 1) * d * j[0] + .4 * j[1]); return [a0, e, w]; });
  return { s, d, pose: o.pose || 'stand', hip, sh, head: [hd[0], hd[1], 31 * s], legs, arms, lean };
}
const schLStand = (x, y, d = 1, o = {}) => { const s = o.s || schG.ls; return Object.assign({ hip: [x, y - 57.6 * s], feet: [[x + 7 * s, y], [x - 7 * s, y]], lean: 0, neck: 0, look: 0, nod: 0, dir: d, s, hr: [[5, 62], [4, 61]], pose: 'stand' }, o); };
const schLSit = (x, y, d = 1, o = {}) => { const s = o.s || schG.ls; return Object.assign({ hip: [x, y - 6 * s], feet: [[x + 30 * s * d, y + 44 * s], [x + 20 * s * d, y + 44 * s]], lean: .06, neck: 0, look: 0, nod: 0, dir: d, s, hr: [[13, 60], [9, 58]], pose: 'sit' }, o); };
const schEx = (a, b, k, over) => Object.assign(mixExpr(typeof a === 'string' ? EXPR[a] : a, typeof b === 'string' ? EXPR[b] : b, clamp(k)), over || {});
const schLex = (a, b, k, over) => Object.assign(mixExpr(typeof a === 'string' ? LILY_EX[a] : a, typeof b === 'string' ? LILY_EX[b] : b, clamp(k)), over || {});
const schBlink = (ex, x, at, d = .16) => { const k = 1 - Math.abs(x - at) / (d / 2); return k > 0 ? Object.assign({}, ex, { lid: Math.max(ex.lid, Math.min(1, k * 1.5)) }) : ex; };

// Lily drawn (drawLily), with two things the close shots need: her near leg starts at the coat's hem instead of
// crossing the coat, and her near sleeve has an edge so that the arm reads against the coat
function schDrawLily(P, ex, L = {}) {
  const s = P.s, hem = ((P.pose === 'sit' ? 30 : 44) / 100 * 62 + 6) * s, [h, k, f] = P.legs[0], d = Math.hypot(k[0] - h[0], k[1] - h[1]) || 1;
  const Q = Object.assign({}, P, { legs: [[v2.lerp(h, k, Math.min(1, hem / d)), k, f], P.legs[1]] });
  drawLily(Q, ex, L);
  const lit = L.a ?? 1, Y = mix([70, 54, 10], PAL.yellow, clamp(.35 + .65 * lit)), YD = mix([44, 32, 6], PAL.yellowD, clamp(.35 + .65 * lit));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke(P.arms[0], 17 * s, rgba(YD, .9)); stroke(P.arms[0], 12.5 * s, rgba(Y)); disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(PAL.ink));
}
// a child in a muted coat (never yellow): P from lily() or schLily(). o: coat, hat (a colour; else a hood), bag (a colour), rim, ra, lx
function schKid(P, o = {}) {
  const { s, d } = P, coat = o.coat || [44, 92, 100], cd = mix(coat, [8, 10, 24], .55), rim = o.rim || PAL.lamp, ra = o.ra ?? .5, cl = mix(coat, rim, .22 * ra + .08), ink = o.ink || [12, 13, 24], [hx, hy, r] = P.head, lx = o.lx ?? d;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke(P.legs[1], 13 * s, rgba(ink)); stroke([P.legs[1][2], [P.legs[1][2][0] + 9 * s * d, P.legs[1][2][1]]], 14 * s, rgba(cd));
  stroke(P.arms[1], 14 * s, rgba(cd));
  if (o.bag) { ctx.fillStyle = rgba(o.bag); rrect(P.sh[0] - d * 30 * s - 20 * s, P.sh[1] + 2 * s, 40 * s, 52 * s, 10 * s); ctx.fill(); }
  const hem = P.pose === 'sit' ? 30 : 44, c = Math.cos(P.lean), sn = Math.sin(P.lean);
  const along = (u, v) => [P.sh[0] + (P.hip[0] - P.sh[0]) * u - c * v * s, P.sh[1] + (P.hip[1] - P.sh[1]) * u + sn * v * s];
  const q = [along(-.06, -22), along(-.06, 22), along(.55, 30), along(1 + hem / 100, 38), along(1 + hem / 100, -38), along(.55, -30)];
  ctx.fillStyle = lg(P.sh[0] - 40 * s, 0, P.sh[0] + 40 * s, 0, lx > 0 ? [[0, cd], [.6, coat], [1, cl]] : [[0, cl], [.4, coat], [1, cd]]);
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.quadraticCurveTo(q[2][0], q[2][1], q[3][0], q[3][1]);
  ctx.quadraticCurveTo((q[3][0] + q[4][0]) / 2, (q[3][1] + q[4][1]) / 2 + 9 * s, q[4][0], q[4][1]); ctx.quadraticCurveTo(q[5][0], q[5][1], q[0][0], q[0][1]); ctx.fill();
  stroke(P.legs[0], 14 * s, rgba(ink)); stroke([P.legs[0][2], [P.legs[0][2][0] + 10 * s * d, P.legs[0][2][1]]], 15 * s, rgba(cd));
  if (!o.hat) { ctx.fillStyle = rgba(coat); ctx.beginPath(); ctx.ellipse(hx - 5 * s * d, hy - 3 * s, r * 1.2, r * 1.26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - r * 1.1, hy + r * .5); ctx.lineTo(hx + r, hy + r * .5); ctx.lineTo(P.sh[0] + 26 * s, P.sh[1] + 8 * s); ctx.lineTo(P.sh[0] - 26 * s, P.sh[1] + 8 * s); ctx.fill(); }
  disc(hx, hy, r, rgba(ink));
  if (o.hat) { ctx.fillStyle = rgba(o.hat); ctx.beginPath(); ctx.arc(hx, hy - r * .1, r * 1.07, Math.PI * 1.0, Math.PI * 2.0); ctx.closePath(); ctx.fill(); rectf(hx - r * 1.1, hy - r * .22, r * 2.2, r * .26, rgba(mix(o.hat, [8, 10, 24], .3))); disc(hx - d * r * .1, hy - r * 1.14, r * .27, rgba(mix(o.hat, rim, .3))); }
  else { ctx.strokeStyle = rgba(coat); ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.08, Math.PI * .12, Math.PI * .88); ctx.stroke(); }
  if (ra > .01) { ctx.strokeStyle = rgba(mix(coat, rim, .7), .9 * ra); ctx.lineWidth = 4.5 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.07, lx > 0 ? -Math.PI * .5 : Math.PI * 1.02, lx > 0 ? -Math.PI * .02 : Math.PI * 1.5); ctx.stroke(); }
  stroke(P.arms[0], 15 * s, rgba(mix(coat, cd, .25))); disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(ink)); disc(P.arms[1][2][0], P.arms[1][2][1], 6 * s, rgba(ink));
}
// a grown-up in a long muted coat: M from man() / schMan(). o: coat, bun (hair in a bun), hat, rim, ra, lx, ly, hem
function schAdult(M, o = {}) {
  const s = M.s, d = M.d, coat = o.coat || [50, 74, 108], cd = mix(coat, [6, 8, 22], .5), ink = o.ink || [12, 13, 24], rim = o.rim || PAL.lamp, ra = o.ra ?? .5;
  const lx = o.lx ?? 1, ly = o.ly ?? -.6, n = Math.hypot(lx, ly) || 1, ux = lx / n * 5 * s, uy = ly / n * 5 * s;
  const [legF, armF, , legN, armN] = M.parts.map(q => q[0]), { hip, sh } = M.j, [hx, hy, hr] = M.head;
  const ax = [hip[0] - sh[0], hip[1] - sh[1]], Ln = Math.hypot(ax[0], ax[1]), a = [ax[0] / Ln, ax[1] / Ln], nn = [-a[1], a[0]], hemK = o.hem ?? 1.62;
  const C = (k, w) => [sh[0] + a[0] * k * Ln + nn[0] * w * s, sh[1] + a[1] * k * Ln + nn[1] * w * s];
  const coatPath = (dx, dy, g) => { const q = [C(-.1, -34 - g), C(-.1, 34 + g), C(.62, 19 + g), C(hemK, 60 + g), C(hemK, -60 - g), C(.62, -19 - g)];
    ctx.beginPath(); ctx.moveTo(q[0][0] + dx, q[0][1] + dy); ctx.lineTo(q[1][0] + dx, q[1][1] + dy); ctx.quadraticCurveTo(q[2][0] + dx, q[2][1] + dy, q[3][0] + dx, q[3][1] + dy); ctx.lineTo(q[4][0] + dx, q[4][1] + dy); ctx.quadraticCurveTo(q[5][0] + dx, q[5][1] + dy, q[0][0] + dx, q[0][1] + dy); ctx.closePath(); };
  const off = pts => pts.map(q => [q[0] + ux, q[1] + uy]), bun = [hx - d * hr * .98, hy - hr * .32];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ra > .01) {                                                          // the rim: the same shapes a little larger, nudged toward the light
    const rc = rgba(rim, Math.min(1, ra * 1.3));
    ctx.save(); ctx.shadowColor = rgba(rim, Math.min(1, ra)); ctx.shadowBlur = 14 * pxPerUnit(ctx);
    stroke(off(legF), 20 * s + 5, rc); stroke(off(legN), 22 * s + 5, rc); stroke(off(armF), 20 * s + 5, rc); stroke(off(armN), 22 * s + 5, rc);
    coatPath(ux, uy, 2.5); ctx.fillStyle = rc; ctx.fill(); disc(hx + ux, hy + uy, hr + 2.5, rc); if (o.bun) disc(bun[0] + ux, bun[1] + uy, hr * .46 + 2.5, rc);
    ctx.restore();
  }
  stroke(legF, 20 * s, rgba(ink)); stroke(legN, 22 * s, rgba(ink));
  for (const f of [legF[2], legN[2]]) stroke([[f[0] - d * 4 * s, f[1] + 3 * s], [f[0] + d * 20 * s, f[1] + 3 * s]], 13 * s, rgba(ink));       // shoes
  stroke(armF, 20 * s, rgba(cd)); disc(armF[2][0], armF[2][1], 10 * s, rgba(ink));
  coatPath(0, 0, 0); ctx.fillStyle = lg(sh[0] - 50 * s, 0, sh[0] + 50 * s, 0, lx > 0 ? [[0, cd], [.62, coat], [1, mix(coat, rim, .16 * ra)]] : [[0, mix(coat, rim, .16 * ra)], [.38, coat], [1, cd]]); ctx.fill();
  const b0 = C(.66, -27), b1 = C(.66, 27); stroke([b0, b1], 8 * s, rgba(cd));                              // a belt
  stroke(armN, 22 * s, rgba(mix(coat, cd, .25)));
  if (o.scarf) { stroke([[sh[0] - d * 16 * s, sh[1] - 2 * s], [sh[0] + d * 20 * s, sh[1] + 6 * s]], 17 * s, rgba(o.scarf)); stroke([[sh[0] + d * 10 * s, sh[1] + 8 * s], [sh[0] + d * 14 * s, sh[1] + 52 * s]], 13 * s, rgba(mix(o.scarf, [8, 10, 24], .25))); } disc(armN[2][0], armN[2][1], 10 * s, rgba(ink));
  disc(hx, hy, hr, rgba(ink));
  if (o.bun) { disc(bun[0], bun[1], hr * .46, rgba(ink)); disc(hx - d * hr * .3, hy - hr * .2, hr * .98, rgba(ink)); }
  if (o.hat) { ctx.fillStyle = rgba(o.hat); ctx.beginPath(); ctx.arc(hx, hy - hr * .12, hr * 1.05, Math.PI * 1.03, Math.PI * 1.97); ctx.closePath(); ctx.fill(); }
  poly([[hx + d * hr * .9, hy - hr * .05], [hx + d * hr * 1.14, hy + hr * .2], [hx + d * hr * .86, hy + hr * .3]], rgba(ink));       // a nose: which way the head looks
  if (ra > .01) { ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.clip(); const gx = hx + ux / (5 * s) * hr * .6, gy = hy + uy / (5 * s) * hr * .6; ctx.fillStyle = rg(gx, gy, 0, hr * 1.2, [[0, mix(ink, rim, .34), .8 * Math.min(1, ra * 1.3)], [1, ink, 0]]); ctx.fillRect(hx - hr, hy - hr, 2 * hr, 2 * hr); ctx.restore(); }
}
// an open umbrella held at (hx, hy): the shaft leans by tilt (radians from straight up). o: R, len, col, rim, ra, rain 0-1, t, n
function schBrolly(hx, hy, o = {}) {
  const R = o.R || 150, len = o.len || 188, col = o.col || [70, 92, 128], cd = mix(col, [6, 8, 22], .45), rim = o.rim || PAL.lamp, ra = o.ra ?? .5, n = o.n || 6, top = -len - R * .5, ey = -len + 8, t = o.t || 0;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke([[0, 10], [0, top - 4]], 5, rgba([16, 18, 30]));
  ctx.strokeStyle = rgba([16, 18, 30]); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-9, 12, 9, 0, Math.PI); ctx.stroke();
  const dome = () => { ctx.beginPath(); ctx.moveTo(-R, ey); ctx.bezierCurveTo(-R * .98, top + R * .12, -R * .5, top, 0, top); ctx.bezierCurveTo(R * .5, top, R * .98, top + R * .12, R, ey);
    for (let i = n; i > 0; i--) { const x1 = -R + (i - 1) * 2 * R / n; ctx.quadraticCurveTo(x1 + R / n, ey - R * .17, x1, ey); } ctx.closePath(); };
  if (ra > .01) { ctx.save(); ctx.translate(0, -4); dome(); ctx.strokeStyle = rgba(rim, Math.min(1, ra * 1.2)); ctx.lineWidth = 5; ctx.shadowColor = rgba(rim, ra); ctx.shadowBlur = 14 * pxPerUnit(ctx); ctx.stroke(); ctx.restore(); }
  dome(); ctx.fillStyle = lg(0, top, 0, ey, [[0, mix(col, rim, .3 * ra)], [.5, col], [1, cd]]); ctx.fill();
  ctx.strokeStyle = rgba(cd, .8); ctx.lineWidth = 2.5;                      // the ribs
  for (let i = 1; i < n; i++) { const x1 = -R + i * 2 * R / n; ctx.beginPath(); ctx.moveTo(0, top); ctx.quadraticCurveTo(x1 * .7, top + R * .1, x1, ey); ctx.stroke(); }
  stroke([[0, top], [0, top - 16]], 4, rgba([16, 18, 30]));
  if (o.rain > .02) {                                                      // rain breaking on it, and running off its points
    additive(() => { for (let i = 0; i < 26; i++) { const life = .16 + rnd(i * 3.1) * .14, ph = ((t + rnd(i * 7.7) * 3) % life) / life, k = rnd(i * 5.3 + Math.floor((t + rnd(i * 7.7) * 3) / life) * 3.7) * 2 - 1, x = k * R * .94, y = top + (1 - Math.sqrt(Math.max(0, 1 - k * k))) * (ey - top) * .9; lite(mix(rim, [255, 255, 255], .4), x, y - ph * 14, 5 + ph * 12, .8 * o.rain * (1 - ph)); } });
    ctx.strokeStyle = rgba(mix(PAL.rainB, rim, .4), .7 * o.rain); ctx.lineWidth = 2.4;
    for (let i = 0; i <= n; i++) { const x1 = -R + i * 2 * R / n, ph = (t * 1.7 + rnd(i * 4.3)) % 1; ctx.beginPath(); ctx.moveTo(x1, ey + ph * ph * 230); ctx.lineTo(x1, ey + ph * ph * 230 + 16 + ph * 30); ctx.stroke(); }
  }
  ctx.restore();
}
// a grown-up walking on ground g, phase ph: returns the pose. o: s, hold (near hand up, holding an umbrella), lean
function schWalker(x, g, ph, d, o = {}) {
  const s = o.s || 1, hy = g - 190 * s - Math.abs(Math.sin(ph)) * 5 * s;
  return schMan({ hip: [x, hy], s, dir: d, lean: o.lean ?? .05, neck: o.neck || 0, feet: stride(x, g, ph, 46 * s, 20 * s, d),
    hr: [o.hold ? [34, 60] : [10 - Math.sin(ph) * 36, 148], o.hr1 || [-6 + Math.sin(ph) * 36, 148]] });
}

// water thrown up where something lands: a ring and a crown of drops (age in seconds)
function schSplash(x, y, age, k = 1, col = [226, 236, 255]) {
  if (age < 0 || age > .45) return;
  const q = age / .45;
  ctx.strokeStyle = rgba(col, .85 * (1 - q)); ctx.lineWidth = 3 * k * (1 - q) + 1;
  ctx.beginPath(); ctx.ellipse(x, y, (14 + 120 * E.out(q)) * k, (4 + 30 * E.out(q)) * k, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = rgba(col, .95 * (1 - q));
  for (let i = 0; i < 10; i++) { const a = -Math.PI * (.1 + .8 * (i + .5) / 10), v = (150 + rnd(i * 3.7) * 190) * k; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * v * age * 1.2, y + Math.sin(a) * v * age * 1.7 + 950 * k * age * age, 3.2 * k, 5.2 * k, 0, 0, TAU); ctx.fill(); }
}
// a long shadow thrown to the right by the low sun: any pose with parts and a head, standing on ground g
function schShadow(P, g, k = 1.3, a = .26, col = [110, 50, 90]) {
  ctx.save(); ctx.transform(1, 0, -k, .34, k * g, .66 * g); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [pts, w] of P.parts) stroke(pts, w, rgba(col)); disc(P.head[0], P.head[1], P.head[2], rgba(col)); ctx.restore();
}
const schLilyParts = P => ({ parts: [[P.legs[0], 14 * P.s], [P.legs[1], 13 * P.s], [[P.hip, P.sh], 66 * P.s]], head: [P.head[0], P.head[1], P.head[2] * 1.2] });
// a closed yellow umbrella (his, for her) from the handle a to the tip b
function schBrollyShut(a, b, lit = 1) {
  const d = v2.sub(b, a), Ln = v2.len(d) || 1, u = [d[0] / Ln, d[1] / Ln], n = [-u[1], u[0]], P = k => [a[0] + u[0] * Ln * k, a[1] + u[1] * Ln * k];
  const Y = mix([110, 80, 12], PAL.yellow, lit), YD = mix([70, 46, 8], PAL.yellowD, lit), wood = [58, 36, 26];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stroke([P(-.1), P(.2)], 7, rgba(wood));
  const h = P(-.1), ang = Math.atan2(n[1], n[0]); ctx.strokeStyle = rgba(wood); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(h[0] + n[0] * 11, h[1] + n[1] * 11, 11, ang + Math.PI, ang + Math.PI * 2.1, u[0] * n[1] - u[1] * n[0] > 0); ctx.stroke();
  poly(stripPts([P(.1), P(.26), P(.7), P(.94)], [6, 16, 12, 3]), rgba(Y));
  poly(stripPts([P(.12), P(.3), P(.7), P(.93)].map(q => [q[0] + n[0] * 6, q[1] + n[1] * 6]), [2, 6, 5, 1]), rgba(YD, .75));
  stroke([P(.16), P(.92)].map(q => [q[0] - n[0] * 5, q[1] - n[1] * 5]), 2.5, rgba(PAL.yellowL, .8 * lit));
  stroke([v2.add(P(.5), v2.mul(n, 13)), v2.add(P(.5), v2.mul(n, -13))], 6, rgba(YD));
  stroke([P(.94), P(1)], 4, rgba(wood));
}
// the teacher: a grown woman, hair in a bun, a long muted coat. o: schMan numbers; L: phone 0-1 (in her near hand, lit)
function schTeacher(o, T, L = {}) {
  const M = schMan(Object.assign({ s: .97 }, o));
  schAdult(M, { coat: [36, 82, 96], bun: 1, scarf: [96, 78, 146], rim: L.rim || T.lightC, ra: L.ra ?? .5, lx: L.lx ?? 1, ly: L.ly ?? -.7, hem: 1.64 });
  if (L.phone > .01) { const [x, y] = M.j.handN, d = M.d;
    ctx.save(); ctx.translate(x - d * 5, y - 12); ctx.rotate(-.32 * d); ctx.fillStyle = rgba([14, 16, 28]); rrect(-8, -24, 16, 46, 4); ctx.fill(); ctx.fillStyle = rgba([196, 224, 255], .95 * L.phone); rrect(d > 0 ? -8 : 4, -21, 4, 40, 2); ctx.fill(); ctx.restore();
    additive(() => { lite([160, 200, 255], x - d * 12, y - 14, 34, .45 * L.phone); lite([226, 240, 255], x - d * 11, y - 14, 9, .8 * L.phone); }); }
  return M;
}
const schCoats = { teal: [38, 84, 92], violet: [78, 60, 118], blue: [58, 78, 118], tealB: [48, 104, 112], violetB: [96, 76, 144], blueB: [70, 92, 136] };

// ---------- LILYOUT: the doors open, the children run out, Lily comes out last and looks for him ----------
shot('lilyout', (t, p, L, len) => {
  const u = L / len;
  fill([40, 30, 80], [20, 16, 50]);
  kcam(L, len, [[0, 1.12, 960, 322], [1, 1.36, 974, 366]], { hand: .35, t });
  schSet(t, { tod: 'dusk', door: .5 + .5 * seg(u, 0, .14, E.out), hall: 1, lit: 'all', fg: 'branchR' }, T => {
    const C = schCoats, kids = [[-1, -.2, 1.34, C.teal, C.violetB], [1, -.06, 1.46, C.violet, null], [-1, .14, 1.28, C.blue, null], [1, .27, 1.38, C.teal, C.blueB]];
    for (const [sd, u0, s, coat, hat] of kids) {                           // out of the door, down the steps, away
      const k = (u - u0) / .7; if (k < 0 || k > 1.3) continue;
      const x = 960 + sd * (26 + 760 * k * (.75 + .25 * k)), y = schYf(6 - 6.4 * inv(.14, .78, k));
      const P = lily({ at: [x, y], s, dir: sd, pose: 'run', ph: k * 26 + sd, lean: .22, swing: Math.sin(k * 26 + sd) * .9 });
      schKid(P, { coat, hat, bag: mix(coat, [10, 10, 30], .45), rim: T.lightC, ra: .7, lx: -sd });
    }
    // Lily, last: she stops on the top step, looks left, then right with a hand over her eyes
    const wk = seg(u, .3, .6, E.out), lookL = seg(u, .64, .75), lookR = seg(u, .82, .93), hd = lerp(lerp(.45, -1, lookL), 1, lookR), d = hd < 0 ? -1 : 1;
    const x = lerp(946, 990, wk), y = lerp(552, 580, wk), ph = wk * 11, mv = 1 - seg(u, .54, .62), toe = Math.max(lookL, lookR) * 6;
    if (u > .26) {
      const o = schLStand(x, y, d, { s: schG.ls * lerp(.95, 1, wk), look: hd * 6, lean: .05 * Math.abs(hd) * seg(u, .6, .7) });
      o.feet = [[x + 11 + Math.sin(ph) * 16 * mv, y - Math.max(0, Math.cos(ph)) * 9 * mv], [x - 11 - Math.sin(ph) * 16 * mv, y - Math.max(0, -Math.cos(ph)) * 9 * mv]];
      o.hip[1] -= toe + Math.abs(Math.sin(ph)) * 3 * mv; o.hr = [[lerp(5, 20, lookR), lerp(62, 46, lookR)], [4, 61]];
      ctx.save(); ctx.globalAlpha = seg(u, .26, .34);
      schDrawLily(schLily(o), schLex('hope', 'worry', .3 * lookR, { gx: .8, gy: -.05, brow: .45 + .3 * lookR }), { a: 1, turn: Math.abs(hd) * .78, rim: T.lightC, glow: .4 });
      ctx.restore();
    }
  });
  stamp(L, '5:30 PM');
}, { bloom: .4, grain: .5 }, [560, 120, 1380, 980]);

// ---------- LILYA: dusk. The others go home under umbrellas; she waves a friend goodbye and sits down to wait ----------
shot('lilyA', (t, p, L, len) => {
  const u = L / len, rk = p.rain ?? .1, C = schCoats;
  fill([40, 30, 80], [20, 16, 50]);
  kcam(L, len, [[0, .8, 960, 392], [1, .95, 1050, 430]], { hand: .3, t });
  schSet(t, { tod: 'dusk', door: 0, hall: 1, lit: 'all', rain: rk, fg: 'branchL' }, T => {
    const sit = seg(u, .5, .8), wave = pulse(u, 0, .46, .01, .1), wv = Math.sin(L * 15) * 10;
    const A = schLStand(1180, 580, -1, { hr: [[lerp(5, 34, wave) + wv * wave, lerp(62, -54, wave)], [4, 61]], look: -3, lean: .05 * wave });
    const B = schLSit(1180, 590, -1, { look: -6, nod: 1 });
    const o = schMix(A, B, sit); o.pose = sit > .5 ? 'sit' : 'stand'; o.hip[1] += Math.sin(L * 2.4) * 1.2;
    schDrawLily(schLily(o), schLex('happy', 'hope', seg(u, .36, .6), { gx: .8 }), { a: 1, turn: .8, rim: T.lightC, glow: .45 });
    // her friend and a parent going off to the left; the friend waves back
    const g = 1052, xa = lerp(560, 150, u), ph = L * 6.2;
    const M1 = schWalker(xa, g, ph, -1, { hold: 1 }); schAdult(M1, { coat: C.violet, rim: T.lightC, ra: .6, lx: 1, hat: [50, 40, 84] });
    const kid = lily({ at: [xa + 104, g + 6], s: 1.5, dir: -1, pose: 'walk', ph: ph * 1.5, look: 7, arms: u < .52 ? [[xa + 104 + 34 + Math.sin(L * 15) * 9, g - 258], null] : [null, null] });
    schKid(kid, { coat: C.blue, hat: C.violetB, bag: [40, 50, 90], rim: T.lightC, ra: .7, lx: 1 });
    schBrolly(M1.j.handN[0], M1.j.handN[1], { R: 176, col: C.violetB, rim: T.lightC, ra: .6, tilt: -.06, rain: rk, t });
    // more of them leaving on the right
    const xb = lerp(1560, 1960, u);
    schKid(lily({ at: [xb - 96, g + 16], s: 1.42, dir: 1, pose: 'walk', ph: ph * 1.5 + 1 }), { coat: C.teal, bag: [40, 60, 90], rim: T.lightC, ra: .7, lx: -1 });
    const M2 = schWalker(xb, g + 12, ph + 2, 1, { hold: 1 }); schAdult(M2, { coat: C.teal, rim: T.lightC, ra: .6, lx: -1, bun: 1 });
    schBrolly(M2.j.handN[0], M2.j.handN[1], { R: 176, col: C.tealB, rim: T.lightC, ra: .6, tilt: .06, rain: rk, t });
    const xc = lerp(2060, 2480, u), M3 = schWalker(xc, g - 30, ph + 4, 1, { hold: 1 }); schAdult(M3, { coat: C.blue, rim: T.lightC, ra: .5, lx: -1 });
    schBrolly(M3.j.handN[0], M3.j.handN[1], { R: 166, col: C.blueB, rim: T.lightC, ra: .6, tilt: .04, rain: rk, t });
  });
  stamp(L, '5:45 PM');
}, { bloom: .4, grain: .5 }, [860, 300, 1560, 900]);

// ---------- LILYB: the first rain. The teacher comes out, looks at her watch, at Lily, and calls; the street lamp comes on ----------
shot('lilyB', (t, p, L, len) => {
  const u = L / len;
  fill([14, 14, 46], [8, 8, 30]);
  kcam(L, len, [[0, .96, 1130, 336], [1, 1.05, 1150, 340]], { hand: .3, t });
  const lamp = u < .44 ? 0 : u < .68 ? (noise1(t * 30, 3) > -.1 ? .3 + .6 * inv(.44, .68, u) : .05) : 1 - .05 * Math.abs(Math.sin(t * 37)) * inv(.9, .68, u);
  const rk = lerp(.3, .55, u);
  schSet(t, { tod: ['dusk', 'eve', .78], door: .42 * (1 - seg(u, .05, .4)), hall: .8, lit: [0, 1, 6], lamp, rain: rk, fg: 'branchR', mist: .6 }, T => {
    // the teacher: out of the door to stand behind Lily
    const wk = seg(u, 0, .26, E.out), x = lerp(1004, 1088, wk), g = 562, ph = wk * 7;
    const walk = { hip: [x, g - 188 - Math.abs(Math.sin(ph)) * 5], feet: stride(x, g, ph, 40, 16, 1), lean: .06, neck: 0, dir: 1, hr: [[10 - Math.sin(ph) * 30, 148], [-6 + Math.sin(ph) * 30, 148]] };
    const stand = schMStand(1088, g, 1, { hip: [1088, g - 190] });
    const watch = schMix(stand, { hr: [[10, 150], [64, 62]], neck: .42, lean: .04 }, 1), down = schMix(stand, { hr: [[10, 150], [30, 138]], neck: .62, lean: .09 }, 1);
    const call = schMix(stand, { hr: [[40, -34], [-6, 150]], neck: .3, lean: .05 }, 1);
    const o = u < .26 ? walk : schKeys(u, [[.26, stand], [.4, watch], [.5, watch], [.62, down], [.7, down], [.86, call], [1, call]]);
    o.hip = [o.hip[0], o.hip[1] + Math.sin(L * 2) * 1.2];
    const M = schTeacher(o, T, { phone: seg(u, .74, .84), rim: mix(T.lightC, PAL.lamp, lamp), ra: .45 + .3 * lamp, lx: 1, ly: -.8 });
    if (u > .3 && u < .6) { const [wx, wy] = M.j.handF; disc(wx - 6, wy - 3, 6, rgba(PAL.brass)); additive(() => lite([255, 240, 220], wx - 6, wy - 4, 16, .7 * pulse(u, .36, .5, .04, .06))); }   // her watch
    // Lily, still looking down the road
    const B = schLSit(1180, 590, -1, { look: -6 - seg(u, .3, .6) * 2, nod: 1 + seg(u, .2, .5) * 2, lean: .06 + .1 * seg(u, .15, .5) });
    B.hip[1] += Math.sin(L * 2.2 + 1) * 1.2;
    schDrawLily(schLily(B), schBlink(schLex('hope', 'worry', .35 + .5 * u, { gx: .85 }), u, .56, .1), { a: .86 + .14 * lamp, turn: .82, rim: mix(T.lightC, PAL.lamp, lamp), glow: .35 + .25 * lamp, wet: rk });
  });
  stamp(L, '6:20 PM');
}, { bloom: .42, grain: .5 }, [760, 150, 1480, 940]);

// ---------- LILYC: full night, hard rain. One window, the lamp, the teacher's umbrella; Lily hugs her knees ----------
shot('lilyC', (t, p, L, len) => {
  const u = L / len, s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .94, 1150, 330], [1, 1.12, 1150, 352]], { hand: .25, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', door: 0, hall: .12, lit: 'one', lamp, rain: .95, fg: 'branchL', mist: 1 }, T => {
    const o = schMStand(1076, 562, 1, { hip: [1076, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [[40, -34], [74, 60]], neck: .3 + .1 * Math.sin(L * 1.3), lean: .04 });
    const M = schTeacher(o, T, { phone: 1, rim: PAL.lamp, ra: .7, lx: 1, ly: -.9 });
    // Lily: knees hugged, her chin on them; a shiver, and one look down the road
    const lookUp = pulse(u, .4, .74, .12, .14), sh = Math.sin(L * 33) * .7 * pulse(u, .08, .3, .05, .1);
    const B = { hip: [1190 + sh, 588 - 6 * s], feet: [[1190 - 31 * s, 586], [1190 - 25 * s, 586]], lean: .3 - .08 * lookUp, neck: .75 - .6 * lookUp, look: -2 * lookUp, nod: 12 - 10 * lookUp, dir: -1, s, hr: [[31, 46], [26, 44]], pose: 'sit' };
    ctx.save(); ctx.beginPath(); ctx.rect(600, 0, 1200, 596); ctx.clip();
    schDrawLily(schLily(B), schLex('blank', 'worry', lookUp, { gx: .7 * lookUp, gy: .7 - .6 * lookUp }), { a: 1, turn: .8, rim: PAL.lamp, glow: .8, wet: 1 });
    ctx.restore();
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.05 + Math.sin(L * 1.1) * .012, rain: 1, t, n: 8 });
  });
  stamp(L, '7:30 PM');
}, { bloom: .42, grain: .55 }, [700, 120, 1500, 960]);

// ---------- LILYFACE: her face in the hood, the rain, the lamp out of focus behind. p.ex 'worry' (default) | 'hurt' ----------
shot('lilyface', (t, p, L, len) => {
  const u = L / len, hurt = (p.ex || 'worry') === 'hurt';
  fill([18, 20, 66], [8, 10, 36]);
  kcam(L, len, hurt ? [[0, 1, 960, 540], [1, 1.13, 1000, 520]] : [[0, 1.03, 960, 540], [1, 1.08, 930, 536]], { hand: .3, t });
  // the night behind her, far out of focus: the lamp and its cone, a lit window, the wet steps
  ctx.fillStyle = lg(0, 700, 0, 1300, [[0, [30, 34, 96], 0], [1, [44, 46, 120], .9]]); ctx.fillRect(-600, 700, 3200, 700);
  const lx = hurt ? 420 : 1540, ly = 150;
  blurred(26, () => { rectf(hurt ? 1480 : 150, 260, 210, 420, rgba([255, 160, 110], .5)); });
  cone(lx, ly, 60, 760, 1300, PAL.lamp, .16, hurt ? 260 : -260);
  additive(() => { lite(PAL.lamp, lx, ly, 760, .5); lite(PAL.lamp, lx, ly, 260, .8); });
  bokeh(hurt ? 21 : 5, 9, [-100, 120, 2020, 900], [PAL.lamp, [150, 170, 255], [255, 170, 130]], 46, 110, .3, t);
  rain(t, { n: 90, len: 150, a: .2, w: 3, seed: 3, slant: .16 });
  kcam(L, len, hurt ? [[0, 1, 960, 540], [1, 1.13, 1000, 520]] : [[0, 1.03, 960, 540], [1, 1.08, 930, 536]], { hand: .3, t });
  const x = hurt ? 1000 : 930, y = 560 + Math.sin(L * 2.1) * 4, r = hurt ? 258 : 246, tr = hurt ? .3 : .56;
  let ex;
  if (hurt) ex = schBlink(schLex('worry', 'hurt', .55 + .45 * seg(u, 0, .5), { gx: .55, gy: .55, smile: -.62 - .1 * Math.sin(L * 16) * seg(u, .3, .8), tear: seg(u, .2, .9), lid: .16 }), u, .5, .12);
  else ex = schBlink(schLex('hope', 'worry', .5 + .5 * seg(u, 0, .6), { gx: .95, gy: .12, smile: -.48 }), u, .58, .16);
  additive(() => lite(PAL.lamp, x + (hurt ? -r : r) * 1.0, y - r * .9, r * 1.5, .3));
  lilyBust(x, y, r, ex, { a: 1, rim: PAL.lamp, turn: tr, dir: -1, wet: 1, t, glow: .5, tilt: hurt ? .03 : -.02 + Math.sin(L * 1.3) * .01 });
  // the lamp on the edge of her hood, rain running off it
  ctx.strokeStyle = rgba([255, 240, 214], .75); ctx.lineWidth = r * .035; ctx.lineCap = 'round';
  ctx.beginPath(); if (hurt) ctx.arc(x, y - r * .06, r * 1.29, Math.PI * 1.08, Math.PI * 1.42); else ctx.arc(x, y - r * .06, r * 1.29, Math.PI * 1.58, Math.PI * 1.92); ctx.stroke();
  ctx.fillStyle = rgba([226, 238, 255], .8);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * .1), k = (t * (.9 + rnd(i * 2.1) * .7) + rnd(i * 3.3)) % 1, hx = x + Math.cos(a) * r * 1.3, hy = y - r * .06 + Math.sin(a) * r * 1.3; ctx.beginPath(); ctx.ellipse(hx + Math.cos(a) * 6, hy + k * k * r * 1.5, r * .016, r * (.03 + .05 * k), 0, 0, TAU); ctx.fill(); }
  if (hurt) {                                                              // her eyes shine
    const R = r * 1.2, fy = y + r * .14 - .05 * R, sp = .6 + .4 * Math.sin(L * 7);
    for (const ex0 of [x - R * lerp(-.37, .25, tr), x - R * lerp(.37, .71, tr)]) {
      additive(() => { lite([255, 244, 226], ex0 - R * .03, fy + R * .035, R * .1, .55 * seg(u, .1, .5)); lite([255, 255, 255], ex0 - R * .045, fy - R * .02, R * .03, .9 * sp * seg(u, .1, .5)); });
      ctx.strokeStyle = rgba([255, 250, 240], .55 * seg(u, .15, .6)); ctx.lineWidth = R * .014; ctx.beginPath(); ctx.arc(ex0, fy - R * .02, R * .13, Math.PI * .22, Math.PI * .78); ctx.stroke();
    }
  }
  blurred(5, () => rain(t, { n: 26, len: 260, a: .3, w: 6, seed: 12, slant: .16, speed: 2600 }));
}, { bloom: .45, grain: .5 }, (t, p) => (p && p.ex === 'hurt') ? [640, 180, 1360, 960] : [570, 180, 1290, 960]);

// ---------- KNUCKLES: her small hand taps the wet stone, three times (.1, .35, .6 s) ----------
shot('knuckles', (t, p, L, len) => {
  const taps = [.1, .35, .6], jolt = Math.max(0, ...taps.map(a => L >= a ? 1 - (L - a) / .1 : 0));
  fill([12, 14, 46], [6, 8, 26]);
  kcam(L, len, [[0, 1.04, 960, 552], [1, 1.1, 946, 566]], { hand: .4, t, jolt: jolt * .35 });
  // the step, close: the riser behind, the wet tread, its edge, the dark below
  ctx.fillStyle = lg(0, -300, 0, 330, [[0, [22, 24, 66]], [1, [46, 46, 104]]]); ctx.fillRect(-600, -400, 3200, 730);
  ctx.fillStyle = lg(0, 330, 0, 850, [[0, [62, 62, 128]], [1, [104, 100, 170]]]); ctx.fillRect(-600, 330, 3200, 520);
  rectf(-600, 330, 3200, 14, lg(0, 330, 0, 344, [[0, [0, 0, 20], .5], [1, [0, 0, 20], 0]]));
  ctx.fillStyle = rgba([0, 0, 24], .2); poly([[330, 344], [350, 344], [250, 850], [222, 850]]); ctx.fill();
  rectf(-600, 850, 3200, 7, rgba([190, 190, 240], .8)); ctx.fillStyle = lg(0, 857, 0, 1300, [[0, [40, 40, 96]], [1, [14, 16, 48]]]); ctx.fillRect(-600, 857, 3200, 500);
  pool(1240, 560, 980, 250, PAL.lamp, .42); pool(1320, 600, 520, 60, PAL.lamp, .28);
  additive(() => lite(PAL.lamp, 1500, -60, 900, .35));
  ripples(t, -200, 2100, 380, 820, 16, [200, 214, 255], .55, 4);
  const hgt = L < .1 ? 64 * (1 - Math.pow(L / .1, 2)) : L < .6 ? 66 * Math.pow(Math.abs(Math.sin(Math.PI * (L - .1) / .25)), .8) : 44 * E.out(inv(.6, .8, L));
  const cx = 930 + hgt * .25, cy = 512 - hgt, sq = Math.max(0, 1 - hgt / 10) * 5;
  oval(930, 640, 190 - hgt, 26 - hgt * .12, rgba([8, 8, 30], .42));                                  // its shadow and reflection on the wet stone
  additive(() => { ctx.save(); ctx.translate(1380, 700); ctx.scale(1, .3); lite(PAL.yellow, 0, 0, 520, .16); ctx.restore(); });
  for (const a of taps) { schSplash(930, 640, L - a, 2.1, [255, 240, 220]); if (L >= a && L - a < .3) { ctx.strokeStyle = rgba([255, 244, 226], .5 * (1 - (L - a) / .3)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(930, 640, 60 + (L - a) * 1200, 14 + (L - a) * 250, 0, 0, TAU); ctx.stroke(); } }
  // the sleeve and the fist
  const el = [1900, -240], w = [cx + 150, cy - 128], ang = Math.atan2(w[1] - el[1], w[0] - el[0]), n = [-Math.sin(ang), Math.cos(ang)];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const fist = (dx, dy, g, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy + sq * .5, 132 + g, 108 + g - sq, -.35, 0, TAU); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(cx - 96 + i * 56 + dx, cy + 82 - i * 9 + dy + sq * .3, 38 + g, 42 + g - sq * .6, 0, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(cx - 118 + dx, cy + 6 + dy, 44 + g, 66 + g, .5, 0, TAU); ctx.fill();                                // the thumb
    ctx.lineWidth = 150 + 2 * g; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(cx + 40 + dx, cy - 40 + dy); ctx.lineTo(w[0] + dx, w[1] + dy); ctx.stroke(); };
  fist(7, -7, 4, rgba(PAL.lamp, .85)); fist(0, 0, 0, rgba([10, 11, 16]));
  ctx.strokeStyle = rgba([40, 40, 60], .9); ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - 68 + i * 56, cy + 52 - i * 9); ctx.lineTo(cx - 70 + i * 56, cy + 112 - i * 9); ctx.stroke(); }
  const sl = k => [lerp(w[0], el[0], k), lerp(w[1], el[1], k)];
  ctx.strokeStyle = rgba(mix(PAL.yellow, PAL.yellowL, .5)); ctx.lineWidth = 262; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(...v2.add(sl(.05), [5, -6])); ctx.lineTo(...v2.add(sl(1), [5, -6])); ctx.stroke();
  ctx.strokeStyle = lg(w[0] + n[0] * 130, w[1] + n[1] * 130, w[0] - n[0] * 130, w[1] - n[1] * 130, [[0, PAL.yellowD], [.45, PAL.yellow], [1, mix(PAL.yellow, PAL.yellowL, .25)]]); ctx.lineWidth = 256;
  ctx.beginPath(); ctx.moveTo(...sl(.05)); ctx.lineTo(...sl(1)); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.yellowD); ctx.lineWidth = 276; ctx.beginPath(); ctx.moveTo(...sl(.02)); ctx.lineTo(...sl(.085)); ctx.stroke();      // the cuff
  ctx.strokeStyle = rgba(mix(PAL.yellowD, [60, 40, 0], .3), .7); ctx.lineWidth = 8; ctx.lineCap = 'round';
  for (const k of [.3, .52]) { const a = v2.add(sl(k), v2.mul(n, 90)), b = v2.add(sl(k + .05), v2.mul(n, -30)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(sl(k + .08)[0], sl(k + .08)[1], b[0], b[1]); ctx.stroke(); }
  ctx.fillStyle = rgba([240, 246, 255], .8); for (let i = 0; i < 7; i++) { const k = .1 + rnd(i * 3.1) * .7, q = v2.add(sl(k), v2.mul(n, (rnd(i * 5.7) - .5) * 200)); ctx.beginPath(); ctx.ellipse(q[0], q[1] + ((t * 60 + i * 37) % 40), 4, 7, 0, 0, TAU); ctx.fill(); }   // rain on the sleeve
  cone(1500, -260, 80, 900, 1500, PAL.lamp, .1, -420);
  blurred(16, () => { ctx.fillStyle = rgba(PAL.yellow, .95); ctx.beginPath(); ctx.ellipse(2010, 900, 330, 520, .2, 0, TAU); ctx.fill(); });     // her coat, near the lens
  rain(t, { n: 110, len: 170, a: .3, w: 3.4, slant: .16, speed: 2500 });
}, { bloom: .45, grain: .55 }, [560, 160, 1420, 940]);

// ---------- the man at the steps, in the rain ----------
const schRimN = [200, 220, 255];                                          // the rain shots: a cool blue-white rim
// the run in from the left (x, phase), the stumble, bent with his hands on his knees
const schRunO = (x, g, ph) => ({ hip: [x, g - 176 - Math.abs(Math.cos(ph)) * 10], feet: stride(x - 10, g, ph, 84, 70, 1), lean: .36, neck: .08, dir: 1,
  hr: [[26 - Math.sin(ph) * 80, 96 - Math.max(0, -Math.sin(ph)) * 44], [26 + Math.sin(ph) * 80, 96 - Math.max(0, Math.sin(ph)) * 44]] });
function schBentO(x, g, lean = 1.1, hipY = 165, back = .1) {            // bent over, hands on his knees (found from the knees themselves)
  const o = { hip: [x, g - hipY], feet: [[x + 84, g], [x + 40, g]], lean, neck: .3, dir: 1 }, M = man(o), sh = M.j.sh;
  o.hr = [M.j.kneeN, M.j.kneeF].map(k => { const q = v2.lerp(k, o.hip, back); return [q[0] - sh[0], q[1] - sh[1] - 8]; });
  return o;
}
const schKneelO = (x, g, o = {}) => Object.assign({ hip: [x, g - 102], feet: [[x - 96, g - 10], [x - 114, g - 10]], lean: .1, neck: 0, dir: 1, hr: [[12, 148], [-4, 148]] }, o);

// ---------- ARRIVE: he runs in, stumbles to a stop at the foot of the steps; at the top, under the umbrella, she looks down at him ----------
shot('arrive', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .9, 760, 590], [.5, .88, 900, 560], [1, .94, 930, 548]], { hand: .5, t });
  const rk = lerp(.62, .4, u), lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: rk, mist: .8, fg: 'branchL' }, T => {
    // at the top: the teacher lowers the phone; Lily, beside her, looks down at him
    const see = seg(u, .36, .56);
    const o = schMStand(1272, 562, -1, { hip: [1272, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [schMix([40, -34], [10, 148], seg(u, .5, .72)), [70, 60]], neck: .2 + .25 * see, lean: .03 });
    const M = schTeacher(o, T, { phone: 1 - seg(u, .5, .62), rim: PAL.lamp, ra: .65, lx: 1, ly: -.9 });
    const B = schLStand(1150, 578, -1, { look: -5 - 2 * see, nod: 1 + 4 * see, lean: .05 * see, hr: [[lerp(5, 12, see), lerp(62, 34, see)], [4, 61]] });
    B.hip[1] += Math.sin(L * 2.2) * 1 - 3 * pulse(u, .36, .5, .04, .1);
    schDrawLily(schLily(B), schLex('worry', 'hurt', .2 + .6 * see, { gx: .6, gy: .7 * see }), { a: 1, turn: .8, rim: PAL.lamp, glow: .7, wet: .5 });
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.03 + Math.sin(L * 1.1) * .012, rain: rk, t, n: 8 });
    // him
    const k = inv(0, .44, u), x = -360 + 1070 * (1 - Math.pow(1 - k, 1.7)), ph = x / 80, hv = Math.sin(L * TAU * 2.3) * (1 - .5 * seg(u, .6, 1));
    const run = schRunO(x, g, ph), trip = { hip: [716, g - 150], feet: [[812, g], [640, g]], lean: .84, neck: -.05, dir: 1, hr: [[84, 50], [56, 100]] };
    const bent = schBentO(730, g, 1.1 + hv * .05, 165 - hv * 5), up = schBentO(730, g, .98 + hv * .04, 168 - hv * 4, .3); up.neck = -.8;
    const O = u < .44 ? run : schKeys(u, [[.44, run], [.53, trip, E.out], [.66, bent], [.78, bent], [.92, up], [1, up]]);
    const ex = schEx(schEx('strain', 'tired', seg(u, .5, .7)), 'fear', seg(u, .8, .95) * .7, { gx: .8, gy: lerp(.4, -.8, seg(u, .78, .92)), open: .22 + .16 * Math.abs(hv) });
    const P = schMan(O); drawMan(P, ex, { rim: schRimN, a: .8, lx: 1, ly: -.7, back: true, light: PAL.lamp, la: .3 });
    schSplash(700, g + 6, (u - .47) * len, 1.3); schSplash(812, g + 6, (u - .53) * len, 1.6); schSplash(770, g + 8, (u - .62) * len, 1);
    ctx.fillStyle = rgba([220, 232, 255], .8);                             // he is soaked: it runs off him
    for (let i = 0; i < 7; i++) { const q = i % 2 ? P.j.elN : i % 3 ? P.head : P.j.handF, kk = (t * 1.6 + rnd(i * 2.7)) % 1; ctx.beginPath(); ctx.ellipse(q[0] + (rnd(i * 4.1) - .5) * 50, q[1] + 20 + kk * kk * 150, 2.6, 5, 0, 0, TAU); ctx.fill(); }
  });
  stamp(L, '7:45 PM');
}, { bloom: .42, grain: .55 }, (t, p, L, len) => { const u = L / len; return [lerp(200, 520, clamp(u * 2)), 120, lerp(1100, 1400, clamp(u * 2)), 1000]; });

// Lily coming down one step at a time: c from the tread she starts on down to the one she stops on (each unit one step)
function schLilyDown(x0, k0, c, dx, o = {}) {
  const s = schG.ls, n = Math.floor(c), q = c - n, ka = k0 - n, kb = ka - 1, xa = x0 + dx * n, xb = xa + dx, ya = schY(ka), yb = schY(kb);
  const lead = E.io(inv(0, .45, q)), trail = E.io(inv(.5, .95, q)), body = E.io(inv(.12, .7, q));
  const f0 = [lerp(xa, xb, lead) - 7 * s, lerp(ya, yb, lead) - Math.sin(Math.PI * lead) * 12], f1 = [lerp(xa, xb, trail) + 7 * s, lerp(ya, yb, trail) - Math.sin(Math.PI * trail) * 12];
  return Object.assign({ hip: [lerp(xa, xb, body), lerp(ya, yb, body) - 57.6 * s + Math.sin(Math.PI * body) * 5], feet: [f0, f1], lean: .03, neck: 0, look: 0, nod: 0, dir: -1, s, hr: [[5, 62], [4, 61]], pose: 'stand' }, o);
}
// ---------- KNEEL: he sinks to his knees and opens his arms; she comes down alone and stops one step short ----------
shot('kneel', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, .96, 1010, 640], [1, 1.1, 975, 770]], { hand: .3, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41)), rk = .4;
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: rk, mist: .8, fg: 'branchR' }, T => {
    pool(1000, 1010, 330, 60, PAL.lamp, .3);
    const o = schMStand(1272, 562, -1, { hip: [1272, 562 - 190 + Math.sin(L * 2) * 1.2], hr: [[10, 148], [70, 60]], neck: .42, lean: .04 });
    const M = schTeacher(o, T, { rim: PAL.lamp, ra: .65, lx: 1, ly: -.9 });
    schBrolly(M.j.handF[0], M.j.handF[1], { R: 250, len: 262, col: [66, 88, 132], rim: PAL.lamp, ra: .85, tilt: -.02, rain: rk, t, n: 8 });
    // him: down on his knees, his arms open to her
    const st = schMStand(764, g, 1, { hip: [764, g - 180], feet: [[790, g], [744, g]], lean: .34, neck: -.56, hr: [[-6, 146], [-22, 140]] }), kn = schKneelO(790, g, { neck: -.12, lean: .1 });
    const open = schMix(kn, { hr: [[108, 66], [126, 22]], lean: .16 }, 1), sag = schMix(kn, { hr: [[100, 82], [112, 46]], lean: .13, neck: -.04 }, 1);
    const O = schKeys(u, [[0, st], [.22, kn, E.io], [.44, open, E.out], [.76, open], [1, sag]]);
    O.hip = [O.hip[0], O.hip[1] + Math.sin(L * 2.6) * 1.6]; O.hr = O.hr.map((h, i) => [h[0], h[1] + Math.sin(L * 9 + i) * 1.5 * seg(u, .44, .6)]);
    const ex = schEx('ashamed', 'fear', .25, { gx: .85, gy: -.1, brow: .95, browH: .12, lid: .2, smile: -.35 + .3 * pulse(u, .3, .7, .1, .15), open: .1 });
    drawMan(schMan(O), schBlink(ex, u, .6, .05), { rim: schRimN, a: .8, lx: 1, ly: -.7, back: true, light: PAL.lamp, la: .34 });
    schSplash(800, g + 6, (u - .2) * len, 1.2);
    // Lily: three steps down, slowly, and she stops out of reach
    const c = clamp((u - .05) / .7, 0, 1) * 3, stop = seg(u, .76, .9);
    const B = schLilyDown(1174, 4, Math.min(c, 2.999), -30, { look: -4, nod: 2 + 5 * stop, lean: .03 - .05 * stop });
    B.hip[1] += Math.sin(L * 2.3) * 1;
    schDrawLily(schLily(B), schLex('hurt', 'blank', .5 * stop, { gx: .5 * (1 - stop), gy: .3 + .6 * stop }), { a: 1, turn: .8, rim: PAL.lamp, glow: .75, wet: 1 });
  });
}, { bloom: .42, grain: .55 }, [480, 130, 1300, 1000]);

// his open hand at the end of his arm (close shots): wrist w, the way the forearm points (radians), open 0-1
function schHand(w, ang, open = 1, rim = null, s = 1) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pt = (a, r) => [w[0] + Math.cos(ang + a) * r * s, w[1] + Math.sin(ang + a) * r * s];
  const draw = (dx, dy, g, col) => { for (let i = 0; i < 4; i++) { const a = (i - 1.4) * .2 * (.4 + .6 * open) + .05; stroke([[w[0] + dx, w[1] + dy], [pt(a, 30)[0] + dx, pt(a, 30)[1] + dy]], 7.5 * s + g, col); }
    stroke([[w[0] + dx, w[1] + dy], [pt(-.95 - .2 * open, 19)[0] + dx, pt(-.95 - .2 * open, 19)[1] + dy]], 8 * s + g, col); };
  if (rim) draw(2.5, -2.5, 3, rgba(rim, .8));
  draw(0, 0, 0, rgba(PAL.ink));
}
// ---------- REACH: close. His hand rises toward her; she takes half a step back; his hand stops in the air and sinks ----------
shot('reach', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls;
  fill([8, 10, 36], [4, 6, 22]);
  kcam(L, len, [[0, 1.86, 944, 806], [1, 2.08, 950, 790]], { hand: .25, t });
  const lamp = 1 - .04 * Math.abs(Math.sin(t * 41));
  schSet(t, { tod: 'night', hall: .12, lit: 'one', lamp, rain: .34, mist: .5, soft: 6 }, T => {
    rectf(-400, 300, 2800, 1100, lg(0, 500, 0, 1100, [[0, [6, 8, 40], .62], [.6, [6, 8, 40], .3], [1, [6, 8, 40], .5]]));          // the night closes in round them
    pool(1010, 1010, 420, 76, PAL.lamp, .5); additive(() => { lite(PAL.lamp, 1040, 760, 430, .2); });
    cone(1150, 300, 60, 330, 760, PAL.lamp, .16, -150);
    const kn = schKneelO(790, g, { neck: -.1, lean: .12, hr: [[100, 82], [112, 46]] });
    const rise = schMix(kn, { hr: [[146, 50], [70, 120]], lean: .24, neck: -.14 }, 1), hang = schMix(kn, { hr: [[140, 58], [40, 138]], lean: .19, neck: -.06 }, 1);
    const drop = schMix(kn, { hr: [[34, 142], [-2, 148]], lean: .06, neck: .5, hip: [786, g - 98] }, 1);
    const O = schKeys(u, [[0, kn], [.3, rise, E.out], [.46, hang], [.66, hang], [1, drop]]);
    const tr = pulse(u, .4, .7, .06, .1); O.hr = [[O.hr[0][0] + noise1(t * 14, 2) * 3 * tr, O.hr[0][1] + noise1(t * 12, 5) * 3 * tr], O.hr[1]];
    O.hip = [O.hip[0], O.hip[1] + Math.sin(L * 2.6) * 1.4];
    const hope = { lid: .14, brow: .7, browH: .15, smile: .22, open: .1, grit: 0, gx: .85, gy: -.05, tear: 0, sweat: 0 };
    const ex = schBlink(schEx(hope, 'ashamed', seg(u, .4, .78), { tear: seg(u, .7, 1) * .8 }), u, .52, .05);
    const M = schMan(O); drawMan(M, ex, { rim: schRimN, a: .55, lx: 1, ly: -.7, back: false, light: PAL.lamp, la: .4 });
    const fa = Math.atan2(M.j.handN[1] - M.j.elN[1], M.j.handN[0] - M.j.elN[0]);
    schHand(M.j.handN, fa, 1 - .7 * seg(u, .66, 1), schRimN); schHand(M.j.handF, Math.atan2(M.j.handF[1] - M.j.elF[1], M.j.handF[0] - M.j.elF[0]), .3, null);
    // Lily: half a step back
    const bk = seg(u, .3, .5), X = 1084, bx = X + 36 * bk, y1 = schY(1);
    const B = schLStand(bx, y1, -1, { look: -4 + 5 * bk, nod: 3 + 5 * seg(u, .4, .7), lean: -.07 * bk + .03, hr: [[lerp(5, -8, bk), lerp(62, 56, bk)], [4, 61]] });
    B.feet = [[X - 7 * s + 36 * seg(u, .38, .52), y1 - Math.sin(Math.PI * seg(u, .38, .52)) * 7], [X + 7 * s + 40 * seg(u, .28, .42), y1 - Math.sin(Math.PI * seg(u, .28, .42)) * 8]];
    B.hip[1] += Math.sin(L * 2.3) * 1;
    schDrawLily(schLily(B), schBlink(schLex('hurt', 'blank', .3 * seg(u, .5, .9), { gx: .5 * (1 - bk), gy: .25 + .65 * seg(u, .3, .6) }), u, .34, .06), { a: 1, turn: .8, rim: PAL.lamp, glow: .8, wet: 1 });
  });
  blurred(5, () => rain(t, { n: 18, len: 240, a: .26, w: 6, seed: 12, slant: .16, speed: 2600 }));
}, { bloom: .42, grain: .55 }, [420, 100, 1500, 1000]);

// ---------- the sunlit shots ----------
const schRimG = [255, 196, 112];                                          // golden hour: a warm gold rim
// climbing, seen from behind: c in treads (each unit one step up); the body rises over the foot that stands
function schClimb(c, x, hipH, half) {
  const n = Math.floor(c), f = c - n, e = E.io(f), par = ((n % 2) + 2) % 2;
  const foot = pr => pr === par ? [x + (pr ? half : -half), schY(n)] : [x + (pr ? half : -half), lerp(schY(n - 1), schY(n + 1), e) - Math.sin(Math.PI * f) * 14];
  return { hipY: lerp(schY(n - 1), schY(n), e) - hipH, feet: [foot(0), foot(1)], par, f };
}
// him from behind, walking up. o: turn (his head, toward her), lift (his hand on her side, 0-1)
function schManBack(x, c, o = {}) {
  const K = schClimb(c, x, 192, 22), hip = [x + (K.par ? 1 : -1) * Math.cos(Math.PI * K.f) * 5, K.hipY], shY = hip[1] - 182, LL = 196, sw = Math.sin(c * Math.PI);
  const leg = (F, sd) => { const H = [hip[0] + sd * 20, hip[1]], d = Math.hypot(F[0] - H[0], F[1] - H[1]) || 1, k = Math.min(1, LL / d), ft = [H[0] + (F[0] - H[0]) * k, H[1] + (F[1] - H[1]) * k], bend = Math.sqrt(Math.max(0, LL * LL - Math.pow(Math.min(d, LL), 2))) * .05;
    return [H, [(H[0] + ft[0]) / 2 + sd * bend, (H[1] + ft[1]) / 2 - bend * .4], ft]; };
  const arm = (sd, lift) => [[hip[0] + sd * 46, shY + 14], [hip[0] + sd * (58 + lift * 12), shY + 98 - lift * 6], [hip[0] + sd * (60 + lift * 30), shY + 172 - Math.max(0, sd * sw) * 14 - lift * 24]];
  return { head: [hip[0] + (o.turn || 0) * 15, shY - 66, 40], hip, shY, handR: arm(1, o.lift || 0)[2],
    parts: [[leg(K.feet[0], -1), 34], [leg(K.feet[1], 1), 34], [[[hip[0], hip[1] - 8], [hip[0], shY + 10]], 74], [[[hip[0] - 40, shY + 8], [hip[0] + 40, shY + 8]], 34], [arm(-1, 0), 22], [arm(1, o.lift || 0), 22]] };
}
// Lily from behind, walking up, her school bag on her back. o: turn (her hood, -1 toward him on her left), bag (colour)
function schLilyBack(x, c, o = {}) {
  const s = schG.ls, K = schClimb(c, x, 54 * s, 9 * s), Y = PAL.yellow, YD = PAL.yellowD, YL = mix(Y, PAL.yellowL, .6), ink = PAL.ink;
  const hipY = Math.min(K.hipY, Math.min(K.feet[0][1], K.feet[1][1]) - 32 * s), shY = hipY - 62 * s, r = 31 * s, hx = x + (o.turn || 0) * 8 * s, hy = shY - 33 * s, bg = o.bag || [58, 122, 132];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  K.feet.forEach((F, i) => { const H = [x + (i ? 9 : -9) * s, hipY]; stroke([H, [(H[0] + F[0]) / 2 + (i ? 3 : -3) * s, (H[1] + F[1]) / 2], F], 13 * s, rgba(ink)); stroke([[F[0], F[1] - 1 * s], [F[0], F[1] - 8 * s]], 16 * s, rgba(i ? Y : YD)); });
  stroke([[x - 25 * s, shY + 8 * s], [x - 35 * s, shY + 54 * s]], 14 * s, rgba(YD)); disc(x - 36 * s, shY + 61 * s, 6.5 * s, rgba(ink));
  stroke([[x + 25 * s, shY + 8 * s], [x + 35 * s, shY + 54 * s]], 14 * s, rgba(mix(Y, YD, .4))); disc(x + 36 * s, shY + 61 * s, 6.5 * s, rgba(ink));
  ctx.fillStyle = lg(x - 40 * s, 0, x + 40 * s, 0, [[0, YD], [.45, Y], [1, YL]]);
  ctx.beginPath(); ctx.moveTo(x - 22 * s, shY - 4 * s); ctx.lineTo(x + 22 * s, shY - 4 * s); ctx.quadraticCurveTo(x + 30 * s, shY + 34 * s, x + 40 * s, hipY + 26 * s); ctx.quadraticCurveTo(x, hipY + 37 * s, x - 40 * s, hipY + 26 * s); ctx.quadraticCurveTo(x - 30 * s, shY + 34 * s, x - 22 * s, shY - 4 * s); ctx.fill();
  poly([[hx - r * .95, hy + r * .5], [hx + r * .95, hy + r * .5], [x + 25 * s, shY + 8 * s], [x - 25 * s, shY + 8 * s]], rgba(Y));
  ctx.fillStyle = rgba(bg); rrect(x - 21 * s, shY + 4 * s, 42 * s, 47 * s, 9 * s); ctx.fill();                                  // the school bag
  ctx.fillStyle = rgba(mix(bg, [255, 255, 255], .2)); rrect(x - 21 * s, shY + 4 * s, 42 * s, 18 * s, 8 * s); ctx.fill();
  rectf(x - 4 * s, shY + 18 * s, 8 * s, 8 * s, rgba(mix(bg, [10, 10, 30], .5)));
  ctx.fillStyle = lg(hx - r * 1.2, 0, hx + r * 1.2, 0, [[0, YD], [.4, Y], [1, YL]]); ctx.beginPath(); ctx.ellipse(hx, hy - 2 * s, r * 1.2, r * 1.26, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(YD, .5); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(hx, hy - r * 1.24); ctx.quadraticCurveTo(hx + (o.turn || 0) * 3 * s, hy, hx, hy + r * .9); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.yellowL, .9); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(hx, hy - 2 * s, r * 1.14, -Math.PI * .42, Math.PI * .1); ctx.stroke();
  return { hipY, shY, feetY: Math.max(K.feet[0][1], K.feet[1][1]) };
}

// ---------- SCHOOLAM: a bright morning, weeks later. He walks her up the steps, side by side, not hand in hand ----------
shot('schoolam', (t, p, L, len) => {
  const u = L / len, C = schCoats;
  fill([150, 200, 240], [224, 238, 246]);
  kcam(L, len, [[0, .86, 960, 566], [1, .99, 975, 476]], { hand: .3, t });
  schSet(t, { tod: 'morning', door: 1, hall: .5, lit: 'none', fg: 'branchL' }, T => {
    // other children arrive
    const ka = lerp(590, 760, u), P1 = lily({ at: [ka, 572], s: 1.3, dir: 1, pose: 'walk', ph: L * 11 });
    schKid(P1, { coat: C.violet, bag: [70, 60, 110], hat: C.tealB, rim: T.lightC, ra: .8, lx: 1 });
    const kb = inv(-.1, .95, u), P2 = lily({ at: [lerp(1560, 1210, kb), schYf(6.2 * kb)], s: 1.4, dir: -1, pose: 'run', ph: L * 15, lean: .2, swing: Math.sin(L * 15) * .8 });
    schKid(P2, { coat: C.teal, bag: [40, 60, 90], rim: T.lightC, ra: .8, lx: 1 });
    const P3 = lily({ at: [lerp(120, 330, u), 1052], s: 1.5, dir: 1, pose: 'walk', ph: L * 11 + 2 });
    schKid(P3, { coat: C.blue, bag: [60, 80, 60], hat: C.violetB, rim: T.lightC, ra: .8, lx: 1 });
    const M3 = schMan({ hip: [20, 1056 - 194], feet: [[26, 1056], [6, 1056]], dir: 1, lean: .02, hr: [[40 + Math.sin(L * 12) * 12, -70], [-6, 150]], s: 1 });
    schAdult(M3, { coat: C.blue, rim: T.lightC, ra: .7, lx: 1, bun: 1, scarf: [150, 110, 150] });
    // the two of them, from behind
    const c = lerp(1.15, 4.0, u), xm = 880, xl = 1066, glance = pulse(u, .34, .78, .12, .14), peek = pulse(u, .56, .92, .1, .08);
    const M = schManBack(xm, c, { turn: .9 * glance, lift: .7 * pulse(u, .4, .64, .1, .12) });
    oval(xm - 40, M.hip[1] + 196, 90, 12, rgba([40, 30, 70], .22)); 
    drawMan(M, 'calm', { face: false, rim: T.lightC, a: .75, lx: 1, ly: -.6, back: false });
    const lb = schClimb(c + .5, xl, 54 * schG.ls, 9 * schG.ls); oval(xl - 20, Math.max(lb.feet[0][1], lb.feet[1][1]) + 4, 60, 9, rgba([40, 30, 70], .2));
    schLilyBack(xl, c + .5, { turn: -peek });
  });
  motes(t, [0, 0, 1920, 1080], 16, [255, 250, 230], .3, 5);
  stamp(L, '8:00 AM', 'DAY 45');
}, { bloom: .22, grain: .45 }, [560, 140, 1380, 1000]);

// his closed umbrella tucked under his near arm: from his hand up and back past his armpit
function schTucked(M) {
  const h = M.j.handN, u = [-.985 * M.d, .17];
  return [[h[0] - u[0] * 44, h[1] - u[1] * 44], [h[0] + u[0] * 236, h[1] + u[1] * 236]];
}
// drifting leaves in the low sun (never yellow: rust and olive)
function schLeaves(t, n = 9) {
  for (let i = 0; i < n; i++) { const k = (t * (.05 + rnd(i * 2.1) * .04) + rnd(i * 5.3)) % 1, x = rnd(i * 3.7) * 2200 - 100 + Math.sin(t * .8 + i) * 60 + k * 240, y = -80 + k * 1250;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * (1 + rnd(i)) + i); ctx.scale(1, .5 + .5 * Math.sin(t * 2 + i)); ctx.fillStyle = rgba(i % 2 ? [214, 112, 60] : [150, 132, 70], .9); ctx.beginPath(); ctx.ellipse(0, 0, 13, 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
// ---------- GOLDWAIT: golden hour. He is early: he looks at his watch, then up at the doors, her umbrella under his arm ----------
shot('goldwait', (t, p, L, len) => {
  const u = L / len, g = schY(0);
  fill([255, 204, 156], [240, 170, 130]);
  kcam(L, len, [[0, 1.08, 930, 650], [1, 1.15, 950, 630]], { hand: .25, t });
  schSet(t, { tod: 'gold', door: 0, hall: .3, lit: 'none', fg: 'branchL' }, T => {
    const st = schMStand(742, g, 1, { hr: [[36, 104], [-6, 150]] });
    const watch = schMix(st, { hr: [[36, 104], [62, 66]], neck: .46, lean: .03 }, 1), look = schMix(st, { neck: -.34, lean: -.035, hip: [747, g - 197] }, 1);
    const O = schKeys(u, [[0, watch], [.4, watch], [.58, st], [.8, look], [1, look]]);
    O.hip = [O.hip[0] + Math.sin(L * 1.1) * 2, O.hip[1] + Math.sin(L * 2) * 1.3];
    const M = schMan(O), up = seg(u, .58, .8);
    schShadow(M, g + 6);
    const ex = schBlink(schEx('calm', 'smile', .2 + .4 * seg(u, .78, 1), { gx: lerp(.5, .8, up), gy: lerp(.85, -.7, up) }), u, .5, .07);
    drawMan(M, ex, { rim: schRimG, a: .9, lx: -1, ly: -.35, back: false, light: [255, 214, 160], la: .34 });
    const [a, b] = schTucked(M); schBrollyShut(a, b, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(q => [q[0] - 4, q[1] - 2]), 5, rgba(schRimG, .5));
    const w = M.j.handF; disc(w[0] - 9, w[1] - 4, 7, rgba(PAL.brass)); additive(() => lite([255, 244, 220], w[0] - 9, w[1] - 5, 22, .8 * pulse(u, .08, .4, .06, .1) * (.6 + .4 * Math.sin(L * 9))));      // his watch
  });
  cam(1, 960, 540); schLeaves(t, 8); motes(t, [0, 0, 1920, 1080], 22, [255, 226, 180], .4, 5);
  additive(() => lite([255, 170, 100], -260, 300, 1200, .22));
  stamp(L, '5:25 PM', 'DAY 90');
}, { bloom: .26, grain: .45 }, [500, 120, 1300, 1000]);

// ---------- JUMP: the doors burst open; she runs down and jumps from the second step; he drops the umbrella, catches her and turns ----------
shot('jump', (t, p, L, len) => {
  const u = L / len, g = schY(0), s = schG.ls, X = 742, C = schCoats;
  fill([255, 204, 156], [240, 170, 130]);
  kcam(L, len, [[0, .98, 970, 596], [.45, 1.03, 930, 640], [1, 1.26, 800, 760]], { hand: .35, t });
  const door = seg(u, .01, .09, E.out) * (1 - .1 * Math.sin(inv(.09, .26, u) * Math.PI));
  schSet(t, { tod: 'gold', door, hall: .5, lit: 'none', fg: 'branchL' }, T => {
    { const k = (u - .5) / .7; if (k > 0) schKid(lily({ at: [990 + 520 * k, schYf(6 - 4 * inv(.3, 1, k))], s: 1.22, dir: 1, pose: 'walk', ph: k * 14 }), { coat: C.teal, hat: C.blueB, bag: mix(C.teal, [10, 10, 30], .45), rim: T.lightC, ra: .8, lx: -1 }); }   // another child comes out behind her
    // him: he sees her, lets the umbrella go, opens his arms, takes her weight, turns half a circle with her
    const wait = schMStand(X, g, 1, { hr: [[36, 104], [-6, 150]], neck: -.34, lean: -.035 });
    const ready = schMix(wait, { hip: [X + 10, g - 174], feet: [[X + 48, g], [X - 30, g]], lean: .16, neck: -.24, hr: [[108, 30], [116, -4]] }, 1);
    const caught = schMix(wait, { hip: [X - 10, g - 152], feet: [[X + 38, g], [X - 58, g]], lean: -.14, neck: -.16, hr: [[84, 86], [92, 60]] }, 1);
    const hold = schMix(wait, { hip: [X, g - 195], feet: [[X + 14, g], [X - 22, g]], lean: -.08, neck: -.12, hr: [[80, 94], [90, 62]] }, 1);
    const O = schKeys(u, [[0, wait], [.24, wait], [.46, ready, E.out], [.64, ready], [.72, caught, E.out], [.88, hold], [1, hold]]);
    const th = Math.PI * E.io(inv(.73, .97, u)), c = Math.cos(th), dm = c >= 0 ? 1 : -1, swing = Math.pow(Math.max(0, Math.sin(th)), .8), held = u >= .66;
    O.hip = [X + (O.hip[0] - X) * c, O.hip[1] + Math.sin(L * 2) * 1.2 - 8 * swing]; O.feet = O.feet.map((f, i) => [X + (f[0] - X) * c, f[1] - (i ? 1 : 0) * 10 * swing]); O.dir = dm;
    const S = [O.hip[0] + Math.sin(O.lean * dm) * 172, O.hip[1] - Math.cos(O.lean) * 172];
    // her: down the steps, a crouch on the second step, the leap, his arms; then she swings round him, her legs flying
    const y2 = schY(2), XT = 1000, H0 = [XT - 8, y2 - 57.6 * s + 12], q = inv(.5, .66, u), phi = .22 * c + .9 * swing;
    const LS = [O.hip[0] + 66 * c, S[1] + 34 - 12 * swing], H1 = [LS[0] + Math.sin(phi) * 62 * s, LS[1] + Math.cos(phi) * 62 * s];
    if (held) O.hr = [[(LS[0] + 30 * c - S[0]) * dm, LS[1] + 62 - S[1]], [(LS[0] + 40 * c - S[0]) * dm, LS[1] + 34 - S[1]]];
    const M = schMan(O);
    schShadow(M, g + 6, 1.3, .26);
    // the umbrella: under his arm, then falling to the pavement behind him
    const [ua, ub] = schTucked(schMan(wait)), fall = inv(.28, .44, u), mid = v2.lerp(ua, ub, .5), a0 = Math.atan2(ub[1] - ua[1], ub[0] - ua[0]);
    const bnc = u > .44 ? Math.abs(Math.sin((u - .44) * 30)) * 20 * Math.exp(-(u - .44) * 16) : 0;
    const uc = [mid[0] - 70 * E.out(fall), lerp(mid[1], g + 18, fall * fall) - bnc], uang = lerp(a0, Math.PI + .06, E.io(fall)), hl = 140;
    const brolly = () => schBrollyShut([uc[0] - Math.cos(uang) * hl, uc[1] - Math.sin(uang) * hl], [uc[0] + Math.cos(uang) * hl, uc[1] + Math.sin(uang) * hl], 1);
    if (fall > 0) { oval(uc[0], g + 26, 150, 9, rgba([110, 50, 90], .2 * fall)); brolly(); }
    let P, ld = -1;
    if (u < .4) { const k = inv(.06, .4, u), kk = 6 - 4 * k; P = lily({ at: [lerp(1010, XT, k), schYf(kk)], s, dir: -1, pose: k < .02 ? 'stand' : 'run', ph: k * 30, lean: .2 * Math.min(1, k * 8), swing: Math.sin(k * 30) * .9 }); }
    else if (u < .5) { const k = E.out(inv(.4, .47, u)), up = seg(u, .47, .5); P = schLily({ hip: [XT - 8 * up, y2 - 57.6 * s + 24 * k - 12 * up], feet: [[XT - 7 * s, y2], [XT + 9 * s, y2]], lean: .2 + .28 * k, neck: -.3 * k, dir: -1, s, hr: [[lerp(5, -26, k), lerp(62, 48, k)], [lerp(4, -32, k), lerp(61, 42, k)]] }); }
    else if (!held) { const hp = [lerp(H0[0], H1[0], q), lerp(H0[1], H1[1], q) - 104 * Math.sin(Math.PI * q) * (1 - .2 * q)], tk = Math.sin(Math.PI * q);
      P = schLily({ hip: hp, feet: [[hp[0] + 36 + 22 * tk, hp[1] + 66 - 34 * tk], [hp[0] + 60, hp[1] + 42 - 18 * tk]], lean: lerp(.6, .22, q), neck: -.3, dir: -1, s, hr: [[46, 10], [42, 2]] }); }
    else { ld = -dm; P = schLily({ hip: H1, feet: [[H1[0] + Math.sin(phi + .22) * 84, H1[1] + Math.cos(phi + .22) * 84], [H1[0] + Math.sin(phi - .16) * 88, H1[1] + Math.cos(phi - .16) * 88]], lean: phi * dm, neck: -phi * dm * .55, dir: ld, s,
      hr: [[(O.hip[0] - 30 * c - LS[0]) * ld / s, (S[1] + 32 - LS[1]) / s], [(O.hip[0] - 8 * c - LS[0]) * ld / s, (S[1] + 22 - LS[1]) / s]], nod: 2 }); }
    const smile = seg(u, .2, .38), fold = seg(u, .68, .9);
    const exM = schEx(schEx('calm', 'smile', smile, { brow: .25 + .4 * smile, browH: .06 + .1 * smile, open: .12 + .2 * smile * (1 - fold) }), { lid: 1, brow: .8, browH: .1, smile: .6, open: 0, grit: 0, gx: 0, gy: 0, tear: 0, sweat: 0 }, fold, held ? {} : { gx: .8, gy: -.6 });
    const exL = held ? schLex('happy', 'shut', seg(u, .66, .8)) : schLex('happy', 'happy', 0, { open: .5, gx: .8, gy: .3 });
    if (u < .5) schShadow(schLilyParts(P), Math.max(P.legs[0][2][1], P.legs[1][2][1]) + 3, 1.3, .2);
    const nar = .74 + .26 * Math.abs(c);                                   // he narrows a little as he comes round
    ctx.save(); ctx.translate(O.hip[0], 0); ctx.scale(nar, 1); ctx.translate(-O.hip[0], 0);
    drawMan(M, exM, { rim: schRimG, a: .9, lx: -1, ly: -.35, back: false, light: [255, 214, 160], la: .34 });
    if (fall <= 0) { brolly(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(v => [v[0] - 4, v[1] - 2]), 5, rgba(schRimG, .5)); }
    ctx.restore();
    const backv = held && Math.abs(c) < .45;
    schDrawLily(P, exL, { a: 1, turn: .8, rim: schRimG, glow: .5, face: !backv });
    if (backv) { const [qx, qy, qr] = P.head; disc(qx, qy, qr * 1.04, rgba(PAL.yellow)); ctx.strokeStyle = rgba(PAL.yellowD, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(qx, qy - qr * 1.2); ctx.lineTo(qx, qy + qr); ctx.stroke(); }   // her hood, from behind, as she comes round
    if (held) { ctx.save(); ctx.translate(O.hip[0], 0); ctx.scale(nar, 1); ctx.translate(-O.hip[0], 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';     // his arm round her
      stroke(M.parts[4][0], 22, rgba(PAL.ink)); stroke(M.parts[4][0].map(v => [v[0] - 4, v[1] - 2]), 5, rgba(schRimG, .5)); ctx.restore(); }
  });
  cam(1, 960, 540); schLeaves(t, 8); motes(t, [0, 0, 1920, 1080], 22, [255, 226, 180], .4, 5);
  additive(() => lite([255, 170, 100], -260, 300, 1200, .22));
}, { bloom: .26, grain: .45 }, (t, p, L, len) => { const u = L / len; return [lerp(620, 380, clamp(u * 1.5)), 120, lerp(1300, 1160, clamp(u * 1.5)), 1000]; });

// ---------- HUG: the close-up the film has waited for. Her face over his shoulder, eyes shut; his folds, then smiles; one tear ----------
shot('hug', (t, p, L, len) => {
  const u = L / len;
  fill([250, 170, 120], [214, 120, 96]);
  kcam(L, len, [[0, 1.5, 820, 300], [1, 1.56, 850, 290]], { hand: .2, t });
  schSet(t, { tod: 'gold', door: .7, hall: .5, lit: 'none' });
  schSoft(22);
  const fr = kcam(L, len, [[0, 1, 960, 548], [1, 1.11, 985, 540]], { hand: .22, t });
  screen(); rectf(-2400, -2400, 6800, 6000, lg(0, 0, 1920, 0, [[0, [150, 50, 50], 0], [1, [120, 40, 60], .3]]));
  kcam(L, len, [[0, 1, 960, 548], [1, 1.11, 985, 540]], { hand: .22, t });
  additive(() => { lite([255, 170, 100], -160, 120, 1500, .34); lite([255, 210, 160], 160, 40, 560, .3); });
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-260 + i * 190, -300); ctx.rotate(-.78 - i * .05); cone(0, 0, 30, 120 + i * 30, 2300, [255, 206, 140], .07 + .03 * Math.sin(t * .7 + i * 2)); ctx.restore(); }
  bokeh(8, 9, [900, 60, 1960, 700], [[255, 214, 160], [255, 180, 130], [255, 236, 200]], 40, 100, .22, t);
  const br = Math.sin(L * 1.9) * 5, sq = seg(u, .1, .32), sm = seg(u, .48, .8);
  const hx = 772 + 10 * sq, hy = 470 + br * .6, r = 204, lx = 1180 - 16 * sq, ly = 566 + br, lr = 178, tiltM = .1 + .03 * sq, tiltL = -.17 - .04 * sq + Math.sin(L * 1.2) * .012;
  // his hand behind her hood, then him, then her
  const gold = [255, 198, 120];
  rectf(hx - r * 1.84, hy + r * 2.4, r * 3.44, 2400, rgba([22, 13, 16]));                           // (a Short's taller window sees further down)
  manBust(hx, hy, r, schEx({ lid: .66, brow: .9, browH: .1, smile: -.6, open: 0, grit: 0, gx: .3, gy: .6, tear: 0, sweat: 0 }, schEx({ lid: 1, brow: 1, browH: .13, smile: -.72 + .06 * Math.sin(L * 20), open: 0, grit: 0, gx: 0, gy: .4, tear: 0, sweat: 0 }, { lid: 1, brow: .5, browH: .09, smile: .78, open: 0, grit: 0, gx: 0, gy: .2, tear: 0, sweat: 0 }, sm), seg(u, .06, .3)),
    { fill: [22, 13, 16], rim: gold, ra: .95, lc: [-.8, -.5], light: [255, 206, 150], la: .42, turn: .72, tilt: tiltM });
  // the tear: from his eye down his cheek
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tiltM); ctx.translate(-hx, -hy);
  const tk = seg(u, .34, .86, E.io), ex0 = hx + r * lerp(-.37, .25, .72) + r * .02, ey0 = hy - .05 * r + r * .09, tx = ex0 - r * .05 * Math.sin(tk * 2.2) + r * .02 * tk, ty = ey0 + r * .5 * tk;
  if (u > .3) { const a = seg(u, .3, .4);
    ctx.strokeStyle = rgba([255, 236, 210], .3 * a); ctx.lineWidth = r * .012; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx, ty - r * .09 * Math.min(1, tk * 4)); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = rgba([255, 244, 226], .95 * a); ctx.beginPath(); ctx.ellipse(tx, ty, r * .03, r * .042, 0, 0, TAU); ctx.fill();
    additive(() => { lite([255, 214, 150], tx, ty, r * .12, .7 * a); lite([255, 255, 255], tx - r * .008, ty - r * .012, r * .022, .9 * a); }); }
  ctx.strokeStyle = rgba([255, 214, 150], .95); ctx.lineWidth = r * .04; ctx.lineCap = 'round'; ctx.shadowColor = rgba(gold, .9); ctx.shadowBlur = 26 * VP.k;      // the sun on the edge of his head
  ctx.beginPath(); ctx.arc(hx, hy, r + r * .012, Math.PI * .92, Math.PI * 1.56); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();
  additive(() => lite(gold, hx - r * .95, hy - r * .55, r * .9, .3));
  // her arm round his neck: a yellow sleeve across his chest to his far shoulder
  const Y = PAL.yellow, YD = PAL.yellowD, YL = mix(Y, PAL.yellowL, .55), s0 = [lx - lr * .62, ly + lr * 1.42], s1 = [hx + r * .1, hy + r * 1.32 + br * .3], s2 = [hx - r * .86, hy + r * 1.06];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const arm = (w, col, dy = 0) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(s0[0], s0[1] + dy); ctx.quadraticCurveTo(s1[0], s1[1] + dy, s2[0], s2[1] + dy); ctx.stroke(); };
  arm(lr * .62, rgba(YD)); arm(lr * .54, rgba(Y), -lr * .03); arm(lr * .12, rgba(YL, .8), -lr * .2);
  ctx.fillStyle = rgba([12, 10, 14]); ctx.beginPath(); ctx.ellipse(s2[0] - lr * .2, s2[1] - lr * .02, lr * .24, lr * .19, -.5, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(s2[0] - lr * (.34 + i * .02), s2[1] - lr * .16 + i * lr * .1, lr * .12, lr * .055, -.25 + i * .12, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = rgba(gold, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(s2[0] - lr * .2, s2[1] - lr * .02, lr * .25, Math.PI * 1.0, Math.PI * 1.55); ctx.stroke();
  // her
  additive(() => lite(PAL.yellow, lx, ly + lr, lr * 3.2, .22));
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(tiltL); ctx.translate(-lx, -ly); rectf(lx - lr * 2.1, ly + lr * 3.38, lr * 4.2, 2400, lg(lx - lr * 1.9, 0, lx + lr * 1.9, 0, [[0, mix(PAL.yellow, PAL.yellowL, .6)], [.5, PAL.yellow], [1, PAL.yellowD]])); ctx.restore();
  lilyBust(lx, ly, lr, schLex('shut', 'shut', 0, { smile: .42 + .4 * sm, brow: .42 - .1 * sm, browH: .08 }), { a: 1, rim: [255, 214, 160], turn: .22, dir: -1, tilt: tiltL, glow: .3 });
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(tiltL); ctx.translate(-lx, -ly);                // the sun on the top of her hood
  ctx.strokeStyle = rgba([255, 244, 214], .9); ctx.lineWidth = lr * .05; ctx.beginPath(); ctx.arc(lx, ly - lr * .06, lr * 1.29, Math.PI * 1.12, Math.PI * 1.62); ctx.stroke();
  additive(() => lite(gold, lx - lr * .7, ly - lr * 1.1, lr * 1.1, .45));
  ctx.restore();
  // his hand on her back, his arm round her
  const a0 = [2080, 1240], a1 = [lx + lr * 1.75, ly + lr * 2.5], a2 = [lx + lr * .5, ly + lr * 1.95 + br * .4];
  const fore = (w, col, dx = 0, dy = 0) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a0[0] + dx, a0[1] + dy); ctx.quadraticCurveTo(a1[0] + dx, a1[1] + dy, a2[0] + dx, a2[1] + dy); ctx.stroke(); };
  fore(r * .62, rgba(gold, .95), -4, -7); fore(r * .6, rgba([22, 13, 16]));
  ctx.fillStyle = rgba(gold, .95); ctx.beginPath(); ctx.ellipse(a2[0] - r * .1 - 3, a2[1] - 6, r * .42, r * .3, -.2, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba([22, 13, 16]); ctx.beginPath(); ctx.ellipse(a2[0] - r * .1, a2[1], r * .42, r * .3, -.2, 0, TAU); ctx.fill();
  for (let i = 0; i < 4; i++) { const fx = a2[0] - r * (.36 + i * .02), fy = a2[1] - r * .24 + i * r * .15; ctx.fillStyle = rgba(gold, .9); ctx.beginPath(); ctx.ellipse(fx - 2, fy - 4, r * .21, r * .078, -.12 + i * .09, 0, TAU); ctx.fill(); ctx.fillStyle = rgba([22, 13, 16]); ctx.beginPath(); ctx.ellipse(fx, fy, r * .21, r * .078, -.12 + i * .09, 0, TAU); ctx.fill(); }
  // light in the air
  additive(() => { lite([255, 180, 110], 80, 240, 900, .16); });
  motes(t, [0, 0, 1920, 1080], 46, [255, 232, 190], .6, 9);
  blurred(12, () => { ctx.fillStyle = rgba([92, 70, 44], .9); ctx.beginPath(); for (let i = 0; i < 10; i++) { const x = -60 + rnd(i * 2.3) * 520 + Math.sin(t * .8 + i) * 8, y = -50 + rnd(i * 4.1) * 170; ctx.moveTo(x + 70, y); ctx.ellipse(x, y, 70, 28, rnd(i * 3.3) * 3, 0, TAU); } ctx.fill(); });
}, { bloom: .34, grain: .45, wash: [[255, 170, 110], .1] }, [420, 130, 1500, 1000]);
