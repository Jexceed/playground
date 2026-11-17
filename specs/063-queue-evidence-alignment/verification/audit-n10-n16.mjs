// Run from the repository root:
// node specs/063-queue-evidence-alignment/verification/audit-n10-n16.mjs
// Add --require-action-cue to verify the N10-7/8/9 correction as well.
// Reproduces the read-only 2026-11-14 audit. Writes only JSON to stdout.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';

const require = createRequire(import.meta.url);
const ids = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'];
const built = await build({
  configFile: false, publicDir: false, logLevel: 'silent',
  ssr: { noExternal: true, external: ids },
  build: {
    ssr: resolve('src/interactions/ActivityEvidence.tsx'), write: false,
    rollupOptions: {
      output: {
        format: 'es', inlineDynamicImports: true,
        paths: Object.fromEntries(ids.map(id => [id, pathToFileURL(require.resolve(id)).href])),
      },
    },
  },
});
const { ActivityEvidence } = await import('data:text/javascript;base64,' + Buffer.from(built.output.find(o => o.type === 'chunk').code).toString('base64'));
const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const requireActionCue = process.argv.includes('--require-action-cue');
if (requireActionCue) {
  assert.deepEqual(explorationSets.flatMap(group => group.rounds)
    .filter(activity => activity.presentation?.evidence?.removeOnes !== undefined)
    .map(activity => activity.id), [7, 8, 9].map(n => `explore-parity-place-value-${n}`));
}
const reports = [];
for (const group of explorationSets.filter(g => /^N1[0-6]$/.test(g.rounds[0].primaryFamilyId))) {
  for (const activity of group.rounds) {
    const family = activity.primaryFamilyId, evidence = activity.presentation?.evidence, stage = activity.stage;
    const answer = activity.kind === 'singleChoice'
      ? activity.tokens.find(token => token.id === activity.answerId).label
      : activity.expectedTokenIds;
    const html = renderToStaticMarkup(createElement(ActivityEvidence, { activity, phase: 'respond' }));
    if (family === 'N10') {
      if (stage === 1) {
        assert.deepEqual(answer, activity.tokens.filter(token => Number(token.label) % 2 === 0).map(token => token.id));
        for (const token of activity.tokens) {
          const drawing = explorationDrawings[token.image.src.split('/').at(-1).replace('.png', '')];
          assert.equal(drawing.objects.filter(object => object.kind === 'circle').length, Number(token.label));
        }
      } else {
        assert.equal(Number(answer), evidence.tens * 10 + evidence.ones - (stage === 3 ? 1 : 0));
        // The model occurs in the visible figure and the closed enlargement dialog.
        assert.equal((html.match(/class="math-ten-rod"/g) || []).length, evidence.tens * 2);
        assert.equal((html.match(/class="math-ones"/g) || []).length, 2);
        if (requireActionCue) {
          if (stage === 3) {
            const original = +activity.prompt.match(/原来有(\d+)个/)[1];
            assert.equal(evidence.tens * 10 + evidence.ones, original);
            assert.equal(evidence.removeOnes, 1);
            assert.ok(!('remaining' in evidence) && !('answer' in evidence));
            for (const [, blocks] of html.matchAll(/<div class="math-ones">([\s\S]*?)<\/div>/g)) {
              assert.equal((blocks.match(/<span/g) || []).length, evidence.ones, 'keep the original number of one-blocks');
              assert.equal((blocks.match(/class="is-taken-away"/g) || []).length, 1, 'mark exactly one original block as removed');
            }
            assert.match(html, />原来<\/strong>/);
            assert.match(html, /拿走 1 小块，还剩 <strong>\?<\/strong>/);
            const visibleText = html.replace(/<[^>]*>/g, ' ');
            assert.doesNotMatch(visibleText, new RegExp(`(^|\\D)${answer}(?!\\d)`), 'do not print the remaining quantity in the evidence');
          } else {
            assert.equal(evidence.removeOnes, undefined);
            assert.doesNotMatch(html, /is-taken-away|拿走/);
          }
        }
      }
    } else if (family === 'N11') {
      const values = evidence.values;
      assert.equal(values.filter(value => value === null).length, 1);
      if (stage === 1) assert.equal(Number(answer), values[2] + values[1] - values[0]);
      else if (stage === 2) {
        assert.equal(values[4] - values[2], values[2] - values[0]);
        assert.equal(Number(answer), values[3] + values[3] - values[1]);
      } else {
        assert.equal(evidence.columns, 3);
        assert.equal(Number(answer), values[2] + values[3] - values[0]);
        assert.equal(Number(answer), values[4] + values[1] - values[0]);
      }
    } else if (family === 'N12') {
      const circle = evidence.relations[0].total / 2;
      const triangle = stage === 1 ? null : evidence.relations[1].total - circle;
      assert.equal(Number(answer), evidence.relations.at(-1).shapes.reduce((sum, shape) => sum + (shape === 'circle' ? circle : triangle), 0));
      assert.equal(evidence.relations.filter(relation => relation.total === null).length, 1);
      for (const [shape, name] of [['circle', '圆形'], ['triangle', '三角形']]) {
        assert.equal((html.match(new RegExp(`aria-label="${name}"`, 'g')) || []).length,
          evidence.relations.reduce((sum, relation) => sum + relation.shapes.filter(value => value === shape).length, 0) * 2);
      }
    } else if (family === 'N13') {
      if (stage === 1) {
        const [, paid, denomination] = activity.prompt.match(/一张(\d+)元纸币换成(\d+)元/);
        assert.equal(evidence.from, +paid);
        assert.equal(evidence.denomination, +denomination);
        assert.equal(Number(answer), +paid / +denomination);
      } else if (stage === 2) {
        const [, cost, paid] = activity.prompt.match(/买(\d+)元的东西，付(\d+)元/);
        assert.equal(evidence.cost, +cost);
        assert.equal(evidence.paid, +paid);
        assert.equal(Number(answer), +paid - +cost);
      } else {
        const [, fives, ones, target] = activity.prompt.match(/有(\d+)张5元纸币和(\d+)枚1元硬币。哪些方案能刚好付(\d+)元/);
        assert.deepEqual(evidence, { kind: 'moneyInventory', fives: +fives, ones: +ones });
        assert.deepEqual([...answer].sort(), activity.tokens.filter(token =>
          token.moneyValues.reduce((sum, value) => sum + value, 0) === +target
          && token.moneyValues.filter(value => value === 5).length <= +fives
          && token.moneyValues.filter(value => value === 1).length <= +ones,
        ).map(token => token.id).sort());
      }
    } else if (family === 'N14') {
      if (stage < 3) assert.equal(answer, `${evidence.clocks[0].hour}点${evidence.clocks[0].minute}分`);
      else assert.equal(Number(answer), (evidence.clocks[1].hour - evidence.clocks[0].hour) * 60 + evidence.clocks[1].minute - evidence.clocks[0].minute);
      const hourHands = [...html.matchAll(/<line x1="120" y1="120" x2="([^"]+)" y2="([^"]+)"[^>]+data-hand="hour"/g)];
      const minuteHands = [...html.matchAll(/<line x1="120" y1="120" x2="([^"]+)" y2="([^"]+)"[^>]+data-hand="minute"/g)];
      for (const [index, clock] of evidence.clocks.entries()) {
        assert.ok(Math.abs(+hourHands[index][1] - 120 - 45 * Math.sin((clock.hour % 12 + clock.minute / 60) * Math.PI / 6)) < 1e-8);
        assert.ok(Math.abs(+hourHands[index][2] - 120 + 45 * Math.cos((clock.hour % 12 + clock.minute / 60) * Math.PI / 6)) < 1e-8);
        assert.ok(Math.abs(+minuteHands[index][1] - 120 - 72 * Math.sin(clock.minute * Math.PI / 30)) < 1e-8);
        assert.ok(Math.abs(+minuteHands[index][2] - 120 + 72 * Math.cos(clock.minute * Math.PI / 30)) < 1e-8);
      }
    } else if (family === 'N15') {
      assert.equal(Number(answer), stage < 3 ? evidence.end - evidence.start : 2 * (evidence.rows + evidence.columns));
      if (stage < 3) assert.ok(html.includes(`left:${evidence.start / evidence.maximum * 100}%;width:${(evidence.end - evidence.start) / evidence.maximum * 100}%`));
    } else if (family === 'N16') {
      if (stage === 1) {
        const day = +activity.prompt.match(/(\d+)号/)[1];
        assert.equal(answer, '星期' + ['一', '二', '三', '四', '五', '六', '日'][(day - 1) % 7]);
      } else if (stage === 2) assert.equal(Number(answer), +activity.prompt.match(/(\d+)号/)[1] + 7);
      else {
        const [, day, interval] = activity.prompt.match(/(\d+)号浇第一次水，以后每过(\d+)天/);
        assert.equal(Number(answer), +day + 2 * interval);
      }
      assert.match(html, /<th>周一<\/th>/);
      assert.match(html, /<td>28<\/td>/);
    }
  }
  reports.push({
    family: group.rounds[0].primaryFamilyId, title: group.title, rounds: group.rounds.length,
    arithmeticAndRender: 'pass',
    ...(requireActionCue && group.rounds[0].primaryFamilyId === 'N10' ? { removalCueRegression: 'pass: only rounds 7–9, one removed block, no printed remainder' } : {}),
    // The visual finding is a manual source review, not an inferred test result.
    originalVisualFinding: group.rounds[0].primaryFamilyId === 'N10'
      ? '7–9 缺少原来/拿走一个的画面阶段标识（2026-11-14 修复前观察）'
      : 'none observed',
  });
}
console.log(JSON.stringify(reports, null, 2));
