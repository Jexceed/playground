# Quickstart: 验证题目复核修正

在 dev 工作区根目录运行，先完成图文、图片注册与视觉检查。核对现有本地 Edge Python 后按标准 voice/rate/pitch 生成语音。

```bash
pnpm test:enlightenment
node --test scripts/exploration-quality.test.mjs scripts/exploration-presentation.test.mjs scripts/curriculum-review-enlightenment.test.mjs scripts/curriculum-review-exploration.test.mjs scripts/curriculum-review-invariants.test.mjs
pnpm test:activities
pnpm test:exploration
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:illustrations
pnpm audit:voice-media
pnpm audit:curriculum
pnpm build
pnpm mac:install
open /Applications/小小思考屋.app
```

若新增/修改单独插画审计测试，补运行对应 node --test 文件。

## Expected Results

1. 启蒙检查矩阵 6、转向 5/9/11、分类 9–11、整理 3 题及模型过河：候选公平、目标清楚、方向一致。
2. 探索检查 E07 4–6、L11 7–9、L09 1、G16 7–9、G17 7–9；独立复算棋盘与投影，核对题前可见规则。
3. 检查 N16 7、A02 1、E03 1–6、P05 3：起算、空白操作、自然语序、材料在作答/准备前说明。
4. L06 1/4/7、A05 6 出现新播种帧，其他三帧原样；E01 1–6 词义图片、标签、语音对应。
5. 插画审计无未注册、缺失或未使用运行卡；语音 manifest 对齐、failures 为空，报告 provider。
6. 保存 mac:install 结果和安装产物身份，打开真实 .app 检查代表页、语音、返回/恢复。不要清空用户真实进度。

证据、失败和未执行边界记入 verification.md；只有实际通过的任务才能勾选。
