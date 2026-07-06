# Implementation Plan: App Launch Branding

**Branch**: `dev` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

## Summary

Add source-audited app launch branding: Tauri icon configuration, a user-gesture splash screen with logo animation, and a spoken "小小思考屋" entry before the existing page.

## Technical Context

**Language/Version**: React 19, TypeScript 5.8.3, Vite 7, Tauri 2

**Primary Dependencies**: Existing `speak` audio pipeline and local brand image

**Testing**: `pnpm audit:curriculum`, `pnpm build`, `pnpm test:release`, `pnpm release:nas`, `pnpm mac:install`

**Target Platform**: Browser/NAS static app and macOS Tauri app

**Constraints**: Keep existing main page behavior after splash; entry voice must be user-triggered; packaging must still stay decoupled from game logic.

## Constitution Check

- Child-centered learning integrity: Pass. Splash is a branded entry only and does not change curriculum logic.
- Spec-driven traceability: Pass. Requirements and verification are documented here.
- Auditable local assets: Pass. Reuses local brand/logo assets.
- Verification before completion: Pass. Exact verification commands are named.
- Documentation hygiene: Pass. Changelog updates are required.

## Project Structure

```text
src/App.tsx
src/styles.css
src-tauri/tauri.conf.json
scripts/audit-curriculum.mjs
docs/CHANGELOG.md
specs/019-app-launch-branding/
```

## Complexity Tracking

No constitution violations.
