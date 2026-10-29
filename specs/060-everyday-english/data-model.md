# Data Model

- `ActivityToken.speechLocale?: 'zh-CN' | 'en-US'`：省略时保持中文；运行时和导出必须一致。
- `ActivityBase.presentation.dialogue?: { speaker: string; english: string; chinese: string }[]`：英语逐句播放，中文仅提供简短语义；选择题 complete 后显示，parentObservation 的 play 阶段显示。
- `everydayEnglishSets: ActivitySet[]`：稳定原创 id；`primaryFamilyId` 为原创命名空间，`sourceRefs: [{sourceId: "original-060", locator: "specs/060-everyday-english/spec.md"}]`，明确原创规格来源，不伪造上实参考资料。
- 插图从 `imageGallery.scenes.englishDailyMorning/Farewell/Thanks/Sorry/Water/Help` 读取，经 `illustration` 显示。
- 选择沿用 `singleChoice`，亲子沿用 `parentObservation`；不新增存储状态/迁移。
