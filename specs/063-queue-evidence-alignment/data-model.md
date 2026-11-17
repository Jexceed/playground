# 数据模型

- `queuePositionAndTail`：`leftPosition` 是含小兔的左起名次，`behind` 是不含小兔的后续人数；均为正整数。总数由孩子求出，证据中不存答案。
- `overlapQueue`：`left`、`right` 均含同一只小兔；`wording` 为 `positions` 或 `groups`，分别对应阶段 2/3。
- N09 的 ID、题干、tokens、answerId 和 stage 不变。revision 升为 2，首阶段 oracle 改为 add(leftPosition, behind)，其余保留 overlap(left, right, 1)。不改变 localStorage 结构。
- 两种画面均只依赖已注册的 rabbit 图片，不因历史 illustration 的不可见引用阻塞输入。
