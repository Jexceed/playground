import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const [{ explorationSets, authoringSolutions }, session, evaluator] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/engine/activity-session.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
]);
const rounds = explorationSets.flatMap(set => set.rounds);
const machines = rounds.filter(a => a.primaryFamilyId === 'L08');
const flips = rounds.filter(a => a.primaryFamilyId === 'L09');
const flip = (a, state, index) => {
  const slotId = `cell-${index}`, face = state.response.cells[slotId].tokenId;
  return session.transitionSession(a, state, { type: 'place', slotId, tokenId: face === 'on' ? 'off' : 'on' });
};
test('all nine quantity tasks teach with one chip and transfer to a different start', () => {
  assert.equal(machines.length, 9);
  for (const a of machines) {
    const model = a.presentation.evidence;
    assert.equal(model.kind, 'ruleMachine');
    assert.ok(model.start > 1);
    const answer = a.tokens.find(t => t.id === a.answerId);
    assert.equal(Number(answer.label), (model.start + model.add) * model.multiplier);
    assert.ok(a.tokens.every(t => Number.isInteger(Number(t.label)) && Number(t.label) > 0 && Number(t.label) <= 18));
    let state = session.createSession(a);
    assert.equal(state.phase, 'ready');
    assert.equal(session.transitionSession(a, state, { type: 'submit' }).attempts, 0);
    state = session.transitionSession(a, state, { type: 'start' });
    const wrong = a.tokens.find(t => t.id !== a.answerId);
    state = session.transitionSession(a, state, { type: 'response', response: { kind: 'singleChoice', tokenId: wrong.id } });
    state = session.transitionSession(a, state, { type: 'submit' });
    assert.equal(state.result.status, 'incorrect');
    state = session.transitionSession(a, state, { type: 'response', response: authoringSolutions[a.id] });
    state = session.transitionSession(a, state, { type: 'submit' });
    assert.equal(state.phase, 'complete');
    assert.equal(session.transitionSession(a, state, { type: 'again' }).phase, 'ready');
  }
});
test('all nine flip tasks start with visible faces and follow the authored operation sequence', () => {
  assert.equal(flips.length, 9);
  for (const a of flips) {
    const model = a.presentation.evidence;
    let state = session.createSession(a);
    assert.equal(model.kind, 'cardFlip');
    assert.equal(model.initial.length, a.cells.length);
    assert.deepEqual(Object.values(state.response.cells).map(v => v.tokenId), model.initial);
    assert.equal(evaluator.evaluateActivity(a, state.response).status, 'incorrect', 'initial layout must not silently solve a task');
    for (const index of model.steps) state = flip(a, state, index);
    assert.deepEqual(state.response, authoringSolutions[a.id], a.id);
    assert.equal(state.attempts, 0, 'practice operations do not submit');
    state = session.transitionSession(a, state, { type: 'submit' });
    assert.equal(state.phase, 'complete');
    assert.deepEqual(flip(a, state, 0), state, 'finished cards stay locked');
    assert.deepEqual(session.transitionSession(a, state, { type: 'again' }).response, session.createSession(a).response);
  }
});
test('every position can be flipped twice, undone, reset and retried without losing the initial reference', () => {
  for (const a of flips) {
    const initial = session.createSession(a);
    for (let i = 0; i < a.cells.length; i++) {
      const once = flip(a, initial, i);
      assert.notDeepEqual(once.response, initial.response);
      const twice = flip(a, once, i);
      assert.deepEqual(twice.response, initial.response);
      assert.deepEqual(session.transitionSession(a, twice, { type: 'undo' }).response, once.response);
      assert.deepEqual(session.transitionSession(a, once, { type: 'clear' }).response, initial.response);
    }
    const wrong = session.transitionSession(a, initial, { type: 'submit' });
    assert.equal(wrong.phase, 'respond');
    assert.equal(wrong.attempts, 1);
    assert.equal(wrong.result.message, a.retry);
  }
});
test('other grid tasks keep their unfilled starting state and original authored solutions', () => {
  for (const a of rounds.filter(a => a.kind === 'gridPlacement' && a.primaryFamilyId !== 'L09')) {
    const response = evaluator.emptyResponse(a);
    assert.ok(Object.values(response.cells).every(v => v.state === 'unfilled'), a.id);
    assert.equal(evaluator.evaluateActivity(a, authoringSolutions[a.id]).status, 'correct', a.id);
  }
});
test('rule-machine narration separates the one-chip example from the transfer question', async () => {
  const { activityPromptSpeech } = await loadTypeScriptModule('src/domain/activity.ts');
  for (const a of machines) {
    assert.equal(activityPromptSpeech(a, 'ready'), a.protocol.demonstration);
    assert.ok(activityPromptSpeech(a, 'respond').startsWith(a.prompt.replace(/[。？！]$/, '。')));
    assert.ok(!activityPromptSpeech(a, 'respond').includes(a.protocol.demonstration));
    assert.equal(activityPromptSpeech(a, 'complete'), activityPromptSpeech(a, 'respond'));
  }
  for (const a of rounds.filter(a => a.primaryFamilyId !== 'L08'))
    assert.equal(activityPromptSpeech(a, 'ready'), activityPromptSpeech(a, 'respond'));
});
