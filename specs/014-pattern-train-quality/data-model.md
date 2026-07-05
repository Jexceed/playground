# Data Model: Pattern-Train Logic Quality

## Pattern-Train Round

Represents one generated `logic-pattern-train` round.

Fields:

- `sequence`: visible card sequence with exactly one `?` placeholder.
- `patternUnit`: ordered tokens that repeat to create the full pattern.
- `answer`: token expected at the missing position.
- `choices`: unique selectable options.
- `success`: feedback after a correct answer.
- `retry`: guidance after an incorrect answer.
- `parentPrompt`: adult follow-up prompt.

Validation rules:

- `sequence` contains exactly one `?`.
- `patternUnit` has at least two tokens.
- Repeating `patternUnit` to the sequence length produces `answer` at the
  missing index.
- `choices` includes `answer` exactly once.
- `choices` has at least three options.
- Choice labels and values are unique.
- Choice values come from the repeat unit or a documented close visual family.
- Success, retry, and parent prompts name the repeat unit or filled sequence and
  the answer using child-facing labels.

## Repeat Unit

The ordered cards that repeat.

Examples:

- `["🔴", "🔵"]` -> "红色圆片、蓝色圆片"
- `["☀️", "🌙", "⭐"]` -> "太阳、月亮、星星"
- `["🍓", "🍪", "🍓"]` -> "草莓、饼干、草莓"

Validation rules:

- Unit tokens should be renderable visual tokens.
- Unit labels should be concrete and pronounceable.
- A repeated unit with duplicate tokens is allowed when the pattern is
  intentional, such as "草莓、饼干、草莓"; choices must still stay unique.

## Filled Sequence

The visible sequence after replacing `?` with the answer token.

Validation rules:

- Filled sequence should be explainable from left to right.
- Wording should name enough cards to let a parent ask the child to replay the
  pattern.

## Pattern-Train Finding

An audit problem emitted by `scripts/audit-curriculum.mjs`.

Fields:

- `context`: game id and round id.
- `message`: concrete quality failure.

Expected findings before rewrite:

- Generic retry/parent prompts that do not name the current pattern.
- Choices that use unrelated global filler cards for non-color patterns.
- Feedback that does not name the filled sequence.
