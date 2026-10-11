# Research: 题目复核修正

## Evidence

基线 dev `d8dcbf2c`。输入为 2026-10-11 三份只读复核，当前源码已对读；spec 持久记录具体问题与题号，不依赖 `/tmp/enlightenment-review-20261011.md`、`/tmp/exploration-review-20261011.md`、`/tmp/illustration-review-20261011.md` 长期存续。

## Decisions

### 精确图形与语义图片

- Decision: 正方形、方向、颜色形状和相反词比较属性用程序图/已有图组合；播种与盒子开关用 image-gen。
- Rationale: 数量、坐标和单属性差异需要精确；故事动作需要可辨具体物体。
- Alternatives: 整批重绘会引入方向/数量误差；纯文字不能完成本轮低识字支架。

### 播种独立帧

- Decision: 独立 1×1 frame 图覆写 `explorationArt.planting[1]`，原 atlas 及其他三帧保留。
- Rationale: 现有 renderer 和引用审计支持 frame，单图用 1×1 frame 可统一处理；局部修正避免影响三个合理帧。
- Alternatives: 覆盖整张图集有附带变化；跨图组换图会破坏角色/风格连续性。

### 插画审计

- Decision: 播种和盒子两图按 1×1 frame 注册，并核对实际渲染引用。
- Rationale: 当前 collector 已支持任意行列 frame；1×1 frame 无需新模型。原种植图集索引 1 不再注册，其余三帧保留；预期 18 个资源组、74 张注册图卡。
- Alternatives: 另增无 frame 审计模型与 retirement 状态增加不必要改动；删除旧图集破坏剩余帧与来源记录。

### Revision

- Decision: 保留 stable IDs，仅实质规则或证据变化的活动提升 revision；纯表现增强不全库升级。
- Rationale: `src/services/activity-progress.ts` 按 activityId/revision 保留历史，新 revision 不能继承旧证据，也不删除旧记录。
- Alternatives: 重建 ID 破坏历史和导航；统一升级误伤无关活动完成状态。

## Open Questions

无阻塞澄清项。儿童实际理解和难度仍需之后亲子试玩；局部找整体颜色支架、软垫外观不作为本轮无依据重绘目标。
