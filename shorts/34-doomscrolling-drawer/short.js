'use strict';
// SHORT 34: doomscrolling-drawer, one idea: he locked it in a drawer, and it came back out with the same lie. It opens on
// months of "five more minutes" (the film's montage, slowed: Grandpa's invite, Christmas, the hospital, 4:39 AM, its grin,
// "Haven't seen you in months, kid."), then the film's silence and the slam: he throws the phone in the drawer and shuts
// it on its claws, it screams behind him, its face shrinks away. 9:40 PM: the shut drawer buzzes and slides open by
// itself, its fingers curl over the edge (slowed), "FEED: You missed 99+ new posts", its face lunges: "Five more
// minutes…", his face, he deletes FEED, it shrieks, and he answers Grandpa's old invite: "Is that offer still open?" /
// "Always. 6 AM." (the chat slowed to read); end card.
// Times are the film's (films/05-doomscrolling/film.js). The sound is the film's own: the nights' pulse peaking under the
// montage and cut dead, the film's silence before the slam in sync, then from 9:40 PM unbroken and in sync (the buzz, the
// scare and its dead air, the anthem slamming back on the delete, under the chat), a boom into 9:40 PM and one on the end
// card over the anthem's big bars.
const MONTAGE = (u, t, L) => ([0, 1, 2, 6].includes(Math.floor(L / .375)) ? [1.2, 1007, 62] : null);
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 45.4, to: 48.4, rate: .5, vf: MONTAGE },   // months of "five more minutes": everything it ate
    { from: 60.9, to: 62.1 },       // he throws the phone in the drawer and slams it on its claws
    { from: 62.1, to: 64.1 },       // it screams; the hours stream back
    { from: 64.1, to: 65.0 },       // its face, screaming as it shrinks away
    { from: 87.1, to: 87.8 },       // 9:40 PM
    { from: 87.8, to: 89.0, vf: [[0, 1.12, 900, 560], [.9, 1.16, 900, 560], [1.2, 1.25, 900, 565]] },   // the shut drawer buzzes and slides open by itself
    { from: 89.0, to: 89.4, rate: .5, vf: [[0, 1.25, 900, 565], [.8, 1.42, 900, 570]] },   // ...its fingers curl over the edge (slowed)
    { from: 89.8, to: 91.3, vf: [[0, 1.1, 960, 390], [1.5, 1.14, 960, 382]] },   // FEED: You missed 99+ new posts (the picture back in sync with the sound)
    { from: 91.3, to: 92.1 },       // the jump scare: "Five more minutes…"
    { from: 92.1, to: 93.0 },       // his face
    { from: 93.0, to: 95.2, vf: [[0, 1.25, 960, 560], [2.2, 1.38, 960, 560]] },       // he deletes FEED
    { from: 95.2, to: 96.4 },       // it shrieks
    { from: 96.4, to: 98.8, rate: .5, vf: [[0, 1.0, 960, 400], [4.8, 1.05, 960, 400]] }   // "Is that offer still open?" / "Always. 6 AM."
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 42.4, to: 48.4, fo: .05 },       // the nights' pulse, peaking with the montage, cut dead as the phone dies
      { at: 6.0, from: 60.9, to: 65.0, fi: .01, fo: .2 },     // in sync: the film's silence, the drawer's slam, its scream, its face fading
      { at: 10.1, from: 87.1, to: 101.2, fi: .01, fo: .3 },   // in sync from 9:40 PM: the buzz, the scare's dead air, the anthem back on the delete, under the chat
      { at: 24.2, from: 82.0, to: 85.0, fi: .05, fo: 1.0 }],  // the anthem's big bars under the end card
    hits: [{ at: 10.1, gain: -10 }, { at: 24.2, gain: -8 }]
  }
});
