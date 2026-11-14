import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderMapFrame} from './map-frame.mjs';

const [sceneFile,outFile,frameArg='0']=process.argv.slice(2);
if(!sceneFile||!outFile)throw new Error('Usage: node render-map-frame.mjs scene.json output.svg [frame]');
const scene=JSON.parse(fs.readFileSync(sceneFile,'utf8'));
const dir=path.dirname(path.resolve(sceneFile));
for(const layer of scene.layers??[])if(typeof layer.geojson==='string')layer.geojson=JSON.parse(fs.readFileSync(path.resolve(dir,layer.geojson),'utf8'));
const localDir=path.dirname(fileURLToPath(import.meta.url));
const landPath=scene.landFile?path.resolve(dir,scene.landFile):path.join(localDir,'data','land-110m.geojson');
const land=JSON.parse(fs.readFileSync(landPath,'utf8'));
const result=renderMapFrame(scene,Number(frameArg),land);
fs.mkdirSync(path.dirname(path.resolve(outFile)),{recursive:true});
fs.writeFileSync(outFile,result.svg);
fs.writeFileSync(outFile.replace(/\.svg$/i,'')+'.state.json',JSON.stringify(result.state,null,2));
console.log(`Wrote frame ${frameArg}: ${outFile}`);
