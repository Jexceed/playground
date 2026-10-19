# Implementation Plan: Child-readable Logic House

**Branch**: dev | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

## Summary
修正046引入的额外解码负担。直接呈现分类特征；复用故事画风、补足短板缺口；判断选项保留单层短文字；明确区分图画和数格模型。

## Technical Context
TypeScript 5.8 / React 19 / Vite / Tauri macOS。既有图片库、本地Edge语音、progress存储沿用。影响src/data/games.ts、logicLessonVisuals.ts、LogicChoicePicture/LogicLessonBoard/LogicBridgeChoice及样式，新增2张无字场景（基于旧图编辑）。无新依赖、外部接口、存储迁移。

## Constitution Check
通过：儿童能看懂的图义优先；先写规格与任务；资产注册并保存来源；验收与实际儿童试玩明确区分；题目ID、答案值、选择顺序和既有记录不变。新图用gpt-6.1-sol+image_gen；数值专门题仍用同单位图形，不能以生成图估算。

## Implementation
1. 冻结adc06b78课程，登记准确文案变化；分类1–8题改成分组；同类短选项统一。
2. 6道生活桥题不再用格线SVG作为场景。改为明确短板缺口/跨岸场景及清楚材料选择；已有数值题做相应定性文案调整，训练目标仍为长度条件。
3. 8道证据判断去掉概念选项的重复图片/徽标，事实选择保留真实场景裁图。明确允许纯文字选择，不为了覆盖率强迫每个选项有图。
4. 8道专门搭桥题保留数格数据，选择图裁去多余留白/页脚、放大，选项缩短。
5. 导出语音并生成Edge增量，核对manifest，必要定向回归、pnpm build、pnpm audit:curriculum、audit:voice-media。浏览器逐题检查改动题，Mac安装并抽查全部新视觉类型。

## Structure and verification
spec/research/data-model/contracts/quickstart/tasks与verification放本目录。图源保存在public/images/scenes/source；无意义篮子旧资产保留历史但停止引用。原生只对已完成题重做成功提交；未完成题仅看图和错选。提交推送沿用本会话已授权dev，不改main。

## Research
只读审查确认旧河景可作情境，不能单独证明短板不够；长短木板应在相同显示尺度下比较；概念词没有可直接表意的图片时采用短文字+语音。无未解决技术未知。
