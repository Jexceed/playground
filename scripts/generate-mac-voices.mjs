import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnFile } from "./lib/spawn-file.mjs";

const args = parseArgs(process.argv.slice(2));
const voice = args.voice ?? "Tingting";
const rate = Number(args.rate ?? 160);
const limit = Number(args.limit ?? 80);
const voiceKey = slug(`macos-${voice}`);
const outputDir = join("public", "audio", "voice", "zh-CN", voiceKey);
const manifestPath = join("public", "audio", "voice", "manifest.json");
const voiceLines = JSON.parse(readFileSync("public/audio/voice-lines.json", "utf8"));
const selected = selectLines(voiceLines.lines, limit);

mkdirSync(outputDir, { recursive: true });

const entries = [];
for (const [index, line] of selected.entries()) {
  const filename = `${safeFileName(line.id)}.wav`;
  const outputPath = join(outputDir, filename);
  const tmpAiff = join(tmpdir(), `thinking-island-${process.pid}-${index}.aiff`);
  await spawnFile("say", ["-v", voice, "-r", String(rate), "-o", tmpAiff, line.text]);
  await spawnFile("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", tmpAiff, outputPath]);
  rmSync(tmpAiff, { force: true });
  entries.push({
    id: line.id,
    kind: line.kind,
    text: line.text,
    src: `/audio/voice/zh-CN/${voiceKey}/${encodeURIComponent(basename(outputPath))}`,
  });
  process.stdout.write(`Generated ${index + 1}/${selected.length}: ${line.id}\n`);
}

writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      provider: "macOS say + afconvert",
      voice,
      rate,
      format: "wav",
      sampleRate: 22050,
      count: entries.length,
      entries,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${manifestPath} with ${entries.length} entries.`);

function selectLines(lines, count) {
  return lines
    .filter((line) => line.kind !== "parent")
    .slice(0, count);
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
