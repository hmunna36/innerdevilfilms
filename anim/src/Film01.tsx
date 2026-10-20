// FILM 01 — ANGER (about 3:08). Built from scripts/film01_ANGER_final.md with the generated art in public/
// (Bean, the Devil and the Angel from Harshad's own sheets; the Friend is ours). Every value below is in seconds.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const FPS = 30;
export const FILM_SECONDS = 188;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

type Layer = {
  img: string; x: number; y: number; h: number; flip?: boolean;
  t0?: number; t1?: number; fade?: number; dx?: number; blend?: "screen"; tint?: string; cover?: boolean; grow?: number;
};
type Line = { t0: number; t1: number; who: "narrator" | "angel" | "devil" | "friend" | "bean"; text: string; x?: number; y?: number };
type Scene = { t0: number; t1: number; set?: string; dark?: number; red?: number; layers: Layer[]; lines?: Line[]; push?: number };

const S: Scene[] = [
  // ACT 1 — the Angel
  { t0: 0, t1: 10, set: "set_bedroom", dark: 0.25, layers: [{ img: "bean_bed", x: 900, y: 930, h: 440 }],
    lines: [{ t0: 2, t1: 9, who: "narrator", text: "He had stopped expecting much from himself." }] },
  { t0: 10, t1: 22, set: "set_mirror", layers: [
      { img: "bean_mirror", x: 1150, y: 980, h: 640 },
      { img: "angel_ember", x: 640, y: 560, h: 90, t0: 10.8, t1: 14.2, fade: 0.8 },
      { img: "angel_front", x: 640, y: 640, h: 250, t0: 13.6, fade: 1.0 }],
    lines: [{ t0: 15, t1: 21.2, who: "angel", text: "Again.", x: 640, y: 330 }] },
  { t0: 22, t1: 24.7, set: "set_mirror", layers: [{ img: "bean_mirror", x: 1150, y: 980, h: 640 }, { img: "angel_whisper", x: 600, y: 620, h: 200 }],
    lines: [{ t0: 22.6, t1: 37.4, who: "narrator", text: "He gave the first sentence forty chances." }] },
  { t0: 24.7, t1: 27.4, set: "set_bedroom", dark: 0.2, layers: [{ img: "bean_speak", x: 960, y: 980, h: 600 }] },
  { t0: 27.4, t1: 30.1, set: "set_mirror", layers: [{ img: "bean_speak", x: 860, y: 990, h: 640 }, { img: "angel_whisper", x: 1350, y: 620, h: 200 }] },
  { t0: 30.1, t1: 32.8, set: "set_bedroom", dark: 0.2, layers: [{ img: "bean_sit", x: 760, y: 980, h: 520 }] },
  { t0: 32.8, t1: 35.5, set: "set_mirror", layers: [{ img: "bean_mirror", x: 1150, y: 980, h: 640 }] },
  { t0: 35.5, t1: 38, set: "set_bedroom", dark: 0.2, layers: [{ img: "bean_speak", x: 960, y: 980, h: 600 }, { img: "angel_whisper", x: 1400, y: 600, h: 200 }] },
  { t0: 38, t1: 50, set: "set_mirror", push: 0.08, layers: [
      { img: "bean_proud", x: 900, y: 1000, h: 640 }, { img: "angel_whisper", x: 1260, y: 600, h: 280 }],
    lines: [{ t0: 44, t1: 49.4, who: "angel", text: "You did it.", x: 1260, y: 300 }] },
  { t0: 50, t1: 65, set: "set_room", push: 0.05, layers: [
      { img: "bean_speak", x: 560, y: 900, h: 560 }, { img: "friend_audience", x: 1470, y: 1010, h: 480 },
      { img: "angel_ember", x: 330, y: 470, h: 70, t0: 50.5, fade: 1 }],
    lines: [{ t0: 52, t1: 60, who: "narrator", text: "Then it was time to say it where it counted." }] },
  // ACT 2 — the humiliation
  { t0: 65, t1: 75, set: "set_room", dark: 0.35, push: 0.12, layers: [
      { img: "bean_frozen", x: 560, y: 900, h: 560 }, { img: "friend_audience", x: 1470, y: 1010, h: 480 },
      { img: "angel_ember", x: 330, y: 470, h: 70, t1: 70, fade: 2.5 }] },
  { t0: 75, t1: 85, set: "set_corridor", dark: 0.15, layers: [
      { img: "friend_concerned", x: 1230, y: 1000, h: 600 },
      { img: "bean_frozen", x: 650, y: 990, h: 600, t1: 80.2, fade: 0.3 },
      { img: "bean_walkaway", x: 620, y: 990, h: 600, t0: 80, fade: 0.3, dx: -380 }],
    lines: [{ t0: 76, t1: 81, who: "friend", text: "I couldn't hear you at the end.", x: 1230, y: 300 }] },
  { t0: 85, t1: 95, set: "set_bedroom", dark: 0.45, layers: [{ img: "bean_frustrated", x: 960, y: 990, h: 560 }],
    lines: [{ t0: 91, t1: 95, who: "narrator", text: "He practised it again." }] },
  // ACT 3 — the Devil
  { t0: 95, t1: 108, set: "set_bedroom", dark: 0.55, red: 0.18, layers: [
      { img: "bean_awake", x: 860, y: 960, h: 400 },
      { img: "devil_whisper", x: 1330, y: 800, h: 560, t0: 97.5, fade: 1.6 }],
    lines: [
      { t0: 99, t1: 103, who: "devil", text: "You heard one laugh.", x: 1330, y: 240 },
      { t0: 103.3, t1: 107.6, who: "devil", text: "Now that's all you'll hear.", x: 1330, y: 240 }] },
  { t0: 108, t1: 120, set: "set_bedroom", dark: 0.6, red: 0.3, push: 0.08, layers: [
      { img: "devil_front", x: 1180, y: 1020, h: 760, fade: 1.2 },
      { img: "bean_angry", x: 760, y: 1000, h: 620 }],
    lines: [
      { t0: 109, t1: 113, who: "devil", text: "They made you feel small.", x: 1180, y: 200 },
      { t0: 114, t1: 119.4, who: "devil", text: "Don't let them do it again.", x: 1180, y: 200 }] },
  { t0: 120, t1: 132, set: "set_corridor", dark: 0.25, red: 0.12, layers: [
      { img: "devil_whisper", x: 420, y: 760, h: 480, fade: 1 },
      { img: "bean_stand", x: 640, y: 1000, h: 600 },
      { img: "friend_offer", x: 1280, y: 1000, h: 600, flip: true }],
    lines: [{ t0: 125, t1: 131.5, who: "devil", text: "Make her feel it.", x: 960, y: 150 }] },
  { t0: 132, t1: 147, set: "set_corridor", dark: 0.3, red: 0.15, layers: [
      { img: "friend_offer", x: 1280, y: 1000, h: 600, flip: true, t1: 141.5, fade: 0.3 },
      { img: "friend_hurt", x: 1280, y: 1000, h: 600, flip: true, t0: 141.3, fade: 0.3, dx: 380 },
      { img: "bean_stand", x: 640, y: 1000, h: 600, t1: 137.2, fade: 0.2 },
      { img: "bean_cruel", x: 660, y: 1000, h: 600, t0: 137, fade: 0.2 }],
    lines: [
      { t0: 132.6, t1: 136.6, who: "friend", text: "We could practise together.", x: 1280, y: 300 },
      { t0: 138, t1: 143.5, who: "bean", text: "I don't need your pity. You couldn't even help me.", x: 760, y: 300 }] },
  { t0: 147, t1: 160, set: "set_corridor", dark: 0.6, red: 0.22, push: 0.1, layers: [
      { img: "devil_smile", x: 1090, y: 1030, h: 780, t0: 150, fade: 2 },
      { img: "bean_smirk", x: 820, y: 1010, h: 640 }],
    lines: [{ t0: 153, t1: 159.4, who: "narrator", text: "For one moment, he wasn't the one who felt small." }] },
  // ENDING — the Devil dominates
  { t0: 160, t1: 172, dark: 1, layers: [
      { img: "devil_huge", x: 960, y: 1080, h: 1080, cover: true, blend: "screen", fade: 1.5, grow: 0.15 },
      { img: "bean_sit", x: 960, y: 960, h: 420 },
      { img: "angel_ember", x: 1760, y: 210, h: 60 }],
    lines: [{ t0: 165, t1: 171.4, who: "narrator", text: "He couldn't bear being laughed at." }] },
  { t0: 172, t1: 182, dark: 1, push: 0.04, layers: [
      { img: "devil_smile", x: 1040, y: 1010, h: 800, fade: 1.2 },
      { img: "bean_sit", x: 900, y: 980, h: 460 },
      { img: "angel_ember", x: 1760, y: 210, h: 60 }],
    lines: [{ t0: 173.5, t1: 180.5, who: "narrator", text: "So he learned to make others afraid to laugh." }] },
];

// the counter: [time, value] keyframes; it never resets
const COUNT: [number, number][] = [[0, 0], [10, 0], [12, 1], [21, 5], [22, 5], [38, 23], [44, 40], [85, 40], [87, 41], [89.5, 42], [92, 43],
  [95, 43], [108, 47], [120, 87], [147, 87], [160, 120], [171, 300], [188, 300]];
const countAt = (t: number) => Math.round(interpolate(t, COUNT.map((c) => c[0]), COUNT.map((c) => c[1]), clamp));

const STYLE: Record<Line["who"], React.CSSProperties> = {
  narrator: { fontFamily: "Avenir Next", fontWeight: 500, fontSize: 40, color: "#f1ece2", letterSpacing: 0.5, textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.85)" },
  angel: { fontFamily: "Chalkboard SE", fontWeight: 400, fontSize: 56, color: "#ffd27a", textShadow: "0 0 18px rgba(255,190,90,0.75)" },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 56, color: "#ff4a3a", textShadow: "0 2px 4px rgba(0,0,0,1), 0 0 22px rgba(255,40,20,0.85)" },
  friend: { fontFamily: "Chalkboard SE", fontWeight: 400, fontSize: 44, color: "#e7f0e3", textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.9)" },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 46, color: "#ffffff", textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.9)" },
};

const LineView: React.FC<{ l: Line; t: number }> = ({ l, t }) => {
  const op = interpolate(t, [l.t0, l.t0 + 0.35, l.t1 - 0.4, l.t1], [0, 1, 1, 0], clamp);
  if (op <= 0) return null;
  const typed = l.who === "narrator" ? l.text : l.text.slice(0, Math.max(1, Math.floor((t - l.t0) * 26)));
  const base: React.CSSProperties = { position: "absolute", opacity: op, whiteSpace: "pre-wrap", textAlign: "center", ...STYLE[l.who] };
  if (l.who === "narrator") return <div style={{ ...base, left: 0, right: 0, bottom: 64 }}>{typed}</div>;
  return <div style={{ ...base, left: (l.x ?? 960) - 480, width: 960, top: l.y ?? 260 }}>{typed}</div>;
};

const LayerView: React.FC<{ L: Layer; t: number; s: Scene }> = ({ L, t, s }) => {
  const a = L.t0 ?? s.t0, b = L.t1 ?? s.t1;
  const f = Math.min(L.fade ?? 0.01, (b - a) / 2 - 0.02); // fades never overlap
  const fo = L.t1 ? f : 0.01;
  const op = interpolate(t, [a, a + f, b - fo, b], [0, 1, 1, L.t1 ? 0 : 1], clamp);
  if (op <= 0) return null;
  const k = (t - a) / Math.max(0.1, b - a);
  const dx = (L.dx ?? 0) * ease(Math.max(0, Math.min(1, k)));
  const breathe = 1 + Math.sin(t * 2.1 + L.x) * 0.006;
  if (L.cover) {
    const sc = 1 + (L.grow ?? 0) * k;
    return <Img src={staticFile(`poses/${L.img}.png`)} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, objectFit: "cover",
      opacity: op, mixBlendMode: L.blend, transform: `scale(${sc})` }} />;
  }
  return (
    <Img src={staticFile(`cut/${L.img}.png`)} style={{ position: "absolute", left: L.x + dx, top: L.y - L.h, height: L.h, opacity: op,
      transform: `translateX(-50%) scaleX(${L.flip ? -1 : 1}) scaleY(${breathe})`, transformOrigin: "50% 100%", mixBlendMode: L.blend,
      filter: L.tint }} />
  );
};

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const t = s.t0 + f / FPS;
  const len = s.t1 - s.t0;
  const push = 1 + (s.push ?? 0.04) * ease(Math.min(1, (t - s.t0) / len));
  const op = interpolate(t, [s.t0, s.t0 + 0.3], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 60%" }}>
        {s.set ? <Img src={staticFile(`poses/${s.set}.png`)} style={{ width: 1920, height: 1080, objectFit: "cover" }} /> : <AbsoluteFill style={{ background: "#07080b" }} />}
        <AbsoluteFill style={{ background: "#05060a", opacity: s.set ? s.dark ?? 0 : 0 }} />
        {s.layers.map((L, i) => <LayerView key={i} L={L} t={t} s={s} />)}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,40,20,0.0) 30%, rgba(160,10,0,1) 100%)", opacity: s.red ?? 0, mixBlendMode: "multiply" }} />
      </AbsoluteFill>
      {(s.lines ?? []).map((l, i) => <LineView key={i} l={l} t={t} />)}
    </AbsoluteFill>
  );
};

// three flashes of the stage while he sits at home (Act 2, the replay)
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 2, 9, 12], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Img src={staticFile("poses/set_room.png")} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "saturate(0.3) brightness(0.6)" }} />
      <Img src={staticFile("cut/bean_frozen.png")} style={{ position: "absolute", left: 960, top: 1020 - 700, height: 700, transform: "translateX(-50%)" }} />
    </AbsoluteFill>
  );
};

export const Film01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const n = countAt(t);
  const counterOp = interpolate(t, [0.5, 1.5, 181, 182], [0, 1, 1, 0], clamp);
  const red = t >= 95;
  const titleOp = interpolate(t, [182.6, 183.6, 187, 188], [0, 1, 1, 0], clamp);
  const tickPulse = COUNT.some(([kt]) => Math.abs(t - kt) < 0.12) ? 1.06 : 1;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {S.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t0 * FPS)} durationInFrames={Math.round((s.t1 - s.t0) * FPS) + (i < S.length - 1 ? 9 : 0)}>
          <SceneView s={s} />
        </Sequence>
      ))}
      {[87, 89.5, 92].map((ft) => <Sequence key={ft} from={Math.round(ft * FPS)} durationInFrames={12}><Flash /></Sequence>)}
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(t, [181, 182.2], [0, 1], clamp) }} />
      <div style={{ position: "absolute", left: 70, top: 46, opacity: counterOp, fontFamily: "Avenir Next", fontWeight: 700, fontSize: 64,
        color: red ? "#ff4a3a" : "#f1ece2", textShadow: red ? "0 0 18px rgba(255,40,20,0.7)" : "none", transform: `scale(${tickPulse})`, transformOrigin: "0 50%" }}>{n}</div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: titleOp }}>
        <div style={{ fontFamily: "Avenir Next", fontWeight: 700, fontSize: 150, letterSpacing: 26, color: "#f1ece2", paddingLeft: 26 }}>ANGER</div>
        <div style={{ width: 300, height: 6, background: "#ff3b2a", marginTop: 10, boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      {durationInFrames > 0 && <Audio src={staticFile("audio/film01_mix_v2.wav")} />}
    </AbsoluteFill>
  );
};
