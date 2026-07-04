# Quickstart: Logic House Quality

Use this guide to validate the feature after implementation.

## Baseline Before Implementation

Recorded on 2026-07-04 before enabling stricter logic-house checks:

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

## 1. Inspect Changed Logic-House Rounds

Review every changed round in `src/data/games.ts` and confirm:

- The prompt, visual surface, choices, answer, success, retry, and parent prompt
  point to the same concrete task.
- Each wrong option is a plausible child mistake or weaker strategy.
- No option repeats another option's label, value, or meaning.
- The difficulty note matches the visible surface and reasoning load.
- Feedback explains the clue, rule, category, order, or plan.

## 2. Export Voice Lines After Text Changes

```bash
pnpm export:voice-lines
```

Expected result:

- `public/audio/voice-lines.json` includes changed prompts, instructions,
  choices, feedback, and parent prompts.
- There are no duplicate voice-line IDs.

## 3. Regenerate Or Validate Local Voice

Preferred local generation command:

```bash
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

If local voice generation cannot run in the current environment, record the
exact blocker in `docs/TODO.md` and keep `public/audio/voice-lines.json`
exported for later generation.

## 4. Run Curriculum Audit

```bash
pnpm audit:curriculum
```

Expected result:

- `problemCount` is `0`.
- No logic-house quality finding is present.
- Voice-line source and manifest validation pass, or an explicit recorded
  generation blocker explains why audio generation is deferred.

## 5. Run Build

```bash
pnpm build
```

Expected result:

- Type checking and production build complete successfully.

## 6. Review Documentation

Confirm:

- `docs/build-generation-guide.md` records the stricter logic-house quality
  rules.
- `docs/CHANGELOG.md` records the completed quality gate and content changes.
- `docs/TODO.md` records remaining logic-house clusters or any deferred voice
  generation work.
