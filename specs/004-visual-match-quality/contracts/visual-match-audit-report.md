# Contract: Visual-Match Audit Report

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

For `logic-visual-match`, `problems[]` may include these additional messages:

- `logic-visual-match/<round-id>: visual-match exact round should show one sample card`
- `logic-visual-match/<round-id>: visual-match exact round answer should equal the sample card`
- `logic-visual-match/<round-id>: visual-match exact round should include exactly one matching choice`
- `logic-visual-match/<round-id>: visual-match exact success should name the matched card and visible comparison`
- `logic-visual-match/<round-id>: visual-match exact retry should require left-to-right all-parts comparison`
- `logic-visual-match/<round-id>: visual-match exact parentPrompt should ask why a close card is different`
- `logic-visual-match/<round-id>: visual-match odd-card round should show exactly three cards`
- `logic-visual-match/<round-id>: visual-match odd-card round should have exactly two matching cards`
- `logic-visual-match/<round-id>: visual-match odd-card answer should point to the different card`
- `logic-visual-match/<round-id>: visual-match odd-card choices should be left, middle, and right positions`
- `logic-visual-match/<round-id>: visual-match odd-card success should name the matching pair and difference`
- `logic-visual-match/<round-id>: visual-match odd-card retry should ask the child to find the matching pair first`
- `logic-visual-match/<round-id>: visual-match odd-card parentPrompt should ask for the matching pair and visible difference`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any visual-match finding exists.
