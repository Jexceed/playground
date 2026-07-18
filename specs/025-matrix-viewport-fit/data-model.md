# Data Model: Matrix Puzzle Viewport Fit

## Matrix-Puzzle Round

- `matrix.cells`: required 3x3 evidence grid with one `?`.
- `choices`: three distinct choices with one answer.
- `answer`: value derived from the visible row rule.
- `sceneImage`: absent; the matrix is the authoritative visual surface.

## Validation Rules

- Exactly one matrix exists per round.
- Exactly one missing cell exists.
- No separate scene image is attached.
- Existing answer, choices, feedback, retry, parent prompt, and order remain
  unchanged.
