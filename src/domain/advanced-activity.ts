import type { ActivityBase, ActivityResponse } from "./activity";
export type GraphNode = {
    id: string;
    x: number;
    y: number;
    label: string;
    degree?: number;
};
export type GraphEdge = {
    id: string;
    from: string;
    to: string;
    max?: number;
    fixed?: number;
    curve?: number;
};
export type Graph = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};
export type SingleChoiceActivity = ActivityBase & {
    kind: "singleChoice";
    answerId: string;
};
export type MatchingActivity = ActivityBase & {
    kind: "matching";
    leftIds: string[];
    rightIds: string[];
    expectedPairs: [
        string,
        string
    ][];
    /** Explicit equivalent one-to-one answers, e.g. two visually identical shape cards. */
    alternativePairings?: [string, string][][];
};
export type RouteActivity = ActivityBase & {
    kind: "route";
    graph: Graph;
    start: string;
    end: string;
    requiredNodes: string[];
    requiredEdges: string[];
    blockedEdges: string[];
    allowRevisit: boolean;
    optimalLength?: number;
};
export type NetworkActivity = ActivityBase & {
    kind: "network";
    graph: Graph;
    connected: boolean;
};
export type Point3 = [
    number,
    number,
    number
];
export type Piece = {
    id: string;
    label: string;
    cells: Point3[];
    color: string;
};
export type Placement = {
    pieceId: string;
    x: number;
    y: number;
    z: number;
    rotation: number;
};
export type ConstructionActivity = ActivityBase & {
    kind: "construction";
    columns: number;
    rows: number;
    layers: number;
    pieces: Piece[];
    target: Point3[];
    allowRotate: boolean;
};
export type ParentActivity = ActivityBase & {
    kind: "parentObservation";
    materials: string[];
    steps: string[];
    observations: {
        id: string;
        text: string;
    }[];
};
export type AdvancedActivity = SingleChoiceActivity | MatchingActivity | RouteActivity | NetworkActivity | ConstructionActivity | ParentActivity;
export type AdvancedResponse = {
    kind: "singleChoice";
    tokenId: string | null;
} | {
    kind: "matching";
    pairs: [
        string,
        string
    ][];
} | {
    kind: "route";
    edgeIds: string[];
} | {
    kind: "network";
    counts: Record<string, number>;
} | {
    kind: "construction";
    placements: Placement[];
} | {
    kind: "parentObservation";
    observations: Record<string, "independent" | "supported" | "notYet">;
};
export function isAdvancedActivity(activity: {
    kind: string;
}): activity is AdvancedActivity {
    return ["singleChoice", "matching", "route", "network", "construction", "parentObservation"].includes(activity.kind);
}
export function advancedEmpty(activity: AdvancedActivity): AdvancedResponse {
    switch (activity.kind) {
        case "singleChoice": return { kind: activity.kind, tokenId: null };
        case "matching": return { kind: activity.kind, pairs: [] };
        case "route": return { kind: activity.kind, edgeIds: [] };
        case "network": return { kind: activity.kind, counts: Object.fromEntries(activity.graph.edges.map(e => [e.id, e.fixed ?? 0])) };
        case "construction": return { kind: activity.kind, placements: [] };
        case "parentObservation": return { kind: activity.kind, observations: {} };
    }
}
export function placedCells(piece: Piece, placement: Placement): Point3[] {
    let cells = piece.cells.map(c => [...c] as Point3);
    for (let n = 0; n < placement.rotation; n++)
        cells = cells.map(([x, y, z]) => [-y, x, z]);
    const minX = Math.min(...cells.map(c => c[0])), minY = Math.min(...cells.map(c => c[1]));
    return cells.map(([x, y, z]) => [x - minX + placement.x, y - minY + placement.y, z + placement.z]);
}
export function routeNodes(activity: RouteActivity, edgeIds: string[]): string[] | null {
    const nodes = [activity.start];
    for (const id of edgeIds) {
        const edge = activity.graph.edges.find(e => e.id === id), current = nodes[nodes.length - 1];
        if (!edge || (edge.from !== current && edge.to !== current))
            return null;
        nodes.push(edge.from === current ? edge.to : edge.from);
    }
    return nodes;
}
export function evaluateAdvanced(activity: AdvancedActivity, response: ActivityResponse) {
    const result = (status: "incomplete" | "incorrect" | "correct" | "needsParentObservation", message: string) => ({ status, message });
    const wrong = (message = activity.retry) => result("incorrect", message);
    const correct = () => result("correct", activity.success);
    if (activity.kind !== response.kind)
        return wrong();
    if (activity.kind === "singleChoice" && response.kind === "singleChoice")
        return response.tokenId === null ? result("incomplete", "先选一个答案，再看看。") : response.tokenId === activity.answerId ? correct() : wrong();
    if (activity.kind === "matching" && response.kind === "matching") {
        if (response.pairs.length < activity.expectedPairs.length)
            return result("incomplete", "还有一组关系没有连好。");
        const keys = response.pairs.map(p => JSON.stringify(p));
        const validEndpoints = response.pairs.every(([left, right]) => activity.leftIds.includes(left) && activity.rightIds.includes(right))
            && new Set(response.pairs.map(p => p[0])).size === keys.length && new Set(response.pairs.map(p => p[1])).size === keys.length;
        return validEndpoints && keys.length === activity.expectedPairs.length
            && [activity.expectedPairs, ...(activity.alternativePairings ?? [])].some(pairs => pairs.length === keys.length && pairs.every(p => keys.includes(JSON.stringify(p)))) ? correct() : wrong();
    }
    if (activity.kind === "route" && response.kind === "route") {
        if (!response.edgeIds.length)
            return result("incomplete", "从起点选一条路，试着走一走。");
        const nodes = routeNodes(activity, response.edgeIds);
        if (!nodes || nodes[nodes.length - 1] !== activity.end || response.edgeIds.some(id => activity.blockedEdges.includes(id)) || (!activity.allowRevisit && new Set(response.edgeIds).size !== response.edgeIds.length) || !activity.requiredNodes.every(id => nodes.includes(id)) || !activity.requiredEdges.every(id => response.edgeIds.includes(id)))
            return wrong();
        if (activity.optimalLength !== undefined && response.edgeIds.length !== activity.optimalLength)
            return wrong("这条路能走通。再找找，有没有少走几段的路？");
        return correct();
    }
    if (activity.kind === "network" && response.kind === "network") {
        const { nodes, edges } = activity.graph;
        if (Object.keys(response.counts).some(id => !edges.some(e => e.id === id)))
            return wrong();
        const degree = new Map(nodes.map(n => [n.id, 0]));
        const active = edges.filter(e => (response.counts[e.id] ?? 0) > 0);
        for (const e of edges) {
            const n = response.counts[e.id] ?? 0;
            if (!Number.isInteger(n) || n < 0 || n > (e.max ?? 2) || n < (e.fixed ?? 0))
                return wrong();
            degree.set(e.from, degree.get(e.from)! + n);
            degree.set(e.to, degree.get(e.to)! + n);
        }
        if (nodes.some(n => degree.get(n.id) !== n.degree))
            return wrong("数一数每个岛连出的桥，和岛上的数字一样多吗？");
        for (const a of active)
            for (const b of active) {
                if (a.id === b.id || [a.from, a.to].some(id => id === b.from || id === b.to))
                    continue;
                const p = nodes.find(n => n.id === a.from)!, q = nodes.find(n => n.id === a.to)!, r = nodes.find(n => n.id === b.from)!, s = nodes.find(n => n.id === b.to)!;
                const cross = (x: GraphNode, y: GraphNode, z: GraphNode) => (y.x - x.x) * (z.y - x.y) - (y.y - x.y) * (z.x - x.x);
                if (cross(p, q, r) * cross(p, q, s) < 0 && cross(r, s, p) * cross(r, s, q) < 0)
                    return wrong("两座桥不能在河中间交叉。试着换一条连接。");
            }
        const seen = new Set([nodes[0].id]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const e of active)
                if (seen.has(e.from) !== seen.has(e.to)) {
                    seen.add(e.from);
                    seen.add(e.to);
                    changed = true;
                }
        }
        return !activity.connected || seen.size === nodes.length ? correct() : wrong("还有小岛和大家没有连在一起。要能从一个岛走到所有岛。");
    }
    if (activity.kind === "construction" && response.kind === "construction") {
        if (response.placements.length < activity.pieces.length)
            return result("incomplete", "还有部件没有摆上去。");
        if (new Set(response.placements.map(p => p.pieceId)).size !== activity.pieces.length)
            return wrong();
        const occupied: string[] = [];
        for (const p of response.placements) {
            const piece = activity.pieces.find(item => item.id === p.pieceId);
            if (!piece || ![p.x, p.y, p.z, p.rotation].every(Number.isInteger) || p.rotation < 0 || p.rotation > 3 || (!activity.allowRotate && p.rotation !== 0))
                return wrong();
            const cells = placedCells(piece, p);
            if (cells.some(([x, y, z]) => x < 0 || y < 0 || z < 0 || x >= activity.columns || y >= activity.rows || z >= activity.layers))
                return wrong("部件超出方格了，换一个起点试试。");
            occupied.push(...cells.map(c => c.join(',')));
        }
        const target = new Set(activity.target.map(c => c.join(',')));
        return new Set(occupied).size === occupied.length && occupied.length === target.size && occupied.every(c => target.has(c)) ? correct() : wrong();
    }
    if (activity.kind === "parentObservation" && response.kind === "parentObservation") {
        if (!activity.observations.every(o => ["independent", "supported", "notYet"].includes(response.observations[o.id])))
            return result("incomplete", "请家长为每一项选择这次观察到的情况。");
        return result("needsParentObservation", "这次亲子活动已经记录。下次可以换个条件再试试。");
    }
    return wrong();
}
