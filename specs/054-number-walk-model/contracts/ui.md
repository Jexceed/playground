# UI契约
NumberWalkBoard接收model,response,disabled,onPlace(slotId,tokenId)。只有点击数字格/拖到格子触发onPlace；选择角色、规则重听不提交答案。disabled时作答不可用；全局undo/clear改变response即改变画面。图中起点一直可回看；同格两角色分两行，数字不被遮挡。窄屏连续路径局部滚动，选择角色将当前位置滚入视野。
