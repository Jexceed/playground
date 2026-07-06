# Contract: Matrix-Puzzle Audit Report

`pnpm audit:curriculum` must continue to print a JSON report with the existing
top-level shape:

```json
{
  "math": 110,
  "logic": 316,
  "totalGames": 33,
  "totalRounds": 426,
  "mathTargetMet": true,
  "logicTargetMet": true,
  "problemCount": 0,
  "problems": []
}
```

## New Finding Rules

For `logic-matrix-puzzle`, `problems[]` may include these additional messages:

- `logic-matrix-puzzle/<round-id>: matrix puzzle should show a matrix with one missing cell`
- `logic-matrix-puzzle/<round-id>: matrix puzzle should use a recognized visible row rule`
- `logic-matrix-puzzle/<round-id>: matrix puzzle answer should equal the derived missing cell`
- `logic-matrix-puzzle/<round-id>: matrix puzzle choices should include the derived answer exactly once`
- `logic-matrix-puzzle/<round-id>: matrix puzzle success should name an example row, missing row, and answer`
- `logic-matrix-puzzle/<round-id>: matrix puzzle retry should ask for a complete example row before the missing row`
- `logic-matrix-puzzle/<round-id>: matrix puzzle parentPrompt should ask the child to explain the same rule across rows`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any matrix-puzzle finding exists.
