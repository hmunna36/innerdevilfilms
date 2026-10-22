// v7 (19 Oct): Harshad said "the letter coming in is not natural" (a small card that grew toward the camera). Now the
// door shot is a low camera on the floor: two shadows of feet stop in the light under the door, the notice slides out
// flat along the floor and skids to a stop, the shadows walk away, Bean's feet come in and his hand picks it up.
// The floor is drawn in true perspective so the paper lies flat.
import React from "react";
import type { V2 } from "../rig/geom";
import { BC } from "../rig/bean";

const sm = (u: number) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const DEG = Math.PI / 180;

// the door set's floor (measured on set_door.png at 1920 x 1080): the light gap is at y 576, the door is centred at 985.
// u = sideways at the door's scale, v = distance from the door toward the camera, h = height above the floor
export const DOOR = { xc: 985, yh: 440, yg: 576, d0: 1158 };
const H = DOOR.yg - DOOR.yh; // camera height in the same units
export const fp = (u: number, h: number, v: number): V2 => {
  const d = Math.max(30, DOOR.d0 - v);
  return [DOOR.xc + (DOOR.d0 * u) / d, DOOR.yh + (DOOR.d0 * (H - h)) / d];
};
export const floorScale = (v: number) => DOOR.d0 / Math.max(30, DOOR.d0 - v);
const P = (p: V2) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

// ------------------------------------------------------------------ someone outside: shadows in the light under the door
export const DoorShadows: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const arrive = sm((t - t0) / 0.35), leave = sm((t - t1) / 0.5);
  const op = arrive * (1 - leave);
  if (op < 0.01) return null;
  const dx = leave * 260 - (1 - arrive) * 140;
  return (
    <g opacity={op}>
      {[938, 1030].map((x0, i) => {
        const x = x0 + dx + (i === 1 ? Math.sin(t * 2.3) * 2 : 0);
        return (
          <g key={i}>
            <rect x={x - 32} y={566} width={64} height={15} rx={6} fill="#0c0603" filter="url(#bb3)" />
            <rect x={x - 28} y={584} width={56} height={230} fill="url(#doorStreak)" filter="url(#bb6)" />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ the notice on the floor (or being lifted)
export type LetterState = { u: number; v: number; rot: number; beta?: number; h0?: number; pu?: number; pv?: number };
const PW = 116, PL = 150; // the sheet, at the door's scale
// a point on the sheet: i, j in -1..1 (j = -1 is the end toward the door); beta lifts the near edge about the far edge
export const letterPt = (s: LetterState, i: number, j: number): V2 => {
  const beta = (s.beta ?? 0) * DEG, h0 = s.h0 ?? 0;
  const dj = ((j + 1) * PL) / 2;
  const lx = (i * PW) / 2, ly = -PL / 2 + dj * Math.cos(beta);
  const h = dj * Math.sin(beta) + h0;
  const c = Math.cos(s.rot * DEG), sn = Math.sin(s.rot * DEG);
  return fp(s.u + lx * c - ly * sn, h, s.v + lx * sn + ly * c);
};
// note = a handwritten note (lined paper, blue ink) instead of the printed notice
export const FloorLetter: React.FC<{ s: LetterState; id: string; clipGap?: boolean; title?: string; note?: boolean }> = ({ s, id, clipGap = true, note = false }) => {
  const q = (i: number, j: number) => letterPt(s, i, j);
  const quad = (i0: number, i1: number, j0: number, j1: number) => `${P(q(i0, j0))} ${P(q(i1, j0))} ${P(q(i1, j1))} ${P(q(i0, j1))}`;
  const ys = [q(-1, -1), q(1, -1), q(1, 1), q(-1, 1)].map((p) => p[1]);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const lit = Math.max(0, 1 - (s.v - 60) / 700) * (1 - Math.min(1, (s.beta ?? 0) / 60));
  const near = `rgb(${Math.round(mix(176, 228, lit * 0.6))},${Math.round(mix(162, 200, lit * 0.6))},${Math.round(mix(140, 160, lit * 0.6))})`;
  const far = `rgb(${Math.round(mix(214, 250, lit))},${Math.round(mix(198, 196, lit))},${Math.round(mix(172, 140, lit))})`;
  const flat = (s.beta ?? 0) < 1 && (s.h0 ?? 0) < 1;
  return (
    <g clipPath={clipGap ? "url(#underDoor)" : undefined}>
      <defs>
        <linearGradient id={`lg${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
          <stop offset="0" stopColor={(s.beta ?? 0) > 20 ? near : far} />
          <stop offset="1" stopColor={(s.beta ?? 0) > 20 ? far : near} />
        </linearGradient>
      </defs>
      {flat && <polygon points={quad(-1.03, 1.03, -0.98, 1.06)} fill="#000" opacity={0.55} filter="url(#bb3)" transform="translate(0,3)" />}
      <polygon points={quad(-1, 1, -1, 1)} fill={`url(#lg${id})`} stroke="#5b5144" strokeWidth={1.4} strokeLinejoin="round" />
      {!note && <polygon points={quad(-0.8, 0.8, 0.66, 0.86)} fill="#c0392b" />}
      {!note && [0.42, 0.26, 0.1, -0.06, -0.22, -0.38].map((j, k) => (
        <polygon key={k} points={quad(-0.8, k === 5 ? 0.3 : 0.8, j - 0.045, j)} fill="#8f877a" opacity={0.85} />
      ))}
      {note && [0.7, 0.5, 0.3, 0.1, -0.1, -0.3, -0.5].map((j, k) => (
        <polygon key={k} points={quad(-0.86, 0.86, j - 0.012, j)} fill="#9fb6dc" opacity={0.8} />
      ))}
      {note && [0.62, 0.42, 0.22, 0.02, -0.18].map((j, k) => (
        <polygon key={`i${k}`} points={quad(-0.72, k === 4 ? 0.1 : 0.66 - 0.1 * (k % 2), j - 0.05, j)} fill="#2349a8" opacity={0.75} />
      ))}
      <polyline points={`${P(q(-1, 0.02))} ${P(q(1, 0.02))}`} stroke="#a59a88" strokeWidth={1.2} opacity={0.6} />
      {flat && lit > 0.05 && <polyline points={`${P(q(-1, -1))} ${P(q(1, -1))}`} stroke="#ffb35a" strokeWidth={2.2} opacity={lit} />}
    </g>
  );
};

// ------------------------------------------------------------------ Bean's feet and hand in the low shot
const footShape = (x: number, y: number, k: number) => {
  // the rig's foot (pointing left here), k = size
  const f = (dx: number, dy: number) => `${(x - dx * k).toFixed(1)},${(y + dy * k).toFixed(1)}`;
  return `M${f(-14, 22)} C${f(-17, 6)} ${f(-9, 0)} ${f(2, 0)} C${f(16, 0)} ${f(27, 8)} ${f(28, 16)} C${f(29, 24)} ${f(20, 26)} ${f(10, 26)} L${f(-8, 26)} Q${f(-14, 26)} ${f(-14, 22)} Z`;
};
export type FootKey = { t: number; u: number }; // landing times and places
const footAt = (keys: FootKey[], t: number, swing = 0.22) => {
  // returns u and lift height; before the first key the foot is still out of frame to the right
  let u = keys[0].u + 420, h = 0;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const prevU = i === 0 ? k.u + 420 : keys[i - 1].u;
    if (t >= k.t) { u = k.u; h = 0; continue; }
    if (t > k.t - swing) {
      const w = (t - (k.t - swing)) / swing;
      u = mix(prevU, k.u, sm(w));
      h = Math.sin(Math.PI * w) * 46;
    } else u = prevU;
    break;
  }
  return { u, h };
};
export const LowFeet: React.FC<{ t: number; near: FootKey[]; far: FootKey[]; vNear?: number; vFar?: number; bend?: number }> = ({ t, near, far, vNear = 690, vFar = 630, bend = 0 }) => {
  const leg = (keys: FootKey[], v: number, fill: string, k: string) => {
    const { u, h } = footAt(keys, t);
    const S = floorScale(v);
    const [x, y] = fp(u, h, v);
    const fk = 0.95 * S;         // foot size
    const lw = 31 * S;           // leg width
    const ax = x - 4 * fk, ay = y - 18 * fk;                 // ankle, inside the top of the foot
    const top: V2 = [ax + 40 + bend * 160, -120];            // the leg goes up out of frame
    const mid: V2 = [(ax + top[0]) / 2 - bend * 90, (ay + top[1]) / 2];
    const dir = Math.atan2(top[1] - ay, top[0] - ax);
    const nx = -Math.sin(dir) * lw / 2, ny = Math.cos(dir) * lw / 2;
    const legD = `M${(ax + nx).toFixed(1)},${(ay + ny).toFixed(1)} Q${(mid[0] + nx).toFixed(1)},${(mid[1] + ny).toFixed(1)} ${(top[0] + nx).toFixed(1)},${top[1]} L${(top[0] - nx).toFixed(1)},${top[1]} Q${(mid[0] - nx).toFixed(1)},${(mid[1] - ny).toFixed(1)} ${(ax - nx).toFixed(1)},${(ay - ny).toFixed(1)} Z`;
    return (
      <g key={k}>
        {h < 30 && <ellipse cx={x - fk * 6} cy={fp(u, 0, v)[1] + 2} rx={fk * 26} ry={fk * 3.2} fill="#000" opacity={0.55 * (1 - h / 30)} filter="url(#bb6)" />}
        <path d={legD} fill={BC.line} stroke={BC.line} strokeWidth={5} strokeLinejoin="round" />
        <path d={legD} fill={fill} />
        <path d={footShape(x, y - 26 * fk, fk)} fill={fill} stroke={BC.line} strokeWidth={4} strokeLinejoin="round" />
      </g>
    );
  };
  return <g>{leg(far, vFar, BC.far, "far")}{leg(near, vNear, BC.skin, "near")}</g>;
};
// his hand coming down into the low shot: the arm from above the frame to a mitten that pinches the paper
export const ReachHand: React.FC<{ x: number; y: number; from: V2; k?: number; grip?: number }> = ({ x, y, from, k = 1, grip = 0 }) => {
  const dir = Math.atan2(y - from[1], x - from[0]);
  const lw = 74 * k;
  const nx = -Math.sin(dir) * lw / 2, ny = Math.cos(dir) * lw / 2;
  const ex = x - Math.cos(dir) * 30 * k, ey = y - Math.sin(dir) * 30 * k;
  const armD = `M${(from[0] + nx).toFixed(1)},${(from[1] + ny).toFixed(1)} L${(ex + nx).toFixed(1)},${(ey + ny).toFixed(1)} L${(ex - nx).toFixed(1)},${(ey - ny).toFixed(1)} L${(from[0] - nx).toFixed(1)},${(from[1] - ny).toFixed(1)} Z`;
  const rot = (dir * 180) / Math.PI - 90;
  return (
    <g>
      <path d={armD} fill={BC.line} stroke={BC.line} strokeWidth={6} strokeLinejoin="round" />
      <path d={armD} fill={BC.skin} />
      <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${k})`}>
        <path d="M0,-50 C30,-50 46,-26 46,4 C46,34 26,54 0,54 C-26,54 -44,34 -44,4 C-44,-26 -30,-50 0,-50 Z" fill={BC.skin} stroke={BC.line} strokeWidth={5} />
        {/* the thumb closes over the edge as he grips */}
        <path d={`M-30,${10 - grip * 14} C-52,${4 - grip * 10} -58,${30 - grip * 6} -40,${42 - grip * 8} C-30,${48 - grip * 8} -22,${36 - grip * 12} -22,${24 - grip * 12} Z`} fill={BC.skin} stroke={BC.line} strokeWidth={4.5} strokeLinejoin="round" />
        <ellipse cx={14} cy={10} rx={20} ry={26} fill={BC.shade} opacity={0.55} filter="url(#bb6)" />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ the second notice, seen from straight above
export const TopDownNotice: React.FC<{ t: number; t0: number; title: string; shadows?: [number, number] }> = ({ t, t0, title, shadows }) => {
  const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, (t - t0) / 0.75)), 3); // skids and slows
  const y = mix(-260, 470, e), x = mix(960, 900, e), r = mix(0, -9, e);
  const planks: React.ReactNode[] = [];
  const tones = ["#2a1a10", "#311e12", "#2d1b0f", "#36210f", "#28180d", "#2f1c10"];
  for (let row = 0; row < 15; row++) {
    const yy = 150 + row * 64;
    let xx = -300 - ((row * 211) % 400);
    let c = 0;
    while (xx < 2300) {
      const w = 420 + ((row * 97 + c * 151) % 260);
      planks.push(
        <g key={`${row}_${c}`}>
          <rect x={xx} y={yy} width={w - 3} height={61} fill={tones[(row * 3 + c * 5) % tones.length]} />
          <rect x={xx} y={yy} width={w - 3} height={1.6} fill="#4a2f1c" opacity={0.7} />
          <path d={`M${xx + 30},${yy + 24} C${xx + w * 0.3},${yy + 18} ${xx + w * 0.6},${yy + 34} ${xx + w - 40},${yy + 28}`} fill="none" stroke="#1c1009" strokeWidth={1.4} opacity={0.5} />
        </g>,
      );
      xx += w; c++;
    }
  }
  const sh = shadows ? sm((t - shadows[0]) / 0.3) * (1 - sm((t - shadows[1]) / 0.4)) : 0;
  return (
    <g>
      <rect x={-300} y={-200} width={2520} height={1480} fill="#120a05" />
      {planks}
      <rect x={-300} y={150} width={2520} height={1000} fill="url(#topLight)" />
      {/* the door's bottom edge across the top, and the light under it */}
      <rect x={-300} y={-200} width={2520} height={340} fill="#120b07" />
      <rect x={-300} y={128} width={2520} height={14} fill="#1d120b" />
      <rect x={330} y={140} width={1260} height={12} fill="#ffb455" />
      <rect x={330} y={136} width={1260} height={24} fill="#ff9a3a" opacity={0.6} filter="url(#bb6)" />
      {sh > 0.01 && [880, 1040].map((sx, i) => <rect key={i} x={sx + (1 - sh) * 60} y={134} width={90} height={22} rx={8} fill="#0c0603" opacity={sh} filter="url(#bb3)" />)}
      {/* the sheet, clipped where it is still under the door */}
      <clipPath id="tdClip"><rect x={-300} y={148} width={2520} height={1200} /></clipPath>
      <g clipPath="url(#tdClip)">
        <g transform={`translate(${x},${y}) rotate(${r})`}>
          <rect x={-150} y={-190} width={300} height={380} fill="#000" opacity={0.45} filter="url(#bb10)" transform="translate(6,10)" />
          <rect x={-150} y={-190} width={300} height={380} rx={3} fill="#e9dfcc" stroke="#7d7363" strokeWidth={2.5} />
          <rect x={-134} y={-166} width={268} height={60} fill="#c0392b" />
          <text x={0} y={-126} textAnchor="middle" fill="#fff" fontFamily="Avenir Next" fontWeight={900} fontSize={27} letterSpacing={1}>{title}</text>
          <text x={0} y={-60} textAnchor="middle" fill="#2b2620" fontFamily="Avenir Next" fontWeight={800} fontSize={26}>PAY OR VACATE</text>
          {[-20, 10, 40, 70, 100].map((yy, k) => <rect key={k} x={-122} y={yy} width={k === 4 ? 150 : 244} height={10} fill="#bfb5a2" />)}
          <line x1={-150} y1={0} x2={150} y2={0} stroke="#b7ab97" strokeWidth={2} opacity={0.6} />
        </g>
      </g>
      <rect x={-300} y={-200} width={2520} height={1480} fill="url(#topVig)" />
    </g>
  );
};

export const DoorDefs: React.FC = () => (
  <defs>
    <linearGradient id="doorStreak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.75} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
    <clipPath id="underDoor"><rect x={-400} y={576.5} width={2800} height={1200} /></clipPath>
    <linearGradient id="topLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a3a" stopOpacity={0.32} /><stop offset="0.35" stopColor="#ff9a3a" stopOpacity={0.07} /><stop offset="1" stopColor="#ff9a3a" stopOpacity={0} /></linearGradient>
    <radialGradient id="topVig" cx="50%" cy="40%" r="75%"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient>
  </defs>
);
