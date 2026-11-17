// ---- THE EDIT (second cut, 17 Nov 2026: a hook first, a cut about every 1.4 s) ----
// The shots above are the source, timed by cues.js. The edit plays pieces of them: cut(shot, { a, b: the piece in the
// shot's own seconds, sp: speed, cam: [zoom, x, y] a punch-in on a point of the frame }). blink() is a beat of black.
const EDIT = []; let _et = 0;
function cut(src, o = {}) { const s = SHOTS.find(x => x.name === src); if (!s) throw new Error('no shot ' + src); const a = o.a ?? 0, b = o.b ?? (s.b - s.a), sp = o.sp ?? 1, d = (b - a) / sp; EDIT.push({ s, a, b, sp, cam: o.cam, t0: _et, t1: _et + d }); _et += d; }
function blink(d = .12) { EDIT.push({ black: true, t0: _et, t1: _et + d }); _et += d; }
cut('hk1'); cut('hk2'); cut('hk3');
cut('a21', { a: 0, b: 2.6, sp: 1.37 }); cut('a21', { a: 2.6, b: 5.6, sp: 1.3 }); cut('a21', { a: 5.6, b: 7.4, sp: 1.6 }); cut('a21', { a: 7.4, b: 10.4, sp: 1.43 }); cut('a21', { a: 10.4, b: 13.5, sp: 1.19 });
blink();
cut('a26', { a: 0, b: .4, sp: 1.3 }); cut('a26', { a: .4, b: 1.75, sp: 1.35, cam: [2.2, 830, 570] }); cut('a26', { a: 1.75, sp: 1.25 });
cut('sip26', { sp: 1.3 }); cut('wall26', { sp: 1.4 });
blink();
cut('a31', { sp: 1.5 });
cut('flask', { a: 0, b: .9, sp: 1.3 }); cut('flask', { a: .9, b: 1.95, sp: 1.3, cam: [1.4, 640, 790] }); cut('flask', { a: 1.95, sp: 1.25 });
cut('drink31', { sp: 1.2 });
blink();
cut('a34', { sp: 1.5 }); cut('bar34', { sp: 1.37 });
cut('dinner', { a: 0, b: .75, sp: 1.3 }); cut('dinner', { a: .75, b: 1.4, sp: 1.3, cam: [2.2, 730, 600] }); cut('dinner', { a: 1.4, b: 2.3, sp: 1.3, cam: [2.0, 1290, 560] }); cut('dinner', { a: 2.3, sp: 1.4 });
cut('swell34', { sp: 1.2 });
blink();
cut('a38', { sp: 1.6 }); cut('claws', { sp: 1.28 });
cut('lean38', { a: 0, b: .55, sp: 1.2, cam: [2.3, 330, 740] }); cut('lean38', { a: .55, sp: 1.2 });
cut('truth', { a: 0, b: 1.2, sp: 1.3 }); cut('truth', { a: 1.2, b: 2.0, sp: 1.25, cam: [2.2, 1400, 560] }); cut('truth', { a: 2.0, sp: 1.3 });
cut('fridge', { sp: 1.33 });
cut('inside', { sp: 1.33 }); cut('pound', { sp: 1.2 }); cut('floor', { sp: 1.4 });
cut('sink', { a: 0, b: 1.1, sp: 1.25 }); cut('sink', { a: 1.1, b: 2.1, sp: 1.25, cam: [1.55, 1380, 500] }); cut('sink', { a: 2.1, sp: 1.2 });
blink();
cut('day1', { a: 0, b: .7, sp: 1.3, cam: [2.2, 700, 760] }); cut('day1', { a: .7, sp: 1.4 });
cut('run', { sp: 1.5 });
cut('day14', { a: 0, b: 1.2, sp: 1.3 }); cut('day14', { a: 1.2, b: 1.9, sp: 1.3, cam: [2.2, 860, 760] }); cut('day14', { a: 1.9, sp: 1.3 });
cut('day40', { a: 0, b: 2.1, sp: 1.4 }); cut('day40', { a: 2.1, b: 2.9, sp: 1.3, cam: [2.4, 1470, 650] }); cut('day40', { a: 2.9, sp: 1.35 });
cut('day60', { sp: 1.15 }); cut('tempt', { sp: 1.4 }); cut('handShot', { sp: 1.15 });
cut('day90', { sp: 1.3 }); cut('lower', { sp: 1.2 }); cut('shelf', { sp: 1.25 });
cut('newDraw', { sp: 1.3 }); cut('samFace', { sp: 1.35 });
cut('kneel', { a: 0, b: 1.5, sp: 1.2 }); cut('kneel', { a: 1.5, b: 2.5, sp: 1.2, cam: [1.9, 1030, 660] }); cut('kneel', { a: 2.5, sp: 1.15 });
cut('night', { a: 0, b: 2.2, sp: 1.3 }); cut('night', { a: 2.2, b: 3.3, sp: 1.2, cam: [1.8, 990, 520] }); cut('night', { a: 3.3, sp: 1.2 });
cut('black', { sp: 1.15 });
const END2 = _et;
FILM = function (t) {
  t = clamp(t, 0, END2 - 1e-4); const e = EDIT.find(e => t >= e.t0 && t < e.t1);
  rectf(0, 0, W, H, rgba(D.stage));
  if (e && !e.black) { const s = e.s, L = e.a + (t - e.t0) * e.sp; OVER = [];
    ctx.save(); if (e.cam) { const [z, cx, cy] = e.cam; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); }
    s.fn(L, L / (s.b - s.a), s.a + L, n => CUE[n] - s.a); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    const q = OVER; OVER = null; if (s.count) counter(s.count); for (const f of q) f(); }
  else if (e && e.black) rectf(0, 0, W, H, 'rgb(3,3,4)');
  finish({ bloom: .07, grain: .03, vignette: .5, t });
  const out = seg(t, END2 - .5, END2 - .05); if (out > 0) rectf(0, 0, W, H, `rgba(0,0,0,${out})`);
};
// the edit's own times for the sound: every cue that is on screen, every cut
function EDITCUES() { const cues = {}; for (const [n, v] of Object.entries(CUE)) { if (typeof v !== 'number') continue; const e = EDIT.find(e => !e.black && v >= e.s.a + e.a - 1e-6 && v < e.s.a + e.b - 1e-6); if (e) cues[n] = +(e.t0 + (v - e.s.a - e.a) / e.sp).toFixed(3); }
  return { END: +END2.toFixed(3), cues, cuts: EDIT.map((e, i) => ({ t: +e.t0.toFixed(3), kind: e.black ? 'black' : e.cam ? 'punch' : i && EDIT[i - 1].s === e.s && EDIT[i - 1].cam ? 'back' : 'cut', shot: e.black ? null : e.s.name })) }; }
