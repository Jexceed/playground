import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { loadGameData } from './lib/load-game-data.mjs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const baseline = JSON.parse(readFileSync('specs/044-drinking-sequence-story/verification/baseline.json'));
const current = JSON.parse(JSON.stringify(await loadGameData()));
const { orderStorySteps, drinkingImage } = await loadTypeScriptModule('src/data/orderStories.ts');
const { imageGallery } = await loadTypeScriptModule('src/data/imageGallery.ts');
const ids = ['logic-order-plan-1', 'logic-order-plan-9', 'logic-order-plan-18'];
const rounds = current.games.flatMap(game => game.rounds).filter(round => ids.includes(round.id));
const omit = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));

test('drinking answers stay exact through the authorized 045 story-surface completion', () => {
  assert.deepEqual(rounds.map(round => round.id), ids);
  assert.deepEqual(current.activitySets, baseline.activitySets);
  for (const [i, game] of current.games.entries()) {
    assert.deepEqual(omit(game, ['rounds']), omit(baseline.games[i], ['rounds']));
    for (const [j, round] of game.rounds.entries()) {
      const allowed = round.id.startsWith('logic-order-plan-') ? ['instruction','sceneImage','sequenceStory'] : [];
      assert.deepEqual(omit(round, allowed), omit(baseline.games[i].rounds[j], allowed), round.id);
    }
  }
});

test('unanswered and wrong states keep the only blank and never expose its answer picture', () => {
  for (const round of rounds) {
    const steps = orderStorySteps(round, false);
    assert.equal(steps.filter(step => step.missing).length, 1);
    assert.equal(steps.find(step => step.missing).image, undefined);
    assert.equal(steps.some(step => step.filled), false);
  }
});

test('success fills the real blank with the correct distinct action, preserving the sequence', () => {
  const expected = [
    ['口渴','先拿杯子','倒水','喝水'],
    ['小朋友','先拿杯子','先倒水','喝水'],
    ['杯子','先倒水','喝水'],
  ];
  rounds.forEach((round, index) => {
    const steps = orderStorySteps(round, true);
    assert.deepEqual(steps.map(step => step.label), expected[index]);
    assert.equal(steps.filter(step => step.filled).length, 1);
    assert.ok(steps.every(step => !step.missing && step.image));
    assert.equal(steps[round.sequence.indexOf('?')].image.src,
      index === 0 ? imageGallery.items.drinkingTakeCup.src : imageGallery.items.drinkingPour.src);
  });
  assert.equal(new Set(orderStorySteps(rounds[0], true).map(step => step.image.src)).size, 4);
});

test('registered scenes have different initial facts and exact scene dimensions', async () => {
  assert.deepEqual(rounds[0].sceneImage, imageGallery.scenes.drinkingThirsty);
  assert.deepEqual(rounds[1].sceneImage, imageGallery.scenes.drinkingEmptyCup);
  assert.deepEqual(rounds[2].sceneImage, imageGallery.scenes.drinkingEmptyCup);
  for (const scene of [imageGallery.scenes.drinkingThirsty, imageGallery.scenes.drinkingEmptyCup]) {
    const metadata = await sharp('public' + scene.src).metadata();
    assert.deepEqual([metadata.width, metadata.height, metadata.format], [1200,675,'png']);
  }
});

test('all four action images are local, distinct readable PNGs with retained generation source', async () => {
  const images = orderStorySteps(rounds[0], true).map(step => step.image);
  const hashes = [];
  for (const image of images) {
    const bytes = readFileSync('public' + image.src);
    hashes.push(createHash('sha256').update(bytes).digest('hex'));
    const metadata = await sharp(bytes).metadata();
    assert.deepEqual([metadata.width,metadata.height,metadata.format], [600,600,'png']);
  }
  assert.equal(new Set(hashes).size, 4);
  assert.ok(readFileSync('public/images/items/source/drinking-actions.png').length > 1000);
});

test('every water-task option is illustrated equally, including both empty-cup distractors', () => {
  for (const round of rounds) {
    const images = round.choices.map(choice => drinkingImage(choice.label));
    assert.ok(images.every(Boolean), round.id);
    assert.equal(new Set(images.map(image => image.src)).size, 3);
    for (const image of images) assert.ok(readFileSync('public' + image.src).length > 1000);
  }
});
