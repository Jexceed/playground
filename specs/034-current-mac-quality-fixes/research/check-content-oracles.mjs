import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Independent fixture checks only. Do not import curriculum generators,
// authoringSolutions, routeSolution, evaluators, or rendering code.
const f = JSON.parse(readFileSync(new URL('./content-oracles.json', import.meta.url), 'utf8'));
const same = (a, b) => assert.deepEqual(a, b);
const sorted = a => [...a].sort((a, b) => a - b);

function inspectTrail(a, ids) {
  let current = a.start;
  const nodes = [current];
  for (const id of ids) {
    const edge = a.graph.edges.find(e => e.id === id);
    if (!edge || (edge.from !== current && edge.to !== current)) return { connected: false };
    current = edge.from === current ? edge.to : edge.from;
    nodes.push(current);
  }
  return {
    connected: true, endsAtGoal: current === a.end,
    noRepeatedEdge: new Set(ids).size === ids.length,
    requiredNodes: a.requiredNodes.every(n => nodes.includes(n)),
    requiredEdges: a.requiredEdges.every(e => ids.includes(e)),
    avoidsBlocked: !a.blockedEdges.some(e => ids.includes(e)),
    nodes,
  };
}
const trailOkay = (a, ids, ignore) => Object.entries(inspectTrail(a, ids))
  .every(([k, v]) => k === 'nodes' || k === ignore || v === true);
let boundedEdgeSequences = 0;
for (const a of f.route) {
  for (const ids of a.expectedOptimalRoutes) {
    assert(trailOkay(a, ids));
    same(ids.length, a.optimalLength);
  }
  assert(trailOkay(a, a.longerLegalRoute));
  assert(a.longerLegalRoute.length > a.optimalLength);
  assert(trailOkay(a, a.nodeRevisitLegalRoute));
  const revisit = inspectTrail(a, a.nodeRevisitLegalRoute).nodes;
  assert(new Set(revisit).size < revisit.length);
  for (const [key, ignore] of [['requiredNodeOnlyFailure', 'requiredNodes'], ['blockedEdgeOnlyFailure', 'avoidsBlocked'], ['repeatedEdgeFailure', 'noRepeatedEdge']]) {
    assert(!trailOkay(a, a[key]));
    assert(trailOkay(a, a[key], ignore));
  }
  // Cartesian edge-ID sequences through length 3, then validate each sequence.
  // This is deliberately not the author's recursive path-search algorithm.
  const ids = a.graph.edges.map(e => e.id), accepted = [];
  for (let length = 1; length <= a.optimalLength; length++) {
    for (let code = 0; code < ids.length ** length; code++) {
      let value = code;
      const path = [];
      for (let i = 0; i < length; i++) { path.push(ids[value % ids.length]); value = Math.floor(value / ids.length); }
      boundedEdgeSequences++;
      if (trailOkay(a, path)) accepted.push(path);
    }
  }
  same(accepted.map(p => p.join(',')).sort(), a.expectedOptimalRoutes.map(p => p.join(',')).sort());
}

for (const a of f.money) {
  const correct = [], equalsButOver = [], wrongAmountWithinStock = [];
  for (const o of a.options) {
    const counts = new Map();
    for (const d of o.denominations) counts.set(d, (counts.get(d) ?? 0) + 1);
    const total = [...counts].reduce((sum, [d, count]) => sum + d * count, 0);
    const withinStock = [...counts].every(([d, count]) => count <= (a.stock[d] ?? 0));
    same(o.correctTotal, total === a.target);
    same(o.withinStock, withinStock);
    if (total === a.target && withinStock) correct.push(o.id);
    if (total === a.target && !withinStock) equalsButOver.push(o.id);
    if (total !== a.target && withinStock) wrongAmountWithinStock.push(o.id);
  }
  same(correct, a.expectedIds);
  assert(correct.length && equalsButOver.length && wrongAmountWithinStock.length);
}
assert(f.money.at(-1).expectedIds.length > 1);

for (const a of f.markers) {
  let red = a.redStart, blue = a.blueStart, direction = 1;
  const redTrace = [red], blueTrace = [blue];
  for (let i = 0; i < a.steps; i++) {
    if (red + direction >= a.size || red + direction < 0) direction *= -1;
    red += direction;
    blue = blue === 0 ? a.size - 1 : blue - 1;
    redTrace.push(red); blueTrace.push(blue);
  }
  same(redTrace, a.redTrace); same(blueTrace, a.blueTrace);
  const truthPairs = a.options.map(o => [o.red === red, o.blue === blue]);
  same(truthPairs, [[true, true], [true, false], [false, true], [false, false]]);
}

for (const a of f.fold) {
  const twice = a.folds.length === 2;
  const [pr, pc] = a.punchOriginalCoordinate, hits = [];
  assert(a.activeOriginalRows.includes(pr) && a.activeOriginalColumns.includes(pc));
  same(a.punchFoldedLocalCoordinate, [twice ? pr - 2 : pr, pc - 2]);
  // Forward-fold every original cell center into the punched folded paper.
  // Continuous coordinates avoid relying on the author's reflected bit array.
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    let x = c + .5, y = r + .5;
    if (x < 2) x = 4 - x;
    if (twice && y < 2) y = 4 - y;
    if (x === pc + .5 && y === pr + .5) hits.push(4 * r + c);
  }
  same(hits, a.expectedUnfoldedHoleIndices);
  assert(hits.length === (twice ? 4 : 2));
  same(a.afterUndoLastFoldHoleIndices, twice ? sorted([4 * pr + pc, 4 * (3 - pr) + pc]) : hits);
  const options = a.candidateHoleIndexSets.map(xs => sorted(xs).join(','));
  same(new Set(options).size, options.length);
  assert(a.candidateHoleIndexSets.every(xs => xs.length === hits.length));
  same(options.filter(k => k === hits.join(',')).length, 1);
}

function choose(n, k) {
  let result = 1;
  for (let j = 1; j <= k; j++) result = result * (n + 1 - j) / j;
  return result;
}
let pyramidTiles = 0;
for (const a of f.pyramid) {
  same(a.expectedLevelsBottomUp.length, a.base.length - 1);
  for (const [index, level] of a.expectedLevelsBottomUp.entries()) {
    const depth = index + 1;
    same(level.length, a.base.length - depth);
    for (const [offset, expected] of level.entries()) {
      // Direct bottom-to-level formula, independent of intermediate answers:
      // XOR parity uses Pascal coefficients; OR uses presence in any contributor.
      const result = Array.from({ length: 9 }, (_, cell) => {
        const contributors = a.base.slice(offset, offset + depth + 1).map(s => Number(s[cell]));
        return a.operation === 'OR'
          ? Number(contributors.some(Boolean))
          : contributors.reduce((sum, bit, k) => sum + bit * choose(depth, k), 0) % 2;
      }).join('');
      same(expected, result);
      const below = index === 0 ? a.base : a.expectedLevelsBottomUp[index - 1];
      for (let cell = 0; cell < 9; cell++) {
        const count = Number(below[offset][cell]) + Number(below[offset + 1][cell]);
        same(Number(expected[cell]), a.operation === 'OR' ? Number(count > 0) : Number(count === 1));
      }
      pyramidTiles++;
    }
  }
  same(a.requiredIntermediateTiles, a.expectedLevelsBottomUp.flat().length);
  assert(a.allCellsRequired);
}

for (const a of f.rectangles) {
  const boundaryPairs = [];
  for (let top = 0; top <= a.rows; top++) for (let bottom = top + 1; bottom <= a.rows; bottom++) {
    for (let left = 0; left <= a.columns; left++) for (let right = left + 1; right <= a.columns; right++) boundaryPairs.push([top, left, bottom, right]);
  }
  const keys = a.rectangles.map(r => r.join(','));
  same(new Set(keys).size, keys.length);
  same(keys.sort(), boundaryPairs.map(r => r.join(',')).sort());
  same(a.expectedCount, choose(a.rows + 1, 2) * choose(a.columns + 1, 2));
  same(a.rectangles.length, a.expectedCount);
  for (const [dimensions, count] of Object.entries(a.countsByHeightWidth)) {
    const [height, width] = dimensions.split('x').map(Number);
    same(count, a.rectangles.filter(([t, l, b, r]) => b - t === height && r - l === width).length);
  }
}
console.log(JSON.stringify({ status: 'passed', routeGraphs: f.route.length, boundedEdgeSequences, moneyTasks: f.money.length, markerTasks: f.markers.length, foldTasks: f.fold.length, pyramidTasks: f.pyramid.length, pyramidTiles, rectangleTasks: f.rectangles.length, totalRectangles: f.rectangles.reduce((n, a) => n + a.expectedCount, 0), runtimeEvaluatorOrUIChecked: false }, null, 2));
