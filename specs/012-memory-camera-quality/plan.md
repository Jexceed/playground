# Implementation Plan: Memory-Camera Logic Quality

**Branch**: `012-memory-camera-quality` | **Date**: 2026-07-05 | **Spec**: `specs/012-memory-camera-quality/spec.md`

**Input**: Feature specification from `specs/012-memory-camera-quality/spec.md`

## Summary

Continue logic-house quality work by tightening audit checks and rewriting the
`logic-memory-camera` cluster. The slice verifies appeared answers from visible
memory cards, absent answers through exclusion, and order answers from the
left-to-right sequence. Feedback is improved so each round asks the child to
recall or replay the visible cards and explain why. Local voice lines and
maintained docs stay aligned.

## Technical Context

**Language/Version**: TypeScript 5.8 with React 19 and Vite 7 for app code;
Node ES modules for project scripts

**Primary Dependencies**: React, Vite, TypeScript, pnpm, existing curriculum data
model, existing memory rendering, existing visual-token aliases, existing Edge
voice generation scripts

**Storage**: Local repository files under `src/`, `scripts/`, `public/`,
`docs/`, and `specs/`

**Testing**: `pnpm audit:curriculum`, `pnpm export:voice-lines`, local voice
manifest generation/validation, `pnpm build`, targeted memory-camera review,
and `git diff --check`

**Target Platform**: Browser-based single-page application with local memory
surfaces, visual tokens, and generated local audio

**Project Type**: Frontend app with local curriculum and media assets

**Performance Goals**: Keep audit fast enough for local use; do not add runtime
network dependencies or new asset-loading paths

**Constraints**: Keep previous `数字岛` and logic-house cluster work unchanged;
avoid new images because the existing memory surface and visual tokens support
this cluster

**Scale/Scope**: One audit script, one logic-house content cluster, voice-line
export/manifest alignment, and maintained docs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: pass. The feature focuses on visible,
  repeatable memory cards and avoids random guessing.
- Spec-driven traceability: pass. Work is scoped by this spec, plan, tasks, and
  verification artifacts.
- Auditable local assets: pass. Existing visual-token surfaces are used; voice
  changes are exported and generated locally.
- Verification before completion: pass. Required checks are `pnpm build`,
  `pnpm audit:curriculum`, voice-line export, manifest validation, and
  whitespace checking.
- Documentation hygiene: pass. Changelog, TODO, and build-generation guide are
  in scope.

## Project Structure

### Documentation (this feature)

```text
specs/012-memory-camera-quality/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── memory-camera-audit-report.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
scripts/
└── audit-curriculum.mjs          # add memory-camera quality findings

src/
└── data/
    └── games.ts                  # rewrite logic-memory-camera cluster

public/
└── audio/
    ├── voice-lines.json
    └── voice/manifest.json

docs/
├── build-generation-guide.md
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: Keep work inside existing audit, curriculum data,
audio, docs, and specs boundaries. Do not add a new UI, route, or asset
category.

## Phase 0: Research

See `research.md`.

## Phase 1: Design And Contracts

See `data-model.md`, `contracts/memory-camera-audit-report.md`, and
`quickstart.md`.

## Post-Design Constitution Check

- Child-centered learning integrity: pass. The design makes recognition,
  exclusion, and order replay concrete and explainable.
- Spec-driven traceability: pass. Requirements map to task phases and audit
  findings.
- Auditable local assets: pass. Existing visual surfaces remain the source;
  local audio is regenerated after text changes.
- Verification before completion: pass. Quickstart names all required commands
  and expected outputs.
- Documentation hygiene: pass. Docs updates are required before final checks.

## Complexity Tracking

No constitution violations.
