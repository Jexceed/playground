# TODO

Track follow-up work here when it is not part of the current spec. Keep items
small enough to turn into a Spec Kit feature.

## P0

- None.

## P1

- Migrate the built-in TypeScript question bank to validated JSON content packs
  under `content/`, including schema validation, fallback behavior, and
  curriculum audit coverage.
- Convert future feature work to the full Spec Kit cycle: `spec.md`, `plan.md`,
  `tasks.md`, implementation, verification, changelog update.
- Add automated audit coverage for image source-file pairing where practical.
- Review remaining text-only `VisualToken` fallbacks and decide which need
  raster assets.
- Add deeper automated browser smoke checks for persisted navigation state after
  the first manual coverage in `016-visual-choice-session-memory`.
- Run a broader logic-house completion review after the audited clusters
  `logic-pattern-train`, `logic-sorter-switch`,
  `logic-same-kind-detective`, `logic-visual-match`,
  `logic-difference-detective`, `logic-block-height-map`,
  `logic-three-view-blocks`, `logic-route-steps`, `logic-address-map`,
  `logic-matrix-puzzle`, `logic-position-map`, `logic-memory-camera`, and
  `logic-order-plan`; include a visual-surface pass like
  `015-map-visual-surface-quality`, and add targeted audits for any remaining cluster whose
  picture, text, audio, option quality, or parent explanation is still weak.

## P2

- Revisit archived Obsidian notes and extract any still-useful product decisions
  into maintained docs.
- Consider a lightweight asset manifest report that lists registered but unused
  assets and files that exist but are not registered.
- Add screenshot-based smoke checks for representative desktop and mobile game
  layouts.
- If richer illustrated maps are desired later, generate each map as the single
  answer surface from the same grid data instead of stacking a decorative scene
  above a separate answer grid.
