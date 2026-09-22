# Implementation Plan: 看得见、点得中的连接题

**Branch**: `dev` | **Date**: 2026-09-22 | **Spec**: [spec.md](spec.md)

## Summary
从 AdvancedInteraction 拆出 MatchingInteraction 和 GraphInteraction。配对以卡片端点与 SVG 线同步呈现，支持点击和 Pointer Events 拖动；图网络用图上的可聚焦热区操作并真实绘制双桥与路线方向。沿用 session 的 response/undo/clear/submit。

## Technical Context
**Language/Version**: 仓库现有 TypeScript 5.9 / React 19 / Vite 7 / Tauri 2。
**Primary Dependencies**: 无新增依赖；SVG、Pointer Events、ResizeObserver。
**Storage**: 原本地学习记录，schema、题目 ID/revision 和答案不变。
**Testing**: Node 行为测试、CUA 桌面/375px/真实 Mac 操作、课程与语音审计。
**Target Platform**: Web、arm64 macOS；窄屏验证不等于真触屏硬件验证。
**Performance Goals**: 每次操作立即显示线；尺寸改变后端点与卡片保持一致。
**Constraints**: 不访问答案作为 UI 状态；保留错误配对供孩子检查；图卡仍使用本地注册资源。
**Scale/Scope**: 33 配对、9 连桥和9 路线活动，共享组件。

## Constitution Check
亲子思考与答案空间保留；spec/plan/tasks 先于实现；连接线属于交互控件而非题面图片兜底；文案修改同步 Edge 本地语音；build/audit 与真实 app 验收后报告结果。无新增规则，无需修改 AGENTS。仓库没有 update-agent-context.sh，检查现有 AGENTS 后保持其项目原则。

## Project Structure
- src/interactions/MatchingInteraction.tsx：卡片、端点、连线、点击/拖动、断开。
- src/interactions/GraphInteraction.tsx：SVG 图面操作、双桥、当前位置与路线方向。
- src/interactions/connection-state.ts：配对替换、桥数循环、合法路段纯函数。
- src/domain/activity.ts / src/curriculum/exploration/helpers.ts：显式文字卡元数据和指令。
- src/curriculum/exploration/logic.ts：图面操作指令。
- src/styles.css：可见连接、可聚焦目标、响应式尺寸。
- src/domain/advanced-activity.ts / src/curriculum/exploration/logic.ts：显式接受 L02 重复圆形互换的等价配对，不在 UI 推断或提示答案。
- scripts/connection-interaction.test.mjs：编辑行为与 session 回归。
- public/audio/：导出、增量 Edge 生成、过期资源清理。
- specs/030-visible-connections/verification/：测试、审计、截图与 QA 记录。

## Verification
执行 node --test scripts/connection-interaction.test.mjs scripts/exploration-framework.test.mjs scripts/activity-framework.test.mjs scripts/activity-progress.test.mjs；pnpm build；pnpm audit:curriculum；pnpm export:voice-lines；标准 Edge 生成；pnpm audit:voice-media；pnpm mac:install。按 quickstart 完成真实流程。更新 CHANGELOG/TODO 并只在本地 dev 保存。
设计后复查：无未解决技术问题或宪章例外；儿童理解改进需后续用户/儿童试玩反馈。
