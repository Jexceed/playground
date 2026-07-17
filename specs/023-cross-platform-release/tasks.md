# Tasks: Cross-Platform Desktop Release

**Input**: Design documents from `specs/023-cross-platform-release/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/desktop-release.md`, `quickstart.md`

**Tests**: Release configuration and version validation tests are required by the
feature specification and are written before their corresponding implementation.

**Organization**: Tasks are grouped by user story so each release capability has
an independent acceptance checkpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it affects a different file and has no
  incomplete dependency.
- **[Story]**: Maps the task to a user story in `spec.md`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Expose stable platform build and release validation commands.

- [X] T001 Add explicit Mac ARM64, Windows x64, release validation, and release test scripts in `package.json`
- [X] T002 [P] Configure ad-hoc macOS CI signing and Windows NSIS defaults in `src-tauri/tauri.conf.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prevent mixed-version or malformed-tag releases before packaging.

- [X] T003 Write failing version/tag validation tests in `scripts/desktop-release.test.mjs`
- [X] T004 Implement three-source version and `v<version>` tag validation in `scripts/validate-desktop-release.mjs`
- [X] T005 Run the validator test cases and a valid local tag check through `package.json`

**Checkpoint**: Invalid or inconsistent versions fail before desktop packaging.

---

## Phase 3: User Story 1 - Publish Both Desktop Platforms Together (Priority: P1) 🎯 MVP

**Goal**: One validated tag builds Mac ARM64 and Windows x64 in parallel, keeps
failures as drafts, and publishes only after both installers exist.

**Independent Test**: Inspect the workflow dependency graph and run its
configuration tests to prove validation precedes a two-platform matrix and
finalization depends on every platform build.

### Tests for User Story 1

- [X] T006 [US1] Add failing workflow trigger, runner, target, bundle, dependency, and finalization assertions in `scripts/desktop-release.test.mjs`

### Implementation for User Story 1

- [X] T007 [US1] Implement tag/manual validation, draft preparation, parallel Tauri builds, asset checks, and pre-release finalization in `.github/workflows/desktop-release.yml`
- [X] T008 [US1] Run desktop release tests and verify the workflow matches `specs/023-cross-platform-release/contracts/desktop-release.md`
- [X] T009 [US1] Preserve and verify the local ARM64 `.app` build command through `package.json`

**Checkpoint**: The repository has one test-covered release workflow that can
produce both required installers without exposing a partial completed release.

---

## Phase 4: User Story 2 - Choose the Correct Installer (Priority: P2)

**Goal**: Families can choose the correct package and understand platform trust
warnings from the release page.

**Independent Test**: Configuration tests prove both asset names contain product,
version, OS, and architecture and release notes state supported computers and
test-signing limitations.

### Tests for User Story 2

- [X] T010 [US2] Add failing asset filename and plain-language release-note assertions in `scripts/desktop-release.test.mjs`

### Implementation for User Story 2

- [X] T011 [US2] Add deterministic Mac ARM64 and Windows x64 asset names plus installation and signing warnings in `.github/workflows/desktop-release.yml`
- [X] T012 [US2] Run desktop release tests and manually audit the rendered release body in `.github/workflows/desktop-release.yml`

**Checkpoint**: Each download is identifiable without opening it and the
pre-release trust limitations are explicit.

---

## Phase 5: User Story 3 - Reproduce and Audit a Release (Priority: P3)

**Goal**: Every package is traceable to one existing version tag and safe retries
cannot overwrite a completed release.

**Independent Test**: Validator and workflow tests prove source versions match
the tag, manual runs require an existing tag, draft retries are allowed, and
published releases are not overwritten.

### Tests for User Story 3

- [X] T013 [US3] Add failing existing-tag, draft-retry, completed-release, source-revision, and audit-evidence assertions in `scripts/desktop-release.test.mjs`

### Implementation for User Story 3

- [X] T014 [US3] Implement safe draft reuse, completed-release rejection, tagged checkout, and workflow evidence summary in `.github/workflows/desktop-release.yml`
- [X] T015 [US3] Run version failure cases and desktop release configuration tests from `scripts/desktop-release.test.mjs`

**Checkpoint**: A release is reproducible from one tag and its evidence clearly
identifies version, revision, checks, platforms, and signing status.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Keep operating documentation and project records aligned, then run
the complete release validation guide.

- [X] T016 [P] Document local Windows builds, tag releases, retries, artifacts, and signing limits in `docs/deployment.md` and `docs/build-generation-guide.md`
- [X] T017 [P] Record completed cross-platform release work and remaining production-signing follow-up in `docs/CHANGELOG.md` and `docs/TODO.md`
- [X] T018 Run `pnpm test:desktop-release`, `pnpm release:validate -- --tag v0.1.0`, `pnpm build`, `pnpm audit:curriculum`, `pnpm mac:build`, and `pnpm mac:install` per `specs/023-cross-platform-release/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on T001; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on the foundational validator.
- **User Story 2 (Phase 4)**: Depends on the workflow created for User Story 1.
- **User Story 3 (Phase 5)**: Depends on the workflow and naming contract from
  User Stories 1 and 2.
- **Polish (Phase 6)**: Depends on all three user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Delivers the build-and-publish MVP after foundational work.
- **User Story 2 (P2)**: Extends US1's release assets and notes but can be
  independently accepted through filename/note assertions.
- **User Story 3 (P3)**: Extends US1's release lifecycle but can be independently
  accepted through retry, tag, and evidence assertions.

### Parallel Opportunities

- T002 can run while T001 is being prepared because it changes a different file.
- Documentation T016 and project-record task T017 affect disjoint files and can
  run in parallel after implementation.
- The implemented matrix runs the macOS and Windows build legs in parallel.

---

## Parallel Example: Polish

```text
Task: "Update desktop release operating docs in docs/deployment.md and docs/build-generation-guide.md"
Task: "Update completion and signing follow-up records in docs/CHANGELOG.md and docs/TODO.md"
```

---

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational validation.
2. Implement User Story 1's draft → matrix → finalization workflow.
3. Run the configuration tests and preserve the local Mac build.

### Incremental Delivery

1. Add clear artifact names and release warnings for User Story 2.
2. Add safe retry and traceability evidence for User Story 3.
3. Update operating docs and run the full quickstart validation.

## Notes

- All 18 tasks use the required checkbox, ID, labels, and exact file paths.
- Tests precede each corresponding workflow implementation change.
- No task changes curriculum, image, or voice assets.
- A real Windows installer is produced by the Windows GitHub-hosted runner; the
  Apple Silicon development machine validates configuration and the real Mac app.
