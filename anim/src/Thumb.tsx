// Thumbnails for film 1, "TOMORROW | He Kept Saying It" (Inner Devil Films). 1920 x 1080, exported as JPG.
// The genre's covers share one big face in one hard emotion, one everyday object, 1-3 fat words and one glow.
// A: his worried face, the rent notice in his hand, the Devil's eyes and grin in the dark behind, "30 DAYS".
// B: the Devil's face filling the right half, Bean small and looking up at it, the Devil's word "AGAIN?".
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEAN_EXPR, BeanDefs, BC } from "./rig/bean";
import { FRONT, TQ } from "./rig/beanPoses";
import { Char, DevilFig, P } from "./film/kit";

const Mitten: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M-70,60 L-120,420 L120,420 L80,60 Z" fill={BC.line} stroke={BC.line} strokeWidth={12} strokeLinejoin="round" />
    <path d="M-70,60 L-120,420 L120,420 L80,60 Z" fill={BC.skin} />
    <path d="M0,-80 C70,-80 110,-36 110,20 C110,80 64,112 0,112 C-64,112 -110,80 -110,20 C-110,-36 -70,-80 0,-80 Z" fill={BC.skin} stroke={BC.line} strokeWidth={8} />
    <ellipse cx={-26} cy={36} rx={50} ry={46} fill={BC.shade} opacity={0.55} />
    <path d="M-92,-46 C-128,-70 -150,-24 -128,6 C-112,28 -84,16 -78,-6 Z" fill={BC.skin} stroke={BC.line} strokeWidth={7} strokeLinejoin="round" />
  </g>
);

const BigWord: React.FC<{ text: string; x: number; y: number; size: number; color?: string; glow?: string; font?: string; rotate?: number }> = ({
  text, x, y, size, color = "#ffffff", glow, font = "Avenir Next", rotate = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, transformOrigin: "0 0", fontFamily: font, fontWeight: 900, fontSize: size, lineHeight: 1,
    color, letterSpacing: 2, WebkitTextStroke: "10px #000", paintOrder: "stroke fill",
    textShadow: `0 10px 0 #000${glow ? `, 0 0 40px ${glow}, 0 0 90px ${glow}` : ""}` }}>{text}</div>
);

export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 76% 30%, #5a0905 0%, #1c0605 38%, #070506 70%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <BeanDefs />
      {/* the Devil in the dark behind him */}
      <DevilFig id="ta" pose={P({ ...FRONT, head: [0, -384] })} x={1500} y={480 + 390 * 3.2} s={3.2} t={0} glow={1.8} face="mischievous" smoke={0} />
      {/* Bean, worried, eyes on the notice */}
      <Char id="tb" pose={FRONT} e={{ ...BEAN_EXPR.worried, lid: 0.16, bi: -16, bo: 9, mc: -5, bags: 1, lx: 7, ly: 3, es: 1.06 }} x={600} y={650 + 390 * 3.15} s={3.15} t={0} />
      {/* the notice in his hand */}
      <g transform="translate(1160,700) rotate(7)">
        <rect x={-196} y={-250} width={392} height={500} rx={6} fill="#000" opacity={0.6} transform="translate(14,18)" />
        <rect x={-196} y={-250} width={392} height={500} rx={6} fill="#f1e9d8" stroke="#1a1a1a" strokeWidth={6} />
        <rect x={-166} y={-218} width={332} height={84} fill="#c0392b" />
        <text x={0} y={-162} textAnchor="middle" fill="#fff" fontFamily="Avenir Next" fontWeight={900} fontSize={40} letterSpacing={1}>FINAL NOTICE</text>
        <text x={0} y={-62} textAnchor="middle" fill="#221d18" fontFamily="Avenir Next" fontWeight={900} fontSize={52}>RENT DUE</text>
        {[-10, 34, 78, 122].map((yy, i) => <rect key={i} x={-150} y={yy} width={i === 3 ? 200 : 300} height={16} rx={4} fill="#c9bfab" />)}
      </g>
      <Mitten x={985} y={950} r={-14} s={1.05} />
    </svg>
    <BigWord text="30 DAYS" x={70} y={46} size={196} />
  </AbsoluteFill>
);

export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 42%, #6a0b06 0%, #220706 40%, #070506 75%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <BeanDefs />
      <DevilFig id="tbd" pose={P({ ...TQ, head: [10, -384], tilt: 6 })} x={1360} y={520 + 390 * 3.6} s={3.6} t={0} glow={2.0} face="manipulative" smoke={0} />
      <Char id="tbb" pose={FRONT} e={{ ...BEAN_EXPR.worried, lid: 0.1, bi: -16, bo: 9, lx: 9, ly: -7, mo: 1, bags: 1, es: 1.08 }} x={520} y={830 + 390 * 2.6} s={2.6} t={0} />
    </svg>
    <BigWord text="AGAIN?" x={70} y={52} size={210} color="#ff4a3a" glow="rgba(255,40,20,0.85)" font="Chalkboard SE" rotate={-3} />
  </AbsoluteFill>
);
