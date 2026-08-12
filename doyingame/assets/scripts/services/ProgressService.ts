import type { MathIslandCatalog } from "../models/MathIslandModels";
import { emptyProgress, normalizeProgress, PROGRESS_STORAGE_KEY, type ProgressCatalogIndex, type ProgressV1 } from "../models/Progress";
import type { PlatformAdapter } from "./PlatformAdapter";

export class ProgressService {
  private readonly index: ProgressCatalogIndex;
  constructor(private readonly platform: PlatformAdapter, catalog: MathIslandCatalog) {
    this.index = {
      gameIds: new Set(catalog.games.map((game) => game.id)),
      roundIds: new Set(catalog.games.flatMap((game) => game.rounds.map((round) => round.id))),
      roundCountByGame: new Map(catalog.games.map((game) => [game.id, game.rounds.length])),
    };
  }
  read(): ProgressV1 { return normalizeProgress(this.platform.readStorage(PROGRESS_STORAGE_KEY), this.index); }
  write(progress: ProgressV1) { this.platform.writeStorage(PROGRESS_STORAGE_KEY, normalizeProgress(progress, this.index)); }
  reset() { const value = emptyProgress(); this.write(value); return value; }
}
