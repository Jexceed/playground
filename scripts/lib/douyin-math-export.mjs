import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";

import { loadGameData } from "./load-game-data.mjs";
import { ensureCocosMetadata } from "./cocos-metadata.mjs";
import { inspectVoiceFile } from "./voice-media-quality.mjs";

export const DOUYIN_APP_ID = "tta51dd3a03b67523202";
export const EXPECTED_GAME_IDS = [
  "math-counting-cardinality",
  "math-subitize-match",
  "math-compare-equalize",
  "math-compose-decompose",
  "math-story-operations",
  "math-fair-share",
  "math-group-counting",
  "math-clock-time",
];
export const EXPECTED_ROUND_COUNT = 122;
export const RUNTIME_ROOT = "doyingame/assets/resources/math-island";
export const RUNTIME_ASSET_BUDGET_BYTES = 14 * 1024 * 1024;
export const RUNTIME_VOICE_BITRATE_KBPS = 32;
export const RUNTIME_VOICE_SAMPLE_RATE = 24_000;

const BRAND_IMAGE = "/images/brand/thinking-house-brand-v3.png";
const TOKEN_RENDERERS = {
  "🍓": image("/images/items/pattern-train/strawberry.png", "草莓"),
  "🍪": image("/images/items/pattern-train/cookie.png", "饼干"),
  "🍎": image("/images/items/pattern-train/apple.png", "苹果"),
  "🍊": image("/images/items/orange.png", "橘子"),
  "🧱": image("/images/items/block.png", "积木"),
  "⭐": image("/images/items/pattern-train/star.png", "星星"),
  "🍬": image("/images/items/candy.png", "糖果"),
  "🐟": image("/images/items/fish.png", "小鱼"),
  "🐦": image("/images/items/bird.png", "小鸟"),
  "🧁": image("/images/items/cupcake.png", "纸杯蛋糕"),
  "🧒": image("/images/items/child.png", "小朋友"),
  "🟡": shape("circle", "#f6c945", "黄色圆片"),
  "🟢": shape("circle", "#65b96e", "绿色圆片"),
  "🔵": shape("circle", "#4d8ed8", "蓝色圆片"),
  "🟣": shape("circle", "#8d63c7", "紫色圆片"),
  "🟦": shape("rounded-square", "#4d8ed8", "蓝色方块"),
  "": { kind: "empty", label: "空位" },
};

export async function buildMathIslandExport({ write = true } = {}) {
  const { games, worlds } = await loadGameData();
  const mathGames = structuredClone(games.filter((game) => game.world === "math"));
  const world = worlds.find((item) => item.id === "math");
  assertCatalog(mathGames, world);

  const voiceLines = JSON.parse(await readFile("public/audio/voice-lines.json", "utf8"));
  const voiceManifest = JSON.parse(await readFile("public/audio/voice/manifest.json", "utf8"));
  if (voiceManifest.failures?.length) throw new Error(`Voice manifest has ${voiceManifest.failures.length} failure(s)`);
  const voiceByKey = new Map(voiceManifest.entries.map((entry) => [voiceKey(entry.kind, entry.text), entry]));
  const voiceTextBySource = new Map(voiceManifest.entries.map((entry) => [entry.src, entry.text]));
  const lineByKey = new Map(voiceLines.lines.map((entry) => [voiceKey(entry.kind, entry.text), entry]));

  const imageContexts = new Map([[BRAND_IMAGE, new Set(["brand"])]]);
  const audioContexts = new Map();
  const exportedGames = mathGames.map((game) => exportGame(game, { voiceByKey, lineByKey, imageContexts, audioContexts }));
  const sourceRevision = getSourceRevision();
  const content = {
    world: {
      id: "math",
      name: world.name,
      summary: world.summary,
      gameCount: exportedGames.length,
      roundCount: exportedGames.reduce((sum, game) => sum + game.rounds.length, 0),
    },
    games: exportedGames,
    tokenRenderers: TOKEN_RENDERERS,
    brandImage: runtimeImagePath(BRAND_IMAGE),
  };
  const contentDigest = sha256(stableStringify(content));

  let assets = { version: 1, entries: [], totalBytes: 0 };
  if (write) {
    await resetGeneratedDirectories();
    const entries = [];
    for (const [sourcePath, contexts] of [...imageContexts].sort(([a], [b]) => a.localeCompare(b))) {
      entries.push(await copyRuntimeAsset({ kind: "image", sourcePath: `public${sourcePath}`, runtimePath: runtimeImagePath(sourcePath), contexts: [...contexts] }));
    }
    for (const [sourcePath, contexts] of [...audioContexts].sort(([a], [b]) => a.localeCompare(b))) {
      const decoded = decodeURIComponent(sourcePath);
      entries.push(await copyRuntimeAsset({
        kind: "audio",
        sourcePath: `public${decoded}`,
        runtimePath: runtimeAudioPath(decoded),
        contexts: [...contexts],
        voiceText: voiceTextBySource.get(sourcePath),
      }));
    }
    assets = { version: 1, entries, totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0) };
  }

  const envelope = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceRevision,
    world: content.world,
    games: content.games,
    tokenRenderers: content.tokenRenderers,
    brandImage: content.brandImage,
    assets,
    contentDigest,
  };

  if (write) {
    await mkdir(join(RUNTIME_ROOT, "data"), { recursive: true });
    await writeFile(join(RUNTIME_ROOT, "data/catalog.json"), `${JSON.stringify(envelope, null, 2)}\n`);
    await writeFile(join(RUNTIME_ROOT, "manifest.json"), `${JSON.stringify(assets, null, 2)}\n`);
    await ensureCocosMetadata(RUNTIME_ROOT);
  }
  return envelope;
}

function exportGame(game, dependencies) {
  const gameContext = game.id;
  return {
    id: game.id,
    title: game.title,
    subtitle: game.subtitle,
    goal: game.goal,
    parentPrompt: game.parentPrompt,
    abilityTags: game.abilityTags,
    level: game.level,
    voice: {
      title: resolveVoice("game-title", game.title, gameContext, dependencies),
      goal: resolveVoice("game-goal", game.goal, gameContext, dependencies),
    },
    rounds: game.rounds.map((round) => exportRound(game, round, dependencies)),
  };
}

function exportRound(game, round, dependencies) {
  const context = `${game.id}/${round.id}`;
  if (round.sceneImage?.src) addContext(dependencies.imageContexts, round.sceneImage.src, context);
  for (const item of round.visualGroups?.flatMap((group) => group.items) ?? []) {
    const renderer = TOKEN_RENDERERS[item];
    if (!renderer) throw new Error(`No Math Island renderer registered for token ${JSON.stringify(item)} in ${context}`);
    if (renderer.kind === "image") addContext(dependencies.imageContexts, renderer.source, context);
  }
  const result = {
    id: round.id,
    level: round.level,
    prompt: round.prompt,
    instruction: round.instruction,
    difficultyNote: round.difficultyNote,
    choices: round.choices,
    answer: round.answer,
    success: round.success,
    retry: round.retry,
    parentPrompt: round.parentPrompt,
    abilityTags: round.abilityTags,
    voice: {
      prompt: resolveVoice("prompt", joinVoiceLine(round.prompt, round.instruction), context, dependencies),
      success: resolveVoice("success", round.success, context, dependencies),
      retry: resolveVoice("retry", round.retry, context, dependencies),
      parent: resolveVoice("parent", round.parentPrompt, context, dependencies),
      choices: Object.fromEntries(round.choices.map((choice) => [choice.value, resolveVoice("choice", choice.label, context, dependencies)])),
    },
  };
  if (round.sceneImage) result.sceneImage = { ...round.sceneImage, src: runtimeImagePath(round.sceneImage.src) };
  if (round.visualGroups) result.visualGroups = round.visualGroups;
  if (round.clockChallenge) result.clockChallenge = round.clockChallenge;
  return result;
}

function resolveVoice(kind, text, context, { voiceByKey, lineByKey, audioContexts }) {
  const key = voiceKey(kind, text);
  const voice = voiceByKey.get(key);
  const line = lineByKey.get(key);
  if (!voice || !line) throw new Error(`Missing ${kind} voice for ${JSON.stringify(text)} in ${context}`);
  if (!line.contexts?.includes(context) && !line.contexts?.includes(context.split("/")[0])) {
    throw new Error(`Voice ${voice.id} does not declare context ${context}`);
  }
  addContext(audioContexts, voice.src, context);
  return { id: voice.id, text: voice.text, src: runtimeAudioPath(decodeURIComponent(voice.src)) };
}

function assertCatalog(games, world) {
  if (!world) throw new Error("Math world is missing");
  const ids = games.map((game) => game.id);
  if (JSON.stringify(ids) !== JSON.stringify(EXPECTED_GAME_IDS)) {
    throw new Error(`Expected Math Island game IDs ${EXPECTED_GAME_IDS.join(", ")}; got ${ids.join(", ")}`);
  }
  const roundCount = games.reduce((sum, game) => sum + game.rounds.length, 0);
  if (roundCount !== EXPECTED_ROUND_COUNT) throw new Error(`Expected ${EXPECTED_ROUND_COUNT} Math Island rounds; got ${roundCount}`);
  const roundIds = new Set();
  for (const game of games) {
    for (const round of game.rounds) {
      if (roundIds.has(round.id)) throw new Error(`Duplicate round ID ${round.id}`);
      roundIds.add(round.id);
      if (!round.choices.some((choice) => choice.value === round.answer)) throw new Error(`${round.id} answer is not a choice`);
      const unsupported = ["sequence", "grid", "matrix", "memory", "graphicChallenge"].filter((field) => round[field]);
      if (unsupported.length) throw new Error(`${round.id} has unsupported Math Island surface(s): ${unsupported.join(", ")}`);
    }
  }
}

async function resetGeneratedDirectories() {
  for (const name of ["data", "images", "audio"]) await rm(join(RUNTIME_ROOT, name), { recursive: true, force: true });
  await rm(join(RUNTIME_ROOT, "manifest.json"), { force: true });
}

async function copyRuntimeAsset({ kind, sourcePath, runtimePath, contexts, voiceText }) {
  if (sourcePath.includes("/source/") || runtimePath.includes("/source/")) throw new Error(`Forbidden source asset ${sourcePath}`);
  const outputPath = join(RUNTIME_ROOT, runtimePath);
  await mkdir(dirname(outputPath), { recursive: true });
  const sourceBytes = (await stat(sourcePath)).size;
  const transform = kind === "image"
    ? await copyOptimizedImage(sourcePath, outputPath)
    : await transcodeVoice(sourcePath, outputPath, voiceText);
  const bytes = (await stat(outputPath)).size;
  const digest = sha256(await readFile(outputPath));
  return {
    id: sha256(`${kind}:${runtimePath}`).slice(0, 16),
    kind,
    sourcePath,
    runtimePath,
    sourceBytes,
    bytes,
    sha256: digest,
    transform,
    contexts: [...new Set(contexts)].sort(),
  };
}

async function copyOptimizedImage(sourcePath, outputPath) {
  const isScene = sourcePath.includes("/scenes/");
  const targetWidth = sourcePath.includes("/brand/") ? 800 : isScene ? 1200 : 256;
  const targetHeight = isScene ? 675 : undefined;
  await sharp(sourcePath)
    .resize({ width: targetWidth, height: targetHeight, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 90, colors: 256, effort: 10 })
    .toFile(outputPath);
  return isScene ? "png-palette-1200x675" : `png-palette-max-${targetWidth}`;
}

async function transcodeVoice(sourcePath, outputPath, text) {
  if (!ffmpeg?.path) throw new Error("The packaged FFmpeg executable is unavailable");
  if (!text) throw new Error(`Voice text is missing for ${sourcePath}`);
  const result = spawnSync(ffmpeg.path, [
    "-nostdin", "-hide_banner", "-loglevel", "error", "-i", sourcePath,
    "-map_metadata", "-1", "-vn", "-ac", "1", "-ar", String(RUNTIME_VOICE_SAMPLE_RATE),
    "-codec:a", "libmp3lame", "-b:a", `${RUNTIME_VOICE_BITRATE_KBPS}k`, "-write_xing", "0",
    "-y", outputPath,
  ], { encoding: "utf8" });
  if (result.error || result.status !== 0) {
    throw new Error(`Unable to transcode ${sourcePath}: ${result.error?.message ?? result.stderr.trim()}`);
  }
  const media = await inspectVoiceFile(outputPath, text);
  if (media.problems.length) throw new Error(`${outputPath}: ${media.problems.join("; ")}`);
  if (media.bitrateKbps > RUNTIME_VOICE_BITRATE_KBPS || media.sampleRate !== RUNTIME_VOICE_SAMPLE_RATE) {
    throw new Error(`${outputPath}: unexpected ${media.bitrateKbps} kbps / ${media.sampleRate} Hz output`);
  }
  return `mp3-${RUNTIME_VOICE_BITRATE_KBPS}kbps-mono-${RUNTIME_VOICE_SAMPLE_RATE}hz`;
}

function runtimeImagePath(source) {
  return `images/${source.replace(/^\/images\//, "")}`;
}

function runtimeAudioPath(source) {
  return `audio/${source.replace(/^\/audio\/voice\//, "")}`;
}

function image(source, label) {
  return { kind: "image", source, src: runtimeImagePath(source), label };
}

function shape(shapeName, color, label) {
  return { kind: "shape", shape: shapeName, color, label };
}

function addContext(map, path, context) {
  if (!map.has(path)) map.set(path, new Set());
  map.get(path).add(context);
}

function voiceKey(kind, text) {
  return `${kind}:${normalizeText(text)}`;
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function joinVoiceLine(prompt, instruction) {
  const clean = prompt.trim();
  return `${clean}${/[。？！]$/.test(clean) ? "" : "。"}${instruction}`;
}

function getSourceRevision() {
  const result = spawnSync("git", ["rev-parse", "--short=12", "HEAD"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "unknown";
}

function stableStringify(value) {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function readGeneratedCatalog() {
  return JSON.parse(await readFile(join(RUNTIME_ROOT, "data/catalog.json"), "utf8"));
}

export async function verifyAssetEntry(entry) {
  const path = join(RUNTIME_ROOT, entry.runtimePath);
  const file = await readFile(path);
  return { path, bytes: file.byteLength, sha256: sha256(file) };
}

export function projectRelative(path) {
  return relative(process.cwd(), path);
}
