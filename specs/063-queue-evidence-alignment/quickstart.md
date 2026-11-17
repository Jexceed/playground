# 验证步骤

1. `node --test scripts/queue-evidence.test.mjs scripts/math-evidence.test.mjs scripts/exploration-presentation.test.mjs scripts/visible-activity-assets.test.mjs scripts/exploration-quality.test.mjs scripts/curriculum-review-invariants.test.mjs scripts/activity-progress.test.mjs`
2. `pnpm export:voice-lines`
3. `pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3`
4. `pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`；核对 manifest 的 ID/原文/locale、failures 和语音引擎。
5. `pnpm mac:install`，退出旧进程并打开 `/Applications/小小思考屋.app`。
6. 探索 → 数字岛 → 队伍有多长，检查第 1/4/7 题和数字较大的变体。首题只给 3 与 3；后两阶段保留共同的小兔。确认题干/图/提示/反馈一致、按钮可用和本地图加载；保留用户已有完成记录。

原生截图和命令结果放 `verification/`，结论写 `verification.md`。技术验收不替代儿童试玩或人耳发音审查。

新增数字岛全量结构复核：

- `node specs/063-queue-evidence-alignment/verification/audit-n01-n08.mjs`
- `node specs/063-queue-evidence-alignment/verification/audit-n10-n16.mjs --require-action-cue`

原生同时检查 N10 第7/9题及放大图、N05 第6题；具体结果以 verification.md 为准。
