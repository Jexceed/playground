# Research: Cross-Platform Desktop Release

## Decision 1: Build each installer on a native GitHub-hosted runner

**Decision**: Build macOS ARM64 on `macos-15` with target
`aarch64-apple-darwin`, and Windows x64 on `windows-2025` with target
`x86_64-pc-windows-msvc`.

**Rationale**: GitHub documents `macos-15` as an ARM64 hosted runner and
`windows-2025` as an x64 runner. Tauri recommends building Windows installers
on Windows; cross-compiling NSIS from macOS is possible but described as a
last-resort path with caveats.

**Alternatives considered**:

- Cross-compile Windows from the developer Mac: rejected because it adds NSIS,
  LLVM, `cargo-xwin`, and custom signing constraints while providing weaker
  parity with Windows.
- Build an Intel/universal Mac package: rejected because the confirmed scope is
  Apple Silicon only.

**Sources**:

- https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- https://v2.tauri.app/distribute/windows-installer/

## Decision 2: Publish a DMG and an NSIS setup executable

**Decision**: Produce one macOS DMG and one Windows NSIS `-setup.exe`.

**Rationale**: DMG is Tauri's normal direct-download macOS installer. NSIS is a
single Windows setup executable, does not require the WiX/VBSCRIPT dependency,
and supports the Windows 10/11 x64 scope. The default WebView2 bootstrapper
behavior keeps the installer small while ensuring the runtime can be installed
when absent.

**Alternatives considered**:

- macOS `.app` archive: rejected as the public artifact because DMG gives users
  a familiar drag-to-Applications installation flow.
- Windows MSI: rejected for the first release because it adds WiX and optional
  VBSCRIPT dependencies without user value over NSIS for direct download.
- Offline WebView2 runtime: rejected because it increases installer size
  substantially and the supported Windows versions normally include WebView2.

**Sources**:

- https://v2.tauri.app/distribute/dmg/
- https://v2.tauri.app/distribute/windows-installer/

## Decision 3: Use one draft GitHub Release as the matrix rendezvous

**Decision**: A preparation job validates the tag, creates or reuses one draft
pre-release, and clears any existing draft assets by API ID. Two dependent
platform jobs use `tauri-apps/tauri-action@v1` to build concurrently, then use
GitHub CLI to upload stable ASCII filenames with Chinese display labels. A
final job publishes the pre-release only after both platform jobs succeed and
exactly the two expected assets exist.

**Rationale**: Tauri's official action supports native platform bundles and
explicit bundle arguments. GitHub documents that it may rename asset filenames
containing special or non-alphanumeric characters, so ASCII download filenames
are necessary for deterministic API verification; GitHub's asset label retains
the Chinese product-facing name. Clearing a reused draft by numeric asset ID
also removes files whose names GitHub changed. Keeping the release draft until
the matrix is complete prevents partial releases from appearing finished.

**Alternatives considered**:

- Let each matrix leg create the release: rejected because concurrent creation
  creates avoidable race and retry ambiguity.
- Publish from each matrix leg: rejected because the first successful platform
  could expose an incomplete release.
- Upload workflow artifacts only: rejected because the requested distribution
  channel is GitHub Releases.

**Sources**:

- https://github.com/tauri-apps/tauri-action
- https://docs.github.com/en/rest/releases/assets
- https://cli.github.com/manual/gh_release_upload

## Decision 4: Treat initial packages as test-signed pre-releases

**Decision**: macOS CI builds use ad-hoc signing and Windows installers remain
unsigned until production certificates are configured. Release notes identify
both limitations in plain language, and the workflow publishes only as a
GitHub pre-release.

**Rationale**: The project has no Apple notarization or Windows signing
credentials. Hiding this would misrepresent platform trust warnings. Tauri
documents platform signing separately and notes custom signing requirements.

**Alternatives considered**:

- Publish as a normal release: rejected because it would imply production trust
  that the packages do not have.
- Block all packaging until certificates exist: rejected because the feature
  specification explicitly permits auditable test/pre-release packages.

**Sources**:

- https://v2.tauri.app/distribute/sign/macos/
- https://v2.tauri.app/distribute/sign/windows/

## Decision 5: Enforce one version across source metadata and tag

**Decision**: Add a repository validation script that requires
`package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` to share
the same semantic version and requires the release tag to equal `v<version>`.

**Rationale**: Tauri treats `tauri.conf.json` as the recommended application
version source, but this repository already carries the version in three
locations. Failing before bundle creation makes a mixed-version release
auditable and prevents accidental tag drift.

**Alternatives considered**:

- Trust only the Tauri version: rejected because the remaining visible version
  fields could drift and confuse maintainers.
- Rewrite versions inside CI: rejected because a release must come from the
  tagged source revision without generated source mutations.

**Source**:

- https://v2.tauri.app/distribute/
