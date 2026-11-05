// ===== RAGE, part E: the comeback. The boxing gym (steel-blue brick, morning light), the bridge at sunrise =====

const GF = 880;                                   // the gym floor
const STEEL = { hi: [150, 170, 196], lo: [52, 60, 78], gold: [255, 206, 140] };
// the boxing gym: brick walls lit by tall windows, a ring's corner, hanging bags, a pull-up bar, a rack, the timer box
// q: { shutter (0 shut … 1 open: the roll-up door at the left), light (0 … 1), door (its dark doorway at the right) }
function gymSet(t, q = {}) {
  const L = q.light ?? 1;
  const g = ctx.createLinearGradient(0, 0, 0, GF); g.addColorStop(0, rgba(shade(STEEL.lo, .9 * L))); g.addColorStop(1, rgba(shade(STEEL.hi, .62 * L)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, H + GF);
  for (let r = 0; r < 15; r++) for (let c = -8; c < 22; c++) {      // the brick
    const bx = c * 128 + (r % 2) * 64, by = 40 + r * 56;
    if (by > GF - 20) continue;
    ctx.fillStyle = rgba(shade(mix(STEEL.lo, STEEL.hi, .45 + .2 * rnd(r * 31 + c)), .72 * L), .55); ctx.fillRect(bx, by, 122, 50);
  }
  for (const wx of [380, 980]) {                  // two tall windows, morning gold pouring in
    ctx.fillStyle = rgba(mix([255, 226, 180], [255, 200, 140], .5), .95 * L); ctx.fillRect(wx, 120, 240, 300);
    ctx.strokeStyle = rgba([40, 46, 60]); ctx.lineWidth = 10; ctx.strokeRect(wx, 120, 240, 300); line(wx + 120, 120, wx + 120, 420); line(wx, 270, wx + 240, 270);
    ctx.fillStyle = rgba(STEEL.gold, .13 * L); ctx.beginPath(); ctx.moveTo(wx, 420); ctx.lineTo(wx + 240, 420); ctx.lineTo(wx + 520, GF + 40); ctx.lineTo(wx + 140, GF + 40); ctx.closePath(); ctx.fill();
    additive(() => glow(SPR.dawn, wx + 120, 270, 520, .4 * L));
  }
  // the floor: dark rubber, a pool of gold
  ctx.fillStyle = rgba(shade([60, 62, 70], .9 * L)); ctx.fillRect(-W, GF, 3 * W, 2 * H);
  ctx.fillStyle = rgba(STEEL.hi, .5 * L); ctx.fillRect(-W, GF, 3 * W, 4);
  additive(() => { ctx.save(); ctx.translate(960, GF + 50); ctx.scale(1, .18); glow(SPR.dawn, 0, 0, 900, .4 * L); ctx.restore(); });
  // the ring's corner at the right: a post and three red ropes
  ctx.fillStyle = rgba(shade([40, 40, 48], L)); ctx.fillRect(1660, 470, 26, GF - 470);
  ctx.fillStyle = rgba(shade([90, 96, 110], L)); ctx.fillRect(1650, 460, 46, 22);
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = rgba([210, 40, 40], .95 * L); ctx.lineWidth = 9; line(1686, 520 + i * 90, 2400, 500 + i * 90); ctx.strokeStyle = rgba([255, 160, 150], .5 * L); ctx.lineWidth = 2; line(1686, 516 + i * 90, 2400, 496 + i * 90); }
  ctx.fillStyle = rgba(shade([110, 26, 26], .85 * L)); ctx.fillRect(1640, GF - 70, 900, 70);
  // two heavy bags hanging on chains (in the background)
  for (const [bx, ph] of [[1300, 0], [1490, 1.3]]) {
    const sw = Math.sin(t * 1.1 + ph) * .03;
    ctx.save(); ctx.translate(bx, 60); ctx.rotate(sw);
    ctx.strokeStyle = rgba([150, 156, 170], .9 * L); ctx.lineWidth = 5; line(0, 0, 0, 230);
    ctx.fillStyle = rgba(shade([120, 30, 28], .95 * L)); rrect(-58, 230, 116, 360, 40); ctx.fill();
    ctx.fillStyle = rgba([255, 220, 190], .25 * L); rrect(-48, 240, 22, 330, 10); ctx.fill();
    ctx.fillStyle = rgba(shade([40, 20, 20], L)); ctx.fillRect(-58, 300, 116, 14); ctx.fillRect(-58, 500, 116, 14);
    ctx.restore();
  }
  // the roll-up shutter at the left edge
  if (q.shutter !== undefined) {
    const up = q.shutter, sx = -300, sw = 520, top = 140, h = (GF - top) * (1 - up);
    ctx.fillStyle = rgba([255, 226, 180], .95); ctx.fillRect(sx, top, sw, GF - top);
    additive(() => glow(SPR.dawn, sx + sw / 2, GF - 100, 900, .7 * up));
    ctx.fillStyle = rgba([84, 92, 108]); ctx.fillRect(sx, top, sw, h);
    ctx.strokeStyle = rgba([40, 46, 60]); ctx.lineWidth = 4; for (let y = top + 20; y < top + h; y += 26) line(sx, y, sx + sw, y);
    ctx.fillStyle = rgba([30, 34, 44]); ctx.fillRect(sx - 10, top - 30, sw + 20, 34);
  }
  if (q.door) {                                    // its dark doorway, at the right (the ending)
    ctx.fillStyle = rgba([6, 6, 10]); ctx.fillRect(1520, 360, 210, GF - 360);
    ctx.fillStyle = rgba(shade(STEEL.hi, .8 * L)); ctx.fillRect(1506, 346, 14, GF - 346); ctx.fillRect(1506, 346, 238, 14); ctx.fillRect(1730, 346, 14, GF - 346);
  }
}
// a figure in the gym: lit gold from the windows
const GRIM = [255, 214, 160];
function gymFig(P, t, ex) { drawFig(P, ex || exprAt(t), GRIM, .62, GRIM, { lx: .6, ly: -1, la: .36, lc: [.6, -.5] }); }

// the jump rope: a hop and the rope's arc round him
function poseRope(x, fy, s, t) {
  const ph = (t * 2.6) % 1, hop = Math.abs(Math.sin(ph * Math.PI)) * 18 * s;
  const P = figPose(x, fy - hop, s, 1, { hands: [[x - 54 * s, fy - hop - 250 * s], [x + 60 * s, fy - hop - 250 * s]], step: .4 });
  P.rope = { ph, hop };
  return P;
}
function drawRope(P, s) {
  const [a, b] = P.hands, ph = P.rope.ph, ang = ph * Math.PI * 2, rx = (b[0] - a[0]) / 2 + 30 * s, cx = (a[0] + b[0]) / 2;
  ctx.strokeStyle = rgba([240, 230, 220], .9); ctx.lineWidth = 4 * s;
  ctx.beginPath(); ctx.ellipse(cx, a[1] + Math.cos(ang) * 120 * s, rx + 40 * s, 140 * s + Math.cos(ang) * 120 * s, 0, 0, Math.PI); ctx.stroke();
}
// boxing pads (him) and gloves (Sam): pads at his hands, gloves at Sam's
function pad(x, y, s, col = [230, 60, 50]) { ctx.fillStyle = rgba(col); rrect(x - 26 * s, y - 34 * s, 52 * s, 68 * s, 18 * s); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x, y, 9 * s, 0, 7); ctx.fill(); }
function glove(x, y, s) { ctx.fillStyle = rgba([220, 30, 36]); ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,200,200,.5)'; ctx.beginPath(); ctx.arc(x - 6 * s, y - 8 * s, 7 * s, 0, 7); ctx.fill(); }

// p: { move: 'shutter' | 'rope' | 'pushup' | 'pullup' | 'squat' | 'curl' | 'breathe' | 'pads' | 'door', fr, eyes [a, b] }
function gymScene(t, p, L) {
  const s = 1.1, m = p.move;
  if (m === 'shutter') { const k = E.io(inv(.05, 1.1, L)); return { shutter: k, P: figPose(lerp(-60, 360, inv(.5, 1.4, L)), GF, s, 1, { lean: .08 }), walk: true }; }
  if (m === 'rope') return { P: poseRope(880, GF, s, t) };
  if (m === 'pushup') return { P: posePushup(760, GF, 1.25, rep(L, 1.4)) };
  if (m === 'pullup') return { P: posePullup(950, 300, 1.1, rep(L, 1.1)), bar: true };
  if (m === 'pullfail') {                         // DAY 1: he hangs and strains, can't get his chin over the bar, and drops
    if (L < 1.0) return { P: posePullup(950, 300, 1.1, .32 * (1 - Math.cos(Math.min(L, .9) * Math.PI * 1.1)) / 2 + .04 * Math.sin(L * 40) * (L > .4 ? 1 : 0)), bar: true };
    const k = E.out(inv(1.0, 1.15, L)); return { P: figPose(950, GF, 1.1, 1, { hands: [[1000 - 20 * k, GF - 300 + 80 * k], [1010 - 20 * k, GF - 290 + 80 * k]], lean: .2 * (1 - k), knee: .25 * (1 - inv(1.15, 1.3, L)) }), bar: true };
  }
  if (m === 'together') {                         // both of them, palms open, breathing; Sam copies him a beat behind
    const brM = .5 - .5 * Math.cos(L * Math.PI * 1.25), brS = .5 - .5 * Math.cos(Math.max(0, L - .35) * Math.PI * 1.25);
    const M = figPose(1080, GF, s, -1, { hands: [[1036, GF - 296 - 18 * brM], [1016, GF - 288 - 18 * brM]], open: true, lean: -.04 * brM });
    const S = figPose(800, GF, .74, 1, { hands: [[866, GF - 170 - 16 * brS], [884, GF - 164 - 16 * brS]], open: true }, true);
    return { P: M, S, breath: brM, breathS: brS, calmK: 1, together: true };
  }
  if (m === 'squat') return { P: poseSquat(900, GF, 1.15, rep(L, 1)) };
  if (m === 'curl') return { P: poseCurl(940, GF, 1.1, rep(L, 1.3)) };
  if (m === 'breathe') { const br = .5 - .5 * Math.cos(Math.max(0, L - .1) * Math.PI * 1.25); return { P: poseSit(860, 760, s, .15 - .1 * br), bench: true, breath: br }; }
  if (m === 'pads') {
    const bell = p.bell ?? 1.2, after = L > bell, hit = after ? 0 : rep(L, 1.6), calmK = inv(bell + .1, bell + .6, L), br = after ? .5 - .5 * Math.cos((L - bell - .5) * Math.PI * 1.2) : 0;
    const M = figPose(1100, GF, s, -1, { hands: after ? [[1040, GF - 250 - 20 * br], [1020, GF - 240 - 20 * br]] : [[1040, GF - 330 - 20 * hit], [1030, GF - 280]], open: after, lean: -.05 * br });
    const S = figPose(800, GF, .74, 1, { hands: after ? [[846, GF - 170 - 14 * br], [860, GF - 164 - 14 * br]] : [[860 + 150 * hit, GF - 245], [850 + 150 * (1 - hit), GF - 230]], open: after }, true);
    return { P: M, S, pads: !after, breath: br, bell, calmK };
  }
  return { P: figPose(900, GF, s, 1, {}) };
}
defShot('gym', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], q = gymScene(t, p, L);
  fill([30, 34, 44]); cam(...fr);
  gymSet(t, { shutter: q.shutter, door: p.move === 'door' });
  if (q.bar) { ctx.strokeStyle = '#2c3038'; ctx.lineWidth = 16; ctx.lineCap = 'round'; line(760, GF, 760, 300); line(1160, GF, 1160, 300); ctx.strokeStyle = rgba([220, 226, 236], .9); ctx.lineWidth = 10; line(740, 300, 1180, 300); }
  if (q.bench) { ctx.fillStyle = '#23262e'; ctx.fillRect(700, 760, 380, 26); ctx.fillRect(730, 786, 18, GF - 786); ctx.fillRect(1040, 786, 18, GF - 786); ctx.fillStyle = 'rgba(255,214,160,.4)'; ctx.fillRect(700, 760, 380, 4); }
  if (p.eyes) { placeDevil([1500, 1040, .55]); devilEyes(t, devilO({ eyes: .8 * win(t, p.eyes[0], p.eyes[1], .25, .5) })); }
  if (p.dev) {                                      // it stands in a corner of the gym, a little smaller each day, fading as he works
    const [x, fy, s2] = p.dev.at, k = inv(p.dev.fade[0], p.dev.fade[1], t);
    placeDevil([x, fy + 200 * s2, s2]);
    const o = devilO({ a: .85 - .45 * k, eyes: 1 - .4 * k, grin: .5, lean: .3 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  }
  if (p.move === 'door') {                        // starved: knee-high and thin in the doorway, its eyes opening
    const k = inv(p.open || 0, (p.open || 0) + .5, t);
    placeDevil([1624, GF + 200 * .2, .2]);
    const o = devilO({ a: .9, eyes: k, grin: .5 * inv((p.open || 0) + .6, (p.open || 0) + 1.2, t), lean: .3 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
    return;
  }
  const P = q.P;
  if (P.bar) { plate(P.bar[0] - 6, P.bar[1], 58); }
  const eyesShut = q.together ? Object.assign({}, EXPR.calm, { lid: .92 }) : null;
  if (q.S) { gymFig(q.S, t, eyesShut || (q.calmK > .5 ? EXPR.calm : EXPR.laugh)); if (!q.pads) palmsUp(q.S, .8 * q.calmK); else { glove(q.S.hands[0][0], q.S.hands[0][1], .74); glove(q.S.hands[1][0], q.S.hands[1][1], .74); } }
  gymFig(P, t, q.S ? (eyesShut || (q.calmK > .5 ? EXPR.calm : EXPR.laugh)) : undefined);
  if (q.pads) { pad(P.hands[0][0], P.hands[0][1], 1.1); pad(P.hands[1][0], P.hands[1][1], 1.1); }
  if (q.S && !q.pads) additive(() => { glow(SPR.dawn, P.head[0] - 50, P.head[1] + 40, 90 + 110 * q.breath, .22 * q.calmK); glow(SPR.dawn, q.S.head[0] + 40, q.S.head[1] + 30, 60 + 80 * (q.breathS ?? q.breath), .22 * q.calmK); });
  else if (q.S) palmsUp(P, .8 * q.calmK);
  if (P.rope) drawRope(P, 1.1);
  if (P.bar) { ctx.fillStyle = '#d8d8de'; rrect(P.bar[0] - 8, P.bar[1] - 8, 16, 16, 4); ctx.fill(); }
  if (P.db) { ctx.strokeStyle = '#cfcfd6'; ctx.lineWidth = 8; line(P.db[0] - 26, P.db[1], P.db[0] + 26, P.db[1]); plate(P.db[0] - 26, P.db[1], 20); plate(P.db[0] + 26, P.db[1], 20); }
  if (q.bench && q.breath !== undefined) {         // his breath: a soft ring that swells and settles
    additive(() => glow(SPR.dawn, P.head[0] + 60, P.head[1] + 40, 120 + 140 * q.breath, .18));
    palmsUp({ hands: [[P.hand[0] - 10, P.hand[1] + 10], [P.hand[0] + 20, P.hand[1] + 14]] }, .9);
  }
  if (p.bellAt !== undefined && L > p.bellAt && L < p.bellAt + .5) {   // the bell: a bright ring on the wall
    additive(() => glow(SPR.gold, 1600, 300, 160 * (1 + (L - p.bellAt) * 3), .7 * (1 - (L - p.bellAt) / .5)));
  }
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540];
  if (p.move === 'door') return toScreenBox(fr, [1460, 640, 1780, 900]);
  const q = gymScene(t, p, L); let b = poseBox(q.P, 60);
  if (q.S) b = unionBox(b, poseBox(q.S, 40));
  if (p.move === 'pullup') b[1] = Math.min(b[1], 270);
  return toScreenBox(fr, b);
});

// ---------- the run: over a city bridge into the sunrise; it chases and falls behind ----------
// p { fr, run: [from, to] (film time of the whole run) }
defShot('bridge', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], u = t - p.run[0], ph = u * 2.4 * Math.PI * 2, d = u * 2.4 * 250, fade = inv(p.run[0], p.run[1], t);
  fill([90, 70, 120], [250, 170, 120]);
  cam(...fr);
  const sky = ctx.createLinearGradient(0, -200, 0, 760); sky.addColorStop(0, rgba([70, 80, 140])); sky.addColorStop(.6, rgba([240, 150, 120])); sky.addColorStop(1, rgba([255, 214, 150]));
  ctx.fillStyle = sky; ctx.fillRect(-800, -600, W + 1600, 1400);
  additive(() => { glow(SPR.dawn, 1500, 640, 900, .8); glow(SPR.gold, 1500, 640, 220, .9); });
  ctx.fillStyle = rgba([255, 236, 200]); ctx.beginPath(); ctx.arc(1500, 640, 70, 0, 7); ctx.fill();
  // the city across the river, far, then near
  for (const [par, base, col, lit] of [[.05, 640, [120, 90, 130], .5], [.12, 700, [70, 56, 92], .8]]) {
    ctx.fillStyle = rgba(col);
    for (let i = -4; i < 30; i++) {
      const bw = 80 + 70 * rnd(i * 3 + par * 100), bh = 80 + 220 * rnd(i * 7 + par * 50), x = ((i * 130 - d * par) % 3600 + 3600) % 3600 - 800;
      ctx.fillRect(x, base - bh, bw, bh + 200);
      ctx.fillStyle = rgba([255, 214, 140], lit * (.3 + .4 * rnd(i)));
      for (let j = 0; j < 4; j++) ctx.fillRect(x + 12 + (j % 2) * 30, base - bh + 20 + Math.floor(j / 2) * 40, 10, 14);
      ctx.fillStyle = rgba(col);
    }
  }
  ctx.fillStyle = rgba([200, 130, 120]); ctx.fillRect(-800, 720, W + 1600, 140);         // the river, catching the sun
  ctx.fillStyle = rgba([255, 220, 170], .55); for (let i = 0; i < 26; i++) ctx.fillRect(1500 - 300 + rnd(i + 30) * 600 + Math.sin(t * 2 + i) * 10, 730 + rnd(i + 31) * 120, 40 + 60 * rnd(i), 3);
  // the bridge deck and its railing (the posts slide past)
  ctx.fillStyle = rgba([52, 44, 62]); ctx.fillRect(-800, 820, W + 1600, 400);
  ctx.fillStyle = rgba([255, 200, 150], .7); ctx.fillRect(-800, 820, W + 1600, 5);
  ctx.strokeStyle = rgba([38, 32, 48]); ctx.lineWidth = 10; line(-800, 610, W + 800, 610);
  for (let i = -2; i < 26; i++) { const x = ((i * 110 - d) % 2860 + 2860) % 2860 - 400; ctx.lineWidth = 8; line(x, 610, x, 820); }
  ctx.strokeStyle = rgba([255, 200, 150], .5); ctx.lineWidth = 3; line(-800, 606, W + 800, 606);
  embers(t, d, .7);
  const ds = p.devS || .75;
  placeDevil([150 - 260 * fade, 820 + 200 * ds, ds]);
  const o = devilO({ a: .75 - .4 * fade, eyes: .95 - .5 * fade, grin: .3, lean: .4, stride: ph * .75 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  const PW = poseWalk(760, 820, 1.05, ph, 1);
  drawPerson(PW, [8, 7, 10], C.gold, .7, 1, -.3);
  face(PW.head[0], PW.head[1], PW.head[2], exprAt(t), { turn: 1, light: C.gold, la: .45, lc: [.8, -.1] });
}, (t, p) => { const u = t - p.run[0]; return toScreenBox(p.fr || [1, 960, 540], poseBox(poseWalk(760, 820, 1.05, u * 2.4 * Math.PI * 2, 1), 60)); });

// ---------- the fridge, close: the drawing; Sam's small hand tapes it back, and a new one ----------
// p: { tape (when his hand presses the tape on) }
defShot('fridge', (t, p, L) => {
  const calm = t >= TURN;
  fill([30, 14, 8]); cam(3.3, 1676, 410);
  kitchenSet(t, { heat: heatAt(t), calm, noHole: true, newOnly: p.tape !== undefined });
  if (p.tape !== undefined) {
    const k = E.out(inv(p.tape - .55, p.tape, t)), out = E.io(inv(p.tape + .25, p.tape + .7, t)), hx = lerp(1810, 1640, k) + 160 * out, hy = lerp(560, 372, k) + 120 * out;
    if (t < p.tape) { ctx.save(); ctx.translate(hx - 30, hy - 30); ctx.rotate(-.2 * (1 - k)); crayonDrawing(0, 0, .95, 1); ctx.restore(); }
    else { ctx.fillStyle = 'rgba(255,255,255,.65)'; for (const [x, y, a] of [[1600, 290, -.5], [1700, 370, -.5]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillRect(-16, -5, 32, 10); ctx.restore(); } }
    ctx.strokeStyle = 'rgba(255,220,180,.6)'; ctx.lineWidth = 15; ctx.lineCap = 'round'; line(hx + 140, hy + 110, hx, hy);
    ctx.strokeStyle = '#100f18'; ctx.lineWidth = 11; line(hx + 140, hy + 110, hx, hy);
    ctx.fillStyle = '#100f18'; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 7); ctx.fill();
  }
}, () => toScreenBox([3.3, 1676, 410], [1600, 300, 1760, 520]));

// ---------- the code-drawn thumbnail (the cloud uploads it; the ChatGPT one replaces it from the Mac) ----------
// Its own composition: the ember kitchen at full heat, the devil bent double under the ceiling with its claws round his
// fists, and on the wall his little brother's small shadow growing two tiny horns. RAGE huge top left, IT GROWS under it.
defShot('thumb', (t, p) => {
  const fr = [1.32, 1230, 500];
  fill([30, 8, 6]); cam(...fr);
  kitchenSet(29.5, { heat: 1 });
  const S = kidInBed(1530, 1.05);                                    // Sam's small shadow on the wall, horns and all
  const b = poseBox(S, 0);
  ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = ctx.strokeStyle = 'rgb(30,8,10)'; ctx.lineCap = 'round';
  ctx.translate(1640, 700); ctx.scale(1.15, 1.15); ctx.translate(-(b[0] + b[2]) / 2, -b[3]);
  for (const [pts, w] of S.parts) limb(pts, w);
  ctx.beginPath(); ctx.arc(S.head[0], S.head[1], S.head[2], 0, 7); ctx.fill();
  for (const sd of [-1, 1]) { const bx = S.head[0] + sd * S.head[2] * .45, by = S.head[1] - S.head[2] * .75; ctx.beginPath(); ctx.moveTo(bx - 9, by + 6); ctx.quadraticCurveTo(bx + sd * 8, by - 30, bx + sd * 16, by - 44); ctx.lineTo(bx + 10, by + 4); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  redEyes(1638, 700 - (b[3] - S.head[1]) * 1.15 + 6, 11, 1);
  const M = figPose(1300, FY, 1.1, 1, { lean: .16, hands: [[1350, 640], [1390, 610]] });
  const d = { at: [1060, FY, 1.45], o: { grin: 1, reach: .95, lean: 3, targets: M.hands } }, o = drawDevilBehind(t, fr, d);
  drawFig(M, EXPR.rage, [255, 110, 60], .7, [255, 120, 70]);
  devilFront(t, o);
  redWash(.08);
  px(); drawVignetteFlat(.5); screen();
  const big = (txt, x0, y0, size, track) => {                         // fat white capitals with a red edge
    font(size, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if ('letterSpacing' in ctx) ctx.letterSpacing = track + 'px';
    ctx.shadowColor = 'rgba(255,20,30,.95)'; ctx.shadowBlur = size * .22;
    ctx.lineWidth = size * .16; ctx.strokeStyle = 'rgb(200,10,24)'; ctx.strokeText(txt, x0, y0);
    ctx.shadowBlur = 0; ctx.lineWidth = size * .07; ctx.strokeStyle = '#000'; ctx.strokeText(txt, x0, y0);
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x0, y0);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  };
  big('RAGE', 70, 190, 300, 6);
  big('IT GROWS', 84, 410, 112, 3);
});
