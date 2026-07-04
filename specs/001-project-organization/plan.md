# Implementation Plan: Project Organization

**Branch**: `dev` | **Date**: 2026-07-04 | **Spec**: `specs/001-project-organization/spec.md`

**Input**: Feature specification from `specs/001-project-organization/spec.md`

## Summary

Set up Spec Kit, make project governance explicit, remove duplicate document
sources of truth, and normalize the image asset taxonomy so the repo can evolve
as a maintained product rather than a prototype with scattered notes.

## Technical Context

**Language/Version**: TypeScript with React and Vite

**Primary Dependencies**: React, Vite, TypeScript, pnpm, GitHub Spec Kit

**Storage**: Local repository files

**Testing**: `pnpm build`, `pnpm audit:curriculum`, git status/diff checks

**Target Platform**: Browser-based single-page application

**Project Type**: Frontend app with local content and media assets

**Performance Goals**: No runtime asset path regressions; no broken registered images

**Constraints**: Preserve existing behavior while changing docs and asset paths

**Scale/Scope**: Project governance docs, Spec Kit metadata, and image taxonomy

## Constitution Check

- Child-centered learning integrity: pass. This change preserves the product
  positioning and makes it explicit in `AGENTS.md` and the constitution.
- Spec-driven traceability: pass. This feature creates its own spec, plan, and tasks.
- Auditable local assets: pass. Runtime asset paths move from `avatars` to
  `characters` and remain registered in `imageGallery`.
- Verification before completion: pass. The implementation must run
  `pnpm build` and `pnpm audit:curriculum`.
- Documentation hygiene: pass. `AGENTS.md`, docs, archive, changelog, and todo
  are updated together.

## Project Structure

```text
.agents/skills/                  # Spec Kit Codex skills
.specify/                        # Spec Kit templates, scripts, constitution
specs/001-project-organization/  # This feature's spec, plan, tasks
docs/
├── assets.md
├── CHANGELOG.md
├── TODO.md
└── archive/
public/images/
├── brand/
├── characters/
├── items/
└── scenes/
src/data/imageGallery.ts
src/components/VisualToken.tsx
```

**Structure Decision**: Keep Spec Kit's root `specs/` directory. Keep maintained
docs in `docs/`. Archive obsolete Obsidian notes under `docs/archive/`. Use
`characters` instead of `avatars` because characters are reusable semantic actors,
not UI-only profile pictures.

## Complexity Tracking

No constitution violations.
