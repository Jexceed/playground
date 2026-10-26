# 053 Tasks

## 基础
- [x] T001 在 specs/053-card-flip-speech/ 记录诊断、规格、计划和契约。

## US1 直接听到操作
独立验收：9题主朗读从具体步骤开始，小喇叭文字一致，重复步骤完整。
- [x] T002 [US1] 在 src/domain/rule-play.ts 实现共享步骤朗读，接入 activity.ts、RulePlayBoards.tsx、logic.ts 和 activity-voice-lines.ts。
- [x] T003 [P] [US1] 在 scripts/card-flip-speech.test.mjs 检查9题步骤顺序、本地音频与原题库契约。

## US2 本地交付
独立验收：本地资源齐全，真实安装有效且无新增完成记录。
- [x] T004 [US2] 更新 public/audio/voice-lines.json 和本地Edge语音，清理本轮替代文件，记录 verification/。
- [x] T005 [US2] 运行构建、审计和相关回归，在 verification/ 记录浏览器实际音频及Mac安装检查。

## 收尾
- [x] T006 更新 docs/CHANGELOG.md、docs/TODO.md 和 verification.md。

依赖：T001→T002/T003→T004→T005→T006。T002实现和T003独立回归可并行；其余顺序完成。MVP为US1，全部本地资源和安装后交付。
