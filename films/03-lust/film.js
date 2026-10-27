'use strict';
// FILM 03: LUST | It Watches Back (1:50). The reference film of the house style (approved by the owner, 27 Oct 2026).
// Every line is the devil's: kind until the reveal, then its real voice. Nights 1-4 it comes closer (the window, the
// foot of the bed, beside him, behind him with its hands on his shoulders); the phone dies and the black glass shows it
// behind him; he smashes the phone; at 6:00 AM the music turns and he trains; 9:30 PM it attacks and he deletes the
// app; weeks later its eyes in the mirror: "I'll wait." Screenplay: SCREENPLAY.md. Music: music.json, mix.py.
// The single-file original that rendered the uploaded film is original/lust.html.

const COLD = 'YOU THINK YOU’RE ALONE WHEN YOU WATCH IT…';
const RUN = [67.2, 72];
// the phone's screen: a blurred 18+ video under an original logo. Only an abstract skin-tone mosaic and a video player's
// chrome: it reads as censored, and nothing explicit is drawn underneath. dy: how far a banner pushed the page down
function pornScreen(x, y, w, h, s, t, a, dy = 0) {
  ctx.save(); rrect(x, y, w, h, 52 * s); ctx.clip();
  ctx.fillStyle = rgba([10, 8, 10], a); ctx.fillRect(x, y, w, h);
  statusClock(x, y, s, '3:51', a);
  ctx.translate(0, dy * s);
  ctx.fillStyle = rgba([60, 56, 62], a); rrect(x + 24 * s, y + 70 * s, w - 48 * s, 44 * s, 12 * s); ctx.fill();
  font(30 * s, SANS, '900'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const lw = ctx.measureText('XXX').width;
  ctx.shadowColor = rgba(C.red, .8 * a); ctx.shadowBlur = 12 * s * VP.k;
  ctx.fillStyle = rgba([255, 60, 70], a); ctx.fillText('XXX', x + 44 * s, y + 93 * s); ctx.shadowBlur = 0;
  font(17 * s, SANS, '600'); ctx.fillStyle = rgba(C.cream, .75 * a); ctx.fillText('videos', x + 54 * s + lw, y + 94 * s);
  badge18(x + w - 100 * s, y + 75 * s, s, a);
  mosaic(x, y + 130 * s, w, 300 * s, 22 * s, t, a);
  progressBar(x, y, w, s, 446, .62 + .002 * (t % 10), a);
  feed(x, y, w, h, s, t, 490, (tx, ty, tw, th, k) => mosaic(tx, ty, tw, th, 14 * s, t * .5 + k * 3.1, a), a);   // the feed keeps scrolling: more videos
  ctx.restore();
}

defineFilm({
  title: 'LUST', subtitle: 'IT WATCHES BACK', dur: 110.5,
  app: { name: 'XXX', label: 'XXX', icon: 'X', color: [200, 16, 46] },
  viceScreen: pornScreen,
  handScreen: t => mosaic(-13, -23, 26, 30, 4.4, t),
  thumb: { word: 'LUST', hook: 'IT WATCHES', expr: 'fear' },   // the code-drawn fallback; the uploaded one is ChatGPT's (thumb.jpg)
  phases: [
    { name: 'Cold open', a: 0, b: 4 },
    { name: 'Night 1', a: 4, b: 14 },
    { name: 'Nights 2–4', a: 14, b: 43 },
    { name: 'It shows itself', a: 43, b: 60.6 },
    { name: 'He fights back', a: 60.6, b: 95.5 },
    { name: 'Weeks later', a: 95.5, b: 110.5 }
  ],
  // the devil's words on screen (there is no narration): kind whispers until 0:44, then its real voice (real: true)
  words: [
    { id: 'VO01', t: .1, d: 1.8, text: 'You think you’re alone when you watch it… don’t you?', show: false },   // the cold line has its own type
    { id: 'VO02', t: 5.1, d: 2.2, text: 'Shh… it’s okay. Everyone does it.' },
    { id: 'VO03', t: 8, d: 2.3, text: 'You worked hard today. You deserve this.' },
    { id: 'VO04', t: 11.3, d: 1.8, text: 'Just one more. Then sleep.' },
    { id: 'VO05', t: 14.9, d: 2.2, text: 'She’ll call again. Stay with me.' },
    { id: 'VO06', t: 19.3, d: 2, text: 'See? You feel better already.' },
    { id: 'VO07', t: 22.9, d: 2.2, text: 'Who needs them? You have me.' },
    { id: 'VO08', t: 27.3, d: 2, text: 'I’ll never leave you.' },
    { id: 'VO09', t: 32.6, d: 3.6, text: 'She’d never understand you… not like I do.' },
    { id: 'VO10', t: 39.95, d: 2.8, text: 'One more… one more… one more…', show: false },   // the montage writes it
    { id: 'VO11', t: 44.1, d: 2, text: 'I was never in the phone.', real: true },
    { id: 'VO12', t: 46.7, d: 1.9, text: 'I was always… in you.', real: true },
    { id: 'VO13', t: 50.75, d: 2.3, text: 'Every night… you fed me.', real: true },
    { id: 'VO14', t: 53.2, d: 1.8, text: 'Now you’re mine.', real: true },
    { id: 'VO15', t: 55.2, d: 1.4, text: '(it screams)' },
    { id: 'VO16', t: 61.6, d: 2.2, text: 'Come back… just once.' },
    { id: 'VO17', t: 68, d: 1.8, text: 'You’ll get tired.' },
    { id: 'VO18', t: 84.3, d: 1.2, text: 'Just one look…' },
    { id: 'VO19', t: 88.3, d: 1.1, text: '(it shrieks)' },
    { id: 'VO20', t: 93.1, d: 1.6, text: 'Tomorrow, then.' },
    { id: 'VO21', t: 100.3, d: 1.2, text: 'I’ll wait.', real: true }
  ],
  slams: [3.4, 48.6, 51, 54.8, 55.15, 60.6, 84.3, 103.9, 105.9],          // moments that hit: each shakes the frame
  glitch: [[3.4, 4, 1], [42.6, 43.1, .9], [55.15, 55.6, 1], [58.6, 59.2, .7], [84.3, 84.6, .8], [88.2, 88.6, .7], [101.7, 102.3, 1]],
  flash: { clock: [255, 255, 255], devilface: [255, 60, 60], sting: [255, 60, 60] },   // a two-frame flash on these cuts
  vignette: [[0, .75], [60.6, .75], [61.3, .5], [78.8, .55], [95.5, .75]],
  heartbeat: [[43, 48.6], [59.2, 60.6]],
  // his face, beat by beat
  expr: [[0, 'glazed'], [16.4, 'tired'], [24.4, 'empty'], [32.4, 'ashamed'], [41.1, 'empty'], [48.6, 'shock'],
    [53.9, 'resolve'], [61.3, 'strain'], [67.2, 'focus'], [72.7, 'strain'], [79.5, 'calm'], [81.5, 'smile'], [82.4, 'calm'],
    [84.3, 'strain'], [86, 'resolve'], [89.4, 'calm']],
  // the cut: [start, shot, settings]
  shots: [
    [0, 'cold', { lines: [[COLD, .1, 1.1], ['…DON’T YOU?', 1.2, 1.5]], out: [1.8, 2] }],
    [2, 'room', { spot: 'window', o: t => ({ eyes: win(t, 2.3, 3.5, .3, .01) }) }],
    [3.4, 'sting'],
    // night 1: it watches from the window
    [4, 'clock', '11:48 PM'],
    [5, 'phone', { screen: 'vice' }],
    [6.6, 'face', 'night'],
    [7.8, 'room', { spot: 'window', o: t => ({ a: .35 + .15 * inv(7.8, 9.6, t), eyes: .9 }) }],
    [9.6, 'phone', { screen: 'vice', notif: [9.8, 'mom', 'Mom', 'Call me when you can ♥'], swipe: 10.7 }],
    [11.2, 'room', { fr: [2.2, 975, 640], spot: 'window' }],
    [12.6, 'room', { lit: false, spot: 'window', o: t => ({ eyes: 1 - win(t, 13.3, 13.5, .08, .08) }) }],
    // night 2: at the foot of the bed
    [14, 'clock', '12:31 AM'],
    [14.8, 'phone', { screen: 'vice', notif: [15, 'call', 'Phone', '3 missed calls from Mom'], swipe: 15.9 }],
    [16.4, 'room', { spot: 'foot', creep: 40, hunch: .72, o: () => ({ a: .7, eyes: 1, grin: .15 }) }],
    [18.2, 'face', 'night'],
    [19.2, 'devilface', { spot: 'foot', o: () => ({ a: .8, grin: .45, lean: .3 }) }],
    [20.8, 'room', { fr: [2.2, 975, 640], spot: 'foot', hunch: .72 }],
    // night 3: beside him, bending closer
    [22, 'clock', '1:47 AM'],
    [22.8, 'phone', { screen: 'vice', notif: [23, 'mail', 'Work — final warning', 'Late again. See me at 9.'], swipe: 23.9 }],
    [24.4, 'room', { spot: 'beside', creep: 30, hunch: .82, o: t => ({ a: .85, eyes: 1, grin: .4, lean: .5 + .5 * inv(24.4, 26.2, t) }) }],
    [26.2, 'face', 'night'],
    [27.2, 'devilface', { spot: 'beside', o: () => ({ a: .9, grin: .7, lean: 1 }) }],
    [28.8, 'room', { spot: 'beside', hunch: .86, o: () => ({ a: .85, eyes: 1, grin: .5, lean: 1 }) }],
    // night 4: right behind him, its hands settle on his shoulders
    [30, 'clock', '3:05 AM'],
    [30.8, 'phone', { screen: 'vice', notif: [31, 'msg', 'Maya', 'I waited an hour. Guess you’re busy.'], swipe: 31.9 }],
    [32.4, 'room', { spot: 'behind', hunch: .9, o: t => ({ a: 1, eyes: 1, grin: .6, reach: .2 + .45 * inv(32.4, 34.6, t), lean: 1 }) }],
    [35, 'face', 'night'],
    [36, 'devilface', { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }],
    [37.4, 'room', { fr: [2, 930, 600], spot: 'behind', hunch: .9, o: () => ({ a: 1, eyes: 1, grin: .8, reach: .65, lean: 1 }) }],
    // everything it took, faster and faster
    [40, 'montage', { step: .375, word: 'one more', seq: [
      ['phone', { notif: ['mom', 'Mom', 'Call me when you can ♥'] }], ['phone', { notif: ['mail', 'Work — final warning', 'Late again. See me at 9.'] }],
      ['phone', { notif: ['msg', 'Maya', 'I waited an hour. Guess you’re busy.'] }], ['face', { look: 'night', expr: 'empty' }],
      ['clock', ['3:51 AM', '4:22 AM', '4:57 AM']], ['devilface', { spot: 'behind', o: () => ({ grin: 1, lean: 1 }) }],
      ['face', { look: 'red', expr: 'empty' }], ['black']] }],
    // it shows itself
    [43, 'phone', { screen: 'vice', dying: 43.5 }],
    [43.8, 'reflection', { appear: 44.1 }],
    [46.4, 'reflection', { z: 1.5 }],
    [48.6, 'room', { spot: 'behind', hunch: .55, flicker: true, o: t => ({ a: 1, eyes: 1, grin: 1, reach: .7 + .3 * inv(48.6, 50.8, t), lean: 1 }) }],
    [51, 'devilface', { spot: 'behind', twitch: true, o: () => ({ grin: 1, lean: 1 }) }],
    [53, 'face', 'red'],
    [54.6, 'room', { spot: 'behind', hunch: .2, flicker: true, throwAt: 54.8, o: t => ({ a: 1, eyes: 1, grin: 1 - inv(55.15, 55.5, t),
      scream: inv(55.15, 55.4, t), reach: .9 - .9 * inv(55.15, 55.6, t), lean: 1 - 1.6 * inv(55.15, 55.8, t) }) }],
    [57.4, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .65 * inv(57.4, 59.2, t), eyes: 1 - .5 * inv(58, 59.2, t), scream: 1 - inv(58.4, 59.2, t), lean: -.6 }) }],
    [59.2, 'room', { spot: 'window', hunch: .3, lit: false, shardsAt: 55.15, o: t => ({ eyes: .45 * win(t, 59.6, 60.6, .3, .2) }) }],
    // he fights back: the music turns here
    [60.6, 'clock', '6:00 AM'],
    [61.3, 'pushups'],
    [63.7, 'face', 'dawn'],
    [64.5, 'shower', { eyes: [64.7, 66.3] }],
    [66.5, 'clock', '6:30 AM'],
    [67.2, 'run', { fr: [1, 960, 540], run: RUN }], [68.4, 'run', { fr: [2.4, 760, 740], run: RUN }],
    [69.6, 'run', { fr: [1.9, 800, 470], run: RUN }], [70.8, 'run', { fr: [1, 960, 540], run: RUN }],
    [72, 'clock', '7:15 AM'],
    [72.7, 'gym', { move: 'pullup', fr: [1.15, 960, 520] }],
    [74.5, 'gym', { move: 'squat', fr: [1.35, 900, 640] }],
    [76.3, 'gym', { move: 'curl', fr: [1.75, 960, 650] }],
    [77.9, 'face', 'gym'],
    [78.8, 'clock', '8:00 PM'],
    [79.5, 'phone', { screen: 'call', call: { name: 'Mom', initial: 'M', from: 724 } }],
    [81.5, 'face', 'lamp'],
    [82.4, 'clock', '9:30 PM'],
    [83.1, 'phone', { screen: 'home', notif: [83.3, 'vice', 'XXX', 'New videos for you'] }],
    [84.3, 'devilface', { spot: 'behind', scare: true, o: () => ({ grin: 1, lean: 1 }) }],
    [85.1, 'face', 'red'],
    [86, 'phone', { screen: 'home', del: 86 }],
    [88.2, 'devilface', { spot: 'behind', o: t => ({ a: 1 - .7 * inv(88.2, 89.4, t), scream: 1, lean: -.6 }) }],
    [89.4, 'phone', { screen: 'chat', chat: { name: 'Maya', items: [
      { at: -1, text: 'I waited an hour. Guess you’re busy.', y: 150 },
      { at: .2, text: 'I’m sorry about last week.', me: true, y: 260 },
      { at: .6, text: 'Coffee on Saturday?', me: true },
      { at: 1, text: '•••', until: 1.6, fade: 0, y: 410 },
      { at: 1.6, text: 'Saturday :)', fade: .15, y: 410 },
      { at: 1.9, text: '♥', fade: .15, col: [200, 50, 90] }] } }],
    [91.8, 'clock', '11:00 PM'],
    [92.5, 'sleep', { eyes: [93.3, 95.3] }],
    // weeks later
    [95.5, 'card', 'WEEKS LATER'],
    [96.9, 'mirror', { eyes: [100.1, 101.7] }],
    [101.7, 'black'],
    [102.3, 'end', { line: COLD, typeAt: 102.4, slam: 'YOU’RE NOT.', slamAt: 103.9 }],
    [105.7, 'title', { at: 105.9 }]
  ]
});
