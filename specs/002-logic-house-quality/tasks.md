# Tasks: Logic House Quality

**Input**: Design documents from `specs/002-logic-house-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/curriculum-audit-report.md`, `quickstart.md`

**Tests**: No separate test framework is introduced. Each story includes
verification commands or review steps because the user requires every task to be
verified.

**Organization**: Tasks are grouped by user story so each story can be verified
independently.

## Phase 1: Setup

**Purpose**: Establish the current state and prepare quality criteria.

- [x] T001 Record the current curriculum audit baseline for this feature in `specs/002-logic-house-quality/quickstart.md`
- [x] T002 [P] Review current `logic-sorter-switch` rounds and note concrete rewrite targets in `specs/002-logic-house-quality/data-model.md`
- [x] T003 [P] Review existing forbidden wording and visual checks in `scripts/audit-curriculum.mjs`

---

## Phase 2: Foundational

**Purpose**: Shared audit helpers required before story work.

- [x] T004 Add reusable child-friendly text normalization helpers in `scripts/audit-curriculum.mjs`
- [x] T005 Add reusable logic-house round context helpers in `scripts/audit-curriculum.mjs`
- [x] T006 Verify existing curriculum still passes before stricter checks are enabled with `pnpm audit:curriculum`

**Checkpoint**: Audit infrastructure is ready for story-specific quality gates.

---

## Phase 3: User Story 1 - Logic Tasks Have Strong Quality Gates (Priority: P1)

**Goal**: The curriculum audit catches logic-house quality problems that violate
the user's graph-text-audio, option quality, child-friendliness, and verification
rules.

**Independent Test**: Run `pnpm audit:curriculum`; the report follows
`contracts/curriculum-audit-report.md` and reports zero problems after fixes.

- [x] T007 [US1] Add duplicate and repeated-meaning choice checks in `scripts/audit-curriculum.mjs`
- [x] T008 [US1] Add child-unfriendly choice wording checks in `scripts/audit-curriculum.mjs`
- [x] T009 [US1] Add logic-house feedback and parent-prompt explainability checks in `scripts/audit-curriculum.mjs`
- [x] T010 [US1] Add logic-house difficulty-note consistency checks in `scripts/audit-curriculum.mjs`
- [x] T011 [US1] Verify audit failure messages include game and round context in `scripts/audit-curriculum.mjs`
- [x] T012 [US1] Run `pnpm audit:curriculum` and use its findings to define required content fixes in `src/data/games.ts`

**Checkpoint**: US1 is complete when stricter audit gates pass after any required
content fixes.

---

## Phase 4: User Story 2 - Primitive Logic Content Is Reworked Into Child-Friendly Rounds (Priority: P1)

**Goal**: `logic-sorter-switch` becomes a clearer parent-child classification
and rule-switching experience with coherent visuals, valid distractors, and
explainable feedback.

**Independent Test**: Review only `logic-sorter-switch` in `src/data/games.ts`
against the quickstart checklist, then run `pnpm audit:curriculum`.

- [x] T013 [US2] Rewrite `logic-sorter-switch` prompts and instructions in `src/data/games.ts`
- [x] T014 [US2] Rewrite `logic-sorter-switch` choices so each wrong answer is a plausible child mistake in `src/data/games.ts`
- [x] T015 [US2] Rewrite `logic-sorter-switch` success and retry feedback to point back to visible rules in `src/data/games.ts`
- [x] T016 [US2] Rewrite `logic-sorter-switch` parent prompts and ability tags for reason-giving in `src/data/games.ts`
- [x] T017 [US2] Verify `logic-sorter-switch` has no duplicate labels, values, or repeated meanings with `pnpm audit:curriculum`

**Checkpoint**: US2 is complete when the changed game is independently playable
and the audit passes.

---

## Phase 5: User Story 3 - Voice Lines Stay Synchronized With Rewritten Content (Priority: P2)

**Goal**: Changed logic-house text is reflected in voice-line exports and the
local voice manifest is validated or has an explicit recorded blocker.

**Independent Test**: Run `pnpm export:voice-lines` and `pnpm audit:curriculum`;
voice-line source and manifest comparison passes, or a documented blocker
records why local voice generation is deferred.

- [x] T018 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T019 [US3] Regenerate or validate local voice manifest entries in `public/audio/voice/manifest.json`
- [x] T020 [US3] Record any deferred voice generation blocker in `docs/TODO.md`
- [x] T021 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

**Checkpoint**: US3 is complete when voice text and manifest state are
synchronized or explicitly documented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification across the feature.

- [x] T022 [P] Update logic-house quality rules in `docs/build-generation-guide.md`
- [x] T023 [P] Record completed changes in `docs/CHANGELOG.md`
- [x] T024 [P] Record remaining logic-house follow-up work in `docs/TODO.md`
- [x] T025 Run `pnpm build`
- [x] T026 Run `pnpm audit:curriculum`
- [x] T027 Review changed files and ensure no unrelated work was modified with `git status --short`

---

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before US1.
- US1 should complete before US2 so content rewrites are guided by audit rules.
- US3 depends on US2 text changes.
- Polish depends on US1, US2, and US3.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T022, T023, and T024 can run in parallel after story work is complete.
- Within implementation, audit script edits should stay sequential because they
  touch the same file.

## Implementation Strategy

1. MVP: complete US1 so the repo enforces stronger logic-house quality gates.
2. Next: complete US2 by rewriting `logic-sorter-switch` under those gates.
3. Then: complete US3 so graph, text, and audio stay synchronized.
4. Finish with docs and required verification commands.
