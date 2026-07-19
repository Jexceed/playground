# 小小思考屋

小小思考屋是给 4 岁孩子和家长一起玩的亲子思维游戏。孩子通过看图、操作、听语音、解释原因和复述过程，练习数感、逻辑、计划、证据推理和空间理解。

## 公开测试版

- Web Beta：<https://jexceed.github.io/playground/>
- 隐私说明：<https://jexceed.github.io/playground/privacy.html>
- Mac ARM64 / Windows x64 测试安装包：[GitHub Releases](https://github.com/Jexceed/playground/releases)

Web Beta 无需安装，适合先在手机、平板或电脑浏览器中和孩子一起体验。桌面安装包尚未完成 Apple 公证和 Windows 商业代码签名，因此仍标为测试版。

## 现在包含什么

- 3 个主题世界：数字岛、逻辑屋、图形工坊
- 40 个亲子游戏，共 489 道题
- 1,801 条可审计的本地普通话语音
- 本地保存已完成题目、能力标签和上次游玩位置
- 无账号、无广告、无第三方分析 SDK、无云端学习记录

这不是刷题软件。题目会给家长留下继续追问“为什么”的空间，错误选项也尽量对应孩子真实可能出现的误判。

## 本地开发与验证

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm audit:curriculum
pnpm audit:voice-media
pnpm test:web-release
```

发布和桌面打包说明见 [docs/deployment.md](./docs/deployment.md)。

