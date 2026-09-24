import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const { evaluateActivity, emptyResponse } = await loadTypeScriptModule('src/domain/activity-evaluation.ts');
const { createSession, transitionSession } = await loadTypeScriptModule('src/engine/activity-session.ts');
const { recordActivityEvent, mergeActivityProgress } = await loadTypeScriptModule('src/services/activity-progress.ts');
const { rectangleFromCorners, rectangleKey, rememberRectangle } = await loadTypeScriptModule('src/interactions/rectangle-state.ts');
const activities = explorationSets.flatMap(g => g.rounds);
const family = id => activities.filter(a => a.primaryFamilyId === id);
const drawing = image => explorationDrawings[image.src.split('/').at(-1).replace('.png', '')];
const bits = token => drawing(token.image).objects.filter(o => o.kind === 'rect').map(o => Number(o.fill !== '#fffdf7'));

test('money challenges have correct-total overstock decoys and preserve genuine valid payments', () => {
  for (const a of family('N13').filter(a => a.stage === 3)) {
    assert.equal(a.revision, 2);
    const stock = a.presentation?.evidence;
    assert.equal(stock?.kind, 'moneyInventory');
    const goal = Number(a.prompt.match(/付(\d+)元/)[1]);
    const options = a.tokens.map(t => {
      const values = drawing(t.image).objects.filter(o => o.kind === 'text').map(o => Number(o.text.replace('元', '')));
      assert.deepEqual(t.moneyValues, values, 'compact money display must preserve denominations');
      return { id:t.id, total:values.reduce((x,y)=>x+y,0), stock:values.filter(n=>n===5).length<=stock.fives && values.filter(n=>n===1).length<=stock.ones };
    });
    assert.ok(options.some(o=>o.total===goal&&!o.stock), a.id);
    const valid = options.filter(o=>o.total===goal&&o.stock).map(o=>o.id).sort();
    assert.ok(valid.length);
    assert.deepEqual([...a.expectedTokenIds].sort(), valid);
    assert.equal(evaluateActivity(a,{kind:'multiSelect',tokenIds:valid}).status,'correct');
  }
  assert.ok(family('N13').at(-1).expectedTokenIds.length > 1);
});

test('shortest-route tasks include a longer legal route and accept every equal optimum', () => {
  for (const a of family('L05').filter(a=>a.stage===2)) {
    const paths=[];
    function walk(node, edges, visited) {
      if(node===a.end&&a.requiredNodes.every(n=>visited.includes(n))&&a.requiredEdges.every(e=>edges.includes(e)))paths.push(edges);
      for(const e of a.graph.edges)if(!edges.includes(e.id)&&!a.blockedEdges.includes(e.id)&&(e.from===node||e.to===node)){
        const next=e.from===node?e.to:e.from;walk(next,[...edges,e.id],[...visited,next]);
      }
    }
    walk(a.start,[],[a.start]);
    const min=Math.min(...paths.map(p=>p.length)),best=paths.filter(p=>p.length===min);
    assert.ok(best.length>=2,a.id);
    assert.ok(paths.some(p=>p.length>min),a.id);
    for(const path of paths)assert.equal(evaluateActivity(a,{kind:'route',edgeIds:path}).status==='correct',path.length===min);
    assert.notEqual(evaluateActivity(a,{kind:'route',edgeIds:['e7','e2']}).status,'correct','short route that skips the required node');
    assert.notEqual(evaluateActivity(a,{kind:'route',edgeIds:['e0','e8']}).status,'correct','closed direct route');
    assert.notEqual(evaluateActivity(a,{kind:'route',edgeIds:['e0','e0','e7','e2']}).status,'correct','repeated road');
    assert.equal(a.revision,2);
  }
});

test('two-marker choices exercise both independent movement rules', () => {
  for(const a of family('G04').filter(a=>a.stage===3)){
    const positions=a.tokens.map(t=>drawing(t.image).objects.filter(o=>o.kind==='circle').map(o=>Math.round((o.x-62.5)/85)));
    const expected=positions[a.tokens.findIndex(t=>t.id===a.answerId)];
    assert.ok(positions.some(p=>p[0]===expected[0]&&p[1]!==expected[1]),a.id);
    assert.ok(positions.some(p=>p[0]!==expected[0]&&p[1]===expected[1]),a.id);
    assert.equal(a.revision,2);
  }
});

test('folded paper has an explicit retained region and holes unfold by independent coordinate reflection', () => {
  for(const a of family('G15').filter(a=>a.stage>1)){
    const fold=a.presentation?.folding;
    assert.ok(fold,a.id);
    assert.equal(a.revision,2);
    const expected=[];
    for(let row=0;row<4;row++)for(let col=0;col<4;col++){
      const foldedCol=col<2?3-col:col;
      const foldedRow=fold.folds.length===2&&row<2?3-row:row;
      if(foldedRow===fold.holeRow&&foldedCol===fold.holeColumn)expected.push([row,col]);
    }
    const correct=a.tokens.find(t=>t.id===a.answerId);
    const holes=drawing(correct.image).objects.filter(o=>o.kind==='circle').map(o=>[Math.round((o.y-50)/60),Math.round((o.x-50)/60)]).sort();
    assert.deepEqual(holes,expected.sort(),a.id);
    assert.equal(holes.length,2**fold.folds.length);
    const alternatives=a.tokens.map(t=>drawing(t.image).objects.filter(o=>o.kind==='circle'));
    assert.ok(alternatives.every(h=>h.length===holes.length),'hole count alone cannot identify the answer');
    assert.equal(new Set(alternatives.map(h=>JSON.stringify(h))).size,a.tokens.length,'all candidates must be distinct');
    assert.ok(drawing(a.illustration).objects.some(o=>o.kind==='polygon'),'fold arrows must be drawn');
  }
});

test('pyramid cells expose and independently verify each intermediate OR/XOR result', () => {
  for(const a of family('G07').filter(a=>a.stage>1)){
    assert.equal(a.kind,'gridPlacement',a.id);
    const p=a.presentation.pyramid;
    const token=id=>a.tokens.find(t=>t.id===id);
    let lower=p.baseTokenIds.map(id=>bits(token(id))),expected=[];
    while(lower.length>1){ lower=lower.slice(0,-1).map((b,i)=>b.map((x,k)=>x^lower[i+1][k]));expected.push(...lower); }
    assert.equal(a.cells.length,expected.length);
    const response=emptyResponse(a);
    expected.forEach((b,i)=>{const id=a.evaluation.cells[`cell-${i}`];assert.deepEqual(bits(token(id)),b,a.id);response.cells[`cell-${i}`]={state:'filled',tokenId:id};});
    assert.equal(evaluateActivity(a,response).status,'correct');
    for(let i=0;i<expected.length;i++){const bad=a.tokens.find(t=>p.choiceIds.includes(t.id)&&JSON.stringify(bits(t))!==JSON.stringify(expected[i]));const wrong=structuredClone(response);wrong.cells[`cell-${i}`]={state:'filled',tokenId:bad.id};assert.equal(evaluateActivity(a,wrong).status,'incorrect');}
    assert.equal(a.revision,2);
  }
});

test('partial pyramid checks are support events, never completed activities or transferred old mastery', () => {
  const a=family('G07').find(a=>a.stage===3);
  assert.equal(a.kind,'gridPlacement');
  let state=createSession(a);
  const firstRow=a.presentation.pyramid.rowSizes[0];
  for(let i=0;i<firstRow;i++)state=transitionSession(a,state,{type:'place',slotId:`cell-${i}`,tokenId:a.evaluation.cells[`cell-${i}`]});
  state=transitionSession(a,state,{type:'submit'});
  assert.equal(state.phase,'respond');assert.equal(state.result.status,'incomplete');assert.equal(state.checks,1);
  assert.equal(state.evidence.at(-1).kind,'check');
  const data=new Map(),store={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
  recordActivityEvent(a.id,1,{id:'old',kind:'attempt',correct:true},store,1);
  const current=recordActivityEvent(a.id,a.revision,{id:'check',kind:'check'},store,2).progress;
  assert.equal(current.entries[`${a.id}@1`].correctAttempts,1);
  assert.equal(current.entries[`${a.id}@2`].firstCompletedAt,null);
  assert.equal(current.entries[`${a.id}@2`].checks,1);
  assert.ok(!mergeActivityProgress({completedIds:[],completedRoundIds:[],abilityTags:[]},[{id:'test',rounds:[a]}],current).completedRoundIds.includes(a.id));
});

test('rectangle-count progression is 3, 6, 9 with a marking surface, not a sudden jump to 60', () => {
  const problems=family('G09').filter(a=>a.stage===3);
  assert.deepEqual(problems.map(a=>Number(a.tokens.find(t=>t.id===a.answerId).label)),[3,6,9]);
  for(const a of problems){const e=a.presentation?.evidence;assert.equal(e?.kind,'rectangleSearch');let count=0;for(let x=0;x<e.columns;x++)for(let xx=x+1;xx<=e.columns;xx++)for(let y=0;y<e.rows;y++)for(let yy=y+1;yy<=e.rows;yy++)count++;assert.equal(count,Number(a.tokens.find(t=>t.id===a.answerId).label));assert.equal(a.revision,2);}
});

test('rectangle marking rejects lines and outside points; corner order cannot double-count a shape', () => {
  assert.equal(rectangleFromCorners({row:0,column:0},{row:0,column:2},2,2),null);
  assert.equal(rectangleFromCorners({row:0,column:0},{row:2,column:0},2,2),null);
  assert.equal(rectangleFromCorners({row:-1,column:0},{row:2,column:2},2,2),null);
  assert.equal(rectangleFromCorners({row:0,column:0},{row:3,column:2},2,2),null);
  const a=rectangleFromCorners({row:0,column:0},{row:2,column:2},2,2);
  const b=rectangleFromCorners({row:2,column:0},{row:0,column:2},2,2);
  assert.deepEqual(a,{top:0,left:0,bottom:2,right:2});
  assert.equal(rectangleKey(a),rectangleKey(b));
  const found=rememberRectangle([],a);
  assert.equal(rememberRectangle(found,b),found);
  assert.equal(rememberRectangle(found,{top:0,left:0,bottom:1,right:1}).length,2,'a nested square is a different rectangle');
});

test('every family has explicit design-load provenance and no claim of child calibration', () => {
  for(const a of activities){assert.equal(a.difficulty.calibration,'design-estimate',a.id);assert.ok(a.difficulty.basis?.length>8,a.id);assert.ok(a.prerequisites.length>5);}
  assert.ok(new Set(activities.map(a=>a.difficulty.reading)).size>1);
  assert.ok(new Set(activities.map(a=>a.difficulty.motor)).size>1);
  assert.ok(activities.some(a=>a.difficulty.rules!==a.stage));
});
