'use strict';
// The sets: his bedroom in thin lines, the dawn road, the gym, the floor where the phone shatters. A film may add its
// own (films/NN/film.js) in the same style: dark, a few thin lines, one practical light, glows instead of detail.

// a flat or vertical-gradient background over the whole frame (and past it, for a Short's taller window)
function fill(top, bottom) {
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgba(top)); g.addColorStop(1, rgba(bottom || top));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
}

// ---------- the bedroom ----------
const BED = { x0: 600, x1: 1250, y: 760 };
const SIT = { x: 860, y: 760, s: 1.1 };           // where he sits on the bed edge
function drawWindow(m, a) {          // m: 0 night … 1 grey morning
  if (a <= .003) return;
  const x = 300, y = 220, w = 260, h = 290, v = Math.min(1, a * 4);
  ctx.fillStyle = rgba(mix([26, 34, 64], [176, 182, 192], m), (.12 + .4 * m) * v);
  ctx.fillRect(x, y, w, h);
  if (m > .01) {
    ctx.fillStyle = rgba([196, 200, 210], .06 * m * v);
    ctx.beginPath(); ctx.moveTo(x, 860); ctx.lineTo(x + w, 860); ctx.lineTo(x + w + 380, H); ctx.lineTo(x + 220, H); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = rgba(C.cream, Math.min(1, a * 1.6)); ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h); line(x + w / 2, y, x + w / 2, y + h); line(x, y + h / 2, x + w, y + h / 2);
}
function drawRoom(a, col) {
  if (a <= .003) return;
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  line(0, 860, W, 860);                                                  // floor
  ctx.strokeRect(BED.x0, BED.y, BED.x1 - BED.x0, 64);                    // mattress
  line(BED.x0 + 14, BED.y + 64, BED.x0 + 14, 860); line(BED.x1 - 14, BED.y + 64, BED.x1 - 14, 860);
  rrect(BED.x0 - 26, BED.y - 160, 26, 224, 10); ctx.stroke();            // headboard
  ctx.strokeRect(1590, 330, 180, 530);                                   // door
  ctx.beginPath(); ctx.arc(1612, 610, 7, 0, Math.PI * 2); ctx.stroke();
  rrect(1462, 806, 104, 54, 16); ctx.stroke();                           // gym bag
  ctx.beginPath(); ctx.moveTo(1488, 806); ctx.quadraticCurveTo(1514, 770, 1540, 806); ctx.stroke();
  line(110, 650, 450, 650); line(130, 650, 130, 860); line(430, 650, 430, 860);   // desk
  ctx.strokeRect(240, 632, 96, 18);                                      // the book
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
  fill([18, 18, 22], [32, 28, 30]);
  cam(...fr);
  ctx.fillStyle = 'rgba(255,255,255,.03)'; ctx.fillRect(-600, 260, W + 1200, 380);          // the mirror wall
  ctx.fillStyle = '#121214'; ctx.fillRect(-600, 860, W + 1200, 400);
  ctx.strokeStyle = rgba([200, 200, 210], .14); ctx.lineWidth = 2; line(-600, 860, W + 600, 860);
  additive(() => { for (let i = 0; i < 5; i++) glow(SPR.amber, 200 + i * 380, 110, 280, .28); });
  ctx.fillStyle = rgba([255, 232, 196], .85); for (let i = 0; i < 5; i++) { rrect(150 + i * 380, 96, 100, 10, 5); ctx.fill(); }
  ctx.fillStyle = '#0b0b0d'; ctx.fillRect(1560, 520, 24, 340); ctx.fillRect(1740, 520, 24, 340);   // a plate rack
  for (const [px, py, r] of [[1572, 600, 56], [1572, 742, 66], [1752, 620, 48], [1752, 760, 70]]) {
    ctx.fillStyle = '#0e0e11'; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba([210, 200, 190], .2); ctx.lineWidth = 3; ctx.stroke();
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
