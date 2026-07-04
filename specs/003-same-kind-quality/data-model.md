# Data Model: Same-Kind Logic Quality

## Same-Kind Round

Represents a round where the child adds one item to a visible category.

Fields:

- `prompt`: asks which item belongs with the visible group.
- `visualGroups`: shows the category examples.
- `choices`: includes one correct category member and plausible distractors.
- `success`: names the rule and why the answer joins the group.
- `retry`: points back to the rule instead of giving a generic retry.
- `parentPrompt`: invites a concrete reason.

Validation rules:

- The group must have one clear child-readable rule.
- The answer must match the rule.
- Distractors must be related enough to be plausible but not accidentally valid.
- Feedback must name the rule.

## Odd-One-Out Round

Represents a round where the child finds the card that breaks the majority rule.

Fields:

- `visualGroups`: shows all cards being compared.
- `choices`: all visible cards or position-based options.
- `answer`: the card that does not match the majority group.
- `success`: names the three matching cards and the one that differs.
- `retry`: asks the child to find the majority rule first.
- `parentPrompt`: asks which cards go together and why the remaining card is out.

Validation rules:

- Three cards must share one concrete rule.
- The answer must break that rule.
- Feedback must name both the majority group and the answer's difference.

## Grouping Rule

Represents the reason cards belong together.

Examples:

- Fruit.
- Vehicle.
- School item.
- Land animal.
- Round shape.
- Edible item.
- Things that fly.

Validation rules:

- Must be familiar to a preschool child.
- Must be visible in cards or common life knowledge.
- Must not depend on obscure adult taxonomy.

## Same-Kind Finding

Represents an audit result for this slice.

Fields:

- `gameId`: expected to be `logic-same-kind-detective`.
- `roundId`: exact round identifier.
- `message`: blocked quality issue.

Validation rules:

- Must include game and round context.
- Must distinguish same-kind add-one problems from odd-one-out problems.

## Current Cluster Review

Current strengths:

- The cluster is compact: 6 add-one category rounds and 6 odd-one-out rounds.
- Most cards already resolve through existing `VisualToken` mappings.
- Categories are generally preschool-familiar: fruit, transport, school items,
  animals, round things, edible things, and things that fly.

Rewrite and audit targets:

- Add-one retries are generic and do not name the category rule.
- Add-one parent prompts are generic and do not always point to the specific
  rule for the current round.
- Odd-one-out success feedback names the different card but not the three-card
  majority group.
- Odd-one-out retries are generic and should tell the child to find the three
  cards that go together first.
- The choice label `盘子` has no phrase-level visual token mapping, so its choice
  cue can become text-only even though a plate token already exists.
