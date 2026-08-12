import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { readGeneratedCatalog } from "./lib/douyin-math-export.mjs";

test("every game and round preserves a useful parent conversation prompt", async () => {
  const catalog = await readGeneratedCatalog();
  for (const game of catalog.games) {
    assert.ok(game.goal.length >= 8, game.id);
    assert.ok(/[问请]/.test(game.parentPrompt), `${game.id}: ${game.parentPrompt}`);
    for (const round of game.rounds) {
      assert.ok(round.parentPrompt.length >= 8, round.id);
      assert.ok(/[？?]|问|请|说/.test(round.parentPrompt), `${round.id}: ${round.parentPrompt}`);
    }
  }
});

test("child-facing runtime contains no ad, payment, countdown, or score pressure", async () => {
  const catalog = await readGeneratedCatalog();
  const source = [
    await readFile("doyingame/assets/scripts/ui/HomeView.ts", "utf8"),
    await readFile("doyingame/assets/scripts/ui/GameView.ts", "utf8"),
  ].join("\n");
  const childText = JSON.stringify(catalog.games);
  for (const forbidden of ["激励广告", "付费复活", "倒计时", "排行榜", "金币不足", "再充"]) {
    assert.ok(!childText.includes(forbidden), forbidden);
    assert.ok(!source.includes(forbidden), forbidden);
  }
});
