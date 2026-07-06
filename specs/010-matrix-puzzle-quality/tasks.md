# Tasks: Matrix-Puzzle Logic Quality

**Input**: Design documents from `specs/010-matrix-puzzle-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/matrix-puzzle-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/010-matrix-puzzle-quality/quickstart.md`
- [x] T002 [P] Review current `logic-matrix-puzzle` rounds and record rewrite targets in `specs/010-matrix-puzzle-quality/data-model.md`
- [x] T003 [P] Review existing matrix and visual-token format in `src/data/games.ts` and `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Matrix-puzzle audit helpers and red test.

- [x] T004 Add matrix-puzzle audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-matrix-puzzle` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current matrix-puzzle content

**Checkpoint**: The audit catches the intended matrix-puzzle quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Matrix Answers Follow Visible Row Rules (Priority: P1)

**Goal**: Matrix answers are computed from visible row rules and choices are distinct plausible mistakes.

**Independent Test**: Review matrix-puzzle rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Ensure each matrix case has a recognized visible row rule in `src/data/games.ts`
- [x] T008 [US1] Review choices for answer correctness, uniqueness, and plausible rule mistakes in `src/data/games.ts`
- [x] T009 [US1] Verify matrix answers and choices pass matrix-puzzle audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Feedback Preserves Explainable Row Examples (Priority: P1)

**Goal**: Success, retry, and parent prompts support row-by-row explanation.

**Independent Test**: Review wording and run `pnpm audit:curriculum`.

- [x] T010 [US2] Rewrite matrix-puzzle prompt and instruction to use child-friendly empty-cell wording in `src/data/games.ts`
- [x] T011 [US2] Rewrite success feedback to name example rows, missing row, and answer in `src/data/games.ts`
- [x] T012 [US2] Rewrite retry and parent prompts to ask for the same rule across rows in `src/data/games.ts`
- [x] T013 [US2] Verify feedback wording passes matrix-puzzle audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Matrix-Puzzle Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed matrix-puzzle text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T014 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T015 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T016 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T017 [P] Update matrix-puzzle quality guidance in `docs/build-generation-guide.md`
- [x] T018 [P] Record matrix-puzzle work in `docs/CHANGELOG.md`
- [x] T019 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T020 Run `pnpm build`
- [x] T021 Run `pnpm audit:curriculum`
- [x] T022 Run `git diff --check`
- [x] T023 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1 and US2 both depend on the red audit from Phase 2.
- US3 depends on text changes from US1 and US2.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T017, T018, and T019 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add matrix-puzzle audit checks and verify they fail on current content.
2. Review answer derivation and choice quality.
3. Rewrite prompt, success feedback, retry guidance, and parent prompts.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit/diff checks and commit a local checkpoint.
