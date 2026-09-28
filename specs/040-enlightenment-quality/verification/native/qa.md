# Native acceptance — 2026-09-28

App: `/Applications/小小思考屋.app`, freshly quit/reopened through CUA. Actual configured window: 1280×820; native Retina screenshots: 2560×1640. No browser substitutes or native-storage edits were used. `actions.json` and the corresponding AX snapshots record the interactions. AX text has trailing whitespace normalized for Git; UI wording and values are retained.

## Defect found and fixed

The installed bridge round 3 cut off the shortest plank and bottom instruction. The figure had a definite 330px height, but its implicit grid row kept the image's intrinsic minimum height. `object-fit: contain` alone did not constrain that overflowing image box.

The progressive scene figure now uses `minmax(0, 1fr)` rows/columns and the image has zero minimum dimensions. This retains the outer task layout and is scoped to enlightenment. Compare `bridge-round3-before.jpg` with `bridge-round3-after.jpg`; `bridge-correct.jpg` also shows the complete model and feedback within the window. `evidence-scene.jpg` and `clock-scene-9/11/12.jpg` check the other affected scene layouts.

The fix changed six CSS lines only. No content, answers, IDs, speech or exploration layout changed. `mac-install.log` includes the successful production build, bundle, signing and installation; `curriculum-audit.log` reports zero issues and `enlightenment-tests.log` has 14 passing regressions. The earlier 104-test and all-round browser evidence remains in the parent directory. Current executable SHA-256 is `19ee39d345b16040e76c333d9e9a52a2c12a2ca6595e0cf29c37bab496009fc2`; built and installed executables match and strict deep signature verification passes (`mac-integrity.txt`).

## Representative checks

| Case | Result and evidence |
|---|---|
| Timed glance, rounds 11–15 | Each waits for readiness and disables answer submission. Round 11 shows the pattern during observation, then hides all nine cells identically and enables choices. `glance-ready*.txt/jpg`, `glance-observing.txt/jpg`, `glance-hidden.txt/jpg`. |
| Review and interruption | A choice enables submission; “再看一眼” disables it again. Clicking “听题” during observation returns to readiness. `glance-selected.txt`, `glance-review.txt`, `glance-listen-interrupt.txt`. Native snapshots confirm the transition; the exact 2000ms duration is also covered by code/browser tests. |
| Memory camera | Conceal → choose → reopen clears the choice; concealing again keeps submit disabled until a fresh choice. Triangle ruler and straight ruler have distinct pictures. `memory-*.txt`, `memory-review.jpg`, `memory-ruler.jpg`. |
| Bridge model, retry and correct feedback | Rounds 3 and 8 show all materials and distances. Wrong answer receives the intended support/span explanation; correction succeeds. Frame, buttons and feedback fit. `bridge-round3-after.jpg`, `bridge-round8.jpg`, `bridge-retry.jpg`, `bridge-correct.jpg`. |
| Corrected action/state pictures | Door opening differs from a locked door, the planting start is a soil-only pot, tabletop rules show distinct shoulder/head gestures. `order-door.jpg`, `order-soil.jpg`, `color-rule.jpg`. |
| Clock | Round 1 has no answer caption; rounds 9/11/12 include the relevant activity in the instruction and retain complete scene/clock pictures. `clock-entry.jpg`, `clock-scene-*.jpg`. |
| Dense quantities and grids | Composition round 28, grouping round 12 and 4×4 address round 8 keep their task and controls visible. Matrix round 3 has visibly distinct large/small stars. Long auxiliary history stays in its own rail. `compose-dense.jpg`, `grouping-dense.jpg`, `address-dense.jpg`, `matrix-stars.jpg`. |
| Graphic families | Shadow round 1, occlusion round 3, detail round 6, layer round 7, code round 8 and closure round 8 were inspected in the native app. Framed opaque stacking, separated code pairs, real detail cropping and matching contour drawings render coherently. `shadow-entry.jpg`, `covered/detail/layer/code/closure-sample.jpg`. |
| Parent guidance | “本题追问” expands/collapses, with the correct round text and “听家长提示” control. `round-guidance-*.txt`, `round-guidance-open.jpg`. |
| Packaged local audio | “听懂再行动” moved from ready to playing and then to enabled response controls after audio ended, with no failure state. No answer was submitted. `local-audio-ready.txt`, `local-audio-playing.txt/jpg`, `local-audio-ended.txt/jpg`. The same package contains the standard Edge manifest; failures are empty and there is no macOS/mixed-local fallback. |
| Section return and restart | Enlightenment returned to closure round 8 after switching sections, and quit/reopen restored that exact round. Exploration independently returned to 图形推理盘 round 1. `enlightenment-section-resume.txt`, `before-final-restart.txt`, `after-final-restart.txt/jpg`, `exploration-after-restart.txt`. |

## History and handback

Completion totals started and ended at **273/489 enlightenment** and **21/621 exploration**. The only correct submission was an already-completed bridge round. One updated practice tag was added by that QA attempt (the condensed tag remainder increased from 96 to 97); completion records were neither erased nor inflated. This is preservation of existing facts, not byte-identical storage or evidence of a child's mastery.

The app was returned to its original enlightenment entry, **会变规则的分类机 round 1**. Exploration's original **图形推理盘 round 1** entry was also restored. See `initial-state.txt`, `restore-original-game.txt`, `restored-original-location.jpg` and `exploration-count-final.txt`.

## Boundaries

This is the representative native acceptance required by 040, alongside the full 489-round content/browser review. Native interaction was not repeated for every round; `../review.json` identifies the sampled families. Observed media completion confirms packaged playback, not human acoustic judgment of every line, pronunciation or prosody. Real parent-child difficulty calibration and separate exploration 035–039 follow-ups remain in the maintained TODO.
