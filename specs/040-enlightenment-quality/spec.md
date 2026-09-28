# 启蒙题目与操作质量优化

## User request

“现在探索阶段做的不错，启蒙阶段进行优化，避免一些题目和内容不合理。”

## Scope

Review all 40 enlightenment groups / 489 rounds at baseline 23e07a5, including numeric variants, narrative conditions, choices, explanations, local pictures, speech and shared legacy interactions. Correct confirmed defects, retain useful parent-child challenge, and preserve exploration content. This is technical/content review, not a claim of developmental calibration with children.

## User stories

### US1 — A coherent, answerable activity (P1)

A child and parent can obtain the intended answer from the actual stated or drawn evidence. Counts, diagrams, prompts, options, feedback and parent prompts agree. No decorative quantity contradicts the task; no unsupported certainty, irrelevant distractor or invisible prerequisite is required. Record review disposition and evidence for every group and all data variants.

### US2 — A fair observation and answer flow (P1)

Observation begins when ready. A child can review memory cues intentionally without being graded while the evidence is visible. Answer order does not follow a learnable A/B/C cycle. Navigation and completion reflect actual work, including when jumping between rounds.

### US3 — A reliable installed experience (P1)

Existing stable IDs, completion facts and section locations remain intact. Exploration content remains unchanged. Changed speech is regenerated using the local standard Edge voices. The normal Mac app is rebuilt and installed, and representative corrected interactions are tested in it.

## Acceptance / required evidence

- R1: Baseline and final group/round inventory, plus a 40-group review ledger covering prompt, evidence, unique answer, distractors, feedback and parenting explanation. Numeric/geometric variants use independent oracles where feasible; narrative variants are individually reviewed.
- R2: Confirmed defects have explicit before/after evidence and focused semantic or behavioral regression checks. No unreviewed family is silently classified as passed.
- R3: Observation readiness, hiding, retry, re-observation, round jumps and section return are checked; the visible answer cannot be submitted during an observation-only phase. Changing selection never auto-grades.
- R4: Keep all legacy round/group IDs and progress storage facts; no mastery inferred from completion, no completion invented for skipped rounds. Document any semantic correction without deleting old history.
- R5: All exploration data and unrelated artwork remain intact; no universal compact styling change that regresses the confirmed exploration layout.
- R6: `pnpm build`, `pnpm audit:curriculum`, relevant existing and new regressions pass. Changed voice lines are exported and generated, manifest/media audit pass with no failures or macOS/mixed-local provider.
- R7: Record browser checks and real installed Mac checks separately. Run `pnpm mac:install`; verify installed binary identity and signature. Retain screenshots and honest acceptance boundaries.
- R8: Update docs/CHANGELOG.md and docs/TODO.md, and close tasks only with current evidence.

## Constraints

One app with 启蒙/探索, original local assets preferred, parent-child discussion preserved. Work in existing dev worktree. No new services or runtime packages needed. Do not dilute stronger optional challenges solely because L1–L6 is not an age scale. Existing clock-design intent remains relevant: scene-based 12-hour to 24-hour reading must use adequate day/night evidence, not reveal the answer through explicit day-part labels.
