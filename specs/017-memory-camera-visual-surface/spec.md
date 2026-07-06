# Feature Specification: Memory Camera Visual Surface

**Feature Branch**: `017-memory-camera-visual-surface`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "记忆小相机也有类似问题"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Memory Cards Are Flat Inside The Camera (Priority: P1)

As a parent playing `记忆小相机` with a child, I want the remembered cards to look
like simple items placed in the camera slots, so the child can focus on what she
saw instead of parsing nested card frames.

**Why this priority**: This directly addresses the user's reported visual
confusion and matches the same child-friendly surface rule already applied to
matrix and map grids.

**Independent Test**: Open `逻辑屋 -> 记忆小相机`; the memory area shows each item
as a flat token inside one memory slot, and the covered state uses a simple
cover marker without a full nested visual card.

**Acceptance Scenarios**:

1. **Given** a `记忆小相机` round is visible, **When** the memory cards are shown,
   **Then** each item is rendered as a flat icon and label inside the memory slot.
2. **Given** a `记忆小相机` round is visible, **When** the child taps `遮住再答`,
   **Then** each memory slot shows a flat covered marker without adding another
   card frame.
3. **Given** the same round is viewed on a mobile width, **When** the memory row
   wraps, **Then** icons and labels remain inside their slots without overflow.

### Edge Cases

- Memory items may be emoji keys or Chinese phrase labels; both must normalize
  to the same visual label used by voice and feedback.
- Some memory rounds have four items; wrapping must keep slots readable on
  mobile.
- Covered slots must remain clearly covered and should still be understandable
  without relying on raw text only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `记忆小相机` memory slots MUST NOT render full visual-card tokens
  inside another framed memory slot.
- **FR-002**: Visible memory items MUST display a local visual glyph when the
  existing visual registry knows the item, with a readable label for the child.
- **FR-003**: Covered memory slots MUST use a flat covered marker and label, not
  a nested full card.
- **FR-004**: Memory slot buttons MUST preserve tap-to-hear behavior and
  child-readable voice labels.
- **FR-005**: The curriculum audit MUST detect regressions where `MemoryBoard`
  returns to nested `VisualToken` rendering.

### Key Entities *(include if feature involves data)*

- **Memory Slot**: One remembered item position in a `记忆小相机` round; includes
  item value, normalized child label, visible/covered state, and visual glyph.
- **Memory Camera Round**: A game round with `memory.items`, choices, answer,
  feedback, and parent prompt.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No asset changes.
- **Docs**: Update `docs/CHANGELOG.md`; update `docs/build-generation-guide.md`
  with the memory-slot surface rule.
- **Audit Coverage**: `pnpm audit:curriculum`, `pnpm build`, browser desktop
  and mobile checks for `记忆小相机`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Automated audit reports zero nested `MemoryBoard` visual-token
  regressions.
- **SC-002**: Browser inspection of `记忆小相机` reports zero
  `.memory-card .visual-token` elements before and after covering.
- **SC-003**: Browser inspection of mobile width reports no memory-slot token
  overflow for representative three-item and four-item rounds.
- **SC-004**: `pnpm audit:curriculum` and `pnpm build` exit successfully.

## Assumptions

- The reported "similar problem" refers to the same nested-frame visual issue as
  `图形补一补`, because `MemoryBoard` still renders full `VisualToken` cards
  inside `.memory-card` slots.
- Existing memory-camera prompts, answers, feedback, and audio wording remain in
  scope and do not need rewriting.
- Existing visual glyph mappings are sufficient; no new image or audio assets
  are required.
