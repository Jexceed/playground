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
      || (a.primaryFamilyId === 'L06' && /-(1|4|7)$/.test(a.id))
      || a.primaryFamilyId === 'E04' || (a.primaryFamilyId === 'L07' && a.stage === 3)
      || (a.primaryFamilyId === 'P06' && a.id.endsWith('-1')) || (a.primaryFamilyId === 'P01' && a.stage === 3);
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
  assert.equal(usage.atlasCount, 15);
  assert.equal(usage.registeredFrameCount, 72);
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
  assert.equal(frames.length, 72);
  const sources = new Set();
  for (const image of frames) {
    assert.ok(image.frame.index >= 0 && image.frame.index < image.frame.columns * image.frame.rows);
    const file = 'public' + image.src;
    assert.ok(existsSync(file), file);
    const data = readFileSync(file);
    assert.equal(data.readUInt32BE(16) / image.frame.columns, data.readUInt32BE(20) / image.frame.rows, file + ' has square cells');
    assert.ok(data.readUInt32BE(16) / image.frame.columns >= 400, file + ' has legible source frames');
    assert.ok(existsSync(file.replace(/\/([^/]+)\.png$/, '/source/$1-source.png')));
    sources.add(image.src);
  }
  assert.equal(sources.size, 15);
});

test('all three listening stories have matching event pictures without visual previews', () => {
  for (const a of activities.filter(a => a.primaryFamilyId === 'A05' && a.kind === 'orderedPlacement')) {
    assert.deepEqual(a.protocol.preview, []);
    assert.equal(a.protocol.kind, 'memory');
    assert.ok(a.protocol.audioText);
    assert.equal(a.tokens.length, 3);
    for (const t of a.tokens) { assert.equal(t.textOnly, false, t.label); assert.ok(t.image.frame, t.label); }
  }
});

test('daily-use matches use distinct action pictures and preserve the nine existing relationships', () => {
  const seen = new Set();
  for (const a of activities.filter(a => a.primaryFamilyId === 'P01' && a.kind === 'matching')) {
    for (const [left, right] of a.expectedPairs) {
      const object = a.tokens.find(t => t.id === left), action = a.tokens.find(t => t.id === right);
      assert.equal(action.textOnly, false, action.label);
      assert.equal(action.image.alt, action.label);
      assert.notEqual(action.image.src, object.image.src, 'a use is not the same object copied again');
      seen.add(action.image.frame.index);
    }
  }
  assert.equal(seen.size, 9);
});

test('parent references exist and material-specific pictures match their actual object', () => {
  const find = (family, n) => activities.find(a => a.primaryFamilyId === family && a.id.endsWith('-'+n));
  assert.equal(find('E04',1).presentation.storyCards.length,4);
  assert.deepEqual(find('E04',2).materials,['积木','小玩具','纸条当小河']);
  assert.equal(find('E04',3).illustration.src,imageGallery.scenes.spilledWaterRoom.src);
  assert.ok(find('E04',3).steps.some(s=>s.includes('不能证明')));
  for (const n of [7,8,9]) assert.ok(find('L07',n).illustration, 'nine cards must be provided');
  assert.ok(find('P06',1).illustration, 'the tracing task needs a template');
  const material=(a,label)=>a.presentation.materialCards.find(c=>c.label===label).image;
  assert.equal(material(find('G16',1),'圆柱形积木').alt,'圆柱形积木');
  assert.equal(material(find('P02',7),'透明杯').alt,'透明杯');
  for(const label of ['手电筒','橡皮泥','家长操作的塑料切刀'])assert.ok(material(find('P03',3),label),label);
  for(const a of activities.filter(a=>a.kind==='parentObservation'))for(const c of a.presentation.materialCards)
    if(c.label.includes('图卡')||c.label.includes('颜色形状卡'))assert.notEqual(c.image?.src,imageGallery.characters.cat.src);
});

test('readable count comparisons preserve all nine input pairs and the required transfer amount', () => {
  const pairs = [[5,7],[6,9],[7,11],[5,8],[6,10],[7,12],[5,7],[6,10],[7,13]];
  const rounds = activities.filter(a=>a.primaryFamilyId==='N02');
  for (const [index,a] of rounds.entries()) {
    assert.equal(a.presentation.evidence.kind,'visualComparison');
    assert.deepEqual(a.presentation.evidence.panels.map(p=>p.count),pairs[index]);
    const answer = Number(a.tokens.find(t=>t.id===a.answerId).label);
    assert.equal(answer,(pairs[index][1]-pairs[index][0])/(a.stage===3?2:1));
  }
});

test('rearrangement keeps the same count and time comparisons provide both registered clock faces', () => {
  for (const [index,a] of activities.filter(a=>a.primaryFamilyId==='N03'&&a.stage<3).entries()) {
    const [before,after]=a.presentation.evidence.panels;
    assert.equal(before.count,6+index);assert.equal(after.count,before.count);
    assert.notEqual(before.columns,after.columns);
  }
  for (const a of activities.filter(a=>a.primaryFamilyId==='N14'&&a.stage===3)) {
    const panels=a.presentation.evidence.panels;
    assert.deepEqual(panels.map(p=>p.label),['开始','结束']);
    assert.notEqual(panels[0].image.src,panels[1].image.src);
    for(const panel of panels)assert.ok(existsSync('public'+panel.image.src));
  }
});

test('making-ten comparisons display the original operands without printing the result', () => {
  const operands=[[8,5],[9,6],[10,7],[13,7],[14,8],[15,9]];
  for(const [index,a] of activities.filter(a=>a.primaryFamilyId==='N05'&&a.stage>1).entries()){
    const [left,right]=a.presentation.evidence.panels;
    assert.equal(left.kind,'placeValue');assert.equal(right.kind,'dots');
    assert.deepEqual([left.tens*10+left.ones,right.count],operands[index]);
    assert.equal(Number(left.label),operands[index][0]);
  }
});
