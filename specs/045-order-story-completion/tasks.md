# 045 Tasks

## Setup
- [x] T001 保存spec/plan与verification/baseline.json、rounds.json，确认dev工作区。
- [x] T002 建立逐题视觉合同与绘图分工清单于asset-brief.json。

## US1 初始情境
- [x] T003 [P] [US1] gpt-6.1-sol绘制门锁/小鱼/种植场景和图卡，保留PNG/source/manifest。
- [x] T004 [P] [US1] gpt-6.1-sol绘制卫生点心/学习用品/出门场景和图卡，保留PNG/source/manifest。
- [x] T005 [P] [US1] gpt-6.1-sol绘制搭塔/分类/交通/模型桥场景和图卡，保留PNG/source/manifest。
- [x] T006 [US1] 主代理逐一视觉核查并注册src/data/orderStoryAssets.ts与imageGallery.ts。

## US2 图卡与选项
- [x] T007 [US2] src/data/orderStories.ts按题号映射全部步骤与三个选项，不得留fallback。
- [x] T008 [US2] src/data/games.ts所有24题接入sceneImage/sequenceStory和统一指令。

## US3 顺序演示
- [x] T009 [US3] OrderSequenceBoard/ProgressiveSetGame通用化，检查五步与长文案布局。
- [x] T010 [US3] 添加逐题资产/填空/语义边界测试，保留旧历史快照。

## US4 验收
- [x] T011 [US4] 语音导出/Edge补齐、生产构建、课程及语音审计与相关回归。
- [x] T012 [US4] 浏览器逐题验证24题场景/任务/成功、代表性交互与长题布局。
- [x] T013 [US4] mac:install并原生验收，记录签名/身份/进度与覆盖。
- [x] T014 更新CHANGELOG/TODO/assets/verification，保留本地dev检查点。

依赖：T001→T002→并行T003–005→T006–008→T009–010→T011–013→T014。主代理可在绘图期间完成通用组件和测试基础；最终资产语义审查与验收顺序执行。
