# Data Model: Logic House Quality

## Logic-House Round

Represents one child-facing question in a logic-house game.

Fields:

- `id`: stable generated or explicit round identifier.
- `prompt`: parent/child-facing question.
- `instruction`: short action guidance for the child.
- `visual surface`: one or more of scene image, sequence, visual groups, grid,
  matrix, or memory cards.
- `choices`: selectable answer choices.
- `answer`: value matching one choice.
- `success`: explanation after the correct answer.
- `retry`: supportive guidance after a wrong answer.
- `parentPrompt`: follow-up prompt for parent-child reasoning.
- `difficultyNote`: explanation of the reasoning load.
- `abilityTags`: learning skills covered by the round.

Validation rules:

- Must have at least one visual surface.
- Prompt, instruction, choices, feedback, parent prompt, and visual surface must
  describe the same task.
- Choices must have unique labels, unique values, and different meanings.
- Wrong choices must be plausible child mistakes or weaker strategies.
- Feedback must explain the relevant clue, rule, category, order, or plan.

## Answer Choice

Represents one selectable option in a round.

Fields:

- `label`: child-facing visible text.
- `value`: answer token stored by the game.
- `meaning`: normalized review meaning inferred from label and context.

Validation rules:

- `label` and `value` must be unique within the round.
- `meaning` must not duplicate another choice's meaning.
- Label must avoid double negatives, vague filler, shameful wording, and
  irrelevant noise.
- If a choice is intentionally close to the answer, the retry or parent prompt
  should make the distinction explainable.

## Visual Surface

Represents the evidence the child can see.

Fields:

- `kind`: scene, sequence, visual group, grid, matrix, or memory.
- `items`: visible cards, symbols, words, or registered scene image.
- `supporting task`: the prompt and choices the surface is meant to support.

Validation rules:

- Scene images must come from the registered scene gallery.
- Visual cards must be concrete enough for preschool reasoning or covered by a
  known visual mapping.
- Text-only visual items are allowed only when they are clear rule labels,
  position labels, or review-approved evidence phrases.

## Quality Finding

Represents one audit problem that blocks completion.

Fields:

- `gameId`: game containing the issue.
- `roundId`: round containing the issue, or a broader game-level id.
- `code`: stable category such as duplicate choice, weak wording, missing
  visual support, or voice mismatch.
- `message`: human-readable reason.

Validation rules:

- Must be specific enough to locate and rewrite the problem.
- Must distinguish blocking failures from advisory follow-up notes.

## Voice Line

Represents a local-audio source entry derived from changed text.

Fields:

- `id`: stable voice-line identifier.
- `text`: spoken text.
- `manifest entry`: generated file reference and status.

Validation rules:

- Exported source must include changed prompts, instructions, choices, success,
  retry, and parent prompts.
- Manifest validation must show no missing, extra, duplicate, or failed entries.

## First Content Cluster Review: `logic-sorter-switch`

Current strengths:

- Compact set of 11 classification rounds.
- Uses existing concrete symbol cards, so no new scene image is required.
- Covers color, shape, rule switching, and two-condition filtering.

Rewrite targets:

- Prompts and instructions repeat "分类机" wording but do not always make the
  child say the active rule before selecting.
- Success and retry feedback are correct but often restate the answer instead
  of naming the visible feature that made the choice work.
- Generic parent prompts do not always invite a specific "why" explanation for
  the current rule, old-rule mistake, or one-condition-only mistake.
- Two-condition rounds should make each distractor's mistake explicit: one card
  matches only color, one matches only shape, and the answer matches both.
- Audit coverage should check choice labels as well as prompt, instruction,
  feedback, and parent prompt text.
