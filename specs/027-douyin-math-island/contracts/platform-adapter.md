# Platform Adapter Contract

业务层不得直接读取全局 `tt`。所有平台能力通过以下语义接口使用。

## Storage

- `readProgress(): ProgressV1`
  - 不存在、损坏或未知版本时返回空进度。
  - 不向 UI 抛出解析错误。
- `writeProgress(progress): void`
  - 同步或对调用者表现为原子写入。
  - 失败时记录诊断但不阻止当前答题。

## Lifecycle

- `onShow(listener): unsubscribe`
- `onHide(listener): unsubscribe`
- `getLatestLaunchContext(): LaunchContext | null`

抖音构建模板必须在 `game.js` 最早时机缓存最新 `onShow` 参数；适配器订阅时先读取缓存，再监听后续事件。

## Safe Area

- `getViewport(): { width, height, safeTop, safeRight, safeBottom, safeLeft }`

任何缺失或非法平台值回退到 Cocos 可见尺寸与零 inset。

## Sidebar

- `checkSidebar(): Promise<boolean>`
- `navigateToSidebar(): Promise<'opened' | 'unsupported' | 'cancelled' | 'failed'>`
- `isSidebarLaunch(context): boolean`

只有 `checkSidebar()` 为 true 时才显示入口；入口文案面向家长，不承诺奖励。`navigateToSidebar` 包装 `tt.navigateToScene({scene:'sidebar'})`。

## Audio Lifecycle

- `notifyAudioStarted(id)`
- `stopActiveAudio()`

进入后台、切换题目和返回首页时必须停止当前音频。平台适配器不决定要播放哪条课程语音。

## Diagnostics

- `report(event, details)` 仅写本地控制台，不上传儿童数据。
- 禁止记录孩子选择的可识别用户信息；本期没有账号或用户输入。
