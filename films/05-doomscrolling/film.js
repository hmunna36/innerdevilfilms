'use strict';
// FILM 05: DOOMSCROLLING | It Eats Your Hours (1:58). The house style of LUST (films/03-lust), with this film's own
// device: FEED, an endless feed with a time chip that climbs night by night, and a devil that EATS HIS HOURS: small
// glowing clock faces float out of his phone into its grin, his wall calendar loses months to it (the first page it
// snaps is the fishing Saturday he swiped away), and its claw spins his wall clock forward. Every night it is closer
// (the window, the foot of the bed, beside him, behind him with its hands on his shoulders), every night Grandpa waits
// (his photo on the nightstand), and every night his face is a notch older. The phone dies; in the black glass it leans
// over his shoulder and his reflection grows old: "I WAS EATING YOU." It eats Grandpa's photo: "HE DOESN'T HAVE YEARS."
// He throws the phone in the nightstand drawer and slams it on its claws, and the hours stream back into him; at 6:00 AM
// the music turns: push-ups, the run, the gym, a book instead of the feed, the photo stood back up; at 9:40 PM the
// drawer buzzes, it attacks, and he deletes FEED. Weeks later he fishes with Grandpa on the dock from the photo. In the
// mirror its claw holds out a glowing phone: "Just scroll." Story and critique: STORY.md. Music: music.json, mix.py.

const COLD1 = 'YOU SAID FIVE MINUTES…', COLD = 'HOW MANY HOURS DID IT EAT?';
const RUN = [71.1, 75.7];
const GRANDPA = { icon: 'heart', color: [236, 150, 60] };   // his banners: a warm heart
SPOTS.window = [430, 945, .6];                // at the window its head is inside the glass, outside the room
const BLUE = [52, 136, 255], ICE = [196, 218, 255], HOT = [240, 64, 64];
let GT = 0;                                   // the film time of the frame being drawn (roomProps is not given it)
{ const base = renderFilm; renderFilm = t => { GT = t; return base(t); }; }   // eslint-disable-line no-global-assign

// ---------- FEED: the logo (a blue tile, three white chevrons stacked downward: scroll down, forever) ----------
function loopPath(cx, cy, a) {                // a lemniscate, half-width a (only the dying time chip shows it)
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const th = i / 64 * Math.PI * 2, d = 1 + Math.sin(th) ** 2;
    const x = cx + a * Math.cos(th) / d, y = cy + a * Math.sin(th) * Math.cos(th) / d;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}
function chevrons(cx, cy, sz, col, a = 1) {
  ctx.lineWidth = sz * .085; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  [.5, .75, 1].forEach((k, i) => {
    const y = cy - sz * .2 + i * sz * .19;
    ctx.strokeStyle = rgba(col, a * k); ctx.beginPath(); ctx.moveTo(cx - sz * .22, y - sz * .07); ctx.lineTo(cx, y + sz * .07); ctx.lineTo(cx + sz * .22, y - sz * .07); ctx.stroke();
  });
}
function feedLogo(cx, cy, sz, a = 1) {
  const g = ctx.createLinearGradient(cx - sz / 2, cy - sz / 2, cx + sz / 2, cy + sz / 2);
  g.addColorStop(0, rgba([84, 170, 255], a)); g.addColorStop(1, rgba([40, 70, 230], a));
  ctx.fillStyle = g; rrect(cx - sz / 2, cy - sz / 2, sz, sz, sz * .24); ctx.fill();
  chevrons(cx, cy + sz * .02, sz, [255, 255, 255], a);
}
// the banners draw the app's icon through icon(): 'feed' is FEED's
{ const base = icon; icon = (kind, cx, cy, sz, col = [255, 255, 255], a = 1) => {   // eslint-disable-line no-global-assign
  if (kind === 'heart' && sz > 40) return base(kind, cx, cy + sz * .04, sz * .64, col, a);   // a banner's heart stays inside its tile
  if (kind !== 'feed') return base(kind, cx, cy, sz, col, a);
  ctx.save(); chevrons(cx, cy + sz * .02, sz, col, a); ctx.restore();
}; }

// ---------- the time it eats: what the chip says, by film time ----------
const NIGHTS = [[0, 134], [15.6, 291], [24.6, 428], [35.8, 686]];   // minutes on FEED tonight, from the night's start
const hm = m => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
function feedMins(t) { let m = NIGHTS[0][1], t0 = 0; for (const [a, v] of NIGHTS) if (t >= a) { m = v; t0 = a; } return m + Math.floor((t - t0) * .5); }
const STATUS = [[0, '11:38'], [15.6, '12:53'], [24.6, '2:32'], [31.5, '2:39'], [35.8, '4:08'], [45.4, '4:39'], [48.4, '5:58'], [89.4, '9:41']];
const statusAt = t => { let s = STATUS[0][1]; for (const x of STATUS) if (t >= x[0]) s = x[1]; return s; };
const ZERO = 48.4, DEAD = 49.2;               // the chip spins up to the loop, then the phone dies

// ---------- the posts: abstract pictures only (no faces, no words, no real platform's look) ----------
const POSTC = [[255, 122, 92], [255, 192, 84], [92, 204, 255], [152, 112, 255], [255, 92, 172], [84, 222, 172], [250, 230, 124], [124, 162, 255]];
const pc = k => POSTC[((k % 8) + 8) % 8];
function postArt(x, y, w, h, k, t, s, a) {
  const c1 = pc(k), c2 = pc(k * 3 + 2), type = Math.floor(rnd(k + 17) * 5);
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, rgba(mix(c1, [24, 20, 44], .3), a)); g.addColorStop(1, rgba(mix(c2, [10, 10, 22], .45), a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (type === 0) {                            // a sun over a dark horizon
    ctx.fillStyle = rgba(mix(c2, [255, 255, 255], .45), a); ctx.beginPath(); ctx.arc(x + w * .62, y + h * .6, h * .22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([12, 10, 24], .9 * a); ctx.fillRect(x, y + h * .7, w, h * .3);
  } else if (type === 1) {                     // bright blocks
    for (let i = 0; i < 4; i++) { ctx.fillStyle = rgba(pc(k + i * 2 + 1), .88 * a); rrect(x + w * (.08 + .21 * i), y + h * (.18 + .16 * ((i * 7 + k) % 3)), w * .28, h * .38, 10 * s); ctx.fill(); }
  } else if (type === 2) {                     // waves
    for (let j = 0; j < 4; j++) {
      ctx.fillStyle = rgba(mix(c1, c2, j / 3), .75 * a); ctx.beginPath(); ctx.moveTo(x, y + h);
      for (let u = 0; u <= 1.001; u += .1) ctx.lineTo(x + u * w, y + h * (.42 + j * .14) + Math.sin(u * 7 + j + t * 2 + k) * h * .05);
      ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    }
  } else if (type === 3) {                     // a glowing blob
    const rg = ctx.createRadialGradient(x + w * .45, y + h * .45, 0, x + w * .5, y + h * .5, h * .5);
    rg.addColorStop(0, rgba(mix(c1, [255, 255, 255], .5), a)); rg.addColorStop(1, rgba(c1, 0));
    ctx.fillStyle = rg; ctx.fillRect(x, y, w, h);
  } else {                                     // a clip: a play button
    ctx.fillStyle = rgba([0, 0, 0], .35 * a); ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, 34 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([255, 255, 255], .95 * a); ctx.beginPath();
    ctx.moveTo(x + w / 2 - 11 * s, y + h / 2 - 17 * s); ctx.lineTo(x + w / 2 + 17 * s, y + h / 2); ctx.lineTo(x + w / 2 - 11 * s, y + h / 2 + 17 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba([255, 255, 255], .3 * a); ctx.fillRect(x, y + h - 6 * s, w, 6 * s);
    ctx.fillStyle = rgba(HOT, a); ctx.fillRect(x, y + h - 6 * s, w * (.2 + .6 * rnd(k + 5)), 6 * s);
  }
}
const PH = 318;                               // one post's height, phone units
// how far the feed has scrolled (posts): flick, settle, flick; faster each night, a blur at the end
function feedPos(t) {
  if (t >= ZERO) return 40 + (t - ZERO) * 14 + (t - ZERO) ** 2 * 30;
  const r = t < 15.6 ? 1.25 : t < 24.6 ? 1.5 : t < 35.8 ? 1.8 : 2.3, u = t * r;
  return Math.floor(u) + E.out(clamp((u % 1) * 2.4));
}
function clockIcon(cx, cy, r, col, a = 1) {
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = r * .22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  line(cx, cy, cx, cy - r * .62); line(cx, cy, cx + r * .48, cy + r * .1);
}
// ---------- FEED on his phone (dy: how far a banner pushed the page down) ----------
function feedScreen(x, y, w, h, s, t, a, dy = 0) {
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = rgba([6, 8, 14], a); ctx.fillRect(x, y, w, h);
  statusClock(x, y, s, statusAt(t), a);
  ctx.translate(0, dy * s);
  const zk = inv(ZERO, ZERO + .6, t);
  // the feed, under everything
  const top = y + 200 * s, pos = feedPos(t), first = Math.floor(pos);
  ctx.save(); ctx.beginPath(); ctx.rect(x, top, w, h - 200 * s + 200); ctx.clip();
  for (let i = -1; i < 4; i++) {
    const k = first + i, py = top + (i - (pos - first)) * PH * s, bx = x + 24 * s, bw = w - 48 * s;
    ctx.fillStyle = rgba(pc(k * 5 + 1), .95 * a); ctx.beginPath(); ctx.arc(bx + 18 * s, py + 22 * s, 16 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba([92, 96, 108], .9 * a); rrect(bx + 46 * s, py + 12 * s, (90 + 70 * rnd(k + 3)) * s, 11 * s, 5 * s); ctx.fill();
    ctx.fillStyle = rgba([60, 62, 72], .9 * a); rrect(bx + 46 * s, py + 28 * s, 60 * s, 8 * s, 4 * s); ctx.fill();
    ctx.save(); rrect(bx, py + 48 * s, bw, 190 * s, 14 * s); ctx.clip(); postArt(bx, py + 48 * s, bw, 190 * s, k, t, s, a); ctx.restore();
    icon('heart', bx + 14 * s, py + 260 * s, 24 * s, (k % 3) ? [236, 236, 240] : [255, 80, 110], a);
    font(15 * s, SANS, '700'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream, .85 * a);
    ctx.fillText(`${(1 + rnd(k + 9) * 98).toFixed(1)}K`, bx + 34 * s, py + 261 * s);
    ctx.strokeStyle = rgba([236, 236, 240], .9 * a); ctx.lineWidth = 2.5 * s; rrect(bx + 104 * s, py + 250 * s, 24 * s, 20 * s, 7 * s); ctx.stroke();
    ctx.fillText(`${Math.floor(20 + rnd(k + 11) * 900)}`, bx + 136 * s, py + 261 * s);
    ctx.fillStyle = rgba([70, 72, 82], .8 * a); rrect(bx, py + 286 * s, bw * (.55 + .35 * rnd(k + 13)), 9 * s, 4 * s); ctx.fill();
  }
  if (zk > 0) {                               // the reveal: everything smears upward
    for (let i = 0; i < 26; i++) {
      const sx = x + rnd(i + 70) * w, sl = (80 + 300 * rnd(i + 71)) * s * zk, sy = top + ((t * 2400 * s + rnd(i + 72) * h) % (h + sl)) - sl;
      ctx.fillStyle = rgba(pc(i), .55 * a * zk); ctx.fillRect(sx, sy, (3 + 8 * rnd(i + 73)) * s, sl);
    }
  }
  ctx.restore();
  // the header: the logo and the name
  ctx.fillStyle = rgba([6, 8, 14], .96 * a); ctx.fillRect(x, y + 60 * s, w, 140 * s);
  feedLogo(x + 50 * s, y + 92 * s, 46 * s, a);
  font(30 * s, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream, a);
  ctx.fillText('FEED', x + 86 * s, y + 93 * s);
  // the time chip: how much of today it has eaten (red once it is most of the day)
  const mins = feedMins(t), hot = mins >= 420 || zk > 0;
  const by = y + 128 * s, bh = 58 * s;
  ctx.fillStyle = rgba(hot ? [70, 10, 16] : [22, 30, 48], .95 * a); rrect(x + 24 * s, by, w - 48 * s, bh, 16 * s); ctx.fill();
  if (hot) { ctx.strokeStyle = rgba(HOT, .8 * a); ctx.lineWidth = 2 * s; ctx.stroke(); }
  const col = hot ? [255, 120, 120] : ICE;
  clockIcon(x + 56 * s, by + bh / 2, 14 * s, col, a);
  font(32 * s, SANS, '800'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(col, a);
  if (hot && t > 30) { ctx.shadowColor = rgba(HOT, .6 * a); ctx.shadowBlur = 12 * s * VP.k; }
  if (zk <= 0) {
    ctx.fillText(hm(mins), x + 84 * s, by + bh / 2 + 1 * s); ctx.shadowBlur = 0;
    const tw = ctx.measureText(hm(mins)).width;
    font(18 * s, SANS, '600'); ctx.fillStyle = rgba(col, .7 * a); ctx.fillText('tonight', x + 94 * s + tw, by + bh / 2 + 3 * s);
  } else if (zk < 1) {                        // the hours race up
    ctx.fillText(hm(mins + Math.floor(zk ** 3 * 14000)), x + 84 * s, by + bh / 2 + 1 * s); ctx.shadowBlur = 0;
  } else {                                    // ...to no end
    ctx.shadowBlur = 0; ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 5 * s; loopPath(x + 130 * s, by + bh / 2, 40 * s); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}
// the tiny phone in his hand (drawn in -13..13 x -23..21): the blue header, posts sliding up
function feedHand(t) {
  ctx.fillStyle = 'rgb(8,10,16)'; ctx.fillRect(-13, -23, 26, 44);
  if (t >= ZERO && t < DEAD + .4) { ctx.fillStyle = rgba(HOT, .6); ctx.fillRect(-13, -23, 26, 44); }
  const pos = feedPos(t) * 14, f = Math.floor(pos / 14);
  for (let i = -1; i < 4; i++) { ctx.fillStyle = rgba(pc(f + i)); ctx.fillRect(-10, -14 + (i - (pos / 14 - f)) * 14, 20, 10); }
  ctx.fillStyle = rgba(BLUE); ctx.fillRect(-13, -23, 26, 6);
}

// ---------- the hours: small glowing clock faces, eaten ----------
function hourClock(x, y, r, t, a, seed = 0) {
  if (a <= .01 || r < .6) return;
  additive(() => glow(SPR.cream, x, y, r * 2.8, .55 * a));
  ctx.fillStyle = rgba([244, 238, 222], a); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba([34, 28, 32], a); ctx.lineCap = 'round';
  const m = t * 7 + seed * 2.3, hh = m / 12 + seed;
  ctx.lineWidth = Math.max(.8, r * .14); line(x, y, x + Math.sin(m) * r * .74, y - Math.cos(m) * r * .74);
  ctx.lineWidth = Math.max(1, r * .18); line(x, y, x + Math.sin(hh) * r * .46, y - Math.cos(hh) * r * .46);
}
// clock faces drifting from `from` into `to` (its mouth); q: [n, rate, size]
const FEEDQ = { 1: [6, .42, 9], 2: [10, .6, 12], 3: [15, .8, 13], 4: [24, 1, 14], 5: [34, 1.5, 16] };
function hourStream(t, from, to, a, q) {
  if (a <= .01) return;
  const [n, rate, size] = q;
  for (let i = 0; i < n; i++) {
    const u = (t * rate + rnd(i + 900)) % 1;
    const c = [(from[0] + to[0]) / 2 + (rnd(i + 901) - .5) * 220, Math.min(from[1], to[1]) - 90 + (rnd(i + 902) - .5) * 160];
    const x = lerp(lerp(from[0], c[0], u), lerp(c[0], to[0], u), u) + Math.sin(u * 8 + i) * 12;
    const y = lerp(lerp(from[1], c[1], u), lerp(c[1], to[1], u), u) + Math.cos(u * 6 + i) * 9;
    const r = size * (.55 + .75 * Math.sin(Math.PI * Math.min(1, u * 1.25))) * (u > .82 ? (1 - u) / .18 : 1);
    hourClock(x, y, r, t, a * Math.min(1, u * 7), i);
  }
}
const mouthAt = (t, o) => devilMouth(t, o);

// ---------- his wall: a paper calendar losing months, a clock it spins ----------
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const CAL = [[0, 9, 14], [15.6, 11, 25], [24.6, 2, 3], [35.8, 5, 15], [67.2, 5, 16]];   // [from, month 0-11, day]
const calAt = t => { let c = CAL[0]; for (const x of CAL) if (t >= x[0]) c = x; return c; };
const CALX = 140, CALY = 300, CALW = 124, CALH = 150;
function calPage(x, y, w, h, mi, day, a, full = false, wd = '') {
  ctx.fillStyle = rgba([226, 220, 206], a); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = rgba([178, 34, 40], a); ctx.fillRect(x, y, w, h * .24);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  font(h * (full ? .11 : .15), SANS, '800'); ctx.fillStyle = rgba([255, 242, 232], a); ctx.fillText(full ? MONTH[mi] : MON[mi], x + w / 2, y + h * .125);
  font(h * .44, SANS, '800'); ctx.fillStyle = rgba([30, 26, 30], .92 * a); ctx.fillText(String(day), x + w / 2, y + h * (wd ? .56 : .6));
  if (wd) { font(h * (wd === 'SATURDAY' ? .11 : .08), SANS, '900'); ctx.fillStyle = rgba(wd === 'SATURDAY' ? [190, 30, 38] : [90, 84, 80], a); ctx.fillText(wd, x + w / 2, y + h * .8); }
  if (full) {                                  // the week's tiny grid under the number
    ctx.strokeStyle = rgba([120, 110, 100], .5 * a); ctx.lineWidth = Math.max(1, h * .004);
    for (let i = 0; i < 8; i++) line(x + w * (.1 + i * .8 / 7), y + h * .9, x + w * (.1 + i * .8 / 7), y + h * .96);
    line(x + w * .1, y + h * .9, x + w * .9, y + h * .9); line(x + w * .1, y + h * .96, x + w * .9, y + h * .96);
  }
}
const nextDay = (mi, d) => d < DAYS[mi] ? [mi, d + 1] : [(mi + 1) % 12, 1];
// the hands of his wall clock: spinning faster each night; after the drawer bites, an honest tick
const CLOCKT = [[61.5, 5 + 59 / 60], [67.2, 6], [81.9, 19 + 50 / 60], [87.1, 21 + 40 / 60], [98.8, 22.75]];
function handsAt(t) {
  if (t >= 61.5) {
    let hrs = CLOCKT[0][1], t0 = 61.5; for (const [a, v] of CLOCKT) if (t >= a) { hrs = v; t0 = a; }
    hrs += (t - t0) / 3600;
    return { h: hrs / 12, m: hrs % 1, s: Math.floor(t) / 60, tick: true };
  }
  const rate = t < 15.6 ? .25 : t < 24.6 ? .9 : t < 35.8 ? 1.6 : 2.6;
  return { h: 11.8 / 12 + t * rate / 12, m: t * rate, s: 0, tick: false };
}
function clockHands(cx, cy, r, t, a, ink, red = [210, 40, 40]) {
  const { h, m, s, tick } = handsAt(t), at = (k, L) => [cx + Math.sin(k * Math.PI * 2) * L, cy - Math.cos(k * Math.PI * 2) * L];
  ctx.strokeStyle = rgba(ink, a); ctx.lineCap = 'round';
  ctx.lineWidth = r * .1; line(cx, cy, ...at(h, r * .5));
  ctx.lineWidth = r * .07; line(cx, cy, ...at(m, r * .8));
  if (!tick) { ctx.strokeStyle = rgba(ink, .25 * a); line(cx, cy, ...at(m - .03, r * .8)); line(cx, cy, ...at(m - .06, r * .8)); }
  else { ctx.strokeStyle = rgba(red, a); ctx.lineWidth = r * .035; line(cx, cy, ...at(s, r * .86)); }
}
const WCX = 214, WCY = 196, WCR = 50;
// ---------- Grandpa's photo: a boy and his Grandpa (bucket hat, grey moustache) on a dock in the sun, holding up a fish.
// Drawn in a 100 x 120 box; the lake at the end is the same dock, grown up ----------
function photoScene(x, y, w, h, a = 1, faces = true) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.translate(x, y); ctx.scale(w / 100, h / 120); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, 0, 0, 120);
  g.addColorStop(0, 'rgb(150,194,228)'); g.addColorStop(.52, 'rgb(240,214,168)'); g.addColorStop(.53, 'rgb(84,128,156)'); g.addColorStop(1, 'rgb(44,82,110)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 100, 120);
  ctx.fillStyle = 'rgb(255,246,214)'; ctx.beginPath(); ctx.arc(82, 30, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgb(96,110,120)'; ctx.fillRect(0, 61.5, 100, 2.5);                     // the far shore
  ctx.fillStyle = 'rgb(255,236,190)'; for (let i = 0; i < 6; i++) ctx.fillRect(70 + (i % 3) * 5, 66 + i * 4, 9 - i, .9);   // the sun on the water
  ctx.fillStyle = 'rgb(92,62,42)'; ctx.fillRect(-2, 88, 88, 6); for (const px of [8, 38, 68]) ctx.fillRect(px, 94, 4, 30);   // the dock
  const ink = 'rgb(28,22,26)'; ctx.strokeStyle = ctx.fillStyle = ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  limb([[55, 88], [55, 72]], 6); limb([[61.5, 88], [61.5, 72]], 6); limb([[58, 73], [58, 51]], 15);   // Grandpa
  limb([[64, 54], [69, 64], [64, 70]], 4.2);
  limb([[52, 54], [45, 45], [44, 31]], 4.2);                                                           // ...holding up the fish
  ctx.beginPath(); ctx.arc(58, 42, 8, 0, Math.PI * 2); ctx.fill();
  limb([[28, 88], [28, 77]], 5); limb([[33, 88], [33, 77]], 5); limb([[30.5, 78], [30.5, 63]], 11);   // the boy
  limb([[34, 65], [39, 57], [41, 50]], 3.4); limb([[27, 66], [24, 73]], 3.4);
  ctx.beginPath(); ctx.arc(30.5, 55, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgb(186,198,206)'; ctx.beginPath(); ctx.ellipse(44, 42, 3.6, 10, .05, 0, Math.PI * 2); ctx.fill();   // the fish
  ctx.fillStyle = 'rgb(120,136,148)'; ctx.beginPath(); ctx.ellipse(45.2, 42, 1.3, 9, .05, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgb(160,172,182)'; ctx.beginPath(); ctx.moveTo(44.3, 51); ctx.lineTo(40.5, 56.5); ctx.lineTo(48, 56.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgb(54,50,40)'; ctx.beginPath(); ctx.ellipse(58, 36.4, 12.5, 2.6, -.05, 0, Math.PI * 2); ctx.fill();   // his hat
  ctx.beginPath(); ctx.moveTo(51, 36); ctx.quadraticCurveTo(51.5, 28.5, 58, 28.3); ctx.quadraticCurveTo(64.5, 28.5, 65, 36); ctx.closePath(); ctx.fill();
  if (faces) {
    face(58, 42.5, 8, { ...EXPR.smile, open: .3 }, { turn: .25, featA: 1 });
    ctx.fillStyle = 'rgb(226,224,218)'; ctx.beginPath(); ctx.ellipse(59.2, 45.4, 3.4, 1.1, 0, 0, Math.PI * 2); ctx.fill();   // grey moustache
    face(30.5, 55.5, 7, { ...EXPR.smile, open: .35 }, { turn: .45, featA: 1 });
  }
  ctx.restore();
}
function photoFramed(x, y, w, h, a = 1, faces = true) {          // a dark wooden frame, a white print border, the photo
  const b = w * .07;
  ctx.fillStyle = rgba([46, 30, 22], a); rrect(x, y, w, h, w * .03); ctx.fill();
  ctx.fillStyle = rgba([236, 230, 216], a); ctx.fillRect(x + b, y + b, w - 2 * b, h - 2 * b);
  photoScene(x + b * 1.6, y + b * 1.6, w - b * 3.2, h - b * 3.2, a, faces);
}
// where the photo is: on the nightstand; in its mouth (the reveal); face down on the nightstand; stood back up (the comeback)
const PHOTO_AT = [[0, 'stand'], [57.3, 'gone'], [62.75, 'down'], [85.0, 'stand']];
const photoAt = t => { let st = 'stand'; for (const [a, v] of PHOTO_AT) if (t >= a) st = v; return st; };
const NS = { x0: 466, x1: 566, y: 742 }, PHOTO_XY = [516, 716];   // the nightstand by the bed's head
function photoBack(x, y, w, h, a = 1) {                             // the frame face down: its brown back
  ctx.fillStyle = rgba([58, 40, 30], a); rrect(x, y, w, h, w * .03); ctx.fill();
  ctx.strokeStyle = rgba([24, 16, 12], a); ctx.lineWidth = Math.max(1, w * .02); ctx.strokeRect(x + w * .18, y + h * .18, w * .64, h * .64);
}
// what this film adds to his room: the clock, the calendar, the nightstand with its drawer and Grandpa's photo
function scrollProps(a, col) {
  const v = Math.min(1, a * 4.5), t = GT;
  ctx.fillStyle = rgba([200, 196, 186], .3 * v); ctx.beginPath(); ctx.arc(WCX, WCY, WCR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba(col, Math.min(1, a * 1.8)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(WCX, WCY, WCR, 0, Math.PI * 2); ctx.stroke();
  clockHands(WCX, WCY, WCR, t, v, [20, 18, 22]);
  const [, mi, d] = calAt(t);
  calPage(CALX, CALY, CALW, CALH, mi, d, .75 * v);
  ctx.strokeStyle = rgba(col, Math.min(1, a * 1.8)); ctx.lineWidth = 2; ctx.strokeRect(CALX, CALY, CALW, CALH);
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 2.5;
  ctx.strokeRect(NS.x0, NS.y, NS.x1 - NS.x0, 860 - NS.y); ctx.strokeRect(NS.x0 + 10, NS.y + 16, NS.x1 - NS.x0 - 20, 40);   // the nightstand, its drawer
  ctx.strokeRect(NS.x0 + 38, NS.y + 32, 24, 7);
  const st = photoAt(t);
  if (st === 'stand') { ctx.save(); ctx.globalAlpha = Math.min(1, v * 1.2); photoFramed(PHOTO_XY[0] - 24, PHOTO_XY[1] - 27, 48, 54, 1, false); ctx.restore(); }
  else if (st === 'down') { ctx.save(); ctx.globalAlpha = Math.min(1, v * 1.2); photoBack(PHOTO_XY[0] - 26, NS.y - 7, 52, 7); ctx.restore(); }
}

// ---------- the devil's grin opening and closing while it eats ----------
const chewO = (o, k, t) => { if (k > 0) o.scream = Math.max(o.scream, k * .3 * (.5 + .5 * Math.sin(t * 11))); return o; };

// ---------- his room at night (the engine's room, with the hours it eats, the calendar's pages, the cold feed light) ----------
// p: as the engine's room (spot, o(t), creep, hunch, lit, flicker, fr), plus feed 1-5 (the hours it eats: a few … a
// torrent), from 'chest', chew, tears [times a calendar page flies to its mouth], rip (Grandpa's photo flies into its
// mouth), back [a, b] (the hours stream back into him), drop (the photo falls out of its mouth), hold 'none', tetherCut.
// At the window it stands outside: it is drawn inside the window's glass, and the glass's bars over it
defShot('droom', (t, p, L) => {
  const fr = p.fr || ROOM_FR, flick = p.flicker ? .55 + .45 * Math.abs(Math.sin(t * 31) * Math.sin(t * 7.3)) : 1;
  fill([7, 9, 15], [12, 13, 24]);
  cam(...fr);
  drawWindow(0, .14 * flick);
  drawRoom(.14 * flick, [120, 150, 220]);
  const o = chewO(roomDevil(t, p, L), p.chew ?? (p.feed ? .8 : 0), t), lit = p.lit !== false && p.hold !== 'none';
  const outside = p.spot === 'window';
  if (outside) { ctx.save(); ctx.beginPath(); ctx.rect(302, 222, 256, 286); ctx.clip(); }
  if (o.a > 0) drawDevil(t, fr, o);
  if (outside) {
    if (o.eyes > 0) devilEyes(t, o);
    if (o.a > 0 || o.grin > 0) devilGrin(t, o);
    ctx.restore();
    ctx.strokeStyle = rgba(C.cream, .3 * flick); ctx.lineWidth = 3; line(430, 220, 430, 510); line(300, 365, 560, 365);
    const gl = ctx.createLinearGradient(300, 220, 560, 510); gl.addColorStop(.3, 'rgba(255,255,255,0)'); gl.addColorStop(.45, 'rgba(200,215,255,.07)'); gl.addColorStop(.6, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.fillRect(300, 220, 260, 290);
  }
  const P0 = poseSit(SIT.x, SIT.y, SIT.s, p.hunch ?? .65);
  if (o.a > .3 && !outside) tether(t, P0.parts[0][0][1], [DEVIL.x, DEVIL.y - 560 * DEVIL.s], o.a * (p.tetherCut ? 1 - inv(p.tetherCut, p.tetherCut + .25, t) : 1));
  const P = poseSit(SIT.x, SIT.y + Math.sin(t * 1.5) * 1.5, SIT.s, p.hunch ?? .65), [hx, hy] = P.hand;
  if (lit) additive(() => { glow(SPR.blue, hx, hy, 640, .3); glow(SPR.cream, hx, hy - 30, 240, .1); glow(SPR.red, hx, hy - 40, 300, .07); });
  drawPerson(P, [5, 5, 7], lit ? [150, 186, 255] : [120, 120, 140], lit ? .55 : .22, 1, .25);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), lit ? { turn: .9, light: ICE, la: .36, lc: [.4, .8] }
    : { turn: .9, light: [170, 180, 210], la: .14, lc: [-.6, -.3], featA: .75 });
  if (p.hold !== 'none') {                  // the phone in his hand
    ctx.save(); ctx.translate(hx, hy);
    ctx.fillStyle = '#0d0c0f'; rrect(-15, -26, 30, 50, 6); ctx.fill();
    if (lit) { rrect(-13, -23, 26, 44, 4); ctx.clip(); feedHand(t); }
    ctx.restore();
  }
  const mouth = mouthAt(t, o), chest = [P.parts[0][0][2][0] - 10, P.parts[0][0][2][1] + 60];
  if (p.feed && (o.a > .05 || o.eyes > .05)) hourStream(t, p.from === 'chest' ? chest : [hx, hy - 12], mouth, Math.min(1, .4 + o.a), FEEDQ[p.feed]);
  if (p.back) hourStream(t, mouth, chest, win(t, p.back[0], p.back[1], .15, .4), [26, 1.3, 14]);
  if (o.a > 0) devilArms(t, o);
  if (!outside && o.eyes > 0) devilEyes(t, o);
  if (!outside && (o.a > 0 || o.grin > 0)) devilGrin(t, o);
  if (p.rip && t > p.rip && t < p.rip + .5) {   // Grandpa's photo, torn off the nightstand into its mouth
    const k = (t - p.rip) / .5, e = E.io(k);
    ctx.save(); ctx.translate(lerp(PHOTO_XY[0], mouth[0], e), lerp(PHOTO_XY[1], mouth[1], e) - Math.sin(Math.PI * k) * 160); ctx.rotate(k * 6);
    ctx.scale(1.5 - 1.2 * k, 1.5 - 1.2 * k); photoFramed(-24, -27, 48, 54, 1, false); ctx.restore();
  }
  if (p.drop && t > p.drop && t < p.drop + .45) {   // ...and out again, face down onto the nightstand
    const k = (t - p.drop) / .45;
    ctx.save(); ctx.translate(lerp(mouth[0], PHOTO_XY[0], k), lerp(mouth[1], NS.y - 4, k * k)); ctx.rotate((1 - k) * 5);
    ctx.scale(1, lerp(1, .14, k)); photoBack(-26, -27, 52, 54); ctx.restore();
  }
  for (const t0 of p.tears || []) {          // a page tears off the calendar and flies into its mouth
    const k = inv(t0, t0 + .55, t); if (k <= 0 || k >= 1) continue;
    const [, mi, d] = calAt(t0), e = E.io(k), x = lerp(CALX + CALW / 2, mouth[0], e), y = lerp(CALY + CALH / 2, mouth[1], e) - Math.sin(Math.PI * k) * 120;
    ctx.save(); ctx.translate(x, y); ctx.rotate(k * 7); ctx.scale(1 - .7 * k, (1 - .7 * k) * Math.abs(Math.cos(k * 9)) + .1);
    calPage(-CALW / 2, -CALH / 2, CALW, CALH, mi, d, .95 * (1 - inv(.8, 1, k))); ctx.restore();
  }
  screen();
  if (o.a > .3) { ctx.fillStyle = rgba(C.red, .1 * o.a * (.6 + .4 * Math.sin(t * 5))); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L, len) => SHOT.room.subject(t, p, L, len));

// ---------- each night's card: the date big (months pass between nights), the time small under it ----------
defShot('dclock', (t, p, L = 1) => {
  fill([4, 5, 8]);
  additive(() => glow(SPR.blue, W / 2, 840, 760, .3 * (.92 + .08 * Math.sin(t * 11))));
  const t0 = t - L;
  if (!OUT.vertical) {
    screen(); const sz = fitSize(p.date, 200, 1700, 12, '200');
    slam(p.date, W / 2, 490, sz, [214, 224, 238], .95, t0, t, 12, '200');
    slam(p.label, W / 2, 490 + sz * .5 + 80, 64, [226, 96, 96], .92, t0 + .12, t, 14, '400');
  } else {
    ui(); const sz = fitSize(p.date, 200, 880, 8, '200');
    slam(p.date, OUT.w / 2, 900, sz, [214, 224, 238], .95, t0, t, 8, '200');
    slam(p.label, OUT.w / 2, 900 + sz * .5 + 100, 84, [226, 96, 96], .92, t0 + .12, t, 14, '400');
  }
});
// the title: DOOMSCROLLING is long, so both cards fit it to the width
defShot('sting', (t, p, L) => {
  fill([3, 3, 5]);
  additive(() => glow(SPR.red, W / 2, 540, 800, .4));
  if (!OUT.vertical) { const sz = fitSize(FILM.title, 250, 1760, 30, '800'); slam(FILM.title, W / 2, 540, sz, C.cream, 1, t - L, t, 30, '800', .4); }
  else { ui(); const sz = fitSize(FILM.title, 250, 900, 16, '800'); slam(FILM.title, OUT.w / 2, 960, sz, C.cream, 1, t - L, t, 16, '800', .4); }
});
defShot('title', (t, p) => {
  fill([3, 3, 5]);
  additive(() => glow(SPR.red, W / 2, 480, 700, .25));
  if (!OUT.vertical) {
    const sz = fitSize(FILM.title, 220, 1700, 26, '800');
    slam(FILM.title, W / 2, 480, sz, C.cream, 1, p.at, t, 26, '800', .25);
    slam(FILM.subtitle, W / 2, 610, 34, [230, 80, 80], .9, p.at + .5, t, 16, '600');
  } else {
    ui(); const sz = fitSize(FILM.title, 220, 900, 14, '800');
    slam(FILM.title, OUT.w / 2, 900, sz, C.cream, 1, p.at, t, 14, '800', .25);
    slam(FILM.subtitle, OUT.w / 2, 900 + sz * .62 + 40, fitSize(FILM.subtitle, 48, 860, 16, '600'), [230, 80, 80], .9, p.at + .5, t, 16, '600');
  }
});

// ---------- close: the calendar on his wall loses its pages to it, outside the dark window: Wednesday, Thursday, Friday,
// then the fishing Saturday hangs a beat and is the first page its grin snaps through the glass; then months, a blur ----------
const WD = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const CALSEQ = (() => { const out = []; let [mi, d] = [9, 14]; while (!(mi === 11 && d === 25)) { out.push([mi, d]); [mi, d] = nextDay(mi, d); } out.push([11, 25]); return out; })();
const wdOf = i => WD[(3 + i) % 7];                     // 14 October 2026 is a Wednesday
const tearAt = i => { const n = CALSEQ.length - 1; return i < 4 ? [.1, .2, .3, 1.0][i] : 1.14 + .6 * Math.pow((i - 4) / (n - 4), .8); };
const flyOf = i => i < 4 ? .42 : .3;
const CWIN = { x0: 1080, x1: 1720, y0: 110, y1: 790 };
defShot('calendar', (t, p, L) => {
  fill([10, 9, 14], [18, 12, 18]);
  cam(1, 960, 540);
  additive(() => glow(SPR.blue, 600, 1000, 900, .16));
  ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = 2;
  for (let x = -400; x < W + 400; x += 140) line(x, -300, x, H + 300);
  // the window: night outside, and it, behind the glass
  const { x0, x1, y0, y1 } = CWIN;
  ctx.fillStyle = '#05070f'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  additive(() => glow(SPR.red, 1400, 470, 620, .45 * (.85 + .15 * Math.sin(t * 6))));
  placeDevil([1480, 1520, 1.45]);           // its head in the top of the glass, the bar under its chin
  const snap = win(L, 1.3, 1.56, .05, .1);
  const o = devilO({ a: .95, eyes: 1, grin: 1, scream: .2 + .2 * Math.abs(Math.sin(t * 13)) + .45 * snap, lean: .1 });
  drawDevil(t, [1, 960, 540], o); devilEyes(t, o); devilGrin(t, o);
  ctx.restore();
  const mouth = mouthAt(t, o);
  ctx.strokeStyle = 'rgba(214,220,236,.55)'; ctx.lineWidth = 10; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.lineWidth = 8; line((x0 + x1) / 2, y0, (x0 + x1) / 2, y1); line(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2);
  const gl = ctx.createLinearGradient(x0, y0, x1, y1); gl.addColorStop(.3, 'rgba(255,255,255,0)'); gl.addColorStop(.45, 'rgba(200,215,255,.07)'); gl.addColorStop(.6, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  // the calendar
  const x = 300, y = 200, w = 470, h = 600;
  let shown = 0; while (shown < CALSEQ.length - 1 && L >= tearAt(shown)) shown++;
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(x + 18, y + 22, w, h);
  const [mi, d] = CALSEQ[shown], hang = shown === 3 ? win(L, .4, 1.0, .1, .05) : 0;   // SAT 17 shivers before it goes
  ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate(hang * .02 * Math.sin(t * 40)); calPage(-w / 2, 0, w, h, mi, d, 1, true, wdOf(shown)); ctx.restore();
  ctx.fillStyle = '#2a2a30'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(x + 44 + i * 55, y + 6, 9, 0, Math.PI * 2); ctx.fill(); }
  for (let i = 0; i <= shown && i < CALSEQ.length - 1; i++) {   // the pages it has torn, in flight to its mouth, through the glass
    const k = (L - tearAt(i)) / flyOf(i); if (k <= 0 || k >= 1) continue;
    const e = E.io(k), px = lerp(x + w / 2, mouth[0], e), py = lerp(y + h / 2, mouth[1], e) - Math.sin(Math.PI * k) * 170, sc = 1 - .85 * k;
    const through = px > x0 ? 1 - inv(x0, mouth[0], px) * .85 : 1;
    ctx.save(); ctx.translate(px, py); ctx.rotate(k * 3 + i * .3); ctx.scale(sc, sc * (.3 + .7 * Math.abs(Math.cos(k * 6 + i))));
    calPage(-w / 2, -h / 2, w, h, CALSEQ[i][0], CALSEQ[i][1], through, true, wdOf(i)); ctx.restore();
  }
}, () => [280, 100, 1730, 820]);

// ---------- close: Grandpa's photo on his nightstand. p.mode 'night': the phone's blue light flickers over it and a clock
// face drifts past it into the dark; 'standup': lamp light, his hand lifts it off the floor and stands it back up (p.at) ----------
defShot('photo', (t, p, L) => {
  const night = p.mode !== 'standup';
  fill(night ? [5, 7, 12] : [24, 16, 11], night ? [12, 14, 24] : [46, 30, 20]);
  cam(1, 960, 540);
  ctx.fillStyle = night ? '#0e0d13' : '#33221a';                  // the nightstand's top
  ctx.beginPath(); ctx.moveTo(-200, 1100); ctx.lineTo(2120, 1100); ctx.lineTo(1880, 790); ctx.lineTo(40, 790); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = night ? 'rgba(150,180,255,.25)' : 'rgba(255,200,140,.35)'; ctx.lineWidth = 3; line(40, 790, 1880, 790);
  if (night) additive(() => { glow(SPR.blue, 1560, 980, 1000, .4 * (.8 + .2 * Math.sin(t * 9))); glow(SPR.cream, 1500, 1000, 300, .12); });
  else additive(() => { glow(SPR.amber, 1620, 260, 1100, .5); glow(SPR.gold, 1640, 240, 140, .6); });
  const lift = night ? 1 : E.io(inv(p.at, p.at + .75, t)), cx = 930, base = 760, sy = lerp(.06, 1, lift);   // it stands up about its bottom edge
  ctx.save(); ctx.translate(cx, base); ctx.scale(1, sy); ctx.translate(0, -290);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; rrect(-230 + 26, -290 + 30, 460, 580, 14); ctx.fill();
  if (lift < .12) photoBack(-230, -290, 460, 580); else photoFramed(-230, -290, 460, 580, 1, true);
  if (night) { ctx.fillStyle = rgba(pc(Math.floor(feedPos(t))), .12); ctx.fillRect(-200, -260, 400, 520); }   // the feed's colours on the glass
  const gs = ctx.createLinearGradient(-230, -290, 230, 290); gs.addColorStop(.35, 'rgba(255,255,255,0)'); gs.addColorStop(.48, 'rgba(255,255,255,.1)'); gs.addColorStop(.6, 'rgba(255,255,255,0)');
  ctx.fillStyle = gs; ctx.fillRect(-200, -260, 400, 520);
  ctx.restore();
  if (night) { const u = clamp(L / 1.8); hourClock(lerp(1650, 250, u), 905 - 700 * u ** 3 + Math.sin(u * 7) * 14, 26 + 10 * Math.sin(Math.PI * u), t, Math.sin(Math.PI * u), 3); }
  else {                                                            // his hand, from the right: lifts it, lets go, and goes
    const off = E.io(inv(p.at + .95, p.at + 1.45, t)), side = base - 580 * sy * .55;   // it holds the frame's side, then lets go
    mittR(cx + 236 + 560 * off, side + 40 * off, .08, .82, 'back', [10, 7, 6], [255, 204, 146], .5);
  }
}, () => [640, 140, 1220, 800]);

// ---------- close: its face; Grandpa's photo spins in, big, and its teeth snap shut on it (p { at: when it bites }) ----------
defShot('photoeat', (t, p, L) => {
  const bite = p.at, open = win(t, bite - .55, bite, .12, .02);
  SHOT.devilface.draw(t, { spot: 'behind', o: () => ({ grin: 1, lean: 1, scream: .95 * open }) }, L);
  screen();
  const k = clamp((t - (bite - .62)) / .62), e = E.io(k);
  if (k < 1) {
    ctx.save(); ctx.translate(lerp(560, 975, e), lerp(820, 720, e) - Math.sin(Math.PI * k) * 60); ctx.rotate(-.35 + 1.4 * k); ctx.scale(lerp(.85, .08, e * e), lerp(.85, .08, e * e));
    photoFramed(-230, -290, 460, 580, 1, true); ctx.restore();
  }
  const u = t - bite;
  if (u > 0 && u < .3) { ctx.fillStyle = rgba(C.red, .4 * (1 - u / .3)); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L) => SHOT.devilface.subject(t, { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }, L));

// ---------- close: his wall clock; its claw reaches in and spins the hands (p { touch }) ----------
function claw(wr, close, a = 1) {             // its arm reaching in from the upper right, four long fingers curling
  const sh = [2300, -260], el = [lerp(2000, wr[0] + 300, .55), lerp(-40, wr[1] - 330, .55)];
  ctx.save(); ctx.strokeStyle = '#020102'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = a;
  ctx.shadowColor = rgba(C.red, .95); ctx.shadowBlur = 34 * VP.k;
  limb([sh, el, wr], 62);
  for (let f = 0; f < 4; f++) {
    const ang = Math.PI * .86 + (f - 1.5) * .26, L = 190 + (f % 2) * 30, cl = close * 1.5;
    const k1 = [wr[0] + Math.cos(ang) * L * .55, wr[1] + Math.sin(ang) * L * .55];
    const tp = [k1[0] + Math.cos(ang - .45 - cl) * L * .55, k1[1] + Math.sin(ang - .45 - cl) * L * .55];
    ctx.lineWidth = 17; ctx.beginPath(); ctx.moveTo(wr[0], wr[1]); ctx.lineTo(k1[0], k1[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke();
    ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(tp[0], tp[1]); ctx.lineTo(tp[0] + Math.cos(ang - .9 - cl) * 26, tp[1] + Math.sin(ang - .9 - cl) * 26); ctx.stroke();
  }
  ctx.restore();
}
defShot('wallclock', (t, p, L) => {
  fill([9, 8, 11], [22, 11, 15]);
  cam(1, 960, 540);
  additive(() => { glow(SPR.red, 1560, 160, 1000, .42 * (.85 + .15 * Math.sin(t * 6))); glow(SPR.blue, 600, 1000, 700, .12); });
  const cx = 880, cy = 560, r = 320, sp = Math.max(0, t - p.touch);
  ctx.fillStyle = '#0e0c10'; ctx.beginPath(); ctx.arc(cx + 14, cy + 20, r + 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#26222a'; ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, Math.PI * 2); ctx.fill();
  const g = ctx.createRadialGradient(cx - 80, cy - 100, 40, cx, cy, r); g.addColorStop(0, '#ece4cf'); g.addColorStop(1, '#b4aa92');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a2428'; ctx.lineCap = 'round';
  for (let i = 0; i < 60; i++) { const k = i / 60 * Math.PI * 2, big = i % 5 === 0; ctx.lineWidth = big ? 9 : 3; line(cx + Math.sin(k) * r * (big ? .84 : .9), cy - Math.cos(k) * r * (big ? .84 : .9), cx + Math.sin(k) * r * .95, cy - Math.cos(k) * r * .95); }
  font(64, SANS, '600'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2a2428';
  [['12', 0], ['3', .25], ['6', .5], ['9', .75]].forEach(([n, k]) => ctx.fillText(n, cx + Math.sin(k * Math.PI * 2) * r * .68, cy - Math.cos(k * Math.PI * 2) * r * .68 + 3));
  const m0 = .12, m = m0 + sp * .6 + sp * sp * 1.6, hh = (2 + m) / 12;     // it flicks the minute hand: the hours whirl
  const at = (k, Lh) => [cx + Math.sin(k * Math.PI * 2) * Lh, cy - Math.cos(k * Math.PI * 2) * Lh];
  if (sp > .1) for (let j = 1; j < 6; j++) { ctx.strokeStyle = `rgba(40,30,34,${.14 * (6 - j) / 5})`; ctx.lineWidth = 16; line(cx, cy, ...at(m - j * .025 * Math.min(1, sp * 2), r * .8)); }
  ctx.strokeStyle = '#1a1518'; ctx.lineWidth = 26; line(cx, cy, ...at(hh, r * .52));
  ctx.lineWidth = 16; line(cx, cy, ...at(m, r * .8));
  ctx.strokeStyle = 'rgb(196,36,40)'; ctx.lineWidth = 5; line(cx, cy, ...at(t * (sp > 0 ? 4 : .2), r * .86));
  ctx.fillStyle = '#1a1518'; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
  const sh = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);       // the glass
  sh.addColorStop(.3, 'rgba(255,255,255,0)'); sh.addColorStop(.42, 'rgba(255,255,255,.12)'); sh.addColorStop(.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  additive(() => glow(SPR.red, cx + r * .6, cy - r * .5, r * .9, .25));
  const tip = at(m0, r * .8), reach = E.io(inv(p.touch - .5, p.touch - .04, t)), flick = E.out(inv(p.touch, p.touch + .25, t));
  const home = [tip[0] + 165, tip[1] - 168], wr = [lerp(2050, home[0], reach) + 60 * flick, lerp(-300, home[1], reach) - 40 * flick];
  claw(wr, .15 * flick);
}, () => [520, 200, 1400, 920]);

// ---------- night 3: Grandpa calls; his thumb comes down on Decline (p.tap); the feed again ----------
defShot('incall', (t, p, L) => {
  fill([3, 3, 5]);
  const f = phoneFrame(L), { s, w, h, x, y } = f, done = t >= p.tap + .15;
  additive(() => { glow(done ? SPR.red : SPR.cream, W / 2, H / 2, 900, done ? .25 : .14); glow(SPR.blue, W / 2, H / 2, 700, .12); });
  ctx.fillStyle = '#0c0c10'; rrect(x - 16 * s, y - 16 * s, w + 32 * s, h + 32 * s, 66 * s); ctx.fill();
  ctx.fillStyle = '#040406'; rrect(x, y, w, h, 52 * s); ctx.fill();
  const dx = x + w * .27, ax = x + w * .73, by = y + 700 * s;
  if (!done) {
    ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1c3326'); g.addColorStop(1, '#07100b');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    statusClock(x, y, s, statusAt(t));
    for (let k = 0; k < 3; k++) {                    // rings: it is ringing
      const q = (L * .9 + k / 3) % 1; ctx.strokeStyle = rgba([150, 230, 170], .45 * (1 - q)); ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.arc(x + w / 2, y + 270 * s, (84 + 80 * q) * s, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = rgba(C.cream, .18); ctx.beginPath(); ctx.arc(x + w / 2, y + 270 * s, 84 * s, 0, Math.PI * 2); ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    font(66 * s, SANS, '300'); ctx.fillStyle = rgba(C.cream, .9); ctx.fillText('G', x + w / 2, y + 272 * s);
    font(42 * s, SANS, '500'); ctx.fillText('Grandpa', x + w / 2, y + 418 * s);
    font(21 * s, SANS, '400'); ctx.fillStyle = rgba([150, 230, 170]); ctx.fillText('incoming call…', x + w / 2, y + 466 * s);
    const press = win(t, p.tap - .05, p.tap + .15, .03, .05);
    for (const [bx, col, ang, lab] of [[dx, [228, 58, 58], 2.36, 'Decline'], [ax, [52, 196, 104], 0, 'Accept']]) {
      const sc = bx === dx ? 1 - .12 * press : 1;
      ctx.fillStyle = rgba(bx === dx && press > 0 ? [255, 110, 110] : col); ctx.beginPath(); ctx.arc(bx, by, 44 * s * sc, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(bx, by); ctx.rotate(ang); icon('phone', 0, 0, 40 * s); ctx.restore();
      font(19 * s, SANS, '600'); ctx.fillStyle = rgba(C.cream, .85); ctx.fillText(lab, bx, by + 78 * s);
    }
    ctx.restore();
  } else {
    FILM.viceScreen(x, y, w, h, s, t, 1, 0);
    const k = win(t, p.tap + .15, p.tap + 1.4, .1, .3);
    ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(70,10,16,.95)'; rrect(x + 60 * s, y + h - 150 * s, w - 120 * s, 56 * s, 28 * s); ctx.fill();
    font(21 * s, SANS, '700'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([255, 150, 150]); ctx.fillText('Call declined', x + w / 2, y + h - 122 * s); ctx.restore();
  }
  if (t < p.tap + .45) {                             // his thumb, coming down on Decline, then away
    const k = E.io(inv(p.tap - .75, p.tap - .04, t)), up = E.io(inv(p.tap + .12, p.tap + .45, t));
    const tx = lerp(x + w * .9, dx + 6 * s, k) + 60 * s * up, ty = lerp(y + h + 120 * s, by + 18 * s, k) + 220 * s * up;
    ctx.fillStyle = 'rgba(150,186,255,.5)'; ctx.beginPath(); ctx.ellipse(tx + 4 * s, ty + 4 * s, 46 * s, 62 * s, -.35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgb(9,8,11)'; ctx.beginPath(); ctx.ellipse(tx, ty, 44 * s, 60 * s, -.35, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx + 20 * s, ty + 30 * s); ctx.lineTo(tx + 140 * s, ty + 260 * s); ctx.lineTo(tx + 40 * s, ty + 300 * s); ctx.lineTo(tx - 30 * s, ty + 50 * s); ctx.closePath(); ctx.fill();
  }
}, phoneSubject);

// ---------- his face a notch older each night: heavy bags, a grey streak at the temple, grey temples and a forehead line;
// young again once the hours stream back into him ----------
const AGE = [[0, 0], [21.1, .2], [33.6, .4], [41.5, .6], [63.4, 0]];
const ageAt = t => { let k = 0; for (const [a, v] of AGE) if (t >= a) k = v; return k; };
function ageMarks(x, y, r, turn, k) {
  if (k <= .01) return;
  const ey = y - .05 * r, e1 = x + r * lerp(-.36, .27, turn), e2 = x + r * lerp(.36, .7, turn);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(C.cream, .38 * Math.min(1, k * 3)); ctx.lineWidth = .016 * r;
  for (const ex of [e1, e2]) { ctx.beginPath(); ctx.arc(ex, ey + .11 * r, .1 * r, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
  const g = clamp((k - .3) / .3);
  if (g > 0) {                                   // grey at the temple, spreading back over the side of his head
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    const gx = x - r * .5, gy = y - r * .42, rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * (.35 + .4 * g));
    rg.addColorStop(0, rgba([196, 196, 202], .42 * g)); rg.addColorStop(1, rgba([196, 196, 202], 0));
    ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.strokeStyle = rgba([222, 222, 228], .62); ctx.lineWidth = .014 * r;
    const n = Math.round(6 + 16 * g), a0 = Math.PI * (1.28 - .1 * g), a1 = Math.PI * (1.36 + .26 * g);
    for (let i = 0; i < n; i++) {
      const u = (i + .5) / n, rr = r * (.8 + .17 * rnd(i + 40)), ang = lerp(a0, a1, u), span = .1 + .08 * rnd(i + 41);
      ctx.beginPath(); ctx.arc(x, y, rr, ang - span, ang + span); ctx.stroke();
    }
    ctx.restore();
  }
  const l = clamp((k - .5) / .1);
  if (l > 0) {
    ctx.strokeStyle = rgba(C.cream, .5 * l); ctx.lineWidth = .016 * r;
    for (const dy of [-.46, -.55]) { ctx.beginPath(); ctx.moveTo(e1 - .12 * r, y + dy * r); ctx.quadraticCurveTo((e1 + e2) / 2, y + (dy - .045) * r, e2 + .06 * r, y + dy * r); ctx.stroke(); }
  }
  ctx.restore();
}
{ const base = faceShot; faceShot = (t, look, ex) => {   // eslint-disable-line no-global-assign
  base(t, look, ex);
  const k = ageAt(t); if (k > 0) { const [x, y, r] = FACE_XY(t); ageMarks(x, y, r, LOOKS[look].turn, k); }
}; }

// ---------- the black glass (the engine's, with p.age [a, b]: his reflection grows old while he watches, and p.dspot:
// where it leans in) ----------
function agedExpr(ex, k) { return mixExpr(ex, { ...ex, lid: .55, brow: .45, browH: -.02, smile: -.5, gy: .45 }, k); }
function agedLines(x, y, r, k, a, ry = 1.33) {   // grey hair and lines, in the reflection's own faint cream (ry: the head's height / r)
  if (k <= .01) return;
  ctx.save(); ctx.lineCap = 'round';
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, r, r * ry, 0, 0, Math.PI * 2); ctx.clip();   // the head's top goes grey
  const hg = ctx.createLinearGradient(0, y - r * 1.35, 0, y - r * .2);
  hg.addColorStop(0, rgba([220, 220, 224], .62 * k * a)); hg.addColorStop(1, rgba([186, 186, 192], .4 * k * a));
  ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(x - r * 1.1, y - r * .15); ctx.lineTo(x - r * 1.1, y - r * 1.5); ctx.lineTo(x + r * 1.1, y - r * 1.5); ctx.lineTo(x + r * 1.1, y - r * .15);
  ctx.quadraticCurveTo(x + r * .86, y - r * .5, x + r * .62, y - r * .6); ctx.quadraticCurveTo(x + r * .3, y - r * .78, x, y - r * .72);   // a receding hairline
  ctx.quadraticCurveTo(x - r * .3, y - r * .78, x - r * .62, y - r * .6); ctx.quadraticCurveTo(x - r * .86, y - r * .5, x - r * 1.1, y - r * .15); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba([236, 236, 240], .5 * k * a); ctx.lineWidth = r * .022;
  for (let i = 0; i < 16; i++) { const u = x - r * .8 + i * r * 1.6 / 15; ctx.beginPath(); ctx.moveTo(u, y - r * 1.36); ctx.quadraticCurveTo(u + r * .08, y - r * 1.0, u + r * .02 * (i % 3 - 1), y - r * (.66 + .1 * rnd(i + 20))); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(C.cream, .5 * k * a); ctx.lineWidth = r * .022;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - r * (.42 - i * .04), y - r * (.52 - i * .085)); ctx.quadraticCurveTo(x, y - r * (.58 - i * .085), x + r * (.42 - i * .04), y - r * (.52 - i * .085)); ctx.stroke(); }
  for (const sd of [-1, 1]) {
    const ex = x + sd * r * .36;
    for (let i = -1; i <= 1; i++) line(ex + sd * r * .14, y - r * .05 + i * r * .05, ex + sd * r * .26, y - r * .05 + i * r * .09);
    ctx.beginPath(); ctx.arc(ex, y + r * .02, r * .13, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + sd * r * .14, y + r * .14); ctx.quadraticCurveTo(x + sd * r * .32, y + r * .34, x + sd * r * .26, y + r * .58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + sd * r * .5, y + r * .5); ctx.quadraticCurveTo(x + sd * r * .44, y + r * .76, x + sd * r * .24, y + r * .86); ctx.stroke();
  }
  ctx.restore();
}
defShot('reflection', (t, p) => {
  fill([3, 3, 5]);
  const s = 1.02, w = 430 * s, h = 860 * s, x = W / 2 - w / 2, y = H / 2 - h / 2;
  ctx.fillStyle = '#0c0c10'; rrect(x - 16 * s, y - 16 * s, w + 32 * s, h + 32 * s, 66 * s); ctx.fill();
  ctx.fillStyle = '#040406'; rrect(x, y, w, h, 52 * s); ctx.fill();
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const da = p.appear ? E.sine(inv(p.appear, p.appear + 1, t)) : 1, fr = [.9, 846, 517], age = p.age ? E.io(inv(p.age[0], p.age[1], t)) : 0;
  placeDevil(p.dspot || 'behind');
  if (da > 0) {
    const o = devilO({ a: .85 * da, eyes: da, grin: p.appear ? inv(p.appear + 1.4, p.appear + 2.4, t) : 1, reach: .5 + .3 * age, lean: 1 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  }
  screen();
  ctx.fillStyle = rgba(C.cream, .035 + .03 * age);
  ctx.beginPath(); ctx.ellipse(W / 2, y + h * .5, 120 * s, 160 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(W / 2, y + h * .93, 260 * s, 150 * s, 0, Math.PI, 0); ctx.fill();
  face(W / 2, y + h * .5, 120 * s, agedExpr(exprAt(t), age), { turn: 0, featA: .42 + .3 * age });
  agedLines(W / 2, y + h * .5, 120 * s, age, 1);
  const sg = ctx.createLinearGradient(x, y, x + w, y + h);
  sg.addColorStop(.35, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.05)'); sg.addColorStop(.65, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  ctx.restore();
}, () => { const s = 1.02, w = 430 * s, h = 860 * s; return [W / 2 - w / 2 - 20, H / 2 - h / 2 - 20, W / 2 + w / 2 + 20, H / 2 + h / 2 + 20]; });

// ---------- hands, close: the same dark silhouette as his body, with a rim of the light he is in ----------
// local units: the wrist at (0, 0), the fingers toward +x, the forearm running back along -x off the frame.
function mitt(x, y, ang, k, part, fillC, rimC, rimA, lx = 0, ly = -1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pass = (col, ex, dx, dy) => {
    ctx.save(); ctx.translate(dx, dy); ctx.strokeStyle = ctx.fillStyle = col;
    if (part === 'back') {
      ctx.lineWidth = 118 + ex; ctx.beginPath(); ctx.moveTo(-1400, 40); ctx.lineTo(-20, 4); ctx.stroke();
      rrect(-50 - ex / 2, -60 - ex / 2, 180 + ex, 122 + ex, 56); ctx.fill();
      ctx.beginPath(); ctx.ellipse(124, 16, 46 + ex / 2, 50 + ex / 2, .2, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(118 - i * 6, 44 + i * 16, 30 + ex / 2, 17 + ex / 2, .3, 0, Math.PI * 2); ctx.fill(); }
    } else { ctx.lineWidth = 40 + ex; ctx.beginPath(); ctx.moveTo(30, -46); ctx.quadraticCurveTo(100, -70, 158, -58); ctx.stroke(); }
    ctx.restore();
  };
  pass(rgba(rimC, rimA), 9, lx * 6, ly * 6); pass(rgba(fillC), 0, 0, 0);
  ctx.restore();
}
function mittR(x, y, ang, k, part, fillC, rimC, rimA) {   // a right hand coming in from the right edge
  ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); mitt(W - x, y, ang, k, part, fillC, rimC, rimA, .3, -1); ctx.restore();
}
function deadPhone(w, h, a = 1, lit = 0) {        // centred
  ctx.fillStyle = rgba([14, 13, 17], a); rrect(-w / 2, -h / 2, w, h, w * .16); ctx.fill();
  ctx.fillStyle = rgba(mix([4, 4, 6], [40, 90, 200], lit), a); rrect(-w / 2 + w * .06, -h / 2 + w * .06, w * .88, h - w * .12, w * .12); ctx.fill();
}

// ---------- close: his desk drawer. p.mode 'slam': he throws the phone in and slams it shut on its claws (p.drop, p.at);
// 'buzz': shut in the dark, the phone buzzing inside, cold light at the seam, then it slides open by itself (p.open) ----------
const DRW = { x0: 560, x1: 1360, y: 440, h: 260 };
defShot('drawer', (t, p, L) => {
  const slamM = p.mode === 'slam';
  fill(slamM ? [10, 6, 8] : [5, 6, 10], slamM ? [26, 10, 12] : [10, 12, 20]);
  cam(1, 960, 540);
  if (slamM) additive(() => { glow(SPR.red, 1600, 60, 1100, .45 * (.85 + .15 * Math.sin(t * 6))); glow(SPR.red, 960, 300, 700, .12); });
  ctx.fillStyle = slamM ? '#2a1e1a' : '#16121a';                          // the nightstand's top, seen from just above
  ctx.beginPath(); ctx.moveTo(420, 380); ctx.lineTo(1500, 380); ctx.lineTo(1430, 320); ctx.lineTo(490, 320); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = slamM ? 'rgba(255,120,110,.35)' : 'rgba(150,170,220,.18)'; ctx.lineWidth = 3; line(420, 380, 1500, 380);
  ctx.fillStyle = slamM ? '#1a1311' : '#0e0c11'; ctx.fillRect(440, 380, 1040, 900);  // its front
  ctx.strokeStyle = 'rgba(255,255,255,.025)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) line(490 + i * 115, 400, 484 + i * 115, 1100);
  if (!slamM && photoAt(t) === 'stand') {         // Grandpa's photo, standing on top again, in the leaking light
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(1196, 186, 150, 170);
    photoFramed(1186, 176, 150, 176, 1, true);
    ctx.fillStyle = 'rgba(40,70,140,.28)'; ctx.fillRect(1186, 176, 150, 176);
  }
  // how far open: 'slam' starts open and slams at p.at; 'buzz' starts shut, rattles, and slides open at p.open
  let d, jit = 0;
  if (slamM) { d = Math.pow(1 - inv(p.at - .1, p.at, t), 2) + (t > p.at ? .02 * Math.sin((t - p.at) * 60) * Math.exp(-(t - p.at) * 12) : 0); }
  else {
    const buzz = t < p.open && Math.sin(t * 9) > -.2 ? 1 : 0; jit = buzz * Math.sin(t * 170) * 4;
    d = .38 * E.out(inv(p.open, p.open + .45, t));
  }
  const sc = 1 + .2 * d, fy = DRW.y + 340 * d, fw = (DRW.x1 - DRW.x0) * sc, fh = DRW.h * sc, fx = 960 - fw / 2 + jit;
  ctx.fillStyle = '#050405'; ctx.fillRect(DRW.x0 - 6, DRW.y - 6, DRW.x1 - DRW.x0 + 12, DRW.h + 12);    // the slot
  if (d > .01) {                                  // inside the open drawer
    ctx.fillStyle = slamM ? '#120c0c' : '#0a0c14';
    ctx.beginPath(); ctx.moveTo(DRW.x0, DRW.y); ctx.lineTo(DRW.x1, DRW.y); ctx.lineTo(fx + fw - 18, fy); ctx.lineTo(fx + 18, fy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 3; line(DRW.x0 + 14, DRW.y + 6, fx + 32, fy - 4); line(DRW.x1 - 14, DRW.y + 6, fx + fw - 32, fy - 4);
  }
  const lightA = slamM ? 0 : (t < p.open ? (Math.sin(t * 9) > -.2 ? .9 : .35) : 1);
  if (!slamM) additive(() => {                    // the feed's cold light, leaking out
    glow(SPR.blue, 960 + jit, DRW.y + (d > .01 ? 140 * d : 0), 380 + 900 * d, (.35 + .9 * d) * lightA);
    if (d < .02) for (let i = 0; i < 9; i++) glow(SPR.blue, DRW.x0 + 60 + i * 85 + jit, DRW.y, 60, .55 * lightA);
  });
  if (slamM && t > p.drop) {                       // the phone, thrown in, face down
    const k = clamp((t - p.drop) / .22), px = lerp(470, 930, k), py = lerp(250, DRW.y + 150, k) - Math.sin(Math.PI * k) * 90;
    if (d > .05 || k < 1) { ctx.save(); ctx.translate(px, py); ctx.rotate(-.6 + k * 2.2); ctx.scale(1, lerp(1, .45, k)); deadPhone(150, 280); ctx.restore(); }
  }
  // its claws: they dive into the drawer after the phone, and the drawer bites them
  if (slamM) {
    const dive = E.io(inv(p.drop + .05, p.at - .08, t)), caught = t >= p.at && t < p.at + .32, yank = E.io(inv(p.at + .32, p.at + .62, t));
    const home = [1070, 395], wr = t < p.at ? [lerp(1900, home[0], dive), lerp(-320, home[1] - 40 + 60 * dive, dive)]
      : [lerp(home[0], 1700, yank) + (caught ? Math.sin(t * 90) * 6 : 0), lerp(home[1], -500, yank) + (caught ? Math.cos(t * 70) * 5 : 0)];
    if (dive > 0 && yank < 1) claw(wr, caught ? .25 + .2 * Math.sin(t * 50) : yank > 0 ? .9 : .1);
  }
  // the front of the drawer and its handle (drawn over the claws: shut, it hides their tips)
  ctx.fillStyle = slamM ? '#2c201b' : '#17141c'; rrect(fx, fy, fw, fh, 10); ctx.fill();
  ctx.strokeStyle = slamM ? 'rgba(255,140,120,.3)' : 'rgba(150,170,230,.18)'; ctx.lineWidth = 3; rrect(fx, fy, fw, fh, 10); ctx.stroke();
  ctx.fillStyle = slamM ? '#8a8690' : '#4c4a56'; rrect(960 - 120 * sc + jit, fy + fh * .44, 240 * sc, 26 * sc, 13 * sc); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.25)'; rrect(960 - 110 * sc + jit, fy + fh * .44 + 4, 220 * sc, 6 * sc, 3); ctx.fill();
  if (!slamM && d > .1) {                            // ...and its fingers curl over the front's edge, from inside
    const k = inv(p.open + .25, p.open + .6, t);
    ctx.save(); ctx.strokeStyle = '#020102'; ctx.lineCap = 'round'; ctx.shadowColor = rgba(C.red, .9); ctx.shadowBlur = 24 * VP.k;
    for (let f = 0; f < 4; f++) {                  // up over the top edge, then hooked down the front, to a point
      const bx = 800 + f * 58 + (f % 2) * 6, rise = 34 + 8 * (f % 2), tip = 70 + 14 * ((f + 1) % 3);
      ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(bx, fy + 4); ctx.lineTo(bx - 4, fy - rise * k); ctx.quadraticCurveTo(bx + 10, fy - (rise + 18) * k, bx + 22, fy - rise * .4 * k); ctx.stroke();
      ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(bx + 22, fy - rise * .4 * k); ctx.lineTo(bx + 26, fy + tip * k * .6); ctx.stroke();
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx + 26, fy + tip * k * .6); ctx.lineTo(bx + 24, fy + tip * k); ctx.stroke();
    }
    ctx.restore();
  }
  if (slamM) {
    const thr = 1 - E.io(inv(p.drop, p.drop + .35, t));          // his left hand throws; his right hand slams it shut
    mitt(lerp(300, 120, 1 - thr), lerp(330, 420, 1 - thr), .35, 1.05, 'back', [8, 6, 7], [255, 120, 110], .45, .4, -1);
    if (t < p.drop + .02) { ctx.save(); ctx.translate(470, 250); ctx.rotate(-.6); deadPhone(150, 280); ctx.restore(); }
    mitt(lerp(300, 120, 1 - thr), lerp(330, 420, 1 - thr), .35, 1.05, 'thumb', [8, 6, 7], [255, 120, 110], .45, .4, -1);
    const push = E.io(inv(p.at - .3, p.at, t)), back = E.io(inv(p.at + .3, p.at + .6, t));
    const hx = lerp(1720, fx + fw - 160, push) + 260 * back, hy = lerp(1000, fy + fh * .5, push) + 120 * back;
    mittR(hx, hy, -.25, 1.15, 'back', [8, 6, 7], [255, 120, 110], .45);
    const u = t - p.at;
    if (u > 0 && u < .45) additive(() => {
      glow(SPR.cream, 960, DRW.y, 900, 1.1 * (1 - u / .45));
      for (let i = 0; i < 20; i++) glow(i % 2 ? SPR.red : SPR.amber, 960 + (rnd(i + 300) - .5) * 1100 * u * 2, DRW.y + (rnd(i + 301) - .6) * 260 * u * 2, 7 + 6 * rnd(i), 1 - u / .45);
    });
  }
}, () => [460, 220, 1460, 900]);

// ---------- 8:00 PM: a book under the lamp instead of the feed ----------
defShot('read', (t, p, L) => {
  const fr = p.fr || [1.3, 1000, 560];
  fill([22, 16, 14], [40, 28, 22]);
  cam(...fr);
  drawWindow(.12, .2); drawRoom(.24, [226, 186, 136]);
  const lx = 1330;                                   // a floor lamp beside the bed
  ctx.strokeStyle = '#100c0a'; ctx.lineWidth = 10; line(lx, 860, lx, 420);
  ctx.fillStyle = '#2c2016'; ctx.beginPath(); ctx.moveTo(lx - 70, 430); ctx.lineTo(lx + 70, 430); ctx.lineTo(lx + 44, 350); ctx.lineTo(lx - 44, 350); ctx.closePath(); ctx.fill();
  additive(() => { glow(SPR.amber, lx, 440, 760, .5); glow(SPR.gold, lx, 432, 120, .9); });
  const P = poseSit(SIT.x, SIT.y + Math.sin(t * 1.2) * 1.2, SIT.s, .32), [hx, hy] = P.hand;
  drawPerson(P, [12, 9, 8], [255, 204, 146], .55, 1, -.3);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), { turn: .9, light: [255, 214, 156], la: .4, lc: [.6, -.2] });
  ctx.save(); ctx.translate(hx + 8, hy - 26); ctx.rotate(-.42);   // the open book, tilted up to his eyes
  ctx.fillStyle = '#5a1c1c'; ctx.beginPath(); ctx.moveTo(-62, 6); ctx.lineTo(62, 6); ctx.lineTo(58, -40); ctx.lineTo(-58, -40); ctx.closePath(); ctx.fill();
  for (const sd of [-1, 1]) {
    ctx.fillStyle = 'rgb(240,230,208)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sd * 58, 2); ctx.lineTo(sd * 55, -42); ctx.quadraticCurveTo(sd * 26, -48, 0, -40); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(80,70,60,.45)'; ctx.lineWidth = 1.6; for (let i = 0; i < 5; i++) line(sd * 8, -32 + i * 6.5, sd * 48, -32 + i * 6.5);
  }
  const k = inv(.5, 1.05, L);                        // a page turns
  if (k > 0 && k < 1) {
    const c = Math.cos(Math.PI * k);
    ctx.fillStyle = `rgba(${c > 0 ? '246,238,220' : '226,214,190'},1)`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(c * 56, 2 - 14 * Math.sin(Math.PI * k)); ctx.lineTo(c * 53, -44 - 14 * Math.sin(Math.PI * k)); ctx.lineTo(0, -40); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}, (t, p) => toScreenBox(p.fr || [1.3, 1000, 560], [820, 380, 1240, 880]));

// ---------- weeks later: dawn on a lake, fishing with Grandpa; no phones ----------
function bucketHat(x, y, r, col, rim) {
  ctx.fillStyle = rgba(rim, .6); ctx.beginPath(); ctx.ellipse(x + 3, y - r * .55, r * 1.42, r * .3, -.06, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba(col); ctx.beginPath(); ctx.ellipse(x, y - r * .5, r * 1.38, r * .26, -.06, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - r * .86, y - r * .5); ctx.quadraticCurveTo(x - r * .8, y - r * 1.32, x, y - r * 1.34); ctx.quadraticCurveTo(x + r * .8, y - r * 1.32, x + r * .86, y - r * .5); ctx.closePath(); ctx.fill();
}
defShot('lake', (t, p, L) => {
  const fr = p.fr || [1, 960, 540], HZ = 600;
  fill([44, 40, 84], [255, 170, 118]);
  cam(...fr);
  additive(() => { glow(SPR.gold, 1420, HZ - 40, 900, .55); glow(SPR.amber, 1420, HZ, 420, .6); });
  ctx.save(); ctx.beginPath(); ctx.rect(-600, -600, W + 1200, HZ + 600); ctx.clip();
  ctx.fillStyle = 'rgb(255,232,182)'; ctx.beginPath(); ctx.arc(1420, HZ + 10, 78, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgb(70,46,72)'; ctx.beginPath(); ctx.moveTo(-600, HZ + 2);   // the far shore
  for (let x = -600; x <= W + 600; x += 30) ctx.lineTo(x, HZ - 22 - 26 * Math.abs(Math.sin(x * .004 + 1)) - 12 * Math.sin(x * .013));
  ctx.lineTo(W + 600, HZ + 2); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, HZ, 0, H); g.addColorStop(0, 'rgb(150,100,112)'); g.addColorStop(1, 'rgb(28,24,44)');
  ctx.fillStyle = g; ctx.fillRect(-600, HZ, W + 1200, H + 400);
  for (let i = 0; i < 46; i++) {                  // the sun's road on the water
    const dpt = rnd(i + 500), y = HZ + 6 + dpt * dpt * 470, hw = 20 + dpt * 210 * rnd(i + 501);
    ctx.fillStyle = rgba([255, 214, 150], (.25 + .5 * rnd(i + 502)) * (.6 + .4 * Math.sin(t * 3 + i))); ctx.fillRect(1420 - hw + (rnd(i + 503) - .5) * 80, y, hw * 2 * rnd(i + 504) + 10, 2 + dpt * 3);
  }
  additive(() => { for (let i = 0; i < 9; i++) glow(SPR.grey, ((i * 260 + t * 18) % (W + 400)) - 200, HZ + 30 + (i % 3) * 26, 300, .14); });
  ctx.fillStyle = '#17121a'; ctx.fillRect(-300, 780, 1560, 34);                    // the dock and its posts
  for (const x of [80, 420, 760, 1100]) ctx.fillRect(x, 812, 26, 400);
  ctx.strokeStyle = 'rgba(255,200,140,.45)'; ctx.lineWidth = 3; line(-300, 780, 1260, 780);
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 2; for (let x = -280; x < 1260; x += 64) line(x, 782, x, 812);
  const rim = [255, 206, 150];
  const rod = (P, len, ang, bob) => {             // a rod from his hands, its line down into the water
    const [hx, hy] = P.hand, tx = hx + Math.cos(ang) * len, ty = hy + Math.sin(ang) * len;
    ctx.strokeStyle = '#1a1416'; ctx.lineWidth = 7; ctx.lineCap = 'round'; line(hx, hy, tx, ty);
    ctx.strokeStyle = 'rgba(255,230,190,.55)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 90, ty + 120, tx + 110, HZ + 150 + bob); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,230,190,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(tx + 110, HZ + 152 + bob, 18, 4, 0, 0, Math.PI * 2); ctx.stroke();
  };
  const G = poseSit(1010, 780, 1.2, .42), M = poseSit(740, 780, 1.08, .3);
  rod(M, 300, -.7, Math.sin(t * 2.4 + 1) * 3);
  const gs = G.parts[3][0][0], up = E.out(inv(.15, .7, L)), fh = [gs[0] + lerp(40, -95, up), gs[1] - lerp(20, 175, up)];   // the fish goes up, between them
  G.parts[3] = [[gs, [gs[0] + lerp(40, 10, up), gs[1] - lerp(10, 105, up)], fh], 24 * 1.2];
  ctx.strokeStyle = '#1a1416'; ctx.lineWidth = 7; ctx.lineCap = 'round'; line(G.hand[0] - 20, G.hand[1] + 30, G.hand[0] + 210, G.hand[1] - 230);   // his rod, leaning
  drawPerson(G, [14, 10, 14], rim, .6, 1, -.3);
  ctx.save(); ctx.translate(fh[0], fh[1] + 66); ctx.rotate(Math.sin(t * 5) * .08);                // the fish, silver in the sun
  ctx.fillStyle = 'rgb(196,204,212)'; ctx.beginPath(); ctx.ellipse(0, 0, 17, 52, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgb(130,142,152)'; ctx.beginPath(); ctx.ellipse(6, 0, 6, 46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgb(170,180,190)'; ctx.beginPath(); ctx.moveTo(0, 46); ctx.lineTo(-20, 78); ctx.lineTo(20, 78); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-4, -36, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore(); additive(() => glow(SPR.gold, fh[0], fh[1] + 60, 90, .35));
  bucketHat(G.head[0], G.head[1], G.head[2], [40, 36, 30], rim);
  const laugh = win(L, .3, 9, .3, .1);            // Grandpa turns to him and laughs
  ctx.save(); ctx.translate(G.head[0] * 2, 0); ctx.scale(-1, 1);
  face(G.head[0], G.head[1], G.head[2], mixExpr(EXPR.calm, { ...EXPR.smile, open: .3, lid: .5 }, laugh), { turn: lerp(.2, .75, laugh), light: rim, la: .3, lc: [-.6, -.2] });
  const mx = G.head[0] + G.head[2] * lerp(.08, .33, laugh), my = G.head[1] + G.head[2] * .34;
  ctx.fillStyle = rgba([226, 222, 214], .95); ctx.beginPath(); ctx.ellipse(mx, my, G.head[2] * .2, G.head[2] * .07, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(206,204,200,.8)'; ctx.lineWidth = G.head[2] * .16; ctx.beginPath(); ctx.arc(G.head[0], G.head[1], G.head[2] * .9, -.55, .45); ctx.stroke();   // grey hair under the hat
  ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.beginPath(); ctx.ellipse(G.head[0] + G.head[2] * .7, G.head[1] - G.head[2] * .12, G.head[2] * .2, G.head[2] * .3, 0, 0, Math.PI * 2); ctx.fill();
  drawPerson(M, [10, 8, 11], rim, .55, 1, -.3);
  face(M.head[0], M.head[1], M.head[2], exprAt(t), { turn: .95, light: rim, la: .36, lc: [.7, -.2] });
}, (t, p) => toScreenBox(p.fr || [1, 960, 540], [600, 300, 1500, 920]));

// ---------- weeks later: the mirror; in the dark doorway behind him its eyes open, and its claw holds out a glowing
// phone that scrolls by itself (p { eyes: [a, b], phone, fr }) ----------
function smallGrin(cx, cy, gw, a, col = [210, 20, 30]) {
  if (a <= .01) return;
  const h = gw * .5;
  ctx.fillStyle = rgba(col, a);
  ctx.beginPath(); ctx.moveTo(cx - gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .25, cx + gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .8, cx - gw / 2, cy); ctx.fill();
  ctx.fillStyle = rgba([255, 236, 226], a * .85);
  for (let i = 0; i < 11; i++) { const u = cx - gw * .4 + i * gw * .8 / 10; ctx.beginPath(); ctx.moveTo(u - gw * .02, cy + h * .1); ctx.lineTo(u + gw * .02, cy + h * .1); ctx.lineTo(u, cy + h * .26); ctx.fill(); }
}
defShot('dmirror', (t, p, L) => {
  fill([150, 156, 166], [112, 118, 128]);
  cam(...(p.fr || [1, 960, 540]));
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2;
  for (let x = -600; x < W + 600; x += 120) line(x, -400, x, H + 400);
  for (let y = -400; y < H + 400; y += 120) line(-600, y, W + 600, y);
  const mx = W / 2, my = 520, mw = 980, mh = 700;
  ctx.fillStyle = '#5a5f68'; rrect(mx - mw / 2 - 18, my - mh / 2 - 18, mw + 36, mh + 36, 30); ctx.fill();
  ctx.save(); rrect(mx - mw / 2, my - mh / 2, mw, mh, 22); ctx.clip();
  const g = ctx.createLinearGradient(0, my - mh / 2, 0, my + mh / 2); g.addColorStop(0, '#2d323b'); g.addColorStop(1, '#1b1f26');
  ctx.fillStyle = g; ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
  const dx = mx + 250, dy = my - 260;
  ctx.fillStyle = '#030304'; ctx.fillRect(dx, dy, 170, 560);
  const ea = win(t, p.eyes[0], p.eyes[1], .2, .01);
  if (ea > 0) { additive(() => glow(SPR.red, dx + 85, dy + 160, 220, .35 * ea)); redEyes(dx + 85, dy + 140, 16, ea); }
  if (p.phone && ea > 0) {
    const k = E.out(inv(p.phone, p.phone + .5, t)), px = dx + 60 - 50 * k, py = dy + 340, pa = ea * k;
    additive(() => { glow(SPR.blue, px, py - 20, 200, .7 * pa); glow(SPR.blue, dx + 85, dy + 200, 160, .35 * pa); });
    smallGrin(dx + 88, dy + 196, 64, .9 * pa, [120, 150, 230]);
    ctx.save(); ctx.translate(px, py); ctx.rotate(-.18); ctx.globalAlpha = pa;
    ctx.strokeStyle = '#000'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = rgba(C.red, .9); ctx.shadowBlur = 14 * VP.k;
    ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(24, 8); ctx.quadraticCurveTo(96, 24, 158, -46); ctx.stroke();   // its arm, out of the dark
    ctx.lineWidth = 7; for (let f = 0; f < 4; f++) { const fy = -30 + f * 19; ctx.beginPath(); ctx.moveTo(26, 6); ctx.lineTo(4, fy); ctx.stroke(); }   // fingers behind the phone
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0d0c10'; rrect(-24, -44, 48, 88, 8); ctx.fill();
    ctx.save(); rrect(-20, -40, 40, 80, 6); ctx.clip(); ctx.fillStyle = 'rgb(8,10,16)'; ctx.fillRect(-20, -40, 40, 80);
    const pos = (t * 2.6) % 1;
    for (let i = -1; i < 4; i++) { ctx.fillStyle = rgba(pc(Math.floor(t * 2.6) + i)); ctx.fillRect(-16, -26 + (i - pos) * 26, 32, 20); }
    ctx.fillStyle = rgba(BLUE); ctx.fillRect(-20, -40, 40, 9); ctx.restore();
    ctx.strokeStyle = '#000'; ctx.shadowColor = rgba(C.red, .9); ctx.shadowBlur = 10 * VP.k;   // ...their long tips hooked round its edge
    for (let f = 0; f < 4; f++) { const fy = -30 + f * 19; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-18, fy - 6); ctx.lineTo(-27, fy); ctx.lineTo(-24, fy + 9); ctx.stroke(); }
    ctx.restore();
  }
  const hx = mx - 60, hy = my + 30, r = 190;
  ctx.fillStyle = '#121418';
  ctx.beginPath(); ctx.ellipse(hx, hy + r * 2, r * 1.6, r * 1.05, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(hx - r * .34, hy + r * .55, r * .6, r * .9);
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  const old = p.blink && t >= p.blink[0] && t < p.blink[1];
  face(hx, hy, r, old ? agedExpr(EXPR.shock, .6) : exprAt(t), { turn: 0, light: old ? [255, 120, 120] : [240, 236, 228], la: .3, lc: [0, -.1], featA: old ? 1 : .92 });
  if (old) agedLines(hx, hy, r, 1, 1.3, 1);
  ctx.restore();
  const sh = ctx.createLinearGradient(mx - mw / 2, 0, mx + mw / 2, 0);
  sh.addColorStop(.2, 'rgba(255,255,255,0)'); sh.addColorStop(.3, 'rgba(255,255,255,.06)'); sh.addColorStop(.4, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh; ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
  if (old) { screen(); ctx.fillStyle = 'rgba(160,0,10,.22)'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p) => toScreenBox(p.fr || [1, 960, 540], [W / 2 - 300, 220, W / 2 + 470, 870]));

// the engine's phone, pushed in toward the part of the screen that matters (p.focus: the y of the push's centre)
defShot('gphone', (t, p, L) => {
  const pcx = PC;
  if (!OUT.vertical && p.focus) PC = [W / 2, p.focus];
  SHOT.phone.draw(t, p, L);
  PC = pcx;
}, (t, p, L) => SHOT.phone.subject(t, p, L));

// the code-drawn thumbnail: the topic word across the top, its face on the right eating his hours, his face lit blue
defShot('thumb', (t, p) => {
  const q = Object.assign({ word: FILM.title, hook: '', expr: 'fear' }, p || FILM.thumb || {});
  fill([10, 4, 8], [60, 8, 14]);
  additive(() => { glow(SPR.red, 1350, 620, 1100, .55); glow(SPR.blue, 520, 980, 760, .45); });
  placeDevil([1240, 2910, 2.9]);
  const o = devilO({ a: 1, eyes: 1, grin: 1, scream: .35, lean: .1, smoke: .25 }), fr = [1, W / 2, H / 2];
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  screen();
  hourStream(3.3, [700, 980], mouthAt(t, o), 1, [16, .5, 26]);
  const x = 560, y = 800, r = 230;
  ctx.fillStyle = rgba([140, 180, 255], .55); ctx.beginPath(); ctx.arc(x + 8, y - 4, r + 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba([8, 6, 10]);
  ctx.beginPath(); ctx.ellipse(x - 20, y + r * 2.05, r * 1.7, r * 1.15, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - r * .36, y + r * .55, r * .62, r * .9);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  face(x, y, r, EXPR[q.expr], { turn: .7, light: ICE, la: .5, lc: [.6, .7] });
  px(); drawVignetteFlat(.5); screen();
  const big = (txt, x0, y0, size, track) => {
    font(size, SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if ('letterSpacing' in ctx) ctx.letterSpacing = track + 'px';
    ctx.shadowColor = 'rgba(255,20,30,.95)'; ctx.shadowBlur = size * .22;
    ctx.lineWidth = size * .16; ctx.strokeStyle = 'rgb(200,10,24)'; ctx.strokeText(txt, x0, y0);
    ctx.shadowBlur = 0; ctx.lineWidth = size * .07; ctx.strokeStyle = '#000'; ctx.strokeText(txt, x0, y0);
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x0, y0);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  };
  font(300, SANS, '900'); const size = Math.min(300, 300 * 1780 / ctx.measureText(q.word).width);
  big(q.word, W / 2, 40 + size * .55, size, 2);
  if (q.hook) big(q.hook, W / 2, 40 + size * 1.1 + 60, Math.min(96, size * .5), 2);
});

// the feed's cold light on his face (its colour slides with the posts), the lamp's warm light
LOOKS.feed = { bg: [[5, 8, 14], [12, 18, 32]], fill: [5, 6, 9], la: .36, lc: [.45, .75], glow: 'blue', gl: [1220, 1080], ga: .5, rim: [160, 196, 255], turn: .9,
  get light() { return mix(ICE, pc(Math.floor(feedPos(GT))), .3); } };

const AGEW = [52.5, 56.4], SHOULDER = [560, 1205, 1];   // the reflection grows old over the long push-in; it leans over his shoulder
defineFilm({
  title: 'DOOMSCROLLING', subtitle: 'IT EATS YOUR HOURS', dur: 117.6,
  app: { name: 'FEED', label: 'FEED', icon: 'feed', color: [52, 112, 240] },
  viceScreen: feedScreen,
  handScreen: feedHand,
  roomProps: scrollProps,
  thumb: { word: 'DOOMSCROLLING', hook: 'IT EATS YOUR HOURS', expr: 'fear' },   // the code-drawn fallback; ChatGPT's replaces it from the Mac
  phases: [
    { name: 'Cold open', a: 0, b: 4 },
    { name: 'Night 1', a: 4, b: 15.6 },
    { name: 'Nights 2–4', a: 15.6, b: 48.4 },
    { name: 'It shows itself', a: 48.4, b: 67.2 },
    { name: 'He fights back', a: 67.2, b: 101.8 },
    { name: 'Weeks later', a: 101.8, b: 117.6 }
  ],
  // the devil's words on screen (there is no narration): kind whispers until the phone dies, then its real voice. A
  // banner on his phone is always alone: the whisper comes on the shot before or after it and is gone before it arrives.
  words: [
    { id: 'W01', t: .1, d: 1.7, text: 'You said five minutes… how many hours did it eat?', show: false },   // the cold line has its own type
    { id: 'W02', t: 5.1, d: 1.8, text: 'Five more minutes. It’s early.' },
    { id: 'W03', t: 8, d: 1.3, text: 'There’s always more.' },
    { id: 'W04', t: 12.1, d: 1.7, text: 'He has plenty of Saturdays.' },
    { id: 'W05', t: 19.3, d: 1.9, text: 'You’ll go next year.' },
    { id: 'W06', t: 22.1, d: 1.6, text: 'Nobody’s counting.' },
    { id: 'W07', t: 29.7, d: 1.1, text: 'He’s fine. Call tomorrow.' },
    { id: 'W08', t: 39.1, d: 2.2, text: 'You have all the time in the world.' },
    { id: 'W09', t: 45.4, d: 2.9, text: 'five more minutes… five more minutes…', show: false },   // the montage writes it
    { id: 'W10', t: 49.7, d: 2, text: 'You weren’t killing time.', real: true },
    { id: 'W11', t: 52.3, d: 2, text: 'I was eating you.', real: true },
    { id: 'W12', t: 54.8, d: 2, text: 'Look what’s left of you.', real: true },
    { id: 'W13', t: 57.3, d: 1.7, text: 'He doesn’t have years.', real: true },
    { id: 'W14', t: 62.2, d: 1.4, text: '(it screams)' },
    { id: 'W15', t: 68.2, d: 1.7, text: 'You’re missing everything.' },
    { id: 'W16', t: 71.6, d: 2, text: 'You’re wasting your time.' },
    { id: 'W17', t: 91.3, d: 1.2, text: 'Five more minutes…' },
    { id: 'W18', t: 95.2, d: 1.1, text: '(it shrieks)' },
    { id: 'W19', t: 100, d: 1.3, text: 'You’ll get bored.' },
    { id: 'W20', t: 107.8, d: 1.9, text: 'Just scroll.', real: true }
  ],
  slams: [3.35, 57, 61.5, 67.2, 91.3, 111.9, 114],          // moments that hit: each shakes the frame
  glitch: [[3.35, 3.95, 1], [48.1, 48.4, .9], [49, 49.4, 1], [54.55, 54.75, .8], [61.5, 62, 1], [65, 65.6, .7], [91.3, 91.6, .8], [95.2, 95.6, .7],
    [108.3, 108.5, .9], [109.5, 110.1, 1]],
  flash: { clock: [255, 255, 255], dclock: [255, 255, 255], devilface: [255, 60, 60], sting: [255, 60, 60], calendar: [255, 255, 255], wallclock: [255, 60, 60], photoeat: [255, 60, 60] },
  vignette: [[0, .75], [67.2, .75], [67.9, .5], [87.1, .55], [101.8, .75]],
  heartbeat: [[48.4, 54.6], [59.3, 60.9]],
  // his face, beat by beat
  expr: [[0, 'glazed'], [19.2, 'tired'], [27.5, 'ashamed'], [33.6, 'empty'], [41.5, 'ashamed'], [43.7, 'empty'], [49.4, 'glazed'],
    [52.4, 'fear'], [54.8, 'shock'], [60.2, 'resolve'], [67.9, 'strain'], [71.1, 'focus'], [76.3, 'strain'], [81.1, 'calm'], [82.5, 'focus'],
    [86.2, 'smile'], [87.1, 'calm'], [91.4, 'strain'], [93, 'resolve'], [96.4, 'calm'], [103.2, 'smile'], [105.6, 'calm']],
  // the cut: [start, shot, settings]
  shots: [
    [0, 'cold', { lines: [[COLD1, .1, .7], ['…' + COLD, .8, 1.6]], out: [1.9, 2.05] }],
    [2.05, 'droom', { fr: [2.05, 360, 400], spot: 'window', tears: [2.15], chew: 0, o: t => ({ eyes: win(t, 2.4, 3.5, .25, .01), a: .5 * win(t, 2.4, 3.5, .35, .01), grin: .9 * win(t, 2.5, 3.05, .1, .2), scream: .6 * win(t, 2.6, 2.8, .05, .08) }) }],
    [3.35, 'sting'],
    // night 1: October; it watches from outside the window and eats its first hours; Grandpa asks; it eats the Saturday
    [4, 'dclock', { label: '11:37 PM', date: 'OCTOBER 14' }],
    [5, 'phone', { screen: 'vice' }],
    [7, 'face', 'feed'],
    [8, 'droom', { spot: 'window', feed: 1, o: t => ({ a: .45 + .2 * inv(8, 9.8, t), eyes: .9, grin: .45 }) }],
    [9.8, 'gphone', { z: 1.18, focus: 300, screen: 'vice', notif: [10, GRANDPA, 'Grandpa', 'Fishing Saturday? Like old times'], swipe: 11.6 }],
    [12, 'photo', { mode: 'night' }],
    [13.8, 'calendar', {}],
    // night 2: Christmas; at the foot of the bed, it eats; Grandpa waited
    [15.6, 'dclock', { label: '12:52 AM', date: 'DECEMBER 25' }],
    [16.6, 'gphone', { z: 1.18, focus: 300, screen: 'vice', notif: [17.3, 'mom', 'Mom', 'Merry Christmas. Grandpa waited.'], swipe: 19 }],
    [19.2, 'droom', { spot: 'foot', creep: 40, hunch: .72, feed: 2, tears: [20.1], o: () => ({ a: .7, eyes: 1, grin: .55 }) }],
    [21.1, 'face', 'feed'],
    [22, 'devilface', { spot: 'foot', o: t => ({ a: .8, grin: .6, lean: .3, scream: .25 * (.5 + .5 * Math.sin(t * 11)) }) }],
    [23.5, 'droom', { fr: [2.2, 975, 640], spot: 'foot', hunch: .72, feed: 2, o: () => ({ a: .7, eyes: 1, grin: .55 }) }],
    // night 3: March; its claw spins his clock; Grandpa in the hospital; his call declined; it is beside him
    [24.6, 'dclock', { label: '2:31 AM', date: 'MARCH 3' }],
    [25.6, 'wallclock', { touch: 26.1 }],
    [27.4, 'gphone', { z: 1.18, focus: 300, screen: 'vice', notif: [27.5, 'mom', 'Mom', 'Grandpa’s in the hospital. Call!'], swipe: 29.2 }],
    [29.6, 'droom', { spot: 'beside', creep: 30, hunch: .82, feed: 3, o: t => ({ a: .85, eyes: 1, grin: .6, lean: .5 + .5 * inv(29.6, 31.5, t) }) }],
    [31.5, 'incall', { tap: 32.7 }],
    [33.6, 'face', 'night'],
    [34.6, 'devilface', { spot: 'beside', o: t => ({ a: .9, grin: .8, lean: 1, scream: .25 * (.5 + .5 * Math.sin(t * 11)) }) }],
    // night 4: June; right behind him, its hands on his shoulders, a torrent of hours; "months"
    [35.8, 'dclock', { label: '4:07 AM', date: 'JUNE 15' }],
    [36.8, 'gphone', { z: 1.18, focus: 300, screen: 'vice', notif: [36.95, GRANDPA, 'Grandpa', 'Haven’t seen you in months, kid.'], swipe: 38.8 }],
    [39, 'droom', { spot: 'behind', hunch: .9, feed: 4, o: t => ({ a: 1, eyes: 1, grin: .7, reach: .2 + .45 * inv(39, 41.2, t), lean: 1 }) }],
    [41.5, 'face', 'night'],
    [42.5, 'devilface', { spot: 'behind', o: t => ({ grin: 1, lean: 1, scream: .3 * (.5 + .5 * Math.sin(t * 11)) }) }],
    [43.7, 'droom', { fr: [1.6, 960, 700], spot: 'behind', hunch: .9, feed: 4, o: () => ({ a: 1, eyes: 1, grin: .85, reach: .65, lean: 1 }) }],
    // everything it took, faster and faster
    [45.4, 'montage', { step: .375, word: 'five more minutes', seq: [
      ['phone', { notif: [GRANDPA, 'Grandpa', 'Fishing Saturday? Like old times'] }], ['phone', { notif: ['mom', 'Mom', 'Merry Christmas. Grandpa waited.'] }],
      ['phone', { notif: ['mom', 'Mom', 'Grandpa’s in the hospital. Call!'] }], ['face', { look: 'feed', expr: 'empty' }],
      ['clock', ['4:39 AM', '5:16 AM', '5:52 AM']], ['devilface', { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }],
      ['phone', { notif: [GRANDPA, 'Grandpa', 'Haven’t seen you in months, kid.'] }], ['face', { look: 'red', expr: 'empty' }]] }],
    // it shows itself
    [48.4, 'phone', { screen: 'vice', dying: DEAD }],
    [49.4, 'reflection', { appear: 49.7 }],
    [52, 'reflection', { z: 1.3, age: AGEW, dspot: SHOULDER }],
    [54.6, 'reflection', { z: 1.85, age: AGEW, dspot: SHOULDER }],
    [57, 'droom', { spot: 'behind', hunch: .55, flicker: true, feed: 5, from: 'chest', rip: 57.3, o: t => ({ a: 1, eyes: 1, grin: 1, reach: .7 + .3 * inv(57, 58.4, t), lean: 1 }) }],
    [58.4, 'photoeat', { at: 59.05 }],
    [59.3, 'face', 'red'],
    [60.9, 'drawer', { mode: 'slam', drop: 61.05, at: 61.5 }],
    [62.1, 'droom', { spot: 'behind', hunch: .2, flicker: true, hold: 'none', tetherCut: 62.2, back: [62.2, 63.6], drop: 62.3, chew: 0, o: t => ({ a: 1, eyes: 1, grin: 1 - inv(62.2, 62.55, t),
      scream: inv(62.2, 62.45, t), reach: .9 - .9 * inv(62.2, 62.7, t), lean: 1 - 1.6 * inv(62.2, 62.9, t) }) }],
    [64.1, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .65 * inv(64.1, 65.6, t), eyes: 1 - .5 * inv(64.7, 65.6, t), scream: 1 - inv(64.9, 65.6, t), lean: -.6 }) }],
    [65.6, 'droom', { spot: 'window', hunch: .3, lit: false, hold: 'none', o: t => ({ eyes: .45 * win(t, 65.9, 67.2, .3, .2) }) }],
    // he fights back: the music turns here
    [67.2, 'clock', '6:00 AM'],
    [67.9, 'pushups'],
    [69.7, 'face', 'dawn'],
    [70.5, 'clock', '6:20 AM'],
    [71.1, 'run', { fr: [1, 960, 540], run: RUN }], [72.25, 'run', { fr: [2.4, 760, 740], run: RUN }],
    [73.4, 'run', { fr: [1.9, 800, 470], run: RUN }], [74.55, 'run', { fr: [1, 960, 540], run: RUN }],
    [75.7, 'clock', '7:05 AM'],
    [76.3, 'gym', { move: 'pullup', fr: [1.15, 960, 520] }],
    [77.9, 'gym', { move: 'squat', fr: [1.35, 900, 640] }],
    [79.5, 'gym', { move: 'curl', fr: [1.75, 960, 650] }],
    [81.1, 'face', 'gym'],
    [81.9, 'clock', '7:50 PM'],
    [82.5, 'read', {}],
    [84.2, 'photo', { mode: 'standup', at: 84.4 }],
    [86.2, 'face', 'lamp'],
    [87.1, 'clock', '9:40 PM'],
    [87.8, 'drawer', { mode: 'buzz', open: 88.75 }],
    [89.4, 'gphone', { z: 1.18, focus: 300, screen: 'home', notif: [89.5, 'vice', 'FEED', 'You missed 99+ new posts'] }],
    [91.3, 'devilface', { spot: 'behind', scare: true, o: () => ({ grin: 1, lean: 1 }) }],
    [92.1, 'face', 'red'],
    [93, 'gphone', { z: 1.2, focus: 480, screen: 'home', del: 93 }],
    [95.2, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .7 * inv(95.2, 96.4, t), scream: 1, lean: -.6 }) }],
    [96.4, 'phone', { z: 1.15, screen: 'chat', chat: { name: 'Grandpa', items: [
      { at: -1, text: 'Fishing Saturday? Like old times', y: 150 },
      { at: .2, text: 'Is that offer still open?', me: true, y: 260 },
      { at: .7, text: '•••', until: 1.2, fade: 0, y: 330 },
      { at: 1.2, text: 'Always. 6 AM.', fade: .15, y: 330 },
      { at: 1.5, text: '♥', fade: .15, col: [200, 50, 90] }] } }],
    [98.8, 'clock', '10:45 PM'],
    [99.4, 'sleep', { eyes: [100.2, 101.6] }],
    // weeks later: the dock from the photo; the mirror; the phone in the dark doorway
    [101.8, 'card', 'WEEKS LATER'],
    [103.2, 'lake', {}],
    [105.6, 'dmirror', { eyes: [200, 201] }],
    [107.4, 'dmirror', { fr: [1.55, 1150, 480], eyes: [107.5, 109.8], phone: 107.6, blink: [108.3, 108.5] }],
    [109.8, 'black'],
    [110.3, 'end', { line: COLD, typeAt: 110.4, slam: 'NOT ENOUGH.', slamAt: 111.9 }],
    [113.8, 'title', { at: 114 }]
  ]
});
