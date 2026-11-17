# Implementation Plan: Mac 窗口首次点击

**Branch**: main | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

## Summary

在现有 Mac 主窗口配置中启用 `acceptFirstMouse`，让切回窗口的首次点击传到原有 WebView 按钮。保留未复现的前台间歇性问题边界。

## Technical Context

- Language/Version: TypeScript 5 / React 19 前端，Rust 2021 的 Tauri 2 桌面包装。
- Primary Dependencies: 现有 Tauri/Wry、Vite；不新增依赖。
- Storage: 现有 WebKit localStorage；无迁移或改写。
- Testing: 现有 Node 测试、Vite 生产构建、课程/语音审计、安装版 CUA 操作。
- Target Platform: macOS arm64 安装版；前端两部分共享现有页面。
- Project Type: 单页亲子游戏及本地桌面包装。
- Performance Goals: 首次点击按原有单击路径处理，不增加等待或合成事件。
- Constraints: 不修改题库、图像、语音、评分、进度或现有拖拽/记忆规则。
- Scope: 一个窗口配置字段及规格、验证、CHANGELOG、TODO。

## Constitution Check

设计前与设计后均通过：保留亲子任务规则；规格/计划/任务可追溯；无资产变更；运行 build、audit 和原生安装验证；维护文档并明确未复现范围。分支遵循用户当前 main 指令。

## Project Structure

- `src-tauri/tauri.conf.json`: existing main-window configuration.
- `specs/062-mac-first-click/`: spec, research, data model, input contract, quickstart, tasks and verification.
- `docs/CHANGELOG.md`, `docs/TODO.md`: delivered behavior and unresolved intermittent-input boundary.

## Implementation and Verification

1. Record existing native single-click observations and confirmed configuration semantics.
2. Set main-window `acceptFirstMouse` to true without changing page event handlers.
3. Run the exact checks in quickstart.md and compare the voice manifest without regenerating unchanged content.
4. Run `pnpm mac:install`, reopen the installed app, exercise representative controls and verify the installed executable/signature.
5. Record passed checks, automation limitations and any failures in verification.md, then update tasks and docs.

## Complexity Tracking

No added dependencies, interfaces or runtime models. No additional test that merely asserts the one-line configuration; validation uses the existing desktop checks and installed app.
