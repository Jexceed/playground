# Feature Specification: Visual-Match Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。继 sorter 和 same-kind 后，继续处理更原始、偏文字化的逻辑屋内容。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exact-Match Cards Are Explainable (Priority: P1)

As a parent playing with a 4-year-old, I can open "一模一样在哪里" and see each
exact-match round ask the child to compare one sample card with answer cards
using concrete, visible features.

**Why this priority**: Exact-match tasks can look complete while still relying on
generic "same" wording. The child needs to know whether to compare color, shape,
object, and order.

**Independent Test**: Review every exact-match round and confirm the sample card,
choices, answer, success feedback, retry guidance, and parent prompt all name the
same visible comparison rule.

**Acceptance Scenarios**:

1. **Given** a child sees a sample card, **When** they compare the answer cards,
   **Then** only one answer card has all features and order matching the sample.
2. **Given** a child taps a correct exact-match answer, **When** feedback plays,
   **Then** the feedback names the visible features and order that made it match.
3. **Given** a parent asks "why", **When** the child explains, **Then** the
   parent prompt supports a concrete left-to-right comparison.

---

### User Story 2 - Odd-Card Choices Are Valid And Non-Repeating (Priority: P1)

As a maintainer, I can run the curriculum audit and catch visual-match rounds
where answer choices are generic, duplicated, accidentally ambiguous, or too weak
to explain.

**Why this priority**: The user explicitly requires option correctness,
effectiveness, difficulty control, no repetition, and verification.

**Independent Test**: Add visual-match audit rules, run the audit to see it fail
on current weak wording, then rewrite content until the audit passes.

**Acceptance Scenarios**:

1. **Given** an odd-card round says only "right/middle is different", **When**
   the audit runs, **Then** it reports missing pair/position explanation.
2. **Given** a round offers three card choices, **When** the audit inspects them,
   **Then** it can verify that exactly one choice equals the sample or exactly
   one card differs from the other two.
3. **Given** a changed visual-match round has child-friendly, distinct,
   explainable options, **When** the audit runs, **Then** no visual-match finding
   remains.

---

### User Story 3 - Visual-Match Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for rewritten visual-match
prompts, choices, feedback, and parent guidance.

**Why this priority**: The project requires local auditable audio, and visual
wording changes alter spoken text.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** visual-match wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- Two visual cards may use the same objects in a different order; the prompt and
  feedback must make order comparison explicit.
- A distractor may share the first item or color with the target, but it must
  fail exactly because another visible feature or position differs.
- Position-answer choices such as left, middle, and right are acceptable only
  when the success, retry, and parent prompt tell the child which two cards match
  and how the remaining card differs.
- Repeated rounds produced by `repeatTo` are acceptable only when the source
  cases are distinct and the audit still detects duplicate source signatures.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Exact-match rounds MUST show one sample card and exactly one
  answer choice that fully matches its visible features and left-to-right order.
- **FR-002**: Exact-match distractors MUST represent plausible child mistakes,
  such as reversed order, one changed feature, or repeated item, not unrelated
  noise.
- **FR-003**: Exact-match success feedback MUST name the matching card and at
  least two visible comparison points or the exact left-to-right order.
- **FR-004**: Exact-match retry feedback MUST guide the child to compare
  left-to-right and require every part to match.
- **FR-005**: Exact-match parent prompts MUST invite the child to explain which
  distractor is close and why it still differs.
- **FR-006**: Odd-card rounds MUST have exactly two matching cards and one card
  that differs by a visible position, object, color, shape, or order.
- **FR-007**: Odd-card success feedback MUST identify the answer position, name
  the matching pair, and describe the visible difference.
- **FR-008**: Odd-card retry feedback MUST ask the child to find the matching
  pair first before choosing the remaining card.
- **FR-009**: Odd-card parent prompts MUST ask which two cards match and where
  the remaining card differs.
- **FR-010**: Visual-match audit checks MUST report game and round context for
  generic feedback, weak retry/parent prompts, invalid exact-match choices, and
  invalid odd-card structures.
- **FR-011**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-012**: Maintained docs MUST record completed visual-match work and
  remaining logic-house follow-up.
- **FR-013**: The feature MUST pass `pnpm build` and `pnpm audit:curriculum`
  before completion.

### Key Entities *(include if feature involves data)*

- **Visual-Match Round**: A round in `logic-visual-match` that asks the child to
  match a sample card or identify one card that differs.
- **Sample Card**: The visible model card used by exact-match rounds.
- **Answer Card**: A selectable card candidate that may match the sample or act
  as a distractor.
- **Odd Card**: The one card in an odd-card round that differs from the matching
  pair.
- **Comparison Rule**: The visible basis for comparison, such as color, shape,
  object identity, position, or left-to-right order.
- **Visual-Match Finding**: An audit result naming a visual-match round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing visual tokens and
  generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with visual-match guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, and targeted
  visual-match review.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every source exact-match case has one sample card, three distinct
  choices, and exactly one fully matching answer.
- **SC-002**: Every source odd-card case has three displayed cards with exactly
  two matching cards and one explainable different card.
- **SC-003**: Every changed visual-match round has feedback and parent guidance
  that names the visible comparison basis.
- **SC-004**: The curriculum audit reports zero problems after visual-match
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed visual-match slice and
  remaining logic-house clusters.

## Assumptions

- Use `logic-visual-match` as the only content cluster for this slice.
- Keep `数字岛`, `logic-sorter-switch`, and `logic-same-kind-detective` behavior
  unchanged.
- Prefer existing emoji/phrase visual tokens over new image generation for this
  slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
