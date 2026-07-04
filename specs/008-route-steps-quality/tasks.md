# Tasks: Route-Step Logic Quality

**Input**: Design documents from `specs/008-route-steps-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/route-steps-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/008-route-steps-quality/quickstart.md`
- [x] T002 [P] Review current `logic-route-steps` rounds and record rewrite targets in `specs/008-route-steps-quality/data-model.md`
- [x] T003 [P] Review existing grid and route answer format in `src/data/games.ts`

---

## Phase 2: Foundational

**Purpose**: Route-step audit helpers and red test.

- [x] T004 Add route-step audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-route-steps` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current route-step content

**Checkpoint**: The audit catches the intended route-step quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - One-Step Routes Match The Grid (Priority: P1)

**Goal**: One-step rounds compute the visible destination and explain start, direction, and destination.

**Independent Test**: Review one-step rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite one-step success feedback to name start, direction, and destination in `src/data/games.ts`
- [x] T008 [US1] Rewrite one-step retry and parent prompts to emphasize one-cell movement from the start in `src/data/games.ts`
- [x] T009 [US1] Review one-step choices for answer correctness and distinct plausible destinations in `src/data/games.ts`
- [x] T010 [US1] Verify one-step rounds pass route-step audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Two-Step Routes Preserve Step Order (Priority: P1)

**Goal**: Two-step rounds compute ordered paths and explain intermediate plus final destination.

**Independent Test**: Review two-step rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite two-step success feedback to name first and second destinations in `src/data/games.ts`
- [x] T012 [US2] Rewrite two-step retry and parent prompts to ask for the first landing spot before the second move in `src/data/games.ts`
- [x] T013 [US2] Review two-step choices for answer correctness, uniqueness, and plausible distractors in `src/data/games.ts`
- [x] T014 [US2] Verify two-step rounds pass route-step audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Route-Step Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed route-step text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update route-step quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record route-step work in `docs/CHANGELOG.md`
- [x] T020 [P] Update remaining logic-house follow-up in `docs/TODO.md`
- [x] T021 Run `pnpm build`
- [x] T022 Run `pnpm audit:curriculum`
- [x] T023 Run `git diff --check`
- [x] T024 Review changed files with `git status --short`

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

1. Add route-step audit checks and verify they fail on current content.
2. Rewrite one-step route rounds.
3. Rewrite two-step route rounds.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit/diff checks and commit a local checkpoint.
