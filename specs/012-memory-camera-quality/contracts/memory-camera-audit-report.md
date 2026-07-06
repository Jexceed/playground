# Contract: Memory-Camera Audit Report

The executable contract is `pnpm audit:curriculum`, which prints JSON and exits
non-zero when any curriculum quality rule fails.

## Expected Success Shape

```json
{
  "math": 110,
  "logic": 316,
  "totalGames": 33,
  "totalRounds": 426,
  "mathTargetMet": true,
  "logicTargetMet": true,
  "problemCount": 0,
  "problems": []
}
```

## Memory-Camera Finding Shape

When memory-camera quality fails, `problems` entries must include the game and
round context:

```text
logic-memory-camera/logic-memory-camera-1: memory-camera appeared success should name remembered cards and answer
```

## Required Finding Categories

- Missing or empty `memory.items`.
- Unsupported memory-camera prompt type.
- Appeared answer not present in remembered cards.
- Appeared choices missing the answer or lacking a not-shown distractor.
- Absent answer present in remembered cards.
- Absent non-answer choices not usable as remembered-card exclusions.
- Order prompt that cannot map to an item in the sequence.
- Order answer not equal to the requested ordinal item.
- Order choices containing unrelated distractors.
- Success, retry, or parent prompt not naming remembered cards and answer.
- Voice-line or manifest mismatch after text changes.

## Validation Commands

```bash
pnpm audit:curriculum
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:curriculum
pnpm build
git diff --check
```
