import React from "react";
import { Composition, Folder } from "remotion";
import { ScreenFlow } from "./template/ScreenFlow";
import { pickAStore, play, setsUpWine } from "./steps/flows";

/**
 * 1600×1000 keeps the 1280×800 captures at exactly 1:1 inside 10% padding.
 * 60 fps for a smooth cursor; durations are in seconds × fps.
 */
const W = 1600;
const H = 1000;
const FPS = 60;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="HowItWorks">
      <Composition
        id="Step1-PickAStore"
        component={ScreenFlow}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={pickAStore}
      />
      <Composition
        id="Step2-SetsUpWine"
        component={ScreenFlow}
        durationInFrames={8.5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={setsUpWine}
      />
      <Composition
        id="Step3-Play"
        component={ScreenFlow}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={play}
      />
    </Folder>
  );
};
