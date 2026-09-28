# Implementation Plan: 启蒙质量优化

**Branch**: dev | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

## Summary

Audit the full legacy bank, fix confirmed content and observation-flow defects, validate existing history and exploration preservation, and install the corrected Mac app. Use current TypeScript data and deterministic local visuals; no new platform or dependency.

## Technical Context

TypeScript 5 / React 19 / Vite 7; pnpm; Tauri Mac shell. LocalStorage retains stable completion IDs. Node built-in test runner plus Vite SSR data loader support semantic checks. Local PNG/SVG evidence and Edge speech are existing asset pipelines. Scope: 40 groups / 489 rounds, shared ProgressiveSetGame. Current Mac window is the visual target; no claim of child-age calibration.

## Constitution Check

Before and after design: PASS. Concrete parent-child evidence, stable identities, registered local assets, Spec Kit traceability, build/audit/media/native gates and maintained documentation are covered. No exception or new project rule is needed.

## Research and design

Use baseline exports to detect unrelated changes and generate a complete review ledger. Read every narrative scenario and each deterministic generator, then inspect representative rendered variants, with emphasis on any changed family. Use independent calculations for mathematical/geometric correctness. Implement content corrections in games.ts and scoped runtime fixes in ProgressiveSetGame; extract only helpers that make meaningful state transitions and answer scheduling independently testable. Do not rewrite working exploration components.

## Project Structure

- src/data/games.ts: enlightenment wording, local picture references and choice arrangement.
- src/games/ProgressiveSetGame.tsx; src/styles.css: observation/answer/completion behavior and scoped layout.
- src/App.tsx / src/storage.ts only as necessary for truthful progress.
- src/data/enlightenmentBridges.ts and scripts/generate-enlightenment-*.mjs: exact registered bridge models and corrected local symbols.
- scripts/*enlightenment*: semantic and behavioral regressions; existing audit-curriculum remains a required gate.
- scripts/export-voice-lines.mjs; public/audio/: new or revised local lines.
- specs/040-enlightenment-quality/verification/: baseline, per-group review, test results and UI evidence.
- docs/CHANGELOG.md and docs/TODO.md: completed changes and verified boundaries.

## Delivery order

Baseline and full review → coherent content corrections (US1) → observation/progress correctness (US2) → voice/assets, regressions, browser/native installation (US3). Record newly discovered issues without silently shrinking review scope. Each story can be checked independently; deliver the full feature.

## Workflow notes

No extension hooks or update-agent-context script exists in this checkout. All technical choices use verified current project primitives; no unresolved technology research requires delegation. No constitution violations.

## Native acceptance follow-up

The installed app exposed scene-image clipping: an intrinsic grid row exceeded the fixed 330px figure, cutting off the bottom bridge model. Constrain the progressive scene's grid tracks and image minimum size without changing the outer task height or exploration styling. Preserve the failing screenshot, rebuild/install, and check complete scene bounds plus answer/feedback controls in the native app. No content or voice text changes are needed.
