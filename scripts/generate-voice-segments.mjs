import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnFile } from "./lib/spawn-file.mjs";

const args = parseArgs(process.argv.slice(2));
const threshold = Number(args.threshold ?? 34);
const voice = args.voice ?? "zh-CN-XiaoxiaoNeural";
const rate = args.rate ?? "-12%";
const pitch = args.pitch ?? "+2Hz";
const retries = Number(args.retries ?? 4);
const python = args.python ?? process.env.PYTHON ?? "python3";
const quiet = Boolean(args.quiet);
const voiceKey = slug(`edge-${voice}`);
const outputDir = join("public", "audio", "voice", "zh-CN", `${voiceKey}-segments`);
const manifestPath = join("public", "audio", "voice", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const longEntries = (manifest.entries ?? []).filter((entry) => entry.kind === "prompt" && Array.from(entry.text ?? "").length > threshold);

mkdirSync(outputDir, { recursive: true });

const chunkToSrc = new Map();
const failures = [];
for (const [index, chunk] of uniqueChunks(longEntries).entries()) {
  const filename = `${segmentFileName(chunk)}.mp3`;
  const outputPath = join(outputDir, filename);
  const textPath = join(tmpdir(), `thinking-island-segment-${process.pid}-${index}.txt`);
  if (!hasAudio(outputPath)) {
    writeFileSync(textPath, chunk);
    try {
      await retry(async () => {
        await spawnFile(python, [
          "-m",
          "edge_tts",
          "--voice",
          voice,
          `--rate=${rate}`,
          `--pitch=${pitch}`,
          "--file",
          textPath,
          "--write-media",
          outputPath,
        ]);
      }, chunk, retries);
      if (!quiet) process.stdout.write(`Generated segment ${index + 1}: ${chunk}\n`);
    } catch (error) {
      failures.push({ text: chunk, reason: firstLine(error.message) });
      process.stdout.write(`Skipped segment ${index + 1}: ${chunk}\n`);
      continue;
    } finally {
      rmSync(textPath, { force: true });
    }
  }
  chunkToSrc.set(chunk, `/audio/voice/zh-CN/${voiceKey}-segments/${encodeURIComponent(basename(outputPath))}`);
}

const segmentEntries = [];
for (const entry of longEntries) {
  const chunks = splitSpeechText(entry.text);
  const srcs = chunks.map((chunk) => chunkToSrc.get(chunk)).filter(Boolean);
  if (srcs.length === chunks.length) {
    segmentEntries.push({
      id: `segments-${entry.id}`,
      text: entry.text,
      srcs,
    });
  }
}

writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      ...manifest,
      segmentGeneratedAt: new Date().toISOString(),
      segmentVoice: voice,
      segmentRate: rate,
      segmentPitch: pitch,
      segmentThreshold: threshold,
      segmentFailures: failures,
      segmentEntries,
    },
    null,
    2,
  ),
);

console.log(
  `Wrote ${manifestPath} with ${segmentEntries.length}/${longEntries.length} long prompt segment entries and ${failures.length} failed chunks.`,
);

function uniqueChunks(entries) {
  const chunks = new Set();
  for (const entry of entries) {
    for (const chunk of splitSpeechText(entry.text)) chunks.add(chunk);
  }
  return Array.from(chunks);
}

function splitSpeechText(text) {
  const parts = text
    .split(/(?<=[。？！])|(?<=[，、：；])/u)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return parts;
  return parts.flatMap((part) => splitLongPart(part));
}

function splitLongPart(part) {
  if (Array.from(part).length <= 22) return [part];
  const chunks = [];
  let current = part;
  while (Array.from(current).length > 22) {
    const cut = Math.max(current.lastIndexOf("，", 22), current.lastIndexOf("、", 22), current.lastIndexOf(" ", 22));
    const index = cut > 8 ? cut + 1 : 22;
    chunks.push(current.slice(0, index).trim());
    current = current.slice(index).trim();
  }
  if (current) chunks.push(current);
  return chunks;
}

async function retry(task, label, attempts) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await task();
      return;
    } catch (error) {
      lastError = error;
      process.stdout.write(`Retry ${attempt}/${attempts} for ${label}: ${firstLine(error.message)}\n`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1600));
    }
  }
  throw lastError;
}

function segmentFileName(text) {
  return `segment-${safeFileName(text).slice(0, 72)}-${createHash("sha1").update(text).digest("hex").slice(0, 10)}`;
}

function firstLine(text) {
  return String(text).split("\n")[0];
}

function hasAudio(file) {
  return existsSync(file) && statSync(file).size > 1024;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

function safeFileName(input) {
  return input
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function slug(input) {
  return safeFileName(input);
}
