# Contract: Curriculum Audit Report

The curriculum audit is the maintainer-facing quality gate for this feature.

## Command

```bash
pnpm audit:curriculum
```

## Success Output

The command prints JSON with at least these fields:

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

Rules:

- `problemCount` must be `0`.
- `problems` must be an empty array.
- Existing count fields may change only when content count intentionally
  changes and the spec/task records the reason.
- The process must exit with status `0`.

## Failure Output

When blocking quality issues exist, the command prints JSON with:

```json
{
  "problemCount": 1,
  "problems": [
    "logic-sorter-switch/logic-sorter-switch-1: duplicate choice meaning"
  ]
}
```

Rules:

- Each problem string must include enough context to identify the game and
  round when the issue is round-specific.
- Findings must be deterministic for the same source tree.
- The process must exit with a non-zero status when any problem exists or when
  required target counts are not met.

## New Finding Categories

- Duplicate or repeated choice meaning.
- Choice wording that is vague, trick-like, double-negative, or unrelated.
- Child-facing text that is too abstract for the visible surface.
- Logic-house round whose feedback does not explain the clue, rule, or reason.
- Changed voice-line source that is not reflected in the local voice manifest.
