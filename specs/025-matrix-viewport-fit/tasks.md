# Tasks: Matrix Puzzle Viewport Fit

**Input**: Design documents from `specs/025-matrix-viewport-fit/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/matrix-viewport-audit.md`, `quickstart.md`

## Phase 1: Setup

- [x] T001 Record baseline desktop measurements in `specs/025-matrix-viewport-fit/quickstart.md`
- [x] T002 Create feature design artifacts under `specs/025-matrix-viewport-fit/`

## Phase 2: User Story 1 - One Desktop View (P1)

**Independent Test**: All six rounds fit at 1280x720 without document scrolling.

- [x] T003 [US1] Add a failing redundant-scene audit in `scripts/audit-curriculum.mjs`
- [x] T004 [US1] Remove the redundant matrix-puzzle scene in `src/data/games.ts` and align the desktop navigation height in `src/styles.css`
- [x] T005 [US1] Verify all six rounds at 1280x720 in the production preview

## Phase 3: User Story 2 - Readable Mobile Layout (P2)

**Independent Test**: All six matrices remain contained at 375x812.

- [x] T006 [US2] Verify all six mobile matrix layouts have no horizontal overflow or overlap
- [x] T007 [US2] Confirm missing-cell and combined-token rendering remains readable

## Phase 4: Documentation And Release

- [x] T008 [P] Update `docs/CHANGELOG.md`, `docs/TODO.md`, and `docs/build-generation-guide.md`
- [x] T009 Run `pnpm build`, `pnpm audit:curriculum`, and `git diff --check`
- [x] T010 Generate the NAS package with `pnpm release:nas`
- [x] T011 Install and launch the Mac app with `pnpm mac:install`
- [x] T012 Record final evidence in `specs/025-matrix-viewport-fit/quickstart.md`

## Dependencies

- T003 precedes T004 so the regression is observable.
- T005-T007 depend on T004.
- T008-T012 depend on desktop and mobile acceptance.

## Implementation Strategy

Enforce the single-surface invariant, remove the redundant content reference,
then validate every round before rebuilding release artifacts.
