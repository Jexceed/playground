# Research: 资料对标与设计决定

## Sources And Method

资料来自用户指定本地目录。121文件已逐项记录SHA-256与格式：56 PDF/1301物理页、47图片、16视频、1Word、1PPT。
Word由40嵌入图组成，渲染20页；PPT共25张幻灯片；视频约96分19秒。
文件指纹未发现字节级重复，但题本/答案/分卷及跨文件截图存在语义重复，不能累加题量。
实际阅读覆盖见 [source-index.md](source-index.md)、review-ledger.json 与 evidence/ 的四组报告。

研究在课程讲义文本、扫描题页联系表、代表页放大、题本与答案抽样对照和当前代码检查之间交叉核对。
“联系表看过”仅证明题族分类，不等于逐题推导、答案正确或6–8岁适龄。
16视频每段抽看三帧，未完整听取或转写；使用讲义和已见演示识别四组计算教学方法，不宣称已核验全部口头讲解。
PPT渲染缺失部分原生中文字体文本，因此同时读OOXML文字和图像。截图中的原始帮助音轨缺失，不从画面猜出全部原题。

## Decision 1: One App, Continuous Curriculum

**Decision**: 一个应用，按主题/能力/难度自然递进，不设置V1/V2入口，不按年龄建立长期Git分支。
**Rationale**: 用户明确确认；基础与进阶可以共享语音、交互、判定和进度。
**Alternatives considered**: 两个应用增加维护与迁移成本；复制两套App组件使公共修复分叉。均不采用。

## Decision 2: Benchmark Cognitive Tasks, Not Filenames

**Decision**: 将全部来源映射到去重题族和建设决定。已有名称不算能力已覆盖。
**Evidence**: 当前40游戏489轮，图形工坊48轮主要为轮廓/遮挡/局部/叠层/查表/缺口；矩阵实际6轮。repeatTo函数为去重截断，不会填充到target。
**Rationale**: 来源出现多属性矩阵、动态位置、布尔叠合、规则机、立体表征等更复杂任务，不能通过改等级名或增加相似图卡实现。
**Alternatives considered**: 按文件题数导入或把图推全归为一个类别，会重复计数和遗漏任务结构。

## Decision 3: Multiple Response Semantics And Memory Phases

**Decision**: 独立建模集合、序列、坐标、关系边、路径、构形和家长观察；记忆阶段与响应类型正交。
**Evidence**: S002 p4–13的多选和回忆回填、p14–23多空位操作；S005 p4–6候选复用区别，p11展示/作答切换，p29逆序回忆。S071 p16–18提示了缺声听辨任务。
**Rationale**: 同样“摆图卡”可能考记忆或规则推断，必须分别描述暴露条件、库存与答案语义。
**Alternatives considered**: 为每种资料建一个大组件会重复状态逻辑；继续answer:string会误判多解与空白。

## Decision 4: Six Domains And Parent Activities

**Decision**: 数与量、关系与逻辑、图形与空间、记忆与注意、语言与表达、生活与探究；动作/精细操作用亲子活动承载。
**Evidence**: 百花包含动作词、故事、复合指令、守恒、测量、临摹和实物操作；计算衔接讲义有词语/故事记忆；混合机考材料有语言和生活知识。
**Rationale**: 全面对标需要保留听说、动作和观察过程；全部转为选择题会改变训练目标。
**Alternatives considered**: 只增数理题会漏掉资料范围；自动语音评分/动作评分没有必要且证据不足。

## Decision 5: Age Is A Calibration Target

**Decision**: 新活动优先面向6–8岁试玩校准，保留原低龄体验；来源年龄标签仅作背景。
**Evidence**: 百花07–12封面4–7岁，计算视频标题5–6岁；千题册含成人招考式技巧与密度。百花前言“35年”是历史，不能误读为3–5岁。
**Rationale**: 材料不是统一的6–8岁课程标准；复杂度要按规则数、步骤、记忆、抽象程度和支持强度描述。
**Alternatives considered**: 册号→年龄、L6→8岁、限时→高难均不成立。

## Decision 6: Rebuild Clear Rules And Verify Answers

**Decision**: 原创任务，独立求解，审核干扰项与多解；来源有缺陷时记录后重建。
**Evidence**: S104 p3–4的“所有付款方式”答案仅列付20元的三种方式，缺少明确付款目标。S071缺听力。照片与S067/S074有重复。S075一笔画口诀省略适用条件。
**Rationale**: 参考答案与学校名不能替代正确性证据。复杂几何以确定性描述与独立基准验证。
**Alternatives considered**: 直接把圈答写入answer、用模型随机生成精密几何图，均无法保证一致性。

## Decision 7: Small Compatible Engineering Steps

**Decision**: legacy-adapter保留旧ID；统一catalog为数据源；引擎与判定纯TS；先构建时题库，再考虑外置内容包。
**Rationale**: 当前审计与语音脚本通过transpile和替换导入读取单文件，拆分前先解决共享加载；现有content/仍是占位。
**Alternatives considered**: 同时重写全部旧题、迁JSON和做多平台，会掩盖回归来源。

## Decision 8: Pilot Does Not Close Full Scope

**Decision**: 24题只验证四类关键交互，完整验收覆盖矩阵全部纳入题族。
**Rationale**: 用户要求全面对标；需要区分研究范围、建设范围和已上线范围。
**Alternatives considered**: 用24题MVP宣布完成会漏掉语言、生活、动作与大量空间任务。

## Research Limits And Resolved Design Choices

缺失原音频与未独立验算的原题不阻止定义题族，但必须在选材/原创制作时完成相应验证。
复杂成人图推保留规则参考处置，不作为默认必过；普通儿童可解释变式仍纳入。
本轮没有儿童试玩，也未改运行时。source-index及分组报告给出每个文件的具体限制，后续建设不得把限制删去来提高覆盖率。
