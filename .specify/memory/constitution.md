<!--
Sync Impact Report
Version change: 1.1.0 -> 1.1.1
Modified principles:
- Project Constraints: clarify user-confirmed 启蒙/探索 navigation within one app
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- Checked .specify/templates/plan-template.md: no age-specific wording
- Checked .specify/templates/spec-template.md: no age-specific wording
- Checked .specify/templates/tasks-template.md: no age-specific wording
Follow-up TODOs: none
-->

# 小小思考屋 Constitution

## Core Principles

### I. Child-Centered Learning Integrity

Every feature, question, asset, and interaction MUST serve parent-child thinking
practice for preschool and early-primary children. Existing younger-child
activities remain available; new challenges initially target ages 6–8 through
observed play calibration. The product is not a worksheet, score chase, or
marketing site. Prompts, visuals, choices, feedback, and parent guidance MUST be
coherent, concrete, and explainable. Distractors MUST represent plausible child
misunderstandings or weaker strategies, not trick wording or unrelated noise.

### II. Spec-Driven Delivery

Non-trivial work MUST start with a Spec Kit feature under `specs/`. A feature
MUST define user value, requirements, acceptance scenarios, affected assets, and
verification before implementation proceeds. Implementation plans and task lists
MUST keep code, content, assets, docs, and validation traceable to the spec.
Reference-based expansion MUST distinguish source inventory, skill-family
coverage, independent answer verification, and observed child play. Repeated
pages, answer books, and screenshots MUST NOT inflate unique activity counts.

### III. Auditable Local Assets

Runtime visuals and voice lines MUST be local, registered, and auditable. Image
assets MUST follow the taxonomy `brand`, `characters`, `items`, and `scenes`.
Scene images MUST be 1200x675 PNG files registered through `imageGallery.scenes`.
Voice assets MUST be generated from exported voice lines and validated against
the manifest. Browser TTS and inline SVG are fallbacks, not the target state.

### IV. Verification Before Completion

No change is complete until fresh verification evidence exists. At minimum,
project-impacting changes MUST run `pnpm build` and `pnpm audit:curriculum`.
Asset moves MUST also prove all registered files exist. Documentation-only
changes MUST still be checked for stale paths, conflicting source-of-truth
claims, and unresolved placeholders.

### V. Documentation As Product Infrastructure

Project docs are maintained artifacts, not scratch notes. `AGENTS.md`,
`.specify/memory/constitution.md`, `docs/`, and `specs/` MUST stay consistent.
Historical or exploratory notes MUST be archived under `docs/archive/` when they
stop being the source of truth. Each meaningful change MUST update
`docs/CHANGELOG.md` and, when follow-up remains, `docs/TODO.md`.

## Project Constraints

- Application stack: React, TypeScript, Vite, and pnpm.
- Keep one application with explicit 启蒙 and 探索 entry points, followed by
  themes and activity groups. Existing content belongs to 启蒙; the source-aligned
  expansion belongs to 探索. Lists, progress displays and resume locations are
  separate; engines and assets remain shared. Do not expose V1/V2 labels or
  create permanent age-based code forks. This clarifies the user's product
  distinction without creating another application.
- Source alignment for the expanded curriculum is governed by
  `specs/029-curriculum-benchmark/`; raw reference materials are design inputs,
  not automatically approved runtime content.
- Preserve local-asset, explanation, and parent-child principles across number,
  logic, spatial, memory, language, and everyday inquiry activities. Open-ended
  speech and physical tasks may use parent observation, not invented automated
  correctness scores.
- Age and old L1–L6 labels do not prove validated developmental difficulty.
- Preserve stable activity identities and migrate progress without fabricating
  unknown historical attempts, hints, or mastery.
- Core data files: `src/data/games.ts` and `src/data/imageGallery.ts`.
- Core runtime component files: `src/games/ProgressiveSetGame.tsx`,
  `src/components/VisualToken.tsx`, `src/App.tsx`, and `src/styles.css`.
- Public image assets live under `public/images/` and MUST be registered before
  use by game content.
- Public voice assets live under `public/audio/` and MUST be regenerated after
  wording changes that affect prompts, choices, feedback, or parent guidance.

## Development Workflow

1. Capture non-trivial work in `specs/<number>-<feature>/spec.md`.
2. Create or update `plan.md` and `tasks.md` before implementation.
3. Keep each task small enough to verify independently.
4. Update docs and asset registries in the same change as code or content.
5. Run verification commands and record important outcomes in the final report.
6. Keep work-in-progress on `dev`; push `main` only for confirmed milestones.

## Governance

This constitution supersedes conflicting project practices. Amendments require a
documented reason, a semantic version bump, and updates to dependent templates
or docs in the same change. Major version changes redefine principles or remove
governance. Minor version changes add or materially expand principles. Patch
version changes clarify wording without changing obligations.

**Version**: 1.1.1 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-09-22
