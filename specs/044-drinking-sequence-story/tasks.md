# 044 任务

## Setup
- [x] T001 在 specs/044-drinking-sequence-story/ 建立规格、方案和历史调查。
- [x] T002 保存 verification/baseline.json，登记本轮边界和图片提示。

## US1 情境先行
- [x] T003 [US1] 生成并保存 public/images/scenes/ 两种喝水起始场景及source，注册到src/data/imageGallery.ts。
- [x] T004 [US1] 在src/data/games.ts对第1/9/18题接入场景和开始/回看流程；保留答案和身份。

## US2 动作与播放
- [x] T005 [US2] 保存六幅动作图（含两幅干扰选项）并登记src/data/orderStories.ts。
- [x] T006 [US2] 实现src/components/OrderSequenceBoard.tsx成功填空、暂停、单步、重播和减少动态支持，配套src/styles.css。
- [x] T007 [US2] 添加scripts/drinking-sequence.test.mjs，检查错误/成功填空、题目边界与图片。

## US3 验收
- [x] T008 [US3] 导出并生成标准Edge语音，核对manifest与voice-lines。
- [x] T009 [US3] 完成build、curriculum及相关回归、浏览器交互验收，记录verification/。
- [x] T010 [US3] mac:install并原生查看，核对进度和安装身份。

## 收尾
- [x] T011 更新docs/CHANGELOG.md、docs/TODO.md、docs/assets.md和verification.md。

依赖：T001→T002→T003/T005→T004/T006→T007/T008→T009→T010→T011。图片准备和组件设计可独立进行；本轮在一个代理中执行。先完成US1可查看情境，再完成US2交互，最后统一验收。
