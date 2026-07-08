# Data Model: Graphic Workshop

## World

- `id`: stable world identifier. New value: `graphic`.
- `name`: user-facing world name. New value: `图形工坊`.
- `summary`: short child/parent-facing description.
- `questionCount`: derived from games assigned to the world.

## Graphic Workshop Game

- `id`: stable id with `graphic-` prefix.
- `world`: `graphic`.
- `title`, `subtitle`, `goal`, `parentPrompt`: child and parent-facing copy.
- `abilityTags`: concise ability labels such as `影子配对`, `遮挡还原`, `局部找整体`, `透明叠叠板`, `图形密码机`, `缺口补一补`, and `近似排除`.
- `rounds`: exactly 8 graphic-workshop rounds in the refined initial pass.

## Graphic Workshop Round

- `prompt`: child-facing question.
- `instruction`: actionable observation instruction.
- `graphicChallenge`: exactly one dedicated surface containing `kind`, `stemLabel`, stem `figures`, optional relation `groups`, and four drawn `options`.
- `choices`: exactly four A/B/C/D choices whose values map to drawn graphic options.
- `answer`: one choice value.
- `success`: names visible evidence and rule.
- `retry`: points to the child action that fixes the likely mistake.
- `parentPrompt`: asks a concrete "why/how did you see it" question.

## Graphic Challenge Option

- `value`: stable answer value.
- `label`: accessible spoken label for the drawn option.
- `figure` or `figures`: SVG-renderable single shape or composed figure set, with mode, color, position, scale, opacity, and optional covered/detail/missing-edge metadata.
- `nearMiss`: required for distractors; records the visual confusion dimension, such as long ear versus short ear or leaf versus plain round edge.

## Reinforcement Round

- Existing-world round added only when it introduces a distinct source-derived assessment point.
- Must pass the same duplicate signature, answer, choice, visual-surface, and feedback checks as other rounds.
