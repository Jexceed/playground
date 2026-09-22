# 能力题族对标与建设矩阵

这是完整建设范围和验收目标。71个纳入题族已各自编入首版活动，共新增597项，原24项试点保留；探索现有75组621项。题目作者解、资源与技术交互已检查，实际儿童难度校准仍待进行。最新明细见[覆盖报告](verification/coverage-report.json)。来源编号对应 [来源索引](source-index.md)，原始页码采用PDF物理页；render指本轮Word渲染页，slide指PPT页，image指原照片，video指已记录抽帧。

本矩阵共 74 个题族/处置项，其中 71 个纳入建设（含亲子活动），3 个仅作参考。题族数量不是独立原题数，也不是已上线内容数。

## 判定方法

- 有游戏ID仅说明存在基础；须核对规则、交互、表征、难度和解释才能计为已覆盖。旧内容基线为40游戏489轮，保持原值。
- 自动/半自动训练族默认具体操作、独立判断、组合迁移三台阶，每阶三个有效变式。
- 亲子活动默认三个不同条件方案，用观察要点验收；例外理由保存在JSON，不为凑数量制造抽象难题。
- 进一步减少台阶/变式必须更新本矩阵、说明能力与适龄理由及替代验收，不能静默缩小全面范围。
- M2/M3为建设依赖批次，不是产品版本，也不代表M3为可省略选项。24题试点仅验证M1引擎。
- 来源题图的实际阅读/答案核验边界见review-ledger及分组研究，引用一个题型不等于整书已独立验算。

## 数与量

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| N01 点数、基数与数量结构 | [S083 1](source-index.md#s083)；[S105 slide4](source-index.md#s105)；[S109 10-13](source-index.md#s109)；[S115 14-17](source-index.md#s115) | `math-counting-cardinality`<br>`math-subitize-match` | 保留小数量基础，加入有序标记、不同排列和数量结构解释 | singleChoice, multiSelect / M2 |
| N02 数量比较、补齐与移动补差 | [S103 2-5](source-index.md#s103)；[S114 8-11](source-index.md#s114) | `math-compare-equalize` | 从直接比较进入移给对方后两边同时变化，分清求差与取走 | construction, singleChoice / M2 |
| N03 数量、排列与容积守恒 | [S110 4](source-index.md#s110)；[S119 3-5](source-index.md#s119)；[S106 9-10](source-index.md#s106) | `math-counting-cardinality`<br>`math-compare-equalize` | 数量/体积与排列、容器外形分离，用实物倒换和对应验证，不能凭水位高就判断更多 | construction, parentObservation / M2 |
| N04 有序分合与枚举 | [S088 1-3](source-index.md#s088) | `math-compose-decompose` | 摆出不同分法，按序枚举并说明是否把交换当同一种 | orderedPlacement, construction / M2 |
| N05 凑十、破十与数位表征 | [S093 1-3](source-index.md#s093)；[S097 1-2](source-index.md#s097)；[S100 1](source-index.md#s100)；[S117 9-14](source-index.md#s117) | `math-compose-decompose`<br>`math-story-operations` | 十格盘/十根一捆到操作步骤和算式，接受合理不同策略 | construction, orderedPlacement / M2 |
| N06 情境加减与逆向数量关系 | [S083 1](source-index.md#s083)；[S103 1-5](source-index.md#s103)；[S118 11-16](source-index.md#s118)；[S119 9-14](source-index.md#s119) | `math-story-operations`<br>`math-compare-equalize` | 分清合并、增加、剩余、相差和已知结果求原量 | construction, singleChoice / M2 |
| N07 成组计数、等分与剩余 | [S105 slide15](source-index.md#s105)；[S077 4](source-index.md#s077)；[S114 8-11](source-index.md#s114)；[S116 9-12](source-index.md#s116) | `math-group-counting`<br>`math-fair-share` | 均分/按份分与连续成组，记录每份、份数及余量 | construction, gridPlacement / M2 |
| N08 连续量等分与面积占比 | [S105 slide5](source-index.md#s105)；[S105 slide24](source-index.md#s105)；[S113 9-11](source-index.md#s113)；[S107 10](source-index.md#s107)；[S074 81](source-index.md#s074) | `math-fair-share` | 从分物转到等面积份额，不能以涂色块数代替面积比较 | construction, multiSelect / M2 |
| N09 序数、排队与重叠计数 | [S103 2-5](source-index.md#s103)；[S105 slide1](source-index.md#s105)；[S105 slide19](source-index.md#s105)；[S071 render5](source-index.md#s071)；[S109 7-9](source-index.md#s109) | `math-counting-cardinality`<br>`logic-position-map` | 区分前面有几人和排第几，两端计数中本人只计一次 | orderedPlacement, singleChoice / M2 |
| N10 单双、十与个位 | [S100 1-4](source-index.md#s100)；[S105 slide19](source-index.md#s105)；[S070 29](source-index.md#s070) | `math-group-counting`<br>`logic-number-pattern-trail` | 两两配对解释单双，数位与反复开关等迁移分开评价 | construction, singleChoice / M2 |
| N11 数列、交错规律与数表 | [S100 3-4](source-index.md#s100)；[S105 slide4](source-index.md#s105)；[S105 slide21](source-index.md#s105)；[S067 39](source-index.md#s067)；[S067 41](source-index.md#s067)；[S067 57-64](source-index.md#s067)；[S120 32](source-index.md#s120) | `logic-number-pattern-trail` | 从固定增减到交错/递增差，再与颜色容器属性独立变化 | orderedPlacement, gridPlacement / M2 |
| N12 等量替换与图形代数 | [S105 slide6](source-index.md#s105)；[S071 render4-5](source-index.md#s071)；[S063 image-lower](source-index.md#s063) | `logic-balance-swap` | 多条等式代换与回代，推理链长和数值范围分开控制 | construction, gridPlacement / M2 |
| N13 货币兑换、付款与找零 | [S104 1-4](source-index.md#s104)；[S105 slide6](source-index.md#s105)；[S105 slide14](source-index.md#s105)；[S071 render9](source-index.md#s071) | 新增 | 明确面额库存、恰付/付指定总额/找零目标，接受全部合法解 | construction, gridPlacement / M2 |
| N14 时刻、刻度与经过时间 | [S105 slide16](source-index.md#s105)；[S105 slide24](source-index.md#s105)；[S071 render8](source-index.md#s071) | `math-clock-time` | 从00/30分扩到五分钟刻度和简单跨整点经过时间，钟针同源 | construction, orderedPlacement / M2 |
| N15 自然测量、长度、周长与量感 | [S113 2-5](source-index.md#s113)；[S070 38](source-index.md#s070)；[S074 81](source-index.md#s074) | `math-compare-equalize` | 用同单位/方格或学具比较长度，区分边界长度与覆盖面积，复杂几何计算只取规则改编 | construction, parentObservation / M2 |
| N16 日历、星期与周期推算 | [S070 29](source-index.md#s070) | 新增 | 读取日历布局，按七天循环推算，月份天数与实际给定日历一致 | gridPlacement, singleChoice / M2 |

### 递进与验收

- **N01**：实物逐个对应 → 结构化点群 → 换排列仍能解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N02**：一一配对 → 补齐差额 → 移动后重新比较。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N03**：一一摆放 → 改变间距 → 解释数量未变。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N04**：分成两份 → 有序找齐 → 按附加条件筛分法。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N05**：看到十 → 拆分凑/破十 → 比较两种策略。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N06**：演示情境 → 选择关系 → 逆向求未知。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N07**：逐个分 → 按组数 → 带剩余或资源限制。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N08**：同一整体等分 → 比较覆盖 → 改变分割仍解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N09**：实际排队 → 双向序数 → 合并重叠信息。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N10**：两两配对 → 数位观察 → 状态翻转迁移。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N11**：单序列 → 交错分组 → 多属性联合验证。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N12**：实物等量 → 两条关系 → 多步回代检验。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N13**：认识等值 → 购物补差 → 有限库存多种方案。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N14**：看两根针 → 五分钟刻度 → 事件前后与经过时间。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N15**：实物直接比 → 统一单位测 → 解释不同表征与边界。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **N16**：找日期 → 数同一星期 → 跨行与间隔推算。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。

## 关系与逻辑

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| L01 多角度分类与多选集合 | [S099 3-5](source-index.md#s099)；[S002 4-5](source-index.md#s002)；[S120 12-14](source-index.md#s120) | `logic-sorter-switch`<br>`logic-same-kind-detective` | 相同材料换规则分组，多选同类/异类并说明共同条件 | multiSelect, gridPlacement / M2 |
| L02 关系配对与类比 | [S105 slide11](source-index.md#s105)；[S105 slide20](source-index.md#s105)；[S099 4](source-index.md#s099) | `logic-relation-pairs` | 从物品用途配对进入整体部分、类别和关系迁移 | matching, singleChoice / M2 |
| L03 传递关系、排序与证据不足 | [S105 slide7-8](source-index.md#s105)；[S071 render8](source-index.md#s071)；[S019 16](source-index.md#s019)；[S019 18](source-index.md#s019)；[S111 2-4](source-index.md#s111)；[S112 2-4](source-index.md#s112)；[S115 8-10](source-index.md#s115) | `logic-condition-detective`<br>`logic-order-plan` | 用多条快慢/高矮/轻重关系排顺序，不能确定时保留未知 | orderedPlacement, singleChoice / M2 |
| L04 多条件排除与填格 | [S002 14-23](source-index.md#s002)；[S070 43](source-index.md#s070)；[S070 52](source-index.md#s070)；[S006 14-19](source-index.md#s006)；[S114 12-13](source-index.md#s114) | `logic-condition-detective`<br>`logic-rule-filter`<br>`logic-matrix-puzzle` | 位置、行列、数量等约束同时成立，可撤销和找多解；双属性配表为前置，不等同全局约束求解 | gridPlacement, multiSelect / M2 |
| L05 路线约束与一笔走边 | [S070 54-55](source-index.md#s070)；[S074 12-14](source-index.md#s074) | `logic-route-steps`<br>`logic-address-map` | 必经、禁入、相对左右和一笔走边；用边ID记录抬笔/重访，来源识别题改编为实际走边 | route, matching / M2 |
| L06 多步计划、优先级与纠错 | [S069 35](source-index.md#s069)；[S069 42](source-index.md#s069)；[S070 54-55](source-index.md#s070) | `logic-order-plan`<br>`logic-fix-plan`<br>`logic-priority-choice` | 从故事先后与路线执行发展完整计划、依赖说明和修正步骤；完整计划为保留原能力目标的产品扩展 | orderedPlacement, parentObservation / M2 |
| L07 条件证据与反向编线索 | [S070 38](source-index.md#s070)；[S070 42](source-index.md#s070)；[S006 28-32](source-index.md#s006) | `logic-story-evidence`<br>`logic-condition-detective` | 用足条件并指出排除依据，为确定目标编线索；区分来源确定性匹配与应用中的开放解释 | multiSelect, parentObservation / M2 |
| L08 现场学规则与迁移 | [S003 5-8](source-index.md#s003)；[S105 slide13-14](source-index.md#s105)；[S117 23-25](source-index.md#s117) | `graphic-code-machine`<br>`logic-sorter-switch` | 先演示未知规则，再独立应用与反向推断，区分模仿和迁移 | orderedPlacement, gridPlacement / M2 |
| L09 状态翻转与操作结果 | [S105 slide19](source-index.md#s105)；[S075 1](source-index.md#s075) | `logic-stop-think` | 灯、黑白棋/格的开关翻转，先真实操作再归纳次数与结果 | construction, gridPlacement / M2 |
| L10 步长规则、多角色移动与交会 | [S119 6-8](source-index.md#s119)；[S119 24](source-index.md#s119)；[S106 10](source-index.md#s106)；[S106 15](source-index.md#s106) | `logic-route-steps` | 按角色每步格数与轮次更新位置，解释相遇条件，不把原题误改为速度竞赛 | route, gridPlacement / M2 |
| L11 棋盘排列、连珠与翻转策略 | [S119 23](source-index.md#s119)；[S119 26-27](source-index.md#s119)；[S106 15](source-index.md#s106) | 新增 | 行列/斜线规则、补一连线、选择翻转位置，区分规则有效与最优策略 | gridPlacement, construction / M2 |
| L12 连桥网络、度数与全局连通 | [S070 40](source-index.md#s070)；[S070 44](source-index.md#s070) | 新增 | 每点桥数、水平垂直、至多双桥、不相交和整体连通同时成立；当前桥材料选择题不算此网络能力 | network, gridPlacement / M2 |

### 递进与验收

- **L01**：按一个特点 → 换分类角度 → 同时满足两条件。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L02**：找关系 → 迁移到新对象 → 辨别只像外形的干扰。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L03**：两者比较 → 传递排序 → 部分顺序与不足信息。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L04**：给定一条件 → 交叉排除 → 补齐并逐条验算。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L05**：按指令走 → 自己规划 → 多条合法路线比较。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L06**：事件先后 → 步骤依赖 → 反例与修正。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L07**：指出线索 → 排除不符 → 比较解释与补充信息。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L08**：操作示例 → 换材料应用 → 逆向或连续变换。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L09**：一次翻转 → 连续翻转 → 从目标倒推步骤。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L10**：一个角色执行 → 不同步长 → 多角色交会与倒推。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L11**：识别有效排列 → 补一步达标 → 比较多个操作后果。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **L12**：读现成桥计数 → 局部补桥 → 同时验证度数与连通。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。

## 图形与空间

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| G01 观察匹配、局部整体与找差 | [S099 3](source-index.md#s099)；[S105 slide12](source-index.md#s105)；[S105 slide22](source-index.md#s105)；[S113 14-17](source-index.md#s113)；[S115 37](source-index.md#s115) | `logic-visual-match`<br>`logic-difference-detective`<br>`graphic-detail-whole` | 让孩子直接标证据，控制相似干扰与目标数量 | multiSelect, matching / M2 |
| G02 遮挡、闭合与纹理补片 | [S067 1-5](source-index.md#s067)；[S105 slide12](source-index.md#s105) | `graphic-shadow-match`<br>`graphic-covered-restore`<br>`graphic-gap-close` | 辨认整体与对齐真实局部补片分开，方向尺度受控 | construction, singleChoice / M2 |
| G03 多属性序列与行列矩阵 | [S067 6-8](source-index.md#s067)；[S067 11](source-index.md#s067)；[S067 23-24](source-index.md#s067)；[S067 76](source-index.md#s067)；[S067 38](source-index.md#s067)；[S067 65](source-index.md#s067)；[S098 3-4](source-index.md#s098) | `logic-matrix-puzzle` | 形状/颜色/方向独立变化的纯图形序列与矩阵，验证行列共同成立 | singleChoice, gridPlacement / M2 |
| G04 位置移动、循环与反弹 | [S067 12-13](source-index.md#s067)；[S067 31](source-index.md#s067)；[S067 48](source-index.md#s067)；[S074 53-55](source-index.md#s074)；[S045 image-upper](source-index.md#s045) | `logic-route-steps`<br>`logic-position-map` | 从序列发现位移规律，区分循环、反弹、静止与双标记移动 | orderedPlacement, gridPlacement / M2 |
| G05 旋转、镜像、缩放与方向性形变 | [S067 79](source-index.md#s067)；[S074 59-62](source-index.md#s074)；[S071 render2](source-index.md#s071)；[S071 render6](source-index.md#s071)；[S116 23-25](source-index.md#s116)；[S118 25-27](source-index.md#s118)；[S120 24-26](source-index.md#s120)；[S019 6-7](source-index.md#s019) | `logic-rotation-direction`<br>`logic-mirror-fold` | 非对称图形的位置、朝向、整体缩放与横/纵拉伸分别描述，用操作验证变换规则 | construction, singleChoice / M2 |
| G06 叠合、求同、求异与减去 | [S067 16-21](source-index.md#s067)；[S067 28-30](source-index.md#s067)；[S067 68-70](source-index.md#s067)；[S105 slide22](source-index.md#s105)；[S118 17-20](source-index.md#s118) | `graphic-layer-overlap`<br>`logic-matrix-puzzle` | 布尔运算与遮挡顺序分开，透明学具操作后再归纳 | construction, gridPlacement / M2 |
| G07 图形金字塔与递归组合 | [S067 81](source-index.md#s067)；[S067 84](source-index.md#s067)；[S074 75](source-index.md#s074)；[S074 78](source-index.md#s074) | 新增 | 每层结果可验证，分开规则复杂度与需要记住的中间结果 | gridPlacement, construction / M2 |
| G08 黑白与颜色编码运算 | [S067 33](source-index.md#s067)；[S067 82-85](source-index.md#s067)；[S074 75](source-index.md#s074)；[S074 78](source-index.md#s074) | 新增 | 先给明确运算例子，空白/白色/未填独立，复杂内外圈规则分级 | gridPlacement, singleChoice / M2 |
| G09 点、线、边、角、面与连通部分 | [S074 18-20](source-index.md#s074)；[S074 25](source-index.md#s074)；[S074 28](source-index.md#s074)；[S074 31](source-index.md#s074)；[S074 34](source-index.md#s074)；[S074 39-41](source-index.md#s074)；[S067 14](source-index.md#s067)；[S074 78-lower](source-index.md#s074)；[S072 1](source-index.md#s072)；[S120 33-colored-small-triangles](source-index.md#s120) | `math-counting-cardinality` | 明确计数单位，可标记证据，组合图形不重不漏；S120 p33仅支持规律着色后数小三角，不作为数全部大小三角的依据 | multiSelect, singleChoice / M2 |
| G10 对称轴与对称关系 | [S076 3](source-index.md#s076)；[S074 4](source-index.md#s074)；[S074 7-8](source-index.md#s074) | `logic-mirror-fold` | 用折叠或镜面验证，比较轴位置/数量并解释不对称处 | construction, multiSelect / M2 |
| G11 开闭、曲直、接触、交叉与内外 | [S074 31](source-index.md#s074)；[S074 46](source-index.md#s074)；[S074 51](source-index.md#s074)；[S072 1](source-index.md#s072) | `logic-position-map`<br>`graphic-gap-close` | 直接标出开口/接触点等证据，图线精度不能改变语义 | multiSelect, matching / M2 |
| G12 功能标记与不变量 | [S074 51](source-index.md#s074)；[S075 1](source-index.md#s075) | 新增 | 理解标记与边角/区域的关系，而非只跟踪标记颜色位置 | singleChoice, gridPlacement / M2 |
| G13 符号编码与多位对应 | [S028 image-lower](source-index.md#s028)；[S044 image-upper](source-index.md#s044)；[S050 image-lower](source-index.md#s050) | `graphic-code-machine` | 从单图查表到多位编码和反向对应，重复符号须一致 | matching, orderedPlacement / M2 |
| G14 平面与立体拼搭、分割、缺件与多解构形 | [S077 4](source-index.md#s077)；[S105 slide11-12](source-index.md#s105)；[S105 slide21](source-index.md#s105)；[S074 99](source-index.md#s074)；[S074 101-q29-30](source-index.md#s074)；[S111 14-17](source-index.md#s111)；[S116 15-18](source-index.md#s116) | `logic-part-whole-puzzle`<br>`logic-space-bridge` | 用真实平面/立体部件组合，验证方向、覆盖、补块和多种合法拼法 | construction, multiSelect / M2 |
| G15 折纸、剪孔、展开与逆向折痕 | [S076 3](source-index.md#s076)；[S071 render1](source-index.md#s071)；[S115 20-23](source-index.md#s115)；[S117 17-19](source-index.md#s117)；[S120 17-18](source-index.md#s120) | `logic-mirror-fold` | 从实物一次折叠到展开预测，明确折线、剪口和方向 | construction, parentObservation / M2 |
| G16 立体分类、隐藏块与三视图 | [S077 1-5](source-index.md#s077)；[S074 94](source-index.md#s074)；[S074 101-q27](source-index.md#s074)；[S112 14-17](source-index.md#s112)；[S115 11-13](source-index.md#s115)；[S116 6-8](source-index.md#s116) | `logic-block-height-map`<br>`logic-three-view-blocks` | 体素/实体模型统一生成视图和遮挡计数，不能把高度表当三维观察 | construction, multiSelect / M2 |
| G17 相对左右与观察者视角 | [S076 3](source-index.md#s076)；[S071 render6](source-index.md#s071)；[S105 slide10](source-index.md#s105)；[S105 slide25](source-index.md#s105)；[S070 52](source-index.md#s070)；[S070 54-55](source-index.md#s070) | `logic-position-map`<br>`logic-address-map`<br>`logic-three-view-blocks` | 人物面向、观察者位置与画面左右分别描述，换位后重新推断 | construction, singleChoice / M2 |
| G18 立方体展开、相邻面与相对面 | [S074 87](source-index.md#s074)；[S073 86](source-index.md#s073)；[S117 15-16](source-index.md#s117) | 新增 | 用折盒验证少量面标记，再做相邻/相对关系推断 | construction, singleChoice / M2 |
| G19 点阵、方格临摹与空间重建 | [S114 14-17](source-index.md#s114)；[S115 38](source-index.md#s115)；[S109 9](source-index.md#s109)；[S110 5-7](source-index.md#s110) | 新增 | 用格位/线段重现形状和相对位置，常显模型复制与隐藏后记忆分别标记 | construction, gridPlacement / M2 |
| G20 透明叠层、遮挡关系与顺序计划 | [S070 58](source-index.md#s070)；[S070 62](source-index.md#s070) | `graphic-layer-overlap`<br>`logic-order-plan` | 推断2到4层的先后并实际排列验证，透明叠层与求同/求异布尔运算分开 | orderedPlacement, construction / M2 |

### 递进与验收

- **G01**：整体匹配 → 局部细节 → 多目标证据搜索。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G02**：轮廓线索 → 遮挡补全 → 纹理/边界共同匹配。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G03**：单属性 → 双属性 → 行列交叉约束。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G04**：一个标记 → 边界变化 → 两个标记独立移动。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G05**：操作一次变换 → 预测形变方向 → 复合/局部变换与独立属性。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G06**：实物叠放 → 给定运算 → 归纳并迁移。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G07**：两图合一 → 两层递推 → 三层组合检验。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G08**：一条颜色规则 → 两格应用 → 组合规则验证。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G09**：清楚基本单位 → 分组计数 → 重叠组合中的系统计数。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G10**：一轴验证 → 找不同轴 → 组合图形验证。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G11**：单个关系 → 关系分类 → 多对象关系组合。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G12**：标明作用 → 换图找同关系 → 存在干扰仍保持规则。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G13**：一一对应 → 多位序列 → 逆向/连续编码。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G14**：两块拼合 → 旋转找缺件 → 有限部件多方案。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G15**：实物折一次 → 预测展开 → 由结果倒推简单折剪。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G16**：实物分类搭建 → 看见与隐藏 → 多视图交叉还原。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G17**：以自己为参照 → 换观察者 → 多视角同一场景。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G18**：实物展开 → 折回预测 → 面关系交叉验证。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G19**：少量点线 → 格位对应 → 改变参照仍保持结构。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **G20**：两层比较 → 多层排序 → 局部遮挡证据反推。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。

## 记忆与注意

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| A01 视觉集合记忆与新旧辨认 | [S002 6-9](source-index.md#s002)；[S101 1-3](source-index.md#s101) | `logic-memory-camera` | 隐藏后从混合池多选出现/未出现项目，数量和相似干扰独立控制 | multiSelect / M3 |
| A02 位置记忆与图案回填 | [S002 10-13](source-index.md#s002)；[S105 slide7](source-index.md#s105)；[S071 render9-11](source-index.md#s071)；[S115 31-32](source-index.md#s115)；[S118 28-29](source-index.md#s118) | `logic-memory-camera`<br>`logic-position-map` | 回忆位置而非只认出对象；空白格是合法记忆信息 | gridPlacement / M3 |
| A03 顺序、逆序和重复符号记忆 | [S005 29](source-index.md#s005)；[S101 3](source-index.md#s101)；[S102 3](source-index.md#s102) | `logic-memory-camera` | 按序重现，重复候选可复用；逆序单独作为操作要求 | orderedPlacement / M3 |
| A04 听觉记忆与复合指令 | [S102 1-4](source-index.md#s102)；[S071 render16-18](source-index.md#s071)；[S109 33](source-index.md#s109)；[S114 30](source-index.md#s114)；[S115 28-30](source-index.md#s115)；[S117 32](source-index.md#s117)；[S120 30-31](source-index.md#s120) | `logic-route-steps` | 信息通过音频给出，按阶段撤去线索；动作次序与位置关系联合验证 | orderedPlacement, gridPlacement / M3 |
| A05 故事记忆、细节与复述 | [S102 3-4](source-index.md#s102)；[S003 2-3](source-index.md#s003)；[S003 7](source-index.md#s003)；[S111 18-23](source-index.md#s111)；[S113 18-21](source-index.md#s113)；[S116 19-22](source-index.md#s116) | `logic-story-evidence` | 听后回答事实并复述，事实记忆与因果推理分开记录 | singleChoice, parentObservation / M3 |
| A06 视觉搜索、划消与持续注意 | [S109 34](source-index.md#s109)；[S110 32](source-index.md#s110)；[S099 3](source-index.md#s099)；[S119 31-32](source-index.md#s119) | `logic-visual-match`<br>`logic-difference-detective` | 指定目标直接标记，持续注意不等同辨认难度，默认不强制竞速 | multiSelect / M3 |
| A07 抑制、规则切换与工作记忆 | [S110 30-31](source-index.md#s110)；[S003 5](source-index.md#s003)；[S003 7-8](source-index.md#s003) | `logic-stop-think`<br>`logic-sorter-switch` | 先记规则再行动/暂停，记录提示，亲子动作不伪自动识别 | multiSelect, parentObservation / M3 |
| A08 声音辨别、音色与节奏顺序 | [S105 slide19](source-index.md#s105) | 新增 | 乐器听辨截图缺原音轨，需原创声音刺激与答案；区分语言音频和非语言声音 | singleChoice, orderedPlacement, parentObservation / M3 |
| A09 关联数量与结构记忆 | [S116 26-27](source-index.md#s116)；[S120 27-28](source-index.md#s120)；[S118 28-29](source-index.md#s118) | `logic-memory-camera` | 隐藏后恢复对象与数量/结构的关系，区分记忆出错与计算或空间技能不足 | matching, gridPlacement, construction / M3 |

### 递进与验收

- **A01**：少量易辨 → 相似干扰 → 集合变化与解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A02**：少槽位 → 位置与对象 → 规则辅助记忆。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A03**：短序列 → 重复/干扰 → 逆序或变换后回忆。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A04**：一步指令 → 多步顺序 → 关系与顺序合并。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A05**：抓人物事件 → 还原顺序 → 关键细节与因果。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A06**：少量目标 → 相似干扰 → 换规则搜索。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A07**：单规则 → 规则切换 → 听取后保持并执行。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A08**：两种声音对照 → 声音序列 → 节奏模仿与解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **A09**：对象与一个属性 → 数量/位置关系 → 结构重建与解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。

## 语言与表达

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| E01 动作词、反义词与词义关系 | [S109 20-23](source-index.md#s109)；[S105 slide15](source-index.md#s105)；[S071 render19](source-index.md#s071)；[S117 20-22](source-index.md#s117) | `logic-relation-pairs` | 语言关系与图形匹配分开，音频支持不识字孩子 | matching, parentObservation / M3 |
| E02 完整句、方位和比较表达 | [S109 20-23](source-index.md#s109)；[S110 18-21](source-index.md#s110)；[S105 slide25](source-index.md#s105) | `logic-position-map` | 孩子自己说清对象、位置和关系；家长按意义核对 | parentObservation / M3 |
| E03 故事排序、因果和复述 | [S109 20-23](source-index.md#s109)；[S110 18-21](source-index.md#s110)；[S102 3](source-index.md#s102)；[S118 21-24](source-index.md#s118)；[S120 20-23](source-index.md#s120)；[S069 42](source-index.md#s069) | `logic-order-plan`<br>`logic-story-evidence` | 排序后口述因果，开放表达有关键点而非固定标准句 | orderedPlacement, parentObservation / M3 |
| E04 创编故事、比较方案与理由表达 | [S109 20-23](source-index.md#s109)；[S110 18-21](source-index.md#s110) | `logic-priority-choice`<br>`logic-fix-plan` | 给可观察量规，接受合理不同叙事，不按一个答案打分 | parentObservation / M3 |
| E05 字形、拼音与词语对应 | [S105 slide18](source-index.md#s105)；[S064 image](source-index.md#s064) | 新增 | 识读是单独前置能力，纯视觉任务用几何改写，避免混测 | matching, multiSelect / M3 |
| E06 英语听辨与短句理解 | [S071 render16-20](source-index.md#s071)；[S105 slide23-25](source-index.md#s105) | 新增 | 缺失原声则原创重建，英语音色本地化，语言目标独立验收 | singleChoice, multiSelect / M3 |
| E07 英语中的数量、空间与比较表达 | [S105 slide10-11](source-index.md#s105)；[S105 slide18](source-index.md#s105)；[S105 slide24-25](source-index.md#s105) | 新增 | 区分概念不会与英语不理解；相同规则可有中文支持但分别记录 | singleChoice, gridPlacement / M3 |
| E08 交流、听问与自我表达 | [S003 1-3](source-index.md#s003) | 新增 | 亲子对话、说明喜好和回应追问，中文/英语目标分开，不采集不必要身份信息 | parentObservation / M3 |

### 递进与验收

- **E01**：看图命名 → 关系对照 → 在情境中使用。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **E02**：观察描述 → 换参照描述 → 解释依据。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。
- **E03**：两图先后 → 事件链 → 解释原因与不同结局。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **E04**：描述线索 → 给出理由 → 提出替代方案。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。
- **E05**：清楚字形 → 音形对应 → 情境词义辨别。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **E06**：词音辨认 → 短句对应 → 关系指令理解。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **E07**：词与图对应 → 关系短句 → 多信息理解。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **E08**：听懂问题 → 完整回应 → 追问与补充说明。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。

## 生活与探究

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| P01 生活用品、功能、材料与场景分类 | [S099 4-5](source-index.md#s099)；[S105 slide1](source-index.md#s105)；[S105 slide11](source-index.md#s105)；[S116 28-29](source-index.md#s116) | `logic-relation-pairs`<br>`logic-rule-filter` | 按实际用途与材料证据分类，允许情境中合理的多归属 | matching, parentObservation / M3 |
| P02 自然观察、生物特征与成长顺序 | [S071 render7](source-index.md#s071)；[S071 render20](source-index.md#s071)；[S105 slide3](source-index.md#s105)；[S109 30-32](source-index.md#s109)；[S112 26-28](source-index.md#s112)；[S115 33-35](source-index.md#s115)；[S117 29-31](source-index.md#s117)；[S119 29](source-index.md#s119) | `logic-same-kind-detective`<br>`logic-order-plan` | 分类依赖可见特征与明确知识前置，真实观察支撑记忆 | orderedPlacement, parentObservation / M3 |
| P03 生活科学：浮沉、颜色、影子与切面 | [S105 slide1](source-index.md#s105)；[S099 1-2](source-index.md#s099)；[S071 render6](source-index.md#s071)；[S074 97](source-index.md#s074)；[S111 29-31](source-index.md#s111)；[S113 28-30](source-index.md#s113)；[S117 29-31](source-index.md#s117) | 新增 | 预测—操作—观察—解释；颜料混合与图形编码运算分别建模；简单实物切面体验纳入，复杂斜截面另列参考 | parentObservation / M3 |
| P04 感官、生活安全与社会情境 | [S105 slide23](source-index.md#s105)；[S105 slide25](source-index.md#s105)；[S071 render14](source-index.md#s071)；[S110 27-29](source-index.md#s110)；[S114 27-29](source-index.md#s114)；[S118 30-31](source-index.md#s118) | 新增 | 基于具体情境讨论理由，旧分类规则先校核，不用偏见当答案 | parentObservation / M3 |
| P05 节日、文化与世界常识 | [S105 slide3](source-index.md#s105)；[S105 slide17](source-index.md#s105)；[S071 render12-14](source-index.md#s071) | 新增 | 明确知识输入与思维目标，借图片和亲子阅读探究，不冒称知识量是智力 | parentObservation / M3 |
| P06 亲子动作、精细操作与协调 | [S114 14-17](source-index.md#s114)；[S115 38](source-index.md#s115)；[S109 9](source-index.md#s109)；[S110 5-7](source-index.md#s110)；[S076 3](source-index.md#s076)；[S089 video](source-index.md#s089)；[S003 2](source-index.md#s003)；[S003 4-5](source-index.md#s003)；[S003 8](source-index.md#s003) | 新增 | 以真实手眼协调、剪纸、搭建和节律为观察目标；数字图案复制另归G19，不互相冒充能力完成；动作模仿、平衡与运送也分别观察 | parentObservation, construction / M3 |

### 递进与验收

- **P01**：观察用途 → 按规则整理 → 换场景解释。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **P02**：观察特征 → 排列变化 → 解释关系。目标：具体操作 ≥ 3 个有效变式/方案；独立判断 ≥ 3 个有效变式/方案；组合迁移 ≥ 3 个有效变式/方案。
- **P03**：提出预测 → 一次对照 → 改变条件再解释。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。
- **P04**：识别情境 → 说明选择 → 比较不同处理。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。
- **P05**：共同观察 → 寻找关系 → 联系生活讲述。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。
- **P06**：模仿操作 → 遵循简单要求 → 解释并调整。目标：亲子观察与操作 ≥ 3 个有效变式/方案。以三个不同条件的活动方案和家长观察要点验收，不强制形成三阶自动判分题。

## 参考与边界

| ID / 题族 | 来源定位 | 现有基础 | 建设目标 | 玩法 / 批次 |
|---|---|---|---|---|
| R01 成人式奇点公式与多重技巧口诀 | [S074 12-14](source-index.md#s074)；[S075 1](source-index.md#s075) | 新增 | 可操作的一笔走边归L05；本项仅记录不纳入默认训练的成人公式与多重技巧，原口诀不能直接当判定算法 | route / reference |
| R02 复杂截面、斜切与高密度立体题 | [S074 97](source-index.md#s074)；[S073 96](source-index.md#s073) | 新增 | 记录能力来源，先用具体切面体验；复杂斜截面需另做适龄论证 | parentObservation / reference |
| R03 历史招生攻略、宣传与学校归属 | [S001 1-26](source-index.md#s001)；[S003 1-9](source-index.md#s003) | 新增 | 只作来源背景，不作为当前招生要求、官方认证或能力效用证据 | none / reference |

### 递进与验收

- **R01**：先操作理解再判断是否有必要引入抽象。目标：不计必建活动。来源仅作规则或历史背景参考，不计为儿童必建活动；普通可迁移规则已在相应纳入题族规划。
- **R02**：具体经验优先，复杂抽象暂不计入必建。目标：不计必建活动。来源仅作规则或历史背景参考，不计为儿童必建活动；普通可迁移规则已在相应纳入题族规划。
- **R03**：不进入儿童训练流程。目标：不计必建活动。来源仅作规则或历史背景参考，不计为儿童必建活动；普通可迁移规则已在相应纳入题族规划。

## 首批实际实现

| 题族 | 首批题数 | 状态 |
|---|---:|---|
| L01 | 6 | pilot-partial，未达到完整题族验收 |
| L03 | 6 | pilot-partial，未达到完整题族验收 |
| G03 | 6 | pilot-partial，未达到完整题族验收 |
| A03 | 4 | pilot-partial，未达到完整题族验收 |
| A02 | 2 | pilot-partial，未达到完整题族验收 |

详情见[首批来源与验算](authoring/pilot.md)和[实施验收](verification/pilot-qa.md)。
