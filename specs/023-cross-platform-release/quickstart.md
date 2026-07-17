# Quickstart: Validate the Desktop Release

## Prerequisites

- Node.js 22 and pnpm 11.7
- Rust stable with `aarch64-apple-darwin` on an Apple Silicon Mac
- Project dependencies installed with `pnpm install --frozen-lockfile`
- GitHub Actions enabled for the repository

## 1. Validate repository release configuration

```bash
pnpm test:desktop-release
pnpm release:validate -- --tag v0.1.0
pnpm build
pnpm audit:curriculum
```

Expected result: all commands exit successfully, all three source version fields
equal `0.1.0`, and the tag argument equals `v0.1.0`.

## 2. Validate the local Mac bundle and installed application

```bash
pnpm mac:build
pnpm mac:install
open "/Applications/小小思考屋.app"
```

Expected result: Tauri creates an ARM64 `.app`, installation replaces the local
application, and the installed app opens with bundled images, audio, progress,
and launch behavior intact.

## 3. Exercise the GitHub workflow without publishing a normal release

1. Ensure the three version fields match the intended version.
2. Commit and push the confirmed source revision.
3. Create and push the matching tag, for example `v0.1.0`, or run the workflow
   manually with an existing `release_tag`.
4. Observe the validation job, followed by concurrent macOS and Windows builds.
5. Confirm the final release is marked **Pre-release** and contains:
   - `小小思考屋_0.1.0_macOS-arm64.dmg`
   - `小小思考屋_0.1.0_Windows-x64-setup.exe`

Expected failure behavior: if any gate or platform build fails, the GitHub
release remains a draft and is not presented as a completed public release.

## 4. Audit release evidence

From the release page and linked workflow run, verify:

- tag and source revision;
- matching application version;
- successful build and curriculum audit;
- both expected assets;
- pre-release status;
- plain-language signing and installation warnings.

Production signing, notarization, automatic updates, Intel Mac, Windows ARM, and
application store publication are intentionally outside this quickstart.
