# Implementation Plan: 051 规则玩具美术重做

Branch: main | Date: 2026-10-23 | Spec: [spec.md](spec.md)

## Summary / Technical Context

React19 / TypeScript5 / Vite7 / Tauri，沿用状态机。使用内置image_gen生成4件透明贴图：规则机、浅木托盘、奶白卡面、金黄卡面。落地为本地PNG并在imageGallery.items注册。真实数量由CountingDiscs渲染，生成图不含数量和文字。

## Constitution Check

具体可操作玩具；小量有目的的贴图；保持判题与进度；规格/任务先于实施；运行build、curriculum audit、mac:install并原生查看。用户当前main约定优先。无新网络运行时依赖，无待澄清问题。

## Project Structure

- public/images/items/rule-play/ 与 source/：贴图、原图、提示词、来源清单。
- src/data/imageGallery.ts：注册运行时图片。
- src/interactions/RulePlayBoards.tsx：机身贴图、盘面组合、双面卡牌、明确操作目标。
- src/interactions/rule-play.css：重写该局部视觉样式，减框、纹理、配色、布局和翻面动效。
- src/games/ActivitySetGame.tsx：新贴图预加载。
- docs/assets.md / CHANGELOG.md / TODO.md：资产和交付证据。

## Validation

pnpm build；pnpm audit:curriculum；node --test scripts/rule-play.test.mjs scripts/exploration-framework.test.mjs scripts/activity-framework.test.mjs scripts/activity-progress.test.mjs scripts/round-speech-navigation.test.mjs；pnpm export:voice-lines并核对内容未变；pnpm mac:install。

图片透明通道、尺寸、注册、本地文件存在检查。浏览器覆盖18题关键流程及375px、1280px排版，原生三个阶段代表题实测，截图逐张视觉确认。无文案改动则复用已对齐本地Edge语音。
