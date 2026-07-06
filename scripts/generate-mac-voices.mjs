import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnFile } from "./lib/spawn-file.mjs";

const args = parseArgs(process.argv.slice(2));
const voice = args.voice ?? "Tingting";
const rate = Number(args.rate ?? 160);
const mergeExisting = Boolean(args["merge-existing"]);
const includeParent = args["include-parent"] !== "false";
const limit = Number(args.limit ?? (mergeExisting ? Number.POSITIVE_INFINITY : 80));
const voiceKey = slug(`macos-${voice}`);
const outputDir = join("public", "audio", "voice", "zh-CN", voiceKey);
const manifestPath = join("public", "audio", "voice", "manifest.json");
const voiceLines = JSON.parse(readFileSync("public/audio/voice-lines.json", "utf8"));
const selected = selectLines(voiceLines.lines, limit, includeParent);
const existingManifest = mergeExisting && existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : null;
const existingEntries = new Map(
  (existingManifest?.entries ?? [])
    .filter((entry) => entry?.id && hasManifestAudio(entry))
    .map((entry) => [entry.id, entry]),
);

mkdirSync(outputDir, { recursive: true });

const entries = [];
for (const [index, line] of selected.entries()) {
  const existingEntry = existingEntries.get(line.id);
  if (mergeExisting && existingEntry) {
    entries.push(existingEntry);
    process.stdout.write(`Kept ${index + 1}/${selected.length}: ${line.id}\n`);
    continue;
  }

  const filename = `${safeFileName(line.id)}.wav`;
  const outputPath = join(outputDir, filename);
  const tmpAiff = join(tmpdir(), `thinking-island-${process.pid}-${index}.aiff`);
  if (!hasAudio(outputPath)) {
    await spawnFile("say", ["-v", voice, "-r", String(rate), "-o", tmpAiff, line.text]);
    await spawnFile("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", tmpAiff, outputPath]);
    rmSync(tmpAiff, { force: true });
  }
  entries.push({
    id: line.id,
    kind: line.kind,
    text: line.text,
    provider: "macOS say + afconvert",
    src: `/audio/voice/zh-CN/${voiceKey}/${encodeURIComponent(basename(outputPath))}`,
  });
  process.stdout.write(`Generated ${index + 1}/${selected.length}: ${line.id}\n`);
}

writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      provider: mergeExisting ? "mixed local" : "macOS say + afconvert",
      providers: mergeExisting ? mergedProviders(existingManifest, "macOS say + afconvert") : ["macOS say + afconvert"],
      voice,
      rate,
      format: mergeExisting ? "mixed" : "wav",
      sampleRate: 22050,
      count: entries.length,
      requestedCount: selected.length,
      entries,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${manifestPath} with ${entries.length} entries.`);

function selectLines(lines, count, withParent) {
  return lines
    .filter((line) => withParent || line.kind !== "parent")
    .slice(0, count);
}

function mergedProviders(manifest, provider) {
  return Array.from(new Set([
    ...(manifest?.providers ?? []),
    ...(manifest?.provider ? [manifest.provider] : []),
    provider,
  ].filter((value) => value && value !== "mixed local")));
}

function hasManifestAudio(entry) {
  if (!entry?.src) return false;
  const filePath = join("public", decodeURIComponent(entry.src.replace(/^\/+/, "").replace(/^audio\//, "audio/")));
  return hasAudio(filePath);
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
