// film: films/07-it-was-so-small
// Short 45 bottle-birthday: WHAT SHE SAW. The story through Lily's eyes. Hook: her frightened face at her birthday
// ("his daughter saw everything."), the pan to the giant over the cake (THEY CAN'T SEE ME.). Then from the day she was
// born: the nursery and the flask over her, the dinner where she held up her drawing and it turned his chin away, the
// devil swelling over the table, the giant in his chair at her birthday corking him in the bottle. Then the same table
// as they saw it (no devil, Dad slumped, her mother pulls her away: THEY ONLY SEE YOU.), and the drawing on the
// fridge, Daddy in red with horns ("this is what she saw.", the one slow moment). He sees it too, and breaks out.
// Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t;
// the hook: her face, then what she is looking at
t = piece(['lean38', .035], ['lean38', .458], { win: [.94, 905, 285], to: [.98, 905, 290], words: false });
cap('say', 'his daughter saw everything.', t + .05, 1.85, { write: .4 });
t = piece('cantSee', ['truth', -.03], { win: [1.25, 400, 660], to: [.74, 1010, 470], words: false });   // from her and the bottle to the giant
cap('devil', "THEY CAN'T SEE ME.", t + .42, now() - t - .42, { slam: true });
gap(.12);
// from the day she was born
t = piece(['a31', .05], ['a31', 1.0], { win: [.85, 990, 560], words: false });       // the nursery: it beside him, looking at the baby
cap('say', 'from the day she was born.', t + .05, 1.55, { write: .4 });
piece('flask', ['flask', .69], { win: [.9, 1400, 600], words: false });            // it holds out the flask
piece('drink31', 'pop31', { win: [.95, 920, 600] });                                // he drinks with her in his arms; it grows
gap(.12);
// the dinner
piece('dinner', ['dinner', .577], { win: [.7, 860, 500] });                          // it sits between them
piece(['dinner', .577], ['dinner', 1.077], { win: [1.0, 880, 420] });                // she holds up her drawing
piece(['dinner', 1.077], ['dinner', 1.769], { win: [.62, 800, 450] });               // its hand turns his chin back to the glass
piece(['dinner', 1.769], 'swell34', { win: [1.5, 680, 520], to: [1.7, 650, 545] });   // her, waiting, then lowering it
piece('swell34', ['a38', -.12], { win: [.66, 800, 450], to: [.8, 740, 440] });        // it swells over the table
gap(.12);
// her birthday
piece('a38', 'claws', { win: [.7, 560, 520], to: [.7, 1150, 420] });                 // the giant in his chair
piece('claws', 'inBottle', { win: [.8, 900, 480] });                                 // it lifts him
piece('inBottle', ['lean38', -.03], { win: [.9, 700, 560], to: [1.1, 640, 600] });     // and corks him in the bottle
// the same table, as they saw it
piece('truth', ['truth', .92], { win: [.52, 910, 540] });                            // no devil: Dad, the cake knocked over
piece(['truth', .92], ['truth', 1.56], { win: [.9, 1050, 420], words: false });       // his face
t = piece(['truth', 1.56], 'fridge', { win: [.62, 490, 560], to: [.62, 1250, 545], words: false });   // her mother pulls her away; he stays
cap('devil', 'THEY ONLY SEE YOU.', t + .02, now() - t - .02, { slam: true });
gap(.12);
// the drawing
t = piece('fridge', 'inside', { win: [.75, 980, 420], to: [.82, 980, 430], sp: .85 });
cap('say', 'this is what she saw.', t + .35, now() - t - .35, { write: .45 });
// he sees it too
t = piece('inside', 'pound', { win: [.58, 960, 470] });
cap('say', 'now he saw it too.', t + .45, 1.5, { write: .4 });
piece('pound', 'floor', { win: [.68, 900, 470] });
piece('floor', 'sink', { win: [.62, 1100, 500], to: [.7, 1080, 480] });             // the bottle breaks; he stands up to it
endCard({ dur: 2.9, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
