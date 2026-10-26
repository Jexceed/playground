# 056 Tasks
## 基础
- [x] T001 在 specs/056-island-bridge-goals/ 建立规格、计划和契约。
## US1 桥目标
- [x] T002 [US1] 在 domain/island-bridges.ts 和 IslandBridgeGoal.tsx 实现可数目标与一桥两端小图。
- [x] T003 [US1] 在 GraphInteraction.tsx/island-bridges.css 接入network布局与响应状态。
## US2 规则完整
- [x] T004 [US2] 在 scripts/island-bridges.test.mjs 及精确变更记录验证数量、规则、历史边界和route不变。
## US3 本地交付
- [x] T008 [US3] 修复 scripts/generate-edge-voices.mjs 的同ID旧文本缓存复用，增加 scripts/voice-cache.test.mjs 并定向重生成已确认的6条提示。
- [x] T005 [US3] 更新课程文案、activity-voice-lines.ts和public/audio，完成build/审计及浏览器检查。
- [x] T006 [US3] mac:install并在解锁后完成056与054/055原生检查。
## 收尾
- [x] T007 更新 docs/CHANGELOG.md、TODO.md、assets.md 和 verification.md。

依赖T001→T002→T003→T004/T005→T006→T007。当前同一代理顺序处理，无新增委派。MVP为可读目标；规则与资源交付后验收。
