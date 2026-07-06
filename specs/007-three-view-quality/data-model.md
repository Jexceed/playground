# Data Model: Three-View Block Logic Quality

## Three-View Round

Represents one `logic-three-view-blocks` task.

**Fields**:

- `prompt`: Child-facing question. Must identify top, front, or left view.
- `instruction`: Strategy text. Must explain whether to count positions, read
  columns, or read rows.
- `grid`: Visible numeric block surface.
- `choices`: Selectable answers. Top-view rounds use nearby counts; side-view
  rounds use short height sequences.
- `answer`: Correct count or height sequence.
- `success`: Feedback that names the active view and visible strategy.
- `retry`: Guidance that points back to the active view after a wrong answer.
- `parentPrompt`: Parent follow-up that asks the child to explain the view and
  visible heights.
- `abilityTags`: Reasoning tags such as top view, front view, left view,
  viewpoint conversion, or maximum-height judgment.

## Top-View Case

A round where the child counts block positions from above.

**Validation rules**:

- `grid.cells` must contain only numeric strings.
- The answer must equal the number of cells greater than `0`.
- Choice values must contain the answer and distinct nearby numbers.
- Success text must mention top view, positions with blocks, and the final
  count.
- Retry and parent prompt must point to non-zero cells and explain `0` as empty.

## Front-View Case

A round where the child reads visible heights from the front.

**Validation rules**:

- `grid.cells` must contain only numeric strings.
- The answer must equal column maximums read left-to-right.
- Choices must contain the correct sequence and distinct plausible distractors.
- Success text must mention front view, columns, highest stacks, and the final
  answer.
- Retry and parent prompt must ask the child to read columns, not add numbers.

## Left-View Case

A round where the child reads visible heights from the left.

**Validation rules**:

- `grid.cells` must contain only numeric strings.
- The answer must equal row maximums read top-to-bottom.
- Choices must contain the correct sequence and distinct plausible distractors.
- Success text must mention left view, rows, highest stacks, and the final
  answer.
- Retry and parent prompt must ask the child to read rows from the left, not add
  numbers.

## Rewrite Targets From Current Content

- Top-view rounds are structurally valid but need stronger `0`/non-zero
  language in parent guidance.
- Front-view and left-view success feedback names maximums but not always the
  final choice sequence.
- Retry guidance should explicitly name the active viewpoint so the child does
  not reuse the wrong view strategy.
- Parent prompts should ask for view direction and hidden/covered stack
  explanations, not only "highest is how many".
