# Research: 抖音小游戏横屏同款体验

## Decision 1: 使用平台原生横屏声明

**Decision**: 构建产物 `game.json` 的 `deviceOrientation` 使用 `landscape`，Cocos 源构建配置同步设为横屏。

**Rationale**: 抖音开放平台官方《小游戏配置》明确列出 `portrait` 与 `landscape` 两个合法值，并说明 `landscape` 下 Home 键在右侧。因此现有竖屏不是平台限制，而是项目配置选择。

**Source**: https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/framework/mini-game-configuration

**Alternatives considered**:

- 在竖屏画布内旋转 UI：触摸坐标、安全区和平台方向提示都会更复杂，且不符合原生窗口行为。
- 同时支持横竖屏：会显著扩大首发验证矩阵，用户已明确要求横屏，不采用。

## Decision 2: 用 1280×720 作为设计基准

**Decision**: Cocos 设计分辨率使用 1280×720，运行时再按实际可视区和安全区调整根工作台尺寸。

**Rationale**: 16:9 接近本机版当前 1200×768 的横向信息结构，又便于映射抖音常见横屏手机；固定设计基准可保持字体与触控尺寸稳定。

**Alternatives considered**:

- 1334×750：更贴近原竖屏尺寸旋转，但不如 1280×720 通用，且现有视觉数字更难阅读。
- 直接用物理像素：设备差异会导致控件尺寸和字体不可预测。

## Decision 3: 启动恢复最近题目而非保留独立首页

**Decision**: 完成数据加载后直接打开 `lastLocation`，无进度则打开第一个游戏第一题。

**Rationale**: 本机版打开后即是游戏工作台；用户本次反馈正是两端首屏完全不同。三栏工作台本身已经提供游戏切换，不需要重复欢迎页。

**Alternatives considered**:

- 把欢迎页横过来：仍然与本机版使用路径不同，不能解决核心反馈。
- 保留首页但默认跳过：增加无用维护面，最终只保留为未引用历史代码也没有价值。

## Decision 4: 只对齐数字岛，不展示空世界

**Decision**: 左侧保留本机版的品牌和游戏导航结构，但世界区域只显示数字岛概况，不展示不可进入的逻辑营和图形角。

**Rationale**: 视觉结构可以一致，但内容范围必须服从首发版 8 个数学游戏的审计边界；展示无功能入口会制造错误预期。

## Decision 5: 使用开发者工具实际编译做视觉验收

**Decision**: 自动测试之外必须重新构建并让抖音开发者工具出现 `compilationFinished`，再读取模拟器画面。

**Rationale**: 横屏方向、Cocos 画布缩放、安全区和小游戏运行层只有平台模拟器能完整呈现，单看源代码或 Web 预览不足以验收。
