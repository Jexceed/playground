import type { Activity, ActivityResponse } from "../domain/activity";
import {
  emptyResponse,
  evaluateActivity,
  placeToken,
} from "../domain/activity-evaluation";
import type { EvaluationResult } from "../domain/activity-evaluation";
import { isAdvancedActivity } from "../domain/advanced-activity";

export type SessionPhase =
  | "ready"
  | "observe"
  | "retain"
  | "respond"
  | "complete";
type EvidenceDelta =
  | { kind: "attempt"; correct: boolean }
  | { kind: "observation"; observations: Record<string,"independent"|"supported"|"notYet"> }
  | { kind: "hint" | "reveal" | "restart" };
export type SessionEvidence = EvidenceDelta & { sequence: number };
export type ActivitySession = {
  phase: SessionPhase;
  response: ActivityResponse;
  history: ActivityResponse[];
  result: EvaluationResult | null;
  attempts: number;
  hints: number;
  reveals: number;
  restarts: number;
  evidence: SessionEvidence[];
};
export type SessionEvent =
  | { type: "response"; response: ActivityResponse }
  | { type: "toggle"; tokenId: string }
  | { type: "place"; slotId: string; tokenId: string | null }
  | {
      type:
        | "undo"
        | "clear"
        | "submit"
        | "hint"
        | "start"
        | "reveal"
        | "observationFinished"
        | "retentionFinished"
        | "interrupt"
        | "again";
    };

export function createSession(activity: Activity): ActivitySession {
  return {
    phase: activity.protocol.kind === "practice" ? "respond" : "ready",
    response: emptyResponse(activity),
    history: [],
    result: null,
    attempts: 0,
    hints: 0,
    reveals: 0,
    restarts: 0,
    evidence: [],
  };
}
function withEvidence(
  state: ActivitySession,
  event: EvidenceDelta,
): ActivitySession {
  return {
    ...state,
    evidence: [
      ...state.evidence,
      { ...event, sequence: state.evidence.length + 1 },
    ],
  };
}

export function transitionSession(
  activity: Activity,
  state: ActivitySession,
  event: SessionEvent,
): ActivitySession {
  if (event.type === "interrupt") {
    return state.phase === "observe" || state.phase === "retain"
      ? withEvidence(
          {
            ...state,
            phase: "ready",
            response: emptyResponse(activity),
            history: [],
            result: null,
            restarts: state.restarts + 1,
          },
          { kind: "restart" },
        )
      : state;
  }
  if (event.type === "again")
    return {
      ...createSession(activity),
      attempts: state.attempts,
      hints: state.hints,
      reveals: state.reveals,
      restarts: state.restarts,
      evidence: state.evidence,
    };
  if(event.type === "start" && state.phase === "ready" && activity.protocol.kind === "learnThenTransfer") return {...state,phase:"respond"};
  if (
    event.type === "start" &&
    state.phase === "ready" &&
    activity.protocol.kind === "memory"
  )
    return { ...state, phase: "observe", result: null };
  if (
    event.type === "reveal" &&
    state.phase === "respond" &&
    activity.protocol.kind === "memory"
  )
    return withEvidence(
      {
        ...state,
        phase: "observe",
        reveals: state.reveals + 1,
        response: emptyResponse(activity),
        history: [],
        result: null,
      },
      { kind: "reveal" },
    );
  if (
    event.type === "observationFinished" &&
    state.phase === "observe" &&
    activity.protocol.kind === "memory"
  )
    return {
      ...state,
      phase: activity.protocol.retainMs > 0 ? "retain" : "respond",
    };
  if (event.type === "retentionFinished" && state.phase === "retain")
    return { ...state, phase: "respond" };
  if (
    event.type === "hint" &&
    (state.phase === "respond" || state.phase === "ready")
  )
    return withEvidence({ ...state, hints: state.hints + 1 }, { kind: "hint" });
  if (state.phase !== "respond") return state;
  if (event.type === "submit") {
    const result = evaluateActivity(activity, state.response);
    const next: ActivitySession = {
      ...state,
      result,
      attempts: state.attempts + (result.status === "incomplete" || result.status === "needsParentObservation" ? 0 : 1),
      phase: result.status === "correct" || result.status === "needsParentObservation" ? "complete" : "respond",
    };
    if(result.status === "needsParentObservation" && state.response.kind === "parentObservation") return withEvidence(next,{kind:"observation",observations:state.response.observations});
    return result.status === "incomplete"
      ? next
      : withEvidence(next, {
          kind: "attempt",
          correct: result.status === "correct",
        });
  }
  if (event.type === "undo") {
    const previous = state.history[state.history.length - 1];
    return previous
      ? {
          ...state,
          response: previous,
          history: state.history.slice(0, -1),
          result: null,
        }
      : state;
  }
  let response = state.response;
  if(event.type === "response" && isAdvancedActivity(activity) && event.response.kind === activity.kind) response = event.response;
  if (event.type === "clear") response = emptyResponse(activity);
  if (event.type === "place")
    response = placeToken(activity, response, event.slotId, event.tokenId);
  if (
    event.type === "toggle" &&
    response.kind === "multiSelect" &&
    activity.tokens.some((token) => token.id === event.tokenId)
  ) {
    response = {
      ...response,
      tokenIds: response.tokenIds.includes(event.tokenId)
        ? response.tokenIds.filter((id) => id !== event.tokenId)
        : [...response.tokenIds, event.tokenId],
    };
  }
  if (JSON.stringify(response) === JSON.stringify(state.response)) return state;
  return {
    ...state,
    response,
    history: [...state.history.slice(-29), state.response],
    result: null,
  };
}
