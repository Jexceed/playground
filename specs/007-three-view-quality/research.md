# Research: Three-View Block Logic Quality

## Decision: Keep The Slice To `logic-three-view-blocks`

**Rationale**: The cluster is the remaining abstract spatial TODO and is
self-contained. It builds on the completed block-height work while adding a
different rule: side views use maximum visible heights, not totals.

**Alternatives considered**:

- Combine this with a broad logic-house audit: rejected because a broad pass
  would mix unrelated reasoning models and make red-green verification unclear.
- Generate new 3D images: rejected because the current numeric grid is the
  auditable learning surface for the existing task.

## Decision: Validate Top Counts, Column Maximums, And Row Maximums In Audit

**Rationale**: The correct answer must be computable from the visible grid.
Audit checks can count positive cells, calculate column maximums, and calculate
row maximums, catching wrong answers or confusing view directions.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass a mathematically wrong
  round.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Active-View Feedback And Parent Prompts

**Rationale**: Preschool children need to know whether they are looking from
above, from the front, or from the left. Feedback and parent prompts must name
the active view, reading direction, and why smaller stacks may be hidden.

**Alternatives considered**:

- Generic "find the biggest number" feedback: rejected because it does not teach
  view conversion.
- Lengthy spatial vocabulary: rejected because the user asked for child-friendly
  content.

## Decision: Keep Choice Labels As Short Height Sequences

**Rationale**: Existing answer labels like `2和1` or `1、2、1` are audio-friendly
and compact. The audit should verify correctness and uniqueness while feedback
explains how to read the sequence.

**Alternatives considered**:

- Add full labels like "第一列2层、第二列1层": rejected because choices would
  become too long for a young child.
- Use only numeric totals: rejected because the task is a view sequence, not a
  total-count task.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, choices, success feedback, retries, and parent prompts
are spoken or exported as local audio lines. Voice-line and manifest
synchronization is a project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
