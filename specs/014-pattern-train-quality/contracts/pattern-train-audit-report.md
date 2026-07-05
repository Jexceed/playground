# Contract: Pattern-Train Audit Report

The curriculum audit reports pattern-train issues through the existing
`problems` array printed by `pnpm audit:curriculum`.

## Finding Format

```text
logic-pattern-train/<round-id>: <message>
```

## Required Finding Types

- `pattern-train round should show a sequence`
- `pattern-train sequence should contain exactly one missing card`
- `pattern-train round should include a patternUnit`
- `pattern-train answer should match repeated pattern`
- `pattern-train choices should include the answer exactly once`
- `pattern-train choices should include at least three options`
- `pattern-train choices should stay tied to the visible pattern`
- `pattern-train success should name repeat unit, filled sequence, and answer`
- `pattern-train retry should name repeat unit or filled sequence and answer`
- `pattern-train parentPrompt should ask for a child explanation of the pattern`

## Passing Contract

For this feature to pass:

- `pnpm audit:curriculum` exits with code 0.
- Output JSON has `"problemCount": 0`.
- No finding starts with `logic-pattern-train/`.
