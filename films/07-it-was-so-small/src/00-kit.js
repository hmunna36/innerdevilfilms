'use strict';
// THE BOTTLE | It Was So Small. The cut: shot(startCue, endCue, counterText, (L, u, t, c) => draw) with L = seconds into
// the shot, u = 0..1 through it, t = film time, c(name) = that cue's time inside this shot.
const SHOTS = [];
const shot = (a, b, count, fn) => SHOTS.push({ a: CUE[a], b: CUE[b], count, fn, name: a });
function FILM(t) {
  t = clamp(t, 0, CUE.END - 1e-4);
  const s = SHOTS.find(s => t >= s.a && t < s.b);
  rectf(0, 0, W, H, rgba(D.stage));
  if (s) { const L = t - s.a; ctx.save(); s.fn(L, L / (s.b - s.a), t, n => CUE[n] - s.a); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; if (s.count) counter(s.count); }
  finish({ bloom: .07, grain: .03, vignette: .5, t });
  const out = seg(t, CUE.END - .6, CUE.END - .05); if (out > 0) rectf(0, 0, W, H, `rgba(0,0,0,${out})`);
}
// words are drawn after the picture, on top and never zoomed by a punch-in: hw() queues itself while a shot draws
let OVER = null, HOOK = false; const _hw = hw; hw = function (...a) { if (OVER) OVER.push(() => _hw(...a)); else _hw(...a); };
const over = fn => { if (OVER) OVER.push(fn); else fn(); };
const push = (u, k = .05) => 1 + k * u;
const say = (text, x, y, size, L, a, d = .9, o = {}) => { if (L >= a) hw(text, x, y, size, 'say', { reveal: seg(L, a, a + d), ...o }); };
const red = (text, x, y, size, L, a, d = 1.1, o = {}) => { if (L >= a) hw(text, x, y, size, 'devil', { reveal: seg(L, a, a + d), ...o }); };
// the red capitals: slammed, shaking for a moment
function slam(text, x, y, size, L, a, kind = 'devil') { if (L < a) return; const k = seg(L, a, a + .12), sh = (1 - seg(L, a, a + .5)) * 14; over(() => { ctx.save(); ctx.translate(x + Math.sin(L * 90) * sh, y + Math.cos(L * 70) * sh * .6); ctx.scale(lerp(1.5, 1, eo(k)), lerp(1.5, 1, eo(k))); _hw(text, 0, 0, size, kind, { rot: -.02, weight: 700 }); ctx.restore(); }); }
// the fire in its belly when it is fed, and the pop when it grows: flare 0..1..0, pop 0..1 (eased with overshoot)
const flareK = (L, a, b) => Math.sin(seg(L, a, b) * Math.PI);
const popRing = (L, a, x, y, r0 = 120, r1 = 620) => { if (L < a || L > a + .6) return; const k = seg(L, a, a + .55); ctx.lineWidth = 14 * (1 - k); ctx.strokeStyle = rgba(D.red, 1 - k); ctx.beginPath(); ctx.arc(x, y, r0 + k * r1, 0, TAU); ctx.stroke(); };
const popFlash = (L, a, amt = .28) => { if (L >= a && L < a + .1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rectf(0, 0, W, H, rgba(D.red, amt * (1 - seg(L, a, a + .1)))); ctx.restore(); } };
const burp = (L, a, x, y, s = 1) => { if (L < a || L > a + .5) return; const k = 1 - seg(L - a, 0, .5), py = y - (L - a) * 320 * s; additive(() => glow(D.ember, x, py, (90 * k + 20) * s, .9 * k)); blob([[x, py + 40 * k * s], [x + 30 * k * s, py], [x, py - 70 * k * s], [x - 30 * k * s, py]], rgba(D.hot, k), .5); };
// small things people wear and hold
function tieD(f, col = [86, 120, 138], len = .2) { const x = f.sx, y = f.shY - f.h * .012, w = f.h * .028, L = f.h * len; outlined(() => poly([[x - w, y], [x + w, y], [x + w * .6, y + w * 1.3], [x + w * 1.2, y + L], [x, y + L + w * 1.6], [x - w * 1.2, y + L], [x - w * .6, y + w * 1.3]]), rgba(col), Math.max(2, f.h * .006)); }
function bowD(x, y, s, col = [40, 36, 40], line = D.line) { for (const sd of [-1, 1]) outlined(() => poly([[x, y], [x + sd * s, y - s * .62], [x + sd * s, y + s * .62]]), rgba(col), Math.max(1.5, s * .12)); disc(x, y, s * .3, rgba(line)); disc(x, y, s * .2, rgba(col)); }
function hatD(x, y, s, rot = 0, col = [70, 170, 200]) { at(x, y, s, rot, () => { outlined(() => poly([[-.34, 0], [.34, 0], [0, -1]]), rgba(col), .05); stroke([[-.22, -.3], [.22, -.36]], .07, 'rgba(255,255,255,.8)'); stroke([[-.13, -.58], [.13, -.62]], .07, 'rgba(255,255,255,.8)'); disc(0, -1.02, .11, 'rgb(255,255,255)'); }); }
function veilD(f) { const [hx, hy] = f.head, r = f.hr; ctx.save(); ctx.globalAlpha = .5; blob([[hx - r * .9, hy - r * .8], [hx + r * .2, hy - r * 1.12], [hx + r * 1.15, hy - r * .3], [hx + r * 1.5, hy + r * 1.6], [hx + r * 1.2, hy + r * 3.0], [hx + r * .7, hy + r * 1.2], [hx + r * .9, hy - r * .1]], rgba(D.white), .5); ctx.restore(); }
function babyD(x, y, s, o = {}) { at(x, y, s, o.rot || 0, () => { outlined(() => blobPath([[-1, -.1], [-.4, -.55], [.6, -.5], [1.05, 0], [.6, .5], [-.5, .5]], .5, true), rgba(D.yellow), .07); disc(-.62, -.08, .37, rgba(D.line)); disc(-.62, -.08, .31, rgba(D.cream));
  if (o.awake) { disc(-.72, -.1, .04, rgba(D.line)); disc(-.52, -.1, .04, rgba(D.line)); } else { stroke([[-.78, -.08], [-.68, -.05]], .035, rgba(D.line)); stroke([[-.57, -.05], [-.47, -.08]], .035, rgba(D.line)); } stroke([[-.2, -.5], [.1, .48]], .05, rgba(darken(D.yellow, .25))); }); }
// a sheet of paper with a child's crayon drawing. horns: Daddy in red with horns; else Daddy in blue, holding her hand, a sun
function drawingD(x, y, s, rot, horns, o = {}) { at(x, y, s, rot, () => {
  outlined(() => { ctx.beginPath(); ctx.rect(-1, -.72, 2, 1.44); }, rgba([238, 234, 222]), .02);
  const cr = (pts, col, w = .035) => curve(jit(pts, .012, 3), w, rgba(col), .5), stick = (px, hgt, col, extra) => { const top = .42 - hgt; ctx.lineWidth = .035; ctx.strokeStyle = rgba(col); ctx.beginPath(); ctx.arc(px, top + .1, .1, 0, TAU); ctx.stroke(); cr([[px, top + .2], [px + .01, .22]], col); cr([[px - .13, top + .34], [px, top + .28], [px + .13, top + .34]], col); cr([[px - .1, .42], [px, .22], [px + .1, .42]], col); if (extra) extra(px, top); };
  ctx.save(); ctx.font = '700 0.17px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = rgba([70, 90, 160]); ctx.fillText('MY FAMILY', 0, -.47); ctx.restore();
  const green = [60, 150, 90], yel = [235, 180, 20], redc = [225, 40, 30], blue = [50, 110, 210];
  if (horns) { stick(-.62, .62, green, (px, top) => cr([[px - .12, top + .2], [px, top + .5], [px + .12, top + .2]], green, .03)); stick(-.3, .4, yel, (px, top) => { cr([[px - .1, top - .02], [px, top + .03], [px + .1, top - .02]], yel, .05); });
    stick(.45, .78, redc, (px, top) => { cr([[px - .08, top + .02], [px - .13, top - .1]], redc, .05); cr([[px + .08, top + .02], [px + .13, top - .1]], redc, .05); cr([[px - .05, top + .13], [px + .05, top + .13]], redc, .03); for (let i = 0; i < 9; i++) cr([[px - .2 + i * .05, top + .2 + (i % 2) * .5], [px - .17 + i * .05, top + .7 - (i % 2) * .5]], redc, .02); });
  } else { stick(-.62, .62, green, (px, top) => cr([[px - .12, top + .2], [px, top + .5], [px + .12, top + .2]], green, .03)); stick(.42, .74, blue, (px, top) => cr([[px - .05, top + .1], [px, top + .14], [px + .05, top + .1]], blue, .025)); stick(.08, .4, yel, (px, top) => { cr([[px - .1, top - .02], [px, top + .03], [px + .1, top - .02]], yel, .05); cr([[px - .04, top + .1], [px, top + .14], [px + .04, top + .1]], yel, .025); });
    cr([[.2, .14], [.3, .1]], blue, .035); ctx.lineWidth = .04; ctx.strokeStyle = rgba(yel); ctx.beginPath(); ctx.arc(-.7, -.42, .12, 0, TAU); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; cr([[-.7 + Math.cos(a) * .17, -.42 + Math.sin(a) * .17], [-.7 + Math.cos(a) * .25, -.42 + Math.sin(a) * .25]], yel, .03); } cr([[.72, -.3], [.78, -.36], [.84, -.3], [.9, -.36]], redc, .03); }
  if (o.shade) rectf(-1, -.72, 2, 1.44, rgba(D.stage, o.shade)); }); }
// a table seen from the side, a chair, a door
function tableD(x0, x1, y, legH = 150, col = D.wood) { outlined(() => { ctx.beginPath(); ctx.rect(x0, y, x1 - x0, 30); }, rgba(col), 5); for (const x of [x0 + 40, x1 - 70]) outlined(() => { ctx.beginPath(); ctx.rect(x, y + 30, 30, legH); }, rgba(mix(col, D.stage, .3)), 5); }
function chairD(x, y, s, dir = 1, col = D.prop) { const c = rgba(col); outlined(() => { ctx.beginPath(); ctx.rect(x - s * .3, y - s * .5, s * .6, s * .07); }, c, 4); outlined(() => { ctx.beginPath(); ctx.rect(x - dir * s * .3 - s * .035, y - s * 1.25, s * .07, s * 1.25); }, c, 4); outlined(() => { ctx.beginPath(); ctx.rect(x + dir * s * .3 - s * .035, y - s * .5, s * .07, s * .5); }, c, 4); }
function sparks(L, a, x, y, n = 10, sp = 300, col = D.ember) { const k = L - a; if (k < 0 || k > .6) return; for (let i = 0; i < n; i++) { const ang = rnd(i * 3.3) * TAU, v = sp * (.4 + rnd(i * 5.1)); disc(x + Math.cos(ang) * v * k, y + Math.sin(ang) * v * k + 500 * k * k, 5 * (1 - k / .6), rgba(col, 1 - k / .6)); } }
// a soft shadow of a figure on a lit wall
function shadowFig(x, y, h, horns, a = .7, blur = 9) { blurred(blur, () => { const c = rgba(D.stage, a), hr = h * .2, hy = y - h + hr; disc(x, hy, hr, c);
  blob([[x - h * .1, hy + hr * .8], [x + h * .1, hy + hr * .8], [x + h * .14, y - h * .32], [x + h * .1, y - h * .2], [x - h * .1, y - h * .2], [x - h * .14, y - h * .32]], c, .45);
  for (const sd of [-1, 1]) { taper([[x + sd * h * .05, y - h * .24], [x + sd * h * .06, y]], [h * .085, h * .08], c); taper([[x + sd * h * .1, hy + hr * 1.1], [x + sd * h * .16, y - h * .3]], [h * .07, h * .06], c);
    if (horns) taper([[x + sd * hr * .56, hy - hr * .7], [x + sd * hr * .95, hy - hr * 1.15], [x + sd * hr * .85, hy - hr * 1.75]], [hr * .32, hr * .22, hr * .03], c); } }); }
function flaskD(x, y, s, rot = 0) { at(x, y, s, rot, () => { outlined(() => { ctx.beginPath(); ctx.roundRect(-.3, -.5, .6, 1, .12); }, rgba([128, 138, 160]), .035); outlined(() => { ctx.beginPath(); ctx.rect(-.11, -.66, .22, .16); }, rgba([90, 98, 118]), .03); rectf(-.2, -.4, .08, .8, 'rgba(255,255,255,.3)'); }); }
function flowerArch(cx, cy, r, floorY) { curve([[cx - r, floorY], [cx - r, cy], [cx - r * .7, cy - r * .7], [cx, cy - r], [cx + r * .7, cy - r * .7], [cx + r, cy], [cx + r, floorY]], 6, rgba(D.prop), .5);
  for (let i = 0; i < 17; i++) { const a = Math.PI + i / 16 * Math.PI, x = cx + Math.cos(a) * r * (i % 2 ? .97 : 1.03), y = cy + Math.sin(a) * r * (i % 2 ? .97 : 1.03) * (Math.abs(Math.cos(a)) > .9 ? 1 : 1), c = [[226, 222, 212], [190, 90, 120], [70, 150, 170]][i % 3]; disc(x, y, 21, rgba(D.line)); disc(x, y, 16, rgba(c)); disc(x, y, 5, rgba(D.yellow, .8)); } }
