# Contract: Address-Map Audit Report

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

For `logic-address-map`, `problems[]` may include these additional messages:

- `logic-address-map/<round-id>: address-map round should show a rectangular row-column grid`
- `logic-address-map/<round-id>: address-map prompt should ask for an object at an address or an address for an object`
- `logic-address-map/<round-id>: address-map address prompt should use an address present in the grid`
- `logic-address-map/<round-id>: address-map address answer should equal the grid cell at the address`
- `logic-address-map/<round-id>: address-map address choices should include the grid cell exactly once`
- `logic-address-map/<round-id>: address-map address success should name address, row, column, and hidden object`
- `logic-address-map/<round-id>: address-map address retry should ask for row first, then column`
- `logic-address-map/<round-id>: address-map address parentPrompt should ask the child to point to the row-column intersection`
- `logic-address-map/<round-id>: address-map target prompt should name one visible grid item`
- `logic-address-map/<round-id>: address-map target answer should equal the target row-column address`
- `logic-address-map/<round-id>: address-map target choices should include the computed address exactly once`
- `logic-address-map/<round-id>: address-map target success should name target, row, column, and address`
- `logic-address-map/<round-id>: address-map target retry should ask for the item, then row and column`
- `logic-address-map/<round-id>: address-map target parentPrompt should ask the child to explain row letter and column number`

## Compatibility

- Existing report fields and pass/fail behavior must not change.
- Existing generic duplicate, visual-surface, image, and audio checks remain in
  force.
- The audit exits with status `1` when any address-map finding exists.
