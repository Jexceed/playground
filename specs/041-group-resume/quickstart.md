# Validation

1. Run node --test scripts/curriculum-navigation.test.mjs scripts/enlightenment-quality.test.mjs scripts/activity-progress.test.mjs scripts/round-speech-navigation.test.mjs, with the bundled Node runtime on PATH.
2. Run pnpm build and pnpm audit:curriculum.
3. In the current Mac-sized test UI: visit two different nonfirst rounds in two enlightenment groups; return to each, re-click the current group, change theme/section, then reload. Repeat with exploration groups. Confirm the active question and right-hand navigator agree.
4. Explicitly reset one enlightenment group, leave and return: only that group's position is now question 1. Do not clear completion records or submit new correct answers.
5. Run pnpm mac:install. Compare built/installed executable hashes and verify the app signature. Quit/reopen the actual Applications app and repeat group/section navigation. Record actual original/final completion totals and screenshots in verification/qa.md.
6. Keep browser and native evidence separate; do not mark the native gate passed if the Mac is locked.
