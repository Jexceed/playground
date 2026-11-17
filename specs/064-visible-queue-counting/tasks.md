# Tasks：完整队伍与计数图解

## Setup / Foundation

- [x] T001 在 `specs/064-visible-queue-counting/` 建立规格、方案、数据模型和验证契约，记录用户对063限制的纠正。
- [x] T002 在 `verification/queue-before.json` 保存063后的九题，保留工作区现有修改。

## US1：完整排队与逐个计数（P1）

独立验收：九题人数、小兔位置与两条轨道逐一对应，交集为零或仅小兔，总数与算式默认可见。

- [x] T003 [US1] 新建 `src/domain/queue-counting.ts` 纯模型并实现 `src/interactions/QueueCountingEvidence.tsx`、`queue-counting.css`。
- [x] T004 [US1] 更新 `src/interactions/ActivityEvidence.tsx` 与 `src/domain/activity-assets.ts` 接入完整队伍、对应放大和真实图片预加载。
- [x] T005 [US1] 在 `scripts/queue-evidence.test.mjs` 验证实际人数、方向、交集、总数、资源，并适配 `scripts/lib/restore-reviewed-art.mjs` 的精确历史比较。

## US2：能听、能看清、能解释（P1）

独立验收：图解语音和视觉使用同一计数内容；放大不改关系，选择/完成规则和历史ID不变。

- [x] T006 [US2] 更新 `src/curriculum/exploration/math.ts` 的指令/提示/家长追问、revision与本规格 `content-changes.json`。
- [x] T007 [US2] 在 `src/curriculum/activity-voice-lines.ts` 导出图解，生成并核对 `public/audio/voice/manifest.json`，备份退役资源后清理。

## Verification / Delivery

- [x] T008 运行 `quickstart.md` 相关回归、build、curriculum和voice审计，结果写 `verification.md`。
- [x] T009 运行 `pnpm mac:install`，在安装版检查三种计数和最大队伍，保存 `verification/` 图像与产物校验。
- [x] T010 更新 `AGENTS.md`、`docs/CHANGELOG.md`、`docs/TODO.md` 并完成验证记录。

依赖：T001→T002→T003→T004/T006→T005/T007→T008→T009→T010。US1先形成可视增量，再完成US2语音；独立回归与审计可并行，运行时代码和语音生成按顺序合入，无需并行修改同一文件。
