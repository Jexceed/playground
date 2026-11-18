import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { activitySolutions, permutations } from './lib/activity-solutions.mjs';

const [{ explorationSets, explorationDrawings }, { activitySets }, { evaluateActivity }] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/curriculum/pilot/activities.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
]);
const family = id => explorationSets.flatMap(group => group.rounds).filter(a => a.primaryFamilyId === id);
const token = (a, id) => a.tokens.find(t => t.id === id);
const drawing = t => explorationDrawings[t.image.src.split('/').at(-1).replace('.png', '')];
const shape = t => drawing(t).objects[0].kind;

test('shape matching labels locate cards on their own side and all equivalent shapes pair correctly', () => {
  for (const a of family('L02').slice(3)) {
    [a.leftIds, a.rightIds].forEach((side, col) => side.forEach((id, i) =>
      assert.equal(token(a, id).label, (col ? '右图' : '左图') + (i + 1), a.id)));
    const rows = a.leftIds.map((id, i) => [id, a.rightIds[i]]);
    assert.equal(evaluateActivity(a, { kind: 'matching', pairs: rows }).status, 'incorrect', a.id);
    for (const order of permutations(a.rightIds)) {
      const pairs = a.leftIds.map((id, i) => [id, order[i]]);
      const same = pairs.every(([l, r]) => shape(token(a, l)) === shape(token(a, r)));
      assert.equal(evaluateActivity(a, { kind: 'matching', pairs }).status === 'correct', same, a.id);
    }
  }
});

test('every search variant changes the target positions and the shown shapes determine the complete answer', () => {
  const shapes = ['circle', 'rect', 'polygon'];
  for (const stage of [1, 2, 3]) {
    const positions = new Set();
    family('A06').filter(a => a.stage === stage).forEach((a, variant) => {
      const cells = a.tokens.flatMap((t, i) => {
        const o = drawing(t).objects[0];
        assert.equal(t.label, '第' + (i + 1) + '张', a.id);
        const match = stage === 3 ? o.fill === '#e8b64e' && o.kind !== shapes[variant]
          : o.kind === shapes[variant] && (stage === 1 || o.fill === '#548cb3');
        return match ? [i] : [];
      });
      assert.ok(cells.length > 0 && cells.length < a.tokens.length);
      assert.deepEqual([...a.expectedTokenIds].sort(), cells.map(i => a.tokens[i].id).sort(), a.id);
      positions.add(cells.join(','));
    });
    assert.equal(positions.size, 3);
  }
});

test('partition choices keep every valid split while the surplus card changes position', () => {
  const positions = new Set();
  for (const [i, a] of family('N04').slice(0, 3).entries()) {
    const total = 5 + i;
    const good = a.tokens.filter(t => t.partitionCounts.left + t.partitionCounts.right === total);
    assert.deepEqual(good.map(t => t.partitionCounts.left).sort((a,b) => a-b), Array.from({length:total+1}, (_,j)=>j));
    assert.deepEqual(good.map(t => t.id).sort(), [...a.expectedTokenIds].sort());
    const bad = a.tokens.map((t,j)=>good.includes(t) ? -1 : j).filter(j => j>=0);
    assert.equal(bad.length, 1);
    const {left, right} = a.tokens[bad[0]].partitionCounts;
    assert.equal(Math.abs(left + right - total), 1, 'near miss differs by exactly one disc');
    positions.add(bad.join(','));
  }
  assert.equal(positions.size, 3);
});

test('animal quantity matches are determined by the actual hidden stimulus, with different ranks per variant', () => {
  for (const stage of [1, 2, 3]) {
    const rabbitRanks = [];
    for (const a of family('A09').filter(a => a.stage === stage)) {
      const counts = a.protocol.preview.map(id => token(a, id).quantityPicture);
      const answer = counts.map(({image, count}) => {
        const left = a.leftIds.find(id => token(a, id).image.src === image.src);
        const right = a.rightIds.find(id => Number(token(a, id).label) === count);
        assert.ok(left && right);
        return [left, right];
      });
      assert.equal(evaluateActivity(a, {kind:'matching',pairs:answer}).status, 'correct');
      const rabbit = counts.find(c => c.image.src === token(a, 'rabbit').image.src);
      rabbitRanks.push(counts.filter(c => c.count < rabbit.count).length);
    }
    assert.ok(new Set(rabbitRanks).size >= Math.min(stage + 1, 3), 'rabbit has different ranks at stage ' + stage);
  }
});

test('each of the two spoken comparisons eliminates a different English distractor', () => {
  const colors = { '#db675e':'red', '#548cb3':'blue', '#e8b64e':'yellow' }, cues = new Set();
  for (const a of family('E07').slice(6)) {
    const audio = a.protocol.audioText;
    cues.add(audio);
    const clauses = [...audio.matchAll(/the (red|blue|yellow) bar is (longer|shorter) than the (red|blue|yellow) bar/gi)];
    assert.equal(clauses.length, 2);
    const conditions = new Set();
    for (const t of a.tokens) {
      const widths = Object.fromEntries(drawing(t).objects.map(o => [colors[o.fill], o.w]));
      const results = clauses.map(([,left,relation,right]) => relation === 'longer' ? widths[left] > widths[right] : widths[left] < widths[right]);
      assert.equal(results.every(Boolean), t.id === a.answerId);
      conditions.add(results.join(','));
    }
    assert.deepEqual(conditions,new Set(['true,true','true,false','false,true']));
  }
  assert.equal(cues.size, 3);
});

test('the blank-card board forces children to put an actual blank card in a writable cell', () => {
  const a = activitySets.flatMap(s => s.rounds).find(a => a.id === 'grid-blank-is-a-card');
  const solutions = activitySolutions(a);
  assert.ok(solutions.length);
  for (const sol of solutions) {
    const entries = Object.entries(sol.cells).filter(([,v]) => v.tokenId === 'blank-card');
    assert.ok(entries.length, 'at least one blank must be placed');
    assert.equal(evaluateActivity(a, sol).status, 'correct');
    const partial = structuredClone(sol);
    partial.cells[entries[0][0]] = {state:'unfilled'};
    assert.equal(evaluateActivity(a, partial).status,'incomplete');
  }
});

test('fold axes are distinguishable and the count includes all rectangles at different positions', () => {
  const a = family('G10')[5];
  const [{points}] = drawing(a.tokens[0]).objects;
  const xs = points.map(p=>p[0]), ys=points.map(p=>p[1]);
  const w=Math.max(...xs)-Math.min(...xs), h=Math.max(...ys)-Math.min(...ys);
  assert.ok(Math.max(w,h)/Math.min(w,h)>1.4);
  assert.deepEqual(a.expectedTokenIds,['axis0','axis1']);
  for(const a of family('G09').slice(6)) {
    assert.doesNotMatch(a.prompt,/大小不同/);
    assert.match(a.prompt+' '+a.clues.join(''),/位置/);
  }
});

test('flip questions describe the checked final state and all parent prompts refer to actions in their own round', () => {
  for(const a of family('L09')) {
    if (a.stage < 3) assert.doesNotMatch(a.parentPrompt,/翻过两次|翻了两次/);
    else {
      assert.match(a.parentPrompt,/两次/);
      assert.match(a.instruction,/最后/);
    }
  }
});

test('parent activities supply the materials, steps and observations required for THIS activity', () => {
  const e = family('E01').slice(6);
  assert.equal(new Set(e.map(a => JSON.stringify(a.steps))).size,3);
  assert.equal(new Set(e.map(a => JSON.stringify(a.observations))).size,3);
  assert.match(e[0].materials.join(''),/盒/);
  assert.match(e[1].materials.join(''),/纸带/);
  assert.ok(e[1].presentation.materialCards.every(c => c.image && !/box/.test(c.image.src)));
  assert.match(e[2].steps.join(''),/书/);
  const bean = family('P02')[6];
  assert.match(bean.steps.join(''),/第一次|第一天|今天刚开始/);
  assert.match(bean.steps.join(''),/同一株/);
  for (const i of [0,2]) assert.doesNotMatch(family('P05')[i].observations.map(o=>o.text).join(''),/比较相同与不同/);
  assert.doesNotMatch(family('P01')[6].observations.map(o=>o.text).join(''),/分类/);
  const fold = family('G15')[0].steps.join('');
  assert.match(fold,/猜|预测/);
  assert.ok(fold.search(/猜|预测/) < fold.indexOf('展开看看'));
});
