# 调查记录

- git show 940271cb -- src/data/games.ts证实makeOrderRounds的所有sceneImage在该次清理中删除，包含第1题的洗手点心场景。文件本身仍在仓库。
- 旧图有无关脏手/饼干线索，直接恢复会引入错误推理。选择新增贴题场景。
- ProgressiveSetGame的RoundBoard没有成功态输入，因此答对以后问号保持原样。专用组件接收完成态，增加清楚的步骤展示。
- 使用内置image_gen；无需新API依赖。无需外部技术研究；方案使用仓库既有React/CSS和本地语音能力。
