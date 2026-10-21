// Short 03 for Inner Devil Films: "tomorrow-angel", a 32 s vertical cut of TOMORROW (Film04) about the kind voice:
// the Angel's comfort ("Rest.", "You don't have to solve everything tonight.") feels good and costs him. One try,
// NOT SELECTED -> "Again?" / "Tomorrow." -> the nights slip ("Tomorrow." / "Rest."), the rent's days count down, the
// FINAL WARNING slides under the door, three rejections in the inbox -> on the floor: "You can still take one step." /
// "I keep taking one… then stopping." -> the Angel fades to an ember, the clock says 3:59, and the halo's shadow on
// the wall grows horns: "When kindness fails…" / "…the devil gets to work." -> "full film on the channel".
// Sound: scripts/short03_score.py. Shorts safe area (measured on the user's iPhone): key text in x 100-980 for
// y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView } from "./Film04";
import type { Cam } from "./Film04";
import { STY, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given); `days` = the rent counter (none = hidden)
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; days?: number; card?: "cta" };
// (heads sit below y 620 wherever the counter is up; faces are either whole in the frame or out of it)
const RAW: Seg[] = [
  // hook: the Angel, glowing, close: "Rest."
  { id: "hook", f0: 17.3, f1: 18.5, cam: c(2.5, 1190, 470), days: 30 },
  // her comfort, over his face
  { id: "comfort", f0: 18.5, f1: 20.9, cam: (t) => [mix(2.35, 2.5, (t - 18.5) / 2.4), 720, 550], days: 30 },
  // "One step at a time." (she reaches for him)
  { id: "step", f0: 21.2, f1: 23.0, cam: c(2.0, 1090, 520), days: 30 },
  // one try, NOT SELECTED
  { f0: 23.65, f1: 24.65, cam: c(2.0, 820, 580), days: 30 },
  { f0: 25.95, f1: 26.45, dur: 1.2, cam: c(1.0, 946, 763) },
  { f0: 26.5, f1: 27.3, cam: (t) => [mix(2.5, 2.8, sm((t - 26.5) / 0.3)), 712, 540], days: 30 },
  // "Again?" "Tomorrow."
  { id: "again", f0: 27.35, f1: 28.75, cam: c(2.3, 1140, 460), days: 30 },
  { id: "tomorrow", f0: 28.8, f1: 30.1, cam: c(2.4, 730, 550), days: 30 },
  // the nights slip: "Tomorrow." / "Rest.", the second notice, three rejections
  { id: "tomorrow2", f0: 30.22, f1: 31.08, dur: 1.2, cam: c(2.2, 740, 560), days: 28 },
  { f0: 31.12, f1: 31.98, dur: 1.0, cam: c(3.0, CLOCK_XY[0], CLOCK_XY[1]), days: 26 },
  { id: "rest2", f0: 32.02, f1: 32.88, dur: 1.2, cam: c(1.78, 860, 560), days: 24 },
  // (no counter here: the notice slides in through the top of the frame)
  { f0: 33.0, f1: 33.85, dur: 1.3, cam: c(2.3, 905, 400) },
  { f0: 33.95, f1: 34.78, dur: 1.3, cam: c(0.92, 970, 700) },
  { f0: 34.82, f1: 35.68, dur: 1.0, cam: (t) => [mix(3.1, 3.4, (t - 34.82) / 0.86), 728, 518], days: 19 },
  // the floor: her last kindness, his answer
  { id: "still", f0: 41.5, f1: 43.9, cam: c(1.9, 870, 680), days: 18 },
  { id: "stopping", f0: 44.05, f1: 46.95, cam: (t) => [mix(2.05, 2.15, (t - 44.05) / 2.9), 820, 660], days: 18 },
  // the Angel burns down to an ember; 3:59
  { f0: 47.25, f1: 48.75, cam: c(2.2, 860, 700) },
  { f0: 48.85, f1: 49.85, cam: c(3.0, CLOCK_XY[0], CLOCK_XY[1]) },
  // the halo's shadow on the wall grows horns over him
  { id: "horns", f0: 51.0, f1: 54.4, cam: (t) => { const u = sm((t - 51.0) / 3.4); return [mix(2.0, 1.8, u), mix(880, 800, u), mix(470, 420, u)]; } },
  // call to action over the red light under the door
  { f0: 54.4, f1: 56.15, dur: 3.0, cam: c(2.0, 985, 640), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => { const d = g.dur ?? g.f1 - g.f0; const o = { ...g, s0: s, d }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT3_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
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
// the rent counter: a little house and "N DAYS LEFT", popping when it changes
const House: React.FC<{ red: boolean }> = ({ red }) => (
  <svg width={92} height={92} viewBox="-46 -46 92 92" style={{ flex: "none" }}>
    <path d="M-34,-2 L0,-34 L34,-2 L26,-2 L26,34 L-26,34 L-26,-2 Z" fill="#f1ece2" stroke="#000" strokeWidth={4} strokeLinejoin="round" />
    <rect x={-9} y={10} width={18} height={24} fill={red ? "#ff3b2a" : "#e0483a"} stroke="#000" strokeWidth={3} />
  </svg>
);

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short03: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const si = SEGS.indexOf(seg);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const filmCut = CUTS.find((cu) => tf >= cu.t0 && tf < cu.t1);
  const cut = filmCut && filmCut.scene ? { ...filmCut, cam: seg.cam } : null;
  // when did the counter last change (for its pop); a shot without the counter does not count as a change
  let ch = si;
  for (let j = si - 1; j >= 0; j--) {
    if (SEGS[j].days === undefined) continue;
    if (SEGS[j].days !== seg.days) break;
    ch = j;
  }
  const since = si === 0 ? 1 : ts - SEGS[ch].s0;
  const pop = 1 + 0.3 * (1 - sm(since / 0.18));
  const low = (seg.days ?? 30) < 20;
  const cta = seg.card === "cta" ? u : -1;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      <Cap who="angel" text="Rest." s0={-0.3} s1={endOf("hook")} ts={ts} size={150} y={1180} />
      <Cap who="angel" text="You don't have to solve everything tonight." s0={startOf("comfort") + 0.05} s1={endOf("comfort")} ts={ts} size={76} y={1230} />
      <Cap who="angel" text="One step at a time." s0={startOf("step") + 0.1} s1={endOf("step")} ts={ts} size={96} y={1230} />
      <Cap who="angel" text="Again?" s0={startOf("again") + 0.05} s1={endOf("again")} ts={ts} size={110} y={1240} />
      <Cap who="bean" text="Tomorrow." s0={startOf("tomorrow") + 0.1} s1={endOf("tomorrow")} ts={ts} size={110} y={1240} />
      <Cap who="bean" text="Tomorrow." s0={startOf("tomorrow2")} s1={endOf("tomorrow2")} ts={ts} size={110} y={1240} rate={80} />
      <Cap who="angel" text="Rest." s0={startOf("rest2")} s1={endOf("rest2")} ts={ts} size={130} y={1220} rate={80} />
      <Cap who="angel" text={"You can still\ntake one step."} s0={startOf("still") + 0.1} s1={endOf("still")} ts={ts} size={84} y={1400} w={860} />
      <Cap who="bean" text={"I keep taking one…\nthen stopping."} s0={startOf("stopping") + 0.1} s1={endOf("stopping")} ts={ts} size={74} y={1440} w={860} />
      <Cap who="say" text="When kindness fails…" s0={startOf("horns") + 0.35} s1={startOf("horns") + 1.9} ts={ts} size={72} y={900} w={880} rate={30} />
      <Cap who="say" text={"…the devil\ngets to work."} s0={startOf("horns") + 1.95} s1={endOf("horns")} ts={ts} size={84} y={840} w={880} rate={30} red />
      {seg.days !== undefined && (
        <div style={{ position: "absolute", left: 100, top: 404, display: "flex", alignItems: "center", gap: 14, transform: `scale(${pop})`, transformOrigin: "0 50%",
          fontFamily: "Avenir Next", fontWeight: 900, fontSize: 84, letterSpacing: 2, color: low ? "#ff6a5a" : "#f4efe6",
          textShadow: "0 4px 12px #000, 0 0 24px rgba(0,0,0,0.8)" }}>
          <House red={low} />
          <span>{seg.days} DAYS LEFT</span>
        </div>
      )}
      {seg.days !== undefined && (
        <div style={{ position: "absolute", left: 206, top: 508, fontFamily: "Avenir Next", fontWeight: 800, fontSize: 70, color: "#c9c2b4",
          textShadow: "0 4px 12px #000, 0 0 24px rgba(0,0,0,0.8)" }}>to pay the rent</div>
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
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      {!(qa && qa.length) && <Audio src={staticFile("audio/short03_mix.wav")} />}
    </AbsoluteFill>
  );
};
