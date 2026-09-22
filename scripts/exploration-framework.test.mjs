import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {activitySolutions} from './lib/activity-solutions.mjs';
const [{explorationSets,authoringSolutions},evalApi,session,storeApi,graphics]=await Promise.all([
 loadTypeScriptModule('src/curriculum/exploration/index.ts'),loadTypeScriptModule('src/domain/activity-evaluation.ts'),loadTypeScriptModule('src/engine/activity-session.ts'),loadTypeScriptModule('src/services/activity-progress.ts'),loadTypeScriptModule('src/curriculum/exploration/graphic.ts')
]);
const all=explorationSets.flatMap(g=>g.rounds),base={id:'test',protocol:{kind:'practice'},tokens:[],retry:'wrong',success:'correct'};
const run=evalApi.evaluateActivity;
test('all 71 adopted families have their required stage/variant counts and accepted authored answers',()=>{
 assert.equal(explorationSets.length,71);assert.equal(all.length,597);
 for(const group of explorationSets){assert.ok([3,9].includes(group.rounds.length));if(group.rounds.length===9)assert.deepEqual([1,2,3].map(s=>group.rounds.filter(a=>a.stage===s).length),[3,3,3]);for(const a of group.rounds)assert.equal(run(a,authoringSolutions[a.id]).status,a.kind==='parentObservation'?'needsParentObservation':'correct',a.id);}
});
test('independent graph search and exact cover alternatives satisfy every route, bridge and construction activity',()=>{
 for(const a of all.filter(a=>['route','network','construction'].includes(a.kind))){const solutions=activitySolutions(a);assert.ok(solutions.length,a.id);for(const r of solutions)assert.equal(run(a,r).status,'correct',a.id);}
});
test('bridge degree counts cannot substitute for global connectivity or crossing constraints',()=>{
 const nodes=[{id:'a',x:0,y:0,degree:2},{id:'b',x:2,y:0,degree:2},{id:'c',x:0,y:2,degree:2},{id:'d',x:2,y:2,degree:2}];
 const a={...base,kind:'network',connected:true,graph:{nodes,edges:[{id:'ab',from:'a',to:'b'},{id:'cd',from:'c',to:'d'},{id:'ac',from:'a',to:'c'},{id:'bd',from:'b',to:'d'}]}};
 assert.equal(run(a,{kind:'network',counts:{ab:2,cd:2,ac:0,bd:0}}).status,'incorrect');
 assert.equal(run(a,{kind:'network',counts:{ab:1,cd:1,ac:1,bd:1}}).status,'correct');
 assert.equal(run(a,{kind:'network',counts:{ab:3,cd:1,ac:0,bd:0}}).status,'incorrect');
 const cross={...a,connected:false,graph:{nodes:nodes.map(n=>({...n,degree:1})),edges:[{id:'ad',from:'a',to:'d'},{id:'bc',from:'b',to:'c'}]}};
 assert.equal(run(cross,{kind:'network',counts:{ad:1,bc:1}}).status,'incorrect');
});
test('routes distinguish parallel edges, reject disconnected jumps and separate legal from shortest',()=>{
 const a={...base,kind:'route',start:'a',end:'b',requiredNodes:[],requiredEdges:['straight','curve','ab2'],blockedEdges:[],allowRevisit:false,graph:{nodes:[],edges:[{id:'straight',from:'a',to:'b'},{id:'curve',from:'a',to:'b'},{id:'ab2',from:'a',to:'b'}]}};
 assert.equal(run(a,{kind:'route',edgeIds:['curve','straight','ab2']}).status,'correct');
 assert.equal(run(a,{kind:'route',edgeIds:['straight','straight','ab2']}).status,'incorrect');
 const shortest={...a,requiredEdges:[],optimalLength:1};
 assert.equal(run(shortest,{kind:'route',edgeIds:['curve','straight','ab2']}).status,'incorrect');
 assert.equal(run(shortest,{kind:'route',edgeIds:['curve']}).status,'correct');
});
test('construction accepts rotated tilings and rejects overlap, wrong inventory and out-of-bounds placement',()=>{
 const a={...base,kind:'construction',columns:2,rows:2,layers:1,pieces:[{id:'a',cells:[[0,0,0],[1,0,0]]},{id:'b',cells:[[0,0,0],[1,0,0]]}],target:[[0,0,0],[1,0,0],[0,1,0],[1,1,0]],allowRotate:true};
 const vertical=[{pieceId:'a',x:0,y:0,z:0,rotation:1},{pieceId:'b',x:1,y:0,z:0,rotation:1}];
 assert.equal(run(a,{kind:'construction',placements:vertical}).status,'correct');
 assert.equal(run(a,{kind:'construction',placements:vertical.map(p=>({...p,x:0}))}).status,'incorrect');
 assert.equal(run(a,{kind:'construction',placements:vertical.map(p=>({...p,z:1}))}).status,'incorrect');
 assert.equal(run(a,{kind:'construction',placements:vertical.slice(0,1)}).status,'incomplete');
});
test('parent observations record participation and support without inventing a correct attempt',()=>{
 const a=all.find(a=>a.kind==='parentObservation'),response={kind:'parentObservation',observations:Object.fromEntries(a.observations.map(o=>[o.id,'notYet']))};
 let state=session.createSession(a);state=session.transitionSession(a,state,{type:'response',response});state=session.transitionSession(a,state,{type:'submit'});
 assert.equal(state.phase,'complete');assert.equal(state.attempts,0);assert.equal(state.evidence[0].kind,'observation');
 const storage={data:new Map(),getItem(k){return this.data.get(k)??null},setItem(k,v){this.data.set(k,v)}};
 storeApi.recordActivityEvent(a.id,1,{id:'parent-1',...state.evidence[0]},storage,100);
 const saved=storeApi.readActivityProgress(storage).progress;
 assert.equal(saved.entries[a.id+'@1'].correctAttempts,0);assert.equal(saved.entries[a.id+'@1'].observedAt,100);
 assert.ok(storeApi.mergeActivityProgress({completedIds:[],completedRoundIds:[],abilityTags:[]},[{id:'parent-group',rounds:[a]}],saved).completedRoundIds.includes(a.id));
});
test('finite inventory prevents overdrawing, but allows replacement and undo without consuming attempts',()=>{
 const a={...base,kind:'orderedPlacement',slotCount:3,tokens:[{id:'a'},{id:'b'}],tokenUse:{kind:'counted',limits:{a:2,b:1}},evaluation:{kind:'sequence',tokenIds:['a','a','b']}};
 let state=session.createSession(a);
 for(const slotId of ['slot-0','slot-1','slot-2'])state=session.transitionSession(a,state,{type:'place',slotId,tokenId:'a'});
 assert.equal(state.response.slots[2].state,'unfilled');assert.equal(state.attempts,0);
 state=session.transitionSession(a,state,{type:'place',slotId:'slot-2',tokenId:'b'});
 assert.equal(run(a,state.response).status,'correct');
 state=session.transitionSession(a,state,{type:'undo'});assert.equal(state.response.slots[2].state,'unfilled');
 assert.equal(run(a,{kind:'orderedPlacement',slots:Array(3).fill({state:'filled',tokenId:'a'})}).status,'incorrect');
});
test('learn-then-transfer keeps responding disabled until the example has been acknowledged',()=>{
 const a=all.find(a=>a.protocol.kind==='learnThenTransfer');assert.ok(a);
 let state=session.createSession(a);assert.equal(state.phase,'ready');
 assert.equal(session.transitionSession(a,state,{type:'submit'}).attempts,0);
 state=session.transitionSession(a,state,{type:'start'});assert.equal(state.phase,'respond');
});
test('cube-net orientation produces six distinct faces and reciprocal opposite pairs',()=>{
 const net=[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]],normals=graphics.cubeNormals(net);
 assert.equal(new Set(normals.map(n=>n.join(','))).size,6);
 // In this cross net, left/right and the faces immediately above/below the centre oppose.
 assert.deepEqual(normals[1].map(n=>-n),normals[3].map(n=>n===0?0:n));
 for(const normal of normals)assert.equal(normals.filter(n=>n.every((x,k)=>x===-normal[k])).length,1);
});
test('diagram identity is stable across insignificant floating-point differences between engines',async()=>{
 const {registerExplorationImage}=await loadTypeScriptModule('src/data/explorationImages.ts');
 const a={width:320,height:320,objects:[{kind:'circle',x:159.99999999999997,y:70.123456789,r:20,fill:'#fff'}]};
 const b={...a,objects:[{...a.objects[0],x:160,y:70.12345678899999}]};
 assert.equal(registerExplorationImage(a,'one').src,registerExplorationImage(b,'two').src);
});
