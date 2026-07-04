# Quickstart: Three-View Block Logic Quality

## Baseline

Run before adding new three-view audit checks:

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

After adding three-view checks but before rewriting content:

```bash
pnpm audit:curriculum
```

Observed red result after adding the audit checks: command exited non-zero with
42 targeted `logic-three-view-blocks` findings. The findings reported top-view
parent prompts that did not name empty positions, plus front-view and left-view
rounds whose success, retry, or parent prompts were too weak about active view,
maximum heights, final answer sequences, and hidden stacks.

An additional red pass after strengthening choice-format checks reported 6
targeted findings where three-column or three-row side-view rounds offered
two-height distractors instead of one height per visible column or row.

## Content And Voice Validation

After rewriting `logic-three-view-blocks` content:

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
