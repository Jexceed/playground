# Research: Logic House Quality

## Decision: Strengthen Existing Curriculum Audit

**Rationale**: The repository already has a single curriculum audit that loads
game data, image registry, visual token mappings, voice-line exports, and the
voice manifest. Extending this audit keeps the quality rules close to the
current source of truth and avoids creating a second verifier with different
coverage.

**Alternatives considered**:

- Manual review only: rejected because the user explicitly requires every task
  to be verified, and manual review alone is easy to skip.
- Separate one-off script: rejected because it would duplicate game-loading and
  voice-manifest checks already present in the existing audit.

## Decision: Start With `logic-sorter-switch`

**Rationale**: This game is compact, clearly primitive, and exercises several
important logic-house concerns: rule switching, classification, multi-condition
filtering, option validity, and child-friendly explanations. It uses existing
symbol cards, so the first slice can improve quality without waiting on new
image generation.

**Alternatives considered**:

- Rewrite all logic-house games at once: rejected because the blast radius is
  too large to verify carefully in one slice.
- Start with spatial/3D topics: rejected because those topics are harder to
  make child-friendly without additional visual assets and layout review.
- Start with story evidence: reasonable, but it already uses scene images and
  is less compact for validating classification choice-quality rules.

## Decision: Treat Similar Choices As Valid Only When Meanings Differ

**Rationale**: Many preschool logic tasks intentionally compare close options.
The audit should not ban similarity; it should flag repeated labels, repeated
values, repeated normalized meanings, and known weak choice wording. Human
review remains required for close-but-valid distractors.

**Alternatives considered**:

- Ban all similar text: rejected because it would block useful distractors such
  as related-but-not-best choices.
- Only check exact duplicate labels and values: rejected because the current
  user rule also forbids semantic repetition and ineffective options.

## Decision: Voice Work Starts With Export And Manifest Validation

**Rationale**: Text rewrites change the voice-line source. The project already
has local voice generation commands, but generation may depend on local tooling
availability. The minimum verified state for this slice is that voice lines are
exported and the manifest is either regenerated successfully or the exact
generation gap is recorded.

**Alternatives considered**:

- Skip voice handling until later: rejected because the user explicitly names
  graph-text-audio consistency.
- Require new image/audio assets before content changes: rejected for this
  first cluster because existing cards are sufficient.
