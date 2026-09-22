import test from "node:test";
import assert from "node:assert/strict";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";

const { evaluateActivity, emptyResponse, placeToken } =
  await loadTypeScriptModule("src/domain/activity-evaluation.ts");
const { createSession, transitionSession } = await loadTypeScriptModule(
  "src/engine/activity-session.ts",
);
const token = (id) => ({ id, label: id, image: { src: "/test.png", alt: id } });
const base = {
  id: "fixture",
  revision: 1,
  tokens: ["a", "b", "blank"].map(token),
  success: "对了",
  retry: "再看看",
  hints: ["看线索"],
  protocol: { kind: "practice" },
};
const fill = (id) => ({ state: "filled", tokenId: id });

test("multi-select compares sets, rejects duplicate/unknown tokens, and permits a deliberately empty answer", () => {
  const activity = {
    ...base,
    kind: "multiSelect",
    expectedTokenIds: ["a", "b"],
  };
  assert.equal(
    evaluateActivity(activity, { kind: activity.kind, tokenIds: ["b", "a"] })
      .status,
    "correct",
  );
  assert.equal(
    evaluateActivity(activity, { kind: activity.kind, tokenIds: ["a"] }).status,
    "incorrect",
  );
  assert.equal(
    evaluateActivity(activity, {
      kind: activity.kind,
      tokenIds: ["a", "a", "b"],
    }).status,
    "incorrect",
  );
  assert.equal(
    evaluateActivity(activity, {
      kind: activity.kind,
      tokenIds: ["a", "b", "other"],
    }).status,
    "incorrect",
  );
  assert.equal(
    evaluateActivity(
      { ...activity, expectedTokenIds: [] },
      emptyResponse(activity),
    ).status,
    "correct",
  );
});

test("order constraints accept all valid orders rather than one stored sequence", () => {
  const activity = {
    ...base,
    kind: "orderedPlacement",
    slotCount: 3,
    tokenUse: "once",
    evaluation: {
      kind: "constraints",
      rules: [{ type: "before", first: "a", second: "b", text: "a在b前面" }],
    },
  };
  for (const order of [
    ["a", "b", "blank"],
    ["a", "blank", "b"],
    ["blank", "a", "b"],
  ]) {
    assert.equal(
      evaluateActivity(activity, {
        kind: activity.kind,
        slots: order.map(fill),
      }).status,
      "correct",
    );
  }
  assert.equal(
    evaluateActivity(activity, {
      kind: activity.kind,
      slots: ["b", "a", "blank"].map(fill),
    }).status,
    "incorrect",
  );
  assert.equal(
    evaluateActivity(activity, {
      kind: activity.kind,
      slots: ["a", "a", "b"].map(fill),
    }).status,
    "incorrect",
  );
});

test("placement moves a once-only token, replaces occupied slots, and supports reusable tokens", () => {
  const activity = {
    ...base,
    kind: "orderedPlacement",
    slotCount: 3,
    tokenUse: "once",
    evaluation: { kind: "sequence", tokenIds: ["a", "b", "blank"] },
  };
  let response = placeToken(activity, emptyResponse(activity), "slot-0", "a");
  response = placeToken(activity, response, "slot-1", "a");
  assert.deepEqual(response.slots, [
    { state: "unfilled" },
    fill("a"),
    { state: "unfilled" },
  ]);
  const reusable = {
    ...activity,
    tokenUse: "unlimited",
    evaluation: { kind: "sequence", tokenIds: ["a", "a", "blank"] },
  };
  response = emptyResponse(reusable);
  for (const [i, id] of ["a", "a", "blank"].entries())
    response = placeToken(reusable, response, "slot-" + i, id);
  assert.equal(evaluateActivity(reusable, response).status, "correct");
  assert.equal(
    evaluateActivity(reusable, {
      ...response,
      slots: [fill("a"), fill("a"), { state: "unfilled" }],
    }).status,
    "incomplete",
  );
});

test("grid constraints distinguish an unfilled cell from a legitimate blank card and accept alternate Latin squares", () => {
  const activity = {
    ...base,
    kind: "gridPlacement",
    columns: 3,
    cells: Array(9).fill(null),
    tokenUse: "unlimited",
    evaluation: { kind: "latin", tokenIds: ["a", "b", "blank"] },
  };
  for (const values of [
    ["a", "b", "blank", "b", "blank", "a", "blank", "a", "b"],
    ["a", "blank", "b", "b", "a", "blank", "blank", "b", "a"],
  ]) {
    const cells = Object.fromEntries(
      values.map((id, i) => ["cell-" + i, fill(id)]),
    );
    assert.equal(
      evaluateActivity(activity, { kind: activity.kind, cells }).status,
      "correct",
    );
  }
  assert.equal(
    evaluateActivity(activity, emptyResponse(activity)).status,
    "incomplete",
  );
  assert.equal(
    evaluateActivity(activity, {
      kind: activity.kind,
      cells: Object.fromEntries(
        Array.from({ length: 9 }, (_, i) => ["cell-" + i, fill("a")]),
      ),
    }).status,
    "incorrect",
  );
});

test("session retains undo history; only complete submitted answers count as attempts", () => {
  const activity = {
    ...base,
    kind: "orderedPlacement",
    slotCount: 3,
    tokenUse: "unlimited",
    evaluation: { kind: "sequence", tokenIds: ["a", "a", "blank"] },
  };
  let state = createSession(activity);
  state = transitionSession(activity, state, {
    type: "place",
    slotId: "slot-0",
    tokenId: "a",
  });
  state = transitionSession(activity, state, { type: "undo" });
  assert.equal(state.response.slots[0].state, "unfilled");
  state = transitionSession(activity, state, { type: "submit" });
  assert.equal(state.attempts, 0);
  for (const [i, id] of ["a", "b", "blank"].entries())
    state = transitionSession(activity, state, {
      type: "place",
      slotId: "slot-" + i,
      tokenId: id,
    });
  state = transitionSession(activity, state, { type: "submit" });
  assert.equal(state.attempts, 1);
  assert.equal(state.result.status, "incorrect");
  state = transitionSession(activity, state, {
    type: "place",
    slotId: "slot-1",
    tokenId: "a",
  });
  state = transitionSession(activity, state, { type: "submit" });
  assert.equal(state.attempts, 2);
  assert.equal(state.phase, "complete");
});

test("memory hides before retention, replays record support, and background interruption restarts safely", () => {
  const activity = {
    ...base,
    kind: "orderedPlacement",
    slotCount: 3,
    tokenUse: "unlimited",
    evaluation: { kind: "sequence", tokenIds: ["a", "b", "a"] },
    protocol: {
      kind: "memory",
      observeMs: 8000,
      retainMs: 1000,
      preview: ["a", "b", "a"],
    },
  };
  let state = createSession(activity);
  assert.equal(state.phase, "ready");
  state = transitionSession(activity, state, { type: "start" });
  assert.equal(state.phase, "observe");
  state = transitionSession(activity, state, { type: "observationFinished" });
  assert.equal(state.phase, "retain");
  state = transitionSession(activity, state, { type: "retentionFinished" });
  assert.equal(state.phase, "respond");
  state = transitionSession(activity, state, { type: "reveal" });
  assert.equal(state.reveals, 1);
  assert.equal(state.phase, "observe");
  state = transitionSession(activity, state, { type: "interrupt" });
  assert.equal(state.phase, "ready");
  assert.equal(state.restarts, 1);
  assert.equal(state.attempts, 0);
});

test("batched actions retain individual evidence instead of losing intermediate attempts", () => {
  const activity = { ...base, kind: "multiSelect", expectedTokenIds: ["b"] };
  let state = createSession(activity);
  state = transitionSession(activity, state, { type: "toggle", tokenId: "a" });
  state = transitionSession(activity, state, { type: "submit" });
  state = transitionSession(activity, state, { type: "submit" });
  state = transitionSession(activity, state, { type: "hint" });
  assert.deepEqual(state.evidence, [
    { sequence: 1, kind: "attempt", correct: false },
    { sequence: 2, kind: "attempt", correct: false },
    { sequence: 3, kind: "hint" },
  ]);
  state = transitionSession(activity, state, { type: "again" });
  assert.equal(state.evidence.length, 3);
});
