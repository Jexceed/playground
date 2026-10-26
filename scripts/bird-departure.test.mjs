import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const { birdDepartureModel, birdFlightSpeech } = await loadTypeScriptModule('src/domain/bird-departure.ts');
const { games } = await loadTypeScriptModule('src/data/games.ts');
const rounds = games.find(g => g.id === 'math-story-operations').rounds;

test('all 12 subtraction scenes conserve birds and use only the authored known quantities', () => {
  assert.equal(rounds.length, 12);
  for (const round of rounds) {
    const model = birdDepartureModel(round);
    assert.equal(model.start, round.visualGroups[0].items.length);
    assert.equal(model.gone, round.visualGroups[1].items.length);
    assert.equal(model.birds.length, model.start);
    assert.equal(model.birds.filter(b => b.leaves).length, model.gone);
    assert.equal(model.birds.filter(b => !b.leaves).length, Number(round.answer));
    assert.deepEqual(birdDepartureModel({ ...round, answer: '999' }), model);
    assert.match(birdFlightSpeech(model), new RegExp(`飞走 ${model.gone} 只`));
    for (const bird of model.birds) {
      assert.ok(bird.x >= 10 && bird.x <= 70);
      assert.ok(bird.y >= 45 && bird.y <= 85);
      if (bird.leaves) assert.ok(bird.toX > 78 && bird.toY >= 30 && bird.toY < 70);
    }
  }
});
