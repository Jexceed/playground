# Tasks: Same-Kind Logic Quality

**Input**: Design documents from `specs/003-same-kind-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/same-kind-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/003-same-kind-quality/quickstart.md`
- [x] T002 [P] Review current `logic-same-kind-detective` rounds and record rewrite targets in `specs/003-same-kind-quality/data-model.md`
- [x] T003 [P] Review current same-kind visual token coverage in `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Same-kind audit helpers and red test.

- [x] T004 Add same-kind audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-same-kind-detective` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current same-kind content

**Checkpoint**: The audit catches the intended same-kind quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Same-Kind Rules Are Clear (Priority: P1)

**Goal**: Same-kind rounds clearly ask children to join one visible category using a concrete rule.

**Independent Test**: Review changed same-kind add-one rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite same-kind add-one prompts and instructions in `src/data/games.ts`
- [x] T008 [US1] Rewrite same-kind add-one success and retry feedback to name grouping rules in `src/data/games.ts`
- [x] T009 [US1] Rewrite same-kind add-one parent prompts to ask concrete why questions in `src/data/games.ts`
- [x] T010 [US1] Verify changed add-one rounds pass same-kind audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Same-Kind Choices Are Valid And Non-Repeating (Priority: P1)

**Goal**: Odd-one-out rounds and same-kind choices have valid, non-repeating, explainable options.

**Independent Test**: Review odd-one-out rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite odd-one-out success feedback to name the majority group and different card in `src/data/games.ts`
- [x] T012 [US2] Rewrite odd-one-out retry and parent prompts to focus on the majority rule in `src/data/games.ts`
- [x] T013 [US2] Review same-kind choices for accidental valid distractors and adjust labels or reasons in `src/data/games.ts`
- [x] T014 [US2] Verify same-kind choices and odd-one-out feedback pass `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Same-Kind Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed same-kind text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update same-kind quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record same-kind work in `docs/CHANGELOG.md`
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

1. Add same-kind audit checks and verify they fail on current content.
2. Rewrite add-one category rounds.
3. Rewrite odd-one-out feedback and choice explanations.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit and commit a local checkpoint.
