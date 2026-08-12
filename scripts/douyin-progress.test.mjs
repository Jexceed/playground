import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const progress = await importTypeScript("doyingame/assets/scripts/models/Progress.ts");
const index = {
  gameIds: new Set(["math-a"]),
  roundIds: new Set(["round-1", "round-2"]),
  roundCountByGame: new Map([["math-a", 2]]),
};

test("missing, corrupt, and unknown progress safely become empty", () => {
  for (const value of [null, "bad", [], {}, { version: 99 }, { version: 1, completedGameIds: "bad" }]) {
    const actual = progress.normalizeProgress(value, index, 100);
    assert.equal(actual.version, 1);
    assert.deepEqual(actual.completedGameIds, []);
    assert.deepEqual(actual.completedRoundIds, []);
    assert.equal(actual.lastLocation, null);
  }
});

test("valid progress is deduplicated and out-of-scope IDs are removed", () => {
  const actual = progress.normalizeProgress({
    version: 1,
    completedGameIds: ["math-a", "math-a", "logic-x"],
    completedRoundIds: ["round-1", "round-1", "other"],
    abilityTags: ["数数", "数数"],
    lastLocation: { gameId: "math-a", roundIndex: 1 },
    updatedAt: 50,
  }, index, 100);
  assert.deepEqual(actual.completedGameIds, ["math-a"]);
  assert.deepEqual(actual.completedRoundIds, ["round-1"]);
  assert.deepEqual(actual.abilityTags, ["数数"]);
  assert.deepEqual(actual.lastLocation, { gameId: "math-a", roundIndex: 1 });
});

test("completion mutations retain unique IDs and tags", () => {
  let value = progress.emptyProgress(1);
  value = progress.completeRound(value, "round-1", ["数数", "基数"], 2);
  value = progress.completeRound(value, "round-1", ["数数"], 3);
  value = progress.completeGame(value, "math-a", ["基数"], 4);
  value = progress.saveLocation(value, { gameId: "math-a", roundIndex: 1 }, 5);
  assert.deepEqual(value.completedRoundIds, ["round-1"]);
  assert.deepEqual(value.completedGameIds, ["math-a"]);
  assert.deepEqual(value.abilityTags, ["数数", "基数"]);
  assert.equal(value.updatedAt, 5);
});

async function importTypeScript(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}
