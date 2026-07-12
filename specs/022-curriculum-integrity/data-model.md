# Data Model: Curriculum Integrity

## ChoiceBucket

- `gameId: string`
- `choiceCount: number`
- `roundOrdinal: number`
- `targetAnswerIndex = roundOrdinal % choiceCount`

Position counts across `0..choiceCount-1` must differ by no more than one.

## BalancedRound

- Existing `GameRound` fields
- Reordered `choices` with unchanged values and labels
- Reordered `graphicChallenge.options` when present

The answer value and distractor relative order remain unchanged. Graphic choice
values equal graphic option values in the same order and labels are A/B/C/D.

## VoiceReferenceSet

- References from `manifest.entries[].src` and `segmentEntries[].srcs[]`
- Candidate files below `public/audio/voice/zh-CN/`
- Orphans equal candidates minus references

Dry run reports orphans. Write mode deletes only orphans inside the locale root.

## IntegrityFinding

- `context`: game/round or asset path
- `category`: position, graphic, wording, evidence, clock, or voice
- `message`: actionable failure reason

