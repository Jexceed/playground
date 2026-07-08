# Launch Brand Shout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the launch splash's ordinary TTS line with a dedicated local brand audio asset and retime the splash around it.

**Architecture:** Add audit coverage first, generate a local brand audio asset outside the curriculum manifest, then make `LaunchSplash` play that asset directly. Keep normal question voice generation unchanged.

**Tech Stack:** React, TypeScript, Vite, Node audit script, Edge TTS CLI, macOS `afconvert`, Python stdlib wave mixing.

## Global Constraints

- `AGENTS.md` requires local, auditable assets and browser TTS only as a fallback.
- Generated runtime assets must live under `public/`.
- App launch, local resources, and Mac behavior require `.app` preview before release sign-off.
- Minimum completion checks are `pnpm build` and `pnpm audit:curriculum`.

---

### Task 1: Audit Guard

**Files:**
- Modify: `scripts/audit-curriculum.mjs`

**Interfaces:**
- Consumes: `appSource` and filesystem checks already loaded by the audit.
- Produces: audit failures when the launch brand asset is missing or `LaunchSplash` uses normal `speak("小小思考屋")`.

- [ ] Add checks for `/audio/brand/launch-brand-shout.wav`.
- [ ] Run `pnpm audit:curriculum` and verify it fails before implementation.

### Task 2: Brand Audio Asset

**Files:**
- Create: `public/audio/brand/launch-brand-shout.wav`
- Create: `references/audio/launch-brand-shout/*`

**Interfaces:**
- Consumes: Edge TTS CLI from `./local-tts/.venv/bin/python -m edge_tts`.
- Produces: a short local WAV file suitable for direct startup playback.

- [ ] Generate a clean `小小思考屋！` brand shout source with the best available local TTS route.
- [ ] Convert the source to WAV with `afconvert`.
- [ ] Trim leading/trailing silence and add a short fade-out using Python stdlib.
- [ ] Keep only the final runtime WAV under `public/`; store source files under `references/`.

### Task 3: Launch Splash Wiring

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `/audio/brand/launch-brand-shout.wav`.
- Produces: direct launch audio playback and adjusted splash timing.

- [ ] Replace `speak("小小思考屋")` in `LaunchSplash` with direct `new Audio(...)` playback.
- [ ] Tune timers so the chorus lands after logo entry and the fade waits for the shout.
- [ ] Adjust CSS animation delays if needed to match the new rhythm.

### Task 4: Documentation And Verification

**Files:**
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/TODO.md` if follow-up work remains.

**Interfaces:**
- Consumes: completed code and asset changes.
- Produces: documented behavior and fresh verification output.

- [ ] Record the launch chorus change in `docs/CHANGELOG.md`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm audit:curriculum`.
