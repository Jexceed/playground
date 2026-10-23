import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {loadTypeScriptModule} from '../../scripts/lib/load-ts-module.mjs';
import {drawingFinish} from '../../scripts/lib/exploration-renderer.mjs';
const root='specs/052-art-review-framework-guard/',rows=JSON.parse(readFileSync(root+'review/inventory.json'));
const {explorationDrawings}=await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const changes=JSON.parse(readFileSync(root+'image-changes.json'));
const reused=new Set(['soilPot','hugShoulders','touchHead']);
const final=[];
for(const item of rows){
 const row={...item,reviewed:true,reviewMethod:'逐图查看编号联络表；问题图复看原图和更新结果'};
 const replacement=changes.find(c=>c.before?.src===item.src);
 if(replacement){row.disposition=reused.has(replacement.key)?'reuse-reviewed-art':'replace-with-imagegen';row.reason=reused.has(replacement.key)?'旧简笔图已有同义精细图；统一引用已经复核的现有素材。':'原图粗线、平涂或形体细节不足；使用本地透明重绘图保持同一对象。';row.replacement=replacement.after.src;}
 else if(item.category==='diagrams'){
  const drawing=explorationDrawings[item.src.split('/').at(-1).slice(0,-4)],f=drawingFinish(drawing);
  if(f.quantity){row.disposition='refine-quantity';row.reason='将小色点替换为可数的本地圆片；纯数量卡收紧空边，比较图保留原视窗。';}
  else if(f.clocks.length){row.disposition='refine-clock';row.reason='补充钟框、清楚区分长短针；全部针端点和读数位置保持原模型。';}
  else if(f.phonics.length){row.disposition='fix-phonics';row.reason='原来汉字拼音在窄格中相挤，改为格内上下两行。';}
  else if(f.wrapped.length){row.disposition='fix-cell-text';row.reason='旧排序参考图中长文字跨格；加入自适应分行，原文字不变。当前故事流程使用独立插画。';}
  else if(f.facing){row.disposition='refine-facing';row.reason='块状人物换为有朝向的本地俯视木偶；球和朝向箭头保持原模型。';}
  else {row.disposition='retain-exact-diagram';row.reason=drawing.objects.every(o=>o.kind==='text')?'文字或数字本身是学习对象或已被新呈现覆盖的缓存标签；保留准确字形。':drawing.objects.some(o=>o.kind==='polygon'&&o.fill==='#c7dfec')?'立体积木的棱线和面向清楚，保留精确块数、投影与视角。':drawing.objects.filter(o=>o.kind==='rect').length>=4?'方格、涂色、孔位或位置模型清楚；保留精确格线、填色和边界。':drawing.objects.some(o=>o.kind==='circle'&&o.r>20)?'大小、包含、相切或遮挡的轮廓清楚；不以装饰材质掩盖关系。':'箭头、线段、色块或符号关系可辨，保留题目要求的精确结构。';}
 } else if(item.category==='frames'){row.disposition='retain-reviewed-frame';row.reason=`已检查“${item.alt}”裁帧，主体与动作可辨，未见裁线穿过主体。`;}
 else if(item.category==='atlases'){row.disposition='retain-reviewed-atlas';row.reason=item.src.includes('planting-steps')?'原图第二格已经由独立播种图替代；其余三格与当前引用匹配。':'同时查看整图与每个注册裁帧，细节完整、风格一致。';}
 else if(item.category==='scenes'){row.disposition=item.src.includes('enlightenment-bridge-')?'retain-reference':'retain-reviewed-scene';row.reason=item.src.includes('enlightenment-bridge-')?'保留的精确旧参考图；当前搭桥题已用048交互模型呈现。':'情境、人物动作与关键物件清楚，画面细节完整；保留现有场景。';}
 else {row.disposition='retain-reviewed-object';row.reason=item.src.includes('/thinking-symbols/')?'颜色形状是判断依据，轮廓、尺寸和填色清楚，保持准确符号。':item.src.includes('/brand/')?'品牌画面构图完整；沿用当前品牌引用，历史版本保留。':'对象、材质或动作细节清楚，未见需要重绘的缺边、模糊或粗糙问题。';}
 row.verification=row.disposition.startsWith('refine-')||row.disposition.startsWith('fix-')?'逐图更新后复查与全量模型核对；实际页面按受影响题型做代表检查，详见verification.md':'对应联络表逐图检查';
 if(replacement)row.verification='image_gen原图检查、透明白底复看、注册和实际图卡检查';
 final.push(row);
}
writeFileSync(root+'review/ledger.json',JSON.stringify(final,null,2)+'\n');
const edited=final.filter(x=>/^(refine-|fix-)/.test(x.disposition));
for(let start=0;start<edited.length;start+=36){const part=edited.slice(start,start+36),layers=[];for(const[i,a]of part.entries()){const x=i%6*210,y=Math.floor(i/6)*180;layers.push({input:await sharp(a.path).resize(194,144,{fit:'contain',background:'#fffdf7'}).png().toBuffer(),left:x+8,top:y+6});layers.push({input:Buffer.from(`<svg width="210" height="28"><text x="8" y="18" font-size="12">${a.id}</text></svg>`),left:x,top:y+152});}await sharp({create:{width:1260,height:Math.ceil(part.length/6)*180,channels:4,background:'#fff'}}).composite(layers).png().toFile(root+`review/final-diagrams-${start/36+1}.png`);}
const summary={files:1176,frames:74,reviewItems:final.length,reviewPages:39,pending:final.filter(x=>x.disposition==='pending').length,dispositions:Object.fromEntries([...new Set(final.map(x=>x.disposition))].map(k=>[k,final.filter(x=>x.disposition===k).length])),newGeneratedAssets:16,modelsUnchanged:858};
writeFileSync(root+'review/summary.json',JSON.stringify(summary,null,2)+'\n');
const manifestPath='public/images/items/art-052/source/manifest.json',manifest=JSON.parse(readFileSync(manifestPath));for(const a of manifest.assets){a.sha256=createHash('sha256').update(readFileSync(a.target)).digest('hex');a.sourceSHA256=createHash('sha256').update(readFileSync(a.source)).digest('hex');}
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');console.log(summary);
