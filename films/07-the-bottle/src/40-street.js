// ---------- THE STREET: his phone in his hand, the bar's door from across the street, the run, the walk into the sun ----------
// World px, about 1920 x 1080. Every top-level name starts with `str`.
// Shots: phonehand · bardoor (p.mode 'beckon' | 'offer' | 'after' | 'eyes') · runside · puddle · runface · walkawaypic
const STR = {
  base: 700, kerb: 884, door: [800, 232, 1120, 700], sign: [960, 128], win: [1262, 326, 1572, 560],
  blue: [120, 165, 255], neon: [255, 132, 52], neonT: [70, 232, 212], glass: [832, 792]
};

// ---------- small things of this part ----------
// limbs alone, lit the way drawPerson lights him: parts [[pts, width], …]; the rim sits on the side the light comes from
function strLimbs(parts, fillc, rim, a, lx, ly, soft = 16) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.hypot(lx, ly) || 1, ux = lx / n, uy = ly / n, hi = mix(fillc, rim, .32);
  if (a > .003) {
    ctx.save(); ctx.shadowColor = rgba(rim, Math.min(1, a)); ctx.shadowBlur = soft * pxPerUnit(ctx);
    for (const [pts, w] of parts) stroke(pts.map(q => [q[0] + ux * 5, q[1] + uy * 5]), w + 3, rgba(rim, Math.min(1, a * 1.3)));
    ctx.restore();
  }
  for (const [pts, w] of parts) {
    stroke(pts, w, rgba(fillc));
    if (a > .003) stroke(pts.map(q => [q[0] + ux * w * .24, q[1] + uy * w * .24]), w * .24, rgba(hi, .5 * Math.min(1, a * 1.3)));
  }
}
// draw fn mirrored in the wet ground line y (a figure's own reflection, where wet() cannot reach)
function strMirror(y, a, fn) { ctx.save(); ctx.translate(0, 2 * y); ctx.scale(1, -1); ctx.globalAlpha *= a; fn(); ctx.restore(); }
// a bump: 0 … 1 … 0 round c, half-width w
const strBump = (x, c, w) => { const k = clamp(1 - Math.abs(x - c) / w); return k * k * (3 - 2 * k); };
// one long clawed finger from base along ang: curl 0 straight … 1 hooked; side -1 hooks anticlockwise
function strFinger(base, ang, len, curl, side, s) {
  const dir = k => [Math.cos(k), Math.sin(k)], a1 = ang + curl * .7 * side, k1 = v2.add(base, v2.mul(dir(a1), len * .4));
  const a2 = a1 + (.12 + curl * 1.35) * side, k2 = v2.add(k1, v2.mul(dir(a2), len * .33)), a3 = a2 + (.2 + curl * 1.0) * side, tip = v2.add(k2, v2.mul(dir(a3), len * .3));
  const q = stripPts([base, k1, k2, tip], [7.5 * s, 6.4 * s, 5 * s, .7 * s]);
  ctx.save(); ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(255,40,30,.9)'; ctx.shadowBlur = 14 * pxPerUnit(ctx);
  for (const [col, k] of [[TWIN_COL.rim, 3.4 * s], [TWIN_COL.edge, 1.3 * s], [TWIN_COL.body, 0]]) {
    ctx.fillStyle = ctx.strokeStyle = rgba(col); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (const r of q.slice(1)) ctx.lineTo(r[0], r[1]); ctx.closePath();
    if (k > 0) { ctx.lineWidth = 2 * k; ctx.stroke(); } ctx.fill(); ctx.shadowBlur = 0;
  }
  for (const c of [k1, k2]) disc(c[0], c[1], 5.6 * s, rgba(TWIN_COL.body));
  ctx.restore();
}
// Lily's legs start at her coat's hem (the kit draws the near leg from the hip, over the coat)
function strHem(P) {
  const hy = P.sh[1] + (P.hip[1] - P.sh[1]) * 1.4;
  P.legs = P.legs.map(([h, k, f]) => {
    if (f[1] <= hy) return [f, f, f];
    const cut = (a, b) => { const q = (hy - a[1]) / Math.max(.001, b[1] - a[1]); return [lerp(a[0], b[0], q), hy]; };
    if (k[1] > hy) return [h[1] >= hy ? h : cut(h, k), k, f];
    const c = cut(k, f); return [c, v2.lerp(c, f, .5), f];
  });
  return P;
}
// the towel over its arm (the bar's own `towel` is not in this part's test build)
function strTowel(t, o) {
  const P = twinPose(t, o), A = P.arms[0], s = DEVIL.s, m = v2.lerp(A.el, A.wr, .5), ang = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]);
  ctx.save(); ctx.translate(m[0], m[1]); ctx.rotate(ang * .25 + Math.sin(t * 1.4) * .025);
  ctx.fillStyle = lg(-24 * s, 0, 24 * s, 0, [[0, [244, 238, 226]], [1, [196, 188, 178]]]); rrect(-24 * s, -10 * s, 48 * s, 118 * s, 5 * s); ctx.fill();
  ctx.fillStyle = rgba([150, 140, 132], .35); ctx.fillRect(-2 * s, -8 * s, 3 * s, 112 * s);
  rectf(-24 * s, 90 * s, 48 * s, 6 * s, rgba([70, 150, 150], .85));
  ctx.restore();
}

// ---------- PHONEHAND: his phone in his hand as he walks; the reminder drops ----------
function strBell(x, y, s, col, rot = 0) {
  ctx.save(); ctx.translate(x, y - s * .2); ctx.rotate(rot); ctx.translate(0, s * .2); ctx.fillStyle = rgba(col);
  ctx.beginPath(); ctx.moveTo(-s * .5, s * .28); ctx.quadraticCurveTo(-s * .34, s * .1, -s * .34, -s * .12); ctx.arc(0, -s * .12, s * .34, Math.PI, 0);
  ctx.quadraticCurveTo(s * .34, s * .1, s * .5, s * .28); ctx.closePath(); ctx.fill();
  disc(0, s * .42, s * .12, rgba(col)); disc(0, -s * .5, s * .07, rgba(col));
  ctx.restore();
}
// the lock screen, in phone units: origin the middle of the screen (sw x sh); the caller clips to the glass
function strLock(L, t, sw, sh) {
  const k = clamp((L - .5) / .42), drop = k <= 0 ? 0 : ease.back(k), top = -sh / 2;
  lilyPhoto(0, 100, sw, sh + 204, { wave: 1, ex: 'happy' });
  rectf(-sw / 2, top, sw, 340, lg(0, top, 0, top + 340, [[0, [8, 16, 46], .62], [1, [8, 16, 46], 0]]));
  // the status bar: signal, battery (shapes, no words)
  for (let i = 0; i < 4; i++) rectf(-sw / 2 + 26 + i * 8, top + 34 - i * 3.5, 5, 6 + i * 3.5, rgba([255, 255, 255], .9));
  ctx.strokeStyle = rgba([255, 255, 255], .9); ctx.lineWidth = 2; rrect(sw / 2 - 62, top + 23, 34, 17, 5); ctx.stroke();
  rectf(sw / 2 - 59, top + 26, 20, 11, rgba([255, 255, 255], .9)); rectf(sw / 2 - 26, top + 28, 3, 7, rgba([255, 255, 255], .9));
  // the time: the banner pushes it down, it never covers her face
  const ty = top + 132 + drop * 112;
  ctx.save(); ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,10,50,.5)'; ctx.shadowBlur = 12 * pxPerUnit(ctx);
  font(84, SANS, '300'); const wT = ctx.measureText('5:02').width; font(27, SANS, '600'); const wP = ctx.measureText('PM').width, tx = -(wT + 9 + wP) / 2;
  ctx.fillStyle = rgba([255, 255, 255], .98); font(84, SANS, '300'); ctx.fillText('5:02', tx, ty); font(27, SANS, '600'); ctx.fillText('PM', tx + wT + 9, ty + 20);
  ctx.restore();
  // the reminder
  if (k > 0) {
    const bw = sw - 18, bh = 150, bx = -bw / 2, by = top + lerp(-170, 50, drop), ring = Math.sin((L - .5) * 34) * .38 * (1 - seg(L, .5, 1.25));
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18 * pxPerUnit(ctx); ctx.shadowOffsetY = 5 * pxPerUnit(ctx);
    ctx.fillStyle = rgba([16, 19, 30], .93); rrect(bx, by, bw, bh, 28); ctx.fill(); ctx.restore();
    ctx.strokeStyle = rgba([255, 255, 255], .14); ctx.lineWidth = 1.5; rrect(bx, by, bw, bh, 28); ctx.stroke();
    ctx.fillStyle = rgba(PAL.tealL); rrect(bx + 16, by + 14, 36, 36, 10); ctx.fill();
    strBell(bx + 34, by + 31, 24, [255, 255, 255], ring);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    font(24, SANS, '600'); ctx.fillStyle = rgba([190, 200, 222]); ctx.fillText('Reminder', bx + 62, by + 33);
    let fs = 36; font(fs, SANS, '700'); const mw = ctx.measureText('Pick up Lily').width; if (mw > bw - 36) { fs = Math.max(31, fs * (bw - 36) / mw); font(fs, SANS, '700'); }
    ctx.fillStyle = rgba([255, 255, 255]); ctx.fillText('Pick up Lily', bx + 18, by + 79);
    font(32, SANS, '600'); ctx.fillStyle = rgba([156, 236, 224]); ctx.fillText('5:30 PM', bx + 18, by + 119);
  }
  // the bar at the bottom
  ctx.fillStyle = rgba([255, 255, 255], .85); rrect(-52, sh / 2 - 17, 104, 5, 3); ctx.fill();
}
shot('phonehand', (t, p, L, len) => {
  const step = L * TAU * 1.8, lift = seg(L, .56, 1.05, E.out), calm = 1 - .55 * seg(L, .6, 1.4), ping = strBump(L, .62, .5);
  fill([40, 36, 104], [12, 12, 40]);
  const fr = kcam(L, len, [[0, 1, 960, 545], [.25, 1.015, 960, 543], [1, 1.1, 964, 522]], { hand: .5, t });
  // the street behind, far out of focus, sliding past as he walks
  const drift = L * 78, bob = Math.sin(step) * 9 * calm;
  ctx.save(); ctx.translate(-drift, -bob * .5);
  blurred(26, () => {
    rectf(-800, -300, 4600, 960, lg(0, -300, 0, 660, [[0, [22, 22, 74]], [.7, [70, 52, 132]], [1, [150, 86, 130]]]));        // the last of the dusk
    for (let i = 0; i < 12; i++) {                                                                              // house fronts and their lit windows
      const x = -620 + i * 330, h = 300 + rnd(i * 3.3) * 260;
      rectf(x, 660 - h, 300, h, rgba([16, 16, 50]));
      const c = [[255, 156, 64], [255, 132, 70], PAL.tealL, [255, 150, 60], [140, 120, 255], [255, 190, 140]][i % 6];
      rectf(x + 40 + rnd(i * 5.1) * 60, 660 - 60 - (150 + rnd(i * 7.7) * 90), 130 + rnd(i * 9) * 60, 150 + rnd(i * 7.7) * 90, rgba(c, .85));
      if (i % 2) rectf(x + 30, 660 - h + 50, 60, 70, rgba(mix(c, [255, 255, 255], .2), .6));
    }
    rectf(-800, 660, 4600, 900, lg(0, 660, 0, 1200, [[0, [34, 30, 86]], [1, [10, 10, 34]]]));                       // the wet pavement
    for (let i = 0; i < 12; i++) { const c = [[255, 156, 64], [255, 132, 70], PAL.tealL, [255, 150, 60], [140, 120, 255], [255, 190, 140]][i % 6]; rectf(-560 + i * 330 + rnd(i * 5.1) * 60, 664, 150, 330, lg(0, 664, 0, 994, [[0, c, .4], [1, c, 0]])); }
  });
  bokeh(41, 20, [-500, 150, 3000, 620], [PAL.amber, PAL.lamp, [255, 150, 70], PAL.tealG, [150, 130, 255], PAL.amber], 34, 92, .5, t);
  bokeh(77, 12, [-500, 680, 3000, 1000], [PAL.amber, PAL.tealL, [150, 130, 255]], 22, 60, .26, t);
  ctx.restore();
  // a lamp post slides by between him and the street
  blurred(20, () => { const x = 520 - L * 520; rectf(x, -200, 54, 1500, rgba([8, 8, 24], .9)); additive(() => lite(PAL.lamp, x + 27, 40, 260, .5)); });
  haze(t, -200, 2100, 620, 240, [120, 90, 170], .05, 7, 6);
  // the hand and the phone: one group that bobs with his step; he lifts it a little to read
  const gx = 972 + Math.sin(step * .5) * 7 * calm, gy = 556 + bob + Math.sin(step * .5 + 1) * 5 * calm - lift * 16, rot = -.065 + Math.sin(step * .5 + .6) * .014 * calm + lift * .012, sc = 1 + lift * .035;
  const PW = 159, PH = 312, ink = [9, 10, 16], scr = mix([190, 215, 255], [255, 255, 255], ping * .5);
  ctx.save(); ctx.translate(gx, gy); ctx.rotate(rot); ctx.scale(sc, sc);
  // behind the phone: his sleeve, the heel of his hand, the ball of his thumb
  strLimbs([[[[400, 900], [176, 486]], 236]], [14, 16, 30], PAL.amber, .5, -.8, -.5);
  strLimbs([[[[84, 338], [24, 196]], 286], [[[176, 400], [214, 250]], 150], [[[-150, 150], [-60, 240]], 120]], ink, PAL.amber, .5, -.6, -.8);
  additive(() => lite(scr, 0, 0, 640, .16 + .14 * ping));
  // the phone
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 34 * pxPerUnit(ctx); ctx.shadowOffsetY = 12 * pxPerUnit(ctx); ctx.fillStyle = '#090a10'; rrect(-PW, -PH, 2 * PW, 2 * PH, 46); ctx.fill(); ctx.restore();
  ctx.lineWidth = 3.5; ctx.strokeStyle = lg(-PW, -PH, PW, PH, [[0, [170, 180, 215], .95], [.45, [50, 54, 76], .7], [1, [255, 190, 130], .7]]); rrect(-PW, -PH, 2 * PW, 2 * PH, 46); ctx.stroke();
  const sw = 2 * PW - 18, sh = 2 * PH - 18;
  ctx.save(); rrect(-sw / 2, -sh / 2, sw, sh, 38); ctx.clip();
  strLock(L, t, sw, sh);
  ctx.fillStyle = lg(-sw / 2, -sh / 2, sw / 2, sh / 2, [[0, [255, 255, 255], .12], [.32, [255, 255, 255], .02], [.33, [255, 255, 255], 0], [1, [255, 255, 255], 0]]); ctx.fillRect(-sw / 2, -sh / 2, sw, sh);   // the glass
  if (ping > .01) rectf(-sw / 2, -sh / 2, sw, sh, rgba([255, 255, 255], .07 * ping));
  ctx.restore();
  // the first drops of rain on the glass
  for (let i = 0; i < 6; i++) {
    const t0 = .22 + i * .31, a = L - t0; if (a < 0) continue;
    const dx = [-118, 122, -92, 110, 126, -126][i], dy = [196, 236, 262, 150, -20, 96][i] + Math.min(a, 1.5) * 4, r = 6 + rnd(i * 3.7) * 4;
    if (a < .22) { ctx.strokeStyle = rgba([255, 255, 255], .7 * (1 - a / .22)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, r + a * 90, 0, TAU); ctx.stroke(); }
    oval(dx, dy, r, r * 1.15, rgba([200, 225, 255], .28)); ctx.strokeStyle = rgba([255, 255, 255], .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(dx, dy, r, r * 1.15, 0, 0, TAU); ctx.stroke();
    disc(dx - r * .3, dy - r * .4, r * .28, rgba([255, 255, 255], .85));
  }
  // in front: four fingertips round the left edge, his thumb resting on the right edge
  const tw = Math.sin(L * 2.3) * 3;
  strLimbs([-66, 2, 70, 136].map((y, i) => [[[-186 + i * 3, y + 14], [-128 + i * 3, y - 2]], 45 - i * 2]), ink, scr, .5 + .3 * ping, 1, -.3, 7);
  strLimbs([[[[204, 372], [236, 236]], 112], [[[236, 236], [172 + tw, 132 - tw * .6]], 62]], ink, scr, .5 + .3 * ping, -1, -.35, 7);
  oval(164 + tw, 122 - tw * .6, 14, 19, rgba(mix(ink, scr, .25), .75), -.6);                                             // his thumbnail catches the screen
  ctx.restore();
  rain(t, { n: 34, a: .3, len: 70, speed: 1500, slant: .1, seed: 5 });
  cam(...fr);
  blurred(16, () => { for (let i = 0; i < 4; i++) { const k = (L * 1.1 + rnd(i * 9.3)) % 1; oval(200 + rnd(i * 4.1) * 1500, -80 + k * 1300, 7, 60, rgba([190, 210, 255], .22)); } });   // drops close to the lens
}, { bloom: .42, grain: .5 }, [770, 190, 1190, 900]);

// ---------- BARDOOR: the bar's front from across the street ----------
const strLooks = {
  beckon: { wall: [[9, 38, 46], [26, 92, 86]], seam: .3, frame: [10, 16, 18], pav: [[40, 48, 84], [18, 22, 52]], road: [[16, 20, 50], [6, 8, 24]], wet: .5, rain: { n: 70, a: .24, len: 62, speed: 1700, slant: .12 } },
  offer: { wall: [[7, 30, 42], [18, 68, 72]], seam: .34, frame: [8, 13, 16], pav: [[34, 44, 80], [14, 18, 46]], road: [[14, 18, 46], [5, 7, 22]], wet: .58, rain: { n: 190, a: .3, len: 96, speed: 2300, slant: .16 } },
  eyes: { wall: [[26, 100, 98], [52, 136, 112]], seam: .22, frame: [20, 34, 34], pav: [[228, 150, 104], [158, 100, 90]], road: [[126, 84, 86], [70, 48, 62]], wet: 0, rain: null }
};
// painted brick
function strBrick(x0, x1, y0, y1, colA, colB, seamA) {
  ctx.fillStyle = lg(0, y0, 0, y1, [[0, colA], [1, colB]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  const bh = 30, bw = 78;
  for (let r = 0, y = y1 - bh; y > y0 - bh; y -= bh, r++) for (let x = x0 - (r % 2) * bw / 2, c = 0; x < x1; x += bw, c++) {
    const v = rnd(r * 37.1 + c * 5.3);
    if (v < .24) rectf(x + 2, y + 2, bw - 4, bh - 4, rgba([255, 255, 255], .03 + v * .16));
    else if (v > .78) rectf(x + 2, y + 2, bw - 4, bh - 4, rgba([0, 0, 0], (v - .78) * .7));
  }
  ctx.lineWidth = 2; ctx.beginPath();
  for (let r = 0, y = y1 - bh; y > y0 - bh; y -= bh, r++) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); for (let x = x0 - (r % 2) * bw / 2; x < x1; x += bw) { ctx.moveTo(x, y); ctx.lineTo(x, y + bh); } }
  ctx.strokeStyle = rgba([0, 0, 0], seamA); ctx.stroke();
  ctx.save(); ctx.translate(0, 2); ctx.strokeStyle = rgba([255, 255, 255], seamA * .16); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
// the neon letters, each a path in a box 1 tall; returns the letter's width
function strGlyph(ch) {
  const q = Math.PI / 2;
  ctx.beginPath();
  if (ch === 'B') { ctx.moveTo(0, 1); ctx.lineTo(0, 0); ctx.lineTo(.3, 0); ctx.arc(.3, .24, .24, -q, q); ctx.lineTo(0, .48); ctx.moveTo(0, .48); ctx.lineTo(.34, .48); ctx.arc(.34, .74, .26, -q, q); ctx.lineTo(0, 1); return .6; }
  if (ch === 'A') { ctx.moveTo(0, 1); ctx.lineTo(.33, 0); ctx.lineTo(.66, 1); ctx.moveTo(.13, .64); ctx.lineTo(.53, .64); return .66; }
  ctx.moveTo(0, 1); ctx.lineTo(0, 0); ctx.lineTo(.3, 0); ctx.arc(.3, .25, .25, -q, q); ctx.lineTo(0, .5); ctx.moveTo(.26, .5); ctx.lineTo(.58, 1); return .58;
}
// the sign: BAR in amber-orange tubes inside a teal outline; k how bright (0 = off, glass tubes in daylight), t for its hum
function strSign(t, k) {
  const [sx, sy] = STR.sign, hgt = 92, hum = .9 + .1 * Math.sin(t * 47) * Math.sin(t * 13), lit = [1, noise1(t * 7, 3) > .62 ? .25 + .5 * rnd(Math.floor(t * 30)) : 1, 1];
  ctx.fillStyle = rgba([6, 14, 18]); rrect(sx - 176, sy - 78, 352, 156, 16); ctx.fill();
  ctx.strokeStyle = rgba([255, 255, 255], .08); ctx.lineWidth = 2; rrect(sx - 176, sy - 78, 352, 156, 16); ctx.stroke();
  rectf(sx - 120, sy + 78, 8, 26, rgba([6, 14, 18])); rectf(sx + 112, sy + 78, 8, 26, rgba([6, 14, 18]));
  if (k > .02) additive(() => { lite(STR.neon, sx, sy, 560, .34 * k * hum); lite(STR.neonT, sx, sy - 20, 380, .2 * k * hum); });
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const kt = k * (.94 + .06 * Math.sin(t * 61));
  if (kt > .02) { ctx.shadowColor = rgba(STR.neonT, kt); ctx.shadowBlur = 22 * pxPerUnit(ctx); }
  ctx.strokeStyle = rgba(mix([40, 84, 84], STR.neonT, kt)); ctx.lineWidth = 7; rrect(sx - 158, sy - 60, 316, 120, 22); ctx.stroke();
  ctx.shadowBlur = 0; if (kt > .02) { ctx.strokeStyle = rgba([225, 255, 250], .8 * kt); ctx.lineWidth = 2.4; rrect(sx - 158, sy - 60, 316, 120, 22); ctx.stroke(); }
  ctx.restore();
  let x = sx - (.6 + .66 + .58 + .44) * hgt / 2;
  'BAR'.split('').forEach((ch, i) => {
    const on = k * hum * lit[i];
    ctx.save(); ctx.translate(x, sy - hgt / 2); ctx.scale(hgt, hgt); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const w = strGlyph(ch);
    if (on > .02) { ctx.shadowColor = rgba(STR.neon, on); ctx.shadowBlur = 30 * pxPerUnit(ctx) / hgt; }
    ctx.lineWidth = .125; ctx.strokeStyle = rgba(mix([92, 62, 54], STR.neon, on)); ctx.stroke();
    if (on > .02) { ctx.shadowBlur = 10 * pxPerUnit(ctx) / hgt; ctx.stroke(); }
    ctx.shadowBlur = 0; ctx.lineWidth = .05; ctx.strokeStyle = on > .02 ? rgba([255, 236, 208], .95 * on) : rgba([255, 255, 255], .22); ctx.stroke();
    ctx.restore();
    x += (w + .22) * hgt;
  });
}
// what the open door shows. warm: the bar inside, lit; dark: nothing; sun: black, with a blade of sunlight on the sill
function strDoorway(t, mode) {
  const [x0, y0, x1, y1] = STR.door, lk = strLooks[mode === 'after' ? 'offer' : mode], w = x1 - x0;
  rectf(x0 - 26, y0 - 26, w + 52, y1 - y0 + 26, rgba(lk.frame));
  ctx.strokeStyle = rgba(mode === 'eyes' ? [255, 214, 160] : PAL.brass, mode === 'beckon' ? .7 : .35); ctx.lineWidth = 3; ctx.strokeRect(x0 - 26, y0 - 26, w + 52, y1 - y0 + 26);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, y1 - y0); ctx.clip();
  if (mode === 'beckon') {
    ctx.fillStyle = lg(0, y0, 0, y1, [[0, [84, 36, 14]], [.4, [206, 104, 36]], [1, [128, 60, 22]]]); ctx.fillRect(x0, y0, w, y1 - y0);
    blurred(7, () => {
      ctx.fillStyle = lg(0, y0 + 120, 0, y0 + 330, [[0, [30, 110, 116]], [1, [16, 66, 76]]]); rrect(x0 + 44, y0 + 120, w - 88, 214, 8); ctx.fill();   // the lit shelf, far inside
      for (let r = 0; r < 2; r++) { rectf(x0 + 44, y0 + 222 + r * 106, w - 88, 8, rgba(PAL.wood)); for (let i = 0; i < 7; i++) bottle(x0 + 66 + i * 32, y0 + 222 + r * 106, .26 + rnd(i + r * 9) * .05, { glass: [190, 245, 235], level: .2 + rnd(i * 3 + r) * .6, cork: 1 }); }
      rectf(x0, y0 + 372, w, 22, rgba(PAL.woodL)); rectf(x0, y0 + 394, w, 90, rgba(PAL.wood));                 // the counter
    });
    cone(x0 + w / 2, y0 + 26, 30, 210, 440, PAL.amber, .2);
    poly([[x0 + w / 2 - 22, y0], [x0 + w / 2 + 22, y0], [x0 + w / 2 + 44, y0 + 30], [x0 + w / 2 - 44, y0 + 30]], rgba([14, 12, 12]));
    additive(() => { lite([255, 150, 60], x0 + w / 2, y0 + 40, 210, .7); lite([255, 226, 190], x0 + w / 2, y0 + 36, 46, .9); });
    ctx.fillStyle = lg(0, y1 - 80, 0, y1, [[0, [120, 64, 26], 0], [1, [255, 170, 90], .4]]); ctx.fillRect(x0, y1 - 80, w, 80);       // the floor at the door
    poly([[x0, y0], [x0 + 46, y0 + 26], [x0 + 46, y1 - 8], [x0, y1]], rgba([20, 26, 26]));                       // the door leaf, swung in
    ctx.strokeStyle = rgba(PAL.amber, .8); ctx.lineWidth = 3; line(x0 + 46, y0 + 26, x0 + 46, y1 - 8); disc(x0 + 34, y0 + 250, 6, rgba(PAL.brass));
  } else if (mode === 'eyes') {
    rectf(x0, y0, w, y1 - y0, rgba([3, 4, 6]));
    poly([[x0 + 120, y1], [x1, y1], [x1, y1 - 30]], rgba([255, 196, 128], .55));
    ctx.fillStyle = lg(x1 - 70, 0, x1, 0, [[0, [255, 190, 120], 0], [1, [255, 190, 120], .1]]); ctx.fillRect(x1 - 70, y0, 70, y1 - y0);
  } else {
    ctx.fillStyle = lg(0, y0, 0, y1, [[0, [2, 5, 8]], [.75, [3, 8, 12]], [1, [8, 20, 26]]]); ctx.fillRect(x0, y0, w, y1 - y0);
  }
  ctx.restore();
}
function strStep(lk, lit) {
  const [x0, , x1, y1] = STR.door;
  rectf(x0 - 34, y1 - 4, x1 - x0 + 68, 18, rgba(mix(lk.pav[0], [255, 255, 255], .12))); rectf(x0 - 34, y1 - 4, x1 - x0 + 68, 3, rgba(lit, .6));
}
// the small window: blurred bottle shapes behind the glass
function strWindow(t, mode) {
  const [x0, y0, x1, y1] = STR.win, w = x1 - x0, h = y1 - y0, lk = strLooks[mode === 'after' ? 'offer' : mode];
  rectf(x0 - 18, y0 - 18, w + 36, h + 46, rgba(lk.frame));
  const glass = mode === 'beckon' ? [[0, [150, 84, 34]], [.55, [236, 150, 64]], [1, [120, 62, 24]]] : mode === 'eyes' ? [[0, [28, 54, 60]], [1, [16, 30, 36]]] : [[0, [8, 34, 42]], [1, [14, 52, 58]]];
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.fillStyle = lg(0, y0, 0, y1, glass); ctx.fillRect(x0, y0, w, h);
  if (mode === 'beckon') additive(() => lite(PAL.amber, x0 + w * .4, y0 + 40, 240, .5));
  blurred(5, () => {
    for (let i = 0; i < 8; i++) { const s = .5 + rnd(i * 3.1) * .14; ctx.save(); ctx.translate(x0 + 24 + i * 38, y1 - 6); ctx.scale(s, s); bottlePath(); ctx.fillStyle = rgba(mode === 'beckon' ? [56, 24, 10] : mode === 'eyes' ? [6, 14, 16] : [3, 14, 18], .9); ctx.fill(); ctx.restore(); }
    rectf(x0, y1 - 8, w, 8, rgba([8, 10, 10]));
  });
  if (mode === 'eyes') { ctx.fillStyle = lg(x0, y0, x1, y1, [[0, [255, 214, 160], .5], [.4, [255, 190, 130], .16], [.41, [255, 190, 130], .03], [1, [255, 190, 130], .1]]); ctx.fillRect(x0, y0, w, h); }
  else { ctx.fillStyle = lg(x0, y0, x1, y1, [[0, [200, 230, 255], .14], [.35, [200, 230, 255], .03], [.36, [200, 230, 255], 0], [1, [200, 230, 255], .05]]); ctx.fillRect(x0, y0, w, h); }
  ctx.restore();
  ctx.strokeStyle = rgba(lk.frame); ctx.lineWidth = 9; line(x0 + w / 2, y0, x0 + w / 2, y1); line(x0, y0 + h * .4, x1, y0 + h * .4);
  rectf(x0 - 30, y1 + 16, w + 60, 14, rgba(mix(lk.frame, [255, 255, 255], .1)));
}
// the wall with everything fixed to it
function strFront(t, mode, neonK) {
  const lk = strLooks[mode === 'after' ? 'offer' : mode], day = mode === 'eyes';
  strBrick(-600, 2520, -520, STR.base, lk.wall[0], lk.wall[1], lk.seam);
  rectf(-600, STR.base - 50, 3120, 50, rgba(mix(lk.wall[0], [0, 0, 0], day ? .25 : .4))); rectf(-600, STR.base - 52, 3120, 3, rgba(mix(lk.wall[1], [255, 255, 255], .3), .5));
  ctx.fillStyle = lg(396, 0, 426, 0, [[0, mix(lk.wall[0], [0, 0, 0], .3)], [.4, mix(lk.wall[1], [255, 255, 255], .12)], [1, mix(lk.wall[0], [0, 0, 0], .5)]]); ctx.fillRect(396, -520, 30, 1220);   // a drainpipe
  for (const y of [40, 360, 640]) rectf(390, y, 42, 12, rgba(mix(lk.wall[0], [0, 0, 0], .45)));
  rectf(560, 596, 120, 62, rgba(mix(lk.wall[0], [0, 0, 0], .5))); for (let i = 0; i < 5; i++) rectf(568, 604 + i * 11, 104, 4, rgba(mix(lk.wall[1], [255, 255, 255], .08)));   // a cellar vent
  if (day) {                                                                // long, low sunlight from the right, and what stands in it
    additive(() => { ctx.fillStyle = lg(-300, 0, 2200, 0, [[0, [255, 130, 60], .04], [.55, [255, 150, 70], .2], [1, [255, 170, 90], .34]]); ctx.fillRect(-600, -520, 3120, 1220); lite([255, 160, 80], 1500, 120, 900, .16); });
    ctx.save(); ctx.beginPath(); ctx.rect(-600, -520, 3120, 1220); ctx.clip();
    blurred(7, () => {
      poly([[-600, 150], [-600, STR.base], [190, STR.base]], rgba([6, 30, 46], .55));                               // the house across the street throws its shadow up the wall
      poly([[1722, -520], [1764, -520], [1346, STR.base], [1304, STR.base]], rgba([6, 30, 46], .5));              // a lamp post's shadow
      poly([[STR.sign[0] - 330, STR.sign[1] - 30], [STR.sign[0] + 60, STR.sign[1] - 30], [STR.sign[0] + 10, STR.sign[1] + 170], [STR.sign[0] - 380, STR.sign[1] + 170]], rgba([6, 30, 46], .42));
      poly([[STR.win[0] - 110, STR.win[1] + 50], [STR.win[0], STR.win[1]], [STR.win[0], STR.win[3] + 30], [STR.win[0] - 110, STR.win[3] + 90]], rgba([6, 30, 46], .4));
      poly([[STR.door[0] - 120, STR.door[1] + 60], [STR.door[0] - 26, STR.door[1] - 20], [STR.door[0] - 26, STR.base], [STR.door[0] - 120, STR.base]], rgba([6, 30, 46], .34));
    });
    blurred(14, () => { for (let i = 0; i < 18; i++) oval(170 + rnd(i * 3.3) * 600 + Math.sin(t * .9 + i) * 10, -90 + rnd(i * 5.1) * 400 + Math.cos(t * .7 + i * 2) * 8, 60 + rnd(i * 7) * 60, 34 + rnd(i * 9) * 30, rgba([6, 34, 46], .42), rnd(i) * 3); });   // leaves' shade
    ctx.restore();
  }
  strWindow(t, mode);
  strSign(t, neonK);
}
// the pavement and the road; the wet ones mirror the wall
function strGround(t, mode) {
  const lk = strLooks[mode === 'after' ? 'offer' : mode], day = mode === 'eyes', B = STR.base, K = STR.kerb;
  ctx.fillStyle = lg(0, B, 0, K, [[0, lk.pav[0]], [1, lk.pav[1]]]); ctx.fillRect(-600, B, 3120, K - B);
  ctx.strokeStyle = rgba([0, 0, 0], day ? .14 : .3); ctx.lineWidth = 2; ctx.beginPath();
  for (const y of [B + 52, B + 116]) { ctx.moveTo(-600, y); ctx.lineTo(2520, y); }
  for (let x = -600; x < 2520; x += 150) { ctx.moveTo(x, B); ctx.lineTo(x - 26, B + 52); ctx.moveTo(x + 70, B + 52); ctx.lineTo(x + 36, B + 116); ctx.moveTo(x, B + 116); ctx.lineTo(x - 44, K); }
  ctx.stroke();
  rectf(-600, K, 3120, 16, rgba(mix(lk.pav[0], [255, 255, 255], day ? .3 : .16))); rectf(-600, K + 16, 3120, 12, rgba([0, 0, 0], .45));
  ctx.fillStyle = lg(0, K + 28, 0, 1500, [[0, lk.road[0]], [1, lk.road[1]]]); ctx.fillRect(-600, K + 28, 3120, 700);
  if (lk.wet) wet(B, 420, lk.wet, t, 6);
  if (day) {
    ctx.save(); ctx.beginPath(); ctx.rect(-600, B, 3120, 800); ctx.clip();
    blurred(7, () => {
      poly([[1346, B], [1304, B], [740, 1300], [840, 1300]], rgba([64, 26, 60], .42));                         // the lamp post's shadow runs on across the street
      poly([[-600, B], [190, B], [-140, 1300], [-600, 1300]], rgba([64, 26, 60], .4));
      poly([[STR.door[0] - 60, B + 16], [STR.door[2] + 40, B + 16], [STR.door[2] - 40, B + 60], [STR.door[0] - 150, B + 60]], rgba([64, 26, 60], .28));
    });
    additive(() => { ctx.fillStyle = lg(0, B, 0, 1100, [[0, [255, 150, 70], .12], [1, [255, 130, 60], 0]]); ctx.fillRect(-600, B, 3120, 500); });
    ctx.restore();
  }
}
// a lamp post close to the lens, on our side of the street
function strNearPost(t, fr, x0 = 150, a = 1) {
  const x = x0 - (fr[1] - 960) * 1.2;
  blurred(13, () => { rectf(x - 38, -400, 76, 1800, rgba([5, 7, 16], .96 * a)); rectf(x - 38, -400, 9, 1800, rgba(STR.blue, .2 * a)); rectf(x - 70, 950, 140, 300, rgba([5, 7, 16], .96 * a)); });
}
// a walker's pose from the distance walked: his stride comes from d (px), so his feet do not slide. o: s, swing, hands, lean, neck, feet
function strWalker(x, gy, d, o = {}) {
  const s = o.s || .95, len = 46 * s, ph = Math.PI / 2 + d / len, feet = o.feet || stride(x, gy, ph, len, 24 * s, 1);
  const hip = [x + (o.hx || 0), gy - (184 + 7 * Math.abs(Math.cos(ph)) * (o.bob ?? 1)) * s];
  return man({ hip, s, dir: 1, lean: o.lean ?? .06, neck: o.neck ?? .04, feet, knee: 1, swing: -Math.sin(ph) * .42 * (o.swing ?? 1), hands: o.hands, elbow: o.elbow });
}

function strBarDoor(t, p, L, len) {
  const mode = p.mode || 'beckon', lk = strLooks[mode === 'after' ? 'offer' : mode], u = clamp(L / len), B = STR.base, [dx0, dy0, dx1, dy1] = STR.door;
  const cams = {
    beckon: [[0, 1, 960, 530], [1, 1.2, 962, 480]], offer: [[0, 1.03, 900, 530], [1, 1.09, 850, 540]],
    after: [[0, 1.05, 1050, 548], [.3, 1.08, 1030, 556], [1, 1.56, 850, 630]], eyes: [[0, 1, 960, 528], [1, 1.3, 960, 466]]
  };
  fill(lk.wall[0], lk.road[1]);
  const fr = kcam(L, len, p.cam || cams[mode], { hand: mode === 'eyes' ? .22 : .4, t });
  const neonK = mode === 'eyes' ? 0 : mode === 'beckon' ? 1 : .92;
  strFront(t, mode, neonK);
  strDoorway(t, mode);

  if (mode === 'beckon') {
    // the door's light on the wall round it; the devil in the doorway, a towel over its arm, one finger calling him in
    additive(() => { lite([255, 150, 60], 960, 470, 640, .16); });
    const s = .6; placeDevil([946, B + 200 * s, s]);
    const bk = L < .25 ? 0 : .5 - .5 * Math.cos((L - .25) * TAU * 1.55), lean = .06 + .12 * seg(L, 0, len);
    const o = devilO({ a: 1, eyes: .9 + .1 * Math.sin(t * 5), grin: .3 + .08 * seg(L, .8, 1.8), lean, reach: 1, smoke: .45,
      targets: [[986, 528], [1088 - bk * 10, 352 + 14 + bk * 8]] });
    drawDevil(t, fr, o); strTowel(t, o);
    const P = twinPose(t, o), A = P.arms[1], fa = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]);
    strFinger(A.wr, fa + .12, 104, .08 + bk * .74, -1, 1);
    devilEyes(t, o); devilGrin(t, o);
    strStep(lk, PAL.amber);
  } else if (mode === 'eyes') {
    strStep(lk, [255, 220, 170]);
  } else strStep(lk, STR.neon);

  strGround(t, mode);

  if (mode === 'beckon') {
    // the warm light spills out of the door across the wet pavement, its long shadow in the middle of it
    blurred(5, () => additive(() => { ctx.fillStyle = lg(0, B, 0, 1140, [[0, [255, 150, 60], .5], [.5, [255, 150, 60], .2], [1, [255, 150, 60], .05]]); poly([[dx0 + 46, B + 14], [dx1, B + 14], [dx1 + 300, 1140], [dx0 - 250, 1140]]); ctx.fill(); }));
    blurred(9, () => poly([[916, B + 14], [1000, B + 14], [1100, 1140], [820, 1140]], rgba([10, 8, 20], .5)));
    pool(960, B + 40, 380, 60, PAL.amber, .3);
    ripples(t, -200, 2100, B + 20, 1080, 30, [200, 220, 255], .3, 3);
  } else if (mode === 'offer' || mode === 'after') {
    // a street lamp out of frame on the left lights the wall and the pavement they walk on
    additive(() => { lite([150, 190, 255], 470, 300, 760, .2); lite([150, 190, 255], 520, 560, 420, .14); });
    pool(520, B + 110, 620, 110, [170, 195, 255], .22); pool(STR.sign[0], B + 60, 300, 44, STR.neon, .18);
    ripples(t, -200, 2100, B + 14, 1080, 60, [200, 220, 255], .34, 3);
    strOffer(t, mode, L, len, fr);
  } else strEyes(t, L, len, fr);

  if (lk.rain) rain(t, lk.rain);
  cam(...fr);
  if (mode !== 'eyes') { strNearPost(t, fr, mode === 'beckon' ? 150 : 1830); haze(t, -300, 2200, 640, 300, mode === 'beckon' ? [90, 80, 160] : [70, 90, 160], .045, 11, 6); }
  if (mode === 'offer') stamp(L, '7:10 PM', 'DAY 60');
}
// 'offer' and 'after': the dark doorway, the arm and the glass, the eyes, the two of them on the pavement
function strOffer(t, mode, L, len, fr) {
  const B = STR.base, [dx0, dy0, dx1, dy1] = STR.door, [gx, gy] = STR.glass, gs = .64, off = mode === 'offer';
  // the glass: it slides out of the dark along the pavement, then stands there
  const sl = off ? seg(L, .32, 1.12, E.out) : 1, G = [lerp(978, gx, sl), lerp(B + 12, gy, sl)];
  const back = off ? seg(L, 1.45, 2.35, E.io) : 1, grip = off ? 1 - back : 0;
  const eyeK = off ? seg(L, .55, .95, E.out) * (.9 + .1 * Math.sin(t * 6)) : lerp(.85, .2, seg(L, .2, len * .85));
  const drawGlass = () => {
    if (!off) {                                                             // the rain tops it up: it runs over
      ctx.fillStyle = lg(0, G[1] - 104 * gs, 0, G[1], [[0, [246, 206, 150], .8], [1, [200, 120, 50], .5]]);
      poly([[G[0] - 46 * gs, G[1] - 100 * gs], [G[0] + 46 * gs, G[1] - 100 * gs], [G[0] + 42 * gs, G[1] - 60 * gs], [G[0] - 42 * gs, G[1] - 60 * gs]]); ctx.fill();
    }
    tumbler(G[0], G[1], gs, off ? .96 : 1, { glowA: .7, slosh: off ? Math.sin(L * 16) * (1 - sl) * 2.2 * (sl > .02 ? 1 : 0) + Math.sin(L * 9) * .5 * strBump(L, 1.2, .4) : 0 });
  };
  strMirror(G[1] + 2, .3, drawGlass);
  if (!off) {                                                               // what runs over makes a small pool round it
    const gr = seg(L, 0, len);
    oval(G[0] + 6, G[1] + 6, 60 + 46 * gr, 9 + 6 * gr, rgba([230, 160, 90], .16)); ctx.strokeStyle = rgba([255, 214, 170], .16); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(G[0] + 6, G[1] + 6, 60 + 46 * gr, 9 + 6 * gr, 0, 0, TAU); ctx.stroke();
  }
  // its arm: long, down out of the dark at a slant, fingertips on the glass; it lets go and draws back in
  if (off && back < .995) {
    const ang = 2.36 + .06 * Math.sin(L * 3), ax = [Math.cos(ang), Math.sin(ang)], wr0 = [G[0] + 30 + 86, G[1] - 34 - 86], wr = [wr0[0] - ax[0] * 330 * back, wr0[1] - ax[1] * 330 * back];
    ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0 + 4); ctx.rect(-600, B + 2, 3120, 900); ctx.clip();
    claw(wr, ang, .52, { arm: 560, curl: .1 + .1 * grip + .3 * back, side: -1, spread: .8, a: 1 - seg(back, .55, .95) });
    ctx.restore();
  }
  drawGlass();
  if (!off) {                                                               // rain in the glass, and over its rim
    for (let i = 0; i < 5; i++) {
      const per = .34 + rnd(i * 2.3) * .2, a = ((t + rnd(i * 7.7)) % per) / per, x = G[0] + (rnd(i * 3.1 + Math.floor((t + rnd(i * 7.7)) / per)) - .5) * 70 * gs, y = G[1] - 100 * gs;
      ctx.strokeStyle = rgba([255, 240, 220], .8 * (1 - a)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x, y, 3 + a * 12, 1.5 + a * 3, 0, 0, TAU); ctx.stroke();
      for (const sd of [-1, 1]) disc(x + sd * a * 12, y - Math.sin(a * Math.PI) * 16, 1.8, rgba([255, 244, 230], .8 * (1 - a)));
    }
    for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) { const k = (t * (.7 + j * .25) + j * .5 + (sd > 0 ? .3 : 0)) % 1, x = G[0] + sd * (49 - k * 5) * gs; stroke([[x, G[1] - (100 - k * 86) * gs], [x - sd * .6, G[1] - (100 - k * 86) * gs + 13]], 2.6, rgba([255, 226, 190], .75 * (1 - k * .5))); }
  }
  // the dark of the doorway closes over its arm; then its eyes, low in the dark
  ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0); ctx.clip();
  ctx.fillStyle = lg(0, dy0, 0, dy1, [[0, [2, 5, 8], 1], [.66, [2, 6, 9], 1], [.9, [3, 8, 12], .45], [1, [3, 8, 12], 0]]); ctx.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
  additive(() => lite(PAL.red, 1020, 412, 240, .34 * eyeK));
  ctx.restore();
  const es = .62; placeDevil([990, 408 + 830 * es, es]);
  const o = devilO({ a: 1, eyes: eyeK, lean: .1 });
  devilEyes(t, o);
  additive(() => lite(PAL.red, G[0], G[1] - 40, 150, .16 * eyeK));

  // the two of them. He is on the street side; she walks a step behind him, away from the door
  const sM = .95, v = 180, gyM = 816, gyL = 792, sLy = 1.45;
  let M, LP, ex, lex, mx, lx, rimC = mix(STR.blue, PAL.lamp, .35);
  if (off) {
    const tS = 1.02, dmax = v * (tS + .15), walk = Lq => Lq < tS ? v * Lq : v * (Math.min(Lq, tS + .3) - Math.pow(Math.min(Lq, tS + .3) - tS, 2) / .6), dd = walk(L) - dmax;   // he slows and stops
    const dl = walk(Math.max(0, L - .14)) + v * .14 - dmax;
    mx = 632 + dd; lx = mx - 132 + (dl - dd);
    const stepB = seg(L, 1.5, 1.95), rest = seg(L, 1.3, 1.7), len0 = 46 * sM;
    const feet = L < 1.3 ? null : [[mx + len0 * lerp(1, .12, stepB), gyM - Math.sin(stepB * Math.PI) * 13], [mx - len0, gyM]];          // half a step back
    const hx = -16 * stepB, base = { s: sM, swing: 1 - rest, feet, hx, lean: lerp(.06, -.04, stepB), neck: lerp(.04, .34, seg(L, 1.15, 1.6)), bob: 1 - rest * .5 };
    const P0 = strWalker(mx, gyM, dd, base), rk = seg(L, 1.6, 2.2, E.out) * .8;                                 // his hand starts toward it, and stops in the air
    M = strWalker(mx, gyM, dd, Object.assign({}, base, { hands: [v2.lerp(P0.j.handN, [mx + 92, P0.j.hip[1] - 26], rk), null], elbow: [1, 1] }));
    ex = mixExpr(exMix('calm', 'shock', strBump(L, 1.35, .45) * .8), EXPR.hungry, seg(L, 1.5, 2.2));
    LP = lily({ at: [lx, gyL], s: sLy, dir: 1, pose: 'walk', ph: Math.PI / 2 + dl / (16 * sLy), swing: Math.sin(dl / (16 * sLy)) * .35 * (1 - rest), look: 5 * seg(L, 1.4, 1.9), nod: -3 * seg(L, 1.4, 1.9) });
    lex = mixExprL(LILY_EX.hope, LILY_EX.wary, seg(L, 1.4, 2.0) * .8);
  } else {
    const d = v * 1.1 * L; mx = 1250 + d; lx = mx - 98;
    const P0 = strWalker(mx, gyM, d, { s: sM });
    const hold = [P0.j.sh[0] - 44 * sM, P0.j.sh[1] + 146 * sM];
    M = strWalker(mx, gyM, d, { s: sM, hands: [null, hold], elbow: [1, 1], neck: -.02, lean: .08 });
    ex = exMix('calm', 'resolve', .5);
    LP = lily({ at: [lx, gyL], s: sLy, dir: 1, pose: 'walk', ph: Math.PI / 2 + d / (16 * sLy), arms: [null, [hold[0] - 4, hold[1] + 4]], swing: -.25, look: 4, nod: -2 });
    lex = 'hope';
  }
  strHem(LP);
  const lampK = clamp(1 - Math.abs(mx - 520) / 700);
  const figs = flip => {
    drawLily(LP, lex, { a: .7 + .3 * lampK, rim: PAL.lamp, wet: flip ? 0 : .7 });
    drawMan(M, ex, { rim: rimC, a: .62 + .3 * lampK, lx: -.5, ly: -1, la: .32, light: PAL.lamp, turn: .9 });
  };
  blurred(2.5, () => { strMirror(gyL + 3, .26, () => drawLily(LP, lex, { a: .7, face: false })); strMirror(gyM + 3, .3, () => drawMan(M, ex, { rim: rimC, a: .5, lx: -.5, ly: -1, face: false })); });
  figs(false);
}
// LILY_EX blended (the kit's mixExpr works on any two expression objects)
const mixExprL = (a, b, k) => mixExpr(a, b, clamp(k));
// 'eyes': golden hour; in the black doorway its eyes open and its grin spreads. It does not come out into the light
function strEyes(t, L, len, fr) {
  const [dx0, dy0, dx1, dy1] = STR.door, s = .74;
  placeDevil([926, 404 + 830 * s, s]);
  const e = seg(L, .25, .7, E.out) * (.92 + .08 * Math.sin(t * 7)), g = seg(L, .75, len - .1, E.io);
  const o = devilO({ a: 1, eyes: e, grin: g * .95, lean: .12 * g, smoke: 0 });
  ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, dy1 - dy0 - 30); ctx.clip();
  drawDevil(t, fr, Object.assign({}, o, { a: .1 + .22 * g }));
  devilEyes(t, o); devilGrin(t, o);
  ctx.restore();
  // dust in the low sun; a leaf blows along the pavement
  motes(t, [100, 200, 1800, 900], 34, [255, 226, 170], .32, 4);
  for (let i = 0; i < 3; i++) {
    const x = 1700 - ((L * (300 + i * 90) + i * 520) % 2000), y = STR.base + 70 + i * 46 - Math.abs(Math.sin(L * 5 + i * 2)) * (20 + i * 8);
    oval(x, y + 30 + Math.abs(Math.sin(L * 5 + i * 2)) * (20 + i * 8), 12, 3, rgba([60, 30, 60], .25));
    oval(x, y, 13, 6, rgba([[196, 98, 44], [160, 70, 40], [214, 126, 60]][i]), L * 7 + i);
  }
  additive(() => { ctx.fillStyle = lg(0, -200, 1920, 900, [[0, [255, 140, 70], 0], [1, [255, 150, 80], .12]]); ctx.fillRect(-600, -520, 3120, 1900); });
  blurred(12, () => { for (let i = 0; i < 9; i++) oval(1640 + rnd(i * 3.7) * 420 + Math.sin(t * 1.1 + i) * 9, -40 + rnd(i * 5.3) * 250 + Math.cos(t * .9 + i) * 7, 90, 40, rgba([[50, 96, 62], [84, 124, 66], [36, 76, 60]][i % 3], .95), rnd(i * 2) * 3); });   // a branch near the lens
}
shot('bardoor', strBarDoor, (t, p) => ({ bloom: (p.mode === 'eyes') ? .3 : .46, grain: .5 }),
  (t, p) => (p && p.mode === 'offer') ? [430, 280, 1130, 900] : (p && p.mode === 'after') ? [620, 300, 1240, 900] : [700, 60, 1220, 860]);

// ---------- RUNSIDE: night, hard rain; he runs and the street streaks past ----------
// one row of the street at parallax par (1 = his own plane, less = farther, more = nearer the lens): fn(i, x) draws item i
function strRow(camx, z, par, gap, fn, pad = 500) {
  const half = 1040 / z + pad, c = camx * par;
  ctx.save(); ctx.translate(camx * (1 - par), 0);
  for (let i = Math.floor((c - half) / gap); i <= Math.ceil((c + half) / gap); i++) fn(i, i * gap);
  ctx.restore();
}
// a lit thing smeared sideways by speed
function strStreak(x, y, w, h, col, a, sm) {
  const tot = w + 2 * sm, e = sm / tot;
  ctx.fillStyle = lg(x - sm, 0, x + w + sm, 0, [[0, col, 0], [e, col, a], [1 - e, col, a], [1, col, 0]]); ctx.fillRect(x - sm, y, tot, h);
}
// his run: ph the stride (radians), G the road. Both feet leave the ground when the legs are widest
function strRunner(x, G, ph, s = 1) {
  const fl = Math.max(0, Math.abs(Math.sin(ph)) - .5) / .5 * 20 * s, feet = stride(x - 8 * s, G - fl, ph, 124 * s, 108 * s, 1);
  const hip = [x, G - (166 + 20 * Math.abs(Math.cos(ph))) * s - fl], lean = .36, sh = [hip[0] + Math.sin(lean) * 172 * s, hip[1] - Math.cos(lean) * 172 * s], a = -Math.sin(ph);
  const hand = k => v2.lerp([sh[0] - 64 * s, sh[1] + 110 * s], [sh[0] + 98 * s, sh[1] + 22 * s], E.sine((k + 1) / 2));
  return man({ hip, s, dir: 1, lean, neck: -.12, feet, knee: 1, hands: [hand(a), hand(-a)], elbow: [1, 1] });
}
shot('runside', (t, p, L, len) => {
  const u = clamp(L / len), G = 872, v = p.speed || 1020, cad = 1.48, ph0 = 1.1, ph = L * TAU * cad + ph0, mx = 400 + v * L;
  const z = lerp(1.24, 1.31, u), camx = mx + lerp(180, 70, E.sine(u)), camy = 588 + Math.sin(ph * 2 + .6) * 5;
  fill([20, 24, 82], [6, 8, 26]);
  const fr = kcam(L, len, [[0, z, camx, camy]], { hand: .6, t });
  // far roofs against the sky
  blurred(4, () => strRow(camx, z, .14, 300, (i, x) => {
    const h = 250 + rnd(i * 3.7) * 280; rectf(x, 740 - h, 304, h + 200, rgba([24, 28, 92]));
    for (let j = 0; j < 6; j++) if (rnd(i * 7 + j * 3.1) > .5) rectf(x + 34 + (j % 3) * 84, 740 - h + 46 + Math.floor(j / 3) * 96, 38, 52, rgba(j % 2 ? PAL.amber : PAL.tealL, .55));
  }));
  haze(t, camx - 1100, camx + 1100, 520, 300, [70, 70, 170], .07, 5, 7);
  // the shop fronts: their lit windows are streaks
  const SH = [[26, 30, 92], [34, 28, 88], [22, 36, 90], [30, 34, 100]], WC = [[255, 138, 56], PAL.tealL, [255, 116, 70], [255, 168, 108], [150, 130, 255]];
  strRow(camx, z, .56, 580, (i, x) => {
    const c = WC[((i % 5) + 5) % 5], wall = SH[((i % 4) + 4) % 4];
    rectf(x, -300, 584, 1090, rgba(wall)); rectf(x + 572, -300, 12, 1090, rgba([0, 0, 0], .25));
    for (let j = 0; j < 3; j++) { const on = rnd(i * 5.3 + j * 1.7) > .4; strStreak(x + 70 + j * 170, 150, 96, 150, on ? [255, 176, 120] : [50, 56, 130], on ? .5 : .5, 30); }
    strStreak(x + 20, 392, 540, 40, [70, 60, 150], .9, 24);                                                     // an awning
    strStreak(x + 56, 462, 330, 270, c, .72, 56); strStreak(x + 56, 462, 330, 60, [255, 255, 255], .08, 56);
    for (let j = 0; j < 3; j++) strStreak(x + 96 + j * 100, 620, 40, 112, [14, 12, 40], .55, 26);               // things in the window
    strStreak(x + 440, 480, 96, 300, [12, 14, 44], .95, 20); strStreak(x + 446, 486, 84, 60, c, .7, 20);
    additive(() => { ctx.save(); ctx.translate(x + 220, 800); ctx.scale(1, .16); lite(c, 0, 0, 330, .5); ctx.restore(); lite(c, x + 220, 600, 380, .16); });
  });
  // the pavement edge and the road
  rectf(camx - 1300, 786, 2600, 34, rgba([52, 56, 124])); rectf(camx - 1300, 818, 2600, 8, rgba([110, 120, 200], .6));
  ctx.fillStyle = lg(0, 826, 0, 1300, [[0, [28, 32, 96]], [1, [8, 10, 32]]]); ctx.fillRect(camx - 1300, 826, 2600, 600);
  // street lamps along the kerb, each with its cone of warm light
  const LG = 800, LP = .9, lampX = i => i * LG + 240 + camx * (1 - LP);
  let warm = 0, wdir = 0;
  for (let i = Math.floor(camx / LG) - 3; i < Math.floor(camx / LG) + 4; i++) { const k = clamp(1 - Math.abs(mx + 40 - lampX(i)) / 340); if (k > warm) { warm = k; wdir = clamp((lampX(i) - mx - 40) / 300, -1, 1); } }
  warm = warm * warm * (3 - 2 * warm);
  strRow(camx, z, LP, LG, (i, x0) => {
    const x = x0 + 240;
    rectf(x - 7, 222, 14, 600, rgba([10, 12, 34])); rectf(x - 7, 222, 4, 600, rgba(STR.blue, .35)); rectf(x - 13, 760, 26, 62, rgba([10, 12, 34]));
    stroke([[x, 226], [x - 20, 196], [x - 78, 190]], 9, rgba([10, 12, 34])); poly([[x - 112, 186], [x - 60, 186], [x - 52, 204], [x - 120, 204]], rgba([10, 12, 34]));
    cone(x - 86, 204, 26, 270, 660, [255, 196, 140], .2);
    additive(() => { lite(PAL.lamp, x - 86, 212, 120, .75); lite([255, 236, 204], x - 86, 208, 30, .9); });
    pool(x - 86, 850, 330, 46, PAL.lamp, .42);
  });
  // him
  const M = strRunner(mx, G, ph), rim = mix(STR.blue, PAL.lamp, warm), ex = Object.assign({}, exMix('strain', 'fear', .45), { brow: -.25, browH: .1, lid: .12, grit: .6, open: .6 + .2 * Math.sin(ph * 2) });
  drawMan(M, ex, { rim, a: .78 + .2 * warm, lx: lerp(-.5, wdir, warm), ly: -1, light: rim, la: .34 + .2 * warm, turn: .92 });
  { const h = M.j.handN, e = M.j.elN, an = Math.atan2(h[1] - e[1], h[0] - e[0]);                                // his phone, lit, in his fist
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(an + .5); ctx.fillStyle = '#0a0b12'; rrect(-9, -30, 18, 44, 4); ctx.fill(); ctx.fillStyle = rgba([205, 228, 255]); rrect(-6.5, -27, 13, 30, 3); ctx.fill(); ctx.restore();
    additive(() => { lite([180, 210, 255], h[0], h[1] - 8, 90, .6); lite([180, 210, 255], h[0], h[1] - 8, 26, .7); }); disc(h[0], h[1], 11, rgba(PAL.ink)); }
  // the wet road mirrors all of it
  wet(G + 6, 250, .5, t, 8);
  ripples(t, camx - 900, camx + 900, G + 10, 1090, 40, [200, 220, 255], .3, 6);
  strRow(camx, z, 1.25, 520, (i, x) => strStreak(x, 968, 230, 9, [200, 210, 255], .16, 90));                      // the road's markings
  // spray at each footfall, left behind on the road as he runs on
  for (let f = 0; f < 2; f++) for (let n = -1; n < 5; n++) {
    const Ln = (Math.PI / 2 + TAU * n - ph0 - f * Math.PI) / (TAU * cad), a = L - Ln; if (a < 0 || a > .42) continue;
    const fx = 400 + v * Ln + 124, k = a / .42;
    ctx.strokeStyle = rgba([210, 225, 255], .55 * (1 - k)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(fx, G + 8, 30 + 170 * k, 6 + 20 * k, 0, 0, TAU); ctx.stroke();
    additive(() => { for (let i = 0; i < 26; i++) {
      const vx = -300 + rnd(i * 3.1 + n * 7 + f) * 720, vy = 280 + rnd(i * 5.7 + n * 3 + f) * 640, x = fx + vx * a, y = G - (vy * a - 1500 * a * a);
      if (y > G + 4) continue;
      lite([190, 215, 255], x, y, 7 + rnd(i * 9.1) * 10, .85 * (1 - k)); lite(mix([190, 215, 255], PAL.lamp, warm), x, y, 16, .2 * (1 - k));
    } });
    blurred(3, () => poly([[fx - 40, G + 4], [fx + 50, G + 4], [fx + 90 + 120 * k, G - 60 - 90 * Math.sin(k * Math.PI)], [fx - 80 - 60 * k, G - 40 - 70 * Math.sin(k * Math.PI)]], rgba([170, 200, 255], .22 * (1 - k))));
  }
  additive(() => lite(rim, mx + 30, 600, 520, .07 + .1 * warm));
  // lamp posts on our side of the road whip through, close to the lens
  blurred(18, () => strRow(camx, z, 2.3, 3900, (i, x) => { rectf(x + 900, -400, 96, 1900, rgba([4, 5, 16], .96)); rectf(x + 900, -400, 14, 1900, rgba(PAL.lamp, .25)); }, 1500));
  rain(t, { n: 260, len: 150, speed: 2900, slant: -.42, a: .36, w: 2.4, seed: 3 });
  cam(...fr);
  blurred(9, () => { for (let i = 0; i < 9; i++) { const k = (t * 2.6 + rnd(i * 9.3)) % 1, x = camx - 800 + rnd(i * 4.1) * 1900 - k * 500; stroke([[x, 100 + k * 1000], [x + 90, 100 + k * 1000 - 210]], 9, rgba([190, 210, 255], .2)); } });
}, { bloom: .46, grain: .55 }, [600, 170, 1300, 1010]);

// ---------- PUDDLE: road level; his foot comes down, a crown of water ----------
function strShoe(rimC, ra) {                                               // origin: the middle of the sole; heel at -205, toe at +285
  const top = () => { ctx.beginPath(); ctx.moveTo(-206, -8); ctx.quadraticCurveTo(-222, -90, -184, -168); ctx.lineTo(-52, -178); ctx.quadraticCurveTo(50, -150, 150, -96); ctx.quadraticCurveTo(262, -84, 290, -38); ctx.quadraticCurveTo(298, -4, 264, 0); ctx.lineTo(-190, 0); ctx.closePath(); };
  ctx.save(); ctx.lineJoin = 'round'; ctx.shadowColor = rgba(rimC, ra); ctx.shadowBlur = 18 * pxPerUnit(ctx); ctx.strokeStyle = rgba(rimC, ra); ctx.lineWidth = 9; top(); ctx.stroke(); ctx.restore();
  top(); ctx.fillStyle = lg(0, -180, 0, 0, [[0, [22, 26, 44]], [1, [8, 9, 16]]]); ctx.fill();
  ctx.fillStyle = rgba([40, 46, 74]); rrect(-208, -26, 500, 28, 12); ctx.fill(); rectf(-200, -27, 480, 4, rgba(rimC, .5 * ra));
  ctx.strokeStyle = rgba(mix([22, 26, 44], rimC, .5), .7); ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-40, -170); ctx.quadraticCurveTo(54, -146, 146, -98); ctx.stroke();
  for (let i = 0; i < 4; i++) line(-6 + i * 40, -158 + i * 17, 26 + i * 40, -128 + i * 18);                       // laces
}
shot('puddle', (t, p, L, len) => {
  const hit = p.hit ?? .15, a = L - hit, G = 806, cx = 930, on = a >= 0;
  fill([22, 26, 88], [6, 8, 26]);
  const fr = kcam(L, len, [[0, 1.02, 960, 566], [1, 1.1, 985, 588]], { hand: .5, t, jolt: on ? Math.max(0, 1 - a / .2) * .9 : 0 });
  // the street, far and soft: shop light, two lamp posts, the kerb
  blurred(20, () => {
    rectf(-500, -400, 3000, 880, lg(0, -400, 0, 480, [[0, [16, 20, 76]], [1, [52, 46, 140]]]));
    for (let i = 0; i < 8; i++) rectf(-420 + i * 380, 190 + rnd(i * 3.3) * 90, 250, 290 - rnd(i * 3.3) * 90, rgba([[255, 140, 60], PAL.tealL, [255, 120, 70], [255, 160, 100]][i % 4], .7));
    rectf(-500, 452, 3000, 46, rgba([20, 22, 64]));
    for (const x of [410, 1350]) rectf(x - 22, -400, 44, 880, rgba([8, 10, 28]));
  });
  additive(() => { lite([255, 190, 140], 1350, -20, 480, .6); lite([255, 190, 140], 410, -60, 360, .4); });
  bokeh(23, 12, [-200, 120, 2100, 430], [PAL.amber, PAL.lamp, PAL.tealG, [150, 130, 255]], 26, 70, .34, t);
  // the road, wet: the lamps lie on it in long streaks
  ctx.fillStyle = lg(0, 486, 0, 1250, [[0, [36, 40, 116]], [.4, [20, 24, 76]], [1, [8, 10, 30]]]); ctx.fillRect(-500, 486, 3000, 900);
  additive(() => { for (const [x, k] of [[1350, 1], [410, .55]]) { ctx.fillStyle = lg(0, 486, 0, 1150, [[0, PAL.lamp, .34 * k], [1, PAL.lamp, 0]]); poly([[x - 50, 486], [x + 50, 486], [x + 190, 1150], [x - 190, 1150]]); ctx.fill(); } });
  // the puddle: lighter than the road, the sky and the lamp in it
  const pud = () => { ctx.beginPath(); ctx.ellipse(960, G + 24, 930, 214, 0, 0, TAU); };
  blurred(7, () => { pud(); ctx.fillStyle = lg(0, G - 190, 0, G + 238, [[0, [74, 90, 196]], [.5, [42, 52, 140]], [1, [18, 22, 72]]]); ctx.fill(); });
  ctx.save(); pud(); ctx.clip();
  const A = on ? 5 + 84 * Math.exp(-a * 4.4) * clamp(a / .05) : 5, sh = on ? Math.exp(-a * 4.5) : 0;
  blurred(4, () => { for (const [rx, ry, hw, col, al] of [[1350, G + 14, 60, [255, 176, 110], .8], [1350, G + 14, 24, [255, 236, 210], .85], [520, G - 26, 36, PAL.tealG, .4]]) {
    ctx.fillStyle = rgba(col, al * (1 - .35 * sh));
    for (let q = 0; q < 76; q++) {
      const k = q / 75, y = ry - 152 + q * 4, w = hw * Math.pow(Math.sin(Math.PI * k), .55) + 2, dx = Math.sin(q * .2 + t * 9) * A * (.35 + k) + Math.sin(q * .55 - t * 26) * 22 * sh;
      ctx.beginPath(); ctx.ellipse(rx + dx, y, w * (1 + .5 * sh), 3.4, 0, 0, TAU); ctx.fill();
    }
  } });
  ctx.restore();
  ctx.strokeStyle = rgba([180, 198, 255], .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(960, G + 24, 924, 208, 0, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
  ripples(t, 120, 1800, G - 150, G + 190, 26, [210, 225, 255], .4, 9);
  // his shadow on the water before he lands
  if (!on) { const k = clamp(L / hit); oval(cx, G + 14, 330 * k, 30 * k, rgba([4, 6, 22], .5 * k)); }
  // the crown: petals of water round the foot, drops on arcs off their tips, rings running out
  const pet = [];
  if (on) for (let i = 0; i < 18; i++) {
    const phi = (i + .5 + (rnd(i * 3.7) - .5) * .6) / 18 * TAU, T = .5 + rnd(i * 5.1) * .22, x = a / T; if (x >= 1) continue;
    const R = 240 + 430 * Math.pow(a, .7), b = [cx + Math.cos(phi) * R * (.86 + .14 * rnd(i * 2.3)), G + 12 + Math.sin(phi) * R * .2];
    const h = (220 + 280 * rnd(i * 7.9)) * Math.pow(Math.sin(Math.PI * Math.min(1, x * 1.1)), .8) * (.7 + .3 * Math.abs(Math.cos(phi))), out = (40 + 320 * x) * Math.cos(phi) + 30 * Math.sin(phi * 3 + i);
    pet.push({ phi, b, tip: [b[0] + out, b[1] - h], c: [b[0] + out * .2, b[1] - h * .8], x, w: 96 - 50 * x, i });
  }
  const crown = front => {
    const js = pet.filter(j => (Math.sin(j.phi) > 0) === front).sort((p1, p2) => Math.cos(p1.phi) - Math.cos(p2.phi)); if (!js.length) return;
    if (js.length > 1) {                                                    // the thin wall of water between them
      ctx.beginPath(); ctx.moveTo(js[0].b[0], js[0].b[1]); for (const j of js) ctx.lineTo(lerp(j.b[0], j.c[0], .6), lerp(j.b[1], j.c[1], .6)); for (const j of js.slice().reverse()) ctx.lineTo(j.b[0], j.b[1]); ctx.closePath();
      ctx.fillStyle = rgba([150, 180, 255], front ? .26 : .2); ctx.fill();
    }
    for (const j of js) {
      const lit = clamp(Math.cos(j.phi) * .8 + .25), col = mix([190, 214, 255], [255, 206, 160], lit * .7), fade = 1 - j.x * .55;
      ctx.beginPath(); ctx.moveTo(j.b[0] - j.w / 2, j.b[1]); ctx.quadraticCurveTo(j.c[0] - j.w * .32, j.c[1], j.tip[0], j.tip[1]); ctx.quadraticCurveTo(j.c[0] + j.w * .32, j.c[1], j.b[0] + j.w / 2, j.b[1]); ctx.closePath();
      ctx.fillStyle = lg(0, j.tip[1], 0, j.b[1], [[0, mix(col, [255, 255, 255], .5), .9 * fade], [.5, col, .6 * fade], [1, col, .25 * fade]]); ctx.fill();
      ctx.strokeStyle = rgba([245, 249, 255], .7 * fade); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(j.b[0] - j.w / 2, j.b[1]); ctx.quadraticCurveTo(j.c[0] - j.w * .32, j.c[1], j.tip[0], j.tip[1]); ctx.stroke();
      disc(j.tip[0], j.tip[1] - 6, 9 * fade + 2, rgba(mix(col, [255, 255, 255], .6), .95 * fade));
    }
  };
  const drops = front => { if (!on) return; for (let i = 0; i < 40; i++) {
    const phi = rnd(i * 4.3) * TAU; if ((Math.sin(phi) > 0) !== front) continue;
    const vx = Math.cos(phi) * (240 + rnd(i * 6.1) * 820), vy = 900 + rnd(i * 8.7) * 1000, x = cx + Math.cos(phi) * 210 + vx * a, y = G - (vy * a - 1900 * a * a);
    if (y > G + 30 || a < .03) continue;
    const r = 3.5 + rnd(i * 2.9) * 7, an = Math.atan2(-(vy - 3800 * a), vx), col = mix([214, 230, 255], [255, 214, 170], clamp(Math.cos(phi)) * .6);
    ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.fillStyle = rgba(col, .92); ctx.beginPath(); ctx.ellipse(0, 0, r * 1.45, r, 0, 0, TAU); ctx.fill(); ctx.restore();
    disc(x - r * .3, y - r * .3, r * .32, rgba([255, 255, 255], .9));
    additive(() => lite(col, x, y, r * 2.6, .3));
  } };
  if (on) for (let j = 0; j < 3; j++) { const aa = a - j * .06; if (aa <= 0) continue; const k = clamp(aa / .6), r = 200 + 1300 * aa; ctx.strokeStyle = rgba([220, 232, 255], .5 * (1 - k)); ctx.lineWidth = 7 - 4 * k; ctx.beginPath(); ctx.ellipse(cx, G + 14, r, r * .2, 0, 0, TAU); ctx.stroke(); }
  crown(false); drops(false);
  // his shoe and shin: down hard, then rolling off the toe and gone
  const fall = on ? 0 : 1 - clamp(L / hit), roll = seg(a, .24, .5), leave = seg(a, .4, .7, ease.in);
  const sx = cx - 40 - 230 * Math.pow(fall, 1.4) + leave * 520, sy = G + (on ? 10 * (1 - leave) : 0) - 470 * fall - leave * 560, rot = -.24 * fall + .44 * roll, piv = rot >= 0 ? 262 : -190;
  const rimC = mix(STR.blue, PAL.lamp, .45), th = lerp(-.34, .5, seg(a, -.05, .55)) - rot;
  ctx.save(); ctx.translate(sx + piv, sy); ctx.rotate(rot); ctx.translate(-piv, 0);
  strLimbs([[[[-116, -150], [-116 + Math.sin(th) * 1100, -150 - Math.cos(th) * 1100]], 176]], [10, 12, 22], rimC, .8, .7, -.4);
  ctx.save(); ctx.translate(-116, -176); ctx.rotate(th); rectf(-96, -12, 192, 22, rgba([5, 6, 12])); rectf(-96, -12, 192, 3, rgba(rimC, .4)); ctx.restore();
  strShoe(rimC, .85);
  ctx.restore();
  if (on) blurred(8, () => oval(cx, G + 16, 300 + 500 * a, 26 + 30 * a, rgba([225, 235, 255], .34 * (1 - clamp(a / .5)))));   // foam where it broke
  crown(true); drops(true);
  // water flung at the lens
  if (on) blurred(15, () => { for (let i = 0; i < 9; i++) { const an = -Math.PI * (.12 + .76 * rnd(i * 3.9)), sp = 900 + rnd(i * 5.5) * 1500, x = cx + Math.cos(an) * sp * a, y = G + Math.sin(an) * sp * a + 900 * a * a; oval(x, y, 18 + 90 * a, 16 + 70 * a, rgba([180, 205, 255], .34 * (1 - clamp(a / .62)))); } });
  rain(t, { n: 230, len: 130, speed: 2700, slant: -.25, a: .34, seed: 8 });
  cam(...fr);
}, { bloom: .5, grain: .55 }, [560, 250, 1360, 1000]);

// ---------- RUNFACE: his face, running at us; rain, lamps sweeping over him ----------
function strRainLens(t, n, vp, a, k0 = 0, k1 = 1, seed = 0) {            // rain flying at the lens, out from vp; k0..k1 picks the far or near part of each drop's flight
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const an = rnd(i * 2.7 + seed) * TAU, k = lerp(k0, k1, (rnd(i * 7.1 + seed) + t * (1.5 + rnd(i * 3.3) * 1.5)) % 1), dx = Math.cos(an), dy = Math.sin(an) * .8 + .55, dn = Math.hypot(dx, dy);
    const r = 70 + 1500 * k * k, ln = 24 + 380 * k * k;
    ctx.strokeStyle = rgba(mix(PAL.rainB, [235, 242, 255], k), a * Math.min(1, k * 5) * (1 - k * .35)); ctx.lineWidth = 1.4 + 5 * k;
    ctx.beginPath(); ctx.moveTo(vp[0] + dx / dn * r, vp[1] + dy / dn * r); ctx.lineTo(vp[0] + dx / dn * (r + ln), vp[1] + dy / dn * (r + ln)); ctx.stroke();
  }
}
shot('runface', (t, p, L, len) => {
  const u = clamp(L / len), st = L * 2.9 * Math.PI + .7, c1 = len * .27, c2 = len * .78, wd = len * .2, w1 = strBump(L, c1, wd), w2 = strBump(L, c2, wd), warm = Math.max(w1, w2);
  const sw = clamp(((w1 >= w2 ? L - c1 : L - c2) + wd) / (2 * wd));                                              // 0 … 1 through a sweep
  fill([24, 28, 96], [8, 10, 32]);
  const fr = kcam(L, len, [[0, 1, 960, 548], [1, 1.07, 960, 538]], { hand: 1, t, jolt: .1 });
  // the street he has come down runs away behind him: lamps and windows shrink toward its far end
  const VP = [1400, 420], items = [];
  for (let i = 0; i < 9; i++) for (const sd of [-1, 1]) { const zz = ((i * 1.0 + (sd > 0 ? .5 : 0) + L * 2.7) % 9) + .22, k = 1 / (1 + zz); items.push({ k, sd, i, x: VP[0] + sd * 1500 * k, y: VP[1] - 1050 * k, gy: VP[1] + 560 * k }); }
  blurred(9, () => {
    poly([[VP[0] - 30, VP[1]], [VP[0] + 30, VP[1]], [2700, 1300], [-800, 1300]], lg(0, VP[1], 0, 1100, [[0, [60, 60, 160]], [1, [14, 16, 50]]]));
    for (const sd of [-1, 1]) poly([[VP[0] + sd * 40, VP[1] - 30], [VP[0] + sd * 40, VP[1] + 14], [VP[0] + sd * 2400, 1100], [VP[0] + sd * 2400, -700]], rgba([18, 20, 66]));   // the house fronts either side
    for (const q of items) { const c = [PAL.amber, PAL.tealL, [255, 150, 70], [150, 130, 255]][(q.i + (q.sd > 0 ? 1 : 0)) % 4]; rectf(VP[0] + q.sd * 2300 * q.k - 150 * q.k, VP[1] - 420 * q.k, 300 * q.k, 330 * q.k, rgba(c, .75 * clamp(q.k * 6))); }
    for (const q of items) { ctx.strokeStyle = rgba([8, 10, 30]); ctx.lineWidth = 34 * q.k; line(q.x, q.y, q.x, q.gy); }
  });
  additive(() => { for (const q of items) {
    const al = clamp(q.k * 7);
    lite(PAL.lamp, q.x, q.y, 380 * q.k + 14, .6 * al); lite([255, 232, 200], q.x, q.y, 90 * q.k + 4, .6 * al);
    ctx.save(); ctx.translate(q.x, q.gy + 120 * q.k); ctx.scale(.3, 1); lite(PAL.lamp, 0, 0, 520 * q.k, .3 * al); ctx.restore();
  } });
  haze(t, -200, 2100, 470, 260, [80, 80, 190], .08, 2, 7);
  rain(t, { n: 150, len: 100, speed: 2300, slant: .08, a: .22, seed: 4 }); cam(...fr);
  strRainLens(t, 60, VP, .3, 0, .55, 1);
  // light passing over him: warm from a lamp, then the blue night again
  additive(() => lite(PAL.lamp, lerp(1900, 60, sw), 150, 1000, .22 * warm));
  const bx = 944 + Math.sin(st) * 13, by = 486 - Math.abs(Math.sin(st)) * 24 + 10, r = 250, tilt = Math.sin(st + .5) * .04 - .02;
  const blink = strBump(L, len * .52, .09), breath = .5 + .5 * Math.sin(st * 1.0 + 1.2);
  const ex = Object.assign({}, exMix('strain', 'fear', .5), { lid: .04 + .85 * blink, brow: .62, browH: .13, open: .95 + .4 * breath, grit: 0, smile: -.42, gx: .15, gy: -.1, sweat: 1, tear: 0 });
  const rim = mix(STR.blue, PAL.lamp, warm), lc = [lerp(-.75, lerp(.9, -.5, sw), warm), -.45];
  additive(() => { lite(mix(STR.blue, PAL.lamp, warm), bx - 40, by + 60, 760, .2 + .1 * warm); });
  manBust(bx, by, r, ex, { rim, ra: .78 + .2 * warm, lc, light: rim, la: .34 + .24 * warm, turn: .5, wet: .5, t, tilt });
  { const mx = bx + r * lerp(0, .46, .5), my = by + .45 * r, mw = .32 * r * lerp(1, .8, .5), cy = my - ex.smile * .05 * r, dip = my + ex.smile * .1 * r, lo = ex.open * .16 * r;   // his open mouth: its lower lip (the engine draws the upper)
    ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt); ctx.translate(-bx, -by); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mx - mw / 2, cy); ctx.quadraticCurveTo(mx, dip - lo * .2, mx + mw / 2, cy); ctx.quadraticCurveTo(mx, dip + lo * 1.3, mx - mw / 2, cy); ctx.fillStyle = rgba([58, 26, 30]); ctx.fill();
    ctx.strokeStyle = rgba(C.cream, .9); ctx.lineWidth = .03 * r; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
  // rain running off his head, his breath in the cold
  ctx.save(); ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.clip(); ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) { const k = (t * (.5 + rnd(i * 2.1) * .5) + rnd(i * 5.9)) % 1, x = bx + (rnd(i * 3.3) - .5) * r * 1.5, y = by - r + k * r * 1.5; stroke([[x, y], [x + 2, y + 26 + 20 * k]], 4, rgba(mix([200, 220, 255], rim, .5), .4 * (1 - k))); }
  ctx.restore();
  additive(() => { for (let i = 0; i < 14; i++) { const k = (t * 2.2 + rnd(i * 3.7)) % 1, an = -Math.PI * (.08 + .84 * rnd(i * 5.3)), d = r * (1.02 + k * .5); lite(rim, bx + Math.cos(an) * d, by + Math.sin(an) * d + k * k * 90, 7 + 5 * rnd(i), .7 * (1 - k)); } });
  strRainLens(t, 46, [VP[0] - 60, VP[1] - 40], .5, .45, 1, 9);
}, { bloom: .44, grain: .55 }, [640, 190, 1280, 880]);

// ---------- WALKAWAYPIC: the last picture. Golden hour; Lily on his shoulders, they walk into the sun ----------
// The upper middle of the frame (x 500-1420, y 300-640) is kept calm and bright for the film's last words.
const strCamH = 480;                                                       // the camera's height over the road, in road units
const strP = (X, Hh, k) => [960 + X * k, 640 + (strCamH - Hh) * k];       // X across the road from its middle, Hh above the ground, k the depth scale (1 near … 0 the horizon)
const strGlare = [250, 188, 150];
const strFar = (c, k) => mix(strGlare, c, clamp(Math.pow(clamp(k * 1.15), 1.4)));
// the two of them from behind: he walks (ph), she rides his shoulders, her legs down either side of his head, her boots in
// his hands; o.wings 0-1 her arms out (0 = her hands on his head); o.flat one colour (their shadow)
function strRide(x, gy, s, ph, o = {}) {
  const flat = o.flat, ink = flat || PAL.ink, rimC = o.rim || [255, 220, 170], ra = flat ? 0 : (o.ra ?? .9), w = o.wings || 0;
  const lf = Math.max(0, Math.sin(ph)), rf = Math.max(0, -Math.sin(ph)), bx = x + (lf - rf) * 4 * s, bob = (1 - Math.abs(Math.sin(ph))) * 5 * s - (o.hop || 0) * s;
  const hipY = gy - 192 * s + bob, shY = hipY - 172 * s;
  const leg = (sd, lift) => { const hip = [bx + sd * 19 * s, hipY], foot = [x + sd * 24 * s, gy - lift * 15 * s]; return [hip, [lerp(hip[0], foot[0], .5) + sd * (3 + lift * 6) * s, lerp(hip[1], foot[1], .5) - lift * 7 * s], foot]; };
  const arm = sd => [[bx + sd * 47 * s, shY + 14 * s], [bx + sd * 90 * s, shY + 70 * s], [bx + sd * 56 * s, shY - 8 * s]];
  const P = { head: [bx, shY - 58 * s, 38 * s], parts: [[leg(-1, lf), 33 * s], [leg(1, rf), 33 * s], [[[bx, hipY - 6 * s], [bx, shY + 12 * s]], 76 * s], [[[bx - 40 * s, shY + 8 * s], [bx + 40 * s, shY + 8 * s]], 34 * s], [arm(-1), 22 * s], [arm(1), 22 * s]] };
  if (flat) { for (const [pts, wd] of P.parts) stroke(pts, wd, rgba(flat)); disc(P.head[0], P.head[1], P.head[2], rgba(flat)); }
  else drawPerson(P, ink, rimC, ra, 0, -1, false);
  const sL = 1.45 * s, rock = Math.sin(ph - .7) * 3 * s, lx = bx + rock, seat = shY - 72 * s, top = seat - 60 * sL, hd = [lx + rock * .5, top - 31 * sL], hr = 31 * sL;
  const Y = flat || PAL.yellow, YD = flat || PAL.yellowD, YL = flat || PAL.yellowL;
  const legs = [-1, 1].map(sd => [[[lx + sd * 12 * sL, seat], [bx + sd * 47 * s, shY - 38 * s], [bx + sd * 54 * s, shY + 2 * s]], 12.5 * sL]);
  if (flat) for (const [pts, wd] of legs) stroke(pts, wd, rgba(flat)); else strLimbs(legs, ink, rimC, ra * .8, 0, -1, 8);
  for (const sd of [-1, 1]) {                                              // her boots, and his hands round her shins
    stroke([[bx + sd * 54 * s, shY - 2 * s], [bx + sd * 55 * s, shY + 13 * s]], 13.5 * sL, rgba(Y));
    disc(bx + sd * 55 * s, shY - 15 * s, 12.5 * s, rgba(flat || mix(ink, rimC, .3))); disc(bx + sd * 55 * s, shY - 13 * s, 11.5 * s, rgba(ink));
  }
  const coat = () => { ctx.beginPath(); ctx.moveTo(lx - 20 * sL, top); ctx.lineTo(lx + 20 * sL, top); ctx.quadraticCurveTo(lx + 30 * sL, top + 30 * sL, lx + 34 * sL, seat + 8 * sL); ctx.quadraticCurveTo(lx, seat + 18 * sL, lx - 34 * sL, seat + 8 * sL); ctx.quadraticCurveTo(lx - 30 * sL, top + 30 * sL, lx - 20 * sL, top); ctx.closePath(); };
  coat(); ctx.fillStyle = flat ? rgba(flat) : lg(lx - 34 * sL, 0, lx + 34 * sL, 0, [[0, YD], [.3, Y], [.7, Y], [1, YD]]); ctx.fill();
  if (!flat) { ctx.strokeStyle = rgba(YD, .8); ctx.lineWidth = 1.6 * sL; coat(); ctx.stroke(); ctx.strokeStyle = rgba(YD, .55); ctx.lineWidth = 1.4 * sL; line(lx, top + 6 * sL, lx, seat + 10 * sL); }
  const armPts = sd => {                                                    // down: her hands on his head; out: wings
    const down = [[lx + sd * 33 * sL, top + 30 * sL], [bx + sd * 31 * s, shY - 80 * s]], out = [[lx + sd * 47 * sL, top + 6 * sL], [lx + sd * 75 * sL, top + (-2 + Math.sin(ph * 2 + sd) * 3) * sL]];
    return [[lx + sd * 19 * sL, top + 8 * sL], v2.lerp(down[0], out[0], w), v2.lerp(down[1], out[1], w)];
  };
  for (const sd of [-1, 1]) { const a = armPts(sd); if (!flat) stroke(a, 16.5 * sL, rgba(YD, .9)); stroke(a, 13.5 * sL, rgba(flat || mix(Y, YD, .3))); disc(a[2][0], a[2][1], 6.5 * sL, rgba(ink)); }
  disc(hd[0], hd[1], hr * 1.24, rgba(Y));
  if (!flat) {
    ctx.save(); ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.24, 0, TAU); ctx.clip();
    ctx.fillStyle = lg(0, hd[1] - hr * 1.24, 0, hd[1] + hr * 1.24, [[0, YL, .95], [.45, Y, 0], [1, YD, .7]]); ctx.fillRect(hd[0] - hr * 2, hd[1] - hr * 2, hr * 4, hr * 4);
    ctx.strokeStyle = rgba(YD, .6); ctx.lineWidth = 1.4 * sL; line(hd[0], hd[1] - hr * 1.2, hd[0], hd[1] + hr * 1.24); ctx.restore();
    ctx.strokeStyle = rgba(YD, .8); ctx.lineWidth = 1.5 * sL; ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.24, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba([255, 250, 224], .9); ctx.lineWidth = 2.6 * sL; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 1.2, Math.PI * 1.14, Math.PI * 1.86); ctx.stroke();
  }
}
function strHouseRow(sd, t) {
  const ks = [2.4, 1.36, 1.02, .84, .74], hs = sd < 0 ? [1000, 900, 1060, 880] : [940, 1040, 900, 1000], X = sd * 664;
  const cols = sd < 0 ? [[150, 98, 100], [98, 112, 136], [132, 102, 124], [96, 122, 120]] : [[100, 116, 138], [146, 104, 104], [92, 120, 118], [136, 106, 126]];
  const kAt = (i, f) => 1 / lerp(1 / ks[i], 1 / ks[i + 1], f);
  for (let i = ks.length - 2; i >= 0; i--) {
    const k0 = ks[i], k1 = ks[i + 1], h = hs[i], c = cols[i], km = (k0 + k1) / 2;
    const q = (f, Hh) => strP(X, Hh, kAt(i, f));
    ctx.fillStyle = lg(0, strP(X, h, km)[1], 0, strP(X, 0, km)[1], [[0, strFar(mix(c, [255, 200, 150], .3), km)], [1, strFar(mix(c, [40, 26, 60], .3), km)]]);
    poly([q(0, 0), q(0, h), q(1, h), q(1, 0)]); ctx.fill();
    poly([q(0, h), q(0, h + 70), q(1, h + 70), q(1, h)], rgba(strFar(mix(c, [50, 30, 50], .55), km)));       // the roof's edge
    stroke([q(0, h + 70), q(1, h + 70)], 3, rgba([255, 226, 180], .8));
    for (let r = 0; r < 2; r++) for (let j = 0; j < 3; j++) {                                                    // windows: some hold the sky
      const f0 = .12 + j * .3, f1 = f0 + .17, y0 = 330 + r * 330, y1 = y0 + 190, lit = rnd(i * 7.3 + j * 3.1 + r + (sd > 0 ? 9 : 0)) > .45;
      poly([q(f0, y0), q(f0, y1), q(f1, y1), q(f1, y0)], rgba(strFar(lit ? [255, 196, 164] : mix(c, [30, 30, 60], .6), km), lit ? .9 : .95));
    }
    poly([q(.46, 0), q(.46, 250), q(.58, 250), q(.58, 0)], rgba(strFar(mix(c, [30, 20, 40], .7), km)));     // a door
    stroke([q(1, 0), q(1, h + 70)], 2.5, rgba([40, 26, 50], .35));
  }
}
shot('walkawaypic', (t, p, L, len) => {
  const u = clamp(L / len), ph = L * TAU * .86 + .4;
  fill([116, 150, 214], [120, 80, 84]);
  const fr = kcam(L, len, p.cam || [[0, 1, 960, 542], [1, 1.04, 960, 530]], { hand: .2, t });
  // the sky: blue above, peach, then gold over the far end of the road; a low sun behind the haze
  rectf(-800, -700, 3520, 1342, lg(0, -500, 0, 640, [[0, [100, 138, 212]], [.5, [204, 160, 192]], [.76, [246, 176, 156]], [1, [252, 188, 150]]]));
  ctx.fillStyle = rg(960, 652, 0, 760, [[0, [255, 214, 188], .95], [.16, [255, 202, 170], .8], [.5, [253, 188, 152], .3], [1, [253, 188, 152], 0]]); ctx.fillRect(-800, -700, 3520, 1342);
  blurred(10, () => { for (let i = 0; i < 6; i++) { const x = [-140, 260, 1500, 1880, 620, 1240][i] + L * (5 + i), y = [120, 60, 90, 180, -40, -10][i]; oval(x, y, 190 + rnd(i * 3) * 120, 15 + rnd(i * 5) * 10, rgba([255, 206, 180], .5)); } });   // thin cloud, high and to the sides
  // the ground: gardens, pavements, the road running to the sun
  rectf(-800, 640, 3520, 900, lg(0, 640, 0, 1100, [[0, [248, 186, 148]], [.12, [200, 148, 116]], [1, [84, 82, 76]]]));
  for (const sd of [-1, 1]) { ctx.fillStyle = lg(0, 640, 0, 1100, [[0, [250, 190, 152]], [.2, [218, 158, 132]], [1, [120, 88, 98]]]); poly([strP(sd * 420, 0, .01), strP(sd * 664, 0, .01), strP(sd * 664, 0, 2.4), strP(sd * 420, 0, 2.4)]); ctx.fill(); }
  ctx.fillStyle = lg(0, 640, 0, 1100, [[0, [252, 194, 156]], [.1, [228, 156, 126]], [.34, [166, 106, 104]], [1, [88, 60, 80]]]); poly([strP(-420, 0, .01), strP(420, 0, .01), strP(420, 0, 2.4), strP(-420, 0, 2.4)]); ctx.fill();
  ctx.fillStyle = lg(0, 640, 0, 1080, [[0, [255, 214, 190], .7], [.3, [255, 200, 168], .3], [1, [255, 190, 150], 0]]); poly([strP(-70, 0, .01), strP(70, 0, .01), strP(190, 0, 2.2), strP(-190, 0, 2.2)]); ctx.fill();   // the sun lies on the road
  for (const sd of [-1, 1]) { stroke([strP(sd * 420, 0, .02), strP(sd * 420, 0, 2.4)], 5, rgba([255, 222, 176], .6)); stroke([strP(sd * 434, 0, .02), strP(sd * 434, 0, 2.4)], 4, rgba([60, 36, 60], .28)); }
  for (let n = 0; n < 12; n++) { const Z = .5 + n * .3, k0 = 1 / Z, k1 = 1 / (Z + .12); poly([strP(-7, 0, k0), strP(7, 0, k0), strP(7, 0, k1), strP(-7, 0, k1)], rgba([255, 232, 200], .5 * clamp(k0 * 1.5))); }
  // hedges and garden walls, the houses near us, young trees along the kerb with long shadows toward us
  for (const sd of [-1, 1]) {
    ctx.fillStyle = lg(0, 640, 0, 1000, [[0, strGlare], [.16, [150, 128, 96]], [1, [52, 70, 58]]]); poly([strP(sd * 700, 0, .02), strP(sd * 700, 170, .02), strP(sd * 700, 170, .74), strP(sd * 700, 0, .74)]); ctx.fill();
    strHouseRow(sd, t);
    ctx.fillStyle = lg(0, 640, 0, 1100, [[0, strGlare], [.2, [172, 124, 108]], [1, [96, 66, 80]]]); poly([strP(sd * 664, 0, .02), strP(sd * 664, 96, .02), strP(sd * 664, 96, 2.4), strP(sd * 664, 0, 2.4)]); ctx.fill();
    stroke([strP(sd * 664, 96, .05), strP(sd * 664, 96, 2.4)], 3, rgba([255, 226, 180], .7));
    [.31, .4, .52, .7, .98, 1.5].forEach((k0, n) => {                            // young trees, each a little different
      const k = k0 * (1 + (rnd(n * 3.1 + sd) - .5) * .08), X = sd * (536 + rnd(n * 5.7 + sd) * 40), sway = Math.sin(t * 1.1 + k * 9 + sd) * 5, k2 = 1 / Math.max(.3, 1 / k - 1.15), base = strP(X, 0, k), sz = .82 + rnd(n * 7.3 + sd * 2) * .3, cTop = strP(X, 310 + 40 * sz, k);
      ctx.fillStyle = lg(0, base[1], 0, strP(X, 0, k2)[1], [[0, [70, 38, 80], .44], [1, [70, 38, 80], .12]]); poly([strP(X - 9, 0, k), strP(X + 9, 0, k), strP(X + 130 * sz, 0, k2), strP(X - 130 * sz, 0, k2)]); ctx.fill();
      stroke([base, strP(X, 280, k)], 14 * k, rgba(strFar([52, 32, 44], k)));
      for (const [ox, oy, r] of [[0, 0, 96], [-58, 30, 66], [60, 24, 70], [-6, -52, 64]]) disc(cTop[0] + (ox * sz + sway) * k, cTop[1] + oy * sz * k, r * sz * k, rgba(strFar([46, 78, 72], k)));
      for (const [ox, oy, r] of [[-16, -44, 50], [44, -6, 42], [-52, 8, 38]]) disc(cTop[0] + (ox * sz + sway) * k, cTop[1] + oy * sz * k, r * sz * k, rgba(strFar([92, 124, 96], k), .8));
      ctx.strokeStyle = rgba([255, 206, 170], .8 * clamp(k * 2)); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.arc(cTop[0] + (-6 * sz + sway) * k, cTop[1] - 52 * sz * k, 64 * sz * k, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    });
  }
  // the glare at the end of the road takes the far things
  ctx.fillStyle = rg(960, 646, 0, 520, [[0, [255, 212, 190], .6], [.4, [254, 196, 164], .3], [1, [254, 190, 152], 0]]); ctx.fillRect(-200, 300, 2320, 700);
  motes(t, [330, 660, 1590, 1060], 26, [255, 222, 176], .3, 8);
  // the two of them: away from us, up the middle of the road, into the light
  const k = 1 / lerp(1 / .72, 1 / .64, u), [fx, fy] = strP(14, 0, k), s = .74 * k, hop = strBump(L, len * .47, .2) * 8, wings = (p.wings ?? 1) * seg(L, len * .44, len * .6, ease.back);
  blurred(3.5, () => { ctx.save(); ctx.translate(fx, fy + 2); ctx.scale(1.7, -2.3); ctx.translate(-fx, -fy); strRide(fx, fy, s, ph, { flat: [60, 34, 64], wings, hop: 0 }); ctx.restore(); });                    // their long shadow, toward us
  ctx.fillStyle = rg(fx, fy - 250 * s, 0, 330 * s, [[0, [255, 218, 196], .4], [1, [255, 206, 176], 0]]); ctx.fillRect(fx - 400, fy - 700 * s, 800, 800 * s);
  strRide(fx, fy, s, ph, { wings, hop, rim: [255, 226, 180], ra: .95 });
  // leaves come down across the road; a branch near the lens in each top corner
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1, kk = (t * (.05 + rnd(i * 2.3) * .04) + rnd(i * 5.1)) % 1, x = 960 + side * (570 + rnd(i * 3.7) * 380) + Math.sin(t * 1.3 + i) * 30 - side * kk * 60, y = 200 + kk * 900;
    oval(x, y, 12, 5.5, rgba([[198, 100, 46], [164, 72, 40], [218, 130, 64]][i % 3], .95), t * (1.5 + rnd(i) * 2) + i);
  }
  for (let i = 0; i < 4; i++) { const kk = (t * .07 + rnd(i * 9.1)) % 1; oval(700 + rnd(i * 4.4) * 520 + Math.sin(t + i * 2) * 50, 730 + kk * 370, 9, 4, rgba([204, 108, 50], .9), t * 2.2 + i); }
  blurred(11, () => {
    for (let i = 0; i < 22; i++) { const lf = i < 13, x = lf ? -160 + rnd(i * 3.7) * 600 : 1500 + rnd(i * 3.7) * 560, y = -90 + rnd(i * 5.3) * (lf ? 330 : 250) * (1 - (lf ? rnd(i * 3.7) : 1 - rnd(i * 3.7)) * .55); oval(x + Math.sin(t * 1.2 + i) * 9, y + Math.cos(t + i * 1.7) * 6, 96, 40, rgba([[44, 76, 56], [78, 108, 60], [34, 60, 52]][i % 3], .96), rnd(i * 2.1) * 3); }
    stroke([[-200, 40], [140, 96], [430, 70]], 22, rgba([40, 26, 36])); stroke([[2120, 20], [1800, 80], [1560, 60]], 18, rgba([40, 26, 36]));
  });
}, { bloom: .12, grain: .45 }, [730, 600, 1190, 1070]);
