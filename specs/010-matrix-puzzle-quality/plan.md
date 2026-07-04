# Implementation Plan: Matrix-Puzzle Logic Quality

**Branch**: `010-matrix-puzzle-quality` | **Date**: 2026-07-04 | **Spec**: `specs/010-matrix-puzzle-quality/spec.md`

**Input**: Feature specification from `specs/010-matrix-puzzle-quality/spec.md`

## Summary

Continue logic-house quality work by tightening audit checks and rewriting the
`logic-matrix-puzzle` cluster. The slice verifies answers from visible matrix
row rules, then improves feedback so each round names an example row, the
missing row, and the final answer. Local voice lines and maintained docs stay
aligned.

## Technical Context

**Language/Version**: TypeScript 5.8 with React 19 and Vite 7 for app code;
Node ES modules for project scripts

**Primary Dependencies**: React, Vite, TypeScript, pnpm, existing curriculum data
model, existing matrix rendering, existing Edge voice generation scripts

**Storage**: Local repository files under `src/`, `scripts/`, `public/`,
`docs/`, and `specs/`

**Testing**: `pnpm audit:curriculum`, `pnpm export:voice-lines`, local voice
manifest generation/validation, `pnpm build`, targeted matrix-puzzle review,
and `git diff --check`

**Target Platform**: Browser-based single-page application with local visual
tokens, matrix surfaces, and generated local audio

**Project Type**: Frontend app with local curriculum and media assets

**Performance Goals**: Keep audit fast enough for local use; do not add runtime
network dependencies or new asset-loading paths

**Constraints**: Keep previous `数字岛` and logic-house cluster work unchanged;
avoid new images because the existing pattern-puzzle scene and visual tokens
support this cluster

**Scale/Scope**: One audit script, one logic-house content cluster, voice-line
export/manifest alignment, and maintained docs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: pass. The feature focuses on visible,
  pointable row examples and avoids guessing.
- Spec-driven traceability: pass. Work is scoped by this spec, plan, tasks, and
  verification artifacts.
- Auditable local assets: pass. Existing visual tokens and scene surfaces are
  used; voice changes are exported and generated locally.
- Verification before completion: pass. Required checks are `pnpm build`,
  `pnpm audit:curriculum`, voice-line export, manifest validation, and
  whitespace checking.
- Documentation hygiene: pass. Changelog, TODO, and build-generation guide are
  in scope.

## Project Structure

### Documentation (this feature)

```text
specs/010-matrix-puzzle-quality/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── matrix-puzzle-audit-report.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs          # add matrix-puzzle quality findings

src/
└── data/
    └── games.ts                  # rewrite logic-matrix-puzzle cluster

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

See `data-model.md`, `contracts/matrix-puzzle-audit-report.md`, and
`quickstart.md`.

## Post-Design Constitution Check

- Child-centered learning integrity: pass. The design makes matrix rules
  concrete, row-based, and explainable.
- Spec-driven traceability: pass. Requirements map to task phases and audit
  findings.
- Auditable local assets: pass. Existing visual tokens and scene surfaces remain
  the visual source; local audio is regenerated after text changes.
- Verification before completion: pass. Quickstart names all required commands
  and expected outputs.
- Documentation hygiene: pass. Docs updates are required before final checks.

## Complexity Tracking

No constitution violations.
