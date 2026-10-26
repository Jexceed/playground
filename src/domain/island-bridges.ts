import type { Graph, GraphNode, NetworkActivity } from './advanced-activity';

const controls = '点加号添一座，搭满两座后再点，会收回新搭的桥；现成的桥会留下。';

export const ISLAND_BRIDGE_COPY = {
  unit: '每个小格是一座桥。',
  instruction: '点加号搭桥，把每个岛的小格填满。两个岛之间最多搭两座桥。',
  relation: '一座桥，两边各算一座。',
  clue: '一座桥连着两个岛，两边各填一个小格。',
  connection: '桥不能交叉，所有岛要互相通达。',
  success: '每个岛的小格都填满了，没有多搭，所有岛也连在一起了。',
  hintCount: '先数小岛上有几个小格，再看看还有几个空着。',
  hintAll: '多出来的桥会单独标红。别忘了所有岛要互相通达。',
  countsFeedback: '看看每个岛的小格：空着的还要搭桥，红色的是多出来的桥。',
  controls,
  howToPlay: `每个小格是一座桥。一座桥连着两个岛，两边各填一个小格。空着的还要搭，红色的是多出来的桥。${controls}`,
} as const;

/** Counts incident bridges, not neighbouring islands. Two parallel bridges count twice. */
export function countIslandBridges(graph: Graph, counts: Record<string, number>, id: string): number {
  return graph.edges.filter(edge => edge.from === id || edge.to === id)
    .reduce((sum, edge) => sum + (counts[edge.id] ?? edge.fixed ?? 0), 0);
}

/** Presentation only: matching one island never substitutes for whole-network evaluation. */
export function bridgeQuota(target: number, current: number) {
  const filled = Math.min(target, Math.max(0, current));
  const missing = Math.max(0, target - current);
  const extra = Math.max(0, current - target);
  return { target, current, filled, missing, extra,
    state: extra ? 'over' as const : missing ? 'short' as const : 'exact' as const,
    label: extra ? `多${extra}座` : missing ? `还差${missing}座` : '刚好',
  };
}

export function islandRequirementSpeech(node: Pick<GraphNode, 'label' | 'degree'>): string {
  return `${node.label}岛要${node.degree ?? 0}座桥。`;
}

export function networkPromptSpeech(activity: NetworkActivity): string {
  return [ISLAND_BRIDGE_COPY.unit, ...activity.graph.nodes.map(islandRequirementSpeech),
    ISLAND_BRIDGE_COPY.clue, activity.instruction, ISLAND_BRIDGE_COPY.controls, ISLAND_BRIDGE_COPY.connection].join('');
}
