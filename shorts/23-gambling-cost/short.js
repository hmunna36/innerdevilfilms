'use strict';
// SHORT 23: gambling-cost, one idea: what it took, one person at a time, opened and closed by his sister. Her first
// message ("Did you send my college fees?") and the devil's answer ("Win a little more. Then send it."); 12:47 AM, the
// landlord ("Pay today or you're out.") and its answer from the foot of the bed ("He can wait. You're due for a win.",
// "Double it. Then stop."); its claw takes Grandma's chain ("Mom won't miss it."), DOUBLE OR NOTHING, HOUSE WINS,
// $0.00; Mom ("Have you seen Grandma's chain?"), his face, its grin beside him; 3:58 AM, his sister's last message
// ("I had to drop out. It's okay"), his empty face, its grin behind him, end card.
// Times are the film's (films/04-gambling/film.js). Banners are framed close (z 1.28-1.33, about 45 px letters) and
// slowed so each reads for 2.3-2.8 s; the table is framed so its balance and buttons sit in x 100-870.
// The sound: the nights' pulse (film 18.5-44.45) unbroken under every cut, a low boom under her last message, and the
// film's last hit ("STILL ME.") with a boom on the end card.
const BANNER = [[0, 1.28, 958, 292], [2.8, 1.33, 958, 288]];   // the banner at the top of his phone, a slow push-in
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 10.05, to: 11.45, rate: .6, vf: BANNER },   // Sis: "Did you send my college fees?"
    { from: 11.9, to: 13.4, rate: .65 },                // "Win a little more. Then send it."
    { from: 15.0, to: 15.8 },                           // 12:47 AM
    { from: 16.75, to: 18.2, rate: .6, vf: BANNER },    // Landlord: "Pay today or you're out."
    { from: 18.4, to: 20.2 },                           // at the foot of the bed: "He can wait. You're due for a win."
    { from: 21.2, to: 22.6, rate: .7 },                 // its face: "Double it. Then stop."
    { from: 24.6, to: 26.2, rate: .75 },                // its claw takes Grandma's chain ("Mom won't miss it.")
    { from: 26.9, to: 28.4, vf: [[0, .9, 988, 475], [1.5, .925, 988, 475]] },   // DOUBLE OR NOTHING, HOUSE WINS
    { from: 30.6, to: 32.2, rate: .6, vf: BANNER },     // Mom: "Have you seen Grandma's chain?"
    { from: 32.4, to: 33.3 },                           // his face
    { from: 33.3, to: 34.5 },                           // its face beside him, grinning
    { from: 34.5, to: 35.3 },                           // 3:58 AM
    { from: 35.6, to: 37.3, rate: .6, vf: BANNER },     // Sis: "I had to drop out. It's okay"
    { from: 40.45, to: 41.1, rate: .8 },                           // his face, empty
    { from: 41.1, to: 42.5 }                            // its grin behind him
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 18.5, to: 44.45, fo: .3 },            // the nights' pulse, unbroken under every cut, to the edge of the montage
      { at: 25.654, from: 110.95, to: 114.2, fi: .01 }],        // the film's last hit ("STILL ME.") lands on the end card, its drone under it
    hits: [{ at: 20.858, gain: -15 }, { at: 25.904, gain: -9 }]   // a low boom under Sis's last message, a boom on the end card
  }
});
