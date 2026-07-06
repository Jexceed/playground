# Tasks: Difference-Detective Logic Quality

**Input**: Design documents from `specs/005-difference-detective-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/difference-detective-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/005-difference-detective-quality/quickstart.md`
- [x] T002 [P] Review current `logic-difference-detective` rounds and record rewrite targets in `specs/005-difference-detective-quality/data-model.md`
- [x] T003 [P] Review current visual token coverage in `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Difference-detective audit helpers and red test.

- [x] T004 Add difference-detective audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-difference-detective` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current difference-detective content

**Checkpoint**: The audit catches the intended difference-detective quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Changed Items Are Traceable (Priority: P1)

**Goal**: Changed-item rounds clearly identify one changed position, the old item, and the new item.

**Independent Test**: Review changed-item rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite changed-item success feedback to name changed positions in `src/data/games.ts`
- [x] T008 [US1] Rewrite changed-item retry and parent prompts to support full left/right explanations in `src/data/games.ts`
- [x] T009 [US1] Review changed-item choices for answer correctness and plausible distractors in `src/data/games.ts`
- [x] T010 [US1] Verify changed-item rounds pass difference-detective audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - More/Less Choices Are Valid And Child-Friendly (Priority: P1)

**Goal**: Extra and missing rounds prove shared items first, then name the extra or missing item.

**Independent Test**: Review extra/missing rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite extra-item success, retry, and parent prompts to confirm shared items before the extra item in `src/data/games.ts`
- [x] T012 [US2] Rewrite missing-item success, retry, and parent prompts to confirm shared items before the missing item in `src/data/games.ts`
- [x] T013 [US2] Review extra/missing choices for accidental ambiguity and adjust labels or reasons in `src/data/games.ts`
- [x] T014 [US2] Verify extra/missing rounds pass difference-detective audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Difference-Detective Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed difference-detective text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update difference-detective quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record difference-detective work in `docs/CHANGELOG.md`
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

1. Add difference-detective audit checks and verify they fail on current content.
2. Rewrite changed-item comparison rounds.
3. Rewrite extra and missing item rounds.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit and commit a local checkpoint.
