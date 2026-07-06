# Research: Visual-Match Logic Quality

## Decision: Keep The Slice To `logic-visual-match`

**Rationale**: The game is a self-contained card-comparison cluster with no new
scene-art dependency. It is the next TODO priority and can be validated through
structural audit rules before content rewrites.

**Alternatives considered**:

- Combine `logic-visual-match` and `logic-difference-detective`: rejected
  because difference-detective compares two panels and deserves separate audit
  rules.
- Start with block-height or three-view blocks: rejected for this slice because
  those require more spatial reasoning review and likely broader UI/content
  checks.

## Decision: Use Audit-First Quality Checks

**Rationale**: The user requires every task to be verified. Adding audit checks
before rewrites creates a red-green loop and prevents future regressions in
generic same/different wording.

**Alternatives considered**:

- Manual review only: rejected because it does not leave repeatable protection.
- Snapshot UI tests: deferred because current risk is curriculum semantics, not
  layout rendering.

## Decision: Existing Visual Tokens Are Sufficient

**Rationale**: Current visual-match rounds use familiar tokens and phrases such
as colored shapes, fruit, animals, and simple objects. These support the goal
without adding image generation or registry work.

**Alternatives considered**:

- Generate new card images: rejected because the game already renders tokens and
  new assets would increase scope without improving this slice.
- Convert all cards to scene images: rejected because exact-card matching is
  clearer as repeated simple cards.

## Decision: Keep Close Distractors

**Rationale**: Plausible child mistakes are central to the learning value. Wrong
choices should be close to the target by sharing first item, color, shape, or
objects while failing order or one visible feature.

**Alternatives considered**:

- Use unrelated distractors: rejected because children can answer without
  comparing carefully.
- Use adult taxonomy distinctions: rejected because the target age needs visible
  differences.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, success feedback, retries, and parent prompts are spoken
or exported as local audio lines. Voice-line and manifest synchronization is a
project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
