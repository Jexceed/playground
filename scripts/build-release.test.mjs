import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseScript = path.join(repoRoot, "scripts", "build-release.mjs");

test("fails with an actionable message when dist is missing", async () => {
  const fixture = await createFixtureRoot();
  try {
    const result = runRelease(fixture.root);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /pnpm build/);
  } finally {
    await fixture.cleanup();
  }
});

test("generates a NAS static package from dist without importing game logic", async () => {
  const fixture = await createFixtureRoot();
  try {
    await createDist(fixture.root);

    const result = runRelease(fixture.root);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const outputDir = path.join(fixture.root, "release", "nas-static");
    await assertPath(path.join(outputDir, "index.html"));
    await assertPath(path.join(outputDir, "assets", "app.js"));
    await assertPath(path.join(outputDir, "images", "brand", "logo.png"));
    await assertPath(path.join(outputDir, "audio", "voice-lines.json"));
    await assertPath(path.join(outputDir, "content", "manifest.json"));
    await assertPath(path.join(outputDir, "content", "README.md"));
    await assertPath(path.join(outputDir, "release-manifest.json"));
    const archivePath = path.join(fixture.root, "release", "thinking-island-nas-static-9.8.7-test.zip");
    await assertPath(archivePath);
    assertArchiveDoesNotContainFinderMetadata(archivePath);
    await assertMissing(path.join(outputDir, ".DS_Store"));
    await assertMissing(path.join(outputDir, "images", ".DS_Store"));
    await assertMissing(path.join(outputDir, "images", "scenes", "source"));

    const contentManifest = JSON.parse(
      await readFile(path.join(outputDir, "content", "manifest.json"), "utf8"),
    );
    assert.equal(contentManifest.schemaVersion, 1);
    assert.equal(contentManifest.appContentMode, "built-in-default");
    assert.equal(contentManifest.phase, "boundary-placeholder");

    const releaseManifest = JSON.parse(await readFile(path.join(outputDir, "release-manifest.json"), "utf8"));
    assert.equal(releaseManifest.name, "thinking-island");
    assert.equal(releaseManifest.version, "9.8.7-test");
    assert.equal(releaseManifest.contentDir, "content");
    assert.deepEqual(releaseManifest.requiredPaths.sort(), [
      "assets",
      "audio",
      "content",
      "images",
      "index.html",
    ]);

    const scriptSource = await readFile(releaseScript, "utf8");
    assert.doesNotMatch(scriptSource, /src\/data\/games|from ["']\.\.\/src|import\(.*src/);
  } finally {
    await fixture.cleanup();
  }
});

async function createFixtureRoot() {
  const root = await mkdtemp(path.join(tmpdir(), "thinking-island-release-"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ name: "thinking-island", version: "9.8.7-test" }, null, 2),
  );
  return {
    root,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

async function createDist(root) {
  await mkdir(path.join(root, "dist", "assets"), { recursive: true });
  await mkdir(path.join(root, "dist", "images", "brand"), { recursive: true });
  await mkdir(path.join(root, "dist", "images", "scenes", "source"), { recursive: true });
  await mkdir(path.join(root, "dist", "audio"), { recursive: true });
  await writeFile(path.join(root, "dist", "index.html"), "<main>小小思考屋</main>");
  await writeFile(path.join(root, "dist", "assets", "app.js"), "console.log('app');");
  await writeFile(path.join(root, "dist", "images", "brand", "logo.png"), "png");
  await writeFile(path.join(root, "dist", "audio", "voice-lines.json"), "{}");
  await writeFile(path.join(root, "dist", ".DS_Store"), "finder");
  await writeFile(path.join(root, "dist", "images", ".DS_Store"), "finder");
  await writeFile(path.join(root, "dist", "images", "scenes", "source", "scene-source.png"), "source");
}

function runRelease(root) {
  return spawnSync(process.execPath, [releaseScript, "--root", root], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function assertArchiveDoesNotContainFinderMetadata(archivePath) {
  const result = spawnSync("unzip", ["-l", archivePath], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(result.stdout, /\.DS_Store|__MACOSX/);
  assert.doesNotMatch(result.stdout, /\/source\//);
  assert.match(result.stdout, /nas-static\/index\.html/);
}

async function assertPath(targetPath) {
  const info = await stat(targetPath);
  assert.ok(info.isFile() || info.isDirectory(), `${targetPath} should exist`);
}

async function assertMissing(targetPath) {
  await assert.rejects(() => stat(targetPath), { code: "ENOENT" });
}
