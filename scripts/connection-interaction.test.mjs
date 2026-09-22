import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [edit, session, { explorationSets, authoringSolutions }, { evaluateActivity }] = await Promise.all([
  loadTypeScriptModule('src/interactions/connection-state.ts'),
  loadTypeScriptModule('src/engine/activity-session.ts'),
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
]);
const all = explorationSets.flatMap(g => g.rounds);
const pairs = { leftIds: ['a', 'b', 'c'], rightIds: ['x', 'y', 'z'] };
const blank = { kind: 'matching', pairs: [] };

test('matching accepts either starting side and arbitrary wrong pairs without consulting an answer', () => {
  assert.deepEqual(edit.connectPair(pairs, blank, 'a', 'z'), { kind: 'matching', pairs: [['a', 'z']] });
  assert.deepEqual(edit.connectPair(pairs, blank, 'z', 'a'), { kind: 'matching', pairs: [['a', 'z']] });
  assert.equal(edit.connectPair(pairs, blank, 'a', 'b'), blank);
  assert.equal(edit.connectPair(pairs, blank, 'x', 'y'), blank);
  assert.equal(edit.connectPair(pairs, blank, 'outside', 'a'), blank);
});

test('reconnecting frees both occupied endpoints in a single undoable operation', () => {
  const activity = all.find(a => a.kind === 'matching');
  const [[a, x], [b, y]] = activity.expectedPairs;
  let state = session.createSession(activity);
  state = session.transitionSession(activity, state, { type: 'response', response: { kind: 'matching', pairs: [[a, x], [b, y]] } });
  const before = state.response;
  const after = edit.connectPair(activity, before, a, y);
  assert.deepEqual(after.pairs, [[a, y]]);
  assert.deepEqual(before.pairs, [[a, x], [b, y]]);
  state = session.transitionSession(activity, state, { type: 'response', response: after });
  assert.equal(state.attempts, 0);
  state = session.transitionSession(activity, state, { type: 'undo' });
  assert.deepEqual(state.response, before);
  assert.equal(state.attempts, 0);
});

test('disconnecting affects only that connection; repeating the same connection is a no-op', () => {
  const response = { kind: 'matching', pairs: [['a', 'x'], ['b', 'y']] };
  assert.deepEqual(edit.disconnectPair(response, 'x'), { kind: 'matching', pairs: [['b', 'y']] });
  assert.deepEqual(edit.disconnectPair(response, 'a'), { kind: 'matching', pairs: [['b', 'y']] });
  assert.equal(edit.connectPair(pairs, response, 'x', 'a'), response);
});

test('every authored matching exercise remains one-to-one and playable through the editing contract', () => {
  const matching = all.filter(a => a.kind === 'matching');
  assert.equal(matching.length, 33);
  for (const activity of matching) {
    assert.equal(new Set(activity.expectedPairs.map(p => p[0])).size, activity.expectedPairs.length, activity.id);
    assert.equal(new Set(activity.expectedPairs.map(p => p[1])).size, activity.expectedPairs.length, activity.id);
    let response = blank;
    for (const [left, right] of activity.expectedPairs) response = edit.connectPair(activity, response, right, left);
    assert.equal(evaluateActivity(activity, response).status, 'correct', activity.id);
  }
});

test('identical shape cards can swap partners, while wrong shapes and repeated endpoints are rejected', () => {
  const shapes = all.filter(a => a.kind === 'matching' && a.alternativePairings);
  assert.equal(shapes.length, 3);
  for (const activity of shapes) {
    assert.equal(evaluateActivity(activity, { kind: 'matching', pairs: activity.alternativePairings[0] }).status, 'correct');
    assert.equal(evaluateActivity(activity, { kind: 'matching', pairs: [['a0', 'b1'], ['a1', 'b0'], ['a2', 'b2'], ['a3', 'b3']] }).status, 'incorrect');
    assert.equal(evaluateActivity(activity, { kind: 'matching', pairs: [['a0', 'b0'], ['a0', 'b1'], ['a2', 'b2'], ['a3', 'b3']] }).status, 'incorrect');
  }
});

test('bridge editing cycles within fixed and max values without losing other bridges', () => {
  const activity = { kind: 'network', graph: { nodes: [], edges: [{ id: 'free', max: 2 }, { id: 'fixed', fixed: 1, max: 2 }, { id: 'locked', fixed: 2, max: 2 }] } };
  let response = { kind: 'network', counts: { free: 0, fixed: 1, locked: 2 } };
  for (const n of [1, 2, 0]) { response = edit.cycleBridge(activity, response, 'free'); assert.equal(response.counts.free, n); }
  response = edit.cycleBridge(activity, response, 'fixed'); assert.equal(response.counts.fixed, 2);
  response = edit.cycleBridge(activity, response, 'fixed'); assert.equal(response.counts.fixed, 1);
  response = edit.cycleBridge(activity, response, 'locked'); assert.equal(response.counts.locked, 2);
  assert.equal(edit.cycleBridge(activity, response, 'outside'), response);
});

test('route editing rejects jumps, closed roads and forbidden repeats, while preserving parallel edges', () => {
  const activity = { kind: 'route', start: 'a', blockedEdges: ['closed'], allowRevisit: false, graph: { nodes: [], edges: [
    { id: 'straight', from: 'a', to: 'b' }, { id: 'curve', from: 'a', to: 'b', curve: 45 },
    { id: 'far', from: 'c', to: 'd' }, { id: 'closed', from: 'a', to: 'd' },
  ] } };
  let response = { kind: 'route', edgeIds: [] };
  for (const id of ['far', 'closed', 'outside']) assert.equal(edit.walkEdge(activity, response, id), response);
  response = edit.walkEdge(activity, response, 'straight'); assert.deepEqual(response.edgeIds, ['straight']);
  assert.equal(edit.walkEdge(activity, response, 'straight'), response);
  response = edit.walkEdge(activity, response, 'curve'); assert.deepEqual(response.edgeIds, ['straight', 'curve']);
  assert.deepEqual(edit.walkEdge({ ...activity, allowRevisit: true }, response, 'straight').edgeIds, ['straight', 'curve', 'straight']);
});

test('every authored route and bridge answer is still reachable through direct graph controls', () => {
  for (const activity of all.filter(a => a.kind === 'network' || a.kind === 'route')) {
    let response = session.createSession(activity).response;
    const answer = authoringSolutions[activity.id];
    if (activity.kind === 'route') for (const id of answer.edgeIds) response = edit.walkEdge(activity, response, id);
    else for (const edge of activity.graph.edges) {
      for (let n = 0; n < 3 && response.counts[edge.id] !== answer.counts[edge.id]; n++) response = edit.cycleBridge(activity, response, edge.id);
    }
    assert.equal(evaluateActivity(activity, response).status, 'correct', activity.id);
  }
});

test('parallel lanes stay visibly separated, reverse travel stays on that lane, and arrows clear the controls', () => {
  for (const activity of all.filter(a => a.kind === 'route')) {
    for (const edge of activity.graph.edges.filter(e => e.curve)) {
      const forward = edit.connectionGeometry(activity.graph, edge);
      const reverse = edit.connectionGeometry(activity.graph, edge, 0, true);
      assert.ok(Math.hypot(forward.mid.x - reverse.mid.x, forward.mid.y - reverse.mid.y) < 1e-8);
      assert.deepEqual(forward.control, reverse.control);
      assert.deepEqual(forward.start, reverse.end);
      const straight = edit.connectionGeometry(activity.graph, { ...edge, curve: 0 });
      // At 300px map width and 280px height, distinct midpoint controls must not overlap.
      assert.ok(Math.hypot((forward.mid.x - straight.mid.x) * .5, (forward.mid.y - straight.mid.y) * 280 / 340) > 34, activity.id);
      assert.ok(Math.hypot((forward.arrow.x - forward.mid.x) * .5, (forward.arrow.y - forward.mid.y) * 280 / 340) > 22, activity.id);
      assert.ok(forward.mid.x > 20 && forward.mid.x < 580 && forward.mid.y > 16 && forward.mid.y < 324, activity.id);
    }
  }
});
