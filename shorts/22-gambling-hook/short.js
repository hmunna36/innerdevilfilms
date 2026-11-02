'use strict';
// SHORT 22: gambling-hook, the whole escalation of GAMBLING in 31 s: the cold line, a card spins out of the dark window
// to his feet and its eyes open, GAMBLING, then four nights with it closer each time and the cost on his phone (the first
// win, Sis's college fees, the foot of the bed, its claw takes Grandma's chain, DOUBLE OR NOTHING takes it all, beside
// him, behind him), the zeros, the dead phone and the black glass: "I LET YOU WIN." / "I AM THE HOUSE.", end card.
// Times are the film's (films/04-gambling/film.js).
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 1.45, to: 1.9, rate: .37 },   // the cold line, typed in full from the first frame, held 1.2 s
    { from: 1.9, to: 3.2 },        // a card spins out of the window to his feet; its eyes open
    { from: 3.2, to: 3.8 },        // GAMBLING
    { from: 3.8, to: 4.6 },        // night 1: 11:52 PM
    { from: 5.0, to: 6.8 },        // the first win, YOU WIN ("Just one bet. For fun.")
    { from: 7.8, to: 9.4, slot: 'top', vf: [[0, 1.2, 900, 600], [1.6, 1.32, 905, 590]] },   // his face, hungry, as it whispers from the window ("See? You're good at this.")
    { from: 9.85, to: 11.45, rate: .6, vf: [[0, 1.38, 972, 305], [2.67, 1.44, 972, 300]] },   // the banner, slowed to read: Sis: "Did you send my college fees?"
    { from: 15.0, to: 15.8 },      // night 2: 12:47 AM
    { from: 18.4, to: 20.2 },      // at the foot of the bed ("He can wait. You're due for a win.")
    { from: 23.8, to: 24.6 },      // night 3: 2:16 AM
    { from: 24.6, to: 26.4 },      // its claw takes Grandma's chain ("Mom won't miss it.")
    { from: 26.4, to: 28.4, vf: [[0, .94, 992, 450], [2, .98, 992, 445]] },   // the deposit, DOUBLE OR NOTHING, HOUSE WINS, $0.00
    { from: 28.6, to: 30.3 },      // beside him ("You'll win it back by morning.")
    { from: 34.5, to: 35.3 },      // night 4: 3:58 AM
    { from: 37.5, to: 40.1 },      // behind him, its claws on his shoulders ("You still have something to bet…")
    { from: 47.9, to: 53.9 }       // the zeros, the phone dies, the black glass: I LET YOU WIN. / I AM THE HOUSE.
  ],
  end: { dur: 2.8 },
  audio: {
    pieces: [{ at: 0, from: 0.6838, to: 22.967, fo: .05 },          // the cold open, the title hit on GAMBLING, then the nights' pulse unbroken under the jump cuts
      { at: 22.283, from: 47.9, to: 56.7, fo: 1.2 }],              // in sync from the zeros: the dead phone's silence, the reveal, its stinger under the end card
    hits: [{ at: 22.283, gain: -10 }, { at: 28.283, gain: -9 }]
  }
});
