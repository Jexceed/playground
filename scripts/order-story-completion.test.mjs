import {restoreChildReadableWording} from "./lib/restore-reviewed-wording.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const baseline=JSON.parse(readFileSync('specs/045-order-story-completion/verification/baseline.json'));
const current=restoreChildReadableWording(await loadGameData());
const {orderStorySteps,orderStoryImage}=await loadTypeScriptModule('src/data/orderStories.ts');
const {imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');
const rounds=current.games.find(g=>g.id==='logic-order-plan').rounds;
const omit=(obj,keys)=>Object.fromEntries(Object.entries(obj).filter(([key])=>!keys.includes(key)));

test('045 changes only the remaining story surfaces; all 1110 identities, answers and unrelated content survive',()=>{
  assert.equal(rounds.length,24);
  assert.deepEqual(current.activitySets,baseline.activitySets);
  for(const [i,game] of current.games.entries()){
    const before=baseline.games[i];
    assert.deepEqual(omit(game,['rounds']),omit(before,['rounds']));
    for(const [j,round] of game.rounds.entries()){
      const allowed=game.id==='logic-order-plan'&&!['logic-order-plan-1','logic-order-plan-9','logic-order-plan-18'].includes(round.id)?['instruction','sceneImage','sequenceStory']:[];
      assert.deepEqual(omit(round,allowed),omit(before.rounds[j],allowed),round.id);
    }
  }
});

test('every initial story is a registered 1200x675 PNG, never a generic old backdrop',async()=>{
  const paths=new Set();
  for(const round of rounds){
    assert.ok(round.sequenceStory,round.id);
    assert.ok(Object.values(imageGallery.scenes).some(scene=>scene.src===round.sceneImage.src),round.id);
    assert.match(round.sceneImage.src,/drinking-|order-045-/);
    paths.add(round.sceneImage.src);
  }
  for(const path of paths){const m=await sharp('public'+path).metadata();assert.deepEqual([m.width,m.height,m.format],[1200,675,'png'],path);}
});

test('all 24 questions keep one unknown until correct, then fill the exact position without changing order',()=>{
  for(const round of rounds){
    const before=orderStorySteps(round,false),after=orderStorySteps(round,true);
    const blank=round.sequence.indexOf('?');
    assert.equal(before.filter(s=>s.missing).length,1,round.id);
    assert.equal(before[blank].image,undefined);
    assert.equal(after.length,round.sequence.length);
    assert.equal(after.filter(s=>s.filled).length,1);
    assert.ok(after.every(s=>s.image&&!s.missing),round.id);
    assert.equal(after[blank].label,round.choices.find(c=>c.value===round.answer).label);
    before.forEach((step,i)=>{if(i!==blank) assert.deepEqual(step,after[i],round.id);});
  }
});

test('all steps and all options have distinct semantic local art; no correct-only picture cue',async()=>{
  const paths=new Set();
  for(const round of rounds){
    const images=round.choices.map(c=>orderStoryImage(round,c.label));
    assert.ok(images.every(Boolean),round.id);
    assert.equal(new Set(images.map(image=>image.src)).size,3,round.id);
    for(const image of [...images,...orderStorySteps(round,true).map(s=>s.image)]){
      assert.ok(Object.values(imageGallery.items).some(item=>item.src===image.src),`${round.id}: registration`);
      assert.ok(image.alt.length>4,round.id);
      paths.add(image.src);
    }
  }
  assert.deepEqual([...paths].filter(path=>path.includes('order-045-')).sort(),Object.values(imageGallery.items).filter(image=>image.src.includes('order-045-')).map(image=>image.src).sort(),'every registered new action has an actual task use');
  for(const path of paths){const m=await sharp('public'+path).metadata();assert.deepEqual([m.width,m.height,m.format],[600,600,'png'],path);}
});

test('meaning conflicts resolve by question and stage, including dirty hands and already-sorted toys',()=>{
  const r=n=>rounds[n-1],path=(n,label)=>orderStoryImage(r(n),label).src;
  assert.match(path(8,'走过去'),/traffic-cross/);
  assert.match(path(11,'走过去'),/bridge-cross/);
  assert.match(path(5,'拿饼干'),/snack-take/);
  assert.match(path(5,'先拿饼干'),/snack-dirtyTake/);
  assert.match(path(10,'拿盘子'),/snack-plate/);
  assert.match(path(10,'先拿盘子'),/snack-dirtyPlate/);
  assert.match(path(12,'放进盒子'),/blocks-put/);
  assert.match(path(12,'先放进盒子'),/blocks-mixedBox/);
  assert.match(path(24,'分好的两类玩具'),/sorting-sorted/);
  assert.notEqual(path(4,'直接等开花'),path(23,'直接等开花'));
  assert.match(r(4).sceneImage.src,/plant-soil/);
  assert.match(r(23).sceneImage.src,/plant-dry/);
  assert.match(path(23,'🌱'),/plant-drySprout/);
  assert.match(r(7).sceneImage.src,/sorting-mixed/);
  assert.match(r(24).sceneImage.src,/sorting-sorted/);
});

test('requested gpt-6.1-sol artwork manifests cover every brief scene and card',()=>{
  const brief=JSON.parse(readFileSync('specs/045-order-story-completion/asset-brief.json'));
  const manifest={};
  for(const owner of ['nature','daily','plans']){
    const data=JSON.parse(readFileSync(`specs/045-order-story-completion/art-${owner}.json`));
    assert.equal(data.model,'gpt-6.1-sol');Object.assign(manifest,data.families);
  }
  for(const family of brief.families){
    for(const type of ['scenes','cards'])assert.deepEqual(Object.keys(manifest[family.id][type]).sort(),Object.keys(family[type]).sort(),`${family.id}/${type}`);
  }
});
