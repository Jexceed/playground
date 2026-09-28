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
- The content implementation's build/install output is `mac-install.log`; the formatting-only build in `build.log` has matching runtime asset hashes. The subsequent six-line native scene-layout correction was built and installed again (`native/mac-install.log`), with fresh curriculum audit and 14 enlightenment regressions passing. Content, speech and other runtime logic did not change in that follow-up.
- `pnpm mac:install` updated `/Applications/小小思考屋.app`. Current built and installed executables match, and strict deep signature verification succeeds (`native/mac-integrity.txt`). Current installed SHA-256: `19ee39d345b16040e76c333d9e9a52a2c12a2ca6595e0cf29c37bab496009fc2`. The top-level `mac-integrity.txt` retains the previous installation's identity.

## Native acceptance — passed for the specified representative scope

After earlier locked-host attempts, the Mac was available on 2026-09-28. The installed Applications app was quit and relaunched through CUA, then exercised in its actual 1280×820 window (2560×1640 Retina captures). The detailed native cases and limits are recorded in [native/qa.md](native/qa.md), with AX states, screenshots and action timestamps beside it.

- Native inspection found a real scene-image clipping defect: the intrinsic grid row exceeded the fixed 330px frame and hid the bottom bridge model. Minimum-zero grid tracks and image minimum dimensions now constrain the image to its frame. Before/after screenshots are retained; the rebuilt native app shows the complete model, answer buttons and feedback without main-page scrolling. Scene-only story evidence and scene-plus-clock layouts also pass.
- Timed readiness/hiding, review-cleared choices, listen interruption, manual memory conceal/review, changed action/object pictures, matrix sizes, dense map/grouping/composition layouts, all six graphic-family samples, parent-guidance expansion, wrong/correct feedback and independent section return were exercised.
- An installed local listening cue progressed from playing to enabled response controls on its natural completion. This is playback/resource evidence, not a full acoustic/pronunciation review. Enlightenment question and parent-speech controls were also exercised; existing 4043-entry media/provider checks remain applicable.
- Quit/reopen restored the exact enlightenment group/round and exploration location. Original completion totals remain 273/489 and 21/621. Only an already-completed bridge round was submitted correctly; its updated practice tag was added by that QA attempt, so this is not a claim of byte-identical storage. No completion record was erased or fabricated. Both original entry locations were restored afterward.

The 489-round browser passes predate the narrow native scene-layout correction; they are not presented as a second full native sweep. All content and interaction logic is unchanged from those passes, and affected scene layouts were checked in the final installed app. Existing exploration 035–039 follow-ups and child/acoustic calibration remain separate from this feature's representative native acceptance.
