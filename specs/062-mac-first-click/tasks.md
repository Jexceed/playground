# Tasks: Mac 窗口首次点击

**Input**: `specs/062-mac-first-click/` design artifacts.

## Phase 1: Setup

- [x] T001 Capture scope and input requirements in `specs/062-mac-first-click/spec.md` and `contracts/input.md`.

## Phase 2: Foundation

- [x] T002 Record actual handlers, local Tauri/Wry semantics and native observations in `specs/062-mac-first-click/research.md`.

## Phase 3: US1 — First click (P1)

Independent check: installed main window uses the first-mouse setting; representative selection and submission each execute once.

- [x] T003 [US1] Enable `acceptFirstMouse` in `src-tauri/tauri.conf.json`.
- [x] T004 [US1] Run `pnpm mac:install`, reopen `/Applications/小小思考屋.app`, verify installed signature/hash and native input; record results in `specs/062-mac-first-click/verification.md`.

## Phase 4: US2 — Preserve existing rules (P1)

Independent check: existing activity/navigation/progress regressions and audits pass; disabled and completed states retain their behavior.

- [x] T005 [US2] Run existing targeted tests, build, curriculum/voice checks from `specs/062-mac-first-click/quickstart.md` and record results in `verification.md`.
- [x] T006 [US2] Check exploration multi-select and enlightenment selection in the installed app, restore previous navigation, and record limits in `specs/062-mac-first-click/verification.md`.

## Phase 5: Documentation

- [x] T007 Update `docs/CHANGELOG.md`, `docs/TODO.md`, this task list and the spec status with completed behavior and the unconfirmed foreground case.

## Dependencies and execution

T001 → T002 → T003 → T005 → T004 → T006 → T007. Independent build/audit/test commands may run concurrently. Implementation remains serial and introduces no parallel agents. The smallest deliverable is US1; US2 validation is required before delivery.
