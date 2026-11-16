// ---------- THE BOTTLE: the cut ----------
// Times follow the music: the bar scenes cut on the score's beats (100 bpm from 4.33 s), the comeback on the anthem's
// (127 bpm from 70.03 s). mix.py uses the same numbers.
const CUT = [
  [0, 'cold'], [3.6, 'sting'],
  [4.33, 'phonehand'], [6.73, 'bardoor', { mode: 'beckon' }], [8.53, 'lilyout'],
  [10.33, 'barwide', { round: 1 }], [12.13, 'pour'], [13.33, 'slide'], [14.53, 'drink'], [15.73, 'trade', { what: 'watch' }], [17.53, 'bottlein', { n: 1 }],
  [18.73, 'lilyA'],
  [20.53, 'barwide', { round: 2, st: { watch: 1 } }], [22.33, 'lilyB'], [24.13, 'phonebar'], [25.33, 'trade', { what: 'phone' }], [27.13, 'bottlein', { n: 2 }],
  [28.33, 'lilyface', { ex: 'worry' }],
  [29.53, 'twoshot'], [31.93, 'photohand'], [33.13, 'trade', { what: 'photo' }], [34.33, 'bottlein', { n: 3 }],
  [35.53, 'lilyC'],
  [37.33, 'montage'],
  [40.33, 'empty'], [41.73, 'twist'], [44.33, 'knuckles'],
  [45.13, 'hisface', { look: 'bar', from: 'empty', to: 'shock', at: 0, jerk: 1 }], [46.13, 'devface'], [47.93, 'replays'], [50.03, 'bigbottle'],
  [51.83, 'hisface', { look: 'red', from: 'fear', to: 'resolve', tremble: 1, at: .25 }], [52.83, 'smash'], [54.03, 'scream'], [55.23, 'grab'],
  [56.43, 'runside'], [58.03, 'puddle'], [58.83, 'runface'],
  [59.93, 'arrive'], [61.93, 'lilyface', { ex: 'hurt' }], [63.43, 'kneel'], [65.83, 'reach'], [67.83, 'walkhome'],
  [70.03, 'sink'], [71.95, 'pushups', { mode: 'watch' }], [73.84, 'hisface', { look: 'dawn', from: 'strain', to: 'strain', sweat: 1, tilt: .12, noblink: 1 }], [74.78, 'bridge'], [77.15, 'pullups'],
  [79.03, 'pushups', { mode: 'count' }], [80.93, 'schoolam'],
  [82.34, 'bardoor', { mode: 'offer' }], [84.74, 'hisface', { look: 'street', from: 'calm', to: 'tempted', at: .1, rain: 1 }], [85.94, 'hand'], [87.34, 'bardoor', { mode: 'after' }],
  [89.14, 'goldwait'], [91.14, 'jump'], [92.94, 'hug'], [95.74, 'bardoor', { mode: 'eyes' }], [97.94, 'walkaway', { hit: 2.06 }],
  [101.54, 'title', { at: 101.6 }]
];
for (const c of CUT) if (!SHOT[c[1]]) {                                     // a part not built yet shows its name (never in a finished film)
  const name = c[1]; defShot(name, (t, p, L) => { fill([24, 26, 34], [12, 12, 18]); screen(); font(90, SANS, '800'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba([120, 130, 150]); ctx.fillText(name + (p && (p.mode || p.ex) ? ' · ' + (p.mode || p.ex) : ''), W / 2, H / 2); });
  (window.MISSING = window.MISSING || []).push(name);
}
defineFilm({
  title: 'THE BOTTLE', subtitle: 'SHE WAITED TILL DARK', dur: 103.9, fadeOut: 1.3,
  app: { name: 'BAR', label: 'BAR', icon: '!', color: [226, 132, 30] },
  phases: [{ name: 'Cold open', a: 0, b: 4.33 }, { name: 'The deal', a: 4.33, b: 40.33 }, { name: 'The twist', a: 40.33, b: 52.83 }, { name: 'The run', a: 52.83, b: 70.03 }, { name: 'The comeback', a: 70.03, b: 89.14 }, { name: 'Day 90', a: 89.14, b: 103.9 }],
  words: [
    { id: 'C1', t: .1, d: 3.3, text: 'YOU DRINK TO FORGET… GUESS WHO REMEMBERS.', show: false },
    { id: 'W1', t: 6.95, d: 1.3, text: "First one's free." },
    { id: 'W2', t: 15.95, d: 1.3, text: 'Forget the time.' },
    { id: 'W3', t: 25.75, d: 1.2, text: "They'll call back." },
    { id: 'W4', t: 29.8, d: 1.9, text: "She'll wait. She always does." },
    { id: 'R1', t: 46.28, d: 1.3, text: 'I took nothing.', real: true },
    { id: 'R2', t: 48.0, d: 1.7, text: 'You handed her over.', real: true },
    { id: 'R3', t: 50.15, d: 1.4, text: "You're next.", real: true },
    { id: 'W5', t: 83.3, d: 1.2, text: 'Still free…' },
    { id: 'R4', t: 96.2, d: 1.5, text: 'She waited. So can I.', real: true },
    { id: 'C2', t: 98.3, d: 3, text: 'GUESS WHO REMEMBERS. SHE DOES.', show: false }
  ],
  slams: [3.6, 45.13, 46.13, 47.93, 48.43, 48.93, 50.03, 53.05, 54.03, 100.0],
  glitch: [[3.5, 3.9, 1], [45.1, 45.45, 1], [47.9, 48.1, .6], [50.0, 50.25, .7]],
  flash: { sting: [255, 60, 60], devface: [255, 60, 60], twist: [255, 255, 255] },
  vignette: [[0, .5], [40, .55], [45, .7], [53, .6], [60, .5], [69.9, .5], [70.1, .25], [82.2, .25], [82.5, .5], [89, .5], [89.3, .2], [101.4, .2], [101.6, .5]],
  heartbeat: [[84.74, 87.34]],
  expr: [[0, 'tired']],
  shots: CUT
});
