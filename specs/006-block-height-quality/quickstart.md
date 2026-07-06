# Quickstart: Block-Height Logic Quality

## Baseline

Run before adding new block-height audit checks:

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

After adding block-height checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Observed red result after adding the audit checks: command exited non-zero with
21 targeted `logic-block-height-map` findings. The findings reported total-count
rounds whose success feedback did not consistently name row totals, plus compare
rounds whose choices, answers, feedback, retry, or parent prompts were too terse
about left/right totals.

## Content And Voice Validation

After rewriting `logic-block-height-map` content:

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
