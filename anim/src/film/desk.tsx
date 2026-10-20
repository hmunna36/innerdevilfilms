// v7 (19 Oct): Harshad said the laptop "is not natural" (a thin bar floating on his lap). So Bean now works at a real
// desk: an office chair, a 3/4 laptop with a lit screen and a keyboard under his hands, and the clock, Mom's photo and
// the drawer the phone goes into. The screen shows what happens (sent, not selected), and the same screen UI is used
// full-frame for close-up inserts instead of floating cards.
import React from "react";
import type { V2 } from "../rig/geom";
import { BC } from "../rig/bean";

const DEG = Math.PI / 180;
// the foreground props are drawn with a slight top-down camera: world x right, y up, z toward the camera
export const TILT = 12 * DEG;
const CT = Math.cos(TILT), STL = Math.sin(TILT);
type V3 = [number, number, number];
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const pj = (o: V2, p: V3): V2 => [o[0] + p[0], o[1] - p[1] * CT + p[2] * STL];
const poly = (o: V2, ps: V3[]) => ps.map((p) => pj(o, p).map((q) => q.toFixed(1)).join(",")).join(" ");
// affine map from local (u, v) on a plane (du, dv = world vectors per local unit) at world point p0
const plane = (o: V2, p0: V3, du: V3, dv: V3) => {
  const P0 = pj(o, p0);
  return `matrix(${du[0].toFixed(4)} ${(-du[1] * CT + du[2] * STL).toFixed(4)} ${dv[0].toFixed(4)} ${(-dv[1] * CT + dv[2] * STL).toFixed(4)} ${P0[0].toFixed(1)} ${P0[1].toFixed(1)})`;
};
const sm = (u: number) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };

// ------------------------------------------------------------------ the desk's place in the bedroom
// y = screen y of the desk top in Bean's plane (z = 0); the top runs from z = -100 (back) to z = +100 (front)
export const DK = { x0: 712, x1: 1136, y: 700, zf: 100, zb: 100, th: 18, floor: 960 };
export const DESK_FRONT_Y = DK.y + DK.zf * STL;            // 720.8
export const DESK_FLOOR_FRONT = DK.floor + DK.zf * STL;    // 980.8
export const CLOCK_XY: V2 = [1076, 666];                   // centre of the desk clock (for close-ups)
export const DRAWER_XY: V2 = [1052, 772];                  // centre of the top drawer
export const LAPTOP_HINGE: V2 = [846, DK.y - 45 * STL];    // screen point of the laptop's hinge centre
export const SCREEN_XY: V2 = [858, 642];                   // middle of the laptop screen (lid open)

// ------------------------------------------------------------------ the screen's contents (a 320 x 200 virtual display)
export type ScreenKind = "off" | "form" | "sent" | "rejected" | "inbox" | "gigs" | "paid";
const UI = { bg: "#0f1522", bar: "#1b2436", field: "#243049", text: "#e9eef7", dim: "#8a97ad", blue: "#3b82f6", green: "#22c55e", red: "#ef4444" };
export const ScreenUI: React.FC<{ kind: ScreenKind; t: number; ts?: number }> = ({ kind, t, ts = 0 }) => {
  const dt = t - ts;
  const F = "Avenir Next";
  if (kind === "off") return <rect x={0} y={0} width={320} height={200} fill="#07080b" />;
  const bar = (title: string) => (
    <g>
      <rect x={0} y={0} width={320} height={24} fill={UI.bar} />
      {[12, 24, 36].map((x, i) => <circle key={i} cx={x} cy={12} r={3.4} fill={["#ef6b5e", "#f5c04f", "#5fcf65"][i]} opacity={0.8} />)}
      <text x={160} y={16.5} textAnchor="middle" fill={UI.dim} fontFamily={F} fontWeight={600} fontSize={10}>{title}</text>
    </g>
  );
  const pop = (d: number) => 0.6 + 0.4 * sm(d / 0.18);
  let body: React.ReactNode = null;
  if (kind === "form") {
    const typed = Math.max(0, Math.floor(dt * 14));
    body = (
      <g>
        {bar("careers · apply")}
        <text x={20} y={48} fill={UI.text} fontFamily={F} fontWeight={700} fontSize={15}>Job application</text>
        {["Full name", "Experience", "Why this job?"].map((lb, i) => {
          const n = Math.max(0, Math.min(22, typed - i * 14));
          return (
            <g key={i}>
              <text x={20} y={68 + i * 36} fill={UI.dim} fontFamily={F} fontWeight={600} fontSize={8}>{lb}</text>
              <rect x={20} y={72 + i * 36} width={280} height={18} rx={4} fill={UI.field} />
              <rect x={26} y={79 + i * 36} width={n * 7} height={4} rx={2} fill={UI.text} opacity={0.75} />
              {n > 0 && n < 22 && Math.sin(t * 18) > 0 && <rect x={27 + n * 7} y={75 + i * 36} width={2} height={12} fill={UI.text} />}
            </g>
          );
        })}
        <rect x={208} y={176} width={92} height={18} rx={9} fill={UI.blue} />
        <text x={254} y={188.5} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={700} fontSize={10}>Submit</text>
      </g>
    );
  } else if (kind === "sent") {
    const p = pop(dt);
    body = (
      <g>
        {bar("careers · apply")}
        <g transform={`translate(160,88) scale(${p})`}>
          <circle r={30} fill={UI.green} />
          <path d="M-13,1 L-4,10 L14,-9" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x={160} y={150} textAnchor="middle" fill={UI.text} fontFamily={F} fontWeight={800} fontSize={21}>Application sent</text>
        <text x={160} y={170} textAnchor="middle" fill={UI.dim} fontFamily={F} fontWeight={600} fontSize={10}>We'll be in touch.</text>
      </g>
    );
  } else if (kind === "rejected") {
    const p = pop(dt);
    body = (
      <g>
        {bar("inbox")}
        <text x={20} y={46} fill={UI.dim} fontFamily={F} fontWeight={600} fontSize={9}>From: Hiring Team</text>
        <text x={20} y={60} fill={UI.text} fontFamily={F} fontWeight={700} fontSize={11}>Re: Your application</text>
        <rect x={20} y={68} width={280} height={1} fill="#2b3550" />
        <g transform={`translate(160,112) scale(${p})`}>
          <rect x={-128} y={-24} width={256} height={48} rx={10} fill="#3a1418" stroke={UI.red} strokeWidth={2.5} />
          <circle cx={-98} cy={0} r={13} fill={UI.red} />
          <path d="M-103,-5 L-93,5 M-93,-5 L-103,5" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" />
          <text x={12} y={8.5} textAnchor="middle" fill="#ff8a8a" fontFamily={F} fontWeight={900} fontSize={23} letterSpacing={1}>NOT SELECTED</text>
        </g>
        <text x={20} y={160} fill={UI.dim} fontFamily={F} fontWeight={500} fontSize={9.5}>Thank you for applying. We have decided</text>
        <text x={20} y={173} fill={UI.dim} fontFamily={F} fontWeight={500} fontSize={9.5}>to move forward with other candidates.</text>
      </g>
    );
  } else if (kind === "inbox") {
    body = (
      <g>
        {bar("inbox")}
        {[0, 1, 2].map((i) => {
          const d = dt - 0.1 - 0.2 * i;
          if (d < 0) return null;
          return (
            <g key={i} transform={`translate(0,${34 + i * 54}) translate(160,22) scale(${pop(d)}) translate(-160,-22)`}>
              <rect x={14} y={0} width={292} height={44} rx={8} fill="#2a1418" stroke={UI.red} strokeWidth={1.6} />
              <circle cx={38} cy={22} r={11} fill={UI.red} />
              <path d="M33.5,17.5 L42.5,26.5 M42.5,17.5 L33.5,26.5" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
              <text x={58} y={20} fill="#ff9a9a" fontFamily={F} fontWeight={800} fontSize={14}>NOT SELECTED</text>
              <text x={58} y={34} fill={UI.dim} fontFamily={F} fontWeight={600} fontSize={8.5}>Re: Your application</text>
            </g>
          );
        })}
      </g>
    );
  } else if (kind === "gigs") {
    const rows: [string, string][] = [["Repair contract", "$1,200"], ["Delivery shift", "$150"], ["Phone repairs", "$375"]];
    body = (
      <g>
        {bar("jobs near you")}
        <text x={20} y={46} fill={UI.text} fontFamily={F} fontWeight={700} fontSize={13}>Open jobs</text>
        {rows.map(([a, b], i) => (
          <g key={i} transform={`translate(0,${58 + i * 44})`}>
            <rect x={14} y={0} width={292} height={36} rx={7} fill={UI.field} />
            <text x={26} y={22} fill={UI.text} fontFamily={F} fontWeight={700} fontSize={12}>{a}</text>
            <text x={196} y={22} fill="#5be08a" fontFamily={F} fontWeight={800} fontSize={12} textAnchor="end">{b}</text>
            <rect x={212} y={8} width={82} height={20} rx={10} fill={UI.green} />
            <text x={253} y={22} textAnchor="middle" fill="#fff" fontFamily={F} fontWeight={800} fontSize={10}>ACCEPT</text>
          </g>
        ))}
      </g>
    );
  } else if (kind === "paid") {
    body = (
      <g>
        {bar("payments")}
        {[["Rent", "$1,800"], ["Mom's medicine", "$600"]].map(([a, b], i) => (
          <g key={i} transform={`translate(0,${44 + i * 56})`}>
            <rect x={14} y={0} width={292} height={44} rx={8} fill="#123222" stroke={UI.green} strokeWidth={1.6} />
            <circle cx={38} cy={22} r={11} fill={UI.green} />
            <path d="M32.5,22 L36.5,26 L43.5,18" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <text x={58} y={27} fill={UI.text} fontFamily={F} fontWeight={800} fontSize={14}>{a}</text>
            <text x={294} y={27} fill="#5be08a" fontFamily={F} fontWeight={800} fontSize={14} textAnchor="end">PAID {b}</text>
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={0} y={0} width={320} height={200} fill={UI.bg} />
      {body}
    </g>
  );
};

// ------------------------------------------------------------------ the laptop, in 3/4 view on the desk
// (x, y) = screen point of the hinge centre; lid 0 = closed, 1 = open (108 degrees); on = screen brightness
export const Laptop: React.FC<{ x: number; y: number; s?: number; yaw?: number; lid: number; screen: ScreenKind; t: number; ts?: number; on?: number; id: string }> = ({
  x, y, s = 1, yaw = 36, lid, screen, t, ts = 0, on = 1, id }) => {
  const W = 150 * s, D = 100 * s, L = 100 * s, TH = 7 * s, LT = 4 * s;
  const f = yaw * DEG, th = Math.max(0, Math.min(1, lid)) * 108 * DEG;
  const a: V3 = [Math.sin(f), 0, Math.cos(f)];   // along the hinge (the user's right)
  const n: V3 = [-Math.cos(f), 0, Math.sin(f)];  // toward the user (and partly the camera)
  const up: V3 = [0, 1, 0];
  const l = add3(mul3(n, Math.cos(th)), mul3(up, Math.sin(th)));    // up the lid
  const m = add3(mul3(n, Math.sin(th)), mul3(up, -Math.cos(th)));   // out of the screen
  const o: V2 = [x, y];
  const B1 = mul3(a, -W / 2), B2 = mul3(a, W / 2), B3 = add3(B2, mul3(n, D)), B4 = add3(B1, mul3(n, D));
  const dn: V3 = [0, -TH, 0];
  const L4 = add3(B1, mul3(l, L)), L3 = add3(B2, mul3(l, L));
  const back = mul3(m, -LT);
  const faceSeen = m[1] * STL + m[2] * CT > 0.02;
  const lit = faceSeen && lid > 0.35 && screen !== "off" ? on * sm((lid - 0.35) / 0.3) : 0;
  const bez = 6 * s, hb = 9 * s;
  const scrM = plane(o, add3(add3(L4, mul3(a, bez)), mul3(l, -bez)), a, mul3(l, -1));
  const dw = W - 2 * bez, dh = L - bez - hb;
  const keyM = plane(o, B1, a, n);
  const cid = `lt${id}`;
  return (
    <g>
      {/* screen light on the desk in front of it */}
      {lit > 0 && <ellipse cx={pj(o, add3(B4, mul3(a, W * 0.5)))[0]} cy={pj(o, add3(B4, mul3(a, W * 0.5)))[1] + 4} rx={W * 0.75} ry={22 * s} fill="#9fbcff" opacity={0.28 * lit} filter="url(#bb10)" />}
      {/* base: front edge, right side, top */}
      <polygon points={poly(o, [B4, B3, add3(B3, dn), add3(B4, dn)])} fill="#4a4f59" stroke="#15171c" strokeWidth={2} strokeLinejoin="round" />
      <polygon points={poly(o, [B2, B3, add3(B3, dn), add3(B2, dn)])} fill="#3c4048" stroke="#15171c" strokeWidth={2} strokeLinejoin="round" />
      <polygon points={poly(o, [B1, B2, B3, B4])} fill="#8a909b" stroke="#15171c" strokeWidth={2.2} strokeLinejoin="round" />
      <g transform={keyM}>
        <rect x={W * 0.08} y={D * 0.1} width={W * 0.84} height={D * 0.42} rx={3} fill="#24262c" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>{Array.from({ length: 12 }).map((_, c) => (
            <rect key={c} x={W * 0.1 + c * W * 0.067} y={D * 0.13 + r * D * 0.095} width={W * 0.055} height={D * 0.07} rx={1} fill="#3a3d45" />
          ))}</g>
        ))}
        <rect x={W * 0.36} y={D * 0.6} width={W * 0.28} height={D * 0.3} rx={3} fill="#7c828d" stroke="#5d626c" strokeWidth={1} />
        {lit > 0 && <rect x={0} y={0} width={W} height={D} fill="#a9c4ff" opacity={0.18 * lit} />}
      </g>
      {/* lid */}
      {faceSeen ? (
        <g>
          <polygon points={poly(o, [add3(B1, back), add3(B2, back), add3(L3, back), add3(L4, back)])} fill="#5a5f69" stroke="#15171c" strokeWidth={2} strokeLinejoin="round" />
          <polygon points={poly(o, [B1, B2, L3, L4])} fill="#16181d" stroke="#15171c" strokeWidth={2.2} strokeLinejoin="round" />
          {lit > 0 && <polygon points={poly(o, [B1, B2, L3, L4])} fill="#cfe0ff" opacity={0.45 * lit} filter="url(#bb10)" />}
          <g transform={scrM}>
            <clipPath id={cid}><rect x={0} y={0} width={dw} height={dh} rx={2} /></clipPath>
            <g clipPath={`url(#${cid})`}>
              <rect x={0} y={0} width={dw} height={dh} fill="#07080b" />
              <g opacity={lit} transform={`scale(${(dw / 320).toFixed(4)},${(dh / 200).toFixed(4)})`}><ScreenUI kind={screen} t={t} ts={ts} /></g>
              <rect x={0} y={0} width={dw} height={dh} fill="url(#lapGloss)" />
            </g>
          </g>
        </g>
      ) : (
        <polygon points={poly(o, [add3(B1, back), add3(B2, back), add3(L3, back), add3(L4, back)])} fill="#6b707a" stroke="#15171c" strokeWidth={2.2} strokeLinejoin="round" />
      )}
    </g>
  );
};

// ------------------------------------------------------------------ the desk (top + things on it; front + drawers)
const DeskClock: React.FC<{ clock: string }> = ({ clock }) => {
  const [cx, cy] = CLOCK_XY;
  return (
    <g>
      <polygon points={`${cx - 40},${cy - 22} ${cx + 40},${cy - 22} ${cx + 36},${cy - 27} ${cx - 36},${cy - 27}`} fill="#22242b" stroke="#0b0b0e" strokeWidth={2} />
      <rect x={cx - 40} y={cy - 22} width={80} height={46} rx={6} fill="#0d0e12" stroke="#2b2d35" strokeWidth={3} />
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={25}>{clock}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={25} opacity={0.6} filter="url(#bb3)">{clock}</text>
      <ellipse cx={cx} cy={cy + 28} rx={44} ry={4} fill="#000" opacity={0.45} filter="url(#bb3)" />
    </g>
  );
};
// a small framed photo: Bean and his mother on a sunny day
export const MomPhoto: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={31} rx={26} ry={4} fill="#000" opacity={0.45} filter="url(#bb3)" />
    <rect x={-23} y={-30} width={46} height={60} rx={3} fill="#4a3424" stroke="#120c08" strokeWidth={2} />
    <rect x={-17} y={-24} width={34} height={48} fill="url(#momSky)" />
    {/* Mom: grey bun, cardigan */}
    <path d="M-15,24 C-15,10 -10,4 -5,4 C0,4 4,10 4,24 Z" fill="#9b7fb0" stroke="#1a1a1a" strokeWidth={1.2} />
    <circle cx={-5} cy={-4} r={8.5} fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <circle cx={-5} cy={-14} r={4} fill="#b9b4ae" stroke="#1a1a1a" strokeWidth={1} />
    <path d="M-13,-7 C-12,-13 2,-13 3,-7 C-2,-10 -8,-10 -13,-7 Z" fill="#b9b4ae" />
    <path d="M-8,-3 h1.6 M-3.6,-3 h1.6" stroke="#1a1a1a" strokeWidth={1.4} strokeLinecap="round" />
    <path d="M-8,1.5 Q-5,3.5 -2,1.5" fill="none" stroke="#1a1a1a" strokeWidth={1} strokeLinecap="round" />
    {/* Bean */}
    <path d="M3,24 C3,12 7,7 11,7 C15,7 18,12 18,24 Z" fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <circle cx={10.5} cy={-1} r={8} fill={BC.skin} stroke="#1a1a1a" strokeWidth={1.2} />
    <path d="M7.5,-2 h1.4 M11.8,-2 h1.4" stroke="#1a1a1a" strokeWidth={1.4} strokeLinecap="round" />
    <path d="M7.5,2.5 Q10.5,4.5 13.5,2.5" fill="none" stroke="#1a1a1a" strokeWidth={1} strokeLinecap="round" />
    <rect x={-17} y={-24} width={34} height={48} fill="url(#momGloss)" />
  </g>
);
const Bills: React.FC = () => {
  // two notices lying on the desk
  const sheet = (x: number, z: number, r: number, k: number) => {
    const o: V2 = [x, DK.y];
    const c = Math.cos(r * DEG), sn = Math.sin(r * DEG);
    const P = (u: number, w: number): V3 => [u * c - w * sn, 0.5, z + u * sn + w * c];
    return (
      <g key={k}>
        <polygon points={poly(o, [P(-34, -26), P(34, -26), P(34, 26), P(-34, 26)])} fill="#d8cfbd" stroke="#6f6758" strokeWidth={1.2} />
        <polygon points={poly(o, [P(-28, -20), P(28, -20), P(28, -12), P(-28, -12)])} fill="#c0392b" />
      </g>
    );
  };
  return <g>{sheet(944, 46, -8, 0)}{sheet(956, 58, 10, 1)}</g>;
};
export const DeskTop: React.FC<{ t: number; clock: string; lid?: number; screen?: ScreenKind; ts?: number; on?: number; bills?: boolean }> = ({
  t, clock, lid = 0, screen = "off", ts = 0, on = 1, bills = true }) => {
  const yb = DK.y - DK.zb * STL, yf = DESK_FRONT_Y;
  return (
    <g>
      <polygon points={`${DK.x0},${yf} ${DK.x1},${yf} ${DK.x1},${yb} ${DK.x0},${yb}`} fill="url(#deskTop)" stroke="#120c08" strokeWidth={2.5} strokeLinejoin="round" />
      <line x1={DK.x0 + 4} y1={yb + 1.5} x2={DK.x1 - 4} y2={yb + 1.5} stroke="#6a4c35" strokeWidth={1.5} opacity={0.6} />
      {bills && <Bills />}
      <MomPhoto x={1000} y={DK.y - 40 * STL - 31} />
      <DeskClock clock={clock} />
      <Laptop id="desk" x={LAPTOP_HINGE[0]} y={LAPTOP_HINGE[1]} lid={lid} screen={screen} t={t} ts={ts} on={on} />
    </g>
  );
};
export const DeskFront: React.FC<{ t: number; drawer?: number; buzz?: number }> = ({ t, drawer = 0, buzz = 0 }) => {
  const yf = DESK_FRONT_Y, yb = yf + DK.th, fl = DESK_FLOOR_FRONT;
  const px0 = 978, px1 = 1126;
  const dd = drawer * 18; // the drawer slides toward the camera
  return (
    <g>
      {/* legs: one back, one front, at the open end */}
      <rect x={814} y={yb} width={11} height={DK.floor - DK.zb * STL - yb + 2} fill="#121317" stroke="#050506" strokeWidth={1.5} />
      <rect x={800} y={yb} width={13} height={fl - yb} fill="#1b1c22" stroke="#050506" strokeWidth={2} />
      <ellipse cx={806} cy={fl} rx={18} ry={4} fill="#000" opacity={0.5} filter="url(#bb3)" />
      {/* the pedestal with two drawers */}
      <rect x={px0} y={yb} width={px1 - px0} height={fl - yb} fill="#231810" stroke="#0e0905" strokeWidth={2.5} />
      <rect x={px0 + 8} y={yb + 6} width={px1 - px0 - 16} height={dd} fill="#050404" />
      {buzz > 0.01 && <>
        <rect x={px0 + 4} y={yb + 1} width={px1 - px0 - 8} height={10} fill="#9fc3ff" opacity={buzz * (0.6 + 0.4 * Math.abs(Math.sin(t * 12)))} filter="url(#bb6)" />
        <ellipse cx={(px0 + px1) / 2} cy={yb + 6} rx={120} ry={30} fill="#7fa8ff" opacity={0.6 * buzz * (0.6 + 0.4 * Math.abs(Math.sin(t * 12)))} filter="url(#bb12)" />
        <rect x={px0 + 10} y={yb + 3} width={px1 - px0 - 20} height={3} fill="#dbe8ff" opacity={buzz * (0.5 + 0.5 * Math.abs(Math.sin(t * 12)))} />
      </>}
      <g transform={`translate(${(buzz > 0.01 ? Math.sin(t * 95) * 1.6 * buzz * (Math.sin(t * 12) > 0 ? 1 : 0.2) : 0).toFixed(2)},0) translate(${px0 + 74},${yb + 34 + dd}) scale(${1 + drawer * 0.04}) translate(${-(px0 + 74)},${-(yb + 34)})`}>
        <rect x={px0 + 6} y={yb + 6} width={px1 - px0 - 12} height={56} rx={3} fill="#33241a" stroke="#0e0905" strokeWidth={2} />
        <line x1={px0 + 9} y1={yb + 8.5} x2={px1 - 9} y2={yb + 8.5} stroke="#5e4431" strokeWidth={1.5} />
        <rect x={px0 + 56} y={yb + 30} width={36} height={6} rx={3} fill="#9c8467" stroke="#2a1f15" strokeWidth={1} />
      </g>
      <rect x={px0 + 6} y={yb + 68 + Math.max(0, dd - 4)} width={px1 - px0 - 12} height={fl - yb - 76 - Math.max(0, dd - 4)} rx={3} fill="#2d2017" stroke="#0e0905" strokeWidth={2} />
      <rect x={px0 + 56} y={yb + 120} width={36} height={6} rx={3} fill="#9c8467" stroke="#2a1f15" strokeWidth={1} />
      <ellipse cx={(px0 + px1) / 2} cy={fl} rx={92} ry={6} fill="#000" opacity={0.55} filter="url(#bb4)" />
      {/* the front edge of the top, drawn last so it sits over the legs */}
      <rect x={DK.x0} y={yf} width={DK.x1 - DK.x0} height={DK.th} fill="#24180f" stroke="#120c08" strokeWidth={2.5} strokeLinejoin="round" />
      <line x1={DK.x0 + 3} y1={yf + 2} x2={DK.x1 - 3} y2={yf + 2} stroke="#6a4c35" strokeWidth={2} opacity={0.7} />
    </g>
  );
};

// ------------------------------------------------------------------ the office chair (Bean's local units, faces right)
export const Chair: React.FC<{ tilt?: number }> = ({ tilt = 0 }) => (
  <g>
    <g transform={`rotate(${-6 + tilt} -58 -96)`}>
      <rect x={-64} y={-118} width={10} height={28} fill="#2a2c33" stroke="#0b0b0e" strokeWidth={2} />
      <path d="M-74,-118 C-80,-170 -80,-232 -70,-268 C-66,-280 -50,-280 -47,-268 C-53,-230 -53,-172 -48,-118 Z" fill="#1d1e24" stroke="#0b0b0e" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-68,-250 C-72,-210 -71,-170 -68,-130" fill="none" stroke="#2f313a" strokeWidth={3} strokeLinecap="round" />
    </g>
    <rect x={-6} y={-78} width={12} height={46} fill="#2f3139" stroke="#0b0b0e" strokeWidth={2} />
    <rect x={-60} y={-94} width={122} height={18} rx={9} fill="#23252c" stroke="#0b0b0e" strokeWidth={3} />
    <path d="M-58,-31 L58,-31 L58,-23 L-58,-23 Z" fill="#26282f" stroke="#0b0b0e" strokeWidth={2} />
    {[-52, 0, 52].map((cx) => <circle key={cx} cx={cx} cy={-11} r={9} fill="#121317" stroke="#0b0b0e" strokeWidth={2} />)}
    <ellipse cx={0} cy={0} rx={64} ry={6} fill="#000" opacity={0.45} filter="url(#bb3)" />
  </g>
);
export const ChairAt: React.FC<{ x: number; y: number; s?: number; flip?: boolean; tilt?: number }> = ({ x, y, s = 1.3, flip, tilt }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}><Chair tilt={tilt} /></g>
);

// screen light falling on Bean's face (drawn over him)
export const FaceGlow: React.FC<{ x: number; y: number; amount: number; s?: number }> = ({ x, y, amount, s = 1 }) =>
  amount > 0.01 ? (
    <g style={{ mixBlendMode: "screen" }}>
      <ellipse cx={x} cy={y} rx={78 * s} ry={98 * s} fill="#8fb0ff" opacity={0.3 * amount} filter="url(#bb30)" />
      <ellipse cx={x + 16 * s} cy={y + 4 * s} rx={40 * s} ry={60 * s} fill="#cfe0ff" opacity={0.22 * amount} filter="url(#bb12)" />
    </g>
  ) : null;

// ------------------------------------------------------------------ a full-frame insert of the laptop screen
export const ScreenInsert: React.FC<{ kind: ScreenKind; t: number; ts: number; reflect?: number }> = ({ kind, t, ts, reflect = 1 }) => {
  const X = 380, Y = 150, Wd = 1180, Hd = 738;
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#050608" />
      <rect x={X - 40} y={Y - 40} width={Wd + 80} height={Hd + 80} rx={34} fill="#14161b" stroke="#2a2d35" strokeWidth={4} />
      <circle cx={X + Wd / 2} cy={Y - 20} r={5} fill="#272a31" />
      <rect x={X - 120} y={Y + Hd + 52} width={Wd + 240} height={220} rx={18} fill="#6b707a" />
      <rect x={X - 120} y={Y + Hd + 52} width={Wd + 240} height={10} fill="#8a909b" />
      <g transform={`translate(${X},${Y}) scale(${Wd / 320},${Hd / 200})`}>
        <clipPath id="insClip"><rect x={0} y={0} width={320} height={200} rx={1.5} /></clipPath>
        <g clipPath="url(#insClip)"><ScreenUI kind={kind} t={t} ts={ts} /></g>
      </g>
      {/* his face, faintly reflected; and a sheen */}
      <g opacity={0.035 * reflect}>
        <circle cx={X + 260} cy={Y + 260} r={220} fill={BC.skin} filter="url(#bb12)" />
      </g>
      <rect x={X} y={Y} width={Wd} height={Hd} fill="url(#insGloss)" />
      <rect x={X - 60} y={Y - 60} width={Wd + 120} height={Hd + 120} fill="none" stroke="#9fbcff" strokeWidth={40} opacity={0.06} filter="url(#bb30)" />
    </g>
  );
};


// ------------------------------------------------------------------ his phone inside the desk drawer, seen from above
// (v7.1: messages appear on the phone itself). Ava's text lights it up in the dark closed drawer; Mom's thank-you is
// there when he pulls the drawer open (open 0..1, with his hand on its front edge).
export const DrawerPhone: React.FC<{ t: number; ts: number; open?: number; clock: string; day: string; from: string; lines: string[] }> = ({
  t, ts, open = 0, clock, day, from, lines }) => {
  const lit = sm((t - ts) / 0.12);
  const since = t - ts, ph = ((since % 0.9) + 0.9) % 0.9;
  const vib = since > 0 && since < 1.9 && (ph < 0.2 || (ph > 0.32 && ph < 0.52)) ? 1 : 0;
  const jx = vib * Math.sin(t * 190) * 3, jy = vib * Math.cos(t * 170) * 2;
  const PW = 440, PH = 900;
  const na = sm((t - ts) / 0.25);
  const cardH = 96 + 40 * lines.length;
  const warm = open;
  return (
    <g>
      <rect x={-300} y={-200} width={2520} height={1480} fill="#040302" />
      {/* the drawer box: floor, back wall, side walls */}
      <rect x={250} y={-60} width={1420} height={1240} fill="#1d140d" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M250,${40 + i * 120} C700,${20 + i * 120} 1200,${70 + i * 120} 1670,${40 + i * 120}`} fill="none" stroke="#120c07" strokeWidth={3} opacity={0.6} />
      ))}
      <polygon points="250,-60 1670,-60 1610,30 310,30" fill="#2a1d13" />
      <polygon points="250,-60 310,30 310,1180 250,1180" fill="#24190f" />
      <polygon points="1670,-60 1610,30 1610,1180 1670,1180" fill="#24190f" />
      {/* odds and ends */}
      <g opacity={0.9}>
        <rect x={420} y={200} width={22} height={300} rx={8} fill="#3b3f4a" transform="rotate(-24 431 350)" />
        <circle cx={1420} cy={820} r={30} fill="#7a6a4a" /><circle cx={1470} cy={860} r={26} fill="#6d5e41" />
        <rect x={1330} y={180} width={200} height={140} rx={4} fill="#3a352c" transform="rotate(12 1430 250)" />
      </g>
      {/* the phone's light on the drawer floor, then the room's light as the drawer opens */}
      <ellipse cx={960} cy={510} rx={560} ry={620} fill="#8fb0ff" opacity={0.26 * lit} filter="url(#bb30)" />
      <rect x={-300} y={-200} width={2520} height={1480} fill="url(#drawerSpill)" opacity={warm} />
      <g transform={`translate(${960 + jx},${505 + jy}) rotate(-7) scale(0.94)`}>
        <rect x={-PW / 2 + 10} y={-PH / 2 + 16} width={PW} height={PH} rx={62} fill="#000" opacity={0.6} filter="url(#bb12)" />
        <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} rx={62} fill="#15171c" stroke="#34373f" strokeWidth={4} />
        <rect x={-PW / 2 + 14} y={-PH / 2 + 14} width={PW - 28} height={PH - 28} rx={50} fill="url(#lockWall)" />
        <rect x={-50} y={-PH / 2 + 26} width={100} height={30} rx={15} fill="#000" />
        <g opacity={lit}>
          <text x={0} y={-PH / 2 + 128} textAnchor="middle" fill="#e9eef7" fontFamily="Avenir Next" fontWeight={600} fontSize={26}>{day}</text>
          <text x={0} y={-PH / 2 + 250} textAnchor="middle" fill="#f4f6fb" fontFamily="Avenir Next" fontWeight={500} fontSize={124}>{clock}</text>
          <g transform={`translate(0,${(1 - na) * -30})`} opacity={na}>
            <rect x={-PW / 2 + 26} y={-PH / 2 + 320} width={PW - 52} height={cardH} rx={28} fill="#30343f" opacity={0.95} />
            <rect x={-PW / 2 + 46} y={-PH / 2 + 342} width={46} height={46} rx={12} fill="#34c759" />
            <path d={`M${-PW / 2 + 69},${-PH / 2 + 353} c-11,0 -16,6 -16,12 c0,4 2,7 6,9 l-2,6 l7,-4 c2,0 3,1 5,1 c11,0 16,-6 16,-12 c0,-6 -5,-12 -16,-12 z`} fill="#fff" />
            <text x={-PW / 2 + 106} y={-PH / 2 + 374} fill="#fff" fontFamily="Avenir Next" fontWeight={800} fontSize={29}>{from}</text>
            <text x={PW / 2 - 46} y={-PH / 2 + 374} textAnchor="end" fill="#a6abb6" fontFamily="Avenir Next" fontWeight={600} fontSize={22}>now</text>
            {lines.map((ln, i) => (
              <text key={i} x={-PW / 2 + 46} y={-PH / 2 + 428 + i * 40} fill="#f2f4f8" fontFamily="Avenir Next" fontWeight={500} fontSize={29}>{ln}</text>
            ))}
          </g>
        </g>
        <rect x={-PW / 2 + 14} y={-PH / 2 + 14} width={PW - 28} height={PH - 28} rx={50} fill="#000" opacity={0.85 * (1 - lit)} />
        <rect x={-PW / 2 + 14} y={-PH / 2 + 14} width={PW - 28} height={PH - 28} rx={50} fill="url(#insGloss)" />
      </g>
      {/* the drawer's front edge at the bottom, and his hand pulling it */}
      <rect x={250} y={936} width={1420} height={200} fill="#33241a" stroke="#0e0905" strokeWidth={3} />
      <rect x={250} y={936} width={1420} height={6} fill="#5e4431" />
      {open > 0.01 && (
        <g transform={`translate(1010,${912 + (1 - sm(open * 3)) * 110})`}>
          <path d="M-70,40 L-110,200 L110,200 L80,40 Z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth={10} strokeLinejoin="round" />
          <path d="M-70,40 L-110,200 L110,200 L80,40 Z" fill="#efe3cf" />
          <path d="M0,-60 C58,-60 92,-28 92,14 C92,58 52,84 0,84 C-52,84 -92,58 -92,14 C-92,-28 -58,-60 0,-60 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={6} />
          <ellipse cx={-20} cy={22} rx={40} ry={34} fill="#cfc4b3" opacity={0.55} />
          {/* fingertips curled over the drawer's edge */}
          <path d="M-62,-34 C-40,-62 40,-62 62,-34" fill="none" stroke="#1a1a1a" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
          <path d="M-96,10 C-122,0 -128,34 -108,52 C-96,62 -80,52 -78,36 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={5} strokeLinejoin="round" />
        </g>
      )}
      <rect x={-300} y={-200} width={2520} height={1480} fill="url(#topVig)" />
    </g>
  );
};

export const DeskDefs: React.FC = () => (
  <defs>
    <linearGradient id="deskTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a291d" /><stop offset="0.6" stopColor="#33241a" /><stop offset="1" stopColor="#4a3423" /></linearGradient>
    <linearGradient id="lapGloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.1} /><stop offset="0.45" stopColor="#fff" stopOpacity={0.02} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient>
    <linearGradient id="insGloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.07} /><stop offset="0.35" stopColor="#fff" stopOpacity={0.015} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient>
    <linearGradient id="momSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2c78f" /><stop offset="1" stopColor="#c98a5a" /></linearGradient>
    <linearGradient id="momGloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.25} /><stop offset="0.5" stopColor="#fff" stopOpacity={0} /></linearGradient>
    <linearGradient id="lockWall" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#24345e" /><stop offset="0.55" stopColor="#131b33" /><stop offset="1" stopColor="#0a0e1a" /></linearGradient>
    <linearGradient id="drawerSpill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffb466" stopOpacity={0.5} /><stop offset="0.45" stopColor="#ffb466" stopOpacity={0.12} /><stop offset="1" stopColor="#ffb466" stopOpacity={0} /></linearGradient>
  </defs>
);
