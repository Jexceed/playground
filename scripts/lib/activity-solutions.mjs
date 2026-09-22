// Authoring checks enumerate the small pilot domains independently of the UI.
export function permutations(values) {
  if (values.length === 0) return [[]];
  return values.flatMap((value, index) =>
    permutations(values.filter((_, i) => i !== index)).map((rest) => [
      value,
      ...rest,
    ]),
  );
}
export function orderSatisfies(values, rules) {
  const positions = new Map(values.map((id, i) => [id, i]));
  return rules.every((rule) => {
    if (rule.type === "position")
      return rule.positions.some(
        (position) => values[position] === rule.tokenId,
      );
    const a = positions.get(rule.first),
      b = positions.get(rule.second);
    return (
      a !== undefined &&
      b !== undefined &&
      (rule.type === "before" ? a < b : b - a === 1)
    );
  });
}
export function activitySolutions(activity) {
  if(activity.kind === "singleChoice") return [{kind:activity.kind,tokenId:activity.answerId}];
  if(activity.kind === "matching") return [{kind:activity.kind,pairs:activity.expectedPairs}];
  if(activity.kind === "parentObservation") return [{kind:activity.kind,observations:Object.fromEntries(activity.observations.map(o=>[o.id,'supported']))}];
  if(activity.kind === "route") {
    const results=[];
    const walk=(node,ids,visited)=>{
      if(node===activity.end&&activity.requiredNodes.every(n=>visited.includes(n))&&activity.requiredEdges.every(e=>ids.includes(e))&&(activity.optimalLength===undefined||ids.length===activity.optimalLength))results.push({kind:'route',edgeIds:ids});
      if(ids.length>=activity.graph.edges.length||results.length>=64)return;
      for(const edge of activity.graph.edges)if(!ids.includes(edge.id)&&!activity.blockedEdges.includes(edge.id)&&(edge.from===node||edge.to===node)){const next=edge.from===node?edge.to:edge.from;walk(next,[...ids,edge.id],[...visited,next]);}
    };walk(activity.start,[],[activity.start]);return results;
  }
  if(activity.kind === "network") {
    let states=[{}];
    for(const e of activity.graph.edges)states=states.flatMap(s=>Array.from({length:(e.max??2)-(e.fixed??0)+1},(_,j)=>({...s,[e.id]:j+(e.fixed??0)})));
    return states.filter(counts=>{
      if(!activity.graph.nodes.every(n=>activity.graph.edges.filter(e=>e.from===n.id||e.to===n.id).reduce((sum,e)=>sum+counts[e.id],0)===n.degree))return false;
      const seen=new Set([activity.graph.nodes[0].id]);for(let i=0;i<activity.graph.nodes.length;i++)for(const e of activity.graph.edges)if(counts[e.id]&&(seen.has(e.from)||seen.has(e.to))){seen.add(e.from);seen.add(e.to);}return !activity.connected||seen.size===activity.graph.nodes.length;
    }).map(counts=>({kind:'network',counts}));
  }
  if(activity.kind === "construction") {
    const target=new Set(activity.target.map(p=>p.join(','))),placements=[];
    for(const piece of activity.pieces)for(let rotation=0;rotation<(activity.allowRotate?4:1);rotation++){
      let coords=piece.cells.map(p=>[...p]);for(let i=0;i<rotation;i++)coords=coords.map(([x,y,z])=>[-y,x,z]);
      const minX=Math.min(...coords.map(p=>p[0])),minY=Math.min(...coords.map(p=>p[1]));coords=coords.map(([x,y,z])=>[x-minX,y-minY,z]);
      for(let z=0;z<activity.layers;z++)for(let y=0;y<activity.rows;y++)for(let x=0;x<activity.columns;x++){
        const cells=coords.map(([a,b,c])=>[a+x,b+y,c+z].join(','));if(cells.every(p=>target.has(p)))placements.push({placement:{pieceId:piece.id,x,y,z,rotation},cells});
      }
    }
    const results=[];
    const cover=(used,occupied,response)=>{if(results.length>=32)return;if(occupied.size===target.size){if(used.size===activity.pieces.length)results.push({kind:'construction',placements:response});return;}const first=[...target].find(p=>!occupied.has(p));for(const p of placements)if(!used.has(p.placement.pieceId)&&p.cells.includes(first)&&p.cells.every(c=>!occupied.has(c)))cover(new Set([...used,p.placement.pieceId]),new Set([...occupied,...p.cells]),[...response,p.placement]);};
    cover(new Set(),new Set(),[]);return results;
  }
  if (activity.kind === "multiSelect")
    return [{ kind: "multiSelect", tokenIds: [...activity.expectedTokenIds] }];
  const filled = (id) => ({ state: "filled", tokenId: id });
  if (activity.kind === "orderedPlacement") {
    const sequences =
      activity.evaluation.kind === "sequence"
        ? [activity.evaluation.tokenIds]
        : permutations(activity.tokens.map((t) => t.id)).filter((values) =>
            orderSatisfies(values, activity.evaluation.rules),
          );
    return sequences.map((values) => ({
      kind: activity.kind,
      slots: values.map(filled),
    }));
  }
  if (activity.evaluation.kind === "exact")
    return [
      {
        kind: activity.kind,
        cells: Object.fromEntries(
          Object.entries(activity.evaluation.cells).map(([key, id]) => [
            key,
            filled(id),
          ]),
        ),
      },
    ];
  const rows = activity.cells.length / activity.columns;
  if (
    rows !== activity.columns ||
    activity.columns > 4 ||
    activity.evaluation.tokenIds.length !== activity.columns
  )
    return [];
  const rowOptions = permutations(activity.evaluation.tokenIds);
  let candidates = [[]];
  for (let row = 0; row < rows; row++) {
    candidates = candidates.flatMap((prefix) =>
      rowOptions
        .filter((values) =>
          values.every(
            (id, col) =>
              (activity.cells[row * activity.columns + col] === null ||
                activity.cells[row * activity.columns + col] === id) &&
              prefix.every((previous) => previous[col] !== id),
          ),
        )
        .map((values) => [...prefix, values]),
    );
  }
  return candidates.map((rows) => ({
    kind: activity.kind,
    cells: Object.fromEntries(
      rows
        .flat()
        .flatMap((id, index) =>
          activity.cells[index] === null ? [[`cell-${index}`, filled(id)]] : [],
        ),
    ),
  }));
}
