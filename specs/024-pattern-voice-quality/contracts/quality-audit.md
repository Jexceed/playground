# Quality Audit Contract

## Pattern Findings

`pnpm audit:curriculum` reports findings with the existing context prefix:

```text
logic-pattern-train/<round-id>: <message>
```

Required findings include:

- `pattern token should use a registered local PNG`
- `pattern token runtime image is missing`
- `pattern token source image is missing`
- `size pattern choices should stay within the size family`
- `size pattern diameters should have a clear ordered progression`

## Voice Media Command

```bash
pnpm audit:voice-media
```

Success output is a JSON summary with:

- `manifestCount`
- `checkedCount`
- `problemCount`
- `problems`
- `minimumHanSeconds`

Exit code is zero only when `problemCount` is zero.

Each problem uses:

```text
<entry-id>: <reason>
```

Required reasons include:

- `voice file is missing`
- `voice file has no complete MP3 frames`
- `voice file ends with a truncated MP3 frame`
- `voice duration <actual>s is below <minimum>s for <han-count> Han characters`

## Generator Behavior

The standard Edge generator:

1. Inspects an existing output before reuse.
2. Deletes invalid cached output.
3. Inspects each newly generated output.
4. Deletes invalid output before retry.
5. Adds only passing media to `manifest.json`.
6. Records an exhausted generation/validation error in `failures`.

## Completion Condition

No pattern finding starts with `logic-pattern-train/`, voice media
`problemCount` is zero, the standard manifest metadata is exact, and the voice
orphan scan is empty.
