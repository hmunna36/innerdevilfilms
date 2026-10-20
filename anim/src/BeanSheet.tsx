// Design check (a still): Bean and the Devil as the rig draws them, to compare with design/brief/.
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Pose } from "./rig/figure";
import { BC, BEAN_EXPR, BeanDefs, BeanExprName, BeanSVG, DevilFace, DevilSVG, Smoke, StressBoxes, buildBean } from "./rig/bean";

const P = (o: Record<string, unknown>) => o as unknown as Pose;
const FRONT = P({ t: 0, head: [0, -384], tilt: 0, top: [0, -300], bot: [0, -150], ws: 152, wh: 130,
  shL: [-70, -284], elL: [-84, -222], wrL: [-88, -168], shR: [70, -284], elR: [84, -222], wrR: [88, -168],
  hpL: [-26, -144], knL: [-27, -82], anL: [-27, -26], hpR: [26, -144], knR: [27, -82], anR: [27, -26] });
const TQ = P({ t: 0.5, head: [8, -384], tilt: 2, top: [3, -300], bot: [0, -150], ws: 134, wh: 116,
  shL: [-50, -284], elL: [-62, -222], wrL: [-66, -168], shR: [56, -283], elR: [70, -222], wrR: [74, -168],
  hpL: [-18, -144], knL: [-21, -82], anL: [-24, -26], hpR: [20, -144], knR: [24, -82], anR: [26, -26] });
const SIDE = P({ t: 0.95, head: [12, -384], tilt: 4, top: [3, -300], bot: [0, -150], ws: 100, wh: 92,
  shL: [-3, -284], elL: [-5, -222], wrL: [2, -168], shR: [6, -283], elR: [12, -222], wrR: [20, -168],
  hpL: [-3, -144], knL: [-5, -82], anL: [-9, -26], hpR: [5, -144], knR: [7, -82], anR: [8, -26] });

const label = (x: number, y: number, t: string, c = "#9aa0aa", size = 18) => (
  <text x={x} y={y} fill={c} fontFamily="Avenir Next" fontSize={size} textAnchor="middle" letterSpacing={2}>{t}</text>
);
const title = (x: number, y: number, t: string, c = "#c9ccd3") => (
  <text x={x} y={y} fill={c} fontFamily="Avenir Next" fontSize={22} letterSpacing={4}>{t}</text>
);

export const BeanSheet: React.FC = () => {
  const FY = 520;
  const exprs: BeanExprName[] = ["neutral", "worried", "sad", "confused", "tired", "suspicious", "surprised", "angry", "thinking", "annoyed", "determined", "control"];
  const devilFaces: DevilFace[] = ["neutral", "mischievous", "manipulative", "angry", "laughing"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f17" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <BeanDefs />
        <rect width={1920} height={1080} fill="url(#bWall)" />
        {title(40, 50, "BEAN  ·  TURNAROUND (rig)")}
        <path d={`M30,${FY} H880`} stroke="#2a2f3a" strokeWidth={2} />
        {([[FRONT, "front", "FRONT"], [TQ, "side", "3/4"], [SIDE, "side", "SIDE"]] as const).map(([pose, view, name], i) => (
          <g key={name} transform={`translate(${140 + i * 270},${FY}) scale(0.85)`}>
            <BeanSVG items={buildBean(pose, BEAN_EXPR.neutral, { idp: `t${i}`, view })} />
          </g>
        ))}
        {["FRONT", "3/4", "SIDE"].map((n, i) => label(140 + i * 270, FY + 36, n))}
        <StressBoxes cx={140} cy={FY - 430} s={0.8} f={0} amount={1} />
        {title(940, 50, "THE DEVIL (rig)", "#ff7a5e")}
        <g transform={`translate(1100,${FY - 40}) scale(0.82)`}>
          <DevilSVG items={buildBean(TQ, BEAN_EXPR.neutral, { idp: "dv", devil: true, horns: 1, devilFace: "mischievous" })} />
        </g>
        <Smoke cx={1100} cy={FY - 40} s={0.9} f={20} amount={1} />
        <g transform={`translate(1430,${FY - 30}) scale(0.82)`}>
          <ellipse cx={-40} cy={-260} rx={200} ry={260} fill="url(#bRed)" />
          <DevilSVG items={buildBean(SIDE, BEAN_EXPR.neutral, { idp: "dv2", devil: true, horns: 1, devilFace: "neutral" })} />
        </g>
        <g transform={`translate(1500,${FY}) scale(0.82)`}>
          <BeanSVG items={buildBean(SIDE, BEAN_EXPR.worried, { idp: "bs" })} />
        </g>
        {label(1460, FY + 36, "SIZE / TOGETHER")}
        {title(40, 610, "EXPRESSIONS (BEAN)")}
        {exprs.map((e, i) => (
          <g key={e}>
            <g transform={`translate(${90 + i * 152},${730}) scale(0.78) translate(0,384)`}>
              <BeanSVG items={buildBean(FRONT, BEAN_EXPR[e], { idp: `e${i}`, view: "front", headOnly: true })} />
            </g>
            {label(90 + i * 152, 830, e.toUpperCase(), "#9aa0aa", 15)}
          </g>
        ))}
        {title(40, 900, "EXPRESSIONS (DEVIL)", "#ff7a5e")}
        {devilFaces.map((d, i) => (
          <g key={d}>
            <g transform={`translate(${110 + i * 180},${985}) scale(0.62) translate(0,384)`}>
              <DevilSVG items={buildBean(FRONT, BEAN_EXPR.neutral, { idp: `d${i}`, devil: true, horns: 1, devilFace: d, headOnly: true })} />
            </g>
            {label(110 + i * 180, 1058, d.toUpperCase(), "#ff9a84", 15)}
          </g>
        ))}
        <text x={1880} y={1060} fill={BC.glint} fontFamily="Menlo" fontSize={16} textAnchor="end">built to design/brief/bean_sheet.png + devil_arc.png</text>
      </svg>
    </AbsoluteFill>
  );
};
