// Inner Devil Films: channel logo (800 x 800) and banner (2560 x 1440). The mark is Bean's own head split down the
// middle: his half on the left, the Devil's half (black, red rim, one horn, the slit eye and half the grin) on the right.
// The devil is inside him; the films show the two voices in one head.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEAN_EXPR, BeanDefs, BeanSVG, DevilSVG, buildBean } from "./rig/bean";
import { FRONT } from "./rig/beanPoses";
import { Angel } from "./rig/angel";

// the split head, centred at (cx, cy) with head radius 84 * s
export const SplitHead: React.FC<{ cx: number; cy: number; s: number; id: string }> = ({ cx, cy, s, id }) => {
  const head = `translate(${cx},${cy}) scale(${s}) translate(0,390)`;
  const bean = buildBean(FRONT, { ...BEAN_EXPR.determined, lx: 2, ly: 1 }, { idp: `${id}b`, headOnly: true });
  const devil = buildBean(FRONT, BEAN_EXPR.neutral, { idp: `${id}d`, headOnly: true, devil: true, horns: 1, devilFace: "mischievous" });
  const R = 84 * s;
  return (
    <g>
      <clipPath id={`${id}L`}><rect x={cx - 3 * R} y={cy - 4 * R} width={3 * R} height={8 * R} /></clipPath>
      <clipPath id={`${id}R`}><rect x={cx} y={cy - 4 * R} width={3 * R} height={8 * R} /></clipPath>
      <ellipse cx={cx + R * 0.55} cy={cy - R * 0.2} rx={R * 1.5} ry={R * 1.9} fill="#ff2d1f" opacity={0.28} filter="url(#bb30)" />
      <ellipse cx={cx - R * 0.6} cy={cy} rx={R * 1.3} ry={R * 1.5} fill="#ffcc66" opacity={0.1} filter="url(#bb30)" />
      <g clipPath={`url(#${id}R)`}><g transform={head}><DevilSVG items={devil} glow={1.5} /></g></g>
      <g clipPath={`url(#${id}L)`}><g transform={head}><BeanSVG items={bean} /></g></g>
      {/* the seam: a thin red crack down the middle of the face */}
      <line x1={cx} y1={cy - R * 0.98} x2={cx} y2={cy + R * 0.98} stroke="#ff2d1f" strokeWidth={Math.max(2, s * 1.6)} opacity={0.8} filter="url(#bb3)" />
    </g>
  );
};

export const IDLogo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 55% 48%, #1c0806 0%, #090607 55%, #040304 100%)" }}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <BeanDefs />
      <SplitHead cx={400} cy={455} s={3.05} id="lg" />
    </svg>
  </AbsoluteFill>
);

// YouTube shows the whole 2560 x 1440 only on TVs; phones show the middle 1546 x 423 (x 507-2053, y 508-931)
export const IDBanner: React.FC = () => (
  <AbsoluteFill style={{ background: "#060506" }}>
    <svg width={2560} height={1440} viewBox="0 0 2560 1440" style={{ position: "absolute", inset: 0 }}>
      <BeanDefs />
      <defs>
        <radialGradient id="bnGold" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffcc66" stopOpacity={0.22} /><stop offset="1" stopColor="#ffcc66" stopOpacity={0} /></radialGradient>
        <radialGradient id="bnRed" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ff2d1f" stopOpacity={0.3} /><stop offset="1" stopColor="#ff2d1f" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={330} cy={720} rx={520} ry={420} fill="url(#bnGold)" />
      <ellipse cx={2260} cy={720} rx={620} ry={460} fill="url(#bnRed)" />
      {/* the two voices at the edges: the Angel's glow on the left, the Devil's eyes in the dark on the right */}
      <Angel x={330} y={700} s={0.95} t={0.4} glow={0.9} />
      <g transform="translate(2265,722)">
        <path d="M-70,-40 C-96,-110 -80,-170 -50,-196 C-56,-140 -44,-90 -20,-62 Z M70,-40 C96,-110 80,-170 50,-196 C56,-140 44,-90 20,-62 Z" fill="#0b0607" stroke="#ff2d1f" strokeWidth={4} />
        <path d="M-64,4 Q-40,-14 -12,8 Q-38,18 -64,4 Z M64,4 Q40,-14 12,8 Q38,18 64,4 Z" fill="#ff2d1f" filter="url(#bb4)" />
        <path d="M-64,4 Q-40,-14 -12,8 Q-38,18 -64,4 Z M64,4 Q40,-14 12,8 Q38,18 64,4 Z" fill="#ff7a5e" />
        <path d="M-46,70 Q0,112 50,62" fill="none" stroke="#ff2d1f" strokeWidth={9} strokeLinecap="round" filter="url(#bb4)" />
        <path d="M-46,70 Q0,112 50,62" fill="none" stroke="#ff7a5e" strokeWidth={4} strokeLinecap="round" />
      </g>
      <SplitHead cx={730} cy={742} s={1.72} id="bn" />
    </svg>
    <div style={{ position: "absolute", left: 930, top: 590, fontFamily: "Avenir Next" }}>
      <div style={{ color: "#f4efe6", fontSize: 126, fontWeight: 900, letterSpacing: 7, lineHeight: 1 }}>INNER DEVIL</div>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 16 }}>
        <div style={{ color: "#ff3b2a", fontSize: 50, fontWeight: 800, letterSpacing: 22, textShadow: "0 0 18px rgba(255,40,20,0.7)" }}>FILMS</div>
        <div style={{ width: 300, height: 5, background: "#ff3b2a", boxShadow: "0 0 14px rgba(255,40,20,0.8)" }} />
      </div>
      <div style={{ color: "#cdbfae", fontSize: 40, fontWeight: 600, marginTop: 26, letterSpacing: 1 }}>When kindness fails, the devil gets to work.</div>
    </div>
  </AbsoluteFill>
);
