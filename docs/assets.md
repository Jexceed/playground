# Asset Registry And Taxonomy

This project uses local, auditable assets for the child-facing experience. Asset
paths are part of the product contract: move them only with code, docs, and audit
updates in the same change.

## Image Directories

- `public/images/brand/`: brand marks and app icons.
- `public/images/characters/`: reusable character portraits.
- `public/images/items/`: non-character objects, actions, tools, materials, and small visual tokens.
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

- Voice scripts are exported to `public/audio/voice-lines.json`.
- The active local voice pack is described by `public/audio/voice/manifest.json`.
- Generated voice files live under `public/audio/voice/<locale>/<voice-id>/`.
- Browser TTS is only a fallback when a local voice file is missing.

After changing any prompt, instruction, choice, feedback, or parent prompt, run:

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

## Required Checks

Run these before reporting a feature complete when assets or content changed:

```bash
pnpm build
pnpm audit:curriculum
```

The audit must confirm registered images exist, scene images are 1200x675, voice
manifest entries match exported voice lines, and no generated voice failures are
present.
