# 数据模型

Activity.presentation.evidence 增加 ruleMachine（start/add/multiplier）和 cardFlip（initial/steps）。数量和下标来自现有题目生成参数。

ruleMachine 示范使用起始值 1，与正式 start 分开；局部状态只控制示范阶段，不能写作答状态。选项数量由选项自身标签提供，不读 answerId。

cardFlip 初始状态为 off/on ID 列表，steps 为从零开始的卡片下标。初始/清空/重玩均映射到原有 gridPlacement.cells；点击由 place 事件翻转。评价仍以原来的 exact cells 为准。

ID、revision、题组、答案、token ID/排序、存储 schema 不变。不同操作支持下的真实儿童表现需再观察，不能将旧完成推断为新掌握。
