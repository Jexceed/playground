# Feature Specification: Visual Choice And Session Memory

**Feature Branch**: `dev`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "1. 一模一样在哪里的选项显示还有问题；2. 图形补一补中最好不要方框套方框；3. 整体加记忆功能，每次打开时回到上一次最后打开的题目，避免题目太多反复查找。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual-Match Choices Look Like Cards, Not Duplicated Labels (Priority: P1)

As a child answering "一模一样在哪里", I can compare answer choices as small
visual cards without seeing the same symbol sequence repeated as both a cue and
raw text.

**Why this priority**: Exact-match questions train visual comparison. The
answer button should present the card to compare, not add a second textual copy
that makes the option feel noisy.

**Independent Test**: Open representative exact-match and odd-card rounds. Exact
match choices show compact visual cards only; odd-card position choices remain
clear text labels with simple position cues.

**Acceptance Scenarios**:

1. **Given** a choice value is `🔴🟦`, **When** the answer buttons render,
   **Then** the button shows one compact visual-card cue and does not also print
   raw `🔴🟦` text.
2. **Given** an odd-card round uses "左边这张 / 中间这张 / 右边这张", **When** the
   options render, **Then** those readable position labels remain visible.
3. **Given** the child taps a compact visual-card choice, **When** audio plays,
   **Then** it speaks the child-facing card parts in order.

---

### User Story 2 - Matrix Puzzle Cells Are Flat Inside The Grid (Priority: P1)

As a child answering "图形补一补", I can scan the matrix as one table without
seeing a full card frame inside every matrix cell.

**Why this priority**: Matrix cells are already containers. Nesting a card frame
inside each cell makes the pattern harder to read and repeats the same visual
problem fixed for map grids.

**Independent Test**: Open representative matrix rounds and confirm non-missing
cells contain flat icon/label content, while the missing cell remains visually
distinct.

**Acceptance Scenarios**:

1. **Given** a matrix cell contains `🔴🔵`, **When** it renders, **Then** it uses
   a flat multi-icon token inside the matrix cell.
2. **Given** a matrix cell contains `?`, **When** it renders, **Then** the cell
   stays highlighted as the missing slot but does not become a nested card.
3. **Given** the layout is viewed on mobile, **When** the matrix narrows,
   **Then** icons and labels remain inside their cells without overlap.

---

### User Story 3 - The App Restores The Last Opened Place (Priority: P1)

As a returning parent, I can reopen the app and continue from the last world,
game, and round I had open, instead of searching through many questions again.

**Why this priority**: The project now has hundreds of rounds. Reopening at the
first math game wastes time and makes continued play harder.

**Independent Test**: Select a logic game and jump to a later round, reload the
browser, and verify the same world, game, and round are restored.

**Acceptance Scenarios**:

1. **Given** I select `逻辑屋 -> 图形补一补 -> 第 5 题`, **When** I reload the app,
   **Then** it opens `逻辑屋`, `图形补一补`, and 第 5 题.
2. **Given** I tap "下一题", **When** I reload the app, **Then** it opens the new
   current round.
3. **Given** saved data points to a game or round that no longer exists,
   **When** the app starts, **Then** it falls back to a valid first game and
   first round without crashing.

### Edge Cases

- Position-choice labels must not disappear in odd-card visual-match rounds.
- Compact visual-card choices must not duplicate text or overflow answer
  buttons.
- Matrix cells with multi-part values must remain clickable/speakable.
- Last-position storage must be independent from completion progress reset.
- Invalid or corrupted saved last-position data must be ignored safely.
- Restoring a round index must clamp to the selected game's available range.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Exact-match visual choices whose labels are visual card values MUST
  render as compact visual-card choices without duplicate raw label text.
- **FR-002**: Position choices in odd-card visual-match rounds MUST keep readable
  position text.
- **FR-003**: Compact visual-card choices MUST preserve click handling,
  selected/correct/wrong states, and child-facing speech labels.
- **FR-004**: Matrix cells MUST render flat content inside the grid instead of
  nesting full visual-card components.
- **FR-005**: Matrix missing cells MUST remain visually distinct and accessible.
- **FR-006**: The app MUST persist the last selected world, selected game, and
  requested round index in local storage.
- **FR-007**: The app MUST restore the saved last position on startup when the
  saved world, game, and round are valid.
- **FR-008**: The app MUST clamp or ignore invalid saved last-position data
  without crashing.
- **FR-009**: Audit checks MUST fail on duplicated visual-choice rendering,
  nested matrix-cell `VisualToken` rendering, and missing last-position storage
  functions before implementation.
- **FR-010**: Maintained docs MUST record the completed UI and session-memory
  work.
- **FR-011**: The feature MUST pass `pnpm build`, `pnpm audit:curriculum`, and
  whitespace checks before completion.

### Key Entities *(include if feature involves data)*

- **Visual Card Choice**: A visual-match exact answer option whose label/value
  is a token sequence such as `🔴🟦`.
- **Position Choice**: A visual-match odd-card answer option such as `左边这张`.
- **Flat Matrix Token**: Non-card icon/label content rendered inside a matrix
  cell.
- **Last Play Location**: `{ worldId, gameId, roundIndex }` saved to local
  storage.
- **Session-Memory Finding**: Audit result for missing or unsafe last-location
  persistence.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: No new image or audio assets are required; existing visual glyphs
  and speech labels are reused.
- **Docs**: Update `docs/CHANGELOG.md`, `docs/TODO.md`, and
  `docs/build-generation-guide.md` with visual-choice, matrix-cell, and
  last-position memory rules.
- **Audit Coverage**: Red/green `pnpm audit:curriculum`, `pnpm build`, browser
  reload persistence check, desktop/mobile visual checks, and `git diff --check`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of exact-match visual-card choices render without duplicated
  raw visual label text.
- **SC-002**: 100% of matrix cells render without nested `visual-token` cards.
- **SC-003**: Reloading after selecting a world, game, and round restores the
  same valid location.
- **SC-004**: The curriculum audit reports zero problems after the new checks
  and implementation.
- **SC-005**: Browser checks confirm no choice, matrix, or restored-position
  layout overflow on desktop and mobile representative views.

## Assumptions

- This feature changes visual rendering and navigation persistence only; it
  does not rewrite round prompts, answers, or audio source text.
- Last-position memory should survive progress resets because clearing ability
  tags is different from choosing where the app opens.
- Existing progress storage remains backward compatible.
