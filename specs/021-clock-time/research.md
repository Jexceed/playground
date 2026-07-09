# Research: Clock-Time Reading

## Decision: Place the clock game in 数字岛

**Rationale**: The learning target is numeric time language, whole/half-hour
reading, and 12-hour to 24-hour conversion grounded in everyday scenes. The
clock face is a visual support, but the child is not solving a shape, contour,
or spatial-closure task.

**Alternatives considered**:

- Put it in 图形工坊: rejected because that world is reserved for visual-spatial
operations such as silhouette, occlusion, overlap, code mapping, and closure.
- Put it in 逻辑屋: rejected because the first pass is not primarily rule
  switching or evidence deduction; daily context is included only to ground time
language and electronic clock notation.

## Decision: Use a dedicated structured clock surface

**Rationale**: Existing `sequence`, `visualGroups`, and `graphicChallenge`
surfaces do not express hour/minute hands cleanly. A small clock-specific round
surface lets the audit verify hour, minute, mode, and conversion context
without parsing decorative text or image pixels.

**Alternatives considered**:

- Use emoji or text cards: rejected because the child would not practice reading
  an analog clock face.
- Generate scene PNGs for every clock: rejected for the first pass because the
  clock evidence is deterministic and easier to audit as structured data.
- Reuse `graphicChallenge`: rejected because it would blur 图形工坊's content
  boundary and require shape-specific semantics for time.

## Decision: Limit first pass to 12 rounds

**Rationale**: Twelve rounds can cover four whole-hour examples, four half-hour
examples, and four time-conversion context examples without turning the feature
into a drill bank. This matches the project's preference for compact,
explainable content.

**Alternatives considered**:

- Add 24 or more rounds: rejected because larger generated sets would add
  repetition before the clock surface is validated with real play.
- Add only six rounds: rejected because it would under-cover the user's explicit
  request for daily context and 24-hour conversion practice.

## Decision: Use audit-first TDD

**Rationale**: The existing project uses `pnpm audit:curriculum` as the content
quality harness. Adding clock audit checks before content changes proves the
feature can catch missing or weak clock rounds.

**Alternatives considered**:

- Manual browser review only: rejected because it would not prevent later
  content regressions.
- Snapshot UI tests first: deferred because the highest risk is curriculum
  semantics, not pixel layout.
