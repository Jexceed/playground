# Tasks: App Launch Branding

**Input**: Design documents from `/specs/019-app-launch-branding/`

## Phase 1: Audit First

- [x] T001 Add failing source checks for Tauri icon config and splash branding in `scripts/audit-curriculum.mjs`
- [x] T002 Run `pnpm audit:curriculum` and confirm it fails for missing icon config/splash source

## Phase 2: Implementation

- [x] T003 Add explicit icon paths to `src-tauri/tauri.conf.json`
- [x] T004 Add launch splash state and `LaunchSplash` component in `src/App.tsx`
- [x] T005 Add splash animation styles in `src/styles.css`
- [x] T006 Update `docs/CHANGELOG.md`

## Phase 3: Verification

- [x] T007 Run `pnpm build`
- [x] T008 Run `pnpm audit:curriculum`
- [x] T009 Run `pnpm test:release`
- [x] T010 Run `pnpm release:nas`
- [x] T011 Run `pnpm mac:install`
- [x] T012 Inspect `/Applications/小小思考屋.app` icon resources and launch process
