# Tasks: Position-Map Logic Quality

**Input**: Design documents from `specs/011-position-map-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/position-map-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/011-position-map-quality/quickstart.md`
- [x] T002 [P] Review current `logic-position-map` rounds and record rewrite targets in `specs/011-position-map-quality/data-model.md`
- [x] T003 [P] Review existing grid, visual-group, and direction formats in `src/data/games.ts`

---

## Phase 2: Foundational

**Purpose**: Position-map audit helpers and red test.

- [x] T004 Add position-map audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-position-map` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current position-map content

**Checkpoint**: The audit catches the intended position-map quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Neighbor Direction Rounds Are Computable (Priority: P1)

**Goal**: Neighbor direction rounds compute one-cell answers and explain target, direction, and answer.

**Independent Test**: Review neighbor rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Verify each neighbor direction answer is computable from the grid in `src/data/games.ts`
- [x] T008 [US1] Rewrite neighbor success, retry, and parent prompts to name target, direction, one-cell movement, and answer in `src/data/games.ts`
- [x] T009 [US1] Review neighbor choices for answer correctness, uniqueness, and plausible nearby distractors in `src/data/games.ts`
- [x] T010 [US1] Verify neighbor rounds pass position-map audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Inside/Outside Rounds Contrast The Groups (Priority: P1)

**Goal**: Inside/outside rounds use visual groups and explain the contrast.

**Independent Test**: Review inside/outside rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Verify inside/outside answers belong to requested visual groups in `src/data/games.ts`
- [x] T012 [US2] Rewrite inside/outside success, retry, and parent prompts to name answer plus inside/outside contrast in `src/data/games.ts`
- [x] T013 [US2] Verify inside/outside rounds pass position-map audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Relative Direction Rounds Preserve Viewpoint (Priority: P1)

**Goal**: Relative direction rounds compute from the named source item and explain the viewpoint.

**Independent Test**: Review relative direction rounds and run `pnpm audit:curriculum`.

- [x] T014 [US3] Verify relative direction answers compute from source to target in `src/data/games.ts`
- [x] T015 [US3] Rewrite relative success, retry, and parent prompts to name source, target, direction, and start-from-source strategy in `src/data/games.ts`
- [x] T016 [US3] Verify relative direction rounds pass position-map audit with `pnpm audit:curriculum`

---

## Phase 6: User Story 4 - Position-Map Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed position-map text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T017 [US4] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T018 [US4] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T019 [US4] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T020 [P] Update position-map quality guidance in `docs/build-generation-guide.md`
- [x] T021 [P] Record position-map work in `docs/CHANGELOG.md`
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

1. Add position-map audit checks and verify they fail on current content.
2. Rewrite neighbor direction rounds.
3. Rewrite inside/outside rounds.
4. Rewrite relative direction rounds.
5. Regenerate voice lines and voice manifest.
6. Run final build/audit/diff checks and commit a local checkpoint.
