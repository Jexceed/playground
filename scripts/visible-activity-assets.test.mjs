import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const { activityImageSources } = await loadTypeScriptModule('src/domain/activity-assets.ts');
const { catalogGames } = await loadTypeScriptModule('src/curriculum/catalog.ts');
const { imageGallery } = await loadTypeScriptModule('src/data/imageGallery.ts');
const group = id => catalogGames.find(g => g.id === id);

test('native clock rounds cannot be blocked by unused bitmap references', () => {
  for (const round of group('explore-time-elapsed').rounds) {
    assert.deepEqual(activityImageSources(round), []);
    const stale = structuredClone(round);
    stale.illustration.src = '/missing-old-clock.png';
    stale.tokens.forEach(t => { t.image.src = '/missing-old-number.png'; });
    assert.deepEqual(activityImageSources(stale), []);
  }
});
test('real picture evidence and illustrated choices remain required', () => {
  const round = structuredClone(group('explore-counting-cardinality').rounds[0]);
  assert.ok(activityImageSources(round).includes(round.illustration.src));
  round.tokens[0].textOnly = false;
  assert.ok(activityImageSources(round).includes(round.tokens[0].image.src));
});
test('models preload the images they actually render, including specialized tokens', () => {
  const required = [
    ['explore-number-conservation', 6, [imageGallery.items.mathWaterTall.src, imageGallery.items.mathWaterWide.src]],
    ['explore-number-partitions', 0, [imageGallery.items.patternBlueDisc.src]],
    ['explore-group-share', 0, [imageGallery.items.cookie.src, imageGallery.items.child.src, imageGallery.items.plate.src]],
    ['explore-money-shopping', 3, [imageGallery.items.book.src, imageGallery.items.mathPlayNote.src]],
    ['explore-quantity-stories', 0, [imageGallery.items.bird.src]],
    ['explore-ordinal-queue', 0, [imageGallery.characters.rabbit.src]],
  ];
  for (const [id, i, images] of required) for (const image of images)
    assert.ok(activityImageSources(group(id).rounds[i]).includes(image), `${id}: ${image}`);
});
