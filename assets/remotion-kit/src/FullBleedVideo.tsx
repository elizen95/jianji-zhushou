import React from 'react';
import {AbsoluteFill,OffthreadVideo,useVideoConfig} from 'remotion';
/** Complete source frame, without crop, zoom, edge cleanup or a loop. */
export const FullBleedVideo:React.FC<{src:string;sourceInSeconds?:number;muted?:boolean}>=({src,sourceInSeconds=0,muted=true})=>{
 const {fps}=useVideoConfig();return <AbsoluteFill><OffthreadVideo src={src} trimBefore={Math.round(sourceInSeconds*fps)} muted={muted} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'}}/></AbsoluteFill>;
};
