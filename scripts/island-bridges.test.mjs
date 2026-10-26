import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {restoreIslandBridgeWording} from './lib/restore-reviewed-art.mjs';
const [catalog,exploration,session,evaluate,edit,view,domain]=await Promise.all([
 loadTypeScriptModule('src/curriculum/catalog.ts'),loadTypeScriptModule('src/curriculum/exploration/index.ts'),loadTypeScriptModule('src/engine/activity-session.ts'),
 loadTypeScriptModule('src/domain/activity-evaluation.ts'),loadTypeScriptModule('src/interactions/connection-state.ts'),loadTypeScriptModule('src/domain/island-bridges.ts'),loadTypeScriptModule('src/domain/activity.ts')]);
const networks=catalog.activitySets.flatMap(g=>g.rounds).filter(a=>a.kind==='network');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('only the reviewed wording changes; all 1110 questions retain original data and graphs',()=>{
 assert.equal(networks.length,9);assert.equal(hash(restoreIslandBridgeWording(catalog.catalogGames)),'d72323f7fd823abe3196d1700316f99b9e9305a77dc049cd89e83f4b15768d5f');
 const copy=structuredClone(catalog.catalogGames),a=copy.flatMap(g=>g.rounds).find(x=>x.kind==='network');a.graph.nodes[0].degree+=1;assert.notEqual(hash(restoreIslandBridgeWording(copy)),'d72323f7fd823abe3196d1700316f99b9e9305a77dc049cd89e83f4b15768d5f');
 a.instruction='unreviewed';assert.throws(()=>restoreIslandBridgeWording(copy),/exact reviewed 056/);
});
test('goal models account for every fixed, parallel, missing and extra bridge',()=>{
 for(const a of networks){const initial=session.createSession(a),answer=exploration.authoringSolutions[a.id],before=structuredClone(a.graph);
  for(const n of a.graph.nodes){const target=n.degree,base=a.graph.edges.filter(e=>e.from===n.id||e.to===n.id).reduce((s,e)=>s+(e.fixed??0),0);assert.equal(view.countIslandBridges(a.graph,initial.response.counts,n.id),base);assert.equal(view.countIslandBridges(a.graph,answer.counts,n.id),target);
   for(let current=0;current<=6;current++){const q=view.bridgeQuota(target,current);assert.equal(q.filled,Math.min(target,current));assert.equal(q.missing,Math.max(0,target-current));assert.equal(q.extra,Math.max(0,current-target));assert.equal(q.filled+q.missing,target);assert.equal(q.filled+q.extra,current);assert.equal(q.state,current>target?'over':current<target?'short':'exact');assert.equal(q.label,current>target?`多${current-target}座`:current<target?`还差${target-current}座`:'刚好');}}
  assert.deepEqual(a.graph,before);
 }
});
test('adding or removing a bridge updates both endpoints and no unrelated island',()=>{
 for(const a of networks)for(const edge of a.graph.edges){let response=session.createSession(a).response;for(let step=0;step<4;step++){const next=edit.cycleBridge(a,response,edge.id),delta=next.counts[edge.id]-response.counts[edge.id];for(const node of a.graph.nodes)assert.equal(view.countIslandBridges(a.graph,next.counts,node.id)-view.countIslandBridges(a.graph,response.counts,node.id),[edge.from,edge.to].includes(node.id)?delta:0);assert.ok(next.counts[edge.id]>=(edge.fixed??0));response=next;}}
});
test('excess bridges remain editable; undo, clear and correct submissions preserve the original engine',()=>{
 for(const a of networks){const initial=session.createSession(a);let s=initial;
  for(const edge of a.graph.edges)s=session.transitionSession(a,s,{type:'response',response:{kind:'network',counts:{...s.response.counts,[edge.id]:edge.max??2}}});
  assert.ok(a.graph.nodes.some(n=>view.bridgeQuota(n.degree,view.countIslandBridges(a.graph,s.response.counts,n.id)).extra>0));const before=s.response;s=session.transitionSession(a,s,{type:'submit'});assert.equal(s.result.status,'incorrect');assert.equal(s.result.message,view.ISLAND_BRIDGE_COPY.countsFeedback);assert.deepEqual(s.response,before);
  s=session.transitionSession(a,s,{type:'clear'});assert.deepEqual(s.response,initial.response);assert.deepEqual(session.transitionSession(a,s,{type:'undo'}).response,before);
  s=session.transitionSession(a,s,{type:'response',response:exploration.authoringSolutions[a.id]});s=session.transitionSession(a,s,{type:'submit'});assert.equal(s.result.status,'correct');assert.equal(s.phase,'complete');
  assert.deepEqual(session.transitionSession(a,s,{type:'response',response:initial.response}),s);
 }
});
test('all local quotas matching never bypasses global connectivity or crossing rules',()=>{
 const a=structuredClone(networks[0]);a.graph.nodes.forEach(n=>n.degree=2);const counts=Object.fromEntries(a.graph.edges.map((e,i)=>[e.id,i%2===0?2:0]));a.graph.edges.forEach(e=>e.fixed=0);
 assert.ok(a.graph.nodes.every(n=>view.bridgeQuota(n.degree,view.countIslandBridges(a.graph,counts,n.id)).state==='exact'));assert.equal(evaluate.evaluateActivity(a,{kind:'network',counts}).status,'incorrect');
 a.connected=false;a.graph.nodes.forEach(n=>n.degree=1);a.graph.edges=[{id:'a',from:'n0',to:'n2',max:2},{id:'b',from:'n1',to:'n3',max:2}];const result=evaluate.evaluateActivity(a,{kind:'network',counts:{a:1,b:1}});assert.equal(result.status,'incorrect');assert.match(result.message,/交叉/);
});
test('speech exports concrete per-island targets and the one-bridge-two-ends explanation',()=>{
 const lines=catalog.activityVoiceLines(catalog.activitySets);
 for(const a of networks){const speech=domain.activityPromptSpeech(a);assert.ok(speech.startsWith(view.ISLAND_BRIDGE_COPY.unit));for(const n of a.graph.nodes){const text=view.islandRequirementSpeech(n);assert.ok(speech.includes(text));assert.ok(lines.some(l=>l.text===text));}assert.ok(speech.includes(view.ISLAND_BRIDGE_COPY.clue));assert.ok(lines.some(l=>l.kind==='prompt'&&l.text===speech));assert.doesNotMatch(speech,/大数字|已连/);assert.equal(a.revision,1);}
 for(const text of Object.values(view.ISLAND_BRIDGE_COPY))assert.ok(lines.some(l=>l.text===text));
});
const modules=new Map();
async function component(path,name){if(modules.has(path))return modules.get(path);const require=createRequire(import.meta.url),ids=['react','react/jsx-runtime','react/jsx-dev-runtime'];const result=await build({configFile:false,publicDir:false,logLevel:'silent',ssr:{noExternal:true,external:ids},build:{ssr:resolve(path),write:false,minify:false,rollupOptions:{output:{format:'es',inlineDynamicImports:true,paths:Object.fromEntries(ids.map(id=>[id,pathToFileURL(require.resolve(id)).href]))}}}});const mod=(await import('data:text/javascript;base64,'+Buffer.from(result.output.find(o=>o.type==='chunk').code).toString('base64')))[name];modules.set(path,mod);return mod;}
test('the real quota visual shows exactly N target slots and separates overage',async()=>{
 const Goal=await component('src/interactions/IslandBridgeGoal.tsx','IslandBridgeGoal');
 for(const target of [2,3])for(let current=0;current<=6;current++){const html=renderToStaticMarkup(createElement(Goal,{id:'n0',target,current})),q=view.bridgeQuota(target,current);assert.equal((html.match(/data-bridge-slot="filled"/g)||[]).length,q.filled);assert.equal((html.match(/data-bridge-slot="empty"/g)||[]).length,q.missing);assert.equal((html.match(/data-bridge-slot="extra"/g)||[]).length,q.extra);assert.ok(html.includes(q.label));assert.match(html,/<span class="island-goal-total">要 <b>[23]<\/b> 座桥<\/span>/);assert.doesNotMatch(html,/已连/);}
});
test('network rendering uses quotas while route rendering keeps its own node and trail presentation',async()=>{
 const Board=await component('src/interactions/GraphInteraction.tsx','GraphInteraction');
 for(const a of networks){const response=session.createSession(a).response,html=renderToStaticMarkup(createElement(Board,{activity:a,response,disabled:false,onChange:()=>assert.fail('render cannot connect')}));assert.equal((html.match(/data-testid="island-goal-/g)||[]).length,a.graph.nodes.length);assert.doesNotMatch(html,/大数字是|<small>已连/);for(const n of a.graph.nodes)assert.ok(html.includes(`data-current="${view.countIslandBridges(a.graph,response.counts,n.id)}"`));}
 const routes=catalog.activitySets.flatMap(g=>g.rounds).filter(a=>a.kind==='route');assert.ok(routes.length);for(const a of routes){const html=renderToStaticMarkup(createElement(Board,{activity:a,response:session.createSession(a).response,disabled:false,onChange:()=>{}}));assert.match(html,/graph-you-are-here/);assert.match(html,/graph-route-trail/);assert.doesNotMatch(html,/island-bridge-lesson|island-bridge-goal/);}
});
