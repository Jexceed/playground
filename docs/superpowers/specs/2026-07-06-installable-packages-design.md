# Installable Packages Design

## Goal

Package 小小思考屋 so it can run as a copyable NAS static app first, a Docker-served static app when necessary, and a macOS installable app through Tauri, without tying deployment code to the game logic.

## Architecture

The shared artifact is a generated static release package. `pnpm build` creates `dist/`; a release script copies that output into `release/nas-static/`, adds a deployment-owned `content/` directory, and writes release metadata. NAS native static hosting, Docker fallback, and Tauri all consume built static files instead of importing `src/data/games.ts`.

## Content Boundary

The first phase keeps the current TypeScript question bank as built-in default content. The release package still includes `content/manifest.json` and `content/README.md` so future content packs have a stable deployment-owned location. Full question-bank JSON migration is a separate follow-up because it needs schema validation and curriculum audit changes.

## Deployment Paths

NAS native static deployment is the first path: copy or upload the generated package into any static web or open application entry available on the ZSpace device. Docker is fallback only and serves static files through Nginx. Mac packaging uses Tauri configuration pointed at the same frontend build output.

## Verification

The implementation must prove release generation with automated tests, then run `pnpm build`, `pnpm audit:curriculum`, and `pnpm test:release`.
