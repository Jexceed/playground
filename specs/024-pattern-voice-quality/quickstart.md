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
