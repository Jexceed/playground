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
const visualMatchPartAliases = new Map([
  ["🔴", ["红色", "红色圆片"]],
  ["🟡", ["黄色", "黄色圆片"]],
  ["🟢", ["绿色", "绿色圆片"]],
  ["🔵", ["蓝色", "蓝色圆片"]],
  ["🟦", ["蓝色方块", "方块"]],
  ["⭐", ["星星"]],
  ["🍎", ["苹果"]],
  ["🍊", ["橘子"]],
  ["🍓", ["草莓"]],
  ["🍪", ["饼干"]],
  ["🍬", ["糖果"]],
  ["🐱", ["小猫"]],
  ["🐶", ["小狗"]],
  ["🐰", ["小兔"]],
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
    if (game.id === "logic-visual-match") {
      checkVisualMatchRoundQuality(round, context);
    }
    if (game.id === "logic-difference-detective") {
      checkDifferenceDetectiveRoundQuality(round, context);
    }
    if (game.id === "logic-block-height-map") {
      checkBlockHeightRoundQuality(round, context);
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

function checkVisualMatchRoundQuality(round, context) {
  const firstGroup = round.visualGroups?.[0];
  const isOddCardRound = /不一样/.test(round.prompt);
  if (isOddCardRound) {
    checkVisualMatchOddCardRound(round, context, firstGroup);
    return;
  }
  checkVisualMatchExactRound(round, context, firstGroup);
}

function checkVisualMatchExactRound(round, context, group) {
  const sample = group?.items?.[0];
  if (!group || !/样板|上面/.test(group.label ?? "") || group.items.length !== 1) {
    problems.push(`${context}: visual-match exact round should show one sample card`);
  }
  if (!sample) return;
  if (round.answer !== sample) {
    problems.push(`${context}: visual-match exact round answer should equal the sample card`);
  }
  const matchingChoices = round.choices.filter((choice) => choice.value === sample);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: visual-match exact round should include exactly one matching choice`);
  }
  if (!round.choices.some((choice) => choice.value !== sample && sharesVisibleMaterial(choice.value, sample))) {
    problems.push(`${context}: visual-match exact round should include a close distractor`);
  }
  if (!successNamesCardParts(round.success, sample) || !/从左到右|顺序|第一个|第二个|先|再|每个|全部/.test(round.success)) {
    problems.push(`${context}: visual-match exact success should name the matched card and visible comparison`);
  }
  if (!/从左到右/.test(round.retry) || !/每个|全部|都|完全|一点点/.test(round.retry)) {
    problems.push(`${context}: visual-match exact retry should require left-to-right all-parts comparison`);
  }
  if (!/为什么|哪里|差|不一样|只是/.test(round.parentPrompt) || !/从左到右|顺序|第一个|第二个|每个/.test(round.parentPrompt)) {
    problems.push(`${context}: visual-match exact parentPrompt should ask why a close card is different`);
  }
}

function checkVisualMatchOddCardRound(round, context, group) {
  const items = group?.items ?? [];
  if (!group || items.length !== 3) {
    problems.push(`${context}: visual-match odd-card round should show exactly three cards`);
    return;
  }
  const counts = countValues(items);
  const matchingEntry = [...counts.entries()].find(([, count]) => count === 2);
  const differentEntry = [...counts.entries()].find(([, count]) => count === 1);
  if (!matchingEntry || !differentEntry || counts.size !== 2) {
    problems.push(`${context}: visual-match odd-card round should have exactly two matching cards`);
    return;
  }
  const differentIndex = items.indexOf(differentEntry[0]);
  const expectedAnswer = ["left", "middle", "right"][differentIndex];
  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: visual-match odd-card answer should point to the different card`);
  }
  const positionChoices = new Set(round.choices.map((choice) => choice.value));
  if (positionChoices.size !== 3 || !["left", "middle", "right"].every((value) => positionChoices.has(value))) {
    problems.push(`${context}: visual-match odd-card choices should be left, middle, and right positions`);
  }
  if (
    !round.success.includes(positionLabel(expectedAnswer)) ||
    !/另外两张|两张一样|一对|左边和中间|左边和右边|中间和右边/.test(round.success) ||
    !/不同|不一样|反了|换了|颜色|顺序|位置|第二个|后两/.test(round.success)
  ) {
    problems.push(`${context}: visual-match odd-card success should name the matching pair and difference`);
  }
  if (!/两张一样|一对|配成一对|剩下/.test(round.retry)) {
    problems.push(`${context}: visual-match odd-card retry should ask the child to find the matching pair first`);
  }
  if (!/哪两张|两张一样|一对/.test(round.parentPrompt) || !/哪里|哪儿|不同|不一样/.test(round.parentPrompt)) {
    problems.push(`${context}: visual-match odd-card parentPrompt should ask for the matching pair and visible difference`);
  }
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function sharesVisibleMaterial(left, right) {
  return Array.from(left).some((part) => right.includes(part));
}

function successNamesCardParts(text, card) {
  const partAliases = Array.from(card)
    .map((part) => visualMatchPartAliases.get(part))
    .filter(Boolean);
  if (partAliases.length === 0) return true;
  const matchedParts = partAliases.filter((aliases) => aliases.some((alias) => text.includes(alias)));
  return matchedParts.length >= Math.min(2, partAliases.length);
}

function positionLabel(position) {
  return {
    left: "左边",
    middle: "中间",
    right: "右边",
  }[position] ?? "";
}

function checkDifferenceDetectiveRoundQuality(round, context) {
  const leftGroup = round.visualGroups?.find((group) => group.label === "左图");
  const rightGroup = round.visualGroups?.find((group) => group.label === "右图");
  if (!leftGroup || !rightGroup) {
    problems.push(`${context}: difference round should show left and right picture groups`);
    return;
  }

  const left = leftGroup.items;
  const right = rightGroup.items;
  if (/变了/.test(round.prompt)) {
    checkChangedDifferenceRound(round, context, left, right);
    return;
  }
  if (/多了/.test(round.prompt)) {
    checkExtraDifferenceRound(round, context, left, right);
    return;
  }
  if (/少了/.test(round.prompt)) {
    checkMissingDifferenceRound(round, context, left, right);
  }
}

function checkChangedDifferenceRound(round, context, left, right) {
  const changedIndexes = left
    .map((item, index) => (item !== right[index] ? index : -1))
    .filter((index) => index !== -1);
  if (left.length !== right.length || changedIndexes.length !== 1) {
    problems.push(`${context}: changed-item round should have exactly one changed position`);
    return;
  }
  const changedIndex = changedIndexes[0];
  const oldItem = left[changedIndex];
  const newItem = right[changedIndex];
  const position = ordinalPosition(changedIndex, left.length);
  if (round.answer !== newItem) {
    problems.push(`${context}: changed-item answer should be the right-picture item at the changed position`);
  }
  if (!round.success.includes(position) || !round.success.includes(oldItem) || !round.success.includes(newItem)) {
    problems.push(`${context}: changed-item success should name position, old item, and new item`);
  }
  if (!/从左到右|第一个|第二个|最后一个|一个一个/.test(round.retry)) {
    problems.push(`${context}: changed-item retry should guide ordered left-to-right comparison`);
  }
  if (!/左图/.test(round.parentPrompt) || !/右图/.test(round.parentPrompt) || !/变成|变了/.test(round.parentPrompt)) {
    problems.push(`${context}: changed-item parentPrompt should ask for a left/right explanation`);
  }
}

function checkExtraDifferenceRound(round, context, left, right) {
  const extraItems = unmatchedItems(right, left);
  if (right.length !== left.length + 1 || extraItems.length !== 1) {
    problems.push(`${context}: extra-item round should have exactly one extra right-picture item`);
    return;
  }
  const extraItem = extraItems[0];
  if (round.answer !== extraItem) {
    problems.push(`${context}: extra-item answer should be the unmatched right-picture item`);
  }
  if (!round.success.includes(extraItem) || !/多/.test(round.success) || !allItemsMentioned(round.success, left)) {
    problems.push(`${context}: extra-item success should name shared items before the extra item`);
  }
  if (!/左图/.test(round.retry) || !/右图/.test(round.retry) || !/找|配|剩/.test(round.retry)) {
    problems.push(`${context}: extra-item retry should ask the child to match left-picture items first`);
  }
  if (!/左图/.test(round.parentPrompt) || !/右图/.test(round.parentPrompt) || !/剩|多|还/.test(round.parentPrompt)) {
    problems.push(`${context}: extra-item parentPrompt should ask what was matched and what remains`);
  }
}

function checkMissingDifferenceRound(round, context, left, right) {
  const missingItems = unmatchedItems(left, right);
  if (left.length !== right.length + 1 || missingItems.length !== 1) {
    problems.push(`${context}: missing-item round should have exactly one missing left-picture item`);
    return;
  }
  const missingItem = missingItems[0];
  if (round.answer !== missingItem) {
    problems.push(`${context}: missing-item answer should be the unmatched left-picture item`);
  }
  if (!round.success.includes(missingItem) || !/少|没有|找不到/.test(round.success) || !allItemsMentioned(round.success, right)) {
    problems.push(`${context}: missing-item success should name shared items before the missing item`);
  }
  if (!/左图/.test(round.retry) || !/右图/.test(round.retry) || !/每一个|第一个|找/.test(round.retry)) {
    problems.push(`${context}: missing-item retry should ask the child to check each left-picture item`);
  }
  if (!/有|找到/.test(round.parentPrompt) || !/没有|少|找不到/.test(round.parentPrompt)) {
    problems.push(`${context}: missing-item parentPrompt should ask what was found and what is missing`);
  }
}

function unmatchedItems(source, target) {
  const remaining = [...target];
  const unmatched = [];
  for (const item of source) {
    const matchedIndex = remaining.indexOf(item);
    if (matchedIndex === -1) {
      unmatched.push(item);
    } else {
      remaining.splice(matchedIndex, 1);
    }
  }
  return unmatched;
}

function allItemsMentioned(text, items) {
  return items.every((item) => text.includes(item));
}

function ordinalPosition(index, length) {
  const names = ["第一个", "第二个", "第三个", "第四个", "第五个"];
  if (index === 0) return "第一个";
  if (index === length - 1) return "最后一个";
  return names[index] ?? `第${index + 1}个`;
}

function checkBlockHeightRoundQuality(round, context) {
  if (/一共有几块/.test(round.prompt)) {
    checkBlockHeightTotalRound(round, context);
    return;
  }
  if (/更多/.test(round.prompt)) {
    checkBlockHeightCompareRound(round, context);
  }
}

function checkBlockHeightTotalRound(round, context) {
  const cells = round.grid?.cells;
  if (!isNumericCellGrid(cells)) {
    problems.push(`${context}: block-height total round should show a numeric grid`);
    return;
  }
  const total = sumNumericCells(cells);
  if (round.answer !== String(total)) {
    problems.push(`${context}: block-height total answer should equal the visible cell sum`);
  }
  if (!blockHeightSuccessNamesRows(round.success, cells, total)) {
    problems.push(`${context}: block-height total success should name row totals and final total`);
  }
  if (!/数字/.test(round.retry) || !/合起来|相加|加/.test(round.retry) || !/不要只数格子/.test(round.retry)) {
    problems.push(`${context}: block-height total retry should tell the child to add numbers, not count squares`);
  }
  if (!/按行|每一行|第一行/.test(round.parentPrompt) || !/一共|总数|几块/.test(round.parentPrompt)) {
    problems.push(`${context}: block-height total parentPrompt should ask for row totals`);
  }
}

function checkBlockHeightCompareRound(round, context) {
  const leftGroup = round.visualGroups?.find((group) => group.label === "左图");
  const rightGroup = round.visualGroups?.find((group) => group.label === "右图");
  if (!leftGroup || !rightGroup || !leftGroup.items.every(isNumericText) || !rightGroup.items.every(isNumericText)) {
    problems.push(`${context}: block-height compare round should show left and right numeric maps`);
    return;
  }
  const leftTotal = sumNumericTexts(leftGroup.items);
  const rightTotal = sumNumericTexts(rightGroup.items);
  const expectedAnswer = leftTotal === rightTotal ? "一样多" : leftTotal > rightTotal ? "左图更多" : "右图更多";
  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: block-height compare answer should match the greater map or same amount`);
  }
  const choiceLabels = new Set(round.choices.map((choice) => choice.label));
  if (!["左图更多", "右图更多", "一样多"].every((label) => choiceLabels.has(label))) {
    problems.push(`${context}: block-height compare choices should say left map more, right map more, and same amount`);
  }
  if (
    !round.success.includes(`左图${leftTotal}`) ||
    !round.success.includes(`右图${rightTotal}`) ||
    !/更多|一样多/.test(round.success)
  ) {
    problems.push(`${context}: block-height compare success should name both totals and the comparison result`);
  }
  if (!/左图/.test(round.retry) || !/右图/.test(round.retry) || !/比较/.test(round.retry)) {
    problems.push(`${context}: block-height compare retry should ask for left total, right total, then comparison`);
  }
  if (!/左图/.test(round.parentPrompt) || !/右图/.test(round.parentPrompt) || !/比较|谁更多|一样多/.test(round.parentPrompt)) {
    problems.push(`${context}: block-height compare parentPrompt should ask for both totals and the comparison`);
  }
}

function blockHeightSuccessNamesRows(text, cells, total) {
  if (!text.includes(`一共${total}`) && !text.includes(`一共 ${total}`)) return false;
  return rowTotals(cells).every((rowTotal, index) => text.includes(`${rowLabel(index)}${rowTotal}`) || text.includes(`${rowLabel(index)} ${rowTotal}`));
}

function rowTotals(cells) {
  return cells.map((row) => sumNumericTexts(row));
}

function rowLabel(index) {
  return ["第一行", "第二行", "第三行", "第四行"][index] ?? `第${index + 1}行`;
}

function isNumericCellGrid(cells) {
  return Array.isArray(cells) && cells.length > 0 && cells.every((row) => Array.isArray(row) && row.length > 0 && row.every(isNumericText));
}

function sumNumericCells(cells) {
  return cells.reduce((total, row) => total + sumNumericTexts(row), 0);
}

function sumNumericTexts(values) {
  return values.reduce((total, value) => total + Number(value), 0);
}

function isNumericText(value) {
  return typeof value === "string" && /^\d+$/.test(value);
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
