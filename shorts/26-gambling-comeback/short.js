'use strict';
// SHORT 26: gambling-comeback, one idea: it told him he had one thing left to bet, and he bet on himself. It opens on
// its real voice in his room ("YOU HAVE ONE THING LEFT TO BET."), its claw holds out the card with his own face
// ("YOU."), and he snaps his bank card in half. 6:00 AM, the music turns: push-ups while it whispers "Come back. I'll let
// you win.", his face, 6:30 AM the run (it chases, "You can't outrun the odds.", and falls behind), then the double
// shift that pays it back: 8:00 AM boxes under the DOUBLE SHIFT board, 2:00 PM the second shift, his face, 8:30 PM the
// gym (pull-ups, squats, curls) and his calm face; end card.
// Times are the film's (films/04-gambling/film.js). The sound is the film's own: the reveal under its line and the card,
// the silence and the snap, then the anthem from its 6:00 AM impact unbroken to the end card, with a boom on it.
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 54.6, to: 56.4 },      // its real voice in his room: YOU HAVE ONE THING LEFT TO BET.
    { from: 57.2, to: 58.5 },      // its claw holds out the card with his face: YOU.
    { from: 60.0, to: 61.2 },      // he snaps his bank card in half
    { from: 66.2, to: 66.9 },      // 6:00 AM: the music turns
    { from: 66.9, to: 68.7 },      // push-ups: "Come back. I'll let you win."
    { from: 68.7, to: 69.5 },      // his face at dawn
    { from: 69.5, to: 70.1 },      // 6:30 AM
    { from: 70.1, to: 71.3, vf: [[0, 1.3, 200, 600], [.35, 1.25, 215, 600], [1.2, .64, 520, 610]] },      // the run: it chases
    { from: 71.3, to: 72.5 },      // his stride: "You can't outrun the odds."
    { from: 73.7, to: 74.9, vf: [[0, .62, 520, 610], [1.2, .6, 530, 610]] },      // it falls behind
    { from: 74.9, to: 75.5 },      // 8:00 AM
    { from: 75.5, to: 77.2, vf: [[0, .7, 1010, 440], [1.7, .74, 1010, 440]] },      // shift 1: boxes under the DOUBLE SHIFT board
    { from: 77.2, to: 78.8 },      // onto the top shelf
    { from: 78.8, to: 79.4 },      // 2:00 PM
    { from: 79.4, to: 81.0, vf: [[0, .7, 940, 440], [1.6, .74, 940, 440]] },      // shift 2
    { from: 81.0, to: 81.8 },      // his face, the warehouse
    { from: 81.8, to: 82.4 },      // 8:30 PM
    { from: 82.4, to: 84.0 },      // pull-ups
    { from: 84.0, to: 85.6 },      // squats
    { from: 85.6, to: 87.2 },      // curls
    { from: 87.2, to: 88.1 }       // his calm face
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 54.6, to: 56.4, fo: .05 }, { at: 1.8, from: 57.2, to: 58.5, fo: .05 },
      { at: 3.1, from: 60.0, to: 61.2, fo: .08 }, { at: 4.3, from: 66.2, to: 90.3, fi: .005 }],
    hits: [{ at: 1.8, gain: -11 }, { at: 25.0, gain: -8 }]
  }
});
