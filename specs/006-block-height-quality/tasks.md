# Tasks: Block-Height Logic Quality

**Input**: Design documents from `specs/006-block-height-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/block-height-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/006-block-height-quality/quickstart.md`
- [x] T002 [P] Review current `logic-block-height-map` rounds and record rewrite targets in `specs/006-block-height-quality/data-model.md`
- [x] T003 [P] Review current grid/visual token coverage for numeric height maps in `src/data/games.ts`

---

## Phase 2: Foundational

**Purpose**: Block-height audit helpers and red test.

- [x] T004 Add block-height audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-block-height-map` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current block-height content

**Checkpoint**: The audit catches the intended block-height quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Total-Count Maps Explain The Digits (Priority: P1)

**Goal**: Total-count rounds explain numeric height cells through row totals and final totals.

**Independent Test**: Review total-count rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite total-count success feedback to name row totals and final totals in `src/data/games.ts`
- [x] T008 [US1] Rewrite total-count retry and parent prompts to emphasize adding numbers rather than counting cells in `src/data/games.ts`
- [x] T009 [US1] Review total-count numeric choices for answer correctness and nearby distractors in `src/data/games.ts`
- [x] T010 [US1] Verify total-count rounds pass block-height audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Compare-Map Rounds Are Structurally Valid (Priority: P1)

**Goal**: Compare rounds name both map totals and use child-facing comparison choices.

**Independent Test**: Review compare rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite compare choice labels and answers to use explicit left/right/same comparison labels in `src/data/games.ts`
- [x] T012 [US2] Rewrite compare success, retry, and parent prompts to name left total, right total, then comparison in `src/data/games.ts`
- [x] T013 [US2] Review compare map totals and choices for accidental ambiguity in `src/data/games.ts`
- [x] T014 [US2] Verify compare rounds pass block-height audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Block-Height Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed block-height text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update block-height quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record block-height work in `docs/CHANGELOG.md`
- [x] T020 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T021 Run `pnpm build`
- [x] T022 Run `pnpm audit:curriculum`
- [x] T023 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1 and US2 both depend on the red audit from Phase 2.
- US3 depends on text changes from US1 and US2.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T018, T019, and T020 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add block-height audit checks and verify they fail on current content.
2. Rewrite total-count height-map rounds.
3. Rewrite compare-map choices and explanations.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit and commit a local checkpoint.
