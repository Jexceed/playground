import type { ProgressLog } from "./types";

const STORAGE_KEY = "thinking-island-progress";

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
