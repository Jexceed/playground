# 实现方案：完整队伍与计数图解

**分支**：main | **日期**：2026-11-16 | **规格**：[spec.md](spec.md)

## Summary / Technical Context

沿用 TypeScript 5、React 19、Vite 7、Tauri 2，无新增依赖。新增纯函数计数模型和 QueueCountingEvidence 组件，完整队伍使用已注册 cat/dog/bear/rabbit PNG。绿色与蓝色轨道分别表达两个计数方向及包含范围，直接展示合并算式，图解朗读使用现有 speak/Edge 流程。

## Constitution Check

图中朋友、位置、计数和题干统一；完整展示服务理解，用户最新要求覆盖063的隐藏总数约束。图片沿用本地注册资源；语音重新导出生成审计。稳定ID和进度不改，选择机制继续可用。用户提供main规则覆盖宪章旧dev条款。设计前后检查通过，无未决需求。

## Project Structure / Changes

- `src/domain/queue-counting.ts`：从两种既有证据生成完整队伍、两个计数轨道、式子、图解文本；数据无答题状态。
- `src/interactions/QueueCountingEvidence.tsx`、`queue-counting.css`：同一行朋友、对齐计数、单只小兔、合并解释和听图解按钮。
- `src/interactions/ActivityEvidence.tsx`：接入新组件及同模型放大；移除旧文字牌。
- `src/domain/activity-assets.ts`、`src/curriculum/activity-voice-lines.ts`：精确图片预加载和图解语音导出。
- `src/curriculum/exploration/math.ts`：九题指令/提示/家长追问改为看图解释，revision 3，题干与正确答案不变。
- `scripts/queue-evidence.test.mjs`、历史比较辅助函数：独立验证计数几何、包含范围和精确改动；更新旧版单张兔子图断言。
- 本目录文档/变更清单，docs/CHANGELOG.md、docs/TODO.md，以及本地音频产物。
- `AGENTS.md`：明确可借完整对象和图解理解答案，防止再次为避免看出答案而隐藏教学依据。

## Verification / Workflow

冻结063交付后的九题，完成纯模型/呈现，再同步文案、音频和测试。运行 `node --test scripts/queue-evidence.test.mjs scripts/math-evidence.test.mjs scripts/exploration-presentation.test.mjs scripts/visible-activity-assets.test.mjs scripts/curriculum-review-invariants.test.mjs scripts/activity-progress.test.mjs scripts/activity-framework.test.mjs scripts/round-speech-navigation.test.mjs`、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`。安装前按manifest备份并清理退役音频。`pnpm mac:install` 后检查1/2/3/4/7/9题及放大。

无新技术选型或需要外部研究的未知项，研究集中于既有资源与计数关系。项目缺少 update-agent-context.sh，继续维护现有AGENTS而不生成替代脚本。无 extensions.yml 钩子。
