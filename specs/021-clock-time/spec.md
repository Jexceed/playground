# Feature Specification: Clock-Time Reading

**Feature Branch**: `021-clock-time`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "再做一套题目，是教小孩识别时钟的；采用 B 方案：基础读时钟，加生活时间。后续反馈明确生活时间题应体现 12 小时钟面到 24 小时电子钟时间的转换，题面不能直接写上午/下午等答案线索。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read Whole And Half Hours (Priority: P1)

A child and parent can open a new 数字岛 clock game and read analog clock faces
that show whole hours and half hours, using the short hand and long hand as the
main evidence.

**Why this priority**: Clock learning starts with distinguishing the hour hand
from the minute hand. If the child cannot explain which hand points where, later
morning/afternoon questions become guessing.

**Independent Test**: The new clock game can be opened from 数字岛, every early
round shows a clear analog clock surface, and feedback names the minute hand
as the long hand, the hour hand as the short hand, and the correct `HH:MM`
time.

**Acceptance Scenarios**:

1. **Given** the clock face shows the minute hand/long hand at 12 and the hour
   hand/short hand at 7, **When** the child chooses "07:00", **Then** the
   success feedback explains that the minute hand at 12 means `00` minutes and
   the hour hand points to 7.
2. **Given** the clock face shows the minute hand/long hand at 6 and the hour
   hand/short hand between 3 and 4, **When** the child chooses "03:30", **Then**
   the success feedback explains that the minute hand at 6 means `30` minutes
   and the hour hand has gone past 3.
3. **Given** a child chooses a distractor, **When** retry guidance plays,
   **Then** it asks the child to check the long hand first and then the short
   hand, not to guess from the most noticeable number.

---

### User Story 2 - Convert Scene Clock Time To 24-Hour Time (Priority: P1)

A child and parent can answer life-context rounds that pair a 12-hour analog
clock with ordinary preschool routines such as breakfast, lunch, nap, play,
dinner, and bath time, then choose the matching 24-hour electronic clock time.

**Why this priority**: The user clarified that the intended concept is not
choosing day-part words. The scene should supply the daily-context clue, while
the answer checks whether the child can map a 12-hour clock reading to a
24-hour written time.

**Independent Test**: Rounds include generated activity scenes and choices in
`HH:MM` form. Pre-answer prompt, instruction, visible context, and choices do
not reveal 上午/下午/晚上 labels, while feedback explains the scene-to-24-hour
conversion.

**Acceptance Scenarios**:

1. **Given** the generated scene shows breakfast and the clock reads 8:00,
   **When** the child chooses "08:00", **Then** feedback explains that the
   breakfast scene makes the 24-hour electronic time 08:00.
2. **Given** the clock reads 7:00 and the generated scene shows dinner/bath
   routine, **When** the child chooses "19:00", **Then** feedback explains why
   it is 19:00 rather than 07:00.
3. **Given** a nap-after-play context with a 3:30 clock, **When** the child
   chooses "03:30", **Then** retry guidance points back to the scene activity
   and the 24-hour electronic clock choices.

---

### User Story 3 - Preserve Parent-Child Explainability And Local Audio (Priority: P2)

Parents can ask "你怎么看出来的" after each clock round, and the local voice
script stays aligned with changed prompt, choice, feedback, retry, and parent
guidance text.

**Why this priority**: The project treats audio and parent prompts as part of
the learning surface. Clock reading needs spoken repetition so the child can say
"先看时针（短针）在 7，再看分针（长针）在 12".

**Independent Test**: Exported voice lines include the new clock game text, the
voice manifest is synchronized, and the curriculum audit rejects clock rounds
whose wording does not name the hand or daily-context evidence.

**Acceptance Scenarios**:

1. **Given** a clock-reading round, **When** success feedback plays, **Then** it
   states the hour-hand position before the minute-hand position and the time.
2. **Given** a daily-context round, **When** parent guidance is shown, **Then**
   it asks the parent to have the child explain the activity clue and the time
   clue.
3. **Given** wording changes for the clock game, **When** the voice export and
   audit run, **Then** there are no missing, extra, duplicate, or failed voice
   entries.

### Edge Cases

- Whole-hour rounds must not accept a half-hour answer just because the hour
  number matches.
- Half-hour rounds must avoid showing the short hand exactly on the hour number;
  it should be visibly between two hour marks.
- Time-conversion rounds must use generated daily activity scenes and avoid
  treating the same numeric clock time as sufficient by itself.
- Distractors must represent plausible mistakes: swapping short/long hands,
  ignoring "half past", choosing the right number but wrong part of day, or
  matching the activity but not the clock.
- The new game must not become a decorative scene-only task; the clock face is
  the authoritative visual evidence.
- If standard Edge voice generation is unavailable, exported voice lines must
  remain ready and the final report must state the exact blocker.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add one new 数字岛 game focused on analog clock
  reading and daily part-of-day concepts.
- **FR-002**: The new game MUST include exactly twelve independently answerable
  first-pass rounds.
- **FR-003**: At least four rounds MUST teach whole-hour reading with the long
  hand at 12 and the short hand pointing to the hour.
- **FR-004**: At least four rounds MUST teach half-hour reading with the long
  hand at 6 and the short hand visually between hour marks.
- **FR-005**: At least four rounds MUST connect a 12-hour analog clock and a
  daily scene to a 24-hour electronic clock answer in `HH:MM` form.
- **FR-006**: Every clock round MUST show a dedicated analog clock visual surface
  with hour marks, two distinguishable hands, and child-readable time evidence.
- **FR-007**: Every clock round MUST have exactly one correct answer and at
  least three choices whose wrong answers are plausible clock-reading or
  24-hour conversion mistakes.
- **FR-008**: Success, retry, and parent prompts MUST name the clock evidence
  for clock-reading rounds or the scene/activity and 24-hour conversion
  evidence for context rounds.
- **FR-009**: Curriculum audit MUST reject missing clock surfaces, unsupported
  clock minutes, weak feedback, duplicate clock signatures, and clock game round
  counts other than twelve.
- **FR-010**: Changed spoken/selectable text MUST be exported to voice lines and
  validated against the local voice manifest.
- **FR-011**: Maintained docs MUST record the completed clock-time feature and
  any remaining follow-up.
- **FR-012**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.
- **FR-013**: Because this affects local use experience, the Mac app MUST be
  installed with `pnpm mac:install` or the final report MUST state the failure
  reason.

### Key Entities *(include if feature involves data)*

- **Clock-Time Game**: A 数字岛 progressive game for reading analog time and
  converting scene-based 12-hour readings into 24-hour electronic time.
- **Clock Round**: A question round with a clock visual surface, prompt,
  instruction, choices, answer, feedback, retry guidance, parent prompt, level,
  and ability tags.
- **Clock Visual Surface**: The rendered analog clock face containing hour,
  minute, and hand evidence.
- **Time-Conversion Context**: A generated daily activity scene such as
  breakfast, lunch, nap, play, dinner, or bath time that helps decide whether a
  12-hour clock reading maps to an early-day or later-day 24-hour value.
- **Clock Audit Finding**: A curriculum audit problem naming the clock game,
  round, and violated content-quality rule.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: The four time-conversion context rounds require generated 1200x675
  daily-routine scene PNGs under `public/images/scenes/`, with source images in
  `public/images/scenes/source/` and registration in `src/data/imageGallery.ts`.
  The clock face remains rendered locally from structured round data so hand
  positions stay deterministic. Audio assets under `public/audio/` are affected
  by new spoken text.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and this feature's
  Spec Kit artifacts.
- **Audit Coverage**: `pnpm audit:curriculum`, `pnpm export:voice-lines`,
  voice manifest validation, `pnpm build`, `git diff --check`, and
  `pnpm mac:install`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 数字岛 contains a new clock-time game with exactly 12 rounds.
- **SC-002**: The new game includes at least 4 whole-hour rounds, 4 half-hour
  rounds, and 4 daily-context 24-hour conversion rounds.
- **SC-003**: Every clock round has one dedicated clock visual surface and at
  least three choices with the answer appearing exactly once; time-conversion
  rounds additionally include a local scene image and `HH:MM` answer choices.
- **SC-004**: Every whole-hour or half-hour round has success/retry/parent text
  that names the minute hand/long hand and hour hand/short hand evidence, and
  uses `HH:MM` time labels instead of `点` or `点半` wording.
- **SC-005**: Every daily-context round has success/retry/parent text that names
  the activity scene and 24-hour electronic clock conversion.
- **SC-006**: The curriculum audit reports zero problems after clock-time audit
  checks and content implementation.
- **SC-007**: Exported voice-line source and local voice manifest have no
  missing, extra, duplicate, or failed entries after wording changes.
- **SC-008**: Final verification records the results of build, audit,
  whitespace, and Mac install commands.

## Assumptions

- The first pass belongs in 数字岛 because the core learning target is numeric
  time language and daily time concepts; the clock face is a supporting visual
  surface, not a 图形工坊 shape task.
- The first pass teaches only whole hours and half hours, not quarter hours,
  five-minute increments, or elapsed-time arithmetic.
- The pre-answer time-conversion prompt, instruction, visible context card, and
  choices will not directly reveal 上午/下午/晚上 labels.
- Local rendered clock graphics are acceptable for this feature because they are
  deterministic, auditable, and tied directly to structured content data.
