# Feature Specification: Matrix-Puzzle Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在地址地图后，继续处理仍未专项审计的矩阵补格题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Matrix Answers Follow Visible Row Rules (Priority: P1)

As a parent playing with a 4-year-old, I can trust that every matrix-puzzle
round has a visible rule that can be read from the first two rows and applied to
the row with the missing cell.

**Why this priority**: Matrix puzzles can become abstract quickly. The child
should not guess from answer choices; they should point to example rows, say the
rule, then apply it to the missing row.

**Independent Test**: Review every matrix-puzzle source round and confirm the
missing answer is computable from the visible rows, the answer is present once
in the choices, and distractors represent plausible rule mistakes.

**Acceptance Scenarios**:

1. **Given** a row where the first two cells combine into the third, **When** the
   missing row has the first two cells visible, **Then** the answer is those two
   cells combined in the same order.
2. **Given** a row pattern such as first-second-first, **When** the missing row
   starts with two visible cells, **Then** the answer follows the same pattern.
3. **Given** choices are shown, **When** the child compares them, **Then** the
   correct choice appears once and the other choices are believable mistakes
   such as reversed order, wrong count, or missing required feature.

---

### User Story 2 - Feedback Preserves Explainable Row Examples (Priority: P1)

As a parent, I can use success, retry, and parent prompts to ask the child why a
matrix answer is correct using the first row, second row, and missing row.

**Why this priority**: A terse rule such as "每一行都是大、小、大" is true but
does not by itself support parent-child explanation. The feedback needs visible
examples that a 4-year-old can repeat.

**Independent Test**: Add audit checks that require success feedback to name a
source example row, the missing row, and the final answer; retry and parent
prompts must ask the child to compare rows in order.

**Acceptance Scenarios**:

1. **Given** the child answers correctly, **When** feedback plays, **Then** it
   names at least one complete example row and the completed missing row.
2. **Given** the child misses, **When** retry guidance plays, **Then** it asks
   them to first read an example row before filling the missing row.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt asks them to say how the first row and the missing row use the
   same rule.

---

### User Story 3 - Matrix-Puzzle Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed matrix-puzzle
prompts, choices, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** matrix-puzzle wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A matrix-puzzle round must show a matrix with exactly one missing cell.
- The missing cell must be in a position whose answer can be derived from
  visible row examples.
- Pattern types may include ordered combination, first-second-first repetition,
  size repetition, one-of-each rotation, count-to-quantity, and two-clue story
  combination.
- Choice labels and values must be distinct and include the computed answer
  exactly once.
- Feedback must not only state a rule in abstract terms; it must connect the
  rule to visible rows and the final answer.
- Retry guidance should not ask the child to guess from choices before reading
  the example rows.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Matrix-puzzle rounds MUST show a matrix with one and only one
  missing cell.
- **FR-002**: Matrix-puzzle answers MUST equal the value derived by applying the
  visible row rule to the missing row.
- **FR-003**: Matrix-puzzle choices MUST include the computed answer exactly
  once and distinct plausible distractors.
- **FR-004**: Matrix-puzzle success feedback MUST name a visible example row,
  the missing row, and the final answer.
- **FR-005**: Matrix-puzzle retry guidance MUST ask the child to read a complete
  example row before filling the missing row.
- **FR-006**: Matrix-puzzle parent prompts MUST ask the child to explain how the
  same rule works in an example row and the missing row.
- **FR-007**: Matrix-puzzle audit checks MUST report game and round context for
  missing matrices, unsupported patterns, wrong answers, duplicate choices,
  weak feedback, retry gaps, or parent-prompt gaps.
- **FR-008**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-009**: Maintained docs MUST record completed matrix-puzzle work and the
  next logic-house follow-up.
- **FR-010**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Matrix-Puzzle Round**: A round in `logic-matrix-puzzle` using a visible
  matrix and one missing cell.
- **Matrix Cells**: A two-dimensional list of visible tokens plus one `?`.
- **Example Row**: A complete row that demonstrates the rule.
- **Missing Row**: The row containing the missing cell.
- **Derived Answer**: The expected value obtained by applying the detected rule
  to the missing row.
- **Matrix-Puzzle Finding**: An audit result naming a matrix-puzzle round and
  the quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing visual tokens,
  pattern-puzzle scene, matrix surface, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with matrix-puzzle guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  matrix-puzzle review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every matrix-puzzle source round has a computed answer that equals
  the visible row rule applied to the missing row.
- **SC-002**: Every matrix-puzzle source round has one correct choice and no
  duplicate labels, values, or meanings.
- **SC-003**: Every matrix-puzzle success, retry, and parent prompt supports
  row-by-row explanation using visible examples.
- **SC-004**: The curriculum audit reports zero problems after matrix-puzzle
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed matrix-puzzle slice and
  remaining logic-house follow-up without stale references.

## Assumptions

- Use `logic-matrix-puzzle` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing visual token and scene surfaces over new image generation for
  this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
