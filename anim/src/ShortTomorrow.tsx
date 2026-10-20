// Short 01 for Inner Devil Films: a 34 s vertical cut of TOMORROW (Film04), made from the film's own scenes
// reframed for 1080 x 1920, with phone-safe text and its own sound mix (scripts/short01_score.py).
// Story in fast cuts: the Devil's "Then move." (hook) -> 30 days earlier: the notice, Mom's texts, "Again?" /
// "Tomorrow.", the days slipping, "I ran out today." -> the Devil's entry -> DEVIL MODE -> "full film on the channel".
// Shorts safe area (measured on the user's iPhone): key text in x 100-980 for y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CHAT1, CHAT2, CUTS, CutView, daysAt, flashOf } from "./Film04";
import type { Cam } from "./Film04";
import { LineView, NoticeCard, PhonePOV, k, mix, sm } from "./film/kit";
import type { Line } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
type Seg = { f0: number; f1: number; cam: (tf: number) => Cam; card?: "earlier" | "cta" };
// each segment plays film time f0..f1 at normal speed
const RAW: Seg[] = [
  // hook: the climax, as the film opens
  { f0: 0.62, f1: 1.6, cam: c(2.6, 615, 430, -3) },
  { f0: 1.6, f1: 3.0, cam: (t) => [mix(2.0, 2.1, (t - 1.6) / 1.4), 690, 610, -4] },
  { f0: 0, f1: 0.8, cam: c(1, 960, 540), card: "earlier" },
  // the notice slides in, and he reads it
  { f0: 4.95, f1: 5.75, cam: c(2.2, 930, 700) },
  { f0: 7.4, f1: 8.7, cam: c(1.9, 985, 560) },
  // Mom
  { f0: 11.3, f1: 14.3, cam: c(1.9, 760, 560) },
  // "Again?" "Tomorrow."
  { f0: 27.35, f1: 28.75, cam: c(2.3, 1140, 460) },
  { f0: 28.8, f1: 30.1, cam: c(2.4, 730, 570) },
  // the days slip
  { f0: 32.95, f1: 33.85, cam: c(1.78, 950, 560) },
  { f0: 33.95, f1: 34.75, cam: c(1.0, 970, 540) },
  { f0: 34.85, f1: 35.65, cam: (t) => [mix(3.1, 3.4, (t - 34.85) / 0.8), 728, 548] },
  // "I ran out today."
  { f0: 37.9, f1: 39.9, cam: c(1.9, 760, 640) },
  { f0: 39.9, f1: 41.1, cam: c(3.3, 795, 645) },
  // the Devil's entry
  { f0: 48.85, f1: 49.9, cam: c(3.0, CLOCK_XY[0] - 20, CLOCK_XY[1]) },
  { f0: 52.4, f1: 54.3, cam: (t) => [1.9, mix(820, 780, sm((t - 52.4) / 1.9)), mix(560, 430, sm((t - 52.4) / 1.9))] },
  { f0: 54.5, f1: 56.1, cam: (t) => [mix(2.0, 2.2, (t - 54.5) / 1.6), 985, 700] },
  { f0: 57.9, f1: 59.1, cam: (t) => [mix(3.0, 3.3, (t - 57.9) / 1.2), 795, 645, 2] },
  { f0: 60.42, f1: 61.75, cam: c(2.6, 482, 330) },
  { f0: 61.8, f1: 64.3, cam: (t) => [mix(1.85, 1.95, (t - 61.8) / 2.5), 610, 560, -4] },
  { f0: 65.8, f1: 68.35, cam: (t) => [mix(2.15, 2.3, (t - 65.8) / 2.55), 640, 520] },
  { f0: 68.4, f1: 69.0, cam: c(3.7, 795, 645) },
  // the drop
  { f0: 69.0, f1: 70.9, cam: (t) => [mix(2.0, 2.25, sm((t - 69) / 0.5)), 740, mix(660, 540, sm((t - 69) / 0.8))] },
  // call to action over the rest of the drop scene (which ends at film 73.0)
  { f0: 70.9, f1: 73.0, cam: c(2.0, 600, 560), card: "cta" },
];
const SEGS = (() => { let s = 0; return RAW.map((g) => { const o = { ...g, s0: s }; s += g.f1 - g.f0; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT1_FRAMES = Math.round((LAST.s0 + LAST.f1 - LAST.f0) * 30);

// captions, in FILM time, placed for a vertical phone screen
const LINES: Line[] = [
  { t0: 1.75, t1: 2.98, who: "devil", text: "Then move.", x: 485, y: 1240, size: 104 },
  { t0: 27.4, t1: 28.75, who: "angel", text: "Again?", x: 485, y: 1240, size: 96 },
  { t0: 28.85, t1: 30.1, who: "bean", text: "Tomorrow.", x: 485, y: 1240, size: 92 },
  { t0: 66.0, t1: 68.35, who: "devil", text: "Then move.", x: 485, y: 1240, size: 112 },
];

export const ShortTomorrow: React.FC = () => {
  const f = useCurrentFrame();
  const ts = f / 30;
  const seg = SEGS.find((g) => ts >= g.s0 && ts < g.s0 + (g.f1 - g.f0)) ?? SEGS[SEGS.length - 1];
  const tf = seg.f0 + (ts - seg.s0);
  const filmCut = seg.card === "earlier" ? null : CUTS.find((cu) => tf >= cu.t0 && tf < cu.t1);
  const cut = filmCut && filmCut.scene ? { ...filmCut, cam: seg.cam } : null;
  const [flashCol, flashOp] = seg.card ? ["#000", 0] : flashOf(tf);
  const slam = tf >= 69.05 && tf < 70.9;
  const slamS = 1.6 - 0.6 * sm((tf - 69.05) / 0.16);
  const ring = tf >= 69.05 && tf < 69.7 ? (tf - 69.05) / 0.65 : -1;
  const showDays = !seg.card && tf >= 7.4 && tf < 48.8;
  const devilTime = tf >= 48.8;
  const cta = seg.card === "cta" ? ts - seg.s0 : -1;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <CutView cut={cut} t={tf} W={1080} H={1920} />}
      {seg.card === "earlier" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "#050507" }}>
          <div style={{ fontFamily: "Avenir Next", fontWeight: 700, fontSize: 66, letterSpacing: 14, color: "#f1ece2", paddingLeft: 14,
            opacity: k(ts - seg.s0, [0, 0.12, 0.65, 0.8], [0, 1, 1, 0]) }}>30 DAYS EARLIER</div>
        </AbsoluteFill>
      )}
      {!seg.card && LINES.map((l, i) => <LineView key={i} l={l} t={tf} />)}
      {/* the notice in his hands, and his phone: moved into the middle of the tall frame */}
      {!seg.card && <div style={{ position: "absolute", left: -420, top: 430, width: 1920, height: 1080 }}><NoticeCard t={tf} t0={7.4} t1={8.75} /></div>}
      {!seg.card && (
        <div style={{ position: "absolute", left: -420, top: 400, width: 1920, height: 1080 }}>
          <PhonePOV t={tf} t0={11.3} t1={14.3} name="Mom" clock="2:13" items={CHAT1} typing={[[11.75, 12.55]]} />
          <PhonePOV t={tf} t0={37.9} t1={39.9} name="Mom" clock="3:58" items={CHAT2} typing={[[37.9, 38.55]]} />
        </div>
      )}
      {showDays && (
        <div style={{ position: "absolute", left: 104, top: 430, fontFamily: "Avenir Next", color: devilTime ? "#ff4a3a" : "#f1ece2",
          textShadow: devilTime ? "0 0 18px rgba(255,40,20,0.7), 0 3px 8px #000" : "0 3px 8px #000" }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 5, opacity: 0.9 }}>DAYS LEFT</div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1 }}>{daysAt(tf)}</div>
        </div>
      )}
      {slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k(tf, [69.05, 69.12, 70.5, 70.9], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(tf * 90) * 7 * Math.exp(-(tf - 69.05) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 200,
            lineHeight: 0.95, textAlign: "center", letterSpacing: 14, color: "#ff3b2a", paddingLeft: 14, marginTop: -60,
            textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 7px 0 #3a0000" }}>DEVIL<br />MODE</div>
        </AbsoluteFill>
      )}
      {ring >= 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={900} r={60 + ring * 1500} fill="none" stroke="#ff3b2a" strokeWidth={36 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {cta >= 0 && (
        <AbsoluteFill style={{ background: `rgba(4,3,4,${0.62 * sm(cta / 0.3)})`, fontFamily: "Avenir Next" }}>
          <div style={{ position: "absolute", top: 600, width: 1080, textAlign: "center", opacity: sm((cta - 0.1) / 0.3) }}>
            <div style={{ color: "#f1ece2", fontSize: 54, fontWeight: 700, letterSpacing: 2 }}>He kept saying tomorrow.</div>
            <div style={{ marginTop: 70, color: "#f4efe6", fontSize: 94, fontWeight: 900, letterSpacing: 6, paddingLeft: 6 }}>TOMORROW</div>
            <div style={{ width: 360, height: 7, background: "#ff3b2a", margin: "14px auto 0", boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
            <div style={{ marginTop: 70, color: "#ffd27a", fontSize: 62, fontWeight: 800 }}>Full film on the channel</div>
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: sm((cta - 0.5) / 0.3) }}>
            <g transform={`translate(300,${1500 + Math.sin(cta * 7) * 14})`}>
              <path d="M-34,-60 L34,-60 L34,0 L70,0 L0,72 L-70,0 L-34,0 Z" fill="#ffd27a" stroke="#000" strokeWidth={6} strokeLinejoin="round" />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: flashCol, opacity: flashOp }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      <Audio src={staticFile("audio/short01_mix.wav")} />
    </AbsoluteFill>
  );
};
