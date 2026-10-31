'use strict';
// Loads a film (?film=films/03-lust) or a Short (?short=shorts/15-lust-hook) — folders from the repo root — plays it in
// the browser (space, arrows, the scrubber, #t=12.5), and gives the renderer what it needs:
//   READY (true once the film and the fonts are in), info(), renderAt(t), frame(t, quality), sheet(times, opts).
// ?render=1 hides the controls; ?fonts=system uses the Mac's own fonts (comparisons only).
(async () => {
  const q = new URLSearchParams(location.search), RENDER = q.has('render');
  const load = src => new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => no(new Error('cannot load ' + src)); document.head.appendChild(s);
  });
  const root = p => '../' + p.replace(/^\/+|\/+$/g, '');
  let kind = 'film';
  try {
    if (q.get('short')) {
      kind = 'short';
      await load(root(q.get('short')) + '/short.js');
      setFormat(true);
      await load(root(SHORT.film) + '/film.js');
    } else {
      await load(root(q.get('film') || 'films/03-lust') + '/film.js');
      setFormat(q.get('vertical') === '1');
    }
    if (!FILM) throw new Error('the film did not call defineFilm()');
    if (!FONTS_SYSTEM) await Promise.all(['200', '300', '400', '600', '700', '800', '900'].map(w => document.fonts.load(`${w} 40px "IDF Sans"`))
      .concat([document.fonts.load('italic 400 40px "IDF Serif"'), document.fonts.load('400 40px "IDF Serif"')]));
  } catch (e) {
    window.LOAD_ERROR = String(e && e.stack || e);
    document.body.textContent = window.LOAD_ERROR;
    throw e;
  }
  const DUR = kind === 'short' ? SHORT.dur : FILM.dur;
  const draw = t => kind === 'short' ? renderShort(t) : (SEG = null, renderFilm(t));
  window.DUR = DUR;
  window.renderAt = t => draw(clamp(t, 0, DUR));
  window.frame = (t, quality = .95) => { window.renderAt(t); return cv.toDataURL('image/jpeg', quality).slice(23); };
  window.thumb = (quality = .92) => {            // the code-drawn thumbnail: FILM.thumb through the 'thumb' shot
    SEG = null; VP = { k: 1, x: 0, y: 0 }; PC = [W / 2, H / 2]; PUSH = 1; SHX = SHY = 0;
    px(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, OUT.w, OUT.h);
    SHOT.thumb.draw(1.3, FILM.thumb || null, 0);
    return cv.toDataURL('image/jpeg', quality).slice(23);
  };
  window.info = () => ({ kind, dur: DUR, w: OUT.w, h: OUT.h, title: FILM.title, subtitle: FILM.subtitle,
    audio: kind === 'short' ? shortAudioPlan() : null, cuts: kind === 'short' ? SHORT.segments.map(g => g.start) : FILM.shots.map(s => s[0]) });
  // a contact sheet: frames at the given times in a grid, each labelled; safe: tint what the Shorts player covers
  window.sheet = (times, o = {}) => {
    const cols = o.cols || 6, cw = o.cellW || (OUT.vertical ? 270 : 384), ch = Math.round(cw * OUT.h / OUT.w), lab = 26;
    const sh = document.createElement('canvas'); sh.width = cols * cw; sh.height = Math.ceil(times.length / cols) * (ch + lab);
    const g = sh.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, sh.width, sh.height);
    times.forEach((t, i) => {
      draw(clamp(t, 0, DUR));
      const x = (i % cols) * cw, y = Math.floor(i / cols) * (ch + lab);
      g.drawImage(cv, x, y + lab, cw, ch);
      if (o.safe && OUT.vertical) {
        const sx = cw / OUT.w, z = (a, b, c, d) => g.fillRect(x + a * sx, y + lab + b * sx, (c - a) * sx, (d - b) * sx);
        g.fillStyle = 'rgba(255,0,0,.28)'; z(0, 0, 1080, 375); z(880, 1050, 1080, 1890); z(0, 1680, 880, 1920); z(0, 375, 52, 1680); z(1028, 375, 1080, 1050);
        g.strokeStyle = 'rgba(0,255,90,.9)'; g.lineWidth = 1.5; g.beginPath();
        [[100, 400], [980, 400], [980, 1000], [870, 1000], [870, 1640], [100, 1640]].forEach(([a, b], j) => g[j ? 'lineTo' : 'moveTo'](x + a * sx, y + lab + b * sx));
        g.closePath(); g.stroke();
      }
      g.fillStyle = '#ddd'; g.font = '600 16px sans-serif'; g.textBaseline = 'middle';
      g.fillText((o.labels && o.labels[i]) || `${t.toFixed(2)} s`, x + 6, y + lab / 2);
    });
    return sh.toDataURL('image/jpeg', .9).slice(23);
  };
  document.getElementById('stage').appendChild(cv);
  window.READY = true;
  if (RENDER) { draw(0); return; }

  // ---------- playback controls ----------
  document.body.classList.toggle('tall', OUT.vertical);
  const ui = document.getElementById('ui'); ui.hidden = false;
  const btn = document.getElementById('play'), scrub = document.getElementById('scrub'), tm = document.getElementById('time'), bar = document.getElementById('phases');
  let T = 0, playing = false, last = 0;
  scrub.max = DUR;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const marks = kind === 'short' ? SHORT.segments.map((g, i) => ({ name: String(i + 1), a: g.start, b: g.start + g.len }))
    .concat(SHORT.end ? [{ name: 'end card', a: SHORT.endAt, b: DUR }] : []) : FILM.phases;
  marks.forEach(p => {
    const b = document.createElement('button');
    b.textContent = p.name; b.onclick = () => { seek(p.a + .01); b.blur(); };
    p.btn = b; bar.appendChild(b);
  });
  function show() {
    draw(T);
    scrub.value = T; tm.textContent = `${fmt(T)} / ${fmt(DUR)}`;
    marks.forEach(p => p.btn.classList.toggle('on', T >= p.a && (T < p.b || p.b === DUR)));
  }
  function seek(s) { T = clamp(s, 0, DUR); show(); }
  function tick(now) {
    if (!playing) return;
    T = Math.min(DUR, T + Math.min(.1, (now - last) / 1000)); last = now;
    if (T >= DUR) { playing = false; btn.textContent = '▶'; }
    show();
    if (playing) requestAnimationFrame(tick);
  }
  function toggle() {
    playing = !playing; btn.textContent = playing ? '❚❚' : '▶';
    if (playing) { if (T >= DUR) T = 0; last = performance.now(); requestAnimationFrame(tick); }
  }
  btn.onclick = () => { toggle(); btn.blur(); };
  scrub.oninput = () => seek(+scrub.value);
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.code === 'ArrowRight') seek(T + (e.shiftKey ? 1 / 30 : 5));
    else if (e.code === 'ArrowLeft') seek(T - (e.shiftKey ? 1 / 30 : 5));
  });
  const jump = location.hash.match(/t=([\d.]+)/);
  if (jump) T = clamp(+jump[1], 0, DUR);
  show();
})();
