'use strict';
// FILM 04: GAMBLING | The House Always Wins (1:52). The house style of LUST (films/03-lust), with this film's own device:
// a betting app called HOUSE (an invented logo: a roof with one red eye), and a devil that DEALS: every night it is
// closer (the window, the foot of the bed, beside him, behind him with its hands on his shoulders) and the cards it
// deals pile up on his floor. It takes the rent, his sister's college fees and his mother's gold chain; the screen fills
// with zeros and the black glass shows it behind him: "I AM THE HOUSE." He snaps his bank card in half, every card
// burns, and at 6:00 AM the music turns: push-ups, the run, a double shift at the warehouse, the gym; on payday it
// attacks and he deletes the app. Weeks later a coin flips in the dark doorway: "Double or nothing?"
// Story and critique: STORY.md. Music: music.json, mix.py.

const COLD1 = 'EVERY NIGHT YOU BET…', COLD = 'WHO DO YOU THINK IS DEALING?';
const RUN = [70.1, 74.9];
const GOLD = [232, 184, 76], FELT = [12, 46, 30], LOSS = [236, 58, 58];
let GT = 0;                                   // the film time of the frame being drawn (roomProps is not given it)
{ const base = renderFilm; renderFilm = t => { GT = t; return base(t); }; }   // eslint-disable-line no-global-assign

// ---------- money: what the HOUSE app shows, by film time ----------
const usd = v => (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = v => (v < 0 ? '−$' : '+$') + Math.abs(v).toLocaleString('en-US');
const BAL = [[0, 1240], [5.9, 1240], [6.2, 1540], [16.2, 1540], [16.55, 440], [26.5, 440], [26.75, 840], [27.4, 840], [27.75, 0]];
const DELTA = [[5.9, 300], [16.2, -1100], [26.5, 400, 'deposit'], [27.4, -840]];
// the hands the table deals: [from, player, dealer, result time, 'win' | 'lose', the bet button, which button he presses]
const HANDS = [[0, ['10', 'Q'], ['9', '8'], 5.9, 'win', 'BET $300', 'bet'], [9.6, ['7', '5'], ['K'], 0, '', 'BET $500', ''],
  [15, ['9', '6'], ['A', 'K'], 16.2, 'lose', 'BET $1,100', 'bet'], [23.8, ['8', '4'], ['10', 'J'], 27.4, 'lose', 'ALL IN', 'dbl'],
  [34.5, [], [], 0, '', 'ALL IN', '']];
const BROKE = 34.5;                           // night 4: nothing left, the card declined
const handAt = t => { let h = HANDS[0]; for (const x of HANDS) if (t >= x[0]) h = x; return h; };
const STATUS = [[0, '11:53'], [15, '12:48'], [23.8, '2:17'], [30.4, '2:24'], [34.5, '3:59'], [44.9, '4:21'], [46.4, '5:13'], [88.1, '9:46']];
const statusAt = t => { let s = STATUS[0][1]; for (const x of STATUS) if (t >= x[0]) s = x[1]; return s; };

// a drawn checkmark (no font has to carry it)
function tick(cx, cy, sz, col, a = 1, lw = .16) {
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = sz * lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx - sz * .38, cy); ctx.lineTo(cx - sz * .1, cy + sz * .28); ctx.lineTo(cx + sz * .42, cy - sz * .3); ctx.stroke();
}
// the HOUSE logo: a gold tile, a roof, one red eye under it
function houseLogo(cx, cy, sz, a = 1) {
  ctx.fillStyle = rgba(GOLD, a); rrect(cx - sz / 2, cy - sz / 2, sz, sz, sz * .24); ctx.fill();
  ctx.strokeStyle = rgba([24, 16, 6], a); ctx.lineWidth = sz * .1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx - sz * .3, cy - sz * .02); ctx.lineTo(cx, cy - sz * .3); ctx.lineTo(cx + sz * .3, cy - sz * .02); ctx.stroke();
  ctx.fillStyle = rgba([150, 10, 20], a); ctx.beginPath(); ctx.ellipse(cx, cy + sz * .14, sz * .2, sz * .075, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba([255, 214, 120], a); ctx.beginPath(); ctx.ellipse(cx, cy + sz * .14, sz * .03, sz * .065, 0, 0, Math.PI * 2); ctx.fill();
}
// a card pip: a diamond (red) or a spade (black), drawn as shapes
function pip(cx, cy, sz, red, a = 1) {
  ctx.fillStyle = red ? rgba([205, 30, 40], a) : rgba([20, 20, 24], a);
  if (red) { ctx.beginPath(); ctx.moveTo(cx, cy - sz * .5); ctx.lineTo(cx + sz * .36, cy); ctx.lineTo(cx, cy + sz * .5); ctx.lineTo(cx - sz * .36, cy); ctx.closePath(); ctx.fill(); return; }
  ctx.beginPath(); ctx.moveTo(cx, cy - sz * .5);
  ctx.bezierCurveTo(cx + sz * .1, cy - sz * .26, cx + sz * .46, cy - sz * .06, cx + sz * .42, cy + sz * .17);
  ctx.bezierCurveTo(cx + sz * .38, cy + sz * .36, cx + sz * .12, cy + sz * .38, cx, cy + sz * .2);
  ctx.bezierCurveTo(cx - sz * .12, cy + sz * .38, cx - sz * .38, cy + sz * .36, cx - sz * .42, cy + sz * .17);
  ctx.bezierCurveTo(cx - sz * .46, cy - sz * .06, cx - sz * .1, cy - sz * .26, cx, cy - sz * .5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx, cy + sz * .08); ctx.lineTo(cx + sz * .14, cy + sz * .5); ctx.lineTo(cx - sz * .14, cy + sz * .5); ctx.closePath(); ctx.fill();
}
// a playing card in the app: face up (rank and pip) or face down (its red back)
function appCard(x, y, w, h, rank, s, a = 1, flip = 1) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(Math.max(.02, Math.abs(flip)), 1);
  if (flip < 0 || !rank) cardBack(-w / 2, -h / 2, w, h, s * 4, a);
  else {
    ctx.fillStyle = rgba([238, 232, 218], a); rrect(-w / 2, -h / 2, w, h, 8 * s); ctx.fill();
    const red = 'AKJ7'.includes(rank[0]);
    font(26 * s, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = red ? rgba([205, 30, 40], a) : rgba([20, 20, 24], a); ctx.fillText(rank, 0, -h * .16);
    pip(0, h * .22, 24 * s, red, a);
  }
  ctx.restore();
}
// the back of its cards: dark red, a gold edge, a diamond lattice
function cardBack(x, y, w, h, r, a = 1) {
  ctx.fillStyle = rgba([118, 14, 24], a); rrect(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = rgba(GOLD, .8 * a); ctx.lineWidth = Math.max(1, w * .05); rrect(x + w * .1, y + w * .1, w * .8, h - w * .2, r * .6); ctx.stroke();
  ctx.lineWidth = Math.max(.6, w * .025); ctx.strokeStyle = rgba(GOLD, .45 * a);
  ctx.beginPath(); ctx.moveTo(x + w / 2, y + h * .2); ctx.lineTo(x + w * .8, y + h / 2); ctx.lineTo(x + w / 2, y + h * .8); ctx.lineTo(x + w * .2, y + h / 2); ctx.closePath(); ctx.stroke();
}
// the face of its cards: its own grin and slit eyes, printed on cream
function cardFace(x, y, w, h, r, a = 1) {
  ctx.fillStyle = rgba([232, 222, 200], a); rrect(x, y, w, h, r); ctx.fill();
  const cx = x + w / 2, cy = y + h * .56, gw = w * .7;
  ctx.fillStyle = rgba([150, 8, 18], a);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(cx + sd * w * .2, y + h * .34); ctx.rotate(-sd * .4); ctx.beginPath(); ctx.ellipse(0, 0, w * .13, w * .04, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(cx - gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .08, cx + gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .34, cx - gw / 2, cy); ctx.fill();
  ctx.fillStyle = rgba([240, 230, 210], a);
  for (let i = 0; i < 7; i++) { const u = cx - gw * .38 + i * gw * .76 / 6; ctx.beginPath(); ctx.moveTo(u - w * .035, cy + h * .045); ctx.lineTo(u + w * .035, cy + h * .045); ctx.lineTo(u, cy + h * .12); ctx.fill(); }
}

// its grin, faint in the phone's glass (cx, cy its centre, gw its width)
function glassGrin(cx, cy, gw, a) {
  if (a <= .01) return;
  const h = gw * .5;
  ctx.fillStyle = rgba([210, 20, 30], a);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(cx + sd * gw * .24, cy - h * .5); ctx.rotate(-sd * .4); ctx.beginPath(); ctx.ellipse(0, 0, gw * .1, gw * .025, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(cx - gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .25, cx + gw / 2, cy); ctx.quadraticCurveTo(cx, cy + h * .8, cx - gw / 2, cy); ctx.fill();
  ctx.fillStyle = rgba([255, 230, 220], a * .8);
  for (let i = 0; i < 11; i++) { const u = cx - gw * .4 + i * gw * .8 / 10; ctx.beginPath(); ctx.moveTo(u - gw * .02, cy + h * .1); ctx.lineTo(u + gw * .02, cy + h * .1); ctx.lineTo(u, cy + h * .26); ctx.fill(); }
}
// the last card it deals: his own face on it
function cardFaceHim(x, y, w, h, r, a = 1, ex = EXPR.fear) {
  ctx.fillStyle = rgba([232, 222, 200], a); rrect(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = rgba([170, 20, 30], a); ctx.lineWidth = Math.max(1, w * .04); rrect(x + w * .08, y + w * .08, w * .84, h - w * .16, r * .6); ctx.stroke();
  const cx = x + w / 2, cy = y + h * .45, hr = w * .27;
  ctx.save(); rrect(x + w * .08, y + w * .08, w * .84, h - w * .16, r * .6); ctx.clip();
  ctx.fillStyle = rgba([12, 10, 12], a);
  ctx.beginPath(); ctx.ellipse(cx, cy + hr * 2.1, hr * 1.6, hr * 1.05, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(cx - hr * .34, cy + hr * .55, hr * .62, hr * .9);
  ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill();
  if (a > .3) face(cx, cy, hr, ex, { turn: 0, featA: .9 * a });
  ctx.restore();
  pip(x + w * .2, y + h * .14, w * .14, true, a); pip(x + w * .8, y + h * .86, w * .14, true, a);
}

// ---------- the HOUSE app on his phone (dy: how far a banner pushed the page down) ----------
function houseScreen(x, y, w, h, s, t, a, dy = 0) {
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba([14, 50, 34], a)); g.addColorStop(1, rgba([3, 14, 9], a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const zk = inv(47.9, 48.55, t);
  statusClock(x, y, s, statusAt(t), a);
  ctx.translate(0, dy * s);
  // the header: the logo, the name, LIVE
  houseLogo(x + 50 * s, y + 92 * s, 48 * s, a);
  font(32 * s, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(GOLD, a);
  ctx.fillText('HOUSE', x + 86 * s, y + 93 * s);
  ctx.fillStyle = rgba([200, 30, 40], a); rrect(x + w - 104 * s, y + 78 * s, 72 * s, 30 * s, 15 * s); ctx.fill();
  font(15 * s, SANS, '800'); ctx.textAlign = 'center'; ctx.fillStyle = rgba(C.cream, a); ctx.fillText('LIVE', x + w - 68 * s, y + 94 * s);
  // the balance: red once it is gone, or just after a loss
  const bal = keys(BAL, t, E.io), d = DELTA.filter(q => t >= q[0] && t < q[0] + 1.6).pop();
  const hurt = bal <= 0 || (d && d[1] < 0);
  ctx.fillStyle = rgba([0, 0, 0], .32 * a); rrect(x + 24 * s, y + 130 * s, w - 48 * s, 108 * s, 18 * s); ctx.fill();
  font(15 * s, SANS, '700'); ctx.textAlign = 'left'; ctx.fillStyle = rgba(C.cream, .55 * a); ctx.fillText('BALANCE', x + 46 * s, y + 158 * s);
  font(46 * s, SANS, '800'); ctx.fillStyle = rgba(hurt ? LOSS : C.cream, a);
  if (bal <= 0 && t > 30) { ctx.shadowColor = rgba(LOSS, .6 * a); ctx.shadowBlur = 14 * s * VP.k; }
  ctx.fillText(usd(Math.round(bal)), x + 44 * s, y + 204 * s); ctx.shadowBlur = 0;
  if (d) {                                    // the change, floating up and away
    const k = inv(d[0], d[0] + 1.6, t), col = d[2] ? GOLD : d[1] > 0 ? [120, 220, 140] : LOSS;
    font(21 * s, SANS, '800'); ctx.textAlign = 'right'; ctx.fillStyle = rgba(col, a * (1 - k * k));
    ctx.fillText((d[2] ? 'DEPOSIT ' : '') + usd0(d[1]), x + w - 44 * s, y + (160 - 14 * k) * s);
  }
  // the table: the dealer's cards, his cards, the verdict
  const H0 = handAt(t), [, mine, deal, rt, res, bet] = H0, done = rt && t >= rt;
  ctx.strokeStyle = rgba(GOLD, .3 * a); ctx.lineWidth = 2 * s;
  ctx.beginPath(); ctx.ellipse(x + w / 2, y + 380 * s, 186 * s, 116 * s, 0, 0, Math.PI * 2); ctx.stroke();
  font(13 * s, SANS, '700'); ctx.textAlign = 'center'; ctx.fillStyle = rgba(C.cream, .4 * a); ctx.fillText('DEALER', x + w / 2, y + 286 * s);
  const cw = 52 * s, ch = 74 * s;
  deal.forEach((r, i) => {
    const flip = i === 1 && rt ? (done ? 1 : -1) * Math.max(.02, Math.abs(Math.cos(Math.PI * inv(rt - .25, rt, t)))) : 1;
    appCard(x + w / 2 - cw - 6 * s + i * (cw + 12 * s), y + 300 * s, cw, ch, i === 1 && rt && t < rt - .12 ? '' : r, s, a, i === 1 && rt && t < rt - .12 ? -1 : flip);
  });
  mine.forEach((r, i) => appCard(x + w / 2 - cw - 6 * s + i * (cw + 12 * s), y + 392 * s, cw, ch, r, s, a));
  if (!mine.length) {                         // nothing left to bet: an empty table
    font(17 * s, SANS, '700'); ctx.fillStyle = rgba(C.cream, .35 * a); ctx.fillText('PLACE YOUR BET', x + w / 2, y + 380 * s);
  }
  if (done && res) {
    const k = E.out(inv(rt, rt + .18, t)), win = res === 'win', sc = 1 + .4 * (1 - k);
    ctx.save(); ctx.translate(x + w / 2, y + 384 * s); ctx.scale(sc, sc); ctx.rotate(-.08);
    ctx.fillStyle = rgba(win ? [20, 40, 26] : [70, 6, 12], .92 * a * k); rrect(-170 * s, -30 * s, 340 * s, 60 * s, 10 * s); ctx.fill();
    ctx.strokeStyle = rgba(win ? [110, 150, 110] : LOSS, a * k); ctx.lineWidth = 3 * s; ctx.stroke();
    font(31 * s, SANS, '900'); ctx.fillStyle = rgba(win ? [150, 186, 140] : LOSS, a * k); ctx.fillText(win ? 'YOU WIN' : 'HOUSE WINS', 0, 2 * s);
    ctx.restore();
  }
  if (res === 'win' && done) glassGrin(x + w / 2, y + 400 * s, 330 * s, .3 * win(t, rt + .05, rt + .75, .12, .35) * a);
  // the buttons
  const press = rt && t > rt - .32 && t < rt - .12 && H0[6] === 'bet', dbl = rt && t > rt - .45 && t < rt - .1 && H0[6] === 'dbl', empty = t >= BROKE;
  ctx.lineWidth = 2.5 * s; ctx.strokeStyle = rgba(empty ? [90, 90, 90] : GOLD, a);
  ctx.fillStyle = rgba(press ? GOLD : [0, 0, 0], (press ? .9 : .25) * a); rrect(x + 24 * s, y + 520 * s, 170 * s, 58 * s, 29 * s); ctx.fill(); ctx.stroke();
  font(18 * s, SANS, '800'); ctx.fillStyle = rgba(press ? [30, 20, 6] : empty ? [110, 110, 110] : GOLD, a); ctx.fillText(bet, x + 109 * s, y + 550 * s);
  ctx.fillStyle = rgba(empty ? [70, 30, 30] : dbl ? [255, 70, 70] : [176, 16, 30], a); rrect(x + 206 * s, y + 520 * s, w - 230 * s, 58 * s, 29 * s); ctx.fill();
  if (dbl) { ctx.strokeStyle = rgba([255, 220, 220], a); ctx.lineWidth = 3 * s; ctx.stroke(); }
  font(15 * s, SANS, '900'); ctx.fillStyle = rgba(C.cream, (empty ? .5 : 1) * a); ctx.fillText('DOUBLE OR NOTHING', x + 206 * s + (w - 230 * s) / 2, y + 550 * s);
  // recent results: almost all red
  font(13 * s, SANS, '700'); ctx.textAlign = 'left'; ctx.fillStyle = rgba(C.cream, .45 * a); ctx.fillText('RECENT', x + 26 * s, y + 618 * s);
  for (const [on, bx] of [[press, x + 109 * s], [dbl, x + 206 * s + (w - 230 * s) / 2 + 20 * s]]) if (on) {   // his thumb
    ctx.fillStyle = rgba([20, 16, 18], .55 * a); ctx.beginPath(); ctx.ellipse(bx, y + 562 * s, 34 * s, 40 * s, -.3, 0, Math.PI * 2); ctx.fill();
  }
  [...'LLWLLLLWLLL'].forEach((c, i) => {
    ctx.fillStyle = rgba(c === 'W' ? [70, 170, 100] : [190, 40, 46], .9 * a);
    ctx.beginPath(); ctx.arc(x + 112 * s + i * 25 * s, y + 618 * s, 8 * s, 0, Math.PI * 2); ctx.fill();
  });
  // the deposit strip: his card, then CARD DECLINED
  ctx.fillStyle = rgba([0, 0, 0], .32 * a); rrect(x + 24 * s, y + 650 * s, w - 48 * s, 70 * s, 16 * s); ctx.fill();
  ctx.fillStyle = rgba([26, 36, 74], a); rrect(x + 40 * s, y + 666 * s, 58 * s, 38 * s, 6 * s); ctx.fill();
  ctx.fillStyle = rgba(GOLD, .9 * a); rrect(x + 48 * s, y + 677 * s, 14 * s, 11 * s, 2 * s); ctx.fill();
  font(17 * s, SANS, '700'); ctx.textAlign = 'left';
  if (t >= BROKE) { ctx.fillStyle = rgba(LOSS, a); ctx.fillText('CARD DECLINED', x + 112 * s, y + 686 * s); }
  else { ctx.fillStyle = rgba(C.cream, .8 * a); ctx.fillText('DEPOSIT  •••• 4417', x + 112 * s, y + 686 * s); }
  if (t >= 26.5 && t < 27.4) tick(x + w - 56 * s, y + 686 * s, 26 * s, [120, 220, 140], a);
  // the reveal: the zeros pour down until the screen is full of them
  if (zk > 0) {
    ctx.translate(0, -dy * s);
    ctx.fillStyle = rgba([24, 0, 4], .85 * a * Math.min(1, zk * 3)); ctx.fillRect(x, y, w, h);
    font(40 * s, SANS, '800'); ctx.textAlign = 'center';
    const rows = Math.ceil(zk * 19), f = Math.floor(t * 30);
    for (let i = 0; i < rows; i++) for (let j = 0; j < 3; j++) {
      const jx = (rnd(f * 7 + i * 3 + j) - .5) * 10 * s, on = rnd(f * 3 + i * 11 + j * 5) > .12;
      ctx.fillStyle = rgba(i === rows - 1 ? [255, 120, 120] : LOSS, (on ? .95 : .4) * a);
      ctx.fillText('0.00', x + w * (j + .5) / 3 + jx, y + 52 * s + i * 44 * s);
    }
  }
  ctx.restore();
}
// the tiny phone in his hand (drawn in -13..13 x -23..21): the felt, the balance bar, two cards
function houseHand(t) {
  ctx.fillStyle = t > 47.9 ? 'rgb(60,4,10)' : 'rgb(16,60,38)'; ctx.fillRect(-13, -23, 26, 44);
  ctx.fillStyle = rgba(keys(BAL, t) <= 0 ? LOSS : GOLD); ctx.fillRect(-10, -19, 20, 4);
  ctx.fillStyle = 'rgb(236,230,214)'; ctx.fillRect(-8, -6, 7, 10); ctx.fillRect(1, -6, 7, 10);
  ctx.fillStyle = 'rgb(176,16,30)'; ctx.fillRect(-10, 10, 20, 5);
}

// ---------- the cards it deals: they fly from it and pile up on his floor ----------
// [when, landing x, landing y, spin, from: 'body' (out of its shape) | 'hand' (its claw) | 'drop' (its hands on him)]
const DEALS = [[1.75, 1010, 905, .4, 'body'], [8.2, 1150, 945, -.7, 'body'],
  [18.7, 905, 985, .9, 'hand'], [19.2, 1215, 918, -.3, 'hand'], [19.7, 760, 935, .6, 'hand'],
  [28.9, 1085, 1012, -.9, 'hand'], [29.25, 1300, 962, .2, 'hand'], [29.6, 690, 992, -.5, 'hand'], [29.95, 965, 1050, .8, 'hand'],
  [38.1, 880, 905, .3, 'drop'], [38.45, 1060, 960, -.6, 'drop'], [38.8, 800, 1020, .7, 'drop'], [39.15, 1180, 1000, -.2, 'drop'],
  [39.5, 640, 960, .5, 'drop'], [42.8, 1340, 1030, -.8, 'drop'], [43.15, 940, 1055, .1, 'drop'], [43.5, 1110, 900, .9, 'drop'],
  [43.85, 720, 1050, -.4, 'drop'], [44.2, 1260, 880, .6, 'drop'], [44.55, 600, 905, -.7, 'drop'],
  [56.6, 1000, 878, .15, 'him']];      // the last one: dealt to him close up (lastcard), his own face on it
const FLY = .42, CW = 44, CH = 64;
const FLIP0 = 13.9, FLIPALL = 54.1, BURN = 61.3, LIFT = 54.7, HIMFLIP = 56.9;
// a card at world (cx, cy): lie 0 = upright in the air … 1 = lying on the floor; face 0 = back … 1 = its grin
function floorCard(cx, cy, rot, lie, face, a = 1, him = false) {
  if (a <= .01) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1, lerp(1, .34, lie)); ctx.rotate(rot);
  const fk = Math.cos(Math.PI * clamp(face)); ctx.scale(Math.max(.03, Math.abs(fk)), 1);
  if (fk > 0) cardBack(-CW / 2, -CH / 2, CW, CH, 5, a); else if (him) cardFaceHim(-CW / 2, -CH / 2, CW, CH, 5, a); else cardFace(-CW / 2, -CH / 2, CW, CH, 5, a);
  ctx.restore();
}
// where a card it deals comes from, in the room's world (DEVIL is placed by the shot)
function dealFrom(kind, o) {
  const { x, y, s } = DEVIL;
  if (kind === 'body') return [x + 60 * s, y - 560 * s];
  const rest = [x - 230 * s, y - 380 * s];
  if (kind === 'hand') return [lerp(rest[0], 905, o.reach || 0), lerp(rest[1], 592, o.reach || 0)];
  return [lerp(rest[0], 905, o.reach || 0) + 40, lerp(rest[1], 592, o.reach || 0) + 30];
}
// the cards on the floor (before it and him) and the ones in the air (after); burnt once he snaps the card
function roomCards(t, o, layer, lift = 0) {
  DEALS.forEach(([td, lx, ly, spin, from], i) => {
    if (t < td) return;
    const him = from === 'him', k = him ? 1 : (t - td) / FLY;
    if (k < 1) {
      if (layer !== 'air') return;
      const [fx, fy] = dealFrom(from, o), e = E.out(k);
      const cx = lerp(fx, lx, from === 'body' ? k : e), cy = lerp(fy, ly, k * k) - Math.sin(Math.PI * k) * (from === 'drop' ? 30 : from === 'body' ? 40 : 120);
      floorCard(cx, cy, spin + k * 9 * (spin > 0 ? 1 : -1), k * k, 0);
      return;
    }
    if (layer !== 'floor') return;
    const burn = inv(BURN + i * .025, BURN + .55 + i * .025, t);
    if (burn >= 1) {                                   // ash where it lay
      ctx.fillStyle = 'rgba(30,26,28,.55)'; ctx.beginPath(); ctx.ellipse(lx, ly, 22, 7, spin * .2, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const face = him ? 1 : i === 0 ? inv(FLIP0, FLIP0 + .3, t) : inv(FLIPALL + i * .03, FLIPALL + .3 + i * .03, t);
    const hover = lift * (.5 + .5 * rnd(i + 70)) * (1 - burn), bob = hover ? Math.sin(t * 3 + i) * 6 : 0;
    if (i === 0 && t > FLIP0 && t < FLIP0 + 2.2) additive(() => glow(SPR.red, lx, ly, 110, .9 * win(t, FLIP0, FLIP0 + 2.2, .1, .9)));
    floorCard(lx, ly - hover * 120 + bob, spin, 1 - hover * .7, face, 1 - burn, him);
    if (burn > 0) additive(() => { glow(SPR.amber, lx, ly - hover * 120, 70, 1 - burn); glow(SPR.red, lx, ly - hover * 120, 120, .6 * (1 - burn)); });
  });
  if (layer === 'air' && t > BURN && t < BURN + 2.4) additive(() => {     // embers rising from every card
    DEALS.forEach(([, lx, ly], i) => { for (let j = 0; j < 4; j++) {
      const u = t - BURN - i * .025 - j * .2; if (u < 0 || u > 1.6) return;
      glow(j % 2 ? SPR.amber : SPR.red, lx + (rnd(i * 7 + j) - .5) * 60 + Math.sin(u * 4 + j) * 10, ly - u * 260, 7 + 6 * rnd(i + j), 1 - u / 1.6);
    } });
  });
}
// his desk: unpaid letters with a red stamp, and a photo of his mother and sister
function gamblingProps(a, col) {
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) { const x = 150 + i * 22, y = 638 - i * 4; ctx.strokeRect(x, y, 62, 12); line(x, y, x + 31, y + 7); line(x + 31, y + 7, x + 62, y); }
  ctx.fillStyle = rgba([200, 40, 40], Math.min(1, a * 3)); ctx.fillRect(200, 630, 16, 6);
  ctx.strokeRect(360, 596, 52, 54); ctx.strokeRect(366, 602, 40, 42);
  ctx.beginPath(); ctx.arc(378, 618, 6, 0, Math.PI * 2); ctx.arc(396, 622, 5, 0, Math.PI * 2); ctx.stroke();
  line(370, 644, 386, 630); line(386, 630, 402, 644);
  if (GT >= 60.6) {                          // the two halves of his bank card, on the floor where they fell
    ctx.fillStyle = rgba([30, 40, 80], Math.min(1, a * 4)); ctx.save(); ctx.translate(1040, 900); ctx.scale(1, .4);
    ctx.rotate(.3); ctx.fillRect(-40, -26, 38, 52); ctx.rotate(-.7); ctx.fillRect(8, -30, 38, 52); ctx.restore();
  }
}

// ---------- his room at night (the engine's room, with the cards it deals, its light and what he holds) ----------
// p: as the engine's room (spot, o(t), creep, hunch, lit, flicker, fr), plus felt (the money-green light of the app),
// hold 'phone' | 'none', tetherCut (the smoke between them snaps), lift (the cards rise from the floor)
defShot('groom', (t, p, L) => {
  const fr = p.fr || ROOM_FR, flick = p.flicker ? .55 + .45 * Math.abs(Math.sin(t * 31) * Math.sin(t * 7.3)) : 1;
  fill([8, 9, 14], [14, 12, 22]);
  cam(...fr);
  drawWindow(0, .14 * flick);
  drawRoom(.14 * flick, [120, 150, 220]);
  const o = roomDevil(t, p, L), lit = p.lit !== false && p.hold !== 'none';
  roomCards(t, o, 'floor', p.lift ? E.io(inv(p.lift, p.lift + 1.2, t)) : 0);
  if (o.a > 0) drawDevil(t, fr, o);
  const P0 = poseSit(SIT.x, SIT.y, SIT.s, p.hunch ?? .65);
  if (o.a > .3 && p.spot !== 'window') tether(t, P0.parts[0][0][1], [DEVIL.x, DEVIL.y - 560 * DEVIL.s], o.a * (p.tetherCut ? 1 - inv(p.tetherCut, p.tetherCut + .25, t) : 1));
  const P = poseSit(SIT.x, SIT.y + Math.sin(t * 1.5) * 1.5, SIT.s, p.hunch ?? .65), [hx, hy] = P.hand;
  if (lit) additive(() => p.felt
    ? (glow(SPR.gold, hx, hy, 560, .24), glow(SPR.blue, hx, hy, 600, .14), glow(SPR.red, hx, hy - 40, 380, .1))
    : (glow(SPR.blue, hx, hy, 600, .26), glow(SPR.red, hx, hy - 40, 420, .24)));
  drawPerson(P, [5, 5, 7], lit ? (p.felt ? [200, 210, 150] : mix(C.blue, C.red, .4)) : [120, 120, 140], lit ? .55 : .22, 1, .25);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), lit ? { turn: .9, light: p.felt ? [214, 232, 170] : [255, 176, 196], la: .34, lc: [.4, .8] }
    : { turn: .9, light: [170, 180, 210], la: .14, lc: [-.6, -.3], featA: .75 });
  if (p.hold !== 'none') {                  // the phone in his hand
    ctx.save(); ctx.translate(hx, hy);
    ctx.fillStyle = '#0d0c0f'; rrect(-15, -26, 30, 50, 6); ctx.fill();
    if (lit) { rrect(-13, -23, 26, 44, 4); ctx.clip(); houseHand(t); }
    ctx.restore();
  }
  if (o.a > 0) devilArms(t, o);
  if (o.eyes > 0) devilEyes(t, o);
  if (o.a > 0) devilGrin(t, o);
  roomCards(t, o, 'air');
  screen();
  if (o.a > .3) { ctx.fillStyle = rgba(C.red, .1 * o.a * (.6 + .4 * Math.sin(t * 5))); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L, len) => SHOT.room.subject(t, p, L, len));

// ---------- hands, close: the same dark silhouette as his body, with a rim of the light he is in ----------
// local units: the wrist at (0, 0), the fingers toward +x, the forearm running back along -x off the frame.
// part 'back' = forearm, the back of the hand, the curled fingers; 'thumb' = the thumb lying over what he holds
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
function goldChain(pts, t, a = 1, lw = 4.4, rx = 11) {   // links along a path of points, glinting
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.save(); ctx.translate((x0 + x1) / 2, (y0 + y1) / 2); ctx.rotate(ang);
    ctx.strokeStyle = rgba(mix([150, 104, 30], [255, 222, 128], .5 + .5 * Math.sin(i * 1.7 + t * 5)), a); ctx.lineWidth = lw;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, i % 2 ? rx * .3 : rx * .58, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  additive(() => { for (let k = 0; k < 5; k++) { const p = pts[Math.floor((rnd(k + 90) * .9 + .05) * pts.length)], tw = Math.max(0, Math.sin(t * 6 + k * 2.1)); glow(SPR.gold, p[0], p[1], rx * 3.4, .85 * tw * a); } });
}
function pendant(x, y, r, t, a = 1) {          // a gold locket with a heart engraved on it
  ctx.fillStyle = rgba([226, 176, 66], a); ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.22, .08, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba([255, 232, 160], a); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.ellipse(x, y, r * .72, r * .9, .08, 0, Math.PI * 2); ctx.stroke();
  icon('heart', x, y + r * .05, r * .9, [150, 100, 26], a);
  additive(() => glow(SPR.gold, x - r * .3, y - r * .4, r * 2.6, (.6 + .3 * Math.sin(t * 7)) * a));
}
const curve = (a, c, b, n = 26) => [...Array(n + 1).keys()].map(i => { const k = i / n; return [lerp(lerp(a[0], c[0], k), lerp(c[0], b[0], k), k), lerp(lerp(a[1], c[1], k), lerp(c[1], b[1], k), k)]; });
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
// ---------- close: his hand holds his mother's gold chain; its claw takes it into the dark (p { reach: [a, b], pull: [a, b] }) ----------
const CHAIN_HAND = [560, 330, .3];
defShot('chain', (t, p, L) => {
  fill([6, 8, 9], [18, 10, 14]);
  cam(1, 960, 540);
  additive(() => { glow(SPR.gold, 300, 1000, 900, .3); glow(SPR.red, 1620, 260, 1000, .42 * (.85 + .15 * Math.sin(t * 6))); });
  const reach = E.io(inv(p.reach[0], p.reach[1], t)), pull = E.io(inv(p.pull[0], p.pull[1], t)), close = E.out(inv(p.reach[1] - .2, p.reach[1] + .08, t));
  const sway = Math.sin(t * 2.2) * 8, pend0 = [828 + sway, 742], off = [1150 * pull, -820 * pull], pend = [pend0[0] + off[0], pend0[1] + off[1]];
  const [hx, hy, ha] = CHAIN_HAND, tipA = [hx + 150 * Math.cos(ha) - 24, hy + 150 * Math.sin(ha) + 40], tipB = [tipA[0] + 26, tipA[1] + 4];
  const slide = clamp((pull - .35) / .4), top = [[lerp(tipA[0], pend[0] - 20, slide), lerp(tipA[1], pend[1] - 260, slide)], [lerp(tipB[0], pend[0] + 20, slide), lerp(tipB[1], pend[1] - 250, slide)]];
  mitt(hx, hy, ha, 1, 'back', [7, 7, 9], [206, 232, 168], .55, -.5, .8);
  goldChain(curve(top[0], [lerp(tipA[0] - 30, pend[0] - 60, .5), pend[1] - 150], [pend[0] - 10, pend[1] - 30]), t);
  goldChain(curve(top[1], [lerp(tipB[0] + 40, pend[0] + 60, .5), pend[1] - 140], [pend[0] + 10, pend[1] - 30]), t);
  pendant(pend[0], pend[1], 40, t);
  mitt(hx, hy, ha, 1, 'thumb', [7, 7, 9], [206, 232, 168], .55, -.5, .8);
  if (reach > 0) claw([lerp(1700, pend0[0] + 120, reach) + off[0], lerp(160, pend0[1] - 70, reach) + off[1]], close);
}, () => [380, 220, 1500, 900]);

// ---------- close: his two hands snap his bank card in half (p.at); a white flash ----------
function bankCard(w, h, a = 1, half = 0) {     // centred; half -1 / 1 clips to one side of the break
  ctx.save();
  if (half) {                                  // a jagged break down the middle
    ctx.beginPath(); const xs = [0, 8, -6, 10, -4, 6, 0], sd = half;
    ctx.moveTo(sd * w, -h); xs.forEach((dx, i) => ctx.lineTo(dx, -h / 2 + i * h / 6)); ctx.lineTo(sd * w, h); ctx.closePath(); ctx.clip();
  }
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, rgba([34, 48, 96], a)); g.addColorStop(1, rgba([10, 14, 34], a));
  ctx.fillStyle = g; rrect(-w / 2, -h / 2, w, h, 18); ctx.fill();
  ctx.strokeStyle = rgba([255, 255, 255], .08 * a); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(w * .2, h * .9, h * .9, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
  ctx.fillStyle = rgba(GOLD, a); rrect(-w * .38, -h * .16, w * .16, h * .22, 6); ctx.fill();
  ctx.strokeStyle = rgba([120, 90, 30], a); ctx.lineWidth = 2; ctx.strokeRect(-w * .36, -h * .1, w * .12, h * .1);
  font(h * .13, SANS, '800'); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(C.cream, .9 * a); ctx.fillText('DEBIT', w * .42, -h * .32);
  font(h * .14, SANS, '600'); ctx.textAlign = 'left'; ctx.fillStyle = rgba(C.cream, .85 * a); ctx.fillText('••••  ••••  ••••  4417', -w * .4, h * .3);
  ctx.restore();
}
defShot('snap', (t, p, L) => {
  fill([12, 3, 5], [44, 6, 10]);
  cam(1, 960, 560);
  additive(() => { glow(SPR.red, 960, 120, 1100, .45); glow(SPR.red, 960, 560, 700, .2); });
  const bend = E.io(inv(p.at - .55, p.at - .02, t)), u = Math.max(0, t - p.at), k = E.out(clamp(u / .45));
  const cw = 430, chh = 271, cx = 960, cy = 540, rim = [255, 120, 120];
  const half = sd => [cx + sd * (cw / 2 - 30 + k * 170), cy + 20 + k * 70 + k * k * 90, sd * (-.12 * bend - .62 * k)];
  for (const sd of [-1, 1]) {                    // each hand: behind the card, the card's half, then the thumb over it
    const [hx, hy, ang] = half(sd);
    ctx.save(); if (sd > 0) { ctx.translate(2 * cx, 0); ctx.scale(-1, 1); }
    const [mx, my, ma] = sd > 0 ? [2 * cx - hx, hy, -ang] : [hx, hy, ang];
    mitt(mx - 40, my + 16, ma - .3, .9, 'back', [7, 7, 9], rim, .5, .3, -1);
    ctx.restore();
  }
  for (const sd of [-1, 1]) {
    const [hx, hy, ang] = half(sd);
    ctx.save(); ctx.translate(hx - sd * (cw / 2 - 30), hy); ctx.rotate(ang); bankCard(cw, chh, 1, sd); ctx.restore();
  }
  if (bend > .3 && u === 0) { ctx.strokeStyle = rgba([255, 255, 255], .6 * bend); ctx.lineWidth = 3; line(cx, cy - chh / 2 + 28, cx + 6, cy + chh / 2 - 12); }
  for (const sd of [-1, 1]) {
    const [hx, hy, ang] = half(sd);
    ctx.save(); if (sd > 0) { ctx.translate(2 * cx, 0); ctx.scale(-1, 1); }
    const [mx, my, ma] = sd > 0 ? [2 * cx - hx, hy, -ang] : [hx, hy, ang];
    mitt(mx - 40, my + 16, ma - .3, .9, 'thumb', [7, 7, 9], rim, .5, .3, -1);
    ctx.restore();
  }
  if (u > 0 && u < .5) additive(() => {
    glow(SPR.cream, cx, cy, 700, 1.2 * (1 - u / .5));
    for (let i = 0; i < 18; i++) glow(i % 2 ? SPR.amber : SPR.cream, cx + (rnd(i + 300) - .5) * 900 * u * 2, cy + (rnd(i + 301) - .6) * 600 * u * 2, 6 + 6 * rnd(i), 1 - u / .5);
  });
}, () => [520, 280, 1400, 820]);

// ---------- close: on his lap, its claw deals him one last card; it turns over: his own face (p { deal, flip }) ----------
defShot('lastcard', (t, p, L) => {
  fill([10, 3, 5], [34, 6, 10]);
  cam(1, 960, 540);
  additive(() => { glow(SPR.red, 960, -80, 1200, .55); glow(SPR.red, 960, 760, 700, .16); });
  const rim = [255, 110, 110];
  ctx.lineCap = 'round';
  for (const [x0, x1] of [[560, 800], [1360, 1120]]) {             // his thighs, running away from us to his knees
    ctx.strokeStyle = rgba(rim, .45); ctx.lineWidth = 290; line(x0, 1300, x1 + (x1 < 960 ? -8 : 8), 520);
    ctx.strokeStyle = 'rgb(7,6,8)'; ctx.lineWidth = 280; line(x0, 1300, x1, 520);
  }
  ctx.save(); ctx.translate(960, 760); ctx.rotate(-.06);                // the dead phone in his hands
  ctx.fillStyle = '#0c0b0e'; rrect(-130, -230, 260, 460, 34); ctx.fill();
  ctx.fillStyle = '#050406'; rrect(-116, -216, 232, 432, 26); ctx.fill();
  ctx.restore();
  mitt(760, 930, -1.25, .95, 'back', [7, 6, 8], rim, .45, .6, -1);
  ctx.save(); ctx.translate(1920, 0); ctx.scale(-1, 1); mitt(760, 930, -1.25, .95, 'back', [7, 6, 8], rim, .45, .6, -1); ctx.restore();
  const k = clamp((t - p.deal) / .32), held = t < p.deal;
  const cy = held ? lerp(-260, 470, E.out(inv(p.deal - .55, p.deal, t))) : lerp(470, 700, k * k), cx = 960 + (held ? 40 : 40 - 40 * k);
  const fk = Math.cos(Math.PI * clamp(inv(p.flip, p.flip + .22, t))), cw = 210, ch = 300;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(.08 - .1 * k); ctx.scale(Math.max(.03, Math.abs(fk)), 1);
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * VP.k;
  if (fk > 0) cardBack(-cw / 2, -ch / 2, cw, ch, 16); else cardFaceHim(-cw / 2, -ch / 2, cw, ch, 16, 1, EXPR.shock);
  ctx.restore();
  if (t > p.flip + .1) additive(() => glow(SPR.red, cx, cy, 260, .35 * inv(p.flip + .1, p.flip + .5, t)));
  const wy = held ? cy - 170 : lerp(300, -500, E.io(clamp((t - p.deal) / .9)));   // its claw lets go and pulls back up
  claw([1010, wy], held ? 1 : 1 - k);
  mitt(760, 930, -1.25, .95, 'thumb', [7, 6, 8], rim, .45, .6, -1);
  ctx.save(); ctx.translate(1920, 0); ctx.scale(-1, 1); mitt(760, 930, -1.25, .95, 'thumb', [7, 6, 8], rim, .45, .6, -1); ctx.restore();
}, () => [560, 220, 1360, 1060]);

// ---------- the warehouse: his double shift (p { move: 'carry' | 'stack', shift: 1 | 2, fr }) ----------
const FLOORW = 860;
function poseCarry(x, y, s, ph) {             // walking with a box held at his chest
  const P = poseWalk(x, y, s, ph, .15), sh = P.parts[2][0][1];
  const hand = [sh[0] + 74 * s, sh[1] + 64 * s], el = [sh[0] + 26 * s, sh[1] + 88 * s];
  P.parts[1] = [[sh, el, hand], 20 * s]; P.near = [[sh, [el[0] + 8 * s, el[1] - 2 * s], [hand[0] + 10 * s, hand[1] - 4 * s]], 20 * s];
  P.parts.splice(4, 1); P.box = [hand[0] - 20 * s, hand[1] - 92 * s, 120 * s, 100 * s];
  return P;
}
function poseLift(x, y, s, k) {               // standing, lifting a box from his chest up onto a shelf
  const hip = [x, y - 196 * s], sh = [x + 8 * s, y - 370 * s];
  const hand = [sh[0] + lerp(70, 96, k) * s, sh[1] + lerp(56, -150, k) * s], el = [sh[0] + lerp(30, 70, k) * s, sh[1] + lerp(90, -40, k) * s];
  return { head: [x + 18 * s, y - 436 * s, 38 * s], box: [hand[0] - 30 * s, hand[1] - 98 * s, 124 * s, 100 * s],
    near: [[sh, [el[0] + 6 * s, el[1]], [hand[0] + 8 * s, hand[1]]], 21 * s],
    parts: [[[[x - 14 * s, y], [x - 10 * s, y - 100 * s], hip], 34 * s], [[[x + 16 * s, y], [x + 20 * s, y - 100 * s], hip], 34 * s],
      [[hip, sh], 56 * s], [[sh, el, hand], 21 * s]] };
}
function box(bx, by, bw, bh, light, a = 1) {
  ctx.fillStyle = rgba(mix([60, 44, 28], [170, 128, 82], light), a); ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = rgba(mix([90, 72, 50], [214, 186, 140], light), a); ctx.fillRect(bx + bw * .42, by, bw * .16, bh * .5);
  ctx.strokeStyle = rgba([20, 14, 8], .5 * a); ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
}
function rack(x0, x1, light, seed) {
  ctx.strokeStyle = rgba([150, 156, 170], .5); ctx.lineWidth = 6; line(x0, 150, x0, FLOORW); line(x1, 150, x1, FLOORW);
  ctx.lineWidth = 5; ctx.strokeStyle = rgba([210, 120, 40], .55);
  for (const y of [340, 600]) line(x0, y, x1, y);
  for (const y of [340, 600]) { let x = x0 + 14, i = 0; while (x < x1 - 60) { const bw = 80 + 70 * rnd(seed + i), bh = 60 + 70 * rnd(seed + i + 40); if (x + bw > x1 - 10) break; box(x, y - bh - 3, bw, bh, light * (.6 + .4 * rnd(seed + i + 9)), .9); x += bw + 10; i++; } }
}
function shiftBoard(day, light) {             // the roster on the wall: SHIFT 1 and SHIFT 2, ticked day by day
  const x = 700, y = 170, w = 520, h = 250;
  ctx.fillStyle = rgba(mix([120, 120, 118], [228, 228, 222], light)); rrect(x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba([60, 60, 66]); ctx.lineWidth = 6; rrect(x, y, w, h, 8); ctx.stroke();
  font(40, SANS, '900'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([196, 30, 36]); ctx.fillText('DOUBLE SHIFT', x + w / 2, y + 42);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  font(20, SANS, '700'); ctx.fillStyle = rgba([40, 40, 50]);
  days.forEach((d, i) => ctx.fillText(d, x + 170 + i * 76, y + 92));
  ['SHIFT 1', 'SHIFT 2'].forEach((r, j) => {
    ctx.textAlign = 'left'; ctx.fillStyle = rgba([40, 40, 50]); ctx.fillText(r, x + 24, y + 142 + j * 62);
    for (let i = 0; i < day; i++) tick(x + 170 + i * 76, y + 142 + j * 62, 40, [30, 60, 170], 1, .14);
    ctx.textAlign = 'center';
  });
}
defShot('work', (t, p, L) => {
  const late = p.shift === 2, light = late ? .75 : .9, fr = p.fr || [1, 960, 540];
  fill(late ? [46, 34, 26] : [36, 40, 48], late ? [22, 16, 12] : [18, 19, 23]);
  cam(...fr);
  rack(-200, 420, light, 11); rack(1500, 2100, light, 37);
  shiftBoard(late ? 4 : 3, light);
  for (const lx of [560, 1360]) {
    ctx.strokeStyle = 'rgba(20,20,24,.9)'; ctx.lineWidth = 3; line(lx, -300, lx, 70);
    ctx.fillStyle = '#18181c'; ctx.beginPath(); ctx.moveTo(lx - 22, 70); ctx.lineTo(lx + 22, 70); ctx.lineTo(lx + 60, 112); ctx.lineTo(lx - 60, 112); ctx.closePath(); ctx.fill();
    additive(() => { glow(late ? SPR.amber : SPR.cream, lx, 150, 520, late ? .34 : .28); glow(late ? SPR.amber : SPR.cream, lx, 118, 90, .8); });
  }
  ctx.fillStyle = '#141417'; ctx.fillRect(-600, FLOORW, W + 1200, 500);
  ctx.strokeStyle = rgba([210, 170, 40], .35); ctx.lineWidth = 8; line(-600, 960, W + 600, 960);
  ctx.strokeStyle = rgba([200, 200, 210], .14); ctx.lineWidth = 2; line(-600, FLOORW, W + 600, FLOORW);
  ctx.fillStyle = '#0d0d10'; ctx.fillRect(1240, 830, 300, 30);                     // a pallet
  box(1260, 720, 130, 108, light * .9); box(1396, 740, 120, 88, light * .8); box(1300, 618, 120, 100, light * .85);
  const rim = late ? [255, 190, 120] : [230, 232, 240];
  let P;
  if (p.move === 'carry') P = poseCarry(520 + L * 140, FLOORW, 1.05, L * 1.7 * Math.PI * 2);
  else P = poseLift(1010, FLOORW, 1.05, E.io(clamp(L / 1.2)));
  drawPerson(P, [9, 8, 9], rim, .55, 0, -1);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), { turn: 1, light: rim, la: .32, lc: [.3, -.8] });
  box(...P.box, light);
  ctx.strokeStyle = 'rgb(9,8,9)'; limb(P.near[0], P.near[1]);
}, (t, p, L) => {
  const P = p.move === 'carry' ? poseCarry(520 + L * 140, FLOORW, 1.05, 0) : poseLift(1010, FLOORW, 1.05, .5), b = poseBox(P, 60);
  return toScreenBox(p.fr || [1, 960, 540], [b[0], Math.min(b[1], P.box[1] - 20), Math.max(b[2], P.box[0] + P.box[2] + 20), b[3]]);
});

// ---------- weeks later: the mirror; tucked in its frame, the two halves of his old card; in the dark doorway behind
// him its eyes open and its claw flips a gold coin (p { eyes: [a, b], coin, fr }) ----------
defShot('gmirror', (t, p, L) => {
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
  if (p.coin && t > p.coin - .3 && ea > 0) {
    const u = t - p.coin, hand = [dx + 62, dy + 330];
    ctx.save(); ctx.strokeStyle = '#000'; ctx.lineCap = 'round'; ctx.shadowColor = rgba(C.red, .9 * ea); ctx.shadowBlur = 14 * VP.k;
    for (let f = 0; f < 3; f++) { ctx.lineWidth = 7; line(hand[0] - 30, hand[1] + 26, hand[0] - 4 + f * 12, hand[1] - 8 + f * 6); }
    ctx.restore();
    if (u > 0) {
      const cx = hand[0] + 14 * E.out(clamp(u / .7)), cy = hand[1] - 250 * E.out(clamp(u / .7)) + 8 * Math.sin(u * 3), r = 24, sp = Math.cos(u * 22);
      additive(() => glow(SPR.gold, cx, cy, 90, .95));
      ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(.06, Math.abs(sp)), 1);
      ctx.fillStyle = rgba(sp > 0 ? [246, 206, 110] : [200, 150, 56]); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = rgba([150, 100, 26]); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, Math.PI * 2); ctx.stroke();
      if (sp > 0) {                            // the house's roof and its eye
        ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * .45, -r * .02); ctx.lineTo(0, -r * .42); ctx.lineTo(r * .45, -r * .02); ctx.stroke();
        ctx.fillStyle = rgba([170, 12, 22]); ctx.beginPath(); ctx.ellipse(0, r * .2, r * .26, r * .1, 0, 0, Math.PI * 2); ctx.fill();
      } else glassGrin(0, r * .05, r * 1.3, 1);   // ...and its grin
      ctx.restore();
    }
  }
  const hx = mx - 60, hy = my + 30, r = 190;
  ctx.fillStyle = '#121418';
  ctx.beginPath(); ctx.ellipse(hx, hy + r * 2, r * 1.6, r * 1.05, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(hx - r * .34, hy + r * .55, r * .6, r * .9);
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  face(hx, hy, r, exprAt(t), { turn: 0, light: [240, 236, 228], la: .3, lc: [0, -.1] });
  ctx.restore();
  const sh = ctx.createLinearGradient(mx - mw / 2, 0, mx + mw / 2, 0);
  sh.addColorStop(.2, 'rgba(255,255,255,0)'); sh.addColorStop(.3, 'rgba(255,255,255,.06)'); sh.addColorStop(.4, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh; ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
  for (const [sd, ang] of [[-1, -.22], [1, .3]]) {        // the halves of the old card, tucked into the frame
    ctx.save(); ctx.translate(mx - mw / 2 + 70 + sd * 34, my - mh / 2 + 8); ctx.rotate(ang); ctx.scale(.36, .36);
    bankCard(430, 271, 1, sd); ctx.restore();
  }
}, (t, p) => toScreenBox(p.fr || [1, 960, 540], [W / 2 - 300, 220, W / 2 + 470, 870]));

// ---------- a chat with Mom: a photo of the chain he bought back, and her answer ----------
defShot('momchat', (t, p, L) => {
  fill([3, 3, 5]);
  const f = phoneFrame(L), { s, w, h, x, y } = f;
  additive(() => { glow(SPR.blue, W / 2, H / 2, 700, .12); glow(SPR.gold, W / 2, H / 2, 900, .16); });
  ctx.fillStyle = '#0c0c10'; rrect(x - 16 * s, y - 16 * s, w + 32 * s, h + 32 * s, 66 * s); ctx.fill();
  ctx.fillStyle = '#040406'; rrect(x, y, w, h, 52 * s); ctx.fill();
  chatScreen(f, L, { name: 'Mom', items: [
    { at: -1, text: 'Have you seen Grandma’s chain?', y: 120 },
    { at: .7, text: 'Got it back. I’m so sorry.', me: true, y: 410 },
    { at: 1.2, text: '•••', until: 1.6, fade: 0, y: 480 },
    { at: 1.6, text: '♥', fade: .15, y: 480, col: [200, 50, 90] }] });
  const pa = inv(.1, .35, L), bw = 250 * s, bh = 190 * s, bx = x + w - 24 * s - bw, by = y + 200 * s;
  if (pa > 0) {
    ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip(); ctx.globalAlpha = pa;
    ctx.fillStyle = '#1d1a20'; rrect(bx, by, bw, bh, 20 * s); ctx.fill(); ctx.clip();
    const g = ctx.createRadialGradient(bx + bw / 2, by + bh / 2, 0, bx + bw / 2, by + bh / 2, bw * .7); g.addColorStop(0, '#3a2f3a'); g.addColorStop(1, '#141216');
    ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh);
    const cx = bx + bw / 2, cy = by + bh * .42;
    goldChain(curve([cx - 80 * s, cy - 40 * s], [cx, cy + 90 * s], [cx + 80 * s, cy - 40 * s], 30), t, 1);
    ctx.fillStyle = rgba([230, 180, 70]); ctx.beginPath(); ctx.ellipse(cx, cy + 50 * s, 16 * s, 20 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}, phoneSubject);

// the code-drawn thumbnail (the engine's), with its cards flying around him: face down, and two showing its grin
{ const base = SHOT.thumb.draw;
  defShot('thumb', (t, p, L) => {
    base(t, p, L);
    screen();
    for (const [x, y, r, sz, face] of [[1640, 860, .5, 2.4, 1], [1800, 640, -.4, 2, 0], [330, 470, -.3, 1.8, 0], [880, 980, .25, 2.2, 1], [1480, 1010, -.6, 1.9, 0]]) {
      ctx.save(); ctx.translate(x, y); ctx.scale(sz, sz); additive(() => glow(SPR.red, 0, 0, 60, .5));
      floorCard(0, 0, r, 0, face, 1); ctx.restore();
    }
  });
}
// the money-green light of the app on his face, the warehouse's work light
LOOKS.felt = { bg: [[4, 12, 9], [12, 30, 22]], fill: [5, 7, 6], light: [206, 232, 168], la: .34, lc: [.45, .75], glow: 'gold', gl: [1220, 1080], ga: .38, rim: [190, 226, 160], turn: .9 };
LOOKS.ware = { bg: [[30, 32, 36], [56, 54, 52]], fill: [10, 10, 12], light: [244, 236, 220], la: .36, lc: [.3, -.9], glow: 'cream', gl: [960, -60], ga: .42, rim: [236, 230, 214], turn: .85 };

defineFilm({
  title: 'GAMBLING', subtitle: 'THE HOUSE ALWAYS WINS', dur: 117,
  app: { name: 'HOUSE', label: 'H', icon: 'H', color: [190, 138, 34] },
  viceScreen: houseScreen,
  handScreen: houseHand,
  roomProps: gamblingProps,
  thumb: { word: 'GAMBLING', hook: 'IT ALWAYS WINS', expr: 'fear' },   // the code-drawn fallback; ChatGPT's replaces it from the Mac
  phases: [
    { name: 'Cold open', a: 0, b: 3.8 },
    { name: 'Night 1', a: 3.8, b: 15 },
    { name: 'Nights 2–4', a: 15, b: 47.9 },
    { name: 'It shows itself', a: 47.9, b: 66.2 },
    { name: 'He fights back', a: 66.2, b: 101.1 },
    { name: 'Weeks later', a: 101.1, b: 117 }
  ],
  // the devil's words on screen (there is no narration): kind whispers until the zeros, then its real voice. A banner on
  // his phone is always alone: the whisper comes on the shot before or after it, never over it.
  words: [
    { id: 'W01', t: .1, d: 1.6, text: 'Every night you bet… who do you think is dealing?', show: false },   // the cold line has its own type
    { id: 'W02', t: 4.7, d: 1.8, text: 'Just one bet. For fun.' },
    { id: 'W03', t: 7.85, d: 1.6, text: 'See? You’re good at this.' },
    { id: 'W04', t: 12, d: 2, text: 'Win a little more. Then send it.' },
    { id: 'W05', t: 18.5, d: 2, text: 'He can wait. You’re due for a win.' },
    { id: 'W06', t: 21.3, d: 1.8, text: 'Double it. Then stop.' },
    { id: 'W07', t: 24.7, d: 1.6, text: 'Mom won’t miss it.' },
    { id: 'W08', t: 28.65, d: 1.6, text: 'You’ll win it back by morning.' },
    { id: 'W09', t: 37.6, d: 2.2, text: 'You still have something to bet…' },
    { id: 'W10', t: 44.9, d: 2.9, text: 'win it back… win it back…', show: false },   // the montage writes it
    { id: 'W11', t: 49.2, d: 2, text: 'I let you win.', real: true },
    { id: 'W12', t: 51.8, d: 1.9, text: 'I am the house.', real: true },
    { id: 'W13', t: 54.2, d: 2.2, text: 'You have one thing left to bet.', real: true },
    { id: 'W14', t: 57.1, d: 1.6, text: 'You.', real: true },
    { id: 'W15', t: 61.3, d: 1.4, text: '(it screams)' },
    { id: 'W16', t: 67.2, d: 2, text: 'Come back. I’ll let you win.' },
    { id: 'W17', t: 70.6, d: 2, text: 'You can’t outrun the odds.' },
    { id: 'W18', t: 90.6, d: 1.6, text: 'Just one bet. For fun…' },
    { id: 'W19', t: 94.5, d: 1.1, text: '(it shrieks)' },
    { id: 'W20', t: 99.3, d: 1.8, text: 'You’ll be back.' },
    { id: 'W21', t: 107.1, d: 1.9, text: 'Double or nothing?', real: true }
  ],
  slams: [3.2, 53.9, 57.1, 60.6, 66.2, 90.6, 111.2, 113.3],          // moments that hit: each shakes the frame
  glitch: [[3.2, 3.8, 1], [47.6, 47.9, .9], [48.5, 48.9, 1], [60.6, 61.1, 1], [64.2, 64.8, .7], [90.6, 90.9, .8], [94.5, 94.9, .7], [108.9, 109.5, 1]],
  flash: { clock: [255, 255, 255], devilface: [255, 60, 60], sting: [255, 60, 60], snap: [255, 255, 255], lastcard: [255, 60, 60] },
  vignette: [[0, .75], [66.2, .75], [66.9, .5], [88.1, .55], [101.1, .75]],
  heartbeat: [[47.9, 53.9], [58.4, 60]],
  // his face, beat by beat
  expr: [[0, 'glazed'], [6, 'hungry'], [9.7, 'glazed'], [16.3, 'tired'], [26.5, 'ashamed'], [27.5, 'empty'], [39.5, 'ashamed'],
    [42.5, 'empty'], [54, 'shock'], [59.3, 'resolve'], [66.9, 'strain'], [70.1, 'focus'], [75.5, 'strain'], [79.4, 'focus'], [82.4, 'strain'],
    [87.2, 'calm'], [90.7, 'strain'], [92.3, 'resolve'], [95.7, 'calm'], [102.5, 'smile'], [104.9, 'calm']],
  // the cut: [start, shot, settings]
  shots: [
    [0, 'cold', { lines: [[COLD1, .1, .7], ['…' + COLD, .8, 1.6]], out: [1.7, 1.9] }],
    [1.9, 'groom', { spot: 'window', felt: true, o: t => ({ eyes: win(t, 2.2, 3.4, .25, .01), a: .25 * win(t, 2.2, 3.4, .35, .01) }) }],
    [3.2, 'sting'],
    // night 1: it watches from the window; the first win is the bait; his sister's fees
    [3.8, 'clock', '11:52 PM'],
    [4.6, 'phone', { screen: 'vice' }],
    [6.8, 'face', 'felt'],
    [7.8, 'groom', { spot: 'window', felt: true, o: t => ({ a: .35 + .15 * inv(7.8, 9.6, t), eyes: .9 }) }],
    [9.6, 'phone', { screen: 'vice', notif: [9.8, 'msg', 'Sis', 'Did you send my college fees? ♥'], swipe: 11.5 }],
    [11.9, 'groom', { fr: [2.2, 975, 640], spot: 'window', felt: true }],
    [13.4, 'groom', { lit: false, spot: 'window', fr: [1.35, 800, 700], o: t => ({ eyes: 1 - win(t, 14.25, 14.45, .08, .08) }) }],
    // night 2: at the foot of the bed, it deals; the landlord
    [15, 'clock', '12:47 AM'],
    [15.8, 'phone', { screen: 'vice', notif: [16.6, 'warn', 'Landlord', 'Pay today or you’re out.'], swipe: 18.2 }],
    [18.4, 'groom', { spot: 'foot', creep: 40, hunch: .72, felt: true, o: () => ({ a: .7, eyes: 1, grin: .2, reach: .3 }) }],
    [20.2, 'face', 'felt'],
    [21.2, 'devilface', { spot: 'foot', o: () => ({ a: .8, grin: .5, lean: .3 }) }],
    [22.6, 'groom', { fr: [2.2, 975, 640], spot: 'foot', hunch: .72, felt: true }],
    // night 3: beside him; its claw takes his mother's chain; DOUBLE OR NOTHING takes the rest
    [23.8, 'clock', '2:16 AM'],
    [24.6, 'chain', { reach: [24.95, 25.45], pull: [25.55, 26.2] }],
    [26.4, 'phone', { screen: 'vice' }],
    [28.6, 'groom', { spot: 'beside', creep: 30, hunch: .82, o: t => ({ a: .85, eyes: 1, grin: .4, reach: .25, lean: .5 + .5 * inv(28.6, 30.4, t) }) }],
    [30.4, 'phone', { screen: 'vice', notif: [30.5, 'mom', 'Mom', 'Have you seen Grandma’s chain?'], swipe: 32.2 }],
    [32.4, 'face', 'night'],
    [33.3, 'devilface', { spot: 'beside', o: () => ({ a: .9, grin: .75, lean: 1 }) }],
    // night 4: nothing left; his sister drops out; it is right behind him, its hands on his shoulders, the cards like snow
    [34.5, 'clock', '3:58 AM'],
    [35.3, 'phone', { screen: 'vice', notif: [35.45, 'msg', 'Sis', 'I had to drop out. It’s okay ♥'], swipe: 37.3 }],
    [37.5, 'groom', { spot: 'behind', hunch: .9, o: t => ({ a: 1, eyes: 1, grin: .6, reach: .2 + .45 * inv(37.5, 39.7, t), lean: 1 }) }],
    [40.1, 'face', 'night'],
    [41.1, 'devilface', { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }],
    [42.5, 'groom', { fr: [1.6, 960, 700], spot: 'behind', hunch: .9, o: () => ({ a: 1, eyes: 1, grin: .8, reach: .65, lean: 1 }) }],
    // everything it took, faster and faster
    [44.9, 'montage', { step: .375, word: 'win it back', seq: [
      ['phone', { notif: ['msg', 'Sis', 'Did you send my college fees? ♥'] }], ['phone', { notif: ['warn', 'Landlord', 'Pay today or you’re out.'] }],
      ['phone', { notif: ['mom', 'Mom', 'Have you seen Grandma’s chain?'] }], ['face', { look: 'night', expr: 'empty' }],
      ['clock', ['4:21 AM', '4:49 AM', '5:13 AM']], ['devilface', { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }],
      ['phone', { notif: ['msg', 'Sis', 'I had to drop out. It’s okay ♥'] }], ['face', { look: 'red', expr: 'empty' }]] }],
    // it shows itself
    [47.9, 'phone', { screen: 'vice', dying: 48.7 }],
    [48.9, 'reflection', { appear: 49.2 }],
    [51.5, 'reflection', { z: 1.5 }],
    [53.9, 'groom', { spot: 'behind', hunch: .55, flicker: true, lift: LIFT, o: t => ({ a: 1, eyes: 1, grin: 1, reach: .7 + .3 * inv(53.9, 56.1, t), lean: 1 }) }],
    [56.5, 'lastcard', { deal: 56.6, flip: HIMFLIP }],
    [58.4, 'face', 'red'],
    [60, 'snap', { at: 60.6 }],
    [61.2, 'groom', { spot: 'behind', hunch: .2, flicker: true, hold: 'none', tetherCut: BURN, o: t => ({ a: 1, eyes: 1, grin: 1 - inv(BURN, BURN + .35, t),
      scream: inv(BURN, BURN + .25, t), reach: .9 - .9 * inv(BURN, BURN + .5, t), lean: 1 - 1.6 * inv(BURN, BURN + .7, t) }) }],
    [63.2, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .65 * inv(63.2, 64.8, t), eyes: 1 - .5 * inv(63.8, 64.8, t), scream: 1 - inv(64, 64.8, t), lean: -.6 }) }],
    [64.8, 'groom', { spot: 'window', hunch: .3, lit: false, hold: 'none', o: t => ({ eyes: .45 * win(t, 65.1, 66.2, .3, .2) }) }],
    // he fights back: the music turns here
    [66.2, 'clock', '6:00 AM'],
    [66.9, 'pushups'],
    [68.7, 'face', 'dawn'],
    [69.5, 'clock', '6:30 AM'],
    [70.1, 'run', { fr: [1, 960, 540], run: RUN }], [71.3, 'run', { fr: [2.4, 760, 740], run: RUN }],
    [72.5, 'run', { fr: [1.9, 800, 470], run: RUN }], [73.7, 'run', { fr: [1, 960, 540], run: RUN }],
    [74.9, 'clock', '8:00 AM'],
    [75.5, 'work', { move: 'carry', shift: 1, fr: [1.2, 820, 560] }],
    [77.2, 'work', { move: 'stack', shift: 1, fr: [1.3, 1040, 560] }],
    [78.8, 'clock', '2:00 PM'],
    [79.4, 'work', { move: 'carry', shift: 2, fr: [1.15, 900, 560] }],
    [81, 'face', 'ware'],
    [81.8, 'clock', '8:30 PM'],
    [82.4, 'gym', { move: 'pullup', fr: [1.15, 960, 520] }],
    [84, 'gym', { move: 'squat', fr: [1.35, 900, 640] }],
    [85.6, 'gym', { move: 'curl', fr: [1.75, 960, 650] }],
    [87.2, 'face', 'gym'],
    [88.1, 'clock', '9:45 PM'],
    [88.7, 'phone', { screen: 'home', notif: [88.8, 'vice', 'HOUSE', 'Payday! Your table is waiting.'] }],
    [90.6, 'devilface', { spot: 'behind', scare: true, o: () => ({ grin: 1, lean: 1 }) }],
    [91.4, 'face', 'red'],
    [92.3, 'phone', { screen: 'home', del: 92.3 }],
    [94.5, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .7 * inv(94.5, 95.7, t), scream: 1, lean: -.6 }) }],
    [95.7, 'phone', { z: 1.15, screen: 'chat', chat: { name: 'Sis', items: [
      { at: -1, text: 'I had to drop out. It’s okay.', y: 150 },
      { at: .2, text: 'First payment sent. I’m so sorry.', me: true, y: 260 },
      { at: .9, text: '•••', until: 1.4, fade: 0, y: 330 },
      { at: 1.4, text: 'I’m back in!!', fade: .15, y: 330 },
      { at: 1.7, text: '♥', fade: .15, col: [200, 50, 90] }] } }],
    [98.1, 'clock', '11:00 PM'],
    [98.7, 'sleep', { eyes: [99.5, 100.9] }],
    // weeks later: Grandma's chain is back; the mirror; the coin in the dark doorway
    [101.1, 'card', 'WEEKS LATER'],
    [102.5, 'momchat', { z: 1.15 }],
    [104.9, 'gmirror', { eyes: [200, 201] }],
    [106.7, 'gmirror', { fr: [2.1, 1290, 470], eyes: [106.8, 109.1], coin: 107.2 }],
    [109.1, 'black'],
    [109.6, 'end', { line: COLD, typeAt: 109.7, slam: 'STILL ME.', slamAt: 111.2 }],
    [113.1, 'title', { at: 113.3 }]
  ]
});
