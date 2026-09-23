# Plan: 探索呈现优化
Branch: dev | 2026-09-23 | spec.md

## Summary
探索使用宽题面和紧凑导航，家长提示/累计记录折叠到题面下；启蒙保留原结构。拆出共用ActivityTokenArt与ActivityEvidence。文字卡直接排文字，实物/故事卡用注册PNG，复杂几何图按实际长宽比展示，可放大查看。亲子活动用准备/步骤/记录三个明确区块。作者能力术语从默认反馈移到家长区。

## Technical context
TypeScript/React/Vite/Tauri沿用锁文件，无新框架。图片用内置imagegen与已有本地gallery；几何线条由现有draw/generator保证精度。离线本地进度不变，未知数据不伪造。浏览器验证与真实Mac均需通过，测试用node:test和现有catalog/evaluation。

## Constitution gates
先spec/plan/tasks后实施。图片有来源和prompt登记，场景1200×675并注册，题目关键数量由数据控制。没有新权限/云数据流程。语音因共享文案改变按标准Edge导出生成。文档与安装同步，不推送。

## Files and design
src/App.tsx、src/styles.css：探索两列结构、题内导航与折叠家长辅助区。
src/games/ActivitySetGame.tsx：阅读层次、证据面板、语义图卡与反馈。
src/interactions/ActivityTokenArt.tsx、ActivityEvidence.tsx、ParentActivity.tsx：共享呈现。
src/curriculum/exploration/presentation.ts：明确的题族插画映射，不推断答案。
src/data/imageGallery.ts、explorationArt.ts：注册本地插画和来源信息。
public/images/items/exploration-art/及source：故事插画与源图。
scripts/exploration-presentation.test.mjs：资产语义/记忆遮挡配置/题目身份与答案回归。
specs/031-exploration-presentation/：逐族审查、prompts、验证证据。

## Verification
build、audit:curriculum、test:activities、connection/exploration回归；voice export→标准Edge→audit；六域及各interaction desktop/narrow截图；mac:install后只打开/重启Applications标准安装，不再打开同名开发副本。
设计后检查无宪章冲突。当前唯一资料调研交给独立只读研究代理，代码/资源由主线程实施。

## Asset rendering follow-through
`generate-exploration-media.mjs` derives the used visual diagram set and renders its 639 PNGs at 2x density. Source SVG dimensions and activity identities stay unchanged. All 11 atlases, 44 frames and final paths are listed in asset-manifest.json; the materials atlas prevents wood/plastic/metal substitutions.
