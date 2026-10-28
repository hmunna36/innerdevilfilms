'use strict';
// SHORT 16: lust-reveal, the moment LUST's devil drops its kind voice. Two whispers first ("I'll never leave you.", its
// hands on his shoulders: "She'd never understand you… not like I do."), then the phone dies and the black glass shows
// it behind him: "I WAS NEVER IN THE PHONE." / "I WAS ALWAYS… IN YOU.", it steps into the room, "EVERY NIGHT… YOU FED
// ME.", his face, "NOW YOU'RE MINE.", he smashes the phone against the wall, it screams and fades, end card.
// Times are the film's (films/03-lust/film.js). The sound is the film's own score: the nights' pulse under the whispers,
// a boom on the jump to the dying phone, then the reveal unbroken from the dead silence to the scream.
defineShort({
  film: 'films/03-lust',
  segments: [
    { from: 28.0, to: 29.3 },      // its grin, beside him: "I'll never leave you."
    { from: 32.6, to: 36.0 },      // behind him, its hands on his shoulders: "She'd never understand you…"; his face
    { from: 37.4, to: 39.0 },      // its claws around him, close
    { from: 43.2, to: 43.8 },      // the phone dies
    { from: 43.8, to: 46.4 },      // the black glass: I WAS NEVER IN THE PHONE.
    { from: 46.4, to: 48.6 },      // I WAS ALWAYS… IN YOU.
    { from: 48.6, to: 51.0 },      // it steps into the room
    { from: 51.0, to: 53.0 },      // EVERY NIGHT… YOU FED ME.
    { from: 53.0, to: 54.6 },      // his face: NOW YOU'RE MINE.
    { from: 54.6, to: 57.4, vf: [[0, 1.1, 880, 520], [.25, 1.1, 900, 520], [.5, 1.25, 1480, 450], [.9, 1.25, 1500, 460],
      [1.25, 1.15, 840, 380], [2.8, 1.3, 800, 330]] },   // he throws the phone: a whip pan to the wall as it smashes, back to its scream
    { from: 57.4, to: 59.2 },      // it fades, still screaming
    { from: 59.2, to: 60.5, vf: [[0, 1.2, 900, 600], [.3, 1.2, 880, 590], [.95, 1.7, 470, 450]] }   // the dark room: him, then a push to its eyes in the window
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 28.0, to: 34.3, fo: .15 }, { at: 6.3, from: 43.2, to: 60.5 }, { at: 23.6, from: 104.6, to: 107.6, fo: 1.2 }],
    hits: [{ at: 6.3, gain: -10 }, { at: 23.6, gain: -12 }]
  }
});
