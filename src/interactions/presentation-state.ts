import type { Activity } from "../domain/activity";

export function evidenceVisible(activity: Pick<Activity, "protocol">, phase: string): boolean {
  return activity.protocol.kind !== "memory" || phase === "observe";
}
