'use strict';
// SHORT 36: rage-hook, the whole escalation of RAGE in one evening: the cold line ("EVERY TIME YOU LOSE IT… …IT
// GROWS.") over his fist, its eyes opening in the fist's shadow and its claws closing on it, RAGE, then four clocks,
// and every snap makes it bigger: 7:02 PM, the pot slammed in the sink and his shadow steps off the wall a head taller,
// Sam startled, its grin: "Long day. You're allowed."; 7:48 PM, the shout and its horns at the ceiling, Sam frozen,
// "He has to learn."; 8:32 PM, Mom's banner "Sam texted me. Is everything ok??" (slowed to read), his hot face, the fist
// through the wall with it bent double over him: "You couldn't help it." (on over the drawing), its eye in the hole; 9:17 PM, wedged into the
// hallway: "You just want to talk.", the one blow on Sam's door; then the cracked mirror, its claw lowering in step with
// his fist: "YOU NEVER LOST CONTROL."; end card.
// Times are the film's (films/06-rage/film.js). The sound is the film's own mix, each snap in sync with its picture:
// the cold open and the title hit as they are, then the evening's pulse in stretches, each starting on a cut (or just
// before it, under a clock) so the clang, the shout's blast, the crayon, Mom's ping, the wall punch, its eye's swell and
// the blow land on their pictures; the reveal's dead silence and explosion in sync, its music on under the end card.
const SEGS = [
  { from: .5, to: 2.6 },           // 0 the cold line over his fist; its eyes open in the shadow, its claws close on it
  { from: 2.6, to: 3.2 },          // 1 RAGE
  { from: 3.2, to: 4.0 },          // 2 7:02 PM
  { from: 11.7, to: 13.0, vf: [[0, 1.12, 740, 560], [1.3, 1.22, 740, 560]] },   // 3 SNAP 1: the pot in the sink
  { from: 13.0, to: 14.7, vf: [1.0, 730, 540] },     // 4 his shadow's eyes open; it steps off the wall, a head taller
  { from: 14.7, to: 15.3 },        // 5 Sam, startled
  { from: 15.75, to: 17.5 },       // 6 its grin: "Long day. You're allowed." (and his tired face)
  { from: 18.25, to: 19.0 },       // 7 7:48 PM
  { from: 20.6, to: 22.4, vf: [.95, 820, 480] },     // 8 SNAP 2: the shout; its horns at the ceiling
  { from: 22.4, to: 23.1 },        // 9 Sam frozen; his crayon snaps
  { from: 23.4, to: 25.3, vf: [.95, 840, 480] },     // 10 "He has to learn."
  { from: 26.35, to: 27.7, rate: .75, vf: [[0, 1.2, 930, 400], [1.8, 1.3, 930, 410]] },   // 11 8:32 PM: Mom's banner
  { from: 28.6, to: 29.4 },        // 12 his face, hot
  { from: 29.4, to: 31.3, vf: [.85, 1200, 418] },    // 13 SNAP 3: the fist through the wall, it bent double over him
  { from: 31.3, to: 31.9 },        // 14 the drawing slid down the wall, its whisper still on
  { from: 32.9, to: 34.0 },        // 15 its eye in the hole
  { from: 34.0, to: 34.8 },        // 16 9:17 PM
  { from: 35.3, to: 37.2, vf: [.85, 1130, 441] },    // 17 wedged into the hallway: "You just want to talk."
  { from: 38.6, to: 40.0, vf: [.85, 1150, 441] },    // 18 SNAP 4: the one blow on Sam's door
  { from: 44.1, to: 46.75 }        // 19 the cracked mirror: its claw lowers with his fist: "YOU NEVER LOST CONTROL."
];
const AT = []; { let a = 0; for (const g of SEGS) { AT.push(+a.toFixed(3)); a += (g.to - g.from) / (g.rate || 1); } AT.push(+a.toFixed(3)); }
// a piece of the film's mix in sync with segment i (starting `lead` s before it, under the segment before), to film time `to`
const piece = (i, to, lead = 0, fi = .02, fo = .04) => ({ at: +(AT[i] - lead).toFixed(3), from: +(SEGS[i].from - lead).toFixed(3), to, fi, fo });
const END = AT[SEGS.length];
defineShort({
  film: 'films/06-rage',
  segments: SEGS,
  end: { dur: 3.0 },
  audio: {
    pieces: [
      piece(0, 4.0, 0, .006, .03),     // the cold open, the title's hit, 7:02 PM
      piece(3, 17.05, 0, .01, .05),    // in sync: the clang, its eyes, its step; the pulse on under its grin
      piece(8, 23.1, .75, .03, .04),   // under 7:48 PM, then in sync: the shout's blast, the crayon
      piece(10, 25.3),                 // "He has to learn."
      piece(11, 28.15),                // Mom's ping (the banner is slowed; the pulse runs on at its own speed)
      piece(12, 31.9),                 // his face, then in sync: the fist through the wall, the drawing
      piece(15, 34.8),                 // its eye's swell, 9:17 PM
      piece(17, 37.2),                 // the hallway
      piece(18, 40.0),                 // in sync: the blow on Sam's door, the mirror cracking
      piece(19, 49.0, 0, .02, 1.2)     // in sync: the silence, IT in the glass, the explosion, on under the end card
    ],
    hits: [{ at: AT[3], gain: -12 }, { at: END, gain: -10 }]
  }
});
