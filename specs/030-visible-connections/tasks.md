# Tasks: 看得见、点得中的连接题

## Setup
- [x] T001 记录当前交互缺陷与验收，完成 specs/030-visible-connections/spec.md、plan.md、research.md、data-model.md、contracts/interaction.md、quickstart.md。

## Foundation
- [x] T002 在 src/interactions/connection-state.ts 实现可撤销编辑所用的纯函数，在 scripts/connection-interaction.test.mjs 验证替换、固定桥和合法路线。

## US1 · 配对图面
独立验收：2/3/4 对、左右任意起点、拖动取消、改连/断开/撤销、键盘、窄屏。
- [x] T003 [US1] 在 src/interactions/MatchingInteraction.tsx、src/styles.css 实现配对端点和连线、点击/拖动、清晰选择和断开。
- [x] T004 [US1] 在 src/domain/activity.ts、src/curriculum/exploration/helpers.ts 标记文字图卡并同步指令，在 src/interactions/AdvancedInteraction.tsx 接入组件。
- [x] T010 [US1] 在 src/domain/advanced-activity.ts 和 src/curriculum/exploration/logic.ts 接受重复圆形的等价配对，并在 scripts/connection-interaction.test.mjs 验证错误形状仍拒绝。

## US2 · 地图操作
独立验收：直接操作边/岛、真实双桥、固定桥、方向、平行边、撤销。
- [x] T005 [US2] 在 src/interactions/GraphInteraction.tsx、src/styles.css 实现图上控件和状态，并在 src/interactions/AdvancedInteraction.tsx 接入。
- [x] T006 [US2] 更新 src/curriculum/exploration/logic.ts 的图面操作说明。

## US3 · 本地一致性
独立验收：本地语音对齐，构建审计无错，真实 app 代表流程，安装完成。
- [x] T007 [US3] 导出、生成和审计 public/audio/，将测试/build/课程审计结果保存至 specs/030-visible-connections/verification/。
- [ ] T008 [US3] 桌面/375px和 pnpm mac:install 已完成；Mac锁屏，等待解锁完成真实 app 操作后补全 specs/030-visible-connections/verification/qa.md 和截图。

## Polish
- [x] T009 更新 docs/CHANGELOG.md、docs/TODO.md 和本 tasks.md，在 local dev 保存检查点。

## Dependencies and strategy
T001→T002→US1/US2→US3→T009。先让配对真实可见，再让桥/路在图面操作。US1、US2实现可独立验证；实际本轮顺序执行，无代理委派。10项任务：基础2项、US1 3项、US2 2项、US3 2项、收尾1项；均含明确路径。
