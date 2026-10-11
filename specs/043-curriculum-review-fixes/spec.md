# Feature Specification: 启蒙与探索题目复核修正

**Feature**: 043-curriculum-review-fixes | **Branch**: dev | **Created**: 2026-10-11 | **Status**: Implementation authorized

**Input**: 用户要求完成 2026-10-11 整体复核发现的修正，并完成探索局部图卡的 image-gen 生成与替换。

## User Scenarios & Testing

### US1 — 启蒙题目用一致的图卡和相关选项表达目标（P1）

孩子能靠题目线索比较选项；家长能解释某一步为什么能完成任务。

**Independent Test**: 检查以下稳定 ID 的展开数据和实际题面，独立判断答案及干扰项；隐藏选项文字时仍能公平比较矩阵组合。

**Acceptance Scenarios**:

1. `logic-matrix-puzzle-6` 的示例和三个候选均显示相同结构、相同视觉等级的双物体组合；不存在只有正确项有图的捷径。
2. `logic-rotation-direction-5` 至 `-8` 不再显示相反的顺时针场景；第 9–12 题不再额外暗示单向 90 度旋转；第 1–4 题同样移除非必要场景，使整组保持统一呈现。
3. `logic-sorter-switch-9` 至 `-11` 每个干扰项恰好违反颜色或形状中的一个条件，两个条件都必须使用。
4. `logic-fix-plan-6`、`logic-condition-detective-6`、`logic-priority-choice-4` 作答前明确按种类分开放、方便寻找的目标，错误流程不再显示已成功“整齐”。
5. `logic-fix-plan-7` 明确桌面模型、过河目标及足够长木板等材料条件，图卡与反馈支持这个任务。
6. `logic-order-plan-7/-19/-20/-21/-24`、`logic-fix-plan-12`、`logic-priority-choice-2/-11` 的无关或夸张干扰项替换为漏步骤、重复步骤、顺序不当等真实误判；道路情境明确与大人一起。
7. `logic-part-whole-puzzle-1` 至 `-6` 题干改成寻找缺失图卡，不再描述成没有轮廓支持的拼图。

### US2 — 探索题目前置必要规则且图、反馈一致（P1）

孩子不需要先答对，才能知道作者使用的规则或观察方向。

**Independent Test**: 检查 E07、L11、L09、G16、G17、N16、A02、E03、P05 目标分支，独立复算方向和棋盘候选，实际题面核对规则位置。

**Acceptance Scenarios**:

1. E07 第 4–6 题的 red square 为等宽等高正方形。
2. L11 第 7–9 题题前说明横、竖、斜线及每方向连续夹住的计数规则；原正确落点经独立计算仍成立。
3. L09 全 9 题题前说明每张牌一白一黄、翻一次互换颜色。
4. G16 第 7–9 题每个立体候选均标出前、侧观察方向，箭头与前视列最大值、侧视行最大值的生成约定一致。
5. G17 第 7–9 题解释前后，并结合小朋友朝向和球的位置；不再只解释左右。
6. N16 第 7–9 题明确起始日浇第一次；A02 全 9 题作答前说明空位置也用空白卡还原。
7. E03 第 1–6 题前后事件句自然通顺；P05 第 3 题材料明确儿童地图以及同一地点的绘本或图片。

### US3 — 图卡清楚表达播种和相反词（P2）

孩子能指出图里发生的动作，也可借图片理解高低、开关、上下、长短、多少。

**Independent Test**: 查看生成源图和应用中的实际卡片；核对注册、引用、局部替换及词义比较条件。

**Acceptance Scenarios**:

1. image-gen 生成独立播种帧：同一橙猫和花盆，爪子把可辨识的种子放入土中，没有提前出现芽或小兔；替换 `explorationArt.planting[1]`，L06 第 1/4/7 题及 A05 第 6 题使用新帧。
2. 原 `planting-steps.png` 图集及其他三帧原样保留，旧第 2 帧作为历史源保留，不再计作现用帧；独立图卡按 1×1 frame 注册并通过现有引用审计。
3. image-gen 生成同一盒子、同视角、同颜色和尺度的开盖/关盖两张卡，无文字、箭头和序号，接入 E01 第 1–6 题相关词义配对。
4. 高低、上下、长短、多少采用可审计的精确程序图卡；相反词采用同一参照物、尺度、基线和材质，只改变所比较属性，标签和本地语音继续可用。

### US4 — 更新本地资源并可在安装版继续使用（P1）

家长获得图文一致、语音同步的真实 Mac 应用；已有记录不被删除或伪造。

**Independent Test**: 运行必要构建、审计与回归，核对语音清单/provider，安装并打开 `/Applications/小小思考屋.app`，保留实际检查结果。

**Acceptance Scenarios**:

1. 活动及题组 stable IDs 不变；探索实质规则或答案证据变更提高 revision，纯流畅度和图片表现增强不无差别提高 revision；旧历史保留。
2. 重新导出 voice-lines，按标准 Edge Xiaoxiao 配置生成语音；manifest 对齐、failures 为空，报告 macOS say/mixed local 是否为零。
3. `pnpm build`、`pnpm audit:curriculum`、插画/语音审计及相关回归通过；执行 `pnpm mac:install`，打开真实 .app 检查并报告结果。
4. CHANGELOG、TODO、资产说明及本 feature 验证记录反映已完成工作和实际未验证边界。

## Requirements

- **FR-001**: 完成 US1 和 US2 全部修正；不整批重写无错误的题库。
- **FR-002**: 保留题组、活动 ID、课程入口与历史记录，按具体语义变化记录 revision 选择。
- **FR-003**: 故事/实物语义图使用 image-gen；数量、坐标、方向和比较属性使用确定性图形或已有本地组合。
- **FR-004**: 新运行图落到 `public/images/items/`，源图在同类 `source/`，注册到 `src/data/imageGallery.ts` 且实际引用；不新增装饰场景。
- **FR-005**: 独立播种帧和盒子卡以 1×1 frame 纳入引用审计，不能遗漏新增图卡的注册或实际引用。
- **FR-006**: 对方向、双条件干扰项、图卡公平性、revision 和独立图审计补必要回归；不为每一句低风险文案写镜像测试。
- **FR-007**: 必要条件在题前实际显示且进入语音，反馈支持亲子追问原因。
- **FR-008**: 完成语音、文档、构建/审计、真实 Mac 安装；不提交或推送 main。

## Edge Cases

- 前后反馈不能套到左右阶段；方向标记不改变块数或投影。
- 新播种帧使用 1×1 frame，旧图集其他三帧仍按原坐标裁切。
- E01 图像支架不覆盖其他语言题需要观察的字形。
- 旧 revision 完成记录不变成新 revision 证据，也不被删除。
- 图像/语音生成失败保留证据并重试，仍失败则如实报告，不能以缺失资源宣称完成。

## Asset & Documentation Impact

- Assets: `public/images/items/exploration-art/` 及 `source/`、必要程序图产物、`public/audio/voice-lines.json`、`public/audio/voice/manifest.json` 和新增语音。
- Docs: `docs/CHANGELOG.md`、`docs/TODO.md`、`docs/assets.md`、插画使用台账及本 feature 验证记录。
- Gates: build、curriculum/illustration/voice-media audits、相关回归、mac:install、真实 .app 检查。

## Success Criteria

- **SC-001**: 全部问题有实现位置及本轮证据，无未解释遗漏。
- **SC-002**: 启蒙仍为 40 组 489 题，探索仍为 75 组 621 项，题目身份不变。
- **SC-003**: 新插图都有源图、注册、实际引用及视觉检查；数量/方向图经独立规则验证。
- **SC-004**: 标准语音清单对齐、生成失败为零；安装结果和检查范围清楚记录。

## Assumptions

用户已授权修正及局部 image-gen 替换，不需再次确认。儿童试玩不能用自动审计或成人检查代替。局部找整体颜色支架、软垫外观等仅条件式建议保留后续观察，不增加无依据重绘范围。
