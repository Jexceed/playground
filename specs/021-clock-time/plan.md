# Implementation Plan: Clock-Time Reading

**Branch**: `021-clock-time` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/021-clock-time/spec.md`

## Summary

Add a new 数字岛 game, 时钟小管家, for analog clock reading and scene-based
12-hour to 24-hour conversion. The implementation adds a structured clock
visual surface to the existing progressive-set round model, renders it inside
the current game flow, creates twelve child-friendly rounds, and extends the
curriculum audit so weak clock content is rejected.

## Technical Context

**Language/Version**: TypeScript with React and Vite

**Primary Dependencies**: Existing React app, TypeScript compiler, pnpm, current
curriculum audit script, existing local voice export/generation scripts

**Storage**: Local repository files under `src/`, `scripts/`, `public/`,
`docs/`, and `specs/`; browser localStorage behavior is unchanged

**Testing**: `pnpm audit:curriculum`, `pnpm export:voice-lines`, local voice
manifest validation, `pnpm build`, `git diff --check`, and `pnpm mac:install`

**Target Platform**: Browser SPA, NAS static package, and Tauri-wrapped Mac app
through existing build paths

**Project Type**: Frontend single-page app with built-in TypeScript question
bank and local media assets

**Performance Goals**: Clock surfaces render inline with no network fetches and
no measurable delay in normal round navigation

**Constraints**: Keep the first pass scoped to whole hours, half hours, and
scene-based 24-hour conversion; do not introduce five-minute increments,
elapsed-time math, or a new content-pack format

**Scale/Scope**: One new math game, one new structured round surface, twelve
rounds, audit coverage, voice-line regeneration, docs, and Mac install

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Child-centered learning integrity: pass. The content uses concrete hand
  evidence and daily routines, with plausible distractors rather than trick
  wording.
- Spec-driven traceability: pass. Requirements, plan, data model, quickstart,
  tasks, docs, and verification are linked to this feature.
- Auditable local assets: pass. No new image files are needed; changed spoken
  text is exported and validated as local audio.
- Verification before completion: pass. Required commands include
  `pnpm build`, `pnpm audit:curriculum`, voice export/manifest checks,
  `git diff --check`, and `pnpm mac:install`.
- Documentation hygiene: pass. Changelog and TODO updates are in scope.

## Project Structure

### Documentation (this feature)

```text
specs/021-clock-time/
├── spec.md
├── checklists/
│   └── requirements.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/
│   └── clock-audit-report.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── types.ts                         # add clock surface data type
├── data/
│   └── games.ts                     # add 时钟小管家 game and rounds
├── games/
│   └── ProgressiveSetGame.tsx       # render clock board and option cues
└── styles.css                       # style clock board responsively

scripts/
└── audit-curriculum.mjs             # add clock-game quality checks

public/
└── audio/
    ├── voice-lines.json
    └── voice/manifest.json

docs/
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: Extend the existing TypeScript question bank and
progressive-set renderer. Do not introduce a new top-level app section or
content pack format; generated scene images are used only for the daily-context
conversion rounds, while clock graphics stay deterministic.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design And Contracts

See [data-model.md](./data-model.md),
[contracts/clock-audit-report.md](./contracts/clock-audit-report.md), and
[quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Child-centered learning integrity: pass. The designed rounds require the child
  to explain either hand position or scene-based 24-hour conversion evidence.
- Spec-driven traceability: pass. User stories map to task phases and audit
  checks.
- Auditable local assets: pass. Clock visuals are local deterministic renderings
  and voice lines are regenerated.
- Verification before completion: pass. Quickstart names all required commands
  and expected outcomes.
- Documentation hygiene: pass. Maintained docs updates are required before final
  verification.

## Complexity Tracking

No constitution violations.
