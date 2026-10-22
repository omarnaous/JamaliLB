import { Composition } from "remotion";
import { Main } from "./Main.jsx";
import { FPS, DURATION } from "./timing.js";

// Instagram Reel 9:16. "ReelNoMusic" carries effects only, so trending audio can be added in-app.
export const Root = () => (
  <>
    <Composition id="Reel" component={Main} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ music: true }} />
    <Composition id="ReelNoMusic" component={Main} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ music: false }} />
  </>
);
