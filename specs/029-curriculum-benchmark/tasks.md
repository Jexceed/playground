# Tasks: 基于上实资料的思维活动扩展

**Input**: spec.md、plan.md、research.md、coverage-matrix.json、data-model.md、contracts/activity-session.md。
**Branch**: dev，本地检查点，不推送；main仅用于用户确认的里程碑。
**Status**: 题库编写与接入已完成：71个纳入题族新增597项，原24项保留，启蒙未改。已完成项记录如下；跨历史版本迁移、细化学习建议与真实儿童校准仍明确保留，不以技术测试代替。
**Validation**: 根据规格的迁移、判定和会话验收要求设置必要语义验证；不为文档变更增加实现镜像测试。


## Phase 1: Setup / M0 本轮设计

这些完成项仅指研究与设计，不代表新课程可玩。

- [x] T001 清点121来源、指纹和页数，保存 specs/029-curriculum-benchmark/source-inventory.json 与 baseline-curriculum.json。
- [x] T002 保留四组研究与逐来源阅读边界于 specs/029-curriculum-benchmark/evidence/、review-ledger.json、source-index.md。
- [x] T003 建立 specs/029-curriculum-benchmark/coverage-matrix.json、spec.md、plan.md、data-model.md 与 contracts/activity-session.md。
- [x] T004 同步 AGENTS.md、.specify/memory/constitution.md、docs/CHANGELOG.md、docs/TODO.md、docs/assets.md、docs/content-package.md；完成文档校验与现有基线build/audit。

## Phase 2: Foundational / 阻塞性基础

先完成纯模型、共享加载和旧数据保护，再接入新玩法。原题仅保留一个权威数据源。

- [x] T005 逐项选定来源与配套答案，独立复核重复/歧义/缺音；在 specs/029-curriculum-benchmark/authoring/source-decisions.json 记录canonicalProblem与采用理由；需使用视频口头讲解时先补完整听取。
- [ ] T006 冻结受支持旧发行的题目指纹和顺序映射于 src/services/progress/legacy-baselines.ts，保留游戏级和题目级历史事实；无版本歧义不得猜映射。
- [x] T007 在 src/domain/activity.ts、advanced-activity.ts 定义可辨识响应联合、库存、合法空白、活动修订、难度维度和来源关系；落实 data-model.md。
- [x] T008 在 src/curriculum/catalog.ts、domains.ts（直接兼容legacyGames） 构建统一目录，保留旧game/round ID；若移动数据，先拆权威定义再改 src/data/games.ts 导出，避免循环依赖。
- [x] T009 升级 scripts/lib/load-game-data.mjs 加载模块图，供应用、scripts/audit-curriculum.mjs、export-voice-lines.mjs 与 douyin-math-export.mjs 共用；基线输出保持40/489及原ID。
- [ ] T010 在 src/services/progress/migrate.ts、store.ts 实现新schema写入校验、旧key备份、迁移标记、幂等恢复和不确定位置回退；保留 src/storage.ts 兼容接口。
- [ ] T011 在 scripts/progress-migration.test.mjs 验证有/无版本、游戏/题目完成分离、二次迁移、损坏/未来schema、重排与题意修订；在 package.json 注册相应验证命令。
- [x] T012 在 src/domain/activity-evaluation.ts、advanced-activity.ts 与 scripts/exploration-framework.test.mjs 实现并验证集合、序列、格位、关系边、连桥network、路径edgeId、构形和多解；使用独立已知解/反例，禁止eval表达式。
- [x] T013 在 src/curriculum/catalog.ts 与 scripts/lib/douyin-math-export.mjs 同时检查交互、阶段、呈现、规则版本、语种和资源预算；保持当前数字岛出口，未支持活动明确排除或失败。

## Phase 3: US1 启蒙与探索入口 / P1

独立验收：旧存档可安全进入启蒙，探索直接呈现资料对标新内容；按部分切换主题和题组，分别续玩，儿童流程没有V1/V2标签。双入口首批实现见pilot-tasks.md T017–T019，其余领域/难度路径仍属本清单。

- [x] T014 [US1] 在 src/App.tsx 与 src/curriculum/domains.ts 以注册表加载旧领域和新领域，保持旧标识/位置兼容；只显示已经验收可玩的活动。
- [x] T015 [US1] 在 src/App.tsx 与 src/games/ActivitySetGame.tsx 展示主题、前置能力、难度和支持选项；家长可调起点，不用年龄或版本硬锁定。
- [x] T016 [US1] 在 specs/029-curriculum-benchmark/verification/full-qa.md 记录旧入口、领域切换、未知旧位置安全回退和稳定ID续玩结果。

## Phase 4: US2 交互与分阶段记忆 / P1

独立验收：各响应类型可完成，错误可撤销，合法空白/重复/多解不误判。M1先做四类各6题的24题试点，其余交互继续完成后支撑全矩阵。

- [x] T017 [US2] 在 src/engine/activity-session.ts 实现ready/observe/listen/retain/respond/feedback/reflect、暂存/提交/跳过，提交才增加尝试；取消旧会话定时器。
- [x] T018 [US2] 在 src/engine/activity-session.ts 与 src/games/ActivitySetGame.tsx 实现展示结束即隐藏再保持、重看重听重启保持、后台暂停恢复和支持记录。
- [x] T019 [US2] 在 src/games/ActivitySetGame.tsx 与 src/interactions/AdvancedInteraction.tsx 实现单选/集合选择，保持旧选择题行为与语音取消。
- [x] T020 [US2] 在 src/games/ActivitySetGame.tsx 与 src/domain/activity-evaluation.ts 实现顺序/格位槽、unlimited/once/counted库存、撤销替换及点击放置兜底。
- [x] T021 [US2] 在 src/interactions/AdvancedInteraction.tsx 与 src/domain/advanced-activity.ts 实现关系连线、桥重数/度数/全连通、edgeId路径、平行边/抬笔/重访和约束反馈。
- [x] T022 [US2] 在 src/interactions/AdvancedInteraction.tsx 实现平面/立体部件的明确位置、朝向、覆盖和多解响应，区分交互误操作与规则误判。
- [x] T023 [US2] 在 src/speech.ts 与 src/games/ActivitySetGame.tsx 统一阶段音频完成/取消/失败事件，缺音不跳过必要听取；重听不泄露未该展示的线索。
- [x] T024 [US2] 在 src/curriculum/pilot/ 制作互不重复的24个活动ID：多选、顺序回填、多空位填格、分阶段记忆各6题；有完整提示、反馈、家长追问和资源。
- [x] T025 [US2] 在 scripts/activity-framework.test.mjs、scripts/exploration-framework.test.mjs 及 specs/029-curriculum-benchmark/verification/full-qa.md 验证阶段转换、真实指针/触控操作、后台、取消、空白、复用与合法多解。

## Phase 5: US3 六域中的数理、空间与记忆题族 / P1

各题族按矩阵适用台阶和变式目标验收；默认三阶各三题，已有内容须等价复核。每题族在authoring/<ID>.md记录子操作覆盖、独立解答、错项理由、资产和语音需求。先逐族设计与纯数据，再顺序整合公共注册表。

- [x] T026 [P] [US3] 完成 N01「点数、基数与数量结构」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N01.md。
- [x] T027 [P] [US3] 完成 N02「数量比较、补齐与移动补差」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N02.md。
- [x] T028 [P] [US3] 完成 N03「数量、排列与容积守恒」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N03.md。
- [x] T029 [P] [US3] 完成 N04「有序分合与枚举」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N04.md。
- [x] T030 [P] [US3] 完成 N05「凑十、破十与数位表征」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N05.md。
- [x] T031 [P] [US3] 完成 N06「情境加减与逆向数量关系」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N06.md。
- [x] T032 [P] [US3] 完成 N07「成组计数、等分与剩余」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N07.md。
- [x] T033 [P] [US3] 完成 N08「连续量等分与面积占比」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N08.md。
- [x] T034 [P] [US3] 完成 N09「序数、排队与重叠计数」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N09.md。
- [x] T035 [P] [US3] 完成 N10「单双、十与个位」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N10.md。
- [x] T036 [P] [US3] 完成 N11「数列、交错规律与数表」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N11.md。
- [x] T037 [P] [US3] 完成 N12「等量替换与图形代数」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N12.md。
- [x] T038 [P] [US3] 完成 N13「货币兑换、付款与找零」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N13.md。
- [x] T039 [P] [US3] 完成 N14「时刻、刻度与经过时间」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N14.md。
- [x] T040 [P] [US3] 完成 N15「自然测量、长度、周长与量感」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N15.md。
- [x] T041 [P] [US3] 完成 N16「日历、星期与周期推算」于 src/curriculum/exploration/math.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/N16.md。
- [x] T042 [P] [US3] 完成 L01「多角度分类与多选集合」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L01.md。
- [x] T043 [P] [US3] 完成 L02「关系配对与类比」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L02.md。
- [x] T044 [P] [US3] 完成 L03「传递关系、排序与证据不足」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L03.md。
- [x] T045 [P] [US3] 完成 L04「多条件排除与填格」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L04.md。
- [x] T046 [P] [US3] 完成 L05「路线约束与一笔走边」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L05.md。
- [x] T047 [P] [US3] 完成 L06「多步计划、优先级与纠错」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L06.md。
- [x] T048 [P] [US3] 完成 L07「条件证据与反向编线索」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L07.md。
- [x] T049 [P] [US3] 完成 L08「现场学规则与迁移」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L08.md。
- [x] T050 [P] [US3] 完成 L09「状态翻转与操作结果」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L09.md。
- [x] T051 [P] [US3] 完成 L10「步长规则、多角色移动与交会」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L10.md。
- [x] T052 [P] [US3] 完成 L11「棋盘排列、连珠与翻转策略」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L11.md。
- [x] T053 [P] [US3] 完成 L12「连桥网络、度数与全局连通」于 src/curriculum/exploration/logic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/L12.md。
- [x] T054 [P] [US3] 完成 G01「观察匹配、局部整体与找差」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G01.md。
- [x] T055 [P] [US3] 完成 G02「遮挡、闭合与纹理补片」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G02.md。
- [x] T056 [P] [US3] 完成 G03「多属性序列与行列矩阵」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G03.md。
- [x] T057 [P] [US3] 完成 G04「位置移动、循环与反弹」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G04.md。
- [x] T058 [P] [US3] 完成 G05「旋转、镜像、缩放与方向性形变」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G05.md。
- [x] T059 [P] [US3] 完成 G06「叠合、求同、求异与减去」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G06.md。
- [x] T060 [P] [US3] 完成 G07「图形金字塔与递归组合」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G07.md。
- [x] T061 [P] [US3] 完成 G08「黑白与颜色编码运算」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G08.md。
- [x] T062 [P] [US3] 完成 G09「点、线、边、角、面与连通部分」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G09.md。
- [x] T063 [P] [US3] 完成 G10「对称轴与对称关系」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G10.md。
- [x] T064 [P] [US3] 完成 G11「开闭、曲直、接触、交叉与内外」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G11.md。
- [x] T065 [P] [US3] 完成 G12「功能标记与不变量」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G12.md。
- [x] T066 [P] [US3] 完成 G13「符号编码与多位对应」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G13.md。
- [x] T067 [P] [US3] 完成 G14「平面与立体拼搭、分割、缺件与多解构形」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G14.md。
- [x] T068 [P] [US3] 完成 G15「折纸、剪孔、展开与逆向折痕」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G15.md。
- [x] T069 [P] [US3] 完成 G16「立体分类、隐藏块与三视图」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G16.md。
- [x] T070 [P] [US3] 完成 G17「相对左右与观察者视角」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G17.md。
- [x] T071 [P] [US3] 完成 G18「立方体展开、相邻面与相对面」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G18.md。
- [x] T072 [P] [US3] 完成 G19「点阵、方格临摹与空间重建」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G19.md。
- [x] T073 [P] [US3] 完成 G20「透明叠层、遮挡关系与顺序计划」于 src/curriculum/exploration/graphic.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/G20.md。
- [x] T074 [P] [US3] 完成 A01「视觉集合记忆与新旧辨认」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A01.md。
- [x] T075 [P] [US3] 完成 A02「位置记忆与图案回填」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A02.md。
- [x] T076 [P] [US3] 完成 A03「顺序、逆序和重复符号记忆」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A03.md。
- [x] T077 [P] [US3] 完成 A04「听觉记忆与复合指令」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A04.md。
- [x] T078 [P] [US3] 完成 A05「故事记忆、细节与复述」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A05.md。
- [x] T079 [P] [US3] 完成 A06「视觉搜索、划消与持续注意」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A06.md。
- [x] T080 [P] [US3] 完成 A07「抑制、规则切换与工作记忆」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A07.md。
- [x] T081 [P] [US3] 完成 A08「声音辨别、音色与节奏顺序」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A08.md。
- [x] T082 [P] [US3] 完成 A09「关联数量与结构记忆」于 src/curriculum/exploration/memory.ts；落实矩阵来源、目标、适用台阶和全部子操作，证据保存 specs/029-curriculum-benchmark/authoring/A09.md。
- [x] T083 [US3] 在 src/curriculum/catalog.ts、src/data/imageGallery.ts、public/images/ 顺序集成US3题族及各自已验证资源；更新 scripts/lib/audit-activity-curriculum.mjs 的题族检查，独立活动数与重复训练轮数分开。
- [x] T084 [US3] 在 specs/029-curriculum-benchmark/verification/full-qa.md 保存各族代表活动的完整实测与关键题截图，尤其几何接触/镜像/遮挡/视图/记忆线索。

## Phase 6: US4 语言、生活与亲子动手 / P2

独立验收：故事/指令/生活/动作可完成，家长有观察要点；英语目标确有英语音频，不把缺音截图当完整试题。P2是实施次序，仍属于全面建设范围。

- [x] T085 [US4] 在 src/interactions/AdvancedInteraction.tsx 与 src/domain/advanced-activity.ts 实现意义/顺序/依据观察量规、线下材料说明与完成记录，不伪造自动正确率。
- [x] T086 [P] [US4] 完成 E01「动作词、反义词与词义关系」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E01.md。
- [x] T087 [P] [US4] 完成 E02「完整句、方位和比较表达」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E02.md。
- [x] T088 [P] [US4] 完成 E03「故事排序、因果和复述」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E03.md。
- [x] T089 [P] [US4] 完成 E04「创编故事、比较方案与理由表达」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E04.md。
- [x] T090 [P] [US4] 完成 E05「字形、拼音与词语对应」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E05.md。
- [x] T091 [P] [US4] 完成 E06「英语听辨与短句理解」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E06.md。
- [x] T092 [P] [US4] 完成 E07「英语中的数量、空间与比较表达」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E07.md。
- [x] T093 [P] [US4] 完成 E08「交流、听问与自我表达」于 src/curriculum/exploration/language.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/E08.md。
- [x] T094 [P] [US4] 完成 P01「生活用品、功能、材料与场景分类」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P01.md。
- [x] T095 [P] [US4] 完成 P02「自然观察、生物特征与成长顺序」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P02.md。
- [x] T096 [P] [US4] 完成 P03「生活科学：浮沉、颜色、影子与切面」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P03.md。
- [x] T097 [P] [US4] 完成 P04「感官、生活安全与社会情境」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P04.md。
- [x] T098 [P] [US4] 完成 P05「节日、文化与世界常识」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P05.md。
- [x] T099 [P] [US4] 完成 P06「亲子动作、精细操作与协调」于 src/curriculum/exploration/life.ts；按矩阵的题目或亲子活动验收，证据保存 specs/029-curriculum-benchmark/authoring/P06.md。
- [x] T100 [US4] 在 scripts/export-voice-lines.mjs、scripts/generate-edge-voices.mjs、scripts/audit-curriculum.mjs 增加显式locale/voice配置和语义检查；中文仍使用Xiaoxiao标准，英语听辨独立审音。
- [x] T101 [US4] 在 src/curriculum/catalog.ts 与 src/data/imageGallery.ts 顺序集成US4资源；在 specs/029-curriculum-benchmark/verification/full-qa.md 记录口述/听辨资源、内容事实与线下观察表单的界面检查。

## Phase 7: US5 学习记录与家长支持 / P2

独立验收：独立完成、提示后完成、跳过、亲子观察与未知历史分开，刷新和迁移不丢事实。

- [ ] T102 [US5] 在 src/services/progress/events.ts 记录提交、提示层级、重看重听、跳过和观察；完成不直接推导掌握。
- [ ] T103 [US5] 在 src/app/ParentProgress.tsx 显示可解释证据与建议练习，保留历史版本未知标记，避免排名或招生成功率表达。
- [x] T104 [US5] 在 scripts/activity-progress.test.mjs 与 scripts/exploration-framework.test.mjs 与 specs/029-curriculum-benchmark/verification/full-qa.md 核对展示/存储一致和旧记录保留；记录清除操作的明确范围。

## Phase 8: US6 全面对标可审计 / P1

独立验收：所有来源有去向，所有纳入题族有活动与证据，未实施/仅参考/未核验不能混入完成分子。

- [x] T105 [US6] 在 scripts/audit-reference-coverage.mjs 与 package.json 注册来源—canonicalProblem—family—activity完整性检查，验证ID、定位、重复关系、采用决定和未解决项。
- [x] T106 [US6] 在 scripts/audit-curriculum.mjs 与 scripts/lib/audit-activity-curriculum.mjs 实现交互/规则/台阶/变式/资产/语音检查；移除受模块拆分影响的脆弱路径匹配时保留等价行为验证。
- [x] T107 [US6] 逐项处理R类参考项及来源缺项，在 specs/029-curriculum-benchmark/authoring/source-decisions.json 记录为何只参考、改编或待核验；不能通过删除条目提高覆盖。
- [x] T108 [US6] 在 specs/029-curriculum-benchmark/verification/coverage-report.json 生成来源处理率、纳入题族完成率、独立活动与可玩轮数；24题试点不得关闭其余任务。

## Phase 9: Polish / 发布与整体校准

只有全部纳入范围与质量门禁完成后才能宣称全面对标实现。

- [x] T109 逐题核对题干/画面/答案/反馈/提示/家长追问，执行 pnpm export:voice-lines 和标准Edge生成，更新 public/audio/voice-lines.json 与 manifest；核对全部locale无缺项。
- [x] T110 运行 pnpm audit:voice-media、pnpm build、pnpm audit:curriculum 及新增语义验证，保存 specs/029-curriculum-benchmark/verification/full-qa.md；说明是否存在macOS或临时mixed语音。
- [x] T111 在1280×820及目标触屏尺寸检查细线、槽位、候选、提示和操作可达性，保留 specs/029-curriculum-benchmark/verification/full-qa.md。
- [ ] T112 观察6、7、8岁各两组亲子共玩，按理解/独立性/提示/解释记录于 specs/029-curriculum-benchmark/verification/play-calibration.md，修订失配难度而不贴年龄能力标签。
- [x] T113 运行 pnpm mac:install 并打开 /Applications/小小思考屋.app 验证启动、离线、语音、各交互及重启进度；将安装和真实应用证据写入 specs/029-curriculum-benchmark/verification/full-qa.md。
- [x] T114 按实际上线范围同步 docs/CHANGELOG.md、docs/TODO.md、docs/content-package.md、docs/assets.md、docs/deployment.md 与 docs/monetization.md 的内容/适龄说明，保持规划与已实现状态一致。
- [x] T115 在dev作本地实现检查点，整体验收后等待用户确认里程碑再合入/推送main；记录发布Tag与产物于 docs/CHANGELOG.md，不推送dev。
- [x] T116 将启蒙/探索入口收紧为36px文字切换，探索增加六域导航与题组查找，在桌面/触屏和真实Mac应用验证。

## Dependencies And Parallel Opportunities

- Setup（本轮）→ Foundation → US1/US2；所有题族依赖其交互与判定支持。
- US3数理/逻辑/图形优先M2，记忆题族为M3；US4语言生活同属M3。
- US5依赖基础进度迁移与US2事件；US6贯穿过程，其最终报告依赖全部纳入题族。
- 标[P]任务仅指独立题族的数据/设计/专属资源文件可并行；catalog、imageGallery、语音总表和发布需顺序集成。
- 同一题族若出现同义来源，合并canonicalProblem，不重复新建题目计数。

## Suggested First Deliverable

Foundation + US1 + US2中的四类24题试点构成首个可玩的增量。必须保留其余未完成任务；之后按US3/US4完整矩阵推进。每次涉及本地体验的交付均执行mac:install，而非只在最终版本安装。

## Task Summary

- 总任务：116（含本轮紧凑入口T116）；状态以逐项勾选为准，历史迁移、细化学习建议和儿童校准仍保留。
- 按故事：US1=3, US2=9, US3=59, US4=17, US5=3, US6=4, shared=20。
- 每个纳入题族有独立内容任务；各族细分操作与异常须在authoring中逐项追踪。

## 全量题库首版实施对照（2026-09-22）

- 实际内容集中于src/curriculum/exploration/下的math、logic、graphic、memory、language、life六个模块；family ID和authoring/<ID>.md保留逐族追踪。计划中的逐族文件路径是分拆建议，未创建空壳文件充完成数。
- 模型/判定/会话复用src/domain/activity.ts、advanced-activity.ts、activity-evaluation.ts和src/engine/activity-session.ts。新增响应集中在src/interactions/AdvancedInteraction.tsx。
- 目录与导航使用catalog.ts、domains.ts和curriculum-navigation.ts；进度事实沿用activity-progress.ts与旧storage.ts，原题定义、ID和内容哈希保持不变。
- T005使用来源定位与原创canonicalProblem记录，不冒称逐道复刻/验算了所有原卷；缺失刺激均原创重建。
- T109以作者解、数量复算、图约束/拼搭独立搜索、题面查重和142个首尾题界面检查验收；真人认知效果仍由T112负责。
- T006/T010/T011：现有旧记录保留、版本保护与稳定ID续玩已验证；完整历史发行识别、迁移备份/标记与跨版本歧义流程仍待实现。
- T102/T103：已记录尝试、提示、重看/重听、重启、跳过与亲子观察；更细的逐次支持历史和建议练习仍待完善，当前不推断掌握程度。
- T112保持未完成，尚未观察6/7/8岁各两组真实亲子。所有自动化/成人操作记录只作技术验收。
- T115仅本地dev检查点；未创建发行Tag、未合入或推送main。

## Phase 10: Convergence

2026-09-23质量复核追加。现有勾选表示历史首版编入/技术检查，不再被解释为完整来源任务等价。证据见 `specs/032-exploration-quality-audit/report.md`、`family-coverage.json` 和 `source-coverage.json`。以下只列尚未完成的建设；032已修复的标签、遮挡多解、分格、题意、语音和旋转预览不重复加入。T006/T010/T011、T102/T103和T112继续保留未完成。

- [ ] T117 CRITICAL / F1 在 `src/curriculum/exploration/graphic.ts` 重建G15折纸打孔题的展开纸、折向、折起轮廓和有效打孔区，使用独立折叠/镜像推演核对；若题意改变需更新revision并保留旧事实。per Constitution I、FR-009、FR-014、SC-005 (contradicts)
- [ ] T118 HIGH / F2 在 `math.ts`、`logic.ts`、`graphic.ts` 修正N13库存、L05最短路线、G04双标记的无效条件：必须存在总额正确但超库存、更长但其余条件合法、红标记正确但蓝标记错误的候选；独立枚举并保留合法多解，记录内容revision。per FR-005、FR-009、FR-022、US3/AC3 (partial)
- [ ] T119 HIGH / F3 在 `graphic.ts` 与活动/交互模型中使G07金字塔中间层可填写、可回看、可逐层核验；保留顶层检查，区分中间推理与仅猜顶层。per FR-005、FR-008、FR-020、SC-002 (partial)
- [ ] T120 HIGH / F4 为L04/L07补行列总数格、行列双属性标题、相对方位多约束九宫格；在 `src/domain/` 增加相应纯判定并独立枚举多解，不能用Latin格或一维排序代替。per FR-005、FR-008、FR-020、SC-002 (partial)
- [ ] T121 HIGH / F5 按032 `family-coverage.json` 的N01–N16逐项补数与量的有效任务和递进，优先混合/部件计数、同量换排列、自主分合与拆十、均分余数、数形联合规律、元角及多商品支付、拨钟/动态提示取样、自然测量与真实月历；每项记录来源任务、孩子实际输入和独立核验，不能仅增数字变式。per FR-005、FR-010、FR-020、SC-002 (partial)
- [ ] T122 HIGH / F6 按032分族记录补L02–L12其余任务分支：关系类比、多方位路径、未知规则归纳与数轴/奇偶教学迁移、多角色二维移动、棋盘连续空格/成线消除、现成桥图填岛数及可产生交叉冲突的桥图；认可24试点已提供的多解排序，不重复计量。per FR-005、FR-008、FR-020、FR-022 (partial)
- [ ] T123 HIGH / F7 按032图形报告补G01–G20其余机制与操作支架，逐族落实局部证据、规则归纳、可验证变换/叠合、点线分类计数、跨层构形、带观察方向的视图/展开与点阵绘线；G09大规模矩形计数先提供可标记分类支架；不将复杂成人原题直接交给儿童。per FR-005、FR-008、FR-010、FR-020、US3/AC4 (partial)
- [ ] T124 HIGH / F8 在 `memory.ts` 与阶段/交互模型中补A01–A09缺失分支，重点先推理再隐藏记忆、二维听画、按条件提取、多属性结构记忆、现场规则切换与乐器音色；区分原创刺激和缺失原音，独立控制数量、相似干扰与保持时长。per FR-007、FR-009、FR-019、FR-020、SC-002 (partial)
- [ ] T125 HIGH / F9 在 `language.ts` 补动作词/情境词义、英语近音辨别、分数/half-past与口头回应任务；将英语理解、概念理解和中文支持分别记录，开放回应使用具体家长量规，不伪造自动口语评分。per FR-012、FR-013、FR-020、US4/AC1、US4/AC3 (partial)
- [ ] T126 HIGH / F10 在 `life.ts`、`logic.ts` 与本地资产中补亲子任务所需的九张猜图卡、自然/文化知识输入、动作示范及绘画折剪模板；按P01/P02/P04/P05/P06原任务细分材料与观察要点，避免只有泛化讨论框架。per FR-009、FR-012、FR-014、FR-020、SC-002 (partial)
- [ ] T127 HIGH / F11 建立来源原任务ID→去重任务→能力分支→活动/处置→证据链，补读仍未精读页与完整视频视听；分别记录重复、参考排除、资料不足和未建，不把121文件、49直接引用、71作者族当任务覆盖率。更新029来源台账与032覆盖记录。per FR-004、FR-019、SC-001、SC-007、US6/AC4 (partial)
- [ ] T128 HIGH / F12 逐族重评 `helpers.ts` 生成的难度元数据，移除reading/motor恒为1、rules/steps直接等于stage的默认校准假象；独立描述前置识读、操作负荷、规则/步骤、表征和支持，校核各阶有效变式并为T112亲子试玩准备观察表。per FR-005、FR-010、SC-002、SC-006 (partial)
- [ ] T129 MEDIUM / F13 对全部独立语音台词按语种进行真实听审，优先英文近音词/短句、中文数字/多音字与长步骤，保存文本/语种/音频版本/听审结果；与既有完整性、时长及播放结束测试分开记录。per FR-013、SC-005、US4/AC3 (partial)
- [ ] T130 MEDIUM / F14 在 `ActivitySetGame.tsx`、相关交互和 `styles.css` 提供短屏图形参照/选项比较布局并压缩375px品牌导航占高；验证1280×720与375×812的线索比较、按钮可达性和本地音频，完成最新 `/Applications/小小思考屋.app` 真实体验复核。per plan: Performance Goals、FR-009、SC-005 (partial)

本次重点核对12项FR（004/005/007/008/009/010/012/013/014/019/020/022）、6项SC（001/002/003/005/006/007）、7项方案决定与5条宪章原则。发现14项：contradicts 1、partial 13；CRITICAL 1、HIGH 11、MEDIUM 2。后续使用speckit-implement实施以上任务，再重新converge；不得因条目已编入而宣称完整对标。
