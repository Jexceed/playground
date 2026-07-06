# Research: Order-Plan Logic Quality

## Decision: Audit the visible sequence before rewriting content

**Rationale**: `logic-order-plan` rounds already expose the plan as a sequence
with `?`. The audit can verify a single missing slot, answer-choice presence,
and evidence-based wording before content is rewritten.

**Alternatives considered**:

- Manual review only: rejected because generic feedback could regress later.
- Add a separate test runner: rejected because the existing curriculum audit
  already imports game data and validates related sequence/grid clusters.

## Decision: Replace `?` with the answer choice label to build the filled flow

**Rationale**: The answer values are internal IDs such as `wash` or `bridge`,
while the child-facing choice label is the spoken and visual concept. Feedback
should use the label the child sees.

**Alternatives considered**:

- Compare answer values to sequence tokens: rejected because sequence tokens
  are child-facing labels or emoji while answer values are internal.
- Add new data fields for every case: rejected because the filled flow is
  derivable from existing sequence and choices.

## Decision: Keep all visual surfaces local

**Rationale**: Existing scenes and visual-token mappings cover the affected
rounds. The quality problem is sequence explanation, not missing imagery.

**Alternatives considered**:

- Generate new scene images: rejected because it would not improve the auditable
  missing-step contract.

## Decision: Regenerate Edge voice assets after text rewrites

**Rationale**: The app prefers local audio when available. Wording changes must
be reflected in `voice-lines.json`, `public/audio/voice/manifest.json`, and
generated mp3 files.

**Alternatives considered**:

- Rely on browser TTS fallback: rejected because project rules treat browser TTS
  as fallback only.
