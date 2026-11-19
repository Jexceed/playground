# Implementation Plan: Mac 最大化窗口启动与全页面文案贴合度优化

**Branch**: main | **Date**: 2026-11-19 | **Spec**: [spec.md](spec.md)

## Summary

1. 在 Tauri Rust 入口（`src-tauri/src/main.rs`）针对 macOS 在主窗口创建后执行 `window.maximize()`（底层调用 AppKit `NSWindow::zoom`，扩展至 `NSScreen.visibleFrame` 而不进入原生全屏空间），保留 `tauri.conf.json` 的 `1280×820` 标准还原帧与 `acceptFirstMouse: true`。
2. 在前端视图与样式层优化全部页面壳层与交互提示文案（`index.html`、`src/App.tsx`、`src/games/ProgressiveSetGame.tsx`、`src/games/ActivitySetGame.tsx`、`src/interactions/ActivityEvidence.tsx`、`src/styles.css`），不触碰已冻结的题库快照与 4,499 条本地 Edge 语音资产。

## Technical Context

- **Frontend / Desktop**: React 19 + TypeScript 5 + Vite 7；Tauri 2（`tao 0.35` / `wry 0.55`）macOS `aarch64-apple-darwin`。
- **Storage & Assets**: 本地 `localStorage` 进度键与结构不变；`src/data/`、`src/curriculum/` 题库与 `public/audio/voice/` 清单不变。
- **Testing & Gates**: Node 内置测试运行器、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`、`pnpm test:desktop-release`、新增页面文案与窗口配置回归测试 `scripts/page-copy-and-window.test.mjs`，以及 `pnpm mac:install` 真实 `.app` 启动实测。

## Project Structure

- `src-tauri/src/main.rs`：macOS 主窗口启动最大化（非全屏）。
- `index.html`：应用页面与分享描述更新。
- `src/App.tsx`：启动页副标题、按阶段贴合的主题简介、统一“主题/题组”口径与搜索空状态、按页面形态动态贴合的顶部导览横幅、右侧家长陪玩提示与成长记录文案优化。
- `src/games/ProgressiveSetGame.tsx`：启蒙题头显示当前题组名、优化难度悬停前缀、统一“回第 1 题”与“完成本组”、优化时钟生活场景标签。
- `src/games/ActivitySetGame.tsx`：细化“英语日常说”看图选句/亲子对话题头、明确“补做未完成题”与“保存这次观察”、优化亲子观察底部状态栏与异常提示。
- `src/interactions/ActivityEvidence.tsx`：按证据模型类型精准匹配证据框标题。
- `src/styles.css`：取消展开态主题简介的单行省略截断，补充搜索空状态样式。
- `scripts/page-copy-and-window.test.mjs`：验证 Mac 启动最大化配置、非全屏约束及页面文案贴合度回归断言。
- `docs/CHANGELOG.md`, `docs/TODO.md`：记录本次交付与后续跟进项。

## Implementation & Verification Steps

1. 修改 `src-tauri/src/main.rs`，仅在 `target_os = "macos"` 下最大化 `main` 窗口。
2. 更新 `index.html`、`src/App.tsx`、`src/games/ProgressiveSetGame.tsx`、`src/games/ActivitySetGame.tsx`、`src/interactions/ActivityEvidence.tsx` 与 `src/styles.css`。
3. 编写并运行 `scripts/page-copy-and-window.test.mjs` 及相关现有测试套件，执行 `pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`。
4. 执行 `pnpm mac:install` 更新 `/Applications/小小思考屋.app`，启动真实应用并通过系统窗口属性核验窗口尺寸等于屏幕可用区域且 `AXFullScreen = false`。
5. 更新 `specs/068-mac-maximized-and-page-copy/verification.md`、`tasks.md`、`docs/CHANGELOG.md` 与 `docs/TODO.md`。

## 审查修复

题组筛选与探索题头共用玩法名称，空态和清空入口由桌面列表与手机选择器共用。当前主题简介随选中主题自然换行。家长观察提示描述观察项目，比较图标题描述比较任务。题组重置沿用原操作，通过稳定控件定位复测。

在生产构建中用独立浏览器存储检查桌面与触控布局、关键词、无结果后恢复、亲子记录及身高比较。运行 067 的两套实际操作验收，并在本机安装版核对可用窗口范围和系统全屏属性。
