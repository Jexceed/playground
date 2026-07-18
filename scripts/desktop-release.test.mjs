import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const projectRoot = new URL("..", import.meta.url);
const validatorPath = new URL("./validate-desktop-release.mjs", import.meta.url);
const workflowPath = new URL(
  "../.github/workflows/desktop-release.yml",
  import.meta.url,
);

function readWorkflow() {
  return existsSync(workflowPath) ? readFileSync(workflowPath, "utf8") : "";
}

function readProjectJson(relativePath) {
  return JSON.parse(readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8"));
}

function runValidator(args, cwd = projectRoot) {
  return spawnSync(process.execPath, [validatorPath.pathname, ...args], {
    cwd,
    encoding: "utf8",
  });
}

async function withVersionFixture(versions, callback) {
  const root = await mkdtemp(join(tmpdir(), "desktop-release-"));

  try {
    mkdirSync(join(root, "src-tauri"), { recursive: true });
    writeFileSync(
      join(root, "package.json"),
      `${JSON.stringify({ version: versions.package }, null, 2)}\n`,
    );
    writeFileSync(
      join(root, "src-tauri", "tauri.conf.json"),
      `${JSON.stringify({ version: versions.tauri }, null, 2)}\n`,
    );
    writeFileSync(
      join(root, "src-tauri", "Cargo.toml"),
      `[package]\nname = "fixture"\nversion = "${versions.cargo}"\n`,
    );
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("release validator accepts a matching semantic version tag", () => {
  const result = runValidator(["--tag", "v0.1.0"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Desktop release version validated: v0\.1\.0/);
});

test("release validator rejects a tag that does not match source metadata", () => {
  const result = runValidator(["--tag", "v9.9.9"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match source version 0\.1\.0/);
});

test("release validator rejects malformed release tags", () => {
  const result = runValidator(["--tag", "release-0.1.0"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must use v<major>\.<minor>\.<patch>/);
});

test("release validator rejects inconsistent source versions", async () => {
  await withVersionFixture(
    { package: "0.1.0", tauri: "0.2.0", cargo: "0.1.0" },
    (root) => {
      const result = runValidator(["--root", root, "--tag", "v0.1.0"], root);

      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Version mismatch/);
      assert.match(result.stderr, /tauri\.conf\.json=0\.2\.0/);
    },
  );
});

test("desktop release supports tag pushes and manual existing-tag runs", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /release_tag:[\s\S]*required:\s*true/);
  assert.match(workflow, /push:[\s\S]*tags:[\s\S]*v\*\.\*\.\*/);
  assert.match(workflow, /ref:\s*\$\{\{\s*env\.RELEASE_TAG\s*\}\}/);
});

test("desktop release validates before a two-platform native matrix", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /validate:[\s\S]*pnpm test:desktop-release/);
  assert.match(workflow, /validate:[\s\S]*pnpm build/);
  assert.match(workflow, /validate:[\s\S]*pnpm audit:curriculum/);
  assert.match(workflow, /build:[\s\S]*needs:\s*\[validate,\s*prepare\]/);
  assert.match(workflow, /runner:\s*macos-15/);
  assert.match(workflow, /target:\s*aarch64-apple-darwin/);
  assert.match(workflow, /bundle:\s*dmg/);
  assert.match(workflow, /runner:\s*windows-2025/);
  assert.match(workflow, /target:\s*x86_64-pc-windows-msvc/);
  assert.match(workflow, /bundle:\s*nsis/);
  assert.match(workflow, /uses:\s*tauri-apps\/tauri-action@v1/);
});

test("desktop release remains draft until every platform asset is verified", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /prepare:[\s\S]*--draft[\s\S]*--prerelease/);
  assert.match(workflow, /finalize:[\s\S]*needs:\s*\[validate,\s*prepare,\s*build\]/);
  assert.match(workflow, /Verify required release assets/);
  assert.match(workflow, /gh release edit[\s\S]*--draft=false[\s\S]*--prerelease/);
});

test("local build scripts target only the requested desktop architectures", () => {
  const packageJson = readProjectJson("package.json");

  assert.match(
    packageJson.scripts["mac:build"],
    /--bundles app --target aarch64-apple-darwin/,
  );
  assert.match(
    packageJson.scripts["mac:build:dmg"],
    /--bundles dmg --target aarch64-apple-darwin/,
  );
  assert.equal(
    packageJson.scripts["win:build"],
    "tauri build --bundles nsis --target x86_64-pc-windows-msvc",
  );
  assert.match(
    packageJson.scripts["mac:sign"],
    /target\/aarch64-apple-darwin\/release\/bundle\/macos/,
  );
  assert.match(
    packageJson.scripts["mac:install"],
    /target\/aarch64-apple-darwin\/release\/bundle\/macos/,
  );
});

test("release assets identify product, version, OS, and architecture", () => {
  const workflow = readWorkflow();

  assert.match(
    workflow,
    /小小思考屋_\[version\]_macOS-arm64\[ext\]/,
  );
  assert.match(
    workflow,
    /小小思考屋_\[version\]_Windows-x64-setup\[ext\]/,
  );
  assert.doesNotMatch(workflow, /(?:arm64|setup)\.\[ext\]/);
  assert.match(workflow, /asset_name: 小小思考屋_\[version\]_macOS-arm64\.dmg/);
  assert.match(
    workflow,
    /asset_name: 小小思考屋_\[version\]_Windows-x64-setup\.exe/,
  );
  assert.match(workflow, /小小思考屋_\$\{VERSION\}_macOS-arm64\.dmg/);
  assert.match(
    workflow,
    /小小思考屋_\$\{VERSION\}_Windows-x64-setup\.exe/,
  );
});

test("release notes explain supported computers and test-signing warnings", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /Apple 芯片 Mac/);
  assert.match(workflow, /64 位 Windows 10\/11/);
  assert.match(workflow, /Intel 芯片 Mac[\s\S]*暂不支持/);
  assert.match(workflow, /macOS 安装包使用临时签名，尚未经过 Apple 公证/);
  assert.match(workflow, /Windows 安装包尚未使用商业代码签名证书/);
  assert.match(workflow, /Windows SmartScreen/);
});

test("release retries reuse drafts but reject completed releases", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /GH_REPO:\s*\$\{\{\s*github\.repository\s*\}\}/);
  assert.match(workflow, /gh release view "\$\{RELEASE_TAG\}" --json isDraft,isPrerelease/);
  assert.match(workflow, /is_draft[\s\S]*is_prerelease/);
  assert.match(workflow, /already exists and is not a draft pre-release/);
  assert.match(workflow, /Reusing existing draft pre-release/);
  assert.match(workflow, /ASSET_NAME: \$\{\{ matrix\.asset_name \}\}/);
  assert.match(workflow, /asset_name="\$\{ASSET_NAME\/\\\[version\\\]\/\$\{VERSION\}\}"/);
  assert.match(workflow, /legacy_asset_name="\$\{asset_name%\.\*\}\.\.\$\{asset_name##\*\.\}"/);
  assert.match(workflow, /gh release delete-asset[\s\S]*--yes/);
});

test("release evidence records the validated tag, revision, checks, and signing status", () => {
  const workflow = readWorkflow();

  assert.match(workflow, /git rev-parse "refs\/tags\/\$\{RELEASE_TAG\}\^\{commit\}"/);
  assert.match(workflow, /Checked out revision does not match/);
  assert.match(workflow, /源标签：\\`\$\{RELEASE_TAG\}\\`/);
  assert.match(workflow, /源提交：\\`\$\{REVISION\}\\`/);
  assert.match(workflow, /前端构建、课程审计、发布配置测试均已通过/);
  assert.match(workflow, /签名状态：macOS 临时签名；Windows 未签名/);
  assert.match(workflow, /GITHUB_STEP_SUMMARY/);
});
