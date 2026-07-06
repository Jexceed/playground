# Data Model: Address-Map Logic Quality

## Address-Map Round

Represents one `logic-address-map` task.

**Fields**:

- `prompt`: Child-facing question. Must either name an address to inspect or a
  target object whose address should be read.
- `instruction`: Strategy text. Must explain row-column lookup in child-facing
  language.
- `grid`: Visible address-map surface with row labels, column labels, and item
  cells.
- `choices`: Selectable visible items or address labels.
- `answer`: Correct item or address.
- `success`: Feedback that names the row-column reasoning.
- `retry`: Guidance that returns the child to the row-column lookup routine.
- `parentPrompt`: Parent follow-up that asks the child to point and explain the
  address.
- `abilityTags`: Reasoning tags such as two-dimensional location and position
  expression.

## Address-To-Object Round

A round where the child receives an address and selects the item in that cell.

**Validation rules**:

- `grid.rows`, `grid.columns`, and `grid.cells` must form a rectangular grid.
- The address must use an existing row label and existing column label.
- The crossing cell must equal `answer`.
- Choices must include the answer exactly once and have distinct labels/values.
- Success text must name the address, row, column, and object.
- Retry and parent prompt must ask the child to find the row first, then the
  column, and point to the crossing cell.

## Object-To-Address Round

A round where the child finds a target object and selects its row-column
address.

**Validation rules**:

- `grid.rows`, `grid.columns`, and `grid.cells` must form a rectangular grid.
- The target object must appear exactly once.
- The computed address from that position must equal `answer`.
- Choices must include the answer exactly once and have distinct labels/values.
- Success text must name the object, row, column, and address.
- Retry and parent prompt must ask the child to find the object, then read the
  row letter and column number.

## Rewrite Targets From Current Content

- Address-to-object success feedback names the address and answer but does not
  explicitly say the row and column routine.
- Address-to-object retry and parent prompts are generic and do not name the
  active row, column, answer, or crossing cell.
- Object-to-address success feedback names the object and address but does not
  explain the row and column that make the address.
- Object-to-address retry and parent prompts should preserve the target object
  and row-column explanation instead of staying generic.
