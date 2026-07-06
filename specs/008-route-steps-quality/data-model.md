# Data Model: Route-Step Logic Quality

## Route-Step Round

Represents one `logic-route-steps` task.

**Fields**:

- `prompt`: Child-facing question. Must identify start item and one or two
  movement steps.
- `instruction`: Strategy text. Must explain whether to move one step or keep
  two steps in order.
- `grid`: Visible route surface.
- `choices`: Selectable destination names.
- `answer`: Correct destination after applying all moves.
- `success`: Feedback that names the route path.
- `retry`: Guidance that points back to the start and ordered movement.
- `parentPrompt`: Parent follow-up that asks the child to point and explain the
  route.
- `abilityTags`: Reasoning tags such as direction execution, route order, or
  working memory.

## One-Step Route

A round where the child starts at one grid item and moves one cell.

**Validation rules**:

- `grid.cells` must be rectangular and contain the start item exactly once.
- The movement phrase must be one of right, left, up, or down by one step.
- The computed destination must stay inside the grid and equal `answer`.
- Choices must include the answer exactly once and have distinct labels/values.
- Success text must name the start, direction, and destination.
- Retry and parent prompt must ask the child to point from the start and move
  exactly one cell.

## Two-Step Route

A round where the child performs two ordered one-cell moves.

**Validation rules**:

- `grid.cells` must be rectangular and contain the start item exactly once.
- Both movement phrases must be parseable and must stay inside the grid.
- The computed intermediate item and final destination must match the route.
- `answer` must equal the final destination.
- Choices must include the final destination exactly once and have distinct
  labels/values.
- Success text must name the start, intermediate item, second move, and final
  destination.
- Retry and parent prompt must ask for the first landing spot before the second
  move.

## Rewrite Targets From Current Content

- One-step success feedback sometimes names only relative position but not the
  active movement phrase.
- One-step parent prompts are generic and do not name start plus one-cell
  movement.
- Two-step success feedback names the route but can be more explicit about
  "first" and "second" landing spots.
- Two-step parent prompts already ask first/second but should preserve the
  visible item names and final destination.
