# Feature Specification: Route-Step Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在三视图后，继续处理仍未专项审计的路线步骤题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One-Step Routes Match The Grid (Priority: P1)

As a parent playing with a 4-year-old, I can trust that every one-step route
round starts from a visible grid item, moves exactly one cell in the named
direction, and selects the visible destination.

**Why this priority**: One-step route tasks are the foundation. If the answer is
not directly provable from the grid, the child is forced to guess rather than
point and explain.

**Independent Test**: Review every one-step round and confirm the answer equals
the computed destination from the visible grid, the answer is present once in
the choices, and feedback names the start, direction, and destination.

**Acceptance Scenarios**:

1. **Given** a child sees a route grid, **When** the prompt says "from X, move
   right one step", **Then** the answer is the item one cell to the right of X.
2. **Given** a child answers correctly, **When** feedback plays, **Then** it
   names the start, the direction, and the destination in child-friendly speech.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports pointing from the start to the next cell.

---

### User Story 2 - Two-Step Routes Preserve Step Order (Priority: P1)

As a parent, I can trust that every two-step route round asks the child to
perform the first move, remember the intermediate position, then perform the
second move in order.

**Why this priority**: Two-step routes train working memory and ordered action.
Feedback must not jump straight to the final answer without preserving the
route.

**Independent Test**: Add audit checks that parse the two movement phrases,
calculate the intermediate and final grid cells, run the audit red on current
weak wording, then rewrite content until the audit confirms each path.

**Acceptance Scenarios**:

1. **Given** a two-step prompt, **When** the audit applies step 1 and then step
   2, **Then** the answer must equal the final grid item.
2. **Given** feedback plays, **When** the child hears it, **Then** it names the
   start, first destination, second destination, and final answer.
3. **Given** retry guidance plays, **When** the child hears it, **Then** it asks
   them to finish the first step before doing the second step.

---

### User Story 3 - Route-Step Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed route prompts,
choices, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** route-step wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A start item must appear exactly once in the route grid used by the round.
- A movement that would leave the grid is invalid and must be caught by audit.
- Two-step routes must apply movements in the spoken order; reversing the order
  can lead to a different answer.
- Choice labels must be distinct and include the final destination exactly once.
- Feedback should not use vague "there" language; it must name each visible
  item in the route.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: One-step rounds MUST show a grid containing the named start item.
- **FR-002**: One-step answers MUST equal the grid item reached by the stated
  one-cell movement.
- **FR-003**: One-step choices MUST include the correct destination exactly once
  and distinct plausible nearby destinations.
- **FR-004**: One-step success feedback MUST name the start, direction, and
  destination.
- **FR-005**: One-step retry and parent prompts MUST ask the child to find the
  start and move exactly one cell in the stated direction.
- **FR-006**: Two-step rounds MUST show a grid containing the named start item.
- **FR-007**: Two-step answers MUST equal the final grid item reached after
  applying both stated movements in order.
- **FR-008**: Two-step choices MUST include the final destination exactly once
  and distinct plausible distractors.
- **FR-009**: Two-step success feedback MUST name the start, intermediate item,
  second move, and final destination.
- **FR-010**: Two-step retry and parent prompts MUST ask the child to say the
  first destination before doing the second move.
- **FR-011**: Route-step audit checks MUST report game and round context for
  missing grids, duplicate starts, out-of-grid moves, invalid answers, weak
  feedback, retry gaps, or parent-prompt gaps.
- **FR-012**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-013**: Maintained docs MUST record completed route-step work and the next
  logic-house follow-up.
- **FR-014**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Route-Step Round**: A round in `logic-route-steps` using a visible grid and
  movement prompt.
- **Route Grid**: A grid of named visual items arranged by rows and columns.
- **Start Item**: The item named in the prompt as the route origin.
- **Movement Step**: One of right, left, up, or down by exactly one cell.
- **Intermediate Item**: The destination after the first move in a two-step
  route.
- **Final Destination**: The route answer after applying all steps in order.
- **Route-Step Finding**: An audit result naming a route round and the quality
  rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing scene images,
  grid surfaces, visual tokens, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with route-step guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  route-step review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every one-step route source round has a visible grid whose computed
  destination equals the answer.
- **SC-002**: Every two-step route source round has a visible grid whose ordered
  movements produce the answer.
- **SC-003**: Every route-step success, retry, and parent prompt names the
  active start/step strategy and preserves parent-child explanation.
- **SC-004**: The curriculum audit reports zero problems after route-step
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed route-step slice and remaining
  logic-house follow-up without stale references.

## Assumptions

- Use `logic-route-steps` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing grid and scene surfaces over new image generation for this
  slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
