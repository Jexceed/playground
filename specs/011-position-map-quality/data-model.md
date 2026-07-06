# Data Model: Position-Map Logic Quality

## Position-Map Round

Represents one `logic-position-map` task.

**Fields**:

- `prompt`: Child-facing question. Must name either a target and direction, an
  inside/outside group, or a source-target viewpoint.
- `instruction`: Strategy text. Must ask the child to start from the relevant
  visual item or group.
- `grid`: Visible direction surface for neighbor and relative rounds.
- `visualGroups`: Visible inside/outside groups for containment rounds.
- `choices`: Selectable item names or direction names.
- `answer`: Correct neighbor item, containment item, or relative direction.
- `success`: Feedback that names the visible evidence and answer.
- `retry`: Guidance that returns the child to pointing at the visual surface.
- `parentPrompt`: Parent follow-up that asks the child to point and explain.
- `abilityTags`: Reasoning tags such as left/right, up/down, inside/outside,
  relative position, or two-dimensional location.

## Neighbor Direction Round

A grid round asking what is left, right, above, or below a target.

**Validation rules**:

- `grid.cells` must be rectangular and contain the target exactly once.
- The named direction must stay inside the grid.
- The computed neighbor item must equal `answer`.
- Choices must include the answer exactly once and have distinct labels/values.
- Success, retry, and parent prompts must name target, direction, one-cell
  movement, and answer.

## Inside/Outside Round

A visual-group round asking who is inside or outside the box.

**Validation rules**:

- Visual groups must include "盒子里面" and "盒子外面".
- The answer must appear in the requested group.
- Choices must include the answer exactly once and have distinct labels/values.
- Success, retry, and parent prompts must name answer, requested group, and the
  contrast group.

## Relative Direction Round

A grid round asking where a target is from a source item's viewpoint.

**Validation rules**:

- The source and target items must each appear exactly once in the grid.
- The computed direction from source to target must equal `answer`.
- Choices must include the answer exactly once and have distinct labels/values.
- Success, retry, and parent prompts must name source, target, answer, and the
  instruction to start from the source.

## Rewrite Targets From Current Content

- Direct neighbor success feedback often names the relationship but not the
  "start at target, move one cell" action.
- Retry and parent prompts are inconsistent: some name the target and direction,
  while others ask broad conceptual questions without a pointable path.
- Inside/outside success feedback names only the selected item and group, but
  does not contrast inside with outside.
- Relative direction parent prompts are useful conceptually but should also name
  source, target, and answer so the child can point and explain.
