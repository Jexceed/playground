# Tasks: Pattern Visual And Voice Quality

**Input**: Design documents from `specs/024-pattern-voice-quality/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/quality-audit.md`, `quickstart.md`

## Phase 1: Setup

- [x] T001 Record the current pattern rendering and six voice-duration baseline findings in `specs/024-pattern-voice-quality/research.md`
- [x] T002 Create the feature spec, plan, data model, audit contract, quickstart, and requirement checklist under `specs/024-pattern-voice-quality/`
- [x] T003 Add the feature task list and point `.specify/feature.json` at `specs/024-pattern-voice-quality`

---

## Phase 2: Foundational Quality Gates

- [ ] T004 Add failing MP3 parsing and text-duration tests in `scripts/voice-media-quality.test.mjs`
- [ ] T005 Implement reusable MP3 and text-aware duration inspection in `scripts/lib/voice-media-quality.mjs`
- [ ] T006 Add `scripts/audit-voice-media.mjs` and package scripts in `package.json`
- [ ] T007 Integrate invalid-cache deletion, post-generation validation, and retry behavior in `scripts/generate-edge-voices.mjs`
- [ ] T008 Extend `scripts/audit-curriculum.mjs` with local pattern-token and source-pairing gates

**Checkpoint**: Known bad voice media and non-local pattern tokens fail before
asset/content repair.

---

## Phase 3: User Story 1 - Coherent Local Pattern Cards (Priority: P1)

**Goal**: Every 找规律火车 stem and choice uses the same coherent local PNG
system.

**Independent Test**: Audit all token mappings and visually review all six
pattern families at desktop and mobile widths.

- [ ] T009 [US1] Generate a coherent chroma-key pattern sticker source with the built-in image-gen workflow and save it under `public/images/items/source/`
- [ ] T010 [US1] Remove the chroma key, crop and normalize runtime PNGs into `public/images/items/pattern-train/`
- [ ] T011 [US1] Register every pattern runtime asset in `src/data/imageGallery.ts`
- [ ] T012 [US1] Route all pattern-train token kinds through registered PNGs in `src/components/VisualToken.tsx`
- [ ] T013 [US1] Verify sequence/choice token parity and all six families with `pnpm audit:curriculum`

**Checkpoint**: No non-missing pattern card falls back to emoji or inline SVG.

---

## Phase 4: User Story 2 - Distinguishable Size Progression (Priority: P1)

**Goal**: Large, medium, and small circles remain visually obvious on the same
card canvas.

**Independent Test**: Compare occupied diameters and inspect size rounds at a
375-pixel viewport without relying on labels.

- [ ] T014 [US2] Derive fixed 196/124/64-pixel purple size-card variants from one generated token in `public/images/items/pattern-train/`
- [ ] T015 [US2] Preserve size-family-only distractors and add diameter/source metadata for audit in `src/data/games.ts`
- [ ] T016 [US2] Validate desktop/mobile size hierarchy and card layout in the production browser preview

**Checkpoint**: The three size choices are identifiable by image alone.

---

## Phase 5: User Story 3 - Complete And Natural Local Speech (Priority: P1)

**Goal**: Every manifested voice line is complete, decodable, and plausibly long
enough for its text.

**Independent Test**: Run the media audit, regenerate rejected files, and confirm
the export/manifest/file counts align with zero findings.

- [ ] T017 [US3] Run targeted voice tests and confirm the six baseline files are rejected by `pnpm audit:voice-media`
- [ ] T018 [US3] Regenerate invalid Edge Xiaoxiao files with the standard rate/pitch settings and re-run media validation
- [ ] T019 [US3] Confirm manifest metadata, counts, failures, and orphan status with `pnpm audit:curriculum`, `pnpm audit:voice-media`, and `pnpm prune:voice-assets`

**Checkpoint**: No invalid audio is reusable or releasable.

---

## Phase 6: Documentation And Release Verification

- [ ] T020 Update image and voice quality rules in `docs/assets.md` and `docs/build-generation-guide.md`
- [ ] T021 Record completed work and remaining follow-up in `docs/CHANGELOG.md` and `docs/TODO.md`
- [ ] T022 Complete all targeted Node tests, `pnpm build`, and `git diff --check`
- [ ] T023 Complete browser desktop/mobile review of all pattern families and representative audio controls
- [ ] T024 Generate the static NAS release with `pnpm release:nas`
- [ ] T025 Install the final Mac app with `pnpm mac:install`, launch it, and verify the installed bundle
- [ ] T026 Mark completed tasks and record final evidence in `specs/024-pattern-voice-quality/quickstart.md`

## Dependencies

- T004-T008 depend on T001-T003.
- T009-T013 depend on the pattern audit contract in T008.
- T014-T016 depend on the generated token source and registry from T009-T012.
- T017-T019 depend on the media validator and generator integration in T004-T007.
- T020-T026 depend on the three user stories reaching their checkpoints.

## Implementation Strategy

1. Make media and pattern defects observable through failing gates.
2. Replace the complete pattern evidence system rather than patching one round.
3. Repair only invalid cached speech while preserving validated media.
4. Validate the web, static release, and real installed desktop bundle before
   completion.
