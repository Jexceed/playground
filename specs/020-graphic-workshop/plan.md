# Implementation Plan: Graphic Workshop

**Branch**: `dev` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-graphic-workshop/spec.md`

## Summary

Add 图形工坊 as a third content world for non-duplicative drawn visual-processing task families extracted from the 上实幼升小 reference analysis, while adding only compact differentiated reinforcement to existing worlds. The implementation extends typed content structures with a dedicated `graphicChallenge` surface, app world navigation, storage validation, and curriculum audit coverage without adding raster asset families in the first pass.

## Technical Context

**Language/Version**: TypeScript with React and Vite

**Primary Dependencies**: Existing React app, lucide-react icons, TypeScript compiler, current curriculum audit script

**Storage**: Browser localStorage for progress and last play location

**Testing**: `pnpm audit:curriculum`, `pnpm build`, `git diff --check`

**Target Platform**: Browser SPA, NAS static package, and Tauri-wrapped Mac app through existing build paths

**Project Type**: Frontend single-page app with built-in TypeScript question bank

**Performance Goals**: No measurable runtime regression; graphic rounds render inline SVG stems and answer choices inside the existing progressive-set flow

**Constraints**: Keep first-pass content compact, child-facing, parent-explainable, and auditable; avoid abstract text-only choices; avoid new raster assets unless required by a future content pass

**Scale/Scope**: One new world, six first-pass graphic-workshop games covering silhouette matching, occlusion recovery, local-detail matching, transparent layer overlap, graphic coding, and visual closure; 48 new graphic rounds; and no more than three existing-world reinforcement rounds

## Constitution Check

- Child-centered learning integrity: Pass. New rounds must connect prompt, visuals, choices, feedback, and parent prompts to one visible operation.
- Spec-driven traceability: Pass. This plan, tasks, docs, and verification map to `020-graphic-workshop`.
- Auditable local assets: Pass. First pass uses local inline SVG figure rendering; audit catches unsupported text-only graphic options.
- Verification before completion: Pass. Required commands are `pnpm audit:curriculum`, `pnpm build`, and `git diff --check`.
- Documentation hygiene: Pass. Changelog, TODO, and maintained reference-analysis docs will be updated.

## Project Structure

### Documentation (this feature)

```text
specs/020-graphic-workshop/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── types.ts
├── storage.ts
├── App.tsx
├── data/games.ts
├── games/ProgressiveSetGame.tsx
└── styles.css

scripts/
└── audit-curriculum.mjs

docs/
├── CHANGELOG.md
├── TODO.md
└── graphic-workshop-reference-analysis.md
```

**Structure Decision**: Use the existing built-in TypeScript question bank and progressive-set renderer. Do not introduce a new content pack schema in this feature because that is already tracked as a separate TODO.

## Complexity Tracking

No constitution violations.
