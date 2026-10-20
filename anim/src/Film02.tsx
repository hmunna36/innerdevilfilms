// FILM 01 v2 — DEVIL MODE (about 2:32), fully animated with the code rig on the generated backgrounds.
// Script: scripts/film01_DEVILMODE_final.md. Bean / the Devil / the Angel follow Harshad's own sheets; the Friend is ours.
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Pose } from "./rig/figure";
import { BEAN_EXPR, BeanDefs, BeanExpr, BeanExprName, BeanSVG, DevilFace, DevilSVG, Smoke, buildBean } from "./rig/bean";
import { Angel } from "./rig/angel";
import { FLINCH, FRONT, FRONT_HOLD, FRONT_NOD, FRONT_WAVE, HOLD, HOLD_DOWN, PKey, POINT, PUMP, RUB, SEAT, SEAT_FLINCH, SEAT_HOLD, SIDE, TQ, TURN_AWAY, poseAt, walk } from "./rig/beanPoses";

export const FILM2_SECONDS = 152;
const FPS = 30;
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, x: number[], y: number[]) => interpolate(t, x, y, C);
const sm = (u: number) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };

// ------------------------------------------------------------------ helpers
function ex(name: BeanExprName, t: number, o: { talk?: boolean; blink?: boolean; red?: number } = {}): BeanExpr {
  const e = { ...BEAN_EXPR[name] };
  if (o.talk) e.mo = Math.sin(t * 22) > 0.1 ? 1 : 0;
  if (o.blink ?? true) { const ph = (t * 0.31) % 1; if (ph > 0.965) e.lid = 1.6; }
  if (o.red) e.red = o.red;
  return e;
}
type CharP = { pose: Pose; e: BeanExpr; x: number; y: number; s?: number; flip?: boolean; notes?: boolean; friend?: boolean; op?: number; id: string; jitter?: number; t?: number };
const Char: React.FC<CharP> = ({ pose, e, x, y, s = 1.3, flip, notes, friend, op = 1, id, jitter = 0, t = 0 }) => {
  let p = pose;
  if (jitter) {
    const j = (a: [number, number], sd: number): [number, number] => [a[0] + Math.sin(t * 60 + sd) * jitter, a[1] + Math.cos(t * 53 + sd) * jitter];
    p = { ...pose, wrR: j(pose.wrR, 1), wrL: j(pose.wrL, 2), elR: j(pose.elR, 3) };
  }
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${flip ? -s : s},${s})`} opacity={op}>
      <BeanSVG items={buildBean(p, e, { idp: id, notes, friend, view: p.t === 0 ? "front" : "side" })} />
    </g>
  );
};
const Devil: React.FC<{ pose: Pose; x: number; y: number; s?: number; flip?: boolean; op?: number; face?: DevilFace; id: string; glow?: number; lean?: number; t: number }> = ({
  pose, x, y, s = 1.2, flip, op = 1, face = "mischievous", id, glow = 1, lean = 0, t }) => (
  <g opacity={op}>
    <g transform={`translate(${x.toFixed(1)},${(y + Math.sin(t * 2.2) * 6).toFixed(1)}) scale(${flip ? -s : s},${s}) rotate(${lean} 0 -160)`}>
      <DevilSVG items={buildBean(pose, BEAN_EXPR.neutral, { idp: id, devil: true, horns: 1, devilFace: face, swirl: Math.sin(t * 1.5), view: pose.t === 0 ? "front" : "side" })} glow={glow} />
    </g>
    <Smoke cx={x} cy={y - 40 * s} s={s} f={t * 30} amount={op} />
  </g>
);
const walkAlong = (t: number, t0: number, t1: number, x0: number, x1: number, speed = 7) => {
  const u = sm((t - t0) / (t1 - t0));
  const moving = t > t0 && t < t1;
  return { x: x0 + (x1 - x0) * u, pose: moving ? walk((t - t0) * speed) : SIDE };
};

// ------------------------------------------------------------------ text, counter, camera
type Who = "narrator" | "angel" | "devil" | "friend" | "bean" | "card";
type Line = { t0: number; t1: number; who: Who; text: string; x?: number; y?: number };
const LINES: Line[] = [
  { t0: 3.1, t1: 4.0, who: "card", text: "He practised it forty times." },
  { t0: 5.5, t1: 11, who: "narrator", text: "He had stopped expecting much from himself." },
  { t0: 13, t1: 16.5, who: "angel", text: "Let's just try.", x: 1250, y: 230 },
  { t0: 21, t1: 23.8, who: "angel", text: "That's okay. Skip that bit.", x: 760, y: 200 },
  { t0: 27, t1: 29.5, who: "angel", text: "Good job!", x: 760, y: 200 },
  { t0: 37, t1: 40, who: "angel", text: "You're doing great.", x: 760, y: 200 },
  { t0: 61.5, t1: 65, who: "friend", text: "I couldn't hear you at the end.", x: 1200, y: 260 },
  { t0: 68.5, t1: 72, who: "angel", text: "There's always next time.", x: 1150, y: 240 },
  { t0: 76.5, t1: 78.8, who: "devil", text: "Kind didn't work.", x: 1250, y: 170 },
  { t0: 78.9, t1: 81, who: "devil", text: "Let's do it my way.", x: 1250, y: 170 },
  { t0: 83, t1: 85.8, who: "devil", text: "Again.", x: 1300, y: 180 },
  { t0: 90, t1: 91.6, who: "devil", text: "Again.", x: 1300, y: 180 },
  { t0: 96, t1: 97.6, who: "devil", text: "Again.", x: 1300, y: 180 },
  { t0: 112.5, t1: 116.5, who: "narrator", text: "Same room. Same line." },
  { t0: 119.5, t1: 122.5, who: "devil", text: "again.", x: 1450, y: 300 },
  { t0: 140.5, t1: 146.5, who: "card", text: "Kindness got him started." },
];
const STYLE: Record<Who, React.CSSProperties> = {
  narrator: { fontFamily: "Avenir Next", fontWeight: 500, fontSize: 42, color: "#f1ece2", textShadow: "0 2px 6px #000, 0 0 18px #000" },
  card: { fontFamily: "Avenir Next", fontWeight: 600, fontSize: 52, color: "#f1ece2" },
  angel: { fontFamily: "Chalkboard SE", fontWeight: 400, fontSize: 54, color: "#ffd27a", textShadow: "0 2px 4px #000, 0 0 18px rgba(255,190,90,0.8)" },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 58, color: "#ff4a3a", textShadow: "0 2px 4px #000, 0 0 22px rgba(255,40,20,0.9)" },
  friend: { fontFamily: "Chalkboard SE", fontWeight: 400, fontSize: 46, color: "#e7f0e3", textShadow: "0 2px 6px #000, 0 0 20px #000" },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 46, color: "#fff", textShadow: "0 2px 6px #000" },
};
const LineView: React.FC<{ l: Line; t: number }> = ({ l, t }) => {
  const op = k(t, [l.t0, l.t0 + 0.25, l.t1 - 0.3, l.t1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const typed = l.who === "narrator" || l.who === "card" ? l.text : l.text.slice(0, Math.max(1, Math.floor((t - l.t0) * 24)));
  const st: React.CSSProperties = { position: "absolute", opacity: op, textAlign: "center", ...STYLE[l.who] };
  if (l.who === "narrator") return <div style={{ ...st, left: 0, right: 0, bottom: 60 }}>{typed}</div>;
  if (l.who === "card") return <div style={{ ...st, left: 0, right: 0, top: 500 }}>{typed}</div>;
  return <div style={{ ...st, left: (l.x ?? 960) - 500, width: 1000, top: l.y ?? 240 }}>{typed}</div>;
};
const COUNT: [number, number][] = [[0, 0], [18, 0], [21, 1], [24, 1], [42, 40], [86, 40], [104, 300], [152, 300]];
const countAt = (t: number) => Math.round(k(t, COUNT.map((c) => c[0]), COUNT.map((c) => c[1])));

// ------------------------------------------------------------------ shots
type Shot = { t0: number; t1: number; set?: string; dark?: number; red?: (t: number) => number; warm?: (t: number) => number;
  cam?: (t: number) => [number, number, number]; draw: (t: number) => React.ReactNode };

const angelBob = (t: number) => Math.sin(t * 1.3) * 30;
const SHOTS: Shot[] = [
  // 1 · hook: tight on the stage, voice catches, one laugh, black
  { t0: 0, t1: 3.1, set: "set_room", dark: 0.15, cam: (t) => [2.3 + 0.08 * t, 560, 470],
    draw: (t) => <Char id="h" pose={t < 1.7 ? FRONT_HOLD : FLINCH} e={ex(t < 1.7 ? "worried" : "surprised", t, { talk: t < 1.7 })} x={560} y={830} notes /> },
  // 2 · bedroom: on the bed's edge, scrolling; a spark loops in and blooms into the Angel
  { t0: 4, t1: 12, set: "set_bedroom", dark: 0.25, cam: (t) => [1.15, 820, 560],
    draw: (t) => {
      const sp = sm((t - 6.5) / 2.5);
      const ax = 900 + (1150 - 900) * sp + Math.cos(t * 4) * 60 * (1 - sp), ay = 220 + (430 - 220) * sp + Math.sin(t * 4) * 40 * (1 - sp);
      return <>
        <Char id="b2" pose={{ ...SEAT_HOLD, head: [52, -318], tilt: 26 } as Pose} e={ex("tired", t)} x={560} y={830} notes />
        {t > 6.3 && t < 9.2 && <circle cx={ax} cy={ay} r={10} fill="#ffd27a" opacity={0.95} filter="url(#bb3)" />}
        {t >= 9 && <Angel x={1150} y={430 + angelBob(t)} s={0.9 * sm((t - 9) / 0.8)} t={t} />}
      </>;
    } },
  // 3 · the Angel points; he stands and walks out right
  { t0: 12, t1: 18, set: "set_bedroom", dark: 0.25,
    draw: (t) => {
      const stand = poseAt([{ t: 12, pose: SEAT }, { t: 13.2, pose: SIDE }], t);
      const w = walkAlong(t, 14, 18, 560, 1500);
      return <>
        <Char id="b3" pose={t < 14 ? stand : w.pose} e={ex("worried", t)} x={t < 14 ? 560 : w.x} y={t < 13.2 ? 830 : 940} />
        <Angel x={1250 + (t > 14 ? (t - 14) * 120 : 0)} y={430 + angelBob(t)} s={0.9} t={t} />
      </>;
    } },
  // 4 · mirror: walks in, tries, stalls, rubs his face; the Angel claps
  { t0: 18, t1: 24, set: "set_mirror", dark: 0.1,
    draw: (t) => {
      const w = walkAlong(t, 18, 19.6, 700, 1150);
      const pose = t < 19.6 ? w.pose : poseAt([{ t: 19.6, pose: HOLD }, { t: 21.2, pose: HOLD }, { t: 21.8, pose: RUB }, { t: 23.5, pose: RUB }], t);
      return <>
        <Char id="b4" pose={pose} e={ex(t < 21.2 ? "worried" : "confused", t, { talk: t > 19.8 && t < 21 })} x={t < 19.6 ? w.x : 1150} y={960} notes={t < 21.6} />
        <Angel x={760} y={420 + angelBob(t)} s={0.85} t={t} clap={t > 21 ? Math.abs(Math.sin(t * 9)) : 0} />
      </>;
    } },
  // 5 · soft montage: he always skips the hard line; the Angel cheers anyway
  ...[0, 1, 2, 3, 4, 5].map((i): Shot => {
    const t0 = 24 + i * 3, t1 = t0 + 3;
    const sets = ["set_mirror", "set_bedroom", "set_corridor", "set_mirror", "set_bedroom", "set_corridor"];
    return { t0, t1, set: sets[i], dark: sets[i] === "set_corridor" ? 0 : 0.15,
      draw: (t) => {
        const lt = t - t0;
        if (sets[i] === "set_corridor") {
          const w = walkAlong(t, t0, t1, 500, 1300, 6);
          return <><Char id={`m${i}`} pose={{ ...w.pose, elR: [30, -226], wrR: [58, -250] } as Pose} e={ex("worried", t, { talk: lt < 1.6 })} x={w.x} y={1000} notes />
            <Angel x={w.x + 330} y={380 + angelBob(t)} s={0.7} t={t} spin={lt > 2 ? sm((lt - 2) / 0.8) : 0} /></>;
        }
        if (sets[i] === "set_bedroom") return <><Char id={`m${i}`} pose={SEAT_HOLD} e={ex(lt < 1.8 ? "worried" : "neutral", t, { talk: lt < 1.6 })} x={560} y={830} notes />
          <Angel x={1000} y={420 + angelBob(t)} s={0.75} t={t} clap={lt > 1.8 ? Math.abs(Math.sin(t * 9)) : 0} /></>;
        return <><Char id={`m${i}`} pose={lt < 1.7 ? HOLD : HOLD_DOWN} e={ex(lt < 1.7 ? "worried" : "tired", t, { talk: lt < 1.6 })} x={1150} y={960} notes />
          <Angel x={760} y={420 + angelBob(t)} s={0.8} t={t} spin={lt > 1.9 ? sm((lt - 1.9) / 0.8) : 0} /></>;
      } };
  }),
  // 6 · forty: relieved smile, small fist pump; the Angel glows warm
  { t0: 42, t1: 46, set: "set_mirror", dark: 0.05, warm: () => 0.25,
    draw: (t) => <><Char id="b6" pose={poseAt([{ t: 42, pose: HOLD }, { t: 43, pose: PUMP }, { t: 46, pose: PUMP }], t)} e={ex("neutral", t, { blink: false })} x={1150} y={960} />
      <Angel x={760} y={400 + angelBob(t)} s={0.95} t={t} glow={1.4} spin={sm((t - 43) / 1)} /></> },
  // 7 · the presentation: walks to the lectern, the Friend waves, the line catches, ONE laugh, snap-zoom
  { t0: 46, t1: 56, set: "set_room", dark: 0.15,
    cam: (t) => (t < 52 ? [1, 960, 540] : [1 + 0.9 * sm((t - 52) / 0.25), 560, 520]),
    draw: (t) => {
      const w = walkAlong(t, 46, 48.4, 150, 560, 7);
      const atLectern = t >= 48.4;
      const pose = !atLectern ? w.pose : poseAt([{ t: 48.4, pose: FRONT }, { t: 49, pose: FRONT_HOLD }, { t: 51.6, pose: FRONT_HOLD }, { t: 52, pose: FLINCH }, { t: 56, pose: FLINCH }], t);
      return <>
        <Char id="b7" pose={pose} e={ex(t < 51.6 ? "worried" : "surprised", t, { talk: t > 49.2 && t < 51.6 })} x={atLectern ? 560 : w.x} y={830} notes={atLectern} />
        <Char id="f7" friend pose={t > 47 && t < 49 ? FRONT_WAVE : FRONT} e={ex("neutral", t)} x={1560} y={1075} s={1.05} />
        <Angel x={300} y={330} s={0.55} t={t} ember={t > 52 ? Math.min(1, 0.6 + 0.4 * Math.abs(Math.sin(t * 20))) : 0} />
      </>;
    } },
  // 8 · he lowers his notes and walks off fast
  { t0: 56, t1: 60, set: "set_room", dark: 0.25,
    draw: (t) => {
      const w = walkAlong(t, 57, 60, 560, -200, 9);
      return <><Char id="b8" pose={t < 57 ? HOLD_DOWN : w.pose} e={ex("sad", t)} x={t < 57 ? 560 : w.x} y={830} flip={t >= 57} notes={t < 57} />
        <Char id="f8" friend pose={FRONT} e={ex("worried", t)} x={1560} y={1075} s={1.05} /></>;
    } },
  // 9 · corridor: the Friend hurries up, touches his arm; he pulls away and walks off
  { t0: 60, t1: 67, set: "set_corridor",
    draw: (t) => {
      const fw = walkAlong(t, 60, 61.4, 1700, 1180, 9);
      const bw = walkAlong(t, 65, 67, 760, 0, 9);
      return <>
        <Char id="b9" pose={t < 65 ? (t > 63.5 ? TURN_AWAY : SIDE) : bw.pose} e={ex("sad", t)} x={t < 65 ? 760 : bw.x} y={1000} flip={t >= 64.5} />
        <Char id="f9" friend pose={t < 61.4 ? fw.pose : poseAt([{ t: 61.4, pose: { ...SIDE, elR: [40, -250], wrR: [92, -262] } as Pose }, { t: 64.5, pose: SIDE }], t)}
          e={ex("worried", t, { talk: t > 61.5 && t < 63.5 })} x={t < 61.4 ? fw.x : 1180} y={1000} flip />
      </>;
    } },
  // 10 · bedroom: the Angel tries; he turns his back; its glow dims to an ember
  { t0: 67, t1: 73, set: "set_bedroom", dark: 0.45,
    draw: (t) => <><Char id="b10" pose={{ ...SEAT, head: [52, -312], tilt: 30 } as Pose} e={ex("sad", t)} x={560} y={830} flip />
      <Angel x={1150} y={420 + angelBob(t)} s={0.9} t={t} smile={0.4} ember={sm((t - 71) / 1.6)} /></> },
  // 11 · the Devil: smoke seeps in, circles, rises behind him
  { t0: 73, t1: 81, set: "set_bedroom", dark: 0.6, red: (t) => 0.25 * sm((t - 75) / 3),
    draw: (t) => {
      const rise = sm((t - 75.2) / 1.6);
      return <>
        <Char id="b11" pose={SEAT} e={ex(t < 76 ? "sad" : "worried", t)} x={560} y={830} flip />
        <Smoke cx={1700 - 900 * sm((t - 73) / 2.2)} cy={1010} s={1.4} f={t * 40} amount={1 - rise * 0.4} />
        <Devil id="d11" pose={TQ} x={1050} y={930 + 200 * (1 - rise)} s={1.25 * (0.4 + 0.6 * rise)} op={rise} t={t} flip face="mischievous" />
        <Angel x={1700} y={250} s={0.6} t={t} ember={1} />
      </>;
    } },
  // 12 · Devil mode: red room, 5:00, the phone into the drawer, "Again."
  { t0: 81, t1: 86, set: "set_bedroom", dark: 0.55, red: () => 0.35,
    draw: (t) => {
      const ph = sm((t - 81.6) / 0.6);
      return <>
        <text x={1600} y={220} fill="#ff3b2a" fontFamily="Menlo" fontSize={64} fontWeight={700} style={{ filter: "drop-shadow(0 0 10px rgba(255,40,20,0.9))" }}>5:00</text>
        <rect x={700 + 900 * ph} y={760 - 300 * Math.sin(Math.PI * ph)} width={46} height={78} rx={8} fill="#15161b" stroke="#ff3b2a" strokeWidth={3} transform={`rotate(${ph * 400} ${723 + 900 * ph} ${799 - 300 * Math.sin(Math.PI * ph)})`} opacity={1 - sm((t - 82.4) / 0.3)} />
        <Char id="b12" pose={t < 83.5 ? SIDE : HOLD} e={ex(t < 83 ? "surprised" : "determined", t)} x={640} y={940} notes={t >= 83.5} />
        <Devil id="d12" pose={{ ...TQ, elR: [90, -300], wrR: [130, -340] } as Pose} x={1150} y={930} s={1.25} t={t} flip face="manipulative" />
      </>;
    } },
  // 13 · Devil montage: fast, the counter racing; it replays the laugh, he flinches, goes harder
  ...[0, 1, 2, 3, 4, 5].map((i): Shot => {
    const t0 = 86 + i * 3, t1 = t0 + 3;
    const sets = ["set_mirror", "set_bedroom", "set_corridor", "set_room", "set_mirror", "set_bedroom"];
    return { t0, t1, set: sets[i], dark: 0.45, red: () => 0.3,
      draw: (t) => {
        const lt = t - t0;
        const flinch = lt > 1.4 && lt < 1.8;
        const dx = Math.sin(t * 1.7) * 160;
        if (sets[i] === "set_bedroom") {
          const w = walkAlong(t, t0, t1, 500, 1300, 8);
          return <><Devil id={`dm${i}`} pose={TQ} x={1500 + dx} y={930} s={1.1} t={t} flip />
            <Char id={`bm${i}`} pose={flinch ? FLINCH : { ...w.pose, elR: [30, -226], wrR: [58, -250] } as Pose} e={ex("determined", t, { talk: !flinch })} x={w.x} y={940} notes /></>;
        }
        if (sets[i] === "set_corridor") {
          const w = walkAlong(t, t0, t1, 1500, 500, 8);
          return <><Devil id={`dm${i}`} pose={TQ} x={w.x + 420 + dx * 0.3} y={1000} s={1.15} t={t} flip />
            <Char id={`bm${i}`} pose={flinch ? FLINCH : { ...w.pose, elR: [30, -226], wrR: [58, -250] } as Pose} e={ex("determined", t, { talk: !flinch })} x={w.x} y={1000} flip notes /></>;
        }
        if (sets[i] === "set_room") return <><Devil id={`dm${i}`} pose={TQ} x={1400 + dx} y={980} s={1.0} t={t} flip face="angry" />
          <Char id={`bm${i}`} pose={flinch ? FLINCH : FRONT_HOLD} e={ex("determined", t, { talk: !flinch })} x={560} y={830} notes /></>;
        return <><Devil id={`dm${i}`} pose={TQ} x={700 + dx * 0.4} y={940} s={1.1} t={t} face="angry" />
          <Char id={`bm${i}`} pose={flinch ? FLINCH : HOLD} e={ex(flinch ? "surprised" : "determined", t, { talk: !flinch })} x={1150} y={960} notes /></>;
      } };
  }),
  // 14 · the turn: stumbles, restarts on his own, finishes; the Devil grins; his hands shake
  { t0: 104, t1: 112, set: "set_mirror", dark: 0.4, red: () => 0.28,
    draw: (t) => <>
      <Devil id="d14" pose={TQ} x={700} y={940} s={1.15 + 0.1 * sm((t - 109) / 2)} t={t} face="laughing" />
      <Char id="b14" pose={t > 105.2 && t < 105.8 ? FLINCH : HOLD} e={ex(t < 105.8 ? "worried" : "determined", t, { talk: t > 105.9 && t < 109.5 })} x={1150} y={960} notes jitter={t > 109.5 ? 2.2 : 0} t={t} />
    </> },
  // 15 · the same room, the same line; the Devil's outline at the back
  { t0: 112, t1: 117, set: "set_room", dark: 0.2,
    draw: (t) => <>
      <Devil id="d15" pose={FRONT} x={1350} y={760} s={0.75} op={0.45} glow={0.6} t={t} face="neutral" />
      <Char id="b15" pose={FRONT_HOLD} e={ex("worried", t, { talk: t > 114 })} x={560} y={830} notes />
      <Char id="f15" friend pose={FRONT} e={ex("neutral", t)} x={1560} y={1075} s={1.05} />
    </> },
  // 16 · his voice catches; silence; the Devil leans in from the dark
  { t0: 117, t1: 123, set: "set_room", dark: 0.35, red: (t) => 0.3 * sm((t - 117.5) / 1.5),
    cam: (t) => [1 + 0.5 * sm((t - 117) / 4), 600, 520],
    draw: (t) => <>
      <Devil id="d16" pose={{ ...TQ, head: [26, -372], tilt: 18 } as Pose} x={760 + 120 * (1 - sm((t - 117.5) / 2))} y={830} s={1.2} op={sm((t - 117.5) / 1.2)} t={t} flip face="manipulative" />
      <Char id="b16" pose={FRONT_HOLD} e={ex("worried", t)} x={560} y={830} notes jitter={1.5} t={t} />
    </> },
  // 17 · he says it; the red recedes, warm light takes over; the Friend nods; applause
  { t0: 123, t1: 133, set: "set_room", dark: 0.1, red: (t) => 0.3 * (1 - sm((t - 123.5) / 2.5)), warm: (t) => 0.3 * sm((t - 124) / 3),
    cam: (t) => [1.5 - 0.5 * sm((t - 128) / 3), 600, 520],
    draw: (t) => <>
      <Devil id="d17" pose={TQ} x={760} y={830} s={1.2} op={1 - sm((t - 123.5) / 2)} t={t} flip face="neutral" />
      <Char id="b17" pose={t < 129 ? FRONT_HOLD : FRONT} e={ex(t < 129 ? "determined" : "neutral", t, { talk: t > 123.6 && t < 128.6 })} x={560} y={830} notes={t < 129} />
      <Char id="f17" friend pose={t > 129.6 && t < 131 ? FRONT_NOD : FRONT} e={ex(t > 129.6 ? "neutral" : "surprised", t)} x={1560} y={1075} s={1.05} />
    </> },
  // 18 · offstage: hands trembling; the Angel's ember glows back; the Devil smiles; Bean gives it the smallest nod
  { t0: 133, t1: 140.5, set: "set_corridor", dark: 0.35,
    draw: (t) => {
      const w = walkAlong(t, 133, 135.4, 400, 900, 7);
      const nod = t > 138 && t < 139 ? 8 * Math.sin((t - 138) * Math.PI) : 0;
      return <>
        <Devil id="d18" pose={FRONT} x={1330} y={1000} s={1.15} op={0.9} t={t} face="mischievous" />
        <Char id="b18" pose={t < 135.4 ? w.pose : t > 137 ? { ...TQ, t: 0.6, tilt: nod } as Pose : HOLD_DOWN} e={ex("tired", t)} x={t < 135.4 ? w.x : 900} y={1000} jitter={t > 135.4 ? 2 : 0} t={t} />
        <Angel x={260} y={300} s={0.7} t={t} ember={1 - 0.6 * sm((t - 136) / 2)} />
      </>;
    } },
];

const ShotView: React.FC<{ s: Shot; t: number }> = ({ s, t }) => {
  const [z, cx, cy] = s.cam ? s.cam(t) : [1 + 0.03 * ((t - s.t0) / (s.t1 - s.t0)), 960, 540];
  const red = s.red ? s.red(t) : 0, warm = s.warm ? s.warm(t) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: "0 0" }}>
        {s.set && <Img src={staticFile(`poses/${s.set}.png`)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />}
        <AbsoluteFill style={{ background: "#05060a", opacity: s.dark ?? 0 }} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <BeanDefs />
          {s.draw(t)}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,40,20,0) 25%, rgba(170,10,0,1) 100%)", opacity: red, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 45%, rgba(255,190,110,0.9) 0%, rgba(255,160,80,0) 60%)", opacity: warm, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export const Film02: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = SHOTS.find((s) => t >= s.t0 && t < s.t1);
  const cut = shot ? 1 : 0;
  const red = t >= 73;
  const n = countAt(t);
  const counterOn = t > 4 && t < 140;
  const endOp = k(t, [146.6, 147.2, 151.4, 152], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {shot && <AbsoluteFill style={{ opacity: cut }}><ShotView s={shot} t={t} /></AbsoluteFill>}
      {LINES.map((l, i) => <LineView key={i} l={l} t={t} />)}
      {t >= 140.5 && t < 146.6 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", ...STYLE.card, color: "#ff4a3a",
        opacity: k(t, [143, 143.4, 146, 146.6], [0, 1, 1, 0]), textShadow: "0 0 22px rgba(255,40,20,0.9)" }}>The Devil got him there.</div>}
      {counterOn && <div style={{ position: "absolute", left: 70, top: 46, fontFamily: "Avenir Next", fontWeight: 700, fontSize: 64,
        color: red ? "#ff4a3a" : "#f1ece2", textShadow: red ? "0 0 18px rgba(255,40,20,0.7)" : "0 2px 6px #000" }}>{n}</div>}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: endOp }}>
        <div style={{ fontFamily: "Avenir Next", fontWeight: 700, fontSize: 140, letterSpacing: 22, color: "#f1ece2", paddingLeft: 22 }}>DEVIL MODE</div>
        <div style={{ width: 360, height: 6, background: "#ff3b2a", marginTop: 10, boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      <Audio src={staticFile("audio/film02_mix.wav")} />
    </AbsoluteFill>
  );
};
