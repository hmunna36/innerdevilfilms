// FILM 01 v7 — DEVIL MODE (about 2:32). Same story as v5 (scripts/film01_DEVILMODE_v5_LOCKED.md), v6's cut for drama.
// v7 (19 Oct), Harshad: "the letter coming in is not natural, also the laptop is not natural, his mom's messages (refill)
// not clear". So: a low floor shot at the door (feet in the light under it, the notice slides flat and skids to a stop,
// his feet come in, his hand picks it up); a real desk, office chair and 3/4 laptop whose screen shows what happens
// (full-frame screen inserts replace the floating cards); Mom's texts name her heart medicine and what it costs.
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import type { Pose } from "./rig/figure";
import type { V2 } from "./rig/geom";
import { BeanDefs, BeanExpr, DevilFace } from "./rig/bean";
import { Angel } from "./rig/angel";
import { FRONT, HOLD, SEAT, SIDE, TQ, poseAt, walk } from "./rig/beanPoses";
import {
  Burst, CARRY, Char, Column, DEVIL_LEAN, DEVIL_REACH, DevilFig, DoorSmoke, FLOOR_SIT, FloorNotes, FloorSmoke, LineView,
  LockBanner, NoticeCard, P, PHONE_HOLD, Paper, PayBanner, PhoneChat, PhonePOV, Rain, SEAT_BACK, SEAT_PHONE, SEAT_RELIEF, SEAT_RUB,
  Spark, WallShadow, ex, fmt$, k, lerpColor, mix, sm,
} from "./film/kit";
import type { ChatItem, Line, Prop } from "./film/kit";
import { CLOCK_XY, ChairAt, DRAWER_XY, DeskDefs, DeskFront, DeskTop, DrawerPhone, FaceGlow, ScreenInsert } from "./film/desk";
import type { ScreenKind } from "./film/desk";
import { DoorDefs, DoorShadows, FloorLetter, LowFeet, ReachHand, TopDownNotice, letterPt } from "./film/door";
import type { LetterState } from "./film/door";

export const FILM4_SECONDS = 152;
const FPS = 30;

// ------------------------------------------------------------------ scenes (continuous) and cuts (camera set-ups)
type Scene = { set?: string; dark?: number | ((t: number) => number); red?: (t: number) => number; warm?: (t: number) => number;
  flicker?: (t: number) => number; rain?: boolean; blur?: number; draw: (t: number) => React.ReactNode };
export type Cam = [number, number, number, number?]; // zoom, centre x, centre y, roll in degrees
export type Cut = { t0: number; t1: number; scene: Scene | null; cam: (t: number) => Cam; shake?: (t: number) => number };
const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];

const BX = 640, FY = 960; // Bean's chair in the bedroom, floor line
const FLX = 700, FLY = 1010, FLS = 1.4; // Bean on the floor, in front of the desk (nearer the camera)
const angelY = (t: number) => Math.sin(t * 1.3) * 18;
const ARMS_UP = P({ ...FRONT, elR: [120, -300], wrR: [150, -360], elL: [-120, -300], wrL: [-150, -360] });
// at the desk: forearms on the desk, hands on the keyboard
const SEAT_TYPE = P({ ...SEAT, head: [50, -320], tilt: 14, elR: [70, -198], wrR: [118, -206], elL: [60, -199], wrL: [108, -208] });
const SEAT_REST = P({ ...SEAT_TYPE, head: [46, -320], tilt: 18, elR: [66, -197], wrR: [110, -200], elL: [56, -198], wrL: [100, -202] });
const SEAT_LID = P({ ...SEAT_TYPE, elR: [80, -232], wrR: [134, -246] });   // pushing the lid open
const HEAD_DOWN = P({ ...SEAT_REST, head: [56, -310], tilt: 30 });
const ASLEEP = P({ ...SEAT_REST, head: [56, -310], tilt: 34 });
const FLOOR_PHONE = P({ ...FLOOR_SIT, head: [46, -258], tilt: 22, elR: [60, -118], wrR: [96, -160] });   // on the floor, phone up to his face
const bed = (draw: (t: number) => React.ReactNode, dark = 0.45, red?: (t: number) => number): Scene => ({ set: "set_bedroom", dark, red, draw });

// ------------------------------------------------------------------ the desk around Bean
type DeskSt = { clock: string; lid?: number; screen?: ScreenKind; ts?: number; drawer?: number; buzz?: number; on?: number; bills?: boolean };
const deskBack = (t: number, d: DeskSt) => <DeskTop t={t} clock={d.clock} lid={d.lid ?? 0} screen={d.screen ?? "off"} ts={d.ts ?? 0} on={d.on ?? 1} bills={d.bills} />;
const deskFront = (t: number, d: DeskSt) => <DeskFront t={t} drawer={d.drawer ?? 0} buzz={d.buzz ?? 0} />;
const litOf = (d: DeskSt) => (d.screen && d.screen !== "off" ? sm(((d.lid ?? 0) - 0.35) / 0.3) * (d.on ?? 1) : 0);
const glowAt = (p: Pose, amt: number) => <FaceGlow x={BX + (p.head[0] + 44) * 1.3} y={FY + (p.head[1] + 10) * 1.3} amount={amt} />;
// Bean in his chair at the desk: desk top, Bean, desk front, the screen's light on his face
const atDesk = (t: number, d: DeskSt, id: string, pose: Pose, e: BeanExpr, o: { typing?: boolean; flip?: boolean; tear?: number; prop?: Prop; before?: React.ReactNode; propLit?: number; jitter?: number } = {}) => <>
  {deskBack(t, d)}
  {o.before}
  <Char id={id} pose={pose} e={e} x={BX} y={FY} seat t={t} typing={o.typing} flip={o.flip} tear={o.tear ?? 0} prop={o.prop ?? null} propLit={o.propLit ?? 1} jitter={o.jitter ?? 0} />
  {deskFront(t, d)}
  {!o.flip && glowAt(pose, litOf(d))}
</>;
// the desk with nobody at it (Bean on the floor or standing in front of it); the chair has rolled back
const deskOnly = (t: number, d: DeskSt, chairX = 380) => <>
  {deskBack(t, d)}
  {deskFront(t, d)}
  {chairX > 0 && <ChairAt x={chairX} y={FY} tilt={-4} />}
</>;
const screenScene = (kind: (t: number) => ScreenKind, ts: (t: number) => number): Scene => ({ draw: (t) => <ScreenInsert kind={kind(t)} t={t} ts={ts(t)} /> });

// 0 · cold open: the climax, three seconds
const S_COLD: Scene = { set: "set_bedroom", dark: 0.72, red: () => 0.5,
  draw: (t) => {
    const ign = sm((t - 0.62) / 0.5);
    return <>
      <WallShadow x={740} y={300} s={5.6} horn={1} red={1} op={0.9} lit={0.5} />
      {deskOnly(t, { clock: "3:59" })}
      <FloorSmoke t={t} amount={1} reach={1} />
      <FloorNotes t={t} tremble={1} />
      <Column t={t} x={470} y={FY} amount={0.6} />
      <DevilFig id="cold" pose={DEVIL_LEAN} x={560} y={FY} s={1.65} lean={14} t={t} glow={1.5 * ign} rim={lerpColor("#1a0000", "#ff2d1f", ign)} detailOp={sm((t - 0.6) / 0.08)} face="manipulative" />
      <Char id="coldb" pose={FLOOR_SIT} e={ex("worried", t, { blink: false })} x={FLX} y={FLY} s={FLS} t={t} prop="phone" propLit={0} />
    </>;
  } };

// 1 · the notice: shadows of feet stop in the light under the door, the sheet slides out flat, skids and stops;
// Bean's feet come in and his hand picks it up (all in a low shot on the floor)
const LTR = (t: number): LetterState => {
  const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, (t - 4.95) / 0.7)), 3);
  return { u: mix(14, -60, e), v: mix(-90, 600, e), rot: mix(0, -11, e), beta: 84 * sm((t - 6.95) / 0.25), h0: 300 * sm((t - 7.15) / 0.35) };
};
const NEAR_FOOT = [{ t: 6.2, u: 260 }, { t: 6.62, u: 110 }];
const FAR_FOOT = [{ t: 6.0, u: 330 }, { t: 6.42, u: 160 }];
const S_DOOR: Scene = { set: "set_door", dark: 0.08,
  draw: (t) => {
    const L = LTR(t);
    const edge = letterPt(L, 0, 1);
    const reach = sm((t - 6.6) / 0.28);
    const start: V2 = [1180, 160];
    const hand: V2 = [mix(start[0], edge[0] + 10, reach), mix(start[1], edge[1] - 34, reach)];
    const bend = k(t, [6.55, 6.85, 7.1, 7.4], [0, 1, 1, 0.3]);
    return <>
      <DoorShadows t={t} t0={4.5} t1={5.72} />
      {t < 7.5 && <FloorLetter s={L} id="n1" clipGap={L.v < 200} />}
      {t > 6.58 && t < 7.5 && <ReachHand x={hand[0]} y={hand[1]} from={[1250, -200]} k={1.1} grip={sm((t - 6.84) / 0.08)} />}
      {t > 5.9 && <LowFeet t={t} near={NEAR_FOOT} far={FAR_FOOT} vNear={700} vFar={650} bend={bend} />}
    </>;
  } };
const S_DOORDARK: Scene = { set: "set_door", dark: 0.72, draw: () => null };
const S_DOORFACE: Scene = { set: "set_door", dark: 0.1,
  draw: (t) => <Char id="doorf" pose={HOLD} e={ex("worried", t, { ly: 6 })} x={1180} y={1000} flip t={t} prop="notice" /> };

// 2 · Mom's texts, the Angel, the laptop, "Again?" — "Tomorrow."
const S_BEDA: Scene = { set: "set_bedroom", dark: 0.3,
  draw: (t) => {
    const bloom = sm((t - 16.7) / 0.6);
    const sp = sm((t - 15.3) / 1.4);
    const reach = Math.min(1, k(t, [21.3, 21.7, 22.7, 23.1], [0, 1, 1, 0]) + k(t, [27.4, 27.7, 28.4, 28.7], [0, 1, 1, 0]));
    let pose: Pose = t < 10.75 ? SEAT_REST : t < 23.1 ? poseAt([{ t: 10.75, pose: SEAT_REST }, { t: 11.2, pose: SEAT_PHONE }], t)
      : t < 24.0 ? poseAt([{ t: 23.1, pose: SEAT_PHONE }, { t: 23.35, pose: SEAT_TYPE }, { t: 23.6, pose: SEAT_LID }, { t: 24.0, pose: SEAT_TYPE }], t)
      : SEAT_TYPE;
    if (t > 25.95 && t < 28.8) pose = poseAt([{ t: 25.95, pose: SEAT_TYPE }, { t: 26.4, pose: HEAD_DOWN }], t);
    if (t >= 28.8) pose = poseAt([{ t: 28.8, pose: HEAD_DOWN }, { t: 29.2, pose: SEAT_REST }, { t: 29.55, pose: SEAT_LID }, { t: 30.0, pose: SEAT_REST }], t);
    const e = t < 10.7 ? ex("tired", t) : t < 15.3 ? ex("worried", t, { ly: 5 }) : t < 23.1 ? ex("worried", t)
      : t < 25.95 ? ex("worried", t, { ly: 4, lx: 3 }) : t < 28.8 ? ex("sad", t) : ex("tired", t, { talk: t > 28.9 && t < 29.8 });
    const lid = t < 23.3 ? 0 : t < 29.6 ? sm((t - 23.3) / 0.5) : 1 - sm((t - 29.6) / 0.4);
    const screen: ScreenKind = t < 24.85 ? "form" : t < 25.95 ? "sent" : "rejected";
    const ts = t < 24.85 ? 23.6 : t < 25.95 ? 24.9 : 25.95;
    return <>
      <WallShadow x={1330} y={250} s={1.15} horn={0.35} op={0.9 * bloom} lit={0.38} />
      {atDesk(t, { clock: "2:13", lid, screen, ts }, "beda", pose, e, { typing: t > 24.0 && t < 24.85, prop: t < 23.2 ? "phone" : null,
        propLit: sm((t - 10.65) / 0.1), jitter: t > 10.65 && t < 10.95 ? 1.4 : 0 })}
      {t > 15.3 && t < 17.0 && <Spark x={mix(900, 1190, sp) + Math.cos(t * 4) * 70 * (1 - sp)} y={mix(170, 440, sp) + Math.sin(t * 4) * 50 * (1 - sp)} op={1 - bloom} />}
      {t >= 16.7 && <Angel x={1190} y={440 + angelY(t)} s={0.9 * bloom} t={t} reach={reach} smile={t > 25.95 && t < 28.8 ? 0.6 : 1} />}
    </>;
  } };
const S_POV1: Scene = { set: "set_bedroom", dark: 0.5, blur: 9, draw: () => null };
const S_POV2: Scene = { set: "set_bedroom", dark: 0.72, blur: 11, draw: () => null };
export const CHAT1: ChatItem[] = [
  { t: 0, sep: true, text: "Yesterday 9:40 PM" },
  { t: 0, me: true, text: "How are you feeling, Mom?" },
  { t: 0, sep: true, text: "Today 2:13 AM" },
  { t: 10.65, text: "My heart medicine runs out next week. It costs $600." },
  { t: 12.55, text: "Pay your rent first, sweetheart. I'll manage." },
];
export const CHAT2: ChatItem[] = [
  { t: 0, sep: true, text: "Tue 2:13 AM" },
  { t: 0, text: "My heart medicine runs out next week. It costs $600." },
  { t: 0, me: true, text: "I'll figure it out, Mom." },
  { t: 0, sep: true, text: "Today 3:58 AM" },
  { t: 36.3, text: "The pharmacy won't give me my medicine until it's paid." },
  { t: 38.55, text: "I ran out today." },
];
const S_SCR1 = screenScene((t) => (t < 25.95 ? "sent" : "rejected"), (t) => (t < 25.95 ? 24.9 : 25.95));

// 3 · the days slip (one-second cuts)
const S_X1 = bed((t) => atDesk(t, { clock: "1:46" }, "x1", SEAT_PHONE, ex("tired", t, { ly: 5 }), { prop: "phone" }), 0.55);
const S_X2 = bed((t) => deskOnly(t, { clock: "3:47" }, 0), 0.5);
const S_X3 = bed((t) => <>
  {atDesk(t, { clock: "4:20", lid: 1, screen: "form", ts: 31.0, on: 0.6 }, "x3", ASLEEP, ex("tired", t, { closed: true }))}
  <Angel x={1050} y={480 + angelY(t)} s={0.8} t={t} smile={0.4} />
</>, 0.5);
const S_X4: Scene = { draw: (t) => <TopDownNotice t={t} t0={32.95} title="FINAL WARNING" shadows={[32.9, 33.55]} /> };
const S_X5 = screenScene(() => "inbox", () => 33.9);
const S_X6 = bed((t) => atDesk(t, { clock: "5:10", lid: 1, screen: "inbox", ts: 33.0 }, "x6", SEAT_REST, { ...ex("tired", t, { blink: false, ly: 4, lx: 3 }), lid: 0.66 }), 0.5);

// 4 · the floor, then the Devil's entry (one continuous night)
const S_NIGHT: Scene = { set: "set_bedroom",
  dark: (t) => (t < 48.8 ? 0.45 : mix(0.6, 0.72, sm((t - 56) / 4))),
  red: (t) => mix(0, 0.2, sm((t - 50.4) / 4)) + mix(0, 0.25, sm((t - 56.2) / 4)),
  flicker: (t) => ([57.9, 58.3, 58.8, 59.4].some((f) => t > f && t < f + 0.09) ? 0.75 : 0),
  draw: (t) => {
    const g = sm((t - 50.4) / 4.0);         // the halo's shadow stretches into horns
    const rise = sm((t - 61.8) / 1.6);      // the Devil takes shape
    const lean = sm((t - 65.8) / 1.2);
    const ember = t < 47.3 ? 0 : sm((t - 47.4) / 1.2) * (t < 48.6 ? 0.7 + 0.3 * Math.abs(Math.sin(t * 30)) : 1);
    const dPose = t < 64.4 ? TQ : t < 65.8 ? poseAt([{ t: 64.4, pose: TQ }, { t: 65.0, pose: DEVIL_REACH }], t) : poseAt([{ t: 65.8, pose: DEVIL_REACH }, { t: 66.8, pose: DEVIL_LEAN }], t);
    const be = t < 36.3 ? ex("sad", t) : t < 39.9 ? ex("worried", t, { ly: 5 }) : t < 44 ? ex("sad", t)
      : t < 47.2 ? ex("worried", t, { talk: t > 44.1 && t < 47.0 }) : t < 57.8 ? ex("worried", t)
      : t < 59.2 ? ex("surprised", t, { blink: false, red: 0.45 }) : ex(t < 68.4 ? "worried" : "surprised", t, { blink: false });
    return <>
      <WallShadow x={mix(1080, 740, g)} y={mix(330, 300, g)} s={mix(1.3, 5.6, g)} horn={mix(0.35, 1, g)} red={sm(g * 1.6)}
        op={t < 61.8 ? 0.92 : mix(0.92, 0.35, rise)} lit={t < 47.2 ? 0.32 : t < 50.4 ? mix(0.32, 0.12, sm((t - 47.2) / 1.6)) : mix(0.12, 0.6, g)} />
      {deskOnly(t, { clock: "3:59" })}
      {t > 56.2 && <ellipse cx={420} cy={990} rx={760} ry={170} fill="#ff2d1f" opacity={0.3 * sm((t - 56.2) / 1.5)} filter="url(#bb30)" />}
      {t > 56.2 && <FloorSmoke t={t} amount={sm((t - 56.2) / 1)} reach={sm((t - 56.2) / 2.5)} />}
      <FloorNotes t={t} tremble={sm((t - 52.4) / 2)} />
      {t > 59.2 && <Column t={t} x={470} y={FY} amount={sm((t - 59.2) / 1.2) * (1 - rise * 0.5)} />}
      {t > 60.4 && <DevilFig id="night" pose={dPose} x={mix(470, 560, lean)} y={FY} s={mix(1.9, 1.65, lean)} lean={14 * lean} t={t}
        glow={mix(0, 1.5, rise)} rim={lerpColor("#1a0000", "#ff2d1f", rise)} detailOp={sm((t - 60.45) / 0.08)} face="manipulative" />}
      <Char id="night" pose={t < 36.35 ? FLOOR_SIT : t < 41.4 ? poseAt([{ t: 36.35, pose: FLOOR_SIT }, { t: 36.75, pose: FLOOR_PHONE }], t) : poseAt([{ t: 41.4, pose: FLOOR_PHONE }, { t: 41.9, pose: FLOOR_SIT }], t)}
        e={be} x={FLX} y={FLY} s={FLS} t={t} tear={t > 39.9 && t < 41.4 ? (t - 39.9) / 1.4 : 0}
        prop="phone" propLit={sm((t - 36.3) / 0.1) * (1 - sm((t - 41.6) / 0.5))} jitter={t > 36.3 && t < 36.6 ? 1.4 : 0} />
      <Angel x={940} y={800 + angelY(t) * 0.5} s={0.75} t={t} reach={k(t, [41.6, 42.0, 43.2, 43.6], [0, 1, 1, 0])} ember={ember} smile={0.5} />
    </>;
  } };
const S_DOORSMOKE: Scene = { set: "set_door", dark: 0.5, red: (t) => 0.35 * sm((t - 54.4) / 1.4),
  draw: (t) => <>
    <rect x={786} y={566} width={392} height={14} fill="#ff2d1f" opacity={sm((t - 54.5) / 0.6)} filter="url(#bb4)" />
    <ellipse cx={985} cy={600} rx={420} ry={60} fill="#ff2d1f" opacity={0.25 * sm((t - 54.5) / 0.8)} filter="url(#bb24)" />
    <ellipse cx={985} cy={820} rx={620} ry={300} fill="#ff2d1f" opacity={0.3 * sm((t - 54.6) / 1.2)} filter="url(#bb30)" />
    <DoorSmoke t={t} amount={sm((t - 54.6) / 1.0)} />
  </> };

// 5 · THE DROP
const S_DROP: Scene = { set: "set_bedroom", dark: 0.55, red: (t) => mix(0.7, 0.4, sm((t - 69) / 1.5)),
  draw: (t) => <>
    {deskOnly(t, { clock: "4:00" })}
    <FloorNotes t={t} tDrop={69} />
    <DevilFig id="drop" pose={ARMS_UP} x={430} y={FY} s={1.8} t={t} glow={1.7} face="laughing" />
    <Char id="drop" pose={poseAt([{ t: 69.05, pose: FLOOR_SIT }, { t: 69.7, pose: FRONT }], t)}
      e={ex("determined", t, { red: k(t, [69.1, 69.3, 70.6, 71.4], [0, 1, 1, 0]), blink: false })} x={FLX + 20} y={FLY} s={FLS} t={t} prop="phone" propLit={0} />
  </> };

// 6 · Devil mode
const S_DRAWER = bed((t) => {
  const drop = sm((t - 73.3) / 0.35);
  const dr = k(t, [73.05, 73.25, 73.8, 73.95], [0, 1, 1, 0]);
  const hx = 880 + 52 * FLS, hy = FLY - 262 * FLS; // his hand
  return <>
    {deskBack(t, { clock: "4:00" })}
    <ChairAt x={BX} y={FY} />
    {deskFront(t, { clock: "4:00", drawer: dr })}
    {t > 73.3 && t < 73.75 && (
      <g clipPath="url(#drawerIn)">
        <g transform={`translate(${mix(hx, DRAWER_XY[0], drop)},${mix(hy, DRAWER_XY[1] - 6, drop)}) rotate(${drop * 120})`}>
          <rect x={-17} y={-30} width={34} height={60} rx={7} fill="#121318" stroke="#2b2d35" strokeWidth={2} /></g>
      </g>
    )}
    <clipPath id="drawerIn"><rect x={0} y={0} width={1920} height={744.8 + 18 * dr} /></clipPath>
    <Char id="dm0" pose={PHONE_HOLD} e={ex("determined", t)} x={880} y={FLY} s={FLS} t={t} prop={t < 73.3 ? "phone" : null} />
  </>;
}, 0.55, () => 0.35);
const againScene = (id: string, face: DevilFace, clock: string, lidFrom?: number) => bed((t) => {
  const lid = lidFrom === undefined ? 1 : sm((t - lidFrom - 0.15) / 0.5);
  const pose = lidFrom === undefined ? SEAT_TYPE : poseAt([{ t: lidFrom, pose: SEAT_REST }, { t: lidFrom + 0.3, pose: SEAT_LID }, { t: lidFrom + 0.75, pose: SEAT_TYPE }], t);
  return atDesk(t, { clock, lid, screen: "gigs", ts: lidFrom ?? 0 }, id + "b", pose, ex("determined", t, { ly: 3 }),
    { typing: lidFrom === undefined || t > lidFrom + 0.75, before: <DevilFig id={id} pose={DEVIL_REACH} x={400} y={FY} s={1.5} t={t} face={face} /> });
}, 0.5, () => 0.35);
const benchScene = (id: string, devil: "side" | "huge" | null, set = "set_bench", x = 980, y = 1040, s = 1.6): Scene => ({
  set, dark: 0.2, red: () => (devil === "huge" ? 0.25 : 0.15),
  draw: (t) => <>
    {devil === "side" && <DevilFig id={id + "d"} pose={TQ} x={1450} y={1040} s={1.5} flip t={t} />}
    {devil === "huge" && <DevilFig id={id + "d"} pose={ARMS_UP} x={1350} y={1060} s={2.4} op={0.75} t={t} face="laughing" />}
    <Char id={id} pose={HOLD} e={ex("determined", t)} x={x} y={y} s={s} flip t={t} jitter={2.6} prop="phone" />
  </> });
const street = (id: string, t0: number, t1: number, x0: number, x1: number, o: { box?: boolean; speed?: number; stride?: number; devil?: boolean } = {}) => {
  const X = (t: number) => mix(x0, x1, (t - t0) / (t1 - t0));
  const flip = x1 < x0;
  const scene: Scene = { set: "set_street", dark: 0.15, rain: true,
    draw: (t) => {
      const p = walk((t - t0) * (o.speed ?? 11), SIDE, o.stride ?? 1.45);
      return <>
        {o.devil && <DevilFig id={id + "d"} pose={TQ} x={X(t) + (flip ? 360 : -360)} y={1000} s={1.3} flip={flip} t={t} />}
        <Char id={id} pose={o.box ? P({ ...p, ...CARRY }) : p} e={ex("determined", t)} x={X(t)} y={1010} s={1.4} flip={flip} t={t} prop={o.box ? "box" : null} />
      </>;
    } };
  return { scene, X };
};
const clockScene = (clock: string) => bed((t) => deskOnly(t, { clock, lid: 1, screen: "gigs" }, 0), 0.5, () => 0.3);
const ST3 = street("st3", 79.8, 81.2, 200, 1500, { speed: 12, stride: 1.5 });
const ST4 = street("st4", 81.2, 82.4, 600, 1300, { speed: 12, stride: 1.5 });
const ST5 = street("st5", 82.4, 83.8, 450, 1250, { box: true, speed: 8, stride: 1.1 });
const ST11 = street("st11", 90.0, 91.4, 1500, 700, { devil: true });
const ST16 = street("st16", 96.2, 97.6, 200, 1600, { speed: 13, stride: 1.55 });
const S_SCR2 = screenScene(() => "rejected", () => 84.85);
const S_REJECT = bed((t) => atDesk(t, { clock: "9:32", lid: 1, screen: "gigs", ts: 85.3 }, "rej", t < 85.65 ? HEAD_DOWN : SEAT_TYPE,
  ex(t < 85.65 ? "sad" : "determined", t, { ly: 3 }), { typing: t > 85.65 }), 0.45, () => 0.3);
const S_TYPE = bed((t) => atDesk(t, { clock: "12:40", lid: 1, screen: "gigs", ts: 86.5 }, "typ", SEAT_TYPE, ex("determined", t, { ly: 3 }), { typing: true }), 0.45, () => 0.3);
const S_RUB = bed((t) => atDesk(t, { clock: "2:40", lid: 1, screen: "gigs", ts: 91.0 }, "rub", SEAT_RUB, ex("tired", t),
  { before: <DevilFig id="rubd" pose={t < 92.9 ? TQ : poseAt([{ t: 92.9, pose: TQ }, { t: 93.3, pose: DEVIL_REACH }], t)} x={400} y={FY} s={1.6} t={t} face="angry" /> }), 0.5, () => 0.35);
const S_EYES = bed((t) => atDesk(t, { clock: "2:41", lid: 1, screen: "gigs", ts: 92.0 }, "eyes", SEAT_TYPE, ex("determined", t, { blink: false, red: 0.3, ly: 3 })), 0.5, () => 0.35);
const S_STAND = bed((t) => <>
  {deskBack(t, { clock: "6:02", lid: 1, screen: "gigs", ts: 96.0, on: 0.8 })}
  {deskFront(t, { clock: "6:02" })}
  <ChairAt x={BX} y={FY} />
  <DevilFig id="stdd" pose={TQ} x={400} y={FY} s={1.6} t={t} face="mischievous" />
  <Char id="std" pose={FRONT} e={ex("tired", t, { blink: false })} x={720} y={FLY} s={FLS} t={t} jitter={1.6} />
</>, 0.45, () => 0.3);

// 7 · the cost
const S_COST = bed((t) => atDesk(t, { clock: "7:45", lid: 1, screen: "gigs", ts: 100.0, buzz: k(t, [101.05, 101.2, 103.3, 103.5], [0, 1, 1, 0]) }, "cost", SEAT_TYPE,
  ex("determined", t, { lx: t > 102.85 && t < 103.3 ? 8 : 3, ly: t > 102.85 && t < 103.3 ? 6 : 3 }), { typing: t < 102.8 || t > 103.35 }), 0.5, () => 0.22);
const S_DRAWER_AVA: Scene = { draw: (t) => <DrawerPhone t={t} ts={101.05} clock="7:45" day="Friday" from="Ava" lines={["Dinner tonight? I saved", "you a seat."]} /> };
const S_DRAWER_MOM: Scene = { draw: (t) => <DrawerPhone t={t} ts={110.2} open={sm((t - 110.95) / 0.45)} clock="9:01" day="Saturday" from="Mom" lines={["Got my heart medicine", "today. Thank you,", "sweetheart."]} /> };
const S_TABLE: Scene = { set: "set_table", dark: 0.15, draw: () => null };
const S_HUGE = bed((t) => atDesk(t, { clock: "8:10", lid: 1, screen: "gigs", ts: 104.0 }, "hug", SEAT_TYPE, ex("determined", t, { ly: 3 }),
  { typing: true, before: <DevilFig id="huge" pose={ARMS_UP} x={430} y={1000} s={2.3} op={0.9} t={t} face="mischievous" /> }), 0.5, () => 0.3);

// 8 · day zero
const S_ZERO: Scene = { set: "set_bedroom", dark: 0.35, warm: (t) => 0.14 * sm((t - 113.9) / 2),
  draw: (t) => {
    const pose = t < 113.9 ? SEAT_TYPE : t < 114.5 ? poseAt([{ t: 113.9, pose: SEAT_REST }, { t: 114.1, pose: SEAT_LID }, { t: 114.5, pose: SEAT_REST }], t)
      : poseAt([{ t: 114.5, pose: SEAT_REST }, { t: 115.2, pose: SEAT_RELIEF }], t);
    const look = t > 110.25 && t < 113.9;
    return atDesk(t, { clock: "9:01", lid: 1 - sm((t - 114.0) / 0.45), screen: "paid", ts: 107.8, buzz: k(t, [110.2, 110.3, 110.85, 110.95], [0, 1, 1, 0]), drawer: sm((t - 110.95) / 0.45) }, "zero", pose,
      ex(t < 113.9 ? "determined" : "tired", t, { closed: t > 114.8 && t < 116.2, lx: look ? 8 : t < 113.9 ? 3 : 0, ly: look ? 6 : t < 113.9 ? 3 : 1 }),
      { before: <DevilFig id="zero" pose={TQ} x={420} y={FY} s={1.4} op={0.85} glow={0.6} t={t} face="neutral" /> });
  } };

// 9 · the reveal
const S_REVEAL: Scene = { set: "set_bedroom", dark: 0.55,
  red: (t) => 0.25 * (1 - sm((t - 122.9) / 2)), warm: (t) => 0.22 * sm((t - 124.6) / 1.5) + 0.15 * sm((t - 137) / 4),
  draw: (t) => {
    const turned = t >= 119.8;
    const bPose = turned ? SEAT : poseAt([{ t: 118.4, pose: SEAT }, { t: 119.3, pose: SEAT_BACK }], t);
    const tr = sm((t - 122.9) / 1.6);       // red -> gold, horns -> halo
    const shrink = sm((t - 124.9) / 1.5);   // the gold silhouette -> the Angel
    const settle = sm((t - 137.5) / 3);
    const flash = k(t, [124.5, 124.8, 125.8], [0, 1, 0]);
    const look = t > 135.4 && t < 136.5 ? 9 : t >= 136.5 && t < 137 ? -4 : 0;
    const be = t < 118.2 ? ex("tired", t) : t < 122.8 ? ex("worried", t) : t < 136.8 ? ex("surprised", t, { ly: look, blink: t > 131 })
      : ex(t < 139.5 ? "sad" : "neutral", t, { talk: t > 137.0 && t < 141.6 });
    return <>
      <WallShadow x={430} y={mix(290, 300, tr)} s={mix(3.2, 1.6, tr)} horn={1 - tr} red={1 - tr} op={0.9} lit={mix(0.45, 0.5, tr)} />
      {deskBack(t, { clock: "9:04" })}
      <Paper x={560} y={1006} r={-10} stamp title="RENT" />
      <Paper x={480} y={1030} r={12} stamp title="MEDICINE" />
      {shrink < 0.999 && (
        <g opacity={1 - shrink}>
          <DevilFig id="rev" pose={t < 120.6 ? TQ : poseAt([{ t: 120.6, pose: TQ }, { t: 121.3, pose: DEVIL_REACH }], t)}
            x={400} y={mix(FY, FY - 260, shrink)} s={mix(1.45, 0.6, shrink)} t={t} face="neutral" horns={1 - tr}
            rim={lerpColor("#ff2d1f", "#ffd27a", tr)} fill={lerpColor("#090707", "#fff3d6", tr)} detailOp={1 - tr} glow={mix(1, 1.6, tr)} smoke={1 - tr} />
        </g>
      )}
      <Burst t={t} t0={123.0} x={400} y={700} />
      {shrink > 0.001 && <Angel x={mix(430, 500, settle)} y={mix(mix(620, 520, shrink), 640, settle) + angelY(t) * shrink}
        s={mix(mix(0.3, 1.0, shrink), 0.8, settle)} t={t} glow={1.3} reach={k(t, [126.2, 126.6, 127.2, 127.6], [0, 0.6, 0.6, 0])} />}
      <Char id="rev" pose={bPose} e={be} x={BX} y={FY} seat flip={turned} t={t} tear={t > 128.8 && t < 130.2 ? (t - 128.8) / 1.4 : 0} />
      {deskFront(t, { clock: "9:04", drawer: 1 })}
      <circle cx={430} cy={560} r={420} fill="#ffe0a0" opacity={0.55 * flash} filter="url(#bb30)" />
    </>;
  } };

const CL: Cam = [3.0, CLOCK_XY[0], CLOCK_XY[1]];
export const CUTS: Cut[] = [
  // cold open
  { t0: 0, t1: 0.6, scene: null, cam: c(1, 960, 540) },
  { t0: 0.6, t1: 1.6, scene: S_COLD, cam: c(2.4, 600, 390, -4), shake: (t) => 8 * Math.exp(-(t - 0.62) * 5) },
  { t0: 1.6, t1: 3.0, scene: S_COLD, cam: (t) => [mix(1.12, 1.2, (t - 1.6) / 1.4), 760, 640, -6] },
  { t0: 3.0, t1: 4.4, scene: null, cam: c(1, 960, 540) },
  // the notice
  { t0: 4.4, t1: 5.9, scene: S_DOOR, cam: (t) => [mix(1.8, 1.95, (t - 4.4) / 1.5), 985, 640] },
  { t0: 5.9, t1: 7.3, scene: S_DOOR, cam: (t) => [mix(1.5, 1.56, (t - 5.9) / 1.4), 1030, 610] },
  { t0: 7.3, t1: 9.3, scene: S_DOORDARK, cam: c(1.5, 985, 600) },
  { t0: 9.3, t1: 10.5, scene: S_DOORFACE, cam: (t) => [mix(2.4, 2.7, (t - 9.3) / 1.2), 1164, 520] },
  // Mom
  { t0: 10.5, t1: 11.3, scene: S_BEDA, cam: c(1.6, 760, 620) },
  { t0: 11.3, t1: 14.4, scene: S_POV1, cam: c(1.1, 960, 540) },
  { t0: 14.4, t1: 15.3, scene: S_BEDA, cam: (t) => [mix(2.3, 2.45, (t - 14.4) / 0.9), 712, 560] },
  // the Angel
  { t0: 15.3, t1: 16.7, scene: S_BEDA, cam: c(1.25, 1000, 520) },
  { t0: 16.7, t1: 18.1, scene: S_BEDA, cam: (t) => [mix(2.0, 2.2, (t - 16.7) / 1.4), 1220, 400] },
  { t0: 18.1, t1: 21.1, scene: S_BEDA, cam: c(1.35, 940, 560) },
  { t0: 21.1, t1: 23.1, scene: S_BEDA, cam: c(2.0, 1150, 430) },
  // the laptop
  { t0: 23.1, t1: 24.0, scene: S_BEDA, cam: c(2.1, 800, 600) },
  { t0: 24.0, t1: 24.85, scene: S_BEDA, cam: c(1.75, 830, 630) },
  { t0: 24.85, t1: 26.5, scene: S_SCR1, cam: (t) => [mix(1.0, 1.06, (t - 24.85) / 1.65), 960, 540] },
  { t0: 26.5, t1: 27.3, scene: S_BEDA, cam: (t) => [mix(2.4, 2.8, sm((t - 26.5) / 0.3)), 712, 560] },
  { t0: 27.3, t1: 28.8, scene: S_BEDA, cam: c(1.4, 930, 560) },
  { t0: 28.8, t1: 30.2, scene: S_BEDA, cam: c(1.8, 770, 600) },
  // the days slip
  { t0: 30.2, t1: 31.1, scene: S_X1, cam: c(2.3, 705, 560) },
  { t0: 31.1, t1: 32.0, scene: S_X2, cam: () => CL },
  { t0: 32.0, t1: 32.9, scene: S_X3, cam: c(1.45, 860, 600) },
  { t0: 32.9, t1: 33.9, scene: S_X4, cam: (t) => [mix(1.0, 1.06, (t - 32.9) / 1.0), 960, 560] },
  { t0: 33.9, t1: 34.8, scene: S_X5, cam: (t) => [mix(1.0, 1.05, (t - 33.9) / 0.9), 960, 540] },
  { t0: 34.8, t1: 35.7, scene: S_X6, cam: (t) => [mix(3.2, 3.6, (t - 34.8) / 0.9), 728, 548] },
  // the floor
  { t0: 35.7, t1: 36.8, scene: S_NIGHT, cam: c(1.35, 800, 700) },
  { t0: 36.8, t1: 39.9, scene: S_POV2, cam: c(1.1, 760, 640) },
  { t0: 39.9, t1: 41.4, scene: S_NIGHT, cam: c(3.2, 795, 642) },
  { t0: 41.4, t1: 44.0, scene: S_NIGHT, cam: c(1.6, 830, 740) },
  { t0: 44.0, t1: 47.2, scene: S_NIGHT, cam: (t) => [mix(2.2, 2.5, (t - 44) / 3.2), 765, 625] },
  { t0: 47.2, t1: 48.8, scene: S_NIGHT, cam: c(2.3, 940, 790) },
  // the Devil's entry
  { t0: 48.8, t1: 50.2, scene: S_NIGHT, cam: () => [3.2, CLOCK_XY[0], CLOCK_XY[1]] },
  { t0: 50.2, t1: 52.4, scene: S_NIGHT, cam: c(1.3, 900, 610) },
  { t0: 52.4, t1: 54.4, scene: S_NIGHT, cam: (t) => { const u = sm((t - 52.4) / 2); return [1.18, mix(860, 800, u), mix(610, 380, u), 4 * u]; } },
  { t0: 54.4, t1: 56.2, scene: S_DOORSMOKE, cam: (t) => [mix(1.5, 1.75, (t - 54.4) / 1.8), 985, 700] },
  { t0: 56.2, t1: 57.8, scene: S_NIGHT, cam: c(1.8, 640, 900, 3) },
  { t0: 57.8, t1: 59.2, scene: S_NIGHT, cam: (t) => [mix(3.0, 3.4, (t - 57.8) / 1.4), 795, 642, 2] },
  { t0: 59.2, t1: 60.4, scene: S_NIGHT, cam: c(1.3, 560, 610, -3) },
  { t0: 60.4, t1: 61.8, scene: S_NIGHT, cam: c(2.4, 485, 240), shake: (t) => 9 * Math.exp(-(t - 60.45) * 4) },
  { t0: 61.8, t1: 64.4, scene: S_NIGHT, cam: (t) => [mix(1.12, 1.2, (t - 61.8) / 2.6), 760, 570, -5], shake: () => 2 },
  { t0: 64.4, t1: 65.8, scene: S_NIGHT, cam: c(2.2, 700, 540) },
  { t0: 65.8, t1: 68.4, scene: S_NIGHT, cam: (t) => [mix(1.9, 2.1, (t - 65.8) / 2.6), 690, 520] },
  { t0: 68.4, t1: 69.0, scene: S_NIGHT, cam: c(3.6, 795, 642) },
  // the drop
  { t0: 69.0, t1: 73.0, scene: S_DROP, cam: (t) => [mix(1.3, 1.7, sm((t - 69) / 0.5)), 740, mix(710, 570, sm((t - 69) / 0.8))], shake: (t) => 12 * Math.exp(-(t - 69) * 3) },
  // Devil mode
  { t0: 73.0, t1: 74.4, scene: S_DRAWER, cam: c(2.0, 990, 700) },
  { t0: 74.4, t1: 75.8, scene: againScene("ag1", "mischievous", "4:00"), cam: c(2.3, 424, 390) },
  { t0: 75.8, t1: 77.0, scene: againScene("ag0", "mischievous", "4:01", 75.9), cam: c(2.0, 780, 600) },
  // the money montage (cuts on the beat)
  { t0: 77.0, t1: 78.4, scene: benchScene("b1", null), cam: c(2.4, 887, 600) },
  { t0: 78.4, t1: 79.8, scene: benchScene("b2", "side"), cam: c(2.4, 961, 440) },
  { t0: 79.8, t1: 81.2, scene: ST3.scene, cam: c(1.15, 960, 640) },
  { t0: 81.2, t1: 82.4, scene: ST4.scene, cam: (t) => [2.2, ST4.X(t) + 17, 470] },
  { t0: 82.4, t1: 83.8, scene: ST5.scene, cam: (t) => [1.5, ST5.X(t) + 60, 700] },
  { t0: 83.8, t1: 84.8, scene: clockScene("9:31"), cam: () => CL },
  { t0: 84.8, t1: 85.4, scene: S_SCR2, cam: (t) => [mix(1.0, 1.04, (t - 84.8) / 0.6), 960, 540] },
  { t0: 85.4, t1: 86.0, scene: S_REJECT, cam: c(2.3, 730, 570) },
  { t0: 86.0, t1: 87.2, scene: againScene("ag2", "angry", "11:58"), cam: c(2.3, 424, 390) },
  { t0: 87.2, t1: 88.6, scene: S_TYPE, cam: c(1.75, 820, 630) },
  { t0: 88.6, t1: 90.0, scene: benchScene("b10", null, "set_bench2", 1150, 1030, 1.5), cam: c(2.3, 1063, 620) },
  { t0: 90.0, t1: 91.4, scene: ST11.scene, cam: (t) => [1.35, ST11.X(t) + 150, 650] },
  { t0: 91.4, t1: 92.4, scene: clockScene("2:40"), cam: () => CL },
  { t0: 92.4, t1: 93.8, scene: S_RUB, cam: c(2.0, 680, 560) },
  { t0: 93.8, t1: 94.8, scene: S_EYES, cam: (t) => [mix(3.2, 3.5, (t - 93.8)), 728, 548] },
  { t0: 94.8, t1: 96.2, scene: benchScene("b15", "huge"), cam: c(1.05, 960, 560) },
  { t0: 96.2, t1: 97.6, scene: ST16.scene, cam: (t) => [1.3, ST16.X(t), 650] },
  { t0: 97.6, t1: 98.8, scene: bed(() => null, 0.7, () => 0.3), cam: c(1.2, 960, 540) },
  { t0: 98.8, t1: 101.0, scene: S_STAND, cam: c(1.5, 720, 640) },
  // the cost
  { t0: 101.0, t1: 102.8, scene: S_DRAWER_AVA, cam: (t) => [mix(1.0, 1.05, (t - 101.0) / 1.8), 960, 540] },
  { t0: 102.8, t1: 103.6, scene: S_COST, cam: c(3.2, 728, 548) },
  { t0: 103.6, t1: 106.0, scene: S_TABLE, cam: (t) => [mix(1.2, 1.45, sm((t - 103.6) / 2.4)), 1470, 640] },
  { t0: 106.0, t1: 107.6, scene: S_HUGE, cam: c(1.05, 900, 560) },
  // day zero
  { t0: 107.6, t1: 110.2, scene: S_ZERO, cam: c(2.0, 800, 590) },
  { t0: 110.2, t1: 110.9, scene: S_ZERO, cam: c(1.55, 840, 680) },
  { t0: 110.9, t1: 113.9, scene: S_DRAWER_MOM, cam: (t) => [mix(1.0, 1.05, (t - 110.9) / 3.0), 960, 540] },
  { t0: 113.9, t1: 114.6, scene: S_ZERO, cam: c(1.6, 720, 650) },
  { t0: 114.6, t1: 116.4, scene: S_ZERO, cam: (t) => [mix(2.3, 2.6, (t - 114.6) / 1.8), 690, 545] },
  // the reveal
  { t0: 116.4, t1: 118.2, scene: S_REVEAL, cam: c(1.3, 560, 640) },
  { t0: 118.2, t1: 119.8, scene: S_REVEAL, cam: c(2.2, 690, 560) },
  { t0: 119.8, t1: 121.6, scene: S_REVEAL, cam: c(1.5, 520, 620) },
  { t0: 121.6, t1: 122.8, scene: S_REVEAL, cam: c(2.3, 590, 600) },
  { t0: 122.8, t1: 126.0, scene: S_REVEAL, cam: (t) => [mix(1.8, 2.0, (t - 122.8) / 3.2), 430, 480] },
  { t0: 126.0, t1: 127.6, scene: S_REVEAL, cam: c(2.4, 430, 520) },
  { t0: 127.6, t1: 128.8, scene: S_REVEAL, cam: c(2.2, 430, 300) },
  { t0: 128.8, t1: 130.2, scene: S_REVEAL, cam: c(3.2, 580, 545) },
  { t0: 130.2, t1: 135.4, scene: S_REVEAL, cam: (t) => [mix(1.45, 1.55, (t - 130.2) / 5.2), 520, 600] },
  { t0: 135.4, t1: 136.8, scene: S_REVEAL, cam: c(2.4, 520, 1010) },
  { t0: 136.8, t1: 142.0, scene: S_REVEAL, cam: (t) => [mix(1.7, 1.85, (t - 136.8) / 5.2), 560, 600] },
  { t0: 142.0, t1: 152.0, scene: null, cam: c(1, 960, 540) },
];

// W x H = the output frame (the Short renders the same scenes into 1080 x 1920)
export const CutView: React.FC<{ cut: Cut; t: number; W?: number; H?: number }> = ({ cut, t, W = 1920, H = 1080 }) => {
  const sc = cut.scene;
  if (!sc) return null;
  const [z, cx0, cy0, rot = 0] = cut.cam(t);
  const cx = cx0 + (Math.sin(t * 0.7) * 5) / z, cy = cy0 + (Math.cos(t * 0.9) * 4) / z; // a little handheld drift
  const sh = cut.shake ? cut.shake(t) : 0;
  const sx = Math.sin(t * 91) * sh, sy = Math.cos(t * 77) * sh;
  const blur = sc.blur ?? Math.max(0, Math.min(3.5, (z - 1.3) * 2.2));   // shallow depth of field in close-ups
  const dark = typeof sc.dark === "function" ? sc.dark(t) : sc.dark ?? 0;
  const red = sc.red ? sc.red(t) : 0, warm = sc.warm ? sc.warm(t) : 0, fl = sc.flicker ? sc.flicker(t) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${W / 2 + sx}px, ${H / 2 + sy}px) rotate(${rot}deg) scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "0 0" }}>
        {sc.set && <>
          {/* bleed: a blurred, enlarged copy fills the corners on wide or rolled frames */}
          <Img src={staticFile(`poses/${sc.set}.png`)} style={{ position: "absolute", left: -320, top: -180, width: 2560, height: 1440, objectFit: "cover", filter: "blur(14px) brightness(0.55)" }} />
          <Img src={staticFile(`poses/${sc.set}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined }} />
        </>}
        <div style={{ position: "absolute", left: -320, top: -180, width: 2560, height: 1440, background: "#05060a", opacity: dark }} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <BeanDefs />
          <DeskDefs />
          <DoorDefs />
          {sc.draw(t)}
          {sc.rain && <Rain t={t} />}
        </svg>
      </AbsoluteFill>
      {sc.rain && <AbsoluteFill style={{ background: "rgba(40,70,140,0.18)", mixBlendMode: "screen" }} />}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,40,20,0) 25%, rgba(170,10,0,1) 100%)", opacity: red, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 50%, rgba(255,190,110,0.9) 0%, rgba(255,160,80,0) 60%)", opacity: warm, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fl }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ words on screen, counters, flashes
const LINES: Line[] = [
  { t0: 1.75, t1: 2.95, who: "devil", text: "Then move.", x: 1320, y: 210, size: 88 },
  { t0: 18.2, t1: 20.9, who: "angel", text: "You don't have to solve everything tonight.", x: 960, y: 160 },
  { t0: 21.2, t1: 23.0, who: "angel", text: "One step at a time.", x: 960, y: 150 },
  { t0: 27.4, t1: 28.7, who: "angel", text: "Again?", x: 1250, y: 210, size: 64 },
  { t0: 28.9, t1: 30.0, who: "bean", text: "Tomorrow.", x: 960, y: 160, size: 58 },
  { t0: 41.5, t1: 43.9, who: "angel", text: "You can still take one step.", x: 1260, y: 180 },
  { t0: 44.1, t1: 47.0, who: "bean", text: "I keep taking one… then stopping.", x: 960, y: 150 },
  { t0: 66.0, t1: 68.3, who: "devil", text: "Then move.", x: 1320, y: 200, size: 92 },
  { t0: 74.5, t1: 75.8, who: "devil", text: "Again.", x: 1360, y: 250, size: 84 },
  { t0: 86.1, t1: 87.2, who: "devil", text: "Again.", x: 1360, y: 250, size: 84 },
  { t0: 130.3, t1: 135.2, who: "angel", text: "You never listened when I was kind.", x: 960, y: 150, size: 56 },
  { t0: 137.0, t1: 141.6, who: "bean", text: "I heard you. I kept choosing tomorrow.", x: 960, y: 150, size: 50 },
];
const PAYMENTS: [number, number, string][] = [[78.6, 1200, "Repair contract"], [82.6, 150, "Delivery"], [88.8, 375, "Repairs"], [90.2, 300, "Delivery"], [96.4, 375, "Final job"]];
const earnedAt = (t: number) => PAYMENTS.reduce((a, [pt, amt]) => a + amt * sm((t - pt) / 0.5), 0);
const DAYS: [number, number][] = [[8.5, 30], [30.2, 30], [35.6, 18], [69, 18], [99.5, 0], [200, 0]];
export const daysAt = (t: number) => Math.round(k(t, DAYS.map((d) => d[0]), DAYS.map((d) => d[1])));
const letterbox = (t: number) => (t < 3.0 ? 96 : t < 52.6 ? 0 : t < 53.4 ? 96 * sm((t - 52.6) / 0.8) : t < 114.8 ? 96 : t < 115.6 ? 96 * (1 - sm((t - 114.8) / 0.8)) : 0);
export const flashOf = (t: number): [string, number] => {
  if (t >= 0.62 && t < 0.8) return ["#ff2d1f", k(t, [0.62, 0.64, 0.8], [0, 0.6, 0])];
  if (t >= 3.0 && t < 3.1) return ["#ff2d1f", 1];
  if (t >= 60.45 && t < 60.6) return ["#ffffff", k(t, [60.45, 60.47, 60.6], [0, 0.5, 0])];
  if (t >= 69.0 && t < 69.3) return [t < 69.1 ? "#ffffff" : "#ff2d1f", k(t, [69.0, 69.02, 69.3], [0, 1, 0])];
  return ["#000", 0];
};

// qa: render a list of frames as a short sequence (for contact sheets)
export const Film04: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const t = f / FPS;
  const cut = CUTS.find((cu) => t >= cu.t0 && t < cu.t1);
  const lb = letterbox(t);
  const [flashCol, flashOp] = flashOf(t);
  const devilTime = t >= 69 && t < 116;
  const daysOp = k(t, [8.5, 8.6, 115.6, 116.0], [0, 1, 1, 0]);
  const daysPop = 1 + 0.6 * (1 - sm((t - 8.5) / 0.2));
  const earnOp = k(t, [76.0, 76.3, 115.6, 116.0], [0, 1, 1, 0]);
  const earned = earnedAt(t);
  const slam = t >= 69.05 && t < 70.9;
  const slamS = 1.6 - 0.6 * sm((t - 69.05) / 0.16);
  const ring = t >= 69.05 && t < 69.7 ? (t - 69.05) / 0.65 : -1;
  const bigEarn = k(t, [97.6, 97.75, 98.6, 98.8], [0, 1, 1, 0]);
  const endA = k(t, [142.6, 143.4, 147.4, 147.9], [0, 1, 1, 0]);
  const endB = k(t, [145.0, 145.8, 147.4, 147.9], [0, 1, 1, 0]);
  const title = k(t, [148.0, 148.25, 151.4, 152], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {cut && <CutView cut={cut} t={t} />}
      {LINES.map((l, i) => <LineView key={i} l={l} t={t} />)}
      <NoticeCard t={t} t0={7.35} t1={9.3} />
      <PhonePOV t={t} t0={11.3} t1={14.4} name="Mom" clock="2:13" items={CHAT1} typing={[[11.75, 12.55]]} />
      <PhonePOV t={t} t0={36.8} t1={39.9} name="Mom" clock="3:58" items={CHAT2} typing={[[37.6, 38.55]]} />
      {/* top-anchored UI moves down with the letterbox bars */}
      <AbsoluteFill style={{ transform: `translateY(${lb}px)` }}>
        {PAYMENTS.map(([pt, amt, label]) => <PayBanner key={pt} t={t} t0={pt - 0.15} t1={pt + 1.1} amount={`+${fmt$(amt)}`} label={label} />)}
        <PayBanner t={t} t0={107.8} t1={110.1} amount="$1,800" label="Rent" paid left={1080} />
        <PayBanner t={t} t0={108.6} t1={110.1} amount="$600" label="Mom's medicine" paid top={230} left={1080} />
        {daysOp > 0 && (
          <div style={{ position: "absolute", left: 64, top: 36, opacity: daysOp, fontFamily: "Avenir Next", color: devilTime ? "#ff4a3a" : "#f1ece2",
            textShadow: devilTime ? "0 0 18px rgba(255,40,20,0.7)" : "0 2px 6px #000", transform: `scale(${daysPop})`, transformOrigin: "0 0" }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, opacity: 0.85 }}>DAYS LEFT</div>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1 }}>{daysAt(t)}</div>
          </div>
        )}
        {earnOp > 0 && (
          <div style={{ position: "absolute", left: 64, top: 156, opacity: earnOp, fontFamily: "Avenir Next", textShadow: "0 2px 6px #000" }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: "#8fd4a5" }}>EARNED</div>
            <div style={{ fontSize: 50, fontWeight: 800, color: earned >= 2399.5 ? "#5be08a" : "#f1ece2" }}>{fmt$(earned)} <span style={{ fontSize: 30, color: "#8a8f9b" }}>/ $2,400</span></div>
          </div>
        )}
      </AbsoluteFill>
      {t >= 3.1 && t < 4.4 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "Avenir Next", fontWeight: 600, fontSize: 46, letterSpacing: 14, color: "#f1ece2", opacity: k(t, [3.25, 3.45, 4.1, 4.35], [0, 1, 1, 0]) }}>30 DAYS EARLIER</div>
        </AbsoluteFill>
      )}
      {bigEarn > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: bigEarn, fontFamily: "Avenir Next" }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 10, color: "#8fd4a5" }}>EARNED</div>
          <div style={{ fontSize: 190, fontWeight: 900, color: "#5be08a", transform: `scale(${1.3 - 0.3 * sm((t - 97.6) / 0.15)})`, textShadow: "0 0 50px rgba(60,220,120,0.6)" }}>$2,400</div>
        </AbsoluteFill>
      )}
      {slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k(t, [69.05, 69.12, 70.5, 70.9], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(t * 90) * 7 * Math.exp(-(t - 69.05) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 200,
            letterSpacing: 26, color: "#ff3b2a", textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 6px 0 #3a0000", paddingLeft: 26 }}>DEVIL MODE</div>
        </AbsoluteFill>
      )}
      {ring >= 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={960} cy={540} r={60 + ring * 1300} fill="none" stroke="#ff3b2a" strokeWidth={34 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {t >= 142 && (
        <AbsoluteFill style={{ background: "#050507", alignItems: "center", justifyContent: "center", fontFamily: "Avenir Next" }}>
          <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontSize: 56, fontWeight: 600, color: "#f1ece2", opacity: endA }}>The voice was always the same.</div>
          <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontSize: 56, fontWeight: 600, color: "#ffd27a", opacity: endB, textShadow: "0 0 22px rgba(255,190,90,0.7)" }}>The choice was finally his.</div>
          <div style={{ opacity: title, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: 24, color: "#f1ece2", paddingLeft: 24 }}>DEVIL MODE</div>
            <div style={{ width: 380, height: 7, background: "#ff3b2a", marginTop: 12, boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: flashCol, opacity: flashOp }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: lb, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lb, background: "#000" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {!(qa && qa.length) && <Audio src={staticFile("audio/film04_mix.wav")} />}
    </AbsoluteFill>
  );
};
