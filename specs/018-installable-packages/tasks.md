# Tasks: Installable Packages

**Input**: Design documents from `/specs/018-installable-packages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Release-script behavior requires automated tests because it is new behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish release script test surface and dependency scripts.

- [x] T001 Add release command placeholders and Node test scripts in `package.json`
- [x] T002 [P] Create initial content/deployment documentation skeleton in `docs/content-package.md` and `docs/deployment.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define and test the static release package generator before implementation.

- [x] T003 Write failing release-package tests in `scripts/build-release.test.mjs`
- [x] T004 Run `pnpm test:release` and confirm tests fail because `scripts/build-release.mjs` is missing or incomplete
- [x] T005 Implement `scripts/build-release.mjs` to copy `dist/` into `release/nas-static/`, create `content/`, and write manifests
- [x] T006 Run `pnpm build` and `pnpm test:release` to verify release generation passes

---

## Phase 3: User Story 1 - Copyable NAS Static Package (Priority: P1) MVP

**Goal**: Generate a NAS-first static package that can be copied to native static hosting without Docker.

**Independent Test**: Run `pnpm build && pnpm release:nas`, then inspect `release/nas-static/`.

- [x] T007 [US1] Add `release:nas` script in `package.json` and ensure it uses `scripts/build-release.mjs`
- [x] T008 [US1] Update `docs/deployment.md` with NAS native static deployment as the first path
- [x] T009 [US1] Run `pnpm build && pnpm release:nas` and verify required release files exist

---

## Phase 4: User Story 2 - Content Package Boundary (Priority: P2)

**Goal**: Make the generated `content/` directory and docs explicit about current and future content update boundaries.

**Independent Test**: Inspect generated `content/manifest.json`, `content/README.md`, and `docs/content-package.md`.

- [x] T010 [US2] Ensure `scripts/build-release.mjs` writes `content/manifest.json` matching `contracts/content-package.md`
- [x] T011 [US2] Complete `docs/content-package.md` with current built-in content mode and future JSON migration rules
- [x] T012 [US2] Run `pnpm test:release` to verify manifest and decoupling tests pass

---

## Phase 5: User Story 3 - Docker Fallback Package (Priority: P3)

**Goal**: Provide Docker/Compose fallback that serves static files only.

**Independent Test**: Inspect Docker files and, when Docker is available, run `docker compose up --build`.

- [x] T013 [P] [US3] Add `.dockerignore`, `Dockerfile`, `nginx.conf`, and `docker-compose.yml`
- [x] T014 [US3] Update `docs/deployment.md` to describe Docker as fallback only and show `content/` mounting

---

## Phase 6: User Story 4 - Mac Installable App Configuration (Priority: P4)

**Goal**: Add Tauri configuration and package scripts for macOS installation.

**Independent Test**: Inspect scripts/config and run Tauri build if prerequisites are available.

- [x] T015 [US4] Add Tauri app configuration in `src-tauri/Cargo.toml`, `src-tauri/build.rs`, `src-tauri/tauri.conf.json`, and `src-tauri/src/main.rs`
- [x] T016 [US4] Add Mac packaging scripts and Tauri CLI dependency in `package.json` and `pnpm-lock.yaml`
- [x] T017 [US4] Update `docs/deployment.md` with Mac build prerequisites and command

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and verification.

- [x] T018 [P] Update `docs/CHANGELOG.md` with installable package changes
- [x] T019 [P] Update `docs/TODO.md` with full question-bank JSON migration follow-up
- [x] T020 Run `pnpm build`
- [x] T021 Run `pnpm audit:curriculum`
- [x] T022 Run `pnpm test:release`
- [x] T023 Review `git diff` to confirm deployment files do not import game logic

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories
- **US1**: Depends on Foundational
- **US2**: Depends on Foundational
- **US3**: Depends on US1 release package conventions
- **US4**: Depends on shared frontend build convention
- **Polish**: Depends on all implemented user stories

### Parallel Opportunities

- T002 can run in parallel with T001.
- T013 can run in parallel with documentation updates after release package conventions are stable.
- T018 and T019 can run in parallel.

## Implementation Strategy

1. Build the release generator with tests first.
2. Make NAS static package the MVP.
3. Add content boundary documentation and tests.
4. Add Docker fallback.
5. Add Mac/Tauri packaging configuration.
6. Run final verification commands from quickstart.
