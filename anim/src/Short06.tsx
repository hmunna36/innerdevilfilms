// Short 06 for Inner Devil Films: "tomorrow-cost", a 30 s vertical cut of TOMORROW (Film04): what Devil Mode cost
// him, held in near silence. Hook: his red eyes, "$2,400 in 18 days. What did it cost him?" -> day 1, the phone goes
// into the drawer -> the nights (9:31, 12:40, 2:40, the Devil's hand on him, 6:02 and still up) -> Friday: Ava's
// "Dinner tonight? I saved you a seat." lights up in the drawer, his eyes flick to it, he keeps typing -> the empty
// table ("He never came.") -> the huge Devil over him -> day zero: PAID Rent, PAID Mom's medicine, MISSED Dinner with
// Ava -> Mom's thank-you in the drawer -> the lid closes, relief ("Was it worth it?") -> "full film on the channel".
// Every segment plays one film cut (held past its film end where the scene allows) through its own vertical camera.
// Sound: scripts/short06_score.py. Shorts safe area (measured on the user's iPhone): key text in x 100-980 for
// y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView } from "./Film04";
import type { Cam } from "./Film04";
import { STY, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
const push = (t0: number, d: number, z0: number, z1: number, x: number, y: number) => (t: number): Cam => [mix(z0, z1, (t - t0) / d), x, y, 0];
const CL: Cam = [3.0, CLOCK_XY[0], CLOCK_XY[1]];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given) in the film cut that starts at f0
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; card?: "cta" };
const RAW: Seg[] = [
  // hook: his red eyes at 2:41 (the film's cut is 1 s; the scene holds)
  { id: "hook", f0: 93.8, f1: 95.8, cam: push(93.8, 2.0, 2.4, 2.6, 750, 513) },
  // day 1, 4:00: his phone goes into the drawer
  { id: "drawer", f0: 73.0, f1: 74.4, cam: c(1.7, 960, 488) },
  // the nights
  { id: "n1", f0: 83.8, f1: 84.8, cam: () => CL },                 // 9:31
  { f0: 87.2, f1: 88.6, cam: c(1.8, 720, 554) },                   // 12:40, typing
  { id: "n2", f0: 91.4, f1: 92.4, cam: () => CL },                 // 2:40
  { f0: 92.4, f1: 93.8, cam: c(1.5, 573, 370) },                   // he rubs his eyes; the Devil's hand
  { id: "stand", f0: 98.8, f1: 101.0, cam: c(1.4, 590, 560) },    // 6:02, still up
  // Friday: Ava, in the drawer (the film's cut is 1.8 s; the phone keeps glowing)
  { id: "ava", f0: 101.0, f1: 103.2, cam: c(2.6, 948, 480) },
  { f0: 102.8, f1: 103.6, cam: c(2.9, 742, 512) },                 // his eyes flick to the drawer; he keeps typing
  // the table she saved
  { id: "table", f0: 103.6, f1: 106.6, cam: push(103.6, 3.0, 1.6, 1.85, 1380, 560) },
  // the huge Devil over him
  { f0: 106.0, f1: 107.6, cam: c(1.25, 620, 450) },
  // day zero: what got paid, and what did not
  { id: "paid", f0: 107.6, f1: 110.9, cam: c(1.7, 870, 640) },
  // Mom, in the drawer
  { f0: 110.9, f1: 113.9, cam: c(2.6, 948, 470) },
  // the lid closes; relief
  { f0: 113.9, f1: 114.6, cam: c(1.6, 620, 600) },
  { id: "relief", f0: 114.6, f1: 116.4, cam: push(114.6, 1.8, 1.75, 1.85, 600, 520) },
  // call to action over the rest of the relief shot
  { f0: 115.4, f1: 116.4, dur: 3.0, cam: c(1.85, 600, 520), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => {
  const d = g.dur ?? g.f1 - g.f0;
  const cut = CUTS.find((cu) => g.f0 + 1e-6 >= cu.t0 && g.f0 + 1e-6 < cu.t1)!;
  const o = { ...g, s0: s, d, cut }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT6_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
const segAt = (ts: number) => SEGS.find((g) => ts >= g.s0 && ts < g.s0 + g.d) ?? LAST;
const byId = (id: string) => SEGS.find((g) => g.id === id)!;
const startOf = (id: string) => byId(id).s0;
const endOf = (id: string) => byId(id).s0 + byId(id).d;

// ------------------------------------------------------------------ words on screen
const Cap: React.FC<{ who: Who | "say"; text: string; s0: number; s1: number; ts: number; size: number; y: number; x?: number; w?: number; rate?: number; color?: string }> = ({
  who, text, s0, s1, ts, size, y, x = 485, w = 760, rate = 45, color }) => {
  const op = k(ts, [s0, s0 + 0.12, s1 - 0.2, s1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const n = Math.max(1, Math.ceil((ts - s0) * rate));
  const sty: React.CSSProperties = who === "say" ? { fontFamily: "Avenir Next", fontWeight: 800, color: color ?? "#f4efe6", textShadow: "0 3px 10px #000" } : STY[who];
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: "rgba(6,5,9,0.62)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.62)",
        textAlign: "center", whiteSpace: "pre-line", ...sty, fontSize: size, lineHeight: 1.16 }}>
        {text.slice(0, n)}<span style={{ color: "transparent", textShadow: "none" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};
// day zero: a line of the ledger (paid in green, missed in red)
const Row: React.FC<{ tf: number; t0: number; what: string; head: string; y: number; missed?: boolean }> = ({ tf, t0, what, head, y, missed }) => {
  const a = sm((tf - t0) / 0.2);
  if (a <= 0) return null;
  const col = missed ? "#ff4a3a" : "#5be08a", edge = missed ? "#e0321f" : "#2fd16a";
  return (
    <div style={{ position: "absolute", left: 100, width: 770, top: y, opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${1.15 - 0.15 * a})`, transformOrigin: "50% 50%",
      display: "flex", alignItems: "center", gap: 28, padding: "14px 34px", boxSizing: "border-box", borderRadius: 36, background: missed ? "rgba(20,6,6,0.92)" : "rgba(10,16,12,0.92)",
      border: `4px solid ${edge}`, boxShadow: `0 0 30px ${missed ? "rgba(255,50,30,0.45)" : "rgba(60,220,120,0.45)"}, 0 14px 40px rgba(0,0,0,0.7)`, fontFamily: "Avenir Next" }}>
      <div style={{ width: 100, height: 100, flex: "none", borderRadius: 50, background: missed ? "#c52a1a" : "#2fa35a", color: "#fff", fontSize: 66, fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center" }}>{missed ? "✕" : "✓"}</div>
      <div>
        <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.0, color: col }}>{head}</div>
        <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.1, color: "#f4efe6" }}>{what}</div>
      </div>
    </div>
  );
};

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short06: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const cut = seg.cut.scene ? { ...seg.cut, cam: seg.cam } : null;
  const cta = seg.card === "cta" ? u : -1;
  const hook = seg.id === "hook" ? u : -1;
  const h0 = startOf("hook");
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      {/* the hook: what he made, and the question */}
      {hook >= 0 && (
        <div style={{ position: "absolute", left: 100, width: 880, top: 400, textAlign: "center", fontFamily: "Avenir Next" }}>
          <div style={{ display: "inline-block", padding: "6px 34px 14px", borderRadius: 40, background: "rgba(6,5,9,0.66)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.66)" }}>
            <div style={{ fontSize: 190, fontWeight: 900, lineHeight: 1.0, color: "#5be08a", transform: `scale(${1.12 - 0.12 * sm(hook / 0.15)})`,
              textShadow: "0 0 40px rgba(60,220,120,0.6), 0 6px 14px #000" }}>$2,400</div>
            <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, color: "#f4efe6", textShadow: "0 3px 10px #000" }}>in 18 days.</div>
          </div>
        </div>
      )}
      <Cap who="say" text={"What did it\ncost him?"} s0={h0 + 0.55} s1={startOf("drawer") + 0.3} ts={ts} size={92} y={1370} rate={60} color="#ffd27a" />
      <Cap who="say" text={"Day 1: the phone\ngoes in the drawer."} s0={startOf("drawer") + 0.3} s1={endOf("drawer") + 0.15} ts={ts} size={76} y={420} rate={60} />
      <Cap who="say" text="No nights off." s0={startOf("n1") + 0.1} s1={startOf("n2")} ts={ts} size={84} y={1440} rate={50} />
      <Cap who="say" text="No sleep." s0={startOf("n2") + 0.1} s1={startOf("stand")} ts={ts} size={84} y={1440} rate={50} />
      <Cap who="say" text="He never came." s0={startOf("table") + 0.5} s1={endOf("table")} ts={ts} size={88} y={1380} rate={40} />
      {seg.id === "paid" && <>
        <Row tf={tf} t0={107.8} head="PAID $1,800" what="Rent" y={1010} />
        <Row tf={tf} t0={108.6} head="PAID $600" what="Mom's medicine" y={1220} />
        <Row tf={tf} t0={109.4} head="MISSED" what="Dinner with Ava" y={1430} missed />
      </>}
      <Cap who="say" text="Worth it?" s0={startOf("relief") + 0.35} s1={endOf("relief") + 0.3} ts={ts} size={92} y={1390} rate={40} />
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
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      {!(qa && qa.length) && <Audio src={staticFile("audio/short06_mix.wav")} />}
    </AbsoluteFill>
  );
};
