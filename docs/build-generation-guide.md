# 小小思考屋构建与生成规范

这份规范用于每次大更新后的统一生成、检查和提交。

## 题库文案

- 题目要像成年人自然对孩子说话，避免“平常规则”“小卡片”这类含糊说法。
- 题干、图面、选项必须指向同一件事；如果图里没有篮子，文案里不要写“草莓篮”。
- 干扰项要代表常见误判或次优选择，不能靠绕口令、双重否定或故意刁难。
- 同一道题的答案选项 `label` 和 `value` 都不能重复；如果图面里需要两张一样的卡，答案必须改成“左边这张 / 中间这张 / 右边这张”这类位置选项。
- 同一道题的选项含义也不能重复；相近选项只有在能解释“看错了哪个线索 / 用了旧规则 / 只满足一个条件”时才保留。
- 逻辑题的成功、重试和家长提示必须点回可见线索、当前规则、顺序、类别、条件或计划，不能只说“对了”或泛泛提醒。
- 难度说明要写清推理负荷或视觉表面，例如规则切换、两个条件、证据强弱、顺序步骤、空间判断、记忆或抗干扰。
- 同类题要让“同一类”的规则可见、可说；找不一样题要先说明哪三个是一组，再说明剩下的为什么不一样。
- 所有题组都不允许用完全相同题面复制凑数；题量宁可少，也不要靠重复制造规模。
- `repeatTo` 只负责去重后取目标数量，不再循环复制题目。
- 数数图卡每行固定 5 个，帮助孩子按 5 或 10 建立数量记忆。

## 语音

- 当前可审计语音包可以来自两条链路：Edge TTS 固定声库，或 `local-tts/GENERATION.md` 描述的本地 F5-TTS 参考音色生成。
- 如果使用 Edge TTS，优先用更清楚的 `zh-CN-XiaoxiaoNeural`；不要混用多个 Edge voice。
- 题库文案变更后必须运行：

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
```

- 如果使用 F5-TTS，必须先准备 3-15 秒清晰参考音频和完全准确的参考文本，再运行：

```bash
pnpm export:voice-lines
pnpm generate:f5-voices -- --ref-audio /path/to/ref.wav --ref-text "参考音频里实际说的话" --voice family-teacher --quiet
```

- 应用运行时只要本地 mp3 存在，就优先播放本地 mp3；浏览器 TTS 只作为缺文件时的兜底。
- `local-tts/GENERATION.md` 的 F5-TTS 方案可以生成同一参考音色，但参考文本不准时会明显跑偏；没有可靠参考声音时不要伪装成 F5 生成。

## 图片

- 场景图放在 `public/images/scenes/`，注册到 `src/data/imageGallery.ts`。
- 场景图必须是 1200x675 PNG，并保留 `source/` 原图。
- 角色头像放在 `public/images/characters/`，不要混入物品目录。
- 高频物体和动作图放在 `public/images/items/`；只有缺资产时才用内置 SVG 图卡。
- 场景图要尽量撑满题面，但不能裁掉关键线索。
- 资源目录和 `imageGallery` 分类必须一致：`brand`、`characters`、`items`、`scenes`。

## UI

- 左侧品牌区保留 logo 化表达，和世界选项卡区分开。
- 中间题面块之间要有明确间距；图卡组不能互相重叠。
- 带场景图的逻辑题优先让场景图足够大，辅助图卡在下方承接。

## 验证

每次大更新后至少运行：

```bash
pnpm build
pnpm audit:curriculum
```

并检查：

- `public/audio/voice/manifest.json` 的 `provider` 是 `edge-tts Python package` 或 `F5-TTS local`。
- Edge 包不要混用多个 `voice`；F5 包必须写入 `referenceAudio` 和 `referenceText`。
- `count` 和 `requestedCount` 一致。
- `failures` 为空。

关键变更前后都要提交，避免题库、语音和视觉资产混在不可回退的大补丁里。
