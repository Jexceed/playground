# Feature Specification: Difference-Detective Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。继 visual-match 后，继续处理 difference detective。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Changed Items Are Traceable (Priority: P1)

As a parent playing with a 4-year-old, I can open "找不同侦探" and see each
changed-item round compare left and right pictures in a clear order, naming the
old item, the new item, and the changed position.

**Why this priority**: A child can guess from the answer choices unless the task
teaches careful left-to-right comparison and spoken explanation.

**Independent Test**: Review every changed-item round and confirm the left
picture, right picture, answer, success feedback, retry guidance, and parent
prompt all point to the same changed position.

**Acceptance Scenarios**:

1. **Given** the left and right picture rows have the same length, **When** the
   child compares them from left to right, **Then** exactly one position has a
   different item.
2. **Given** the child selects the right-side changed item, **When** feedback
   plays, **Then** it says what the left item was, what the right item became,
   and where the change happened.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports a full "left picture ... right picture ..." sentence.

---

### User Story 2 - More/Less Choices Are Valid And Child-Friendly (Priority: P1)

As a maintainer, I can run the curriculum audit and catch more/less difference
rounds where the extra or missing item is not structurally provable, choices are
ambiguous, or feedback skips the matching process.

**Why this priority**: The user explicitly requires option correctness,
effectiveness, difficulty control, no repetition, and verification.

**Independent Test**: Add difference-detective audit rules, run the audit to see
it fail on current weak wording, then rewrite content until the audit passes.

**Acceptance Scenarios**:

1. **Given** a "right picture has more" round, **When** the audit inspects it,
   **Then** the right picture must contain all left-picture items plus exactly
   one extra item that matches the answer.
2. **Given** a "right picture has less" round, **When** the audit inspects it,
   **Then** the left picture must contain all right-picture items plus exactly
   one missing item that matches the answer.
3. **Given** success feedback says only "more" or "less" without confirming the
   unchanged items, **When** the audit runs, **Then** it reports the round for
   rewrite.

---

### User Story 3 - Difference-Detective Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for rewritten difference-detective
prompts, feedback, retries, and parent guidance.

**Why this priority**: The project requires local auditable audio, and content
rewrites change spoken text.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** difference-detective wording changes, **When** voice lines are
   exported, **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- Changed-item rounds must not accept the old left-side item as the answer; the
  answer is what appears in the right picture after the change.
- Extra-item rounds can place the extra item at the end for preschool clarity,
  but feedback must still say the unchanged items were matched first.
- Missing-item rounds must not rely on memory alone; the child should be able to
  point to the left item that cannot be found in the right picture.
- Distractors may include unchanged items and the old changed item only when
  feedback explains why those are not the answer.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Changed-item rounds MUST show a left picture and right picture
  with the same number of items and exactly one changed position.
- **FR-002**: Changed-item answers MUST be the item shown in the right picture at
  the changed position.
- **FR-003**: Changed-item choices MUST be distinct and include plausible
  distractors such as the old item or unchanged neighboring items.
- **FR-004**: Changed-item success feedback MUST name the changed position, the
  left old item, and the right new item.
- **FR-005**: Changed-item retry feedback MUST guide the child to compare in
  order from the first item onward.
- **FR-006**: Changed-item parent prompts MUST invite a full left/right
  explanation.
- **FR-007**: Extra-item rounds MUST show the right picture containing all left
  picture items plus exactly one extra item.
- **FR-008**: Extra-item answers MUST be the one extra item in the right picture.
- **FR-009**: Extra-item success and parent guidance MUST first confirm the
  unchanged items are still present, then name the extra item.
- **FR-010**: Missing-item rounds MUST show the left picture containing all right
  picture items plus exactly one missing item.
- **FR-011**: Missing-item answers MUST be the one left-picture item not found in
  the right picture.
- **FR-012**: Missing-item success and parent guidance MUST first confirm the
  shared items, then name the missing item.
- **FR-013**: Difference-detective audit checks MUST report game and round
  context for invalid structures, ambiguous choices, weak feedback, retry gaps,
  or parent-prompt gaps.
- **FR-014**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-015**: Maintained docs MUST record completed difference-detective work and
  remaining logic-house follow-up.
- **FR-016**: The feature MUST pass `pnpm build` and `pnpm audit:curriculum`
  before completion.

### Key Entities *(include if feature involves data)*

- **Difference Round**: A round in `logic-difference-detective` comparing left
  and right picture rows.
- **Changed-Item Round**: A round where the left and right rows have the same
  length but one position changes from an old item to a new item.
- **Extra-Item Round**: A round where the right row contains all left-row items
  plus one extra item.
- **Missing-Item Round**: A round where the right row is missing one item from
  the left row.
- **Shared Item**: An item that appears in both left and right rows and should be
  matched before choosing an extra or missing item.
- **Difference Finding**: An audit result naming a difference-detective round
  and the quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing visual tokens and
  generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with difference-detective guidance and
  status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, and targeted
  difference-detective review.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every source changed-item case has exactly one changed position and
  feedback that names position, old item, and new item.
- **SC-002**: Every source extra-item case has one structurally provable extra
  item and feedback that confirms the shared items first.
- **SC-003**: Every source missing-item case has one structurally provable
  missing item and feedback that confirms the shared items first.
- **SC-004**: The curriculum audit reports zero problems after
  difference-detective quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed difference-detective slice and
  remaining logic-house clusters.

## Assumptions

- Use `logic-difference-detective` as the only content cluster for this slice.
- Keep `数字岛`, sorter, same-kind, and visual-match behavior unchanged.
- Prefer existing visual tokens over new image generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
