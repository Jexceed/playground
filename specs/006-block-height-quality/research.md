# Research: Block-Height Logic Quality

## Decision: Keep The Slice To `logic-block-height-map`

**Rationale**: The cluster is self-contained and is the next maintained TODO
priority. It also prepares the conceptual ground for `logic-three-view-blocks`
without mixing two spatial reasoning models in one change.

**Alternatives considered**:

- Combine block-height and three-view blocks: rejected because three-view blocks
  require separate view/maximum-height reasoning.
- Generate new 3D assets: rejected because the current top-view number grid is
  the intended learning surface for this slice.

## Decision: Validate Sums In The Audit

**Rationale**: The correct answer must be computable from visible digits. Audit
checks can sum total-count grids and compare left/right map totals, catching
wrong answers or ambiguous choices.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a mathematically wrong
  round.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Row-Total Feedback

**Rationale**: Preschool children can handle small sums better when the problem
is chunked by row. Row-total language also makes the parent follow-up concrete.

**Alternatives considered**:

- Listing all digits without row totals: rejected because it is harder to audit
  and less friendly to explain.
- Requiring column totals: rejected for this slice because the existing prompts
  ask children to read rows.

## Decision: Make Compare Choices Explicit

**Rationale**: "Left" and "right" are too terse for a comparison prompt. Labels
like "左图更多" preserve the same answer while making the chosen relation clear
in text and audio.

**Alternatives considered**:

- Keep terse position labels: rejected because the user requires option
  effectiveness and child-friendly wording.
- Use numeric totals as choices: rejected because the task is to compare maps,
  not just select a number.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, choices, success feedback, retries, and parent prompts
are spoken or exported as local audio lines. Voice-line and manifest
synchronization is a project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
