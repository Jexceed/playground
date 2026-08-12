# Tasks: 抖音小游戏横屏同款体验

**Input**: Design documents from `/specs/028-douyin-landscape-parity/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/landscape-workbench.md, quickstart.md

**Tests**: 规格明确要求自动构建、课程审计、抖音专项测试和开发者工具视觉验收。

## Phase 1: Setup

- [x] T001 在 `specs/028-douyin-landscape-parity/spec.md` 固化横屏同款需求与验收标准
- [x] T002 [P] 在 `specs/028-douyin-landscape-parity/research.md` 记录平台横屏能力和本机视觉基准
- [x] T003 [P] 在 `specs/028-douyin-landscape-parity/contracts/landscape-workbench.md` 定义三栏 UI 契约与设备矩阵

---

## Phase 2: Foundational

- [x] T004 将 `doyingame/settings/v2/packages/project.json` 的设计分辨率改为 1280×720 横屏基准
- [x] T005 [P] 将 `doyingame/profiles/v2/packages/builder.json` 与 `doyingame/build-configs/bytedance-mini-game.json` 改为 landscape
- [x] T006 在 `doyingame/assets/scripts/ui/UiFactory.ts` 增加同款网格背景、描边卡片、状态按钮和三栏布局所需基础能力
- [x] T007 在 `doyingame/assets/scripts/AppController.ts` 调整横屏安全区计算、启动恢复与题号跳转动作

**Checkpoint**: 横屏源配置与工作台基础能力就绪。

---

## Phase 3: User Story 1 - 横屏进入同款游戏工作台 (Priority: P1) 🎯 MVP

**Goal**: 启动后直接呈现与本机版层级一致的横屏三栏可作答首屏。

**Independent Test**: 在开发者工具编译后首屏直接看到左侧游戏、中间题面、右侧题号/家长/成长信息。

- [x] T008 [US1] 重构 `doyingame/assets/scripts/ui/GameView.ts` 为安全区内的三栏横屏工作台
- [x] T009 [US1] 在 `doyingame/assets/scripts/ui/GameView.ts` 实现本机版同款背景、暖白卡片、金色当前态、蓝绿色线索板和横向选项
- [x] T010 [US1] 在 `doyingame/assets/scripts/AppController.ts` 取消启动欢迎页并恢复最近题目
- [x] T011 [US1] 调整 `doyingame/assets/scripts/ui/ParentInfoView.ts` 使辅助页可从横屏工作台进入并返回原题

**Checkpoint**: US1 可独立启动和视觉对照。

---

## Phase 4: User Story 2 - 在工作台内连续选关作答 (Priority: P2)

**Goal**: 在固定三栏内完成切游戏、跳题、听题、作答、反馈和下一题。

**Independent Test**: 不离开工作台完成整条交互链，并观察左/右导航状态同步。

- [x] T012 [US2] 在 `doyingame/assets/scripts/ui/GameView.ts` 实现八个游戏切换、每游戏完成进度与当前态
- [x] T013 [US2] 在 `doyingame/assets/scripts/ui/GameView.ts` 实现最多 18 个题号的当前/完成/未完成状态和跳转
- [x] T014 [US2] 在 `doyingame/assets/scripts/ui/GameView.ts` 整合选择、检查、错误重试、成功解释和下一题状态
- [x] T015 [US2] 在 `doyingame/assets/scripts/AppController.ts` 保持跳题/换游戏时停止语音、清空瞬时状态并持久化位置

**Checkpoint**: US2 全交互链可在统一界面独立验证。

---

## Phase 5: User Story 3 - 家长获得同屏陪玩信息 (Priority: P3)

**Goal**: 右侧持续呈现当前家长追问、成长标签和家长入口。

**Independent Test**: 任意题目右侧可见追问；答对后标签更新；打开说明再返回原题。

- [x] T016 [US3] 在 `doyingame/assets/scripts/ui/GameView.ts` 加入当前题家长追问、听提示按钮和家长说明入口
- [x] T017 [US3] 在 `doyingame/assets/scripts/ui/GameView.ts` 加入成长记录标签、溢出摘要和实时更新
- [x] T018 [US3] 在 `doyingame/assets/scripts/ui/GameView.ts` 保留平台支持时的侧边栏入口

**Checkpoint**: US3 家长共玩信息无需离开题面即可使用。

---

## Phase 6: Verification & Polish

- [x] T019 [P] 更新 `scripts/audit-douyin-minigame.mjs` 和相关测试，审计源配置、最终产物方向和横屏视口契约
- [x] T020 [P] 更新 `scripts/douyin-minigame-ui-check.mjs` 的横屏设备矩阵与编译完成判定
- [x] T021 运行 `pnpm test:douyin-minigame`、`pnpm audit:douyin-minigame`、`pnpm build:douyin-minigame`
- [x] T022 在抖音开发者工具重新编译并按 `specs/028-douyin-landscape-parity/contracts/landscape-workbench.md` 做截图对照
- [x] T023 运行 `pnpm test:douyin-minigame:devtools`、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`
- [x] T024 [P] 更新 `docs/douyin-minigame.md`、`docs/CHANGELOG.md`、`docs/TODO.md`
- [x] T025 按仓库规则运行 `pnpm mac:install`，确认本机里程碑应用仍可启动
- [x] T026 在 `dev` 建立描述性本地提交并确认工作树干净，不主动推送 `dev`

## Dependencies & Execution Order

- Phase 1 已完成，是本次实施输入。
- Phase 2 阻塞全部工作台故事。
- US1 先建立三栏结构；US2、US3 在该结构上依次接入交互和家长信息。
- 自动测试脚本可在 UI 实现后与文档并行准备，但正式构建与开发者工具验收必须使用最终代码。
- 最终提交依赖所有自动门禁、视觉验收和文档完成。

## Implementation Strategy

先完成可启动的横屏三栏 MVP，再接回全部导航/反馈和家长信息；每一步都复用既有题库、渲染器、进度服务和资产，不引入第二套内容。
