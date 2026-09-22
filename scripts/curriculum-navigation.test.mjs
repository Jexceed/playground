import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";
const [catalog, api] = await Promise.all([
  loadTypeScriptModule("src/curriculum/catalog.ts"),
  loadTypeScriptModule("src/services/curriculum-navigation.ts"),
]);
class Store {
  data = new Map();
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, value); }
}
const first = id => catalog.getCurriculumSection(id).games[0];
const position = (game, index) => ({ schemaVersion: 1, worldId: game.world, gameId: game.id, roundId: game.rounds[index].id });

test("启蒙 and 探索 partition the complete catalog without duplicating or changing old questions", () => {
  const sections = catalog.curriculumSections;
  assert.deepEqual(sections.map(s => [s.name, s.games.length, s.games.reduce((n, g) => n + g.rounds.length, 0)]), [
    ["启蒙", 40, 489], ["探索", 4, 24],
  ]);
  assert.deepEqual(sections[0].games, catalog.legacyGames);
  assert.deepEqual(sections[1].games, catalog.activitySets);
  const ids = sections.flatMap(s => s.games.map(g => g.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, catalog.catalogGames.map(g => g.id));
});

test("both old locations seed their own sections without overwriting storage", () => {
  const store = new Store(), old = first("enlightenment"), newer = first("exploration");
  store.setItem("thinking-island-progress", "original completion facts");
  const before = [...store.data];
  const nav = api.readCurriculumNavigation({ worldId: old.world, gameId: old.id, roundIndex: 3 }, position(newer, 4), store);
  assert.equal(nav.activeSectionId, "exploration");
  assert.deepEqual(nav.locations.enlightenment, position(old, 3));
  assert.deepEqual(nav.locations.exploration, position(newer, 4));
  assert.deepEqual([...store.data], before);
});

test("switching sections and restarting preserves two independent stable positions", () => {
  const store = new Store(), old = first("enlightenment"), newer = first("exploration");
  let nav = api.readCurriculumNavigation(null, null, store);
  nav = api.rememberCurriculumLocation(nav, "enlightenment", position(old, 2));
  nav = api.rememberCurriculumLocation(nav, "exploration", position(newer, 5));
  assert.equal(api.saveCurriculumNavigation(nav, store), true);
  const restored = api.readCurriculumNavigation(null, position(old, 0), store);
  assert.equal(restored.activeSectionId, "exploration");
  assert.equal(api.resolveSectionPlayLocation("enlightenment", restored.locations.enlightenment).roundIndex, 2);
  assert.equal(api.resolveSectionPlayLocation("exploration", restored.locations.exploration).roundIndex, 5);
  const switched = api.rememberCurriculumLocation(restored, "enlightenment", restored.locations.enlightenment);
  assert.equal(switched.activeSectionId, "enlightenment");
  assert.deepEqual(switched.locations.exploration, position(newer, 5));
});

test("a saved question ID resolves regardless of a stale index and cannot cross section boundaries", () => {
  const newer = first("exploration");
  const saved = { ...position(newer, 4), roundIndex: 0 };
  assert.equal(api.resolveSectionPlayLocation("exploration", saved).roundIndex, 4);
  assert.equal(api.resolveSectionPlayLocation("enlightenment", saved).gameId, first("enlightenment").id);
  assert.equal(api.resolveSectionPlayLocation("exploration", { ...saved, roundId: "removed-round" }).roundIndex, 0);
});

test("future, corrupt and unavailable navigation storage is preserved with usable defaults", () => {
  for (const raw of ['{"schemaVersion":99}', "not json", '{"schemaVersion":1,"activeSectionId":"unknown"}']) {
    const store = new Store();
    store.setItem(api.CURRICULUM_NAVIGATION_KEY, raw);
    const nav = api.readCurriculumNavigation(null, null, store);
    assert.equal(nav.activeSectionId, "enlightenment");
    assert.equal(api.saveCurriculumNavigation(nav, store), false);
    assert.equal(store.getItem(api.CURRICULUM_NAVIGATION_KEY), raw);
  }
  const unavailable = { getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); } };
  assert.equal(api.saveCurriculumNavigation(api.readCurriculumNavigation(null, null, unavailable), unavailable), false);
});
