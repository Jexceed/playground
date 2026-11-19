import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, test } from "node:test";
import { createServer } from "vite";

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

const mainRs = read("src-tauri/src/main.rs");
const tauriConf = JSON.parse(read("src-tauri/tauri.conf.json"));
const indexHtml = read("index.html");
const appSource = read("src/App.tsx");
const stylesSource = read("src/styles.css");
const progressiveSource = read("src/games/ProgressiveSetGame.tsx");
const activityGameSource = read("src/games/ActivitySetGame.tsx");

const server = await createServer({
  configFile: false,
  appType: "custom",
  server: { middlewareMode: true, watch: null, ws: false },
  esbuild: { jsx: "automatic" },
  optimizeDeps: { noDiscovery: true },
  logLevel: "error",
});
after(() => server.close());

const [{ evidenceCaption }, { filterWorldGames }, { activityHeadingLabel }, { getCurriculumSection }] = await Promise.all([
  server.ssrLoadModule("/src/interactions/ActivityEvidence.tsx"),
  server.ssrLoadModule("/src/services/curriculum-navigation.ts"),
  server.ssrLoadModule("/src/domain/activity.ts"),
  server.ssrLoadModule("/src/curriculum/catalog.ts"),
]);

test("macOS desktop entry maximizes the main window on startup without entering fullscreen", () => {
  assert.match(mainRs, /#\[cfg\(target_os = "macos"\)\][\s\S]*use tauri::Manager;/);
  assert.match(mainRs, /\.setup\(\|app\|[\s\S]*#\[cfg\(target_os = "macos"\)\][\s\S]*app\.get_webview_window\("main"\)[\s\S]*window\.maximize\(\)\?/);
  assert.doesNotMatch(mainRs, /set_fullscreen\s*\(\s*true\s*\)/);

  const [mainWindow] = tauriConf.app.windows;
  assert.equal(mainWindow.acceptFirstMouse, true);
  assert.equal(mainWindow.fullscreen ?? false, false);
  assert.equal(mainWindow.width, 1280);
  assert.equal(mainWindow.height, 820);
});

test("entry metadata, splash, sidebar and right support panels use fitting parent-child copy", () => {
  assert.match(indexHtml, /面向幼儿与小学低年级家庭的亲子思维游戏/);
  assert.doesNotMatch(indexHtml, /为 4 岁孩子和家长设计/);

  assert.match(appSource, /一起看图、动手，说说为什么/);
  assert.doesNotMatch(appSource, /正在打开今天的小小问题/);

  assert.match(appSource, /aria-label="题组列表"/);
  assert.match(appSource, /当前主题没有匹配的题组，换个词或切到别的主题试试/);
  assert.match(appSource, /清空搜索/);
  assert.doesNotMatch(appSource, /这个世界的关卡正在制作|关卡列表|选择关卡/);

  assert.match(appSource, /本组共玩建议/);
  assert.match(appSource, /本题追问建议/);
  assert.match(appSource, /本机练习足迹/);
  assert.doesNotMatch(appSource, /亲子提示卡|尚待真实亲子试玩校准/);

  assert.match(stylesSource, /\.world-button\.expanded small\s*\{[\s\S]*white-space: normal;/);
  assert.doesNotMatch(stylesSource, /\.world-button\.expanded small\s*\{[^}]*text-overflow:\s*ellipsis/);
});

test("enlightenment and exploration stage headers and evidence captions match actual task surfaces", () => {
  assert.match(progressiveSource, /\{game\.title\} · 第 \{roundIndex \+ 1\} \/ \{game\.rounds\.length\} 题/);
  assert.match(progressiveSource, /这题练什么：\$\{difficultyText\(round\)\}/);
  assert.match(progressiveSource, /回第 1 题/);
  assert.match(progressiveSource, /完成本组/);
  assert.match(progressiveSource, /<span>生活场景<\/span>/);
  assert.doesNotMatch(progressiveSource, /难度判定：|完成关卡/);

  assert.match(activityGameSource, /补做未完成题/);
  assert.match(activityGameSource, /保存这次观察/);
  assert.match(activityGameSource, /亲子共玩观察/);
  assert.doesNotMatch(activityGameSource, /请重新打开这个关卡/);

  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "rectangleSearch", rows: 2, columns: 2 } } }), "在网格里找长方形");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "calendar" } } }), "看日历，找日期");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "collection", count: 6, caption: "" } } }), "看图数一数");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "shopping", cost: 3, paid: 5 } } }), "看价格，算找零");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "moneyExchange", from: 5, denomination: 1 } } }), "看面额，想怎么换");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "sharingModel", mode: "share", total: 6, people: 2 } } }), "看图分一分、数一数");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "visualComparison", panels: [] } } }), "对照两组线索");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "waterModel", smallCups: 4 } } }), "看看发生了什么");
  assert.equal(evidenceCaption({ presentation: { folding: { folds: ["right"], holeRow: 0, holeColumn: 0 } } }), "看折纸步骤，想展开后的样子");
  assert.equal(evidenceCaption({ presentation: { evidence: { kind: "overlapQueue", left: 4, right: 3, wording: "positions" } } }), "一起排队数一数");
});


test("search finds the displayed play labels as well as names within the current theme", () => {
  const games = getCurriculumSection("exploration").games;
  const english = games.filter(game => game.interactionLabel === "看图与对话");
  assert.equal(english.length, 3);
  for (const game of english) {
    assert.deepEqual(game.rounds.map(round => activityHeadingLabel(game, round)), [
      "看图选句", "亲子对话", "看图选句", "亲子对话",
    ]);
  }
  for (const term of [" 看图选句 ", "亲子对话", "英语日常说"]) {
    assert.deepEqual(filterWorldGames(games, "language", term), english);
    assert.deepEqual(filterWorldGames(games, "math", term), []);
  }
  assert.deepEqual(filterWorldGames(games, "language", "见面与告别"), [english[0]]);
  assert.deepEqual(filterWorldGames(games, "language", "  "), games.filter(game => game.world === "language"));
  assert.deepEqual(filterWorldGames(games, "language", "没有这个题组"), []);
});
