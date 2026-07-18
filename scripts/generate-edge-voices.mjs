import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnFile } from "./lib/spawn-file.mjs";
import { inspectVoiceFile } from "./lib/voice-media-quality.mjs";

const args = parseArgs(process.argv.slice(2));
const voice = args.voice ?? "zh-CN-XiaoxiaoNeural";
const rate = args.rate ?? "-12%";
const pitch = args.pitch ?? "+2Hz";
const limit = args.limit ? Number(args.limit) : Number.POSITIVE_INFINITY;
const includeParent = args["include-parent"] !== "false";
const quiet = Boolean(args.quiet);
const retries = Number(args.retries ?? 4);
const python = args.python ?? process.env.PYTHON ?? "python3";
const voiceKey = slug(`edge-${voice}`);
const outputDir = join("public", "audio", "voice", "zh-CN", voiceKey);
const manifestPath = join("public", "audio", "voice", "manifest.json");
const voiceLines = JSON.parse(readFileSync("public/audio/voice-lines.json", "utf8"));
const selected = selectLines(voiceLines.lines, limit, includeParent);

mkdirSync(outputDir, { recursive: true });

const entries = [];
const failures = [];
for (const [index, line] of selected.entries()) {
  const filename = `${safeFileName(line.id)}.mp3`;
  const outputPath = join(outputDir, filename);
  const textPath = join(tmpdir(), `thinking-island-edge-${process.pid}-${index}.txt`);
  const cachedInspection = await inspectVoiceFile(outputPath, line.text);
  const reusable = cachedInspection.problems.length === 0;

  if (!reusable) {
    if (existsSync(outputPath)) {
      if (!quiet) {
        process.stdout.write(`Rejected cached ${line.id}: ${cachedInspection.problems.join("; ")}\n`);
      }
      rmSync(outputPath, { force: true });
    }
    writeFileSync(textPath, line.text);
    try {
      await retry(async () => {
        rmSync(outputPath, { force: true });
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
        const generatedInspection = await inspectVoiceFile(outputPath, line.text);
        if (generatedInspection.problems.length) {
          rmSync(outputPath, { force: true });
          throw new Error(generatedInspection.problems.join("; "));
        }
      }, line.id, retries);
      process.stdout.write(`Generated ${index + 1}/${selected.length}: ${line.id}\n`);
    } catch (error) {
      failures.push({ id: line.id, text: line.text, reason: firstLine(error.message) });
      process.stdout.write(`Skipped ${index + 1}/${selected.length}: ${line.id}\n`);
      continue;
    } finally {
      rmSync(textPath, { force: true });
    }
  } else {
    if (!quiet) process.stdout.write(`Kept ${index + 1}/${selected.length}: ${line.id}\n`);
  }

  entries.push({
    id: line.id,
    kind: line.kind,
    text: line.text,
    src: `/audio/voice/zh-CN/${voiceKey}/${encodeURIComponent(basename(outputPath))}`,
  });
}

writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      provider: "edge-tts Python package",
      voice,
      rate,
      pitch,
      includeParent,
      format: "mp3",
      count: entries.length,
      requestedCount: selected.length,
      failures,
      entries,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${manifestPath} with ${entries.length} entries and ${failures.length} skipped lines.`);

function selectLines(lines, count, withParent) {
  const filtered = withParent ? lines : lines.filter((line) => line.kind !== "parent");
  return filtered.slice(0, count);
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

function firstLine(text) {
  return String(text).split("\n")[0];
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
    .slice(0, 110);
}

function slug(input) {
  return safeFileName(input).toLowerCase();
}
