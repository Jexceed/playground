# Implementation Plan: 语言花园的日常英语

**Branch**: `main` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

## Summary

增加三组原创英语补充活动，共六道情境选择与六项亲子对话。沿用 ActivitySet 引擎与本地语音服务，新增逐句示范，补齐 token 语言和听辨完成后的复听入口。

## Technical Context

- TypeScript / React 19 / Vite 7，Tauri macOS 应用；不增加依赖或网络运行时服务。
- 本地 PNG、Edge 中英语音，现有 localStorage 活动进度模型。
- `node --test`、课程审计、构建、浏览器与真实 Mac UI 验证。
- 范围：三个原创题组/12 活动，六张 1200×675 场景，至少十个英文表达。
- 性能：沿用单段音频播放/取消行为；图片压缩保存，无录音或口语识别。

## Constitution Check

全部通过：情境和表达一致，亲子观察不评分；资源本地注册；代码/资源/文档/验证可追溯。保留现有稳定身份和进度。用户及 AGENTS.md 明确要求在 main 工作，优先于宪章历史 dev 条款；实际保持 main。新题不进入 71 个来源对标 family 的计数。

## Project Structure

- `src/curriculum/everyday-english.ts`：原创题组、语句与亲子活动。
- `src/curriculum/catalog.ts`、导航分组：将新题加入探索语言花园。
- `src/domain/activity.ts`：`speechLocale` 与可选 `presentation.dialogue`。
- `src/interactions/`、`src/games/ActivitySetGame.tsx`、`src/styles.css`：对话展示、英文播放、完成后复听。
- `src/curriculum/activity-voice-lines.ts`：按语言导出 token/对话。
- `src/data/imageGallery.ts`、`public/images/scenes/english-daily-*.png` 与 `source/`：六幅可审计插图。
- `scripts/everyday-english.test.mjs`：内容、评分边界与语言导出契约回归。
- `specs/060-everyday-english/verification/`：图像提示词和验收证据。

## Verification

`pnpm export:voice-lines`；标准 `pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3`；目标活动和语音测试；`pnpm build`；`pnpm audit:curriculum`；`pnpm audit:voice-media`；`pnpm mac:install`。最后打开真实应用检查新增分组、情境、英文示范与资源；真实儿童试玩另列 TODO。

## Commit validation follow-up — 2026-10-30

用户要求提交并推送 060/061。提交前运行 `node --test scripts/*.test.mjs`，将新失败与当前提交 `8fb7e58c` 的独立源码快照对照。旧的 040–059 冻结快照仍覆盖原 1110 项；通过测试专用的 `scripts/lib/without-everyday-english.mjs` 明确排除且仅排除本次 3 个已知新题组/12 个活动及 6 个新增图库 key，再执行原哈希、答案和字段断言。不能改写历史快照，不能按任意前缀屏蔽新内容，不能全局改变 `loadGameData()` 或生产题库。新增内容继续由 everyday-English 测试独立覆盖；测试专用视图须证明保留未知新增题组、旧题变动和其他图库改动，并拒绝被污染的新题组身份。修正直接依赖全库数量的历史测试范围后重跑完整回归、构建与课程/媒体审计，记录已有失败及本次引入的失败数。
