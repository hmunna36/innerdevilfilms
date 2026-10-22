// Film 02 (JUST ONE MORE): his phone, seen from his eyes, held in his two hands. The screen shows what he sees:
// a feed of short videos with an autoplay ring ("Next video in 3"), Dad's texts, the alarm, the lock screen, a call,
// and, when the battery dies, the black glass with his own reflection in it (where the Devil is born).
// The screen is laid out in its own 508 x 1138 px; PhoneView places and scales the whole phone over the film frame.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BC, BEAN_EXPR, BeanDefs, BeanSVG, DevilSVG, buildBean } from "../rig/bean";
import type { BeanExpr } from "../rig/bean";
import { FRONT } from "../rig/beanPoses";
import { k, mix, sm } from "./kit";

export const SW = 508, SH = 1138; // the screen
const F = "Avenir Next";
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));

// ------------------------------------------------------------------ the phone in his hands
// x, y = where the phone's top centre sits in the 1920 x 1080 frame; s = its scale; thumb = the right thumb's target
// on the screen (screen px) and how far it has moved there (0 = resting on the edge, 1 = on the target)
export type Thumb = { x: number; y: number; u: number; press?: number };
const PW = 540, PH = 1170, IN = 16;
const Palm: React.FC<{ cx: number; cy: number; sd: number }> = ({ cx, cy, sd }) => (
  <g transform={`translate(${cx},${cy}) scale(${sd},1)`}>
    <path d="M-150,330 L-60,40 L70,40 L60,330 Z" fill={BC.line} stroke={BC.line} strokeWidth={12} strokeLinejoin="round" />
    <path d="M-150,330 L-60,40 L70,40 L60,330 Z" fill={BC.skin} />
    <path d="M0,-120 C70,-120 112,-60 112,10 C112,84 64,130 0,130 C-64,130 -112,84 -112,10 C-112,-60 -70,-120 0,-120 Z" fill={BC.skin} stroke={BC.line} strokeWidth={7} />
    <ellipse cx={-30} cy={30} rx={50} ry={70} fill={BC.shade} opacity={0.6} />
  </g>
);
const ThumbShape: React.FC<{ cx: number; cy: number; sd: number; rot?: number; press?: number }> = ({ cx, cy, sd, rot = 0, press = 0 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${sd * (1 - 0.06 * press)},${1 - 0.06 * press})`}>
    <path d="M-34,-70 C-6,-86 26,-74 34,-40 C42,-6 30,30 6,40 C-18,48 -40,30 -44,0 C-48,-30 -50,-60 -34,-70 Z" fill={BC.skin} stroke={BC.line} strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={-4} cy={-10} rx={18} ry={26} fill={BC.shade} opacity={0.5} />
  </g>
);
export const PhoneView: React.FC<{ t: number; x?: number; y?: number; s?: number; rise?: number; glow?: number; thumb?: Thumb; shake?: number;
  children: React.ReactNode; over?: React.ReactNode }> = ({ t, x = 960, y = 30, s = 1, rise = 1, glow = 1, thumb, shake = 0, children, over }) => {
  const tx = Math.sin(t * 1.7) * 4 + Math.sin(t * 61) * shake, ty = Math.cos(t * 1.3) * 3 + (1 - rise) * 160 + Math.cos(t * 53) * shake;
  const rot = -2.5 + Math.sin(t * 1.1) * 0.6;
  const L = x - PW / 2, T = y;
  // the right thumb: resting on the right edge near the bottom, or moved onto a point of the screen
  const rest: [number, number] = [L + PW - 52, T + 900];
  const tg: [number, number] = thumb ? [L + IN + thumb.x + 18, T + IN + thumb.y + 46] : rest;
  const u = thumb ? sm(thumb.u) : 0;
  const th: [number, number] = [mix(rest[0], tg[0], u), mix(rest[1], tg[1], u)];
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${s})`, transformOrigin: `${x}px ${y + 10}px` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Palm cx={L - 40} cy={T + 1045} sd={1} />
        <Palm cx={L + PW + 40} cy={T + 1045} sd={-1} />
      </svg>
      <div style={{ position: "absolute", left: L, top: T, width: PW, height: PH, borderRadius: 70, background: "linear-gradient(160deg, #23252c, #0d0e12)",
        border: "3px solid #34373f", boxShadow: `0 0 ${90 * glow}px rgba(140,175,255,${0.28 * glow}), 0 30px 90px rgba(0,0,0,0.85)` }}>
        <div style={{ position: "absolute", left: IN, top: IN, width: SW, height: SH, borderRadius: 56, background: "#000", overflow: "hidden" }}>
          {children}
          <div style={{ position: "absolute", left: 194, top: 14, width: 120, height: 34, borderRadius: 17, background: "#000" }} />
        </div>
        <div style={{ position: "absolute", left: IN, top: IN, width: SW, height: SH, borderRadius: 56, background: "linear-gradient(125deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <ThumbShape cx={L + 10} cy={T + 900} sd={1} />
        <ThumbShape cx={th[0]} cy={th[1]} sd={-1} rot={-28 * u} press={thumb?.press ?? 0} />
        {over}
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the status bar (screen px)
export const StatusBar: React.FC<{ clock: string; battery?: number; light?: boolean }> = ({ clock, battery = 0.55, light = true }) => {
  const c = light ? "#fff" : "#111";
  const low = battery < 0.2;
  return (
    <g>
      <text x={52} y={46} fill={c} fontFamily={F} fontWeight={700} fontSize={27}>{clock}</text>
      {[8, 12, 16, 20].map((h, i) => <rect key={h} x={350 + i * 9} y={42 - h} width={6} height={h} rx={1} fill={c} />)}
      <rect x={398} y={24} width={46} height={22} rx={6} fill="none" stroke={low ? "#ff3b30" : c} strokeWidth={2.4} />
      <rect x={446} y={31} width={3} height={8} rx={1} fill={low ? "#ff3b30" : c} />
      <rect x={401.5} y={27.5} width={Math.max(2.5, 39 * battery)} height={15} rx={3} fill={low ? "#ff3b30" : c} />
    </g>
  );
};

// ------------------------------------------------------------------ the feed: short videos, drawn in code
export type ClipKind = "cat" | "dominoes" | "slime" | "skate" | "study" | "dog";
export type Clip = { t0: number; kind: ClipKind; user: string; caption: string; likes: string };
const Cat: React.FC<{ u: number }> = ({ u }) => {
  // a cat taps a mug along the counter until it falls off ("WAIT FOR IT…")
  const push = k(u, [0.9, 1.25, 1.6, 1.9, 2.2], [0, 1, 0.2, 1, 0]);
  const slide = k(u, [1.15, 1.3, 1.85, 2.05], [0, 34, 34, 92]);
  const fall = Math.max(0, u - 2.05);
  const mx = 236 - slide - fall * 60, my = 640 + 900 * fall * fall, mr = -fall * 260;
  const wide = sm((u - 2.1) / 0.15);
  return (
    <g>
      <rect width={SW} height={SH} fill="#f2d7ad" />
      <rect y={150} width={SW} height={300} fill="#e9c995" />
      <rect x={60} y={200} width={170} height={170} rx={8} fill="#cfe7f2" stroke="#b18a5c" strokeWidth={10} />
      <path d="M145,205 V365 M65,285 H225" stroke="#b18a5c" strokeWidth={8} />
      <rect y={640} width={SW} height={SH - 640} fill="#8a5a3b" />
      <rect y={640} width={SW} height={22} fill="#a87149" />
      <rect x={0} y={640} width={150} height={SH} fill="#2a1a12" opacity={0} />
      {/* the counter's edge on the left: beyond it the floor far below */}
      <rect x={0} y={640} width={130} height={SH - 640} fill="#d9b98c" />
      <rect x={126} y={640} width={8} height={SH - 640} fill="#5e3b24" />
      {/* the mug */}
      <g transform={`translate(${mx},${my}) rotate(${mr})`}>
        <path d="M-44,-110 L44,-110 L38,0 L-38,0 Z" fill="#fbfbf7" stroke="#2a2a2a" strokeWidth={5} strokeLinejoin="round" />
        <rect x={-42} y={-80} width={84} height={18} fill="#e5483b" />
        <path d="M42,-90 C78,-88 78,-30 40,-28" fill="none" stroke="#2a2a2a" strokeWidth={10} />
        <path d="M42,-90 C78,-88 78,-30 40,-28" fill="none" stroke="#fbfbf7" strokeWidth={4} />
      </g>
      {/* the cat, peeking in from the right */}
      <g transform="translate(420,560)">
        <path d={`M-10,40 C${-60 - push * 70},${30 - push * 4} ${-110 - push * 120},${46} ${-128 - push * 130},${52}`} stroke="#2a2a2a" strokeWidth={40} strokeLinecap="round" fill="none" />
        <path d={`M-10,40 C${-60 - push * 70},${30 - push * 4} ${-110 - push * 120},${46} ${-128 - push * 130},${52}`} stroke="#f0953d" strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d="M-40,-60 L-60,-150 L10,-100 Z M60,-90 L80,-170 L120,-80 Z" fill="#f0953d" stroke="#2a2a2a" strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={40} cy={-30} rx={110} ry={92} fill="#f0953d" stroke="#2a2a2a" strokeWidth={6} />
        <path d="M-20,-70 C0,-80 20,-80 30,-70 M60,-75 C80,-85 100,-80 110,-70" stroke="#c4691f" strokeWidth={8} strokeLinecap="round" />
        {[0, 70].map((dx) => (
          <g key={dx}>
            <ellipse cx={-6 + dx} cy={-26} rx={16 + wide * 6} ry={20 + wide * 8} fill="#fff" stroke="#2a2a2a" strokeWidth={4} />
            <ellipse cx={-10 + dx} cy={-24} rx={6 + wide * 4} ry={14 + wide * 2} fill="#1a1a1a" />
          </g>
        ))}
        <path d="M18,12 l10,8 l10,-8" fill="none" stroke="#2a2a2a" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};
const Dominoes: React.FC<{ u: number }> = ({ u }) => {
  const cols = ["#ff5d5d", "#ffb340", "#ffe14d", "#5ad16f", "#4db8ff", "#8d6bff", "#ff6bd1"];
  const n = 26;
  return (
    <g>
      <rect width={SW} height={SH} fill="#1d2140" />
      <ellipse cx={254} cy={760} rx={330} ry={210} fill="#2a3060" />
      {Array.from({ length: n }).map((_, i) => {
        // a spiral of dominoes on the floor, falling one after another
        const a = i * 0.42, r = 230 - i * 6.5;
        const x = 254 + Math.cos(a) * r, y = 760 + Math.sin(a) * r * 0.55;
        const fallen = sm((u * 9 - i) / 1.4);
        return (
          <g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) skewX(${(-fallen * 62).toFixed(1)}) scale(1,${(1 - fallen * 0.55).toFixed(3)})`}>
            <rect x={-12} y={-74} width={24} height={74} rx={4} fill={cols[i % cols.length]} stroke="#0d0f20" strokeWidth={3} />
            <circle cx={0} cy={-52} r={3.4} fill="#fff" opacity={0.8} /><circle cx={0} cy={-22} r={3.4} fill="#fff" opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};
const Slime: React.FC<{ u: number }> = ({ u }) => {
  const press = 0.5 - 0.5 * Math.cos(u * 4.2);
  const w = 170 + press * 70, h = 130 - press * 55;
  return (
    <g>
      <rect width={SW} height={SH} fill="#c9f0e6" />
      <rect y={700} width={SW} height={SH - 700} fill="#9adbcb" />
      <ellipse cx={254} cy={700} rx={w + 30} ry={30} fill="#000" opacity={0.12} />
      <path d={`M${254 - w},700 C${254 - w},${700 - h * 1.2} ${254 + w},${700 - h * 1.2} ${254 + w},700 Z`} fill="#ff5fae" stroke="#c2357e" strokeWidth={6} />
      <ellipse cx={210} cy={700 - h * 0.7} rx={40} ry={16} fill="#fff" opacity={0.55} />
      <rect x={232} y={380 + (1 - press) * -60 + press * (130 - h)} width={44} height={230} rx={22} fill="#f6efe2" stroke="#2a2a2a" strokeWidth={5} />
    </g>
  );
};
const Skate: React.FC<{ u: number }> = ({ u }) => {
  const x = -120 + ((u * 260) % 760), flip = sm(((u * 260) % 760 - 330) / 120) * 360;
  return (
    <g>
      <rect width={SW} height={SH} fill="#ffd36b" />
      <path d={`M0,760 Q254,640 508,760 L508,${SH} L0,${SH} Z`} fill="#3a3f52" />
      <g transform={`translate(${x},700) rotate(${flip})`}>
        <rect x={-80} y={-14} width={160} height={20} rx={10} fill="#ff4d4d" stroke="#1a1a1a" strokeWidth={5} />
        <circle cx={-50} cy={14} r={14} fill="#f6efe2" stroke="#1a1a1a" strokeWidth={5} /><circle cx={50} cy={14} r={14} fill="#f6efe2" stroke="#1a1a1a" strokeWidth={5} />
      </g>
    </g>
  );
};
const Study: React.FC<{ u: number }> = ({ u }) => {
  // a cartoon tower of textbooks that grows, wobbles and topples (the video he watches instead of studying)
  const cols = ["#e5483b", "#3f6fb0", "#f5c04f", "#5e8a4f", "#8d6bff", "#ff8a3d", "#3fb0a8", "#e5483b", "#3f6fb0", "#f5c04f"];
  const n = Math.min(cols.length, Math.floor(u * 6) + 3);
  const tip = k(u, [1.6, 2.2], [0, 1]);
  return (
    <g>
      <rect width={SW} height={SH} fill="#fff4dc" />
      <rect y={840} width={SW} height={SH - 840} fill="#e8c995" />
      {/* a clock in the corner: midnight to morning in a second */}
      <g transform="translate(400,330)">
        <circle r={56} fill="#fff" stroke="#2a2a2a" strokeWidth={6} />
        <path d={`M0,0 L0,-40 M0,0 L${Math.sin(u * 9) * 30},${-Math.cos(u * 9) * 30}`} stroke="#2a2a2a" strokeWidth={6} strokeLinecap="round" />
      </g>
      <g transform={`translate(190,840) rotate(${tip * 18})`}>
        {Array.from({ length: n }).map((_, i) => (
          <g key={i} transform={`translate(${Math.sin(i * 1.7 + u * 3) * 6 * (1 + tip * 3)},${-i * 52})`}>
            <rect x={-110} y={-48} width={220} height={48} rx={6} fill={cols[i]} stroke="#2a2a2a" strokeWidth={5} />
            <rect x={-90} y={-30} width={120} height={8} rx={4} fill="#fff" opacity={0.7} />
          </g>
        ))}
      </g>
    </g>
  );
};
const Dog: React.FC<{ u: number }> = ({ u }) => {
  // a dog sits staring at the front door ("WAIT FOR IT…"); it opens, light pours in, and the dog bursts into happy spins
  const open = sm((u - 1.15) / 0.35);
  const spin = u > 1.35 ? (u - 1.35) * 900 : 0;
  const hop = u > 1.35 ? Math.abs(Math.sin((u - 1.35) * 9)) * 60 : 0;
  const wag = Math.sin(u * (u > 1.3 ? 40 : 14)) * (u > 1.3 ? 30 : 12);
  return (
    <g>
      <rect width={SW} height={SH} fill="#d9c7a8" />
      <rect y={760} width={SW} height={SH - 760} fill="#8c6a4a" />
      <rect y={760} width={SW} height={14} fill="#6e5238" />
      {/* the front door on the right, opening inward */}
      <rect x={300} y={330} width={180} height={430} fill={open > 0.02 ? "#fff3cf" : "#5b3d26"} />
      {open > 0.02 && <polygon points={`300,760 480,760 ${560 + 200 * open},${SH} ${200 - 200 * open},${SH}`} fill="#fff3cf" opacity={0.5 * open} />}
      <polygon points={`300,330 ${300 + 180 * (1 - open)},${330 - 20 * open} ${300 + 180 * (1 - open)},${760 + 30 * open} 300,760`} fill="#7a5233" stroke="#3b2516" strokeWidth={5} />
      <circle cx={300 + 160 * (1 - open)} cy={560} r={9} fill="#e8c46a" opacity={1 - open} />
      {/* the dog */}
      <g transform={`translate(190,${800 - hop}) rotate(${spin})`}>
        <path d={`M40,-10 C80,-30 ${90 + wag},-70 ${84 + wag},-90`} stroke="#2a2a2a" strokeWidth={22} strokeLinecap="round" fill="none" />
        <path d={`M40,-10 C80,-30 ${90 + wag},-70 ${84 + wag},-90`} stroke="#c98a4b" strokeWidth={14} strokeLinecap="round" fill="none" />
        <ellipse cx={0} cy={-40} rx={70} ry={58} fill="#c98a4b" stroke="#2a2a2a" strokeWidth={6} />
        <circle cx={0} cy={-120} r={52} fill="#c98a4b" stroke="#2a2a2a" strokeWidth={6} />
        <path d="M-46,-150 C-80,-140 -78,-90 -56,-82 C-44,-100 -40,-126 -46,-150 Z M46,-150 C80,-140 78,-90 56,-82 C44,-100 40,-126 46,-150 Z" fill="#8a5a30" stroke="#2a2a2a" strokeWidth={5} />
        {u > 1.3 && <path d="M-14,-96 Q0,-80 14,-96" fill="#e5483b" stroke="#2a2a2a" strokeWidth={3} />}
      </g>
    </g>
  );
};
const CLIPS: Record<ClipKind, React.FC<{ u: number }>> = { cat: Cat, dominoes: Dominoes, slime: Slime, skate: Skate, study: Study, dog: Dog };
// the autoplay ring small in a corner (it leaves the video's title readable)
export const CornerRing: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const a = sm((t - t0) / 0.2);
  if (a <= 0) return null;
  const left = Math.max(0, t1 - t), frac = clamp01(left / (t1 - t0)), C = 2 * Math.PI * 34;
  return (
    <g opacity={a} transform="translate(410,980)">
      <circle r={52} fill="#000" opacity={0.55} />
      <circle r={34} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={8} />
      <circle r={34} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
      <text y={12} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={900} fontSize={32}>{Math.max(1, Math.ceil(left - 1e-6))}</text>
    </g>
  );
};
const Heart: React.FC<{ x: number; y: number; on?: boolean }> = ({ x, y, on }) => (
  <path transform={`translate(${x},${y}) scale(1.5)`} d="M0,8 C-14,-2 -20,-10 -12,-17 C-7,-21 -2,-18 0,-14 C2,-18 7,-21 12,-17 C20,-10 14,-2 0,8 Z" fill={on ? "#ff3d5a" : "#fff"} stroke="#000" strokeOpacity={0.3} strokeWidth={1} />
);
// the autoplay ring: dims the video, a ring empties, "Next video in N" and a Cancel button
export const AutoRing: React.FC<{ t: number; t0: number; t1: number; dim?: number }> = ({ t, t0, t1, dim = 1 }) => {
  const a = sm((t - t0) / 0.2);
  if (a <= 0) return null;
  const left = Math.max(0, t1 - t), frac = clamp01(left / (t1 - t0));
  const n = Math.max(1, Math.ceil(left - 1e-6));
  const C = 2 * Math.PI * 92;
  return (
    <g opacity={a * dim}>
      <rect width={SW} height={SH} fill="#000" opacity={0.55} />
      <circle cx={254} cy={470} r={92} fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={14} />
      <circle cx={254} cy={470} r={92} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 254 470)" strokeLinecap="round" />
      <path d="M232,430 L292,470 L232,510 Z" fill="#fff" />
      <text x={254} y={640} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={800} fontSize={44}>Next video in {n}</text>
      <rect x={159} y={690} width={190} height={66} rx={33} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={3} />
      <text x={254} y={734} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={700} fontSize={30}>Cancel</text>
    </g>
  );
};
// a notification sliding down over whatever is on the screen
export const Banner: React.FC<{ t: number; t0: number; t1: number; from: string; lines: string[]; icon?: string }> = ({ t, t0, t1, from, lines, icon = "#34c759" }) => {
  const a = sm((t - t0) / 0.3) * (1 - sm((t - t1) / 0.3));
  if (a <= 0.001) return null;
  const h = 96 + lines.length * 44;
  return (
    <g transform={`translate(0,${(1 - a) * -(h + 60)})`}>
      <rect x={18} y={64} width={SW - 36} height={h} rx={34} fill="#2b2f39" opacity={0.97} />
      <rect x={42} y={88} width={56} height={56} rx={14} fill={icon} />
      <path d="M70,101 c-14,0 -20,7 -20,15 c0,5 3,9 8,11 l-3,8 l9,-5 c2,0 4,1 6,1 c14,0 20,-7 20,-15 c0,-8 -6,-15 -20,-15 z" fill="#fff" />
      <text x={116} y={128} fill="#fff" fontFamily={F} fontWeight={800} fontSize={34}>{from}</text>
      <text x={SW - 44} y={126} textAnchor="end" fill="#a6abb6" fontFamily={F} fontWeight={600} fontSize={24}>now</text>
      {lines.map((ln, i) => <text key={i} x={44} y={190 + i * 44} fill="#f2f4f8" fontFamily={F} fontWeight={600} fontSize={34}>{ln}</text>)}
    </g>
  );
};
// low1 = the time the "1% battery" card comes up over the video
export const Feed: React.FC<{ t: number; clips: Clip[]; clock: string; battery?: number; ring?: [number, number]; ringCorner?: boolean; liked?: number; low1?: number; flare?: number; children?: React.ReactNode }> = ({
  t, clips, clock, battery = 0.55, ring, ringCorner = false, liked = -1, low1, flare = 0, children }) => {
  const cur = [...clips].reverse().find((c) => t >= c.t0) ?? clips[0];
  const u = t - cur.t0;
  const C = CLIPS[cur.kind];
  const dur = ring ? Math.max(0.5, ring[0] - cur.t0) : 3;
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <BeanDefs />
      <C u={u} />
      <rect width={SW} height={240} fill="url(#feedTop)" />
      <rect y={SH - 330} width={SW} height={330} fill="url(#feedBot)" />
      <defs>
        <linearGradient id="feedTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.55} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
        <linearGradient id="feedBot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></linearGradient>
      </defs>
      <StatusBar clock={clock} battery={battery} />
      {/* the video's caption, big, in the middle of the top */}
      {cur.caption.split("\n").map((ln, i, a) => (
        <text key={i} x={254} y={(a.length > 1 ? 150 : 200) + i * 50} textAnchor="middle" fill="#fff" stroke="#000" strokeWidth={8} paintOrder="stroke" fontFamily={F} fontWeight={900}
          fontSize={Math.min(a.length > 1 ? 36 : 46, 700 / Math.max(...a.map((x) => x.length)))}>{ln}</text>
      ))}
      {/* the buttons on the right */}
      <Heart x={452} y={640} on={liked >= 0 && t > liked} />
      <text x={452} y={690} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={700} fontSize={22}>{cur.likes}</text>
      <path d="M432,740 h40 a12,12 0 0 1 12,12 v24 a12,12 0 0 1 -12,12 h-20 l-14,12 v-12 h-6 a12,12 0 0 1 -12,-12 v-24 a12,12 0 0 1 12,-12 z" fill="#fff" />
      <path d="M440,860 l40,-26 l-6,48 l-12,-14 z" fill="#fff" />
      <text x={36} y={SH - 128} fill="#fff" fontFamily={F} fontWeight={800} fontSize={30}>{cur.user}</text>
      <rect x={0} y={SH - 8} width={SW} height={8} fill="#fff" opacity={0.25} />
      <rect x={0} y={SH - 8} width={SW * clamp01(u / dur)} height={8} fill="#fff" />
      {ring && (ringCorner ? <CornerRing t={t} t0={ring[0]} t1={ring[1]} /> : <AutoRing t={t} t0={ring[0]} t1={ring[1]} />)}
      {flare > 0.01 && <rect width={SW} height={SH} fill="#fffaf0" opacity={flare} />}
      {low1 !== undefined && t >= low1 && (() => {
        const a = sm((t - low1) / 0.18);
        return (
          <g opacity={a} transform={`translate(254,560) scale(${0.85 + 0.15 * a}) translate(-254,-560)`}>
            <rect x={44} y={380} width={420} height={360} rx={44} fill="#1c1c22" opacity={0.95} stroke="#ff3b30" strokeWidth={4} />
            <rect x={164} y={420} width={150} height={64} rx={14} fill="none" stroke="#ff3b30" strokeWidth={8} />
            <rect x={318} y={438} width={10} height={28} rx={3} fill="#ff3b30" />
            <rect x={174} y={430} width={10} height={44} rx={3} fill="#ff3b30" />
            <text x={254} y={640} textAnchor="middle" fill="#ff3b30" fontFamily={F} fontWeight={900} fontSize={130}>1%</text>
            <text x={254} y={706} textAnchor="middle" fill="#e9eef7" fontFamily={F} fontWeight={700} fontSize={30}>Battery almost empty</text>
          </g>
        );
      })()}
      {children}
    </svg>
  );
};

// ------------------------------------------------------------------ the dead screen: black glass and his reflection
// refl = how visible his face is; devil = 0..1 the reflection becomes the Devil (red rim, horns, slit eyes, grin);
// halo = a gold halo over the reflected head; e = his expression
export const DeadGlass: React.FC<{ t: number; refl: number; devil?: number; eyes?: number; halo?: number; horns?: number; e?: BeanExpr; low?: number; red?: number }> = ({
  t, refl, devil = 0, eyes = 0, halo = 0, horns, e, low = 0, red = 0 }) => {
  const hx = 254, hy = 520, s = 1.85;
  const ex = e ?? { ...BEAN_EXPR.worried, ly: 2 };
  const hornAmt = horns ?? devil;
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <BeanDefs />
      <defs>
        <radialGradient id="dgRed" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#ff2d1f" stopOpacity={0.5} /><stop offset="1" stopColor="#ff2d1f" stopOpacity={0} /></radialGradient>
        <linearGradient id="dgGlare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.1} /><stop offset="0.4" stopColor="#fff" stopOpacity={0.02} /><stop offset="0.41" stopColor="#fff" stopOpacity={0} /><stop offset="1" stopColor="#fff" stopOpacity={0.04} /></linearGradient>
      </defs>
      <rect width={SW} height={SH} fill="#030305" />
      {red > 0.01 && <rect width={SW} height={SH} fill="url(#dgRed)" opacity={red} />}
      {/* his face, faint, in the glass */}
      <g opacity={refl * (1 - 0.85 * devil)} filter="url(#bb1)" style={{ mixBlendMode: "screen" }}>
        <g transform={`translate(${hx},${hy + 390 * s}) scale(${-s},${s})`} opacity={0.42}>
          <BeanSVG items={buildBean(FRONT, ex, { idp: "refl", headOnly: true })} />
        </g>
      </g>
      {/* the Devil taking its place, his own head's shape */}
      {devil > 0.01 && (
        <g transform={`translate(${hx},${hy + 390 * s}) scale(${-s},${s})`} opacity={sm(devil * 1.4)}>
          <DevilSVG items={buildBean(FRONT, BEAN_EXPR.neutral, { idp: "rdev", devil: true, headOnly: true, horns: hornAmt, devilFace: "manipulative" })}
            glow={devil * 1.2} rim="#ff2d1f" fill="#050303" detailOp={eyes} />
        </g>
      )}
      {/* the halo over the reflected head */}
      {halo > 0.01 && (
        <g opacity={halo}>
          <ellipse cx={hx} cy={hy - 196 + Math.sin(t * 2) * 4} rx={78} ry={19} fill="none" stroke="#ffd27a" strokeWidth={10} />
          <ellipse cx={hx} cy={hy - 196 + Math.sin(t * 2) * 4} rx={78} ry={19} fill="none" stroke="#ffb84a" strokeWidth={22} opacity={0.45} filter="url(#bb6)" />
          <circle cx={hx} cy={hy} r={260} fill="#ffcc66" opacity={0.12} filter="url(#bb30)" />
        </g>
      )}
      <rect width={SW} height={SH} fill="url(#dgGlare)" />
      {low > 0.01 && <rect width={SW} height={SH} fill="#000" opacity={low} />}
    </svg>
  );
};

// ------------------------------------------------------------------ a text chat (HTML: bubbles wrap on their own)
export type ChatItem = { t: number; text: string; me?: boolean; sep?: boolean };
// drafts: what he types into the box (mode "type") or deletes from it ("del"), in order; it empties when he sends
export type Draft = { t0: number; t1: number; text: string; mode?: "type" | "del" };
export const draftAt = (t: number, drafts: Draft[], sentAt = 1e9) => {
  if (t >= sentAt) return "";
  const cur = [...drafts].reverse().find((d) => t >= d.t0);
  if (!cur) return "";
  const u = clamp01((t - cur.t0) / Math.max(0.01, cur.t1 - cur.t0));
  const n = Math.round(u * cur.text.length);
  return cur.mode === "del" ? cur.text.slice(0, cur.text.length - n) : cur.text.slice(0, n);
};
// Dad's avatar: his orange work vest
const VestIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 74 74">
    <circle cx={37} cy={37} r={37} fill="#4a5a73" />
    <path d="M18,74 L18,40 C18,30 26,26 30,24 L37,40 L44,24 C48,26 56,30 56,40 L56,74 Z" fill="#f07a24" stroke="#1a1a1a" strokeWidth={2.5} />
    <path d="M18,52 H56 M18,60 H56" stroke="#e8f0f0" strokeWidth={4} />
    <path d="M30,24 L37,40 L44,24" fill="none" stroke="#1a1a1a" strokeWidth={2.5} />
  </svg>
);
export const Chat: React.FC<{ t: number; name: string; clock: string; items: ChatItem[]; typing?: [number, number][]; drafts?: Draft[]; sentAt?: number; battery?: number; vest?: boolean }> = ({
  t, name, clock, items, typing = [], drafts = [], sentAt, battery = 0.55, vest = false }) => {
  const shown = items.filter((m) => t >= m.t);
  const isTyping = typing.some(([a, b]) => t >= a && t < b);
  const dtext = draftAt(t, drafts, sentAt);
  const dn = dtext.length;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0b0d12", fontFamily: F }}>
      <svg width={SW} height={70} style={{ position: "absolute", left: 0, top: 0 }}><StatusBar clock={clock} battery={battery} /></svg>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", alignItems: "center", gap: 18, padding: "6px 24px 18px", borderBottom: "1px solid #22252d" }}>
        <span style={{ color: "#3b82f6", fontSize: 62, lineHeight: "40px", marginTop: -8 }}>‹</span>
        {vest ? <VestIcon size={74} /> : <div style={{ width: 74, height: 74, borderRadius: 37, background: "#6b5a45", color: "#fff", fontSize: 36, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{name[0]}</div>}
        <div>
          <div style={{ color: "#fff", fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>{name}</div>
          <div style={{ color: "#8a8f9b", fontSize: 22, fontWeight: 600 }}>mobile</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 186, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 14, padding: "18px 22px" }}>
        {shown.map((m, i) => {
          const a = m.t <= 0 ? 1 : sm((t - m.t) / 0.22);
          if (m.sep) return <div key={i} style={{ alignSelf: "center", color: "#8a8f9b", fontSize: 24, fontWeight: 700, margin: "4px 0", opacity: a }}>{m.text}</div>;
          return (
            <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 410, padding: "16px 24px", borderRadius: 32,
              borderBottomLeftRadius: m.me ? 32 : 8, borderBottomRightRadius: m.me ? 8 : 32, background: m.me ? "#2f6fe0" : "#272b34", color: "#f4f5f7",
              fontSize: 40, lineHeight: 1.22, fontWeight: 600, opacity: a, transform: `translateY(${(1 - a) * 26}px) scale(${0.92 + 0.08 * a})`,
              transformOrigin: m.me ? "100% 100%" : "0 100%" }}>{m.text}</div>
          );
        })}
        {isTyping && (
          <div style={{ alignSelf: "flex-start", display: "flex", gap: 10, padding: "24px 26px", borderRadius: 32, borderBottomLeftRadius: 8, background: "#272b34" }}>
            {[0, 1, 2].map((d) => <div key={d} style={{ width: 15, height: 15, borderRadius: 8, background: "#9aa0ab", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - d * 0.9)) }} />)}
          </div>
        )}
      </div>
      {/* the text box at the bottom, with what he is typing */}
      <div style={{ position: "absolute", left: 22, right: 22, top: 900, minHeight: 74, borderRadius: 37, border: "2px solid #2e323c", padding: "14px 26px", boxSizing: "border-box",
        color: dn > 0 ? "#f4f5f7" : "#5d626e", fontSize: 36, fontWeight: 600, lineHeight: 1.25 }}>
        {dn > 0 ? dtext : "Message"}{dn > 0 && Math.sin(t * 16) > 0 ? "|" : ""}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ the alarm
export const Alarm: React.FC<{ t: number; time: string; label: string; snooze?: number; glow?: number }> = ({ t, time, label, snooze = -1, glow = 1 }) => {
  const pressed = snooze >= 0 && t >= snooze;
  const pulse = pressed ? 0 : 0.5 + 0.5 * Math.sin(t * 9);
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="alWall" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#3b2a5e" /><stop offset="1" stopColor="#120c22" /></linearGradient></defs>
      <rect width={SW} height={SH} fill="url(#alWall)" />
      <StatusBar clock={time} battery={0.12} />
      <text x={254} y={300} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={500} fontSize={150}>{time}</text>
      <text x={254} y={380} textAnchor="middle" fill="#ffd27a" fontFamily={F} fontWeight={800} fontSize={40} letterSpacing={1}>{label}</text>
      {!pressed && <circle cx={254} cy={560} r={70 + 26 * pulse} fill="#ff9f0a" opacity={0.25 * glow} />}
      <rect x={84} y={500} width={340} height={120} rx={60} fill={pressed ? "#7a5a20" : "#ff9f0a"} />
      <text x={254} y={578} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={800} fontSize={48}>{pressed ? "Snoozed" : "Snooze"}</text>
      <text x={254} y={820} textAnchor="middle" fill="#cfd3dc" fontFamily={F} fontWeight={700} fontSize={36}>Stop</text>
    </svg>
  );
};

// ------------------------------------------------------------------ the lock screen with notifications
// a lock-screen card; ring = a "Next video in N" countdown inside it; swipe = when it is swiped away to the left
export type Note = { t: number; from: string; lines: string[]; icon?: string; time?: string; ring?: [number, number]; swipe?: number; size?: number };
export const Lock: React.FC<{ t: number; time: string; date: string; notes: Note[]; battery?: number; wake?: number; charging?: number }> = ({ t, time, date, notes, battery = 0.3, wake = 1, charging = -1 }) => {
  let y = 380;
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="lkWall" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#24345e" /><stop offset="0.55" stopColor="#131b33" /><stop offset="1" stopColor="#0a0e1a" /></linearGradient></defs>
      <rect width={SW} height={SH} fill="url(#lkWall)" />
      <StatusBar clock="" battery={battery} />
      {charging >= 0 && t >= charging && <path transform={`translate(${452 - 4},20) scale(0.9)`} d="M14,0 L2,18 H11 L7,32 L20,12 H11 Z" fill="#34c759" />}
      <text x={254} y={150} textAnchor="middle" fill="#e9eef7" fontFamily={F} fontWeight={700} fontSize={30}>{date}</text>
      <text x={254} y={300} textAnchor="middle" fill="#f4f6fb" fontFamily={F} fontWeight={500} fontSize={150}>{time}</text>
      {notes.filter((n) => t >= n.t).map((n, i) => {
        const a = n.t <= 0 ? 1 : sm((t - n.t) / 0.25);
        const fs = n.size ?? 32;
        const h = 92 + n.lines.length * (fs + 10) + (n.ring ? 40 : 0);
        const yy = y; y += h + 16;
        const gone = n.swipe !== undefined ? sm((t - n.swipe) / 0.3) : 0;
        if (gone >= 1) { y -= (h + 16); return null; }
        return (
          <g key={i} opacity={a * (1 - gone)} transform={`translate(${-gone * 560},${(1 - a) * -24})`}>
            <rect x={22} y={yy} width={SW - 44} height={h} rx={30} fill="#30343f" opacity={0.95} />
            <rect x={44} y={yy + 22} width={50} height={50} rx={13} fill={n.icon ?? "#34c759"} />
            <text x={110} y={yy + 58} fill="#fff" fontFamily={F} fontWeight={800} fontSize={32}>{n.from}</text>
            <text x={SW - 44} y={yy + 56} textAnchor="end" fill="#a6abb6" fontFamily={F} fontWeight={600} fontSize={22}>{n.time ?? "now"}</text>
            {n.lines.map((ln, j) => <text key={j} x={44} y={yy + 112 + j * (fs + 10)} fill="#f2f4f8" fontFamily={F} fontWeight={600} fontSize={fs}>{ln}</text>)}
            {n.ring && (() => {
              const left = Math.max(0, n.ring[1] - t), frac = clamp01(left / (n.ring[1] - n.ring[0]));
              const C = 2 * Math.PI * 26, cy = yy + h - 44;
              return (
                <g>
                  <circle cx={70} cy={cy} r={26} fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={7} />
                  <circle cx={70} cy={cy} r={26} fill="none" stroke="#fff" strokeWidth={7} strokeDasharray={`${C * frac} ${C}`} transform={`rotate(-90 70 ${cy})`} strokeLinecap="round" />
                  <path d={`M62,${cy - 11} L80,${cy} L62,${cy + 11} Z`} fill="#fff" />
                  <text x={112} y={cy + 12} fill="#fff" fontFamily={F} fontWeight={800} fontSize={34}>Next video in {Math.max(1, Math.ceil(left - 1e-6))}</text>
                </g>
              );
            })()}
          </g>
        );
      })}
      <rect width={SW} height={SH} fill="#000" opacity={1 - wake} />
    </svg>
  );
};

// ------------------------------------------------------------------ a call
export const Call: React.FC<{ t: number; name: string; t0: number; connect: number }> = ({ t, name, t0, connect }) => {
  const on = t >= connect;
  const secs = Math.max(0, Math.floor(t - connect));
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="clWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3226" /><stop offset="1" stopColor="#14110c" /></linearGradient></defs>
      <rect width={SW} height={SH} fill="url(#clWall)" />
      <StatusBar clock="10:12" battery={0.08} />
      {!on && [0, 1, 2].map((i) => {
        const ph = ((t - t0) * 0.9 + i / 3) % 1;
        return <circle key={i} cx={254} cy={330} r={96 + ph * 120} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - ph) * 0.35} />;
      })}
      <circle cx={254} cy={330} r={96} fill="#6b5a45" />
      <text x={254} y={362} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={800} fontSize={90}>{name[0]}</text>
      <text x={254} y={530} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={800} fontSize={60}>{name}</text>
      <text x={254} y={590} textAnchor="middle" fill="#cfd3dc" fontFamily={F} fontWeight={600} fontSize={34}>{on ? `0:${String(secs).padStart(2, "0")}` : "calling…"}</text>
      {[[134, "#3a3d47"], [254, "#3a3d47"], [374, "#3a3d47"]].map(([x, c]) => <circle key={x} cx={x as number} cy={800} r={52} fill={c as string} />)}
      <circle cx={254} cy={970} r={58} fill="#ff3b30" />
      <path d="M222,972 c20,-14 44,-14 64,0" stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" />
    </svg>
  );
};

// a bleary, half-awake view: the edges of his eyelids at the top and bottom of the frame, closing and opening
export const Eyelids: React.FC<{ t: number; amount?: number }> = ({ t, amount = 1 }) => {
  const blink = Math.max(0, Math.sin(t * 2.6)) ** 6;           // a slow, heavy blink now and then
  const lid = (0.32 + 0.5 * blink) * amount;
  const top = 540 * lid, bot = 1080 - 540 * lid * 0.8;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><filter id="lidBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="28" /></filter></defs>
        <path d={`M-100,-100 L2020,-100 L2020,${top - 120} Q960,${top + 140} -100,${top - 120} Z`} fill="#050403" filter="url(#lidBlur)" />
        <path d={`M-100,1180 L2020,1180 L2020,${bot + 120} Q960,${bot - 120} -100,${bot + 120} Z`} fill="#050403" filter="url(#lidBlur)" />
      </svg>
    </AbsoluteFill>
  );
};
