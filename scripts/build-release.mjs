import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDir, "..");

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = path.resolve(options.root ?? defaultRoot);
  const sourceBuildDir = path.resolve(root, options.source ?? "dist");
  const outputDir = path.resolve(root, options.out ?? path.join("release", "nas-static"));

  await assertBuildOutput(sourceBuildDir);
  const packageInfo = await readPackageInfo(root);

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(path.dirname(outputDir), { recursive: true });
  await cp(sourceBuildDir, outputDir, {
    recursive: true,
    filter: (source) => shouldCopyReleasePath(source, sourceBuildDir),
  });
  await writeContentBoundary(outputDir);
  await writeReleaseManifest({
    outputDir,
    packageInfo,
    sourceBuildDir,
    root,
  });
  const archivePath = await writeReleaseArchive({ outputDir, packageInfo, root });

  console.log(`NAS static release written to ${path.relative(root, outputDir)}`);
  console.log(`NAS static archive written to ${path.relative(root, archivePath)}`);
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root" || arg === "--source" || arg === "--out") {
      const value = args[index + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      options[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

async function assertBuildOutput(sourceBuildDir) {
  try {
    const info = await stat(sourceBuildDir);
    if (!info.isDirectory()) throw new Error("not a directory");
  } catch {
    throw new Error(`Missing production build at ${sourceBuildDir}. Run pnpm build before pnpm release:nas.`);
  }

  try {
    const info = await stat(path.join(sourceBuildDir, "index.html"));
    if (!info.isFile()) throw new Error("not a file");
  } catch {
    throw new Error(`Invalid production build at ${sourceBuildDir}: index.html is missing. Run pnpm build again.`);
  }
}

async function readPackageInfo(root) {
  const packageJsonPath = path.join(root, "package.json");
  const raw = await readFile(packageJsonPath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    name: parsed.name ?? "thinking-island",
    version: parsed.version ?? "0.0.0",
  };
}

async function writeContentBoundary(outputDir) {
  const contentDir = path.join(outputDir, "content");
  await mkdir(contentDir, { recursive: true });
  const manifest = {
    schemaVersion: 1,
    phase: "boundary-placeholder",
    appContentMode: "built-in-default",
    notes: [
      "Current question data is compiled into the app.",
      "Future JSON catalogs should be placed under this directory.",
    ],
  };
  await writeFile(path.join(contentDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    path.join(contentDir, "README.md"),
    [
      "# Content Package Boundary",
      "",
      "This directory is owned by deployment and future content packages.",
      "",
      "The current release still uses the built-in TypeScript question bank as the default content.",
      "Images and audio are packaged as static assets beside this directory.",
      "A future content migration can place validated JSON catalogs here without changing NAS or Mac packaging.",
      "",
    ].join("\n"),
  );
}

async function writeReleaseManifest({ outputDir, packageInfo, sourceBuildDir, root }) {
  const manifest = {
    name: packageInfo.name,
    version: packageInfo.version,
    generatedAt: new Date().toISOString(),
    sourceBuildDir: path.relative(root, sourceBuildDir) || ".",
    outputDir: path.relative(root, outputDir) || ".",
    contentDir: "content",
    requiredPaths: ["index.html", "assets", "images", "audio", "content"],
  };
  await writeFile(path.join(outputDir, "release-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function writeReleaseArchive({ outputDir, packageInfo, root }) {
  const releaseDir = path.dirname(outputDir);
  const archiveName = `${packageInfo.name}-nas-static-${sanitizeVersion(packageInfo.version)}.zip`;
  const archivePath = path.join(releaseDir, archiveName);
  await rm(archivePath, { force: true });

  const result = spawnSync(
    "zip",
    ["-qry", archiveName, path.basename(outputDir), "-x", "*.DS_Store", "__MACOSX/*"],
    {
      cwd: releaseDir,
      encoding: "utf8",
    },
  );

  if (result.status !== 0) {
    throw new Error(`Failed to create NAS static archive: ${result.stderr || result.stdout || "zip exited with error"}`);
  }

  return archivePath;
}

function sanitizeVersion(version) {
  return String(version).replace(/[^0-9A-Za-z._-]/g, "-");
}

function shouldCopyReleasePath(source, sourceBuildDir) {
  if (path.basename(source) === ".DS_Store") return false;
  const relative = path.relative(sourceBuildDir, source).split(path.sep);
  return !(relative[0] === "images" && relative.includes("source"));
}
