'use strict';
// SHORT 29: doomscrolling-hook, the whole escalation of DOOMSCROLLING in about 29 s: the cold line, its grin snaps the
// calendar page through the window glass, DOOMSCROLLING, then four nights with it closer each time and FEED's time chip
// climbing on his phone (2h, 4h, 7h, 11h), the chip racing to the loop, the dead phone and the black glass:
// "YOU WEREN'T KILLING TIME." / "I WAS EATING YOU.", end card.
// Times are the film's (films/05-doomscrolling/film.js).
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 1.6, to: 1.9, rate: .25 },   // the cold line, typed in full from the first frame, held 1.2 s
    { from: 2.05, to: 3.35, vf: [[0, 1.0, 790, 450], [.3, 1.0, 840, 450], [.65, 1.05, 1100, 470], [1.3, 1.45, 1140, 590]] },   // its eyes open in the window; its grin snaps the calendar page through the glass
    { from: 3.35, to: 4.0 },       // DOOMSCROLLING
    { from: 4.0, to: 4.9 },        // night 1: OCTOBER 14, 11:37 PM
    { from: 5.0, to: 6.9 },        // the feed, the chip at 2h ("Five more minutes. It's early.")
    { from: 8.0, to: 9.6 },        // it in the window eats his first hours ("There's always more.")
    { from: 15.6, to: 16.4 },      // night 2: DECEMBER 25, 12:52 AM
    { from: 16.6, to: 17.3, rate: .7, vf: [[0, 1.1, 960, 300], [1, 1.2, 960, 290]] },   // the chip: 4h 51m
    { from: 19.2, to: 21.1 },      // at the foot of the bed ("You'll go next year.")
    { from: 24.6, to: 25.4 },      // night 3: MARCH 3, 2:31 AM
    { from: 27.4, to: 28.4, vf: [[0, 1.2, 960, 300], [1, 1.3, 960, 310]] },   // Mom: Grandpa's in the hospital; the chip: 7h 09m
    { from: 29.6, to: 31.2, rate: .9 },   // beside him ("He's fine. Call tomorrow.")
    { from: 35.8, to: 36.6 },      // night 4: JUNE 15, 4:07 AM
    { from: 36.8, to: 37.8, vf: [[0, 1.2, 960, 300], [1, 1.3, 960, 310]] },   // Grandpa: Haven't seen you in months; the chip: 11h 26m
    { from: 39.0, to: 41.4 },      // behind him, its hands on his shoulders ("You have all the time in the world.")
    { from: 42.5, to: 43.6 },      // its grin, closest
    { from: 48.4, to: 49.4, vf: [[0, 1.3, 960, 330], [1, 1.9, 960, 290]] },   // the chip races to the loop; the phone dies
    { from: 49.4, to: 54.6 }       // the black glass: YOU WEREN'T KILLING TIME. / I WAS EATING YOU.
  ],
  end: { dur: 2.8 },
  audio: {
    pieces: [{ at: 0, from: .85, to: 20.978, fo: .05 },              // the cold open's ticks, the title hit on DOOMSCROLLING, then the nights' pulse unbroken under the jump cuts
      { at: 20.128, from: 48.4, to: 57.0, fo: 1.2 }],              // in sync from the racing chip: the dead phone's silence, the stinger in the black glass, the reveal
    hits: [{ at: 20.128, gain: -10 }, { at: 26.328, gain: -8 }]    // the jump to the dying phone; the end card
  }
});
