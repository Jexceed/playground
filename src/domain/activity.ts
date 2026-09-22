import type { GalleryImage } from "../data/imageGallery";
import type { AbilityLevel, GameConfig, WorldId } from "../types";

export type ActivityToken = { id: string; label: string; image: GalleryImage };
export type SlotValue =
  | { state: "unfilled" }
  | { state: "filled"; tokenId: string };
export type ActivityResponse =
  | { kind: "multiSelect"; tokenIds: string[] }
  | { kind: "orderedPlacement"; slots: SlotValue[] }
  | { kind: "gridPlacement"; cells: Record<string, SlotValue> };

export type MemoryProtocol = {
  kind: "memory";
  observeMs: number;
  retainMs: number;
  /** Values in visible slot/cell order, not necessarily answer order. */
  preview: string[];
};
export type OrderRule =
  | { type: "before"; first: string; second: string; text: string }
  | { type: "immediatelyBefore"; first: string; second: string; text: string }
  | { type: "position"; tokenId: string; positions: number[]; text: string };

export type ActivityBase = {
  id: string;
  schemaVersion: 1;
  revision: number;
  primaryFamilyId: string;
  level: AbilityLevel;
  difficultyNote: string;
  prompt: string;
  instruction: string;
  clues: string[];
  tokens: ActivityToken[];
  hints: string[];
  success: string;
  retry: string;
  parentPrompt: string;
  abilityTags: string[];
  protocol: { kind: "practice" } | MemoryProtocol;
  sourceRefs: { sourceId: string; locator: string }[];
};
export type MultiSelectActivity = ActivityBase & {
  kind: "multiSelect";
  expectedTokenIds: string[];
  example?: ActivityToken;
};
export type OrderedActivity = ActivityBase & {
  kind: "orderedPlacement";
  slotCount: number;
  tokenUse: "once" | "unlimited";
  evaluation:
    | { kind: "sequence"; tokenIds: string[] }
    | { kind: "constraints"; rules: OrderRule[] };
};
export type GridActivity = ActivityBase & {
  kind: "gridPlacement";
  columns: number;
  /** null is an editable cell. A blank card has a real token ID. */
  cells: (string | null)[];
  tokenUse: "once" | "unlimited";
  evaluation:
    | { kind: "exact"; cells: Record<string, string> }
    | { kind: "latin"; tokenIds: string[] };
};
export type Activity = MultiSelectActivity | OrderedActivity | GridActivity;
export type ActivitySet = Omit<GameConfig, "kind" | "rounds"> & {
  kind: "activitySet";
  rounds: Activity[];
  interactionLabel: string;
};
export type CatalogGame = GameConfig | ActivitySet;
export type CatalogLocation = {
  schemaVersion: 1;
  worldId: WorldId;
  gameId: string;
  roundId: string;
};

export const ACTIVITY_COPY = {
  incomplete: "还有空位没有放好，再看一看。",
  invalid: "这次摆放没有对上，请重新放一放。",
  noHistory: "先试着放一张图卡吧。",
  ready: "准备好以后，点开始记忆。看清图卡的位置和顺序。",
  remember: "先在脑海里想一想。",
  recall: "现在把记住的图卡摆回来吧。",
  interrupted: "刚才暂停了。准备好以后，我们重新看一遍。",
  hintEnd: "线索都在这里了，试着一步一步检查。",
  latin: "再检查每一行和每一列，看看有没有重复或缺少的图卡。",
  once: "每张图卡只放一次，再检查一下。",
  selectFirst: "先选一张图卡，再点空位。",
} as const;

export function activityPromptSpeech(activity: Activity) {
  return [activity.prompt, activity.instruction, ...activity.clues]
    .join("。")
    .replace(/[。？！]。/g, "。");
}

export function activitySlots(
  activity: Activity,
): { id: string; index: number; fixedTokenId: string | null }[] {
  if (activity.kind === "multiSelect") return [];
  if (activity.kind === "orderedPlacement") {
    return Array.from({ length: activity.slotCount }, (_, index) => ({
      id: `slot-${index}`,
      index,
      fixedTokenId: null,
    }));
  }
  return activity.cells.map((fixedTokenId, index) => ({
    id: `cell-${index}`,
    index,
    fixedTokenId,
  }));
}
