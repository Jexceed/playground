# 实施方案：当前Mac探索质量修复

分支dev，基线c27fd9b。沿用React/TypeScript/Vite/Tauri及现有活动引擎，不引入服务或依赖。

## 决策与约束
1. R1修图集外层尺寸，内层百分比图像不设max-height。现三栏结构保留。
2. R2按任务密度收紧图卡和间距；亲子活动分“陪玩”和“记录”，长步骤可逐步查看，材料/插画/步骤均可回看。提示与检查结果共用一个有预留高度的状态区域，按最后动作切换，既不丢消息也不叠高挤出主按钮。
3. R3原纸→向右折→（向下折）→实际折好纸面示意，红色孔标一致；使用确定性绘图生成本地PNG/SVG。
4. R4将库存/路径/双标记的反例纳入回归；研究fixture必须在对应内容合入前独立验证。
5. R5复用gridPlacement+exact判定，添加pyramid展示元数据（固定底层、上层行数、候选ID），显示所有中间槽位；支持对已放部分检查，错误定位到格。部分检查只记录支持，不算活动完成。
6. R6 G09高阶用1×2、1×3、2×2小网格，对应3/6/9个长方形；增加选择两角标记、去重、撤销/回看工具。最终仍提交数量，过程不伪造自动掌握。
7. R7独立71族设计负荷表+实际互动参数，显式design-estimate/pending-play；亲子三方案按活动索引匹配，而不机械用stage=1。补具体前置条件和校准记录模板，真实试玩不伪称已做。
8. 实质修改的24项提高revision到2，旧@1记录留存；父母可看到更新提示。启蒙、其他题目身份和记录保留。

## 代码范围
- curriculum/exploration/math.ts、logic.ts、graphic.ts、helpers.ts、difficulty.ts（新）与设计配置。
- domain/activity.ts、activity-evaluation.ts；engine/activity-session.ts与services/activity-progress.ts增加可选中途检查支持事实。
- games/ActivitySetGame.tsx；interactions/ParentActivity、ActivityEvidence、PyramidBoard/RectangleExplorer（新）；styles.css局部规则。
- 生成/语音/审计脚本必要适配，新增独立语义与版本保留回归。

## 验证
先写失败反例；独立核对库存、路线、多点与折纸/逐层合并/矩形枚举。跑相关测试、build、curriculum、voice-media。导出/生成Edge语音、生成并审计本地PNG。浏览器只辅助当前Mac窗口尺寸检查，最终以标准Applications真实应用为准，覆盖初始/作答/提示/反馈/完成/亲子记录/重开。mac:install后签名、二进制一致性和回退版本记录验证；本地提交后正常推送origin/dev并核对远端hash。

## 宪章与工作流
I完整线索、有效干扰、亲子解释；II本规格/计划/任务先于业务修改；III所有新图和台词走本地流水线；IV验收边界分开；V同步CHANGELOG/TODO。设计后检查无冲突。无extensions hooks、无update-agent-context脚本；AGENTS原则无需修改。Spec Kit研究代理仅写研究文件，不并行改共享业务代码。未解决技术澄清为0；数值估计和独立fixture按任务验证后采用。
