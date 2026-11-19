'use strict';
// ENVY | It Showed Him Everyone Else: this film's own props (the shared kit is stage/kit.js; the cast is stage/rig.js).
// The accent colour is GREEN: the devil's window, other people's lives. Everything of his own is warm (the lamp, his
// yellow pencil). Two of him: the split (SPLIT) draws a left and a right half with a torn line between them.
const GREEN = [96, 236, 128], GREEN_D = [14, 54, 30], GREEN_L = [190, 255, 200];
const LAMP = [255, 214, 160], CAP = [62, 116, 204], GOLD = [246, 196, 60], PENCIL = [250, 196, 40], PAPER = [236, 232, 220];
// ---- his yellow pencil (s: its length) ----
function pencilD(x, y, s, rot = 0) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.055, .78, .11); }, rgba(PENCIL), .02);
  rectf(-.5, -.055, .78, .035, 'rgba(255,255,255,.35)');
  outlined(() => { ctx.beginPath(); ctx.rect(-.58, -.055, .09, .11); }, rgba([236, 130, 140]), .02);
  outlined(() => poly([[.28, -.055], [.5, 0], [.28, .055]]), rgba([228, 196, 150]), .018); poly([[.43, -.016], [.5, 0], [.43, .016]], rgba(D.line)); }); }
// the pencil behind his ear (f: what figure() returned; side -1 left, +1 right of the head)
const earPencil = (f, side = 1) => pencilD(f.head[0] + side * f.hr * .78, f.head[1] - f.hr * .5, f.hr * 1.5, side * .5 - .1);
// ---- Max's blue cap, on a head (f) or anywhere (x, y the middle of its band, s the head radius) ----
function capAt(x, y, s, rot = 0, col = CAP, brim = 1) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.moveTo(-1.02, .02); ctx.bezierCurveTo(-1.0, -.95, 1.0, -.95, 1.02, .02); ctx.closePath(); }, rgba(col), .05);
  outlined(() => { ctx.beginPath(); ctx.ellipse(brim * .95, .02, .78, .16, brim * .08, 0, TAU); }, rgba(darken(col, .25)), .05);
  stroke([[0, -.66], [0, -.05]], .05, rgba(darken(col, .35))); disc(0, -.68, .1, rgba(darken(col, .3))); stroke([[-.62, -.5], [-.3, -.7]], .09, 'rgba(255,255,255,.3)'); }); }
const capOn = (f, brim = 1, col = CAP, tilt = 0, lift = 0) => capAt(f.head[0] + Math.sin(tilt) * f.hr * .5, f.head[1] - f.hr * (.5 + lift), f.hr * 1.02, tilt, col, brim);
// on the devil the cap sits higher, between its horns, so its eyes always show
const devCap = (f, brim = 1, tilt = 0) => capOn(f, brim, CAP, tilt, .32);
// ---- a gold medal on a ribbon (x, y the medal; s its radius; hang: the ribbon's top) ----
function medalD(x, y, s, top) { const t = top || [x, y - s * 2.6];
  for (const sd of [-1, 1]) outlined(() => poly([[t[0] + sd * s * .9, t[1]], [t[0] + sd * s * .3, t[1]], [x + sd * s * .1, y - s * .7], [x + sd * s * .55, y - s * .5]]), rgba(sd < 0 ? [200, 50, 50] : [60, 90, 190]), Math.max(1.5, s * .06));
  outlined(() => { ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); }, rgba(GOLD), Math.max(1.5, s * .07)); ctx.lineWidth = Math.max(1, s * .1); ctx.strokeStyle = rgba(darken(GOLD, .25)); ctx.beginPath(); ctx.arc(x, y, s * .62, 0, TAU); ctx.stroke();
  disc(x - s * .3, y - s * .35, s * .2, 'rgba(255,255,255,.6)'); }
// ---- a ring of car keys (x, y the ring; s its radius; swing: radians) ----
function keysD(x, y, s, swing = 0) { ctx.lineWidth = s * .34 + 4; ctx.strokeStyle = rgba(D.line); ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.stroke(); ctx.lineWidth = s * .34; ctx.strokeStyle = rgba([206, 210, 220]); ctx.stroke();
  [[-.5, [206, 210, 220], 0], [.15, [222, 186, 92], 0], [.75, [56, 58, 70], 1]].forEach(([a, c, fob]) => at(x + Math.sin(a + swing) * s, y + Math.cos(a + swing) * s, s, -(a + swing), () => {
    if (fob) outlined(() => { ctx.beginPath(); ctx.roundRect(-.55, .1, 1.1, 1.9, .4); }, rgba(c), .1);
    else { outlined(() => { ctx.beginPath(); ctx.arc(0, .55, .5, 0, TAU); }, rgba(c), .1); outlined(() => poly([[-.18, .95], [.18, .95], [.18, 2.4], [0, 2.6], [-.18, 2.3], [-.06, 2.1], [-.18, 1.9]]), rgba(c), .1); disc(0, .5, .16, rgba(D.line)); } })); }
// ---- paper: a page with a drawing on it. kind: 'hero' | 'monster' | 'two' (two boys) | 'scrawl' | 'blank'; q: how good (0 a stick figure .. 1 a real drawing)
function pageD(x, y, s, rot = 0, o = {}) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.66, 1, 1.32); }, rgba(o.col || PAPER), .015);
  const ink = rgba([60, 60, 70], .9), q = o.q ?? .5, k = o.kind || 'hero', w = .022 + .012 * q;
  if (k === 'hero' || k === 'two') { const hx = k === 'two' ? -.18 : 0;
    for (const dx of k === 'two' ? [hx, .2] : [hx]) { ctx.lineWidth = w; ctx.strokeStyle = ink; ctx.beginPath(); ctx.arc(dx, -.3, .11 + .03 * q, 0, TAU); ctx.stroke();
      curve([[dx, -.17], [dx + .01, .12]], w, ink); curve([[dx - .16, -.08], [dx, -.12], [dx + .17 + q * .05, -.24 - q * .1]], w, ink); curve([[dx - .1, .38], [dx, .12], [dx + .1, .38]], w, ink);
      if (q > .4) { blob([[dx - .02, -.14], [dx - .2 - q * .1, .05], [dx - .26 - q * .14, .26], [dx - .05, .05]], rgba([200, 70, 60], .8 * q), .4); } }
    if (k === 'two') curve([[-.06, -.1], [.08, -.12]], w, ink); }
  if (k === 'monster') { blob([[-.25, .3], [-.3, -.1], [-.1, -.35], [.15, -.33], [.3, -.05], [.26, .3]], rgba([60, 60, 70], .85), .5); for (const sd of [-1, 1]) disc(sd * .1, -.12, .05, rgba(PAPER)); curve([[-.12, .1], [0, .16], [.12, .1]], .025, rgba(PAPER)); }
  if (k === 'scrawl') for (let i = 0; i < 5; i++) curve([[-.36, -.4 + i * .18], [-.1, -.43 + i * .18], [.2, -.38 + i * .18], [.36, -.42 + i * .18]], .02, rgba([60, 60, 70], .6));
  if (o.no) { stroke([[-.4, -.5], [.4, .5]], .05, rgba([200, 40, 40], .8)); stroke([[.4, -.5], [-.4, .5]], .05, rgba([200, 40, 40], .8)); } }); }
// a crumpled page (a ball of paper)
function ballD(x, y, r, rot = 0) { at(x, y, r, rot, () => { outlined(() => blobPath([[-1, .1], [-.7, -.8], [.1, -1], [.9, -.6], [1, .3], [.4, .95], [-.6, .85]], .4, true), rgba(PAPER), .07);
  for (const [a, b] of [[[-.6, -.2], [.1, -.5]], [[-.2, .4], [.5, .1]], [[.1, -.5], [.3, .2]], [[-.5, .5], [-.1, .1]]]) stroke([a, b], .07, rgba([150, 146, 140])); }); }
// a sketchbook (x, y its bottom middle, s its width), open (0 shut .. 1 flat), and torn (0..1: the two halves pulled apart)
function bookD(x, y, s, o = {}) { const tear = o.tear || 0, op = o.open ?? 0;
  for (const sd of tear > 0 ? [-1, 1] : [0]) at(x + sd * tear * s * .4, y + Math.abs(sd) * tear * s * .05, s, sd * tear * .5, () => {
    ctx.save(); if (sd) { ctx.beginPath(); ctx.rect(sd < 0 ? -1 : 0, -2, 1, 4); ctx.clip(); }
    outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.7, 1, .7); }, rgba(o.col || [120, 70, 60]), .02);
    rectf(-.46, -.66, .92, .1, rgba(PAPER, .5)); if (o.label) { stroke([[-.25, -.38], [.25, -.38]], .03, rgba(PAPER, .7)); stroke([[-.18, -.28], [.18, -.28]], .03, rgba(PAPER, .5)); }
    ctx.restore(); });
  if (op > 0) at(x, y, s, 0, () => { outlined(() => { ctx.beginPath(); ctx.rect(-1 * op, -.7, 2 * op, .7); }, rgba(PAPER), .015); stroke([[0, -.7], [0, 0]], .02, rgba(D.line, .4)); }); }
// a waste bin (x, y its bottom middle, s its height)
function binD(x, y, s, n = 0) { outlined(() => poly([[x - s * .36, y - s], [x + s * .36, y - s], [x + s * .28, y], [x - s * .28, y]]), rgba([70, 74, 90]), 4);
  for (let i = 0; i < 4; i++) stroke([[x - s * .22 + i * s * .15, y - s * .9], [x - s * .17 + i * s * .11, y - s * .1]], 3, rgba(D.line, .5));
  for (let i = 0; i < n; i++) ballD(x - s * .2 + rnd(i * 3.1) * s * .4, y - s - s * .05 - (i % 3) * s * .1, s * .14, i); }
// a desk lamp (x, y its foot on the desk; on 0..1; dir: which way its head points, +1 right)
function deskLampD(x, y, s, on = 1, dir = 1, col = LAMP) {
  const elbow = [x - dir * s * .25, y - s * .75], head = [x + dir * s * .25, y - s * 1.0];
  outlined(() => { ctx.beginPath(); ctx.ellipse(x, y - s * .03, s * .26, s * .06, 0, 0, TAU); }, rgba(D.prop), 3.5);
  stroke([[x, y - s * .05], elbow, head], s * .05 + 6, rgba(D.line)); stroke([[x, y - s * .05], elbow, head], s * .05, rgba(D.prop));
  at(head[0], head[1], s, dir * .5, () => outlined(() => poly([[-.12, -.06], [.12, -.06], [.24, .18], [-.24, .18]]), rgba(D.propL), .02));
  if (on > 0) { const hx = head[0] + dir * s * .1, hy = head[1] + s * .2; cone(hx, hy, s * .2, s * 1.1, s * 1.05, col, .16 * on, dir * s * .2); glow(col, hx, hy, s * .55, .55 * on); disc(hx, hy - s * .03, s * .07, rgba(lighten(col, .5), on)); }
  return head; }
// the desk: a top from x0 to x1 at y (legs to the floor at floorY); panel: a front board that hides whoever sits behind it
function deskD(x0, x1, y, floorY = 900, panel = true) { for (const x of [x0 + 24, x1 - 52]) outlined(() => { ctx.beginPath(); ctx.rect(x, y + 26, 26, floorY - y - 26); }, rgba(mix(D.wood, D.stage, .3)), 4);
  if (panel) outlined(() => { ctx.beginPath(); ctx.rect(x0 + 30, y + 20, x1 - x0 - 60, Math.min(170, floorY - y - 60)); }, rgba(mix(D.wood, D.stage, .45)), 4);
  outlined(() => { ctx.beginPath(); ctx.rect(x0, y, x1 - x0, 26); }, rgba(D.wood), 5); }
// a cork board on the wall with n of his drawings pinned to it (n grows: they fill the board), q how good they are
function boardD(x, y, w, h, n, q = .5, o = {}) { outlined(() => { ctx.beginPath(); ctx.rect(x, y, w, h); }, rgba(o.bare ? [70, 56, 46] : [120, 92, 66]), 5);
  const cols = 4, rows = 3, cw = w / cols, chh = h / rows;
  for (let i = 0; i < Math.min(n, cols * rows); i++) { const cx = x + cw * (i % cols + .5) + (rnd(i * 2.1) - .5) * cw * .2, cy = y + chh * (Math.floor(i / cols) + .5) + (rnd(i * 3.3) - .5) * chh * .15;
    pageD(cx, cy, chh * .62, (rnd(i * 5.7) - .5) * .25, { kind: ['hero', 'monster', 'two', 'hero'][i % 4], q: Math.min(1, q + rnd(i) * .2), col: i % 5 === 3 ? [250, 236, 200] : PAPER }); disc(cx, cy - chh * .38, 5, rgba([220, 60, 50])); }
  if (o.letter) { const lx = x + w * .78, ly = y + h * .74; pageD(lx, ly, chh * .7, .08, { kind: 'scrawl', col: [244, 244, 236] }); at(lx, ly, chh * .7, .08, () => { rectf(-.46, -.5, .92, .3, rgba([244, 244, 236])); ink('NO,', 0, -.42, .13, [170, 40, 40]); ink('THANK YOU.', 0, -.27, .12, [170, 40, 40]); }); disc(lx, ly - chh * .42, 5, rgba([220, 60, 50])); } }
// a pile of pages on the desk (x, y its bottom middle; n: how many: the pile gets taller)
function pileD(x, y, w, n) { const hh = Math.min(170, n * .55); for (let i = 0; i < Math.max(1, Math.round(hh / 6)); i++) { const yy = y - i * 6; outlined(() => { ctx.beginPath(); ctx.rect(x - w / 2 + (rnd(i * 1.3) - .5) * 10, yy - 6, w, 6); }, rgba(i % 2 ? PAPER : [222, 218, 206]), 1.5); } return y - hh; }
// hearts floating up (in the window): n of them, a little shape each, never an emoji
function heartD(x, y, s, col = [255, 110, 130], a = 1) { at(x, y, s, 0, () => { blob([[0, .9], [-.95, -.05], [-.75, -.75], [-.2, -.75], [0, -.35], [.2, -.75], [.75, -.75], [.95, -.05]], rgba(col, a), .45); }); }
function heartsD(x, y, w, L, n = 7, s = 18) { for (let i = 0; i < n; i++) { const k = (L * (.45 + rnd(i) * .3) + rnd(i * 2.7)) % 1; heartD(x + (rnd(i * 4.4) - .5) * w + Math.sin(L * 3 + i) * 10, y - k * w * .9, s * (.7 + rnd(i * 6.1) * .6) * (1 - k * .3), [255, 120, 140], (1 - k) * .95); } }
// THE WINDOW: the devil's little frame of green light. (x, y) its middle, w x h, k 0..1 opening; fn(x0, y0, w, h) draws
// what is in it in pixels (clipped to the window). back: seen from behind. glow: how much light it throws round itself.
function windowD(x, y, w, h, k = 1, fn, o = {}) { if (k <= 0) return; const ww = w * eo(k), hh = h * clamp(k * 1.6), r = Math.min(ww, hh) * .08;
  additive(() => glow(GREEN, x, y, Math.max(ww, hh) * .95, .3 * k * (o.glow ?? 1)));
  const path = () => { ctx.beginPath(); ctx.roundRect(x - ww / 2, y - hh / 2, ww, hh, r); };
  path(); ctx.lineWidth = Math.max(5, w * .035) + 10; ctx.strokeStyle = rgba(D.line); ctx.lineJoin = 'round'; ctx.stroke();
  if (o.back) { path(); ctx.fillStyle = rgba([20, 26, 24]); ctx.fill(); }
  else { path(); ctx.fillStyle = lg(0, y - hh / 2, 0, y + hh / 2, [[0, mix(GREEN_D, GREEN, .55)], [.6, mix(GREEN_D, GREEN, .3)], [1, GREEN_D]]); ctx.fill();
    if (fn && k > .6) inside(path, () => { ctx.save(); ctx.globalAlpha = clamp((k - .6) / .3); fn(x - ww / 2, y - hh / 2, ww, hh); ctx.restore(); });
    inside(path, () => rectf(x - ww / 2, y - hh / 2, ww, hh, lg(x - ww / 2, y - hh / 2, x + ww / 2, y + hh / 2, [[0, [255, 255, 255], .16], [.35, [255, 255, 255], 0], [1, [255, 255, 255], 0]]))); }
  path(); ctx.save(); ctx.shadowColor = rgba(GREEN, .95); ctx.shadowBlur = Math.max(10, w * .08); ctx.lineWidth = Math.max(4, w * .022); ctx.strokeStyle = rgba(GREEN_L); ctx.stroke(); ctx.restore(); }
// the window's green light on a face or a wall (additive)
const winLight = (x, y, r, a) => glow(GREEN, x, y, r, a);
// a spotlight and a stage floor inside a window (x0, y0, w, h: the window's box)
function winStage(x0, y0, w, h) { additive(() => { glow([220, 255, 220], x0 + w / 2, y0 + h * .3, w * .6, .25); }); rectf(x0, y0 + h * .82, w, h * .18, rgba(GREEN_D, .6)); stroke([[x0, y0 + h * .82], [x0 + w, y0 + h * .82]], Math.max(2, w * .006), rgba(GREEN_L, .5)); }
// a person inside the window, in pixels: a cream figure with one thing of theirs (cap, medal, trophy, pencil)
function winPerson(t, x, y, h, o = {}) { const f = figure({ kind: 'sam', x, y, h, expr: o.expr || 'laugh', look: o.look || [0, .1], turn: o.turn, armL: o.armL, armR: o.armR, bendL: o.bendL, bendR: o.bendR, stretch: true, t, seed: o.seed || 3 });
  if (o.cap) capOn(f, o.cap); if (o.pencil) earPencil(f, 1); return f; }
// ---- TWO OF HIM: the mirror. A half-scene is drawn for the LEFT half (x 0..960, the tear at 960) and mirrored for the
// right: SIDE = 1 on the left, -1 on the right; M(x) maps a left-half x to the side being drawn; fig(o) poses a figure
// so that the right one is the left one's mirror image (look, turn, tilt, lean, arms, knees, tail all flipped).
let SIDE = 1;
const M = x => SIDE > 0 ? x : W - x, MP = p => p && [M(p[0]), p[1]];
function fig(o) { if (SIDE > 0) return figure(o); const r = { ...o, x: M(o.x) };
  for (const k of ['look', 'tail']) if (o[k]) r[k] = [-o[k][0], o[k][1]];
  for (const k of ['turn', 'tilt', 'lean', 'headDx', 'sit', 'kneel', 'glowSide', 'lift']) if (o[k] != null) r[k] = -o[k];
  r.armL = MP(o.armR); r.armR = MP(o.armL); r.bendL = o.bendR != null ? -o.bendR : undefined; r.bendR = o.bendL != null ? -o.bendL : undefined;
  if (o.glowOn && o.glowSide == null) r.glowSide = -1;
  const f = figure(r); return { ...f, armEndL: f.armEndR, armEndR: f.armEndL, shL: f.shR, shR: f.shL }; }
// THE SPLIT: the same moment twice. half(side) draws a half-scene with M()/fig() (SIDE is set for it). o:
//   tear 0..1   the torn line runs down from the top; below its tip the picture is still o.one() (one boy)
//   slide 0..1  the halves slide apart from the middle (at 0 each half's boy stands on the tear: the two halves of one boy)
//   stitch 0..1 the tear is sewn shut from the bottom up (at 1 it is gone: draw one boy again)
//   focus 'L' | 'R'  the other half is dimmed, so the eye reads one half per cut
//   gap  the black between the halves (px)
const HALF = 480;
function SPLIT(half, o = {}) { const tear = o.tear ?? 1, g = (o.gap ?? 12) * (1 - (o.stitch || 0)), sl = 1 - (o.slide ?? 1), ln = o.lineX ?? 960, shift = (ln - 960) / 2;
  const P = Array.from({ length: 23 }, (_, i) => [ln + (rnd(i * 7.7 + 3) - .5) * 26 + Math.sin(i * 1.3) * 8, -20 + i * 51]), ty = -20 + tear * 1140;
  const path = (side, off) => { ctx.beginPath(); ctx.moveTo(side > 0 ? -10 : W + 10, -20); for (const [x, y] of P) ctx.lineTo(x + off, y); ctx.lineTo(side > 0 ? -10 : W + 10, 1140); ctx.closePath(); };
  if (tear < 1 && o.one) { ctx.save(); ctx.beginPath(); ctx.rect(0, ty, W, H + 40); ctx.clip(); o.one(); ctx.restore(); }
  for (const side of [1, -1]) { ctx.save(); path(side, -side * g / 2); ctx.clip(); if (tear < 1) { ctx.beginPath(); ctx.rect(0, -20, W, ty + 20); ctx.clip(); }
    rectf(0, 0, W, H, rgba(D.stage)); ctx.translate(side * (sl * HALF - g / 2) + shift, 0); SIDE = side; half(side); SIDE = 1; ctx.restore();
    if (o.focus && (o.focus === 'L') !== (side > 0)) { ctx.save(); path(side, -side * g / 2); ctx.clip(); rectf(0, 0, W, H, rgba([0, 0, 0], o.dim ?? .55)); ctx.restore(); } }
  // the torn paper edges, and the stitches that close it
  ctx.save(); ctx.beginPath(); ctx.rect(0, -20, W, Math.max(0, ty + 20)); ctx.clip();
  for (const [side, col] of [[1, [210, 204, 190]], [-1, [230, 224, 210]]]) { ctx.beginPath(); P.forEach(([x, y], i) => { const xx = x - side * (g / 2 + 2 + rnd(i * 3.1) * 4); i ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y); }); ctx.lineWidth = 4; ctx.strokeStyle = rgba(col, .85); ctx.lineJoin = 'round'; ctx.stroke(); }
  if (o.stitch > 0) for (let i = 0; i < 22; i++) { if (i / 21 > o.stitch) continue; const y = 1080 - i * 51 - 10, x = ln + (rnd(i * 7.7 + 3) - .5) * 20; stroke([[x - 26, y - 12], [x + 26, y + 12]], 6, rgba(PAPER, .95)); stroke([[x - 26, y + 12], [x + 26, y - 12]], 6, rgba(PAPER, .7)); }
  ctx.restore();
  if (tear > 0 && tear < 1) additive(() => glow([255, 240, 220], ln, ty, 80, .7));
}
// zoom about a point without moving it (inside a half of the split, camD would re-centre the half on the screen)
function zoomAt(z, x, y, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(z, z); ctx.translate(-x, -y); fn(); ctx.restore(); }
// the counters of the split: one at the top of each half (the pages he has drawn)
const counterL = (text, size = 46) => hw(text, 90, 40 + size * .95, size, 'say', { align: 'left', rot: 0 });
const counterR = (text, size = 46) => hw(text, W - 90, 40 + size * .95, size, 'say', { align: 'right', rot: 0 });
// ---- Max's first show: a gallery wall with framed drawings under little spotlights (x0..x1 along the wall) ----
function galleryD(x0, x1, t, o = {}) { const n = o.n || 4, y = o.y || 300, s = o.s || 150;
  stroke([[x0, 120], [x1, 120]], 4, rgba(D.floor));
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + .5) / n);
    cone(x, 120, 14, s * .7, y + s * .9 - 120, [255, 236, 200], .11); glow([255, 230, 190], x, 124, 30, .7);
    outlined(() => { ctx.beginPath(); ctx.rect(x - s * .52, y - s * .66, s * 1.04, s * 1.32); }, rgba([40, 40, 46]), 5);
    pageD(x, y, s * .92, 0, { kind: ['hero', 'two', 'monster', 'hero'][i % 4], q: 1 }); }
  if (o.banner) { outlined(() => { ctx.beginPath(); ctx.rect(lerp(x0, x1, .5) - 260, 30 + 120, 520, 0); }, rgba(D.prop), 2); } }
// a card that comes under the door (x, y its middle, s its width): MY FIRST SHOW. SAT. COME? - MAX
function inviteD(x, y, s, rot = 0, words = true) { at(x, y, s, rot, () => { outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.32, 1, .64); }, rgba([250, 246, 236]), .012);
  rectf(-.5, -.32, 1, .12, rgba(CAP)); capAt(.36, .2, .09, 0); });
  if (words) at(x, y, s, rot, () => { ink('MY FIRST SHOW. SAT.', 0, -.03, .085, [40, 50, 90]); ink('come? - MAX', 0, .14, .09, [40, 50, 90]); }); }
// dark handwriting on paper (in the current space: x, y, size), the bundled font
function ink(text, x, y, size, col = [50, 50, 60], align = 'center') { ctx.save(); ctx.font = `700 ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(col); ctx.fillText(text, x, y); ctx.restore(); }
// a front door (x the middle, y the floor), open 0..1 (swings in), a porch light above it
function doorD(x, y, open = 0, light = 1) { const w = 300, h = 560;
  if (light) { glow(LAMP, x, y - h - 60, 260, .5 * light); cone(x, y - h - 50, 40, 330, h + 50, LAMP, .1 * light); }
  outlined(() => { ctx.beginPath(); ctx.rect(x - w / 2 - 22, y - h - 22, w + 44, h + 22); }, rgba(D.prop), 5);
  rectf(x - w / 2, y - h, w, h, rgba([30, 26, 24])); if (open > 0) additive(() => glow(LAMP, x, y - h / 2, 300, .3 * open));
  outlined(() => { ctx.beginPath(); ctx.rect(x - w / 2, y - h, w * (1 - .8 * open), h); }, rgba([96, 70, 58]), 4); if (open < .7) disc(x + w * .35 * (1 - .8 * open) - 20, y - h * .48, 10, rgba(GOLD)); }
