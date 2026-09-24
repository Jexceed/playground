import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [{ explorationSets, explorationDrawings }, { evaluateActivity }, { stableChoiceOrder }] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'), loadTypeScriptModule('src/domain/activity-evaluation.ts'),
  loadTypeScriptModule('src/curriculum/exploration/helpers.ts'),
]);
const activities = explorationSets.flatMap(group => group.rounds);
const generic = /^(图|方案|搭法|选项)([A-Za-z]|\d+)$/;
const responseFor = ids => ({ kind: 'orderedPlacement', slots: ids.map(tokenId => ({ state: 'filled', tokenId })) });

test('generic choice labels describe display order, not the hidden authoring/answer index', () => {
  const all = activities.filter(a => a.kind === 'singleChoice' && a.tokens.every(t => generic.test(t.label)));
  assert.ok(all.some(a => a.primaryFamilyId === 'G04'), 'movement choices must be checked');
  assert.ok(all.some(a => a.primaryFamilyId === 'G15'), 'folding choices must be checked');
  for (const activity of all) for (const [index, token] of activity.tokens.entries()) {
    const [, prefix, suffix] = token.label.match(generic);
    assert.equal(token.label, prefix + (/^\d+$/.test(suffix) ? index + 1 : String.fromCharCode(65 + index)), activity.id);
  }
  // Actual face names are semantic answers, never candidate-number labels.
  for (const activity of activities.filter(a => a.primaryFamilyId === 'G18'))
    assert.ok(activity.tokens.every(t => /^[A-F]$/.test(t.label)));
});

test('choice order is stable per activity, but not a predictable global round-number rotation', () => {
  const values = ['first', 'second', 'third', 'fourth'];
  assert.deepEqual(stableChoiceOrder(values, 'one'), stableChoiceOrder(values, 'one'));
  assert.deepEqual([...stableChoiceOrder(values, 'one')].sort(), [...values].sort());
  assert.deepEqual(values, ['first', 'second', 'third', 'fourth']);
  const atFirstRound = activities.filter(a => a.kind === 'singleChoice' && a.id.endsWith('-1')).map(a => a.tokens.findIndex(t => t.id === a.answerId));
  assert.ok(new Set(atFirstRound).size >= 3);
});

test('occluded lower layers can swap when their final visible picture is identical', () => {
  const a = activities.find(a => a.id === 'explore-layer-order-planning-8');
  assert.equal(evaluateActivity(a, responseFor(['p2', 'p1', 'p3', 'p0'])).status, 'correct');
  assert.equal(evaluateActivity(a, responseFor(['p2', 'p1', 'p0', 'p3'])).status, 'incorrect');
});

function rectangleBounds(image) {
  const drawing = explorationDrawings[image.src.split('/').pop().replace('.png', '')];
  const cells = drawing.objects.filter(o => o.kind === 'rect');
  return [Math.min(...cells.map(o => o.x)), Math.min(...cells.map(o => o.y)), Math.max(...cells.map(o => o.x + o.w)), Math.max(...cells.map(o => o.y + o.h))];
}

test('fraction comparisons subdivide the same whole instead of changing its outer proportions', () => {
  for (const activity of activities.filter(a => a.primaryFamilyId === 'N08')) {
    const whole = rectangleBounds(activity.illustration);
    for (const token of activity.tokens) assert.deepEqual(rectangleBounds(token.image), whole, activity.id);
  }
});
