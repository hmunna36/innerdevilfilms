'use strict';
// A Short: stretches of one film played back to back on the 1080 x 1920 canvas, each framed for the tall screen (around
// the shot's subject, unless the segment says otherwise), then an end card that sends people to the full film.
// shorts/NN-slug/short.js calls defineShort({
//   film: 'films/03-lust',                         the film folder, from the repo root
//   segments: [{ from, to, vf, slot }, …],         film time; vf [z, cx, cy] or keyframes [[u, z, cx, cy], …] (u = seconds
//                                                  into the segment); slot 'top' | 'low' | 'mid' (where its words go)
//   end: { dur, title, line, cta },                the end card (defaults: the film's title and subtitle)
//   audio: { pieces: [{ at, from, to, gain, fi, fo }], hits: [{ at, gain }] }   cut from the film's mix (default: the
// })                                               picture's own stretches, then the film after the last one under the card)
let SHORT = null;
function defineShort(s) {
  SHORT = Object.assign({ end: { dur: 2.8 } }, s);
  let at = 0;
  for (const g of SHORT.segments) { g.start = at; at += g.to - g.from; }
  SHORT.endAt = at; SHORT.dur = +(at + (SHORT.end ? SHORT.end.dur : 0)).toFixed(3);
  return SHORT;
}
const segIndex = tau => { const S = SHORT.segments; let i = 0; while (i + 1 < S.length && tau >= S[i + 1].start) i++; return i; };
function renderShort(tau) {
  if (SHORT.end && tau >= SHORT.endAt) { SEG = null; return endCard(tau - SHORT.endAt); }
  const g = SHORT.segments[segIndex(tau)], u = tau - g.start;
  SEG = g;
  renderFilm(g.from + u);
  if (u < .067 && g.start > 0 && !FILM.flash[CUR.kind]) {   // a two-frame flash on each of the Short's own cuts
    px(); ctx.fillStyle = `rgba(255,255,255,${.18 * (1 - u / .067)})`; ctx.fillRect(0, 0, OUT.w, OUT.h);
  }
}
// the end card: its eyes in the dark, the title, and the way to the full film (the Related video link sits under the
// arrow, at the bottom of the Short); everything inside the safe area
function endCard(u) {
  const e = Object.assign({ title: FILM.title, line: FILM.subtitle, cta: 'FULL FILM ON THE CHANNEL', dur: 2.8 }, SHORT.end);
  VP = { k: 1, x: 0, y: 0 }; PC = [W / 2, H / 2]; SHX = SHY = 0;
  px(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  ctx.fillStyle = '#030305'; ctx.fillRect(0, 0, OUT.w, OUT.h);
  const x = U.lowX, push = 1 + .05 * clamp(u / e.dur);
  additive(() => glow(SPR.red, x, 760, 820, .32 * (.85 + .15 * Math.sin(u * 6))));
  redEyes(x, 600, 30, E.out(inv(.1, .5, u)) * (.85 + .15 * Math.sin(u * 23) * Math.sin(u * 7)));
  ctx.setTransform(push, 0, 0, push, x * (1 - push), 960 * (1 - push));
  const sz = fitSize(e.title, 230, 740, 40, '800');
  slam(e.title, x, 880, sz, C.cream, 1, 0, u, 40 * sz / 230, '800', .3);
  slam(e.line, x, 880 + sz * .62 + 34, fitSize(e.line, 50, 740, 14, '700'), [235, 70, 70], .95, .35, u, 14, '700');
  if (u > .9) {
    const ca = E.out(inv(.9, 1.2, u));
    spaced(e.cta, x, 1330, fitSize(e.cta, 52, 740, 5, '800'), C.cream, .92 * ca, 5, '800');
    const b = Math.sin(u * 7) * 12;                       // an arrow down to the Related video link
    ctx.strokeStyle = rgba(C.cream, .85 * ca); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, 1420 + b); ctx.lineTo(x, 1560 + b); ctx.moveTo(x - 46, 1514 + b); ctx.lineTo(x, 1560 + b); ctx.lineTo(x + 46, 1514 + b); ctx.stroke();
  }
  px();
  drawVignetteFlat(.7);
}
function drawVignetteFlat(v) {
  const m = Math.min(OUT.w, OUT.h), g = ctx.createRadialGradient(OUT.w / 2, OUT.h / 2, m * .3, OUT.w / 2, OUT.h / 2, m * 1.02);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${v})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, OUT.w, OUT.h);
}
// what the Short's sound is made of (engine/audio/short_mix.py builds it from the film's mix)
function shortAudioPlan() {
  const a = SHORT.audio || {}, last = SHORT.segments[SHORT.segments.length - 1];
  const pieces = a.pieces || [...SHORT.segments.map(g => ({ at: g.start, from: g.from, to: g.to })),
    ...(SHORT.end ? [{ at: SHORT.endAt, from: last.to, to: last.to + SHORT.end.dur, fo: 1.2 }] : [])];
  const hits = a.hits || (SHORT.end ? [{ at: SHORT.endAt, gain: -8 }] : []);
  return { dur: SHORT.dur, film: SHORT.film, pieces, hits, fadeOut: a.fadeOut ?? .8 };
}
