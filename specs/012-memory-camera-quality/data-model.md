# Data Model: Memory-Camera Logic Quality

## Memory-Camera Round

Represents one `logic-memory-camera` round in `src/data/games.ts`.

Fields:

- `prompt`: Determines appeared, absent, or order round type.
- `instruction`: Child-facing guidance before answering.
- `memory.items`: Ordered list of visible camera cards.
- `choices`: Candidate answers, with unique labels, values, and meanings.
- `answer`: Correct choice value.
- `success`: Feedback after a correct answer.
- `retry`: Guidance after an incorrect answer.
- `parentPrompt`: Parent co-play prompt that asks the child to explain.

Validation rules:

- `memory.items` must be non-empty.
- All memory items must map to known visual tokens or accepted local visual
  phrases.
- Choices must stay unique by label, value, and normalized meaning.
- Success, retry, and parent prompt must point back to the remembered cards.

## Appeared-Item Round

Recognized by prompt `刚才相机里出现过谁？`.

Validation rules:

- `answer` must match one remembered card after label normalization.
- Choices must include `answer` exactly once.
- At least one distractor should not be in the remembered set.
- Success, retry, and parent prompt must name the remembered set and answer.

## Absent-Item Round

Recognized by prompt `哪一个刚才没有出现？`.

Validation rules:

- `answer` must not match any remembered card after label normalization.
- Choices must include `answer` exactly once.
- Non-answer choices should be remembered cards so the child can use exclusion.
- Success, retry, and parent prompt must name the remembered set and absent
  answer.

## Order Round

Recognized by prompts `刚才第一个是什么？`, `刚才第二个是什么？`,
`刚才第三个是什么？`, and `刚才最后一个是什么？`.

Validation rules:

- The requested ordinal must map to an existing memory item.
- `answer` must equal that item after label normalization.
- Choices must include `answer` exactly once.
- Choices should all be remembered cards.
- Success, retry, and parent prompt must name the left-to-right sequence,
  ordinal, and answer.

## Memory-Camera Finding

Represents an audit problem produced by `scripts/audit-curriculum.mjs`.

Fields:

- `context`: Game id and round id, such as
  `logic-memory-camera/logic-memory-camera-9`.
- `message`: Specific failed quality rule.

Validation rules:

- Findings must identify the round type or validation surface.
- Findings must be actionable enough to fix content without guessing.
