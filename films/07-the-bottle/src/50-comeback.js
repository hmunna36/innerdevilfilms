// ---------- THE COMEBACK: the walk home in the rain, and the mornings after ----------
// Shots: walkhome, sink, pushups (p.mode 'watch' | 'count'), bridge, pullups, hand.
// The thread: on the night she would not let him hold her; in each shot she is a little closer to him.
// The night is indigo with warm lamps; the mornings are pink-gold dawn. Lily's yellow is the only yellow.
// Every top-level name here starts with cmb.

const cmbRim = [255, 198, 152];                                            // the dawn sun on a dark figure: gold-pink
const cmbLR = 1.25;                                                        // Lily's scale beside his: she reaches his waist, her head no bigger than his
const cmbU = (L, len) => clamp(L / Math.max(.001, len));
const cmbBump = (v, a, b, c) => v <= a || v >= c ? 0 : v < b ? E.sine(inv(a, b, v)) : E.sine(inv(c, b, v));   // 0 at a, 1 at b, 0 at c
const cmbBlink = (ex, L, at, d = .07) => Math.abs(L - at) < d ? Object.assign({}, ex, { lid: Math.max(ex.lid, 1 - Math.abs(L - at) / d) }) : ex;

// a dark shape of round-capped strokes, lit on the side toward (lx, ly): parts [[pts, w], …].
// o: fill, rim, a, lx, ly, off (how far the lit edge shows), rim2 / a2 / l2 (a second light from another side)
function cmbSil(parts, o = {}) {
  const fillc = o.fill || PAL.ink, rim = o.rim || cmbRim, a = o.a ?? .7, off = o.off ?? 5;
  const n = Math.hypot(o.lx ?? 0, o.ly ?? -1) || 1, ux = (o.lx ?? 0) / n, uy = (o.ly ?? -1) / n;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const edge = (col, al, dx, dy) => {
    if (al <= .003) return;
    ctx.save(); ctx.shadowColor = rgba(col, Math.min(1, al)); ctx.shadowBlur = (o.blur ?? 16) * pxPerUnit(ctx);
    ctx.strokeStyle = rgba(col, Math.min(1, al * 1.35));
    for (const [pts, w] of parts) limb(pts.map(q => [q[0] + dx * off, q[1] + dy * off]), w + off);
    ctx.restore();
  };
  if (o.rim2) { const m = Math.hypot(o.l2[0], o.l2[1]) || 1; edge(o.rim2, o.a2 ?? .5, o.l2[0] / m, o.l2[1] / m); }
  edge(rim, a, ux, uy);
  const hi = mix(fillc, rim, .3);
  for (const [pts, w] of parts) {
    ctx.strokeStyle = rgba(fillc); limb(pts, w);
    if (a > .003) { ctx.strokeStyle = rgba(hi, .5 * Math.min(1, a * 1.3)); limb(pts.map(q => [q[0] + ux * w * .22, q[1] + uy * w * .22]), w * .26); }
  }
}
// the sun, low: a white-gold disc in pink-gold light
function cmbSun(x, y, r, a = 1) {
  additive(() => { lite(PAL.dawnA, x, y, r * 6, .34 * a); lite(PAL.dawnB, x, y, r * 3.2, .5 * a); lite([255, 246, 230], x, y, r * 1.7, .7 * a); });
  disc(x, y, r, rgba([255, 251, 242], a));
}
// his face on a head that is tilted (push-ups, pull-ups): o.tilt radians (+ = chin down), turn, light, la, lc
function cmbManFace(P, ex, o = {}) {
  const [x, y, r] = P.head, e = typeof ex === 'string' ? EXPR[ex] : ex;
  ctx.save(); ctx.translate(x, y); if ((P.d || 1) < 0) ctx.scale(-1, 1); ctx.rotate(o.tilt || 0);
  face(0, 0, r, e, { turn: o.turn ?? .9, light: o.light || cmbRim, la: o.la ?? .32, lc: o.lc || [.5, -.4] });
  ctx.restore();
}
// Lily's face alone, turned: tr 1 = the way she faces … 0 = at us … -1 = back over her shoulder
function cmbLilyFace(P, ex, tr, o = {}) {
  const [hx, hy, r] = P.head, s = P.s, flip = (P.d < 0) !== (tr < 0);
  ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.clip();
  ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); if (flip) ctx.scale(-1, 1);
  face(-1 * s, r * .16, r * 1.22, typeof ex === 'string' ? LILY_EX[ex] : ex, { turn: Math.abs(tr) * .75, light: o.rim || PAL.lamp, la: o.la ?? .28, lc: [.4, -.5], featA: .95 });
  ctx.restore();
}

// =====================================================================================================================
// WALKHOME: night, rain. She walks ahead under the teacher's big umbrella; he follows three steps behind, bare-headed.
// A low camera on the wet road: the kerb is almost level, the lamps run away to the right.
// =====================================================================================================================
const cmbWH = { vx: 3200, yh: 752, x0: 540, c: 24, g: .25, mir: 789 };
// a point of the street: u = how far down it (in lamp spacings from him), v = height above the pavement (px at his distance)
function cmbWP(u, v = 0, c = cmbWH.c) {
  const f = 1 / (1 + cmbWH.g * Math.max(-3.3, u));
  return [cmbWH.vx + (cmbWH.x0 - cmbWH.vx) * f, cmbWH.yh + (c - v) * f, f];
}
const cmbWQ = (u0, u1, v0, v1, c = 4) => [cmbWP(u0, v0, c), cmbWP(u1, v0, c), cmbWP(u1, v1, c), cmbWP(u0, v1, c)];
function cmbStreet(t, sh) {
  const K = cmbWH;
  additive(() => { lite([64, 56, 150], 1960, 560, 1000, .5); lite([130, 96, 200], 2050, 690, 460, .4); });   // the far end of the street glows through the rain
  rectf(-900, K.yh - 6, 4600, 60, rgba([34, 38, 96]));                                 // the pavement: a thin band from down here
  for (let i = 18; i >= -3; i--) {                                                      // the house fronts, far to near
    const u0 = i * .8 - sh, u1 = u0 + .8, id = i + 40;
    const top = 720 + rnd(id * 3.3) * 240, tone = mix([18, 22, 68], [30, 32, 98], rnd(id * 5.1)), trim = mix(tone, [90, 96, 184], .35);
    poly(cmbWQ(u0, u1, 0, top), rgba(tone));
    poly(cmbWQ(u0, u1, 372, 386), rgba(trim));
    poly(cmbWQ(u0, u0 + .014, 0, top), rgba([8, 10, 34], .6));
    poly(cmbWQ(u0 + .08, u0 + .25, 0, 262), rgba([10, 12, 40]));                         // a door and its step
    poly(cmbWQ(u0 + .06, u0 + .27, 0, 14), rgba(trim));
    [[.36, .7, 120, 300], [.1, .34, 440, 620], [.46, .7, 440, 620]].forEach(([a, b, v0, v1], j) => {
      const lit = i > 2 && rnd(id * 7.7 + j * 3.1) < .16, q = cmbWQ(u0 + a, u0 + b, v0, v1);
      poly(q, rgba([12, 16, 52]));
      if (lit) { poly(q, rgba([236, 150, 124], .42)); const c = v2.lerp(q[0], q[2], .5); additive(() => lite([255, 170, 130], c[0], c[1], 150 * q[0][2], .16)); }   // someone is still up, far down the street
      else poly(cmbWQ(u0 + a, u0 + b, v1 - 22, v1), rgba([70, 86, 180], .2));                                 // the sky on dark glass
      poly(cmbWQ(u0 + a - .012, u0 + b + .012, v0 - 12, v0), rgba(trim));
    });
  }
}
// a street lamp at u: the post, the lantern, its cone, its pool, and the rain that shows in its light
function cmbStreetLamp(u, t) {
  if (u < -2.2) return;
  const [x, y, f] = cmbWP(u, 0, 8), top = y - 640 * f, ink = [8, 10, 28];
  stroke([[x, y], [x, top + 26 * f]], 11 * f, rgba(ink)); stroke([[x, y], [x, y - 70 * f]], 20 * f, rgba(ink));
  stroke([[x - 30 * f, top + 96 * f], [x + 30 * f, top + 96 * f]], 6 * f, rgba(ink));
  poly([[x - 22 * f, top + 26 * f], [x + 22 * f, top + 26 * f], [x + 34 * f, top - 30 * f], [x - 34 * f, top - 30 * f]], rgba([255, 232, 190], .92));
  poly([[x - 40 * f, top - 30 * f], [x + 40 * f, top - 30 * f], [x + 14 * f, top - 54 * f], [x - 14 * f, top - 54 * f]], rgba(ink));
  ctx.strokeStyle = rgba(ink); ctx.lineWidth = 3 * f;
  line(x - 22 * f, top + 26 * f, x - 34 * f, top - 30 * f); line(x + 22 * f, top + 26 * f, x + 34 * f, top - 30 * f); line(x, top + 26 * f, x, top - 30 * f);
  const lc = [255, 190, 112];
  additive(() => { lite(lc, x, top, 250 * f, .8); lite([255, 232, 196], x, top, 56 * f, .9); lite(lc, x, y - 230 * f, 460 * f, .3); });
  cone(x, top + 6 * f, 30 * f, 310 * f, 646 * f, lc, .2);
  pool(x, y + 14 * f, 340 * f, 30 * f, lc, .7);
  additive(() => {
    ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const sp = 1.25 + rnd(i * 1.3) * .6, tt = t * sp + rnd(i * 3.1), h = tt % 1;
      const xx = x + (rnd(i * 1.7 + Math.floor(tt) * 5.3) - .5) * 2 * lerp(30, 300, h) * f, yy = top + h * 640 * f;
      ctx.strokeStyle = rgba(PAL.lamp, .5 * (1 - h * .6)); ctx.lineWidth = 2.4 * f; line(xx, yy, xx - 7 * f, yy - 44 * f);
    }
  });
}
// the teacher's umbrella, far too big for her: c = where the shaft meets the canopy, rx its half-width, tilt radians
function cmbUmbrella(c, rx, tilt, t) {
  const ry = rx * .6, rz = rx * .17, n = 4, rim = a => [Math.cos(a) * rx, Math.sin(a) * rz];
  ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(tilt); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-rx, 0); ctx.bezierCurveTo(-rx, -ry * 1.3, rx, -ry * 1.3, rx, 0);
  for (let i = 0; i < n; i++) { const q = rim(Math.PI * (i + 1) / n), am = Math.PI * (i + .5) / n; ctx.quadraticCurveTo(Math.cos(am) * rx * .93, Math.sin(am) * rz * .45, q[0], q[1]); }
  ctx.closePath();
  ctx.fillStyle = lg(-rx * .3, -ry, rx * .2, rz, [[0, [186, 196, 222]], [.38, [112, 130, 168]], [1, [64, 78, 120]]]); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, rx * .985, rz, 0, 0, TAU); ctx.fillStyle = lg(-rx, 0, rx, 0, [[0, [24, 30, 58]], [1, [42, 52, 90]]]); ctx.fill();   // the underside
  ctx.strokeStyle = rgba([84, 98, 150], .55); ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) { const q = rim(i * TAU / 8 + .2); line(0, 0, q[0], q[1]); }
  ctx.strokeStyle = rgba([44, 54, 96], .55); ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) { const q = rim(Math.PI + Math.PI * i / 4); ctx.beginPath(); ctx.moveTo(0, -ry * .975); ctx.quadraticCurveTo(q[0] * .8, -ry * .74, q[0], q[1]); ctx.stroke(); }
  ctx.strokeStyle = rgba([206, 218, 244], .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 0, rx * .985, rz, 0, Math.PI, TAU); ctx.stroke();   // the near edge
  ctx.strokeStyle = rgba([236, 242, 255], .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-rx * .62, -ry * .58); ctx.quadraticCurveTo(-rx * .3, -ry * .92, rx * .1, -ry * .95); ctx.stroke();   // a wet sheen
  stroke([[0, -ry * .96], [0, -ry * 1.14]], 5, rgba([20, 24, 44]));
  for (let i = 0; i < 9; i++) {                                                         // rain bursting on the cloth
    const tt = t * 5.5 + rnd(i * 4.7), k = tt % 1, uu = (rnd(i * 2.9 + Math.floor(tt) * 7.1) - .5) * 1.7, x = uu * rx, y = -ry * .975 * Math.pow(1 - uu * uu * .96, .62);
    ctx.strokeStyle = rgba([214, 228, 255], .8 * (1 - k)); ctx.lineWidth = 2;
    line(x, y, x - 7 * k - 3, y - 12 * k - 3); line(x, y, x + 7 * k + 3, y - 12 * k - 3);
  }
  for (let i = 0; i <= n; i++) {                                                        // and running off its points
    const q = rim(Math.PI * i / n), k = (t * 1.5 + rnd(i * 3.3)) % 1;
    oval(q[0], q[1] + 6 + k * k * 110, 2.4, 5.5, rgba([200, 216, 250], .75 * (1 - k)));
  }
  ctx.restore();
}
shot('walkhome', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbWH;
  fill([8, 10, 38], [28, 30, 92]);
  const fr = kcam(L, len, p.cam || [[0, 1.05, 925, 572], [1, 1.1, 968, 568]], { hand: .3, t });
  const sh = .12 + .2 * u;                                                               // the street slides by as we track with them
  cmbStreet(t, sh);
  rectf(-900, K.mir, 4600, 900, lg(0, K.mir, 0, K.mir + 330, [[0, [10, 12, 44]], [1, [20, 24, 68]]]));   // the road
  for (let j = 10; j >= -2; j--) cmbStreetLamp(j + .22 - sh, t);

  // Lily, ahead: small quick steps, both hands on the shaft, the canopy tipped back between them
  const ms = .92, [lx, ly] = cmbWP(1, 0), ls = ms * cmbLR, phL = L * TAU * 1.3 + 2;
  const lb = { at: [lx, ly], s: ls, dir: 1, pose: 'walk', ph: phL, lean: .05, nod: 3 };
  const P0 = lily(lb), hnd = [P0.sh[0] + 28 * ls, P0.sh[1] + 12 * ls];
  const tilt = -.2 + .05 * Math.sin(phL) + .03 * noise1(t * 1.5, 4), cc = v2.add(hnd, v2.pol(tilt, 124 * ls));
  cmbUmbrella(cc, 124 * ls, tilt, t);
  const PL = lily(Object.assign(lb, { arms: [hnd, [hnd[0] - 3 * ls, hnd[1] + 9 * ls]] }));
  drawLily(PL, cmbBlink(LILY_EX.blank, L, 1.5), { a: 1, rim: PAL.lamp, wet: .5 });
  stroke([v2.add(hnd, v2.pol(tilt, -18 * ls)), cc], 4.5 * ls, rgba([20, 24, 46]));
  disc(hnd[0], hnd[1], 6.5 * ls, rgba(PAL.ink));

  // him, three steps behind: shoulders down, head bowed, hands empty; one hand starts toward her and falls back
  const fy = K.yh + K.c, ph = L * TAU * .82 + .9, mx = K.x0 + 6 * Math.sin(u * 3);
  const mb = { hip: [mx, fy - (188 - 5 * Math.abs(Math.sin(ph))) * ms], s: ms, dir: 1, lean: .13, neck: .34, feet: stride(mx - 6 * ms, fy, ph, 40 * ms, 13 * ms, 1), swing: -Math.sin(ph) * .1 };
  let M = man(mb);
  const rk = cmbBump(u, .34, .58, .88) * .62;
  if (rk > .01) M = man(Object.assign(mb, { hands: [v2.lerp(M.j.handN, [M.j.sh[0] + 132 * ms, M.j.sh[1] + 112 * ms], rk), null] }));
  const look = seg(u, .58, .9);
  const ex = cmbBlink(Object.assign({}, EXPR.ashamed, { gx: lerp(.75, .1, look), gy: lerp(.25, .85, look) }), L, .5);
  drawMan(M, ex, { rim: PAL.lamp, a: .8, lx: .25, ly: -1, light: PAL.lamp, la: .34, lc: [.2, -.7] });
  additive(() => {                                                                      // the rain on his bare head and shoulders
    const sd = Math.floor(t * 14);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (rnd(sd * 7.3 + i * 3.1) - .5) * 2.4, r = M.head[2] * 1.04; lite([210, 226, 255], M.head[0] + Math.cos(a) * r, M.head[1] + Math.sin(a) * r, 9, .8); }
    for (let i = 0; i < 3; i++) lite([210, 226, 255], M.j.sh[0] + (rnd(sd * 3.7 + i * 5.3) - .5) * 60 * ms, M.j.sh[1] - 24 * ms, 8, .7);
  });

  wet(K.mir, 310, .55, t, 5);                                                           // the road mirrors all of it
  rectf(-900, K.mir - 3, 4600, 6, rgba([84, 92, 164], .55));                            // the kerb's wet edge
  ripples(t, -100, 2000, K.mir + 10, 1110, 46, [160, 180, 240], .32, 3);
  ripples(t, 0, 1900, K.yh + 16, K.mir - 5, 12, [255, 224, 176], .3, 9);
  blurred(11, () => {                                                                   // a post near the lens slides out of the frame
    const x = lerp(300, -260, u);
    rectf(x, -300, 78, 1700, rgba([5, 7, 22], .95)); rectf(x + 70, -300, 9, 1700, rgba([120, 142, 226], .5));
  });
  rain(t, { n: 210, len: 84, speed: 1900, slant: .15, a: .3 });
  rain(t, { n: 16, len: 260, speed: 2700, slant: .15, a: .13, w: 6, seed: 40 });
}, { bloom: .5, grain: .55 }, [400, 250, 1340, 880]);

// =====================================================================================================================
// THE KITCHEN at sunrise: sink (front on, the window over the sink) and pushups (low, on the floor)
// =====================================================================================================================
// a window full of dawn: sky, far roofs, the sun (o.sun [x, y, r]); a dark frame with glazing bars; it glows into the room
function cmbWindow(x0, y0, x1, y1, t, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  rectf(x0, y0, x1 - x0, y1 - y0, lg(0, y1 - 520, 0, y1, [[0, [184, 158, 214]], [.55, [250, 176, 158]], [1, [255, 212, 170]]]));
  if (o.sun) cmbSun(o.sun[0], o.sun[1], o.sun[2]);
  const base = o.roofs ?? y1 - 40, rc = [228, 150, 152];
  for (let i = 0; i < 18; i++) {
    const x = x0 - 40 + i * (x1 - x0 + 80) / 17, w = 50 + rnd(i * 3.7) * 70, h = 14 + rnd(i * 5.3) * 46;
    rectf(x, base - h, w, h + 4, rgba(rc, .78));
    if (rnd(i * 2.1) > .45) poly([[x - 4, base - h], [x + w / 2, base - h - 20], [x + w + 4, base - h]], rgba(rc, .78));
  }
  rectf(x0, base, x1 - x0, y1 - base + 4, rgba([222, 146, 150], .9));
  if (o.sun) additive(() => { lite(PAL.dawnB, o.sun[0], o.sun[1], o.sun[2] * 3, .3); lite([255, 248, 236], o.sun[0], o.sun[1], o.sun[2] * 1.5, .5); });   // it burns over the roofs
  ctx.restore();
  const fc = o.frame || [96, 62, 74], fw = o.fw || 16, n = o.panes || 3;
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.strokeStyle = rgba(fc); ctx.lineWidth = fw; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.lineWidth = fw * .6; for (let i = 1; i < n; i++) { const x = lerp(x0, x1, i / n); line(x, y0, x, y1); }
  ctx.strokeStyle = rgba([255, 230, 204], .55); ctx.lineWidth = 2; for (let i = 1; i < n; i++) { const x = lerp(x0, x1, i / n) + fw * .3; line(x, y0, x, y1); }
  additive(() => lite(PAL.dawnB, (x0 + x1) / 2, (y0 + y1) / 2 + 40, (x1 - x0) * .9, .13));
}
// a darker body under a bottle that stands against bright glass, so it reads
function cmbGlassBack(x, y, s, tilt = 0, a = .28, col = [52, 84, 98]) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s); bottlePath(); ctx.fillStyle = rgba(col, a); ctx.fill(); ctx.restore();
}
// a wire rack on the counter with n empty bottles upside down in it (x its left end, y the counter)
function cmbRack(x, y, s, n, t) {
  const w = (n * 78 + 30) * s, ink = [88, 62, 86];
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 5 * s;
  line(x - 10 * s, y - 62 * s, x + w, y - 62 * s);
  for (let i = 0; i < n; i++) {
    const bx = x + (40 + i * 78) * s, tl = Math.PI + (rnd(i * 3.7 + 1) - .5) * .16, bs = .7 * s;
    const B = [bx - 304 * bs * Math.sin(tl), y - 8 * s + 304 * bs * Math.cos(tl)];
    cmbGlassBack(B[0], B[1], bs, tl, .26);
    bottle(B[0], B[1], bs, { tilt: tl, cork: -1, level: 0, glass: [214, 244, 236] });
    additive(() => lite(PAL.dawnB, bx, y - 150 * s, 80 * s, .16));
  }
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 5 * s;
  line(x - 10 * s, y, x + w, y);
  for (let i = 0; i <= n; i++) { const xx = x - 10 * s + i * (w + 10 * s) / n; line(xx, y, xx, y - 62 * s); }
  ctx.strokeStyle = rgba([255, 228, 204], .6); ctx.lineWidth = 1.6 * s; line(x - 10 * s, y - 65 * s, x + w, y - 65 * s);
}
// the tap: a tall swan neck. (x, y) its foot on the counter; it reaches left
function cmbTap(x, y, s) {
  const ink = [76, 54, 78];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(ink); ctx.lineWidth = 13 * s;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 82 * s); ctx.arc(x - 34 * s, y - 82 * s, 34 * s, 0, Math.PI, true); ctx.lineTo(x - 68 * s, y - 58 * s); ctx.stroke();
  ctx.strokeStyle = rgba([255, 224, 200], .75); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.arc(x - 34 * s, y - 82 * s, 38 * s, -.15, -1.5, true); ctx.stroke();
  stroke([[x, y - 36 * s], [x + 30 * s, y - 48 * s]], 8 * s, rgba(ink));
  rectf(x - 13 * s, y - 8 * s, 26 * s, 12 * s, rgba(ink));
}
// the amber stream from m straight down to y1; k its strength
function cmbStream(m, y1, t, k, vx0 = 16) {
  if (y1 <= m[1] + 4 || k <= .01) return;
  const n = 14, pts = [], ws = [];
  for (let i = 0; i <= n; i++) {
    const q = i / n, y = lerp(m[1], y1, q), d = y - m[1];
    pts.push([m[0] + vx0 * (1 - Math.exp(-d / 50)) + Math.sin(d * .05 - t * 26) * 2.2 * q, y]);
    ws.push(lerp(9, 4.8, Math.pow(q, .6)) * k * (1 + .22 * Math.sin(t * 15 - d * .03)));
  }
  additive(() => { for (let i = 0; i <= n; i += 3) lite([255, 120, 30], pts[i][0], pts[i][1], 44, .16 * k); });
  poly(stripPts(pts, ws), lg(0, m[1], 0, y1, [[0, [232, 136, 40]], [.5, [206, 104, 22]], [1, [178, 84, 16]]]));
  stroke(pts.map((q, i) => [q[0] - ws[i] * .45, q[1]]), 2.2, rgba([255, 226, 190], .8 * k));
}
const cmbKS = { top: 700, back: 640, sill: 470 };
shot('sink', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbKS;
  fill([140, 94, 112], [96, 64, 86]);
  const fr = kcam(L, len, p.cam || [[0, 1, 960, 470], [1, 1.62, 902, 486]], { hand: .3, t });
  // the wall, the window with the sun just over the roofs, the tiles under it
  rectf(-1400, -900, 4800, 900 + K.back, lg(0, -200, 0, K.back, [[0, [136, 92, 112]], [1, [172, 116, 122]]]));
  cmbWindow(540, 10, 1500, K.sill, t, { sun: [1240, 398, 44], roofs: 428, panes: 3 });
  rectf(-1400, K.sill + 18, 4800, K.back - K.sill - 18, lg(0, K.sill, 0, K.back, [[0, [126, 90, 112]], [1, [154, 108, 124]]]));
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([255, 226, 210], .13); ctx.lineWidth = 2;
  for (let x = -1380; x < 3400; x += 64) line(x, K.sill + 18, x, K.back);
  for (let y = K.sill + 68; y < K.back; y += 50) line(-1400, y, 3400, y);
  rectf(516, K.sill, 1008, 18, rgba([236, 196, 178])); rectf(516, K.sill, 1008, 3, rgba([255, 244, 226], .9)); rectf(516, K.sill + 18, 1008, 10, rgba([70, 44, 66], .3));
  // wall cupboards either side of the window (the stamp sits on the left one)
  rectf(-1400, -900, 1870, 1200, lg(-300, 0, 470, 0, [[0, [78, 54, 78]], [.93, [108, 74, 96]], [1, [214, 150, 134]]]));
  rectf(1574, -900, 1800, 1200, lg(1574, 0, 2000, 0, [[0, [214, 150, 134]], [.07, [108, 74, 96]], [1, [78, 54, 78]]]));
  ctx.strokeStyle = rgba([40, 24, 44], .5); ctx.lineWidth = 4; line(140, -900, 140, 300); line(1880, -900, 1880, 300);
  rectf(-1400, 300, 1870, 10, rgba([50, 30, 50], .5)); rectf(1574, 300, 1800, 10, rgba([50, 30, 50], .5));
  rectf(380, 200, 12, 70, rgba([226, 180, 170], .8)); rectf(1650, 200, 12, 70, rgba([226, 180, 170], .8));
  // a pot of herbs on the sill
  poly([[1408, K.sill], [1466, K.sill], [1474, K.sill - 46], [1400, K.sill - 46]], rgba([150, 86, 92]));
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .24, r = 52 + rnd(i * 3.1) * 26, sw = Math.sin(t * 1.1 + i) * .03; oval(1437 + Math.cos(a + sw) * r * .7, K.sill - 46 + Math.sin(a + sw) * r, 9, 17, rgba(mix([62, 92, 80], [150, 170, 120], rnd(i * 5.7) * .5)), a + Math.PI / 2); }
  // the light pours in
  additive(() => { for (let i = 0; i < 3; i++) { const xa = 560 + i * 316, xb = xa + 290; ctx.fillStyle = lg(0, 40, 0, 1200, [[0, PAL.dawnB, .15], [.5, PAL.dawnA, .08], [1, PAL.dawnA, 0]]); poly([[xa, 30], [xb, 30], [xb - 520, 1300], [xa - 640, 1300]]); ctx.fill(); } });
  // the counter and its cupboards
  rectf(-1400, K.back, 4800, K.top - K.back, lg(0, K.back, 0, K.top, [[0, [238, 198, 178]], [1, [208, 162, 152]]]));
  pool(1240, K.back + 26, 640, 30, PAL.dawnB, .55);
  rectf(-1400, K.top, 4800, 18, rgba([150, 104, 114])); rectf(-1400, K.top, 4800, 3, rgba([255, 240, 222], .8));
  rectf(-1400, K.top + 18, 4800, 1400, lg(0, K.top, 0, K.top + 520, [[0, [116, 80, 100]], [1, [82, 56, 80]]]));
  rectf(-1400, K.top + 18, 4800, 12, rgba([40, 24, 44], .35));
  ctx.strokeStyle = rgba([40, 24, 44], .4); ctx.lineWidth = 4;
  for (let x = -1300; x < 3400; x += 340) { line(x, K.top + 40, x, K.top + 900); rectf(x + 130, K.top + 74, 80, 9, rgba([226, 180, 170], .8)); }
  // the sink
  const sx0 = 792, sx1 = 1052, sy0 = K.back + 8, sy1 = K.top - 8;
  ctx.fillStyle = lg(0, sy0, 0, sy1, [[0, [240, 212, 200]], [.28, [150, 112, 126]], [1, [84, 60, 84]]]); rrect(sx0, sy0, sx1 - sx0, sy1 - sy0, 16); ctx.fill();
  ctx.strokeStyle = rgba([255, 240, 226], .85); ctx.lineWidth = 3; rrect(sx0, sy0, sx1 - sx0, sy1 - sy0, 16); ctx.stroke();
  // the bottle in his hand tips right over; what is left in it runs out
  const tip = seg(L, -.12, .46, E.io), th = lerp(2.2, 2.92, tip) + .015 * Math.sin(t * 9), sb = .8;
  const G = [852 + 14 * tip, 372 - 12 * tip + Math.sin(t * 1.6) * 2];
  const B = [G[0] - 95 * sb * Math.sin(th), G[1] + 95 * sb * Math.cos(th)], mouth = [B[0] + 304 * sb * Math.sin(th), B[1] - 304 * sb * Math.cos(th)];
  const yEnd = sy1 - 6, tp = Math.max(0, L - .07), pour = seg(L, .06, .2), front = Math.min(yEnd, mouth[1] + 220 * tp + 1500 * tp * tp), hit = pour > 0 && front >= yEnd - 1, sxm = mouth[0] + 15;
  ctx.save(); rrect(sx0 + 3, sy0 + 3, sx1 - sx0 - 6, sy1 - sy0 - 6, 14); ctx.clip();
  if (hit) {
    const fk = seg(L, .3, len);
    oval(sxm + 10, sy1 - 7, 46 + 80 * fk, 8 + 4 * fk, rgba([204, 108, 24], .9));
    additive(() => lite([255, 120, 30], sxm, sy1 - 10, 110, .3));
    ctx.strokeStyle = rgba([255, 214, 170], .6); ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) { const k = (t * 2.4 + i * .5) % 1; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.ellipse(sxm, sy1 - 8, 10 + k * 60, 2 + k * 8, 0, 0, TAU); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  ctx.restore();
  cmbTap(1026, sy0 + 2, 1);
  // one more waits; two are done, upside down in the rack
  cmbGlassBack(1116, K.back + 30, .72, 0, .2);
  bottle(1116, K.back + 30, .72, { glass: [206, 242, 234], level: .84, cork: 1, glowC: PAL.amber, glowA: .55 });
  cmbRack(1192, K.back + 36, 1, 2, t);
  cmbGlassBack(B[0], B[1], sb, th, .46, [40, 70, 86]);
  bottle(B[0], B[1], sb, { tilt: th, cork: -1, level: 0, glass: [206, 242, 234], glowC: PAL.amber, glowA: .5 * (1 - .5 * u), inner: () => {
    const vx = Math.sin(th), vy = Math.cos(th), wx = -vy, wy = vx, h = lerp(64, 226, u), p0 = [vx * h, vy * h], far = [vx * 700, vy * 700];
    poly([[p0[0] - wx * 400, p0[1] - wy * 400], [p0[0] + wx * 400, p0[1] + wy * 400], [p0[0] + wx * 400 + far[0], p0[1] + wy * 400 + far[1]], [p0[0] - wx * 400 + far[0], p0[1] - wy * 400 + far[1]]],
      lg(p0[0], p0[1], p0[0] + vx * 240, p0[1] + vy * 240, [[0, [240, 156, 62], .94], [1, [176, 86, 14], .97]]));
    stroke([[p0[0] - wx * 400, p0[1] - wy * 400], [p0[0] + wx * 400, p0[1] + wy * 400]], 3, rgba([255, 222, 180], .7));
    for (let i = 0; i < 5; i++) { const k = (t * 1.5 + i * .21) % 1, yy = lerp(-280, -h * .2 - 30, k); ctx.strokeStyle = rgba([255, 244, 214], .6 * pour * (1 - k)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc((rnd(i * 3.3) - .5) * 30 * (.4 + k), yy, 4 + 5 * k, 0, TAU); ctx.stroke(); }
  } });
  cmbStream(mouth, front, t, pour);
  if (hit) for (let i = 0; i < 10; i++) {                                                // it spatters in the sink
    const cyc = .32 + rnd(i * 2.3) * .2, tt = (t + rnd(i * 5.1) * 3) % cyc, q = tt / cyc, n = Math.floor((t + rnd(i * 5.1) * 3) / cyc);
    const dx = sxm + (rnd(i * 7.7 + n * 3.1) - .5) * 250 * tt, dy = yEnd - 4 - (150 + rnd(i * 4.1 + n) * 200) * tt + 900 * tt * tt;
    if (dy < yEnd + 2) disc(dx, dy, 3.6 * (1 - q * .5), rgba([232, 142, 52], .9 * (1 - q)));
  }
  // him: in profile at the sink, one hand on the counter, the sun on his face and chest
  const M = man({ hip: [588, 712 + Math.sin(t * 1.6) * 2], s: 1.9, dir: 1, lean: .05 + .02 * tip, neck: .2 + .07 * tip, hands: [G, [694, 684]], elbow: [1, 1] });
  const ex = cmbBlink(Object.assign({}, exMix('tired', 'resolve', seg(L, 0, .55)), { gx: .65, gy: .55 }), L, .95);
  drawMan(M, ex, { rim: cmbRim, a: .95, lx: 1, ly: -.3, light: PAL.dawnB, la: .42, lc: [.75, -.2], back: false });
  const ax = [Math.sin(th), -Math.cos(th)], nx = [Math.cos(th), Math.sin(th)];             // his fingers round the glass
  for (let i = 0; i < 4; i++) { const c = v2.add(G, v2.mul(ax, (i - 1.5) * 17)); stroke([v2.add(c, v2.mul(nx, -26)), v2.add(c, v2.mul(nx, 20 - Math.abs(i - 1.5) * 4))], 14, rgba(PAL.ink)); }
  motes(t, [300, 60, 1500, 700], 30, PAL.dawnB, .34, 7);
  blurred(12, () => {                                                                   // leaves of a plant near the lens
    for (let i = 0; i < 9; i++) { const a = -2.5 + i * .34 + Math.sin(t * .9 + i) * .03, r = 300 + rnd(i * 3.7) * 190, c = [1990, 1130]; oval(c[0] + Math.cos(a) * r * .62, c[1] + Math.sin(a) * r * .62, r * .5, 54 + rnd(i * 5.1) * 26, rgba(mix([48, 40, 62], [70, 78, 76], rnd(i * 7.3)), .95), a); }
  });
  stamp(L, '6:00 AM', 'DAY 1');
}, { bloom: .24, grain: .45 }, [540, 150, 1200, 770]);

// ---------- the kitchen floor, seen low ----------
const cmbKF = { wall: 770, floor: 925, top: 452, sill: 318, wx0: 520, wx1: 1180, dx0: 1404, dx1: 1688 };
// her raincoat on its hook by the door: the yellow stays in the frame
function cmbCoatOnHook(x, y, s) {
  const Y = PAL.yellow, YD = PAL.yellowD, YL = PAL.yellowL;
  stroke([[x - 16 * s, y - 12 * s], [x + 16 * s, y - 12 * s]], 6 * s, rgba([96, 66, 84]));
  stroke([[x - 30 * s, y + 34 * s], [x - 50 * s, y + 124 * s]], 21 * s, rgba(Y)); stroke([[x + 30 * s, y + 34 * s], [x + 48 * s, y + 122 * s]], 21 * s, rgba(YD));
  ctx.fillStyle = lg(x - 52 * s, 0, x + 52 * s, 0, [[0, YL], [.45, Y], [1, YD]]);
  ctx.beginPath(); ctx.moveTo(x - 16 * s, y); ctx.quadraticCurveTo(x - 46 * s, y + 40 * s, x - 52 * s, y + 192 * s); ctx.quadraticCurveTo(x, y + 206 * s, x + 52 * s, y + 192 * s); ctx.quadraticCurveTo(x + 46 * s, y + 40 * s, x + 16 * s, y); ctx.fill();
  oval(x, y + 20 * s, 31 * s, 27 * s, rgba(Y)); oval(x, y + 26 * s, 19 * s, 17 * s, rgba(YD, .8));           // the hood, folded over
  stroke([[x, y + 50 * s], [x, y + 196 * s]], 2 * s, rgba(YD, .8));
  for (let i = 0; i < 3; i++) disc(x + 7 * s, y + (76 + i * 42) * s, 3 * s, rgba(YL));
}
function cmbKitchenLow(t, o = {}) {
  const K = cmbKF, seam = [50, 28, 50];
  rectf(-1400, K.wall, 4800, 1000, lg(0, K.wall, 0, 1150, [[0, [168, 112, 108]], [1, [118, 74, 92]]]));       // the floor
  rectf(-1400, -900, 4800, 900 + K.wall, lg(0, -100, 0, K.wall, [[0, [146, 100, 118]], [1, [182, 126, 128]]]));   // the wall
  cmbWindow(K.wx0, -300, K.wx1, K.sill, t, { sun: [742, 232, 40], roofs: 268, panes: 3 });
  rectf(K.wx0 - 24, K.sill, K.wx1 - K.wx0 + 48, 16, rgba([236, 196, 178])); rectf(K.wx0 - 24, K.sill, K.wx1 - K.wx0 + 48, 3, rgba([255, 244, 226], .9));
  rectf(476, K.sill + 16, 740, K.top - K.sill - 16, lg(0, K.sill, 0, K.top, [[0, [130, 94, 114]], [1, [160, 114, 128]]]));
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([255, 226, 210], .13); ctx.lineWidth = 2;
  for (let x = 500; x < 1216; x += 46) line(x, K.sill + 16, x, K.top);
  for (let y = K.sill + 52; y < K.top; y += 36) line(476, y, 1216, y);
  cmbTap(770, K.top, .8);
  cmbRack(880, K.top - 2, .6, 3, t);                                                    // all of them, empty
  // the tall cupboard on the left
  rectf(-1400, -900, 1876, 900 + K.wall, lg(-200, 0, 476, 0, [[0, [80, 56, 80]], [.94, [112, 78, 98]], [1, [214, 152, 136]]]));
  ctx.strokeStyle = rgba(seam, .5); ctx.lineWidth = 4; line(170, -900, 170, K.wall); line(-1400, 380, 470, 380);
  rectf(400, 210, 12, 80, rgba([226, 180, 170], .8)); rectf(400, 470, 12, 80, rgba([226, 180, 170], .8));
  rectf(-1400, K.wall - 34, 1876, 34, rgba([70, 46, 70]));
  // the counter and the cupboards under it
  rectf(476, K.top, 748, 16, rgba([240, 200, 180])); rectf(476, K.top, 748, 3, rgba([255, 246, 230], .9));
  rectf(476, K.top + 16, 738, K.wall - K.top - 16, lg(0, K.top, 0, K.wall, [[0, [186, 138, 136]], [1, [152, 106, 120]]]));
  rectf(476, K.top + 16, 738, 10, rgba(seam, .25));
  ctx.strokeStyle = rgba(seam, .4); ctx.lineWidth = 4;
  for (let i = 1; i < 4; i++) { const x = 476 + i * 184.5; line(x, K.top + 34, x, K.wall - 38); }
  for (let i = 0; i < 4; i++) rectf(476 + i * 184.5 + 62, K.top + 60, 60, 8, rgba([240, 204, 190], .9));
  rectf(476, K.wall - 38, 738, 38, rgba([106, 72, 94]));
  rectf(1214, K.top + 16, 10, K.wall - K.top - 16, rgba([120, 82, 102]));
  rectf(1224, K.wall - 22, 180, 22, rgba([214, 168, 158]));                             // skirting
  // the hook by the door: her raincoat and her boots, or nothing when she has them on
  stroke([[1262, 318], [1352, 318]], 10, rgba([214, 168, 158]));
  if (o.coat) {
    cmbCoatOnHook(1306, 332, 1.2);
    for (const bx of [1284, 1322]) { stroke([[bx, K.wall - 4], [bx, K.wall - 40]], 21, rgba(PAL.yellow)); stroke([[bx - 4, K.wall - 6], [bx - 18, K.wall - 6]], 17, rgba(PAL.yellowD)); }
  }
  // the door to the hall
  const dx0 = K.dx0, dx1 = K.dx1, dt = 196;
  rectf(dx0, dt, dx1 - dx0, K.wall - dt, lg(0, dt, 0, K.wall, [[0, [84, 64, 100]], [1, [142, 102, 124]]]));
  additive(() => lite(PAL.dawnA, dx0 + 110, 480, 300, .34));
  rectf(dx0 + 164, 340, 84, 106, rgba([230, 190, 176], .45)); rectf(dx0 + 172, 348, 68, 90, rgba([120, 90, 124], .6));     // a picture in the hall
  rectf(dx0, K.wall - 30, dx1 - dx0, 30, rgba([186, 130, 124]));
  if (o.door) o.door();
  for (const x of [dx0 - 26, dx1]) rectf(x, dt - 26, 26, K.wall - dt + 26, lg(x, 0, x + 26, 0, [[0, [244, 206, 188]], [1, [204, 158, 150]]]));
  rectf(dx0 - 26, dt - 26, dx1 - dx0 + 52, 26, rgba([228, 186, 172]));
  // the fridge past the door
  rectf(1790, 130, 800, K.wall - 130, lg(1790, 0, 2100, 0, [[0, [244, 218, 208]], [1, [200, 168, 176]]]));
  rectf(1812, 300, 10, 150, rgba([170, 130, 140])); rectf(1790, 520, 800, 4, rgba([150, 110, 124], .6));
}
// floorboards, and the window's light raking across them
function cmbFloorLight(t) {
  const K = cmbKF;
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba([60, 30, 50], .13); ctx.lineWidth = 2.5;
  for (let i = -16; i <= 16; i++) line(960 + i * 78, K.wall, 960 + i * 300, 1500);
  additive(() => {
    for (let i = 0; i < 3; i++) {
      const xa = 566 + i * 214, xb = xa + 200, near = x => 780 + (x - 566) * 1.75;
      ctx.fillStyle = lg(0, K.wall, 0, 1250, [[0, PAL.dawnB, .36], [1, PAL.dawnA, .22]]);
      poly([[xa + 30, K.wall + 5], [xb + 30, K.wall + 5], [near(xb), 1400], [near(xa), 1400]]); ctx.fill();
    }
  });
}
// a push-up in profile: toes at (x, y), facing d; k 0 = arms straight … 1 = chest at the floor. o.sh a shake in px
function cmbPush(x, y, s, k, d, o = {}) {
  const Lb = 372 * s, ankH = 30 * s, shH = lerp(152, 58, k) * s;
  const A = [x + d * 14 * s, y - ankH], S = [A[0] + d * Math.sqrt(Lb * Lb - (shH - ankH) * (shH - ankH)) + (o.sh || 0) * .6, y - shH + (o.sh || 0)];
  const H = [lerp(A[0], S[0], .54), lerp(A[1], S[1], .54) + (o.sag || 0) * s], Kn = v2.lerp(A, H, .5);
  const hand = [A[0] + d * 353 * s, y - 5 * s], handF = [hand[0] + d * 13 * s, y - 9 * s], pick = j => -d * j[0] - .3 * j[1];
  const [el] = ik(S, hand, 80 * s, 74 * s, pick), [elF] = ik(S, handF, 80 * s, 74 * s, pick);
  const ba = Math.atan2(A[1] - S[1], d * (S[0] - A[0])), na = ba + (o.neck ?? .12);
  const hd = [S[0] + d * Math.cos(na) * 66 * s, S[1] - Math.sin(na) * 66 * s];
  const AF = [A[0] - d * 22 * s, A[1] + 2 * s];
  return { head: [hd[0], hd[1], 38 * s], d, s,
    parts: [[[H, v2.lerp(AF, H, .5), AF, [x - d * 20 * s, y - 8 * s]], 31 * s], [[S, elF, handF], 20 * s], [[H, S], 56 * s], [[H, Kn, A, [x, y - 7 * s]], 34 * s], [[S, el, hand], 22 * s]],
    j: { hip: H, sh: S, hand, el, head: hd, ba } };
}
// Lily in her pyjamas (soft blue-white, not yellow), a pony tail, bare feet: the figure lily() gives, drawn for indoors.
// o: tilt (her head, radians), rim, sway (the pony tail)
function cmbLilyPJ(P, ex = 'wary', o = {}) {
  const { s, d } = P, A = PAL.yellow, B = PAL.yellowD, C2 = PAL.yellowL, ink = PAL.ink, [hx, hy, r] = P.head;   // yellow pyjamas: she is always the yellow one
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const foot = q => stroke([q, [q[0] + 9 * s * d, q[1] + 1 * s]], 9 * s, rgba(ink));
  stroke(P.legs[1], 14 * s, rgba(B)); foot(P.legs[1][2]);
  stroke(P.legs[0], 15 * s, rgba(mix(A, B, .3))); foot(P.legs[0][2]);
  stroke(P.arms[1], 13 * s, rgba(B));
  const c = Math.cos(P.lean), sn = Math.sin(P.lean);
  const along = (a, v) => [P.sh[0] + (P.hip[0] - P.sh[0]) * a - c * v * s, P.sh[1] + (P.hip[1] - P.sh[1]) * a + sn * v * s];
  const q = [along(-.06, -20), along(-.06, 20), along(.55, 25), along(1.16, 28), along(1.16, -28), along(.55, -25)];
  ctx.fillStyle = lg(P.sh[0] - 36 * s, 0, P.sh[0] + 36 * s, 0, d > 0 ? [[0, B], [.5, A], [1, C2]] : [[0, C2], [.5, A], [1, B]]);
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.quadraticCurveTo(q[2][0], q[2][1], q[3][0], q[3][1]);
  ctx.quadraticCurveTo((q[3][0] + q[4][0]) / 2, (q[3][1] + q[4][1]) / 2 + 6 * s, q[4][0], q[4][1]); ctx.quadraticCurveTo(q[5][0], q[5][1], q[0][0], q[0][1]); ctx.fill();
  for (let i = 0; i < 7; i++) { const w = along(.16 + rnd(i * 3.3) * .86, (rnd(i * 5.7) - .5) * 34); disc(w[0], w[1], 2.6 * s, rgba(B, .8)); }   // small dots on the cloth
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.tilt || 0); ctx.translate(-hx, -hy);
  const sw = o.sway || 0, tail = [[hx - d * r * .7, hy - r * .5], [hx - d * r * 1.32, hy - r * .34 + sw * 4 * s], [hx - d * r * 1.5 + sw * 6 * s, hy + r * .5]];
  poly(stripPts(tail, [8 * s, 9 * s, 2 * s]), rgba(ink));
  disc(hx, hy, r, rgba(ink));
  disc(hx - d * r * .86, hy - r * .46, 5.5 * s, rgba(B));
  ctx.strokeStyle = rgba(o.rim || cmbRim, .7); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(hx, hy, r * 1.05, d > 0 ? -1.25 : Math.PI + .15, d > 0 ? -.15 : Math.PI + 1.25); ctx.stroke();
  ctx.restore();
  cmbLilyFace(P, ex, 1, { tilt: o.tilt, rim: o.rim || cmbRim });
  stroke(P.arms[0], 15 * s, rgba(B)); stroke(P.arms[0], 11 * s, rgba(A));
  disc(P.arms[0][2][0], P.arms[0][2][1], 6.5 * s, rgba(ink)); disc(P.arms[1][2][0], P.arms[1][2][1], 6 * s, rgba(ink));
}
// her toy rabbit: hanging by one ear from (x, y), swung by a radians; or sitting on (x, y) when sit is true
function cmbRabbit(x, y, s, a = 0, sit = false, dim = 0) {
  const A = mix([236, 228, 234], [150, 106, 136], dim), B = mix([198, 180, 198], [124, 86, 118], dim);
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.lineCap = 'round';
  if (sit) {
    stroke([[-4 * s, -84 * s], [-10 * s, -118 * s]], 9 * s, rgba(A)); stroke([[8 * s, -84 * s], [22 * s, -104 * s], [30 * s, -92 * s]], 8 * s, rgba(B));
    oval(0, -28 * s, 20 * s, 27 * s, rgba(A)); disc(2 * s, -68 * s, 17 * s, rgba(A));
    stroke([[-10 * s, -6 * s], [12 * s, -3 * s]], 11 * s, rgba(B)); stroke([[8 * s, -6 * s], [28 * s, -3 * s]], 11 * s, rgba(A)); stroke([[10 * s, -36 * s], [20 * s, -20 * s]], 8 * s, rgba(B));
    disc(9 * s, -71 * s, 2.2 * s, rgba([60, 40, 60]));
  } else {
    stroke([[0, 0], [1 * s, 24 * s]], 8 * s, rgba(A)); stroke([[7 * s, 30 * s], [17 * s, 13 * s], [21 * s, 23 * s]], 7 * s, rgba(B));
    disc(2 * s, 37 * s, 13 * s, rgba(A)); oval(2 * s, 64 * s, 12 * s, 19 * s, rgba(A));
    stroke([[-6 * s, 57 * s], [-13 * s, 72 * s]], 6 * s, rgba(B)); stroke([[10 * s, 57 * s], [16 * s, 72 * s]], 6 * s, rgba(B));
    stroke([[-4 * s, 78 * s], [-7 * s, 95 * s]], 7 * s, rgba(A)); stroke([[8 * s, 78 * s], [10 * s, 96 * s]], 7 * s, rgba(A));
    disc(7 * s, 35 * s, 1.8 * s, rgba([60, 40, 60]));
  }
  ctx.restore();
}
const cmbGrin = { lid: .5, brow: -.25, browH: .02, smile: .95, open: .34, grit: 1, gx: .2, gy: -.5, tear: 0, sweat: 1 };
shot('pushups', (t, p, L, len) => {
  const u = cmbU(L, len), K = cmbKF, count = p.mode === 'count', ms = 1.5, tx = 1250;
  fill([146, 100, 118], [118, 74, 92]);
  const fr = kcam(L, len, p.cam || (count ? [[0, 1.2, 950, 632], [1, 1.3, 936, 612]] : [[0, 1.12, 1010, 662], [1, 1.02, 1110, 640]]), { hand: .35, t });
  // two push-ups: down slower than up; in 'count' the second comes up slowly, his arms shaking
  const k = keys(count ? [[0, .3], [.2, 1], [.24, 1], [.4, 0], [.47, 0], [.68, 1], [.73, 1], [.96, 0], [1, 0]]
    : [[0, .1], [.29, 1], [.33, 1], [.47, 0], [.52, 0], [.8, 1], [.84, 1], [.97, 0], [1, 0]], u, E.io);
  const shake = count ? cmbBump(u, .7, .84, .97) * (Math.sin(L * 74) * 3.2 + Math.sin(L * 51) * 2) : 0;
  const P = cmbPush(tx, K.floor, ms, k, -1, { sh: shake, neck: .1 + .08 * k });
  // Lily in the doorway ('watch'): she comes round the frame, stops, tilts her head; the rabbit hangs from her hand
  let PL = null;
  cmbKitchenLow(t, { coat: false, door: count ? null : () => {
    const st = seg(u, .06, .4, E.io), ls = ms * cmbLR * .96, tl = seg(u, .56, .78) * .2;
    const lb = { at: [lerp(1672, 1570, st), 788], s: ls, dir: -1, pose: 'walk', ph: Math.PI / 2 + TAU * (st - 1), lean: .03, look: -4 * seg(u, .56, .78), swing: .06 * Math.sin(st * TAU) };
    const P0 = lily(lb), hnd = [P0.sh[0] - (24 + 5 * Math.sin(st * TAU)) * ls, P0.sh[1] + 54 * ls];
    PL = lily(Object.assign(lb, { arms: [hnd, null] }));
    oval(PL.hip[0] + 30, 792, 70, 9, rgba([70, 44, 70], .35));
    const ex = cmbBlink(mixExpr(LILY_EX.wary, LILY_EX.hope, .3 * seg(u, .7, 1)), L, len * .36);
    cmbLilyPJ(PL, ex, { tilt: -tl, sway: Math.sin(st * TAU * 1.5) * (1 - st) + .2 * Math.sin(t * 2) });
    cmbRabbit(hnd[0], hnd[1] + 2, ls * .56, .34 * Math.sin(st * TAU * 1.5) * (1 - .6 * st) + .26 * Math.exp(-Math.max(0, u - .4) * 5) * Math.sin((u - .4) * 26) + .04 * Math.sin(t * 2.3), false, .12);
    disc(hnd[0], hnd[1], 6.5 * ls, rgba(PAL.ink));
  } });
  wet(K.wall, 170, .15, t, 0);                                                          // a polished floor
  cmbFloorLight(t);
  blurred(9, () => poly([[P.j.hand[0] - 40, K.floor + 4], [tx + 30, K.floor + 4], [tx + 330, K.floor + 92], [P.j.hand[0] + 250, K.floor + 92]], rgba([84, 44, 70], .36)));   // his shadow, long
  // her on his back ('count'): cross-legged, a finger for each one, bouncing as he goes
  const seat = v2.lerp(P.j.hip, P.j.sh, .44), hop = count ? 14 * (cmbBump(u, .34, .42, .56) + cmbBump(u, .9, .97, 1.1)) : 0;
  const eff = clamp(.2 + k * .95), top = clamp(1.5 * (1 - k) - .35);
  let ex = mixExpr(EXPR.focus, EXPR.strain, eff);
  if (count) ex = mixExpr(ex, cmbGrin, top);
  drawMan(P, ex, { rim: cmbRim, a: .9, lx: -.45, ly: -1, face: false, back: false });
  cmbManFace(P, ex, { tilt: .42 - .1 * top, light: PAL.dawnB, la: .36, lc: [.2, -.7] });
  if (count) {
    const ls = ms * cmbLR, sy = seat[1] - 40 - hop, n = 1 + (u > .4) + (u > .93), pop = i => i === 1 ? E.out(inv(.4, .47, u)) : i === 2 ? E.out(inv(.93, .99, u)) : 1;
    const lb = { at: [seat[0] + 4, sy], s: ls, dir: -1, pose: 'cross', lean: .06 + .05 * k, nod: -2 };
    const Q0 = lily(lb), hnd = [Q0.sh[0] - 40 * ls, Q0.sh[1] - (30 + 6 * Math.max(cmbBump(u, .38, .45, .6), cmbBump(u, .9, .97, 1.2))) * ls];
    const Q = lily(Object.assign(lb, { arms: [[seat[0] - 16 * ls, sy - 2 * ls], hnd] }));
    Q.legs = [[Q.hip, [Q.hip[0] - 30 * ls, Q.hip[1] + 5 * ls], [Q.hip[0] - 6 * ls, Q.hip[1] + 11 * ls]], [Q.hip, [Q.hip[0] - 22 * ls, Q.hip[1] + 1 * ls], [Q.hip[0] + 4 * ls, Q.hip[1] + 8 * ls]]];   // cross-legged: knees out, feet tucked
    const say = Math.max(cmbBump(u, .38, .45, .62), cmbBump(u, .9, .97, 1.2));
    drawLily(Q, cmbBlink(Object.assign({}, mixExpr(LILY_EX.count, LILY_EX.happy, .45), { open: .12 + .5 * say, gx: .5, gy: .35 }), L, len * .3), { a: 1, rim: cmbRim });
    for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * .42 - .1; stroke([hnd, v2.add(hnd, v2.pol(a, 17 * ls * pop(i)))], 5.4 * ls, rgba(PAL.ink)); }
  }
  // a drop of sweat falls from his brow
  const dq = count ? inv(.5, .72, u) : inv(.36, .6, u);
  if (dq > 0 && dq < 1) { const hx = P.head[0] - 30, y0 = P.head[1] + 30, y = lerp(y0, K.floor - 4, dq * dq); oval(hx, y, 4, 7 + 8 * dq, rgba([255, 244, 232], .9)); }
  else if (dq >= 1) oval(P.head[0] - 30, K.floor - 2, 12, 3, rgba([255, 244, 232], .5 * (1 - inv(count ? .72 : .6, 1, u))));
  motes(t, [420, 300, 1500, 900], 34, PAL.dawnB, .36, 3);
  additive(() => { ctx.fillStyle = lg(0, 200, 0, 1000, [[0, PAL.dawnB, .13], [1, PAL.dawnA, 0]]); poly([[560, 300], [1150, 300], [1900, 1100], [760, 1100]]); ctx.fill(); });   // the light through the room
  // near the lens: a chair's legs; and in 'count' her rabbit sits and watches
  const left = fr[1] - 960 / fr[0], right = fr[1] + 960 / fr[0];
  blurred(12, () => {
    stroke([[left + 96, 380], [left + 60, 1400]], 44, rgba([54, 32, 58], .95)); stroke([[left - 30, 760], [left + 320, 760]], 40, rgba([54, 32, 58], .95));
    stroke([[left + 112, 400], [left + 86, 1000]], 5, rgba([255, 204, 170], .5));
  });
  if (count) blurred(5, () => cmbRabbit(right - 200, K.floor + 150, 2.3, -.06, true, .45));
  if (count) stamp(L, '6:10 AM', 'DAY 40');
}, { bloom: .24, grain: .45 }, (t, p) => p && p.mode === 'count' ? [520, 200, 1400, 950] : [420, 300, 1700, 960]);

// =====================================================================================================================
// BRIDGE: he runs; she rides just ahead on her small yellow bike; far behind, the devil limps and falls away
// =====================================================================================================================
// a real run: ph the stride phase; the trailing heel kicks up, both feet leave the ground, the arms pump
function cmbRun(x, yg, s, ph, d = 1, o = {}) {
  const len = 104 * s, lift = 86 * s, b = Math.abs(Math.sin(ph)), lean = o.lean ?? .2;
  const foot = q => [x + (Math.sin(q) * len - 14 * s) * d, yg - Math.max(0, Math.cos(q + .6)) * lift - 12 * s * b * b];
  const hip = [x, yg - (176 + 16 * b) * s], sh = [hip[0] + Math.sin(lean * d) * 172 * s, hip[1] - Math.cos(lean) * 172 * s];
  const arm = a => { const el = [sh[0] + Math.sin(a) * 80 * s * d, sh[1] + Math.cos(a) * 80 * s]; return [el[0] + Math.sin(a + 1.45) * 72 * s * d, el[1] + Math.cos(a + 1.45) * 72 * s]; };
  const sw = Math.sin(ph) * .95;
  return man({ hip, s, dir: d, lean, neck: o.neck ?? -.06, feet: [foot(ph), foot(ph + Math.PI)], hands: [arm(-sw - .1), arm(sw - .1)], elbow: [1, 1] });
}
function cmbWheel(x, y, r, a) {
  ctx.lineWidth = r * .2; ctx.strokeStyle = rgba([40, 30, 52]); ctx.beginPath(); ctx.arc(x, y, r * .9, 0, TAU); ctx.stroke();
  ctx.lineWidth = r * .05; ctx.strokeStyle = rgba([240, 220, 220], .9); ctx.beginPath(); ctx.arc(x, y, r * .76, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba([240, 220, 220], .45); ctx.lineWidth = r * .035;
  for (let i = 0; i < 10; i++) { const q = a + i * TAU / 10; line(x, y, x + Math.cos(q) * r * .76, y + Math.sin(q) * r * .76); }
  disc(x, y, r * .13, rgba([240, 220, 220]));
}
// her bike: small, yellow, stabiliser wheels. x the middle, yg the ground, s its scale (1.3 x Lily's); returns its points
function cmbBike(x, yg, s, crank) {
  const r = 24 * s, bb = [x - 1 * s, yg - r - 1 * s], ped = q => [bb[0] + Math.cos(q) * 8 * s, bb[1] + Math.sin(q) * 8 * s];
  return { r, yg, s, ra: [x - 30 * s, yg - r], fa: [x + 32 * s, yg - r], bb, seat: [x - 13 * s, yg - 55 * s], head: [x + 23 * s, yg - 60 * s], grip: [x + 20 * s, yg - 73 * s], pedN: ped(crank), pedF: ped(crank + Math.PI) };
}
function cmbBikeDraw(B, roll, far, t) {
  const s = B.s, Y = PAL.yellow, YD = PAL.yellowD, dk = [40, 30, 52];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const stab = (ox, a) => { const c = [B.ra[0] - 5 * s + ox, B.yg - 6.5 * s]; stroke([B.ra, c], 3.4 * s, rgba(YD, a)); disc(c[0], c[1], 6.5 * s, rgba([244, 232, 236], a)); disc(c[0], c[1], 2.4 * s, rgba(dk, a)); };
  if (far) { stab(6 * s, .75); stroke([B.bb, B.pedF], 3 * s, rgba(dk)); stroke([[B.pedF[0] - 5 * s, B.pedF[1]], [B.pedF[0] + 5 * s, B.pedF[1]]], 3.4 * s, rgba(dk)); return; }
  cmbWheel(B.ra[0], B.ra[1], B.r, roll); cmbWheel(B.fa[0], B.fa[1], B.r, roll + 1);
  const tube = (a, b, w = 4.8) => stroke([a, b], w * s, rgba(Y));
  stroke([B.ra, [B.seat[0] + 1 * s, B.seat[1] + 12 * s]], 3.6 * s, rgba(YD)); stroke([B.ra, B.bb], 3.6 * s, rgba(YD));
  tube(B.bb, [B.seat[0], B.seat[1] + 2 * s]); tube([B.seat[0] + 2 * s, B.seat[1] + 12 * s], [B.head[0], B.head[1] + 4 * s]); tube(B.bb, [B.head[0] - 1 * s, B.head[1] + 12 * s]);
  stroke([[B.head[0] - 1 * s, B.head[1] + 12 * s], B.fa], 4.2 * s, rgba(YD)); tube([B.head[0] - 1 * s, B.head[1] + 12 * s], B.grip, 4.2);
  stroke([[B.head[0] - 3 * s, B.head[1] + 2 * s], [B.head[0] + 2 * s, B.head[1] - 6 * s]], 1.6 * s, rgba(PAL.yellowL, .9));
  oval(B.seat[0], B.seat[1], 10 * s, 3.6 * s, rgba(dk));
  stroke([[B.grip[0] - 7 * s, B.grip[1] - 1 * s], [B.grip[0] + 3 * s, B.grip[1]]], 4.4 * s, rgba(dk));
  for (let i = 0; i < 3; i++) {                                                         // ribbons on the grip, streaming back
    const pts = []; for (let j = 0; j <= 5; j++) pts.push([B.grip[0] - 6 * s - j * 5.5 * s, B.grip[1] + (i - 1) * 1.6 * s * j * .5 + Math.sin(t * 22 + j * 1.2 + i * 2) * 1.6 * s * j / 5 + j * .5 * s]);
    stroke(pts, 1.5 * s, rgba(i === 1 ? [255, 176, 196] : [255, 255, 255], .95));
  }
  stab(0, 1);
  disc(B.bb[0], B.bb[1], 4.6 * s, rgba(dk)); stroke([B.bb, B.pedN], 3 * s, rgba(dk)); stroke([[B.pedN[0] - 5 * s, B.pedN[1]], [B.pedN[0] + 5 * s, B.pedN[1]]], 3.4 * s, rgba(dk));
}
// a hazy skyline on the far bank: row of blocks that scroll by par of the distance run
function cmbSkyline(D, par, base, col, a, h0, h1, sp, seed) {
  const off = D * par, i0 = Math.floor(off / sp);
  for (let i = -8; i < 34; i++) {
    const id = i + i0, x = i * sp - (off % sp) - 300, w = sp * (.55 + rnd(id * 3.7 + seed) * .6), h = lerp(h0, h1, Math.pow(rnd(id * 5.3 + seed), 1.8));
    rectf(x, base - h, w, h + 4, rgba(col, a));
    if (rnd(id * 2.1 + seed) > .72) rectf(x + w * .4, base - h - 26, w * .14, 28, rgba(col, a));
  }
}
shot('bridge', (t, p, L, len) => {
  const u = cmbU(L, len), yg = 900, D = 400 + L * 940, ms = 1.25, sun = [1596, 396];
  fill([190, 156, 198], [255, 216, 172]);
  const fr = kcam(L, len, p.cam || [[0, 1, 985, 566], [1, 1.04, 1010, 560]], { hand: .5, t });
  rectf(-1400, 180, 4800, 340, lg(0, 180, 0, 512, [[0, [252, 170, 164], 0], [1, [255, 204, 166], .9]]));       // the sky warms toward the water
  cmbSun(sun[0], sun[1], 52);
  cmbSkyline(D, .02, 512, [236, 164, 176], .7, 40, 210, 120, 1);
  cmbSkyline(D, .045, 512, [204, 134, 166], .78, 26, 130, 96, 7);
  additive(() => { lite(PAL.dawnB, sun[0], sun[1] + 30, 520, .2); });                    // haze over the roofs
  haze(t, -200, 2100, 500, 90, [255, 214, 196], .1, 5, 7);
  // the river, the sun's glitter on it
  rectf(-1400, 512, 4800, 420, lg(0, 512, 0, 900, [[0, [252, 198, 176]], [.4, [214, 164, 194]], [1, [146, 132, 198]]]));
  rectf(-1400, 508, 4800, 8, rgba([255, 226, 206], .55));
  additive(() => {
    ctx.lineCap = 'round';
    for (let i = 0; i < 90; i++) {
      const yy = 518 + Math.pow(rnd(i * 1.7), 1.3) * 372, k = (yy - 512) / 380, sp = 26 + k * 190;
      const x = sun[0] + (rnd(i * 3.1) - .5) * 2 * sp - D * .012 * k, w = (8 + rnd(i * 4.3) * 26) * (.5 + k), a = (.3 + .7 * rnd(i * 6.1)) * (.5 + .5 * Math.sin(t * (5 + rnd(i * 2.7) * 7) + i * 1.9));
      ctx.strokeStyle = rgba([255, 246, 220], a); ctx.lineWidth = 2.4 + 3.4 * k; line(x - w, yy, x + w, yy);
    }
    for (let i = 0; i < 46; i++) {
      const yy = 520 + rnd(i * 2.9 + 4) * 360, k = (yy - 512) / 380, x = ((rnd(i * 5.7 + 4) * 2400 - D * (.02 + .1 * k)) % 2400 + 2400) % 2400 - 240, a = .5 * (.5 + .5 * Math.sin(t * (3 + rnd(i * 3.3) * 5) + i));
      ctx.strokeStyle = rgba([255, 214, 214], a * .6); ctx.lineWidth = 2 + 2 * k; line(x - 14 - 20 * k, yy, x + 14 + 20 * k, yy);
    }
  });
  // the far railing and its lamp posts slide by behind them
  const rc = [126, 86, 126], off = D * .95;
  for (let i = -1; i < 5; i++) {
    const x = i * 780 - (off % 780) + 200;
    stroke([[x, yg], [x, 372]], 13, rgba(rc)); ctx.strokeStyle = rgba(rc); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, 372); ctx.quadraticCurveTo(x, 330, x + 44, 326); ctx.stroke();
    oval(x + 52, 330, 20, 9, rgba([250, 226, 220])); stroke([[x + 4, yg - 6], [x + 4, 380]], 2.5, rgba([255, 226, 200], .7));
  }
  rectf(-1400, 702, 4800, 12, rgba(rc)); rectf(-1400, 702, 4800, 3, rgba([255, 230, 204], .85)); rectf(-1400, 800, 4800, 6, rgba(rc, .9));
  for (let i = -2; i < 20; i++) { const x = i * 130 - (off % 130); rectf(x, 706, 9, yg - 706, rgba(rc)); rectf(x + 7, 706, 2, yg - 706, rgba([255, 226, 200], .6)); }
  // the deck: sunlit, the railing's shadows flickering across it
  rectf(-1400, yg - 16, 4800, 16, rgba([150, 104, 130]));
  rectf(-1400, yg, 4800, 2400, lg(0, yg, 0, 1090, [[0, [214, 158, 146]], [1, [150, 104, 120]]]));
  rectf(-1400, yg, 4800, 3, rgba([255, 232, 208], .7));
  for (let i = -2; i < 22; i++) { const x = i * 130 - (off % 130); poly([[x - 2, yg + 2], [x + 10, yg + 2], [x - 190, 1100], [x - 250, 1100]], rgba([112, 70, 104], .2)); }
  ctx.strokeStyle = rgba([90, 54, 84], .22); ctx.lineWidth = 3;
  for (let i = -1; i < 7; i++) { const x = i * 420 - (D % 420); line(x, yg + 2, x - 70, 1100); }
  // the devil, far behind at the left edge: small, thin, limping, eyes dim; it falls back out of the frame
  const dk = .4, dph = L * TAU * .9 + .55 * Math.sin(L * TAU * .9);
  placeDevil([lerp(250, -210, Math.pow(u, .8)), yg + 200 * dk + Math.max(0, Math.sin(dph)) * 12 * dk, dk]);
  const o = devilO({ a: lerp(.82, .5, u), eyes: .3, grin: 0, lean: .9, stride: dph, smoke: 0 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  // Lily, pedalling hard just ahead of him; once, she looks back
  const ls = ms * cmbLR, bx = 1230 + 22 * Math.sin(u * 2.6), cr = L * TAU * 2.1, lookB = cmbBump(u, .36, .5, .86) > 0 ? Math.min(1, seg(u, .36, .5) * 1, 1 - seg(u, .7, .86)) : 0;
  const Bk = cmbBike(bx, yg, ls * 1.3, cr), rock = .035 * Math.sin(cr);
  oval(bx - 70, yg + 12, 150, 13, rgba([104, 62, 96], .32)); oval(650 - 80, yg + 14, 170, 15, rgba([104, 62, 96], .32));
  ctx.save(); ctx.translate(bx, yg); ctx.rotate(.018 * Math.sin(cr * .5 + 1)); ctx.translate(-bx, -yg);
  cmbBikeDraw(Bk, D / Bk.r, true, t);
  const PL = lily({ at: [Bk.seat[0], Bk.seat[1] - 2 * ls], s: ls, dir: 1, pose: 'sit', lean: .3 + rock - .08 * lookB, arms: [Bk.grip, [Bk.grip[0] + 4 * ls, Bk.grip[1] + 1 * ls]], look: -5 * lookB, nod: Math.sin(cr * 2) * 1.2 });
  const leg = f => { const [kn, e] = ik(PL.hip, f, 30 * ls, 30 * ls, j => j[0] - .2 * j[1]); return [PL.hip, kn, e]; }, farLeg = leg(Bk.pedF);
  stroke(farLeg, 13 * ls, rgba(PAL.ink)); stroke([farLeg[2], [farLeg[2][0] + 9 * ls, farLeg[2][1]]], 14 * ls, rgba(PAL.yellowD));
  cmbBikeDraw(Bk, D / Bk.r, false, t);
  PL.legs = [leg(Bk.pedN), [PL.hip, PL.hip, PL.hip]];
  drawLily(PL, 'hope', { a: 1, rim: cmbRim, face: false });
  cmbLilyFace(PL, cmbBlink(mixExpr(LILY_EX.hope, LILY_EX.happy, .55 * lookB), L, .5), 1 - 1.85 * lookB, { rim: cmbRim });
  ctx.restore();
  // him: a real run, eyes on her; when she looks back, something in his face lets go
  const ph = L * TAU * 1.38 + 1.2, M = cmbRun(650, yg, ms, ph, 1, { lean: .27, neck: -.1 });
  const ex = mixExpr(Object.assign({}, EXPR.focus, { open: .1 + .16 * (.5 + .5 * Math.sin(ph * 2)), sweat: .6, gx: .8, gy: .15 }), EXPR.calm, .6 * lookB);
  drawMan(M, ex, { rim: cmbRim, a: .95, lx: 1, ly: -.5, light: PAL.dawnB, la: .42, lc: [.8, -.2], back: false });
  // near the lens: the railing on our side, soft, streaking by
  blurred(13, () => {
    const o2 = D * 2.6;
    rectf(-1400, 1000, 4800, 46, rgba([58, 36, 66], .96)); rectf(-1400, 996, 4800, 9, rgba([255, 206, 176], .55));
    for (let i = -1; i < 6; i++) { const x = i * 620 - (o2 % 620); rectf(x, 1040, 150, 2200, rgba([58, 36, 66], .9)); }
  });
  blurred(16, () => { for (let i = 0; i < 2; i++) { const x = 2500 + i * 2300 - (D - 400) * 2.9; rectf(x, -300, 46, 1700, rgba([70, 44, 80], .42)); } });   // a cable of the bridge wipes past
  stamp(L, '6:15 AM', 'DAY 14');
}, { bloom: .24, grain: .45 }, [440, 250, 1480, 930]);

// =====================================================================================================================
// PULLUPS: a playground at sunrise. He pulls up on the high bar; she hangs from the low one beside him, copying him
// =====================================================================================================================
// a pull-up in profile under a bar at yBar: k 0 = hanging … 1 = chin over. o: kick (knees up), sw (swing px), sh (shake px)
function cmbPull(x, yBar, s, k, d, o = {}) {
  const S = [x - d * 62 * s * k + (o.sw || 0) * (1 - k) + (o.sh || 0), yBar + lerp(152, 36, k) * s + (o.sh || 0)];
  const hand = [x + d * 8 * s, yBar], handF = [x + d * 20 * s, yBar], pick = j => d * j[0] + .25 * j[1];
  const [el] = ik(S, hand, 80 * s, 74 * s, pick), [elF] = ik(S, handF, 80 * s, 74 * s, pick);
  const H = [S[0] - d * (6 + 22 * k) * s + (o.sw || 0) * .8, S[1] + 172 * s], kick = o.kick || 0;
  const leg = (a1, bend) => { const kn = [H[0] + d * Math.sin(a1) * 100 * s, H[1] + Math.cos(a1) * 100 * s], a2 = a1 - bend; return [H, kn, [kn[0] + d * Math.sin(a2) * 100 * s, kn[1] + Math.cos(a2) * 100 * s]]; };
  const hd = [S[0] + d * (10 + 6 * k) * s, S[1] - (64 - 2 * k) * s];
  return { head: [hd[0], hd[1], 38 * s], d, s,
    parts: [[leg(.12 + kick * .5, .8 + kick * .35), 31 * s], [[S, elF, handF], 20 * s], [[H, S], 56 * s], [leg(.3 + kick * .7, .7 + kick * .5), 34 * s], [[S, el, hand], 22 * s]],
    j: { hip: H, sh: S, head: hd, hand, handF } };
}
// a soft tree: a trunk and a crown of discs
function cmbTree(x, y, r, col, a, seed) {
  rectf(x - r * .07, y - r * .9, r * .14, r * .9, rgba(mix(col, [60, 40, 70], .4), a));
  for (let i = 0; i < 9; i++) disc(x + (rnd(seed + i * 3.1) - .5) * r * 1.5, y - r * 1.25 + (rnd(seed + i * 5.3) - .5) * r * 1.0, r * (.42 + rnd(seed + i * 7.7) * .3), rgba(col, a));
}
shot('pullups', (t, p, L, len) => {
  const u = cmbU(L, len), yg = 960, hz = 780, sun = [340, 610], posts = [556, 1012, 1424], hi = 250, lo = 590, ms = 1.3;
  fill([208, 166, 198], [255, 208, 166]);
  const fr = kcam(L, len, p.cam || [[0, 1, 992, 584], [1, 1.07, 1004, 566]], { hand: .35, t });
  rectf(-1400, 300, 4800, 500, lg(0, 300, 0, hz, [[0, [255, 176, 160], 0], [1, [255, 202, 160], .95]]));
  cmbSun(sun[0], sun[1], 52, .72);
  // far trees and roofs in haze; the darker trees stand behind her, so her yellow sings
  blurred(4, () => {
    cmbSkyline(0, 0, hz, [226, 160, 172], .6, 30, 110, 150, 21);
    for (let i = 0; i < 9; i++) cmbTree(-200 + i * 300 + rnd(i * 4.1) * 120, hz + 6, (i < 3 ? 56 : 120) + rnd(i * 2.3) * (i < 3 ? 30 : 70), i > 3 ? [176, 116, 140] : [222, 152, 156], .9, i * 17);
    cmbTree(1330, hz + 20, 250, [150, 96, 128], .95, 91); cmbTree(1700, hz + 20, 220, [158, 102, 132], .95, 57); cmbTree(1010, hz + 14, 170, [174, 114, 138], .9, 33);
  });
  additive(() => { lite(PAL.dawnB, sun[0], sun[1], 700, .1); });
  // the ground, long light across it
  rectf(-1400, hz, 4800, 2400, lg(0, hz, 0, 1100, [[0, [240, 180, 150]], [1, [172, 118, 124]]]));
  rectf(-1400, hz - 2, 4800, 8, rgba([255, 232, 206], .5));
  additive(() => { ctx.save(); ctx.translate(sun[0] + 200, hz + 60); ctx.scale(1, .13); lite(PAL.dawnB, 0, 0, 1500, .18); ctx.restore(); });
  // the swings and the slide: soft shapes behind
  blurred(5, () => {
    const sc = [150, 108, 156], a = .85, sx = 1540;
    stroke([[sx - 190, 868], [sx - 130, 430], [sx - 70, 868]], 13, rgba(sc, a)); stroke([[sx + 70, 868], [sx + 130, 430], [sx + 190, 868]], 13, rgba(sc, a)); stroke([[sx - 140, 430], [sx + 140, 430]], 15, rgba(sc, a));
    for (const [ox, ph] of [[-56, 0], [56, 1.7]]) { const an = Math.sin(t * 1.6 + ph) * (ox > 0 ? .16 : .03), e = [sx + ox + Math.sin(an) * 290, 430 + Math.cos(an) * 290]; ctx.strokeStyle = rgba(sc, a); ctx.lineWidth = 4; line(sx + ox - 16, 430, e[0] - 16, e[1]); line(sx + ox + 16, 430, e[0] + 16, e[1]); stroke([[e[0] - 24, e[1]], [e[0] + 24, e[1]]], 10, rgba([110, 76, 124], a)); }
    const lc = [222, 150, 162];
    stroke([[40, 880], [40, 520], [130, 520]], 13, rgba(lc, a)); stroke([[130, 520], [220, 560], [420, 850], [470, 866]], 20, rgba(lc, a)); for (let i = 0; i < 5; i++) stroke([[22, 600 + i * 56], [58, 600 + i * 56]], 7, rgba(lc, a));
  });
  // long shadows of the bars, lying toward us
  const shc = rgba([128, 78, 112], .26);
  for (const x of posts) poly([[x - 10, yg], [x + 12, yg], [x + 560, 1110], [x + 470, 1110]], shc);
  // the reps: two, the second slower; a breath out at the top of it
  const k = keys([[0, .12], [.22, 1], [.28, 1], [.45, .02], [.5, 0], [.84, 1], [.92, 1], [1, .86]], u, E.io);
  const hard = cmbBump(u, .52, .72, .86), out = seg(u, .86, .97);
  const P = cmbPull(784, hi, ms, k, 1, { kick: .7 * hard, sw: Math.sin(L * 3.1) * 7, sh: hard * (Math.sin(L * 70) * 2.6 + Math.sin(L * 47) * 1.6) });
  // Lily on the low bar: she pulls as far as she can, legs kicking, grinning at him
  const ls = ms * cmbLR, kl = .32 * keys([[0, .05], [.3, 1], [.38, .8], [.55, .1], [.62, .1], [.9, 1], [1, .9]], u, E.io), lph = L * TAU * 2.2, lxx = 1218 + Math.sin(L * 5.2) * 9;
  const reach = lerp(92, 76, kl / .32) * ls, hipL = [lxx, lo + 56 * ls + reach], gripL = [[1218 + 24 * ls, lo], [1218 - 22 * ls, lo]];
  const PL = lily({ at: hipL, s: ls, dir: -1, pose: 'hang', ph: lph, lean: .1 * Math.sin(L * 5.2 + 1) + .05, nod: -3 * kl / .32 });
  PL.arms = gripL.map(h => { const a0 = [PL.sh[0], PL.sh[1] + 6 * ls], [el, w] = ik(a0, h, 46 * ls, 46 * ls, j => (h[0] > a0[0] ? 1 : -1) * j[0] + .2 * j[1]); return [a0, el, w]; });   // arms stretched long, the way a child hangs
  PL.legs = [0, 1].map(i => { const q = lph + i * Math.PI, f = [hipL[0] + Math.sin(q) * 30 * ls - 6 * ls, hipL[1] + (55 - 14 * Math.max(0, Math.cos(q))) * ls], [kn, e] = ik(hipL, f, 30 * ls, 30 * ls, j => -j[0] - .2 * j[1]); return [hipL, kn, e]; });
  oval(784 + 330, 1036, 190, 16, rgba([128, 78, 112], .26)); oval(1218 + 300, 1030, 130, 13, rgba([128, 78, 112], .26));
  // the frame: three posts, the high bar and the low bar
  const bc = [74, 72, 122], barf = (x0, x1, y) => { stroke([[x0, y], [x1, y]], 13, rgba(bc)); stroke([[x0, y - 4], [x1, y - 4]], 2.5, rgba([255, 226, 200], .8)); };
  posts.forEach((x, i) => { const topY = i < 2 ? hi - 16 : lo - 16; rectf(x - 11, topY, 22, yg - topY + 6, rgba(bc)); rectf(x - 11, topY, 5, yg - topY + 6, rgba([255, 214, 184], .75)); oval(x, yg + 6, 30, 7, rgba([110, 70, 104], .7)); disc(x, topY, 13, rgba(bc)); });
  barf(posts[0], posts[1], hi); barf(posts[1], posts[2], lo);
  // him
  let ex = mixExpr(EXPR.focus, EXPR.strain, clamp(.25 + Math.max(k * (u < .3 ? 1 : .6), hard * 1.2)));
  ex = mixExpr(ex, { lid: .5, brow: .15, browH: .05, smile: .5, open: .5 * (1 - seg(u, .94, 1) * .5), grit: 0, gx: .8, gy: .3, tear: 0, sweat: 1 }, out);
  drawMan(P, ex, { rim: cmbRim, a: .95, lx: -1, ly: -.35, face: false, back: false });
  cmbManFace(P, ex, { tilt: -.12 * k + .1, light: PAL.dawnB, la: .3, lc: [-.5, -.5] });
  for (const hx of [P.j.handF[0], P.j.hand[0]]) { stroke([[hx, hi - 9], [hx + 3, hi + 9]], 26 * (hx === P.j.hand[0] ? 1 : .85), rgba(PAL.ink)); }
  stroke([[P.j.hand[0] - 13, hi - 12], [P.j.hand[0] - 14, hi - 2]], 4, rgba(cmbRim, .7));
  if (out > 0) additive(() => { for (let i = 0; i < 4; i++) { const q = clamp(out * 1.3 - i * .1); lite([255, 240, 228], P.head[0] + 44 + q * (70 + i * 26), P.head[1] + 16 - q * (18 + i * 9), 16 + q * 40 + i * 5, .34 * q * (1 - q) * 3); } });   // his breath in the cold
  // her
  drawLily(PL, cmbBlink(Object.assign({}, LILY_EX.happy, { lid: .12 + .5 * kl / .32 * cmbBump(u, .2, .3, .45), gx: .7, gy: -.25, open: .3 }), L, len * .6), { a: 1, rim: cmbRim });
  stroke(PL.arms[0], 15 * ls, rgba(PAL.yellowD)); stroke(PL.arms[0], 10.5 * ls, rgba(PAL.yellow));              // her near sleeve, so it reads against the hood
  for (const h of gripL) stroke([[h[0], lo - 5], [h[0], lo + 6]], 15, rgba(PAL.ink));
  // dust in the low light, rays from the sun
  additive(() => { for (let i = 0; i < 5; i++) { const a = -.42 + i * .2 + Math.sin(t * .4 + i) * .02; ctx.fillStyle = lg(sun[0], sun[1], sun[0] + Math.cos(a) * 1500, sun[1] + Math.sin(a) * 1500, [[0, PAL.dawnB, .07], [1, PAL.dawnA, 0]]); poly([sun, [sun[0] + Math.cos(a - .045) * 1700, sun[1] + Math.sin(a - .045) * 1700], [sun[0] + Math.cos(a + .045) * 1700, sun[1] + Math.sin(a + .045) * 1700]]); ctx.fill(); } });
  motes(t, [200, 200, 1800, 980], 46, PAL.dawnB, .4, 11);
  // near the lens: leaves over the top left corner, grass along the bottom
  blurred(8, () => {
    const lc = [72, 48, 86];
    stroke([[-200, 40], [260, 96], [620, 60]], 26, rgba(lc, .95));
    for (let i = 0; i < 26; i++) { const x = -160 + rnd(i * 3.3) * 800, y = -40 + rnd(i * 5.1) * 250 * (1 - x / 1100) + Math.sin(t * 1.3 + i) * 5; oval(x, y, 62, 30, rgba(mix(lc, [120, 80, 110], rnd(i * 7.7) * .5), .93), rnd(i * 2.2) * 3); }
    for (let i = 0; i < 70; i++) { const x = -100 + i * 31 + rnd(i * 3.9) * 26, h = 40 + rnd(i * 6.7) * 80, sw = (rnd(i * 2.3) - .5) * 60 + Math.sin(t * 1.5 + i * .7) * 12; stroke([[x, 1130], [x + sw * .3, 1130 - h * .6], [x + sw, 1130 - h]], 9, rgba(mix([104, 66, 100], [150, 98, 116], rnd(i * 4.7)), .8)); }
  });
  stamp(L, '6:20 AM', 'DAY 30');
}, { bloom: .24, grain: .45 }, [520, 150, 1460, 1000]);

// =====================================================================================================================
// HAND: evening, rain, at the height of his hand. It hangs open, trembling; hers comes up into it; his fingers close
// =====================================================================================================================
// a soft finger: bones (lens) turned to angs (radians from straight down, + curls toward the right), as one smooth
// strip that tapers from w0 wide at the root to w1 at the tip. Returns { pts, ws } (ws are half-widths) for cmbForm
function cmbFinger(base, lens, angs, w0, w1) {
  const n = 16, tot = lens.reduce((a, b) => a + b, 0), mids = [], pts = [base], ws = [w0 / 2];
  let acc = 0; for (const l of lens) { mids.push(acc + l / 2); acc += l; }
  const angAt = v => { if (v <= mids[0]) return angs[0]; for (let i = 1; i < mids.length; i++) if (v <= mids[i]) return lerp(angs[i - 1], angs[i], E.sine(inv(mids[i - 1], mids[i], v))); return angs[angs.length - 1]; };
  let q = base;
  for (let i = 1; i <= n; i++) { const a = angAt(tot * (i - .5) / n), d = tot / n; q = [q[0] + Math.sin(a) * d, q[1] + Math.cos(a) * d]; pts.push(q); ws.push(lerp(w0, w1, i / n) / 2); }
  return { pts, ws };
}
// soft shapes ({ pts, ws, flat: no round root }) painted as one dark form with lit edges. o as cmbSil, and sheen (0-1)
function cmbForm(shapes, o = {}) {
  const off = o.off ?? 6, path = pl => { ctx.beginPath(); ctx.moveTo(pl[0][0], pl[0][1]); for (let i = 1; i < pl.length; i++) ctx.lineTo(pl[i][0], pl[i][1]); ctx.closePath(); ctx.fill(); };
  const draw = grow => { for (const sh of shapes) {
    const a = sh.pts[0], b = sh.pts[sh.pts.length - 1];
    path(stripPts(sh.pts, sh.ws.map(w => w + grow)));
    if (!sh.flat) { ctx.beginPath(); ctx.arc(a[0], a[1], sh.ws[0] + grow, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.arc(b[0], b[1], sh.ws[sh.ws.length - 1] + grow, 0, TAU); ctx.fill();
  } };
  const edge = (col, al, lx, ly) => {
    if (al <= .003) return;
    const m = Math.hypot(lx, ly) || 1;
    ctx.save(); ctx.translate(lx / m * off, ly / m * off); ctx.shadowColor = rgba(col, Math.min(1, al)); ctx.shadowBlur = (o.blur ?? 14) * pxPerUnit(ctx); ctx.fillStyle = rgba(col, Math.min(1, al * 1.35)); draw(off * .4); ctx.restore();
  };
  const lx = o.lx ?? 0, ly = o.ly ?? -1, m = Math.hypot(lx, ly) || 1;
  if (o.rim2) edge(o.rim2, o.a2 ?? .5, o.l2[0], o.l2[1]);
  edge(o.rim || cmbRim, o.a ?? .7, lx, ly);
  ctx.fillStyle = rgba(o.fill || PAL.ink); draw(0);
  if (o.sheen) {
    ctx.fillStyle = rgba(mix(o.fill || PAL.ink, o.rim || cmbRim, .36), o.sheen);
    for (const sh of shapes) path(stripPts(sh.pts.map((q, i) => [q[0] + lx / m * sh.ws[i] * .44, q[1] + ly / m * sh.ws[i] * .44]), sh.ws.map(w => w * .28)));
  }
}
shot('hand', (t, p, L, len) => {
  const T = L * 1.4 / Math.max(.2, len), ink = PAL.ink, Y = PAL.yellow, YD = PAL.yellowD, YL = PAL.yellowL, hs = 1.5, lampC = [255, 196, 120], redC = [255, 84, 50];
  fill([14, 24, 76], [36, 56, 134]);
  const fr = kcam(L, len, p.cam || [[0, 1, 990, 520], [.55, 1.04, 996, 512], [1, 1.14, 1022, 480]], { hand: .35, t });
  // the street behind, far out of focus: the bar's red door at the far left, a warm lamp behind the hands, blue everywhere else
  const fl = .86 + .14 * Math.sin(t * 17) * Math.sin(t * 5.3), warm = .82 + .18 * seg(T, .8, 1.2);
  blurred(26, () => {
    rectf(-900, 850, 4000, 700, rgba([18, 28, 84], .9));
    rectf(-260, 110, 590, 760, rgba([255, 84, 44], .82 * fl)); rectf(-260, 36, 700, 52, rgba([255, 50, 50], .85 * fl));
  });
  additive(() => {
    lite([255, 70, 40], 120, 500, 760, .75 * fl); lite([255, 150, 70], 180, 620, 320, .5 * fl);
    lite(lampC, 1170, 430, 840, .64 * warm); lite([255, 232, 196], 1170, 430, 230, .3 * warm);
  });
  bokeh(3, 18, [540, 40, 1960, 800], [[90, 130, 240], [70, 104, 224], [130, 170, 252]], 34, 100, .55, t);
  bokeh(8, 4, [1400, 80, 1960, 560], [[255, 200, 140]], 40, 86, .4, t);
  blurred(14, () => additive(() => {                                                     // the lights lie long on the wet ground
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, redC, .5 * fl], [1, redC, 0]]); ctx.fillRect(-240, 850, 520, 400);
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, lampC, .5], [1, lampC, 0]]); ctx.fillRect(1010, 850, 320, 400);
    ctx.fillStyle = lg(0, 850, 0, 1200, [[0, [100, 140, 240], .3], [1, [100, 140, 240], 0]]); ctx.fillRect(1560, 850, 170, 400);
  }));
  // the moments (for a 1.4 s shot): her hand rises, slips in; his fingers close round hers (lands about .9 s); a small squeeze
  const trem = 1 - seg(T, .56, .8), rise = seg(T, .06, .6, E.out), slip = seg(T, .58, .82, E.io), close = seg(T, .74, .95, E.out);
  const flinch = cmbBump(T, .56, .64, .76) * .08, squeeze = cmbBump(T, .95, 1.05, 1.36) * .06;
  const tw = trem * (noise1(t * 9, 3) * 4 + Math.sin(t * 47) * 1.8), sway = Math.sin(t * 1.3) * 5;
  const W = [900 + sway + tw, 172 + tw * .5 + Math.sin(t * 1.7) * 3];
  const curl = .08 + .14 * trem * (.5 + .5 * Math.sin(t * 3.3)) - flinch + close * .9 + squeeze;
  const redA = lerp(.65, .2, close), R1 = { rim: lampC, a: .85, lx: .75, ly: -.5, off: 7, rim2: redC, a2: redA, l2: [-1, .15] };
  // his coat and legs: a dark wall at the left, the bar's red on its far edge, the lamp on its near one
  const coat = dx => [[388 + dx, -400], [832 + dx, -400], [844 + dx, 820], [612, 848 + Math.abs(dx) * .4], [378 + dx, 820]];
  ctx.lineCap = 'round';
  stroke([[502, 700], [490, 1500]], 204, rgba(redC, redA)); stroke([[512, 700], [500, 1500]], 204, rgba(ink));
  stroke([[738, 700], [748, 1500]], 204, rgba(lampC, .6)); stroke([[730, 700], [740, 1500]], 204, rgba(ink));
  poly(coat(-9), rgba(redC, redA)); poly(coat(9), rgba(lampC, .62)); poly(coat(0), rgba(ink));
  ctx.save(); poly(coat(0)); ctx.clip();
  additive(() => { ctx.fillStyle = lg(378, 0, 650, 0, [[0, redC, .34 * redA / .65], [1, redC, 0]]); ctx.fillRect(300, -400, 400, 1300); ctx.fillStyle = lg(844, 0, 690, 0, [[0, lampC, .2], [1, lampC, 0]]); ctx.fillRect(600, -400, 300, 1300); });
  for (let i = 0; i < 7; i++) { const k = (t * .9 + rnd(i * 3.7)) % 1, x = 410 + rnd(i * 5.9) * 400; stroke([[x, -40 + k * 840], [x - 2, -40 + k * 840 + 50]], 3, rgba([150, 176, 240], .3 * Math.sin(Math.PI * k))); }   // rain running down the cloth
  ctx.restore();
  stroke([[700, 470], [806, 492]], 5, rgba(lampC, .22)); stroke([[700, 470], [696, 560]], 4, rgba(lampC, .12)); stroke([[612, -400], [612, 846]], 3, rgba([70, 80, 120], .25));   // a pocket, a seam
  // his hand, seen from the thumb side, the palm turned back toward her: sleeve, wrist and palm, the three far fingers
  cmbSil([[[[W[0] - 86, -400], [W[0] - 36, W[1] - 176]], 214]], R1);
  const PW = (x, y) => [W[0] + x * hs, W[1] + y * hs], Kn = PW(28, 150), R2 = Object.assign({ sheen: .5 }, R1);
  const palm = { pts: [], ws: [], flat: true };
  for (let i = 0; i <= 12; i++) { const q = i / 12; palm.pts.push(v2.lerp(PW(-22, -150), Kn, q)); palm.ws.push(keys([[0, 30], [.42, 31], [.76, 46], [1, 41]], q) * hs); }
  cmbForm([palm], R2);
  const defs = [                                                                         // [root x, y, bones, open, closed, width at root, at tip], far to near
    [-18, -6, [56, 40, 30], [.34, .9, 1.4], [.7, 1.6, 2.4], 30, 23],
    [-10, 6, [72, 50, 36], [.26, .72, 1.12], [.62, 1.52, 2.25], 34, 26],
    [-2, 10, [80, 54, 38], [.18, .56, .9], [.56, 1.44, 2.12], 36, 27],
    [8, 2, [74, 50, 36], [.1, .4, .68], [.5, 1.34, 2.0], 36, 27]];
  const fingers = defs.map(([dx, dy, lens, a0, a1, w0, w1], i) => cmbFinger([Kn[0] + dx * hs, Kn[1] + dy * hs], lens.map(v => v * hs),
    a0.map((a, j) => lerp(a, a1[j], curl) + trem * .035 * Math.sin(t * (29 + i * 7) + i * 2) * (j + 1)), w0 * hs, w1 * hs));
  for (let i = 0; i < 3; i++) cmbForm([fingers[i]], R2);
  // her yellow sleeve and her small hand, coming up from the lower right into his palm
  const ang = lerp(-.44, -.67, slip), e = v2.pol(ang, 1), e2 = v2.pol(ang - .12 - .1 * (1 - rise), 1), nrm = [-e[1], e[0]];
  const HW = v2.add(v2.lerp(v2.lerp([1660, 1220], [1226, 660], rise), [1152, 556], slip), [(sway + tw) * slip, 0]);
  const elb = v2.sub(HW, v2.mul(e2, 500)), upper = [elb[0] + 700, elb[1] + 260], cuff = v2.sub(HW, v2.mul(e, 2)), cb = v2.sub(cuff, v2.mul(e, 36)), kh = .1 + .5 * seg(T, .88, 1.14);
  const acr = k => lg(cuff[0] + nrm[0] * k, cuff[1] + nrm[1] * k, cuff[0] - nrm[0] * k, cuff[1] - nrm[1] * k, [[0, YL], [.3, Y], [1, YD]]);
  poly(stripPts([upper, v2.lerp(upper, elb, .7), elb, v2.lerp(elb, cb, .3), cb, cuff], [150, 118, 104, 88, 56, 52]), lg(0, cuff[1] - 120, 0, cuff[1] + 760, [[0, YL], [.1, Y], [.55, Y], [1, YD]]));
  poly(stripPts([cb, cuff], [58, 56]), lg(cuff[0] + nrm[0] * 58, cuff[1] + nrm[1] * 58, cuff[0] - nrm[0] * 58, cuff[1] - nrm[1] * 58, [[0, Y], [1, mix(YD, [150, 90, 10], .45)]]));
  stroke([v2.add(cb, v2.mul(nrm, 54)), v2.add(cb, v2.mul(nrm, -54))], 4, rgba(mix(YD, [150, 90, 10], .5), .9));
  stroke([v2.add(v2.lerp(elb, cuff, .1), v2.mul(nrm, 86)), v2.add(v2.sub(cb, v2.mul(e, 30)), v2.mul(nrm, 44))], 6, rgba([255, 252, 226], .6));       // the lamp along the wet sleeve
  stroke([v2.add(v2.lerp(elb, cuff, .5), v2.mul(nrm, -30)), v2.add(v2.lerp(elb, cuff, .72), v2.mul(nrm, -42))], 5, rgba(YD, .75));                   // folds
  stroke([v2.add(v2.lerp(elb, cuff, .3), v2.mul(nrm, 10)), v2.add(v2.lerp(elb, cuff, .46), v2.mul(nrm, -14))], 5, rgba(YD, .55));
  for (let i = 0; i < 5; i++) { const tt = t * 2.2 + rnd(i * 4.1), k = tt % 1, q = v2.add(v2.lerp(cuff, elb, .1 + rnd(i * 2.7 + Math.floor(tt) * 3.3) * .7), v2.mul(nrm, 50 + rnd(i * 6.3) * 30)); ctx.strokeStyle = rgba([255, 255, 240], .8 * (1 - k)); ctx.lineWidth = 2.5; line(q[0], q[1], q[0] - 9 * k - 4, q[1] - 14 * k - 4); line(q[0], q[1], q[0] + 9 * k + 4, q[1] - 14 * k - 4); }   // rain on it
  const s2 = 1.35, hk = v2.add(HW, v2.mul(e, 80 * s2)), hpalm = { pts: [], ws: [], flat: true }, hers = [hpalm];
  for (let i = 0; i <= 8; i++) { const q = i / 8; hpalm.pts.push(v2.lerp(v2.sub(HW, v2.mul(e, 26)), hk, q)); hpalm.ws.push(keys([[0, 25], [.3, 26], [.7, 32], [1, 30]], q) * s2); }
  for (let i = 0; i < 4; i++) {
    const a1 = ang + (i - 1.5) * .05 * (1 - kh) - kh * .4, a2 = a1 - kh * .9;
    hers.push(cmbFinger(v2.sub(v2.add(hk, v2.mul(nrm, (i - 1.5) * 13.2 * s2)), v2.mul(e, 8 * s2)), [(42 - Math.abs(i - 1.3) * 5) * s2, 27 * s2], [Math.PI - a1, Math.PI - a2], 21 * s2, 17 * s2));
  }
  hers.push(cmbFinger(v2.add(v2.add(HW, v2.mul(e, 34 * s2)), v2.mul(nrm, 26 * s2)), [32 * s2, 22 * s2], [Math.PI - (ang + .62 - kh * .4), Math.PI - (ang + .36 - kh * .5)], 22 * s2, 17 * s2));
  cmbForm([hpalm], { fill: [30, 20, 20], rim: lampC, a: .95, lx: .5, ly: -.8, off: 5, sheen: .5 });
  for (let i = 1; i < hers.length; i++) cmbForm([hers[i]], { fill: [30, 20, 20], rim: lampC, a: .95, lx: .5, ly: -.8, off: 4.5, sheen: .5 });
  // his first finger and his thumb close over hers
  cmbForm([fingers[3]], R2);
  const rub = .07 * cmbBump(T, .98, 1.14, 1.4);                                          // his thumb moves once across her fingers
  cmbForm([cmbFinger(PW(32, 70), [60 * hs, 46 * hs], [lerp(.24, .72, curl) + rub, lerp(.4, 1.16, curl) + rub * 2], 37 * hs, 27 * hs)], R2);
  const tipI = fingers[3].pts[fingers[3].pts.length - 1];
  // rain: a drop gathers on his fingertip and falls; streaks lit by the lamp
  const dq = inv(.14, .5, T);
  if (dq < 1) { const y = tipI[1] + 30 + (dq > .45 ? Math.pow((dq - .45) / .55, 2) * 560 : 0); oval(tipI[0] + 6, y, 6 + 2 * dq, 9 + (dq > .45 ? 11 : 5 * dq), rgba([206, 224, 255], .85)); }
  additive(() => { ctx.lineCap = 'round'; ctx.lineWidth = 3; for (let i = 0; i < 26; i++) { const sp = 1.5 + rnd(i * 1.3), tt = t * sp + rnd(i * 3.1), h = tt % 1, x = 760 + rnd(i * 1.7 + Math.floor(tt) * 5.3) * 860, y = -80 + h * 1050; ctx.strokeStyle = rgba(lampC, clamp(.4 * (1 - Math.abs(x - 1170) / 560))); line(x, y, x - 10, y - 74); } });
  rain(t, { n: 110, len: 110, speed: 2000, slant: .14, a: .24 });
  rain(t, { n: 12, len: 300, speed: 3000, slant: .14, a: .1, w: 7, seed: 7 });
}, { bloom: .5, grain: .55 }, [640, 120, 1400, 900]);
