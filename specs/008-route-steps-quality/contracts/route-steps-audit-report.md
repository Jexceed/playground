# Contract: Route-Step Audit Report

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

For `logic-route-steps`, `problems[]` may include these additional messages:

- `logic-route-steps/<round-id>: route-step round should show a rectangular grid`
- `logic-route-steps/<round-id>: route-step prompt should name a grid start item`
- `logic-route-steps/<round-id>: route-step start item should appear exactly once in the grid`
- `logic-route-steps/<round-id>: route-step prompt should contain one or two supported one-cell moves`
- `logic-route-steps/<round-id>: route-step move should stay inside the grid`
- `logic-route-steps/<round-id>: route-step answer should equal the computed destination`
- `logic-route-steps/<round-id>: route-step choices should include the computed destination exactly once`
- `logic-route-steps/<round-id>: route-step one-step success should name start, direction, and destination`
- `logic-route-steps/<round-id>: route-step one-step retry should ask for exactly one move from the start`
- `logic-route-steps/<round-id>: route-step one-step parentPrompt should ask the child to point one move from the start`
- `logic-route-steps/<round-id>: route-step two-step success should name start, first destination, second move, and final destination`
- `logic-route-steps/<round-id>: route-step two-step retry should ask for first destination before second move`
- `logic-route-steps/<round-id>: route-step two-step parentPrompt should ask for first destination, second destination, and final answer`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any route-step finding exists.
