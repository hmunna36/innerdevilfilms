// Vector maths and the tapered-tube outline every limb is made of (port of design/proper.py).
export type V2 = [number, number];

export const add = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: V2, k: number): V2 => [a[0] * k, a[1] * k];
export const lerp = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
export const norm = (v: V2): V2 => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};
export const perp = (v: V2): V2 => [-v[1], v[0]];
export const fmt = (p: V2) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/** Point on the quadratic that passes through b at t = 0.5. */
export const qpt = (a: V2, b: V2, c: V2, t: number): V2 => {
  const cx = 2 * b[0] - (a[0] + c[0]) / 2;
  const cy = 2 * b[1] - (a[1] + c[1]) / 2;
  return [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * cx + t * t * c[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * cy + t * t * c[1],
  ];
};

/** Closed outline of a tube along a -> b -> c, width w(u), round caps. */
export function tube(a: V2, b: V2, c: V2, w: (u: number) => number, n = 26, cap = true): string {
  const P: V2[] = [];
  for (let i = 0; i <= n; i++) P.push(qpt(a, b, c, i / n));
  const L: V2[] = [];
  const R: V2[] = [];
  const T: V2[] = [];
  for (let i = 0; i <= n; i++) {
    const d = norm(sub(P[Math.min(i + 1, n)], P[Math.max(i - 1, 0)]));
    const nv = perp(d);
    const hw = w(i / n) / 2;
    L.push(add(P[i], mul(nv, hw)));
    R.push(sub(P[i], mul(nv, hw)));
    T.push(d);
  }
  const pts: V2[] = [...L];
  if (cap) {
    const w1 = w(1) / 2, d1 = T[n], n1 = perp(d1), e = P[n];
    for (let k = 1; k < 10; k++) {
      const ang = (Math.PI * k) / 10;
      pts.push(add(e, add(mul(n1, w1 * Math.cos(ang)), mul(d1, w1 * Math.sin(ang)))));
    }
  }
  for (let i = R.length - 1; i >= 0; i--) pts.push(R[i]);
  if (cap) {
    const w0 = w(0) / 2, d0 = T[0], n0 = perp(d0), s = P[0];
    for (let k = 1; k < 10; k++) {
      const ang = (Math.PI * k) / 10;
      pts.push(add(s, add(mul(n0, -w0 * Math.cos(ang)), mul(d0, -w0 * Math.sin(ang)))));
    }
  }
  return "M" + pts.map(fmt).join(" L") + " Z";
}

export const seg = (a: V2, b: V2, w0: number, w1: number) =>
  tube(a, lerp(a, b, 0.5), b, (u) => w0 + (w1 - w0) * u);

export const angleDeg = (v: V2) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
