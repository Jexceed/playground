# Research: Memory Camera Visual Surface

## Decision: Use a dedicated flat memory-slot token

**Rationale**: `MemoryBoard` currently wraps `VisualToken` in `.memory-card`.
`VisualToken` is itself a card-like surface, so the result creates two nested
containers. A dedicated token can reuse `VisualGlyph` and `visualMetaFor` while
letting `.memory-card` remain the only framed slot.

**Alternatives considered**:

- Restyle `.memory-card .visual-token` to remove its border. Rejected because it
  leaves a fragile nested component path and the audit cannot easily distinguish
  intentional from accidental card nesting.
- Reuse `MatrixCellToken`. Rejected because memory slots need a different
  covered state and spacing.

## Decision: Add a source-level audit rule

**Rationale**: The previous map/matrix fixes used source checks to prevent
regression to nested visual cards. `MemoryBoard` has the same pattern, so a
source check gives a cheap, deterministic guard.

**Alternatives considered**:

- Browser-only regression check. Rejected because the project already relies on
  `pnpm audit:curriculum` as the stable content/runtime gate.
