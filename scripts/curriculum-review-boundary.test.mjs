import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beforeAppealAndDifficulty, beforeCurriculumReview, contentDigest } from './lib/before-curriculum-review.mjs';
import { loadGameData } from './lib/load-game-data.mjs';

const { curriculumSections, imageGallery } = await loadGameData();
const current = { curriculumSections, imageGallery };
const changes067 = JSON.parse(readFileSync('specs/067-curriculum-appeal-and-difficulty/content-changes.json', 'utf8'));
const changes066 = JSON.parse(readFileSync('specs/066-curriculum-review-remediation/content-changes.json', 'utf8'));
const canonical = value => JSON.parse(JSON.stringify(value, (_, item) =>
  item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]))
    : item));

test('each approved 067 and 066 field is present and other curriculum records still match the pre-review catalog', () => {
  const liveGroups = curriculumSections.flatMap(section => section.games);
  const liveEntries = new Map(liveGroups.flatMap(group => [group, ...group.rounds]).map(item => [item.id, item]));
  for (const { ids, field, current: fingerprint } of changes067.fields) {
    for (const id of ids) assert.equal(contentDigest(liveEntries.get(id)[field]), fingerprint, id + '/' + field);
  }
  for (const { category, key, current: fingerprint } of changes067.gallery)
    assert.equal(contentDigest(imageGallery[category][key]), fingerprint, category + '/' + key);

  const after067Reversal = beforeAppealAndDifficulty(current);
  assert.equal(contentDigest(canonical(after067Reversal)), 'b48c4ed000788fa6fdd28bc731bf5e86789297a4ae0bbbb1d12378e729966cd8', 'catalog and gallery at ccd456d6');
  const groups = after067Reversal.curriculumSections.flatMap(section => section.games);
  const entries = new Map(groups.flatMap(group => [group, ...group.rounds]).map(item => [item.id, item]));
  for (const { ids, field, current: fingerprint } of changes066.fields) {
    for (const id of ids) assert.equal(contentDigest(entries.get(id)[field]), fingerprint, id + '/' + field);
  }
  for (const { category, key, current: fingerprint } of changes066.gallery)
    assert.equal(contentDigest(after067Reversal.imageGallery[category][key]), fingerprint, category + '/' + key);
  assert.equal(contentDigest(canonical(beforeCurriculumReview(current))), '60ce051258209c262178cca8ebecc480a5833cc1eae8fc5fc2396c015ed2a9c2');
});

test('historical comparison preserves unapproved values even inside a reviewed field', () => {
  const testId = 'explore-bilingual-concepts-9';
  const group = curriculumSections[1].games.find(g => g.rounds.some(r => r.id === testId));
  const changed = structuredClone(group.rounds.find(r => r.id === testId));
  changed.protocol.audioText = 'Unexpected comparison.';
  const restored = beforeCurriculumReview(changed);
  assert.equal(restored.protocol.audioText, 'Unexpected comparison.');
});
