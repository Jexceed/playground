# Tasks：数字岛题意与画面一致

依据 spec.md、plan.md、contracts/queue-ui.md。分支 main。

## Phase 1：Setup

- [x] T001 在 `specs/063-queue-evidence-alignment/` 写规格、方案和验证契约，保留已有 062 修改。

## Phase 2：Foundational

- [x] T002 在 `specs/063-queue-evidence-alignment/verification/` 保存修正前 N09 数据，并在 `scripts/queue-evidence.test.mjs` 写出可复现回归。

## Phase 3：US1（P1）图文条件一致

独立验收：9 题可见条件等于题干给定条件，首阶段左右区域不重叠，ID/选项/答案不变。

- [x] T003 [US1] 在 `src/domain/activity.ts`、`src/curriculum/exploration/math.ts` 区分名次加后续人数、左右名次和重叠两组。
- [x] T004 [US1] 在 `src/interactions/ActivityEvidence.tsx`、`src/interactions/math-evidence.css` 渲染对应画面，并更新 `src/domain/activity-assets.ts`。
- [x] T005 [US1] 在本规格 `content-changes.json` 记录精确变更，并接入 `scripts/lib/restore-reviewed-art.mjs` 的历史比较。

## Phase 4：US2（P1）听题与解释一致

独立验收：首阶段给出加法，后两阶段解释重复计数；语音 manifest 与脚本完全对齐。

- [x] T006 [US2] 在 `src/curriculum/exploration/math.ts` 修正指令、提示、反馈与家长追问，同步作者 oracle。
- [x] T007 [US2] 导出 `public/audio/voice-lines.json` 并生成对齐的 `public/audio/voice/manifest.json` 和新增 mp3。

## Phase 5：US3（P1）同类问题排查

用户补充不止一题；先覆盖探索数字岛全部 16 组 / 144 题。独立验收：逐阶段比较最终题库与实际渲染条件，明确发现与覆盖边界。

- [x] T008 [US3] 在本规格 `reviews/math-consistency.md` 汇总 N01–N16 的题干/图/反馈核查，确认问题后补充规格与精确修复任务。
- [x] T009 [US3] 在 `src/domain/math-evidence.ts`、`src/interactions/PlaceValueBlocks.tsx`、`src/interactions/MathEvidence.tsx` 和 `math-evidence.css` 表达 N10-7/8/9 拿走一小块，补充 `scripts/math-evidence.test.mjs` 回归。
- [x] T010 [US3] 在 `src/curriculum/exploration/math.ts` 修正 N05-6 的机械凑十讲解，同步题干、反馈、提示与语音。

## Final：验证与交付

- [x] T011 运行 `quickstart.md` 相关回归、build、curriculum 和 voice-media，结果写 `verification.md`。
- [x] T012 运行 `pnpm mac:install` 并在 `/Applications/小小思考屋.app` 检查三个阶段，保存 `verification/` 原生证据。
- [x] T013 更新 `docs/CHANGELOG.md`、`docs/TODO.md`，记录修复、安装和未完成的儿童试玩边界。

## Dependencies / 实施策略

T001 → T002 → T003 → T004/T006 → T005/T007/T008/T009/T010 → T011 → T012 → T013。T008 的不同题组只读研究可并行；确认修复串行合入同一 math.ts。US1 是首个可验收增量，US2 随后完成语音一致性，全部发现处理后统一安装。独立验证可并行执行，但同一文件的修改保持顺序。
