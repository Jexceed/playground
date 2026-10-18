# 数据与状态

GameRound.sequenceStory可选值drinking；sceneImage仍引用注册场景。OrderStory定义每个稳定题号的步骤图片、答案图片及情境。题目原sequence/answer/choices合同不变。

组件状态：scene -> task -> completed；completed具有playing/paused与activeStep。答对才填问号；错误保持原图。回看不丢选择或完成状态；切题/从头来重置展示状态；reduced-motion默认为静态手动查看。
