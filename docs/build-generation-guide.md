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
- 规律火车题要能从重复的一组推回空格答案：题面只保留一个 `?`，至少给出 3 个不重复选项；选项必须来自可解释的重复图卡或同类近干扰，反馈、重试和家长提示都要说出重复的一组、补完后的序列和答案。
- 同类题要让“同一类”的规则可见、可说；找不一样题要先说明哪三个是一组，再说明剩下的为什么不一样。
- 一模一样题要说清从左到右哪些部分完全匹配；三张里找不一样时，要先指出哪两张一样，再说明剩下那张哪里不同。
- 一模一样题的答案选项如果本身是组合图卡，只显示一张紧凑组合卡，不要同时显示图卡 cue 和重复的原始符号文字；位置选项如“左边这张”保留文字。
- 找不同题要先确认左右图里相同的东西，再说明哪个位置变了、右图多了什么或右图少了什么。
- 积木楼层图要把每个数字解释成“这一格有几层”，反馈先说每一行几块，再说总数；比较两张图时先说左右总数，再说谁更多或一样多。
- 三视图积木题要先说明从上面、前面还是左边看：上面看只数不是 0 的位置，前面看按列找最高，左边看按排找最高；三列或三排题的选项也必须给出三段高度，不能混入两段干扰项。
- 路线步骤题要能从网格算出答案：反馈必须说清从哪里出发、每一步往哪个方向、第一步到哪里、最后到哪里，不能只说“到了”或让孩子直接猜终点。
- 地址地图题要能从行列网格算出答案：给地址找物品时先说字母行和数字列，给物品找地址时先找到物品再读行和列，反馈和家长提示都要支持孩子指到交叉格。
- 矩阵补格题要能从完整示例行推出答案：反馈必须先说第一行或完整行怎么变，再说第三行空格为什么补这个，不能只给抽象规则。
- 方位小地图题要能从网格或里外分组算出答案：相邻题先指出参照物，再按左、右、上、下一格移动；里外题同时说里面和外面；相对方向题必须说清从谁出发看谁。
- 地址地图、方位小地图、路线步骤这类空间题只能有一个答案视觉表面；如果 `grid` 或里外分组已经承载答案，就不要再挂会表达位置关系的 `sceneImage`。
- 相机记忆题要能从刚才看到的图卡推出答案：出现题先复述记住了哪些卡，没出现题先排除看过的卡，顺序题必须按从左到右说出第几个或最后一个。
- 顺序计划题要能从图卡序列补出缺少步骤：每题只保留一个 `?`，反馈、重试和家长提示都要说出补完后的完整流程和缺少的答案。
- 所有题组都不允许用完全相同题面复制凑数；题量宁可少，也不要靠重复制造规模。
- `repeatTo` 只负责去重后取目标数量，不再循环复制题目。
- 数数图卡每行固定 5 个，帮助孩子按 5 或 10 建立数量记忆。

## 语音

- 当前可审计语音包可以来自三条链路：Edge TTS 固定声库、`local-tts/GENERATION.md` 描述的本地 F5-TTS 参考音色生成，或在 Edge 网络不可用时用 `generate:mac-voices -- --merge-existing` 补齐缺失条目的 macOS 本地兜底。
- 如果使用 Edge TTS，优先用更清楚的 `zh-CN-XiaoxiaoNeural`；不要混用多个 Edge voice。
- 最终发布包必须回到完整的 Edge `zh-CN-XiaoxiaoNeural` manifest；F5、macOS 或 `mixed local` 只允许作为生成受阻时的临时状态。
- 题库文案变更后必须运行：

```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm prune:voice-assets -- --write
```

- `pnpm prune:voice-assets` 默认只报告 manifest 未引用文件；确认 manifest 的
  `count === requestedCount` 且 `failures` 为空后，才使用 `--write` 删除。
- 删除后再次运行无参数命令，`orphanCount` 必须为 0。
- 启动页品牌音不进入课程 manifest；当前活动源和生成参数记录在
  `references/audio/launch-brand-shout/README.md`。

- 如果使用 F5-TTS，必须先准备 3-15 秒清晰参考音频和完全准确的参考文本，再运行：

```bash
pnpm export:voice-lines
pnpm generate:f5-voices -- --ref-audio /path/to/ref.wav --ref-text "参考音频里实际说的话" --voice family-teacher --quiet
```

- 应用运行时只要本地 mp3 存在，就优先播放本地 mp3；浏览器 TTS 只作为缺文件时的兜底。
- `local-tts/GENERATION.md` 的 F5-TTS 方案可以生成同一参考音色，但参考文本不准时会明显跑偏；没有可靠参考声音时不要伪装成 F5 生成。
- 如果 Edge 因网络/DNS 不能生成，又没有可靠 F5 参考音频，可以用 macOS 本地语音只补缺失条目：

```bash
pnpm generate:mac-voices -- --merge-existing --include-parent --limit 99999
```

  这会保留已有 Edge 条目，只为缺失文本写入 `macOS say + afconvert` 本地音频，并把 manifest 标为 `mixed local`。

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
- 地图网格格子本身就是位置容器，格子里的物品只能用扁平图标和标签，不要再套完整图卡边框。
- 矩阵格子本身也是位置容器，格子里的图形只能用扁平图标和标签，不要再套完整图卡边框。
- 记忆小相机的记忆格子本身就是卡位容器，里面只能放扁平图标、遮盖标记和标签，不要再套完整图卡边框。
- 应用必须记住上次打开的世界、关卡和题号；题库变化导致保存位置失效时，回到有效的第一个关卡和第 1 题。

## 验证

每次大更新后至少运行：

```bash
pnpm build
pnpm audit:curriculum
```

在 Mac 开发环境里，不能只用浏览器或 Vite preview 做最终预览。涉及
启动页、图标、语音、本地资源、持久化或发布体验的改动，还要生成真实
`.app` 并通过它预览和测试：

```bash
pnpm mac:build
open "src-tauri/target/aarch64-apple-darwin/release/bundle/macos/小小思考屋.app"
```

准备做本机安装或里程碑验证时，再运行：

```bash
pnpm mac:install
open "/Applications/小小思考屋.app"
```

浏览器预览只用于快速排版和交互迭代；Mac 端签收以生成出来的 `.app`
为准。

桌面发布还必须验证版本和跨平台流水线配置：

```bash
pnpm test:desktop-release
pnpm release:validate -- --tag v0.1.0
```

当前桌面发布范围只有 Apple Silicon Mac 和 64 位 Windows 10/11。Windows
本机可运行 `pnpm win:build` 生成 NSIS 安装程序；统一发布则推送与源码版本
一致的 `v<major>.<minor>.<patch>` 标签，由
`.github/workflows/desktop-release.yml` 并行生成：

- `thinking-island-<version>-macos-arm64.dmg`
- `thinking-island-<version>-windows-x64-setup.exe`

GitHub 会改写包含非字母数字字符的上传文件名，因此下载文件名使用稳定的
ASCII 字符；发布页仍用 `小小思考屋 macOS ARM64 安装包` 和
`小小思考屋 Windows x64 安装包` 作为中文展示标签。

在 Apple 公证和 Windows 商业代码签名完成前，流水线只能发布带明确安全
提醒的 GitHub 预发布版，不能作为已完成平台信任认证的正式发行版。

并检查：

- `public/audio/voice/manifest.json` 的 `provider` 是 `edge-tts Python package`、`F5-TTS local`、`macOS say + afconvert` 或 `mixed local`。
- Edge 包不要混用多个 `voice`；F5 包必须写入 `referenceAudio` 和 `referenceText`。
- `count` 和 `requestedCount` 一致。
- `failures` 为空。

关键变更前后都要提交，避免题库、语音和视觉资产混在不可回退的大补丁里。
