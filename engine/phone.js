'use strict';
// His phone, seen close: the vice on its screen (each film draws its own: FILM.viceScreen), the banners from the people
// he is losing, a call, a chat, his home screen with the app he deletes. The rules (the owner's, 27 Oct 2026): the
// vice is shown safely (never explicit, an original logo, no real brand), and a banner never hides the screen: it
// pushes the page down (notifDrop) so both stay readable. Icons are drawn as shapes, so no font can show a blank box.
// f = phoneFrame(L): { s, w, h, x, y }, the screen's box in screen px; everything inside is laid out in units of s.

function phoneFrame(L) {
  const s = .96 + .05 * clamp(L / 3), w = 430 * s, h = 860 * s;
  return { s, w, h, x: W / 2 - w / 2, y: H / 2 - h / 2 };
}
const phoneBox = f => [f.x - 24 * f.s, f.y - 24 * f.s, f.x + f.w + 24 * f.s, f.y + f.h + 24 * f.s];

// ---------- icons, drawn as shapes ----------
function icon(kind, cx, cy, sz, col = [255, 255, 255], a = 1) {
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = ctx.strokeStyle = rgba(col, a); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = sz;
  if (kind === 'heart') {
    const r = s * .3;
    ctx.beginPath(); ctx.arc(-r, -r * .3, r, Math.PI * .75, Math.PI * 2); ctx.arc(r, -r * .3, r, Math.PI, Math.PI * .25);
    ctx.lineTo(0, s * .55); ctx.closePath(); ctx.fill();
  } else if (kind === 'phone') {                   // a handset, tilted
    ctx.rotate(-Math.PI / 4); ctx.lineWidth = s * .17;
    ctx.beginPath(); ctx.arc(0, s * .12, s * .34, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * s * .3, -s * .02, s * .11, s * .16, sd * .5, 0, Math.PI * 2); ctx.fill(); }
  } else if (kind === 'mail') {
    ctx.lineWidth = s * .08; ctx.strokeRect(-s * .4, -s * .28, s * .8, s * .56);
    ctx.beginPath(); ctx.moveTo(-s * .4, -s * .28); ctx.lineTo(0, s * .06); ctx.lineTo(s * .4, -s * .28); ctx.stroke();
  } else {                                         // letters: 'X', '$', '!', 'XXX'
    font(s * (kind.length > 2 ? .34 : .58), SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(kind, 0, s * .03);
  }
  ctx.restore();
}
// text that may end in ' ♥' (drawn as a shape); returns the width
function textHeart(txt, x, y, size, col, a = 1) {
  const heart = txt.endsWith('♥'), body = heart ? txt.slice(0, -1).trimEnd() : txt;
  ctx.fillStyle = rgba(col, a); ctx.fillText(body, x, y);
  const w = ctx.measureText(body).width;
  if (heart) icon('heart', x + w + size * .75, y + size * .05, size * 1.05, [255, 90, 120], a);
  return w + (heart ? size * 1.3 : 0);
}

// ---------- banners ----------
// a notification: [t0, kind, title, text]; kind is 'mom' | 'call' | 'mail' | 'msg' | 'vice' (the film's app) | 'bank'
// | 'warn', or { icon: 'heart' | 'phone' | 'mail' | 'X' | '$' …, color: [r, g, b] }
const NOTIF = {
  mom: ['heart', [76, 200, 120]], call: ['phone', [76, 200, 120]], mail: ['mail', [80, 140, 255]], msg: ['heart', [255, 96, 150]],
  bank: ['$', [40, 170, 90]], warn: ['!', [240, 140, 40]]
};
function notifDrop(t, p) {          // a banner pushes the site down while it shows, so both stay readable
  if (!p.notif) return 0;
  const k = E.out(inv(p.notif[0], p.notif[0] + .35, t)), out = p.swipe ? E.io(inv(p.swipe, p.swipe + .35, t)) : 0;
  return 110 * k * (1 - out);
}
function notif(f, t, n, swipe) {    // a banner slides down; he swipes it away
  const [t0, kind, title, text] = n;
  if (t < t0) return;
  const { s, w, h, x, y } = f, k = E.out(inv(t0, t0 + .35, t)), out = swipe ? E.io(inv(swipe, swipe + .35, t)) : 0;
  const bx = x + 18 * s + out * w, by = y + lerp(-120, 46, k) * s, bw = w - 36 * s;
  const vice = kind === 'vice' || kind === 'xxx', spec = typeof kind === 'object' ? [kind.icon, kind.color]
    : vice ? [FILM.app.icon || 'X', FILM.app.color] : NOTIF[kind] || ['!', [120, 120, 130]];
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = 'rgba(40,40,46,.95)'; rrect(bx, by, bw, 96 * s, 20 * s); ctx.fill();
  ctx.fillStyle = rgba(spec[1]); rrect(bx + 16 * s, by + 22 * s, 52 * s, 52 * s, 12 * s); ctx.fill();
  icon(spec[0], bx + 42 * s, by + 48 * s, 52 * s);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  font(19 * s, SANS, '700'); ctx.fillStyle = rgba(C.cream); ctx.fillText(title, bx + 82 * s, by + 34 * s);
  font(16.5 * s, SANS, '400'); textHeart(text, bx + 82 * s, by + 64 * s, 16.5 * s, C.cream, .85);
  ctx.restore();
}

// ---------- screens ----------
// a call in progress: c = { name, initial, from (seconds already on the call when the shot starts) }
function callScreen(f, L, c = {}) {
  const { s, w, h, x, y } = f, name = c.name || 'Mom', from = c.from ?? 724;
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1c3326'); g.addColorStop(1, '#07100b');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  for (let k = 0; k < 3; k++) {                                   // rings: the call is connected
    const q = (L * .8 + k / 3) % 1; ctx.strokeStyle = rgba([150, 230, 170], .5 * (1 - q)); ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.arc(x + w / 2, y + 250 * s, (80 + 90 * q) * s, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = rgba(C.cream, .18); ctx.beginPath(); ctx.arc(x + w / 2, y + 250 * s, 80 * s, 0, Math.PI * 2); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  font(64 * s, SANS, '300'); ctx.fillStyle = rgba(C.cream, .9); ctx.fillText(c.initial || name[0], x + w / 2, y + 252 * s);
  font(40 * s, SANS, '500'); ctx.fillText(name, x + w / 2, y + 400 * s);
  const sec = from + Math.floor(L);
  font(22 * s, SANS, '400'); ctx.fillStyle = rgba([150, 230, 170]); ctx.fillText(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, x + w / 2, y + 448 * s);
  ctx.fillStyle = rgba([230, 60, 60]); ctx.beginPath(); ctx.arc(x + w / 2, y + 740 * s, 38 * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function bubble(f, txt, right, yy, a, col) {
  const { s, w, x, y } = f;
  if (a <= .01) return;
  font(18 * s, SANS, '400');
  const heart = txt === '♥', tw = heart ? 22 * s : ctx.measureText(txt).width, bw = tw + 36 * s;
  const bx = right ? x + w - 24 * s - bw : x + 24 * s;
  ctx.fillStyle = rgba(col, a); rrect(bx, y + yy * s, bw, 50 * s, 22 * s); ctx.fill();
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  if (heart) icon('heart', bx + bw / 2, y + (yy + 25) * s, 26 * s, C.cream, a);
  else { ctx.fillStyle = rgba(C.cream, a); ctx.fillText(txt, bx + 18 * s, y + (yy + 25) * s); }
}
// a chat: c = { name, items: [{ at, text, me, y, until, fade, col }] }; at/until in seconds into the shot (at < 0: there
// already); y in phone units from the top (default: under the one before); '•••' is the other side typing
function chatScreen(f, L, c) {
  const { s, w, h, x, y } = f;
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = '#0c0d12'; ctx.fillRect(x, y, w, h);
  font(24 * s, SANS, '600'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream); ctx.fillText(c.name, x + w / 2, y + 70 * s);
  let yy = 84;
  for (const it of c.items) {
    yy = it.y ?? yy + 66;
    if (it.until !== undefined && L >= it.until) continue;
    if (it.text === '•••' && L < it.at) continue;
    const fd = it.fade ?? .2, a = it.at < 0 ? 1 : fd <= 0 ? (L >= it.at ? 1 : 0) : inv(it.at, it.at + fd, L);
    bubble(f, it.text, !!it.me, yy, a, it.col || (it.me ? [40, 110, 230] : [58, 58, 66]));
  }
  ctx.restore();
}
// his home screen; with p.del he holds the film's app (FILM.app) and deletes it
function homeScreen(f, t, L, p) {
  const { s, w, h, x, y } = f, del = p.del !== undefined, app = FILM.app;
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1a1c2a'); g.addColorStop(1, '#0b0c12');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const cols = 4, size = 70 * s, gap = (w - cols * size) / (cols + 1);
  const gone = del ? E.io(inv(1.4, 1.7, L)) : 0, jig = del && L > .3 && L < 1.7;
  for (let i = 0; i < 20; i++) {
    const cx = x + gap + (i % cols) * (size + gap), cy = y + 150 * s + Math.floor(i / cols) * (size + 56 * s), isX = i === 9;
    const sc = isX ? 1 - gone : 1;
    if (sc <= .01) continue;
    ctx.save(); ctx.translate(cx + size / 2, cy + size / 2); ctx.scale(sc, sc);
    if (jig) ctx.rotate(Math.sin(t * 30 + i) * .06);
    ctx.fillStyle = isX ? rgba(app.color) : rgba(mix([60, 120, 200], [200, 120, 80], rnd(i + 6000)));
    rrect(-size / 2, -size / 2, size, size, 16 * s); ctx.fill();
    if (isX) { font(22 * s, SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(app.label, 0, s); }
    ctx.restore();
  }
  if (del && L > .8 && L < 1.45) {
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x, y, w, h);
    const bx = x + 50 * s, by = y + 330 * s, bw = w - 100 * s;
    ctx.fillStyle = 'rgba(44,44,50,.97)'; rrect(bx, by, bw, 190 * s, 22 * s); ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    font(21 * s, SANS, '700'); ctx.fillStyle = rgba(C.cream); ctx.fillText(`Delete “${app.name}”?`, x + w / 2, by + 50 * s);
    font(16 * s, SANS, '400'); ctx.fillStyle = rgba(C.cream, .7); ctx.fillText('This removes the app and its data.', x + w / 2, by + 86 * s);
    ctx.fillStyle = L > 1.25 ? 'rgba(255,80,80,.28)' : 'rgba(255,255,255,.06)';
    rrect(bx + 14 * s, by + 120 * s, bw - 28 * s, 54 * s, 14 * s); ctx.fill();
    font(20 * s, SANS, '700'); ctx.fillStyle = 'rgb(255,80,80)'; ctx.fillText('Delete', x + w / 2, by + 147 * s);
  }
  ctx.restore();
}

// ---------- pieces for a film's vice screen ----------
// an abstract skin-tone mosaic: reads as censored, and nothing explicit is drawn underneath (LUST)
const SKIN = [[96, 52, 56], [150, 88, 78], [186, 118, 96], [214, 150, 120], [236, 186, 156], [246, 206, 182]];
function mosaic(x, y, w, h, cell, t, a = 1, pal = SKIN, tint = [255, 110, 130]) {
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const u = i / cols, v = j / rows;
    const n = .5 + .22 * Math.sin(u * 5.1 + t * .9) * Math.cos(v * 4.3 - t * .6) + .2 * Math.sin((u * .8 + v) * 6.3 + t * 1.3) + .08 * Math.sin(i * 1.7 + j * 2.3);
    ctx.fillStyle = rgba(mix(pal[clamp(Math.floor(n * pal.length), 0, pal.length - 1)], tint, .2), a);
    ctx.fillRect(x + i * cell, y + j * cell, Math.min(cell, w - i * cell) + .4, Math.min(cell, h - j * cell) + .4);
  }
  const fg = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) * .7);   // frosted haze
  fg.addColorStop(0, `rgba(255,235,235,${.16 * a})`); fg.addColorStop(1, 'rgba(255,235,235,0)');
  ctx.fillStyle = fg; ctx.fillRect(x, y, w, h);
}
function badge18(x, y, s, a = 1) {
  ctx.fillStyle = rgba(C.red, .95 * a); rrect(x, y, 64 * s, 34 * s, 8 * s); ctx.fill();
  font(22 * s, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillText('18+', x + 32 * s, y + 18 * s);
}
// the status bar's clock at the top of a screen
function statusClock(x, y, s, label, a = 1) {
  font(18 * s, SANS, '600'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream, .8 * a);
  ctx.fillText(label, x + 40 * s, y + 34 * s);
}
// a media player's progress bar under a video at height yy (phone units)
function progressBar(x, y, w, s, yy, pr, a = 1, left = '23:41', right = '41:02') {
  const bx = x + 24 * s, bw = w - 48 * s;
  ctx.fillStyle = rgba([90, 90, 96], a); ctx.fillRect(bx, y + yy * s, bw, 5 * s);
  ctx.fillStyle = rgba(C.red, a); ctx.fillRect(bx, y + yy * s, bw * pr, 5 * s);
  ctx.beginPath(); ctx.arc(bx + bw * pr, y + (yy + 2.5) * s, 9 * s, 0, Math.PI * 2); ctx.fill();
  font(15 * s, SANS, '500'); ctx.fillStyle = rgba(C.cream, .7 * a); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(left, bx, y + (yy + 28) * s); ctx.textAlign = 'right'; ctx.fillText(right, bx + bw, y + (yy + 28) * s);
}
// a feed that keeps scrolling below height yy: two columns of tiles, each painted by tile(tx, ty, tw, th, k)
function feed(x, y, w, h, s, t, yy, tile, a = 1, speed = 70) {
  const scroll = (t * speed * s) % (170 * s), bx = x + 24 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y + yy * s, w, h - yy * s); ctx.clip();
  for (let k = 0; k < 8; k++) {
    const tx = bx + (k % 2) * (w / 2 - 12 * s), ty = y + (yy + 16) * s + Math.floor(k / 2) * 170 * s - scroll, tw = w / 2 - 36 * s;
    ctx.save(); rrect(tx, ty, tw, 110 * s, 10 * s); ctx.clip(); tile(tx, ty, tw, 110 * s, k); ctx.restore();
    ctx.fillStyle = rgba([80, 76, 84], .8 * a); rrect(tx, ty + 120 * s, tw * .8, 10 * s, 5 * s); ctx.fill();
    ctx.fillStyle = rgba([0, 0, 0], .6 * a); rrect(tx + tw - 58 * s, ty + 82 * s, 50 * s, 20 * s, 5 * s); ctx.fill();
  }
  ctx.restore();
}
