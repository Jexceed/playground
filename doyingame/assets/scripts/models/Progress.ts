export const PROGRESS_STORAGE_KEY = "thinking-house-douyin-math-progress-v1";

export type ProgressLocation = { gameId: string; roundIndex: number };
export type ProgressV1 = {
  version: 1;
  completedGameIds: string[];
  completedRoundIds: string[];
  abilityTags: string[];
  lastLocation: ProgressLocation | null;
  updatedAt: number;
};

export type ProgressCatalogIndex = {
  gameIds: Set<string>;
  roundIds: Set<string>;
  roundCountByGame: Map<string, number>;
};

export function emptyProgress(now = Date.now()): ProgressV1 {
  return { version: 1, completedGameIds: [], completedRoundIds: [], abilityTags: [], lastLocation: null, updatedAt: now };
}

export function normalizeProgress(value: unknown, index: ProgressCatalogIndex, now = Date.now()): ProgressV1 {
  if (!isRecord(value) || value.version !== 1) return emptyProgress(now);
  const completedGameIds = stringArray(value.completedGameIds).filter((id) => index.gameIds.has(id));
  const completedRoundIds = stringArray(value.completedRoundIds).filter((id) => index.roundIds.has(id));
  const abilityTags = stringArray(value.abilityTags);
  let lastLocation: ProgressLocation | null = null;
  if (isRecord(value.lastLocation)) {
    const gameId = typeof value.lastLocation.gameId === "string" ? value.lastLocation.gameId : null;
    const roundIndex = value.lastLocation.roundIndex;
    const count = gameId ? index.roundCountByGame.get(gameId) : undefined;
    if (gameId && count && Number.isInteger(roundIndex) && (roundIndex as number) >= 0 && (roundIndex as number) < count) {
      lastLocation = { gameId, roundIndex: roundIndex as number };
    }
  }
  return {
    version: 1,
    completedGameIds: unique(completedGameIds),
    completedRoundIds: unique(completedRoundIds),
    abilityTags: unique(abilityTags),
    lastLocation,
    updatedAt: typeof value.updatedAt === "number" && value.updatedAt >= 0 ? value.updatedAt : now,
  };
}

export function completeRound(progress: ProgressV1, roundId: string, tags: string[], now = Date.now()): ProgressV1 {
  return { ...progress, completedRoundIds: unique([...progress.completedRoundIds, roundId]), abilityTags: unique([...progress.abilityTags, ...tags]), updatedAt: now };
}

export function completeGame(progress: ProgressV1, gameId: string, tags: string[], now = Date.now()): ProgressV1 {
  return { ...progress, completedGameIds: unique([...progress.completedGameIds, gameId]), abilityTags: unique([...progress.abilityTags, ...tags]), updatedAt: now };
}

export function saveLocation(progress: ProgressV1, lastLocation: ProgressLocation, now = Date.now()): ProgressV1 {
  return { ...progress, lastLocation, updatedAt: now };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
}
function unique(values: string[]) { return [...new Set(values)]; }
function isRecord(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
