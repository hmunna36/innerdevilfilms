// film: films/07-it-was-so-small
// Short 48 bottle-door: IT ASKED NICELY. DAY 60, evening: the devil sits on the step of the bar's lit doorway, the
// size of a cat, a tiny glass in both hands, enormous eyes: "just a sip. i'm so small." The scene is played a little
// slower (sp .75: the film's sound slows and drops with it). The hook is its begging face ("day 60. it asked
// nicely."), then what it was ("it was huge once.": three flashes of the giant). While he stands there tempted, two
// memories cut in: the first time, when it was even smaller (AGE 15: it climbs out of the foam on his first beer, he
// laughs, he drinks it down and it pops a size bigger: "he said yes."), and what saying yes cost (Lily holding up her
// drawing at dinner, her face at her birthday, Dad slumped in the paper hat, MY FAMILY on the fridge). Then her hand
// slides into his ("he had a reason."), they walk on, its ears droop and it shrinks on the step ("it will ask again.").
// Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t;
const SP = .75;
// the hook: its begging face on the step
t = piece(['day60', .12], ['day60', 1.05], { win: [2.3, 1200, 721], to: [2.45, 1202, 723], sp: SP, words: false });
piece(['day60', 1.05], 'tempt', { win: [3.0, 1200, 700], to: [3.2, 1200, 700], sp: SP, words: false });           // its eyes, closer
cap('say', 'day 60. it asked nicely.', t + .05, now() - t - .05, { write: .45 });
// what it was
t = piece(['swell34', .5], ['creak', .6], { win: [.56, 900, 480], to: [.6, 920, 470], words: false });      // it swells over the dinner table
piece(['claws', .3], ['claws', 1.25], { win: [.58, 1100, 420], words: false });                              // its claws lift him to the bottle
piece(['floor', .05], ['floor', .9], { win: [.6, 1250, 420], words: false });                                 // it grins down at him on the floor
cap('say', 'it was huge once.', t + .05, now() - t - .05, { write: .35 });
gap(.12);
// DAY 60: the ask, slower
piece('day60', 'stop60', { win: [.56, 900, 560], to: [.6, 960, 560], sp: SP, words: false });              // he walks to the lit door
t = piece('stop60', ['stop60', .6], { win: [.78, 1000, 560], sp: SP, words: false });                      // he stops; it holds up its glass
piece(['stop60', .6], 'tempt', { win: [1.9, 1170, 700], sp: SP, words: false });                            // its eyes
piece('tempt', ['tempt', .45], { win: [.56, 960, 300], sp: SP, words: false });                             // his face
cap('devil', 'just a sip. i’m so small.', t + .15, now() - t - .15, { write: .7, band: 'top' });
// the first time, when it was even smaller
piece(['a21', .3], ['a21', 1.4], { win: [.62, 960, 560], words: false });                                    // AGE 15: his first one
t = piece(['rimEyes', .1], ['shake', .1], { win: [.62, 975, 460], to: [.7, 975, 440], words: false });    // it climbs out of the foam
piece(['shake', .1], ['face21', -.02], { win: [.7, 975, 430], to: [.76, 975, 420], words: false });         // it shakes off the foam
cap('say', 'it was smaller at fifteen.', t + .1, now() - t - .1, { write: .45 });
piece(['face21', .05], ['two21', -.02], { win: [.6, 960, 420], words: false });                              // he laughs
piece(['two21', .05], ['two21', 1.0], { win: [.55, 925, 470], words: false });                               // it on his glass
t = piece('drop', ['lick', -.05], { win: [.7, 1100, 480], words: false });                                   // he drinks it down
piece(['lick', -.05], ['pop21', .3], { win: [.85, 1150, 430], words: false });                               // it pops a size bigger
cap('say', 'he said yes.', t + .1, now() - t - .1, { write: .35 });
// DAY 60: his face
piece(['tempt', .45], ['tempt', .85], { win: [.6, 960, 320], sp: SP, words: false });
// what yes cost
piece(['drawUp', .22], ['chin', .2], { win: [.62, 900, 470], words: false });                               // Lily holds up her drawing; he looks at the glass
piece(['lean38', .01], ['lean38', .456], { win: [1.2, 900, 460], words: false });                             // her face at her birthday
piece(['truth', .93], ['truth', 1.55], { win: [.75, 1180, 520], words: false, count: false });               // Dad slumped in the paper hat
piece(['fridge', .1], ['fridge', 1.0], { win: [.75, 1080, 460], words: false });                             // MY FAMILY, Daddy in red
// DAY 60: the reason
piece(['tempt', .85], 'handShot', { win: [.56, 960, 300], to: [.6, 960, 300], sp: SP, words: false });      // he swallows
t = piece('handShot', ['handShot', .63], { win: [.8, 860, 480], sp: SP, words: false });                    // her hand slides into his
piece(['handShot', .63], ['handShot', 1.28], { win: [.64, 1050, 560], sp: SP, words: false });               // they walk on
cap('say', 'he had a reason.', FTS('hand') + .05, now() - FTS('hand') - .05, { write: .4 });
t = piece(['handShot', 1.28], 'day90', { win: [1.8, 1200, 790], sp: .5, words: false });                    // its ears droop; it shrinks
cap('say', 'it will ask again.', t + .1, now() - t - .1, { write: .4 });
gap(.12);
endCard({ dur: 3.2, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
