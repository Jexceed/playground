import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadGameData } from './lib/load-game-data.mjs';

const { games } = await loadGameData();
const group = id => games.find(game => game.id === id);
const round = (id, number) => group(id).rounds[number - 1];
// Bundle React imports as well: the data-URL module is intentionally independent
// of a temporary filesystem location and can render the real token component.
const compiled = await build({
  configFile: false, publicDir: false, logLevel: 'silent',
  ssr: { noExternal: true },
  build: { ssr: resolve('src/components/VisualToken.tsx'), write: false,
    rollupOptions: { output: { format: 'es', inlineDynamicImports: true } } },
});
const code = compiled.output.find(output => output.type === 'chunk').code;
const { VisualToken, visualMetaFor, visualParts } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

test('review corrections preserve every enlightenment identity and correct answer', () => {
  const baseline = JSON.parse(readFileSync('specs/043-curriculum-review-fixes/verification/baseline.json', 'utf8'));
  assert.equal(games.length, 40);
  assert.equal(games.reduce((count, game) => count + game.rounds.length, 0), 489);
  assert.deepEqual(games.map(game => [game.id, game.rounds.map(item => [item.id, item.answer])]),
    baseline.games.map(game => [game.id, game.rounds.map(item => [item.id, item.answer])]));
});

test('matrix examples and all answer options render both constituent pictures', () => {
  const r = round('logic-matrix-puzzle', 6);
  const pairs = new Map([
    ['小鸟天空', ['小鸟', '天空']], ['小鱼小河', ['小鱼', '小河']],
    ['小狗家', ['小狗', '家']], ['小河小狗', ['小河', '小狗']], ['天空家', ['天空', '家']],
  ]);
  assert.deepEqual(new Set(r.choices.map(choice => choice.value)), new Set(['小狗家', '小河小狗', '天空家']));
  for (const [value, expected] of pairs) {
    assert.deepEqual(visualParts(value), expected, value);
    const markup = renderToStaticMarkup(VisualToken({ value }));
    const drawn = [...markup.matchAll(/data-visual-kind="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(drawn, expected.map(part => visualMetaFor(part).kind), value);
    assert.match(markup, /visual-token-multi/, value);
  }
  assert.deepEqual(visualParts(r.answer), r.matrix.cells[2].slice(0, 2));
});

test('two-condition sorter distractors each violate just one different condition', () => {
  const features = new Map([
    ['🔴', ['red', 'circle']], ['🔵', ['blue', 'circle']], ['🟢', ['green', 'circle']],
    ['🟡', ['yellow', 'circle']], ['🟦', ['blue', 'square']], ['🟥', ['red', 'square']], ['🟨', ['yellow', 'square']],
  ]);
  for (const r of group('logic-sorter-switch').rounds.slice(8)) {
    const target = features.get(r.answer);
    const candidates = r.choices.map(choice => features.get(choice.value));
    assert.deepEqual(candidates.map(candidate => candidate.map((value, index) => value === target[index]).filter(Boolean).length).sort(), [1, 1, 2], r.id);
    for (let feature = 0; feature < 2; feature++) {
      assert.equal(candidates.filter(candidate => candidate[feature] === target[feature]).length, 2, r.id);
    }
    for (const value of r.visualGroups[0].items) assert.ok(visualMetaFor(value), `${r.id}: ${value}`);
  }
});

test('rotation sequences independently follow their direction without a contradictory backdrop', () => {
  const directions = ['上面', '右边', '下面', '左边'];
  for (const [index, r] of group('logic-rotation-direction').rounds.entries()) {
    assert.equal(r.sceneImage, undefined, r.id);
    const values = [...r.sequence.slice(0, -1), r.answer];
    if (index < 8) {
      const step = index < 4 ? 1 : -1;
      for (let i = 1; i < values.length; i++) {
        assert.equal(directions.indexOf(values[i]), (directions.indexOf(values[i - 1]) + step + 4) % 4, r.id);
      }
    } else {
      for (let i = 2; i < values.length; i++) assert.equal(values[i], values[i - 2], r.id);
    }
  }
});

test('sorting tasks expose a sorting goal and the failed plan shows the mixed state', () => {
  for (const [id, number] of [['logic-condition-detective', 6], ['logic-fix-plan', 6], ['logic-priority-choice', 4]]) {
    const r = round(id, number);
    assert.match(r.prompt, /分开放/);
    assert.match(r.prompt, /下次好找/);
    assert.equal(r.answer, 'sort');
  }
  const failed = round('logic-fix-plan', 6);
  assert.ok(failed.sequence.includes('混在一个盒子'));
  assert.ok(!failed.sequence.includes('整齐'));
  const mixed = renderToStaticMarkup(VisualToken({ value: '混在一个盒子' }));
  const sorted = renderToStaticMarkup(VisualToken({ value: '分类装好' }));
  assert.match(mixed, /block\.png/);
  assert.match(mixed, /toy-car\.png/);
  assert.equal([...mixed.matchAll(/data-storage-box="mixed"/g)].length, 1);
  assert.equal([...sorted.matchAll(/data-storage-box="classified"/g)].length, 2);
  assert.match(sorted, /block\.png/);
  assert.match(sorted, /toy-car\.png/);
  assert.doesNotMatch(sorted, /tidy-box\.png/);
});

test('replacement distractors remain illustrated, related steps without the reviewed absurd options', () => {
  const targets = [
    ...[7, 19, 20, 21, 24].map(number => round('logic-order-plan', number)),
    round('logic-fix-plan', 12), round('logic-priority-choice', 11), round('logic-priority-choice', 2),
  ];
  for (const r of targets) {
    assert.equal(r.choices.filter(choice => choice.value === r.answer).length, 1, r.id);
    for (const choice of r.choices) {
      assert.doesNotMatch(choice.label, /重新弄乱|闭眼|拍手|先拿饼干|先看书包/, r.id);
      assert.ok(visualMetaFor(choice.label), `${r.id}: ${choice.label} needs a visual cue`);
    }
  }
  for (const number of [19, 20]) assert.match(round('logic-order-plan', number).prompt, /大人/);
});

test('the bridge repair states the model, destination, usable material, and visible target', () => {
  const r = round('logic-fix-plan', 7);
  assert.match(r.prompt, /桌面模型/);
  assert.match(r.prompt, /玩具兔/);
  assert.match(r.prompt, /对岸.*胡萝卜/);
  assert.match(r.prompt, /够长.*木板/);
  assert.equal(r.sequence[0], '小兔');
  assert.equal(r.sequence.at(-1), '🥕');
  assert.ok(r.visualGroups.some(group => group.items.includes('长木板')));
});
