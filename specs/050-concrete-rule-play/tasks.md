# 050 实施任务

## 基础

- [x] T001 建立 specs/050-concrete-rule-play/ 的规格、设计与验收入口，确认 main 干净基线。
- [x] T002 在 src/domain/activity.ts 定义视觉元数据，src/curriculum/exploration/logic.ts 接入 18 题，保持身份/答案。

## US1：规则机（P1）

独立验收：九题例子与正式题数量正确，组合规则逐步展示且不泄露正式答案。

- [x] T003 [US1] 在 src/interactions/RulePlayBoards.tsx 实现圆片分组、规则机示范/正式题切换。
- [x] T004 [US1] 在 src/interactions/AdvancedInteraction.tsx 接入数量选项，src/games/ActivitySetGame.tsx 接入示范开始流程。

## US2：直接翻牌（P1）

独立验收：九题按步骤操作得到原答案；错翻、重复翻、撤销、重新翻和完成锁定有效。

- [x] T005 [US2] 在 src/domain/activity-evaluation.ts 实现初始牌面响应。
- [x] T006 [US2] 在 src/interactions/RulePlayBoards.tsx 实现独立示范、初始参考、图示步骤及大牌操作。
- [x] T007 [US2] 在 src/games/ActivitySetGame.tsx 接入翻牌与共享历史/提交控制。

## US3：可读性与交付（P2）

独立验收：桌面/窄屏无横向溢出，短指令可读，语音覆盖一致，真实应用可操作。

- [x] T008 [US3] 在 src/interactions/rule-play.css 完成大字、响应布局、焦点与减少动态效果支持。
- [x] T009 [US3] 在 src/curriculum/activity-voice-lines.ts 导出新短语并生成 public/audio/ 本地 Edge 语音。
- [x] T010 [US3] 在 scripts/rule-play.test.mjs 覆盖状态回归；记录构建、课程/语音审计和浏览器交互到 verification/。
- [x] T011 [US3] 运行 pnpm mac:install 并记录真实应用检查到 specs/050-concrete-rule-play/verification.md。

## 收尾

- [x] T012 更新 docs/CHANGELOG.md、docs/TODO.md 和本任务的验证结果、完成状态。

依赖：T001→T002；US1/US2 分别完成后执行 US3，最后收尾。本次由同一代理顺序实施；可独立处理的例子为 US1 组件与 US2 初始响应，但共享文件需串行整合。先完成规则机，再完成翻牌，最终一起交付 18 题。
