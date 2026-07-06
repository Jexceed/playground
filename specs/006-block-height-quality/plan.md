# Implementation Plan: Block-Height Logic Quality

**Branch**: `006-block-height-quality` | **Date**: 2026-07-04 | **Spec**: `specs/006-block-height-quality/spec.md`

**Input**: Feature specification from `specs/006-block-height-quality/spec.md`

## Summary

Continue logic-house quality work by tightening audit checks and rewriting the
`logic-block-height-map` cluster. The slice focuses on top-view height maps:
each total-count round must have a provable sum, row-total explanation, valid
numeric choices, and parent guidance; each compare-map round must state both
totals and use child-facing comparison choices. Local voice lines stay aligned.

## Technical Context

**Language/Version**: TypeScript 5.8 with React 19 and Vite 7 for app code;
Node ES modules for project scripts

**Primary Dependencies**: React, Vite, TypeScript, pnpm, existing curriculum data
model, existing grid/visual token rendering, existing Edge voice generation
scripts

**Storage**: Local repository files under `src/`, `scripts/`, `public/`, `docs/`,
and `specs/`

**Testing**: `pnpm audit:curriculum`, `pnpm export:voice-lines`, local voice
manifest generation/validation, `pnpm build`, and targeted block-height review

**Target Platform**: Browser-based single-page application with local grid
surfaces and generated local audio

**Project Type**: Frontend app with local curriculum and media assets

**Performance Goals**: Keep audit fast enough for local use; do not add runtime
network dependencies or new asset-loading paths

**Constraints**: Keep previous `数字岛` and logic-house cluster work unchanged;
avoid new images because existing grid and token surfaces support this cluster

**Scale/Scope**: One audit script, one logic-house content cluster, voice-line
export/manifest alignment, and maintained docs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: pass. The feature focuses on concrete,
  explainable row totals and comparison reasoning rather than abstract number
  guessing.
- Spec-driven traceability: pass. Work is scoped by this spec, plan, tasks, and
  verification artifacts.
- Auditable local assets: pass. Existing grid surfaces are used; voice changes
  are exported and generated locally.
- Verification before completion: pass. Required checks are `pnpm build`,
  `pnpm audit:curriculum`, voice-line export, and manifest validation.
- Documentation hygiene: pass. Changelog, TODO, and build-generation guide are
  in scope.

## Project Structure

### Documentation (this feature)

```text
specs/006-block-height-quality/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── block-height-audit-report.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs          # add block-height quality findings

src/
└── data/
    └── games.ts                  # rewrite logic-block-height-map cluster

public/
└── audio/
    ├── voice-lines.json
    └── voice/manifest.json

docs/
├── build-generation-guide.md
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: Keep work inside existing audit, curriculum data, audio,
docs, and specs boundaries. Do not add a new UI or asset category.

## Phase 0: Research

See `research.md`.

## Phase 1: Design And Contracts

See `data-model.md`, `contracts/block-height-audit-report.md`, and
`quickstart.md`.

## Post-Design Constitution Check

- Child-centered learning integrity: pass. The design makes height digits, row
  totals, map totals, and comparison results explicit.
- Spec-driven traceability: pass. Requirements map to task phases and audit
  findings.
- Auditable local assets: pass. Existing grid/token surfaces remain the visual
  source; local audio is regenerated after text changes.
- Verification before completion: pass. Quickstart names all required commands
  and expected outputs.
- Documentation hygiene: pass. Docs updates are required before final checks.

## Complexity Tracking

No constitution violations.
