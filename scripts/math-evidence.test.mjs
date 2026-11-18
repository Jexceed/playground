import{createRequire}from'node:module';import{resolve}from'node:path';import{pathToFileURL}from'node:url';import{build}from'vite';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{createHash}from'node:crypto';import{createElement}from'react';import{renderToStaticMarkup}from'react-dom/server';import sharp from'sharp';
import{loadTypeScriptModule}from'./lib/load-ts-module.mjs';import{restoreMathReadability}from'./lib/restore-reviewed-art.mjs';
async function loadComponent(entry) {
 const require=createRequire(import.meta.url), ids=['react','react/jsx-runtime','react/jsx-dev-runtime'];
 const result=await build({configFile:false,publicDir:false,logLevel:'silent',ssr:{noExternal:true,external:ids},build:{ssr:resolve(entry),write:false,rollupOptions:{output:{format:'es',inlineDynamicImports:true,paths:Object.fromEntries(ids.map(id=>[id,pathToFileURL(require.resolve(id)).href]))}}}});
 return import('data:text/javascript;base64,'+Buffer.from(result.output.find(o=>o.type==='chunk').code).toString('base64'));
}
const [catalog,exp,fig,part,domain]=await Promise.all([loadTypeScriptModule('src/curriculum/catalog.ts'),loadTypeScriptModule('src/curriculum/exploration/index.ts'),loadComponent('src/interactions/MathEvidence.tsx'),loadComponent('src/interactions/PartitionCard.tsx'),loadTypeScriptModule('src/domain/activity.ts')]);
const all=catalog.catalogGames.flatMap(g=>g.rounds),rounds=f=>all.filter(a=>a.primaryFamilyId===f),before=JSON.parse(fs.readFileSync('specs/059-chapter-readability/reviews/catalog-before.json'));const hash=x=>createHash('sha256').update(x).digest('hex');const render=e=>renderToStaticMarkup(createElement(fig.MathEvidence,{evidence:e}));
test('only the exact 66 reviewed presentations/critical clues change; all answers and 1110 identities remain intact',()=>{assert.deepEqual(restoreMathReadability(catalog.catalogGames),before);const changes=JSON.parse(fs.readFileSync('specs/059-chapter-readability/math-presentation-changes.json'));assert.equal(changes.length,66);for(const c of changes)assert.ok(c.fields.every(f=>['presentation','tokens','clues','hints'].includes(f)));const bad=structuredClone(catalog.catalogGames);bad.find(g=>g.id==='explore-time-elapsed').rounds[0].answerId='wrong';assert.notDeepEqual(restoreMathReadability(bad),before);const wrong=structuredClone(catalog.catalogGames);wrong.find(g=>g.id==='explore-time-elapsed').rounds[0].presentation.evidence.clocks[0].minute=5;assert.throws(()=>restoreMathReadability(wrong),/exact reviewed 059/);});
test('all sharing models use the given quantities and leave the asked quantity unknown',()=>{for(const a of rounds('N07')){const e=a.presentation.evidence,oracle=exp.authoringNotes[a.id].oracle,html=render(e);assert.equal(e.kind,'sharingModel');assert.ok(!('answer'in e));if(e.mode==='share'){assert.deepEqual([e.total,e.people],oracle.values);assert.ok(!('each'in e));assert.equal((html.match(/class="math-recipient"/g)||[]).length,e.people);assert.equal((html.match(/<strong>\?<\/strong>/g)||[]).length,e.people);}else if(e.mode==='groups'){assert.deepEqual([e.groups,e.each],oracle.values);assert.ok(!('total'in e));assert.equal((html.match(/class="math-chip-box"/g)||[]).length,e.groups);}else{assert.deepEqual([e.total,e.capacity],oracle.values);assert.ok(!('groups'in e));assert.ok(!('remainder'in e));}}});
test('each partition card draws its left and right counts, including explicitly empty boxes', () => {
  const original = new Map(before.flatMap(g => g.rounds).map(r => [r.id, r]));
  for (const activity of rounds('N04')) {
    for (const token of activity.tokens) {
      const { left, right } = token.partitionCounts;
      assert.equal(token.label, `左${left}右${right}`);
      if (activity.stage !== 1 || activity.expectedTokenIds.includes(token.id)) {
        const previous = original.get(activity.id).tokens.find(t => t.id === token.id);
        assert.equal(token.label, previous.label, activity.id);
      }
      const diagramId = token.image.src.split('/').at(-1).replace('.png', '');
      const art = exp.explorationDrawings[diagramId];
      const boxes = art.objects.filter(o => o.kind === 'rect');
      const discs = art.objects.filter(o => o.kind === 'circle');
      assert.deepEqual(boxes.map(box => discs.filter(o => o.x > box.x && o.x < box.x + box.w).length), [left, right]);
      const html = renderToStaticMarkup(createElement(part.PartitionCard, token.partitionCounts));
      assert.equal((html.match(/<img /g) ?? []).length, left + right);
      assert.equal((html.match(/partition-empty/g) ?? []).length, Number(left === 0) + Number(right === 0));
      assert.match(html, /左盒/);
      assert.match(html, /右盒/);
    }
  }
});
test('clock hours include minute offsets and the comparison preserves the exact elapsed duration',()=>{for(const[index,a]of rounds('N14').entries()){const e=a.presentation.evidence,v=index%3,s=Math.floor(index/3);assert.equal(e.kind,'clockModel');assert.deepEqual(e.clocks[0],{label:s<2?'':'开始',hour:3+v,minute:s===0?30:s===1?15+v*10:20});if(s===2){assert.equal(e.clocks[1].label,'结束');assert.equal(e.clocks[1].hour*60+e.clocks[1].minute-e.clocks[0].hour*60-e.clocks[0].minute,25+v*10);}const html=render(e);assert.equal((html.match(/class="math-clock-number"/g)||[]).length,e.clocks.length*12);assert.doesNotMatch(html,/<text /);for(const c of e.clocks){const single=renderToStaticMarkup(createElement(fig.MathClock,c)),hour=single.match(/<line x1="120" y1="120" x2="([^"]+)" y2="([^"]+)"[^>]+data-hand="hour"/);assert.ok(hour);const angle=Math.atan2(+hour[1]-120,120-(+hour[2]));assert.ok(Math.abs(Math.sin(angle)-Math.sin((c.hour%12+c.minute/60)*Math.PI/6))<1e-8);assert.ok(Math.abs(Math.cos(angle)-Math.cos((c.hour%12+c.minute/60)*Math.PI/6))<1e-8);const min=single.match(/<line x1="120" y1="120" x2="([^"]+)" y2="([^"]+)"[^>]+data-hand="minute"/);assert.ok(min);assert.ok(Math.abs(+min[1]-120-72*Math.sin(c.minute*Math.PI/30))<1e-8);assert.ok(Math.abs(120-(+min[2])-72*Math.cos(c.minute*Math.PI/30))<1e-8);}}});
test('ruler endpoints and perimeter sides agree with the original arithmetic, labels remain outside scaled SVG',()=>{for(const a of rounds('N15')){const e=a.presentation.evidence,o=exp.authoringNotes[a.id].oracle,html=render(e);if(e.kind==='rulerModel'){assert.deepEqual([e.end,e.start],o.values);assert.equal((html.match(/class="math-ruler-tick"/g)||[]).length,13);assert.match(html,/class="math-measured-paper"/);}else{assert.deepEqual([e.columns,e.rows],o.values);assert.equal((html.match(/math-perimeter-(?:top|right|bottom|left)/g)||[]).length,4);}assert.doesNotMatch(html,/<text /);}});
test('number patterns and equations have one unknown and do not print the derived answer in their model',()=>{for(const a of rounds('N11')){const e=a.presentation.evidence;assert.equal(e.values.filter(v=>v===null).length,1);assert.equal(e.values.at(-1),null);assert.equal(e.columns,a.stage===3?3:e.values.length);}for(const a of rounds('N12')){const e=a.presentation.evidence;assert.equal(e.relations.filter(r=>r.total===null).length,1);assert.equal(e.relations.at(-1).total,null);}for(const a of rounds('N10').filter(a=>a.stage>1)){assert.equal(a.presentation.evidence.tens*10+a.presentation.evidence.ones,23+(Number(a.id.split('-').at(-1))-1)%3*11);assert.match(domain.activityPromptSpeech(a),/一长条代表10，一小块代表1/);}for(const a of rounds('N03').filter(a=>a.stage===3))assert.match(domain.activityPromptSpeech(a),/全部倒入，没有洒出/);});
test('all four generated assets are registered, preserve alpha/canvas, and have auditable originals and prompts',async()=>{const m=JSON.parse(fs.readFileSync('public/images/items/math-models-059/source/manifest.json'));assert.equal(m.tool,'built-in image_gen');assert.equal(m.assets.length,4);const additions=JSON.parse(fs.readFileSync('specs/059-chapter-readability/math-gallery-additions.json'));for(const a of m.assets){assert.ok(additions.some(i=>'public'+i.after.src===a.runtime));assert.equal(hash(fs.readFileSync(a.source)),a.sourceSHA256);assert.equal(hash(fs.readFileSync(a.runtime)),a.sha256);assert.ok(a.prompt.length>100);const meta=await sharp(a.runtime).metadata();assert.equal(meta.hasAlpha,true);assert.deepEqual([meta.width,meta.height],a.size);const expected=await sharp(a.source).resize({width:a.size[0],withoutEnlargement:true}).raw().toBuffer(),actual=await sharp(a.runtime).raw().toBuffer();assert.deepEqual(actual,expected);}});

test('HTML number and equation models preserve every symbol and known value in the original registered drawings',()=>{for(const family of ['N11','N12'])for(const a of rounds(family)){const id=a.illustration.src.split('/').at(-1).replace('.png','');const oldText=exp.explorationDrawings[id].objects.filter(o=>o.kind==='text').map(o=>o.text);const e=a.presentation.evidence;const text=family==='N11'?e.values.map(v=>v===null?'?':String(v)):e.relations.map(r=>r.shapes.map(s=>s==='circle'?'○':'△').join(' + ')+' = '+(r.total===null?'?':r.total));assert.deepEqual(text,oldText,a.id);}});

const evidenceModule=await loadComponent('src/interactions/ActivityEvidence.tsx');
test('removing one marks exactly one original unit, preserves all given blocks and leaves the remainder unknown',()=>{
 for(const a of rounds('N10').filter(a=>a.stage>1)){
  const e=a.presentation.evidence,html=render(e),text=html.replace(/<[^>]*>/g,'');
  if(a.stage===2){assert.doesNotMatch(html,/is-taken-away/);assert.equal(e.removeOnes,undefined);continue;}
  const n=Number(a.prompt.match(/原来有(\d+)个/)[1]);
  assert.equal(e.tens*10+e.ones,n);
  assert.equal((html.match(/class="math-ten-rod"/g)||[]).length,Math.floor(n/10));
  assert.equal((html.match(/<i><\/i>/g)||[]).length,Math.floor(n/10)*10);
  const onesMarkup=html.match(/class="math-ones">(.*?)<\/div>/)[1];
  assert.equal((onesMarkup.match(/<span/g)||[]).length,n%10);
  assert.equal((html.match(/class="is-taken-away"/g)||[]).length,1);
  assert.match(text,/原来/);assert.match(text,/拿走 1 小块，还剩 \?/);
  assert.ok(!text.includes(String(n-1)),a.id+': do not print the answer');
  assert.equal(a.tokens.find(t=>t.id===a.answerId).label,String(n-1));
 }
});
test('making-ten and breaking-ten rounds cross ten cleanly without splitting into zero or printing answers',()=>{
 for(const a of rounds('N05').filter(a=>a.stage===2)){
  assert.doesNotMatch([a.prompt,a.success,...a.hints].join(''),/拆成0/);
  assert.equal(a.illustration.alt,a.prompt);
 }
 const a6=rounds('N05')[5];
 assert.equal(a6.prompt,'8加7等于多少？先试试凑成十。');
 assert.equal(a6.tokens.find(t=>t.id===a6.answerId).label,'15');
 assert.match(a6.success,/把7拆成2和5，先凑成十，再加剩下的，得到15/);
 for(const a of rounds('N05').filter(a=>a.stage===3)){
  const e=a.presentation.evidence,html=render(e),text=html.replace(/<[^>]*>/g,'');
  assert.equal(e.kind,'placeValueModel');
  assert.equal((html.match(/is-taken-away/g)||[]).length,e.removeOnes);
  assert.match(text,new RegExp(`拿走 ${e.removeOnes} 小块，还剩 \\?`));
  const expectedAnswer=String(e.tens*10+e.ones-e.removeOnes);
  assert.equal(a.tokens.find(t=>t.id===a.answerId).label,expectedAnswer);
  assert.ok(!text.includes(`还剩 ${expectedAnswer}`),a.id+': do not print the answer');
 }
});
test('every new mathematical reference retains enlargement using the readable model rather than the former tiny bitmap',()=>{for(const a of all.filter(a=>['sharingModel','moneyExchange','clockModel','rulerModel','perimeterModel','placeValueModel','numberPattern','shapeEquations','waterModel'].includes(a.presentation?.evidence?.kind))){const html=renderToStaticMarkup(createElement(evidenceModule.ActivityEvidence,{activity:a,phase:'respond'}));assert.equal((html.match(/aria-label="放大题目图片"/g)||[]).length,1,a.id);assert.match(html,/math-zoom-scroll/);assert.match(html,/左右滑动，看看细节/);assert.doesNotMatch(html,/src="[^"]*exploration\/diagram-/);}});
