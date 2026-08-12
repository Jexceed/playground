import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import { EXPECTED_ROUND_COUNT, readGeneratedCatalog, RUNTIME_ROOT } from "./lib/douyin-math-export.mjs";

test("all exported rounds use supported visual surfaces and valid answers", async () => {
  const catalog = await readGeneratedCatalog();
  const rounds = catalog.games.flatMap((game) => game.rounds);
  assert.equal(rounds.length, EXPECTED_ROUND_COUNT);
  for (const round of rounds) {
    assert.ok(round.choices.length >= 2 && round.choices.length <= 4, round.id);
    assert.equal(new Set(round.choices.map((choice) => choice.value)).size, round.choices.length, round.id);
    assert.ok(round.choices.some((choice) => choice.value === round.answer), round.id);
    assert.ok(round.visualGroups || round.clockChallenge, `${round.id}: missing visual evidence`);
    assert.ok(!round.sequence && !round.grid && !round.matrix && !round.memory && !round.graphicChallenge, round.id);
    for (const group of round.visualGroups ?? []) {
      for (const token of group.items) assert.ok(catalog.tokenRenderers[token], `${round.id}: ${JSON.stringify(token)}`);
    }
  }
});

test("every round voice and scene reference exists in the generated package", async () => {
  const catalog = await readGeneratedCatalog();
  for (const game of catalog.games) {
    for (const reference of Object.values(game.voice)) await access(join(RUNTIME_ROOT, reference.src));
    for (const round of game.rounds) {
      for (const reference of [round.voice.prompt, round.voice.success, round.voice.retry, round.voice.parent, ...Object.values(round.voice.choices)]) {
        await access(join(RUNTIME_ROOT, reference.src));
      }
      if (round.sceneImage) await access(join(RUNTIME_ROOT, round.sceneImage.src));
    }
  }
});

test("clock challenges cover whole hours, half hours, and day-period conversion", async () => {
  const catalog = await readGeneratedCatalog();
  const clock = catalog.games.find((game) => game.id === "math-clock-time");
  assert.ok(clock);
  assert.ok(clock.rounds.some((round) => round.clockChallenge?.minute === 0));
  assert.ok(clock.rounds.some((round) => round.clockChallenge?.minute === 30));
  assert.ok(clock.rounds.some((round) => round.clockChallenge?.mode === "time-conversion" && round.answer.startsWith("1")));
});
