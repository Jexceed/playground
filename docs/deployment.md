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

This directory is safe to copy as a complete static site package. It contains built app files, images, audio, `content/`, and `release-manifest.json`.

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

## Mac Installable App

Mac packaging uses Tauri 2 and consumes the same Vite build output.

Prerequisites:

- Rust toolchain installed from `https://rustup.rs/`
- Xcode Command Line Tools installed
- Project dependencies installed with `pnpm install`

Development app:

```bash
pnpm mac:dev
```

Build installable app/bundle:

```bash
pnpm mac:build
```

The Tauri config runs `pnpm build` and points `frontendDist` to `../dist`, following the Tauri v2 Vite integration model.

## Verification

Before treating packaging work as complete, run:

```bash
pnpm build
pnpm audit:curriculum
pnpm test:release
```
