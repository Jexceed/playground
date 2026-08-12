# Data Model: 抖音小游戏横屏同款体验

## 1. WorkbenchViewState

统一工作台的瞬时状态，不单独持久化。

| Field | Type | Rules |
|---|---|---|
| `gameId` | string | 必须属于目录中的 8 个数字岛游戏 |
| `roundIndex` | integer | `0 <= roundIndex < game.rounds.length` |
| `selectedOptionId` | string \| null | 必须属于当前题选项；切题时清空 |
| `feedback` | object \| null | 只在检查后存在；切题或重置时清空 |
| `interactionLocked` | boolean | 检查和切题期间防止重复触发 |

### Transitions

`loading → idle → selected → retry|correct → next → idle`

游戏切换、题号跳转和重置都回到 `idle`，并停止当前语音。

## 2. LandscapeViewport

运行时从 Cocos 可视区和平台安全区导出的布局输入。

| Field | Type | Rules |
|---|---|---|
| `width` | number | 横屏可用宽度，扣除安全区 |
| `height` | number | 横屏可用高度，扣除安全区 |
| `leftInset/rightInset/topInset/bottomInset` | number | 从物理安全区按设计坐标缩放 |
| `leftColumnWidth` | number | 约占可用宽度 21%，保持游戏标题可读 |
| `centerColumnWidth` | number | 最大列，约占 55%，优先容纳题面与选项 |
| `rightColumnWidth` | number | 约占 24%，容纳 18 个题号和家长信息 |

### Validation

- `width > height`；若平台启动瞬间返回旧方向，等待下一次可视区更新而不把三栏旋转到竖屏。
- 三栏宽度加间距等于可用宽度。
- 所有触控目标在设计坐标中保持至少约 44×44。

## 3. Existing ProgressStateV1

沿用既有存档实体，不新增版本字段。

| Field | Use in workbench |
|---|---|
| `completedRoundIds` | 左侧游戏完成数、右侧题号完成态 |
| `abilityTags` | 右侧成长记录标签 |
| `lastLocation` | 启动恢复和说明页返回 |
| `voiceEnabled` | 听题与自动播报开关 |
| `soundEnabled` | 保留现有设置能力 |

## Relationships

- 一个 `Game` 包含多个 `Round`。
- `WorkbenchViewState` 指向一个 `Game` 和其中一个 `Round`。
- `ProgressStateV1` 跨游戏保存完成题号，并投影为左右栏状态。
- `LandscapeViewport` 只决定呈现尺寸，不改变题库与进度语义。
