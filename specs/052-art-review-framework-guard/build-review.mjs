import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,basename} from 'node:path';
import sharp from 'sharp';
import {loadTypeScriptModule} from '../../scripts/lib/load-ts-module.mjs';
const root='specs/052-art-review-framework-guard/review';
await mkdir(root,{recursive:true});
const data=await loadTypeScriptModule('src/curriculum/catalog.ts');
const registered=new Map(),references=new Map(),frames=new Map();
function walk(v,visit,path=''){if(!v||typeof v!=='object')return;if(typeof v.src==='string'&&v.src.startsWith('/images/'))visit(v,path);for(const[k,item]of Object.entries(v))walk(item,visit,path+'.'+k);}
walk(data.imageGallery,(im,key)=>{const a=registered.get(im.src)??[];a.push(key);registered.set(im.src,a);if(im.frame)frames.set(im.src+'#'+im.frame.index,{...im,key});});
for(const g of data.catalogGames)for(const[r,round]of g.rounds.entries())walk(round,(im,path)=>{const key=im.src+(im.frame?'#'+im.frame.index:'');const a=references.get(key)??[];a.push({gameId:g.id,title:g.title,world:g.world,roundId:round.id,round:r+1,path});references.set(key,a);});
async function files(dir){const result=[];for(const item of await readdir(dir,{withFileTypes:true})){if(item.name==='source')continue;const path=join(dir,item.name);if(item.isDirectory())result.push(...await files(path));else if(/\.(png|svg|jpe?g|webp)$/.test(path))result.push(path);}return result;}
const paths=(await files('public/images')).sort();
let items=[];
for(const path of paths){const src=path.slice(6),meta=await sharp(path).metadata();items.push({id:items.length+1,path,src,width:meta.width,height:meta.height,registered:registered.get(src)??[],references:references.get(src)??[],category:src.includes('/scenes/')?'scenes':src.includes('/exploration/diagram-')?'diagrams':src.includes('/exploration-art/')?'atlases':'objects',disposition:'pending'});}
for(const[key,im]of frames){const path='public'+im.src,meta=await sharp(path).metadata();items.push({id:items.length+1,path,src:im.src,frame:im.frame,alt:im.alt,width:meta.width,height:meta.height,registered:[im.key],references:references.get(key)??[],category:'frames',disposition:'pending'});}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const pages=[];
for(const category of ['scenes','objects','atlases','frames','diagrams']){
 const list=items.filter(x=>x.category===category);const cols=category==='scenes'?4:6,rows=category==='scenes'?4:6,cellW=category==='scenes'?310:210,cellH=category==='scenes'?205:180;
 for(let start=0;start<list.length;start+=cols*rows){const pageItems=list.slice(start,start+cols*rows),overlays=[];for(const [index,item]of pageItems.entries()){
  let pipeline=sharp(item.path);if(item.frame){const f=item.frame,w=Math.round(item.width/f.columns),h=Math.round(item.height/f.rows);pipeline=pipeline.extract({left:(f.index%f.columns)*w,top:Math.floor(f.index/f.columns)*h,width:w,height:h});}
  const buffer=await pipeline.resize(cellW-16,cellH-36,{fit:'contain',background:'#f9f7f1'}).flatten({background:'#f9f7f1'}).png().toBuffer();
  const x=(index%cols)*cellW,y=Math.floor(index/cols)*cellH;
  overlays.push({input:buffer,left:x+8,top:y+6});
  const label=esc(`${item.id} ${item.alt??basename(item.path)}`.slice(0,35));
  overlays.push({input:Buffer.from(`<svg width="${cellW}" height="28"><text x="8" y="18" font-family="sans-serif" font-size="12" fill="#263238">${label}</text></svg>`),left:x,top:y+cellH-28});
 }
 const page=`${category}-${String(start/(cols*rows)+1).padStart(2,'0')}.png`;
 await sharp({create:{width:cellW*cols,height:cellH*Math.ceil(pageItems.length/cols),channels:4,background:'#ffffff'}}).composite(overlays).png().toFile(join(root,page));
 pageItems.forEach(x=>x.page=page);pages.push({page,ids:pageItems.map(x=>x.id)});
 }
}
await writeFile(join(root,'inventory.json'),JSON.stringify(items,null,2)+'\n');await writeFile(join(root,'pages.json'),JSON.stringify(pages,null,2)+'\n');
console.log({files:paths.length,frames:frames.size,total:items.length,pages:pages.length,categories:Object.fromEntries(['scenes','objects','atlases','frames','diagrams'].map(c=>[c,items.filter(i=>i.category===c).length]))});
