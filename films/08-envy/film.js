// BUILT by stage/build.sh from src/*.js - edit the parts, not this file
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
// ---- the sets: his desk (one boy, or a half of the split), drawn with M()/fig() so the right half is the left's mirror ----
// deskHalf(t, o): the desk seen from the front, the boy behind it at x 480 (the middle of the left half). Everything is
// given in left-half coordinates. o: green (the window's light instead of the lamp's), lamp 0..1, pinned (drawings on the
// board), q (how good), letter (NO, THANK YOU. pinned), pile (pages on the desk), bin (balls in the bin), pencil (behind
// his ear: false when it has been eaten), boy: figure options (expr, look, turn, tilt, lean, armL, armR, ...), before(f)
// and after(f): drawn behind the desk / in front of it, X: where the boy sits.
const DESK_Y = 690;
function deskHalf(t, o = {}) {
  const X = o.X ?? 480, green = o.green ? 1 : 0, lamp = o.lamp ?? 1;
  stageD(900, { pool: [M(X), 560, 560, green ? GREEN : LAMP, green ? .1 + .08 * (o.glowK ?? 1) : .18 * Math.max(.4, lamp)] });
  const bx = X - 220; boardD(SIDE > 0 ? bx : M(bx + 440), 140, 440, 280, o.pinned ?? 4, o.q ?? .5, { bare: o.pinned === 0, letter: o.letter });
  if (o.back) o.back();
  deskLampD(M(X - 340), DESK_Y, 210, lamp, SIDE);
  const f = fig({ kind: 'sam', x: X, y: 880, h: 470, expr: 'calm', look: [0, .3], noLegs: true, bendL: -.3, bendR: .3, stretch: true, t, glowSide: 1,
    glowOn: green ? [GREEN, .3 * (o.glowK ?? 1)] : lamp > .3 ? [LAMP, .18] : undefined, ...(o.boy || {}) });
  if (o.pencil !== false) earPencil(f, SIDE);
  if (o.before) o.before(f);
  if (o.pile) pileD(M(X + 270), DESK_Y, 120, o.pile);
  deskD(SIDE > 0 ? X - 400 : M(X + 400), SIDE > 0 ? X + 400 : M(X - 400), DESK_Y);
  if (o.bin != null) binD(M(X + 330), 900, 110, o.bin);
  if (o.after) o.after(f);
  return f;
}
// the window lying face down on the desk, green light leaking from under it (k: how much)
function windowDown(x, k = 1) { additive(() => { ctx.save(); ctx.translate(x, DESK_Y - 4); ctx.scale(1, .16); glow(GREEN, 0, 0, 230, .45 * k); ctx.restore(); });
  outlined(() => { ctx.beginPath(); ctx.rect(x - 118, DESK_Y - 13, 236, 11); }, rgba([22, 30, 26]), 3); stroke([[x - 112, DESK_Y - 2], [x + 112, DESK_Y - 2]], 3, rgba(GREEN_L, .7 * k)); }
// a page lying on the desk in front of him (seen from the front: a flat sliver) with the pencil working on it
function deskPage(x, k = 1) { outlined(() => { ctx.beginPath(); ctx.rect(x - 90, DESK_Y - 8, 180, 8); }, rgba(PAPER), 2); }
// ---- 0-4.6 TOGETHER: two boys on the floor drawing one comic (Max a hero, Theo the monster), a high five ----
// the comic they draw together: two panels on one big sheet (x, y its middle, s its width), done 0..1 (how much is drawn)
function comicD(x, y, s, done = 1, rot = 0) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.34, 1, .68); }, rgba(PAPER), .006);
  ctx.lineWidth = .006; ctx.strokeStyle = rgba(D.line, .6); ctx.strokeRect(-.46, -.3, .44, .6); ctx.strokeRect(.02, -.3, .44, .6);
  const ink = rgba([60, 60, 70]), a = clamp(done * 2), b = clamp(done * 2 - 1);
  if (a > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-.46, -.3, .44 * a, .6); ctx.clip();            // panel 1: Max's hero, a red cape
    ctx.lineWidth = .014; ctx.strokeStyle = ink; ctx.beginPath(); ctx.arc(-.24, -.12, .06, 0, TAU); ctx.stroke(); curve([[-.24, -.06], [-.24, .1]], .014, ink); curve([[-.32, -.02], [-.24, -.04], [-.14, -.16]], .014, ink); curve([[-.3, .22], [-.24, .1], [-.18, .22]], .014, ink);
    blob([[-.25, -.04], [-.36, .06], [-.4, .18], [-.27, .06]], rgba([210, 70, 60], .85), .4); ctx.restore(); }
  if (b > 0) { ctx.save(); ctx.beginPath(); ctx.rect(.02, -.3, .44 * b, .6); ctx.clip();              // panel 2: Theo's monster, round and black, smiling
    blob([[.1, .2], [.08, -.02], [.16, -.16], [.3, -.18], [.4, -.04], [.38, .2]], rgba([40, 40, 48]), .5); for (const sd of [-1, 1]) { disc(.24 + sd * .05, -.04, .022, rgba(PAPER)); } curve([[.18, .06], [.24, .1], [.3, .06]], .012, rgba(PAPER)); ctx.restore(); } }); }
// the monster he draws (big, on its own page), used on the comic's cover in the window and on his boards
function monsterD(x, y, s, o = {}) { at(x, y, s, o.rot || 0, () => { blob([[-.5, .5], [-.55, -.05], [-.3, -.45], [.15, -.5], [.5, -.15], [.48, .5]], rgba(o.col || [40, 40, 48]), .5);
  for (const sd of [-1, 1]) disc(sd * .16, -.08, .07, rgba(PAPER)); curve([[-.2, .16], [0, .26], [.2, .16]], .05, rgba(PAPER)); }); }
shot('floor', 'night', null, (L, u, t, c) => {
  const lk = c('look'), lg_ = c('laugh'), fv = c('five'), up = eo(seg(L, fv - .35, fv)), hit = blinkAt(L, [fv], .1), draw = seg(L, c('drawM'), lk - .1);
  say('they drew everything together.', 960, 230, 66, L, c('capTogether'), .7);
  camD(push(u, .05), 960, 600, () => {
    stageD(860, { pool: [960, 560, 760, LAMP, .2] });
    comicD(960, 850, 420, draw);
    const laugh = L > lg_, bob = laugh ? Math.abs(Math.sin((L - lg_) * 9)) * 8 : 0, wob = Math.sin(L * 22) * 8 * (L < lk ? 1 : 0);
    const mx = 650, tx = 1270, hy = lerp(620, 330, up);
    const m = figure({ kind: 'sam', x: mx, y: 842 - bob, h: 400, sit: 1, flat: true, lean: .14 * (1 - up), expr: laugh ? 'laugh' : L > lk ? 'smile' : { ...FX.calm, lid: .25 }, look: L > lk ? [.9, 0] : [.6, .9], tilt: laugh ? Math.sin(L * 9) * .05 : 0,
      armR: up > .02 ? [lerp(870, 952, up), hy] : [880 + wob, 838], armL: [mx - 70, 760], bendR: .3, stretch: true, t, seed: 4 });
    capOn(m, 1);
    const th = figure({ kind: 'sam', x: tx, y: 842 - bob, h: 400, sit: -1, flat: true, lean: -.14 * (1 - up), expr: laugh ? 'laugh' : L > lk ? 'smile' : { ...FX.calm, lid: .25 }, look: L > lk ? [-.9, 0] : [-.6, .9], tilt: laugh ? -Math.sin(L * 9) * .05 : 0,
      armL: up > .02 ? [lerp(1050, 968, up), hy] : [1060 - wob, 840], armR: [tx + 70, 760], bendL: -.3, stretch: true, t });
    earPencil(th, 1);
    if (up < .02) { pencilD(880 + wob, 832, 70, 2.3); pencilD(1060 - wob, 834, 70, .85); }
    if (L > fv) { const k = seg(L, fv, fv + .35); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42; stroke([[960 + Math.cos(a) * (40 + k * 60), hy - 10 + Math.sin(a) * (40 + k * 60)], [960 + Math.cos(a) * (70 + k * 110), hy - 10 + Math.sin(a) * (70 + k * 110)]], 6, rgba(D.white, 1 - k)); } }
  });
});
let D_ = null;
// ---- 4.6-19 THE WINDOW: one boy at his desk; it opens a little green window and shows him his best friend's best day ----
// what the windows show (each fn(x0, y0, w, h, L, t) draws in the window's box)
const SHOW = {
  max: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); const f = winPerson(t, x0 + w * .38, y0 + h * .97, h * .78, { expr: 'laugh', armR: [x0 + w * .64, y0 + h * .2], seed: 5 }); capOn(f, 1);
    pageD(x0 + w * .66, y0 + h * .26, h * .34, .12, { kind: 'hero', q: 1 }); heartsD(x0 + w * .84, y0 + h * .85, w * .32, L, 7, Math.max(6, w * .045)); },
  medal: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); for (let i = 0; i < 3; i++) glow([255, 236, 170], x0 + w * (.2 + i * .3), y0 + h * .1, w * .2, .3);
    const f = winPerson(t, x0 + w * .5, y0 + h * .97, h * .62, { expr: 'laugh', armL: [x0 + w * .3, y0 + h * .18], armR: [x0 + w * .7, y0 + h * .18], seed: 8 }); medalD(f.sx, f.shY + h * .1, h * .06, [f.sx, f.shY - h * .02]);
    heartsD(x0 + w * .85, y0 + h * .85, w * .3, L, 8, Math.max(6, w * .04)); heartsD(x0 + w * .15, y0 + h * .85, w * .3, L + 3, 6, Math.max(6, w * .035)); },
  crowd: (x0, y0, w, h, L, t) => { winStage(x0, y0, w, h); for (let i = 0; i < 6; i++) { if (i === 2 || i === 3) continue; figure({ kind: 'sam', x: x0 + w * (.1 + i * .16), y: y0 + h * 1.04, h: h * .55, expr: 'smile', look: [(2.5 - i) * .3, -.2], dim: .35, t, seed: i + 20, lw: .02 }); }
    const f = winPerson(t, x0 + w * .5, y0 + h * .99, h * .66, { expr: 'laugh', armL: [x0 + w * .36, y0 + h * .3], armR: [x0 + w * .64, y0 + h * .28], seed: 5 }); capOn(f, 1);
    heartsD(x0 + w * .5, y0 + h * .7, w * .8, L, 12, Math.max(6, w * .035)); },
  // his own best day: a young man holding up a printed comic with HIS monster on the cover (the pencil behind his ear)
  him: (x0, y0, w, h, L, t, o = {}) => { winStage(x0, y0, w, h); for (let i = 0; i < 7; i++) { if (i === 3) continue; figure({ kind: 'sam', x: x0 + w * (.06 + i * .148), y: y0 + h * 1.06, h: h * .5, expr: 'laugh', look: [(3 - i) * .3, -.3], dim: .4, t, seed: i + 30, lw: .02 }); }
    const f = winPerson(t, x0 + w * .5, y0 + h * 1.0, h * .66, { expr: 'laugh', armL: [x0 + w * .4, y0 + h * .2], armR: [x0 + w * .6, y0 + h * .2], pencil: 1, seed: 2 });
    bookCover(x0 + w * .5, y0 + h * .23, h * .26); heartsD(x0 + w * .5, y0 + h * .75, w * .9, L, 16, Math.max(7, w * .03)); }
};
// a printed comic book seen from the front: its cover is his monster (x, y the middle, s its height)
function bookCover(x, y, s, o = {}) { outlined(() => { ctx.beginPath(); ctx.rect(x - s * .38, y - s * .5, s * .76, s); }, rgba([230, 200, 60]), Math.max(2, s * .02));
  rectf(x - s * .38, y - s * .5, s * .76, s * .16, rgba([200, 50, 40])); monsterD(x, y + s * .12, s * .5); }
// the devil his size behind the boy's chair (one-boy desk, or a half): pose options
function devBehind(t, o) { const d = fig({ kind: 'devil', x: o.x, y: o.y ?? 940, h: o.h ?? 500, stage: 3, expr: o.expr || 'charm', look: o.look || [.6, .1], lean: o.lean || 0, tilt: o.tilt || 0, turn: o.turn, headDx: o.headDx, headDy: o.headDy,
    noLegs: true, armL: o.armL, armR: o.armR, bendL: o.bendL ?? .4, bendR: o.bendR ?? -.4, stretch: true, tail: o.tail || [-.34, -.1 + .04 * Math.sin(t * 3)], heat: o.heat ?? .8, t });
  if (o.cap) devCap(d, SIDE * (o.capBrim ?? 1)); if (o.medal) medalD(d.sx + SIDE * 6, d.shY + d.h * .2, d.h * .05, [d.sx + SIDE * 6, d.shY + d.h * .04]); return d; }
shot('night', 'crumple', 'PAGES: 30', (L, u, t, c) => {
  const gl = c('glowOn'), wi = c('winIn'), wt = c('winTurn'), dl = c('devLean'), sg = c('smileGone');
  const inK = eo(seg(L, wi, wi + .6)), flip = eio(seg(L, wt - .2, wt + .25)), lean = eio(seg(L, dl, dl + .7)), glowK = seg(L, gl, gl + .6);
  camD(push(u, .06) * 1.1, 900, 540, () => {
    deskHalf(t, { X: 960, green: false, lamp: 1, pinned: 3, q: .5, glowK,
      boy: { expr: L < sg ? (L > wt + .3 ? samEx('smile', L, [wt + 1.1]) : samEx('calm', L, [1.0, 2.6])) : { ...FX.sad, lid: .15 }, look: L < gl ? [0, .9] : [-.8, -.05], turn: L > gl ? -.2 : 0, armL: L < gl ? [900, 676] : undefined, armR: L < gl ? [1010, 680] : undefined,
        glowOn: glowK > 0 ? [GREEN, .32 * glowK] : [LAMP, .18], glowSide: -1 },
      back: () => { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); },
      before: f => { if (L < gl) { pencilD(1000, 668, 64, -.5); }
        if (lean > 0) devBehind(t, { x: lerp(420, 680, lean), y: 960, h: 560, expr: L > c('amazing') ? devEx('sweet', L, [c('amazing') + 1.2]) : devEx('happy', L, []), look: [.9, .4], lean: lerp(.0, .25, lean), tilt: .12 * lean,
            armR: [690, 470], armL: [600, 520], heat: .9 }); },
      after: f => {
        const wx = lerp(-120, 700, inK), wy = lerp(520, 430, inK);
        if (L > wi - .1) { if (lean <= 0) devArm([[-60, 560], [wx - 240, wy + 90], [wx - 60, wy + 60]], [44, 38, 30], 26);
          at(wx, wy, 1, 0, () => { ctx.scale(lerp(-1, 1, flip) || .001, 1); windowD(0, 0, 240, 180, 1, flip > .5 ? (x0, y0, w, h) => SHOW.max(x0, y0, w, h, L - wt, t) : null, { back: flip < .5 }); }); }
        if (L > gl && L < wi + .3) { const k = seg(L, gl, wi) * (1 - seg(L, wi, wi + .3)); glow(GREEN, 140, 470, 200, .5 * k); }
      } });
  });
  red('look. isn’t he amazing?', 470, 210, 74, L, c('amazing'), 1.0);
});
shot('crumple', 'split', 'PAGES: 30', (L, u, t, c) => {
  const ew = c('eyeWin'), ep = c('eyePage'), cr = c('crush'), to = c('toss'), ca = c('catch'), mu = c('munch'), gu = c('gulp'), gr = c('grow1'), rc = c('reach1'), cp = c('cap1'), co = c('capOn');
  const take = eio(seg(L, ep + .2, cr)), crushK = eo(seg(L, cr, cr + .45)), toss = seg(L, to, ca), grow = eback(seg(L, gr, gr + .45)), reach = eio(seg(L, rc, cp)), pull = eio(seg(L, cp, co)), put = eio(seg(L, co - .1, co + .25));
  const W0 = 240, H0 = 180, ww = lerp(W0, 360, grow), wh = lerp(H0, 270, grow), wx = 700 - (ww - W0) * .4, wy = 430 - (wh - H0) * .3;
  const counted = L >= c('count29');
  over(() => counter(counted ? 'PAGES: 29' : 'PAGES: 30'));
  camD(push(u, .05) * 1.1, 900, 540, () => {
    deskHalf(t, { X: 960, lamp: .8, pinned: 3, q: .5, glowK: 1 + grow * .3,
      boy: { expr: L < ep ? { ...FX.sad, lid: .1 } : L < cr ? 'tempted' : L < to + .3 ? { ...FX.strain, sweat: false } : 'sad', look: L < ep ? [-.8, -.05] : L < cr ? [.6, -.6] : L < to ? [0, .4] : [-.8, .0], turn: L < ep ? -.2 : L < cr ? .2 : -.1,
        armR: L > ep + .1 && L < to + .2 ? [lerp(1060, 1000, crushK), lerp(lerp(500, 300, take), 600, crushK)] : undefined, armL: L > cr && L < to + .2 ? [lerp(900, 950, crushK), 600 - 40 * crushK] : undefined,
        glowOn: [GREEN, .32 + .12 * grow], glowSide: -1 },
      back: () => { if (L < ep + .2) { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); } else if (L < cr) comicD(lerp(1130, 1060, take), lerp(260, 300, take), 210 * (1 - take * .2), 1, .05 + take * .3); },
      before: f => { D_ = devBehind(t, { x: 680, y: 960, h: 560, expr: L < ca ? devEx('happy', L, []) : L < gu + .2 ? { ...DX.happy, m: 'open', h: .5 } : L < rc ? devEx('sweet', L, []) : devEx('charm', L, [co + .6]), look: L < to ? [.9, .3] : L < gu ? [.9, .2] : [.4, -.2], lean: .3, tilt: .12,
          armR: L > to - .1 && L < gu + .1 ? [lerp(700, 640, toss), lerp(520, 300, toss)] : L > rc - .1 && L < co + .3 ? [lerp(lerp(690, wx, reach), 640, pull), lerp(lerp(470, wy, reach), 330, pull)] : [690, wy + 20], armL: [600, 520], heat: .9 + (L > mu && L < gr ? 1.2 : 0), cap: L >= co }); },
      after: f => { const d = D_;
        // the ball of paper: crushed in his hands, tossed, caught, eaten
        if (L > cr && L < to) ballD(lerp(1000, 975, crushK), 590, lerp(60, 34, crushK), crushK * 2);
        if (L >= to && L < mu) { const bx = lerp(980, d.head[0] + 30, toss), by = lerp(580, d.head[1] + d.hr * .3, toss) - Math.sin(toss * Math.PI) * 140; ballD(bx, by, 32, L * 8); }
        if (L >= mu && L < gu) { const k = seg(L, mu, gu); ballD(d.head[0] + d.hr * .1, d.head[1] + d.hr * .45, 32 * (1 - k), k * 3); }
        if (L >= gu - .1 && L < gu + .5) { const k = seg(L, gu - .1, gu + .5); for (let i = 0; i < 6; i++) { const a = rnd(i * 3.3) * TAU; disc(d.head[0] + Math.cos(a) * (50 + k * 90), d.head[1] + d.hr * .4 + Math.sin(a) * (30 + k * 60), 7 * (1 - k), rgba(PAPER, 1 - k)); } }
        // the window, and the cap it pulls out of it
        windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.max(x0, y0, w, h, L + 6, t));
        if (L >= gr && L < gr + .4) { const k = seg(L, gr, gr + .4); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); }
        if (L > cp && L < co) { capAt(lerp(wx, d.head[0], pull), lerp(wy - 10, d.head[1] - d.hr * .82, pull), 60 * lerp(.6, 1, pull), 0); }
      } });
  });
  popFlash(L, gr, .12);
});
