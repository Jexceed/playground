# Tasks: Memory Camera Visual Surface

**Input**: Design documents from `specs/017-memory-camera-visual-surface/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/memory-camera-visual-audit-report.md`, `quickstart.md`

**Tests**: Use TDD through `pnpm audit:curriculum`: add source-level audit
coverage first, verify red, then implement the flat renderer and verify green.

## Phase 1: Setup

**Purpose**: Confirm current surface and define the regression check.

- [x] T001 Review current `MemoryBoard` renderer in `src/games/ProgressiveSetGame.tsx`
- [x] T002 Review memory-board CSS in `src/styles.css`

---

## Phase 2: Foundational

**Purpose**: Add the failing audit check.

- [x] T003 Add `MemoryBoard` nested visual-token source check in `scripts/audit-curriculum.mjs`
- [x] T004 Run `pnpm audit:curriculum` and confirm the new check fails

---

## Phase 3: User Story 1 - Memory Cards Are Flat Inside The Camera (Priority: P1)

**Goal**: Memory camera slots show one flat item surface inside each slot.

**Independent Test**: `pnpm audit:curriculum` plus browser desktop/mobile checks
on `记忆小相机`.

- [x] T005 [US1] Add flat memory-card token renderer in `src/games/ProgressiveSetGame.tsx`
- [x] T006 [US1] Replace nested `VisualToken` usage in `MemoryBoard`
- [x] T007 [US1] Add memory-card token CSS in `src/styles.css`
- [x] T008 [US1] Verify audit passes with `pnpm audit:curriculum`

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Docs, verification, and local checkpoint.

- [x] T009 Update `docs/build-generation-guide.md`
- [x] T010 Update `docs/CHANGELOG.md`
- [x] T011 Record observed validation in `specs/017-memory-camera-visual-surface/quickstart.md`
- [x] T012 Run `pnpm audit:curriculum`
- [x] T013 Run `pnpm build`
- [x] T014 Run browser desktop/mobile visual checks
- [x] T015 Run `git diff --check`
- [x] T016 Commit local checkpoint on `dev`

## Dependencies & Execution Order

- Phase 1 precedes Phase 2.
- Phase 2 red check precedes implementation.
- User Story 1 implementation precedes docs and final validation.

## Parallel Opportunities

- CSS and renderer review can happen in parallel.
- Documentation updates can be reviewed in parallel after implementation.

## Implementation Strategy

1. Add the audit check and verify red.
2. Implement flat memory-card tokens.
3. Update CSS and docs.
4. Verify audit/build/browser behavior and commit.
