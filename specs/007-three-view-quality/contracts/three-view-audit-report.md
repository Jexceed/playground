# Contract: Three-View Audit Report

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

For `logic-three-view-blocks`, `problems[]` may include these additional
messages:

- `logic-three-view-blocks/<round-id>: three-view top round should show a numeric grid`
- `logic-three-view-blocks/<round-id>: three-view top answer should equal the count of non-zero positions`
- `logic-three-view-blocks/<round-id>: three-view top success should explain visible positions and final count`
- `logic-three-view-blocks/<round-id>: three-view top retry should ask for non-zero positions, not layer totals`
- `logic-three-view-blocks/<round-id>: three-view top parentPrompt should ask the child to point to visible and empty positions`
- `logic-three-view-blocks/<round-id>: three-view front round should show a numeric grid`
- `logic-three-view-blocks/<round-id>: three-view front answer should equal column maximums from left to right`
- `logic-three-view-blocks/<round-id>: three-view front choices should include the correct column-maximum answer`
- `logic-three-view-blocks/<round-id>: three-view front choices should use one height per visible column`
- `logic-three-view-blocks/<round-id>: three-view front success should name front view, columns, highest stacks, and final answer`
- `logic-three-view-blocks/<round-id>: three-view front retry should ask the child to read columns without adding`
- `logic-three-view-blocks/<round-id>: three-view front parentPrompt should ask for column heights and hidden stacks`
- `logic-three-view-blocks/<round-id>: three-view left round should show a numeric grid`
- `logic-three-view-blocks/<round-id>: three-view left answer should equal row maximums from top to bottom`
- `logic-three-view-blocks/<round-id>: three-view left choices should include the correct row-maximum answer`
- `logic-three-view-blocks/<round-id>: three-view left choices should use one height per visible row`
- `logic-three-view-blocks/<round-id>: three-view left success should name left view, rows, highest stacks, and final answer`
- `logic-three-view-blocks/<round-id>: three-view left retry should ask the child to read rows without adding`
- `logic-three-view-blocks/<round-id>: three-view left parentPrompt should ask for row heights and hidden stacks`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any three-view finding exists.
