import assert from 'node:assert/strict';

const addedGroups = new Map([
  ['everyday-english-greetings', ['morning', 'farewell']],
  ['everyday-english-kind-words', ['thanks', 'sorry']],
  ['everyday-english-asking', ['water', 'help']],
]);
const addedScenes = new Map([
  ['englishDailyMorning', 'morning'], ['englishDailyFarewell', 'farewell'],
  ['englishDailyThanks', 'thanks'], ['englishDailySorry', 'sorry'],
  ['englishDailyWater', 'water'], ['englishDailyHelp', 'help'],
]);

// Test-only view of the pre-060 bank. Historical hashes/field checks still
// inspect every old activity unchanged; new English contracts have their own
// tests. Unknown additions deliberately remain visible to snapshot assertions.
export function withoutEverydayEnglish(data) {
  const copy = JSON.parse(JSON.stringify(data));
  function previousGroups(groups) {
    const added = groups.filter(group => addedGroups.has(group.id));
    if (added.length) {
      assert.deepEqual(added.map(group => group.id).sort(), [...addedGroups.keys()].sort(),
        'the approved 060 supplement contains exactly three distinct groups');
      for (const group of added) {
        assert.equal(group.kind, 'activitySet');
        assert.equal(group.world, 'language');
        assert.deepEqual(group.rounds.map(round => round.id),
          addedGroups.get(group.id).flatMap(scene => ['choose', 'talk'].map(kind => `everyday-english-${scene}-${kind}`)),
          `${group.id}: only the twelve approved 060 identities can be excluded`);
      }
    }
    return groups.filter(group => !addedGroups.has(group.id));
  }
  if (Array.isArray(copy)) return previousGroups(copy);
  for (const key of ['activitySets', 'catalogGames'])
    if (Array.isArray(copy[key])) copy[key] = previousGroups(copy[key]);
  for (const section of copy.curriculumSections ?? []) section.games = previousGroups(section.games);
  if (copy.imageGallery?.scenes) {
    for (const [key, scene] of addedScenes) {
      const image = copy.imageGallery.scenes[key];
      if (!image) continue;
      assert.deepEqual([image.src, image.width, image.height, image.style],
        [`/images/scenes/english-daily-${scene}.png`, 1200, 675, 'illustration'],
        `${key}: only the approved 060 scene registration can be excluded`);
      delete copy.imageGallery.scenes[key];
    }
  }
  return copy;
}
