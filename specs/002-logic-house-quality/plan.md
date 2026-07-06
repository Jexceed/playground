# Implementation Plan: Logic House Quality

**Branch**: `002-logic-house-quality` | **Date**: 2026-07-04 | **Spec**: `specs/002-logic-house-quality/spec.md`

**Input**: Feature specification from `specs/002-logic-house-quality/spec.md`

## Summary

Improve “逻辑屋” through a quality-gate-first slice: expand curriculum audit
coverage for the user's four rules, then rewrite a focused primitive
logic-house content cluster so graph, text, choices, feedback, parent guidance,
and voice lines remain coherent and verifiable.

The first content slice will target `logic-sorter-switch` because it is a compact
rules-and-classification cluster with simple visual cards, no new scene assets
required, and clear opportunities to verify option validity, rule switching,
and child-friendly feedback.

## Technical Context

**Language/Version**: TypeScript 5.8 with React 19 and Vite 7 for the app; Node
ES modules for project scripts

**Primary Dependencies**: React, Vite, TypeScript, pnpm, local public assets,
existing curriculum data model, existing voice-line export/generation scripts

**Storage**: Local repository files under `src/`, `scripts/`, `public/`, `docs/`,
and `specs/`

**Testing**: `pnpm build`, `pnpm audit:curriculum`, `pnpm export:voice-lines`,
and targeted inspection of changed logic-house rounds

**Target Platform**: Browser-based single-page application with local assets and
local/generated voice files

**Project Type**: Frontend app with local curriculum and media assets

**Performance Goals**: Curriculum audit remains fast enough for routine local
use; content changes do not add runtime network dependencies

**Constraints**: Preserve existing math behavior; keep logic-house changes
child-friendly for 4-year-old parent-child play; prefer local auditable assets;
browser TTS remains fallback only

**Scale/Scope**: One audit script, one focused logic-house game cluster,
voice-line export/manifest alignment, and maintained documentation updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: pass. The feature exists to enforce
  coherent prompts, visuals, choices, feedback, difficulty, and parent guidance.
- Spec-driven traceability: pass. Work is scoped by this spec, plan, design
  artifacts, and tasks.
- Auditable local assets: pass. No new image assets are required for the first
  slice; voice changes must be exported and validated against the manifest.
- Verification before completion: pass. Required commands are `pnpm build`,
  `pnpm audit:curriculum`, and `pnpm export:voice-lines` after wording changes.
- Documentation hygiene: pass. `docs/build-generation-guide.md`,
  `docs/CHANGELOG.md`, and `docs/TODO.md` are in scope.

## Project Structure

### Documentation (this feature)

```text
specs/002-logic-house-quality/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── curriculum-audit-report.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs          # strengthen curriculum quality checks

src/
└── data/
    └── games.ts                  # rewrite focused logic-house rounds

public/
└── audio/
    ├── voice-lines.json          # regenerated after text changes
    └── voice/manifest.json       # validated against voice lines

docs/
├── build-generation-guide.md     # document new quality/audit rules
├── CHANGELOG.md                  # record completed user-visible change
└── TODO.md                       # record follow-up logic-house work
```

**Structure Decision**: Keep changes inside existing data, script, audio, docs,
and specs boundaries. Do not add new top-level directories or UI surfaces for
this slice.

## Phase 0: Research

See `research.md`.

## Phase 1: Design And Contracts

See `data-model.md`, `contracts/curriculum-audit-report.md`, and
`quickstart.md`.

## Post-Design Constitution Check

- Child-centered learning integrity: pass. The design turns the user's quality
  rules into audit findings and concrete content rewrite criteria.
- Spec-driven traceability: pass. Tasks can map directly to FR-001 through
  FR-012 and quickstart validation.
- Auditable local assets: pass. The first content target uses existing visual
  cards; text changes require voice-line export and manifest validation.
- Verification before completion: pass. Quickstart names build, audit, and
  voice-line checks.
- Documentation hygiene: pass. Docs and TODO updates are required before
  completion.

## Complexity Tracking

No constitution violations.
