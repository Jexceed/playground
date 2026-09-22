import { ACTIVITY_COPY, activitySlots } from "./activity";
import type { Activity, ActivityResponse, SlotValue } from "./activity";
import { isAdvancedActivity, advancedEmpty, evaluateAdvanced } from "./advanced-activity";

export type EvaluationResult = {
  status: "incomplete" | "incorrect" | "correct" | "needsParentObservation";
  message: string;
  clueIndex?: number;
};
const unfilled = (): SlotValue => ({ state: "unfilled" });

export function emptyResponse(activity: Activity): ActivityResponse {
  if (isAdvancedActivity(activity)) return advancedEmpty(activity);
  switch (activity.kind) {
    case "multiSelect":
      return { kind: activity.kind, tokenIds: [] };
    case "orderedPlacement":
      return {
        kind: activity.kind,
        slots: Array.from({ length: activity.slotCount }, unfilled),
      };
    case "gridPlacement":
      return {
        kind: activity.kind,
        cells: Object.fromEntries(
          activitySlots(activity)
            .filter((s) => s.fixedTokenId === null)
            .map((s) => [s.id, unfilled()]),
        ),
      };
  }
}

export function responseValue(
  response: ActivityResponse,
  slotId: string,
): SlotValue {
  if (response.kind === "orderedPlacement")
    return response.slots[Number(slotId.replace("slot-", ""))] ?? unfilled();
  if (response.kind === "gridPlacement")
    return response.cells[slotId] ?? unfilled();
  return unfilled();
}

export function placeToken(
  activity: Activity,
  response: ActivityResponse,
  slotId: string,
  tokenId: string | null,
): ActivityResponse {
  if ((activity.kind !== "orderedPlacement" && activity.kind !== "gridPlacement") || response.kind !== activity.kind)
    return response;
  const slot = activitySlots(activity).find(
    (s) => s.id === slotId && s.fixedTokenId === null,
  );
  if (
    !slot ||
    (tokenId !== null && !activity.tokens.some((t) => t.id === tokenId))
  )
    return response;
  const next: SlotValue =
    tokenId === null ? unfilled() : { state: "filled", tokenId };
  if(tokenId!==null && typeof activity.tokenUse === 'object') {
    const used=activitySlots(activity).filter(s=>s.id!==slotId&&s.fixedTokenId===null).map(s=>responseValue(response,s.id)).filter(v=>v.state==='filled'&&v.tokenId===tokenId).length;
    if(used >= (activity.tokenUse.limits[tokenId]??0))return response;
  }
  if (response.kind === "orderedPlacement") {
    return {
      ...response,
      slots: response.slots.map((value, index) => {
        if (index === slot.index) return next;
        return activity.tokenUse === "once" &&
          tokenId !== null &&
          value.state === "filled" &&
          value.tokenId === tokenId
          ? unfilled()
          : value;
      }),
    };
  }
  if (response.kind === "gridPlacement") {
    return {
      ...response,
      cells: Object.fromEntries(
        Object.entries(response.cells).map(([id, value]) => {
          if (id === slotId) return [id, next];
          return [
            id,
            activity.tokenUse === "once" &&
            tokenId !== null &&
            value.state === "filled" &&
            value.tokenId === tokenId
              ? unfilled()
              : value,
          ];
        }),
      ),
    };
  }
  return response;
}

export function evaluateActivity(
  activity: Activity,
  response: ActivityResponse,
): EvaluationResult {
  if (isAdvancedActivity(activity)) return evaluateAdvanced(activity, response);
  const wrong = (
    message = activity.retry,
    clueIndex?: number,
  ): EvaluationResult => ({ status: "incorrect", message, clueIndex });
  const correct = (): EvaluationResult => ({
    status: "correct",
    message: activity.success,
  });
  if (activity.kind !== response.kind) return wrong(ACTIVITY_COPY.invalid);
  const known = new Set(activity.tokens.map((t) => t.id));
  if (activity.kind === "multiSelect" && response.kind === "multiSelect") {
    const selected = new Set(response.tokenIds);
    if (
      selected.size !== response.tokenIds.length ||
      response.tokenIds.some((id) => !known.has(id))
    )
      return wrong(ACTIVITY_COPY.invalid);
    return selected.size === activity.expectedTokenIds.length &&
      activity.expectedTokenIds.every((id) => selected.has(id))
      ? correct()
      : wrong();
  }
  const slots = activitySlots(activity).filter((s) => s.fixedTokenId === null);
  const values = slots.map((slot) => responseValue(response, slot.id));
  if (values.some((v) => v.state === "unfilled"))
    return { status: "incomplete", message: ACTIVITY_COPY.incomplete };
  const ids = values.map((v) => (v.state === "filled" ? v.tokenId : ""));
  if (ids.some((id) => !known.has(id))) return wrong(ACTIVITY_COPY.invalid);
  if(activity.kind !== 'multiSelect' && typeof activity.tokenUse === 'object' && ids.some(id=>ids.filter(value=>value===id).length>((activity.tokenUse as {limits:Record<string,number>}).limits[id]??0)))return wrong(ACTIVITY_COPY.inventory);
  if (
    activity.kind !== "multiSelect" &&
    activity.tokenUse === "once" &&
    new Set(ids).size !== ids.length
  )
    return wrong(ACTIVITY_COPY.once);
  if (
    activity.kind === "orderedPlacement" &&
    response.kind === "orderedPlacement"
  ) {
    if (response.slots.length !== activity.slotCount)
      return wrong(ACTIVITY_COPY.invalid);
    if (activity.evaluation.kind === "sequence") {
      const expected = activity.evaluation.tokenIds;
      return ids.length === expected.length &&
        ids.every((id, i) => id === expected[i])
        ? correct()
        : wrong();
    }
    for (const [index, rule] of activity.evaluation.rules.entries()) {
      const valid =
        rule.type === "position"
          ? rule.positions.includes(ids.indexOf(rule.tokenId))
          : ids.includes(rule.first) &&
            ids.includes(rule.second) &&
            (rule.type === "before"
              ? ids.indexOf(rule.first) < ids.indexOf(rule.second)
              : ids.indexOf(rule.first) + 1 === ids.indexOf(rule.second));
      if (!valid) return wrong(rule.text, index);
    }
    return correct();
  }
  if (activity.kind === "gridPlacement" && response.kind === "gridPlacement") {
    if (Object.keys(response.cells).length !== slots.length)
      return wrong(ACTIVITY_COPY.invalid);
    if (activity.evaluation.kind === "exact") {
      const expected = activity.evaluation.cells;
      return slots.every((slot, index) => ids[index] === expected[slot.id])
        ? correct()
        : wrong();
    }
    const expected = new Set(activity.evaluation.tokenIds);
    const cells = activity.cells.map(
      (fixed, index) =>
        fixed ??
        (
          responseValue(response, `cell-${index}`) as {
            state: "filled";
            tokenId: string;
          }
        ).tokenId,
    );
    const rows = cells.length / activity.columns;
    const matches = (line: string[]) =>
      line.length === expected.size &&
      new Set(line).size === expected.size &&
      line.every((id) => expected.has(id));
    if (!Number.isInteger(rows)) return wrong(ACTIVITY_COPY.invalid);
    for (let row = 0; row < rows; row++)
      if (
        !matches(
          cells.slice(row * activity.columns, (row + 1) * activity.columns),
        )
      )
        return wrong(ACTIVITY_COPY.latin);
    for (let col = 0; col < activity.columns; col++)
      if (
        !matches(
          Array.from(
            { length: rows },
            (_, row) => cells[row * activity.columns + col],
          ),
        )
      )
        return wrong(ACTIVITY_COPY.latin);
    return correct();
  }
  return wrong(ACTIVITY_COPY.invalid);
}
