// Thumbnails for film 02, "JUST ONE MORE | The Phone Ate His Nights". 1920 x 1080, exported as JPG.
// A: his tired, worried face in the light of the phone in his hand; in its black screen, the Devil's eyes and grin; "3 AM".
// B: the same phone close, the autoplay ring "Next video in 3" over the Devil's face in the glass; "ONE MORE?".
import React from "react";
import { AbsoluteFill } from "remotion";
import { BC, BEAN_EXPR, BeanDefs, DevilSVG, buildBean } from "./rig/bean";
import { FRONT } from "./rig/beanPoses";
import { Char, P } from "./film/kit";

const BigWord: React.FC<{ text: string; x: number; y: number; size: number; color?: string; glow?: string; font?: string; rotate?: number }> = ({
  text, x, y, size, color = "#ffffff", glow, font = "Avenir Next", rotate = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, transformOrigin: "0 0", fontFamily: font, fontWeight: 900, fontSize: size, lineHeight: 1,
    color, letterSpacing: 2, WebkitTextStroke: "12px #000", paintOrder: "stroke fill",
    textShadow: `0 10px 0 #000${glow ? `, 0 0 40px ${glow}, 0 0 90px ${glow}` : ""}` }}>{text}</div>
);
// the phone held in a mitten, its black screen showing the Devil's face; ring = the autoplay ring over it
const DevilPhone: React.FC<{ x: number; y: number; s: number; r?: number; ring?: boolean }> = ({ x, y, s, r = 0, ring }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <circle cx={0} cy={0} r={420} fill="#ff2d1f" opacity={0.35} filter="url(#bb30)" />
    <rect x={-170} y={-330} width={340} height={660} rx={46} fill="#000" opacity={0.6} transform="translate(16,20)" filter="url(#bb12)" />
    <rect x={-170} y={-330} width={340} height={660} rx={46} fill="#16181d" stroke="#3a3e48" strokeWidth={6} />
    <rect x={-154} y={-314} width={308} height={628} rx={34} fill="#030305" />
    <ellipse cx={0} cy={-20} rx={170} ry={220} fill="#ff2d1f" opacity={0.25} filter="url(#bb30)" />
    <g transform="translate(0,-40) scale(1.25) translate(0,390)">
      <DevilSVG items={buildBean(FRONT, BEAN_EXPR.neutral, { idp: "tdp", devil: true, headOnly: true, horns: 1, devilFace: "manipulative" })} glow={1.6} rim="#ff2d1f" fill="#050303" detailOp={1} />
    </g>
    {ring && <g transform="translate(0,170)">
      <circle r={62} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={12} />
      <circle r={62} fill="none" stroke="#fff" strokeWidth={12} strokeDasharray={`${2 * Math.PI * 62 * 0.66} 999`} transform="rotate(-90)" strokeLinecap="round" />
      <path d="M-16,-26 L28,0 L-16,26 Z" fill="#fff" />
    </g>}
    <rect x={-154} y={-314} width={308} height={628} rx={34} fill="url(#thGloss)" />
    <rect x={-40} y={-300} width={80} height={22} rx={11} fill="#000" />
    {/* his mitten round the phone's lower edge */}
    <g transform="translate(-150,250) rotate(-12)">
      <path d="M-60,40 L-110,420 L120,420 L80,40 Z" fill={BC.line} stroke={BC.line} strokeWidth={12} strokeLinejoin="round" />
      <path d="M-60,40 L-110,420 L120,420 L80,40 Z" fill={BC.skin} />
      <path d="M0,-80 C70,-80 110,-36 110,20 C110,80 64,112 0,112 C-64,112 -110,80 -110,20 C-110,-36 -70,-80 0,-80 Z" fill={BC.skin} stroke={BC.line} strokeWidth={8} />
      <ellipse cx={-26} cy={36} rx={50} ry={46} fill={BC.shade} opacity={0.55} />
    </g>
    <g transform="translate(160,240) rotate(14)">
      <path d="M-46,-60 C-10,-80 36,-66 46,-22 C56,22 36,60 2,66 C-30,72 -56,48 -60,10 C-64,-26 -64,-50 -46,-60 Z" fill={BC.skin} stroke={BC.line} strokeWidth={8} strokeLinejoin="round" />
    </g>
  </g>
);
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="thGloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.12} /><stop offset="0.4" stopColor="#fff" stopOpacity={0.02} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient>
  </defs>
);

export const Thumb05A: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 72% 45%, #4a0805 0%, #170506 42%, #060406 75%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <BeanDefs /><Defs />
      {/* Bean, tired and worried, his eyes on the phone; its red light on his face */}
      <Char id="t5a" pose={P({ ...FRONT, tilt: 5 })} e={{ ...BEAN_EXPR.worried, lid: 0.34, bi: -16, bo: 9, mc: -5, bags: 1, lx: 10, ly: 4, es: 1.06 }} x={620} y={600 + 390 * 3.9} s={3.9} t={0} />
      <ellipse cx={930} cy={560} rx={240} ry={320} fill="#ff4a3a" opacity={0.3} filter="url(#bb30)" style={{ mixBlendMode: "screen" }} />
      <DevilPhone x={1480} y={620} s={1.1} r={8} />
    </svg>
    <BigWord text="3 AM" x={70} y={50} size={230} />
  </AbsoluteFill>
);

export const Thumb05B: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 45%, #4a0805 0%, #170506 42%, #060406 75%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <BeanDefs /><Defs />
      <Char id="t5b" pose={P({ ...FRONT, tilt: -4 })} e={{ ...BEAN_EXPR.surprised, lid: 0.08, bi: -14, bo: -8, bags: 1, lx: 8, ly: 3, mo: 1, es: 1.06 }} x={560} y={700 + 390 * 2.8} s={2.8} t={0} />
      <ellipse cx={800} cy={560} rx={240} ry={280} fill="#ff4a3a" opacity={0.25} filter="url(#bb30)" style={{ mixBlendMode: "screen" }} />
      <DevilPhone x={1380} y={580} s={1.15} r={-6} ring />
    </svg>
    <BigWord text="ONE MORE?" x={70} y={46} size={170} color="#ff4a3a" glow="rgba(255,40,20,0.85)" font="Chalkboard SE" rotate={-3} />
  </AbsoluteFill>
);
