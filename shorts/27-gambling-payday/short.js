'use strict';
// SHORT 27: gambling-payday, one idea: on payday it comes back with the very words of the first night, and this time he
// remembers what they cost. It opens on the banner on his clean home screen ("HOUSE: Payday! Your table is waiting."),
// the jump scare ("Just one bet. For fun…") and his face in its red light; a flash of the first night (11:52 PM, the same
// words on HOUSE, his hungry face) and what they cost (its claw takes Grandma's chain, "Sis: I had to drop out. It's
// okay", it behind him: "You still have something to bet…"); back to tonight: he deletes HOUSE, it shrieks, Sis writes
// back "I'm back in!!" and a heart (the chat slowed to read), 11:00 PM asleep with no phone and its eyes in the window:
// "You'll be back."; end card.
// Times are the film's (films/04-gambling/film.js). The sound is the film's own: the banner and the attack's dead
// silence with the scare, the horror score of the nights unbroken under the flash, a boom into it and out of it, the
// anthem back on the delete and the shriek, its strongest bars under Sis's chat fading as he sleeps, then the calm piano
// under the end card with a boom.
const BANNER = [[0, 1.28, 945, 292], [1.8, 1.33, 945, 288]];   // the banner at the top of his phone, a slow push-in
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 89.05, to: 90.6, vf: BANNER },   // 9:45 PM, his clean home screen: HOUSE: Payday! Your table is waiting.
    { from: 90.6, to: 92.3 },      // the jump scare: "Just one bet. For fun…", his face in its red light
    { from: 3.8, to: 4.6 },        // the flash: the first night, 11:52 PM
    { from: 4.6, to: 6.8 },        // the same words on HOUSE: "Just one bet. For fun."
    { from: 6.8, to: 7.8 },        // his hungry face
    { from: 24.6, to: 26.3 },      // its claw takes Grandma's chain: "Mom won't miss it."
    { from: 35.55, to: 37.3, vf: [[0, 1.28, 945, 255], [1.75, 1.33, 945, 252]] },   // Sis: I had to drop out. It's okay
    { from: 37.5, to: 39.8 },      // it behind him: "You still have something to bet…"
    { from: 92.3, to: 94.5, vf: [[0, 1.3, 960, 560], [2.2, 1.45, 960, 560]] },   // back to tonight: he deletes HOUSE
    { from: 94.5, to: 95.7 },      // it shrieks
    { from: 95.7, to: 98.1, rate: .6, vf: [[0, 1.02, 960, 400], [4, 1.06, 960, 400]] },   // Sis: "I'm back in!!" and a heart (slowed to read)
    { from: 98.1, to: 98.7 },      // 11:00 PM
    { from: 98.7, to: 101.1, vf: [[0, 1.0, 700, 560], [.8, 1.1, 640, 560], [1.4, 1.2, 600, 575], [2.4, 1.28, 590, 590]] }   // asleep, no phone; its eyes in the window: "You'll be back."
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 89.05, to: 92.3, fo: .05 }, { at: 3.25, from: 27.8, to: 37.55, fi: .01, fo: .08 },
      { at: 13.0, from: 92.3, to: 95.75, fi: .01, fo: .08 }, { at: 16.4, from: 83.0, to: 89.0, fi: .06, fo: 1.2 },
      { at: 22.4, from: 100.4, to: 104.4, fi: .3, fo: 1.0 }],
    hits: [{ at: 3.25, gain: -10 }, { at: 13.0, gain: -10 }, { at: 23.4, gain: -9 }]
  }
});
