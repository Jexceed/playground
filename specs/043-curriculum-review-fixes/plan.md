# Implementation Plan: 启蒙与探索题目复核修正

**Branch**: dev | **Date**: 2026-10-11 | **Spec**: [spec.md](spec.md)

## Summary

修复启蒙选项公平性和情境目标、探索题前规则与程序图证据；image-gen 生成播种单帧和同盒子开/关图卡。保留课程身份和原图集，同步标准本地语音、审计、文档及 Mac 安装。

## Technical Context

- Language/version: TypeScript 5.8、React 19、Vite 7、pnpm。
- Dependencies: 现有绘图、Sharp、Node 内置测试、Tauri 2；不增加运行时库或后端。
- Storage: 静态 PNG/MP3/JSON；localStorage 保存原题组进度及按 activityId/revision 区分的探索证据。
- Testing: Node test、课程审计、独立几何/棋盘规则、实际浏览器和安装版 Mac 检查。
- Target: 原 Web/静态发布与 Apple Silicon Mac .app；本轮必须安装 Mac 版。
- Performance: 保持本地读取及现有布局，不增加网络运行依赖或装饰大图。
- Scope: 启蒙 40 组 489 题、探索 75 组 621 项中的指定问题；不增加题量。

## Constitution Check

研究前及设计后均 PASS：图文反馈一致，干扰项对应合理误判，资产本地注册可审计，验证包括 build、curriculum audit 及真实安装，使用 dev。无宪章例外。

## Design and Affected Files

- US1: `src/data/games.ts` 修目标、干扰项、图卡措辞和旋转场景；`src/components/VisualToken.tsx`、必要时 `src/games/ProgressiveSetGame.tsx` 复用本地图组合等价双物体图卡；局部样式保持候选一致。
- US2: `src/curriculum/exploration/{language,logic,graphic,math,memory,life}.ts` 修规则文案；`draw.ts` 为 G16 候选统一方向；只在语义变化分支提升 revision。
- US3: 生成源在 `public/images/items/exploration-art/source/`，运行图同类落盘；`src/data/explorationArt.ts` 独立图覆写 planting 第二项，`imageGallery.ts` 注册；`language.ts`/`presentation.ts` 接 E01 图片支架。原 atlas 字节保持不变。
- Audit: `scripts/lib/illustration-usage.mjs`、`scripts/audit-illustration-usage.mjs` 沿用 frame 审计模型，支持按 1×1 frame 注册的单图，补齐标题和计数说明，核对实际可渲染引用并刷新 `docs/illustration-usage.json`、`docs/illustration-guide.md`。
- Regression: `scripts/curriculum-review-enlightenment.test.mjs`、`scripts/curriculum-review-exploration.test.mjs` 覆盖反例和方向；`scripts/enlightenment-quality.test.mjs`、`scripts/exploration-presentation.test.mjs` 迁移旧断言；`scripts/curriculum-review-invariants.test.mjs` 用 043 修正前快照核对显式题号/字段 allowlist、无关内容深度相等、18 项 revision、答案不变、历史保留及原种植图集/源图哈希；040 历史基线原样保留。
- Delivery: 导出/生成 `public/audio/`，更新 CHANGELOG、TODO、assets，`specs/043-curriculum-review-fixes/verification.md` 记录验证证据。

## Execution

1. 规格和设计完成后，启蒙、探索、图片三个工作面可并行；单文件由一人负责，E01 与探索 language.ts 改动串行整合。
2. 先落实有答案/证据风险的 US1/US2，接入 US3 图卡后独立核验目标活动。
3. 图文稳定后导出并生成标准语音，运行相关回归、课程/插画/语音审计及 build。
4. `pnpm mac:install` 内部再次 build 属交付必要步骤，之后打开真实 .app 检查代表题、语音、返回/恢复和旧进度。
5. 按实际结果关闭任务，记录失败或未验证边界。

## Spec Kit Workflow Evidence

2026-10-11 已读取 speckit-plan、speckit-tasks。无 `.specify/extensions.yml`，故无 before/after hooks。也无 `update-agent-context.sh`；AGENTS 无需新增技术栈或规则，保持不变。

本仓库需同时设置 `SPECIFY_FEATURE=043-curriculum-review-fixes` 与 `SPECIFY_FEATURE_DIRECTORY=specs/043-curriculum-review-fixes` 才能覆盖原 042 feature 上下文；使用两变量运行 setup-plan/setup-tasks，不切 Git 分支。

## Complexity Tracking

无新增基础设施或宪章例外；独立图片按 1×1 frame 复用既有注册/裁帧/审计，不增加 retirement 或新图像模型。
