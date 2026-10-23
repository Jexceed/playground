import {mkdirSync,writeFileSync,readFileSync,existsSync,readdirSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';
import {renderExplorationSvg,drawingFinish} from './lib/exploration-renderer.mjs';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
const {explorationDrawings,soundStimuli,explorationSets}=await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const highResolution = new Set(explorationSets.flatMap(group=>group.rounds.flatMap(a=>[
 ...a.tokens.filter(t=>!t.textOnly&&!t.quantityPicture).map(t=>t.image),
 ...(a.illustration&&!a.presentation?.evidence?[a.illustration]:[]),
 ...(a.presentation?.evidence?.kind==='visualComparison'?a.presentation.evidence.panels.flatMap(p=>p.kind==='image'?[p.image]:[]):[]),
])).filter(image=>image.src.startsWith('/images/items/exploration/diagram-')).map(image=>image.src.split('/').pop().replace('.png','')));
const directory='public/images/items/exploration';mkdirSync(join(directory,'source'),{recursive:true});
const uri=path=>'data:image/png;base64,'+readFileSync(path).toString('base64');
const discUris=Object.fromEntries([['#548cb3','blue'],['#db675e','red'],['#e8b64e','yellow'],['#76a784','green']].map(([color,name])=>[color,uri(`public/images/items/pattern-train/${name}-disc.png`)]));
const personUri=uri('public/images/items/art-052/top-down-child.png');
const finishCounts={quantity:0,clocks:0,phonics:0,wrapped:0,facing:0},updated=[];
for(const [id,drawing] of Object.entries(explorationDrawings)){
 const svg=renderExplorationSvg(drawing,{discUris,personUri});
 const source=join(directory,'source',id+'.svg'),sourceChanged=!existsSync(source)||readFileSync(source,'utf8')!==svg;
 const finish=drawingFinish(drawing);for(const key of Object.keys(finishCounts))if(Array.isArray(finish[key])?finish[key].length:finish[key])finishCounts[key]++;
 writeFileSync(source,svg);
 const output=join(directory,id+'.png'), current=existsSync(output)?await sharp(output).metadata():null;
 // Hidden references may become visible again; keep an existing high-resolution copy.
 const scale=Math.max(highResolution.has(id)?2:1,current?.width/drawing.width||1), width=Math.round(drawing.width*scale), height=Math.round(drawing.height*scale);
 if(sourceChanged||current?.width!==width||current?.height!==height){await sharp(Buffer.from(svg),{density:72*scale}).resize(width,height).png().toFile(output);updated.push(id);}
}
mkdirSync('public/audio/stimuli',{recursive:true});
for(const [id,events] of Object.entries(soundStimuli)){
 const rate=22050,samples=[];
 for(const event of events){const count=Math.floor(event.duration*rate);for(let i=0;i<count;i++){const t=i/rate,envelope=Math.min(1,i/180)*Math.min(1,(count-i)/400)*Math.exp(-t*(event.timbre==='bright'?7:2));const wave=Math.sin(2*Math.PI*event.frequency*t)+(event.timbre==='bright'?.35*Math.sin(2*Math.PI*event.frequency*3*t):0);samples.push(Math.round(13000*envelope*wave));}for(let i=0;i<event.gap*rate;i++)samples.push(0);}
 const wav=Buffer.alloc(44+samples.length*2);wav.write('RIFF');wav.writeUInt32LE(36+samples.length*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);samples.forEach((v,i)=>wav.writeInt16LE(v,44+i*2));writeFileSync(`public/audio/stimuli/${id}.wav`,wav);
}
writeFileSync('public/audio/stimuli/source.json',JSON.stringify({generator:'deterministic harmonic tones, not recordings of real instruments',sampleRate:22050,stimuli:soundStimuli},null,2)+'\n');
// Only this generator's named outputs are removed; registered reusable assets stay.
for(const dir of [directory,join(directory,'source')])for(const file of readdirSync(dir))if(/^diagram-[0-9a-f]+\.(png|svg)$/.test(file)&&!explorationDrawings[file.replace(/\.(png|svg)$/,'')])unlinkSync(join(dir,file));
for(const file of readdirSync('public/audio/stimuli'))if(file.endsWith('.wav')&&!soundStimuli[file.slice(0,-4)])unlinkSync(join('public/audio/stimuli',file));
console.log(JSON.stringify({diagrams:Object.keys(explorationDrawings).length,highResolutionDiagrams:highResolution.size,pixelScale:2,sounds:Object.keys(soundStimuli).length,finishCounts,updated}));
