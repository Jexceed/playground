// Read-only check recovered from the 2026-11-14 review. Run from any directory.
// This checks current source models and stored SVGs, not native window layout.
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';
import { renderExplorationSvg } from '../../../scripts/lib/exploration-renderer.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

process.chdir(fileURLToPath(new URL('../../../', import.meta.url)));
const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const groups = explorationSets.filter(group => /^N0[1-8]$/.test(group.rounds[0].primaryFamilyId));
const issues = [];
let assertions = 0;
let checkedImageReferences = 0;
const checkedImages = new Set();
const diagnostic = value => typeof value === 'string' && value.length > 1000 ? `${value.slice(0, 160)}… (${value.length} characters)` : value;
const eq = (actual, expected, label) => {
  assertions++;
  try { assert.deepEqual(actual, expected); }
  catch { issues.push({ label, actual: diagnostic(actual), expected: diagnostic(expected) }); }
};
const drawing = image => explorationDrawings[image.src.split('/').at(-1).replace('.png', '')];
const uri = path => 'data:image/png;base64,' + readFileSync(path).toString('base64');
const discUris = Object.fromEntries([
  ['#548cb3', 'blue'], ['#db675e', 'red'], ['#e8b64e', 'yellow'], ['#76a784', 'green'],
].map(([color, name]) => [color, uri(`public/images/items/pattern-train/${name}-disc.png`)]));

for (const group of groups) for (const activity of group.rounds) {
  const family = activity.primaryFamilyId;
  const evidence = activity.presentation?.evidence;
  const answer = Number(activity.tokens.find(token => token.id === activity.answerId)?.label);
  const check = (actual, expected, label) => eq(actual, expected, `${activity.id}: ${label}`);

  if (family === 'N01')
    check(answer, drawing(activity.illustration).objects.filter(object => object.kind === 'circle').length, 'visible dot count');

  if (family === 'N02') {
    const [left, right] = evidence.panels.map(panel => panel.count);
    check(answer, /移几个/.test(activity.prompt) ? (right - left) / 2 : right - left, 'add/transfer operation');
  }

  if (family === 'N03') {
    if (activity.stage < 3) {
      check(evidence.panels[0].count, evidence.panels[1].count, 'conserved counts');
      check(answer, evidence.panels[0].count, 'unchanged amount');
    } else {
      check(evidence.smallCups, Number(activity.clues[1].match(/\d+/)[0]), 'water given amount');
      check(answer, evidence.smallCups, 'conserved water');
    }
  }

  if (family === 'N04') {
    const total = Number(activity.prompt.match(/\d+/)[0]);
    for (const token of activity.tokens) {
      const { left, right } = token.partitionCounts;
      check(token.label, `左${left}右${right}`, 'partition label');
      check(activity.expectedTokenIds.includes(token.id),
        left + right === total && (activity.stage === 1 || left > 0 && right > 0) && (activity.stage < 3 || left < right),
        'valid partition');
    }
  }

  if (family === 'N05') {
    if (activity.stage === 1) {
      const model = drawing(activity.illustration);
      check(model.objects.filter(object => object.kind === 'rect').length, 10, 'ten frame size');
      check(answer, 10 - model.objects.filter(object => object.kind === 'text' && object.text === '●').length, 'ten frame missing dots');
    } else {
      const [firstNumber, secondNumber] = activity.prompt.match(/\d+/g).map(Number);
      const [first, second] = evidence.panels;
      check(first.tens * 10 + first.ones, firstNumber, 'left initial quantity');
      check(second.count, secondNumber, 'added/removed quantity');
      check(second.label, `${activity.stage === 2 ? '再加' : '拿走'}${secondNumber}`, 'operation label');
      check(answer, activity.stage === 2 ? firstNumber + secondNumber : firstNumber - secondNumber, 'arithmetic result');
    }
  }

  if (family === 'N06') {
    const numbers = activity.prompt.match(/\d+/g).map(Number);
    const [start, change, end] = evidence.parts.map(part => part.count);
    check(evidence.parts.filter(part => part.count === null).length, 1, 'single unknown');
    check([start, change, end].indexOf(null), [2, 0, 1][activity.stage - 1], 'unknown slot');
    check([start, change, end].filter(value => value !== null), numbers, 'given quantities');
    check(answer, activity.stage === 1 ? start + change : activity.stage === 2 ? end - change : end - start, 'story result');
  }

  if (family === 'N07') {
    const numbers = activity.prompt.match(/\d+/g).map(Number);
    if (activity.stage === 1) {
      check([evidence.total, evidence.people], numbers, 'cookies and recipients');
      check(answer, evidence.total / evidence.people, 'equal shares');
    } else if (activity.stage === 2) {
      check([evidence.each, evidence.groups], numbers, 'per box and box count');
      check(answer, evidence.each * evidence.groups, 'total');
    } else {
      check([evidence.total, evidence.capacity], numbers, 'stock and capacity');
      check(answer, evidence.total % evidence.capacity, 'remainder');
    }
  }

  if (family === 'N08') {
    const proportion = image => {
      const rectangles = drawing(image).objects.filter(object => object.kind === 'rect');
      const areas = rectangles.map(object => object.w * object.h);
      check(new Set(areas.map(area => Math.round(area * 1e6))).size, 1, 'equal subdivisions');
      return rectangles.filter(object => object.fill === '#c4dacb').length / rectangles.length;
    };
    const initial = proportion(activity.illustration);
    const matches = activity.tokens.filter(token => Math.abs(proportion(token.image) - initial) < 1e-9).map(token => token.id);
    check(matches, [activity.answerId], 'unique same fraction');
  }

  const visibleDiagrams = [
    ...(!evidence && activity.illustration ? [activity.illustration] : []),
    ...activity.tokens.filter(token => !token.textOnly && !token.partitionCounts).map(token => token.image),
  ];
  for (const image of visibleDiagrams) {
    if (!image.src.includes('/exploration/diagram-')) continue;
    const id = image.src.split('/').at(-1).replace('.png', '');
    const source = `public/images/items/exploration/source/${id}.svg`;
    check(existsSync('public' + image.src), true, 'runtime png exists');
    check(readFileSync(source, 'utf8'), renderExplorationSvg(drawing(image), { discUris }), 'stored svg matches drawing');
    checkedImageReferences++;
    checkedImages.add(image.src);
  }
}

const result = {
  reviewDate: '2026-11-14',
  scope: 'Current source and stored SVG semantics; no native-window or audio acceptance',
  groups: groups.map(group => ({ family: group.rounds[0].primaryFamilyId, title: group.title, rounds: group.rounds.length })),
  assertions,
  checkedImageReferences,
  distinctCheckedImages: checkedImages.size,
  issues,
};
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exitCode = 1;
