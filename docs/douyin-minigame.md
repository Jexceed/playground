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
| 模拟器首次启动 | 5 秒内出现可交互数字岛首页 | 已通过：重新编译后 1.8 秒轮询内出现首页；`Main.scene` 日志为 16.7–25.5 ms |
| 题目闭环 | 选错可重试，答对可下一题，语音不叠加 | 已通过答错→具体提示→改选→答对→家长追问→下一题；语音无运行错误，听感与叠音继续由真机确认 |
| 本地进度 | 退出重进恢复；损坏存档回到空进度 | 已通过：恢复到第 4 题；注入损坏值后安全回到初始主页 |
| 离线重启 | 已下载的图片、语音和题目可完成一局 | 已通过：开发工具切换 Offline 后重新编译，首页、图片和题库正常出现 |
| 侧边栏 Mock | 支持时展示入口，热启动参数不丢失 | 已通过：`checkScene` 返回 `isExist: true`，`navigateToScene` 成功，侧边栏点回后首页恢复 |
| 安全区 | 刘海和底部手势区不遮挡核心按钮 | 已通过：iPhone SE 2、iPhone 15 Pro、Xiaomi 15、iPad；长页面可滚动 |
| 本地构建包 | AppID、主场景和资源闭包正确，未超过当前未分包 16 MB 门槛 | 已通过：12.00 MB |
| 平台包体 | 满足抖音后台与当前基础库实际限制 | 待外部验证 |
| iOS 真机 | 完整跑一个游戏并抽查时钟题 | 待外部验证 |
| Android 真机 | 完整跑一个游戏并抽查时钟题 | 待外部验证 |

### 2026-08-13 开发工具实测记录

- 工具版本：抖音开发者工具 4.5.5，基础库 4.19.0.2；登录应用为
  `小小思考屋` / `tta51dd3a03b67523202`。
- 导入目录：`doyingame/build/bytedance-mini-game/`。首次导入暴露出运行时
  新节点仍在 Cocos 默认层、而相机只渲染 `UI_2D` 的白屏问题；修复为新节点在
  挂到父节点前继承父层，并增加静态回归检查。修复后模拟器控制台只有引擎信息
  与 `Main.scene` 加载日志，没有小游戏运行错误。
- 人工闭环覆盖：第 3 题选错得到“从左到右，一个一个点着数，不要漏掉”的具体
  提示；改选 3 后得到正确反馈和家长追问，点击下一题进入 4/18；返回首页后显示
  “继续：数一数 · 第 4 题”。
- 本地存储面板确认键 `thinking-house-douyin-math-progress-v1` 写入成功；手动注入
  `broken-progress` 后重新编译，应用没有白屏或异常，而是回到规范化空进度。
- 网络菜单切到 `Offline` 后重新编译仍能显示完整首页，证明当前首发核心体验不
  依赖在线题库、图片或语音下载。测试后已恢复 `Wi-Fi`。
- 三档代表设备与额外平板均通过：iPhone SE 2、iPhone 15 Pro、Xiaomi 15、iPad。
  刘海、底部手势区不遮挡核心内容，题目选项和反馈区可通过竖向滚动完整访问。
- 侧边栏直接调用验证：`tt.checkScene({ scene: "sidebar" })` 返回
  `{ isExist: true, errMsg: "checkScene:ok" }`；`tt.navigateToScene` 成功打开模拟
  侧边栏，并可点回小游戏。开发工具的 Mock 下拉没有列出 `checkScene`，因此使用
  同一调试上下文直接调用官方 API 完成验证。
- 性能测试工具已生成真机二维码；其报告需要抖音 32.8.0 以上扫码并完整体验约
  3 分钟，结果在手机体验完成前仍不计为通过。

侧边栏入口只出现在平台 `tt.checkScene({ scene: "sidebar" })` 返回支持时；点击
调用 `tt.navigateToScene({ scene: "sidebar" })`。入口放在首页家长操作区，不
使用金币、奖励或诱导儿童复访。

## 提审前由账号持有人确认

- 后台小游戏名称、类目、版本说明、图标、横竖屏和适龄范围。
- 隐私说明与实际行为一致：本版本地存进度，不要求登录，不收集儿童输入。
- 软著、小游戏备案、主体资质及平台当期要求是否齐全。
- 玩法介绍、审核说明、截图/录屏与真机验证证据。

当前 Cocos 构建和抖音开发者工具证据已完成；在 iOS/Android 真机证据完成之前，
本仓库状态仍应描述为“数字岛工程准备完成”，不能描述为“已通过提审”或“已发布”。

体积策略依据抖音开发者工具 1.1.0 的官方更新说明：未分包小游戏上限为
[16 MB](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/dev-tools/developer-instrument-update-and-download)。
平台的通用代码包说明仍有 20 MB 表述，因此工程采用更严格的 16 MB 门槛，并
以账号登录后的开发者工具实际结果作为最终准绳。
