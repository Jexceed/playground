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

test("published curriculum changes retain old evidence and require a new attempt only for revised tasks", async () => {
  const { activitySets } = await loadTypeScriptModule("src/curriculum/catalog.ts");
  const { beforeAppealAndDifficulty } = await import("./lib/before-curriculum-review.mjs");
  const oldSets = beforeAppealAndDifficulty(activitySets);
  const current = new Map(activitySets.flatMap(set => set.rounds).map(round => [round.id, round]));
  const store = new Store();
  const legacy = { completedIds: [], completedRoundIds: [], abilityTags: [] };
  const changed = new Set();
  const entries = {};
  for (const old of oldSets.flatMap(set => set.rounds)) {
    const live = current.get(old.id);
    assert.ok(live, old.id);
    if (live.revision !== old.revision) {
      assert.equal(live.revision, old.revision + 1, old.id);
      changed.add(old.id);
    }
    const observed = old.kind === "parentObservation";
    entries[`${old.id}@${old.revision}`] = {
      revision: old.revision, attempts: observed ? 0 : 1, correctAttempts: observed ? 0 : 1,
      hints: 0, reveals: 0, restarts: 0, skips: 0, firstCompletedAt: 1, lastUpdatedAt: 1,
      recentEventIds: ["old"], ...(observed ? { observedAt: 1, observations: { first: "supported" } } : {}),
    };
  }
  for (const id of ["explore-make-break-ten-6", "explore-multi-agent-movement-8", "explore-shape-assembly-9",
    "explore-character-phonics-7", "explore-culture-world-2"]) assert.ok(changed.has(id), id);
  for (const id of ["explore-make-break-ten-1", "explore-multi-agent-movement-7", "explore-character-phonics-1"]) {
    assert.ok(current.has(id) && !changed.has(id), id);
  }

  store.setItem(api.ACTIVITY_PROGRESS_KEY, JSON.stringify({ schemaVersion: 1, entries }));
  const saved = api.readActivityProgress(store);
  assert.ok(saved.writable);
  const displayed = api.mergeActivityProgress(legacy, activitySets, saved.progress);
  for (const round of current.values()) assert.equal(displayed.completedRoundIds.includes(round.id), !changed.has(round.id), round.id);
  for (const set of activitySets) assert.equal(displayed.completedIds.includes(set.id), set.rounds.every(r => !changed.has(r.id)), set.id);

  const redo = current.get("explore-make-break-ten-6");
  const updated = api.recordActivityEvent(redo.id, redo.revision, { id: "new", kind: "attempt", correct: true }, store, 2);
  assert.ok(updated.stored);
  assert.deepEqual(updated.progress.entries[`${redo.id}@2`], entries[`${redo.id}@2`]);
  assert.equal(updated.progress.entries[`${redo.id}@3`].firstCompletedAt, 2);
  assert.ok(api.mergeActivityProgress(legacy, activitySets, updated.progress).completedRoundIds.includes(redo.id));
});
