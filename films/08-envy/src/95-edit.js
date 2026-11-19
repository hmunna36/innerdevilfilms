// ---- THE EDIT: what ships. The shots above are the source, timed by cues.js; cut(shot, { a, b, sp, cam: [zoom, x, y] }) plays
// seconds a..b of a source shot at speed sp, with an optional punch-in; blink() is a beat of black between chapters.
// the hook: SAME BOY. SAME DESK. / "why not me?" / "look."
cut('hk1', { sp: 1.15 }); cut('hk2', { sp: 1.1 }); cut('hk3', { sp: 1.1 });
// together
cut('floor', { a: 0, b: 1.5, sp: 1.3 }); cut('floor', { a: 1.5, b: 2.6, sp: 1.3, cam: [1.25, 960, 640] }); cut('floor', { a: 2.6, b: 4.3, sp: 1.25 });
// the window
cut('night', { a: 0, b: 1.4, sp: 1.3 }); cut('night', { a: 1.4, b: 2.4, sp: 1.25 }); cut('night', { a: 2.4, b: 3.4, sp: 1.25, cam: [1.9, 600, 450] });
cut('night', { a: 3.4, b: 4.4, sp: 1.3 }); cut('night', { a: 4.4, b: 5.6, sp: 1.2 }); cut('night', { a: 5.6, b: 6.6, sp: 1.2, cam: [2.1, 950, 520] });
// round 1: their comic, crumpled and eaten; the window grows; the cap
cut('crumple', { a: 0, b: 1.3, sp: 1.3 }); cut('crumple', { a: 1.3, b: 2.2, sp: 1.25, cam: [1.8, 980, 520] }); cut('crumple', { a: 2.2, b: 3.6, sp: 1.3 });
cut('crumple', { a: 3.6, b: 4.6, sp: 1.25 }); cut('crumple', { a: 4.6, b: 6.2, sp: 1.35, cam: [1.6, 660, 480] });
// the split: the rip, the slide, the mirror, one difference
cut('split', { a: 0, b: 1.6, sp: 1.4 }); cut('split', { a: 1.6, b: 2.6, sp: 1.0 }); cut('split', { a: 2.6, b: 3.6, sp: 1.0 });
cut('split', { a: 3.6, b: 4.6, sp: 1.1, cam: [1.5, 560, 560] }); cut('split', { a: 4.6, b: 6.0, sp: 1.1, cam: [1.5, 1360, 600] });
// round 2: the cuts alternate between the halves
cut('medal', { a: 0, b: 1.6, sp: 1.2 }); cut('work', { a: 0, b: 1.2, sp: 1.3 }); cut('medal', { a: 1.6, b: 3.0, sp: 1.3 }); cut('work', { a: 1.2, b: 2.5, sp: 1.3 });
cut('medal', { a: 3.0, b: 4.2, sp: 1.25, cam: [1.7, 380, 500] }); cut('work', { a: 2.5, b: 3.6, sp: 1.3 }); cut('medal', { a: 4.2, b: 5.4, sp: 1.3 }); cut('work', { a: 3.6, b: 5.0, sp: 1.3 });
cut('medal', { a: 5.4, b: 6.5, sp: 1.3 });
// the cost: the card, Max's show
cut('card', { a: 0, b: 1.05, sp: 1.2 }); cut('card', { a: 1.05, b: 2.4, sp: 1.25 }); cut('card', { a: 2.4, b: 3.5, sp: 1.3 });
cut('showR', { sp: 1.3 });
cut('showL', { a: 0, b: 1.4, sp: 1.3 }); cut('showL', { a: 1.4, b: 2.0, sp: 1.2, cam: [2.0, 1240, 560] }); cut('showL', { a: 2.0, b: 3.6, sp: 1.3 });
cut('showL', { a: 3.6, b: 4.8, sp: 1.3 }); cut('showL', { a: 4.8, b: 6.4, sp: 1.1, cam: [1.45, 760, 560] });
blink();
// the worst: his own monster on the prize
cut('worst', { a: 0, b: 1.8, sp: 1.3 }); cut('worst', { a: 1.8, b: 4.0, sp: 1.3 }); cut('cover', { sp: 1.2 }); cut('wide', { sp: 1.1 });
// the turn
cut('wrench', { a: 0, b: 1.4, sp: 1.2 }); cut('wrench', { a: 1.4, b: 3.0, sp: 1.2 });
cut('eyes', { a: 0, b: 1.0, sp: 1.2 }); cut('eyes', { a: 1.0, b: 2.2, sp: 1.0 }); cut('eyes', { a: 2.2, b: 4.0, sp: 1.15 });
cut('hand', { a: 0, b: 1.2, sp: 1.3 }); cut('hand', { a: 1.2, b: 2.8, sp: 1.2 });
cut('slam', { a: 0, b: 1.0, sp: 1.2 }); cut('slam', { a: 1.0, b: 2.4, sp: 1.25 });
blink();
// one page a day
cut('page1', { a: 0, b: 1.5, sp: 1.3 }); cut('page1', { a: 1.5, b: 2.9, sp: 1.3, cam: [1.6, 360, 520] }); cut('page1', { a: 2.9, b: 4.3, sp: 1.3 });
cut('page40', { a: 0, b: 1.5, sp: 1.3 }); cut('page40', { a: 1.5, b: 2.6, sp: 1.2 }); cut('page40', { a: 2.6, b: 3.5, sp: 1.2, cam: [2.0, 470, 470] }); cut('page40', { a: 3.5, b: 5.0, sp: 1.3 });
cut('board40', { sp: 1.2 }); cut('down40', { sp: 1.3 });
cut('door', { a: 0, b: 1.6, sp: 1.3 }); cut('door', { a: 1.6, b: 2.9, sp: 1.3, cam: [2.0, 1140, 520] }); cut('door', { a: 2.9, b: 4.0, sp: 1.2 });
cut('door', { a: 4.0, b: 5.0, sp: 1.2, cam: [1.8, 460, 680] }); cut('door', { a: 5.0, b: 6.5, sp: 1.3 });
cut('stitch', { a: 0, b: 2.0, sp: 1.3 }); cut('stitch', { a: 2.0, b: 5.0, sp: 1.15 });
// the last picture, the title
cut('last', { a: 0, b: 2.4, sp: 1.2 }); cut('last', { a: 2.4, b: 3.6, sp: 1.1, cam: [1.7, 960, 500] }); cut('last', { a: 3.6, b: 5.4, sp: 1.1 }); cut('last', { a: 5.4, b: 7.0, sp: 1.0 });
cut('title', { sp: 1.0 });
