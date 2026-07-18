import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { inspectVoiceMedia } from "./lib/voice-media-quality.mjs";

const indexHtml = readFileSync("index.html", "utf8");
const appSource = readFileSync("src/App.tsx", "utf8");
const progressiveSetGameSource = readFileSync("src/games/ProgressiveSetGame.tsx", "utf8");
const storageSource = readFileSync("src/storage.ts", "utf8");
const imageGallerySource = readFileSync("src/data/imageGallery.ts", "utf8");
const tauriConfig = existsSync("src-tauri/tauri.conf.json")
  ? JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8"))
  : null;
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
const { games, patternTrainSizeDiameters, worlds } = await import(moduleUrl);

const visualTokenSource = readFileSync("src/components/VisualToken.tsx", "utf8");
const knownVisuals = new Set([
  ...extractMapKeys("tokenMap", visualTokenSource),
  ...extractMapKeys("phraseMap", visualTokenSource),
]);
const knownVisualKinds = new Map([
  ...extractMapEntries("tokenMap", visualTokenSource),
  ...extractMapEntries("phraseMap", visualTokenSource),
]);
const rasterVisualKinds = extractRasterKinds(visualTokenSource);
const patternTrainAssetNames = [
  "red-disc",
  "blue-disc",
  "yellow-disc",
  "green-disc",
  "sun",
  "moon",
  "star",
  "large-disc",
  "medium-disc",
  "small-disc",
  "strawberry",
  "cookie",
  "apple",
];
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
const singleSurfaceSpatialGameIds = new Set(["logic-address-map", "logic-position-map", "logic-route-steps"]);

const problems = [];
const brandLogoSrc = "/images/brand/thinking-house-brand-v3.png";
const brandLogoPath = join("public", brandLogoSrc.replace(/^\/+/, ""));
const launchBrandAudioSrc = "/audio/brand/launch-brand-shout.wav";
const launchBrandAudioPath = join("public", launchBrandAudioSrc.replace(/^\/+/, ""));
if (!existsSync(brandLogoPath)) problems.push(`brand logo image missing: ${brandLogoSrc}`);
if (!existsSync(launchBrandAudioPath)) problems.push(`launch brand chorus audio missing: ${launchBrandAudioSrc}`);
for (const assetName of patternTrainAssetNames) {
  const src = `/images/items/pattern-train/${assetName}.png`;
  const filePath = join("public", src.replace(/^\/+/, ""));
  if (!galleryImageSrcs.has(src)) problems.push(`pattern token should use a registered local PNG: ${src}`);
  if (!existsSync(filePath)) {
    problems.push(`pattern token runtime image is missing: ${src}`);
  } else {
    const size = readPngSize(filePath);
    if (!size || size.width !== 256 || size.height !== 256) {
      problems.push(`pattern token runtime image should be a 256x256 PNG: ${src}`);
    }
  }
}
const patternTrainSourcePath = join("public", "images", "items", "source", "pattern-train-sticker-sheet-source.png");
if (!existsSync(patternTrainSourcePath)) {
  problems.push("pattern token source image is missing: public/images/items/source/pattern-train-sticker-sheet-source.png");
}
const sizeDiameters = ["⬤", "●", "•"].map((token) => patternTrainSizeDiameters?.[token]);
if (
  sizeDiameters.some((diameter) => !Number.isFinite(diameter))
  || sizeDiameters[0] / sizeDiameters[1] < 1.25
  || sizeDiameters[1] / sizeDiameters[2] < 1.25
) {
  problems.push(`size pattern diameters should have a clear ordered progression: ${sizeDiameters.join("/")}`);
}
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
if (!appSource.includes("function LaunchSplash")) problems.push("App should define a branded LaunchSplash entry view");
if (appSource.includes('speak("小小思考屋")')) {
  problems.push("LaunchSplash should play the dedicated brand audio instead of the normal speech manifest");
}
if (!appSource.includes(launchBrandAudioSrc)) {
  problems.push(`LaunchSplash should reference the dedicated launch brand audio: ${launchBrandAudioSrc}`);
}
if (!appSource.includes("startup-splash")) problems.push("LaunchSplash should render startup-splash markup");
if (!appSource.includes("splashTimer")) problems.push("LaunchSplash should auto-enter after the opening animation");
if (/className="splash-enter"|onClick=\{enterApp\}/.test(appSource)) {
  problems.push("LaunchSplash should auto-enter without a manual enter button");
}
if (!tauriConfig?.bundle?.icon?.some?.((icon) => icon.includes("icon.icns"))) {
  problems.push("Tauri bundle should declare the macOS icon.icns app logo");
}
if (!tauriConfig?.bundle?.icon?.some?.((icon) => icon.includes("icon.png"))) {
  problems.push("Tauri bundle should declare the PNG app logo");
}
if (!existsSync("src-tauri/icons/app-icon-source.png")) {
  problems.push("Tauri app icon should keep a PNG source cropped from the brand logo");
}
if (existsSync("src-tauri/icons/app-icon-source.svg")) {
  problems.push("Tauri app icon should reuse the brand logo crop instead of a redrawn SVG source");
}
if (addressGridUsesNestedVisualToken(progressiveSetGameSource)) {
  problems.push("AddressGrid renderer should use flat map-cell tokens instead of nested VisualToken cards");
}
if (visualChoicesUseDuplicatedRawLabels(progressiveSetGameSource)) {
  problems.push("ProgressiveSetGame should render exact visual-card choices without duplicated raw labels");
}
if (!/<ChoiceContent[^>]*label=\{choice\.label\}[^>]*value=\{choice\.value\}/.test(progressiveSetGameSource)) {
  problems.push("ProgressiveSetGame answer choices should pass choice.value so pattern stems and options share one visual token");
}
if (matrixBoardUsesNestedVisualToken(progressiveSetGameSource)) {
  problems.push("MatrixBoard renderer should use flat matrix-cell tokens instead of nested VisualToken cards");
}
if (memoryBoardUsesNestedVisualToken(progressiveSetGameSource)) {
  problems.push("MemoryBoard renderer should use flat memory-card tokens instead of nested VisualToken cards");
}
if (!progressiveSetGameSource.includes("visual-groups-compare")) {
  problems.push("ProgressiveSetGame should give left/right comparison groups a dedicated visual-groups-compare class");
}
if (!/\.visual-groups-compare/.test(readFileSync("src/styles.css", "utf8"))) {
  problems.push("styles should size left/right comparison visual tokens without narrow five-column bases");
}
if (!progressiveSetGameSource.includes("visual-groups-evidence")) {
  problems.push("ProgressiveSetGame should give part-whole and balance evidence groups a dedicated visual-groups-evidence class");
}
if (!/\.visual-groups-evidence/.test(readFileSync("src/styles.css", "utf8"))) {
  problems.push("styles should size part-whole and balance evidence tokens without narrow five-column bases");
}
if (!progressiveSetGameSource.includes("function GraphicChallengeBoard")) {
  problems.push("ProgressiveSetGame should render dedicated SVG graphic-challenge boards for 图形工坊");
}
if (!progressiveSetGameSource.includes("function GraphicAnswerFigure")) {
  problems.push("ProgressiveSetGame should render dedicated SVG answer choices for 图形工坊");
}
if (!progressiveSetGameSource.includes("function graphicFigureAssetSrc")) {
  problems.push("ProgressiveSetGame should render image-gen graphic sticker assets for 图形工坊 figures");
}
if (progressiveSetGameSource.includes("在下面选 A、B、C、D") || progressiveSetGameSource.includes("graphic-option-hint")) {
  problems.push("graphic challenge stem should not show redundant option-selection helper text");
}
if (/challenge\.figures\.map\(\(figure/.test(progressiveSetGameSource)) {
  problems.push("GraphicChallengeBoard should render challenge.figures in one shared SVG so overlap and code-machine stems stay spatially related");
}
if (/filter:\s*"brightness\(0\)"/.test(progressiveSetGameSource)) {
  problems.push("graphic shadow figures should render as real black silhouettes, not CSS-filtered color PNGs");
}
if (!/figure\.mode\s*===\s*"blank"/.test(progressiveSetGameSource)) {
  problems.push("graphic code-machine question slot should render as a visible blank answer slot");
}
if (!progressiveSetGameSource.includes("answer-grid-graphic")) {
  problems.push("graphic answer options should use a dedicated four-column desktop grid class");
}
if (!/\.answer-grid-graphic\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s.test(readFileSync("src/styles.css", "utf8"))) {
  problems.push("graphic answer option grid should keep four choices on one desktop row");
}
if (/本题[上下]层/.test(progressiveSetGameSource)) {
  problems.push("layer-overlap task figure labels should use child-friendly action wording instead of abstract layer wording");
}
if (!progressiveSetGameSource.includes("1 先放这张") || !progressiveSetGameSource.includes("2 盖上这张") || !progressiveSetGameSource.includes("graphic-layer-stack-cue")) {
  problems.push("layer-overlap task figures should show an action sequence: first place one card, then cover it with the next card");
}
if (/speak\(graphicOption\.label\)/.test(progressiveSetGameSource)) {
  problems.push("graphic answer choices should not speak option labels before checking because labels can reveal the answer relation");
}
if (/\$\{choice\.label\}，\$\{graphicOption\.label\}/.test(progressiveSetGameSource)) {
  problems.push("graphic answer choice aria labels should not include answer-revealing option labels before checking");
}
if (/round\.graphicChallenge\?\.options/.test(readFileSync("scripts/export-voice-lines.mjs", "utf8"))) {
  problems.push("voice export should not include graphic option labels because pre-answer option speech uses A/B/C/D only");
}
if (!progressiveSetGameSource.includes("clock-no-context")) {
  problems.push("clock read-time rounds should use a one-column centered layout when there is no activity card");
}
if (!progressiveSetGameSource.includes("clockHandEndpoint") || /className="clock-hand[^>]+transform=\{`rotate/.test(progressiveSetGameSource)) {
  problems.push("clock hands should be drawn from calculated center-to-endpoint coordinates, not rotated line primitives");
}
if (/aria-label=\{`分针也就是长针/.test(progressiveSetGameSource)) {
  problems.push("clock face aria label should describe 时针/短针 before 分针/长针");
}
if (progressiveSetGameSource.includes("分针（长针）在 12，看时针（短针）") || progressiveSetGameSource.includes("分针（长针）在 6，再看时针（短针）")) {
  problems.push("clock face hint should guide 时针/短针 before 分针/长针");
}
if (!/readLastPlayLocation/.test(storageSource) || !/saveLastPlayLocation/.test(storageSource)) {
  problems.push("storage should expose readLastPlayLocation and saveLastPlayLocation helpers");
}
if (!/readLastPlayLocation/.test(appSource) || !/saveLastPlayLocation/.test(appSource)) {
  problems.push("App should restore and persist the last opened world, game, and round");
}

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
const memoryCameraLabelAliases = new Map([
  ["🍎", "苹果"],
  ["🍊", "橘子"],
  ["🍓", "草莓"],
  ["🐱", "小猫"],
  ["🐶", "小狗"],
  ["🐰", "小兔"],
]);
const counts = games.reduce(
  (acc, game) => {
    acc.totalGames += 1;
    acc[game.world] += game.rounds.length;
    acc.totalRounds += game.rounds.length;
    return acc;
  },
  { math: 0, logic: 0, graphic: 0, totalGames: 0, totalRounds: 0 },
);

checkWorldCoverage();
checkGraphicWorkshopCoverage();
checkClockTimeCoverage();
checkReferenceReinforcementScope();

for (const game of games) {
  if (!game.rounds.length) problems.push(`${game.id}: no rounds`);
  checkChoicePositionBalance(game);
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
      round.graphicChallenge,
      round.clockChallenge,
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
    if (game.world === "logic" || game.world === "graphic") {
      checkLogicDifficultyNote(round, context);
    }
    checkCurriculumIntegrityWording(game, round, context);
    if (game.world === "graphic") {
      checkGraphicRoundQuality(round, context);
    }
    if (singleSurfaceSpatialGameIds.has(game.id)) {
      checkSpatialVisualSurface(round, context);
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
    if (game.id === "logic-pattern-train") {
      checkPatternTrainRoundQuality(round, context);
    }
    if (game.id === "logic-relation-pairs") {
      checkRelationPairRoundQuality(round, context);
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
    if (game.id === "logic-three-view-blocks") {
      checkThreeViewBlockRoundQuality(round, context);
    }
    if (game.id === "logic-route-steps") {
      checkRouteStepRoundQuality(round, context);
    }
    if (game.id === "logic-address-map") {
      checkAddressMapRoundQuality(round, context);
    }
    if (game.id === "logic-matrix-puzzle") {
      checkMatrixPuzzleRoundQuality(round, context);
    }
    if (game.id === "logic-position-map") {
      checkPositionMapRoundQuality(round, context);
    }
    if (game.id === "logic-memory-camera") {
      checkMemoryCameraRoundQuality(round, context);
    }
    if (game.id === "logic-order-plan") {
      checkOrderPlanRoundQuality(round, context);
    }
    if (game.id === "logic-part-whole-puzzle") {
      checkPartWholePuzzleRoundQuality(round, context);
    }
    if (game.id === "logic-balance-swap") {
      checkBalanceSwapRoundQuality(round, context);
    }
    if (game.id === "math-clock-time") {
      checkClockTimeRoundQuality(round, context);
    }
    if (!round.sceneImage && !round.sequence && !round.visualGroups && !round.grid && !round.matrix && !round.memory && !round.graphicChallenge && !round.clockChallenge) {
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
  if (voiceLineData.lines?.some((line) => (line.contexts ?? []).includes("app-launch"))) {
    problems.push("voice-lines.json should not include app-launch; the launch shout is a dedicated brand audio asset");
  }
}

if (existsSync("public/audio/voice/manifest.json")) {
  const manifest = JSON.parse(readFileSync("public/audio/voice/manifest.json", "utf8"));
  const allowedConcreteVoiceProviders = new Set(["edge-tts Python package", "F5-TTS local", "macOS say + afconvert"]);
  const allowedManifestProviders = new Set([...allowedConcreteVoiceProviders, "mixed local"]);
  if (!allowedManifestProviders.has(manifest.provider)) {
    problems.push(`audio manifest provider is not an approved local pack generator: ${manifest.provider ?? "missing"}`);
  }
  if (manifest.provider !== "edge-tts Python package") {
    problems.push(`release audio manifest should use the standard Edge provider, found ${manifest.provider ?? "missing"}`);
  }
  if (manifest.voice !== "zh-CN-XiaoxiaoNeural") {
    problems.push(`release audio manifest should use zh-CN-XiaoxiaoNeural, found ${manifest.voice ?? "missing"}`);
  }
  if (manifest.provider === "mixed local") {
    if (!Array.isArray(manifest.providers) || !manifest.providers.length) {
      problems.push("mixed audio manifest missing providers");
    } else {
      for (const provider of manifest.providers) {
        if (!allowedConcreteVoiceProviders.has(provider)) problems.push(`mixed audio manifest has unsupported provider: ${provider}`);
      }
    }
  }
  if (manifest.provider === "F5-TTS local" || manifest.providers?.includes("F5-TTS local")) {
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
        if (!existsSync(filePath)) {
          problems.push(`audio manifest file missing: ${entry.src}`);
        } else {
          for (const problem of inspectVoiceMedia(readFileSync(filePath), entry.text ?? "").problems) {
            problems.push(`audio manifest media invalid for ${entry.id ?? "unknown"}: ${problem}`);
          }
        }
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
      const manifestEntryById = new Map(manifest.entries.map((entry) => [entry.id, entry]));
      const nonStandardCoreVoiceLines = voiceLineData.lines.filter((line) => {
        const entry = manifestEntryById.get(line.id);
        return (
          entry?.src?.includes("/macos-") &&
          (line.contexts ?? []).some((context) => String(context).startsWith("logic-") || String(context).startsWith("graphic-"))
        );
      });
      if (nonStandardCoreVoiceLines.length) {
        problems.push(
          `logic and graphic voice lines should use the standard voice pack, found ${nonStandardCoreVoiceLines.length} macOS entries: ${nonStandardCoreVoiceLines
            .slice(0, 10)
            .map((line) => line.id)
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
    const referencedVoiceFiles = new Set([
      ...manifest.entries.map((entry) => manifestSrcToFilePath(entry.src)).filter(Boolean),
      ...(manifest.segmentEntries ?? []).flatMap((entry) => (entry.srcs ?? []).map(manifestSrcToFilePath).filter(Boolean)),
    ]);
    const runtimeVoiceRoot = join("public", "audio", "voice", "zh-CN");
    const orphanVoiceFiles = listFilesRecursively(runtimeVoiceRoot).filter((filePath) => !referencedVoiceFiles.has(filePath));
    if (orphanVoiceFiles.length) {
      problems.push(
        `runtime voice directory has ${orphanVoiceFiles.length} unreferenced files: ${orphanVoiceFiles.slice(0, 10).join(", ")}`,
      );
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
  graphicTargetMet: counts.graphic >= 48,
  problemCount: problems.length,
  problems: problems.slice(0, 20),
};

console.log(JSON.stringify(report, null, 2));
if (problems.length || counts.math < 100 || counts.logic < 100 || counts.graphic < 48) process.exit(1);

function checkWorldCoverage() {
  const worldIds = new Set(worlds.map((world) => world.id));
  for (const worldId of ["math", "logic", "graphic"]) {
    if (!worldIds.has(worldId)) problems.push(`worlds should include ${worldId}`);
  }
  const graphicWorld = worlds.find((world) => world.id === "graphic");
  if (!graphicWorld) return;
  if (graphicWorld.name !== "图形工坊") problems.push("graphic world should be named 图形工坊");
  if (!/轮廓|遮挡|叠合|线索|密码|缺口/.test(graphicWorld.summary)) {
    problems.push("graphic world summary should describe non-duplicative visual processing work");
  }
}

function checkGraphicWorkshopCoverage() {
  const graphicGames = games.filter((game) => game.world === "graphic");
  if (graphicGames.length !== 6) {
    problems.push(`graphic world should have exactly 6 real-visual first-pass games, found ${graphicGames.length}`);
  }
  const duplicateGraphicIds = new Set([
    "graphic-observation-lab",
    "graphic-pattern-studio",
    "graphic-grid-postoffice",
    "graphic-puzzle-table",
    "graphic-rotation-workbench",
    "graphic-memory-window",
  ]);
  const requiredTags = ["影子配对", "遮挡还原", "局部找整体", "透明叠叠板", "图形密码机", "缺口补一补"];
  const tags = new Set(graphicGames.flatMap((game) => game.abilityTags));
  for (const tag of requiredTags) {
    if (!tags.has(tag)) problems.push(`graphic world missing ability family: ${tag}`);
  }
  const forbiddenTags = ["细节观察", "视觉规律", "空间方位", "部分整体", "旋转方向", "视觉记忆"];
  for (const tag of forbiddenTags) {
    if (tags.has(tag)) problems.push(`graphic world should not reuse logic-house ability family: ${tag}`);
  }
  for (const game of graphicGames) {
    if (!game.id.startsWith("graphic-")) problems.push(`${game.id}: graphic game id should start with graphic-`);
    if (duplicateGraphicIds.has(game.id)) {
      problems.push(`${game.id}: duplicates an existing logic-house visual task family and must be replaced`);
    }
    if (game.rounds.length < 8 || game.rounds.length > 8) {
      problems.push(`${game.id}: graphic first-pass game should have exactly 8 refined rounds, found ${game.rounds.length}`);
    }
  }
  const requiredGraphicItems = [
    "graphicApple",
    "graphicBear",
    "graphicCat",
    "graphicCircle",
    "graphicDiamond",
    "graphicDog",
    "graphicFish",
    "graphicFlower",
    "graphicLeaf",
    "graphicPear",
    "graphicRabbit",
    "graphicRoundedSquare",
    "graphicStar",
    "graphicTriangle",
  ];
  for (const key of requiredGraphicItems) {
    const asset = imageGallery.items?.[key];
    if (!asset) {
      problems.push(`imageGallery.items should register image-gen graphic asset ${key}`);
      continue;
    }
    const imagePath = join("public", asset.src.replace(/^\/+/, ""));
    if (!existsSync(imagePath)) problems.push(`image-gen graphic asset file missing: ${asset.src}`);
  }
}

function checkReferenceReinforcementScope() {
  const reinforcementMarkers = [...source.matchAll(/Reference reinforcement:/g)];
  if (reinforcementMarkers.length > 3) {
    problems.push(`reference reinforcement should stay compact: found ${reinforcementMarkers.length} markers`);
  }
  if (reinforcementMarkers.length === 0) {
    problems.push("reference reinforcement rationale should be documented with Reference reinforcement comments");
  }
}

function extractMapKeys(name, text) {
  return extractMapEntries(name, text).map(([key]) => key);
}

function extractMapEntries(name, text) {
  const start = text.indexOf(`const ${name}`);
  if (start === -1) return [];
  const end = text.indexOf("};", start);
  if (end === -1) return [];
  const block = text.slice(start, end);
  return [...block.matchAll(/^\s*"([^"]+)":\s*\{[^}]*kind:\s*"([^"]+)"/gm)].map((match) => [match[1], match[2]]);
}

function extractRasterKinds(text) {
  const start = text.indexOf("function rasterForKind");
  if (start === -1) return new Set();
  const end = text.indexOf("function CrayonTexture", start);
  const block = text.slice(start, end === -1 ? undefined : end);
  return new Set([...block.matchAll(/kind === "([^"]+)"/g)].map((match) => match[1]));
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

function checkGraphicRoundQuality(round, context) {
  const surfaces = [
    round.sceneImage ? "sceneImage" : null,
    round.visualGroups ? "visualGroups" : null,
    round.sequence ? "sequence" : null,
    round.grid ? "grid" : null,
    round.matrix ? "matrix" : null,
    round.memory ? "memory" : null,
    round.graphicChallenge ? "graphicChallenge" : null,
  ].filter(Boolean);
  if (surfaces.length === 0) {
    problems.push(`${context}: graphic round should have a visual surface`);
  }
  if (!round.graphicChallenge) {
    problems.push(`${context}: graphic round should use a dedicated graphicChallenge surface, not generic token cards`);
  }
  if (round.grid || round.sequence || round.memory || round.visualGroups || round.matrix || round.sceneImage) {
    problems.push(`${context}: graphic round should avoid generic scene, group, grid, matrix, sequence, and memory surfaces`);
  }
  if (surfaces.length > 1) {
    problems.push(`${context}: graphic round should have exactly one authoritative graphicChallenge surface`);
  }
  if (round.graphicChallenge) {
    checkGraphicChallenge(round, context);
  }
  if (!/轮廓|影子|遮住|露出|放大|局部|线索|边|角|尾巴|耳朵|叶子|缺口|叠|上面|下面|透明|密码|对应/.test(round.success)) {
    problems.push(`${context}: graphic success should name visible evidence or operation`);
  }
  if (!/先|再|轮廓|影子|遮住|露出|放大|局部|线索|边|角|尾巴|耳朵|叶子|缺口|叠|上面|下面|透明|密码|对应/.test(round.retry)) {
    problems.push(`${context}: graphic retry should guide a concrete visual operation`);
  }
  if (!/问她|请她/.test(round.parentPrompt) || !/为什么|怎么|哪里|指|说|轮廓|遮住|局部|线索|叠|密码|对应|缺口/.test(round.parentPrompt)) {
    problems.push(`${context}: graphic parentPrompt should ask for a parent-child explanation`);
  }
  const nearMissWords = `${round.retry} ${round.parentPrompt}`;
  if (!/轮廓|影子|露出|遮住|边|角|尖|圆|方|局部|耳朵|尾巴|叶子|叠|上面|下面|密码|对应|缺口/.test(nearMissWords)) {
    problems.push(`${context}: graphic round should explain the likely near-miss distractor dimension`);
  }
}

function checkClockTimeCoverage() {
  const game = games.find((item) => item.id === "math-clock-time");
  if (!game) {
    problems.push("math-clock-time game is missing from 数字岛");
    return;
  }
  if (game.world !== "math") {
    problems.push("math-clock-time should belong to 数字岛");
  }
  if (game.rounds.length !== 12) {
    problems.push(`math-clock-time should contain exactly 12 rounds, found ${game.rounds.length}`);
  }
  const wholeHours = game.rounds.filter((round) => round.clockChallenge?.minute === 0).length;
  const halfHours = game.rounds.filter((round) => round.clockChallenge?.minute === 30).length;
  const timeConversions = game.rounds.filter((round) => round.clockChallenge?.mode === "time-conversion").length;
  if (wholeHours < 4) problems.push(`math-clock-time should include at least 4 whole-hour rounds, found ${wholeHours}`);
  if (halfHours < 4) problems.push(`math-clock-time should include at least 4 half-hour rounds, found ${halfHours}`);
  if (timeConversions < 4) problems.push(`math-clock-time should include at least 4 12-hour-to-24-hour conversion rounds, found ${timeConversions}`);
  if (/challenge\.period/.test(progressiveSetGameSource)) {
    problems.push("ClockChallengeBoard should not render period labels such as 上午/下午 before answer selection");
  }
}

function checkClockTimeRoundQuality(round, context) {
  const challenge = round.clockChallenge;
  if (!challenge) {
    problems.push(`${context}: clock round should use a dedicated clockChallenge surface`);
    return;
  }
  if (round.sequence || round.visualGroups || round.grid || round.matrix || round.memory || round.graphicChallenge) {
    problems.push(`${context}: clock round should have exactly one authoritative clockChallenge surface`);
  }
  if (!Number.isInteger(challenge.hour) || challenge.hour < 1 || challenge.hour > 12) {
    problems.push(`${context}: clockChallenge hour should be 1-12`);
  }
  if (![0, 30].includes(challenge.minute)) {
    problems.push(`${context}: clockChallenge minute should be 0 or 30`);
  }
  if (!["read-time", "time-conversion"].includes(challenge.mode)) {
    problems.push(`${context}: clockChallenge mode is unsupported: ${challenge.mode}`);
  }
  if (!challenge.label?.trim()) {
    problems.push(`${context}: clockChallenge should include a visible label`);
  }
  const answerCount = round.choices.filter((choice) => choice.value === round.answer).length;
  if (answerCount !== 1) {
    problems.push(`${context}: clock answer should appear in choices exactly once`);
  }
  if (round.choices.length < 3) {
    problems.push(`${context}: clock round should have at least three choices`);
  }
  if (challenge.mode === "read-time") {
    if (round.sceneImage) {
      problems.push(`${context}: read-time clock round should not add a scene image`);
    }
    const clockText = `${round.prompt} ${round.instruction} ${round.success} ${round.retry} ${round.parentPrompt} ${round.choices.map((choice) => choice.label).join(" ")} ${challenge.label}`;
    if (/\d+\s*点半|\d+\s*点|点半|半点|几点/.test(clockText)) {
      problems.push(`${context}: clock reading text should use HH:MM numeric time instead of 点/点半/半点 wording`);
    }
    if (!/分针/.test(round.success) || !/长针/.test(round.success) || !/时针/.test(round.success) || !/短针/.test(round.success)) {
      problems.push(`${context}: clock reading success should name 分针/长针 and 时针/短针 evidence`);
    }
    if (!/分针/.test(round.retry) || !/长针/.test(round.retry) || !/时针/.test(round.retry) || !/短针/.test(round.retry)) {
      problems.push(`${context}: clock reading retry should name 分针/长针 and 时针/短针 evidence`);
    }
    if (!/分针/.test(round.parentPrompt) || !/长针/.test(round.parentPrompt) || !/时针/.test(round.parentPrompt) || !/短针/.test(round.parentPrompt)) {
      problems.push(`${context}: clock reading parentPrompt should ask about 分针/长针 and 时针/短针 evidence`);
    }
  }
  if (challenge.mode === "time-conversion") {
    if (!round.sceneImage) {
      problems.push(`${context}: time-conversion clock round should include a generated daily routine scene image`);
    } else {
      const imagePath = join("public", round.sceneImage.src.replace(/^\/+/, ""));
      const size = existsSync(imagePath) ? readPngSize(imagePath) : null;
      if (size && (size.width !== 1200 || size.height !== 675)) {
        problems.push(`${context}: time-conversion scene image should be 1200x675, found ${size.width}x${size.height}`);
      }
      const sceneText = `${round.sceneImage.alt} ${challenge.activity ?? ""}`;
      if (!/早餐|午饭|午睡|玩|晚饭|洗澡|早晨|中午|下午|晚上/.test(sceneText)) {
        problems.push(`${context}: time-conversion scene image alt should name the activity clue`);
      }
    }
    if (!challenge.activity?.trim()) {
      problems.push(`${context}: time-conversion clock round should include an activity clue`);
    }
    const preAnswerText = `${round.prompt} ${round.instruction} ${round.sceneImage?.alt ?? ""} ${round.choices.map((choice) => choice.label).join(" ")}`;
    if (/上午|下午|晚上|中午|早上|早晨/.test(preAnswerText)) {
      problems.push(`${context}: time-conversion prompt, instruction, scene alt, and choices should not leak day-part labels before answering`);
    }
    if (!/^\d{2}:\d{2}$/.test(String(round.answer))) {
      problems.push(`${context}: time-conversion answer should be an HH:MM 24-hour time`);
    }
    for (const choice of round.choices) {
      if (!/^\d{2}:\d{2}$/.test(String(choice.value))) {
        problems.push(`${context}: time-conversion choice should be an HH:MM 24-hour time: ${choice.value}`);
      }
    }
    const clockHourText = String(challenge.hour).padStart(2, "0");
    const minuteText = String(challenge.minute).padStart(2, "0");
    if (!round.choices.some((choice) => choice.value === `${clockHourText}:${minuteText}`) && challenge.hour !== 12) {
      problems.push(`${context}: time-conversion choices should include the plausible 12-hour distractor`);
    }
    const contextText = `${round.success} ${round.retry} ${round.parentPrompt} ${round.difficultyNote ?? ""}`;
    const conversionText = `${round.prompt} ${round.instruction} ${round.success} ${round.retry} ${round.parentPrompt} ${round.choices.map((choice) => choice.label).join(" ")} ${challenge.label}`;
    if (/\d+\s*点半|\d+\s*点|点半|半点|几点/.test(conversionText)) {
      problems.push(`${context}: time-conversion text should use HH:MM numeric time instead of 点/点半/半点 wording`);
    }
    if (!/24|电子钟|一天|场景|图|早餐|午饭|午睡|晚饭|洗澡|活动/.test(contextText)) {
      problems.push(`${context}: time-conversion feedback should explain scene evidence and 24-hour time`);
    }
  }
}

function checkGraphicChallenge(round, context) {
  const challenge = round.graphicChallenge;
  const allowedKinds = new Set(["silhouette-match", "covered-match", "detail-match", "layer-overlap", "code-match", "closure-match"]);
  if (!allowedKinds.has(challenge.kind)) {
    problems.push(`${context}: graphicChallenge has unsupported kind ${challenge.kind}`);
  }
  if (!challenge.figures?.length) {
    problems.push(`${context}: graphicChallenge should draw a stem figure`);
  }
  if (!Array.isArray(challenge.options) || challenge.options.length !== 4) {
    problems.push(`${context}: graphicChallenge should provide exactly four drawn answer options`);
    return;
  }
  const optionValues = new Set(challenge.options.map((option) => option.value));
  if (optionValues.size !== challenge.options.length) {
    problems.push(`${context}: graphicChallenge option values should be unique`);
  }
  for (const choice of round.choices) {
    if (!optionValues.has(choice.value)) {
      problems.push(`${context}: answer choice ${choice.value} has no drawn graphic option`);
    }
  }
  const choiceValueOrder = round.choices.map((choice) => choice.value);
  const optionValueOrder = challenge.options.map((option) => option.value);
  if (JSON.stringify(choiceValueOrder) !== JSON.stringify(optionValueOrder)) {
    problems.push(`${context}: graphic answer choices and drawn options should have identical value order`);
  }
  for (const option of challenge.options) {
    if (!option.figure?.shape && !option.figures?.length) {
      problems.push(`${context}: graphic option ${option.value} should include a drawable shape`);
    }
    if (!option.label?.trim()) {
      problems.push(`${context}: graphic option ${option.value} should include an accessible label`);
    }
    if (option.value !== round.answer && !option.nearMiss?.trim()) {
      problems.push(`${context}: distractor ${option.value} should document its visual near-miss rationale`);
    }
  }
  if (!optionValues.has(round.answer)) {
    problems.push(`${context}: graphic answer should be one of the drawn options`);
  }
  if (round.choices.length !== 4 || round.choices.some((choice) => !/^[ABCD]$/.test(choice.label))) {
    problems.push(`${context}: graphic answer buttons should be A/B/C/D labels backed by drawn options`);
  }
  if (challenge.kind === "silhouette-match") {
    const nonShadowOptions = challenge.options.filter((option) =>
      (option.figures ?? (option.figure ? [option.figure] : [])).some((figure) => figure.mode !== "shadow"),
    );
    if (nonShadowOptions.length) {
      problems.push(`${context}: silhouette-match options should all be black shadow figures`);
    }
  }
  if (challenge.kind === "code-match") {
    const blankSlots = challenge.figures.filter((figure) => figure.mode === "blank");
    if (blankSlots.length !== 1) {
      problems.push(`${context}: code-match stem should show exactly one blank answer slot`);
    }
    const missingQueryClone = challenge.figures.some((figure) => figure.mode === "missing" && figure.shape === round.answer);
    if (missingQueryClone) {
      problems.push(`${context}: code-match should not draw the answer/query as a missing-outline placeholder`);
    }
  }
  if (challenge.kind === "layer-overlap") {
    if (JSON.stringify(challenge.figures) === JSON.stringify(challenge.options.find((option) => option.value === round.answer)?.figures ?? [])) {
      problems.push(`${context}: layer-overlap stem should not show the correct overlap result before answering`);
    }
    const groupLabels = (challenge.groups ?? []).map((group) => group.label ?? "").join(" ");
    if (!/示例/.test(groupLabels) || !/要叠/.test(challenge.stemLabel)) {
      problems.push(`${context}: layer-overlap stem should include a non-answer example and the two figures to overlap`);
    }
    const rationaleLabels = challenge.options.filter((option) => /上下顺序反了|重叠位置偏了|换成相近图形/.test(option.label));
    if (rationaleLabels.length) {
      problems.push(`${context}: layer-overlap option labels should describe the drawn option, not reveal the distractor rationale`);
    }
  }
}

function checkChoicePositionBalance(game) {
  const buckets = new Map();
  for (const round of game.rounds) {
    const choiceCount = round.choices.length;
    if (!buckets.has(choiceCount)) buckets.set(choiceCount, []);
    buckets.get(choiceCount).push(round);
  }
  for (const [choiceCount, rounds] of buckets) {
    if (choiceCount < 2) continue;
    const positions = rounds.map((round) => round.choices.findIndex((choice) => choice.value === round.answer));
    if (positions.some((position) => position < 0)) continue;
    const counts = Array.from({ length: choiceCount }, (_, index) => positions.filter((position) => position === index).length);
    if (Math.max(...counts) - Math.min(...counts) > 1) {
      problems.push(`${game.id}: correct choice positions for ${choiceCount}-choice rounds are imbalanced: ${counts.join("/")}`);
    }
    let runLength = 1;
    for (let index = 1; index < positions.length; index += 1) {
      runLength = positions[index] === positions[index - 1] ? runLength + 1 : 1;
      if (runLength > 2) {
        problems.push(`${game.id}: correct choice position ${positions[index] + 1} repeats more than twice in ${choiceCount}-choice rounds`);
        break;
      }
    }
  }
}

function checkCurriculumIntegrityWording(game, round, context) {
  if (/先看河有多宽|可以把两块木板接起来|先选长的/.test(round.instruction)) {
    problems.push(`${context}: bridge instruction reveals the intended answer instead of guiding comparison`);
  }
  if (/逆时针就是往左边转/.test(round.instruction)) {
    problems.push(`${context}: rotation instruction can reveal the next direction`);
  }
  const evidenceText = `${round.prompt} ${round.instruction} ${round.success} ${round.retry} ${round.parentPrompt} ${round.difficultyNote ?? ""}`;
  if (/谁离倒下的杯子最近|离倒下的杯子最近|近的线索是不是比远的线索更有用|近处强线索|近处线索|线索通常离事件更近|线索离洒水这件事最近/.test(evidenceText)) {
    problems.push(`${context}: spilled-water reasoning should seek direct evidence instead of treating proximity as proof`);
  }
  if (game.id === "math-clock-time" && round.clockChallenge?.mode === "read-time") {
    for (const field of ["instruction", "success", "retry", "parentPrompt", "difficultyNote"]) {
      const text = round[field] ?? "";
      const hourIndex = text.indexOf("时针（短针）");
      const minuteIndex = text.indexOf("分针（长针）");
      if (hourIndex < 0 || minuteIndex < 0 || hourIndex > minuteIndex) {
        problems.push(`${context}: ${field} should introduce 时针（短针） before 分针（长针）`);
      }
    }
  }
}

function manifestSrcToFilePath(src) {
  if (!src) return null;
  return join("public", decodeURIComponent(src).replace(/^\/+/, ""));
}

function listFilesRecursively(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(root, entry.name);
    return entry.isDirectory() ? listFilesRecursively(entryPath) : [entryPath];
  });
}

function checkPatternTrainRoundQuality(round, context) {
  const sequence = round.sequence;
  if (!Array.isArray(sequence) || sequence.length === 0) {
    problems.push(`${context}: pattern-train round should show a sequence`);
    return;
  }

  const missingIndexes = sequence
    .map((item, index) => (item === "?" ? index : -1))
    .filter((index) => index !== -1);
  if (missingIndexes.length !== 1) {
    problems.push(`${context}: pattern-train sequence should contain exactly one missing card`);
    return;
  }

  const patternUnit = round.patternUnit;
  if (!Array.isArray(patternUnit) || patternUnit.length < 2) {
    problems.push(`${context}: pattern-train round should include a patternUnit`);
    return;
  }

  const expectedAnswer = patternUnit[missingIndexes[0] % patternUnit.length];
  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: pattern-train answer should match repeated pattern`);
  }
  if (choiceValueCount(round.choices, round.answer) !== 1) {
    problems.push(`${context}: pattern-train choices should include the answer exactly once`);
  }

  const choiceValues = round.choices.map((choice) => choice.value);
  const renderedTokens = new Set([...sequence.filter((item) => item !== "?"), ...choiceValues]);
  for (const token of renderedTokens) {
    const kind = knownVisualKinds.get(token);
    if (!kind || !kind.startsWith("pattern") || !rasterVisualKinds.has(kind)) {
      problems.push(`${context}: pattern token should use a registered local PNG: ${token}`);
    }
  }
  const uniqueUnitValues = [...new Set(patternUnit)];
  const allowedChoices = patternTrainAllowedChoices(patternUnit);
  if (choiceValues.length < 3) {
    problems.push(`${context}: pattern-train choices should include at least three options`);
  }
  if (!uniqueUnitValues.every((value) => choiceValues.includes(value)) || !choiceValues.every((value) => allowedChoices.has(value))) {
    problems.push(`${context}: pattern-train choices should stay tied to the visible pattern`);
  }
  if (patternUnit.some((value) => ["⬤", "●", "•"].includes(value))) {
    const sizeFamily = new Set(["⬤", "●", "•"]);
    if (!choiceValues.every((value) => sizeFamily.has(value))) {
      problems.push(`${context}: size pattern choices should stay within the size family`);
    }
  }

  const unitText = patternUnit.map(patternTrainLabel).join("、");
  const filledLabels = sequence.map((item, index) => patternTrainLabel(item === "?" ? patternUnit[index % patternUnit.length] : item));
  const filledText = filledLabels.join("、");
  const answerLabel = patternTrainLabel(round.answer);
  if (!round.success.includes(unitText) || !round.success.includes(filledText) || !round.success.includes(answerLabel) || !/规律|重复|一组|顺序|所以/.test(round.success)) {
    problems.push(`${context}: pattern-train success should name repeat unit, filled sequence, and answer`);
  }
  if (!round.retry.includes(unitText) || !round.retry.includes(filledText) || !round.retry.includes(answerLabel) || !/从左到右|念|说|顺序|重复/.test(round.retry)) {
    problems.push(`${context}: pattern-train retry should name repeat unit or filled sequence and answer`);
  }
  if (!round.parentPrompt.includes(unitText) || !round.parentPrompt.includes(filledText) || !round.parentPrompt.includes(answerLabel) || !/指|说|为什么|解释|复述/.test(round.parentPrompt)) {
    problems.push(`${context}: pattern-train parentPrompt should ask for a child explanation of the pattern`);
  }
}

function patternTrainAllowedChoices(patternUnit) {
  const choices = new Set(patternUnit);
  const uniqueUnitValues = [...new Set(patternUnit)];
  const families = [
    ["🔴", "🔵", "🟡", "🟢", "🟣"],
    ["☀️", "🌙", "⭐"],
    ["🍓", "🍪", "🍎", "🍊", "🍬"],
    ["⬤", "●", "•"],
  ];
  for (const family of families) {
    if (uniqueUnitValues.every((value) => family.includes(value))) {
      family.forEach((value) => choices.add(value));
    }
  }
  return choices;
}

function patternTrainLabel(item) {
  return {
    "🔴": "红色圆片",
    "🔵": "蓝色圆片",
    "🟡": "黄色圆片",
    "🟢": "绿色圆片",
    "🟣": "紫色圆片",
    "☀️": "太阳",
    "🌙": "月亮",
    "⭐": "星星",
    "⬤": "大圆",
    "●": "中圆",
    "•": "小圆",
    "🍓": "草莓",
    "🍪": "饼干",
    "🍎": "苹果",
    "🍊": "橘子",
    "🍬": "糖果",
  }[item] ?? item;
}

function checkRelationPairRoundQuality(round, context) {
  if (round.sceneImage) {
    problems.push(`${context}: relation-pair round should not use decorative scene images that compress or distract from pair evidence`);
  }
  if ((round.visualGroups ?? []).some((group) => /可选|观察/.test(group.label))) {
    problems.push(`${context}: relation-pair visual groups should show evidence only, not answer choices`);
  }
  const choiceLabels = round.choices.map((choice) => choice.label);
  const stemText = `${round.prompt} ${round.instruction}`;
  for (const label of choiceLabels) {
    if (label.length > 1 && stemText.includes(label)) {
      problems.push(`${context}: relation-pair prompt should not reveal answer choices in the stem: ${label}`);
    }
  }
  const visualItems = (round.visualGroups ?? []).flatMap((group) => group.items);
  for (const label of choiceLabels) {
    if (visualItems.includes(label)) {
      problems.push(`${context}: relation-pair visual groups should not duplicate answer choices: ${label}`);
    }
  }
  if (!progressiveSetGameSource.includes("visual-groups-relation")) {
    problems.push("ProgressiveSetGame should give relation-pair evidence groups a dedicated visual-groups-relation class");
  }
  if (!/\.visual-groups-relation/.test(readFileSync("src/styles.css", "utf8"))) {
    problems.push("styles should size relation-pair visual tokens without narrow five-column bases");
  }
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
  for (const item of [...visualItems, ...choiceLabels]) {
    if (isUnillustratedText(item)) {
      problems.push(`${context}: same-kind item should have a visual cue mapping: ${item}`);
    }
    if (shouldUseProjectRaster(item)) {
      problems.push(`${context}: same-kind concrete item should use an imageGallery raster icon: ${item}`);
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
  for (const item of [...left, ...right, ...round.choices.map((choice) => choice.label)]) {
    if (isUnillustratedText(item)) {
      problems.push(`${context}: difference item should have a visual cue mapping: ${item}`);
    }
    if (shouldUseProjectRaster(item)) {
      problems.push(`${context}: difference concrete item should use an imageGallery raster icon: ${item}`);
    }
  }
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

function shouldUseProjectRaster(item) {
  const vectorOnlyKinds = new Set([
    "arrow",
    "bigDot",
    "bigSquare",
    "blueDot",
    "blueSquare",
    "downArrow",
    "emptyBox",
    "greenDot",
    "horizontalFold",
    "leftArrow",
    "mediumDot",
    "missingSlot",
    "purpleDot",
    "redDot",
    "rightArrow",
    "smallDot",
    "smallSquare",
    "upArrow",
    "verticalFold",
    "yellowDot",
  ]);
  const kinds = visualKindsForItem(item);
  return kinds.length > 0 && kinds.some((kind) => !vectorOnlyKinds.has(kind) && !rasterVisualKinds.has(kind));
}

function visualKindsForItem(item) {
  const exactKind = knownVisualKinds.get(item);
  if (exactKind) return [exactKind];
  const parts = Array.from(item).filter((part) => part !== "\uFE0F");
  if (parts.length > 1 && parts.every((part) => knownVisualKinds.has(part))) {
    return parts.map((part) => knownVisualKinds.get(part));
  }
  return [];
}

function checkPartWholePuzzleRoundQuality(round, context) {
  const wholeGroup = round.visualGroups?.find((group) => group.label === "完整图");
  if (!wholeGroup) {
    problems.push(`${context}: part-whole round should show a 完整图 group`);
    return;
  }
  if (wholeGroup.items.some((item) => visualKindsForItem(item).length > 1)) {
    problems.push(`${context}: 完整图 should be laid out as separate pieces, not one combined visual token`);
  }
  if (/还少哪一块/.test(round.prompt)) {
    const haveGroup = round.visualGroups?.find((group) => group.label === "已经有");
    if (!haveGroup) problems.push(`${context}: missing-piece round should show 已经有 pieces`);
    if (haveGroup && wholeGroup.items.length <= haveGroup.items.length) {
      problems.push(`${context}: 完整图 should include the missing piece in the same piece layout`);
    }
    for (const choice of round.choices) {
      if (choice.label === choice.value && visualKindsForItem(choice.value).length > 0) {
        problems.push(`${context}: missing-piece choice should use a child-readable label, not a raw visual token: ${choice.label}`);
      }
    }
  }
}

function checkBalanceSwapRoundQuality(round, context) {
  if (!round.visualGroups?.some((group) => ["天平左边", "天平右边", "1 个可以换", "规则"].includes(group.label))) return;
  for (const choice of round.choices) {
    const kinds = visualKindsForItem(choice.label);
    if (kinds.length > 1) {
      problems.push(`${context}: balance answer choice should be a count label, not a combined repeated visual token: ${choice.label}`);
    }
  }
  if (visualKindsForItem(round.answer).length > 1) {
    problems.push(`${context}: balance answer value should be a count label, not a combined repeated visual token: ${round.answer}`);
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

function checkThreeViewBlockRoundQuality(round, context) {
  if (/从上面看/.test(round.prompt)) {
    checkThreeViewTopRound(round, context);
    return;
  }
  if (/从前面看/.test(round.prompt)) {
    checkThreeViewFrontRound(round, context);
    return;
  }
  if (/从左边看/.test(round.prompt)) {
    checkThreeViewLeftRound(round, context);
  }
}

function checkThreeViewTopRound(round, context) {
  const cells = round.grid?.cells;
  if (!isNumericCellGrid(cells)) {
    problems.push(`${context}: three-view top round should show a numeric grid`);
    return;
  }
  const expectedCount = countPositiveCells(cells);
  if (round.answer !== String(expectedCount)) {
    problems.push(`${context}: three-view top answer should equal the count of non-zero positions`);
  }
  if (
    !/从上面看/.test(round.success) ||
    !/位置/.test(round.success) ||
    !round.success.includes(String(expectedCount)) ||
    !/不是 0|不为 0|大于 0|有积木/.test(round.success) ||
    !/0 是空位|0 是空的|空位/.test(round.success)
  ) {
    problems.push(`${context}: three-view top success should explain visible positions and final count`);
  }
  if (!/不是 0|不为 0|大于 0|有积木/.test(round.retry) || !/不要|不/.test(round.retry) || !/层数|相加|加/.test(round.retry)) {
    problems.push(`${context}: three-view top retry should ask for non-zero positions, not layer totals`);
  }
  if (
    !/点|指/.test(round.parentPrompt) ||
    !/不是 0|不为 0|大于 0|有积木/.test(round.parentPrompt) ||
    !/空位|空的/.test(round.parentPrompt)
  ) {
    problems.push(`${context}: three-view top parentPrompt should ask the child to point to visible and empty positions`);
  }
}

function checkThreeViewFrontRound(round, context) {
  const cells = round.grid?.cells;
  if (!isNumericCellGrid(cells) || !hasRectangularRows(cells)) {
    problems.push(`${context}: three-view front round should show a numeric grid`);
    return;
  }
  const expectedAnswer = heightSequenceAnswer(columnMaximums(cells));
  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: three-view front answer should equal column maximums from left to right`);
  }
  if (!round.choices.some((choice) => choice.value === expectedAnswer)) {
    problems.push(`${context}: three-view front choices should include the correct column-maximum answer`);
  }
  if (!heightChoicesMatchCount(round.choices, cells[0].length)) {
    problems.push(`${context}: three-view front choices should use one height per visible column`);
  }
  if (
    !/从前面看/.test(round.success) ||
    !/列/.test(round.success) ||
    !/最高/.test(round.success) ||
    !round.success.includes(expectedAnswer)
  ) {
    problems.push(`${context}: three-view front success should name front view, columns, highest stacks, and final answer`);
  }
  if (!/从前面看/.test(round.retry) || !/列/.test(round.retry) || !/最高|最大/.test(round.retry) || !/不要|不/.test(round.retry) || !/相加|加/.test(round.retry)) {
    problems.push(`${context}: three-view front retry should ask the child to read columns without adding`);
  }
  if (
    !/从前面看/.test(round.parentPrompt) ||
    !/列/.test(round.parentPrompt) ||
    !/最高/.test(round.parentPrompt) ||
    !/挡住|藏|看不到|遮住|只露/.test(round.parentPrompt)
  ) {
    problems.push(`${context}: three-view front parentPrompt should ask for column heights and hidden stacks`);
  }
}

function checkThreeViewLeftRound(round, context) {
  const cells = round.grid?.cells;
  if (!isNumericCellGrid(cells) || !hasRectangularRows(cells)) {
    problems.push(`${context}: three-view left round should show a numeric grid`);
    return;
  }
  const expectedAnswer = heightSequenceAnswer(rowMaximums(cells));
  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: three-view left answer should equal row maximums from top to bottom`);
  }
  if (!round.choices.some((choice) => choice.value === expectedAnswer)) {
    problems.push(`${context}: three-view left choices should include the correct row-maximum answer`);
  }
  if (!heightChoicesMatchCount(round.choices, cells.length)) {
    problems.push(`${context}: three-view left choices should use one height per visible row`);
  }
  if (
    !/从左边看/.test(round.success) ||
    !/排|行/.test(round.success) ||
    !/最高/.test(round.success) ||
    !round.success.includes(expectedAnswer)
  ) {
    problems.push(`${context}: three-view left success should name left view, rows, highest stacks, and final answer`);
  }
  if (!/从左边看/.test(round.retry) || !/排|行/.test(round.retry) || !/最高|最大/.test(round.retry) || !/不要|不/.test(round.retry) || !/相加|加/.test(round.retry)) {
    problems.push(`${context}: three-view left retry should ask the child to read rows without adding`);
  }
  if (
    !/从左边看/.test(round.parentPrompt) ||
    !/排|行/.test(round.parentPrompt) ||
    !/最高/.test(round.parentPrompt) ||
    !/挡住|藏|看不到|遮住|只露/.test(round.parentPrompt)
  ) {
    problems.push(`${context}: three-view left parentPrompt should ask for row heights and hidden stacks`);
  }
}

function countPositiveCells(cells) {
  return cells.flat().filter((value) => Number(value) > 0).length;
}

function hasRectangularRows(cells) {
  return cells.every((row) => row.length === cells[0].length);
}

function columnMaximums(cells) {
  return cells[0].map((_, columnIndex) => Math.max(...cells.map((row) => Number(row[columnIndex]))));
}

function rowMaximums(cells) {
  return cells.map((row) => Math.max(...row.map((value) => Number(value))));
}

function heightSequenceAnswer(values) {
  if (values.length === 1) return String(values[0]);
  if (values.length === 2) return `${values[0]}和${values[1]}`;
  return values.join("、");
}

function heightChoicesMatchCount(choices, expectedCount) {
  return choices.every((choice) => heightSequenceLength(choice.value) === expectedCount);
}

function heightSequenceLength(value) {
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/\s+/g, "");
  if (/^\d+$/.test(normalized)) return 1;
  if (normalized.includes("、")) {
    const parts = normalized.split("、");
    return parts.every(isNumericText) ? parts.length : 0;
  }
  if (normalized.includes("和")) {
    const parts = normalized.split("和");
    return parts.every(isNumericText) ? parts.length : 0;
  }
  return 0;
}

function checkRouteStepRoundQuality(round, context) {
  const cells = round.grid?.cells;
  if (!isRouteGrid(cells)) {
    problems.push(`${context}: route-step round should show a rectangular grid`);
    return;
  }

  const start = parseRouteStart(round.prompt);
  if (!start) {
    problems.push(`${context}: route-step prompt should name a grid start item`);
    return;
  }

  const startPositions = findGridPositions(cells, start);
  if (startPositions.length !== 1) {
    problems.push(`${context}: route-step start item should appear exactly once in the grid`);
    return;
  }

  const moves = parseRouteMoves(round.prompt);
  if (moves.length < 1 || moves.length > 2) {
    problems.push(`${context}: route-step prompt should contain one or two supported one-cell moves`);
    return;
  }

  const route = traceRoute(cells, startPositions[0], moves);
  if (!route) {
    problems.push(`${context}: route-step move should stay inside the grid`);
    return;
  }

  const finalDestination = route[route.length - 1].item;
  if (round.answer !== finalDestination) {
    problems.push(`${context}: route-step answer should equal the computed destination`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === finalDestination);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: route-step choices should include the computed destination exactly once`);
  }

  if (moves.length === 1) {
    checkRouteOneStepWording(round, context, start, moves[0], finalDestination);
  } else {
    checkRouteTwoStepWording(round, context, start, moves, route);
  }
}

function checkRouteOneStepWording(round, context, start, move, destination) {
  if (!round.success.includes(start) || !round.success.includes(move.text) || !round.success.includes(destination)) {
    problems.push(`${context}: route-step one-step success should name start, direction, and destination`);
  }
  if (!round.retry.includes(start) || !round.retry.includes(move.text) || !/一步|一格/.test(round.retry)) {
    problems.push(`${context}: route-step one-step retry should ask for exactly one move from the start`);
  }
  if (!round.parentPrompt.includes(start) || !round.parentPrompt.includes(move.text) || !/指|点|移动|走/.test(round.parentPrompt)) {
    problems.push(`${context}: route-step one-step parentPrompt should ask the child to point one move from the start`);
  }
}

function checkRouteTwoStepWording(round, context, start, moves, route) {
  const firstDestination = route[0].item;
  const finalDestination = route[1].item;
  if (
    !round.success.includes(start) ||
    !round.success.includes(moves[0].text) ||
    !round.success.includes(firstDestination) ||
    !round.success.includes(moves[1].text) ||
    !round.success.includes(finalDestination) ||
    !/先|第一步/.test(round.success) ||
    !/再|第二步/.test(round.success)
  ) {
    problems.push(`${context}: route-step two-step success should name start, first destination, second move, and final destination`);
  }
  if (!round.retry.includes(moves[0].text) || !round.retry.includes(moves[1].text) || !/第一步|先/.test(round.retry) || !/第二步|再/.test(round.retry)) {
    problems.push(`${context}: route-step two-step retry should ask for first destination before second move`);
  }
  if (
    !round.parentPrompt.includes(start) ||
    !round.parentPrompt.includes(firstDestination) ||
    !round.parentPrompt.includes(finalDestination) ||
    !/第一步|先/.test(round.parentPrompt) ||
    !/第二步|最后|再/.test(round.parentPrompt)
  ) {
    problems.push(`${context}: route-step two-step parentPrompt should ask for first destination, second destination, and final answer`);
  }
}

function isRouteGrid(cells) {
  return Array.isArray(cells) && cells.length > 0 && cells.every((row) => Array.isArray(row) && row.length > 0 && row.every((item) => typeof item === "string" && item.trim())) && hasRectangularRows(cells);
}

function parseRouteStart(prompt) {
  return prompt.match(/^从(.+?)出发/)?.[1] ?? null;
}

function parseRouteMoves(prompt) {
  return [...prompt.matchAll(/往(右|左|上|下)一步/g)].map((match) => ({
    direction: match[1],
    text: `往${match[1]}一步`,
    delta: routeDirectionDelta(match[1]),
  })).filter((move) => move.delta);
}

function routeDirectionDelta(direction) {
  return {
    右: [0, 1],
    左: [0, -1],
    上: [-1, 0],
    下: [1, 0],
  }[direction] ?? null;
}

function findGridPositions(cells, item) {
  const positions = [];
  cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === item) positions.push([rowIndex, columnIndex]);
    });
  });
  return positions;
}

function traceRoute(cells, startPosition, moves) {
  let [row, column] = startPosition;
  const route = [];
  for (const move of moves) {
    row += move.delta[0];
    column += move.delta[1];
    if (!cells[row]?.[column]) return null;
    route.push({ row, column, item: cells[row][column] });
  }
  return route;
}

function checkPositionMapRoundQuality(round, context) {
  const relativeMatch = round.prompt.match(/^(.+?)看(.+?)，\2在\1的哪边/);
  if (relativeMatch) {
    checkPositionRelativeRound(round, context, relativeMatch[1], relativeMatch[2]);
    return;
  }

  const neighborMatch = round.prompt.match(/^(?:谁在(.+?)的(左边|右边|上面|下面)|(.+?)的(左边|右边|上面|下面)是什么)/);
  if (neighborMatch) {
    checkPositionNeighborRound(round, context, neighborMatch[1] ?? neighborMatch[3], neighborMatch[2] ?? neighborMatch[4]);
    return;
  }

  const insideOutsideMatch = round.prompt.match(/^谁在盒子(里面|外面)/);
  if (insideOutsideMatch) {
    checkPositionInsideOutsideRound(round, context, insideOutsideMatch[1]);
    return;
  }

  problems.push(`${context}: position-map prompt should be a supported neighbor, inside/outside, or relative direction question`);
}

function checkPositionNeighborRound(round, context, target, direction) {
  const cells = round.grid?.cells;
  if (!isPositionMapGrid(cells)) {
    problems.push(`${context}: position-map neighbor round should show a rectangular grid`);
    return;
  }

  const targetPositions = findGridPositions(cells, target);
  if (targetPositions.length !== 1) {
    problems.push(`${context}: position-map neighbor target should appear exactly once in the grid`);
    return;
  }

  const delta = positionDirectionDelta(direction);
  const [targetRow, targetColumn] = targetPositions[0];
  const neighbor = cells[targetRow + delta[0]]?.[targetColumn + delta[1]];
  if (!neighbor) {
    problems.push(`${context}: position-map neighbor direction should stay inside the grid`);
    return;
  }

  if (round.answer !== neighbor) {
    problems.push(`${context}: position-map neighbor answer should equal the one-cell ${direction} item`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === neighbor);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: position-map neighbor choices should include the computed item exactly once`);
  }

  if (!round.success.includes(target) || !round.success.includes(direction) || !round.success.includes(neighbor) || !/一格/.test(round.success)) {
    problems.push(`${context}: position-map neighbor success should name target, direction, one-cell move, and answer`);
  }
  if (!round.retry.includes(target) || !round.retry.includes(direction) || !round.retry.includes(neighbor) || !/先/.test(round.retry) || !/一格|指|点/.test(round.retry)) {
    problems.push(`${context}: position-map neighbor retry should ask the child to start at the target and move one cell`);
  }
  if (!round.parentPrompt.includes(target) || !round.parentPrompt.includes(direction) || !round.parentPrompt.includes(neighbor) || !/指|点|一格|为什么/.test(round.parentPrompt)) {
    problems.push(`${context}: position-map neighbor parentPrompt should ask for a pointed one-cell explanation`);
  }
}

function checkPositionInsideOutsideRound(round, context, requestedSide) {
  const insideGroup = round.visualGroups?.find((group) => group.label === "盒子里面");
  const outsideGroup = round.visualGroups?.find((group) => group.label === "盒子外面");
  if (!insideGroup || !outsideGroup) {
    problems.push(`${context}: position-map inside/outside round should show box inside and outside groups`);
    return;
  }

  const requestedItems = requestedSide === "里面" ? insideGroup.items : outsideGroup.items;
  if (!requestedItems.includes(round.answer)) {
    problems.push(`${context}: position-map inside/outside answer should belong to the requested group`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === round.answer);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: position-map inside/outside choices should include the answer exactly once`);
  }

  if (!round.success.includes("盒子") || !round.success.includes(round.answer) || !/里面/.test(round.success) || !/外面/.test(round.success)) {
    problems.push(`${context}: position-map inside/outside success should name answer and contrast inside with outside`);
  }
  if (!round.retry.includes(round.answer) || !/里面/.test(round.retry) || !/外面/.test(round.retry)) {
    problems.push(`${context}: position-map inside/outside retry should compare inside and outside groups`);
  }
  if (!round.parentPrompt.includes(round.answer) || !/里面/.test(round.parentPrompt) || !/外面/.test(round.parentPrompt) || !/指|点|说/.test(round.parentPrompt)) {
    problems.push(`${context}: position-map inside/outside parentPrompt should ask for a pointed inside/outside explanation`);
  }
}

function checkPositionRelativeRound(round, context, source, target) {
  const cells = round.grid?.cells;
  if (!isPositionMapGrid(cells)) {
    problems.push(`${context}: position-map relative round should show a rectangular grid`);
    return;
  }

  const sourcePositions = findGridPositions(cells, source);
  const targetPositions = findGridPositions(cells, target);
  if (sourcePositions.length !== 1 || targetPositions.length !== 1) {
    problems.push(`${context}: position-map relative source and target should each appear exactly once in the grid`);
    return;
  }

  const expectedDirection = relativeDirectionBetween(sourcePositions[0], targetPositions[0]);
  if (!expectedDirection) {
    problems.push(`${context}: position-map relative source and target should share a row or column`);
    return;
  }

  if (round.answer !== expectedDirection) {
    problems.push(`${context}: position-map relative answer should be computed from source to target`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === expectedDirection);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: position-map relative choices should include the computed direction exactly once`);
  }

  if (!round.success.includes(source) || !round.success.includes(target) || !round.success.includes(expectedDirection) || !/出发|开始|先指/.test(round.success)) {
    problems.push(`${context}: position-map relative success should name source, target, answer, and start-from-source strategy`);
  }
  if (!round.retry.includes(source) || !round.retry.includes(target) || !round.retry.includes(expectedDirection) || !/从|先/.test(round.retry)) {
    problems.push(`${context}: position-map relative retry should ask the child to start from the source viewpoint`);
  }
  if (!round.parentPrompt.includes(source) || !round.parentPrompt.includes(target) || !round.parentPrompt.includes(expectedDirection) || !/指|点|从/.test(round.parentPrompt)) {
    problems.push(`${context}: position-map relative parentPrompt should ask for a pointed source-to-target explanation`);
  }
}

function isPositionMapGrid(cells) {
  return Array.isArray(cells) && cells.length > 0 && cells.every((row) => Array.isArray(row) && row.length > 0 && row.every(isNonBlankString)) && hasRectangularRows(cells);
}

function positionDirectionDelta(direction) {
  return {
    右边: [0, 1],
    左边: [0, -1],
    上面: [-1, 0],
    下面: [1, 0],
  }[direction] ?? [0, 0];
}

function relativeDirectionBetween(sourcePosition, targetPosition) {
  const [sourceRow, sourceColumn] = sourcePosition;
  const [targetRow, targetColumn] = targetPosition;
  if (sourceRow === targetRow) return targetColumn > sourceColumn ? "右边" : "左边";
  if (sourceColumn === targetColumn) return targetRow > sourceRow ? "下面" : "上面";
  return null;
}

function checkSpatialVisualSurface(round, context) {
  if (round.sceneImage && (round.grid || round.visualGroups)) {
    problems.push(`${context}: spatial map round should use one answer surface; remove sceneImage when grid or visual groups provide the answer surface`);
  }
}

function addressGridUsesNestedVisualToken(sourceText) {
  const match = sourceText.match(/function AddressGrid[\s\S]*?function MatrixBoard/);
  if (!match) return false;
  return /<VisualToken\s+value=\{grid\.cells/.test(match[0]);
}

function visualChoicesUseDuplicatedRawLabels(sourceText) {
  return /<ChoiceCue\s+label=\{choice\.label\}\s*\/>\s*<span>\{choice\.label\}<\/span>/.test(sourceText);
}

function matrixBoardUsesNestedVisualToken(sourceText) {
  const match = sourceText.match(/function MatrixBoard[\s\S]*?type SceneKind/);
  if (!match) return false;
  return /<VisualToken\s+value=\{cell\}\s*\/>/.test(match[0]);
}

function memoryBoardUsesNestedVisualToken(sourceText) {
  const match = sourceText.match(/function MemoryBoard[\s\S]*?function AddressGrid/);
  if (!match) return false;
  return /<VisualToken\b/.test(match[0]);
}

function checkMemoryCameraRoundQuality(round, context) {
  const labels = memoryCameraLabels(round.memory?.items);
  if (!labels.length) {
    problems.push(`${context}: memory-camera round should show memory items`);
    return;
  }
  if (new Set(labels).size !== labels.length) {
    problems.push(`${context}: memory-camera memory items should be unique after label normalization`);
  }

  if (round.prompt === "刚才相机里出现过谁？") {
    checkMemoryAppearedRound(round, context, labels);
    return;
  }

  if (round.prompt === "哪一个刚才没有出现？") {
    checkMemoryAbsentRound(round, context, labels);
    return;
  }

  const orderMatch = round.prompt.match(/^刚才(第一个|第二个|第三个|最后一个)是什么/);
  if (orderMatch) {
    checkMemoryOrderRound(round, context, labels, orderMatch[1]);
    return;
  }

  problems.push(`${context}: memory-camera prompt should ask appeared, absent, or order memory`);
}

function checkMemoryAppearedRound(round, context, labels) {
  if (!labels.includes(round.answer)) {
    problems.push(`${context}: memory-camera appeared answer should match a remembered card`);
  }
  if (choiceValueCount(round.choices, round.answer) !== 1) {
    problems.push(`${context}: memory-camera appeared choices should include the answer exactly once`);
  }
  if (!round.choices.some((choice) => !labels.includes(choice.value))) {
    problems.push(`${context}: memory-camera appeared choices should include a not-shown distractor`);
  }
  if (!textNamesMemorySetAndAnswer(round.success, labels, round.answer) || !/出现过|有/.test(round.success)) {
    problems.push(`${context}: memory-camera appeared success should name remembered cards and answer`);
  }
  if (!textNamesMemorySetAndAnswer(round.retry, labels, round.answer) || !/先|回想|念|记/.test(round.retry)) {
    problems.push(`${context}: memory-camera appeared retry should ask the child to recall remembered cards before answering`);
  }
  if (!textNamesMemorySetAndAnswer(round.parentPrompt, labels, round.answer) || !/说|复述|念|记/.test(round.parentPrompt)) {
    problems.push(`${context}: memory-camera appeared parentPrompt should ask the child to say remembered cards and answer`);
  }
}

function checkMemoryAbsentRound(round, context, labels) {
  if (labels.includes(round.answer)) {
    problems.push(`${context}: memory-camera absent answer should not be in remembered cards`);
  }
  if (choiceValueCount(round.choices, round.answer) !== 1) {
    problems.push(`${context}: memory-camera absent choices should include the answer exactly once`);
  }
  const wrongChoiceValues = round.choices.map((choice) => choice.value).filter((value) => value !== round.answer);
  if (!wrongChoiceValues.length || !wrongChoiceValues.every((value) => labels.includes(value))) {
    problems.push(`${context}: memory-camera absent wrong choices should be remembered cards for exclusion`);
  }
  if (!textNamesMemorySetAndAnswer(round.success, labels, round.answer) || !/没有出现|没出现|多出来/.test(round.success)) {
    problems.push(`${context}: memory-camera absent success should name remembered cards and absent answer`);
  }
  if (!textNamesMemorySetAndAnswer(round.retry, labels, round.answer) || !/排除|多出来|没有出现|没出现|先/.test(round.retry)) {
    problems.push(`${context}: memory-camera absent retry should ask the child to exclude remembered cards`);
  }
  if (!textNamesMemorySetAndAnswer(round.parentPrompt, labels, round.answer) || !/排除|为什么|说|复述/.test(round.parentPrompt)) {
    problems.push(`${context}: memory-camera absent parentPrompt should ask for remembered cards and excluded answer`);
  }
}

function checkMemoryOrderRound(round, context, labels, ordinal) {
  const answerIndex = memoryOrdinalIndex(ordinal, labels.length);
  const expectedAnswer = labels[answerIndex];
  if (!expectedAnswer) {
    problems.push(`${context}: memory-camera order prompt should map to an existing memory item`);
    return;
  }

  if (round.answer !== expectedAnswer) {
    problems.push(`${context}: memory-camera order answer should equal the requested ordinal card`);
  }
  if (choiceValueCount(round.choices, expectedAnswer) !== 1) {
    problems.push(`${context}: memory-camera order choices should include the computed answer exactly once`);
  }
  if (!round.choices.every((choice) => labels.includes(choice.value))) {
    problems.push(`${context}: memory-camera order choices should only use remembered cards`);
  }
  if (!textNamesMemorySetAndAnswer(round.success, labels, expectedAnswer) || !round.success.includes(ordinal) || !/从左到右|顺序/.test(round.success)) {
    problems.push(`${context}: memory-camera order success should name sequence, ordinal, and answer`);
  }
  if (!textNamesMemorySetAndAnswer(round.retry, labels, expectedAnswer) || !round.retry.includes(ordinal) || !/从左到右|顺序/.test(round.retry)) {
    problems.push(`${context}: memory-camera order retry should ask the child to replay the sequence before answering`);
  }
  if (!textNamesMemorySetAndAnswer(round.parentPrompt, labels, expectedAnswer) || !round.parentPrompt.includes(ordinal) || !/说|复述|念|顺序/.test(round.parentPrompt)) {
    problems.push(`${context}: memory-camera order parentPrompt should ask for sequence, ordinal, and answer`);
  }
}

function memoryCameraLabels(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => memoryCameraLabelAliases.get(item) ?? item);
}

function choiceValueCount(choices, value) {
  return choices.filter((choice) => choice.value === value).length;
}

function textNamesMemorySetAndAnswer(text, labels, answer) {
  return Boolean(text?.includes(answer)) && allItemsMentioned(text, labels);
}

function memoryOrdinalIndex(ordinal, length) {
  return {
    第一个: 0,
    第二个: 1,
    第三个: 2,
    最后一个: length - 1,
  }[ordinal] ?? -1;
}

function checkOrderPlanRoundQuality(round, context) {
  const sequence = round.sequence;
  if (!Array.isArray(sequence) || sequence.length === 0) {
    problems.push(`${context}: order-plan round should show a sequence`);
    return;
  }

  const missingCount = sequence.filter((item) => item === "?").length;
  if (missingCount !== 1) {
    problems.push(`${context}: order-plan sequence should contain exactly one missing step`);
    return;
  }

  const answerChoices = round.choices.filter((choice) => choice.value === round.answer);
  if (answerChoices.length !== 1) {
    problems.push(`${context}: order-plan choices should include the answer exactly once`);
    return;
  }

  const answerLabel = answerChoices[0].label;
  const filledSequence = sequence.map((item) => (item === "?" ? answerLabel : orderPlanStepLabel(item)));
  if (!allItemsMentioned(round.success, filledSequence) || !round.success.includes(answerLabel) || !/顺序|缺少|所以|先|然后|再|最后/.test(round.success)) {
    problems.push(`${context}: order-plan success should name filled sequence and answer`);
  }
  if (!allItemsMentioned(round.retry, filledSequence) || !round.retry.includes(answerLabel) || !/从左到右|顺序|缺少|先|然后|再|最后/.test(round.retry)) {
    problems.push(`${context}: order-plan retry should name filled sequence, answer, and replay strategy`);
  }
  if (!allItemsMentioned(round.parentPrompt, filledSequence) || !round.parentPrompt.includes(answerLabel) || !/复述|说|指|为什么|解释/.test(round.parentPrompt)) {
    problems.push(`${context}: order-plan parentPrompt should ask for a child explanation of the filled sequence`);
  }
}

function orderPlanStepLabel(item) {
  return {
    "🧒": "小朋友",
    "🌊": "小河",
    "🌱": "小芽",
    "🌼": "花",
    "🥕": "胡萝卜",
    "🏁": "小旗",
    "🔴": "红灯",
    "🟢": "绿灯",
    "🧱倒了": "积木倒了",
  }[item] ?? item;
}

function checkAddressMapRoundQuality(round, context) {
  const grid = round.grid;
  if (!isAddressMapGrid(grid)) {
    problems.push(`${context}: address-map round should show a rectangular row-column grid`);
    return;
  }

  const addressMatch = round.prompt.match(/^([A-Z]\d+)\s*里藏着什么/);
  if (addressMatch) {
    checkAddressToObjectRound(round, context, grid, addressMatch[1]);
    return;
  }

  const targetMatch = round.prompt.match(/^(.+?)住在哪个地址/);
  if (targetMatch) {
    checkObjectToAddressRound(round, context, grid, targetMatch[1]);
    return;
  }

  problems.push(`${context}: address-map prompt should ask for an object at an address or an address for an object`);
}

function checkAddressToObjectRound(round, context, grid, address) {
  const cell = cellAtAddress(grid, address);
  if (!cell) {
    problems.push(`${context}: address-map address prompt should use an address present in the grid`);
    return;
  }

  const { row, column } = addressParts(address);
  if (round.answer !== cell) {
    problems.push(`${context}: address-map address answer should equal the grid cell at the address`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === cell);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: address-map address choices should include the grid cell exactly once`);
  }

  if (!round.success.includes(address) || !round.success.includes(cell) || !mentionsRowColumn(round.success, row, column)) {
    problems.push(`${context}: address-map address success should name address, row, column, and hidden object`);
  }
  if (!mentionsRowColumn(round.retry, row, column) || !/先/.test(round.retry) || !/再/.test(round.retry)) {
    problems.push(`${context}: address-map address retry should ask for row first, then column`);
  }
  if (!mentionsRowColumn(round.parentPrompt, row, column) || !round.parentPrompt.includes(cell) || !/指|点/.test(round.parentPrompt) || !/交叉|格子/.test(round.parentPrompt)) {
    problems.push(`${context}: address-map address parentPrompt should ask the child to point to the row-column intersection`);
  }
}

function checkObjectToAddressRound(round, context, grid, target) {
  const positions = findGridPositions(grid.cells, target);
  if (positions.length !== 1) {
    problems.push(`${context}: address-map target prompt should name one visible grid item`);
    return;
  }

  const [rowIndex, columnIndex] = positions[0];
  const row = grid.rows[rowIndex];
  const column = grid.columns[columnIndex];
  const address = `${row}${column}`;

  if (round.answer !== address) {
    problems.push(`${context}: address-map target answer should equal the target row-column address`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === address);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: address-map target choices should include the computed address exactly once`);
  }

  if (!round.success.includes(target) || !round.success.includes(address) || !mentionsRowColumn(round.success, row, column)) {
    problems.push(`${context}: address-map target success should name target, row, column, and address`);
  }
  if (!round.retry.includes(target) || !/行/.test(round.retry) || !/列/.test(round.retry) || !/字母/.test(round.retry) || !/数字/.test(round.retry)) {
    problems.push(`${context}: address-map target retry should ask for the item, then row and column`);
  }
  if (!round.parentPrompt.includes(target) || !round.parentPrompt.includes(address) || !mentionsRowColumn(round.parentPrompt, row, column)) {
    problems.push(`${context}: address-map target parentPrompt should ask the child to explain row letter and column number`);
  }
}

function isAddressMapGrid(grid) {
  if (!grid || !Array.isArray(grid.rows) || !Array.isArray(grid.columns) || !Array.isArray(grid.cells)) return false;
  if (!grid.rows.length || !grid.columns.length || grid.cells.length !== grid.rows.length) return false;
  if (!grid.rows.every(isNonBlankString) || !grid.columns.every(isNonBlankString)) return false;
  return grid.cells.every((row) => Array.isArray(row) && row.length === grid.columns.length && row.every(isNonBlankString)) && hasRectangularRows(grid.cells);
}

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function addressParts(address) {
  const match = address.match(/^([A-Z])(\d+)$/);
  return {
    row: match?.[1] ?? "",
    column: match?.[2] ?? "",
  };
}

function cellAtAddress(grid, address) {
  const { row, column } = addressParts(address);
  const rowIndex = grid.rows.indexOf(row);
  const columnIndex = grid.columns.indexOf(column);
  if (rowIndex === -1 || columnIndex === -1) return null;
  return grid.cells[rowIndex]?.[columnIndex] ?? null;
}

function mentionsRowColumn(text, row, column) {
  return new RegExp(`${escapeRegex(row)}\\s*行`).test(text) && new RegExp(`${escapeRegex(column)}\\s*列`).test(text);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkMatrixPuzzleRoundQuality(round, context) {
  if (round.sceneImage) {
    problems.push(`${context}: matrix puzzle should use the matrix as its only evidence surface`);
  }

  const cells = round.matrix?.cells;
  if (!isMatrixPuzzleGrid(cells)) {
    problems.push(`${context}: matrix puzzle should show a matrix with one missing cell`);
    return;
  }

  const rule = deriveMatrixPuzzleRule(cells);
  if (!rule) {
    problems.push(`${context}: matrix puzzle should use a recognized visible row rule`);
    return;
  }

  if (round.answer !== rule.answer) {
    problems.push(`${context}: matrix puzzle answer should equal the derived missing cell`);
  }

  const matchingChoices = round.choices.filter((choice) => choice.value === rule.answer);
  if (matchingChoices.length !== 1) {
    problems.push(`${context}: matrix puzzle choices should include the derived answer exactly once`);
  }

  if (!matrixPuzzleSuccessNamesRows(round.success, rule)) {
    problems.push(`${context}: matrix puzzle success should name an example row, missing row, and answer`);
  }
  if (!/第一行|完整行|前两行|例子/.test(round.retry) || !/第三行|缺|空格|待补/.test(round.retry)) {
    problems.push(`${context}: matrix puzzle retry should ask for a complete example row before the missing row`);
  }
  if (!/第一行|完整行|例子/.test(round.parentPrompt) || !/第三行|缺|空格|待补/.test(round.parentPrompt) || !/规则|为什么|怎么/.test(round.parentPrompt)) {
    problems.push(`${context}: matrix puzzle parentPrompt should ask the child to explain the same rule across rows`);
  }
}

function isMatrixPuzzleGrid(cells) {
  if (!Array.isArray(cells) || cells.length < 3 || !hasRectangularRows(cells)) return false;
  if (!cells.every((row) => row.length === 3 && row.every(isNonBlankString))) return false;
  return cells.flat().filter((cell) => cell === "?").length === 1;
}

function deriveMatrixPuzzleRule(cells) {
  const missingRowIndex = cells.findIndex((row) => row.includes("?"));
  const missingColumnIndex = cells[missingRowIndex]?.indexOf("?") ?? -1;
  if (missingRowIndex === -1 || missingColumnIndex !== 2) return null;

  const completeRows = cells.filter((row) => !row.includes("?"));
  const missingRow = cells[missingRowIndex];
  if (completeRows.length < 2) return null;

  const countRule = deriveCountQuantityRule(completeRows, missingRow);
  if (countRule) return countRule;

  const combineRule = deriveRowCombineRule(completeRows, missingRow);
  if (combineRule) return combineRule;

  const repeatRule = deriveFirstSecondFirstRule(completeRows, missingRow);
  if (repeatRule) return repeatRule;

  const oneOfEachRule = deriveOneOfEachRule(completeRows, missingRow);
  if (oneOfEachRule) return oneOfEachRule;

  return null;
}

function deriveRowCombineRule(completeRows, missingRow) {
  if (!completeRows.every((row) => row[2] === `${row[0]}${row[1]}`)) return null;
  return matrixRuleResult("combine", `${missingRow[0]}${missingRow[1]}`, completeRows[0], missingRow);
}

function deriveFirstSecondFirstRule(completeRows, missingRow) {
  if (!completeRows.every((row) => row[2] === row[0] && row[0] !== row[1])) return null;
  return matrixRuleResult("first-second-first", missingRow[0], completeRows[0], missingRow);
}

function deriveCountQuantityRule(completeRows, missingRow) {
  if (!completeRows.every((row) => isNumericText(row[1]) && row[2] === row[0].repeat(Number(row[1])))) return null;
  if (!isNumericText(missingRow[1])) return null;
  return matrixRuleResult("count-quantity", missingRow[0].repeat(Number(missingRow[1])), completeRows[0], missingRow);
}

function deriveOneOfEachRule(completeRows, missingRow) {
  const ruleSet = sortedRowSignature(completeRows[0]);
  if (!completeRows.every((row) => new Set(row).size === row.length && sortedRowSignature(row) === ruleSet)) return null;
  const candidates = completeRows[0].filter((item) => !missingRow.includes(item));
  if (candidates.length !== 1) return null;
  return matrixRuleResult("one-of-each", candidates[0], completeRows[0], missingRow);
}

function matrixRuleResult(type, answer, exampleRow, missingRow) {
  return {
    type,
    answer,
    exampleRow,
    missingRow: [...missingRow.slice(0, 2), answer],
    missingKnownItems: missingRow.filter((cell) => cell !== "?"),
  };
}

function sortedRowSignature(row) {
  return [...row].sort().join("\u0000");
}

function matrixPuzzleSuccessNamesRows(text, rule) {
  return (
    text.includes(rule.answer) &&
    allItemsMentioned(text, rule.exampleRow) &&
    allItemsMentioned(text, rule.missingKnownItems) &&
    /第一行|完整行|例子/.test(text) &&
    /第三行|缺|空格|待补|所以补/.test(text)
  );
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
