# 任务：探索配图完整性

## 准备与基础
- [x] T001 在specs/037-task-visual-completeness/形成规格、方案、研究与交互契约。
- [x] T002 在specs/037-task-visual-completeness/review.json记录全部75组的当前表示类型与缺陷，保留源码巡检和UI验收的区别。

## US1 / P1：事件与用途
独立验收：A05六事件、P01九用途图意准确，听完后才可操作，看大图不连线。
- [x] T003 [US1] 用内置imagegen生成两组动作图，保存public/images/items/exploration-art/source及运行PNG，在specs/037-task-visual-completeness/image-prompts.json和asset-manifest.json记录。
- [x] T004 [US1] 在src/data/explorationArt.ts、src/curriculum/exploration/presentation.ts注册并显式映射A05/P01动作。
- [x] T005 [US1] 在src/interactions/MatchingInteraction.tsx及src/styles.css加入独立大图与可读动作卡，保留现有连接交互。

## US2 / P1：材料与操作依据
独立验收：E04三题有对应图片和材料，L07九图/P06模板可用，圆柱等不被误配。
- [x] T006 [US2] 生成并接入两组材料图到public/images/items/exploration-art及src/curriculum/exploration/presentation.ts，去掉错误通用映射。
- [x] T007 [US2] 在src/curriculum/exploration/language.ts、logic.ts、life.ts与presentation.ts修E04材料/图卡，提供L07九图/P06模板，更新受影响revision。
- [x] T008 [US2] 在src/interactions/ParentActivity.tsx、src/games/ActivitySetGame.tsx及src/styles.css保持辅助图、原图比例与记录模式清楚同屏。

## US3 / P1：审计与验收
独立验收：所有新增帧有实际引用、资产/语音对齐；改动题面在Mac可操作。
- [x] T009 [US3] 更新scripts/exploration-presentation.test.mjs、scripts/audit-illustration-usage.mjs及资产几何约束，核对有效答案和隐藏阶段。
- [x] T010 [US3] 导出/生成public/audio、确定性public/images/items/exploration图，运行build、回归及课程/图片/语音审计，把证据留在verification/。
- [x] T011 [US3] CUA浏览器检查75个受影响/相关任务及交互，运行mac:install更新标准.app，记录verification/。

## 交付
- [x] T012 更新docs/CHANGELOG.md、docs/TODO.md、docs/assets.md及verification/qa.md，保存dev检查点。
- [ ] T013 手动解锁后完成真实.app与035/036遗留原生复核，在verification/记录结果，再按已有授权推送dev。

依赖：T001→T002→T003/T006→T004/T007→T005/T008→T009→T010→T011→T012→T013。共13项：准备2、US1三项、US2三项、US3三项、交付2。独立资产生成可用并发工具调用；代码共享文件按顺序实施，不委派代理。没有extension hooks。首先把US1做完整，再接入US2，统一验证。
