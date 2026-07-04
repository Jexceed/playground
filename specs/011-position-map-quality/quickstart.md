# Quickstart: Position-Map Logic Quality

## Baseline

Run before adding new position-map audit checks:

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

After adding position-map checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Expected red result: command exits non-zero with targeted
`logic-position-map` findings for rounds whose success, retry, or parent prompts
do not consistently name the target/source, direction, one-cell move, answer, or
inside/outside contrast.

Observed red result after adding the audit checks:

```json
{
  "math": 110,
  "logic": 316,
  "totalGames": 33,
  "totalRounds": 426,
  "mathTargetMet": true,
  "logicTargetMet": true,
  "problemCount": 36
}
```

## Content And Voice Validation

After rewriting `logic-position-map` content:

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
