// Film 02 (JUST ONE MORE): his bed, seen from straight above (the camera on the ceiling). Bean lies on his back,
// face up to the camera (the rig's FRONT view), the blanket to his chest, the phone's back toward us and its light
// on his face. The same shot opens the 3 AM nights and closes the film (the phone face down, him asleep).
// Everything here is drawn in code; no set picture is used for these shots.
import React from "react";
import { random } from "remotion";
import type { Pose } from "../rig/figure";
import { BC, BEAN_EXPR, BeanSVG, DevilSVG, buildBean } from "../rig/bean";
import type { BeanExpr, DevilFace } from "../rig/bean";
import { FRONT } from "../rig/beanPoses";
import { P, mix, sm } from "./kit";

// his head's centre and his scale in the overhead shot
export const OV = { x: 960, y: 250, s: 1.3 };
export const OV_PHONE: [number, number] = [960, 412];      // the phone, held over his chest
export const OV_CLOCK: [number, number] = [1478, 176];      // the clock on the bedside table
const FEET_Y = OV.y + 390 * OV.s;
// lying on his back: arms by his sides under the blanket, head a touch to one side on the pillow
export const LIE = P({ ...FRONT, tilt: -4 });

const Planks: React.FC<{ day?: number }> = ({ day = 0 }) => {
  const out: React.ReactNode[] = [];
  const tones = ["#1d130c", "#22160d", "#1f140b", "#26180e", "#1b120a"];
  for (let col = 0; col < 14; col++) {
    const x = -300 + col * 190;
    let y = -400 - ((col * 173) % 500), c = 0;
    while (y < 1500) {
      const h = 520 + ((col * 89 + c * 137) % 300);
      out.push(<rect key={`${col}_${c}`} x={x} y={y} width={187} height={h - 3} fill={tones[(col * 2 + c * 3) % tones.length]} />);
      y += h; c++;
    }
  }
  return <g>{out}{day > 0 && <rect x={-400} y={-400} width={2720} height={1900} fill="#e0b070" opacity={0.18 * day} />}</g>;
};

// the bed: frame, sheet, pillow (no blanket: that is drawn over Bean)
export const BedBase: React.FC<{ day?: number }> = ({ day = 0 }) => (
  <g>
    <Planks day={day} />
    {/* rug */}
    <rect x={300} y={560} width={1320} height={900} rx={30} fill="#2a2430" opacity={0.7} />
    {/* frame and headboard */}
    <rect x={566} y={-40} width={788} height={1500} rx={18} fill="#2b1c12" stroke="#0e0905" strokeWidth={4} />
    <rect x={560} y={-60} width={800} height={92} rx={14} fill="#3a2718" stroke="#0e0905" strokeWidth={4} />
    <rect x={576} y={-44} width={768} height={10} fill="#5b3f28" opacity={0.6} />
    {/* mattress / sheet */}
    <rect x={590} y={36} width={740} height={1440} rx={26} fill={mix(0, 1, day) > 0.5 ? "#9aa6bd" : "#3d475e"} />
    <rect x={590} y={36} width={740} height={1440} rx={26} fill="url(#ovSheet)" />
    {/* pillow */}
    <g>
      <rect x={712} y={70} width={496} height={250} rx={90} fill="#000" opacity={0.35} transform="translate(8,14)" filter="url(#bb10)" />
      <rect x={712} y={70} width={496} height={250} rx={90} fill="#59627a" stroke="#1d2230" strokeWidth={4} />
      <path d="M760,110 C900,90 1040,92 1170,112" stroke="#6f7892" strokeWidth={6} fill="none" opacity={0.7} />
      <path d="M740,290 C880,306 1050,304 1180,286" stroke="#3f465a" strokeWidth={6} fill="none" opacity={0.7} />
      <ellipse cx={OV.x + 6} cy={OV.y + 24} rx={150} ry={92} fill="#2e3446" opacity={0.75} filter="url(#bb12)" />
    </g>
  </g>
);

// the blanket from his chest down (drawn over Bean's body)
export const Blanket: React.FC<{ y?: number; day?: number }> = ({ y = 448, day = 0 }) => {
  const c1 = day > 0.5 ? "#7c8db0" : "#2b3550", c2 = day > 0.5 ? "#91a1c2" : "#38446a", line = "#151a28";
  return (
    <g>
      <path d={`M592,${y + 14} C760,${y - 10} 1160,${y - 10} 1328,${y + 14} L1340,1500 L580,1500 Z`} fill="#000" opacity={0.4} filter="url(#bb10)" transform="translate(0,-8)" />
      <path d={`M588,${y + 10} C760,${y - 14} 1160,${y - 14} 1332,${y + 10} L1342,1500 L578,1500 Z`} fill={c1} stroke={line} strokeWidth={4} strokeLinejoin="round" />
      {/* the folded-over sheet at the top edge */}
      <path d={`M588,${y + 10} C760,${y - 14} 1160,${y - 14} 1332,${y + 10} L1334,${y + 74} C1160,${y + 52} 760,${y + 52} 586,${y + 74} Z`} fill="#c9cfdc" stroke={line} strokeWidth={4} strokeLinejoin="round" opacity={day > 0.5 ? 1 : 0.62} />
      {/* his body's shape under the blanket and the folds */}
      <path d={`M840,${y + 90} C880,${y + 300} 900,${y + 520} 880,${y + 800}`} stroke={c2} strokeWidth={34} fill="none" opacity={0.7} filter="url(#bb12)" />
      <path d={`M1080,${y + 90} C1040,${y + 300} 1020,${y + 520} 1040,${y + 800}`} stroke={c2} strokeWidth={34} fill="none" opacity={0.7} filter="url(#bb12)" />
      <path d={`M700,${y + 160} C760,${y + 300} 740,${y + 420} 780,${y + 560} M1230,${y + 140} C1180,${y + 320} 1200,${y + 430} 1160,${y + 600} M930,${y + 380} C960,${y + 470} 990,${y + 520} 970,${y + 640}`}
        stroke={line} strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
    </g>
  );
};

// the bedside table to his right (seen from above) with its clock (the clock's face tipped toward us)
export const Bedside: React.FC<{ clock: string; phoneDown?: boolean; lamp?: number }> = ({ clock, phoneDown, lamp = 0 }) => (
  <g>
    <rect x={1392} y={52} width={270} height={250} rx={12} fill="#000" opacity={0.45} transform="translate(10,14)" filter="url(#bb10)" />
    <rect x={1392} y={52} width={270} height={250} rx={12} fill="#3a2718" stroke="#0e0905" strokeWidth={4} />
    <rect x={1404} y={64} width={246} height={226} rx={8} fill="#432d1c" />
    {lamp > 0 && <circle cx={1590} cy={110} r={140} fill="#ffcf8a" opacity={0.25 * lamp} filter="url(#bb30)" />}
    <circle cx={1590} cy={110} r={40} fill="#b9a383" stroke="#1a120b" strokeWidth={4} />
    <circle cx={1590} cy={110} r={22} fill={lamp > 0 ? "#fff1cc" : "#8a7a60"} />
    {/* clock */}
    <g transform={`translate(${OV_CLOCK[0]},${OV_CLOCK[1]})`}>
      <rect x={-62} y={-30} width={124} height={62} rx={9} fill="#0d0e12" stroke="#2b2d35" strokeWidth={4} />
      <text x={0} y={13} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={34}>{clock}</text>
      <text x={0} y={13} textAnchor="middle" fill="#ff3b2a" fontFamily="Menlo" fontWeight={700} fontSize={34} opacity={0.6} filter="url(#bb3)">{clock}</text>
    </g>
    {phoneDown && (
      <g transform="translate(1474,252) rotate(-8)">
        <rect x={-38} y={-62} width={76} height={124} rx={14} fill="#1b1d23" stroke="#34373f" strokeWidth={3} />
        <rect x={-26} y={-50} width={20} height={20} rx={6} fill="#2c2f37" />
        {/* the cable, plugged in */}
        <path d="M0,62 C0,110 60,120 120,180" stroke="#e8e8e8" strokeWidth={5} fill="none" />
      </g>
    )}
  </g>
);

// Bean lying in the bed (head on the pillow); lift = the phone-drop gag; the blanket goes over him
export const LyingBean: React.FC<{ id: string; t: number; e: BeanExpr; pose?: Pose; tear?: number; dy?: number }> = ({ id, t, e, pose = LIE, tear = 0, dy = 0 }) => (
  <g transform={`translate(${OV.x},${(FEET_Y + dy).toFixed(1)}) scale(${OV.s})`}>
    <BeanSVG items={buildBean(pose, e, { idp: id, view: "front", contact: false })} />
    {tear > 0.01 && tear < 0.999 && (
      // a tear running from the eye toward the pillow
      <path transform={`translate(${-31 + Math.sin(t) * 0},${-386 + tear * 40})`} d="M0,-9 C4,-3 6,2 6,5 A6,6 0 1 1 -6,5 C-6,2 -4,-3 0,-9 Z" fill="#cfe7ff" stroke="#7fb4e6" strokeWidth={1.5}
        opacity={Math.min(1, tear * 6) * (1 - Math.max(0, tear - 0.8) * 5)} />
    )}
  </g>
);

// the phone in his two hands, its back to the camera; h = how high he holds it (1 = up near the camera, over his face)
export const HeldPhone: React.FC<{ t: number; lit: number; h?: number; x?: number; y?: number; rot?: number; hands?: boolean; dead?: boolean; oneHand?: boolean }> = ({
  t, lit, h = 0, x = OV_PHONE[0], y = OV_PHONE[1], rot = -6, hands = true, dead = false, oneHand = false }) => {
  const s = 1 + 0.9 * h;                       // nearer the camera = bigger
  const yy = mix(y, OV.y + 30, h);             // held up, it is over his face
  const jit = Math.sin(t * 2.1) * 2;
  return (
    <g transform={`translate(${x + jit},${yy}) rotate(${rot}) scale(${s})`}>
      {lit > 0.01 && !dead && <ellipse cx={0} cy={-150} rx={170} ry={130} fill="#9fc0ff" opacity={0.0} />}
      <rect x={-44} y={-78} width={88} height={156} rx={18} fill="#000" opacity={0.45} transform="translate(8,12)" filter="url(#bb6)" />
      <rect x={-44} y={-78} width={88} height={156} rx={18} fill="#22252d" stroke="#3a3e48" strokeWidth={3} />
      <rect x={-32} y={-66} width={30} height={30} rx={9} fill="#2f333c" stroke="#15171c" strokeWidth={2} />
      <circle cx={-17} cy={-51} r={7} fill="#0b0c10" />
      {/* the screen's light spilling round the top edge */}
      {lit > 0.01 && <rect x={-46} y={-82} width={92} height={10} rx={5} fill="#cfe0ff" opacity={0.9 * lit} filter="url(#bb3)" />}
      {hands && [-1, 1].filter((sd) => !(oneHand && sd === 1)).map((sd) => (
        <g key={sd} transform={`translate(${sd * 46},${30}) scale(${sd},1)`}>
          <path d="M0,-34 C22,-34 32,-14 30,10 C28,32 14,44 -4,42 C-22,40 -30,24 -28,4 C-26,-18 -18,-34 0,-34 Z" fill={BC.skin} stroke={BC.line} strokeWidth={4.5} />
          <path d="M-10,-30 C-30,-40 -40,-20 -32,-6" fill="none" stroke={BC.line} strokeWidth={3.5} strokeLinecap="round" />
          <ellipse cx={8} cy={8} rx={12} ry={16} fill={BC.shade} opacity={0.5} />
        </g>
      ))}
    </g>
  );
};

// the light of the screen on his face and the pillow, and the dark room around it
export const PhoneLight: React.FC<{ lit: number; flicker?: number; color?: string }> = ({ lit, flicker = 0, color = "#9fc0ff" }) => {
  const a = lit * (1 - flicker);
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1900} fill="url(#ovDark)" opacity={0.92 - 0.25 * a} />
      {a > 0.01 && (
        <g style={{ mixBlendMode: "screen" }}>
          <ellipse cx={OV.x} cy={OV.y + 70} rx={250} ry={230} fill={color} opacity={0.32 * a} filter="url(#bb30)" />
          <ellipse cx={OV.x + 10} cy={OV.y + 20} rx={120} ry={110} fill="#d6e4ff" opacity={0.2 * a} filter="url(#bb12)" />
        </g>
      )}
    </g>
  );
};

// the Devil leaning over the headboard: its face upside down over his, the shoulders going out of frame at the top
export const DevilOver: React.FC<{ id: string; t: number; y: number; s?: number; face?: DevilFace; glow?: number; op?: number; detail?: number }> = ({ id, t, y, s = 1.6, face = "manipulative", glow = 1.4, op = 1, detail = 1 }) => {
  const sway = Math.sin(t * 1.6) * 6;
  const items = buildBean(FRONT, BEAN_EXPR.neutral, { idp: id, devil: true, horns: 1, devilFace: face });
  return (
    <g opacity={op} transform={`translate(${OV.x + sway},${y}) rotate(180) scale(${s}) translate(0,390)`}>
      <DevilSVG items={items} glow={glow} detailOp={detail} />
    </g>
  );
};

// smoke pouring out of the dead phone and spreading over the blanket
export const PhoneSmoke: React.FC<{ t: number; amount: number; x?: number; y?: number }> = ({ t, amount, x = OV_PHONE[0], y = OV_PHONE[1] }) => {
  if (amount < 0.01) return null;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 42; i++) {
    const r0 = random(`ps${i}`);
    const ph = (t * 0.35 + r0) % 1;
    const a = random(`pa${i}`) * Math.PI * 2;
    const d = ph * (180 + 620 * amount);
    const px = x + Math.cos(a) * d * 1.15, py = y + Math.sin(a) * d * 0.8 + 40 * ph;
    const r = 30 + ph * 110;
    const o = amount * Math.min(1, ph * 6) * (1 - ph);
    out.push(<circle key={`a${i}`} cx={px} cy={py} r={r} fill="#0b0506" opacity={o * 0.85} filter="url(#bb10)" />);
    out.push(<circle key={`b${i}`} cx={px} cy={py} r={r * 0.9} fill="none" stroke="#ff2d1f" strokeWidth={3} opacity={o * 0.4} filter="url(#bb4)" />);
  }
  return <g>{out}</g>;
};

export const BedDefs: React.FC = () => (
  <defs>
    <radialGradient id="ovSheet" cx="50%" cy="20%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity={0.06} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient>
    <radialGradient id="ovDark" gradientUnits="userSpaceOnUse" cx={OV.x} cy={OV.y + 90} r={900}><stop offset="0.12" stopColor="#000" stopOpacity={0} /><stop offset="0.6" stopColor="#000" stopOpacity={0.55} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient>
  </defs>
);

// ------------------------------------------------------------------ the charger: a white cable from the bedside table
// to a plug lying on the blanket. plug = where the plug's tip is; ang = which way it points; held = his mitten on it
export const PLUG_REST: [number, number] = [1215, 548];     // where the plug lies on the blanket
export const PLUG_HAND: [number, number] = [1046, 500];     // the ember has pushed it to his hand
export const PLUG_PORT: [number, number] = [975, 512];      // a finger's width from the phone's port
export const Charger: React.FC<{ plug: [number, number]; ang?: number; held?: boolean; swing?: number; t?: number }> = ({ plug, ang = -100, held = false, swing = 0, t = 0 }) => {
  const a = ((ang + swing * Math.sin(t * 9) * 18) * Math.PI) / 180;
  const tail: [number, number] = [plug[0] - Math.cos(a) * 30, plug[1] - Math.sin(a) * 30];
  const src: [number, number] = [1440, 250];
  const mid: [number, number] = [mix(src[0], tail[0], 0.5) + 60, mix(src[1], tail[1], 0.5) + 120];
  return (
    <g>
      <path d={`M${src[0]},${src[1]} Q${mid[0]},${mid[1]} ${tail[0]},${tail[1]}`} stroke="#000" strokeOpacity={0.4} strokeWidth={9} fill="none" transform="translate(4,6)" filter="url(#bb3)" />
      <path d={`M${src[0]},${src[1]} Q${mid[0]},${mid[1]} ${tail[0]},${tail[1]}`} stroke="#d9dbe0" strokeWidth={6} fill="none" strokeLinecap="round" />
      <g transform={`translate(${plug[0]},${plug[1]}) rotate(${(a * 180) / Math.PI + 90})`}>
        <rect x={-9} y={0} width={18} height={30} rx={4} fill="#f2f3f5" stroke="#3a3d45" strokeWidth={2.5} />
        <rect x={-5} y={-9} width={10} height={10} rx={2} fill="#b9bcc4" stroke="#3a3d45" strokeWidth={2} />
      </g>
      {held && (
        <g transform={`translate(${plug[0] + 8},${plug[1] + 30}) rotate(-20)`}>
          <path d="M0,-30 C20,-30 30,-12 28,10 C26,30 13,40 -4,38 C-20,36 -28,22 -26,4 C-24,-16 -17,-30 0,-30 Z" fill={BC.skin} stroke={BC.line} strokeWidth={4.5} />
          <path d="M-14,-26 C-30,-32 -36,-14 -28,-2" fill="none" stroke={BC.line} strokeWidth={3.5} strokeLinecap="round" />
          <ellipse cx={8} cy={8} rx={11} ry={14} fill={BC.shade} opacity={0.5} />
        </g>
      )}
    </g>
  );
};

// his phone held to his ear (a call), seen from above
export const EarPhone: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(${OV.x + 128},${OV.y + 40 + Math.sin(t * 1.3) * 2}) rotate(64)`}>
    <rect x={-40} y={-74} width={80} height={148} rx={17} fill="#22252d" stroke="#3a3e48" strokeWidth={3} />
    <rect x={-30} y={-64} width={28} height={28} rx={8} fill="#2f333c" />
    <g transform="translate(14,52) rotate(-64)">
      <path d="M0,-34 C22,-34 32,-14 30,10 C28,32 14,44 -4,42 C-22,40 -30,24 -28,4 C-26,-18 -18,-34 0,-34 Z" fill={BC.skin} stroke={BC.line} strokeWidth={4.5} />
      <ellipse cx={8} cy={8} rx={12} ry={16} fill={BC.shade} opacity={0.5} />
    </g>
  </g>
);

// morning: sunlight through the blinds, in bars across the bed
export const Blinds: React.FC<{ amount: number }> = ({ amount }) => amount > 0.01 ? (
  <g style={{ mixBlendMode: "screen" }} opacity={amount}>
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d={`M${200 + i * 150},-200 L${330 + i * 150},-200 L${-80 + i * 150},1400 L${-210 + i * 150},1400 Z`} fill="#ffd9a0" opacity={0.22} filter="url(#bb10)" />
    ))}
  </g>
) : null;

// the small red charging light of the phone lying face down on the bedside table
export const ChargeGlow: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <circle cx={1474} cy={330} r={120} fill="#ff3b2a" opacity={0.16 + 0.04 * Math.sin(t * 1.2)} filter="url(#bb30)" />
    <circle cx={1474} cy={316} r={5} fill="#ff6a5a" />
  </g>
);
