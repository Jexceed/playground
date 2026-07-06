import type { LastPlayLocation, ProgressLog, WorldId } from "./types";

const STORAGE_KEY = "thinking-island-progress";
const LAST_PLAY_LOCATION_KEY = "thinking-island-last-play-location";

export function readProgress(): ProgressLog {
  const fallback: ProgressLog = { completedIds: [], completedRoundIds: [], abilityTags: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as ProgressLog;
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      completedRoundIds: Array.isArray(parsed.completedRoundIds) ? parsed.completedRoundIds : [],
      abilityTags: Array.isArray(parsed.abilityTags) ? parsed.abilityTags : [],
    };
  } catch {
    return fallback;
  }
}

export function saveProgress(progress: ProgressLog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function readLastPlayLocation(): LastPlayLocation | null {
  try {
    const raw = localStorage.getItem(LAST_PLAY_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastPlayLocation>;
    if (!isWorldId(parsed.worldId)) return null;
    if (typeof parsed.gameId !== "string" || !parsed.gameId.trim()) return null;
    const roundIndex = parsed.roundIndex;
    if (typeof roundIndex !== "number" || !Number.isInteger(roundIndex) || roundIndex < 0) return null;
    return {
      worldId: parsed.worldId,
      gameId: parsed.gameId,
      roundIndex,
    };
  } catch {
    return null;
  }
}

export function saveLastPlayLocation(location: LastPlayLocation) {
  localStorage.setItem(LAST_PLAY_LOCATION_KEY, JSON.stringify(location));
}

export function addCompletion(progress: ProgressLog, gameId: string, tags: string[]): ProgressLog {
  const completedIds = Array.from(new Set([...progress.completedIds, gameId]));
  const abilityTags = Array.from(new Set([...progress.abilityTags, ...tags]));
  return { ...progress, completedIds, abilityTags };
}

export function addRoundCompletion(progress: ProgressLog, roundId: string, tags: string[]): ProgressLog {
  const completedRoundIds = Array.from(new Set([...progress.completedRoundIds, roundId]));
  const abilityTags = Array.from(new Set([...progress.abilityTags, ...tags]));
  return { ...progress, completedRoundIds, abilityTags };
}

function isWorldId(value: unknown): value is WorldId {
  return value === "math" || value === "logic";
}
