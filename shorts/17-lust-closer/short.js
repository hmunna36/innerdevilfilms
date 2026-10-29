'use strict';
// SHORT 17: lust-closer, one idea: watch where it stands. Four nights of LUST, and each night it is nearer: the window,
// the foot of the bed, beside him, behind him with its claws on his shoulders. Each night is framed as a two-shot, him
// and it in one picture, so the distance between them is the story; its kind whispers are the only words, his face
// empties night by night, and the clocks count the nights.
// Times are the film's (films/03-lust/film.js). The sound is the film's own nights pulse, one unbroken piece that climbs
// to the top of the score as it closes in, then the reveal's stinger under the end card.
defineShort({
  film: 'films/03-lust',
  segments: [
    // night 1: it watches from the window
    { from: 8.32, to: 9.6, vf: [[0, .66, 720, 530], [1.28, .72, 718, 500]] },   // him and its eyes in the window: "You worked hard today. You deserve this."
    { from: 11.2, to: 12.6 },      // him, close: "Just one more. Then sleep."
    { from: 12.6, to: 14.0, vf: [[0, 1.25, 560, 500], [1.2, 2.4, 445, 456]] },   // the lights go out: a push to its eyes in the window
    // night 2: at the foot of the bed
    { from: 14.1, to: 14.8 },      // 12:31 AM
    { from: 16.4, to: 18.2, vf: [[0, .62, 1230, 500], [1.8, .7, 1225, 480]] },   // him and it at the foot of the bed: "She'll call again. Stay with me."
    { from: 18.2, to: 19.2 },      // his face, tired
    { from: 19.2, to: 22.0 },      // its face: "See? You feel better already.", then him
    // night 3: beside him
    { from: 22.1, to: 22.8 },      // 1:47 AM
    { from: 24.4, to: 26.2 },      // beside him, bending closer: "Who needs them? You have me."
    { from: 26.2, to: 27.2 },      // his face, empty
    { from: 27.2, to: 30.0 },      // its grin: "I'll never leave you.", then beside him
    // night 4: behind him
    { from: 30.1, to: 30.8 },      // 3:05 AM
    { from: 32.4, to: 36.0 },      // its hands settle on his shoulders: "She'd never understand you… not like I do."; his face, ashamed
    { from: 36.0, to: 37.4 },      // its grin, closest
    { from: 37.4, to: 40.0 }       // its claws around him
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 18.02, to: 43.0 }, { at: 24.98, from: 48.6, to: 51.6, fo: 1.2 }],
    hits: [{ at: 24.98, gain: -8 }]
  }
});
