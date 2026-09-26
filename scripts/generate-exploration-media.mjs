import {mkdirSync,writeFileSync,existsSync,readdirSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
const {explorationDrawings,soundStimuli,explorationSets}=await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const highResolution = new Set(explorationSets.flatMap(group=>group.rounds.flatMap(a=>[
 ...a.tokens.filter(t=>!t.textOnly&&!t.quantityPicture).map(t=>t.image),
 ...(a.illustration&&!a.presentation?.evidence?[a.illustration]:[]),
 ...(a.presentation?.evidence?.kind==='visualComparison'?a.presentation.evidence.panels.flatMap(p=>p.kind==='image'?[p.image]:[]):[]),
])).filter(image=>image.src.startsWith('/images/items/exploration/diagram-')).map(image=>image.src.split('/').pop().replace('.png','')));
const directory='public/images/items/exploration';mkdirSync(join(directory,'source'),{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function object(o){const stroke='stroke="#344555" stroke-width="2.2" stroke-linejoin="round"';switch(o.kind){case'circle':return `<circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="${o.fill}" ${stroke}/>`;case'rect':return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="${o.fill}" ${stroke} ${o.dash?'stroke-dasharray="8 6"':''}/>`;case'line':return `<line x1="${o.x}" y1="${o.y}" x2="${o.x2}" y2="${o.y2}" ${o.color?stroke.replace('#344555',o.color):stroke} ${o.dash?'stroke-dasharray="8 6"':''}/>`;case'polygon':return `<polygon points="${o.points.map(p=>p.join(',')).join(' ')}" fill="${o.fill}" ${stroke}/>`;case'text':return `<text x="${o.x}" y="${o.y}" font-family="PingFang SC,Heiti SC,sans-serif" font-size="${o.size??28}" fill="${o.color??'#253243'}" text-anchor="middle">${esc(o.text)}</text>`;default:throw Error(o.kind);}}
for(const [id,drawing] of Object.entries(explorationDrawings)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${drawing.width}" height="${drawing.height}" viewBox="0 0 ${drawing.width} ${drawing.height}"><rect width="100%" height="100%" fill="#fffdf7"/>${drawing.objects.map(object).join('')}</svg>`;
 writeFileSync(join(directory,'source',id+'.svg'),svg);
 const scale=highResolution.has(id)?2:1, width=Math.round(drawing.width*scale), height=Math.round(drawing.height*scale);
 const output=join(directory,id+'.png'), current=existsSync(output)?await sharp(output).metadata():null;
 if(current?.width!==width||current?.height!==height)await sharp(Buffer.from(svg),{density:72*scale}).resize(width,height).png().toFile(output);
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
console.log(JSON.stringify({diagrams:Object.keys(explorationDrawings).length,highResolutionDiagrams:highResolution.size,pixelScale:2,sounds:Object.keys(soundStimuli).length}));
