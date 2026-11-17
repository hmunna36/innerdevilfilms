// film: films/07-it-was-so-small
// Short 43 bottle-hook: HOW IT GREW. The giant at his daughter's birthday first, then back to the glass it started in,
// and every drink it grew on, each counted in slammed red capitals (the Short's own words), to the chair it took and
// the bottle it put him in. The four slams sit in the top band (the low band is over the beer in the first one). Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t;
// the hook: the giant, and him in the bottle
t = piece('hk2', 'hk3', { win: [.72, 880, 540], to: [.84, 900, 520], words: false });
cap('say', 'this is his drinking problem.', t + .05, 1.4, { write: .4 });
// where it started
piece('hk3', 'a21', { win: [.8, 960, 540], to: [1.05, 960, 580] });
piece('a21', 'rim', { win: [.58, 925, 560] });                                   // his first one, at fifteen
piece(['rimEyes', -.12], 'face21', { win: [1, 950, 500] });                                 // it climbs out of the foam
piece('two21', 'drop', { win: [.6, 1000, 520] });                              // "you're funnier with me."
// every drink, it grows
t = piece(['lick', -.15], ['pop21', .7], { win: [.82, 1130, 420], words: false });
cap('devil', 'ONE DRINK.', FTS('pop21'), .7, { slam: true, band: 'top', size: 104 });
gap(.1);
t = piece(['gulp26a', -.1], 'wall26', { win: [.64, 930, 440] });
cap('devil', 'ONE TOAST.', FTS('pop26'), .6, { slam: true, band: 'top', size: 104 });
piece('wall26', ['wall26', 1.6], { win: [.62, 1000, 560] });                   // "it was growing."
gap(.1);
t = piece(['drink31', .15], ['pop31', .9], { win: [.9, 930, 600] });
cap('devil', 'ONE FLASK.', FTS('pop31'), .8, { slam: true, band: 'top', size: 104 });
gap(.1);
piece('a34', 'bar34', { win: [.9, 800, 600], to: [.9, 930, 600] });            // "it wore his tie."
t = piece('swell34', ['creak', .75], { win: [.58, 950, 540] });
cap('devil', 'ONE MORE.', FTS('pop34'), .9, { slam: true, band: 'top', size: 104 });
gap(.1);
// the chair, the bottle
piece('a38', 'claws', { win: [.62, 1100, 540] });                               // "it took his chair."
piece(['claws', .2], 'lean38', { win: [.75, 900, 560], to: [.95, 760, 600] });
piece('lean38', ['lean38', .46], { win: [1, 900, 560] });
piece(['lean38', .46], ['truth', -.03], { win: [.72, 900, 540], to: [.8, 900, 540] });   // THEY CAN'T SEE ME.
endCard({ dur: 2.9, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
