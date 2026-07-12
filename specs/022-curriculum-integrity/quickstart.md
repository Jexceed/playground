# Quickstart: Curriculum Integrity

## Focused checks

```bash
pnpm test:voice-assets
pnpm audit:curriculum
pnpm test:speech
```

Expected: all exit 0; curriculum audit reports 40 games, 489 rounds, zero problems.

## Refresh narration

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm prune:voice-assets -- --write
```

Expected: export count equals manifest request count, failures are empty, and a
second pruning dry run reports zero orphans.

## Build and release

```bash
pnpm build
pnpm release:nas
pnpm mac:install
```

Expected: static build, NAS package, signed Mac app, and installation succeed.

## Manual checks

- Traverse a three-choice game and a four-choice graphic game through a full
  position cycle; graphic drawings must match A/B/C/D.
- A clock round must say hour hand first, minute hand second.
- A spilled-water round must ask where to seek evidence, not who is nearest.
- Relaunch and compare brand sound with curriculum narrator family.

## Verification Record: 2026-07-12

- Curriculum: 40 games, 489 rounds, 0 audit problems.
- Correct answer positions across all rounds: 163 / 157 / 152 / 17. The fourth
  position applies only to four-choice rounds; every game/choice-count bucket
  has max-minus-min <= 1.
- Voice: 1,801 exported lines, 1,801 requested manifest entries, 1,801 generated
  files, 0 failures, Edge `zh-CN-XiaoxiaoNeural` at `-12%` and `+2Hz`.
- Pruning: 830 unreferenced files removed; second dry run found 0.
- Tests: 3 voice-pruning, 4 speech-navigation, and 2 release tests passed.
- Browser production preview confirmed hour-hand-first wording and the first
  three clock answers in positions 1, 2, and 3; graphic round 2 rendered its
  rabbit answer at B with the drawing and label aligned.
- `pnpm build`, `pnpm release:nas`, `pnpm mac:install`, app launch, and installed
  app signature verification succeeded.
