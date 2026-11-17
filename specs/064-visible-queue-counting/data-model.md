# 数据模型

沿用 queuePositionAndTail(leftPosition,behind) / overlapQueue(left,right,wording)。新纯模型导出：

- friends：按真实队伍排序，长度等于总人数，每个成员有稳定的位置和本地角色键；rabbit 位于 left−1，恰好一个。
- leftCounts：从左至小兔 1…left，其余为 null。
- rightCounts：首阶段小兔后面的朋友 1…behind；重叠阶段从最右的1数至小兔的right，空间数组为 null…right…1。
- 第二次计数方向、两组标签、合并算式、短解释及完整朗读从同一已知条件生成。

允许展示推得的总数，模型不读 answerId，不更改答题响应或进度。活动内容 revision 3；历史比较精确还原064再还原063。
