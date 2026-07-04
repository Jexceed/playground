# Tasks: Visual-Match Logic Quality

**Input**: Design documents from `specs/004-visual-match-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/visual-match-audit-report.md`, `quickstart.md`

**Tests**: The existing curriculum audit is the executable test harness. This
slice requires a red audit before content rewrites and green audit/build before
completion.

## Phase 1: Setup

**Purpose**: Establish baseline and current content gaps.

- [x] T001 Run baseline `pnpm audit:curriculum` and record result in `specs/004-visual-match-quality/quickstart.md`
- [x] T002 [P] Review current `logic-visual-match` rounds and record rewrite targets in `specs/004-visual-match-quality/data-model.md`
- [x] T003 [P] Review current visual token coverage in `src/components/VisualToken.tsx`

---

## Phase 2: Foundational

**Purpose**: Visual-match audit helpers and red test.

- [x] T004 Add visual-match audit helper functions in `scripts/audit-curriculum.mjs`
- [x] T005 Add `logic-visual-match` quality checks in `scripts/audit-curriculum.mjs`
- [x] T006 Run `pnpm audit:curriculum` and confirm it fails on current visual-match content

**Checkpoint**: The audit catches the intended visual-match quality gaps before content is rewritten.

---

## Phase 3: User Story 1 - Exact-Match Cards Are Explainable (Priority: P1)

**Goal**: Exact-match rounds clearly compare one sample card with one fully matching answer card.

**Independent Test**: Review changed exact-match rounds and run `pnpm audit:curriculum`.

- [x] T007 [US1] Rewrite exact-match prompts and instructions in `src/data/games.ts`
- [x] T008 [US1] Rewrite exact-match success and retry feedback to name matching features in `src/data/games.ts`
- [x] T009 [US1] Rewrite exact-match parent prompts to ask about close distractors in `src/data/games.ts`
- [x] T010 [US1] Verify changed exact-match rounds pass visual-match audit with `pnpm audit:curriculum`

---

## Phase 4: User Story 2 - Odd-Card Choices Are Valid And Non-Repeating (Priority: P1)

**Goal**: Odd-card rounds have exactly two matching cards, one different card, and position choices that are explainable.

**Independent Test**: Review odd-card rounds and run `pnpm audit:curriculum`.

- [x] T011 [US2] Rewrite odd-card success feedback to name the matching pair and different card in `src/data/games.ts`
- [x] T012 [US2] Rewrite odd-card retry and parent prompts to focus on matching pair first in `src/data/games.ts`
- [x] T013 [US2] Review visual-match choices for accidental ambiguity and adjust labels or reasons in `src/data/games.ts`
- [x] T014 [US2] Verify visual-match choices and odd-card feedback pass `pnpm audit:curriculum`

---

## Phase 5: User Story 3 - Visual-Match Voice Lines Stay Local And Synced (Priority: P2)

**Goal**: Changed visual-match text is reflected in local voice-line source and manifest.

**Independent Test**: Run voice export/generation and audit manifest synchronization.

- [x] T015 [US3] Export updated voice lines to `public/audio/voice-lines.json`
- [x] T016 [US3] Regenerate local Edge voice entries in `public/audio/voice/manifest.json`
- [x] T017 [US3] Verify voice-line and manifest synchronization with `pnpm audit:curriculum`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final verification, and checkpoint.

- [x] T018 [P] Update visual-match quality guidance in `docs/build-generation-guide.md`
- [x] T019 [P] Record visual-match work in `docs/CHANGELOG.md`
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

1. Add visual-match audit checks and verify they fail on current content.
2. Rewrite exact-match card rounds.
3. Rewrite odd-card feedback and choice explanations.
4. Regenerate voice lines and voice manifest.
5. Run final build/audit and commit a local checkpoint.
