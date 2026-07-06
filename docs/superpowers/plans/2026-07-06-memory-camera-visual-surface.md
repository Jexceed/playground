# Memory Camera Visual Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove nested visual-card surfaces from `记忆小相机` memory slots.

**Architecture:** Add a source audit first, then update the local `MemoryBoard`
renderer to use a dedicated flat token. Keep `VisualToken` available for other
round surfaces.

**Tech Stack:** React 19, TypeScript 5.8, Vite, pnpm, Node.js ESM audit script.

## Global Constraints

- Work stays on local `dev`.
- No prompt, answer, feedback, image, or audio asset changes.
- Preserve memory-card tap-to-hear behavior.
- Final validation includes `pnpm audit:curriculum`, `pnpm build`, browser
  checks, and `git diff --check`.

---

### Task 1: Red Audit Rule

**Files:**
- Modify: `scripts/audit-curriculum.mjs`

**Interfaces:**
- Consumes: existing source text for `src/games/ProgressiveSetGame.tsx`.
- Produces: a failing audit when `MemoryBoard` renders nested `VisualToken`.

- [x] **Step 1: Add the source check**

Add a helper that isolates `function MemoryBoard` and reports a problem when it
contains `<VisualToken`.

- [x] **Step 2: Verify red**

Run: `pnpm audit:curriculum`

Expected: FAIL with `MemoryBoard renderer should use flat memory-card tokens
instead of nested VisualToken cards`.

### Task 2: Flat Memory Renderer

**Files:**
- Modify: `src/games/ProgressiveSetGame.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `visualMetaFor`, `VisualGlyph`, `labelForVoice`, and `speak`.
- Produces: `MemoryCardToken` renderer and `.memory-card-token` styles.

- [x] **Step 1: Add `MemoryCardToken`**

Render one button per slot with an icon, a label, and covered-state support.

- [x] **Step 2: Replace nested `VisualToken` in `MemoryBoard`**

Use `MemoryCardToken` for both visible and covered states.

- [x] **Step 3: Add responsive CSS**

Make memory tokens fit three- and four-item rows on desktop and mobile.

- [x] **Step 4: Verify green**

Run: `pnpm audit:curriculum`

Expected: `problemCount 0`.

### Task 3: Docs And Final Verification

**Files:**
- Modify: `docs/build-generation-guide.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `specs/017-memory-camera-visual-surface/tasks.md`
- Modify: `specs/017-memory-camera-visual-surface/quickstart.md`

**Interfaces:**
- Consumes: completed implementation and verification results.

- [x] **Step 1: Update docs**

Record the new memory-camera visual-surface rule and user-visible change.

- [x] **Step 2: Run final commands**

Run:

```bash
pnpm audit:curriculum
pnpm build
git diff --check
```

Expected: all commands exit successfully.

- [x] **Step 3: Browser check**

Inspect `记忆小相机` before and after covering on desktop and mobile widths.
