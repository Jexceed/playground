# 审查数据模型
ChapterReview: gameId/title/section/world/roundIds，contentReview{status,evidence,notes}，variants[{key,roundIds,renderEvidence,decision}]，issues[{id,roundIds,problem,fix,evidence,status}]，fontAudit{desktop,mobile,embeddedText}，status。
状态pending→reviewed-with-issues→fixed→browser-verified→verified。browser-verified必须内容/表征/实际页面证据齐全，无open问题；verified还要求所需原生验收完成。抽样截图只证明对应变体；全章内容逐题独立复核。
Baseline: 原始catalog哈希、各题身份/答案/规则指纹、语音文件hash及Git状态。进度模型与运行时题库结构不新增字段。
