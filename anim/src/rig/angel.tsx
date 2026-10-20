// The Angel from Harshad's Angel-arc sheet: a small glowing warm-gold spirit with a halo, little wings and a
// tail of light instead of legs. Drawn in code so it can fly, bob, clap, spin and fade to an ember.
import React from "react";

export const Angel: React.FC<{ x: number; y: number; s?: number; t: number; glow?: number; ember?: number; spin?: number; clap?: number; smile?: number; face?: number; reach?: number }> = ({
  x, y, s = 1, t, glow = 1, ember = 0, spin = 0, clap = 0, smile = 1, face = 1, reach = 0,
}) => {
  const bob = Math.sin(t * 3.1) * 8;
  const flap = Math.sin(t * 14) * 18;
  const body = 1 - ember; // fades to an ember
  const sc = s * (1 - 0.85 * ember);
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${spin * 360}) scale(${sc})`}>
      <circle cx={0} cy={0} r={110} fill="#ffcc66" opacity={0.35 * glow} filter="url(#bb30)" />
      <g opacity={body}>
        {/* tail of light */}
        <path d="M-34,30 C-30,80 0,96 8,140 C20,100 34,74 34,30 Z" fill="#ffe7b0" opacity={0.9} />
        {/* wings */}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 44},28) rotate(${sd * (flap * (sd === 1 ? 1 - reach : 1) + clap * 40) - (sd === 1 ? 62 * reach : 0)}) scale(${sd === 1 ? 1 + 0.45 * reach : 1})`}>
            <path d={`M0,0 C${sd * 30},-26 ${sd * 58},-6 ${sd * 50},16 C${sd * 40},30 ${sd * 16},22 0,10 Z`} fill="#fff1cc" stroke="#ffd27a" strokeWidth={2} />
            {sd === 1 && reach > 0.4 && <circle cx={56} cy={2} r={7 + 3 * Math.sin(t * 9)} fill="#fff6d8" opacity={reach} filter="url(#bb3)" />}
          </g>
        ))}
        {/* head-body */}
        <ellipse cx={0} cy={0} rx={52} ry={50} fill="#fff3d6" stroke="#ffd27a" strokeWidth={2.5} />
        <ellipse cx={-14} cy={-14} rx={20} ry={14} fill="#ffffff" opacity={0.6} />
        {/* face */}
        <g opacity={face}>
          <ellipse cx={-16} cy={-2} rx={6} ry={8} fill="#2a1d14" />
          <ellipse cx={16} cy={-2} rx={6} ry={8} fill="#2a1d14" />
          <path d={`M-12,16 Q0,${16 + 12 * smile} 12,16`} fill={smile > 0.6 ? "#e2725b" : "none"} stroke="#2a1d14" strokeWidth={3} strokeLinecap="round" />
        </g>
        {/* halo */}
        <ellipse cx={0} cy={-66 + Math.sin(t * 2) * 3} rx={36} ry={9} fill="none" stroke="#ffd27a" strokeWidth={6} />
        <ellipse cx={0} cy={-66 + Math.sin(t * 2) * 3} rx={36} ry={9} fill="none" stroke="#ffb84a" strokeWidth={10} opacity={0.4} filter="url(#bb4)" />
      </g>
      {/* ember core */}
      <circle cx={0} cy={0} r={18 + 6 * Math.sin(t * 5)} fill="#ffcc66" opacity={ember * (0.7 + 0.3 * Math.sin(t * 7))} filter="url(#bb6)" />
      <circle cx={0} cy={0} r={8} fill="#fff1cc" opacity={ember} />
    </g>
  );
};
