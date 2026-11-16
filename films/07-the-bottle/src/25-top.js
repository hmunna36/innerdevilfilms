// ---------- THE BAR FROM ABOVE: what he slides across. His side is the left, its side the right ----------
function topWood(t, o = {}) {
  const red = o.red ?? .25;
  fill([70, 40, 24], [44, 24, 16]);
  screen();
  ctx.fillStyle = lg(0, 0, W, 0, [[0, [96, 56, 30]], [.55, [72, 40, 24]], [1, mix([60, 30, 20], [110, 24, 20], red)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
}
function topGrain(t, o = {}) {                       // in the camera: grain, rings left by glasses, the lamp's pool, its red light
  const red = o.red ?? .25;
  for (let i = 0; i < 46; i++) {
    const x = -400 + i * 62 + rnd(i * 3) * 40, a = .05 + rnd(i * 7) * .09;
    ctx.strokeStyle = rgba(rnd(i) < .5 ? [30, 14, 8] : [150, 96, 56], a); ctx.lineWidth = 2 + rnd(i * 5) * 5;
    ctx.beginPath(); ctx.moveTo(x, -400); ctx.bezierCurveTo(x + 30 * (rnd(i * 2) - .5), 200, x + 40 * (rnd(i * 9) - .5), 700, x + 10, 1500); ctx.stroke();
  }
  ctx.lineWidth = 5; for (const [x, y, r] of [[420, 250, 62], [520, 820, 62], [300, 610, 62], [1120, 180, 62]]) { ctx.strokeStyle = rgba([24, 10, 6], .22); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
  additive(() => { lite(PAL.amber, o.lx ?? 760, o.ly ?? 480, 820, .42 * (o.lamp ?? 1)); lite([255, 60, 44], 2150, 540, 1000, .5 * red + .1); });
}
function topGlass(x, y, r, level = 0) {
  ctx.fillStyle = rgba([0, 0, 0], .28); ctx.beginPath(); ctx.ellipse(x + 16, y + 20, r * 1.02, r * 1.02, 0, 0, TAU); ctx.fill();
  if (level > .02) { disc(x, y, r * .9, rg(x - r * .2, y - r * .2, 0, r, [[0, [255, 190, 90], .95], [1, [176, 84, 16], .95]])); additive(() => lite(PAL.amber, x, y, r * 2.2, .35)); }
  else disc(x, y, r * .9, rgba([190, 230, 225], .12));
  ctx.strokeStyle = rgba([235, 255, 250], .85); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba([255, 255, 255], .7); ctx.lineWidth = r * .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r * .74, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
}
function topWatch(x, y, rot, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = rgba([0, 0, 0], .3); rrect(-190 + 10, -30 + 14, 380, 60, 14); ctx.fill();
  ctx.fillStyle = lg(0, -30, 0, 30, [[0, [86, 56, 38]], [1, [50, 30, 20]]]); rrect(-190, -30, 380, 60, 14); ctx.fill();
  ctx.fillStyle = rgba([24, 12, 8], .6); for (let i = 0; i < 5; i++) disc(-170 + i * 22, 0, 4);
  disc(0, 0, 76, rgba(PAL.brass)); disc(0, 0, 64, rgba([250, 240, 214]));
  ctx.strokeStyle = rgba([40, 26, 16]); ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.lineWidth = i % 3 ? 2 : 5; line(Math.sin(a) * 50, -Math.cos(a) * 50, Math.sin(a) * 58, -Math.cos(a) * 58); }
  const h = 5.1 / 12 * TAU, m = .1 * TAU + t * .02;
  ctx.lineWidth = 7; line(0, 0, Math.sin(h) * 30, -Math.cos(h) * 30); ctx.lineWidth = 5; line(0, 0, Math.sin(m) * 46, -Math.cos(m) * 46);
  specular(ctx, -20, -26, 40, 16, -.5, .5);
  ctx.restore();
}
// his phone lying on the bar, ringing: o.ring 0-1, o.dead (screen off)
function topPhone(x, y, rot, s, t = 0, o = {}) {
  const ring = o.ring ?? 1, jx = ring ? Math.sin(t * 75) * 3 * ring : 0;
  ctx.save(); ctx.translate(x + jx, y); ctx.rotate(rot + jx * .003); ctx.scale(s, s);
  ctx.fillStyle = rgba([0, 0, 0], .35); rrect(-100 + 12, -205 + 16, 200, 410, 30); ctx.fill();
  ctx.fillStyle = '#0b0b10'; rrect(-100, -205, 200, 410, 30); ctx.fill();
  if (!o.dead) {
    ctx.save(); rrect(-90, -195, 180, 390, 22); ctx.clip();
    ctx.fillStyle = lg(0, -195, 0, 195, [[0, [34, 112, 72]], [1, [8, 34, 24]]]); ctx.fillRect(-90, -195, 180, 390);
    for (let k = 0; k < 3; k++) { const q = ((t * 1.3 + k / 3) % 1); ctx.strokeStyle = rgba([170, 255, 200], .5 * (1 - q) * ring); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -84, 36 + q * 60, 0, TAU); ctx.stroke(); }
    disc(0, -84, 36, rgba([210, 255, 225]));
    ctx.fillStyle = rgba([40, 110, 76]); rectf(-17, -92, 34, 24, rgba([40, 110, 76])); poly([[-22, -92], [0, -108], [22, -92]], rgba([40, 110, 76]));     // a small school house
    font(34, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([240, 255, 244]); ctx.fillText('SCHOOL', 0, 8);
    font(17, SANS, '500'); ctx.fillStyle = rgba([200, 240, 214], .8); ctx.fillText('calling…', 0, 44);
    disc(-44, 132, 27, rgba([232, 72, 62])); disc(44, 132, 27, rgba([70, 214, 116]));
    ctx.restore();
    additive(() => lite([110, 255, 170], 0, 0, 380, .3));
  }
  ctx.restore();
}
const topItem = (what, x, y, rot, t, o = {}) => what === 'watch' ? topWatch(x, y, rot, 1.25, t) : what === 'phone' ? topPhone(x, y, rot, 1.05, t, o) : lilyPhoto(x, y, 230, 270, { rot, border: 14, wave: 1 });

// ---------- TRADE: he slides it across; its claw takes it. p.what 'watch' | 'phone' | 'photo'; p.u0 / p.u1 play a part of it (the replays) ----------
function topTrade(t, p, L, len) {
  const what = p.what || 'watch', u = lerp(p.u0 ?? 0, p.u1 ?? 1, clamp(L / len)), red = p.red ?? { watch: .2, phone: .35, photo: .55 }[what];
  topWood(t, { red });
  const sl = what === 'photo' ? seg(u, .08, .7, E.io) : seg(u, .34, .86, E.io), ox = lerp(700, 1330, sl), oy = 520 + Math.sin(sl * Math.PI) * -14;
  const fr = kcam(L, len, [[0, 1.12, 900, 540], [1, 1.2, 1080, 540]], { hand: .3, t });
  topGrain(t, { red });
  topGlass(330, 250, 92, what === 'watch' ? .1 : .5); if (what !== 'watch') topGlass(180, 420, 92, 0); if (what === 'photo') { topGlass(260, 760, 92, 0); topGlass(450, 880, 92, 0); }
  const take = seg(u, .86, 1, E.in), grabbed = take * 520;
  topItem(what, ox + grabbed, oy, { watch: .25, phone: -.12, photo: .1 }[what] + sl * .2, t, { ring: 1 });
  // its claw: waiting open, then closing on it and drawing it away
  const tapK = what === 'watch' ? Math.max(pulse(u, .06, .14, .03, .03), pulse(u, .19, .27, .03, .03)) : 0;
  if (what === 'watch' && u < .34) claw([lerp(1500, 1230, seg(u, 0, .08)) + grabbed, 420 + tapK * 50], Math.PI - .35, 1.7, { point: 1, arm: 900, side: 1 });
  else claw([lerp(2300, 1760, seg(u, .3, .6, E.out)) + grabbed, 540], Math.PI, 1.9, { curl: lerp(.05, .5, seg(u, .84, .95)), spread: 1.3, arm: 900, side: 1 });
  // his hand: the watch is still on his wrist at first; then his fingers push it away from him
  if (what === 'watch' && u < .34) manHand([lerp(560, 300, seg(u, .26, .34)), 560], .0, { s: 1.5, curl: .35, arm: 1200 });
  else { const hx = Math.min(ox - 250, lerp(300, 1100, sl)) - seg(u, .88, 1) * 300; manHand([hx, oy + 60], -.08, { s: 1.5, curl: .12, arm: 1200, pinch: .1 }); }
  if (p.tint) { screen(); ctx.fillStyle = rgba([255, 30, 30], p.tint); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
}
shot('trade', topTrade, { bloom: .45, grain: .6 }, [420, 180, 1500, 900]);

// ---------- PHONE ON THE BAR: it lights and rings. SCHOOL ----------
function topPhoneBar(t, p, L, len) {
  topWood(t, { red: .3 });
  const fr = kcam(L, len, [[0, 1.0, 900, 540], [1, 1.5, 800, 520]], { hand: .3, t }), on = seg(L, .1, .2);
  topGrain(t, { red: .3, lx: 520 });
  topGlass(330, 250, 92, .55); topGlass(180, 420, 92, 0);
  topPhone(790 + L * 10, 520, -.12, 1.05, t, { ring: on, dead: on < .5 });
  manHand([lerp(340, 300, seg(L, .5, 1.2)), 820], -.5, { s: 1.5, curl: lerp(.3, .6, seg(L, .5, 1.1)), arm: 1200 });
  blurred(10, () => claw([2150, 420], Math.PI + .2, 2.4, { curl: .2, arm: 600, side: 1 }));
}
shot('phonebar', topPhoneBar, { bloom: .5, grain: .6 }, [500, 100, 1100, 960]);

// ---------- GRAB: among the broken glass, his phone still ringing, and her photo. He takes both ----------
function topGrab(t, p, L, len) {
  topWood(t, { red: .15 });
  const fr = kcam(L, len, [[0, 1.15, 960, 540], [1, 1.3, 900, 540]], { hand: .5, t }), g = seg(L, .3, .62, E.out), out = seg(L, .66, 1.05, E.in);
  topGrain(t, { red: .15 });
  for (let i = 0; i < 26; i++) {                                           // glass everywhere
    const x = 200 + rnd(i * 3 + 1) * 1500, y = 80 + rnd(i * 5 + 2) * 920, r = 14 + rnd(i * 7) * 40;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rnd(i) * 6); ctx.fillStyle = rgba([200, 250, 240], .28); ctx.strokeStyle = rgba([240, 255, 250], .8); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r, -r * .4); ctx.lineTo(r * .8, -r * .7); ctx.lineTo(r * .3, r * .8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  const dx = -out * 1700;
  lilyPhoto(1010 + dx * (g > .9 ? 1 : 0), 640, 230, 270, { rot: .16 - out * .3, border: 14, wave: 1 });
  topPhone(760 + dx * (g > .9 ? 1 : 0), 440, -.2 + out * .2, 1.05, t, { ring: 1 });
  manHand([lerp(-200, 640, g) + dx, 560], -.02, { s: 1.7, curl: lerp(.1, .7, seg(L, .5, .66)), arm: 1400, pinch: .8, rim: PAL.amber });
}
shot('grab', topGrab, { bloom: .5, grain: .6 }, [500, 200, 1300, 900]);
