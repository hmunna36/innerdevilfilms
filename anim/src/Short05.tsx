// Short 05 for Inner Devil Films: "tomorrow-montage", a 34 s vertical cut of TOMORROW (Film04): Devil Mode at full
// speed, with the money counter rising. Hook: DEVIL MODE (the drop, from film 69.4, when he is up) over "$0 / $2,400, 18 DAYS LEFT" ->
// the phone into the drawer -> "Again." -> the money montage in the film's own time and beat (film 73.0-97.6: the
// bench, the rain, the box, 9:31, rejected, "Again.", 12:40, 2:40, his red eyes, the huge Devil, the final job), every
// payment popping up and the counter climbing -> EARNED $2,400 -> day zero: Rent PAID, Mom's medicine PAID ->
// "full film on the channel". The montage keeps the film's tempo (one jump of exactly one bar, 71.125 -> 73.0), so the
// sound is the film's own mix: scripts/short05_score.py. Shorts safe area (measured on the user's iPhone): key text
// in x 100-980 for y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView, daysAt, flashOf } from "./Film04";
import type { Cam } from "./Film04";
import { STY, fmt$, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
const run = (t0: number, t1: number, x0: number, x1: number) => (t: number) => mix(x0, x1, (t - t0) / (t1 - t0)); // the film's street runs
const X3 = run(79.8, 81.2, 200, 1500), X4 = run(81.2, 82.4, 600, 1300), X5 = run(82.4, 83.8, 450, 1250);
const X11 = run(90.0, 91.4, 1500, 700), X16 = run(96.2, 97.6, 200, 1600);
const CL: Cam = [3.0, CLOCK_XY[0], CLOCK_XY[1]];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given)
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; card?: "earned" | "cta" };
const RAW: Seg[] = [
  // hook: THE DROP, DEVIL MODE; he gets up (the camera tilts up with him), the Devil laughs behind him
  { id: "hook", f0: 69.4, f1: 71.125, cam: (t) => [mix(1.15, 1.2, sm((t - 69.4) / 1.7)), 590, mix(372, 318, sm((t - 69.4) / 0.45))] },
  // (one bar later in the film) his phone goes into the drawer
  { f0: 73.0, f1: 74.4, cam: c(1.7, 960, 488) },
  // "Again."
  { id: "again1", f0: 74.4, f1: 75.8, cam: c(1.6, 565, 400) },
  { f0: 75.8, f1: 77.0, cam: c(1.8, 860, 554) },   // (the Devil stays out of frame)
  // the money montage, in the film's own cuts and beat
  { f0: 77.0, f1: 78.4, cam: c(1.8, 920, 411) },
  { f0: 78.4, f1: 79.8, cam: c(1.3, 1200, 465) },
  { f0: 79.8, f1: 81.2, cam: (t) => [1.6, X3(t) + 40, 492] },
  { f0: 81.2, f1: 82.4, cam: (t) => [2.0, X4(t) + 17, 459] },
  { f0: 82.4, f1: 83.8, cam: (t) => [1.5, X5(t) + 60, 502] },
  { f0: 83.8, f1: 84.8, cam: () => CL },
  { f0: 84.8, f1: 85.4, cam: c(1.0, 960, 600) },
  { f0: 85.4, f1: 86.0, cam: c(2.2, 760, 528) },
  { id: "again2", f0: 86.0, f1: 87.2, cam: c(1.6, 540, 375) },
  { f0: 87.2, f1: 88.6, cam: c(1.8, 720, 554) },
  { f0: 88.6, f1: 90.0, cam: c(1.9, 1100, 440) },
  { f0: 90.0, f1: 91.4, cam: (t) => [1.3, X11(t) + 180, 525] },
  { f0: 91.4, f1: 92.4, cam: () => CL },
  { f0: 92.4, f1: 93.8, cam: c(1.5, 573, 370) },
  { f0: 93.8, f1: 94.8, cam: (t) => [mix(3.2, 3.5, t - 93.8), 728, 470] },
  { f0: 94.8, f1: 96.2, cam: c(1.15, 1100, 420) },
  { f0: 96.2, f1: 97.6, cam: (t) => [1.4, X16(t), 515] },
  // EARNED $2,400 (the film holds it 1.2 s; here 1.4 s, to the next downbeat)
  { id: "earned", f0: 97.6, f1: 98.8, dur: 1.4, cam: c(1.2, 960, 540), card: "earned" },
  // day zero: the rent and Mom's medicine, paid
  { id: "paid", f0: 107.6, f1: 110.1, cam: c(1.7, 870, 563) },
  // call to action over the rest of day zero (before the drawer buzzes at 110.2)
  { f0: 108.9, f1: 110.15, dur: 3.0, cam: c(1.7, 870, 563), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => { const d = g.dur ?? g.f1 - g.f0; const o = { ...g, s0: s, d }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT5_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
const segAt = (ts: number) => SEGS.find((g) => ts >= g.s0 && ts < g.s0 + g.d) ?? LAST;
const byId = (id: string) => SEGS.find((g) => g.id === id)!;
const startOf = (id: string) => byId(id).s0;
const endOf = (id: string) => byId(id).s0 + byId(id).d;

// the film's payments (film time, amount, what for) and the goal: the rent ($1,800) and Mom's medicine ($600)
const PAYMENTS: [number, number, string][] = [[78.6, 1200, "Repair contract"], [82.6, 150, "Delivery"], [88.8, 375, "Repairs"], [90.2, 300, "Delivery"], [96.4, 375, "Final job"]];
const GOAL = 2400;
const earnedAt = (tf: number) => (tf >= 100 ? GOAL : PAYMENTS.reduce((a, [pt, amt]) => a + amt * sm((tf - pt) / 0.5), 0));

// ------------------------------------------------------------------ words on screen
const Cap: React.FC<{ who: Who | "say"; text: string; s0: number; s1: number; ts: number; size: number; y: number; x?: number; w?: number; rate?: number }> = ({
  who, text, s0, s1, ts, size, y, x = 485, w = 760, rate = 45 }) => {
  const op = k(ts, [s0, s0 + 0.12, s1 - 0.2, s1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const n = Math.max(1, Math.ceil((ts - s0) * rate));
  const sty: React.CSSProperties = who === "say" ? { fontFamily: "Avenir Next", fontWeight: 800, color: "#f4efe6", textShadow: "0 3px 10px #000" } : STY[who];
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: "rgba(6,5,9,0.62)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.62)",
        textAlign: "center", whiteSpace: "pre-line", ...sty, fontSize: size, lineHeight: 1.18 }}>
        {text.slice(0, n)}<span style={{ color: "transparent", textShadow: "none" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};
// the counter: what he has earned against what he owes, and the days left
const Counter: React.FC<{ tf: number; pop: number }> = ({ tf, pop }) => {
  const e = earnedAt(tf);
  const full = e >= GOAL - 0.5;
  const days = tf >= 100 ? 0 : daysAt(tf);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 330, width: 1080, height: 420, background: "linear-gradient(rgba(4,3,5,0.62), rgba(4,3,5,0.5) 60%, rgba(4,3,5,0))" }} />
      <div style={{ position: "absolute", left: 104, top: 396, width: 800, fontFamily: "Avenir Next" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, transform: `scale(${pop})`, transformOrigin: "0 70%" }}>
          <span style={{ fontSize: 124, fontWeight: 900, lineHeight: 1.04, color: full ? "#5be08a" : "#f4efe6",
            textShadow: full ? "0 0 30px rgba(60,220,120,0.7), 0 4px 10px #000" : "0 4px 12px #000" }}>{fmt$(e)}</span>
          <span style={{ fontSize: 72, fontWeight: 800, color: "#a3a8b3", textShadow: "0 3px 8px #000" }}>/ {fmt$(GOAL)}</span>
        </div>
        <div style={{ marginTop: 10, width: 760, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.2)", boxShadow: "0 2px 8px #000" }}>
          <div style={{ width: `${(100 * e) / GOAL}%`, height: 18, borderRadius: 9, background: "#2fd16a", boxShadow: "0 0 16px rgba(60,220,120,0.8)" }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 72, fontWeight: 900, letterSpacing: 2, color: "#ff4a3a", lineHeight: 1.05,
          textShadow: "0 0 20px rgba(255,40,20,0.75), 0 4px 10px #000" }}>{days} {days === 1 ? "DAY" : "DAYS"} LEFT</div>
      </div>
    </>
  );
};
// a payment lands: "+$1,200 / Repair contract", in the lower safe area
const PayPop: React.FC<{ tf: number; pt: number; amt: number; label: string }> = ({ tf, pt, amt, label }) => {
  const op = k(tf, [pt - 0.15, pt - 0.05, pt + 1.0, pt + 1.15], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const s = 1.25 - 0.25 * sm((tf - pt + 0.15) / 0.18);
  return (
    <div style={{ position: "absolute", left: 100, width: 770, top: 1405, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ transform: `scale(${s})`, padding: "14px 40px 18px", borderRadius: 36, background: "rgba(10,16,12,0.9)", border: "4px solid #2fd16a",
        boxShadow: "0 0 30px rgba(60,220,120,0.45), 0 14px 40px rgba(0,0,0,0.7)", textAlign: "center", fontFamily: "Avenir Next" }}>
        <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 1.0, color: "#5be08a" }}>+{fmt$(amt)}</div>
        <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.1, color: "#f4efe6" }}>{label}</div>
      </div>
    </div>
  );
};
// day zero: a bill marked paid
const PaidRow: React.FC<{ tf: number; t0: number; what: string; amt: string; y: number }> = ({ tf, t0, what, amt, y }) => {
  const a = sm((tf - t0) / 0.2);
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 100, width: 770, top: y, opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${1.15 - 0.15 * a})`, transformOrigin: "50% 50%",
      display: "flex", alignItems: "center", gap: 28, padding: "18px 34px", boxSizing: "border-box", borderRadius: 36, background: "rgba(10,16,12,0.92)",
      border: "4px solid #2fd16a", boxShadow: "0 0 30px rgba(60,220,120,0.45), 0 14px 40px rgba(0,0,0,0.7)", fontFamily: "Avenir Next" }}>
      <div style={{ width: 104, height: 104, flex: "none", borderRadius: 52, background: "#2fa35a", color: "#fff", fontSize: 70, fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
      <div>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.0, color: "#5be08a" }}>PAID {amt}</div>
        <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.1, color: "#f4efe6" }}>{what}</div>
      </div>
    </div>
  );
};

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short05: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const filmCut = CUTS.find((cu) => tf >= cu.t0 && tf < cu.t1);
  const cut = filmCut && filmCut.scene ? { ...filmCut, cam: seg.cam } : null;
  // the drop's flash, softened so the hook's first frames read (none on the very first frame)
  const hook = seg.id === "hook";
  const [flashCol, flashOp] = hook ? ["#ff2d1f", k(ts, [0, 0.04, 0.3], [0, 0.45, 0])] : seg.card ? ["#000", 0] : flashOf(tf);
  const slamS = 1.15 - 0.15 * sm(ts / 0.16);
  const ring = hook && ts < 0.65 ? ts / 0.65 : -1;
  // the counter pops when a payment lands
  const pop = 1 + 0.12 * Math.max(0, ...PAYMENTS.map(([pt]) => k(tf, [pt, pt + 0.12, pt + 0.4], [0, 1, 0])));
  const earned = seg.card === "earned" ? u : -1;
  const cta = seg.card === "cta" ? u : -1;
  const showCounter = !seg.card;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      {showCounter && <Counter tf={tf} pop={pop} />}
      {!seg.card && PAYMENTS.map(([pt, amt, label]) => <PayPop key={pt} tf={tf} pt={pt} amt={amt} label={label} />)}
      <Cap who="devil" text="Again." s0={startOf("again1") + 0.05} s1={endOf("again1")} ts={ts} size={120} y={1430} rate={40} />
      <Cap who="devil" text="Again." s0={startOf("again2") + 0.05} s1={endOf("again2") + 0.35} ts={ts} size={120} y={1430} rate={40} />
      {hook && (
        <div style={{ position: "absolute", left: 100, width: 770, top: 1290, display: "flex", justifyContent: "center", opacity: k(ts, [0, 1.45, 1.725], [1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(ts * 90) * 7 * Math.exp(-ts * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 180,
            lineHeight: 0.95, textAlign: "center", letterSpacing: 14, color: "#ff3b2a", paddingLeft: 14,
            textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 7px 0 #3a0000" }}>DEVIL<br />MODE</div>
        </div>
      )}
      {ring >= 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={485} cy={1460} r={60 + ring * 1500} fill="none" stroke="#ff3b2a" strokeWidth={36 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {earned >= 0 && (
        <AbsoluteFill style={{ fontFamily: "Avenir Next", opacity: k(earned, [0, 0.06, 1.3, 1.4], [0, 1, 1, 1]) }}>
          <div style={{ position: "absolute", top: 640, width: 1080, textAlign: "center", fontSize: 76, fontWeight: 800, letterSpacing: 12, paddingLeft: 12, color: "#8fd4a5" }}>EARNED</div>
          <div style={{ position: "absolute", top: 740, width: 1080, textAlign: "center", fontSize: 240, fontWeight: 900, lineHeight: 1, color: "#5be08a",
            transform: `scale(${1.3 - 0.3 * sm(earned / 0.15)})`, textShadow: "0 0 50px rgba(60,220,120,0.6), 0 6px 14px #000" }}>$2,400</div>
          <div style={{ position: "absolute", top: 1030, width: 1080, textAlign: "center", fontSize: 72, fontWeight: 800, color: "#ff4a3a",
            textShadow: "0 0 20px rgba(255,40,20,0.75), 0 4px 10px #000" }}>1 DAY LEFT</div>
        </AbsoluteFill>
      )}
      {seg.id === "paid" && <>
        <PaidRow tf={tf} t0={107.8} what="Rent" amt="$1,800" y={1170} />
        <PaidRow tf={tf} t0={108.6} what="Mom's medicine" amt="$600" y={1410} />
      </>}
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
      {!(qa && qa.length) && <Audio src={staticFile("audio/short05_mix.wav")} />}
    </AbsoluteFill>
  );
};
