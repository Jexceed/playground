# Feature Specification: Position-Map Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在矩阵补格后，继续处理仍未专项审计的方位小地图题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Neighbor Direction Rounds Are Computable (Priority: P1)

As a parent playing with a 4-year-old, I can trust that each left, right, up, or
down question starts from a visible item, moves exactly one neighboring cell,
and selects the visible item in that cell.

**Why this priority**: Direction rounds train concrete spatial language. If the
answer is not provable by pointing from the target one cell in the named
direction, the child is guessing from choices.

**Independent Test**: Review every grid-based direction round and confirm the
target appears once, the named direction stays inside the grid, the computed
neighbor equals the answer, and feedback names target, direction, and answer.

**Acceptance Scenarios**:

1. **Given** a child sees a row with dog, cat, rabbit, **When** the prompt asks
   who is on the cat's left, **Then** the answer is the dog.
2. **Given** a child answers correctly, **When** feedback plays, **Then** it
   says to start from the target and move one cell in the named direction.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports pointing from target to answer.

---

### User Story 2 - Inside/Outside Rounds Contrast The Groups (Priority: P1)

As a parent, I can trust that inside/outside questions use visible inside and
outside groups, and feedback contrasts the selected item with the other group.

**Why this priority**: Inside/outside reasoning should be concrete and visual.
Children need to say what is inside the box and what is outside it, not just
memorize a word.

**Independent Test**: Add audit checks that verify the answer appears in the
requested inside or outside group exactly once, choices include it once, and
feedback/retry/parent prompts name both the requested group and the contrast
group.

**Acceptance Scenarios**:

1. **Given** a visual group labeled "盒子里面", **When** the prompt asks who is
   inside, **Then** the answer is an item in that group.
2. **Given** a visual group labeled "盒子外面", **When** the prompt asks who is
   outside, **Then** the answer is an item in that group.
3. **Given** feedback plays, **When** the child hears it, **Then** it names the
   selected item and contrasts inside with outside.

---

### User Story 3 - Relative Direction Rounds Preserve Viewpoint (Priority: P1)

As a parent, I can trust that "X looks at Y" rounds compute direction from X's
position toward Y, and feedback preserves that starting viewpoint.

**Why this priority**: Relative direction is harder than direct neighbor
lookup. The child must keep the start item fixed and avoid answering from the
target's viewpoint.

**Independent Test**: Verify each relative prompt computes the direction from
source to target, choices include the computed direction once, and retry/parent
prompts explicitly warn against starting from the wrong item.

**Acceptance Scenarios**:

1. **Given** dog is left of the box, **When** the prompt says the dog looks at
   the box, **Then** the box is to the dog's right.
2. **Given** cat is right of the box, **When** the prompt says the cat looks at
   the box, **Then** the box is to the cat's left.
3. **Given** the parent asks why, **When** the child explains, **Then** the
   parent prompt asks them to point from the source item to the target item.

---

### User Story 4 - Position-Map Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed position-map
prompts, choices, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** position-map wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A grid direction round must have the target item exactly once.
- A direction move that leaves the grid is invalid and must be caught by audit.
- Relative direction rounds must compute from the named source item, not from
  the target item.
- Inside/outside answers must be present in the requested group and choices
  exactly once.
- Feedback must not only say "X is left"; it must preserve target, direction,
  one-cell movement, and answer.
- Retry guidance should not ask the child to guess from choices before pointing
  at the visual surface.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Neighbor direction rounds MUST show a rectangular grid containing
  the named target item exactly once.
- **FR-002**: Neighbor direction answers MUST equal the item one cell in the
  stated direction from the target.
- **FR-003**: Neighbor direction choices MUST include the computed answer
  exactly once and distinct plausible nearby distractors.
- **FR-004**: Neighbor direction success, retry, and parent prompts MUST name
  target, direction, one-cell movement, and answer.
- **FR-005**: Inside/outside rounds MUST show both inside and outside visual
  groups.
- **FR-006**: Inside/outside answers MUST belong to the requested group and be
  present in choices exactly once.
- **FR-007**: Inside/outside success, retry, and parent prompts MUST name the
  selected answer and contrast inside with outside.
- **FR-008**: Relative direction rounds MUST compute direction from the named
  source item to the named target item.
- **FR-009**: Relative direction feedback MUST name source, target, computed
  direction, and the instruction to start from the source.
- **FR-010**: Position-map audit checks MUST report game and round context for
  missing grids/groups, duplicate targets, out-of-grid moves, wrong answers,
  duplicate choices, weak feedback, retry gaps, or parent-prompt gaps.
- **FR-011**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-012**: Maintained docs MUST record completed position-map work and the
  next logic-house follow-up.
- **FR-013**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Position-Map Round**: A round in `logic-position-map` using a grid or
  inside/outside visual groups.
- **Neighbor Direction Round**: A grid round that asks for the item one cell
  left, right, up, or down from a target.
- **Inside/Outside Round**: A visual-group round that asks whether an item is
  inside or outside the box.
- **Relative Direction Round**: A grid round that asks from one item's viewpoint
  where another item is.
- **Position-Map Finding**: An audit result naming a position-map round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing playroom scene,
  grid surface, visual groups, visual tokens, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with position-map guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  position-map review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every neighbor direction source round has a computed grid answer
  that equals the visible one-cell move.
- **SC-002**: Every inside/outside source round has an answer in the requested
  visual group and contrast wording in feedback.
- **SC-003**: Every relative direction source round computes direction from the
  correct starting viewpoint.
- **SC-004**: The curriculum audit reports zero problems after position-map
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed position-map slice and
  remaining logic-house follow-up without stale references.

## Assumptions

- Use `logic-position-map` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing grid, visual group, and scene surfaces over new image
  generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
