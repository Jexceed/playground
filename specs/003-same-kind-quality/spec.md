# Feature Specification: Same-Kind Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。继 `logic-sorter-switch` 之后，继续处理更原始、偏文字化的逻辑屋内容。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Same-Kind Rules Are Clear (Priority: P1)

As a parent playing with a 4-year-old, I can open "同类小侦探" and see each
round ask for one concrete grouping rule the child can explain from the visible
cards.

**Why this priority**: Category and odd-one-out tasks are easy to turn into
test-prep wording. They need clear visual evidence and child-friendly language.

**Independent Test**: Review every changed `logic-same-kind-detective` round and
confirm the visible cards, prompt, answer, feedback, and parent prompt all point
to the same grouping rule.

**Acceptance Scenarios**:

1. **Given** a child sees a same-kind round, **When** they look at the visible
   cards, **Then** the correct choice joins the same category for a concrete
   reason.
2. **Given** a child sees an odd-one-out round, **When** they compare the cards,
   **Then** three cards share a rule and the answer is the one that breaks that
   rule.
3. **Given** a parent reads the parent prompt, **When** they ask "why", **Then**
   the child can answer with a visible property, use, place, or category.

---

### User Story 2 - Same-Kind Choices Are Valid And Non-Repeating (Priority: P1)

As a maintainer, I can run the curriculum audit and catch same-kind rounds whose
choices are duplicated, unrelated, accidentally valid, or too hard to distinguish
for a preschool child.

**Why this priority**: The user explicitly requires option correctness,
effectiveness, difficulty control, and no repetition.

**Independent Test**: Run the curriculum audit after stricter same-kind checks
are enabled; the audit must fail for weak same-kind wording before content fixes
and pass after fixes.

**Acceptance Scenarios**:

1. **Given** a same-kind round has a generic retry that does not name the rule,
   **When** the audit runs, **Then** the round is reported with game and round
   context.
2. **Given** an odd-one-out round has feedback that does not identify the three
   matching cards, **When** the audit runs, **Then** the round is reported for
   rewrite.
3. **Given** a changed same-kind round has distinct choices and explainable
   distractors, **When** the audit runs, **Then** no same-kind finding remains.

---

### User Story 3 - Same-Kind Voice Lines Stay Local And Synced (Priority: P2)

As a family using the app with audio, I can hear local voice for rewritten
same-kind prompts, choices, feedback, and parent guidance.

**Why this priority**: The project requires local auditable audio, and content
rewrites change spoken text.

**Independent Test**: Export voice lines, regenerate or validate the voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** same-kind wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- Some cards are represented by built-in visual tokens rather than scene images;
  they remain acceptable only when the token is familiar and the rule is clear.
- Category choices can be near each other, such as food and fruit, only when the
  wording explains why one is broader or narrower.
- Odd-one-out rounds should not rely on adult-only taxonomy; the common rule
  must be visible or familiar to a 4-year-old.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Same-kind rounds MUST state the grouping rule in child-friendly
  language without relying on exam-style phrasing.
- **FR-002**: Same-kind visual cards MUST support the prompt, answer, success,
  retry, and parent prompt.
- **FR-003**: Same-kind answer choices MUST have unique labels, unique values,
  and different meanings.
- **FR-004**: Same-kind distractors MUST represent plausible child mistakes,
  such as matching only color, matching a nearby category, or picking a related
  but not same-rule item.
- **FR-005**: Odd-one-out rounds MUST make the three matching cards and the
  breaking card explainable from visible or familiar properties.
- **FR-006**: Retry feedback MUST point back to the grouping rule or the
  majority group, not just say to try again.
- **FR-007**: Parent prompts MUST invite a concrete "why" explanation based on
  category, use, place, shape, food/non-food, or movement.
- **FR-008**: Same-kind audit checks MUST report game and round context for
  missing rule explanations, vague retry feedback, or weak odd-one-out feedback.
- **FR-009**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-010**: Maintained docs MUST record completed same-kind work and remaining
  logic-house follow-up.
- **FR-011**: The feature MUST pass `pnpm build` and `pnpm audit:curriculum`
  before completion.

### Key Entities *(include if feature involves data)*

- **Same-Kind Round**: A round asking the child to add one item to a visible
  category.
- **Odd-One-Out Round**: A round asking the child to find the item that does not
  match the majority rule.
- **Grouping Rule**: The child-friendly reason cards belong together, such as
  fruit, transport, school item, land animal, round shape, or edible item.
- **Distractor**: A wrong option representing a plausible but weaker rule.
- **Same-Kind Finding**: An audit result naming a same-kind round and the quality
  rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required for this slice; use existing
  visual tokens and registered local audio generation.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` if new same-kind rules are added.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, and targeted
  same-kind review.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every changed same-kind round has one clear visible grouping rule
  and feedback that names that rule.
- **SC-002**: Every changed odd-one-out round identifies the majority rule and
  why the selected card breaks it.
- **SC-003**: The curriculum audit reports zero problems after same-kind quality
  checks and content rewrites.
- **SC-004**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-005**: Documentation records the completed same-kind slice and remaining
  logic-house clusters.

## Assumptions

- Use `logic-same-kind-detective` as the only content cluster for this slice.
- Keep `数字岛` and the previous `logic-sorter-switch` behavior unchanged.
- Prefer existing visual tokens over new image generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
