import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";
const api = await loadTypeScriptModule("src/services/activity-progress.ts");
class Store {
  data = new Map();
  getItem(key) {
    return this.data.get(key) ?? null;
  }
  setItem(key, value) {
    this.data.set(key, value);
  }
}
test("evidence events are idempotent and do not alter legacy records", () => {
  const store = new Store();
  store.setItem("thinking-island-progress", '{"completedIds":["old-game"]}');
  const event = { id: "visit:attempt:1", kind: "attempt", correct: true };
  api.recordActivityEvent("new-task", 1, event, store, 100);
  api.recordActivityEvent("new-task", 1, event, store, 200);
  api.recordActivityEvent(
    "new-task",
    1,
    { id: "visit:hint:1", kind: "hint" },
    store,
    300,
  );
  const entry = api.readActivityProgress(store).progress.entries["new-task@1"];
  assert.equal(entry.attempts, 1);
  assert.equal(entry.correctAttempts, 1);
  assert.equal(entry.hints, 1);
  assert.equal(entry.firstCompletedAt, 100);
  assert.equal(
    store.getItem("thinking-island-progress"),
    '{"completedIds":["old-game"]}',
  );
  assert.equal(
    api.readActivityProgress(store).progress.entries["new-task@2"],
    undefined,
  );
});
test("future and malformed data are not overwritten", () => {
  for (const raw of [
    '{"schemaVersion":99,"entries":{}}',
    "not json",
    '{"schemaVersion":1,"entries":{"bad":{"attempts":-4}}}',
  ]) {
    const store = new Store();
    store.setItem(api.ACTIVITY_PROGRESS_KEY, raw);
    const result = api.recordActivityEvent(
      "new-task",
      1,
      { id: "event", kind: "hint" },
      store,
      100,
    );
    assert.equal(result.stored, false);
    assert.equal(store.getItem(api.ACTIVITY_PROGRESS_KEY), raw);
  }
});
test("stable location uses IDs and leaves the old location untouched", () => {
  const store = new Store();
  store.setItem("thinking-island-last-play-location", "old");
  const location = {
    schemaVersion: 1,
    worldId: "logic",
    gameId: "lineup",
    roundId: "lineup-middle",
  };
  assert.equal(api.saveCatalogLocation(location, store), true);
  assert.deepEqual(api.readCatalogLocation(store), location);
  assert.equal(store.getItem("thinking-island-last-play-location"), "old");
});
test("completion display merges evidence without converting old game-level completion into rounds", () => {
  const old = {
    completedIds: ["old-game"],
    completedRoundIds: [],
    abilityTags: [],
  };
  const set = {
    id: "new-game",
    rounds: [
      { id: "a", revision: 1, abilityTags: ["排序"] },
      { id: "b", revision: 1, abilityTags: ["推理"] },
    ],
    abilityTags: ["排序", "推理"],
  };
  const store = new Store();
  api.recordActivityEvent(
    "a",
    1,
    { id: "e1", kind: "attempt", correct: true },
    store,
    100,
  );
  const progress = api.mergeActivityProgress(
    old,
    [set],
    api.readActivityProgress(store).progress,
  );
  assert.deepEqual(progress.completedIds, ["old-game"]);
  assert.deepEqual(progress.completedRoundIds, ["a"]);
  api.recordActivityEvent(
    "b",
    1,
    { id: "e2", kind: "attempt", correct: true },
    store,
    200,
  );
  assert.deepEqual(
    api.mergeActivityProgress(
      old,
      [set],
      api.readActivityProgress(store).progress,
    ).completedIds,
    ["old-game", "new-game"],
  );
  assert.deepEqual(old.completedRoundIds, []);
});
