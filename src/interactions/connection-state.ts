import { routeNodes, type AdvancedResponse, type Graph, type GraphEdge, type MatchingActivity, type NetworkActivity, type RouteActivity } from "../domain/advanced-activity";

export type MatchingResponse = Extract<AdvancedResponse, { kind: "matching" }>;
export type NetworkResponse = Extract<AdvancedResponse, { kind: "network" }>;
export type RouteResponse = Extract<AdvancedResponse, { kind: "route" }>;

/** One operation replaces both occupied endpoints, so undo restores the whole change. */
export function connectPair(activity: Pick<MatchingActivity, "leftIds" | "rightIds">, response: MatchingResponse, first: string, second: string): MatchingResponse {
  const [left, right] = activity.leftIds.includes(first) ? [first, second] : [second, first];
  if (!activity.leftIds.includes(left) || !activity.rightIds.includes(right)) return response;
  if (response.pairs.some(([l, r]) => l === left && r === right)) return response;
  return { kind: "matching", pairs: [...response.pairs.filter(([l, r]) => l !== left && r !== right), [left, right]] };
}

export function disconnectPair(response: MatchingResponse, id: string): MatchingResponse {
  return { kind: "matching", pairs: response.pairs.filter(pair => !pair.includes(id)) };
}

export function cycleBridge(activity: NetworkActivity, response: NetworkResponse, edgeId: string): NetworkResponse {
  const edge = activity.graph.edges.find(e => e.id === edgeId);
  if (!edge) return response;
  const min = edge.fixed ?? 0, max = edge.max ?? 2;
  const count = Math.max(min, response.counts[edge.id] ?? min);
  return { kind: "network", counts: { ...response.counts, [edge.id]: count >= max ? min : count + 1 } };
}

export function canWalkEdge(activity: RouteActivity, response: RouteResponse, edge: GraphEdge): boolean {
  const current = routeNodes(activity, response.edgeIds)?.slice(-1)[0];
  return (edge.from === current || edge.to === current)
    && !activity.blockedEdges.includes(edge.id)
    && (activity.allowRevisit || !response.edgeIds.includes(edge.id));
}

export function walkEdge(activity: RouteActivity, response: RouteResponse, edgeId: string): RouteResponse {
  const edge = activity.graph.edges.find(e => e.id === edgeId);
  return edge && canWalkEdge(activity, response, edge)
    ? { kind: "route", edgeIds: [...response.edgeIds, edgeId] }
    : response;
}

/** Geometry is independent of answers. Reverse traversal keeps the same physical lane. */
export function connectionGeometry(graph: Graph, edge: GraphEdge, offset = 0, backwards = false) {
  const first = graph.nodes.find(n => n.id === edge.from)!, last = graph.nodes.find(n => n.id === edge.to)!;
  const p = backwards ? last : first, q = backwards ? first : last;
  const dx = last.x - first.x, dy = last.y - first.y, length = Math.hypot(dx, dy) || 1;
  const ox = -dy / length * offset, oy = dx / length * offset;
  // A diagonal x/y offset may lie on the straight road. Bend outward along its normal.
  const bend = -(edge.curve ?? 0) * 2.8;
  const start = { x: p.x + ox, y: p.y + oy }, end = { x: q.x + ox, y: q.y + oy };
  const control = { x: (p.x + q.x) / 2 - dy / length * bend + ox, y: (p.y + q.y) / 2 + dx / length * bend + oy };
  const point = (t: number) => ({ x: (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t * t * end.x, y: (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t * t * end.y });
  // Put the direction arrow away from the midpoint button and outside the destination node.
  const t = .72, arrow = point(t);
  const c1 = { x: start.x + t * (control.x - start.x), y: start.y + t * (control.y - start.y) };
  const c2 = { x: control.x + t * (end.x - control.x), y: control.y + t * (end.y - control.y) };
  return { start, end, mid: point(.5), control, arrow,
    d: `M ${start.x} ${start.y} Q ${c1.x} ${c1.y} ${arrow.x} ${arrow.y} Q ${c2.x} ${c2.y} ${end.x} ${end.y}` };
}
