# Changelog

All meaningful project changes should be recorded here. Keep entries factual and
grouped by date.

## 2026-07-04

- Added the `002-logic-house-quality` Spec Kit feature for stricter logic-house
  curriculum quality gates.
- Expanded the curriculum audit to check choice meaning, child-facing choice
  wording, sorter rule explainability, and logic difficulty-note quality.
- Reworked `logic-sorter-switch` prompts, feedback, retry guidance, and parent
  prompts so color/shape rules and two-condition mistakes are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten sorter content.
- Added the `003-same-kind-quality` Spec Kit feature for same-kind and
  odd-one-out logic quality.
- Expanded the curriculum audit with same-kind rule explanations, odd-one-out
  majority-group checks, and same-kind choice visual cue coverage.
- Reworked `logic-same-kind-detective` prompts, retries, success feedback, and
  parent prompts so category rules and odd-one-out reasons are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten same-kind content.
- Added the `004-visual-match-quality` Spec Kit feature for exact-match and
  odd-card visual comparison quality.
- Expanded the curriculum audit with visual-match checks for sample-card
  matching, close distractors, matching-pair structure, and feedback clarity.
- Reworked `logic-visual-match` instructions, success feedback, retry guidance,
  and parent prompts so every round explains left-to-right matches or the
  matching pair before the different card.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten visual-match content.
- Added the `005-difference-detective-quality` Spec Kit feature for changed,
  extra, and missing item comparison quality.
- Expanded the curriculum audit with difference-detective checks for left/right
  row structure, changed positions, shared-item matching, and feedback clarity.
- Reworked `logic-difference-detective` feedback, retry guidance, and parent
  prompts so changed-item, extra-item, and missing-item rounds explain the
  visible comparison evidence.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten difference-detective content.
- Added the `006-block-height-quality` Spec Kit feature for top-view block
  height map counting and comparison quality.
- Expanded the curriculum audit with block-height checks for visible sums, row
  totals, explicit compare labels, and left/right total explanations.
- Reworked `logic-block-height-map` success feedback, compare choices, retry
  guidance, and parent prompts so rows and left/right totals are explained
  before selecting a total or comparison.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten block-height content.
- Added the `007-three-view-quality` Spec Kit feature for top, front, and left
  view block reasoning quality.
- Expanded the curriculum audit with three-view checks for top-view non-zero
  counts, front-view column maximums, left-view row maximums, active-view
  guidance, and side-view choice sequence length.
- Reworked `logic-three-view-blocks` success feedback, retry guidance, parent
  prompts, and side-view distractors so each round explains the active viewpoint
  and uses one height per visible column or row.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten three-view content.
- Added the `008-route-steps-quality` Spec Kit feature for one-step and two-step
  route reasoning quality.
- Expanded the curriculum audit with route-step checks that compute destinations
  from visible grids, validate ordered moves, and require start/intermediate/final
  explanation text.
- Reworked `logic-route-steps` success feedback, retry guidance, and parent
  prompts so each round names the start item, direction moves, first landing
  spot, and final destination.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten route-step content.
- Added the `009-address-map-quality` Spec Kit feature for row-column address
  map reasoning quality.
- Expanded the curriculum audit with address-map checks that compute hidden
  objects from addresses, compute addresses from target objects, and require
  row-column explanation text.
- Reworked `logic-address-map` success feedback, retry guidance, and parent
  prompts so each round names the row, column, crossing cell, object, and final
  address where relevant.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten address-map content.
- Added the `010-matrix-puzzle-quality` Spec Kit feature for matrix row-rule
  reasoning quality.
- Expanded the curriculum audit with matrix-puzzle checks that derive missing
  cells from visible row rules and require example-row explanation text.
- Reworked `logic-matrix-puzzle` prompts, success feedback, retry guidance, and
  parent prompts so each round names a complete example row, the missing row,
  and the final answer.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten matrix-puzzle content.
- Initialized GitHub Spec Kit with Codex skills integration.
- Established the project constitution in `.specify/memory/constitution.md`.
- Expanded `AGENTS.md` with project overview, source-of-truth rules,
  Spec-Driven Development workflow, asset taxonomy, and documentation hygiene.
- Moved historical Obsidian notes under `docs/archive/`.
- Renamed image asset category `avatars` to `characters` to separate reusable
  roles from non-character items.
- Added `docs/assets.md` as the source of truth for image and audio asset rules.
- Added this changelog and `docs/TODO.md` for ongoing project maintenance.
