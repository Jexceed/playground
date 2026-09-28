import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const [{games,activitySets},state,{enlightenmentBridgeModels}] = await Promise.all([
  loadGameData(),loadTypeScriptModule('src/domain/enlightenment.ts'),loadTypeScriptModule('src/data/enlightenmentBridges.ts'),
]);
const baseline=JSON.parse(readFileSync('specs/040-enlightenment-quality/verification/baseline.json','utf8'));
const group=id=>games.find(game=>game.id===id);
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('all stable enlightenment identities and exploration content are preserved',()=>{
  assert.deepEqual(games.map(g=>[g.id,g.rounds.map(r=>r.id)]),baseline.groups.map(g=>[g.id,g.rounds.map(r=>r.id)]));
  assert.equal(hash(activitySets),baseline.explorationHash);
});

test('answer positions stay balanced without long runs or a repeating group-wide cycle',()=>{
  for(const game of games) for(const size of new Set(game.rounds.map(r=>r.choices.length))){
    const rounds=game.rounds.filter(r=>r.choices.length===size);
    const positions=rounds.map(r=>r.choices.findIndex(c=>c.value===r.answer));
    const counts=Array.from({length:size},(_,i)=>positions.filter(x=>x===i).length);
    assert.ok(Math.max(...counts)-Math.min(...counts)<=1,game.id);
    assert.ok(!positions.some((p,i)=>i>1&&p===positions[i-1]&&p===positions[i-2]),game.id);
    if(positions.length>=size*2)assert.ok(!positions.every((p,i)=>i<size||p===positions[i-size]),game.id);
  }
  assert.deepEqual(state.answerPositionSchedule(15,3,'stable'),state.answerPositionSchedule(15,3,'stable'));
  assert.notDeepEqual(state.answerPositionSchedule(15,3,'one'),state.answerPositionSchedule(15,3,'two'));
});

test('reordering preserves each drawn option, semantic answer and display letter',()=>{
  for(const game of games.filter(g=>g.world==='graphic'))for(const round of game.rounds){
    const original=baseline.groups.find(g=>g.id===game.id).rounds.find(r=>r.id===round.id);
    for(const [i,choice] of round.choices.entries()){
      const option=round.graphicChallenge.options[i];
      assert.equal(option.value,choice.value,round.id);
      assert.equal(choice.label,'ABCD'[i],round.id);
      if(game.id==='graphic-gap-close'){
        assert.equal(option.figure.mode,'outline');
        assert.equal(option.figure.shape,option.value);
      }else if(game.id!=='graphic-layer-overlap'){
        assert.equal(hash(option.figures??option.figure),original.figures[choice.value],round.id);
      }
    }
    assert.equal(round.answer,original.answer);
  }
});

test('quantity pictures independently agree with addition, subtraction, sharing and grouping',()=>{
  for(const r of group('math-compose-decompose').rounds){assert.equal(r.sceneImage,undefined);assert.equal(+r.answer,r.visualGroups.reduce((s,g)=>s+g.items.length,0),r.id);}
  for(const r of group('math-story-operations').rounds){assert.equal(r.sceneImage,undefined);assert.equal(+r.answer,r.visualGroups[0].items.length-r.visualGroups[1].items.length,r.id);}
  for(const r of group('math-fair-share').rounds){assert.equal(r.sceneImage,undefined);const [items,people]=r.visualGroups.map(g=>g.items.length);assert.equal(+r.answer,Math.floor(items/people),r.id);if(items%people)assert.match(r.instruction,/不切开/);}
  for(const r of group('math-group-counting').rounds)assert.equal(+r.answer,r.visualGroups.reduce((s,g)=>s+g.items.length,0),r.id);
  for(const r of group('math-subitize-match').rounds)assert.equal(+r.answer,r.visualGroups[0].items.filter(Boolean).length,r.id);
});

test('a timed observation cannot silently start on navigation and interruption reopens readiness',()=>{
  const timed=group('math-subitize-match').rounds.filter(r=>r.observation);
  assert.equal(timed.length,5);
  for(const r of timed){assert.equal(state.initialObservationPhase(r),'ready');assert.equal(r.observation.durationMs,2000);}
  let phase=state.initialObservationPhase(timed[0]);
  assert.equal(state.observationTransition(phase,'hide',true),'ready');
  phase=state.observationTransition(phase,'start',true);
  assert.equal(phase,'observing');
  assert.equal(state.observationTransition(phase,'interrupt',true),'ready');
  phase=state.observationTransition(phase,'hide',true);
  assert.equal(phase,'answering');
  assert.equal(state.observationTransition(phase,'review',true),'ready');
  assert.equal(state.initialObservationPhase(group('logic-memory-camera').rounds[0]),'observing');
  assert.equal(state.observationTransition('answering','review',false),'observing');
});

test('jumping to the last round does not invent earlier completion or ability evidence',()=>{
  const game=group('math-subitize-match'),last=game.rounds.at(-1);
  assert.deepEqual(state.completedGameRounds(game,new Set()),[]);
  assert.deepEqual(state.completedGameRounds(game,new Set([last.id,'unknown-old-id'])),[last]);
  assert.equal(state.completedGameRounds(game,new Set(game.rounds.map(r=>r.id))).length,15);
});

test('memory options have exactly one answer supported by the visible sequence',()=>{
  for(const r of group('logic-memory-camera').rounds){
    const names={'🍎':'苹果','🍊':'橘子','🍓':'草莓','🐱':'小猫','🐶':'小狗','🐰':'小兔'};
    const items=r.memory.items.map(value=>names[value]??value);
    const isAbsent=/没有出现/.test(r.prompt);
    if(/第|最后/.test(r.prompt)){
      const index=/第一/.test(r.prompt)?0:/第二/.test(r.prompt)?1:/第三/.test(r.prompt)?2:items.length-1;
      assert.equal(r.answer,items[index],r.id);
    }else{
      const supported=r.choices.filter(c=>isAbsent?!items.includes(c.value):items.includes(c.value));
      assert.deepEqual(supported.map(c=>c.value),[r.answer],r.id);
    }
  }
});

test('missing and extra picture cards match independent multiset differences',()=>{
  for(const r of group('logic-part-whole-puzzle').rounds){
    const [whole,parts]=r.visualGroups.map(g=>g.items);
    const missing=/少/.test(r.prompt),big=missing?whole:parts,small=missing?parts:whole;
    const rest=[...big];for(const token of small){const i=rest.indexOf(token);assert.notEqual(i,-1,r.id);rest.splice(i,1);}
    assert.deepEqual(rest,[r.answer],r.id);
  }
});

test('corrected number pairs have a visible repeated rule and no nonexistent color cue',()=>{
  const round=group('logic-number-pattern-trail').rounds[7];
  const values=round.sequence.map(x=>x==='?'?round.answer:x);
  for(let i=0;i<values.length;i+=2){assert.equal(values[i],values[i+1]);if(i)assert.equal(+values[i],+values[i-2]+1);}
  assert.doesNotMatch(round.success,/颜色/);
});

test('bridge plans span every supported gap, not only enough total wood',()=>{
  const plans=[null,[[0,1],[0],[2]],[[0,1],[1,2],[0]],[[0],[1],[2]],[[0,1],[0],[1]],[[0,1],[1,2],[0]],[[0],[1],[2]],[[1,0],[0],[0,1]]];
  const expected=['river-width','two-planks','long-short','long','two-planks','long-short','long','two-planks'];
  for(const [i,model]of enlightenmentBridgeModels.entries()){
    const r=group('logic-space-bridge').rounds[i];assert.equal(r.answer,expected[i]);
    if(!i)continue;
    const stops=[0,...model.supports,model.width],gaps=stops.slice(1).map((v,k)=>v-stops[k]);
    const fits=plan=>plan.length===gaps.length&&plan.every((piece,k)=>model.lengths[piece]>=gaps[k]);
    assert.deepEqual(plans[i].map(fits),[true,false,false],r.id);
  }
});

test('story corrections specify needs and do not confuse game rules with crossing a road',()=>{
  for(const r of group('logic-stop-think').rounds){assert.match(r.prompt,/桌面色卡游戏/);assert.doesNotMatch(JSON.stringify(r),/红灯|绿灯|过马路/);}
  assert.match(group('logic-rule-filter').rounds[12].prompt,/已经口渴/);
  assert.match(group('logic-rule-filter').rounds[1].prompt,/放铅笔/);
  for(const r of group('math-clock-time').rounds.filter(r=>r.clockChallenge.mode==='time-conversion')){
    assert.ok(r.instruction.includes(r.clockChallenge.activity),r.id);
    assert.doesNotMatch(r.retry,/不要只选/);
  }
  assert.match(group('graphic-layer-overlap').title,/纸片/);
});


test('layer cards expose the exact aligned positions and their opaque stacking order',()=>{
  for(const r of group('graphic-layer-overlap').rounds){
    const challenge=r.graphicChallenge;
    const answer=challenge.options.find(o=>o.value===r.answer).figures;
    assert.deepEqual(answer,challenge.figures,r.id);
    assert.ok(answer.every(f=>f.opacity===1),r.id);
    assert.match(r.instruction,/对齐小方框/);
    const variants=challenge.options.map(o=>JSON.stringify(o.figures));
    assert.equal(new Set(variants).size,4,r.id);
    assert.ok(challenge.options.some(o=>JSON.stringify(o.figures)===JSON.stringify([...answer].reverse())),r.id);
  }
});

test('code-table queries are not always the first example and maps independently determine the answer',()=>{
  const positions=[];
  for(const r of group('graphic-code-machine').rounds){
    const c=r.graphicChallenge,query=c.figures[0].shape;
    const index=c.groups.findIndex(g=>g.figures[0].shape===query);positions.push(index);
    assert.equal(c.groups[index].figures[1].shape,r.answer,r.id);
    assert.equal(new Set(c.groups.map(g=>g.figures[0].shape)).size,c.groups.length,r.id);
    for(const g of c.groups)assert.ok(g.figures[0].x<g.figures[1].x);
  }
  assert.ok(new Set(positions).size>=3);
});

test('counting evidence is not always the middle group and numeric distractors stay nearby',()=>{
  const positions=[];
  for(const r of group('math-counting-cardinality').rounds){
    if(r.visualGroups.length===1)assert.equal(+r.answer,r.visualGroups[0].items.length,r.id);
    else {
      const n=+r.prompt.match(/正好有 (\d+)/)[1];
      const matches=r.visualGroups.filter(g=>g.items.length===n);
      assert.equal(matches.length,1);assert.equal(matches[0].label,r.answer,r.id);positions.push(r.answer);
    }
  }
  assert.equal(new Set(positions).size,3);
  assert.deepEqual(group('math-counting-cardinality').rounds[9].choices.map(c=>+c.value).sort((a,b)=>a-b),[8,9,10]);
  for(const r of group('math-compare-equalize').rounds){
    const [left,right]=r.visualGroups.map(g=>g.items.length);
    const expected=r.prompt.includes('更多')?(left===right?'same':left>right?'left':'right'):(left===right?'same':`add-${left<right?'left':'right'}-${Math.abs(left-right)}`);
    assert.equal(r.answer,expected,r.id);
  }
});
