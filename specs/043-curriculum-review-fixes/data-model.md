# Data Model: 题目、图卡和修订证据

## Activity / Legacy Round

保持 stable ID、题组及题量，修改已有 prompt/instruction/clues/tokens/success/parentPrompt。启蒙不引入进度迁移；探索语义变化分支递增 revision，不覆盖已有较高版本。答案须合法；双条件每个干扰项只错一个维度；候选表示等级一致。

## GalleryImage / Exploration Art

沿用 src、alt、可选 frame(columns/rows/index)、style、width/height。atlas 保留原坐标，独立播种与盒子卡统一使用 frame(columns=1, rows=1, index=0)。planting 长度 4 与语义顺序不变，只改索引 1 来源。源图可追溯、运行图注册且真实引用。种子动作没有提前发芽；开关只改盖子状态；比较图只改目标属性。

## Illustration Usage

沿用 src#frame.index 唯一标识，atlas 与 1×1 单图都记录几何。引用记录活动 ID、题组、题号、world、surface、label。旧第 2 帧不再是运行注册项但 atlas 文件保留。未注册、缺文件、几何冲突、注册而未使用须可发现；预期 18 个资源组、74 张图卡，报告区分资源文件数和图卡数。

## Progress / Voice

保留原 activityId@revision 键，不删除历史；新 revision 不冒用旧尝试。语音从最终内容导出；manifest 文本/可选 spokenText、provider、文件均与导出一致。failures 为空，报告 macOS say + afconvert 与 mixed local 是否存在。
