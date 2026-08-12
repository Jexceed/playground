# TODO

Track follow-up work here when it is not part of the current spec. Keep items
small enough to turn into a Spec Kit feature.

## P0

- Open `doyingame/` in Cocos Creator 3.8.8 and complete the human Web Mobile
  visual pass at 375×812, 390×844, and 430×932. The official
  `bytedance-mini-game` command build is already verified at 12.00 MB; this
  remaining item is visual review, not package generation.
- Install and sign in to Douyin DevTools, import the Cocos output, then verify
  simulator compile, sidebar Mock, offline relaunch, storage recovery, and the
  platform-reported package size for AppID `tta51dd3a03b67523202`.
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
- Consider a lightweight asset manifest report that lists registered but unused
  assets and files that exist but are not registered.
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
