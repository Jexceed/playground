import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const path = "doyingame/build-templates/bytedance-mini-game/game.ejs";

test("Douyin build template preserves the Cocos 3.8.8 boot contract", async () => {
  const source = await readFile(path, "utf8");
  for (const placeholder of [
    "isUsePhysX",
    "appid",
    "polyfillsBundleFile",
    "systemJsBundleFile",
    "importMapFile",
    "applicationJs",
  ]) {
    assert.match(source, new RegExp(`\\b${placeholder}\\b`), `missing ${placeholder}`);
  }
  assert.match(source, /require\(['"]\.\/web-adapter['"]\)/);
  assert.match(source, /System\.warmup\(/);
  assert.match(source, /application\.init\(cc\)/);
  assert.match(source, /application\.start\(\)/);
  assert.doesNotMatch(source, /<%=\s*boot\s*%>/);
});

test("sidebar lifecycle is registered before the Cocos boot starts", async () => {
  const source = await readFile(path, "utf8");
  const onShow = source.indexOf("tt.onShow");
  const firstLoad = source.indexOf("loadCC();");
  assert.ok(onShow >= 0, "missing early tt.onShow");
  assert.ok(firstLoad > onShow, "tt.onShow must run before loadCC");
  assert.match(source, /__THINKING_HOUSE_LATEST_SHOW__/);
  assert.match(source, /__THINKING_HOUSE_SHOW_LISTENERS__/);
});
