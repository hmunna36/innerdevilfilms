
// =====================================================================================================
// THE PICTURES
// =====================================================================================================
function backdropA(top, bot, floorY, floorCol) {
  rectf(0, 0, W, H, lg(0, 0, 0, H, [[0, top], [1, bot]]));
  if (floorY) { rectf(0, floorY, W, H - floorY, lg(0, floorY, 0, H, [[0, floorCol], [1, darken(floorCol, .5)]])); }
}
const shadowOn = (x, y, rx, a = .4) => oval(x, y, rx, rx * .16, `rgba(8,6,16,${a})`);
const STILLS = {
  cast: t => {
    backdropA([62, 74, 104], [36, 38, 62], 800, [72, 62, 80]);
    glow([255, 196, 140], 520, 250, 900, .3); glow([120, 150, 255], 1700, 300, 700, .14);
    const G = 800, L = { light: -1, rim: [150, 190, 255] };
    // the giant: only its head and one shoulder fit in the picture
    const gb = [[1470, 900], [1500, 520], [1640, 400], [1960, 380], [1960, 900]];
    blob(gb, rg(1640, 470, 40, 620, [[0, [206, 40, 40]], [.5, [140, 20, 34]], [1, [56, 6, 26]]]), .45);
    for (const [x, y, a2] of [[1528, 470, -.5], [1590, 420, -.3]]) at(x, y, 1, a2, () => taper([[0, 16], [0, -46]], [40, 2], rgba(mix(A.devS, A.devD, .5))));
    devilHead(1740, 330, 150, { age: 1, expr: 'grin', look: [-.8, .6], tilt: -.16, ...L, fed: 1 });
    [[330, 520], [560, 250]].forEach(([x, hh]) => shadowOn(x, G, hh * .26));
    person({ who: 'dad', x: 330, y: G, h: 520, expr: 'tired', age: 38, tie: 'loose', sleeves: 'rolled', look: [.3, 0], ...L });
    person({ who: 'lily', x: 560, y: G, h: 250, expr: 'smile', look: [-.3, -.3], ...L });
    shadowOn(840, G, 150); devil({ x: 850, y: G, h: 560, stage: 3, expr: 'charm', look: [-.5, .1], handL: [742, 556], elbow: [1, 1], handR: [985, 470], handPoseR: 'flat', handAngR: -.5, tail: [.34, -.2], ...L });
    shadowOn(1075, G, 70); devil({ x: 1075, y: G, h: 270, stage: 2, expr: 'sly', look: [-.4, 0], tail: [.36, -.3], ...L });
    shadowOn(1225, G, 44); devil({ x: 1225, y: G, h: 130, stage: 1, expr: 'happy', tail: [.4, -.4], ...L });
    devil({ x: 1322, y: G, h: 34, stage: 0, expr: 'sweet', tail: [.4, -.5], ...L });
    // the thumb-sized one, enlarged
    ctx.save(); ctx.beginPath(); ctx.arc(1330, 560, 150, 0, TAU); ctx.fillStyle = rg(1300, 520, 10, 160, [[0, [96, 104, 140]], [1, [44, 48, 78]]]); ctx.fill(); ctx.clip();
    devil({ x: 1330, y: 680, h: 230, stage: 0, expr: 'sweet', look: [-.3, -.2], tail: [.42, -.44], handL: [1262, 560], ...L }); ctx.restore();
    ctx.beginPath(); ctx.arc(1330, 560, 150, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke(); stroke([[1324, 762], [1326, 712]], 3, 'rgba(255,255,255,.5)');
    label('DAD, 38', 330, 850, 30); label('LILY, 6', 560, 850, 30); label('AGE 34', 840, 850, 30); label('31', 1075, 850, 30); label('26', 1225, 850, 30); label('AGE 21', 1340, 850, 30); label('AGE 38', 1740, 560, 30);
    rectf(0, 870, W, 210, lg(0, 870, 0, 900, [[0, [20, 20, 36], 0], [1, [20, 20, 36], .82]]));
    // faces
    ['charm', 'sly', 'plead', 'rage'].forEach((e, i) => { devilHead(1010 + i * 232, 968, 62, { age: [.75, .75, .5, 1][i], expr: e, ...L }); });
    ['laugh', 'tempted', 'horror'].forEach((e, i) => { humanHead(150 + i * 215, 962, 58, 'dad', { expr: e, age: i ? 38 : 21, ...L }); });
    humanHead(790, 968, 56, 'lily', { expr: 'fear', ...L });
    finish({ bloom: .22, grain: .03, vignette: .35 });
  },
  // AGE 21, the first one
  m1: t => {
    backdropA([120, 62, 44], [46, 22, 34]);
    // a party out of focus: a window, string lights, friends
    blurred(26, () => { rectf(1180, 60, 560, 520, rgba([40, 60, 110])); rectf(1440, 60, 14, 520, rgba([90, 50, 40])); rectf(1180, 300, 560, 12, rgba([90, 50, 40]));
      for (const [x, hh, c] of [[190, 620, [70, 36, 46]], [1560, 560, [80, 40, 44]], [1790, 640, [60, 30, 44]]]) { oval(x, 1080 - hh, 96, 112, rgba(c)); blob([[x - 190, 1100], [x - 150, 1080 - hh + 150], [x, 1080 - hh + 96], [x + 150, 1080 - hh + 150], [x + 190, 1100]], rgba(c), .4); } });
    bokeh(3, 26, [0, 30, W, 420], [[255, 190, 110], [255, 140, 90], [255, 220, 170], [120, 210, 200]], 24, 64, .5, t);
    glow([255, 170, 90], 420, 260, 900, .34);
    const L = { light: -1, rim: A.hot };
    const gx = 1392, gy = 842, gs = 372, rimY = gy - gs;
    // Dad, 21, delighted
    const d = person({ who: 'dad', x: 700, y: 2520, h: 2300, age: 21, expr: 'laugh', turn: .3, look: [.95, .1], tilt: .07, tie: 'none', shirt: [58, 150, 142], shirtS: [26, 62, 92], handR: [gx - 60, gy - 96], handPoseR: 'fist', handAngR: -1.2, noLegs: true, elbow: [1, 1], ...L });
    additive(() => { glow(A.hot, d.head[0] + 190, d.head[1] + 40, 300, .32); });            // its light on his face
    // the glass, his fingers round it
    glassA(gx, gy, gs, .74, .1);
    for (let i = 0; i < 4; i++) { const y = gy - 66 - i * 47; taper([[gx - 172, y + 8], [gx - 70, y - 6], [gx + 10 - i * 8, y + 2]], [46, 44, 34], lg(0, y - 22, 0, y + 24, [[0, mix(A.skinL, A.skin, .5)], [1, mix(A.skin, A.skinS, .45)]])); oval(gx + 6 - i * 8, y + 1, 13, 11, rgba(A.skinL, .55)); }
    // foam it climbed out of, and the newborn on the rim
    for (const [x, y, r] of [[gx - 110, rimY + 8, 34], [gx - 50, rimY - 6, 40], [gx + 130, rimY + 6, 30], [gx + 96, rimY + 30, 26]]) disc(x, y, r, 'rgba(255,250,236,.97)');
    const dv = devil({ x: gx + 10, y: rimY + 4, h: 300, stage: 0, expr: 'happy', look: [-.9, -.05], tilt: -.12, sit: true, sitDir: -1, handL: [gx - 150, rimY - 170], handR: [gx + 150, rimY - 150], handPoseL: 'flat', handPoseR: 'flat', tail: [.42, -.42], turn: -1, fed: .5, ...L, rim: [255, 220, 170] });
    disc(dv.head[0] + 44, dv.head[1] - 150, 22, 'rgba(255,250,236,.97)'); disc(dv.head[0] + 70, dv.head[1] - 138, 14, 'rgba(255,250,236,.97)');   // foam on its head
    additive(() => glow(A.hot, gx, rimY - 120, 420, .2));
    stamp('AGE 21', 'his first'); words('kind', 'You\u2019re funnier with me.', 990);
    finish({ bloom: .26, grain: .035, t });
  },
  // AGE 34, the best friend
  m2: t => {
    backdropA([78, 48, 32], [26, 18, 26]);
    blurred(20, () => { for (let r = 0; r < 2; r++) { rectf(0, 250 + r * 250, W, 16, rgba([60, 34, 22]));
      for (let i = 0; i < 16; i++) { const x = 40 + i * 124 + r * 50, hh = 150 + rnd(i * 3 + r) * 50; rectf(x, 250 + r * 250 - hh, 46, hh, rgba([[214, 130, 40], [60, 130, 120], [150, 70, 30], [220, 170, 90]][(i + r) % 4], .8)); rectf(x + 14, 250 + r * 250 - hh - 44, 18, 46, rgba([180, 120, 60], .7)); } } });
    bokeh(9, 18, [0, 40, W, 520], [[255, 180, 90], [255, 214, 140], [110, 200, 190]], 20, 56, .3, t);
    cone(640, -40, 120, 640, 1000, [255, 196, 120], .24); glow([255, 180, 100], 640, 120, 700, .28);
    const L = { light: -1, rim: [255, 150, 70] }, SH = { shirt: [240, 222, 198], shirtS: [150, 108, 112] }, DSH = { shirt: [232, 200, 184], shirtS: [140, 84, 96] };
    // the devil, his size, in his shirt and tie, leaning in to his ear
    const dv = devil({ x: 1170, y: 1672, h: 1460, stage: 3, cloth: 'shirt', expr: 'charm', look: [-.95, .25], lean: -.085, tilt: -.12, noLegs: true, noArms: true, noTail: true, fed: .7, ...DSH, ...L });
    // its sleeve behind his neck
    taper([[dv.shL[0] + 30, dv.shL[1] + 20], [700, 640], [470, 668]], [150, 120, 104], rgba(mix(DSH.shirt, DSH.shirtS, .5)));
    // Dad
    const d = person({ who: 'dad', x: 640, y: 1716, h: 1500, age: 38, expr: 'tempted', turn: .3, look: [.5, .9], tilt: .05, tie: 'loose', sleeves: 'rolled', noLegs: true, noArms: true, ...SH, ...L });
    additive(() => glow(A.hot, d.head[0] + 170, d.head[1] + 20, 260, .26));
    // its hand hangs over his far shoulder
    taper([[d.shL[0] + 6, d.shL[1] - 34], [d.shL[0] - 26, d.shL[1] + 8]], [104, 104], rgba(mix(DSH.shirt, DSH.shirtS, .3)));
    hand(d.shL[0] - 30, d.shL[1] + 20, 1.75, 72, { col: A.dev, colS: A.devD, claw: 1, fingers: 3, pose: 'open', len: 1.15 });
    // its other arm comes round from the right and tips the bottle over his glass
    taper([[1600, 960], [1380, 760], [1190, 672]], [150, 124, 100], lg(1190, 0, 1600, 0, [[0, DSH.shirt], [1, mix(DSH.shirt, DSH.shirtS, .6)]]));
    taper([[1250, 700], [1190, 672]], [106, 104], rgba(mix(DSH.shirt, DSH.shirtS, .45)));
    stroke([[934, 742], [900, 790], [880, 880]], 9, rgba([250, 176, 50], .92));
    at(1212, 628, 1, -1.99, () => bottleA(0, 0, 330, { fill: .62, col: [30, 96, 70], alpha: .78 }));
    hand(1196, 664, -2.8, 76, { col: A.dev, colS: A.devD, claw: 1, fingers: 3, pose: 'grip', len: 1.1 });
    rectf(0, 930, W, 150, lg(0, 930, 0, 1080, [[0, [96, 54, 30]], [.1, [62, 34, 22]], [1, [26, 14, 14]]])); rectf(0, 930, W, 6, rgba([255, 200, 130], .5));
    additive(() => { ctx.save(); ctx.translate(900, 942); ctx.scale(1, .1); glow([255, 190, 110], 0, 0, 800, .3); ctx.restore(); });
    glassA(872, 934, 176, .4);
    stamp('AGE 34'); words('kind', 'One more. You earned it.', 1012, 66);
    finish({ bloom: .16, grain: .035, t });
  },
  // AGE 38, his chair
  m3: t => {
    backdropA([74, 94, 100], [44, 48, 66], 800, [74, 54, 52]);
    for (let i = 0; i < 14; i++) { const x = 60 + i * 100, y = 70 + Math.sin(i / 13 * Math.PI) * 54; poly([[x, y], [x + 72, y + 4], [x + 36, y + 86]], rgba([[70, 190, 200], [236, 110, 150], [240, 240, 236], [120, 110, 220]][i % 4])); }
    curve([[40, 66], [700, 130], [1440, 70]], 4, 'rgba(240,240,240,.7)');
    for (const [x, y, c] of [[96, 470, [70, 190, 200]], [200, 400, [236, 110, 150]], [330, 450, [120, 110, 220]]]) { stroke([[x, y + 70], [x + 10, 800]], 2.5, 'rgba(240,240,240,.5)'); oval(x, y, 56, 70, rgba(c)); oval(x - 18, y - 24, 12, 20, 'rgba(255,255,255,.4)'); }
    const L = { light: -1, rim: [255, 190, 120] };
    glow(A.dev, 1300, 420, 1200, .4);
    // ---- the giant, bent under the ceiling, in his chair ----
    const body = [[800, 520], [900, 250], [1130, 90], [1440, 20], [1760, 110], [1930, 380], [1960, 860], [760, 860]];
    const bPath = () => blobPath(body, .45, true);
    taper([[1800, 700], [1980, 520], [1900, 200], [1700, 250]], [70, 56, 36, 18], lg(1800, 700, 1700, 250, [[0, A.devS], [.7, A.dev], [1, A.hot]]));     // its tail curls behind
    bPath(); ctx.fillStyle = rg(1040, 260, 60, 1100, [[0, [206, 40, 40]], [.45, [140, 20, 34]], [1, [56, 6, 26]]]); ctx.fill();
    inside(bPath, () => {
      additive(() => glow(A.hot, 1290, 700, 420, .9));                                                                                 // the furnace
      blob([[1290, 470], [1400, 640], [1340, 800], [1290, 860], [1236, 800], [1180, 640]], rg(1290, 690, 0, 230, [[0, A.hotL], [.5, A.hot], [1, mix(A.hot, A.dev, .6)]]), .5);
      for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) taper([[1290 + sd * 110, 560 + i * 86], [1290 + sd * 230, 536 + i * 86], [1290 + sd * 330, 556 + i * 86]], [22, 14, 1], rgba(A.hot, .8));
      oval(1520, 330, 330, 210, rgba([60, 6, 26], .34)); oval(1010, 520, 150, 190, rgba([60, 6, 26], .3));                                    // the hollows under its shoulders
      ctx.save(); ctx.lineWidth = 26; ctx.strokeStyle = lg(1100, 0, 800, 0, [[0, [255, 190, 120], 0], [1, [255, 190, 120], .8]]); bPath(); ctx.stroke(); ctx.restore();
    });
    for (const [x, y, a2] of [[905, 250, -.5], [985, 172, -.36], [1075, 112, -.24], [1700, 82, .3], [1790, 140, .46]]) at(x, y, 1, a2, () => taper([[0, 22], [0, -62]], [50, 2], rgba(mix(A.devS, A.devD, .5))));   // spines
    // its arms come down onto the table
    const armG = (sh, el, wr, far) => { taper([sh, el, wr], [230, 170, 120], lg(sh[0], sh[1] - 100, wr[0], wr[1] + 60, [[0, far ? [150, 22, 34] : [214, 44, 40]], [1, far ? [80, 10, 28] : [128, 16, 32]]]));
      ctx.save(); ctx.translate(-14, -22); taper([sh, el, wr], [50, 40, 26], rgba([255, 150, 110], .22)); ctx.restore(); };
    armG([1760, 330], [1840, 640], [1500, 760], true);
    hand(1486, 760, Math.PI - .06, 104, { col: mix(A.dev, A.devS, .4), colS: A.devD, claw: 1.1, fingers: 3, pose: 'flat', len: 1.2, flip: true });
    const hd = devilHead(1170, 372, 196, { age: 1, expr: 'grin', look: [-.9, .75], tilt: -.34, light: -1, rim: [255, 190, 120], fed: 1, aura: false, hat: [.98, -1.28, .95, .5] });
    armG([900, 420], [640, 590], [790, 752], false);
    // ---- the table, the cake, the bottle with Dad in it ----
    rectf(300, 786, 1700, 40, lg(0, 786, 0, 826, [[0, [232, 220, 210]], [1, [164, 144, 144]]])); rectf(300, 826, 1700, 300, lg(0, 826, 0, 1080, [[0, [200, 184, 180]], [1, [112, 98, 112]]]));
    additive(() => { ctx.save(); ctx.translate(1100, 794); ctx.scale(1, .07); glow(A.hot, 0, 0, 800, .5); ctx.restore(); });
    hand(800, 772, Math.PI + .1, 110, { col: A.dev, colS: A.devD, claw: 1.1, fingers: 3, pose: 'flat', len: 1.2 });       // its hand round the bottle
    const cx = 1110, cy = 786;
    rectf(cx - 150, cy - 96, 300, 96, lg(cx - 150, 0, cx + 150, 0, [[0, [252, 242, 238]], [1, [196, 176, 196]]])); oval(cx, cy - 96, 150, 22, rgba([255, 250, 246]));
    for (let i = 0; i < 9; i++) blob([[cx - 150 + i * 36, cy - 92], [cx - 132 + i * 36, cy - 60 - (i % 3) * 8], [cx - 114 + i * 36, cy - 92]], rgba([236, 110, 150]), .5);
    for (let i = 0; i < 6; i++) { const x = cx - 100 + i * 40, y = cy - 104 - (i % 2) * 5; rectf(x - 5, y - 46, 10, 46, rgba([[70, 190, 200], [240, 240, 236]][i % 2])); additive(() => glow([255, 200, 120], x, y - 62, 44, .8));
      blob([[x, y - 46], [x + 9, y - 58], [x - 5, y - 84 - 6 * Math.sin(t * 9 + i)], [x - 9, y - 58]], rgba([255, 236, 170]), .5); }
    bottleA(560, 786, 300, { fill: .1, cork: true, col: [150, 214, 190], inside: () => person({ who: 'dad', x: 560, y: 778, h: 168, age: 38, expr: 'horror', tie: 'loose', handL: [524, 668], handR: [596, 668], handPoseL: 'flat', handPoseR: 'flat', look: [-.7, .3], light: 1, rim: A.hot }) });
    // ---- Lily ----
    shadowOn(210, 1050, 110, .35);
    person({ who: 'lily', x: 210, y: 1050, h: 440, expr: 'fear', look: [.9, -.8], turn: .6, tilt: -.12, handL: [196, 846], handR: [236, 842], handPoseL: 'fist', handPoseR: 'fist', elbow: [-1, 1], light: 1, rim: [255, 120, 80] });
    stamp('AGE 38', 'her 6th birthday', 470, 210); words('real', 'THEY ONLY SEE YOU.', 986, 96);
    finish({ bloom: .16, grain: .035, t });
  }
};
