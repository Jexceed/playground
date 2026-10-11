# Independent Review — 2026-10-11

## Scope and Evidence

应用 diff 已只读复审：启蒙 games/VisualToken/ProgressiveSetGame、探索九个模块与图卡表现、explorationArt、语音导出 tokenLabels 和课程/插画审计调整。直接查看本地 `sowing-seed.png`、`box-open.png`、`box-closed.png`，播种动作可辨、没有提前发芽；两盒子颜色/视角一致、开闭状态明确。此处不代替根代理的真实浏览器或 Mac .app 验收。

修正前基线由根代理在编辑前捕获，commit 为 d8dcbf2c，SHA-256 为 `780a3d79b1bf4a34a9aad708f9843567c2144c23f44e2ceba9f167a8a3feabc4`；本次未改该文件，也未改 040 历史基线。

## Results

- JSON 规范化后，启蒙恰好 34 题、探索恰好 50 项发生允许范围内变化，其余逐项深度相等；题组元数据、40/75 组与489/621项的 stable IDs 均保留。
- G16 标右侧观察后，侧视图按前排→后排排列，即 row1、row0；与候选箭头/上视图方向一致。目标图和所有候选共同采用该约定，合法答案集合不变。
- 探索恰好 18 项 revision 由1升2：L09全9项，L11第7–9、G16第7–9、E07第4–6。其余 revision 不变，所有作答协议、答案合同均保留。
- 整理题目标、混放结果、模型过河材料和相关干扰项对齐。额外修复的 priority-choice-2 属同类无关干扰项“先看书包”，已同步规格。转向1–12统一去除场景，已同步范围。
- 原 planting atlas 与 source 都保持 SHA-256 `bcd406509310328efb60cd70b002ff230fa326f73ae2fe759adba629f0543eb9`，该值独立来自 `git show d8dcbf2c:<path>`。
- 未发现需要阻止本轮交付的新缺陷。真实窗口中的文字尺寸、题面溢出、语音播放和导航仍按 quickstart 由交付验收确认。

## Test Migration

仅改授权文件 `scripts/enlightenment-quality.test.mjs`、`scripts/exploration-presentation.test.mjs`，新增 `scripts/curriculum-review-invariants.test.mjs`。

旧040“探索内容完全不变”断言已用043前置快照和具体题号/字段 allowlist替代，未更新旧快照来消除失败。新测试额外限制候选的 ID/词义、答案合同和旧 revision 证据；原种植 atlas/source 哈希固定，避免局部替换误改其他三帧。插画测试验证实际路径及 1×1/2×2 坐标，E01所有配对仍是原相反词并实际使用本地图片。

命令：

```bash
node --test scripts/enlightenment-quality.test.mjs scripts/exploration-presentation.test.mjs scripts/curriculum-review-invariants.test.mjs
```

结果：37 tests，37 passed，0 failed。第一次新增 E01 注册断言因测试 loader 将不同模块编译为隔离实例，读到未填充的单独 imageGallery.exploration，已改用课程模块同时导出的 drawing 注册表；运行图片存在性、图库卡注册和词义配对仍严格检查，第二次全部通过。
