# Tasks: Address-Map Logic Quality

**Input**: Design documents from `specs/009-address-map-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/address-map-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/009-address-map-quality/quickstart.md`
- [x] T002 [P] Review current `logic-address-map` rounds and record rewrite targets in `specs/009-address-map-quality/data-model.md`
- [x] T003 [P] Review existing address-grid answer format in `src/data/games.ts`

---

## Phase 2: Foundational

**Purpose**: Address-map audit helpers and red test.

- [x] T004 Add address-map audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-address-map` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current address-map content

**Checkpoint**: The audit catches the intended address-map quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Address-To-Object Rounds Are Pointable (Priority: P1)

**Goal**: Address-to-object rounds compute the crossing cell and explain row, column, and object.

**Independent Test**: Review address-to-object rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite address-to-object success feedback to name address, row, column, and object in `src/data/games.ts`
- [x] T008 [US1] Rewrite address-to-object retry and parent prompts to emphasize row first, column second, and crossing cell in `src/data/games.ts`
- [x] T009 [US1] Review address-to-object choices for answer correctness and distinct visible distractors in `src/data/games.ts`
- [x] T010 [US1] Verify address-to-object rounds pass address-map audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Object-To-Address Rounds Read Coordinates From The Grid (Priority: P1)

**Goal**: Object-to-address rounds compute the target address and explain row letter plus column number.

**Independent Test**: Review object-to-address rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite object-to-address success feedback to name target, row, column, and address in `src/data/games.ts`
- [x] T012 [US2] Rewrite object-to-address retry and parent prompts to ask for target, row letter, and column number in `src/data/games.ts`
- [x] T013 [US2] Review object-to-address choices for answer correctness, uniqueness, and plausible row or column mistakes in `src/data/games.ts`
- [x] T014 [US2] Verify object-to-address rounds pass address-map audit with `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Address-Map Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed address-map text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update address-map quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record address-map work in `docs/CHANGELOG.md`
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

1. Add address-map audit checks and verify they fail on current content.
2. Rewrite address-to-object rounds.
3. Rewrite object-to-address rounds.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit/diff checks and commit a local checkpoint.
