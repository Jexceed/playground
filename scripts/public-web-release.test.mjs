import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/public-web-beta.yml", "utf8");
const viteConfig = readFileSync("vite.config.ts", "utf8");
const indexHtml = readFileSync("index.html", "utf8");
const appSource = readFileSync("src/App.tsx", "utf8");
const sceneSource = readFileSync("src/games/ProgressiveSetGame.tsx", "utf8");
const tokenSource = readFileSync("src/components/VisualToken.tsx", "utf8");
const speechSource = readFileSync("src/speech.ts", "utf8");
const privacyHtml = readFileSync("public/privacy.html", "utf8");

test("Vite keeps root builds by default and accepts a hosted base path", () => {
  assert.match(viteConfig, /base:\s*process\.env\.VITE_BASE_PATH\s*\?\?\s*["']\/["']/);
  assert.match(workflow, /VITE_BASE_PATH:\s*\/playground\//);
});

test("browser-facing static resources resolve through the public base path", () => {
  assert.match(indexHtml, /%BASE_URL%images\/brand\/thinking-house-brand-v3\.png/);
  assert.match(appSource, /publicAsset\(brandLogoSrc\)/);
  assert.match(appSource, /new Audio\(publicAsset\(launchBrandAudioSrc\)\)/);
  assert.match(sceneSource, /publicAsset\(round\.sceneImage\.src\)/);
  assert.match(tokenSource, /publicAsset\(raster\.src\)/);
  assert.match(speechSource, /fetch\(publicAsset\("\/audio\/voice\/manifest\.json"\)/);
  assert.match(speechSource, /new Audio\(publicAsset\(src\)\)/);
});

test("GitHub Pages deploys only after product quality gates", () => {
  assert.match(workflow, /pnpm install --frozen-lockfile/);
  assert.match(workflow, /pnpm test:web-release/);
  assert.match(workflow, /pnpm build/);
  assert.match(workflow, /pnpm audit:curriculum/);
  assert.match(workflow, /pnpm audit:voice-media/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});

test("the hosted beta publishes a plain-language child privacy boundary", () => {
  assert.match(privacyHtml, /无需注册/);
  assert.match(privacyHtml, /不投放广告/);
  assert.match(privacyHtml, /不会把孩子的答题记录上传/);
  assert.match(privacyHtml, /浏览器的本地存储/);
  assert.match(privacyHtml, /GitHub Pages/);
});

