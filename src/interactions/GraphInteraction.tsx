import { useEffect, useId, useState } from "react";
import { Footprints } from "lucide-react";
import { routeNodes, type GraphEdge, type NetworkActivity, type RouteActivity } from "../domain/advanced-activity";
import { connectionGeometry, canWalkEdge, cycleBridge, walkEdge, type NetworkResponse, type RouteResponse } from "./connection-state";

type Props = {
  activity: NetworkActivity | RouteActivity;
  response: NetworkResponse | RouteResponse;
  disabled: boolean;
  onChange: (response: NetworkResponse | RouteResponse) => void;
};

export function GraphInteraction({ activity, response, disabled, onChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [chooseLanes, setChooseLanes] = useState<string | null>(null);
  const markerId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { nodes, edges } = activity.graph;
  const route = activity.kind === "route" && response.kind === "route";
  const walked = route ? routeNodes(activity, response.edgeIds) ?? [activity.start] : [];
  const current = walked[walked.length - 1];
  const name = (id: string) => nodes.find(n => n.id === id)!.label;
  useEffect(() => { setSelected(null); setChooseLanes(null); }, [response, disabled, activity.id]);
  const canUse = (edge: GraphEdge) => !disabled && (!route || canWalkEdge(activity, response, edge));
  const useEdge = (edge: GraphEdge) => {
    if (!canUse(edge)) return;
    if (activity.kind === "network" && response.kind === "network") onChange(cycleBridge(activity, response, edge.id));
    else if (activity.kind === "route" && response.kind === "route") onChange(walkEdge(activity, response, edge.id));
    setSelected(null); setChooseLanes(null);
  };
  const useNode = (id: string) => {
    if (disabled) return;
    const from = route ? current : selected;
    if (from === id) { setSelected(null); setChooseLanes(null); return; }
    const options = edges.filter(e => ((e.from === from && e.to === id) || (e.to === from && e.from === id)) && canUse(e));
    if (options.length === 1) useEdge(options[0]);
    else if (options.length > 1) setChooseLanes(id);
    else if (!route) setSelected(id);
  };
  const geometry = (edge: GraphEdge, offset = 0, backwards = false) => connectionGeometry(activity.graph, edge, offset, backwards);
  const toolbar = activity.kind === "network"
    ? selected ? `再点一个相邻小岛，和 ${name(selected)} 搭桥` : '直接点岛之间的线，试着搭一座桥'
    : chooseLanes ? `到 ${name(chooseLanes)} 有几条路，请直接点想走的那一条` : `现在在 ${current ? name(current) : '起点'}，点相邻地点或蓝色路段`;

  return <section className={`graph-workspace is-${activity.kind}`} aria-label={activity.kind === "network" ? "搭桥操作图" : "路线操作图"}
    onKeyDown={e => { if (e.key === "Escape") { setSelected(null); setChooseLanes(null); } }}>
    <div className="connection-toolbar"><p role="status">{disabled ? route ? '沿着箭头，说说刚才走过的路' : '一起数一数每个岛连出的桥' : toolbar}</p>{route && <span className="connection-count">已走 {response.edgeIds.length} 段</span>}</div>
    <div className="graph-map">
      <svg className="graph-board" viewBox="0 0 600 340" preserveAspectRatio="none" role="group" aria-label="可操作的连接线">
        <defs><marker id={markerId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 1 1 L 9 5 L 1 9 Z" fill="#367a68" /></marker></defs>
        {edges.map(edge => {
          const count = response.kind === "network" ? response.counts[edge.id] ?? edge.fixed ?? 0 : response.edgeIds.filter(id => id === edge.id).length;
          const usable = canUse(edge);
          const blocked = activity.kind === "route" && activity.blockedEdges.includes(edge.id);
          const next = route && usable;
          const highlighted = selected && (edge.from === selected || edge.to === selected);
          const step = response.kind === "route" ? response.edgeIds.lastIndexOf(edge.id) : -1;
          const backwards = step >= 0 && walked[step] === edge.to;
          const { d, mid } = geometry(edge, 0, backwards);
          const title = `${name(edge.from)} 到 ${name(edge.to)}${edge.curve ? '的弯路' : ''}${response.kind === 'network' ? `，${count}座桥${edge.fixed ? `，保留${edge.fixed}座现成桥` : ''}` : blocked ? '，此路不通' : count ? `，已走过${count}次` : next ? '，可以走' : '，暂时走不到'}`;
          return <g key={edge.id} aria-hidden="true" aria-disabled={!usable}
            className={`graph-edge${count ? ' is-used' : ''}${next || highlighted ? ' is-available' : ''}${blocked ? ' is-blocked' : ''}`}
            data-edge-id={edge.id} data-count={count} onClick={() => useEdge(edge)}>
            <title>{title}</title>
            <path className="graph-edge-focus" d={d} />
            {response.kind === "network" && count === 2
              ? [-9, 9].map(offset => <path key={offset} className="graph-visible-line is-bridge" d={geometry(edge, offset).d} />)
              : <path className={`graph-visible-line${response.kind === 'network' ? ' is-bridge' : ''}`} d={d} markerMid={route && count ? `url(#${markerId})` : undefined} />}
            {blocked && <g className="graph-road-block" transform={`translate(${mid.x} ${mid.y})`}><circle r="15" /><path d="M -6 -6 L 6 6 M -6 6 L 6 -6" /></g>}
            <path className="graph-edge-hit" d={d} />
          </g>;
        })}
      </svg>
      {edges.map(edge => {
        const { mid } = geometry(edge);
        const count = response.kind === "network" ? response.counts[edge.id] ?? edge.fixed ?? 0 : response.edgeIds.filter(id => id === edge.id).length;
        const blocked = activity.kind === "route" && activity.blockedEdges.includes(edge.id);
        const step = response.kind === "route" ? response.edgeIds.lastIndexOf(edge.id) + 1 : 0;
        const usable = canUse(edge);
        const title = `${name(edge.from)} 到 ${name(edge.to)}${edge.curve ? '的弯路' : ''}${response.kind === 'network' ? `，${count}座桥${edge.fixed ? `，保留${edge.fixed}座现成桥` : ''}` : blocked ? '，此路不通' : count ? `，已走过${count}次` : usable ? '，可以走' : '，暂时走不到'}`;
        return <button key={edge.id} type="button" className={`graph-road-control${count ? ' is-used' : ''}${blocked ? ' is-blocked' : ''}`}
          style={{ left: `${mid.x / 6}%`, top: `${mid.y / 3.4}%` }}
          disabled={!usable} aria-label={title} onClick={() => useEdge(edge)}>
          <span aria-hidden="true">{route ? blocked ? '×' : step || <Footprints size={17} /> : count >= (edge.max ?? 2) ? '↶' : '+'}</span>
        </button>;
      })}
      {nodes.map(node => {
        const islandCount = response.kind === "network" ? edges.filter(e => e.from === node.id || e.to === node.id).reduce((sum, e) => sum + (response.counts[e.id] ?? e.fixed ?? 0), 0) : 0;
        const reachable = edges.some(e => canUse(e) && ((e.from === (route ? current : selected) && e.to === node.id) || (e.to === (route ? current : selected) && e.from === node.id)));
        const label = activity.kind === 'network' ? `${node.label}岛，需要${node.degree}座桥，已连${islandCount}座` : `${node.label}${node.id === current ? '，当前位置' : reachable ? '，可以走到这里' : ''}`;
        return <div className="graph-node-position" key={node.id} style={{ left: `${node.x / 6}%`, top: `${node.y / 3.4}%` }}>
          {route && node.id === current && <span className="graph-you-are-here">我在这里</span>}
          <button type="button" aria-label={label} aria-pressed={node.id === (route ? current : selected)}
            disabled={disabled || (route && node.id !== current && !reachable)}
            className={`graph-node${node.id === (route ? current : selected) ? ' is-current' : ''}${reachable ? ' is-reachable' : ''}`}
            onClick={() => useNode(node.id)}>
            {activity.kind === "network" ? <><span className="graph-island-name">{node.label}</span><strong>{node.degree}</strong><small>已连 {islandCount}</small></> : <strong>{node.label}</strong>}
          </button>
          {activity.kind === "route" && <span className="graph-place-note">{node.id === activity.start ? '起点' : node.id === activity.end ? '终点' : activity.requiredNodes.includes(node.id) ? '要经过' : ''}</span>}
        </div>;
      })}
    </div>
    {route ? <p className="graph-route-trail" aria-label="已走路线">{walked.map((id, i) => <span key={`${id}-${i}`}>{i > 0 && <span aria-hidden="true"> → </span>}<b className={i === walked.length - 1 ? 'is-current' : ''}>{name(id)}</b></span>)}</p>
      : !disabled && <p className="connection-footnote">大数字是需要的桥数。点线加桥，两座后再点可重连；现成的桥会保留。</p>}
  </section>;
}
