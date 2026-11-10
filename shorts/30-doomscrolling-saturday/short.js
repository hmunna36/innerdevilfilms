'use strict';
// SHORT 30: doomscrolling-saturday, the fishing Saturday he never went to, told through Grandpa: the invite swiped away,
// the photo of the two of them on the dock under "He has plenty of Saturdays.", the calendar's SATURDAY 17 snapped
// through the glass by its grin, "Merry Christmas. Grandpa waited." and "You'll go next year.", the hospital and "He's
// fine. Call tomorrow.", Grandpa calling and his thumb on Decline, his face, its grin, "Haven't seen you in months, kid.",
// the montage flashing every banner back, end card.
// Times are the film's (films/05-doomscrolling/film.js).
const BANNER = [[0, 1.14, 990, 300], [2.2, 1.19, 990, 296]];   // the banner high on his phone, its words centred, a slow push-in
const MONTAGE = (u, t, L) => ([0, 1, 2, 6].includes(Math.floor(L / .375)) ? [1.2, 1007, 62] : null);   // its banners low in the frame, the montage's word in the dark above them; the rest as filmed
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 10.3, to: 11.9, rate: .75, vf: BANNER },     // Grandpa: "Fishing Saturday? Like old times", swiped away
    { from: 12.0, to: 13.8 },                             // his photo, the two of them on the dock: "He has plenty of Saturdays."
    { from: 13.8, to: 15.6, vf: [[0, 1.05, 540, 500], [.95, 1.05, 540, 500], [1.38, 1.05, 1440, 470], [1.8, 1.2, 1460, 420]] },   // the calendar: SATURDAY 17 shivers, its grin snaps it through the glass, the months fly
    { from: 17.5, to: 19.15, rate: .8, vf: BANNER },     // Mom: "Merry Christmas. Grandpa waited."
    { from: 19.25, to: 21.1 },                            // at the foot of the bed: "You'll go next year."
    { from: 27.7, to: 29.35, rate: .8, vf: BANNER },     // Mom: "Grandpa's in the hospital. Call!"
    { from: 29.65, to: 30.95, rate: .7, vf: [[0, .76, 1050, 560], [1.7, .79, 1050, 566]] },   // beside him: "He's fine. Call tomorrow." (both above the words)
    { from: 31.5, to: 33.6, vf: [[0, 1.15, 975, 540], [1.0, 1.28, 975, 600], [1.4, 1.28, 975, 600], [2.1, 1.18, 975, 560]] },   // Grandpa calls; his thumb comes down on Decline
    { from: 33.6, to: 34.5 },                             // his face
    { from: 34.6, to: 35.5 },                             // its grin, beside him
    { from: 37.2, to: 38.75, rate: .75, vf: BANNER },    // Grandpa: "Haven't seen you in months, kid."
    { from: 41.85, to: 42.45 },                           // his face, ashamed
    { from: 45.4, to: 48.4, vf: MONTAGE }                 // the montage: every banner flashes back ("five more minutes…")
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 9.867, to: 23.432, fo: .05 },     // the nights' pulse unbroken, in sync on the calendar's snap (film 15.2)
      { at: 13.565, from: 31.5, to: 34.5, fo: .05 },          // in sync on the call: the click of Decline, then the score drops to its sub (his face)
      { at: 16.565, from: 35.0, to: 38.6, fo: .05 },          // the pulse comes back on its grin
      { at: 20.132, from: 45.4, to: 51.5, fo: 1.0 }],           // in sync from the montage: the dead phone's silence under the end card, then the stinger
    hits: [{ at: 13.565, gain: -10 }, { at: 16.565, gain: -10 }, { at: 20.132, gain: -10 }, { at: 23.132, gain: -8 }]
  }
});
