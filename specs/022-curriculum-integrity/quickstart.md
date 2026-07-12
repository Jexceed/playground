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

