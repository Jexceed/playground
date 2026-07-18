import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  inspectMp3,
  inspectVoiceFile,
  inspectVoiceMedia,
  minimumVoiceDuration,
} from "./lib/voice-media-quality.mjs";

const FRAME_BYTES = 144;
const FRAME_DURATION = 576 / 24_000;
const EDGE_FRAME_HEADER = Buffer.from([0xff, 0xf3, 0x64, 0xc4]);

function edgeMp3(frameCount, trailingBytes = 0) {
  const buffer = Buffer.alloc(frameCount * FRAME_BYTES + trailingBytes);
  for (let index = 0; index < frameCount; index += 1) {
    EDGE_FRAME_HEADER.copy(buffer, index * FRAME_BYTES);
  }
  if (trailingBytes >= EDGE_FRAME_HEADER.length) {
    EDGE_FRAME_HEADER.copy(buffer, frameCount * FRAME_BYTES);
  }
  return buffer;
}

test("inspectMp3 reads complete Edge MPEG-2 Layer III frames", () => {
  const result = inspectMp3(edgeMp3(100));

  assert.equal(result.problems.length, 0);
  assert.equal(result.frameCount, 100);
  assert.equal(result.sampleRate, 24_000);
  assert.equal(result.bitrateKbps, 48);
  assert.ok(Math.abs(result.durationSeconds - 100 * FRAME_DURATION) < 0.000001);
});

test("inspectMp3 rejects data without complete MP3 frames", () => {
  const result = inspectMp3(Buffer.from("not an mp3"));

  assert.match(result.problems.join("\n"), /no complete MP3 frames/);
});

test("inspectMp3 rejects a truncated final frame", () => {
  const result = inspectMp3(edgeMp3(20, 40));

  assert.equal(result.frameCount, 20);
  assert.match(result.problems.join("\n"), /truncated MP3 frame/);
});

test("sentence-length Chinese audio must be plausible for its text", () => {
  const text = "这题只看颜色。圆形篮子是看形状时才用的。";
  const result = inspectVoiceMedia(edgeMp3(35), text);

  assert.equal(result.hanCount, 18);
  assert.equal(minimumVoiceDuration(text), 18 * 0.18);
  assert.match(result.problems.join("\n"), /voice duration .* is below .* for 18 Han characters/);
});

test("short choices use the absolute media floor instead of sentence ratio", () => {
  const result = inspectVoiceMedia(edgeMp3(20), "走");

  assert.ok(Math.abs(result.durationSeconds - 20 * FRAME_DURATION) < 0.000001);
  assert.deepEqual(result.problems, []);
});

test("normal sentence duration passes the conservative threshold", () => {
  const result = inspectVoiceMedia(edgeMp3(200), "把两边一个对一个配起来，看哪边还剩下。");

  assert.equal(result.hanCount, 17);
  assert.deepEqual(result.problems, []);
});

test("inspectVoiceFile reports missing files and validates present media", async () => {
  const root = await mkdtemp(join(tmpdir(), "thinking-house-voice-quality-"));
  try {
    const missing = await inspectVoiceFile(join(root, "missing.mp3"), "完整句子需要检查");
    assert.match(missing.problems.join("\n"), /voice file is missing/);

    const presentPath = join(root, "present.mp3");
    await writeFile(presentPath, edgeMp3(100));
    const present = await inspectVoiceFile(presentPath, "短句");
    assert.deepEqual(present.problems, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
