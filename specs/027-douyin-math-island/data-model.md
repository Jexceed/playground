# Data Model: 抖音小游戏数字岛首发版

## ExportEnvelope

小游戏课程快照的根对象。

| Field | Type | Rules |
|---|---|---|
| `schemaVersion` | literal `1` | 不匹配时拒绝加载并显示可恢复错误 |
| `generatedAt` | ISO datetime | 仅用于审计，不参与内容哈希 |
| `sourceRevision` | string | 本地 git revision；允许 dirty 后缀 |
| `world` | `WorldSummary` | 必须为 `math` / 数字岛 |
| `games` | `MiniGameGame[]` | 恰好 8 个，ID 唯一且顺序稳定 |
| `assets` | `AssetManifest` | 所有引用必须存在于 manifest |
| `contentDigest` | SHA-256 string | 基于规范化 `world + games` 计算 |

## WorldSummary

| Field | Type | Rules |
|---|---|---|
| `id` | `"math"` | 固定 |
| `name` | string | `数字岛` |
| `summary` | string | 与现有产品一致 |
| `gameCount` | integer | 8 |
| `roundCount` | integer | 122 |

## MiniGameGame

复用现有 `GameConfig` 的平台中立字段：`id`, `title`, `subtitle`, `goal`, `parentPrompt`, `abilityTags`, `level`, `rounds`。

Validation:

- `id` 必须以 `math-` 开头且全局唯一。
- `world` 在导出后省略或固定为 `math`，不得出现其他世界。
- `rounds` 不为空；题目 ID 在全快照唯一。
- `answer` 必须命中某个 `choices[].value`。

## MiniGameRound

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | 稳定、唯一 |
| `level` | `L1..L6` | yes | 与源题一致 |
| `prompt` | string | yes | 非空 |
| `instruction` | string | yes | 非空 |
| `difficultyNote` | string | yes | 非空 |
| `sceneImage` | object | no | `src` 必须命中图片清单 |
| `visualGroups` | array | no | 每组 items 保留空位与顺序 |
| `clockChallenge` | object | no | `hour` 1..12，`minute` 仅 0/30 |
| `choices` | array | yes | 2..4 项，value 唯一 |
| `answer` | string | yes | 必须命中 choice value |
| `success` | string | yes | 解释性反馈 |
| `retry` | string | yes | 可行动提示 |
| `parentPrompt` | string | yes | 可直接追问孩子 |
| `abilityTags` | string[] | yes | 至少一项 |
| `voice` | object | yes | prompt/success/retry/parent 和 choice 音频引用 |

数字岛本期允许的视觉表面仅为：`visualGroups`、`sceneImage + visualGroups`、`clockChallenge`、`sceneImage + clockChallenge`。若出现 matrix、memory、graphicChallenge 等其他类型，审计失败，防止误带其他岛内容。

## VoiceReferences

| Field | Type | Rules |
|---|---|---|
| `prompt` | asset id | 规范文本为 `prompt + instruction` |
| `success` | asset id | 与 success 文本完全匹配 |
| `retry` | asset id | 与 retry 文本完全匹配 |
| `parent` | asset id | 与 parentPrompt 文本完全匹配 |
| `choices` | record value → asset id | 每个可朗读选项均有本地音频 |

若当前全量语音 manifest 中缺失某条，导出失败并要求重新执行正式语音流水线；不在小游戏导出器中生成临时音频。

## AssetManifest / AssetEntry

| Field | Type | Rules |
|---|---|---|
| `version` | literal `1` | 固定 |
| `entries` | `AssetEntry[]` | source/target 唯一 |
| `totalBytes` | integer | 等于 entries 字节数合计 |

`AssetEntry` fields: `id`, `kind` (`image|audio|data`), `sourcePath`, `runtimePath`, `bytes`, `sha256`, `contexts[]`。

Validation:

- `sourcePath` 只能位于 `public/images/{brand,characters,items,scenes}` 或 `public/audio/voice`。
- 任一路径包含 `/source/`、`logic-`、`graphic-workshop` 时失败。
- runtime 文件存在、字节数和 SHA-256 与 manifest 一致。
- 每项至少有一个 game/round context，品牌项除外。

## ProgressV1

| Field | Type | Rules |
|---|---|---|
| `version` | literal `1` | 固定 |
| `completedGameIds` | string[] | 去重，只接受当前快照 game ID |
| `completedRoundIds` | string[] | 去重，只接受当前快照 round ID |
| `abilityTags` | string[] | 去重 |
| `lastLocation` | object/null | gameId 有效，roundIndex 在范围内 |
| `updatedAt` | integer | Unix ms |

损坏、未知版本或字段类型错误时返回空 `ProgressV1`；不能抛出到 UI。写入采用整体替换，避免半写状态。

## UI State Machine

```text
BOOT
  → HOME
  → GAME_LOADING
  → ROUND_IDLE
  → ROUND_SELECTED
  → ROUND_CHECKING
      → ROUND_RETRY → ROUND_IDLE
      → ROUND_CORRECT → ROUND_IDLE(next) | GAME_COMPLETE
  → HOME
```

Rules:

- `ROUND_CHECKING` 与转场期间忽略重复触摸。
- 切换题目或进入后台时停止当前音频。
- 仅 `ROUND_CORRECT` 写入题目完成；最后题正确并确认完成后写入游戏完成。
- 每次进入题目更新 `lastLocation`。
