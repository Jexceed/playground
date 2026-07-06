# Tasks: Visual Choice And Session Memory

**Input**: Design documents from `specs/016-visual-choice-session-memory/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/visual-choice-session-audit-report.md`, `quickstart.md`

**Tests**: Use TDD through `pnpm audit:curriculum`: add source-level audit
checks, verify red on current code, implement, then verify green and browser
behavior.

## Phase 1: Setup

**Purpose**: Establish baseline and affected files.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `quickstart.md`
- [x] T002 [P] Review visual-match choice rendering in `src/games/ProgressiveSetGame.tsx`
- [x] T003 [P] Review matrix rendering in `src/games/ProgressiveSetGame.tsx` and `src/styles.css`
- [x] T004 [P] Review selection and progress storage in `src/App.tsx` and `src/storage.ts`

---

## Phase 2: Foundational

**Purpose**: Add red audit checks.

- [x] T005 Add visual-choice source audit check in `scripts/audit-curriculum.mjs`
- [x] T006 Add matrix nested-card source audit check in `scripts/audit-curriculum.mjs`
- [x] T007 Add last-location storage/app source audit checks in `scripts/audit-curriculum.mjs`
- [x] T008 Run `pnpm audit:curriculum` and confirm the new checks fail on current code

---

## Phase 3: User Story 1 - Visual-Match Choices Look Like Cards (Priority: P1)

**Goal**: Exact-match visual choices show compact cards without duplicate raw labels.

**Independent Test**: `pnpm audit:curriculum` plus browser visual check.

- [x] T009 [US1] Add compact visual-card choice rendering in `src/games/ProgressiveSetGame.tsx`
- [x] T010 [US1] Add answer-choice CSS variants in `src/styles.css`
- [x] T011 [US1] Verify visual-choice audit passes with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Matrix Puzzle Cells Are Flat Inside The Grid (Priority: P1)

**Goal**: Matrix cells use flat tokens instead of nested visual cards.

**Independent Test**: `pnpm audit:curriculum` plus browser visual check.

- [x] T012 [US2] Add flat matrix-cell token rendering in `src/games/ProgressiveSetGame.tsx`
- [x] T013 [US2] Update matrix CSS in `src/styles.css`
- [x] T014 [US2] Verify matrix audit passes with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - App Restores Last Opened Place (Priority: P1)

**Goal**: Startup restores last valid world, game, and round.

**Independent Test**: Browser select/reload check.

- [x] T015 [US3] Add `LastPlayLocation` type in `src/types.ts`
- [x] T016 [US3] Add `readLastPlayLocation` and `saveLastPlayLocation` helpers in `src/storage.ts`
- [x] T017 [US3] Initialize and persist App selection state from last location in `src/App.tsx`
- [x] T018 [US3] Verify storage/app audit passes with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Docs, verification, and local checkpoint.

- [x] T019 [P] Update `docs/build-generation-guide.md`
- [x] T020 [P] Update `docs/CHANGELOG.md`
- [x] T021 [P] Update `docs/TODO.md`
- [x] T022 Run `pnpm audit:curriculum`
- [x] T023 Run `pnpm build`
- [x] T024 Run browser desktop/mobile visual and reload checks
- [x] T025 Run `git diff --check`
- [x] T026 Commit local checkpoint on `dev`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before implementation.
- US1 and US2 can be implemented independently after red checks.
- US3 depends on storage and app state review.
- Polish depends on all user stories.

## Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T019, T020, and T021 can be reviewed together after implementation.

## Implementation Strategy

1. Add audit checks and verify red.
2. Improve visual-match choice rendering.
3. Flatten matrix cell rendering.
4. Add validated last-location persistence.
5. Update docs, verify, browser-check, and commit.
