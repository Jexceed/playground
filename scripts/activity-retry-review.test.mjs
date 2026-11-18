import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const { activitySets } = await loadTypeScriptModule('src/curriculum/catalog.ts');
const { createSession, transitionSession } = await loadTypeScriptModule('src/engine/activity-session.ts');
const { emptyResponse, evaluateActivity } = await loadTypeScriptModule('src/domain/activity-evaluation.ts');
const activities = activitySets.flatMap(group => group.rounds);

test('an untouched positive multi-select prompts for input and does not record a wrong attempt', () => {
  const multis = activities.filter(a => a.kind === 'multiSelect');
  for (const a of multis) {
    const state = { ...createSession(a), phase: 'respond' };
    const next = transitionSession(a, state, { type: 'submit' });
    assert.equal(next.result.status, 'incomplete', a.id);
    assert.equal(next.attempts, 0, a.id);
    assert.deepEqual(next.evidence, [], a.id);
    assert.equal(evaluateActivity(a, { kind: 'multiSelect', tokenIds: a.expectedTokenIds }).status, 'correct');
  }
  const none = { ...multis[0], expectedTokenIds: [] };
  assert.equal(evaluateActivity(none, emptyResponse(none)).status, 'correct');
});

test('reviewing visual and auditory cues preserves the draft and undo, including interrupted playback', () => {
  for (const id of ['explore-spatial-memory-4', 'explore-auditory-instructions-1']) {
    const a = activities.find(a => a.id === id);
    const run = (state, type) => transitionSession(a, state, { type });
    const respond = state => run(run(run(state, 'start'), 'observationFinished'), 'retentionFinished');
    const first = respond(createSession(a));
    const partial = transitionSession(a, first, { type: 'place', slotId: a.kind === 'gridPlacement' ? 'cell-0' : 'slot-0', tokenId: a.tokens[0].id });
    const reviewing = run(partial, 'reveal');
    assert.equal(reviewing.phase, 'observe');
    for (const resumed of [run(run(reviewing, 'observationFinished'), 'retentionFinished'), respond(run(reviewing, 'interrupt'))]) {
      assert.equal(resumed.phase, 'respond');
      assert.deepEqual(resumed.response, partial.response);
      assert.deepEqual(resumed.history, partial.history);
      assert.equal(resumed.reveals, 1);
      assert.equal(resumed.attempts, 0);
      assert.deepEqual(run(resumed, 'undo').response, first.response);
    }
  }
});

test('every exploration single choice gives a task-specific action on a wrong answer', () => {
  const singles = activities.filter(a => a.kind === 'singleChoice');
  for (const a of singles) {
    const wrong = a.tokens.find(t => t.id !== a.answerId);
    const result = evaluateActivity(a, { kind: 'singleChoice', tokenId: wrong.id });
    assert.equal(result.status, 'incorrect', a.id);
    assert.equal(result.message, a.retry, a.id);
    assert.notEqual(a.retry, '再对照图和题目的条件，一步一步检查。', a.id);
  }
  for (const [id, words] of [['explore-time-elapsed-1', /长针|短针/], ['explore-quantity-stories-5', /飞来/],
    ['explore-rotation-reflection-6', /高/], ['explore-bilingual-concepts-9', /两句|第一句/]]) {
    assert.match(activities.find(a => a.id === id).retry, words);
  }
});
