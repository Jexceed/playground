import { access, mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";

import { ensureCocosMetadata } from "./lib/cocos-metadata.mjs";

const candidates = [
  process.env.THINKING_HOUSE_COCOS_EXECUTABLE,
  "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator",
  "/Applications/CocosCreator/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator",
  "/Applications/CocosCreator.app/Contents/MacOS/CocosCreator",
  join(homedir(), "Library/Caches/ThinkingHouseTools/CocosCreator-3.8.8.app/Contents/MacOS/CocosCreator"),
].filter(Boolean);
let executable = null;
for (const candidate of candidates) {
  try { await access(candidate); executable = candidate; break; } catch { /* continue */ }
}
if (!executable) {
  console.error("Cocos Creator 3.8 LTS is not available. Install it or set THINKING_HOUSE_COCOS_EXECUTABLE, then rerun pnpm build:douyin-minigame.");
  process.exit(2);
}
const project = resolve("doyingame");
const configPath = resolve("doyingame/build-configs/bytedance-mini-game.json");
const output = resolve("doyingame/build/bytedance-mini-game");
await rm(resolve("doyingame/library"), { recursive: true, force: true });
await rm(resolve("doyingame/temp"), { recursive: true, force: true });
await ensureCocosMetadata();
await rm(output, { recursive: true, force: true });
await buildInPreparedEditor(executable, project, configPath);
try {
  const report = await verifyBuild(output);
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(`Douyin build verification failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

async function verifyBuild(outputDirectory) {
  const files = await listFiles(outputDirectory);
  const bytes = (await Promise.all(files.map(async (path) => (await stat(path)).size))).reduce((sum, size) => sum + size, 0);
  const appConfig = JSON.parse(await readFile(join(outputDirectory, "project.config.json"), "utf8"));
  const settings = JSON.parse(await readFile(join(outputDirectory, "src/settings.json"), "utf8"));
  const gameBootstrap = await readFile(join(outputDirectory, "game.js"), "utf8");
  const counts = files.reduce((value, path) => {
    const extension = extname(path).toLowerCase();
    value[extension] = (value[extension] ?? 0) + 1;
    return value;
  }, {});
  if (appConfig.appid !== "tta51dd3a03b67523202") throw new Error(`unexpected AppID ${String(appConfig.appid)}`);
  if (settings.launch?.launchScene !== "db://assets/scenes/Main.scene") throw new Error("Main.scene is not the launch scene");
  if (!gameBootstrap.includes("tt.onShow")) throw new Error("early tt.onShow registration is missing");
  if ((counts[".mp3"] ?? 0) < 300) throw new Error(`only ${counts[".mp3"] ?? 0} voice files were packaged`);
  if ((counts[".png"] ?? 0) < 15) throw new Error(`only ${counts[".png"] ?? 0} images were packaged`);
  if (bytes < 12 * 1024 * 1024) throw new Error(`package is suspiciously small (${formatMB(bytes)} MB)`);
  if (bytes > 16 * 1024 * 1024) throw new Error(`package exceeds the current 16 MB non-subpackage limit (${formatMB(bytes)} MB)`);
  return {
    output: outputDirectory,
    appid: appConfig.appid,
    launchScene: settings.launch.launchScene,
    files: files.length,
    voiceFiles: counts[".mp3"] ?? 0,
    imageFiles: counts[".png"] ?? 0,
    packageMB: Number(formatMB(bytes)),
    verified: true,
  };
}

async function listFiles(root) {
  const output = [];
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else output.push(path);
    }
  };
  await visit(root);
  return output;
}

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

async function buildInPreparedEditor(cocosExecutable, projectPath, buildConfigPath) {
  const directory = await mkdtemp(join(tmpdir(), "thinking-house-cocos-refresh-"));
  const marker = join(directory, "ready.json");
  const child = spawn(cocosExecutable, ["--project", projectPath], {
    env: {
      ...process.env,
      THINKING_HOUSE_COCOS_REFRESH_MARKER: marker,
      THINKING_HOUSE_NODE_EXECUTABLE: process.execPath,
      THINKING_HOUSE_COCOS_BUILD_CONFIG: buildConfigPath,
    },
    stdio: "ignore",
  });
  try {
    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      if (await exists(marker)) {
        const result = JSON.parse(await readFile(marker, "utf8"));
        if (!result.ok) throw new Error(result.error || "Cocos editor build failed");
        const health = await inspectImportedAssets();
        if (!health.ok) throw new Error(`Cocos asset refresh incomplete: ${health.reason}`);
        return;
      }
      if (child.exitCode !== null) throw new Error(`Cocos refresh process exited with code ${child.exitCode}`);
      await delay(500);
    }
    throw new Error("Cocos editor build timed out after 120 seconds");
  } finally {
    child.kill("SIGTERM");
    await Promise.race([new Promise((resolveExit) => child.once("exit", resolveExit)), delay(5_000)]);
    await rm(directory, { recursive: true, force: true });
  }
}

async function inspectImportedAssets() {
  const samples = [
    ["doyingame/assets/scenes/Main.scene.meta", "scene"],
    ["doyingame/assets/scripts/AppController.ts.meta", "typescript"],
    ["doyingame/assets/resources/math-island/data/catalog.json.meta", "json"],
    ["doyingame/assets/resources/math-island/images/brand/thinking-house-brand-v3.png.meta", "image"],
    ["doyingame/assets/resources/math-island/audio/zh-CN/edge-zh-cn-xiaoxiaoneural/prompt-请数一数-一共有几个苹果-用手指点着数-再选答案.mp3.meta", "audio-clip"],
  ];
  for (const [path, importer] of samples) {
    const meta = JSON.parse(await readFile(path, "utf8"));
    if (meta.importer !== importer) return { ok: false, reason: `${path} uses ${String(meta.importer)}` };
  }
  return { ok: true };
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}
