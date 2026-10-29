import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('reference-only report separates original supplements from benchmark families and leaves historical evidence untouched', () => {
  const directory = mkdtempSync(join(tmpdir(), 'thinking-house-reference-'));
  const historicalPaths = [
    'specs/029-curriculum-benchmark/verification/coverage-report.json',
    'specs/029-curriculum-benchmark/authoring/source-decisions.json',
    'specs/029-curriculum-benchmark/authoring/E06.md',
  ];
  const historical = historicalPaths.map(path => readFileSync(path, 'utf8'));
  try {
    const output = join(directory, 'coverage.json');
    execFileSync(process.execPath, ['scripts/audit-reference-coverage.mjs', '--report-only', '--output', output], { encoding: 'utf8' });
    const report = JSON.parse(readFileSync(output, 'utf8'));
    assert.deepEqual(report.problems, []);
    assert.equal(report.adoptedFamilies, 71);
    assert.equal(report.authoredFamilies, 71);
    assert.equal(report.originalNewActivities, 597);
    assert.equal(report.referenceAlignedActivities, 597);
    assert.equal(report.pilotActivitiesRetained, 24);
    assert.equal(report.originalSupplementActivities, 12);
    assert.equal(report.totalExplorationActivities, 633);
    assert.equal(report.totalExplorationActivities, report.referenceAlignedActivities + report.pilotActivitiesRetained + report.originalSupplementActivities);
    assert.equal(report.legacyActivitiesUnchanged, 489);
    assert.equal(report.claimsAllSourceTasksCovered, false);
    assert.equal(report.families.flatMap(family => family.activities).length, 597);
    assert.ok(report.families.every(family => family.activities.every(id => !id.startsWith('everyday-english-'))));
    assert.deepEqual(historicalPaths.map(path => readFileSync(path, 'utf8')), historical);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
