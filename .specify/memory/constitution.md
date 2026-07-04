<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Child-Centered Learning Integrity
- Template principle 2 -> II. Spec-Driven Delivery
- Template principle 3 -> III. Auditable Local Assets
- Template principle 4 -> IV. Verification Before Completion
- Template principle 5 -> V. Documentation As Product Infrastructure
Added sections:
- Project Constraints
- Development Workflow
Removed sections:
- Placeholder template sections
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: none
-->

# 小小思考屋 Constitution

## Core Principles

### I. Child-Centered Learning Integrity

Every feature, question, asset, and interaction MUST serve parent-child thinking
practice for a preschool child. The product is not a worksheet, score chase, or
marketing site. Prompts, visuals, choices, feedback, and parent guidance MUST be
coherent, concrete, and explainable. Distractors MUST represent plausible child
misunderstandings or weaker strategies, not trick wording or unrelated noise.

### II. Spec-Driven Delivery

Non-trivial work MUST start with a Spec Kit feature under `specs/`. A feature
MUST define user value, requirements, acceptance scenarios, affected assets, and
verification before implementation proceeds. Implementation plans and task lists
MUST keep code, content, assets, docs, and validation traceable to the spec.

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

**Version**: 1.0.0 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-07-04
