# Tasks: 每个题组独立续玩

## Setup and foundation

- [x] T001 Record scope, plan and validation in specs/041-group-resume/spec.md, plan.md and quickstart.md.
- [x] T002 Inspect current storage/selection behavior and define migration/position contracts in specs/041-group-resume/data-model.md and contracts/navigation.md.

## US1 — Independent group locations

Independent check: A round 5 → B round 7 → A restores round 5; current-group/current-theme reselect preserves the task; explicit reset changes only A.

- [x] T003 [US1] Add meaningful multi-group, stable-ID, removal and reset regressions to scripts/curriculum-navigation.test.mjs; confirm new assertions fail against the current implementation.
- [x] T004 [US1] Implement per-group location resolution in src/services/curriculum-navigation.ts, use it in src/App.tsx selection, and initialize src/games/ProgressiveSetGame.tsx from the restored round.

## US2 — Relaunch and migration

Independent check: save/reload retains four independent locations across both sections and the most recent active location, without changing completion stores.

- [x] T005 [US2] Cover schema-1/legacy migration, schema-2 round trips and corrupt/future/unavailable storage in scripts/curriculum-navigation.test.mjs.
- [x] T006 [US2] Implement compatible reading, normalization and guarded schema-2 saves in src/services/curriculum-navigation.ts.

## Verification and documentation

- [x] T007 Run focused regressions, pnpm build, pnpm audit:curriculum and pnpm mac:install; check native group/theme/section/restart flows and record evidence in specs/041-group-resume/verification/qa.md.
- [x] T008 Update docs/CHANGELOG.md, docs/TODO.md and specs/041-group-resume/tasks.md with verified behavior and any real limitations.

## Dependencies, parallel work and delivery

T001–T002 → T003/T005 (write and run new behavioral tests first) → T004/T006 (one cohesive implementation) → T007 → T008. US1's same-session behavior is the first reviewable increment; deliver both stories including installed-app recovery. The two test groups and final read-only audit commands can run independently; edits to the shared navigation service are sequential. All eight tasks use checkbox/ID/path format. No extension hooks or agent-context update script exist.
