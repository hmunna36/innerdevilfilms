// A scratch composition for checking film 02's new pieces as stills (not part of any film).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAN_EXPR, BeanDefs, DevilSVG, buildBean } from "./rig/bean";
import { Angel } from "./rig/angel";
import { ex } from "./film/kit";
import { BedBase, BedDefs, Bedside, Blanket, DevilOver, HeldPhone, LyingBean, OV, PhoneLight, PhoneSmoke } from "./film/bed";
import { Alarm, Banner, Call, Chat, DeadGlass, Feed, Lock, PhoneView } from "./film/phone";
import type { Clip } from "./film/phone";
import { BookInsert, CalendarInsert, DadPhoto, DeskBook, DeskClutter, ExamInsert, NoteCard, StudyDefs } from "./film/study";
import { ChairAt, DeskDefs, DeskFront, DeskTop, DK, STL } from "./film/desk";
import { Img, staticFile } from "remotion";
import { Char } from "./film/kit";
import { SEAT } from "./rig/beanPoses";

const CL: Clip[] = [{ t0: 0, kind: "cat", user: "@nightcats", caption: "WAIT FOR IT…", likes: "2.4M" }];
// each block of 30 frames shows one piece (a still at frame 30 * i + n)
const WHICH = ["shadow", "bed", "beddevil", "feed", "ring", "dead", "dead0", "halo", "chat", "alarm", "lock", "cal", "book", "exam", "note", "desk", "call"];
export const Lab05: React.FC = () => {
  const f = useCurrentFrame();
  const which = WHICH[Math.min(WHICH.length - 1, Math.floor(f / 30))];
  const t = (f % 30) / 30;
  if (which === "shadow") return (
    <AbsoluteFill style={{ background: "#888" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080"><BeanDefs />
        <g transform="translate(600,800) scale(1.35,-0.42) skewX(-38)"><DevilSVG items={buildBean(SEAT, BEAN_EXPR.neutral, { idp: "sh1", devil: true, horns: 1, contact: false })} glow={0} rim="#120c0a" fill="#120c0a" detailOp={0} /></g>
        <g transform="translate(1200,800) scale(1.35,0.42)"><DevilSVG items={buildBean(SEAT, BEAN_EXPR.neutral, { idp: "sh2", devil: false, contact: false })} glow={0} rim="#120c0a" fill="#120c0a" detailOp={0} /></g>
      </svg>
    </AbsoluteFill>
  );
  if (which === "bed") return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <BeanDefs /><BedDefs />
        <BedBase />
        <Bedside clock="3:12" />
        <LyingBean id="lb" t={t} e={ex("tired", t, { ly: 7 })} />
        <Blanket />
        <HeldPhone t={t} lit={1} />
        <Angel x={760} y={200} s={0.5} t={t} />
        <PhoneLight lit={1} />
      </svg>
    </AbsoluteFill>
  );
  if (which === "beddevil") return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <BeanDefs /><BedDefs />
        <BedBase />
        <Bedside clock="4:12" />
        <LyingBean id="lb" t={t} e={ex("surprised", t, { blink: false, lx: 0, ly: -6 })} />
        <Blanket />
        <HeldPhone t={t} lit={0} dead />
        <PhoneSmoke t={t + 3} amount={0.8} />
        <PhoneLight lit={0} />
        <rect x={0} y={0} width={1920} height={1080} fill="#ff2d1f" opacity={0.18} />
        <DevilOver id="dov" t={t} y={OV.y - 250} />
      </svg>
    </AbsoluteFill>
  );
  const ins = (n: React.ReactNode) => (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080"><BeanDefs /><DeskDefs /><StudyDefs />
        <defs><radialGradient id="topVig" cx="50%" cy="40%" r="75%"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient></defs>
        {n}</svg>
    </AbsoluteFill>
  );
  if (which === "cal") return ins(<CalendarInsert t={t} circle={0.6} marker crossed={2} />);
  if (which === "book") return ins(<BookInsert t={t} page={12} hl={0.4} flip={0.3} />);
  if (which === "exam") return ins(<ExamInsert t={t + 1.3} t0={0} />);
  if (which === "note") return <AbsoluteFill style={{ background: "#222" }}><NoteCard t={t + 1} t0={0} t1={9} /></AbsoluteFill>;
  if (which === "desk") return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile("poses/set_bedroom.png")} style={{ position: "absolute", width: 1920, height: 1080, filter: "brightness(0.6)" }} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}><BeanDefs /><DeskDefs /><StudyDefs />
        <DeskTop t={t} clock="11:40" bills={false} photo={<DadPhoto x={1000} y={DK.y - 40 * STL - 31} />} under={<DeskClutter mugs={3} cards={4} />} over={<DeskBook x={930} z={50} frac={0.02} hl={0.3} />} />
        <Char id="lab" pose={SEAT} e={ex("tired", t)} x={640} y={960} seat t={t} />
        <DeskFront t={t} />
      </svg>
    </AbsoluteFill>
  );
  const scr = which === "feed" ? <Feed t={t + 1.2} clips={CL} clock="12:41" battery={0.4}><Banner t={t + 1.2} t0={0.5} t1={9} from="Dad" lines={["On my break. Why are you", "online at 3 AM?"]} /></Feed>
    : which === "ring" ? <Feed t={t + 2.6} clips={CL} clock="12:41" ring={[2.4, 5.4]} />
    : which === "dead" ? <DeadGlass t={t} refl={1} devil={0.7} eyes={1} />
    : which === "dead0" ? <DeadGlass t={t} refl={1} />
    : which === "halo" ? <DeadGlass t={t} refl={1} halo={1} />
    : which === "chat" ? <Chat t={t + 10} name="Dad" clock="11:40" items={[{ t: 0, sep: true, text: "Monday 11:40 PM" }, { t: 0, text: "On my way to my night shift." }, { t: 0, text: "Pass on Friday and I can finally stop working nights." }, { t: 0, me: true, text: "I'll pass. I promise." }]} />
    : which === "alarm" ? <Alarm t={t} time="9:00" label="PRACTICE EXAM" />
    : which === "lock" ? <Lock t={t} time="5:02" date="Friday, May 15" notes={[{ t: 0, from: "Dad", lines: ["9 missed calls"], icon: "#34c759" }]} />
    : <Call t={t} name="Dad" t0={0} connect={9} />;
  return (
    <AbsoluteFill style={{ background: "#1a1c22" }}>
      <PhoneView t={t} s={which === "chat" ? 1.12 : 0.9} y={which === "chat" ? 20 : 50}>{scr}</PhoneView>
    </AbsoluteFill>
  );
};
