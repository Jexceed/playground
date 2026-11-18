import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beforeCurriculumReview, contentDigest } from './lib/before-curriculum-review.mjs';
import { loadGameData } from './lib/load-game-data.mjs';

const { curriculumSections, imageGallery } = await loadGameData();
const current = { curriculumSections, imageGallery };
const changes = JSON.parse(readFileSync('specs/066-curriculum-review-remediation/content-changes.json', 'utf8'));
const canonical = value => JSON.parse(JSON.stringify(value, (_, item) =>
  item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]))
    : item));

test('each approved 066 field is present and other curriculum records still match the pre-review catalog', () => {
  const groups = curriculumSections.flatMap(section => section.games);
  const entries = new Map(groups.flatMap(group => [group, ...group.rounds]).map(item => [item.id, item]));
  for (const { ids, field, current: fingerprint } of changes.fields) {
    for (const id of ids) assert.equal(contentDigest(entries.get(id)[field]), fingerprint, id + '/' + field);
  }
  for (const { category, key, current: fingerprint } of changes.gallery)
    assert.equal(contentDigest(imageGallery[category][key]), fingerprint, category + '/' + key);
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
