# 方案：数学线索可读性
实际分支dev，规格spec.md；React/TypeScript/Vite，复用本地PNG与现有Evidence/dialog，进度存储不变。无新依赖、待决技术选择或研究代理；沿用已读取的Spec Kit plan/tasks工作流。constitution检查前后通过：意义与亲子解释保持、表示可审计、不暴露未知答案、先规格后实施、build/audit/mac安装验证齐全。

US1在domain/activity.ts增加visualComparison联合表示，math.ts按既有数量提供两个dot panel，ActivityEvidence.tsx以HTML标题及CSS规则圆点排列。精确数量视觉属于代码原生UI，不需要生成式绘图。新数据不改变答案或revision。
US2为简单数学singleChoice加presentation.readableEvidence，CSS扩大指定图示、增强标签；N14时钟用本地独立PNG panel，数字字号增大，更新预加载和图示高分辨率采集。密集题型不全局放大。
US3增加数量/已知线索与答案一致性的必要回归，更新资产审计/语音导出（文字若无变化无需重新生成相同语音）、图示生成、87项现有回归和新增检查，build/audit。CUA相关数学题逐页测量及代表性交互，再mac:install/native，记录锁屏等实际限制。docs/CHANGELOG.md、TODO.md、assets.md同步。无extensions.yml及update-agent-context脚本。
