'use strict';
// SHORT 33: doomscrolling-comeback, one idea: it ate his hours and told him Grandpa didn't have years, so he took his
// hours back. It opens behind him, its claws in him ("HE DOESN'T HAVE YEARS."), its teeth on Grandpa's photo, his aged
// face turning to resolve, the drawer slammed on its claws. 6:00 AM, the music turns: push-ups while it whispers
// "You're missing everything.", his face, 6:20 AM the run (it chases, "You're wasting your time.", and falls behind),
// 7:05 AM pull-ups, squats, curls, his calm face; 7:50 PM a book under the lamp, Grandpa's photo stood back up, his
// smile; 10:45 PM asleep with no phone, its eyes in the window: "You'll get bored."; end card.
// Times are the film's (films/05-doomscrolling/film.js). The sound is the film's own: the reveal in sync (its stinger,
// the bite, the silence, the drawer's slam), then the anthem from its 6:00 AM impact unbroken to 7:50 PM's smile, a
// boom into 10:45 PM on the anthem as it fades for sleep, and the end card on a boom as the night's piano comes in.
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 57.35, to: 58.4 },      // behind him, its claws in him: HE DOESN'T HAVE YEARS.
    { from: 58.4, to: 59.3 },       // its teeth on Grandpa's photo
    { from: 60.2, to: 60.9 },       // his face, aged, turning to resolve
    { from: 60.9, to: 62.1 },       // the drawer slammed on its claws
    { from: 67.2, to: 67.9 },       // 6:00 AM: the music turns
    { from: 67.9, to: 69.7 },       // push-ups: "You're missing everything."
    { from: 69.7, to: 70.5 },       // his face at dawn
    { from: 70.5, to: 71.1 },       // 6:20 AM
    { from: 71.1, to: 72.25, vf: [[0, 1.25, 230, 700], [.35, 1.2, 240, 700], [1.15, .64, 520, 640]] },   // the run: it chases
    { from: 72.25, to: 73.4 },      // his stride: "You're wasting your time."
    { from: 73.4, to: 74.55 },      // his face, running
    { from: 74.55, to: 75.7, vf: [[0, .64, 520, 640], [1.15, .62, 530, 640]] },   // it falls behind
    { from: 75.7, to: 76.3 },       // 7:05 AM
    { from: 76.3, to: 77.9 },       // pull-ups
    { from: 77.9, to: 79.5 },       // squats
    { from: 79.5, to: 81.1 },       // curls
    { from: 81.1, to: 81.9 },       // his calm face
    { from: 81.9, to: 82.5 },       // 7:50 PM
    { from: 82.5, to: 84.2 },       // a book under the lamp
    { from: 84.2, to: 86.2, vf: [[0, 1.1, 880, 700], [.9, 1.0, 930, 500], [2.0, 1.05, 930, 470]] },   // Grandpa's photo stood back up
    { from: 86.2, to: 87.1 },       // his smile
    { from: 98.8, to: 99.4 },       // 10:45 PM
    { from: 99.4, to: 101.8, vf: [[0, .88, 680, 600], [2.4, .92, 590, 590]] }    // asleep, no phone; its eyes in the window: "You'll get bored."
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 57.35, to: 59.3, fo: .05 },
      { at: 1.95, from: 60.2, to: 62.1, fi: .01, fo: .05 },
      { at: 3.85, from: 67.18, to: 87.08, fi: .005, fo: .04 },
      { at: 23.75, from: 98.8, to: 104.8, fi: .01, fo: 1.2 }],
    hits: [{ at: 23.75, gain: -12 }, { at: 26.75, gain: -8 }]
  }
});
