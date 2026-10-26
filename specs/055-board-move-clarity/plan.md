# Implementation Plan: 055 清楚表达棋盘下一步
Date: 2026-10-24 | Branch: main | Spec: [spec.md](spec.md)

## Technical Context
React/TypeScript/Vite/Tauri；保持multiSelect tokenIds与原引擎。无新依赖、存储或生成图片。精确棋盘/棋子使用HTML/CSS材质，固定棋子与空候选形态不同。

## Constitution Check
以孩子分辨物体和操作为目标；数字只在无障碍行列坐标中出现，不占据空格中心。一次仅展示一颗试放子，多选是独立位置集合，不拼接答案形成伪赢法。原题身份和评分保持，语音同步；沿用共享按钮主题。当前用户main约定优先，保留053/054未提交工作。无待澄清项。

## Design
BoardMoveEvidence {kind:boardMove,columns:3|4,goal:line3|capture,cells:(black|white|null)[],candidates:{cell,tokenId}[]}，没有答案字段。数据直接由原作者棋盘与原tokens构成；4x4原来未列入候选的空格不画试放圈，避免扩大选项。BoardMoveBoard只本地保存previewCell，答案从response.tokenIds读取；点击格不dispatch，点击选入才toggle。response/model/disabled变化收回试放子，共享undo/clear正确反映。

## Files
src/domain/activity.ts、board-move.ts；curriculum/exploration/logic.ts、activity-voice-lines.ts；interactions/BoardMoveBoard.tsx、board-move.css；games/ActivitySetGame.tsx；scripts/board-move.test.mjs及精确历史normalizer；public/audio；docs与specs/055。

## Verification
新模型逐格等于原图，候选/答案不变；试放不写进度、一次一颗、固定子锁定、全部9题错误/正确、取消/undo/clear、完成锁定、窄屏和语音。pnpm build、audit:curriculum、audit:voice-media、相关回归；Mac安装并检查055和054。未做儿童试玩不称为已验证理解。
