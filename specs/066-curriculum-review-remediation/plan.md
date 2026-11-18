# 两阶段课程修复方案

2026 年 11 月 18 日，main。[规格](spec.md)

React、TypeScript、Vite、Tauri 沿用项目现有依赖。按原始电子题库与浏览器复现处理报告 01–23，覆盖 489 道启蒙题和 633 项探索。

- **布局**　在 src/styles.css 的题面容器内自适应。窄屏输入实点验收，左右比较保持含义，缩放题参照与选项同尺度。
- **启蒙**　在 src/data/games.ts 和 ProgressiveSetGame 补充分解与分配模型，沿用本地图片。重新表述通行、分类与钟表条件。
- **探索**　在六域题族与 pilot 模块调整变式、干扰项、空白卡和亲子观察。新增或改变的图面由原有生成器导出。按活动身份和修订号保存历史证据。
- **共用交互**　在 activity-evaluation、activity-session 和单选出题入口修复提交、重看和反馈。保持正确、重试、撤销、回看与下一题各自的行为。
- **交付**　按 23 项逐条回归，导出语音、生成 Edge 本地资源，核验新旧清单及未引用资源。运行相关测试、pnpm build、pnpm audit:curriculum、pnpm audit:voice-media、pnpm mac:install 并打开真实应用。维护 CHANGELOG、TODO 和复核结果。

内容规范、儿童可解释性、本地资源及原进度均纳入验收。此次只在本机安装。
