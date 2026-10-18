import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { build } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [{ games }, { logicChoicePictureFor, logicBridgeChoiceFor, logicBridgeDiagramLayout, LOGIC_BRIDGE_UNIT }, { enlightenmentBridgeModels }] = await Promise.all([
  loadGameData(),
  loadTypeScriptModule('src/domain/logic-choice-picture.ts'),
  loadTypeScriptModule('src/data/enlightenmentBridges.ts'),
]);
const group = id => games.find(game => game.id === id);

test('quantity pictures preserve the counted object and every candidate quantity', () => {
  const game = group('logic-balance-swap');
  for (const round of game.rounds.slice(0, 8)) {
    for (const choice of round.choices) {
      const picture = logicChoicePictureFor(game.id, round, choice);
      assert.equal(picture.kind, 'quantity', round.id);
      assert.equal(picture.count, Number(choice.label.match(/^\d+/)[0]));
      assert.ok(choice.label.endsWith(picture.item));
    }
  }
  // A comparison label is not a request for a fruit count.
  assert.equal(logicChoicePictureFor(game.id, game.rounds[8], game.rounds[8].choices[0]), null);
});

test('height candidates preserve all columns and their order, including distractors', () => {
  const game = group('logic-three-view-blocks');
  for (const round of game.rounds.slice(6)) {
    for (const choice of round.choices) {
      const picture = logicChoicePictureFor(game.id, round, choice);
      assert.equal(picture.kind, 'height-profile');
      assert.deepEqual(picture.heights, choice.label.split(/和|、/).map(Number));
    }
    const cells = round.grid.cells.map(row => row.map(Number));
    const front = round.prompt.includes('前面');
    const expected = front ? cells[0].map((_, column) => Math.max(...cells.map(row => row[column]))) : cells.map(row => Math.max(...row));
    const correct = logicChoicePictureFor(game.id, round, round.choices.find(choice => choice.value === round.answer));
    assert.deepEqual(correct.heights, expected, round.id);
  }
  assert.equal(logicChoicePictureFor(game.id, game.rounds[0], game.rounds[0].choices[0]), null);
});

test('left middle right pictures refer to the actual corresponding sample card', () => {
  const game = group('logic-visual-match');
  for (const round of game.rounds.slice(6)) for (const choice of round.choices) {
    const picture = logicChoicePictureFor(game.id, round, choice);
    assert.equal(picture.kind, 'ordered-card');
    assert.equal(picture.value, round.visualGroups[0].items[{ left: 0, middle: 1, right: 2 }[choice.value]]);
  }
});

test('basket shape labels do not introduce a color rule', () => {
  const game = group('logic-sorter-switch');
  for (const round of game.rounds.slice(0, 8)) for (const choice of round.choices) {
    const picture = logicChoicePictureFor(game.id, round, choice);
    assert.equal(picture.kind, 'basket');
    if (choice.value === '圆形篮子' || choice.value === '方形篮子') {
      assert.equal(picture.marker, choice.value === '圆形篮子' ? 'circle' : 'square');
      assert.equal(picture.color, undefined);
    } else {
      assert.equal(picture.marker, 'color');
      assert.match(picture.color, /^#[\da-f]{6}$/i);
    }
  }
  for (const round of game.rounds.slice(8)) for (const choice of round.choices) assert.equal(logicChoicePictureFor(game.id, round, choice), null);
});

function coversEachSupportedGap(picture) {
  const stops = [0, ...picture.supports, picture.width];
  return stops.slice(1).every((end, index) => picture.planks.some(piece => !piece.onShore && piece.start <= stops[index] && piece.start + piece.length >= end));
}

test('every bridge candidate has a diagram using only its real plank lengths', () => {
  const game = group('logic-space-bridge');
  for (const [index, round] of game.rounds.entries()) for (const choice of round.choices) {
    const picture = logicBridgeChoiceFor(round, choice);
    assert.ok(picture, round.id + '/' + choice.value);
    assert.equal(picture.width, enlightenmentBridgeModels[index].width);
    assert.deepEqual(picture.supports, enlightenmentBridgeModels[index].supports);
    for (const piece of picture.planks) assert.ok(enlightenmentBridgeModels[index].lengths.includes(piece.length));
  }
});

test('bridge distractors remain impossible at the actual river gaps and supports', () => {
  const game = group('logic-space-bridge');
  for (const round of game.rounds.slice(1)) {
    const valid = round.choices.filter(choice => coversEachSupportedGap(logicBridgeChoiceFor(round, choice))).map(choice => choice.value);
    assert.deepEqual(valid, [round.answer], round.id);
  }
  const last = game.rounds[7];
  const reversed = logicBridgeChoiceFor(last, last.choices.find(choice => choice.value === 'reversed'));
  assert.equal(reversed.planks[1].start, 3);
  assert.equal(reversed.planks[1].start + reversed.planks[1].length, 7);
  assert.equal(reversed.width, 8);
});

test('the initial bridge question depicts distinct measured endpoints', () => {
  const round = group('logic-space-bridge').rounds[0];
  assert.deepEqual(new Set(round.choices.map(choice => logicBridgeChoiceFor(round, choice).measure)), new Set(['bear-plank', 'plank-flag', 'banks']));
});

test('picture helpers do not use answer identity or affect unrelated games', () => {
  for (const id of ['logic-balance-swap', 'logic-three-view-blocks', 'logic-visual-match', 'logic-sorter-switch']) {
    const game = group(id);
    for (const round of game.rounds) for (const choice of round.choices) assert.deepEqual(logicChoicePictureFor(id, { ...round, answer: 'not-a-choice' }, choice), logicChoicePictureFor(id, round, choice));
  }
  const round = group('logic-space-bridge').rounds[7];
  for (const choice of round.choices) assert.deepEqual(logicBridgeChoiceFor({ ...round, answer: 'not-a-choice' }, choice), logicBridgeChoiceFor(round, choice));
  const ordinary = group('logic-route-steps').rounds[0];
  assert.equal(logicChoicePictureFor('logic-route-steps', ordinary, ordinary.choices[0]), null);
  assert.equal(logicBridgeChoiceFor(ordinary, ordinary.choices[0]), null);
});

test('life inventory and river share the same unit, viewport, and unclipped bounds', () => {
  const model = { width: 4, supports: [], planks: [], inventory: [5, 2] };
  const before = JSON.stringify(model);
  const layout = logicBridgeDiagramLayout(model);
  assert.equal(layout.riverWidth / model.width, LOGIC_BRIDGE_UNIT);
  assert.equal(layout.inventory[0].width / layout.riverWidth, 5 / 4);
  assert.equal(layout.inventory[1].width / layout.riverWidth, 2 / 4);
  assert.equal(layout.planks.length, 0, 'available wood must not already span the river');
  for (const piece of layout.inventory) {
    assert.equal(piece.width, piece.length * LOGIC_BRIDGE_UNIT);
    assert.ok(piece.y >= 172, 'inventory belongs below the river, not on it');
    assert.ok(piece.x >= 0 && piece.x + piece.width <= layout.width);
    assert.ok(piece.y + piece.height <= layout.height);
  }
  assert.equal(JSON.stringify(model), before);
});

test('all bridge candidate wood has exact lengths and stays within its SVG viewport', () => {
  for (const round of group('logic-space-bridge').rounds) for (const choice of round.choices) {
    const model = logicBridgeChoiceFor(round, choice);
    const layout = logicBridgeDiagramLayout(model);
    assert.equal(layout.height, 172, 'ordinary candidate layout remains compact');
    for (const piece of layout.planks) {
      assert.equal(piece.width, piece.length * layout.unit);
      assert.ok(piece.x >= 0 && piece.x + piece.width <= layout.width, round.id);
      assert.ok(piece.y >= 0 && piece.y + piece.height <= layout.height, round.id);
    }
  }
});

test('the rendered life inventory is inside the river SVG and retains exact lengths', async () => {
  const result = await build({ configFile: false, publicDir: false, logLevel: 'silent', ssr: { noExternal: true }, build: {
    ssr: resolve('src/components/LogicBridgeChoice.tsx'), write: false, minify: false,
    rollupOptions: { output: { format: 'es', inlineDynamicImports: true } },
  } });
  const component = await import('data:text/javascript;base64,' + Buffer.from(result.output.find(output => output.type === 'chunk').code).toString('base64'));
  const html = renderToStaticMarkup(createElement(component.LogicBridgeDiagram, { model: { width: 4, supports: [], planks: [], inventory: [5, 2] } }));
  assert.equal((html.match(/<svg/g) ?? []).length, 1);
  assert.match(html, /viewBox="0 0 320 258"/);
  assert.match(html, /data-river-units="4"/);
  assert.match(html, /<rect x="100" y="182" width="100" height="18"/);
  assert.match(html, /<rect x="100" y="220" width="40" height="18"/);
  assert.equal((html.match(/data-plank-units=/g) ?? []).length, 0);
});
