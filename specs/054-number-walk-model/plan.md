# Implementation Plan: 054 角色走格子
Date: 2026-10-24 | Branch: main

## Technical Context
React/TypeScript/Vite/Tauri，现有orderedPlacement双槽响应。无新增依赖、存储或新生成美术。保留053未提交工作。

## Constitution Check
儿童看图与操作优先；不自动泄露终点，位置由孩子产生。复用注册PNG；保持精确格子、共享按钮、稳定身份和进度。当前用户main约定优先于旧dev条目。无未决澄清。

## Design
新增NumberWalkEvidence(kind:numberWalk,min,max,turns,actors)，每actor含id red/blue、slotId、start、delta；无终点字段。NumberWalkBoard(model,response,disabled,onPlace)内部只保存选中角色，位置从响应派生；未填显示start，onPlace派发引擎place。两条角色行共用数字路径，保留起点小旗、插图选择与结果位置。图片预加载。隐藏旧静态图、重复clues与通用答题牌库，但语音完整保留。

## Files
src/domain/activity.ts；src/curriculum/exploration/logic.ts；src/interactions/NumberWalkBoard.tsx、number-walk.css；src/games/ActivitySetGame.tsx；scripts/number-walk.test.mjs；public/audio；历史比对精确变更记录和docs。

## Verification
9题原答案/终点契约、空初态、错误/正确、同格、撤销清空及无其他题变化；export:voice-lines、标准Edge、build、audit:curriculum/voice-media；独立浏览器9题及375px；mac:install和原生代表操作，恢复用户位置，不新增真实完成记录。
