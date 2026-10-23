import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {drawingFinish,renderExplorationSvg} from './lib/exploration-renderer.mjs';
const {explorationDrawings}=await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const uri='data:image/png;base64,TEST',discUris=Object.fromEntries(['#548cb3','#db675e','#e8b64e','#76a784'].map(c=>[c,uri]));
test('quantity sprites keep every authored centre and diameter without mutating the model',()=>{
 let count=0;
 for(const d of Object.values(explorationDrawings))if(drawingFinish(d).quantity){const before=JSON.stringify(d),svg=renderExplorationSvg(d,{discUris});const circles=d.objects.filter(o=>o.kind==='circle');assert.equal((svg.match(/data-quantity-dot=/g)||[]).length,circles.length);for(const o of circles)assert.ok(svg.includes(`x="${o.x-o.r}" y="${o.y-o.r}" width="${o.r*2}" height="${o.r*2}"`));assert.equal(JSON.stringify(d),before);count++;}
 assert.equal(count,81);
});
test('holes, overlapping geometry and large shape comparisons never become quantity chips',()=>{
 const hole={width:100,height:100,objects:[{kind:'rect',x:0,y:0,w:100,h:100,fill:'#fffdf7'},{kind:'circle',x:50,y:50,r:9,fill:'#db675e'}]};
 const overlap={width:100,height:100,objects:[{kind:'circle',x:45,y:50,r:35,fill:'#db675e'},{kind:'circle',x:65,y:50,r:35,fill:'#548cb3'}]};
 assert.equal(drawingFinish(hole).quantity,false);assert.equal(drawingFinish(overlap).quantity,false);
});
test('clock hands keep exact authored endpoints, and reference glyphs fit inside their cells',()=>{
 let clocks=0,phonics=0,wrapped=0;
 for(const d of Object.values(explorationDrawings)){
  const f=drawingFinish(d),before=JSON.stringify(d),svg=renderExplorationSvg(d,{discUris,personUri:uri});
  for(const c of f.clocks){for(const hand of d.objects.filter(o=>o.kind==='line'&&Math.abs(o.x-c.x)<.001&&Math.abs(o.y-c.y)<.001))assert.ok(svg.includes(`x1="${hand.x}" y1="${hand.y}" x2="${hand.x2}" y2="${hand.y2}"`));clocks++;}
  for(const p of f.phonics){const [han,pinyin]=p.text.split(/\s+/);assert.ok(svg.includes(`>${han}</text>`));assert.ok(svg.includes(`>${pinyin}</text>`));phonics++;}
  wrapped+=f.wrapped.length;
  assert.equal(JSON.stringify(d),before);
 }
 assert.equal(clocks,18);assert.equal(phonics,9);assert.equal(wrapped,11);
});
test('facing artwork keeps the original ball and direction arrow',()=>{
 let count=0;for(const d of Object.values(explorationDrawings))if(drawingFinish(d).facing){const svg=renderExplorationSvg(d,{discUris,personUri:uri}),arrow=d.objects[8],ball=d.objects[9];assert.ok(svg.includes(`points="${arrow.points.map(p=>p.join(',')).join(' ')}"`));assert.ok(svg.includes(`cx="${ball.x}" cy="${ball.y}" r="${ball.r}"`));count++;}assert.equal(count,9);
});
test('art styles cannot recolor the shared primary, secondary or tool buttons',()=>{
 const css=readFileSync('src/interactions/rule-play.css','utf8');
 for(const [,selector,body]of css.matchAll(/([^{}]+)\{([^{}]*)\}/g))if(/\.activity-(?:primary|secondary|tools)/.test(selector))assert.doesNotMatch(body,/(?:background|box-shadow|border-radius|border-color|(?<!-)color)\s*:/,selector);
});
test('every new cutout is registered, source-backed and has a persisted generation prompt',async()=>{
 const {imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');const manifest=JSON.parse(readFileSync('public/images/items/art-052/source/manifest.json'));
 for(const a of manifest.assets){assert.ok(existsSync(a.target));assert.ok(existsSync(a.source));assert.ok(a.prompt.length>100);assert.equal(a.hasAlpha,true);assert.ok(Object.values(imageGallery.items).some(i=>i.src===a.target.slice(6)),a.name);}
 assert.equal(manifest.assets.length,16);
});
test('historical normalization rejects unreviewed artwork and never rewrites an answer',async()=>{
 const {loadGameData}=await import('./lib/load-game-data.mjs');const {restoreReviewedArt,restoreRulePlayPresentation}=await import('./lib/restore-reviewed-art.mjs');
 const data=await loadGameData(),bad=JSON.parse(JSON.stringify(data));bad.imageGallery.items.bike.alt='unreviewed';assert.throws(()=>restoreReviewedArt(bad),/exact reviewed 052/);
 const a=data.activitySets.flatMap(g=>g.rounds).find(r=>r.primaryFamilyId==='L08');const altered={...JSON.parse(JSON.stringify(a)),answerId:'unreviewed-answer'};
 const restored=restoreRulePlayPresentation({round:altered});assert.equal(restored.round.answerId,'unreviewed-answer');
 const text={...JSON.parse(JSON.stringify(a)),prompt:'unreviewed prompt'};assert.throws(()=>restoreRulePlayPresentation({round:text}),/exact reviewed 050/);
});
