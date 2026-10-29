import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
import { restoreNumberWalkPresentation } from './lib/restore-reviewed-art.mjs';
import { withoutEverydayEnglish } from './lib/without-everyday-english.mjs';

const [catalog, activityDomain, rulePlay] = await Promise.all([
  loadTypeScriptModule('src/curriculum/catalog.ts'),
  loadTypeScriptModule('src/domain/activity.ts'),
  loadTypeScriptModule('src/domain/rule-play.ts'),
]);
const { activityPromptSpeech } = activityDomain;
const { cardFlipStepSpeech, cardFlipSpeech } = rulePlay;
const rounds = withoutEverydayEnglish(catalog.activitySets).flatMap(set => set.rounds);
const flipSet = catalog.activitySets.find(set => set.id === 'explore-toggle-state');
const expectedTargets = [[0], [1], [2], [0, 1], [1, 2], [2, 3], [0, 1, 0], [1, 2, 1], [2, 3, 2]];
const expectedStep = (target, index) => `第${index + 1}步，翻第${target + 1}张。`;

// Preserve the pre-053 narration contract for every unrelated activity and phase.
function previousNarration(activity, phase) {
  if (activity.presentation?.evidence?.kind === 'ruleMachine') {
    if (phase === 'ready' && activity.protocol.kind === 'learnThenTransfer') return activity.protocol.demonstration;
    return [activity.prompt, activity.instruction, ...activity.clues].join('。').replace(/[。？！]。/g, '。');
  }
  return [...(activity.protocol.kind === 'learnThenTransfer' ? [activity.protocol.demonstration] : []), activity.prompt, activity.instruction, ...activity.clues]
    .join('。').replace(/[。？！]。/g, '。');
}

test('all nine flip instructions speak every authored operation in order, including repeated cards', () => {
  assert.equal(typeof cardFlipStepSpeech, 'function');
  assert.equal(typeof cardFlipSpeech, 'function');
  assert.equal(flipSet.rounds.length, 9);
  flipSet.rounds.forEach((activity, roundIndex) => {
    const model = activity.presentation.evidence;
    assert.equal(model.kind, 'cardFlip');
    assert.deepEqual(model.steps, expectedTargets[roundIndex], activity.id);
    const steps = model.steps.map(expectedStep);
    model.steps.forEach((target, index) => assert.equal(cardFlipStepSpeech(target, index), steps[index], activity.id));
    assert.equal(cardFlipSpeech(model), steps.join(''), activity.id);
    assert.deepEqual(activity.clues.slice(1), steps, activity.id);
    for (const phase of [undefined, 'ready', 'respond', 'complete'])
      assert.equal(activityPromptSpeech(activity, phase), steps.join(''), `${activity.id}/${phase}`);
    if (roundIndex >= 6) {
      assert.equal(model.steps[0], model.steps[2]);
      assert.equal((cardFlipSpeech(model).match(new RegExp(`翻第${model.steps[0] + 1}张`, 'g')) ?? []).length, 2);
    }
  });
});

test('round three starts immediately with the requested third card rather than generic directions', () => {
  const third = flipSet.rounds[2];
  assert.equal(third.id, 'explore-toggle-state-3');
  assert.equal(activityPromptSpeech(third), '第1步，翻第3张。');
  assert.doesNotMatch(activityPromptSpeech(third), /看小图|照着顺序|点下面/);
  assert.equal(cardFlipStepSpeech(2, 0), activityPromptSpeech(third));
});

test('voice export contains the exact main narration and each individual step for all nine rounds', () => {
  const lines = catalog.activityVoiceLines(catalog.activitySets);
  for (const activity of flipSet.rounds) {
    const context = `${flipSet.id}/${activity.id}`;
    const own = lines.filter(line => line.context === context);
    assert.ok(own.some(line => line.kind === 'prompt' && line.text === activityPromptSpeech(activity) && line.locale === 'zh-CN'), context);
    activity.presentation.evidence.steps.forEach((target, index) => {
      assert.ok(own.some(line => line.kind === 'clue' && line.text === expectedStep(target, index) && line.locale === 'zh-CN'), `${context}/step-${index + 1}`);
    });
    assert.ok(!own.some(line => line.kind === 'prompt' && line.text === previousNarration(activity)), context);
  }
});

test('structured steps still drive narration and exported button audio without duplicated clue text', () => {
  const activity = structuredClone(flipSet.rounds[8]);
  activity.clues = ['点一下大牌，就翻一面。'];
  const expected = expectedTargets[8].map(expectedStep);
  assert.equal(activityPromptSpeech(activity), expected.join(''));
  const lines = catalog.activityVoiceLines([{ ...flipSet, rounds: [activity] }]);
  for (const text of expected) assert.ok(lines.some(line => line.kind === 'clue' && line.text === text), text);
});

test('all other activities retain the previous narration in every relevant phase', () => {
  // 054–056 separately specify their visual instruction narration and test those contracts.
  const others = rounds.filter(activity => activity.kind !== 'network' && !['cardFlip','numberWalk','boardMove'].includes(activity.presentation?.evidence?.kind));
  assert.equal(others.length, 585);
  for (const activity of others) {
    for (const phase of [undefined, 'ready', 'observe', 'retain', 'respond', 'complete'])
      assert.equal(activityPromptSpeech(activity, phase), previousNarration(activity, phase), `${activity.id}/${phase}`);
  }
});

test('the full 1110-question catalog remains identical to the pre-053 committed content', () => {
  // Computed from catalogGames bundled from Git commit 014a56a320a96d1fa22fa5402801dd88ab492aa8.
  // Includes full question data, answers, images, revisions and curriculum metadata.
  assert.equal(restoreNumberWalkPresentation(catalog.catalogGames).flatMap(set => set.rounds).length, 1110);
  assert.equal(createHash('sha256').update(JSON.stringify(restoreNumberWalkPresentation(catalog.catalogGames))).digest('hex'),
    'fce1bbed70e846ad6d5700400f8ac9a23559018edd8bc8017b470b19e241a9f8');
});
