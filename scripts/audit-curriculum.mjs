import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const indexHtml = readFileSync("index.html", "utf8");
const appSource = readFileSync("src/App.tsx", "utf8");
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
const brandLogoSrc = "/images/brand/thinking-house-brand-v3.png";
const brandLogoPath = join("public", brandLogoSrc.replace(/^\/+/, ""));
if (!existsSync(brandLogoPath)) problems.push(`brand logo image missing: ${brandLogoSrc}`);
if (!indexHtml.includes("<title>小小思考屋</title>")) {
  problems.push("index.html title should use the 小小思考屋 brand");
}
if (/小小思考岛/.test(indexHtml)) problems.push("index.html still contains old 小小思考岛 brand text");
if (!indexHtml.includes(`<link rel="icon" type="image/png" href="${brandLogoSrc}" />`)) {
  problems.push("index.html favicon should use the image-gen brand logo");
}
if (!indexHtml.includes(`<link rel="apple-touch-icon" href="${brandLogoSrc}" />`)) {
  problems.push("index.html apple touch icon should use the image-gen brand logo");
}
if (!appSource.includes(`src="${brandLogoSrc}"`)) problems.push(`App sidebar should render image-gen brand logo: ${brandLogoSrc}`);
if (/brand-(mark|logo)/.test(appSource)) problems.push("App still contains legacy inline brand logo markup");

const forbiddenTextPatterns = [
  { pattern: /平常规则/, reason: "use natural wording such as 按红绿灯走" },
  { pattern: /小卡片/, reason: "avoid vague filler labels" },
  { pattern: /数一数小路/, reason: "the counting game title should stay concise" },
  { pattern: /草莓篮/, reason: "do not mention baskets when no basket is shown" },
  { pattern: /不是[红蓝绿黄]色的/, reason: "use clearer comparison wording for young children" },
  { pattern: /但不要[红蓝绿黄]/, reason: "avoid negative color conditions for preschoolers" },
  { pattern: /一定不是/, reason: "avoid abstract negative certainty choices" },
  { pattern: /直接说不是/, reason: "avoid double-negative conclusion choices" },
];
const sorterVisualRules = new Map([
  ["🔴", { color: "红色", shape: "圆形" }],
  ["🔵", { color: "蓝色", shape: "圆形" }],
  ["🟡", { color: "黄色", shape: "圆形" }],
  ["🟢", { color: "绿色", shape: "圆形" }],
  ["🟦", { color: "蓝色", shape: "方形" }],
  ["⬜", { color: "白色", shape: "方形" }],
]);
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
    if (game.world === "logic") {
      checkLogicDifficultyNote(round, context);
    }
    if (!round.choices.some((choice) => choice.value === round.answer)) {
      problems.push(`${context}: answer is not in choices`);
    }
    const choiceLabels = round.choices.map((choice) => choice.label);
    const choiceValues = round.choices.map((choice) => choice.value);
    if (new Set(choiceLabels).size !== choiceLabels.length) {
      problems.push(`${context}: duplicate choice labels`);
    }
    if (new Set(choiceValues).size !== choiceValues.length) {
      problems.push(`${context}: duplicate choice values`);
    }
    const normalizedChoiceMeanings = choiceLabels.map(normalizeChoiceMeaning);
    if (new Set(normalizedChoiceMeanings).size !== normalizedChoiceMeanings.length) {
      problems.push(`${context}: duplicate choice meanings`);
    }
    for (const choice of round.choices) {
      if (!choice.label?.trim()) problems.push(`${context}: blank choice label`);
      if (!choice.value?.trim()) problems.push(`${context}: blank choice value`);
      for (const { pattern, reason } of forbiddenTextPatterns) {
        if (pattern.test(choice.label ?? "")) problems.push(`${context}: forbidden wording in choice "${choice.label}": ${reason}`);
      }
    }
    if (game.id === "logic-sorter-switch") {
      checkSorterRoundQuality(round, context);
    }
    if (game.id === "logic-same-kind-detective") {
      checkSameKindRoundQuality(round, context);
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

function normalizeChoiceMeaning(label) {
  return label
    .replace(/\s+/g, "")
    .replace(/[，。？！、:+＋-]/g, "")
    .replace(/^先/, "")
    .replace(/^再/, "")
    .replace(/^继续/, "")
    .replace(/这张$/, "")
    .replace(/过去$/, "")
    .replace(/停下等/, "停")
    .replace(/走过去/, "走")
    .replace(/直接走/, "走")
    .replace(/已经够了/, "够了")
    .replace(/证据已经够了/, "证据够了");
}

function checkSorterRoundQuality(round, context) {
  const visualItems = [
    ...(round.visualGroups ?? []).flatMap((group) => group.items),
    ...(round.sequence ?? []),
  ];
  const candidateItems = visualItems.filter((item) => sorterVisualRules.has(item));
  const isTwoConditionRound = /两个条件|也要/.test(`${round.prompt} ${round.instruction}`);

  if (candidateItems.length === 1 && !isTwoConditionRound) {
    const rule = /只看颜色/.test(`${round.prompt} ${round.instruction}`)
      ? "颜色"
      : /只看形状/.test(`${round.prompt} ${round.instruction}`)
        ? "形状"
        : null;
    if (!rule) {
      problems.push(`${context}: sorter round should state whether to use color or shape`);
      return;
    }
    if (!round.parentPrompt.includes(rule)) {
      problems.push(`${context}: sorter parentPrompt should ask the child to explain the active ${rule} rule`);
    }
    const itemRule = sorterVisualRules.get(candidateItems[0]);
    const expectedAnswerText = rule === "颜色" ? `${itemRule.color}篮子` : `${itemRule.shape}篮子`;
    if (!round.choices.some((choice) => choice.label === expectedAnswerText && choice.value === round.answer)) {
      problems.push(`${context}: sorter answer should match the visible ${rule} feature (${expectedAnswerText})`);
    }
  }

  if (isTwoConditionRound) {
    if (!/两个条件/.test(round.parentPrompt) || !/只满足/.test(round.parentPrompt)) {
      problems.push(`${context}: two-condition sorter parentPrompt should compare both-condition and one-condition choices`);
    }
    if (!/两个条件/.test(round.retry) && !/都要/.test(round.retry)) {
      problems.push(`${context}: two-condition sorter retry should remind the child that both conditions must match`);
    }
  }
}

function checkSameKindRoundQuality(round, context) {
  const visualItems = (round.visualGroups ?? []).flatMap((group) => group.items);
  const choiceLabels = round.choices.map((choice) => choice.label);
  for (const label of choiceLabels) {
    if (isUnillustratedText(label)) {
      problems.push(`${context}: same-kind choice should have a visual cue mapping: ${label}`);
    }
  }

  const isOddOneOut = /不一样|最不一样/.test(round.prompt);
  if (isOddOneOut) {
    if (!/三个|这一组|多数|同一类/.test(round.success) || !round.success.includes(round.answer)) {
      problems.push(`${context}: odd-one-out success should name the majority group and the different card`);
    }
    if (!/三个|同一类|一组|多数/.test(round.retry)) {
      problems.push(`${context}: odd-one-out retry should ask the child to find the majority group first`);
    }
    if (!/三个|同一类|一组|剩下|为什么/.test(round.parentPrompt)) {
      problems.push(`${context}: odd-one-out parentPrompt should ask for the majority rule and why the answer is left out`);
    }
    return;
  }

  const groupLabel = round.visualGroups?.[0]?.label ?? "";
  if (!groupLabel || groupLabel === "这一家" || groupLabel === "观察台") {
    problems.push(`${context}: same-kind visual group label should name the grouping rule`);
  }
  if (!/同一类|一类|都|因为|属于|也是/.test(round.success)) {
    problems.push(`${context}: same-kind success should explain why the answer joins the group`);
  }
  if (!/同一类|共同点|一类|都|规则|用途|形状|地方/.test(round.retry)) {
    problems.push(`${context}: same-kind retry should name or point to the grouping rule`);
  }
  if (!/为什么|共同点|同一类|规则|哪里一样/.test(round.parentPrompt)) {
    problems.push(`${context}: same-kind parentPrompt should ask the child to explain the grouping rule`);
  }
  if (visualItems.length < 3) {
    problems.push(`${context}: same-kind round should show at least three examples`);
  }
}

function checkLogicDifficultyNote(round, context) {
  const note = round.difficultyNote ?? "";
  if (note.length < 12) {
    problems.push(`${context}: logic difficultyNote is too short to explain the reasoning load`);
  }
  if (!/观察|规则|条件|线索|顺序|记忆|比较|推理|判断|计划|空间|分类|位置|模式|关系|步骤|证据|排除|抗干扰|多|需要|目标|紧急|障碍|错误|修正|优先|功能|用途|相近|直接|生活|安全|材料|匹配|工具|准备|自然|流程|需求|筛选|类比|解决|对应/.test(note)) {
    problems.push(`${context}: logic difficultyNote should name the reasoning load or visual surface`);
  }
}
