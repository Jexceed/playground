import { readFile, readdir, rm } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export async function collectVoiceOrphans(rootDir, manifest) {
  const projectRoot = resolve(rootDir);
  const publicRoot = resolve(projectRoot, "public");
  const voiceRoot = resolve(publicRoot, "audio", "voice", "zh-CN");
  const referenced = new Set([
    ...(manifest.entries ?? []).map((entry) => entry.src),
    ...(manifest.segmentEntries ?? []).flatMap((entry) => entry.srcs ?? []),
  ].filter(Boolean).map((src) => manifestSrcToPath(publicRoot, src)));
  const candidates = await listFiles(voiceRoot);
  return candidates.filter((filePath) => !referenced.has(filePath)).sort();
}

export async function pruneVoiceOrphans(rootDir, manifest, { write = false } = {}) {
  const orphans = await collectVoiceOrphans(rootDir, manifest);
  const deleted = [];
  if (write) {
    const voiceRoot = resolve(rootDir, "public", "audio", "voice", "zh-CN");
    for (const filePath of orphans) {
      assertInside(filePath, voiceRoot);
      await rm(filePath);
      deleted.push(filePath);
    }
  }
  return { deleted, orphans };
}

function manifestSrcToPath(publicRoot, src) {
  const decoded = decodeURIComponent(String(src)).replace(/^\/+/, "");
  const filePath = resolve(publicRoot, decoded);
  assertInside(filePath, publicRoot);
  return filePath;
}

async function listFiles(root) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = resolve(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  }));
  return files.flat();
}

function assertInside(filePath, root) {
  const pathFromRoot = relative(resolve(root), resolve(filePath));
  if (!pathFromRoot || pathFromRoot === ".." || pathFromRoot.startsWith(`..${sep}`)) {
    throw new Error(`Refusing to operate outside ${root}: ${filePath}`);
  }
}

async function main() {
  const rootDir = process.cwd();
  const manifest = JSON.parse(await readFile(resolve(rootDir, "public", "audio", "voice", "manifest.json"), "utf8"));
  const write = process.argv.includes("--write");
  const result = await pruneVoiceOrphans(rootDir, manifest, { write });
  console.log(JSON.stringify({
    mode: write ? "write" : "dry-run",
    orphanCount: result.orphans.length,
    deletedCount: result.deleted.length,
    orphans: result.orphans.map((filePath) => relative(rootDir, filePath)),
  }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}

