# Implementation Plan: 每个题组独立续玩

**Branch**: dev | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

## Summary

Extend the existing navigation store with stable per-group locations, migrate known section/legacy positions, and make App group selection use the remembered target. Preserve section-level launch resume. Initialize the enlightenment renderer from the requested round so restoration does not briefly expose round 1.

## Technical Context

Existing React 19 / TypeScript 5 / Vite / Tauri Mac app, localStorage, Node tests and CUA UI checks. No dependencies or assets added. Scope is 115 groups / 1110 rounds across the two existing sections. Navigation writes are small (at most one entry per group), synchronous and independent of completion evidence. Exact current Mac is the validation target.

## Constitution Check

Before and after design: PASS. Reduces needless navigation for children, preserves stable IDs and historical evidence, follows Spec Kit, leaves registered images/speech unchanged, and requires build, curriculum audit and installed-app acceptance. No principle changes or exceptions.

## Research and design

See research.md and data-model.md. Upgrade navigation to schema 2 with gameLocations keyed by gameId, retaining locations per section. Accept valid schema 1 as migration input; preserve unknown/corrupt stored payloads by refusing writes. Restore by roundId, derive indices from the current catalog and use same-group round 1 if that round has disappeared. App selection and theme-first selection share this resolver; reselecting the current group/theme is a no-op. Explicit reset continues to update the remembered position.

## Affected structure

- src/services/curriculum-navigation.ts: schema, validation, migration and group resolver.
- src/App.tsx: group/theme selection uses the saved target.
- src/games/ProgressiveSetGame.tsx: restored first render and observation phase.
- scripts/curriculum-navigation.test.mjs: multi-group round trips, legacy/future/corrupt preservation, stable-ID resolution and explicit reset.
- specs/041-group-resume/verification/: actual UI and package evidence.
- docs/CHANGELOG.md and docs/TODO.md: behavior and remaining acceptance, if any.

## Validation and workflow

Run focused navigation, enlightenment and activity regressions, pnpm build and pnpm audit:curriculum. Check A round 5 → B round 7 → A round 5 in both sections, repeated selection, section/theme hops, explicit reset and quit/reopen. Install via pnpm mac:install, verify hash/signature and repeat in the native Applications app. Do not submit new correct answers or erase real progress during navigation QA.

No .specify/extensions.yml or update-agent-context script exists. No unresolved technical unknowns or external research/agent delegation is needed; the change extends existing local primitives.
