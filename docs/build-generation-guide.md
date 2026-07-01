# 小小思考岛构建与生成规范

这份规范用于每次大更新后的统一生成、检查和提交。

## 题库文案

- 题目要像成年人自然对孩子说话，避免“平常规则”“小卡片”这类含糊说法。
- 题干、图面、选项必须指向同一件事；如果图里没有篮子，文案里不要写“草莓篮”。
- 干扰项要代表常见误判或次优选择，不能靠绕口令、双重否定或故意刁难。
- `math-subitize-match`、`logic-pattern-train`、`logic-sorter-switch`、`logic-stop-think`、`logic-order-plan` 不允许用完全相同题面复制凑数。
- 数数图卡每行固定 5 个，帮助孩子按 5 或 10 建立数量记忆。

## 语音

- 当前统一声音是 Edge TTS `zh-CN-XiaoyiNeural`。
- 题库文案变更后必须运行：

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --python ./local-tts/.venv/bin/python --quiet --retries 3
```

- 应用运行时只要本地 mp3 存在，就优先播放本地 mp3；浏览器 TTS 只作为缺文件时的兜底。
- `local-tts/GENERATION.md` 的 F5-TTS 方案只有在有稳定参考音频和精确参考文本时使用；没有参考声音时不要混入不同音色。

## 图片

- 场景图放在 `public/images/scenes/`，注册到 `src/data/imageGallery.ts`。
- 场景图必须是 1200x675 PNG，并保留 `source/` 原图。
- 高频对象图优先用 `public/images/items/` 或 `public/images/avatars/` 的统一 raster 资产；只有缺资产时才用内置 SVG 图卡。
- 场景图要尽量撑满题面，但不能裁掉关键线索。

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

- `public/audio/voice/manifest.json` 的 `provider` 仍是 `edge-tts Python package`。
- `voice` 仍是 `zh-CN-XiaoyiNeural`。
- `count` 和 `requestedCount` 一致。
- `failures` 为空。

关键变更前后都要提交，避免题库、语音和视觉资产混在不可回退的大补丁里。
