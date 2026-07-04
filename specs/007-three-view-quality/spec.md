# Feature Specification: Three-View Block Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。当前数字岛相对完善，逻辑屋仍需继续，进入剩余的三视图积木题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Top-View Rounds Count Positions, Not Layers (Priority: P1)

As a parent playing with a 4-year-old, I can open "从哪边看" and see top-view
rounds where the child counts only the grid positions that contain blocks,
instead of adding the layer numbers.

**Why this priority**: Top view is the simplest entry point, but it is easy for
children to confuse "has a block here" with "how many blocks are stacked here".

**Independent Test**: Review every top-view round and confirm the answer equals
the number of non-zero grid positions, choices are distinct nearby counts, and
feedback says why zero cells are empty while positive cells are visible.

**Acceptance Scenarios**:

1. **Given** a child sees a numeric block grid, **When** the prompt asks from the
   top, **Then** the answer equals the count of non-zero positions.
2. **Given** a child answers correctly, **When** feedback plays, **Then** it
   explains that top view counts positions with blocks, not layer totals.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports pointing to visible positions and empty zero cells.

---

### User Story 2 - Front-View Rounds Use Column Maximums (Priority: P1)

As a parent, I can trust that every front-view round asks the child to look down
each column and choose the highest stack visible from the front.

**Why this priority**: Front-view reasoning is the core spatial challenge for
this cluster. Incorrect answers or vague feedback would make the view-conversion
task unteachable.

**Independent Test**: Add audit checks that calculate each column maximum from
the visible grid, run the audit red on current weak wording, then rewrite
content until the audit confirms each front-view answer and explanation.

**Acceptance Scenarios**:

1. **Given** a front-view round, **When** the audit calculates column maximums,
   **Then** the answer must match those maximums in left-to-right order.
2. **Given** the choices include distractors, **When** the audit checks them,
   **Then** they must be distinct and include the correct column-maximum answer.
3. **Given** feedback plays, **When** the child hears it, **Then** it names the
   front view, columns, highest stacks, and the final answer.

---

### User Story 3 - Left-View Rounds Use Row Maximums (Priority: P1)

As a parent, I can trust that every left-view round asks the child to look across
each row and choose the highest stack visible from the left.

**Why this priority**: Left-view rounds look similar to front-view rounds but use
a different direction. The content must prevent children from reusing the wrong
column strategy.

**Independent Test**: Add audit checks that calculate each row maximum from the
visible grid, run the audit red on current weak wording, then rewrite content
until the audit confirms each left-view answer and explanation.

**Acceptance Scenarios**:

1. **Given** a left-view round, **When** the audit calculates row maximums,
   **Then** the answer must match those maximums from top row to bottom row.
2. **Given** the retry guidance plays after a wrong answer, **When** the child
   hears it, **Then** it asks them to read rows from the left and find the
   highest stack rather than add numbers.
3. **Given** the parent prompt appears, **When** the parent asks follow-up,
   **Then** it invites the child to explain which smaller stacks are hidden by a
   taller stack in the same row.

---

### User Story 4 - Three-View Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed three-view prompts,
choices, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** three-view wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A `0` grid cell means no block in that position; it counts as empty from the
  top and cannot become a visible height from the side.
- A row or column can contain several positive heights; side-view answers use
  only the maximum visible height, not the sum.
- A 2-column, 3-column, 2-row, or 3-row grid must produce an answer with the
  same number of visible side-view positions.
- Some front-view and left-view answers may coincidentally match; feedback must
  still name the active viewpoint and reading direction.
- Distractors should represent common mistakes, such as summing a row or
  swapping front/left directions, without duplicating the correct answer.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Top-view rounds MUST show a numeric grid whose positive cells
  determine the answer.
- **FR-002**: Top-view choices MUST include the correct count and distinct nearby
  numeric distractors.
- **FR-003**: Top-view success feedback MUST state that top view counts positions
  with blocks and name the final count.
- **FR-004**: Top-view retry and parent prompts MUST ask the child to point to
  non-zero positions and explain zero as empty.
- **FR-005**: Front-view rounds MUST show a numeric grid whose column maximums
  determine the answer.
- **FR-006**: Front-view choices MUST include the correct left-to-right column
  maximum sequence and distinct plausible distractors.
- **FR-007**: Front-view success feedback MUST name the front view, columns,
  highest stacks, and final answer sequence.
- **FR-008**: Front-view retry and parent prompts MUST ask the child to read
  columns and avoid adding the numbers.
- **FR-009**: Left-view rounds MUST show a numeric grid whose row maximums
  determine the answer.
- **FR-010**: Left-view choices MUST include the correct top-to-bottom row
  maximum sequence and distinct plausible distractors.
- **FR-011**: Left-view success feedback MUST name the left view, rows, highest
  stacks, and final answer sequence.
- **FR-012**: Left-view retry and parent prompts MUST ask the child to read rows
  from the left and avoid adding the numbers.
- **FR-013**: Three-view audit checks MUST report game and round context for
  invalid top counts, invalid side-view maximums, missing choices, weak
  feedback, retry gaps, or parent-prompt gaps.
- **FR-014**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-015**: Maintained docs MUST record completed three-view work and the next
  logic-house follow-up.
- **FR-016**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Three-View Round**: A round in `logic-three-view-blocks` using a numeric
  block grid.
- **Block Cell**: One grid cell where `0` means empty and positive digits mean
  stacked block height.
- **Top-View Position Count**: Number of cells with a positive height.
- **Front-View Sequence**: Column maximums read from left column to right column.
- **Left-View Sequence**: Row maximums read from top row to bottom row.
- **Three-View Finding**: An audit result naming a three-view round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing numeric grid
  surfaces and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with three-view guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  three-view review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every top-view source round has a visible numeric grid whose
  positive-cell count equals the answer.
- **SC-002**: Every front-view source round has a visible numeric grid whose
  column maximums equal the answer.
- **SC-003**: Every left-view source round has a visible numeric grid whose row
  maximums equal the answer.
- **SC-004**: Every three-view success, retry, and parent prompt names the active
  viewpoint and the child-facing strategy.
- **SC-005**: The curriculum audit reports zero problems after three-view
  quality checks and content rewrites.
- **SC-006**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-007**: Documentation records the completed three-view slice and remaining
  logic-house follow-up without stale references.

## Assumptions

- Use `logic-three-view-blocks` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing grid surfaces over new image generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
