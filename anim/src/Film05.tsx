// FILM 02 — "JUST ONE MORE | The Phone Ate His Nights" (2:54). Story: films/02-just-one-more/STORY.md (locked).
// Built like Film04: scenes are continuous functions of film time; cuts are camera set-ups over them; CutView draws
// any cut at any size. New here: the bed seen from the ceiling (film/bed.tsx), his phone seen from his eyes
// (film/phone.tsx), the textbook, calendar, exam paper and Dad's photo (film/study.tsx), and the memory replay in
// which the Angel and the Devil dissolve on screen and leave only him (the reveal: nobody else was ever there).
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import type { Pose } from "./rig/figure";
import type { V2 } from "./rig/geom";
import { BC, BEAN_EXPR, BeanDefs, DevilSVG, buildBean } from "./rig/bean";
import type { BeanExpr } from "./rig/bean";
import { Angel } from "./rig/angel";
import { FRONT, SEAT, SIDE, TQ, poseAt, walk } from "./rig/beanPoses";
import { Char, DEVIL_LEAN, DevilFig, P, SEAT_BACK, SEAT_PHONE, SEAT_RELIEF, SEAT_RUB, Spark, ex, k, mix, sm } from "./film/kit";
import { CLOCK_XY, ChairAt, DK, DRAWER_XY, DeskDefs, DeskFront, DeskTop, FaceGlow, STL, ScreenInsert, plane } from "./film/desk";
import type { ScreenKind, V3 } from "./film/desk";
import { DoorDefs, FloorLetter, LowFeet, ReachHand, letterPt } from "./film/door";
import type { LetterState } from "./film/door";
import { BedBase, BedDefs, Bedside, Blanket, Blinds, Charger, DevilOver, EarPhone, HeldPhone, LyingBean, OV, OV_CLOCK, OV_PHONE, PLUG_HAND, PLUG_PORT, PLUG_REST, PhoneLight, PhoneSmoke } from "./film/bed";
import { Alarm, Banner, Call, Chat, DeadGlass, Eyelids, Feed, Lock, PhoneView } from "./film/phone";
import type { ChatItem, Clip, Draft, Note, Thumb } from "./film/phone";
import { BookInsert, CalendarInsert, DadPhoto, DeskBook, DeskClutter, ExamInsert, StudyDefs } from "./film/study";

export const FILM5_SECONDS = 174;
const FPS = 30;

// ------------------------------------------------------------------ scenes and cuts (as in Film04)
type Scene = { set?: string; dark?: number | ((t: number) => number); red?: (t: number) => number; warm?: (t: number) => number;
  blur?: number; draw: (t: number) => React.ReactNode };
export type Cam = [number, number, number, number?];
export type Cut = { t0: number; t1: number; scene: Scene | null; cam: (t: number) => Cam; shake?: (t: number) => number };
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
const SEAT_GRAB = P({ ...SEAT, head: [54, -318], tilt: 16, elR: [90, -206], wrR: [140, -214], elL: [76, -206], wrL: [126, -214] });
const HEAD_DROP = P({ ...SEAT_READ, head: [70, -292], tilt: 44 });
const SEAT_LOOKBACK = P({ ...SEAT_READ, t: -0.6, head: [40, -318], tilt: -4 });
// half-risen from the chair, one hand on the desk, looking back at the door
const HALF_UP = P({ ...SEAT_LOOKBACK, head: [44, -372], tilt: -2, top: [26, -296], bot: [8, -150], shL: [22, -282], shR: [30, -280],
  elR: [80, -236], wrR: [124, -206], elL: [16, -228], wrL: [24, -176], hpL: [4, -146], knL: [56, -104], hpR: [10, -144], knR: [62, -100] });
const SEAT_LAUGH = P({ ...SEAT_PHONE, head: [44, -326], tilt: 4 });
const ARMS_UP = P({ ...FRONT, elR: [120, -300], wrR: [150, -360], elL: [-120, -300], wrL: [-150, -360] });
const RISE0 = P({ ...SIDE, head: [40, -300], tilt: 30, top: [20, -240], bot: [0, -120], knL: [30, -80], knR: [36, -80], elR: [40, -200], wrR: [70, -170] });
// standing at the desk, leaning down to the drawer
const LEAN_DRAWER = P({ ...SIDE, head: [56, -350], tilt: 24, top: [34, -276], bot: [4, -148], shR: [42, -262], shL: [34, -262],
  elR: [76, -214], wrR: [100, -170], elL: [70, -212], wrL: [94, -176] });
const LEAN_DROP = P({ ...LEAN_DRAWER, elR: [70, -236], wrR: [104, -226] }); // holding the phone over the open drawer
// standing, holding the note, looking up at the wall
const NOTE_HOLD = P({ ...SIDE, head: [20, -386], tilt: -12, elR: [30, -230], wrR: [56, -246], elL: [22, -232], wrL: [48, -250] });

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
const DevilHand: React.FC<{ x: number; y: number; from: V2; s?: number; rot?: number; grip?: number; op?: number }> = ({ x, y, from, s = 1, rot, grip = 0, op = 1 }) => {
  if (op < 0.01) return null;
  const dir = Math.atan2(y - from[1], x - from[0]);
  const lw = 64 * s, nx = -Math.sin(dir) * lw / 2, ny = Math.cos(dir) * lw / 2;
  const ex2 = x - Math.cos(dir) * 26 * s, ey2 = y - Math.sin(dir) * 26 * s;
  const arm = `M${(from[0] + nx).toFixed(1)},${(from[1] + ny).toFixed(1)} L${(ex2 + nx).toFixed(1)},${(ey2 + ny).toFixed(1)} L${(ex2 - nx).toFixed(1)},${(ey2 - ny).toFixed(1)} L${(from[0] - nx).toFixed(1)},${(from[1] - ny).toFixed(1)} Z`;
  const r = rot ?? (dir * 180) / Math.PI - 90;
  const mit = "M0,-46 C28,-46 42,-24 42,4 C42,32 24,50 0,50 C-24,50 -40,32 -40,4 C-40,-24 -28,-46 0,-46 Z";
  const thumb = `M-28,${10 - grip * 14} C-48,${4 - grip * 10} -54,${28 - grip * 6} -37,${40 - grip * 8} C-28,${46 - grip * 8} -20,${34 - grip * 12} -20,${22 - grip * 12} Z`;
  return (
    <g opacity={op}>
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
// Bean's own mitten (the same shape), for his hands on the drawer front
const BeanMitten: React.FC<{ x: number; y: number; rot?: number; s?: number; far?: boolean }> = ({ x, y, rot = 0, s = 1, far }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,-46 C28,-46 42,-24 42,4 C42,32 24,50 0,50 C-24,50 -40,32 -40,4 C-40,-24 -28,-46 0,-46 Z" fill={far ? BC.far : BC.skin} stroke={BC.line} strokeWidth={5} />
    <path d="M-28,-4 C-48,-10 -54,14 -37,26 C-28,32 -20,20 -20,8 Z" fill={far ? BC.far : BC.skin} stroke={BC.line} strokeWidth={4.5} strokeLinejoin="round" />
  </g>
);
// a figure's dark silhouette (the doorway; shadows on the floor)
const Silhouette: React.FC<{ pose: Pose; tf: string; id: string; horns?: number; fill?: string; rim?: string; glow?: number; op?: number }> = ({ pose, tf, id, horns = 0, fill = "#120d0a", rim, glow = 0, op = 1 }) => (
  <g transform={tf} opacity={op}>
    <DevilSVG items={buildBean(pose, BEAN_EXPR.neutral, { idp: id, devil: horns > 0, horns, view: pose.t === 0 ? "front" : "side", contact: false })} glow={glow} rim={rim ?? fill} fill={fill} detailOp={0} />
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
const glowAt = (p: Pose, amt: number) => <FaceGlow x={BX + (p.head[0] + 44) * 1.3} y={FY + (p.head[1] + 10) * 1.3} amount={amt} />;
type AtO = { typing?: boolean; flip?: boolean; prop?: "phone" | null; before?: React.ReactNode; after?: React.ReactNode; propLit?: number; jitter?: number; glow?: number; chairX?: number };
const atDesk = (t: number, d: DeskSt, id: string, pose: Pose, e: BeanExpr, o: AtO = {}) => <>
  {deskBack(t, d)}
  {o.before}
  {o.chairX !== undefined && <ChairAt x={o.chairX} y={FY} />}
  <Char id={id} pose={pose} e={e} x={BX} y={FY} seat={o.chairX === undefined} t={t} typing={o.typing} flip={o.flip} prop={o.prop ?? null} propLit={o.propLit ?? 1} jitter={o.jitter ?? 0} />
  {deskFront(t, d)}
  {!o.flip && glowAt(pose, Math.max(litOf(d), o.glow ?? 0))}
  {o.after}
</>;
const bed = (draw: (t: number) => React.ReactNode, dark = 0.5, red?: (t: number) => number): Scene => ({ set: "set_bedroom", dark, red, draw });
const insert = (draw: (t: number) => React.ReactNode, red?: (t: number) => number): Scene => ({ red, draw });
const BOOK0 = { x: 900, z: 46, frac: 0.02 };
const clockShot = (clock: string, extra: Partial<DeskSt> = {}, dark = 0.6, red?: (t: number) => number) => bed((t) => <>
  {deskBack(t, { clock, book: { ...BOOK0, frac: 0.02 }, ...extra })}{deskFront(t, { clock })}<ChairAt x={BX} y={FY} />
</>, dark, red);

// ------------------------------------------------------------------ the bed from above
type BedSt = { clock: string; e: BeanExpr; lit?: number; phone?: "held" | "chest" | "none" | "ear"; py?: number; prot?: number; psc?: number; day?: number;
  angel?: { x: number; y: number; s: number; ember?: number; reach?: number; op?: number }; ember?: { x: number; y: number; a: number } | null;
  plug?: { at: [number, number]; held?: boolean; shake?: number } | null; devilY?: number | null; smoke?: number; flash?: number; phoneDown?: boolean; dead?: boolean; oneHand?: boolean; clockGlow?: number };
const BedView: React.FC<{ t: number; s: BedSt; id: string }> = ({ t, s, id }) => {
  const lit = s.lit ?? 1;
  const ph = s.phone ?? "held";
  return <>
    <BedBase day={s.day ?? 0} />
    <Bedside clock={s.clock} phoneDown={s.phoneDown} />
    {s.clockGlow !== undefined && <circle cx={OV_CLOCK[0]} cy={OV_CLOCK[1]} r={200} fill="#ff2d1f" opacity={0.32 * s.clockGlow} filter="url(#bb30)" />}
    <LyingBean id={id} t={t} e={s.e} />
    <Blanket day={s.day ?? 0} />
    {s.plug && <Charger plug={[s.plug.at[0] + Math.sin(t * 70) * (s.plug.shake ?? 0) * 3, s.plug.at[1] + Math.cos(t * 63) * (s.plug.shake ?? 0) * 2]} held={s.plug.held} t={t} />}
    {(ph === "held" || ph === "chest") && <HeldPhone t={t} lit={ph === "chest" ? 0 : lit} y={s.py ?? (ph === "chest" ? OV_PHONE[1] + 46 : OV_PHONE[1])} rot={s.prot ?? (ph === "chest" ? 4 : -6)} sc={s.psc ?? 1} dead={s.dead} oneHand={s.oneHand} />}
    {ph === "ear" && <EarPhone t={t} />}
    {s.smoke !== undefined && <PhoneSmoke t={t} amount={s.smoke} />}
    <Blinds amount={s.day ?? 0} />
    <PhoneLight lit={ph === "held" ? lit : 0} />
    {s.flash !== undefined && s.flash > 0.01 && <ellipse cx={OV.x} cy={OV.y + 60} rx={320} ry={280} fill="#fff6dc" opacity={0.6 * s.flash} filter="url(#bb30)" style={{ mixBlendMode: "screen" }} />}
    {s.ember && s.ember.a > 0.01 && <>
      {/* the Angel's last ember: it lights his hand and the plug */}
      <circle cx={s.ember.x} cy={s.ember.y} r={150} fill="#ffcc66" opacity={0.28 * s.ember.a} filter="url(#bb30)" style={{ mixBlendMode: "screen" }} />
      <circle cx={s.ember.x} cy={s.ember.y} r={26} fill="#ffcc66" opacity={0.7 * s.ember.a} filter="url(#bb6)" />
      <circle cx={s.ember.x} cy={s.ember.y} r={10 + Math.sin(t * 9) * 1.5} fill="#fff1cc" opacity={s.ember.a} />
    </>}
    {s.angel && (s.angel.op ?? 1) > 0.01 && <g opacity={s.angel.op ?? 1}><Angel x={s.angel.x} y={s.angel.y} s={s.angel.s} t={t} ember={s.angel.ember ?? 0} reach={s.angel.reach ?? 0} smile={0.8} /></g>}
    {s.devilY !== undefined && s.devilY !== null && <DevilOver id={`${id}d`} t={t} y={s.devilY} />}
  </>;
};
const over = (st: (t: number) => BedSt, id: string, red?: (t: number) => number): Scene => ({ red, draw: (t) => <BedView t={t} s={st(t)} id={id} /> });

// ================================================================== the scenes
// 0 · cold open: the climax (the same moment as 79.3-81.7), a two-shot: the Devil's face, his hand on the plug
const CLIMAX = (t: number): BedSt => ({ clock: "4:12", e: ex("surprised", t, { blink: false, ly: -7 }), lit: 0, dead: true, oneHand: true,
  plug: { at: PLUG_PORT, held: true, shake: 0.5 }, smoke: 0.85, devilY: 7, ember: { x: PLUG_HAND[0] + 40, y: PLUG_HAND[1] + 30, a: 0.6 } });
const S_COLD_BED = over((t) => CLIMAX(t), "cold", () => 0.5);
const S_POVDARK: Scene = { set: "set_bedroom", dark: 0.82, blur: 12, red: (t) => (t < 1.0 ? 0 : 0.45), draw: () => null };

// 1 · the want: the calendar; Dad's texts and photo; the book
const S_CAL1 = insert((t) => <CalendarInsert t={t} circle={sm((t - 4.7) / 0.8)} write={sm((t - 5.55) / 0.7)} marker={t < 6.3} />);
const S_DESK1 = bed((t) => {
  const putDown = sm((t - 14.95) / 0.35);
  const pose = t < 14.9 ? SEAT_PHONE : poseAt([{ t: 14.9, pose: SEAT_PHONE }, { t: 15.25, pose: SEAT_GRAB }, { t: 15.5, pose: SEAT_TYPE }], t);
  return atDesk(t, { clock: "11:40", book: { ...BOOK0, open: t > 15.45, frac: 0.02 }, phone: putDown > 0.95 ? { x: 1030, z: 70, lit: 0 } : undefined }, "d1", pose,
    ex(t < 7.6 ? "neutral" : t < 14.9 ? "worried" : "determined", t, { ly: 4 }),
    { prop: putDown < 0.95 ? "phone" : null, propLit: sm((t - 6.9) / 0.1), jitter: t > 6.9 && t < 7.4 ? 1.4 : 0, glow: t > 6.9 ? 0.7 : 0 });
}, 0.5);
const S_DADPHOTO = bed((t) => <>
  {deskBack(t, { clock: "11:41", book: { ...BOOK0, frac: 0.02, open: false } })}
  <ellipse cx={980} cy={650} rx={90} ry={70} fill="#9fbcff" opacity={0.3} filter="url(#bb12)" style={{ mixBlendMode: "screen" }} />
</>, 0.55);
const S_POV: Scene = { set: "set_bedroom", dark: 0.6, blur: 12, draw: () => null };
const S_BOOK12 = insert((t) => <BookInsert t={t} page={12} hand={false} />);

// 2 · the Angel's comfort
const S_DESK2 = bed((t) => {
  const bloom = sm((t - 19.6) / 0.6);
  const sp = sm((t - 19.2) / 1.0);
  const slide = sm((t - 24.0) / 1.0);           // her wing pushes the phone across the desk to his hand
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
const S_CLOCK1 = clockShot("12:41"), S_CLOCK2 = clockShot("1:37"), S_CLOCK3 = clockShot("2:52");
const S_LAPSE1 = lapse("12:58", SEAT_SLUMP, "lp1"), S_LAPSE2 = lapse("2:10", SEAT_SLUMP2, "lp2");
// 3:30 in bed: his eyes close and the phone slips toward his face; the next video flares; he wakes and catches it
const S_NOD3 = over((t) => {
  const close = sm((t - 36.2) / 0.9), slip = Math.min(1, Math.max(0, (t - 36.6) / 0.85)) ** 2;
  const awake = t > 37.9;
  const catchU = sm((t - 37.95) / 0.12), lift = sm((t - 38.35) / 0.45);
  const fall = awake ? mix(1, 0.86, catchU) * (1 - lift) : slip;
  const lid = awake ? (t < 38.3 ? 0.05 : 0.55) : 0.62 + 1.0 * close;
  const e = { ...ex(awake && t < 38.3 ? "surprised" : "tired", t, { blink: false, ly: awake ? -3 : 6 }), lid };
  return { clock: "3:30", e, phone: "held", lit: awake ? 1 : 1 - 0.4 * close, py: mix(OV_PHONE[1], OV.y + 70, fall), prot: mix(-6, 24, fall), psc: mix(1, 0.9, fall),
    flash: awake ? Math.exp(-(t - 37.9) * 3) : 0 };
}, "nod3");
// morning, the alarm
const S_MORNING = over((t) => ({ clock: "9:00", e: ex("tired", t, { closed: true }), phone: "chest", lit: 0, day: 1,
  angel: { x: 760, y: 200 + angelY(t) * 0.4, s: 0.5 } }), "morn");
const S_POVDAY: Scene = { set: "set_bedroom", dark: 0.15, blur: 14, warm: () => 0.15, draw: () => null };

// 3 · the days slip
const S_CAL2 = insert((t) => <CalendarInsert t={t} crossed={Math.min(3, Math.floor((t - 43.8) / 0.3) + 1)} />);
const S_BOOK12B = insert((t) => <BookInsert t={t} page={12} hand={false} tired={0.4} />);

// 4 · the low point (3:12 AM)
const S_312 = over((t) => ({ clock: "3:12", e: ex("tired", t, { ly: 6 }), phone: "held", lit: 1 }), "b312");
const S_CHEST = over((t) => ({ clock: "3:14", e: ex("sad", t, { ly: -8, blink: t > 61 }), phone: "chest", lit: 0 }), "chest");
const S_ANGEL_LOW = over((t) => ({ clock: "3:15", e: ex("sad", t, { ly: -6, lx: -4 }), phone: "chest", lit: 0, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.55, reach: k(t, [62.5, 62.9, 64.2, 64.6], [0, 0.6, 0.6, 0]) } }), "alow");
const S_FLIPBACK = over((t) => {
  const u = sm((t - 64.85) / 0.35);
  return { clock: "3:15", e: ex(u < 0.6 ? "sad" : "tired", t, { ly: u < 0.6 ? -6 : 6 }), phone: "held", lit: sm((u - 0.5) / 0.3), py: mix(OV_PHONE[1] + 46, OV_PHONE[1], u), prot: mix(4, -6, u) };
}, "flip");
const S_ONEMORE = over((t) => ({ clock: "4:11", e: ex("tired", t, { talk: t > 66.8 && t < 67.6, ly: 6 }), phone: "held", lit: 1, angel: { x: 770, y: 210, s: 0.5 } }), "one");

// 5 · the turn (one continuous night, from the ceiling)
const TURN = (t: number): BedSt => {
  const gutter = sm((t - 69.6) / 1.1);                      // the Angel burns down to an ember
  const push = sm((t - 70.6) / 1.4);                        // the ember pushes the plug to his hand
  const take = sm((t - 72.2) / 0.9);                        // his hand takes it toward the port
  const touch = sm((t - 81.8) / 0.25);                      // the tip touches the port's edge
  const open = t > 83.0;
  let plug: [number, number] = [mix(PLUG_REST[0], PLUG_HAND[0], push), mix(PLUG_REST[1], PLUG_HAND[1], push)];
  if (t > 72.2) plug = [mix(PLUG_HAND[0], PLUG_PORT[0], take), mix(PLUG_HAND[1], PLUG_PORT[1], take)];
  if (t > 81.8) plug = [PLUG_PORT[0] + (t > 82.05 && t < 82.7 ? Math.sin(t * 40) * 5 : 0), PLUG_PORT[1] - 9 * touch];
  if (open) {
    // it drops onto the sheet and bounces once
    const d = t - 83.0;
    const fall = Math.min(1, d / 0.16);
    const bounce = d > 0.16 ? Math.sin(Math.min(Math.PI, ((d - 0.16) / 0.22) * Math.PI)) * 9 : 0;
    plug = [PLUG_PORT[0] + 8, PLUG_PORT[1] - 9 + 36 * fall - bounce];
  }
  const shake = t > 82.3 && t < 83.0 ? 1 : 0;
  const emberA = t < 70.6 ? sm((t - 70.0) / 0.4) : open ? 1 - sm((t - 83.1) / 0.3) : 1;
  const emberAt: [number, number] = t < 72.2 ? [plug[0] + 42, plug[1] + 6] : [PLUG_HAND[0] + 40, PLUG_HAND[1] + 30];
  const devilIn = sm((t - 77.0) / 2.0);
  const e = t < 73.6 ? ex("worried", t, { ly: 4 }) : t < 77.0 ? ex("worried", t, { blink: false, ly: 6 }) : t < 83.0 ? ex("surprised", t, { blink: false, ly: t > 80.5 ? 4 : -7 })
    : ex("determined", t, { blink: false, red: 1, ly: -7 });
  return { clock: "4:12", e, lit: 0, dead: true, phone: "held", oneHand: t > 72.2,
    plug: { at: plug, held: t > 72.2 && !open, shake },
    angel: gutter < 1 ? { x: PLUG_REST[0] + 50, y: PLUG_REST[1] - 230 + 220 * gutter, s: 0.6, ember: gutter, op: 1 - sm((gutter - 0.85) / 0.15) } : undefined,
    ember: { x: emberAt[0], y: emberAt[1], a: emberA },
    smoke: t > 76.9 ? sm((t - 76.9) / 1.6) : undefined, devilY: t > 77.0 ? mix(-440, 7, devilIn) : null };
};
const S_TURN = over(TURN, "turn", (t) => (t < 76.9 ? 0.1 * sm((t - 73.7) / 3) : 0.2 + 0.3 * sm((t - 76.9) / 2)));
// 83.5-84.1: a hard freeze on his opened hand, the red draining to black
const S_FREEZE: Scene = { draw: (t) => <>
  <BedView t={83.45} s={TURN(83.45)} id="frz" />
  <rect x={-400} y={-300} width={2720} height={1680} fill="#000" opacity={0.85 * sm((t - 83.55) / 0.45)} />
</>, red: () => 0.5 };

// 6 · the drop and Devil mode
const S_DROP = bed((t) => <>
  {deskBack(t, { clock: "4:13", book: { ...BOOK0, frac: 0.02 } })}
  {deskFront(t, { clock: "4:13" })}
  <ChairAt x={BX} y={FY} />
  <DevilFig id="drop" pose={ARMS_UP} x={420} y={FY} s={1.8} t={t} glow={1.7} face="laughing" />
  <Char id="drop" pose={poseAt([{ t: 84.15, pose: RISE0 }, { t: 84.7, pose: FRONT }], t)}
    e={ex("determined", t, { red: k(t, [84.2, 84.4, 85.7, 86.5], [0, 1, 1, 0]), blink: false })} x={720} y={1010} s={1.4} t={t} />
</>, 0.55, (t) => mix(0.7, 0.4, sm((t - 84.1) / 1.5)));
// the drawer: standing at the desk he drops the dead phone into the drawer; a hand lands on his and they push it shut.
// devil = the Devil's black hand (1); fading it (the memory) uncovers his own other hand under it
const DRAWER_FRONT: V2 = [1052, 762];
const drawerShot = (t: number, t0: number, devil: number, own: boolean) => {
  const drop = sm((t - t0 - 0.15) / 0.3);
  const push = sm((t - t0 - 0.8) / 0.22);
  const dr = t < t0 + 0.05 ? sm((t - t0 + 0.25) / 0.3) : 1 - push;
  const pose = t < t0 + 0.5 ? LEAN_DROP : poseAt([{ t: t0 + 0.5, pose: LEAN_DROP }, { t: t0 + 0.75, pose: LEAN_DRAWER }], t);
  const hx = 935, hy = 1012;
  const hand: V2 = [hx + 100 * 1.4, hy - 170 * 1.4];
  const land = sm((t - t0 - 0.55) / 0.2);
  return <>
    {deskBack(t, { clock: "4:13", book: { ...BOOK0, frac: 0.02 } })}
    <ChairAt x={BX - 120} y={FY} tilt={-6} />
    <clipPath id={`drawerIn${Math.round(t0 * 10)}`}><rect x={0} y={0} width={1920} height={744.8 + 18 * dr} /></clipPath>
    {t > t0 + 0.15 && t < t0 + 0.5 && (
      <g clipPath={`url(#drawerIn${Math.round(t0 * 10)})`}>
        <g transform={`translate(${mix(hand[0] - 30, DRAWER_XY[0], drop)},${mix(hy - 226 * 1.4, DRAWER_XY[1] - 6, drop)}) rotate(${drop * 110})`}>
          <rect x={-17} y={-30} width={34} height={60} rx={7} fill="#121318" stroke="#2b2d35" strokeWidth={2} /></g>
      </g>
    )}
    <Char id={`dw${Math.round(t0 * 10)}`} pose={pose} e={ex("determined", t, { blink: false, ly: 6 })} x={hx} y={hy} s={1.4} t={t} prop={t < t0 + 0.15 ? "phone" : null} propLit={0} />
    {deskFront(t, { clock: "4:13", drawer: dr })}
    {t > t0 + 0.5 && <>
      <BeanMitten x={DRAWER_FRONT[0] - 12} y={DRAWER_FRONT[1] - 2 + push * 6} rot={-80} s={0.62} />
      {own && land > 0.01 && <BeanMitten x={DRAWER_FRONT[0] + 6} y={DRAWER_FRONT[1] - 14 + (1 - land) * -60 + push * 6} rot={-70} s={0.62} far />}
      {devil > 0.01 && land > 0.01 && <DevilHand x={DRAWER_FRONT[0] + 8} y={DRAWER_FRONT[1] - 16 + (1 - land) * -80 + push * 6} from={[1320, 380]} s={0.66} grip={0.6} op={devil} />}
    </>}
  </>;
};
const S_DRAWER = bed((t) => drawerShot(t, 87.6, 1, false), 0.55, () => 0.35);
// the memories: [start, end, when the grey (and the dissolve) begins, how long it takes]
const MEM: [number, number, number, number][] = [[138.7, 140.2, 0.4, 0.6], [140.2, 141.7, 0.4, 0.6], [141.7, 144.5, 0.05, 0.4], [144.5, 145.1, 0, 0.01]];
const memAt = (t: number) => { const m = MEM.find(([a, b]) => t >= a && t < b); return m ? sm((t - m[0] - m[2]) / m[3]) : 0; };
const S_DRAWER_MEM = bed((t) => drawerShot(t - 140.2 + 87.5, 87.6, 1 - memAt(t), true), 0.45);
const MONT = (t: number): DeskSt => {
  const frac = t < 90.2 ? 0.02 : t < 96.3 ? 0.08 : t < 108.6 ? 0.35 : t < 112.5 ? 0.76 : 1;
  const mugs = t < 92 ? 0 : t < 97 ? 1 : t < 101 ? 3 : t < 108 ? 4 : 6;
  return { clock: "5:00", lid: 1, screen: "quiz42", ts: 0, book: { x: 990, z: 52, frac, hl: 0.6 }, mugs, cards: t < 92 ? 0 : t < 100 ? 5 : 10 };
};
const S_M1 = bed((t) => {
  const pose = poseAt([{ t: 88.9, pose: SEAT_REST }, { t: 89.25, pose: SEAT_WRITE }], t);
  return atDesk(t, { ...MONT(t), clock: "4:20", lid: 0 }, "m1", pose, ex("determined", t, { ly: 4 }),
    { typing: t > 89.3, before: <DevilFig id="m1d" pose={DEVIL_LEAN} x={410} y={FY} s={1.55} lean={10} t={t} face="mischievous" /> });
}, 0.5, () => 0.32);
const S_HL1 = insert((t) => <BookInsert t={t} page={48} hl={sm((t - 90.3) / 0.85)} red={0.6} />, () => 0.2);
const S_CLOCK5 = clockShot("5:00", { lid: 1, screen: "quiz42", ts: 0, book: { x: 990, z: 52, frac: 0.08 } }, 0.6, () => 0.3);
// his eyes stay on the book; his hand drifts to the drawer on its own; the Devil's hand clamps his wrist (close at the drawer)
const S_WRIST = bed((t) => {
  const drift = sm((t - 92.2) / 0.75);
  const grab = sm((t - 92.95) / 0.15);
  const hand: V2 = [mix(930, 1030, drift) - grab * 22, mix(735, 770, drift) - grab * 6];
  return <>
    {deskBack(t, { ...MONT(t), clock: "5:12" })}
    <ChairAt x={BX} y={FY} />
    {deskFront(t, { clock: "5:12" })}
    <ReachHand x={hand[0]} y={hand[1]} from={[hand[0] - 420, hand[1] - 14]} k={0.6} grip={0} />
    {grab > 0.01 && <DevilHand x={hand[0] - 78} y={hand[1] - 14 - (1 - grab) * 60} from={[hand[0] - 60, 420]} s={0.6} grip={1} />}
  </>;
}, 0.5, () => 0.35);
const S_QUIZ = (score: number, ts: number) => insert((t) => <ScreenInsert kind={`quiz${score}` as ScreenKind} t={t} ts={ts} />, () => 0.18);
// his head drops on the book; the Devil's hand at the back of his neck lifts it
const S_NOD = bed((t) => {
  const lift = sm((t - 95.5) / 0.45);
  const pose = t < 95.5 ? HEAD_DROP : poseAt([{ t: 95.5, pose: HEAD_DROP }, { t: 95.95, pose: SEAT_READ }], t);
  const nape: V2 = [BX + mix(28, 18, lift) * 1.3, FY + mix(-262, -272, lift) * 1.3];
  return atDesk(t, { ...MONT(t), clock: "1:15" }, "nod", pose,
    ex(t < 95.6 ? "tired" : "surprised", t, { closed: t < 95.55, blink: false, ly: 4 }),
    { before: <DevilFig id="nodd" pose={TQ} x={400} y={FY} s={1.6} t={t} face="angry" />,
      after: t > 95.2 && <DevilHand x={nape[0] - 10} y={nape[1]} from={[520, 360]} s={0.75} grip={0.6} /> });
}, 0.5, () => 0.35);
const S_FLIP = insert((t) => <BookInsert t={t} page={210} flip={((t - 96.3) * 2.4) % 1} hand={false} red={0.6} />, () => 0.2);
const S_CLOCK240 = clockShot("2:40", { lid: 1, screen: "quiz67", ts: 0, mugs: 3, cards: 5, book: { x: 990, z: 52, frac: 0.35 } }, 0.6, () => 0.3);
const S_CLOCK728 = clockShot("7:28", { lid: 1, screen: "quiz67", ts: 0, mugs: 3, cards: 6, book: { x: 990, z: 52, frac: 0.35 } }, 0.55, () => 0.25);

// 7 · the knock (Thursday evening): the door from inside, the boots, three knocks; "Dad?"; the half-rise; the Devil's hand
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
    out.push(<circle key={i} cx={x + Math.sin(u * 3 + i) * 8} cy={y} r={2.4} fill="#ffd9a0" opacity={Math.max(0, 0.85 - u * 0.6)} />);
  }
  return <g>{out}</g>;
};
const NOTE_IN = (t: number): LetterState => {
  const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, (t - 106.4) / 0.7)), 3);
  return { u: mix(-20, -70, e), v: mix(-90, 260, e), rot: mix(0, 9, e) };
};
const NOTE_REST: LetterState = { u: -70, v: 260, rot: 9 };
const Fingertips: React.FC<{ t: number }> = ({ t }) => {
  const a = sm((t - 106.2) / 0.15) * (1 - sm((t - 106.8) / 0.2));
  if (a < 0.01) return null;
  const push = sm((t - 106.35) / 0.4) * 10;
  return <g opacity={a} clipPath="url(#underDoor)">{[-34, -8, 18].map((dx, i) => <ellipse key={i} cx={950 + dx} cy={578 + push} rx={11} ry={7} fill={BC.skin} stroke={BC.line} strokeWidth={2} />)}</g>;
};
const S_DOORK: Scene = { set: "set_door", dark: 0.12,
  draw: (t) => <>
    <Jacket t={t} />
    <BootShadows t={t} t0={99.95} t1={107.9} />
    {t > 100.2 && t < 102 && <Dust t={t} />}
    {t > 106.2 && <FloorLetter s={t > 107.2 ? NOTE_REST : NOTE_IN(t)} id="nk" note clipGap />}
    <Fingertips t={t} />
  </> };
// at the desk: pen stops, "Dad?", the chair scrapes back, he half-rises; the Devil leans in and its hand presses him down
const knockDesk = (t: number, T: number, id: string) => {
  // T = the time of "Dad?"
  const rise = sm((t - T - 1.1) / 0.5);                     // the half-rise
  const press = sm((t - T - 2.4) / 0.6);                    // pressed back down
  const back = sm((t - T - 3.9) / 0.4);                     // turns back to the book
  let pose: Pose = t < T - 0.1 ? SEAT_WRITE : poseAt([{ t: T - 0.1, pose: SEAT_WRITE }, { t: T + 0.25, pose: SEAT_LOOKBACK }], t);
  if (rise > 0) pose = poseAt([{ t: T + 1.1, pose: SEAT_LOOKBACK }, { t: T + 1.6, pose: HALF_UP }], t);
  if (press > 0) pose = poseAt([{ t: T + 2.4, pose: HALF_UP }, { t: T + 3.0, pose: SEAT_LOOKBACK }], t);
  if (back > 0) pose = poseAt([{ t: T + 3.9, pose: SEAT_LOOKBACK }, { t: T + 4.3, pose: SEAT_WRITE }], t);
  const chairX = BX - 46 * rise * (1 - press);
  const e = ex(back > 0.5 ? "determined" : "worried", t, { blink: false, lx: back > 0.5 ? 4 : 6, talk: t > T && t < T + 0.45 });
  // the Devil's hand on his upper back (from behind and below his head, so it never crosses his face)
  const sh: V2 = [mix(mix(632, 636, rise), 632, press), mix(mix(655, 600, rise), 655, press)];
  const lean = sm((t - T - 2.0) / 0.4);
  return atDesk(t, { ...MONT(102), clock: "7:30", screen: "quiz67", ts: 0 }, id, pose, e, {
    typing: t < T - 0.2 || back > 0.9, chairX,
    before: lean > 0.01 ? <DevilFig id={`${id}d`} pose={DEVIL_LEAN} x={mix(300, 400, lean)} y={FY} s={1.65} lean={16} t={t} face="manipulative" /> : null,
    after: lean > 0.5 ? <DevilHand x={sh[0]} y={sh[1]} from={[430, 720]} s={0.7} grip={0.4} /> : null,
  });
};
const S_KNOCKDESK = bed((t) => knockDesk(t, 101.6, "kd"), 0.5, () => 0.3);
const S_RESUME = (page: number, t0: number) => insert((t) => <BookInsert t={t} page={page} hl={sm((t - t0) / 0.8)} red={0.6} />, () => 0.2);
const S_CALX = insert((t) => <CalendarInsert t={t} crossed={6} xDay={{ day: 14, u: sm((t - 110.6) / 0.7) }} marker dim={0.6} />, () => 0.15);
const S_HUGE = bed((t) => atDesk(t, { ...MONT(t), clock: "3:30", screen: "quiz81", ts: 0 }, "hug", SEAT_WRITE, ex("determined", t, { ly: 4 }),
  { typing: true, before: <DevilFig id="huge" pose={ARMS_UP} x={430} y={1000} s={2.3} op={0.9} t={t} face="mischievous" /> }), 0.5, () => 0.3);
const S_SHUT = insert((t) => <BookInsert t={t} page={599} flip={sm((t - 112.7) / 0.5)} hand={false} red={0.4} />, () => 0.15);
const S_CLOCK658 = clockShot("6:58", { lid: 1, screen: "quiz81", ts: 0, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } }, 0.45, () => 0.25);
// his feet step over the note on his way out
const OUT_NEAR = [{ t: 114.75, u: 330 }, { t: 115.25, u: 60 }, { t: 115.75, u: -220 }];
const OUT_FAR = [{ t: 114.5, u: 380 }, { t: 115.0, u: 160 }, { t: 115.5, u: -100 }];
const S_STEPOVER: Scene = { set: "set_door", dark: 0.3, draw: (t) => <>
  <FloorLetter s={NOTE_REST} id="so" note clipGap={false} />
  <LowFeet t={t} near={OUT_NEAR} far={OUT_FAR} vNear={520} vFar={470} />
</> };

// 8 · the exam (Friday): a hard-lit school corridor; beside his shadow walks a horned one
const floorShadow = (pose: Pose, x: number, y: number, horns: boolean, op: number, id: string) => (
  // lying on the floor away from the windows on the left: the figure's "up" maps to the right and a little back
  <Silhouette pose={pose} id={id} horns={horns ? 1 : 0} fill="#130d0b" op={op} tf={`matrix(0.42,0.12,-1.05,0.2,${x},${y})`} />
);
const S_CORRIDOR: Scene = { set: "set_corridor", dark: 0, red: () => 0.1,
  draw: (t) => {
    const X = mix(260, 1500, (t - 116.1) / 2.6);
    const p = walk((t - 116.1) * 11.5, SIDE, 1.45);
    return <>
      {floorShadow(p, X + 10, 1010, false, 0.55, "csb")}
      {floorShadow(p, X + 70, 960, true, 0.68, "csd")}
      <Char id="cor" pose={p} e={{ ...ex("determined", t, { blink: false }), bags: 1, lid: 0.55 }} x={X} y={1012} s={1.35} t={t} />
    </>;
  } };
const S_EXAM = insert((t) => <ExamInsert t={t} t0={118.7} />);

// 9 · the result, the note, the cost (Friday evening, the room dim)
const S_PASS = insert((t) => <ScreenInsert kind="pass" t={t} ts={121.4} />);
const S_RELIEF = bed((t) => {
  const pose = t < 123.6 ? SEAT_TYPE : t < 124.2 ? poseAt([{ t: 123.6, pose: SEAT_TYPE }, { t: 124.0, pose: SEAT_RELIEF }], t) : poseAt([{ t: 124.2, pose: SEAT_RELIEF }, { t: 124.6, pose: SEAT_BACK }], t);
  return atDesk(t, { clock: "8:40", lid: 1, screen: "pass", ts: 0, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } }, "rel", pose,
    ex(t < 124.2 ? "tired" : "worried", t, { closed: t > 123.8 && t < 124.2, blink: false }),
    { before: <DevilFig id="reld" pose={TQ} x={410} y={FY} s={1.45} op={0.85} glow={0.7} t={t} face="mischievous" /> });
}, 0.62, () => 0.15);
const PICK = (t: number): LetterState => ({ ...NOTE_REST, beta: 84 * sm((t - 125.85) / 0.25), h0: 300 * sm((t - 126.05) / 0.35) });
const S_PICK: Scene = { set: "set_door", dark: 0.25,
  draw: (t) => {
    const L = PICK(t);
    const edge = letterPt(L, 0, 1);
    const reach = sm((t - 125.4) / 0.35);
    const start: V2 = [1200, 120];
    const hand: V2 = [mix(start[0], edge[0] + 10, reach), mix(start[1], edge[1] - 34, reach)];
    return <>
      {t < 126.5 && <FloorLetter s={L} id="pk" note clipGap={false} />}
      {t > 125.4 && t < 126.5 && <ReachHand x={hand[0]} y={hand[1]} from={[1300, -200]} k={1.1} grip={sm((t - 125.8) / 0.08)} />}
    </>;
  } };
// behind the note in his hands: the dark room, and the Devil's red eyes and grin in it
const S_NOTEBACK: Scene = { set: "set_door", dark: 0.65, blur: 10, draw: (t) => (
  <DevilFig id="nb" pose={TQ} x={1640} y={1080} s={1.7} t={t} glow={0.9} face="mischievous" flip />
) };
// he lowers the note and looks up at the wall; the Devil stands in the dark over his shoulder
const S_LOOKUP: Scene = { set: "set_door", dark: 0.45, draw: (t) => <>
  <DevilFig id="lu" pose={DEVIL_LEAN} x={930} y={612} s={1.22} lean={8} t={t} glow={0.9} face="mischievous" />
  <Char id="lu" pose={poseAt([{ t: 131.1, pose: P({ ...NOTE_HOLD, head: [16, -380], tilt: 14 }) }, { t: 131.45, pose: NOTE_HOLD }], t)} e={ex("sad", t, { ly: -7, lx: 4, blink: false })} x={1150} y={640} s={1.3} t={t} prop="notice" />
</> };
const S_CALLOOK = insert((t) => <CalendarInsert t={t} crossed={7} cake dim={1} />);
// he opens the door: an empty, lit hallway, him in it as a silhouette; the light spreads and erases the Devil
const S_OPEN: Scene = { set: "set_door", dark: 0.6,
  draw: (t) => {
    const op = sm((t - 134.1) / 0.6);
    const spread = sm((t - 134.5) / 1.2);
    const x0 = 792, x1 = 1178, y0 = 104, y1 = 577;
    const gone = sm((t - 134.9) / 0.9);
    return <>
      <clipPath id="doorHole"><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath>
      <g clipPath="url(#doorHole)" opacity={op}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#e9c58f" />
        <polygon points={`${x0},${y1} ${x1},${y1} ${x1 - 60},${y1 - 120} ${x0 + 60},${y1 - 120}`} fill="#b98d5c" />
        <rect x={x0 + 60} y={y0 + 60} width={x1 - x0 - 120} height={y1 - y0 - 180} fill="#f3d9ae" />
        <rect x={x0 + 150} y={y0 + 120} width={70} height={y1 - y0 - 240} fill="#d9b585" />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#hallGlow)" />
      </g>
      <polygon points={`${x0},${y0} ${x0 + mix(386, 60, op)},${y0 - mix(0, 40, op)} ${x0 + mix(386, 60, op)},${y1 + mix(0, 60, op)} ${x0},${y1}`} fill="#2a1f19" stroke="#0d0907" strokeWidth={4} opacity={op > 0.02 ? 1 : 0} />
      {/* the Devil in the dark at the left, caught by the spreading light */}
      {gone < 1 && <g opacity={1 - gone}><DevilFig id="opd" pose={TQ} x={430} y={1010} s={1.55} t={t} glow={0.6 + 1.2 * gone} face="neutral" flip /></g>}
      <polygon points={`${x0},${y1} ${x1},${y1} ${mix(x1 + 260, x1 + 300, spread)},${y1 + 520} ${mix(x0 - 260, -400, spread)},${y1 + 520}`} fill="#ffcf8a" opacity={0.3 * op} filter="url(#bb12)" />
      <rect x={-400} y={y1} width={2720} height={700} fill="#ffcf8a" opacity={0.12 * spread} />
      <Silhouette pose={FRONT} id="sil" tf={`translate(985,${y1 + 6}) scale(0.92)`} rim="#ffcf8a" glow={0.6} />
    </>;
  } };
// the reverse: the hallway light across the dim room; his long shadow lies where the Devil stood, its round, hornless
// head on the wall above the empty chair
const S_REVSHADOW = bed((t) => <>
  {deskBack(t, { clock: "8:52", lid: 1, screen: "pass", ts: 0, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } })}
  <polygon points="-300,1300 520,1300 1000,560 200,520" fill="#ffcf8a" opacity={0.28} filter="url(#bb12)" />
  <Silhouette pose={FRONT} id="rsh" fill="#080504" op={0.82} tf="translate(400,1210) rotate(15) scale(1.15,1.97)" />
  <ChairAt x={BX} y={FY} />
  {deskFront(t, { clock: "8:52" })}
</>, 0.7);

// 10 · the memory: each moment again in colour, then grey as the Angel or the Devil dissolves and leaves only him
const S_MEM_DESK = bed((t) => {
  const u = t - 141.7;
  const devil = 1 - sm((u - 0.05) / 0.35);
  const up = sm((u - 0.5) / 0.4), down = sm((u - 1.2) / 0.5), back = sm((u - 2.3) / 0.4);
  let pose: Pose = SEAT_LOOKBACK;
  if (up > 0) pose = poseAt([{ t: 0.5, pose: SEAT_LOOKBACK }, { t: 0.9, pose: HALF_UP }], u);
  if (down > 0) pose = poseAt([{ t: 1.2, pose: HALF_UP }, { t: 1.7, pose: SEAT_LOOKBACK }], u);
  if (back > 0) pose = poseAt([{ t: 2.3, pose: SEAT_LOOKBACK }, { t: 2.7, pose: SEAT_WRITE }], u);
  const sh: V2 = [632, 655];
  return atDesk(t, { ...MONT(102), clock: "7:30", screen: "quiz67", ts: 0 }, "mem", pose,
    ex("determined", t, { blink: false, lx: back > 0.5 ? 4 : 6, talk: (u > 0.45 && u < 0.85) || (u > 1.85 && u < 2.55) }), {
      chairX: BX - 46 * up * (1 - down),
      before: devil > 0.01 ? <g opacity={devil}><DevilFig id="memd" pose={DEVIL_LEAN} x={400} y={FY} s={1.65} lean={16} t={t} face="manipulative" /></g> : null,
      after: devil > 0.01 ? <DevilHand x={sh[0]} y={sh[1]} from={[430, 720]} s={0.7} grip={0.4} op={devil} /> : null,
    });
}, 0.45);
const S_MEM_DOOR: Scene = { set: "set_door", dark: 0.15, draw: (t) => <BootShadows t={t} t0={130} t1={144.6} /> };
const S_GLASS: Scene = { set: "set_bedroom", dark: 0.82, blur: 12, draw: () => null };

// 11 · the end: the drawer, the cable, the lock screen, the call, the sleep
const S_TAKEPHONE = bed((t) => {
  const open = sm((t - 145.15) / 0.3);
  return <>
    {deskBack(t, { clock: "8:58", lid: 1, screen: "pass", ts: 0, mugs: 6, cards: 10, book: { x: 990, z: 52, frac: 1, open: false } })}
    <ChairAt x={BX - 120} y={FY} tilt={-6} />
    <Char id="tk" pose={poseAt([{ t: 145.1, pose: LEAN_DRAWER }, { t: 145.6, pose: LEAN_DROP }], t)} e={ex("sad", t, { ly: 6 })} x={935} y={1012} s={1.4} t={t} prop={t > 145.55 ? "phone" : null} propLit={0} />
    {deskFront(t, { clock: "8:58", drawer: open * (1 - sm((t - 145.6) / 0.2)) })}
  </>;
}, 0.62);
const S_PLUGIN = over((t) => {
  const reach = sm((t - 147.4) / 0.6), plugIn = sm((t - 148.2) / 0.3);
  const at: [number, number] = [mix(PLUG_PORT[0] + 8, PLUG_PORT[0], reach), mix(PLUG_PORT[1] + 27, PLUG_PORT[1] - 22 * plugIn, reach)];
  return { clock: "9:58", e: ex("sad", t, { ly: 6 }), lit: plugIn > 0.5 ? 0.5 : 0, dead: plugIn < 0.5, phone: "held", oneHand: reach > 0.05, plug: { at, held: reach > 0.05 }, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.45 } };
}, "plg");
const S_CALL = over((t) => ({ clock: "10:12", e: { ...ex(t < 159.6 ? "sad" : "neutral", t, { talk: (t > 154.9 && t < 156.1) || (t > 159.7 && t < 160.9), ly: -3, closed: t > 161.0 }) },
  phone: "ear", lit: 0, angel: { x: 770, y: 210 + angelY(t) * 0.3, s: 0.45 } }), "call");
const S_SLEEP = over((t) => ({ clock: "10:30", e: { ...ex("neutral", t, { closed: true }), mc: 2 }, phone: "none", lit: 0, phoneDown: true, clockGlow: 1,
  angel: { x: 770, y: 205 + angelY(t) * 0.3, s: 0.5 } }), "slp");

// ================================================================== the cuts
const FACE: Cam = [2.3, OV.x, OV.y + 40];
const CLK: Cam = [3.0, CLOCK_XY[0], CLOCK_XY[1]];
export const CUTS: Cut[] = [
  // cold open (the POV shots are overlays: see Phones)
  { t0: 0, t1: 1.9, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  { t0: 1.9, t1: 3.2, scene: S_COLD_BED, cam: (t) => [mix(1.42, 1.5, (t - 1.9) / 1.3), 975, 270, -2], shake: (t) => 6 * Math.exp(-(t - 1.95) * 5) },
  { t0: 3.2, t1: 4.6, scene: null, cam: c(1, 960, 540) },
  // the want
  { t0: 4.6, t1: 6.8, scene: S_CAL1, cam: (t) => [mix(1.55, 1.62, (t - 4.6) / 2.2), 1150, 650] },
  { t0: 6.8, t1: 7.6, scene: S_DESK1, cam: c(2.0, 760, 610) },
  { t0: 7.6, t1: 11.2, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 11.2, t1: 12.1, scene: S_DADPHOTO, cam: (t) => [mix(8.4, 9.0, (t - 11.2) / 0.9), 1004, 662] },
  { t0: 12.1, t1: 14.8, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 14.8, t1: 16.0, scene: S_DESK1, cam: c(1.7, 820, 640) },
  { t0: 16.0, t1: 17.2, scene: S_BOOK12, cam: (t) => [mix(1.0, 1.05, (t - 16) / 1.2), 960, 540] },
  // the Angel
  { t0: 17.2, t1: 19.2, scene: S_DESK2, cam: c(2.1, 770, 580) },
  { t0: 19.2, t1: 20.8, scene: S_DESK2, cam: c(1.3, 1000, 520) },
  { t0: 20.8, t1: 22.6, scene: S_DESK2, cam: (t) => [mix(2.1, 2.3, (t - 20.8) / 1.8), 1290, 430] },
  { t0: 22.6, t1: 23.6, scene: S_BOOK12, cam: c(1.12, 1240, 560) },
  { t0: 23.6, t1: 25.4, scene: S_DESK2, cam: c(1.75, 980, 600) },
  { t0: 25.4, t1: 26.2, scene: S_DESK2, cam: c(1.95, 800, 580) },
  { t0: 26.2, t1: 28.4, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 28.4, t1: 29.8, scene: S_EAR, cam: c(2.2, 800, 540) },
  { t0: 29.8, t1: 31.9, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 31.9, t1: 32.6, scene: S_LAUGH, cam: c(2.3, 745, 555) },
  // the nights slip
  { t0: 32.6, t1: 33.3, scene: S_CLOCK1, cam: () => CLK },
  { t0: 33.3, t1: 34.0, scene: S_LAPSE1, cam: c(2.2, 760, 600) },
  { t0: 34.0, t1: 34.6, scene: S_CLOCK2, cam: () => CLK },
  { t0: 34.6, t1: 35.3, scene: S_LAPSE2, cam: c(2.2, 770, 630) },
  { t0: 35.3, t1: 36.0, scene: S_CLOCK3, cam: () => CLK },
  { t0: 36.0, t1: 37.4, scene: S_NOD3, cam: (t) => [mix(1.7, 1.85, (t - 36) / 1.4), OV.x, OV.y + 110] },
  { t0: 37.4, t1: 37.9, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  { t0: 37.9, t1: 39.0, scene: S_NOD3, cam: c(1.95, OV.x, OV.y + 90), shake: (t) => 5 * Math.exp(-(t - 37.9) * 6) },
  { t0: 39.0, t1: 39.8, scene: S_MORNING, cam: c(1.5, OV.x, OV.y + 160) },
  { t0: 39.8, t1: 43.8, scene: S_POVDAY, cam: c(1.1, 960, 540) },
  { t0: 43.8, t1: 44.8, scene: S_CAL2, cam: c(1.3, 960, 470) },
  { t0: 44.8, t1: 45.6, scene: S_BOOK12B, cam: c(1.05, 960, 540) },
  { t0: 45.6, t1: 47.8, scene: S_POV, cam: c(1.1, 960, 540) },
  // the low point
  { t0: 47.8, t1: 49.4, scene: S_312, cam: (t) => [mix(1.5, 1.62, (t - 47.8) / 1.6), OV.x, OV.y + 130] },
  { t0: 49.4, t1: 59.8, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 59.8, t1: 62.2, scene: S_CHEST, cam: (t) => [mix(2.0, 2.2, (t - 59.8) / 2.4), OV.x, OV.y + 90] },
  { t0: 62.2, t1: 64.8, scene: S_ANGEL_LOW, cam: c(1.9, 870, OV.y + 40) },
  { t0: 64.8, t1: 65.3, scene: S_FLIPBACK, cam: c(2.1, OV.x, OV.y + 120) },
  { t0: 65.3, t1: 66.7, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 66.7, t1: 68.1, scene: S_ONEMORE, cam: () => FACE },
  { t0: 68.1, t1: 69.5, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  // the turn
  { t0: 69.5, t1: 72.1, scene: S_TURN, cam: (t) => [mix(1.32, 1.42, (t - 69.5) / 2.6), 1100, 380] },
  { t0: 72.1, t1: 73.7, scene: S_TURN, cam: c(2.5, 1010, 500) },
  { t0: 73.7, t1: 76.9, scene: S_POVDARK, cam: c(1.1, 960, 540) },
  { t0: 76.9, t1: 79.3, scene: S_TURN, cam: (t) => [mix(1.45, 1.52, (t - 76.9) / 2.4), OV.x + 15, OV.y + 20, -2], shake: () => 2 },
  { t0: 79.3, t1: 81.7, scene: S_TURN, cam: (t) => [mix(1.45, 1.55, (t - 79.3) / 2.4), OV.x + 15, OV.y + 30, -3] },
  { t0: 81.7, t1: 83.5, scene: S_TURN, cam: c(2.7, 1000, 510) },
  { t0: 83.5, t1: 84.1, scene: S_FREEZE, cam: c(2.7, 1000, 510) },
  // the drop
  { t0: 84.1, t1: 87.5, scene: S_DROP, cam: (t) => [mix(1.3, 1.7, sm((t - 84.1) / 0.5)), 740, mix(700, 560, sm((t - 84.1) / 0.8))], shake: (t) => 12 * Math.exp(-(t - 84.1) * 3) },
  { t0: 87.5, t1: 88.9, scene: S_DRAWER, cam: c(1.75, 980, 640) },
  // Devil mode
  { t0: 88.9, t1: 90.3, scene: S_M1, cam: c(1.6, 800, 600) },
  { t0: 90.3, t1: 91.2, scene: S_HL1, cam: c(1.08, 1060, 520) },
  { t0: 91.2, t1: 92.1, scene: S_CLOCK5, cam: () => CLK },
  { t0: 92.1, t1: 94.0, scene: S_WRIST, cam: c(3.0, 990, 745) },
  { t0: 94.0, t1: 94.9, scene: S_QUIZ(42, 94.05), cam: (t) => [mix(1.0, 1.04, (t - 94)), 960, 540] },
  { t0: 94.9, t1: 96.3, scene: S_NOD, cam: c(1.9, 740, 560) },
  { t0: 96.3, t1: 97.2, scene: S_FLIP, cam: c(1.06, 960, 540) },
  { t0: 97.2, t1: 98.1, scene: S_CLOCK240, cam: () => CLK },
  { t0: 98.1, t1: 99.0, scene: S_QUIZ(67, 98.15), cam: (t) => [mix(1.0, 1.04, (t - 98.1)), 960, 540] },
  { t0: 99.0, t1: 99.9, scene: S_CLOCK728, cam: () => CLK },
  // the knock
  { t0: 99.9, t1: 101.4, scene: S_DOORK, cam: () => [1.6, 985, 410], shake: (t) => 14 * knockJolt(t) },
  { t0: 101.4, t1: 102.6, scene: S_KNOCKDESK, cam: c(2.1, 760, 560) },
  { t0: 102.6, t1: 103.6, scene: S_KNOCKDESK, cam: c(1.65, 720, 590) },
  { t0: 103.6, t1: 105.4, scene: S_KNOCKDESK, cam: c(1.5, 640, 560) },
  { t0: 105.4, t1: 106.2, scene: S_KNOCKDESK, cam: c(2.0, 770, 580) },
  { t0: 106.2, t1: 107.8, scene: S_DOORK, cam: (t) => [mix(1.8, 1.9, (t - 106.2) / 1.6), 985, 640] },
  { t0: 107.8, t1: 108.6, scene: S_DOORK, cam: c(1.55, 985, 600) },
  // the beat crashes back; Thursday crossed out; exam day
  { t0: 108.6, t1: 109.5, scene: S_RESUME(455, 108.6), cam: c(1.06, 1000, 540) },
  { t0: 109.5, t1: 110.4, scene: S_QUIZ(81, 109.55), cam: (t) => [mix(1.0, 1.04, (t - 109.5)), 960, 540] },
  { t0: 110.4, t1: 111.6, scene: S_CALX, cam: c(1.6, 1000, 600) },
  { t0: 111.6, t1: 112.5, scene: S_HUGE, cam: c(1.05, 900, 560) },
  { t0: 112.5, t1: 113.4, scene: S_SHUT, cam: c(1.06, 960, 540) },
  { t0: 113.4, t1: 114.3, scene: S_CLOCK658, cam: () => CLK },
  { t0: 114.3, t1: 116.1, scene: S_STEPOVER, cam: c(1.45, 985, 700) },
  // the exam
  { t0: 116.1, t1: 118.7, scene: S_CORRIDOR, cam: (t) => [1.2, mix(620, 1300, (t - 116.1) / 2.6), 720] },
  { t0: 118.7, t1: 120.9, scene: S_EXAM, cam: (t) => [mix(1.05, 1.12, (t - 118.7) / 2.2), 960, 540] },
  // the result, the note, the cost
  { t0: 120.9, t1: 123.3, scene: S_PASS, cam: (t) => [mix(1.0, 1.05, (t - 120.9) / 2.4), 960, 540] },
  { t0: 123.3, t1: 124.9, scene: S_RELIEF, cam: c(1.7, 700, 600) },
  { t0: 124.9, t1: 126.9, scene: S_PICK, cam: (t) => [mix(1.5, 1.56, (t - 124.9) / 2), 1030, 610] },
  { t0: 126.9, t1: 131.1, scene: S_NOTEBACK, cam: c(1.1, 985, 600) },
  { t0: 131.1, t1: 131.7, scene: S_LOOKUP, cam: c(1.55, 1060, 330) },
  { t0: 131.7, t1: 133.9, scene: S_CALLOOK, cam: (t) => [mix(1.7, 1.85, (t - 131.7) / 2.2), 900, 580] },
  { t0: 133.9, t1: 136.7, scene: S_OPEN, cam: (t) => [mix(1.15, 1.25, (t - 133.9) / 2.8), 900, 560] },
  { t0: 136.7, t1: 138.7, scene: S_REVSHADOW, cam: (t) => [mix(1.15, 1.22, (t - 136.7) / 2), 700, 700] },
  // memory: nobody else was there
  { t0: 138.7, t1: 140.2, scene: S_POVDAY, cam: c(1.1, 960, 540) },
  { t0: 140.2, t1: 141.7, scene: S_DRAWER_MEM, cam: c(1.75, 980, 650) },
  { t0: 141.7, t1: 144.5, scene: S_MEM_DESK, cam: c(1.6, 690, 570) },
  { t0: 144.5, t1: 145.1, scene: S_MEM_DOOR, cam: c(1.55, 985, 600) },
  // the end
  { t0: 145.1, t1: 145.9, scene: S_TAKEPHONE, cam: c(1.7, 980, 650) },
  { t0: 145.9, t1: 147.1, scene: S_GLASS, cam: c(1.1, 960, 540) },
  { t0: 147.1, t1: 149.1, scene: S_PLUGIN, cam: c(2.4, 990, 470) },
  { t0: 149.1, t1: 154.5, scene: S_POV, cam: c(1.1, 960, 540) },
  { t0: 154.5, t1: 161.5, scene: S_CALL, cam: (t) => [mix(1.9, 2.05, (t - 154.5) / 7), OV.x + 60, OV.y + 40] },
  { t0: 161.5, t1: 166.5, scene: S_SLEEP, cam: (t) => [mix(1.15, 1.25, (t - 161.5) / 5), OV.x + 140, OV.y + 230] },
  { t0: 166.5, t1: FILM5_SECONDS, scene: null, cam: c(1, 960, 540) },
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
const C_STUDY: Clip = { t0: 26.2, kind: "study", user: "@studyhacks", caption: "HOW TO STUDY\n600 PAGES\nIN ONE NIGHT", likes: "880K" };
const C_DOG: Clip = { t0: 29.8, kind: "dog", user: "@goodboys", caption: "WAIT FOR IT…", likes: "2.4M" };
const C_DOM: Clip = { t0: 36.0, kind: "dominoes", user: "@satisfying", caption: "SO SATISFYING", likes: "3.1M" };
const C_SLIME: Clip = { t0: 47.8, kind: "slime", user: "@satisfying", caption: "WATCH TILL THE END", likes: "1.1M" };
const C_SKATE: Clip = { t0: 65.3, kind: "skate", user: "@skatefails", caption: "NO WAY", likes: "640K" };
export const CHAT_A: ChatItem[] = [
  { t: 0, sep: true, text: "Friday 11:40 PM" },
  { t: 7.7, text: "Night shift again." },
  { t: 8.6, text: "Pass the exam. I can't do one more year of night shifts." },
  { t: 13.55, me: true, text: "I'll pass it. I promise." },
];
const DRAFT_A: Draft[] = [{ t0: 12.3, t1: 13.2, text: "I'll pass it. I promise." }];
const CHAT_B: ChatItem[] = [
  { t: 0, sep: true, text: "Tuesday 3:12 AM" },
  { t: 0, text: "On my break. Still studying?" },
  { t: 56.4, me: true, text: "Yes. Almost done." },
  { t: 57.4, text: "Proud of you. Four more hours, then I go home." },
];
const DRAFT_B: Draft[] = [
  { t0: 53.5, t1: 54.3, text: "Sorry, Dad" },
  { t0: 54.8, t1: 55.2, text: "Sorry, Dad", mode: "del" },
  { t0: 55.35, t1: 56.1, text: "Yes. Almost done." },
];
const NOTE_PRACTICE: Note[] = [{ t: 41.7, from: "School", lines: ["Practice exam:", "missed"], icon: "#3b82f6", size: 46 }];
const NOTE_SCREEN: Note[] = [{ t: 45.7, from: "Screen time", lines: ["9 h 41 min", "a day"], icon: "#7d5cf0", size: 46 }];
const NOTE_END: Note[] = [
  { t: 149.1, from: "Dad", lines: ["9 missed calls"], icon: "#34c759", time: "Thu", size: 40 },
  { t: 149.3, from: "Video app", lines: ["Continue watching"], icon: "#ff3d5a", ring: [149.3, 153.3], swipe: 151.75, size: 34 },
];
// the right thumb's moves
const tapAt = (t: number, t0: number, x: number, y: number, dur = 0.5): Thumb | undefined => {
  const u = k(t, [t0 - 0.25, t0, t0 + dur, t0 + dur + 0.25], [0, 1, 1, 0]);
  return u > 0 ? { x, y, u, press: k(t, [t0, t0 + 0.06, t0 + 0.16], [0, 1, 0]) } : undefined;
};
// the Angel at the Snooze button (the film), dissolving to show his own thumb under her wing (the memory)
const SnoozeAngel: React.FC<{ t: number; t0: number; op: number }> = ({ t, t0, op }) => {
  const a = sm((t - t0 - 0.15) / 0.3) * op;
  return a > 0.01 ? <g opacity={a} transform="translate(1140,630) scale(-1,1)"><Angel x={0} y={Math.sin(t * 3) * 6} s={0.9} t={t} reach={k(t, [t0 + 0.55, t0 + 0.8, t0 + 1.2, t0 + 1.5], [0, 1, 1, 0])} /></g> : null;
};
const Phones: React.FC<{ t: number }> = ({ t }) => {
  // cold open: the lit feed at 1%, then the black glass and the eyes
  if (t < 1.9) return (
    <PhoneView t={t} s={0.95} y={40} glow={t < 1.0 ? 1 : 0}>
      {t < 1.0 ? <Feed t={t + 2.0} clips={[{ ...C_SLIME, t0: 0 }]} clock="4:12" battery={0.01} low1={0} />
        : <DeadGlass t={t} refl={1} devil={sm((t - 1.05) / 0.25)} eyes={sm((t - 1.1) / 0.1)} e={{ ...BEAN_EXPR.worried, ly: 2 }} red={0.6} />}
    </PhoneView>
  );
  if ((t >= 7.6 && t < 11.2) || (t >= 12.1 && t < 14.8)) return (
    <PhoneView t={t} s={1.12} y={14} thumb={tapAt(t, 13.35, 440, 935, 0.3)}>
      <Chat t={t} name="Dad" vest clock="11:40" items={CHAT_A} typing={[[8.0, 8.6]]} drafts={DRAFT_A} sentAt={13.5} />
    </PhoneView>
  );
  if (t >= 26.2 && t < 28.4) return <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_STUDY]} clock="12:01" ring={[27.3, 30.3]} ringCorner /></PhoneView>;
  if (t >= 29.8 && t < 31.9) return <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_DOG]} clock="12:05" /></PhoneView>;
  // the screen, close: the ring hits 1 and the next video flares white
  if (t >= 37.4 && t < 37.9) return (
    <PhoneView t={t} s={1.75} y={-330}>
      <Feed t={t} clips={[C_DOM, { ...C_SLIME, t0: 37.72 }]} clock="3:30" battery={0.2} ring={t < 37.72 ? [34.9, 37.72] : undefined} flare={t > 37.7 ? Math.exp(-(t - 37.72) * 6) : 0} />
    </PhoneView>
  );
  if (t >= 39.8 && t < 41.6) return <>
    <AbsoluteFill style={{ filter: "blur(2.2px)" }}>
      <PhoneView t={t} s={0.95} y={40} glow={0.6} over={<SnoozeAngel t={t} t0={39.8} op={1} />}>
        <Alarm t={t} time="9:00" label="PRACTICE EXAM 9 AM" snooze={40.62} />
      </PhoneView>
    </AbsoluteFill>
    <Eyelids t={t} />
  </>;
  if (t >= 41.6 && t < 43.8) return <PhoneView t={t} s={1.3} y={-120}><Lock t={t} time="11:40" date="Saturday, May 9" notes={NOTE_PRACTICE} battery={0.4} /></PhoneView>;
  if (t >= 45.6 && t < 47.8) return <PhoneView t={t} s={1.3} y={-120}><Lock t={t} time="2:47" date="Monday, May 11" notes={NOTE_SCREEN} battery={0.2} /></PhoneView>;
  if (t >= 49.4 && t < 52.6) return (
    <PhoneView t={t} s={0.95} y={40} thumb={tapAt(t, 52.15, 250, 170, 0.3)}>
      <Feed t={t} clips={[C_SLIME]} clock="3:12" battery={0.09}><Banner t={t} t0={50.0} t1={60} from="Dad" lines={["On my break.", "Still studying?"]} /></Feed>
    </PhoneView>
  );
  if (t >= 52.6 && t < 59.8) {
    // push in on the text box while he types "Sorry, Dad", deletes it and types the lie; pull back for Dad's answer
    const pin = sm((t - 53.0) / 0.4) * (1 - sm((t - 56.25) / 0.45));
    return (
      <PhoneView t={t} s={mix(1.12, 1.85, pin)} y={mix(14, -1075, pin)} thumb={tapAt(t, 56.25, 440, 935, 0.2)}>
        <Chat t={t} name="Dad" vest clock="3:12" items={CHAT_B} typing={[[56.8, 57.4]]} drafts={DRAFT_B} sentAt={56.35} battery={0.08} />
      </PhoneView>
    );
  }
  if (t >= 65.3 && t < 66.7) return <PhoneView t={t} s={0.95} y={40}><Feed t={t} clips={[C_SKATE]} clock="4:11" battery={0.01} ring={[65.4, 68.4]} /></PhoneView>;
  if (t >= 68.1 && t < 69.5) return (
    <PhoneView t={t} s={0.95} y={40} glow={t < 69.1 ? 1 : 0} thumb={tapAt(t, 68.35, 254, 470, 0.25)}>
      {t < 69.1 ? <Feed t={t} clips={[{ ...C_SKATE, t0: 68.45 }]} clock="4:12" battery={0.01} ring={t < 68.45 ? [65.4, 68.45] : undefined} />
        : <DeadGlass t={t} refl={sm((t - 69.15) / 0.3)} />}
    </PhoneView>
  );
  if (t >= 73.7 && t < 76.9) {
    const close = t >= 75.7;
    return (
      <PhoneView t={t} s={close ? 1.45 : 1.0} y={close ? -260 : 30} glow={0}>
        <DeadGlass t={t} refl={1} devil={0.55 * sm((t - 74.1) / 1.4) + (close ? 0.45 * sm((t - 75.7) / 0.2) : 0)} horns={sm((t - 74.6) / 1.0)}
          eyes={close ? sm((t - 75.75) / 0.1) : 0} e={{ ...BEAN_EXPR.worried, ly: 2, lid: 0.3 }} red={0.3 + 0.4 * sm((t - 74.1) / 2)} />
      </PhoneView>
    );
  }
  // memory: the alarm, as bleary as it was; the Angel's wingtip on Snooze dissolves and shows his own thumb pressing it
  if (t >= 138.7 && t < 140.2) return <>
    <AbsoluteFill style={{ filter: "blur(2.2px)" }}>
      <PhoneView t={t} s={0.95} y={40} glow={0.6} thumb={{ x: 254, y: 560, u: 1, press: 0.6 }} over={<SnoozeAngel t={t + 1.1} t0={138.7} op={1 - memAt(t)} />}>
        <Alarm t={t} time="9:00" label="PRACTICE EXAM 9 AM" snooze={138.7} />
      </PhoneView>
    </AbsoluteFill>
    <Eyelids t={t} amount={0.8} />
  </>;
  if (t >= 145.9 && t < 147.1) return <PhoneView t={t} s={1.0} y={30} glow={0}><DeadGlass t={t} refl={1} e={{ ...BEAN_EXPR.sad, ly: 2 }} /></PhoneView>;
  if (t >= 149.1 && t < 153.1) {
    // his thumb drifts to the video card by itself, stops, trembles; then swipes it away and taps Dad
    const drift = sm((t - 149.8) / 0.7);
    const th: Thumb | undefined = t < 151.5 ? { x: 254, y: mix(760, 630, drift), u: drift, press: 0 }
      : t < 152.05 ? { x: mix(254, -80, sm((t - 151.6) / 0.35)), y: 630, u: 1 } : tapAt(t, 152.45, 250, 450, 0.3);
    return <PhoneView t={t} s={0.95} y={40} thumb={th} shake={t > 150.5 && t < 151.5 ? 2.2 : 0}><Lock t={t} time="10:11" date="Friday, May 15" notes={NOTE_END} battery={0.03} charging={149.1} /></PhoneView>;
  }
  if (t >= 153.1 && t < 154.5) return <PhoneView t={t} s={0.95} y={40}><Call t={t} name="Dad" t0={153.1} connect={154.0} /></PhoneView>;
  return null;
};

// ================================================================== words on screen (each with a dark outline)
type Who = "angel" | "devil" | "bean" | "dad";
type Cap = { t0: number; t1: number; who: Who; text: string; x: number; y: number; size?: number; white?: [number, number] };
const OUTLINE: React.CSSProperties = { WebkitTextStroke: "9px rgba(8,6,6,0.92)", paintOrder: "stroke fill" };
const STY: Record<Who, React.CSSProperties> = {
  angel: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 70, color: "#ffd27a", textShadow: "0 4px 10px rgba(0,0,0,0.9)", ...OUTLINE },
  devil: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 84, color: "#ff4a3a", textShadow: "0 4px 10px rgba(0,0,0,0.9), 0 0 26px rgba(255,40,20,0.7)", ...OUTLINE },
  bean: { fontFamily: "Chalkboard SE", fontWeight: 700, fontSize: 72, color: "#ffffff", textShadow: "0 4px 10px rgba(0,0,0,0.9)", ...OUTLINE },
  dad: { fontFamily: "Avenir Next", fontWeight: 700, fontSize: 58, color: "#1d2433" },
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
        <svg width={52} height={52} viewBox="0 0 24 24" style={{ position: "absolute", left: 28, top: 24 }}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#2f6fe0" /></svg>
        {l.text}
        <div style={{ position: "absolute", right: 70, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "8px solid transparent", borderTop: "30px solid #f4f6fa" }} />
      </div>
    </div>
  );
  return <div style={{ position: "absolute", left: l.x - 640, width: 1280, top: l.y, textAlign: "center", opacity: op, ...st, ...(l.size ? { fontSize: l.size } : {}) }}>{typed}</div>;
};
const CAPS: Cap[] = [
  { t0: 2.0, t1: 3.2, who: "devil", text: "Put it down.", x: 1280, y: 820, size: 96, white: [2.62, 2.72] },
  { t0: 20.9, t1: 23.4, who: "angel", text: "You worked so hard today.", x: 960, y: 120 },
  { t0: 23.7, t1: 25.4, who: "angel", text: "Take a little break.", x: 960, y: 120 },
  { t0: 28.5, t1: 29.8, who: "angel", text: "Just one more.", x: 1180, y: 150, size: 80 },
  { t0: 39.95, t1: 41.55, who: "angel", text: "Shh. Rest.", x: 1480, y: 300, size: 76 },
  { t0: 62.3, t1: 64.75, who: "angel", text: "It's okay. You still have three days.", x: 960, y: 110, size: 64 },
  { t0: 66.75, t1: 68.1, who: "bean", text: "Just one more.", x: 960, y: 120, size: 80 },
  { t0: 79.4, t1: 81.7, who: "devil", text: "Put it down.", x: 1300, y: 820, size: 104 },
  { t0: 92.2, t1: 93.95, who: "devil", text: "One more page.", x: 960, y: 140, size: 88 },
  { t0: 101.5, t1: 102.8, who: "bean", text: "Dad?", x: 1060, y: 170, size: 64 },
  { t0: 103.8, t1: 105.4, who: "devil", text: "One more page.", x: 1180, y: 150, size: 88 },
  { t0: 142.05, t1: 143.25, who: "bean", text: "Dad?", x: 1000, y: 150, size: 64 },
  { t0: 143.3, t1: 144.5, who: "bean", text: "One more page.", x: 1100, y: 150, size: 80 },
  { t0: 154.7, t1: 156.6, who: "bean", text: "Dad? I passed.", x: 960, y: 110, size: 76 },
  { t0: 156.8, t1: 159.5, who: "dad", text: "So tonight is my last night shift.", x: 900, y: 80 },
  { t0: 159.7, t1: 161.5, who: "bean", text: "Happy birthday, Dad.", x: 960, y: 110, size: 76 },
];

// ------------------------------------------------------------------ counters, flashes, the letterbox
// the days (steps, not a slide): the rewind 3 -> 7 in the black after the cold open, the crosses, Tuesday 4 AM, ...
const DAYS: [number, number][] = [[0, 3], [3.4, 4], [3.56, 5], [3.72, 6], [3.88, 7], [44.1, 6], [44.4, 5], [44.7, 4], [47.8, 3], [94.0, 2], [99.0, 1], [111.25, 0]];
export const daysAt = (t: number) => { let v = DAYS[0][1]; for (const [a, d] of DAYS) if (t >= a) v = d; return v; };
const PAGES: [number, number][] = [[0, 12], [90.3, 12], [91.1, 48], [96.3, 48], [97.1, 210], [108.6, 210], [109.4, 455], [112.5, 455], [113.2, 600]];
export const pageAt = (t: number) => Math.round(k(t, PAGES.map((d) => d[0]), PAGES.map((d) => d[1])));
const letterbox = (t: number) => (t < 3.2 ? 96 : t < 83.5 ? 0 : t < 83.58 ? 96 * sm((t - 83.5) / 0.08) : t < 88.55 ? 96 : t < 88.75 ? 96 * (1 - sm((t - 88.55) / 0.2)) : 0);
export const flashOf = (t: number): [string, number] => {
  if (t >= 1.05 && t < 1.25) return ["#ff2d1f", k(t, [1.05, 1.07, 1.25], [0, 0.6, 0])];
  if (t >= 3.2 && t < 3.3) return ["#ff2d1f", 1];
  if (t >= 75.75 && t < 75.9) return ["#ffffff", k(t, [75.75, 75.77, 75.9], [0, 0.55, 0])];
  if (t >= 84.1 && t < 84.4) return [t < 84.2 ? "#ffffff" : "#ff2d1f", k(t, [84.1, 84.12, 84.4], [0, 1, 0])];
  return ["#000", 0];
};

// the top-left counters
const Counters: React.FC<{ t: number; days: number; page: number; devilTime: boolean; daysOp: number; pageOp: number }> = ({ t, days, page, devilTime, daysOp, pageOp }) => {
  const hot = devilTime || t < 3.2;
  const plate: React.CSSProperties = { background: "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)", padding: "10px 40px 14px 20px", marginLeft: -20 };
  return <>
    {daysOp > 0 && (
      <div style={{ position: "absolute", left: 60, top: 30, opacity: daysOp, fontFamily: "Avenir Next", color: hot ? "#ff4a3a" : "#f1ece2", ...plate,
        textShadow: hot ? "0 0 18px rgba(255,40,20,0.7), 0 2px 6px #000" : "0 2px 8px #000" }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, opacity: 0.9 }}>{days === 0 ? "EXAM" : "EXAM IN"}</div>
        <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1 }}>
          {days === 0 ? "TODAY" : <>{days} <span style={{ fontSize: 40, fontWeight: 800 }}>{days === 1 ? "DAY" : "DAYS"}</span></>}
        </div>
      </div>
    )}
    {pageOp > 0 && (
      <div style={{ position: "absolute", left: 60, top: 160, opacity: pageOp, fontFamily: "Avenir Next", textShadow: "0 2px 8px #000", ...plate }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#d8c89c" }}>PAGE</div>
        <div style={{ fontSize: 54, fontWeight: 900, color: page >= 600 ? "#5be08a" : devilTime ? "#ff8a6a" : "#f1ece2" }}>{page} <span style={{ fontSize: 32, color: "#a0a5b0" }}>/ 600</span></div>
      </div>
    )}
  </>;
};

export const Film05: React.FC<{ qa?: number[] }> = ({ qa }) => {
  const f0 = useCurrentFrame();
  const f = qa && qa.length ? qa[Math.min(qa.length - 1, f0)] : f0;
  const t = f / FPS;
  const cut = CUTS.find((cu) => t >= cu.t0 && t < cu.t1);
  const lb = letterbox(t);
  const [flashCol, flashOp] = flashOf(t);
  const mem = memAt(t);
  const inMem = MEM.some(([a, b]) => t >= a && t < b);
  const devilTime = t >= 84.1 && t < 120.9;
  const daysOp = Math.max(k(t, [0, 0.2, 3.1, 3.2], [0, 1, 1, 0]), k(t, [4.55, 4.6, 122.6, 123.0], [0, 1, 1, 0]));
  const pageOp = k(t, [16.2, 16.5, 114.3, 114.6], [0, 1, 1, 0]);
  const days = daysAt(t), page = pageAt(t);
  const slam = t >= 84.15 && t < 86.1;
  const slamS = 1.6 - 0.6 * sm((t - 84.15) / 0.16);
  const ring = t >= 84.15 && t < 84.8 ? (t - 84.15) / 0.65 : -1;
  const title = k(t, [167.5, 167.9, 173.4, 174], [0, 1, 1, 0]);
  // the rewind: a big counter in the middle, then it flies to the top left
  const rw = t >= 3.3 && t < 4.6;
  const fly = sm((t - 4.2) / 0.4);
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      <AbsoluteFill style={{ filter: inMem ? `grayscale(${0.9 * mem}) sepia(${0.25 * mem}) contrast(${1 + 0.05 * mem}) brightness(${1 - 0.08 * mem})` : undefined }}>
        {cut && <CutView cut={cut} t={t} />}
        <Phones t={t} />
        {inMem && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)", opacity: mem }} />}
      </AbsoluteFill>
      {t >= 126.9 && t < 131.1 && <NoteBirthday t={t} />}
      {CAPS.map((l, i) => <CapView key={i} l={l} t={t} />)}
      <AbsoluteFill style={{ transform: `translateY(${lb}px)` }}>
        <Counters t={t} days={days} page={page} devilTime={devilTime} daysOp={daysOp * (inMem ? 0 : 1)} pageOp={pageOp} />
      </AbsoluteFill>
      {rw && (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: mix(960, 60 + 125, fly), top: mix(470, 30 + 60, fly), transform: `translate(-50%, -50%) scale(${mix(2.2, 1, fly)})`, opacity: 1 - sm((t - 4.5) / 0.1),
            fontFamily: "Avenir Next", color: "#f1ece2", textAlign: "center", textShadow: "0 2px 8px #000" }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, opacity: 0.9 }}>EXAM IN</div>
            <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1, transform: `translateY(${t < 3.95 ? Math.sin(t * 60) * 3 : 0}px)` }}>{days} <span style={{ fontSize: 40, fontWeight: 800 }}>DAYS</span></div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: "Avenir Next", fontWeight: 700, fontSize: 40, letterSpacing: 12, color: "#c9c4b8",
            opacity: k(t, [3.5, 3.7, 4.2, 4.45], [0, 1, 1, 0]) }}>4 DAYS EARLIER</div>
        </AbsoluteFill>
      )}
      {slam && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k(t, [84.15, 84.22, 85.7, 86.1], [0, 1, 1, 0]) }}>
          <div style={{ transform: `scale(${slamS}) translate(${Math.sin(t * 90) * 7 * Math.exp(-(t - 84.15) * 4)}px, 0)`, fontFamily: "Avenir Next", fontWeight: 900, fontSize: 200,
            letterSpacing: 26, color: "#ff3b2a", textShadow: "0 0 40px rgba(255,40,20,0.95), 0 0 90px rgba(255,40,20,0.6), 0 6px 0 #3a0000", paddingLeft: 26 }}>DEVIL MODE</div>
        </AbsoluteFill>
      )}
      {ring >= 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={960} cy={540} r={60 + ring * 1300} fill="none" stroke="#ff3b2a" strokeWidth={34 * (1 - ring) + 2} opacity={1 - ring} />
        </svg>
      )}
      {t >= 166.5 && (
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
  const op = k(t, [126.9, 127.15, 130.8, 131.1], [0, 1, 1, 0]);
  const rise = sm((t - 126.9) / 0.35);
  return (
    <div style={{ position: "absolute", left: 440, top: 120 + (1 - rise) * 80, width: 920, height: 800, background: "#fbfaf4", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
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
