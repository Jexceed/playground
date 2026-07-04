# Data Model: Order-Plan Logic Quality

## Order-Plan Round

Represents one `logic-order-plan` round in `src/data/games.ts`.

Fields:

- `prompt`: Child-facing question about the missing or next step.
- `instruction`: Guidance before answering.
- `sequence`: Ordered visible cards, containing exactly one `?`.
- `choices`: Candidate missing steps, with unique labels and values.
- `answer`: Correct choice value.
- `success`: Feedback after a correct answer.
- `retry`: Guidance after an incorrect answer.
- `parentPrompt`: Parent co-play prompt that asks the child to explain.

Validation rules:

- `sequence` must be non-empty and contain exactly one `?`.
- `choices` must include `answer` exactly once.
- Filled sequence is `sequence` with `?` replaced by the answer choice label.
- Success, retry, and parent prompt must name the filled sequence and answer.

## Filled Sequence

Represents the child-facing replay of the plan after the missing step is filled.

Validation rules:

- Shorthand tokens such as `🔴`, `🟢`, `🧒`, `🌱`, and `🏁` must be normalized to
  child-facing labels before audit wording checks.
- Filled sequence text should support left-to-right replay using words such as
  "先", "然后", "再", or "最后".

## Order-Plan Finding

Represents an audit problem produced by `scripts/audit-curriculum.mjs`.

Fields:

- `context`: Game id and round id, such as
  `logic-order-plan/logic-order-plan-4`.
- `message`: Specific failed quality rule.

Validation rules:

- Findings must identify the round and failed surface.
- Findings must be actionable enough to fix content without guessing.
