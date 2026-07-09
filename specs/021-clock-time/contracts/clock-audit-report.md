# Contract: Clock Audit Report

`pnpm audit:curriculum` continues to print a JSON report with the existing
top-level shape:

```json
{
  "totalGames": 0,
  "totalRounds": 0,
  "counts": {
    "math": 0,
    "logic": 0,
    "graphic": 0
  },
  "problems": []
}
```

## New Clock Findings

The audit must add human-readable strings to `problems` when any of these
conditions occur:

- `math-clock-time` game is missing from 数字岛.
- `math-clock-time` does not contain exactly 12 rounds.
- A clock round is missing `clockChallenge`.
- A clock round uses a minute value other than 0 or 30.
- Fewer than four whole-hour rounds, fewer than four half-hour rounds, or fewer
  than four time-conversion rounds exist.
- A clock round answer is missing from choices or appears more than once.
- A clock reading round's feedback does not name `长针` and `短针`.
- A time-conversion round lacks a registered scene image, leaks day-part labels
  before answering, has non-`HH:MM` choices, or does not explain scene evidence
  and 24-hour electronic clock time.
- Duplicate clock signatures are found.

Each problem string must include enough game/round context to locate the source
round.
