import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
type Props={src:string;nameZh:string;nameEn:string;placement?:'left'|'right'|'below';textColor?:string;panelColor?:string};
const family='PingFang SC Regular, PingFang SC, Noto Sans SC, sans-serif';
/** Whole foreground image and large bilingual name. No detail inset or image frame. */
export const ArchiveImage:React.FC<Props>=({src,nameZh,nameEn,placement='left',textColor='#F7F2E8',panelColor='rgba(33,28,24,.66)'})=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig(),q=Math.max(0,Math.min(1,frame/Math.max(1,durationInFrames-1))),below=placement==='below';
 const imageBox=below?{left:'5%',top:'4%',width:'90%',height:'66%'}:{left:placement==='left'?'42%':'4%',top:'5%',width:'54%',height:'77%'};
 const titleBox=below?{left:'5%',top:'72%',width:'90%',minHeight:'12%'}:{left:placement==='left'?'3%':'62%',top:'9%',width:'34%',minHeight:'44%'};
 return <AbsoluteFill style={{background:'#2b241e',overflow:'hidden',fontFamily:family}}>
  <Img src={src} style={{position:'absolute',left:'-4%',top:'-4%',width:'108%',height:'108%',objectFit:'cover',filter:'blur(32px) brightness(.54)'}}/>
  <div style={{position:'absolute',...imageBox,transform:`translate(${q*4}px,${-q*3}px)`}}><Img src={src} style={{width:'100%',height:'100%',objectFit:'contain',border:0}}/></div>
  <div style={{position:'absolute',...titleBox,padding:32,borderRadius:24,background:panelColor,backdropFilter:'blur(18px)',color:textColor}}><div style={{fontSize:below?44:nameZh.length>30?44:58,fontWeight:650,lineHeight:1.28}}>{nameZh}</div><div style={{fontSize:below?27:30,lineHeight:1.35,marginTop:18}}>{nameEn}</div></div>
 </AbsoluteFill>;
};
