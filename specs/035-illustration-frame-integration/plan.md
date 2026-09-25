# 实施方案：补齐插画题目引用

实际Git分支：dev；特征目录035。日期2026-09-25；输入[spec.md](spec.md)。

## Summary
纠正planting图集前两格从未接入的遗漏。L06依照稳定step ID使用本变式的完整图组，调整种植首两步文字，A05种植事件统一图组。提供逐帧引用审计和实际入口，不改布局。

## Technical Context
React 19、TypeScript 5、Vite 7、Tauri；使用现有GalleryImage.frame和本地Edge语音流水线。存储继续使用现有按活动ID/revision的localStorage事实。Node内建测试与现有TypeScript loader；目标为当前Mac1280×820。无新依赖、无新服务、无未解决技术选择。范围为L06三个活动的文字/图片和A05第6题图片，另审计11组44帧。

## Constitution Check
图文一致，保留亲子解释；spec先于修改；原图不重画且注册不变；语音随文字更新；build/curriculum/voice/逐帧审计及Mac真实验证；更新CHANGELOG、TODO和assets文档。设计前后均无违反项。无extension hooks；update-agent-context脚本不存在，沿用AGENTS原则。

## Phase 0 / research
历史d1a3497已把准备种子/放入土里映射到catPlant，导致planting0/1没有运行引用；当前与最初一致。来源图片已实际查看，与用户附件内容一致。现有渲染组件可正确按帧裁切，无须改组件。没有需要委派的未知项或新技术选型。详见research.md。

## Phase 1 / design
- logic.ts把L06种植步骤改为取花盆、放土和种子、轻轻浇水、等待发芽，并将第1/4/7题revision升为2。
- presentation.ts按L06变式及step ID显式映射planting/painting/fruitSalad，去掉对其它题族不适用的种植别名；A05第6题用planting1/2/3。E03保持catPlant。
- scripts/lib/illustration-usage.mjs收集实际可渲染帧的引用，区分图卡、材料、故事和证据，按图组报告未用帧、题组与题号。
- scripts/audit-illustration-usage.mjs输出机器记录及docs/illustration-guide.md；缺帧/未注册引用失败，不能仅凭目录存在判定接入完成。

## Verification / delivery
先写两项会失败的集成回归。生成图示、导出并生成Edge语音，清理孤立语音，刷新作者记录。运行相关Node测试、pnpm build、pnpm audit:curriculum、pnpm audit:voice-media、新逐帧审计。pnpm mac:install更新标准Applications应用，实际看L06第4/6/7/9题和A05第6题，确认原图与题面一致、四格齐全且保持同屏。记录剩余真实儿童/完整听审边界。最后提交并推送dev。

## Project Structure
沿用src/curriculum/exploration、src/data、public/images/items/exploration-art、public/audio、scripts/lib、docs、specs；只有新审计脚本和035证据，无新顶层目录或复杂度例外。
