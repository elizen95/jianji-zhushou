import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';

export type ThemeTokens = {
  palette: {paper: string; ink: string; muted: string; accent: string; [key: string]: string};
  type: {title_family: string; body_family: string; caption_family: string; [key: string]: unknown};
};

/** All scene components receive this same project theme; source references may differ. */
export const ThemeFrame: React.FC<{tokens: ThemeTokens; children?: React.ReactNode; fontFile?: string}> = ({tokens, children, fontFile='fonts/NotoSansSC-VF.ttf'}) => {
  const vars = Object.fromEntries(Object.entries(tokens.palette).map(([k,v])=>[`--color-${k}`,v]));
  return <AbsoluteFill style={{...vars, backgroundColor:tokens.palette.paper, color:tokens.palette.ink, fontFamily:tokens.type.body_family} as React.CSSProperties}>
    <style>{`@font-face {font-family:'Noto Sans SC';src:url('${staticFile(fontFile)}') format('truetype');font-weight:100 900;font-display:block;} * {box-sizing:border-box;}`}</style>
    {children}
  </AbsoluteFill>;
};
