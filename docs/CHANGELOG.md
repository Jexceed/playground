# Changelog

All meaningful project changes should be recorded here. Keep entries factual and
grouped by date.

## 2026-07-06

- Added the `018-installable-packages` Spec Kit feature for NAS-first static
  packaging, Docker fallback, and Mac/Tauri installation.
- Added a tested `pnpm release:nas` workflow that turns the Vite production
  build into a copyable `release/nas-static/` package with a `content/`
  boundary, release manifest, and uploadable NAS zip archive.
- Added deployment documentation that treats ZSpace NAS native static hosting as
  the preferred path and Docker/Compose as fallback only.
- Added Tauri 2 configuration, generated app icons, and scripts for building
  the same frontend as a macOS `.app` bundle, with DMG packaging left as an
  optional command.
- Added the `017-memory-camera-visual-surface` Spec Kit feature for flattening
  `记忆小相机` memory slots.
- Expanded the curriculum audit with a source check that prevents `MemoryBoard`
  from nesting full visual-card tokens inside memory slots.
- Reworked memory-camera slots so visible and covered cards use flat
  icon-and-label tokens while preserving tap-to-hear behavior.
- Added the `016-visual-choice-session-memory` Spec Kit feature for visual-match
  choices, matrix-cell visual density, and last-opened-location restoration.
- Expanded the curriculum audit with source checks that prevent duplicated
  visual-card choice labels, nested matrix-cell visual cards, and missing
  last-location storage integration.
- Reworked exact visual-match answer buttons so visual-card choices render as
  compact cards without repeated raw symbol text, while position choices remain
  readable.
- Reworked matrix puzzle cells to use flat icon-and-label tokens instead of
  full cards nested inside matrix cells.
- Added separate local storage for the last opened world, game, and round so
  reopening the app restores the previous browsing position.
- Added the `015-map-visual-surface-quality` Spec Kit feature for spatial
  visual-surface clarity in address-map, position-map, and route-step rounds.
- Expanded the curriculum audit with checks that reject spatial rounds combining
  a grid or inside/outside group with a positional scene image.
- Added an audit check that prevents `AddressGrid` from nesting full visual-card
  tokens inside map cells.
- Removed conflicting scene images from affected address-map, position-map, and
  route-step rounds so each task has one authoritative spatial surface.
- Reworked map grid cells to use flat icon-and-label tokens with click-to-speak
  behavior instead of card frames inside card-like cells.

## 2026-07-05

- Added the `012-memory-camera-quality` Spec Kit feature for appeared-item,
  absent-item, and left-to-right order memory quality.
- Expanded the curriculum audit with memory-camera checks that normalize emoji
  cards to child-facing labels, validate appeared and absent answers, and derive
  order answers from the remembered sequence.
- Reworked `logic-memory-camera` success feedback, retry guidance, and parent
  prompts so each round names the remembered cards, answer, and recognition,
  exclusion, or sequence reasoning.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten memory-camera content.
- Added the `013-order-plan-quality` Spec Kit feature for missing-step sequence
  planning quality.
- Expanded the curriculum audit with order-plan checks that validate a single
  missing sequence slot, unique answer choice, and filled-sequence explanation
  text.
- Reworked `logic-order-plan` success feedback, retry guidance, and parent
  prompts so each round names the completed flow, the missing answer, and a
  left-to-right replay strategy.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten order-plan content.
- Added the `014-pattern-train-quality` Spec Kit feature for repeat-unit,
  missing-card, and choice-quality pattern reasoning.
- Expanded the curriculum audit with pattern-train checks that validate a single
  missing card, repeat-unit metadata, derived answers, at least three
  pattern-tied choices, and concrete feedback/retry/parent wording.
- Reworked `logic-pattern-train` choice generation, success feedback, retry
  guidance, and parent prompts so each round names the repeated unit, filled
  sequence, and answer.
- Exported updated voice lines and generated a mixed local voice manifest for
  the rewritten pattern-train content, preserving existing Edge entries and
  filling missing lines with the local macOS fallback when Edge DNS was blocked.

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
- Added the `011-position-map-quality` Spec Kit feature for spatial position,
  inside/outside, and viewpoint-relative direction quality.
- Expanded the curriculum audit with position-map checks that compute neighbor
  items from visible grids, validate inside/outside group membership, and derive
  relative directions from the named source item.
- Reworked `logic-position-map` success feedback, retry guidance, and parent
  prompts so each round names the reference item, direction or group contrast,
  answer, and child-pointing explanation.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten position-map content.
- Initialized GitHub Spec Kit with Codex skills integration.
- Established the project constitution in `.specify/memory/constitution.md`.
- Expanded `AGENTS.md` with project overview, source-of-truth rules,
  Spec-Driven Development workflow, asset taxonomy, and documentation hygiene.
- Moved historical Obsidian notes under `docs/archive/`.
- Renamed image asset category `avatars` to `characters` to separate reusable
  roles from non-character items.
- Added `docs/assets.md` as the source of truth for image and audio asset rules.
- Added this changelog and `docs/TODO.md` for ongoing project maintenance.
