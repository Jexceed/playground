# Quickstart: Pattern Visual And Voice Quality

## 1. Baseline

```bash
pnpm audit:curriculum
pnpm audit:voice-media
```

The pre-fix curriculum audit may pass because it does not yet enforce local
pattern assets or inspect MP3 duration. The initial voice scan should identify
six implausibly short sentence files.

## 2. Targeted Tests

```bash
pnpm test:voice-assets
pnpm test:speech
```

Expected: MP3 frame parsing, duration thresholds, invalid-cache regeneration,
speech cancellation, and orphan handling all pass.

## 3. Pattern Asset Review

Run the app and inspect all 18 找规律火车 rounds:

```bash
pnpm dev
```

Review at desktop and 375px widths:

- all non-missing cards are coherent local PNGs;
- sequence and choice instances of a token match;
- large/medium/small circles remain immediately distinguishable;
- no asset is cropped, stretched, blank, or replaced by emoji/SVG fallback.

## 4. Voice Export And Repair

When content text is unchanged, the validated generator should retain good
files and regenerate only failing media:

```bash
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:voice-media
pnpm prune:voice-assets
```

When wording changes, run `pnpm export:voice-lines` first.

Expected: 1,801 exported/requested/manifested/present files, zero failures, zero
voice-media findings, and zero orphans unless the export count legitimately
changes.

## 5. Required Project Verification

```bash
pnpm audit:curriculum
pnpm build
pnpm release:nas
pnpm mac:install
git diff --check
```

Open the production preview for representative browser validation, then launch
`/Applications/小小思考屋.app` and confirm local picture and voice playback from
the installed bundle.

## 6. Final Evidence

Completed on 2026-07-18:

- Browser production preview covered all 18 pattern rounds. Every stem and all
  three choices used registered 256x256 local PNGs with no broken image,
  emoji, or inline-SVG answer fallback.
- Desktop and 375x812 mobile review confirmed the 196/124/64 large, medium, and
  small circle hierarchy remained distinct without layout overlap.
- The media audit checked all 1,801 manifested voice files with zero findings,
  zero manifest failures, and zero orphan files. The six rejected short files
  were regenerated with Edge `zh-CN-XiaoxiaoNeural`, rate `-12%`, and pitch
  `+2Hz`.
- `pnpm test:voice-assets` passed 10 tests, `pnpm test:speech` passed 4 tests,
  `pnpm audit:curriculum` reported zero findings across 489 rounds, and
  `pnpm build` plus `git diff --check` completed successfully.
- `pnpm release:nas` produced `release/nas-static` and
  `release/thinking-island-nas-static-0.1.0.zip`.
- `pnpm mac:install` installed `/Applications/小小思考屋.app`; strict deep
  code-sign verification passed, and a cold launch started the installed
  `Contents/MacOS/thinking-island` executable successfully.
