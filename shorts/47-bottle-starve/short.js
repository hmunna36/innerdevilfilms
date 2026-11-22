// film: films/07-it-was-so-small
// Short 47 bottle-starve: STARVE IT. "you can't kill it." over the giant grinning down at him on the kitchen floor;
// he stands and pours the bottle away ("he stopped feeding it."), it flinches and is a little smaller. Then the days,
// the devil a size smaller in each, its size slammed in red: A GIANT. / HIS SIZE. / A CHILD. / A CAT. / A THUMB.
// Inside every day a flash of the age at which it was that size on the way up, so the days count up while the ages
// count down (DAY 1 / AGE 38, DAY 14 / AGE 34, DAY 40 / AGE 31, DAY 60 / AGE 26, DAY 90 / AGE 15): it shrinks back the
// way it grew, to the size it was when they met. The answer to the first line closes it: "you can starve it."
// Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t, t2;
const SLAM = { slam: true, band: 'top', size: 104 };
// the hook: the giant over him on the floor; he stands, pours it away; it flinches and shrinks
t = piece(['floor', .04], 'sink', { win: [.72, 1060, 300], to: [.76, 1070, 300], words: false });
cap('say', "you can't kill it.", t + .05, 1.6, { write: .4 });
piece('sink', ['sink', .88], { win: [.64, 975, 330] });                                  // he pours
piece(['sink', .88], ['sink', 1.68], { win: [.85, 1114, 330] });                         // it flinches (the film's punch)
piece(['sink', 1.68], ['day1', -.12], { win: [.75, 1400, 360] });                        // a little smaller; it looks at its hand
gap(.12);
// DAY 1: A GIANT. (the film's words are written again by the Short: its time stamp would be laid out as a caption)
piece('day1', ['day1', .54], { win: [1, 950, 540], words: false });                     // shaking hands lace a shoe
t = piece(['day1', .54], ['justOne', .34], { win: [.58, 1060, 450], words: false });     // the giant in the doorway, a glass
piece(['a38', .08], ['a38', 1.08], { win: [.6, 1150, 280], words: false });             // AGE 38: the giant at her birthday
cap('devil', 'A GIANT.', t + .15, now() - t - .15, SLAM);
t = piece(['justOne', .34], ['justOne', 1.29], { win: [.58, 1060, 520], words: false }); // "just one. for the shakes."
piece(['justOne', 1.29], 'run', { win: [.62, 900, 520], words: false });                  // he stands
cap('devil', 'just one. for the shakes.', t + .05, now() - t - .05, { write: .7 });
t = piece('run', 'day14', { win: [.56, 760, 420], words: false });                        // it chases him
cap('say', 'so it chased him.', t + .1, now() - t - .1, { write: .45 });
gap(.12);
// DAY 14: HIS SIZE.
t = piece('day14', ['day14', .93], { win: [.9, 720, 470], words: false });                // push-ups, it sits on his back
piece(['a34', .1], ['a34', 1.1], { win: [.95, 700, 500], words: false });               // AGE 34: it walks in step with him
cap('devil', 'HIS SIZE.', t + .15, now() - t - .15, SLAM);
t = piece(['day14', .93], ['day14', 1.46], { win: [.9, 760, 450], words: false });        // his face, it on his back
piece(['day14', 1.46], 'day40', { win: [.75, 560, 600], words: false });                 // it slides off
cap('devil', "you're no fun.", t + .05, now() - t - .05, { write: .45 });
gap(.12);
// DAY 40: A CHILD.
t = piece('day40', ['day40', 1.5], { win: [.58, 1200, 390], words: false });              // pull-ups, it hangs from his ankle
piece(['a31', .1], ['a31', 1.1], { win: [.9, 990, 520], words: false });                // AGE 31: it stands by the crib
cap('devil', 'A CHILD.', t + .2, now() - t - .2, SLAM);
piece(['day40', 1.5], ['day40', 2.11], { win: [1, 980, 540], words: false });            // Lily's first small smile
piece(['day40', 2.11], 'day60', { win: [.58, 1200, 520], words: false });                // it drops off
gap(.12);
// DAY 60: A CAT.
t = piece('day60', ['day60', .9], { win: [.65, 1000, 540], words: false });               // it sits on the bar's step
piece(['a26', .35], ['a26', 1.3], { win: [.8, 1130, 380], words: false });              // AGE 26: on his shoulder in a bow tie
cap('devil', 'A CAT.', t + .2, now() - t - .2, SLAM);
piece(['day60', .9], ['day60', 1.86], { win: [.65, 1000, 540], words: false });          // it holds up its tiny glass
gap(.12);
// DAY 90: A THUMB. And the size it was when they met.
t = piece('day90', ['day90', .57], { win: [.8, 1000, 630], words: false });               // thumb-sized, stamping
piece(['rim', .68], ['rim', 1.8], { win: [.9, 1000, 450], words: false });              // AGE 15: it climbs out of the foam
t2 = now() - .5;                                                                          // the last line starts as the flash ends
cap('devil', 'A THUMB.', t + .12, t2 - t - .12, SLAM);
t = t2;
piece(['day90', .57], ['day90', 1.04], { win: [.86, 980, 630], sp: .5, words: false });  // it stamps and shakes its fist
cap('say', 'you can starve it.', t, now() - t, { write: .4 });
endCard({ dur: 3.0, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
