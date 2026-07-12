import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { collectVoiceOrphans, pruneVoiceOrphans } from "./prune-voice-assets.mjs";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "thinking-house-voice-prune-"));
  const edgeDir = join(root, "public", "audio", "voice", "zh-CN", "edge-test");
  const macDir = join(root, "public", "audio", "voice", "zh-CN", "macos-test");
  const brandDir = join(root, "public", "audio", "brand");
  await Promise.all([mkdir(edgeDir, { recursive: true }), mkdir(macDir, { recursive: true }), mkdir(brandDir, { recursive: true })]);
  await Promise.all([
    writeFile(join(edgeDir, "keep.mp3"), "keep"),
    writeFile(join(edgeDir, "segment.mp3"), "segment"),
    writeFile(join(edgeDir, "orphan.mp3"), "orphan"),
    writeFile(join(macDir, "old.wav"), "old"),
    writeFile(join(brandDir, "launch.wav"), "brand"),
  ]);
  const manifest = {
    entries: [{ src: "/audio/voice/zh-CN/edge-test/keep.mp3" }],
    segmentEntries: [{ srcs: ["/audio/voice/zh-CN/edge-test/segment.mp3"] }],
  };
  return { root, edgeDir, macDir, brandDir, manifest };
}

test("collectVoiceOrphans returns only unreferenced locale voice files", async () => {
  const item = await fixture();
  try {
    const orphans = await collectVoiceOrphans(item.root, item.manifest);
    assert.deepEqual(orphans.map((path) => path.slice(item.root.length + 1)), [
      "public/audio/voice/zh-CN/edge-test/orphan.mp3",
      "public/audio/voice/zh-CN/macos-test/old.wav",
    ]);
  } finally {
    await rm(item.root, { recursive: true, force: true });
  }
});

test("dry run preserves referenced and orphan files", async () => {
  const item = await fixture();
  try {
    const result = await pruneVoiceOrphans(item.root, item.manifest, { write: false });
    assert.equal(result.deleted.length, 0);
    assert.equal(result.orphans.length, 2);
    assert.equal(await readFile(join(item.edgeDir, "orphan.mp3"), "utf8"), "orphan");
  } finally {
    await rm(item.root, { recursive: true, force: true });
  }
});

test("write mode removes only orphans and preserves referenced and brand audio", async () => {
  const item = await fixture();
  try {
    const result = await pruneVoiceOrphans(item.root, item.manifest, { write: true });
    assert.equal(result.deleted.length, 2);
    assert.equal(await readFile(join(item.edgeDir, "keep.mp3"), "utf8"), "keep");
    assert.equal(await readFile(join(item.edgeDir, "segment.mp3"), "utf8"), "segment");
    assert.equal(await readFile(join(item.brandDir, "launch.wav"), "utf8"), "brand");
  } finally {
    await rm(item.root, { recursive: true, force: true });
  }
});

