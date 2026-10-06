import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./lib/load-ts-module.mjs";
import { voiceFileName } from "./lib/voice-rendering.mjs";

const { prepareSpeechText } = await loadTypeScriptModule("src/speech-pronunciation.ts");

test("row references support Chinese, digits, letters and adjacent coordinates", () => {
  for (const [text, expected] of [
    ["第一行、第二行、第三行", "第一航、第二航、第三航"],
    ["第 3 行第 2 列，A 行 1 列，B行和C行", "第 3 航第 2 列，A 航 1 列，B航和C航"],
    ["上下两行，每一行和每列都检查", "上下两航，每一航和每列都检查"],
    ["先读第一行这个完整行，再看第三行", "先读第一航这个完整航，再看第三航"],
    ["字母行、行列、逐行、按行、跨行", "字母航、航列、逐航、按航、跨航"],
    ["下面的行既要自己不重复，也要和上面的列对上。", "下面的航既要自己不重复，也要和上面的列对上。"],
    ["每个问号都要同时对上行的颜色和列的形状。", "每个问号都要同时对上航的颜色和列的形状。"],
    ["蓝白行交替，颜色行次序和形状列次序。", "蓝白航交替，颜色航次序和形状列次序。"],
    ["它所在的行和列。", "它所在的航和列。"],
    ["先补一整行，再按三行一组重复。", "先补一整航，再按三航一组重复。"],
  ]) assert.equal(prepareSpeechText(text), expected);
});

test("ordinary xing meanings stay intact even next to row instructions", () => {
  const text = "看第一行，再执行列表中的行动：让行人安全通行，不要骑自行车逆行。平行、飞行、可行、不行、才行、进行、运行、旅行、行走、行驶、行为、行程、行星、行李、行礼。";
  assert.equal(prepareSpeechText(text), text.replace("第一行", "第一航"));
  assert.equal(prepareSpeechText("每行驶一公里；第三行星；银行业务。"), "每行驶一公里；第三行星；银行业务。");
});

test("pronunciation input is locale-scoped and idempotent", () => {
  const text = "第三行和第一列";
  assert.equal(prepareSpeechText(text, "en-US"), text);
  const prepared = prepareSpeechText(text);
  assert.equal(prepareSpeechText(prepared), prepared);
});

test("pronunciation changes invalidate audio URLs while untouched lines keep their cached asset", () => {
  const settings = { voice: "zh-CN-XiaoxiaoNeural", rate: "-12%", pitch: "+2Hz" };
  const line = { id: "prompt-第一行", text: "第一行" };
  const original = voiceFileName(line, settings);
  assert.equal(original, "prompt-第一行.mp3");
  const corrected = { ...line, spokenText: prepareSpeechText(line.text) };
  assert.notEqual(voiceFileName(corrected, settings), original);
  assert.equal(voiceFileName(corrected, settings), voiceFileName(corrected, settings));
  assert.notEqual(voiceFileName({ ...corrected, spokenText: "第一排" }, settings), voiceFileName(corrected, settings));
  assert.notEqual(voiceFileName(corrected, { ...settings, pitch: "+3Hz" }), voiceFileName(corrected, settings));
  const long = { ...corrected, id: `prompt-${"第一行".repeat(40)}` };
  assert.ok(Buffer.byteLength(voiceFileName(long, settings)) < 255);
});
