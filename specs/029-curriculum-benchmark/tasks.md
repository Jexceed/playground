# Tasks: 基于上实资料的思维活动扩展

**Input**: spec.md、plan.md、research.md、coverage-matrix.json、data-model.md、contracts/activity-session.md。
**Branch**: dev，本地检查点，不推送；main仅用于用户确认的里程碑。
**Status**: 本轮完成M0研究设计，所有运行时与题库实施任务保持未完成。
**Validation**: 根据规格的迁移、判定和会话验收要求设置必要语义验证；不为文档变更增加实现镜像测试。


## Phase 1: Setup / M0 本轮设计

这些完成项仅指研究与设计，不代表新课程可玩。

- [x] T001 清点121来源、指纹和页数，保存 specs/029-curriculum-benchmark/source-inventory.json 与 baseline-curriculum.json。
- [x] T002 保留四组研究与逐来源阅读边界于 specs/029-curriculum-benchmark/evidence/、review-ledger.json、source-index.md。
- [x] T003 建立 specs/029-curriculum-benchmark/coverage-matrix.json、spec.md、plan.md、data-model.md 与 contracts/activity-session.md。
- [x] T004 同步 AGENTS.md、.specify/memory/constitution.md、docs/CHANGELOG.md、docs/TODO.md、docs/assets.md、docs/content-package.md；完成文档校验与现有基线build/audit。

## Phase 2: Foundational / 阻塞性基础

先完成纯模型、共享加载和旧数据保护，再接入新玩法。原题仅保留一个权威数据源。

- [ ] T005 逐项选定来源与配套答案，独立复核重复/歧义/缺音；在 specs/029-curriculum-benchmark/authoring/source-decisions.json 记录canonicalProblem与采用理由；需使用视频口头讲解时先补完整听取。
- [ ] T006 冻结受支持旧发行的题目指纹和顺序映射于 src/services/progress/legacy-baselines.ts，保留游戏级和题目级历史事实；无版本歧义不得猜映射。
- [ ] T007 在 src/domain/activity.ts、response.ts 定义可辨识响应联合、库存、合法空白、活动修订、难度维度和来源关系；落实 data-model.md。
- [ ] T008 在 src/curriculum/catalog.ts、domains.ts、legacy-adapter.ts 构建统一目录，保留旧game/round ID；若移动数据，先拆权威定义再改 src/data/games.ts 导出，避免循环依赖。
- [ ] T009 升级 scripts/lib/load-game-data.mjs 加载模块图，供应用、scripts/audit-curriculum.mjs、export-voice-lines.mjs 与 douyin-math-export.mjs 共用；基线输出保持40/489及原ID。
- [ ] T010 在 src/services/progress/migrate.ts、store.ts 实现新schema写入校验、旧key备份、迁移标记、幂等恢复和不确定位置回退；保留 src/storage.ts 兼容接口。
- [ ] T011 在 scripts/progress-migration.test.mjs 验证有/无版本、游戏/题目完成分离、二次迁移、损坏/未来schema、重排与题意修订；在 package.json 注册相应验证命令。
- [ ] T012 在 src/domain/evaluators/ 与 scripts/activity-evaluation.test.mjs 实现并验证集合、序列、格位、关系边、连桥network、路径edgeId、构形和多解；使用独立已知解/反例，禁止eval表达式。
- [ ] T013 在 src/curriculum/capabilities.ts 与 scripts/lib/douyin-math-export.mjs 同时检查交互、阶段、呈现、规则版本、语种和资源预算；保持当前数字岛出口，未支持活动明确排除或失败。

## Phase 3: US1 连续课程路径 / P1

独立验收：旧存档可安全进入，原活动可访问；主题中找到挑战并返回，儿童流程没有V1/V2入口。

- [ ] T014 [US1] 在 src/App.tsx 与 src/curriculum/domains.ts 以注册表加载旧领域和新领域，保持旧标识/位置兼容；只显示已经验收可玩的活动。
- [ ] T015 [US1] 在 src/app/CurriculumPath.tsx 展示主题、前置能力、难度和支持选项；家长可调起点，不用年龄或版本硬锁定。
- [ ] T016 [US1] 在 specs/029-curriculum-benchmark/verification/navigation.md 记录旧入口、领域切换、未知旧位置安全回退和稳定ID续玩结果。

## Phase 4: US2 交互与分阶段记忆 / P1

独立验收：各响应类型可完成，错误可撤销，合法空白/重复/多解不误判。M1先做四类各6题的24题试点，其余交互继续完成后支撑全矩阵。

- [ ] T017 [US2] 在 src/engine/session.ts 实现ready/observe/listen/retain/respond/feedback/reflect、暂存/提交/跳过，提交才增加尝试；取消旧会话定时器。
- [ ] T018 [US2] 在 src/engine/memory-protocol.ts 与 support-events.ts 实现展示结束即隐藏再保持、重看重听重启保持、后台暂停恢复和支持记录。
- [ ] T019 [US2] 在 src/interactions/choice/ 与 multi-select/ 实现单选/集合选择，保持旧选择题行为与语音取消。
- [ ] T020 [US2] 在 src/interactions/placement/ 实现顺序/格位槽、unlimited/once/counted库存、撤销替换及点击放置兜底。
- [ ] T021 [US2] 在 src/interactions/matching/、network/ 与 route/ 实现关系连线、桥重数/度数/全连通、edgeId路径、平行边/抬笔/重访和约束反馈。
- [ ] T022 [US2] 在 src/interactions/construction/ 实现平面/立体部件的明确位置、朝向、覆盖和多解响应，区分交互误操作与规则误判。
- [ ] T023 [US2] 在 src/services/speech/ 与 src/speech.ts 统一阶段音频完成/取消/失败事件，缺音不跳过必要听取；重听不泄露未该展示的线索。
- [ ] T024 [US2] 在 src/curriculum/pilot/ 制作互不重复的24个活动ID：多选、顺序回填、多空位填格、分阶段记忆各6题；有完整提示、反馈、家长追问和资源。
- [ ] T025 [US2] 在 scripts/activity-session.test.mjs 及 specs/029-curriculum-benchmark/verification/interaction-pilot.md 验证阶段转换、真实指针/触控操作、后台、取消、空白、复用与合法多解。

## Phase 5: US3 六域中的数理、空间与记忆题族 / P1

各题族按矩阵适用台阶和变式目标验收；默认三阶各三题，已有内容须等价复核。每题族在authoring/<ID>.md记录子操作覆盖、独立解答、错项理由、资产和语音需求。先逐族设计与纯数据，再顺序整合公共注册表。

- [ ] T026 [P] [US3] 完成 N01「点数、基数与数量结构」于 src/curriculum/math/counting-cardinality.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N01.md。
- [ ] T027 [P] [US3] 完成 N02「数量比较、补齐与移动补差」于 src/curriculum/math/compare-transfer.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N02.md。
- [ ] T028 [P] [US3] 完成 N03「数量、排列与容积守恒」于 src/curriculum/math/number-conservation.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N03.md。
- [ ] T029 [P] [US3] 完成 N04「有序分合与枚举」于 src/curriculum/math/number-partitions.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N04.md。
- [ ] T030 [P] [US3] 完成 N05「凑十、破十与数位表征」于 src/curriculum/math/make-break-ten.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N05.md。
- [ ] T031 [P] [US3] 完成 N06「情境加减与逆向数量关系」于 src/curriculum/math/quantity-stories.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N06.md。
- [ ] T032 [P] [US3] 完成 N07「成组计数、等分与剩余」于 src/curriculum/math/group-share.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N07.md。
- [ ] T033 [P] [US3] 完成 N08「连续量等分与面积占比」于 src/curriculum/math/area-fractions.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N08.md。
- [ ] T034 [P] [US3] 完成 N09「序数、排队与重叠计数」于 src/curriculum/math/ordinal-queue.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N09.md。
- [ ] T035 [P] [US3] 完成 N10「单双、十与个位」于 src/curriculum/math/parity-place-value.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N10.md。
- [ ] T036 [P] [US3] 完成 N11「数列、交错规律与数表」于 src/curriculum/math/number-sequences.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N11.md。
- [ ] T037 [P] [US3] 完成 N12「等量替换与图形代数」于 src/curriculum/math/symbol-equations.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N12.md。
- [ ] T038 [P] [US3] 完成 N13「货币兑换、付款与找零」于 src/curriculum/math/money-shopping.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N13.md。
- [ ] T039 [P] [US3] 完成 N14「时刻、刻度与经过时间」于 src/curriculum/math/time-elapsed.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N14.md。
- [ ] T040 [P] [US3] 完成 N15「自然测量、长度、周长与量感」于 src/curriculum/math/measurement-boundaries.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N15.md。
- [ ] T041 [P] [US3] 完成 N16「日历、星期与周期推算」于 src/curriculum/math/calendar-cycles.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N16.md。
- [ ] T042 [P] [US3] 完成 L01「多角度分类与多选集合」于 src/curriculum/logic/multi-rule-classification.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L01.md。
- [ ] T043 [P] [US3] 完成 L02「关系配对与类比」于 src/curriculum/logic/relations-analogies.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L02.md。
- [ ] T044 [P] [US3] 完成 L03「传递关系、排序与证据不足」于 src/curriculum/logic/transitive-order.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L03.md。
- [ ] T045 [P] [US3] 完成 L04「多条件排除与填格」于 src/curriculum/logic/constraint-grid.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L04.md。
- [ ] T046 [P] [US3] 完成 L05「路线约束与一笔走边」于 src/curriculum/logic/route-constraints.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L05.md。
- [ ] T047 [P] [US3] 完成 L06「多步计划、优先级与纠错」于 src/curriculum/logic/planning-repair.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L06.md。
- [ ] T048 [P] [US3] 完成 L07「条件证据与反向编线索」于 src/curriculum/logic/evidence-reasoning.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L07.md。
- [ ] T049 [P] [US3] 完成 L08「现场学规则与迁移」于 src/curriculum/logic/learn-rule-transfer.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L08.md。
- [ ] T050 [P] [US3] 完成 L09「状态翻转与操作结果」于 src/curriculum/logic/toggle-state.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L09.md。
- [ ] T051 [P] [US3] 完成 L10「步长规则、多角色移动与交会」于 src/curriculum/logic/multi-agent-movement.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L10.md。
- [ ] T052 [P] [US3] 完成 L11「棋盘排列、连珠与翻转策略」于 src/curriculum/logic/board-strategy.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L11.md。
- [ ] T053 [P] [US3] 完成 L12「连桥网络、度数与全局连通」于 src/curriculum/logic/bridge-networks.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L12.md。
- [ ] T054 [P] [US3] 完成 G01「观察匹配、局部整体与找差」于 src/curriculum/graphic/visual-search-match.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G01.md。
- [ ] T055 [P] [US3] 完成 G02「遮挡、闭合与纹理补片」于 src/curriculum/graphic/occlusion-texture.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G02.md。
- [ ] T056 [P] [US3] 完成 G03「多属性序列与行列矩阵」于 src/curriculum/graphic/feature-matrices.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G03.md。
- [ ] T057 [P] [US3] 完成 G04「位置移动、循环与反弹」于 src/curriculum/graphic/position-transform.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G04.md。
- [ ] T058 [P] [US3] 完成 G05「旋转、镜像、缩放与方向性形变」于 src/curriculum/graphic/rotation-reflection.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G05.md。
- [ ] T059 [P] [US3] 完成 G06「叠合、求同、求异与减去」于 src/curriculum/graphic/shape-set-operations.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G06.md。
- [ ] T060 [P] [US3] 完成 G07「图形金字塔与递归组合」于 src/curriculum/graphic/recursive-composition.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G07.md。
- [ ] T061 [P] [US3] 完成 G08「黑白与颜色编码运算」于 src/curriculum/graphic/symbolic-color-rules.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G08.md。
- [ ] T062 [P] [US3] 完成 G09「点、线、边、角、面与连通部分」于 src/curriculum/graphic/geometric-counts.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G09.md。
- [ ] T063 [P] [US3] 完成 G10「对称轴与对称关系」于 src/curriculum/graphic/symmetry-axes.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G10.md。
- [ ] T064 [P] [US3] 完成 G11「开闭、曲直、接触、交叉与内外」于 src/curriculum/graphic/topology-relations.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G11.md。
- [ ] T065 [P] [US3] 完成 G12「功能标记与不变量」于 src/curriculum/graphic/marker-invariants.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G12.md。
- [ ] T066 [P] [US3] 完成 G13「符号编码与多位对应」于 src/curriculum/graphic/symbol-codes.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G13.md。
- [ ] T067 [P] [US3] 完成 G14「平面与立体拼搭、分割、缺件与多解构形」于 src/curriculum/graphic/shape-assembly.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G14.md。
- [ ] T068 [P] [US3] 完成 G15「折纸、剪孔、展开与逆向折痕」于 src/curriculum/graphic/fold-cut.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G15.md。
- [ ] T069 [P] [US3] 完成 G16「立体分类、隐藏块与三视图」于 src/curriculum/graphic/solid-views-count.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G16.md。
- [ ] T070 [P] [US3] 完成 G17「相对左右与观察者视角」于 src/curriculum/graphic/relative-perspective.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G17.md。
- [ ] T071 [P] [US3] 完成 G18「立方体展开、相邻面与相对面」于 src/curriculum/graphic/cube-nets.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G18.md。
- [ ] T072 [P] [US3] 完成 G19「点阵、方格临摹与空间重建」于 src/curriculum/graphic/grid-copy-reconstruction.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G19.md。
- [ ] T073 [P] [US3] 完成 G20「透明叠层、遮挡关系与顺序计划」于 src/curriculum/graphic/layer-order-planning.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G20.md。
- [ ] T074 [P] [US3] 完成 A01「视觉集合记忆与新旧辨认」于 src/curriculum/memory/visual-set-memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A01.md。
- [ ] T075 [P] [US3] 完成 A02「位置记忆与图案回填」于 src/curriculum/memory/spatial-memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A02.md。
- [ ] T076 [P] [US3] 完成 A03「顺序、逆序和重复符号记忆」于 src/curriculum/memory/sequence-memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A03.md。
- [ ] T077 [P] [US3] 完成 A04「听觉记忆与复合指令」于 src/curriculum/memory/auditory-instructions.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A04.md。
- [ ] T078 [P] [US3] 完成 A05「故事记忆、细节与复述」于 src/curriculum/memory/story-recall.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A05.md。
- [ ] T079 [P] [US3] 完成 A06「视觉搜索、划消与持续注意」于 src/curriculum/memory/attention-search.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A06.md。
- [ ] T080 [P] [US3] 完成 A07「抑制、规则切换与工作记忆」于 src/curriculum/memory/inhibition-switch.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A07.md。
- [ ] T081 [P] [US3] 完成 A08「声音辨别、音色与节奏顺序」于 src/curriculum/memory/sound-rhythm.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A08.md。
- [ ] T082 [P] [US3] 完成 A09「关联数量与结构记忆」于 src/curriculum/memory/relational-quantity-memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A09.md。
- [ ] T083 [US3] 在 src/curriculum/catalog.ts、src/data/imageGallery.ts、public/images/ 顺序集成US3题族及各自已验证资源；更新 scripts/audit/ 的题族检查，独立活动数与重复训练轮数分开。
- [ ] T084 [US3] 在 specs/029-curriculum-benchmark/verification/number-logic-space-memory.md 保存各族代表活动的完整实测与关键题截图，尤其几何接触/镜像/遮挡/视图/记忆线索。

## Phase 6: US4 语言、生活与亲子动手 / P2

独立验收：故事/指令/生活/动作可完成，家长有观察要点；英语目标确有英语音频，不把缺音截图当完整试题。P2是实施次序，仍属于全面建设范围。

- [ ] T085 [US4] 在 src/interactions/parent-observation/ 与 src/domain/observation.ts 实现意义/顺序/依据观察量规、线下材料说明与完成记录，不伪造自动正确率。
- [ ] T086 [P] [US4] 完成 E01「动作词、反义词与词义关系」于 src/curriculum/language/vocabulary-relations.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E01.md。
- [ ] T087 [P] [US4] 完成 E02「完整句、方位和比较表达」于 src/curriculum/language/describe-relations.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E02.md。
- [ ] T088 [P] [US4] 完成 E03「故事排序、因果和复述」于 src/curriculum/language/story-sequence-expression.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E03.md。
- [ ] T089 [P] [US4] 完成 E04「创编故事、比较方案与理由表达」于 src/curriculum/language/creative-explanation.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E04.md。
- [ ] T090 [P] [US4] 完成 E05「字形、拼音与词语对应」于 src/curriculum/language/character-phonics.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E05.md。
- [ ] T091 [P] [US4] 完成 E06「英语听辨与短句理解」于 src/curriculum/language/english-listening.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E06.md。
- [ ] T092 [P] [US4] 完成 E07「英语中的数量、空间与比较表达」于 src/curriculum/language/bilingual-concepts.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E07.md。
- [ ] T093 [P] [US4] 完成 E08「交流、听问与自我表达」于 src/curriculum/language/conversation-self-expression.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E08.md。
- [ ] T094 [P] [US4] 完成 P01「生活用品、功能、材料与场景分类」于 src/curriculum/life/everyday-classification.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P01.md。
- [ ] T095 [P] [US4] 完成 P02「自然观察、生物特征与成长顺序」于 src/curriculum/life/nature-growth.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P02.md。
- [ ] T096 [P] [US4] 完成 P03「生活科学：浮沉、颜色、影子与切面」于 src/curriculum/life/science-experiments.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P03.md。
- [ ] T097 [P] [US4] 完成 P04「感官、生活安全与社会情境」于 src/curriculum/life/senses-social-rules.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P04.md。
- [ ] T098 [P] [US4] 完成 P05「节日、文化与世界常识」于 src/curriculum/life/culture-world.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P05.md。
- [ ] T099 [P] [US4] 完成 P06「亲子动作、精细操作与协调」于 src/curriculum/life/fine-motor-action.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P06.md。
- [ ] T100 [US4] 在 scripts/export-voice-lines.mjs、scripts/generate-edge-voices.mjs、scripts/audit-curriculum.mjs 增加显式locale/voice配置和语义检查；中文仍使用Xiaoxiao标准，英语听辨独立审音。
- [ ] T101 [US4] 在 src/curriculum/catalog.ts 与 src/data/imageGallery.ts 顺序集成US4资源；在 specs/029-curriculum-benchmark/verification/language-life-parent.md 记录口述、听辨、事实核验和线下操作检查。

## Phase 7: US5 学习记录与家长支持 / P2

独立验收：独立完成、提示后完成、跳过、亲子观察与未知历史分开，刷新和迁移不丢事实。

- [ ] T102 [US5] 在 src/services/progress/events.ts 记录提交、提示层级、重看重听、跳过和观察；完成不直接推导掌握。
- [ ] T103 [US5] 在 src/app/ParentProgress.tsx 显示可解释证据与建议练习，保留历史版本未知标记，避免排名或招生成功率表达。
- [ ] T104 [US5] 在 scripts/progress-evidence.test.mjs 与 specs/029-curriculum-benchmark/verification/progress.md 核对展示/存储一致和旧记录保留；记录清除操作的明确范围。

## Phase 8: US6 全面对标可审计 / P1

独立验收：所有来源有去向，所有纳入题族有活动与证据，未实施/仅参考/未核验不能混入完成分子。

- [ ] T105 [US6] 在 scripts/audit-reference-coverage.mjs 与 package.json 注册来源—canonicalProblem—family—activity完整性检查，验证ID、定位、重复关系、采用决定和未解决项。
- [ ] T106 [US6] 在 scripts/audit-curriculum.mjs 与 scripts/audit/ 实现交互/规则/台阶/变式/资产/语音检查；移除受模块拆分影响的脆弱路径匹配时保留等价行为验证。
- [ ] T107 [US6] 逐项处理R类参考项及来源缺项，在 specs/029-curriculum-benchmark/authoring/source-decisions.json 记录为何只参考、改编或待核验；不能通过删除条目提高覆盖。
- [ ] T108 [US6] 在 specs/029-curriculum-benchmark/verification/coverage-report.json 生成来源处理率、纳入题族完成率、独立活动与可玩轮数；24题试点不得关闭其余任务。

## Phase 9: Polish / 发布与整体校准

只有全部纳入范围与质量门禁完成后才能宣称全面对标实现。

- [ ] T109 逐题核对题干/画面/答案/反馈/提示/家长追问，执行 pnpm export:voice-lines 和标准Edge生成，更新 public/audio/voice-lines.json 与 manifest；核对全部locale无缺项。
- [ ] T110 运行 pnpm audit:voice-media、pnpm build、pnpm audit:curriculum 及新增语义验证，保存 specs/029-curriculum-benchmark/verification/release-checks.md；说明是否存在macOS或临时mixed语音。
- [ ] T111 在1280×820及目标触屏尺寸检查细线、槽位、候选、提示和操作可达性，保留 specs/029-curriculum-benchmark/verification/visual-qa.md。
- [ ] T112 观察6、7、8岁各两组亲子共玩，按理解/独立性/提示/解释记录于 specs/029-curriculum-benchmark/verification/play-calibration.md，修订失配难度而不贴年龄能力标签。
- [ ] T113 运行 pnpm mac:install 并打开 /Applications/小小思考屋.app 验证启动、离线、语音、各交互及重启进度；将安装和真实应用证据写入 specs/029-curriculum-benchmark/verification/mac-app.md。
- [ ] T114 按实际上线范围同步 docs/CHANGELOG.md、docs/TODO.md、docs/content-package.md、docs/assets.md、docs/deployment.md 与 docs/monetization.md 的内容/适龄说明，保持规划与已实现状态一致。
- [ ] T115 在dev作本地实现检查点，整体验收后等待用户确认里程碑再合入/推送main；记录发布Tag与产物于 docs/CHANGELOG.md，不推送dev。

## Dependencies And Parallel Opportunities

- Setup（本轮）→ Foundation → US1/US2；所有题族依赖其交互与判定支持。
- US3数理/逻辑/图形优先M2，记忆题族为M3；US4语言生活同属M3。
- US5依赖基础进度迁移与US2事件；US6贯穿过程，其最终报告依赖全部纳入题族。
- 标[P]任务仅指独立题族的数据/设计/专属资源文件可并行；catalog、imageGallery、语音总表和发布需顺序集成。
- 同一题族若出现同义来源，合并canonicalProblem，不重复新建题目计数。

## Suggested First Deliverable

Foundation + US1 + US2中的四类24题试点构成首个可玩的增量。必须保留其余未完成任务；之后按US3/US4完整矩阵推进。每次涉及本地体验的交付均执行mac:install，而非只在最终版本安装。

## Task Summary

- 总任务：115；M0设计完成4项，其余未完成。
- 按故事：US1=3, US2=9, US3=59, US4=17, US5=3, US6=4, shared=20。
- 每个纳入题族有独立内容任务；各族细分操作与异常须在authoring中逐项追踪。
