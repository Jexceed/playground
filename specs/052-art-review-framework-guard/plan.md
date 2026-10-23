# Implementation Plan: 052 图片审查与框架边界

Date:2026-10-23 | Branch:main | Spec:[spec.md](spec.md)

React19/TS5/Vite7/Tauri，继续现有工作区。无新运行时依赖。先移除rule-play.css对公共框架的外观覆盖，再建立图像和代码图形审查台账，生成带编号的审查页，逐项记录保留或修复理由。非平凡改动追踪到asset ID、题组和检查证据。

## Constitution Check

图文一致、精确关系和稳定身份优先；本地图注册并存source；仅图像范围迭代，不做公共主题重设计；规格/计划/任务在全量实施前完成。依用户要求在main继续。无待澄清事项。

## 范围与代码

- src/interactions/rule-play.css：公共颜色/边框/选中状态回退；必要图像字号布局保留。
- scripts/ 与 specs/052.../review：逐图清单、实际引用、裁帧和审查图片；发现项确定后补充具体修改文件。
- public/images、src/data/imageGallery.ts及精确图形生成器：仅已审查发现项。
- docs/assets.md、CHANGELOG、TODO：边界规则与完成记录。

## 验证

pnpm build；pnpm audit:curriculum；相关Node回归；导出语音并与当前包比较；图片文件/注册/原图/精确几何审计；浏览器检查实际图片和按钮computedStyle；pnpm mac:install及原生查看。

## 已确认的修复范围

16张image_gen透明素材；12个旧素材注册入口更新；VisualToken精细图片映射；111个生成图的数量/钟面/拼音/朝向/跨格文字修复；VisualComparison与记忆数量图片；GraphInteraction小岛与桥面；E05窄屏题面排版。公共框架只恢复051覆盖，保留050的可读字号。

历史回归的冻结JSON保持原字节，新增050/051/052精确变更记录后再归一化比对；未知美术修改或非图像答案修改不会被放过。
