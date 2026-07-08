import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const imageGallerySource = readFileSync("src/data/imageGallery.ts", "utf8");
const imageGalleryOutput = ts.transpileModule(imageGallerySource, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
}).outputText;
const imageGalleryModuleUrl = `data:text/javascript;base64,${Buffer.from(imageGalleryOutput).toString("base64")}`;
const { imageGallery } = await import(imageGalleryModuleUrl);

const source = readFileSync("src/data/games.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
}).outputText.replace('import { imageGallery } from "./imageGallery";', `const imageGallery = ${JSON.stringify(imageGallery)};`);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(output.replace("../types", "data:text/javascript,export{}")).toString("base64")}`;
const { games } = await import(moduleUrl);

const tokenLabels = {
  "🍓": "草莓",
  "🍪": "饼干",
  "⭐": "星星",
  "🟡": "黄色圆片",
  "🟢": "绿色圆片",
  "🔵": "蓝色圆片",
  "🔴": "红色圆片",
  "🟣": "紫色圆片",
  "⬜": "空位",
  "🟦": "蓝色方块",
  "🍎": "苹果",
  "🧁": "纸杯蛋糕",
  "🍊": "橘子",
  "🧱": "积木",
  "🐦": "小鸟",
  "🐟": "小鱼",
  "🐱": "小猫",
  "😺": "小橘猫",
  "⚽": "足球",
  "✏": "铅笔",
  "✏️": "铅笔",
  "🍽️": "盘子",
  "🍬": "糖果",
  "🧒": "小朋友",
  "👧": "小女孩",
  "👦": "小男孩",
  "☀️": "太阳",
  "🌙": "月亮",
  "🥤": "杯子",
  "💧": "水",
  "🎁": "魔法盒",
  "➡️": "箭头",
  "🐰": "小兔",
  "🥕": "胡萝卜",
  "🐶": "小狗",
  "🌱": "发芽",
  "🌼": "花",
  "🏃": "跑步",
  "🐻": "小熊",
  "🍯": "蜂蜜",
  "🌊": "小河",
  "🏁": "终点",
  "?": "待补位置",
  "|": "竖中线",
  "-": "横中线",
  "⬤": "大圆",
  "●": "中圆",
  "•": "小圆",
  "苹果": "苹果",
  "橘子": "橘子",
  "草莓": "草莓",
  "葡萄": "葡萄",
  "饼干": "饼干",
  "糖果": "糖果",
  "蛋糕": "蛋糕",
  "杯子": "杯子",
  "盒子": "盒子",
  "小汽车": "小汽车",
  "公交车": "公交车",
  "自行车": "自行车",
  "飞机": "飞机",
  "风筝": "风筝",
  "铅笔": "铅笔",
  "书包": "书包",
  "尺子": "尺子",
  "三角尺": "三角尺",
  "书本": "书本",
  "足球": "足球",
  "积木塔": "积木塔",
  "大圆": "大圆",
  "中圆": "中圆",
  "小圆": "小圆",
  "大星": "大星",
  "小星": "小星",
  "大方块": "大方块",
  "小方块": "小方块",
  "天空": "天空",
  "家": "家",
  "起点": "起点",
  "终点": "终点",
  "小河": "小河",
  "口渴": "口渴",
  "小鱼在岸上": "小鱼在岸上",
  "小岛": "小岛",
  "小鸟天空": "小鸟和天空",
  "小鱼小河": "小鱼和小河",
  "小狗家": "小狗和家",
  "小河小狗": "小河和小狗",
  "天空家": "天空和家",
  "左边": "左边",
  "右边": "右边",
  "上面": "上面",
  "下面": "下面",
  "拿盘子": "拿盘子",
  "拿饼干": "拿饼干",
  "放进盒子": "放进盒子",
};

const lines = new Map();

function add(kind, text, context) {
  if (!text) return;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return;
  const key = `${kind}:${clean}`;
  if (!lines.has(key)) {
    lines.set(key, {
      id: slug(`${kind}-${clean}`).slice(0, 80),
      kind,
      text: clean,
      tone: kind === "success" ? "warm, delighted, clear" : kind === "retry" ? "gentle, encouraging, slow" : "friendly, clear, playful",
      contexts: [],
    });
  }
  lines.get(key).contexts.push(context);
}

for (const game of games) {
  add("game-title", game.title, game.id);
  add("game-goal", game.goal, game.id);
  for (const round of game.rounds) {
    const context = `${game.id}/${round.id}`;
    add("prompt", joinVoiceLine(round.prompt, round.instruction), context);
    add("success", round.success, context);
    add("retry", round.retry, context);
    add("parent", round.parentPrompt, context);
    for (const choice of round.choices) add("choice", labelForObject(choice.label), context);
    for (const option of round.graphicChallenge?.options ?? []) {
      add("choice", option.label, context);
    }
    const visualItems = [
      ...(round.sequence ?? []),
      ...(round.visualGroups ?? []).flatMap((group) => group.items),
      ...(round.grid?.cells ?? []).flat(),
      ...(round.matrix?.cells ?? []).flat(),
      ...(round.memory?.items ?? []),
    ];
    for (const item of visualItems) {
      add("object", labelForObject(item), context);
    }
  }
}

add("system", "完成啦。我们再想一想，为什么会这样？", "game-complete");

const data = {
  generatedAt: new Date().toISOString(),
  recommendedVoice: "warm adult female Mandarin, smiling, preschool teacher, 0.85 speed, crisp consonants",
  lineCount: lines.size,
  lines: Array.from(lines.values()),
};

mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/voice-lines.json", JSON.stringify(data, null, 2));
console.log(`Exported ${data.lineCount} unique voice lines to public/audio/voice-lines.json`);

function slug(input) {
  return input
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function joinVoiceLine(prompt, instruction) {
  const trimmed = prompt.trim();
  const separator = /[。？！]$/.test(trimmed) ? "" : "。";
  return `${trimmed}${separator}${instruction}`;
}

function labelForObject(item) {
  if (tokenLabels[item]) return tokenLabels[item];
  const parts = visualParts(item);
  if (parts.length > 1 && parts.every((part) => tokenLabels[part])) {
    return parts.map((part) => tokenLabels[part]).join("、");
  }
  return item;
}

function visualParts(value) {
  return Array.from(value).filter((part) => part !== "\uFE0F");
}
