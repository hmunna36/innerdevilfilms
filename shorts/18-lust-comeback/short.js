'use strict';
// SHORT 18: lust-comeback, one idea: the day he stops feeding it. It has just told him he is its own ("NOW YOU'RE
// MINE."); the music turns at 6:00 AM and he trains through the day (push-ups, the cold shower, the run, pull-ups,
// squats, curls) while it begs and doubts in whispers ("Come back… just once.", "You'll get tired.") and falls behind;
// at 8:00 PM he calls Mom and smiles; at 11:00 PM he sleeps with no phone, and from the window it says "Tomorrow, then."
// Times are the film's (films/03-lust/film.js). The sound is the film's own: the hit under "NOW YOU'RE MINE." and the
// silence after it, then the 6:00 AM boom and the training anthem to the smile (its quiet breath under the shower cut
// short so it never sags), a boom on the jump to 11:00 PM as the anthem fades to the quiet of the sleep, and the
// score's biggest hit under the end card.
defineShort({
  film: 'films/03-lust',
  segments: [
    { from: 53.56, to: 54.78 },    // his red face: NOW YOU'RE MINE.
    { from: 60.6, to: 61.3 },      // 6:00 AM: the music turns
    { from: 61.3, to: 63.7, vf: [[0, 1.15, 1045, 650], [2.4, 1.3, 1065, 650]] },   // push-ups: "Come back… just once."
    { from: 63.7, to: 64.5 },      // his face at dawn, straining
    { from: 64.5, to: 66.5, vf: [[0, .9, 960, 500], [2.0, 1.0, 1000, 470]] },    // the cold shower, its eyes in the steam
    { from: 66.5, to: 67.2 },      // 6:30 AM
    { from: 67.2, to: 68.4, vf: [[0, 1.0, 200, 560], [.5, 1.0, 230, 560], [1.2, 1.0, 760, 560]] },   // the run: it chases, a pan from it to him
    { from: 68.4, to: 69.6 },      // his stride: "You'll get tired."
    { from: 69.6, to: 70.8 },      // him, close
    { from: 70.8, to: 72.0, vf: [[0, 1.0, 820, 560], [1.2, .53, 580, 520]] },    // pull back: it falls behind
    { from: 72.0, to: 72.7 },      // 7:15 AM
    { from: 72.7, to: 74.5, vf: [[0, 1.1, 960, 456], [1.8, 1.3, 960, 440]] },   // pull-ups
    { from: 74.5, to: 76.3, vf: [[0, 1.0, 960, 380], [1.8, 1.15, 960, 400]] },   // squats
    { from: 76.3, to: 77.9, vf: [[0, .85, 950, 290], [1.6, .95, 950, 300]] },    // curls
    { from: 77.9, to: 78.8 },      // his face, the gym
    { from: 78.8, to: 79.5 },      // 8:00 PM
    { from: 79.5, to: 81.5, vf: [[0, 1.15, 960, 540], [2.0, 1.4, 960, 480]] },   // he calls Mom
    { from: 81.5, to: 82.4 },      // his face under the lamp: a smile
    { from: 91.8, to: 92.5 },      // 11:00 PM
    { from: 92.5, to: 94.5, vf: [[0, 1.2, 600, 600], [2.0, 1.4, 595, 580]] }     // asleep, no phone; its eyes in the window: "Tomorrow, then."
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 53.2, to: 53.7, fo: .15 }, { at: 1.22, from: 60.6, to: 63.7, fo: .1 },
      { at: 4.32, from: 65.5, to: 84.2, fi: .05, fo: .1 }, { at: 23.02, from: 89.2, to: 91.92, fo: .3 },
      { at: 25.72, from: 103.9, to: 106.9, fo: 1.2 }],
    hits: [{ at: 23.02, gain: -10 }]
  }
});
