import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { restoreBoardMovePresentation } from './lib/restore-reviewed-art.mjs';

const [catalog, exploration, session, evaluator, activityDomain] = await Promise.all([
  loadTypeScriptModule('src/curriculum/catalog.ts'),
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/engine/activity-session.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
  loadTypeScriptModule('src/domain/activity.ts'),
]);
const walks = catalog.activitySets.flatMap(set => set.rounds).filter(activity => activity.primaryFamilyId === 'L10');
const previousInstruction = '先选图卡，再按位置编号排好。也可以拖过去。';
const instruction = '选一位朋友，再点数字格，把它放到走完的位置。';
const expectedAnswers = [['n3', 'n7'], ['n4', 'n8'], ['n5', 'n9'], ['n4', 'n3'], ['n5', 'n4'], ['n6', 'n5'], ['n5', 'n1'], ['n6', 'n2'], ['n7', 'n3']];
const empty = { kind: 'orderedPlacement', slots: [{ state: 'unfilled' }, { state: 'unfilled' }] };
const place = (activity, state, slot, number) => session.transitionSession(activity, state, { type: 'place', slotId: `slot-${slot}`, tokenId: `n${number}` });
const responseAt = (state, slot) => evaluator.responseValue(state.response, `slot-${slot}`);
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function expectedModel(index) {
  const variant = index % 3;
  const stage = Math.floor(index / 3);
  return {
    kind: 'numberWalk', min: 0, max: 11, turns: stage + 2,
    actors: [
      { id: 'red', slotId: 'slot-0', start: variant + 1, delta: 1 },
      { id: 'blue', slotId: 'slot-1', start: variant + 9, delta: stage === 0 ? -1 : -2 },
    ],
  };
}

function solve(activity, state = session.createSession(activity)) {
  return activity.evaluation.tokenIds.reduce((current, tokenId, slot) => session.transitionSession(activity, current, {
    type: 'place', slotId: `slot-${slot}`, tokenId,
  }), state);
}

test('all nine number walks match the original starts, directions, turn counts and authored answers', () => {
  assert.equal(walks.length, 9);
  walks.forEach((activity, index) => {
    assert.equal(activity.id, `explore-multi-agent-movement-${index + 1}`);
    assert.equal(activity.revision, 1);
    assert.equal(activity.kind, 'orderedPlacement');
    assert.equal(activity.slotCount, 2);
    assert.equal(activity.tokenUse, 'unlimited');
    assert.equal(activity.instruction, instruction);
    assert.deepEqual(activity.presentation, { evidence: expectedModel(index) });
    assert.deepEqual(activity.evaluation, { kind: 'sequence', tokenIds: expectedAnswers[index] });
    const model = activity.presentation.evidence;
    assert.deepEqual(model.actors.map(actor => `n${actor.start + actor.delta * model.turns}`), expectedAnswers[index]);
    assert.deepEqual([...activity.tokens.map(token => token.id)].sort(), Array.from({ length: 12 }, (_, n) => `n${n}`).sort());
    assert.deepEqual(solve(activity).response, exploration.authoringSolutions[activity.id]);
  });
});

test('only the exact reviewed instruction and number-walk presentation change the 1110-question catalog', () => {
  const restored = restoreBoardMovePresentation(catalog.catalogGames);
  let changed = 0;
  for (const group of restored) for (const activity of group.rounds) {
    if (activity.primaryFamilyId !== 'L10') continue;
    const index = Number(activity.id.split('-').at(-1)) - 1;
    assert.equal(activity.instruction, instruction, activity.id);
    assert.deepEqual(activity.presentation, { evidence: expectedModel(index) }, activity.id);
    activity.instruction = previousInstruction;
    delete activity.presentation;
    changed += 1;
  }
  assert.equal(changed, 9);
  assert.equal(restored.flatMap(group => group.rounds).length, 1110);
  // Frozen from /tmp/playground-054-before.json before implementation (same as commit 014a56a3).
  // Checks all fields, including answers, IDs, revisions, image references, clues and other families.
  assert.equal(hash(restored), 'fce1bbed70e846ad6d5700400f8ac9a23559018edd8bc8017b470b19e241a9f8');
});

test('main narration starts with concrete positions, direction and turns, then explains placement without giving answers', () => {
  const lines = catalog.activityVoiceLines(catalog.activitySets);
  for (const activity of walks) {
    const model = activity.presentation.evidence;
    const expected = [...activity.clues, instruction].join('');
    for (const phase of [undefined, 'ready', 'respond', 'complete'])
      assert.equal(activityDomain.activityPromptSpeech(activity, phase), expected, `${activity.id}/${phase}`);
    assert.ok(expected.startsWith(`红色从${model.actors[0].start}出发，每次向右走1格。`));
    assert.ok(expected.includes(`蓝色从${model.actors[1].start}出发，每次向左走${Math.abs(model.actors[1].delta)}格。`));
    assert.ok(expected.includes(`同时走${model.turns}次。`));
    assert.ok(expected.endsWith(instruction));
    assert.doesNotMatch(expected, /红色停在|蓝色停在/);
    assert.ok(!expected.includes(activity.success));
    const context = `explore-multi-agent-movement/${activity.id}`;
    assert.ok(lines.some(line => line.kind === 'prompt' && line.context === context && line.text === expected && line.locale === 'zh-CN'));
    for (const clue of activity.clues)
      assert.ok(lines.some(line => line.kind === 'clue' && line.context === context && line.text === clue && line.locale === 'zh-CN'));
  }
});

test('visible starting positions never prefill responses or silently complete the task', () => {
  for (const activity of walks) {
    const state = session.createSession(activity);
    assert.equal(state.phase, 'respond', activity.id);
    assert.deepEqual(state.response, empty, activity.id);
    assert.deepEqual(state.history, []);
    assert.deepEqual(state.evidence, []);
    assert.equal(evaluator.evaluateActivity(activity, state.response).status, 'incomplete');
    const submitted = session.transitionSession(activity, state, { type: 'submit' });
    assert.equal(submitted.phase, 'respond');
    assert.equal(submitted.result.status, 'incomplete');
    assert.equal(submitted.attempts, 0);
    assert.deepEqual(submitted.evidence, []);
  }
});

test('every cell is a legal guess for either actor and placing one never moves the other', () => {
  for (const activity of walks) {
    for (let slot = 0; slot < 2; slot += 1) for (let number = 0; number <= 11; number += 1) {
      const state = place(activity, session.createSession(activity), slot, number);
      assert.deepEqual(responseAt(state, slot), { state: 'filled', tokenId: `n${number}` }, `${activity.id}/${slot}/${number}`);
      assert.deepEqual(responseAt(state, 1 - slot), { state: 'unfilled' });
      assert.equal(state.phase, 'respond');
      assert.equal(state.attempts, 0);
      assert.equal(state.result, null);
      assert.deepEqual(state.evidence, []);
    }
  }
});

test('wrong placements are preserved for feedback and correct placements use the unchanged evaluator', () => {
  for (const activity of walks) {
    let state = place(activity, session.createSession(activity), 0, 0);
    state = place(activity, state, 1, 11);
    const wrongResponse = structuredClone(state.response);
    state = session.transitionSession(activity, state, { type: 'submit' });
    assert.equal(state.result.status, 'incorrect', activity.id);
    assert.equal(state.phase, 'respond');
    assert.equal(state.attempts, 1);
    assert.deepEqual(state.response, wrongResponse, 'feedback must not snap friends to the answer');
    state = solve(activity, state);
    assert.equal(state.result, null);
    assert.equal(state.phase, 'respond', 'correct placement alone is not a submission');
    state = session.transitionSession(activity, state, { type: 'submit' });
    assert.equal(state.result.status, 'correct');
    assert.equal(state.phase, 'complete');
    assert.equal(state.attempts, 2);
    assert.deepEqual(state.evidence.map(event => [event.kind, event.correct]), [['attempt', false], ['attempt', true]]);
  }
});

test('two friends may occupy the same numbered cell without displacing either friend', () => {
  for (const activity of walks) for (let number = 0; number <= 11; number += 1) {
    let state = place(activity, session.createSession(activity), 0, number);
    state = place(activity, state, 1, number);
    const shared = { state: 'filled', tokenId: `n${number}` };
    assert.deepEqual(state.response.slots, [shared, shared], `${activity.id}/${number}`);
    assert.equal(state.attempts, 0);
    const sameCellAnswer = { ...activity, evaluation: { kind: 'sequence', tokenIds: [`n${number}`, `n${number}`] } };
    assert.equal(evaluator.evaluateActivity(sameCellAnswer, state.response).status, 'correct', 'same-cell answers must be representable');
    const moved = place(activity, state, 0, (number + 1) % 12);
    assert.deepEqual(responseAt(moved, 1), shared, 'moving red leaves blue on the shared cell');
  }
});

test('undo and clear restore placements, including empty starts, without submitting', () => {
  for (const activity of walks) {
    const initial = session.createSession(activity);
    const red = place(activity, initial, 0, 5);
    const shared = place(activity, red, 1, 5);
    const moved = place(activity, shared, 0, 6);
    let state = session.transitionSession(activity, moved, { type: 'undo' });
    assert.deepEqual(state.response, shared.response);
    state = session.transitionSession(activity, state, { type: 'undo' });
    assert.deepEqual(state.response, red.response);
    state = session.transitionSession(activity, state, { type: 'undo' });
    assert.deepEqual(state.response, empty);
    const cleared = session.transitionSession(activity, shared, { type: 'clear' });
    assert.deepEqual(cleared.response, empty);
    assert.deepEqual(session.transitionSession(activity, cleared, { type: 'undo' }).response, shared.response);
    for (const check of [state, cleared]) {
      assert.equal(check.attempts, 0);
      assert.deepEqual(check.evidence, []);
      assert.equal(check.result, null);
    }
  }
});

test('invalid cells or actors cannot change a response and completed tasks stay locked', () => {
  for (const activity of walks) {
    const initial = session.createSession(activity);
    for (const event of [
      { type: 'place', slotId: 'slot-2', tokenId: 'n4' },
      { type: 'place', slotId: 'slot-0', tokenId: 'n12' },
      { type: 'place', slotId: 'slot-1', tokenId: 'n-1' },
    ]) assert.deepEqual(session.transitionSession(activity, initial, event), initial);
    const complete = session.transitionSession(activity, solve(activity), { type: 'submit' });
    for (let slot = 0; slot < 2; slot += 1) for (let number = 0; number <= 11; number += 1)
      assert.deepEqual(place(activity, complete, slot, number), complete);
    for (const type of ['clear', 'undo']) assert.deepEqual(session.transitionSession(activity, complete, { type }), complete);
    const restarted = session.transitionSession(activity, complete, { type: 'again' });
    assert.deepEqual(restarted.response, empty);
    assert.equal(restarted.phase, 'respond');
    assert.equal(restarted.attempts, 1);
  }
});

let boardPromise;
function loadBoard() {
  boardPromise ??= (async () => {
    const require = createRequire(import.meta.url);
    const reactImports = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'];
    const compiled = await build({
      configFile: false, publicDir: false, logLevel: 'silent',
      ssr: { noExternal: true, external: reactImports },
      build: { ssr: resolve('src/interactions/NumberWalkBoard.tsx'), write: false, minify: false,
        rollupOptions: { output: { format: 'es', inlineDynamicImports: true,
          paths: Object.fromEntries(reactImports.map(id => [id, pathToFileURL(require.resolve(id)).href])),
        } },
      },
    });
    const code = compiled.output.find(output => output.type === 'chunk').code;
    return (await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)).NumberWalkBoard;
  })();
  return boardPromise;
}

function buttonMarkup(html, testId) {
  const match = html.match(new RegExp(`<button\\b[^>]*data-testid="${testId}"[^>]*>`));
  assert.ok(match, `missing button ${testId}`);
  return match[0];
}

test('the real board renders all twelve cells and visible starts while answers remain unanswered', async () => {
  const Board = await loadBoard();
  for (const activity of walks) {
    const state = session.createSession(activity);
    const before = structuredClone(state.response);
    const html = renderToStaticMarkup(createElement(Board, { model: activity.presentation.evidence,
      response: state.response, clues: activity.clues, disabled: false, onPlace: () => assert.fail('rendering cannot place a friend'),
    }));
    assert.deepEqual([...html.matchAll(/data-testid="number-walk-cell-(\d+)"/g)].map(match => Number(match[1])), Array.from({ length: 12 }, (_, index) => index));
    for (const actor of activity.presentation.evidence.actors) {
      const piece = buttonMarkup(html, `number-walk-piece-${actor.id}`);
      assert.match(piece, /data-filled="false"/);
      assert.ok(piece.includes(`出发在${actor.start}`));
      const answer = html.match(new RegExp(`data-testid="number-walk-answer-${actor.id}"[\\s\\S]*?<strong([^>]*)>(.*?)</strong>`));
      assert.ok(answer);
      assert.match(answer[1], /data-filled="false"/);
      assert.equal(answer[2], '?');
    }
    assert.deepEqual(state.response, before, 'rendering starting positions must not populate the answer');
  }
});

test('the real board keeps both friends visible in one cell and disables placements after completion', async () => {
  const Board = await loadBoard();
  for (const activity of walks) {
    const state = place(activity, place(activity, session.createSession(activity), 0, 5), 1, 5);
    const html = renderToStaticMarkup(createElement(Board, { model: activity.presentation.evidence,
      response: state.response, clues: activity.clues, disabled: true, onPlace: () => assert.fail('rendering cannot place a friend'),
    }));
    const column = html.split('data-number-walk-position="5"')[1].split('data-number-walk-position="6"')[0];
    for (const actor of ['red', 'blue']) {
      const piece = buttonMarkup(column, `number-walk-piece-${actor}`);
      assert.match(piece, /data-filled="true"/);
      assert.match(piece, /disabled=""/);
      assert.match(piece, /draggable="false"/);
    }
    for (let number = 0; number <= 11; number += 1)
      assert.match(buttonMarkup(html, `number-walk-cell-${number}`), /disabled=""/);
    const selectors = [...html.matchAll(/<button\b[^>]*class="number-walk-friend-select"[^>]*>/g)];
    assert.equal(selectors.length, 2);
    for (const [button] of selectors) assert.match(button, /disabled=""/);
  }
});
