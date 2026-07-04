# Feature Specification: Memory-Camera Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在方位小地图后，继续处理仍未专项审计的相机记忆题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Appeared-Item Rounds Name The Remembered Cards (Priority: P1)

As a parent playing with a 4-year-old, I can trust that "刚才出现过谁" rounds
ask about one card that was actually shown in the memory camera, with feedback
that repeats the remembered set before confirming the answer.

**Why this priority**: Recognition memory is only useful if the answer is
provable from the visible cards. Feedback should help the child rehearse the
cards, not just hear "right".

**Independent Test**: Review appeared-item rounds and run `pnpm audit:curriculum`
to confirm the answer maps to one shown memory item, choices include it once,
and feedback/retry/parent prompts name the remembered cards and the answer.

**Acceptance Scenarios**:

1. **Given** the camera shows apple, orange, and strawberry, **When** the prompt
   asks which item appeared, **Then** apple is a valid answer only because it
   was one of the shown cards.
2. **Given** a child answers correctly, **When** success feedback plays,
   **Then** it repeats the remembered set and confirms the selected answer.
3. **Given** the parent asks "why", **When** the child explains, **Then** the
   parent prompt supports saying the remembered set first.

---

### User Story 2 - Absent-Item Rounds Support Exclusion (Priority: P1)

As a parent, I can trust that "没有出现" rounds use distractors that were shown
and one answer that was not shown, so the child can exclude remembered cards.

**Why this priority**: Absence questions are harder for preschool children.
They should train "I saw these, so this one is extra", not guessing from a
random distractor.

**Independent Test**: Add audit checks that verify the absent answer is not in
the remembered set, every wrong choice is in the remembered set, and feedback
names the remembered cards before the absent answer.

**Acceptance Scenarios**:

1. **Given** the camera shows bird, fish, and dog, **When** the prompt asks
   which item did not appear, **Then** cat is correct because bird, fish, and
   dog were remembered.
2. **Given** a wrong option is shown, **When** the audit checks it, **Then** the
   wrong option must be one of the remembered cards.
3. **Given** retry guidance plays, **When** the child hears it, **Then** it asks
   them to recall the remembered cards before choosing the extra item.

---

### User Story 3 - Order Rounds Preserve Left-To-Right Position (Priority: P1)

As a parent, I can trust that first, second, third, and last memory rounds
compute the answer from the left-to-right order of the camera cards.

**Why this priority**: Order memory is a different reasoning load from item
recognition. Feedback must name the full order and the requested ordinal so the
child can explain the answer.

**Independent Test**: Verify each order prompt computes from the memory item
array, choices are shown cards, and success/retry/parent prompts name the
left-to-right sequence, requested ordinal, and answer.

**Acceptance Scenarios**:

1. **Given** the camera shows apple, dog, backpack, **When** the prompt asks for
   the first card, **Then** apple is the answer.
2. **Given** the prompt asks for the last card, **When** the audit computes the
   order, **Then** it uses the final item in the shown sequence.
3. **Given** the parent asks for a replay, **When** the child explains, **Then**
   the parent prompt asks them to say the cards in order.

---

### User Story 4 - Memory-Camera Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed memory-camera
prompts, feedback, retries, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets would leave text and speech
out of sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** memory-camera wording changes, **When** voice lines are exported,
   **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- Emoji memory items must compare by their child-facing label, such as `🍎` to
  `苹果`.
- Appeared-item answers must be present in the remembered set after label
  normalization.
- Absent-item answers must be absent from the remembered set, while wrong
  choices should be remembered cards.
- Order prompts must compute `最后一个` from the actual final item, not a fixed
  third position.
- Order choices should be remembered cards, not unrelated distractors.
- Feedback must not only say "出现过" or "在这个位置上"; it must name the
  remembered cards and reasoning step.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Appeared-item rounds MUST show a non-empty memory item list and
  the answer MUST match a remembered item after child-facing label normalization.
- **FR-002**: Appeared-item choices MUST include the answer exactly once and at
  least one plausible not-shown distractor.
- **FR-003**: Appeared-item success, retry, and parent prompts MUST name the
  remembered set and selected answer.
- **FR-004**: Absent-item rounds MUST show a non-empty memory item list and the
  answer MUST not match any remembered item after label normalization.
- **FR-005**: Absent-item wrong choices SHOULD be remembered items, so the
  child can use exclusion instead of unrelated guessing.
- **FR-006**: Absent-item success, retry, and parent prompts MUST name the
  remembered set and the absent answer.
- **FR-007**: Order rounds MUST compute answers from the memory item sequence
  using the requested ordinal: first, second, third, or last.
- **FR-008**: Order-round choices MUST include the computed answer exactly once
  and only use items from the remembered sequence.
- **FR-009**: Order-round success, retry, and parent prompts MUST name the
  left-to-right sequence, requested ordinal, and answer.
- **FR-010**: Memory-camera audit checks MUST report game and round context for
  missing memory items, wrong answers, invalid distractors, duplicate choices,
  weak feedback, retry gaps, or parent-prompt gaps.
- **FR-011**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-012**: Maintained docs MUST record completed memory-camera work and the
  next logic-house follow-up.
- **FR-013**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Memory-Camera Round**: A round in `logic-memory-camera` using
  `memory.items` as the visible camera cards.
- **Appeared-Item Round**: A memory round asking which item appeared in the
  shown cards.
- **Absent-Item Round**: A memory round asking which choice did not appear in
  the shown cards.
- **Order Round**: A memory round asking for a first, second, third, or last
  card from the remembered sequence.
- **Memory-Camera Finding**: An audit result naming a memory-camera round and
  the quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing `memory` visual
  surface, visual tokens, and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with memory-camera guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  memory-camera review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every appeared-item source round has an answer that appears in the
  remembered set after label normalization.
- **SC-002**: Every absent-item source round has an answer that is absent from
  the remembered set, and every wrong choice is a remembered card.
- **SC-003**: Every order source round computes the answer from the requested
  left-to-right ordinal.
- **SC-004**: The curriculum audit reports zero problems after memory-camera
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed memory-camera slice and
  remaining logic-house follow-up without stale references.

## Assumptions

- Use `logic-memory-camera` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing memory surfaces and visual tokens over new image generation
  for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
