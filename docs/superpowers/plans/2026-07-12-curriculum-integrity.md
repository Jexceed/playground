# Curriculum Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Balance answer positions, correct reasoning/clock defects, and ship one
auditable Xiaoxiao-based local voice set.

**Architecture:** Apply deterministic placement at `makeSet`. Keep semantic fixes
in `games.ts`, enforce them in the curriculum audit, and isolate filesystem
pruning in a tested Node module.

**Tech Stack:** React, TypeScript, Node.js, Vite, Edge TTS, Tauri

## Global Constraints

- Balance per game and choice count without runtime randomness.
- Keep graphic drawings, values, and A/B/C/D aligned.
- Say hour hand (short hand) before minute hand (long hand).
- Use Edge Xiaoxiao at `-12%`, `+2Hz`; browser TTS is fallback-only.
- Finish with build, curriculum audit, NAS release, and Mac install.

---

### Task 1: Establish Failing Integrity Gates

**Files:** Modify `scripts/audit-curriculum.mjs`

**Interfaces:** Consumes imported games, manifest, and voice filesystem; produces
actionable `problems` entries.

- [ ] Add per-game/choice-count counts including zero-use positions; fail when
  max-minus-min > 1 or one index repeats over two rounds.
- [ ] Require `round.choices.map(value)` to match graphic options and A-D labels.
- [ ] Reject known bridge/rotation leakage, proximity-as-proof, minute-first
  clock guidance, nonstandard manifest identity, and orphan locale files.
- [ ] Run `pnpm audit:curriculum`; expect failures in all new categories.

### Task 2: Balance Choices

**Files:** Modify `src/data/games.ts`

**Interfaces:** Produce
`balanceRoundChoices(round: RoundInput, target: number): RoundInput`.

- [ ] In `makeSet`, maintain a `Map<number, number>` ordinal per choice count and
  set target to `ordinal % round.choices.length`.
- [ ] Remove the answer choice, insert it at target, preserve distractor order.
- [ ] If graphic, reorder options by new values and regenerate A-D labels.
- [ ] Run the audit; expect position/graphic checks to pass while content/voice
  checks remain red.

### Task 3: Correct Content and Clock Order

**Files:** Modify `src/data/games.ts`, `scripts/audit-curriculum.mjs`, and
`specs/021-clock-time/{spec.md,data-model.md,quickstart.md,contracts/clock-audit-report.md}`.

- [ ] Replace answer-stating bridge/rotation guidance with neutral operations.
- [ ] Replace spilled-water character accusation with an event-area evidence search.
- [ ] Construct every clock guidance field with hour/short hand before minute/long hand.
- [ ] Update feature 021 source-of-truth wording and audit expectations.
- [ ] Run `pnpm audit:curriculum`; expect only voice output/orphan findings.

### Task 4: Test and Implement Voice Pruning

**Files:** Create `scripts/prune-voice-assets.mjs` and
`scripts/prune-voice-assets.test.mjs`; modify `package.json`.

**Interfaces:** Export
`collectVoiceOrphans(rootDir: string, manifest: object): Promise<string[]>`; CLI
is `node scripts/prune-voice-assets.mjs [--write]`.

- [ ] Write tests for dry-run preservation, referenced-file preservation,
  write-mode orphan deletion, and root containment.
- [ ] Run `node --test scripts/prune-voice-assets.test.mjs`; expect missing-module failure.
- [ ] Implement with `fs/promises`, decoded URL paths, normalized absolute paths,
  and deletion only when `--write` is present.
- [ ] Add `test:voice-assets` and `prune:voice-assets` scripts.
- [ ] Run `pnpm test:voice-assets`; expect all tests to pass.

### Task 5: Regenerate, Document, and Release

**Files:** Modify audio under `public/audio/`, source under
`references/audio/launch-brand-shout/`, and maintained docs.

- [ ] Generate dedicated Xiaoxiao launch source and runtime WAV.
- [ ] Run the exact export and Edge generation commands from `AGENTS.md`.
- [ ] Run pruning in write mode; second dry run must report zero orphans.
- [ ] Update changelog, TODO, assets, and generation guide with measured results.
- [ ] Run all commands in `specs/022-curriculum-integrity/quickstart.md`.
- [ ] Create one local `dev` checkpoint commit after all gates pass; do not push.

