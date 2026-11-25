// film: films/07-it-was-so-small
// Short 49 bottle-wait: IT CAN WAIT. The bottle, both ways. The hook is DAY 90: his hand lifts the thumb-sized devil
// by its tail, drops it into the empty bottle and corks it ("he won."). It had done the same to him first: at 38 its
// claws dropped him into a bottle and corked it ("it bottled him first."), and he pounded on the glass until it broke
// ("he broke out."). DAY 90 again: it stamps and shakes its fist, he sets the bottle on the highest shelf, Lily's new
// drawing, his face, the hug. Then night: two small eyes open inside the bottle ("it didn't die."), and the same two
// eyes once opened in the foam of his first beer ("it was this small at fifteen."), then every size it grew to after
// ("and it grew."). Back on the shelf it breathes on the glass, draws a smile in the fog and taps, politely: "i can
// wait." The end card's line: "so starve it. every day."
// Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t;
const NS = .75;                                                                                  // the night, a little slower
// the hook: DAY 90, he corks it
t = piece(['lower', -.3], ['cork90', .45], { win: [.7, 800, 520], to: [.95, 600, 540], words: false });
cap('say', 'he won.', t + .05, now() - t - .05, { write: .3 });
// it did it to him first
t = piece(['a38', .1], ['a38', .9], { win: [.62, 1000, 470], words: false });                   // the giant at her birthday, him tiny at the table
piece(['claws', .62], ['inBottle', -.1], { win: [.62, 900, 480], words: false });              // they carry him to the bottle
piece(['inBottle', -.1], ['cork38', .5], { win: [.8, 760, 560], to: [.9, 700, 600], words: false });   // it corks him in
cap('say', 'it bottled him first.', t + .05, now() - t - .05, { write: .45 });
piece(['inside', .15], ['inside', .95], { win: [.6, 900, 540], words: false });                // inside the glass
t = piece(['pound1', -.1], ['pound2', .2], { win: [.7, 800, 520], words: false });             // he pounds on it
piece(['tip', -.05], ['smash', .15], { win: [.6, 900, 540], words: false });                   // it cracks
cap('say', 'he broke out.', t + .05, now() - t - .05, { write: .35 });
gap(.1);
// DAY 90: it is a thumb now
piece('day90', ['day90', .77], { win: [.62, 1150, 540], words: false });                       // it stamps, shakes its fist, next to his face
piece(['day90', .77], ['lower', -.3], { win: [1.0, 1500, 520], words: false });                // his face
piece('shelf', ['setDown', .45], { win: [.7, 1250, 420], words: false });                     // the highest shelf
piece(['newDraw', .1], ['newDraw', 1.3], { win: [.6, 930, 500], words: false });              // Lily's new drawing
piece(['samFace', .3], ['samFace', 1.5], { win: [.7, 930, 470], words: false });              // his face
piece(['kneel', .1], ['hug', .2], { win: [.75, 770, 620], to: [.8, 880, 620], words: false }); // she runs in
piece(['hug', .3], ['hug', 1.05], { win: [.7, 900, 560], words: false });                     // the hug
piece(['hug', 1.1], ['hug', 2.1], { win: [.62, 900, 560], words: false });                    // held, in the light
gap(.15);
// night
t = piece('night', ['eyesOpen', .55], { win: [.75, 960, 560], to: [.95, 960, 520], sp: NS, words: false });
cap('say', 'it didn’t die.', FTS('eyesOpen') - .05, now() - FTS('eyesOpen') + .05, { write: .35 });
// the same eyes in the foam of his first beer
t = piece(['rimEyes', .05], ['shake', 0], { win: [.75, 980, 320], to: [.85, 980, 330], words: false });
cap('say', 'it was this small at fifteen.', t + .05, now() - t - .05, { write: .45 });
t = piece(['pop21', -.25], ['pop21', .3], { win: [.8, 1150, 430], words: false });
piece(['pop26', -.25], ['pop26', .3], { win: [.7, 1000, 480], words: false });
piece(['pop31', -.25], ['pop31', .3], { win: [.75, 920, 520], words: false });
piece(['pop34', -.2], ['pop34', .45], { win: [.65, 880, 320], words: false });
piece(['cantSee', .1], ['cantSee', .8], { win: [.62, 1150, 420], words: false });             // the giant over her cake
cap('say', 'and it grew.', t + .05, now() - t - .05, { write: .35 });
// back on the shelf: it can wait
piece(['fog', -.1], ['drawSmile', .85], { win: [1.0, 960, 520], sp: NS, words: false });
piece(['tap1', -.05], ['wait', 1.1], { win: [.9, 960, 560], sp: NS });
gap(.12);
endCard({ dur: 2.8, title: 'THE BOTTLE', line: 'so starve it. every day.', cta: 'watch the full film' });
