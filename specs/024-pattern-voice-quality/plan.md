# Implementation Plan: Pattern Visual And Voice Quality

**Branch**: `dev` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from
`specs/024-pattern-voice-quality/spec.md`

## Summary

Replace every 找规律火车 evidence token with a coherent registered local PNG
set derived from image-gen sources, with deterministic large/medium/small circle
scaling on a shared canvas. Add a reusable MP3 inspector and text-aware duration
gate to the Edge generation path so six currently implausibly short files and
future truncated outputs are rejected and regenerated. Extend curriculum and
asset audits, rebuild the standard voice pack, update maintained docs, and
validate browser, NAS, and installed Mac behavior.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Node.js ESM, shell/Python only for
existing generation helpers

**Primary Dependencies**: Vite 7, Tauri 2, Edge TTS Python package, built-in
image-gen tool, existing local image processing helpers

**Storage**: Registered PNG files and generated MP3/JSON manifests under
`public/`

**Testing**: Node test runner, curriculum audit, production build, browser visual
inspection, NAS release build, Tauri Mac installation

**Target Platform**: Modern desktop/mobile browsers, static NAS deployment, and
Apple Silicon macOS app

**Project Type**: React single-page application with local desktop wrapper

**Performance Goals**: Pattern cards render from local assets without network
requests; voice validation scans 1,800+ entries in seconds without decoding the
entire pack to PCM

**Constraints**: Offline-first runtime; no browser TTS as the normal path; image
tokens must remain legible at 375px; no external runtime image or speech
dependency; no direct work on `main`

**Scale/Scope**: Six pattern families, 18 rounds, approximately 12 semantic
picture cards, and the complete active 1,801-entry voice pack

## Constitution Check

- Child-centered learning integrity: pass. The pattern image is the evidence,
  and the size family is made visually fair rather than verbally hinted.
- Spec-driven traceability: pass. Visual assets, audio validation, docs, and
  release verification map to requirements and tasks in this feature.
- Auditable local assets: pass. Every runtime PNG is registered and retains an
  image-gen source; every manifested MP3 is validated against exported text.
- Verification before completion: pass. The plan requires targeted tests,
  `pnpm build`, `pnpm audit:curriculum`, release packaging, browser review, and
  `pnpm mac:install`.
- Documentation hygiene: pass. `docs/assets.md`,
  `docs/build-generation-guide.md`, `docs/CHANGELOG.md`, and `docs/TODO.md` are
  updated in the same change.

Post-design re-check: pass. No constitution exception or new top-level product
boundary is introduced.

## Project Structure

### Documentation

```text
specs/024-pattern-voice-quality/
├── checklists/requirements.md
├── contracts/quality-audit.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

### Source And Assets

```text
public/
├── audio/
│   ├── voice-lines.json
│   └── voice/
│       ├── manifest.json
│       └── zh-CN/edge-zh-cn-xiaoxiaoneural/*.mp3
└── images/items/
    ├── pattern-train/*.png
    └── source/pattern-train-*-source.png

scripts/
├── audit-curriculum.mjs
├── audit-voice-media.mjs
├── generate-edge-voices.mjs
├── lib/voice-media-quality.mjs
└── voice-media-quality.test.mjs

src/
├── components/VisualToken.tsx
└── data/
    ├── games.ts
    └── imageGallery.ts
```

**Structure Decision**: Keep the existing single-app boundaries. Pattern cards
are a specific item subcategory; media inspection is shared under `scripts/lib`
so generation, tests, and audits use one rule.

## Implementation Sequence

1. Capture baseline findings: six sentence-length files are below 0.18 seconds
   per Chinese character; the worst is 0.84 seconds for 18 characters.
2. Add failing media-inspection tests and the reusable MP3/text validator.
3. Integrate validation into generation and the curriculum/release audit.
4. Generate and visually inspect the pattern-card source sheet, remove its
   chroma background, crop semantic cards, and derive deterministic size cards.
5. Register every new PNG and route all pattern tokens through it.
6. Regenerate rejected speech, then re-export/regenerate the full active pack if
   content changes.
7. Update docs and run the full validation matrix.

## Complexity Tracking

No constitution violations require justification.
