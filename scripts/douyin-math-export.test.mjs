import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildMathIslandExport, EXPECTED_GAME_IDS, EXPECTED_ROUND_COUNT, readGeneratedCatalog } from "./lib/douyin-math-export.mjs";
import { loadGameData } from "./lib/load-game-data.mjs";

test("generated catalog preserves the complete Math Island source", async () => {
  const generated = await readGeneratedCatalog();
  const { games } = await loadGameData();
  const source = games.filter((game) => game.world === "math");

  assert.deepEqual(generated.games.map((game) => game.id), EXPECTED_GAME_IDS);
  assert.equal(generated.games.flatMap((game) => game.rounds).length, EXPECTED_ROUND_COUNT);
  assert.equal(source.flatMap((game) => game.rounds).length, EXPECTED_ROUND_COUNT);

  for (const sourceGame of source) {
    const outputGame = generated.games.find((game) => game.id === sourceGame.id);
    assert.ok(outputGame, sourceGame.id);
    assert.equal(outputGame.title, sourceGame.title);
    assert.equal(outputGame.goal, sourceGame.goal);
    assert.equal(outputGame.rounds.length, sourceGame.rounds.length);
    for (const sourceRound of sourceGame.rounds) {
      const outputRound = outputGame.rounds.find((round) => round.id === sourceRound.id);
      assert.ok(outputRound, sourceRound.id);
      for (const field of ["prompt", "instruction", "difficultyNote", "answer", "success", "retry", "parentPrompt"]) {
        assert.deepEqual(outputRound[field], sourceRound[field], `${sourceRound.id}:${field}`);
      }
      assert.deepEqual(outputRound.choices, sourceRound.choices, `${sourceRound.id}:choices`);
      assert.deepEqual(outputRound.visualGroups, sourceRound.visualGroups, `${sourceRound.id}:visualGroups`);
      assert.deepEqual(outputRound.clockChallenge, sourceRound.clockChallenge, `${sourceRound.id}:clockChallenge`);
    }
  }
});

test("content digest is deterministic across non-writing exports", async () => {
  const first = await buildMathIslandExport({ write: false });
  const second = await buildMathIslandExport({ write: false });
  assert.equal(first.contentDigest, second.contentDigest);
});

test("export contract records the approved application scope", async () => {
  const generated = await readGeneratedCatalog();
  assert.equal(generated.schemaVersion, 1);
  assert.deepEqual(generated.world, {
    id: "math", name: "数字岛", summary: "数数、比较、加减、分组、时钟", gameCount: 8, roundCount: 122,
  });
  assert.ok(generated.games.every((game) => game.id.startsWith("math-")));
  assert.ok(!JSON.stringify(generated).includes("logic-"));
  assert.ok(!JSON.stringify(generated).includes("graphic-"));
});

test("Cocos metadata uses real importers and stable scene/script UUIDs", async () => {
  const catalogMeta = JSON.parse(await readFile("doyingame/assets/resources/math-island/data/catalog.json.meta", "utf8"));
  const imageMeta = JSON.parse(await readFile("doyingame/assets/resources/math-island/images/brand/thinking-house-brand-v3.png.meta", "utf8"));
  const audioMeta = JSON.parse(await readFile("doyingame/assets/resources/math-island/audio/zh-CN/edge-zh-cn-xiaoxiaoneural/prompt-请数一数-一共有几个苹果-用手指点着数-再选答案.mp3.meta", "utf8"));
  const sceneMeta = JSON.parse(await readFile("doyingame/assets/scenes/Main.scene.meta", "utf8"));
  const controllerMeta = JSON.parse(await readFile("doyingame/assets/scripts/AppController.ts.meta", "utf8"));
  assert.equal(catalogMeta.importer, "json");
  assert.equal(imageMeta.importer, "image");
  assert.equal(imageMeta.subMetas.f9941.importer, "sprite-frame");
  assert.equal(audioMeta.importer, "audio-clip");
  assert.equal(sceneMeta.uuid, "f361a3c9-906d-4fdf-b84a-b5d076e8b812");
  assert.equal(controllerMeta.uuid, "8b177c42-50af-4c08-bbf8-4560ea125e38");
});
