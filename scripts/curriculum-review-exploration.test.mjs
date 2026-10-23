import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';

const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const all = explorationSets.flatMap(group => group.rounds);
const family = id => all.filter(activity => activity.primaryFamilyId === id);
const drawing = image => {
  const id = image.src.split('/').at(-1).replace('.png', '');
  assert.ok(explorationDrawings[id], image.src);
  return explorationDrawings[id];
};

test('E07 spoken square is square in every candidate, with exactly one complete quantity/position match', () => {
  for (const [variant, activity] of family('E07').filter(a => a.stage === 2).entries()) {
    assert.match(activity.protocol.audioText, /above the red square/);
    const matches = [];
    for (const token of activity.tokens) {
      const art = drawing(token.image), square = art.objects.find(o => o.kind === 'rect');
      const circles = art.objects.filter(o => o.kind === 'circle');
      assert.equal(square.w, square.h, `${activity.id}/${token.id} uses an actual square`);
      assert.equal(square.fill, '#db675e');
      assert.ok(circles.every(circle => circle.y + circle.r < square.y || circle.y - circle.r > square.y + square.h), 'circles and square do not overlap');
      if (circles.length === variant + 1 && circles.every(circle => circle.y + circle.r < square.y)) matches.push(token.id);
    }
    assert.deepEqual(matches, [activity.answerId]);
    assert.equal(activity.revision, 2);
  }
});

test('L09 states the white/yellow reverse face before operations and both colors toggle exactly', () => {
  for (const activity of family('L09')) {
    assert.equal(activity.presentation.evidence.kind, 'cardFlip');
    assert.ok(activity.tokens.some(t => t.id === 'off' && t.label === '白面'));
    assert.ok(activity.tokens.some(t => t.id === 'on' && t.label === '黄面'));
    assert.equal(activity.presentation.evidence.initial.length, activity.cells.length);
    const initial = drawing(activity.illustration).objects.filter(o => o.kind === 'rect').map(o => o.fill === '#e8b64e');
    const flips = activity.presentation.evidence.steps;
    assert.deepEqual(activity.presentation.evidence.initial, initial.map(yellow => yellow ? 'on' : 'off'));
    const expected = initial.map((wasYellow, index) => wasYellow !== (flips.filter(flip => flip === index).length % 2 === 1) ? 'on' : 'off');
    assert.deepEqual(Object.values(activity.evaluation.cells), expected, activity.id);
    assert.equal(activity.revision, 2);
  }
});

test('L11 teaches all capture directions before play and includes diagonal-only optimal moves', () => {
  for (const activity of family('L11').filter(a => a.stage === 3)) {
    assert.match(activity.clues[0], /横.*竖.*斜.*每个方向.*合起来数/);
    const board = drawing(activity.illustration).objects.filter(o => o.kind === 'text').map(o => o.text);
    assert.equal(board.length, 16);
    // Independently inspect every possible black endpoint, rather than copy the
    // authoring generator's directional walk. Only straight, fully white gaps count.
    const captured = position => {
      const white = new Set();
      board.forEach((piece, end) => {
        if (piece !== '●') return;
        const dx = end % 4 - position % 4, dy = Math.floor(end / 4) - Math.floor(position / 4);
        if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) return;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        if (distance < 2) return;
        const gap = Array.from({ length: distance - 1 }, (_, index) => (Math.floor(position / 4) + Math.sign(dy) * (index + 1)) * 4 + position % 4 + Math.sign(dx) * (index + 1));
        if (gap.every(cell => board[cell] === '○')) gap.forEach(cell => white.add(cell));
      });
      return white.size;
    };
    const empty = board.flatMap((piece, index) => /^\d+$/.test(piece) ? [index] : []);
    const maximum = Math.max(...empty.map(captured));
    assert.deepEqual(activity.expectedTokenIds, empty.filter(cell => captured(cell) === maximum).map(cell => `p${cell}`), activity.id);
    if (!activity.id.endsWith('-7')) assert.ok(activity.expectedTokenIds.includes('p15'), 'bottom-right diagonal capture is an optimal answer');
    assert.equal(activity.revision, 2);
  }
});

test('G16 front/right-side silhouettes and arrows agree, including asymmetric row order', () => {
  const expectedViews = [
    { front: [2, 3], side: [3, 1], valid: ['b0'] },
    { front: [2, 3], side: [3, 2], valid: ['b0', 'b1'] },
    { front: [3, 3], side: [3, 3], valid: ['b0', 'b1', 'b3'] },
  ];
  for (const [variant, activity] of family('G16').filter(a => a.stage === 3).entries()) {
    const scene = drawing(activity.illustration);
    const columnHeights = panel => {
      const filled = scene.objects.filter(o => o.kind === 'rect' && o.fill === '#405769' && o.x >= panel * 200 && o.x < (panel + 1) * 200);
      return [...new Set(filled.map(o => o.x))].sort((a, b) => a - b).map(x => filled.filter(o => o.x === x).length);
    };
    assert.deepEqual(columnHeights(0), expectedViews[variant].front, 'front retains columns from left to right');
    assert.deepEqual(columnHeights(1), expectedViews[variant].side, 'right-side view shows the front row on the left');
    assert.deepEqual(activity.expectedTokenIds, expectedViews[variant].valid, activity.id);
    for (const token of activity.tokens) {
      const art = drawing(token.image), arrows = art.objects.filter(o => o.kind === 'line');
      assert.deepEqual(art.objects.filter(o => o.kind === 'text').map(o => o.text), ['前', '侧']);
      assert.equal(arrows.length, 2);
      assert.ok(arrows[0].x2 > arrows[0].x && arrows[0].y2 < arrows[0].y, 'front viewer approaches from bottom-left');
      assert.ok(arrows[1].x2 < arrows[1].x && arrows[1].y2 < arrows[1].y, 'right-side viewer approaches from bottom-right');
    }
    const topArrows = scene.objects.filter(o => o.kind === 'line' && o.x >= 400);
    assert.equal(topArrows.length, 2);
    assert.ok(topArrows[0].x === topArrows[0].x2 && topArrows[0].y2 < topArrows[0].y, 'top plan locates front below the grid');
    assert.ok(topArrows[1].y === topArrows[1].y2 && topArrows[1].x2 < topArrows[1].x, 'top plan locates side to the right of the grid');
    assert.equal(activity.revision, 2);
  }
});
