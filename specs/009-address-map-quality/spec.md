# Feature Specification: Address-Map Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在路线步骤后，继续处理仍未专项审计的地址地图题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Address-To-Object Rounds Are Pointable (Priority: P1)

As a parent playing with a 4-year-old, I can trust that when a round asks what
is hidden at an address such as A1, the child can first find the letter row,
then the number column, and point to the exact object in the crossing cell.

**Why this priority**: Address-to-object questions are the core of the map
cluster. If feedback does not name row, column, and object, the child may guess
from the choices instead of practicing two-dimensional location.

**Independent Test**: Review every address-to-object source round and confirm
the address exists in the visible grid, the answer equals the crossing cell,
choices include the answer once, and feedback names the row, column, and object.

**Acceptance Scenarios**:

1. **Given** a child sees a row-column map, **When** the prompt asks "A1 里藏着
   什么", **Then** the correct answer is the object at row A and column 1.
2. **Given** the child answers correctly, **When** feedback plays, **Then** it
   says the row, the column, and the object in that cell.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports pointing to the row-column intersection.

---

### User Story 2 - Object-To-Address Rounds Read Coordinates From The Grid (Priority: P1)

As a parent, I can trust that when a round asks where an object lives, the child
can find the object in the grid, read the row letter and column number, and
select the exact address.

**Why this priority**: Object-to-address rounds reverse the skill and add a
small abstraction step. They must still be visibly provable, not a memory or
guessing task.

**Independent Test**: Add audit checks that find the target object exactly once,
calculate its row-column address, run red on current weak wording, then rewrite
content until the audit confirms the address and explanation.

**Acceptance Scenarios**:

1. **Given** the target object appears once in the grid, **When** the audit reads
   its row and column, **Then** the answer equals the computed address.
2. **Given** choices are shown, **When** the child compares them, **Then** the
   correct address appears once and distractors are distinct plausible row or
   column mistakes.
3. **Given** feedback plays, **When** the child hears it, **Then** it names the
   object, row letter, column number, and final address.

---

### User Story 3 - Address-Map Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed address-map
prompts, choices, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** address-map wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A row-column grid must be rectangular and every visible cell must contain a
  non-empty item name.
- An address must use a row label and column label that exist in the visible
  grid.
- A target object for object-to-address rounds must appear exactly once.
- Choice labels and values must be distinct and include the computed answer
  exactly once.
- Feedback should not only say "A1 has the answer"; it must name row, column,
  and the crossing-cell reasoning.
- Retry guidance should not ask the child to guess from choices before using
  row and column.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Address-to-object rounds MUST show a rectangular row-column grid
  with row labels and column labels.
- **FR-002**: Address-to-object answers MUST equal the visible grid item at the
  stated row-column address.
- **FR-003**: Address-to-object choices MUST include the correct item exactly
  once and distinct visible grid-item distractors.
- **FR-004**: Address-to-object success feedback MUST name the address, row,
  column, and hidden object.
- **FR-005**: Address-to-object retry and parent prompts MUST ask the child to
  find the row first, then the column, and point to the crossing cell.
- **FR-006**: Object-to-address rounds MUST name a target object that appears
  exactly once in the visible grid.
- **FR-007**: Object-to-address answers MUST equal the row-letter plus
  column-number address of that target object.
- **FR-008**: Object-to-address choices MUST include the correct address exactly
  once and distinct plausible address mistakes.
- **FR-009**: Object-to-address success feedback MUST name the object, row,
  column, and final address.
- **FR-010**: Object-to-address retry and parent prompts MUST ask the child to
  find the item, then read the row letter and column number.
- **FR-011**: Address-map audit checks MUST report game and round context for
  missing grids, invalid addresses, duplicate targets, wrong answers, duplicate
  choices, weak feedback, retry gaps, or parent-prompt gaps.
- **FR-012**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-013**: Maintained docs MUST record completed address-map work and the
  next logic-house follow-up.
- **FR-014**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Address-Map Round**: A round in `logic-address-map` using a visible
  row-column grid.
- **Address Grid**: A grid with row labels, column labels, and named visible
  items in each cell.
- **Address**: A row-letter and column-number pair such as A1.
- **Target Object**: The visible item named by an object-to-address prompt.
- **Crossing Cell**: The grid cell located by row and column.
- **Address-Map Finding**: An audit result naming an address-map round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use the existing treasure map
  scene, grid surface, visual tokens, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with address-map guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  address-map review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every address-to-object source round has a visible grid whose
  crossing cell equals the answer.
- **SC-002**: Every object-to-address source round has one visible target whose
  computed address equals the answer.
- **SC-003**: Every address-map success, retry, and parent prompt names the
  active row-column strategy and preserves parent-child explanation.
- **SC-004**: The curriculum audit reports zero problems after address-map
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed address-map slice and
  remaining logic-house follow-up without stale references.

## Assumptions

- Use `logic-address-map` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing grid and treasure-map scene surfaces over new image
  generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
