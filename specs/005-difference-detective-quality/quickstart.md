# Quickstart: Difference-Detective Logic Quality

## Baseline

Run before adding new difference-detective audit checks:

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

After adding difference-detective checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Observed red result after adding the audit checks: command exited non-zero with
10 targeted `logic-difference-detective` findings. The findings reported
changed-item feedback that did not consistently name the changed position,
extra-item feedback that did not confirm shared items first, and missing-item
feedback that did not confirm shared items first.

## Content And Voice Validation

After rewriting `logic-difference-detective` content:

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
