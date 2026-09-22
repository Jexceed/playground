# Data Model: 课程与能力扩展

本文保留完整目标契约。当前实现九种响应、六域内容、视觉/听觉记忆、统一目录及事实记录，见full-scope.md。完整跨历史发行迁移仍待实现，src/types.ts继续兼容旧题。

## 1. ReferenceSource / ReferenceItem

ReferenceSource：id、相对sourceRoot的path、sha256、format、页数/幻灯片数/时长、阅读方法、实际查看定位、限制、处置。
ReferenceItem：sourceId、locator（物理页+题号/区域、幻灯片、图片区域或视频秒数）、canonicalProblemId、answerLocator、verificationStatus。
题本与答案共享canonicalProblemId。相同截图重排不算新问题；同规则新参数可算变式，但不算新能力族。
实质变式需改变有效关系、布局、步骤、证据或作答条件；仅改名、无关换色和选项重排不充数。
问题指纹需覆盖题面、关键视觉模型、约束和目标，不能直接复用旧roundSignature的有限字段来认定新题等价。
已查阅页、联系表概览、单页精读、独立解题、试玩分别记录，不用一个reviewed布尔值替代。

## 2. SkillFamily / CurriculumNode

SkillFamily：stableId、domain、目标操作、prerequisites、来源定位、现有gameIds、建设决定、差距、interactionKinds、difficultyLadder、applicableStages、variantTargets、exceptionRationale、batch、验收证据。
建设决定：build（纳入）/parentActivity（亲子）/referenceOnly（只取规则）/needsSourceCheck（来源未清）。当前基础状态独立为partial/new；不能把planned当implemented。
CurriculumNode：id、familyId、台阶、activityIds、建议前置、显示名称和顺序。领域为math、logic、graphic、memory、language、life，可跨域打标签。
现有worldId保留兼容映射，先不改原题存档归属。

## 3. ActivityDefinition

通用字段：
- id：稳定身份，不编码软件发行号；现有题目原ID冻结。
- revision：题意、约束、正确解改变时递增；纯文案润色不自动清空完成。
- schemaVersion / contentVersion：分别是结构和内容版本，不与年龄或应用版本混用。
- primaryFamilyId、secondaryFamilyIds、domain、prerequisites、language、difficultyProfile。
  每个活动只有一个主要题族；独立活动数按稳定ID去重，次级标签不能重复填充其他题族的变式配额。
- prompt、instruction、clues、assetRefs、voiceRefs、stimulusAudioRefs、hintStages、feedback、parentPrompt。
  语音朗读与非语言声音刺激（音色、节奏等）分开；后者有来源/指纹/时长/目标语义校验，不套用TTS文字时长规则。
- interaction：具体响应类型的配置；evaluation：匹配该响应的判定规则。
- protocol：普通活动或阶段化观察/听取/保持/回忆。
- provenance：本地开发证据定位；发布包只带必要说明，不带下载文件、原卷扫描图和绝对路径。

difficultyProfile至少分开记录：
activeRuleCount、inferenceSteps、representation（实物/图卡/符号）、memoryLoad、distractorSimilarity、supportLevel。
readingLoad与motorLoad单独记录。年龄建议是试玩假设；旧L1–L6原意保留，不能直接换算成年龄或新题族等级。

## 4. Response Types

```ts
type SlotValue =
  | { state: "unfilled" }
  | { state: "filled"; tokenId: string }; // 空白图形有自己的tokenId

type ActivityResponse =
  | { kind: "singleChoice"; optionId: string | null }
  | { kind: "multiSelect"; optionIds: string[] }
  | { kind: "orderedPlacement"; slots: SlotValue[] }
  | { kind: "gridPlacement"; cells: Record<string, SlotValue> }
  | { kind: "matching"; edges: Array<[string, string]> }
  | { kind: "network"; links: Array<{ nodeA: string; nodeB: string; multiplicity: 1 | 2 }> }
  | { kind: "route"; startNodeId: string; traversals: Array<{ edgeId: string; direction: "forward" | "reverse" }> }
  | { kind: "construction"; placements: Placement[] }
  | { kind: "parentObservation"; observations: Observation[] };
```

这里的Placement和Observation由对应玩法明确字段，不是任意JSON。构形须区分部件位置/朝向、吸附点阵线段和多边形区域；纸笔精细动作仍由家长观察，不能只按几何像不像代判。
interaction与response使用共同的kind做类型关联，不能组合出“连线题用单选答案”的数据。
候选项使用稳定tokenId，库存策略为unlimited / once / counted；槽位定义顺序、坐标和允许放置类型。
提交、暂存、跳过是会话事件，不用“放弃”伪装成一个参与正确性判定的答案选项。
输入清除后恢复unfilled；合法空白仍是filled。重复token可合法出现在多个槽位，取决于库存策略。

## 5. Evaluation And Geometry

EvaluationResult区分incomplete / incorrect / correct / needsParentObservation。
输出满足/违反的约束、可解释反馈键和操作证据；开放活动没有伪造的自动correct值。
目标可为anyValid、minimize或maximize；区分规则合法与目标达成。优化题通过独立求解得到比较基准，接受所有并列最优解，合法但非最优要明确反馈，而非说其违反规则。
判定策略：
- 单选按ID；多选按集合（可另定精确集合或数量条件）。
- 顺序按槽位比较；分类/网格按坐标或等价类比较。
- 路径按起终点、连通、禁入、必经、边访问次数和题目声明的长度目标判断。
  使用稳定edgeId区分同一对节点间的平行线/弧线，校验连续边的接续；抬笔、断开与重复边规则明确记录。
- 拼摆按位置、方向、覆盖、相交和使用部件约束判断。
- 连桥网络按每点度数、轴向可连性、至多双桥、不交叉、整体连通共同判定；与沿路线走一遍不同，network响应保存无向连接及重数。
- 代换/金额/补差按数值关系和可用资源判定，接受全部合法解。
- 几何模型区分线段、边、连续线、封闭区域、接触点；布尔叠合与物理遮挡分别编码。
- 体素/面标记模型统一生成三视图、遮挡关系和展开答案；使用独立基准用例防止渲染与判定共错。

不运行来自参考材料的代码，不在内容文件里使用eval字符串表达式；采用有限、已审计的规则操作符。
出题前枚举/求解可行解，声明唯一解或多解；不能从手写圈答直接赋值答案。

## 6. Session And Memory Protocol

协议区分普通练习、memory和learnThenTransfer；演示新规则后迁移可以保留规则提示，但不计作隐藏后回忆。
记忆阶段：ready → observe/listen → retain → respond → feedback → reflect → completed；另有paused/skipped。
- phaseIndex、稳定activityId+revision、当前response、动作记录、supportEvents、elapsedVisibleTime、resumePolicy。
- 观察素材与作答素材分离，在observe/listen结束、进入retain时即撤下全部记忆线索并停止刺激音频；retain可为零时长。普通观察题可常显，但不能计作隐藏后的记忆任务。重看/重听后重新开始保持阶段并记录支持。
- 音频播完才推进依赖听取的阶段；取消、换题、后台须终止旧音频及定时器。
- 显示/听取阶段被打断后按显式恢复策略重启或继续，记录restart，不偷跑倒计时。
- 重看/重听分别记录，不与“第一次独立回忆”混合统计；默认不强制竞速。

## 7. Progress And Migration

内部键：profileId + activityId + revision；curriculum/domain作索引维度，不按发行V1/V2隔离。课程目录显式声明enlightenment（启蒙）或exploration（探索）归属，与交互类型无关。一级导航和学习记录按当前部分呈现。

首批分区续玩使用thinking-island-curriculum-navigation：schemaVersion、activeSectionId、locations[sectionId]；每个位置保存worldId/gameId/roundId，按稳定ID解析。首次兼容读取旧目录位置和旧题位置，原键和完成事实保留；未来schema或损坏值禁止覆盖。当前题组仍共享统一审计目录。
初期一个default本地档案即可，不需要登录。不同能力路径独立定位，原题历史仍可查看。
记录attempts、supportEvents、firstIndependentOutcome、completion、parentObservation、revision和contentVersion。
mastery是后续有充分证据的推断，不能由completed直接生成。

迁移过程：
1. 只读加载旧thinking-island-progress与thinking-island-last-play-location；校验类型。
2. 冻结支持的各旧发行基线的gameId/roundId/题意指纹及顺序快照。旧存档没有内容版本，不能假定来自当前基线；仅当可确定版本或所有候选基线映射一致时，将roundIndex解析成稳定题目ID。
3. 新schema写到新key，写成功并读回校验后写迁移标记；旧key保留为备份，不再双向写入。
4. 可重复执行，迁移失败或缺失题目回到安全入口，保留原记录和可诊断原因。
5. 游戏级completedIds与题目级completedRoundIds分别保留为历史事实，禁止把游戏完成展开成当前所有题目完成。题目修订未知时也保持未知；不补造0次提示或独立通过。
6. 新记录按ID续玩；旧位置存在歧义时标为历史位置未确认，保留原值并回到相应主题，让家长选择起点，绝不按当前数组猜新题。题目移除使用显式替代映射或安全回退。
7. 保存响应时校验schema和题目revision，未知未来schema不覆盖原存档。

## 8. Build Catalog And Platform Capabilities

catalog是应用、语音、审计、静态发布和平台导出的共同数据源。
当前load-game-data.mjs依赖单文件transpile+字符串替换，拆分题库前必须升级为可加载模块图的构建流程，并用基线快照验证输出。
初期TS构建时加载，JSON仅为校验/平台导出的派生产物，不同时维护两份权威题库。
过渡初期catalog可经adapter读取现有data/games.ts；在将该文件改为兼容re-export之前，先把权威旧定义迁到curriculum/legacy/并改依赖，不能形成catalog↔games循环。
平台声明supportedInteractionKinds、supportedProtocols、supportedPresentationCapabilities、supportedEvaluationCapabilities/规则版本、locales、assetBudget。活动声明requiredPresentationCapabilities与requiredEvaluationCapabilities，不满足时构建失败或明确排除整活动并报告原因。仅支持singleChoice不代表能呈现体素视图或执行新的几何规则。
抖音保持其数字岛范围，不能无声裁剪记忆阶段或强行转单选。
