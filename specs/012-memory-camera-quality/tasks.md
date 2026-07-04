# Tasks: Memory-Camera Logic Quality

**Input**: Design documents from `specs/012-memory-camera-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/memory-camera-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/012-memory-camera-quality/quickstart.md`
- [x] T002 [P] Review current `logic-memory-camera` rounds and record rewrite targets in `specs/012-memory-camera-quality/data-model.md`
- [x] T003 [P] Review existing memory and visual-token formats in `src/data/games.ts` and `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Memory-camera audit helpers and red test.

- [x] T004 Add memory-camera audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-memory-camera` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current memory-camera content

**Checkpoint**: The audit catches the intended memory-camera quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Appeared-Item Rounds Name The Remembered Cards (Priority: P1)

**Goal**: Appeared-item rounds compute answers from remembered cards and explain the remembered set.

**Independent Test**: Review appeared-item rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Verify appeared-item answers normalize to remembered cards in `src/data/games.ts`
- [x] T008 [US1] Rewrite appeared-item success, retry, and parent prompts to name remembered cards and answer in `src/data/games.ts`
- [x] T009 [US1] Review appeared-item choices for answer correctness, uniqueness, and plausible not-shown distractors in `src/data/games.ts`
- [x] T010 [US1] Verify appeared-item rounds pass memory-camera audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Absent-Item Rounds Support Exclusion (Priority: P1)

**Goal**: Absent-item rounds use remembered cards as distractors and name the excluded answer.

**Independent Test**: Review absent-item rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Verify absent answers are not in remembered cards and wrong choices are remembered cards in `src/data/games.ts`
- [x] T012 [US2] Rewrite absent-item success, retry, and parent prompts to name remembered cards and absent answer in `src/data/games.ts`
- [x] T013 [US2] Verify absent-item rounds pass memory-camera audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Order Rounds Preserve Left-To-Right Position (Priority: P1)

**Goal**: Order rounds compute answers from the requested left-to-right ordinal.

**Independent Test**: Review order rounds and run `pnpm audit:curriculum`.

- [x] T014 [US3] Verify order answers compute from memory item sequence in `src/data/games.ts`
- [x] T015 [US3] Rewrite order success, retry, and parent prompts to name sequence, ordinal, and answer in `src/data/games.ts`
- [x] T016 [US3] Verify order rounds pass memory-camera audit with `pnpm audit:curriculum`

---

## Phase 6: User Story 4 - Memory-Camera Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed memory-camera text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T017 [US4] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T018 [US4] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T019 [US4] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T020 [P] Update memory-camera quality guidance in `docs/build-generation-guide.md`
- [x] T021 [P] Record memory-camera work in `docs/CHANGELOG.md`
- [x] T022 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T023 Run `pnpm build`
- [x] T024 Run `pnpm audit:curriculum`
- [x] T025 Run `git diff --check`
- [x] T026 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1, US2, and US3 all depend on the red audit from Phase 2.
- US4 depends on text changes from US1, US2, and US3.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T020, T021, and T022 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add memory-camera audit checks and verify they fail on current content.
2. Rewrite appeared-item rounds.
3. Rewrite absent-item rounds.
4. Rewrite order rounds.
5. Regenerate voice lines and voice manifest.
6. Run final build/audit/diff checks and commit a local checkpoint.
