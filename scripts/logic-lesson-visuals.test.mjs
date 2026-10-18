import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync,existsSync}from'node:fs';
import{loadGameData}from'./lib/load-game-data.mjs';import{loadTypeScriptModule}from'./lib/load-ts-module.mjs';
const baseline=JSON.parse(readFileSync('specs/046-logic-house-visual-completeness/verification/baseline.json'));
const data=JSON.parse(JSON.stringify(await loadGameData()));
const v=await loadTypeScriptModule('src/data/logicLessonVisuals.ts');const{imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');
const logic=data.games.filter(g=>g.world==='logic'),rounds=logic.flatMap(g=>g.rounds),byId=new Map(rounds.map(r=>[r.id,r]));
const lessons=rounds.map(r=>[r,v.logicLessonFor(r)]).filter(([,l])=>l);
const images=p=>[...(p.image?[p.image]:[]),...(p.images??[])];
const registered=new Set([...Object.values(imageGallery.items),...Object.values(imageGallery.scenes)].map(i=>i.src));

test('all 319 logic questions and all other curriculum data retain their exact IDs, answers and wording',()=>{assert.equal(rounds.length,319);assert.deepEqual(Object.fromEntries(Object.entries(data).filter(([key])=>key!=='imageGallery')),Object.fromEntries(Object.entries(baseline).filter(([key])=>key!=='imageGallery')));for(const[category,assets]of Object.entries(baseline.imageGallery))for(const[key,value]of Object.entries(assets))assert.deepEqual(data.imageGallery[category][key],value,`old gallery asset ${category}/${key}`);});
test('all 26 life and 17 evidence problems have complete context, current facts, outcomes and every choice',()=>{
 assert.equal(lessons.length,43);
 for(const[r,l]of lessons){assert.ok(images(l.context).length||l.context.diagram,r.id);assert.ok(l.evidenceScene||l.evidence.length,r.id);assert.ok(l.resolution.length,r.id);assert.deepEqual(Object.keys(l.choices).sort(),r.choices.map(c=>c.value).sort(),r.id);
 for(const picture of [l.context,...l.evidence,...l.resolution,...Object.values(l.choices)]){assert.ok(images(picture).length||picture.diagram||picture.diagrams?.length,r.id);for(const image of images(picture)){assert.ok(image,`${r.id}: missing image`);assert.ok(registered.has(image.src),image.src);assert.ok(existsSync('public'+image.src),image.src);}}
 }
});
test('wrong actions never replay as the recommended correction',()=>{
 const get=id=>v.logicLessonFor(byId.get(id));
 const paths=id=>get(id).resolution.flatMap(images).map(i=>i.src);
 assert.ok(paths('logic-fix-plan-1').every(p=>!p.includes('dirty')));
 assert.match(paths('logic-fix-plan-2')[0],/traffic-stop/);
 assert.ok(paths('logic-fix-plan-6').some(p=>p.includes('takeOutSort')));
 assert.ok(paths('logic-fix-plan-6').every(p=>!p.includes('allOne')));
 for(const id of ['logic-condition-detective-4','logic-fix-plan-4','logic-fix-plan-11'])assert.equal(get(id).kind,'reason');
 assert.deepEqual(get('logic-priority-choice-3').context.diagram.inventory,[5,2]);
 assert.deepEqual(get('logic-priority-choice-3').context.diagram.planks,[]);
 for(const id of ['logic-condition-detective-5','logic-fix-plan-5'])assert.match(get(id).evidence[0].image.src,/snack-clean/);
});
test('evidence choices preserve the photographed scene, including awake dogs and an empty weak-clue plate',()=>{
 for(const id of ['logic-story-evidence-3','logic-condition-detective-8','logic-fix-plan-8'])assert.match(v.logicLessonFor(byId.get(id)).context.image.src,/logic-046-cat-kitchen/);
 for(const id of ['logic-story-evidence-7','logic-condition-detective-11','logic-priority-choice-12']){
  const l=v.logicLessonFor(byId.get(id));for(const picture of Object.values(l.choices)){assert.match(picture.image.src,/weakDog/);assert.ok(picture.badge);assert.doesNotMatch(picture.image.src,/sleep/i);}
 }
});
test('all 14 packing tasks have explicit needs while three analogies expose the previously absent target',()=>{
 const group=logic.find(g=>g.id==='logic-rule-filter');assert.equal(group.rounds.length,14);
 for(const round of group.rounds)assert.ok(v.logicTaskCueFor(group.id,round)?.frames.length,round.id);
 assert.match(v.logicRelationFrames(byId.get('sun-raincoat-analogy')).target[0].image.src,/rainWindow/);
 const hungry=v.logicRelationFrames(byId.get('thirst-hungry'));assert.match(hungry.example[0].image.src,/thirsty/);assert.match(hungry.target[0].image.src,/hungry/);
 assert.match(v.logicRelationFrames(byId.get('door-river-tool')).target[0].image.src,/bridge-river/);
});
test('all six color-action rules display two distinct actions and match the round rule',()=>{
 const group=logic.find(g=>g.id==='logic-stop-think');
 for(const[index,round]of group.rounds.entries()){
  const rules=v.logicActionRules(round);assert.equal(rules.length,2);assert.equal(new Set(rules.map(f=>f.image.src)).size,2);
  assert.deepEqual(rules.map(f=>f.label),index<2?['绿片拍手','红片抱肩']:index<4?['绿片抱肩','红片拍手']:['绿片摸头','红片抱肩']);
 }
});
test('every spoken support caption has been exported for local narration',()=>{
 const texts=new Set(JSON.parse(readFileSync('public/audio/voice-lines.json')).lines.map(l=>l.text));
 for(const game of logic)for(const round of game.rounds)for(const line of v.logicSupportVoiceLines(game.id,round))assert.ok(texts.has(line),`${round.id}: ${line}`);
});
