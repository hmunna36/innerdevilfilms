'use strict';
// SHORT 31: doomscrolling-reveal, one idea: its kind lies, then the truth. Behind him, its claws coming down: "You have
// all the time in the world."; Grandpa's photo: "He has plenty of Saturdays."; the chip races to the
// loop and the phone dies; the black glass: "YOU WEREN'T KILLING TIME." / "I WAS EATING YOU." while his reflection grows
// old; "LOOK WHAT'S LEFT OF YOU."; it rips out of his chest, its teeth on Grandpa's photo: "HE DOESN'T HAVE YEARS.";
// his face; the drawer slammed on its claws, the hours streaming back into him, its scream; its eyes fade in the window;
// end card. Times are the film's (films/05-doomscrolling/film.js), in sync from the dying phone to the window.
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 39.62, to: 41.2, rate: .79, vf: [[0, .72, 900, 530], [2, .75, 900, 520]] },   // behind him, its claws coming down: "You have all the time in the world." (typed in full from the first frame; both above the words)
    { from: 12.1, to: 13.8, rate: .8 },   // Grandpa's photo, the two of them on the dock: "He has plenty of Saturdays."
    { from: 48.4, to: 49.4, vf: [[0, 1.15, 960, 420], [1, 1.6, 960, 300]] },   // the chip races to the loop; the phone dies (pushed in on the chip)
    { from: 49.4, to: 52.0 },             // the black glass: YOU WEREN'T KILLING TIME.
    { from: 52.0, to: 54.6 },             // I WAS EATING YOU. (his reflection grows old)
    { from: 54.6, to: 57.0 },             // LOOK WHAT'S LEFT OF YOU.
    { from: 57.0, to: 58.4 },             // it rips out of his chest: HE DOESN'T HAVE YEARS.
    { from: 58.4, to: 59.3 },             // its teeth on Grandpa's photo
    { from: 59.3, to: 60.9 },             // his face: fear, then resolve
    { from: 60.9, to: 62.1 },             // the drawer slammed on its claws
    { from: 62.1, to: 64.1 },             // the hours stream back into him; it screams
    { from: 64.1, to: 65.6 },             // its face, the scream dying
    { from: 65.6, to: 67.1, vf: [[0, 1.0, 900, 560], [.3, 1.0, 880, 560], [1.4, 1.7, 430, 400]] }   // alone; a pan from him to its eyes fading in the window
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 39.5, to: 43.625, fo: .05 },        // the last night's pulse under the lie and the photo
      { at: 4.125, from: 48.4, to: 67.1, fo: .4 },                // in sync from the dying phone: the reveal, the photo eaten, the slam, the scream, its eyes
      { at: 19.525, from: .05, to: 3.35, fi: .4, fo: .005, gain: 6 },   // the cold open's ticking riser under its dying face and its eyes in the window...
      { at: 22.825, from: 3.35, to: 6.3, fi: .005 }],             // ...into the title's hit on the end card
    hits: [{ at: 4.125, gain: -10 }, { at: 22.825, gain: -12 }]
  }
});
