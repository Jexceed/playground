import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [{ games, activitySets }, { explorationDrawings }] = await Promise.all([
  loadGameData(),
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
]);

const enlGroup = id => games.find(g => g.id === id);
const expFamily = id => activitySets.flatMap(g => g.rounds).filter(a => a.primaryFamilyId === id);
const drawing = image => explorationDrawings[image.src.split('/').at(-1).replace('.png', '')];

test('067 enlightenment fixes: unambiguous mirror fold, monotonic compose curve, and no retry spoilers', () => {
  const mirror5 = enlGroup('logic-mirror-fold').rounds[4];
  assert.notDeepEqual(mirror5.matrix.cells[0], mirror5.matrix.cells[2], 'row 1 and row 3 differ so vertical symmetry is excluded');
  assert.equal(mirror5.answer, '左右能重合');

  const splits = enlGroup('math-compose-decompose').rounds.filter(r => ['蓝盒', '黄盒'].includes(r.visualGroups?.[0]?.label));
  const wholes = splits.map(r => Number(r.prompt.match(/\d+/)[0]));
  for (let i = 1; i < wholes.length; i++) {
    assert.ok(wholes[i] >= wholes[i - 1], `compose-decompose whole curve stays monotonic: ${wholes.join(',')}`);
  }

  for (const gameId of ['logic-pattern-train', 'logic-order-plan', 'logic-position-map', 'logic-memory-camera']) {
    for (const r of enlGroup(gameId).rounds) {
      const answerLabel = r.choices.find(c => c.value === r.answer)?.label ?? r.answer;
      assert.ok(!r.retry.includes(`就是${answerLabel}`) && !r.retry.includes(`看到${answerLabel}`), `${r.id} retry must not directly give away answer`);
    }
  }
});

test('067 exploration fixes: congruent fraction areas, memory-gated phonics, non-self cube faces, and mixed rhythms', () => {
  for (const a of expFamily('N08')) {
    const stemGreen = drawing(a.illustration).objects.filter(o => o.kind === 'rect' && o.fill === '#c4dacb');
    const correctToken = a.tokens.find(t => t.id === a.answerId);
    const optGreen = drawing(correctToken.image).objects.filter(o => o.kind === 'rect' && o.fill === '#c4dacb');
    const bounds = rects => [
      Math.min(...rects.map(r => r.x)),
      Math.min(...rects.map(r => r.y)),
      Math.max(...rects.map(r => r.x + r.w)),
      Math.max(...rects.map(r => r.y + r.h)),
    ];
    assert.deepEqual(bounds(optGreen), bounds(stemGreen), `${a.id} correct fraction option has congruent shaded bounds`);
  }

  for (const a of expFamily('E05').filter(r => r.stage === 3)) {
    assert.equal(a.protocol.kind, 'memory', `${a.id} hides lookup table during matching`);
    assert.equal(a.protocol.preview.length, 3);
  }

  for (const a of expFamily('G18').filter(r => r.kind === 'singleChoice')) {
    const targetFace = a.prompt.match(/和([A-F])面相对/)[1];
    assert.ok(a.tokens.every(t => t.label !== targetFace), `${a.id} never offers the queried face itself as opposite`);
  }

  for (const a of expFamily('A08').filter(r => r.kind === 'orderedPlacement')) {
    const ids = a.evaluation.tokenIds;
    assert.ok(new Set(ids).size === 2, `${a.id} mixes both soft and bright sounds`);
  }
});

test('067 hints and answer positions: second hints do not copy the exact answer explanation and streaks stay <= 2', () => {
  for (const group of activitySets) {
    const slots = [];
    for (const a of group.rounds) {
      if (a.id.startsWith('explore-') && a.kind !== 'parentObservation') {
        assert.notEqual(a.hints[1], a.success, `${a.id} second hint should guide method rather than repeat success answer`);
      }
      if (a.id.startsWith('explore-') && a.kind === 'singleChoice' && a.tokens.length > 1) {
        slots.push(a.tokens.findIndex(t => t.id === a.answerId));
      }
    }
    for (let i = 2; i < slots.length; i++) {
      assert.ok(!(slots[i] === slots[i - 1] && slots[i] === slots[i - 2]), `${group.id} singleChoice answer slot repeats > 2 times: ${slots.join(',')}`);
    }
  }
});
