# Contract: Block-Height Audit Report

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

For `logic-block-height-map`, `problems[]` may include these additional messages:

- `logic-block-height-map/<round-id>: block-height total round should show a numeric grid`
- `logic-block-height-map/<round-id>: block-height total answer should equal the visible cell sum`
- `logic-block-height-map/<round-id>: block-height total success should name row totals and final total`
- `logic-block-height-map/<round-id>: block-height total retry should tell the child to add numbers, not count squares`
- `logic-block-height-map/<round-id>: block-height total parentPrompt should ask for row totals`
- `logic-block-height-map/<round-id>: block-height compare round should show left and right numeric maps`
- `logic-block-height-map/<round-id>: block-height compare answer should match the greater map or same amount`
- `logic-block-height-map/<round-id>: block-height compare choices should say left map more, right map more, and same amount`
- `logic-block-height-map/<round-id>: block-height compare success should name both totals and the comparison result`
- `logic-block-height-map/<round-id>: block-height compare retry should ask for left total, right total, then comparison`
- `logic-block-height-map/<round-id>: block-height compare parentPrompt should ask for both totals and the comparison`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any block-height finding exists.
