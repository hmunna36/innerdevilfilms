'use strict';
// SHORT 32: doomscrolling-hours, one idea: what it eats, night by night. The few clock faces drifting out of his phone
// into its grin in the window ("There's always more."), his face; DECEMBER 25: a stream, a calendar page torn into its
// mouth, his face a notch older, its face ("Nobody's counting."); MARCH 3: its claw spins his wall clock, the stream
// beside him, his face greyer, its grin; JUNE 15: a torrent from behind him ("You have all the time in the world."), his
// face lined, its grin, the torrent; then the hours stream back into him; end card.
// Times are the film's (films/05-doomscrolling/film.js).
defineShort({
  film: 'films/05-doomscrolling',
  segments: [
    { from: 8.55, to: 9.4, rate: .6, vf: [[0, 1.0, 600, 470], [1.4, 1.2, 500, 420]] },   // night 1: in the window, a few clock faces drift out of his phone into its grin: "There's always more."
    { from: 7.35, to: 8.0, rate: .7 },      // his face, young, in the feed's light
    { from: 15.6, to: 16.6, rate: .8 },     // DECEMBER 25, 12:52 AM
    { from: 19.6, to: 21.1 },   // at the foot of the bed: a stream, a calendar page torn into its mouth ("You'll go next year.")
    { from: 21.1, to: 22.0, rate: .8 },     // his face, a notch older
    { from: 22.0, to: 23.5, rate: .8 },     // its face: "Nobody's counting."
    { from: 23.5, to: 24.6, vf: [[0, .85, 1110, 520], [1.1, .92, 1140, 480]] },   // the stream rising past him
    { from: 24.6, to: 25.6, rate: .8 },     // MARCH 3, 2:31 AM
    { from: 25.6, to: 27.4 },               // its claw spins his wall clock
    { from: 33.6, to: 34.6, rate: .8 },     // his face, greying
    { from: 34.6, to: 35.8 },               // its grin, beside him
    { from: 35.8, to: 36.8, rate: .8 },     // JUNE 15, 4:07 AM
    { from: 39.0, to: 41.5 },               // behind him: a torrent ("You have all the time in the world.")
    { from: 41.7, to: 42.5, rate: .8 },     // his face, lined
    { from: 42.5, to: 43.7 },               // its grin, closest
    { from: 43.7, to: 45.4 },               // the torrent
    { from: 62.1, to: 64.1 }                // the hours stream back into him; it screams
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 23.5, to: 32.695, fo: .05 },          // the nights' pulse under the jump cuts...
      { at: 9.195, from: 35.0, to: 48.15, fi: .01, fo: .05 },     // ...on past the film's quiet drop (32.7-35.0) from MARCH 3, peaking under the torrent
      { at: 22.345, from: 62.1, to: 64.1, fi: .005, fo: .08 },   // in sync: the hours stream back into him, its scream
      { at: 24.345, from: 67.17, to: 70.345, fi: .005 }],        // the end card on the anthem's opening impact (6:00 AM in the film)
    hits: [{ at: 9.195, gain: -14 }, { at: 22.345, gain: -10 }, { at: 24.345, gain: -14 }]
  }
});
