// Owen and the Pull: one rig, two renderers (port of design/v5_white.py, signed off 19 Oct 2026).
// A figure is an ordered list of parts (closed paths) and details (face, shading). Owen draws the parts as
// white shapes with thin dark outlines; the Pull draws the very same parts as one black silhouette with an
// amber rim (outline pass, then fill pass, so inner edges disappear) plus lit eyes and a smile.
import React from "react";
import { V2, add, sub, mul, lerp, lerpN, norm, perp, fmt, tube, seg, angleDeg } from "./geom";

export const C = {
  white: "#e9e3d3",
  far: "#b6b0a3",
  line: "#3a3a3e",
  hair: "#25222a",
  shade: "#d3cec2",
  shadow: "#070709",
  amber: "#f2a33a",
  amberHi: "#ffd690",
  amberCore: "#fff1cf",
  eye: "#141217",
  mouth: "#2a2326",
};

export type Kind = "skin" | "far" | "hair" | "tail";
type Part = { kind: "part"; d: string; mat: Kind; union?: boolean; tf?: string };
type Detail = { kind: "detail"; hero?: React.ReactNode; shadow?: React.ReactNode; tf?: string };
export type Item = Part | Detail;

const FILL: Record<Kind, string> = { skin: C.white, far: C.far, hair: C.hair, tail: C.shadow };

// ------------------------------------------------------------------ poses
export type Pose = {
  t: number; // head turn: 0 = facing camera, 1 = profile facing right, negative = toward the left
  head: V2;
  tilt: number;
  top: V2;
  bot: V2;
  ws: number;
  wh: number;
  shL: V2; elL: V2; wrL: V2;
  shR: V2; elR: V2; wrR: V2;
  hpL: V2; knL: V2; anL: V2;
  hpR: V2; knR: V2; anR: V2;
};

const V2_KEYS = ["head", "top", "bot", "shL", "elL", "wrL", "shR", "elR", "wrR", "hpL", "knL", "anL", "hpR", "knR", "anR"] as const;

export function lerpPose(a: Pose, b: Pose, u: number): Pose {
  const out = { ...a } as Pose;
  for (const k of V2_KEYS) (out as Record<string, unknown>)[k] = lerp(a[k], b[k], u);
  out.t = lerpN(a.t, b.t, u);
  out.tilt = lerpN(a.tilt, b.tilt, u);
  out.ws = lerpN(a.ws, b.ws, u);
  out.wh = lerpN(a.wh, b.wh, u);
  return out;
}

// ------------------------------------------------------------------ expressions
export type Expr = {
  lid: number; lx: number; ly: number; mc: number; mw: number; mo: number; es: number;
  bi: number; bo: number; bags: number; asym: number; firm: number;
};
const E = (o: Partial<Expr>): Expr => ({ lid: 0, lx: 0, ly: 0, mc: 2, mw: 16, mo: 0, es: 1, bi: 0, bo: 0, bags: 0, asym: 0, firm: 0, ...o });
export const EXPR = {
  neutral: E({ lid: 0.36, mc: 1, mw: 15, bi: 1, bo: 1 }),
  worn: E({ lid: 0.55, ly: 2, mc: 0, mw: 13, bi: 2, bo: 4, bags: 1 }),
  ashamed: E({ lid: 0.5, lx: -2, ly: 6, mc: -4, mw: 13, bi: -6, bo: 3 }),
  caught: E({ ly: -1, mc: 0, mw: 9, mo: 1, es: 1.15, bi: -7, bo: -7 }),
  tempted: E({ lid: 0.38, lx: 5, ly: 3, mc: 3, mw: 13, bi: 0, bo: -4, asym: 1 }),
  decided: E({ lid: 0.42, mc: 0, mw: 16, bi: 4, bo: -1, firm: 1 }),
  smile: E({ lid: 0.36, mc: 1, mw: 15, bi: 1, bo: 1 }),
};
export type ExprName = keyof typeof EXPR;

export function lerpExpr(a: Expr, b: Expr, u: number): Expr {
  const o = {} as Expr;
  for (const k of Object.keys(a) as (keyof Expr)[]) o[k] = lerpN(a[k], b[k], u);
  return o;
}

// ------------------------------------------------------------------ builder
const R = 84; // the genre-standard big round head
const KF = R / 70; // face features keep their layout, scaled to the head
const CIRCLE = `M0,${-R} C${R * 0.55},${-R} ${R},${-R * 0.55} ${R},0 C${R},${R * 0.55} ${R * 0.55},${R} 0,${R} C${-R * 0.55},${R} ${-R},${R * 0.55} ${-R},0 C${-R},${-R * 0.55} ${-R * 0.55},${-R} 0,${-R} Z`;

class Builder {
  items: Item[] = [];
  n = 0;
  constructor(public idp: string) {}
  part(d: string, mat: Kind, tf?: string, union = false) {
    this.items.push({ kind: "part", d, mat, tf, union });
  }
  detail(hero?: React.ReactNode, shadow?: React.ReactNode, tf?: string) {
    this.items.push({ kind: "detail", hero, shadow, tf });
  }
  /** Soft shading inside a part, clipped to it. */
  shade(d: string, cx: number, cy: number, rx: number, ry: number, col: string, op: number) {
    const id = `${this.idp}-c${this.n++}`;
    return (
      <>
        <clipPath id={id}><path d={d} /></clipPath>
        <g clipPath={`url(#${id})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={col} opacity={op} filter="url(#b10)" />
        </g>
      </>
    );
  }
}

/** Eye set used by both faces. mine = Owen's own (highlight, brows, bags); otherwise the Pull wearing his eyes. */
function eyeSet(e: Expr, t: number, fx: number, sp: number, eye: string, lidFill: string, lash: string, mine: boolean, key: string) {
  const eyes: V2[] = t <= 0.82 ? [[fx - sp, 4], [fx + sp, 4]] : [[fx + sp, 4]];
  const out: React.ReactNode[] = [];
  eyes.forEach(([ex, ey], i) => {
    const side = eyes.length === 2 && i === 0 ? -1 : 1;
    const es = e.es;
    const cx = ex + e.lx, cy = ey + e.ly;
    out.push(<ellipse key={`${key}e${i}`} cx={cx} cy={cy} rx={6.2 * es} ry={7.4 * es} fill={eye} />);
    if (mine) out.push(<circle key={`${key}h${i}`} cx={cx - 1.8} cy={cy - 2.6} r={1.8 * es} fill="#fff" />);
    if (e.lid > 0.02) {
      const top = ey - 9.5 * es, low = top + e.lid * 17 * es;
      out.push(
        <g key={`${key}l${i}`}>
          <path d={`M${ex - 9},${top - 2} L${ex + 9},${top - 2} L${ex + 9},${low} Q${ex},${low + 2} ${ex - 9},${low} Z`} fill={lidFill} />
          <path d={`M${ex - 8},${low + 0.3} Q${ex},${low + 2.2} ${ex + 8},${low + 0.3}`} fill="none" stroke={lash} strokeWidth={2.4} strokeLinecap="round" />
        </g>,
      );
    }
    if (mine && e.bags > 0.02) {
      out.push(<path key={`${key}b${i}`} d={`M${ex - 6},${ey + 11} Q${ex},${ey + 14} ${ex + 6},${ey + 11}`} fill="none" stroke="#9e9b94" strokeWidth={1.8} strokeLinecap="round" opacity={e.bags} />);
    }
    if (mine) {
      let bi = e.bi, bo = e.bo;
      if (side === 1) { bi = lerpN(bi, -7, e.asym); bo = lerpN(bo, -8, e.asym); }
      const by = ey - 17;
      const inner: V2 = [ex - 6 * side, by + bi * 0.5];
      const outer: V2 = [ex + 8 * side, by + bo * 0.5];
      const mid: V2 = [ex + 1 * side, by - 1.5 + (bi + bo) * 0.2];
      const bw = 4.0 + 0.6 * e.firm;
      out.push(<path key={`${key}w${i}`} d={tube(inner, mid, outer, (u) => bw - 1.6 * u)} fill={C.hair} />);
    }
  });
  return out;
}

/** Round head, nothing on top. The Pull draws its own face: its slit eyes, crossfading to HIS eyes at the reveal. */
function head(B: Builder, p: Pose, e: Expr, reveal: number) {
  const flip = p.t < 0;
  const t = Math.abs(p.t);
  const [hx, hy] = p.head;
  const tf = `translate(${hx.toFixed(1)},${(hy + 6).toFixed(1)}) rotate(${p.tilt.toFixed(2)})${flip ? " scale(-1,1)" : ""}`;
  B.part(CIRCLE, "skin", tf);
  B.detail(B.shade(CIRCLE, 40 + 6 * t, 40, 50, 46, C.shade, 0.75), undefined, tf);
  const fx = 31 * t;
  const sp = 22 * (1 - 0.35 * t);
  const hs: React.ReactNode[] = eyeSet(e, t, fx, sp, C.eye, C.white, C.eye, true, "o");
  const mx = fx + 3 + 5 * t, my = 32, mw = e.mw * (1 - 0.3 * t);
  if (e.mo > 0.5) {
    hs.push(<ellipse key="mo" cx={mx} cy={my + 2} rx={5} ry={6} fill="#3a2a2a" />);
  } else {
    const y1 = my - 2.5 * e.asym;
    hs.push(<path key="m" d={`M${mx - mw / 2},${my} Q${mx},${my + e.mc} ${mx + mw / 2},${y1}`} fill="none" stroke={C.mouth} strokeWidth={2.8 + 0.4 * e.firm} strokeLinecap="round" />);
  }
  // the Pull's face
  const slits: React.ReactNode[] = [];
  const eyes: V2[] = t <= 0.82 ? [[fx - sp, 4], [fx + sp, 4]] : [[fx + sp, 4]];
  eyes.forEach(([ex, ey], i) => {
    slits.push(
      <g key={`s${i}`}>
        <path d={`M${ex - 11},${ey + 1} Q${ex},${ey - 9} ${ex + 11},${ey + 1} Q${ex},${ey + 5} ${ex - 11},${ey + 1} Z`} fill={C.amber} filter="url(#b3)" />
        <path d={`M${ex - 10},${ey + 1} Q${ex},${ey - 7.5} ${ex + 10},${ey + 1} Q${ex},${ey + 4.5} ${ex - 10},${ey + 1} Z`} fill={C.amberCore} />
      </g>,
    );
  });
  const his = eyeSet({ ...EXPR.neutral }, t, fx, sp, C.amberCore, C.shadow, C.amber, false, "p");
  const sw = 26 * (1 - 0.3 * t);
  const smile = `M${mx - sw / 2},${my - 2} Q${mx},${my + 11} ${mx + sw / 2},${my - 4}`;
  const ss = (
    <>
      <g opacity={1 - reveal}>{slits}</g>
      <g opacity={reveal}>
        <g filter="url(#b3)" opacity={0.9}>{his}</g>
        {his}
      </g>
      <path d={smile} fill="none" stroke={C.amber} strokeWidth={7} strokeLinecap="round" filter="url(#b3)" />
      <path d={smile} fill="none" stroke={C.amberCore} strokeWidth={3} strokeLinecap="round" />
    </>
  );
  B.detail(<>{hs}</>, ss, `${tf} scale(${KF.toFixed(3)})`);
}

function body(B: Builder, top: V2, bot: V2, ws: number, wh: number) {
  const u = norm(sub(bot, top)), n = perp(u);
  const shL = add(add(top, mul(n, ws / 2)), mul(u, 26)), shR = add(sub(top, mul(n, ws / 2)), mul(u, 26));
  const cL = add(top, mul(n, ws / 2 - 34)), cR = sub(top, mul(n, ws / 2 - 34));
  const hL = add(bot, mul(n, wh / 2)), hR = sub(bot, mul(n, wh / 2));
  const kL = add(top, mul(n, ws / 2)), kR = sub(top, mul(n, ws / 2));
  const d = `M${fmt(cR)} L${fmt(cL)} Q${fmt(kL)} ${fmt(shL)} L${fmt(hL)} Q${fmt(add(bot, mul(u, 16)))} ${fmt(hR)} L${fmt(shR)} Q${fmt(kR)} ${fmt(cR)} Z`;
  B.part(d, "skin");
  const mid = lerp(top, bot, 0.55);
  B.detail(B.shade(d, mid[0] + ws * 0.36, mid[1], ws * 0.24, Math.abs(bot[1] - top[1]) * 0.6, C.shade, 0.85));
}

/** One limb = one rounded tube (two joined segments drawn as one shape: outline pass + fill pass, no seam).
 *  ext lengthens the end, because there is no hand or foot after it. */
function limb(B: Builder, a: V2, b: V2, c: V2, w0: number, w2: number, mat: Kind, ext: number) {
  const c2 = add(c, mul(norm(sub(c, b)), ext));
  const w1 = (w0 + w2) / 2;
  B.part(seg(a, b, w0, w1) + " " + seg(b, c2, w1, w2), mat, undefined, true);
}

const arm = (B: Builder, sh: V2, el: V2, wr: V2, mat: Kind) => limb(B, sh, el, wr, 32, 29, mat, 14);
const leg = (B: Builder, hp: V2, kn: V2, an: V2, mat: Kind) => limb(B, hp, kn, an, 36, 33, mat, 8);

/** The Pull's lower body: the silhouette narrows into one thread that ends on the object.
 *  tension: 0 slack (sags), 0.5 neutral, 1 taut (straight). release: 0..1, the thread draws back into it. */
function tail(B: Builder, bot: V2, to: V2, wh: number, tension: number, release: number) {
  const a: V2 = [bot[0], bot[1] - 8];
  const c = lerp(to, [a[0] + 26, a[1] + 74], release);
  const curved: V2 = [a[0] + (c[0] - a[0]) * 0.32, a[1] + (c[1] - a[1]) * 0.74];
  const straight = lerp(a, c, 0.5);
  const mid = tension < 0.5 ? lerp(add(curved, [0, 80]), curved, tension * 2) : lerp(curved, straight, (tension - 0.5) * 2);
  const w = (u: number) => (u < 0.26 ? Math.max(5, wh * 0.92 * Math.pow(1 - u / 0.26, 2.1)) : 5 - 2 * (u - 0.26));
  B.part(tube(a, mid, c, w, 64), "tail");
  const core = tube(a, mid, c, (u) => (u > 0.2 ? Math.max(1.4, w(u) * 0.12) : 1.4), 64);
  B.detail(undefined, <path d={core} fill={C.amberHi} opacity={(0.55 + 0.4 * tension) * (1 - release)} />);
}

export type BuildOpts = {
  idp: string;
  arms?: boolean;
  legs?: boolean;
  reveal?: number;
  tailTo?: V2 | null;
  tension?: number;
  release?: number;
  contact?: boolean;
};

export function buildFigure(p: Pose, e: Expr, o: BuildOpts): Item[] {
  const B = new Builder(o.idp);
  const arms = o.arms ?? true, legs = o.legs ?? true;
  if (legs && (o.contact ?? true)) {
    B.detail(<ellipse cx={8 + (p.anL[0] + p.anR[0]) / 2} cy={1} rx={66} ry={10} fill="url(#contact)" />);
  }
  if (arms) arm(B, p.shL, p.elL, p.wrL, "far");
  if (legs) {
    leg(B, p.hpL, p.knL, p.anL, "far");
    leg(B, p.hpR, p.knR, p.anR, "skin");
  }
  if (o.tailTo) tail(B, p.bot, o.tailTo, p.wh, o.tension ?? 0.5, o.release ?? 0);
  body(B, p.top, p.bot, p.ws * 0.98, p.wh * 1.0);
  head(B, p, e, o.reveal ?? 0);
  if (arms) arm(B, p.shR, p.elR, p.wrR, "skin");
  return B.items;
}

/** Where the near hand holds things (figure-local units). */
export function nearHand(p: Pose): { pos: V2; ang: number } {
  const d = norm(sub(p.wrR, p.elR));
  return { pos: add(p.wrR, mul(d, 18)), ang: angleDeg(d) };
}

// ------------------------------------------------------------------ renderers
export const Hero: React.FC<{ items: Item[] }> = ({ items }) => (
  <g strokeLinecap="round">
    {items.map((it, i) => {
      if (it.kind === "part") {
        const el = it.union ? (
          <>
            <path d={it.d} fill={C.line} stroke={C.line} strokeWidth={6} strokeLinejoin="round" />
            <path d={it.d} fill={FILL[it.mat]} />
          </>
        ) : (
          <path d={it.d} fill={FILL[it.mat]} stroke={C.line} strokeWidth={3} strokeLinejoin="round" />
        );
        return <g key={i} transform={it.tf}>{el}</g>;
      }
      return it.hero ? <g key={i} transform={it.tf}>{it.hero}</g> : null;
    })}
  </g>
);

export const Shadow: React.FC<{ items: Item[]; glow?: number; rim?: number }> = ({ items, glow = 1, rim = 3 }) => {
  const parts = items.filter((it): it is Part => it.kind === "part");
  return (
    <g strokeLinecap="round">
      {glow > 0.01 && (
        <g filter="url(#b10)" opacity={0.8 * glow}>
          {parts.map((it, i) => (
            <g key={i} transform={it.tf}><path d={it.d} fill="none" stroke={C.amber} strokeWidth={16} strokeLinejoin="round" /></g>
          ))}
        </g>
      )}
      {parts.map((it, i) => (
        <g key={`r${i}`} transform={it.tf}><path d={it.d} fill={C.amber} stroke={C.amber} strokeWidth={rim * 2} strokeLinejoin="round" /></g>
      ))}
      {parts.map((it, i) => (
        <g key={`f${i}`} transform={it.tf}><path d={it.d} fill={C.shadow} /></g>
      ))}
      {items.map((it, i) => (it.kind === "detail" && it.shadow ? <g key={`d${i}`} transform={it.tf}>{it.shadow}</g> : null))}
    </g>
  );
};

/** Stage 1: a small curl of shadow rising out of the phone, two slits already lit. */
export const Wisp: React.FC = () => {
  const body = "M0,-120 C-30,-122 -44,-96 -38,-70 C-34,-52 -16,-44 -6,-30 C2,-18 4,-8 2,0 C10,-14 18,-30 26,-48 C38,-74 34,-118 0,-120 Z";
  return (
    <g>
      <path d={body} fill="none" stroke={C.amber} strokeWidth={16} opacity={0.8} filter="url(#b10)" />
      <path d={body} fill={C.shadow} stroke={C.amber} strokeWidth={2.6} />
      <path d="M-18,-92 q6,-5 11,0 M4,-94 q6,-5 11,0" fill="none" stroke={C.amberCore} strokeWidth={3.2} strokeLinecap="round" />
    </g>
  );
};

export const SvgDefs: React.FC = () => (
  <defs>
    <filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="b10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
    <filter id="b24" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24" /></filter>
    <radialGradient id="contact" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#000" stopOpacity={0.7} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
    <radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={C.amber} stopOpacity={0.55} /><stop offset="0.5" stopColor={C.amber} stopOpacity={0.15} /><stop offset="1" stopColor={C.amber} stopOpacity={0} /></radialGradient>
    <radialGradient id="vig" cx="50%" cy="46%" r="72%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient>
    <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c1d21" /><stop offset="1" stopColor="#26272c" /></linearGradient>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#191b22" /><stop offset="1" stopColor="#2a2d36" /></linearGradient>
  </defs>
);
