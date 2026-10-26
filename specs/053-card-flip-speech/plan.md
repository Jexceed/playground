# Implementation Plan: 053 翻牌关键指令优先朗读

Date: 2026-10-23 | Branch: main | Spec: [spec.md](spec.md)

## Technical Context
React 19、TypeScript、Vite、Tauri。沿用本地 Edge 中文语音及统一 speak。无新增依赖、存储字段或外部API。

## Constitution Check
以孩子听懂动作为目的；结构化steps控制文字与音频；答案和进度不变；本地资源可追踪；完成构建、审计及Mac安装。按最新用户/AGENTS约定继续main，旧宪法dev条目不适用。

## Research and Design
独立只读诊断已确认9题clues和manifest中存在具体步骤，第3题关键动作在12.288秒整段末尾，单步音频2.712秒。决定使cardFlip主朗读仅按序读具体动作，小喇叭读单步；避免三句泛化说明占据开头。共享helper在src/domain/rule-play.ts，domain/activity.ts选择翻牌朗读，RulePlayBoards和activity-voice-lines及logic生成器复用helper。保留统一speech播放和切题取消机制。

## Project Structure
src/domain/rule-play.ts、src/domain/activity.ts、src/interactions/RulePlayBoards.tsx、src/curriculum/activity-voice-lines.ts、src/curriculum/exploration/logic.ts；public/audio；scripts/card-flip-speech.test.mjs；specs/053-card-flip-speech/verification；docs/CHANGELOG.md和TODO.md。

## Verification
导出及标准Edge生成、清理仅本轮替代音频；pnpm build、audit:curriculum、audit:voice-media及相关回归。浏览器查看实际音频请求/结束，9题及第3题重听/单步/切题；mac:install并验证真实应用入口、题号、听题/单步，保持已有进度。

## 流程执行说明
setup-plan、setup-tasks脚本已执行；本地无extensions.yml，无扩展钩子。update-agent-context.sh在本仓库不存在（检索.specify确认），保留现有AGENTS.md，以本计划记录技术上下文。
