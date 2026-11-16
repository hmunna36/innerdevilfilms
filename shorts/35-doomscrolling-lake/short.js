'use strict';
// SHORT 35: doomscrolling-lake, one idea: the photo on his nightstand comes true. It opens on Grandpa's banner,
// "Haven't seen you in months, kid.", then the photo itself (a boy and his Grandpa on a dock, holding up a fish) under
// its lie, "He has plenty of Saturdays." (slowed to read); its real voice: "HE DOESN'T HAVE YEARS." and its teeth on the
// photo; the photo stood back up under the lamp; his answer to the old invite ("Is that offer still open?" / "Always.
// 6 AM.", slowed to read); WEEKS LATER, the dock from the photo, Grandpa holds up the fish; the mirror, its claw holds
// out a glowing phone from the dark doorway: "Just scroll.", the blink to his old face, the black, "HOW MANY HOURS DID
// IT EAT?" / "NOT ENOUGH."; end card.
// Times are the film's (films/05-doomscrolling/film.js). The sound is the film's own: the last night's pulse unbroken
// under the banner and the photo, the bite in sync on a boom, the comeback anthem under the photo and the chat on a boom,
// then from WEEKS LATER unbroken and in sync (the calm piano, the detuned tick with the phone, the score's biggest hit on
// "NOT ENOUGH."), and the score's title hit, the one under the film's own title, on the end card.
const BANNER = [[0, 1.26, 958, 290], [1.6, 1.3, 958, 287]];   // Grandpa's banner high on his phone, a slow push-in
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 37.2, to: 38.8, vf: BANNER },   // Grandpa: "Haven't seen you in months, kid."
    { from: 12.0, to: 13.8, rate: .8 },     // the photo: the dock, the fish; "He has plenty of Saturdays."
    { from: 57.3, to: 59.3 },       // "HE DOESN'T HAVE YEARS." and its teeth on the photo
    { from: 84.2, to: 86.2 },       // the photo stood back up under the lamp
    { from: 96.4, to: 98.8, rate: .6, vf: [[0, 1.03, 960, 420], [4.0, 1.07, 960, 420]] },   // "Is that offer still open?" / "Always. 6 AM."
    { from: 102.2, to: 103.2, rate: .7 },   // WEEKS LATER (typed on, held to read)
    { from: 103.2, to: 105.6 },     // the dock from the photo: Grandpa holds up the fish
    { from: 105.6, to: 107.4 },     // the mirror
    { from: 107.4, to: 109.8 },     // its claw holds out a glowing phone: "Just scroll."; the blink to his old face
    { from: 109.8, to: 113.8 }   // the black; "HOW MANY HOURS DID IT EAT?" / "NOT ENOUGH."
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 37.2, to: 41.05, fo: .05 },      // the last night's pulse, unbroken under the banner and the photo
      { at: 3.85, from: 57.3, to: 59.3, fi: .01, fo: .1 },     // in sync: the bite
      { at: 5.85, from: 78.2, to: 84.2, fi: .02, fo: .3 },     // the comeback anthem under the photo and the chat
      { at: 11.85, from: 101.77, to: 113.8, fi: .02, fo: .1 },  // in sync from WEEKS LATER: the piano, the phone, "NOT ENOUGH."
      { at: 23.88, from: 3.3, to: 6.3, fi: .01, fo: 1.0 }],    // the film's own title hit (and its tail into the pulse) under the end card
    hits: [{ at: 3.85, gain: -10 }, { at: 5.85, gain: -12 }, { at: 23.88, gain: -10 }]
  }
});
