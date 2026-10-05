# Group resume verification — 2026-10-05

## Result

All six feature requirements pass. Per-group locations and section-level startup recovery work in the installed Mac app. No question content, answer, graphic, CSS or voice asset changed. This feature remembers question position; it does not save a partially completed answer across leaving/restarting.

## Before and after

The old Applications app reproduced the user's issue: 看过哪些朋友 round 5 → 位置藏起来 round 7 → 看过哪些朋友 returned to round 1 (`native-old-*.txt`, `native-before-fix.jpg`). Existing App selection explicitly set the requested index to zero, and the navigation store had only two section locations.

Before upgrading, UI navigation set the two section locations to nonfirst questions: exploration 看过哪些朋友 round 5 and enlightenment 会变规则的分类机 round 5. The rebuilt app restored both from the old navigation data. Each newly visited group then retained its own stable question identity.

## Native acceptance

All interactions used CUA on `/Applications/小小思考屋.app` at the existing 1280×820 window; the screenshots are 2560×1640 Retina captures. AX text has only trailing whitespace normalized. `native-actions.json` records actual control actions; `native-assertions.json` contains 19 successful position assertions backed by AX snapshots.

| Requirement | Native / regression evidence | Result |
|---|---|---|
| R1 Per-group positions and no-op current selection | Exploration groups retain rounds 5 and 7; enlightenment groups retain rounds 5 and 7. Current group/theme reselect keeps round 7 and the enabled pending-answer button. `native-new-*-return.txt`, `native-enlightenment-*-return.txt`, `native-current-*-preserves-choice.txt`. | Pass |
| R2 Launch and navigation do not overwrite other groups | Switching themes restores 数一数 round 4 and 找规律火车 round 7. Quit/reopen restores 一眼看出来 round 11; other section/groups still restore their own rounds 5/7 afterward. `native-*-theme-restored.txt`, `native-after-restart.txt/jpg`, `native-*-after-restart.txt`, `native-group-resume.jpg`. | Pass |
| R3 Migration and historical facts | Native old section locations restore after installation (`native-before-install.txt`, `native-after-install.txt`, `native-enlightenment-migrated.txt`). Regression tests cover schema 1, old index/stable seeds, schema-2 round trips and unknown/corrupt/unavailable stores without changing completion keys. | Pass |
| R4 Stable IDs and safe fallback | Tests prove stale numeric indices are ignored, removed questions stay within their selected group, removed groups cannot cross sections, and unrelated saved group positions remain intact. | Pass |
| R5 Correct initial task and observation state | ProgressiveSetGame initializes from the requested round; the old first-round reset effect is removed. Native return and restart at timed round 11 both show readiness with submission disabled (`native-glance-return.txt`, `native-after-restart.txt/jpg`). | Pass |
| R6 Required checks and actual installation | 31 regressions, production build, zero-problem curriculum audit, successful mac:install, matching executable hashes and strict signature verification; native cases above completed. | Pass |

Explicit “从头来” was also tested: 找规律火车 moved to round 1 and retained that reset on return; 会变规则的分类机 remained at round 5. Re-navigation then set round 7 for the restart check. See `native-explicit-reset.txt`, `native-other-after-reset.txt` and `native-reset-group-return.txt`.

No correct answers, hint/reveal events or progress-clear actions were submitted. Existing completion totals started and ended at **273/489 enlightenment** and **74/621 exploration**. The original entry views—会变规则的分类机 round 1 and 看过哪些朋友 round 1, with exploration active—were restored after QA. Navigation records for other QA-visited groups reflect those actual visits; completion and practice history were not modified.

## Package and automated evidence

- `tests.log`: 31 passing navigation, enlightenment, activity-progress and speech-navigation regressions. Four newly added behavior tests failed against the old implementation before correction.
- `curriculum-audit.log`: 115 groups / 1110 rounds, zero problems.
- `mac-install.log`: production TypeScript/Vite build, native bundle, local signing and Applications installation pass.
- `mac-integrity.txt`: built/installed SHA-256 both `89e234aedee1e841d857df393a1db10d9180b615ccdf4cd7397296cb88cc2978`; deep strict signature check passes. No public notarization claim.
- The unchanged local voice manifest has 4043 entries, Edge zh-CN-XiaoxiaoNeural, zero failures, no macOS say or mixed-local fallback. No voice export/regeneration is needed because no spoken text changed.

The new flow was checked in the real native app; no browser-only pass is substituted for native evidence. Unknown historical per-group positions that old versions never stored cannot be reconstructed from completed-question counts. Such groups start at their first question until visited.
