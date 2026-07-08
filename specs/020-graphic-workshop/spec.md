# Feature Specification: Graphic Workshop

**Feature Branch**: `dev`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Existing related content may be added as reinforcement when the difficulty and assessment point differ, but avoid excessive repetition and redundancy. New content should become the new 图形工坊 dimension based on the reference analysis."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add 图形工坊 As A New Dimension (Priority: P1)

A child and parent can choose a new 图形工坊 world that contains concrete drawn visual-processing task families not already covered by 逻辑屋: silhouette matching, occlusion recovery, local-detail-to-whole matching, transparent layer overlap, graphic coding, and visual closure.

**Why this priority**: The reference corpus contains many tasks whose core work is visual operation rather than arithmetic or logical explanation. A separate world keeps the app structure clear and prevents logic-house bloat.

**Independent Test**: Opening the app shows 图形工坊 next to 数字岛 and 逻辑屋, and every 图形工坊 round has a visible surface, child-facing wording, valid choices, concrete feedback, and parent prompts that name the visual evidence.

**Acceptance Scenarios**:

1. **Given** the app home view, **When** the parent selects 图形工坊, **Then** the game list shows only graphic-workshop games and each game can be opened.
2. **Given** any 图形工坊 round, **When** the child answers correctly, **Then** the success feedback names the visible rule or visual evidence rather than only saying the answer is correct.
3. **Given** any 图形工坊 round, **When** the child chooses a distractor, **Then** the retry guidance points back to the relevant visual operation such as reading a silhouette contour, checking what is covered, using a local clue, comparing top/bottom layers, following a graphic code table, or matching a missing edge.

---

### User Story 2 - Add Only Differentiated Reinforcement To Existing Worlds (Priority: P2)

Existing 数字岛 and 逻辑屋 may receive a small number of reinforcement rounds only when the new round adds a distinct difficulty step or assessment point from the reference analysis.

**Why this priority**: The reference bundle includes several numeric and logic-adjacent tasks, but adding all of them would create redundancy. Reinforcement must sharpen coverage without turning the app into a drill bank.

**Independent Test**: Audit checks can identify new reinforcement rounds and confirm they are not duplicate signatures of existing rounds, while the final app remains balanced across worlds.

**Acceptance Scenarios**:

1. **Given** an added existing-world round, **When** it is compared with the earlier rounds in the same game, **Then** it differs by core assessment point, difficulty, or child action, not only by swapped icons.
2. **Given** the full built-in question bank, **When** the curriculum audit runs, **Then** it rejects exact duplicate round signatures and graphic-workshop games with excessive round counts.

---

### User Story 3 - Preserve Parent-Child Explainability (Priority: P3)

Parents can use the new world to ask "why" and "how did you see it" questions, not just check if a child selected the right answer.

**Why this priority**: The project constitution requires every task to leave space for explanation. Visual-spatial questions can easily become opaque pattern drills unless feedback names the visible evidence.

**Independent Test**: Reviewing every new or reinforced round shows that prompt, visual surface, options, success, retry, and parent prompt all point to the same visible operation.

**Acceptance Scenarios**:

1. **Given** a silhouette, layer, or closure round, **When** the parent reads the parent prompt, **Then** it asks the child to verbalize the edge, corner, outline, overlap, top/bottom relation, or missing side that supports the answer.
2. **Given** an occlusion, local-clue, or code round, **When** the parent reads feedback, **Then** it states the visible cue or mapping used to reach the answer.

---

### Edge Cases

- If saved progress points to an unknown world or game after adding 图形工坊, startup must fall back to a valid world, game, and round.
- If a graphic-workshop round uses a task operation already covered in 逻辑屋, such as exact matching, repeated patterns, row-column grids, ordinary part-whole missing pieces, arrow rotation, or short visual memory, the audit must reject it for this feature.
- If total round counts grow too quickly, the first implementation should prefer fewer stronger rounds over large repeated generated sets.
- If a visual item is not recognized by the dedicated graphic renderer, the audit must catch text-only or unsupported answer options before completion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add 图形工坊 as a selectable world with its own stable world identifier, name, icon treatment, summary, question count, and game list.
- **FR-002**: System MUST include an initial 图形工坊 content set covering six concrete drawn task families: silhouette matching, occlusion recovery, local-detail-to-whole matching, transparent layer overlap, graphic coding, and visual closure.
- **FR-003**: Every 图形工坊 game MUST include exactly eight independently answerable rounds in the refined first implementation.
- **FR-004**: Every 图形工坊 round MUST have exactly one dedicated `graphicChallenge` surface with SVG-renderable stem figures and four drawn answer options labeled A/B/C/D.
- **FR-005**: Every 图形工坊 round MUST use plausible near-miss distractors tied to visual mistakes such as same outline family but wrong ears, same rounded edge but missing leaf, covered part confused with another whole, wrong local detail, reversed top/bottom layer order, adjacent code-table row, or wrong missing-edge direction.
- **FR-006**: Existing 数字岛 or 逻辑屋 reinforcement MUST be limited to rounds that add a new difficulty step or assessment point derived from the reference analysis, such as before/after skip counting or descending visual number patterns.
- **FR-007**: System MUST avoid duplicate round signatures within each game and MUST keep new first-pass content compact enough to avoid redundant drill-bank behavior.
- **FR-008**: App storage and startup behavior MUST recognize the new world and recover safely from stale saved world/game/round values.
- **FR-009**: Curriculum audit MUST cover the new world identifier, graphic-workshop content boundaries, duplicate checks, visible-surface requirements, and wording coherence.
- **FR-010**: Documentation MUST record the feature, the reference-derived taxonomy, the change summary, and any remaining follow-up work.

### Key Entities *(include if feature involves data)*

- **World**: A top-level content dimension with id, display name, icon, summary, question count, and game list.
- **Graphic Workshop Game**: A progressive set game in the graphic world that teaches one visual-spatial task family.
- **Graphic Workshop Round**: A question round with a `graphicChallenge` visual surface, prompt, instruction, four drawn choices, answer, feedback, retry guidance, parent prompt, difficulty level, and ability tags.
- **Reinforcement Round**: A new round in an existing world that is allowed only when it introduces a distinct assessment point or difficulty step.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: Use local image-gen PNG sticker assets for 图形工坊 figure art, registered in `imageGallery.items`, with dynamic SVG composition for shadows, covers, overlaps, code tables, and missing-edge masks.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and add or update a maintained reference-analysis note for 图形工坊 content strategy.
- **Audit Coverage**: `pnpm audit:curriculum`, `pnpm build`, and `git diff --check` must prove the implementation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 图形工坊 appears as a third selectable world and contains exactly six first-pass games with eight rounds each, for 48 graphic rounds.
- **SC-002**: Existing-world reinforcement adds no more than three rounds in this feature and each added round has a distinct reason documented in code comments or feature docs.
- **SC-003**: `pnpm audit:curriculum` fails if 图形工坊 is removed, if any graphic-workshop game has a count other than eight rounds, if fewer than 48 graphic rounds exist, or if new rounds duplicate an existing signature within their game.
- **SC-004**: Every new graphic round has non-empty prompt, instruction, success, retry, parent prompt, answer-in-choices, one `graphicChallenge`, and four drawn answer options.
- **SC-005**: Final verification runs `pnpm build`, `pnpm audit:curriculum`, and `git diff --check` successfully.

## Assumptions

- The first pass uses image-gen PNG sticker figures inside dedicated graphic surfaces; custom generated scene images can be added later if a specific round needs richer illustration.
- Existing visual-spatial logic-house games remain in place for this pass; 图形工坊 must not duplicate them in parallel.
- The new world id is `graphic`, with user-facing name `图形工坊`.
- Voice assets may be regenerated after the wording changes if the curriculum audit reports manifest mismatch.
