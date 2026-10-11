# Tasks: 启蒙与探索题目复核修正

**Input**: `specs/043-curriculum-review-fixes/` 下 spec、plan、research、data-model、contracts、quickstart。

**Tests**: spec FR-006 要求语义、方向、候选公平性、revision 与独立插画审计的必要回归；不要求为低风险逐句文案写镜像测试。

## Phase 1: Setup

- [x] T001 核对 dev 基线与三份复核，将全部题号和验收写入 `specs/043-curriculum-review-fixes/spec.md`。
- [x] T002 运行 Spec Kit setup-plan/setup-tasks，完成 `specs/043-curriculum-review-fixes/plan.md` 及 research/data-model/contracts/quickstart，检查 hooks 与 agent-context 脚本是否存在。

## Phase 2: Foundational

- [x] T003 明确单帧替换、1×1 frame 审计与 revision 历史策略到 `specs/043-curriculum-review-fixes/data-model.md`。
- [x] T004 明确题前规则、候选公平性及本地交付约束到 `specs/043-curriculum-review-fixes/contracts/question-surface.md`。

**Checkpoint**: 设计和共同约束可执行，US1/US2/US3 可按文件所有权并行。

## Phase 3: US1 — 启蒙一致图卡与合理选项（P1，首个可独立验收增量）

**Goal**: 删除凭样式猜答案及方向矛盾，明确情境目标，让干扰项反映真实误判。

**Independent Test**: 运行 enlightenment 回归并查看目标题号，隐藏文字仍可比较矩阵所有候选。

- [x] T005 [US1] 在 `src/components/VisualToken.tsx` 及 `src/data/games.ts` 统一矩阵第 6 题示例和全部双物体候选的图像表现；必要时仅局部调整 `src/games/ProgressiveSetGame.tsx`/`src/styles.css`。
- [x] T006 [US1] 在 `src/data/games.ts` 删除或更正转向全部 12 题的非必要 sceneImage，确保逆时针、半圈、往返无额外单向暗示。
- [x] T007 [US1] 在 `src/data/games.ts` 将分类机第 9–11 题设为目标、只错颜色、只错形状三个候选。
- [x] T008 [US1] 在 `src/data/games.ts` 补整理三题的分类/查找目标及可观察混放结果，补错了怎么改第 7 题的桌面过河目标和材料。
- [x] T009 [US1] 在 `src/data/games.ts` 替换 spec 所列八题无关干扰项（含同类发现 priority-choice-2），过路情境注明成人陪同，保留唯一有依据的最佳步骤。
- [x] T010 [US1] 在 `src/data/games.ts` 将图卡少哪张第 1–6 题改为缺失图卡措辞。
- [x] T011 [US1] 在 `scripts/curriculum-review-enlightenment.test.mjs` 补矩阵候选图像公平性、双条件反例和情境/方向的必要回归并运行，记录到 `specs/043-curriculum-review-fixes/verification.md`。

## Phase 4: US2 — 探索规则和精确证据（P1）

**Goal**: 关键规则作答前可见，几何/方向正确，反馈解释当前问题。

**Independent Test**: 独立核算 L11 落点及 G16 投影，查看其余指定分支题前规则和语音导出来源。

- [x] T012 [US2] 在 `src/curriculum/exploration/language.ts` 修 E07 第 4–6 题等边 square，并自然改写 E03 第 1–6 题事件句。
- [x] T013 [US2] 在 `src/curriculum/exploration/logic.ts` 前置 L09 白黄双面规则、L11 横竖斜线及连续夹住计数规则。
- [x] T014 [US2] 在 `src/curriculum/exploration/draw.ts`、`src/curriculum/exploration/graphic.ts` 为 G16 第 7–9 题所有候选画一致前/侧箭头；按矩阵方向独立核对投影。
- [x] T015 [US2] 在 `src/curriculum/exploration/graphic.ts` 将 G17 第 7–9 题反馈改为本题前后和球的位置，保留前六题左右解释。
- [x] T016 [US2] 在 `src/curriculum/exploration/math.ts`、`memory.ts`、`life.ts` 分别明确 N16 第一次起算、A02 空白卡、P05 地图与同地点绘本/图片材料。
- [x] T017 [US2] 在 `src/curriculum/exploration/` 的具体活动分支按语义变化提高 revision，在 `specs/043-curriculum-review-fixes/verification.md` 记录范围/理由并验证 stable IDs 与旧历史保留。
- [x] T018 [US2] 在 `scripts/curriculum-review-exploration.test.mjs` 补 square、棋盘独立计数、观察方向及必要规则的回归，在 `scripts/curriculum-review-invariants.test.mjs` 核验 043 前置快照允许题号/字段及其余深度相等、答案/ID/原图哈希/历史保留，并迁移 `scripts/enlightenment-quality.test.mjs` 的旧 explorationHash 断言；记录证据到 `specs/043-curriculum-review-fixes/verification.md`。

## Phase 5: US3 — 播种单帧与相反词图卡（P2）

**Goal**: 完成用户明确要求的 image-gen 局部强化和实际替换。

**Independent Test**: 对照源图查看应用的 L06/A05/E01 卡片，所有图卡有注册/使用审计且比较条件一致。

- [x] T019 [P] [US3] 用 image-gen 生成并视觉核验独立播种帧和同盒子开/关两图，源图保存到 `public/images/items/exploration-art/source/`，运行 PNG 保存到 `public/images/items/exploration-art/`。
- [x] T020 [US3] 在 `src/data/explorationArt.ts` 以 1×1 frame 只覆写 planting[1] 并注册盒子卡，接入 `src/data/imageGallery.ts`，确认原 planting atlas 字节及其余帧不变。
- [x] T021 [US3] 在 `src/curriculum/exploration/language.ts`、必要时 `presentation.ts` 接入 E01 开/关图片和高低/上下/长短/多少精确比较图，保留标签/语音；与 T012 串行整合。
- [x] T022 [US3] 在 `scripts/lib/illustration-usage.mjs`、`scripts/audit-illustration-usage.mjs` 为 1×1 单图补标题/计数说明，更新 `scripts/exploration-presentation.test.mjs` 的单帧替换、18组74卡、E01图片支架及 revision 断言，刷新 `docs/illustration-usage.json`、`docs/illustration-guide.md`。
- [x] T023 [US3] 核查 L06 第 1/4/7、A05 第 6、E01 第 1–6 题实际图片和比较条件，将生成来源、哈希、引用及视觉证据写入 `docs/assets.md`、`specs/043-curriculum-review-fixes/verification.md`。

## Phase 6: US4 — 语音与本地安装交付（P1，依赖内容稳定）

**Goal**: 图文/声音一致，构建与安装可用，历史不丢失。

**Independent Test**: 语音清单严格对齐、provider 合规、必要检查通过，真实 .app 可见新内容并能继续现有导航。

- [x] T024 [US4] 执行 export:voice-lines 和标准 Edge 生成命令，更新 `public/audio/voice-lines.json`、`public/audio/voice/manifest.json` 及对应媒体文件。
- [x] T025 [US4] 核对 voice-lines/manifest、failures 与 provider，运行语音媒体审计，结果记入 `specs/043-curriculum-review-fixes/verification.md`。
- [x] T026 [US4] 运行相关活动/探索/启蒙回归、`pnpm audit:illustrations`、`pnpm audit:curriculum`、`pnpm build`，记录当前结果到 `specs/043-curriculum-review-fixes/verification.md`。
- [x] T027 [US4] 执行 `pnpm mac:install` 更新 `/Applications/小小思考屋.app`，核对安装产物身份和结果并记入 `specs/043-curriculum-review-fixes/verification.md`。
- [x] T028 [US4] 打开真实 `/Applications/小小思考屋.app` 检查代表题面/图片/语音/返回恢复与旧进度保留，分别记录实际通过及未验证边界到 `specs/043-curriculum-review-fixes/verification.md`。

## Phase 7: Polish & Documentation

- [x] T029 更新 `docs/CHANGELOG.md`、`docs/TODO.md` 和相关资产说明，区分已完成修正与仍需儿童实玩的观察项。
- [x] T030 对照 `specs/043-curriculum-review-fixes/spec.md` 复审完整 diff/验证证据，只勾选完成任务；交付说明写明安装结果，不提交或推送 main。

## Dependencies & Execution Order

T001–T004 → US1 与 US2 并行；T019 可与 US1/US2 并行生成。T020 等待 T019，T021 等待 T012/T020，T022 依据 T020 实际结构，T023 等待 T020–T022。US4 内容语音工作等待 US1–US3 文案稳定；最终安装等待构建/审计通过；文档签收最后。

## Parallel Examples

- US1 的 `games.ts`/`VisualToken.tsx` 负责人可与 US2 的 `src/curriculum/exploration/` 负责人并行，不多人同时改同一文件。
- US2 `language.ts`、`logic.ts`、`graphic.ts` 可分文件实现，但 revision 和回归由一人整合；本任务列表未把相互依赖步骤标为任意并行。
- US3 T019 图片生成可与两个课程工作面并行；E01 `language.ts` 的 T021 必须与 T012 交接。
- US4 在冻结图文后可以并行读取审计证据与补文档，但语音生成、最终审计、安装按依赖顺序执行。

## Implementation Strategy

US1 是首个可独立验证的增量；本次用户已授权 US1–US4 全部交付，完成一个增量不停止。每阶段检查其独立验收再集成，最后按 quickstart 完成标准语音与真实 Mac 安装，保持 dev，不发起 main 发布。
