// Short 07 for Inner Devil Films: "tomorrow-reveal", a 27 s vertical cut of TOMORROW (Film04): the voice was the same.
// Hook: the Devil beside him at 9:04, rent and medicine paid, "The Devil saved him. Then he saw who it really was."
// -> he turns and faces it; it reaches for him -> red turns gold, the horns melt into a halo, a beat of silence, the
// flash: it is the Angel -> she reaches for him; on the wall the shadow wears a halo now -> his tear -> "You never
// listened when I was kind." -> the RENT and MEDICINE papers, PAID -> "I heard you. I kept choosing tomorrow." ->
// "The voice was always the same. The choice was finally his." -> "full film on the channel".
// Every segment plays one stretch of the film's reveal through its own vertical camera.
// Sound: scripts/short07_score.py. Shorts safe area (measured on the user's iPhone): key text in x 100-980 for
// y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView } from "./Film04";
import type { Cam } from "./Film04";
import { STY, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
const push = (t0: number, d: number, z0: number, z1: number, x: number, y: number) => (t: number): Cam => [mix(z0, z1, (t - t0) / d), x, y, 0];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given) in the film cut that contains f0
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; card?: "cta" };
const RAW: Seg[] = [
  // hook: the Devil still beside him at 9:04; he glances back at it
  { id: "hook", f0: 117.4, f1: 119.8, cam: push(117.4, 2.4, 1.9, 2.0, 545, 560) },
  // he turns and faces it; it reaches for him
  { id: "turn", f0: 119.8, f1: 121.6, cam: c(1.9, 480, 580) },
  { id: "reach", f0: 121.6, f1: 122.8, cam: c(2.5, 470, 520) },
  // red turns gold, the horns melt into a halo, the flash: the Angel
  { id: "change", f0: 122.8, f1: 126.0, cam: push(122.8, 3.2, 1.8, 1.95, 470, 560) },
  { id: "angel", f0: 126.0, f1: 127.6, cam: c(2.4, 500, 530) },
  // on the wall, the shadow wears a halo now
  { id: "shadow", f0: 127.6, f1: 128.8, cam: c(2.0, 450, 380) },
  // his tear
  { id: "tear", f0: 128.8, f1: 130.2, cam: c(2.9, 520, 545) },
  // "You never listened when I was kind."
  { id: "kind", f0: 130.2, f1: 133.8, cam: push(130.2, 3.6, 1.85, 1.95, 560, 600) },
  // the papers on the floor: RENT, MEDICINE, both PAID
  { id: "paid", f0: 135.4, f1: 136.6, cam: c(3.0, 517, 990) },
  // "I heard you. I kept choosing tomorrow."
  { id: "heard", f0: 136.8, f1: 139.8, cam: push(136.8, 3.0, 2.0, 2.1, 590, 600) },
  // the film's last lines over the last of the shot
  { id: "last", f0: 139.8, f1: 142.0, dur: 3.4, cam: push(139.8, 2.2, 1.75, 1.7, 570, 390) },
  // call to action over the end of that shot
  { f0: 141.2, f1: 142.0, dur: 3.0, cam: c(1.7, 570, 390), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => {
  const d = g.dur ?? g.f1 - g.f0;
  const cut = CUTS.find((cu) => g.f0 + 1e-6 >= cu.t0 && g.f0 + 1e-6 < cu.t1)!;
  const o = { ...g, s0: s, d, cut }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT7_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
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

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short07: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const cut = seg.cut.scene ? { ...seg.cut, cam: seg.cam } : null;
  const cta = seg.card === "cta" ? u : -1;
  const last = seg.id === "last" ? u : cta >= 0 ? byId("last").d + cta : -1;
  const dim = last >= 0 ? 0.55 * sm(last / 0.5) : 0;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      {dim > 0 && cta < 0 && <AbsoluteFill style={{ background: `rgba(4,3,4,${dim})` }} />}
      {/* the hook: on screen from the first frame */}
      {ts < endOf("turn") + 0.2 && (
        <div style={{ position: "absolute", left: 100, width: 770, top: 1150, textAlign: "center", fontFamily: "Avenir Next",
          opacity: k(ts, [0, endOf("turn"), endOf("turn") + 0.2], [1, 1, 0]) }}>
          <div style={{ display: "inline-block", padding: "8px 34px 12px", borderRadius: 40, background: "rgba(6,5,9,0.66)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.66)" }}>
            <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.05, color: "#f4efe6", textShadow: "0 4px 12px #000", transform: `scale(${1.08 - 0.08 * sm(ts / 0.2)})` }}>
              The <span style={{ color: "#ff3b2a", textShadow: "0 0 30px rgba(255,40,20,0.8), 0 4px 12px #000" }}>Devil</span><br />saved him.
            </div>
            <div style={{ marginTop: 26, fontSize: 76, fontWeight: 800, lineHeight: 1.1, color: "#ffd27a", textShadow: "0 3px 10px #000",
              opacity: sm((ts - 1.1) / 0.2) }}>Then he saw who<br />it really was.</div>
          </div>
        </div>
      )}
      <Cap who="angel" text={"You never listened\nwhen I was kind."} s0={startOf("kind") + 0.15} s1={endOf("kind")} ts={ts} size={84} y={1330} rate={30} />
      <Cap who="bean" text={"I heard you.\nI kept choosing\ntomorrow."} s0={startOf("heard") + 0.15} s1={endOf("heard") + 0.1} ts={ts} size={80} y={1260} rate={30} />
      {last >= 0 && (
        <div style={{ position: "absolute", left: 100, width: 880, top: 520, textAlign: "center", fontFamily: "Avenir Next", opacity: 1 - sm((cta - 0.05) / 0.25) }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.12, color: "#f4efe6", textShadow: "0 3px 12px #000", opacity: sm((last - 0.2) / 0.35) }}>The voice was<br />always the same.</div>
          <div style={{ marginTop: 60, fontSize: 80, fontWeight: 800, lineHeight: 1.12, color: "#ffd27a", textShadow: "0 0 26px rgba(255,190,90,0.75), 0 3px 12px #000",
            opacity: sm((last - 1.6) / 0.35) }}>The choice was<br />finally his.</div>
        </div>
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
      {!(qa && qa.length) && <Audio src={staticFile("audio/short07_mix.wav")} />}
    </AbsoluteFill>
  );
};
