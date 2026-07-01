# Audio assets

Put generated or recorded voice files in:

```text
public/audio/voice/
```

Recommended structure:

```text
public/audio/voice/zh-CN/female-warm/
  number-sense-1-count-1-prompt.mp3
  number-sense-1-count-1-success.mp3
```

Short UI sounds can go in:

```text
public/audio/sfx/
```

The app plays recorded/generated files first by reading:

```text
public/audio/voice/manifest.json
```

If a matching file is not configured yet, it falls back to browser speech synthesis so the prototype still has voice.

Current voice coverage:

- Question speaker button reads the prompt and instruction.
- Each visual object card reads the object name.
- Each answer option reads the option label when tapped.
- Correct feedback is read aloud.
- Wrong-answer feedback is read aloud, then the child can try again.

Current generated voice pack:

- Mandarin entries referenced in the current voice manifest.
- Supported providers: Edge TTS fixed voice pack, or local F5-TTS reference-voice pack.
- Current manifest has 0 skipped lines. The browser speech-synthesis fallback remains only as a safety net.
- Long local prompt lines are not played as one uninterrupted mp3. The app can use optional `segmentEntries` from the manifest; if no segment mp3 pack is available, long prompt lines fall back to the existing split-sentence browser speech path so a child does not have to listen to a 10+ second single clip.

For production, replace or expand this with recorded/generated files from a warmer human voice. The manifest format stays the same.

Run this to export the complete recording script:

```bash
pnpm export:voice-lines
```

It writes:

```text
public/audio/voice-lines.json
```

Run this to generate local macOS voice files:

```bash
pnpm generate:mac-voices -- --voice Tingting --rate 155 --limit 80
```

Run this to generate online neural Mandarin mp3 files:

```bash
python3 -m pip install --user --upgrade edge-tts
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --quiet --retries 8
```

`zh-CN-XiaoyiNeural` is more cartoon-like. `zh-CN-XiaoxiaoNeural` is clearer and more teacher-like:

```bash
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --quiet --retries 8
```

Run this to generate a local F5-TTS reference-voice pack. F5 needs an accurate transcript of the reference audio; do not guess it:

```bash
pnpm generate:f5-voices -- --ref-audio /path/to/ref.wav --ref-text "参考音频里实际说的话" --voice family-teacher --quiet
```

Run this to generate optional local mp3 segments for long prompt lines:

```bash
pnpm generate:voice-segments -- --threshold 34 --voice zh-CN-XiaoyiNeural --rate -10% --pitch +4Hz --quiet --retries 8 --python /path/to/python-with-edge-tts
```

This writes `segmentEntries` into `public/audio/voice/manifest.json`. The main 1495-entry manifest remains unchanged.

Use `--limit 80` only when generating a small audition pack. Useful alternatives on this Mac include:

```bash
pnpm generate:mac-voices -- --voice "Flo (中文（中国大陆）)" --rate 150 --limit 80
pnpm generate:mac-voices -- --voice "Sandy (中文（中国大陆）)" --rate 150 --limit 80
```

After generating audio, run:

```bash
pnpm audit:curriculum
```

The audit checks that every manifest entry points to an existing file.
