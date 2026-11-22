// ---- THE EDIT, version 2 (22 Nov 2026: one boy, one timeline, dramatic: held longer, fewer punch-ins, a black between chapters).
// cut(shot, { a, b, sp, cam: [zoom, x, y] }) plays seconds a..b of a source shot at speed sp; blink(d) is a beat of black.
// the hook: HE USED TO DRAW EVERY DAY. / "why not me?" / "look."
cut('hk1', { sp: 1.0 }); cut('hk2', { sp: 1.0 }); cut('hk3', { sp: 1.0 });
blink(.3);
// two friends
cut('floor', { a: 0, b: 2.4, sp: 1.1 }); cut('floor', { a: 2.4, b: 4.5, sp: 1.05, cam: [1.25, 960, 640] });
// the window
cut('night', { a: 0, b: 2.4, sp: 1.1 }); cut('night', { a: 2.4, b: 3.6, sp: 1.0, cam: [1.6, 560, 450] }); cut('night', { a: 3.6, b: 6.0, sp: 1.05 }); cut('night', { a: 6.0, b: 7.6, sp: 1.0, cam: [1.9, 950, 520] });
// round 1: their comic, crumpled and eaten; the cap
cut('crumple', { a: 0, b: 2.3, sp: 1.1 }); cut('crumple', { a: 2.3, b: 3.9, sp: 1.05 }); cut('crumple', { a: 3.9, b: 6.5, sp: 1.1, cam: [1.5, 660, 480] });
blink(.25);
// round 2: the medal, the sketchbook, the lamp goes out
cut('medal', { a: 0, b: 2.4, sp: 1.05 }); cut('medal', { a: 2.4, b: 4.2, sp: 1.0 }); cut('medal', { a: 4.2, b: 6.5, sp: 1.05 });
blink(.25);
// the cost: Max's show
cut('card', { a: 0, b: 1.05, sp: .85 }); cut('card', { a: 1.05, b: 3.5, sp: 1.1 });
cut('showL', { a: 0, b: 2.0, sp: 1.05 }); cut('showL', { a: 2.0, b: 3.6, sp: 1.0 }); cut('showL', { a: 3.6, b: 5.0, sp: 1.05 }); cut('showL', { a: 5.0, b: 6.8, sp: .9, cam: [1.45, 760, 560] });
blink(.3);
// the worst, and the truth it hid
cut('worst', { a: 0, b: 1.8, sp: 1.0 }); cut('worst', { a: 1.8, b: 4.0, sp: 1.0 });
cut('cover', { sp: .7 }); cut('wide', { sp: .9 });
cut('wrench', { sp: 1.0 }); cut('slam', { sp: 1.05 });
blink(.3);
// one page a day
cut('page1', { a: 0, b: 4.5, sp: 1.1 }); cut('page40', { a: 0, b: 3.5, sp: 1.1 }); cut('page40', { a: 3.5, b: 5.0, sp: 1.1 });
cut('board40', { sp: 1.0 }); cut('down40', { sp: 1.1 });
cut('door', { a: 0, b: 2.9, sp: 1.1 }); cut('door', { a: 2.9, b: 4.0, sp: 1.05 }); cut('door', { a: 4.0, b: 5.2, sp: 1.05, cam: [1.55, 520, 600] }); cut('door', { a: 5.2, b: 6.5, sp: 1.1 });
cut('stitch', { a: 0, b: 3.0, sp: 1.1 });
// the last picture, the title
cut('last', { a: 0, b: 2.6, sp: 1.0 }); cut('last', { a: 2.6, b: 4.4, sp: 1.0, cam: [1.5, 960, 520] }); cut('last', { a: 4.4, b: 7.0, sp: 1.0 });
cut('title', { sp: 1.0 });
