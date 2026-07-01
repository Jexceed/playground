import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const imageGallerySource = readFileSync("src/data/imageGallery.ts", "utf8");
const imageGalleryOutput = ts.transpileModule(imageGallerySource, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
}).outputText;
const imageGalleryModuleUrl = `data:text/javascript;base64,${Buffer.from(imageGalleryOutput).toString("base64")}`;
const { imageGallery } = await import(imageGalleryModuleUrl);
const galleryImages = flattenGalleryImages(imageGallery);
const galleryImageSrcs = new Set(galleryImages.map((image) => image.src));

const source = readFileSync("src/data/games.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
}).outputText.replace('import { imageGallery } from "./imageGallery";', `const imageGallery = ${JSON.stringify(imageGallery)};`);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(output.replace("../types", "data:text/javascript,export{}")).toString("base64")}`;
const { games } = await import(moduleUrl);

const visualTokenSource = readFileSync("src/components/VisualToken.tsx", "utf8");
const knownVisuals = new Set([
  ...extractMapKeys("tokenMap", visualTokenSource),
  ...extractMapKeys("phraseMap", visualTokenSource),
]);
const visualRuleHints = [
  /小猫.*奶油|猫.*奶油/,
  /小狗.*睡觉/,
  /小兔.*胡萝卜/,
  /猫脚印/,
  /小猫在厨房/,
  /蛋糕少了一块/,
  /小狗脚上有泥/,
  /小猫身上很干净/,
  /倒下的杯子/,
  /地上有水/,
  /花粉/,
  /小狗在房间里/,
  /小鸟在窗边/,
];

const problems = [];
const forbiddenTextPatterns = [
  { pattern: /平常规则/, reason: "use natural wording such as 按红绿灯走" },
  { pattern: /小卡片/, reason: "avoid vague filler labels" },
  { pattern: /数一数小路/, reason: "the counting game title should stay concise" },
  { pattern: /草莓篮/, reason: "do not mention baskets when no basket is shown" },
  { pattern: /不是[红蓝绿黄]色的/, reason: "use clearer comparison wording for young children" },
];
const counts = games.reduce(
  (acc, game) => {
    acc.totalGames += 1;
    acc[game.world] += game.rounds.length;
    acc.totalRounds += game.rounds.length;
    return acc;
  },
  { math: 0, logic: 0, totalGames: 0, totalRounds: 0 },
);

for (const game of games) {
  if (!game.rounds.length) problems.push(`${game.id}: no rounds`);
  const roundSignatures = new Map();
  for (const round of game.rounds) {
    const context = `${game.id}/${round.id}`;
    const signature = JSON.stringify([
      round.prompt,
      round.instruction,
      round.sequence,
      round.visualGroups,
      round.grid,
      round.matrix,
      round.memory,
      round.choices.map((choice) => choice.label),
      round.answer,
    ]);
    const firstSeen = roundSignatures.get(signature);
    if (firstSeen) {
      problems.push(`${context}: duplicates ${firstSeen}`);
    } else {
      roundSignatures.set(signature, context);
    }
    for (const field of ["prompt", "instruction", "success", "retry", "parentPrompt"]) {
      if (!round[field]?.trim()) problems.push(`${context}: missing ${field}`);
      for (const { pattern, reason } of forbiddenTextPatterns) {
        if (pattern.test(round[field] ?? "")) problems.push(`${context}: forbidden wording in ${field}: ${reason}`);
      }
    }
    if (!round.difficultyNote?.trim()) problems.push(`${context}: missing difficultyNote`);
    if (!round.choices.some((choice) => choice.value === round.answer)) {
      problems.push(`${context}: answer is not in choices`);
    }
    if (!round.sceneImage && !round.sequence && !round.visualGroups && !round.grid && !round.matrix && !round.memory) {
      problems.push(`${context}: missing visual surface`);
    }
    if (round.sceneImage) {
      if (!round.sceneImage.alt?.trim()) problems.push(`${context}: scene image missing alt`);
      if (!galleryImageSrcs.has(round.sceneImage.src)) {
        problems.push(`${context}: scene image src is not registered in imageGallery: ${round.sceneImage.src}`);
      }
      const imagePath = join("public", round.sceneImage.src.replace(/^\/+/, ""));
      if (!existsSync(imagePath)) problems.push(`${context}: scene image file missing: ${round.sceneImage.src}`);
    }
    const visualItems = [
      ...(round.sequence ?? []),
      ...(round.visualGroups ?? []).flatMap((group) => group.items),
      ...(round.grid?.cells ?? []).flat(),
      ...(round.matrix?.cells ?? []).flat(),
      ...(round.memory?.items ?? []),
    ];
    for (const item of visualItems) {
      if (isUnillustratedText(item)) problems.push(`${context}: visual item is still text-only: ${item}`);
    }
  }
}

let voiceLineData = null;
if (existsSync("public/audio/voice-lines.json")) {
  const voiceLines = readFileSync("public/audio/voice-lines.json", "utf8");
  if (/？。|！。|。。/.test(voiceLines)) problems.push("voice-lines.json contains doubled punctuation");
  voiceLineData = JSON.parse(voiceLines);
  if (!Array.isArray(voiceLineData.lines)) problems.push("voice-lines.json has no lines array");
}

if (existsSync("public/audio/voice/manifest.json")) {
  const manifest = JSON.parse(readFileSync("public/audio/voice/manifest.json", "utf8"));
  const allowedVoiceProviders = new Set(["edge-tts Python package", "F5-TTS local"]);
  if (!allowedVoiceProviders.has(manifest.provider)) {
    problems.push(`audio manifest provider is not an approved local pack generator: ${manifest.provider ?? "missing"}`);
  }
  if (manifest.provider === "F5-TTS local") {
    if (!manifest.referenceAudio?.trim()) problems.push("F5 audio manifest missing referenceAudio");
    if (!manifest.referenceText?.trim()) problems.push("F5 audio manifest missing referenceText");
  }
  if (!Array.isArray(manifest.entries)) {
    problems.push("audio manifest has no entries array");
  } else {
    const manifestIds = new Set(manifest.entries.map((entry) => entry.id));
    if (manifestIds.size !== manifest.entries.length) {
      problems.push(`audio manifest contains duplicate ids: ${manifest.entries.length - manifestIds.size}`);
    }
    for (const entry of manifest.entries) {
      if (!entry.text?.trim()) problems.push(`audio manifest entry missing text: ${entry.id ?? "unknown"}`);
      if (!entry.src?.trim()) problems.push(`audio manifest entry missing src: ${entry.id ?? entry.text ?? "unknown"}`);
      if (entry.src) {
        const filePath = join("public", decodeURIComponent(entry.src.replace(/^\/+/, "").replace(/^audio\//, "audio/")));
        if (!existsSync(filePath)) problems.push(`audio manifest file missing: ${entry.src}`);
      }
    }
    if (voiceLineData?.lines) {
      const voiceLineIds = new Set(voiceLineData.lines.map((line) => line.id));
      if (voiceLineIds.size !== voiceLineData.lines.length) {
        problems.push(`voice-lines.json contains duplicate ids: ${voiceLineData.lines.length - voiceLineIds.size}`);
      }
      const missingManifestEntries = voiceLineData.lines.filter((line) => !manifestIds.has(line.id));
      const extraManifestEntries = manifest.entries.filter((entry) => !voiceLineIds.has(entry.id));
      if (missingManifestEntries.length) {
        problems.push(
          `audio manifest missing ${missingManifestEntries.length} voice line ids: ${missingManifestEntries
            .slice(0, 10)
            .map((line) => line.id)
            .join(", ")}`,
        );
      }
      if (extraManifestEntries.length) {
        problems.push(
          `audio manifest has ${extraManifestEntries.length} extra ids: ${extraManifestEntries
            .slice(0, 10)
            .map((entry) => entry.id)
            .join(", ")}`,
        );
      }
    }
    if (manifest.failures?.length) problems.push(`audio manifest has ${manifest.failures.length} failures`);
    if (manifest.segmentFailures?.length) problems.push(`audio segment manifest has ${manifest.segmentFailures.length} failures`);
    if (manifest.segmentEntries != null) {
      if (!Array.isArray(manifest.segmentEntries)) {
        problems.push("audio manifest segmentEntries is not an array");
      } else {
        for (const entry of manifest.segmentEntries) {
          if (!entry.text?.trim()) problems.push(`audio segment entry missing text: ${entry.id ?? "unknown"}`);
          if (!Array.isArray(entry.srcs) || entry.srcs.length === 0) {
            problems.push(`audio segment entry missing srcs: ${entry.id ?? entry.text ?? "unknown"}`);
            continue;
          }
          for (const src of entry.srcs) {
            const filePath = join("public", decodeURIComponent(src.replace(/^\/+/, "").replace(/^audio\//, "audio/")));
            if (!existsSync(filePath)) problems.push(`audio segment file missing: ${src}`);
          }
        }
      }
    }
  }
}

for (const { src, kind } of galleryImages) {
  const filePath = join("public", src.replace(/^\/+/, ""));
  if (!existsSync(filePath)) {
    problems.push(`image gallery file missing: ${src}`);
    continue;
  }
  if (kind === "scenes") {
    const size = readPngSize(filePath);
    if (!size) {
      problems.push(`scene image is not a readable PNG: ${src}`);
    } else if (size.width !== 1200 || size.height !== 675) {
      problems.push(`scene image must be 1200x675: ${src} is ${size.width}x${size.height}`);
    }
  }
}

for (const alt of [...imageGallerySource.matchAll(/alt:\s*"([^"]*)"/g)].map((match) => match[1])) {
  if (!alt.trim()) problems.push("image gallery image missing alt text");
}

const report = {
  ...counts,
  mathTargetMet: counts.math >= 100,
  logicTargetMet: counts.logic >= 100,
  problemCount: problems.length,
  problems: problems.slice(0, 20),
};

console.log(JSON.stringify(report, null, 2));
if (problems.length || counts.math < 100 || counts.logic < 100) process.exit(1);

function extractMapKeys(name, text) {
  const start = text.indexOf(`const ${name}`);
  if (start === -1) return [];
  const end = text.indexOf("};", start);
  if (end === -1) return [];
  const block = text.slice(start, end);
  return [...block.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
}

function isUnillustratedText(item) {
  if (knownVisuals.has(item)) return false;
  if (Array.from(item).every((part) => knownVisuals.has(part))) return false;
  if (!/[\u4e00-\u9fff]/.test(item)) return false;
  return !visualRuleHints.some((pattern) => pattern.test(item));
}

function flattenGalleryImages(gallery) {
  return Object.entries(gallery).flatMap(([kind, collection]) =>
    Object.values(collection).map((image) => ({
      kind,
      ...image,
    })),
  );
}

function readPngSize(filePath) {
  const buffer = readFileSync(filePath);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}
