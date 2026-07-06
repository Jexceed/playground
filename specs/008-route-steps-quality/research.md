# Research: Route-Step Logic Quality

## Decision: Keep The Slice To `logic-route-steps`

**Rationale**: The cluster is self-contained, currently lacks targeted audit
coverage, and has answers that can be calculated from visible grid movement.
This makes it a good next step after the spatial block slices.

**Alternatives considered**:

- Broadly rewrite all remaining logic-house clusters: rejected because it would
  mix many reasoning models and weaken red-green verification.
- Generate new map images: rejected because the existing scene image plus grid
  is already sufficient for a point-and-say route task.

## Decision: Validate Routes From The Grid

**Rationale**: The correct answer must be computable from the visible route
grid. Audit checks can locate the start, parse direction words, move by one
cell per step, and compare the computed destination to the answer.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a route with the wrong
  destination.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Intermediate-Step Feedback

**Rationale**: Two-step routes train order and working memory. Feedback must
name the first landing spot before naming the final destination so parents can
ask the child to reconstruct the path.

**Alternatives considered**:

- Only naming the final answer: rejected because it does not explain the route.
- Long coordinate explanations: rejected because preschool children can more
  naturally point to named items than recite coordinates.

## Decision: Keep Choices As Named Grid Items

**Rationale**: Children can select visible destinations by name. Distractors
should be other visible grid items, preferably nearby or plausible mistakes,
without duplicating the answer.

**Alternatives considered**:

- Use coordinates as choices: rejected because the rest of the app uses named
  child-facing items.
- Use arrows as choices: rejected because this cluster asks for destination,
  not direction.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, choices, success feedback, retries, and parent prompts
are spoken or exported as local audio lines. Voice-line and manifest
synchronization is a project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
