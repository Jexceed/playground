# Asset Registry And Taxonomy

This project uses local, auditable assets for the child-facing experience. Asset
paths are part of the product contract: move them only with code, docs, and audit
updates in the same change.

## Reference-Based Curriculum Expansion

The planned [029 curriculum expansion](../specs/029-curriculum-benchmark/plan.md)
uses the supplied local collection as design evidence. Original scans, teaching
videos, screenshots, embedded brand marks, and answer annotations are not
automatically runtime assets. Create clear original activity materials and
retain a source-rule-to-activity review record.

Answer-critical geometric relationships must be described deterministically
and independently checked. Produce registered local diagram assets from that
description where appropriate; inspect them at real display size. Random image
generation alone cannot validate adjacency, symmetry, occlusion, or cube views.
Interactive highlights, slots, and paths must agree with the same task model.

Current Chinese voice standards remain unchanged. Future English listening
activities require an explicit locale/voice contract and corresponding audit
coverage before release; Chinese completion must not count as English listening
evidence. This document records the planned boundary, not new active audio.

## Image Directories

- `public/images/brand/`: brand marks and app icons.
- `public/images/characters/`: reusable character portraits.
- `public/images/items/`: non-character objects, actions, tools, materials, and small visual tokens.
- `public/images/items/pattern-train/`: image-gen-derived transparent cards used
  by 找规律火车 in both the sequence and answer choices.
- `public/images/items/graphic-workshop/`: image-gen generated transparent
  sticker assets used by 图形工坊 `graphicChallenge` figures.
- `public/images/items/thinking-symbols/`: ten deterministic 320×320 PNG
  color/shape/blank cards for interactive activities. Their SVG sources live in
  `source/`; regenerate with `pnpm generate:thinking-symbols`. All are
  registered in `src/data/imageGallery.ts`.
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

## Douyin Math Island Runtime Snapshot

The Cocos Creator project does not read the React/TypeScript curriculum modules
at runtime. `pnpm export:douyin-math` creates a deterministic, math-only
snapshot below `doyingame/assets/resources/math-island/`:

- `data/catalog.json`: the 8 Math Island games and all 122 official rounds.
- `manifest.json`: source path, runtime path, byte size, SHA-256, and use
  contexts for every copied file.
- `images/`: only the brand, item tokens, and scene PNGs referenced by Math
  Island.
- `audio/`: only the standard Edge Xiaoxiao clips referenced by Math Island.

The Douyin snapshot keeps scene PNGs at 1200x675 and deterministically optimizes
their palette. Its copied voice clips are 32 kbps, 24 kHz mono MP3s; the source
Edge voice pack is not modified. Export and audit reject incomplete frames,
implausibly short speech, the wrong sample rate, and hash drift.

The generated `data/`, `images/`, `audio/`, and manifest are committed runtime
inputs, but must never be edited by hand. Their source of truth remains
`src/data/games.ts`, `src/data/worlds.ts`, registered images, and the active
voice manifest. Re-run the exporter after a source change and use
`pnpm audit:douyin-minigame` to reject missing files, changed hashes, `source/`
assets, non-math resources, an incorrect AppID, or runtime resources over the
declared 14 MB engineering budget.

## Exploration media

Deterministic diagram PNGs and source SVGs live in public/images/items/exploration/. Runtime references register through imageGallery.exploration; scripts/generate-exploration-media.mjs rebuilds them and removes only its own obsolete named outputs. Coordinates are canonicalized before hashing to prevent WebKit/V8 last-bit differences. Non-language WAV stimuli and their generator parameters live in public/audio/stimuli/. They are synthesized tones, not recordings of real instruments. Chinese voice remains Xiaoxiao; English cues use en-US-JennyNeural and per-entry locale/voice metadata.


## Exploration illustration atlases and readable diagrams (031 / 035 / 037)

- Runtime atlases live in `public/images/items/exploration-art/`, with original generated PNGs in its `source/` directory. Fifteen atlases provide 72 named frames, all referenced by 53 activities. Feature 035 connected the two previously unused planting-preparation frames; 037 adds six listening-story events, nine daily-use actions and thirteen preparation materials, preserving the original 44 frames.
- `src/data/explorationArt.ts` declares exact columns, rows and frame indices (2x2, 3x2 or 3x3); `imageGallery.items` registers every frame. Atlas dimensions must give square individual cells, not necessarily a square overall file. `GalleryImage.frame` is displayed by `ActivityImage` through a bounded viewport; it is not a runtime crop/download service. Text and captions stay in accessible HTML.
- Source prompts, the one germination-layout correction, hashes and the original 031 usage snapshot are in `specs/031-exploration-presentation/image-prompts.json` and `asset-manifest.json`. Generation used the built-in imagegen tool. Runtime paths in that manifest are the delivery paths.
- Feature 037's prompts, targeted background/ruler corrections, final source paths and hashes are in `specs/037-task-visual-completeness/image-prompts.json`, `generated-sources.json` and `asset-manifest.json`. Final files are opaque and visually checked before registration. Each frame has at least 400 source pixels per side.
- Generated diagrams retain their original SVG source dimensions and stable drawing IDs. `generate:exploration-media` renders used visual diagrams at 2x pixels; `GalleryImage.width/height` preserve intended layout dimensions. Numeric/word-only cards use HTML and do not require upscale for display.
- Illustrations must match roles, events and material properties. A cardboard box cannot represent a plastic container in a floating experiment, and a plastic toy brick cannot stand in for a wooden block. Unknown mathematical quantities remain unknown in the evidence data.

- Run `pnpm audit:illustrations` after changing illustration mappings. It generates [the app entry guide](illustration-guide.md) and [per-frame references](illustration-usage.json), rejecting unused registered frames, unregistered frame references and mismatched frame geometry. `audit:curriculum` also enforces the per-frame integration gate. File existence, active frame references and real-app appearance are separate checks.
- Bind multi-event procedural pictures by family/variant and stable event IDs. Matching a shared caption globally can silently mix two different stories, as the old planting aliases did. A changed event meaning requires a content revision; a matching-meaning artwork correction alone does not transfer or fabricate progress.

- Simple quantitative comparisons may use `visualComparison` panels so titles and legends retain readable HTML sizes instead of being rasterized inside a twice-shrunk composite image. Dots and tens/ones are exact code-native representations of the existing operands; image panels still use registered local PNGs and participate in asset preloading and 2x generation. These panels must not print an unknown result or change question/progress semantics.

- Illustrated candidate captions sit outside the picture border and share the picture's accessible selection target. Keep visual dimensions in a regular layout container, outside the button's intrinsic-content box: WebKit may shrink percentage-sized children of a button to caption width. A transparent semantic button covers the picture/caption, while enlargement stays a separate control. Keep atlas cells square and complete. A `storySequence.tokenIds` list can reuse the given reference order as the candidate tray, avoiding duplicated image columns; the list must cover every token once and the usage audit must count the actual visible surface.
