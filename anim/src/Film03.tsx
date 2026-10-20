// FILM 01 v3 — DEVIL MODE (about 2:46): the stakes + the twist. Script: scripts/film01_DEVILMODE_v5_LOCKED.md.
// Bean, the Devil and the Angel follow Harshad's own sheets (code rig); backgrounds were generated to match.
// The three twist plants: the halo's horn-shaped wall shadow, the shared open-hand gesture, the same "Again".
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import type { Pose } from "./rig/figure";
import type { V2 } from "./rig/geom";
import { BEAN_EXPR, BeanDefs, BeanExpr, BeanExprName, BeanSVG, DevilFace, DevilSVG, Smoke, beanHand, buildBean } from "./rig/bean";
import { Angel } from "./rig/angel";
import { CL, k, sm, mix, P, hex, lerpColor, FLOOR_SIT, SEAT_PHONE, SEAT_RELIEF, SEAT_RUB, SEAT_BACK, PHONE_HOLD, CARRY, DEVIL_REACH, DEVIL_LEAN, ex, Prop, CharP, Char, DevP, DevilFig, WallShadow, Paper, FLOOR_NOTES, FloorNotes, Table, smokePuffs, DoorSmoke, FloorSmoke, Column, Burst, Rain, Spark, Who, Line, STY, LineView, fade, pop, NoticeCard, PhoneChat, MailCard, PayBanner, LockBanner, fmt$ } from "./film/kit";
import { FLINCH, FRONT, HOLD, HOLD_DOWN, SEAT, SEAT_HOLD, SIDE, TQ, poseAt, walk } from "./rig/beanPoses";

export const FILM3_SECONDS = 166;
const FPS = 30;
// ------------------------------------------------------------------ shots
type Shot = { t0: number; t1: number; set?: string; dark?: number; red?: (t: number) => number; warm?: (t: number) => number;
  cam?: (t: number) => [number, number, number]; shake?: (t: number) => number; flicker?: (t: number) => number; rain?: boolean;
  draw: (t: number) => React.ReactNode };

const BX = 640, FY = 960; // Bean's seat in the bedroom, floor line
const clockAt = (t: number) => (t < 76 ? (t < 56 ? "2:13" : "3:59") : "4:00");
const angelY = (t: number) => Math.sin(t * 1.3) * 22;
const montage = (t0: number, draw: (t: number, lt: number) => React.ReactNode, o: Partial<Shot> = {}): Shot => ({ t0, t1: t0 + 2, draw: (t) => draw(t, t - t0), ...o });

const SHOTS: Shot[] = [
  // 1 · the notice slides under the door; Bean walks in and picks it up
  { t0: 0, t1: 3.2, set: "set_door", dark: 0.1, cam: (t) => [1 + 0.03 * t, 980, 640],
    draw: (t) => {
      const sl = sm((t - 0.3) / 1.2);
      const w = { x: mix(1700, 1180, sm((t - 1.4) / 1.1)) };
      const walking = t > 1.4 && t < 2.5;
      return <>
        {t < 2.9 && <Paper x={mix(985, 930, sl)} y={mix(580, 850, sl)} r={mix(0, -6, sl)} s={mix(0.5, 1.5, sl)} title="FINAL RENT NOTICE" />}
        <Char id="c1" pose={walking ? walk((t - 1.4) * 7) : t < 2.5 ? SIDE : HOLD_DOWN} e={ex("tired", t)} x={w.x} y={1000} flip t={t} prop={t > 2.9 ? "notice" : null} />
      </>;
    } },
  // 2 · close-up of the notice (overlay) over the dim doorway
  { t0: 3.2, t1: 6, set: "set_door", dark: 0.55, cam: (t) => [1.15, 980, 640], draw: () => null },
  // 3 · a text from Mom
  { t0: 6, t1: 14, set: "set_bedroom", dark: 0.3, cam: (t) => [1 + 0.02 * (t - 6), 760, 640],
    draw: (t) => <>
      <Table t={t} clock={clockAt(t)} />
      <Char id="c3" pose={SEAT_PHONE} e={ex("worried", t, { ly: 4 })} x={BX} y={FY} seat t={t} prop="phone" />
    </> },
  // 4 · the Angel arrives; its halo throws a forked shadow on the wall; the open-hand gesture at the laptop
  { t0: 14, t1: 25, set: "set_bedroom", dark: 0.3,
    draw: (t) => {
      const bloom = sm((t - 15.8) / 0.9);
      const sp = sm((t - 14) / 1.8);
      const reach = k(t, [20.8, 21.4, 23.6, 24.2], [0, 1, 1, 0]);
      const lid = sm((t - 22.6) / 0.8);
      return <>
        <WallShadow x={1330} y={250} s={1.15} horn={0.35} op={0.9 * bloom} lit={0.38} />
        <Table t={t} clock={clockAt(t)} />
        <Char id="c4" pose={t < 22.4 ? SEAT_PHONE : SEAT_HOLD} e={ex(t < 21 ? "tired" : "worried", t)} x={BX} y={FY} seat t={t}
          prop={t < 22.4 ? "phone" : "laptop"} lid={lid} />
        {t < 16.6 && <Spark x={mix(900, 1190, sp) + Math.cos(t * 4) * 70 * (1 - sp)} y={mix(170, 440, sp) + Math.sin(t * 4) * 50 * (1 - sp)} op={1 - bloom} />}
        {t >= 15.8 && <Angel x={1190} y={440 + angelY(t)} s={0.9 * bloom} t={t} reach={reach} />}
      </>;
    } },
  // 5a · application sent
  { t0: 25, t1: 28, set: "set_bedroom", dark: 0.35, draw: (t) => <>
      <Table t={t} clock={clockAt(t)} />
      <Char id="c5a" pose={SEAT_HOLD} e={ex("worried", t, { ly: 4 })} x={BX} y={FY} seat t={t} prop="laptop" typing={t < 26} />
      <Angel x={1190} y={440 + angelY(t)} s={0.85} t={t} />
    </> },
  // 5b · not selected
  { t0: 28, t1: 31, set: "set_bedroom", dark: 0.35, draw: (t) => <>
      <Table t={t} clock={clockAt(t)} />
      <Char id="c5b" pose={t < 29 ? SEAT_HOLD : P({ ...SEAT_HOLD, head: [52, -312], tilt: 28 })} e={ex(t < 29 ? "worried" : "sad", t)} x={BX} y={FY} seat t={t} prop="laptop" />
      <Angel x={1190} y={440 + angelY(t)} s={0.85} t={t} smile={0.6} />
    </> },
  // 5c · "Again?" — "Tomorrow." (the laptop closes)
  { t0: 31, t1: 35, set: "set_bedroom", dark: 0.35, draw: (t) => <>
      <WallShadow x={1330} y={250} s={1.15} horn={0.35} op={0.9} lit={0.38} />
      <Table t={t} clock={clockAt(t)} />
      <Char id="c5c" pose={SEAT_HOLD} e={ex(t < 33.2 ? "sad" : "tired", t, { talk: t > 33.3 && t < 34.2 })} x={BX} y={FY} seat t={t} prop="laptop" lid={1 - sm((t - 34) / 0.6)} />
      <Angel x={1150} y={460 + angelY(t)} s={0.9} t={t} reach={k(t, [31, 31.5, 33, 33.5], [0, 1, 1, 0])} />
    </> },
  // 5d · days slip: scrolling
  { t0: 35, t1: 37, set: "set_bedroom", dark: 0.45, draw: (t) => <>
      <Table t={t} clock={"1:46"} />
      <Char id="c5d" pose={SEAT_PHONE} e={ex("tired", t, { ly: 5 })} x={BX} y={FY} seat t={t} prop="phone" />
    </> },
  // 5e · another notice under the door: FINAL WARNING
  { t0: 37, t1: 39, set: "set_door", dark: 0.15, cam: () => [1.25, 960, 700], draw: (t) => {
      const sl = sm((t - 37.1) / 1.1);
      return <Paper x={mix(985, 960, sl)} y={mix(580, 800, sl)} r={mix(0, 6, sl)} s={mix(0.5, 3.6, sl)} title="FINAL WARNING" />;
    } },
  // 5f · asleep sitting up; the Angel waits
  { t0: 39, t1: 41, set: "set_bedroom", dark: 0.5, draw: (t) => <>
      <Table t={t} clock={"3:12"} />
      <Char id="c5f" pose={P({ ...SEAT, head: [54, -312], tilt: 32 })} e={ex("tired", t, { closed: true })} x={BX} y={FY} seat t={t} />
      <Angel x={1150} y={470 + angelY(t)} s={0.8} t={t} smile={0.4} />
    </> },
  // 5g · rejections pile up
  { t0: 41, t1: 43, set: "set_bedroom", dark: 0.45, draw: (t) => <>
      <Table t={t} clock={clockAt(t)} />
      <Char id="c5g" pose={P({ ...SEAT_HOLD, head: [52, -312], tilt: 26 })} e={ex("sad", t)} x={BX} y={FY} seat t={t} prop="laptop" />
    </> },
  // 6 · the floor: Mom's second text; the Angel crouches and offers its hand; its light dims
  { t0: 43, t1: 56, set: "set_bedroom", dark: 0.45, cam: (t) => [1 + 0.05 * sm((t - 43) / 13), 760, 700],
    draw: (t) => <>
      <WallShadow x={1080} y={330} s={1.3} horn={0.35} op={0.85} lit={0.32} />
      <Table t={t} clock={clockAt(t)} />
      <FloorNotes t={t} />
      <Char id="c6" pose={FLOOR_SIT} e={ex(t < 52 ? "sad" : "worried", t, { talk: t > 52.3 && t < 55.4 })} x={700} y={FY} t={t} />
      <Angel x={940} y={800 + angelY(t) * 0.5} s={0.75} t={t} reach={k(t, [49, 49.6, 51.4, 52], [0, 1, 1, 0])} glow={k(t, [43, 53, 56], [1, 1, 0.45])} smile={0.5} />
    </> },
  // 7a · silence; the clock ticks; the Angel fades to an ember; the camera creeps in
  { t0: 56, t1: 59.5, set: "set_bedroom", dark: 0.6, cam: (t) => [mix(1.05, 1.16, sm((t - 56) / 3.5)), 740, 700],
    draw: (t) => <>
      <WallShadow x={1080} y={330} s={1.3} horn={0.35} op={0.85} lit={mix(0.32, 0.12, sm((t - 56.2) / 1.8))} />
      <Table t={t} clock={clockAt(t)} />
      <FloorNotes t={t} />
      <Char id="c7a" pose={FLOOR_SIT} e={ex("sad", t)} x={700} y={FY} t={t} />
      <Angel x={940} y={800} s={0.75} t={t} ember={sm((t - 56.2) / 1.8)} smile={0.4} />
    </> },
  // 7b · the halo's shadow stretches up the wall; its tips sharpen into horns
  { t0: 59.5, t1: 62.5, set: "set_bedroom", dark: 0.62, red: (t) => 0.12 * sm((t - 60.5) / 2), cam: () => [1, 960, 540],
    draw: (t) => {
      const g = sm((t - 59.6) / 2.7);
      return <>
        <WallShadow x={mix(1080, 740, g)} y={mix(330, 300, g)} s={mix(1.3, 5.6, g)} horn={mix(0.35, 1, g)} red={sm(g * 1.6)} op={0.95} lit={mix(0.12, 0.6, g)} />
        <Table t={t} clock={clockAt(t)} />
        <FloorNotes t={t} tremble={g * 0.6} />
        <Char id="c7b" pose={FLOOR_SIT} e={ex("worried", t)} x={700} y={FY} t={t} />
        <Angel x={940} y={800} s={0.75} t={t} ember={1} />
      </>;
    } },
  // 7c · the light under the door turns red; smoke pours under it toward us
  { t0: 62.5, t1: 65.5, set: "set_door", dark: 0.5, red: (t) => 0.35 * sm((t - 62.5) / 2), cam: (t) => [mix(1.05, 1.2, sm((t - 62.5) / 3)), 985, 700],
    draw: (t) => <>
      <rect x={786} y={566} width={392} height={14} fill="#ff2d1f" opacity={sm((t - 62.6) / 0.8)} filter="url(#bb4)" />
      <ellipse cx={985} cy={600} rx={420} ry={60} fill="#ff2d1f" opacity={0.25 * sm((t - 62.6) / 1)} filter="url(#bb24)" />
      <ellipse cx={985} cy={820} rx={620} ry={300} fill="#ff2d1f" opacity={0.3 * sm((t - 62.8) / 1.6)} filter="url(#bb30)" />
      <DoorSmoke t={t} amount={sm((t - 62.8) / 1.4)} />
    </> },
  // 7d · smoke floods in, the lights flicker, the room turns red; the smoke coils into a column behind him
  { t0: 65.5, t1: 68.8, set: "set_bedroom", dark: 0.6, red: (t) => mix(0.2, 0.45, sm((t - 65.5) / 3)),
    flicker: (t) => ([66.0, 66.5, 67.2, 67.7, 68.3].some((f) => t > f && t < f + 0.09) ? 0.75 : 0), shake: (t) => 2 * sm((t - 66) / 2.8),
    draw: (t) => <>
      <WallShadow x={740} y={300} s={5.6} horn={1} red={1} op={0.95} lit={0.6} />
      <Table t={t} clock={clockAt(t)} />
      <ellipse cx={420} cy={990} rx={760} ry={170} fill="#ff2d1f" opacity={0.3 * sm((t - 65.5) / 1.5)} filter="url(#bb30)" />
      <FloorSmoke t={t} amount={sm((t - 65.5) / 1)} reach={sm((t - 65.5) / 2.5)} />
      <FloorNotes t={t} tremble={1} />
      <Column t={t} x={470} y={FY} amount={sm((t - 66.4) / 1.6)} />
      <Char id="c7d" pose={FLOOR_SIT} e={ex("worried", t)} x={700} y={FY} t={t} />
      <Angel x={940} y={800} s={0.75} t={t} ember={1} />
    </> },
  // 7e · in the dark column, two red eyes open (BOOM)
  { t0: 68.8, t1: 70.2, set: "set_bedroom", dark: 0.85, red: () => 0.45, cam: () => [1.7, 500, 330], shake: (t) => (t > 69 ? 7 * Math.exp(-(t - 69) * 4) : 0),
    draw: (t) => {
      const open = sm((t - 68.95) / 0.12);
      return <>
        <Column t={t} x={470} y={FY} amount={1} />
        {[478, 530].map((ex0, i) => (
          <g key={i} transform={`translate(${ex0},${232}) scale(1,${open})`}>
            <path d={`M-22,${i ? -6 : 6} Q0,-14 22,${i ? 6 : -6} Q0,10 -22,${i ? -6 : 6} Z`} fill="#ff2d1f" filter="url(#bb4)" />
            <path d={`M-20,${i ? -5 : 5} Q0,-11 20,${i ? 5 : -5} Q0,7 -20,${i ? -5 : 5} Z`} fill="#ffd2c4" />
          </g>
        ))}
      </>;
    } },
  // 7f-7h · the Devil rises over him, makes the open-hand gesture, leans to his ear: "Then move." — silence
  { t0: 70.2, t1: 76, set: "set_bedroom", dark: 0.7, red: () => 0.45,
    cam: (t) => (t < 73 ? [mix(1.0, 0.96, sm((t - 70.2) / 2.8)), 900, 520] : [mix(1.05, 1.25, sm((t - 73) / 2.6)), 640, 560]),
    shake: (t) => (t < 72 ? 2.5 : 0),
    draw: (t) => {
      const rise = sm((t - 70.2) / 1.6);
      const leaning = sm((t - 73) / 1.4);
      const pose = t < 71.6 ? TQ : t < 73 ? poseAt([{ t: 71.6, pose: TQ }, { t: 72.3, pose: DEVIL_REACH }], t) : poseAt([{ t: 73, pose: DEVIL_REACH }, { t: 74.2, pose: DEVIL_LEAN }], t);
      return <>
        <WallShadow x={740} y={300} s={5.6} horn={1} red={1} op={mix(0.95, 0.35, rise)} lit={0.6} />
        <Table t={t} clock={clockAt(t)} />
        <FloorSmoke t={t} amount={1} reach={1} />
        <FloorNotes t={t} tremble={1} />
        <Column t={t} x={470} y={FY} amount={1 - rise * 0.5} />
        <DevilFig id="d7" pose={pose} x={mix(470, 560, leaning)} y={FY} s={mix(1.9, 1.65, leaning)} lean={14 * leaning} t={t}
          glow={mix(0.2, 1.5, rise)} op={rise} face="manipulative" />
        <Char id="c7f" pose={FLOOR_SIT} e={ex(t < 72 ? "surprised" : "worried", t, { blink: false })} x={700} y={FY} t={t} />
        <Angel x={940} y={800} s={0.75} t={t} ember={1} />
      </>;
    } },
  // 7i · THE DROP: he stands; the notices blow away; DEVIL MODE; 3:59 becomes 4:00
  { t0: 76, t1: 80, set: "set_bedroom", dark: 0.55, red: (t) => mix(0.7, 0.4, sm((t - 76) / 1.5)),
    cam: (t) => [mix(1.12, 1.3, sm((t - 76) / 1.2)), 700, mix(640, 560, sm((t - 76) / 1.2))],
    shake: (t) => 10 * Math.exp(-(t - 76) * 3),
    draw: (t) => {
      const up = sm((t - 76.05) / 0.6);
      return <>
        <Table t={t} clock={clockAt(t)} />
        <FloorNotes t={t} tDrop={76} />
        <DevilFig id="d7i" pose={P({ ...FRONT, elR: [120, -300], wrR: [150, -360], elL: [-120, -300], wrL: [-150, -360] })} x={430} y={FY} s={1.8} t={t} glow={1.7} face="laughing" />
        <Char id="c7i" pose={poseAt([{ t: 76.05, pose: FLOOR_SIT }, { t: 76.7, pose: FRONT }], t)} e={ex("determined", t, { red: k(t, [76.1, 76.3, 77.6, 78.4], [0, 1, 1, 0]), blink: false })} x={720} y={FY} t={t} />
      </>;
    } },
  // 8a · 4:00 AM: the phone goes in the drawer
  { t0: 80, t1: 81.8, set: "set_bedroom", dark: 0.55, red: () => 0.35, cam: () => [1.15, 860, 700],
    draw: (t) => {
      const drop = sm((t - 80.5) / 0.35);
      const drawer = k(t, [80, 80.3, 81.0, 81.15], [0, 1, 1, 0]);
      return <>
        <Table t={t} clock={clockAt(t)} drawer={drawer} />
        {t > 80.5 && t < 80.95 && <g transform={`translate(${mix(820, 930, drop)},${mix(640, 840, drop)}) rotate(${drop * 140})`}>
          <rect x={-17} y={-30} width={34} height={60} rx={7} fill="#121318" stroke="#2b2d35" strokeWidth={2} /></g>}
        <Char id="c8a" pose={PHONE_HOLD} e={ex("determined", t)} x={760} y={FY} t={t} prop={t < 80.5 ? "phone" : null} />
      </>;
    } },
  // 8b · the laptop opens; the Devil: "Again." (clue 3)
  { t0: 81.8, t1: 86, set: "set_bedroom", dark: 0.5, red: () => 0.35,
    draw: (t) => <>
      <Table t={t} clock={clockAt(t)} />
      <DevilFig id="d8" pose={t > 83.1 ? DEVIL_REACH : TQ} x={400} y={FY} s={1.5} t={t} face="mischievous" />
      <Char id="c8b" pose={SEAT_HOLD} e={ex("determined", t)} x={BX} y={FY} seat t={t} prop="laptop" lid={sm((t - 82) / 0.7)} typing={t > 82.8} />
    </> },
  // 9 · the money montage (two-second cuts on the beat)
  montage(86, (t, lt) => <>
    <DevilFig id="m1d" pose={lt > 1 ? DEVIL_REACH : TQ} x={1450} y={1040} s={1.5} flip t={t} />
    <Char id="m1" pose={HOLD} e={ex("determined", t)} x={980} y={1040} s={1.6} flip t={t} jitter={2.4} prop="phone" />
  </>, { set: "set_bench", dark: 0.2, red: () => 0.18 }),
  montage(88, (t) => <Char id="m2" pose={HOLD} e={ex("determined", t)} x={980} y={1040} s={1.6} flip t={t} jitter={2.4} prop="phone" />,
    { set: "set_bench", dark: 0.25, red: () => 0.15, cam: () => [1.2, 900, 640] }),
  montage(90, (t, lt) => { const p = walk(lt * 8, SIDE, 1.1); return <Char id="m3" pose={P({ ...p, ...CARRY })} e={ex("determined", t)} x={mix(250, 1150, lt / 2)} y={1010} s={1.4} t={t} prop="box" />; },
    { set: "set_street", dark: 0.15, rain: true }),
  montage(92, (t, lt) => <>
    <DevilFig id="m4d" pose={TQ} x={mix(1850, 1000, lt / 2)} y={1000} s={1.3} flip t={t} />
    <Char id="m4" pose={walk(lt * 11, SIDE, 1.45)} e={ex("determined", t)} x={mix(1500, 600, lt / 2)} y={1010} s={1.4} flip t={t} />
  </>, { set: "set_street", dark: 0.15, rain: true }),
  montage(94, (t, lt) => <>
    <Table t={t} clock={"9:31"} />
    <Char id="m5" pose={lt > 0.5 && lt < 1.1 ? P({ ...SEAT_HOLD, head: [50, -314], tilt: 24 }) : SEAT_HOLD} e={ex(lt < 1.1 ? "sad" : "determined", t)} x={BX} y={FY} seat t={t} prop="laptop" typing={lt > 1.2} />
  </>, { set: "set_bedroom", dark: 0.45, red: () => 0.3 }),
  montage(96, (t, lt) => <>
    <DevilFig id="m6d" pose={lt > 0.2 ? DEVIL_REACH : TQ} x={400} y={FY} s={1.55} t={t} />
    <Table t={t} clock={"11:58"} />
    <Char id="m6" pose={SEAT_HOLD} e={ex("determined", t)} x={BX} y={FY} seat t={t} prop="laptop" typing />
  </>, { set: "set_bedroom", dark: 0.45, red: () => 0.32 }),
  montage(98, (t) => <Char id="m7" pose={HOLD} e={ex("determined", t)} x={1150} y={1030} s={1.5} flip t={t} jitter={2.6} prop="phone" />,
    { set: "set_bench2", dark: 0.2, red: () => 0.15 }),
  montage(100, (t, lt) => { const p = walk(lt * 8, SIDE, 1.1); return <Char id="m8" pose={P({ ...p, ...CARRY })} e={ex("determined", t)} x={mix(450, 1350, lt / 2)} y={1010} s={1.4} t={t} prop="box" />; },
    { set: "set_street", dark: 0.18, rain: true }),
  montage(102, (t, lt) => <>
    <DevilFig id="m9d" pose={lt > 0.85 && lt < 1.5 ? DEVIL_REACH : TQ} x={400} y={FY} s={1.6} t={t} face={lt > 0.85 ? "angry" : "mischievous"} />
    <Table t={t} clock={"2:40"} />
    <Char id="m9" pose={lt < 1.2 ? SEAT_RUB : SEAT_HOLD} e={ex(lt < 1.2 ? "tired" : "determined", t)} x={BX} y={FY} seat t={t} prop={lt < 1.2 ? null : "laptop"} typing={lt > 1.3} />
  </>, { set: "set_bedroom", dark: 0.5, red: () => 0.35 }),
  montage(104, (t) => <>
    <DevilFig id="m10d" pose={P({ ...FRONT, elR: [110, -300], wrR: [140, -350], elL: [-110, -300], wrL: [-140, -350] })} x={1350} y={1060} s={2.4} op={0.75} t={t} face="laughing" />
    <Char id="m10" pose={HOLD} e={ex("determined", t)} x={980} y={1040} s={1.6} flip t={t} jitter={2.6} prop="phone" />
  </>, { set: "set_bench", dark: 0.25, red: () => 0.25 }),
  montage(106, (t, lt) => <Char id="m11" pose={walk(lt * 11, SIDE, 1.45)} e={ex("determined", t)} x={mix(300, 1300, lt / 2)} y={1010} s={1.4} t={t} />,
    { set: "set_street", dark: 0.15, rain: true }),
  montage(108, (t, lt) => <Char id="m12" pose={walk(lt * 12, SIDE, 1.5)} e={ex("determined", t)} x={mix(1750, 300, lt / 2)} y={1010} s={1.4} flip t={t} />,
    { set: "set_street", dark: 0.2, rain: true, shake: () => 3 }),
  montage(110, (t) => <>
    <Table t={t} clock={"6:02"} />
    <DevilFig id="m13d" pose={TQ} x={400} y={FY} s={1.6} t={t} face="mischievous" />
    <Char id="m13" pose={FRONT} e={ex("tired", t, { blink: false })} x={720} y={FY} t={t} jitter={1.6} />
  </>, { set: "set_bedroom", dark: 0.45, red: () => 0.3, cam: () => [1.12, 720, 640] }),
  // 10 · the cost: the drawer lights up (the Friend); he ignores it — the empty chair — the Devil fills the room
  { t0: 112, t1: 115.6, set: "set_bedroom", dark: 0.5, red: () => 0.22,
    draw: (t) => <>
      <Table t={t} clock={"7:45"} buzz={k(t, [112.3, 112.5, 115, 115.4], [0, 1, 1, 0])} />
      <Char id="c10" pose={SEAT_HOLD} e={ex("determined", t, { lx: t > 113.2 && t < 114.2 ? 7 : 0, ly: t > 113.2 && t < 114.2 ? 5 : 0 })} x={BX} y={FY} seat t={t} prop="laptop" typing={t < 113.1 || t > 114.3} />
    </> },
  { t0: 115.6, t1: 118.4, set: "set_table", dark: 0.15, cam: (t) => [mix(1.0, 1.14, sm((t - 115.6) / 2.8)), 1470, 640], draw: () => null },
  { t0: 118.4, t1: 120, set: "set_bedroom", dark: 0.5, red: () => 0.3,
    draw: (t) => <>
      <DevilFig id="d10" pose={P({ ...FRONT, elR: [110, -300], wrR: [140, -350], elL: [-110, -300], wrL: [-140, -350] })} x={430} y={1000} s={2.3} op={0.9} t={t} face="mischievous" />
      <Table t={t} clock={"8:10"} />
      <Char id="c10b" pose={SEAT_HOLD} e={ex("determined", t)} x={BX} y={FY} seat t={t} prop="laptop" typing />
    </> },
  // 11 · day zero: rent and pharmacy paid; Mom's third text; he finally exhales
  { t0: 120, t1: 129, set: "set_bedroom", dark: 0.35, warm: (t) => 0.14 * sm((t - 124) / 2),
    draw: (t) => <>
      <DevilFig id="d11" pose={TQ} x={420} y={FY} s={1.4} op={0.85} glow={0.6} t={t} face="neutral" />
      <Table t={t} clock={"9:00"} />
      <Char id="c11" pose={t < 124.8 ? SEAT_HOLD : poseAt([{ t: 124.8, pose: SEAT_HOLD }, { t: 125.6, pose: SEAT_RELIEF }], t)}
        e={ex(t < 124 ? "determined" : "tired", t, { closed: t > 126 && t < 128.2 })} x={BX} y={FY} seat t={t}
        prop={t < 125 ? "laptop" : null} lid={1 - sm((t - 124) / 0.7)} />
    </> },
  // 12 · the reveal: he turns to face it; the same open hand; the smoke peels away; it is the Angel
  { t0: 129, t1: 150, set: "set_bedroom", dark: 0.55, red: (t) => 0.25 * (1 - sm((t - 135) / 2)), warm: (t) => 0.22 * sm((t - 136.4) / 1.5),
    cam: (t) => {
      if (t < 138.2) return [1.02, 700, 600];
      if (t < 141.5) return [mix(1.02, 1.45, sm((t - 138.2) / 2)), mix(700, 600, sm((t - 138.2) / 2)), mix(600, 520, sm((t - 138.2) / 2))];
      return [mix(1.45, 1.08, sm((t - 141.5) / 1.6)), mix(600, 560, sm((t - 141.5) / 1.6)), mix(520, 580, sm((t - 141.5) / 1.6))];
    },
    draw: (t) => {
      const turned = t >= 131.4;
      const bPose = turned ? SEAT : poseAt([{ t: 130.4, pose: SEAT }, { t: 131.3, pose: SEAT_BACK }], t);
      const tr = sm((t - 135) / 1.6);       // red -> gold, horns -> halo
      const shrink = sm((t - 136.6) / 1.6); // gold silhouette -> the Angel
      const flash = k(t, [136.3, 136.6, 137.6], [0, 1, 0]);
      const look = t > 146.5 && t < 148.2 ? 9 : t >= 148.2 ? -4 : 0;
      return <>
        <WallShadow x={430} y={mix(290, 300, tr)} s={mix(3.2, 1.6, tr)} horn={1 - tr} red={1 - tr} op={0.9} lit={mix(0.45, 0.5, tr)} />
        <Table t={t} clock={"9:04"} meds />
        <Paper x={560} y={1006} r={-10} stamp title="RENT" />
        <Paper x={480} y={1030} r={12} stamp title="PHARMACY" />
        {shrink < 0.999 && (
          <g opacity={1 - shrink}>
            <DevilFig id="d12" pose={t < 132 ? TQ : poseAt([{ t: 132, pose: TQ }, { t: 132.8, pose: DEVIL_REACH }], t)}
              x={400} y={mix(FY, FY - 260, shrink)} s={mix(1.45, 0.6, shrink)} t={t} face="neutral" horns={1 - tr}
              rim={lerpColor("#ff2d1f", "#ffd27a", tr)} fill={lerpColor("#090707", "#fff3d6", tr)} detailOp={1 - tr} glow={mix(1, 1.6, tr)} smoke={1 - tr} />
          </g>
        )}
        <Burst t={t} t0={135.1} x={400} y={700} />
        {shrink > 0.001 && <Angel x={430} y={mix(620, 520, shrink) + angelY(t) * shrink} s={mix(0.3, 1.0, shrink)} t={t} glow={1.3} reach={k(t, [138, 138.5, 140, 140.6], [0, 0.6, 0.6, 0])} />}
        <Char id="c12" pose={bPose} e={ex(t < 138 ? "worried" : "surprised", t, { ly: look, blink: t < 138 || t > 146 })} x={BX} y={FY} seat flip={turned} t={t} />
        <circle cx={430} cy={560} r={420} fill="#ffe0a0" opacity={0.55 * flash} filter="url(#bb30)" />
      </>;
    } },
  // 13 · "I heard you. I kept choosing tomorrow." The Angel settles beside him
  { t0: 150, t1: 156, set: "set_bedroom", dark: 0.45, warm: (t) => mix(0.22, 0.38, sm((t - 150) / 5)), cam: (t) => [mix(1.08, 1.15, sm((t - 150) / 6)), 600, 600],
    draw: (t) => {
      const settle = sm((t - 151) / 3);
      return <>
        <WallShadow x={430} y={300} s={1.6} horn={0} op={0.85} lit={0.45} />
        <Table t={t} clock={"9:05"} />
        <Paper x={560} y={1006} r={-10} stamp title="RENT" />
        <Paper x={480} y={1030} r={12} stamp title="PHARMACY" />
        <Angel x={mix(430, 500, settle)} y={mix(520, 640, settle) + angelY(t) * 0.5} s={mix(1.0, 0.8, settle)} t={t} glow={1.2} />
        <Char id="c13" pose={SEAT} e={ex(t < 153 ? "sad" : "neutral", t, { talk: t > 150.5 && t < 154.8 })} x={BX} y={FY} seat flip t={t} />
      </>;
    } },
];

const ShotView: React.FC<{ s: Shot; t: number }> = ({ s, t }) => {
  const [z, cx, cy] = s.cam ? s.cam(t) : [1 + 0.03 * ((t - s.t0) / (s.t1 - s.t0)), 960, 540];
  const sh = s.shake ? s.shake(t) : 0;
  const sx = Math.sin(t * 91) * sh, sy = Math.cos(t * 77) * sh;
  const red = s.red ? s.red(t) : 0, warm = s.warm ? s.warm(t) : 0, fl = s.flicker ? s.flicker(t) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${960 - cx * z + sx}px, ${540 - cy * z + sy}px) scale(${z})`, transformOrigin: "0 0" }}>
        {s.set && <Img src={staticFile(`poses/${s.set}.png`)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />}
        <AbsoluteFill style={{ background: "#05060a", opacity: s.dark ?? 0 }} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <BeanDefs />
          {s.draw(t)}
          {s.rain && <Rain t={t} />}
        </svg>
      </AbsoluteFill>
      {s.rain && <AbsoluteFill style={{ background: "rgba(40,70,140,0.18)", mixBlendMode: "screen" }} />}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,40,20,0) 25%, rgba(170,10,0,1) 100%)", opacity: red, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 50%, rgba(255,190,110,0.9) 0%, rgba(255,160,80,0) 60%)", opacity: warm, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fl }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ on-screen text and phone UI
const LINES: Line[] = [
  { t0: 17.4, t1: 20.9, who: "angel", text: "You don't have to solve everything tonight.", x: 1180, y: 200 },
  { t0: 21.1, t1: 24.6, who: "angel", text: "One step at a time.", x: 1180, y: 200 },
  { t0: 31.3, t1: 33.4, who: "angel", text: "Again?", x: 1150, y: 230 },
  { t0: 33.3, t1: 35.0, who: "bean", text: "Tomorrow.", x: 640, y: 330 },
  { t0: 49.2, t1: 52.0, who: "angel", text: "You can still take one step.", x: 1250, y: 250 },
  { t0: 52.2, t1: 55.8, who: "bean", text: "I keep taking one… then stopping.", x: 720, y: 360 },
  { t0: 73.3, t1: 75.4, who: "devil", text: "Then move.", x: 620, y: 190, size: 84 },
  { t0: 83.4, t1: 85.6, who: "devil", text: "Again.", x: 430, y: 200, size: 70 },
  { t0: 96.2, t1: 97.7, who: "devil", text: "Again.", x: 430, y: 200, size: 70 },
  { t0: 141.5, t1: 146.5, who: "angel", text: "You never listened when I was kind.", x: 560, y: 250 },
  { t0: 150.4, t1: 155.4, who: "bean", text: "I heard you. I kept choosing tomorrow.", x: 820, y: 330 },
];
const PAYMENTS: [number, number, string][] = [[88.6, 1200, "Repair contract"], [92.6, 150, "Delivery"], [98.6, 375, "Repairs"], [100.6, 300, "Delivery"], [106.6, 375, "Final job"]];
const earnedAt = (t: number) => PAYMENTS.reduce((a, [pt, amt]) => a + amt * sm((t - pt) / 0.6), 0);
const DAYS: [number, number][] = [[5, 30], [35.5, 30], [36.5, 26], [39.5, 26], [40.2, 22], [41.8, 22], [42.5, 18], [86, 18], [111, 0], [200, 0]];
const daysAt = (t: number) => Math.round(k(t, DAYS.map((d) => d[0]), DAYS.map((d) => d[1])));

export const Film03: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = SHOTS.find((s) => t >= s.t0 && t < s.t1);
  const devil = t >= 76 && t < 129;
  const daysOp = k(t, [5, 5.4, 128.2, 128.8], [0, 1, 1, 0]);
  const earnOp = k(t, [84, 84.4, 128.2, 128.8], [0, 1, 1, 0]);
  const earned = earnedAt(t);
  const slam = t >= 76.12 && t < 77.9;
  const slamS = 1.6 - 0.6 * sm((t - 76.12) / 0.16);
  const endA = k(t, [156.6, 157.4, 163.4, 163.9], [0, 1, 1, 0]);
  const endB = k(t, [159.2, 160.0, 163.4, 163.9], [0, 1, 1, 0]);
  const title = k(t, [164.0, 164.25, 165.5, 166], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      {shot && <ShotView s={shot} t={t} />}
      {LINES.map((l, i) => <LineView key={i} l={l} t={t} />)}
      <NoticeCard t={t} t0={3.25} t1={6} />
      <PhoneChat t={t} t0={6.6} t1={13.4} name="Mom" msg="My refill is due soon. Pay your rent first, sweetheart." />
      <PhoneChat t={t} t0={43.6} t1={48.8} name="Mom" msg="They won't refill it without payment. I'm out." />
      <PhoneChat t={t} t0={124.2} t1={128.8} name="Mom" msg="The refill came. Took today's dose. Thank you, sweetheart." />
      <MailCard t={t} t0={25.4} t1={27.9} ok />
      <MailCard t={t} t0={28.4} t1={30.9} ok={false} />
      <MailCard t={t} t0={41.1} t1={42.95} ok={false} count={3} />
      <MailCard t={t} t0={94.15} t1={95.4} ok={false} />
      {PAYMENTS.map(([pt, amt, label]) => <PayBanner key={pt} t={t} t0={pt - 0.3} t1={pt + 1.3} amount={`+${fmt$(amt)}`} label={label} />)}
      <LockBanner t={t} t0={112.5} t1={115.4} />
      <PayBanner t={t} t0={120.3} t1={123.7} amount="$1,800" label="Rent" paid />
      <PayBanner t={t} t0={121.4} t1={123.7} amount="$600" label="Pharmacy" paid top={230} />
      {daysOp > 0 && (
        <div style={{ position: "absolute", left: 64, top: 40, opacity: daysOp, fontFamily: "Avenir Next", color: devil || t >= 76 ? "#ff4a3a" : "#f1ece2",
          textShadow: t >= 76 ? "0 0 18px rgba(255,40,20,0.7)" : "0 2px 6px #000" }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, opacity: 0.85 }}>DAYS LEFT</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1 }}>{daysAt(t)}</div>
        </div>
      )}
      {earnOp > 0 && (
        <div style={{ position: "absolute", left: 64, top: 160, opacity: earnOp, fontFamily: "Avenir Next", textShadow: "0 2px 6px #000" }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: "#8fd4a5" }}>EARNED</div>
          <div style={{ fontSize: 50, fontWeight: 800, color: earned >= 2399.5 ? "#5be08a" : "#f1ece2" }}>{fmt$(earned)} <span style={{ fontSize: 30, color: "#8a8f9b" }}>/ $2,400</span></div>
        </div>
      )}
      {slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k(t, [76.12, 76.2, 77.5, 77.9], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(t * 90) * 6 * Math.exp(-(t - 76.1) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 190, letterSpacing: 26,
            color: "#ff3b2a", textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 6px 0 #3a0000", paddingLeft: 26 }}>DEVIL MODE</div>
        </AbsoluteFill>
      )}
      {t >= 156 && (
        <AbsoluteFill style={{ background: "#050507", alignItems: "center", justifyContent: "center", fontFamily: "Avenir Next" }}>
          <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontSize: 56, fontWeight: 600, color: "#f1ece2", opacity: endA }}>The voice was always the same.</div>
          <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontSize: 56, fontWeight: 600, color: "#ffd27a", opacity: endB, textShadow: "0 0 22px rgba(255,190,90,0.7)" }}>The choice was finally his.</div>
          <div style={{ opacity: title, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: 24, color: "#f1ece2", paddingLeft: 24 }}>DEVIL MODE</div>
            <div style={{ width: 380, height: 7, background: "#ff3b2a", marginTop: 12, boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      <Audio src={staticFile("audio/film03_mix.wav")} />
    </AbsoluteFill>
  );
};
