# Research: Same-Kind Logic Quality

## Decision: Improve `logic-same-kind-detective` As One Cluster

**Rationale**: The cluster is small, text/card-heavy, and directly exercises
category reasoning. It can be improved and verified without new visual assets,
making it a good next step after the sorter quality slice.

**Alternatives considered**:

- `logic-visual-match`: useful, but mostly sequence/detail comparison rather
  than category reasoning.
- `logic-difference-detective`: useful, but larger and better handled after the
  same-kind audit rules are in place.
- Spatial/3D clusters: deferred because they likely need stronger visual/layout
  review and possibly new assets.

## Decision: Audit For Rule Explanation, Not Just Duplicate Choices

**Rationale**: Same-kind rounds can have valid-looking options while still being
weak because the rule is vague. The audit should catch missing rule explanation,
generic retry feedback, and odd-one-out success messages that fail to name the
majority group.

**Alternatives considered**:

- Manual review only: rejected because the user requires repeatable
  verification for each task.
- Exact duplicate checks only: rejected because current audits already cover
  that and do not capture category explanation quality.

## Decision: Use Existing Visual Tokens

**Rationale**: Items in the current cluster are covered by `VisualToken` mappings
or simple emoji cards. Rewriting wording and feedback gives a meaningful product
improvement without introducing asset-generation risk.

**Alternatives considered**:

- Generate new scene images: rejected for this slice because the tasks are card
  classification games, not scene-evidence games.
- Replace card rounds with full scenes: deferred until a larger visual redesign
  is specified.

## Decision: Regenerate Local Edge Voice After Text Changes

**Rationale**: Same-kind prompt, feedback, retry, and parent-prompt text will
change. The current project has a working local Edge voice generation path, so
the manifest should be regenerated and audited before completion.

**Alternatives considered**:

- Leave browser TTS fallback: rejected because the project treats browser TTS as
  fallback only.
- Export lines without generation: only acceptable if the local generator fails,
  in which case the exact blocker must be recorded.
