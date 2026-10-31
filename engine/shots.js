'use strict';
// The shot library. A film's cut is a table of [start, 'shot', p]: each shot draws one set-up from film time t, its
// settings p and the time L since it started, and says what it is about (a box of the screen) so a Short can frame it.
// reference/engine.md lists every shot and setting. A film adds its own with defShot() in its film.js.

// ---------- text shots: the cold line, the clock, cards, the title ----------
const COLD_COL = [196, 212, 228];
const COLD_SIZE = 46;
// the cold opening line(s), typed on: p.lines [[text, from, to], …] (film time), p.out [from, to] fades it
defShot('cold', (t, p) => {
  const a = 1 - inv(p.out[0], p.out[1], t);
  fill([0, 0, 0]);
  if (!OUT.vertical) {
    const y0 = 545 - (p.lines.length - 1) * 45;
    p.lines.forEach(([txt, a0, a1], i) => typeLine(txt, y0 + i * 90, COLD_SIZE, inv(a0, a1, t), COLD_COL, a, t));
  } else { ui(); typeBlock(p.lines.map(([txt, a0, a1]) => [txt, inv(a0, a1, t)]), 960, 64, COLD_COL, a, t, OUT.w / 2, 860); }
});
// the time, cold and thin, lit from below by a screen: p is the label ('11:48 PM')
defShot('clock', (t, p, L = 1) => {
  const label = typeof p === 'string' ? p : p.label;
  fill([4, 5, 8]);
  additive(() => glow(SPR.blue, W / 2, 840, 760, .3 * (.92 + .08 * Math.sin(t * 11))));
  if (!OUT.vertical) slam(label, W / 2, 540, 240, [214, 224, 238], .95, t - L, t, 0, '200');
  else { ui(); slam(label, OUT.w / 2, 880, fitSize(label, 240, 780, 0, '200'), [214, 224, 238], .95, t - L, t, 0, '200'); }   // inside the Shorts safe area (x 100-980 above y 1000)
});
// a typed card ('WEEKS LATER'): p is the label
defShot('card', (t, p, L) => {
  const label = typeof p === 'string' ? p : p.label, a = 1 - inv(2.2, 2.6, L);
  fill([3, 3, 5]);
  if (!OUT.vertical) typeLine(label, 540, 52, inv(.2, 1, L), COLD_COL, a, t);
  else { ui(); typeBlock([[label, inv(.2, 1, L)]], 960, 70, COLD_COL, a, t, OUT.w / 2, 860); }
});
// the title for a split second, torn by a glitch
defShot('sting', (t, p, L) => {
  fill([3, 3, 5]);
  additive(() => glow(SPR.red, W / 2, 540, 800, .4));
  if (!OUT.vertical) slam(FILM.title, W / 2, 540, 260, C.cream, 1, t - L, t, 50, '800', .4);
  else { ui(); const sz = fitSize(FILM.title, 260, 860, 50, '800'); slam(FILM.title, OUT.w / 2, 960, sz, C.cream, 1, t - L, t, 50 * sz / 260, '800', .4); }
});
defShot('black', () => fill([2, 2, 3]));
// the cold line comes back, with its answer: p { line, typeAt, slam, slamAt }
defShot('end', (t, p) => {
  fill([3, 3, 5]);
  if (!OUT.vertical) {
    typeLine(p.line, 470, COLD_SIZE, inv(p.typeAt, p.typeAt + 1, t), COLD_COL, 1, t);
    slam(p.slam, W / 2, 610, 130, C.red, 1, p.slamAt, t, 12, '800', .6);
  } else {
    ui();                              // all above y 1000, where the Shorts safe area is still x 100-980
    const h = typeBlock([[p.line, inv(p.typeAt, p.typeAt + 1, t)]], 660, 64, COLD_COL, 1, t, OUT.w / 2, 860);
    slam(p.slam, OUT.w / 2, 660 + h / 2 + 110, fitSize(p.slam, 150, 780, 12), C.red, 1, p.slamAt, t, 12, '800', .6);
  }
});
// the title card: FILM.title, then FILM.subtitle; p { at }
defShot('title', (t, p) => {
  fill([3, 3, 5]);
  additive(() => glow(SPR.red, W / 2, 480, 700, .25));
  if (!OUT.vertical) {
    slam(FILM.title, W / 2, 470, 220, C.cream, 1, p.at, t, 46, '800', .25);
    slam(FILM.subtitle, W / 2, 620, 34, [230, 80, 80], .9, p.at + .5, t, 16, '600');
  } else {
    ui(); const sz = fitSize(FILM.title, 220, 860, 46, '800');
    slam(FILM.title, OUT.w / 2, 900, sz, C.cream, 1, p.at, t, 46 * sz / 220, '800', .25);
    slam(FILM.subtitle, OUT.w / 2, 900 + sz * .62 + 40, fitSize(FILM.subtitle, 48, 860, 16, '600'), [230, 80, 80], .9, p.at + .5, t, 16, '600');
  }
});

// ---------- his room at night ----------
// p: spot (where it stands), o(t) (the devil: a, eyes, grin, reach, lean, scream), creep (px a second it edges closer),
// hunch, lit (false: the screen is off), flicker, fr [z, cx, cy], throwAt (he throws the phone at the wall), shardsAt
const ROOM_FR = [1, 960, 560];
function roomDevil(t, p, L) {
  if (p.spot) placeDevil(p.spot);
  if (p.creep) DEVIL.x -= p.creep * L;      // it edges closer while we watch
  return devilO(p.o ? p.o(t) : {});
}
defShot('room', (t, p, L) => {
  const fr = p.fr || ROOM_FR, flick = p.flicker ? .55 + .45 * Math.abs(Math.sin(t * 31) * Math.sin(t * 7.3)) : 1;
  fill([8, 9, 14], [14, 12, 22]);
  cam(...fr);
  drawWindow(0, .14 * flick);
  drawRoom(.14 * flick, [120, 150, 220]);
  const o = roomDevil(t, p, L), lit = p.lit !== false;
  if (o.a > 0) drawDevil(t, fr, o);
  const P0 = poseSit(SIT.x, SIT.y, SIT.s, p.hunch ?? .65);
  if (o.a > .3 && p.spot !== 'window') tether(t, P0.parts[0][0][1], [DEVIL.x, DEVIL.y - 560 * DEVIL.s], o.a * (p.throwAt ? 1 - inv(p.throwAt + .35, p.throwAt + .6, t) : 1));
  const P = poseSit(SIT.x, SIT.y + Math.sin(t * 1.5) * 1.5, SIT.s, p.hunch ?? .65);
  let [hx, hy] = P.hand;
  if (p.throwAt) {                     // wind up, then throw it at the wall
    const sh = P.parts[3][0][0], up = t > p.throwAt;
    P.parts[3][0] = [sh, [sh[0] + (up ? 60 : -30), sh[1] - 70], [sh[0] + (up ? 140 : -50), sh[1] - (up ? 120 : 90)]];
    const k = inv(p.throwAt, p.throwAt + .35, t);
    hx = lerp(sh[0] - 50, 1580, k); hy = lerp(sh[1] - 90, 430, k) - Math.sin(Math.PI * k) * 120;
  }
  if (lit) additive(() => { glow(SPR.blue, hx, hy, 600, .26); glow(SPR.red, hx, hy - 40, 420, .24); });
  drawPerson(P, [5, 5, 7], lit ? mix(C.blue, C.red, .4) : [120, 120, 140], lit ? .55 : .22, 1, .25);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), lit ? { turn: .9, light: [255, 176, 196], la: .34, lc: [.4, .8] }
    : { turn: .9, light: [170, 180, 210], la: .14, lc: [-.6, -.3], featA: .75 });
  if (!(p.throwAt && t > p.throwAt + .35) && !p.shardsAt) {      // the phone in his hand
    ctx.save(); ctx.translate(hx, hy); if (p.throwAt) ctx.rotate(inv(p.throwAt, p.throwAt + .35, t) * 9);
    ctx.fillStyle = '#0d0c0f'; rrect(-15, -26, 30, 50, 6); ctx.fill();
    if (lit) { rrect(-13, -23, 26, 44, 4); ctx.clip(); if (FILM.handScreen) FILM.handScreen(t); else { ctx.fillStyle = rgba([170, 200, 255]); ctx.fillRect(-13, -23, 26, 44); } }
    ctx.restore();
  }
  if (p.throwAt) shards(t, p.throwAt + .35, 1580, 430);
  if (p.shardsAt) shards(t, p.shardsAt, 1580, 430);
  if (o.a > 0) devilArms(t, o);
  if (o.eyes > 0) devilEyes(t, o);
  if (o.a > 0) devilGrin(t, o);
  screen();
  if (o.a > .3) { ctx.fillStyle = rgba(C.red, .1 * o.a * (.6 + .4 * Math.sin(t * 5))); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}, (t, p, L, len) => {
  // him; and the devil too when it shows: both in one window if they fit, else a pan from him to it
  const save = { ...DEVIL }, o = roomDevil(t, p, L), P = poseSit(SIT.x, SIT.y, SIT.s, p.hunch ?? .65), s = DEVIL.s;
  const man = [P.head[0] - 140, P.head[1] - 120, P.head[0] + 130, SIT.y + 60];
  let box = man;
  if (o.a > .05 || o.eyes > .05) {
    const [ex, ey] = devilHead(t, o), dv = o.a > .05 ? devilBox(t, o) : [ex - 110 * s, ey - 90 * s, ex + 110 * s, ey + 90 * s];
    const u = unionBox(man, dv);
    box = u[2] - u[0] <= 720 ? u : [0, 1, 2, 3].map(i => lerp(man[i], dv[i], E.io(clamp(L / Math.max(.5, len || 1)))));
  }
  Object.assign(DEVIL, save);
  return toScreenBox(p.fr || ROOM_FR, box);
});

// ---------- faces ----------
// his face, close: p is the look ('night', 'grey', 'red', 'sun', 'shower', 'lamp', 'dawn', 'gym') or { look, expr }
defShot('face', (t, p) => typeof p === 'string' ? faceShot(t, p) : faceShot(t, p.look, p.expr && EXPR[p.expr]), t => faceBox(t));
// close on its face, wherever it stands: p { spot, o(t), twitch, scare }
function devilFaceFrame(t, p, L) {
  placeDevil(p.spot);
  const o = devilO(Object.assign({ a: 1, eyes: 1 }, p.o(t))), [hx, hy] = devilHead(t, o), s = DEVIL.s;
  const tw = p.twitch && ((L > 1.1 && L < 1.16) || (L > 1.9 && L < 1.95)) ? 1 : 0;
  return { o, fr: [(p.scare ? 2.1 : 1.5 + .12 * clamp(L / 3)) / s, hx + tw * 24 * s, hy - (p.scare ? 10 : 40) * s] };
}
defShot('devilface', (t, p, L) => {
  fill([5, 3, 4]);
  const { o, fr } = devilFaceFrame(t, p, L);
  cam(...fr);
  drawRoom(.08, [120, 60, 70]);
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  screen();
  ctx.fillStyle = rgba(C.red, .08 + .06 * Math.sin(t * 5) + (p.scare ? .5 * (1 - inv(0, .18, L)) : 0)); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}, (t, p, L) => { const { o, fr } = devilFaceFrame(t, p, L), b = devilBox(t, o); return toScreenBox(fr, [b[0], b[1] + 80 * DEVIL.s, b[2], b[3]]); });

// ---------- his phone ----------
// p: screen 'vice' (the film's app: FILM.viceScreen) | 'call' | 'chat' | 'home'; notif [t0, kind, title, text], swipe (when
// he swipes it away), dying (when the screen dies), call {…}, chat {…}, del (he deletes the app), focus 'top' (a Short
// frames the banner and the top of the screen)
function phoneScreenGlow(p) { return p.screen === 'vice' || p.screen === 'xxx' ? SPR.red : SPR.blue; }
function drawPhone(t, p, L) {
  const f = phoneFrame(L), { s, w, h, x, y } = f;
  const on = p.dying ? (t < p.dying ? (Math.sin(t * 60) > -.3 ? 1 : .15) : 0) : 1;
  additive(() => { glow(phoneScreenGlow(p), W / 2, H / 2, 900, .3 * on); glow(SPR.blue, W / 2, H / 2, 700, .12 * on); });
  ctx.fillStyle = '#0c0c10'; rrect(x - 16 * s, y - 16 * s, w + 32 * s, h + 32 * s, 66 * s); ctx.fill();
  ctx.fillStyle = '#040406'; rrect(x, y, w, h, 52 * s); ctx.fill();
  if (on > 0) {
    ctx.save(); ctx.globalAlpha = on;
    if (p.screen === 'call') callScreen(f, L, p.call);
    else if (p.screen === 'chat') chatScreen(f, L, p.chat);
    else if (p.screen === 'home') homeScreen(f, t, L, p);
    else FILM.viceScreen(x, y, w, h, s, t, 1, notifDrop(t, p));
    ctx.restore();
  }
  if (p.notif) notif(f, t, p.notif, p.swipe);
}
const phoneSubject = (t, p, L) => {
  const f = phoneFrame(L), b = phoneBox(f);
  return p.focus === 'top' ? [b[0], b[1], b[2], f.y + f.h * .58] : b;
};
defShot('phone', (t, p, L) => { fill([3, 3, 5]); drawPhone(t, p, L); }, phoneSubject);
// the screen is black: his face in the glass, and it, right behind him. p.appear: when it fades in (0: already there)
defShot('reflection', (t, p) => {
  fill([3, 3, 5]);
  const s = 1.02, w = 430 * s, h = 860 * s, x = W / 2 - w / 2, y = H / 2 - h / 2;
  ctx.fillStyle = '#0c0c10'; rrect(x - 16 * s, y - 16 * s, w + 32 * s, h + 32 * s, 66 * s); ctx.fill();
  ctx.fillStyle = '#040406'; rrect(x, y, w, h, 52 * s); ctx.fill();
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  const da = p.appear ? E.sine(inv(p.appear, p.appear + 1, t)) : 1, fr = [.9, 846, 517];
  placeDevil('behind');
  if (da > 0) {
    const o = devilO({ a: .85 * da, eyes: da, grin: p.appear ? inv(p.appear + 1.4, p.appear + 2.4, t) : 1, reach: .5, lean: 1 });
    drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  }
  screen();
  ctx.fillStyle = rgba(C.cream, .035);
  ctx.beginPath(); ctx.ellipse(W / 2, y + h * .5, 120 * s, 160 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(W / 2, y + h * .93, 260 * s, 150 * s, 0, Math.PI, 0); ctx.fill();
  face(W / 2, y + h * .5, 120 * s, exprAt(t), { turn: 0, featA: .42 });
  const sg = ctx.createLinearGradient(x, y, x + w, y + h);
  sg.addColorStop(.35, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.05)'); sg.addColorStop(.65, 'rgba(255,255,255,0)');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  ctx.restore();
}, () => { const s = 1.02, w = 430 * s, h = 860 * s; return [W / 2 - w / 2 - 20, H / 2 - h / 2 - 20, W / 2 + w / 2 + 20, H / 2 + h / 2 + 20]; });

// ---------- the montage: cuts every p.step s through what it took; p.seq [[shot, p], …], p.word on top ----------
function montageSub(p, L) { const k = Math.floor(L / (p.step || .375)); return { k, sub: L - k * (p.step || .375), it: p.seq[Math.min(k, p.seq.length - 1)] }; }
defShot('montage', (t, p, L) => {
  const { k, sub, it } = montageSub(p, L), [name, q] = it;
  if (name === 'phone') { fill([3, 3, 5]); drawPhone(t, Object.assign({ screen: 'vice' }, q, q.notif ? { notif: [t - 9, ...q.notif] } : {}), 2); }
  else if (name === 'face') faceShot(t, q.look, EXPR[q.expr]);
  else if (name === 'clock') SHOT.clock.draw(t, q[Math.min(q.length - 1, Math.floor(sub / ((p.step || .375) / q.length)))]);
  else if (name === 'devilface') SHOT.devilface.draw(t, q, sub);
  else fill([2, 2, 3]);
  if (!p.word) return;
  font(OUT.vertical ? 60 : 42, SERIF, '400', 'italic'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = rgba(C.red, .8); ctx.shadowBlur = 16; ctx.fillStyle = rgba([255, 110, 110], .85);
  if (!OUT.vertical) { screen(); ctx.fillText(p.word, 300 + rnd(k + 40) * 1300, 200 + rnd(k + 41) * 640); }
  else { ui(); ctx.fillText(p.word, 260 + rnd(k + 40) * 470, 470 + rnd(k + 41) * 1050); }
  ctx.shadowBlur = 0;
}, (t, p, L) => {
  const { sub, it } = montageSub(p, L), [name, q] = it;
  if (name === 'phone') return phoneBox(phoneFrame(2));
  if (name === 'face') return faceBox(t);
  if (name === 'devilface') return SHOT.devilface.subject(t, q, sub);
  return null;
});

// ---------- the comeback: the cold shower, the run, push-ups, the gym, sleep ----------
// 6:00 AM, cold water; its eyes in the steam: p.eyes [from, to]
defShot('shower', (t, p) => {
  faceShot(t, 'shower');
  ctx.strokeStyle = 'rgba(205,228,255,.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 70; i++) {
    const x = rnd(i + 5000) * W, sp = 900 + rnd(i + 5001) * 700, y = ((t * sp + rnd(i + 5002) * H) % (H + 200)) - 100;
    line(x, y, x - 6, y + 60);
  }
  additive(() => { for (let i = 0; i < 8; i++) glow(SPR.grey, rnd(i + 5100) * W, 120 + rnd(i + 5101) * 300 + Math.sin(t + i) * 30, 320, .1); });
  redEyes(OUT.vertical ? 1150 : 1520, 230, 22, .7 * win(t, p.eyes[0], p.eyes[1], .4, .4));
}, t => faceBox(t));
// running into the dawn; it can't keep up. p { fr, run: [from, to] (film time of the whole run) }
defShot('run', (t, p) => {
  const fr = p.fr || [1, 960, 540], u = t - p.run[0], ph = u * 2.4 * Math.PI * 2, d = u * 2.4 * 250, fade = inv(p.run[0], p.run[1], t);
  fill([40, 30, 70], [210, 130, 100]);
  additive(() => glow(SPR.amber, 1500, GROUND - 30, 900, .55));
  roadWorld(t, fr, .55, d, ph, 1);
  placeDevil('chase');
  const o = devilO({ a: .55 - .3 * fade, eyes: .9 - .5 * fade, grin: .3, lean: .4 });
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
}, (t, p) => {
  const fr = p.fr || [1, 960, 540], u = t - p.run[0];
  return toScreenBox(fr, poseBox(poseWalk(760, GROUND, 1.05, u * 2.4 * Math.PI * 2, 1), 60));
});
// push-ups on the bedroom floor at dawn; its eyes in the window fade out
defShot('pushups', (t, p, L) => {
  fill([40, 46, 58], [70, 72, 80]);
  cam(...(p && p.fr || [1, 960, 600]));
  drawWindow(1, .3); drawRoom(.3, [200, 204, 214]);
  const P = posePushup(780, 860, 1.2, rep(L, 1.4));
  drawPerson(P, [8, 8, 11], [255, 220, 180], .5, -1, -.5);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), { turn: 1, light: [255, 220, 180], la: .3, lc: [-.4, -.6] });
  placeDevil('window');
  devilEyes(t, devilO({ eyes: .4 * (1 - inv(0, 1.6, L)) }));
}, (t, p, L) => toScreenBox(p && p.fr || [1, 960, 600], poseBox(posePushup(780, 860, 1.2, .5), 50)));
// at the gym: p.move 'pullup' | 'squat' | 'curl', p.fr
function gymPose(p, L) {
  if (p.move === 'pullup') return posePullup(950, 300, 1.05, rep(L, 1.1));
  if (p.move === 'squat') return poseSquat(900, 860, 1.1, rep(L, 1));
  return poseCurl(940, 860, 1.05, rep(L, 1.3));
}
defShot('gym', (t, p, L) => {
  gymBg(p.fr || [1, 960, 540]);
  const lit = [255, 210, 150];
  if (p.move === 'pullup') {
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 16; ctx.lineCap = 'round';
    line(760, 860, 760, 300); line(1160, 860, 1160, 300);
    ctx.strokeStyle = rgba([220, 220, 230], .8); ctx.lineWidth = 10; line(740, 300, 1180, 300);
  }
  const P = gymPose(p, L);
  drawPerson(P, [10, 9, 10], lit, .6, 0, -1);
  face(P.head[0], P.head[1], P.head[2], exprAt(t), { turn: 1, light: lit, la: .32, lc: [.3, -.8] });
  if (P.bar) { plate(P.bar[0], P.bar[1], 74); ctx.fillStyle = '#d8d8de'; rrect(P.bar[0] - 8, P.bar[1] - 8, 16, 16, 4); ctx.fill(); }
  if (P.db) { ctx.strokeStyle = '#cfcfd6'; ctx.lineWidth = 8; line(P.db[0] - 26, P.db[1], P.db[0] + 26, P.db[1]); plate(P.db[0] - 26, P.db[1], 20); plate(P.db[0] + 26, P.db[1], 20); }
}, (t, p, L) => {
  const P = gymPose(p, .25), b = poseBox(P, 60);
  if (P.bar) { b[0] = Math.min(b[0], P.bar[0] - 90); b[1] = Math.min(b[1], P.bar[1] - 90); }
  if (p.move === 'pullup') b[1] = Math.min(b[1], 270);
  return toScreenBox(p.fr || [1, 960, 540], b);
});
// asleep, no phone; it watches from the window, smaller now: p.eyes [from, to]
defShot('sleep', (t, p) => {
  fill([8, 9, 14], [14, 12, 22]);
  cam(1, 960, 560);
  drawWindow(0, .14); drawRoom(.14, [120, 150, 220]);
  const P = poseLie(680, 762, 1.1);
  drawPerson(P, [5, 5, 7], [150, 160, 200], .18, -1, -.4);
  face(P.head[0], P.head[1], P.head[2], EXPR.sleep, { turn: .9, light: [170, 180, 210], la: .12, lc: [-.6, -.3], featA: .7 });
  placeDevil('window');
  devilEyes(t, devilO({ eyes: .5 * win(t, p.eyes[0], p.eyes[1], .5, .4) }));
}, () => toScreenBox([1, 960, 560], [380, 380, 1260, 820]));
// weeks later: he's fine. Behind him, in the dark doorway, it opens its eyes: p.eyes [from, to]
defShot('mirror', (t, p) => {
  fill([150, 156, 166], [112, 118, 128]);
  const mx = W / 2, my = 520, mw = 980, mh = 700;
  ctx.fillStyle = '#5a5f68'; rrect(mx - mw / 2 - 18, my - mh / 2 - 18, mw + 36, mh + 36, 30); ctx.fill();
  ctx.save(); rrect(mx - mw / 2, my - mh / 2, mw, mh, 22); ctx.clip();
  const g = ctx.createLinearGradient(0, my - mh / 2, 0, my + mh / 2); g.addColorStop(0, '#2d323b'); g.addColorStop(1, '#1b1f26');
  ctx.fillStyle = g; ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
  const dx = mx + 250, dy = my - 260;
  ctx.fillStyle = '#030304'; ctx.fillRect(dx, dy, 170, 560);
  const ea = win(t, p.eyes[0], p.eyes[1], .2, .01);
  if (ea > 0) { additive(() => glow(SPR.red, dx + 85, dy + 160, 220, .35 * ea)); redEyes(dx + 85, dy + 140, 16, ea); }
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
}, () => [W / 2 - 300, 220, W / 2 + 470, 870]);

// ---------- the code-drawn thumbnail (the cloud uploads it; the ChatGPT one replaces it from the Mac) ----------
// FILM.thumb { word: 'LUST', hook: 'IT WATCHES', expr: 'fear', spot: [x, y, scale] }: the channel's rule (channel/CHANNEL.md):
// the topic word is the biggest thing, in fat white letters with a red edge, the hook small under it, never naming the
// devil ("IT …"). Its face huge on the right with the grin, his terrified face lower left lit red. Read it at 320 px.
defShot('thumb', (t, p) => {
  const q = Object.assign({ word: FILM.title, hook: '', expr: 'fear', spot: [1150, 1700, 1.4] }, p || FILM.thumb || {});
  fill([16, 2, 5], [70, 6, 12]);
  additive(() => { glow(SPR.red, 1300, 520, 1100, .55); glow(SPR.red, 600, 900, 700, .35); });
  placeDevil(q.spot);
  const o = devilO({ a: 1, eyes: 1, grin: 1, lean: .15, smoke: .25 }), fr = [1, W / 2, H / 2];
  drawDevil(t, fr, o); devilEyes(t, o); devilGrin(t, o);
  screen();
  const x = 560, y = 760, r = 240;                                   // his face, lower left, turned toward it
  ctx.fillStyle = rgba([255, 90, 90], .55); ctx.beginPath(); ctx.arc(x + 8, y - 4, r + 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba([10, 5, 7]);
  ctx.beginPath(); ctx.ellipse(x - 20, y + r * 2.05, r * 1.7, r * 1.15, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - r * .36, y + r * .55, r * .62, r * .9);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  face(x, y, r, EXPR[q.expr], { turn: .7, light: [255, 110, 110], la: .45, lc: [.8, -.2] });
  px(); drawVignetteFlat(.55); screen();
  const big = (txt, x0, y0, size, track) => {                         // fat white capitals with a red edge
    font(size, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if ('letterSpacing' in ctx) ctx.letterSpacing = track + 'px';
    ctx.shadowColor = 'rgba(255,20,30,.95)'; ctx.shadowBlur = size * .22;
    ctx.lineWidth = size * .16; ctx.strokeStyle = 'rgb(200,10,24)'; ctx.strokeText(txt, x0, y0);
    ctx.shadowBlur = 0; ctx.lineWidth = size * .07; ctx.strokeStyle = '#000'; ctx.strokeText(txt, x0, y0);
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x0, y0);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    return ctx.measureText(txt).width;
  };
  font(300, SANS, '900'); const size = Math.min(300, 300 * 1000 / ctx.measureText(q.word).width);
  big(q.word, 70, 60 + size * .5, size, 4);
  if (q.hook) big(q.hook, 78, 60 + size * 1.08 + 46, Math.min(92, size * .34), 2);
});
