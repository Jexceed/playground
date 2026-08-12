import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";

const PROJECT_ASSETS = resolve("doyingame/assets");
const UUID_OVERRIDES = new Map([
  ["scenes/Main.scene", "f361a3c9-906d-4fdf-b84a-b5d076e8b812"],
  ["scripts/AppController.ts", "8b177c42-50af-4c08-bbf8-4560ea125e38"],
]);

export async function ensureCocosMetadata(root = PROJECT_ASSETS) {
  const absoluteRoot = resolve(root);
  const entries = await walk(absoluteRoot);
  let written = 0;
  for (const path of entries) {
    if (path.endsWith(".meta")) continue;
    const info = await stat(path);
    const projectPath = normalize(relative(PROJECT_ASSETS, path));
    const meta = info.isDirectory()
      ? directoryMeta(projectPath)
      : await fileMeta(path, projectPath);
    if (!meta) continue;
    const current = await readExistingMeta(`${path}.meta`);
    if (current?.importer && current.importer !== "*" && current.uuid === meta.uuid) continue;
    await writeFile(`${path}.meta`, `${JSON.stringify(meta, null, 2)}\n`);
    written += 1;
  }
  return written;
}

async function readExistingMeta(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function walk(root) {
  const output = [];
  const visit = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      output.push(path);
      if (entry.isDirectory()) await visit(path);
    }
  };
  await visit(root);
  return output;
}

async function fileMeta(path, projectPath) {
  const extension = extname(path).toLowerCase();
  const uuid = assetUuid(projectPath);
  if (extension === ".ts") return baseMeta("4.0.23", "typescript", uuid, [], { simulateGlobals: [] });
  if (extension === ".scene") return baseMeta("1.1.35", "scene", uuid, [".json"]);
  if (extension === ".json") return baseMeta("1.0.0", "json", uuid, [".json"]);
  if (extension === ".mp3") return baseMeta("1.0.0", "audio-clip", uuid, [".mp3", ".json"], { downloadMode: 0 });
  if (extension === ".md") return baseMeta("1.0.1", "text", uuid, [".json"]);
  if (extension === ".png") return imageMeta(path, projectPath, uuid);
  return null;
}

function directoryMeta(projectPath) {
  return baseMeta("1.1.0", "directory", assetUuid(projectPath), [], {
    compressionType: {},
    isRemoteBundle: {},
  });
}

async function imageMeta(path, projectPath, uuid) {
  const { width, height } = await readPngSize(path);
  const displayName = basename(projectPath, extname(projectPath));
  return {
    ...baseMeta("1.0.22", "image", uuid, [".png", ".json"]),
    subMetas: {
      "6c48a": {
        importer: "texture",
        uuid: `${uuid}@6c48a`,
        displayName,
        id: "6c48a",
        name: "texture",
        ver: "1.0.21",
        imported: true,
        files: [".json"],
        subMetas: {},
        userData: {
          wrapModeS: "clamp-to-edge",
          wrapModeT: "clamp-to-edge",
          minfilter: "linear",
          magfilter: "linear",
          mipfilter: "none",
          premultiplyAlpha: false,
          anisotropy: 0,
          isUuid: true,
          imageUuidOrDatabaseUri: uuid,
        },
      },
      "f9941": {
        ver: "1.0.9",
        importer: "sprite-frame",
        uuid: `${uuid}@f9941`,
        imported: true,
        files: [".json"],
        subMetas: {},
        userData: {
          wrapModeS: "repeat",
          wrapModeT: "repeat",
          minfilter: "linear",
          magfilter: "linear",
          mipfilter: "none",
          premultiplyAlpha: false,
          anisotropy: 1,
          trimType: "auto",
          trimThreshold: 1,
          rotated: false,
          offsetX: 0,
          offsetY: 0,
          trimX: 0,
          trimY: 0,
          width,
          height,
          rawWidth: width,
          rawHeight: height,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          isUuid: true,
          imageUuidOrDatabaseUri: `${uuid}@6c48a`,
          atlasUuid: "",
          packable: true,
        },
        displayName,
        id: "f9941",
        name: "spriteFrame",
      },
    },
    userData: {
      type: "sprite-frame",
      redirect: `${uuid}@f9941`,
      hasAlpha: true,
    },
  };
}

function baseMeta(ver, importer, uuid, files, userData = {}) {
  return { ver, importer, imported: true, uuid, files, subMetas: {}, userData };
}

async function readPngSize(path) {
  const bytes = await readFile(path);
  if (bytes.length < 24 || bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a") {
    throw new Error(`Invalid PNG asset: ${path}`);
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function assetUuid(projectPath) {
  const normalized = normalize(projectPath);
  const override = UUID_OVERRIDES.get(normalized);
  if (override) return override;
  const digest = createHash("sha256").update(`thinking-house-cocos:${normalized}`).digest("hex");
  return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-5${digest.slice(13, 16)}-8${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
}

function normalize(path) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}
