'use strict';
// SHORT 25: gambling-deal, one idea: it deals. Watch his floor. It opens on its eyes in the dark window over its whisper
// ("Win a little more. Then send it."), then the camera drops to the card it dealt at his feet as it flips over to its
// grin. Then the four nights as two-shots, each framed low so the floor is in the picture: from the window it deals the
// second card ("See? You're good at this."); 12:47 AM, at the foot of the bed it deals three ("He can wait. You're due
// for a win."), his face, its face ("Double it. Then stop."); 2:16 AM, beside him it deals four ("You'll win it back by
// morning."), his face, its grin; 3:58 AM, behind him, its claws coming down, five more fall ("You still have something
// to bet..."), his face, its grin closest; the last shot is the pile around his feet, its grin card among them, as six
// more drop and its claws close on his shoulders; end card.
// Times are the film's (films/04-gambling/film.js). The deals are slowed a little (.8-.85) so each card can be seen land.
// The sound: the film's casino chime over its first pulse under the eyes and the flip (a low boom as the card turns),
// a boom on 12:47 AM, then the nights' pulse unbroken to its peak on the pile, and the end card lands on the reveal's
// explosion.
defineShort({
  film: 'films/04-gambling',
  segments: [
    { from: 13.4, to: 15.0, rate: .7, vf: [[0, 1.5, 470, 300], [.25, 1.55, 480, 310], [.62, 1.9, 1240, 800], [2.29, 2.2, 1250, 815]] },   // its eyes in the dark window: "Win a little more. Then send it."; down to the card at his feet: it flips to its grin
    { from: 8.0, to: 9.6, vf: [[0, .72, 720, 600], [1.6, .76, 725, 600]] },   // night 1, both: "See? You're good at this." it deals the second card
    { from: 15.0, to: 15.8 },      // 12:47 AM
    { from: 18.4, to: 20.2, rate: .8, vf: [[0, .7, 1180, 690], [2.25, .78, 1150, 700]] },      // the foot of the bed; it deals three
    { from: 20.2, to: 21.2 },      // his face
    { from: 21.2, to: 22.6, rate: .6 },      // its face: "Double it. Then stop." (slowed: the line holds 1.25 s)
    { from: 23.8, to: 24.6 },      // 2:16 AM
    { from: 28.6, to: 30.4, rate: .8, vf: [[0, .7, 1060, 680], [2.25, .75, 1045, 670]] },      // beside him; four
    { from: 32.4, to: 33.3 },      // his face
    { from: 33.3, to: 34.5 },      // its face
    { from: 34.5, to: 35.3 },      // 3:58 AM
    { from: 37.5, to: 40.1, rate: .85, vf: [[0, .74, 960, 660], [3.06, .8, 960, 670]] },      // behind him; five
    { from: 40.1, to: 41.1 },      // his face
    { from: 41.1, to: 42.5 },      // its grin
    { from: 42.5, to: 44.9, rate: .85, vf: [[0, .78, 960, 690], [2.82, .86, 975, 705]] }       // the pile
  ],
  end: { dur: 3.0 },
  audio: {
    pieces: [{ at: 0, from: 4.5, to: 8.386, fo: .04 },              // the casino chime over the first pulse, under the eyes and the flip
      { at: 3.886, from: 27.235, to: 47.85, fo: .03 },               // from 12:47 AM the nights' pulse, unbroken, climbing to its peak on the pile
      { at: 24.501, from: 48.85, to: 52.6, fi: .005 }],             // the end card lands on the reveal's explosion
    hits: [{ at: .714, gain: -12 }, { at: 3.886, gain: -10 }, { at: 24.501, gain: -8 }]
  }
});
