# Tasks: Order-Plan Logic Quality

**Input**: Design documents from `specs/013-order-plan-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/order-plan-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/013-order-plan-quality/quickstart.md`
- [x] T002 [P] Review current `logic-order-plan` rounds and record rewrite targets in `specs/013-order-plan-quality/data-model.md`
- [x] T003 [P] Review existing sequence and visual-token formats in `src/data/games.ts` and `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Order-plan audit helpers and red test.

- [x] T004 Add order-plan audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-order-plan` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current order-plan content

**Checkpoint**: The audit catches the intended order-plan quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Missing-Step Rounds Are Sequence-Based (Priority: P1)

**Goal**: Each round has one missing sequence step, a unique answer choice, and a computable filled sequence.

**Independent Test**: Review order-plan rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Verify order-plan sequences contain exactly one missing step in `src/data/games.ts`
- [x] T008 [US1] Verify answer choices appear exactly once and fill the sequence in `src/data/games.ts`
- [x] T009 [US1] Verify missing-step structure passes order-plan audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Feedback Supports Child Replay (Priority: P1)

**Goal**: Success, retry, and parent prompts name the filled sequence and support child replay.

**Independent Test**: Review order-plan wording and run `pnpm audit:curriculum`.

- [x] T010 [US2] Rewrite order-plan success feedback to name filled sequence and answer in `src/data/games.ts`
- [x] T011 [US2] Rewrite order-plan retry guidance to name sequence, answer, and replay strategy in `src/data/games.ts`
- [x] T012 [US2] Rewrite order-plan parent prompts to ask the child to point, say, or explain the filled sequence in `src/data/games.ts`
- [x] T013 [US2] Verify wording passes order-plan audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Order-Plan Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed order-plan text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T014 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T015 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T016 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T017 [P] Update order-plan quality guidance in `docs/build-generation-guide.md`
- [x] T018 [P] Record order-plan work in `docs/CHANGELOG.md`
- [x] T019 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T020 Run `pnpm build`
- [x] T021 Run `pnpm audit:curriculum`
- [x] T022 Run `git diff --check`
- [x] T023 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1 and US2 depend on the red audit from Phase 2.
- US3 depends on text changes from US2.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T017, T018, and T019 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add order-plan audit checks and verify they fail on current content.
2. Verify and preserve missing-step sequence structure.
3. Rewrite success, retry, and parent prompts from the filled sequence.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit/diff checks and commit a local checkpoint.
