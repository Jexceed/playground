# Quickstart: Clock-Time Reading

## 1. Run the red audit after adding clock checks

```bash
pnpm audit:curriculum
```

Expected red result before implementation: the audit reports that
`math-clock-time` is missing or has no valid clock rounds.

## 2. Verify the clock game in the app

```bash
pnpm dev
```

Open the app, select 数字岛, and open 时钟小管家.

Expected:

- The game appears in 数字岛, not 图形工坊.
- Early rounds show analog clock faces for whole hours.
- Middle rounds show half-hour faces with the short hand between hour marks.
- Later rounds include generated activity scenes and `HH:MM` electronic clock
  choices.
- Answer choices are child-readable and do not reveal through unrelated clues.
- Success/retry/parent text asks the child to explain hand evidence or
  scene-based 24-hour conversion evidence.

## 3. Export and generate local voice

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

Expected: `public/audio/voice-lines.json` and
`public/audio/voice/manifest.json` stay synchronized, with no `failures`.

## 4. Run final verification

```bash
pnpm audit:curriculum
pnpm build
git diff --check
pnpm mac:install
```

Expected:

- Curriculum audit reports zero problems.
- Build exits successfully.
- Whitespace check reports no errors.
- `/Applications/小小思考屋.app` is updated, or the failure reason is recorded
  in the final report.
