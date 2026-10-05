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
    ["启蒙", 40, 489], ["探索", 75, 621],
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

test("each group keeps its own last question across switching and a fresh read", () => {
  const store = new Store();
  store.setItem("thinking-island-progress", "original completion facts");
  store.setItem("thinking-island-activity-progress", "original attempt facts");
  const [a, b] = catalog.getCurriculumSection("enlightenment").games;
  const [c, d] = catalog.getCurriculumSection("exploration").games;
  let nav = api.readCurriculumNavigation(null, null, store);
  for (const [section, game, index] of [["enlightenment", a, 4], ["enlightenment", b, 6], ["exploration", c, 2], ["exploration", d, 5]]) {
    nav = api.rememberCurriculumLocation(nav, section, position(game, index));
  }
  assert.equal(api.saveCurriculumNavigation(nav, store), true);
  const restored = api.readCurriculumNavigation(null, null, store);
  assert.equal(restored.activeSectionId, "exploration");
  assert.deepEqual(restored.locations.exploration, position(d, 5));
  for (const [section, game, index] of [["enlightenment", a, 4], ["enlightenment", b, 6], ["exploration", c, 2], ["exploration", d, 5]]) {
    assert.deepEqual(api.resolveGamePlayLocation(section, game.id, restored.gameLocations[game.id]), {
      worldId: game.world, gameId: game.id, roundIndex: index,
    });
  }
  assert.equal(store.getItem("thinking-island-progress"), "original completion facts");
  assert.equal(store.getItem("thinking-island-activity-progress"), "original attempt facts");
});

test("explicit reset changes only the selected group's remembered question", () => {
  const [a, b] = catalog.getCurriculumSection("enlightenment").games;
  let nav = api.readCurriculumNavigation();
  nav = api.rememberCurriculumLocation(nav, "enlightenment", position(a, 4));
  nav = api.rememberCurriculumLocation(nav, "enlightenment", position(b, 6));
  const before = JSON.stringify(nav);
  const reset = api.rememberCurriculumLocation(nav, "enlightenment", position(a, 0));
  assert.equal(JSON.stringify(nav), before, "updating a location must not mutate the prior snapshot");
  assert.deepEqual(reset.gameLocations[a.id], position(a, 0));
  assert.deepEqual(reset.gameLocations[b.id], position(b, 6));
  assert.deepEqual(reset.locations.enlightenment, position(a, 0));
});

test("group resolution follows the stable question ID and stays inside the selected group", () => {
  const [a, b, unvisited] = catalog.getCurriculumSection("exploration").games;
  const resolve = saved => api.resolveGamePlayLocation("exploration", b.id, saved);
  assert.deepEqual(resolve({ ...position(b, 3), roundIndex: 0 }), { worldId: b.world, gameId: b.id, roundIndex: 3 });
  for (const saved of [undefined, position(a, 3), { ...position(b, 3), roundId: "removed-question" }]) {
    assert.deepEqual(resolve(saved), { worldId: b.world, gameId: b.id, roundIndex: 0 });
  }
  assert.equal(api.resolveGamePlayLocation("exploration", unvisited.id).roundIndex, 0);
  assert.equal(api.resolveGamePlayLocation("enlightenment", b.id, position(b, 3)).gameId, first("enlightenment").id);
  assert.deepEqual(api.resolveSectionPlayLocation("exploration", { ...position(b, 3), roundId: "removed-question" }), {
    worldId: b.world, gameId: b.id, roundIndex: 0,
  });
});

test("schema 1 migrates known section and legacy group positions without rewriting on read", () => {
  const store = new Store();
  const [old, sectionGame] = catalog.getCurriculumSection("enlightenment").games;
  const newer = first("exploration");
  const raw = JSON.stringify({ schemaVersion: 1, activeSectionId: "enlightenment", locations: {
    enlightenment: position(sectionGame, 7), exploration: position(newer, 4),
  } });
  store.setItem(api.CURRICULUM_NAVIGATION_KEY, raw);
  const nav = api.readCurriculumNavigation({ worldId: old.world, gameId: old.id, roundIndex: 3 }, position(newer, 0), store);
  assert.equal(nav.schemaVersion, 2);
  assert.deepEqual(nav.gameLocations[old.id], position(old, 3));
  assert.deepEqual(nav.gameLocations[sectionGame.id], position(sectionGame, 7));
  assert.deepEqual(nav.gameLocations[newer.id], position(newer, 4));
  assert.equal(store.getItem(api.CURRICULUM_NAVIGATION_KEY), raw);
  assert.equal(api.saveCurriculumNavigation(nav, store), true);
  assert.equal(JSON.parse(store.getItem(api.CURRICULUM_NAVIGATION_KEY)).schemaVersion, 2);
  assert.deepEqual(api.readCurriculumNavigation(null, null, store), nav);
});

test("invalid schema-2 maps are preserved and cannot overwrite other navigation history", () => {
  const store = new Store();
  const a = first("enlightenment"), b = first("exploration");
  const base = { schemaVersion: 2, activeSectionId: "exploration", locations: {
    enlightenment: position(a, 3), exploration: position(b, 4),
  } };
  for (const gameLocations of [null, [], { [a.id]: position(b, 2) }, { [a.id]: { ...position(a, 2), roundId: null } }]) {
    const raw = JSON.stringify({ ...base, gameLocations });
    store.setItem(api.CURRICULUM_NAVIGATION_KEY, raw);
    const fallback = api.readCurriculumNavigation(null, null, store);
    assert.equal(api.saveCurriculumNavigation(fallback, store), false);
    assert.equal(store.getItem(api.CURRICULUM_NAVIGATION_KEY), raw);
  }
});

test("removed questions or groups do not discard the other groups' saved positions", () => {
  const store = new Store();
  const [a, b] = catalog.getCurriculumSection("enlightenment").games;
  let nav = api.readCurriculumNavigation();
  nav = api.rememberCurriculumLocation(nav, "enlightenment", position(a, 4));
  nav = api.rememberCurriculumLocation(nav, "enlightenment", position(b, 6));
  const removed = { ...position(b, 6), roundId: "removed-question" };
  nav.locations.enlightenment = removed;
  nav.gameLocations[b.id] = removed;
  nav.gameLocations["removed-group"] = { ...position(a, 4), gameId: "removed-group" };
  store.setItem(api.CURRICULUM_NAVIGATION_KEY, JSON.stringify(nav));
  const restored = api.readCurriculumNavigation(null, null, store);
  assert.deepEqual(restored.locations.enlightenment, position(b, 0));
  assert.deepEqual(restored.gameLocations[b.id], position(b, 0));
  assert.deepEqual(restored.gameLocations[a.id], position(a, 4));
  assert.equal(restored.gameLocations["removed-group"], undefined);
});
