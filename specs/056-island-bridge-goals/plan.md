# Implementation Plan: 056 具象桥数量目标
Date: 2026-10-24 | Branch: main | Spec: [spec.md](spec.md)

## Technical Context
React/TypeScript/Vite/Tauri，沿用GraphInteraction和network response.counts。无新依赖、持久字段或生成式图片。

## Constitution Check
先表达物体与差别；N个小格与真实桥数一一对应，一座桥同时计入两个端点。仅本岛桥数匹配不等于完成整题。共享框架、按钮主题及图模型保持；复用注册本地图。保留053–055工作。当前main约定优先，无未知研究项。

## Design
新增domain/island-bridges.ts的纯数量模型、文案与每岛目标朗读；IslandBridgeGoal组件呈现目标/已填/缺少/多余，BridgeLegend小图讲一桥两端计数。GraphInteraction仅network分支更换岛内内容/局部尺寸与legend，route保留。node位置/edge几何不变；六岛地图min-width460、窄屏局部滚动。超额仍允许尝试，不自动修正或封锁路径。

## Files and Verification
src/domain/island-bridges.ts、activity.ts、advanced-activity.ts；curriculum/exploration/logic.ts、activity-voice-lines.ts；interactions/GraphInteraction.tsx、IslandBridgeGoal.tsx、island-bridges.css；ActivitySetGame.tsx隐藏重复network小字。新增scripts/island-bridges.test.mjs、精确文案normalizer及docs。验证9题固定桥计数、两端同步、欠/满/超额、解除超额、循环/undo/clear、断开/交叉仍拒绝、route不受影响；浏览器九题与375px；本地语音、build、audit及Mac安装。

## 验证中发现的语音缓存缺陷
voice-line ID截断到80字符；本次在长提示后半段补充控制说明后ID不变，Edge生成器只检查文件媒体质量而未比较旧manifest输入，导致6条提示复用了旧文件。必须在generate-edge-voices中同时核对原文本、实际发音文本、语言、voice/rate/pitch和src才能复用缓存；无输入记录也不复用。增加voice-cache回归，并定向重生成本次已确认受影响的6条提示，保留前后hash/时长证据。
