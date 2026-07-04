# Quickstart: Order-Plan Logic Quality

## Baseline

Run before adding new order-plan audit checks:

```bash
pnpm audit:curriculum
```

Observed current baseline before this slice:

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

## Red Audit

After adding order-plan checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Expected red result: command exits non-zero with targeted `logic-order-plan`
findings for rounds whose success, retry, or parent prompts do not consistently
name the filled sequence, answer, and ordered replay strategy.

Observed red result after adding the audit checks:

```json
{
  "math": 110,
  "logic": 316,
  "totalGames": 33,
  "totalRounds": 426,
  "mathTargetMet": true,
  "logicTargetMet": true,
  "problemCount": 67
}
```

## Content And Voice Validation

After rewriting `logic-order-plan` content:

```bash
pnpm audit:curriculum
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:curriculum
```

Expected outcome: the audit reports `problemCount: 0` after voice generation.

## Final Validation

Before checkpointing:

```bash
pnpm build
pnpm audit:curriculum
git diff --check
```

Expected outcome: all commands exit `0`.
