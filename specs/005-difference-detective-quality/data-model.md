# Data Model: Difference-Detective Logic Quality

## Difference Round

Represents one `logic-difference-detective` task.

**Fields**:

- `prompt`: Child-facing question. Must identify changed, extra, or missing
  item task.
- `instruction`: Comparison strategy. Must reference left-to-right comparison or
  matching shared items first.
- `visualGroups`: Two visible rows labeled left picture and right picture.
- `choices`: Selectable answers. Labels must be distinct and meaningful.
- `answer`: Correct item.
- `success`: Feedback that names the structural comparison.
- `retry`: Guidance that points back to ordered comparison or shared-item
  matching.
- `parentPrompt`: Parent follow-up that asks the child to explain why.
- `abilityTags`: Reasoning tags such as detail comparison, ordered observation,
  or elimination.

## Changed-Item Case

A round where the left and right rows have the same length and one position is
different.

**Validation rules**:

- The two rows must have the same length.
- Exactly one index must differ.
- The answer must equal the right-row item at that changed index.
- The old left-row item should remain a plausible distractor when useful.
- Success text must name the position, the old item, and the new item.
- Retry and parent prompt must support a full left/right comparison sentence.

## Extra-Item Case

A round where the right row contains everything in the left row plus one extra
item.

**Validation rules**:

- Right row length must be left row length plus one.
- Every left-row item must be matchable in the right row.
- The answer must be the one unmatched right-row item.
- Success text must name the shared items and the extra item.
- Retry and parent prompt must tell the child to match the left row first.

## Missing-Item Case

A round where the right row is missing one item from the left row.

**Validation rules**:

- Left row length must be right row length plus one.
- Every right-row item must be matchable in the left row.
- The answer must be the one unmatched left-row item.
- Success text must name the shared items and the missing item.
- Retry and parent prompt must tell the child to check each left-row item in the
  right row.

## Rewrite Targets From Current Content

- Changed-item success feedback often names the old and new items, but does not
  consistently name the changed position.
- Extra-item success feedback currently says only that the right picture has one
  extra item; it should first confirm the shared items.
- Missing-item success feedback currently says only that the right picture has
  one missing item; it should first confirm the shared items.
- Retry and parent prompts are directionally useful, but the audit should keep
  them tied to ordered comparison and shared-item matching.
