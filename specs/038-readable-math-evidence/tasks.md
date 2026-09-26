# 任务

## 基础
- [x] T001 形成specs/038-readable-math-evidence规格、方案、研究与契约。
## US1：数量比较
- [x] T002 [US1] 在src/domain/activity.ts与src/curriculum/exploration/math.ts声明并接入两栏数量表示。
- [x] T003 [US1] 在src/interactions/ActivityEvidence.tsx、src/styles.css实现可读标题、等大圆点与放大。
## US2：同类图示
- [x] T004 [US2] 在math.ts、draw.ts、presentation.ts接入独立双钟面与简单数学图布局提示。
- [x] T005 [US2] 在ActivitySetGame.tsx、scripts/generate-exploration-media.mjs及审计收集器补齐新表示图像路径。
## US3：验证
- [x] T006 [US3] 在scripts/exploration-presentation.test.mjs补数量/图片语义回归；生成图示并检查语音对齐，运行build与各项审计，记录verification/。
- [x] T007 [US3] CUA验收99道相关数学题的同屏、可读性和反馈；mac:install更新标准.app。
## 收尾
- [x] T008 更新docs/CHANGELOG.md、TODO.md、assets.md与verification/qa.md，保存dev检查点。
- [ ] T009 手动解锁后原生复核新安装.app及035～037待办，再按已有授权推送dev。

依赖T001→T002/T004→T003/T005→T006→T007→T008→T009。9项：基础1、US1两项、US2两项、US3两项、收尾2。共享组件顺序实施、不委派。独立只读检查可并行；MVP先完成截图N02的可读比较，再完成相关数学图。无扩展hooks。
