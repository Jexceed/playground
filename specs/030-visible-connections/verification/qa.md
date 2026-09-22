# Connection interaction QA — 2026-09-22

## Implemented

- All 33 matching activities show real endpoint-to-endpoint lines, with either-side click pairing, pointer drag, replacement, unlink and shared undo. Text cards display one readable label. Wrong pairs remain editable and do not reveal an answer before submission.
- All 9 bridge and 9 route activities can be operated on the map. Bridge counts draw one/two distinct lines, fixed bridges remain protected, and islands show current counts alongside the target. Road buttons stay on the road under hover, have keyboard access, and routes show location, step order and arrows.
- Parallel roads bend perpendicular to their endpoints and stay on the same lane when traversed backwards. The former diagonal offset could almost overlap a straight road. Visible buttons address thin SVG line hit areas; hit geometry remains distinct at narrow widths.
- L02 questions 7–9 now explicitly accept the two identical circles exchanging partners. Canonical answers still pass; wrong shapes and duplicated endpoints fail. No question IDs, revisions, counts or historical completion facts were reset.

## Verified

- 30/30 focused interaction, session/progress and exploration regression tests pass; see tests.txt. Includes all authored matching/bridge/route answers and alternate circle pairings.
- Production TypeScript/Vite build passes, including the final build inside mac-install.txt.
- Curriculum audit: 115 groups / 1110 rounds, zero problems. Original 启蒙 40/489 and 探索 75/621 totals remain unchanged.
- Voice export and incremental standard Edge generation completed: 3729/3729 entries, failures empty, voice-media audit zero problems; no macOS say or mixed local provider. Chinese Xiaoxiao, English Jenny retained.
- Browser desktop and 375×812: 2/3/4 pairs, crossing lines, right-first pairing, pointer drag, drop outside, Escape, Enter/Space, occupied-endpoint replacement, unlink/undo/clear, wrong-answer correction, equivalent circles, fixed bridge lower bounds, direct edge/node operation, double bridges, six-island mobile completion, distinct parallel roads, route undo, arrows/step order. Four-pair mobile surface has 4 actual paths, no broken images and no horizontal overflow (375px document width).
- Saved representative screenshots and browser-flows.json. Route question 9 was traversed through all six edges; its last-question completion uses a different footer, so a generic next-button probe returned false. Correctness of every authored route is separately covered by tests; do not treat that probe as a route failure or as independent UI grading evidence.
- pnpm mac:install completed after the final hover-alignment fix. Installed and built binary hashes match; codesign --verify --deep --strict passes. See installation.json.

## Remaining acceptance

Fresh native UI acceptance is pending. CUA could not obtain the new native window, and its app inventory explicitly reported that the Mac was locked. A manual-unlock request is pending. Installation success and browser tests do not substitute for this real-app check. No attempt was made to bypass the lock or to interrupt the user's existing in-progress app window.

No real touch-device or child-observation claim is made. Local dev only; no remote push.
