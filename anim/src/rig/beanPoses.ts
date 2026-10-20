// Pose library for Bean / the Friend / the Devil (figure units, feet at y = 0, side poses face right).
import type { Pose } from "./figure";
import { lerpPose } from "./figure";
import type { V2 } from "./geom";

const P = (o: Record<string, unknown>) => o as unknown as Pose;
export const SIDE = P({ t: 0.95, head: [12, -384], tilt: 4, top: [3, -300], bot: [0, -150], ws: 100, wh: 92,
  shL: [-3, -284], elL: [-5, -222], wrL: [2, -168], shR: [6, -283], elR: [12, -222], wrR: [20, -168],
  hpL: [-3, -144], knL: [-5, -82], anL: [-9, -26], hpR: [5, -144], knR: [7, -82], anR: [8, -26] });
export const FRONT = P({ t: 0, head: [0, -384], tilt: 0, top: [0, -300], bot: [0, -150], ws: 152, wh: 130,
  shL: [-70, -284], elL: [-84, -222], wrL: [-88, -168], shR: [70, -284], elR: [84, -222], wrR: [88, -168],
  hpL: [-26, -144], knL: [-27, -82], anL: [-27, -26], hpR: [26, -144], knR: [27, -82], anR: [27, -26] });
export const TQ = P({ t: 0.5, head: [8, -384], tilt: 2, top: [3, -300], bot: [0, -150], ws: 134, wh: 116,
  shL: [-50, -284], elL: [-62, -222], wrL: [-66, -168], shR: [56, -283], elR: [70, -222], wrR: [74, -168],
  hpL: [-18, -144], knL: [-21, -82], anL: [-24, -26], hpR: [20, -144], knR: [24, -82], anR: [26, -26] });

const w = (p: Pose, o: Record<string, unknown>) => P({ ...p, ...o });
// side gestures
export const HOLD = w(SIDE, { shL: [-3, -284], elL: [20, -228], wrL: [46, -252], shR: [6, -283], elR: [30, -226], wrR: [58, -250] });
export const HOLD_DOWN = w(SIDE, { head: [14, -380], tilt: 14, elR: [16, -222], wrR: [34, -176], elL: [4, -222], wrL: [22, -178] });
export const RUB = w(SIDE, { head: [14, -380], tilt: 16, elR: [44, -244], wrR: [56, -324], elL: [20, -228], wrL: [46, -252] });
export const POINT = w(SIDE, { head: [18, -384], tilt: 0, top: [8, -300], elR: [62, -290], wrR: [118, -296], elL: [-8, -222], wrL: [-2, -168] });
export const PUMP = w(SIDE, { head: [10, -388], tilt: -4, elR: [44, -236], wrR: [40, -300], elL: [20, -228], wrL: [46, -252] });
export const FLINCH = w(SIDE, { head: [4, -386], tilt: -12, top: [-2, -302], elR: [26, -244], wrR: [44, -280], elL: [16, -244], wrL: [34, -282] });
export const SLUMP_STAND = w(SIDE, { head: [26, -362], tilt: 28, top: [10, -292], elR: [16, -220], wrR: [22, -166] });
export const TURN_AWAY = w(TQ, { t: -0.6, head: [-8, -384], tilt: -2 });
// seated (side): feet on the floor, hips on a seat 90 units up
export const SEAT = P({ t: 0.95, head: [46, -322], tilt: 16, top: [24, -244], bot: [0, -98], ws: 100, wh: 92,
  shL: [20, -230], elL: [36, -176], wrL: [62, -144], shR: [28, -228], elR: [50, -172], wrR: [74, -142],
  hpL: [-2, -92], knL: [62, -92], anL: [64, -26], hpR: [4, -90], knR: [68, -90], anR: [72, -26] });
export const SEAT_HOLD = w(SEAT, { elR: [50, -180], wrR: [78, -214], elL: [40, -182], wrL: [70, -216] });
export const SEAT_FLINCH = w(SEAT, { head: [36, -330], tilt: -10, elR: [44, -200], wrR: [60, -260] });
// front gestures
export const FRONT_HOLD = w(FRONT, { elR: [76, -226], wrR: [30, -236], elL: [-76, -226], wrL: [-30, -236] });
export const FRONT_WAVE = w(FRONT, { elR: [112, -300], wrR: [124, -366] });
export const FRONT_NOD = w(FRONT, { tilt: 8, head: [0, -378] });

/** Procedural side walk. phase in radians; returns a pose with the planted foot on the floor. */
export function walk(phase: number, base: Pose = SIDE, stride = 1): Pose {
  const hip: V2 = [0, -144];
  const leg = (ph: number): [V2, V2, V2] => {
    const th = 0.42 * stride * Math.sin(ph);
    const kb = 0.12 + 0.55 * Math.max(0, Math.sin(ph - 0.9));
    const kn: V2 = [hip[0] + 62 * Math.sin(th), hip[1] + 62 * Math.cos(th)];
    const an: V2 = [kn[0] + 56 * Math.sin(th - kb), kn[1] + 56 * Math.cos(th - kb)];
    return [hip, kn, an];
  };
  const [hpR, knR, anR] = leg(phase);
  const [hpL, knL, anL] = leg(phase + Math.PI);
  const drop = -26 - Math.max(anR[1], anL[1]); // keep the lower foot on the floor
  const sh = (p: V2): V2 => [p[0], p[1] + drop];
  const armSwing = (ph: number, s: V2): [V2, V2, V2] => {
    const a = -0.34 * stride * Math.sin(ph);
    const el: V2 = [s[0] + 60 * Math.sin(a), s[1] + 60 * Math.cos(a)];
    const wr: V2 = [el[0] + 54 * Math.sin(a + 0.3), el[1] + 54 * Math.cos(a + 0.3)];
    return [s, el, wr];
  };
  const [shR, elR, wrR] = armSwing(phase, base.shR);
  const [shL, elL, wrL] = armSwing(phase + Math.PI, base.shL);
  const bob = 3 * Math.cos(2 * phase);
  const o = { ...base } as Pose;
  Object.assign(o, {
    hpR: sh(hpR), knR: sh(knR), anR: sh(anR), hpL: sh(hpL), knL: sh(knL), anL: sh(anL),
    shR: sh(shR), elR: sh(elR), wrR: sh(wrR), shL: sh(shL), elL: sh(elL), wrL: sh(wrL),
    top: sh([base.top[0], base.top[1] + bob]), bot: sh(base.bot), head: sh([base.head[0], base.head[1] + bob]),
  });
  return o;
}

export type PKey = { t: number; pose: Pose };
/** Sample a pose from (time, pose) keys with smooth easing. */
export function poseAt(keys: PKey[], t: number): Pose {
  if (t <= keys[0].t) return keys[0].pose;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const u = (t - a.t) / Math.max(1e-6, b.t - a.t);
      const e = u * u * (3 - 2 * u);
      return lerpPose(a.pose, b.pose, e);
    }
  }
  return keys[keys.length - 1].pose;
}
