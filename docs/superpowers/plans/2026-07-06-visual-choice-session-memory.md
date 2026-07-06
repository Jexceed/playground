# Visual Choice And Session Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve visual choice display, flatten matrix cells, and restore the last opened location across browser sessions.

**Architecture:** Add audit checks first, then update shared rendering and storage helpers. Visual rendering remains inside `ProgressiveSetGame`; app-level persistence remains inside `App` and `storage`.

**Tech Stack:** React 19, TypeScript 5.8, Vite, pnpm, Node.js ESM audit script.

## Global Constraints

- Keep work on local `dev`.
- Do not change round answers, prompts, or audio text for this slice.
- No new image or audio assets.
- Final validation includes `pnpm audit:curriculum`, `pnpm build`, browser checks, and `git diff --check`.

---

### Task 1: Red Audit Rules

**Files:**
- Modify: `scripts/audit-curriculum.mjs`

**Interfaces:**
- Consumes: existing source text reads and `problems` array.
- Produces: source-level audit failures before implementation.

- [x] **Step 1: Add checks**

Add checks for visual-choice duplicated rendering, nested `MatrixBoard`
`VisualToken`, and missing last-location helpers/app integration.

- [x] **Step 2: Verify red**

Run: `pnpm audit:curriculum`

Expected: FAIL with the new source-level findings.

### Task 2: Visual Rendering

**Files:**
- Modify: `src/games/ProgressiveSetGame.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `visualMetaFor`, `visualParts`, `VisualGlyph`, and `speak`.
- Produces: compact visual-card choices and flat matrix-cell tokens.

- [x] **Step 1: Implement renderers**

Add compact choice and matrix-cell token paths that avoid nested visual-card
frames while preserving click/speech behavior.

- [x] **Step 2: Verify green for renderers**

Run: `pnpm audit:curriculum`

Expected: visual-choice and matrix findings clear.

### Task 3: Last Location Persistence

**Files:**
- Modify: `src/types.ts`
- Modify: `src/storage.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `readLastPlayLocation()` and `saveLastPlayLocation(location)`.
- Consumes: `games`, `worlds`, selection state, and round navigation.

- [x] **Step 1: Add validated storage helpers**

Read corrupt data safely, validate world/game, and clamp round index in app code.

- [x] **Step 2: Wire App state**

Initialize selection state from storage and save changes on world/game/round
updates.

- [x] **Step 3: Verify green for storage**

Run: `pnpm audit:curriculum`

Expected: last-location findings clear.

### Task 4: Docs And Final Verification

**Files:**
- Modify: `docs/build-generation-guide.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/TODO.md`
- Modify: `specs/016-visual-choice-session-memory/tasks.md`
- Modify: `specs/016-visual-choice-session-memory/quickstart.md`

**Interfaces:**
- Consumes: completed implementation and verification results.

- [x] **Step 1: Update docs and task status**

Record the new rendering and session-memory rules.

- [x] **Step 2: Run final commands**

Run:

```bash
pnpm audit:curriculum
pnpm build
git diff --check
```

Expected: all commands exit successfully.

- [x] **Step 3: Browser check**

Inspect visual-match choices, matrix cells, and reload persistence on
representative desktop and mobile views.
