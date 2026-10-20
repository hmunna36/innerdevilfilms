// 5-second test made only from Harshad's own sheet art (public/sheet/*.png, cut from design/brief/).
// Poses are swapped with short crossfades; the Devil grows behind him; colour washes carry the arc.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const k = (f: number, x: number[], y: number[]) =>
  interpolate(f, x, y, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// [file, start, end] with 6-frame crossfades
const POSES: [string, number, number][] = [
  ["stand", 0, 30], ["sit", 30, 66], ["think", 66, 96], ["frustrated", 96, 126], ["stand", 126, 150],
];
const SC = 2.6;

export const SheetTest: React.FC = () => {
  const f = useCurrentFrame();
  const devilOp = k(f, [34, 50, 118, 132], [0, 1, 1, 0]);
  const devilSc = k(f, [34, 66, 100, 126], [0.9, 1.6, 2.4, 2.6]);
  const devilX = k(f, [34, 100], [700, 760]);
  const red = k(f, [60, 104, 118, 128], [0, 0.55, 0.55, 0]);
  const warm = k(f, [122, 134, 150], [0, 0.6, 0.35]);
  const beats: [number, string][] = [[0, "1 · normal"], [34, "2 · first whisper"], [66, "3 · influence"], [96, "5 · control"], [126, "6 · reclaim"]];
  const beat = [...beats].reverse().find(([b]) => f >= b)?.[1] ?? "";
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0e13" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 55% 55%, rgba(255,45,31,${red}) 0%, rgba(0,0,0,0) 55%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, rgba(242,153,74,${warm}) 0%, rgba(0,0,0,0) 50%)` }} />
      <Img src={staticFile("sheet/devil_front.png")} style={{ position: "absolute", left: devilX, bottom: 170, height: 235 * devilSc, opacity: devilOp,
        transform: `translateX(-50%) translateY(${Math.sin(f / 9) * 6}px)`, filter: "drop-shadow(0 0 30px rgba(255,45,31,0.6))" }} />
      {POSES.map(([name, a, b], i) => {
        const op = k(f, [a - 3, a + 3, b - 3, b + 3], [0, 1, 1, 0]) * (i === 0 && f < 3 ? 1 : 1);
        const vis = i === 0 ? (f < b + 3 ? Math.max(op, f < 3 ? 1 : 0) : 0) : op;
        if (vis <= 0.001) return null;
        return <Img key={i} src={staticFile(`sheet/${name}.png`)} style={{ position: "absolute", left: 960, bottom: 150, height: 210 * SC, opacity: vis,
          transform: `translateX(-50%) scale(${1 + Math.sin(f / 14) * 0.006})`, transformOrigin: "50% 100%" }} />;
      })}
      <div style={{ position: "absolute", left: 60, bottom: 50, color: "#ecebe4", fontFamily: "Avenir Next", fontSize: 30 }}>{beat}</div>
      <div style={{ position: "absolute", left: 60, top: 50, color: "#8d919b", fontFamily: "Menlo", fontSize: 22 }}>TEST · your sheet's art</div>
    </AbsoluteFill>
  );
};
