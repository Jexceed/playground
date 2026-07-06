# Tasks: Three-View Block Logic Quality

**Input**: Design documents from `specs/007-three-view-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/three-view-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/007-three-view-quality/quickstart.md`
- [x] T002 [P] Review current `logic-three-view-blocks` rounds and record rewrite targets in `specs/007-three-view-quality/data-model.md`
- [x] T003 [P] Review existing three-view helper and grid answer format in `src/data/games.ts`

---

## Phase 2: Foundational

**Purpose**: Three-view audit helpers and red test.

- [x] T004 Add three-view audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-three-view-blocks` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current three-view content

**Checkpoint**: The audit catches the intended three-view quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Top-View Rounds Count Positions, Not Layers (Priority: P1)

**Goal**: Top-view rounds explain visible positions and empty zero cells.

**Independent Test**: Review top-view rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite top-view success feedback to name non-zero positions and final count in `src/data/games.ts`
- [x] T008 [US1] Rewrite top-view retry and parent prompts to emphasize pointing to non-zero and zero cells in `src/data/games.ts`
- [x] T009 [US1] Review top-view numeric choices for answer correctness and nearby distractors in `src/data/games.ts`
- [x] T010 [US1] Verify top-view rounds pass three-view audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Front-View Rounds Use Column Maximums (Priority: P1)

**Goal**: Front-view rounds name column maximums and final answer sequences.

**Independent Test**: Review front-view rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite front-view success feedback to name column maximums and final answer in `src/data/games.ts`
- [x] T012 [US2] Rewrite front-view retry and parent prompts to emphasize reading columns without adding in `src/data/games.ts`
- [x] T013 [US2] Review front-view answer choices for correctness, uniqueness, and plausible distractors in `src/data/games.ts`
- [x] T014 [US2] Verify front-view rounds pass three-view audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Left-View Rounds Use Row Maximums (Priority: P1)

**Goal**: Left-view rounds name row maximums and final answer sequences.

**Independent Test**: Review left-view rounds and run `pnpm audit:curriculum`.

- [x] T015 [US3] Rewrite left-view success feedback to name row maximums and final answer in `src/data/games.ts`
- [x] T016 [US3] Rewrite left-view retry and parent prompts to emphasize reading rows from the left without adding in `src/data/games.ts`
- [x] T017 [US3] Review left-view answer choices for correctness, uniqueness, and plausible distractors in `src/data/games.ts`
- [x] T018 [US3] Verify left-view rounds pass three-view audit with `pnpm audit:curriculum`

---

## Phase 6: User Story 4 - Three-View Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed three-view text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T019 [US4] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T020 [US4] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T021 [US4] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T022 [P] Update three-view quality guidance in `docs/build-generation-guide.md`
- [x] T023 [P] Record three-view work in `docs/CHANGELOG.md`
- [x] T024 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T025 Run `pnpm build`
- [x] T026 Run `pnpm audit:curriculum`
- [x] T027 Run `git diff --check`
- [x] T028 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1, US2, and US3 all depend on the red audit from Phase 2.
- US4 depends on text changes from US1, US2, and US3.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T022, T023, and T024 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add three-view audit checks and verify they fail on current content.
2. Rewrite top-view position-count rounds.
3. Rewrite front-view column-maximum rounds.
4. Rewrite left-view row-maximum rounds.
5. Regenerate voice lines and voice manifest.
6. Run final build/audit/diff checks and commit a local checkpoint.
