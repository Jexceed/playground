# Map Visual Surface Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove ambiguous multi-surface spatial visuals and nested map-cell card frames from address, position, and route logic rounds.

**Architecture:** Add audit checks first, then make minimal data and renderer changes. Spatial rounds keep their existing answer logic, choices, and wording while using grids or visual groups as the single answer surface.

**Tech Stack:** React 19, TypeScript 5.8, Vite, pnpm, Node.js ESM audit script.

## Global Constraints

- Work remains on local `dev`; do not push.
- Runtime visuals and voice lines must stay local and auditable.
- Every changed task must be verified; final validation includes `pnpm build` and `pnpm audit:curriculum`.
- Update `docs/CHANGELOG.md` and `docs/TODO.md` for meaningful changes.

---

### Task 1: Red Audit Rules

**Files:**
- Modify: `scripts/audit-curriculum.mjs`
- Test: `pnpm audit:curriculum`

**Interfaces:**
- Consumes: existing `games` import and `problems` array in `scripts/audit-curriculum.mjs`
- Produces: audit failures for scene-plus-grid/group spatial rounds and nested address-grid `VisualToken` rendering

- [x] **Step 1: Add failing audit checks**

Add checks for spatial rounds in `logic-address-map`, `logic-position-map`, and
`logic-route-steps`, plus a source check that `AddressGrid` no longer renders
full `VisualToken` cards from grid cells.

- [x] **Step 2: Run audit to verify red**

Run: `pnpm audit:curriculum`

Expected: FAIL with visual-surface and nested-card problems.

### Task 2: Data And Renderer Fix

**Files:**
- Modify: `src/data/games.ts`
- Modify: `src/games/ProgressiveSetGame.tsx`
- Modify: `src/styles.css`
- Test: `pnpm audit:curriculum`

**Interfaces:**
- Consumes: existing `grid`, `visualGroups`, `visualMetaFor`, `VisualGlyph`, and `speak`
- Produces: spatial rounds without conflicting scene images and flat map cell tokens

- [x] **Step 1: Remove conflicting scene images**

Remove `sceneImage` from affected address-map, position-map, and route-step
rounds that already have grids or position groups.

- [x] **Step 2: Add flat map cell token**

Replace `VisualToken` inside `AddressGrid` cells with a flat icon-and-label
button that uses `visualMetaFor`, `VisualGlyph`, and `speak`.

- [x] **Step 3: Run audit to verify green**

Run: `pnpm audit:curriculum`

Expected: PASS with zero problems.

### Task 3: Docs And Final Verification

**Files:**
- Modify: `docs/build-generation-guide.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/TODO.md`
- Test: `pnpm build`, browser visual check, `git diff --check`

**Interfaces:**
- Consumes: completed visual-surface implementation
- Produces: maintained docs and local checkpoint

- [x] **Step 1: Update docs**

Record the single-surface rule and completed feature status.

- [x] **Step 2: Run final verification**

Run:

```bash
pnpm audit:curriculum
pnpm build
git diff --check
```

Expected: all commands exit successfully.

- [x] **Step 3: Browser visual check**

Start `pnpm dev` and inspect representative address-map, position-map, and
route-step rounds at desktop/mobile widths.

Expected: no duplicate spatial surface and no nested grid-cell cards.
