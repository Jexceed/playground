# Quickstart: 抖音小游戏横屏同款体验验证

## 1. Automated Gates

```bash
pnpm test:douyin-minigame
pnpm audit:douyin-minigame
pnpm build:douyin-minigame
pnpm test:douyin-minigame:devtools
pnpm build
pnpm audit:curriculum
pnpm audit:voice-media
```

Expected:

- 8 个数字游戏、122 道题和既有资源审计全部通过。
- `doyingame/build/bytedance-mini-game/game.json` 包含 `"deviceOrientation": "landscape"`。
- 开发者工具日志出现 `compilationFinished`，不接受只启动了工具但未编译的假阳性。
- 现有 Web/Tauri 构建与课程审计继续通过。

## 2. Source Configuration Check

确认以下三个来源一致为横屏：

- `doyingame/profiles/v2/packages/builder.json`
- `doyingame/build-configs/bytedance-mini-game.json`
- `doyingame/build/bytedance-mini-game/game.json`

项目设计分辨率为 1280×720。

## 3. Douyin Developer Tools Visual Check

1. 导入或刷新 `doyingame/build/bytedance-mini-game/`。
2. 点击编译并等待模拟器出现内容。
3. 首屏必须直接是一道题，而不是欢迎页。
4. 对照本机 `/Applications/小小思考屋.app` 检查 10 项：背景、品牌、游戏导航、题头、题面、线索板、横向选项、底部操作、题号网格、家长/成长卡。
5. 操作一次：切游戏 → 跳题 → 听题 → 选答案 → 检查 → 下一题。

## 4. Landscape Matrix

分别检查：

| Viewport | Focus |
|---|---|
| 667×375 | 最窄设备上三栏和主按钮可达 |
| 844×390 | 标准长屏上文字与题号完整 |
| 932×430 | 宽屏安全区和留白正常 |

不允许：栏位重叠、题干/选项裁切、按钮落入安全区、整页必须竖向滚动才能作答。

## 5. Device Gate

开发者工具通过后，用至少一台 iPhone 和一台常见安卓机扫码预览；确认系统按横屏启动、刘海区不遮挡、语音不叠加、最近进度可恢复。真机完成前只称为“开发者工具验收通过”。
