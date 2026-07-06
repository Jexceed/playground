# Feature Specification: Pattern-Train Logic Quality

**Feature Branch**: `dev`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "继续完善逻辑屋。每个任务都要考虑图、文、音一致；选项正确、有效、难度合适且不重复；对小孩友好；每个任务都要验证。在顺序计划题后，继续处理仍未专项审计的规律火车题。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Missing Cards Are Derived From The Repeat Unit (Priority: P1)

As a parent playing with a 4-year-old, I can trust that every
`logic-pattern-train` round has one visible missing card and one answer that can
be derived by repeating the shown unit.

**Why this priority**: Pattern prediction only works when the child can say the
repeat unit and use it to fill the blank. If answer choices come from unrelated
cards, the task becomes guessing or recognition noise.

**Independent Test**: Add audit checks that reconstruct the repeated sequence,
verify exactly one `?`, and confirm the answer fills the missing position.

**Acceptance Scenarios**:

1. **Given** the repeat unit is "红色圆片、蓝色圆片", **When** the missing slot
   is first, middle, or near the end, **Then** the answer is the token that would
   appear at that position in the repeated sequence.
2. **Given** a round has no missing slot or more than one `?`, **When** the
   audit runs, **Then** it reports the round as invalid.
3. **Given** a visible pattern uses food or shape cards, **When** choices are
   shown, **Then** the choices are meaningful pattern alternatives rather than
   unrelated global filler cards.

---

### User Story 2 - Choices Are Meaningful And Child-Friendly (Priority: P1)

As a parent, I can point to each choice and explain what mistake it represents:
the next card in the unit, the previous card in the unit, or another visible
unit member.

**Why this priority**: Preschool distractors should reflect common pattern
mistakes, such as continuing from the wrong place, not unrelated colors or
objects that never appear in the pattern.

**Independent Test**: Run the curriculum audit and confirm each pattern-train
round has unique answer choices, includes the answer exactly once, and uses
choice labels drawn from the visible repeat unit or documented close
distractors.

**Acceptance Scenarios**:

1. **Given** a two-card pattern, **When** choices render, **Then** the wrong
   choices use the other unit card and one close visible-style distractor.
2. **Given** a three-card pattern, **When** choices render, **Then** each choice
   maps to a different unit member.
3. **Given** an answer is "草莓", **When** choices render, **Then** unrelated
   "红色圆片" or "蓝色圆片" choices are not used just to fill slots.

---

### User Story 3 - Feedback Supports Saying The Pattern Aloud (Priority: P2)

As a parent, I can use success, retry, and parent prompts to ask the child to
say the repeat unit, fill the blank, and explain the answer.

**Why this priority**: Four-year-olds often solve patterns by chanting the
sequence aloud. Feedback should model that strategy using the actual cards in
the current round.

**Independent Test**: Run the curriculum audit and confirm success, retry, and
parent prompts name the repeat unit, filled sequence, and answer.

**Acceptance Scenarios**:

1. **Given** a child answers correctly, **When** success feedback plays,
   **Then** it says the repeat unit and names the blank answer.
2. **Given** a child misses the answer, **When** retry guidance plays, **Then**
   it asks the child to say the repeat unit from left to right and land on the
   blank.
3. **Given** a parent prompt is shown, **When** the parent asks "why", **Then**
   the prompt asks the child to point to the repeated chunks and explain the
   answer.

---

### User Story 4 - Pattern-Train Voice Lines Stay Local And Synced (Priority: P2)

As a family using audio, I can hear local voice for changed pattern-train
feedback, retries, choices, and parent guidance.

**Why this priority**: The project treats local audio as an auditable asset.
Changing wording without regenerating voice assets leaves text and speech out of
sync.

**Independent Test**: Export voice lines, regenerate or validate the local voice
manifest, and run the curriculum audit with no missing or extra voice IDs.

**Acceptance Scenarios**:

1. **Given** pattern-train wording changes, **When** voice lines are exported,
   **Then** changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the audit compares
   it to exported voice lines, **Then** there are no missing, extra, duplicate,
   or failed generated entries.

### Edge Cases

- A pattern-train sequence must contain exactly one `?` missing position.
- The answer choice must appear exactly once by value.
- Each choice set must include at least three options.
- The answer must equal the expected token at the missing position of the
  repeated full sequence.
- Choice values must not duplicate and should be explainable from the visible
  unit or a close visual neighbor.
- Emoji and symbol tokens must be converted to child-facing labels before audit
  wording checks.
- Filled feedback must include the answer, repeat unit, and enough of the
  filled sequence for a child to replay it.
- If local voice generation cannot run, the feature must leave exported voice
  lines ready and record the exact blocker in maintained docs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each `logic-pattern-train` round MUST show a sequence with exactly
  one `?` missing position.
- **FR-002**: Each round MUST define its repeat unit or otherwise provide enough
  sequence data for the audit to derive the expected missing token.
- **FR-003**: Each round's answer MUST match the token at the missing position
  in the repeated sequence.
- **FR-004**: Each round's answer MUST appear in choices exactly once.
- **FR-005**: Choice labels and values MUST be unique, meaningful for the
  visible pattern, and include at least three options.
- **FR-006**: Success feedback MUST name the repeat unit, filled sequence, and
  answer.
- **FR-007**: Retry guidance MUST name the repeat unit or filled sequence and
  ask the child to say or follow the order again.
- **FR-008**: Parent prompts MUST ask the parent to have the child point, say,
  or explain the repeated chunks and answer.
- **FR-009**: Pattern-train audit checks MUST report game and round context for
  missing sequence data, answer mismatch, weak choices, or weak
  feedback/retry/parent prompts.
- **FR-010**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-011**: Maintained docs MUST record completed pattern-train work and the
  next logic-house follow-up.
- **FR-012**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Pattern-Train Round**: A round in `logic-pattern-train` using `sequence` as
  the visible pattern surface.
- **Repeat Unit**: The ordered tokens that repeat, such as "红、蓝" or
  "太阳、月亮、星星".
- **Filled Sequence**: The visible sequence after replacing `?` with the answer
  token.
- **Pattern-Train Finding**: An audit result naming a pattern-train round and
  the quality rule it violates.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required; use existing sequence visual
  tokens and generated local audio.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with pattern-train guidance and status.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`,
  `pnpm export:voice-lines`, local voice manifest validation, targeted
  pattern-train review, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every pattern-train source round has exactly one missing sequence
  slot and a derivable answer.
- **SC-002**: Every pattern-train choice set contains at least three options,
  contains the answer exactly once, has unique values and labels, and avoids
  unrelated filler choices.
- **SC-003**: Every pattern-train success, retry, and parent prompt names the
  repeat unit or filled sequence and answer.
- **SC-004**: The curriculum audit reports zero problems after pattern-train
  quality checks and content rewrites.
- **SC-005**: The exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-006**: Documentation records the completed pattern-train slice and
  remaining logic-house follow-up without stale references.

## Assumptions

- Use `logic-pattern-train` as the only content cluster for this slice.
- Keep `数字岛` and previous logic-house cluster behavior unchanged.
- Prefer existing visual tokens over new image generation for this slice.
- Keep work on local `dev` unless the user explicitly asks to push or release.
