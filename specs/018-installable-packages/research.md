# Research: Installable Packages

## Decision: Use a static release package as the shared deployment artifact

**Rationale**: The application is a React/Vite single-page app with local assets. A static package is the smallest common denominator for NAS native hosting, Docker fallback, and desktop wrapping.

**Alternatives considered**:

- Build separate NAS and Mac artifacts directly from source: rejected because it couples deployment paths to source layout and duplicates release logic.
- Run Vite preview in production: rejected because it requires a Node runtime and is not an installable/static deployment.

## Decision: Make NAS native static hosting the documented first path

**Rationale**: The user prefers avoiding Docker on NAS. The release package can be copied into any NAS static web/app entry if the model exposes one.

**Alternatives considered**:

- Docker-first deployment: rejected because it adds operational complexity when static hosting is enough.
- ZSpace-specific proprietary package: deferred because public, stable packaging documentation is not available for all models.

## Decision: Keep Docker as static-file fallback only

**Rationale**: Public ZSpace materials describe Docker and Compose support on supported models, so Docker is a practical fallback. It should serve the generated files and mount `content/`, not rebuild the app at runtime.

**Alternatives considered**:

- Full Node server container: rejected because there is no backend runtime need.
- Container that runs `pnpm dev`: rejected because it is development behavior.

## Decision: Establish `/content/` contract before migrating question data

**Rationale**: The current question bank is large and compiled in TypeScript. Establishing the content boundary now gives deployment and update workflows a stable location without increasing risk by migrating all game data in the packaging change.

**Alternatives considered**:

- Immediate full JSON migration: rejected for this phase because it expands the blast radius beyond packaging and needs separate schema/audit work.
- No content boundary: rejected because it fails the user's loose-coupling requirement.

## Decision: Use Tauri for Mac packaging

**Rationale**: Tauri packages a frontend app with a smaller desktop wrapper than Electron and can point at the same build output.

**Alternatives considered**:

- Electron: rejected because it adds a larger runtime and no current need for Node desktop APIs.
- Browser-only PWA: useful later, but it does not create a native macOS installable package by itself.
