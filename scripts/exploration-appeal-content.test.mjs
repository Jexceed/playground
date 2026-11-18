import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const [{ explorationSets, explorationDrawings, authoringSolutions, soundStimuli }, { evaluateActivity }, { activityImageSources }] = await Promise.all([
  loadTypeScriptModule('src/curriculum/exploration/index.ts'),
  loadTypeScriptModule('src/domain/activity-evaluation.ts'),
  loadTypeScriptModule('src/domain/activity-assets.ts'),
]);
const family = id => explorationSets.find(group => group.rounds[0].primaryFamilyId === id).rounds;

test('all nine balance questions have four different attainable number choices and the correct transfer amount', () => {
  for (const round of family('N02')) {
    const [left, right] = round.presentation.evidence.panels.map(panel => panel.count);
    const values = round.tokens.map(token => Number(token.label));
    assert.equal(new Set(values).size, 4, round.id);
    assert.ok(values.every(n => Number.isInteger(n) && n >= 0 && n <= right));
    const answer = Number(round.tokens.find(token => token.id === round.answerId).label);
    assert.equal(answer, (right - left) / (round.stage === 3 ? 2 : 1));
  }
});

test('height clues contain just the two pictured relations, with the correct conclusions in all three variants', () => {
  const compact = family('L03').slice(6).map(round => {
    assert.equal(round.illustration, undefined);
    const panels = round.presentation.evidence.panels;
    for (const panel of panels) {
      assert.equal(panel.kind, 'heightPair');
      assert.ok(activityImageSources(round).includes(panel.taller.src));
      assert.ok(activityImageSources(round).includes(panel.shorter.src));
    }
    return { clues: panels.map(p => [p.taller.alt, p.shorter.alt]), answer: round.tokens.find(t => t.id === round.answerId).label };
  });
  assert.deepEqual(compact, [
    { clues: [['小兔','小猫'],['小狗','小猫']], answer: '现在还不能确定' },
    { clues: [['小猫','小狗'],['小狗','小兔']], answer: '小猫更高' },
    { clues: [['小狗','小兔'],['小猫','小兔']], answer: '现在还不能确定' },
  ]);
});

test('clock and perspective retries give the step and reference frame in the actual question', () => {
  for (const round of family('N14').slice(6)) {
    assert.match(round.retry, /一大格.{0,8}五分钟/);
    assert.doesNotMatch(round.retry, /五大格/);
  }
  for (const round of family('G17').slice(6)) {
    const id = round.illustration.src.split('/').at(-1).slice(0, -4);
    const [tipX, tipY] = explorationDrawings[id].objects[8].points[4];
    if (tipX > 160) {
      assert.match(round.retry, /向右/);
      assert.doesNotMatch(round.retry, /正对着你|画面相反/);
    } else {
      assert.ok(tipY > 160);
      assert.match(round.retry, /面对|正对/);
    }
  }
});

test('shape assembly introduces layers on the final question with a supported upper footprint', () => {
  const rounds = family('G14');
  assert.deepEqual(rounds.map(a => a.layers), [1,1,1,1,1,1,1,1,2]);
  const last = rounds.at(-1), solution = authoringSolutions[last.id];
  const coordinates = new Set(last.target.map(cell => cell.join(',')));
  assert.equal(coordinates.size, last.target.length);
  assert.ok(last.target.some(([, , z]) => z === 1));
  for (const [x,y,z] of last.target) if (z === 1) assert.ok(coordinates.has([x,y,0].join(',')));
  assert.equal(evaluateActivity(last, solution).status, 'correct');
  const wrongLayer = { ...solution, placements: solution.placements.map(p => ({ ...p, z: 0 })) };
  assert.notEqual(evaluateActivity(last, wrongLayer).status, 'correct');
  assert.match(last.instruction, /第一层.*第二层/);
  for (const a of rounds.slice(6,8)) assert.doesNotMatch(a.prerequisites, /切换|选层/);
  assert.match(last.prerequisites, /切换|选层/);
});

test('memory and map activities describe the real preparation and task load', () => {
  for (const round of family('A02').slice(6)) {
    assert.equal(round.difficulty.memory, 9);
    assert.match(round.prerequisites, /3×3|九格/);
  }
  for (const round of family('E05').slice(6)) {
    assert.equal(round.difficulty.memory, 3);
    assert.match(round.difficulty.basis, /遮住/);
  }
  const map = family('P05')[2];
  assert.ok(map.materials.some(text => text.includes('地图') && !text.includes('屏幕')));
  assert.ok(map.materials.some(text => /照片|绘本|图片/.test(text)));
  assert.match(map.steps.join(''), /地图上/);
  assert.match(map.steps.join(''), /附近|旁边|周围/);
  assert.equal(map.illustration, undefined);
});

test('sound sequencing uses eight distinct audible rhythms and the answer follows the actual notes', () => {
  const sequences = family('A08').filter(r => r.kind === 'orderedPlacement').map(round => {
    const sound = round.protocol.soundSrc.split('/').at(-1).replace('.wav', '');
    const notes = soundStimuli[sound].map(event => event.timbre);
    assert.deepEqual(notes, round.evaluation.tokenIds);
    assert.equal(round.difficulty.memory, notes.length);
    return notes.join(',');
  });
  assert.equal(sequences.length, 8);
  assert.equal(new Set(sequences).size, sequences.length);
});
