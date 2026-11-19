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
    outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.7, 1, .7); }, rgba(PAPER), .02);                      // the pages, seen from the edge
    for (let i = 1; i < 6; i++) stroke([[-.48, -.7 + i * .11], [.48, -.7 + i * .11]], .008, rgba([150, 146, 140]));
    outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.7, 1, .16); }, rgba(o.col || [120, 70, 60]), .02);        // the cover on top
    if (o.label) monsterD(0, -.4, .22);
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
  say('they drew everything together.', 960, 120, 66, L, c('capTogether'), .7);
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
    const f = winPerson(t, x0 + w * .5, y0 + h * 1.04, h * .7, { expr: 'laugh', armL: [x0 + w * .44, y0 + h * .66], armR: [x0 + w * .56, y0 + h * .66], pencil: 1, seed: 2 });
    bookCover(x0 + w * .5, y0 + h * .68, h * .27); heartsD(x0 + w * .5, y0 + h * .75, w * .9, L, 16, Math.max(7, w * .03)); }
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
  camD(push(u, .06) * 1.1, 760, 520, () => {
    deskHalf(t, { X: 960, green: false, lamp: 1, pinned: 3, q: .5, glowK,
      boy: { expr: L < sg ? (L > wt + .3 ? samEx('smile', L, [wt + 1.1]) : samEx('calm', L, [1.0, 2.6])) : { ...FX.sad, lid: .15 }, look: L < gl ? [0, .9] : [-.8, -.05], turn: L > gl ? -.2 : 0, armL: L < gl ? [900, 676] : undefined, armR: L < gl ? [1010, 680] : undefined,
        glowOn: glowK > 0 ? [GREEN, .32 * glowK] : [LAMP, .18], glowSide: -1 },
      back: () => { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); },
      before: f => { if (L < gl) { pencilD(1000, 668, 64, -.5); }
        if (lean > 0) devBehind(t, { x: lerp(480, 650, lean), y: 960, h: 560, expr: L > c('amazing') ? devEx('sweet', L, [c('amazing') + 1.2]) : devEx('happy', L, []), look: [.9, .4], lean: lerp(.0, .2, lean), tilt: .12 * lean,
            armL: [480, 470], armR: [760, 600], heat: .9 }); },
      after: f => {
        const wx = lerp(-160, 380, inK), wy = lerp(520, 440, inK);
        if (L > wi - .1) { if (lean <= 0) devArm([[-60, 560], [wx - 240, wy + 90], [wx - 60, wy + 60]], [44, 38, 30], 26);
          at(wx, wy, 1, 0, () => { ctx.scale(lerp(-1, 1, flip) || .001, 1); windowD(0, 0, 240, 180, 1, flip > .5 ? (x0, y0, w, h) => SHOW.max(x0, y0, w, h, L - wt, t) : null, { back: flip < .5 }); }); }
        if (L > gl && L < wi + .3) { const k = seg(L, gl, wi) * (1 - seg(L, wi, wi + .3)); glow(GREEN, 200, 470, 220, .5 * k); }
      } });
  });
  red('look. isn’t he amazing?', 760, 1000, 76, L, c('amazing'), 1.0);
});
shot('crumple', 'split', 'PAGES: 30', (L, u, t, c) => {
  const ew = c('eyeWin'), ep = c('eyePage'), cr = c('crush'), to = c('toss'), ca = c('catch'), mu = c('munch'), gu = c('gulp'), gr = c('grow1'), rc = c('reach1'), cp = c('cap1'), co = c('capOn');
  const take = eio(seg(L, ep + .2, cr)), crushK = eo(seg(L, cr, cr + .45)), toss = seg(L, to, ca), grow = eback(seg(L, gr, gr + .45)), reach = eio(seg(L, rc, cp)), pull = eio(seg(L, cp, co)), put = eio(seg(L, co - .1, co + .25));
  const W0 = 240, H0 = 180, ww = lerp(W0, 360, grow), wh = lerp(H0, 270, grow), wx = 380 - (ww - W0) * .45, wy = 440 - (wh - H0) * .25;
  const counted = L >= c('count29');
  over(() => counter(counted ? 'PAGES: 29' : 'PAGES: 30'));
  camD(push(u, .05) * 1.1, 760, 520, () => {
    deskHalf(t, { X: 960, lamp: .8, pinned: 3, q: .5, glowK: 1 + grow * .3,
      boy: { expr: L < ep ? { ...FX.sad, lid: .1 } : L < cr ? 'tempted' : L < to + .3 ? { ...FX.resolve, m: 'grit', lid: .1 } : 'sad', look: L < ep ? [-.8, -.05] : L < cr ? [.6, -.6] : L < to ? [0, .4] : [-.8, .0], turn: L < ep ? -.2 : L < cr ? .2 : -.1,
        armR: L > ep + .1 && L < to + .2 ? [lerp(1060, 1000, crushK), lerp(lerp(500, 300, take), 600, crushK)] : undefined, armL: L > cr && L < to + .2 ? [lerp(900, 950, crushK), 600 - 40 * crushK] : undefined,
        glowOn: [GREEN, .32 + .12 * grow], glowSide: -1 },
      back: () => { if (L < ep + .2) { comicD(1130, 260, 210, 1, .05); disc(1130, 160, 6, rgba([220, 60, 50])); } else if (L < cr) comicD(lerp(1130, 1060, take), lerp(260, 300, take), 210 * (1 - take * .2), 1, .05 + take * .3); },
      before: f => { D_ = devBehind(t, { x: 650, y: 960, h: 560, expr: L < ca ? devEx('happy', L, []) : L < gu + .2 ? { ...DX.happy, m: 'open', h: .5 } : L < rc ? devEx('sweet', L, []) : devEx('charm', L, [co + .6]), look: L < to ? [.9, .3] : L < gu ? [.9, .2] : L < co ? [-.7, -.1] : [.6, .1], lean: .2, tilt: .1,
          armR: L > to - .1 && L < gu + .1 ? [lerp(780, 720, toss), lerp(560, 400, toss)] : [760, 600], armL: L > rc - .1 && L < co + .3 ? [lerp(lerp(480, wx + 40, reach), 600, pull), lerp(lerp(470, wy, reach), 330, pull)] : [wx + ww * .4, wy + 20], heat: .9 + (L > mu && L < gr ? 1.2 : 0), cap: L >= co }); },
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
// ---- 19-36.5 THE SPLIT and ROUND 2: one boy tears into two; the left one feeds it, the right one turns the window face down ----
const BOOK = [120, 70, 60];
// the window standing on the desk in front of him, its back to us (light on his face); k: how lit
function winBack(x, w, k = 1, fold = 0) { const h = w * .75 * (1 - fold * .96); if (fold >= 1) return; windowD(x, DESK_Y - 4 - h / 2, w, h, 1, null, { back: true, glow: k * (1 - fold * .5) }); }
// one boy at the desk with the window lit in front of him (the picture the tear rips through: both halves at the middle)
function SPLITONE(half) { for (const side of [1, -1]) { ctx.save(); ctx.beginPath(); ctx.rect(side > 0 ? 0 : 960, 0, 960, H); ctx.clip(); ctx.translate(side * HALF, 0); SIDE = side; half(side); SIDE = 1; ctx.restore(); } }
shot('split', 'medal', null, (L, u, t, c) => {
  const pr = c('prop'), dk = c('dark'), te = c('tear'), tEnd = c('tearEnd'), sl = c('slide'), sEnd = c('slideEnd'), ln = c('lean'), gr = c('grinL'), dn = c('down'), cl = c('clack');
  const propK = eio(seg(L, 0, pr)), gone = eio(seg(L, pr + .1, dk)), tear = seg(L, te, tEnd), slide = eio(seg(L, sl, sEnd)), lean = eio(seg(L, ln, ln + .5)), grin = eo(seg(L, gr - .1, gr + .5)), down = eio(seg(L, dn, cl));
  const half = side => { const left = side > 0, lk = left ? lean : 0, dk_ = left ? 0 : down;
    deskHalf(t, { lamp: .45, pinned: 2, q: .5, green: true, glowK: 1 - .7 * dk_,
      boy: { y: 860, expr: left ? (lk > .3 ? 'tempted' : samEx('tempted', L, [.8])) : dk_ > .5 ? { ...FX.resolve, lid: .1 } : samEx('tempted', L, [.8]), look: [0, .5 - .3 * lk], lean: .1 * lk, headDy: .1 * lk, glowOn: [GREEN, .4 * (1 - .75 * dk_)], glowSide: 0,
        armR: !left && L > dn - .25 ? [lerp(560, 520, dk_), lerp(560, 650, dk_)] : undefined, armL: !left && L > dn - .25 ? [lerp(420, 440, dk_), lerp(560, 650, dk_)] : undefined },
      before: f => { if (left && (L < dk || grin > 0)) { const a = L < dk ? 1 - gone : grin; alpha(a, () => devBehind(t, { x: L < dk ? 300 : 300, y: 940, h: 560, expr: L < dk ? devEx('charm', L, [.6]) : devEx('grin', L, []), look: [.8, .3], lean: .1, heat: .9 * a,
          armR: L < dk ? [lerp(470, 380, gone), lerp(560, 640, gone)] : [360, 640], armL: [250, 660], cap: true })); }
        if (left && L >= dk && grin <= 0) for (const sd of [-1, 1]) oval(M(300 + sd * 26), 420, 9, 13 * (1 - blinkAt(L, [dk + .6], .1)), rgba(D.hot, .8 * seg(L, dk, dk + .3))); },
      after: f => { if (L < cl || left) winBack(M(480), 190, 1, left ? 0 : dk_); else windowDown(M(480), 1); } });
  };
  if (L < te) { camD(push(u, .03), 960, 540, () => SPLITONE(half)); return; }
  SPLIT(side => half(side), { tear, slide, one: () => SPLITONE(half), focus: L > ln - .1 && L < dn - .2 ? 'L' : L >= dn - .2 ? 'R' : null, dim: .45 });
  if (L > sEnd) { counterL('PAGES: 29'); counterR('PAGES: 29'); }
});
// ---- ROUND 2: the left half (its window a poster now; the sketchbook torn, the pencil eaten, the medal taken) ----
function round2L(L, t, c, o = {}) {
  const w2 = c('win2'), rp = c('rip'), m2 = c('munch2'), pl = c('pluck'), cr = c('crunch'), mt = c('medalTake'), mo = c('medalOn'), lo = c('lampOff');
  const rip = eo(seg(L, rp - .15, rp + .25)), up = eio(seg(L, rp - 1, rp - .2)), eat = seg(L, m2 - .1, m2 + .5), pluck = eio(seg(L, pl - .3, pl)), toMouth = eio(seg(L, pl + .05, cr)), take = eio(seg(L, mt - .3, mt)), put = eio(seg(L, mt, mo)), lamp = 1 - eo(seg(L, lo, lo + .15));
  const ww = 260, wh = 196, wx = 250, wy = 590;
  deskHalf(t, { lamp: .45 * lamp, pinned: L > rp ? 0 : 2, green: true, glowK: 1.2, pencil: L < pl - .05, pile: 0,
    boy: { expr: L < w2 + .4 ? { ...FX.sad, lid: .1 } : L < rp - .2 ? 'tempted' : L < rp + .5 ? { ...FX.resolve, m: 'grit', lid: .1 } : L < pl - .3 ? 'sad' : L < cr + .3 ? 'fear' : { ...FX.sad, lid: .35, bags: true },
      look: L < rp - 1 ? [-.8, -.2] : L < rp + .5 ? [0, .3] : L < pl ? [-.6, -.1] : [-.3, .3], turn: L < rp - 1 ? -.25 : 0,
      armL: up > 0 && L < m2 ? [lerp(430, 380 - rip * 60, up), lerp(680, 560, up)] : undefined, armR: up > 0 && L < m2 ? [lerp(530, 580 + rip * 60, up), lerp(680, 560, up)] : undefined, glowOn: [GREEN, .42], glowSide: -1 },
    before: f => { D_ = devBehind(t, { x: 210, y: 900, h: 600, expr: L < w2 + .2 ? devEx('charm', L, []) : L < rp ? devEx('sweet', L, [w2 + 1.4]) : L < m2 + .6 ? { ...DX.happy, m: 'open', h: .6 } : L < mt - .3 ? devEx('grin', L, []) : devEx('charm', L, [mo + .4]),
        look: L < rp ? [.6, -.2] : [.8, .3], lean: .18, tilt: .08,
        bendR: L > pl - .5 && L < cr + .1 ? 3.2 : -.4, armR: L > pl - .5 && L < cr + .1 ? [lerp(lerp(450, f.head[0] + f.hr * .7, pluck), 300, toMouth), lerp(lerp(500, f.head[1] - f.hr * .5, pluck), 400, toMouth)] : L > m2 - .5 && L < m2 + .5 ? [lerp(560, 330, eat), lerp(520, 420, eat)] : L > mt - .5 && L < mo + .2 ? [lerp(lerp(380, wx + 40, take), 260, put), lerp(lerp(520, wy, take), 520, put)] : [400, 660],
        armL: [170, 640], cap: true, medal: L >= mo, heat: .9 + (L > m2 && L < m2 + .6 ? 1 : 0) + (L > cr && L < cr + .5 ? 1 : 0) }); },
    after: f => {
      windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.medal(x0, y0, w, h, L, t), { glow: 1.2 });
      if (L > w2 - .3 && L < w2 + .2) { const k = seg(L, w2 - .3, w2 + .2); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); }
      // the sketchbook: lifted, torn in two, eaten
      if (up > 0 && L < m2 + .2) { const bx = 480, by = lerp(DESK_Y, 662, up); bookD(bx, by, 150, { tear: rip, col: BOOK, label: 1 }); }
      else if (L < rp - 1) bookD(480, DESK_Y, 150, { col: BOOK, label: 1 });
      if (L >= m2 + .2 && L < m2 + .9) { const k = seg(L, m2 + .2, m2 + .9); for (let i = 0; i < 8; i++) { const a = rnd(i * 3.1) * TAU; disc(D_.head[0] + Math.cos(a) * (60 + k * 90), D_.head[1] + D_.hr * .4 + Math.sin(a) * (40 + k * 50), 8 * (1 - k), rgba(PAPER, 1 - k)); } }
      // the pencil plucked from behind his ear and crunched
      if (L > pl - .05 && L < cr) { const px = lerp(f.head[0] + f.hr * .78, D_.head[0], toMouth), py = lerp(f.head[1] - f.hr * .5, D_.head[1] + D_.hr * .4, toMouth); pencilD(px, py, f.hr * 1.5, lerp(.4, 1.4, toMouth)); }
      if (L >= cr && L < cr + .5) { const k = seg(L, cr, cr + .5); for (let i = 0; i < 7; i++) { const a = rnd(i * 5.1) * TAU; rectf(D_.head[0] + Math.cos(a) * (50 + k * 100), D_.head[1] + D_.hr * .4 + Math.sin(a) * (40 + k * 60), 10 * (1 - k), 6 * (1 - k), rgba(i % 2 ? PENCIL : [228, 196, 150], 1 - k)); } }
      // the medal taken out of the window
      if (L > mt - .05 && L < mo) medalD(lerp(wx + 40, D_.sx, put), lerp(wy, D_.shY + D_.h * .2, put), lerp(14, D_.h * .05, put));
      if (L > lo - .1 && L < lo + .2) { const k = seg(L, lo - .1, lo + .2); disc(M(120), DESK_Y - 200, 26 * (1 - k), rgba([255, 240, 200], 1 - k)); }
    } });
}
// ---- ROUND 2: the right half (he draws, rubs it out, draws; the letter on the board; a glance at the leak) ----
function round2R(L, t, c, o = {}) {
  const rb = c('rub'), d2 = c('draw2'), pn = c('pin'), gl = c('glance'), bk = c('back');
  const pin = eio(seg(L, pn - .5, pn)), glance = L > gl && L < bk, drawing = L < pn - .6 || L > bk;
  const wob = drawing ? Math.sin(t * 16) * 22 : 0, rub = L > rb && L < d2 ? Math.sin(t * 30) * 28 : 0;
  deskHalf(t, { lamp: 1, pinned: o.pinned ?? 9, q: .75, letter: L > pn, green: false, pile: o.pile ?? 60,
    boy: { expr: glance ? { ...FX.tempted, lid: .2 } : L > bk ? { ...FX.resolve, lid: .25 } : { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: glance ? [-.4, .8] : L > pn - .6 && L < pn + .2 ? [-.6, -.8] : [.1, .9],
      armR: L > pn - .6 && L < pn + .3 ? [lerp(560, 640, pin), lerp(660, 300, pin)] : [500 + wob + rub, 668], armL: [430, 676], glowOn: [LAMP, .2], glowSide: 1 },
    before: f => { if (L > pn - .6 && L < pn) { const k = pin; at(lerp(560, 640, k), lerp(640, 300, k), 1, 0, () => pageD(0, 0, 90, .08, { kind: 'scrawl', col: [244, 244, 236] })); } },
    after: f => { deskPage(480); if (!(L > pn - .6 && L < pn + .3)) pencilD(500 + wob + rub, 660, 70, rub ? -2.4 : -.6);
      windowDown(M(250), .8 + .2 * Math.sin(t * 2)); if (rub) for (let i = 0; i < 4; i++) disc(500 + rub + rnd(i + Math.floor(t * 12)) * 40 - 20, DESK_Y - 14 - rnd(i * 2) * 10, 3, rgba([236, 130, 140], .8)); } });
}
shot('medal', 'work', null, (L, u, t, c) => { const Dw = CUE.card - CUE.work;
  SPLIT(side => side > 0 ? round2L(L, t, c) : round2R(L * Dw / (CUE.work - CUE.medal), t, n => CUE[n] - CUE.work), { focus: 'L', dim: .55 });
  counterL(L >= c('rip') ? 'PAGES: 0' : 'PAGES: 29');
  if (L < c('rip') + .4) red('and he’s only fourteen.', 470, 960, 70, L, c('fourteen'), 1.0);
});
shot('work', 'card', null, (L, u, t, c) => { const Dm = CUE.work - CUE.medal;
  SPLIT(side => side > 0 ? round2L(L * Dm / (CUE.card - CUE.work), t, n => CUE[n] - CUE.medal) : round2R(L, t, c), { focus: 'R', dim: .55 });
  counterR('PAGES: ' + Math.round(lerp(29, 120, u)));
});
// ---- 36.5-49 THE COST: Max's card under the door; Max's first show: the right one cheers, the left one walks out ----
// a door at the outer side of a half (left-half coordinates: x0..x1 the door, the floor at y), the card sliding in under it
function doorHalf(t, k, L) { stageD(860, { pool: [M(420), 640, 520, GREEN, .05] });
  const x0 = 60, x1 = 330; outlined(() => { ctx.beginPath(); ctx.rect(Math.min(M(x0), M(x1)), 160, Math.abs(M(x1) - M(x0)), 690); }, rgba([96, 70, 58]), 5); rectf(Math.min(M(x0), M(x1)), 850, Math.abs(M(x1) - M(x0)), 10, rgba([255, 214, 160], .35));
  disc(M(x1 - 40), 520, 12, rgba(GOLD)); additive(() => glow(LAMP, M(195), 856, 160, .3));
  const cx = lerp(150, 560, eo(k)); at(M(cx), 846, 1, SIDE * -.04 * (1 - k), () => { ctx.save(); ctx.scale(1, .32); inviteD(0, 0, 300, 0, false); ctx.restore(); }); }
shot('card', 'showR', null, (L, u, t, c) => {
  const ci = c('cardIn'), part2 = L >= ci + .75, k = seg(L, ci - .1, ci + .5);
  if (!part2) { rectf(0, 0, W, H, rgba([26, 20, 18])); for (let i = 0; i < 7; i++) stroke([[0, 120 + i * 150], [W, 120 + i * 150 + 6]], 4, rgba([40, 30, 26]));
    rectf(0, 0, W, 70, rgba([10, 8, 8])); additive(() => glow(LAMP, 960, 70, 700, .35)); rectf(0, 66, W, 6, rgba([255, 214, 160], .5));
    const cy = lerp(-120, 520, eo(k)); at(960 + Math.sin(k * 3) * 20 * (1 - k), cy, 1, .06 * (1 - k) - .04, () => inviteD(0, 0, 760, 0, true)); return; }
  const P = L - (ci + .75), gR = c('grinR') - ci - .75, rR = c('runR') - ci - .75, dR = c('devRead') - ci - .75, run = eio(seg(P, rR, rR + .9));
  SPLIT(side => { const left = side > 0;
    if (left) deskHalf(t, { lamp: 0, pinned: 0, green: true, glowK: .7, pencil: false,
        boy: { expr: P < .4 ? 'calm' : samEx('sad', P, [1.4]), look: [.2, .6], armL: [430, 600], armR: [530, 600], glowOn: [GREEN, .3], glowSide: -1 },
        before: f => { const d = devBehind(t, { x: lerp(260, 330, eo(seg(P, dR - .4, dR))), y: 900, h: 600, expr: P > dR ? devEx('charm', P, [dR + .9]) : devEx('sly', P, []), look: [.8, .8], lean: .25, tilt: .15, cap: true, medal: true, armL: [200, 640], armR: [380, 560] }); },
        after: f => { inviteD(480, 650, 220, -.06); windowDown(M(250), .7); } });
    else deskHalf(t, { lamp: 1, pinned: 12, q: .8, letter: true, pile: 120,
        boy: (() => { const bx = lerp(480, 120, run), up = eo(seg(P, rR - .1, rR + .3)), sw = Math.sin(P * 16) * 60 * (run > 0 && run < 1 ? 1 : 0); return { x: bx, y: lerp(880, 800, up), expr: P > gR ? 'laugh' : 'smile', look: P > gR ? [-.5, -.2] : [.1, .7], armL: P < rR ? [430, 600] : [bx - 60 + sw, 640], armR: P < rR ? [530, 600] : [bx + 60 - sw, 640], tilt: P > gR ? Math.sin(P * 12) * .05 : 0, lean: -.15 * run }; })(),
        after: f => { if (P < rR) inviteD(480, 650, 220, .06); else if (P < rR + .9) inviteD(f.armEndL[0], f.armEndL[1] - 30, 140, .3); windowDown(M(250), .7); } }); }, { focus: P > rR - .2 ? 'R' : null, dim: .4 });
  counterL('PAGES: 0'); counterR('PAGES: 120');
});
// the gallery and its little crowd (full frame); n people, Max in it at mx
function showD(t, L, o) { stageD(900, { pool: [o.mx ?? 1100, 520, 820, [255, 230, 190], .2] }); galleryD(o.x0 ?? 420, o.x1 ?? 1820, t, { n: o.n ?? 5, y: 290, s: 160 });
  for (let i = 0; i < (o.crowd ?? 5); i++) { const x = (o.cx0 ?? 700) + i * (o.cdx ?? 230); if (Math.abs(x - (o.mx ?? 1100)) < 120) continue; figure({ kind: 'sam', x, y: 900, h: 360 + rnd(i * 2.3) * 40, expr: rnd(i) > .5 ? 'smile' : 'laugh', look: [((o.mx ?? 1100) - x) / 600, -.2], dim: .45, seed: 40 + i, t, armR: i === 2 && o.clap ? [x + 30, 640 + Math.abs(Math.sin(t * 9)) * 30] : undefined, armL: i === 2 && o.clap ? [x - 30, 640 + Math.abs(Math.sin(t * 9 + 1)) * 30] : undefined }); } }
shot('showR', 'showL', null, (L, u, t, c) => {
  const ch = c('cheer'), hg = c('hugR'), hug = eio(seg(L, hg - .2, hg + .3));
  SPLIT(side => { if (side > 0) { deskHalf(t, { lamp: 0, pinned: 0, green: true, glowK: .6, pencil: false, boy: { expr: 'sad', look: [.2, .7], armL: [430, 600], armR: [530, 600], glowOn: [GREEN, .26], glowSide: -1 },
      before: f => devBehind(t, { x: 300, y: 900, h: 600, expr: devEx('charm', L, []), look: [.8, .6], lean: .2, tilt: .1, cap: true, medal: true, armL: [200, 640], armR: [380, 600] }), after: f => inviteD(480, 650, 220, -.06) }); return; }
    // the right half: the gallery, Max, the right boy at the front
    stageD(900, { pool: [M(480), 520, 560, [255, 230, 190], .22] }); galleryD(M(820), M(140), t, { n: 3, y: 260, s: 140 });
    for (let i = 0; i < 3; i++) fig({ kind: 'sam', x: 120 + i * 110, y: 900, h: 320, expr: 'laugh', look: [.4, -.2], dim: .5, seed: 50 + i, t });
    const mx = lerp(620, 540, hug), bx = lerp(330, 430, hug), cheer = L > ch && L < hg - .2;
    const m = fig({ kind: 'sam', x: mx, y: 900, h: 400, expr: 'laugh', look: [-.6, -.1], armL: hug > .2 ? [bx + 40, 620] : [mx - 60, 650], armR: hug > .2 ? [bx + 10, 640] : undefined, stretch: true, t, seed: 5 }); capOn(m, -SIDE);
    const b = fig({ kind: 'sam', x: bx, y: 900, h: 400, expr: 'laugh', look: [.7, -.2], armL: cheer ? [bx - 70, 500 - Math.abs(Math.sin(t * 9)) * 40] : hug > .2 ? [bx + 120, 640] : undefined, armR: cheer ? [bx + 60, 480 - Math.abs(Math.sin(t * 9 + 1)) * 40] : hug > .2 ? [bx + 150, 620] : undefined, tilt: cheer ? Math.sin(t * 9) * .05 : 0, stretch: true, t }); earPencil(b, SIDE);
  }, { focus: 'R', dim: .5 });
  counterL('PAGES: 0'); counterR('PAGES: 120');
});
shot('showL', 'worst', null, (L, u, t, c) => {
  const se = c('see'), wv = c('wave'), fr = c('friends'), ta = c('turnAway'), ou = c('out'), fa = c('fall');
  const wave = L > wv && L < fa ? 1 : 0, turn = eio(seg(L, ta, ta + .35)), walk = eio(seg(L, ou, ou + 1.4)), lean = eo(seg(L, fr - .5, fr));
  camD(push(u, .05), 960, 560, () => {
    showD(t, L, { mx: 1240, crowd: 6, cx0: 760, cdx: 200, clap: true });
    // the doorway he leaves by
    outlined(() => { ctx.beginPath(); ctx.rect(30, 300, 190, 600); }, rgba([24, 22, 26]), 5); additive(() => glow([150, 170, 220], 125, 600, 160, .12));
    const m = figure({ kind: 'sam', x: 1240, y: 900, h: 420, expr: L < se ? 'laugh' : L < fa ? (wave ? 'laugh' : 'smile') : { ...FX.sad, lid: .1 }, look: L < se ? [.3, -.2] : [-.95, -.05], turn: L > se ? -.25 : 0,
      armL: wave ? [1150, 470 + Math.sin(t * 14) * 30] : undefined, stretch: true, t, seed: 5 }); capOn(m, -1);
    const bx = lerp(lerp(400, 400, turn), 120, walk);
    const d = devBehind(t, { x: lerp(300, 260, walk) + lean * 60, y: 920, h: 600, expr: L > fr - .3 && L < ta ? devEx('sweet', L, []) : L > ta ? devEx('grin', L, []) : devEx('charm', L, [se + .4]), look: [.9, .1], lean: .15 + lean * .2, tilt: .1 + lean * .1,
      armR: L > fr - .4 && L < ta + .2 ? [lerp(560, 900, lean), lerp(600, 520, lean)] : [460, 640], armL: [200, 660], cap: true, medal: true, heat: .8 });
    const b = figure({ kind: 'sam', x: bx, y: 900 - Math.abs(Math.sin(walk * 9)) * 8 * (walk > 0 && walk < 1 ? 1 : 0), h: 400, expr: L < se ? { ...FX.sad, lid: .2 } : L < fr ? 'tempted' : L < ta ? { ...FX.sad, lid: .1 } : { ...FX.sad, lid: .4 }, look: L < ta ? [.95, -.05] : [-.9, .2], turn: turn > .5 ? -.4 : .25,
      stride: walk > 0 && walk < 1 ? Math.sin(walk * 18) * .8 : 0, t });
  });
  if (L < ta + .5) red('look at all his new friends.', 960, 1000, 72, L, fr, 1.0);
});
// ---- 49-71 THE WORST and THE TURN: the window is the whole wall; his own monster on the prize; the two of him look at each other ----
// the wall-size window behind his desk (left-half coordinates), what it shows: his own best day. fold 0..1: it falls forward onto the desk
const WALL = { x: 470, y: 330, w: 840, h: 470 };
function wallWin(L, t, o = {}) { const fold = o.fold || 0, sway = o.sway || 0;
  if (fold <= 0) { at(M(WALL.x), WALL.y, 1, sway, () => windowD(0, 0, WALL.w, WALL.h, 1, (x0, y0, w, h) => SHOW.him(x0, y0, w, h, L, t), { glow: 1.6 })); return; }
  // falling forward: the bottom edge stays on the desk, the top comes down toward us (it gets shorter, then flat)
  const h = WALL.h * Math.cos(fold * Math.PI / 2) * (1 - fold * .1), bottom = DESK_Y + 10 - (1 - fold) * 140, w = WALL.w * (1 + .12 * fold);
  if (fold < 1) windowD(M(WALL.x), bottom - Math.max(h, 8) / 2, w, Math.max(h, 8), 1, (x0, y0, ww, hh) => SHOW.him(x0, y0, ww, hh, L, t), { back: fold > .5, glow: 1.6 * (1 - fold) });
}
// the torn pages and balls on his floor (left half)
function litterD(n = 9) { for (let i = 0; i < n; i++) { const x = 60 + rnd(i * 4.3) * 860, y = 905 + rnd(i * 2.1) * 30; if (i % 3) ballD(M(x), y, 18 + rnd(i) * 10, i); else at(M(x), y, 1, (rnd(i * 7) - .5) * 1.4, () => pageD(0, 0, 60, 0, { kind: 'monster', q: .5 })); } }
// the right one at his desk late at night: 300 pages, rubbing out a page, the leak beside him. o: noPencil, look, expr, hold (his pile in his arms)
function rightDesk(t, L, o = {}) { const rub = o.rub ? Math.sin(t * 30) * 26 : 0;
  return deskHalf(t, { lamp: 1, pinned: 12, q: .85, letter: true, pile: o.hold ? 0 : 300, pencil: !o.noPencil,
    boy: { expr: o.expr || { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: o.look || [.1, .9], armL: o.hold ? [400, 600] : [430, 676], armR: o.hold ? [560, 600] : [500 + rub, 668], glowOn: [LAMP, .2], glowSide: 1, ...(o.boy || {}) },
    after: f => { if (o.hold) { const k = pileD(480, 660, 140, 300); } else { deskPage(480); if (!o.noPencil && !o.pencilGone) pencilD(500 + rub, 660, 70, rub ? -2.4 : -.6); } windowDown(M(250), .8 + .2 * Math.sin(t * 2)); } }); }
shot('worst', 'cover', null, (L, u, t, c) => {
  const cl = c('claws'), ww = c('winWall'), am = c('amazing2'), slide = eio(seg(L, 0, .8)), grab = eo(seg(L, cl - .3, cl + .2));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: true }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .22] }); litterD();
    wallWin(L + 20, t);
    const H0 = { x: 520, y: 880 - 470 + 94 }, d = devBehind(t, { x: 330, y: 940, h: 640, expr: L < am ? devEx('grin', L, [1.0]) : { ...DX.grin, h: .8 }, look: [.7, .3], lean: .1, tilt: .1, cap: true, medal: true, heat: 1.2,
      armR: [lerp(420, H0.x + 70, grab), lerp(600, H0.y + 10, grab)], armL: [lerp(240, H0.x - 80, grab), lerp(640, H0.y + 20, grab)], bendR: -.5, bendL: .4 });
    const f = figure({ kind: 'sam', x: 520, y: 880, h: 470, noLegs: true, expr: L < am + .3 ? 'tempted' : { ...FX.sad, lid: .25, bags: true }, look: [-.4, -.95], tilt: -.12 * grab, headDy: -.05, glowOn: [GREEN, .5], glowSide: -1, armL: [440, 680], armR: [600, 684], t });
    if (grab > .5) for (const sd of [-1, 1]) { const cx = f.head[0] + sd * f.hr * .98, cy = f.head[1] + f.hr * .15; devArm([[cx + sd * 30, cy - 20], [cx + sd * 6, cy + 4], [cx - sd * 14, cy + 22]], [30, 26, 20], 16); }
    deskD(80, 880, DESK_Y);
  }, { lineX: lerp(960, 1500, slide), focus: 'L', dim: .55 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  slam('LOOK. ISN’T HE AMAZING?', 760, 1038, 76, L, am);
});
// close on what the window shows: the young man everyone loves holds up a printed comic; the cover is his monster
shot('cover', 'wide', null, (L, u, t, c) => {
  const k = eio(seg(L, c('coverIn') - .1, c('coverIn') + 1.1));
  camD(lerp(1.0, 2.0, k), 960, lerp(540, 640, k), () => { rectf(-400, -400, W + 800, H + 800, rgba(D.stage)); windowD(960, 560, 1700, 950, 1, (x0, y0, w, h) => SHOW.him(x0, y0, w, h, L + 24, t), { glow: 1 }); });
});
// close on his face: he sees it is his monster; the claws on his cheeks
shot('wide', 'wrench', null, (L, u, t, c) => {
  const ew = c('eyesWide');
  camD(push(u, .05), 960, 540, () => {
    stageD(0, { pool: [700, 300, 900, GREEN, .25] });
    const f = figure({ kind: 'sam', x: 980, y: 2080, h: 1900, noLegs: true, noArms: true, expr: L < ew ? { ...FX.tempted, lid: .3 } : { ...FX.horror, bags: true }, look: [-.6, -.7], tilt: -.08, glowOn: [GREEN, .55], glowSide: -1, t });
    for (const sd of [-1, 1]) devArm([[sd < 0 ? -100 : 2020, sd < 0 ? 700 : 300], [f.head[0] + sd * f.hr * 1.5, f.head[1] - f.hr * .2], [f.head[0] + sd * f.hr * .92, f.head[1] + f.hr * .3]], [150, 120, 90], 40);
  });
});
// he wrenches free: the claws slip, the window sways, he falls back off his chair
shot('wrench', 'eyes', null, (L, u, t, c) => {
  const p1 = c('pull1'), p2 = c('pull2'), sl = c('slip'), fb = c('fallBack'), th = c('thud');
  const jerk = (L > p1 ? Math.sin((L - p1) * 30) * (1 - seg(L, p1, p1 + .4)) : 0) + (L > p2 ? -Math.sin((L - p2) * 30) * (1 - seg(L, p2, p2 + .4)) : 0), free = eo(seg(L, sl - .1, sl + .3)), fall = eio(seg(L, fb - .15, th));
  const shake = L > th ? Math.sin((L - th) * 50) * 14 * (1 - seg(L, th, th + .4)) : 0;
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: true }); return; }
    ctx.save(); ctx.translate(shake, 0); (() => {
      stageD(900, { pool: [480, 420, 700, GREEN, .2] }); litterD();
      wallWin(L + 24, t, { sway: Math.sin(L * 9) * .03 * free * (1 - seg(L, sl, sl + 1.5)) });
      const hx = 520 + jerk * 40, bx = hx + fall * 60, by = 880 + fall * 260;
      const d = devBehind(t, { x: 330, y: 940, h: 640, expr: L < sl ? { ...DX.rage, m: 'grin' } : devEx('rage', L, []), look: [.8, .3], lean: .2 - .1 * free, tilt: .1, cap: true, medal: true, heat: 1.4,
        armR: [lerp(hx + 70, 420, free), lerp(514, 300, free)], armL: [lerp(hx - 80, 260, free), lerp(524, 360, free)], bendR: -.5, bendL: .4 });
      const f = figure({ kind: 'sam', x: bx, y: by, h: 470, noLegs: true, expr: L < sl ? { ...FX.resolve, lid: .15 } : L < th ? 'fear' : { ...FX.horror }, look: L < sl ? [jerk, -.5] : [.3, -.3], tilt: jerk * .25 + fall * .5, lean: fall * .5, glowOn: [GREEN, .45], glowSide: -1,
        armL: L < sl ? [bx - 120, by - 400] : [bx - 150, by - 430], armR: L < sl ? [bx + 110, by - 410] : [bx + 150, by - 440], t });
      // the chair tipping back
      if (L > fb - .2) { const k = fall; at(hx + 150, 900, 1, k * .9, () => chairD(0, 0, 260, -1)); }
      deskD(80, 880, DESK_Y);
      if (L > th && L < th + .4) { const k = seg(L, th, th + .4); for (let i = 0; i < 7; i++) stroke([[hx + 100 + (i - 3) * 50, 900 - k * 30], [hx + 100 + (i - 3) * 70, 880 - k * 70]], 5, rgba(D.white, 1 - k)); }
    })(); ctx.restore();
  }, { lineX: 1500, focus: 'L', dim: .55 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
});
// on the floor he turns his head to the tear, and for the first time the two of him look at each other
shot('eyes', 'hand', null, (L, u, t, c) => {
  const th = c('turnHead'), lu = c('lookUp'), me = c('meet'), turn = eio(seg(L, th, th + .45)), up = eio(seg(L, lu, lu + .35)), back = eio(seg(L, me, me + .9));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { rub: L < lu, look: up > .5 ? [.85, .55] : [.1, .9], expr: up > .5 ? { ...FX.sad, lid: .05, bags: false } : undefined }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .16] }); litterD(7);
    wallWin(L + 28, t);
    devBehind(t, { x: 230, y: 940, h: 640, expr: devEx('sly', L, [1.4]), look: [.9, .5], lean: .1, cap: true, medal: true, heat: .9, armL: [180, 660], armR: [330, 640] });
    deskD(80, 880, DESK_Y);
    at(420, 900, 1, 1.3, () => chairD(0, 0, 240, -1));
    const f = figure({ kind: 'sam', x: 770, y: 905, h: 440, kneel: 1, expr: turn < .5 ? { ...FX.fear, small: false } : L > me ? { ...FX.sad, lid: .05, bi: -.25 } : 'fear', look: [lerp(-.6, .95, turn), lerp(-.5, -.25, turn)], turn: lerp(-.2, .4, turn), tilt: .05, armL: [700, 880], armR: [850, 880], t });
  }, { lineX: lerp(1500, 960, back), focus: L > me ? null : 'L', dim: .45 });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  say('it never showed the 300 pages.', 960, 1035, 66, L, c('never'), .8);
});
// his hand across the tear; the right one puts the yellow pencil in it (an insert: the two arms over the tear)
shot('hand', 'slam', null, (L, u, t, c) => {
  const rc = c('reach'), gv = c('give'), tk = c('take'), reach = eo(seg(L, rc - .1, rc + .8)), give = eio(seg(L, gv - .5, gv)), take = eio(seg(L, tk, tk + .5));
  camD(push(u, .04), 960, 560, () => {
    SPLIT(side => { if (side > 0) { stageD(0, { pool: [300, 300, 900, GREEN, .22] }); litterD(5); } else { stageD(0, { pool: [M(300), 300, 900, LAMP, .22] }); for (let i = 0; i < 6; i++) at(M(120 + i * 70), 980 - i * 4, 1, (rnd(i) - .5) * .3, () => pageD(0, 0, 150, 0, { kind: ['monster', 'hero', 'two'][i % 3], q: .9 })); } }, {});
    const lt = [lerp(560, 1000, reach) - take * 30, lerp(900, 600, reach) + take * 10], rt = [lerp(1420, 1080, give), lerp(360, 560, give)];
    const arm = (a, m, b, w) => { taper([a, m, b], w.map(v => v + 14), rgba(D.line)); taper([a, m, b], w, lg(0, b[1] - 80, 0, b[1] + 160, [[0, D.cream], [1, D.creamS]])); };
    arm([-80, 1200], [lerp(300, 560, reach), lerp(1000, 760, reach)], lt, [150, 140, 128]);
    arm([2040, 200], [lerp(1700, 1300, give), lerp(260, 440, give)], rt, [150, 140, 128]);
    additive(() => glow(GREEN, lt[0], lt[1], 160, .2));
    const pt = L < tk ? rt : lt; pencilD(pt[0] + (L < tk ? -70 : 70), pt[1] - 10, 300, L < tk ? 3.0 : .1 - take * .15);
    if (L > tk && L < tk + .3) { const k = seg(L, tk, tk + .3); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(LAMP, 1 - k); ctx.beginPath(); ctx.arc(lt[0], lt[1], 80 + k * 160, 0, TAU); ctx.stroke(); }
  });
});
// he gets up and slams the window face down: the green dies, the devil shrieks, the medal falls off it
shot('slam', 'page1', null, (L, u, t, c) => {
  const ri = c('rise'), sd = c('slamDown'), sh = c('shriek'), mf = c('medalFall'), mc = c('medalClink');
  const rise = eio(seg(L, ri, ri + .5)), fold = clamp(Math.pow(seg(L, sd - .35, sd), 2)), dead = L > sd, fall = seg(L, mf, mc), shake = dead ? Math.sin((L - sd) * 50) * 22 * (1 - seg(L, sd, sd + .5)) : 0;
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .3], expr: { ...FX.smile, lid: .1 } }); return; }
    ctx.save(); ctx.translate(shake, shake * .4); (() => {
      stageD(900, { pool: [480, 420, 700, GREEN, dead ? .03 : .2] }); litterD(7);
      wallWin(L + 34, t, { fold });
      const d = devBehind(t, { x: 230, y: 940, h: 640, expr: L < sh ? devEx('charm', L, []) : { ...DX.rage, h: .9 }, look: [.8, .2], lean: L > sh ? -.15 : .1, tilt: L > sh ? -.15 : .05, cap: true, medal: L < mf, heat: L > sh ? 1.6 : .9,
        armL: L > sh ? [120, 300] : [180, 660], armR: L > sh ? [380, 280] : [330, 640] });
      if (L >= mf) { const mx = lerp(d.sx + 6, 300, fall), my = lerp(d.shY + d.h * .2, 895, fall * fall); medalD(mx, my, d.h * .05, [mx, my - d.h * .1]); if (L > mc) for (let i = 0; i < 3; i++) stroke([[300 + (i - 1) * 30, 870], [300 + (i - 1) * 50, 840]], 4, rgba(GOLD, 1 - seg(L, mc, mc + .3))); }
      // his arms bring the window down
      const f = figure({ kind: 'sam', x: lerp(770, 560, rise), y: lerp(905, 880, rise), h: lerp(440, 470, rise), kneel: rise < .5 ? 1 : 0, noLegs: rise > .5, expr: L < sd ? { ...FX.resolve, lid: .1, bi: .3 } : 'resolve', look: [-.3, -.5], tilt: -.05,
        armL: L < sd + .1 ? [lerp(330, 380, fold), lerp(260, 640, fold)] : [440, 670], armR: L < sd + .1 ? [lerp(790, 740, fold), lerp(250, 640, fold)] : [600, 670], stretch: true, t });
      earPencil(f, 1);
      deskD(80, 880, DESK_Y);
      if (dead) { windowDown(480, .25); for (let i = 0; i < 10; i++) { const k = seg(L, sd, sd + .5), a = rnd(i * 3.3) * Math.PI; disc(480 + Math.cos(a) * (200 + k * 300), DESK_Y - Math.sin(a) * (20 + k * 120), 6 * (1 - k), rgba(GREEN_L, 1 - k)); } }
    })(); ctx.restore(); }, { focus: null });
  counterL('PAGES: 0'); counterR('PAGES: 300');
  if (L >= sd && L < sd + .1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba(D.white, .5 * (1 - seg(L, sd, sd + .1)))); ctx.restore(); }
});
// ---- 71-96 ONE PAGE A DAY: the left one climbs (1, 40, 120, 300); the slip at 40; Max's door; the tear stitches shut ----
// his board as it fills again: page 1 (wobbly, top left) and the ones after it, better each time (n pinned)
function boardAgain(n, o = {}) { const x = 260, y = 140, w = 440, h = 280; outlined(() => { ctx.beginPath(); ctx.rect(M(x) - (SIDE < 0 ? w : 0), y, w, h); }, rgba([120, 92, 66]), 5);
  const cols = 4, rows = 3, cw = w / cols, chh = h / rows;
  for (let i = 0; i < Math.min(n, 12); i++) { const cx = M(x + cw * (i % cols + .5) + (rnd(i * 2.1) - .5) * cw * .2), cy = y + chh * (Math.floor(i / cols) + .5) + (rnd(i * 3.3) - .5) * chh * .15;
    at(cx, cy, chh * .62, (rnd(i * 5.7) - .5) * .25, () => { outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.66, 1, 1.32); }, rgba(PAPER), .015); monsterD(0, .02, .6 + .2 * (i / 11), { rot: i === 0 ? .25 : 0, col: i === 0 ? [90, 90, 100] : [40, 40, 48] }); if (i === 0) for (let k = 0; k < 3; k++) curve([[-.3 + k * .05, -.4], [.2, -.1 + k * .1], [-.2, .3]], .02, rgba([60, 60, 70], .6)); });
    disc(cx, cy - chh * .38, 5, rgba([220, 60, 50])); } }
// the left desk after the turn: his lamp back on, his pencil, the devil (its cap still on) beside him with a small window
function leftAgain(t, L, o = {}) { const wob = o.drawing ? Math.sin(t * 16) * 22 : 0;
  return deskHalf(t, { lamp: o.lamp ?? 1, pinned: 0, green: false, glowK: 0, pencil: !o.drawing,
    back: () => boardAgain(o.n ?? 1),
    boy: { expr: o.expr || { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' }, look: o.look || [.1, .9], armL: o.armL || [430, 676], armR: o.armR || [500 + wob, 668], glowOn: o.green ? [GREEN, o.green] : [LAMP, .2], glowSide: o.green ? -1 : 1, ...(o.boy || {}) },
    before: f => { if (o.dev) o.dev(f); },
    after: f => { deskPage(480); if (o.drawing) pencilD(500 + wob, 660, 70, -.6); if (o.after) o.after(f); } }); }
shot('page1', 'page40', null, (L, u, t, c) => {
  const w3 = c('win3'), dn = c('down2'), lampOn = eo(seg(L, 0, .3)), open = eo(seg(L, w3 - .2, w3 + .3)), down = eio(seg(L, dn - .2, dn + .1));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 1, lamp: lampOn, drawing: L < w3 - .3 || L > dn + .3, look: L > w3 && L < dn ? [-.7, -.2] : [.1, .9], expr: L > w3 && L < dn ? { ...FX.sad, lid: .05 } : L > dn ? { ...FX.resolve, lid: .2 } : undefined, green: L > w3 && L < dn + .1 ? .3 : 0,
      armR: L > dn - .5 && L < dn + .3 ? [lerp(500, 400, eio(seg(L, dn - .5, dn - .2))), lerp(668, 540 + 120 * down, eio(seg(L, dn - .5, dn - .2)))] : undefined,
      dev: f => devBehind(t, { x: 150, y: 920, h: 600, expr: L < w3 ? devEx('sly', L, [.6]) : L < dn ? devEx('sweet', L, [w3 + 1.2]) : { ...DX.sulk }, look: [.8, .3], lean: .12, cap: true, armR: [lerp(260, 300, open), lerp(640, 520, open)], armL: [110, 650] }),
      after: f => { if (L > w3 - .25 && L < dn + .1) windowD(345, lerp(600, 500, open) + down * 170, 150 * (1 - down * .2), 112 * (1 - down * .95), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t)); else if (L >= dn + .1) windowDown(330, .7); } });
  }, { focus: 'L', dim: .5 });
  counterL('PAGES: 1'); counterR('PAGES: 300');
  if (L < c('win3')) say('one page a day.', 480, 990, 66, L, c('onePage'), .6);
  red('they’re years ahead.', 480, 880, 64, L, c('years'), .9);
});
// PAGE 40, the slip: the window jumps back to a poster, its arms go round him, his counter sticks at 40
shot('page40', 'board40', null, (L, u, t, c) => {
  const ol = c('oneLook'), lk = c('looks'), jp = c('jump'), ar = c('arms'), look = eio(seg(L, lk - .2, lk + .2)), jump = eback(seg(L, jp, jp + .35)), arms = eio(seg(L, ar - .2, ar + .4)), stuck = L > c('stuck');
  const ww = lerp(160, 330, jump), wh = ww * .75, wx = lerp(300, 220, jump), wy = lerp(470, 480, jump);
  function open40(L) { return eio(seg(L, ol - .6, ol)) * (1 - jump); }
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: L > jp ? { ...FX.sad, lid: .1 } : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 6, lamp: lerp(1, .35, jump), drawing: L < lk - .3, look: L > lk - .3 ? [-.8, -.2] : [.1, .9], expr: L < lk ? undefined : stuck ? { ...FX.tempted, lid: .5, bags: true } : 'tempted', green: L > ol ? .3 + .2 * jump : 0,
      dev: f => devBehind(t, { x: lerp(800, 740, arms), y: 920, h: 600, expr: L < jp ? devEx('sweet', L, [ol + 1.2]) : devEx('grin', L, [ar + 1.0]), look: [-.8, .3], lean: -.06 - .06 * arms, tilt: -.06 * arms, cap: true, capBrim: -1,
        armL: arms > 0 ? [lerp(640, f.shL[0] - 10, arms), lerp(560, f.shL[1] + 40, arms)] : [lerp(640, 330, open40(L)), lerp(560, 480, open40(L))], armR: arms > 0 ? [lerp(860, f.shR[0] + 10, arms), lerp(650, f.shY + 60, arms)] : [860, 650], heat: .8 + .6 * jump }),
      after: f => { windowD(wx, wy, ww, wh, 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t), { glow: 1 + jump }); if (L > jp && L < jp + .4) { const k = seg(L, jp, jp + .4); ctx.lineWidth = 8 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.roundRect(wx - ww / 2 - k * 60, wy - wh / 2 - k * 50, ww + k * 120, wh + k * 100, 20); ctx.stroke(); } } });
  }, { focus: 'L', dim: .5 });
  counterL('PAGES: 40'); counterR('PAGES: 300');
  if (L < jp + .3) red('just one look.', 480, 900, 66, L, ol, .8);
});
// his own board, close: page 1 next to page 40
shot('board40', 'down40', null, (L, u, t, c) => {
  camD(lerp(1.0, 1.12, eio(u)), 960, 540, () => {
    rectf(-200, -200, W + 400, H + 400, rgba([120, 92, 66])); for (let i = 0; i < 40; i++) disc(rnd(i * 3.1) * W, rnd(i * 5.7) * H, 3, rgba([90, 68, 50]));
    additive(() => glow(GREEN, -100, 540, 700, .25 + .06 * Math.sin(t * 7)));
    const pg = (x, rot, n, wobbly) => at(x, 560, 300, rot, () => { outlined(() => { ctx.beginPath(); ctx.rect(-.5, -.66, 1, 1.32); }, rgba(PAPER), .012); monsterD(0, .05, wobbly ? .62 : .72, { rot: wobbly ? .3 : 0, col: wobbly ? [100, 100, 110] : [40, 40, 48] });
      if (wobbly) for (let k = 0; k < 4; k++) curve([[-.34 + k * .04, -.42], [.24, -.12 + k * .08], [-.24, .32]], .012, rgba([60, 60, 70], .55)); ink(String(n), .36, -.52, .14, [60, 60, 70]); });
    pg(640, -.06, 1, true); pg(1280, .05, 40, false); for (const x of [640, 1280]) { disc(x, 360, 12, rgba([220, 60, 50])); disc(x - 3, 357, 4, 'rgba(255,255,255,.6)'); }
  });
});
shot('down40', 'door', null, (L, u, t, c) => {
  const d3 = c('down3'), down = eio(seg(L, d3 - .3, d3 + .05)), off = eo(seg(L, d3, d3 + .5));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: true, look: [.8, .4], expr: L > d3 ? { ...FX.smile } : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 6, lamp: lerp(.35, 1, off), drawing: L > d3 + .4, look: L < d3 - .3 ? [-.7, -.2] : [.1, .9], expr: L < d3 ? { ...FX.resolve, lid: .1 } : { ...FX.resolve, lid: .25 }, green: .4 * (1 - off),
      armL: L > d3 - .5 && L < d3 + .4 ? [lerp(430, 300, eio(seg(L, d3 - .5, d3 - .25))), lerp(676, 470 + 200 * down, eio(seg(L, d3 - .5, d3 - .25)))] : undefined,
      dev: f => devBehind(t, { x: lerp(740, 800, off), y: 920, h: 600, expr: L < d3 ? devEx('grin', L, []) : { ...DX.sulk }, look: [-.8, .3], lean: -.12 + .06 * off, cap: true, capBrim: -1,
        armL: [lerp(f.shL[0] - 10, 660, off), lerp(f.shL[1] + 40, 640, off)], armR: [lerp(f.shR[0] + 10, 880, off), lerp(f.shY + 60, 650, off)], heat: .8 }),
      after: f => { if (L < d3) windowD(220, 480 + down * 200, 330, 248 * (1 - down * .95), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L + 5, t), { glow: 2 - down }); else windowDown(230, .6); } });
  }, { focus: 'L', dim: .5 });
  counterL(L >= c('count41') ? 'PAGES: 41' : 'PAGES: 40'); counterR('PAGES: 300');
});
// PAGE 120: Max's front door. He holds out a comic of the two of them; Max reads it, laughs, hugs him; the cap falls off the devil
shot('door', 'stitch', null, (L, u, t, c) => {
  counterL('PAGES: 120');
  const kn = c('knock'), op = c('open'), ho = c('hold'), rd = c('read'), la = c('laughM'), hg = c('hug2'), cf = c('capFall');
  const open = eio(seg(L, op, op + .5)), hold = eio(seg(L, ho - .3, ho + .2)), hug = eio(seg(L, hg - .3, hg + .2)), capK = seg(L, cf, cf + .6);
  camD(push(u, .05), 1000, 560, () => {
    stageD(900, { pool: [1150, 380, 640, LAMP, .2] });
    doorD(1250, 900, open, 1);
    const mx = lerp(1250, lerp(1180, 1090, hug), open), tx = lerp(860, 960, hug);
    if (open > .3) { const m = figure({ kind: 'sam', x: mx, y: 900, h: 420, expr: L < rd ? 'calm' : L < la ? { ...FX.calm, lid: .2 } : 'laugh', look: L < rd ? [-.9, 0] : L < hg ? [-.3, .8] : [-.6, -.1], turn: -.2,
        armL: hug > .1 ? [tx + 40, 650] : L > rd ? [mx - 90, 650] : undefined, armR: hug > .1 ? [tx + 10, 600] : L > rd ? [mx - 40, 660] : undefined, stretch: true, t, seed: 5 }); capOn(m, -1); }
    const th = figure({ kind: 'sam', x: tx, y: 900, h: 420, expr: L < op + .3 ? { ...FX.calm, lid: .2 } : L < la ? { ...FX.tempted, lid: .05, m: 'flat' } : 'laugh', look: [.9, -.1], turn: .25,
      armR: L < kn + .3 ? [1080, 560 + Math.abs(Math.sin((L - kn) * 20)) * 30 * (L > kn ? 1 : 0)] : hold > 0 && L < rd ? [lerp(960, 1080, hold), lerp(700, 640, hold)] : hug > .1 ? [mx + 30, 640] : undefined, armL: hug > .1 ? [mx + 60, 600] : undefined, stretch: true, t });
    earPencil(th, 1);
    // the comic he drew of the two of them: in his hand, then in Max's
    const cx = L < rd ? lerp(920, 1090, hold) : lerp(1120, 1100, hug), cy = L < rd ? lerp(720, 640, hold) : lerp(640, 760, hug);
    if (hug < .9) comicD(cx, cy, 200, 1, 0);
    // the devil on the step, sulking; the cap falls off it
    const dv = figure({ kind: 'devil', x: 470, y: 900, h: 560, stage: 3, expr: L < hg ? devEx('sulk', L, [1.2]) : { ...DX.plead, m: 'pout' }, look: [.9, -.2], tilt: -.08, lean: -.06, armL: [430, 700], armR: [520, 700], tail: [-.34, .05], heat: .5, t });
    if (L < cf) devCap(dv, 1); else { const k = capK, x0 = dv.head[0], y0 = dv.head[1] - dv.hr * 1.15; capAt(lerp(x0, x0 + 280, k), lerp(y0, 880, k * k) - 90 * Math.sin(k * Math.PI), dv.hr * 1.02, k * 2.4, CAP, 1); }
  });
});
// PAGE 300: the counters meet and the tear stitches shut; the two of him slide together into one
shot('stitch', 'last', null, (L, u, t, c) => {
  const cs = c('count300'), cd = c('countDone'), sw = c('sew'), se = c('sewEnd'), on = c('one');
  const n = Math.round(lerp(120, 300, eio(seg(L, cs, cd)))), sew = seg(L, sw, se), merge = eio(seg(L, se, on));
  SPLIT(side => { if (side < 0) { rightDesk(t, L, { noPencil: true, hold: L < se, look: L < cd ? [.8, .4] : [.1, .7], expr: L > cd ? 'smile' : { ...FX.calm, lid: .15 } }); return; }
    leftAgain(t, L, { n: 12, lamp: 1, drawing: L < cd, look: L < cd ? [.1, .9] : [.1, .7], expr: L > cd ? 'smile' : undefined });
  }, { stitch: sew, slide: 1 - merge, gap: 12 });
  if (merge > .6) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); additive(() => glow([255, 240, 210], 960, 540, 900, .5 * Math.sin(seg(merge, .6, 1) * Math.PI))); ctx.restore(); }
  if (merge < .2) { counterL('PAGES: ' + n); counterR('PAGES: 300'); }
});
// ---- 96-106 THE LAST PICTURE: one boy, one desk; the devil, plain, with a window the size of a stamp ----
shot('last', 'title', 'PAGES: 300', (L, u, t, c) => {
  const st = c('stamp'), ah = c('ahead'), sm = c('smile'), gd = c('good'), tp = c('tap'), dk = c('dark2');
  const show = eo(seg(L, st - .2, st + .3)), tap = eio(seg(L, tp - .45, tp)), shut = L >= tp, dark = seg(L, dk, dk + 1.6);
  camD(lerp(1.1, 1.22, eio(u)), 860, 560, () => {
    deskHalf(t, { X: 960, lamp: 1 - dark * .9, pinned: 0, back: () => { SIDE = 1; ctx.save(); ctx.translate(480, 0); boardAgain(12); ctx.restore(); }, pile: 300, pencil: L < tp - .6 || L > tp + .4,
      boy: { expr: L < sm ? { eh: .9, lid: .38, bi: .08, bo: -.02, m: 'flat' } : L < tp - .5 ? samEx('smile', L, [gd + .9]) : 'smile', look: L < ah ? [.1, .9] : L < tp - .5 ? [-.7, .1] : [-.7, .4], turn: L > ah ? -.2 : 0,
        armL: L > tp - .6 && L < tp + .4 ? [lerp(900, 690, tap), lerp(676, 600, tap)] : [900, 676], armR: [1010, 668] },
      after: f => {
        // the devil, plain: no cap, no medal, leaning on the desk with its chin on its arms
        const d = figure({ kind: 'devil', x: 600, y: 940, h: 560, stage: 3, noLegs: true, expr: L < ah ? devEx('sulk', L, [1.0]) : L < tp ? devEx('sweet', L, [ah + 1.4]) : { ...DX.sulk, h: .35 }, look: [.8, -.1], lean: .25, tilt: .18, armL: [560, 680], armR: [690, 640], heat: .45, t });
        const wx = 700, wy = 600; if (!shut) windowD(wx, wy, 70 * show, 52 * show, 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L, t), { glow: .8 }); else { windowD(wx, wy + 18, 70, 6, 1, null, { back: true, glow: .2 * (1 - seg(L, tp, tp + .4)) }); }
        if (L > tp - .6 && L < tp + .4) pencilD(lerp(900, 712, tap), lerp(660, 585, tap), 80, lerp(-.6, -2.2, tap));
        if (L > tp && L < tp + .3) { const k = seg(L, tp, tp + .3); ctx.lineWidth = 5 * (1 - k); ctx.strokeStyle = rgba(GREEN_L, 1 - k); ctx.beginPath(); ctx.arc(wx, wy, 20 + k * 90, 0, TAU); ctx.stroke(); }
        deskPage(1000); } });
  });
  if (L < sm) red('they’re still ahead.', 420, 170, 64, L, ah, .9);
  say('good for them.', 1540, 1000, 80, L, gd, .6);
});
shot('title', 'END', null, (L, u, t, c) => {
  const ti = c('titleIn'), k = eo(seg(L, ti, ti + .5));
  if (L >= ti) over(() => { ctx.save(); ctx.globalAlpha = k; _hw('ENVY', 960, 470, 150, 'say', { rot: 0 }); _hw('it showed him everyone else', 960, 600, 66, 'devil', { rot: 0, weight: 400 }); ctx.restore(); });
});
// ---- the hook (source 200-204.6): SAME BOY. SAME DESK. / "why not me?" / "look." ----
// 1. the split at its widest, a mirror image, dimmed so the eye lands on the two huge counters first
shot('hk1', 'hk2', null, (L, u, t, c) => {
  const lift = eo(seg(L, .15, 1.2));
  camD(lerp(1.06, 1.0, eio(u)), 960, 540, () => SPLIT(side => { if (side < 0) { rightDesk(t, L + 30, { rub: false, look: [.1, .9] }); return; }
    stageD(900, { pool: [480, 420, 700, GREEN, .2] }); litterD(); wallWin(L + 40, t);
    const f = figure({ kind: 'sam', x: 520, y: 880, h: 470, noLegs: true, expr: { ...FX.sad, lid: .3, bags: true }, look: [-.4, -.95], tilt: -.12, glowOn: [GREEN, .5], glowSide: -1, armL: [440, 680], armR: [600, 684], t });
    devBehind(t, { x: 230, y: 940, h: 640, expr: devEx('grin', L, []), look: [.7, .3], lean: .2, tilt: .1, cap: true, medal: true, heat: 1.2, armR: [f.head[0] - f.hr * .9, f.head[1] + f.hr * .1], armL: [f.head[0] + f.hr * .2, f.head[1] + f.hr * .55], bendR: -.2, bendL: .6 });
    deskD(80, 880, DESK_Y); }, {}));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba([0, 0, 0], lerp(.62, .22, lift))); ctx.restore();
  counterL('PAGES: 0', 110); counterR('PAGES: 300', 110);
  slam('SAME BOY. SAME DESK.', 960, 1030, 90, L, c('hkSame'), 'say');
});
// 2. close on the left one's face, lit green from below; the devil's grin behind him
shot('hk2', 'hk3', null, (L, u, t, c) => {
  camD(lerp(1.0, 1.08, eio(u)), 960, 540, () => {
    stageD(0, { pool: [960, 1000, 900, GREEN, .3] });
    const d = figure({ kind: 'devil', x: 560, y: 2260, h: 1900, stage: 3, noLegs: true, noArms: true, noTail: true, expr: devEx('grin', L, [1.0]), look: [.8, .4], tilt: .14, lean: .1, heat: 1.1, t }); devCap(d, 1);
    const f = figure({ kind: 'sam', x: 1220, y: 2380, h: 1900, noLegs: true, noArms: true, expr: { ...FX.tempted, lid: .35, bags: true }, look: [-.3, .7], tilt: -.04, glowOn: [GREEN, .6], glowSide: 0, t });
    additive(() => glow(GREEN, 1180, 1100, 700, .35));
  });
  say('why not me?', 1460, 170, 100, L, c('hkWhy'), .5);
});
// 3. the devil turns to the camera and holds its window out to us
shot('hk3', 'hk4', null, (L, u, t, c) => {
  const turn = eio(seg(L, 0, .35)), out = eback(seg(L, .1, .5));
  camD(lerp(1.0, 1.06, eio(u)), 960, 540, () => {
    stageD(0, { pool: [960, 560, 800, GREEN, .22] });
    const d = figure({ kind: 'devil', x: 960, y: 1700, h: 1500, stage: 3, noLegs: true, noTail: true, expr: L < .35 ? devEx('sly', L, []) : devEx('charm', L, [1.1]), look: [lerp(-.8, 0, turn), lerp(.2, .1, turn)], turn: lerp(-.4, 0, turn), heat: 1, t, armL: [700, 760], armR: [1220, 760] });
    devCap(d, 1); medalD(d.sx, d.shY + d.h * .2, d.h * .05, [d.sx, d.shY + d.h * .04]);
    windowD(960, lerp(1060, 870, out), lerp(280, 540, out), lerp(210, 405, out), 1, (x0, y0, w, h) => SHOW.crowd(x0, y0, w, h, L + 2, t), { glow: 1.4 });
  });
  red('look.', 1660, 520, 130, L, c('hkLook'), .3);
});
// ---- THE EDIT: what ships. The shots above are the source, timed by cues.js; cut(shot, { a, b, sp, cam: [zoom, x, y] }) plays
// seconds a..b of a source shot at speed sp, with an optional punch-in; blink() is a beat of black between chapters.
// the hook: SAME BOY. SAME DESK. / "why not me?" / "look."
cut('hk1', { sp: 1.15 }); cut('hk2', { sp: 1.1 }); cut('hk3', { sp: 1.1 });
// together
cut('floor', { a: 0, b: 1.5, sp: 1.3 }); cut('floor', { a: 1.5, b: 2.6, sp: 1.3, cam: [1.25, 960, 640] }); cut('floor', { a: 2.6, b: 4.3, sp: 1.25 });
// the window
cut('night', { a: 0, b: 1.4, sp: 1.3 }); cut('night', { a: 1.4, b: 2.4, sp: 1.25 }); cut('night', { a: 2.4, b: 3.4, sp: 1.25, cam: [1.9, 600, 450] });
cut('night', { a: 3.4, b: 4.4, sp: 1.3 }); cut('night', { a: 4.4, b: 5.6, sp: 1.2 }); cut('night', { a: 5.6, b: 6.6, sp: 1.2, cam: [2.1, 950, 520] });
// round 1: their comic, crumpled and eaten; the window grows; the cap
cut('crumple', { a: 0, b: 1.3, sp: 1.3 }); cut('crumple', { a: 1.3, b: 2.2, sp: 1.25, cam: [1.8, 980, 520] }); cut('crumple', { a: 2.2, b: 3.6, sp: 1.3 });
cut('crumple', { a: 3.6, b: 4.6, sp: 1.25 }); cut('crumple', { a: 4.6, b: 6.2, sp: 1.35, cam: [1.6, 660, 480] });
// the split: the rip, the slide, the mirror, one difference
cut('split', { a: 0, b: 1.6, sp: 1.4 }); cut('split', { a: 1.6, b: 2.6, sp: 1.0 }); cut('split', { a: 2.6, b: 3.6, sp: 1.0 });
cut('split', { a: 3.6, b: 4.6, sp: 1.1, cam: [1.5, 560, 560] }); cut('split', { a: 4.6, b: 6.0, sp: 1.1, cam: [1.5, 1360, 600] });
// round 2: the cuts alternate between the halves
cut('medal', { a: 0, b: 1.6, sp: 1.2 }); cut('work', { a: 0, b: 1.2, sp: 1.3 }); cut('medal', { a: 1.6, b: 3.0, sp: 1.3 }); cut('work', { a: 1.2, b: 2.5, sp: 1.3 });
cut('medal', { a: 3.0, b: 4.2, sp: 1.25, cam: [1.7, 380, 500] }); cut('work', { a: 2.5, b: 3.6, sp: 1.3 }); cut('medal', { a: 4.2, b: 5.4, sp: 1.3 }); cut('work', { a: 3.6, b: 5.0, sp: 1.3 });
cut('medal', { a: 5.4, b: 6.5, sp: 1.3 });
// the cost: the card, Max's show
cut('card', { a: 0, b: 1.05, sp: 1.2 }); cut('card', { a: 1.05, b: 2.4, sp: 1.25 }); cut('card', { a: 2.4, b: 3.5, sp: 1.3 });
cut('showR', { sp: 1.3 });
cut('showL', { a: 0, b: 1.4, sp: 1.3 }); cut('showL', { a: 1.4, b: 2.0, sp: 1.2, cam: [2.0, 1240, 560] }); cut('showL', { a: 2.0, b: 3.6, sp: 1.3 });
cut('showL', { a: 3.6, b: 4.8, sp: 1.3 }); cut('showL', { a: 4.8, b: 6.4, sp: 1.1, cam: [1.45, 760, 560] });
blink();
// the worst: his own monster on the prize
cut('worst', { a: 0, b: 1.8, sp: 1.3 }); cut('worst', { a: 1.8, b: 4.0, sp: 1.3 }); cut('cover', { sp: 1.2 }); cut('wide', { sp: 1.1 });
// the turn
cut('wrench', { a: 0, b: 1.4, sp: 1.2 }); cut('wrench', { a: 1.4, b: 3.0, sp: 1.2 });
cut('eyes', { a: 0, b: 1.0, sp: 1.2 }); cut('eyes', { a: 1.0, b: 2.2, sp: 1.0 }); cut('eyes', { a: 2.2, b: 4.0, sp: 1.15 });
cut('hand', { a: 0, b: 1.2, sp: 1.3 }); cut('hand', { a: 1.2, b: 2.8, sp: 1.2 });
cut('slam', { a: 0, b: 1.0, sp: 1.2 }); cut('slam', { a: 1.0, b: 2.4, sp: 1.25 });
blink();
// one page a day
cut('page1', { a: 0, b: 1.5, sp: 1.3 }); cut('page1', { a: 1.5, b: 2.9, sp: 1.3, cam: [1.6, 360, 520] }); cut('page1', { a: 2.9, b: 4.3, sp: 1.3 });
cut('page40', { a: 0, b: 1.5, sp: 1.3 }); cut('page40', { a: 1.5, b: 2.6, sp: 1.2 }); cut('page40', { a: 2.6, b: 3.5, sp: 1.2, cam: [2.0, 470, 470] }); cut('page40', { a: 3.5, b: 5.0, sp: 1.3 });
cut('board40', { sp: 1.2 }); cut('down40', { sp: 1.3 });
cut('door', { a: 0, b: 1.6, sp: 1.3 }); cut('door', { a: 1.6, b: 2.9, sp: 1.3, cam: [2.0, 1140, 520] }); cut('door', { a: 2.9, b: 4.0, sp: 1.2 });
cut('door', { a: 4.0, b: 5.0, sp: 1.2, cam: [1.55, 520, 600] }); cut('door', { a: 5.0, b: 6.5, sp: 1.3 });
cut('stitch', { a: 0, b: 2.0, sp: 1.3 }); cut('stitch', { a: 2.0, b: 5.0, sp: 1.15 });
// the last picture, the title
cut('last', { a: 0, b: 2.4, sp: 1.2 }); cut('last', { a: 2.4, b: 3.6, sp: 1.1, cam: [1.7, 960, 500] }); cut('last', { a: 3.6, b: 5.4, sp: 1.1 }); cut('last', { a: 5.4, b: 7.0, sp: 1.0 });
cut('title', { sp: 1.0 });
