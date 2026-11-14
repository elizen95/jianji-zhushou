import React from 'react';
import {OffthreadVideo,useCurrentFrame,useVideoConfig} from 'remotion';
type Window={startFrame:number;endFrame:number;mode:'fullscreen'|'pip'|'hidden';x?:number;y?:number;width?:number;height?:number};
type Props={src:string;openingSeconds?:number;shrinkSeconds?:number;sourceOffsetFrames?:number;schedule?:Window[];pip?:{x:number;y:number;width:number;height:number};borderColor?:string};
/** Mount once at master level. Schedule controls visibility, never position or the continuous source clock. */
export const PresenterLayer:React.FC<Props>=({src,openingSeconds=15,shrinkSeconds=.75,sourceOffsetFrames=0,schedule=[],pip={x:1530/1920,y:710/1080,width:320/1920,height:180/1080}})=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),openingEnd=Math.round(openingSeconds*fps);
 const t=Math.max(0,Math.min(1,(frame-openingEnd)/Math.max(1,Math.round(shrinkSeconds*fps)))),q=t*t*(3-2*t),window=schedule.find(w=>frame>=w.startFrame&&frame<w.endFrame);
 const visible=frame<openingEnd||schedule.length===0||Boolean(window&&window.mode!=='hidden');
 const box={x:pip.x*q,y:pip.y*q,width:1+(pip.width-1)*q,height:1+(pip.height-1)*q};
 return <div style={{position:'absolute',left:box.x*width,top:box.y*height,width:box.width*width,height:box.height*height,overflow:'hidden',opacity:visible?1:0,border:0,borderRadius:22*(width/1920)*q,zIndex:50}}><OffthreadVideo src={src} trimBefore={sourceOffsetFrames} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>;
};
