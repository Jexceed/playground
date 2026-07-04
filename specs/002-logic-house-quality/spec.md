# Feature Specification: Logic House Quality

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "按照编程规范继续完成当前项目；每个任务都要考虑图、文、音一致，选项正确、有效、难度合适且不重复，对小孩友好，并且每个任务都要验证。当前“数字岛”相对比较完善，但是“逻辑屋”很多内容还很原始。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logic Tasks Have Strong Quality Gates (Priority: P1)

As a maintainer, I can run the curriculum audit and catch logic-house tasks that
violate the product rules before they reach a child.

**Why this priority**: The current audit proves basic structure, but the user's
explicit quality rules need stronger coverage before large content edits.

**Independent Test**: Run the curriculum audit after intentionally reviewing the
logic-house content; the report must flag duplicated or weak choices,
unsupported visual wording, missing child-friendly guidance, and missing voice
coverage.

**Acceptance Scenarios**:

1. **Given** a logic-house round has repeated choice meaning, **When** the
   curriculum audit runs, **Then** the issue is reported with the game and round.
2. **Given** a logic-house round uses a visual clue not shown in its scene or
   cards, **When** the curriculum audit runs, **Then** the issue is reported
   before the change is considered complete.
3. **Given** a logic-house round has prompt or feedback wording that is too
   abstract, negative, or trick-like for a preschool child, **When** the
   curriculum audit runs, **Then** the issue is reported for rewrite.

---

### User Story 2 - Primitive Logic Content Is Reworked Into Child-Friendly Rounds (Priority: P1)

As a parent playing with a 4-year-old child, I can open logic-house games and see
concrete scenes, clear prompts, plausible distractors, and feedback that invites
the child to explain a reason.

**Why this priority**: The user identified logic-house content as the weakest
area, while math content is already comparatively complete.

**Independent Test**: Review each changed logic-house game and confirm every
round has one clear goal, coherent visual support, valid answer choices, and a
parent prompt that supports "why" discussion.

**Acceptance Scenarios**:

1. **Given** a child sees a changed logic-house round, **When** they compare the
   scene, cards, prompt, choices, and feedback, **Then** all elements refer to
   the same concrete situation.
2. **Given** a child chooses a wrong answer, **When** the retry feedback plays,
   **Then** it points back to the relevant clue or rule without shaming,
   tricking, or using double-negative wording.
3. **Given** a parent reads the parent prompt, **When** they ask a follow-up,
   **Then** the child can explain a reason using visible evidence, a rule, or a
   sequence.

---

### User Story 3 - Voice Lines Stay Synchronized With Rewritten Content (Priority: P2)

As a family using the app with audio, I can hear local voice for changed
logic-house prompts, choices, feedback, and parent guidance, with browser speech
remaining only a fallback.

**Why this priority**: The project requires local auditable audio, and content
rewrites change the text that needs voice coverage.

**Independent Test**: After content changes, export voice lines, regenerate or
verify the local voice manifest, and run the curriculum audit with no missing or
extra voice IDs.

**Acceptance Scenarios**:

1. **Given** a logic-house prompt or choice is rewritten, **When** voice lines are
   exported, **Then** the changed text appears in the voice-line source.
2. **Given** the local voice manifest is validated, **When** the curriculum audit
   compares it to exported voice lines, **Then** there are no missing IDs, extra
   IDs, duplicate IDs, or failed generated files.

### Edge Cases

- Some logic rounds intentionally use simple symbols rather than full scene
  images; these remain valid only when the symbol cards are concrete,
  child-readable, and supported by clear wording.
- Similar choices can be acceptable when the distinction is the learning target,
  but each option must have a different meaning and a plausible child mistake.
- A harder L6 round may use multi-step reasoning, but it still must be playable
  by a parent and preschool child without abstract test-prep wording.
- Voice generation may be unavailable in a local environment; if so, the feature
  must record the exact missing generation step and still keep exported voice
  lines ready for generation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Logic-house quality checks MUST cover graph-text-audio coherence:
  prompts, visual surfaces, choices, success feedback, retry feedback, parent
  prompts, and voice-line exports must refer to the same intended task.
- **FR-002**: Logic-house quality checks MUST detect duplicate answer choices by
  label, value, and repeated meaning within the same round.
- **FR-003**: Logic-house quality checks MUST detect answer choices that are
  unrelated to the task, accidentally valid, impossible to distinguish, or based
  mainly on trick wording.
- **FR-004**: Logic-house quality checks MUST detect child-unfriendly wording,
  including double negatives, overly abstract test-prep phrasing, shameful
  retry language, and vague filler labels.
- **FR-005**: Logic-house quality checks MUST require every changed round to have
  a difficulty explanation that matches the reasoning load and visible surface.
- **FR-006**: Reworked logic-house rounds MUST preserve or improve child-facing
  concreteness by using visible evidence, simple rules, sequence cards, memory
  cards, grids, or registered scene images.
- **FR-007**: Reworked logic-house distractors MUST represent common child
  mistakes or weaker strategies, such as looking at the wrong clue, using an old
  rule, skipping a necessary step, or choosing a related but less fitting item.
- **FR-008**: Reworked logic-house feedback MUST tell the child what clue or rule
  made the answer work, not just whether the answer was right.
- **FR-009**: Reworked logic-house parent prompts MUST leave room for a
  "why" explanation and must reference evidence, rule, order, category, or
  plan reasoning.
- **FR-010**: Changed text that is spoken or selectable MUST be reflected in the
  exported voice-line source and validated against the local voice manifest.
- **FR-011**: The feature MUST update maintained documentation to record the new
  quality rules, completed content changes, and remaining follow-up work.
- **FR-012**: The feature MUST pass the project build and curriculum audit before
  completion.

### Key Entities *(include if feature involves data)*

- **Logic-House Round**: A single child-facing question with prompt,
  instruction, visual surface, choices, answer, feedback, parent prompt, and
  ability tags.
- **Visual Surface**: The scene image, sequence cards, visual groups, grid,
  matrix, or memory cards that provide the child's evidence.
- **Answer Choice**: A selectable option with label and value; each choice must
  be unique, meaningful, and pedagogically valid.
- **Quality Finding**: A concrete audit result that names the game, round, and
  reason a task needs rewrite.
- **Voice Line**: A local-audio source entry derived from prompts, choices,
  feedback, and parent guidance.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image assets are required for the first slice. If a content
  fix needs new visuals, use registered local images and update the asset
  registry in the same task.
- **Docs**: Update `docs/build-generation-guide.md`, `docs/CHANGELOG.md`, and
  `docs/TODO.md`; update `docs/assets.md` if new image or audio rules are added.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`, voice-line export
  validation after wording changes, and a targeted review of changed logic-house
  rounds against the user quality rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every changed logic-house round passes a checklist for visual-text
  coherence, unique meaningful choices, child-friendly wording, valid
  difficulty, and explainable feedback.
- **SC-002**: The curriculum audit reports zero problems after the new quality
  checks and content rewrites are complete.
- **SC-003**: The exported voice-line source and local voice manifest have no
  missing IDs, extra IDs, duplicate IDs, or failed generated files after content
  changes are handled.
- **SC-004**: At least one primitive logic-house content cluster is improved in a
  way that can be tested independently, with no regression to existing math
  rounds.
- **SC-005**: Documentation records what changed, what was verified, and what
  logic-house work remains.

## Assumptions

- Start with a quality-gate-first slice, then use the findings to rewrite a
  focused set of logic-house rounds.
- Keep work on local `dev` unless the user explicitly asks for a release-style
  commit or push.
- Prefer tightening existing local data and audit rules before adding new UI
  surfaces or large new asset sets.
- Keep `数字岛` behavior unchanged except for shared audit checks that protect
  all curriculum content.
