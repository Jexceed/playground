# Feature Specification: Installable Packages

**Feature Branch**: `018-installable-packages`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Package the current tool as an installable program for the current Mac and for a ZSpace NAS, preferably without Docker on NAS, and keep deployment loosely coupled from original game logic so content can be updated more easily."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copyable NAS Static Package (Priority: P1)

As a parent maintaining the family NAS, I want a release folder that can be copied directly to NAS static hosting or an application entry, so the game can run on family devices without requiring Docker when the NAS provides a native static web entry.

**Why this priority**: This is the user's preferred NAS installation path and has the lowest operational complexity for a pure frontend app.

**Independent Test**: Build the release package, inspect the package contents, and serve the package as static files locally to prove it can run without Node, Vite, or Docker.

**Acceptance Scenarios**:

1. **Given** the repository is checked out, **When** the release package command runs after a production build, **Then** a NAS static release directory exists with `index.html`, built assets, image assets, audio assets, and a `content/` directory.
2. **Given** the NAS static release directory exists, **When** it is served by a generic static file server, **Then** the app loads from the release root and local assets resolve from the same package.
3. **Given** a maintainer wants to update deployable content later, **When** they inspect the release package, **Then** a documented `content/` location and manifest explain which files are deployment-owned and which files remain app-owned.

---

### User Story 2 - Content Package Boundary (Priority: P2)

As a maintainer, I want a clear content package contract so deployment files and future content updates do not import or mutate the original game logic.

**Why this priority**: The user explicitly requested loose coupling and easier content updates. The first release must establish a stable boundary even before the full question bank is migrated out of TypeScript.

**Independent Test**: Inspect the generated release manifest and content documentation; verify the deployment scripts only consume `dist/` and static content paths rather than importing `src/data/games.ts`.

**Acceptance Scenarios**:

1. **Given** the release process runs, **When** the script creates the release manifest, **Then** it records the package name, version, generated time, source build directory, and content directory.
2. **Given** a maintainer reads the content documentation, **When** they follow it, **Then** they understand that images, audio, and future JSON content packs are updateable deployment assets while the current compiled question bank remains the default built-in content.
3. **Given** a future task migrates question data, **When** it uses this contract, **Then** it can place a validated `catalog.json` under `content/` without changing NAS or Mac packaging.

---

### User Story 3 - Docker Fallback Package (Priority: P3)

As a maintainer whose ZSpace model lacks a native static site entry, I want a Docker fallback that serves the same static release package, so NAS installation is still possible.

**Why this priority**: Public ZSpace information confirms Docker and Compose support on supported models, but the preferred path is no Docker.

**Independent Test**: Build or inspect Docker configuration to confirm it serves static files only and can mount `content/` separately.

**Acceptance Scenarios**:

1. **Given** the static release package exists, **When** Docker configuration is used, **Then** the container serves the same static package rather than rebuilding or importing application source code at runtime.
2. **Given** a maintainer wants to update content on NAS, **When** they mount a NAS folder to the configured content path, **Then** content can be updated without rebuilding the image.

---

### User Story 4 - Mac Installable App Configuration (Priority: P4)

As a parent using the current Mac, I want configuration for a native installable app, so the same frontend can be packaged as a macOS `.app` or `.dmg`.

**Why this priority**: Mac installation matters, but the NAS static path is the user's preferred immediate deployment target.

**Independent Test**: Inspect package scripts and Tauri configuration; if local Tauri prerequisites are available, run the app build command.

**Acceptance Scenarios**:

1. **Given** package dependencies are installed, **When** the Mac packaging command is run on a machine with Tauri prerequisites, **Then** it builds the frontend and invokes Tauri packaging against the built app.
2. **Given** the Tauri configuration is inspected, **When** the app bundle is built, **Then** it uses the same frontend build output and does not duplicate game logic.

### Edge Cases

- If `dist/` is missing, the release command must fail with an actionable message telling the maintainer to run `pnpm build`.
- If an existing release directory is present, the release command must replace only the generated release output and preserve source files outside that release directory.
- If ZSpace does not expose native static hosting on a specific model, the documented fallback must point to Docker/Compose without changing the app code.
- If Tauri prerequisites are not installed locally, the repository must still contain complete configuration and document the missing prerequisite rather than blocking NAS packaging.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a NAS-first static release package from the production build output.
- **FR-002**: System MUST include a `content/` directory in the release package as the deployment-owned content boundary.
- **FR-003**: System MUST produce a release manifest that documents package metadata and the content boundary.
- **FR-004**: System MUST document a NAS native static installation path that does not require Docker when the NAS supports static web/app hosting.
- **FR-005**: System MUST document Docker/Compose as a fallback, not the primary NAS path.
- **FR-006**: Docker fallback configuration MUST serve static files only and MUST NOT run the Vite dev server or import application source at runtime.
- **FR-007**: System MUST add Mac packaging configuration that uses the same frontend build output.
- **FR-008**: Deployment and packaging files MUST NOT import from `src/data/games.ts` or other game logic modules.
- **FR-009**: System MUST keep the current built-in TypeScript question bank working as default content for this phase.
- **FR-010**: Documentation MUST identify future question-bank JSON migration as a follow-up content task rather than silently implying it is complete.
- **FR-011**: Verification MUST include `pnpm build` and `pnpm audit:curriculum`.

### Key Entities *(include if feature involves data)*

- **Release Package**: A generated static directory containing the built frontend, public assets, content boundary files, and release metadata.
- **Content Package Boundary**: The `content/` directory and manifest convention that deployment tools may replace without importing source logic.
- **NAS Native Static Installation**: A documented copy/upload flow for NAS models that provide native static web or open application entries.
- **Docker Fallback**: A static web server container configuration for NAS models where no native static entry is available.
- **Mac App Bundle Configuration**: Tauri configuration and package scripts for building a local macOS installable wrapper around the same frontend.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new child-facing image or audio assets. Existing `public/images/` and `public/audio/` must be included in the release package through the production build.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and add deployment/content documentation under `docs/`.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`, and release-package tests must prove the package can be produced without coupling deployment code to game logic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A maintainer can generate the NAS static package with one documented command after dependency installation.
- **SC-002**: The generated NAS package contains `index.html`, built assets, `images/`, `audio/`, `content/`, and a release manifest.
- **SC-003**: The documented NAS path lists native static hosting as the first option and Docker/Compose only as fallback.
- **SC-004**: The release script has automated tests covering missing `dist/`, package generation, manifest generation, and source/deployment decoupling.
- **SC-005**: Required verification commands complete with exit code 0 before the feature is reported complete.

## Assumptions

- ZSpace NAS capabilities vary by model and OS version; the project will provide a native static package first and a Docker fallback for models without native static hosting.
- The current question bank remains compiled into the app for this phase to avoid a high-risk data migration during packaging work.
- Future content updates will first target assets and documented `content/` manifests; full question-bank JSON migration will be tracked separately.
- The Mac packaging path uses Tauri because the app is a frontend-only React/Vite application and does not need a large Electron runtime.
