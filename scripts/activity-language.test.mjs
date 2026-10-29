import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";

const { activityVoiceLines } = await loadTypeScriptModule("src/curriculum/activity-voice-lines.ts");
const { dialogueVisible, responsesVisible } = await loadTypeScriptModule("src/interactions/presentation-state.ts");

const dialogue = [
  { speaker: "孩子", english: "Can I have some water, please?", chinese: "请给我一些水，好吗？" },
  { speaker: "家长", english: "Here you are.", chinese: "给你。" },
];
const activity = {
  id: "language-test-choice", kind: "singleChoice", prompt: "孩子想喝水，可以怎么说？",
  instruction: "听一听，选一句。", success: "说清需要，也可以很有礼貌。", retry: "再想想孩子想要什么。",
  parentPrompt: "你还会在什么时候用这句话？", hints: [], clues: [], protocol: { kind: "practice" },
  tokens: [
    { id: "water", label: dialogue[0].english, speechLocale: "en-US" },
    { id: "hello", label: "Hello!", speechText: "Hello there!", speechLocale: "en-US" },
    { id: "chinese", label: "小猫" },
  ],
  presentation: { dialogue },
};
const set = { id: "language-test", title: "日常英语", goal: "看图说一句", parentPrompt: "轮流说一说", rounds: [activity] };

test("English token overrides and dialogue use the English local-voice key; existing tokens stay Chinese", () => {
  const lines = activityVoiceLines([set]);
  const objects = lines.filter(line => line.kind === "object");
  assert.deepEqual(objects.map(({ text, locale }) => ({ text, locale })), [
    { text: dialogue[0].english, locale: "en-US" },
    { text: "Hello there!", locale: "en-US" },
    { text: "小猫", locale: "zh-CN" },
  ]);
  assert.deepEqual(lines.filter(line => line.kind === "dialogue").map(({ text, locale }) => ({ text, locale })),
    dialogue.map(line => ({ text: line.english, locale: "en-US" })));
  assert.deepEqual(lines.filter(line => line.kind === "dialogue-meaning").map(({ text, locale }) => ({ text, locale })),
    dialogue.map(line => ({ text: line.chinese, locale: "zh-CN" })));
  const prompt = lines.find(line => line.kind === "prompt");
  assert.equal(prompt.locale, "zh-CN");
  for (const line of dialogue) assert.ok(!prompt.text.includes(line.english), "the prompt must not reveal the model conversation");
});

test("example tokens retain their speech language instead of inheriting the Chinese instruction language", () => {
  const example = { id: "example", label: "Good morning!", speechLocale: "en-US" };
  const lines = activityVoiceLines([{ ...set, rounds: [{ ...activity, kind: "multiSelect", example }] }]);
  assert.ok(lines.some(line => line.kind === "object" && line.text === example.label && line.locale === "en-US"));
});

test("model dialogue stays hidden until a choice is complete", () => {
  for (const phase of ["ready", "observe", "retain", "respond"])
    assert.equal(dialogueVisible(activity, phase, "play"), false, phase);
  assert.equal(dialogueVisible(activity, "complete", "play"), true);
  assert.equal(dialogueVisible({ ...activity, presentation: undefined }, "complete", "play"), false);
  assert.equal(dialogueVisible({ ...activity, presentation: { dialogue: [] } }, "complete", "play"), false);
});

test("parent dialogue follows the play/record switch without turning observation into a quiz", () => {
  const parentActivity = { ...activity, kind: "parentObservation" };
  for (const phase of ["respond", "complete"]) {
    assert.equal(dialogueVisible(parentActivity, phase, "play"), true);
    assert.equal(dialogueVisible(parentActivity, phase, "record"), false);
  }
});

test("completed conversation choices make room for the model while other response surfaces remain", () => {
  assert.equal(responsesVisible(activity, "respond"), true);
  assert.equal(responsesVisible(activity, "complete"), false);
  assert.equal(dialogueVisible(activity, "complete", "play"), true);
  assert.equal(responsesVisible({ ...activity, presentation: undefined }, "complete"), true);
  assert.equal(responsesVisible({ ...activity, presentation: { dialogue: [] } }, "complete"), true);
  assert.equal(responsesVisible({ ...activity, kind: "parentObservation" }, "complete"), true);
  assert.equal(responsesVisible({ ...activity, kind: "matching" }, "complete"), true);
  for (const phase of ["ready", "observe", "retain"])
    assert.equal(responsesVisible(activity, phase), false, phase);
});
