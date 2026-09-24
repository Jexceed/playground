# Tasks: 探索整体复核

## Setup
- [x] T001 完成 specs/032-exploration-quality-audit/spec.md、plan.md、模型与报告契约。
- [x] T002 全量比对来源库存与当前目录，将边界写入 verification/source-inventory-check.json。

## US1 · 内容、语音、UX
- [x] T003 [US1] 汇总 research/ 下71族语义复核及试点检查，记录具体反例和未验证项。
- [x] T004 [US1] 检查 src/domain/activity.ts、src/speech.ts 与 voice manifest 的台词/语种/触发/资源，保存 verification/voice-ux.json。

## US2 · 来源任务覆盖
- [x] T005 [US2] 用研究报告及原页证据生成 family-coverage.json、source-coverage.json，区分partial/unknown与排除。
- [x] T006 [US2] 修正 scripts/audit-reference-coverage.mjs 的结构数量口径，防止将71族作者记录当全任务验收。

## US3 · 明确结论
- [x] T007 [US3] 编写 report.md，直接回答用户两问，列出缺口和优先级，更新 docs/curriculum-benchmark.md。
- [x] T008 [US3] 按speckit-converge仅在 specs/029-curriculum-benchmark/tasks.md 追加尚未实现的可追踪任务。

## US4 · 已确认缺陷修复
- [x] T009 [US4] 在 helpers.ts 重编号纯候选标记，并添加 scripts/exploration-quality.test.mjs 回归，保持语义标签和tokenId。
- [x] T010 [US4] 在 src/domain/layer-visibility.ts / graphic.ts 修复可见遮挡约束，独立穷举合法序列。
- [x] T011 [US4] 在 math.ts 修正N08分格表征和N10输入/亲子追问边界。

## US5 · 验证与安装
- [x] T012 [US5] 更新图片/语音并完成build、课程、语音和针对性测试，保存verification/。
- [ ] T013 [US5] 用标准/窄屏与Applications真实app核对修复，执行mac:install并保存证据。浏览器与安装已完成；Mac持续锁定，最新原生重开复验待解锁（不以旧原生证据替代）。
- [x] T014 更新 docs/CHANGELOG.md、docs/TODO.md；在本地dev保存，不推送。

依赖：研究T002–T005可并行，T009–T011依赖相应反例；T006/T007/T008依据完整汇总；T012→T013→T014。代理仅写各自研究文件，业务修复由主线程执行。

## Audit follow-through
- [x] T015 [US1] 在 src/speech.ts 按locale索引语音，并在 scripts/speech.test.mjs 验证同文异语种不会串音；现题无跨语种同文冲突需如实报告。
- [x] T016 [US1] 在 ActivitySetGame.tsx、ParentActivity.tsx 修正听/看阶段文案，接通已生成的亲子步骤语音。
- [x] T017 [US4] 在 logic.ts 修正L07亲子猜图活动的目标泄漏，保留三个不同线索组织方案。
- [x] T018 [US4] 在 AdvancedInteraction.tsx 让拼搭部件预览使用实际旋转后的占格，浏览器验证90度预览及放置结果一致，重新构建安装。

## 2026-09-24 当前Mac跟进复核
- [x] T019 [US1] 复核3660c2b三栏UI、与e98f3dc的课程/判定/语音不变性、独立条件反例和实际Mac交互；见followup-2026-09-24.md及verification/followup-2026-09-24/。保留应用代码，记录新增插画回归、任务溢出和原有教学缺口。
- [ ] T020 [US1] 手动解锁后补完最新亲子观察三行radio选择/清空的原生检查；本轮最后操作因Mac锁定未完成，不计为通过。
