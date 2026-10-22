// Film 02 (JUST ONE MORE): the things he studies with. His thick textbook on the desk (in the desk's 3/4 view) and
// seen from above; the wall calendar with the exam day circled; the exam paper; mugs and flashcards piling up; Dad's
// photo on the desk and Dad's handwritten note.
import React from "react";
import { random } from "remotion";
import type { V2 } from "../rig/geom";
import { BC } from "../rig/bean";
import { DK, STL, plane, poly, pj } from "./desk";
import type { V3 } from "./desk";
import { k, mix, sm } from "./kit";

const DEG = Math.PI / 180;
const F = "Avenir Next", HAND = "Chalkboard SE";

// ------------------------------------------------------------------ the textbook lying open on the desk (3/4 view)
// x, z = where on the desk (z = 0 is the middle of the desk's depth, + toward the camera); r = turned on the desk;
// frac = how far through the book he is (thin stack on the left at the start); hl = highlighted lines (0..1)
export const DeskBook: React.FC<{ x: number; z: number; r?: number; frac?: number; hl?: number; open?: boolean; s?: number }> = ({ x, z, r = -6, frac = 0.02, hl = 0, open = true, s = 1 }) => {
  const o: V2 = [x, DK.y];
  const c = Math.cos(r * DEG), sn = Math.sin(r * DEG);
  const W = 64 * s, D = 92 * s, T = 16 * s;
  const tL = 1 + T * frac, tR = 1 + T * (1 - frac);
  const P = (u: number, h: number, w: number): V3 => [u * c - w * sn, h, z + u * sn + w * c];
  const du: V3 = [c, 0, sn], dv: V3 = [-sn, 0, c];
  if (!open) {
    const th = T + 2;
    return (
      <g>
        <polygon points={poly(o, [P(-36 * s, 0, -D / 2), P(36 * s, 0, -D / 2), P(36 * s, 0, D / 2), P(-36 * s, 0, D / 2)])} fill="#000" opacity={0.45} transform="translate(3,4)" />
        <polygon points={poly(o, [P(-34 * s, 0, D / 2), P(34 * s, 0, D / 2), P(34 * s, th, D / 2), P(-34 * s, th, D / 2)])} fill="#e9e1cf" stroke="#3b2a1d" strokeWidth={1.5} />
        <polygon points={poly(o, [P(-36 * s, th, -D / 2 - 2), P(36 * s, th, -D / 2 - 2), P(36 * s, th, D / 2 + 2), P(-36 * s, th, D / 2 + 2)])} fill="#7a2a22" stroke="#2a0f0b" strokeWidth={2} />
        <g transform={plane(o, P(-24 * s, th + 0.2, -D / 2 + 14), du, dv)}><rect width={48 * s} height={10} fill="#e8c46a" opacity={0.9} /><rect y={16} width={36 * s} height={5} fill="#e8c46a" opacity={0.6} /></g>
      </g>
    );
  }
  const lines = (u0: number, h: number, n: number, seed: string, hlN: number) => (
    <g transform={plane(o, P(u0, h + 0.2, -D / 2 + 9), du, dv)}>
      {Array.from({ length: n }).map((_, i) => {
        const len = (W - 16) * (i % 6 === 5 ? 0.55 : 0.82 + 0.16 * random(`${seed}${i}`));
        return (
          <g key={i}>
            {i < hlN && <rect x={-1} y={i * 6.4 - 2.2} width={len + 2} height={5} fill="#ffe14d" opacity={0.75} />}
            <rect x={0} y={i * 6.4} width={len} height={1.6} fill="#8d8577" />
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      <polygon points={poly(o, [P(-W - 6, 0, -D / 2 - 4), P(W + 6, 0, -D / 2 - 4), P(W + 6, 0, D / 2 + 4), P(-W - 6, 0, D / 2 + 4)])} fill="#000" opacity={0.4} transform="translate(3,5)" />
      {/* hard cover under the pages */}
      <polygon points={poly(o, [P(-W - 4, 0.5, -D / 2 - 3), P(W + 4, 0.5, -D / 2 - 3), P(W + 4, 0.5, D / 2 + 3), P(-W - 4, 0.5, D / 2 + 3)])} fill="#7a2a22" stroke="#2a0f0b" strokeWidth={2} />
      {/* the two stacks of pages: their front edges, then their tops */}
      <polygon points={poly(o, [P(-W, 0.5, D / 2), P(0, 0.5, D / 2), P(0, tL, D / 2), P(-W, tL, D / 2)])} fill="#d9d0bd" stroke="#6d6250" strokeWidth={1.2} />
      <polygon points={poly(o, [P(0, 0.5, D / 2), P(W, 0.5, D / 2), P(W, tR, D / 2), P(0, tR, D / 2)])} fill="#d9d0bd" stroke="#6d6250" strokeWidth={1.2} />
      {tR > 4 && Array.from({ length: Math.floor(tR / 3) }).map((_, i) => <polyline key={i} points={poly(o, [P(2, 1 + i * 3, D / 2), P(W - 2, 1 + i * 3, D / 2)])} stroke="#b9ae98" strokeWidth={0.8} fill="none" />)}
      <polygon points={poly(o, [P(-W, tL, -D / 2), P(0, tL + 2, -D / 2), P(0, tL + 2, D / 2), P(-W, tL, D / 2)])} fill="#f1ebdd" stroke="#6d6250" strokeWidth={1.4} strokeLinejoin="round" />
      <polygon points={poly(o, [P(0, tR + 2, -D / 2), P(W, tR, -D / 2), P(W, tR, D / 2), P(0, tR + 2, D / 2)])} fill="#f6f1e5" stroke="#6d6250" strokeWidth={1.4} strokeLinejoin="round" />
      {lines(-W + 8, tL, 12, "bl", 0)}
      {lines(8, tR, 12, "br", Math.round(hl * 12))}
      {/* the spine's shadow */}
      <polyline points={poly(o, [P(0, Math.max(tL, tR) + 2, -D / 2), P(0, Math.max(tL, tR) + 2, D / 2)])} stroke="#7d7462" strokeWidth={3} opacity={0.6} fill="none" />
    </g>
  );
};

// ------------------------------------------------------------------ mugs and flashcards piling up on the desk
export const DeskClutter: React.FC<{ mugs: number; cards: number }> = ({ mugs, cards }) => {
  const spots: [number, number][] = [[1102, 30], [1080, 64], [1118, 70], [736, 62], [760, 30], [1060, 10]];
  const out: React.ReactNode[] = [];
  for (let i = 0; i < Math.min(mugs, spots.length); i++) {
    const [x, z] = spots[i];
    const b = pj([x, DK.y], [0, 0, z]);
    out.push(
      <g key={`m${i}`} transform={`translate(${b[0]},${b[1]})`}>
        <ellipse cx={0} cy={0} rx={13} ry={4} fill="#000" opacity={0.4} />
        <path d="M-11,0 L-11,-26 L11,-26 L11,0 Z" fill={["#e8e2d6", "#d4573f", "#3f6fb0", "#e8e2d6", "#5e8a4f", "#d4573f"][i]} stroke="#1a1a1a" strokeWidth={2} />
        <ellipse cx={0} cy={-26} rx={11} ry={3.5} fill="#2a1a10" stroke="#1a1a1a" strokeWidth={1.5} />
        <path d="M11,-20 C19,-20 19,-8 11,-8" fill="none" stroke="#1a1a1a" strokeWidth={3} />
      </g>,
    );
  }
  if (cards > 0) {
    const o: V2 = [770, DK.y];
    const P = (u: number, h: number, w: number): V3 => [u, h, 40 + w];
    const h = Math.min(14, cards * 1.4);
    out.push(
      <g key="cards">
        <polygon points={poly(o, [P(-22, 0, 14), P(22, 0, 14), P(22, h, 14), P(-22, h, 14)])} fill="#f4f1ea" stroke="#5a5448" strokeWidth={1} />
        <polygon points={poly(o, [P(-22, h, -14), P(22, h, -14), P(22, h, 14), P(-22, h, 14)])} fill="#fbfaf6" stroke="#5a5448" strokeWidth={1} />
        <polyline points={poly(o, [P(-16, h, -6), P(14, h, -6)])} stroke="#3b6fd6" strokeWidth={1.5} />
      </g>,
    );
  }
  return <g>{out}</g>;
};

// ------------------------------------------------------------------ Dad's photo on the desk: Dad (cap, mustache,
// work vest) with his arm round Bean
export const DadPhoto: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={31} rx={26} ry={4} fill="#000" opacity={0.45} filter="url(#bb3)" />
    <rect x={-23} y={-30} width={46} height={60} rx={3} fill="#3a2c22" stroke="#120c08" strokeWidth={2} />
    <rect x={-17} y={-24} width={34} height={48} fill="url(#dadSky)" />
    {/* Dad: orange work vest with a reflective stripe, a blue cap, a grey mustache */}
    <path d="M-16,24 C-16,9 -11,3 -5,3 C1,3 5,9 5,24 Z" fill="#e8742a" stroke="#1a1a1a" strokeWidth={1.2} />
    <path d="M-15,14 H4" stroke="#e8f0f0" strokeWidth={2} />
    <circle cx={-5} cy={-5} r={8.5} fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <path d="M-14,-9 C-14,-17 4,-17 4,-9 Z" fill="#2c4f86" stroke="#1a1a1a" strokeWidth={1} />
    <path d="M2,-10 h5" stroke="#2c4f86" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M-8,-4 h1.6 M-3.6,-4 h1.6" stroke="#1a1a1a" strokeWidth={1.4} strokeLinecap="round" />
    <path d="M-9,0 Q-5,-1.5 -1,0 Q-5,2.5 -9,0 Z" fill="#8f8a84" />
    {/* Bean */}
    <path d="M3,24 C3,12 7,7 11,7 C15,7 18,12 18,24 Z" fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <circle cx={10.5} cy={-1} r={8} fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <path d="M7.5,-2 h1.4 M11.8,-2 h1.4" stroke="#1a1a1a" strokeWidth={1.4} strokeLinecap="round" />
    <path d="M7.5,2.5 Q10.5,4.5 13.5,2.5" fill="none" stroke="#1a1a1a" strokeWidth={1} strokeLinecap="round" />
    <path d="M1,8 C4,5 7,6 8,8" fill="none" stroke="#1a1a1a" strokeWidth={1.4} />
    <rect x={-17} y={-24} width={34} height={48} fill="url(#momGloss)" />
  </g>
);

// ------------------------------------------------------------------ the open book from straight above (an insert)
// page = the left page's number; hl = 0..1 the highlighter along the right page's lines; flip = 0..1 a page turning
export const BookInsert: React.FC<{ t: number; page: number; hl?: number; flip?: number; hand?: boolean; red?: number; tired?: number }> = ({ t, page, hl = 0, flip = -1, hand = true, red = 0, tired = 0 }) => {
  const L0 = 330, MID = 960, R1 = 1590, TOP = 120, BOT = 960;
  const rows = 17;
  const lineY = (i: number) => TOP + 120 + i * 44;
  const rowsOf = (x0: number, seed: string, hlN: number) => Array.from({ length: rows }).map((_, i) => {
    const para = i % 6 === 5;
    const len = (MID - L0 - 120) * (para ? 0.5 : 0.8 + 0.2 * random(`${seed}${i}`));
    return (
      <g key={i}>
        {i < hlN && <rect x={x0 - 6} y={lineY(i) - 13} width={len + 12} height={26} rx={4} fill="#ffe14d" opacity={0.7} />}
        <rect x={x0} y={lineY(i) - 4} width={len} height={8} rx={3} fill="#7d7566" opacity={0.8} />
      </g>
    );
  });
  const hlRow = Math.floor(hl * rows), hlFrac = hl * rows - hlRow;
  const lenOf = (i: number) => (MID - L0 - 120) * (i % 6 === 5 ? 0.5 : 0.8 + 0.2 * random(`r${page}${i}`));
  const tipX = MID + 60 + lenOf(Math.min(rows - 1, hlRow)) * hlFrac, tipY = lineY(Math.min(rows - 1, hlRow));
  const fu = flip >= 0 ? sm(flip) : -1;
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#2a1a10" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M-400,${-100 + i * 170} C400,${-120 + i * 170} 1400,${-60 + i * 170} 2320,${-100 + i * 170}`} stroke="#1d1209" strokeWidth={4} fill="none" opacity={0.6} />)}
      <ellipse cx={960} cy={520} rx={1100} ry={700} fill="#ffcf8a" opacity={0.14} filter="url(#bb30)" />
      {/* cover, then the pages */}
      <rect x={L0 - 26} y={TOP - 22} width={R1 - L0 + 52} height={BOT - TOP + 44} rx={14} fill="#7a2a22" stroke="#2a0f0b" strokeWidth={5} />
      <rect x={L0 - 10} y={TOP - 4} width={R1 - L0 + 20} height={BOT - TOP + 14} rx={8} fill="#cfc6b2" />
      <path d={`M${L0},${TOP} L${MID},${TOP + 10} L${MID},${BOT + 6} L${L0},${BOT} Z`} fill="#f2ecdf" stroke="#6d6250" strokeWidth={3} />
      <path d={`M${MID},${TOP + 10} L${R1},${TOP} L${R1},${BOT} L${MID},${BOT + 6} Z`} fill="#f7f2e7" stroke="#6d6250" strokeWidth={3} />
      <rect x={MID - 70} y={TOP} width={140} height={BOT - TOP} fill="url(#spineShade)" />
      <rect x={L0 + 60} y={TOP + 50} width={300} height={22} rx={6} fill="#4b4438" opacity={0.85} />
      {rowsOf(L0 + 60, `l${page}`, 0)}
      {rowsOf(MID + 60, `r${page}`, hlRow)}
      {hl > 0 && hlRow < rows && <rect x={MID + 54} y={tipY - 13} width={Math.max(0, tipX - MID - 54)} height={26} rx={4} fill="#ffe14d" opacity={0.7} />}
      <text x={L0 + 70} y={BOT - 34} fill="#5b5446" fontFamily={F} fontWeight={800} fontSize={44}>{page}</text>
      <text x={R1 - 70} y={BOT - 34} textAnchor="end" fill="#5b5446" fontFamily={F} fontWeight={800} fontSize={44}>{page + 1}</text>
      {/* a page turning from right to left */}
      {fu >= 0 && fu < 1 && (() => {
        const w = (R1 - MID) * Math.cos(Math.PI * fu);
        const xe = MID + w;
        const lift = Math.sin(Math.PI * fu) * 60;
        return (
          <g>
            <path d={`M${MID},${TOP + 10} L${xe},${TOP - lift} L${xe},${BOT - lift * 0.4} L${MID},${BOT + 6} Z`} fill={fu < 0.5 ? "#f7f2e7" : "#ece4d3"} stroke="#6d6250" strokeWidth={3} />
            <path d={`M${MID},${TOP + 10} L${xe},${TOP - lift} L${xe},${BOT - lift * 0.4} L${MID},${BOT + 6} Z`} fill="#000" opacity={0.12 * Math.sin(Math.PI * fu)} />
          </g>
        );
      })()}
      {/* the highlighter in his hand */}
      {hand && (
        <g transform={`translate(${tipX},${tipY}) rotate(-38)`}>
          <rect x={-18} y={10} width={36} height={220} rx={10} fill="#ffd60a" stroke="#1a1a1a" strokeWidth={5} />
          <rect x={-18} y={150} width={36} height={80} rx={8} fill="#e0b400" stroke="#1a1a1a" strokeWidth={5} />
          <path d="M-10,12 L-6,-14 L8,-14 L10,12 Z" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth={4} />
          <g transform="translate(6,150) rotate(38)">
            <path d="M0,-70 C60,-70 96,-36 96,12 C96,64 56,96 0,96 C-56,96 -92,64 -92,12 C-92,-36 -60,-70 0,-70 Z" fill={BC.skin} stroke={BC.line} strokeWidth={7} />
            <ellipse cx={-22} cy={30} rx={44} ry={40} fill={BC.shade} opacity={0.55} />
            <path d="M-70,-30 C-110,-50 -120,0 -96,24 C-82,38 -62,24 -60,6 Z" fill={BC.skin} stroke={BC.line} strokeWidth={6} strokeLinejoin="round" />
            <path d="M-40,90 L-60,500 L160,500 L120,80 Z" fill={BC.line} />
            <path d="M-34,88 L-54,500 L152,500 L114,80 Z" fill={BC.skin} />
          </g>
        </g>
      )}
      {tired > 0.01 && <rect x={-400} y={-300} width={2720} height={1680} fill="#000" opacity={0.35 * tired} />}
      {red > 0.01 && <rect x={-400} y={-300} width={2720} height={1680} fill="#ff2d1f" opacity={0.12 * red} />}
      <rect x={-400} y={-300} width={2720} height={1680} fill="url(#topVig)" />
    </g>
  );
};

// ------------------------------------------------------------------ the wall calendar (an insert): May, Friday the
// 15th circled in red marker, "FINAL EXAM 9 AM"; crossed = the days already crossed off (from the 8th)
// xDay = a day being crossed out right now (u = 0..1 of the two strokes); the marker follows whatever is being drawn
// dim = the room at night, lit only by the laptop's glow from the left
export const CalendarInsert: React.FC<{ t: number; circle?: number; crossed?: number; marker?: boolean; write?: number; xDay?: { day: number; u: number }; cake?: boolean; dim?: number }> = ({
  t, circle = 1, crossed = 0, marker = false, write, xDay, cake = true, dim = 0 }) => {
  const X0 = 420, Y0 = 250, CW = 154, CH = 118;
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const cell = (d: number): V2 => { const i = d + 3; return [X0 + (i % 7) * CW, Y0 + 60 + Math.floor(i / 7) * CH]; }; // the 1st is a Friday
  const [cx, cy] = cell(15);
  const ccx = cx + CW / 2, ccy = cy + CH / 2;
  const C = 2 * Math.PI * 70;
  const wr = write ?? circle;
  const tipA = -Math.PI / 2 + circle * 2 * Math.PI * 1.08;
  let tip: V2 = circle < 1 ? [ccx + Math.cos(tipA) * 84, ccy + Math.sin(tipA) * 64] : [ccx - 190 + 680 * sm(wr), ccy + 166];
  const xs = (d: number, u: number) => {
    // the two strokes of a cross, drawn one after the other
    const [x, y] = cell(d);
    const a: [V2, V2] = [[x + 24, y + 22], [x + CW - 24, y + CH - 18]], b: [V2, V2] = [[x + CW - 24, y + 22], [x + 24, y + CH - 18]];
    const u1 = Math.min(1, u * 2), u2 = Math.max(0, u * 2 - 1);
    const p1: V2 = [mix(a[0][0], a[1][0], u1), mix(a[0][1], a[1][1], u1)], p2: V2 = [mix(b[0][0], b[1][0], u2), mix(b[0][1], b[1][1], u2)];
    return { d: `M${a[0][0]},${a[0][1]} L${p1[0]},${p1[1]}${u2 > 0 ? ` M${b[0][0]},${b[0][1]} L${p2[0]},${p2[1]}` : ""}`, tip: u2 > 0 ? p2 : p1 };
  };
  const xNow = xDay ? xs(xDay.day, xDay.u) : null;
  if (xNow) tip = xNow.tip;
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#1c1f2a" />
      <ellipse cx={1500} cy={200} rx={900} ry={700} fill="#ffb466" opacity={0.12} filter="url(#bb30)" />
      <circle cx={960} cy={92} r={10} fill="#8a8f9b" />
      <path d="M960,92 L760,190 M960,92 L1160,190" stroke="#6d7280" strokeWidth={3} />
      <rect x={X0 - 60} y={170} width={7 * CW + 120} height={760} rx={8} fill="#000" opacity={0.45} transform="translate(14,20)" filter="url(#bb10)" />
      <rect x={X0 - 60} y={170} width={7 * CW + 120} height={760} rx={8} fill="#f2ecdf" stroke="#3b3428" strokeWidth={4} />
      <rect x={X0 - 60} y={170} width={7 * CW + 120} height={70} fill="#c0392b" />
      <text x={960} y={222} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={900} fontSize={44} letterSpacing={8}>MAY</text>
      {days.map((d, i) => <text key={d} x={X0 + i * CW + CW / 2} y={Y0 + 40} textAnchor="middle" fill="#6b6253" fontFamily={F} fontWeight={800} fontSize={24}>{d}</text>)}
      {Array.from({ length: 31 }).map((_, j) => {
        const d = j + 1, [x, y] = cell(d);
        return (
          <g key={d}>
            <rect x={x + 2} y={y + 2} width={CW - 4} height={CH - 4} fill="none" stroke="#d6cdb9" strokeWidth={2} />
            <text x={x + 14} y={y + 42} fill="#3b3428" fontFamily={F} fontWeight={800} fontSize={34}>{d}</text>
            {cake && d === 14 && (
              // Dad's birthday, in Bean's blue pen: a small cake with a candle, and "DAD"
              <g transform={`translate(${x + CW / 2 + 30},${y + 74})`} stroke="#2349a8" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-30,18 L-30,-2 L30,-2 L30,18 Z" />
                <path d="M-30,6 C-20,12 -10,0 0,6 C10,12 20,0 30,6" />
                <path d="M0,-2 L0,-16" />
                <path d="M0,-30 C6,-24 4,-18 0,-17 C-4,-18 -6,-24 0,-30 Z" fill="#ff9f0a" stroke="#d0281c" strokeWidth={2.5} />
                <text x={-94} y={8} stroke="none" fill="#2349a8" fontFamily={HAND} fontWeight={700} fontSize={26}>DAD</text>
              </g>
            )}
            {d >= 8 && d < 8 + crossed && (
              <path d={`M${x + 24},${y + 22} L${x + CW - 24},${y + CH - 18} M${x + CW - 24},${y + 22} L${x + 24},${y + CH - 18}`} stroke="#d0281c" strokeWidth={9} strokeLinecap="round" opacity={0.9} />
            )}
          </g>
        );
      })}
      {xNow && <path d={xNow.d} stroke="#d0281c" strokeWidth={9} strokeLinecap="round" opacity={0.9} fill="none" />}
      {/* the circle and the words in red marker */}
      <ellipse cx={ccx} cy={ccy} rx={84} ry={64} fill="none" stroke="#d0281c" strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${C * 1.08 * circle} ${C * 2}`} transform={`rotate(-90 ${ccx} ${ccy})`} />
      <g opacity={k(wr, [0, 0.05], [0, 1])}>
        <clipPath id="calWrite"><rect x={ccx - 200} y={ccy + 90} width={720 * sm(wr) + 1} height={140} /></clipPath>
        <text x={ccx - 190} y={ccy + 186} fill="#d0281c" stroke="#f2ecdf" strokeWidth={10} paintOrder="stroke" fontFamily={HAND} fontWeight={700} fontSize={70} clipPath="url(#calWrite)">FINAL EXAM 9 AM</text>
      </g>
      {marker && (
        <g transform={`translate(${tip[0]},${tip[1]}) rotate(-35) scale(0.8)`}>
          <path d="M-8,0 L-14,30 L14,30 L8,0 Z" fill="#d0281c" stroke="#1a1a1a" strokeWidth={4} />
          <rect x={-22} y={28} width={44} height={222} rx={10} fill="#d63a2a" stroke="#1a1a1a" strokeWidth={5} />
          <g transform="translate(6,150) rotate(35)">
            <path d="M0,-70 C60,-70 96,-36 96,12 C96,64 56,96 0,96 C-56,96 -92,64 -92,12 C-92,-36 -60,-70 0,-70 Z" fill={BC.skin} stroke={BC.line} strokeWidth={7} />
            <ellipse cx={-22} cy={30} rx={44} ry={40} fill={BC.shade} opacity={0.55} />
            <path d="M-70,-30 C-110,-50 -120,0 -96,24 C-82,38 -62,24 -60,6 Z" fill={BC.skin} stroke={BC.line} strokeWidth={6} strokeLinejoin="round" />
            <path d="M-40,90 L-60,520 L160,520 L120,80 Z" fill={BC.line} />
            <path d="M-34,88 L-54,520 L152,520 L114,80 Z" fill={BC.skin} />
          </g>
        </g>
      )}
      {dim > 0.01 && <>
        <rect x={-400} y={-300} width={2720} height={1680} fill="#04060c" opacity={0.55 * dim} />
        <ellipse cx={700} cy={560} rx={900} ry={600} fill="#8fb0ff" opacity={0.12 * dim} filter="url(#bb30)" style={{ mixBlendMode: "screen" }} />
      </>}
      <rect x={-400} y={-300} width={2720} height={1680} fill="url(#topVig)" />
    </g>
  );
};

// ------------------------------------------------------------------ the exam paper from above, his hand writing fast
export const ExamInsert: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const u = Math.max(0, t - t0);
  const n = 9;
  const done = u * 3.4; // lines written
  const row = Math.min(n - 1, Math.floor(done)), fr = done - Math.floor(done);
  const lineY = (i: number) => 360 + i * 64;
  const tip: V2 = [700 + 620 * (done >= n ? 1 : fr), lineY(row) - 6 + Math.sin(u * 40) * 4];
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#b98b5e" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M-400,${-60 + i * 190} C500,${-90 + i * 190} 1300,${-30 + i * 190} 2320,${-60 + i * 190}`} stroke="#a3784e" strokeWidth={5} fill="none" opacity={0.7} />)}
      <g transform="rotate(-4 960 560)">
        <rect x={560} y={60} width={800} height={1040} fill="#000" opacity={0.3} transform="translate(12,16)" filter="url(#bb10)" />
        <rect x={560} y={60} width={800} height={1040} fill="#fbfaf6" stroke="#6a6458" strokeWidth={3} />
        <text x={960} y={160} textAnchor="middle" fill="#1d1d1d" fontFamily={F} fontWeight={900} fontSize={64} letterSpacing={3}>FINAL EXAM</text>
        <rect x={640} y={200} width={640} height={4} fill="#1d1d1d" />
        <text x={640} y={262} fill="#555" fontFamily={F} fontWeight={700} fontSize={28}>Name:</text>
        <text x={740} y={262} fill="#2349a8" fontFamily={HAND} fontWeight={700} fontSize={34}>Bean</text>
        {Array.from({ length: n }).map((_, i) => {
          const w = i < row ? 620 : i === row ? 620 * fr : 0;
          return (
            <g key={i}>
              <text x={612} y={lineY(i) + 4} fill="#777" fontFamily={F} fontWeight={700} fontSize={24}>{i + 1}.</text>
              <rect x={660} y={lineY(i) + 12} width={660} height={2} fill="#c9c4b8" />
              {w > 0 && <path d={Array.from({ length: Math.max(2, Math.floor(w / 18)) }).map((_, j) => `${j ? "L" : "M"}${700 + j * 18},${lineY(i) - 4 + Math.sin(j * 1.9 + i) * 7}`).join(" ")} stroke="#2349a8" strokeWidth={4} fill="none" strokeLinejoin="round" />}
            </g>
          );
        })}
      </g>
      {/* the pen and his hand */}
      <g transform={`translate(${tip[0]},${tip[1]}) rotate(-32)`}>
        <rect x={-10} y={0} width={20} height={240} rx={8} fill="#2a2d35" stroke="#111" strokeWidth={4} />
        <path d="M-8,2 L0,-24 L8,2 Z" fill="#c9ccd3" stroke="#111" strokeWidth={3} />
        <g transform="translate(0,150) rotate(32)">
          <path d="M0,-70 C60,-70 96,-36 96,12 C96,64 56,96 0,96 C-56,96 -92,64 -92,12 C-92,-36 -60,-70 0,-70 Z" fill={BC.skin} stroke={BC.line} strokeWidth={7} />
          <ellipse cx={-22} cy={30} rx={44} ry={40} fill={BC.shade} opacity={0.55} />
          <path d="M-70,-30 C-110,-50 -120,0 -96,24 C-82,38 -62,24 -60,6 Z" fill={BC.skin} stroke={BC.line} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-40,90 L-60,500 L160,500 L120,80 Z" fill={BC.line} />
          <path d="M-34,88 L-54,500 L152,500 L114,80 Z" fill={BC.skin} />
        </g>
      </g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="url(#topVig)" opacity={0.6} />
    </g>
  );
};

// ------------------------------------------------------------------ Dad's note, held in his two hands (HTML overlay)
export const NOTE_LINES = ["Your phone was off for two days.", "I got worried, so I came by.", "Saw your light on.", "Didn't want to bother you.", "Proud of you.", "- Dad"];
export const NoteCard: React.FC<{ t: number; t0: number; t1: number; lines?: string[] }> = ({ t, t0, t1, lines = NOTE_LINES }) => {
  const op = k(t, [t0, t0 + 0.25, t1 - 0.3, t1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const rise = sm((t - t0) / 0.35);
  return (
    <div style={{ position: "absolute", left: 470, top: 110 + (1 - rise) * 80, width: 980, height: 860, background: "#fbfaf4", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
      opacity: op, transform: `translate(${Math.sin(t * 9) * 1.4}px, ${Math.cos(t * 7) * 1.2}px) rotate(-2deg)`, fontFamily: HAND, color: "#1f3f8f", boxSizing: "border-box", padding: "70px 76px",
      backgroundImage: "repeating-linear-gradient(180deg, transparent 0 87px, #b9cbe8 87px 90px)", backgroundPositionY: "40px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 428, height: 3, background: "rgba(0,0,0,0.08)" }} />
      {lines.map((ln, i) => (
        <div key={i} style={{ fontSize: 62, fontWeight: 700, lineHeight: "90px", marginLeft: i === lines.length - 1 ? 420 : 0 }}>{ln}</div>
      ))}
      <svg width={1100} height={520} viewBox="0 0 1100 520" style={{ position: "absolute", left: -60, top: 640, overflow: "visible" }}>
        {[[110, 1], [990, -1]].map(([hx, sd]) => (
          <g key={hx} transform={`translate(${hx},${120 + Math.sin(t * 6 + hx) * 1.5})`}>
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

export const StudyDefs: React.FC = () => (
  <defs>
    <linearGradient id="dadSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc7e8" /><stop offset="1" stopColor="#5e8fb8" /></linearGradient>
    <linearGradient id="spineShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="0.5" stopColor="#000" stopOpacity={0.22} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
  </defs>
);
