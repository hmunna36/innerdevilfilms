// The 5-second rig test (19 Oct 2026), the step ChatGPT asked for before any film.
// One take: Owen eyes the phone and picks it up; a wisp wakes in it; he sits and the Pull grows behind him;
// he turns his head to us and the Pull turns with him and gets his tuft (the stage-4 reveal); he slumps and
// the thread goes taut; he stands, puts the phone face down, the thread goes slack, lets go, and the Pull fades.
// What it checks: arm overlaps, hand contact on the phone, planted feet while sitting and standing,
// the tuft staying attached through a head turn, and the reveal reading in motion.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V2, add, sub, mul, lerp, lerpN } from "./rig/geom";
import { C, EXPR, ExprName, Hero, Pose, Shadow, SvgDefs, Wisp, buildFigure, lerpExpr, lerpPose, nearHand } from "./rig/figure";

const W = 1920, H = 1080, FY = 880, S = 1.15;
const ANCHOR_X = 760; // world x of Owen's near foot: it never moves

// ------------------------------------------------------------------ poses (figure-local, feet at y = 0, facing right)
const LEGS_STAND = { hpL: [-3, -144], knL: [-5, -82], anL: [-9, -26], hpR: [5, -144], knR: [7, -82], anR: [8, -26] } as const;
const LEGS_SEAT = { hpL: [-2, -92], knL: [62, -92], anL: [64, -26], hpR: [4, -90], knR: [68, -90], anR: [72, -26] } as const;
const P = (o: Record<string, unknown>) => o as unknown as Pose; // raw v5 skeleton; stretch() makes the v7 proportions

/** v8 proportions: legs 10% longer (the floor stays put), everything above the hips moves up by the same amount. */
const LEG = 1.1; // genre-standard proportions
function stretch(p: Pose): Pose {
  const hip = (p.hpL[1] + p.hpR[1]) / 2;
  const o: Record<string, unknown> = { ...p };
  for (const [key, v] of Object.entries(p)) {
    if (Array.isArray(v) && v.length === 2) {
      const [x, y] = v as V2;
      o[key] = (y >= hip ? [x, y * LEG] : [x, y + hip * (LEG - 1)]) as V2;
    }
  }
  return o as unknown as Pose;
}

const STAND = P({ t: 0.95, head: [12, -384], tilt: 10, top: [3, -300], bot: [0, -150], ws: 100, wh: 92,
  shL: [-3, -284], elL: [-5, -222], wrL: [2, -168], shR: [6, -283], elR: [12, -222], wrR: [20, -168], ...LEGS_STAND });
const REACH = P({ t: 0.95, head: [26, -372], tilt: 20, top: [12, -296], bot: [0, -150], ws: 100, wh: 92,
  shL: [8, -281], elL: [10, -222], wrL: [14, -168], shR: [16, -280], elR: [52, -236], wrR: [88, -178], ...LEGS_STAND });
const PHONE = P({ t: 0.95, head: [18, -380], tilt: 22, top: [4, -298], bot: [0, -150], ws: 100, wh: 92,
  shL: [0, -282], elL: [2, -222], wrL: [8, -170], shR: [8, -282], elR: [36, -232], wrR: [46, -262], ...LEGS_STAND });
const SEAT_PHONE = P({ t: 0.95, head: [46, -322], tilt: 20, top: [24, -244], bot: [0, -98], ws: 100, wh: 92,
  shL: [20, -230], elL: [30, -176], wrL: [50, -128], shR: [28, -228], elR: [56, -182], wrR: [64, -210], ...LEGS_SEAT });
const SEAT_TURN = P({ ...SEAT_PHONE, t: 0.08, head: [40, -328], tilt: 0, wrR: [62, -200] });
const SEAT_SLUMP = P({ t: 0.9, head: [76, -290], tilt: 38, top: [40, -232], bot: [0, -98], ws: 100, wh: 92,
  shL: [36, -218], elL: [52, -162], wrL: [76, -130], shR: [44, -216], elR: [60, -160], wrR: [86, -130], ...LEGS_SEAT });
const PUT = P({ ...REACH, tilt: 16 });
const DECIDED = P({ t: 0.55, head: [8, -392], tilt: -4, top: [3, -302], bot: [0, -150], ws: 108, wh: 98,
  shL: [-8, -286], elL: [-14, -224], wrL: [-12, -170], shR: [12, -285], elR: [18, -224], wrR: [22, -170],
  hpL: [-6, -144], knL: [-9, -82], anL: [-12, -26], hpR: [8, -144], knR: [11, -82], anR: [14, -26] });

// the Pull (legs are never drawn; its own poses)
const PULL_REACH = P({ ...STAND, tilt: 6, shL: [-3, -284], elL: [28, -252], wrL: [58, -244], shR: [6, -283], elR: [40, -250], wrR: [72, -238] });
const PULL_TURN = P({ ...PULL_REACH, t: 0.08, tilt: 0, head: [8, -388] });
const PULL_LOOM = P({ ...PULL_REACH, head: [20, -378], tilt: 18, shL: [0, -283], elL: [44, -264], wrL: [84, -236], shR: [8, -282], elR: [52, -262], wrR: [92, -230] });

type Key = { f: number; pose: Pose; expr: ExprName };
const OWEN: Key[] = [
  { f: 0, pose: stretch(STAND), expr: "neutral" },
  { f: 6, pose: stretch(STAND), expr: "tempted" },
  { f: 18, pose: stretch(REACH), expr: "tempted" },
  { f: 22, pose: stretch(REACH), expr: "tempted" },
  { f: 34, pose: stretch(PHONE), expr: "tempted" },
  { f: 40, pose: stretch(PHONE), expr: "tempted" },
  { f: 58, pose: stretch(SEAT_PHONE), expr: "tempted" },
  { f: 64, pose: stretch(SEAT_PHONE), expr: "tempted" },
  { f: 80, pose: stretch(SEAT_TURN), expr: "caught" },
  { f: 88, pose: stretch(SEAT_TURN), expr: "caught" },
  { f: 104, pose: stretch(SEAT_SLUMP), expr: "ashamed" },
  { f: 110, pose: stretch(SEAT_SLUMP), expr: "ashamed" },
  { f: 126, pose: stretch(PUT), expr: "decided" },
  { f: 132, pose: stretch(PUT), expr: "decided" },
  { f: 142, pose: stretch(DECIDED), expr: "decided" },
  { f: 150, pose: stretch(DECIDED), expr: "decided" },
];
const PULL: Key[] = [
  { f: 28, pose: stretch(PULL_REACH), expr: "smile" },
  { f: 64, pose: stretch(PULL_REACH), expr: "smile" },
  { f: 80, pose: stretch(PULL_TURN), expr: "smile" },
  { f: 90, pose: stretch(PULL_TURN), expr: "smile" },
  { f: 104, pose: stretch(PULL_LOOM), expr: "smile" },
  { f: 124, pose: stretch(PULL_REACH), expr: "smile" },
];

const REACH_S = stretch(REACH);
const SEAT_S = stretch(SEAT_PHONE);
const DT = FY + (nearHand(REACH_S).pos[1] + 12) * S; // desk top: just under his hand when he reaches
const SEAT_X = ANCHOR_X - SEAT_S.anR[0] * S + ((SEAT_S.hpL[0] + SEAT_S.hpR[0]) / 2) * S;
const SEAT_TOP = FY + ((SEAT_S.hpL[1] + SEAT_S.hpR[1]) / 2 + 15) * S; // under his hips when seated

const ease = Easing.inOut(Easing.cubic);
function sample(keys: Key[], f: number) {
  if (f <= keys[0].f) return { pose: keys[0].pose, expr: EXPR[keys[0].expr] };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const u = ease((f - a.f) / (b.f - a.f));
      return { pose: lerpPose(a.pose, b.pose, u), expr: lerpExpr(EXPR[a.expr], EXPR[b.expr], u) };
    }
  }
  const z = keys[keys.length - 1];
  return { pose: z.pose, expr: EXPR[z.expr] };
}
const k = (f: number, x: number[], y: number[], e = ease) =>
  interpolate(f, x, y, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

/** world point -> the Pull's local units (it is drawn translate(root) scale(sc) rotate(lean about 0,-160)). */
function toLocal(world: V2, root: V2, sc: number, leanDeg: number): V2 {
  const p: V2 = mul(sub(world, root), 1 / sc);
  const a = (-leanDeg * Math.PI) / 180, piv: V2 = [0, -160];
  const q = sub(p, piv);
  return add([q[0] * Math.cos(a) - q[1] * Math.sin(a), q[0] * Math.sin(a) + q[1] * Math.cos(a)], piv);
}

// ------------------------------------------------------------------ set (greyscale, recedes)
const Set: React.FC = () => {
  const pf = "#24252a", pl = "#3a3b42";
  const wx = 200, wy = 200, ww = 380, wh = 300;
  const blocks: React.ReactNode[] = [];
  let bx = wx + 6, seed = 5;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  while (bx < wx + ww - 10) {
    const bw = Math.min(34 + Math.floor(rnd() * 30), wx + ww - 6 - bx), bh = 60 + Math.floor(rnd() * 100);
    blocks.push(<rect key={`b${bx}`} x={bx} y={wy + wh - bh} width={bw} height={bh - 3} fill="#1b1c22" />);
    for (let yy = wy + wh - bh + 12; yy < wy + wh - 10; yy += 16)
      for (let xx = bx + 6; xx < bx + bw - 6; xx += 12)
        if (rnd() < 0.16) blocks.push(<rect key={`w${xx}-${yy}`} x={xx} y={yy} width={4} height={6} fill="#8b8f99" opacity={0.55} />);
    bx += bw + 4;
  }
  const seatX = SEAT_X, seatTop = SEAT_TOP;
  return (
    <g>
      <rect width={W} height={FY} fill="url(#wallG)" />
      <rect y={FY} width={W} height={H - FY} fill="#1a1b1f" />
      <path d={`M0,${FY} H${W}`} stroke={pl} strokeWidth={2} />
      <rect x={wx} y={wy} width={ww} height={wh} rx={10} fill="url(#skyG)" stroke={pl} strokeWidth={3} />
      {blocks}
      <path d={`M${wx + ww / 2},${wy} v${wh} M${wx},${wy + wh / 2} h${ww}`} stroke={pl} strokeWidth={3} />
      {/* desk, drawers, laptop (cool: the work he means to do) */}
      <rect x={812} y={DT} width={760} height={14} rx={3} fill="#2c2d33" stroke="#45474f" strokeWidth={2.5} />
      <path d={`M826,${DT + 14} V${FY} M1558,${DT + 14} V${FY}`} stroke={pl} strokeWidth={2.5} />
      <rect x={1372} y={DT + 14} width={186} height={FY - DT - 14} fill={pf} stroke={pl} strokeWidth={2.5} />
      <path d={`M1372,${DT + 82} h186`} stroke={pl} strokeWidth={2.5} />
      <rect x={1130} y={DT - 10} width={200} height={10} rx={3} fill="#2c2d33" stroke="#45474f" strokeWidth={2.2} />
      <path d={`M1140,${DT - 10} L1104,${DT - 160} L1160,${DT - 168} L1194,${DT - 12} Z`} fill="#aebbd2" stroke="#45474f" strokeWidth={2.2} />
      <path d={`M1114,${DT - 150} h36 M1118,${DT - 138} h40 M1122,${DT - 126} h26`} stroke="#7f8da6" strokeWidth={3} />
      {/* chair: its seat sits exactly under his hips when he is seated */}
      <g opacity={0.9}>
        <rect x={seatX - 46} y={seatTop} width={92} height={10} rx={3} fill={pf} stroke={pl} strokeWidth={2.5} />
        <path d={`M${seatX - 38},${seatTop + 10} V${FY} M${seatX + 38},${seatTop + 10} V${FY} M${seatX - 42},${seatTop} V${seatTop - 190}`} stroke={pl} strokeWidth={2.5} fill="none" />
        <rect x={seatX - 48} y={seatTop - 190} width={10} height={104} rx={3} fill={pf} stroke={pl} strokeWidth={2.5} />
      </g>
    </g>
  );
};

const Phone: React.FC<{ pos: V2; held: boolean; lit: boolean; ang: number }> = ({ pos, held, lit, ang }) => {
  const [x, y] = pos;
  if (!held) {
    return (
      <g>
        {lit && <ellipse cx={x} cy={DT} rx={120 * S} ry={20 * S} fill="url(#pool)" />}
        <rect x={x - 30 * S} y={DT - 8 * S} width={60 * S} height={8 * S} rx={3 * S} fill="#18191d" stroke="#45474f" strokeWidth={1.5} />
        {lit && <rect x={x - 26 * S} y={DT - 9 * S} width={52 * S} height={2.6 * S} rx={1.3} fill={C.amberHi} />}
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y}) rotate(${ang})`}>
      <ellipse cx={-30} cy={-20} rx={70} ry={60} fill={C.amber} opacity={lit ? 0.14 : 0} filter="url(#b24)" />
      <rect x={-12 * S} y={-22 * S} width={24 * S} height={44 * S} rx={5 * S} fill="#18191d" stroke={C.line} strokeWidth={2.5} />
      {lit && <rect x={-13.5 * S} y={-20 * S} width={3 * S} height={40 * S} rx={1.5} fill={C.amber} />}
    </g>
  );
};

// ------------------------------------------------------------------ the shot
export const RigTest: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Owen
  const o = sample(OWEN, f);
  const owenRoot: V2 = [ANCHOR_X - o.pose.anR[0] * S, FY]; // near foot planted
  const hand = nearHand(o.pose);
  const handWorld: V2 = add(owenRoot, mul(hand.pos, S));
  const reachHand = nearHand(REACH_S);
  const deskPhone: V2 = [ANCHOR_X - REACH_S.anR[0] * S + reachHand.pos[0] * S, DT - 5];

  // the phone: on the desk, in his hand from frame 22, face down on the desk from frame 130
  const held = f >= 22 && f < 130;
  const phonePos: V2 = held ? handWorld : deskPhone;
  const phoneLit = f < 130;
  const phoneAng = held ? lerpN(-12, 8, k(f, [22, 34], [0, 1])) : 0;
  const screen: V2 = held ? add(phonePos, [-12, -6]) : [deskPhone[0], DT - 9];

  // the Pull
  const pl = sample(PULL, Math.max(f, 28));
  const pullPose: Pose = { ...pl.pose };
  if (f >= 62 && f <= 96) { pullPose.t = o.pose.t; pullPose.tilt = o.pose.tilt * 0.6; } // it turns its head exactly as he does
  const sc = k(f, [28, 40, 62, 80, 104, 124], [0.3, 0.4, 0.85 * S, 1.0 * S, 1.06 * S, 1.0 * S]);
  const lean = k(f, [88, 104, 124], [0, 12, 4]);
  const kTo = k(f, [40, 62], [0, 1]);
  // stage 2 floats up-left of his head, clear of his silhouette (it is drawn behind him); stage 3+ stands behind him
  const stage2Anchor: V2 = [owenRoot[0] - 116, FY - 360];
  const owenAnchor: V2 = add(owenRoot, [-60 * S, -20]);
  const pullRoot: V2 = lerp(stage2Anchor, owenAnchor, kTo);
  const stage2Head: V2 = add(stage2Anchor, mul(stretch(PULL_REACH).head, 0.4));
  const tension = f < 88 ? 0.5 : f < 112 ? k(f, [88, 98], [0.5, 1]) : k(f, [112, 120], [1, 0]);
  const release = k(f, [120, 130], [0, 1]);
  const pullOpacity = k(f, [32, 40, 124, 138], [0, 1, 1, 0]);
  const reveal = k(f, [70, 80], [0, 1]); // it takes his eyes
  const glow = k(f, [28, 60, 76, 82, 96, 110, 122, 130], [0.5, 0.75, 0.8, 1.25, 1, 1.1, 0.8, 0]);
  const tailTo = toLocal(screen, pullRoot, sc, lean);
  const pullItems = buildFigure(pullPose, pl.expr, { idp: "pull", legs: false, reveal, tailTo, tension, release, contact: false });
  const owenItems = buildFigure(o.pose, o.expr, { idp: "owen" });

  // stage 1: the wisp wakes up in the phone, floats up to where stage 2 appears, and hands over to it
  const wispOp = k(f, [12, 20, 32, 40], [0, 1, 1, 0]);
  const wispSc = k(f, [12, 34], [0.25, 0.55]) * S;
  const wispPos: V2 = lerp(add(screen, [0, -4]), add(stage2Head, [0, 46]), k(f, [24, 38], [0, 1]));

  // embers only at the reveal
  const embers: React.ReactNode[] = [];
  if (f >= 76 && f <= 100) {
    for (let i = 0; i < 9; i++) {
      const ph = (i * 37) % 23, life = (f - 76 + ph) % 24;
      const ex = pullRoot[0] + 40 + ((i * 53) % 120) - 60, ey = pullRoot[1] - 420 * sc / S - life * 4;
      const a = Math.sin((life / 24) * Math.PI) * pullOpacity;
      embers.push(<circle key={i} cx={ex} cy={ey} r={2 + (i % 3)} fill={C.amberHi} opacity={a} />);
    }
  }

  const beats: [number, string][] = [
    [0, "stands, eyes the phone"], [14, "picks up the phone (hand contact)"], [36, "sits (feet planted)"],
    [60, "head turn"], [72, "the reveal: it turns with him and takes his eyes"], [90, "slumps, thread taut"],
    [110, "stands up, phone face down"], [118, "thread slack, then lets go"], [136, "hold"],
  ];
  const beat = [...beats].reverse().find(([bf]) => f >= bf)?.[1] ?? "";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <SvgDefs />
        <Set />
        {!held && <Phone pos={deskPhone} held={false} lit={phoneLit} ang={0} />}
        {/* the Pull stands behind him */}
        <g opacity={pullOpacity}>
          <g transform={`translate(${pullRoot[0].toFixed(1)},${pullRoot[1].toFixed(1)}) scale(${sc.toFixed(4)}) rotate(${lean.toFixed(2)} 0 -160)`}>
            <Shadow items={pullItems} glow={glow} />
          </g>
        </g>
        {wispOp > 0.01 && (
          <g opacity={wispOp} transform={`translate(${wispPos[0].toFixed(1)},${wispPos[1].toFixed(1)}) scale(${wispSc.toFixed(4)})`}>
            <Wisp />
          </g>
        )}
        <g transform={`translate(${owenRoot[0].toFixed(1)},${owenRoot[1]}) scale(${S})`}>
          <Hero items={owenItems} />
        </g>
        {held && <Phone pos={phonePos} held lit={phoneLit} ang={phoneAng} />}
        {embers}
        <rect width={W} height={H} fill="url(#vig)" />
        <text x={60} y={70} fill="#8d919b" fontFamily="Menlo" fontSize={22}>RIG TEST · Owen + the Pull</text>
        <text x={60} y={1030} fill="#ecebe4" fontFamily="Avenir Next" fontSize={30}>{beat}</text>
        <text x={1860} y={1030} fill="#8d919b" fontFamily="Menlo" fontSize={22} textAnchor="end">{`f ${String(f).padStart(3, "0")} · ${(f / fps).toFixed(2)} s`}</text>
      </svg>
    </AbsoluteFill>
  );
};
