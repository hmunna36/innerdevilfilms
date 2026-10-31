'use strict';
// SHORT 19: lust-jumpscare, one idea: it comes back for him, and it will always come back. Its grin and a whisper first
// ("Just one look…"), then the night it happens: his smile under the lamp, 9:30 PM, the banner on his clean home screen,
// a flash of the nights he fed it, the jump scare, his face in its red light, he deletes the app, it shrieks; Maya
// writes back "Saturday :)" (the chat slowed so every message can be read); 11:00 PM, asleep with no phone. Weeks later
// he is fine in the mirror, and in the dark doorway behind him its eyes open: "I'LL WAIT."; the film's last line comes
// back: "YOU THINK YOU'RE ALONE WHEN YOU WATCH IT… YOU'RE NOT." (This Short also takes the ending once planned as
// Short 21: each alone was too thin.)
// Times are the film's (films/03-lust/film.js). The sound is the film's own: the scare under the first frame; the
// training anthem in its own order around the attack (his smile to the banner, the dead silence of the attack, the
// anthem back on the delete, the shriek, its strongest bars under Maya, its last chord over 11:00 PM); the calm piano of
// weeks later with its dead air cut out, the detuned lullaby under its eyes, the silence of the last line and the
// score's biggest hit on "YOU'RE NOT.", and the same hit again under the end card.
defineShort({
  film: 'films/03-lust',
  segments: [
    { from: 84.7, to: 85.6 },      // its grin, close: "Just one look…" (the hook)
    { from: 81.5, to: 82.4 },      // his face under the lamp: a smile
    { from: 82.45, to: 83.1 },     // 9:30 PM
    { from: 83.1, to: 84.3, vf: [[0, 1.3, 935, 380], [1.2, 1.5, 925, 330]] },    // his home screen: XXX, New videos for you
    { from: 37.45, to: 38.25 },    // a flash of the nights he fed it: it behind him, its claws on his shoulders
    { from: 83.8, to: 84.3, vf: [[0, 1.8, 905, 230], [.5, 1.9, 900, 222]] },     // the banner, closer
    { from: 84.3, to: 85.1 },      // the jump scare
    { from: 85.1, to: 86.0 },      // his face in its red light
    { from: 86.0, to: 88.2, vf: [[0, 1.4, 955, 525], [2.2, 1.55, 950, 540]] },    // he deletes the app
    { from: 88.2, to: 89.4 },      // it shrieks and fades
    { from: 89.4, to: 91.8, rate: .6, vf: [1.03, 987, 450] },                     // Maya: "Saturday :)" and a heart (slowed to read)
    { from: 91.85, to: 92.5 },     // 11:00 PM
    { from: 92.5, to: 93.1, vf: [[0, 1.35, 770, 690], [.6, 1.45, 765, 690]] },   // asleep, no phone
    { from: 95.6, to: 96.9 },      // WEEKS LATER
    { from: 96.9, to: 98.3, vf: [[0, 1.05, 930, 560], [1.4, 1.22, 917, 560]] },   // he's fine, in the mirror
    { from: 99.0, to: 100.0, vf: [[0, .86, 1040, 520], [1.0, .89, 1044, 516]] },  // the dark doorway behind him
    { from: 100.0, to: 101.7, vf: [[0, .9, 1045, 515], [1.7, 1.4, 1230, 450]] },  // its eyes open: "I'LL WAIT."
    { from: 101.7, to: 102.1 },    // black
    { from: 102.35, to: 105.45 }   // YOU THINK YOU'RE ALONE WHEN YOU WATCH IT… YOU'RE NOT.
  ],
  end: { dur: 3.5 },
  audio: {
    pieces: [{ at: 0, from: 84.35, to: 85.25, fo: .1 }, { at: .9, from: 76.25, to: 80.3, fi: .05 },
      { at: 4.95, from: 84.3, to: 89.4, fo: .08 }, { at: 10.05, from: 80.3, to: 84.3, fi: .03 },
      { at: 14.05, from: 89.75, to: 91.0, fi: .05, fo: .3 }, { at: 15.3, from: 95.6, to: 96.9, fi: .1, fo: .2 },
      { at: 16.6, from: 97.6, to: 102.1 }, { at: 21.1, from: 102.35, to: 105.45 }, { at: 24.2, from: 103.85, to: 107.35, fo: 1.2 }],
    hits: [{ at: 3.65, gain: -12 }]
  }
});
