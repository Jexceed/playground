import { curriculumSections, getCurriculumSection, type CurriculumSectionId } from "../curriculum/catalog";
import type { CatalogLocation } from "../domain/activity";
import type { LastPlayLocation } from "../types";

export const CURRICULUM_NAVIGATION_KEY = "thinking-island-curriculum-navigation";
type Store = Pick<Storage, "getItem" | "setItem">;
export type CurriculumNavigation = {
  schemaVersion: 1;
  activeSectionId: CurriculumSectionId;
  locations: Record<CurriculumSectionId, CatalogLocation>;
};

function browserStore(): Store | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

function isSectionId(id: unknown): id is CurriculumSectionId {
  return curriculumSections.some(section => section.id === id);
}

function isLocation(value: unknown): value is CatalogLocation {
  if (!value || typeof value !== "object") return false;
  const location = value as Partial<CatalogLocation>;
  return location.schemaVersion === 1 && ["math", "logic", "graphic", "memory", "language", "life"].includes(location.worldId ?? "")
    && typeof location.gameId === "string" && typeof location.roundId === "string";
}

function isNavigation(value: unknown): value is CurriculumNavigation {
  if (!value || typeof value !== "object") return false;
  const nav = value as Partial<CurriculumNavigation>;
  return nav.schemaVersion === 1 && isSectionId(nav.activeSectionId) && !!nav.locations
    && curriculumSections.every(section => isLocation(nav.locations?.[section.id]));
}

/** Removed or mismatched content falls back inside the requested section only. */
export function resolveSectionPlayLocation(sectionId: CurriculumSectionId, location?: CatalogLocation): LastPlayLocation {
  const section = getCurriculumSection(sectionId);
  const game = section.games.find(item => item.id === location?.gameId && item.world === location.worldId);
  const index = game?.rounds.findIndex(round => round.id === location?.roundId) ?? -1;
  if (game && index >= 0) return { worldId: game.world, gameId: game.id, roundIndex: index };
  const first = section.games[0];
  return { worldId: first.world, gameId: first.id, roundIndex: 0 };
}

function stableLocation(play: LastPlayLocation): CatalogLocation {
  const game = curriculumSections.flatMap(section => section.games).find(item => item.id === play.gameId)!;
  return { schemaVersion: 1, worldId: game.world, gameId: game.id, roundId: game.rounds[play.roundIndex].id };
}

export function readCurriculumNavigation(
  legacy: LastPlayLocation | null = null,
  stable: CatalogLocation | null = null,
  storage: Store | null = browserStore(),
): CurriculumNavigation {
  const navigation: CurriculumNavigation = {
    schemaVersion: 1,
    activeSectionId: "enlightenment",
    locations: Object.fromEntries(curriculumSections.map(section => [
      section.id, stableLocation(resolveSectionPlayLocation(section.id)),
    ])) as CurriculumNavigation["locations"],
  };
  // Seed both previous locations, without changing either legacy storage key.
  if (legacy) {
    const game = getCurriculumSection("enlightenment").games.find(item => item.id === legacy.gameId && item.world === legacy.worldId);
    if (game) navigation.locations.enlightenment = stableLocation({ ...legacy,
      roundIndex: Math.min(Math.max(legacy.roundIndex, 0), game.rounds.length - 1) });
  }
  if (stable) {
    const owner = curriculumSections.find(section => section.games.some(game => game.id === stable.gameId && game.world === stable.worldId && game.rounds.some(round => round.id === stable.roundId)));
    if (owner) {
      navigation.activeSectionId = owner.id;
      navigation.locations[owner.id] = stable;
    }
  }
  try {
    const raw = storage?.getItem(CURRICULUM_NAVIGATION_KEY);
    const saved: unknown = raw ? JSON.parse(raw) : null;
    if (isNavigation(saved)) {
      navigation.activeSectionId = saved.activeSectionId;
      for (const section of curriculumSections) {
        navigation.locations[section.id] = stableLocation(resolveSectionPlayLocation(section.id, saved.locations[section.id]));
      }
    }
  } catch { /* Keep valid old positions when the new storage cannot be read. */ }
  return navigation;
}

export function rememberCurriculumLocation(
  previous: CurriculumNavigation,
  sectionId: CurriculumSectionId,
  location: CatalogLocation,
): CurriculumNavigation {
  return { schemaVersion: 1, activeSectionId: sectionId, locations: {
    ...previous.locations, [sectionId]: stableLocation(resolveSectionPlayLocation(sectionId, location)),
  } };
}

export function saveCurriculumNavigation(navigation: CurriculumNavigation, storage: Store | null = browserStore()): boolean {
  if (!storage) return false;
  try {
    const old = storage.getItem(CURRICULUM_NAVIGATION_KEY);
    if (old && !isNavigation(JSON.parse(old))) return false;
    storage.setItem(CURRICULUM_NAVIGATION_KEY, JSON.stringify(navigation));
    return true;
  } catch { return false; }
}
