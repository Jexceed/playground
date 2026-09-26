# TODO

Track follow-up work here when it is not part of the current spec. Keep items
small enough to turn into a Spec Kit feature.

## P0

- Complete final native checks for 035/036/037/038 after Mac unlock, then push the dev checkpoints. Start with the new N02 count comparison, N05 tens/ones and N14 clock layout, including hints/completion. Also verify P01 action/connection preservation, A05 listening, E04/L07/P06 references, G17 directions, L06 planting/fruit frames and E03 viewing. The standard app is installed and browser/static checks pass; native acceptance is still pending.

- Observe 6-, 7- and 8-year-old parent-child play and calibrate reading, interaction and reasoning load for the 597 newly authored activities. Technical QA is not age validation.
- Finish the historical-release migration/backup/ambiguity handling and finer support-history/next-practice guidance still unchecked in specs/029-curriculum-benchmark/tasks.md. Current legacy content and facts are preserved; do not infer mastery from completion.
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

- Complete the remaining 029 T120–T126 using the detailed gaps in specs/032-exploration-quality-audit/family-coverage.json: quantity/relative-position grids and missing math/logic/graphic/memory/language/physical-task branches. Preserve valid existing basics and stable progress; do not replace a missing operation with a non-equivalent single-choice question.
- Close the original-task mapping chain and remaining source reading/listening boundaries (T127). The confirmed eight missing branches and nine partial groups are a lower bound, not an exhaustive missing-task count.
- Calibrate the new design-load descriptors from real parent-child observations (T112). The 71 explicit profiles are engineering estimates, not an age or mastery score.
- Perform real acoustic review of all distinct local voice lines by locale, especially English and Chinese numbers/polyphonic words/long instructions (T129). Media integrity and playback completion are not pronunciation or prosody checks.
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
- Review remaining non-侦探 and non-规律火车 `VisualToken` fallbacks such as
  abstract symbols, action phrases, and location phrases, and decide which need
  raster assets.
- Add deeper automated browser smoke checks for persisted navigation state after
  the first manual coverage in `016-visual-choice-session-memory`.
- Add an automated all-48-round 图形工坊 screenshot review that checks stem-option
  spatial relationships, black silhouette rendering, and local Edge voice
  coverage beyond the current representative smoke checks.
- Run a broader logic-house completion review after the audited clusters
  `logic-pattern-train`, `logic-sorter-switch`,
  `logic-same-kind-detective`, `logic-visual-match`,
  `logic-difference-detective`, `logic-block-height-map`,
  `logic-three-view-blocks`, `logic-route-steps`, `logic-address-map`,
  `logic-matrix-puzzle`, `logic-position-map`, `logic-memory-camera`, and
  `logic-order-plan`; include a visual-surface pass like
  `015-map-visual-surface-quality`, and add targeted audits for any remaining cluster whose
  picture, text, audio, option quality, or parent explanation is still weak.

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
