import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { restoreMathConsistency } from './lib/restore-reviewed-art.mjs';

const require = createRequire(import.meta.url);
const reactIds = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'];
const result = await build({ configFile: false, publicDir: false, logLevel: 'silent',
  ssr: { noExternal: true, external: reactIds },
  build: { ssr: resolve('src/interactions/ActivityEvidence.tsx'), write: false,
    rollupOptions: { output: { format: 'es', inlineDynamicImports: true,
      paths: Object.fromEntries(reactIds.map(id => [id, pathToFileURL(require.resolve(id)).href])) } } } });
const { ActivityEvidence } = await import('data:text/javascript;base64,' + Buffer.from(result.output.find(o => o.type === 'chunk').code).toString('base64'));
const [{ explorationSets, authoringNotes }, { activityImageSources }, { imageGallery }, { queueCountingModel }, { activityVoiceLines }] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/domain/activity-assets.ts'),
  loadTypeScriptModule('src/data/imageGallery.ts'),
  loadTypeScriptModule('src/domain/queue-counting.ts'),
  loadTypeScriptModule('src/curriculum/activity-voice-lines.ts'),
]);
const rounds = explorationSets.find(g => g.id === 'explore-ordinal-queue').rounds;
const before = JSON.parse(readFileSync('specs/063-queue-evidence-alignment/verification/math-before.json')).groups.find(g => g.id === 'explore-ordinal-queue').rounds;
const renderAll = activity => renderToStaticMarkup(createElement(ActivityEvidence, { activity, phase: 'respond' }));
const render = activity => renderAll(activity).split('<dialog')[0];
const visible = html => html.replace(/<[^>]*>/g, '');

test('position plus friends behind keeps the actual given conditions in the picture and explanation', () => {
  for (const a of rounds.filter(a => a.stage === 1)) {
    const [, left, behind] = a.prompt.match(/从左数第(\d+)，后面还有(\d+)位/);
    const html = render(a), text = visible(html);
    assert.match(text, new RegExp(`从左数到小兔：${left}位`), a.id);
    assert.match(text, new RegExp(`小兔后面还有：${behind}位`), a.id);
    assert.doesNotMatch(text, /从右|两边都数到|这一组里也有小兔/);
    assert.match(html, /class="queue-counting-evidence"/);
    assert.doesNotMatch(html, /queue-overlap-evidence/);
    assert.deepEqual(authoringNotes[a.id].oracle, { operation: 'add', values: [+left, +behind], answer: +left + +behind });
    assert.match(a.success, new RegExp(`${left}加${behind}是${+left + +behind}`));
    assert.doesNotMatch([a.success, a.retry, ...a.hints, a.parentPrompt].join(''), /从右|两边都数到|重复|减一/);
  }
});

test('two-sided positions and two inclusive groups retain one shared rabbit and the stated counts', () => {
  for (const a of rounds.filter(a => a.stage > 1)) {
    const [, left, right] = a.stage === 2
      ? a.prompt.match(/从左数第(\d+)，从右数第(\d+)/)
      : a.prompt.match(/左边这组含小兔有(\d+)位，右边这组含小兔有(\d+)位/);
    const html = render(a), text = visible(html);
    assert.match(html, /class="queue-counting-evidence"/);
    assert.equal((html.match(/<img [^>]*src="[^"]*\/rabbit\.png"/g) ?? []).length, 1);
    assert.ok(text.includes(`${left}位`) && text.includes(`${right}位`));
    assert.match(text, /小兔被两边各数了一次/);
    assert.match(text, a.stage === 2 ? /从右数到小兔/ : /右边这一组/);
    assert.match(a.success, new RegExp(`${left}加${right}再减一，是${+left + +right - 1}`));
  }
});

test('all nine identities, givens, answer choices and correct totals survive the presentation correction', () => {
  assert.equal(rounds.length, 9);
  for (const [i, a] of rounds.entries()) {
    for (const field of ['id', 'stage', 'prompt', 'tokens', 'answerId']) assert.deepEqual(JSON.parse(JSON.stringify(a[field])), before[i][field]);
    assert.equal(a.tokens.find(t => t.id === a.answerId).label, String(6 + (i % 3) * 2));
    assert.equal(a.instruction, '指着朋友数一数，再选队伍的总人数。');
    assert.equal(a.revision, 3);
  }
});

test('the complete queue preloads exactly the local animal pictures it renders', () => {
  for (const a of rounds) {
    const sources=[...new Set([...render(a).matchAll(/<img [^>]*src="([^"]+)"/g)].map(m=>m[1]))].sort();
    assert.deepEqual(activityImageSources(a).sort(),sources,a.id);
    const model=queueCountingModel(a.presentation.evidence);
    assert.equal(sources.length,model.total,'each physical friend has a different portrait');
    assert.deepEqual(sources,model.friends.map(f=>imageGallery.characters[f.imageKey].src).sort());
  }
});

test('all nine physical queues and both numbered paths agree with independently parsed givens', () => {
  for (const a of rounds) {
    const values=a.prompt.match(/\d+/g).map(Number), [left,right]=values;
    const total=left+right-(a.stage===1?0:1), rabbit=left-1;
    const model=queueCountingModel(a.presentation.evidence),html=render(a);
    assert.equal(model.friends.length,total);
    assert.equal(model.friends.filter(f=>f.character==='rabbit').length,1);
    assert.equal(model.friends[rabbit].character,'rabbit');
    assert.equal((html.match(/<li data-position=/g)||[]).length,total);
    assert.equal((html.match(/<img /g)||[]).length,total);
    const leftPath=Array.from({length:left},(_,i)=>[i+1,i+1]);
    const rightPath=Array.from({length:right},(_,i)=>a.stage===1?[left+i+1,i+1]:[left+i,right-i]);
    const drawnCounts=[...html.matchAll(/class="queue-count-number" data-position="(\d+)"[^>]*>(\d+)</g)].map(m=>m.slice(1).map(Number));
    assert.deepEqual(drawnCounts,[...leftPath,...rightPath],a.id);
    assert.deepEqual(model.leftCounts.flatMap((n,i)=>n===null?[]:[[i+1,n]]),leftPath);
    assert.deepEqual(model.rightCounts.flatMap((n,i)=>n===null?[]:[[i+1,n]]),rightPath);
    assert.deepEqual(leftPath.map(p=>p[0]).filter(p=>rightPath.some(r=>r[0]===p)),a.stage===1?[]:[left]);
    assert.ok(visible(html).includes(`${left} + ${right}${a.stage===1?'':' − 1'} = ${total} 位`));
    assert.equal(a.tokens.find(t=>t.id===a.answerId).label,String(total));
  }
});

test('enlargement and local teaching narration use the same complete queue without submitting an answer', () => {
  const lines=activityVoiceLines(explorationSets);
  for(const a of rounds){
    const model=queueCountingModel(a.presentation.evidence),html=renderAll(a);
    assert.equal((html.match(/aria-label="完整的朋友队伍"/g)||[]).length,2);
    assert.equal((html.match(/>听图解<\/button>/g)||[]).length,2);
    assert.match(html,/aria-label="放大题目图片"/);
    assert.match(html,/type="button" class="queue-listen"/);
    assert.ok(lines.some(line=>line.context.endsWith('/'+a.id)&&line.text===model.speech&&line.locale==='zh-CN'));
    assert.match(model.speech,/从左边开始数：1，2，3/);
    assert.ok(model.speech.endsWith(`一共${model.total}位。`));
  }
});

test('historical comparisons accept only exact declared corrections and keep answer mutations visible', () => {
  const current = JSON.parse(JSON.stringify(rounds));
  assert.deepEqual(restoreMathConsistency(current), before);
  const wrong = structuredClone(current);
  wrong[0].presentation.evidence.behind = 4;
  assert.throws(() => restoreMathConsistency(wrong), /exact reviewed 063/);
  const wrongAnswer = structuredClone(current);
  wrongAnswer[0].answerId = 'o1';
  assert.notDeepEqual(restoreMathConsistency(wrongAnswer), before);
});
