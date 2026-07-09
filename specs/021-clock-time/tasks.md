# Tasks: Clock-Time Reading

**Input**: Design documents from `specs/021-clock-time/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/clock-audit-report.md`, `quickstart.md`

**Tests**: TDD applies through the existing curriculum audit. Add audit checks
and confirm they fail before adding clock content or renderer support.

## Phase 1: Setup

**Purpose**: Establish baseline and locate integration points.

- [x] T001 Create Spec Kit artifacts in `specs/021-clock-time/`
- [x] T002 [P] Review current math game ordering and helper patterns in `src/data/games.ts`
- [x] T003 [P] Review current round renderer surface branching in `src/games/ProgressiveSetGame.tsx`
- [x] T004 [P] Review current curriculum audit content checks in `scripts/audit-curriculum.mjs`

---

## Phase 2: Foundational

**Purpose**: Add the red audit and shared clock surface type before content.

- [x] T005 Add clock challenge type definitions in `src/types.ts`
- [x] T006 Add missing-game and clock-round audit checks in `scripts/audit-curriculum.mjs`
- [x] T007 Run `pnpm audit:curriculum` and confirm it fails because `math-clock-time` is missing

---

## Phase 3: User Story 1 - Read Whole And Half Hours (Priority: P1)

**Goal**: A child can read whole-hour and half-hour analog clock faces from the
new 数字岛 game.

**Independent Test**: `pnpm audit:curriculum` confirms clock surfaces, valid
minutes, answer uniqueness, and hand-evidence wording for reading rounds.

- [x] T008 [US1] Add clock board rendering in `src/games/ProgressiveSetGame.tsx`
- [x] T009 [US1] Add responsive clock board styles in `src/styles.css`
- [x] T010 [US1] Add the `math-clock-time` game shell and first eight read-time rounds in `src/data/games.ts`
- [x] T011 [US1] Run `pnpm audit:curriculum` and confirm whole-hour/half-hour checks pass or report only conversion gaps

---

## Phase 4: User Story 2 - Convert Scene Clock Time To 24-Hour Time (Priority: P1)

**Goal**: The game includes daily routine rounds that convert a 12-hour analog
clock plus scene context into a 24-hour electronic clock answer.

**Independent Test**: `pnpm audit:curriculum` confirms at least four
time-conversion rounds with generated scene images, non-leaking pre-answer
text, `HH:MM` choices, and 24-hour conversion feedback.

- [x] T012 [US2] Add four time-conversion context rounds to `math-clock-time` in `src/data/games.ts`
- [x] T013 [US2] Tighten clock audit checks for time-conversion scene and 24-hour evidence in `scripts/audit-curriculum.mjs`
- [x] T014 [US2] Run `pnpm audit:curriculum` and confirm clock coverage passes
- [x] T026 [US2] Add generated 1200x675 scene images for all four time-conversion rounds and register them in `imageGallery.scenes`
- [x] T027 [US2] Adjust the clock-scene board layout so scene evidence and the deterministic clock remain readable together
- [x] T028 [US2] Tighten audit checks so time-conversion rounds require scene images while read-time rounds remain clock-only
- [x] T029 [US2] Replace day-part word choices with 24-hour `HH:MM` electronic clock choices
- [x] T030 [US2] Remove pre-answer day-part labels from the visible clock context surface
- [x] T031 [US2] Tighten audit checks so conversion rounds reject pre-answer 上午/下午/晚上 leakage

---

## Phase 5: User Story 3 - Explainability And Local Audio (Priority: P2)

**Goal**: Parent prompts and local audio stay aligned with clock wording.

**Independent Test**: Voice export/manifest and audit complete without missing,
extra, duplicate, or failed entries.

- [x] T015 [US3] Review and tighten success, retry, parent prompts, and difficulty notes in `src/data/games.ts`
- [x] T016 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T017 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T018 [US3] Run `pnpm audit:curriculum` and confirm voice synchronization

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and local install.

- [x] T019 [P] Record clock-time work in `docs/CHANGELOG.md`
- [x] T020 [P] Update remaining follow-up in `docs/TODO.md`
- [x] T021 Run `pnpm build`
- [x] T022 Run `pnpm audit:curriculum`
- [x] T023 Run `git diff --check`
- [x] T024 Run `pnpm mac:install`
- [x] T025 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must produce a red audit before renderer/content implementation.
- US1 and US2 both depend on the clock type and audit checks.
- US3 depends on final wording from US1 and US2.
- Polish depends on all user stories.

## Parallel Opportunities

- T002, T003, and T004 can run in parallel.
- T019 and T020 can run in parallel after content and voice work.
- Renderer and style tasks should stay coordinated because class names are
  shared.

## Implementation Strategy

1. Add the typed clock surface and audit checks.
2. Confirm the audit fails because the clock game is absent.
3. Render the clock surface and add whole-hour/half-hour rounds.
4. Add time-conversion context rounds and audit coverage.
5. Export/generate voice assets.
6. Update docs and run build, audit, whitespace, and Mac install checks.
