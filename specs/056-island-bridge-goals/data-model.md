# 数据
GraphNode.degree仍是目标，incident edge counts之和仍是当前数量，固定桥缺省取edge.fixed。派生filled=min(target,current)、missing=max(0,target-current)、extra=max(0,current-target)，不修改response。目标小格只表达数量而不指定哪条边；非自动解题。整个graph、authoringSolutions、revision稳定。
