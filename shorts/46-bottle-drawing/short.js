// film: films/07-it-was-so-small
// Short 46 bottle-drawing: TWO DRAWINGS. Lily drew her dad twice: MY FAMILY on the fridge with Daddy in red and horns,
// and the new one, Daddy in blue holding her hand under a yellow sun. The hook is the two drawings, one after the other
// ("she drew her dad twice."). Then what she saw before the first: the yellow blanket and the devil at his shoulder,
// the drawing she held up at dinner while its hand turned his chin back to the glass ("he never looked."), the giant
// over her birthday cake, her face, and what she saw: only Dad, slumped in the paper hat; the fridge ("so she drew what she saw."). Then he looks at it from inside
// the bottle ("then he looked."), breaks out, pours it away, and what she sees changes: her first small smile while it
// drops off his ankle, her hand in his while it begs at the bar door, the new drawing ("so he changed what she saw."),
// his face, the hug, held.
// Times are seconds in the film's edit (films/07-it-was-so-small/cues_edit.json).
'use strict';
let t;
// the hook: the two drawings
t = piece(['fridge', .07], ['fridge', 1.07], { win: [.8, 1090, 440], to: [.95, 1110, 440], words: false });
cap('say', 'she drew her dad twice.', t + .04, 2.1, { write: .4 });
piece(['newDraw', .25], ['newDraw', 1.25], { win: [.66, 1000, 210], to: [.74, 1040, 230], words: false });
gap(.12);
// the first drawing: what she saw
piece(['a31', .1], ['a31', 1.1], { win: [1.0, 980, 600] });                                         // the yellow blanket, it at his shoulder
piece('dinner', 'chin', { win: [.66, 940, 480], to: [.8, 900, 460] });                               // it sits between them; she holds up her drawing
t = piece('chin', ['chin', 1.0], { win: [.66, 1160, 470], words: false });                           // its hand turns his chin back to the glass
cap('say', 'he never looked.', t + .1, 1.6, { write: .4 });
piece('drawDown', ['drawDown', .9], { win: [1.3, 640, 560], words: false });                         // she lowers it
piece(['cantSee', .2], ['cantSee', 1.15], { win: [.6, 1000, 450] });                                 // the giant over the cake
piece(['lean38', .03], ['lean38', .45], { win: [1.1, 920, 470], to: [1.25, 920, 460], words: false });  // her face at her birthday
piece(['truth', .94], ['truth', 1.54], { win: [.82, 1080, 320], words: false, count: false });                     // what she saw: only Dad, slumped in the paper hat
t = piece(['fridge', .2], ['fridge', 1.9], { win: [.62, 1000, 470], to: [.7, 1000, 480], words: false });
cap('say', 'so she drew what she saw.', t + .1, now() - t - .1, { write: .45 });
gap(.12);
// the second drawing: what he did
t = piece('inside', ['inside', 1.0], { win: [.6, 1100, 470], words: false });                        // he looks at it through the glass
piece('pound2', 'floor', { win: [.66, 1180, 480], words: false });                                    // he pounds, the glass breaks
cap('say', 'then he looked.', t + .1, now() - t - .1, { write: .35 });
piece(['glug', -.25], ['glug', .55], { win: [.66, 850, 600], words: false });                        // he pours it away
piece(['day40', .1], ['dropOff', .35], { win: [.7, 1000, 600], words: false });                            // her first small smile; it drops off his ankle
piece('handShot', ['walkOn', .7], { win: [.6, 1130, 640], words: false });                           // her hand in his; it begs at the door
t = piece(['newDraw', .1], ['samFace', -.01], { win: [.6, 960, 180], to: [.64, 960, 190], words: false });
cap('say', 'so he changed what she saw.', t + .15, now() - t - .15, { write: .45 });
piece(['samFace', .1], ['samFace', 1.9], { win: [1.05, 960, 540], words: false });                  // his face
piece('kneel', ['night', -.02], { win: [.8, 800, 760], to: [.9, 900, 640], words: false });           // he kneels, she runs in, the hug, held
endCard({ dur: 2.9, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });
