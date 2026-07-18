# Implementation Plan: Cross-Platform Desktop Release

**Branch**: `dev` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/023-cross-platform-release/spec.md`

## Summary

Add a repeatable GitHub release pipeline for the existing Tauri 2 desktop shell.
One version tag will build a macOS Apple Silicon DMG on an ARM64 macOS runner and
a Windows x64 NSIS installer on a Windows runner. Both jobs upload clearly named
assets to one cleaned draft pre-release using stable ASCII download names and
Chinese display labels; a dependent finalization job publishes the pre-release
only after both builds and all quality gates succeed. Local macOS build and
installation commands remain available.

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 22 LTS, Rust stable, GitHub Actions YAML

**Primary Dependencies**: React 19, Vite 7, Tauri 2.11, `tauri-apps/tauri-action@v1`

**Storage**: Static bundled files plus GitHub Release metadata; no application
data-store changes

**Testing**: Node.js built-in test runner, release configuration validation,
TypeScript/Vite production build, curriculum audit, Tauri macOS bundle build

**Target Platform**: macOS Apple Silicon (`aarch64-apple-darwin`) and Windows
10/11 x64 (`x86_64-pc-windows-msvc`)

**Project Type**: React/Vite single-page app wrapped as a Tauri desktop application

**Performance Goals**: Both platform jobs start concurrently after one validation
job and complete without manual artifact transfer

**Constraints**: Initial CI packages are unsigned or ad-hoc signed and therefore
must remain visibly marked as pre-release builds; Intel Mac, Windows ARM/32-bit,
automatic updates, and app stores are out of scope; local `pnpm mac:install`
behavior must be preserved

**Scale/Scope**: One application, two release packages, one GitHub Release, and
one source tag per version

## Constitution Check

*GATE: Passed before Phase 0 and re-checked after Phase 1.*

- **Child-centered learning integrity — PASS**: The change affects packaging only;
  game content, interaction, feedback, and parent guidance remain unchanged.
- **Spec-driven traceability — PASS**: `spec.md`, this plan, research, contract,
  quickstart, tasks, implementation, docs, and validation are kept under the
  existing feature and project boundaries.
- **Auditable local assets — PASS**: No image or voice assets change. Existing
  bundled icons and local runtime media are reused.
- **Verification before completion — PASS**: Validation includes
  `pnpm build`, `pnpm audit:curriculum`, release configuration tests,
  `pnpm mac:build`, and `pnpm mac:install`.
- **Documentation hygiene — PASS**: `docs/deployment.md`,
  `docs/build-generation-guide.md`, `docs/CHANGELOG.md`, and `docs/TODO.md`
  are part of the implementation tasks.

## Phase 0: Research

Technical decisions and rejected alternatives are recorded in
[research.md](./research.md). All technical unknowns are resolved.

## Phase 1: Design

- Release state and validation rules: [data-model.md](./data-model.md)
- Workflow interface and artifact contract:
  [contracts/desktop-release.md](./contracts/desktop-release.md)
- End-to-end validation guide: [quickstart.md](./quickstart.md)

The design uses explicit platform bundle arguments rather than a single global
bundle target, because DMG and NSIS are platform-specific. A draft release is
prepared and cleared before the matrix build, platform assets are uploaded
independently with GitHub-stable filenames, and a final job publishes the
pre-release only after every required job succeeds.

### Post-design Constitution Check

All five gates remain passed. The design introduces no content or runtime asset
changes, keeps the existing local macOS flow, and adds explicit verification and
documentation work.

## Project Structure

### Documentation (this feature)

```text
specs/023-cross-platform-release/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── desktop-release.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── desktop-release.yml
scripts/
├── validate-desktop-release.mjs
└── desktop-release.test.mjs
src-tauri/
└── tauri.conf.json
package.json
docs/
├── deployment.md
├── build-generation-guide.md
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: Keep one React/Vite/Tauri application. Add only release
automation and validation files at established repository boundaries; do not
create a second desktop project or duplicate frontend assets.

## Complexity Tracking

No constitution violations require exceptions.
