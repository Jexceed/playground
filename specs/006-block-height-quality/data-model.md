# Data Model: Block-Height Logic Quality

## Block-Height Round

Represents one `logic-block-height-map` task.

**Fields**:

- `prompt`: Child-facing question. Must identify total count or compare task.
- `instruction`: Strategy text. Must explain that numbers are block heights or
  that left/right totals should be compared.
- `grid` or `visualGroups`: Visible height-map surface.
- `choices`: Selectable answers. Numeric total rounds use nearby numbers;
  compare rounds use explicit comparison labels.
- `answer`: Correct total or comparison label.
- `success`: Feedback that names row totals or left/right totals.
- `retry`: Guidance that points back to adding digits rather than counting
  cells.
- `parentPrompt`: Parent follow-up that asks the child to read rows and explain
  totals.
- `abilityTags`: Reasoning tags such as top view, stepwise addition, or
  comparison.

## Total-Count Case

A round where the child sums one height map.

**Validation rules**:

- `grid.cells` must contain only numeric strings.
- The answer must equal the sum of all grid cells.
- Choice values must contain the answer and distinct nearby numbers.
- Success text must mention row totals and the final total.
- Retry must remind the child to add digits, not count squares.
- Parent prompt must ask for row reading and row totals.

## Compare-Map Case

A round where the child compares two height maps.

**Validation rules**:

- `visualGroups` must contain left and right maps with numeric items.
- Left and right totals must determine the answer.
- Choices must include "左图更多", "右图更多", and "一样多".
- Success text must name both totals and the comparison result.
- Retry and parent prompt must ask for left total, right total, then comparison.

## Rewrite Targets From Current Content

- Total-count success feedback sometimes lists digits but does not consistently
  name row totals.
- Compare choices currently use terse position labels that do not say "more".
- Compare parent prompt asks for totals but can be more explicit about comparing
  after both totals are known.
- No new visual token mappings are expected for this slice because height-map
  cells are numeric strings.
