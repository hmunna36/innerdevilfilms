// ===== RAGE, part B: the sets. The kitchen (the main set), the hallway, Sam's room =====
// Filled and lit like the engine's bedroom (SKILL.md rule 15): mid-tone ember walls under a lamp, solid furniture with
// lit edges, a cool window; his dark figure and the devil always stand against something lighter.

const FY = 880, CY = 66;                       // the kitchen's floor and ceiling lines (world px)
const LAMP = [1150, 300];                      // the pendant lamp's bulb, over the table
const HOLE = [1492, 500];                      // where his fist goes through the wall
// the night's moments (film time): the pot, the juice, the shout, the punch, the drawing drops, the blows on Sam's door,
// the frame splits and the mirror cracks; after the turn: the juice again, the wall patched, the drawing taped back
const T_POT = 11.8, T_SPILL = 19.7, T_SHOUT = 20.8, T_PUNCH = 29.7, T_DROP = 29.85, T_BLOW = 38.9, T_CRACK = 39.0, BLOWS = [T_BLOW];
const TURN = 63.4, T_SPILL2 = 88.9, T_PATCH = 96.3, T_TAPE = 99.7;
const HALL_HOLE = [1196, 520];                    // the one blow: the wall between Sam's door and the hall mirror

// the lamp's swing after the shout (radians)
const lampSwing = t => (t > T_SHOUT && t < TURN) ? .2 * Math.sin((t - T_SHOUT) * 5.2) * Math.exp(-(t - T_SHOUT) * .45) : t > T_PUNCH && t < 40 ? .1 * Math.sin((t - T_PUNCH) * 5.6) * Math.exp(-(t - T_PUNCH) * .6) : 0;
function lampPos(t) { const a = lampSwing(t), L = LAMP[1] - CY; return [LAMP[0] + Math.sin(a) * L, CY + Math.cos(a) * L]; }

// q: { heat, calm (the evening after the turn), dark (0 … 1 more black), flick }
function kitchenSet(t, q) {
  const k = q.heat, calm = !!q.calm, fl = q.flick ? .78 + .22 * Math.abs(Math.sin(t * 29) * Math.sin(t * 6.1)) : 1;
  const [lx, ly] = lampPos(t), hi = roomCol(k, 1, calm), lo = roomCol(k, 0, calm), lampC = calm ? [255, 214, 160] : mix(EMBER.lamp, EMBER.lampHot, k);
  const L = (1 - .35 * (q.dark || 0)) * fl;
  // the wall, lit from the lamp
  const g = ctx.createRadialGradient(lx, ly + 120, 60, lx, ly + 120, 1500);
  g.addColorStop(0, rgba(shade(hi, L))); g.addColorStop(.55, rgba(shade(mix(hi, lo, .55), L))); g.addColorStop(1, rgba(shade(lo, L * .8)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  // the ceiling and its cornice
  ctx.fillStyle = rgba(shade(lo, .55 * L)); ctx.fillRect(-W, -H, 3 * W, H + CY);
  ctx.fillStyle = rgba(shade(hi, .8 * L)); ctx.fillRect(-W, CY, 3 * W, 6);
  // the floor: big tiles, lit under the lamp
  const fg = ctx.createLinearGradient(0, FY, 0, FY + 300);
  fg.addColorStop(0, rgba(shade(mix(lo, hi, .35), .75 * L))); fg.addColorStop(1, rgba(shade(lo, .35 * L)));
  ctx.fillStyle = fg; ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.strokeStyle = rgba(shade(lo, .25 * L), .8); ctx.lineWidth = 3;
  for (let i = -12; i < 30; i++) line(i * 120 - 400, FY, i * 180 - 1300, FY + 700);
  for (const yy of [FY + 46, FY + 120, FY + 230]) line(-W, yy, 2 * W, yy);
  additive(() => { ctx.save(); ctx.translate(lx, FY + 60); ctx.scale(1, .2); glow(sprOf(lampC), 0, 0, 760, .3 * L); ctx.restore(); });
  ctx.fillStyle = rgba(shade(hi, .7 * L)); ctx.fillRect(-W, FY - 14, 3 * W, 14);                 // the skirting board
  // the window: night outside, cool blue, a few lit windows across the street
  const wx = 620, wy = 200, ww = 280, wh = 290;
  const sky = ctx.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, rgba(calm ? [70, 70, 120] : [22, 30, 66])); sky.addColorStop(1, rgba(calm ? [190, 120, 110] : [52, 70, 124]));
  ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = rgba([12, 14, 30]); ctx.beginPath(); ctx.moveTo(wx, wy + wh);
  for (const [u, v] of [[0, .62], [.2, .62], [.2, .48], [.42, .48], [.42, .7], [.6, .7], [.6, .4], [.78, .4], [.78, .58], [1, .58]]) ctx.lineTo(wx + u * ww, wy + v * wh);
  ctx.lineTo(wx + ww, wy + wh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba([255, 206, 120], .85);
  for (const [u, v] of [[.08, .7], [.28, .56], [.33, .66], [.66, .5], [.7, .62], [.86, .66]]) ctx.fillRect(wx + u * ww, wy + v * wh, 10, 12);
  additive(() => glow(SPR.night, wx + ww / 2, wy + wh / 2, 420, .14 * L));
  ctx.strokeStyle = rgba(shade(hi, .95 * L)); ctx.lineWidth = 16; ctx.strokeRect(wx - 6, wy - 6, ww + 12, wh + 12);
  ctx.lineWidth = 8; line(wx + ww / 2, wy, wx + ww / 2, wy + wh);
  ctx.strokeStyle = rgba([170, 190, 240], .4); ctx.lineWidth = 2; ctx.strokeRect(wx + 4, wy + 4, ww - 8, wh - 8);
  // upper cabinets over the stove
  for (let i = 0; i < 3; i++) {
    const cx0 = 236 + i * 128;
    ctx.fillStyle = rgba(shade(mix(lo, hi, .62), .8 * L)); rrect(cx0, 110, 120, 220, 6); ctx.fill();
    ctx.strokeStyle = rgba(shade(hi, 1.05 * L), .6); ctx.lineWidth = 3; ctx.strokeRect(cx0 + 12, 124, 96, 192);
    ctx.fillStyle = rgba(shade(hi, 1.3 * L)); ctx.fillRect(cx0 + (i % 2 ? 16 : 96), 260, 8, 40);
  }
  ctx.fillStyle = rgba(shade(lo, .5 * L)); ctx.fillRect(226, 330, 400, 10);
  // the counter and its cabinets
  ctx.fillStyle = rgba(shade(mix(lo, hi, .5), .78 * L)); ctx.fillRect(-W, 618, W + 860, FY - 618);
  ctx.strokeStyle = rgba(shade(hi, .9 * L), .5); ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) { const cx0 = -60 + i * 132; if (cx0 > 200 && cx0 < 520) continue; ctx.strokeRect(cx0 + 10, 640, 112, 210); ctx.fillStyle = rgba(shade(hi, 1.3 * L)); ctx.fillRect(cx0 + 56, 656, 22, 7); }
  ctx.fillStyle = rgba(shade(hi, 1.15 * L)); ctx.fillRect(-W, 596, W + 872, 24);              // the counter top
  ctx.fillStyle = rgba(shade(hi, 1.6 * L), .7); ctx.fillRect(-W, 596, W + 872, 4);
  // the sink under the window, and its tap
  ctx.fillStyle = rgba(shade(lo, .35 * L)); rrect(650, 598, 230, 18, 8); ctx.fill();
  ctx.strokeStyle = rgba(shade([200, 200, 210], .9 * L)); ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(845, 596); ctx.lineTo(845, 520); ctx.quadraticCurveTo(845, 488, 810, 490); ctx.lineTo(798, 506); ctx.stroke();
  // the stove: its back panel with the clock, the burners, the oven door
  ctx.fillStyle = rgba([24, 18, 18]); rrect(250, 540, 270, 58, 8); ctx.fill();
  ctx.fillStyle = rgba(shade(hi, .5 * L)); ctx.fillRect(250, 596, 270, 24);
  ovenClockSmall(t, 385, 568, 26);
  ctx.fillStyle = rgba([30, 24, 24]); rrect(258, 640, 254, 222, 10); ctx.fill();
  ctx.fillStyle = rgba([12, 9, 10]); rrect(290, 690, 190, 120, 8); ctx.fill();
  ctx.strokeStyle = rgba(shade(hi, 1.2 * L), .55); ctx.lineWidth = 3; rrect(290, 690, 190, 120, 8); ctx.stroke();
  ctx.fillStyle = rgba(shade([210, 210, 214], .9 * L)); ctx.fillRect(310, 662, 150, 9);
  // the table, its chairs, what is on it
  tableSet(t, q, lo, hi, L);
  // the fridge, with Sam's drawing held by a magnet
  const fx0 = 1560, fy0 = 250;
  ctx.fillStyle = rgba(shade(mix(hi, [235, 220, 200], .35), .95 * L)); rrect(fx0, fy0, 250, FY - fy0, 20); ctx.fill();
  ctx.fillStyle = rgba(shade(mix(lo, hi, .3), .6 * L)); ctx.fillRect(fx0, 500, 250, 8);
  ctx.fillStyle = rgba(shade(hi, .45 * L)); rrect(fx0 + 20, 300, 14, 150, 7); ctx.fill(); rrect(fx0 + 20, 540, 14, 180, 7); ctx.fill();
  ctx.fillStyle = rgba([255, 255, 255], .25 * L); ctx.fillRect(fx0 + 236, fy0 + 20, 6, FY - fy0 - 40);
  if (!(t > T_DROP && t < T_TAPE)) drawingOnFridge(t, fx0 + 70, 330, 1, L, t >= T_TAPE);
  else if (q.newOnly) crayonDrawing(fx0 + 162, 452, .95, L, true);
  else if (t >= T_DROP && t < T_DROP + .5) drawingFalling(t - T_DROP, fx0 + 70, 330, L);
  // the hole his fist leaves
  if (t >= T_PUNCH && !q.noHole) wallHole(t, HOLE[0], HOLE[1], L, hi);
  // the doorway to the hallway at the right edge
  ctx.fillStyle = rgba(shade(lo, .3 * L)); ctx.fillRect(1840, 230, 220, FY - 230);
  ctx.fillStyle = rgba(shade(hi, .9 * L)); ctx.fillRect(1826, 216, 16, FY - 216); ctx.fillRect(1826, 216, 260, 16);
  // the lamp: cord, shade, bulb
  ctx.strokeStyle = rgba([20, 14, 12]); ctx.lineWidth = 4; line(LAMP[0], CY, lx, ly - 40);
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(-lampSwing(t));
  ctx.fillStyle = rgba([26, 20, 18]); ctx.beginPath(); ctx.moveTo(-26, -46); ctx.lineTo(26, -46); ctx.lineTo(90, 14); ctx.lineTo(-90, 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(mix(lampC, [255, 236, 200], .4), .95); ctx.beginPath(); ctx.ellipse(0, 14, 90, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  additive(() => { glow(sprOf(mix(lampC, [255, 110, 40], .45)), lx, ly + 20, 520, .3 * L); glow(sprOf(mix(lampC, [255, 150, 70], .3)), lx, ly + 10, 120, .5 * L); });
}
function ovenClockSmall(t, cx, cy, h) {
  const lab = ovenTime(t);
  segTime(lab, cx, cy, h, [255, 150, 40], .95, .8);
}
// what the oven clock says, by film time
const OVEN = [[0, '7:02'], [18.1, '7:48'], [26.3, '8:31'], [34.0, '9:17'], [TURN, '7:30'], [85.2, '7:40'], [90, '7:41']];
const ovenTime = t => { let s = OVEN[0][1]; for (const x of OVEN) if (t >= x[0]) s = x[1]; return s; };
function tableSet(t, q, lo, hi, L) {
  const ty = 700, x0 = 960, x1 = 1420;
  // the chairs behind the table
  for (const cx of [1000, 1330]) {
    ctx.fillStyle = rgba(shade(mix(lo, hi, .3), .6 * L)); ctx.fillRect(cx - 8, 560, 16, 320); ctx.fillRect(cx - 50, 760, 100, 14);
  }
  ctx.fillStyle = rgba(shade(mix(lo, hi, .45), .8 * L)); ctx.fillRect(x0 + 20, ty + 14, 18, FY - ty - 14); ctx.fillRect(x1 - 38, ty + 14, 18, FY - ty - 14);
  ctx.fillStyle = rgba(shade(hi, 1.05 * L)); ctx.fillRect(x0, ty, x1 - x0, 16);
  ctx.fillStyle = rgba(shade(hi, 1.6 * L), .6); ctx.fillRect(x0, ty, x1 - x0, 3);
  // his phone (lit), Sam's paper and crayons, the juice
  const spilled = (t >= T_SPILL && t < TURN) || t >= T_SPILL2 && t < 94.8;
  phoneOnTable(t, 1110, ty, spilled);
  ctx.fillStyle = rgba([240, 236, 226], .9 * L); ctx.save(); ctx.translate(1290, ty - 2); ctx.rotate(-.05); ctx.fillRect(-46, -5, 92, 5); ctx.restore();
  for (const [dx, c] of [[-70, [230, 60, 50]], [-60, [60, 120, 230]], [-52, [250, 200, 40]]]) { ctx.fillStyle = rgba(c, L); ctx.fillRect(1290 + dx, ty - 5, 7, 5); }
  juice(t, 1200, ty, spilled, L);
}
function phoneOnTable(t, x, y, wet) {
  ctx.fillStyle = rgba([12, 12, 16]); ctx.fillRect(x - 38, y - 6, 76, 6);
  additive(() => glow(SPR.blue, x, y - 6, 60, wet ? .15 + .15 * (Math.sin(t * 40) > 0) : .25));
}
function juice(t, x, y, spilled, L) {
  const tipT = t >= T_SPILL2 ? T_SPILL2 : T_SPILL, u = clamp((t - tipT + .35) / .35);
  const ang = spilled || (t > tipT - .35 && t < tipT + 2) ? E.io(u) * 1.45 : 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-ang);
  ctx.fillStyle = rgba([255, 255, 255], .35); rrect(-16, -54, 32, 54, 5); ctx.fill();
  if (!spilled || u < 1) { ctx.fillStyle = rgba([255, 150, 30], .9 * L); rrect(-13, -40 * (1 - u * .8), 26, 38 * (1 - u * .8), 4); ctx.fill(); }
  ctx.restore();
  if (spilled) {                               // the puddle runs to his phone and over the edge
    const k = clamp((t - tipT) / .5);
    ctx.fillStyle = rgba([255, 150, 30], .85 * L);
    ctx.beginPath(); ctx.ellipse(x - 70 * k, y - 1, 110 * k + 10, 5, 0, 0, Math.PI * 2); ctx.fill();
    if (k > .6) for (let i = 0; i < 4; i++) { const dx = x - 160 + i * 24, d = ((t - tipT) * 300 + i * 90) % 180; ctx.beginPath(); ctx.arc(dx, y + 16 + d, 4, 0, Math.PI * 2); ctx.fill(); }
  }
}
// Sam's crayon drawing: two figures holding hands, a sun, "ME + MY BROTHER" (fresh: the new one, in boxing gloves)
function crayonDrawing(cx, cy, sc, a, openHands = false) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
  ctx.fillStyle = rgba([246, 242, 232], a); ctx.fillRect(-60, -46, 120, 92);
  ctx.strokeStyle = rgba([180, 170, 150], .5 * a); ctx.lineWidth = 1; ctx.strokeRect(-60, -46, 120, 92);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = rgba([255, 200, 40], a); ctx.beginPath(); ctx.arc(40, -28, 9, 0, Math.PI * 2); ctx.fill();
  const fig = (x, h, col) => {
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, 20 - h, h * .22, 0, Math.PI * 2); ctx.stroke();
    line(x, 20 - h * .78, x, 20 - h * .3); line(x, 20 - h * .3, x - 6, 22); line(x, 20 - h * .3, x + 6, 22);
    ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(x - 3, 20 - h - 1, 1.6, 0, 7); ctx.arc(x + 3, 20 - h - 1, 1.6, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x, 20 - h + 2, h * .1, .2, Math.PI - .2); ctx.stroke();
  };
  fig(-22, 50, [40, 80, 200]); fig(14, 34, [220, 50, 40]);
  ctx.strokeStyle = rgba([40, 40, 40], a); ctx.lineWidth = 3;
  if (openHands) {                              // the new one: both of them with their hands open, palms out
    ctx.lineWidth = 2;
    for (const [x, y] of [[-36, -14], [-8, -14], [2, -2], [26, -2]]) for (let f = -2; f <= 2; f++) line(x, y, x + f * 2.4, y - 7);
    ctx.lineWidth = 3; line(-22, -14 + 4, -34, -10); line(-22, -10, -10, -10); line(14, 0, 4, 2); line(14, 0, 24, 2);
  } else line(-14, -6, 6, 2);                     // holding hands
  ctx.fillStyle = rgba([200, 40, 40], a); font(11, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ME + MY BROTHER', 0, 36);
  ctx.restore();
}
function drawingOnFridge(t, x, y, sc, L, both = false) {
  if (both) { crayonDrawing(x + 4, y + 2, .95 * sc, L); crayonDrawing(x + 92, y + 120, .95 * sc, L, true); }
  else crayonDrawing(x + 50, y + 40, sc, L);
  ctx.fillStyle = rgba([230, 60, 60], L); ctx.beginPath(); ctx.arc(both ? x + 4 : x + 50, both ? y - 42 : y - 4, 8, 0, 7); ctx.fill();
}
function drawingFalling(u, x, y, L) {          // it slides off the fridge and flutters down
  const k = E.io(clamp(u / .5));
  ctx.save(); ctx.translate(x + 50 - 40 * k, lerp(y + 40, FY - 6, k)); ctx.rotate(k * 1.4); ctx.scale(1, 1 - .7 * k); crayonDrawing(0, 0, 1, L); ctx.restore();
}
// the hole in the plaster: a dark ragged hole, cracks, dust falling for a while
function wallHole(t, x, y, L, hi) {
  const d = t - T_PUNCH, k = E.out(clamp(d / .12));
  if (t >= T_PATCH) {                            // patched: a pale square of fresh plaster, smoothed
    const u = E.out(inv(T_PATCH, T_PATCH + .8, t));
    ctx.fillStyle = rgba(shade(mix(hi, [250, 240, 225], .12), 1.0 * L)); ctx.beginPath(); ctx.ellipse(x, y, 66, 58, 0, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(10,6,6,${1 - u})`; ctx.beginPath(); ctx.ellipse(x, y, 36 * (1 - u), 30 * (1 - u), 0, 0, 7); ctx.fill();
    return;
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = rgba(shade(hi, 1.2 * L)); ctx.beginPath();
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 54 + 14 * rnd(i + 300); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba([10, 6, 6]); ctx.beginPath();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 34 + 12 * rnd(i + 310); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .85); }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba([20, 10, 8], .8); ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) { const a = rnd(i + 320) * Math.PI * 2, r1 = 50, r2 = 90 + 70 * rnd(i + 321); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a + .15) * (r1 + r2) / 2, Math.sin(a + .15) * (r1 + r2) / 2); ctx.lineTo(Math.cos(a - .05) * r2, Math.sin(a - .05) * r2); ctx.stroke(); }
  ctx.restore();
  if (d < 3) {                                   // plaster dust
    ctx.fillStyle = rgba([240, 220, 200], .6 * (1 - d / 3));
    for (let i = 0; i < 40; i++) { const vx = (rnd(i + 330) - .5) * 300, vy = -rnd(i + 331) * 200, dd = Math.min(d, 2.5); ctx.beginPath(); ctx.arc(x + vx * dd * .6, y + vy * dd + 260 * dd * dd, 2 + 3 * rnd(i + 332), 0, 7); ctx.fill(); }
  }
}

// ---------- the hallway: Sam's door with his sign, the hall mirror, a sconce, picture frames ----------
const HALL = { door: [900, 300, 230, 580], mirror: [1250, 330, 230, 330], sconce: [700, 330] };
function hallSet(t, q) {
  const k = q.heat, calm = !!q.calm, L = (q.flick ? .75 + .25 * Math.abs(Math.sin(t * 27) * Math.sin(t * 5.3)) : 1) * (q.light ?? 1);
  const hi = roomCol(k, 1, calm), lo = roomCol(k, 0, calm), lampC = calm ? [255, 214, 160] : mix(EMBER.lamp, EMBER.lampHot, k);
  const [sx, sy] = HALL.sconce;
  const g = ctx.createRadialGradient(sx, sy, 40, sx, sy, 1400);
  g.addColorStop(0, rgba(shade(hi, 1.05 * L))); g.addColorStop(.5, rgba(shade(mix(hi, lo, .6), L))); g.addColorStop(1, rgba(shade(lo, .7 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  ctx.fillStyle = rgba(shade(lo, .5 * L)); ctx.fillRect(-W, -H, 3 * W, H + CY); ctx.fillStyle = rgba(shade(hi, .8 * L)); ctx.fillRect(-W, CY, 3 * W, 6);
  // the wainscot: a darker lower panel with a rail
  ctx.fillStyle = rgba(shade(mix(lo, hi, .4), .75 * L)); ctx.fillRect(-W, 640, 3 * W, FY - 640);
  ctx.fillStyle = rgba(shade(hi, 1.1 * L)); ctx.fillRect(-W, 632, 3 * W, 10);
  const fg = ctx.createLinearGradient(0, FY, 0, FY + 300); fg.addColorStop(0, rgba(shade(mix(lo, hi, .3), .7 * L))); fg.addColorStop(1, rgba(shade(lo, .3 * L)));
  ctx.fillStyle = fg; ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.fillStyle = rgba(shade([120, 30, 24], .8 * L)); ctx.fillRect(-W, FY + 30, 3 * W, 70);          // the runner rug
  ctx.fillStyle = rgba(shade(hi, .7 * L)); ctx.fillRect(-W, FY - 14, 3 * W, 14);
  // picture frames (a family: shapes only)
  for (const [x, y, w, h] of [[250, 330, 150, 110], [430, 300, 110, 150]]) {
    ctx.fillStyle = rgba(shade([60, 36, 24], L)); ctx.fillRect(x - 8, y - 8, w + 16, h + 16);
    ctx.fillStyle = rgba(shade(mix(hi, [200, 190, 170], .5), .8 * L)); ctx.fillRect(x, y, w, h);
    ctx.fillStyle = rgba(shade([40, 30, 30], L)); for (const [u, r] of [[.3, .17], [.55, .2], [.78, .12]]) { ctx.beginPath(); ctx.arc(x + u * w, y + h * .5, r * h * .6, 0, 7); ctx.fill(); ctx.fillRect(x + u * w - r * h * .5, y + h * .5, r * h, h * .5); }
  }
  // the sconce
  ctx.fillStyle = rgba([30, 22, 18]); rrect(sx - 22, sy - 10, 44, 40, 8); ctx.fill();
  ctx.fillStyle = rgba(lampC, .9); ctx.beginPath(); ctx.moveTo(sx - 34, sy - 10); ctx.lineTo(sx + 34, sy - 10); ctx.lineTo(sx + 22, sy - 60); ctx.lineTo(sx - 22, sy - 60); ctx.closePath(); ctx.fill();
  additive(() => { glow(sprOf(lampC), sx, sy - 30, 600, .45 * L); glow(SPR.lamp, sx, sy - 34, 110, .6 * L); });
  // Sam's door (or the empty frame and his room beyond it)
  const [dx, dy, dw, dh] = HALL.door;
  ctx.fillStyle = rgba(shade(hi, 1.0 * L)); ctx.fillRect(dx - 22, dy - 22, dw + 44, dh + 22);
  ctx.fillStyle = rgba([14, 16, 30]); ctx.fillRect(dx, dy, dw, dh);
  additive(() => glow(SPR.star, dx + dw * .3, dy + dh * .8, 200, .35));      // his night-light, inside
  hallDoor(t, q, dx, dy, dw, dh, hi, lo, L);
  // the mirror (whole, or cracked), and the dent his fist leaves in the wall beside it
  hallMirror(t, q, L, hi);
  if (t >= T_BLOW && t < TURN) {
    const d = t - T_BLOW, k = E.out(clamp(d / .1)), [x, y] = HALL_HOLE;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(14,6,6,.95)'; ctx.beginPath(); for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2, r = 26 + 10 * rnd(i + 340); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(20,8,6,.85)'; ctx.lineWidth = 3; for (let i = 0; i < 7; i++) { const a = rnd(i + 350) * Math.PI * 2, r2 = 60 + 60 * rnd(i + 351); line(Math.cos(a) * 28, Math.sin(a) * 28, Math.cos(a + .2) * r2, Math.sin(a + .2) * r2); }
    ctx.restore();
    if (d < 2) { ctx.fillStyle = `rgba(240,220,200,${.6 * (1 - d / 2)})`; for (let i = 0; i < 30; i++) { const vx = (rnd(i + 360) - .5) * 260, vy = -rnd(i + 361) * 180, dd = Math.min(d, 1.6); ctx.beginPath(); ctx.arc(x + vx * dd * .6, y + vy * dd + 300 * dd * dd, 2 + 3 * rnd(i + 362), 0, 7); ctx.fill(); } }
  }
}
function samSign(x, y, sc, a = 1) {            // his paper sign: SAM in crayon, a star
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.04); ctx.scale(sc, sc);
  ctx.fillStyle = rgba([248, 244, 232], a); ctx.fillRect(-56, -34, 112, 68);
  font(30, SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [['S', [230, 60, 50]], ['A', [60, 120, 230]], ['M', [40, 170, 80]]].forEach(([c, col], i) => { ctx.fillStyle = rgba(col, a); ctx.fillText(c, -26 + i * 24, -2); });
  ctx.fillStyle = rgba([250, 200, 40], a); starPath(40, -18, 9); ctx.fill();
  ctx.restore();
}
function starPath(x, y, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); }
// the door: shut, shaking with each blow; at the last blow its frame splits (the door holds); q.ajar: Sam opens it a crack
function hallDoor(t, q, dx, dy, dw, dh, hi, lo, L) {
  const shake = 0;
  const aj = q.ajar || 0, gap = 46 * aj;
  if (gap > 0) {                                 // the crack of the door: his room's night-light, and Sam's eye in it
    ctx.fillStyle = rgba([24, 26, 46]); ctx.fillRect(dx, dy, gap + 4, dh);
    additive(() => glow(SPR.star, dx + gap / 2, dy + dh * .62, 120, .35 * aj));
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, gap, dh); ctx.clip();
    const sx = dx + 30, sy = dy + dh - 248;
    ctx.fillStyle = rgba([16, 15, 24]); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, 7); ctx.fill();
    ctx.fillStyle = rgba([238, 230, 214], .95); ctx.beginPath(); ctx.ellipse(sx - 14, sy - 4, 9, 7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba([14, 11, 13]); ctx.beginPath(); ctx.arc(sx - 16, sy - 3, 4, 0, 7); ctx.fill();
    ctx.restore();
  }
  ctx.save(); ctx.translate(shake + gap, 0); ctx.beginPath(); ctx.rect(dx - 10, dy - 10, dw + 20, dh + 20); ctx.clip();
  ctx.translate(dx + dw, 0); ctx.scale(1 - gap / dw, 1); ctx.translate(-(dx + dw), 0);
  ctx.fillStyle = rgba(shade(mix(lo, hi, .75), .95 * L)); ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = rgba(shade(hi, 1.3 * L), .6); ctx.lineWidth = 4; ctx.strokeRect(dx + 26, dy + 30, dw - 52, dh * .4); ctx.strokeRect(dx + 26, dy + dh * .5, dw - 52, dh * .42);
  ctx.fillStyle = rgba([230, 200, 140], L); ctx.beginPath(); ctx.arc(dx + 30, dy + dh * .52, 10, 0, 7); ctx.fill();
  samSign(dx + dw / 2, dy + 110, 1, L);
  ctx.restore();
}
// the hall mirror: whole (him in it, small) or cracked from where the door hit it
const CRACK0 = [1262, 500];
function hallMirror(t, q, L, hi) {
  const [mx, my, mw, mh] = HALL.mirror;
  ctx.fillStyle = rgba(shade([70, 44, 30], L)); rrect(mx - 14, my - 14, mw + 28, mh + 28, 10); ctx.fill();
  const g = ctx.createLinearGradient(mx, my, mx + mw, my + mh); g.addColorStop(0, rgba(shade(mix(hi, [170, 170, 180], .5), .7 * L))); g.addColorStop(1, rgba(shade(mix(hi, [80, 80, 96], .5), .5 * L)));
  ctx.fillStyle = g; ctx.fillRect(mx, my, mw, mh);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(mx + 30, my); ctx.lineTo(mx + 90, my); ctx.lineTo(mx + 20, my + mh); ctx.lineTo(mx - 40 + 30, my + mh); ctx.closePath(); ctx.fill();
  if (t >= (q.crackAt ?? 1e9)) crackLines(CRACK0[0], CRACK0[1], [mx, my, mw, mh], clamp((t - q.crackAt) / .12), 1);
}
// cracks radiating from (cx, cy) inside box b
function crackLines(cx, cy, b, k, a, sc = 1) {
  ctx.save(); ctx.beginPath(); ctx.rect(b[0], b[1], b[2], b[3]); ctx.clip();
  ctx.strokeStyle = `rgba(255,255,255,${.75 * a})`; ctx.lineWidth = 2.2 * sc; ctx.lineCap = 'round';
  for (let i = 0; i < 11; i++) {
    const a0 = i / 11 * Math.PI * 2 + rnd(i + 500) * .4; let x = cx, y = cy;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let j = 1; j <= 5; j++) { const r = j * 70 * sc * k * (.8 + .4 * rnd(i * 7 + j)); const aa = a0 + (rnd(i * 13 + j) - .5) * .35; x = cx + Math.cos(aa) * r; y = cy + Math.sin(aa) * r; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(255,255,255,${.5 * a})`; ctx.lineWidth = 1.6 * sc;
  for (const r of [26, 64, 120]) { ctx.beginPath(); for (let i = 0; i <= 11; i++) { const aa = i / 11 * Math.PI * 2 + rnd(i + 500) * .4, rr = r * sc * k * (.85 + .3 * rnd(i + r)); ctx.lineTo(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr); } ctx.stroke(); }
  ctx.restore();
}

// ---------- Sam's room: a small corner, cool moonlight, his star night-light, toys ----------
const ROOM_S = { corner: 1840, nl: [880, 860] };
function samRoomSet(t, q) {
  const L = q.light ?? 1, door = q.doorLight ?? 1, heat = q.heat ?? 1;
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, rgba(shade([60, 70, 112], .85 * L))); g.addColorStop(1, rgba(shade([44, 52, 90], .7 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + FY);
  ctx.fillStyle = rgba(shade([34, 40, 72], .9 * L)); ctx.fillRect(ROOM_S.corner, -H, 2 * W, H + FY);          // the side wall, darker
  ctx.strokeStyle = rgba([120, 140, 200], .35); ctx.lineWidth = 3; line(ROOM_S.corner, -H, ROOM_S.corner, FY);
  ctx.fillStyle = rgba(shade([40, 46, 78], .8 * L)); ctx.fillRect(-W, FY, 3 * W, 2 * H);
  ctx.fillStyle = rgba(shade([90, 100, 150], .8 * L)); ctx.fillRect(-W, FY - 12, 3 * W, 12);
  ctx.fillStyle = rgba([255, 240, 170], .6 * L); for (let i = 0; i < 9; i++) { starPath(150 + rnd(i + 600) * 980, 120 + rnd(i + 601) * 380, 9 + 6 * rnd(i + 602)); ctx.fill(); }   // glow stars
  // the door on the left: shut (ember light at its edges, shaking with each blow) or open, the hall's light falling in
  if (q.shut) {
    const shake = 0;
    const hc = mix([255, 150, 70], [255, 80, 40], heat), aj = q.ajar || 0;
    ctx.fillStyle = rgba(hc, .9); ctx.fillRect(-60 + shake, FY - 6, 260, 6); ctx.fillRect(184 + shake, 220, 6 + 30 * aj, FY - 220);
    additive(() => glow(sprOf(hc), 180, FY - 10, 160, .4));
    ctx.fillStyle = rgba(shade([60, 68, 110], .9 * L)); ctx.fillRect(-60 + shake, 220, 244, FY - 226);
    ctx.strokeStyle = rgba([150, 160, 220], .35); ctx.lineWidth = 3; ctx.strokeRect(-36 + shake, 250, 196, 260); ctx.strokeRect(-36 + shake, 540, 196, 300);
    ctx.fillStyle = rgba([220, 200, 150]); ctx.beginPath(); ctx.arc(160 + shake, 560, 9, 0, 7); ctx.fill();
  } else if (door > 0) {
    const hc = mix([255, 150, 70], [255, 80, 40], heat);
    ctx.fillStyle = rgba(hc, .5 * door); ctx.fillRect(-40, 220, 230, FY - 220);
    ctx.fillStyle = rgba(hc, .14 * door); ctx.beginPath(); ctx.moveTo(190, FY); ctx.lineTo(-40, FY); ctx.lineTo(300, FY + 220); ctx.lineTo(900, FY + 220); ctx.closePath(); ctx.fill();
    additive(() => glow(sprOf(hc), 80, 560, 600, .35 * door));
  }
  // his bed along the back wall, a dinosaur on the pillow
  ctx.fillStyle = rgba(shade([70, 80, 130], .9 * L)); ctx.fillRect(1160, 620, 30, FY - 620); ctx.fillRect(1700, 560, 40, FY - 560);
  ctx.fillStyle = rgba(shade([110, 120, 180], .9 * L)); ctx.fillRect(1160, 700, 580, 70);
  ctx.fillStyle = rgba(shade([150, 120, 190], .85 * L)); ctx.fillRect(1190, 690, 470, 30);
  ctx.fillStyle = rgba(shade([210, 210, 240], .8 * L)); rrect(1560, 650, 120, 44, 18); ctx.fill();
  ctx.fillStyle = rgba(shade([90, 170, 110], .9 * L)); rrect(1590, 616, 60, 36, 14); ctx.fill(); ctx.beginPath(); ctx.arc(1648, 612, 16, 0, 7); ctx.fill();
  ctx.fillStyle = rgba(shade([60, 66, 110], .9 * L)); ctx.fillRect(1160, 770, 580, FY - 770);
  // a toy box and a ball
  ctx.fillStyle = rgba(shade([110, 60, 50], .9 * L)); ctx.fillRect(340, 760, 200, 120);
  ctx.fillStyle = rgba(shade([200, 120, 90], .9 * L)); ctx.fillRect(340, 752, 200, 12);
  ctx.fillStyle = rgba(shade([220, 70, 60], L)); ctx.beginPath(); ctx.arc(560, 720, 34, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba([255, 230, 200], .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(560, 720, 34, -2, -.4); ctx.stroke();
  // the star night-light on the floor
  const [nx, ny] = ROOM_S.nl;
  ctx.fillStyle = rgba([255, 236, 170]); starPath(nx, ny - 26, 24); ctx.fill();
  ctx.fillStyle = rgba([60, 60, 80]); ctx.fillRect(nx - 14, ny - 6, 28, 8);
  additive(() => { glow(SPR.star, nx, ny - 26, 380, .7); glow(SPR.star, nx, ny - 26, 70, .9); });
}
