# Contract: Order-Plan Audit Report

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

## Order-Plan Finding Shape

When order-plan quality fails, `problems` entries must include the game and
round context:

```text
logic-order-plan/logic-order-plan-1: order-plan success should name filled sequence and answer
```

## Required Finding Categories

- Missing or empty sequence.
- Sequence missing `?` or containing multiple `?` slots.
- Answer choice missing or duplicated.
- Success not naming the filled sequence and answer.
- Retry not naming the filled sequence, answer, and ordered replay strategy.
- Parent prompt not naming the filled sequence and answer or failing to ask for
  explanation.
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
