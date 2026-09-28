# Enlightenment quality verification

Scope: 40 groups / 489 rounds in 启蒙. Existing stable identities remain; all 75 exploration groups / 621 activities retain their baseline serialized content. This is content and software verification, not child-age calibration.

## Content and assets

The per-group review is in `review.md` / `review.json`. Confirmed corrections include insufficient everyday conditions, incorrect or redundant picture states, predictable answer/stimulus positions, incorrect numeric patterns, answer-revealing clocks, observation timing, false completion after jumps, and graphic geometry/wording disagreements.

Eight exact bridge-model scenes and six local state/action symbols are registered with sources and generators. Existing exploration art is intact: 15 atlases, 72 registered and used frames, zero unused frames. Generic decorative quantity/light backdrops are removed from task evidence.

## Browser evidence

All interaction used CUA against an isolated test origin, `http://127.0.0.1:5287/`, at 1280×788. The configured Mac window is 1280×820 including its title bar. Test progress belongs to this separate browser origin, not the installed app's child history.

- `browser-round-checks.json`: 489 distinct authored answers submitted through the actual UI; every one produced correct feedback. Initial and feedback layout states were measured. All recorded final results fit; no broken HTML images or horizontal overflow were detected.
- `final-layouts.json`: an additional 489-page check after final visual cleanup and with all test completion records populated. All document extents are 1280×788; no decorative backdrop or broken image remained. A full history exposed a support-rail overflow in the 28-round group, now fixed by containing auxiliary scrolling in that rail.
- Timed observation: entry waits for readiness; visible pictures disable answers; hiding enables answers; covered occupied and empty cells have identical backgrounds; re-observation clears pending selection; asking to listen during observation returns to readiness. Starting a glance stops the question narration.
- Memory camera: choosing an answer after concealment enables submission; re-opening the pictures clears that choice and disables submission until hidden again. All 12 memory answers were checked independently and exercised.
- Jumping to bridge round 8 and submitting it showed only 2/8 historical test rounds done, exposed “去做还没完成的题”, and returned to round 1. It did not complete the group. See `screenshots/last-round-preserves-unfinished.jpg`.
- Section switching retained `logic-position-map`, round 9, while exploration independently showed 75 groups / 621 activities (`section-resume.json`). Reload preserved all 489 test completion records and the exact final game/round (`reload-resume.json`).
- Rendered large/small stars measured 48px versus 26.4px within the same matrix (`star-size-check.json`). Final graphic screenshots verify partial crops, aligned paper frames, separate code pairs and matching complete/incomplete contours.

Two oversized CUA batches timed out and reset their runtime. They were recovered from the actual browser state and saved files. Subsequent checks saved per group/round; the final files contain unique IDs. `layout-findings-*.json`, `graphic-layout-initial.json`, `layout-before-full-progress-fix.json` and `layout-cumulative-at-recovery.json` retain intermediate failures, not passing claims. Files named `final-*` are the final page captures; earlier `scan-*` files can depict capture-time intermediate layouts.

## Automated and package gates

- 104 Node regressions pass (`tests.log`), including 14 targeted enlightenment cases.
- `pnpm audit:curriculum`: 115 groups / 1110 total rounds, zero problems (`curriculum-audit.log`).
- Voice exporter includes observation copy and game/round parent guidance. The 4043-entry manifest matches the scripts; media audit checks all 4043 files with zero problems. Standard provider: Edge `zh-CN-XiaoxiaoNeural`, rate -12%, pitch +2Hz, with the existing locale-specific English lines retained. Manifest failures are empty; no macOS say or mixed-local fallback.
- `pnpm audit:illustrations`: 15 atlases / 72 used frames, zero problems (`illustration-audit.log`).
- Current `pnpm build` succeeds as `mac:install`'s `beforeBuildCommand`; the current build/install output is `mac-install.log`; a final formatting-only build in `build.log` produces the same runtime asset hashes.
- `pnpm mac:install` updated `/Applications/小小思考屋.app`. Built and installed executables match, and strict deep signature verification succeeds (`mac-integrity.txt`). Installed SHA-256: `df8396be9bd013b17012505a48698b4f638f6ceca2c428fed4d9bd05660c63cc`.

## Native acceptance — pending

CUA's fresh Applications-app probes report: “The Mac is locked and automatic unlock could not unlock it.” A request to unlock was sent; no new unlock reply has arrived. No native input success is claimed. The probes belong to one goal turn and are not three separate blocked goal turns.

After unlock, quit/reopen the installed Applications app so an old running process cannot supply stale evidence. Check readiness/review, memory re-observation, representative changed graphics and models, local speech and existing native progress. Prefer already-completed rounds when testing a correct answer so real history is not inflated by QA. The user’s original progress must remain intact. Existing native follow-ups for exploration 035–039 remain separately open.

The objective remains active. Build, browser, asset and signature evidence do not replace this required real-app acceptance.
