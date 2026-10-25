import React from "react";
import { Composition } from "remotion";
import { RigTest } from "./RigTest";
import { BeanSheet } from "./BeanSheet";
import { SheetTest } from "./SheetTest";
import { Film01, FILM_SECONDS } from "./Film01";
import { Film02, FILM2_SECONDS } from "./Film02";
import { Film03, FILM3_SECONDS } from "./Film03";
import { Film04, FILM4_SECONDS } from "./Film04";
import { IDBanner, IDLogo } from "./Brand";
import { ThumbA, ThumbB } from "./Thumb";
import { Thumb05A, Thumb05B } from "./Thumb05";
import { SHORT1_FRAMES, ShortTomorrow } from "./ShortTomorrow";
import { SHORT2_FRAMES, Short02 } from "./Short02";
import { SHORT3_FRAMES, Short03 } from "./Short03";
import { SHORT4_FRAMES, Short04 } from "./Short04";
import { SHORT5_FRAMES, Short05 } from "./Short05";
import { SHORT6_FRAMES, Short06 } from "./Short06";
import { SHORT7_FRAMES, Short07 } from "./Short07";
import { CUTS as CUTS5, Film05, FILM5_SECONDS } from "./Film05";
// one frame from the middle of every cut of film 02, for contact sheets
const MIDS5 = CUTS5.map((c) => Math.round(((c.t0 + c.t1) / 2) * 30));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RigTest" component={RigTest} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Film04" component={Film04} durationInFrames={FILM4_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film04QA" component={Film04} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ qa: [0] }} />
    <Composition id="Short01" component={ShortTomorrow} durationInFrames={SHORT1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short02" component={Short02} durationInFrames={SHORT2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short02QA" component={Short02} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Short03" component={Short03} durationInFrames={SHORT3_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short03QA" component={Short03} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Short04" component={Short04} durationInFrames={SHORT4_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short04QA" component={Short04} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Short05" component={Short05} durationInFrames={SHORT5_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short05QA" component={Short05} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Short06" component={Short06} durationInFrames={SHORT6_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short06QA" component={Short06} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Short07" component={Short07} durationInFrames={SHORT7_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short07QA" component={Short07} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="Film05" component={Film05} durationInFrames={FILM5_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film05QA" component={Film05} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ qa: [0] }} />
    <Composition id="Film05Sheet" component={Film05} durationInFrames={MIDS5.length} fps={30} width={1920} height={1080} defaultProps={{ qa: MIDS5 }} />
    <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Thumb05A" component={Thumb05A} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Thumb05B" component={Thumb05B} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="IDLogo" component={IDLogo} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="IDBanner" component={IDBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Film03" component={Film03} durationInFrames={FILM3_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film02" component={Film02} durationInFrames={FILM2_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film01" component={Film01} durationInFrames={FILM_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="SheetTest" component={SheetTest} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="BeanSheet" component={BeanSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
