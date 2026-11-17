'use strict';
// Look C: "SMOKE AND GLASS". The devil is made of the drink: a living body of whisky-coloured liquid and smoke.
// People are painterly: natural proportions, soft modelled forms, a warm key light, a cool fill, a bright rim.
// Everything is a pure function of t. Figures are reusable: dad(o), lily(o), devil(o), devilHead(o), humanHead(o).

// ---------- palette (RGB) ----------
const AMB = { core: [96, 30, 8], deep: [146, 56, 12], mid: [206, 100, 22], edge: [255, 160, 54], hot: [255, 212, 156], white: [255, 245, 232], ink: [46, 10, 3] };
const ICE = { lit: [240, 248, 255], mid: [170, 212, 240], dk: [96, 146, 190] };
const YEL = [255, 216, 44], YEL_SH = [214, 150, 20];           // Lily's yellow: the only yellow anywhere
const SHIRT = [236, 238, 244], TIE = [50, 92, 122], TROU = [44, 50, 68], SHOE = [58, 40, 34];
const SKIN_DAD = { base: [226, 170, 134], lit: [255, 220, 186], sh: [150, 92, 84], lip: [186, 108, 100], blush: [222, 128, 108] };
const SKIN_LILY = { base: [240, 190, 154], lit: [255, 230, 204], sh: [176, 112, 100], lip: [214, 112, 110], blush: [244, 132, 118] };
const HAIR = { base: [42, 30, 30], mid: [70, 50, 44], lit: [128, 92, 70] };

// ---------- offscreen layers (full-frame, pooled) ----------
const _free = [];
function newLayer() { const c = _free.pop() || Object.assign(document.createElement('canvas'), { width: W, height: H }); const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.clearRect(0, 0, W, H); return c; }
function freeLayer(...cs) { for (const c of cs) if (c) _free.push(c); }
// run fn with the global ctx pointed at layer c (same transform as the caller unless ident)
function onLayer(c, fn, ident = false) { const prev = ctx, g = c.getContext('2d'); g.save(); g.setTransform(ident ? new DOMMatrix() : prev.getTransform()); ctx = g; try { fn(); } finally { ctx = prev; g.restore(); } return c; }
function put(c, a = 1, op = 'source-over', filter, dx = 0, dy = 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.globalCompositeOperation = op; if (filter) ctx.filter = filter; ctx.drawImage(c, dx, dy); ctx.restore(); }
const scl = () => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b); };
// draw fn only where layer B already has paint, blended with op
function atop(B, op, a, fn) { const T = newLayer(); onLayer(T, fn); onLayer(T, () => put(B, 1, 'destination-in'), true); onLayer(B, () => put(T, a, op), true); freeLayer(T); }
// a copy of layer M kept only near the edges that face direction (dx, dy) (screen px): the rim / shadow band trick
function edgeBand(M, dx, dy, blur = 0) { const E = newLayer(); onLayer(E, () => { put(M); put(M, 1, 'destination-out', blur ? `blur(${blur.toFixed(1)}px)` : null, -dx, -dy); }, true); return E; }
function tint(L, col, a = 1) { onLayer(L, () => { ctx.globalCompositeOperation = 'source-in'; ctx.fillStyle = rgba(col, a); ctx.fillRect(0, 0, W, H); }, true); return L; }

// ---------- SVG filters for canvas (ctx.filter = url(#id)) ----------
function svgFilter(id, body) {
  let host = document.getElementById('c-svg');
  if (!host) { host = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); host.setAttribute('id', 'c-svg'); host.setAttribute('width', '0'); host.setAttribute('height', '0'); host.style.position = 'absolute'; document.body.appendChild(host); }
  if (!document.getElementById(id)) host.insertAdjacentHTML('beforeend', `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">${body}</filter>`);
  return `url(#${id})`;
}
// colour of the liquid by depth (0 = thin tips, .5 = a flat edge, 1 = deep core)
function liquidRamp(heat = 0) {
  const R = [[0, [255, 214, 160]], [.3, [255, 204, 138]], [.44, [255, 176, 76]], [.52, [250, 152, 50]], [.62, [232, 124, 32]], [.72, [204, 98, 22]], [.82, [166, 70, 15]], [.92, [126, 46, 10]], [1, [94, 28, 8]]];
  const hot = c => heat ? mix(c, [Math.min(255, c[0] * 1.06), c[1] * .62, c[2] * .5], heat) : c;
  const at = d => { for (let i = 1; i < R.length; i++) if (d <= R[i][0]) return hot(mix(R[i - 1][1], R[i][1], inv(R[i - 1][0], R[i][0], d))); return hot(R[R.length - 1][1]); };
  const N = 25, ch = [[], [], []]; for (let i = 0; i < N; i++) { const c = at(i / (N - 1)); for (let j = 0; j < 3; j++) ch[j].push((c[j] / 255).toFixed(3)); }
  return ch.map(a => a.join(' '));
}
function liqFilter(goo, depth, heat = 0) {
  goo = Math.max(.6, Math.round(goo * 2) / 2); depth = Math.max(1, Math.round(depth)); const hk = Math.round(heat * 4);
  const sl = Math.max(2, 1.75 * goo), ic = -(sl - 1) / 2, [r, g, b] = liquidRamp(hk / 4);
  return svgFilter(`liq_${String(goo).replace('.', '_')}_${depth}_${hk}`, `
    <feGaussianBlur in="SourceAlpha" stdDeviation="${goo}" result="b1"/>
    <feComponentTransfer in="b1" result="goo"><feFuncA type="linear" slope="${sl}" intercept="${ic}"/></feComponentTransfer>
    <feGaussianBlur in="goo" stdDeviation="${depth}" result="b2"/>
    <feColorMatrix in="b2" type="matrix" values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 0" result="dm"/>
    <feComponentTransfer in="dm" result="col"><feFuncR type="table" tableValues="${r}"/><feFuncG type="table" tableValues="${g}"/><feFuncB type="table" tableValues="${b}"/><feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"/></feComponentTransfer>
    <feComposite in="col" in2="goo" operator="in"/>`);
}
// the inset contour highlight: a thin line a little inside the edge
function specFilter(goo, depth) {
  goo = Math.max(.6, Math.round(goo * 2) / 2); depth = Math.max(1, Math.round(depth)); const sl = Math.max(2, 1.75 * goo), ic = -(sl - 1) / 2;
  return svgFilter(`spec_${String(goo).replace('.', '_')}_${depth}`, `
    <feGaussianBlur in="SourceAlpha" stdDeviation="${goo}" result="b1"/>
    <feComponentTransfer in="b1" result="goo"><feFuncA type="linear" slope="${sl}" intercept="${ic}"/></feComponentTransfer>
    <feGaussianBlur in="goo" stdDeviation="${depth}" result="b2"/>
    <feComponentTransfer in="b2" result="line"><feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 .1 .9 1 .5 0 0 0 0 0 0 0"/></feComponentTransfer>
    <feFlood flood-color="#fff6ea" result="w"/><feComposite in="w" in2="line" operator="in"/>`);
}
function wispFilter(seed = 3, amt = 40, freq = .011, blur = 3) {
  return svgFilter(`wisp_${seed}_${amt}_${String(freq).replace('.', '_')}_${blur}`, `
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="${amt}" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="${blur}"/>`);
}

// ---------- the liquid body ----------
// maskFn paints the silhouette (any opaque colour) in the caller's transform. The union is melted into one smooth
// body, coloured by depth (thin = bright and clear, thick = dark core), lit from o.lx/o.ly, given an inset highlight,
// a halo of its own light, and (o.refract) the room seen through it. innerFn draws things suspended inside.
const LIGHT = { lx: -.62, ly: -.78 };
function liquid(maskFn, o = {}, innerFn) {
  const s = scl(), depth = (o.depth ?? 22) * s, goo = (o.goo ?? 3) * s, lx = o.lx ?? LIGHT.lx, ly = o.ly ?? LIGHT.ly, heat = o.heat || 0;
  const M = newLayer(); onLayer(M, maskFn);
  const B = newLayer(); onLayer(B, () => put(M, 1, 'source-over', liqFilter(goo, depth, heat)), true);
  // light gathers on the side away from the lamp and at the bottom; the lamp side goes a little deeper
  const far = edgeBand(B, -lx * depth * 1.5, -ly * depth * 1.5, depth * .8); tint(far, heat ? [255, 150, 90] : [255, 190, 96]);
  onLayer(B, () => { ctx.globalCompositeOperation = 'source-atop'; put(far, .5, 'source-atop'); }, true);
  const near = edgeBand(B, lx * depth * 1.2, ly * depth * 1.2, depth * .9); tint(near, heat ? [110, 10, 0] : [120, 40, 6]);
  onLayer(B, () => put(near, .22, 'source-atop'), true);
  freeLayer(far, near);
  if (innerFn) atop(B, 'source-over', 1, innerFn);
  // inset highlight on the edges that face the lamp
  if (o.spec !== 0) {
    const S = newLayer(); onLayer(S, () => put(M, 1, 'source-over', specFilter(goo, depth * .55)), true);
    const band = edgeBand(B, lx * depth * 1.6, ly * depth * 1.6, depth * .5);
    onLayer(S, () => put(band, 1, 'destination-in'), true);
    onLayer(B, () => { put(S, (o.spec ?? .8) * .5, 'source-atop', `blur(${(1.2 * s + .6).toFixed(1)}px)`); put(S, o.spec ?? .8, 'source-atop'); }, true);
    freeLayer(S, band);
  }
  // onto the picture: halo, the room seen through the body, the body
  const halo = o.halo ?? .5;
  if (halo > 0) { const Hh = newLayer(); onLayer(Hh, () => put(M, 1, 'source-over', `blur(${(depth * 1.6 + 8).toFixed(1)}px)`), true); tint(Hh, heat ? [255, 90, 40] : [255, 140, 44]); put(Hh, halo, 'lighter'); freeLayer(Hh); }
  if (o.refract) {
    const R = newLayer(), main = ctx.canvas, [cx, cy] = o.refractC || [W / 2, H / 2], z = o.refractZ || 1.18;
    onLayer(R, () => { ctx.filter = `blur(${(o.refractBlur ?? 5).toFixed(1)}px) saturate(1.3) brightness(1.25)`; ctx.translate(cx, cy); ctx.scale(-z, z); ctx.translate(-cx, -cy); ctx.drawImage(main, 0, 0); }, true);
    onLayer(R, () => put(B, 1, 'destination-in'), true); put(R, o.refract); freeLayer(R);
  }
  put(B, o.alpha ?? .93);
  freeLayer(M, B);
}
// a bubble inside the liquid: bright lower rim, a point of light
function bubble(x, y, r, a = 1) {
  ctx.save(); ctx.lineWidth = Math.max(.8, r * .22); ctx.strokeStyle = rgba(AMB.hot, .75 * a); ctx.beginPath(); ctx.arc(x, y, r, .1, Math.PI * .95); ctx.stroke();
  ctx.strokeStyle = rgba(AMB.core, .35 * a); ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  disc(x, y, r, rgba(AMB.hot, .12 * a)); disc(x - r * .35, y - r * .35, Math.max(.6, r * .22), rgba(AMB.white, .9 * a)); ctx.restore();
}
function bubbles(seed, n, box, r0, r1, t = 0, a = 1) {
  for (let i = 0; i < n; i++) {
    const h = box[3] - box[1], sp = (.25 + rnd(seed + i * 3.3) * .6) * 60, x = lerp(box[0], box[2], rnd(seed + i * 1.7)) + Math.sin(t * 2 + i) * 3;
    const y = box[3] - (((rnd(seed + i * 5.1) * h + t * sp) % h) + h) % h; bubble(x, y, lerp(r0, r1, Math.pow(rnd(seed + i * 7.7), 2)), a);
  }
}
// a crisp wet highlight: a tapered white streak with a soft bloom
function streak(pts, widths, a = .9, col = AMB.white) { alpha(a * .5, () => blurred(Math.max(1, widths[1] * .5), () => taper(pts, widths.map(w => w * 1.8), rgba(col, 1)))); taper(pts, widths, rgba(col, a)); }
// a falling drop
function drop(x, y, r, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, -r * 2.1); ctx.bezierCurveTo(r * .2, -r * 1.2, r, -r * .5, r, .1 * r); ctx.arc(0, .1 * r, r, 0, Math.PI); ctx.bezierCurveTo(-r, -r * .5, -r * .2, -r * 1.2, 0, -r * 2.1); ctx.closePath();
  ctx.fillStyle = rg(r * .2, r * .3, 0, r * 1.6, [[0, AMB.hot, a], [.6, AMB.edge, a], [1, AMB.mid, a]]); ctx.fill(); disc(-r * .35, -r * .1, r * .26, rgba(AMB.white, a)); ctx.restore();
}

// ---------- the devil's head ----------
// stage 0 thumb, 1 cat, 2 child, 3 man, 4 giant. Local units: the head is about 200 wide; (0,0) between the eyes.
const STG = { thumb: 0, cat: 1, child: 2, man: 3, giant: 4 };
const stg = v => typeof v === 'string' ? STG[v] : v;
const byStage = (st, arr) => { const i = Math.floor(clamp(st, 0, 3.999)), f = st - i; return lerp(arr[i], arr[Math.min(4, i + 1)], clamp(f)); };
const DEXPR = {
  sweet: { eo: 1.1, round: 1, lid: 0, lidA: 0, low: 0, pw: .5, ph: .8, gaze: [0, 0], m: { w: 22, sm: 1, open: .6, teeth: 0 }, blush: 1 },
  charm: { eo: 1, round: .15, lid: .14, lidA: -.06, low: .3, pw: .22, ph: .78, gaze: [0, 0], brow: { h: -4, a: -.1, r: .35 }, m: { w: 54, sm: 1, open: .0, tooth: 1, skew: .25 } },
  sly: { eo: .95, round: 0, lid: .5, lidA: -.16, low: .22, pw: .13, ph: .9, gaze: [.6, .15], brow: { h: 2, a: -.22, r: .6 }, m: { w: 50, sm: .9, open: .34, teeth: 1, skew: .7 } },
  plead: { eo: 1.25, round: .75, lid: .04, lidA: .42, low: 0, pw: .52, ph: .84, gaze: [0, -.3], brow: { h: -12, a: .5, r: 0 }, m: { w: 17, sm: -1, open: .3, teeth: 0 }, tear: 1, blush: .6 },
  rage: { eo: 1.05, round: 0, lid: .2, lidA: -.42, low: .3, pw: .07, ph: .8, gaze: [0, .1], brow: { h: 8, a: -.6, r: 0 }, m: { w: 60, sm: -.3, open: 1, teeth: 2 }, heat: 1 },
  grin: { eo: .92, round: 0, lid: .36, lidA: -.24, low: .34, pw: .12, ph: .84, gaze: [0, .3], brow: { h: 2, a: -.28, r: 0 }, m: { w: 66, sm: 1, open: .72, teeth: 2 } },
  whisper: { eo: .95, round: 0, lid: .42, lidA: -.12, low: .25, pw: .15, ph: .88, gaze: [-.7, .25], brow: { h: 0, a: -.16, r: .5 }, m: { w: 40, sm: .8, open: .5, teeth: 1, skew: -.5 } },
};
function headGeo(o) {
  const st = stg(o.stage ?? 3), k = o.turn || 0, e = typeof o.expr === 'string' ? DEXPR[o.expr] : (o.expr || DEXPR.charm);
  return { st, k, e, t: o.t || 0, hl: (o.horn ?? 1) * byStage(st, [.26, .5, .74, 1, 1.22]), chin: byStage(st, [0, .1, .4, .8, 1]), fat: byStage(st, [1.1, 1.07, 1.03, 1, .98]), es: byStage(st, [1.5, 1.32, 1.15, 1, .95]), ey: byStage(st, [6, 2, -4, -8, -10]), ex: byStage(st, [44, 43, 41, 40, 40]) };
}
function hornPts(G, sg) {
  const far = Math.sign(G.k) === sg ? 1 - .2 * Math.abs(G.k) : 1, hl = G.hl * far, bx = sg * 56 - G.k * 14, by = -58;
  if (hl < .62) return { pts: [[bx, by + 10], [bx + sg * 14 * hl * 2, by - 70 * hl], [bx + sg * 26 * hl * 2, by - 128 * hl], [bx + sg * 14 * hl * 2, by - 168 * hl]], w: [54, 36 - 6 * hl, 19, 9] };
  return { pts: [[bx, by + 14], [bx + sg * 22, by - 44 * hl], [bx + sg * 44, by - 92 * hl], [bx + sg * 54, by - 138 * hl], [bx + sg * 42, by - 172 * hl], [bx + sg * 16, by - 180 * hl], [bx - sg * 2, by - 164 * hl]], w: [64, 46, 31, 21, 14, 9, 3] };
}
function devilHeadMask(o) {
  const G = headGeo(o), k = G.k, f = G.fat, cy = 98 + 20 * G.chin;
  blob([[k * 12, cy], [50 * f + k * 6, 84 + 6 * G.chin], [94 * f, 34], [97 * f, -28], [74, -82], [-k * 8, -104], [-74, -82], [-97 * f, -28], [-94 * f, 34], [-50 * f + k * 6, 84 + 6 * G.chin]], '#fff', .5);
  for (const sg of [-1, 1]) {
    const h = hornPts(G, sg); taper(h.pts, h.w, '#fff');
    const e = h.pts[h.pts.length - 1], p = h.pts[h.pts.length - 2], dx = e[0] - p[0], dy = e[1] - p[1], d = Math.hypot(dx, dy) || 1, wob = Math.sin(G.t * 3 + sg) * 2;
    if (G.hl > .6) { disc(e[0] + dx / d * 15, e[1] + dy / d * 15 + 4 + wob, 6, '#fff'); disc(e[0] + dx / d * 30 - sg * 5, e[1] + dy / d * 30 + 16 - wob, 3.8, '#fff'); }
    else disc(e[0] + sg * 4, e[1] - 16 + wob, 5, '#fff');
  }
  if (G.chin > .3) taper([[k * 12, cy - 14], [k * 13, cy + 4], [k * 14, cy + 10 + 6 * G.chin]], [30, 12, 3], '#fff');
}
function eyePath(ew, hu, hl, round) {
  ctx.beginPath(); ctx.moveTo(-ew, 0);
  const cu = lerp(1.32, 1.34, round), ix = lerp(.5, .56, round);
  ctx.bezierCurveTo(-ew * ix, -hu * cu, ew * ix, -hu * cu, ew, 0); ctx.bezierCurveTo(ew * ix, hl * cu, -ew * ix, hl * cu, -ew, 0); ctx.closePath();
}
function devilFace(o) {
  const G = headGeo(o), e = G.e, k = G.k, heat = e.heat || 0, fx = k * 26, st = G.st, ak = Math.abs(k);
  const gz = o.gaze || e.gaze || [0, 0];
  // soft shading that carves the face: sockets, cheeks
  for (const sg of [-1, 1]) {
    const far = Math.sign(k) === sg, sx = far ? 1 - .24 * ak : 1 - .04 * ak, cx = fx + sg * G.ex * (far ? 1 - .1 * ak : 1), cyy = G.ey;
    const ew = 30 * G.es * sx, eh = 17 * G.es * e.eo, round = e.round || 0, hu = lerp(eh, ew * .96 * e.eo / 1.1, round), hlo = lerp(eh * .72, ew * .9 * e.eo / 1.1, round);
    const tilt = lerp(-.24, -.04, round) * (1 + (e.lidA < 0 ? -e.lidA * .5 : 0));
    ctx.save(); ctx.translate(cx, cyy); ctx.scale(sg, 1); ctx.rotate(tilt);
    // socket shadow and glow
    blurred(7, () => { eyePath(ew * 1.25, hu * 1.5, hlo * 1.4, round); ctx.fillStyle = rgba(AMB.core, .5); ctx.fill(); });
    const lidY = -hu + e.lid * (hu + hlo), lowY = hlo - e.low * hlo * .9;
    const openClip = () => { eyePath(ew, hu, hlo, round); ctx.clip(); ctx.beginPath(); ctx.moveTo(-ew * 1.3, lidY - e.lidA * ew * 1.3); ctx.lineTo(ew * 1.3, lidY + e.lidA * ew * 1.3); ctx.lineTo(ew * 1.3, lowY - 5); ctx.quadraticCurveTo(0, lowY + (e.low > 0 ? -e.low * 9 : 8), -ew * 1.3, lowY - 5); ctx.closePath(); ctx.clip(); };
    // the lid: liquid skin over the closed part of the eye
    eyePath(ew, hu, hlo, round); ctx.fillStyle = lg(0, -hu, 0, hlo, [[0, mix(AMB.mid, AMB.edge, .35)], [1, AMB.deep]]); ctx.fill();
    ctx.save(); openClip();
    ctx.fillStyle = rg(0, 0, 0, ew * 1.05, [[0, [255, 255, 250]], [.62, heat ? [255, 246, 214] : [255, 250, 228]], [1, heat ? [255, 170, 90] : [255, 214, 130]]]); ctx.fillRect(-ew * 1.4, -hu * 1.6, ew * 2.8, (hu + hlo) * 1.8);
    // pupil
    const visC = (Math.max(lidY, -hu) + Math.min(lowY, hlo)) / 2, px = gz[0] * sg * ew * .42, py = lerp(0, visC, .55) + gz[1] * hu * .4, prx = Math.max(1.6, e.pw * ew * .78), pry = e.ph * (round ? hu * .9 : hu * 1.02);
    oval(px, py, prx, pry, e.pw > .3 ? rg(px, py, 0, Math.max(prx, pry), [[0, [20, 3, 2]], [.8, [40, 8, 3]], [1, [96, 26, 6]]]) : rgba([30, 5, 2], 1));
    if (e.pw > .3) { disc(px - prx * .32 * sg * (LIGHT.lx < 0 ? 1 : -1), py - pry * .36, prx * .34, rgba([255, 255, 255], .98)); disc(px + prx * .38 * sg, py + pry * .34, prx * .15, rgba([255, 255, 255], .85)); oval(px, py + pry * .62, prx * .6, pry * .2, rgba(AMB.edge, .35)); }
    // lid shadow on the eye
    ctx.fillStyle = lg(0, lidY, 0, lidY + hu * .45, [[0, AMB.edge, .5], [1, AMB.edge, 0]]); ctx.fillRect(-ew * 1.4, -hu * 1.6, ew * 2.8, (hu + hlo) * 2);
    ctx.restore();
    // lid edges, crisp
    ctx.save(); eyePath(ew, hu, hlo, round); ctx.clip();
    ctx.lineCap = 'round'; ctx.strokeStyle = rgba(AMB.ink, .9); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-ew * 1.3, lidY - e.lidA * ew * 1.3); ctx.lineTo(ew * 1.3, lidY + e.lidA * ew * 1.3); ctx.stroke();
    if (e.low > .05) { ctx.lineWidth = 2.6; ctx.strokeStyle = rgba(AMB.ink, .7); ctx.beginPath(); ctx.moveTo(-ew * 1.3, lowY - 5); ctx.quadraticCurveTo(0, lowY - e.low * 9, ew * 1.3, lowY - 5); ctx.stroke(); }
    ctx.restore();
    eyePath(ew, hu, hlo, round); ctx.lineWidth = 2.6; ctx.strokeStyle = rgba(AMB.ink, .78); ctx.stroke();
    // the eye's own light
    ctx.restore();
    glow(heat ? [255, 120, 50] : [255, 170, 70], cx, cyy + (lidY + lowY) * .25, ew * 2.3, .34 * (1 - e.lid * .5));
    // brow ridge
    if (e.brow) {
      const b = e.brow, raise = sg > 0 ? -b.r * 14 : 0, by = cyy - hu - 13 + b.h + raise, ax = b.a * 22;
      const P = [[cx - sg * ew * .98, by - ax + 3], [cx + sg * ew * .1, by - 6 - ax * .15], [cx + sg * ew * 1.16, by + ax * .8 - 2]];
      blurred(4, () => taper(P.map(p => [p[0], p[1] + 7]), [20, 18, 6], rgba(AMB.core, .55)));
      taper(P, [15, 13, 4], rgba(mix(AMB.core, AMB.deep, .25), .9)); curve(P.map(p => [p[0], p[1] - 5]), 2, rgba(AMB.hot, .75));
    }
    if (e.blush) oval(cx + sg * 16, cyy + hlo + 16, 20, 11, rg(cx + sg * 16, cyy + hlo + 16, 0, 20, [[0, [255, 96, 80], .5 * e.blush], [1, [255, 96, 80], 0]]));
    if (e.tear && sg < 0) drop(cx - sg * ew * .1, cyy + hlo + 20, 7, .95);
  }
  // mouth
  const m = e.m, mx = fx + k * 8 + (m.skew || 0) * 8, my = byStage(st, [50, 50, 50, 50, 50]) + (e.round ? 4 : 0), w = m.w * (1 - .1 * ak), sk = m.skew || 0;
  const cl = [mx - w, my - m.sm * 14 * (1 - sk * .7)], cr = [mx + w, my - m.sm * 14 * (1 + sk * .7)], um = [mx, my + m.sm * 9];
  const upper = () => { ctx.moveTo(cl[0], cl[1]); ctx.quadraticCurveTo(um[0], um[1] + (um[1] - (cl[1] + cr[1]) / 2), cr[0], cr[1]); };
  if (m.open < .06) {
    blurred(3, () => { ctx.beginPath(); upper(); ctx.lineWidth = 9; ctx.strokeStyle = rgba(AMB.core, .5); ctx.stroke(); });
    ctx.lineCap = 'round'; ctx.beginPath(); upper(); ctx.lineWidth = 5; ctx.strokeStyle = rgba(AMB.ink, .95); ctx.stroke();
    ctx.save(); ctx.translate(0, 4.2); ctx.beginPath(); upper(); ctx.lineWidth = 2.2; ctx.strokeStyle = rgba(AMB.hot, .9); ctx.stroke(); ctx.restore();
    // dimples
    for (const [c, sg] of [[cl, -1], [cr, 1]]) curve([[c[0] - sg * 2, c[1] + 5], [c[0] + sg * 4, c[1] - 1], [c[0] + sg * 3, c[1] - 9]], 3.2, rgba(AMB.ink, .8));
    if (m.tooth) { const tx = mx + w * .52, ty = my - m.sm * 14 * (1 + sk * .35) * .3 + 3; shard(tx, ty - 3, 9, 17, .1); }
  } else {
    const dropY = m.open * Math.min(m.sm > 0 ? 44 : 50, w * 1.25), lm = [mx + sk * 6, um[1] + dropY];
    const path = () => { ctx.beginPath(); upper(); ctx.quadraticCurveTo(lerp(cr[0], lm[0], .25), lm[1] + dropY * .62, lm[0], lm[1] + dropY * .3); ctx.quadraticCurveTo(lerp(cl[0], lm[0], .25), lm[1] + dropY * .62, cl[0], cl[1]); ctx.closePath(); };
    blurred(4, () => { path(); ctx.lineWidth = 8; ctx.strokeStyle = rgba(AMB.core, .5); ctx.stroke(); });
    path(); ctx.fillStyle = lg(0, my - 16, 0, lm[1] + dropY * .4, [[0, [30, 5, 2]], [.6, [64, 14, 4]], [1, [150, 50, 10]]]); ctx.fill();
    ctx.save(); path(); ctx.clip();
    if (m.teeth) {
      const n = Math.max(4, Math.round(w / 6.2)), ty = t => { const u = t, a = cl, b = cr, c = [um[0], um[1] + (um[1] - (cl[1] + cr[1]) / 2)]; return [(1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]]; };
      for (let i = 0; i < n; i++) { const u = (i + .5) / n, p = ty(u), edge = Math.abs(u - .5) * 2, len = dropY * lerp(.62, .34, Math.abs(edge - .55) * 1.6) * (.8 + .4 * rnd(i * 3.7 + 1)); shard(p[0], p[1] - 3, (2 * w / n) * 1.12, Math.max(7, len), (rnd(i * 1.3) - .5) * .3); }
      if (m.teeth > 1) for (let i = 0; i < n - 1; i++) { const u = (i + 1) / n, x = lerp(cl[0], cr[0], u), yy = lm[1] + dropY * .34 - Math.pow(Math.abs(u - .5) * 2, 2) * dropY * .62; shard(x, yy + 5, (2 * w / n) * 1.05, -Math.max(6, dropY * .3 * (.7 + .5 * rnd(i * 2.9 + 7))), (rnd(i * 4.1) - .5) * .3); }
    }
    ctx.restore();
    ctx.lineCap = 'round'; ctx.beginPath(); upper(); ctx.lineWidth = 3.4; ctx.strokeStyle = rgba(AMB.ink, .95); ctx.stroke();
    // glowing rim of the lower lip
    ctx.beginPath(); ctx.moveTo(cr[0], cr[1]); ctx.quadraticCurveTo(lerp(cr[0], lm[0], .25), lm[1] + dropY * .62, lm[0], lm[1] + dropY * .3); ctx.quadraticCurveTo(lerp(cl[0], lm[0], .25), lm[1] + dropY * .62, cl[0], cl[1]);
    ctx.lineWidth = 2.6; ctx.strokeStyle = rgba(AMB.hot, .95); ctx.stroke();
    additive(() => blurred(4, () => { ctx.lineWidth = 6; ctx.strokeStyle = rgba(AMB.edge, .5); ctx.stroke(); }));
    for (const [c, sg] of [[cl, -1], [cr, 1]]) curve([[c[0] - sg * 1, c[1] + 4], [c[0] + sg * 4, c[1] - 2], [c[0] + sg * 3, c[1] - 9]], 3, rgba(AMB.ink, .8));
  }
}
// an ice-shard tooth: base centre (x, y), width, length (+ down, − up), lean
function shard(x, y, w, len, lean = 0) {
  const tip = [x + lean * Math.abs(len), y + len], l = [x - w / 2, y], r = [x + w / 2, y];
  poly([l, r, tip], rgba(ICE.lit, .97)); poly([[x + w * .08, y], r, tip], rgba(ICE.mid, .95));
  stroke([l, tip], 1, rgba([255, 255, 255], .9)); stroke([r, tip], 1, rgba(ICE.dk, .55));
}
// highlights and little things inside the head
function devilHeadInner(o) {
  const G = headGeo(o);
  bubbles(11 + G.st, 5 + G.st, [-70, -60, 70, 90], 2.2, 6, G.t, .9);
}
function devilHeadGloss(o) {
  const G = headGeo(o), k = G.k, f = G.fat;
  streak([[-78 * f - k * 6, -6], [-70 * f - k * 6, -46], [-44 - k * 8, -78]], [3, 9, 2], .92);
  disc(-84 * f + 4, 12, 4.2, rgba(AMB.white, .9));
  for (const sg of [-1, 1]) { const h = hornPts(G, sg), n = h.pts.length; if (n > 4) streak([1, 2, 3].map(i => [h.pts[i][0] - h.w[i] * .22, h.pts[i][1] + 4]), [2, 5, 1.5], .8); }
}
function devilHead(o) {
  at(o.x || 0, o.y || 0, o.s || 1, o.rot || 0, () => {
    liquid(() => devilHeadMask(o), { depth: 26, goo: 3, heat: (headGeo(o).e.heat || 0) * .8, halo: o.halo ?? .45 }, () => devilHeadInner(o));
    devilHeadGloss(o); devilFace(o);
  });
}

// ---------- light on painted figures ----------
// a scene light: key colour and the side it comes from (kx −1 left, +1 right), cool shade, rim colour and side
const LT0 = { key: [255, 226, 190], kx: -1, ky: -.5, shade: [44, 56, 96], rim: [255, 196, 120], rx: 1, ry: -.3 };
// F is a layer holding a finished flat-ish figure: give it a shadow side, a lit side and a rim from its own outline
function relight(F, lt, w, o = {}) {
  const px = w * scl();
  const sh = edgeBand(F, -lt.kx * px, -(lt.ky ?? -.5) * px * .6, px * .5); tint(sh, lt.shade);
  onLayer(F, () => put(sh, o.shade ?? .5, 'multiply'), true);
  const ky = edgeBand(F, lt.kx * px * .8, (lt.ky ?? -.5) * px * .6, px * .45); tint(ky, lt.key);
  onLayer(F, () => put(ky, o.key ?? .3, 'soft-light'), true);
  const rm = edgeBand(F, lt.rx * px * (o.rimW ?? .09), (lt.ry ?? -.3) * px * (o.rimW ?? .09), Math.max(.8, px * .012)); tint(rm, lt.rim);
  onLayer(F, () => { put(rm, (o.rim ?? .9) * .6, 'screen', `blur(${Math.max(1, px * .03).toFixed(1)}px)`); put(rm, o.rim ?? .9, 'screen'); }, true);
  freeLayer(sh, ky, rm);
}
// paint a figure on its own layer, light it, put it on the picture
function figure(lt, w, drawFn, o) { const F = newLayer(); onLayer(F, drawFn); relight(F, lt, w, o); put(F, o?.alpha ?? 1); freeLayer(F); }

// ---------- human heads ----------
// local units: eyes on y = 0, the head about 208 wide; turn −1..1 (to screen left / right)
const HEXPR = {
  neutral: { eo: 1, squint: 0, bi: 0, bo: 0, arch: 5, gaze: [0, 0], iris: 1, m: { w: 30, sm: .2, open: 0 } },
  smile: { eo: .95, squint: .45, bi: -3, bo: -2, arch: 6, m: { w: 36, sm: .9, open: 0 }, cheeks: .6 },
  laugh: { closed: 1, bi: -9, bo: -4, arch: 8, m: { w: 47, sm: 1, open: 1, teeth: 1, tongue: 1 }, cheeks: 1, jaw: 10 },
  delight: { eo: 1.2, squint: .35, bi: -11, bo: -8, arch: 8, m: { w: 45, sm: 1, open: .66, teeth: 1, tongue: .5 }, cheeks: .8, jaw: 5 },
  tired: { eo: .52, squint: .1, bi: -6, bo: 5, arch: 2, gaze: [0, .6], m: { w: 27, sm: -.35, open: 0 }, bags: 1 },
  horror: { eo: 1.62, squint: -.3, iris: .78, bi: -19, bo: -3, arch: 2, gaze: [0, 0], m: { w: 25, sm: -.7, open: 1, teeth: 2, oval: 1 }, jaw: 18, lines: 1, pale: 1 },
  afraid: { eo: 1.38, squint: -.2, iris: .9, bi: -14, bo: 4, arch: 2, gaze: [0, -.3], m: { w: 13, sm: -.9, open: .55, oval: 1 }, jaw: 4, pale: .5 },
};
function humanEye(cx, cy, sg, sx, P, e, lt, gz) {
  const { ew, eh, ir, S, L } = P; ctx.save(); ctx.translate(cx, cy); ctx.scale(sg * sx, 1);
  const lash = [46, 30, 32];
  if (e.closed) {
    curve([[-ew, 4], [-ew * .35, -6], [ew * .4, -6], [ew * 1.02, 3]], L ? 4.6 : 4, rgba(lash, .95), .6);
    curve([[ew * .9, 0], [ew * 1.32, -5]], 2, rgba(S.sh, .7)); curve([[ew * .95, 5], [ew * 1.34, 6]], 2, rgba(S.sh, .6));
    curve([[-ew * .7, 10], [0, 13], [ew * .8, 9]], 2, rgba(S.sh, .4)); ctx.restore(); return;
  }
  const hu = eh * e.eo, hl = eh * .64 * (1 - e.squint * .55) * (e.eo > 1 ? 1 + (e.eo - 1) * .45 : 1);
  const up = () => { ctx.moveTo(-ew, 2); ctx.bezierCurveTo(-ew * .5, -hu * 1.3, ew * .42, -hu * 1.36, ew, -2); };
  const path = () => { ctx.beginPath(); up(); ctx.bezierCurveTo(ew * .5, hl * 1.25, -ew * .45, hl * 1.35, -ew, 2); ctx.closePath(); };
  path(); ctx.fillStyle = lg(0, -hu, 0, hl, [[0, [206, 196, 200]], [.45, [250, 247, 244]], [1, [236, 228, 226]]]); ctx.fill();
  ctx.save(); path(); ctx.clip();
  const r = ir * (e.iris || 1), ix = gz[0] * sg * ew * .46, iy = gz[1] * (hu + hl) * .42 - (hu - hl) * .18;
  disc(ix, iy, r, rg(ix, iy + r * .25, r * .1, r, [[0, P.iris2], [.62, P.iris1], [.9, P.iris0], [1, [24, 16, 16]]]));
  disc(ix, iy, r * (e.pale ? .32 : .44), rgba([14, 10, 12], 1));
  const hx = lt.kx * sg * r * .36; disc(ix + hx, iy - r * .38, r * .27, 'rgba(255,255,255,.98)'); disc(ix - hx * .9, iy + r * .42, r * .11, 'rgba(255,255,255,.6)');
  ctx.fillStyle = lg(0, -hu * 1.1, 0, -hu * 1.1 + Math.max(5, hu * .7), [[0, [40, 30, 44], .5], [1, [40, 30, 44], 0]]); ctx.fillRect(-ew, -hu * 1.4, ew * 2, hu * 2);
  ctx.restore();
  ctx.lineCap = 'round'; ctx.beginPath(); up(); ctx.lineWidth = L ? 4.4 : 3.6; ctx.strokeStyle = rgba(lash, .96); ctx.stroke();
  if (L) curve([[ew - 1, -2], [ew + 6, -6]], 2.6, rgba(lash, .9));
  ctx.beginPath(); ctx.moveTo(ew, -2); ctx.bezierCurveTo(ew * .5, hl * 1.25, -ew * .45, hl * 1.35, -ew, 2); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(S.sh, .6); ctx.stroke();
  curve([[-ew * .95, -hu * .45 - 3], [-ew * .1, -hu * 1.02 - (L ? 6 : 5) - (1 - Math.min(1, e.eo)) * 5], [ew * 1.02, -hu * .5 - 5]], 2, rgba(S.sh, .6));
  ctx.restore();
}
function humanHead(o) {
  const who = o.who || 'dad', L = who === 'lily', age = o.age ?? (L ? 6 : 38), old = !L && age > 30, k = o.turn || 0, ak = Math.abs(k), far = k >= 0 ? 1 : -1;
  const e = { ...HEXPR.neutral, ...(typeof o.expr === 'string' ? HEXPR[o.expr] : o.expr || {}) }, lt = o.lt || LT0, S0 = L ? SKIN_LILY : SKIN_DAD;
  const S = e.pale ? { ...S0, base: mix(S0.base, [214, 206, 204], .3 * e.pale), blush: mix(S0.blush, S0.base, .6) } : S0;
  const gz = o.gaze || e.gaze || [0, 0], fx = k * 30, jaw = e.jaw || 0, shx = -lt.kx, hair = o.hair || HAIR;
  const P = L ? { ew: 26, eh: 16.5, ir: 14.5, S, L, iris0: [58, 36, 24], iris1: [112, 70, 40], iris2: [164, 108, 58], ey: 10, ex: 47, ny: 46, my: 74 }
    : { ew: 23.5, eh: 10.5, ir: 10.4, S, L, iris0: [52, 34, 24], iris1: [104, 66, 38], iris2: [150, 100, 56], ey: 0, ex: 45, ny: 56, my: 90 };
  const X = x => (Math.sign(x) === far ? x * (1 - .17 * ak) : x * (1 + .02 * ak)) + k * 10, cy = (L ? 110 : 132) + jaw;
  const base = L ? [[0, -150], [62, -137], [99, -92], [107, -28], [105, 30], [90, 72], [52, 101 + jaw * .6], [0, cy], [-52, 101 + jaw * .6], [-90, 72], [-105, 30], [-107, -28], [-99, -92], [-62, -137]]
    : [[0, -152], [60, -140], [94, -96], [103, -34], [100, 26], [91, 78 + jaw * .5], [52, 119 + jaw], [0, cy], [-52, 119 + jaw], [-91, 78 + jaw * .5], [-100, 26], [-103, -34], [-94, -96], [-60, -140]];
  const pts = base.map(([x, y], i) => i === 7 ? [k * 20, y] : [X(x) - (Math.sign(x) === far && Math.abs(y) < 40 ? ak * (y < 0 ? 7 : -2) : 0), y]);
  const face = () => blobPath(pts, .5, true);
  const HX = x => x - k * 12;
  at(o.x || 0, o.y || 0, o.s || 1, o.rot || 0, () => figure(lt, 62, () => {
    // hair behind
    if (L) {
      blob([[-110, -30], [-116, -100], [-70, -172], [0, -190], [70, -172], [116, -100], [110, -30], [96, 20], [-96, 20]].map(p => [HX(p[0]), p[1]]), rgba(hair.base, 1));
      for (const sg of [-1, 1]) { // two short bunches
        const bx = HX(sg * 116), by = -84, sw = Math.sin((o.t || 0) * 2 + sg) * 3;
        blob([[bx - sg * 10, by - 14], [bx + sg * 26, by - 40], [bx + sg * 66 + sw, by - 30], [bx + sg * 80 + sw, by + 14], [bx + sg * 62 + sw, by + 58], [bx + sg * 36, by + 40], [bx + sg * 16, by + 18], [bx - sg * 8, by + 14]], rgba(hair.base, 1));
        curve([[bx + sg * 22, by - 22], [bx + sg * 52 + sw, by - 10], [bx + sg * 60 + sw, by + 32]], 7, rgba(hair.mid, .9)); curve([[bx + sg * 30, by - 28], [bx + sg * 58 + sw, by - 18]], 3.5, rgba(hair.lit, .8));
        oval(bx + sg * 6, by + 2, 9, 17, rgba([60, 150, 160], 1), sg * .2); oval(bx + sg * 4, by - 3, 3, 7, rgba([150, 220, 224], .9), sg * .2);
      }
    } else blob([[-106, 10], [-112, -70], [-98, -140], [-52, -184], [8, -196], [66, -182], [106, -134], [112, -66], [104, 10]].map(p => [HX(p[0]) , p[1] - (old ? 0 : 6)]), rgba(hair.base, 1));
    // ears (far one hidden by the turn)
    const ear = sg => { const exx = sg * 103 + k * 30 * (sg === far ? .3 : 1), eyy = L ? 28 : 20; if (sg === far && ak > .35) return;
      oval(exx, eyy, 15, 29, rgba(mix(S.base, S.sh, .22), 1), sg * .12); oval(exx - sg * 2, eyy + 2, 8, 18, rgba(S.sh, .55), sg * .12); curve([[exx - sg * 4, eyy - 16], [exx + sg * 5, eyy - 6], [exx - sg * 2, eyy + 12]], 2.4, rgba(S.sh, .7)); };
    for (const sg of [-1, 1]) if (!(sg === -far && ak > .3)) ear(sg);
    // the face
    face(); ctx.fillStyle = rgba(S.base, 1); ctx.fill();
    inside(face, () => {
      rectf(-160, -200, 320, 400, rg(fx - shx * 46, -34, 10, 190, [[0, S.lit, .62], [.5, S.lit, .22], [1, S.lit, 0]]));
      blurred(16, () => blob([[shx * 58 + fx, -160], [shx * 150, -160], [shx * 150, 150], [shx * 22 + fx, 150], [shx * 50 + fx, 96], [shx * 80 + fx, 30], [shx * 70 + fx, -60]], rgba(S.sh, .6)));
      blurred(12, () => rectf(-140, -170, 280, L ? 72 : 60, rgba(S.sh, .45)));   // under the hair
      for (const sg of [-1, 1]) { // sockets, cheeks
        const cxx = fx + sg * P.ex * (sg === far ? 1 - .12 * ak : 1);
        blurred(9, () => oval(cxx, P.ey - 4, 34, 22, rgba(S.sh, sg === shx ? .34 : .2)));
        const bl = (L ? .5 : .2) + (e.cheeks || 0) * .22; oval(cxx + sg * 14, P.ey + (L ? 46 : 50), 34, 24, rg(cxx + sg * 14, P.ey + (L ? 46 : 50), 0, 34, [[0, S.blush, bl], [1, S.blush, 0]]));
        if (old || e.bags) { blurred(4, () => { ctx.beginPath(); ctx.ellipse(cxx, P.ey + 13, 25, 12, 0, .1, Math.PI - .1); ctx.fillStyle = rgba([112, 66, 86], .42 + (e.bags || 0) * .12); ctx.fill(); }); curve([[cxx - 22, P.ey + 19], [cxx, P.ey + 26], [cxx + 22, P.ey + 20]], 1.8, rgba(S.sh, .55)); }
      }
      if (old) { // stubble
        blurred(11, () => { blob([[fx - 78, 60], [fx - 40, 72], [fx - 30, 62], [fx, 60], [fx + 30, 62], [fx + 40, 72], [fx + 78, 60], [fx + 80, 110], [fx + k * 16, 150 + jaw], [fx - 80, 110]], rgba([64, 58, 70], .34)); });
        for (let i = 0; i < 240; i++) { const x = fx + (rnd(i * 1.3) - .5) * 170, y = 58 + rnd(i * 2.7 + 4) * (78 + jaw); disc(x, y, .9, rgba([40, 32, 38], .22)); }
      }
      if (e.lines) for (let i = 0; i < 2; i++) curve([[fx - 54, -70 - i * 15], [fx - 18, -77 - i * 15], [fx + 18, -76 - i * 15], [fx + 54, -69 - i * 15]], 1.8, rgba(S.sh, .5));
      // chin and lower-lip modelling
      blurred(7, () => oval(fx + k * 12, P.my + (L ? 17 : 21) + jaw * .8, 22, 6, rgba(S.sh, .4)));
    });
    // nose
    const nx = fx + k * 20, ny = P.ny;
    if (L) { blurred(4, () => oval(nx + shx * 5, ny + 3, 9, 6, rgba(S.sh, .4))); disc(nx - shx * 2, ny - 4, 5, rgba(S.lit, .7)); curve([[nx - 7, ny + 4], [nx, ny + 7], [nx + 7, ny + 4]], 2, rgba(S.sh, .75)); }
    else {
      blurred(6, () => curve([[fx + shx * 9 + k * 3, -16], [fx + shx * 11 + k * 9, 22], [nx + shx * 15, ny - 4]], 13, rgba(S.sh, .5)));
      blurred(3, () => curve([[fx - shx * 3 + k * 4, -6], [nx - shx * 4, ny - 10]], 7, rgba(S.lit, .55)));
      disc(nx - shx * 3, ny - 5, 7, rgba(S.lit, .6));
      blurred(5, () => oval(nx + shx * 4, ny + 11, 20, 6, rgba(S.sh, .5)));
      curve([[nx - 17, ny - 2], [nx - 15, ny + 6], [nx - 6, ny + 6], [nx, ny + 9], [nx + 6, ny + 6], [nx + 15, ny + 6], [nx + 17, ny - 2]], 2.2, rgba(mix(S.sh, [70, 40, 40], .4), .75));
      oval(nx - 8, ny + 5.5, 4.5, 2.4, rgba([84, 46, 44], .7)); oval(nx + 8, ny + 5.5, 4.5, 2.4, rgba([84, 46, 44], .7));
      if (ak > .3) curve([[fx + far * 12 + k * 4, -14], [fx + far * 13 + k * 12, 20], [nx + far * 17, ny - 4], [nx + far * 15, ny + 5]], 2, rgba(mix(S.sh, [70, 40, 40], .3), .6));
    }
    // eyes and brows
    for (const sg of [-1, 1]) {
      const isFar = sg === far, sx = isFar ? 1 - .27 * ak : 1 - .05 * ak, cxx = fx + sg * P.ex * (isFar ? 1 - .12 * ak : 1), by = P.ey - (L ? 31 : 25) - (e.eo > 1 ? (e.eo - 1) * 10 : 0);
      humanEye(cxx, P.ey, sg, sx, P, e, lt, gz);
      const ew = P.ew * sx, B = [[cxx - sg * ew * .98, by + e.bi], [cxx + sg * ew * .15, by - e.arch + (e.bi + e.bo) * .3], [cxx + sg * ew * 1.3, by + e.bo + 4]];
      taper(B, L ? [5, 5, 2] : [9.5, 9, 3], rgba(L ? [84, 58, 50] : mix(hair.base, [20, 14, 16], .2), .95));
    }
    // mouth
    const m = e.m, mx = fx + k * 9, my = P.my + jaw * .45, w = m.w * (1 - .12 * ak), cl = [mx - w * (far < 0 ? 1 - .2 * ak : 1), my - m.sm * 9], cr = [mx + w * (far > 0 ? 1 - .2 * ak : 1), my - m.sm * 9];
    const umy = my + (m.oval ? -9 : m.sm * 5), upper = () => { ctx.moveTo(cl[0], cl[1]); ctx.quadraticCurveTo(mx, umy + (umy - cl[1]), cr[0], cr[1]); };
    if (m.open < .06) {
      // closed: lips
      ctx.beginPath(); upper(); ctx.quadraticCurveTo(mx, umy - (L ? 9 : 7), cl[0], cl[1]); ctx.fillStyle = rgba(mix(S.lip, S.sh, .3), .85); ctx.fill();
      ctx.beginPath(); upper(); ctx.quadraticCurveTo(mx, umy + (umy - cl[1]) + (L ? 15 : 13), cl[0], cl[1]); ctx.fillStyle = rgba(S.lip, .8); ctx.fill();
      oval(mx - lt.kx * -4, umy + (umy - cl[1]) * .5 + 5, 8, 2.4, rgba(S.lit, .5));
      ctx.lineCap = 'round'; ctx.beginPath(); upper(); ctx.lineWidth = 2.6; ctx.strokeStyle = rgba([92, 44, 46], .95); ctx.stroke();
      for (const [c, sg] of [[cl, -1], [cr, 1]]) curve([[c[0], c[1]], [c[0] + sg * 4, c[1] - m.sm * 3]], 2.6, rgba([92, 44, 46], .8));
    } else {
      const dy = m.open * (m.oval ? 40 : 36) * (L ? .62 : 1), lmy = umy + dy;
      const path = () => { ctx.beginPath(); upper(); ctx.bezierCurveTo(cr[0] + (m.oval ? 2 : -2), lmy + dy * .2, mx + w * .55, lmy + dy * .34, mx, lmy + dy * .34); ctx.bezierCurveTo(mx - w * .55, lmy + dy * .34, cl[0] - (m.oval ? 2 : -2), lmy + dy * .2, cl[0], cl[1]); ctx.closePath(); };
      path(); ctx.fillStyle = rgba([66, 22, 30], 1); ctx.fill();
      ctx.save(); path(); ctx.clip();
      if (m.tongue) oval(mx, lmy + dy * .3, w * .62, dy * .42, rgba([206, 100, 104], m.tongue));
      if (m.teeth) { ctx.beginPath(); upper(); ctx.lineWidth = m.oval ? 14 : 21; ctx.strokeStyle = 'rgba(250,246,240,1)'; ctx.stroke(); for (let i = -3; i <= 3; i++) stroke([[mx + i * w * .24, umy - 6], [mx + i * w * .24, umy + 12]], 1, 'rgba(180,170,170,.35)'); }
      if (m.teeth > 1) { ctx.beginPath(); ctx.moveTo(cl[0], lmy + dy * .1); ctx.quadraticCurveTo(mx, lmy + dy * .5, cr[0], lmy + dy * .1); ctx.lineWidth = 11; ctx.strokeStyle = 'rgba(236,230,226,1)'; ctx.stroke(); }
      ctx.fillStyle = lg(0, umy - 8, 0, umy + 10, [[0, [40, 14, 20], .5], [1, [40, 14, 20], 0]]); ctx.fillRect(mx - w - 4, umy - 12, w * 2 + 8, 26);
      ctx.restore();
      ctx.lineCap = 'round'; path(); ctx.lineWidth = 2.4; ctx.strokeStyle = rgba([110, 54, 56], .9); ctx.stroke();
      ctx.beginPath(); upper(); ctx.lineWidth = 3.4; ctx.strokeStyle = rgba(mix(S.lip, [120, 60, 60], .4), .95); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx - w * .6, lmy + dy * .34 + 2); ctx.quadraticCurveTo(mx, lmy + dy * .34 + 7, mx + w * .6, lmy + dy * .34 + 2); ctx.lineWidth = 4.5; ctx.strokeStyle = rgba(S.lip, .8); ctx.stroke();
    }
    if (e.cheeks) for (const sg of [-1, 1]) curve([[nx + sg * 21, ny + 2], [mx + sg * (w + 13), my - 16], [mx + sg * (w + 12), my + 4]], 2.2, rgba(S.sh, .55 * e.cheeks));
    // hair in front
    if (L) {
      const fr = [[-108, -22], [-113, -90], [-78, -160], [0, -182], [78, -160], [113, -90], [108, -22], [96, -40], [84, -66], [60, -58], [40, -80], [14, -62], [-14, -80], [-40, -60], [-64, -78], [-86, -60], [-98, -36]].map(p => [HX(p[0]), p[1]]);
      blob(fr, rgba(hair.base, 1), .45);
      inside(() => blobPath(fr, .45, true), () => { for (let i = 0; i < 9; i++) { const x = -90 + i * 22.5; curve([[HX(x * .5), -176], [HX(x * .9), -120], [HX(x), -66]], 5, rgba(hair.mid, .55)); } blurred(8, () => curve([[HX(-70 * -lt.kx), -150], [HX(-20 * -lt.kx), -132], [HX(40 * -lt.kx), -138]], 16, rgba(hair.lit, .6))); });
    } else {
      const up = old ? 0 : 8, fr = [[-104, 2], [-110, -60], [-104, -120], [-70, -170 - up], [-10, -192 - up], [56, -186 - up], [100, -146 - up * .5], [112, -84], [104, 2], [96, -36], [92, -72], [70, -100 + up], [40, -92 + up * 2], [16, -106 + up * 2], [-14, -98 + up], [-44, -112 + up], [-76, -96 + up], [-92, -66], [-96, -30]].map(p => [HX(p[0]), p[1]]);
      blob(fr, rgba(hair.base, 1), .5);
      inside(() => blobPath(fr, .5, true), () => {
        for (let i = 0; i < 11; i++) { const u = i / 10, x0 = lerp(-70, 30, u), x1 = lerp(-100, 104, u); curve([[HX(x0), -186 - up], [HX(lerp(x0, x1, .5) + 12), -150 - Math.sin(u * 9) * 8], [HX(x1 - 6), -116 + Math.sin(u * 7 + 1) * 10], [HX(x1 + 4), -84]], 6.5, rgba(hair.mid, .7)); }
        blurred(7, () => curve([[HX(-76 * -lt.kx), -150], [HX(-30 * -lt.kx), -166], [HX(30 * -lt.kx), -160]], 15, rgba(hair.lit, .55)));
        for (let i = 0; i < 4; i++) curve([[HX(-56 + i * 30), -178 - up], [HX(-40 + i * 34), -150], [HX(-30 + i * 36), -128]], 2.2, rgba(hair.lit, .45));
      });
      if (old) curve([[HX(20), -104], [HX(34), -84], [HX(30), -70]], 5, rgba(hair.base, 1));   // a lock that has come loose
    }
    for (const sg of [-1, 1]) if (sg === -far && ak > .3) ear(sg);
  }, { rim: o.rim, shade: o.shade ?? .5, key: o.key }));
}
// neck and a hint of shoulders for the face sheet
function bust(o) {
  const lt = o.lt || LT0, S = o.who === 'lily' ? SKIN_LILY : SKIN_DAD;
  at(o.x, o.y, o.s, 0, () => {
    figure(lt, 60, () => {
      blob([[-250, 330], [-190, 215], [-70, 176], [70, 176], [190, 215], [250, 330]], rgba(o.cloth || SHIRT, 1), .4);
      poly([[-46, 90], [46, 90], [56, 190], [0, 236], [-56, 190]], rgba(mix(S.base, S.sh, .25), 1));
      inside(() => poly([[-46, 90], [46, 90], [56, 190], [0, 236], [-56, 190]]), () => blurred(10, () => oval((o.turn || 0) * 14, 118, 70, 34, rgba(S.sh, .8))));
      if (!o.cloth) { poly([[-70, 176], [-22, 250], [0, 214], [-50, 160]], rgba([250, 250, 252], 1)); poly([[70, 176], [22, 250], [0, 214], [50, 160]], rgba([226, 230, 240], 1)); }
    });
    humanHead({ ...o, x: 0, y: 0, s: 1 });
  });
}

// ---------- test ----------
function backdrop(c0, c1) { rectf(0, 0, W, H, lg(0, 0, 0, H, [[0, c0], [1, c1]])); }
const STILLS = {
  t1: t => {
    backdrop([70, 96, 108], [38, 54, 66]); glow([150, 190, 200], W / 2, 420, 900, .35);
    const ex = ['charm', 'sly', 'plead', 'rage'];
    ex.forEach((e, i) => { devilHead({ x: 260 + i * 460, y: 470, s: 1.5, expr: e, stage: 3, t }); });
    ['sweet', 'grin', 'whisper'].forEach((e, i) => devilHead({ x: 300 + i * 500, y: 940, s: .7, expr: e, stage: i === 0 ? 0 : 3, turn: i === 2 ? -.7 : 0, t }));
    finish({ bloom: .25 });
  },
  t2: t => {
    backdrop([70, 96, 108], [38, 54, 66]); glow([150, 190, 200], W / 2, 420, 900, .35);
    ['laugh', 'tired', 'horror'].forEach((e, i) => bust({ x: 300 + i * 520, y: 300, s: 1.45, expr: e, age: 38, turn: i === 1 ? .25 : 0 }));
    bust({ x: 1700, y: 380, s: 1.1, expr: 'delight', age: 21, turn: .65, gaze: [.7, 0], cloth: [80, 120, 150] });
    bust({ x: 300, y: 850, s: .95, who: 'lily', expr: 'smile', cloth: YEL });
    bust({ x: 800, y: 850, s: .95, who: 'lily', expr: 'afraid', turn: .6, gaze: [.6, -.5], cloth: YEL });
    bust({ x: 1300, y: 850, s: .95, expr: 'neutral', age: 38, turn: -.5 });
    finish({ bloom: .2 });
  },
};
