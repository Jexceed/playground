# Tasks: 探索呈现优化

## Setup
- [x] T001 完成 specs/031-exploration-presentation/spec.md、plan.md、模型与契约。
- [x] T002 完成 specs/031-exploration-presentation/family-presentation-review.json 的71族呈现审查。

## US1 · 清楚的题面
- [x] T003 [US1] 在 src/App.tsx / src/styles.css 实现探索宽题面、紧凑导航和折叠家长区。
- [x] T004 [US1] 在 src/games/ActivitySetGame.tsx 与 src/interactions/ActivityTokenArt.tsx 统一文字/插画/图示渲染、证据缩放和反馈层次。

## US2 · 有内容的图
- [x] T005 [US2] 生成并登记 public/images/items/exploration-art/ 下故事图卡、source与prompts，更新 src/data/explorationArt.ts / imageGallery.ts。
- [x] T006 [US2] 在 src/curriculum/exploration/presentation.ts / helpers.ts / life.ts 复用实物图，修正textOnly，接入故事图卡及明确的情境证据。

## US3 · 内容组织
- [x] T007 [US3] 在 src/interactions/ParentActivity.tsx 分开材料、步骤和观察记录，接入 AdvancedInteraction.tsx。
- [x] T008 [US3] 在 src/App.tsx / ActivitySetGame.tsx 呈现阶段分组和清楚的操作引导，作者说明移至家长入口。

## US4 · 验证和安装
- [x] T009 [US4] 在 scripts/exploration-presentation.test.mjs 校验资源/身份/答案/记忆证据条件，并完成构建、课程、语音审计。
- [ ] T010 [US4] 浏览器及四类真实Mac操作已通过，最终包已安装；最后重启因Mac锁屏待补。保存 specs/031-exploration-presentation/verification/ 下的六域/交互/尺寸浏览器证据与真实Applications安装验收。

## Polish
- [x] T011 更新 docs/CHANGELOG.md、docs/TODO.md、docs/assets.md，在本地dev保存检查点。

Dependencies: T001→审查与布局；T003/T004和插画T005可独立推进；T005→T006；T004/T006/T007/T008→T009→T010→T011。
先共享题面，再逐族媒体和亲子组织，最后整体验收。11项任务：Setup2、US1 2、US2 2、US3 2、US4 2、Polish1；研究代理只写审查文件，不并行修改代码。
