# Content Package Boundary

This project now has a deployment-owned content boundary at `content/` inside each generated release package.

## Current Phase

The current game question bank still lives in `src/data/games.ts` and is compiled into the app during `pnpm build`. This keeps the packaging change small and avoids mixing deployment work with a high-risk curriculum data migration.

The generated release package includes:

```text
release/nas-static/
├── index.html
├── assets/
├── images/
├── audio/
├── content/
│   ├── manifest.json
│   └── README.md
└── release-manifest.json
```

`content/manifest.json` currently declares:

```json
{
  "schemaVersion": 1,
  "phase": "boundary-placeholder",
  "appContentMode": "built-in-default"
}
```

That means the content directory is ready for deployment workflows, but it is not yet the source of truth for the question bank.

## What Can Be Updated Without Rebuilding Source

- NAS operators can replace or mount `content/` for future content packs.
- Static image and audio files remain ordinary deployable files under `images/` and `audio/`.
- Docker fallback can mount `content/` separately from the app image.

## What Still Requires A Build

- Changes to prompts, choices, feedback, parent guidance, or game structure still require editing `src/data/games.ts`, running the voice export/generation workflow when text changes, then running `pnpm build`.
- Changes to registered images still require `src/data/imageGallery.ts` updates and `pnpm audit:curriculum`.

## Follow-Up: JSON Question Bank

A separate feature should migrate the question bank to validated JSON content packs under `content/`. That follow-up must define:

- A JSON schema for games, rounds, assets, and voice text.
- A loader that falls back to built-in content when external content is absent or invalid.
- Curriculum audit coverage for external content.
- Versioning rules for content packs.

Until that migration exists, deployment tools must treat `content/` as a boundary and not as a complete replacement for `src/data/games.ts`.
