# 051 Tasks

## 基础

- [x] T001 建立 specs/051-rule-play-art/ 的需求、设计与独立验收。
- [x] T002 生成并落地 public/images/items/rule-play/ 贴图，记录source与prompt。

## US1 规则机

- [x] T003 [US1] 在 src/data/imageGallery.ts 注册素材，在 src/games/ActivitySetGame.tsx 预加载。
- [x] T004 [US1] 重做 src/interactions/RulePlayBoards.tsx 中规则机、托盘、步骤与操作按钮。

## US2 翻牌

- [x] T005 [US2] 在 src/interactions/RulePlayBoards.tsx 接入双面贴图和参考/步骤卡片。
- [x] T006 [US2] 在 src/interactions/rule-play.css 制作卡牌材质、翻转和轻量操作区。

## US3 整体交付

- [x] T007 [US3] 在 src/interactions/rule-play.css 统一配色、字级、间距与窄屏适配。
- [x] T008 [US3] 完成自动/浏览器/图片检查，记录到 verification/。
- [x] T009 [US3] pnpm mac:install后做原生检查，保存实际效果截图到 verification/。
- [x] T010 更新 docs/assets.md、docs/CHANGELOG.md、docs/TODO.md 与 verification.md。

依赖：T001→T002→T003/T004/T005→T006/T007→T008→T009→T010。本次顺序实施。US1以真实机身及数量演示独立验收；US2以所有牌数与正反切换独立验收；US3以窗口与真实应用验收。
