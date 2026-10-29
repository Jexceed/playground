# Data Model

- GalleryImage：六个现有 scenes key / src / width / height 保留，仅更新 alt。
- Activity：ID、schemaVersion、revision、answerId、tokens、steps、observations 与对话英文保持不变；仅修正涉及人物性别的中文 hints/retry。
- 生成记录：每图保留 target、reference、prompt、sourcePath、runtimePath、dimensions、sha256 和处理方式。
- Progress：无字段、状态或迁移变化。
