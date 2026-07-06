# Implementation Plan: Visual Choice And Session Memory

**Branch**: `dev` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/016-visual-choice-session-memory/spec.md`

## Summary

Improve two repeated visual-density issues and add session restoration. The
implementation adds red audit checks, introduces compact visual-choice and flat
matrix-cell renderers, and extends storage with a validated last-play location.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Node.js ESM scripts

**Primary Dependencies**: React, Vite, TypeScript, existing visual glyph and
localStorage storage helpers

**Storage**: Browser `localStorage` for progress and last play location

**Testing**: `pnpm audit:curriculum`, `pnpm build`, browser reload visual checks,
`git diff --check`

**Target Platform**: Browser single-page app

**Project Type**: Web application

**Performance Goals**: No network calls; restoring last location happens during
initial React state setup

**Constraints**: Preserve existing game answers, progress data, and speech text

**Scale/Scope**: Shared progressive game renderer, app selection state, storage
helpers, and audit script

## Constitution Check

- Child-centered learning integrity: Pass. The change reduces repeated visual
  surfaces and improves continued play.
- Spec-driven traceability: Pass. Spec, plan, tasks, quickstart, and docs are
  included.
- Auditable local assets: Pass. No new assets; audit checks enforce renderer
  and storage behavior.
- Verification before completion: Pass. Plan includes `pnpm build`,
  `pnpm audit:curriculum`, browser visual/reload checks, and whitespace check.
- Documentation hygiene: Pass. Maintained docs will be updated.

## Project Structure

### Documentation (this feature)

```text
specs/016-visual-choice-session-memory/
├── checklists/requirements.md
├── contracts/visual-choice-session-audit-report.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs

src/
├── App.tsx
├── games/ProgressiveSetGame.tsx
├── storage.ts
├── styles.css
└── types.ts

docs/
├── CHANGELOG.md
├── TODO.md
└── build-generation-guide.md
```

**Structure Decision**: Extend existing storage, renderer, and audit files. No
new runtime dependency or top-level source folder is needed.

## Complexity Tracking

No constitution violations.
