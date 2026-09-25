# 任务：补齐插画题目引用

## Phase 1：Setup
- [x] T001 完成spec/plan/research/data-model/contracts/quickstart，记录于specs/035-illustration-frame-integration/。

## Phase 2：Foundation
- [x] T002 建立可渲染帧引用收集器scripts/lib/illustration-usage.mjs，保留修复前未用帧证据。

## Phase 3：US1 / P1 完整图组（MVP）
独立验收：指定题号的帧序列与来源正确，水果/E03不受影响，三道实质修改题revision=2。
- [x] T003 [US1] 在scripts/exploration-presentation.test.mjs补充整套图组回归并验证修复前失败。
- [x] T004 [US1] 修改src/curriculum/exploration/logic.ts和presentation.ts的种植步骤、稳定ID映射及revision。

## Phase 4：US2 / P2 逐帧可追踪
独立验收：11组44帧均有可渲染引用，文档能给出真实题组/题号。
- [x] T005 [US2] 在scripts/audit-illustration-usage.mjs和package.json接入逐帧审计，生成docs/illustration-guide.md与035机器报告。
- [x] T006 [US2] 在scripts/exploration-presentation.test.mjs验证无未用帧/未注册引用，并更新docs/assets.md的审计规则。

## Final：资源、验收与交付
- [x] T007 导出/生成标准语音与图示，刷新specs/029-curriculum-benchmark/authoring/，更新docs/CHANGELOG.md和docs/TODO.md。
- [ ] T008 运行quickstart中的build、curriculum、voice、回归与Mac安装/原生检查，记录specs/035-illustration-frame-integration/verification/；提交并推送dev。

依赖：T001→T002→T003→T004→T005/T006→T007→T008。全部任务符合checkbox/ID/用户故事/文件路径格式。MVP是US1补齐图组；US2收集器可以独立运行，但最终无遗漏结论依赖US1修复。存在不同文件的审计/文档并行机会，本次规模小，顺序完成，不委派代理。无extension hooks。
