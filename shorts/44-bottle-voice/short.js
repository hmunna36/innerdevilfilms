// film: films/07-it-was-so-small
// Short 44 bottle-voice: IT NEVER LIES. Only the devil's lines, kind to cruel and then begging, the picture cut to each
// one: its face close when it speaks, his face answering. Opens on the giant's grin with the Short's own line ("it never
// lied to him."), closes on the giant at the birthday ("every word was true."), its last small line still on screen.
// Where the film's red words would sit on the beer, the blanket or his face, the line is written again by the Short in
// the top band (cap) and the film's own is hidden. Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t, t2;
// the hook: the giant's face
t = piece(['a38', .02], ['claws', -.08], { win: [1.5, 1250, 360], to: [1.62, 1250, 360], words: false });
cap('say', 'it never lied to him.', t + .05, 1.35, { write: .4 });
// AGE 15: kind
t = piece(['two21', .1], ['funnier', .75], { win: [1.8, 1300, 300], to: [1.9, 1300, 300], words: false });  // on the rim
t2 = piece(['funnier', .75], ['drop', -.02], { win: [.85, 690, 330], words: false });                     // his face, delighted
cap('devil', "you're funnier with me.", FTS('funnier'), now() - FTS('funnier'), { band: 'top', write: .55 });
gap(.1);
// AGE 26
piece(['ting1', -.12], ['toUs', -.12], { win: [1.0, 1000, 520] });               // it taps the glass for the toast
piece(['toUs', -.12], 'sip26', { win: [1.3, 860, 520] });                         // "to us."
piece('sip26', ['sip26', .62], { win: [.6, 960, 500] });                         // it drinks from his glass behind his back
gap(.1);
// AGE 31
piece(['flask', .02], ['flask', .69], { win: [.9, 1450, 330], words: false });    // the flask held out
piece(['flask', 1.5], ['drink31', -.02], { win: [.64, 790, 400], words: false }); // he looks at her, takes it
cap('devil', 'you earned it.', FTS('earned'), now() - FTS('earned'), { band: 'top', write: .45 });
gap(.1);
// AGE 34
piece(['bar34', .02], ['dinner', -.04], { win: [.8, 900, 520], to: [.95, 820, 520] });   // "one more."
piece(['drawUp', .19], ['chin', -.08], { win: [.9, 900, 400] });                  // her drawing
piece(['chin', -.08], ['illTalk', .31], { win: [.5, 800, 450] });                 // its hand turns his chin back
piece(['illTalk', .31], ['swell34', -.03], { win: [.85, 1150, 560] });            // "i'll talk. you rest."
gap(.1);
// AGE 38: the real voice
piece(['lean38', .02], ['cantSee', -.04], { win: [.9, 909, 300] });               // her face
piece(['cantSee', -.04], ['truth', -.03], { win: [.8, 960, 470], to: [.92, 1000, 450] });   // THEY CAN'T SEE ME.
gap(.15);
// DAY 1 on: the same voice, begging
piece(['day1', .02], ['day1', .55], { win: [.9, 1000, 600] });                    // his shaking hands lace a shoe
piece(['day1', .55], ['run', -.02], { win: [.55, 1085, 600], to: [.6, 1075, 600] });   // "just one. for the shakes." he stands up
gap(.1);
piece(['noFun', -.16], ['noFun', .24], { win: [.85, 760, 600] });                 // "you're no fun."
piece(['noFun', .24], ['noFun', .77], { win: [.8, 850, 480] });
piece(['noFun', .77], ['bump', .1], { win: [.85, 760, 600] });                    // it slides off
gap(.1);
piece(['day60', .26], 'stop60', { win: [.85, 960, 600] });                        // the bar's door, it on the step
piece('stop60', 'tempt', { win: [1.8, 1150, 760], words: false });                // "just a sip. i'm so small."
piece('tempt', ['tempt', .85], { win: [.62, 900, 300], words: false });           // his face
cap('devil', "just a sip. i'm so small.", FTS('sip60', .05), now() - FTS('sip60', .05), { band: 'top', write: .6 });
gap(.1);
// the last one
piece(['fog', -.22], ['night', 1.69], { win: [1.15, 960, 610] });                // in the bottle, its eyes open
piece(['night', 1.69], ['night', 2.61], { win: [1.0, 960, 540] });               // it draws a smile in the fog
piece(['night', 2.61], ['black', -.02], { win: [1.22, 950, 637], words: false }); // it taps: "i can wait."
const wt = FTS('wait', .05);
gap(.1);
// the close: the giant it became
t = piece(['hk2', .04], ['hk3', -.06], { win: [.6, 700, 520], to: [.66, 740, 520], words: false });
cap('devil', 'i can wait.', wt, t + .7 - wt, { write: .45 });
cap('say', 'every word was true.', t + .12, now() - t - .12, { write: .4 });
endCard({ dur: 2.9, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
