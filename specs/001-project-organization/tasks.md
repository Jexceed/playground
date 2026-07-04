# Tasks: Project Organization

**Input**: `specs/001-project-organization/spec.md`,
`specs/001-project-organization/plan.md`

## Phase 1: Spec Kit Foundation

- [x] T001 Initialize Spec Kit in the existing repository with Codex skills.
- [x] T002 Replace placeholder constitution content with project-specific principles.
- [x] T003 Update Spec Kit templates so future specs include asset/docs impact and verification gates.

## Phase 2: Source Of Truth Documentation

- [x] T004 Expand `AGENTS.md` with project overview, principles, SDD workflow, asset taxonomy, and documentation rules.
- [x] T005 Add `docs/assets.md` for image and audio asset governance.
- [x] T006 Add `docs/CHANGELOG.md` and record this project organization change.
- [x] T007 Add `docs/TODO.md` with prioritized follow-up work.
- [x] T008 Move historical Obsidian notes to `docs/archive/obsidian/` and add archive guidance.

## Phase 3: Asset Taxonomy Cleanup

- [x] T009 Rename `public/images/avatars/` to `public/images/characters/`.
- [x] T010 Update `src/data/imageGallery.ts` from `avatars` to `characters`.
- [x] T011 Update `src/components/VisualToken.tsx` to read `imageGallery.characters`.
- [x] T012 Update maintained docs that referenced the old avatar category.

## Phase 4: Verification

- [x] T013 Run `pnpm build`.
- [x] T014 Run `pnpm audit:curriculum`.
- [x] T015 Confirm no stale `avatars` references remain in maintained source files.
- [x] T016 Review git status and summarize changed files.
