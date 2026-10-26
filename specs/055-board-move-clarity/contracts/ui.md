# UI契约
BoardMoveBoard(model,response,disabled,onToggle)只通过选入/取消按钮调用onToggle(tokenId)。空格点击只改变previewCell，任何时刻最多一颗试放子。固定黑/白子不可点击；候选以虚线圈和加号表达。已选格用勾选标记，不画额外实心黑子。共享undo/clear改变response，清除试放暂态。规则重听使用本地声音；核心控件可键盘操作。
