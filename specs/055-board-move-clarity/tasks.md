# 055 Tasks
## 基础
- [x] T001 在 specs/055-board-move-clarity/ 建立规格、设计、契约和基线。
## US1 棋盘语义
- [x] T002 [US1] 在 domain/activity.ts 和 exploration/logic.ts 增加9题boardMove模型与instruction。
- [x] T003 [US1] 在 BoardMoveBoard.tsx、board-move.css 绘制明确的空格、固定子、试放子和规则图。
## US2 独立试放
- [x] T004 [US2] 在 ActivitySetGame.tsx 接入临时试放与原toggle，替换旧证据/选项区。
- [x] T005 [US2] 在 scripts/board-move.test.mjs 与历史变更记录覆盖语义、答案和边界。
## US3 本地交付
- [x] T006 [US3] 更新 public/audio 并完成构建、审计、浏览器、Mac安装检查，补054原生检查。
## 收尾
- [x] T007 更新 docs/CHANGELOG.md、TODO.md、assets.md 和 verification.md。

依赖T001→T002→T003/T004→T005→T006→T007。本次同一代理顺序实施；当前无未知研究项，无需委派。MVP为清晰棋盘，交互与本地交付完成后签收。
