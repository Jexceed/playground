# Implementation Plan: 抖音小游戏横屏同款体验

**Branch**: `dev` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/028-douyin-landscape-parity/spec.md`

## Summary

把现有 Cocos 抖音小游戏从 750×1334 竖屏单列欢迎页改为 1280×720 横屏工作台，并让信息结构与本机 React 版一致：左侧品牌与八个数字岛游戏，中间当前题目、视觉线索和横向选项，右侧题号导航、家长追问和成长记录。启动时直接恢复最近游戏题目，不再经过异构首页；平台方向、Cocos 设计分辨率、构建审计、设备矩阵和开发者工具验证同步切换到横屏。

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2021；Cocos Creator 3.8.8 项目脚本

**Primary Dependencies**: Cocos Creator 3.8 LTS；抖音小游戏 `tt` API；现有 pnpm/Node 构建工具链

**Storage**: 继续使用抖音本地存储和既有 v1 进度结构，不迁移格式

**Testing**: Node 内置 test runner；课程与资源审计；Cocos 官方构建；抖音开发者工具自动化编译和视觉截图对照

**Target Platform**: 抖音移动端小游戏，强制横屏；开发者工具及常见 iOS/Android 横屏安全区

**Project Type**: 现有 React Web/Tauri 应用 + Cocos 抖音小游戏客户端；本次只修改小游戏呈现和相关构建验证

**Performance Goals**: 启动 5 秒内可交互；目标 60fps、最低 30fps；切题和选中反馈 200ms 内可感知

**Constraints**: 无 DOM/BOM；离线可玩；不新增图片/语音；包体继续小于 16MB；只包含数字岛；三栏结构在 667×375 到 932×430 的横屏窗口中可用

**Scale/Scope**: 8 个数字游戏、122 道题、338 条语音、19 张图片；一个统一工作台和两个辅助页面

## Constitution Check

*GATE: Phase 0 前与 Phase 1 设计后均通过。*

- **Child-centered learning integrity — PASS**: 题干、视觉证据、错误反馈、成功解释和家长追问完整保留；右侧家长卡改为同屏呈现，提升亲子追问可见性。
- **Spec-driven traceability — PASS**: 规格、研究、数据模型、工作台契约、快速验证与任务清单均位于 `specs/028-douyin-landscape-parity/`。
- **Auditable local assets — PASS**: 不引入新资产，继续使用已审计的数字岛图片与语音清单。
- **Verification before completion — PASS**: 运行 `pnpm build`、`pnpm audit:curriculum` 及全部抖音小游戏构建/审计/开发者工具检查。
- **Documentation hygiene — PASS**: 更新 changelog、TODO 与抖音开发说明；不改变 AGENTS 原则和资产规范。

## Project Structure

### Documentation (this feature)

```text
specs/028-douyin-landscape-parity/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── landscape-workbench.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
doyingame/
├── assets/
│   ├── scenes/Main.scene
│   └── scripts/
│       ├── AppController.ts
│       └── ui/
│           ├── GameView.ts
│           ├── ParentInfoView.ts
│           └── UiFactory.ts
├── build-configs/bytedance-mini-game.json
├── profiles/v2/packages/builder.json
└── settings/v2/packages/project.json

scripts/
├── audit-douyin-minigame.mjs
├── build-douyin-minigame.mjs
└── douyin-minigame-ui-check.mjs

docs/
├── douyin-minigame.md
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: 继续使用已有 `doyingame/` 运行时，不建立第二套课程或资产。工作台由现有控制器与 UI 工厂组合，题目渲染器继续复用；只调整根布局、导航和视口配置。

## Design Decisions

1. **横屏源配置唯一化**：项目设计分辨率改为 1280×720，构建配置声明 `landscape`；专项审计直接检查源配置和最终 `game.json`，防止编辑器保存时回退竖屏。
2. **启动即工作台**：数据加载后根据 `lastLocation` 恢复最近题目，无进度时打开第一个游戏第一题；删除启动路径中的独立欢迎页。
3. **固定三栏、栏内自适应**：根节点按安全区宽度分配约 21% / 55% / 24%，保留最小间距；左、右信息密集区使用紧凑卡片和必要的栏内可达性，不让整页竖向滚动。
4. **本机版为结构基线**：复用浅色网格背景、暖白卡片、金色选中态、蓝绿色证据板、大圆角选项、底部主次按钮；不逐像素复制 CSS 阴影，但保持视觉层级和信息位置。
5. **导航状态共享**：左侧游戏按钮调用控制器切换游戏；右侧题号调用新增跳题动作；进度服务继续提供已完成题号和能力标签，避免另建状态。
6. **反馈不换页**：选错、答对和下一题操作留在中央题面下部，避免破坏三栏上下文；完成最后一题后仍停留在统一工作台。
7. **视觉验收双基准**：先打开 `/Applications/小小思考屋.app` 作为参考，再在抖音开发者工具编译同一题，用 10 项结构清单逐项对照。

## Build And Verification Strategy

1. 更新 UI 与方向后运行 `pnpm test:douyin-minigame`，验证配置、导航字符串和视口矩阵。
2. 运行 `pnpm audit:douyin-minigame` 与 `pnpm build:douyin-minigame`，检查 8 游戏/122 题、资源、包体和最终横屏 `game.json`。
3. 运行 `pnpm test:douyin-minigame:devtools`，要求开发者工具以 `compilationFinished` 完成而不是只打开项目。
4. 在开发者工具模拟器中保存首屏截图，并与本机版检查背景、三栏、题面、横向选项、题号网格、家长/成长卡。
5. 回归运行 `pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`。
6. 更新文档；本次不改变本机应用代码，但按仓库规则运行 `pnpm mac:install` 并报告结果。

## External Gates

- 真机横屏安全区和最终扫码预览仍需要账号主体在至少一台 iPhone 和一台安卓机确认。
- 平台若保留旧编译缓存，需要在开发者工具重新编译或清理缓存后再截图；构建产物是最终方向声明的依据。

## Post-Design Constitution Re-check

设计没有复制题库、引入外部视觉资产、移除家长追问或改变课程答案。横屏统一工作台只重组既有内容和状态；所有宪章门禁继续为 PASS。

## Complexity Tracking

无宪章违例。
