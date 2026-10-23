# 数据模型

不变更课程或作答模型。imageGallery.items增加rulePlayMachine、rulePlayTray、rulePlayCardWhite、rulePlayCardYellow。image宽高来自实际落地PNG，原图与提示词可追踪。

现有ruleMachine.start/add/multiplier控制所有数量；cardFlip.initial/steps控制正反和顺序。卡面切换用同一按钮内部两张图，状态仍由session提供，动效不改变判题时机。
