# Research

- Decision: 新增独立原创补充模块并接入 catalog。Rationale: `explorationSets` 的 71 个 family 与 597 题属于来源对标，不应虚增。Alternative: 给 E06 追加题会混淆来源计数和固定阶段。
- Decision: 英文 token 加可选 `speechLocale`，对话逐句使用 en-US。Rationale: 当前点击和导出默认 zh-CN，生成器已经支持 Jenny。Alternative: 在中文文本里夹英文无法保证使用正确音色与缓存键。
- Decision: 每场景一项选择、一项亲子活动；示范在选择完成后出现。Rationale: 先理解情境再模仿，保留真实交流和家长观察。Alternative: 重复同图作为选项只增加视觉噪声；录音评分不在范围。
- Decision: 既有听辨完成后直接复听。Rationale: 不重置答案和历史，方便跟说。
