import { ACTIVITY_COPY, activityPromptSpeech } from "../domain/activity";
import type { ActivitySet } from "../domain/activity";

export function activityVoiceLines(sets: ActivitySet[]) {
  const lines: { kind: string; text: string; context: string }[] = [];
  const add = (kind: string, text: string, context: string) =>
    lines.push({ kind, text, context });
  for (const [key, text] of Object.entries(ACTIVITY_COPY))
    add("activity-system", text, `activity/${key}`);
  for (const set of sets) {
    add("game-title", set.title, set.id);
    add("game-goal", set.goal, set.id);
    add("parent", set.parentPrompt, set.id);
    for (const activity of set.rounds) {
      const context = `${set.id}/${activity.id}`;
      add("prompt", activityPromptSpeech(activity), context);
      add("success", activity.success, context);
      add("retry", activity.retry, context);
      add("parent", activity.parentPrompt, context);
      activity.hints.forEach((text) => add("hint", text, context));
      activity.clues.forEach((text) => add("clue", text, context));
      activity.tokens.forEach((token) => add("object", token.label, context));
      if (activity.kind === "multiSelect" && activity.example)
        add("object", activity.example.label, context);
      if (
        activity.kind === "orderedPlacement" &&
        activity.evaluation.kind === "constraints"
      ) {
        activity.evaluation.rules.forEach((rule) =>
          add("clue", rule.text, context),
        );
      }
    }
  }
  return lines;
}
