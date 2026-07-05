# Tasks: Pattern-Train Logic Quality

**Input**: Design documents from `specs/014-pattern-train-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/pattern-train-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/014-pattern-train-quality/quickstart.md`
- [x] T002 [P] Review current `logic-pattern-train` rounds and record rewrite targets in `specs/014-pattern-train-quality/data-model.md`
- [x] T003 [P] Review existing sequence and label helper formats in `src/data/games.ts` and `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Pattern-train audit helpers and red test.

- [x] T004 Add pattern-train audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-pattern-train` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current pattern-train content
- [x] T007 Add pattern-train metadata support in `src/data/games.ts`

**Checkpoint**: The audit catches the intended pattern-train quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Missing Cards Are Derived From The Repeat Unit (Priority: P1)

**Goal**: Each round has one missing card and an answer derived from the repeated unit.

**Independent Test**: Review pattern-train rounds and run `pnpm audit:curriculum`.

- [x] T008 [US1] Verify pattern-train sequences contain exactly one missing card in `src/data/games.ts`
- [x] T009 [US1] Verify answers are derived from repeated units in `src/data/games.ts`
- [x] T010 [US1] Verify missing-card structure passes pattern-train audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Choices Are Meaningful And Child-Friendly (Priority: P1)

**Goal**: Choices are unique, explainable, and tied to the visible pattern.

**Independent Test**: Review choice sets and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite pattern-train choice generation to avoid unrelated global filler choices in `src/data/games.ts`
- [x] T012 [US2] Verify choice labels and values are unique in `src/data/games.ts`
- [x] T013 [US2] Verify choice quality passes pattern-train audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Feedback Supports Saying The Pattern Aloud (Priority: P2)

**Goal**: Success, retry, and parent prompts name the repeat unit and support child replay.

**Independent Test**: Review pattern-train wording and run `pnpm audit:curriculum`.

- [x] T014 [US3] Rewrite pattern-train success feedback to name repeat unit, filled sequence, and answer in `src/data/games.ts`
- [x] T015 [US3] Rewrite pattern-train retry guidance to name the sequence and replay strategy in `src/data/games.ts`
- [x] T016 [US3] Rewrite pattern-train parent prompts to ask the child to point, say, or explain the pattern in `src/data/games.ts`
- [x] T017 [US3] Verify wording passes pattern-train audit with `pnpm audit:curriculum`

---

## Phase 6: User Story 4 - Pattern-Train Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed pattern-train text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T018 [US4] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T019 [US4] Regenerate local voice entries in `public/audio/voice/manifest.json`
- [x] T020 [US4] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T021 [P] Update pattern-train quality guidance in `docs/build-generation-guide.md`
- [x] T022 [P] Record pattern-train work in `docs/CHANGELOG.md`
- [x] T023 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T024 Run `pnpm build`
- [x] T025 Run `pnpm audit:curriculum`
- [x] T026 Run `git diff --check`
- [x] T027 Review changed files with `git status --short`

## Dependencies & Execution Order

- Phase 1 must complete before Phase 2.
- Phase 2 must complete before content rewrites.
- US1, US2, and US3 depend on the red audit from Phase 2.
- US4 depends on text changes from US2 and US3.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T021, T022, and T023 can run in parallel after story work.
- Audit script edits are sequential because they touch the same file.

## Implementation Strategy

1. Add pattern-train audit checks and verify they fail on current content.
2. Add repeat-unit metadata and verify answers derive from the visible pattern.
3. Rewrite choices so distractors are meaningful and non-duplicate.
4. Rewrite success, retry, and parent prompts from the repeat unit and filled sequence.
5. Regenerate voice lines and voice manifest.
6. Run final build/audit/diff checks and commit a local checkpoint.
