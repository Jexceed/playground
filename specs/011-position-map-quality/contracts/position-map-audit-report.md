# Contract: Position-Map Audit Report

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

For `logic-position-map`, `problems[]` may include these additional messages:

- `logic-position-map/<round-id>: position-map neighbor round should show a rectangular grid`
- `logic-position-map/<round-id>: position-map neighbor target should appear exactly once`
- `logic-position-map/<round-id>: position-map neighbor move should stay inside the grid`
- `logic-position-map/<round-id>: position-map neighbor answer should equal the computed neighbor`
- `logic-position-map/<round-id>: position-map neighbor choices should include the computed answer exactly once`
- `logic-position-map/<round-id>: position-map neighbor success should name target, direction, one-cell move, and answer`
- `logic-position-map/<round-id>: position-map neighbor retry should ask the child to start at target and move one cell`
- `logic-position-map/<round-id>: position-map neighbor parentPrompt should ask the child to point from target to answer`
- `logic-position-map/<round-id>: position-map inside/outside round should show inside and outside groups`
- `logic-position-map/<round-id>: position-map inside/outside answer should belong to the requested group`
- `logic-position-map/<round-id>: position-map inside/outside choices should include the answer exactly once`
- `logic-position-map/<round-id>: position-map inside/outside success should contrast inside and outside`
- `logic-position-map/<round-id>: position-map inside/outside retry should name answer and contrast group`
- `logic-position-map/<round-id>: position-map inside/outside parentPrompt should ask the child to point to both groups`
- `logic-position-map/<round-id>: position-map relative direction source and target should appear exactly once`
- `logic-position-map/<round-id>: position-map relative direction answer should point from source to target`
- `logic-position-map/<round-id>: position-map relative direction choices should include the computed direction exactly once`
- `logic-position-map/<round-id>: position-map relative success should name source, target, and direction`
- `logic-position-map/<round-id>: position-map relative retry should ask the child to start from the source`
- `logic-position-map/<round-id>: position-map relative parentPrompt should ask the child to point from source to target`
- `logic-position-map/<round-id>: position-map prompt should be a supported neighbor, inside/outside, or relative direction question`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any position-map finding exists.
