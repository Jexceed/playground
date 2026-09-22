import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadGameData } from "./lib/load-game-data.mjs";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";
import { activitySolutions, permutations } from "./lib/activity-solutions.mjs";
const data = await loadGameData();
const { evaluateActivity } = await loadTypeScriptModule(
  "src/domain/activity-evaluation.ts",
);
const all = data.activitySets.flatMap((set) => set.rounds);
const filled = (tokenId) => ({ state: "filled", tokenId });

test("catalog contains 24 new activities and the exact unchanged 489-round legacy bank", () => {
  const baseline = JSON.parse(
    readFileSync(
      "specs/029-curriculum-benchmark/verification/legacy-baseline.json",
    ),
  );
  assert.equal(data.catalogGames.length, 44);
  assert.equal(all.length, 24);
  assert.equal(
    data.legacyGames.reduce((n, g) => n + g.rounds.length, 0),
    489,
  );
  assert.equal(
    createHash("sha256").update(JSON.stringify(data.legacyGames)).digest("hex"),
    baseline.sha256,
  );
  assert.equal(
    new Set(data.catalogGames.flatMap((g) => g.rounds.map((r) => r.id))).size,
    513,
  );
});

test("all pilot definitions have solutions and accept every enumerated legal result", () => {
  for (const activity of all) {
    const solutions = activitySolutions(activity);
    assert.ok(solutions.length > 0, activity.id);
    for (const response of solutions)
      assert.equal(
        evaluateActivity(activity, response).status,
        "correct",
        activity.id,
      );
  }
  const order = data.activitySets.find(
    (set) => set.id === "logic-lineup-challenge",
  );
  assert.deepEqual(
    order.rounds.map((activity) => activitySolutions(activity).length),
    [1, 1, 1, 1, 6, 1],
  );
  const grid = data.activitySets.find((set) => set.id === "graphic-rule-grid");
  assert.deepEqual(
    grid.rounds.map((activity) => activitySolutions(activity).length),
    [1, 1, 2, 1, 4, 1],
  );
});

test("selection answers match independently stated color/shape conditions for every subset", () => {
  const rules = [
    (c, s) => c === "red" && ["circle", "triangle"].includes(s),
    (c, s) => c === "blue" || s === "triangle",
    (c, s) => c === "yellow" && ["circle", "square"].includes(s),
    (c, s) => s === "circle" && c !== "red",
    (c, s) =>
      (c === "red" && s === "square") || (c === "blue" && s === "triangle"),
    (c, s) => Number(c === "red") + Number(s === "circle") === 1,
  ];
  data.activitySets[0].rounds.forEach((activity, index) => {
    const expected = activity.tokens
      .filter((token) => rules[index](...token.id.split("-")))
      .map((token) => token.id)
      .sort();
    for (let bits = 0; bits < 2 ** activity.tokens.length; bits++) {
      const ids = activity.tokens
        .filter((_, i) => bits & (1 << i))
        .map((token) => token.id);
      const valid =
        JSON.stringify([...ids].sort()) === JSON.stringify(expected);
      assert.equal(
        evaluateActivity(activity, { kind: "multiSelect", tokenIds: ids })
          .status === "correct",
        valid,
        activity.id,
      );
    }
  });
});

test("ordering matches independent authored outcomes for all permutations", () => {
  const expected = [
    [["rabbit", "cat", "dog"]],
    [["bear", "cat", "dog", "rabbit"]],
    [["rabbit", "cat", "dog", "bear"]],
    [["bear", "cat", "rabbit", "dog"]],
    [
      ["rabbit", "cat", "dog", "bear"],
      ["rabbit", "dog", "cat", "bear"],
      ["rabbit", "dog", "bear", "cat"],
      ["dog", "bear", "rabbit", "cat"],
      ["dog", "rabbit", "bear", "cat"],
      ["dog", "rabbit", "cat", "bear"],
    ],
    [["rabbit", "bear", "cat", "dog"]],
  ];
  data.activitySets[1].rounds.forEach((activity, index) => {
    const allowed = new Set(expected[index].map((order) => order.join(",")));
    for (const order of permutations(activity.tokens.map((t) => t.id)))
      assert.equal(
        evaluateActivity(activity, {
          kind: "orderedPlacement",
          slots: order.map(filled),
        }).status === "correct",
        allowed.has(order.join(",")),
        activity.id,
      );
  });
});

test("memory uses the visible cue sequence/positions; only the final task reverses recall", () => {
  for (const activity of data.activitySets[3].rounds) {
    const preview = activity.protocol.preview;
    const expected =
      activity.id === "memory-reverse-five" ? [...preview].reverse() : preview;
    const response =
      activity.kind === "gridPlacement"
        ? {
            kind: activity.kind,
            cells: Object.fromEntries(
              expected.map((id, index) => [`cell-${index}`, filled(id)]),
            ),
          }
        : { kind: activity.kind, slots: expected.map(filled) };
    assert.equal(
      evaluateActivity(activity, response).status,
      "correct",
      activity.id,
    );
    if (activity.id === "memory-reverse-five")
      assert.equal(
        evaluateActivity(activity, {
          kind: activity.kind,
          slots: preview.map(filled),
        }).status,
        "incorrect",
      );
  }
});
