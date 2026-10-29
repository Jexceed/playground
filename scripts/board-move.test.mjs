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
import {restoreBoardMovePresentation} from './lib/restore-reviewed-art.mjs';
const [catalog,exploration,session,domain,copyModule]=await Promise.all([
 loadTypeScriptModule('src/curriculum/catalog.ts'),loadTypeScriptModule('src/curriculum/exploration/index.ts'),
 loadTypeScriptModule('src/engine/activity-session.ts'),loadTypeScriptModule('src/domain/activity.ts'),loadTypeScriptModule('src/domain/board-move.ts')]);
const rounds=catalog.activitySets.flatMap(g=>g.rounds).filter(a=>a.primaryFamilyId==='L11');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const lineSets=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function captureCount(cells,index,n){let count=0;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){let x=index%n+dx,y=Math.floor(index/n)+dy,ray=0;while(x>=0&&x<n&&y>=0&&y<n&&cells[y*n+x]==='white'){ray++;x+=dx;y+=dy;}if(ray&&x>=0&&x<n&&y>=0&&y<n&&cells[y*n+x]==='black')count+=ray;}return count;}
const toggle=(a,s,id)=>session.transitionSession(a,s,{type:'toggle',tokenId:id});

test('nine exact board models preserve every original stone and candidate',()=>{
 assert.equal(rounds.length,9);
 for(const [i,a]of rounds.entries()){
  const m=a.presentation.evidence;assert.equal(m.kind,'boardMove');assert.equal(m.columns,i<6?3:4);assert.equal(m.goal,i<6?'line3':'capture');assert.equal(m.cells.length,m.columns*m.columns);
  const drawing=exploration.explorationDrawings[a.illustration.src.split('/').at(-1).replace('.png','')];
  const old=drawing.objects.filter(o=>o.kind==='text').map(o=>o.text==='●'?'black':o.text==='○'?'white':null);
  assert.deepEqual(m.cells,old,a.id);assert.deepEqual(m.candidates,a.tokens.map(t=>({cell:Number(t.id.slice(1)),tokenId:t.id})));
  assert.ok(m.candidates.every(c=>m.cells[c.cell]===null));assert.equal(a.revision,i<6?1:2);assert.equal(a.kind,'multiSelect');
  assert.deepEqual(Object.keys(m).sort(),['candidates','cells','columns','goal','kind']);
 }
});
test('line and capture answers are still the original independent one-stone moves',()=>{
 for(const a of rounds){const m=a.presentation.evidence;let valid;if(m.goal==='line3')valid=m.candidates.filter(c=>lineSets.some(line=>line.every(i=>i===c.cell||m.cells[i]==='black'))).map(c=>c.tokenId);else{const maximum=Math.max(...m.cells.flatMap((c,i)=>c===null?[captureCount(m.cells,i,m.columns)]:[]));valid=m.candidates.filter(c=>captureCount(m.cells,c.cell,m.columns)===maximum).map(c=>c.tokenId);}assert.deepEqual(valid,a.expectedTokenIds,a.id);assert.deepEqual(exploration.authoringSolutions[a.id],{kind:'multiSelect',tokenIds:a.expectedTokenIds});}
});
test('only the declared instruction and presentation change the full curriculum',()=>{
 assert.equal(restoreBoardMovePresentation(catalog.catalogGames).flatMap(g=>g.rounds).length,1110);
 assert.equal(hash(restoreBoardMovePresentation(catalog.catalogGames)),'ca4bf435c5e8ab141e5908e423af5ac8345789e206ee7e1f4658903dd7b26e88');
 const altered=structuredClone(catalog.catalogGames),a=altered.flatMap(g=>g.rounds).find(a=>a.primaryFamilyId==='L11');a.expectedTokenIds=['p8'];assert.equal(restoreBoardMovePresentation(altered).flatMap(g=>g.rounds).find(x=>x.id===a.id).expectedTokenIds[0],'p8');assert.notEqual(hash(restoreBoardMovePresentation(altered)),'ca4bf435c5e8ab141e5908e423af5ac8345789e206ee7e1f4658903dd7b26e88');
 a.presentation.evidence.cells[0]='white';assert.throws(()=>restoreBoardMovePresentation(altered),/exact reviewed 055/);
});
test('selection history, retry, clear and completion retain original evaluation',()=>{
 for(const a of rounds){let s=session.createSession(a);assert.deepEqual(s.response,{kind:'multiSelect',tokenIds:[]});assert.equal(s.attempts,0);
  const wrong=a.tokens.find(t=>!a.expectedTokenIds.includes(t.id));assert.ok(wrong);s=toggle(a,s,wrong.id);s=session.transitionSession(a,s,{type:'submit'});assert.equal(s.result.status,'incorrect');
  s=session.transitionSession(a,s,{type:'clear'});assert.deepEqual(s.response.tokenIds,[]);assert.equal(s.attempts,1);
  const first=toggle(a,s,a.expectedTokenIds[0]);const off=toggle(a,first,a.expectedTokenIds[0]);assert.deepEqual(off.response.tokenIds,[]);assert.deepEqual(session.transitionSession(a,off,{type:'undo'}).response,first.response);
  for(const id of a.expectedTokenIds)s=toggle(a,s,id);const completed=session.transitionSession(a,s,{type:'submit'});assert.equal(completed.result.status,'correct');assert.equal(completed.attempts,2);assert.deepEqual(toggle(a,completed,wrong.id),completed);
  for(const [i,piece]of a.presentation.evidence.cells.entries())if(piece)assert.deepEqual(toggle(a,session.createSession(a),'p'+i).response,{kind:'multiSelect',tokenIds:[]});
 }
});
test('local narration explains empty circles, one trial stone and independent selected positions',()=>{
 const lines=catalog.activityVoiceLines(catalog.activitySets),copy=copyModule.BOARD_MOVE_COPY;
 for(const a of rounds){assert.equal(a.instruction,copy.instruction);assert.equal(domain.activityPromptSpeech(a),[a.prompt,copy.howToPlay,...a.clues].join(''));assert.ok(lines.some(l=>l.kind==='prompt'&&l.text===domain.activityPromptSpeech(a)));assert.match(domain.activityPromptSpeech(a),/圈里是空格，没有棋子/);assert.match(domain.activityPromptSpeech(a),/每个选中的位置，都要单独试/);}
 for(const text of Object.values(copy))assert.ok(lines.some(l=>l.text===text));
});
let board;
async function loadBoard(){if(board)return board;const require=createRequire(import.meta.url),ids=['react','react/jsx-runtime','react/jsx-dev-runtime'];const result=await build({configFile:false,publicDir:false,logLevel:'silent',ssr:{noExternal:true,external:ids},build:{ssr:resolve('src/interactions/BoardMoveBoard.tsx'),write:false,minify:false,rollupOptions:{output:{format:'es',inlineDynamicImports:true,paths:Object.fromEntries(ids.map(id=>[id,pathToFileURL(require.resolve(id)).href]))}}}});return board=(await import('data:text/javascript;base64,'+Buffer.from(result.output.find(o=>o.type==='chunk').code).toString('base64'))).BoardMoveBoard;}
function surface(html){return html.split('data-testid="board-move-surface"')[1].split('<aside')[0];}
test('real initial board has no centre numbers, only original stones and empty trial targets',async()=>{
 const Board=await loadBoard();for(const a of rounds){const s=session.createSession(a),before=structuredClone(s.response);const html=renderToStaticMarkup(createElement(Board,{model:a.presentation.evidence,response:s.response,disabled:false,onToggle:()=>assert.fail('render must not select')})),grid=surface(html);
 assert.equal((grid.match(/data-stone-role="fixed"/g)||[]).length,a.presentation.evidence.cells.filter(Boolean).length);assert.equal((grid.match(/data-stone-role="trial"/g)||[]).length,0);assert.equal((grid.match(/data-testid="board-move-cell-/g)||[]).length,a.tokens.length);assert.equal(grid.replace(/<[^>]*>/g,'').replace(/^>/,'').trim(),'');assert.deepEqual(s.response,before);
 for(const c of a.presentation.evidence.candidates)assert.ok(grid.includes(`data-testid="board-move-cell-${c.cell}"`));assert.doesNotMatch(grid,/aria-pressed|aria-checked/,'trial targets are buttons, not answer toggles');assert.match(html,/<button[^>]*data-testid="board-move-select"[^>]*disabled=""/);
 }
});
test('multiple selected positions never become multiple added black pieces, including completed boards',async()=>{
 const Board=await loadBoard();for(const a of rounds){const ids=a.tokens.slice(0,3).map(t=>t.id),response={kind:'multiSelect',tokenIds:ids};for(const disabled of [false,true]){const html=renderToStaticMarkup(createElement(Board,{model:a.presentation.evidence,response,disabled,onToggle:()=>{}})),grid=surface(html);assert.equal((grid.match(/data-stone-role="fixed"/g)||[]).length,a.presentation.evidence.cells.filter(Boolean).length);assert.equal((grid.match(/data-stone-role="trial"/g)||[]).length,0);assert.equal((grid.match(/data-selected="true"/g)||[]).length,ids.length);if(disabled)for(const button of grid.match(/<button\b[^>]*>/g))assert.match(button,/disabled=""/);}}
});
