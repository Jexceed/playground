# Feature Specification: Project Organization

**Feature Branch**: `dev`

**Created**: 2026-07-04

**Status**: Implementing

**Input**: User description: "重新整理当前资产和文档；AGENTS.md 说明项目基本情况和原则；采用 Spec-Driven Development 驱动特性落地；维护 changelog 和 todo；处理 specify init。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Rules Are Discoverable (Priority: P1)

As a future agent or developer, I can open `AGENTS.md` and understand what the
project is, which files are authoritative, how to change it, and what checks are
required before completion.

**Why this priority**: Without a clear root guide, future changes will keep
mixing prototype notes, assets, and implementation decisions.

**Independent Test**: Read `AGENTS.md` and verify it covers project overview,
source-of-truth rules, SDD workflow, asset taxonomy, documentation hygiene, and
existing commit/push policy.

**Acceptance Scenarios**:

1. **Given** a new agent starts in the repository, **When** it reads `AGENTS.md`,
   **Then** it can identify the app purpose, core directories, SDD workflow, and
   verification commands.
2. **Given** a project change touches docs or assets, **When** the agent checks
   `AGENTS.md`, **Then** it can find where to update changelog, todo, and asset
   rules.

---

### User Story 2 - Spec Kit Drives Work (Priority: P1)

As a maintainer, I can use Spec Kit artifacts in this repository to define,
plan, task, and verify non-trivial changes.

**Why this priority**: The user explicitly requested Spec-Driven Development and
noted that `specify init` had not been run.

**Independent Test**: Confirm `.specify/`, `.agents/skills/`, and
`specs/001-project-organization/` exist, and the constitution has no template
placeholders.

**Acceptance Scenarios**:

1. **Given** a future feature request, **When** a maintainer starts SDD,
   **Then** Spec Kit scripts, templates, and Codex skills are present.
2. **Given** this organization change, **When** reviewing the repo, **Then** its
   spec, plan, and tasks are present under `specs/001-project-organization/`.

---

### User Story 3 - Assets Have Clear Categories (Priority: P2)

As a developer adding or using images, I can distinguish characters, objects,
scenes, and brand assets without guessing whether `avatars` and `items` overlap.

**Why this priority**: The current `avatars` category overlaps semantically with
`items`, creating unclear asset ownership.

**Independent Test**: Confirm the runtime character images live under
`public/images/characters/`, are registered as `imageGallery.characters`, and
the curriculum audit still passes.

**Acceptance Scenarios**:

1. **Given** a VisualToken needs a cat, dog, rabbit, or bear, **When** it resolves
   the image, **Then** it uses `imageGallery.characters`.
2. **Given** a new non-character item is added, **When** it is registered,
   **Then** it belongs in `imageGallery.items` and `public/images/items/`.

---

### Edge Cases

- Historical notes contain useful decisions but stale numbers. They should move
  to `docs/archive/` instead of being deleted.
- Spec Kit generated agent skills under `.agents/skills/`; these are workflow
  assets and should be reviewed like source files.
- Existing image source files must move with their runtime files.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Repository MUST be initialized as a Spec Kit project for Codex.
- **FR-002**: Constitution MUST replace all template placeholders with
  project-specific principles.
- **FR-003**: `AGENTS.md` MUST document project overview, source-of-truth rules,
  SDD workflow, asset taxonomy, documentation hygiene, verification, and git policy.
- **FR-004**: Maintained docs MUST include changelog, todo, and asset governance.
- **FR-005**: Historical Obsidian notes MUST be moved under `docs/archive/`.
- **FR-006**: Image taxonomy MUST use `characters` for reusable actors and
  `items` for non-character assets.
- **FR-007**: Code references MUST be updated so runtime character images resolve
  from the new taxonomy.
- **FR-008**: Verification MUST include build and curriculum audit.

### Key Entities *(include if feature involves data)*

- **Project Constitution**: Spec Kit governance document defining non-negotiable
  project principles.
- **Maintained Docs**: `AGENTS.md`, `docs/assets.md`, `docs/CHANGELOG.md`, and
  `docs/TODO.md`.
- **Asset Category**: A stable runtime directory and `imageGallery` collection.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: Move `public/images/avatars/` to `public/images/characters/`.
- **Docs**: Update `AGENTS.md`, `.specify/memory/constitution.md`,
  `docs/build-generation-guide.md`, `docs/assets.md`, `docs/CHANGELOG.md`,
  `docs/TODO.md`, and archive guidance.
- **Audit Coverage**: `pnpm build`, `pnpm audit:curriculum`, and stale-reference
  search for `avatars`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No placeholder tokens remain in `.specify/memory/constitution.md`.
- **SC-002**: Maintained source files contain no stale `avatars` references.
- **SC-003**: `pnpm build` completes successfully.
- **SC-004**: `pnpm audit:curriculum` completes with `problemCount: 0`.

## Assumptions

- Keep current application behavior unchanged.
- Keep work on local `dev` unless the user explicitly asks to push.
- Archive historical notes instead of deleting them.
- Use Spec Kit's root `specs/` convention.
