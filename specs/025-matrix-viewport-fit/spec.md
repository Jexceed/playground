# Feature Specification: Matrix Puzzle Viewport Fit

**Feature Branch**: `dev`

**Created**: 2026-07-18

**Status**: Approved

**Input**: User description: "图形补一补，有点太长了，导致超过了一个页面高度。"

## User Scenarios & Testing

### User Story 1 - Complete The Puzzle In One Desktop View (Priority: P1)

As a child and parent playing 图形补一补, I can see the instruction, complete
matrix, answer choices, and check controls in one standard desktop viewport.

**Why this priority**: Scrolling between the evidence and choices breaks visual
comparison and makes parent-child play less direct.

**Independent Test**: Open every 图形补一补 round at 1280x720 and confirm the
question surface, choices, and controls fit without document-level vertical
scrolling.

**Acceptance Scenarios**:

1. **Given** a 1280x720 viewport, **When** any matrix round opens, **Then** its
   complete matrix, three choices, and controls are visible in the same view.
2. **Given** a matrix round, **When** the child compares rows, **Then** no second
   illustration repeats or competes with the matrix evidence.

---

### User Story 2 - Preserve A Readable Mobile Layout (Priority: P2)

As a family using a narrow screen, I can still inspect the matrix and choices
without horizontal overflow, clipped tokens, or overlapping controls.

**Why this priority**: Reducing desktop height must not make the matrix too small
or unstable on mobile.

**Independent Test**: Review all six rounds at 375x812 and confirm each matrix
cell remains readable and the page has no horizontal overflow or overlap.

**Acceptance Scenarios**:

1. **Given** a 375x812 viewport, **When** a matrix round opens, **Then** all
   three columns remain visible and aligned.
2. **Given** tokens with combined pictures or labels, **When** they render in a
   compact cell, **Then** the token and label stay inside the cell.

### Edge Cases

- Combined-token cells must remain readable after the redundant scene is removed.
- The missing cell must retain its highlighted state.
- Other games that legitimately need scene images must remain unchanged.
- Answer choices and correct-position balancing must not change.

## Requirements

### Functional Requirements

- **FR-001**: Matrix-puzzle rounds MUST use the matrix as their single
  authoritative visual evidence surface.
- **FR-002**: Matrix-puzzle rounds MUST NOT stack a separate scene illustration
  above the matrix.
- **FR-003**: At 1280x720, the active matrix question, choices, and controls MUST
  fit within the viewport without document-level vertical scrolling.
- **FR-004**: At 375x812, matrix rows MUST have no horizontal overflow,
  clipping, or overlap.
- **FR-005**: The existing six matrix rules, answers, choices, feedback, and
  answer-position order MUST remain unchanged.
- **FR-006**: The curriculum audit MUST reject a matrix round that adds a
  separate scene illustration.
- **FR-007**: The final change MUST pass project build, curriculum audit, browser
  review, NAS packaging, and real Mac application installation.

### Key Entities

- **Matrix Evidence Surface**: The 3x3 visible row-rule grid used to solve the
  question.
- **Redundant Scene**: A separate illustration that repeats or competes with the
  matrix instead of supplying necessary evidence.
- **Viewport Fit Finding**: A measured overflow, clipping, or redundant-surface
  failure tied to a matrix round.

### Asset & Documentation Impact

- **Assets**: No new assets; the existing pattern-board scene remains registered
  for other possible uses but is no longer attached to matrix rounds.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md`.
- **Audit Coverage**: `pnpm audit:curriculum`, `pnpm build`, desktop/mobile
  browser measurements, `pnpm release:nas`, and `pnpm mac:install`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All six matrix rounds fit at 1280x720 with document scroll height
  no greater than viewport height.
- **SC-002**: All six matrix rounds have exactly one matrix evidence surface and
  zero separate scene illustrations.
- **SC-003**: All six rounds have zero horizontal-overflow or overlap findings at
  375x812.
- **SC-004**: Curriculum audit reports zero problems and all release gates pass.

## Assumptions

- 1280x720 is the minimum desktop viewport for the one-screen requirement.
- Mobile may scroll vertically because navigation and parent guidance stack, but
  the matrix itself must remain intact and horizontally contained.
- Matrix wording and voice lines do not need to change for this layout repair.
