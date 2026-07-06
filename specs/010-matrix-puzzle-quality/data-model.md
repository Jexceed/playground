# Data Model: Matrix-Puzzle Logic Quality

## Matrix-Puzzle Round

Represents one `logic-matrix-puzzle` task.

**Fields**:

- `prompt`: Child-facing question. Must ask for the missing cell without
  abstract or worksheet-like wording.
- `instruction`: Strategy text. Must explain row-by-row comparison.
- `matrix`: Visible matrix with complete example rows and one missing cell.
- `choices`: Selectable values for the missing cell.
- `answer`: Correct value derived from the visible row rule.
- `success`: Feedback that names a complete example row, the missing row, and
  the answer.
- `retry`: Guidance that returns the child to a complete example row before
  filling the missing row.
- `parentPrompt`: Parent follow-up that asks the child to explain the same rule
  across rows.
- `abilityTags`: Reasoning tags such as two-dimensional pattern, ordered
  combination, count mapping, or multi-feature observation.

## Recognized Matrix Rule

A rule family that can derive the missing cell from visible examples.

**Validation rules**:

- Ordered combination: third cell equals first cell plus second cell in order.
- First-second-first repetition: third cell equals first cell.
- One-of-each rotation: each row contains one of every visible token in the rule
  set.
- Count-to-quantity: middle cell is a number and the third cell repeats the
  first cell that many times.
- Story combination: third cell combines the two visible phrase tokens in order.

## Missing Cell

The only `?` in the matrix.

**Validation rules**:

- Exactly one missing cell must exist.
- The missing row must have enough visible cells to apply one recognized rule.
- The derived answer must equal the round answer.
- Choices must include the derived answer exactly once.

## Rewrite Targets From Current Content

- The prompt uses "待补位置" wording, which is understandable but less natural
  than asking what belongs in the empty spot.
- Success feedback states the rule but does not name concrete example rows or
  the completed missing row.
- Retry and parent prompts are generic and do not preserve the first-row,
  second-row, missing-row explanation routine.
