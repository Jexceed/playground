import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  DOUYIN_APP_ID,
  EXPECTED_GAME_IDS,
  EXPECTED_ROUND_COUNT,
  readGeneratedCatalog,
  RUNTIME_ASSET_BUDGET_BYTES,
  RUNTIME_ROOT,
  RUNTIME_VOICE_BITRATE_KBPS,
  RUNTIME_VOICE_SAMPLE_RATE,
  verifyAssetEntry,
} from "./lib/douyin-math-export.mjs";
import { inspectVoiceFile } from "./lib/voice-media-quality.mjs";

const catalog = await readGeneratedCatalog();
const problems = [];
const gameIds = catalog.games.map((game) => game.id);
if (JSON.stringify(gameIds) !== JSON.stringify(EXPECTED_GAME_IDS)) problems.push(`Unexpected game IDs: ${gameIds.join(", ")}`);
const rounds = catalog.games.flatMap((game) => game.rounds);
if (rounds.length !== EXPECTED_ROUND_COUNT) problems.push(`Expected ${EXPECTED_ROUND_COUNT} rounds; got ${rounds.length}`);
for (const game of catalog.games) {
  if (!game.id.startsWith("math-")) problems.push(`Non-math game ${game.id}`);
  for (const round of game.rounds) {
    if (!round.choices.some((choice) => choice.value === round.answer)) problems.push(`${round.id}: answer is not a choice`);
    for (const key of ["prompt", "success", "retry", "parent"]) if (!round.voice?.[key]?.src) problems.push(`${round.id}: missing ${key} voice`);
    for (const choice of round.choices) if (!round.voice?.choices?.[choice.value]?.src) problems.push(`${round.id}: missing choice voice ${choice.value}`);
  }
}

const manifest = catalog.assets;
const voiceTextByPath = new Map();
for (const game of catalog.games) {
  for (const reference of Object.values(game.voice)) voiceTextByPath.set(reference.src, reference.text);
  for (const round of game.rounds) {
    for (const reference of [round.voice.prompt, round.voice.success, round.voice.retry, round.voice.parent, ...Object.values(round.voice.choices)]) {
      voiceTextByPath.set(reference.src, reference.text);
    }
  }
}
if (!manifest?.entries?.length) problems.push("Asset manifest is empty");
let verifiedBytes = 0;
for (const entry of manifest.entries ?? []) {
  if (/source\//.test(entry.sourcePath) || /source\//.test(entry.runtimePath)) problems.push(`${entry.runtimePath}: source asset is forbidden`);
  if (/logic-|graphic-workshop/.test(entry.runtimePath)) problems.push(`${entry.runtimePath}: non-math asset is forbidden`);
  try {
    const actual = await verifyAssetEntry(entry);
    verifiedBytes += actual.bytes;
    if (actual.bytes !== entry.bytes) problems.push(`${entry.runtimePath}: byte count mismatch`);
    if (actual.sha256 !== entry.sha256) problems.push(`${entry.runtimePath}: sha256 mismatch`);
    if (entry.kind === "audio") {
      const media = await inspectVoiceFile(actual.path, voiceTextByPath.get(entry.runtimePath) ?? "");
      for (const problem of media.problems) problems.push(`${entry.runtimePath}: ${problem}`);
      if (media.bitrateKbps > RUNTIME_VOICE_BITRATE_KBPS) problems.push(`${entry.runtimePath}: ${media.bitrateKbps} kbps exceeds runtime target`);
      if (media.sampleRate !== RUNTIME_VOICE_SAMPLE_RATE) problems.push(`${entry.runtimePath}: expected ${RUNTIME_VOICE_SAMPLE_RATE} Hz; got ${media.sampleRate}`);
    }
    if (entry.kind === "image" && entry.runtimePath.includes("images/scenes/")) {
      const bytes = await readFile(actual.path);
      if (bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 675) problems.push(`${entry.runtimePath}: scene must remain 1200x675`);
    }
  } catch (error) {
    problems.push(`${entry.runtimePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (verifiedBytes !== manifest.totalBytes) problems.push(`Manifest totalBytes ${manifest.totalBytes} != ${verifiedBytes}`);
if (manifest.totalBytes > RUNTIME_ASSET_BUDGET_BYTES) problems.push(`Runtime assets exceed 14MB engineering budget: ${(manifest.totalBytes / 1024 / 1024).toFixed(2)}MB`);

const builder = JSON.parse(await readFile("doyingame/profiles/v2/packages/builder.json", "utf8"));
if (builder["bytedance-mini-game"]?.appid !== DOUYIN_APP_ID) problems.push("Builder AppID does not match the approved app");
if (builder["bytedance-mini-game"]?.orientation !== "portrait") problems.push("Builder orientation is not portrait");

const buildConfig = JSON.parse(await readFile("doyingame/build-configs/bytedance-mini-game.json", "utf8"));
if (buildConfig.startScene !== "f361a3c9-906d-4fdf-b84a-b5d076e8b812") problems.push("Build config start scene is not Main.scene");
if (buildConfig.packages?.["bytedance-mini-game"]?.appid !== DOUYIN_APP_ID) problems.push("Build config AppID does not match the approved app");
if (buildConfig.packages?.["bytedance-mini-game"]?.orientation !== "portrait") problems.push("Build config orientation is not portrait");

const engine = JSON.parse(await readFile("doyingame/settings/v2/packages/engine.json", "utf8"));
const modules = engine.modules?.configs?.defaultConfig?.includeModules ?? [];
for (const required of ["2d", "ui", "mask", "graphics", "audio"]) {
  if (!modules.includes(required)) problems.push(`Engine module ${required} is required`);
}
for (const forbidden of ["3d", "physics-ammo", "physics-physx", "video", "webview", "spine-3.8", "dragon-bones"]) {
  if (modules.includes(forbidden)) problems.push(`Unused engine module ${forbidden} must be cropped`);
}

const summary = {
  appId: DOUYIN_APP_ID,
  games: gameIds.length,
  rounds: rounds.length,
  assets: manifest.entries?.length ?? 0,
  runtimeAssetMB: Number((manifest.totalBytes / 1024 / 1024).toFixed(2)),
  problems,
};
console.log(JSON.stringify(summary, null, 2));
if (problems.length) process.exitCode = 1;
