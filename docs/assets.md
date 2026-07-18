# Asset Registry And Taxonomy

This project uses local, auditable assets for the child-facing experience. Asset
paths are part of the product contract: move them only with code, docs, and audit
updates in the same change.

## Image Directories

- `public/images/brand/`: brand marks and app icons.
- `public/images/characters/`: reusable character portraits.
- `public/images/items/`: non-character objects, actions, tools, materials, and small visual tokens.
- `public/images/items/pattern-train/`: image-gen-derived transparent cards used
  by 找规律火车 in both the sequence and answer choices.
- `public/images/items/graphic-workshop/`: image-gen generated transparent
  sticker assets used by 图形工坊 `graphicChallenge` figures.
- `public/images/scenes/`: full scene images that carry question clues.

Generated or source images belong in a `source/` child directory under the same
category. For example, a generated scene source belongs in
`public/images/scenes/source/`.

## Runtime Registration

All image assets used by application data must be registered in
`src/data/imageGallery.ts`.

- `imageGallery.scenes`: full question scenes, always 1200x675 PNG.
- `imageGallery.characters`: character portraits such as cat, dog, rabbit, and bear.
- `imageGallery.items`: non-character visual tokens and action cards.

`sceneImage.src` in game data must use `imageGallery.scenes`. Small visual tokens
should resolve through `src/components/VisualToken.tsx` and the registered
gallery entry.

## Naming

- Use lowercase kebab-case filenames.
- Keep semantic names stable once referenced by game data.
- Do not encode transient generation details in runtime filenames.
- Keep source filenames aligned with their runtime asset:
  `bridge-wide-river.png` and `source/bridge-wide-river-source.png`.

## Audio Assets

- Brand sounds live under `public/audio/brand/`; they are one-off product
  sounds and should be played directly, not through the curriculum voice
  manifest.
- Voice scripts are exported to `public/audio/voice-lines.json`.
- The active local voice pack is described by `public/audio/voice/manifest.json`.
- Generated voice files live under `public/audio/voice/<locale>/<voice-id>/`.
- Browser TTS is only a fallback when a local voice file is missing.
- The release manifest uses only Edge `zh-CN-XiaoxiaoNeural`; macOS or mixed
  manifests are temporary recovery states and must be replaced before release.
- A manifest entry is not valid merely because its file exists. Every active MP3
  must contain complete decodable frames and pass the text-aware duration check
  in `pnpm audit:voice-media`.
- The launch brand sound is generated separately and its active Xiaoxiao source
  is documented under `references/audio/launch-brand-shout/`.

After changing any prompt, instruction, choice, feedback, or parent prompt, run:

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:voice-media
pnpm prune:voice-assets -- --write
```

Run `pnpm prune:voice-assets` without `--write` to preview stale generated files.
Pruning only operates below `public/audio/voice/zh-CN/` and preserves every
manifest entry and segment entry.

## Required Checks

Run these before reporting a feature complete when assets or content changed:

```bash
pnpm build
pnpm audit:curriculum
```

The audits must confirm registered images exist, pattern cards retain their
image-gen source, scene images are 1200x675, voice manifest entries match
exported voice lines, every MP3 is structurally complete and plausibly long
enough for its text, the provider/voice match the release standard, no failures
are present, and no unreferenced runtime voice files remain.
