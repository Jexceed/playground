# Implementation Plan: 057 精确轮廓重绘
Date: 2026-10-25 | Branch: main | Spec: [spec.md](spec.md)

## Technical Context
React/TypeScript/Vite/Tauri；本题测试的是线条、曲率与缺口，使用共享矢量几何源。无新依赖、存储或生成式位图。保留053–056工作。

## Constitution Check
儿童可直接比较形状；不以装饰改变线索。题图与选项几何一致，仅从闭合轮廓中移除一段。纯图形修改不改题库与语音，沿用共享框架。当前main约定优先，无待澄清事项。

## Design
src/data/contourArtwork.ts定义10种标准160坐标轮廓和精确分段；完整轮廓与缺口由同一segments产生。每个目标缺口映射为连续的段索引，苹果顶部附属叶片/枝梗一同隐藏。GraphicContourFigure绘制细致实线、少量内部细节和断点提示，接入ProgressiveSetGame中仅missing/outline模式，其他模式保持原素材/绘制。

## Files and Verification
src/data/contourArtwork.ts、components/GraphicContourFigure.tsx和graphic-contour.css、games/ProgressiveSetGame.tsx；scripts/contour-art.test.mjs；specs/057的逐题联络表及screenshots；docs。验证8题/32选项全部用共享源，缺口连续且真实位于相应方向、全1110题及图库数据不变，端点与保留段一致。浏览器8题错误/正确与375px，build/audit与Mac安装。先完成054–056待解锁原生验收，恢复当前用品放对地方第9题。
