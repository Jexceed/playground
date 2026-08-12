# Changelog

All meaningful project changes should be recorded here. Keep entries factual and
grouped by date.

## 2026-08-12

- Added the Cocos Creator 3.8 LTS `doyingame/` project for the approved Douyin
  Mini Game AppID `tta51dd3a03b67523202`, scoped exclusively to 数字岛.
- Added a deterministic curriculum exporter and auditable runtime snapshot for
  all 8 Math Island games, 122 official rounds, 19 referenced images, and 338
  referenced local voice clips; the initial unoptimized asset closure was
  15.48 MB and had
  zero logic-house, graphic-workshop, or source-image references.
- Implemented the portrait parent-child game shell, visual-group/scene/clock
  renderers, local voice playback, guarded answer flow, parent prompts,
  versioned local progress recovery, safe-area layout, lifecycle audio handling,
  and Douyin sidebar bridge.
- Added Cocos 3.8 type checking, source-parity/runtime/progress/parent-content
  tests, build-template compatibility tests, three-viewport static checks,
  package/AppID/module-cropping audits, and documented the Cocos/Douyin IDE
  release gates.
- Added stable Cocos asset metadata and a cold-import build extension so a fresh
  Creator 3.8.8 project cannot silently produce an empty package. The official
  ByteDance build now verifies the launch scene, AppID, early `tt.onShow`, 338
  voice clips, 19 PNGs, and a 12.00 MB / 761-file output before succeeding.
- Added deterministic Douyin-only media optimization: 1200×675 paletted PNGs
  preserve scene evidence, while copied voices use validated 32 kbps mono MP3.
  This reduced the exact runtime closure from 15.48 MB to 9.56 MB without
  changing the curriculum digest and brings the non-subpackage build below the
  current 16 MB developer-tool limit.

## 2026-07-19

- Prepared a public GitHub Pages Web Beta as the first market-release channel,
  including subpath-safe images and audio, a verified deployment workflow, a
  hosted privacy notice, and a public product README while preserving existing
  root-path NAS and Tauri builds.
- Withdrew the automatic free Web Beta before remote publication and replaced
  it with a revenue-first iPad launch plan: one starter game per world, a
  parent-gated ¥68-equivalent lifetime unlock, App Store payment and restore,
  paid-family success metrics, and explicit China storefront compliance gates.

## 2026-07-18

- Removed the redundant pattern-board scene from all six 图形补一补 rounds so
  the 3x3 matrix is the only evidence surface, reducing the 1280x720 document
  height from 989px to 720px; aligned the sticky world navigation height with
  the app shell inset and added curriculum audit coverage for the invariant.
- Replaced all 找规律火车 evidence and choice tokens with a coherent
  image-gen-derived local PNG set, including registered color, sky, snack, and
  size-family cards with retained source and derivation documentation.
- Rebuilt the large/medium/small circle family from one purple source token on
  identical 256x256 canvases at 196/124/64-pixel occupied sizes, and removed the
  small circle's compact-card exception so size remains the only visual change.
- Added MP3 frame and text-aware duration validation to the Edge cache,
  generation retry path, standalone voice audit, and curriculum audit.
  Regenerated six truncated or implausibly short Xiaoxiao files; all 1,801
  active manifest entries now pass media validation with zero failures and
  zero orphan files.
- Corrected live desktop pre-release uploads after GitHub filename
  normalization prevented reliable verification of Chinese asset names. Draft
  retries now refresh release evidence, clear existing assets by ID, upload
  stable ASCII download filenames with Chinese display labels, and publish only
  when exactly the Mac ARM64 and Windows x64 installers are present.

## 2026-07-17

- Limited the right-side 成长记录 panel to 12 visible ability tags and added a
  compact hidden-count marker so long progress histories no longer stretch the
  side panel while preserving all saved progress data.
- Added a test-covered Tauri desktop release workflow that validates one source
  version/tag, builds Apple Silicon DMG and Windows x64 NSIS packages on native
  GitHub runners, keeps partial failures as drafts, and publishes only after
  both clearly named assets exist.
- Added explicit Mac ARM64 and Windows x64 local build commands, release
  metadata validation across `package.json`, Tauri, and Cargo, test-signing
  warnings, safe draft retry behavior, and cross-platform release operating
  documentation.
- Corrected Tauri release asset patterns so extension placeholders do not add a
  duplicate dot, then separated native builds from release uploads so draft
  retries use GitHub CLI `--clobber`.

## 2026-07-12

- Added deterministic per-game, per-choice-count answer placement so correct
  positions are evenly distributed without runtime randomness; graphic choices
  and their drawn A/B/C/D options now move together.
- Expanded the curriculum audit to reject answer-position bias, repeated answer
  positions, graphic choice/drawing misalignment, known answer-leaking wording,
  proximity-as-proof evidence reasoning, minute-hand-first clock guidance,
  nonstandard release voices, and unreferenced runtime voice files.
- Reworked bridge and rotation instructions so they guide comparison without
  stating the answer, and changed spilled-water tasks to inspect direct traces
  around the event instead of treating the nearest character as responsible.
- Changed 时钟小管家 prompts, feedback, retry guidance, parent prompts,
  difficulty notes, visible hints, and accessible clock descriptions to inspect
  时针（短针） before 分针（长针）.
- Regenerated the curriculum voice pack as 1,801/1,801 Edge
  `zh-CN-XiaoxiaoNeural` entries with zero failures, and regenerated the
  dedicated launch sound from the same voice family.
- Added a tested dry-run/write-mode voice pruning workflow and removed 830
  manifest-unreferenced Edge/macOS files; the runtime voice directory now
  contains exactly the 1,801 files referenced by the active manifest.
- Added Spec Kit feature `022-curriculum-integrity` with the audit contract,
  voice policy, implementation tasks, and end-to-end verification guide.

## 2026-07-09

- Corrected 时钟小管家 wording so 分针 is identified as the long hand and
  时针 as the short hand, and changed clock labels, choices, feedback, parent
  prompts, and local voice lines to use numeric `HH:MM` forms instead of
  `点`/`点半` wording.
- Reworked 时钟小管家生活场景题 from choosing 上午/下午/晚上 labels into
  12-hour analog clock to 24-hour electronic clock conversion, removed
  pre-answer day-part label leakage, and changed the scene-clock layout so the
  generated scene appears above the deterministic clock instead of being
  squeezed beside it.
- Removed the redundant 图形工坊 stem helper `在下面选 A、B、C、D` and added
  curriculum audit coverage so option-selection guidance does not appear as
  extra problem text.
- Added image-gen 1200x675 local scene PNGs and source copies for the four
  时钟小管家 daily-routine rounds, registered them in `imageGallery.scenes`,
  and tightened audit/layout coverage so context rounds are visual while
  read-time rounds stay clock-only.
- Centered 时钟小管家 read-time clock boards and redrew clock ticks/hands with
  explicit endpoint geometry so the analog face renders as a complete,
  readable clock whose hands match the prompt.
- Reworked 图形工坊的透明叠叠板题面 so each round first shows a separate
  non-answer overlap example, then shows only the two figures the child must
  mentally overlap with `1 先放这张` and `2 盖上这张` action labels, preventing
  the stem from displaying the correct result while keeping the stacking order
  visible.
- Added the `021-clock-time` Spec Kit feature for a 数字岛 clock-reading game
  covering analog whole hours, half hours, and daily morning/afternoon/evening
  context.
- Added `时钟小管家` to 数字岛 with 12 rounds, a dedicated local analog clock
  surface, hand-position feedback, and parent prompts that ask children to
  explain long-hand, short-hand, and daily activity evidence.
- Expanded the curriculum audit to require the clock game, validate
  `clockChallenge` surfaces, enforce whole-hour/half-hour/time-conversion
  coverage, and reject weak clock or conversion evidence.
- Exported the updated 1800-line voice script and regenerated the standard Edge
  Xiaoxiao local voice manifest with the new clock lines.

## 2026-07-08

- Fixed round speech control so new speech requests invalidate stale pending
  voice loads, explicit question navigation stops the previous line immediately,
  and clicked question/game changes request the target round prompt directly.
- Changed 图形工坊 answer interactions so pre-answer option clicks and aria
  labels only expose A/B/C/D instead of answer-revealing figure names or layer
  relations, removed graphic option labels from the local voice manifest, and
  gave graphic answer choices a four-column desktop grid so all four options fit
  on one row.
- Re-audited 图形工坊 from the player view: shadow choices now render as real
  black silhouettes, multi-figure stems render in one shared SVG for overlap and
  code-machine relationships, code-machine questions use a visible `?` answer
  slot, layer-overlap choice labels describe the drawn option instead of the
  distractor rationale, with post-answer feedback carrying the explanatory
  evidence instead of pre-answer option speech.
- Slowed the launch brand-shout audio from about 1.0 seconds to about 1.4
  seconds and extended the splash timing so the line has room to finish before
  entering the app.
- Replaced the launch splash's ordinary `小小思考屋` TTS line with a dedicated
  local brand-shout audio asset, keeping the desired child-chorus direction as
  a future higher-quality source replacement instead of shipping a synthetic
  layered voice that sounds unnatural.
- Promoted voice generation, image-generation asset handling, NAS static
  packaging, and Mac `.app` preview rules into `AGENTS.md` as system-level
  project guidance for future agents.

## 2026-07-07

- Reworked 谁和谁一对 rounds so the prompt and visual evidence no longer
  repeat answer choices, decorative scene images are removed, and relation
  cards use normal-width frames instead of the narrow visual-group grid.
- Regenerated the local voice manifest with standard Edge Xiaoxiao audio for
  all 1748 exported voice lines, removing macOS voice sources from 逻辑屋
  playback.
- Expanded the curriculum audit to catch 谁和谁一对 prompt/visual answer leakage,
  missing relation-card layout, decorative scenes in relation rounds, and
  nonstandard 逻辑屋 voice sources.
- Added image-gen PNG item icons for 葡萄、公交车、自行车、飞机、尺子 and
  积木塔, registered them in `imageGallery`, and wired `VisualToken` so
  同类小侦探 and 找不同侦探 no longer fall back to SVG for those concrete
  objects.
- Fixed the left/right comparison layout used by 找不同侦探 so image cards keep
  normal-width bases on desktop and mobile instead of being squeezed into a
  five-column grid.
- Added a dedicated evidence-card layout for 拼图少哪块 and 天平换一换 so
  composite puzzle cards, balance rules, and left/right evidence cards keep
  normal-width bases on desktop and mobile.
- Reworked 拼图少哪块 round data so 完整图 is shown as separate comparable
  pieces, missing-piece choices use already-present pieces as plausible
  distractors, and answer labels are child-readable text with visual cues.
- Reworked 天平换一换 count choices from repeated combined emoji tokens into
  count labels such as `2 个草莓`, preventing mixed-size answer graphics.
- Expanded the curriculum audit to catch concrete same-kind/difference items
  that have a token mapping but no project raster icon, and to require a
  dedicated left/right comparison group layout.
- Expanded the curriculum audit to require the part-whole and balance evidence
  layout so those rounds cannot silently fall back to the narrow five-column
  visual-group grid.
- Expanded the curriculum audit to reject combined 完整图 tokens in 拼图少哪块
  and repeated visual-token answer choices in 天平换一换.
- Reworked the left sidebar world switcher so only the selected world expands
  with summary details while inactive worlds collapse into compact rows,
  leaving more vertical room for the level list.
- Added a focused Node test that guards the sidebar world switcher
  expanded/collapsed states and compact collapsed styling.
- Added the `020-graphic-workshop` Spec Kit feature for a new 图形工坊 content
  world and compact existing-world reinforcement policy.
- Added 图形工坊 as a third selectable world and expanded its first-pass content
  into six real drawn visual-reasoning games with 48 rounds: 影子配对,
  遮挡还原, 局部找整体, 透明叠叠板, 图形密码机, and 缺口补一补.
- Added dedicated `graphicChallenge` round data and SVG rendering so 图形工坊
  stems and A/B/C/D answer choices are actual drawn figures rather than abstract
  text or generic token labels.
- Replaced the crude 图形工坊 geometric placeholder art with local image-gen
  sticker assets registered in `imageGallery.items`, while keeping silhouettes,
  遮挡, 叠合, 密码表, and 缺口 masks dynamically composable.
- Added three differentiated number-pattern reinforcement rounds to 逻辑屋,
  covering skip-counting before/after, descending even-number patterns, and a
  missing middle step.
- Expanded the curriculum audit with checks for the `graphic` world, exactly
  six first-pass graphic games, eight rounds per game, dedicated graphic
  challenge surfaces, drawn answer options, visual-operation feedback, and
  compact reference-reinforcement markers.
- Tightened the 图形工坊 audit so first-pass graphic rounds reject duplicated
  logic-house families and avoid scene, visual-group, grid, matrix, sequence,
  and memory surfaces already owned by other worlds.
- Exported updated voice lines and generated missing local macOS voice entries
  for the new 图形工坊 and reinforcement content.
- Added `docs/graphic-workshop-reference-analysis.md` to record the source
  corpus taxonomy, distractor rules, and future migration question.
- Documented the Mac development preview rule: generate a real Tauri `.app`
  with `pnpm mac:build` and test through that bundle instead of relying only on
  browser/Vite preview.

## 2026-07-06

- Added the `019-app-launch-branding` Spec Kit feature for Mac app logo
  resources, a branded launch splash, and the local "小小思考屋" entry voice.
- Added audit coverage that fails if the app launch splash, launch voice line,
  or Tauri icon configuration is removed.
- Replaced the wide-logo app icon with a high-contrast square icon, refreshed
  Mac installation to clear stale app bundles, and made the launch animation
  auto-enter the game page after a richer opening sequence.
- Rebuilt the Mac app icon from a direct crop of the in-app brand house logo so
  Dock and Launchpad match the internal brand while reading clearly at small
  sizes.
- Added the `018-installable-packages` Spec Kit feature for NAS-first static
  packaging, Docker fallback, and Mac/Tauri installation.
- Added a tested `pnpm release:nas` workflow that turns the Vite production
  build into a copyable `release/nas-static/` package with a `content/`
  boundary, release manifest, and uploadable NAS zip archive.
- Added deployment documentation that treats ZSpace NAS native static hosting as
  the preferred path and Docker/Compose as fallback only.
- Added Tauri 2 configuration, generated app icons, and scripts for building
  the same frontend as a macOS `.app` bundle, with DMG packaging left as an
  optional command.
- Added the `017-memory-camera-visual-surface` Spec Kit feature for flattening
  `记忆小相机` memory slots.
- Expanded the curriculum audit with a source check that prevents `MemoryBoard`
  from nesting full visual-card tokens inside memory slots.
- Reworked memory-camera slots so visible and covered cards use flat
  icon-and-label tokens while preserving tap-to-hear behavior.
- Added the `016-visual-choice-session-memory` Spec Kit feature for visual-match
  choices, matrix-cell visual density, and last-opened-location restoration.
- Expanded the curriculum audit with source checks that prevent duplicated
  visual-card choice labels, nested matrix-cell visual cards, and missing
  last-location storage integration.
- Reworked exact visual-match answer buttons so visual-card choices render as
  compact cards without repeated raw symbol text, while position choices remain
  readable.
- Reworked matrix puzzle cells to use flat icon-and-label tokens instead of
  full cards nested inside matrix cells.
- Added separate local storage for the last opened world, game, and round so
  reopening the app restores the previous browsing position.
- Added the `015-map-visual-surface-quality` Spec Kit feature for spatial
  visual-surface clarity in address-map, position-map, and route-step rounds.
- Expanded the curriculum audit with checks that reject spatial rounds combining
  a grid or inside/outside group with a positional scene image.
- Added an audit check that prevents `AddressGrid` from nesting full visual-card
  tokens inside map cells.
- Removed conflicting scene images from affected address-map, position-map, and
  route-step rounds so each task has one authoritative spatial surface.
- Reworked map grid cells to use flat icon-and-label tokens with click-to-speak
  behavior instead of card frames inside card-like cells.

## 2026-07-05

- Added the `012-memory-camera-quality` Spec Kit feature for appeared-item,
  absent-item, and left-to-right order memory quality.
- Expanded the curriculum audit with memory-camera checks that normalize emoji
  cards to child-facing labels, validate appeared and absent answers, and derive
  order answers from the remembered sequence.
- Reworked `logic-memory-camera` success feedback, retry guidance, and parent
  prompts so each round names the remembered cards, answer, and recognition,
  exclusion, or sequence reasoning.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten memory-camera content.
- Added the `013-order-plan-quality` Spec Kit feature for missing-step sequence
  planning quality.
- Expanded the curriculum audit with order-plan checks that validate a single
  missing sequence slot, unique answer choice, and filled-sequence explanation
  text.
- Reworked `logic-order-plan` success feedback, retry guidance, and parent
  prompts so each round names the completed flow, the missing answer, and a
  left-to-right replay strategy.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten order-plan content.
- Added the `014-pattern-train-quality` Spec Kit feature for repeat-unit,
  missing-card, and choice-quality pattern reasoning.
- Expanded the curriculum audit with pattern-train checks that validate a single
  missing card, repeat-unit metadata, derived answers, at least three
  pattern-tied choices, and concrete feedback/retry/parent wording.
- Reworked `logic-pattern-train` choice generation, success feedback, retry
  guidance, and parent prompts so each round names the repeated unit, filled
  sequence, and answer.
- Exported updated voice lines and generated a mixed local voice manifest for
  the rewritten pattern-train content, preserving existing Edge entries and
  filling missing lines with the local macOS fallback when Edge DNS was blocked.

## 2026-07-04

- Added the `002-logic-house-quality` Spec Kit feature for stricter logic-house
  curriculum quality gates.
- Expanded the curriculum audit to check choice meaning, child-facing choice
  wording, sorter rule explainability, and logic difficulty-note quality.
- Reworked `logic-sorter-switch` prompts, feedback, retry guidance, and parent
  prompts so color/shape rules and two-condition mistakes are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten sorter content.
- Added the `003-same-kind-quality` Spec Kit feature for same-kind and
  odd-one-out logic quality.
- Expanded the curriculum audit with same-kind rule explanations, odd-one-out
  majority-group checks, and same-kind choice visual cue coverage.
- Reworked `logic-same-kind-detective` prompts, retries, success feedback, and
  parent prompts so category rules and odd-one-out reasons are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten same-kind content.
- Added the `004-visual-match-quality` Spec Kit feature for exact-match and
  odd-card visual comparison quality.
- Expanded the curriculum audit with visual-match checks for sample-card
  matching, close distractors, matching-pair structure, and feedback clarity.
- Reworked `logic-visual-match` instructions, success feedback, retry guidance,
  and parent prompts so every round explains left-to-right matches or the
  matching pair before the different card.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten visual-match content.
- Added the `005-difference-detective-quality` Spec Kit feature for changed,
  extra, and missing item comparison quality.
- Expanded the curriculum audit with difference-detective checks for left/right
  row structure, changed positions, shared-item matching, and feedback clarity.
- Reworked `logic-difference-detective` feedback, retry guidance, and parent
  prompts so changed-item, extra-item, and missing-item rounds explain the
  visible comparison evidence.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten difference-detective content.
- Added the `006-block-height-quality` Spec Kit feature for top-view block
  height map counting and comparison quality.
- Expanded the curriculum audit with block-height checks for visible sums, row
  totals, explicit compare labels, and left/right total explanations.
- Reworked `logic-block-height-map` success feedback, compare choices, retry
  guidance, and parent prompts so rows and left/right totals are explained
  before selecting a total or comparison.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten block-height content.
- Added the `007-three-view-quality` Spec Kit feature for top, front, and left
  view block reasoning quality.
- Expanded the curriculum audit with three-view checks for top-view non-zero
  counts, front-view column maximums, left-view row maximums, active-view
  guidance, and side-view choice sequence length.
- Reworked `logic-three-view-blocks` success feedback, retry guidance, parent
  prompts, and side-view distractors so each round explains the active viewpoint
  and uses one height per visible column or row.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten three-view content.
- Added the `008-route-steps-quality` Spec Kit feature for one-step and two-step
  route reasoning quality.
- Expanded the curriculum audit with route-step checks that compute destinations
  from visible grids, validate ordered moves, and require start/intermediate/final
  explanation text.
- Reworked `logic-route-steps` success feedback, retry guidance, and parent
  prompts so each round names the start item, direction moves, first landing
  spot, and final destination.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten route-step content.
- Added the `009-address-map-quality` Spec Kit feature for row-column address
  map reasoning quality.
- Expanded the curriculum audit with address-map checks that compute hidden
  objects from addresses, compute addresses from target objects, and require
  row-column explanation text.
- Reworked `logic-address-map` success feedback, retry guidance, and parent
  prompts so each round names the row, column, crossing cell, object, and final
  address where relevant.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten address-map content.
- Added the `010-matrix-puzzle-quality` Spec Kit feature for matrix row-rule
  reasoning quality.
- Expanded the curriculum audit with matrix-puzzle checks that derive missing
  cells from visible row rules and require example-row explanation text.
- Reworked `logic-matrix-puzzle` prompts, success feedback, retry guidance, and
  parent prompts so each round names a complete example row, the missing row,
  and the final answer.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten matrix-puzzle content.
- Added the `011-position-map-quality` Spec Kit feature for spatial position,
  inside/outside, and viewpoint-relative direction quality.
- Expanded the curriculum audit with position-map checks that compute neighbor
  items from visible grids, validate inside/outside group membership, and derive
  relative directions from the named source item.
- Reworked `logic-position-map` success feedback, retry guidance, and parent
  prompts so each round names the reference item, direction or group contrast,
  answer, and child-pointing explanation.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten position-map content.
- Initialized GitHub Spec Kit with Codex skills integration.
- Established the project constitution in `.specify/memory/constitution.md`.
- Expanded `AGENTS.md` with project overview, source-of-truth rules,
  Spec-Driven Development workflow, asset taxonomy, and documentation hygiene.
- Moved historical Obsidian notes under `docs/archive/`.
- Renamed image asset category `avatars` to `characters` to separate reusable
  roles from non-character items.
- Added `docs/assets.md` as the source of truth for image and audio asset rules.
- Added this changelog and `docs/TODO.md` for ongoing project maintenance.
