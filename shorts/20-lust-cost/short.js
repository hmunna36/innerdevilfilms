'use strict';
// SHORT 20: lust-cost, one idea: what it took, one person at a time. It opens on the last of them (Maya: "I waited an
// hour. Guess you're busy."), then goes back to the first night and lives the four nights on his phone: Mom's "Call me
// when you can", three missed calls from Mom, the work's final warning, Maya; each banner swiped away while the devil
// whispers over it, and after each one his face, a notch emptier (glazed, tired, empty, ashamed). On the last night its
// claws settle on his shoulders; then everything it took comes back at once, faster and faster, until the phone dies.
// Times are the film's (films/03-lust/film.js). Banners are framed close (z 1.3, about 38 px letters) and slowed so
// each reads for 1.4 s; the montage frames its banners the same way and its faces as the film does.
// The sound is the film's own score in this Short's own order: the nights' loudest bars under the hook, a boom on the
// jump back, then the nights' pulse building night by night to the claws; a boom into the montage on its own bars,
// the dead phone's silence, and the film's title blast with a boom under the end card.
const BANNER = [[0, 1.28, 972, 240], [2.4, 1.36, 972, 236]];   // the banner at the top of his phone, a slow push-in
const MONTAGE = (u, t, L) => (Math.floor(L / .375) < 3 ? [1.32, 972, 240] : null);   // its three banners close; the rest as filmed
defineShort({
  film: 'films/03-lust',
  segments: [
    { from: 31.3, to: 31.88, rate: .45, vf: [[0, 1.3, 972, 240], [1.29, 1.36, 972, 236]] },   // the hook: Maya
    // night 1
    { from: 4.05, to: 4.95 },             // 11:48 PM
    { from: 9.75, to: 10.92, rate: .5, vf: BANNER },   // Mom: "Call me when you can", swiped ("You worked hard today. You deserve this.")
    { from: 6.6, to: 7.8, rate: .75 },     // his face, glazed ("Shh… it's okay. Everyone does it.")
    // night 2
    { from: 14.05, to: 14.8 },            // 12:31 AM
    { from: 14.95, to: 16.12, rate: .5, vf: BANNER },  // 3 missed calls from Mom, swiped ("She'll call again. Stay with me.")
    { from: 18.2, to: 19.2, rate: .75 },   // his face, tired
    // night 3
    { from: 22.05, to: 22.8 },            // 1:47 AM
    { from: 22.95, to: 24.12, rate: .5, vf: BANNER },  // Work, final warning, swiped ("Who needs them? You have me.")
    { from: 26.2, to: 27.2, rate: .75 },   // his face, empty
    // night 4
    { from: 30.05, to: 30.8 },            // 3:05 AM
    { from: 31.82, to: 32.12, rate: .6, vf: [1.36, 972, 236] },   // Maya's banner, swiped away
    { from: 32.4, to: 35.0 },             // its hands settle on his shoulders ("She'd never understand you… not like I do.")
    { from: 35.0, to: 36.0, rate: .75 },   // his face, ashamed
    { from: 40.0, to: 43.0, vf: MONTAGE },   // everything it took, faster and faster: one more, one more
    { from: 43.0, to: 43.75 }              // the phone dies
  ],
  end: { dur: 3.4 },
  audio: {
    pieces: [{ at: 0, from: 41.6, to: 42.889, fo: .05 },          // the hook on the nights' loudest bars
      { at: 1.289, from: 17.0, to: 35.87, fi: .02 },               // back to night 1: the nights' pulse, building to its claws
      { at: 20.159, from: 40.0, to: 43.75 },                       // the montage on its own bars, then the dead phone's silence
      { at: 23.859, from: 3.2, to: 6.9, fo: 1.2 }],                // the film's title blast under the end card
    hits: [{ at: 1.289, gain: -12 }, { at: 20.159, gain: -12 }, { at: 23.909, gain: -9 }]
  }
});
