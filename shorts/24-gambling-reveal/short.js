'use strict';
// SHORT 24: gambling-reveal, one idea: what the house was really playing for. Its last kind whisper behind him ("You
// still have something to bet…"), his face, its grin; the montage ("win it back… win it back…"), the zeros pour down
// the dead phone, the black glass: "I LET YOU WIN." / "I AM THE HOUSE."; it is in the room and every card on the floor
// flips to its grin: "YOU HAVE ONE THING LEFT TO BET."; its claw deals him a card with his own face: "YOU."; his face
// turns from shock to resolve; he snaps his bank card, the cards burn, it screams and is gone; its eyes in the window;
// end card. Times are the film's (films/04-gambling/film.js), in sync from the montage to the window.
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 38.15, to: 40.1 },     // behind him, its claws coming down: "You still have something to bet…" (already typed)
    { from: 40.1, to: 41.1 },      // his face
    { from: 41.1, to: 42.5 },      // its grin behind him
    { from: 44.9, to: 47.9 },      // win it back… win it back… (every banner it cost him, faster and faster)
    { from: 47.9, to: 48.9, vf: [[0, 1.04, 960, 540], [1, 1.12, 960, 545]] },   // the zeros pour down; the phone dies (pushed in to read them)
    { from: 48.9, to: 51.5 },      // the black glass: I LET YOU WIN.
    { from: 51.5, to: 53.9 },      // closer: I AM THE HOUSE.
    { from: 53.9, to: 56.5 },      // it is in the room; the cards flip to its grin: YOU HAVE ONE THING LEFT TO BET.
    { from: 56.5, to: 58.4, vf: [[0, 1.05, 960, 560], [.45, 1.2, 960, 660], [1.9, 1.5, 960, 760]] },   // its claw deals him a card with his own face: YOU. (push in on the card)
    { from: 58.4, to: 60.0 },      // his face: shock, then resolve
    { from: 60.0, to: 61.2, vf: [[0, .9, 960, 560], [1.2, .84, 960, 580]] },   // he snaps his bank card (both hands, both halves)
    { from: 61.2, to: 63.2 },      // the cards burn; it screams
    { from: 63.2, to: 64.8 },      // its face, the scream dying
    { from: 64.8, to: 66.0, vf: [[0, 1.1, 880, 600], [.25, 1.1, 860, 590], [1.2, 1.6, 470, 470]] }   // alone; a pan from him to its eyes opening in the window
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 38.15, to: 42.5, fo: .05 },           // the nights' pulse under the whisper, his face and its grin
      { at: 4.35, from: 44.9, to: 65.2, fo: .3 },                  // in sync from the montage: the dead silence of the zeros, the reveal, the snap, the scream, its aftermath
      { at: 22.3, from: .05, to: 3.19, fi: .4, fo: .005, gain: 6 },   // the cold open's reversed swell and riser, rising under its dying face and its eyes in the window...
      { at: 25.44, from: 3.19, to: 6.3, fi: .005 }],                // ...into the title's hit on the end card, the casino chime over the first pulse under it
    hits: [{ at: 4.35, gain: -10 }, { at: 25.45, gain: -12 }]
  }
});
