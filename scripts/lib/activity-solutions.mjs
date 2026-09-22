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
