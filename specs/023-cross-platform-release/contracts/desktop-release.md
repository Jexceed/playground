# Contract: Desktop Release Workflow

## Triggers

### Version tag

- Event: push of `v*.*.*`
- Release tag: pushed tag
- Source revision: commit referenced by that tag

### Manual verification

- Event: `workflow_dispatch`
- Required input: `release_tag`
- Input format: `v<major>.<minor>.<patch>`
- Source revision: commit referenced by the existing input tag

Manual runs do not invent a version or package an arbitrary branch. The supplied
tag must already exist so every release remains traceable.

## Required quality gates

Before platform packaging begins, the workflow must pass:

1. dependency installation from the lockfile;
2. desktop release configuration tests;
3. source/tag version validation;
4. `pnpm build`;
5. `pnpm audit:curriculum`.

Any failed gate prevents platform jobs from starting.

## Release preparation

- Create one GitHub draft pre-release for the validated tag.
- If a draft pre-release already exists for the same tag, reuse it for a safe
  retry.
- If a non-draft release already exists, fail without changing it.
- Release notes must identify:
  - Apple Silicon Mac support;
  - 64-bit Windows 10/11 support;
  - Intel Mac exclusion;
  - macOS ad-hoc signing/notarization warning;
  - Windows unsigned installer warning.

## Platform build matrix

| Runner | Target | Bundle | Required asset name |
|---|---|---|---|
| `macos-15` | `aarch64-apple-darwin` | `dmg` | `小小思考屋_<version>_macOS-arm64.dmg` |
| `windows-2025` | `x86_64-pc-windows-msvc` | `nsis` | `小小思考屋_<version>_Windows-x64-setup.exe` |

Both matrix jobs upload to the prepared draft release. The workflow must not
upload updater metadata because automatic updates are outside scope.

## Finalization

- Runs only after both matrix legs succeed.
- Confirms both expected release assets exist.
- Changes the draft to a published GitHub pre-release.
- Leaves the release as a draft when a required job or asset check fails.

## Permissions

The workflow requires only repository contents read access for validation/build
jobs and contents write access for release preparation, asset upload, and
finalization through the repository-provided GitHub token.
