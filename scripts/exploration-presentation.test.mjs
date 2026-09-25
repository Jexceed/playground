import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { collectIllustrationUsage } from './lib/illustration-usage.mjs';

const [{ explorationSets, authoringSolutions }, { evaluateActivity }, { imageGallery }, { evidenceVisible }, { groupExplorationGames }, { getCurriculumSection }] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'), loadTypeScriptModule('src/domain/activity-evaluation.ts'),
  loadTypeScriptModule('src/data/imageGallery.ts'), loadTypeScriptModule('src/interactions/presentation-state.ts'),
  loadTypeScriptModule('src/curriculum/exploration/navigation.ts'), loadTypeScriptModule('src/curriculum/catalog.ts'),
]);
const activities = explorationSets.flatMap(g => g.rounds);

test('presentation retains all existing curriculum identities and accepts every authored answer', () => {
  assert.equal(activities.length, 597);
  assert.equal(getCurriculumSection('enlightenment').games.length, 40);
  assert.equal(getCurriculumSection('enlightenment').games.reduce((n, g) => n + g.rounds.length, 0), 489);
  for (const a of activities) {
    const revised = (['N13','G04','G09'].includes(a.primaryFamilyId) && a.stage === 3)
      || (a.primaryFamilyId === 'L05' && a.stage === 2)
      || (['G07','G15'].includes(a.primaryFamilyId) && a.stage > 1)
      || (a.primaryFamilyId === 'L06' && /-(1|4|7)$/.test(a.id));
    assert.equal(a.revision, revised ? 2 : 1, a.id);
    assert.equal(evaluateActivity(a, authoringSolutions[a.id]).status, a.kind === 'parentObservation' ? 'needsParentObservation' : 'correct', a.id);
  }
});

test('story and natural-change ordering cards use individually addressed illustrations', () => {
  for (const a of activities.filter(a => ['E03','P02','L06'].includes(a.primaryFamilyId) && a.kind === 'orderedPlacement')) {
    for (const token of a.tokens) {
      assert.ok(token.image.frame, a.id + ': ' + token.label);
      assert.equal(token.textOnly, false);
    }
  }
});

test('planting and fruit stories use their own coherent atlas through every event and reference', () => {
  const src = name => `/images/items/exploration-art/${name}.png`;
  for (const a of activities.filter(a => a.primaryFamilyId === 'L06')) {
    const round = Number(a.id.split('-').at(-1));
    const expected = ['planting-steps', 'painting-steps', 'fruit-salad-steps'][(round - 1) % 3];
    const tokens = [...a.tokens].sort((x,y) => Number(x.id.slice(4)) - Number(y.id.slice(4)));
    assert.ok(tokens.every(t => t.image.src === src(expected)), a.id);
    assert.deepEqual(tokens.map(t => t.image.frame.index), a.stage === 1 ? [0,1,2] : [0,1,2,3], a.id);
    if (a.stage === 3) {
      assert.ok(a.presentation.evidence.cards.every(i => i.src === src(expected)), a.id);
      assert.deepEqual(a.presentation.evidence.cards.map(i => i.frame.index), [3,2,1,0], a.id);
    }
  }
  const memory = activities.find(a => a.primaryFamilyId === 'A05' && a.id.endsWith('-6'));
  assert.deepEqual([...memory.tokens].sort((a,b)=>a.id.localeCompare(b.id)).map(t=>[t.image.src,t.image.frame.index]), [1,2,3].map(i=>[src('planting-steps'),i]));
  const story = activities.find(a => a.primaryFamilyId === 'E03' && a.id.endsWith('-9'));
  assert.ok(story.presentation.storyCards.every(i => i.src === src('cat-plant-story')));
});

test('all registered illustration frames reach a renderable activity surface', () => {
  const usage = collectIllustrationUsage(explorationSets, imageGallery);
  assert.equal(usage.atlasCount, 11);
  assert.equal(usage.registeredFrameCount, 44);
  assert.deepEqual(usage.problems, []);
  assert.deepEqual(usage.unusedFrames, [], 'an on-disk atlas alone is not complete integration');
});

test('concrete household pictures cannot be hidden by the text-only flag', () => {
  for (const a of activities.filter(a => a.primaryFamilyId === 'P01' && a.kind === 'matching'))
    for (const id of a.leftIds) {
      const token = a.tokens.find(t => t.id === id);
      assert.equal(token.textOnly, false, token.label);
      assert.ok(!token.image.src.includes('/exploration/diagram-'), token.label);
    }
});

test('floating experiment preparations show the specified materials, not plastic bricks or cardboard', () => {
  const activity = activities.find(a => a.primaryFamilyId === 'P03');
  const cards = activity.presentation.materialCards, images = cards.map(c => c.image);
  assert.deepEqual(cards.map(c => c.label), activity.materials);
  assert.deepEqual(images.map(i => i.alt).sort(), ['木块','塑料盒','金属勺','一盆浅水','毛巾'].sort());
  assert.ok(images.every(i => i.src !== imageGallery.items.block.src && i.src !== imageGallery.items.box.src));
});

test('quantity-story evidence contains only the known counts and exactly one unknown', () => {
  for (const a of activities.filter(a => a.primaryFamilyId === 'N06')) {
    const parts = a.presentation.evidence.parts;
    assert.equal(parts.filter(p => p.count === null).length, 1);
    assert.equal(parts.find(p => p.count === null).label, ['现在', '原来', '飞来了'][a.stage - 1]);
  }
});

test('memory evidence is visible only during observation', () => {
  const memory = { protocol: { kind: 'memory' } }, practice = { protocol: { kind: 'practice' } };
  for (const phase of ['ready', 'retain', 'respond', 'complete']) assert.equal(evidenceVisible(memory, phase), false);
  assert.equal(evidenceVisible(memory, 'observe'), true);
  assert.equal(evidenceVisible(practice, 'respond'), true);
  for (const a of activities.filter(a => a.primaryFamilyId === 'A09'))
    for (const id of a.protocol.preview) assert.ok(a.tokens.find(t => t.id === id).quantityPicture?.image);
});

test('topic grouping preserves each entry once and keeps navigation IDs stable', () => {
  const games = getCurriculumSection('exploration').games;
  const flattened = groupExplorationGames(games).flatMap(g => g.games.map(g => g.id));
  assert.deepEqual([...flattened].sort(), games.map(g => g.id).sort());
  assert.equal(new Set(flattened).size, 75);
});

test('every illustrated frame is registered and has a complete local PNG source', () => {
  const frames = Object.values(imageGallery.items).filter(image => image.frame);
  assert.equal(frames.length, 44);
  const sources = new Set();
  for (const image of frames) {
    assert.ok(image.frame.index >= 0 && image.frame.index < image.frame.columns * image.frame.rows);
    const file = 'public' + image.src;
    assert.ok(existsSync(file), file);
    const data = readFileSync(file);
    assert.equal(data.readUInt32BE(16), data.readUInt32BE(20), file + ' is square');
    assert.ok(data.readUInt32BE(16) >= 1024);
    assert.ok(existsSync(file.replace(/\/([^/]+)\.png$/, '/source/$1-source.png')));
    sources.add(image.src);
  }
  assert.equal(sources.size, 11);
});
