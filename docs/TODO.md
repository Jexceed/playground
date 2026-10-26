# TODO

Track follow-up work here when it is not part of the current spec. Keep items
small enough to turn into a Spec Kit feature.

## P0

- Continue 059 from `specs/059-chapter-readability/reviews/chapter-ledger.json`: all 24 math groups/266 questions now have browser review; the other 91 groups still need full content/variant review. Per the user's 2026-10-26 corrections, prioritize the actual current Mac window and do not expand responsive layout work. Equivalent text roles in 启蒙/探索 now share sizes; keep them aligned rather than restoring the old exploration-only smaller overrides. Do not reintroduce a universal 18px minimum: auxiliary question numbers, counts and progress tags must retain the original hierarchy; remove small-print explanation layers and use concrete models/short task cues instead. Check completed markers and title/count alignment in addition to font size and overflow; those earlier measurements missed the sidebar regression. Preserve the full scope and existing younger-child activities.



- Complete the remaining native input checks for 035–039 beyond the targeted 043 acceptance. The corrective app's native startup and E03 default screenshot now confirm equal large images for different caption lengths and visible page controls. 043 adds targeted new-card, rule and direction checks; retain the separate remaining full selection/drag/four-card matrix and N02/N05/N14, P01, A05, E04/L07/P06 cases not expressly signed off there. Dev checkpoint synchronization is separate from this remaining acceptance coverage; browser input tests are not counted as native tests.

- Observe 6-, 7- and 8-year-old parent-child play and calibrate reading, interaction and reasoning load for the 597 newly authored activities. Technical QA is not age validation.
- Finish the historical-release migration/backup/ambiguity handling and finer support-history/next-practice guidance still unchecked in specs/029-curriculum-benchmark/tasks.md. Stable legacy identities and historical facts are preserved; 040 corrects enlightenment content and visuals. Do not infer mastery from completion.
- Keep authoring coverage, original-source review depth and child validation separate. The authored exploration bank now contains 75 groups / 621 activities across 71 families; the original 40 / 489 bank stays in 启蒙.

- Complete the exact Cocos Web Mobile manual pass at 667×375, 844×390, and
  932×430. The official Creator 3.8.8 landscape command build plus iPhone 15 Pro
  and Xiaomi 15 Douyin simulator passes are verified; re-run iPhone SE 2 and
  iPad in landscape before treating the full device matrix as complete.
- Confirm the performance-test report after scanning the generated QR code and
  completing at least three minutes of representative real-device play; retain
  the report or screenshot as release evidence.
- Confirm the platform-reported upload/package size for AppID
  `tta51dd3a03b67523202` before any test-version upload. Local and official Cocos
  checks currently report 12.01 MB under the stricter 16 MB project gate.
- Run one complete Math Island game plus representative clock rounds on iOS and
  Android real devices; save screenshots or video as submission evidence.
- Confirm the publishing subject's final age-rating text, privacy notice,
  software copyright/filing materials, icon, screenshots, and review copy
  before uploading a test or review version.

- Install full Xcode and the iOS platform toolchain; Command Line Tools alone
  cannot produce an iPad App Store build.
- Enroll the publishing individual or legal entity in the Apple Developer
  Program, accept the Paid Apps agreement, and create signing identities.
- Determine with the publishing entity whether Mainland China distribution
  requires an ICP filing and game approval number for this product. Do not
  enable the Mainland China storefront until the required status is confirmed.
- Implement one non-consumable full unlock behind a parental gate, Restore
  Purchases, and one complete free starter game in each world.
- Build and validate a real iPad package, sandbox purchase, TestFlight build,
  privacy label, screenshots, product page, and review notes.

## P1

- Resolve the two full-suite failures reproduced at the pre-checkpoint commit `014a56a3` on 2026-10-26: synchronize the Douyin Math Island export with the current source wording (`douyin-math-export.test.mjs`), and compare unique registered image paths in the 045 story-art coverage check (`order-story-completion.test.mjs`, the soil-pot image has two gallery aliases). The current 053–059 checkpoint passes 280/282 tests; these existing failures remain open.

- Observe parent-child play of 058's concrete word cards: whether the fixed tree/child reference conveys high/low, the kitten/table relation conveys up/down, and common picture scale supports length/count comparison. Retain the short spoken words and parent explanation; adult art review does not substitute for this observation.

- Observe parent-child play of 057's redrawn closure figures: whether the continuous contour and small endpoint marks make each local gap clear, especially the apple top and fish tail. Visual/geometric/native checks do not substitute for child-comprehension observation.

- Observe parent-child play of 056: whether one slot conveys one required bridge, a bridge being counted at both ends is understood, and excess red bridges prompt adjustment. Confirm that “刚好” is understood as a local bridge count while all islands must still connect.

- Observe parent-child play of 055: whether children distinguish fixed pieces, the one trial stone and checked independent positions, and understand that previewing a square is separate from selecting it. Keep this observation separate from verified geometric/scoring and input behavior.

- Observe children using 054's number-walk model: whether the jump diagram distinguishes one from two squares, paired footprints convey both friends moving each turn, and selecting a friend before placing it is understood. Keep the full nine-round engineering pass separate from child-comprehension validation.

- Include 053's action-first flip narration in the next parent-child observation: confirm children hear which card to flip on entry and can replay the ordered steps. Keep this child-understanding check distinct from local-audio playback and engineering validation.

- Observe parent-child play after the 052 art review, especially quantity-chip readability, the overhead facing figure, phonics references and pictured islands. Technical and adult visual checks do not establish child comprehension. Keep shared controls and navigation outside future picture-art styling changes.

- Observe parent-child play of the 050 interactions with 051’s illustrated rule-machine and flip-card boards: whether the pictured steps can be followed with minimal reading, whether “再摆一份” conveys doubling, and whether children can explain why two flips restore a card. Technical interaction checks do not establish child comprehension.

- Include 049's “下一题 / 下一组 / 再玩一遍” transitions in the next parent-child observation, especially whether a completed group clearly leads to the next group. Engineering regression and native checks are complete; child comprehension remains an observation task.

- Observe parent-child play of the 048 hands-on bridge group: selecting two endpoints, choosing a board then a gap, taking back a board, and distinguishing a complete route from enough total wood. Confirm the interaction needs no extra adult explanation; engineering/native acceptance is not child-comprehension validation.

- Observe parent-child play of the 045 order-plan story group and 046/047 Logic House visual corrections, including direct category groups, concrete river gaps and short spoken judgments, and calibrate the 2.4-second step pace. Reduced-motion behavior has code review coverage; repeat with the OS preference enabled on a suitable acceptance machine without changing a user's personal settings during routine QA.

- Observe parent-child play of the 043 corrections, especially two-condition distractors, word-picture support and the front/right-side viewing arrows. Automated correctness and adult UI checks do not establish reading or reasoning load for children.

- Complete the remaining 029 T120–T126 using the detailed gaps in specs/032-exploration-quality-audit/family-coverage.json: quantity/relative-position grids and missing math/logic/graphic/memory/language/physical-task branches. Preserve valid existing basics and stable progress; do not replace a missing operation with a non-equivalent single-choice question.
- Close the original-task mapping chain and remaining source reading/listening boundaries (T127). The confirmed eight missing branches and nine partial groups are a lower bound, not an exhaustive missing-task count.
- Calibrate the new design-load descriptors from real parent-child observations (T112). The 71 explicit profiles are engineering estimates, not an age or mastery score.
- Perform real acoustic review of all distinct local voice lines by locale, especially English and Chinese numbers/polyphonic words/long instructions (T129). Media integrity and playback completion are not pronunciation or prosody checks.
  Start with `042-row-pronunciation/verification/after-rows.mp3`, `after-letter.mp3`
  and `after-matrix.mp3`: row-context synthesis input and the installed pack are
  corrected, but human listening confirmation of these samples remains pending.
- Keep T130's other-device scope separate from the current Mac acceptance in 034; do not close its 375px/other-window checks from the Mac-size browser pass.

- Run at least five observed parent-child Math Island sessions; require four
  families to enter a game, complete a question, and find voice replay without
  developer instruction before treating the first release as product-validated.

- Run a paid-family pilot through the selected App Store storefronts. Count
  completed purchases and net proceeds, not free page visits, as the primary
  launch signal; keep direct play observation for product-quality feedback.
- Configure Apple Developer ID signing/notarization and Windows production code
  signing in protected GitHub environments; until both are verified, keep
  desktop packages marked as test pre-releases.
- Migrate the built-in TypeScript question bank to validated JSON content packs
  under `content/`, including schema validation, fallback behavior, and
  curriculum audit coverage.
- Review existing visual-spatial 逻辑屋 clusters in a separate Spec Kit feature
  before any migration; current 图形工坊 should stay focused on non-duplicative
  silhouette, occlusion, local-detail, layer-overlap, code-mapping, and
  visual-closure operations.
- Add any future 图形工坊 family only after it has dedicated drawn stems and drawn
  A/B/C/D answer choices, not abstract text labels or generic token cards.
- Convert future feature work to the full Spec Kit cycle: `spec.md`, `plan.md`,
  `tasks.md`, implementation, verification, changelog update.
- Add automated audit coverage for image source-file pairing where practical.
- Keep the 046 Logic House visual ledger as the baseline when reviewing remaining `VisualToken` fallbacks in other sections. Logic House actions, exact option pictures and task conditions are covered by 046; avoid treating every geometric symbol as a missing raster asset.
- Extend automated UI smoke coverage of persisted navigation from the service
  regressions and native group/section/relaunch checks in `041-group-resume`.
  The per-group resume feature itself is implemented and installed.
- Add an automated all-48-round 图形工坊 screenshot review that checks stem-option
  spatial relationships, black silhouette rendering, and local Edge voice
  coverage beyond the current representative smoke checks.


## P2

- Replace `public/audio/brand/launch-brand-shout.wav` with a real or
  high-quality AI-generated child chorus recording when an approved source is
  available; do not simulate chorus by stacking ordinary single-speaker TTS
  voices. Until then, keep the documented Xiaoxiao-derived brand asset aligned
  with the curriculum narrator family.
- Extend 时钟小管家 in a future Spec Kit slice only after play review confirms
  the first pass works; likely next steps are quarter hours, five-minute
  increments, and simple before/after time order, not elapsed-time arithmetic
  yet.
- Revisit archived Obsidian notes and extract any still-useful product decisions
  into maintained docs.
- Extend the new per-frame illustration usage audit to other asset families when they gain similar shared-sheet mappings; keep file existence and real-app display checks separate.
- Add screenshot-based smoke checks for representative desktop and mobile game
  layouts, including the collapsed world switcher, comparison-card groups, and
  evidence-card groups in the left sidebar/game surface; include answer-option
  semantics for visual-count, part-whole, and relation-pair rounds, round
  navigation speech start/stop behavior, plus voice-source consistency checks.
  图形补一补六轮已经完成 1280x720 和 375x812 人工基线验证，后续自动化时复用
  其单一矩阵视觉表面和无溢出断言。
- If richer illustrated maps are desired later, generate each map as the single
  answer surface from the same grid data instead of stacking a decorative scene
  above a separate answer grid.
