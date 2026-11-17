# 实现方案：队伍头像比例与毛色

**分支**：main | **日期**：2026-11-16 | **规格**：[spec.md](spec.md)

## Summary / Technical Context

React19、TypeScript5、Vite7、Tauri2，沿用既有栈。给头像增加同尺寸wrapper，由列宽和1:1比例决定高度，高亮和阴影绑定wrapper；取消100/120px独立固定行高。imagegen编辑已有猫/狗/熊，各生成两种自然毛色，保留透明源图，Sharp仅做等比例尺寸规范化。

## Constitution Check

画面不改变数学条件；颜色用于辨认个体而非给答案编码。PNG本地注册，原图/源图/精确prompt/转换哈希可审计。题库、进度和语音文本不改。遵照用户main规则。构建、审计、相关回归与真实Mac安装均为交付门槛。无钩子或新技术研究未知项；项目仍无update-agent-context.sh。

## Project Structure

- `src/interactions/QueueCountingEvidence.tsx`、`queue-counting.css`：头像wrapper、正方形框与同一尺寸来源。
- `src/domain/queue-counting.ts`：按物种出现次序指定imageKey，数学字段保持不变。
- `src/data/imageGallery.ts`、`src/domain/activity-assets.ts`：注册六个新图片，预加载与画面使用同一imageKey。
- `public/images/characters/queue-065/` 与 `source/`：六个运行PNG、imagegen源图、prompt与manifest。
- `scripts/queue-evidence.test.mjs`：更新资源集合核对；旧快照精确处理新增gallery键。
- `docs/assets.md`、CHANGELOG/TODO、本目录验证证据。

## Workflow / Verification

先生成并人工查看毛色变体，期间修正布局与映射。规范尺寸后接入、运行 `node --test scripts/queue-evidence.test.mjs scripts/math-evidence.test.mjs scripts/exploration-presentation.test.mjs scripts/visible-activity-assets.test.mjs scripts/curriculum-review-invariants.test.mjs scripts/activity-progress.test.mjs scripts/activity-framework.test.mjs scripts/round-speech-navigation.test.mjs`、`pnpm build`、`pnpm audit:curriculum`。九题图片加载/唯一性及计数不变；浏览器实测三种人数正常和放大头像/高亮宽高比、对齐及无裁切。`pnpm mac:install` 后实际打开6/8/10位图。语音只核对现有4411条，无需重导出或重生成。
