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
const concurrency = Math.max(1, Math.min(6, Number(args.concurrency ?? 4)));
const manifestPath = join("public", "audio", "voice", "manifest.json");
const voiceLines = JSON.parse(readFileSync("public/audio/voice-lines.json", "utf8"));
const selected = selectLines(voiceLines.lines, limit, includeParent);

const entries = [];
const failures = [];
let cursor=0;
await Promise.all(Array.from({length:concurrency}, async()=>{
while(cursor<selected.length) {
  const index=cursor++, line=selected[index];
  const locale=line.locale ?? "zh-CN";
  if (!["zh-CN", "en-US"].includes(locale)) throw new Error(`Unsupported speech locale: ${locale}`);
  const effectiveVoice=locale==="en-US" ? (args["english-voice"] ?? "en-US-JennyNeural") : voice;
  const voiceKey=slug(`edge-${effectiveVoice}`);
  const outputDir=join("public", "audio", "voice", locale, voiceKey);
  mkdirSync(outputDir,{recursive:true});
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
          effectiveVoice,
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

  entries[index] = {
    id: line.id,
    kind: line.kind,
    text: line.text,
    locale,
    voice: effectiveVoice,
    src: `/audio/voice/${locale}/${voiceKey}/${encodeURIComponent(basename(outputPath))}`,
  };
}
}));
const completedEntries = entries.filter(Boolean);

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
      count: completedEntries.length,
      requestedCount: selected.length,
      failures,
      entries: completedEntries,
      voicesByLocale: { "zh-CN": voice, "en-US": args["english-voice"] ?? "en-US-JennyNeural" },
    },
    null,
    2,
  ),
);

console.log(`Wrote ${manifestPath} with ${completedEntries.length} entries and ${failures.length} skipped lines.`);

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
