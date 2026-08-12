import { readFile } from "node:fs/promises";

const viewports = [
  { width: 667, height: 375 },
  { width: 844, height: 390 },
  { width: 932, height: 430 },
];
const factory = await readFile("doyingame/assets/scripts/ui/UiFactory.ts", "utf8");
const game = await readFile("doyingame/assets/scripts/ui/GameView.ts", "utf8");
const app = await readFile("doyingame/assets/scripts/AppController.ts", "utf8");
const progress = await readFile("doyingame/assets/scripts/models/Progress.ts", "utf8");
const scene = await readFile("doyingame/assets/scenes/Main.scene", "utf8");
const project = JSON.parse(await readFile("doyingame/settings/v2/packages/project.json", "utf8"));
const builder = JSON.parse(await readFile("doyingame/profiles/v2/packages/builder.json", "utf8"));
const problems = [];

if (!factory.includes("paperBackground")) problems.push("missing local-app-style paper background");
if (!factory.includes("outlinedPanel")) problems.push("missing outlined card primitive");
if (!factory.includes("TOUCH_END")) problems.push("buttons do not register touch end");
if (!factory.includes("node.layer = parent.layer")) problems.push("runtime UI nodes do not inherit the UI_2D layer");
for (const section of ["WorldNavigation", "GameStage", "SidePanel", "RoundNavigator", "ParentPrompt", "GrowthRecord"]) {
  if (!game.includes(section)) problems.push(`missing landscape workbench section ${section}`);
}
if (!game.includes("actions.jump(index)")) problems.push("round navigator does not jump to selected round");
if (!game.includes("actions.openGame(game)")) problems.push("game picker does not switch game in place");
if (app.includes("new HomeView")) problems.push("startup still routes through the portrait home view");
if (!app.includes("openInitialGame")) problems.push("startup does not restore directly into a playable round");
if (progress.includes("return [...new Set(values)]")) problems.push("progress deduplication uses Set spread, which Cocos transpiles incorrectly for ByteDance");
for (const inset of ["safeTop", "safeRight", "safeBottom", "safeLeft"]) {
  if (!app.includes(inset)) problems.push(`safe-area layout does not use ${inset}`);
}
if (builder["bytedance-mini-game"]?.orientation !== "landscape") problems.push("builder is not landscape");
const resolution = project.general?.designResolution;
if (resolution?.width !== 1280 || resolution?.height !== 720) problems.push("design resolution is not 1280x720");

const parsedScene = JSON.parse(scene);
const appRoot = parsedScene.find((entry) => entry?.__type__ === "cc.Node" && entry?._name === "AppRoot");
if (!appRoot) problems.push("Main.scene does not contain AppRoot");
const widget = appRoot?._components
  ?.map((reference) => parsedScene[reference.__id__])
  .find((component) => component?.__type__ === "cc.Widget");
if (widget?._enabled !== false) problems.push("AppRoot Widget must stay disabled so safe-area sizing is not overwritten");
for (const viewport of viewports) {
  if (viewport.width <= viewport.height) problems.push(`viewport is not landscape ${JSON.stringify(viewport)}`);
  if (viewport.width < 667 || viewport.height < 375) problems.push(`unsupported viewport ${JSON.stringify(viewport)}`);
}

console.log(JSON.stringify({ viewports, orientation: "landscape", designResolution: resolution, staticChecks: problems.length ? "FAIL" : "PASS", problems }, null, 2));
if (problems.length) process.exitCode = 1;
