# Feature Specification: Cross-Platform Desktop Release

**Feature Branch**: `dev`

**Created**: 2026-07-13

**Status**: Implemented

**Input**: User description: "让小小思考屋生成 Mac ARM64 和 Windows x64 应用，并在 GitHub 上直接发布。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publish Both Desktop Platforms Together (Priority: P1)

As a project maintainer, I want one version release action to produce downloadable
macOS and Windows installers together so that a milestone does not require manual
packaging on separate computers.

**Why this priority**: A single repeatable release is the core value of the feature
and removes the current Mac-only release limitation.

**Independent Test**: Start a release for a test version and confirm that one draft
release receives all required platform installers before it becomes visible to users.

**Acceptance Scenarios**:

1. **Given** a valid release version and a revision that passes required quality checks, **When** the maintainer starts a release, **Then** macOS Apple Silicon and Windows x64 packages are built in parallel.
2. **Given** all required packages build successfully, **When** packaging finishes, **Then** one GitHub release contains every required installer and is made available for download.
3. **Given** any required package or quality check fails, **When** the release process finishes, **Then** no incomplete release is presented as a finished public release and the failing platform is identifiable.

---

### User Story 2 - Choose the Correct Installer (Priority: P2)

As a parent or tester, I want each download to state its operating system and
processor type clearly so that I can choose the correct installer without technical
guesswork.

**Why this priority**: Simultaneous builds are useful only when families can reliably
identify which file belongs on their computer.

**Independent Test**: Inspect a completed release and verify that a non-developer can
match each listed file to an Apple Silicon Mac or a 64-bit Windows computer.

**Acceptance Scenarios**:

1. **Given** a completed desktop release, **When** a user views its downloads, **Then** every installer name identifies the product, version, operating system, and architecture.
2. **Given** a completed desktop release, **When** a user reads its notes, **Then** the supported computer types and any installation trust warning are stated in plain language.

---

### User Story 3 - Reproduce and Audit a Release (Priority: P3)

As a maintainer, I want release inputs, checks, versions, and signing status to be
auditable so that a published installer can be traced back to one source revision.

**Why this priority**: Families receive executable software, so the release must be
repeatable and its limitations must not be hidden.

**Independent Test**: Select a published release and trace every installer to the same
version, source revision, completed quality gates, and documented signing status.

**Acceptance Scenarios**:

1. **Given** a completed release, **When** the maintainer audits it, **Then** all packages report the same product version and originate from the tagged source revision.
2. **Given** signing credentials are unavailable, **When** a release is created, **Then** the release is explicitly identified as a test/pre-release build rather than a fully trusted production distribution.
3. **Given** signing credentials are configured later, **When** a production release is created, **Then** its signing and platform trust checks are part of the documented release evidence.

### Edge Cases

- A platform build succeeds while another platform build fails.
- A version already has an existing tag or release.
- The application version and requested release version do not match.
- A release contains packages produced from different source revisions.
- Signing or notarization credentials are absent, expired, or rejected.
- A user with an unsupported Intel Mac downloads the Apple Silicon installer.
- The release job is retried after some artifacts have already been uploaded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The release process MUST produce installers for macOS Apple Silicon and Windows x64 from the same tagged source revision.
- **FR-002**: A single release action MUST build required platform packages concurrently where infrastructure permits.
- **FR-003**: A completed GitHub release MUST contain one installable package for each required platform and architecture.
- **FR-004**: Installer filenames MUST identify product, version, operating system, and architecture without requiring users to open the files.
- **FR-005**: The release process MUST run the project build and curriculum audit before a release can be finalized.
- **FR-006**: A failed required build or audit MUST prevent an incomplete draft from being presented as a finished public release.
- **FR-007**: All packages in one release MUST use the same application version and tagged source revision.
- **FR-008**: The release MUST state whether packages use production signing or development/test signing.
- **FR-009**: A release without complete production signing MUST be visibly marked as a pre-release and include plain-language installation warnings.
- **FR-010**: Release creation MUST be repeatable without overwriting a different source revision that uses the same version.
- **FR-011**: Maintainers MUST be able to start the process from a version tag and manually for release-pipeline verification.
- **FR-012**: The existing local macOS build and installation workflow MUST remain available.
- **FR-013**: Automatic application updates, Mac App Store publishing, and Microsoft Store publishing MUST remain outside this feature's scope.

### Key Entities

- **Release Version**: The single product version shared by the tag, application metadata, release title, and installer names.
- **Platform Package**: An installable artifact identified by operating system, processor architecture, version, source revision, and signing status.
- **Release Record**: The GitHub-hosted collection of platform packages, release notes, status, and source tag.
- **Release Evidence**: The recorded checks and metadata proving that required packages came from the same revision and passed required gates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No image, curriculum, or voice content changes. Existing desktop icon assets are reused and audited for both platforms.
- **Docs**: Update the feature spec, implementation plan, task list, `docs/CHANGELOG.md`, `docs/TODO.md`, and desktop release instructions.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`, release configuration tests, a real local macOS application build, and `pnpm mac:install`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: One release action produces both required platform packages without manual transfer between computers.
- **SC-002**: 100% of required installers in a completed release share the same version and source revision.
- **SC-003**: A user can identify the correct installer for Apple Silicon Mac or 64-bit Windows from the filename and release notes in under 30 seconds.
- **SC-004**: No release missing a required package is displayed as a finished public release.
- **SC-005**: Every completed release records successful project build and curriculum audit results.
- **SC-006**: A maintainer can trace each installer to its source tag, target platform, architecture, and signing status using the release record alone.

## Assumptions

- GitHub Releases is the direct-download channel; platform application stores are not part of this milestone.
- Initial automated packages may use development/test signing until the required Apple and Windows certificates are supplied as protected repository credentials.
- Releases lacking complete production signing are pre-releases and are not described as family-ready production distributions.
- The first Windows target is 64-bit Windows 10/11; Windows ARM and 32-bit Windows are outside this milestone.
- Intel Mac support is outside this milestone; the only macOS target is Apple Silicon.
- The existing local application assets and browser-based speech fallback remain portable because they are packaged with the application rather than fetched during installation.
- Version tags use a consistent `v<major>.<minor>.<patch>` convention and correspond to the application version.
