# 实现方案：喝水情境与顺序演示

## Technical Context

React 19 / TypeScript 5.8 / Vite 7；已有 GalleryImage、本地语音和Tauri打包。无新依赖。在现有dev工作区实施，规格目录不是新Git分支。

## Constitution Check

满足儿童情境、图片语义一致、稳定题目身份、本地可审计资产和真实应用验证。图片只描绘对应事实，不把洗手场景恢复到喝水题。不变性测试证明其余题目和探索内容未改。

## Phase 0 / Research

940271cb撤除了整个顺序题组sceneImage，包括第1题借用的snackWashHands。现有RoundBoard仅静态渲染sequence，未接收isCorrect，不能填补成功后的缺口。VisualToken把口渴/喝水映射到cup。新增专用顺序故事组件避免修改其他题型行为。

## Phase 1 / Design

- imageGallery注册两张1200x675喝水起始场景与六张同人物动作图。源图及提示落对应source目录。
- src/data/orderStories.ts登记第1/9/18题的情境图及图卡，场景通过imageGallery.scenes引用；后两题使用独立空杯情境，不能用未拿杯的初始场景。
- GameRound添加可选sequenceStory键；games.ts只给三题注入该键与场景、适配指令。
- OrderSequenceBoard先显示完整场景和开始控件；进入任务后显示四/三张大动作卡。正确时补图、定时逐卡强调，同时显示当前放大动作。暂停/上一/下一/重播可控；减少动态时不自动播。切题或重置重新挂载。
- 当前一屏布局优先保留场景/动作清晰度和答案/反馈可达。图卡点击播放已有本地标签语音，不叠加自动播音。
- 导出并增量补齐Edge语音；更新CHANGELOG、TODO及资产文档。

## Phase 2 / Verification

规格要求针对性回归：纯状态转换/填空规则、三个稳定ID与其余内容不变、场景尺寸及文件存在。浏览器检查1280x788及窄屏、错误/正确/暂停/单步/重播/切题/reduced-motion。运行build、audit:curriculum、现有相关回归及voice-media审计。完成mac:install后检查安装身份/签名并原生打开验收。保留历史证据。

实现补充：原生复查发现第9/18题仍使用旧选项图标，追加两张空杯干扰动作图，六张动作图统一用于三个题目的选项。仓库不存在update-agent-context.sh；已运行setup-plan/setup-tasks，未伪造脚本成功或重写AGENTS.md。
