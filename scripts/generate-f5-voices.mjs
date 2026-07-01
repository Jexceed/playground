import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnFile } from "./lib/spawn-file.mjs";

const args = parseArgs(process.argv.slice(2));
const refAudio = args["ref-audio"];
const refText = args["ref-text"];
const limit = args.limit ? Number(args.limit) : Number.POSITIVE_INFINITY;
const includeParent = args["include-parent"] !== "false";
const quiet = Boolean(args.quiet);
const voiceName = args.voice ?? "f5-reference";
const outputFormat = "wav";

if (!refAudio || !refText) {
  console.error("Usage: pnpm generate:f5-voices -- --ref-audio /path/ref.wav --ref-text \"参考音频文本\"");
  process.exit(2);
}

const refAudioPath = resolve(refAudio);
if (!existsSync(refAudioPath)) {
  console.error(`Reference audio not found: ${refAudioPath}`);
  process.exit(2);
}

const voiceKey = slug(`f5-${voiceName}`);
const outputDir = join("public", "audio", "voice", "zh-CN", voiceKey);
const manifestPath = join("public", "audio", "voice", "manifest.json");
const voiceLines = JSON.parse(readFileSync("public/audio/voice-lines.json", "utf8"));
const selected = selectLines(voiceLines.lines, limit, includeParent);

mkdirSync(outputDir, { recursive: true });

const entries = [];
const failures = [];
for (const [index, line] of selected.entries()) {
  const filename = `${safeFileName(line.id)}.${outputFormat}`;
  const outputPath = join(outputDir, filename);

  if (!hasAudio(outputPath)) {
    try {
      await spawnFile("./local-tts/synthesize.sh", [refAudioPath, refText, line.text, outputPath]);
      process.stdout.write(`Generated ${index + 1}/${selected.length}: ${line.id}\n`);
    } catch (error) {
      failures.push({ id: line.id, text: line.text, reason: firstLine(error.message) });
      process.stdout.write(`Skipped ${index + 1}/${selected.length}: ${line.id}\n`);
      continue;
    }
  } else if (!quiet) {
    process.stdout.write(`Kept ${index + 1}/${selected.length}: ${line.id}\n`);
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
      provider: "F5-TTS local",
      voice: voiceName,
      referenceAudio: refAudioPath,
      referenceText: refText,
      includeParent,
      format: outputFormat,
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
    .slice(0, 110);
}

function slug(input) {
  return safeFileName(input).toLowerCase();
}
