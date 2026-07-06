# Installable Packages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a shared static release package and packaging configuration for NAS native static deployment, Docker fallback, and Mac/Tauri installation.

**Architecture:** `pnpm build` remains the source production build. A tested Node release script copies `dist/` into `release/nas-static/`, adds `content/` boundary files, and writes metadata. Docker and Tauri consume static output rather than source game modules.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, pnpm, Node `node:test`, Nginx Docker fallback, Tauri 2 for macOS packaging.

## Global Constraints

- Work-in-progress stays on `dev`; do not push `main`.
- Deployment scripts must not import `src/data/games.ts` or runtime game modules.
- NAS native static deployment is primary; Docker is fallback only.
- Current TypeScript question bank remains built in during this phase.
- Final verification must include `pnpm build`, `pnpm audit:curriculum`, and `pnpm test:release`.

---

### Task 1: Release Script Test Surface

**Files:**
- Modify: `package.json`
- Create: `scripts/build-release.test.mjs`

**Interfaces:**
- Produces: `pnpm test:release`, which runs `node --test scripts/build-release.test.mjs`

- [ ] **Step 1: Add `test:release` script to `package.json`**

Add:

```json
"test:release": "node --test scripts/build-release.test.mjs"
```

- [ ] **Step 2: Write failing tests**

Create tests that import and execute the release script through a child process, assert missing `dist/` fails with a message containing `pnpm build`, and assert generated output includes `index.html`, `content/manifest.json`, and `release-manifest.json`.

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test:release`

Expected: FAIL because `scripts/build-release.mjs` does not exist yet.

### Task 2: Release Script Implementation

**Files:**
- Create: `scripts/build-release.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm release:nas`
- Produces: `release/nas-static/`

- [ ] **Step 1: Implement `scripts/build-release.mjs`**

Use Node `fs/promises` and `path` only. Validate `dist/index.html`, remove and recreate `release/nas-static/`, copy `dist/`, create `content/`, write `content/manifest.json`, `content/README.md`, and `release-manifest.json`.

- [ ] **Step 2: Add release command**

Add:

```json
"release:nas": "node scripts/build-release.mjs"
```

- [ ] **Step 3: Run green checks**

Run: `pnpm build && pnpm test:release && pnpm release:nas`

Expected: all commands exit 0 and `release/nas-static/` exists.

### Task 3: NAS And Content Docs

**Files:**
- Create: `docs/deployment.md`
- Create: `docs/content-package.md`

**Interfaces:**
- Consumes: release package structure from Task 2
- Produces: user-facing deployment instructions

- [ ] **Step 1: Document NAS native static first**

Describe copying `release/nas-static/` into ZSpace native static hosting or an open application/static web entry when available.

- [ ] **Step 2: Document Docker fallback**

Explain Docker is only for models without native static hosting and that it serves static files.

- [ ] **Step 3: Document content boundary**

Explain current built-in question bank, updateable images/audio/static content, and future JSON catalog migration.

### Task 4: Docker Fallback

**Files:**
- Create: `.dockerignore`
- Create: `Dockerfile`
- Create: `nginx.conf`
- Create: `docker-compose.yml`

**Interfaces:**
- Consumes: `dist/`
- Serves: static app on port `8080`

- [ ] **Step 1: Create Nginx static server config**

Configure SPA fallback to `/index.html` and long-lived cache for hashed assets.

- [ ] **Step 2: Create Dockerfile**

Use a build stage for `pnpm build` and an Nginx runtime stage. Do not run Vite at runtime.

- [ ] **Step 3: Create Compose fallback**

Expose `8080:80` and mount `./release/nas-static/content:/usr/share/nginx/html/content:ro`.

### Task 5: Mac/Tauri Packaging

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/build.rs`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/src/main.rs`

**Interfaces:**
- Produces: `pnpm mac:dev`
- Produces: `pnpm mac:build`

- [ ] **Step 1: Add Tauri CLI dependency and scripts**

Add `@tauri-apps/cli` as a dev dependency and scripts that run Tauri dev/build.

- [ ] **Step 2: Add minimal Tauri Rust app**

Create a no-custom-command Tauri app that loads the frontend build output.

- [ ] **Step 3: Verify as far as local prerequisites allow**

Run `pnpm mac:build` if Rust/Tauri prerequisites exist; otherwise record the exact missing prerequisite.

### Task 6: Final Docs And Verification

**Files:**
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/TODO.md`
- Modify: `specs/018-installable-packages/tasks.md`

- [ ] **Step 1: Update changelog and TODO**

Record completed packaging work and the follow-up JSON content migration.

- [ ] **Step 2: Mark Spec Kit tasks completed as they are finished**

Update checkboxes in `specs/018-installable-packages/tasks.md`.

- [ ] **Step 3: Final verification**

Run:

```bash
pnpm build
pnpm audit:curriculum
pnpm test:release
```

Expected: all exit 0.
