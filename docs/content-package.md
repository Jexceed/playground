# Content Package Boundary

This project now has a deployment-owned content boundary at `content/` inside each generated release package.

## Current Phase

The legacy question bank remains in `src/data/games.ts`; the first 24 interactive
activities live in `src/curriculum/pilot/`. The shared
`src/curriculum/catalog.ts` composes both for the app, voice export and audits,
and is compiled during `pnpm build`. The old definitions and IDs are unchanged.

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

## Planned Curriculum Expansion

Feature [029](../specs/029-curriculum-benchmark/plan.md) keeps one application and
a continuous curriculum. It proposes a shared, build-time catalog with
domain/family modules and a legacy adapter preserving existing game/round IDs.
Application loading, curriculum audits, voice export, and platform exports must
consume that same catalog.

The first shared catalog and module-graph loading are implemented for the
24-activity pilot. Broader domain decomposition and historical migration are
still planned. The `boundary-placeholder` release manifest remains the actual
external-content state. A runtime external-JSON loader is still a separate follow-up.
Content structure versions, content revisions, application versions, and age
recommendations have separate meanings.

Source collection files and research locators stay in development evidence.
Only independently verified, authored activities and their registered runtime
assets belong in release output. Unsupported platform interaction kinds must
be reported explicitly, never silently reduced to an inequivalent choice task.
