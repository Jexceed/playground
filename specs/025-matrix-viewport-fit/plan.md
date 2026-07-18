# Implementation Plan: Matrix Puzzle Viewport Fit

**Branch**: `dev` | **Date**: 2026-07-18 | **Spec**: `specs/025-matrix-viewport-fit/spec.md`

**Input**: Feature specification from `specs/025-matrix-viewport-fit/spec.md`

## Summary

Remove the redundant pattern-board scene from all `logic-matrix-puzzle` rounds
so the existing matrix becomes the sole evidence surface. Align the desktop
navigation height with the application shell inset, add a curriculum audit
guard, then verify all six rounds at desktop and mobile sizes before rebuilding
NAS and Mac deliverables.

## Technical Context

**Language/Version**: TypeScript 5.8, CSS, Node.js ESM

**Primary Dependencies**: React 19, Vite 7, existing browser test surface

**Storage**: N/A

**Testing**: Node curriculum audit, TypeScript/Vite build, browser DOM metrics

**Target Platform**: Web preview, NAS static release, macOS Tauri application

**Project Type**: React single-page application with desktop wrapper

**Performance Goals**: No new runtime work or assets

**Constraints**: Preserve matrix logic, token readability, answer order, and all
non-matrix game layouts

**Scale/Scope**: One six-round game, one audit rule, maintained documentation

## Constitution Check

- Child-centered learning integrity: pass; one evidence surface improves direct
  row comparison.
- Spec-driven traceability: pass; requirements and tasks live under feature 025.
- Auditable local assets: pass; no new assets or voice changes.
- Verification before completion: pass; build, curriculum, browser, NAS, and Mac
  checks are required.
- Documentation hygiene: pass; changelog, TODO, and generation guide are in scope.

## Project Structure

```text
specs/025-matrix-viewport-fit/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── matrix-viewport-audit.md
└── tasks.md

src/
├── data/games.ts
└── styles.css

scripts/
└── audit-curriculum.mjs

docs/
├── CHANGELOG.md
├── TODO.md
└── build-generation-guide.md
```

**Structure Decision**: Keep the repair within the existing content and audit
boundaries; no component abstraction or new asset is needed.

## Complexity Tracking

No constitution violations.
