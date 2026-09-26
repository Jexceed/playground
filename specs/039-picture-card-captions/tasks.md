# 任务

## 准备
- [x] T001 完成specs/039-picture-card-captions规格、方案及契约。
## US1 / P1：框内大图
- [x] T002 [US1] 在src/games/ActivitySetGame.tsx拆分图片框与名称视觉层；在src/domain/activity.ts及src/curriculum/exploration/presentation.ts显式保留L06原始乱序。
- [x] T003 [US1] 在src/styles.css扩大图片、收窄框内边距、设置框外文字及状态外观。
## US2 / P1：交互保持
- [x] T004 [US2] CUA检查选择、名称点击、键盘、拖放和放大，在verification/记录当前Mac单页结果。
## 验证与交付
- [x] T005 运行相关回归、build与课程/图集/语音审计，记录verification/。
- [x] T006 mac:install更新标准.app，更新docs/CHANGELOG.md、TODO.md和verification/qa.md，保存dev检查点。
- [ ] T007 手动解锁后原生复核新安装.app，收尾035～038门禁，按已有授权推送dev。

依赖T001→T002→T003→T004→T005→T006→T007。7项：准备1、US1两项、US2一项、交付3。共享组件顺序实施，无独立代理任务；只读检查可并行。先完成框内大图再做交互与单页复核，无hooks。
