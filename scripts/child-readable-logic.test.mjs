import {restoreChildReadableWording} from "./lib/restore-reviewed-wording.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGameData} from './lib/load-game-data.mjs';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
const current=JSON.parse(JSON.stringify(await loadGameData()));
const baseline=JSON.parse(readFileSync('specs/047-child-readable-logic/verification/baseline.json'));
const changes=JSON.parse(readFileSync('specs/047-child-readable-logic/content-changes.json'));
const {logicLessonFor}=await loadTypeScriptModule('src/data/logicLessonVisuals.ts');
const {logicEvidenceDefinitions}=await loadTypeScriptModule('src/data/logicEvidence.ts');
const byId=new Map(current.games.flatMap(g=>g.rounds).map(r=>[r.id,r]));
test('047 edits only declared wording fields, preserving all identities, choices, answers and other courses',()=>{
 const restored=structuredClone(current);
 for(const change of changes){
  assert.ok(['logic-sorter-switch','logic-story-evidence','logic-condition-detective','logic-fix-plan','logic-priority-choice','logic-space-bridge'].includes(change.gameId));
  const round=restored.games.find(g=>g.id===change.gameId).rounds.find(r=>r.id===change.id);
  for(const field of change.fields){
   assert.ok(['prompt','instruction','choices','success','retry','parentPrompt'].includes(field));
   assert.deepEqual(round[field],change.after[field]);
   if(field==='choices')assert.deepEqual(round.choices.map(c=>c.value),change.before.choices.map(c=>c.value));
   round[field]=change.before[field];
  }
 }
 const withoutGallery=({imageGallery,...rest})=>rest;
 assert.deepEqual(withoutGallery(restoreChildReadableWording(current)),withoutGallery(baseline));
});
test('classification uses groups throughout speech and labels without changing the two-condition rounds',()=>{
 for(let i=1;i<=8;i++){
  const r=byId.get(`logic-sorter-switch-${i}`);
  for(const text of [r.prompt,r.instruction,r.success,r.retry,r.parentPrompt,...r.choices.map(c=>c.label)])assert.doesNotMatch(text,/篮子/);
 }
 for(let i=9;i<=11;i++)assert.deepEqual(byId.get(`logic-sorter-switch-${i}`),baseline.games.find(g=>g.id==='logic-sorter-switch').rounds[i-1]);
});
test('life bridge evidence is a concrete failed state, distinct from the successful crossing',()=>{
 const ids=['logic-condition-detective-4','logic-condition-detective-12','logic-fix-plan-4','logic-fix-plan-11','logic-priority-choice-3','logic-priority-choice-10'];
 for(const id of ids){const r=byId.get(id),l=logicLessonFor(r);assert.match(l.context.image.src,/short-plank-gap/);assert.equal(l.evidenceScene,true);assert.doesNotMatch(r.prompt,/\d.*格/);assert.ok(Object.values(l.choices).every(p=>!p.diagram&&!p.diagrams&&!p.badge));}
 for(const id of ['logic-condition-detective-12','logic-priority-choice-3','logic-priority-choice-10'])assert.match(logicLessonFor(byId.get(id)).resolution[0].image.src,/long-plank-crossing/);
 for(const id of ['logic-condition-detective-4','logic-fix-plan-4','logic-fix-plan-11'])assert.match(logicLessonFor(byId.get(id)).resolution[0].image.src,/short-plank-gap/);
});
test('concept judgments never repeat animals or written badges, while actual evidence choices keep their scene crops',()=>{
 let count=0;
 for(const d of logicEvidenceDefinitions){const r=byId.get(d.id),l=logicLessonFor(r);
  if(Object.keys(d.conceptChoices).length)count++;
  for(const value of Object.keys(d.conceptChoices)){assert.deepEqual(l.choices[value],{textOnly:true});assert.ok(r.choices.find(c=>c.value===value).label.length<=6);}
  for(const value of Object.keys(d.choiceImages))assert.ok(l.choices[value].image.src.includes('logic-046-evidence'));
 }
 assert.equal(count,8);
});
