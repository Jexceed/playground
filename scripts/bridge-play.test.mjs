import {restoreReviewedArt,restoreRulePlayPresentation} from "./lib/restore-reviewed-art.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {loadGameData} from './lib/load-game-data.mjs';
import {restoreBridgeWording} from './lib/restore-bridge-wording.mjs';
const play=await loadTypeScriptModule('src/domain/bridge-play.ts');
const data=await loadGameData();
const model=n=>play.bridgeModelFor(`logic-space-bridge-${n}`);

test('the original eight rounds keep identities, answers, option order and all unrelated curriculum',()=>{
 const baseline=JSON.parse(readFileSync('specs/048-hands-on-bridge/verification/baseline.json'));
 assert.deepEqual(restoreBridgeWording(restoreRulePlayPresentation(restoreReviewedArt(data))),baseline);
 const changes=JSON.parse(readFileSync('specs/048-hands-on-bridge/content-changes.json'));
 assert.deepEqual(changes.map(c=>c.id),Array.from({length:8},(_,i)=>`logic-space-bridge-${i+1}`));
});
test('measuring accepts either bank order and rejects every other pair',()=>{
 const points=Object.keys(play.measurePointLabels);
 for(const a of points)for(const b of points){const result=play.measureBridgeAttempt([a,b]);assert.equal(result.valid,a!==b&&[a,b].every(p=>p.endsWith('-bank')),`${a}/${b}`);}
 assert.equal(play.measureBridgeAttempt(['left-bank']).ready,false);
 assert.deepEqual(play.chooseMeasurePoint(['left-bank'],'left-bank'),[]);
 assert.deepEqual(play.chooseMeasurePoint(['bear','plank'],'right-bank'),['right-bank']);
});
test('each round accepts all and only its geometrically valid physical assignments',()=>{
 const expected={2:[[0,1],[1,0]],3:[[0,1]],4:[[0]],5:[[0,1],[1,0]],6:[[0,1]],7:[[0]],8:[[1,0]]};
 for(let n=2;n<=8;n++){
  const m=model(n),valid=[];
  for(const a of [null,0,1,2])for(const b of (m.supports.length?[null,0,1,2]:[null])){
   const slots=m.supports.length?[a,b]:[a],result=play.bridgePlacementAttempt(m,slots);
   if(result.valid){
    valid.push(slots);
    if(slots.length===2){
      const left=play.placedBridgeShape(m,0,slots[0]),right=play.placedBridgeShape(m,1,slots[1]);
      assert.equal(left.x+left.width,right.x,`round ${n}: both boards' grids remain visible at the island`);
    }
   }
  }
  assert.deepEqual(valid,expected[n],`round ${n}`);
 }
});
test('identical length boards are distinct; moving and replacing return physical pieces',()=>{
 const m=model(2),initial=play.emptyBridge(m);
 assert.notEqual(play.bridgeMaterialLabel(m,0),play.bridgeMaterialLabel(m,1));
 const first=play.placeBridgeWood(m,initial,0,0);
 const moved=play.placeBridgeWood(m,first,1,0);
 assert.deepEqual(initial,[null,null]);assert.deepEqual(first,[0,null]);assert.deepEqual(moved,[null,0]);
 assert.deepEqual(play.placeBridgeWood(m,[0,2],1,1),[0,1]);
 assert.equal(play.bridgePlacementAttempt(m,[0,0]).valid,false);
 assert.deepEqual(play.placeBridgeWood(m,first,9,0),first);
 assert.equal(play.bridgePlacementAttempt(m,[-1,0]).valid,false);
});
test('failure distinguishes empty gaps and exact remaining shortfall',()=>{
 assert.equal(play.bridgePlacementAttempt(model(2),[null,null]).ready,false);
 assert.match(play.bridgePlacementAttempt(model(2),[0,null]).feedback,/右边还没有桥/);
 assert.match(play.bridgePlacementAttempt(model(2),[0,2]).feedback,/右边还差 1 格/);
 assert.match(play.bridgePlacementAttempt(model(8),[0,1]).feedback,/右边还差 1 格/);
 assert.match(play.bridgePlacementAttempt(model(4),[2]).feedback,/还差 2 格/);
});
test('wood and water use one unit and short pieces keep the visible gap',()=>{
 for(let n=2;n<=8;n++){
  const m=model(n),layout=play.bridgePlayLayout(m);
  assert.equal(layout.right-layout.left,m.width*play.BRIDGE_PLAY_UNIT);
  layout.gaps.forEach((gap,slot)=>m.lengths.forEach((length,index)=>{
   const shape=play.placedBridgeShape(m,slot,index);
   assert.equal(shape.width,length*play.BRIDGE_PLAY_UNIT);
   assert.ok(shape.x>=14&&shape.x+shape.width<=play.BRIDGE_STAGE_WIDTH-14,'the entire board stays visible even for oversized trials');
   if(length<gap.width)assert.ok(shape.x+shape.width<gap.x+gap.pixels);
   else assert.ok(shape.x<=gap.x&&shape.x+shape.width>=gap.x+gap.pixels);
  }));
 }
});
test('all spoken interaction feedback and material names have local voice lines',()=>{
 const lines=new Set(JSON.parse(readFileSync('public/audio/voice-lines.json')).lines.map(l=>l.text));
 for(const line of play.bridgePlayVoiceLines())assert.ok(lines.has(line),line);
});
