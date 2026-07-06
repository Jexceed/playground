# Quickstart: Installable Packages

## Prerequisites

- Node.js and pnpm are installed.
- Dependencies are installed with `pnpm install`.

## Generate NAS Static Package

```bash
pnpm build
pnpm release:nas
```

Expected result:

- `release/nas-static/index.html`
- `release/nas-static/assets/`
- `release/nas-static/images/`
- `release/nas-static/audio/`
- `release/nas-static/content/`
- `release/nas-static/release-manifest.json`

## Verify Release Script

```bash
pnpm test:release
```

Expected result: release tests pass and confirm missing-build and package-generation behavior.

## NAS Native Static Deployment

Use `docs/deployment.md`. The first path is copying `release/nas-static/` into any ZSpace native static web or open application entry available on the device. Use Docker only if the device has no native static hosting entry.

## Docker Fallback

```bash
docker compose up --build
```

Expected result: the app is available at `http://localhost:8080`.

## Mac Packaging

```bash
pnpm mac:build
```

Expected result: on a Mac with Rust and Tauri prerequisites, Tauri builds a macOS app bundle from the frontend build output.

Install on the current Mac:

```bash
pnpm mac:install
```

Expected result: `/Applications/小小思考屋.app` exists and passes local code-sign verification.

## Required Final Verification

```bash
pnpm build
pnpm audit:curriculum
pnpm test:release
```
