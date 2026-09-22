# Data model
- ActivityToken.textOnly?: boolean：有本地图片但内容只有文字；配对可直接渲染 label。无数据迁移。
- MatchingResponse.pairs：仍为 [leftId, rightId][]。编辑新连接时移除同一左右端点的旧连接；只断开指定配对。response结构不变。
- MatchingActivity.alternativePairings?: [string,string][][]：仅由作者显式登记等价答案。本轮 L02 第7–9题的重复圆形可互换，不自动根据图片推断，不传给连接编辑函数。原正确答案继续有效，身份与历史完成记录保留。
- GraphResponse：network counts / route edgeIds 不变。桥在 fixed..max 循环；route 只接受连接当前位置的未封闭、可重走规则允许的边。
- 暂态：选择端点、拖动位置、hover目标。取消/失焦/response改变后不向评分状态写入未完成操作。
- 图片/语音/进度/题目身份沿用当前 schema，题目含义不变所以不递增 revision。
