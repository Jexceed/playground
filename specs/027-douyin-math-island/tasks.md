# Tasks: 抖音小游戏数字岛首发版

**Input**: `specs/027-douyin-math-island/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Phase 1: Setup

**Purpose**: 建立可被 Cocos Creator 3.8 LTS 打开的独立小游戏工程和仓库脚本入口。

- [x] T001 Create the Cocos Creator project skeleton and metadata in `doyingame/package.json`, `doyingame/tsconfig.json`, `doyingame/settings/`, and `doyingame/profiles/`
- [x] T002 Configure Douyin portrait build defaults and AppID `tta51dd3a03b67523202` in `doyingame/profiles/v2/packages/builder.json`
- [x] T003 [P] Add generated/cache/build exclusions and generated-resource policy to `.gitignore` and `doyingame/assets/resources/math-island/README.md`
- [x] T004 [P] Add export, test, audit, and Cocos build script entries to `package.json`

---

## Phase 2: Foundational

**Purpose**: 建立所有用户故事共享的课程快照、资源闭包、类型和平台边界。

**⚠️ CRITICAL**: 本阶段完成前不能实现用户故事 UI。

- [x] T005 Implement deterministic math-only catalog extraction from `src/data/games.ts` in `scripts/export-douyin-math-island.mjs`
- [x] T006 Implement image/audio dependency collection, copy, hashes, and runtime manifest generation in `scripts/export-douyin-math-island.mjs`
- [x] T007 [P] Add catalog and asset audit coverage in `scripts/audit-douyin-minigame.mjs`
- [x] T008 [P] Add export contract and source parity tests in `scripts/douyin-math-export.test.mjs`
- [x] T009 [P] Define runtime catalog, round, asset, and UI state types in `doyingame/assets/scripts/models/MathIslandModels.ts`
- [x] T010 [P] Implement catalog loading and validation in `doyingame/assets/scripts/services/CatalogService.ts`
- [x] T011 [P] Implement the `PlatformAdapter` contract and local preview adapter in `doyingame/assets/scripts/services/PlatformAdapter.ts`
- [x] T012 Implement the Douyin `tt` adapter, safe-area/lifecycle/sidebar bridge in `doyingame/assets/scripts/services/DouyinPlatformAdapter.ts`
- [x] T013 Register earliest `tt.onShow` caching and platform bootstrap in `doyingame/build-templates/bytedance-mini-game/game.ejs`
- [x] T014 Run the exporter and verify generated catalog/manifests under `doyingame/assets/resources/math-island/`

**Checkpoint**: 8 个游戏、122 题与精确资产闭包可独立生成和审计。

---

## Phase 3: User Story 1 - 亲子进入数字岛并选择游戏 (Priority: P1) 🎯 MVP

**Goal**: 用户打开后只看到数字岛，可在三次点击内进入八个游戏的任意第一题。

**Independent Test**: 运行 Web Mobile 预览，核对品牌首页只显示八个数字游戏；逐个点击均进入对应第一题，逻辑屋和图形工坊入口为零。

- [x] T015 [P] [US1] Create reusable low-age touch button, card, typography, and safe-area components in `doyingame/assets/scripts/ui/UiFactory.ts`
- [x] T016 [P] [US1] Create brand/header and game-card presentation components in `doyingame/assets/scripts/ui/HomeView.ts`
- [x] T017 [US1] Implement home catalog population, game selection, and continue entry in `doyingame/assets/scripts/AppController.ts`
- [x] T018 [US1] Create and wire the portrait root scene in `doyingame/assets/scenes/Main.scene`
- [x] T019 [US1] Add home-only snapshot/manual viewport checks to `scripts/douyin-minigame-ui-check.mjs` and `specs/027-douyin-math-island/quickstart.md`

**Checkpoint**: 首页作为独立 MVP 可浏览并进入任一游戏。

---

## Phase 4: User Story 2 - 孩子完成一轮数字思维练习 (Priority: P1)

**Goal**: 八个游戏的 122 题均可完成看图、听题、选择、判断、重试、解释、下一题和完成流程。

**Independent Test**: 每个游戏抽查首/中/末题，完整跑错误→重试→正确→下一题；所有题自动验证 answer 命中 choice、视觉类型受支持和语音存在。

- [x] T020 [P] [US2] Implement counting/subitize visual-group renderer in `doyingame/assets/scripts/renderers/VisualGroupRenderer.ts`
- [x] T021 [P] [US2] Implement registered scene-image renderer and failure placeholder in `doyingame/assets/scripts/renderers/SceneImageRenderer.ts`
- [x] T022 [P] [US2] Implement analog clock and 24-hour activity renderer in `doyingame/assets/scripts/renderers/ClockRenderer.ts`
- [x] T023 [P] [US2] Implement local clip lookup, single-active playback, and fallback controls in `doyingame/assets/scripts/services/VoiceService.ts`
- [x] T024 [US2] Implement question header, choices, feedback, controls, and parent prompt layout in `doyingame/assets/scripts/ui/GameView.ts`
- [x] T025 [US2] Implement the guarded answer/check/retry/next/complete state machine in `doyingame/assets/scripts/controllers/RoundController.ts`
- [x] T026 [US2] Integrate renderers, voice, state machine, restart, and return navigation in `doyingame/assets/scripts/AppController.ts`
- [x] T027 [P] [US2] Add exhaustive round-surface and answer validation tests in `scripts/douyin-math-runtime.test.mjs`
- [x] T028 [US2] Verify all 122 rounds pass generated-runtime and voice/asset audit via `pnpm test:douyin-minigame` and `pnpm audit:douyin-minigame`

**Checkpoint**: 数字岛完整课程闭环可玩，不只是题目浏览器。

---

## Phase 5: User Story 3 - 下次继续上次进度 (Priority: P2)

**Goal**: 完成状态和最近位置可靠恢复，损坏存档安全回退。

**Independent Test**: 完成若干题后重启恢复位置；注入空值、错误 JSON、未知版本、越界题号后均正常回到有效空进度。

- [x] T029 [P] [US3] Implement validated `ProgressV1` normalization and mutations in `doyingame/assets/scripts/models/Progress.ts`
- [x] T030 [US3] Implement storage read/write and recovery in `doyingame/assets/scripts/services/ProgressService.ts`
- [x] T031 [US3] Integrate round/game completion and last-location restore in `doyingame/assets/scripts/AppController.ts`
- [x] T032 [P] [US3] Add missing/corrupt/unknown/legacy/valid storage tests in `scripts/douyin-progress.test.mjs`

**Checkpoint**: 多次家庭共玩不会丢失或卡死在坏存档。

---

## Phase 6: User Story 4 - 家长检查学习目标与追问提示 (Priority: P2)

**Goal**: 家长可以了解学习目标，并在答题后用题目对应提示追问孩子的理由。

**Independent Test**: 八个游戏目标可查看；每个抽查题正确反馈后都有可读家长追问，不被儿童主要按钮遮挡。

- [x] T033 [P] [US4] Implement parent-info sheet for game goals and privacy/age information in `doyingame/assets/scripts/ui/ParentInfoView.ts`
- [x] T034 [US4] Show round-specific parent prompts after feedback in `doyingame/assets/scripts/ui/GameView.ts`
- [x] T035 [US4] Integrate parent-info access and adult-facing sidebar education in `doyingame/assets/scripts/AppController.ts`
- [x] T036 [P] [US4] Add parent-prompt completeness and no-score-pressure checks in `scripts/douyin-parent-content.test.mjs`

**Checkpoint**: 首发版保留亲子解释价值而非退化成纯选择题。

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 完成平台包、性能、文档和全项目回归门禁。

- [x] T037 Implement responsive safe-area layout and background/resume audio handling across `doyingame/assets/scripts/AppController.ts` and `doyingame/assets/scripts/ui/`
- [x] T038 [P] Add package size, forbidden-resource, hash, and AppID checks to `scripts/audit-douyin-minigame.mjs`
- [x] T039 [P] Document Cocos build, Douyin IDE import, sidebar Mock, device matrix, and submission boundary in `docs/douyin-minigame.md`
- [x] T040 [P] Document generated runtime assets and source-of-truth rules in `docs/assets.md`
- [x] T041 [P] Record completed work and remaining external gates in `docs/CHANGELOG.md` and `docs/TODO.md`
- [x] T042 Run `pnpm export:douyin-math`, `pnpm test:douyin-minigame`, and `pnpm audit:douyin-minigame`
- [x] T043 Run `pnpm build`, `pnpm audit:curriculum`, and `pnpm audit:voice-media`
- [ ] T044 Open in Cocos Creator 3.8 LTS, run three-viewport Web Mobile checks, and build `doyingame/build/bytedance-mini-game/`（官方冷启动构建已通过；三尺寸人工视觉检查待完成）
- [ ] T045 Import the package into Douyin DevTools, run simulator/sidebar/offline tests, and record results in `docs/douyin-minigame.md`
- [ ] T046 Run iOS and Android real-device preview across one full game plus clock sampling and record evidence in `docs/douyin-minigame.md`
- [x] T047 Run `pnpm mac:install` and report the installed local app result because shared project scripts/docs changed
- [x] T048 Run the completion audit against every FR/SC and update task checkboxes in `specs/027-douyin-math-island/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup** → **Foundational** → all user stories.
- **US1** establishes navigation and scene shell used by US2/US4.
- **US2** is the full play loop and must precede US3 completion integration.
- **US3** and **US4** can proceed after the relevant US1/US2 surfaces exist.
- **Polish** depends on all four stories.

### User Story Graph

```text
Setup → Foundation → US1 → US2 → US3
                         └────→ US4
US3 + US4 → Polish → Cocos build → Douyin IDE → real device
```

### Parallel Opportunities

- T003/T004 can proceed in parallel after T001.
- T007–T011 operate in distinct files once exporter contracts are fixed.
- US2 renderers and voice service T020–T023 can be implemented in parallel.
- US3 model tests and US4 parent-content tests touch independent files.
- Documentation T039–T041 can proceed alongside final automated audits.

## Implementation Strategy

1. First create a truthful generated catalog/asset foundation; do not hand-author course JSON.
2. Deliver US1 as a navigable branded shell.
3. Complete US2 for all eight games and 122 rounds before claiming a playable digital island.
4. Add persistence and parent surfaces without changing course answers.
5. Treat Cocos build, Douyin IDE, and real-device evidence as separate release gates; local source tests cannot substitute for them.

## Format Validation

- Total tasks: 48
- US1: 5 tasks
- US2: 9 tasks
- US3: 4 tasks
- US4: 4 tasks
- All tasks use checkbox + sequential ID; all user-story tasks include `[US#]`; every implementation/test task names an exact file path.
