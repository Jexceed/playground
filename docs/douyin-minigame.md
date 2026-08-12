# 抖音小游戏数字岛工程与提审边界

## 当前范围

- Cocos Creator：3.8 LTS，工程目录 `doyingame/`。
- 抖音小游戏 AppID：`tta51dd3a03b67523202`。
- 首发内容：仅数字岛 8 个游戏、122 道正式题。
- 明确不包含：逻辑屋、图形工坊、登录、云存档、广告、支付、排行榜、
  陌生人交流和儿童自由输入。

小游戏使用从正式题库生成的离线快照，不复制另一套手写题目。当前资源闭包
包含 19 张图片和 338 条本地普通话语音，共 357 个文件、9.56 MB。Cocos 功能
裁剪只保留 2D、UI、遮罩、Graphics、音频和 WebGL 等必需模块。

抖音快照会保留 1200×675 PNG 场景图，并把语音副本转为 32 kbps、24 kHz、
单声道 MP3；原 Web/Mac 标准语音包不变。导出时逐条检查 MP3 完整帧、时长、
采样率和哈希，避免以截断或不可解码的语音换取体积。

## 本地生成与自动门禁

```bash
pnpm export:douyin-math
pnpm test:douyin-minigame
pnpm audit:douyin-minigame
pnpm build:douyin-minigame
pnpm build
pnpm audit:curriculum
pnpm audit:voice-media
```

`test:douyin-minigame` 包含 Cocos 3.8 类型检查、题库一致性、答案和视觉面
检查、语音/图片闭包、家长提示、坏存档恢复、Cocos 3.8.8 构建模板契约和三种
竖屏尺寸的静态布局检查。`audit:douyin-minigame` 重新计算每个运行时文件的
SHA-256，并检查 AppID、竖屏、功能裁剪、14 MB 运行时资源预算和禁止资源。

## Cocos Creator 构建

1. 使用 Cocos Creator 3.8.8 打开 `doyingame/`，等待首次资源导入完成。
2. 打开 `assets/scenes/Main.scene`，先做 Web Mobile 预览。
3. 检查 375×812、390×844、430×932 三种竖屏；各游戏抽查首题、中间题和
   末题，完整跑一次选错、重试、答对、下一题。
4. 在构建发布面板选择“抖音小游戏”，确认竖屏和 AppID
   `tta51dd3a03b67523202`，构建到 `doyingame/build/bytedance-mini-game/`。

也可以运行 `pnpm build:douyin-minigame`。如果 Creator 不在标准安装位置，先
设置 `THINKING_HOUSE_COCOS_EXECUTABLE` 为其主程序绝对路径。

当前已使用官方 Cocos Creator 3.8.8 完成一次冷启动构建。自动构建会先重建并
刷新 Cocos 资源数据库，再检查真实导入类型，以避免首次导入时生成只有壳代码
的空包；随后验证构建产物中的 AppID、主场景、语音、图片、启动钩子和体积。
本次结果为 761 个文件、338 条 MP3、19 张 PNG、12.00 MB，输出目录为
`doyingame/build/bytedance-mini-game/`。

项目构建模板基于 Cocos Creator 3.8.8 官方 `bytedance-mini-game/game.ejs`，只
在 `loadCC()` 前增加同步 `tt.onShow` 注册，用来缓存侧边栏热启动来源。更新
Creator 补丁版本后应重新从编辑器生成模板并对照同步。

## 抖音开发者工具验证矩阵

将 `doyingame/build/bytedance-mini-game/` 导入抖音开发者工具，并记录下表。
这些是发布门禁，不能用 Node 测试或 Cocos Web 预览代替。

| 项目 | 通过标准 | 当前状态 |
|---|---|---|
| 模拟器首次启动 | 5 秒内出现可交互数字岛首页 | 待外部验证 |
| 题目闭环 | 选错可重试，答对可下一题，语音不叠加 | 待外部验证 |
| 本地进度 | 退出重进恢复；损坏存档回到空进度 | 待外部验证 |
| 离线重启 | 已下载的图片、语音和题目可完成一局 | 待外部验证 |
| 侧边栏 Mock | 支持时展示入口，热启动参数不丢失 | 待外部验证 |
| 安全区 | 刘海和底部手势区不遮挡核心按钮 | 待外部验证 |
| 本地构建包 | AppID、主场景和资源闭包正确，未超过当前未分包 16 MB 门槛 | 已通过：12.00 MB |
| 平台包体 | 满足抖音后台与当前基础库实际限制 | 待外部验证 |
| iOS 真机 | 完整跑一个游戏并抽查时钟题 | 待外部验证 |
| Android 真机 | 完整跑一个游戏并抽查时钟题 | 待外部验证 |

侧边栏入口只出现在平台 `tt.checkScene({ scene: "sidebar" })` 返回支持时；点击
调用 `tt.navigateToScene({ scene: "sidebar" })`。入口放在首页家长操作区，不
使用金币、奖励或诱导儿童复访。

## 提审前由账号持有人确认

- 后台小游戏名称、类目、版本说明、图标、横竖屏和适龄范围。
- 隐私说明与实际行为一致：本版本地存进度，不要求登录，不收集儿童输入。
- 软著、小游戏备案、主体资质及平台当期要求是否齐全。
- 玩法介绍、审核说明、截图/录屏与真机验证证据。

在 Cocos 构建、抖音开发者工具和 iOS/Android 真机证据都完成之前，本仓库状态
应描述为“数字岛工程准备完成”，不能描述为“已通过提审”或“已发布”。

体积策略依据抖音开发者工具 1.1.0 的官方更新说明：未分包小游戏上限为
[16 MB](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/dev-tools/developer-instrument-update-and-download)。
平台的通用代码包说明仍有 20 MB 表述，因此工程采用更严格的 16 MB 门槛，并
以账号登录后的开发者工具实际结果作为最终准绳。
