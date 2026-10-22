// Short 04 for Inner Devil Films: "tomorrow-entry", a 28 s vertical cut of TOMORROW (Film04): the Devil's entry beat
// by beat, in the film's own order and time (film 47.3-71.6, skipping only 53.4-54.4). Hook: his tears on the floor, "Mom
// ran out of her medicine." -> the Angel burns down to an ember: "Kindness stopped working." -> 3:59 -> the room goes
// cold, the halo's shadow grows horns: "Then something else woke up." -> red light and smoke under the door -> the
// smoke crawls to him, the lights flicker -> a column of smoke -> the eyes ignite -> the Devil rises, reaches, leans
// in: "Then move." -> a beat of silence -> THE DROP: DEVIL MODE, he stands up -> "full film on the channel".
// Sound: scripts/short04_score.py. Shorts safe area (measured on the user's iPhone): key text in x 100-980 for
// y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView, flashOf } from "./Film04";
import type { Cam } from "./Film04";
import { STY, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given)
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; card?: "cta" };
const RAW: Seg[] = [
  // hook: his tears on the floor after "I ran out today.", the Angel beside him
  { id: "hook", f0: 39.9, f1: 41.4, cam: c(2.5, 840, 625) },
  // the Angel burns down to an ember
  { id: "ember", f0: 47.3, f1: 48.8, cam: c(2.0, 880, 650) },
  // 3:59
  { f0: 48.8, f1: 50.2, cam: c(3.6, CLOCK_XY[0], CLOCK_XY[1]) },
  // the room goes cold and the halo's shadow on the wall swells into horns over him (they leave the top of the
  // film's frame after 53.4, so the shot ends there and the film jumps to the door)
  { id: "horns", f0: 50.2, f1: 53.4, cam: (t) => { const u = sm((t - 50.2) / 3.2); return [mix(1.9, 1.5, u), mix(900, 820, u), mix(580, 470, u)]; } },
  // red light under the door, smoke pours in
  { f0: 54.4, f1: 56.2, cam: (t) => [mix(2.0, 2.2, (t - 54.4) / 1.8), 985, 700] },
  // the smoke crawls across the floor to him
  { f0: 56.2, f1: 57.8, cam: c(1.8, 700, 760, 3) },
  // his face, red, the lights flicker
  { f0: 57.8, f1: 59.2, cam: (t) => [mix(3.0, 3.3, (t - 57.8) / 1.4), 795, 645, 2] },
  // a column of smoke rises beside him
  { f0: 59.2, f1: 60.4, cam: c(1.6, 640, 560, -3) },
  // the eyes ignite
  { f0: 60.4, f1: 61.8, cam: c(2.6, 482, 330) },
  // the Devil takes shape over him (both faces whole, the Devil's below the app's top bar)
  { f0: 61.8, f1: 64.4, cam: (t) => [mix(1.65, 1.72, (t - 61.8) / 2.6), 625, 460, -3] },
  // he reaches for him
  { f0: 64.4, f1: 65.8, cam: c(1.72, 630, 450) },
  // he leans in: "Then move."
  { id: "move", f0: 65.8, f1: 68.4, cam: (t) => [mix(1.6, 1.68, (t - 65.8) / 2.6), 665, 520] },
  // his eyes; silence
  { f0: 68.4, f1: 69.0, cam: c(3.7, 795, 645) },
  // THE DROP: he stands up, the Devil laughs behind him
  { f0: 69.0, f1: 71.6, cam: (t) => [mix(1.55, 1.65, sm((t - 69) / 2.6)), 590, 440] },
  // call to action over the rest of the drop scene (which ends at film 73.0)
  { f0: 71.6, f1: 73.0, dur: 3.0, cam: c(1.65, 590, 440), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => { const d = g.dur ?? g.f1 - g.f0; const o = { ...g, s0: s, d }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT4_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
const segAt = (ts: number) => SEGS.find((g) => ts >= g.s0 && ts < g.s0 + g.d) ?? LAST;
const byId = (id: string) => SEGS.find((g) => g.id === id)!;
const startOf = (id: string) => byId(id).s0;
const endOf = (id: string) => byId(id).s0 + byId(id).d;

// ------------------------------------------------------------------ words on screen
const Cap: React.FC<{ who: Who | "say"; text: string; s0: number; s1: number; ts: number; size: number; y: number; x?: number; w?: number; rate?: number; red?: boolean }> = ({
  who, text, s0, s1, ts, size, y, x = 485, w = 760, rate = 45, red }) => {
  const op = k(ts, [s0, s0 + 0.12, s1 - 0.2, s1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const n = Math.max(1, Math.ceil((ts - s0) * rate));
  const sty: React.CSSProperties = who === "say"
    ? { fontFamily: "Avenir Next", fontWeight: 800, color: "#f4efe6", textShadow: red ? "0 3px 10px #000, 0 0 26px rgba(255,40,20,0.9)" : "0 3px 10px #000" }
    : STY[who];
  // a soft dark plate behind the words; the untyped rest is laid out (transparent) so the plate does not grow
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: `rgba(6,5,9,${who === "say" ? 0.72 : 0.58})`, boxShadow: `0 0 40px 22px rgba(6,5,9,${who === "say" ? 0.72 : 0.58})`,
        textAlign: "center", whiteSpace: "pre-line", ...sty, fontSize: size, lineHeight: 1.18 }}>
        {text.slice(0, n)}<span style={{ color: "transparent", textShadow: "none" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};
// qa: render a list of frames as a short sequence (for contact sheets)
export const Short04: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const filmCut = CUTS.find((cu) => tf >= cu.t0 && tf < cu.t1);
  const cut = filmCut && filmCut.scene ? { ...filmCut, cam: seg.cam } : null;
  const [flashCol, flashOp] = seg.card ? ["#000", 0] : flashOf(tf);
  const slam = !seg.card && tf >= 69.05 && tf < 71.6;
  const slamS = 1.6 - 0.6 * sm((tf - 69.05) / 0.16);
  const ring = tf >= 69.05 && tf < 69.7 ? (tf - 69.05) / 0.65 : -1;
  const cta = seg.card === "cta" ? u : -1;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      <Cap who="say" text={"Mom ran out of\nher medicine."} s0={-0.7} s1={endOf("hook")} ts={ts} size={84} y={420} x={540} w={880} />
      <Cap who="say" text={"Kindness\nstopped working."} s0={startOf("ember")} s1={endOf("ember")} ts={ts} size={84} y={420} x={540} w={880} rate={80} />
      <Cap who="say" text={"Then something\nelse woke up."} s0={startOf("horns") + 1.0} s1={endOf("horns")} ts={ts} size={84} y={1420} w={860} rate={45} red />
      <Cap who="devil" text="Then move." s0={startOf("move") + 0.2} s1={endOf("move")} ts={ts} size={120} y={1430} w={860} rate={22} />
      {slam && (
        <div style={{ position: "absolute", left: 100, width: 770, top: 1235, display: "flex", justifyContent: "center", opacity: k(tf, [69.05, 69.12, 71.2, 71.6], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(tf * 90) * 7 * Math.exp(-(tf - 69.05) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 200,
            lineHeight: 0.95, textAlign: "center", letterSpacing: 14, color: "#ff3b2a", paddingLeft: 14,
            textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 7px 0 #3a0000" }}>DEVIL<br />MODE</div>
        </div>
      )}
      {ring >= 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={485} cy={1425} r={60 + ring * 1500} fill="none" stroke="#ff3b2a" strokeWidth={36 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {cta >= 0 && (
        <AbsoluteFill style={{ background: `rgba(4,3,4,${0.76 * sm(cta / 0.3)})`, fontFamily: "Avenir Next" }}>
          <div style={{ position: "absolute", top: 500, left: 100, width: 880, textAlign: "center", opacity: sm((cta - 0.1) / 0.3) }}>
            <div style={{ color: "#f1ece2", fontSize: 74, fontWeight: 700, lineHeight: 1.15 }}>He kept saying<br />tomorrow.</div>
            <div style={{ marginTop: 70, color: "#f4efe6", fontSize: 124, fontWeight: 900, letterSpacing: 6, paddingLeft: 6 }}>TOMORROW</div>
            <div style={{ width: 380, height: 8, background: "#ff3b2a", margin: "14px auto 0", boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
          </div>
          <div style={{ position: "absolute", top: 1060, left: 120, width: 740, textAlign: "center", opacity: sm((cta - 0.35) / 0.3),
            color: "#ffd27a", fontSize: 80, fontWeight: 800, lineHeight: 1.12 }}>Full film<br />on the channel</div>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: sm((cta - 0.6) / 0.3) }}>
            <g transform={`translate(300,${1490 + Math.sin(cta * 7) * 14})`}>
              <path d="M-34,-60 L34,-60 L34,0 L70,0 L0,72 L-70,0 L-34,0 Z" fill="#ffd27a" stroke="#000" strokeWidth={6} strokeLinejoin="round" />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: flashCol, opacity: flashOp }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      {!(qa && qa.length) && <Audio src={staticFile("audio/short04_mix.wav")} />}
    </AbsoluteFill>
  );
};
