# Implementation Plan: 抖音小游戏数字岛首发版

**Branch**: `dev` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/027-douyin-math-island/spec.md`

## Summary

在现有 React/Vite 产品旁新增一个独立的 Cocos Creator 3.8 LTS 工程，构建目标为抖音小游戏 AppID `tta51dd3a03b67523202`。数字岛八个游戏和全部题目继续以现有 `src/data/games.ts` 为内容源，通过确定性的导出脚本生成小游戏可读 JSON，并从现有图片和语音清单中裁剪只被数字岛引用的运行时资产。Cocos 层只负责竖屏首页、题目渲染、触摸状态机、音频、存档与抖音平台桥接，不复制或手工改写课程答案。

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2021；Cocos Creator 3.8 LTS 项目脚本

**Primary Dependencies**: Cocos Creator 3.8 LTS；抖音小游戏 `tt` API；现有 pnpm/TypeScript/Vite 工具链

**Storage**: 抖音本地存储 `tt.getStorageSync` / `tt.setStorageSync`，编辑器或 Web 预览回退到浏览器本地存储

**Testing**: Node 内置 test runner；现有课程审计；导出确定性、数据契约、资产范围、存档迁移和包体审计；Cocos Web 预览；抖音 IDE 模拟器与真机预览

**Target Platform**: 抖音移动端小游戏，竖屏，首发以抖音和抖音极速版支持范围为准

**Project Type**: 同仓库双前端：现有 React Web/Tauri 应用 + 新增 Cocos 小游戏客户端，共享课程数据源与本地资产源

**Performance Goals**: 目标 60fps、最低可接受 30fps；触摸反馈 200ms 内可感知；测试手机首次可交互 5 秒内；音频和图片按题目预加载

**Constraints**: 无 DOM/BOM；离线可玩；未分包构建按当前开发者工具 16MB 上限执行，若改用分包则主包目标不超过 4MB；不接广告、支付、登录、云存档；不把逻辑屋、图形工坊或 `source/` 资产带入包；抖音 IDE 与真机验证仍需账号持有人执行

**Scale/Scope**: 数字岛 8 个游戏，共 122 个正式题目（18+15+12+28+12+13+12+12）；3 个数字岛通用场景主题加 4 个时钟生活场景；约数百条去重语音，最终数量由导出清单确定

## Constitution Check

*GATE: Phase 0 前与 Phase 1 设计后均通过。*

- **Child-centered learning integrity — PASS**: 完整保留题干、视觉证据、常见误判提示、成功解释与家长追问；首版不加入广告、计时或刷分压力。
- **Spec-driven traceability — PASS**: 规格、研究、数据模型、契约、快速验证和任务清单均位于 `specs/027-douyin-math-island/`，每个实现任务可追溯到 FR/SC。
- **Auditable local assets — PASS**: 以现有图片注册表和语音清单为源，生成数字岛专用资产清单；禁止 `source/`、逻辑屋和图形工坊资源进入运行包。
- **Verification before completion — PASS**: 除 Cocos/抖音构建审计外，仍运行 `pnpm build` 与 `pnpm audit:curriculum`，确保共享题库没有破坏现有产品。
- **Documentation hygiene — PASS**: 更新 changelog、TODO、assets 与新增抖音构建/提审说明；未完成的外部真机与后台步骤明确留在 TODO。

## Project Structure

### Documentation (this feature)

```text
specs/027-douyin-math-island/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── math-island-export.schema.json
│   ├── platform-adapter.md
│   └── storage-v1.schema.json
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/                              # 现有 Web/Tauri 正式产品与课程源
├── data/games.ts                 # 唯一正式题库源
├── data/imageGallery.ts          # 图片注册源
└── types.ts                      # 课程数据类型源

public/                           # 现有完整图片与语音资产源
├── images/
└── audio/voice/

scripts/
├── export-douyin-math-island.mjs # 构建数据、图片、语音清单与复制运行时资产
├── audit-douyin-minigame.mjs     # 数据范围、缺失资产、禁止资源、体积审计
└── *.test.mjs                    # 数据契约与审计测试

doyingame/                        # 独立 Cocos Creator 3.8 LTS 项目
├── package.json
├── tsconfig.json
├── assets/
│   ├── scenes/Main.scene
│   ├── scripts/
│   │   ├── AppController.ts
│   │   ├── ui/
│   │   ├── renderers/
│   │   ├── services/
│   │   └── models/
│   └── resources/math-island/    # 由导出脚本生成，不手改
│       ├── data/
│       ├── images/
│       ├── audio/
│       └── manifest.json
├── settings/
├── profiles/
├── build-templates/bytedance-mini-game/
│   └── game.ejs                  # 尽早监听 onShow，桥接侧边栏来源
└── build/                        # 忽略，不提交

docs/
├── douyin-minigame.md
├── assets.md
├── CHANGELOG.md
└── TODO.md
```

**Structure Decision**: 新增 `doyingame/` 是必要的平台运行时边界，而不是另建题库。Cocos 无法使用 React DOM，因而需要独立场景/UI；课程内容仍由 `src/data/games.ts` 自动导出，资源仍由 `public/` 裁剪，防止双重维护。生成目录带清晰的只读说明并可重复生成。

## Design Decisions

1. **内容单一来源**：用一个 Node 导出脚本通过 TypeScript 编译后的模块读取 `games`，过滤 `world === "math"`，输出带版本号和校验摘要的 JSON。导出测试比较 8 个游戏、122 个题目、所有答案与源数据一致。
2. **资源裁剪**：从数字岛题目中收集场景图；从图卡 token 映射收集 PNG；从题干+指令、选项、成功、重试、家长提示和游戏标题/目标收集语音。任何缺失项让审计失败，不静默退回 emoji 或在线资源。
3. **首包策略**：首发先保留单包离线结构，以 16MB 为官方构建硬门禁、14MB 为运行时资源预算；对随包副本做可重复 PNG/MP3 优化。只有单包再次超限或启动性能不达标时，才把其余音频与场景迁入 Cocos Asset Bundle 分包，并在抖音 IDE 中确认结构。
4. **UI 运行时**：单一主场景由控制器切换首页/游戏页/完成页，使用 ScrollView、Label、Sprite 与 Graphics；题目渲染器按 `visualGroups`、`sceneImage`、`clockChallenge` 分派，避免为 8 个游戏复制场景。
5. **交互状态机**：`idle → selected → checking → retry|correct → next|complete`；选择、提交和下一题带互斥锁，后台恢复停止当前音频。
6. **平台隔离**：`PlatformAdapter` 统一存储、音频生命周期、safe area、`onShow/onHide`、`checkScene` 与 `navigateToScene`；Cocos 编辑器可用本地适配器预览，抖音运行时使用 `tt` 实现。
7. **侧边栏复访**：在 `game.js` 最早时机同步注册 `tt.onShow`；首页仅在 `tt.checkScene({scene:'sidebar'})` 支持时展示家长向的“下次从侧边栏回来”入口，不用奖励、金币或诱导孩子。

## Build And Verification Strategy

1. `pnpm export:douyin-math` 生成数字岛数据和运行时资产。
2. `pnpm test:douyin-minigame` 验证导出契约、存档兼容和资产裁剪。
3. `pnpm audit:douyin-minigame` 验证 8 游戏/122 题、无非数字岛引用、无 `source/`、无缺失语音图片、包体门禁。
4. 在 Cocos Creator 3.8 LTS 打开 `doyingame/`，先 Web Mobile 预览三种竖屏，再构建 `bytedance-mini-game`，构建参数中填写 AppID。
5. 用抖音开发者工具打开 `doyingame/build/bytedance-mini-game`，跑模拟器、侧边栏 Mock、断网与真机扫码测试。
6. 回归运行 `pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`。
7. 因本变更影响本地产品共享脚本和文档，完成时按项目规则运行 `pnpm mac:install`；若仅新增隔离工程仍需报告安装结果。

## External Gates

- Cocos Creator 3.8 LTS 与最新抖音开发者工具需要安装并由账号持有人扫码登录。
- 第一次 Cocos 打开工程会生成 `.meta`、库缓存和场景序列化；这些生成物必须在提交前审计。
- 真机预览、测试版本上传、后台适龄/隐私/资质和最终发布必须由账号主体确认。

## Post-Design Constitution Re-check

设计未引入课程副本、在线依赖、广告或不可审计资源。新增 Cocos 工程属于抖音无 DOM 运行环境所需边界；通过导出契约、资源清单和双端回归消除双前端带来的漂移风险。所有宪章门禁仍为 PASS。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 新增第二个前端运行时 `doyingame/` | 抖音小游戏没有 DOM/BOM，现有 React 运行时无法直接执行 | WebView 或直接打包 Vite 产物不属于普通抖音小游戏可用运行方式，无法满足触摸、包体和平台审核要求 |
