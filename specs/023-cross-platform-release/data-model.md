# Data Model: Cross-Platform Desktop Release

The feature does not add runtime application data. These entities describe
release inputs, generated packages, and audit evidence.

## Release Version

| Field | Type | Validation |
|---|---|---|
| `version` | semantic version string | Identical in `package.json`, Tauri config, and Cargo package metadata |
| `tag` | Git tag string | Exactly `v<version>` |
| `sourceRevision` | Git commit SHA | The commit checked out from the tag |

Relationships:

- One Release Version has exactly two required Platform Packages.
- One Release Version has one Release Record.

## Platform Package

| Field | macOS package | Windows package |
|---|---|---|
| `platform` | `macOS` | `Windows` |
| `architecture` | `arm64` | `x64` |
| `targetTriple` | `aarch64-apple-darwin` | `x86_64-pc-windows-msvc` |
| `bundleType` | `dmg` | `nsis` |
| `extension` | `.dmg` | `.exe` |
| `downloadFilename` | `thinking-island-<version>-macos-arm64.dmg` | `thinking-island-<version>-windows-x64-setup.exe` |
| `displayLabel` | `小小思考屋 macOS ARM64 安装包` | `小小思考屋 Windows x64 安装包` |
| `signingStatus` | ad-hoc/test | unsigned/test |

Validation rules:

- Download filename uses GitHub-stable ASCII characters and includes product,
  version, platform, and architecture.
- Display label preserves the Chinese product name.
- Package originates from the Release Version's source revision.
- Both packages must exist before the Release Record can leave Draft.

## Release Record

| Field | Type | Validation |
|---|---|---|
| `tag` | string | Matches the Release Version tag |
| `state` | enum | `Absent`, `Draft`, or `PublishedPrerelease` |
| `prerelease` | boolean | Always `true` while production signing is incomplete |
| `assets` | package list | Exactly the two required package kinds before publication |
| `notes` | text | Names supported computers and installation trust warnings |

State transitions:

```text
Absent -> Draft -> PublishedPrerelease
           |
           +-> Draft (any validation/build/upload failure)
```

A published release is terminal for the same tag in this workflow. Rerunning a
published tag must fail rather than overwrite assets from another attempt.

## Release Evidence

| Field | Evidence source |
|---|---|
| `sourceRevision` | GitHub Actions checkout and tag |
| `versionValidation` | Release validation script output |
| `projectBuild` | `pnpm build` job log |
| `curriculumAudit` | `pnpm audit:curriculum` job log |
| `configurationTests` | Node test job log |
| `platformBuilds` | Matrix job results |
| `signingStatus` | Release notes and workflow policy |

Release Evidence belongs to one Release Record and must be available from its
workflow run and release page.
