import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { withoutEverydayEnglish } from './lib/without-everyday-english.mjs';

const [content, catalog, benchmark, pilot, navigation, evaluation, session, assets, voices] = await Promise.all([
  loadTypeScriptModule('src/curriculum/everyday-english.ts'),
  loadTypeScriptModule('src/curriculum/catalog.ts'),
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/curriculum/pilot/activities.ts'),
  loadTypeScriptModule('src/curriculum/exploration/navigation.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
  loadTypeScriptModule('src/engine/activity-session.ts'),
  loadTypeScriptModule('src/domain/activity-assets.ts'),
  loadTypeScriptModule('src/curriculum/activity-voice-lines.ts'),
]);
const groups = content.everydayEnglishSets;
const activities = groups.flatMap(group => group.rounds);

test('historical snapshot view isolates exactly the approved supplement without mutating the current bank', () => {
  const data = JSON.parse(JSON.stringify(catalog));
  const before = structuredClone(data);
  const previous = withoutEverydayEnglish(data);
  assert.deepEqual(data, before);
  assert.deepEqual(previous.activitySets.map(group => group.id), [...pilot.activitySets, ...benchmark.explorationSets].map(group => group.id));
  assert.deepEqual(previous.activitySets, before.activitySets.slice(0, 75));
  assert.equal(previous.catalogGames.flatMap(group => group.rounds).length, 1110);
  assert.deepEqual(previous.curriculumSections[1].games, previous.activitySets);
  assert.equal(Object.keys(data.imageGallery.scenes).length - Object.keys(previous.imageGallery.scenes).length, 6);
});

test('historical snapshot view keeps old mutations, unknown additions and unrelated image changes visible', () => {
  const data = JSON.parse(JSON.stringify(catalog));
  data.activitySets[0].rounds[0].parentPrompt = 'unreviewed old-content change';
  const unknown = { id: 'everyday-english-unapproved', rounds: [{ id: 'unexpected-question' }] };
  data.activitySets.push(unknown);
  data.imageGallery.scenes.unreviewed = { src: '/images/unreviewed.png' };
  const previous = withoutEverydayEnglish(data);
  assert.equal(previous.activitySets[0].rounds[0].parentPrompt, 'unreviewed old-content change');
  assert.deepEqual(previous.activitySets.at(-1), unknown);
  assert.deepEqual(previous.imageGallery.scenes.unreviewed, data.imageGallery.scenes.unreviewed);
});

test('historical snapshot view rejects reused identities and an unrelated asset under an approved scene key', () => {
  const badGroups = structuredClone(groups);
  badGroups[0].rounds[0].id = pilot.activitySets[0].rounds[0].id;
  assert.throws(() => withoutEverydayEnglish(badGroups), /approved 060 identities/);
  assert.throws(() => withoutEverydayEnglish([...groups, groups[0]]), /three distinct groups/);
  const gallery = JSON.parse(JSON.stringify(catalog.imageGallery));
  gallery.scenes.englishDailyMorning.src = gallery.items.book.src;
  assert.throws(() => withoutEverydayEnglish({ imageGallery: gallery }), /approved 060 scene registration/);
});

const expected = {
  morning: 'Good morning.', farewell: 'Goodbye.', thanks: 'Thank you.', sorry: "I'm sorry.",
  water: 'Can I have some water, please?', help: 'Can you help me, please?',
};

test('original everyday English adds three discoverable groups while retaining both existing banks', () => {
  assert.deepEqual(groups.map(group => [group.title, group.rounds.length]), [
    ['见面与告别', 4], ['谢谢与抱歉', 4], ['我需要帮助', 4],
  ]);
  const identities = sets => sets.map(group => ({ id: group.id, rounds: group.rounds.map(activity => activity.id) }));
  assert.deepEqual(identities(catalog.activitySets.slice(0, -3)), identities([...pilot.activitySets, ...benchmark.explorationSets]));
  assert.equal(benchmark.explorationSets.length, 71);
  assert.equal(benchmark.explorationSets.flatMap(group => group.rounds).length, 597);
  const language = catalog.getCurriculumSection('exploration').games.filter(group => group.world === 'language');
  assert.deepEqual(navigation.groupExplorationGames(language).find(group => group.title === '英语日常说').games, groups);
  const allIds = catalog.catalogGames.flatMap(group => [group.id, ...group.rounds.map(activity => activity.id)]);
  assert.equal(new Set(allIds).size, allIds.length);
  for (const activity of activities) {
    assert.ok(activity.primaryFamilyId.startsWith('original-english-'));
    assert.deepEqual(activity.sourceRefs, [{ sourceId: 'original-060', locator: 'specs/060-everyday-english/spec.md' }]);
  }
});

test('six independently specified situation meanings each have one accepted English response', () => {
  for (const [scene, english] of Object.entries(expected)) {
    const activity = activities.find(activity => activity.id === `everyday-english-${scene}-choose`);
    assert.equal(activity.kind, 'singleChoice');
    assert.equal(activity.tokens.length, 3);
    assert.equal(new Set(activity.tokens.map(token => token.label)).size, 3);
    assert.equal(activity.tokens.find(token => token.id === activity.answerId).label, english);
    assert.equal(evaluation.evaluateActivity(activity, { kind: 'singleChoice', tokenId: null }).status, 'incomplete');
    for (const token of activity.tokens) {
      const status = evaluation.evaluateActivity(activity, { kind: 'singleChoice', tokenId: token.id }).status;
      assert.equal(status, token.label === english ? 'correct' : 'incorrect', `${scene}: ${token.label}`);
      assert.equal(token.textOnly, true, 'do not render repeated illustrations behind different English labels');
      assert.equal(token.speechLocale, 'en-US');
    }
  }
  const positions = activities.filter(activity => activity.kind === 'singleChoice')
    .map(activity => activity.tokens.findIndex(token => token.id === activity.answerId));
  assert.ok(new Set(positions).size > 1, 'correct choices must not always occupy the same position');
});

test('each scene uses one registered local 1200×675 illustration shared only with its companion role play', () => {
  const paths = new Set();
  const scenes = Object.values(catalog.imageGallery.scenes);
  for (const scene of Object.keys(expected)) {
    const [choice, talk] = ['choose', 'talk'].map(kind => activities.find(activity => activity.id === `everyday-english-${scene}-${kind}`));
    assert.ok(scenes.some(image => image.src === choice.illustration.src), scene);
    assert.deepEqual(talk.illustration, choice.illustration);
    for (const activity of [choice, talk]) assert.deepEqual(assets.activityImageSources(activity), [choice.illustration.src]);
    const file = `public${choice.illustration.src}`;
    assert.ok(existsSync(file), file);
    const png = readFileSync(file);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 675], file);
    assert.ok(existsSync(file.replace(/\/([^/]+)\.png$/, '/source/$1-source.png')), 'keep the generated source');
    paths.add(choice.illustration.src);
  }
  assert.equal(paths.size, 6);
});

test('everyday English dialogues and options export English audio separately from Chinese instructions', () => {
  const lines = voices.activityVoiceLines(groups);
  const expressions = new Set();
  for (const activity of activities) {
    assert.equal(activity.presentation.dialogue.length, 2);
    for (const line of activity.presentation.dialogue) {
      assert.ok(line.speaker && line.english && line.chinese);
      expressions.add(line.english);
      assert.ok(lines.some(exported => exported.text === line.english && exported.locale === 'en-US'), line.english);
      assert.ok(!lines.some(exported => exported.text === line.english && exported.locale === 'zh-CN'), line.english);
    }
    for (const token of activity.tokens) {
      assert.ok(lines.some(line => line.text === token.speechText && line.locale === 'en-US'), token.label);
      assert.ok(!lines.some(line => line.text === token.speechText && line.locale === 'zh-CN'), token.label);
    }
    assert.ok(lines.some(line => line.text === activity.parentPrompt && line.locale === 'zh-CN'));
  }
  assert.ok(expressions.size >= 10, `expected at least 10 distinct expressions, got ${expressions.size}`);
});

test('all six role plays record support observations without claiming an automatic speech score', () => {
  const rolePlays = activities.filter(activity => activity.kind === 'parentObservation');
  assert.equal(rolePlays.length, 6);
  for (const activity of rolePlays) {
    assert.equal(activity.observations.length, 3);
    assert.equal(evaluation.evaluateActivity(activity, { kind: 'parentObservation', observations: {} }).status, 'incomplete');
    for (const support of ['independent', 'supported', 'notYet']) {
      const response = { kind: 'parentObservation', observations: Object.fromEntries(activity.observations.map(item => [item.id, support])) };
      assert.equal(evaluation.evaluateActivity(activity, response).status, 'needsParentObservation');
      let state = session.createSession(activity);
      state = session.transitionSession(activity, state, { type: 'response', response });
      state = session.transitionSession(activity, state, { type: 'submit' });
      assert.equal(state.phase, 'complete');
      assert.equal(state.attempts, 0);
      assert.equal(state.evidence.at(-1).kind, 'observation');
    }
  }
});
