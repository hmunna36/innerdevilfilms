'use strict';
// SHORT 28: gambling-coin, one idea: Grandma's gold chain, there and back. It opens on Mom's banner ("Have you seen
// Grandma's chain?"), cuts back to 2:16 AM when its claw took the chain out of his hand ("Mom won't miss it.") and it sat
// beside him ("You'll win it back by morning."); his face in the red light, he snaps his bank card, the double shift
// (the board ticks SHIFT 2) and his tired face: he earns it back. WEEKS LATER: Mom's chat, the photo of the chain he
// bought back ("Got it back. I'm so sorry." and a heart, slowed to read), the mirror with the snapped card in its frame,
// its eyes in the dark doorway and the gold coin it flips: "DOUBLE OR NOTHING?", then "WHO DO YOU THINK IS DEALING?"
// "STILL ME."; end card.
// Times are the film's (films/04-gambling/film.js). The sound is the film's own: the horror score of the nights unbroken
// under the banner and the flashback, the dead silence before the snap and the snap itself, the anthem under the shift,
// a boom on each jump, then the ending as the film has it (the calm piano, the detuned chime and the coin, the hit on
// "STILL ME.", the title's boom under the end card).
const BANNER = [[0, 1.28, 945, 292], [1.45, 1.33, 945, 288]];   // Mom's banner at the top of his phone, a slow push-in
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 30.75, to: 32.2, vf: BANNER },   // Mom: Have you seen Grandma's chain?
    { from: 23.8, to: 24.6 },                // 2:16 AM (that night)
    { from: 24.6, to: 26.3 },                // its claw takes the chain out of his hand: "Mom won't miss it."
    { from: 28.6, to: 30.4 },                // it beside him: "You'll win it back by morning."
    { from: 59.2, to: 60.0 },                 // his face in its red light
    { from: 60.0, to: 61.2 },                // he snaps his bank card
    { from: 78.8, to: 79.4 },                // 2:00 PM
    { from: 79.4, to: 81.0, vf: [[0, .78, 820, 480], [1.6, 1.0, 960, 380]] },   // the double shift: from him to the board, SHIFT 2 ticked
    { from: 81.0, to: 81.8 },                // his tired face under the work light
    { from: 101.65, to: 102.5, rate: .4 },   // WEEKS LATER (slowed: typed on, held to read)
    { from: 102.5, to: 104.9, rate: .75, vf: [[0, .9, 988, 400], [3.2, .94, 988, 405]] },   // Mom's chat: the chain, "Got it back. I'm so sorry." and a heart
    { from: 104.9, to: 106.7, vf: [[0, .7, 800, 520], [1.8, .74, 795, 515]] },   // the mirror, the snapped card in its frame
    { from: 106.7, to: 109.1 },              // its eyes in the doorway, the coin: "DOUBLE OR NOTHING?"
    { from: 109.1, to: 113.1 }               // WHO DO YOU THINK IS DEALING? STILL ME.
  ],
  end: { dur: 3.4 },
  audio: {
    pieces: [{ at: 0, from: 24.0, to: 29.75, fo: .05 }, { at: 5.75, from: 59.2, to: 61.2, fi: .01, fo: .08 },
      { at: 7.75, from: 78.8, to: 81.8, fi: .01, fo: .1 }, { at: 10.75, from: 100.6, to: 105.925, fi: .01, fo: .3, gain: 6 },
      { at: 16.075, from: 104.9, to: 116.5, fi: .3 },
      { at: 24.375, from: 41.1, to: 44.6, fi: .6, gain: -4 }],
    hits: [{ at: 1.45, gain: -10 }, { at: 5.75, gain: -10 }, { at: 7.75, gain: -9 }, { at: 10.75, gain: -10 }]
  }
});
