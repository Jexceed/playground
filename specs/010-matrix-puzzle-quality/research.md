# Research: Matrix-Puzzle Logic Quality

## Decision: Keep The Slice To `logic-matrix-puzzle`

**Rationale**: The cluster is self-contained, currently lacks targeted audit
coverage, and uses matrix answers that can be derived from visible row examples.
This makes it a good next step after address-map work.

**Alternatives considered**:

- Broadly rewrite all remaining logic-house clusters: rejected because it would
  mix many reasoning models and weaken red-green verification.
- Generate new matrix artwork: rejected because existing visual tokens and the
  pattern-puzzle scene already provide inspectable visuals.

## Decision: Validate Answers From Recognized Row Rules

**Rationale**: The correct answer must be computable from the visible matrix.
Audit checks can recognize the current row-rule families: ordered combination,
first-second-first repetition, one-of-each rotation, count-to-quantity, and
two-clue story combination.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a round whose answer
  does not match the visual matrix.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Example-Row Feedback

**Rationale**: Matrix reasoning is easier for a 4-year-old when the parent can
point to a complete row, say what happened there, then repeat the same rule on
the missing row. Feedback should include at least one concrete example row and
the completed missing row.

**Alternatives considered**:

- Only naming the abstract rule: rejected because it does not fully support
  parent-child explanation.
- Add formal row/column notation: rejected because row examples are more
  natural for family play than coordinate language in this cluster.

## Decision: Keep Choices As Existing Visual Tokens Or Phrases

**Rationale**: The current choices are visible tokens or phrase tokens already
supported by the app. Distractors should remain close rule mistakes, such as
reversed order, wrong count, or wrong missing item.

**Alternatives considered**:

- Replace all choices with text explanations: rejected because the child should
  select the missing visual cell.
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
