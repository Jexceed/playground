# Feature Specification: Order-Plan Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在相机记忆题后，继续处理仍未专项审计的顺序计划题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Missing-Step Rounds Are Sequence-Based (Priority: P1)

As a parent playing with a 4-year-old, I can trust that every `logic-order-plan`
round has one visible missing position, one correct answer choice, and a filled
sequence that the child can replay from left to right.

**Why this priority**: Sequence planning is only explainable if the answer is
anchored in a visible before-and-after flow. Without a single missing position,
the child is guessing from choices instead of completing a plan.

**Independent Test**: Add audit checks that verify each order-plan round has a
sequence with exactly one `?`, an answer choice exactly once, and feedback that
names the filled sequence.

**Acceptance Scenarios**:

1. **Given** the sequence is `口渴`, `?`, `倒水`, `喝水`, **When** the answer is
   "先拿杯子", **Then** feedback can say the filled order from target to result.
2. **Given** a round has multiple `?` slots, **When** the audit runs, **Then**
   it reports the round as invalid.
3. **Given** a child answers correctly, **When** success feedback plays,
   **Then** it names the answer and the visible steps around it.

---

### User Story 2 - Feedback Supports Child Replay (Priority: P1)

As a parent, I can use success, retry, and parent prompts to ask the child to
replay the concrete steps, not just hear a generic rule.

**Why this priority**: Four-year-olds need to say "先、然后、再、最后" with the
actual cards. Generic prompts like "think from the goal" do not prove the child
understands this specific task.

**Independent Test**: Run the curriculum audit and confirm success, retry, and
parent prompts name the filled sequence, answer, and replay strategy.

**Acceptance Scenarios**:

1. **Given** a missing-step round, **When** retry guidance plays, **Then** it
   asks the child to say the sequence from left to right with the missing step.
2. **Given** a parent prompt is shown, **When** the parent asks "why", **Then**
   the prompt names the actual answer and asks for a pointed or spoken replay.
3. **Given** the answer is a middle step, **When** feedback plays, **Then** it
   explains the step in context rather than only naming the answer.

---

### User Story 3 - Order-Plan Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed order-plan feedback,
retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** order-plan wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A sequence must contain exactly one `?` missing position.
- The answer choice must appear exactly once by value.
- Emoji or shorthand sequence tokens must be converted to child-facing labels
  before wording checks.
- Filled feedback must include the answer and all visible sequence steps after
  normalization.
- A retry prompt must not be generic across all rounds; it must name the current
  sequence and missing answer.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each `logic-order-plan` round MUST show a sequence with exactly
  one `?` missing position.
- **FR-002**: Each round's answer MUST appear in choices exactly once.
- **FR-003**: The filled sequence MUST be constructible by replacing `?` with
  the answer choice label.
- **FR-004**: Success feedback MUST name the filled sequence and the answer.
- **FR-005**: Retry guidance MUST name the filled sequence, answer, and a
  left-to-right or ordered replay strategy.
- **FR-006**: Parent prompts MUST name the filled sequence and answer, and ask
  the parent to have the child point, say, or explain the flow.
- **FR-007**: Order-plan audit checks MUST report game and round context for
  missing sequence data, missing slot problems, answer-choice problems, or weak
  feedback/retry/parent prompts.
- **FR-008**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-009**: Maintained docs MUST record completed order-plan work and the next
  logic-house follow-up.
- **FR-010**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Order-Plan Round**: A round in `logic-order-plan` using `sequence` as the
  visible plan surface.
- **Filled Sequence**: The sequence after replacing `?` with the answer choice
  label.
- **Order-Plan Finding**: An audit result naming an order-plan round and the
  quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing scenes, sequence
  visual tokens, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with order-plan guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  order-plan review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every order-plan source round has exactly one missing sequence
  slot and an answer choice exactly once.
- **SC-002**: Every order-plan success, retry, and parent prompt names the
  filled sequence and answer.
- **SC-003**: The curriculum audit reports zero problems after order-plan
  quality checks and content rewrites.
- **SC-004**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-005**: Documentation records the completed order-plan slice and remaining
  logic-house follow-up without stale references.

## Assumptions

- Use `logic-order-plan` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing scenes and sequence tokens over new image generation for this
  slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
