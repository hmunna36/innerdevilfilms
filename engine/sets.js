'use strict';
// The sets: his bedroom, the dawn road, the gym, the floor where the phone shatters. A film may add its own
// (films/NN/film.js) in the same style: filled shapes in lit mid-tones, a window or a lamp, lit edges on the furniture,
// so that his dark figure and the devil always stand against something lighter (the owner, 31 Oct 2026).

// a flat or vertical-gradient background over the whole frame (and past it, for a Short's taller window)
function fill(top, bottom) {
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgba(top)); g.addColorStop(1, rgba(bottom || top));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
}

// ---------- the bedroom ----------
// Filled and lit, never a wireframe on black (the owner, 31 Oct 2026: "black figure on black background is a bad
// idea"): a mid-tone wall with the window glowing in it, solid furniture with lit edges, moonlight on the floor, so his
// dark figure and the devil always stand against something lighter than they are. drawWindow(m, a) says what the window
// shows (m: 0 night … 1 grey morning); drawRoom(a, col) paints the room with it: a, how much light (.14 a night … .3 a
// morning), col, its colour.
const BED = { x0: 600, x1: 1250, y: 760 };
const SIT = { x: 860, y: 760, s: 1.1 };           // where he sits on the bed edge
let WIN = null;
function drawWindow(m, a) { WIN = a > .003 ? { m, a } : null; }
const tone = (col, k) => mix([7, 7, 10], col, clamp(k));
function paintWindow(L, col) {
  const { m } = WIN, x = 300, y = 220, w = 260, h = 290, night = 1 - m;
  additive(() => glow(m > .5 ? SPR.cream : SPR.blue, x + w / 2, y + h / 2, 520, (.1 + .1 * m) * Math.min(1.5, L)));   // its light on the wall
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, rgba(mix([34, 48, 96], [196, 200, 210], m))); sky.addColorStop(1, rgba(mix([70, 92, 150], [238, 228, 212], m)));
  ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = rgba(mix([14, 18, 34], [120, 124, 134], m));       // roofs across the street
  ctx.beginPath(); ctx.moveTo(x, y + h);
  for (const [u, v] of [[0, .78], [.18, .78], [.18, .66], [.34, .66], [.34, .82], [.52, .82], [.52, .6], [.62, .6], [.62, .74], [.8, .74], [.8, .7], [1, .7]]) ctx.lineTo(x + u * w, y + v * h);
  ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  if (night > .3) {
    additive(() => glow(SPR.cream, x + w * .72, y + h * .24, 90, .5 * night));
    ctx.fillStyle = rgba([240, 236, 222], .9 * night); ctx.beginPath(); ctx.arc(x + w * .72, y + h * .24, 17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([255, 214, 140], .7 * night);                 // two windows still lit across the street
    ctx.fillRect(x + w * .4, y + h * .7, 9, 11); ctx.fillRect(x + w * .86, y + h * .78, 9, 11);
  }
  ctx.fillStyle = rgba(mix([110, 130, 190], [210, 206, 196], m), (.07 + .05 * m) * Math.min(1.4, L));   // light on the floor
  ctx.beginPath(); ctx.moveTo(x - 10, 862); ctx.lineTo(x + w + 10, 862); ctx.lineTo(x + w + 420, H + 60); ctx.lineTo(x + 200, H + 60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(tone(col, .12 * L)); ctx.lineWidth = 16; ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);   // the frame
  ctx.lineWidth = 8; line(x + w / 2, y, x + w / 2, y + h); line(x, y + h / 2, x + w, y + h / 2);
  ctx.strokeStyle = rgba(mix([150, 170, 220], [255, 250, 240], m), .35); ctx.lineWidth = 2;      // the lit inner edge
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  ctx.fillStyle = rgba(tone(col, .3 * L)); ctx.fillRect(x - 20, y + h + 4, w + 40, 12);           // the sill
}
// the bed's outline: the devil standing behind the bed is cut by it, so the bed stands in front of its legs
function bedSilhouette() {
  const p = new Path2D();
  p.roundRect(BED.x0 - 30, BED.y - 166, 34, 250, 12);
  p.rect(BED.x0, BED.y - 6, BED.x1 - BED.x0, 96);
  p.rect(BED.x0 + 10, BED.y + 88, 16, 12); p.rect(BED.x1 - 26, BED.y + 88, 16, 12);
  p.moveTo(BED.x0 + 120, BED.y + 44); p.lineTo(BED.x0 + 120, BED.y - 4);
  p.bezierCurveTo(BED.x0 + 260, BED.y - 26, BED.x0 + 360, BED.y + 2, BED.x0 + 470, BED.y - 14);
  p.bezierCurveTo(BED.x0 + 560, BED.y - 26, BED.x1 - 40, BED.y - 10, BED.x1, BED.y - 8); p.lineTo(BED.x1, BED.y + 44); p.closePath();
  p.roundRect(BED.x0 + 6, BED.y - 46, 108, 46, 20);
  return p;
}
function drawRoom(a, col) {
  if (a <= .003) { WIN = null; return; }
  ROOM_FRAME = FRAME_NO;
  const L = a / .14, T = k => rgba(tone(col, k * L));
  const wg = ctx.createLinearGradient(0, 0, 0, 860);                 // the wall, a little lighter toward the floor
  wg.addColorStop(0, T(.17)); wg.addColorStop(1, T(.28));
  ctx.fillStyle = wg; ctx.fillRect(-W, -H, 3 * W, H + 860);
  const fg = ctx.createLinearGradient(0, 860, 0, 1240);              // the floor
  fg.addColorStop(0, T(.2)); fg.addColorStop(1, T(.08));
  ctx.fillStyle = fg; ctx.fillRect(-W, 860, 3 * W, 2 * H);
  ctx.fillStyle = T(.36); ctx.fillRect(-W, 846, 3 * W, 14);         // the skirting board
  if (WIN) paintWindow(L, col);
  // the desk and its book
  ctx.fillStyle = T(.12); ctx.fillRect(122, 656, 16, 204); ctx.fillRect(422, 656, 16, 204);
  ctx.fillStyle = T(.42); ctx.fillRect(104, 640, 352, 16); ctx.fillStyle = T(.58); ctx.fillRect(104, 640, 352, 3);
  ctx.fillStyle = T(.5); ctx.fillRect(240, 624, 96, 16); ctx.fillStyle = T(.7); ctx.fillRect(240, 624, 96, 3);
  // the door
  ctx.fillStyle = T(.34); ctx.fillRect(1576, 318, 208, 542);
  ctx.fillStyle = T(.2); ctx.fillRect(1592, 334, 176, 526);
  ctx.strokeStyle = T(.3); ctx.lineWidth = 3; ctx.strokeRect(1618, 368, 124, 190); ctx.strokeRect(1618, 600, 124, 220);
  ctx.fillStyle = T(.8); ctx.beginPath(); ctx.arc(1614, 610, 8, 0, Math.PI * 2); ctx.fill();
  // the gym bag
  ctx.fillStyle = T(.24); rrect(1462, 806, 104, 54, 16); ctx.fill();
  ctx.strokeStyle = T(.4); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1488, 808); ctx.quadraticCurveTo(1514, 772, 1540, 808); ctx.stroke();
  // the bed: headboard, base, mattress, a rumpled blanket, the pillow
  ctx.fillStyle = T(.22); rrect(BED.x0 - 30, BED.y - 166, 34, 250, 12); ctx.fill();
  ctx.fillStyle = T(.38); ctx.fillRect(BED.x0 - 4, BED.y - 160, 4, 236);
  ctx.fillStyle = T(.14); ctx.fillRect(BED.x0, BED.y + 40, BED.x1 - BED.x0, 50);
  ctx.fillStyle = T(.1); ctx.fillRect(BED.x0 + 10, BED.y + 88, 16, 12); ctx.fillRect(BED.x1 - 26, BED.y + 88, 16, 12);
  ctx.fillStyle = T(.3); ctx.fillRect(BED.x0, BED.y - 6, BED.x1 - BED.x0, 48);
  ctx.fillStyle = T(.44); ctx.beginPath(); ctx.moveTo(BED.x0 + 120, BED.y + 44);
  ctx.lineTo(BED.x0 + 120, BED.y - 4); ctx.bezierCurveTo(BED.x0 + 260, BED.y - 26, BED.x0 + 360, BED.y + 2, BED.x0 + 470, BED.y - 14);
  ctx.bezierCurveTo(BED.x0 + 560, BED.y - 26, BED.x1 - 40, BED.y - 10, BED.x1, BED.y - 8); ctx.lineTo(BED.x1, BED.y + 44); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = T(.62); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(BED.x0 + 120, BED.y - 4);
  ctx.bezierCurveTo(BED.x0 + 260, BED.y - 26, BED.x0 + 360, BED.y + 2, BED.x0 + 470, BED.y - 14);
  ctx.bezierCurveTo(BED.x0 + 560, BED.y - 26, BED.x1 - 40, BED.y - 10, BED.x1, BED.y - 8); ctx.stroke();
  ctx.fillStyle = T(.56); rrect(BED.x0 + 6, BED.y - 46, 108, 46, 20); ctx.fill();
  ctx.fillStyle = T(.72); rrect(BED.x0 + 14, BED.y - 46, 92, 8, 4); ctx.fill();
  WIN = null;
  if (FILM.roomProps) FILM.roomProps(a, col);                            // what this film adds to his room
}
// the phone bursts off the wall at t0, the pieces fall and stay on the floor
function shards(t, t0, x0, y0) {
  const d = t - t0;
  if (d < 0) return;
  ctx.fillStyle = '#15151b'; ctx.strokeStyle = 'rgba(200,215,255,.6)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    const ang = Math.PI * (.6 + rnd(i + 4000) * .8), v = 300 + rnd(i + 4001) * 500;
    const vx = Math.cos(ang) * v, vy = Math.sin(ang) * v * .6;
    const land = (-vy + Math.sqrt(vy * vy + 1800 * (856 - y0))) / 900, dd = Math.min(d, land);
    ctx.save(); ctx.translate(x0 + vx * dd, Math.min(856, y0 + vy * dd + 450 * dd * dd)); ctx.rotate(dd * (4 + rnd(i) * 8) * (i % 2 ? 1 : -1));
    ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(12, -2); ctx.lineTo(-4, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  if (d < .8) additive(() => {
    glow(SPR.cream, x0, y0, 320, .9 * Math.exp(-d * 8));
    for (let i = 0; i < 20; i++) glow(SPR.amber, x0 - rnd(i + 4100) * 300 * d * 3, y0 + (rnd(i + 4101) - .5) * 260 * d * 3, 6, 1 - d / .8);
  });
}

// ---------- the dawn road: hills, the path, embers, him walking or running ----------
const GROUND = 820;
function hills(d, p) {
  [[.08, 640, 70, [26, 24, 48], [120, 72, 84]], [.22, 706, 50, [15, 13, 28], [66, 38, 50]]].forEach(([par, base, amp, c0, c1], j) => {
    ctx.fillStyle = rgba(mix(c0, c1, p));
    ctx.beginPath(); ctx.moveTo(-600, H + 400);
    for (let x = -600; x <= W + 600; x += 24) {
      const u = (x + d * par) * .004 + j * 10;
      ctx.lineTo(x, base - amp * (Math.sin(u) * .6 + Math.sin(u * 2.3 + 1) * .3 + Math.sin(u * 5.1) * .1));
    }
    ctx.lineTo(W + 600, H + 400); ctx.closePath(); ctx.fill();
  });
}
function embers(t, d, p) {
  additive(() => {
    const n = Math.floor(30 + 90 * p), span = W + 200;
    for (let i = 0; i < n; i++) {
      const life = 3 + rnd(i + 900) * 4, age = (t + rnd(i + 901) * life) % life, k = age / life;
      const x = (((rnd(i + 902) * span - d * .35 - age * 40) % span) + span) % span - 100;
      glow(SPR.gold, x, GROUND + 30 - k * (500 + rnd(i + 903) * 300), 5 + rnd(i + 904) * 9, Math.sin(Math.PI * k) * (.25 + .5 * p));
    }
  });
}
function roadWorld(t, fr, p, d, ph, run) {   // p: light 0 … 1, d: distance run, ph: stride phase
  cam(...fr);
  hills(d, p);
  ctx.fillStyle = rgba(mix([8, 8, 14], [34, 20, 24], p)); ctx.fillRect(-600, GROUND, W + 1200, H);
  const lg = ctx.createLinearGradient(0, 0, W, 0);
  lg.addColorStop(0, rgba(C.amber, 0)); lg.addColorStop(.55, rgba(C.amber, .2 + .4 * p)); lg.addColorStop(1, rgba(C.gold, .45 + .45 * p));
  ctx.strokeStyle = lg; ctx.lineWidth = 3; line(-600, GROUND, W + 600, GROUND);
  ctx.fillStyle = rgba(C.cream, .16);
  for (let i = 0; i < 40; i++) {
    const span = W * 1.5, x = (((rnd(i + 1000) * span - d) % span) + span) % span - W * .25;
    ctx.fillRect(x, GROUND + 14 + rnd(i + 1100) * 120, 3 + rnd(i) * 26, 2);
  }
  embers(t, d, p);
  const PW = poseWalk(760, GROUND, 1.05, ph, run);
  drawPerson(PW, [8, 7, 10], C.gold, .35 + .45 * p, 1, -.3);
  face(PW.head[0], PW.head[1], PW.head[2], exprAt(t), { turn: 1, light: C.gold, la: .3 + .2 * p, lc: [.8, -.1] });
  return PW;
}

// ---------- the gym ----------
function gymBg(fr) {
  fill([46, 42, 44], [84, 72, 62]);                    // a lit gym: the dark figure works out against light
  cam(...fr);
  ctx.fillStyle = 'rgba(255,240,220,.07)'; ctx.fillRect(-600, 260, W + 1200, 380);          // the mirror wall
  ctx.fillStyle = 'rgba(255,240,220,.12)'; ctx.fillRect(-600, 256, W + 1200, 4); ctx.fillRect(-600, 640, W + 1200, 4);
  ctx.fillStyle = '#2a2726'; ctx.fillRect(-600, 860, W + 1200, 400);
  ctx.strokeStyle = rgba([230, 220, 210], .25); ctx.lineWidth = 3; line(-600, 860, W + 600, 860);
  additive(() => { for (let i = 0; i < 5; i++) glow(SPR.amber, 200 + i * 380, 110, 340, .34); glow(SPR.amber, 960, 560, 900, .16); });
  ctx.fillStyle = rgba([255, 232, 196], .85); for (let i = 0; i < 5; i++) { rrect(150 + i * 380, 96, 100, 10, 5); ctx.fill(); }
  ctx.fillStyle = '#17161a'; ctx.fillRect(1560, 520, 24, 340); ctx.fillRect(1740, 520, 24, 340);   // a plate rack
  for (const [px, py, r] of [[1572, 600, 56], [1572, 742, 66], [1752, 620, 48], [1752, 760, 70]]) {
    ctx.fillStyle = '#141317'; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba([230, 214, 196], .35); ctx.lineWidth = 3; ctx.stroke();
  }
}
function plate(x, y, r) {
  ctx.fillStyle = '#0c0c0f'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba([255, 210, 150], .45); ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = rgba([255, 210, 150], .35); ctx.beginPath(); ctx.arc(x, y, r * .18, 0, Math.PI * 2); ctx.fill();
}
// a world box under a framing [z, cx, cy] -> the screen box it covers (for a Short's framing)
function toScreenBox(fr, b) {
  const [z, cx, cy] = fr, f = (x, y) => [(x - cx) * z + W / 2, (y - cy) * z + H / 2];
  const [x0, y0] = f(b[0], b[1]), [x1, y1] = f(b[2], b[3]);
  return [x0, y0, x1, y1];
}
const unionBox = (a, b) => !a ? b : !b ? a : [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
