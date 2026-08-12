import { JsonAsset, resources } from "cc";
import type { MathIslandCatalog } from "../models/MathIslandModels";

const CATALOG_PATH = "math-island/data/catalog";

export class CatalogService {
  async load(): Promise<MathIslandCatalog> {
    const asset = await new Promise<JsonAsset>((resolve, reject) => {
      resources.load(CATALOG_PATH, JsonAsset, (error, value) => error ? reject(error) : resolve(value));
    });
    return validateCatalog(asset.json);
  }
}

export function validateCatalog(value: unknown): MathIslandCatalog {
  if (!value || typeof value !== "object") throw new Error("数字岛数据不是对象");
  const catalog = value as MathIslandCatalog;
  if (catalog.schemaVersion !== 1) throw new Error(`不支持的数据版本：${String(catalog.schemaVersion)}`);
  if (catalog.world?.id !== "math" || catalog.games?.length !== 8 || catalog.world.roundCount !== 122) {
    throw new Error("数字岛数据范围不完整");
  }
  const gameIds = new Set<string>();
  const roundIds = new Set<string>();
  for (const game of catalog.games) {
    if (!game.id.startsWith("math-") || gameIds.has(game.id)) throw new Error(`无效游戏：${game.id}`);
    gameIds.add(game.id);
    for (const round of game.rounds) {
      if (roundIds.has(round.id)) throw new Error(`重复题目：${round.id}`);
      roundIds.add(round.id);
      if (!round.choices.some((choice) => choice.value === round.answer)) throw new Error(`题目答案不在选项中：${round.id}`);
    }
  }
  return catalog;
}
