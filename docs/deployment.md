# Deployment And Packaging

小小思考屋 is a static React/Vite app. The preferred deployment artifact is a generated static package, not a development server.

## Build The Shared Release Package

Run:

```bash
pnpm build
pnpm release:nas
```

The package is generated at:

```text
release/nas-static/
```

The uploadable archive is generated at:

```text
release/thinking-island-nas-static-0.1.0.zip
```

The directory and zip are safe to copy as complete static site packages. They contain built app files, runtime images, audio, `content/`, and `release-manifest.json`.

## ZSpace NAS: Native Static Install First

Use this path when your ZSpace model or ZOS version exposes a native static web, open application, browser service, or similar app-entry feature.

1. Generate `release/nas-static/` on the Mac.
2. Upload or copy the full `release/nas-static/` directory to the NAS.
3. In the NAS static web/app-entry UI, select that directory as the site root.
4. Open the assigned local URL from a Mac, iPad, or phone on the same network.
5. For content-boundary updates, replace or remount the package's `content/` directory according to [docs/content-package.md](./content-package.md).

Do not run `pnpm dev`, `vite`, or Node.js on the NAS for this app. The NAS only needs to serve static files.

## ZSpace NAS: Docker Fallback

Use Docker only when the device does not provide a native static site/app-entry option.

Build and run locally or on NAS with Compose:

```bash
docker compose up --build
```

Default URL:

```text
http://localhost:8080
```

For NAS use, map port `8080` to any available NAS port. The Compose file mounts:

```text
./release/nas-static/content:/usr/share/nginx/html/content:ro
```

That lets a NAS operator update the content boundary without rebuilding the image. The container serves static files with Nginx and does not run Vite or import source game modules at runtime.

## Mac ARM64 Installable App

Mac packaging uses Tauri 2, targets Apple Silicon explicitly, and consumes the
same Vite build output. Intel Mac is not a supported target.

Prerequisites:

- Rust toolchain installed from `https://rustup.rs/`
- Xcode Command Line Tools installed
- An Apple Silicon Mac
- Project dependencies installed with `pnpm install`

Development app:

```bash
pnpm mac:dev
```

`pnpm mac:dev` is useful for quick Tauri shell debugging, but it is not the
final Mac preview path. For Mac development review, build a real `.app` bundle
and open that bundle, because Dock icon handling, launch behavior, local file
paths, bundled assets, code signing, and Tauri production configuration can
differ from the browser/Vite dev server.

Build the previewable `.app` bundle:

```bash
pnpm mac:build
```

The command builds an ARM64 macOS `.app` bundle under:

```text
src-tauri/target/aarch64-apple-darwin/release/bundle/macos/小小思考屋.app
```

Preview the built app directly:

```bash
open "src-tauri/target/aarch64-apple-darwin/release/bundle/macos/小小思考屋.app"
```

Use this `.app` preview for Mac-specific checks before treating a change as
ready: launch splash, app icon, local audio playback, packaged images, saved
progress, and any behavior that depends on the Tauri wrapper. Browser preview
is still useful for layout iteration, but it is not enough for Mac app sign-off.

Optional DMG packaging can be attempted with:

```bash
pnpm mac:build:dmg
```

The DMG is written below
`src-tauri/target/aarch64-apple-darwin/release/bundle/dmg/`.

Install or update the app on the current Mac:

```bash
pnpm mac:install
```

This builds the `.app`, applies a local ad-hoc signature, and copies it to:

```text
/Applications/小小思考屋.app
```

After install, run the installed app for the final local check:

```bash
open "/Applications/小小思考屋.app"
```

The Tauri config runs `pnpm build` and points `frontendDist` to `../dist`, following the Tauri v2 Vite integration model.

## Windows x64 Installable App

Build Windows packages on a 64-bit Windows 10/11 machine or the configured
GitHub Actions Windows runner. Native Windows prerequisites are:

- Rust stable with the `x86_64-pc-windows-msvc` target
- Microsoft Visual Studio C++ Build Tools
- Node.js 22 and pnpm 11.7
- Project dependencies installed with `pnpm install --frozen-lockfile`

Build the NSIS setup executable:

```powershell
pnpm win:build
```

The installer is generated below:

```text
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

The installer uses Tauri's WebView2 download bootstrapper when WebView2 is not
already available. The current Windows package is not production-signed, so
SmartScreen can display an “unknown publisher” warning.

## GitHub Desktop Pre-Releases

`.github/workflows/desktop-release.yml` builds the two supported packages:

- `thinking-island-<version>-macos-arm64.dmg`
- `thinking-island-<version>-windows-x64-setup.exe`

GitHub can rewrite uploaded filenames containing non-alphanumeric characters.
The download filenames therefore use stable ASCII characters, while the release
page keeps the Chinese display labels `小小思考屋 macOS ARM64 安装包` and
`小小思考屋 Windows x64 安装包`.

The workflow accepts a pushed `v<major>.<minor>.<patch>` tag or a manual run with
an existing `release_tag`. Before creating packages, keep these three versions
identical:

- `package.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`

Validate the intended tag locally:

```bash
pnpm test:desktop-release
pnpm release:validate -- --tag v0.1.0
```

For a confirmed milestone, commit the source revision, create its matching tag,
and push the tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

To retry a draft from an existing tag with GitHub CLI:

```bash
gh workflow run desktop-release.yml -f release_tag=v0.1.0
```

The workflow creates or reuses one draft pre-release, builds macOS ARM64 on
`macos-15` and Windows x64 on `windows-2025`, clears any assets from an existing
draft by asset ID, refreshes the draft notes with the current workflow evidence,
uploads the two stable filenames with
`gh release upload --clobber`, and publishes only after exactly both required
assets exist. If validation or either build fails, the release remains a draft.
A published release for the same tag is never overwritten.

Until Apple notarization and Windows code-signing credentials are configured,
all automated desktop releases remain visibly marked as test pre-releases with
installation warnings. Do not describe them as production-trusted packages.

## Verification

Before treating packaging work as complete, run:

```bash
pnpm test:desktop-release
pnpm release:validate -- --tag v0.1.0
pnpm build
pnpm audit:curriculum
pnpm test:release
pnpm mac:build
pnpm mac:install
```

On a Mac development machine, also open the generated bundle at
`src-tauri/target/aarch64-apple-darwin/release/bundle/macos/小小思考屋.app` for
preview/testing. For release-style local validation, run `pnpm mac:install` and open
`/Applications/小小思考屋.app`.
