# 实现方案

## Technical Context

React/TypeScript/Vite/Tauri既有栈，无新运行依赖。现有OrderSequenceBoard已经实现三道喝水题，推广到所有24题。基线39871af4，继续既有dev工作区。

## Constitution Check

生活情境、准确语义、可审计本地图、稳定身份与原生验收均保留。只改本组视觉元数据和统一指令；全过程不以批量恢复错误旧场景代替内容审查。

## Phase 0

对rounds.json建立逐题场景/步骤/选项清单。按门锁、小鱼、种植、卫生点心、搭塔、分类、交通、模型桥、学习用品与出门分组。同语义允许复用，前置状态不同必须不同图。原喝水六卡两场景保留。

## Phase 1

3个gpt-6.1-sol绘图代理负责互不重叠图片族，读取imagegen技能并用内置工具作图；只写各自PNG/source/manifest。主代理负责source注册、题目数据、通用映射、组件可访问性和版式。生成源与prompt/输出裁切记录同目录留存。

新orderStoryAssets登记场景/图片；imageGallery引用注册；orderStories按稳定题号选择具体场景、步骤与选项图片（避免“走过去”等跨题冲突）。GameRound.sequenceStory兼容既有drinking并支持通用order。题目初始化走同一故事入口，取消水专用分支与中文标签。旧tests通过精确后续授权范围适配，旧冻结基线不改。

## Phase 2

每题覆盖scene/sequence/choices及完成后的图片全部存在，未知图片不得静默退回问号。逐题图片语义人工核查；24题浏览器三状态与长文案边界。导出/补齐Edge语音，build、audit:curriculum、voice-media和相关回归。mac:install后原生验收并检查签名/二进制一致/进度保留。写verification、CHANGELOG、TODO、assets。
