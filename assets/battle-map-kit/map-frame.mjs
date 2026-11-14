/**
 * Frame-deterministic editorial map renderer. No network, clock, browser or npm
 * lookup. Vendor sources are pinned in runtime-vendor; see THIRD_PARTY_NOTICES.
 * Coordinates use [longitude, latitude]. Routes follow supplied waypoints;
 * interpolation between them is geodesic, not a claim about roads or marches.
 */
import {geoMercator, geoPath, geoDistance, geoInterpolate} from './runtime-vendor/d3-geo/src/index.js';

const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const mix = (a,b,t) => a+(b-a)*t;
const ease = t => t*t*(3-2*t);
const num = v => Number(v.toFixed(4));
const id = v => String(v).replace(/[^A-Za-z0-9_-]/g,'-');
const pointValid = p => Array.isArray(p) && p.length===2 && p.every(Number.isFinite) && Math.abs(p[0])<=180 && Math.abs(p[1])<85;
const defaults = {
  background:'#ebe7de', land:'#d7d2c5', ocean:'#dce2e0', coast:'#8e9c97',
  ink:'#243737', muted:'#637573', accent:'#a84638', secondary:'#3a6c83',
  grid:'#718f88', paper:'#f8f4ec', fontFamily:'PingFang SC, Noto Sans SC, sans-serif'
};

export function validateScene(scene) {
  const fail = m => { throw new Error(`Map scene: ${m}`); };
  if (!scene || scene.schemaVersion !== 1) fail('schemaVersion must be 1');
  if (!scene.title || !scene.disclaimer) fail('title and disclaimer are required');
  for (const k of ['width','height','fps','durationInFrames']) if (!Number.isInteger(scene[k]) || scene[k]<=0) fail(`${k} must be a positive integer`);
  if (scene.width<640 || scene.height<360) fail('minimum canvas is 640 × 360');
  const b=scene.bounds;
  if (!Array.isArray(b)||b.length!==4||!b.every(Number.isFinite)||b[0]>=b[2]||b[1]>=b[3]||b[0]<-180||b[2]>180||b[1]<=-85||b[3]>=85) fail('bounds must be [west,south,east,north], no antimeridian or poles');
  if (!Array.isArray(scene.routes)) fail('routes must be an array');
  const identifiers = new Set();
  const sources = new Set((scene.sources??[]).map(s=>s.id));
  for (const [i,r] of scene.routes.entries()) {
    if (!r.id || identifiers.has(r.id)) fail(`route ${i} requires a unique id`); identifiers.add(r.id);
    if (!r.label || !r.date || !r.sourceId || !sources.has(r.sourceId)) fail(`route ${r.id} requires label, date and a registered sourceId`);
    if (!['documented','approximate','schematic'].includes(r.evidence)) fail(`route ${r.id} needs evidence: documented / approximate / schematic`);
    if (!Array.isArray(r.coordinates)||r.coordinates.length<2||!r.coordinates.every(pointValid)) fail(`route ${r.id} coordinates are invalid`);
    if (r.coordinates.some((p,j)=>j>0&&Math.abs(p[0]-r.coordinates[j-1][0])>180)) fail(`route ${r.id} crosses the antimeridian; split into separate chapters`);
    if (!Number.isFinite(r.start)||!Number.isFinite(r.end)||r.start<0||r.end<=r.start||r.end>scene.durationInFrames/scene.fps) fail(`route ${r.id} has invalid start/end seconds`);
    if (r.width!==undefined&&(!Number.isFinite(r.width)||r.width<1||r.width>20)) fail(`route ${r.id} width must be 1..20 pixels`);
    if (r.strength!==undefined&&(!Number.isFinite(r.strength)||r.strength<0||!r.strengthSourceId||!sources.has(r.strengthSourceId))) fail(`route ${r.id} strength needs a nonnegative value and registered source`);
  }
  for (const p of scene.places??[]) {
    if (!pointValid(p.coordinates)||!p.name) fail('place requires name and valid coordinates');
    for(const key of ['dx','dy','fontSize','start','end'])if(p[key]!==undefined&&!Number.isFinite(p[key]))fail(`place ${p.name}: ${key} must be finite`);
  }
  let last = -1;
  for (const c of scene.camera??[]) {
    if (!Number.isFinite(c.at)||c.at<0||c.at<=last||!pointValid(c.center)||!Number.isFinite(c.zoom)||c.zoom<0.5||c.zoom>6) fail('camera keys must be ordered unique seconds with valid center and zoom 0.5..6');
    last=c.at;
  }
  last=-1;
  for (const c of scene.cues??[]) {
    if (!Number.isFinite(c.at)||c.at<0||c.at<last||!c.date||!c.text) fail('cues require ordered seconds, date and text');
    last=c.at;
  }
  for (const l of scene.layers??[]) {
    if (!l.id||!l.date||!l.sourceId||!sources.has(l.sourceId)||!l.geojson) fail('overlay layer requires id, date, sourceId and inline GeoJSON');
    if (!['historical-border','military-control','claimed-area','schematic-area','modern-reference'].includes(l.kind)) fail(`layer ${l.id} has invalid kind`);
    if (l.kind==='modern-reference'&&!l.label?.includes('现代')) fail('modern-reference layer must be visibly labelled as modern');
    if (!Number.isFinite(l.start)||!Number.isFinite(l.end)||l.start<0||l.end<=l.start) fail(`layer ${l.id} needs a valid temporal interval`);
    if (l.opacity!==undefined&&(!Number.isFinite(l.opacity)||l.opacity<0||l.opacity>1)) fail(`layer ${l.id} opacity must be 0..1`);
  }
  if (scene.overlayFps!==undefined&&(!Number.isFinite(scene.overlayFps)||scene.overlayFps<1||scene.overlayFps>scene.fps)) fail('overlayFps must be 1..fps');
  if(scene.mapRect){
    const r=scene.mapRect;
    if(!Array.isArray(r)||r.length!==4||!r.every(Number.isFinite)||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>scene.width||r[1]+r[3]>scene.height)fail('mapRect must be an in-canvas [x,y,width,height] rectangle');
  }
  return scene;
}

/** A position on the supplied waypoint path at a fraction of geodesic length. */
export function sampleRoute(coordinates, fraction) {
  if (!coordinates?.length) throw new Error('Empty route');
  if (coordinates.length===1) return coordinates[0].slice();
  const distances = coordinates.slice(1).map((p,i)=>geoDistance(coordinates[i],p));
  const total=distances.reduce((a,b)=>a+b,0);
  if (total<1e-12) return coordinates[0].slice();
  let left=clamp(fraction)*total;
  for (let i=0;i<distances.length;i++) {
    if (left<=distances[i]||i===distances.length-1) return geoInterpolate(coordinates[i],coordinates[i+1])(distances[i]===0?0:clamp(left/distances[i]));
    left-=distances[i];
  }
  return coordinates.at(-1).slice();
}

/** Reveal the same geodesic path used by the moving unit. */
export function partialRoute(coordinates, fraction) {
  const p=clamp(fraction);
  if (p===0) return [coordinates[0],coordinates[0]];
  if (p===1) return coordinates;
  const distances=coordinates.slice(1).map((c,i)=>geoDistance(coordinates[i],c));
  const total=distances.reduce((a,b)=>a+b,0);
  let left=p*total; const result=[coordinates[0]];
  for(let i=0;i<distances.length;i++){
    if(left<=distances[i]) { result.push(geoInterpolate(coordinates[i],coordinates[i+1])(distances[i]===0?0:clamp(left/distances[i]))); break; }
    result.push(coordinates[i+1]); left-=distances[i];
  }
  return result;
}

/** D3 uses clockwise outer rings; accept regional RFC 7946 winding as input. */
export function normalizeRegionalWinding(geojson) {
  const result=structuredClone(geojson);
  const fix=rings=>rings.forEach((ring,index)=>{
    let signed=0;
    for(let i=0;i<ring.length-1;i++)signed+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];
    if((index===0&&signed>0)||(index>0&&signed<0))ring.reverse();
  });
  const visit=g=>{
    if(!g)return;
    if(g.type==='FeatureCollection')g.features.forEach(visit);
    else if(g.type==='Feature')visit(g.geometry);
    else if(g.type==='GeometryCollection')g.geometries.forEach(visit);
    else if(g.type==='Polygon')fix(g.coordinates);
    else if(g.type==='MultiPolygon')g.coordinates.forEach(fix);
  };
  visit(result); return result;
}

function cameraAt(scene,time) {
  const b=scene.bounds, keys=scene.camera??[];
  const fallback={center:[(b[0]+b[2])/2,(b[1]+b[3])/2],zoom:1};
  if (!keys.length) return fallback;
  if(time<=keys[0].at) return keys[0];
  for(let i=1;i<keys.length;i++)if(time<keys[i].at){
    const a=keys[i-1],b=keys[i],p=ease(clamp((time-a.at)/(b.at-a.at)));
    return {center:[mix(a.center[0],b.center[0],p),mix(a.center[1],b.center[1],p)],zoom:mix(a.zoom,b.zoom,p)};
  }
  return keys.at(-1);
}

function frameState(scene,frame) {
  const t=clamp(frame,0,scene.durationInFrames-1)/scene.fps;
  // Correct at any master fps: quantize time itself, not round(fps / 12).
  const overlayTime=scene.overlayFps?Math.floor(t*scene.overlayFps)/scene.overlayFps:t;
  return {time:t,overlayTime,camera:cameraAt(scene,t),cue:[...(scene.cues??[])].reverse().find(c=>c.at<=t)??null};
}

/** Returns SVG and machine-readable positions for QA. land is coastline-only GeoJSON. */
export function renderMapFrame(scene,frame,land) {
  validateScene(scene);
  if(!Number.isFinite(frame)||frame<0)throw new Error('frame must be nonnegative');
  if(!land?.type)throw new Error('land must be GeoJSON');
  const {width:w,height:h}=scene, theme={...defaults,...scene.theme};
  const ui=w/1920, pad=72*ui;
  const rect=scene.mapRect??[pad,174*ui,w-pad*2,h-344*ui];
  const [mapX,top,mapWidth,mapHeight]=rect,bottom=top+mapHeight;
  const viewport=[[mapX,top],[mapX+mapWidth,bottom]], center=[mapX+mapWidth/2,(top+bottom)/2];
  const [west,south,east,north]=scene.bounds;
  const fit={type:'MultiPoint',coordinates:[[west,south],[west,north],[east,south],[east,north]]};
  const base=geoMercator().fitExtent(viewport,fit);
  const state=frameState(scene,frame), cam=state.camera, anchor=base(cam.center), baseTranslate=base.translate();
  // Camera is part of the projection. Paths, markers and labels share it exactly.
  const projection=geoMercator().scale(base.scale()*cam.zoom)
    .translate([center[0]+(baseTranslate[0]-anchor[0])*cam.zoom,center[1]+(baseTranslate[1]-anchor[1])*cam.zoom])
    .clipExtent(viewport);
  const toPath=geoPath(projection);
  const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(scene.title)}">`,
    `<defs><clipPath id="map-viewport"><rect x="${mapX}" y="${top}" width="${mapWidth}" height="${mapHeight}" rx="${5*ui}"/></clipPath>`,
    `<pattern id="uncertain-hatch" width="${12*ui}" height="${12*ui}" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="${12*ui}" stroke="${esc(theme.accent)}" stroke-width="${2*ui}" opacity=".25"/></pattern></defs>`,
    `<rect width="100%" height="100%" fill="${esc(theme.background)}"/>`,
    `<g font-family="${esc(theme.fontFamily)}" fill="${esc(theme.ink)}">`,
    `<text x="${pad}" y="${70*ui}" font-size="${36*ui}" font-weight="700">${esc(scene.title)}</text>`,
    `<text x="${pad}" y="${113*ui}" font-size="${20*ui}" fill="${esc(theme.muted)}">${esc(scene.subtitle??scene.disclaimer)}</text>`,
    `<text x="${w-pad}" y="${70*ui}" text-anchor="end" font-size="${24*ui}" font-weight="600">${esc(state.cue?.date??scene.period??'')}</text>`,
    `<line x1="${pad}" y1="${143*ui}" x2="${w-pad}" y2="${143*ui}" stroke="${esc(theme.coast)}"/>`,
    `<g clip-path="url(#map-viewport)"><rect x="${mapX}" y="${top}" width="${mapWidth}" height="${mapHeight}" fill="${esc(theme.ocean)}"/>`,
    `<path data-layer="coastline" d="${esc(toPath(land))}" fill="${esc(theme.land)}" stroke="${esc(theme.coast)}" stroke-width="${1.25*ui}"/>`];
  const activeLayers=[];
  for(const layer of scene.layers??[])if(state.time>=layer.start&&state.time<layer.end){
    const d=toPath(normalizeRegionalWinding(layer.geojson)), uncertain=layer.uncertain||layer.kind==='schematic-area'||layer.kind==='claimed-area';
    parts.push(`<path id="layer-${id(layer.id)}" d="${esc(d)}" fill="${esc(layer.fill??theme.accent)}" fill-opacity="${layer.opacity??0.15}" stroke="${esc(layer.stroke??theme.accent)}" stroke-width="${2*ui}"${uncertain?` stroke-dasharray="${7*ui} ${5*ui}"`:''}/>`);
    if(uncertain)parts.push(`<path d="${esc(d)}" fill="url(#uncertain-hatch)"/>`);
    activeLayers.push(layer);
  }
  const routeStates=[];
  for(const route of scene.routes){
    const progress=clamp((state.overlayTime-route.start)/(route.end-route.start));
    const color=route.color??theme.accent, thickness=(route.width??5)*ui;
    const tip=sampleRoute(route.coordinates,progress), tipXY=projection(tip), next=projection(sampleRoute(route.coordinates,clamp(progress+0.002)));
    const before=projection(sampleRoute(route.coordinates,clamp(progress-0.002)));
    const angle=Math.atan2(next[1]-before[1],next[0]-before[0])*180/Math.PI;
    routeStates.push({id:route.id,progress,tip,tipXY,visible:state.overlayTime>=route.start});
    if(state.overlayTime<route.start)continue;
    if(scene.showRouteGuide)parts.push(`<path d="${esc(toPath({type:'LineString',coordinates:route.coordinates}))}" fill="none" stroke="${esc(color)}" stroke-width="${1.5*ui}" stroke-opacity=".18" stroke-dasharray="${4*ui} ${8*ui}"/>`);
    if(progress>0)parts.push(`<path id="route-${id(route.id)}" d="${esc(toPath({type:'LineString',coordinates:partialRoute(route.coordinates,progress)}))}" fill="none" stroke="${esc(color)}" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"${route.evidence==='documented'?'':` stroke-dasharray="${10*ui} ${7*ui}"`}/>`);
    const size=10*ui;
    parts.push(`<g id="unit-${id(route.id)}" transform="translate(${num(tipXY[0])} ${num(tipXY[1])}) rotate(${num(angle)})"><path d="M ${size} 0 L ${-size*.6} ${-size*.7} L ${-size*.15} 0 L ${-size*.6} ${size*.7} Z" fill="${esc(color)}" stroke="${esc(theme.paper)}" stroke-width="${2*ui}"/></g>`);
  }
  const placeStates=[];
  for(const place of scene.places??[]){
    if(state.overlayTime<(place.start??0)||state.overlayTime>=(place.end??Infinity))continue;
    const [x,y]=projection(place.coordinates); placeStates.push({name:place.name,x,y});
    parts.push(`<g transform="translate(${num(x)} ${num(y)})"><circle r="${4.5*ui}" fill="${esc(theme.ink)}" stroke="${esc(theme.paper)}" stroke-width="${2*ui}"/><text x="${(place.dx??14)*ui}" y="${(place.dy??-12)*ui}" font-size="${(place.fontSize??21)*ui}" font-weight="600" paint-order="stroke" stroke="${esc(theme.background)}" stroke-width="${4*ui}" stroke-linejoin="round">${esc(place.name)}</text></g>`);
  }
  parts.push('</g>');
  const legendY=bottom+42*ui;
  let legendX=pad;
  for(const route of scene.routes){
    const label=route.label+(route.evidence==='documented'?'':' · 路线示意');
    parts.push(`<line x1="${legendX}" y1="${legendY-6*ui}" x2="${legendX+34*ui}" y2="${legendY-6*ui}" stroke="${esc(route.color??theme.accent)}" stroke-width="${4*ui}"${route.evidence==='documented'?'':` stroke-dasharray="${8*ui} ${5*ui}"`}/><text x="${legendX+46*ui}" y="${legendY}" font-size="${18*ui}">${esc(label)}</text>`);
    legendX+=(Math.max(220,label.length*19+66))*ui;
  }
  parts.push(`<text x="${pad}" y="${bottom+82*ui}" font-size="${24*ui}" font-weight="600">${esc(state.cue?.text??'')}</text>`);
  const footnote=[scene.disclaimer,...activeLayers.map(l=>l.label??`${l.date} ${l.kind}`),scene.attribution??'Coastline: Natural Earth / world-atlas (public domain)'].filter(Boolean).join('  |  ');
  parts.push(`<text x="${pad}" y="${h-28*ui}" font-size="${14*ui}" fill="${esc(theme.muted)}">${esc(footnote)}</text>`,
    `<rect x="${pad}" y="${h-8*ui}" height="${3*ui}" width="${(w-pad*2)*clamp(frame/Math.max(1,scene.durationInFrames-1))}" fill="${esc(theme.accent)}"/>`,
    '</g></svg>');
  return {svg:parts.join('\n'),state:{...state,routes:routeStates,places:placeStates,activeLayers:activeLayers.map(l=>l.id),projection:{name:'Mercator',scale:projection.scale(),translate:projection.translate(),bounds:scene.bounds}}};
}

export const renderMapSvg=(scene,frame,land)=>renderMapFrame(scene,frame,land).svg;
