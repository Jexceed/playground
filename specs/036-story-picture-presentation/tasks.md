# 任务：故事图片展示

## Setup与基础
- [x] T001 在specs/036-story-picture-presentation/记录规格、设计、交互契约与验证路径。

## US1 / P1：扩大默认故事图
独立验收：默认图片尺寸明显增加，E03九题及共享页面在当前Mac一页完整显示。
- [x] T002 [US1] 调整src/interactions/ParentActivity.tsx的模式/材料与步骤工具栏排布。
- [x] T003 [US1] 调整src/styles.css中的故事图片、候选和完成图尺寸，保持题目主操作可达。

## US2 / P1：独立大图查看
独立验收：查看/切图/退出不影响答案与记录，阶段切换不残留记忆图。
- [x] T004 [US2] 在src/interactions/ImageViewer.tsx实现正确单帧、前后切换和键盘关闭。
- [x] T005 [US2] 在ParentActivity.tsx及src/games/ActivitySetGame.tsx接入独立放大入口和阶段清理。

## 验证与交付
- [x] T006 导出src/domain/activity.ts公共文案并生成本地语音，运行build及课程/图片/语音审计，记录verification/。
- [x] T007 用CUA浏览器检查布局与交互，mac:install更新标准.app；更新docs/CHANGELOG.md、docs/TODO.md和本规格验证记录，再保存dev检查点。
- [ ] T008 Mac手动解锁后完成标准.app原生显示与操作复核，同时收尾035图组检查，再推送dev。安装后的再次访问仍提示锁屏，不能用浏览器结果代替。

依赖T001→T002/T003→T004/T005→T006→T007→T008。US1是首个可展示改进，US2补看细节；两者分别人工验收。CSS与组件相互影响，本次顺序完成，不委派。共8项：US1两项，US2两项，准备/交付四项。没有新增技术选择、extension hooks或需要单独执行的代理上下文脚本。
