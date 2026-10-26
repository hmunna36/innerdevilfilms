// Short 08 for Inner Devil Films: "justonemore-hook", a vertical cut of JUST ONE MORE (Film05): the whole story fast.
// Hook: 4:12 AM, exam in 3 days, the phone at 1% dies and his reflection's eyes ignite -> the Devil over him: "Put it
// down." -> 4 DAYS EARLIER -> Dad's texts ("Pass the exam. I can't do one more year of night shifts." / "I'll pass it.
// I promise.") -> the Angel's "Just one more." -> the nights slip -> 3 days left, his own "Just one more." -> "Put it
// down." -> the plug drops, silence -> DEVIL MODE -> the phone into the drawer -> the knocks -> the note under the door
// -> "It's my birthday. I just wanted to see you. - Dad" -> "full film on the channel".
// Every segment plays one stretch of the film through its own vertical camera. Sound: scripts/short08_score.py.
// Shorts safe area (measured on the user's iPhone): key text in x 100-980 for y 400-1000, x 100-870 for y 1000-1640.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { CUTS, CutView, NoteBirthday, Phones, daysAt, flashOf } from "./Film05";
import type { Cam } from "./Film05";
import { k, mix, sm } from "./film/kit";
import { CLOCK_XY } from "./film/desk";
import { VestIcon } from "./film/phone";

const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
const push = (t0: number, d: number, z0: number, z1: number, x: number, y: number, r = 0) => (t: number): Cam => [mix(z0, z1, (t - t0) / d), x, y, r];
const CLK = c(4.2, CLOCK_XY[0], CLOCK_XY[1] + 38);
// each segment plays film time f0..f1 (stretched to `dur` seconds if given) in the film cut that contains f0;
// phone = the film's phone shot ("film") or Dad's chat drawn for the tall frame ("dad"); card = a title card
type Seg = { id?: string; f0: number; f1: number; dur?: number; cam: (tf: number) => Cam; phone?: "film" | "dad"; card?: "earlier" | "cta"; days?: boolean };
const RAW: Seg[] = [
  // hook: 4:12 AM, exam in 3 days; the phone at 1% dies and his reflection's eyes ignite
  { id: "feed", f0: 0.0, f1: 1.0, dur: 1.2, cam: c(1.9, 960, 540), phone: "film", days: true },
  { id: "glass", f0: 1.0, f1: 1.9, cam: c(1.9, 960, 540), phone: "film", days: true },
  // the Devil over him in bed: "Put it down."
  { id: "bed", f0: 1.9, f1: 3.2, cam: push(1.9, 1.3, 1.85, 1.92, 975, 215, -2), days: true },
  { id: "earlier", f0: 3.2, f1: 4.6, cam: c(1, 960, 540), card: "earlier", days: true },
  // Dad
  { id: "dad", f0: 7.6, f1: 11.2, dur: 5.6, cam: c(1.9, 960, 540), phone: "dad" },
  // the Angel: "Just one more."
  { id: "angel", f0: 28.4, f1: 29.8, cam: c(2.2, 780, 520), days: true },
  // the nights slip
  { id: "n1", f0: 32.6, f1: 33.3, cam: CLK, days: true },
  { id: "n2", f0: 34.6, f1: 35.3, cam: c(2.2, 720, 674), days: true },
  { id: "n3", f0: 35.3, f1: 36.0, cam: CLK, days: true },
  // three days left: his own "Just one more."
  { id: "own", f0: 66.7, f1: 68.1, cam: c(2.0, 900, 300), days: true },
  // the Devil: "Put it down."; the plug drops; silence
  { id: "down", f0: 80.1, f1: 81.7, cam: push(80.1, 1.6, 1.85, 1.92, 975, 215, -3), days: true },
  { id: "plug", f0: 81.7, f1: 83.5, cam: c(2.5, 985, 351), days: true },
  { id: "freeze", f0: 83.5, f1: 84.1, cam: c(2.5, 985, 351), days: true },
  // DEVIL MODE
  { id: "drop", f0: 84.1, f1: 87.5, cam: (t) => [mix(1.75, 1.9, sm((t - 84.1) / 0.5)), 600, mix(560, 506, sm((t - 84.1) / 0.8))], days: true },
  { id: "drawer", f0: 87.5, f1: 88.9, cam: c(1.9, 1000, 640), days: true },
  // the knocks; the note under the door
  { id: "knock", f0: 99.9, f1: 101.4, cam: c(1.9, 1010, 440), days: true },
  { id: "under", f0: 106.2, f1: 107.8, cam: push(106.2, 1.6, 2.7, 2.8, 930, 615), days: true },
  // Dad's note
  { id: "note", f0: 126.9, f1: 131.1, cam: c(1.9, 1462, 617) },
  // call to action over the dark room behind the note
  { f0: 129.0, f1: 131.0, dur: 3.0, cam: c(1.9, 1462, 617), card: "cta" },
];
export const SEGS = (() => { let s = 0; return RAW.map((g) => {
  const d = g.dur ?? g.f1 - g.f0;
  const cut = CUTS.find((cu) => g.f0 + 1e-6 >= cu.t0 && g.f0 + 1e-6 < cu.t1)!;
  const o = { ...g, s0: s, d, cut }; s += d; return o; }); })();
const LAST = SEGS[SEGS.length - 1];
export const SHORT8_FRAMES = Math.round((LAST.s0 + LAST.d) * 30);
const segAt = (ts: number) => SEGS.find((g) => ts >= g.s0 && ts < g.s0 + g.d) ?? LAST;
const byId = (id: string) => SEGS.find((g) => g.id === id)!;
const startOf = (id: string) => byId(id).s0;
const endOf = (id: string) => byId(id).s0 + byId(id).d;
const filmT = (ts: number) => { const g = segAt(ts); return g.f0 + (ts - g.s0) * ((g.f1 - g.f0) / g.d); };
// the exam counter shown at short time ts (undefined = hidden)
const daysShown = (ts: number) => { const g = segAt(ts); return g.days ? daysAt(filmT(ts)) : undefined; };

// ------------------------------------------------------------------ Dad's chat, drawn for the tall frame
type Msg = { u: number; text: string; me?: boolean; sep?: boolean };
const PROMISE = "I'll pass it. I promise.";
// u = seconds since the phone shot began; u < 0 = already there when it begins
const DAD_CHAT: Msg[] = [
  { u: -1, sep: true, text: "Friday 11:40 PM" },
  { u: 0.3, text: "Night shift again." },
  { u: 1.4, text: "Pass the exam. I can't do one more year of night shifts." },
  { u: 4.55, me: true, text: PROMISE },
];
const BUB = 70; // bubble text size (px)
const Hand: React.FC<{ x: number; sd: number }> = ({ x, sd }) => (
  <g transform={`translate(${x},1880) scale(${sd},1)`}>
    <path d="M-170,260 L-90,-20 L90,-30 L120,260 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={9} strokeLinejoin="round" />
    <path d="M0,-150 C80,-150 132,-84 132,-6 C132,78 74,124 0,124 C-74,124 -126,78 -126,-6 C-126,-84 -80,-150 0,-150 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={9} />
    <ellipse cx={-34} cy={14} rx={56} ry={78} fill="#cfc4b3" opacity={0.6} />
  </g>
);
const DadPhone: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  const up = sm(u / 0.25);
  const tx = Math.sin(t * 1.7) * 4, ty = Math.cos(t * 1.3) * 3 + (1 - up) * 300, rot = -1.2 + Math.sin(t * 1.1) * 0.4;
  const shown = DAD_CHAT.filter((m) => u >= m.u);
  const isTyping = u >= 0.75 && u < 1.4;
  const d0 = 3.3, d1 = 4.45;
  const typed = u >= d0 && u < d1 + 0.1 ? PROMISE.slice(0, Math.ceil(PROMISE.length * Math.min(1, (u - d0) / (d1 - d0)))) : "";
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, transformOrigin: "540px 1000px", fontFamily: "Avenir Next" }}>
      <div style={{ position: "absolute", left: 40, top: 290, width: 900, height: 1720, borderRadius: 100, background: "linear-gradient(160deg, #262830, #0d0e12)",
        border: "4px solid #353841", boxShadow: "0 0 120px rgba(140,175,255,0.30), 0 40px 120px rgba(0,0,0,0.85)" }}>
        <div style={{ position: "absolute", left: 18, top: 18, width: 856, height: 1676, borderRadius: 84, background: "#0b0d12", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 353, top: 20, width: 150, height: 44, borderRadius: 22, background: "#000" }} />
          {/* status bar (under the app's top bar on a real phone) */}
          <div style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", color: "#fff", fontSize: 34, fontWeight: 700 }}>
            <span>11:40</span>
            <span style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
              {[10, 15, 20, 25].map((h) => <span key={h} style={{ width: 7, height: h, background: "#fff", borderRadius: 2 }} />)}
              <span style={{ marginLeft: 12, width: 50, height: 24, border: "3px solid #fff", borderRadius: 7, padding: 3, boxSizing: "border-box" }}><span style={{ display: "block", width: "70%", height: "100%", background: "#fff", borderRadius: 2 }} /></span>
            </span>
          </div>
          {/* header: Dad, in his work vest */}
          <div style={{ height: 156, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", borderBottom: "2px solid #22252d", boxSizing: "border-box" }}>
            <span style={{ color: "#3b82f6", fontSize: 96, lineHeight: "60px", marginTop: -14 }}>‹</span>
            <VestIcon size={108} />
            <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, lineHeight: 1 }}>Dad</div>
          </div>
          {/* the thread: a short one starts at the top, under the header */}
          <div style={{ position: "absolute", left: 0, top: 240, width: 856, height: 1030, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 48, right: 66, top: 18, display: "flex", flexDirection: "column", gap: 22 }}>
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

// ------------------------------------------------------------------ words on screen (the film's lettering)
type Who = "angel" | "devil" | "bean";
const OUTLINE: React.CSSProperties = { WebkitTextStroke: "9px rgba(8,6,6,0.92)", paintOrder: "stroke fill" };
const STY: Record<Who, React.CSSProperties> = {
  angel: { fontFamily: "Chalkboard SE", fontWeight: 700, color: "#ffd27a", textShadow: "0 4px 10px rgba(0,0,0,0.9)", ...OUTLINE },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, color: "#ff4a3a", textShadow: "0 4px 10px rgba(0,0,0,0.9), 0 0 26px rgba(255,40,20,0.7)", ...OUTLINE },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, color: "#ffffff", textShadow: "0 4px 10px rgba(0,0,0,0.9)", ...OUTLINE },
};
const Cap: React.FC<{ who: Who; text: string; s0: number; s1: number; ts: number; size: number; y: number; x?: number; w?: number; rate?: number }> = ({
  who, text, s0, s1, ts, size, y, x = 485, w = 760, rate = 30 }) => {
  const op = k(ts, [s0, s0 + 0.12, s1 - 0.2, s1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const n = Math.max(1, Math.ceil((ts - s0) * rate) + 1);
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ padding: "6px 28px", borderRadius: 40, background: "rgba(6,5,9,0.5)", boxShadow: "0 0 40px 22px rgba(6,5,9,0.5)",
        textAlign: "center", whiteSpace: "pre-line", ...STY[who], fontSize: size, lineHeight: 1.16 }}>
        {text.slice(0, n)}<span style={{ color: "transparent", textShadow: "none", WebkitTextStroke: "0px transparent" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};

// the exam counter, top left of the safe area; it pops when it changes
const Counter: React.FC<{ days: number; hot: boolean; pop: number }> = ({ days, hot, pop }) => (
  <div style={{ position: "absolute", left: 100, top: 404, transform: `scale(${pop})`, transformOrigin: "0 50%", fontFamily: "Avenir Next", fontWeight: 900,
    fontSize: 76, letterSpacing: 1, lineHeight: 1.1, color: hot ? "#ff4a3a" : "#f4efe6", padding: "6px 24px 10px", marginLeft: -24, borderRadius: 30,
    background: "radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 72%)",
    textShadow: hot ? "0 0 22px rgba(255,40,20,0.85), 0 4px 10px #000" : "0 4px 12px #000, 0 0 24px rgba(0,0,0,0.8)" }}>
    EXAM IN {days} {days === 1 ? "DAY" : "DAYS"}
  </div>
);

// the film's phone shots (cold open), scaled up for the tall frame
const PS = 1.4, PY = 440;

// qa: render a list of frames as a short sequence (for contact sheets)
export const Short08: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const ts = f / 30;
  const seg = segAt(ts);
  const u = ts - seg.s0;
  const tf = seg.f0 + u * ((seg.f1 - seg.f0) / seg.d);
  const cut = seg.cut.scene && seg.card !== "earlier" ? { ...seg.cut, cam: seg.cam } : null;
  const cta = seg.card === "cta" ? u : -1;
  const [flashCol, flashOp] = seg.card === "cta" ? ["#000", 0] : flashOf(tf);
  // the counter, and when it last changed (for its pop)
  const days = daysShown(ts);
  let since = 9;
  if (days !== undefined) for (let j = 1; j <= 12; j++) { if (daysShown((f - j) / 30) !== days || f - j < 0) { since = (j - 1) / 30; break; } }
  const pop = 1 + 0.35 * (1 - sm(since / 0.2));
  const hot = tf < 3.2 || tf >= 84.1;
  const slam = seg.id === "drop" && tf < 86.1;
  const slamS = 1.6 - 0.6 * sm((tf - 84.15) / 0.16);
  const ring = seg.id === "drop" && tf >= 84.15 && tf < 84.8 ? (tf - 84.15) / 0.65 : -1;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <AbsoluteFill style={{ filter: cta > 0 ? `blur(${(7 * sm(cta / 0.4)).toFixed(2)}px)` : undefined }}><CutView cut={cut} t={tf} W={1080} H={1920} /></AbsoluteFill>}
      {seg.phone === "film" && (
        <div style={{ position: "absolute", left: -420, top: 0, width: 1920, height: 1080, transform: `translateY(${PY}px) scale(${PS})`, transformOrigin: "960px 0px" }}>
          <Phones t={tf} />
        </div>
      )}
      {seg.phone === "dad" && <DadPhone u={u} t={tf} />}
      {/* Dad's note in his hands */}
      {seg.id === "note" && (
        <div style={{ position: "absolute", left: -360, top: 580, width: 1920, height: 1080 }}><NoteBirthday t={tf} /></div>
      )}
      {seg.card === "earlier" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "#050507" }}>
          <div style={{ fontFamily: "Avenir Next", fontWeight: 800, fontSize: 104, lineHeight: 1.12, letterSpacing: 10, paddingLeft: 10, textAlign: "center", color: "#f1ece2",
            opacity: k(tf, [3.3, 3.42, 4.45, 4.6], [0, 1, 1, 0]) }}>4 DAYS<br />EARLIER</div>
        </AbsoluteFill>
      )}
      <Cap who="devil" text="Put it down." s0={startOf("bed") + 0.1} s1={endOf("bed")} ts={ts} size={104} y={1390} rate={16} />
      <Cap who="angel" text="Just one more." s0={startOf("angel") + 0.1} s1={endOf("angel")} ts={ts} size={96} y={1260} />
      <Cap who="bean" text="Just one more." s0={startOf("own") + 0.05} s1={endOf("own")} ts={ts} size={96} y={1300} />
      <Cap who="devil" text="Put it down." s0={startOf("down") + 0.05} s1={endOf("down")} ts={ts} size={112} y={1390} rate={16} />
      {(seg.id === "knock" || seg.id === "under") && [100.25, 100.7, 101.15].map((kt, i) => {
        const a = seg.id === "knock" ? sm((tf - kt) / 0.06) : 1 - sm((u - 0.5) / 0.25);
        return a > 0 ? (
          <div key={i} style={{ position: "absolute", left: 130 + i * 70, top: 1080 + i * 150, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 96, letterSpacing: 4, color: "#f4efe6",
            transform: `rotate(${[-4, 3, -2][i]}deg) scale(${seg.id === "knock" ? 1.3 - 0.3 * sm((tf - kt) / 0.12) : 1})`, transformOrigin: "0 50%", opacity: a,
            textShadow: "0 4px 12px #000, 0 0 30px rgba(0,0,0,0.9)" }}>KNOCK.</div>
        ) : null;
      })}
      {days !== undefined && <Counter days={days} hot={hot} pop={pop} />}
      {slam && (
        <AbsoluteFill style={{ opacity: k(tf, [84.15, 84.22, 85.7, 86.1], [0, 1, 1, 0]) }}>
          <div style={{ position: "absolute", left: 100, width: 770, top: 1150, transformOrigin: "385px 160px",
            transform: `scale(${slamS}) translate(${Math.sin(tf * 90) * 7 * Math.exp(-(tf - 84.15) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 170,
            lineHeight: 0.95, textAlign: "center", letterSpacing: 12, color: "#ff3b2a", paddingLeft: 12,
            textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 7px 0 #3a0000" }}>DEVIL<br />MODE</div>
        </AbsoluteFill>
      )}
      {ring >= 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={800} r={60 + ring * 1500} fill="none" stroke="#ff3b2a" strokeWidth={36 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {cta >= 0 && (
        <AbsoluteFill style={{ background: `rgba(4,3,4,${0.76 * sm(cta / 0.3)})`, fontFamily: "Avenir Next" }}>
          <div style={{ position: "absolute", top: 500, left: 100, width: 880, textAlign: "center", opacity: sm((cta - 0.1) / 0.3) }}>
            <div style={{ color: "#f1ece2", fontSize: 74, fontWeight: 700, lineHeight: 1.15 }}>The phone ate<br />his nights.</div>
            <div style={{ marginTop: 70, color: "#f4efe6", fontSize: 96, fontWeight: 900, letterSpacing: 4, paddingLeft: 4, whiteSpace: "nowrap" }}>JUST ONE MORE</div>
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
      {!(qa && qa.length) && <Audio src={staticFile("audio/short08_mix.wav")} />}
    </AbsoluteFill>
  );
};
