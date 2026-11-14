/** Bind mechanism-only geography to the episode's shared theme tokens. */
export function applyStyleLock(scene, styleLock, options={}) {
  const p=styleLock?.tokens?.palette,t=styleLock?.tokens?.type;
  if(!p?.paper||!p.ink||!p.accent||!t)throw new Error('A style lock with palette paper/ink/accent and type tokens is required');
  const result=structuredClone(scene);
  result.theme={
    background:p.paper, paper:p.paper, land:p.land??p.evidence??p.paper,
    ocean:p.ocean??p.paper, coast:p.muted??p.ink,
    ink:p.ink, muted:p.muted??p.ink, accent:p.accent,
    secondary:p.route_b??p.accent, grid:p.muted??p.ink,
    fontFamily:t.body_family??'PingFang SC, Noto Sans SC, sans-serif'
  };
  result.routes=result.routes.map((r,i)=>({...r,color:i%2===0?(p.route_a??p.accent):(p.route_b??p.accent)}));
  result.layers=(result.layers??[]).map(l=>({...l,fill:p.accent,stroke:p.accent}));
  const ui=result.width/1920;
  // Default composition example reserves the full right column for a lower-right
  // presenter and leaves bottom caption space. The director may supply mapRect.
  if(options.presenter&&!options.mapRect){
    result.mapRect=[72*ui,174*ui,result.width-72*ui-450*ui,result.height-174*ui-(options.subtitles?260:170)*ui];
  }
  if(options.mapRect)result.mapRect=options.mapRect;
  return result;
}
