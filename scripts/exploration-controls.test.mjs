import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  appType: 'custom',
  server: { middlewareMode: true, watch: null, ws: false },
  esbuild: { jsx: 'automatic' },
  optimizeDeps: { noDiscovery: true },
  logLevel: 'error',
});
after(() => server.close());
const [{ AdvancedInteraction }, { activitySets }, { createSession, transitionSession }] = await Promise.all([
  server.ssrLoadModule('/src/interactions/AdvancedInteraction.tsx'),
  server.ssrLoadModule('/src/curriculum/catalog.ts'),
  server.ssrLoadModule('/src/engine/activity-session.ts'),
]);
const rounds = activitySets.flatMap(group => group.rounds);
const singleChoices = rounds.filter(round => round.kind === 'singleChoice');

function choicesHtml(activity) {
  return renderToStaticMarkup(createElement(AdvancedInteraction, {
    activity, response: { kind: 'singleChoice', tokenId: null }, disabled: false,
    onChange() {}, onPreviewToken() {},
  }));
}

test('each ordinary picture option has its own zoom control, including generated diagrams', () => {
  for (const activity of singleChoices) {
    const html = choicesHtml(activity);
    const pictures = activity.tokens.filter(t => !t.textOnly && !t.quantityPicture && !t.partitionCounts && !t.moneyValues);
    assert.equal((html.match(/class="picture-peek"/g) ?? []).length, pictures.length, activity.id);
    for (const token of pictures) assert.ok(html.includes(`aria-label="看大图：${token.label}"`), activity.id + '/' + token.id);
  }
});

test('character recognition exposes the printed characters and listening gives each option a distinct position', () => {
  for (const activity of singleChoices.filter(a => a.primaryFamilyId === 'E05')) {
    const options = choicesHtml(activity).match(/<button\b[^>]*aria-pressed="false"[^>]*>/g) ?? [];
    const labels = options.map(button => button.match(/aria-label="([^"]+)"/)?.[1]);
    assert.deepEqual(labels, activity.tokens.map((t, i) =>
      activity.stage === 1 ? t.label : `第 ${i + 1} 张字卡`), activity.id);
  }
});

test('one undo reverts the entire fill and preserves previously painted and explicitly blank cells', () => {
  const activity = rounds.find(a => a.id === 'explore-grid-copy-reconstruction-4');
  let state = createSession(activity);
  state = transitionSession(activity, state, { type: 'place', slotId: 'cell-0', tokenId: 'filled' });
  state = transitionSession(activity, state, { type: 'place', slotId: 'cell-2', tokenId: 'blank' });
  const filled = transitionSession(activity, state, { type: 'fillBlanks' });
  assert.equal(filled.history.length, state.history.length + 1);
  assert.equal(filled.response.cells['cell-0'].tokenId, 'filled');
  assert.equal(Object.values(filled.response.cells).filter(cell => cell.tokenId === 'blank').length, 15);
  assert.equal(transitionSession(activity, filled, { type: 'fillBlanks' }), filled);
  const undone = transitionSession(activity, filled, { type: 'undo' });
  assert.deepEqual(undone.response, state.response);
  assert.deepEqual(undone.history, state.history);
});
