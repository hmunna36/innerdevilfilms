// ===== RAGE, the cut =====
const COLD = 'EVERY TIME YOU LOSE IT…', COLD2 = '…IT GROWS.';
const RUN = [72.1, 76.7];
const SAM_TABLE = (o = {}) => kidSit(1300, 760, .8, -1, o);
const SAM_WAVE = (t) => SAM_TABLE({ hands: [[1220, 690], [1236 + Math.sin(t * 12) * 18, 540]] });
const SAM_JUMP = (t) => { const k = E.out(inv(T_POT, T_POT + .15, t)) * (1 - inv(T_POT + .5, T_POT + 1.2, t)); return SAM_TABLE({ lean: .08 - .2 * k, hands: [[1226, 690 - 40 * k], [1240, 690 - 50 * k]] }); };
const SAM_FREEZE = (t, t0) => { const k = E.out(inv(t0, t0 + .12, t)); return SAM_TABLE({ lean: .08 - .16 * k, hands: [[1226 + 14 * k, 690], [1240 + 14 * k, 692]] }); };
// SNAP 1: the pot, slammed into the sink
const MAN_POT = (t) => { const k = E.io(inv(T_POT - .3, T_POT, t)); return figPose(560, FY, 1.1, 1, { lean: .1 + .15 * k, hands: [[lerp(600, 720, k), lerp(500, 600, k)], [lerp(640, 760, k), lerp(490, 590, k)]] }); };
const SNAP1 = { man: MAN_POT, pot: { at: T_POT }, sam: SAM_JUMP, samEx: (t) => t > T_POT ? EXPR.startle : EXPR.smile, shadow: .5 };
// SNAP 2: the shout
const MAN_SHOUT = (t) => figPose(900, FY, 1.1, 1, { lean: .1 + .18 * E.out(inv(T_SHOUT - .1, T_SHOUT + .1, t)), head: .1 });
const SNAP2 = { man: MAN_SHOUT, dev: () => ({ at: [730, FY, 1.1], o: { grin: .7, reach: .9, lean: .5 } }), shock: T_SHOUT,
  sam: (t) => SAM_FREEZE(t, T_SHOUT + .05), samEx: (t) => t > T_SHOUT + .05 ? EXPR.startle : EXPR.smile };
// SNAP 3: the fist through the kitchen wall
const MAN_PUNCH = (t) => { const k = E.io(inv(T_PUNCH - .45, T_PUNCH - .1, t)), h = t < T_PUNCH - .1 ? lerp2([1340, 600], [1250, 560], k) : lerp2([1250, 560], [1470, 500], E.out(inv(T_PUNCH - .1, T_PUNCH, t))); return figPose(1330, FY, 1.1, 1, { lean: .12, hands: [null, h] }); };
const SNAP3 = { man: MAN_PUNCH, dev: () => ({ at: [1090, FY, 1.45], o: { grin: 1, reach: .95, lean: 3 } }), fr: [1.15, 1180, 500] };
// SNAP 4: in the hallway he draws his fist back, slowly; one blow, into the wall beside the mirror. It is bigger than
// ever: its head has gone up through the ceiling
const MAN_WALL = (t) => { const back = E.io(inv(35.4, 37.0, t)), hit = E.out(inv(38.72, 38.9, t)) * (1 - inv(39.1, 39.6, t)); return figPose(1040, FY, 1.1, 1, { lean: .1 - .06 * back + .16 * hit, hands: [null, lerp2(lerp2([1100, 600], [960, 420], back), [1190, 520], hit)] }); };
const DEV4 = () => ({ at: [190, FY + 260, 2.4], o: { grin: 1, reach: .9, lean: 5.6 } });
// the reveal's end: he kneels at Sam's door, palms open on the floor; it shrinks back into his shadow
const KNEEL = (t) => manKneel(780, FY, 1.1, 1, E.io(inv(55.1, 55.7, t)), 1, true);
const DEV_SHRINK = (t) => { const k = E.io(inv(55.3, 56.9, t)); return { at: [lerp(470, 640, k), FY, lerp(1.6, .35, k)], o: { a: 1 - .85 * k, scream: 1 - .6 * k, grin: 0, reach: .3 * (1 - k), lean: lerp(3.6, .5, k), eyes: 1 - .6 * k } }; };
const CHAT1 = [{ at: -1, text: 'Sam texted me. Is everything ok??', y: 150 }];

defineFilm({
  title: 'RAGE', subtitle: 'IT HOLDS HIS FISTS', dur: 116,
  app: { name: 'Mom', label: 'M', icon: 'heart', color: [76, 200, 120] },
  viceScreen: lockScreen,
  handScreen: t => { ctx.fillStyle = 'rgb(240,160,100)'; ctx.fillRect(-13, -23, 26, 44); },
  thumb: { word: 'RAGE', hook: 'IT GROWS', expr: 'fear' },
  phases: [
    { name: 'Cold open', a: 0, b: 3.2 }, { name: '7:02 PM', a: 3.2, b: 18.1 }, { name: '7:48 PM', a: 18.1, b: 26.3 }, { name: '8:31 PM', a: 26.3, b: 34.0 },
    { name: '9:17 PM', a: 34.0, b: 44.0 }, { name: 'It shows itself', a: 44.0, b: 63.4 }, { name: 'He fights back', a: 63.4, b: 100.5 }, { name: 'Weeks later', a: 100.5, b: 116 }
  ],
  words: [
    { id: 'W01', t: .1, d: 2.2, text: 'Every time you lose it… it grows.', show: false },
    { id: 'W02', t: 15.8, d: 2.1, text: 'Long day. You’re allowed.' },
    { id: 'W03', t: 23.5, d: 1.9, text: 'He has to learn.' },
    { id: 'W04', t: 30.0, d: 1.9, text: 'You couldn’t help it.' },
    { id: 'W05', t: 35.3, d: 1.9, text: 'You just want to talk.' },
    { id: 'R01', t: 44.8, d: 1.9, text: 'You never lost control.', real: true },
    { id: 'R02', t: 46.85, d: 1.65, text: 'You handed it to me.', real: true },
    { id: 'R03', t: 50.15, d: 2.0, text: 'Look. He’s learning.', real: true },
    { id: 'S01', t: 55.3, d: 1.6, text: '(it screams)' },
    { id: 'W06', t: 67.6, d: 1.9, text: 'You’ll snap again.' },
    { id: 'W07', t: 72.5, d: 1.9, text: 'You can’t outrun me.' },
    { id: 'W08', t: 90.4, d: 1.8, text: 'Go on. Teach him.' },
    { id: 'S02', t: 93.1, d: 1.1, text: '(it shrieks)' },
    { id: 'R04', t: 105.6, d: 2.0, text: 'Lose it once. That’s all I need.', real: true }
  ],
  slams: [2.6, 11.8, 20.8, 29.7, 38.9, 49.15, 54.05, 63.4, 90.4, 109.6, 111.5],
  glitch: [[.85, 1.15, .7], [2.6, 3.1, 1], [13.35, 13.7, .8], [40.9, 41.1, .8], [44.2, 44.55, 1], [49.15, 49.55, .7], [54.05, 54.45, .9], [90.4, 90.7, .8], [93.1, 93.4, .7], [105.4, 105.8, .9]],
  flash: { led: [255, 214, 170], dface: [255, 60, 60], sting: [255, 60, 60] },
  vignette: [[0, .75], [63.4, .75], [64.1, .5], [85.2, .55], [100.5, .7]],
  heartbeat: [[44.0, 49.0], [52.5, 53.7], [59.5, 61.0]],
  expr: [[0, 'tired'], [11.7, 'rage'], [17.4, 'tired'], [20.75, 'shout'], [21.9, 'rage'], [23.4, 'ashamed'], [28.5, 'rage'], [29.6, 'shout'], [30.2, 'rage'],
    [40.5, 'empty'], [44.45, 'shock'], [53.3, 'resolve'], [59.9, 'look'], [63.4, 'resolve'], [66.3, 'strain'], [72.1, 'focus'], [78.3, 'strain'], [82.0, 'calm'],
    [87.2, 'smile'], [88.95, 'strain'], [92.5, 'calm'], [94.1, 'laugh'], [95.6, 'calm'], [102.1, 'laugh'], [103.4, 'calm']],
  shots: [
    [0, 'fist', { cold: true, lines: [[COLD, .1, .5], [COLD2, .55, .85]], out: [2.25, 2.5], eyesAt: .85, clawsIn: [1.6, 1.95], shake: 1, look: 'ember' }],
    [2.6, 'sting'],
    // 7:02 PM: home
    [3.2, 'led', '7:02 PM'],
    [4.4, 'kitchen', { man: (t, L) => { const k = E.io(inv(4.5, 4.85, t)); return figPose(540, FY, 1.1, 1, { hands: [null, [lerp(600, 680, k), lerp(640, 580, k)]] }); }, bag: 4.85, shadow: .5, sam: SAM_WAVE, samEx: 'smile', ex: 'tired' }],
    [6.2, 'fridge', {}],
    [7.8, 'phone', { screen: 'vice', z: 1.12, lock: { at: 7.95, title: 'Mom', text: 'Night shift. Watch your brother ♥', swipe: 10.15 } }],
    [10.4, 'stove', { grab: 10.9 }],
    [11.6, 'kitchen', Object.assign({ fr: [1.2, 820, 560] }, SNAP1)],
    [13.0, 'kitchen', { fr: [1.45, 640, 480], man: (t) => figPose(560, FY, 1.1, 1, { lean: .12 }), ex: 'rage', shadow: (t) => 1 - inv(13.45, 13.8, t),
      dev: (t) => ({ at: [396, FY, .85], o: { a: E.out(inv(13.45, 13.8, t)), eyes: inv(13.15, 13.35, t), grin: .35 * inv(13.8, 14.2, t), reach: .9 * E.io(inv(13.8, 14.1, t)) } }) }],
    [14.7, 'samface', { look: 'ember', ex: 'startle', jolt: .05 }],
    [15.7, 'dface', { at: [700, FY, .85], o: () => ({ grin: .45 }), look: 'ember' }],
    [17.0, 'face', 'ember'],
    // 7:48 PM: the juice, the shout
    [18.1, 'led', '7:48 PM'],
    [19.2, 'table', { hand: true }],
    [20.6, 'kitchen', SNAP2],
    [22.4, 'samface', { look: 'ember', ex: 'frozen', crayon: 22.6 }],
    [23.4, 'kitchen', { man: (t) => figPose(900, FY, 1.1, 1, { lean: .08 }), dev: () => ({ at: [730, FY, 1.1], o: { grin: .8, reach: .9, lean: .6 } }),
      sam: (t, L) => figPose(lerp(1290, 1900, E.io(clamp((L - .2) / 1.6))), FY, .74, 1, { step: Math.sin(L * 9) }, true), samEx: 'flinch' }],
    [25.3, 'chair', {}],
    // 8:31 PM: the wall
    [26.3, 'phone', { screen: 'vice', z: 1.12, lock: { at: 26.45, title: 'Mom', text: 'Sam texted me. Is everything ok??', col: [255, 96, 150] } }],
    [28.5, 'face', 'hot'],
    [29.4, 'kitchen', SNAP3],
    [31.3, 'drawing', {}],
    [32.9, 'hole', { eye: 33.2 }],
    // 9:17 PM: Sam's door
    [34.0, 'led', '9:17 PM'],
    [35.2, 'hall', { man: MAN_WALL, dev: DEV4, fr: [1.05, 900, 470], through: true }],
    [37.2, 'samroom', { fr: [1.25, 1180, 560] }],
    [38.6, 'hall', { man: MAN_WALL, dev: DEV4, fr: [1.2, 1000, 470], through: true }],
    [40.0, 'face', 'hot'],
    // the evening flashes past in the broken glass
    [41.0, 'cracked', { step: .333, seq: [['kitchen', SNAP1, 11.8], ['samface', { look: 'ember', ex: 'startle' }, 14.75], ['table', { hand: true }, 19.65], ['kitchen', SNAP2, 20.85],
      ['samface', { look: 'ember', ex: 'frozen', crayon: 22.6 }, 22.7], ['kitchen', SNAP3, 29.65], ['hole', { eye: 33.2 }, 33.4], ['led', '9:18 PM', 43.0], ['led', '9:19 PM', 44.1]] }],
    // it shows itself
    [44.0, 'cracked', { lower: [44.15, 45.9], appear: 44.45 }],
    [46.2, 'cracked', { z: 1.32, appear: 0, lower: [0, .1] }],
    [49.0, 'samroom', { horns: [49.15, 49.55], fr: [1.2, 1240, 520] }],
    [50.0, 'samroom', { horns: [49.15, 49.55], grin: 51.2, fr: [2.2, 1480, 420] }],
    [52.5, 'face', 'hot'],
    [53.7, 'fist', { claws: 1, open: (t) => E.out(inv(53.9, 54.4, t)), pry: [54.05, 54.6], look: 'hot' }],
    [55.1, 'hall', { man: KNEEL, dev: DEV_SHRINK, fr: [1, 900, 520] }],
    [57.3, 'dface', { at: [560, FY, 1], o: () => ({ scream: 1, grin: 0 }), fade: [57.3, 58.3] }],
    [58.3, 'samroom', { horns: [49.15, 49.55], crumble: [58.3, 58.9], lower: (t) => E.io(inv(58.5, 59.2, t)), look: (t) => E.io(inv(58.8, 59.3, t)), samEx: (t) => t < 58.8 ? EXPR.frozen : EXPR.look, fr: [1.2, 1180, 560] }],
    [59.5, 'hall', { man: (t) => manKneel(780, FY, 1.1, 1, 1, 1, true), ajar: (t) => E.io(inv(59.9, 60.5, t)), fr: [1.7, 900, 640] }],
    [61.0, 'phone', { screen: 'chat', z: 1.12, chat: { name: 'Mom', items: [...CHAT1, { at: .1, text: 'No. I scared him. I’m getting help.', me: true, y: 290 }] } }],
    // he fights back (days); it is smaller every day
    [63.4, 'led', { label: '7:30 AM', gym: true, day: 'DAY 1' }],
    [65.0, 'gym', { move: 'shutter', fr: [1, 760, 540] }],
    [66.3, 'gym', { move: 'rope', fr: [1.3, 880, 600] }],
    [67.5, 'gym', { move: 'pushup', fr: [1.15, 1000, 640], dev: { at: [1560, GF, .7], fade: [67.5, 68.8] } }],
    [68.8, 'gym', { move: 'pullfail', fr: [1.15, 960, 520] }],
    [70.1, 'led', { label: '7:15 AM', gym: true, day: 'DAY 4' }],
    [72.1, 'bridge', { fr: [1, 960, 540], run: RUN, devS: .5 }], [73.25, 'bridge', { fr: [2.2, 780, 640], run: RUN, devS: .5 }],
    [74.4, 'bridge', { fr: [1.8, 800, 500], run: RUN, devS: .5 }], [75.55, 'bridge', { fr: [1, 960, 540], run: RUN, devS: .5 }],
    [76.7, 'led', { label: '6:45 AM', gym: true, day: 'DAY 9' }],
    [78.3, 'gym', { move: 'squat', fr: [1.2, 1000, 620], dev: { at: [1560, GF, .38], fade: [78.3, 79.5] } }],
    [79.5, 'gym', { move: 'curl', fr: [1.7, 960, 650] }],
    [80.7, 'gym', { move: 'pullup', fr: [1.15, 960, 520] }],
    [82.0, 'gym', { move: 'breathe', fr: [1.6, 900, 620] }],
    [83.6, 'gym', { move: 'breathe', fr: [2.5, 960, 600] }],
    // DAY 12: dinner
    [85.2, 'led', { label: '7:40 PM', day: 'DAY 12' }],
    [87.2, 'kitchen', { fr: [1.3, 460, 560], man: (t) => figPose(230, FY, 1.1, 1, { hands: [null, [380, 560 + Math.sin(t * 6) * 8]] }), ex: 'smile',
      sam: (t) => figPose(520, 760, .74, -1, { hands: [null, [420 + Math.sin(t * 6) * 16, 560]] }, true), samEx: 'laugh', chair: true }],
    [88.6, 'table', { hand: true, leap: 89.15 }],
    [89.6, 'fist', { clawsIn: [89.75, 90.25], shake: 1, look: 'ember' }],
    [90.4, 'dface', { at: [700, FY, 1], o: () => ({ grin: 1, lean: .6 }), scare: true }],
    [91.2, 'face', 'hot'],
    [92.0, 'fist', { claws: 1, open: (t) => E.io(inv(92.2, 92.9, t)), pry: [92.3, 92.95], look: 'warm' }],
    [93.1, 'dface', { at: [700, FY, 1], o: () => ({ scream: 1, grin: 0 }), fade: [93.1, 94.1], look: 'warm' }],
    [94.1, 'kitchen', { man: (t, L) => figPose(900, FY, 1.1, 1, { hands: [null, L < .5 ? [990, 600 - 120 * E.out(L / .5)] : [960, 640]] }), ex: 'laugh', towel: 94.5,
      sam: (t) => SAM_TABLE({ hands: [[1220, 690], [1180, 600]] }), samEx: 'laugh' }],
    [95.6, 'kitchen', { fr: [1.6, 1380, 560], man: (t) => figPose(1290, FY, 1.1, 1, { hands: [null, [1452 + 18 * Math.sin(t * 7), 520]] }), ex: 'calm',
      sam: (t) => figPose(1420, 760, .74, 1, { hands: [null, [1500, 560 + 14 * Math.sin(t * 8)]] }, true), samEx: 'smile', chair: true, chairX: 1420 }],
    [97.1, 'phone', { screen: 'chat', z: 1.12, chat: { name: 'Mom', items: [{ at: -1, dim: true, text: 'Sam texted me. Is everything ok??', y: 150 }, { at: -1, dim: true, text: 'No. I scared him. I’m getting help.', me: true, y: 290 },
      { at: .1, text: 'Sam says you made dinner ♥', fade: .15, y: 430 }] } }],
    [99.0, 'fridge', { tape: 99.7 }],
    // weeks later
    [100.5, 'card', 'WEEKS LATER'],
    [102.1, 'gym', { move: 'pads', bell: 1.0, bellAt: 1.0, fr: [1.6, 950, 680] }],
    [103.4, 'gym', { move: 'together', fr: [1.75, 940, 600] }],
    [105.2, 'gym', { move: 'door', open: 105.4, fr: [2.2, 1610, 760] }],
    [107.8, 'black'],
    [108.3, 'end', { line: 'EVERY TIME YOU DON’T…', typeAt: 108.4, slam: 'IT STARVES.', slamAt: 109.6 }],
    [111.3, 'title', { at: 111.5 }]
  ]
});
