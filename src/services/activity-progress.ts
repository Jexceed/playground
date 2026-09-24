import type { ActivitySet, CatalogLocation } from "../domain/activity";
import type { ProgressLog } from "../types";

export const ACTIVITY_PROGRESS_KEY = "thinking-island-activity-progress";
const LOCATION_KEY = "thinking-island-catalog-location";
type Store = Pick<Storage, "getItem" | "setItem">;
export type ActivityEvidence = {
  revision: number;
  attempts: number;
  correctAttempts: number;
  hints: number;
  reveals: number;
  restarts: number;
  checks?: number;
  skips: number;
  firstCompletedAt: number | null;
  lastUpdatedAt: number;
  recentEventIds: string[];
  observedAt?: number;
  observations?: Record<string, "independent" | "supported" | "notYet">;
};
export type ActivityProgress = {
  schemaVersion: 1;
  entries: Record<string, ActivityEvidence>;
};
export type EvidenceEvent =
  | { id: string; kind: "attempt"; correct: boolean }
  | { id: string; kind: "observation"; observations: Record<string,"independent"|"supported"|"notYet"> }
  | { id: string; kind: "hint" | "reveal" | "restart" | "skip" | "check" };
const empty = (): ActivityProgress => ({ schemaVersion: 1, entries: {} });
const natural = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;
function browserStore(): Store | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readActivityProgress(storage: Store | null = browserStore()): {
  progress: ActivityProgress;
  writable: boolean;
} {
  if (!storage) return { progress: empty(), writable: false };
  try {
    const raw = storage.getItem(ACTIVITY_PROGRESS_KEY);
    if (!raw) return { progress: empty(), writable: true };
    const value = JSON.parse(raw);
    if (
      value?.schemaVersion !== 1 ||
      !value.entries ||
      typeof value.entries !== "object" ||
      Array.isArray(value.entries)
    )
      return { progress: empty(), writable: false };
    for (const entry of Object.values(value.entries) as ActivityEvidence[]) {
      if (
        !entry ||
        ![
          "revision",
          "attempts",
          "correctAttempts",
          "hints",
          "reveals",
          "restarts",
          "skips",
          "lastUpdatedAt",
        ].every((k) => natural(entry[k as keyof ActivityEvidence]))
      )
        return { progress: empty(), writable: false };
      if(entry.observedAt!==undefined && (!natural(entry.observedAt) || !entry.observations || typeof entry.observations!=='object' || !Object.values(entry.observations).every(v=>['independent','supported','notYet'].includes(v))))return {progress:empty(),writable:false};
      if (entry.checks !== undefined && !natural(entry.checks)) return { progress: empty(), writable: false };
      if (
        entry.correctAttempts > entry.attempts ||
        !(entry.firstCompletedAt === null || natural(entry.firstCompletedAt)) ||
        !Array.isArray(entry.recentEventIds) ||
        !entry.recentEventIds.every((id) => typeof id === "string")
      )
        return { progress: empty(), writable: false };
    }
    return { progress: value, writable: true };
  } catch {
    return { progress: empty(), writable: false };
  }
}

export function recordActivityEvent(
  activityId: string,
  revision: number,
  event: EvidenceEvent,
  storage: Store | null = browserStore(),
  now = Date.now(),
): { progress: ActivityProgress; stored: boolean } {
  const read = readActivityProgress(storage);
  if (!read.writable || !storage)
    return { progress: read.progress, stored: false };
  const key = `${activityId}@${revision}`;
  const previous = read.progress.entries[key] ?? {
    revision,
    attempts: 0,
    correctAttempts: 0,
    hints: 0,
    reveals: 0,
    restarts: 0,
    skips: 0,
    firstCompletedAt: null,
    lastUpdatedAt: now,
    recentEventIds: [],
  };
  if (previous.recentEventIds.includes(event.id))
    return { progress: read.progress, stored: true };
  const entry: ActivityEvidence = {
    ...previous,
    lastUpdatedAt: now,
    recentEventIds: [...previous.recentEventIds.slice(-79), event.id],
  };
  switch (event.kind) {
    case "observation":
      entry.observedAt = now;
      entry.observations = event.observations;
      break;
    case "attempt":
      entry.attempts++;
      if (event.correct) {
        entry.correctAttempts++;
        entry.firstCompletedAt ??= now;
      }
      break;
    case "hint":
      entry.hints++;
      break;
    case "reveal":
      entry.reveals++;
      break;
    case "restart":
      entry.restarts++;
      break;
    case "check":
      entry.checks = (entry.checks ?? 0) + 1;
      break;
    case "skip":
      entry.skips++;
      break;
  }
  const progress: ActivityProgress = {
    schemaVersion: 1,
    entries: { ...read.progress.entries, [key]: entry },
  };
  try {
    storage.setItem(ACTIVITY_PROGRESS_KEY, JSON.stringify(progress));
    return { progress, stored: true };
  } catch {
    return { progress: read.progress, stored: false };
  }
}

export function clearActivityProgress(storage: Store | null = browserStore()): {
  progress: ActivityProgress;
  stored: boolean;
} {
  const read = readActivityProgress(storage);
  if (!read.writable || !storage)
    return { progress: read.progress, stored: false };
  try {
    const progress = empty();
    storage.setItem(ACTIVITY_PROGRESS_KEY, JSON.stringify(progress));
    return { progress, stored: true };
  } catch {
    return { progress: read.progress, stored: false };
  }
}

export function mergeActivityProgress(
  legacy: ProgressLog,
  sets: ActivitySet[],
  progress: ActivityProgress,
): ProgressLog {
  const games = new Set(legacy.completedIds),
    rounds = new Set(legacy.completedRoundIds),
    tags = new Set(legacy.abilityTags);
  for (const set of sets) {
    for (const round of set.rounds) {
      if (
        (progress.entries[`${round.id}@${round.revision}`]?.correctAttempts ??
          0) > 0 || progress.entries[`${round.id}@${round.revision}`]?.observedAt !== undefined
      ) {
        rounds.add(round.id);
        round.abilityTags.forEach((tag) => tags.add(tag));
      }
    }
    if (
      set.rounds.every(
        (r) =>
          (progress.entries[`${r.id}@${r.revision}`]?.correctAttempts ?? 0) > 0 || progress.entries[`${r.id}@${r.revision}`]?.observedAt !== undefined,
      )
    )
      games.add(set.id);
  }
  return {
    completedIds: [...games],
    completedRoundIds: [...rounds],
    abilityTags: [...tags],
  };
}

export function readCatalogLocation(
  storage: Store | null = browserStore(),
): CatalogLocation | null {
  try {
    const raw = storage?.getItem(LOCATION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return value?.schemaVersion === 1 &&
      ["math", "logic", "graphic", "memory", "language", "life"].includes(value.worldId) &&
      typeof value.gameId === "string" &&
      value.gameId &&
      typeof value.roundId === "string" &&
      value.roundId
      ? value
      : null;
  } catch {
    return null;
  }
}
export function saveCatalogLocation(
  location: CatalogLocation,
  storage: Store | null = browserStore(),
): boolean {
  if (!storage) return false;
  try {
    const old = storage.getItem(LOCATION_KEY);
    if (old) {
      const parsed = JSON.parse(old);
      if (parsed?.schemaVersion !== 1) return false;
    }
    storage.setItem(LOCATION_KEY, JSON.stringify(location));
    return true;
  } catch {
    return false;
  }
}
