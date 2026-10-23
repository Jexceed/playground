# Implementation Plan: 050 具体规则操作

**Branch**: main | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

## Summary

为 L08/L09 添加显式的可视操作元数据；复用本地圆片，采用独立 React 操作台，通过现有 session 提交、撤销、清空和进度接口。示范和正式答案分离。

## Technical Context

TypeScript 5 / React 19 / Vite 7 / pnpm；浏览器与 Tauri macOS。沿用 localStorage 进度与现有判定器，无新增依赖。范围 18 题；响应同步执行，不依赖网络。验证用 Node test、构建、课程/语音审计、浏览器及真实原生 UI。

## Constitution Check

- 以具体数量和动作支持理解，保留家长追问。
- 先规格、计划、任务，再实施。
- 使用 imageGallery 中已注册的 PNG 圆片；牌的几何轮廓由 CSS 确定，无装饰场景。
- 必跑 pnpm build、pnpm audit:curriculum、pnpm mac:install；文案变化执行语音导出/生成/对齐核对。
- 更新 CHANGELOG/TODO；main 遵循用户提供的当前 AGENTS.md，旧 constitution 的 dev 约定不覆盖用户指令。
- 设计复核：通过；无新存储和网络接口，无待澄清项。

## Project Structure

- src/domain/activity.ts：规则机/翻牌视觉契约。
- src/curriculum/exploration/logic.ts：题目明确的数据与简短口语。
- src/interactions/RulePlayBoards.tsx、rule-play.css：示范、数量卡、直接翻牌和响应布局。
- src/domain/activity-evaluation.ts：翻牌初始响应；其余判定复用。
- src/games/ActivitySetGame.tsx、AdvancedInteraction.tsx：接入、移除目标题冗余文字条。
- src/curriculum/activity-voice-lines.ts：导出示范朗读。
- scripts/rule-play.test.mjs：所有变体操作、判定、撤销/重来/重玩、非目标题兼容。
- public/audio/：增量 Edge 语音及清单。
- docs/CHANGELOG.md、docs/TODO.md 与本 feature 的 verification/：验收结果。

## Verification

node --test scripts/rule-play.test.mjs scripts/exploration-framework.test.mjs scripts/activity-framework.test.mjs scripts/activity-progress.test.mjs scripts/round-speech-navigation.test.mjs

pnpm export:voice-lines；pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python /Users/chiang/Documents/Projects/playground/local-tts/.venv/bin/python --quiet --retries 3

pnpm build；pnpm audit:curriculum；pnpm audit:voice-media；pnpm mac:install。

浏览器检查两组各阶段及小屏、正确/错误/撤销/清空、示范重看；安装后原生检查关键流程并保留现有孩子进度。
