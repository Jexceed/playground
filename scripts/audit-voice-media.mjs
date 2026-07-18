import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  inspectVoiceFile,
  MINIMUM_HAN_SECONDS,
} from "./lib/voice-media-quality.mjs";

const manifestPath = join("public", "audio", "voice", "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
const inspections = await mapWithConcurrency(entries, 24, async (entry) => {
  const filePath = manifestSrcToFilePath(entry.src);
  if (!filePath) {
    return {
      entry,
      inspection: { problems: ["voice manifest entry has an invalid src"] },
    };
  }
  return {
    entry,
    inspection: await inspectVoiceFile(filePath, entry.text ?? ""),
  };
});

const problems = inspections.flatMap(({ entry, inspection }) =>
  inspection.problems.map((problem) => `${entry.id ?? "unknown"}: ${problem}`));
const summary = {
  manifestCount: entries.length,
  checkedCount: inspections.length,
  problemCount: problems.length,
  problems,
  minimumHanSeconds: MINIMUM_HAN_SECONDS,
};

console.log(JSON.stringify(summary, null, 2));
if (problems.length) process.exitCode = 1;

function manifestSrcToFilePath(src) {
  if (typeof src !== "string" || !src.startsWith("/audio/voice/")) return null;
  return join("public", decodeURIComponent(src).replace(/^\/+/, ""));
}

async function mapWithConcurrency(values, concurrency, mapper) {
  const output = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await mapper(values[index], index);
    }
  }));
  return output;
}
