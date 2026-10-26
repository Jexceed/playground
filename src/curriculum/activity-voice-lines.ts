import { RULE_PLAY_COPY, cardFlipStepSpeech } from "../domain/rule-play";
import { BOARD_MOVE_COPY } from "../domain/board-move";
import { ISLAND_BRIDGE_COPY, islandRequirementSpeech } from "../domain/island-bridges";
import { ACTIVITY_COPY, activityPromptSpeech, pyramidMismatch } from "../domain/activity";
import type { ActivitySet } from "../domain/activity";

export function activityVoiceLines(sets: ActivitySet[]) {
  const lines: { kind: string; text: string; context: string; locale: string }[] = [];
  const add = (kind: string, text: string, context: string, locale="zh-CN") =>
    lines.push({ kind, text, context, locale });
  for(const text of ["先选一个答案，再看看。","还有一组关系没有连好。","从起点选一条路，试着走一走。","这条路能走通。再找找，有没有少走几段的路？","两座桥不能在河中间交叉。试着换一条连接。","还有小岛和大家没有连在一起。要能从一个岛走到所有岛。","还有部件没有摆上去。","部件超出方格了，换一个起点试试。","请家长为每一项选择这次观察到的情况。","这次亲子活动已经记录。下次可以换个条件再试试。"] )add('activity-system',text,'advanced');
  for (const [key, text] of Object.entries(RULE_PLAY_COPY)) add("activity-system", text, `rule-play/${key}`);
  for (const [key, text] of Object.entries(BOARD_MOVE_COPY)) add("activity-system", text, `board-move/${key}`);
  for (const [key, text] of Object.entries(ISLAND_BRIDGE_COPY)) add("activity-system", text, `island-bridges/${key}`);
  for (const [key, text] of Object.entries(ACTIVITY_COPY))
    add("activity-system", text, `activity/${key}`);
  for (const set of sets) {
    add("game-title", set.title, set.id);
    add("game-goal", set.goal, set.id);
    add("parent", set.parentPrompt, set.id);
    for (const activity of set.rounds) {
      const context = `${set.id}/${activity.id}`;
      add("prompt", activityPromptSpeech(activity), context);
      if (activity.kind === 'network') activity.graph.nodes.forEach(node => add('clue', islandRequirementSpeech(node), context));
      if (activity.presentation?.evidence?.kind === 'cardFlip')
        activity.presentation.evidence.steps.forEach((target, index) => add('clue', cardFlipStepSpeech(target, index), context));
      if (activity.presentation?.evidence?.kind === 'ruleMachine') add('prompt', activityPromptSpeech(activity, 'ready'), context);
      add("success", activity.success, context);
      add("retry", activity.retry, context);
      add("parent", activity.parentPrompt, context);
      if (activity.prerequisites) add("parent", activity.prerequisites, context);
      activity.hints.forEach((text) => add("hint", text, context));
      activity.clues.forEach((text) => add("clue", text, context));
      activity.tokens.forEach((token) => add("object", token.speechText ?? token.label, context));
      if (activity.kind === 'gridPlacement' && activity.presentation?.pyramid)
        activity.cells.forEach((_, index) => add('clue', pyramidMismatch(activity, index), context));
      if(activity.protocol.kind === "memory" && activity.protocol.audioText) add("stimulus",activity.protocol.audioText,context,activity.protocol.audioLocale??"zh-CN");
      if(activity.kind === "parentObservation") {
        activity.steps.forEach(text=>add("instruction",text,context));
        activity.observations.forEach(item=>add("parent",item.text,context));
        activity.materials.forEach(text=>add("parent",text,context));
      }
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
