# Implementation Plan: Installable Packages

**Branch**: `dev` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/018-installable-packages/spec.md`

## Summary

Create a deployment layer that packages the existing React/Vite app without coupling packaging tools to game logic. The primary deliverable is a copyable NAS static release package with a documented `content/` boundary; Docker serves only as fallback, and Mac installation is configured through Tauri against the same frontend build output.

## Technical Context

**Language/Version**: TypeScript 5.8.3, Node.js scripts, React 19.1.0, Vite 7.0.0

**Primary Dependencies**: Existing Vite/React stack; Node built-in `node:test` for release script tests; Tauri CLI/config for macOS packaging

**Storage**: Static files under `dist/` and generated `release/`

**Testing**: `node --test`, `pnpm build`, `pnpm audit:curriculum`

**Target Platform**: Static web hosting on NAS, Docker fallback on NAS, macOS desktop packaging

**Project Type**: Frontend single-page app plus packaging scripts/configuration

**Performance Goals**: Generated package should be static-hostable with no server-side runtime and no Vite dev server in production

**Constraints**: Deployment scripts must not import `src/data/games.ts`; current built-in question bank remains default; NAS native static path is primary and Docker is fallback

**Scale/Scope**: One app, one static release package format, one Docker fallback, one macOS Tauri configuration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: Pass. The change preserves existing child-facing content and only packages the app.
- Spec-driven traceability: Pass. Requirements, tasks, docs, and verification are traced to this spec.
- Auditable local assets: Pass. The release package carries existing local assets and does not add unregistered assets.
- Verification before completion: Pass. Plan requires `pnpm build`, `pnpm audit:curriculum`, and release tests.
- Documentation hygiene: Pass. Plan updates docs and tracks JSON migration follow-up.

## Project Structure

### Documentation (this feature)

```text
specs/018-installable-packages/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── release-package.md
│   └── content-package.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
pnpm-lock.yaml
scripts/
├── build-release.mjs
└── build-release.test.mjs
docs/
├── deployment.md
├── content-package.md
├── CHANGELOG.md
└── TODO.md
Dockerfile
docker-compose.yml
nginx.conf
.dockerignore
src-tauri/
├── Cargo.toml
├── build.rs
├── tauri.conf.json
└── src/main.rs
```

**Structure Decision**: Keep packaging files at repository root because Docker and Tauri conventions expect them there. Put release logic in `scripts/` so it can be tested independently. Put user-facing deployment and content-boundary instructions under `docs/`.

## Complexity Tracking

No constitution violations.
