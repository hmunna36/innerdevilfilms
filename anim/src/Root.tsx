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
import { SHORT1_FRAMES, ShortTomorrow } from "./ShortTomorrow";
import { SHORT2_FRAMES, Short02 } from "./Short02";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RigTest" component={RigTest} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Film04" component={Film04} durationInFrames={FILM4_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film04QA" component={Film04} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{ qa: [0] }} />
    <Composition id="Short01" component={ShortTomorrow} durationInFrames={SHORT1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short02" component={Short02} durationInFrames={SHORT2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Short02QA" component={Short02} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ qa: [0] }} />
    <Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="IDLogo" component={IDLogo} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="IDBanner" component={IDBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Film03" component={Film03} durationInFrames={FILM3_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film02" component={Film02} durationInFrames={FILM2_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="Film01" component={Film01} durationInFrames={FILM_SECONDS * 30} fps={30} width={1920} height={1080} />
    <Composition id="SheetTest" component={SheetTest} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="BeanSheet" component={BeanSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
