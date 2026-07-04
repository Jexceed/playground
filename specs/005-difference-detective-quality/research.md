# Research: Difference-Detective Logic Quality

## Decision: Keep The Slice To `logic-difference-detective`

**Rationale**: The cluster is self-contained, already uses visible two-panel
token groups, and is the next maintained TODO priority after visual match.

**Alternatives considered**:

- Combine with block-height or three-view blocks: rejected because those require
  spatial-reasoning-specific audit rules.
- Add new scene art: rejected because simple left/right token rows make the
  compare/add/remove structure easier for a preschool child.

## Decision: Validate Difference Structure In The Audit

**Rationale**: Feedback quality depends on the underlying rows being provable:
same length with one changed position, right row with one extra item, or right
row missing one left item.

**Alternatives considered**:

- Wording-only checks: rejected because they could pass structurally ambiguous
  rows.
- Manual review only: rejected because it does not leave repeatable protection.

## Decision: Require Shared-Item Matching For More/Less Rounds

**Rationale**: Four-year-olds benefit from pointing to what stayed the same
before naming what is extra or missing. This also prevents answer choices from
becoming a simple vocabulary lookup.

**Alternatives considered**:

- Success feedback that only says "more" or "less": rejected because it skips
  the reasoning process.
- Longer multi-step panels: rejected for this slice because the current panels
  are appropriately small.

## Decision: Keep Plausible Distractors

**Rationale**: Wrong choices should represent common mistakes: selecting an
unchanged item, selecting the old left item, or choosing an item that appears in
both pictures.

**Alternatives considered**:

- Unrelated distractors: rejected because they reduce the task to obvious
  elimination.
- Highly similar adult-only distinctions: rejected because the target age needs
  visible, familiar changes.

## Decision: Regenerate Local Voice After Wording Changes

**Rationale**: Prompts, success feedback, retries, and parent prompts are spoken
or exported as local audio lines. Voice-line and manifest synchronization is a
project quality gate.

**Alternatives considered**:

- Rely on browser TTS: rejected because local audio is the target and audit
  validates the manifest.
- Skip regeneration for small text edits: rejected because manifest drift would
  make the audit fail.
