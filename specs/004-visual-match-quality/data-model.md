# Data Model: Visual-Match Logic Quality

## Visual-Match Round

Represents one `logic-visual-match` task.

**Fields**:

- `prompt`: Child-facing question. Must identify exact match or odd-card task.
- `instruction`: Comparison strategy. Must reference all parts/order or matching
  pair first.
- `visualGroups`: Visible card groups. Exact-match rounds use one sample group;
  odd-card rounds use one three-card group.
- `choices`: Selectable answers. Exact-match rounds use card values; odd-card
  rounds use position values.
- `answer`: Correct choice value.
- `success`: Feedback that names the visible match or difference.
- `retry`: Guidance that points back to left-to-right comparison or matching
  pair search.
- `parentPrompt`: Parent follow-up that asks the child to explain why.
- `abilityTags`: Reasoning tags such as detail observation, order comparison, or
  elimination.

## Exact-Match Case

An exact-match round where the child compares answer cards with one sample card.

**Validation rules**:

- One `visualGroups[0]` label must name the sample card.
- `visualGroups[0].items` must contain exactly one sample card.
- `choices` must contain three distinct card values.
- Exactly one choice value must equal `answer`, and `answer` must equal the
  sample card.
- At least one distractor should share visible material with the sample while
  differing in order or one feature.
- Success and retry text must explain all-parts matching, left-to-right order, or
  concrete feature comparison.

## Odd-Card Case

A round where the child identifies one card that differs from the other two.

**Validation rules**:

- `visualGroups[0]` must contain exactly three cards.
- Exactly two card strings must be identical; the remaining position must match
  the answer.
- Choices must be the three positions: left, middle, and right.
- Success text must name the answer position, the matching pair, and the visible
  difference.
- Retry and parent prompt must tell the child to find the matching pair first.

## Comparison Rule

The child-visible basis for comparing cards.

**Allowed rule examples**:

- Same left-to-right order.
- Same first item and second item.
- Same color and shape.
- Same object sequence.
- One card has a changed item.
- One card has reversed or swapped order.

## Rewrite Targets From Current Content

- Exact-match rounds currently have useful card structures, but success and
  parent prompts are generic and do not consistently name the chosen card or the
  close distractor.
- Odd-card rounds currently identify the different position, but success text
  often does not name the matching pair first.
- Retry text is broadly useful but should become more explicit about matching
  pair search and all-parts comparison.
- No new `VisualToken` mappings are expected for this slice because current card
  tokens are already known to the audit.
