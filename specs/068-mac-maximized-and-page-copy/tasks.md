# Tasks: Mac 最大化窗口启动与全页面文案贴合度优化

**Input**: `specs/068-mac-maximized-and-page-copy/` design artifacts.

## Phase 1: Specification & Plan

- [x] T001 梳理 Mac 窗口启动行为与全页面文案审视结论，产出 `spec.md` 与 `plan.md`。

## Phase 2: US1 — Mac 启动最大窗口（非全屏）

- [x] T002 [US1] 在 `src-tauri/src/main.rs` 的 `.setup` 钩子中为 macOS 主窗口启用 `window.maximize()`，保持 `tauri.conf.json` 不开启 `fullscreen` 并保留 `1280×820` 标准还原帧与 `acceptFirstMouse: true`。

## Phase 3: US2 — 全页面文案贴合度优化

- [x] T003 [US2] 更新 `index.html` 与 `src/App.tsx`（启动页副标题、按阶段区分的主题简介、统一“主题/题组”口径、搜索无结果提示与一键清空、顶部场景化导览说明、右侧家长陪玩提示与成长记录文案）及 `src/styles.css` 展开态简介换行样式。
- [x] T004 [US2] 更新 `src/games/ProgressiveSetGame.tsx`、`src/games/ActivitySetGame.tsx` 与 `src/interactions/ActivityEvidence.tsx` 中的题头、按钮、证据框标题与亲子观察底部提示。

## Phase 4: US3 — 回归验证与本机安装签收

- [x] T005 [US3] 新增 `scripts/page-copy-and-window.test.mjs`，运行现有回归测试、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media` 与 `pnpm test:desktop-release`。
- [x] T006 [US1][US3] 运行 `pnpm mac:install` 更新 `/Applications/小小思考屋.app`，冷启动实测窗口 `visibleFrame` 贴合度与 `AXFullScreen = false`，记录 `verification.md` 并更新 `docs/CHANGELOG.md` 与 `docs/TODO.md`。

## 审查修复与交付

- [x] T007 [US2] 在 src/App.tsx 和 src/styles.css 让九个选中主题的简介可见，桌面和窄屏共用搜索空态。
- [x] T008 [US2] 题组筛选支持实际显示的玩法名称，修正亲子观察面板和 src/interactions/ActivityEvidence.tsx 的比较图标题。
- [x] T009 [US3] 更新 067 启蒙验收的重置按钮定位，补充真实题库与生产界面回归。
- [x] T010 [US1] [US3] 完成全套回归、语音与课程审计、Mac 安装窗口点验和独立提交快照验证。
