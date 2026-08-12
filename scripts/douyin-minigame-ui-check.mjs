import { readFile } from "node:fs/promises";

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];
const source = await readFile("doyingame/assets/scripts/ui/UiFactory.ts", "utf8");
const game = await readFile("doyingame/assets/scripts/ui/GameView.ts", "utf8");
const app = await readFile("doyingame/assets/scripts/AppController.ts", "utf8");
const scene = await readFile("doyingame/assets/scenes/Main.scene", "utf8");
const problems = [];
if (!source.includes("ScrollView")) problems.push("missing vertical ScrollView");
if (!source.includes("TOUCH_END")) problems.push("buttons do not register touch end");
if (!source.includes("node.layer = parent.layer")) problems.push("runtime UI nodes do not inherit the UI_2D layer");
if (!game.includes("this.width -")) problems.push("game view is not width-relative");
for (const inset of ["safeTop", "safeRight", "safeBottom", "safeLeft"]) {
  if (!app.includes(inset)) problems.push(`safe-area layout does not use ${inset}`);
}
const parsedScene = JSON.parse(scene);
const appRoot = parsedScene.find((entry) => entry?.__type__ === "cc.Node" && entry?._name === "AppRoot");
if (!appRoot) problems.push("Main.scene does not contain AppRoot");
const widget = appRoot?._components
  ?.map((reference) => parsedScene[reference.__id__])
  .find((component) => component?.__type__ === "cc.Widget");
if (widget?._enabled !== false) problems.push("AppRoot Widget must stay disabled so safe-area sizing is not overwritten");
for (const viewport of viewports) if (viewport.width < 320 || viewport.height < 640) problems.push(`unsupported viewport ${JSON.stringify(viewport)}`);
console.log(JSON.stringify({ viewports, staticChecks: problems.length ? "FAIL" : "PASS", problems }, null, 2));
if (problems.length) process.exitCode = 1;
