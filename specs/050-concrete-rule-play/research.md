# 决策依据

- 当前 L08 用 grid 绘制 1→3，numeric 选项只有数字；L09 用静态横格加三条文字，要求再把图卡填入空位，增加无关操作。
- 决策：从题目生成参数构造 ruleMachine / cardFlip，渲染层不解析文案，不从答案倒推画面。保留 scoring 模型和稳定身份。
- 决策：圆片使用 imageGallery.items.patternBlueDisc/patternYellowDisc。项目已有透明本地 PNG，尺寸一致，可直接点数；无需生成插画。
- 决策：翻牌初始化为题目已知的初始状态，点击替换单一 cell；全部状态通过 session 管理，撤销/清空自然一致。独立示例牌不进入 session。
- 决策：只在目标题隐藏已用视觉表达的 clues，完整文字仍用于本地朗读。通用玩法继续原样。
- 备选：仅放大原缩略图，仍不能解释动作；自动播放整题结果会代替儿童解题，均不采用。

- 朗读复核：原来的 learnThenTransfer 把例子和正式题连续朗读，屏幕显示 1 个时会提前读到正式题的 2–4 个。改为按 ready/respond 阶段选择文本，分别导出本地语音，标题听题按钮也使用当前阶段。
- 本地 .specify/scripts/bash/ 不含 update-agent-context.sh；没有虚构运行结果，也没有为自动上下文改写 AGENTS.md。当前规则和分支依据已明确记录于 plan.md。
