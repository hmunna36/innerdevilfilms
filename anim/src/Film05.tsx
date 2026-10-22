// FILM 02 — "JUST ONE MORE | The Phone Ate His Nights" (about 2:46). Story: films/02-just-one-more/STORY.md.
// Built like Film04: scenes are continuous functions of film time; cuts are camera set-ups over them; CutView draws
// any cut at any size. New here: the bed seen from the ceiling (film/bed.tsx), his phone seen from his eyes
// (film/phone.tsx), the textbook, calendar, exam paper and Dad's note (film/study.tsx), and the memory replay with
// the Angel and the Devil gone (the reveal: nobody else was ever there).
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import type { Pose } from "./rig/figure";
import type { V2 } from "./rig/geom";
import { BC, BEAN_EXPR, BeanDefs, DevilSVG, buildBean } from "./rig/bean";
import type { BeanExpr } from "./rig/bean";
import { Angel } from "./rig/angel";
import { FRONT, SEAT, SIDE, TQ, poseAt, walk } from "./rig/beanPoses";
import { Char, DEVIL_LEAN, DevilFig, P, SEAT_BACK, SEAT_PHONE, SEAT_RELIEF, SEAT_RUB, Spark, ex, k, lerpColor, mix, sm } from "./film/kit";
import { CLOCK_XY, ChairAt, DK, DRAWER_XY, DeskDefs, DeskFront, DeskTop, FaceGlow, STL, ScreenInsert, plane } from "./film/desk";
import type { ScreenKind, V3 } from "./film/desk";
import { DOOR, DoorDefs, FloorLetter, LowFeet, ReachHand, letterPt } from "./film/door";
import type { LetterState } from "./film/door";
import { BedBase, BedDefs, Bedside, Blanket, Blinds, ChargeGlow, Charger, DevilOver, EarPhone, HeldPhone, LyingBean, OV, OV_CLOCK, OV_PHONE, PLUG_HAND, PLUG_PORT, PLUG_REST, PhoneLight, PhoneSmoke } from "./film/bed";
import { Alarm, Banner, Call, Chat, DeadGlass, Feed, Lock, PhoneView } from "./film/phone";
import type { ChatItem, Clip, Draft, Note, Thumb } from "./film/phone";
import { BookInsert, CalendarInsert, DadPhoto, DeskBook, DeskClutter, ExamInsert, StudyDefs } from "./film/study";

export const FILM5_SECONDS = 166;
const FPS = 30;

// ------------------------------------------------------------------ scenes and cuts (as in Film04)
type Scene = { set?: string; dark?: number | ((t: number) => number); red?: (t: number) => number; warm?: (t: number) => number;
  blur?: number; draw: (t: number) => React.ReactNode };
export type Cam = [number, number, number, number?];
export type Cut = { t0: number; t1: number; scene: Scene | null; cam: (t: number) => Cam; shake?: (t: number) => number; mem?: boolean };
const c = (z: number, x: number, y: number, r = 0) => (): Cam => [z, x, y, r];
const angelY = (t: number) => Math.sin(t * 1.3) * 16;

const BX = 640, FY = 960; // Bean's chair at the desk, the floor line
// at the desk (side view, facing the desk on the right)
const SEAT_TYPE = P({ ...SEAT, head: [50, -320], tilt: 14, elR: [70, -198], wrR: [118, -206], elL: [60, -199], wrL: [108, -208] });
const SEAT_REST = P({ ...SEAT_TYPE, head: [46, -320], tilt: 18, elR: [66, -197], wrR: [110, -200], elL: [56, -198], wrL: [100, -202] });
const SEAT_READ = P({ ...SEAT_TYPE, head: [58, -312], tilt: 26 });
const SEAT_WRITE = P({ ...SEAT_READ, elR: [74, -196], wrR: [126, -200] });
const SEAT_SLUMP = P({ ...SEAT_PHONE, head: [60, -296], tilt: 30, top: [32, -228], elR: [56, -186], wrR: [70, -232], elL: [44, -186], wrL: [62, -228] });
const SEAT_SLUMP2 = P({ ...SEAT_SLUMP, head: [70, -276], tilt: 36, top: [40, -214], bot: [6, -96] });
const SEAT_GRAB = P({ ...SEAT, head: [54, -318], tilt: 16, elR: [90, -206], wrR: [140, -214], elL: [76, -206], wrL: [126, -214] }); // reaching for the phone on the desk
const HEAD_DROP = P({ ...SEAT_READ, head: [70, -292], tilt: 44 });
const SEAT_LOOKBACK = P({ ...SEAT_READ, t: -0.6, head: [40, -318], tilt: -4 });
const SEAT_LAUGH = P({ ...SEAT_PHONE, head: [44, -326], tilt: 4 });
const ARMS_UP = P({ ...FRONT, elR: [120, -300], wrR: [150, -360], elL: [-120, -300], wrL: [-150, -360] });
const RISE0 = P({ ...SIDE, head: [40, -300], tilt: 30, top: [20, -240], bot: [0, -120], knL: [30, -80], knR: [36, -80], elR: [40, -200], wrR: [70, -170] });

// a phone lying face up on the desk (desk 3/4 view); lit = its screen
const DeskPhone: React.FC<{ x: number; z: number; lit: number; r?: number }> = ({ x, z, lit, r = 14 }) => {
  const o: V2 = [x, DK.y];
  const a = (r * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
  const du: V3 = [cs, 0, sn], dv: V3 = [-sn, 0, cs];
  return (
    <g>
      {lit > 0.01 && <ellipse cx={x} cy={DK.y + z * STL - 4} rx={70} ry={26} fill="#9fbcff" opacity={0.35 * lit} filter="url(#bb10)" />}
      <g transform={plane(o, [-14 * cs + 26 * sn, 0.6, z - 14 * sn - 26 * cs], du, dv)}>
        <rect x={0} y={0} width={28} height={52} rx={6} fill="#15171c" stroke="#3a3e48" strokeWidth={1.6} />
        <rect x={2.5} y={2.5} width={23} height={47} rx={4} fill={lit > 0.01 ? "#a9c8ff" : "#0b0c10"} opacity={lit > 0.01 ? 0.25 + 0.7 * lit : 1} />
      </g>
    </g>
  );
};
// a black Devil hand with a red rim: forearm from `from` to the mitten at (x, y)
const DevilHand: React.FC<{ x: number; y: number; from: V2; s?: number; rot?: number; grip?: number }> = ({ x, y, from, s = 1, rot, grip = 0 }) => {
  const dir = Math.atan2(y - from[1], x - from[0]);
  const lw = 64 * s, nx = -Math.sin(dir) * lw / 2, ny = Math.cos(dir) * lw / 2;
  const ex2 = x - Math.cos(dir) * 26 * s, ey2 = y - Math.sin(dir) * 26 * s;
  const arm = `M${(from[0] + nx).toFixed(1)},${(from[1] + ny).toFixed(1)} L${(ex2 + nx).toFixed(1)},${(ey2 + ny).toFixed(1)} L${(ex2 - nx).toFixed(1)},${(ey2 - ny).toFixed(1)} L${(from[0] - nx).toFixed(1)},${(from[1] - ny).toFixed(1)} Z`;
  const r = rot ?? (dir * 180) / Math.PI - 90;
  const mit = "M0,-46 C28,-46 42,-24 42,4 C42,32 24,50 0,50 C-24,50 -40,32 -40,4 C-40,-24 -28,-46 0,-46 Z";
  const thumb = `M-28,${10 - grip * 14} C-48,${4 - grip * 10} -54,${28 - grip * 6} -37,${40 - grip * 8} C-28,${46 - grip * 8} -20,${34 - grip * 12} -20,${22 - grip * 12} Z`;
  return (
    <g>
      <g filter="url(#bb12)" opacity={0.85}><path d={arm} fill="none" stroke="#ff2d1f" strokeWidth={16} />
        <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}><path d={mit} fill="none" stroke="#ff2d1f" strokeWidth={14} /></g></g>
      <path d={arm} fill="#090707" stroke="#ff2d1f" strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
        <path d={mit} fill="#090707" stroke="#ff2d1f" strokeWidth={4} />
        <path d={thumb} fill="#090707" stroke="#ff2d1f" strokeWidth={3.5} strokeLinejoin="round" />
      </g>
    </g>
  );
};
// Bean as a dark silhouette (in the doorway, against the hallway light)
const Silhouette: React.FC<{ pose: Pose; x: number; y: number; s: number; id: string; rim?: string }> = ({ pose, x, y, s, id, rim = "#ffcf8a" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <DevilSVG items={buildBean(pose, BEAN_EXPR.neutral, { idp: id, devil: false, view: pose.t === 0 ? "front" : "side", contact: false })} glow={0.6} rim={rim} fill="#120d0a" detailOp={0} />
  </g>
);

// ------------------------------------------------------------------ the desk around Bean (bedroom set)
type DeskSt = { clock: string; lid?: number; screen?: ScreenKind; ts?: number; drawer?: number; on?: number;
  book?: { x: number; z: number; frac: number; hl?: number; open?: boolean }; phone?: { x: number; z: number; lit: number }; mugs?: number; cards?: number };
const DAD = <DadPhoto x={1000} y={DK.y - 40 * STL - 31} />;
const deskBack = (t: number, d: DeskSt) => (
  <DeskTop t={t} clock={d.clock} lid={d.lid ?? 0} screen={d.screen ?? "off"} ts={d.ts ?? 0} on={d.on ?? 1} bills={false} photo={DAD}
    under={<DeskClutter mugs={d.mugs ?? 0} cards={d.cards ?? 0} />}
    over={<>
      {d.book && <DeskBook x={d.book.x} z={d.book.z} frac={d.book.frac} hl={d.book.hl ?? 0} open={d.book.open ?? true} s={1.25} />}
      {d.phone && <DeskPhone x={d.phone.x} z={d.phone.z} lit={d.phone.lit} />}
    </>} />
);
const deskFront = (t: number, d: DeskSt) => <DeskFront t={t} drawer={d.drawer ?? 0} />;
const litOf = (d: DeskSt) => (d.screen && d.screen !== "off" ? sm(((d.lid ?? 0) - 0.35) / 0.3) * (d.on ?? 1) : 0);
const glowAt = (p: Pose, amt: number, col?: number) => <FaceGlow x={BX + (p.head[0] + 44) * 1.3} y={FY + (p.head[1] + 10) * 1.3} amount={amt * (col ?? 1)} />;
type AtO = { typing?: boolean; flip?: boolean; tear?: number; prop?: "phone" | null; before?: React.ReactNode; after?: React.ReactNode; propLit?: number; jitter?: number; glow?: number };
const atDesk = (t: number, d: DeskSt, id: string, pose: Pose, e: BeanExpr, o: AtO = {}) => <>
  {deskBack(t, d)}
  {o.before}
  <Char id={id} pose={pose} e={e} x={BX} y={FY} seat t={t} typing={o.typing} flip={o.flip} tear={o.tear ?? 0} prop={o.prop ?? null} propLit={o.propLit ?? 1} jitter={o.jitter ?? 0} />
  {deskFront(t, d)}
  {!o.flip && glowAt(pose, Math.max(litOf(d), o.glow ?? 0))}
  {o.after}
</>;
const bed = (draw: (t: number) => React.ReactNode, dark = 0.5, red?: (t: number) => number): Scene => ({ set: "set_bedroom", dark, red, draw });
const insert = (draw: (t: number) => React.ReactNode, red?: (t: number) => number): Scene => ({ red, draw });
const BOOK0 = { x: 900, z: 46, frac: 0.02 };

// ------------------------------------------------------------------ the bed from above
type BedSt = { clock: string; e: BeanExpr; lit?: number; phone?: "held" | "chest" | "none" | "high" | "ear"; h?: number; day?: number; angel?: { x: number; y: number; s: number; ember?: number; reach?: number };
  plug?: { at: [number, number]; held?: boolean; swing?: number; ang?: number } | null; devilY?: number | null; smoke?: number; tear?: number; flicker?: number; phoneDown?: boolean; dead?: boolean; oneHand?: boolean; arms?: boolean };
const BedView: React.FC<{ t: number; s: BedSt; id: string }> = ({ t, s, id }) => {
  const lit = s.lit ?? 1;
  const ph = s.phone ?? "held";
  return <>
    <BedBase day={s.day ?? 0} />
    <Bedside clock={s.clock} phoneDown={s.phoneDown} />
    {s.phoneDown && <ChargeGlow t={t} />}
    <LyingBean id={id} t={t} e={s.e} tear={s.tear ?? 0} />
    <Blanket day={s.day ?? 0} />
    {s.plug && <Charger plug={s.plug.at} held={s.plug.held} swing={s.plug.swing ?? 0} ang={s.plug.ang ?? -100} t={t} />}
    {ph === "high" && <>
      {/* arms up from under the blanket to the phone held over his face */}
      {[-1, 1].map((sd) => <path key={sd} d={`M${OV.x + sd * 92},${OV.y + 190} Q${OV.x + sd * 120},${OV.y + 120} ${OV.x + sd * 96},${OV.y + 70}`} stroke={BC.line} strokeWidth={50} strokeLinecap="round" fill="none" />)}
      {[-1, 1].map((sd) => <path key={`b${sd}`} d={`M${OV.x + sd * 92},${OV.y + 190} Q${OV.x + sd * 120},${OV.y + 120} ${OV.x + sd * 96},${OV.y + 70}`} stroke={BC.skin} strokeWidth={42} strokeLinecap="round" fill="none" />)}
    </>}
    {(ph === "held" || ph === "chest") && <HeldPhone t={t} lit={ph === "chest" ? 0 : lit} y={ph === "chest" ? OV_PHONE[1] + 46 : OV_PHONE[1]} rot={ph === "chest" ? 4 : -6} dead={s.dead} oneHand={s.oneHand} />}
    {ph === "high" && <HeldPhone t={t} lit={lit} h={s.h ?? 1} />}
    {ph === "ear" && <EarPhone t={t} />}
    {s.smoke !== undefined && <PhoneSmoke t={t} amount={s.smoke} />}
    <Blinds amount={s.day ?? 0} />
    <PhoneLight lit={ph === "held" || ph === "high" ? lit : 0} flicker={s.flicker ?? 0} />
    {s.angel && <Angel x={s.angel.x} y={s.angel.y} s={s.angel.s} t={t} ember={s.angel.ember ?? 0} reach={s.angel.reach ?? 0} smile={0.8} />}
    {s.devilY !== undefined && s.devilY !== null && <DevilOver id={`${id}d`} t={t} y={s.devilY} />}
  </>;
};
const over = (st: (t: number) => BedSt, id: string, red?: (t: number) => number): Scene => ({ red, draw: (t) => <BedView t={t} s={st(t)} id={id} /> });

// ================================================================== the scenes
// 0 · cold open: the climax (the same moment as 79.6-82.0), three seconds
const CLIMAX = (t: number): BedSt => ({ clock: "4:12", e: ex("surprised", t, { blink: false, ly: -7 }), lit: 0, dead: true, oneHand: true,
  plug: { at: PLUG_PORT, held: true }, smoke: 0.85, devilY: 7 });
const S_COLD_BED = over((t) => CLIMAX(t), "cold", () => 0.55);
const S_POVDARK: Scene = { set: "set_bedroom", dark: 0.82, blur: 12, red: (t) => (t < 1.0 ? 0 : 0.45), draw: () => null };

// 1 · the want: the calendar; Dad's texts; the book
const S_CAL1 = insert((t) => <CalendarInsert t={t} circle={sm((t - 4.75) / 0.9)} write={sm((t - 5.7) / 0.9)} marker={t < 6.75} />);
const S_DESK1 = bed((t) => {
  const putDown = sm((t - 14.95) / 0.35);
  const pose = t < 14.9 ? SEAT_PHONE : poseAt([{ t: 14.9, pose: SEAT_PHONE }, { t: 15.25, pose: SEAT_GRAB }, { t: 15.5, pose: SEAT_TYPE }], t);
  const open = t > 15.45;
  return atDesk(t, { clock: "11:40", book: { ...BOOK0, open, frac: 0.02 }, phone: putDown > 0.95 ? { x: 1030, z: 70, lit: 0 } : undefined }, "d1", pose,
    ex(t < 7.6 ? "neutral" : t < 14.9 ? "worried" : "determined", t, { ly: 4 }),
    { prop: putDown < 0.95 ? "phone" : null, propLit: sm((t - 6.9) / 0.1), jitter: t > 6.9 && t < 7.4 ? 1.4 : 0 });
}, 0.5);
const S_POV: Scene = { set: "set_bedroom", dark: 0.6, blur: 12, draw: () => null };
export const CHAT_A: ChatItem[] = [
  { t: 0, sep: true, text: "Friday 11:40 PM" },
  { t: 7.9, text: "Night shift again." },
  { t: 9.9, text: "Pass the exam. I can't do one more year of night shifts." },
  { t: 13.25, me: true, text: "I'll pass it. I promise." },
];
const DRAFT_A: Draft[] = [{ t0: 11.5, t1: 12.8, text: "I'll pass it. I promise." }];
const S_BOOK12 = insert((t) => <BookInsert t={t} page={12} hand={false} />);

// 2 · the Angel's comfort
const S_DESK2 = bed((t) => {
  const bloom = sm((t - 19.6) / 0.6);
  const sp = sm((t - 19.2) / 1.0);
  // her wing pushes the phone across the desk to his hand; he picks it up
  const slide = sm((t - 24.0) / 1.0);
  const px = mix(1030, 905, slide), pz = mix(70, 62, slide);
  const holding = t > 25.75;
  let pose: Pose = t < 18.2 ? SEAT_READ : t < 18.9 ? poseAt([{ t: 18.2, pose: SEAT_READ }, { t: 18.4, pose: SEAT_RUB }], t) : poseAt([{ t: 18.9, pose: SEAT_RUB }, { t: 19.3, pose: SEAT_READ }], t);
  if (t > 20.6) pose = poseAt([{ t: 20.6, pose: SEAT_READ }, { t: 21.0, pose: SEAT_REST }], t);
  if (t > 25.2) pose = poseAt([{ t: 25.2, pose: SEAT_REST }, { t: 25.55, pose: SEAT_GRAB }, { t: 25.95, pose: SEAT_PHONE }], t);
  const e = t < 19.6 ? ex("tired", t, { ly: 5 }) : t < 22.6 ? ex("tired", t, { lx: 6, ly: -2 }) : ex(t < 25.2 ? "neutral" : "tired", t, { lx: 4, ly: 3 });
  const reach = k(t, [23.7, 24.0, 25.0, 25.3], [0, 1, 1, 0]);
  const ax = t < 23.6 ? 1190 : mix(1190, 1105, sm((t - 23.6) / 0.4)), ay = t < 23.6 ? 440 : mix(440, 560, sm((t - 23.6) / 0.4));
  return <>
    {atDesk(t, { clock: "11:52", book: { ...BOOK0, frac: 0.02 }, phone: holding ? undefined : { x: px, z: pz, lit: t > 18.9 ? 1 : 0 } }, "d2", pose, e,
      { prop: holding ? "phone" : null, propLit: 1, glow: holding ? 0.8 : 0 })}
    {t > 19.2 && t < 20.4 && <Spark x={mix(900, 1190, sp) + Math.cos(t * 4) * 70 * (1 - sp)} y={mix(170, 440, sp) + Math.sin(t * 4) * 50 * (1 - sp)} op={1 - bloom} />}
    {t >= 19.6 && <Angel x={ax} y={ay + angelY(t)} s={0.9 * bloom} t={t} reach={reach} />}
  </>;
}, 0.45);
const S_LAUGH = bed((t) => atDesk(t, { clock: "12:20", book: { ...BOOK0, frac: 0.02 } }, "lau", SEAT_LAUGH,
  { ...BEAN_EXPR.neutral, lid: 0.62, bi: -2, bo: -4, mc: 8, mw: 26, bags: 0.8, ly: 4, lx: 3 }, { prop: "phone", glow: 0.9, jitter: 1.2 }), 0.5);
const S_EAR = bed((t) => <>
  {atDesk(t, { clock: "12:02", book: { ...BOOK0, frac: 0.02 } }, "ear", SEAT_PHONE, ex("tired", t, { ly: 5, lx: 3 }), { prop: "phone", glow: 0.9 })}
  <Angel x={860} y={450 + angelY(t) * 0.4} s={0.6} t={t} smile={1} />
</>, 0.5);
const lapse = (clock: string, pose: Pose, id: string) => bed((t) => atDesk(t, { clock, book: { ...BOOK0, frac: 0.02 } }, id, pose, ex("tired", t, { ly: 5, lx: 3 }), { prop: "phone", glow: 0.95 }), 0.6);
const clockShot = (clock: string, extra: Partial<DeskSt> = {}, dark = 0.6, red?: (t: number) => number) => bed((t) => <>
  {deskBack(t, { clock, book: { ...BOOK0, frac: 0.02 }, ...extra })}{deskFront(t, { clock })}<ChairAt x={BX} y={FY} />
</>, dark, red);
const S_CLOCK1 = clockShot("12:41"), S_CLOCK2 = clockShot("1:37"), S_CLOCK3 = clockShot("2:52");
const S_LAPSE1 = lapse("12:58", SEAT_SLUMP, "lp1"), S_LAPSE2 = lapse("2:10", SEAT_SLUMP2, "lp2");
// the phone drops on his face
const S_BONK = over((t) => {
  const fall = k(t, [37.25, 37.42], [0, 1]), lift = sm((t - 38.0) / 0.5);
  const bounce = fall >= 1 ? Math.abs(Math.sin((t - 37.42) * 18)) * Math.exp(-(t - 37.42) * 9) * 0.12 : 0;
  const h = t < 37.25 ? 1 : t < 38.0 ? mix(1, 0.08, fall) + bounce : mix(0.08, 1, lift);
  const hit = t > 37.42 && t < 38.3;
  return { clock: "3:30", e: ex(hit ? "angry" : "tired", t, { closed: hit, ly: -4 }), phone: "high", h, lit: 1 };
}, "bonk");
// morning, the alarm
const S_MORNING = over((t) => ({ clock: "9:00", e: ex("tired", t, { closed: true }), phone: "chest", lit: 0, day: 1,
  angel: { x: 760, y: 200 + angelY(t) * 0.4, s: 0.5 } }), "morn");
const S_POVDAY: Scene = { set: "set_bedroom", dark: 0.15, blur: 12, warm: () => 0.15, draw: () => null };

// 3 · the days slip
const S_CAL2 = insert((t) => <CalendarInsert t={t} crossed={Math.min(3, Math.floor((t - 43.2) / 0.32) + 1)} />);
const S_BOOK12B = insert((t) => <BookInsert t={t} page={12} hand={false} tired={0.4} />);

// 4 · the low point (3:12 AM)
const S_312 = over((t) => ({ clock: "3:12", e: ex("tired", t, { ly: 6 }), phone: "held", lit: 1 }), "b312");
const S_CHEST = over((t) => ({ clock: "3:14", e: ex("sad", t, { ly: -8, blink: t > 60 }), phone: "chest", lit: 0 }), "chest");
const S_ANGEL_LOW = over((t) => ({ clock: "3:15", e: ex("sad", t, { ly: -6, lx: -4 }), phone: "chest", lit: 0, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.55, reach: k(t, [61.3, 61.7, 63.0, 63.4], [0, 0.6, 0.6, 0]) } }), "alow");
const S_ONEMORE = over((t) => ({ clock: "4:11", e: ex("tired", t, { talk: t > 65.1 && t < 65.9, ly: 6 }), phone: "held", lit: 1, angel: { x: 770, y: 210, s: 0.5 } }), "one");

// 5 · the turn (one continuous night, from the ceiling)
const TURN = (t: number): BedSt => {
  const ember = sm((t - 67.9) / 1.2);
  const push = sm((t - 68.6) / 1.4);                       // the ember pushes the plug to his hand
  const take = sm((t - 70.5) / 0.9);                       // his hand takes it toward the port
  const drop = t > 82.15;
  let plug: [number, number] = [mix(PLUG_REST[0], PLUG_HAND[0], push), mix(PLUG_REST[1], PLUG_HAND[1], push)];
  if (t > 70.5) plug = [mix(PLUG_HAND[0], PLUG_PORT[0], take), mix(PLUG_HAND[1], PLUG_PORT[1], take)];
  if (drop) plug = [PLUG_PORT[0] + 6, PLUG_PORT[1] + 26 * sm((t - 82.15) / 0.18)];
  const flick = t < 69.0 ? (Math.sin(t * 40) > 0.3 ? 0.6 : 0) * (1 - ember) : 0;
  const eOut = drop ? sm((t - 82.4) / 0.3) : 0;
  const devilIn = sm((t - 77.3) / 1.9);
  const e = t < 72 ? ex("worried", t, { ly: 4 }) : t < 77.3 ? ex("worried", t, { blink: false, ly: 6 }) : t < 83.0 ? ex("surprised", t, { blink: false, ly: -7 })
    : ex("determined", t, { blink: false, red: 1, ly: -7 });
  return { clock: "4:12", e, lit: 0, dead: true, phone: "held", oneHand: t > 70.5,
    plug: { at: plug, held: t > 70.5 && !drop, swing: drop ? Math.exp(-(t - 82.3) * 3) : 0, ang: drop ? -60 : -100 },
    angel: eOut < 1 ? { x: t < 68.6 ? 1215 + 40 : plug[0] + 40, y: (t < 68.6 ? PLUG_REST[1] : plug[1]) - 10 + (t < 68.6 ? mix(-300, 0, ember) : 0), s: 0.6 * (1 - eOut), ember: Math.max(ember, 0) } : undefined,
    flicker: flick, smoke: t > 75.2 ? sm((t - 75.2) / 1.6) : undefined, devilY: t > 77.3 ? mix(-420, 7, devilIn) : null };
};
const S_TURN = over(TURN, "turn", (t) => (t < 75.2 ? 0.1 * sm((t - 72) / 3) : 0.2 + 0.35 * sm((t - 75.2) / 2)));
// 83.0-83.6: a hard freeze on his opened hand, the red draining to black
const S_FREEZE: Scene = { draw: (t) => <>
  <BedView t={82.98} s={TURN(82.98)} id="frz" />
  <rect x={-400} y={-300} width={2720} height={1680} fill="#000" opacity={0.85 * sm((t - 83.05) / 0.45)} />
</>, red: () => 0.55 };

// 6 · the drop and Devil mode
const S_DROP = bed((t) => <>
  {deskBack(t, { clock: "4:13", book: { ...BOOK0, frac: 0.02 } })}
  {deskFront(t, { clock: "4:13" })}
  <ChairAt x={BX} y={FY} />
  <DevilFig id="drop" pose={ARMS_UP} x={420} y={FY} s={1.8} t={t} glow={1.7} face="laughing" />
  <Char id="drop" pose={poseAt([{ t: 83.65, pose: RISE0 }, { t: 84.2, pose: FRONT }], t)}
    e={ex("determined", t, { red: k(t, [83.7, 83.9, 85.2, 86.0], [0, 1, 1, 0]), blink: false })} x={720} y={1010} s={1.4} t={t} />
</>, 0.55, (t) => mix(0.7, 0.4, sm((t - 83.6) / 1.5)));
// the drawer: his hand puts the phone in; the Devil's hand lands on his and they push it shut (an insert at the drawer)
const drawerShot = (t: number, t0: number, devil: boolean) => {
  const put = sm((t - t0) / 0.35);                      // the phone goes in
  const push = sm((t - t0 - 0.62) / 0.22);              // the drawer shuts
  const dr = 1 - push;
  const hand: V2 = t < t0 + 0.45 ? [mix(1000, 1050, put), mix(560, 760, put)] : [mix(1050, 1040, sm((t - t0 - 0.45) / 0.15)), mix(760, 790, sm((t - t0 - 0.45) / 0.15)) - push * 4];
  const top = sm((t - t0 - 0.38) / 0.18);
  return <>
    {deskBack(t, { clock: "4:13", book: { ...BOOK0, frac: 0.02 } })}
    <ChairAt x={BX} y={FY} />
    {deskFront(t, { clock: "4:13", drawer: dr })}
    {t < t0 + 0.42 && (
      <g transform={`translate(${hand[0]},${hand[1] - 40}) rotate(${put * 70})`}><rect x={-17} y={-30} width={34} height={60} rx={7} fill="#121318" stroke="#2b2d35" strokeWidth={2} /></g>
    )}
    <ReachHand x={hand[0]} y={hand[1]} from={[780, 300]} k={0.8} grip={0.3} />
    {devil ? (top > 0.01 && <DevilHand x={hand[0] + 14} y={hand[1] - 46 * top - 6 + (1 - top) * -120} from={[1260, 320]} s={0.85} grip={0.5} />)
      : (top > 0.01 && <ReachHand x={hand[0] + 16} y={hand[1] - 40 + (1 - top) * -120} from={[1250, 300]} k={0.8} grip={0.5} />)}
  </>;
};
const S_DRAWER = bed((t) => drawerShot(t, 87.2, true), 0.55, () => 0.35);
const S_DRAWER_MEM = bed((t) => drawerShot(t - 135.4 + 87.2 + 0.3, 87.2, false), 0.4);
const MONT = (t: number): DeskSt => {
  // the desk during Devil mode: the book further on, the laptop open, mugs and cards piling up
  const frac = t < 89.6 ? 0.02 : t < 95.8 ? 0.08 : t < 107.4 ? 0.35 : t < 110.1 ? 0.76 : 1;
  const mugs = t < 92 ? 0 : t < 97 ? 1 : t < 101 ? 3 : t < 108 ? 4 : 6;
  return { clock: "5:00", lid: 1, screen: "quiz42", ts: 93.5, book: { x: 990, z: 52, frac, hl: 0.6 }, mugs, cards: t < 92 ? 0 : t < 100 ? 5 : 10 };
};
const S_M1 = bed((t) => {
  const pose = poseAt([{ t: 88.4, pose: SEAT_REST }, { t: 88.75, pose: SEAT_WRITE }], t);
  return atDesk(t, { ...MONT(t), clock: "4:20", lid: sm((t - 88.6) / 0.4) }, "m1", pose, ex("determined", t, { ly: 4 }),
    { typing: t > 88.8, before: <DevilFig id="m1d" pose={DEVIL_LEAN} x={430} y={FY} s={1.55} lean={10} t={t} face="mischievous" /> });
}, 0.5, () => 0.32);
const S_HL1 = insert((t) => <BookInsert t={t} page={48} hl={sm((t - 89.8) / 0.85)} red={0.6} />, () => 0.2);
const S_CLOCK5 = clockShot("5:00", { lid: 1, screen: "quiz42", ts: 0 }, 0.6, () => 0.3);
// his hand drifts to the drawer by reflex; the Devil's hand clamps his wrist
const S_WRIST = bed((t) => {
  const drift = sm((t - 91.7) / 0.7);
  const grab = sm((t - 92.35) / 0.15);
  const hand: V2 = [mix(860, 1036, drift) - grab * 28, mix(700, 786, drift) - grab * 10];
  return <>
    {deskBack(t, { ...MONT(t), clock: "5:12" })}
    <ChairAt x={BX} y={FY} />
    {deskFront(t, { clock: "5:12" })}
    <ReachHand x={hand[0]} y={hand[1]} from={[560, 560]} k={0.8} grip={0} />
    {grab > 0.01 && <DevilHand x={hand[0] - 64} y={hand[1] - 10} from={[700, 1200]} s={0.9} grip={1} rot={-20} />}
  </>;
}, 0.5, () => 0.35);
const S_QUIZ = (score: number, ts: number) => insert((t) => <ScreenInsert kind={`quiz${score}` as ScreenKind} t={t} ts={ts} />, () => 0.18);
const S_NOD = bed((t) => {
  const lift = sm((t - 95.0) / 0.45);
  const pose = t < 95.0 ? HEAD_DROP : poseAt([{ t: 95.0, pose: HEAD_DROP }, { t: 95.45, pose: SEAT_READ }], t);
  const chin: V2 = [BX + 86 * 1.3, FY - 262 * 1.3 + (1 - lift) * 26];
  return atDesk(t, { ...MONT(t), clock: "1:15", screen: "quiz42" }, "nod", pose,
    ex(t < 95.1 ? "tired" : "surprised", t, { closed: t < 95.05, blink: false, ly: 4 }),
    { before: <DevilFig id="nodd" pose={TQ} x={420} y={FY} s={1.6} t={t} face="angry" />,
      after: t > 94.75 && <DevilHand x={chin[0]} y={chin[1] + 30} from={[470, 690]} s={0.75} grip={0.6} rot={-60} /> });
}, 0.5, () => 0.35);
const S_FLIP = insert((t) => <BookInsert t={t} page={210} flip={((t - 95.8) * 2.4) % 1} hand={false} red={0.6} />, () => 0.2);
const S_CLOCK240 = clockShot("2:40", { lid: 1, screen: "quiz67", ts: 0, mugs: 3, cards: 5 }, 0.6, () => 0.3);
const S_CALX = insert((t) => <CalendarInsert t={t} crossed={6} xDay={{ day: 14, u: sm((t - 98.75) / 0.8) }} marker />, () => 0.15);

// 7 · the knock (Thursday evening): the door from inside, the boots, three knocks; at the desk; the note
const KNOCKS = [100.25, 100.7, 101.15];
const knockJolt = (t: number) => KNOCKS.reduce((a, kt) => a + (t > kt ? Math.exp(-(t - kt) * 22) : 0), 0);
const BootShadows: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const arrive = sm((t - t0) / 0.35), leave = sm((t - t1) / 0.6);
  const op = arrive * (1 - leave);
  if (op < 0.01) return null;
  const dx = leave * 300 - (1 - arrive) * 160;
  return (
    <g opacity={op}>
      {[952, 1020].map((x0, i) => {
        const x = x0 + dx + (i ? Math.sin(t * 2.1) * 2 : 0);
        return (
          <g key={i}>
            <path d={`M${x - 40},581 L${x - 34},565 L${x + 30},565 L${x + 40},581 Z`} fill="#070302" filter="url(#bb3)" />
            <rect x={x - 34} y={584} width={68} height={260} fill="url(#doorStreak)" filter="url(#bb6)" />
          </g>
        );
      })}
    </g>
  );
};
const Jacket: React.FC<{ t: number }> = ({ t }) => {
  const sw = KNOCKS.reduce((a, kt) => a + (t > kt ? Math.sin((t - kt) * 16) * Math.exp(-(t - kt) * 3.2) * 4 : 0), 0);
  return (
    <g transform={`rotate(${sw} 1046 206)`}>
      <circle cx={1046} cy={206} r={6} fill="#8a7a60" />
      <path d="M1046,210 L1000,236 C984,246 978,262 978,286 L974,420 L1010,424 L1016,300 L1022,430 L1072,430 L1076,300 L1084,424 L1118,420 L1114,286 C1114,262 1108,246 1092,236 Z" fill="#2c3a2a" stroke="#0d120c" strokeWidth={4} strokeLinejoin="round" />
      <path d="M1046,214 L1030,300 M1046,214 L1062,300" stroke="#18211a" strokeWidth={4} />
    </g>
  );
};
const Dust: React.FC<{ t: number }> = ({ t }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const kt = KNOCKS[i % 3];
    if (t < kt) continue;
    const u = t - kt;
    const x = 800 + ((i * 97) % 370), y = 572 - u * (30 + (i % 5) * 12) + u * u * 20;
    out.push(<circle key={i} cx={x + Math.sin(u * 3 + i) * 8} cy={y} r={2.2} fill="#ffd9a0" opacity={Math.max(0, 0.8 - u * 0.6)} />);
  }
  return <g>{out}</g>;
};
const NOTE_IN = (t: number): LetterState => {
  const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, (t - 105.2) / 0.7)), 3);
  return { u: mix(-20, -70, e), v: mix(-90, 260, e), rot: mix(0, 9, e) };
};
const NOTE_REST: LetterState = { u: -70, v: 260, rot: 9 };
const Fingertips: React.FC<{ t: number }> = ({ t }) => {
  const a = sm((t - 105.0) / 0.15) * (1 - sm((t - 105.6) / 0.2));
  if (a < 0.01) return null;
  const push = sm((t - 105.15) / 0.4) * 10;
  return <g opacity={a} clipPath="url(#underDoor)">{[-34, -8, 18].map((dx, i) => <ellipse key={i} cx={950 + dx} cy={578 + push} rx={11} ry={7} fill={BC.skin} stroke={BC.line} strokeWidth={2} />)}</g>;
};
const S_DOORK: Scene = { set: "set_door", dark: 0.12,
  draw: (t) => <>
    <Jacket t={t} />
    <BootShadows t={t} t0={99.95} t1={106.7} />
    {t > 100.2 && t < 102 && <Dust t={t} />}
    {t > 105.0 && <FloorLetter s={t > 106 ? NOTE_REST : NOTE_IN(t)} id="nk" note clipGap />}
    <Fingertips t={t} />
  </> };
const S_TURNHEAD = bed((t) => {
  const pose = t < 101.6 ? SEAT_WRITE : poseAt([{ t: 101.6, pose: SEAT_WRITE }, { t: 101.95, pose: SEAT_LOOKBACK }], t);
  return atDesk(t, { ...MONT(t), clock: "6:40", screen: "quiz67" }, "th", pose, ex(t < 101.6 ? "determined" : "worried", t, { blink: false, lx: 6 }), { typing: t < 101.6 });
}, 0.5, () => 0.3);
const S_LEAN = bed((t) => <>
  {atDesk(t, { ...MONT(t), clock: "6:41", screen: "quiz67" }, "ln", t < 104.2 ? SEAT_LOOKBACK : poseAt([{ t: 104.2, pose: SEAT_LOOKBACK }, { t: 104.6, pose: SEAT_WRITE }], t),
    ex(t < 104.2 ? "worried" : "determined", t, { blink: false, lx: 6 }), { typing: t > 104.6 })}
  <DevilFig id="lnd" pose={DEVIL_LEAN} x={mix(330, 470, sm((t - 102.4) / 0.6))} y={FY} s={1.7} lean={16} t={t} face="manipulative" flip={false} />
</>, 0.5, () => 0.38);
const S_RESUME = (page: number, t0: number) => insert((t) => <BookInsert t={t} page={page} hl={sm((t - t0) / 0.8)} red={0.6} />, () => 0.2);
const S_HUGE = bed((t) => atDesk(t, { ...MONT(t), clock: "3:30", screen: "quiz81", ts: 0 }, "hug", SEAT_WRITE, ex("determined", t, { ly: 4 }),
  { typing: true, before: <DevilFig id="huge" pose={ARMS_UP} x={430} y={1000} s={2.3} op={0.9} t={t} face="mischievous" /> }), 0.5, () => 0.3);
const S_SHUT = insert((t) => <BookInsert t={t} page={599} flip={sm((t - 110.3) / 0.5)} hand={false} red={0.4} />, () => 0.15);
const S_CLOCK658 = clockShot("6:58", { lid: 1, screen: "quiz81", ts: 0, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } }, 0.45, () => 0.25);
// his feet step over the note on his way out
const OUT_NEAR = [{ t: 112.45, u: 330 }, { t: 112.95, u: 60 }, { t: 113.45, u: -220 }];
const OUT_FAR = [{ t: 112.2, u: 380 }, { t: 112.7, u: 160 }, { t: 113.2, u: -100 }];
const S_STEPOVER: Scene = { set: "set_door", dark: 0.3, draw: (t) => <>
  <FloorLetter s={NOTE_REST} id="so" note clipGap={false} />
  <LowFeet t={t} near={OUT_NEAR} far={OUT_FAR} vNear={520} vFar={470} />
</> };

// 8 · the exam (Friday)
const S_CORRIDOR: Scene = { set: "set_corridor", dark: 0, red: () => 0.12,
  draw: (t) => {
    const X = mix(260, 1500, (t - 113.8) / 2.6);
    const p = walk((t - 113.8) * 11.5, SIDE, 1.45);
    const shadow = (dx: number, horns: boolean, op: number) => (
      <g transform={`translate(${X + dx},1012) scale(1.35,-0.42) skewX(-38)`} opacity={op}>
        <DevilSVG items={buildBean(p, BEAN_EXPR.neutral, { idp: horns ? "csd" : "csb", devil: horns, horns: horns ? 1 : 0, contact: false })} glow={0} rim="#120c0a" fill="#120c0a" detailOp={0} />
      </g>
    );
    return <>
      {shadow(40, false, 0.4)}
      {shadow(230, true, 0.55)}
      <Char id="cor" pose={p} e={{ ...ex("determined", t, { blink: false }), bags: 1, lid: 0.55 }} x={X} y={1012} s={1.35} t={t} />
    </>;
  } };
const S_EXAM = insert((t) => <ExamInsert t={t} t0={116.4} />);

// 9 · the result, the note, the cost (Friday evening)
const S_PASS = insert((t) => <ScreenInsert kind="pass" t={t} ts={119.3} />);
const S_RELIEF = bed((t) => {
  const pose = t < 121.3 ? SEAT_TYPE : t < 122.0 ? poseAt([{ t: 121.3, pose: SEAT_TYPE }, { t: 121.7, pose: SEAT_RELIEF }], t) : poseAt([{ t: 122.0, pose: SEAT_RELIEF }, { t: 122.4, pose: SEAT_BACK }], t);
  return atDesk(t, { clock: "8:40", lid: 1, screen: "pass", ts: 119.3, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } }, "rel", pose,
    ex(t < 122.0 ? "tired" : "worried", t, { closed: t > 121.5 && t < 122.0, blink: false }),
    { before: <DevilFig id="reld" pose={TQ} x={420} y={FY} s={1.45} op={0.85} glow={0.7} t={t} face="mischievous" /> });
}, 0.45, () => 0.15);
const PICK = (t: number): LetterState => ({ ...NOTE_REST, beta: 84 * sm((t - 123.85) / 0.25), h0: 300 * sm((t - 124.05) / 0.35) });
const S_PICK: Scene = { set: "set_door", dark: 0.15,
  draw: (t) => {
    const L = PICK(t);
    const edge = letterPt(L, 0, 1);
    const reach = sm((t - 123.4) / 0.35);
    const start: V2 = [1200, 120];
    const hand: V2 = [mix(start[0], edge[0] + 10, reach), mix(start[1], edge[1] - 34, reach)];
    return <>
      {t < 124.5 && <FloorLetter s={L} id="pk" note clipGap={false} />}
      {t > 123.4 && t < 124.5 && <ReachHand x={hand[0]} y={hand[1]} from={[1300, -200]} k={1.1} grip={sm((t - 123.8) / 0.08)} />}
    </>;
  } };
const S_CALLOOK = insert((t) => <CalendarInsert t={t} crossed={7} cake />);
// he opens the door: an empty, lit hallway
const S_OPEN: Scene = { set: "set_door", dark: 0.55,
  draw: (t) => {
    const op = sm((t - 131.8) / 0.6);
    const x0 = 792, x1 = 1178, y0 = 104, y1 = 577;
    return <>
      <clipPath id="doorHole"><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath>
      <g clipPath="url(#doorHole)" opacity={op}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#e9c58f" />
        <polygon points={`${x0},${y1} ${x1},${y1} ${x1 - 60},${y1 - 120} ${x0 + 60},${y1 - 120}`} fill="#b98d5c" />
        <rect x={x0 + 60} y={y0 + 60} width={x1 - x0 - 120} height={y1 - y0 - 180} fill="#f3d9ae" />
        <rect x={x0 + 150} y={y0 + 120} width={70} height={y1 - y0 - 240} fill="#d9b585" />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#hallGlow)" />
      </g>
      {/* the door panel, swung in toward the room */}
      <polygon points={`${x0},${y0} ${x0 + mix(386, 60, op)},${y0 - mix(0, 40, op)} ${x0 + mix(386, 60, op)},${y1 + mix(0, 60, op)} ${x0},${y1}`} fill="#2a1f19" stroke="#0d0907" strokeWidth={4} opacity={op > 0.02 ? 1 : 0} />
      <polygon points={`${x0},${y1} ${x1},${y1} ${x1 + 260},${y1 + 520} ${x0 - 260},${y1 + 520}`} fill="#ffcf8a" opacity={0.28 * op} filter="url(#bb12)" />
      <Silhouette pose={FRONT} x={985} y={y1 + 6} s={0.92} id="sil" />
      <g opacity={1 - sm((t - 132.6) / 1.4)}><DevilFig id="opd" pose={TQ} x={420} y={1000} s={1.5} op={0.6} glow={0.5} t={t} face="neutral" flip /></g>
    </>;
  } };

// 10 · the memory: three moments again, with nobody else there
const S_MEM_DESK = bed((t) => atDesk(t, { ...MONT(102), clock: "6:41", screen: "quiz67" }, "mem", SEAT_LOOKBACK, ex("determined", t, { talk: t > 136.6 && t < 137.6, lx: 6, blink: false })), 0.45);
const S_MEM_DOOR: Scene = { set: "set_door", dark: 0.15, draw: (t) => <BootShadows t={t} t0={130} t1={137.75} /> };
const S_GLASS: Scene = { set: "set_bedroom", dark: 0.82, blur: 12, draw: () => null };

// 11 · the end: the cable, the lock screen, the call, the sleep
const S_PLUGIN = over((t) => {
  const reach = sm((t - 139.3) / 0.6), plugIn = sm((t - 140.1) / 0.3);
  const at: [number, number] = [mix(PLUG_PORT[0] + 6, PLUG_PORT[0], reach), mix(PLUG_PORT[1] + 26, PLUG_PORT[1] - 22 * plugIn, reach)];
  return { clock: "9:58", e: ex("sad", t, { ly: 6 }), lit: plugIn > 0.5 ? 0.5 : 0, dead: plugIn < 0.5, phone: "held", oneHand: reach > 0.05, plug: { at, held: reach > 0.05 }, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.45 } };
}, "plg");
const S_CALL = over((t) => ({ clock: "10:12", e: { ...ex(t < 151.4 ? "sad" : "neutral", t, { talk: (t > 146.6 && t < 147.8) || (t > 151.5 && t < 152.6), ly: -2 }), mc: t > 149 ? 3 : 0 },
  phone: "ear", lit: 0, tear: t > 148.8 && t < 150.6 ? (t - 148.8) / 1.8 : 0, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.45 } }), "call");
const S_SLEEP = over((t) => ({ clock: "10:30", e: { ...ex("neutral", t, { closed: true }), mc: 2 }, phone: "none", lit: 0, phoneDown: true,
  angel: { x: 760, y: 205 + angelY(t) * 0.3, s: 0.42 } }), "slp");

// ================================================================== the cuts
const FACE: Cam = [2.3, OV.x, OV.y + 40];
const CLK: Cam = [3.0, CLOCK_XY[0], CLOCK_XY[1]];
export const CUTS: Cut[] = [
  // cold open (the POV shots are overlays: see PHONES)
  { t0: 0, t1: 1.9, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  { t0: 1.9, t1: 3.2, scene: S_COLD_BED, cam: (t) => [mix(1.55, 1.68, (t - 1.9) / 1.3), 960, 250, -3], shake: (t) => 6 * Math.exp(-(t - 1.95) * 5) },
  { t0: 3.2, t1: 4.6, scene: null, cam: c(1, 960, 540) },
  // the want
  { t0: 4.6, t1: 6.8, scene: S_CAL1, cam: (t) => [mix(1.05, 1.12, (t - 4.6) / 2.2), 980, 560] },
  { t0: 6.8, t1: 7.6, scene: S_DESK1, cam: c(2.0, 760, 610) },
  { t0: 7.6, t1: 14.8, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 14.8, t1: 16.0, scene: S_DESK1, cam: c(1.7, 820, 640) },
  { t0: 16.0, t1: 17.2, scene: S_BOOK12, cam: (t) => [mix(1.0, 1.05, (t - 16) / 1.2), 960, 540] },
  // the Angel
  { t0: 17.2, t1: 19.2, scene: S_DESK2, cam: c(2.2, 760, 590) },
  { t0: 19.2, t1: 20.8, scene: S_DESK2, cam: c(1.3, 1000, 520) },
  { t0: 20.8, t1: 22.6, scene: S_DESK2, cam: (t) => [mix(2.1, 2.3, (t - 20.8) / 1.8), 1190, 420] },
  { t0: 22.6, t1: 23.6, scene: S_BOOK12, cam: c(1.12, 1240, 560) },
  { t0: 23.6, t1: 25.4, scene: S_DESK2, cam: c(1.75, 980, 600) },
  { t0: 25.4, t1: 26.2, scene: S_DESK2, cam: c(2.1, 800, 610) },
  { t0: 26.2, t1: 28.4, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 28.4, t1: 29.8, scene: S_EAR, cam: c(2.3, 790, 530) },
  { t0: 29.8, t1: 31.9, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 31.9, t1: 32.6, scene: S_LAUGH, cam: c(2.5, 735, 545) },
  // the nights slip
  { t0: 32.6, t1: 33.3, scene: S_CLOCK1, cam: () => CLK },
  { t0: 33.3, t1: 34.0, scene: S_LAPSE1, cam: c(2.4, 745, 590) },
  { t0: 34.0, t1: 34.6, scene: S_CLOCK2, cam: () => CLK },
  { t0: 34.6, t1: 35.3, scene: S_LAPSE2, cam: c(2.4, 760, 615) },
  { t0: 35.3, t1: 36.0, scene: S_CLOCK3, cam: () => CLK },
  { t0: 36.0, t1: 39.0, scene: S_BONK, cam: (t) => [mix(1.6, 1.75, (t - 36) / 3), OV.x, OV.y + 120] },
  { t0: 39.0, t1: 39.8, scene: S_MORNING, cam: c(1.5, OV.x, OV.y + 160) },
  { t0: 39.8, t1: 43.2, scene: S_POVDAY, cam: c(1.1, 960, 540) },
  { t0: 43.2, t1: 44.3, scene: S_CAL2, cam: c(1.18, 900, 520) },
  { t0: 44.3, t1: 45.3, scene: S_BOOK12B, cam: c(1.05, 960, 540) },
  { t0: 45.3, t1: 47.0, scene: S_POV, cam: c(1.1, 960, 540) },
  // the low point
  { t0: 47.0, t1: 48.6, scene: S_312, cam: (t) => [mix(1.5, 1.62, (t - 47) / 1.6), OV.x, OV.y + 130] },
  { t0: 48.6, t1: 58.6, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 58.6, t1: 61.0, scene: S_CHEST, cam: (t) => [mix(2.0, 2.2, (t - 58.6) / 2.4), OV.x, OV.y + 90] },
  { t0: 61.0, t1: 63.6, scene: S_ANGEL_LOW, cam: c(1.9, 870, OV.y + 40) },
  { t0: 63.6, t1: 65.0, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 65.0, t1: 66.4, scene: S_ONEMORE, cam: () => FACE },
  { t0: 66.4, t1: 67.8, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  // the turn
  { t0: 67.8, t1: 70.4, scene: S_TURN, cam: (t) => [mix(1.3, 1.4, (t - 67.8) / 2.6), 1120, 340] },
  { t0: 70.4, t1: 72.0, scene: S_TURN, cam: c(2.6, 1000, 480) },
  { t0: 72.0, t1: 75.2, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  { t0: 75.2, t1: 77.2, scene: S_TURN, cam: (t) => [mix(1.4, 1.55, (t - 75.2) / 2), OV.x, OV.y + 140], shake: () => 2 },
  { t0: 77.2, t1: 79.6, scene: S_TURN, cam: (t) => [mix(1.5, 1.6, (t - 77.2) / 2.4), OV.x, OV.y - 10, -3] },
  { t0: 79.6, t1: 82.0, scene: S_TURN, cam: (t) => [mix(2.1, 2.3, (t - 79.6) / 2.4), OV.x, OV.y - 60, -4] },
  { t0: 82.0, t1: 83.0, scene: S_TURN, cam: c(2.6, 1000, 500) },
  { t0: 83.0, t1: 83.6, scene: S_FREEZE, cam: c(2.6, 1000, 500) },
  // the drop
  { t0: 83.6, t1: 87.0, scene: S_DROP, cam: (t) => [mix(1.3, 1.7, sm((t - 83.6) / 0.5)), 740, mix(700, 560, sm((t - 83.6) / 0.8))], shake: (t) => 12 * Math.exp(-(t - 83.6) * 3) },
  { t0: 87.0, t1: 88.4, scene: S_DRAWER, cam: c(2.2, 1020, 690) },
  // Devil mode
  { t0: 88.4, t1: 89.8, scene: S_M1, cam: c(1.6, 800, 600) },
  { t0: 89.8, t1: 90.7, scene: S_HL1, cam: c(1.08, 1060, 520) },
  { t0: 90.7, t1: 91.6, scene: S_CLOCK5, cam: () => CLK },
  { t0: 91.6, t1: 93.5, scene: S_WRIST, cam: c(2.0, 960, 740) },
  { t0: 93.5, t1: 94.4, scene: S_QUIZ(42, 93.55), cam: (t) => [mix(1.0, 1.04, (t - 93.5)), 960, 540] },
  { t0: 94.4, t1: 95.8, scene: S_NOD, cam: c(2.0, 760, 560) },
  { t0: 95.8, t1: 96.7, scene: S_FLIP, cam: c(1.06, 960, 540) },
  { t0: 96.7, t1: 97.6, scene: S_CLOCK240, cam: () => CLK },
  { t0: 97.6, t1: 98.5, scene: S_QUIZ(67, 97.65), cam: (t) => [mix(1.0, 1.04, (t - 97.6)), 960, 540] },
  { t0: 98.5, t1: 99.9, scene: S_CALX, cam: c(1.45, 1120, 600) },
  // the knock
  { t0: 99.9, t1: 101.4, scene: S_DOORK, cam: (t) => [1.55, 985, 560], shake: (t) => 14 * knockJolt(t) },
  { t0: 101.4, t1: 102.4, scene: S_TURNHEAD, cam: c(2.2, 760, 560) },
  { t0: 102.4, t1: 104.2, scene: S_LEAN, cam: c(1.7, 620, 560) },
  { t0: 104.2, t1: 105.0, scene: S_LEAN, cam: c(2.2, 760, 570) },
  { t0: 105.0, t1: 106.6, scene: S_DOORK, cam: (t) => [mix(1.8, 1.9, (t - 105) / 1.6), 985, 640] },
  { t0: 106.6, t1: 107.4, scene: S_DOORK, cam: c(1.55, 985, 600) },
  // the beat crashes back
  { t0: 107.4, t1: 108.3, scene: S_RESUME(455, 107.4), cam: c(1.06, 1000, 540) },
  { t0: 108.3, t1: 109.2, scene: S_QUIZ(81, 108.35), cam: (t) => [mix(1.0, 1.04, (t - 108.3)), 960, 540] },
  { t0: 109.2, t1: 110.1, scene: S_HUGE, cam: c(1.05, 900, 560) },
  { t0: 110.1, t1: 111.0, scene: S_SHUT, cam: c(1.06, 960, 540) },
  { t0: 111.0, t1: 112.0, scene: S_CLOCK658, cam: () => CLK },
  { t0: 112.0, t1: 113.8, scene: S_STEPOVER, cam: c(1.45, 985, 700) },
  // the exam
  { t0: 113.8, t1: 116.4, scene: S_CORRIDOR, cam: (t) => [1.25, mix(560, 1300, (t - 113.8) / 2.6), 700] },
  { t0: 116.4, t1: 118.6, scene: S_EXAM, cam: (t) => [mix(1.05, 1.12, (t - 116.4) / 2.2), 960, 540] },
  // the result, the note
  { t0: 118.6, t1: 121.0, scene: S_PASS, cam: (t) => [mix(1.0, 1.05, (t - 118.6) / 2.4), 960, 540] },
  { t0: 121.0, t1: 122.6, scene: S_RELIEF, cam: c(1.7, 700, 600) },
  { t0: 122.6, t1: 124.6, scene: S_PICK, cam: (t) => [mix(1.5, 1.56, (t - 122.6) / 2), 1030, 610] },
  { t0: 124.6, t1: 129.4, scene: { set: "set_door", dark: 0.6, blur: 10, draw: () => null }, cam: c(1.1, 985, 600) },
  { t0: 129.4, t1: 131.6, scene: S_CALLOOK, cam: (t) => [mix(1.6, 1.8, (t - 129.4) / 2.2), 1260, 520] },
  { t0: 131.6, t1: 134.4, scene: S_OPEN, cam: (t) => [mix(1.25, 1.35, (t - 131.6) / 2.8), 985, 520] },
  // memory: nobody else was there
  { t0: 134.4, t1: 135.4, scene: S_POVDAY, cam: c(1.1, 960, 540), mem: true },
  { t0: 135.4, t1: 136.4, scene: S_DRAWER_MEM, cam: c(2.2, 1020, 690), mem: true },
  { t0: 136.4, t1: 137.6, scene: S_MEM_DESK, cam: c(2.2, 760, 560), mem: true },
  { t0: 137.6, t1: 138.4, scene: S_MEM_DOOR, cam: c(1.55, 985, 600), mem: true },
  { t0: 138.4, t1: 139.0, scene: S_GLASS, cam: c(1.1, 960, 540) },
  // the end
  { t0: 139.0, t1: 141.0, scene: S_PLUGIN, cam: c(2.4, 990, 470) },
  { t0: 141.0, t1: 146.4, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 146.4, t1: 153.4, scene: S_CALL, cam: (t) => [mix(1.9, 2.05, (t - 146.4) / 7), OV.x + 60, OV.y + 40] },
  { t0: 153.4, t1: 158.4, scene: S_SLEEP, cam: (t) => [mix(1.2, 1.32, (t - 153.4) / 5), OV.x + 100, OV.y + 230] },
  { t0: 158.4, t1: 166, scene: null, cam: c(1, 960, 540) },
];

// W x H = the output frame
export const CutView: React.FC<{ cut: Cut; t: number; W?: number; H?: number }> = ({ cut, t, W = 1920, H = 1080 }) => {
  const sc = cut.scene;
  if (!sc) return null;
  const [z, cx0, cy0, rot = 0] = cut.cam(t);
  const cx = cx0 + (Math.sin(t * 0.7) * 5) / z, cy = cy0 + (Math.cos(t * 0.9) * 4) / z;
  const sh = cut.shake ? cut.shake(t) : 0;
  const sx = Math.sin(t * 91) * sh, sy = Math.cos(t * 77) * sh;
  const blur = sc.blur ?? Math.max(0, Math.min(3.5, (z - 1.3) * 2.2));
  const dark = typeof sc.dark === "function" ? sc.dark(t) : sc.dark ?? 0;
  const red = sc.red ? sc.red(t) : 0, warm = sc.warm ? sc.warm(t) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${W / 2 + sx}px, ${H / 2 + sy}px) rotate(${rot}deg) scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "0 0" }}>
        {sc.set && <>
          <Img src={staticFile(`poses/${sc.set}.png`)} style={{ position: "absolute", left: -320, top: -180, width: 2560, height: 1440, objectFit: "cover", filter: "blur(14px) brightness(0.55)" }} />
          <Img src={staticFile(`poses/${sc.set}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined }} />
        </>}
        <div style={{ position: "absolute", left: -320, top: -180, width: 2560, height: 1440, background: "#05060a", opacity: dark }} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <BeanDefs />
          <DeskDefs />
          <DoorDefs />
          <BedDefs />
          <StudyDefs />
          <defs>
            <radialGradient id="topVig" cx="50%" cy="40%" r="75%"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient>
            <linearGradient id="hallGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6e0" stopOpacity={0.6} /><stop offset="1" stopColor="#ffb466" stopOpacity={0.1} /></linearGradient>
          </defs>
          {sc.draw(t)}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,40,20,0) 25%, rgba(170,10,0,1) 100%)", opacity: red, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 50%, rgba(255,190,110,0.9) 0%, rgba(255,160,80,0) 60%)", opacity: warm, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ================================================================== the phone shots (overlays over the blurred room)
const C_STUDY: Clip = { t0: 26.2, kind: "study", user: "@studyhacks", caption: "HOW TO STUDY 600 PAGES\nIN ONE NIGHT", likes: "880K" };
const C_CAT: Clip = { t0: 29.8, kind: "cat", user: "@nightcats", caption: "WAIT FOR IT…", likes: "2.4M" };
const C_SLIME: Clip = { t0: 47.0, kind: "slime", user: "@satisfying", caption: "WATCH TILL THE END", likes: "1.1M" };
const C_SKATE: Clip = { t0: 63.6, kind: "skate", user: "@skatefails", caption: "NO WAY", likes: "640K" };
const CHAT_B: ChatItem[] = [
  { t: 0, sep: true, text: "Tuesday 3:12 AM" },
  { t: 0, text: "On my break. Still studying?" },
  { t: 55.6, me: true, text: "Yes. Almost done." },
  { t: 56.6, text: "Proud of you. Four more hours, then I go home." },
];
const DRAFT_B: Draft[] = [
  { t0: 52.3, t1: 53.0, text: "Sorry, Dad" },
  { t0: 53.6, t1: 54.0, text: "Sorry, Dad", mode: "del" },
  { t0: 54.3, t1: 55.3, text: "Yes. Almost done." },
];
const NOTE_PRACTICE: Note[] = [{ t: 41.7, from: "University", lines: ["You missed the", "practice exam."], icon: "#3b82f6", size: 38 }];
const NOTE_SCREEN: Note[] = [{ t: 45.4, from: "Screen Time", lines: ["9 h 41 min a day", "this week."], icon: "#7d5cf0", size: 38 }];
const NOTE_END: Note[] = [
  { t: 141.0, from: "Dad", lines: ["9 missed calls"], icon: "#34c759", time: "Thu", size: 38 },
  { t: 141.2, from: "Video app", lines: ["Continue watching"], icon: "#ff3d5a", ring: [141.2, 145.2], swipe: 143.75, size: 34 },
];
// the right thumb's moves
const tapAt = (t: number, t0: number, x: number, y: number, dur = 0.5): Thumb | undefined => {
  const u = k(t, [t0 - 0.25, t0, t0 + dur, t0 + dur + 0.25], [0, 1, 1, 0]);
  return u > 0 ? { x, y, u, press: k(t, [t0, t0 + 0.06, t0 + 0.16], [0, 1, 0]) } : undefined;
};
const PHONES: React.FC<{ t: number }> = ({ t }) => {
  // cold open: the lit feed at 1%, then the black glass and the eyes
  if (t < 1.9) return (
    <PhoneView t={t} s={0.95} y={40} glow={t < 1.0 ? 1 : 0}>
      {t < 1.0 ? <Feed t={t + 2.0} clips={[{ ...C_SLIME, t0: 0 }]} clock="4:12" battery={0.01} low1={0} />
        : <DeadGlass t={t} refl={1} devil={sm((t - 1.05) / 0.25)} eyes={sm((t - 1.1) / 0.1)} e={{ ...BEAN_EXPR.worried, ly: 2 }} red={0.6} />}
    </PhoneView>
  );
  if (t >= 7.6 && t < 14.8) return (
    <PhoneView t={t} s={1.12} y={14} thumb={tapAt(t, 12.95, 440, 935, 0.3)}>
      <Chat t={t} name="Dad" vest clock="11:40" items={CHAT_A} typing={[[8.6, 9.9]]} drafts={DRAFT_A} sentAt={13.2} />
    </PhoneView>
  );
  if (t >= 26.2 && t < 28.4) return (
    <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_STUDY]} clock="12:01" ring={[27.4, 30.4]} /></PhoneView>
  );
  if (t >= 29.8 && t < 31.9) return (
    <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_CAT]} clock="12:05" /></PhoneView>
  );
  if (t >= 39.8 && t < 41.6) return (
    <PhoneView t={t} s={0.95} y={40} glow={0.6} over={(() => {
      // the Angel's wingtip taps Snooze
      const a = sm((t - 39.95) / 0.3);
      return <g opacity={a} transform="translate(1140,630) scale(-1,1)"><Angel x={0} y={Math.sin(t * 3) * 6} s={0.9} t={t} reach={k(t, [40.35, 40.6, 41.0, 41.3], [0, 1, 1, 0])} /></g>;
    })()}>
      <Alarm t={t} time="9:00" label="PRACTICE EXAM" snooze={40.62} />
    </PhoneView>
  );
  if (t >= 41.6 && t < 43.2) return <PhoneView t={t} s={0.95} y={40}><Lock t={t} time="11:40" date="Saturday, May 9" notes={NOTE_PRACTICE} battery={0.4} /></PhoneView>;
  if (t >= 45.3 && t < 47.0) return <PhoneView t={t} s={0.95} y={40}><Lock t={t} time="2:47" date="Monday, May 11" notes={NOTE_SCREEN} battery={0.2} /></PhoneView>;
  if (t >= 48.6 && t < 51.8) return (
    <PhoneView t={t} s={0.95} y={40} thumb={tapAt(t, 51.35, 250, 170, 0.3)}>
      <Feed t={t} clips={[C_SLIME]} clock="3:12" battery={0.09}><Banner t={t} t0={49.2} t1={60} from="Dad" lines={["On my break.", "Still studying?"]} /></Feed>
    </PhoneView>
  );
  if (t >= 51.8 && t < 58.6) return (
    <PhoneView t={t} s={1.12} y={14} thumb={tapAt(t, 55.45, 440, 935, 0.25)}>
      <Chat t={t} name="Dad" vest clock="3:12" items={CHAT_B} typing={[[56.0, 56.6]]} drafts={DRAFT_B} sentAt={55.55} battery={0.08} />
    </PhoneView>
  );
  if (t >= 63.6 && t < 65.0) return <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_SKATE]} clock="4:11" battery={0.01} ring={[63.7, 66.7]} /></PhoneView>;
  if (t >= 66.4 && t < 67.8) return (
    <PhoneView t={t} s={0.95} y={40} glow={t < 67.4 ? 1 : 0} thumb={tapAt(t, 66.65, 254, 470, 0.25)}>
      {t < 67.4 ? <Feed t={t} clips={[{ ...C_SKATE, t0: 66.75 }]} clock="4:12" battery={0.01} ring={t < 66.75 ? [63.7, 66.75] : undefined} />
        : <DeadGlass t={t} refl={sm((t - 67.45) / 0.3)} low={0} />}
    </PhoneView>
  );
  if (t >= 72.0 && t < 75.2) {
    const close = t >= 74.0;
    return (
      <PhoneView t={t} s={close ? 1.45 : 1.0} y={close ? -260 : 30} glow={0}>
        <DeadGlass t={t} refl={1} devil={0.55 * sm((t - 72.4) / 1.4) + (close ? 0.45 * sm((t - 74.0) / 0.2) : 0)} horns={sm((t - 72.9) / 1.0)}
          eyes={close ? sm((t - 74.05) / 0.1) : 0} e={{ ...BEAN_EXPR.worried, ly: 2, lid: 0.3 }} red={0.3 + 0.4 * sm((t - 72.4) / 2)} />
      </PhoneView>
    );
  }
  // memory: the alarm again, his own thumb on Snooze
  if (t >= 134.4 && t < 135.4) return (
    <PhoneView t={t} s={0.95} y={40} glow={0.6} thumb={tapAt(t, 134.85, 254, 560, 0.3)}>
      <Alarm t={t} time="9:00" label="PRACTICE EXAM" snooze={134.9} />
    </PhoneView>
  );
  if (t >= 138.4 && t < 139.0) return <PhoneView t={t} s={1.0} y={30} glow={0}><DeadGlass t={t} refl={1} e={{ ...BEAN_EXPR.sad, ly: 2 }} /></PhoneView>;
  if (t >= 141.0 && t < 145.0) {
    const th: Thumb | undefined = t < 143.4 ? { x: 250, y: 600, u: sm((t - 141.9) / 0.5) } : t < 144.0 ? { x: mix(250, -60, sm((t - 143.6) / 0.3)), y: 600, u: 1 } : tapAt(t, 144.45, 250, 450, 0.3);
    return <PhoneView t={t} s={0.95} y={40} thumb={th}><Lock t={t} time="10:11" date="Friday, May 15" notes={NOTE_END} battery={0.03} charging={141.0} /></PhoneView>;
  }
  if (t >= 145.0 && t < 146.4) return <PhoneView t={t} s={0.95} y={40}><Call t={t} name="Dad" t0={145.0} connect={145.9} /></PhoneView>;
  return null;
};

// ================================================================== words on screen
type Who = "angel" | "devil" | "bean" | "dad";
type Cap = { t0: number; t1: number; who: Who; text: string; x: number; y: number; size?: number; white?: [number, number] };
const STY: Record<Who, React.CSSProperties> = {
  angel: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 70, color: "#ffd27a", textShadow: "0 3px 5px #000, 0 0 22px rgba(255,190,90,0.85)" },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 84, color: "#ff4a3a", textShadow: "0 3px 5px #000, 0 0 30px rgba(255,40,20,0.95)" },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 72, color: "#ffffff", textShadow: "0 3px 7px #000, 0 0 20px #000" },
  dad: { fontFamily: "Avenir Next", fontWeight: 700, fontSize: 60, color: "#1d2433" },
};
const CapView: React.FC<{ l: Cap; t: number }> = ({ l, t }) => {
  const op = k(t, [l.t0, l.t0 + 0.18, l.t1 - 0.25, l.t1], [0, 1, 1, 0]);
  if (op <= 0) return null;
  const rate = l.who === "devil" ? 16 : 30;
  const typed = l.text.slice(0, Math.max(1, Math.floor((t - l.t0) * rate) + 2));
  const white = l.white && t >= l.white[0] && t < l.white[1];
  const st = white ? STY.bean : STY[l.who];
  if (l.who === "dad") return (
    // Dad's voice from the phone: a white speech bubble with a phone icon, its tail toward the phone
    <div style={{ position: "absolute", left: l.x - 560, width: 1120, top: l.y, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ position: "relative", background: "#f4f6fa", borderRadius: 40, padding: "22px 40px 24px 96px", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", ...st }}>
        <svg width={52} height={52} viewBox="0 0 24 24" style={{ position: "absolute", left: 28, top: 26 }}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#2f6fe0" /></svg>
        {l.text}
        <div style={{ position: "absolute", right: 70, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "8px solid transparent", borderTop: "30px solid #f4f6fa" }} />
      </div>
    </div>
  );
  return <div style={{ position: "absolute", left: l.x - 620, width: 1240, top: l.y, textAlign: "center", opacity: op, ...st, ...(l.size ? { fontSize: l.size } : {}) }}>{typed}</div>;
};
const CAPS: Cap[] = [
  { t0: 2.0, t1: 3.2, who: "devil", text: "Put it down.", x: 1240, y: 760, size: 96, white: [2.62, 2.72] },
  { t0: 20.9, t1: 23.4, who: "angel", text: "You worked so hard today.", x: 960, y: 120 },
  { t0: 23.7, t1: 25.4, who: "angel", text: "Take a little break.", x: 960, y: 120 },
  { t0: 28.5, t1: 29.8, who: "angel", text: "Just one more.", x: 1180, y: 160, size: 80 },
  { t0: 39.95, t1: 41.55, who: "angel", text: "Shh. Rest.", x: 1460, y: 300, size: 76 },
  { t0: 61.1, t1: 63.55, who: "angel", text: "It's okay. You still have three days.", x: 960, y: 110, size: 64 },
  { t0: 65.05, t1: 66.4, who: "bean", text: "Just one more.", x: 960, y: 120, size: 80 },
  { t0: 79.7, t1: 82.0, who: "devil", text: "Put it down.", x: 960, y: 760, size: 104 },
  { t0: 91.7, t1: 93.45, who: "devil", text: "One more page.", x: 1260, y: 170, size: 88 },
  { t0: 102.6, t1: 104.2, who: "devil", text: "One more page.", x: 1180, y: 170, size: 88 },
  { t0: 136.55, t1: 137.6, who: "bean", text: "One more page.", x: 1180, y: 170, size: 84 },
  { t0: 141.9, t1: 143.7, who: "bean", text: "Just one more…", x: 1500, y: 300, size: 72 },
  { t0: 146.6, t1: 148.4, who: "bean", text: "Dad? I passed.", x: 960, y: 110, size: 76 },
  { t0: 148.6, t1: 151.2, who: "dad", text: "Then tonight is my last night shift.", x: 900, y: 80 },
  { t0: 151.4, t1: 153.3, who: "bean", text: "Happy birthday, Dad.", x: 960, y: 110, size: 76 },
];

// ------------------------------------------------------------------ counters, flashes, the letterbox
const DAYS: [number, number][] = [[0, 3], [3.25, 3], [4.4, 7], [43.2, 7], [44.2, 4], [47.0, 3], [90.0, 3], [93.4, 2], [98.6, 1], [111.0, 0]];
export const daysAt = (t: number) => Math.round(k(t, DAYS.map((d) => d[0]), DAYS.map((d) => d[1])));
const PAGES: [number, number][] = [[0, 12], [89.8, 12], [90.6, 48], [95.8, 48], [96.6, 210], [107.4, 210], [108.2, 455], [110.1, 455], [110.9, 600]];
export const pageAt = (t: number) => Math.round(k(t, PAGES.map((d) => d[0]), PAGES.map((d) => d[1])));
const letterbox = (t: number) => (t < 3.2 ? 96 : t < 83.0 ? 0 : t < 83.08 ? 96 * sm((t - 83.0) / 0.08) : t < 118.6 ? 96 : t < 119.4 ? 96 * (1 - sm((t - 118.6) / 0.8)) : 0);
export const flashOf = (t: number): [string, number] => {
  if (t >= 1.05 && t < 1.25) return ["#ff2d1f", k(t, [1.05, 1.07, 1.25], [0, 0.6, 0])];
  if (t >= 3.2 && t < 3.3) return ["#ff2d1f", 1];
  if (t >= 74.05 && t < 74.2) return ["#ffffff", k(t, [74.05, 74.07, 74.2], [0, 0.55, 0])];
  if (t >= 83.6 && t < 83.9) return [t < 83.7 ? "#ffffff" : "#ff2d1f", k(t, [83.6, 83.62, 83.9], [0, 1, 0])];
  return ["#000", 0];
};
const MEMORY = (t: number) => CUTS.some((cu) => cu.mem && t >= cu.t0 && t < cu.t1) || (t >= 134.4 && t < 138.4);

export const Film05: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const t = f / FPS;
  const cut = CUTS.find((cu) => t >= cu.t0 && t < cu.t1);
  const lb = letterbox(t);
  const [flashCol, flashOp] = flashOf(t);
  const mem = MEMORY(t);
  const devilTime = t >= 83.6 && t < 118.6;
  const daysOp = Math.max(k(t, [0, 0.2, 3.1, 3.2], [0, 1, 1, 0]), k(t, [3.35, 3.5, 120.6, 121.0], [0, 1, 1, 0])) * (mem ? 0 : 1);
  const pageOp = k(t, [16.2, 16.5, 112.0, 112.4], [0, 1, 1, 0]);
  const days = daysAt(t), page = pageAt(t);
  const slam = t >= 83.65 && t < 85.6;
  const slamS = 1.6 - 0.6 * sm((t - 83.65) / 0.16);
  const ring = t >= 83.65 && t < 84.3 ? (t - 83.65) / 0.65 : -1;
  const title = k(t, [159.4, 159.8, 165.2, 166], [0, 1, 1, 0]);
  const rewind = t >= 3.25 && t < 4.6;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      <AbsoluteFill style={{ filter: mem ? "grayscale(0.9) sepia(0.25) contrast(1.05) brightness(0.92) blur(0.6px)" : undefined }}>
        {cut && <CutView cut={cut} t={t} />}
        <PHONES t={t} />
        {mem && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)" }} />}
      </AbsoluteFill>
      {/* Dad's note in his hands (124.6-129.4) */}
      {t >= 124.6 && t < 129.4 && <NoteBirthday t={t} />}
      {CAPS.map((l, i) => <CapView key={i} l={l} t={t} />)}
      <AbsoluteFill style={{ transform: `translateY(${lb}px)` }}>
        {daysOp > 0 && (
          <div style={{ position: "absolute", left: 60, top: 32, opacity: daysOp, fontFamily: "Avenir Next", color: devilTime || t < 3.2 ? "#ff4a3a" : "#f1ece2",
            textShadow: devilTime || t < 3.2 ? "0 0 18px rgba(255,40,20,0.7)" : "0 2px 6px #000" }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, opacity: 0.85 }}>{days === 0 ? "EXAM" : "EXAM IN"}</div>
            <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1, transform: rewind ? `translateY(${Math.sin(t * 40) * 3}px)` : undefined }}>
              {days === 0 ? "TODAY" : <>{days} <span style={{ fontSize: 40, fontWeight: 800 }}>{days === 1 ? "DAY" : "DAYS"}</span></>}
            </div>
          </div>
        )}
        {pageOp > 0 && (
          <div style={{ position: "absolute", left: 60, top: 160, opacity: pageOp, fontFamily: "Avenir Next", textShadow: "0 2px 6px #000" }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#c9b98f" }}>PAGE</div>
            <div style={{ fontSize: 54, fontWeight: 900, color: page >= 600 ? "#5be08a" : devilTime ? "#ff8a6a" : "#f1ece2" }}>{page} <span style={{ fontSize: 32, color: "#8a8f9b" }}>/ 600</span></div>
          </div>
        )}
      </AbsoluteFill>
      {t >= 3.3 && t < 4.6 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "Avenir Next", fontWeight: 700, fontSize: 64, letterSpacing: 16, color: "#f1ece2", opacity: k(t, [3.4, 3.6, 4.3, 4.55], [0, 1, 1, 0]) }}>4 DAYS EARLIER</div>
        </AbsoluteFill>
      )}
      {slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k(t, [83.65, 83.72, 85.2, 85.6], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(t * 90) * 7 * Math.exp(-(t - 83.65) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 200,
            letterSpacing: 26, color: "#ff3b2a", textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 6px 0 #3a0000", paddingLeft: 26 }}>DEVIL MODE</div>
        </AbsoluteFill>
      )}
      {ring >= 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={960} cy={540} r={60 + ring * 1300} fill="none" stroke="#ff3b2a" strokeWidth={34 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {t >= 158.4 && (
        <AbsoluteFill style={{ background: "#050507", alignItems: "center", justifyContent: "center", fontFamily: "Avenir Next" }}>
          <div style={{ opacity: title, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: 20, color: "#f1ece2", paddingLeft: 20 }}>JUST ONE MORE</div>
            <div style={{ width: 420, height: 7, background: "#ff3b2a", marginTop: 14, boxShadow: "0 0 18px rgba(255,40,20,0.8)" }} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: flashCol, opacity: flashOp }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: lb, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lb, background: "#000" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {!(qa && qa.length) && <Audio src={staticFile("audio/film05_mix.wav")} />}
    </AbsoluteFill>
  );
};

// Dad's birthday note, held in his hands, with the same cake he drew on the calendar
const NoteBirthday: React.FC<{ t: number }> = ({ t }) => {
  const op = k(t, [124.6, 124.85, 129.1, 129.4], [0, 1, 1, 0]);
  const rise = sm((t - 124.6) / 0.35);
  return (
    <div style={{ position: "absolute", left: 500, top: 120 + (1 - rise) * 80, width: 920, height: 800, background: "#fbfaf4", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
      opacity: op, transform: `translate(${Math.sin(t * 9) * 1.4}px, ${Math.cos(t * 7) * 1.2}px) rotate(-2deg)`, fontFamily: "Chalkboard SE", color: "#1f3f8f", boxSizing: "border-box", padding: "80px 80px",
      backgroundImage: "repeating-linear-gradient(180deg, transparent 0 97px, #b9cbe8 97px 100px)", backgroundPositionY: "60px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 398, height: 3, background: "rgba(0,0,0,0.08)" }} />
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: "100px" }}>It's my birthday.</div>
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: "100px" }}>I just wanted</div>
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: "100px" }}>to see you.</div>
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: "100px", marginLeft: 470 }}>- Dad</div>
      <svg width={180} height={160} viewBox="-60 -60 120 100" style={{ position: "absolute", left: 120, top: 470 }}>
        <g stroke="#2349a8" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-36,30 L-36,4 L36,4 L36,30 Z" />
          <path d="M-36,16 C-24,22 -12,10 0,16 C12,22 24,10 36,16" />
          <path d="M0,4 L0,-14" />
          <path d="M0,-32 C7,-25 5,-18 0,-17 C-5,-18 -7,-25 0,-32 Z" fill="#ff9f0a" stroke="#d0281c" strokeWidth={2.5} />
        </g>
      </svg>
      <svg width={1040} height={520} viewBox="0 0 1040 520" style={{ position: "absolute", left: -60, top: 600, overflow: "visible" }}>
        {[[110, 1], [930, -1]].map(([hx, sd]) => (
          <g key={hx} transform={`translate(${hx},${120 + Math.sin(t * 6 + hx) * 1.5})`}>
            <path d={`M${-50 * sd},70 L${-80 * sd},420 L${70 * sd},420 L${54 * sd},70 Z`} fill="#1a1a1a" stroke="#1a1a1a" strokeWidth={10} strokeLinejoin="round" />
            <path d={`M${-50 * sd},70 L${-80 * sd},420 L${70 * sd},420 L${54 * sd},70 Z`} fill="#efe3cf" />
            <path d="M0,-38 C40,-38 64,-6 64,34 C64,74 36,100 0,100 C-36,100 -62,74 -62,34 C-62,-6 -40,-38 0,-38 Z" fill="#efe3cf" stroke="#1a1a1a" strokeWidth={6} />
            <path d={`M${-8 * sd},-60 C${18 * sd},-74 ${40 * sd},-58 ${38 * sd},-32 C${36 * sd},-10 ${12 * sd},-4 ${-6 * sd},-14 Z`} fill="#efe3cf" stroke="#1a1a1a" strokeWidth={5.5} strokeLinejoin="round" />
            <ellipse cx={20 * sd} cy={40} rx={30} ry={40} fill="#cfc4b3" opacity={0.6} />
          </g>
        ))}
      </svg>
    </div>
  );
};
