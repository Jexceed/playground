# 状态与数据

不更改存储schema。completedRoundIds 为历史完成集合；roundIndex 为当前题；answered/selected 为本次答案；completedOnce 为当前末题已确认完成的局部展示状态。

下一题决策返回 index 或 null：非末题→index+1；末题存在未完成→最早未完成index；末题且全完成→null。

null 时 App 仅为全部实际完成题组记完成，再转同主题下一组index0；无下一组则留在末题显示完成反馈和重玩。显式跳题或从头来清除完成展示；普通切组卸载局部状态。完成集合与其他题组位置不清空。
