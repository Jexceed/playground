# Validation

1. Run `pnpm build` and `pnpm audit:curriculum`.
2. Run `pnpm test:desktop-release`, `pnpm test:exploration`, `pnpm test:enlightenment`, and `node --test scripts/visible-activity-assets.test.mjs scripts/activity-framework.test.mjs scripts/round-speech-navigation.test.mjs`.
3. Run `pnpm audit:voice-media`; compare the voice script and manifest and report generator/failures/fallback status. No speech text changes are planned.
4. Run `pnpm mac:install`; verify installed/built executable hashes and `codesign --verify --deep --strict`.
5. Quit and reopen the installed app. Check a completed 数量结构屋 round: one click selects a number; one click submits; one click restarts. Check exploration multi-select toggles once, and enlightenment still selects with one click. Use already-completed rounds for submissions and restore navigation afterward.
6. Record limits of automation around inactive-window delivery. Preserve the follow-up for intermittent clicks while already active and ready.
