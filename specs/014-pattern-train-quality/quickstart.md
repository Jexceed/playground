# Quickstart: Pattern-Train Logic Quality

Run these commands from the repository root.

## Baseline

```bash
pnpm audit:curriculum
```

Expected before audit changes: the command may pass because pattern-train has no
targeted quality checks yet.

Observed 2026-07-05 before targeted pattern-train checks:

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

After adding pattern-train audit checks and before rewriting content:

```bash
pnpm audit:curriculum
```

Expected: non-zero exit with findings for `logic-pattern-train` weak choices or
generic feedback.

Observed 2026-07-05 after adding targeted audit and before content rewrite:

```json
{
  "math": 110,
  "logic": 316,
  "totalGames": 33,
  "totalRounds": 426,
  "mathTargetMet": true,
  "logicTargetMet": true,
  "problemCount": 18,
  "problems": [
    "logic-pattern-train/logic-pattern-train-1: pattern-train round should include a patternUnit"
  ]
}
```

## Voice Export And Generation

After changing text:

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

Expected: `public/audio/voice-lines.json` and
`public/audio/voice/manifest.json` include the changed lines with no failed
entries.

If Edge TTS cannot resolve `speech.platform.bing.com`, use the local macOS
fallback to fill only missing manifest entries:

```bash
pnpm generate:mac-voices -- --merge-existing --include-parent --limit 99999
```

Observed 2026-07-05:

- `pnpm export:voice-lines` exported 1661 unique voice lines.
- Edge TTS could not resolve `speech.platform.bing.com` in the local network
  environment.
- `pnpm generate:mac-voices -- --merge-existing --include-parent --limit 99999`
  wrote a mixed local manifest with 1661 entries: existing Edge entries plus
  36 macOS fallback entries.

## Final Verification

```bash
pnpm build
pnpm audit:curriculum
git diff --check
git status --short --branch --untracked-files=all
```

Expected:

- Build exits 0.
- Audit exits 0 with `"problemCount": 0`.
- Diff check prints no whitespace errors.
- Status contains only the intended staged or committed files.

Observed 2026-07-05:

- `pnpm build` exited 0.
- `pnpm audit:curriculum` exited 0 with `"problemCount": 0` across 426 rounds.
- `git diff --check` exited 0 with no output.
- `git status --short --branch --untracked-files=all` showed only the
  intended pattern-train, audit, docs, voice manifest, and generated macOS
  audio files before staging.
