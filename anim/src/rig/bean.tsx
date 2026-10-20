// Bean and the Devil, built to Harshad's own design brief (design/brief/bean_sheet.png, devil_arc.png, 19 Oct 2026).
// Bean: cream bean figure, big round head on a short neck, dark almond eyes with an orange glint, heavy black
// lash-line lids, thick tapered brows, eye bags, a short flat mouth, mitten hands, small round feet, and orange
// "stress" boxes over his head. The Devil: his inner voice. The same rig as a black silhouette with a red rim, red
// glowing horns, red slit eyes and a grin; below the waist it is smoke.
import React from "react";
import { V2, add, sub, mul, lerp, lerpN, norm, perp, fmt, tube, seg, angleDeg } from "./geom";
import type { Pose } from "./figure";

export const BC = {
  skin: "#efe3cf",
  shade: "#cfc4b3",
  far: "#d6c9b3",
  line: "#1a1a1a",
  iris: "#2e1d14",
  pupil: "#120b08",
  glint: "#ffa52e",
  bag: "#a89d8a",
  warm: "#f2994a",
  devil: "#090707",
  red: "#ff2d1f",
  redHi: "#ff7a5e",
  redCore: "#ffd2c4",
  sage: "#8fa37e",
  sageFar: "#768a66",
  hairF: "#3a2a22",
};

// ------------------------------------------------------------------ expressions (from the brief's 12)
export type BeanExpr = {
  lid: number; low: number; lx: number; ly: number; bi: number; bo: number; bw: number;
  mc: number; mw: number; mo: number; bags: number; es: number; red: number; asym: number;
};
const X = (o: Partial<BeanExpr>): BeanExpr => ({ lid: 0.42, low: 0, lx: 0, ly: 1, bi: -6, bo: 2, bw: 9, mc: 0, mw: 16, mo: 0, bags: 0.8, es: 1, red: 0, asym: 0, ...o });
export const BEAN_EXPR = {
  neutral: X({}),
  worried: X({ bi: -13, bo: 5, lid: 0.42, mc: -2 }),
  sad: X({ bi: -15, bo: 7, lid: 0.55, ly: 4, mc: -5, mw: 16 }),
  confused: X({ bi: -8, bo: 2, asym: 1, mo: 1, lid: 0.3 }),
  tired: X({ lid: 0.62, bi: 0, bo: 2, mc: -1, bags: 1 }),
  suspicious: X({ lid: 0.5, low: 0.45, bi: 4, bo: -2, lx: 4, asym: 0.6 }),
  surprised: X({ lid: 0.05, bi: -12, bo: -10, mo: 1, es: 1.08, bags: 0.5 }),
  angry: X({ lid: 0.4, low: 0.25, bi: 9, bo: -5, mc: -3, bw: 9 }),
  thinking: X({ lid: 0.45, bi: -2, bo: -4, lx: -4, ly: -3, mw: 14, asym: 0.5 }),
  annoyed: X({ lid: 0.55, low: 0.3, bi: 5, bo: -1, mc: -1 }),
  determined: X({ lid: 0.38, low: 0.15, bi: 7, bo: -4, mc: 0, mw: 22, bw: 9, bags: 0.4 }),
  control: X({ lid: 0.35, low: 0.2, bi: 6, bo: -3, mc: -2, red: 1, bags: 0.9 }),
};
export type BeanExprName = keyof typeof BEAN_EXPR;
export function lerpBeanExpr(a: BeanExpr, b: BeanExpr, u: number): BeanExpr {
  const o = {} as BeanExpr;
  for (const k of Object.keys(a) as (keyof BeanExpr)[]) o[k] = lerpN(a[k], b[k], u);
  return o;
}

export type DevilFace = "neutral" | "mischievous" | "manipulative" | "angry" | "laughing";

// ------------------------------------------------------------------ builder
type Part = { kind: "part"; d: string; fill: string; union?: boolean; tf?: string };
type Detail = { kind: "detail"; hero?: React.ReactNode; devil?: React.ReactNode; tf?: string };
export type BItem = Part | Detail;

class Builder {
  items: BItem[] = [];
  n = 0;
  constructor(public idp: string) {}
  part(d: string, fill: string, tf?: string, union = false) { this.items.push({ kind: "part", d, fill, tf, union }); }
  detail(hero?: React.ReactNode, devil?: React.ReactNode, tf?: string) { this.items.push({ kind: "detail", hero, devil, tf }); }
  id(p: string) { return `${this.idp}-${p}${this.n++}`; }
  shade(d: string, cx: number, cy: number, rx: number, ry: number, col: string, op: number, blur = "bb10") {
    const id = this.id("c");
    return (
      <>
        <clipPath id={id}><path d={d} /></clipPath>
        <g clipPath={`url(#${id})`}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={col} opacity={op} filter={`url(#${blur})`} /></g>
      </>
    );
  }
}

const R = 84;
const CIRCLE = `M0,${-R} C${R * 0.55},${-R} ${R},${-R * 0.55} ${R},0 C${R},${R * 0.55} ${R * 0.55},${R} 0,${R} C${-R * 0.55},${R} ${-R},${R * 0.55} ${-R},0 C${-R},${-R * 0.55} ${-R * 0.55},${-R} 0,${-R} Z`;

function face(B: Builder, t: number, e: BeanExpr, devilFace: DevilFace, tf: string) {
  const fx = 34 * t;
  const sp = 31 * (1 - 0.35 * t);
  const eyes: V2[] = t <= 0.82 ? [[fx - sp, 4], [fx + sp, 4]] : [[fx + sp, 4]];
  const hero: React.ReactNode[] = [];
  const devil: React.ReactNode[] = [];
  const glint = e.red > 0.5 ? BC.red : BC.glint;
  eyes.forEach(([ex, ey], i) => {
    const s = eyes.length === 2 && i === 0 ? -1 : 1; // -1 = the screen-left eye; its outer corner is on the left
    const es = e.es;
    const k = 1 - 0.3 * t; // the eye narrows as the head turns
    // the brief's eye: a straight thick lid line on top, a rounded bottom, light whites either side,
    // a tall dark iris in the middle with a bright orange glint bar
    const W = 19 * es, top = -10, bot = 13 * es;
    const lidY = top + Math.max(0, e.lid - 0.42) * 22; // the lid line comes down only when he tires
    const opening = `M${-W},${top} L${W},${top} C${W},${top + 12} ${W * 0.55},${bot} 0,${bot} C${-W * 0.55},${bot} ${-W},${top + 12} ${-W},${top} Z`;
    const g = `translate(${ex.toFixed(1)},${ey.toFixed(1)}) rotate(${(s * 5).toFixed(1)}) scale(${k.toFixed(3)},1)`;
    const cid = B.id("eye");
    const ix = e.lx, iy = e.ly + 1;
    hero.push(
      <g key={`bag${i}`} opacity={e.bags}>
        <ellipse cx={ex} cy={ey + 21} rx={19} ry={7} fill={BC.shade} opacity={0.85} filter="url(#bb3)" />
        <path d={`M${ex - 15},${ey + 18} Q${ex},${ey + 26} ${ex + 15},${ey + 18}`} fill="none" stroke={BC.bag} strokeWidth={2.2} strokeLinecap="round" />
      </g>,
    );
    hero.push(
      <g key={`eye${i}`} transform={g}>
        <clipPath id={cid}><path d={opening} /></clipPath>
        <path d={opening} fill="url(#bSclera)" />
        <g clipPath={`url(#${cid})`}>
          <rect x={ix - 14 * es} y={top - 2} width={28 * es} height={bot - top + 4} rx={11 * es} fill={e.red > 0.5 ? "url(#bRedIris)" : "url(#bIris)"} />
          <rect x={ix - 2.5} y={iy - 5} width={5} height={9} rx={1.5} fill={glint} filter="url(#bb3)" opacity={0.7} />
          <rect x={ix - 2.5} y={iy - 5} width={5} height={9} rx={1.5} fill={glint} />
          <rect x={-W - 4} y={top - 24} width={2 * W + 8} height={lidY - top + 24} fill={BC.skin} />
          {e.low > 0.02 && <rect x={-W - 4} y={bot - e.low * 14} width={2 * W + 8} height={24} fill={BC.skin} />}
        </g>
        <path d={`M${-W + 1},${top + 2} C${-W},${top + 12} ${-W * 0.55},${bot} 0,${bot} C${W * 0.55},${bot} ${W},${top + 12} ${W - 1},${top + 2}`} fill="none" stroke={BC.line} strokeWidth={1.6} opacity={0.5} />
        <path d={`M${-W - 3},${lidY} L${W + 3},${lidY}`} stroke={BC.line} strokeWidth={7} strokeLinecap="round" />
        {e.red > 0.01 && <ellipse cx={0} cy={0} rx={W + 8} ry={bot + 6} fill={BC.red} opacity={0.4 * e.red} filter="url(#bb6)" />}
      </g>,
    );
    // thick brows with round ends, heaviest in the middle
    let bi = e.bi, bo = e.bo;
    if (s === 1) { bi = lerpN(bi, -11, e.asym); bo = lerpN(bo, -8, e.asym); }
    const by = ey - 19;
    const inner: V2 = [ex - 15 * s, by + bi];
    const outer: V2 = [ex + 21 * s, by + bo];
    const mid: V2 = [ex + 2 * s, by - 5 + (bi + bo) * 0.35];
    hero.push(<path key={`brow${i}`} d={tube(inner, mid, outer, (u) => e.bw * (0.75 + 0.45 * Math.sin(Math.PI * u)))} fill={BC.line} />);
    // the Devil's eyes: red slits angled down toward the nose
    const o: V2 = [ex + 15 * s, ey - 6], n: V2 = [ex - 12 * s, ey + 3];
    const slit = devilFace === "manipulative"
      ? `M${fmt(o)} Q${ex},${ey - 4} ${fmt(n)} Q${ex},${ey + 3} ${fmt(o)} Z`
      : `M${fmt(o)} Q${ex + 1 * s},${ey - 9} ${fmt(n)} Q${ex},${ey + 7} ${fmt(o)} Z`;
    devil.push(
      <g key={`dev${i}`}>
        <path d={slit} fill={BC.red} filter="url(#bb4)" />
        <path d={slit} fill={BC.red} />
        <path d={slit} fill={BC.redCore} transform={`translate(${ex},${ey}) scale(0.55) translate(${-ex},${-ey})`} />
      </g>,
    );
  });
  // mouth
  const mx = fx + 2 + 4 * t, my = 44, mw = e.mw * (1 - 0.3 * t);
  if (e.mo > 0.5) {
    hero.push(<path key="mo" d={`M${mx - 7},${my + 3} Q${mx},${my - 7} ${mx + 7},${my + 3} Q${mx},${my + 7} ${mx - 7},${my + 3} Z`} fill={BC.line} />);
  } else {
    hero.push(<path key="m" d={`M${mx - mw / 2},${my} Q${mx},${my + e.mc} ${mx + mw / 2},${my}`} fill="none" stroke={BC.line} strokeWidth={3.2} strokeLinecap="round" />);
  }
  // the Devil's grin
  const gw = 54 * (1 - 0.3 * t);
  let grin: React.ReactNode;
  if (devilFace === "laughing") {
    const d = `M${mx - gw / 2},${my - 8} Q${mx},${my + 30} ${mx + gw / 2},${my - 8} Q${mx},${my + 4} ${mx - gw / 2},${my - 8} Z`;
    grin = <><path d={d} fill={BC.red} filter="url(#bb4)" /><path d={d} fill={BC.red} /><path d={`M${mx - gw / 2 + 8},${my - 2} L${mx + gw / 2 - 8},${my - 2}`} stroke={BC.redCore} strokeWidth={2} /></>;
  } else if (devilFace === "angry") {
    const d = `M${mx - gw / 2.4},${my + 2} Q${mx},${my - 10} ${mx + gw / 2.4},${my + 2}`;
    grin = <><path d={d} fill="none" stroke={BC.red} strokeWidth={8} strokeLinecap="round" filter="url(#bb4)" /><path d={d} fill="none" stroke={BC.redHi} strokeWidth={3.6} strokeLinecap="round" /></>;
  } else {
    const lift = devilFace === "mischievous" ? 8 : 0;
    const d = `M${mx - gw / 2},${my - 8} Q${mx},${my + 16} ${mx + gw / 2},${my - 8 - lift}`;
    grin = <><path d={d} fill="none" stroke={BC.red} strokeWidth={8} strokeLinecap="round" filter="url(#bb4)" /><path d={d} fill="none" stroke={BC.redHi} strokeWidth={3.6} strokeLinecap="round" /></>;
  }
  devil.push(<g key="grin">{grin}</g>);
  B.detail(<>{hero}</>, <>{devil}</>, tf);
}

function head(B: Builder, p: Pose, e: BeanExpr, horns: number, devilFace: DevilFace, friend = false) {
  const flip = p.t < 0;
  const t = Math.abs(p.t);
  const [hx, hy] = p.head;
  const tf = `translate(${hx.toFixed(1)},${(hy - 6).toFixed(1)}) rotate(${p.tilt.toFixed(2)})${flip ? " scale(-1,1)" : ""}`;
  if (horns > 0.01) {
    // two crescent horns, sliding back as the head turns; scale grows them in
    const hs = `${tf} translate(0,-60) scale(${horns.toFixed(3)}) translate(0,60)`;
    for (const s of [-1, 1]) {
      const bx = (s * 44 - 10 * t);
      const d = `M${bx - 14 * s},-58 C${bx - 20 * s},-92 ${bx - 4 * s},-118 ${bx + 16 * s},-126 C${bx + 2 * s},-104 ${bx + 2 * s},-82 ${bx + 14 * s},-66 Z`;
      if (!(t > 0.82 && s === -1)) B.part(d, BC.skin, hs);
    }
  }
  if (friend) B.part("M-60,10 C-96,20 -104,70 -82,96 C-76,72 -66,52 -52,40 Z", BC.hairF, tf); // ponytail, behind
  B.part(CIRCLE, BC.skin, tf);
  B.detail(B.shade(CIRCLE, 44 + 8 * t, 44, 62, 58, BC.shade, 0.8), undefined, tf);
  if (friend) B.part("M-86,-2 C-92,-72 -42,-98 6,-96 C54,-94 92,-62 86,-6 C72,-30 50,-46 18,-48 C-12,-50 -42,-32 -62,-16 C-74,-8 -82,-4 -86,-2 Z", BC.hairF, tf);
  face(B, t, e, devilFace, tf);
}

function body(B: Builder, top: V2, bot: V2, ws: number, wh: number, fill: string = BC.skin) {
  const u = norm(sub(bot, top)), n = perp(u);
  const shL = add(add(top, mul(n, ws / 2)), mul(u, 30)), shR = add(sub(top, mul(n, ws / 2)), mul(u, 30));
  const cL = add(top, mul(n, ws / 2 - 40)), cR = sub(top, mul(n, ws / 2 - 40));
  const hL = add(bot, mul(n, wh / 2)), hR = sub(bot, mul(n, wh / 2));
  const kL = add(top, mul(n, ws / 2)), kR = sub(top, mul(n, ws / 2));
  const d = `M${fmt(cR)} L${fmt(cL)} Q${fmt(kL)} ${fmt(shL)} L${fmt(hL)} Q${fmt(add(bot, mul(u, 14)))} ${fmt(hR)} L${fmt(shR)} Q${fmt(kR)} ${fmt(cR)} Z`;
  B.part(d, fill);
  const mid = lerp(top, bot, 0.55);
  B.detail(B.shade(d, mid[0] + ws * 0.36, mid[1], ws * 0.24, Math.abs(bot[1] - top[1]) * 0.6, BC.shade, 0.9));
}

function limb(B: Builder, a: V2, b: V2, c: V2, w0: number, w2: number, fill: string, ext = 0) {
  const c2 = add(c, mul(norm(sub(c, b)), ext));
  const w1 = (w0 + w2) / 2;
  B.part(seg(a, b, w0, w1) + " " + seg(b, c2, w1, w2), fill, undefined, true);
}

function arm(B: Builder, sh: V2, el: V2, wr: V2, fill: string, handFill?: string) {
  limb(B, sh, el, wr, 27, 23, fill, 2);
  const d = norm(sub(wr, el));
  const hp = add(wr, mul(d, 12));
  B.part(`M0,-15 C9,-15 14,-8 14,1 C14,10 8,16 0,16 C-8,16 -13,10 -13,1 C-13,-8 -9,-15 0,-15 Z`, handFill ?? fill,
    `translate(${hp[0].toFixed(1)},${hp[1].toFixed(1)}) rotate(${(angleDeg(d) - 90).toFixed(1)})`);
}

function leg(B: Builder, hp: V2, kn: V2, an: V2, fill: string) {
  limb(B, hp, kn, an, 33, 29, fill, 4);
  const [x, y] = an;
  B.part(`M${x - 14},${y + 22} C${x - 17},${y + 6} ${x - 9},${y} ${x + 2},${y} C${x + 16},${y} ${x + 27},${y + 8} ${x + 28},${y + 16} C${x + 29},${y + 24} ${x + 20},${y + 26} ${x + 10},${y + 26} L${x - 8},${y + 26} Q${x - 14},${y + 26} ${x - 14},${y + 22} Z`, fill);
}

/** The Devil's lower body: smoke that thins out and curls away instead of legs. */
function smoke(B: Builder, bot: V2, wh: number, swirl: number) {
  const a: V2 = [bot[0], bot[1] - 10];
  const c: V2 = [bot[0] - 40 + swirl * 10, bot[1] + 120];
  const mid: V2 = [bot[0] + 26, bot[1] + 60];
  B.part(tube(a, mid, c, (u) => Math.max(4, wh * 0.95 * Math.pow(1 - u, 1.5)), 40), BC.devil);
}

export type BuildBean = {
  idp: string;
  devil?: boolean;
  horns?: number;
  devilFace?: DevilFace;
  arms?: boolean;
  swirl?: number;
  contact?: boolean;
  view?: "front" | "side"; // front: both legs lit, both arms over the body
  headOnly?: boolean; // close-ups for sheets
  friend?: boolean; // the Friend: sage cardigan, dark ponytail, no eye bags
  notes?: boolean; // a sheet of notes in the near hand
};

export function buildBean(p: Pose, e: BeanExpr, o: BuildBean): BItem[] {
  const B = new Builder(o.idp);
  const devil = o.devil ?? false;
  const fr = o.friend ?? false;
  if (fr) e = { ...e, bags: 0 };
  if (o.headOnly) {
    head(B, p, e, o.horns ?? 0, o.devilFace ?? "neutral", fr);
    return B.items;
  }
  const arms = o.arms ?? true;
  if (!devil && (o.contact ?? true)) B.detail(<ellipse cx={8 + (p.anL[0] + p.anR[0]) / 2} cy={2} rx={70} ry={10} fill="url(#bContact)" />);
  const front = o.view === "front";
  const sleeveFar = devil ? BC.devil : fr ? BC.sageFar : BC.far, sleeve = devil ? BC.devil : fr ? BC.sage : BC.skin;
  const handFar = devil ? BC.devil : BC.far, hand = devil ? BC.devil : BC.skin;
  if (arms && !front) arm(B, p.shL, p.elL, p.wrL, sleeveFar, handFar);
  if (devil) smoke(B, p.bot, p.wh, o.swirl ?? 0);
  else {
    leg(B, p.hpL, p.knL, p.anL, front ? BC.skin : BC.far);
    leg(B, p.hpR, p.knR, p.anR, BC.skin);
  }
  body(B, p.top, p.bot, p.ws * 0.82, p.wh * 0.8, fr ? BC.sage : BC.skin);
  // short neck
  const up = norm(sub(p.top, p.bot));
  B.part(tube(add(p.top, mul(up, -6)), add(p.top, mul(up, 10)), add(p.top, mul(up, 26)), () => 38), BC.skin);
  if (arms && front) {
    arm(B, p.shL, p.elL, p.wrL, sleeve, hand);
    arm(B, p.shR, p.elR, p.wrR, sleeve, hand);
  }
  head(B, p, e, o.horns ?? 0, o.devilFace ?? "neutral", fr);
  if (arms && !front) arm(B, p.shR, p.elR, p.wrR, sleeve, hand);
  if (o.notes && arms) {
    const d = norm(sub(p.wrR, p.elR)), hp = add(p.wrR, mul(d, 16));
    B.detail(
      <g transform={`translate(${hp[0].toFixed(1)},${hp[1].toFixed(1)}) rotate(${(angleDeg(d) - 70).toFixed(1)})`}>
        <rect x={-16} y={-24} width={34} height={44} rx={2} fill="#f7f4ec" stroke={BC.line} strokeWidth={2} />
        <path d="M-10,-14 h22 M-10,-6 h22 M-10,2 h16 M-10,10 h20" stroke="#9c968a" strokeWidth={2} />
      </g>,
    );
  }
  return B.items;
}

export function beanHand(p: Pose): V2 {
  return add(p.wrR, mul(norm(sub(p.wrR, p.elR)), 14));
}

// ------------------------------------------------------------------ renderers
export const BeanSVG: React.FC<{ items: BItem[] }> = ({ items }) => (
  <g strokeLinecap="round">
    {items.map((it, i) => {
      if (it.kind === "part") {
        const el = it.union ? (
          <>
            <path d={it.d} fill={BC.line} stroke={BC.line} strokeWidth={5.2} strokeLinejoin="round" />
            <path d={it.d} fill={it.fill} />
          </>
        ) : (
          <path d={it.d} fill={it.fill} stroke={BC.line} strokeWidth={2.6} strokeLinejoin="round" />
        );
        return <g key={i} transform={it.tf}>{el}</g>;
      }
      return it.hero ? <g key={i} transform={it.tf}>{it.hero}</g> : null;
    })}
  </g>
);

export const DevilSVG: React.FC<{ items: BItem[]; glow?: number; rim?: string; fill?: string; detailOp?: number }> = ({
  items, glow = 1, rim = BC.red, fill = BC.devil, detailOp = 1 }) => {
  const parts = items.filter((it): it is Part => it.kind === "part");
  return (
    <g strokeLinecap="round">
      {glow > 0.01 && (
        <g filter="url(#bb12)" opacity={0.85 * glow}>
          {parts.map((it, i) => <g key={i} transform={it.tf}><path d={it.d} fill="none" stroke={rim} strokeWidth={18} strokeLinejoin="round" /></g>)}
        </g>
      )}
      {parts.map((it, i) => <g key={`r${i}`} transform={it.tf}><path d={it.d} fill={rim} stroke={rim} strokeWidth={5} strokeLinejoin="round" /></g>)}
      {parts.map((it, i) => <g key={`f${i}`} transform={it.tf}><path d={it.d} fill={fill} /></g>)}
      <g opacity={detailOp}>
        {items.map((it, i) => (it.kind === "detail" && it.devil ? <g key={`d${i}`} transform={it.tf}>{it.devil}</g> : null))}
      </g>
    </g>
  );
};

/** Wisps of smoke around the Devil (deterministic per frame). */
export const Smoke: React.FC<{ cx: number; cy: number; s: number; f: number; amount: number }> = ({ cx, cy, s, f, amount }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const ph = (i * 41) % 60, life = ((f * 1.2 + ph) % 60) / 60;
    const x = cx + (((i * 67) % 140) - 70) * s + Math.sin((f + i * 13) / 9) * 10 * s;
    const y = cy - life * 160 * s;
    const r = (14 + (i % 4) * 6) * s * (0.6 + life);
    out.push(<circle key={i} cx={x} cy={y} r={r} fill={BC.devil} opacity={0.55 * (1 - life) * amount} filter="url(#bb6)" />);
    out.push(<circle key={`e${i}`} cx={x} cy={y} r={r} fill="none" stroke={BC.red} strokeWidth={1.6} opacity={0.35 * (1 - life) * amount} filter="url(#bb3)" />);
  }
  return <g>{out}</g>;
};

/** The orange stress boxes over his head (from the brief). */
export const StressBoxes: React.FC<{ cx: number; cy: number; s: number; f: number; amount: number }> = ({ cx, cy, s, f, amount }) => {
  if (amount < 0.01) return null;
  const boxes: [number, number, number][] = [[-82, -12, -22], [0, -40, 0], [82, -12, 22]];
  return (
    <g opacity={amount}>
      {boxes.map(([dx, dy, rot], i) => {
        const bob = Math.sin((f + i * 10) / 8) * 4;
        const x = cx + dx * s, y = cy + (dy + bob) * s;
        return (
          <g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot}) scale(${s})`}>
            <rect x={-26} y={-13} width={52} height={26} rx={3} fill="none" stroke={BC.glint} strokeWidth={8} opacity={0.5} filter="url(#bb4)" />
            <rect x={-26} y={-13} width={52} height={26} rx={3} fill="none" stroke={BC.glint} strokeWidth={3.4} />
          </g>
        );
      })}
    </g>
  );
};

export const BeanDefs: React.FC = () => (
  <defs>
    <filter id="bb3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="bb4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="bb6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="bb10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
    <filter id="bb12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
    <filter id="bb30" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="30" /></filter>
    <radialGradient id="bContact" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#000" stopOpacity={0.7} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
    <filter id="bb1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" /></filter>
    <linearGradient id="bIris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0705" /><stop offset="0.65" stopColor="#1a100b" /><stop offset="1" stopColor="#2a1a11" /></linearGradient>
    <linearGradient id="bSclera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cdbfa9" /><stop offset="1" stopColor="#ece2d0" /></linearGradient>
    <radialGradient id="bRedIris" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#5a0d08" /><stop offset="1" stopColor="#1c0504" /></radialGradient>
    <radialGradient id="bWarm" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={BC.warm} stopOpacity={0.6} /><stop offset="0.55" stopColor={BC.warm} stopOpacity={0.18} /><stop offset="1" stopColor={BC.warm} stopOpacity={0} /></radialGradient>
    <radialGradient id="bRed" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={BC.red} stopOpacity={0.45} /><stop offset="1" stopColor={BC.red} stopOpacity={0} /></radialGradient>
    <radialGradient id="bPool" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={BC.glint} stopOpacity={0.5} /><stop offset="1" stopColor={BC.glint} stopOpacity={0} /></radialGradient>
    <radialGradient id="bVig" cx="50%" cy="46%" r="72%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.75} /></radialGradient>
    <linearGradient id="bWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0f17" /><stop offset="1" stopColor="#141821" /></linearGradient>
    <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1424" /><stop offset="1" stopColor="#1b2438" /></linearGradient>
  </defs>
);
