# Contract: Same-Kind Audit Report

Same-kind quality findings are reported through the existing curriculum audit.

## Command

```bash
pnpm audit:curriculum
```

## Success Output

```json
{
  "problemCount": 0,
  "problems": []
}
```

Rules:

- The process exits with status `0`.
- `problems` contains no same-kind findings.
- Existing math and logic count targets remain met.

## Failure Output

```json
{
  "problemCount": 1,
  "problems": [
    "logic-same-kind-detective/logic-same-kind-detective-1: same-kind retry should name the grouping rule"
  ]
}
```

Rules:

- Each finding must include game and round context.
- Findings must be deterministic for the same source tree.
- Any problem exits non-zero.

## Finding Categories

- Same-kind retry does not name or point to the grouping rule.
- Same-kind success does not explain why the answer joins the group.
- Same-kind parent prompt does not ask for a concrete rule or reason.
- Odd-one-out success does not name the majority group and the different card.
- Odd-one-out retry does not ask the child to find the majority group first.
