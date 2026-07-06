# Quickstart: Same-Kind Logic Quality

## 1. Capture Baseline

```bash
pnpm audit:curriculum
```

Recorded before stricter same-kind checks:

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

## 2. Verify Red Audit

After adding same-kind audit checks and before rewriting content:

```bash
pnpm audit:curriculum
```

Expected:

- The command fails.
- Findings mention `logic-same-kind-detective` round context.
- Failures point to missing grouping-rule explanation, generic retry, or weak
  odd-one-out feedback.

## 3. Verify Green Audit

After rewriting `logic-same-kind-detective`:

```bash
pnpm audit:curriculum
```

Expected:

- `problemCount` is `0`.
- Same-kind rounds have no quality findings.

## 4. Export And Generate Voice

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

Expected:

- `public/audio/voice-lines.json` includes changed same-kind text.
- `public/audio/voice/manifest.json` includes all exported IDs.
- The generator reports 0 skipped lines.

## 5. Final Verification

```bash
pnpm build
pnpm audit:curriculum
```

Expected:

- Build completes.
- Curriculum audit reports `problemCount: 0`.
- Voice manifest and exported lines are synchronized.
