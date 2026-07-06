# Feature Specification: Map Visual Surface Quality

**Feature Branch**: `dev`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "继续实现。下面画方框的空间题做得不好：地图找宝藏视觉方案冗余，格子里面还有框框；方位小地图中图里人物位置和下面人物位置不一致，导致歧义。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spatial Rounds Have One Authoritative Visual Surface (Priority: P1)

As a parent playing with a 4-year-old, I can trust that a map, route, or position
round shows only one surface that decides the answer, so the child does not have
to choose between a decorative scene and a different grid.

**Why this priority**: Spatial reasoning for preschool children must be
pointable. If a scene image and a separate grid both show locations, even a
correct answer can feel arbitrary.

**Independent Test**: Review `logic-address-map`, `logic-position-map`, and
`logic-route-steps`; every round with a grid or inside/outside visual group uses
that surface as the only answer-bearing visual surface.

**Acceptance Scenarios**:

1. **Given** a child opens a map-address round, **When** the prompt asks for a
   row-column address, **Then** the only visible map used for the answer is the
   row-column grid.
2. **Given** a child opens a position-map round, **When** the prompt asks who is
   left, right, above, below, inside, or outside, **Then** the displayed people
   and objects appear in one consistent grid or group surface.
3. **Given** a child opens a route-step round, **When** the prompt asks them to
   move one or two steps, **Then** the route is traced on one consistent grid.

---

### User Story 2 - Grid Cells Do Not Contain Nested Card Frames (Priority: P1)

As a child, I can scan a small map grid without seeing a card inside every cell,
so the row, column, and item relationship stays visually simple.

**Why this priority**: The current "grid cell contains a full visual card"
design adds extra borders inside every cell. That makes the map look crowded and
less like a single surface.

**Independent Test**: Open an address-map or position-map grid and confirm each
object cell contains a flat icon and label inside the map cell, not another
full card frame.

**Acceptance Scenarios**:

1. **Given** a grid cell contains "小狗", **When** it renders, **Then** the cell
   shows one flat dog icon and label inside the cell border.
2. **Given** a grid cell is tapped, **When** local speech is available, **Then**
   the item label can still be spoken without adding an inner card frame.
3. **Given** the layout is viewed on mobile, **When** the grid narrows, **Then**
   labels remain inside their cells without overlapping.

---

### User Story 3 - Visual-Surface Rules Are Auditable (Priority: P2)

As a maintainer, I can run the curriculum audit and catch future spatial rounds
that reintroduce two conflicting answer surfaces or nested grid cards.

**Why this priority**: This problem is easy to reintroduce when adding scenes.
The rule should be enforced by the same audit path used for answer and wording
quality.

**Independent Test**: Run the curriculum audit before implementation and see it
fail on current spatial visual-surface problems; run it after implementation
and see zero problems.

**Acceptance Scenarios**:

1. **Given** a spatial round has both a grid and a positional scene image,
   **When** the audit runs, **Then** it reports a single-source visual-surface
   problem with game and round context.
2. **Given** the grid renderer uses full visual cards inside address cells,
   **When** the audit runs, **Then** it reports a nested grid-card problem.
3. **Given** the visual surfaces are corrected, **When** the audit runs, **Then**
   it reports zero curriculum problems.

### Edge Cases

- A round may still use a scene image when it is the only answer-bearing visual
  surface.
- Non-spatial logic rounds may still combine scene images with sequences or
  visual groups when those surfaces do not express conflicting locations.
- Spatial grid labels must remain visible after the decorative scene image is
  removed.
- Inside/outside position-map rounds must not show a playroom scene that puts
  characters or boxes in different places from the visual groups.
- Flat grid tokens must preserve child-friendly labels and click-to-speak
  behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Spatial rounds in `logic-address-map`, `logic-position-map`, and
  `logic-route-steps` MUST use exactly one answer-bearing visual surface when a
  grid or inside/outside group is present.
- **FR-002**: Spatial rounds with a grid or inside/outside group MUST NOT also
  display a scene image that can encode different positions.
- **FR-003**: Address, position, and route grids MUST remain rectangular,
  labeled, and pointable after scene images are removed.
- **FR-004**: Grid object cells MUST render flat icon-and-label content inside
  the cell, not a full nested visual-card component.
- **FR-005**: Flat grid cell content MUST preserve accessible labels and
  click-to-speak behavior for item names.
- **FR-006**: Curriculum audit checks MUST fail on current spatial rounds that
  combine grids or inside/outside groups with scene images.
- **FR-007**: Curriculum audit checks MUST fail if the address grid renderer
  directly nests full visual-card tokens inside map object cells.
- **FR-008**: Maintained docs MUST record the completed visual-surface rule and
  any remaining follow-up.
- **FR-009**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Spatial Round**: A round in `logic-address-map`, `logic-position-map`, or
  `logic-route-steps`.
- **Answer-Bearing Visual Surface**: The visible grid or group that contains
  the evidence needed to answer a spatial prompt.
- **Positional Scene Image**: A large scene image that shows people, objects, or
  map landmarks in positions that could be read as answer evidence.
- **Flat Grid Token**: A non-card icon-and-label rendering used inside a map
  cell.
- **Visual-Surface Finding**: An audit result naming a round or renderer rule
  that violates single-surface clarity.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image or audio assets are required; existing scene image
  references are removed from affected spatial rounds, and existing visual
  glyphs remain in use.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with the spatial visual-surface rule.
- **Audit Coverage**: Red/green `pnpm audit:curriculum`, visual review in the
  browser, `pnpm build`, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of `logic-address-map`, `logic-position-map`, and
  `logic-route-steps` rounds with grids or inside/outside groups show no
  competing scene image.
- **SC-002**: 100% of map object cells render without nested `visual-token`
  cards.
- **SC-003**: The curriculum audit reports zero problems after visual-surface
  checks and content updates.
- **SC-004**: A browser visual check confirms representative address-map,
  position-map, and route-step rounds show one unambiguous spatial surface.
- **SC-005**: Documentation records the completed visual-surface quality slice
  without stale guidance that encourages conflicting scene-plus-grid layouts.

## Assumptions

- This slice is a visual-clarity and audit-rule change; existing answer logic,
  choice sets, and voice text are kept unchanged unless verification exposes a
  directly related issue.
- Removing scene images from affected spatial rounds is preferable to generating
  new exact scene images for every grid in this pass.
- The child can still use the visible grid or group as the concrete evidence
  surface after decorative scene images are removed.
- Keep work on local `dev` unless the user explicitly asks to push or release.
