import { curriculumSections, getCurriculumSection, type CurriculumSectionId } from "../curriculum/catalog";
import type { CatalogLocation } from "../domain/activity";
import type { LastPlayLocation } from "../types";

export const CURRICULUM_NAVIGATION_KEY = "thinking-island-curriculum-navigation";
type Store = Pick<Storage, "getItem" | "setItem">;
export type CurriculumNavigation = {
  schemaVersion: 2;
  activeSectionId: CurriculumSectionId;
  locations: Record<CurriculumSectionId, CatalogLocation>;
  gameLocations: Record<string, CatalogLocation>;
};
type SectionNavigation = Omit<CurriculumNavigation, "schemaVersion" | "gameLocations"> & { schemaVersion: 1 };

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

function isNavigation(value: unknown): value is CurriculumNavigation | SectionNavigation {
  if (!value || typeof value !== "object") return false;
  const nav = value as Partial<Omit<CurriculumNavigation, "schemaVersion">> & { schemaVersion?: unknown };
  if (!isSectionId(nav.activeSectionId) || !nav.locations
    || !curriculumSections.every(section => isLocation(nav.locations?.[section.id]))) return false;
  if (nav.schemaVersion === 1) return true;
  return nav.schemaVersion === 2 && !!nav.gameLocations && typeof nav.gameLocations === "object"
    && !Array.isArray(nav.gameLocations)
    && Object.entries(nav.gameLocations).every(([id, location]) => isLocation(location) && location.gameId === id);
}

/** Missing questions start at the selected group's beginning, never another group. */
export function resolveGamePlayLocation(sectionId: CurriculumSectionId, gameId: string, location?: CatalogLocation): LastPlayLocation {
  const section = getCurriculumSection(sectionId);
  const game = section.games.find(item => item.id === gameId) ?? section.games[0];
  const index = location?.gameId === game.id && location.worldId === game.world
    ? game.rounds.findIndex(round => round.id === location.roundId) : -1;
  return { worldId: game.world, gameId: game.id, roundIndex: Math.max(0, index) };
}

/** Removed or mismatched groups fall back inside the requested section only. */
export function resolveSectionPlayLocation(sectionId: CurriculumSectionId, location?: CatalogLocation): LastPlayLocation {
  const section = getCurriculumSection(sectionId);
  const game = section.games.find(item => item.id === location?.gameId && item.world === location.worldId);
  return resolveGamePlayLocation(sectionId, game?.id ?? section.games[0].id, game ? location : undefined);
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
    schemaVersion: 2,
    activeSectionId: "enlightenment",
    locations: Object.fromEntries(curriculumSections.map(section => [
      section.id, stableLocation(resolveSectionPlayLocation(section.id)),
    ])) as CurriculumNavigation["locations"],
    gameLocations: {},
  };
  // Seed both previous locations, without changing either legacy storage key.
  if (legacy) {
    const game = getCurriculumSection("enlightenment").games.find(item => item.id === legacy.gameId && item.world === legacy.worldId);
    if (game) {
      const roundIndex = Number.isInteger(legacy.roundIndex) ? Math.min(Math.max(legacy.roundIndex, 0), game.rounds.length - 1) : 0;
      const location = stableLocation({ ...legacy, roundIndex });
      navigation.locations.enlightenment = location;
      navigation.gameLocations[game.id] = location;
    }
  }
  if (stable) {
    const owner = curriculumSections.find(section => section.games.some(game => game.id === stable.gameId && game.world === stable.worldId && game.rounds.some(round => round.id === stable.roundId)));
    if (owner) {
      navigation.activeSectionId = owner.id;
      navigation.locations[owner.id] = stable;
      navigation.gameLocations[stable.gameId] = stable;
    }
  }
  try {
    const raw = storage?.getItem(CURRICULUM_NAVIGATION_KEY);
    const saved: unknown = raw ? JSON.parse(raw) : null;
    if (isNavigation(saved)) {
      navigation.activeSectionId = saved.activeSectionId;
      if (saved.schemaVersion === 2) {
        for (const location of Object.values(saved.gameLocations)) {
          const owner = curriculumSections.find(section => section.games.some(game => game.id === location.gameId && game.world === location.worldId));
          if (owner) navigation.gameLocations[location.gameId] = stableLocation(resolveGamePlayLocation(owner.id, location.gameId, location));
        }
      }
      for (const section of curriculumSections) {
        navigation.locations[section.id] = stableLocation(resolveSectionPlayLocation(section.id, saved.locations[section.id]));
      }
    }
  } catch { /* Keep valid old positions when the new storage cannot be read. */ }
  for (const location of Object.values(navigation.locations)) navigation.gameLocations[location.gameId] = location;
  return navigation;
}

export function rememberCurriculumLocation(
  previous: CurriculumNavigation,
  sectionId: CurriculumSectionId,
  location: CatalogLocation,
): CurriculumNavigation {
  const resolved = stableLocation(resolveSectionPlayLocation(sectionId, location));
  return {
    schemaVersion: 2, activeSectionId: sectionId,
    locations: { ...previous.locations, [sectionId]: resolved },
    gameLocations: { ...previous.gameLocations, [resolved.gameId]: resolved },
  };
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
