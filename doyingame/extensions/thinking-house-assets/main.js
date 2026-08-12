"use strict";

const { execFileSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const { dirname, join } = require("node:path");

exports.load = async function load() {
  const marker = process.env.THINKING_HOUSE_COCOS_REFRESH_MARKER;
  if (!marker) return;
  try {
    const project = Editor.Project.path;
    const workspace = dirname(project);
    const node = process.env.THINKING_HOUSE_NODE_EXECUTABLE;
    const configPath = process.env.THINKING_HOUSE_COCOS_BUILD_CONFIG;
    if (!node || !configPath) throw new Error("Cocos build environment is incomplete");

    // Queue a refresh while asset-db is still installing its importers. Creator
    // 3.8.8 otherwise performs its first project scan before those importers exist.
    execFileSync(node, [join(workspace, "scripts/generate-cocos-metadata.mjs")], {
      cwd: workspace,
      stdio: "inherit",
    });
    await Editor.Message.request("asset-db", "refresh-asset", "db://assets");
    await delay(8_000);

    let lastError;
    const samples = [
      ["db://assets/scenes/Main.scene", "scene"],
      ["db://assets/scripts/AppController.ts", "typescript"],
      ["db://assets/resources/math-island/data/catalog.json", "json"],
      ["db://assets/resources/math-island/images/brand/thinking-house-brand-v3.png", "image"],
      ["db://assets/resources/math-island/audio/zh-CN/edge-zh-cn-xiaoxiaoneural/prompt-请数一数-一共有几个苹果-用手指点着数-再选答案.mp3", "audio-clip"],
    ];
    for (let attempt = 1; attempt <= 30; attempt += 1) {
      try {
        execFileSync(node, [join(workspace, "scripts/generate-cocos-metadata.mjs")], {
          cwd: workspace,
          stdio: "inherit",
        });
        await Editor.Message.request("asset-db", "refresh-asset", "db://assets");
        await Editor.Message.request("asset-db", "reimport-asset", "db://assets");
        const imported = [];
        for (const [url, importer] of samples) {
          const info = await Editor.Message.request("asset-db", "query-asset-info", url);
          imported.push(info?.importer === importer && info.imported && !info.invalid);
        }
        const scenes = await Editor.Message.request("asset-db", "query-assets", { ccType: "cc.SceneAsset" });
        imported.push(Array.isArray(scenes) && scenes.some((scene) => scene.uuid === "f361a3c9-906d-4fdf-b84a-b5d076e8b812"));
        if (!imported.every(Boolean)) throw new Error("Cocos asset importers are not ready yet");
        console.log(`[thinking-house-assets] resource refresh completed on attempt ${attempt}`);
        const result = await Editor.Message.request("builder", "command-build", { configPath });
        writeFileSync(marker, `${JSON.stringify({ ok: true, builtAt: new Date().toISOString(), attempt, result })}\n`);
        console.log("[thinking-house-assets] Douyin build completed");
        return;
      } catch (error) {
        lastError = error;
        await delay(1_000);
      }
    }
    throw lastError || new Error("Unable to refresh and build Cocos assets");
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    writeFileSync(marker, `${JSON.stringify({ ok: false, error: message })}\n`);
    console.error(`[thinking-house-assets] ${message}`);
  }
};

exports.unload = function unload() {};

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
