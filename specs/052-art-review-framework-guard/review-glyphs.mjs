import {readFile,writeFile,mkdir}from'node:fs/promises';import{resolve}from'node:path';import{pathToFileURL}from'node:url';import{build}from'vite';import sharp from'sharp';import{loadTypeScriptModule}from'../../scripts/lib/load-ts-module.mjs';
const root='specs/052-art-review-framework-guard/review';
const result=await build({configFile:false,logLevel:'silent',esbuild:{jsx:'automatic'},build:{ssr:resolve('specs/052-art-review-framework-guard/glyph-entry.tsx'),write:false,rollupOptions:{output:{format:'es',inlineDynamicImports:true}}}});
const code=result.output.find(x=>x.type==='chunk').code;await writeFile(root+'/glyph-module.mjs',code);
const {renderGlyph,visualMetaFor,visualParts}=await import(pathToFileURL(resolve(root+'/glyph-module.mjs')));
const {catalogGames}=await loadTypeScriptModule('src/curriculum/catalog.ts');
const usage=new Map();function strings(v,fn){if(typeof v==='string')fn(v);else if(v&&typeof v==='object')for(const x of Object.values(v))strings(x,fn);}
for(const g of catalogGames)for(const r of g.rounds)strings(r,value=>{for(const text of [value,...visualParts(value)]){const m=visualMetaFor(text);if(m){const a=usage.get(m.kind)??[];if(!a.some(x=>x.roundId===r.id))a.push({gameId:g.id,roundId:r.id,title:g.title,label:text});usage.set(m.kind,a);}}});
const src=await readFile('src/components/VisualToken.tsx','utf8'),kinds=[...new Set([...[...src.matchAll(/case "([^"]+)"/g)].map(x=>x[1]),...usage.keys()])];
const styles=await readFile('src/styles.css','utf8');
const css=styles.match(/\.(?:stroke|fill-[\w-]+|svg-[\w-]+)[^{]*\{[^}]*\}/g)?.join('\n')??'';
const ledger=[];await mkdir(root+'/glyphs',{recursive:true});
for(const kind of kinds){let html=renderGlyph(kind);if(html.includes('<img')){ledger.push({kind,path:html.match(/src="([^"]+)"/)?.[1],format:'raster',references:usage.get(kind)??[]});continue;}
 for(const match of [...html.matchAll(/href="(\/images\/[^"]+)"/g)])html=html.replace(match[0],`href="data:image/png;base64,${(await readFile('public'+decodeURIComponent(match[1]))).toString('base64')}"`);
 html=html.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" ').replace('><defs>',`><style>${css}</style><defs>`);
 const path=root+'/glyphs/'+kind+'.png';await sharp(Buffer.from(html)).png().toFile(path);ledger.push({kind,path,format:'svg',references:usage.get(kind)??[]});}
const list=ledger.filter(x=>x.format==='svg');
for(let start=0;start<list.length;start+=36){const part=list.slice(start,start+36),overlays=[];for(const[index,x]of part.entries()){const left=index%6*180,top=Math.floor(index/6)*170;overlays.push({input:await sharp(x.path).resize(152,138,{fit:'contain',background:'#f8f5ed'}).png().toBuffer(),left:left+14,top:top+5});overlays.push({input:Buffer.from(`<svg width="180" height="25"><text x="5" y="17" font-size="11">${x.kind} (${x.references.length})</text></svg>`),left,top:top+143});}const name=`glyphs-${start/36+1}.png`;await sharp({create:{width:1080,height:170*Math.ceil(part.length/6),channels:4,background:'#ffffff'}}).composite(overlays).png().toFile(root+'/'+name);part.forEach(x=>x.page=name);}
await writeFile(root+'/glyphs.json',JSON.stringify(ledger,null,2)+'\n');console.log({kinds:kinds.length,rasters:ledger.length-list.length,svg:list.length,activeSVG:list.filter(x=>x.references.length).length});
