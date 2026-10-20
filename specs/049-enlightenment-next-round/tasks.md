# Tasks: 启蒙连续答题与完成去向

## Setup
- [x] T001 完成 specs/049-enlightenment-next-round/spec.md、plan.md 和设计合同，记录原生复现。

## US1：重玩顺序前进
- [x] T002 [US1] 在 scripts/enlightenment-navigation.test.mjs 建立历史完成/漏题的行为回归，接入 package.json。
- [x] T003 [US1] 实现 src/domain/enlightenment.ts 导航函数并在 src/games/ProgressiveSetGame.tsx 统一按钮和处理函数。

独立验收：全40组历史全部完成时每道非末题都准确前进一题。

## US2：末题有明确去向
- [x] T004 [US2] 在 src/services/curriculum-navigation.ts 实现同主题下一组，src/App.tsx 连接完成与新组起点。
- [x] T005 [US2] 在 src/games/ProgressiveSetGame.tsx 展示末组完成反馈与重玩，补齐末题/搜索/单题边界测试。

独立验收：部分完成末题回漏题；全部完成进入下一组；主题末组完成和重玩都可见。

## US3：历史与本地体验
- [x] T006 [US3] 浏览器检查跳题/切组/重玩/持久化/桥与记忆局部状态，证据保存 specs/049-enlightenment-next-round/verification.md。
- [x] T007 [US3] 执行相关回归、build、audit:curriculum、语音一致性检查，记录 specs/049-enlightenment-next-round/verification.md。
- [x] T008 [US3] mac:install、原生实际操作、恢复原位置及完成数核对，记录 specs/049-enlightenment-next-round/verification.md。

独立验收：历史题完成数不增加，保存的位置为实际到达位置，安装应用包含最终代码。

## Delivery
- [x] T009 更新 docs/CHANGELOG.md、docs/TODO.md 及此任务完成状态，检查范围和未完成验收。

依赖：T001→T002/T003→T004/T005→T006/T007→T008→T009。US1 为最小修复，本次连同US2/US3交付。独立纯函数测试可并行运行；共享代码/浏览器/安装顺序执行，无需并行代理。
