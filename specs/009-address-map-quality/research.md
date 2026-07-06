# Research: Address-Map Logic Quality

## Decision: Keep The Slice To `logic-address-map`

**Rationale**: The cluster is self-contained, currently lacks targeted audit
coverage, and has answers that can be calculated from visible row-column
coordinates. This makes it a good next step after the route-step slice.

**Alternatives considered**:

- Broadly rewrite all remaining logic-house clusters: rejected because it would
  mix many reasoning models and weaken red-green verification.
- Generate new map images: rejected because the existing scene image plus grid
  is already sufficient for a point-and-say address task.

## Decision: Validate Answers From Row-Column Coordinates

**Rationale**: The correct answer must be computable from the visible grid.
Audit checks can parse an address, resolve row and column labels, and compare
the crossing cell to the answer. In reverse rounds, checks can locate the target
object and compute its address from the same labels.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a round whose answer
  does not match the grid.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Row-Then-Column Feedback

**Rationale**: Preschool children need a concrete routine: find the letter row,
then find the number column, then point to the crossing cell. Feedback and
parent prompts should preserve that routine instead of only announcing the
answer.

**Alternatives considered**:

- Only naming the final answer: rejected because it does not explain the map
  strategy.
- Introduce formal coordinate terminology: rejected because "row", "column",
  and "where they cross" are more natural for family play.

## Decision: Keep Choices As Visible Items Or Address Labels

**Rationale**: Address-to-object rounds should use visible grid items as
choices. Object-to-address rounds should use address labels that represent
plausible row or column mistakes without duplicating the answer.

**Alternatives considered**:

- Use pictures only for all choices: rejected because address labels are the
  point of reverse-coordinate rounds.
- Use unrelated distractors: rejected because distractors must represent common
  child mistakes, not noise.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, choices, success feedback, retries, and parent prompts
are spoken or exported as local audio lines. Voice-line and manifest
synchronization is a project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
