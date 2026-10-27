'use strict';
// SHORT 15: lust-hook, the whole escalation of LUST in 31 s: the cold line, its eyes open in the window, LUST, then four
// nights with it closer each time (window, foot of the bed, beside him, behind him with its claws on his shoulders),
// "one more", the phone dies and the black glass shows it: "I WAS NEVER IN THE PHONE.", end card.
// Times are the film's (films/03-lust/film.js). The sound is the film's own score: the nights' pulse runs unbroken under
// the jump cuts, then the montage, the dead silence and the reveal, with booms on the two big jumps.
defineShort({
  film: 'films/03-lust',
  segments: [
    { from: 1.0, to: 2.0 },        // the cold line, already typed
    { from: 2.0, to: 3.4, vf: [[0, 1.8, 430, 400], [1.4, 2.7, 452, 452]] },   // its eyes open in the window: push in on them
    { from: 3.4, to: 4.0 },        // LUST
    { from: 4.0, to: 5.0 },        // night 1: 11:48 PM
    { from: 5.0, to: 6.6 },        // the phone ("Shh… it's okay.")
    { from: 6.6, to: 7.8 },        // his face
    { from: 7.8, to: 9.6 },        // it in the window, closer
    { from: 14.0, to: 14.8 },      // night 2: 12:31 AM
    { from: 16.4, to: 18.2 },      // at the foot of the bed
    { from: 19.2, to: 20.8 },      // its face
    { from: 22.0, to: 22.8 },      // night 3: 1:47 AM
    { from: 24.4, to: 26.2 },      // beside him, bending closer
    { from: 27.2, to: 28.8 },      // its grin
    { from: 30.0, to: 30.8 },      // night 4: 3:05 AM
    { from: 32.4, to: 35.0 },      // behind him, its hands on his shoulders
    { from: 36.0, to: 37.4 },      // its grin, closest
    { from: 40.0, to: 43.0 },      // one more, one more
    { from: 43.0, to: 46.5 }       // the phone dies; the black glass: I WAS NEVER IN THE PHONE.
  ],
  end: { dur: 2.8 },
  audio: {
    pieces: [{ at: 0, from: 1.0, to: 22.8 }, { at: 21.8, from: 40.0, to: 49.3, fo: 1.4 }],
    hits: [{ at: 21.8, gain: -10 }, { at: 28.3, gain: -8 }]
  }
});
