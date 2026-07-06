# Tasks: Map Visual Surface Quality

**Input**: Design documents from `specs/015-map-visual-surface-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/map-visual-surface-audit-report.md`, `quickstart.md`

**Tests**: This slice uses TDD through the existing curriculum audit: add audit
checks, verify they fail on current content/rendering, implement the smallest
fixes, then run audit/build/browser verification.

## Phase 1: Setup

**Purpose**: Establish baseline and scope.

- [x] T001 Run baseline `pnpm audit:curriculum` and record red result in `specs/015-map-visual-surface-quality/quickstart.md`
- [x] T002 [P] Review spatial rounds in `src/data/games.ts`
- [x] T003 [P] Review `AddressGrid` rendering in `src/games/ProgressiveSetGame.tsx` and `src/styles.css`

---

## Phase 2: Foundational

**Purpose**: Add red audit checks before implementation.

- [x] T004 Add spatial single-surface audit checks in `scripts/audit-curriculum.mjs`
- [x] T005 Add address-grid nested-card renderer audit check in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current visual-surface issues

**Checkpoint**: The audit catches the intended visual ambiguity before data and UI changes.

---

## Phase 3: User Story 1 - Spatial Rounds Have One Authoritative Visual Surface (Priority: P1)

**Goal**: Affected spatial rounds use grids or groups without competing scene images.

**Independent Test**: Run `pnpm audit:curriculum` and inspect representative rounds.

- [x] T007 [US1] Remove scene-image references from `logic-address-map` grid rounds in `src/data/games.ts`
- [x] T008 [US1] Remove scene-image references from `logic-position-map` grid and visual-group rounds in `src/data/games.ts`
- [x] T009 [US1] Remove scene-image references from `logic-route-steps` grid rounds in `src/data/games.ts`
- [x] T010 [US1] Verify spatial single-surface audit passes with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Grid Cells Do Not Contain Nested Card Frames (Priority: P1)

**Goal**: Address-grid object cells render flat icon-and-label content.

**Independent Test**: Run `pnpm audit:curriculum` and visually inspect map grids.

- [x] T011 [US2] Add a flat map cell token renderer in `src/games/ProgressiveSetGame.tsx`
- [x] T012 [US2] Update address-grid CSS in `src/styles.css` for flat cell content and mobile sizing
- [x] T013 [US2] Verify nested-card audit passes with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Visual-Surface Rules Are Auditable (Priority: P2)

**Goal**: Maintainers have durable guidance and validation for spatial visual surfaces.

**Independent Test**: Review docs and run full verification.

- [x] T014 [US3] Update spatial visual-surface guidance in `docs/build-generation-guide.md`
- [x] T015 [US3] Record this feature in `docs/CHANGELOG.md`
- [x] T016 [US3] Update remaining follow-up in `docs/TODO.md`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and local checkpoint.

- [x] T017 Run `pnpm audit:curriculum`
- [x] T018 Run `pnpm build`
- [x] T019 Run browser visual smoke checks for address-map, position-map, and route-step rounds
- [x] T020 Run `git diff --check`
- [x] T021 Review changed files with `git status --short`
- [x] T022 Commit local checkpoint on `dev`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before data and UI changes.
- US1 and US2 both depend on red audit checks.
- US3 depends on final rule wording.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T007, T008, and T009 affect the same file and should be done together.
- T014, T015, and T016 can be reviewed together after implementation.

## Implementation Strategy

1. Add audit rules and verify red.
2. Remove conflicting scene images from affected spatial rounds.
3. Replace nested grid-card rendering with flat map-cell tokens.
4. Update docs.
5. Run audit, build, browser visual check, whitespace check, and commit.
