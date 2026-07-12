# Tasks: Curriculum Integrity

**Input**: `specs/022-curriculum-integrity/`

**Tests**: Required; behavior changes begin with failing audit or Node tests.

## Phase 1: Setup

- [ ] T001 Register and validate `specs/022-curriculum-integrity` through `.specify/feature.json`

## Phase 2: Foundational Audit Gates

- [ ] T002 Add failing position distribution and graphic-order checks in `scripts/audit-curriculum.mjs`
- [ ] T003 Add failing semantic and hour-hand-first checks in `scripts/audit-curriculum.mjs`
- [ ] T004 Add failing orphan voice detection in `scripts/audit-curriculum.mjs`

## Phase 3: User Story 1 - Think Instead of Memorize (P1)

**Independent Test**: Curriculum audit has no position or graphic failures.

- [ ] T005 [US1] Implement per-choice-count answer placement in `src/data/games.ts`
- [ ] T006 [US1] Reorder graphic options and relabel A-D in `src/data/games.ts`
- [ ] T007 [US1] Run `pnpm audit:curriculum` and isolate remaining semantic/voice failures

## Phase 4: User Story 2 - Follow Coherent Evidence (P1)

**Independent Test**: Semantic audit passes and each corrected round has one supported answer.

- [ ] T008 [US2] Rewrite bridge/rotation leakage and distractors in `src/data/games.ts`
- [ ] T009 [US2] Replace proximity-as-proof rounds in `src/data/games.ts`
- [ ] T010 [US2] Change all clock guidance to hour hand first in `src/data/games.ts`
- [ ] T011 [US2] Update clock checks/docs in `scripts/audit-curriculum.mjs` and `specs/021-clock-time/`
- [ ] T012 [US2] Run `pnpm audit:curriculum` for semantic and clock checks

## Phase 5: User Story 3 - Hear One Auditable Voice (P2)

**Independent Test**: Voice tests/audit show Xiaoxiao-only, zero failures/orphans.

- [ ] T013 [US3] Write failing pruning tests in `scripts/prune-voice-assets.test.mjs`
- [ ] T014 [US3] Implement pruning and package scripts in `scripts/prune-voice-assets.mjs` and `package.json`
- [ ] T015 [US3] Regenerate launch WAV from Xiaoxiao under `public/audio/brand/` and document source in `references/audio/launch-brand-shout/`
- [ ] T016 [US3] Export/generate standard voices and prune `public/audio/voice/`
- [ ] T017 [US3] Run `pnpm test:voice-assets`, `pnpm audit:curriculum`, and `pnpm test:speech`

## Phase 6: Polish & Release

- [ ] T018 Update `docs/CHANGELOG.md`, `docs/TODO.md`, `docs/assets.md`, and `docs/build-generation-guide.md`
- [ ] T019 Run `pnpm build` and `pnpm release:nas`
- [ ] T020 Run `pnpm mac:install` and open `/Applications/小小思考屋.app`
- [ ] T021 Complete the requirement audit in `specs/022-curriculum-integrity/quickstart.md`

## Dependencies

T002-T004 establish RED tests before implementation. US1 precedes US2 so
distribution is isolated. US2 precedes voice generation because wording defines
voice IDs. Release tasks require all stories.

## Implementation Strategy

Execute inline in story order. Keep checkpoints on local `dev`; do not push.

