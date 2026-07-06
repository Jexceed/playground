# Implementation Plan: Map Visual Surface Quality

**Branch**: `dev` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/015-map-visual-surface-quality/spec.md`

## Summary

Spatial map rounds must present one authoritative surface for answers. The
implementation adds red/green audit coverage for conflicting scene-plus-grid
surfaces and nested address-grid cards, removes positional scene images from the
affected spatial rounds, and renders map cells with flat icon-and-label tokens.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Node.js ESM scripts

**Primary Dependencies**: React, Vite, TypeScript, existing local visual glyph
system

**Storage**: Static source files and public assets

**Testing**: `pnpm audit:curriculum`, `pnpm build`, browser visual smoke check,
`git diff --check`

**Target Platform**: Browser single-page app

**Project Type**: Web application

**Performance Goals**: No new runtime data fetching; map render remains static
and responsive

**Constraints**: Keep existing answer logic and voice text unchanged unless
directly required by the visual-surface fix

**Scale/Scope**: Three spatial game clusters and shared progressive game grid
renderer

## Constitution Check

- Child-centered learning integrity: Pass. The change removes ambiguous spatial
  evidence and simplifies pointable map cells.
- Spec-driven traceability: Pass. Spec, plan, tasks, quickstart, and docs are
  part of this feature.
- Auditable local assets: Pass. No new assets; scene references are removed
  from affected rounds, and audit guards the rule.
- Verification before completion: Pass. Plan includes `pnpm build`,
  `pnpm audit:curriculum`, browser visual check, and whitespace check.
- Documentation hygiene: Pass. `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` will be updated.

## Project Structure

### Documentation (this feature)

```text
specs/015-map-visual-surface-quality/
├── checklists/requirements.md
├── contracts/map-visual-surface-audit-report.md
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
├── data/games.ts
├── games/ProgressiveSetGame.tsx
└── styles.css

docs/
├── CHANGELOG.md
├── TODO.md
└── build-generation-guide.md
```

**Structure Decision**: Reuse existing content, audit, component, style, docs,
and specs boundaries. No new top-level application area or asset category is
needed.

## Complexity Tracking

No constitution violations.
