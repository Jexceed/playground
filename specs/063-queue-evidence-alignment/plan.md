# 实现方案：队伍题条件与画面一致

**分支**：main | **日期**：2026-11-14 | **规格**：[spec.md](spec.md)

## Summary

为首阶段添加显式的 `queuePositionAndTail` 证据类型，直接保存左起名次和后面人数。重叠证据区分左右名次与两组人数。同步首阶段加法讲解及九题选择人数的指令，沿用本地小兔 PNG。

## Technical Context

TypeScript 5 / React 19 / Vite 7 / Tauri 2 单应用；localStorage 进度格式不变。无新增依赖、服务或技术选型。Node test + React 服务端渲染检查九题语义，再做实际 Mac UI 验收。规模为 N09 的 9 题，目标是离线资源完整、当前窗口无裁切，不扩展为响应式重设计。

## Constitution Check

- 学习一致性：直接呈现给定条件，保留解释和家长追问。
- 规格、任务、代码、语音与验证证据可追溯。
- 图片沿用已注册本地 PNG，预加载按实际渲染资源；语音沿用 Edge 流程。
- 完成前运行 build、curriculum、相关回归、voice-media 和 mac:install。
- 更新 CHANGELOG/TODO；不改原则文档。
- 宪章中旧 dev 要求由本次用户提供的 main 指令覆盖；实际继续 main。设计复核通过，无未决问题。

## Project Structure

- `src/curriculum/exploration/math.ts`：条件、讲解与 authoring oracle。
- `src/domain/activity.ts`、`src/domain/activity-assets.ts`：证据类型和本地图依赖。
- `src/interactions/ActivityEvidence.tsx`、`src/interactions/math-evidence.css`：两类分组的渲染与局部样式。
- `scripts/queue-evidence.test.mjs`：从题干抽取条件，独立检查九题的图文与算式；历史快照的允许变更清单放本规格目录。
- `scripts/lib/restore-reviewed-art.mjs`：仅在历史比较前精确验证并还原本次已声明字段。
- `public/audio/voice-lines.*`、`public/audio/voice/manifest.json`、新 mp3：可审计语音产物。
- 本目录包含 research/data-model/contracts/quickstart/tasks 和 verification；维护 docs/CHANGELOG.md、docs/TODO.md。

## Workflow

扩展审查的确认结果：N10-7/8/9 在 `placeValueModel` 增加 `removeOnes: 1`（tens/ones 保持原数），`PlaceValueBlocks.tsx` 在对应原有小块上画清晰删除线，`MathEvidence.tsx` 加原来/拿走/未知结果标签；N05-6 修正已到十时的提示与反馈，不改变算式及图片数值。测试沿用 `scripts/math-evidence.test.mjs`，精确变更清单包含这四题。

先冻结九题旧值，再实现类型、渲染、文案、精确变更清单及回归。随后导出/补齐语音，运行审计和构建，安装并检查原生三阶段。保留现有 062 未提交修改。未增加技术选型或研究未知项，因此无独立研究任务；当前模板提到的 update-agent-context.sh 不存在，未生成替代脚本或改写 AGENTS。
