import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {renderMapFrame, sampleRoute, partialRoute, validateScene, normalizeRegionalWinding} from '../map-frame.mjs';
import {applyStyleLock} from '../apply-style-lock.mjs';

const read=p=>JSON.parse(fs.readFileSync(fileURLToPath(new URL(p,import.meta.url)),'utf8'));
const scene=read('../examples/fictional-campaign.json'), land=read('../data/land-110m.geojson');
let count=0;
const test=(name,fn)=>{fn();count++;console.log(`PASS ${name}`)};
const close=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<=eps,`${a} differs from ${b}`);

test('Exact geodesic route endpoints and midpoint',()=>{
  const coords=[[0,0],[10,0],[20,0]];
  sampleRoute(coords,0).forEach((v,i)=>close(v,coords[0][i]));
  sampleRoute(coords,1).forEach((v,i)=>close(v,coords[2][i]));
  close(sampleRoute(coords,.5)[0],10);
  for(const p of [0,.1,.35,.5,.77,1]){
    const tip=sampleRoute(coords,p),last=partialRoute(coords,p).at(-1);
    tip.forEach((v,i)=>close(v,last[i]));
  }
});
test('Repeated waypoints remain finite',()=>{
  const c=[[8,40],[8,40],[8,40]];
  assert.deepEqual(sampleRoute(c,.4),[8,40]);
  assert.ok(partialRoute(c,.4).flat().every(Number.isFinite));
});
test('Same exact frame produces same bytes, independent of render order',()=>{
  const a=renderMapFrame(scene,210,land).svg;
  renderMapFrame(scene,1,land);renderMapFrame(scene,359,land);
  assert.equal(a,renderMapFrame(scene,210,land).svg);
});
test('Opening, motion and closing frames have valid geometry and expected timing',()=>{
  for(const frame of [0,30,90,120,179,180,210,270,315,359]){
    const result=renderMapFrame(scene,frame,land);
    assert.ok(!/NaN|Infinity|undefined/.test(result.svg));
    for(const r of result.state.routes){assert.ok(r.progress>=0&&r.progress<=1);assert.ok(r.tipXY.every(Number.isFinite));}
  }
  assert.ok(renderMapFrame(scene,0,land).state.routes.every(r=>!r.visible));
  assert.equal(renderMapFrame(scene,359,land).state.routes[0].progress,1);
  assert.equal(renderMapFrame(scene,359,land).state.cue.date,'第05日');
});
test('Marker and projected destination coincide at route completion through camera zoom',()=>{
  const final=renderMapFrame(scene,359,land).state;
  const place=final.places.find(p=>p.name==='会合点');
  for(const r of final.routes){close(r.tipXY[0],place.x);close(r.tipXY[1],place.y);}
});
test('Dated control layer switches only at its own cue',()=>{
  assert.deepEqual(renderMapFrame(scene,179,land).state.activeLayers,[]);
  assert.deepEqual(renderMapFrame(scene,180,land).state.activeLayers,['assembly-area']);
});
test('Optional 12 fps overlay quantizes time correctly under a 30 fps master',()=>{
  const s={...scene,overlayFps:12};
  const a=renderMapFrame(s,151,land).state,b=renderMapFrame(s,152,land).state;
  assert.equal(a.overlayTime,b.overlayTime);
  close(a.routes[0].progress,b.routes[0].progress);
  assert.notDeepEqual(a.camera,b.camera); // camera remains smooth
});
test('Geographic ring orientation is normalized without mutating source',()=>{
  const a=scene.layers[0].geojson,b=structuredClone(a);
  b.geometry.coordinates[0].reverse();
  assert.deepEqual(normalizeRegionalWinding(a),normalizeRegionalWinding(b));
  assert.notDeepEqual(a,b);
});
test('Invalid coordinates, missing evidence and ambiguous modern boundaries fail early',()=>{
  const bad=()=>structuredClone(scene);
  let s=bad();s.routes[0].coordinates[0]=[200,30];assert.throws(()=>validateScene(s),/coordinates/);
  s=bad();delete s.routes[0].sourceId;assert.throws(()=>validateScene(s),/sourceId/);
  s=bad();s.layers[0].kind='modern-reference';assert.throws(()=>validateScene(s),/modern-reference/);
  s=bad();s.routes[0].strength=10000;assert.throws(()=>validateScene(s),/strength/);
  s=bad();s.bounds=[170,-20,-170,20];assert.throws(()=>validateScene(s),/antimeridian/);
});
test('Raw label strings are escaped before SVG insertion',()=>{
  const s={...scene,title:'<script>alert("x")</script>'};
  const svg=renderMapFrame(s,0,land).svg;
  assert.ok(!svg.includes('<script>'));assert.ok(svg.includes('&lt;script&gt;'));
});
test('Theme binding overrides demonstration colors and reserves presenter/caption space',()=>{
  const styled=applyStyleLock(scene,{tokens:{palette:{paper:'#faf7ef',ink:'#202020',accent:'#903520',route_a:'#903520',route_b:'#405c30'},type:{body_family:'Noto Sans SC'}}},{presenter:true,subtitles:true});
  assert.equal(styled.theme.fontFamily,'Noto Sans SC');
  assert.equal(styled.routes[1].color,'#405c30');
  assert.ok(styled.mapRect[0]+styled.mapRect[2]<=scene.width-450);
  assert.ok(styled.mapRect[1]+styled.mapRect[3]<=scene.height-260);
  const svg=renderMapFrame(styled,210,land).svg;
  assert.ok(svg.includes('#faf7ef'));assert.ok(!svg.includes('#3a6c83'));
});
console.log(`${count} behavioral checks passed.`);
