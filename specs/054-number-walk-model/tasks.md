# 054 Tasks
## 基础
- [x] T001 建立 specs/054-number-walk-model/ 流程与契约。
## US1 看图理解
- [x] T002 [US1] 在 activity.ts、logic.ts 新增9题numberWalk模型并调整instruction。
- [x] T003 [P] [US1] 实现 NumberWalkBoard.tsx 与 number-walk.css 的角色规则和棋盘。
## US2 直接操作
- [x] T004 [US2] 在 ActivitySetGame.tsx 接入预加载和place，取代旧图/牌库。
- [x] T005 [P] [US2] 在 scripts/number-walk.test.mjs 验证9题契约、作答和共享历史。
## US3 本地交付
- [x] T006 [US3] 更新 public/audio 及精确历史变更记录，完成构建审计与浏览器/原生检查。
## 收尾
- [x] T007 更新 docs/CHANGELOG.md、TODO.md 与 verification.md。

T001→T002/T003/T005→T004→T006→T007。组件和独立回归在契约下并行，父代理负责模型/接入/音频/安装。MVP是US1，全部操作及交付门禁后完成。
