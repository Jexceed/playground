# Research: Position-Map Logic Quality

## Decision: Keep The Slice To `logic-position-map`

**Rationale**: The cluster is self-contained, currently lacks targeted audit
coverage, and its answers can be calculated from visible grids or visual groups.
This makes it a good next step after matrix-puzzle work.

**Alternatives considered**:

- Broadly rewrite all remaining logic-house clusters: rejected because it would
  mix many reasoning models and weaken red-green verification.
- Generate new playroom images: rejected because the existing scene image, grid,
  and visual-group surfaces already support point-and-say position tasks.

## Decision: Validate Neighbor Direction From The Grid

**Rationale**: Left, right, up, and down answers must be computable by locating
the target and moving one cell. Audit checks can parse direction prompts,
compute the neighbor, and compare it to the answer.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a round with the wrong
  visual answer.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Validate Inside/Outside From Visual Groups

**Rationale**: Inside/outside rounds do not use a grid. The visible group labels
are the source of truth, so the audit should verify the answer belongs to the
requested labeled group and that feedback contrasts both groups.

**Alternatives considered**:

- Convert inside/outside into grids: rejected because current visual groups are
  clear and closer to child-facing language.
- Require only requested group wording: rejected because contrast with the other
  group is what makes the distinction explainable.

## Decision: Validate Relative Direction From Source To Target

**Rationale**: "X looks at Y" rounds are about viewpoint. The audit must compute
from X to Y and feedback must preserve that starting point.

**Alternatives considered**:

- Reuse direct neighbor wording only: rejected because it would miss the common
  mistake of answering from the target's viewpoint.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, choices, success feedback, retries, and parent prompts
are spoken or exported as local audio lines. Voice-line and manifest
synchronization is a project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
