# Quickstart: Visual-Match Logic Quality

## Baseline

Run before adding new visual-match audit checks:

```bash
pnpm audit:curriculum
```

Expected current baseline before this slice:

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

After adding visual-match checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Observed red result after adding the audit checks: command exited non-zero with
8 targeted `logic-visual-match` findings. The findings reported two exact-match
rounds whose success feedback did not name the visible comparison clearly enough
and six odd-card rounds whose success feedback did not name the matching pair
before explaining the different card.

## Content And Voice Validation

After rewriting `logic-visual-match` content:

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
