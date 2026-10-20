// Short 02 for Inner Devil Films: "tomorrow-mom", a 31 s vertical cut of TOMORROW (Film04) about the stake:
// Mom's heart medicine. Mom's text on his phone (hook) -> he answers "I'll figure it out, Mom." -> the Angel's
// comfort -> one try, rejected -> "Again?" / "Tomorrow." -> the days slip while her medicine counts down ->
// "I ran out today." -> his tear at 0 days -> "full film on the channel". Sound: scripts/short02_score.py.
// Shorts safe area (measured on the user's iPhone): key text in x 100-980 for y 400-1000, x 100-870 for y 1000-1640.
// The phone is drawn for the tall frame (BigPhone, 70 px bubbles), not the film's 1920 x 1080 PhonePOV.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView } from "./Film04";
import type { Cam } from "./Film04";
import { STY, k, mix, sm } from "./film/kit";
import type { Who } from "./film/kit";
import { CLOCK_XY } from "./film/desk";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
// each segment plays film time f0..f1 (stretched to `dur` seconds if given: only the still phone shots are);
// `days` = the medicine counter during the segment (none = hidden)
type Seg = { f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; phone?: 1 | 2; days?: number; card?: "cta" };
const RAW: Seg[] = [
  // hook: Mom's text, already on his phone; she answers, he types back
  { f0: 11.4, f1: 14.3, dur: 4.8, cam: c(1.9, 760, 560), phone: 1 },
  { f0: 14.4, f1: 15.3, cam: c(2.2, 735, 610), days: 7 },
  // the Angel
  { f0: 16.75, f1: 17.85, cam: (t) => [mix(2.3, 2.45, (t - 16.75) / 1.1), 1190, 470], days: 7 },
  { f0: 18.15, f1: 19.55, cam: c(2.6, 1185, 500), days: 7 },
  { f0: 19.55, f1: 20.9, cam: c(2.5, 720, 600), days: 7 },
  // one try: he applies, it is rejected
  { f0: 23.65, f1: 24.8, cam: c(2.0, 820, 620), days: 7 },
  // (the screen's words sit above y 1000, clear of the buttons on the right; no counter over the screen)
  { f0: 24.9, f1: 25.9, cam: (t) => [mix(1.27, 1.31, (t - 24.9) / 1.0), 970, 740] },
  { f0: 25.95, f1: 26.45, dur: 1.2, cam: c(1.0, 946, 763) },
  // "Again?" "Tomorrow."
  { f0: 27.35, f1: 28.75, cam: c(2.3, 1140, 460), days: 7 },
  { f0: 28.8, f1: 30.1, cam: c(2.4, 730, 570), days: 7 },
  // the days slip
  // (each shot held 1.0 s, a touch slower than the film, so every number of the countdown is on screen 1 s)
  { f0: 30.22, f1: 31.08, dur: 1.0, cam: c(2.2, 740, 600), days: 6 },
  { f0: 31.12, f1: 31.98, dur: 1.0, cam: c(3.0, CLOCK_XY[0], CLOCK_XY[1]), days: 5 },
  { f0: 32.02, f1: 32.88, dur: 1.0, cam: c(1.78, 840, 580), days: 4 },
  { f0: 32.95, f1: 33.85, dur: 1.0, cam: c(1.78, 950, 470), days: 3 },
  { f0: 34.82, f1: 35.68, dur: 1.0, cam: (t) => [mix(3.1, 3.4, (t - 34.82) / 0.86), 728, 548], days: 2 },
  // the floor; Mom again
  { f0: 35.75, f1: 36.75, cam: c(2.0, 820, 700), days: 1 },
  { f0: 36.85, f1: 39.85, dur: 4.6, cam: c(1.9, 760, 640), phone: 2 },
  // "I ran out today."
  { f0: 39.9, f1: 41.6, cam: (t) => [mix(3.1, 3.3, (t - 39.9) / 1.7), 790, 648], days: 0 },
  // call to action over the floor scene (the Angel reaching for him)
  { f0: 41.6, f1: 44.6, cam: c(2.0, 830, 720), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => { const d = g.dur ?? g.f1 - g.f0; const o = { ...g, s0: s, d }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT2_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
const segAt = (ts: number) => SEGS.find((g) => ts >= g.s0 && ts < g.s0 + g.d) ?? LAST;
const startOf = (i: number) => SEGS[i].s0;

// ------------------------------------------------------------------ his phone, filling the tall frame
type Msg = { u: number; text: string; me?: boolean; sep?: boolean };
const MOM1 = "My heart medicine runs out next week. It costs $600.";
const REPLY = "I'll figure it out, Mom.";
// u = seconds since the phone shot began; u < 0 = already there when it begins
const CHAT_A: Msg[] = [
  { u: -1, sep: true, text: "Yesterday 9:40 PM" },
  { u: -1, me: true, text: "How are you feeling, Mom?" },
  { u: -1, sep: true, text: "Today 2:13 AM" },
  { u: -1, text: MOM1 },
  { u: 1.5, text: "Pay your rent first, sweetheart. I'll manage." },
  { u: 3.75, me: true, text: REPLY },
];
const CHAT_B: Msg[] = [
  { u: -1, sep: true, text: "Tue 2:13 AM" },
  { u: -1, text: MOM1 },
  { u: -1, me: true, text: REPLY },
  { u: -1, sep: true, text: "Today 3:58 AM" },
  { u: -1, text: "The pharmacy won't give me my medicine until it's paid." },
  { u: 2.4, text: "I ran out today." },
];
const BUB = 70; // bubble text size (px)
// rough height of a bubble, for the scroll as a new one arrives
const estH = (m: Msg) => (m.sep ? 70 : Math.ceil(m.text.length / 17) * BUB * 1.2 + 56) + 22;

const Hand: React.FC<{ x: number; sd: number }> = ({ x, sd }) => (
  <g transform={`translate(${x},1880) scale(${sd},1)`}>
    <path d="M-170,260 L-90,-20 L90,-30 L120,260 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={9} strokeLinejoin="round" />
    <path d="M0,-150 C80,-150 132,-84 132,-6 C132,78 74,124 0,124 C-74,124 -126,78 -126,-6 C-126,-84 -80,-150 0,-150 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={9} />
    <ellipse cx={-34} cy={14} rx={56} ry={78} fill="#cfc4b3" opacity={0.6} />
  </g>
);

const BigPhone: React.FC<{ u: number; t: number; clock: string; msgs: Msg[]; typing?: [number, number][];
  draft?: { u0: number; u1: number; text: string }; rise?: boolean }> = ({ u, t, clock, msgs, typing = [], draft, rise }) => {
  const up = rise ? sm(u / 0.22) : 1;
  const tx = Math.sin(t * 1.7) * 4, ty = Math.cos(t * 1.3) * 3 + (1 - up) * 260, rot = -1.2 + Math.sin(t * 1.1) * 0.4;
  const shown = msgs.filter((m) => u >= m.u);
  const newest = shown[shown.length - 1];
  const arr = newest && newest.u >= 0 ? sm((u - newest.u) / 0.22) : 1;
  const isTyping = typing.some(([a, b]) => u >= a && u < b);
  const typed = draft && u >= draft.u0 && u < draft.u1 + 0.05 ? draft.text.slice(0, Math.ceil(draft.text.length * Math.min(1, (u - draft.u0) / (draft.u1 - draft.u0 - 0.15)))) : "";
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, transformOrigin: "540px 1000px", fontFamily: "Avenir Next" }}>
      <div style={{ position: "absolute", left: 40, top: 290, width: 900, height: 1720, borderRadius: 100, background: "linear-gradient(160deg, #262830, #0d0e12)",
        border: "4px solid #353841", boxShadow: "0 0 120px rgba(140,175,255,0.30), 0 40px 120px rgba(0,0,0,0.85)" }}>
        <div style={{ position: "absolute", left: 18, top: 18, width: 856, height: 1676, borderRadius: 84, background: "#0b0d12", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 353, top: 20, width: 150, height: 44, borderRadius: 22, background: "#000" }} />
          {/* status bar (under the app's top bar on a real phone) */}
          <div style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", color: "#fff", fontSize: 34, fontWeight: 700 }}>
            <span>{clock}</span>
            <span style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
              {[10, 15, 20, 25].map((h) => <span key={h} style={{ width: 7, height: h, background: "#fff", borderRadius: 2 }} />)}
              <span style={{ marginLeft: 12, width: 50, height: 24, border: "3px solid #fff", borderRadius: 7, padding: 3, boxSizing: "border-box" }}><span style={{ display: "block", width: "40%", height: "100%", background: "#fff", borderRadius: 2 }} /></span>
            </span>
          </div>
          {/* header: Mom */}
          <div style={{ height: 156, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", borderBottom: "2px solid #22252d", boxSizing: "border-box" }}>
            <span style={{ color: "#3b82f6", fontSize: 96, lineHeight: "60px", marginTop: -14 }}>‹</span>
            <div style={{ width: 108, height: 108, borderRadius: 54, background: "#4b5a73", color: "#fff", fontSize: 54, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>M</div>
            <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, lineHeight: 1 }}>Mom</div>
          </div>
          {/* the thread, newest at the bottom; older bubbles scroll up under the header */}
          <div style={{ position: "absolute", left: 0, top: 240, width: 856, height: 1030, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 48, right: 66, bottom: 18, display: "flex", flexDirection: "column", gap: 22,
              transform: `translateY(${newest && newest.u >= 0 ? (1 - arr) * estH(newest) : 0}px)` }}>
              {shown.map((m, i) => {
                const a = m.u < 0 ? 1 : sm((u - m.u) / 0.22);
                if (m.sep) return <div key={i} style={{ alignSelf: "center", color: "#8a8f9b", fontSize: 48, fontWeight: 700, margin: "6px 0" }}>{m.text}</div>;
                return (
                  <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 680, padding: "24px 34px", borderRadius: 48,
                    borderBottomLeftRadius: m.me ? 48 : 12, borderBottomRightRadius: m.me ? 12 : 48, background: m.me ? "#2f6fe0" : "#2a2e38", color: "#f4f5f7",
                    fontSize: BUB, lineHeight: 1.18, fontWeight: 600, opacity: a, transform: `translateY(${(1 - a) * 30}px) scale(${0.92 + 0.08 * a})`,
                    transformOrigin: m.me ? "100% 100%" : "0 100%" }}>{m.text}</div>
                );
              })}
              {isTyping && (
                <div style={{ alignSelf: "flex-start", display: "flex", gap: 16, padding: "36px 38px", borderRadius: 48, borderBottomLeftRadius: 12, background: "#2a2e38" }}>
                  {[0, 1, 2].map((d) => <div key={d} style={{ width: 24, height: 24, borderRadius: 12, background: "#9aa0ab", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - d * 0.9)) }} />)}
                </div>
              )}
            </div>
          </div>
          {/* the text field: what he types appears here first */}
          <div style={{ position: "absolute", left: 40, top: 1282, width: 760, height: 100, borderRadius: 50, border: "3px solid #2c3039", boxSizing: "border-box",
            display: "flex", alignItems: "center", padding: "0 34px", fontSize: 50, fontWeight: 600, color: typed ? "#f4f5f7" : "#5d626d" }}>
            {typed || "Text Message"}{typed && Math.floor(t * 4) % 2 === 0 ? <span style={{ color: "#3b82f6" }}>|</span> : null}
          </div>
          {typed && <div style={{ position: "absolute", left: 704, top: 1294, width: 76, height: 76, borderRadius: 38, background: "#2f6fe0", color: "#fff", fontSize: 50, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>}
          <div style={{ position: "absolute", left: 318, top: 1640, width: 220, height: 10, borderRadius: 5, background: "#c9ccd3" }} />
        </div>
        <div style={{ position: "absolute", left: 18, top: 18, width: 856, height: 1676, borderRadius: 84, background: "linear-gradient(125deg, rgba(255,255,255,0.07), rgba(255,255,255,0) 40%)" }} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Hand x={70} sd={1} /><Hand x={910} sd={-1} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ words on screen
const Cap: React.FC<{ who: Who; text: string; s0: number; s1: number; ts: number; size: number; y: number; x?: number; w?: number }> = ({ who, text, s0, s1, ts, size, y, x = 485, w = 760 }) => {
  const op = k(ts, [s0, s0 + 0.15, s1 - 0.25, s1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const n = Math.max(1, Math.ceil((ts - s0) * 45));
  // a soft dark plate behind the words; the untyped rest is laid out (transparent) so the plate does not grow
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: "rgba(6,5,9,0.58)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.58)",
        textAlign: "center", ...STY[who], fontSize: size, lineHeight: 1.18 }}>
        {text.slice(0, n)}<span style={{ color: "transparent", textShadow: "none" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};
// the medicine counter: a capsule and "N DAYS LEFT", popping when it changes
const Pill: React.FC<{ red: boolean }> = ({ red }) => (
  <svg width={96} height={96} viewBox="-48 -48 96 96" style={{ flex: "none" }}>
    <g transform="rotate(-35)">
      <rect x={-40} y={-18} width={80} height={36} rx={18} fill="#f1ece2" stroke="#000" strokeWidth={4} />
      <path d="M0,-18 L-22,-18 A18,18 0 0 0 -22,18 L0,18 Z" fill={red ? "#ff3b2a" : "#e0483a"} />
      <rect x={-40} y={-18} width={80} height={36} rx={18} fill="none" stroke="#000" strokeWidth={4} />
    </g>
  </svg>
);

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short02: React.FC<{ qa?: number[] }> = ({ qa }) => {
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
  const since = ts - startOf(ch);
  const zero = seg.days === 0;
  const pop = 1 + (zero ? 0.7 : 0.45) * (1 - sm(since / (zero ? 0.25 : 0.18)));
  const cta = seg.card === "cta" ? u : -1;
  const capA0 = startOf(3) + 0.05, capA1 = startOf(5) - 0.05; // the Angel's line runs over two shots
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      {seg.phone === 1 && <BigPhone u={u} t={tf} clock="2:13" msgs={CHAT_A} typing={[[0.7, 1.5]]} draft={{ u0: 2.55, u1: 3.75, text: REPLY }} />}
      {seg.phone === 2 && <BigPhone u={u} t={tf} clock="3:58" msgs={CHAT_B} typing={[[1.3, 2.4]]} rise />}
      <Cap who="angel" text="You don't have to solve everything tonight." s0={capA0} s1={capA1} ts={ts} size={76} y={1230} />
      <Cap who="angel" text="Again?" s0={startOf(8) + 0.05} s1={startOf(9)} ts={ts} size={110} y={1240} />
      <Cap who="bean" text="Tomorrow." s0={startOf(9) + 0.1} s1={startOf(10)} ts={ts} size={110} y={1240} />
      {seg.days !== undefined && (
        <div style={{ position: "absolute", left: 100, top: 404, display: "flex", alignItems: "center", gap: 14, transform: `scale(${pop})`, transformOrigin: "0 50%",
          fontFamily: "Avenir Next", fontWeight: 900, fontSize: 84, letterSpacing: 2, color: zero ? "#ff4a3a" : "#f4efe6",
          textShadow: zero ? "0 0 22px rgba(255,40,20,0.85), 0 4px 10px #000" : "0 4px 12px #000, 0 0 24px rgba(0,0,0,0.8)" }}>
          <Pill red={zero} />
          <span>{seg.days} {seg.days === 1 ? "DAY" : "DAYS"} LEFT</span>
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
      {!(qa && qa.length) && <Audio src={staticFile("audio/short02_mix.wav")} />}
    </AbsoluteFill>
  );
};
