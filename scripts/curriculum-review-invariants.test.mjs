import {restoreChildReadableWording} from "./lib/restore-reviewed-wording.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const baselinePath = 'specs/043-curriculum-review-fixes/verification/baseline.json';
const baselineBytes = readFileSync(baselinePath);
const baseline = JSON.parse(baselineBytes);
// Match JSON's representation of absent optional fields, not undefined JS keys.
const current = restoreChildReadableWording(await loadGameData());
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const fields = (...keys) => keys;
const enlightenment = new Map(), exploration = new Map();
function allow(map, slug, rounds, keys) {
  for (const number of rounds) map.set(`${slug}-${number}`, keys);
}
allow(enlightenment, 'logic-sorter-switch', [9,10,11], fields('visualGroups','choices','parentPrompt'));
allow(enlightenment, 'logic-order-plan', [7,24], fields('prompt','sequence','choices','success','retry','parentPrompt'));
allow(enlightenment, 'logic-order-plan', [19,20], fields('prompt','choices','success'));
allow(enlightenment, 'logic-order-plan', [21], fields('prompt','choices'));
// 044 restores context for these three unchanged answer contracts. Its own
// frozen c6c72277 baseline checks this narrower field set independently.
allow(enlightenment, 'logic-order-plan', [1,9,18], fields('instruction','sceneImage','sequenceStory'));
allow(enlightenment, 'logic-condition-detective', [6], fields('prompt','instruction','difficultyNote','sequence','choices','success','retry','parentPrompt'));
allow(enlightenment, 'logic-fix-plan', [6], fields('prompt','instruction','difficultyNote','sequence','choices','success','retry','parentPrompt'));
allow(enlightenment, 'logic-fix-plan', [7], fields('prompt','instruction','sequence','visualGroups','success','retry','parentPrompt'));
allow(enlightenment, 'logic-fix-plan', [12], fields('prompt','sequence','choices','success'));
allow(enlightenment, 'logic-priority-choice', [2], fields('prompt','choices','success'));
allow(enlightenment, 'logic-priority-choice', [4], fields('prompt','instruction','sequence','choices','success','retry','parentPrompt'));
allow(enlightenment, 'logic-priority-choice', [11], fields('prompt','sequence','choices','success'));
allow(enlightenment, 'logic-matrix-puzzle', [6], fields('success','retry','parentPrompt'));
allow(enlightenment, 'logic-rotation-direction', range(1,12), fields('difficultyNote','sceneImage'));
allow(enlightenment, 'logic-part-whole-puzzle', range(1,6), fields('prompt','instruction','visualGroups','success','retry','parentPrompt'));

// 045 completes the remaining 21 story surfaces. Preserve all earlier field gates.
for (const n of range(1,24)) {
  const id = `logic-order-plan-${n}`;
  enlightenment.set(id, [...new Set([...(enlightenment.get(id) ?? []), 'instruction','sceneImage','sequenceStory'])]);
}

allow(exploration, 'explore-calendar-cycles', [7,8,9], fields('prompt','illustration'));
allow(exploration, 'explore-planning-repair', [1,4,7], fields('tokens','presentation'));
allow(exploration, 'explore-toggle-state', range(1,9), fields('revision','clues','hints','success'));
allow(exploration, 'explore-board-strategy', [7,8,9], fields('revision','clues','hints'));
allow(exploration, 'explore-solid-views-count', [7,8,9], fields('revision','clues','tokens','hints','illustration'));
allow(exploration, 'explore-relative-perspective', [7,8,9], fields('hints','success'));
allow(exploration, 'explore-spatial-memory', range(1,9), fields('prompt'));
allow(exploration, 'explore-story-recall', [6], fields('tokens'));
allow(exploration, 'explore-vocabulary-relations', range(1,6), fields('tokens'));
allow(exploration, 'explore-story-sequence-expression', range(1,6), fields('clues','hints'));
allow(exploration, 'explore-bilingual-concepts', [4,5,6], fields('revision','tokens'));
allow(exploration, 'explore-culture-world', [3], fields('hints','materials','steps','presentation'));
const revised = new Set([
  ...range(1,9).map(n => `explore-toggle-state-${n}`),
  ...[7,8,9].flatMap(n => [`explore-board-strategy-${n}`, `explore-solid-views-count-${n}`]),
  ...[4,5,6].map(n => `explore-bilingual-concepts-${n}`),
]);
const omit = (object, keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

test('review baseline remains the pre-edit d8dcbf2c snapshot', () => {
  assert.equal(baseline.commit, 'd8dcbf2c');
  assert.equal(sha256(baselineBytes), '780a3d79b1bf4a34a9aad708f9843567c2144c23f44e2ceba9f167a8a3feabc4');
});

for (const [key, allowlist, count] of [['games', enlightenment, 489], ['activitySets', exploration, 621]]) {
  test(`${key}: only the explicit reviewed rounds and fields may change; all other content stays equal`, () => {
    const before = baseline[key], after = current[key];
    assert.equal(after.flatMap(group => group.rounds).length, count);
    assert.deepEqual(after.map(group => [group.id, group.rounds.map(round => round.id)]),
      before.map(group => [group.id, group.rounds.map(round => round.id)]));
    const changed = new Set();
    after.forEach((group, index) => {
      assert.deepEqual(omit(group, ['rounds']), omit(before[index], ['rounds']), `${group.id} metadata`);
      group.rounds.forEach((round, roundIndex) => {
        const original = before[index].rounds[roundIndex];
        const permitted = allowlist.get(round.id) ?? [];
        assert.deepEqual(omit(round, permitted), omit(original, permitted), `${round.id}: unexpected content change`);
        if (!isDeepStrictEqual(round, original)) changed.add(round.id);
        if (round.tokens) {
          const tokenKeys = round.primaryFamilyId === 'E01' ? ['image','textOnly'] : ['image'];
          assert.deepEqual(round.tokens.map(token => omit(token, tokenKeys)), original.tokens.map(token => omit(token, tokenKeys)), `${round.id}: token identities or meanings changed`);
        }
      });
    });
    assert.deepEqual([...changed].sort(), [...allowlist.keys()].sort(), 'every allowed correction is implemented, with no unlisted correction');
  });
}

test('exactly eighteen semantic revisions increase while answer contracts remain intact', () => {
  assert.equal(revised.size, 18);
  const before = new Map(baseline.activitySets.flatMap(group => group.rounds).map(round => [round.id, round]));
  for (const round of current.activitySets.flatMap(group => group.rounds)) {
    const original = before.get(round.id);
    assert.equal(round.revision, original.revision + Number(revised.has(round.id)), round.id);
    for (const key of ['answerId','expectedTokenIds','expectedPairs','evaluation','tokenUse','protocol'])
      assert.deepEqual(round[key], original[key], `${round.id}/${key}`);
  }
  for (const [index, group] of current.games.entries())
    assert.deepEqual(group.rounds.map(round => round.answer), baseline.games[index].rounds.map(round => round.answer), group.id);
});

test('new revision records never delete or copy the old revision completion evidence', async () => {
  const { recordActivityEvent, readActivityProgress } = await loadTypeScriptModule('src/services/activity-progress.ts');
  const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const activityId = 'explore-toggle-state-1';
  recordActivityEvent(activityId, 1, { id: 'old-success', kind: 'attempt', correct: true }, storage, 100);
  const oldEntry = structuredClone(readActivityProgress(storage).progress.entries[`${activityId}@1`]);
  recordActivityEvent(activityId, 2, { id: 'new-hint', kind: 'hint' }, storage, 200);
  const entries = readActivityProgress(storage).progress.entries;
  assert.deepEqual(entries[`${activityId}@1`], oldEntry);
  assert.equal(entries[`${activityId}@2`].firstCompletedAt, null);
  assert.equal(entries[`${activityId}@2`].correctAttempts, 0);
  assert.equal(entries[`${activityId}@2`].hints, 1);
});

test('original planting atlas and its source retain their pre-edit SHA-256 bytes', () => {
  // Independently obtained from git show d8dcbf2c:<path>, not from the new runtime image.
  const original = 'bcd406509310328efb60cd70b002ff230fa326f73ae2fe759adba629f0543eb9';
  for (const file of ['public/images/items/exploration-art/planting-steps.png', 'public/images/items/exploration-art/source/planting-steps-source.png'])
    assert.equal(sha256(readFileSync(file)), original, file);
});
