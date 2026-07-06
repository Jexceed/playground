# Data Model: Installable Packages

## ReleasePackage

- **name**: Stable package identifier, `thinking-island`
- **version**: Version from `package.json`
- **generatedAt**: ISO timestamp for the release run
- **sourceBuildDir**: Source build directory used to create the package, normally `dist`
- **outputDir**: Generated static package directory, normally `release/nas-static`
- **contentDir**: Deployment-owned content directory inside the package, `content`
- **files**: Required release files or directories that must exist after generation

**Validation Rules**:

- `sourceBuildDir` must exist before release generation.
- `index.html` must exist under `sourceBuildDir`.
- `contentDir` must exist in the generated package.
- The release package must not require source files under `src/` at runtime.

## ContentPackageBoundary

- **root**: `content/`
- **manifest**: `content/manifest.json`
- **readme**: `content/README.md`
- **assetsPolicy**: Documents that images and audio are static deployment assets, while the current question bank remains built in for this phase.

**Validation Rules**:

- The generated content manifest must be valid JSON.
- The manifest must identify the current phase as a boundary placeholder rather than a full question-bank export.

## DeploymentTarget

- **nasStatic**: Copy/upload target for NAS native static hosting or open application entries.
- **dockerFallback**: Static container target for NAS models without native static hosting.
- **macTauri**: macOS app bundle target consuming the same frontend build.

**Validation Rules**:

- All deployment targets must consume the same frontend build output.
- Docker fallback must not run a development server.
