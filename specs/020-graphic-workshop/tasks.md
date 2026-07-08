# Tasks: Graphic Workshop

**Input**: Design documents from `/specs/020-graphic-workshop/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: TDD applies. Audit checks must be added and run red before production implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [x] T001 Create Spec Kit artifacts in `/specs/020-graphic-workshop/`
- [x] T002 [P] Review existing world, game, storage, and audit structure in `src/` and `scripts/audit-curriculum.mjs`

---

## Phase 2: Foundational

- [x] T003 Add failing graphic-world and anti-redundancy audit checks in `scripts/audit-curriculum.mjs`
- [x] T004 Run `pnpm audit:curriculum` and confirm it fails because `graphic` world/content is missing

---

## Phase 3: User Story 1 - Add 图形工坊 As A New Dimension (Priority: P1)

**Goal**: A selectable 图形工坊 world with six compact visual-spatial games.

**Independent Test**: `pnpm audit:curriculum` confirms the new world, game count, round count, supported visual surfaces, and valid choices.

- [x] T005 [US1] Add `graphic` to world typing and storage validation in `src/types.ts` and `src/storage.ts`
- [x] T006 [US1] Add 图形工坊 navigation count and labels in `src/App.tsx`
- [x] T007 [US1] Add graphic world styling/backdrop support in `src/styles.css` and `src/games/ProgressiveSetGame.tsx`
- [x] T008 [US1] Add six `graphic-` games with 4-6 rounds each in `src/data/games.ts`
- [x] T009 [US1] Run `pnpm audit:curriculum` and confirm the graphic-world checks pass

---

## Phase 4: User Story 2 - Add Differentiated Reinforcement (Priority: P2)

**Goal**: Existing worlds gain only compact, non-duplicate reinforcement where difficulty or assessment point differs.

**Independent Test**: Audit duplicate checks pass and feature docs name why reinforcement is included.

- [x] T010 [US2] Add no more than three source-derived reinforcement rounds to existing games in `src/data/games.ts`
- [x] T011 [US2] Document reinforcement rationale in `docs/graphic-workshop-reference-analysis.md`
- [x] T012 [US2] Run `pnpm audit:curriculum` and confirm duplicate/redundancy checks pass

---

## Phase 5: User Story 3 - Preserve Explainability (Priority: P3)

**Goal**: All new content has coherent prompt, visual, options, feedback, retry, and parent prompt.

**Independent Test**: Audit and manual review confirm every new round points to a visible child action and a parent "why" prompt.

- [x] T013 [US3] Review and tighten new prompts, success, retry, and parent prompts in `src/data/games.ts`
- [x] T014 [US3] Update `docs/CHANGELOG.md` and `docs/TODO.md`
- [x] T015 [US3] Run `pnpm audit:curriculum`
- [x] T016 [US3] Run `pnpm build`
- [x] T017 [US3] Run `git diff --check`

---

## Phase 6: Boundary Correction - Remove Logic-House Duplicates

**Goal**: Replace first-pass 图形工坊 content that duplicated existing 逻辑屋 visual-spatial clusters.

**Independent Test**: `pnpm audit:curriculum` fails on the old duplicated graphic game ids and passes after the six games are replaced with contour, occlusion, layer, local-clue, code, and closure operations.

- [x] T018 Add failing audit checks that reject duplicated graphic ids, old logic-house visual ability families, and grid/sequence/memory surfaces inside first-pass 图形工坊 rounds
- [x] T019 Run `pnpm audit:curriculum` and confirm the old 图形工坊 content fails
- [x] T020 Replace the six graphic games in `src/data/games.ts` with non-duplicative visual-processing families
- [x] T021 Update graphic game backdrops in `src/games/ProgressiveSetGame.tsx`
- [x] T022 Update Spec Kit docs and `docs/graphic-workshop-reference-analysis.md` to state the corrected boundary
- [x] T023 Regenerate voice lines and local voice manifest for the corrected wording
- [x] T024 Run final verification: `pnpm audit:curriculum`, `pnpm build`, and `git diff --check`

---

## Phase 7: Visual-Surface Correction - Replace Abstract Token Questions

**Goal**: Replace abstract 图形工坊 rounds with real drawn question surfaces and drawn answer choices whose difficulty is closer to 上实 visual-reasoning material.

**Independent Test**: `pnpm audit:curriculum` fails when graphic rounds only use generic visual tokens or text answer labels, then passes after every graphic round has a `graphicChallenge` with SVG-renderable stem art, 4 drawn options, a visual distractor rationale, and no plain text-only answer options.

- [x] T025 Add failing audit checks requiring `graphicChallenge` on every 图形工坊 round and rejecting text-only graphic answer options
- [x] T026 Run `pnpm audit:curriculum` and confirm the current abstract 图形工坊 rounds fail
- [x] T027 Add `graphicChallenge` types in `src/types.ts`
- [x] T028 Render graphic stems and answer choices as SVG in `src/games/ProgressiveSetGame.tsx`
- [x] T029 Replace 图形工坊 content with three high-quality visual families: 影子配对, 遮挡还原, and 局部找整体
- [x] T030 Update docs to record the real-visual-surface boundary and 上实-style distractor rules
- [x] T031 Regenerate voice lines and local voice manifest after wording changes
- [x] T032 Run final verification: `pnpm audit:curriculum`, `pnpm build`, `git diff --check`, browser smoke, and Mac `.app` build/preview when practical

---

## Phase 8: Refinement - Increase Volume And Fine-Grained Difficulty

**Goal**: Expand 图形工坊 from a minimal drawn proof into a fuller 上实-style set with six real visual families, eight rounds per family, and higher-confusion drawn options.

**Independent Test**: `pnpm audit:curriculum` fails while 图形工坊 has only three families or fewer than 48 rounds, then passes after 影子配对, 遮挡还原, 局部找整体, 透明叠叠板, 图形密码机, and 缺口补一补 all use dedicated `graphicChallenge` surfaces with drawn A/B/C/D options.

- [x] T033 Raise curriculum audit requirements to exactly six graphic games, eight rounds per game, and at least 48 graphic rounds
- [x] T034 Confirm `pnpm audit:curriculum` fails on the previous three-family 18-round implementation
- [x] T035 Extend `graphicChallenge` data and SVG rendering for composed figures, transparent overlap, code mappings, and missing-edge outlines
- [x] T036 Expand the original three visual families to eight refined rounds each
- [x] T037 Add 透明叠叠板, 图形密码机, and 缺口补一补 with eight drawn rounds each
- [x] T038 Update docs and validation notes to reflect six families and 48 rounds
- [x] T039 Regenerate voice lines and local voice manifest after the expanded wording
- [x] T040 Run final verification: `pnpm audit:curriculum`, `pnpm build`, `git diff --check`, browser smoke across all six graphic games, and Mac `.app` build/preview when practical

---

## Phase 9: Visual Polish - Replace Crude Geometry With Image-Gen Assets

**Goal**: Replace the crude SVG placeholder look in 图形工坊 with local image-gen sticker assets while preserving auditable dynamic operations.

**Independent Test**: Browser smoke confirms 图形工坊 `graphicChallenge` stems and answer choices load local PNG image assets inside the rendered SVG surfaces, while `pnpm audit:curriculum` rejects missing image-gen asset registration.

- [x] T041 Generate a unified image-gen sprite sheet for 图形工坊 figure art
- [x] T042 Split the generated sheet into transparent local PNG assets under `public/images/items/graphic-workshop/`
- [x] T043 Register the local image-gen assets in `src/data/imageGallery.ts`
- [x] T044 Render 图形工坊 figures from image-gen PNG assets while keeping dynamic shadow, cover, overlap, code, and gap composition
- [x] T045 Add audit coverage that requires registered image-gen graphic assets
- [x] T046 Run final verification: `pnpm audit:curriculum`, `pnpm build`, `git diff --check`, browser smoke for image asset usage, and Mac `.app` build/preview when practical

---

## Dependencies & Execution Order

- Setup precedes all implementation.
- Foundational audit checks must fail before production changes.
- US1 is the MVP and should be completed before reinforcement.
- US2 depends on the duplicate/redundancy audit added in Phase 2.
- US3 depends on the final content shape from US1 and US2.
- Boundary correction depends on user approval of the non-duplicative 图形工坊 direction.
- Visual-surface correction depends on user approval that graphic rounds must use actual drawn question and answer figures, not abstract labels.

## Implementation Strategy

1. Add audit checks first and verify red.
2. Add the new world and compact graphic-workshop content.
3. Add only limited, differentiated reinforcement to existing worlds.
4. Update docs and run the full verification set.
