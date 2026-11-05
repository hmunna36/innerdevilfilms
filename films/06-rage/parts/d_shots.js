// ===== RAGE, part D: close-ups (his fist, Sam's face, its face), the hallway, Sam's room, the cracked mirror =====

// ---------- new looks and expressions ----------
LOOKS.ember = { bg: [[86, 36, 18], [150, 72, 34]], fill: [10, 6, 6], light: [255, 180, 110], la: .38, lc: [.55, -.3], glow: 'ember', gl: [1500, 200], ga: .55, rim: [255, 170, 100], turn: .85 };
LOOKS.hot = { bg: [[70, 12, 8], [140, 30, 16]], fill: [10, 4, 4], light: [255, 110, 70], la: .4, lc: [.5, -.2], glow: 'hot', gl: [1500, 260], ga: .6, rim: [255, 100, 60], turn: .85 };
LOOKS.gymdawn = { bg: [[48, 58, 78], [120, 110, 100]], fill: [12, 12, 16], light: [255, 214, 160], la: .4, lc: [.7, -.5], glow: 'dawn', gl: [1700, 120], ga: .6, rim: [255, 214, 160], turn: .85 };
LOOKS.warm = { bg: [[120, 86, 56], [190, 150, 104]], fill: [16, 12, 10], light: [255, 220, 170], la: .42, lc: [.5, -.4], glow: 'lamp', gl: [1500, 160], ga: .5, rim: [255, 214, 160], turn: .85 };
LOOKS.moon = { bg: [[30, 36, 70], [60, 70, 116]], fill: [10, 10, 16], light: [255, 236, 170], la: .34, lc: [.6, .6], glow: 'star', gl: [1500, 1000], ga: .45, rim: [190, 200, 255], turn: .85 };
EXPR.flinch = { lid: 1, brow: .95, browH: .1, smile: -.7, open: .18, grit: .6, gx: 0, gy: 0, tear: .7, sweat: 0 };
EXPR.startle = { lid: 0, brow: .8, browH: .22, smile: -.2, open: .4, grit: 0, gx: -.5, gy: 0, tear: 0, sweat: 0 };
EXPR.look = { lid: .1, brow: .7, browH: .12, smile: -.25, open: .05, grit: 0, gx: -.6, gy: -.4, tear: .5, sweat: 0 };
EXPR.laugh = { lid: .55, brow: .3, browH: .08, smile: 1, open: .45, grit: 0, gx: .3, gy: 0, tear: 0, sweat: 0 };
EXPR.frozen = { lid: 0, brow: .85, browH: .2, smile: -.45, open: .2, grit: 0, gx: -.5, gy: .1, tear: .8, sweat: 0 };
EXPR.shout = { lid: .15, brow: -1, browH: -.12, smile: -.75, open: 1, grit: .9, gx: .3, gy: 0, tear: 0, sweat: .5 };

// ---------- his fist, close: p { claws (0 … 1 its fingers closed round it), open (0 fist … 1 open hand), shake, cold (the
// cold open: its shadow on the wall, the eyes opening), eyesAt, clawsIn [a, b], pry [a, b] (its claws pushed off), look }
function clawFinger(pts, w, a) {             // one of its long fingers, ending in a hooked claw, in the silhouette's three coats
  const outl = stripPts(pts, pts.map((_, i) => w * (1 - .45 * i / (pts.length - 1))));
  const last = pts[pts.length - 1], prev = pts[pts.length - 2], ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]) + .6;
  const claw = [[last[0] - Math.sin(ang) * w * .5, last[1] + Math.cos(ang) * w * .5], [last[0] + Math.cos(ang) * w * 2.6, last[1] + Math.sin(ang) * w * 2.6], [last[0] + Math.sin(ang) * w * .5, last[1] - Math.cos(ang) * w * .5]];
  ctx.save(); ctx.globalAlpha = a; ctx.lineJoin = 'round';
  for (const [col, k] of [[[255, 58, 40], 9], [[100, 10, 12], 3.5], [[9, 4, 6], 0]]) {
    ctx.fillStyle = ctx.strokeStyle = rgba(col);
    for (const poly of [outl, claw]) { ctx.beginPath(); poly.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); if (k) { ctx.lineWidth = 2 * k; ctx.stroke(); } ctx.fill(); }
  }
  ctx.restore();
}
function bigFist(t, x, y, sc, open, rim, la) {  // his hand, big: a fist or (open) the fingers spread
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const dark = [10, 7, 7], lit = mix(dark, rim, .45);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(rim, .8 * la); ctx.lineWidth = 168; line(-900, 330, -40, 60);            // the forearm's rim
  ctx.strokeStyle = rgba(dark); ctx.lineWidth = 150; line(-900, 330, -40, 60);
  ctx.save(); ctx.shadowColor = rgba(rim, .9 * la); ctx.shadowBlur = 40 * VP.k;
  ctx.fillStyle = rgba(dark); rrect(-130, -110, 250, 230, 70); ctx.fill(); ctx.restore();          // the palm
  ctx.strokeStyle = rgba(rim, .55 * la); ctx.lineWidth = 6; rrect(-130, -110, 250, 230, 70); ctx.stroke();
  for (let i = 0; i < 4; i++) {                 // the fingers: curled knuckles … straight
    const bx = -95 + i * 58, by = -100, len = lerp(22, 190 - Math.abs(i - 1.3) * 26, open), ang = -Math.PI / 2 + lerp(.05, (i - 1.5) * .2, open);
    const tx = bx + Math.cos(ang) * len, ty = by + Math.sin(ang) * len;
    ctx.strokeStyle = rgba(rim, .7 * la); ctx.lineWidth = 62; line(bx, by, tx, ty);
    ctx.strokeStyle = rgba(dark); ctx.lineWidth = 54; line(bx, by, tx, ty);
    ctx.strokeStyle = rgba(lit, .8 * la); ctx.lineWidth = 6; line(bx - 18, by + 8, tx - 18, ty + 8);
  }
  const ta = lerp(.9, -.2, open), tl = lerp(150, 170, open);   // the thumb: across the front … out to the side
  ctx.strokeStyle = rgba(rim, .7 * la); ctx.lineWidth = 64; line(-120, 40, -120 + Math.cos(ta) * tl, 40 - Math.sin(ta) * tl * .5 - 60 * open);
  ctx.strokeStyle = rgba(dark); ctx.lineWidth = 56; line(-120, 40, -120 + Math.cos(ta) * tl, 40 - Math.sin(ta) * tl * .5 - 60 * open);
  if (open < .3) { ctx.strokeStyle = rgba(lit, .7 * la); ctx.lineWidth = 5; for (let i = 0; i < 3; i++) line(-60 + i * 58, -70, -60 + i * 58, -20); }
  ctx.restore();
}
defShot('fist', (t, p, L) => {
  const lk = LOOKS[p.look || 'ember'], heat = heatAt(t);
  screen();
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, rgba(lk.bg[1])); g.addColorStop(1, rgba(lk.bg[0]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], lk.gl[0], lk.gl[1], 1100, lk.ga));
  const shake = p.shake ? (Math.sin(t * 61) * 5 + Math.sin(t * 37) * 4) * p.shake : 0;
  const open = typeof p.open === 'function' ? p.open(t, L) : p.open || 0;
  const fx = 820 + shake, fy = 600 + shake * .6;
  if (p.cold) {                                 // its shadow on the wall: the fist's shadow, and above it, eyes opening
    ctx.save(); ctx.globalAlpha = .55; ctx.translate(340, -120); ctx.scale(1.35, 1.35); ctx.translate(-340, 120);
    ctx.fillStyle = 'rgba(20,6,4,1)'; ctx.strokeStyle = 'rgba(20,6,4,1)'; ctx.lineCap = 'round'; ctx.lineWidth = 150;
    line(-500 + shake, 900, 760 + shake, 500); rrect(650 + shake, 380, 270, 240, 70); ctx.fill();
    ctx.restore();
    redEyes(640, 210, 40, win(t, p.eyesAt, 99, .25, 0));
  }
  bigFist(t, fx, fy, 1, open, lk.rim, 1);
  if (p.lines) {                                   // the cold line, typed over the fist (the cold open)
    const a = 1 - inv(p.out[0], p.out[1], t);
    screen(); ctx.fillStyle = `rgba(0,0,0,${.45 * a})`; ctx.fillRect(-W, 0, 3 * W, 300);
    if (!OUT.vertical) p.lines.forEach(([txt, a0, a1], i) => typeLine(txt, 120 + i * 84, 48, inv(a0, a1, t), [236, 226, 214], a, t));
    else { ui(); typeBlock(p.lines.map(([txt, a0, a1]) => [txt, inv(a0, a1, t)]), 560, 64, [236, 226, 214], a, t, OUT.w / 2, 860); }
  }
  // its long fingers close over his knuckles … or are pried off
  const clawK = p.clawsIn ? E.out(inv(p.clawsIn[0], p.clawsIn[1], t)) : (p.claws ?? 0);
  const pry = p.pry ? E.io(inv(p.pry[0], p.pry[1], t)) : 0;
  if (clawK > .01) {
    const ox = pry * 260 + (1 - clawK) * 120, oy = -pry * 420 - (1 - clawK) * 160, a = Math.min(1, clawK * 1.6) * (1 - .8 * pry);
    const P = [fx + 330 + ox, fy - 290 + oy];                       // the back of its hand, its arm going off to the right
    ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
    for (const [col, k] of [[[255, 58, 40], 16], [[100, 10, 12], 7], [[9, 4, 6], 0]]) {
      ctx.strokeStyle = ctx.fillStyle = rgba(col);
      ctx.lineWidth = 120 + 2 * k; line(P[0] + 60, P[1] - 20, P[0] + 900, P[1] - 120);
      ctx.beginPath(); ctx.ellipse(P[0], P[1], 120 + k, 84 + k, -.7, 0, 7); ctx.fill();
    }
    ctx.restore();
    for (let i = 0; i < 4; i++) {
      const kx = fx - 95 + i * 58, ky = fy - 100, root = [P[0] - 110 + i * 34, P[1] + 30 + i * 22];
      const tip = [kx - 26, ky + 30 + clawK * 100];
      const pts = [root, [lerp(root[0], kx, .5) + 26, lerp(root[1], ky, .5) - 50], [kx + 6, ky - 36], tip];
      clawFinger(pts, 24 - i * 1.5, a);
    }
    additive(() => glow(SPR.red, P[0], P[1], 520, .35 * a));
  }
  if (p.cold || clawK > .01) redWash(.06 + .05 * heat);
}, () => [380, 160, 1300, 900]);

// ---------- Sam's face, close: p { look, ex, hands (0 … 1: his hands come up in front of his face) } ----------
const SAM_XY = t => [W / 2 + 40 + Math.sin(t * .9) * 5, H * .47, 230];
defShot('samface', (t, p, L) => {
  const lk = LOOKS[p.look || 'ember'], [x, y, r] = SAM_XY(t), ex = EXPR[p.ex || 'startle'];
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba(lk.bg[0])); g.addColorStop(1, rgba(lk.bg[1]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], lk.gl[0], lk.gl[1], 900, lk.ga));
  const jolt = p.jolt ? Math.max(0, 1 - (L - p.jolt) / .3) * (L > p.jolt ? 1 : 0) : 0;
  const yy = y - 26 * jolt;
  const fillC = [16, 15, 24];
  ctx.fillStyle = rgba(lk.rim, .5); ctx.beginPath(); ctx.arc(x + lk.lc[0] * 8, yy + lk.lc[1] * 8, r + 6, 0, 7); ctx.fill();
  ctx.fillStyle = rgba(fillC);
  ctx.beginPath(); ctx.ellipse(x - 10, yy + r * 1.95, r * 1.2, r * .85, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - r * .26, yy + r * .6, r * .46, r * .7);
  ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill();
  samTuft({ head: [x, yy, r], f: 1 }, fillC);
  face(x, yy, r, ex, { turn: .55, light: lk.light, la: lk.la, lc: lk.lc });
  if (p.crayon !== undefined) {                 // his small hand in front of him, a red crayon in it; it snaps in two
    const sn = t >= p.crayon, k = E.out(inv(p.crayon, p.crayon + .15, t)), hx = x + 70, hy = yy + r * 1.62 - 24 * k;
    ctx.save(); ctx.translate(hx, hy); ctx.scale(1.5, 1.5);
    for (const [sd, dx] of [[-1, -1], [1, 1]]) {
      ctx.save(); ctx.translate(sn ? dx * 22 * k : 0, sn ? -14 * k : 0); ctx.rotate(sn ? dx * .5 * k : 0);
      ctx.fillStyle = 'rgb(220,40,36)'; ctx.fillRect(sd < 0 ? -70 : 0, -11, 70, 22);
      if (sd < 0) { ctx.fillStyle = 'rgb(240,80,70)'; ctx.beginPath(); ctx.moveTo(-70, -11); ctx.lineTo(-92, 0); ctx.lineTo(-70, 11); ctx.fill(); }
      ctx.restore();
    }
    ctx.fillStyle = rgba(lk.rim, .55); ctx.beginPath(); ctx.arc(-6, 6, 44, 0, 7); ctx.fill();
    ctx.fillStyle = rgba(fillC); ctx.beginPath(); ctx.arc(-6, 6, 39, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 50; ctx.lineCap = 'round'; line(-6, 30, 60, 260);
    if (sn && t < p.crayon + .5) { ctx.fillStyle = `rgba(255,120,90,${1 - (t - p.crayon) / .5})`; for (let i = 0; i < 8; i++) { const a = rnd(i + 990) * 6.28, d = (t - p.crayon) * 300; ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d - 10, 5, 5); } }
    ctx.restore();
  }
  const hk = typeof p.hands === 'function' ? p.hands(t, L) : p.hands || 0;
  if (hk > .01) {                               // his small hands come up in front of his face
    for (const sd of [-1, 1]) {
      const hx = x + sd * r * 1.02, hy = lerp(yy + r * 2.4, yy + r * .05, E.out(hk));
      ctx.strokeStyle = rgba(lk.rim, .55); ctx.lineWidth = 66; ctx.lineCap = 'round'; line(hx + sd * 40, hy + 260, hx, hy + 40);
      ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 56; line(hx + sd * 40, hy + 260, hx, hy + 40);
      ctx.fillStyle = rgba(lk.rim, .55); rrect(hx - 44, hy - 56, 88, 120, 36); ctx.fill();
      ctx.fillStyle = rgba(fillC); rrect(hx - 39, hy - 51, 78, 110, 32); ctx.fill();
      ctx.strokeStyle = rgba(fillC); ctx.lineWidth = 17;   // fingers spread
      for (let f = -1.5; f <= 1.5; f++) line(hx + f * 17, hy - 40, hx + f * 24, hy - 92);
      ctx.strokeStyle = rgba(lk.rim, .4); ctx.lineWidth = 3; for (let f = -1.5; f <= 1.5; f++) line(hx + f * 17 + 8, hy - 40, hx + f * 24 + 8, hy - 90);
    }
  }
}, t => { const [x, y, r] = SAM_XY(t); return [x - r * 1.4, y - r * 1.4, x + r * 1.4, y + r * 1.9]; });

// ---------- its face, close, in this film's light: p { at [x, feetY, s], o(t), look, scare, fade [a, b] } ----------
function dfaceFrame(t, p, L) {
  const d = { at: p.at || [700, FY, 1], o: p.o ? p.o(t, L) : { grin: 1 } }, o = devilAt(d), [hx, hy] = devilHead(t, o), s = DEVIL.s;
  return { o, fr: [(p.scare ? 2.15 : 1.5 + .12 * clamp(L / 3)) * DEVIL_FACE_ZOOM / s, hx, hy + (p.scare ? 4 : 16) * s] };
}
defShot('dface', (t, p, L) => {
  const lk = LOOKS[p.look || 'hot'];
  screen();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba(lk.bg[0])); g.addColorStop(1, rgba(lk.bg[1]));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  additive(() => glow(SPR[lk.glow], 400, 160, 900, lk.ga * .8));
  const { o, fr } = dfaceFrame(t, p, L);
  if (p.fade) o.a = 1 - .75 * inv(p.fade[0], p.fade[1], t), o.eyes = Math.max(.3, o.eyes * (1 - .5 * inv(p.fade[0], p.fade[1], t)));
  cam(...fr);
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  redWash(.07 + .05 * Math.sin(t * 5) + (p.scare ? .55 * (1 - inv(0, .2, L)) : 0));
}, (t, p, L) => { const { o, fr } = dfaceFrame(t, p, L), b = devilBox(t, o); return toScreenBox(fr, [b[0], b[1] + 80 * DEVIL.s, b[2], b[3]]); });

// ---------- the stove: the pot boils over; his hand grabs the handle ----------
defShot('stove', (t, p, L) => {
  const heat = heatAt(t);
  fill([30, 14, 8]); cam(2.4, 400, 560);
  kitchenSet(t, { heat });
  const boil = .5 + .5 * Math.sin(t * 14);
  ctx.save(); ctx.translate(385, 600);
  ctx.fillStyle = '#2a2a30'; rrect(-80, -90, 160, 92, 12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,150,.6)'; ctx.lineWidth = 3; rrect(-80, -90, 160, 92, 12); ctx.stroke();
  ctx.fillStyle = '#4a4a54'; ctx.fillRect(-88, -96, 176, 12);
  ctx.fillStyle = '#1a1a1e'; ctx.fillRect(78, -80, 90, 14);
  ctx.fillStyle = rgba([250, 246, 236], .95);   // the foam boils over the rim and down the side
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-76 + i * 19, -98 - 8 * Math.abs(Math.sin(t * 9 + i)), 14 + 4 * boil, 0, 7); ctx.fill(); }
  const run = clamp(L / .9);
  for (const dx of [-70, 40]) { rrect(dx, -92, 22, 70 * run + 10, 10); ctx.fill(); }
  additive(() => { glow(SPR.hot, 0, 4, 140, .6); for (let i = 0; i < 8; i++) { const k = (t * .8 + rnd(i + 900)) % 1; glow(SPR.grey, (rnd(i + 901) - .5) * 160, -110 - k * 320, 70 + 50 * k, .3 * Math.sin(Math.PI * k)); } });
  ctx.restore();
  if (p.grab) {                                 // his hand comes in and grips the handle
    const k = E.out(inv(p.grab, p.grab + .25, t)), hx = lerp(700, 515, k), hy = 520;
    ctx.strokeStyle = 'rgba(255,170,100,.6)'; ctx.lineWidth = 50; ctx.lineCap = 'round'; line(hx + 400, hy + 200, hx, hy);
    ctx.strokeStyle = '#0a0707'; ctx.lineWidth = 42; line(hx + 400, hy + 200, hx, hy);
    ctx.fillStyle = '#0a0707'; ctx.beginPath(); ctx.arc(hx, hy, 30, 0, 7); ctx.fill();
  }
}, () => toScreenBox([2.4, 400, 560], [250, 380, 620, 640]));

// ---------- the table, close: the juice tips over his phone ----------
defShot('table', (t, p, L) => {
  const calm = t >= TURN;
  fill([30, 14, 8]); cam(2.3, 1150, 640);
  kitchenSet(t, { heat: heatAt(t), calm });
  if (p.hand) {                                 // Sam's small arm reaches for the glass, or his elbow knocks it
    const tip = t >= TURN ? T_SPILL2 : T_SPILL, k = E.io(inv(tip - .6, tip - .05, t)), back = E.io(inv(tip + .1, tip + .5, t)), hx = lerp(1330, 1222, k) + 70 * back, hy = 668 - 6 * Math.sin(Math.PI * k);
    const ex = 1420, ey = 676;                    // his forearm along the table top, from the right edge; a small hand
    ctx.strokeStyle = 'rgba(255,190,130,.5)'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1640, 664); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = '#100f18'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(1640, 664); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = '#100f18'; ctx.beginPath(); ctx.ellipse(hx - 4, hy, 15, 11, 0, 0, 7); ctx.fill();
  }
  if (p.leap !== undefined && t > p.leap - .05) {   // DAY 12: small now, it leaps up from under the table at him
    const k = E.out(inv(p.leap, p.leap + .45, t)), s2 = lerp(.18, .42, k);
    placeDevil([lerp(1180, 1110, k), lerp(980, 820, k) + 200 * s2, s2]);
    const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .4, reach: .6, targets: [[1060, 600 - 200 * k], [1200, 580 - 200 * k]] });
    drawDevil(t, [2.3, 1150, 640], o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
  }
}, () => toScreenBox([2.3, 1150, 640], [1000, 560, 1300, 720]));

// ---------- Sam's empty chair: the snapped crayon on his paper, the lamp's light still swinging over it ----------
defShot('chair', (t, p, L) => {
  const fr = [2.2, 1310, 640];
  fill([30, 14, 8]); cam(...fr);
  kitchenSet(t, { heat: heatAt(t) });
  for (const [dx, a] of [[-18, -.5], [16, .35]]) { ctx.save(); ctx.translate(1290 + dx, 696); ctx.rotate(a); ctx.fillStyle = 'rgb(220,40,36)'; ctx.fillRect(-14, -3, 28, 6); ctx.restore(); }
  const sw = Math.sin((t - T_SHOUT) * 5.2) * .5;                                     // the light sweeps back and forth
  additive(() => glow(SPR.lamp, 1310 + sw * 260, 690, 300, .35));
  screen(); const g = ctx.createLinearGradient(0, 0, W, 0); const c = clamp(.5 + sw * .5);
  g.addColorStop(0, `rgba(0,0,0,${.35 * c})`); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.35 * (1 - c)})`); ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
}, () => toScreenBox([2.2, 1310, 640], [1180, 520, 1440, 780]));
// ---------- the hole in the wall: dust still falling; in its dark, one of its eyes opens ----------
defShot('hole', (t, p, L) => {
  const fr = [3.6, HOLE[0], HOLE[1] + 10];
  fill([30, 14, 8]); cam(...fr);
  kitchenSet(t, { heat: heatAt(t) });
  const e = E.out(inv(p.eye, p.eye + .3, t)), fl = .85 + .15 * Math.sin(t * 23);
  if (e > .01) {
    additive(() => { glow(SPR.red, HOLE[0] + 6, HOLE[1] + 2, 60, .9 * e * fl); glow(SPR.amber, HOLE[0] + 6, HOLE[1] + 2, 16, .9 * e); });
    ctx.save(); ctx.translate(HOLE[0] - 12, HOLE[1] + 4); ctx.scale(.62, .62 * (.2 + .8 * e)); eyeShape(ctx, 1, e * fl); ctx.restore();
  }
}, () => toScreenBox([3.6, HOLE[0], HOLE[1] + 10], [HOLE[0] - 120, HOLE[1] - 110, HOLE[0] + 120, HOLE[1] + 110]));

// ---------- Sam's drawing on the floor in the dust ----------
defShot('drawing', (t, p, L) => {
  fill([40, 16, 10]); screen();
  const g = ctx.createRadialGradient(960, 500, 100, 960, 540, 1100); g.addColorStop(0, rgba(shade(roomCol(heatAt(t), 1), .8))); g.addColorStop(1, rgba(shade(roomCol(heatAt(t), 0), .5)));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 4; for (let i = -6; i < 12; i++) line(i * 260, 0, i * 260 - 300, H);
  ctx.save(); ctx.translate(960, 560); ctx.rotate(-.12); crayonDrawing(0, 0, 6.4, 1); ctx.restore();
  ctx.fillStyle = 'rgba(235,215,195,.5)';          // plaster dust settling on it
  for (let i = 0; i < 70; i++) { const y = ((rnd(i + 950) * 1300 + L * (60 + 80 * rnd(i + 951))) % 1300) - 120; ctx.beginPath(); ctx.arc(rnd(i + 952) * W, y, 2 + 5 * rnd(i + 953), 0, 7); ctx.fill(); }
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(230,210,190,${.35 + .3 * rnd(i + 960)})`; ctx.beginPath(); ctx.arc(560 + rnd(i + 961) * 800, 260 + rnd(i + 962) * 560, 4 + 10 * rnd(i + 963), 0, 7); ctx.fill(); }
}, () => [560, 260, 1360, 860]);

// ---------- the hallway ----------
// p: fr, man(t, L), dev(t, L), blows [t…], ripAt, crackAt, door ('off'), calm, light
defShot('hall', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t), calm = t >= TURN;
  fill([20, 10, 8]); cam(...fr);
  hallSet(t, { heat, calm, flick: p.flick, crackAt: p.crackAt ?? (t >= T_CRACK && t < TURN ? T_CRACK : undefined), ajar: p.ajar ? p.ajar(t, L) : 0, light: p.light });
  const rim = calm ? [255, 214, 160] : mix([255, 196, 120], [255, 90, 50], heat);
  const M = p.man ? p.man(t, L) : null, S = p.sam ? p.sam(t, L) : null;
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  if (S) drawFig(S, EXPR[p.samEx || 'smile'], rim, .5, rim);
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), rim, .55, rim, { lx: -1, ly: -.6 });
  if (p.fix && M) heldDoor(t, M, p.fix);
  if (o) devilFront(t, o);
  if (o && p.through) {                            // its head has gone up through the ceiling: broken plaster over its horns
    const [hx, hy] = devilHead(t, o), s2 = DEVIL.s, cy = CY + 18 * s2, heat = heatAt(t), lo = roomCol(heat, 0, false), hi2 = roomCol(heat, 1, false);
    ctx.fillStyle = rgba(shade(lo, .55)); ctx.beginPath(); ctx.moveTo(-W, -H); ctx.lineTo(3 * W, -H); ctx.lineTo(3 * W, CY);
    ctx.lineTo(hx + 210 * s2, CY); for (let i = 0; i <= 16; i++) { const u = i / 16, x = hx + (1.6 - 3.2 * u) * 130 * s2, y = lerp(CY, cy, Math.sin(Math.PI * u) ** .5) + (rnd(i + 600) - .5) * 26; ctx.lineTo(x, y); }
    ctx.lineTo(-W, CY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(shade(hi2, .85)); ctx.fillRect(-W, CY, hx + 200 * s2 - 220 * s2 + W - 40 * s2, 6); ctx.fillRect(hx + 210 * s2, CY, 3 * W, 6);
    ctx.strokeStyle = 'rgba(250,224,200,.7)'; ctx.lineWidth = 4;
    for (let i = 0; i < 14; i++) { const sd = i % 2 ? 1 : -1, x0 = hx + sd * (110 + 70 * rnd(i + 610)) * s2, r = 60 + 90 * rnd(i + 620); line(x0, CY + 2, x0 + sd * r, CY - 30 - 40 * rnd(i + 630)); }
    ctx.fillStyle = 'rgba(230,200,180,.6)'; for (let i = 0; i < 20; i++) { const d = (t * .6 + rnd(i + 640)) % 1; ctx.fillRect(hx + (rnd(i + 650) - .5) * 360 * s2, CY + d * 700, 5, 5); }
  }
  if (o && p.gouge) for (const sd of [-1, 1]) {   // where its horns dig into the ceiling: cracked plaster
    const [hx, hy] = headPt(t, o, sd * 62, -126);
    if (hy < CY + 60) { const cy = CY + 4; ctx.fillStyle = 'rgba(20,6,4,.95)'; ctx.beginPath(); ctx.ellipse(hx, cy, 26, 10, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(250,220,200,.75)'; ctx.lineWidth = 4; for (let i = 0; i < 7; i++) { const a = Math.PI * (.05 + .9 * rnd(i + 470 + sd)), r = 40 + 60 * rnd(i + 480 + sd); line(hx, cy, hx + Math.cos(a) * r * sd, cy - Math.sin(a) * r * .6); }
      ctx.fillStyle = 'rgba(230,200,180,.5)'; for (let i = 0; i < 6; i++) { const d = (t * .7 + rnd(i + 490 + sd)) % 1; ctx.fillRect(hx + (rnd(i + 495) - .5) * 40, cy + d * 300, 4, 4); } }
  }
  if (o && o.a > .3) redWash(.08 * o.a);
}, (t, p, L) => {
  const fr = p.fr || [1, 960, 540], M = p.man ? p.man(t, L) : null;
  return toScreenBox(fr, M ? unionBox(poseBox(M, 40), [880, 300, 1150, 880]) : [700, 260, 1500, 900]);
});
// fixing the door: he holds it up in the frame while Sam (beside him) holds the screws
function heldDoor(t, M, fix) {
  const [dx, dy, dw, dh] = HALL.door, k = E.io(inv(fix[0], fix[1], t));
  ctx.save(); ctx.translate(dx + dw, dy + dh); ctx.rotate(.18 * (1 - k)); ctx.translate(-(dx + dw), -(dy + dh) - 20 * (1 - k));
  ctx.fillStyle = rgba([196, 150, 110]); ctx.fillRect(dx, dy, dw, dh);
  ctx.strokeStyle = 'rgba(255,230,190,.6)'; ctx.lineWidth = 4; ctx.strokeRect(dx + 26, dy + 30, dw - 52, dh * .4); ctx.strokeRect(dx + 26, dy + dh * .5, dw - 52, dh * .42);
  samSign(dx + dw / 2, dy + 110, 1, 1);
  ctx.restore();
}

// ---------- Sam's room ----------
// p: fr, sam(t, L) pose, samEx, man(t, L), manShadow (his long shadow across the floor from the door), dev(t, L),
// horns [a, b] (horns grow on Sam's shadow), crumble [a, b], doorLight
const SAM_AT = [1060, FY, 1.05];
function samShadow(t, P, p, a = .62) {          // Sam's shadow, thrown up the wall by the night-light at his feet
  const [nx, ny] = ROOM_S.nl, b = poseBox(P, 0), cx = (b[0] + b[2]) / 2, k = 1.6;
  const tx = cx + 120, ty = b[3] - 20;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(tx, ty); ctx.scale(k, k * 1.05); ctx.translate(-cx, -b[3]);
  ctx.strokeStyle = ctx.fillStyle = 'rgb(14,14,30)'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [pts, w] of P.parts) limb(pts, w);
  ctx.beginPath(); ctx.arc(P.head[0], P.head[1], P.head[2], 0, 7); ctx.fill();
  const hk = p.horns ? E.out(inv(p.horns[0], p.horns[1], t)) * (1 - (p.crumble ? inv(p.crumble[0], p.crumble[1], t) : 0)) : 0;
  const [hx, hy, r] = P.head;
  if (hk > .01) for (const sd of [-1, 1]) {      // two little horns grow out of the shadow's head
    const bx = hx + sd * r * .45, by = hy - r * .75, cr = p.crumble ? inv(p.crumble[0], p.crumble[1], t) : 0;
    ctx.beginPath(); ctx.moveTo(bx - 9, by + 6); ctx.quadraticCurveTo(bx + sd * 8, by - 30 * hk, bx + sd * 16, by - 44 * hk + cr * 30); ctx.lineTo(bx + 10, by + 4); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const e = p.horns ? inv(p.horns[0] + .25, p.horns[1] + .25, t) * (1 - (p.crumble ? inv(p.crumble[0], p.crumble[0] + .4, t) : 0)) : 0;
  const ex = tx + (hx - cx) * k, ey = ty + (hy - b[3]) * k * 1.05;
  if (e > .01) {
    redEyes(ex + 6, ey + 8, 15, e);
    if (p.grin && t > p.grin) {                   // and a small grin, starting
      const gk = E.out(inv(p.grin, p.grin + .8, t)) * e;
      ctx.save(); ctx.translate(ex + 8, ey + 44); ctx.fillStyle = rgba([255, 110, 60], gk);
      ctx.beginPath(); ctx.moveTo(-26 * gk, 0); ctx.quadraticCurveTo(0, 22 * gk, 26 * gk, 0); ctx.quadraticCurveTo(0, 8 * gk, -26 * gk, 0); ctx.fill();
      ctx.fillStyle = rgba([255, 250, 240], gk); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 9 - 4, 3); ctx.lineTo(i * 9 + 4, 3); ctx.lineTo(i * 9, 11 * gk); ctx.fill(); }
      ctx.restore();
    }
    additive(() => glow(SPR.red, ex, ey + 10, 120, .4 * e));
  }
  return [ex, ey];
}
function kidInBed(x, s, look = 0) {             // Sam sitting up in his bed (the mattress at y 700), facing the door at the left
  const hip = [x, 704], sh = [x - 6 * s, 704 - 120 * s], hd = [sh[0] - 8 * s - 10 * look * s, sh[1] - 62 * s];
  return { head: [hd[0], hd[1], 50 * s], hand: [sh[0] - 40 * s, sh[1] + 60 * s], hands: [[sh[0] - 30 * s, sh[1] + 50 * s], [sh[0] - 50 * s, sh[1] + 56 * s]], f: -1, kid: true, sh, hip,
    parts: [[[hip, sh], 50 * s], [[[sh[0], sh[1] + 10 * s], [sh[0] - 36 * s, sh[1] + 40 * s], [sh[0] - 40 * s, sh[1] + 60 * s]], 18 * s]] };
}
function bedBlanket(P, lower, s) {               // the quilt over his knees, pulled up to his eyes (or down to his chest)
  const [hx, hy, r] = P.head, top = lerp(hy + r * .1, P.sh[1] + 30 * s, lower);
  ctx.fillStyle = 'rgb(150,120,190)'; ctx.strokeStyle = 'rgba(230,220,255,.6)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(hx - r * 1.5, 706); ctx.quadraticCurveTo(hx - r * 1.45, top - 6, hx - r * .2, top);
  ctx.quadraticCurveTo(hx + r * 1.4, top - 4, hx + r * 1.6, top + 50); ctx.quadraticCurveTo(hx + r * 2.6, 640, hx + r * 6, 690); ctx.lineTo(hx + r * 6, 712); ctx.lineTo(hx - r * 1.5, 712); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(90,70,140,.6)'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) line(hx - r * 1.2 + i * r * 1.6, top + 20, hx - r * 1.3 + i * r * 1.7, 706);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 5; i++) { starPath(hx - r + i * r * 1.3, top + 40 + (i % 2) * 30, 7); ctx.fill(); }
}
defShot('samroom', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], heat = heatAt(t);
  fill([10, 10, 20]); cam(...fr);
  samRoomSet(t, { doorLight: p.doorLight ?? 1, heat, light: p.light, shut: p.shut !== false, ajar: p.ajar ? p.ajar(t, L) : 0 });
  const bed = p.bed !== false, look = p.look ? p.look(t, L) : 0;
  const S = p.sam ? p.sam(t, L) : bed ? kidInBed(1290, 1.05, look) : kidCrouch(SAM_AT[0], SAM_AT[1], SAM_AT[2], -1, p.hands ?? 0, look);
  samShadow(t, S, p);
  if (p.manShadow) {                            // his long shadow across the floor, from the doorway to Sam
    const k = typeof p.manShadow === 'function' ? p.manShadow(t, L) : p.manShadow;
    ctx.fillStyle = `rgba(8,4,6,${.75 * k})`; ctx.beginPath(); ctx.moveTo(60, FY); ctx.lineTo(160, FY); ctx.lineTo(1040, FY + 60); ctx.lineTo(1100, FY + 20); ctx.lineTo(1000, FY - 10); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(1000, FY + 30, 60, 26, 0, 0, 7); ctx.fill();
  }
  const M = p.man ? p.man(t, L) : null;
  let o = null;
  if (p.dev) { const d = p.dev(t, L); if (M && d.o && d.o.reach && !d.o.targets) d.o.targets = M.hands; o = drawDevilBehind(t, fr, d); }
  const rimS = [190, 200, 255];
  drawFig(S, typeof p.samEx === 'function' ? p.samEx(t, L) : EXPR[p.samEx || (bed ? 'frozen' : 'flinch')], [255, 230, 160], .55, [255, 236, 170], { lx: -.5, ly: .4, lc: [-.4, .6] });
  if (M) drawFig(M, p.ex ? EXPR[p.ex] : exprAt(t), mix([255, 150, 80], rimS, .5), .6, [255, 214, 170], { lx: -1, ly: -.2, open: true });
  if (bed) bedBlanket(S, p.lower ? p.lower(t, L) : 0, 1.05);
  else if (p.blanket !== false) blanketOn(S);
  if (M && p.palms) palmsUp(M, p.palms);
  if (o) devilFront(t, o);
  if (o && o.a > .3) redWash(.07 * o.a);
}, (t, p, L) => toScreenBox(p.fr || [1, 960, 540], p.man ? unionBox(poseBox(p.man(t, L), 40), [1000, 600, 1300, 900]) : [700, 300, 1500, 900]));
// Sam's blanket round his shoulders, down to the floor
function blanketOn(P) {
  const [hx, hy, r] = P.head, f = P.f || 1, bx = hx - f * r * .2, fy = FY;
  ctx.fillStyle = 'rgb(92,84,150)'; ctx.strokeStyle = 'rgba(200,190,255,.55)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(bx - f * r * .9, hy - r * .55);
  ctx.quadraticCurveTo(bx - f * r * 1.9, hy + r * .8, bx - f * r * 2.2, fy);
  ctx.lineTo(bx + f * r * 1.7, fy); ctx.quadraticCurveTo(bx + f * r * 1.5, hy + r * 1.6, bx + f * r * .6, hy + r * .9);
  ctx.quadraticCurveTo(bx, hy + r * .3, bx - f * r * .9, hy - r * .55); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,36,80,.6)'; ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(bx - f * r * (.6 + i * .4), hy + r * (.6 + i * .3)); ctx.quadraticCurveTo(bx - f * r * (1 + i * .3), hy + r * 1.8, bx - f * r * (1.1 + i * .3), fy - 10); ctx.stroke(); }
}
// open hands, palms up: a small cream-lit flat on each hand
function palmsUp(M, a) {
  for (const h of M.hands) { ctx.fillStyle = rgba([255, 214, 170], .5 * a); ctx.beginPath(); ctx.ellipse(h[0] + 12, h[1] - 6, 26, 10, -.1, 0, 7); ctx.fill(); ctx.fillStyle = '#0b0809'; ctx.beginPath(); ctx.ellipse(h[0] + 12, h[1], 24, 9, -.1, 0, 7); ctx.fill(); }
}

// ---------- the cracked hall mirror: his reflection, then IT in every shard ----------
// p: { appear (when it is IT), z }
const MIR = [260, 40, 1400, 1000], CR = [1330, 760];
function mirrorShards() {
  const pts = [], n = 11;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + rnd(i + 500) * .4;
    pts.push([CR[0] + Math.cos(a) * 2600, CR[1] + Math.sin(a) * 2600]);
  }
  return pts.map((q, i) => [CR, q, pts[(i + 1) % n]]);
}
// the shards: each piece of glass shows the picture a little out of place; then the frame and the cracks
function shardsAndFrame(z, red) {
  px();
  const sh = mirrorShards(), k = VP.k, map = q => [((q[0] - W / 2) * z * PUSH + W / 2 + SHX) * k + VP.x, ((q[1] - H / 2) * z * PUSH + H / 2 + SHY) * k + VP.y];
  sh.forEach((tri, i) => {
    const dx = (rnd(i + 520) - .5) * 26 * k, dy = (rnd(i + 521) - .5) * 18 * k;
    ctx.save(); ctx.beginPath(); tri.map(map).forEach((q, j) => j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
    ctx.globalAlpha = .9; ctx.drawImage(cv, dx, dy); ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(255,255,255,${.03 + .05 * rnd(i + 522)})`; ctx.fillRect(0, 0, OUT.w, OUT.h);
    ctx.restore();
  });
  screen(); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.fillStyle = '#2e1a12'; ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(255,170,110,.35)'; ctx.lineWidth = 6; ctx.strokeRect(MIR[0] - 3, MIR[1] - 3, MIR[2] + 6, MIR[3] + 6);
  crackLines(CR[0], CR[1], MIR, 1, 1, 2.6);
  ctx.restore();
  if (red) redWash(red);
}
// p: { seq: [[shot, p, at]…], step } the night flashing past in the glass; or { appear (when it is IT), lower [a, b]
// (his fist comes down; its claw comes down in step), z }
defShot('cracked', (t, p, L) => {
  const z = p.z || 1;
  if (p.seq) {                                   // the montage: the night, a cut every step, inside the broken glass
    const st = p.step || .33, k = Math.floor(L / st), sub = L - k * st, [name, q, at] = p.seq[Math.min(k, p.seq.length - 1)];
    if (name === 'black') fill([2, 2, 3]); else SHOT[name].draw(at + sub, q, .4 + sub);
    PUSH = 1 + .07 * clamp(L / 3);
    shardsAndFrame(z, .06 + .1 * (k % 2));
    return;
  }
  fill([16, 8, 6]); screen();
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.beginPath(); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.clip();
  const g = ctx.createLinearGradient(0, MIR[1], 0, MIR[1] + MIR[3]); g.addColorStop(0, '#5a2414'); g.addColorStop(.7, '#2a120b'); g.addColorStop(1, '#0d0605');
  ctx.fillStyle = g; ctx.fillRect(MIR[0], MIR[1], MIR[2], MIR[3]);
  additive(() => glow(SPR.hot, 1500, 260, 700, .55));
  ctx.fillStyle = 'rgba(255,170,110,.12)'; ctx.fillRect(1380, 120, 120, 300);       // the sconce, reflected
  ctx.restore();
  const low = p.lower ? E.io(inv(p.lower[0], p.lower[1], t)) : 1, fist = [1250, lerp(380, 820, low)];
  const it = p.appear !== undefined && t >= p.appear, flick = p.appear !== undefined && t > p.appear - .45 && t < p.appear && Math.sin(t * 70) > 0;
  ctx.save(); screen(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.beginPath(); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.clip();
  if (it || flick) {
    const s = 2.7; placeDevil([960 - 40 * s, 470 + 830 * s, s]);
    const [hx, hy] = devilHead(t, devilO({}));
    const o = devilO({ a: 1, eyes: 1, grin: it ? E.out(inv(p.appear, p.appear + .5, t)) : .3, reach: 1, targets: [[hx - 330, hy + 900], fist] });
    ctx.restore();
    const fr = [z, W / 2 - (W / 2) * 0, H / 2];
    drawDevil(t, [z, W / 2, H / 2], o); devilArms(t, o); devilEyes(t, o); devilGrin(t, o);
    screen(); ctx.save();
    ctx.fillStyle = '#2e1a12'; ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.rect(MIR[0], MIR[1], MIR[2], MIR[3]); ctx.fill('evenodd');
  } else {                                       // him, facing the glass, his fist up by his face, coming down
    const x = 960, y = 470, r = 170;
    ctx.fillStyle = 'rgba(255,120,70,.55)'; ctx.beginPath(); ctx.arc(x + 6, y - 6, r + 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#0c0808'; ctx.beginPath(); ctx.ellipse(x, y + r * 2.1, r * 1.8, r * 1.2, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - r * .33, y + r * .5, r * .62, r * .9);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    face(x, y, r, exprAt(t), { turn: 0, light: [255, 140, 90], la: .35, lc: [.3, -.5] });
    ctx.strokeStyle = 'rgba(255,120,70,.6)'; ctx.lineCap = 'round'; ctx.lineWidth = 98; line(1190, 980, fist[0], fist[1] + 40);
    ctx.strokeStyle = '#0c0808'; ctx.lineWidth = 86; line(1190, 980, fist[0], fist[1] + 40);
    ctx.fillStyle = '#0c0808'; rrect(fist[0] - 70, fist[1] - 60, 140, 120, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,140,90,.6)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) line(fist[0] - 40 + i * 40, fist[1] - 50, fist[0] - 40 + i * 40, fist[1] - 20);
  }
  ctx.restore();
  shardsAndFrame(z, it ? .05 : 0);
  screen(); const dg = ctx.createLinearGradient(0, 760, 0, 1080); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, 'rgba(0,0,0,.7)'); ctx.fillStyle = dg; ctx.fillRect(-W, 760, 3 * W, 2 * H);
}, () => [460, 100, 1460, 1000]);

// ---------- a montage of flashes back: p { step, word, seq: [[shot, p, at]…] } (at: the film time to draw it at) ----------
function montageItem(p, L) { const st = p.step || .375, k = Math.floor(L / st); return { k, sub: L - k * st, it: p.seq[Math.min(k, p.seq.length - 1)] }; }
defShot('flash', (t, p, L) => {
  const { k, sub, it } = montageItem(p, L), [name, q, at] = it;
  if (name === 'black') fill([2, 2, 3]);
  else SHOT[name].draw(at !== undefined ? at + sub : t, q, (at !== undefined ? .4 : 0) + sub);
  if (!p.word) return;
  font(OUT.vertical ? 60 : 46, SERIF, '400', 'italic'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = rgba(C.red, .8); ctx.shadowBlur = 16; ctx.fillStyle = rgba([255, 120, 110], .9);
  if (!OUT.vertical) { screen(); ctx.fillText(p.word, 300 + rnd(k + 40) * 1300, 200 + rnd(k + 41) * 640); }
  else { ui(); ctx.fillText(p.word, 260 + rnd(k + 40) * 470, 470 + rnd(k + 41) * 1050); }
  ctx.shadowBlur = 0;
}, (t, p, L) => { const { sub, it } = montageItem(p, L), [name, q, at] = it; const S = SHOT[name]; return S && S.subject ? S.subject(at !== undefined ? at + sub : t, q, sub) : null; });

// ---------- his phone's lock screen (the film's 'vice' screen: here it is the photo of Sam on his shoulders) ----------
function lockScreen(x, y, w, h, s, t, a, dy = 0) {
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba([250, 170, 100], a)); g.addColorStop(.6, rgba([220, 100, 90], a)); g.addColorStop(1, rgba([70, 40, 70], a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.translate(0, dy * s);
  ctx.fillStyle = rgba([255, 236, 190], .9 * a); ctx.beginPath(); ctx.arc(x + w * .7, y + h * .58, 60 * s, 0, 7); ctx.fill();   // the sun
  ctx.fillStyle = rgba([40, 26, 40], a); ctx.fillRect(x, y + h * .78, w, h * .3);                                               // a hill
  const by = y + h * .78, k = s * .9;                                                                           // Mom, him, Sam
  ctx.strokeStyle = ctx.fillStyle = rgba([30, 18, 28], a); ctx.lineCap = 'round';
  const fig = (bx, sc, bun) => {
    ctx.lineWidth = 30 * k * sc; line(bx, by, bx, by - 150 * k * sc);
    ctx.lineWidth = 16 * k * sc; line(bx - 8 * k * sc, by - 136 * k * sc, bx - 30 * k * sc, by - 60 * k * sc); line(bx + 8 * k * sc, by - 136 * k * sc, bx + 30 * k * sc, by - 60 * k * sc);
    ctx.beginPath(); ctx.arc(bx, by - 188 * k * sc, 30 * k * sc, 0, 7); ctx.fill();
    if (bun) { ctx.beginPath(); ctx.arc(bx - 20 * k * sc, by - 214 * k * sc, 15 * k * sc, 0, 7); ctx.fill(); }
  };
  fig(x + w * .27, .92, true); fig(x + w * .5, 1.05, false); fig(x + w * .7, .6, false);
  ctx.translate(0, -dy * s);
  font(96 * s, SANS, '300'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([255, 255, 255], .92 * a);
  ctx.fillText(statusAt(t), x + w / 2, y + 150 * s);
  const n = CUR.p && CUR.p.lock;                 // a notification on the lock screen, under the clock (it hides nothing)
  if (n && t >= n.at) {
    const k = E.out(inv(n.at, n.at + .3, t)), out = n.swipe ? E.io(inv(n.swipe, n.swipe + .35, t)) : 0;
    const bx = x + 22 * s + out * w, by = y + (236 + 20 * (1 - k)) * s, bw = w - 44 * s, bh = 168 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(28,24,30,.9)'; rrect(bx, by, bw, bh, 26 * s); ctx.fill();
    ctx.fillStyle = rgba(n.col || [76, 200, 120]); rrect(bx + 18 * s, by + 20 * s, 54 * s, 54 * s, 13 * s); ctx.fill();
    icon(n.icon || 'heart', bx + 45 * s, by + 49 * s, 54 * s);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    font(28 * s, SANS, '700'); ctx.fillStyle = rgba(C.cream); ctx.fillText(n.title, bx + 88 * s, by + 46 * s);
    font(29 * s, SANS, '500'); const rows = wrapText(n.text.replace(' ♥', ''), bw - 60 * s);
    rows.forEach((r, i) => { const last = i === rows.length - 1 && n.text.endsWith('♥'); textHeart(r + (last ? ' ♥' : ''), bx + 24 * s, by + (102 + i * 38) * s, 29 * s, C.cream, .95); });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
// this film's chat: the engine's bubbles at about twice the size, long lines wrapped
chatScreen = function (f, L, c) {                // eslint-disable-line no-global-assign
  const { s, w, h, x, y } = f;
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = '#0c0d12'; ctx.fillRect(x, y, w, h);
  font(34 * s, SANS, '700'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream); ctx.fillText(c.name, x + w / 2, y + 74 * s);
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x, y + 112 * s, w, 2 * s);
  for (const it of c.items) {
    if (it.until !== undefined && L >= it.until) continue;
    if (it.text === '•••' && L < it.at) continue;
    const fd = it.fade ?? .2, a = it.at < 0 ? (it.dim ? .55 : 1) : fd <= 0 ? (L >= it.at ? 1 : 0) : inv(it.at, it.at + fd, L);
    if (a <= .01) continue;
    font(29 * s, SANS, '500');
    const heart = it.text.endsWith('♥'), body = heart ? it.text.slice(0, -1).trimEnd() : it.text;
    const rows = wrapText(body, w * .66), tw = Math.max(...rows.map(r => ctx.measureText(r).width)) + (heart ? 40 * s : 0), bw = tw + 40 * s, bh = (22 + rows.length * 38) * s;
    const bx = it.me ? x + w - 22 * s - bw : x + 22 * s, by = y + it.y * s;
    ctx.fillStyle = rgba(it.col || (it.me ? [40, 110, 230] : [58, 58, 66]), a); rrect(bx, by, bw, bh, 26 * s); ctx.fill();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    rows.forEach((r, i) => { ctx.fillStyle = rgba(C.cream, a); ctx.fillText(r, bx + 20 * s, by + (30 + i * 38) * s); });
    if (heart) icon('heart', bx + 20 * s + ctx.measureText(rows[rows.length - 1]).width + 22 * s, by + (30 + (rows.length - 1) * 38) * s + 2 * s, 30 * s, [255, 90, 120], a);
  }
  ctx.restore();
};
const STATUS = [[0, '7:03'], [18.1, '7:49'], [26.3, '8:32'], [61.0, '9:41'], [TURN, '8:15']];
const statusAt = t => { let s = STATUS[0][1]; for (const q of STATUS) if (t >= q[0]) s = q[1]; return s; };
