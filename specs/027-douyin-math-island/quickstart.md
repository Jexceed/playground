# Quickstart: 抖音小游戏数字岛首发版验证

## Prerequisites

- Node.js 24 与 pnpm 11
- Cocos Creator 3.8 LTS（建议使用当前 3.8.x 最新补丁）
- 最新版抖音开发者工具
- 已认证小游戏 AppID `tta51dd3a03b67523202`
- 账号持有人可在抖音开发者工具扫码登录

## 1. Install And Export

```bash
pnpm install --frozen-lockfile
pnpm export:douyin-math
```

Expected:

- 生成 `doyingame/assets/resources/math-island/data/catalog.json`。
- 报告恰好 8 个游戏、122 个题目。
- 只复制数字岛实际引用的图片和语音。
- 缺失任一语音或图片时命令失败，而不是生成不完整包。

## 2. Automated Gates

```bash
pnpm test:douyin-minigame
pnpm audit:douyin-minigame
pnpm build:douyin-minigame
pnpm build
pnpm audit:curriculum
pnpm audit:voice-media
```

Expected:

- 导出可重复，答案与正式题库一致。
- 运行时资产没有 `source/`、逻辑屋或图形工坊内容。
- 资产清单文件均存在且哈希一致。
- 官方 Cocos 构建包含主场景、338 条语音、19 张图片，低于当前未分包 16 MB
  门槛，且不会接受可疑空包。
- 现有 Web/Tauri 课程构建与课程审计继续通过。

## 3. Cocos Preview

1. 用 Cocos Creator 3.8 LTS 打开 `doyingame/`。
2. 等待首次导入完成，打开 `assets/scenes/Main.scene`。
3. 运行 Web Mobile 预览。
4. 分别检查 375×812、390×844、430×932 竖屏。
5. 每个游戏抽查首题、中间题、末题；至少跑一次错误→重试→正确→下一题。

Expected:

- 首页只出现数字岛的 8 个游戏。
- 图卡、场景、时钟、选项和反馈完整可见。
- 语音不会叠加，切题停止上一个音频。
- 返回首页和从头开始均可用。

## 4. Build Douyin Package

推荐直接运行：

```bash
pnpm build:douyin-minigame
```

命令会以 Cocos Creator 3.8.8 冷启动导入工程、刷新资源数据库、构建抖音包，
并检查 AppID、主场景、资源数量、`tt.onShow` 和体积。也可在 Cocos 构建发布
面板人工执行：

1. 平台选择“抖音小游戏 / bytedance-mini-game”。
2. 方向选择竖屏。
3. AppID 填写 `tta51dd3a03b67523202`。
4. 构建发布包。

Expected output:

```text
doyingame/build/bytedance-mini-game/
├── game.js
├── game.json
└── project.config.json
```

确认 `project.config.json` 中 AppID 正确；确认构建包满足平台主包/整体体积限制。

最近一次官方构建结果：761 个文件、338 条 MP3、19 张 PNG、12.00 MB。

## 5. Douyin IDE And Device Matrix

1. 在抖音开发者工具导入 `doyingame/build/bytedance-mini-game/`。
2. 编译并完成以下矩阵：

| Scenario | Expected |
|---|---|
| 首次启动 | 5 秒内出现可交互首页 |
| 选错再重试 | 提示具体且允许重选 |
| 完成题目后重启 | 完成状态与最近位置恢复 |
| 清除或破坏存档 | 回退空进度，无白屏 |
| 切后台再回来 | 状态可理解，音频不叠加 |
| 模拟断网 | 已下载的核心题目可继续 |
| 侧边栏 Mock | 支持时显示入口，返回来源被识别 |
| 刘海/安全区设备 | 返回、题干、关键图、选项不被遮挡 |

3. 生成真机预览二维码，用至少一台 iPhone 和一台常见安卓机完整跑一个游戏，并抽查时钟小管家。

## 6. Release Evidence

正式提审前保存：

- 自动审计输出和构建体积报告
- Cocos 构建成功日志
- 抖音 IDE 编译与侧边栏测试结果
- iOS/Android 真机截图或录屏
- 8 个游戏抽查表
- 适龄说明、隐私说明、玩法介绍和版本更新文案

没有抖音 IDE 真机证据时，只能称为“工程准备完成”，不能称为“可发布完成”。
