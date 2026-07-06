# Contract: Difference-Detective Audit Report

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

For `logic-difference-detective`, `problems[]` may include these additional
messages:

- `logic-difference-detective/<round-id>: difference round should show left and right picture groups`
- `logic-difference-detective/<round-id>: changed-item round should have exactly one changed position`
- `logic-difference-detective/<round-id>: changed-item answer should be the right-picture item at the changed position`
- `logic-difference-detective/<round-id>: changed-item success should name position, old item, and new item`
- `logic-difference-detective/<round-id>: changed-item retry should guide ordered left-to-right comparison`
- `logic-difference-detective/<round-id>: changed-item parentPrompt should ask for a left/right explanation`
- `logic-difference-detective/<round-id>: extra-item round should have exactly one extra right-picture item`
- `logic-difference-detective/<round-id>: extra-item answer should be the unmatched right-picture item`
- `logic-difference-detective/<round-id>: extra-item success should name shared items before the extra item`
- `logic-difference-detective/<round-id>: extra-item retry should ask the child to match left-picture items first`
- `logic-difference-detective/<round-id>: extra-item parentPrompt should ask what was matched and what remains`
- `logic-difference-detective/<round-id>: missing-item round should have exactly one missing left-picture item`
- `logic-difference-detective/<round-id>: missing-item answer should be the unmatched left-picture item`
- `logic-difference-detective/<round-id>: missing-item success should name shared items before the missing item`
- `logic-difference-detective/<round-id>: missing-item retry should ask the child to check each left-picture item`
- `logic-difference-detective/<round-id>: missing-item parentPrompt should ask what was found and what is missing`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any difference-detective finding exists.
