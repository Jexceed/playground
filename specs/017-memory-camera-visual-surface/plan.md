# Implementation Plan: Memory Camera Visual Surface

**Branch**: `017-memory-camera-visual-surface` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-memory-camera-visual-surface/spec.md`

## Summary

Flatten `记忆小相机` memory slots so camera cells contain one visual surface
instead of a full visual card nested inside another card. Add source-level audit
coverage first, then replace `MemoryBoard` rendering with a flat token that
preserves speech labels and covered-state clarity.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19

**Primary Dependencies**: Vite, pnpm, existing `VisualGlyph`/`visualMetaFor`
helpers

**Storage**: N/A

**Testing**: `pnpm audit:curriculum`, `pnpm build`, browser DOM/visual checks

**Target Platform**: Browser SPA on desktop and mobile widths

**Project Type**: React + TypeScript + Vite single-page app

**Performance Goals**: No measurable runtime overhead beyond existing memory
round rendering

**Constraints**: No new assets; no prompt/answer/content rewrite; preserve
tap-to-hear behavior

**Scale/Scope**: One game cluster renderer path: `logic-memory-camera`

## Constitution Check

- Child-centered learning integrity: Pass. The change reduces visual ambiguity
  and keeps the parent-child memory task explainable.
- Spec-driven traceability: Pass. Requirements, tasks, docs, and verification
  are recorded under this feature.
- Auditable local assets: Pass. No new assets are introduced.
- Verification before completion: Pass. Plan names `pnpm build`,
  `pnpm audit:curriculum`, and browser checks.
- Documentation hygiene: Pass. `docs/CHANGELOG.md` and
  `docs/build-generation-guide.md` are included.

## Project Structure

### Documentation (this feature)

```text
specs/017-memory-camera-visual-surface/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── memory-camera-visual-audit-report.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs

src/
├── games/
│   └── ProgressiveSetGame.tsx
└── styles.css

docs/
├── CHANGELOG.md
└── build-generation-guide.md
```

**Structure Decision**: Keep the renderer change inside
`ProgressiveSetGame.tsx`, where `MemoryBoard` already lives. Keep the visual
contract in CSS and the regression guard in the existing curriculum audit.

## Complexity Tracking

No constitution violations.
