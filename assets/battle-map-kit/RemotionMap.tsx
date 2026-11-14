import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {renderMapSvg} from './map-frame.mjs';

/** Pass already-loaded, validated JSON. No async network or browser animation. */
export const EditorialMap: React.FC<{scene: any; land: any}> = ({scene, land}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill dangerouslySetInnerHTML={{__html: renderMapSvg(scene, frame, land)}} />;
};

// In your Remotion root, use the same fps/size/duration as the scene JSON:
// <Composition id="HistoricalMap" component={EditorialMap}
//   width={scene.width} height={scene.height} fps={scene.fps}
//   durationInFrames={scene.durationInFrames} defaultProps={{scene, land}} />
// Import land JSON locally or load it with delayRender before rendering.
// Keep all referenced runtime-vendor source folders beside map-frame.mjs.
