# Quickstart: Matrix Puzzle Viewport Fit

## Baseline

At 1280x720, record document, board, scene, matrix, answer, and control bounds.
Expected pre-fix evidence:

- document height: 989px;
- round board height: 689px;
- scene height: 361px;
- matrix height: 294px.

## Targeted Audit

```bash
pnpm audit:curriculum
```

The audit must reject a matrix round with `sceneImage`.

## Browser Review

Review all six 图形补一补 rounds at 1280x720 and 375x812:

- desktop document height is no greater than viewport height;
- no `.scene-image-card` is rendered;
- one `.matrix-board` is rendered;
- matrix, choices, and controls do not overlap;
- matrix and article have no horizontal overflow.

Observed after the fix:

- all six desktop rounds have a 1280x720 document, one 516px-wide matrix, no
  scene, no scrollbar, and no matrix/choice/control overlap;
- all six mobile rounds at 375x812 have one 291px-wide matrix, no horizontal
  overflow, no cell-content overflow, and no matrix/choice/control overlap;
- combined tokens and the missing-cell marker remain contained and readable.

## Required Verification

```bash
pnpm build
pnpm audit:curriculum
pnpm release:nas
pnpm mac:install
git diff --check
```

## Final Evidence

- `pnpm build`: passed with 1,586 transformed modules.
- `pnpm audit:curriculum`: 40 games, 489 rounds, zero problems.
- `pnpm audit:voice-media`: 1,801/1,801 files checked, zero problems.
- `pnpm test:voice-assets`, `pnpm test:speech`, and `pnpm test:release`:
  16 tests passed.
- `pnpm release:nas`: wrote `release/nas-static` and
  `release/thinking-island-nas-static-0.1.0.zip`.
- `pnpm mac:install`: built, ad-hoc signed, and installed
  `/Applications/小小思考屋.app`; strict code-sign verification passed, built
  and installed executable hashes match, and the installed app launched.
- `git diff --check`: passed.
