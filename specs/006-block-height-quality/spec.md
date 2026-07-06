# Feature Specification: Block-Height Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。继 difference detective 后，进入抽象空间类的 block height maps。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Total-Count Maps Explain The Digits (Priority: P1)

As a parent playing with a 4-year-old, I can open "积木楼层图" and see each
total-count round explain that every visible digit means the number of blocks in
that position, with row totals leading to the final answer.

**Why this priority**: Top-view height maps are abstract. Children need the
spoken text to connect each number to blocks, rows, and total count.

**Independent Test**: Review every total-count round and confirm the visible
grid digits sum exactly to the answer, choices include only valid distinct
counts, and feedback explains row totals before the final total.

**Acceptance Scenarios**:

1. **Given** a child sees a height-map grid, **When** they add the visible
   numbers, **Then** the answer equals the total number of blocks.
2. **Given** a child answers correctly, **When** feedback plays, **Then** it
   explains at least one row total and the final total.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports reading row numbers and saying how many blocks each
   row has.

---

### User Story 2 - Compare-Map Rounds Are Structurally Valid (Priority: P1)

As a maintainer, I can run the curriculum audit and catch compare-map rounds
where left/right totals are not provable from the visible digits, choices are
ambiguous, or feedback does not name both totals.

**Why this priority**: Comparing maps is harder than counting one map and should
not be reducible to guessing "left" or "right".

**Independent Test**: Add block-height audit rules, run the audit to see it fail
on current weak wording/choice labels, then rewrite content until the audit
passes.

**Acceptance Scenarios**:

1. **Given** a compare round, **When** the audit sums left and right visible
   digits, **Then** the correct answer must match the greater side or "same".
2. **Given** the choice labels are too terse, **When** the audit runs, **Then**
   it reports that compare choices should say "left map more", "right map more",
   or "same amount" in child-facing terms.
3. **Given** feedback gives only the winner, **When** the audit runs, **Then** it
   reports that both totals must be named first.

---

### User Story 3 - Block-Height Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for rewritten block-height
prompts, choices, feedback, retries, and parent guidance.

**Why this priority**: The project requires local auditable audio, and content
rewrites change spoken text.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** block-height wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A `0` cell means no blocks in that position; feedback should not treat it as a
  visible block.
- Rows can have two or three columns, but all row totals must add to the final
  answer.
- Compare rounds can be equal; feedback must explicitly say both sides have the
  same total.
- Numeric distractors should stay near the correct total without duplicating the
  answer or becoming impossible to explain.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Total-count rounds MUST show a grid whose numeric cells sum to the
  answer.
- **FR-002**: Total-count choices MUST include the correct total and distinct
  nearby numeric distractors.
- **FR-003**: Total-count success feedback MUST name row totals and the final
  total in child-friendly language.
- **FR-004**: Total-count retry feedback MUST remind the child to add the
  numbers, not count the squares.
- **FR-005**: Total-count parent prompts MUST ask the child to read each row and
  say the row total.
- **FR-006**: Compare rounds MUST show left and right maps whose visible digits
  can be summed independently.
- **FR-007**: Compare-round answers MUST match the side with the greater total,
  or the same-amount answer when totals match.
- **FR-008**: Compare-round choices MUST use child-facing labels that include
  "left map more", "right map more", and "same amount".
- **FR-009**: Compare-round success feedback MUST name both totals before naming
  the comparison result.
- **FR-010**: Compare-round retry and parent prompts MUST ask the child to sum
  left first, sum right second, then compare.
- **FR-011**: Block-height audit checks MUST report game and round context for
  invalid sums, ambiguous choices, weak feedback, retry gaps, or parent-prompt
  gaps.
- **FR-012**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-013**: Maintained docs MUST record completed block-height work and
  remaining logic-house follow-up.
- **FR-014**: The feature MUST pass `pnpm build` and `pnpm audit:curriculum`
  before completion.

### Key Entities *(include if feature involves data)*

- **Block-Height Round**: A round in `logic-block-height-map` using visible
  numeric height cells.
- **Height Cell**: One visible digit where `0` means no block and positive
  numbers mean that many stacked blocks.
- **Height Map**: A grid of height cells read by rows and columns.
- **Row Total**: Sum of one row's height cells.
- **Map Total**: Sum of all height cells in one map.
- **Compare Map Round**: A round where the child compares totals from left and
  right maps.
- **Block-Height Finding**: An audit result naming a block-height round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing grid/visual-token
  surfaces and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with block-height guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, and targeted
  block-height review.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every source total-count case has a visible numeric grid whose sum
  equals the answer.
- **SC-002**: Every source total-count case has success feedback that names row
  totals and final total.
- **SC-003**: Every source compare-map case has visible left/right totals and a
  choice label that states the comparison result clearly.
- **SC-004**: The curriculum audit reports zero problems after block-height
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed block-height slice and
  remaining logic-house clusters.

## Assumptions

- Use `logic-block-height-map` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing grid and visual token surfaces over new image generation for
  this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
