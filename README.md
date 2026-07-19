# 小小思考屋

小小思考屋是给 4 岁孩子和家长一起玩的亲子思维游戏。孩子通过看图、操作、听语音、解释原因和复述过程，练习数感、逻辑、计划、证据推理和空间理解。

## 商业发布方向

首个收费版本面向 iPad 家庭场景：每个主题世界提供一个完整试玩关卡，其余内容通过家长区一次性解锁。首发建议价为 ¥68 或对应地区价格，不做广告，也不在没有持续新增内容之前销售自动续费订阅。

GitHub Pages 不作为商业发布渠道。现有 Mac ARM64 / Windows x64 [GitHub 测试安装包](https://github.com/Jexceed/playground/releases)只用于开发验证，不代表正式收费版本。

商业模型、成本和发布门槛见 [docs/monetization.md](./docs/monetization.md)，实现规格见 [specs/026-paid-ipad-launch/spec.md](./specs/026-paid-ipad-launch/spec.md)。

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
```

发布和桌面打包说明见 [docs/deployment.md](./docs/deployment.md)。
