# 047 Tasks

## Setup
- [x] T001 冻结课程与规格，完成 specs/047-child-readable-logic/spec.md 和 verification/baseline.json。
- [x] T002 只读审查已有图片，完成 specs/047-child-readable-logic/research.md 与 plan.md、contracts/ui.md。

## US1 分类特征直接可见
- [x] T003 [US1] 修改 src/data/games.ts 的分类1–8题分组语言；在 LogicChoicePicture.tsx 显示直接特征图。

## US2 具体的河流情境
- [x] T004 [US2] gpt-6.1-sol通过image_gen制作两张无字河景，保存 public/images/scenes/source 和 art-river.json。
- [x] T005 [US2] 在 imageGallery.ts 注册并在 logicLessonVisuals.ts 应用新情境与大材料图；同步6题文案。
- [x] T006 [US2] 在 LogicBridgeChoice.tsx 与样式改善专门模型选项的可读大小并缩短文案。

## US3 简短的单层选项
- [x] T007 [US3] 移除8道证据概念题的重复图与徽标，缩短生活/证据选择并保留必要图义。

## US4 验证与交付
- [x] T008 [US4] 更新语义边界回归，导出并增量生成Edge语音，核对本地manifest。
- [x] T009 [US4] 浏览器逐项检查变更题和代表图义，执行构建、课程、图库、媒体验证。
- [x] T010 [US4] mac:install后原生验收，保存安装签名、截图、完成数与恢复位置。
- [x] T011 更新 docs/CHANGELOG.md、docs/TODO.md、verification.md 并提交推送dev。

依赖：规格/研究 → 分类/图片/选项设计 → 集成 → 语音/测试 → 原生 → 交付。研究可与图资源制作并行，共享源码及安装/Git操作顺序执行。MVP为US1，但本轮交付全部故事。
