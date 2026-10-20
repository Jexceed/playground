import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [{ games }, { nextEnlightenmentRoundIndex }, { nextGameInWorld }, storage] = await Promise.all([
  loadGameData(), loadTypeScriptModule('src/domain/enlightenment.ts'),
  loadTypeScriptModule('src/services/curriculum-navigation.ts'), loadTypeScriptModule('src/storage.ts'),
]);
const ids = game => new Set(game.rounds.map(round => round.id));
const bridge = games.find(game => game.id === 'logic-space-bridge');

test('the reported completed bridge round 2 advances to round 3', () => {
  assert.equal(nextEnlightenmentRoundIndex(bridge, 1, ids(bridge)), 2);
});

test('every non-final enlightenment round advances in order regardless of history', () => {
  assert.equal(games.length, 40);
  for (const game of games) {
    for (const history of [new Set(), new Set([game.rounds.at(-1).id]), ids(game)]) {
      for (let index = 0; index < game.rounds.length - 1; index++) {
        assert.equal(nextEnlightenmentRoundIndex(game, index, history), index + 1, `${game.id} round ${index + 1}`);
      }
    }
  }
});

test('final rounds return the first missing question without inventing completions', () => {
  for (const game of games) {
    const complete = ids(game);
    for (let index = 0; index < game.rounds.length - 1; index++) {
      const missing = new Set(complete);
      missing.delete(game.rounds[index].id);
      missing.add('unknown-historical-id');
      const before = [...missing];
      assert.equal(nextEnlightenmentRoundIndex(game, game.rounds.length - 1, missing), index);
      assert.deepEqual([...missing], before);
    }
    assert.equal(nextEnlightenmentRoundIndex(game, game.rounds.length - 1, complete), null);
  }
});

test('filling the last gap in the middle still allows replaying subsequent questions', () => {
  const complete = ids(bridge);
  complete.delete(bridge.rounds[1].id);
  assert.equal(nextEnlightenmentRoundIndex(bridge, 7, complete), 1);
  complete.add(bridge.rounds[1].id);
  assert.equal(nextEnlightenmentRoundIndex(bridge, 1, complete), 2);
  assert.equal(nextEnlightenmentRoundIndex(bridge, 7, complete), null);
});

test('a one-question group reaches completion only when its question is complete', () => {
  const game = { rounds: [bridge.rounds[0]] };
  assert.equal(nextEnlightenmentRoundIndex(game, 0, new Set()), 0);
  assert.equal(nextEnlightenmentRoundIndex(game, 0, ids(game)), null);
});

test('next group follows the full section/world catalog and stops at each world end', () => {
  for (const world of ['math', 'logic', 'graphic']) {
    const groups = games.filter(game => game.world === world);
    for (const [index, game] of groups.entries()) {
      assert.equal(nextGameInWorld('enlightenment', game.id)?.id, groups[index + 1]?.id);
    }
  }
  assert.equal(nextGameInWorld('enlightenment', bridge.id)?.id, 'logic-same-kind-detective');
  assert.equal(nextGameInWorld('enlightenment', 'missing-game'), undefined);
  assert.equal(nextGameInWorld('exploration', bridge.id), undefined);
});

test('repeated question/group completion preserves historical evidence and deduplicates', () => {
  const before = { completedIds: ['old-group'], completedRoundIds: ['old-round'], abilityTags: ['old-tag'] };
  let progress = before;
  for (let replay = 0; replay < 2; replay++) {
    for (const round of bridge.rounds) progress = storage.addRoundCompletion(progress, round.id, round.abilityTags);
    progress = storage.addCompletion(progress, bridge.id, bridge.abilityTags);
  }
  assert.equal(progress.completedRoundIds.length, bridge.rounds.length + 1);
  assert.deepEqual(progress.completedIds, ['old-group', bridge.id]);
  assert.ok(progress.abilityTags.includes('old-tag'));
  assert.deepEqual(before, { completedIds: ['old-group'], completedRoundIds: ['old-round'], abilityTags: ['old-tag'] });
});
