import { buildMathIslandExport, RUNTIME_ROOT } from "./lib/douyin-math-export.mjs";

const result = await buildMathIslandExport();
console.log(JSON.stringify({
  output: RUNTIME_ROOT,
  games: result.world.gameCount,
  rounds: result.world.roundCount,
  assets: result.assets.entries.length,
  assetMB: Number((result.assets.totalBytes / 1024 / 1024).toFixed(2)),
  contentDigest: result.contentDigest,
}, null, 2));
