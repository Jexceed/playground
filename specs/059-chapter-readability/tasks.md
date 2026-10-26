# 059 Tasks：逐章理解与可读性

## 基础
- [x] T001 在specs/059-chapter-readability建立规范、计划、设计与验收契约，完成setup-plan/setup-tasks。
- [x] T002 在specs/059-chapter-readability/reviews生成115章、1110题完整基线与待审台账，保存初始Git/语音状态。

## US1：清楚且有层次（P1）
独立验证：当前Mac窗口的辅助信息恢复原有字号层次；关键说明通过具体图、动作和短句理解，不能以统一放大替代。
- [x] T003 [US1] 在specs/059-chapter-readability/verification记录各CSS字号及浏览器小字基线。
- [x] T004a [US1] 恢复机械放大的辅助字号与紧凑框架层次，保留具体图片模型；当前Mac截图、build/audit与安装验证。
- [x] T004b [US1] 移除探索独有的缩小覆盖，共享同级字号；当前Mac长标题及实际原生对照验收。
- [ ] T004 [US1] 修正src/styles.css和src/components、src/interactions各组件字号及必要的容器/间距。
- [ ] T005 [US1] 逐章复核图片内文字与模型缩放，在对应生成器/渲染器修正；证据写入reviews/chapter-ledger.json。
- [ ] T006 [US1] 在verification记录当前Mac窗口的实际层次/对齐和代表密集题验证，处理发现项。

## US2：逐章理解（P1）
独立验证：每章全部题目已复核，所有规则/表征变体有实际页面证据；每项问题已修复并验证或有明确合理保留理由。
- [x] T007 [US2] 审查并优化启蒙数字岛8组；内容/图/操作证据写入reviews/math-enlightenment.md及台账。
  - [x] T007a 修复小鸟离开模型，核对12题动作/数量和重播，并同步本地语音。
- [x] T008 [US2] 审查并优化探索数字岛16组；内容/图/操作证据写入reviews/math-exploration.md及台账。
- [ ] T009 [US2] 审查并优化启蒙逻辑屋26组；内容/图/操作证据写入reviews/logic-enlightenment.md及台账。
- [ ] T010 [US2] 审查并优化探索逻辑屋15组；内容/图/操作证据写入reviews/logic-exploration.md及台账。
- [ ] T011 [US2] 审查并优化启蒙图形工坊6组；内容/图/操作证据写入reviews/graphic-enlightenment.md及台账。
- [ ] T012 [US2] 审查并优化探索图形工坊21组；内容/图/操作证据写入reviews/graphic-exploration.md及台账。
- [ ] T013 [US2] 审查并优化探索记忆小屋9组；内容/图/操作证据写入reviews/memory-exploration.md及台账。
- [ ] T014 [US2] 审查并优化探索语言花园8组；内容/图/操作证据写入reviews/language-exploration.md及台账。
- [ ] T015 [US2] 审查并优化探索生活实验室6组；内容/图/操作证据写入reviews/life-exploration.md及台账。
- [ ] T016 [US2] 复核reviews/chapter-ledger.json覆盖全部115组/1110题，无待审、待修改或缺证据变体。

## US3：稳定交付（P2）
独立验证：历史数据保持，所有变更文字与本地音频一致，必需构建/审计及原生验收通过。
- [ ] T017 [US3] 在verification记录内容/ID/答案/规则变化审定及已有交互回归，避免宽泛归一化隐藏问题。
- [ ] T018 [US3] 导出并按需生成public/audio语音；verification记录manifest/脚本/音频审计及关键指令复核。
- [ ] T019 [US3] 执行build/curriculum/illustrations/voice-media与必要回归，日志保存verification。
- [ ] T020 [US3] mac:install，verification保存安装哈希/签名；原生逐章变体抽查和关键操作，恢复用户最新位置，并补057/058原生待办。
  - [x] T020a 修复原生时钟7–9题被未使用旧图加载阻断的问题，重新安装验证。

## 收尾
- [ ] T021 更新docs/CHANGELOG.md、docs/TODO.md、docs/assets.md和verification.md，保留儿童实测与成人检查的边界。
- [ ] T022 逐条审核spec验收、章节台账和全部验证证据；仅在完整满足目标后标记完成。

依赖：T001→T002/T003→T004；T007–T015各章审查依赖基线，与T005/T006按同章同步，全部汇总T016；再完成T017–T022。不同主题可独立审查但本轮由同一代理顺序实施，无新增委派。MVP是公共小字修复，完整交付仍包括全部章节，不能以MVP代替目标。
