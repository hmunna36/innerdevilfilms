// Shared drawing kit for the DEVIL MODE films: helpers, extra poses, Bean/Devil wrappers, props, smoke,
// wall shadow, phone UI and on-screen lines. Bean, the Devil and the Angel follow Harshad's own sheets.
import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import type { Pose } from "../rig/figure";
import type { V2 } from "../rig/geom";
import { BEAN_EXPR, BeanExpr, BeanExprName, BeanSVG, DevilFace, DevilSVG, Smoke, beanHand, buildBean } from "../rig/bean";
import { SEAT, SIDE, TQ } from "../rig/beanPoses";
import { Chair } from "./desk";

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const k = (t: number, x: number[], y: number[]) => interpolate(t, x, y, CL);
export const sm = (u: number) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const P = (o: Record<string, unknown>) => o as unknown as Pose;
export const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const lerpColor = (a: string, b: string, u: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], Math.max(0, Math.min(1, u))))).join(",")})`;
};

// ------------------------------------------------------------------ poses
export const FLOOR_SIT = P({ t: 0.9, head: [46, -256], tilt: 24, top: [22, -178], bot: [0, -30], ws: 100, wh: 92,
  shL: [18, -166], elL: [44, -110], wrL: [84, -76], shR: [26, -164], elR: [50, -108], wrR: [92, -74],
  hpL: [-2, -26], knL: [42, -72], anL: [70, -24], hpR: [4, -24], knR: [48, -68], anR: [76, -22] });
export const SEAT_PHONE = P({ ...SEAT, head: [50, -318], tilt: 22, elR: [52, -196], wrR: [66, -240], elL: [40, -196], wrL: [58, -236] });
export const SEAT_RELIEF = P({ ...SEAT, head: [38, -330], tilt: -10, elR: [44, -176], wrR: [60, -130], elL: [34, -178], wrL: [52, -132] });
export const SEAT_RUB = P({ ...SEAT, head: [48, -320], tilt: 18, elR: [62, -214], wrR: [70, -282] });
export const SEAT_BACK = P({ ...SEAT, t: -0.7, tilt: 0 });
export const PHONE_HOLD = P({ ...SIDE, head: [16, -380], tilt: 16, elR: [30, -228], wrR: [52, -262] });
export const CARRY = { elR: [36, -232], wrR: [70, -236], elL: [28, -234], wrL: [62, -238] };
export const DEVIL_REACH = P({ ...TQ, head: [16, -384], tilt: 6, elR: [80, -252], wrR: [140, -238] });
export const DEVIL_LEAN = P({ ...TQ, head: [44, -360], tilt: 24, top: [16, -296], elR: [74, -250], wrR: [126, -236] });

export function ex(name: BeanExprName, t: number, o: { talk?: boolean; blink?: boolean; red?: number; closed?: boolean; lx?: number; ly?: number } = {}): BeanExpr {
  const e = { ...BEAN_EXPR[name] };
  if (o.talk) e.mo = Math.sin(t * 22) > 0.1 ? 1 : 0;
  if (o.closed) e.lid = 1.6;
  else if (o.blink ?? true) { const ph = (t * 0.31) % 1; if (ph > 0.965) e.lid = 1.6; }
  if (o.red) e.red = o.red;
  if (o.lx !== undefined) e.lx = o.lx;
  if (o.ly !== undefined) e.ly = o.ly;
  return e;
}

// ------------------------------------------------------------------ characters and props
export type Prop = "phone" | "laptop" | "box" | "notice" | null;
export type CharP = { pose: Pose; e: BeanExpr; x: number; y: number; s?: number; flip?: boolean; id: string; t: number;
  jitter?: number; typing?: boolean; seat?: boolean; prop?: Prop; lid?: number; op?: number; tear?: number; propLit?: number };
export const Char: React.FC<CharP> = ({ pose, e, x, y, s = 1.3, flip, id, t, jitter = 0, typing, seat, prop = null, lid = 1, op = 1, tear = 0, propLit = 1 }) => {
  let p = pose;
  const jt = (a: V2, sd: number, amp: number): V2 => [a[0] + Math.sin(t * 61 + sd) * amp, a[1] + Math.cos(t * 53 + sd) * amp];
  if (jitter) p = { ...p, wrR: jt(p.wrR, 1, jitter), wrL: jt(p.wrL, 2, jitter), elR: jt(p.elR, 3, jitter * 0.6) };
  if (typing) p = { ...p, wrR: [p.wrR[0], p.wrR[1] + Math.max(0, Math.sin(t * 26)) * 6], wrL: [p.wrL[0], p.wrL[1] + Math.max(0, Math.sin(t * 26 + 1.7)) * 6] };
  const h = beanHand(p);
  const fa = (Math.atan2(p.wrR[1] - p.elR[1], p.wrR[0] - p.elR[0]) * 180) / Math.PI;
  const th = mix(180, 80, lid);
  const glowOn = (prop === "phone" && propLit > 0.3) || (prop === "laptop" && lid > 0.5);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${flip ? -s : s},${s})`} opacity={op}>
      {seat && <Chair />}
      {glowOn && <circle cx={p.head[0] + 34} cy={p.head[1] + 30} r={95} fill="#bcd4ff" opacity={0.2} filter="url(#bb30)" />}
      <BeanSVG items={buildBean(p, e, { idp: id, view: p.t === 0 ? "front" : "side" })} />
      {tear > 0.01 && tear < 0.999 && (() => {
        // a single tear from the near eye (same eye maths as the face in rig/bean.tsx)
        const at = Math.abs(p.t), ex0 = 34 * at + 31 * (1 - 0.35 * at);
        return (
          <g transform={`translate(${p.head[0]},${p.head[1] - 6}) rotate(${p.tilt})`} opacity={Math.min(1, tear * 6) * (1 - Math.max(0, tear - 0.8) * 5)}>
            <path d={`M${ex0},${18 + tear * 44 - 9} C${ex0 + 4},${18 + tear * 44 - 3} ${ex0 + 6},${18 + tear * 44 + 2} ${ex0 + 6},${18 + tear * 44 + 5} A6,6 0 1 1 ${ex0 - 6},${18 + tear * 44 + 5} C${ex0 - 6},${18 + tear * 44 + 2} ${ex0 - 4},${18 + tear * 44 - 3} ${ex0},${18 + tear * 44 - 9} Z`}
              fill="#cfe7ff" stroke="#7fb4e6" strokeWidth={1.5} />
          </g>
        );
      })()}
      {prop === "phone" && (
        <g transform={`translate(${h[0].toFixed(1)},${h[1].toFixed(1)}) rotate(${(fa - 90).toFixed(1)})`}>
          <rect x={-13} y={-24} width={26} height={46} rx={6} fill="#121318" stroke="#2b2d35" strokeWidth={2} />
          <rect x={-10} y={-20} width={20} height={36} rx={3} fill="#15171c" />
          <rect x={-10} y={-20} width={20} height={36} rx={3} fill="#a9c8ff" opacity={0.9 * propLit} />
        </g>
      )}
      {prop === "notice" && (
        <g transform={`translate(${(h[0] + 6).toFixed(1)},${(h[1] - 8).toFixed(1)}) rotate(-8)`}>
          <rect x={-22} y={-30} width={44} height={56} rx={2} fill="#efe8d8" stroke="#bdb4a2" strokeWidth={1.5} />
          <rect x={-16} y={-24} width={32} height={6} fill="#c0392b" />
          <path d="M-16,-10 h32 M-16,-2 h32 M-16,6 h24 M-16,14 h28" stroke="#9c968a" strokeWidth={2} />
        </g>
      )}
      {prop === "box" && (
        <g transform={`translate(${(h[0] + 18).toFixed(1)},${(h[1] - 24).toFixed(1)})`}>
          <rect x={-42} y={-38} width={84} height={76} rx={4} fill="#a87b4f" stroke="#5e4128" strokeWidth={3} />
          <path d="M-42,-8 h84 M-10,-38 v30" stroke="#d9c49a" strokeWidth={6} />
        </g>
      )}
      {prop === "laptop" && (
        <g>
          <rect x={34} y={-202} width={100} height={9} rx={3} fill="#2c2f38" stroke="#14151a" strokeWidth={2} />
          <g transform={`translate(132,-200) rotate(${-th})`}>
            <rect x={0} y={-4} width={92} height={8} rx={3} fill="#2a2d35" stroke="#14151a" strokeWidth={2} />
          </g>
          {lid > 0.6 && <ellipse cx={132 + 46 * Math.cos((th * Math.PI) / 180) - 14} cy={-200 - 46 * Math.sin((th * Math.PI) / 180)} rx={26} ry={44} fill="#cfe0ff" opacity={0.35 * (lid - 0.6) * 2.5} filter="url(#bb6)" />}
        </g>
      )}
    </g>
  );
};

export type DevP = { pose: Pose; x: number; y: number; s?: number; flip?: boolean; op?: number; face?: DevilFace; id: string; t: number;
  glow?: number; lean?: number; horns?: number; rim?: string; fill?: string; detailOp?: number; smoke?: number };
export const DevilFig: React.FC<DevP> = ({ pose, x, y, s = 1.3, flip, op = 1, face = "mischievous", id, t, glow = 1, lean = 0, horns = 1, rim, fill, detailOp = 1, smoke = 1 }) => (
  <g opacity={op}>
    <g transform={`translate(${x.toFixed(1)},${(y + Math.sin(t * 2.2) * 6).toFixed(1)}) scale(${flip ? -s : s},${s}) rotate(${lean} 0 -160)`}>
      <DevilSVG items={buildBean(pose, BEAN_EXPR.neutral, { idp: id, devil: true, horns, devilFace: face, swirl: Math.sin(t * 1.5), view: pose.t === 0 ? "front" : "side" })}
        glow={glow} rim={rim} fill={fill} detailOp={detailOp} />
    </g>
    {smoke > 0.01 && <Smoke cx={x} cy={y - 40 * s} s={s} f={t * 30} amount={op * smoke} />}
  </g>
);

// the halo's shadow on the wall: a ring with two small forked tips (clue 1); horn = 1 makes them horns
export const WallShadow: React.FC<{ x: number; y: number; s: number; horn: number; red?: number; op: number; lit?: number }> = ({ x, y, s, horn, red = 0, op, lit = 0.35 }) => {
  const col = lerpColor("#000000", "#2a0302", red);
  const glow = lerpColor("#ffcc66", "#ff2d1f", red);
  const gid = `wsg${Math.round(x)}_${Math.round(y)}_${Math.round(s * 100)}`;
  // tips drawn at full-horn size, then squashed: a faint fork at horn ~0.35, true horns at 1, a plain ring at 0
  const tips = "M-44,-6 C-56,-50 -46,-98 -32,-104 C-34,-50 -28,-14 -18,-8 Z M44,-6 C56,-50 46,-98 32,-104 C34,-50 28,-14 18,-8 Z";
  const ts = Math.pow(Math.max(0, horn), 1.4);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={glow} stopOpacity={lit} />
          <stop offset="0.55" stopColor={glow} stopOpacity={lit * 0.45} />
          <stop offset="1" stopColor={glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={20} rx={200} ry={180} fill={`url(#${gid})`} />
      <g filter="url(#bb3)">
        <ellipse cx={0} cy={0} rx={46} ry={12} fill="none" stroke={col} strokeWidth={10} />
        {ts > 0.01 && <g transform={`translate(0,-6) scale(1,${ts.toFixed(3)}) translate(0,6)`}><path d={tips} fill={col} /></g>}
        <ellipse cx={0} cy={70} rx={46} ry={52} fill={col} opacity={0.85} />
      </g>
    </g>
  );
};

export const Paper: React.FC<{ x: number; y: number; r: number; s?: number; op?: number; title?: string; stamp?: boolean }> = ({ x, y, r, s = 1, op = 1, title, stamp }) => (
  <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${s})`} opacity={op}>
    <rect x={-40} y={-28} width={80} height={56} rx={2} fill="#efe8d8" stroke="#a89f8c" strokeWidth={1.5} />
    <rect x={-32} y={-21} width={64} height={7} fill="#c0392b" />
    <path d="M-32,-6 h64 M-32,3 h64 M-32,12 h46" stroke="#9c968a" strokeWidth={2.4} />
    {title && <text x={0} y={-14.2} fill="#fff" fontFamily="Avenir Next" fontWeight={800} fontSize={7} textAnchor="middle">{title}</text>}
    {stamp && <g transform="rotate(-14)"><rect x={-24} y={-11} width={48} height={22} rx={3} fill="none" stroke="#2fa35a" strokeWidth={3} />
      <text x={0} y={6} fill="#2fa35a" fontFamily="Avenir Next" fontWeight={800} fontSize={14} textAnchor="middle">PAID</text></g>}
  </g>
);

export const FLOOR_NOTES = [
  { x: 520, y: 980, r: -12 }, { x: 600, y: 1012, r: 8 }, { x: 860, y: 992, r: -4 }, { x: 950, y: 1022, r: 14 },
  { x: 450, y: 1030, r: 20 }, { x: 780, y: 1040, r: -18 }, { x: 1040, y: 985, r: 6 },
];
export const FloorNotes: React.FC<{ t: number; tDrop?: number; tremble?: number }> = ({ t, tDrop = 999, tremble = 0 }) => (
  <g>
    {FLOOR_NOTES.map((n, i) => {
      const dt = t - tDrop;
      if (dt > 0) {
        const vx = (n.x - 700) * 1.8 + (random(`nvx${i}`) - 0.5) * 700;
        const vy = -720 - random(`nvy${i}`) * 520;
        const x = n.x + vx * dt, y = n.y + vy * dt + 820 * dt * dt;
        return <Paper key={i} x={x} y={y} r={n.r + dt * (random(`nr${i}`) - 0.5) * 1100} s={1 + dt * 0.6} op={k(dt, [0, 1.0, 1.6], [1, 1, 0])} />;
      }
      const tr = tremble * Math.sin(t * 40 + i * 2) * 3;
      return <Paper key={i} x={n.x + tr * 0.4} y={n.y + tr} r={n.r + tr} />;
    })}
  </g>
);

// the bedside table: clock, medicine, and the drawer the phone goes into
export const Table: React.FC<{ t: number; clock: string; drawer?: number; buzz?: number; meds?: boolean }> = ({ t, clock, drawer = 0, buzz = 0, meds = true }) => (
  <g>
    <rect x={850} y={800} width={170} height={160} rx={6} fill="#15161b" stroke="#2b2d35" strokeWidth={3} />
    <rect x={862} y={828} width={146} height={drawer * 14} fill="#050507" />
    <rect x={862} y={828 + drawer * 14} width={146} height={46} rx={4} fill="#1d1f26" stroke="#30333c" strokeWidth={2} />
    <rect x={920} y={846 + drawer * 14} width={30} height={7} rx={3} fill="#3a3d47" />
    {buzz > 0.01 && <rect x={862} y={826} width={146} height={6} fill="#9fc3ff" opacity={buzz * (0.5 + 0.5 * Math.abs(Math.sin(t * 12)))} filter="url(#bb4)" />}
    <rect x={862} y={746} width={106} height={54} rx={7} fill="#0d0e12" stroke="#2b2d35" strokeWidth={3} />
    <text x={915} y={785} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={31}>{clock}</text>
    <text x={915} y={785} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={31} opacity={0.6} filter="url(#bb3)">{clock}</text>
    {meds && <g><rect x={978} y={768} width={34} height={32} rx={3} fill="#f1ece2" /><path d="M995,774 v20 M985,784 h20" stroke="#e0463a" strokeWidth={5} /></g>}
  </g>
);

export const smokePuffs = (n: number, seed: string, f: (i: number, ph: number) => { x: number; y: number; r: number; o: number }, red = 0.5) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const ph = random(`${seed}${i}`);
    const q = f(i, ph);
    if (q.o <= 0.01) continue;
    out.push(<circle key={`a${i}`} cx={q.x} cy={q.y} r={q.r} fill="#0b0506" opacity={q.o * 0.85} filter="url(#bb10)" />);
    if (red > 0) out.push(<circle key={`b${i}`} cx={q.x} cy={q.y} r={q.r * 0.9} fill="none" stroke="#ff2d1f" strokeWidth={3} opacity={q.o * red * 0.5} filter="url(#bb4)" />);
  }
  return out;
};
// smoke pouring under the door toward the camera
export const DoorSmoke: React.FC<{ t: number; amount: number }> = ({ t, amount }) => (
  <g>{smokePuffs(46, "ds", (i, r0) => {
    const ph = (t * 0.32 + r0) % 1;
    const sx = 800 + random(`dsx${i}`) * 370;
    return { x: sx + (sx - 985) * ph * 1.7 + Math.sin(t * 1.4 + i) * 22 * ph, y: 578 + ph * 540, r: 16 + ph * 130, o: amount * Math.min(1, ph * 7) * (1 - ph * 0.7) };
  }, 0.8)}</g>
);
// smoke flowing in along the floor from the left
export const FloorSmoke: React.FC<{ t: number; amount: number; reach: number }> = ({ t, amount, reach }) => (
  <g>{smokePuffs(40, "fs", (i, r0) => {
    const ph = (t * 0.28 + r0) % 1;
    const x = -150 + ph * (300 + 1200 * reach);
    return { x, y: 930 + Math.sin(t * 1.1 + i) * 30 + random(`fsy${i}`) * 90, r: 50 + random(`fsr${i}`) * 70, o: amount * Math.min(1, ph * 5) * (1 - ph * 0.5) };
  }, 0.7)}</g>
);
// a rising, turning column of smoke: where the Devil forms
export const Column: React.FC<{ t: number; x: number; y: number; amount: number; h?: number }> = ({ t, x, y, amount, h = 620 }) => (
  <g>{smokePuffs(44, "cl", (i, r0) => {
    const ph = (t * 0.42 + r0) % 1;
    const a = ph * 7 + i;
    return { x: x + Math.cos(a) * (50 + 70 * ph), y: y - ph * h, r: 46 + 40 * (1 - ph), o: amount * Math.min(1, ph * 6) * (1 - ph) };
  }, 0.9)}</g>
);
// smoke bursting outward: the Devil's smoke peeling away in the reveal
export const Burst: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const dt = t - t0;
  if (dt < 0 || dt > 2.4) return null;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 + random(`ba${i}`);
    const sp = 220 + random(`bs${i}`) * 260;
    const d = sp * (1 - Math.exp(-dt * 1.8));
    out.push(<circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.8} r={40 + dt * 30} fill="#0b0506" opacity={Math.max(0, 0.7 * (1 - dt / 2.4))} filter="url(#bb10)" />);
  }
  return <g>{out}</g>;
};
export const Rain: React.FC<{ t: number; amount?: number }> = ({ t, amount = 1 }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 150; i++) {
    const y = ((random(`ry${i}`) * 1300 + t * (1500 + random(`rv${i}`) * 500)) % 1300) - 120;
    const x = random(`rx${i}`) * 2200 - 140 - y * 0.18;
    out.push(<line key={i} x1={x} y1={y} x2={x - 11} y2={y + 58} stroke="#c8daff" strokeWidth={2} opacity={0.32 * amount} />);
  }
  return <g>{out}</g>;
};
export const Spark: React.FC<{ x: number; y: number; op: number }> = ({ x, y, op }) => (
  <g opacity={op}><circle cx={x} cy={y} r={22} fill="#ffd27a" opacity={0.5} filter="url(#bb6)" /><circle cx={x} cy={y} r={8} fill="#fff1cc" /></g>
);

// ------------------------------------------------------------------ on-screen lines and phone UI
export type Who = "angel" | "devil" | "bean";
export type Line = { t0: number; t1: number; who: Who; text: string; x: number; y: number; size?: number };
export const STY: Record<Who, React.CSSProperties> = {
  angel: { fontFamily: "Chalkboard SE", fontWeight: 400, fontSize: 52, color: "#ffd27a", textShadow: "0 2px 4px #000, 0 0 18px rgba(255,190,90,0.8)" },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 58, color: "#ff4a3a", textShadow: "0 2px 4px #000, 0 0 26px rgba(255,40,20,0.95)" },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 46, color: "#ffffff", textShadow: "0 2px 6px #000, 0 0 18px #000" },
};
export const LineView: React.FC<{ l: Line; t: number }> = ({ l, t }) => {
  const op = k(t, [l.t0, l.t0 + 0.2, l.t1 - 0.3, l.t1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const rate = l.who === "devil" ? 9 : 24;
  const typed = l.text.slice(0, Math.max(1, Math.floor((t - l.t0) * rate)));
  return <div style={{ position: "absolute", left: l.x - 520, width: 1040, top: l.y, textAlign: "center", opacity: op, ...STY[l.who], ...(l.size ? { fontSize: l.size } : {}) }}>{typed}</div>;
};
export const fade = (t: number, t0: number, t1: number) => k(t, [t0, t0 + 0.25, t1 - 0.3, t1], [0, 1, 1, 0]);
export const pop = (t: number, t0: number) => 0.9 + 0.1 * sm((t - t0) / 0.25);

export const NoticeCard: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const op = fade(t, t0, t1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 610, top: 170, width: 700, height: 760, background: "#efe8d8", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
      opacity: op, transform: `translate(${Math.sin(t * 13) * 1.6}px, ${Math.cos(t * 11) * 1.4}px) rotate(-3deg) scale(${pop(t, t0) * (1 + 0.04 * (t - t0))})`, fontFamily: "Avenir Next", color: "#2b2620", padding: 56, boxSizing: "border-box" }}>
      <div style={{ background: "#c0392b", color: "#fff", fontWeight: 800, fontSize: 50, letterSpacing: 4, textAlign: "center", padding: "18px 0" }}>FINAL RENT NOTICE</div>
      <div style={{ marginTop: 70, fontSize: 52, fontWeight: 700, textAlign: "center" }}>RENT DUE IN 30 DAYS</div>
      <div style={{ marginTop: 40, fontSize: 46, fontWeight: 800, textAlign: "center", color: "#c0392b", letterSpacing: 3 }}>UNPAID: VACATE</div>
      <div style={{ marginTop: 70, height: 14, background: "#cfc6b4", width: "90%" }} />
      <div style={{ marginTop: 22, height: 14, background: "#cfc6b4", width: "75%" }} />
      <div style={{ marginTop: 22, height: 14, background: "#cfc6b4", width: "82%" }} />
      <svg width={900} height={520} viewBox="0 0 900 520" style={{ position: "absolute", left: -100, top: 600, overflow: "visible" }}>
        {[[118, 1], [782, -1]].map(([hx, sd]) => (
          <g key={hx} transform={`translate(${hx},${110 + Math.sin(t * 7 + hx) * 1.5})`}>
            <path d={`M${-50 * sd},70 L${-80 * sd},420 L${70 * sd},420 L${54 * sd},70 Z`} fill="#1a1a1a" stroke="#1a1a1a" strokeWidth={10} strokeLinejoin="round" />
            <path d={`M${-50 * sd},70 L${-80 * sd},420 L${70 * sd},420 L${54 * sd},70 Z`} fill="#efe3cf" />
            <path d="M0,-38 C40,-38 64,-6 64,34 C64,74 36,100 0,100 C-36,100 -62,74 -62,34 C-62,-6 -40,-38 0,-38 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={6} />
            <path d={`M${-8 * sd},-60 C${18 * sd},-74 ${40 * sd},-58 ${38 * sd},-32 C${36 * sd},-10 ${12 * sd},-4 ${-6 * sd},-14 Z`} fill="#efe3cf" stroke="#1a1a1a" strokeWidth={5.5} strokeLinejoin="round" />
            <ellipse cx={20 * sd} cy={40} rx={30} ry={40} fill="#cfc4b3" opacity={0.6} />
          </g>
        ))}
      </svg>
    </div>
  );
};
// a text thread: each bubble arrives at its own time, with Mom "typing…" just before it
export const PhoneChat: React.FC<{ t: number; t0: number; t1: number; name: string; msg?: string; msgs?: [number, string][] }> = ({ t, t0, t1, name, msg, msgs }) => {
  const op = fade(t, t0, t1);
  if (op <= 0) return null;
  const list: [number, string][] = msgs ?? [[t0, msg ?? ""]];
  const shown = list.filter(([mt]) => t >= mt);
  const next = list.find(([mt]) => t < mt && t > mt - 0.7 && mt > t0 + 0.1);
  return (
    <div style={{ position: "absolute", left: 1180, top: 270, width: 620, padding: 26, borderRadius: 36, background: "rgba(16,17,22,0.95)", border: "2px solid #2e313b",
      boxShadow: "0 24px 70px rgba(0,0,0,0.7)", opacity: op, transform: `scale(${pop(t, t0)})`, fontFamily: "Avenir Next" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "#4b5a73", color: "#fff", fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{name[0]}</div>
        <div style={{ color: "#fff", fontSize: 34, fontWeight: 700 }}>{name}</div>
        <div style={{ color: "#8a8f9b", fontSize: 24, marginLeft: "auto" }}>now</div>
      </div>
      {shown.map(([mt, text], i) => {
        const a = sm((t - mt) / 0.22);
        return (
          <div key={i} style={{ marginTop: i ? 14 : 22, background: "#2a2e38", color: "#f2f2f2", fontSize: 36, lineHeight: 1.3, padding: "18px 26px", borderRadius: 26, borderTopLeftRadius: 8,
            opacity: a, transform: `translateY(${(1 - a) * 18}px) scale(${0.94 + 0.06 * a})`, transformOrigin: "0 0" }}>{text}</div>
        );
      })}
      {next && (
        <div style={{ marginTop: 14, display: "inline-flex", gap: 9, background: "#2a2e38", padding: "20px 24px", borderRadius: 26, borderTopLeftRadius: 8 }}>
          {[0, 1, 2].map((d) => <div key={d} style={{ width: 13, height: 13, borderRadius: 7, background: "#9aa0ab", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 9 - d * 0.9)) }} />)}
        </div>
      )}
    </div>
  );
};
export const MailCard: React.FC<{ t: number; t0: number; t1: number; ok: boolean; count?: number }> = ({ t, t0, t1, ok, count = 1 }) => {
  const op = fade(t, t0, t1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 1160, top: 260, width: 640, opacity: op, transform: `scale(${pop(t, t0)})`, fontFamily: "Avenir Next" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ marginTop: i ? 16 : 0, display: "flex", alignItems: "center", gap: 22, padding: "24px 28px", borderRadius: 24, background: "rgba(16,17,22,0.95)",
          border: `2px solid ${ok ? "#2fa35a" : "#b23a32"}`, boxShadow: "0 18px 50px rgba(0,0,0,0.6)", opacity: i < Math.floor((t - t0) * 4) + 1 ? 1 : 0 }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: ok ? "#2fa35a" : "#b23a32", color: "#fff", fontSize: 36, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✕"}</div>
          <div style={{ color: "#fff", fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>{ok ? "APPLICATION SENT" : "APPLICATION NOT SELECTED"}</div>
        </div>
      ))}
    </div>
  );
};
export const PayBanner: React.FC<{ t: number; t0: number; t1: number; amount: string; label: string; paid?: boolean; top?: number; left?: number }> = ({ t, t0, t1, amount, label, paid, top = 70, left = 560 }) => {
  const op = fade(t, t0, t1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left, top: top + (1 - sm((t - t0) / 0.25)) * -60, width: 800, display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: 30,
      background: "rgba(14,16,20,0.95)", border: "2px solid #2fa35a", boxShadow: "0 18px 60px rgba(0,0,0,0.7)", opacity: op, fontFamily: "Avenir Next" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2fa35a", color: "#fff", fontSize: 38, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{paid ? "✓" : "$"}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#8fd4a5", fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>{paid ? "PAID" : "PAYMENT RECEIVED"}</div>
        <div style={{ color: "#fff", fontSize: 34, fontWeight: 700 }}>{label}</div>
      </div>
      <div style={{ color: "#5be08a", fontSize: 54, fontWeight: 800 }}>{amount}</div>
    </div>
  );
};
export const LockBanner: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const op = fade(t, t0, t1);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 560, top: 80 + (1 - sm((t - t0) / 0.25)) * -60, width: 800, padding: "24px 30px", borderRadius: 30, background: "rgba(30,33,41,0.94)",
      boxShadow: "0 18px 60px rgba(0,0,0,0.7)", opacity: op, fontFamily: "Avenir Next" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: "#8fa37e", color: "#fff", fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
        <div style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>Ava</div>
        <div style={{ color: "#8a8f9b", fontSize: 22, marginLeft: "auto" }}>now</div>
      </div>
      <div style={{ marginTop: 12, color: "#f2f2f2", fontSize: 36 }}>Dinner tonight? I saved you a seat.</div>
    </div>
  );
};

export const fmt$ = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

// ------------------------------------------------------------------ his phone in his two hands, seen as he sees it (v7.1:
// Harshad asked for Mom's messages to appear on the phone when he looks at it)
export type ChatItem = { t: number; text: string; me?: boolean; sep?: boolean };
const POV_HAND = (cx: number, cy: number, sd: number, thumb: boolean) => thumb ? (
  <g transform={`translate(${cx},${cy}) scale(${sd},1)`}>
    <path d="M-34,-70 C-6,-86 26,-74 34,-40 C42,-6 30,30 6,40 C-18,48 -40,30 -44,0 C-48,-30 -50,-60 -34,-70 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={-4} cy={-10} rx={18} ry={26} fill="#cfc4b3" opacity={0.5} />
  </g>
) : (
  <g transform={`translate(${cx},${cy}) scale(${sd},1)`}>
    <path d="M-150,330 L-60,40 L70,40 L60,330 Z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth={12} strokeLinejoin="round" />
    <path d="M-150,330 L-60,40 L70,40 L60,330 Z" fill="#efe3cf" />
    <path d="M0,-120 C70,-120 112,-60 112,10 C112,84 64,130 0,130 C-64,130 -112,84 -112,10 C-112,-60 -70,-120 0,-120 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={7} />
    <ellipse cx={-30} cy={30} rx={50} ry={70} fill="#cfc4b3" opacity={0.6} />
  </g>
);
export const PhonePOV: React.FC<{ t: number; t0: number; t1: number; name: string; clock: string; items: ChatItem[]; typing?: [number, number][] }> = ({
  t, t0, t1, name, clock, items, typing = [] }) => {
  if (t < t0 || t >= t1) return null;
  const rise = sm((t - t0) / 0.22);
  const tx = Math.sin(t * 1.7) * 4, ty = Math.cos(t * 1.3) * 3 + (1 - rise) * 140, rot = -3 + Math.sin(t * 1.1) * 0.6;
  const shown = items.filter((m) => t >= m.t);
  const isTyping = typing.some(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1.12)`, transformOrigin: "960px 40px", fontFamily: "Avenir Next" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {POV_HAND(650, 1075, 1, false)}{POV_HAND(1270, 1075, -1, false)}
      </svg>
      <div style={{ position: "absolute", left: 690, top: 30, width: 540, height: 1200, borderRadius: 70, background: "linear-gradient(160deg, #23252c, #0d0e12)",
        border: "3px solid #34373f", boxShadow: "0 0 90px rgba(140,175,255,0.28), 0 30px 90px rgba(0,0,0,0.85)" }}>
        <div style={{ position: "absolute", left: 16, top: 16, width: 502, height: 1162, borderRadius: 56, background: "#0b0d12", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 191, top: 14, width: 120, height: 34, borderRadius: 17, background: "#000" }} />
          <div style={{ height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", color: "#fff", fontSize: 25, fontWeight: 700 }}>
            <span>{clock}</span>
            <span style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
              {[8, 12, 16, 20].map((h) => <span key={h} style={{ width: 5, height: h, background: "#fff", borderRadius: 1 }} />)}
              <span style={{ marginLeft: 10, width: 38, height: 18, border: "2px solid #fff", borderRadius: 5, padding: 2, boxSizing: "border-box" }}><span style={{ display: "block", width: "55%", height: "100%", background: "#fff", borderRadius: 2 }} /></span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 22px 18px", borderBottom: "1px solid #22252d" }}>
            <span style={{ color: "#3b82f6", fontSize: 58, lineHeight: "40px", marginTop: -8 }}>‹</span>
            <div style={{ width: 68, height: 68, borderRadius: 34, background: "#4b5a73", color: "#fff", fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{name[0]}</div>
            <div>
              <div style={{ color: "#fff", fontSize: 34, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
              <div style={{ color: "#8a8f9b", fontSize: 20, fontWeight: 600 }}>mobile</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px" }}>
            {shown.map((m, i) => {
              const a = m.t <= t0 ? 1 : sm((t - m.t) / 0.22);
              if (m.sep) return <div key={i} style={{ alignSelf: "center", color: "#8a8f9b", fontSize: 21, fontWeight: 600, margin: "6px 0", opacity: a }}>{m.text}</div>;
              return (
                <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 392, padding: "15px 22px", borderRadius: 30,
                  borderBottomLeftRadius: m.me ? 30 : 8, borderBottomRightRadius: m.me ? 8 : 30, background: m.me ? "#2f6fe0" : "#272b34", color: "#f4f5f7",
                  fontSize: 33, lineHeight: 1.27, fontWeight: 500, opacity: a, transform: `translateY(${(1 - a) * 26}px) scale(${0.92 + 0.08 * a})`,
                  transformOrigin: m.me ? "100% 100%" : "0 100%" }}>{m.text}</div>
              );
            })}
            {isTyping && (
              <div style={{ alignSelf: "flex-start", display: "flex", gap: 9, padding: "22px 24px", borderRadius: 30, borderBottomLeftRadius: 8, background: "#272b34" }}>
                {[0, 1, 2].map((d) => <div key={d} style={{ width: 13, height: 13, borderRadius: 7, background: "#9aa0ab", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - d * 0.9)) }} />)}
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 16, top: 16, width: 502, height: 1162, borderRadius: 56, background: "linear-gradient(125deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {POV_HAND(712, 968, 1, true)}{POV_HAND(1208, 968, -1, true)}
      </svg>
    </AbsoluteFill>
  );
};

