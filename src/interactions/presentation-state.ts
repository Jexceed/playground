import type { Activity } from "../domain/activity";

export function evidenceVisible(activity: Pick<Activity, "protocol">, phase: string): boolean {
  return activity.protocol.kind !== "memory" || phase === "observe";
}

/** A choice must be completed before its model conversation can reveal the answer. */
export function dialogueVisible(activity: Pick<Activity, "kind" | "presentation">, phase: string, parentMode: "play" | "record"): boolean {
  return Boolean(activity.presentation?.dialogue?.length) &&
    (activity.kind === "parentObservation" ? parentMode === "play" : phase === "complete");
}

export function responsesVisible(activity: Pick<Activity, "kind" | "presentation">, phase: string): boolean {
  if (phase === "respond") return true;
  if (phase !== "complete") return false;
  // The model conversation replaces spent choices, keeping the scene and feedback in view.
  return !(activity.kind === "singleChoice" && activity.presentation?.dialogue?.length);
}
