# 067 任务清单

- [x] T001 建立 `specs/067-curriculum-appeal-and-difficulty/` 规格、方案与任务清单，保存修改前快照供历史边界链核验。
- [x] T002 [P] [US1] 清理 `public/images/items/graphic-workshop/*.png` 洋红抠图毛边，修复 `scripts/lib/exploration-renderer.mjs` 紧缩 `viewBox` 背景偏移、`src/speech-pronunciation.ts` 多音字 `长` 与 `src/speech.ts` 多语种兜底缓存。
- [x] T003 [P] [US1/US2/US3] 修复启蒙数据与图卡映射（`src/data/logicLessonVisuals.ts`、`src/data/games.ts`、`src/components/VisualToken.tsx`）：替换 17 道 QA 备注、修正错配图文与 `mirror-fold-5`、平滑 `compose-decompose` 与 `number-pattern-trail` 梯度、修复 66 道直报答案 `retry` 与时钟重复文案、替换 `graphic-layer-overlap` 同色示例与微移干扰项。
- [x] T004 [P] [US1/US3] 升级启蒙交互与视觉组件（`src/games/ProgressiveSetGame.tsx`、`src/components/SharingBoards.tsx`、`src/domain/fair-share.ts`、`src/components/BirdDepartureBoard.tsx`、`src/components/BridgePlayBoard.tsx`、`src/styles.css`）：隐藏 `memory-camera` 观察期题干与选项、优化分蛋糕余数反馈与快捷轮分、修复 `block-height-map` Q10–Q12 网格、增加天平支点图与错答高亮、消除两步场景重复读题。
- [x] T005 [P] [US1/US2/US3] 升级探索数理与逻辑题族（`src/curriculum/exploration/{math,logic,helpers}.ts`、`src/interactions/MathEvidence.tsx`）：修复 `N08` 同构等分图、`N07` 余数排布误导、`N02/N03/N04/N05/N14/N16` 组内梯度与洗牌、`L01/L03/L05/L06/L07/L10/L11` 预排顺序/死路/阻挡白子/比较图，消除 `helpers.ts` 第 2 条剧透提示。
- [x] T006 [P] [US1/US2/US3] 升级探索图形、记忆、语言与生活题族及交互（`src/curriculum/exploration/{graphic,draw,pyramid,task-diagrams,memory,language,life,presentation}.ts`、`src/interactions/AdvancedInteraction.tsx`、`src/games/ActivitySetGame.tsx`）：修复 `G16` 3D 斜轴测投影、`G14` 实心格锚点、单层多格与末题双层构形、`G18` 自身面选项、`G19` 单点切换涂格、`G07` `2×2` 清晰金字塔、`G04/G08/G11/G12/G15/G17` 梯度与图解、`E05` 听音认字/拼音记忆防泄题、`A01/A02/A03/A07/A08` 梯度与音色、`P05/P06/E08/P02/P03` 材料与屏幕图卡、单选看大图与移除回忆后缀干扰音。
- [x] T007 [US4] 重新生成探索图音资产、导出并合成 Edge 本地语音、同步抖音数字岛出口，更新 `before-curriculum-review.mjs` 快照链并新增 `067` 专项回归测试。
- [x] T008 [US4] 执行全套回归测试、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`、`pnpm audit:illustrations` 与 `pnpm mac:install`，更新 `docs/CHANGELOG.md`、`docs/TODO.md` 及 `specs/067-curriculum-appeal-and-difficulty/verification.md`。

## 审计后修复

- [x] T009 [US1] 以 ccd456d6 和最终目录比对规则、证据及作答要求，在 src/curriculum/exploration 中提升相应题目版本，回归旧存档和未变题。
- [x] T010 [P] [US2] 修复 src/interactions/AdvancedInteraction.tsx、src/games/ActivitySetGame.tsx 和 src/engine/activity-session.ts 中的选项预览、拼板拿起、批量撤销及 E05 朗读与无障碍名称。
- [x] T011 [P] [US2] 修复 src/games/ProgressiveSetGame.tsx、src/domain/enlightenment.ts 和 src/data/games.ts 中的记忆分阶段文字与语音、单图回看、跨端小鸟题和重复分合题。
- [x] T012 [P] [US3] 修复 src/curriculum/exploration 中的 N02、L03、N14、G17 图证、选项及反馈，验证各变式。
- [x] T013 [US4] 校正 src/curriculum/exploration 的难度配置、拼搭分层与 P05 地图观察。
- [x] T014 重建内容变动记录、插图、语音及抖音快照，运行回归、独立运算和全量资源检查。
- [x] T015 核实桌面及窄屏生产交互，安装并打开 Mac 应用，更新本目录 verification.md、docs/CHANGELOG.md、docs/TODO.md。

T010、T011 和题库内容的 T012–T013 可按文件边界并行。T009 的版本范围在所有题目定稿后复核。T014 与 T015 按依赖顺序执行。
